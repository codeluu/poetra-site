"""Import the Notion CSV and verify its companion Markdown records.

Run from the project root: python3 scripts/import-quotes.py
No third-party dependencies. Dates are original writing dates, not schedules.
"""
import csv
import json
import re
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def clean(text):
    return text.strip().lstrip('\u2800').strip()


def main():
    source, = ROOT.glob('Quotes*_all.csv')
    with source.open(encoding='utf-8-sig', newline='') as stream:
        rows = list(csv.DictReader(stream))
    companions = {}
    for path in (ROOT / 'Quotes').glob('*.md'):
        content = path.read_text(encoding='utf-8')
        heading, metadata = content.split('\n\nAuthor:', 1)
        text = clean(heading.removeprefix('# '))
        author = metadata.splitlines()[0].strip()
        date = re.search(r'^Quote Date: (.+)$', metadata, re.MULTILINE)
        companions[(text, author)] = date[1] if date else ''

    records = []
    matched = set()
    ids = set()
    for row in rows:
        text = clean(row['Quote'])
        author = row['Author'].strip()
        key = (text, author)
        raw_date = row['Quote Date'].strip()
        if key in companions:
            if companions[key] != raw_date:
                raise ValueError(f'Date mismatch for quote {row["ID"]}')
            matched.add(key)
        date = datetime.strptime(raw_date, '%d/%m/%Y').date().isoformat() if raw_date else ''
        identifier = row['ID']
        if not text or identifier in ids:
            raise ValueError(f'Empty text or duplicate ID: {identifier}')
        ids.add(identifier)
        records.append(dict(id=identifier, text=text, author=author,
                            date=date, source=row['Source/Where?'].strip(),
                            category=row['Category'].strip(), personal=key in companions))
    if matched != set(companions):
        raise ValueError('Some Markdown quotes are missing from the CSV')
    records.sort(key=lambda item: int(item['id']))
    output = ROOT / 'src/data/quotes.json'
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(records, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    personal_output = ROOT / 'src/data/daily-quotes.json'
    personal_output.write_text(json.dumps([record for record in records if record['personal']],
                                          ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f'Imported {len(records)} quotes; verified {len(matched)} Markdown records.')


if __name__ == '__main__':
    main()
