In this task, you'll learn how to use **templates of type 'file'** to reference external template files with dynamic content generation. The `file` template type uses Terraform templating syntax (`.tftpl` files) for complex configurations with loops, conditionals, and variable interpolation.

For detailed documentation, see: [IOS XE Template Documentation](https://netascode.cisco.com/docs/data_models/iosxe/entity/template/#file-templates)

## Understanding 'file' Templates

File templates reference external `.tftpl` files that use **Terraform templating syntax**. This is ideal for:

- **Dynamic configurations**: Configurations with loops and conditionals
- **Variable-driven content**: Same template with different values per device
- **Complex structures**: Multi-line configurations that need programmatic generation

**Terraform Templating Syntax:**

| Syntax | Purpose | Example |
|--------|---------|---------|
| `${ }` | Variable interpolation | `${bgp_as_number}` |
| `%{ }` | Control structures | `%{ for neighbor in bgp_neighbors }` |
| `~` | Whitespace stripping | `%{~ endfor ~}` |

**Template Types (reminder):**

| Type | Description | Use Case |
|------|-------------|----------|
| `model` | YAML-based inline configuration | Standard configs - *Task06* |
| `file` | External `.tftpl` template files | Dynamic configs with variables - *This task* |
| `cli` | Raw CLI commands inline | Features not in data model - *Task08* |

## Use Case: BGP Configuration on border Switch

In this example, you'll configure BGP on the **border** switch for peering with ISP providers. The template will use variables to define BGP neighbors dynamically.

!!! info "Lab Scenario"
    The **border** switch connects to two ISP providers:
    
    - **ISP1** (198.18.100.1) - Currently active and pre-configured in the lab
    - **ISP2** (198.18.100.5) - Placeholder for a future connection that will be deployed as part of a network migration project
    
    When you verify the BGP configuration, the **ISP1 neighbor will show as Established**, while **ISP2 will show as Idle** (since the remote end is not yet configured).

## Step 1: Create the Template File

First, create the `tftpl` directory and the template file using your **WSL Ubuntu terminal**:

```bash
mkdir -p ~/nac-iosxe/tftpl
touch ~/nac-iosxe/tftpl/bgp.yaml.tftpl
```

Then open `tftpl/bgp.yaml.tftpl` in VS Code and add the following content:

```text
routing:
  bgp:
    as_number: ${bgp_as_number}
    neighbors:
%{ for neighbor in bgp_neighbors ~}
      - ip: ${neighbor.ip}
        remote_as: ${neighbor.remote_as}
        description: "${neighbor.description}"
%{ endfor ~}
```

This template uses:

- **`routing: bgp:`**: BGP configuration must be nested under `routing` per the NAC IOS XE schema
- **`${bgp_as_number}`**: Variable for the local AS number
- **`%{ for neighbor in bgp_neighbors }`**: Loop through list of neighbors
- **`${neighbor.ip}`**, **`${neighbor.remote_as}`**: Access neighbor attributes

## Step 2: Create the Template Definition File

Create a new file `data/template-bgp.nac.yaml` that defines the template:

```bash
touch ~/nac-iosxe/data/template-bgp.nac.yaml
```

Then open `data/template-bgp.nac.yaml` in VS Code and add the following content:

```yaml
iosxe:
  templates:
    - name: bgp_isp_peering
      type: file
      file: tftpl/bgp.yaml.tftpl
```

This separates the template definition from the device configuration, making it easier to manage and reuse.

## Step 3: Apply the Template to Border Device

Now create a file to apply the BGP template to the border switch with the required variables:

```bash
touch ~/nac-iosxe/data/config-group-border-templates.nac.yaml
```

Then open `data/config-group-border-templates.nac.yaml` in VS Code and add the following content:

```yaml
iosxe:
  device_groups:
    - name: BORDER
      devices:
        - border
      templates:
        - bgp_isp_peering
      variables:
        bgp_as_number: 65000
        bgp_neighbors:
          - ip: 198.18.100.1
            remote_as: 65001
            description: eBGP to ISP1 - Production
          - ip: 198.18.100.5
            remote_as: 65002
            description: eBGP to ISP2 - Future Migration
```

**What's in this configuration:**

- **`device_groups:`** - Groups devices by role for easier template management
- **`name: BORDER`** - Group name for border devices
- **`devices:`** - List of devices in the group (just **border** in this case)
- **`templates:`** - References the `bgp_isp_peering` template defined in `template-bgp.nac.yaml`
- **`variables:`** - Variables that will be substituted into the template

**Variable Breakdown:**

- **`bgp_as_number: 65000`**: **border** switch AS number
- **`bgp_neighbors`**: List of ISP neighbors:
  - **ISP1** (65001): Active production peer
  - **ISP2** (65002): Placeholder for future network migration

!!! note "Template Scope with Device Groups"
    The BGP template is applied to the **border** switch through the `DEVICE_GROUP_BORDER` device group. This approach makes it easy to add more border switches in the future - just add them to the `devices` list in the group.

## Step 4: Deploy the Configuration

Open your WSL Ubuntu terminal and run the following steps:

**Step 1:** Navigate to your project directory:

```bash
cd ~/nac-iosxe
```

**Step 2:** Preview the changes Terraform will make:

```bash
terraform plan
```

**Step 3:** Apply the configuration:

```bash
terraform apply
```

When prompted, type `yes` to confirm the deployment.

!!! tip "View the Merged Model"
    After running `terraform plan`, open the `model.yaml` file in VS Code to see how the BGP template file is rendered with your variables and merged into the complete data model. The `model.yaml` file is located in the main project directory, so it will appear just below `main.tf` in VS Code's Explorer panel. This shows exactly what configuration will be applied to the device.

## Step 5: Verify BGP Configuration

Use **Solar-PuTTY** to connect to the **border** switch and verify the BGP configuration:

```bash
show ip bgp summary
```

**Expected output:**

```
BGP router identifier 198.18.130.20, local AS number 65000

Neighbor        V    AS MsgRcvd MsgSent   TblVer  InQ OutQ Up/Down  State/PfxRcd
198.18.100.1    4 65001      15      18        1    0    0 00:08:32        2
198.18.100.5    4 65002       0       0        0    0    0 never    Idle
```

**Understanding the output:**

| Neighbor | Status | Explanation |
|----------|--------|-------------|
| 198.18.100.1 (ISP1) | **Established** (shows prefix count) | Active peer - ISP1 is pre-configured in the lab |
| 198.18.100.5 (ISP2) | **Idle** | Expected - ISP2 is a placeholder for future migration |

!!! tip "This is Expected Behavior"
    The ISP2 neighbor showing as **Idle** is expected. In real-world scenarios, you often pre-configure BGP neighbors before the remote end is ready. This allows for seamless cutover during network migrations.

## What You've Accomplished

- ✅ Created a `.tftpl` template file with Terraform templating syntax in `tftpl/` folder
- ✅ Created a separate template definition file (`template-bgp.nac.yaml`)
- ✅ Used variable interpolation (`${ }`) for dynamic values
- ✅ Used loops (`%{ for }`) for multiple BGP neighbors
- ✅ Applied templates using device groups (`DEVICE_GROUP_BORDER`)
- ✅ Configured BGP peering on **border** switch for ISP connectivity
- ✅ Understood expected behavior with pre-configured but inactive peers

## Template Variable Precedence

Variables can be defined at multiple levels. Higher levels override lower:

1. **Device-level variables** (highest priority)
2. **Device group variables**
3. **Global variables** (lowest priority)

This allows you to define default values globally and override them per device.

## When to Use Each Template Type

| Scenario | Recommended Type |
|----------|------------------|
| Standard YAML configurations | `model` |
| Dynamic configs with loops/conditionals | `file` |
| Configs with device-specific variables | `file` |
| Raw CLI for unsupported features | `cli` |
| Simple, static configurations | `model` |

