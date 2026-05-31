/* Click-to-copy on titled code blocks (FILE / TERMINAL / DEVICE CLI badges).
 *
 * MkDocs Material renders the `title="..."` attribute of a fenced code
 * block as <span class="filename">PATH</span> directly above the <pre>.
 * The CSS in docs/stylesheets/extra.css adds a colored pill (FILE /
 * TERMINAL / DEVICE CLI / OUTPUT) on the filename row and a hover glow
 * to signal interactivity. This file finishes the loop by copying the
 * filename text to the clipboard on click, then briefly flipping the
 * pill to '✓ COPIED' via the .copied class for visual confirmation.
 *
 * OUTPUT blocks (rendered with .output class on the .highlight wrapper)
 * are intentionally skipped — their title text is descriptive
 * ('Expected output (truncated)') rather than a path, so copying it
 * is never useful. The CSS for .output also flips the cursor back to
 * default and disables the hover glow, but we still need this guard
 * here so a click that lands on the row doesn't trigger a copy.
 *
 * Implementation notes:
 *   - Delegated click listener on document.body so the handler survives
 *     Material's `navigation.instant` page swaps without re-binding on
 *     every navigation event.
 *   - navigator.clipboard.writeText is the modern API; falls back to a
 *     hidden textarea + execCommand('copy') for older browsers in the
 *     dCloud Win10 image, which still ships an aging Chromium build.
 *   - Reads the path from textContent rather than innerText so the
 *     emoji + label pseudo-element prefix (which is content: in CSS,
 *     not in the DOM) doesn't get included in the copied string.
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
        const target = e.target.closest(".filename");
        if (!target) return;

        // Skip OUTPUT blocks — their title is descriptive, not a path.
        if (target.closest(".highlight.output")) return;

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
