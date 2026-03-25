#!/usr/bin/env python3
"""
download_bdc_api.py — FCC BDC data download for Midwest fiber providers.

Downloads Fixed Broadband Location Coverage CSVs for:
  - Surf Internet (Surf Air Wireless, LLC)
  - Ezee Fiber (Ezee Fiber Texas, LLC)
  - MetroNet
  - AT&T (Ameritech legacy)

Target states: Indiana (18), Illinois (17), Michigan (26)

Uses curl for HTTP (Python urllib times out on FCC's API).

Usage:
  python3 download_bdc_api.py                    # uses .env file
  python3 download_bdc_api.py --list-only         # just list available files
  python3 download_bdc_api.py --force             # re-download everything

Credentials: .env file or pass --username / --token
"""

import argparse
import json
import os
import subprocess
import sys
import time
import zipfile
from pathlib import Path
from urllib.parse import urlencode

# ============================================
# CONFIGURATION
# ============================================

BASE_URL = 'https://bdc.fcc.gov'
AS_OF_DATE = '2025-06-30'  # Latest availability filing (J25)

# Target providers — update IDs after running --list-only
# These are placeholders; run with --list-only to find exact provider IDs
TARGET_PROVIDERS = {
    # Surf Internet / Surf Air Wireless — search BDC provider list for exact ID
    # '??????': 'Surf Internet',
    # Ezee Fiber — search BDC provider list for exact ID
    # '??????': 'Ezee Fiber',
    # MetroNet — likely in BDC
    # '??????': 'MetroNet',
    # AT&T / BellSouth / Ameritech
    '130077': 'AT&T',
    # Frontier
    '130258': 'Frontier',
    # Charter/Spectrum
    '130235': 'Charter/Spectrum',
    # Comcast
    '130360': 'Comcast',
}

# Target state FIPS codes
TARGET_STATES = {'17', '18', '26'}  # IL, IN, MI

RATE_LIMIT_DELAY = 6.5  # seconds between API calls

SCRIPT_DIR = Path(__file__).parent
FCC_DATA_DIR = SCRIPT_DIR / 'fcc_data'
ENV_FILE = Path('/Users/vikramnidamaluri/Desktop/Claude Hub/projects/Overlap_Analysis/.env')


def load_credentials(args):
    """Load FCC credentials from args or .env file."""
    username = getattr(args, 'username', None)
    token = getattr(args, 'token', None)

    if not username or not token:
        for env_path in [ENV_FILE, SCRIPT_DIR / '.env']:
            if env_path.exists():
                with open(env_path) as f:
                    for line in f:
                        line = line.strip()
                        if line.startswith('#') or '=' not in line:
                            continue
                        key, val = line.split('=', 1)
                        key = key.strip()
                        val = val.strip().strip('"').strip("'")
                        if key == 'FCC_USERNAME':
                            username = val
                        elif key == 'FCC_TOKEN':
                            token = val
                if username and token:
                    break

    if not username or not token:
        print("[ERROR] FCC credentials not found.")
        print(f"  Create .env with FCC_USERNAME and FCC_TOKEN")
        sys.exit(1)

    return username, token


def api_get(url, username, token, timeout=120):
    """GET JSON from FCC API using curl."""
    result = subprocess.run(
        ['curl', '-s', '--max-time', str(timeout),
         '-H', f'username: {username}',
         '-H', f'hash_value: {token}',
         url],
        capture_output=True, text=True
    )
    if result.returncode != 0:
        raise RuntimeError(f"curl failed (exit {result.returncode}): {result.stderr}")
    return json.loads(result.stdout)


def api_download(url, username, token, output_path, timeout=600):
    """Download file from FCC API using curl."""
    header_file = str(output_path) + '.headers'
    result = subprocess.run(
        ['curl', '-s', '--max-time', str(timeout),
         '-H', f'username: {username}',
         '-H', f'hash_value: {token}',
         '-D', header_file,
         '-o', str(output_path),
         url],
        capture_output=True, text=True
    )
    if result.returncode != 0:
        raise RuntimeError(f"curl failed (exit {result.returncode}): {result.stderr}")

    actual_path = output_path
    if os.path.exists(header_file):
        with open(header_file) as f:
            for line in f:
                if 'filename=' in line.lower():
                    fname = line.split('filename=')[1].strip().strip('"').strip("'").strip()
                    if fname:
                        actual_path = output_path.parent / fname
                        if actual_path != output_path:
                            os.rename(output_path, actual_path)
                    break
        os.remove(header_file)

    size = actual_path.stat().st_size if actual_path.exists() else 0
    return actual_path, size


