# LTRXAR-2008 / CLUS 2026 — Lab Guide Improvement Plan

**Session:** LTRXAR-2008 — *Accelerate Your Network Operations: A 4-Hour IOS XE Automation Workshop*
**Presenters:** Andrea Testino (atestini@cisco.com, CCIE 56739) and Christopher Hart (chart2@cisco.com)
**Repo:** `github.com/ChartinoLabs/LTRXAR-2008-CLUS2026` (private)
**Status:** draft plan — nothing executed yet.

> **Source of branding truth:** `/Users/atestini/Desktop/Automation/CLUS-2026/IOSXE-Lab/LTRXAR-2008-IOSXELab.pptx` (21 slides).
> The directory name `ltrops-2323-clemea26` is legacy inherited from the Asier/Balu Amsterdam draft and can be renamed later — keeping as-is for now to avoid churn on MkDocs / `mkdocs.yml` paths until the content rebrand lands.

---

## 0. Session rebrand (NEW — takes precedence over everything else)

- [x] **0.1** — Global find/replace of session branding across `docs/`, `mkdocs.yml`, `README.md`, and the homepage override:
  - `LTROPS-2323` → `LTRXAR-2008`
  - `Master IOS XE Automation in Just 4 Hours` → `Accelerate Your Network Operations: A 4-Hour IOS XE Automation Workshop`
  - `Cisco Live Amsterdam 2026` → `Cisco Live 2026` (deck uses Amsterdam branding inconsistently; confirm with the actual location)
- [x] **0.2** — Replace authors everywhere:
  - `Asier Arlegui Lacunza, Balu Novak-Bohak` → `Andrea Testino, Christopher Hart`
  - Update `mkdocs.yml:site_author`
  - Update the conclusion page "Reach out" emails: `aarlegui@cisco.com / balnovak@cisco.com` → `atestini@cisco.com / chart2@cisco.com`
- [ ] **0.3** — Deck has stale session IDs on slides 3, 4, 5, 17: `BRKXAR-2032`, `BRKSEC-XXXX`. Flag for Andrea/Chris to scrub in the PPTX itself (out of scope for the lab guide, but note for the pre-event review).
- [x] **0.4** — Confirm the PDF cover (`docs/template_assets/PDF_Event_General_Logo.png`) is the right CL 2026 event logo — currently pulled from the older template.

---

## 1. Critical / must-fix before publish

- [x] **1.1 — Remove "Claude / AI-assisted" attribution**
  - `docs/Intro01_overview.md:37` reads *"Claude 4.5 Opus was used to assist the authors."* Per user's global CLAUDE.md ("Never use Claude or AI or Agent or Bot in PRs/commits/comments"), this line must be removed from the final Cisco Live artifact. Replace with a simple "Authored by Andrea Testino and Christopher Hart" or drop it.
- [x] **1.2 — Clean up authoring scaffolding left in the source**
  - [x] `<!-- TODO: Update image with tagged to specific commit -->` in `Task02` and `Task06`
  - [x] `<!-- SCREENSHOT PLACEHOLDER: ... -->` / `<!-- SCREENSHOT: ... -->` throughout `Task13`–`Task15`
  - [x] Large commented-out blocks (the Challenge in `Task08`, the alternative verification block in `Task05`, the `show banner login` example in `Task06`) — restore them as proper expandable admonitions or delete them.
  - [x] `Task14` line ~947 references `Appendix I`, which shows the complete `.gitlab-ci.yml` — double-check it is fully in sync with the snippet shown in `Task13` (currently shows slightly different variable sets).
- [ ] **1.3 — Pinned-commit + module URL consistency**
  - `Task02` pins the Terraform module to commit `269527803a951f…` dated "January 15, 2026". The CI/CD lab (`Task13+`) uses the module GitLab pulls on its own. Confirm both code paths resolve to the same module version so the learner's manual config matches the pipeline's. If not, explain the divergence.
