"""Build index.html for GitHub Pages from src/mother-swarm.html.

The source is written for Claude artifacts, which wrap the page in a skeleton
(doctype, charset, mobile viewport, safe-area padding). A static host serves
the file as-is, so this script adds that skeleton.

Usage: python3 tools/build_pages.py
"""
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
src = (ROOT / "src" / "mother-swarm.html").read_text(encoding="utf-8")

head_end = src.index("</style>") + len("</style>")
head, body = src[:head_end], src[head_end:]

page = f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#040706">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Mother Swarm">
<style>
:root {{ padding-top: env(safe-area-inset-top, 0px); padding-bottom: env(safe-area-inset-bottom, 0px); box-sizing: border-box; }}
html, body {{ margin: 0; }}
img {{ max-width: 100%; }}
</style>
{head.strip()}
</head>
<body>
{body.strip()}
</body>
</html>
"""
(ROOT / "index.html").write_text(page, encoding="utf-8")
print("wrote index.html")
