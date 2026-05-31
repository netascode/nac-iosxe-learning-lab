/* Click-to-copy on titled code blocks inside .filename-trial wrappers.
 *
 * MkDocs Material renders the `title="..."` attribute of a fenced code
 * block as <span class="filename">PATH</span> directly above the <pre>.
 * When the parent has the .filename-trial class, the CSS in
 * docs/stylesheets/extra.css adds a "📂 FILE" pill and a hover glow to
 * signal interactivity. This file finishes the loop by copying the path
 * to the clipboard on click, then briefly flipping the pill to
 * "✓ COPIED" via the .copied class for visual confirmation.
 *
 * Implementation notes:
 *   - Uses a delegated click listener on document.body so the handler
 *     survives Material's `navigation.instant` page swaps without us
 *     having to re-bind on every navigation event.
 *   - navigator.clipboard.writeText is the modern API; falls back to a
 *     hidden textarea + execCommand('copy') for older browsers in the
 *     dCloud Win10 image, which still ships an aging Chromium build.
 *   - Reads the path from textContent rather than innerText so the
 *     "📂 FILE" pseudo-element prefix (which is content: in CSS, not in
 *     the DOM) doesn't get included in the copied string.
 */
(function () {
    "use strict";

    const COPIED_CLASS = "copied";
    const COPIED_DURATION_MS = 1500;

    function copyToClipboard(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            return navigator.clipboard.writeText(text);
        }
        return new Promise(function (resolve, reject) {
            const ta = document.createElement("textarea");
            ta.value = text;
            ta.setAttribute("readonly", "");
            ta.style.position = "absolute";
            ta.style.left = "-9999px";
            document.body.appendChild(ta);
            ta.select();
            try {
                document.execCommand("copy");
                resolve();
            } catch (err) {
                reject(err);
            } finally {
                document.body.removeChild(ta);
            }
        });
    }

    document.addEventListener("click", function (e) {
        const target = e.target.closest(".filename-trial .filename");
        if (!target) return;

        // textContent excludes the CSS ::before pseudo content
        const path = target.textContent.trim();
        if (!path) return;

        copyToClipboard(path).then(
            function () {
                target.classList.add(COPIED_CLASS);
                window.setTimeout(function () {
                    target.classList.remove(COPIED_CLASS);
                }, COPIED_DURATION_MS);
            },
            function () {
                // Clipboard write failed — surface lightly so the user
                // knows the click registered but the copy didn't land.
                target.classList.add(COPIED_CLASS);
                target.title = "Could not write to clipboard. Path: " + path;
                window.setTimeout(function () {
                    target.classList.remove(COPIED_CLASS);
                }, COPIED_DURATION_MS);
            }
        );
    });
})();