- [ ] **1.4 — Task12 destructive cleanup is a hard dead-end for Optional B/C learners**
  - Currently the cleanup warning says "once you run cleanup, you will no longer be able to complete Tasks 07–09 or Task 11." `terraform destroy` also wipes state that Task 11 reads (`model.yaml`). Recommend: reorder so cleanup happens after all optional work the learner chose, OR carve the CI/CD section into a parallel environment (different Terraform workspace / directory) so a learner can experiment without re-deploying. Biggest UX issue for a 4-hour slot.

---

## 2. Diagrams — rebuild in HTML, screenshot, swap in

All current diagrams are PNGs exported from drawio or screenshots. None match the Cisco Live 2026 dark palette (CYAN `#02C8FF`, BLUE `#0A60FF`, DEEP_BG `#07182D`, CARD_BG `#0D2238`) used in `LTRXAR-2008-IOSXELab.pptx`. Rebuild as an HTML file (per-sheet `diagrams.html` like the Paho Layer 2 one), screenshot each at 2× resolution, and replace the PNGs in `docs/assets/`.

Production location: `scripts/diagrams/diagrams.html` (one master file, each `<section>` = one diagram, caption below, reproducible).

Priority-ordered diagram rebuilds:

| # | Current PNG | Replacement concept | Light + Dark | Status |
|---|---|---|---|---|
| 1 | `lab-topology.png` | Full dCloud topology (CML + Ubuntu VM + GitLab + Win10) as an annotated HTML diagram with numbered reach-lines matching the task flow | one version, styled for dark | [x] |
| 2 | `cml-topology.png` | CML device topology (core/border/access01/access02 + isp + host01/02) with link labels + AS numbers, clickable device chips | yes | [x] |
| 3 | `config-hierarchy-{light,dark}.png` | 3-tier pyramid: Global → Device Group → Device, with "highest precedence" arrow + example per tier | yes | [x] |
| 4 | `variable-substitution-{light,dark}.png` | Flow diagram: `${HOSTNAME}` defined per device → merged model → banner/hostname output per device. Multi-column "before/after" | yes | [x] |
| 5 | `templates-{light,dark}.png` | Template resolution flow: template file → group reference → rendered per-device config | yes | [x] |
| 6 | `mr-workflow-{light,dark}.png` | MR swimlane: developer → feature branch → MR pipeline (validate+plan) → reviewer → merge → main pipeline (validate+plan+deploy+test+notify) | yes | [x] |
| 7 | *new* | NAC stack-overview: YAML → NAC Module (Terraform) → `terraform-provider-iosxe` → RESTCONF/NETCONF → IOS XE. Genuinely missing from the guide. Addresses the #1 "what is NAC actually doing under the hood" question. | yes | [x] |
| 8 | *new* | CI/CD pipeline anatomy for Task 13/14 (stages, jobs, artifacts, what runs on MR vs main) | yes | [x] |
| 9 | *new* | File/folder layout visualization for Tasks 2–10 (the `tree` ASCII blocks are hard to scan and repeated in 6 tasks) | yes | [x] |

Template for the HTML: mirror the `Paho Layer 2 Forwarding/diagrams.html` / `digitized-delivery-corpus/html-samples/diagrams.html` structure — `<style>` block with CSS variables matching the deck palette, one `.diagram-card` per sheet, captions with source references. Produced as `scripts/diagrams/diagrams.html` so they're reproducible and version-controlled rather than binary-only PNGs.

---

## 3. Content / writing-quality issues

- [x] **3.1 — Intro chapters read like drafts**
  - `Intro02_all_learners.md` line "Maybe you have never used VS Code and don't know what Git is. Maybe you are an advanced user of GitLab..." is chatty for a CL publication. Tighten to one sentence.
  - `Intro03_disclaimer.md` is two sentences — merge into `Intro01` or expand with a proper lab-scope disclaimer (virtual devices only, not production, etc.).
  - `Intro04_getting_started.md` duplicates topology content repeated verbatim in `Intro05_topologies.md`. De-duplicate — keep topology in one place and link.
