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
| `${ }` | Variable interpolation | `${BGP_AS_NUMBER}` |
| `%{ }` | Control structures | `%{ for neighbor in BGP_NEIGHBORS }` |
| `~` | Whitespace stripping | `%{~ endfor ~}` |

**Template Types (reminder):**

| Type | Description | Use Case |
|------|-------------|----------|
| `model` | YAML-based inline configuration | Standard configs - *Task07* |
| `file` | External `.tftpl` template files | Dynamic configs with variables - *This task* |
| `cli` | Raw CLI commands inline | IOS XE features not in NAC data model - *Task09* |

## Use Case: BGP Configuration on border Switch

In this example, you'll configure BGP on the **border** switch for peering with ISP providers. The template will use variables to define BGP neighbors dynamically.

!!! info "Lab Scenario"
    The **border** switch connects to two ISP providers:
    
    - **isp1** (198.18.100.1) - Currently active and pre-configured in the lab
    - **isp2** (198.18.100.5) - Placeholder for a future connection that will be deployed as part of a network migration project
    
    When you verify the BGP configuration, the **isp1 neighbor will show as Established**, while **isp2 will show as Idle** (since the remote end is not yet configured).

## Step 1: Create the Template File

First, create the `tftpl` directory and the template file using your **WSL Ubuntu terminal**:

```bash
mkdir -p ~/nac-iosxe/tftpl
```

```bash
touch ~/nac-iosxe/tftpl/bgp.yaml.tftpl
```

Then open `tftpl/bgp.yaml.tftpl` in VS Code and add the following content:

```text
routing:
  bgp:
    as_number: ${BGP_AS_NUMBER}
    neighbors:
%{ for neighbor in BGP_NEIGHBORS ~}
      - ip: ${neighbor.ip}
        remote_as: ${neighbor.remote_as}
        description: "${neighbor.description}"
%{ endfor ~}
```

This template uses:

- **`routing: bgp:`**: BGP configuration must be nested under `routing` per the NAC IOS XE schema
- **`${BGP_AS_NUMBER}`**: Variable for the local AS number
- **`%{ for neighbor in BGP_NEIGHBORS }`**: Loop through list of neighbors
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

Now open the existing `data/config-device-border.nac.yaml` file in VS Code (this was created as a placeholder in Task05) and add the template reference with variables:

```yaml
iosxe:
  devices:
    - name: border
      templates:
        - bgp_isp_peering
      variables:
        BGP_AS_NUMBER: 65000
        BGP_NEIGHBORS:
          - ip: 198.18.100.1
            remote_as: 65001
            description: eBGP to isp1 - Production
          - ip: 198.18.100.5
            remote_as: 65002
            description: eBGP to isp2 - Future Migration
```

**What's in this configuration:**

- **`devices:`** - Device-specific configuration
- **`name: border`** - The **border** switch where BGP will be configured
- **`templates:`** - References the `bgp_isp_peering` template defined in `template-bgp.nac.yaml`
- **`variables:`** - Variables that will be substituted into the template

**Variable Breakdown:**

- **`BGP_AS_NUMBER: 65000`**: **border** switch AS number
- **`BGP_NEIGHBORS`**: List of ISP neighbors:
  - **isp1** (65001): Active production peer
  - **isp2** (65002): Placeholder for future network migration

!!! note "Device-Level Templates"
    Templates can be applied directly to individual devices, as shown here. This is ideal when a template is specific to a single device. For templates shared across multiple devices, you can use device groups (as we did with VLANs in Task07).

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
| 198.18.100.1 (isp1) | **Established** (shows prefix count) | Active peer - isp1 is pre-configured in the lab |
| 198.18.100.5 (isp2) | **Idle** | Expected - isp2 is a placeholder for future migration |

!!! tip "This is Expected Behavior"
    The isp2 neighbor showing as **Idle** is expected. In real-world scenarios, you often pre-configure BGP neighbors before the remote end is ready. This allows for seamless cutover during network migrations.

## What You've Accomplished

- ✅ Created a `.tftpl` template file with Terraform templating syntax in `tftpl/` folder
- ✅ Created a separate template definition file (`template-bgp.nac.yaml`)
- ✅ Used variable interpolation (`${ }`) for dynamic values
- ✅ Used loops (`%{ for }`) for multiple BGP neighbors
- ✅ Applied templates at device level to the **border** switch
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
| IOS XE features not in NAC data model | `cli` |
| Simple, static configurations | `model` |

---

**Next Steps:**

You can continue exploring **optional** template tasks or proceed to the **mandatory** path:

- **Optional:** [Task09 - Templates Type CLI](Task09_Templates_type_cli.md) - Learn how to use raw CLI commands for unsupported features
- **Mandatory:** [Task10 - Schema Validation](Task10_Schema_validation.md) - Skip remaining templates and continue with pre-change validation

