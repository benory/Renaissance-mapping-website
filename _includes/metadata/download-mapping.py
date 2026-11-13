#!/usr/bin/env python3
"""Refresh Mapping metadata with column names from the live sheets."""

import argparse
import fcntl
from pathlib import Path
import sys


def fetch_tables(sheets, config, selected):
    tables = {}
    columns_by_table = {}
    for table in config["tables"]:
        name = table["name"]
        if selected and name != selected:
            continue
        print(f"Downloading {name} directly from Sheets…", flush=True)
        raw = sheets.download(sheets.csv_url(table))
        if name in {"Headers", "Targets"}:
            rows = sheets.table_rows(table, raw)
        else:
            csv = sheets.csv_rows(raw)
            start = table["header_row"] - 1
            if start >= len(csv):
                raise ValueError(f"{name}: missing header row")
            columns = [cell.strip() for cell in csv[start]]
            indices = [index for index, column in enumerate(columns) if column]
            named_columns = [columns[index] for index in indices]
            if not named_columns or len(named_columns) != len(set(named_columns)):
                raise ValueError(f"{name}: expected nonempty, unique column names")
            table = {**table, "columns": named_columns}
            columns_by_table[name] = set(named_columns)
            rows = [[row[index] if index < len(row) else "" for index in indices]
                    for row in csv[start:]]
        tables[name] = sheets.records_from_rows(table, rows)

    if not selected:
        validate_mappings(tables["Headers"], columns_by_table)
    return tables


def validate_mappings(headers, columns_by_table):
    seen = set()
    for row in headers:
        name = row.get("Spreadsheet Name")
        short_name = row.get("JavaScript Name")
        if name not in columns_by_table or not short_name:
            continue
        column = row.get("Column Name")
        if column not in columns_by_table[name]:
            raise ValueError(f"{name}: Headers maps {short_name} to missing column {column!r}")
        key = (row.get("Spreadsheet ID"), short_name)
        if key in seen:
            raise ValueError(f"{name}: duplicate Headers mapping for {':'.join(part or '' for part in key)}")
        seen.add(key)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--sheet-tools", type=Path, required=True)
    parser.add_argument("--website", type=Path, required=True)
    parser.add_argument("--table")
    parser.add_argument("--zip", action="store_true")
    parser.add_argument("--zip-only", action="store_true")
    parser.add_argument("--date")
    args = parser.parse_args()

    tools = args.sheet_tools.resolve()
    sys.path.insert(0, str(tools))
    import sheets

    config = sheets.load_config(tools / "config/mapping.json")
    website = args.website.resolve()
    if args.table and (args.zip_only or args.table not in {table["name"] for table in config["tables"]}):
        parser.error("Select a configured table for download")

    with sheets.lock_path(website).open("a") as lock:
        fcntl.flock(lock, fcntl.LOCK_EX)
        if not args.zip_only:
            tables = fetch_tables(sheets, config, args.table)
            changed = sheets.write_project(website, config, tables)
            print(f"Metadata validated; {len(changed)} local file(s) updated.", flush=True)
        if args.zip or args.zip_only:
            dated, latest = sheets.package_zip(website, config, args.date)
            print(f"Verified {len(config['tables'])} JSON files in {dated.name} and {latest.name}.", flush=True)


if __name__ == "__main__":
    try:
        main()
    except (OSError, ValueError) as error:
        print(f"Metadata refresh stopped: {error}", file=sys.stderr)
        sys.exit(1)
