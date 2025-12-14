In this task, you'll learn how to use **templates of type 'cli'** to inject raw CLI commands directly into your device configuration. The `cli` template type is useful when you need to configure features that aren't yet supported by the YAML data model, or when you have legacy CLI configurations you want to integrate.

## Understanding 'cli' Templates

The `cli` template type allows you to include raw IOS XE CLI commands that are pushed directly to devices. This is the most flexible template type, as it accepts any valid CLI command.

**Template Types (reminder):**

| Type | Description | Use Case |
|------|-------------|----------|
| `model` | YAML-based configuration template | Standard configurations (VLANs, ACLs, etc.) - *Task06* |
| `file` | External file reference | Large configurations stored separately - *Task07* |
| `cli` | Raw CLI commands | Legacy or complex CLI configurations - *This task* |

**When to use 'cli' templates:**

- **Unsupported features**: Configuration not yet in the [YAML data model](https://netascode.cisco.com/docs/data_models/iosxe/overview/)
- **Temporary workarounds**: Quick fixes before proper YAML support is added

!!! warning "Use with Caution"
    While `cli` templates are powerful, prefer `model` and `file`  templates when possible. YAML-based configurations provide better validation, consistency, and are easier to maintain.

## Use Case: Custom Logging Configuration

In this example, you'll configure advanced logging settings using a `cli` template. Logging configuration is a common use case where CLI templates provide flexibility.

## Step 1: Create the CLI Template

First, create the file using your **WSL Ubuntu terminal**:

```bash
touch ~/nac-iosxe/data/template-logging.nac.yaml
```

Then open `data/template-logging.nac.yaml` in VS Code and add the following content:

```yaml
iosxe:
  templates:
    - name: enhanced_logging
      type: cli
      content: |
        logging buffered 16384 informational
        logging console critical
        logging monitor warnings
        logging trap notifications
        logging host 198.18.133.1
        service timestamps log datetime msec localtime show-timezone
        service timestamps debug datetime msec localtime show-timezone
```

This template:

- **type: cli**: Specifies raw CLI commands
- **content**: Multi-line string containing the actual CLI commands
- Configures comprehensive logging with buffer, console, monitor, and remote syslog settings

## Step 2: Apply the Template to Device Groups

Now you can add the logging template to your existing device group files. 

**Update `data/config-group-access-templates.nac.yaml`** to include the logging template:

```yaml
iosxe:
  device_groups:
    - name: ACCESS_SWITCHES
      devices:
        - access01
        - access02
      templates:
        - access_switch_vlans
        - enhanced_logging
```

**Update `data/config-group-border-templates.nac.yaml`** to include the logging template:

```yaml
iosxe:
  device_groups:
    - name: BORDER
      devices:
        - border
      templates:
        - bgp_isp_peering
        - enhanced_logging
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

**What's new:**

- **ACCESS_SWITCHES** group now includes both `access_switch_vlans` and `enhanced_logging` templates
- **BORDER group** now includes both `bgp_isp_peering` and `enhanced_logging` templates

!!! note "Template Organization"
    Notice how the `enhanced_logging` template is applied to both access switches and the border switch, while `bgp_isp_peering` is only applied to the border switch. Device groups make it easy to manage which templates apply to which devices.

## Step 3: Deploy the Configuration

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
    After running `terraform plan`, open the `model.yaml` file in VS Code to see how CLI templates are expanded and merged with other configurations. Notice how the raw CLI commands appear in the merged model alongside YAML-based configurations.

## Step 4: Verify the Configuration

Use **Solar-PuTTY** to connect to one of the configured devices (as described in Task 1). Double-click on **CORE** or **ACCESS01** in the device list to connect.

Check logging configuration:

```
show running-config | section logging
```

Expected output:

```
logging buffered 16384 informational
logging console critical
logging monitor warnings
logging trap notifications
logging host 198.18.133.1
service timestamps log datetime msec localtime show-timezone
service timestamps debug datetime msec localtime show-timezone
```

## Combining Template Types

You can combine different template types for the same device group. For example, the access switches can use both the VLAN template from Task06 and the logging template from this task:

```yaml
iosxe:
  device_groups:
    - name: DEVICE_GROUP_ACCESS
      devices:
        - access01
        - access02
      templates:
        - access_switch_vlans   # model template from Task06
        - enhanced_logging      # cli template from this task
```

This applies both templates to all devices in the `DEVICE_GROUP_ACCESS` group.

## What You've Accomplished

- ✅ Created a `cli` type template with raw CLI commands
- ✅ Applied the template to multiple devices
- ✅ Deployed advanced logging configuration
- ✅ Learned when to use `cli` templates vs other types

## Template Type Summary

You've now learned all three template types:

| Task | Template Type | Example Use Case |
|------|---------------|------------------|
| Task06 | `model` | VLAN configuration in YAML format |
| Task07 | `file` | BGP configuration from external file |
| Task08 | `cli` | Logging configuration as raw CLI |

Choose the appropriate template type based on your configuration needs and maintainability requirements