- [x] **3.2 — Task 01 buries the key concept**
  - RESTCONF/NETCONF distinction is called out twice in the same page (top note + bottom note). Pick one location.
  - `show version` / `show run` sections are "look at this and move on" — no callout of what learners should find. Add a short "You should see: version 17.x, model C9300-24T, RESTCONF enabled."
- [x] **3.3 — Task 02 has a discoverability gap**
  - The Terraform module block has a hard-coded commit hash. Learners staring at `?ref=269527803a951f…` will not understand why. Add a brief expandable: "Why pin to a commit? Reproducibility — the module API can change. In production you'd pin to a tag."
- [x] **3.4 — Task 06 variables — the example is weak**
  - Banner + hostname are both device-identical (`HOSTNAME: core` on `core`). This doesn't sell the *power* of variables. Add one more variable that genuinely differs per device (e.g., `${SITE_ID}` or `${MGMT_VLAN}`) OR have two devices share a value via a *group* variable to show precedence in practice rather than just in text.
- [x] **3.5 — Task 08 BGP example + the removed Challenge** — **Decision: keep + reframe as "Advanced Challenge"**
  - The commented-out "Challenge: default gateway for host01/host02" is the single most interesting exercise in the whole lab (it forces the learner to read the data-model docs on their own).
  - Per author feedback: the lab frequently finishes before 4 hours, so adding optional depth for fast learners is net positive.
  - [ ] Re-enable the challenge as an explicit section at the end of Task 08 titled **"Advanced Challenge — for learners who finish early"** (NOT buried inside a collapsible). Include a clear "skip unless you have time" header so learners self-select.
  - [ ] Simplify the verification path: allow `show ip route` on `border` as the primary validation (already reachable in the SSH session the learner is in), and keep the CML-console ping-from-host flow as an expandable "Want to prove it end-to-end?" extra step.
  - [ ] Add a one-line pointer from the Conclusion's "Try at home" so learners who never reached Task 08 still know the challenge exists.
