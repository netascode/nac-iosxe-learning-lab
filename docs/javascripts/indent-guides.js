/* Indent guides for structure-by-indentation code blocks.
 *
 * Mirrors what learners see in VS Code on the same machine: faint vertical
 * lines at every indent level inside a fenced code block whose meaning is
 * carried by indentation. Guides make nesting depth scannable without
 * counting spaces, which is a real cognitive tax in 30+-line YAML / HCL
 * configs and class-method-bodied Python rules.
 *
 * Languages handled (key = the .language-* class Material/Pygments emits,
 * value = number of leading spaces per logical indent level):
 *
 *   language-yaml       2   YAML (lab convention; netascode docs convention)
 *   language-terraform  2   HCL / Terraform .tf files
 *   language-hcl        2   HCL outside Terraform (same blocks as above
 *                          if a fence ever uses ```hcl instead of ```terraform)
 *   language-python     4   Python (PEP 8)
 *
 * Anything else is ignored — we'd rather ship no guides than wrong ones.
 * Robot Framework is intentionally NOT in the list: its "indentation" is
 * test-section / step structure, not nested data, so 4-space stops would
 * draw guides under "*** Settings ***" / "*** Test Cases ***" headers
 * where they're misleading.
 *
 * Approach (relies on PymdownX `anchorlinenums` rendering):
 *   - PymdownX already wraps every code line in <span id="__span-N-M">
 *     containing the line's tokens + a trailing "\n" text node. Those are
 *     line wrappers we can repurpose, so the JS doesn't have to split DOM
 *     at newlines (which would fight Pygments' .hll hl_lines wrappers).
 *   - For each wrapper inside a supported highlight block, count leading
 *     spaces in its textContent, divide by the language's indent width to
 *     get indent level N, set the inline `--indent: N` CSS variable plus
 *     a data-indent attribute, and add the `cl` class so the CSS selector
 *     in extra.css applies.
 *   - The per-language indent width is also exposed to CSS via
 *     `--indent-width: Nch` set once on the <code> element, so the
 *     repeating-linear-gradient stops scale to match (Python's 4ch
 *     stripes, YAML/HCL's 2ch stripes, etc.).
 *
 * Skipped block classes (.terminal / .device-cli / .output) cover output-y
 * blocks that happen to share a language tag — for example an .output
 * block tagged ```yaml showing a model.yaml dump that the learner reads
 * but doesn't edit. Those don't need guides and the .output background
 * already conveys the visual frame.
 *
 * Re-run hooks:
 *   - DOMContentLoaded for first paint.
 *   - Material's window.document$ observable fires on instant-navigation
 *     swaps; we resubscribe so newly-rendered code blocks pick up guides.
 *   - data-indent-guides="done" on the <code> element keeps re-runs
 *     idempotent on the same block.
 */
(function () {
    "use strict";

    const SKIP_PARENT_CLASSES = ["terminal", "device-cli", "output"];

    // Language class -> spaces per indent level. Anything not in this map
    // is ignored. Keep the keys in lower-case (Pygments emits lowercase).
    const INDENT_WIDTH_BY_LANG = {
        "language-yaml": 2,
        "language-terraform": 2,
        "language-hcl": 2,
        "language-python": 4,
    };

    function highlightAncestor(codeEl) {
        return codeEl && codeEl.closest(".highlight");
    }

    function indentWidthFor(highlight) {
        if (!highlight) return null;
        for (let i = 0; i < highlight.classList.length; i++) {
            const cls = highlight.classList[i];
            if (Object.prototype.hasOwnProperty.call(INDENT_WIDTH_BY_LANG, cls)) {
                return INDENT_WIDTH_BY_LANG[cls];
            }
        }
        return null;
    }

    function shouldSkip(highlight) {
        return SKIP_PARENT_CLASSES.some(function (cls) {
            return highlight.classList.contains(cls);
        });
    }

    function computeIndentLevel(text, indentWidth) {
        if (!text) return 0;
        // Trim trailing newline first so blank lines (just "\n") don't
        // accidentally claim leading whitespace from the next token.
        const stripped = text.replace(/\n$/, "");
        if (!stripped.trim()) return 0;
        const match = stripped.match(/^( *)/);
        if (!match) return 0;
        return Math.floor(match[1].length / indentWidth);
    }

    function annotateLine(lineSpan, indentWidth) {
        // textContent includes the anchor (which has no visible text) plus
        // every token span's text plus the trailing "\n". That's exactly
        // the rendered line — leading-whitespace count is meaningful.
        const level = computeIndentLevel(lineSpan.textContent, indentWidth);
        lineSpan.classList.add("cl");
        if (level > 0) {
            lineSpan.style.setProperty("--indent", level);
            lineSpan.dataset.indent = level;
        }
    }

    function instrument(codeEl) {
        const highlight = highlightAncestor(codeEl);
        if (!highlight) return;
        if (shouldSkip(highlight)) return;
        if (codeEl.dataset.indentGuides) return;

        const indentWidth = indentWidthFor(highlight);
        if (indentWidth === null) return;

        // PymdownX wraps each rendered line in a child <span id="__span-N-M">.
        // If that's missing (e.g. a future Material/PymdownX revision changes
        // the layout), bail rather than guess — better to ship no guides than
        // to corrupt the DOM.
        const lineSpans = codeEl.querySelectorAll(':scope > span[id^="__span-"]');
        if (lineSpans.length === 0) {
            codeEl.dataset.indentGuides = "skip-no-line-spans";
            return;
        }

        // Expose the language's indent width to CSS so the gradient stops
        // scale per language (Python 4ch, YAML/HCL 2ch).
        codeEl.style.setProperty("--indent-width", indentWidth + "ch");

        let annotated = 0;
        lineSpans.forEach(function (lineSpan) {
            annotateLine(lineSpan, indentWidth);
            if (lineSpan.dataset.indent) annotated++;
        });

        codeEl.dataset.indentGuides = annotated > 0 ? "done" : "noop";
    }

    function instrumentAll() {
        // Build a single selector covering every supported language, scoped to
        // the <code> inside its .highlight wrapper.
        const selectors = Object.keys(INDENT_WIDTH_BY_LANG).map(function (cls) {
            return ".highlight." + cls + " pre > code";
        });
        document.querySelectorAll(selectors.join(", ")).forEach(instrument);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", instrumentAll);
    } else {
        instrumentAll();
    }

    if (typeof window.document$ !== "undefined" && window.document$.subscribe) {
        window.document$.subscribe(function () {
            instrumentAll();
        });
    }
})();
