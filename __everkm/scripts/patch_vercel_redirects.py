#!/usr/bin/env python3
"""Append extra redirects to dist/vercel.json after everkm export."""

from __future__ import annotations

import argparse
import json
from pathlib import Path

# Permanent redirects appended after export.
EXTRA_REDIRECTS = [
    {
        "source": "/blog/:path*",
        "destination": "/posts/:path*",
        "permanent": True,
    },
]


def redirect_key(item: dict) -> tuple:
    return (item.get("source"), item.get("destination"), bool(item.get("permanent")))


def patch(vercel_json: Path) -> int:
    data = json.loads(vercel_json.read_text(encoding="utf-8"))
    redirects = data.setdefault("redirects", [])
    existing = {redirect_key(item) for item in redirects}

    added = 0
    for item in EXTRA_REDIRECTS:
        key = redirect_key(item)
        if key in existing:
            continue
        redirects.append(item)
        existing.add(key)
        added += 1

    vercel_json.write_text(
        json.dumps(data, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    return added


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "vercel_json",
        nargs="?",
        default="dist/vercel.json",
        type=Path,
        help="Path to vercel.json (default: dist/vercel.json)",
    )
    args = parser.parse_args()

    if not args.vercel_json.is_file():
        raise SystemExit(f"vercel.json not found: {args.vercel_json}")

    added = patch(args.vercel_json)
    print(f"Patched {args.vercel_json}: added {added} redirect(s)")


if __name__ == "__main__":
    main()
