#!/usr/bin/env python3
"""Screenshot each diagram section from diagrams.html into docs/assets/.

Approach: capture a single full-page screenshot, then crop per-section
using PIL based on each element's bounding box. Avoids scroll issues
with element-level and clip-based capture.

Requires: playwright + Pillow (Python 3.12)
  pip install playwright Pillow && playwright install chromium
"""
from pathlib import Path
from playwright.sync_api import sync_playwright
from PIL import Image
from io import BytesIO

ROOT = Path(__file__).resolve().parents[2]
HTML = ROOT / "scripts" / "diagrams" / "diagrams.html"
OUT = ROOT / "docs" / "assets"

DIAGRAMS = [
    ("config-hierarchy-dark", "config-hierarchy-dark.png"),
    ("config-hierarchy-light", "config-hierarchy-light.png"),
    ("variable-substitution-dark", "variable-substitution-dark.png"),
    ("variable-substitution-light", "variable-substitution-light.png"),
    ("templates-dark", "templates-dark.png"),
    ("templates-light", "templates-light.png"),
    ("mr-workflow-dark", "mr-workflow-dark.png"),
    ("mr-workflow-light", "mr-workflow-light.png"),
    ("nac-stack", "nac-stack.png"),
    ("pipeline-anatomy", "pipeline-anatomy.png"),
    ("lab-topology", "lab-topology.png"),
    ("cml-topology", "cml-topology.png"),
    ("file-layout", "file-layout.png"),
    ("terraform-workflow", "terraform-workflow.png"),
    ("netconf-datastores", "netconf-datastores.png"),
    ("config-merge", "config-merge.png"),
]

SCALE = 2


def main() -> None:
    if not HTML.exists():
        raise SystemExit(f"missing: {HTML}")
    OUT.mkdir(parents=True, exist_ok=True)

    with sync_playwright() as p:
        browser = p.chromium.launch()
        ctx = browser.new_context(
            viewport={"width": 1500, "height": 900},
            device_scale_factor=SCALE,
        )
        page = ctx.new_page()
        page.goto(HTML.as_uri())
        page.wait_for_load_state("networkidle")

        # Gather bounding boxes BEFORE any scroll happens.
        boxes = {}
        for section_id, _ in DIAGRAMS:
            box = page.locator(f"section#{section_id}").bounding_box()
            if box is None:
                raise SystemExit(f"no bounding box for {section_id}")
            boxes[section_id] = box

        # Capture the whole document as one image, then crop.
        png_bytes = page.screenshot(full_page=True)
        full = Image.open(BytesIO(png_bytes))
        browser.close()

    for section_id, filename in DIAGRAMS:
        b = boxes[section_id]
        # Scale to device pixels.
        left = int(b["x"] * SCALE)
        top = int(b["y"] * SCALE)
        right = int((b["x"] + b["width"]) * SCALE)
        bottom = int((b["y"] + b["height"]) * SCALE)
        crop = full.crop((left, top, right, bottom))
        target = OUT / filename
        crop.save(target)
        print(f"✓ {target.relative_to(ROOT)}  ({crop.size[0]}x{crop.size[1]})")


if __name__ == "__main__":
    main()
