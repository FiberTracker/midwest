#!/usr/bin/env python3
"""Build BDC GeoJSON files for Surf Internet (IL/IN/MI) + Ezee planned areas."""

import csv
import json
import os
import time
from collections import defaultdict
from pathlib import Path
from urllib.request import urlopen

# Layer 8 = Census 2020 Block Groups (has HU100, POP100)
# Layer 10 = ACS2023 Block Groups (does NOT have HU100/POP100)
TIGER_URL = "https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/tigerWMS_Census2020/MapServer/8/query"
COORD_DECIMALS = 4
MIDWEST = {"17", "18", "26"}
STATE_NAMES = {"17": "Illinois", "18": "Indiana", "26": "Michigan"}
SCRIPT_DIR = Path(__file__).parent


def round_coords(geojson_geom):
    def _round(coords):
        if isinstance(coords, (int, float)):
            return round(coords, COORD_DECIMALS)
        elif isinstance(coords, (list, tuple)):
            return [_round(c) for c in coords]
        return coords
    result = dict(geojson_geom)
    if "coordinates" in result:
        result["coordinates"] = _round(result["coordinates"])
    return result


def read_surf_bdc():
    """Read Surf Internet FTTP BSLs from BDC CSVs."""
    print("Reading Surf Internet BDC data...")
    bgs = defaultdict(lambda: {"bsls": 0})
    for f in sorted((SCRIPT_DIR / "fcc_data").glob("*_310066_*.csv")):
        count = 0
        with open(f) as fh:
            reader = csv.DictReader(fh)
            for row in reader:
                if int(row["technology"]) == 50:
                    bg = row["block_geoid"][:12]
                    if bg[:2] in MIDWEST:
                        bgs[bg]["bsls"] += 1
                        count += 1
        print("  %s: %s FTTP BSLs" % (f.name, f"{count:,}"))
    total = sum(d["bsls"] for d in bgs.values())
    print("  Total: %s BSLs in %d block groups" % (f"{total:,}", len(bgs)))
    return dict(bgs)


def fetch_polygons(geoid_set):
    """Fetch block group polygons from TIGERweb."""
    print("\nFetching TIGERweb polygons for %d block groups..." % len(geoid_set))

    by_county = defaultdict(set)
    for g in geoid_set:
        by_county[g[:5]].add(g)

    cache = {}
    total = 0
    counties = sorted(by_county.keys())

    for ci, county in enumerate(counties):
        state = county[:2]
        ccode = county[2:]
        needed = by_county[county]

        where = "STATE='" + state + "'+AND+COUNTY='" + ccode + "'"
        url = (TIGER_URL + "?where=" + where +
               "&outFields=GEOID,AREALAND,HU100,POP100" +
               "&f=geojson&outSR=4326&returnGeometry=true")
        # urlopen requires no literal spaces — use + for spaces in query params

        try:
            if ci == 0:
                print("  DEBUG URL:", repr(url[:150]))
            with urlopen(url, timeout=60) as resp:
                raw = resp.read()
                data = json.loads(raw)
                if ci == 0:
                    n_feats = len(data.get("features", []))
                    print("  DEBUG response keys:", list(data.keys()), "features:", n_feats)
                    if "error" in data:
                        print("  DEBUG error:", data["error"])
                    if n_feats > 0:
                        print("  DEBUG first:", data["features"][0]["properties"])
                    elif n_feats == 0:
                        print("  DEBUG raw[:300]:", raw[:300])

            for feat in data.get("features", []):
                geoid = feat["properties"]["GEOID"]
                if geoid in needed and feat.get("geometry"):
                    cache[geoid] = {
                        "geometry": round_coords(feat["geometry"]),
                        "arealand": feat["properties"].get("AREALAND", 0),
                        "hu100": feat["properties"].get("HU100", 0),
                        "pop100": feat["properties"].get("POP100", 0),
                    }
                    total += 1
        except Exception as e:
            print("  [WARN] County %s: %s" % (county, e))

        time.sleep(0.25)
        if (ci + 1) % 10 == 0:
            sn = STATE_NAMES.get(county[:2], county[:2])
            print("  [%d/%d] %d polygons (%s)" % (ci + 1, len(counties), total, sn))

    print("  Done: %d polygons fetched" % total)
    return cache


def build_geojson(bgs, polygons):
    """Build GeoJSON FeatureCollection."""
    features = []
    for geoid in sorted(bgs.keys()):
        cached = polygons.get(geoid)
        if not cached:
            continue
        area_km2 = float(cached["arealand"] or 0) / 1e6
        density = (bgs[geoid]["bsls"] / area_km2) if area_km2 > 0 else 0
        hu100 = cached.get("hu100", 0) or 0
        pop100 = cached.get("pop100", 0) or 0
        coverage_pct = round(bgs[geoid]["bsls"] / hu100 * 100, 1) if hu100 > 0 else 0
        features.append({
            "type": "Feature",
            "properties": {
                "id": geoid,
                "bsls": bgs[geoid]["bsls"],
                "state": geoid[:2],
                "county": geoid[:5],
                "hu100": int(hu100),
                "pop100": int(pop100),
                "coveragePct": min(coverage_pct, 100),
                "density": round(density, 1),
            },
            "geometry": cached["geometry"],
        })
    return {"type": "FeatureCollection", "features": features}


def main():
    print("=" * 60)
    print("Surf Internet + Ezee Fiber BDC Pipeline")
    print("=" * 60)

    # Surf
    surf_bgs = read_surf_bdc()
    polygons = fetch_polygons(set(surf_bgs.keys()))

    geojson = build_geojson(surf_bgs, polygons)
    outdir = SCRIPT_DIR / "bdc_output"
    outdir.mkdir(exist_ok=True)

    surf_file = outdir / "surf_bdc.js"
    with open(surf_file, "w") as f:
        f.write("var SURF_BDC_COVERAGE = ")
        json.dump(geojson, f, separators=(",", ":"))
        f.write(";\n")

    size_mb = os.path.getsize(surf_file) / 1e6
    n = len(geojson["features"])
    bsl_total = sum(ft["properties"]["bsls"] for ft in geojson["features"])
    print("\nSurf: %d block groups, %s BSLs -> surf_bdc.js (%.1f MB)" % (n, f"{bsl_total:,}", size_mb))

    # Print by-state summary
    by_state = defaultdict(lambda: {"bgs": 0, "bsls": 0})
    for ft in geojson["features"]:
        st = ft["properties"]["state"]
        by_state[st]["bgs"] += 1
        by_state[st]["bsls"] += ft["properties"]["bsls"]
    for st in sorted(by_state):
        sn = STATE_NAMES.get(st, st)
        print("  %s: %d block groups, %s BSLs" % (sn, by_state[st]["bgs"], f"{by_state[st]['bsls']:,}"))

    # Ezee placeholder (not in BDC yet — builds started Jan 2026)
    ezee_file = outdir / "ezee_bdc.js"
    with open(ezee_file, "w") as f:
        f.write('var EZEE_BDC_COVERAGE = {"type":"FeatureCollection","features":[]};\n')
    print("\nEzee: Not in FCC BDC for Midwest yet (builds started Jan 2026)")

    print("\nDONE")


if __name__ == "__main__":
    main()
