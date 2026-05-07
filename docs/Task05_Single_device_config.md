# Task 05 — Single-device configuration

**⏱ ~15 minutes**

In this task, you'll apply configuration to a **single specific device** rather than globally or to a group. This is the top of the precedence hierarchy — device-specific settings override anything a device might have inherited from its group or from the global defaults.

## Device-specific configuration

Device-specific config is the right tool when a setting is meaningful only for one device. Typical use cases:

- **Intrinsically unique values** — loopback interfaces, router IDs, management IPs, OSPF/BGP/MPLS identifiers — every device needs its **own** value.
- **Overrides** — one device needs to diverge from what its group or the global default says (a different banner on a lab device, a stricter ACL on the border router, etc.).
- **Special-purpose devices** — a single out-of-band management switch that doesn't fit any group.

**Precedence hierarchy (reminder):**

1. **Global** (lowest precedence) — organization-wide defaults ← *Task 03*
2. **Device group** (medium) — role- or location-specific settings ← *Task 04*
3. **Device** (highest) — the specific-device override you're adding now ← *this task*

## Use case: Loopback0 on the core switch

`core` is acting as the routing core of the lab topology. In any routed network, every device needs its **own** unique loopback interface for router IDs (OSPF, BGP, MPLS-LDP) and for policies that key on a stable IP. That's the textbook "single-device configuration" use case — and a cleaner fit than, say, NTP or syslog pointers, which every device in the network would typically need.

You'll configure `core` with:

- `Loopback0` — IP `198.51.100.10/32` (RFC 5737 documentation range), described as "Router-ID loopback"

Only `core` will receive this. The other three devices (`border`, `access01`, `access02`) will be untouched.

## Step 1: Add device-specific configuration

You already created a per-device file for `core` in [Task 02](Task02_Editing_YAML_files.md) — you'll extend it now by adding a `configuration:` block. The file currently registers `core` with NAC; adding `configuration:` tells NAC what to actually push to that specific device.

Open `data/config-device-core.nac.yaml` in VS Code and replace its contents with:

```yaml title="data/config-device-core.nac.yaml" hl_lines="5-13"
---
iosxe:
  devices:
    - name: core
      host: 198.18.130.10
      configuration:
        interfaces:
          loopbacks:
            - id: 0
              description: "Router-ID loopback"
              ipv4:
                address: 198.51.100.10
                address_mask: 255.255.255.255
```

<figure markdown>
  ![Device-specific configuration in VS Code](./assets/vscode-core-config.png){ width="100%" }
</figure>

### Configuration breakdown

**Device section:**

- `devices:` — the top-level device list. Every per-device file contributes exactly one entry here.
- `name: core` — unique device identifier. NAC matches this against the same `name` in other files (global, group, etc.) when it decides what to apply to which device.
- `host: 198.18.130.10` — carries over from Task 02. Same device, same IP, now with configuration attached.
- `configuration:` — everything under this key applies **only to `core`**, no other device.

**Loopback configuration:**

- `interfaces.loopbacks` — the NAC data-model path for virtual loopback interfaces.
- `id: 0` — creates `Loopback0`.
- `description` — free-form description, visible in `show interfaces`.
- `ipv4.address` / `ipv4.address_mask` — IP (RFC 5737 documentation range) and mask. `/32` is conventional for loopbacks used as router IDs.

!!! note "Why a loopback here?"
    A loopback is the canonical single-device configuration. Every device in a routed network needs its **own** unique loopback interface for router-ID (OSPF, BGP, MPLS-LDP, etc.), so this example naturally belongs under device-specific config rather than global or group config. It's the pattern you'll use any time a setting is meaningful only in the context of one specific device.

!!! note "What about NTP, syslog, DNS entries?"
    The lab also has `ntp-server` (`198.18.129.11`) and `syslog-server` (`198.18.129.12`) reachable from every device. Things like those — an `ntp server` pointer, a `logging host` — should typically be **global** (every device needs to know about them), not device-specific. That's a good exercise to try at home.

### File Organization

At this point, your `data/` folder contains multiple YAML files, each serving a different purpose:

```text { .no-copy hl_lines="8" }
/home/cisco/nac-iosxe/
├── .env
├── main.tf
└── data/
    ├── config-device-access01.nac.yaml  # Device-specific (placeholder)
    ├── config-device-access02.nac.yaml  # Device-specific (placeholder)
    ├── config-device-border.nac.yaml    # Device-specific (placeholder)
    ├── config-device-core.nac.yaml      # Device-specific (IP hosts) ← This task
    ├── config-global.nac.yaml           # Global configuration (banner) ← Task03
    ├── config-group-access.nac.yaml     # Device Group configuration (ACL) ← Task04
    └── devices.nac.yaml                 # Device inventory (name + host) ← Task02
```

!!! tip "File Organization"
    This modular approach keeps configurations organized and easy to maintain.

    This is how the files are organized for this lab guide, but you can organize your own projects in whatever way makes sense for your design.


## Step 2: Apply Device-Specific Configuration

