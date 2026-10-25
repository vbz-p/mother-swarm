"""Build the GitHub Pages files from src/: the zone 1 game (index.html), the Swarm Lab (lab/index.html) and the run prototype (run/index.html).

The sources are written for Claude artifacts, which wrap each page in a skeleton
(doctype, charset, mobile viewport, safe-area padding). A static host serves
files as-is, so this script adds that skeleton.

Usage: python3 tools/build_pages.py
"""
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PAGES = {
    "src/mother-swarm.html": ("index.html", "Mother Swarm"),
    "src/swarm-lab.html": ("lab/index.html", "Swarm Lab"),
    "src/run.html": ("run/index.html", "Mother Swarm Runs"),
}

TEMPLATE = """<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#040706">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="{app_title}">
<style>
:root {{ padding-top: env(safe-area-inset-top, 0px); padding-bottom: env(safe-area-inset-bottom, 0px); box-sizing: border-box; }}
html, body {{ margin: 0; }}
img {{ max-width: 100%; }}
</style>
{head}
</head>
<body>
{body}
</body>
</html>
"""


def build(src_path, out_path, app_title):
    src = (ROOT / src_path).read_text(encoding="utf-8")
    head_end = src.index("</style>") + len("</style>")
    page = TEMPLATE.format(app_title=app_title, head=src[:head_end].strip(), body=src[head_end:].strip())
    out = ROOT / out_path
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(page, encoding="utf-8")
    print("wrote", out_path)


for src_path, (out_path, app_title) in PAGES.items():
    build(src_path, out_path, app_title)
