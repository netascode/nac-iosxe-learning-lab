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
| `${ }` | Variable interpolation | `${bgp_asn}` |
| `%{ }` | Control structures | `%{ for neighbor in bgp_neighbors }` |
| `~` | Whitespace stripping | `%{~ endfor ~}` |

**Template Types (reminder):**

| Type | Description | Use Case |
|------|-------------|----------|
| `model` | YAML-based inline configuration | Standard configs - *Task06* |
| `file` | External `.tftpl` template files | Dynamic configs with variables - *This task* |
| `cli` | Raw CLI commands inline | Features not in data model - *Task08* |

## Use Case: BGP Configuration on BORDER Switch

In this example, you'll configure BGP on the **BORDER** switch for peering with ISP providers. The template will use variables to define BGP neighbors dynamically.

!!! info "Lab Scenario"
    The BORDER switch connects to two ISP providers:
    
    - **ISP1** (198.18.100.1) - Currently active and pre-configured in the lab
    - **ISP2** (198.18.100.5) - Placeholder for a future connection that will be deployed as part of a network migration project
    
    When you verify the BGP configuration, the **ISP1 neighbor will show as Established**, while **ISP2 will show as Idle** (since the remote end is not yet configured).

## Step 1: Create the Templates Directory

First, create a templates directory inside your data folder:

```bash
mkdir -p ~/nac-iosxe/data/templates
```

## Step 2: Create the Template File

Create a new file `data/templates/bgp_config.yaml.tftpl` with the following content:

```text
bgp:
  asn: ${bgp_asn}
  router_id_loopback: ${router_id_loopback}
  neighbors:
%{ for neighbor in bgp_neighbors ~}
    - ip: ${neighbor.ip}
      remote_as: ${neighbor.remote_as}
      description: "${neighbor.description}"
%{ endfor ~}
```

This template uses:

- **`${bgp_asn}`**: Variable for the local AS number
- **`${router_id_loopback}`**: Variable for router-ID loopback interface
- **`%{ for neighbor in bgp_neighbors }`**: Loop through list of neighbors
- **`${neighbor.ip}`**, **`${neighbor.remote_as}`**: Access neighbor attributes

## Step 3: Update devices.nac.yaml with Template and Variables

Update your `data/devices.nac.yaml` to include the template definition and apply it to the BORDER switch. Here's the complete file:

```yaml
iosxe:
  templates:
    - name: BGP_ISP_PEERING
      type: file
      file: templates/bgp_config.yaml.tftpl

  global:
    configuration:
      banner:
        login: "Welcome to Network-as-Code Lab"
  
  devices:
    - name: core
      host: 198.18.130.10
    - name: border
      host: 198.18.130.20
      templates:
        - BGP_ISP_PEERING
      variables:
        bgp_asn: 65000
        router_id_loopback: 0
        bgp_neighbors:
          - ip: 198.18.100.1
            remote_as: 65001
            description: eBGP to ISP1 - Production
          - ip: 198.18.100.5
            remote_as: 65002
            description: eBGP to ISP2 - Future Migration
    - name: access01
      host: 198.18.130.11
    - name: access02
      host: 198.18.130.12
```

**What's new in this configuration:**

- **`templates:`** (at the top) - Defines the BGP_ISP_PEERING template:
  - **`name`**: Unique identifier for the template
  - **`type: file`**: Specifies this is a file-based template
  - **`file`**: Relative path to the `.tftpl` template file
- **`templates:`** (on BORDER device) - References the template by name
- **`variables:`** - Defines the values that will be substituted in the template

**Variable Breakdown:**

- **`bgp_asn: 65000`**: BORDER switch AS number
- **`router_id_loopback: 0`**: Uses Loopback0 IP as BGP router-ID
- **`bgp_neighbors`**: List of ISP neighbors:
  - **ISP1** (65001): Active production peer
  - **ISP2** (65002): Placeholder for future network migration

!!! note "Template Scope"
    The BGP template is only applied to the BORDER switch because only BORDER has the `templates:` and `variables:` attributes. The other devices (CORE, ACCESS01, ACCESS02) continue to receive only the global banner configuration.

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

## Step 5: Verify BGP Configuration

Use **Solar-PuTTY** to connect to the BORDER switch and verify the BGP configuration:

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

- ✅ Created a `.tftpl` template file with Terraform templating syntax
- ✅ Used variable interpolation (`${ }`) for dynamic values
- ✅ Used loops (`%{ for }`) for multiple BGP neighbors
- ✅ Configured BGP peering on BORDER switch for ISP connectivity
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