Open your WSL Ubuntu terminal and run the following steps:

Navigate to your project directory:

```bash
cd ~/nac-iosxe
```

Optionally, preview the changes Terraform will make:

```bash
terraform plan
```

Apply the configuration:

```bash
terraform apply
```

When prompted, type `yes` to confirm the deployment. Terraform will create the IP host entries only on the core device.

**What to observe in the plan output:**

- Terraform shows changes only for the **core** device
- No changes are proposed for **border**, **access01**, or **access02**

<figure markdown>
  ![Terraform Apply core](./assets/terraform-apply-core.png){ width="80%" }
</figure>

## Step 3: Verify Device-Specific Configuration

After successfully running `terraform apply`, verify that the IP host entries were deployed only to the core switch.

**Verify on core Switch (should have the configuration)**

1. Open **Solar-PuTTY** from your desktop
2. Connect to the **core** switch
3. Run the verification commands below

**Verification via host resolution and ping:**

```
ping vrf Mgmt-vrf ntp-server
```

```
ping vrf Mgmt-vrf syslog-server
```


```text { title="Expected Output" .no-copy }
core#ping vrf Mgmt-vrf ntp-server
Type escape sequence to abort.
Sending 5, 100-byte ICMP Echos to 198.18.129.11, timeout is 2 seconds:
!!!!!
Success rate is 100 percent (5/5), round-trip min/avg/max = 1/1/2 ms
core#ping vrf Mgmt-vrf syslog-server
Type escape sequence to abort.
Sending 5, 100-byte ICMP Echos to 198.18.129.12, timeout is 2 seconds:
!!!!!
Success rate is 100 percent (5/5), round-trip min/avg/max = 1/201/1002 ms
core#
```


**Verification via `show hosts`**

```
show hosts vrf Mgmt-vrf
```

```text { title="Expected Output" .no-copy }
core#show hosts vrf Mgmt-vrf
Name lookup VRF: Mgmt-vrf
Default domain is not set
Name servers are 255.255.255.255
NAME  TTL  CLASS   TYPE      DATA/ADDRESS
-----------------------------------------
11.129.18.198.in-addr.arpa     10      IN      PTR     ntp-server
12.129.18.198.in-addr.arpa     10      IN      PTR     syslog-server
ntp-server     10      IN      A       198.18.129.11
syslog-server  10      IN      A       198.18.129.12

core#
```


<!-- ??? info "Verification via `show run | include ip host`"
    ```bash
    show run | include ip host
    ```

    ???+ quote "Expected output"
        ```
        core#show run | include ip host
        ip host vrf Mgmt-vrf ntp-server 198.18.129.11
        ip host vrf Mgmt-vrf syslog-server 198.18.129.12
        core#
        ``` -->

You should see both IP host entries configured on the **core** switch.


**Verify on Other Devices (should NOT have the configuration)**

Connect to the **border** switch and run the same command:

```bash
show run | include ip host
```

**Expected output on border:**

The command should return no output, confirming that the IP host entries were NOT applied to the border switch.


!!! note "Key observation"
    The IP host configuration only appears on the **core** device because it was defined under the device-specific configuration section.


## Configuration Hierarchy Comparison

Now that you've completed Tasks 03, 04, and 05, you've experienced all three levels of the configuration hierarchy. Here's a summary:

| Level            | Scope             | Example      | File                           |
|------------------|-------------------|--------------|--------------------------------|
| **Global**       | All devices       | Login banner | `config-global.nac.yaml`       |
| **Device Group** | Subset of devices | Standard ACL | `config-group-access.nac.yaml` |
| **Device**       | Single device     | IP hosts     | `config-device-core.nac.yaml`  |

In case of conflicting settings, the higher precedence level overrides the lower. For example, you can have a global banner, and configure a different banner for a specific device.

<figure markdown>
  ![Configuration Hierarchy](./assets/config-hierarchy-light.png#only-light){ width="50%" }
  ![Configuration Hierarchy](./assets/config-hierarchy-dark.png#only-dark){ width="50%" }
</figure>

## When to Use Each Configuration Level

| Use Case                                                      | Recommended Level |
|---------------------------------------------------------------|-------------------|
| Organization-wide standards (banners, NTP, logging)           | **Global**        |
| Role-based settings (ACLs for access layer, routing for core) | **Device Group**  |
| Location-specific settings (site-specific config, Timezone)   | **Device Group**  |
| Unique device requirements (management IPs, special features) | **Device**        |
| Overriding group or global settings for one device            | **Device**        |

## What You've Accomplished

In this task, you have:

- ✅ Learned about device-specific configuration
- ✅ Created a dedicated NAC YAML file for core switch configuration
- ✅ Configured IP host entries for infrastructure services
- ✅ Verified selective deployment to a single device only
- ✅ Understood the configuration precedence hierarchy: Global < Device Group < Device

You've now mastered all three levels of the Network-as-Code configuration hierarchy: Global, Device Group, and Device-specific configurations!

---

**Next:** [Task06 - Variables](Task06_Variables.md)
