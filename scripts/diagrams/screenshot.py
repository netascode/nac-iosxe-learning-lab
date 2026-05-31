#!/usr/bin/env python3
"""Screenshot each diagram section from diagrams.html into docs/assets/.

Approach: for each section, hide every other card via JS, then take an
element screenshot of the lone visible card. This avoids two bugs we hit:

  1. element.screenshot() with scroll-into-view on a 19-card page gives
     Chromium inconsistent paint state between sections.
  2. full_page=True + PIL crop mis-aligns vs. bounding_box() once the
     document is larger than the max tiled screenshot height.

Hiding siblings collapses the page to a single viewport-sized card at
y=0, which both browsers and humans can screenshot reliably.

Requires: playwright + Pillow (Python 3.12)
  pip install playwright Pillow && playwright install chromium
"""
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[2]
HTML = ROOT / "scripts" / "diagrams" / "diagrams.html"
OUT = ROOT / "docs" / "assets"

DIAGRAMS = [
    "config-hierarchy-dark",
    "config-hierarchy-light",
    "variable-substitution-dark",
    "variable-substitution-light",
    "templates-dark",
    "templates-light",
    "mr-workflow-dark",
    "mr-workflow-light",
    "nac-stack",
    "pipeline-anatomy",
    "lab-topology",
    "cml-topology",
    "file-layout",
    "template-decision",
    "templates-patterns",
    "terraform-workflow",
    "netconf-datastores",
    "config-merge",
    "merge-semantics",
    "module-inputs",
    "selective-deployment",
]

SCALE = 2


def main() -> None:
    if not HTML.exists():
        raise SystemExit(f"missing: {HTML}")
    OUT.mkdir(parents=True, exist_ok=True)

    with sync_playwright() as p:
        browser = p.chromium.launch()
        ctx = browser.new_context(
            viewport={"width": 1700, "height": 770},
            device_scale_factor=SCALE,
        )
        for sid in DIAGRAMS:
            page = ctx.new_page()
            page.goto(HTML.as_uri())
            page.wait_for_load_state("networkidle")
            page.evaluate(
                """(sid) => {
                    document.querySelectorAll('section.card').forEach(s => {
                        if (s.id !== sid) s.style.display = 'none';
                    });
                    window.scrollTo(0, 0);
                }""",
                sid,
            )
            target = OUT / f"{sid}.png"
            page.locator(f"section#{sid}").screenshot(path=str(target))
            print(f"✓ {target.relative_to(ROOT)}")
            page.close()
        browser.close()


if __name__ == "__main__":
    main()
