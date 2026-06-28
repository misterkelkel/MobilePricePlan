#!/usr/bin/env python3
"""
Weekly mobile plan checker for MobilePricePlan.com.
Uses public aggregator summary pages and looks for price tokens.
"""

import json
import os
import re
from datetime import datetime
from html.parser import HTMLParser

try:
    import requests
except ImportError:
    print("Missing requests. Run: pip install requests")
    raise SystemExit(1)

class TextExtractor(HTMLParser):
    def __init__(self):
        super().__init__()
        self.parts = []
    def handle_data(self, data):
        self.parts.append(data)

def strip_html(html):
    if not html:
        return ""
    p = TextExtractor()
    p.feed(html)
    return " ".join(p.parts)

SOURCES = [
    {
        "name": "MobilePlans.sg",
        "url": "https://www.mobileplans.sg/",
    },
    {
        "name": "MoneySmart Cheapest SIM-Only",
        "url": "https://blog.moneysmart.sg/budgeting/cheapest-sim-only-plans",
    },
]

SNAPSHOT = os.path.join(os.path.dirname(__file__), "plan_snapshot.json")
REPORT = os.path.join(os.path.dirname(__file__), "weekly_report.txt")

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-SG,en;q=0.9",
}

def fetch_page(url, timeout=20):
    try:
        r = requests.get(url, headers=HEADERS, timeout=timeout)
        r.raise_for_status()
        return r.text
    except Exception as e:
        return None

def extract_provider_price_lines(text):
    lines = []
    segments = re.split(r"(?<=[.\n])\s+", text)
    patterns = [
        r"(?i)S\$\s*\d+\.?\d*.*?(?:GB|month|mon|5G|4G|eSIM|no contract|roaming)",
        r"(?i)\$\s*\d+\.?\d*.*?(?:GB|month|mon|5G|4G|eSIM|no contract|roaming)",
        r"(?i)\d+\.?\d*\s*(?:GB|months?).*?S?\$.*?(?:month|mo)",
    ]
    for seg in segments:
        seg = seg.strip()
        if not seg:
            continue
        for pat in patterns:
            if re.search(pat, seg):
                if len(seg) < 180:
                    lines.append(seg)
                break
    seen = set()
    out = []
    for line in lines:
        if line not in seen:
            seen.add(line)
            out.append(line)
    return out[:40]

def load_snapshot():
    if os.path.exists(SNAPSHOT):
        with open(SNAPSHOT, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}

def save_snapshot(data):
    data["_meta"] = {"updated_at": datetime.now().isoformat()}
    with open(SNAPSHOT, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)

def main():
    current = {}
    changes = []
    notes = []

    for s in SOURCES:
        page = fetch_page(s["url"])
        if not page:
            notes.append(f"Failed to fetch {s['name']}")
            continue
        text = strip_html(page)
        lines = extract_provider_price_lines(text)
        current[s["name"]] = lines
        print(f"- {s['name']}: {len(lines)} line(s)")
        for line in lines[:8]:
            print("  ", line)

    old = load_snapshot()
    for name, lines in current.items():
        prev = old.get(name)
        if not prev:
            changes.append(f"{name}: first snapshot captured")
            continue
        if lines != prev:
            changes.append(f"{name}: source text changed")

    with open(REPORT, "w", encoding="utf-8") as f:
        f.write(f"MobilePricePlan weekly report — {datetime.now().date()}\n\n")
        if changes:
            f.write("CHANGES:\n")
            for c in changes:
                f.write(c + "\n")
        else:
            f.write("No plan changes detected.\n")
        if notes:
            f.write("\nNOTES:\n")
            for n in notes:
                f.write(n + "\n")

    save_snapshot(current)
    print("\nDone. Report saved:", REPORT)

if __name__ == "__main__":
    main()
