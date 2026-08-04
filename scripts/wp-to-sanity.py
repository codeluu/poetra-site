#!/usr/bin/env python3
import argparse
import json
import re
import sys
import unicodedata
from collections import Counter, defaultdict
from datetime import datetime
from html import unescape
from pathlib import Path
from urllib.parse import unquote
import xml.etree.ElementTree as ET

NS = {
    "wp": "http://wordpress.org/export/1.2/",
    "content": "http://purl.org/rss/1.0/modules/content/",
    "excerpt": "http://wordpress.org/export/1.2/excerpt/",
    "dc": "http://purl.org/dc/elements/1.1/",
}

TR_MAP = str.maketrans({
    "ğ": "g", "Ğ": "g",
    "ü": "u", "Ü": "u",
    "ş": "s", "Ş": "s",
    "ı": "i", "I": "i",
    "İ": "i",
    "ö": "o", "Ö": "o",
    "ç": "c", "Ç": "c",
})

BLOCK_RE = re.compile(
    r"<(?P<tag>h[1-6]|p|pre|blockquote|li)\b[^>]*>(?P<html>.*?)</(?P=tag)>",
    re.I | re.S,
)

URL_RE = re.compile(r"https?://[^\s\"'<>)]+")

def wp_text(item, local):
    return item.findtext(f"{{{NS['wp']}}}{local}") or ""

def child_text(item, tag):
    return item.findtext(tag) or ""

def clean_text(value):
    value = re.sub(r"<!--.*?-->", " ", value or "", flags=re.S)
    value = re.sub(r"<br\s*/?>", "\n", value, flags=re.I)
    value = re.sub(r"</(p|div|h[1-6]|li|pre|blockquote)>", "\n", value, flags=re.I)
    value = re.sub(r"<[^>]+>", " ", value)
    value = unescape(value).replace("\xa0", " ")
    lines = [re.sub(r"[ \t]+", " ", line).strip() for line in value.splitlines()]
    lines = [line for line in lines if line]
    return "\n".join(lines).strip()

def slugify(value, fallback):
    value = unquote(value or "").strip() or fallback
    value = value.translate(TR_MAP)
    value = unicodedata.normalize("NFKD", value)
    value = "".join(ch for ch in value if not unicodedata.combining(ch))
    value = value.lower()
    value = re.sub(r"[^a-z0-9]+", "-", value)
    value = re.sub(r"-+", "-", value).strip("-")
    return value[:96].strip("-") or "untitled"

def iso_datetime(value):
    value = (value or "").strip()
    if not value or value.startswith("0000-00-00"):
        return None
    # WordPress export: "YYYY-MM-DD HH:MM:SS"
    try:
        dt = datetime.strptime(value, "%Y-%m-%d %H:%M:%S")
        return dt.isoformat(timespec="seconds") + "Z"
    except ValueError:
        return None

def key(seed):
    seed = re.sub(r"[^a-zA-Z0-9]", "", seed)
    return (seed[:12] or "k") + "x"

def pt_block(text, style="normal", list_item=None, idx=0):
    text = re.sub(r"[ \t]+", " ", text or "").strip()
    if not text:
        return None
    block = {
        "_type": "block",
        "_key": key(f"b{idx}{text[:20]}"),
        "style": style,
        "markDefs": [],
        "children": [{
            "_type": "span",
            "_key": key(f"s{idx}{text[-20:]}"),
            "text": text,
            "marks": [],
        }],
    }
    if list_item:
        block["listItem"] = list_item
        block["level"] = 1
    return block

def html_to_blocks(raw_html):
    raw_html = raw_html or ""
    raw_html = re.sub(r"<!--\s*/?wp:[^>]*-->", " ", raw_html, flags=re.S)
    blocks = []
    idx = 0

    for m in BLOCK_RE.finditer(raw_html):
        tag = m.group("tag").lower()
        inner = m.group("html")

        if tag in ("h1", "h2"):
            style = "h2"
        elif tag in ("h3", "h4", "h5", "h6"):
            style = "h3"
        elif tag == "blockquote":
            style = "blockquote"
        else:
            style = "normal"

        text = clean_text(inner)
        if not text:
            continue

        if tag == "li":
            b = pt_block(text, style="normal", list_item="bullet", idx=idx)
            if b:
                blocks.append(b)
                idx += 1
            continue

        # Poems and <br>-heavy paragraphs: preserve line rhythm as separate blocks.
        if tag == "pre" or "\n" in text:
            for line in text.splitlines():
                b = pt_block(line, style=style, idx=idx)
                if b:
                    blocks.append(b)
                    idx += 1
        else:
            b = pt_block(text, style=style, idx=idx)
            if b:
                blocks.append(b)
                idx += 1

    if not blocks:
        text = clean_text(raw_html)
        for line in text.splitlines():
            b = pt_block(line, idx=idx)
            if b:
                blocks.append(b)
                idx += 1

    return blocks

