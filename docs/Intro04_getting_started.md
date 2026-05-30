# Getting started

You'll access the lab through a Web RDP session to the dCloud **Windows 10 VM** at `198.18.133.20` (user `admin`, password `cisco`). Everything you need - VS Code, Solar-PuTTY, WSL Ubuntu, and Chrome - is already installed on that VM. You'll open the **WSL Ubuntu terminal** frequently throughout the lab — it's the orange Ubuntu icon on the desktop labelled **Ubuntu 22.04.5 LTS**.

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
pieces are actually reachable. Open the **WSL Ubuntu terminal** — it's
the orange Ubuntu icon on the desktop labelled **Ubuntu 22.04.5 LTS** —
and run these three commands:

```bash
# 1. Can you reach a lab device over SSH?
ssh -o StrictHostKeyChecking=no cisco@198.18.130.10 "show version | include Cisco IOS"
```

```text { .no-copy }
Warning: Permanently added '198.18.130.10' (RSA) to the list of known hosts.
(cisco@198.18.130.10) Password:

Cisco IOS XE Software, Version 17.15.01
Cisco IOS Software [IOSXE], Catalyst L3 Switch Software (CAT9K_IOSXE), Version 17.15.1, RELEASE SOFTWARE (fc4)
Cisco IOS-XE software, Copyright (c) 2005-2024 by Cisco Systems, Inc.
All rights reserved.  Certain components of Cisco IOS-XE software are

client_loop: send disconnect: Broken pipe
```

!!! tip "Password prompt or access denied is fine here"
    The goal of this check is simply that the device **responds**. If it prompts for a password, SSH is working. If it says `Permission denied` or drops the connection after login, the device is reachable and healthy. Only flag it to a proctor if the command hangs or times out with no output.

```bash
# 2. Can you reach GitLab?
curl -sk https://198.18.133.101 -o /dev/null -w "gitlab HTTP %{http_code}\n"
```

```text { .no-copy }
gitlab HTTP 200
```

```bash
# 3. Is Terraform on your PATH?
terraform version | head -1
```

```text { .no-copy }
Terraform v1.12.2
```

If all three produce the expected output, you're ready. If any fails, flag
it to a lab proctor now rather than hitting it mid-task.

---

**← Previous:** [Disclaimer](Intro03_disclaimer.md)  ·  **Next:** [Task 01 - SSH to Devices](Task01_SSH_to_network_devices.md)
