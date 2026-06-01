/* Indent guides for YAML code blocks.
 *
 * Mirrors what learners see in VS Code on the same machine: faint vertical
 * lines at every indent level inside a fenced YAML block. YAML's structure is
 * conveyed entirely by indentation — guides make that structure scannable
 * without counting spaces.
 *
 * Approach (relies on PymdownX `anchorlinenums` rendering):
 *   - PymdownX already wraps every code line in <span id="__span-N-M">
 *     containing the line's tokens + a trailing "\n" text node. Those are
 *     line wrappers we can repurpose, so the JS doesn't have to split DOM
 *     at newlines (which would fight Pygments' .hll hl_lines wrappers).
 *   - For each wrapper inside a YAML highlight block, count leading spaces
 *     in its textContent, divide by 2 to get indent level N, set the inline
 *     `--indent: N` CSS variable plus a data-indent attribute, and add the
 *     `cl` class so the CSS selector in extra.css applies.
 *
 * Scope:
 *   - Only `.highlight.language-yaml` blocks. YAML is uniformly 2-space
 *     across the lab; Python (4-space) and HCL (mixed) are out of scope
 *     for this first pass.
 *   - Skip blocks where the highlight wrapper carries .terminal /
 *     .device-cli / .output classes — irrelevant for YAML in practice but
 *     belt-and-suspenders.
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
    const INDENT_WIDTH = 2; // YAML convention across this lab.
    const TARGET_LANG_CLASS = "language-yaml";

    function highlightAncestor(codeEl) {
        return codeEl && codeEl.closest(".highlight");
    }

    function isYamlBlock(highlight) {
        return !!highlight && highlight.classList.contains(TARGET_LANG_CLASS);
    }

    function shouldSkip(highlight) {
        return SKIP_PARENT_CLASSES.some(function (cls) {
            return highlight.classList.contains(cls);
        });
    }

    function computeIndentLevel(text) {
        if (!text) return 0;
        // Trim trailing newline first so blank lines (just "\n") don't
        // accidentally claim leading whitespace from the next token.
        const stripped = text.replace(/\n$/, "");
        if (!stripped.trim()) return 0;
        const match = stripped.match(/^( *)/);
        if (!match) return 0;
        return Math.floor(match[1].length / INDENT_WIDTH);
    }

    function annotateLine(lineSpan) {
        // textContent includes the anchor (which has no visible text) plus
        // every token span's text plus the trailing "\n". That's exactly
        // the rendered line — leading-whitespace count is meaningful.
        const level = computeIndentLevel(lineSpan.textContent);
        lineSpan.classList.add("cl");
        if (level > 0) {
            lineSpan.style.setProperty("--indent", level);
            lineSpan.dataset.indent = level;
        }
    }

    function instrument(codeEl) {
        const highlight = highlightAncestor(codeEl);
        if (!isYamlBlock(highlight)) return;
        if (shouldSkip(highlight)) return;
        if (codeEl.dataset.indentGuides) return;

        // PymdownX wraps each rendered line in a child <span id="__span-N-M">.
        // If that's missing (e.g. a future Material/PymdownX revision changes
        // the layout), bail rather than guess — better to ship no guides than
        // to corrupt the DOM.
        const lineSpans = codeEl.querySelectorAll(':scope > span[id^="__span-"]');
        if (lineSpans.length === 0) {
            codeEl.dataset.indentGuides = "skip-no-line-spans";
            return;
        }

        let annotated = 0;
        lineSpans.forEach(function (lineSpan) {
            annotateLine(lineSpan);
            if (lineSpan.dataset.indent) annotated++;
        });

        codeEl.dataset.indentGuides = annotated > 0 ? "done" : "noop";
    }

    function instrumentAll() {
        document.querySelectorAll(".highlight.language-yaml pre > code").forEach(instrument);
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