def list_available_files(username, token):
    """List all Fixed Broadband files for target providers and states."""
    print(f"[1/3] Querying available files for as_of_date={AS_OF_DATE}...")

    params = urlencode({
        'category': 'Provider',
        'subcategory': 'Location Coverage',
        'technology_type': 'Fixed Broadband',
    })
    url = f'{BASE_URL}/api/public/map/downloads/listAvailabilityData/{AS_OF_DATE}?{params}'

    data = api_get(url, username, token, timeout=180)

    if data.get('status') != 'successful':
        print(f"[ERROR] API returned: {data.get('message', 'Unknown error')}")
        sys.exit(1)

    total = data.get('result_count', 0)
    print(f"  Total Fixed Broadband files: {total}")

    # Filter to target providers AND target states
    target_files = []
    for item in data.get('data', []):
        pid = item.get('provider_id', '')
        state_fips = item.get('state_fips', '')
        if pid in TARGET_PROVIDERS and state_fips in TARGET_STATES:
            target_files.append(item)

    print(f"  Files matching providers + states (IL/IN/MI): {len(target_files)}")
    return target_files, data.get('data', [])


def search_providers(all_files, search_term):
    """Search all BDC files for a provider name."""
    matches = {}
    for item in all_files:
        pname = item.get('provider_name', '')
        pid = item.get('provider_id', '')
        if search_term.lower() in pname.lower():
            if pid not in matches:
                matches[pid] = pname
    return matches


def download_files(target_files, username, token, force=False):
    """Download all target files."""
    FCC_DATA_DIR.mkdir(parents=True, exist_ok=True)

    if not force:
        needed = []
        for item in target_files:
            state_fips = item.get('state_fips', '')
            pid = item.get('provider_id', '')
            existing = list(FCC_DATA_DIR.glob(f"bdc_{state_fips}_{pid}_*.csv"))
            if not existing:
                needed.append(item)
            else:
                print(f"  Already have: {state_fips}/{TARGET_PROVIDERS.get(pid, pid)}")
    else:
        needed = target_files

    if not needed:
        print("\n  All files already downloaded!")
        return

    print(f"\n[2/3] Downloading {len(needed)} files...")
    downloaded = 0

    for i, item in enumerate(needed):
        file_id = item.get('file_id')
        state = item.get('state_name', '?')
        state_fips = item.get('state_fips', '??')
        pid = item.get('provider_id', '')
        pname = TARGET_PROVIDERS.get(pid, pid)
        records = item.get('record_count', '?')

        print(f"  [{i+1}/{len(needed)}] {state} / {pname} ({records} records)...", end=' ', flush=True)

        try:
            output_name = f"bdc_{state_fips}_{pid}_download.zip"
            url = f'{BASE_URL}/api/public/map/downloads/downloadFile/availability/{file_id}'
            target_path, size_bytes = api_download(url, username, token, FCC_DATA_DIR / output_name)
            print(f"OK ({size_bytes / 1e6:.1f} MB)")
            downloaded += 1
        except Exception as e:
            print(f"FAILED: {e}")

        if i < len(needed) - 1:
            time.sleep(RATE_LIMIT_DELAY)

    print(f"\n[3/3] Done. Downloaded {downloaded}/{len(needed)} files.")

    # Unzip
    for zf in FCC_DATA_DIR.glob('*.zip'):
        try:
            with zipfile.ZipFile(zf, 'r') as z:
                z.extractall(FCC_DATA_DIR)
            print(f"  Unzipped: {zf.name}")
            zf.unlink()
        except Exception as e:
            print(f"  Unzip failed: {zf.name}: {e}")


def main():
    global AS_OF_DATE

    parser = argparse.ArgumentParser(description='Download FCC BDC data for Midwest fiber analysis')
    parser.add_argument('--username', help='FCC username')
    parser.add_argument('--token', help='FCC API token')
    parser.add_argument('--list-only', action='store_true', help='List available files')
    parser.add_argument('--force', action='store_true', help='Re-download')
    parser.add_argument('--search', help='Search for a provider name in BDC data')
    parser.add_argument('--as-of-date', default=AS_OF_DATE)
    args = parser.parse_args()

    AS_OF_DATE = args.as_of_date

    print("=" * 70)
    print("FCC BDC Downloader — Midwest Fiber (Surf/Ezee/MetroNet/AT&T)")
    print(f"Target states: IL (17), IN (18), MI (26)")
    print(f"As-of date: {AS_OF_DATE}")
    print("=" * 70)

    username, token = load_credentials(args)
    print(f"  Authenticated as: {username}")

    target_files, all_files = list_available_files(username, token)

    # Search mode — find provider IDs
    if args.search:
        print(f"\n  Searching for '{args.search}'...")
        matches = search_providers(all_files, args.search)
        if matches:
            for pid, pname in sorted(matches.items()):
                print(f"    Provider ID: {pid} -> {pname}")
        else:
            print("    No matches found.")
        return

    if not target_files:
        print("[WARN] No files for current TARGET_PROVIDERS in target states.")
        print("  Use --search 'Surf' to find the correct provider ID.")
        return

    # Print summary
    print(f"\n{'='*70}")
    for item in target_files:
        pid = item.get('provider_id', '')
        pname = TARGET_PROVIDERS.get(pid, pid)
        state = item.get('state_name', '?')
        records = item.get('record_count', '?')
        print(f"  {state:20s} {pname:25s} {records:>10} records")

    if args.list_only:
        print("\n  --list-only mode.")
        return

    download_files(target_files, username, token, force=args.force)


if __name__ == '__main__':
    main()
