#!/usr/bin/env python3
"""
process_bdc.py — FCC BDC CSV -> GeoJSON JS files for Midwest fiber GIS tool.

Usage:
  1. Run download_bdc_api.py to get CSVs
  2. Run: python3 process_bdc.py

Outputs JS files to bdc_output/ — one per provider.
Each file defines: var PROVIDER_BDC_COVERAGE = {GeoJSON FeatureCollection}

Requirements: pip install shapely requests
"""

import csv
import json
import os
import sys
import time
from collections import defaultdict
from pathlib import Path
from urllib.request import urlopen, Request
from urllib.parse import urlencode

try:
    from shapely.geometry import shape, mapping
    HAS_SHAPELY = True
except ImportError:
    HAS_SHAPELY = False
    print("[WARN] shapely not installed. pip install shapely")

# ============================================
# CONFIGURATION
# ============================================

# Update these after running download_bdc_api.py --search
# to find the correct FCC provider IDs
PROVIDER_MAP = {
    # Surf Internet (Surf Air Wireless)
    # '??????': {'var': 'SURF_BDC_COVERAGE', 'file': 'surf_bdc.js', 'name': 'Surf Internet'},
    # Ezee Fiber
    # '??????': {'var': 'EZEE_BDC_COVERAGE', 'file': 'ezee_bdc.js', 'name': 'Ezee Fiber'},
    # AT&T
    '130077': {'var': 'ATT_BDC_COVERAGE', 'file': 'att_bdc.js', 'name': 'AT&T Fiber'},
    # MetroNet — find ID via search
    # '??????': {'var': 'METRONET_BDC_COVERAGE', 'file': 'metronet_bdc.js', 'name': 'MetroNet'},
}

# Target states
TARGET_STATE_FIPS = {'17', '18', '26'}  # IL, IN, MI

TECH_FTTP = 50
SIMPLIFY_TOLERANCE = 0.002
COORD_DECIMALS = 4
TIGER_BATCH_SIZE = 50
TIGER_URL = 'https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/tigerWMS_ACS2023/MapServer/10/query'

SCRIPT_DIR = Path(__file__).parent
FCC_DATA_DIR = SCRIPT_DIR / 'fcc_data'
BDC_OUTPUT_DIR = SCRIPT_DIR / 'bdc_output'

POLYGON_CACHE = {}


def find_csv_files():
    if not FCC_DATA_DIR.exists():
        print(f"[ERROR] fcc_data/ not found. Run download_bdc_api.py first.")
        sys.exit(1)
    csvs = list(FCC_DATA_DIR.glob('*.csv'))
    if not csvs:
        print(f"[ERROR] No CSV files in fcc_data/")
        sys.exit(1)
    print(f"[INFO] Found {len(csvs)} CSV file(s)")
    for f in csvs:
        print(f"  - {f.name} ({f.stat().st_size / 1e6:.1f} MB)")
    return csvs