def excerpt(text, limit=155):
    text = re.sub(r"\s+", " ", text or "").strip()
    if len(text) <= limit:
        return text
    return text[:limit].rsplit(" ", 1)[0] + "…"

def parse_items(xml_path):
    tree = ET.parse(xml_path)
    root = tree.getroot()
    channel = root.find("channel")
    items = []

    for item in channel.findall("item"):
        cats = []
        for c in item.findall("category"):
            cats.append({
                "domain": c.attrib.get("domain", ""),
                "nicename": c.attrib.get("nicename", ""),
                "text": c.text or "",
            })

        items.append({
            "title": child_text(item, "title").strip() or "Untitled",
            "link": child_text(item, "link"),
            "creator": item.findtext(f"{{{NS['dc']}}}creator") or "",
            "post_id": wp_text(item, "post_id"),
            "post_date": wp_text(item, "post_date"),
            "post_date_gmt": wp_text(item, "post_date_gmt"),
            "post_name": wp_text(item, "post_name"),
            "status": wp_text(item, "status"),
            "post_parent": wp_text(item, "post_parent"),
            "post_type": wp_text(item, "post_type"),
            "content": item.findtext(f"{{{NS['content']}}}encoded") or "",
            "excerpt": item.findtext(f"{{{NS['excerpt']}}}encoded") or "",
            "attachment_url": wp_text(item, "attachment_url"),
            "categories": cats,
        })
    return items

def categories(item, domain="category"):
    return [c["text"] for c in item["categories"] if c["domain"] == domain]

def tags(item):
    return [c["text"] for c in item["categories"] if c["domain"] == "post_tag"]

def target_type(item):
    if item["post_type"] == "page":
        return "page"
    if item["post_type"] == "attachment":
        return "asset_later"
    if item["post_type"] != "post":
        return "exclude"

    cats = set(categories(item))
    if "English Poems" in cats or "Turkish Poems" in cats:
        return "poetry"
    if "Music" in cats:
        return "mediaEntry"
    if "Spiritual Path" in cats or "Turkish Shorts" in cats:
        return "writing"
    return "writing"

def language_for(item, target):
    cats = set(categories(item))
    text = clean_text(item["content"])
    sample = f"{item['title']} {text[:1000]}"

    if target == "poetry":
        return "en" if "English Poems" in cats else "tr"

    tr_score = len(re.findall(r"[çğıöşüÇĞİÖŞÜ]", sample))
    en_markers = len(re.findall(r"\b(the|and|what|where|why|with|within|does|really|inquiries|forgive|love|thank)\b", sample, re.I))
    tr_markers = len(re.findall(r"\b(ve|bir|bu|ben|için|gibi|çok|artık|değil|kalbim|günaydın)\b", sample, re.I))

    return "en" if en_markers > tr_markers + tr_score else "tr"

def writing_format(item):
    cats = set(categories(item))
    title = item["title"].lower()
    tgs = {t.lower() for t in tags(item)}

    if "günlük" in tgs or re.search(r"\b(ocak|şubat|mart|nisan|mayıs|haziran|temmuz|ağustos|eylül|ekim|kasım|aralık)\b", title):
        return "diary"
    if "Spiritual Path" in cats:
        return "spiritualPath"
    if "neden" in title or "does it really work" in title or "inquir" in title:
        return "inquiry"
    if "Turkish Shorts" in cats:
        return "fragment"
    return "essay"

def page_type(item):
    slug = slugify(item["post_name"], item["title"])
    if slug == "about":
        return "about"
    if "inquir" in slug:
        return "inquiries"
    return "generic"

def media_urls(content):
    found = {"youtubeUrl": None, "spotifyUrl": None, "soundCloudUrl": None}
    for url in URL_RE.findall(content or ""):
        clean = url.rstrip(".,;")
        low = clean.lower()
        if "youtube.com" in low or "youtu.be" in low:
            found["youtubeUrl"] = found["youtubeUrl"] or clean
        elif "spotify.com" in low:
            found["spotifyUrl"] = found["spotifyUrl"] or clean
        elif "soundcloud.com" in low:
            found["soundCloudUrl"] = found["soundCloudUrl"] or clean
    return {k: v for k, v in found.items() if v}