- [x] **3.6 — Task 11 is flagged "most laborious" — that's a smell** — **Decision: option (a) only**
  - [x] (a) Pre-stage `tests/` in the WSL image so Step 1 is `cp -r ~/tests ~/nac-iosxe/` — make this the **only** path. Delete the `??? info "Alternative: Create Files Manually"` expandable (30 lines of fallback ceremony for a lab-ops edge case).
  - [ ] Shrink Appendix III from ~24KB to ~3KB — keep only the `access_lists.robot` snippet learners will see rendered by `nac-test`. Point at `~/tests/` in WSL for the full files (`UtilsLib.py`, `iosxe_common.resource`, `url_encode.py`).
  - [ ] Delete Step 7 "Try additional tests (optional)" — optional-inside-optional is a scheduling anti-pattern.
  - [ ] Remove the "Time Check / most laborious task / consider skipping" warning at the top of Task 11 once the slimming lands — it becomes self-defeating once the task is actually short.
  - **Not doing:** (b) `git clone` — pedagogically inverted (git isn't introduced until Task 13) and adds a flaky network dependency. (c) "both" — strictly worse than (a).
- [x] **3.7 — Task 13 — redundant prerequisite copy**
  - Three admonitions in a row at the top (`Prerequisite`, `Why Cleanup is Important`, then another intro paragraph). Collapse into one "Before you start" block.
- [x] **3.8 — Task 15 — missing screenshot + TODO markers**
  - `<!-- TODO: UPDATE OPTIONS (ACCORDING TO SCREENSHOT) -->` and `<!-- TODO: ADD SCREENSHOT -->` at Step 6. Blockers — the merge flow visuals are exactly where a first-time GitLab user loses their way.
- [x] **3.9 — Appendix III (24KB of Robot code) pushes the PDF past what's comfortable**
  - Move the full Robot suite to the repo's `tests/` directory, link to it from the appendix, and keep only the `access_lists.robot` snippet inline. Current file is 440+ lines of scroll.
- [x] **3.10 — `defaults/defaults.yaml` is deleted in git status**
  - `git status` shows `D defaults/defaults.yaml` (and ~70 other files). Either the local state is mid-rework or those deletions need to be committed. Investigate before we start editing — don't want to layer changes on top of a half-done refactor.

---

## 4. Structural / navigational

- [x] **4.1 — `.nav.yml` splits optional tasks into three "Optional" sections**
  - Fine structurally, but the in-page "Next:" links at the bottom of each Task assume a linear flow. E.g., Task 06 tells learners "Optional: Task 07 / Recommended: Task 10", but Task 09 jumps to Task 10. Audit every trailing "Next:" to make sure no learner gets stuck.
- [x] **4.2 — Homepage (`overrides/home.html`) is mostly a CSS block with no visible landing content**
  - 272 lines of CSS, but the `{% block tabs %}` content needs verification. Make sure the homepage has a strong hero section that matches the deck (title, authors, session code, QR or link, quickstart CTA).
- [x] **4.3 — No "estimated time" per task**
  - For a 4-hour instructor-led session, learners need to self-pace. Add a `⏱ ~15 min` badge next to each task heading. Rough estimate based on word-count: Task01 ~10 min, Task02 ~15 min, Task03 ~20 min, Task04–06 ~15 min each, Task07–09 ~10 min each, Task10 ~15 min, Task11 ~25 min, Task12 ~5 min, Task13 ~20 min, Task14 ~15 min, Task15 ~20 min. Worth calibrating with Andrea/Chris.
  - Note: the deck's Slide 14 "Your Lab Journey" already publishes pacing as: `Tasks 01–06: ~90 min | Task 10: ~15 min | Task 12+13: ~30 min | Optional: remaining time`. Align the per-task badges with those block totals.
- [x] **4.4 — Deck Slide 16 "Your Experience with the Tools" is a 7-axis live poll (YAML, Terraform, Git/GitLab, VS Code, IOS XE CLI, NETCONF/RESTCONF/APIs, CI/CD Pipelines)**
  - No matching section in the lab guide. If capturing audience data is intended, add a short "Tell us your experience" link from the lab landing page, or a pre-lab form. Otherwise leave as purely live-poll.

---

## 5. Balu's handoff notes (items flagged by the original author before the next use of the lab)

These were handed over by Balu Novak-Bohak (`balnovak`) from the original Amsterdam delivery. He flagged them as "wanted to do before the next use of the lab" but didn't have time before CL EU. Folding them in now so they're part of the rebrand.

- [x] **5.1 — Switch the lab devices and the guide from RESTCONF to NETCONF**
  - Update the CML device configs to enable NETCONF (and the prerequisite AAA/model-lock config).
  - Rewrite `Task01` to document enabling NETCONF instead of RESTCONF. Update every curl/verification example.
  - Update `.env` so `IOSXE_PROTOCOL=netconf`.
  - Update the GitLab repo's `.env` / pipeline variables accordingly.
  - Retain a short "Why NETCONF over RESTCONF" explainer (transactional semantics, candidate datastore, richer error reporting) — this also fills a real teaching gap.
  - Note: `Task01` currently has two admonitions about RESTCONF vs NETCONF that say "NETCONF support is recent". After this change, they get inverted — keep one admonition noting RESTCONF is still supported as a fallback.
- [x] **5.2 — Remove the separate device inventory file (`devices.nac.yaml`)**
  - Today each device is defined in two files: `devices.nac.yaml` (name + host) *and* `config-device-<name>.nac.yaml` (everything else). Because `iosxe.devices` is a YAML list, this produces duplicate list-entry merging bugs if new attributes get added to either file.
  - Fold `host` into each per-device file so each device has exactly one source of truth.
  - Update `Task02` (which currently sets up `devices.nac.yaml` as its centerpiece) to introduce the unified per-device file pattern instead. This is a material narrative change — Task02 is the learner's first YAML, so the new pattern needs to be introduced clearly.
  - Update the `tree -a` listings in Task 05/07/10 to match the new layout.
  - Update the GitLab repo layout to match.
- [x] **5.3 — Bump module + provider versions to latest**
  - `Task02` currently pins `terraform-iosxe-nac-iosxe` to commit `269527803a951f…` (Jan 15, 2026). Update to the latest tagged release.
  - Check `terraform-provider-iosxe` pinning inside the module and bump if needed.
  - Once bumped, re-run the full lab path locally to confirm no regressions in the YAML schema (attribute renames, enum value changes, etc.).
  - Update `.schema.yaml` copy in the WSL image / GitLab repo if the upstream schema changed.
- [x] **5.4 — Nice-to-have: replace the IP host example in Task 05 with something genuinely device-specific**
  - Today Task 05 uses `ip host ntp-server 198.18.129.11` / `ip host syslog-server 198.18.129.12` on `core`. Realistically these would be **global** on all devices (every device needs to resolve the NTP + syslog server), which undermines the teaching point that "this belongs on a single device."
  - Balu's suggestion: use a **Loopback interface** instead — e.g., `Loopback0 198.51.100.10/32` on `core` with a comment that this is a router-ID / MPLS-LDP-ID use case where each device needs its own unique loopback. This makes the "only on core" framing honest.
  - Bonus: sets up a cleaner thread into Task 08 (BGP can use `router_id_interface_type: Loopback`).

---

## 6. Suggested execution order

1. **Rebrand pass (Section 0)** — global find/replace; unblocks everything else and is safe.
2. **Cleanup pass (Section 1.1, 1.2)** — strip TODO markers, dead HTML comments, Claude attribution, duplicate topology content.
3. **Balu's handoff — structural changes first (Section 5.2, 5.3)** — drop `devices.nac.yaml` inventory file + version bump. These ripple into every task's YAML example, so they have to land before any writing pass, otherwise we re-edit Task02–Task10 twice.
4. **Balu's handoff — protocol swap (Section 5.1)** — RESTCONF → NETCONF. Touches Task01 heavily, and every curl/verification example. Lab-device CML configs need the NETCONF enablement first (pre-work with lab ops).
5. **Balu's handoff — Task 05 example refresh (Section 5.4)** — IP host → Loopback. Small, clean, deferred until after the structural changes so we only edit Task05 once.
6. **Diagram rebuild (Section 2)** — one HTML file, screenshots one by one, diff visually. Deferred until after content stabilizes so diagrams don't need rework.
7. **Writing pass on Intros + Task 01/02 (3.1–3.3)** — first impressions, highest leverage.
8. **Task 06 variable example redesign (3.4)** — properly demonstrate precedence.
9. **Task 08 — re-enable Advanced Challenge (3.5)** — per resolved decision.
10. **Task 11 slimming (3.6)** — per resolved decision (option a).
11. **Task 13/14/15 screenshot + TODO resolution (3.7–3.9)** — pair with a fresh GitLab run to capture up-to-date UI.
12. **Homepage + hero polish (4.2)** — align with the deck's title slide.
13. **Time estimates + nav audit (4.1, 4.3)** — final QA.
14. **Session-code consistency pass on the PPTX (0.3)** — hand the list back to Andrea/Chris for a final deck scrub.

---

## Open decisions

- [x] ~~Task 08 BGP challenge~~ — **Resolved:** keep + reframe as "Advanced Challenge — for learners who finish early" (Section 3.5).
- [x] ~~Task 11 slimming approach~~ — **Resolved:** option (a), pre-stage tests only (Section 3.6).
- [x] ~~Directory rename `ltrops-2323-clemea26` → `ltrxar-2008-clus2026`~~ — **Resolved:** leave as-is for now.
- [ ] `defaults/defaults.yaml` and ~70 other `D` files that appeared in the initial `git status` context — confirmed clean on re-check (only `plan.md` untracked). No action needed unless it re-surfaces.
- [ ] Does lab-ops own enabling NETCONF on the CML devices (Section 5.1), or is that our responsibility? Needs to be confirmed with Asier/Balu before we rewrite Task01.
- [ ] For Section 5.3 (module/provider bump), what's the target version — latest `main` or a specific tagged release? Cisco Services may have a preferred "known-good" tag for the CL window.