def detect_provider_id(csv_path):
    name = csv_path.stem.lower()
    parts = name.split('_')
    for i, p in enumerate(parts):
        if p in TARGET_STATE_FIPS and i + 1 < len(parts):
            candidate = parts[i + 1]
            if candidate.isdigit():
                return candidate
    with open(csv_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            pid = row.get('provider_id', row.get('frn', ''))
            if pid:
                return str(pid)
            break
    return None


def read_bdc_csv(csv_path):
    print(f"\n[STEP 1] Reading {csv_path.name}...")
    block_groups = defaultdict(lambda: {'bsls': 0, 'blocks': set()})
    total_rows = 0
    fttp_rows = 0

    with open(csv_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        fieldnames = reader.fieldnames
        tech_col = 'technology' if 'technology' in fieldnames else 'technology_code'
        geoid_col = 'block_geoid' if 'block_geoid' in fieldnames else 'census_block_geoid'

        for row in reader:
            total_rows += 1
            tech = int(row.get(tech_col, 0))
            if tech != TECH_FTTP:
                continue
            fttp_rows += 1
            geoid = row.get(geoid_col, '')
            if not geoid:
                continue
            bg_geoid = geoid[:12]
            state_fips = bg_geoid[:2]
            if state_fips not in TARGET_STATE_FIPS:
                continue
            block_groups[bg_geoid]['bsls'] += 1
            block_groups[bg_geoid]['blocks'].add(geoid[:15])

    for bg in block_groups.values():
        bg['blocks'] = len(bg['blocks'])

    print(f"  Total rows: {total_rows:,}")
    print(f"  FTTP rows: {fttp_rows:,}")
    print(f"  Block groups: {len(block_groups):,}")
    return dict(block_groups)


def fetch_tiger_polygons(geoids):
    print(f"\n[STEP 2] Fetching polygons for {len(geoids)} block groups...")
    uncached = [g for g in geoids if g not in POLYGON_CACHE]
    if not uncached:
        return

    by_county = defaultdict(list)
    for g in uncached:
        by_county[g[:5]].append(g)

    total_fetched = 0
    for county, county_geoids in by_county.items():
        state_fips = county[:2]
        county_code = county[2:]

        for i in range(0, len(county_geoids), TIGER_BATCH_SIZE):
            batch = county_geoids[i:i + TIGER_BATCH_SIZE]
            geoid_list = "','".join(batch)
            params = {
                'where': f"STATE='{state_fips}' AND COUNTY='{county_code}' AND GEOID IN ('{geoid_list}')",
                'outFields': 'GEOID,AREALAND',
                'f': 'geojson',
                'outSR': '4326',
            }
            url = TIGER_URL + '?' + urlencode(params)
            try:
                req = Request(url, headers={'User-Agent': 'MidwestFiberGIS/1.0'})
                with urlopen(req, timeout=30) as resp:
                    data = json.loads(resp.read())
                if 'features' in data:
                    for feature in data['features']:
                        geoid = feature['properties'].get('GEOID', '')
                        if geoid and feature.get('geometry'):
                            geom = simplify_geometry(feature['geometry'])
                            POLYGON_CACHE[geoid] = {
                                'geometry': geom,
                                'arealand': feature['properties'].get('AREALAND', 0),
                            }
                            total_fetched += 1
                print(f"  County {county}: {len(data.get('features', []))} polygons")
            except Exception as e:
                print(f"  [WARN] County {county}: {e}")
            time.sleep(0.3)

    print(f"  Total fetched: {total_fetched}, Cache: {len(POLYGON_CACHE)}")


def simplify_geometry(geojson_geom):
    if HAS_SHAPELY:
        try:
            geom = shape(geojson_geom)
            simplified = geom.simplify(SIMPLIFY_TOLERANCE, preserve_topology=True)
            return round_coords(mapping(simplified))
        except Exception:
            pass
    return round_coords(geojson_geom)


def round_coords(geojson_geom):
    def _round(coords):
        if isinstance(coords, (int, float)):
            return round(coords, COORD_DECIMALS)
        elif isinstance(coords, (list, tuple)):
            return [_round(c) for c in coords]
        return coords
    result = dict(geojson_geom)
    if 'coordinates' in result:
        result['coordinates'] = _round(result['coordinates'])
    return result


def build_geojson(block_groups, provider_name):
    features = []
    for geoid, data in sorted(block_groups.items()):
        cached = POLYGON_CACHE.get(geoid)
        if not cached:
            continue
        area_sq_km = cached.get('arealand', 0) / 1e6
        density = (data['bsls'] / area_sq_km) if area_sq_km > 0 else 0
        feature = {
            'type': 'Feature',
            'properties': {
                'id': geoid,
                'bsls': data['bsls'],
                'blocks': data['blocks'],
                'state': geoid[:2],
                'county': geoid[:5],
                'areaLandSqKm': round(area_sq_km, 2),
                'density': round(density, 1),
            },
            'geometry': cached['geometry'],
        }
        features.append(feature)
    return {'type': 'FeatureCollection', 'features': features}


def write_js_file(geojson, provider_config):
    BDC_OUTPUT_DIR.mkdir(exist_ok=True)
    filepath = BDC_OUTPUT_DIR / provider_config['file']
    js_content = f"var {provider_config['var']} = {json.dumps(geojson, separators=(',', ':'))};\n"
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(js_content)
    size_mb = os.path.getsize(filepath) / 1e6
    print(f"  Written: {filepath.name} ({size_mb:.1f} MB, {len(geojson['features'])} features)")


def main():
    print("=" * 60)
    print("Midwest FTTH — FCC BDC -> GeoJSON Pipeline")
    print("=" * 60)

    csv_files = find_csv_files()
    all_geoids = set()
    provider_data = {}

    for csv_path in csv_files:
        provider_id = detect_provider_id(csv_path)
        if not provider_id:
            print(f"\n[WARN] Can't detect provider ID for {csv_path.name}")
            continue
        config = PROVIDER_MAP.get(provider_id)
        if not config:
            print(f"\n[INFO] Provider {provider_id} not in PROVIDER_MAP. Add it:")
            print(f"  '{provider_id}': {{'var': 'X_BDC_COVERAGE', 'file': 'x_bdc.js', 'name': 'X'}},")
            continue
        block_groups = read_bdc_csv(csv_path)
        all_geoids.update(block_groups.keys())
        provider_data[provider_id] = {'block_groups': block_groups, 'config': config}

    if not provider_data:
        print("\n[ERROR] No provider data to process.")
        sys.exit(1)

    fetch_tiger_polygons(list(all_geoids))

    print(f"\n[STEP 3] Building GeoJSON...")
    for provider_id, pdata in provider_data.items():
        geojson = build_geojson(pdata['block_groups'], pdata['config']['name'])
        write_js_file(geojson, pdata['config'])

    print(f"\n{'=' * 60}")
    print(f"DONE. Output in {BDC_OUTPUT_DIR}/")
    print(f"{'=' * 60}")


if __name__ == '__main__':
    main()