def sanity_doc(item):
    target = target_type(item)
    if target not in {"poetry", "writing", "mediaEntry", "page"}:
        return None

    slug = slugify(item["post_name"], item["title"])
    published = iso_datetime(item["post_date_gmt"]) or iso_datetime(item["post_date"])
    body = html_to_blocks(item["content"])
    plain = clean_text(item["content"])

    base_id = f"wp-{target}-{item['post_id']}"
    doc = {
        "_id": base_id if item["status"] == "publish" else f"drafts.{base_id}",
        "_type": target,
        "title": item["title"],
        "slug": {"_type": "slug", "current": slug},
        "seo": {
            "_type": "seo",
            "title": item["title"],
            "description": excerpt(plain),
        },
    }

    if target == "poetry":
        lang = language_for(item, target)
        doc.update({
            "originalLanguage": lang,
            "body": body,
            "writtenAt": published,
            "publishedAt": published,
            "tags": tags(item),
            "featured": False,
        })
    elif target == "writing":
        lang = language_for(item, target)
        doc.update({
            "language": lang,
            "translationKey": slug,
            "format": writing_format(item),
            "body": body,
            "publishedAt": published,
            "tags": tags(item),
            "featured": False,
        })
    elif target == "mediaEntry":
        lang = language_for(item, target)
        doc.update({
            "kind": "music",
            "language": lang,
            "translationKey": slug,
            "body": body,
            "publishedAt": published,
        })
        doc.update(media_urls(item["content"]))
    elif target == "page":
        lang = language_for(item, target)
        doc.update({
            "language": lang,
            "translationKey": slug,
            "pageType": page_type(item),
            "body": body,
        })

    # Avoid invalid empty required arrays.
    if target in {"poetry", "writing"} and not doc.get("body"):
        doc["body"] = [pt_block(item["title"], idx=0)]

    return doc

def build_inventory(items):
    target_counts = Counter(target_type(i) for i in items)
    type_status = Counter((i["post_type"], i["status"]) for i in items)
    cat_counts = Counter()
    tag_counts = Counter()
    for i in items:
        for c in categories(i):
            cat_counts[c] += 1
        for t in tags(i):
            tag_counts[t] += 1

    mapped = []
    for i in items:
        tgt = target_type(i)
        if tgt in {"poetry", "writing", "mediaEntry", "page"}:
            mapped.append({
                "wpId": i["post_id"],
                "status": i["status"],
                "date": i["post_date"],
                "title": i["title"],
                "slug": slugify(i["post_name"], i["title"]),
                "targetType": tgt,
                "language": language_for(i, tgt),
                "categories": categories(i),
                "tags": tags(i),
            })

    attachments = []
    for i in items:
        if i["post_type"] == "attachment":
            attachments.append({
                "wpId": i["post_id"],
                "title": i["title"],
                "parent": i["post_parent"],
                "url": i["attachment_url"],
            })

    return {
        "totalItems": len(items),
        "targetCounts": dict(target_counts),
        "wpTypeStatusCounts": {f"{k[0]}:{k[1]}": v for k, v in type_status.items()},
        "categoryCounts": dict(cat_counts),
        "topTags": dict(tag_counts.most_common(30)),
        "mappedContent": mapped,
        "attachments": attachments,
    }

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("xml", help="WordPress export XML path")
    ap.add_argument("--out", default="imports/poetra-sanity-import.ndjson")
    ap.add_argument("--inventory", default="imports/wp-inventory.json")
    args = ap.parse_args()

    xml_path = Path(args.xml)
    out_path = Path(args.out)
    inv_path = Path(args.inventory)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    inv_path.parent.mkdir(parents=True, exist_ok=True)

    items = parse_items(xml_path)
    inv = build_inventory(items)
    inv_path.write_text(json.dumps(inv, ensure_ascii=False, indent=2), encoding="utf-8")

    docs = [sanity_doc(i) for i in items]
    docs = [d for d in docs if d]

    with out_path.open("w", encoding="utf-8") as f:
        for d in docs:
            f.write(json.dumps(d, ensure_ascii=False, separators=(",", ":")) + "\n")

    print("Inventory:", inv_path)
    print("NDJSON:", out_path)
    print("Documents:", len(docs))
    print("By _type:", dict(Counter(d["_type"] for d in docs)))
    print("Draft docs:", sum(1 for d in docs if d["_id"].startswith("drafts.")))

if __name__ == "__main__":
    main()
