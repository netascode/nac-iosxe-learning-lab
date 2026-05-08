# Getting started

You'll access the lab through a Web RDP session to the dCloud **Windows 10 VM** at `198.18.133.20` (user `admin`, password `cisco`). Everything you need - VS Code, Solar-PuTTY, WSL Ubuntu, and Chrome - is already installed on that VM.

!!! tip "Work from inside the VM, not your laptop"
    The lab guide is already set as the Chrome start page on the Win10 VM, and it's bookmarked for later. Read the guide from inside the RDP session - copy/paste between your laptop and the Web RDP window is finicky, and you will be pasting YAML into VS Code and commands into the WSL terminal constantly.

For the full topology diagram and device inventory, see **[Topologies](Intro05_topologies.md)** (also linked from the top navigation bar throughout the lab).

## How the tasks flow

!!! info "Tasks are sequential - each builds on the previous one"
    The **Recommended** path (Tasks 01 through 06, then 10, 12, 13) is
    designed to be followed **in order**. Each task uses configuration,
    files, or state produced by earlier tasks. Skipping a task means the
    next one's instructions won't match what's on your disk.

    **Optional** tasks (07-09 Templates, 11 Post-checks, 14 Extended
    pipeline, 15 Merge requests) can be cherry-picked based on your
    interest and remaining time. Where the order of optionals matters
    (e.g. Task 11 must run before Task 12 destroys its artifacts), the
    affected task page has its own callout at the top.

    **If you have ~90 minutes only:** Tasks 01 -> 02 -> 03 -> 05 -> 06 ->
    10 -> 12 -> 13 gets you through the full "write intent, validate,
    deploy via CI/CD" loop. Skip Task 04 and all Optional tasks.

## Readiness check (2 minutes, before Task 01)

Before sinking time into the first task, confirm the lab's three moving
pieces are actually reachable. Run these from your **WSL Ubuntu**
terminal inside the Win10 VM:

```bash
# 1. Can you reach a lab device over SSH?
ssh -o StrictHostKeyChecking=no cisco@198.18.130.10 "show version | include Cisco IOS"
# expect: "Cisco IOS XE Software, Version ..." on one line

# 2. Can you reach GitLab?
curl -sk https://198.18.133.101 -o /dev/null -w "gitlab HTTP %{http_code}\n"
# expect: gitlab HTTP 200  (self-signed cert is fine; -k skips verification)

# 3. Is Terraform on your PATH?
terraform version | head -1
# expect: "Terraform v1.x.x"
```

If all three print the expected output, you're ready. If any fails, flag
it to a lab proctor now rather than hitting it mid-task.

---

**← Previous:** [Disclaimer](Intro03_disclaimer.md)  ·  **Next:** [Task 01 - SSH to Devices](Task01_SSH_to_network_devices.md)
