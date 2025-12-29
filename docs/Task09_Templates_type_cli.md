In this task, you'll learn how to use **templates of type 'cli'** to inject raw CLI commands directly into your device configuration. The `cli` template type is useful when you need to configure IOS XE features that aren't yet supported by the NAC data model.

## Understanding 'cli' Templates

The `cli` template type allows you to include raw IOS XE CLI commands that are pushed directly to devices. This is the most flexible template type, as it accepts any valid CLI command.

**Template Types (reminder):**

| Type    | Description                       | Use Case                                               |
|---------|-----------------------------------|--------------------------------------------------------|
| `model` | YAML-based configuration template | Standard configurations (VLANs, ACLs, etc.) ← *Task07* |
| `file`  | External `.tftpl` template files  | Large configurations stored separately ← *Task08*      |
| `cli`   | Raw CLI commands                  | IOS XE features not in NAC data model ← *This task*    |


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

```yaml title="data/template-logging.nac.yaml"
---
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

**Update `data/config-group-access.nac.yaml`** to include the logging template:

```yaml title="data/config-group-access.nac.yaml"
---
iosxe:
  device_groups:
    - name: ACCESS_SWITCHES
      devices:
        - access01
        - access02
      configuration:
        access_lists:
          standard:
            - name: AccessLayerACL
              entries:
                - sequence: 10
                  action: permit
                  prefix: 10.0.0.0
                  prefix_mask: 0.0.0.255
                - sequence: 20
                  action: permit
                  prefix: 20.0.0.0
                  prefix_mask: 0.0.0.255
      templates:
        - access_switch_vlans
        - enhanced_logging  # This is the line we add to apply the template
```

**Update `data/config-device-border.nac.yaml`** to include the logging template:

```yaml title="data/config-device-border.nac.yaml"
---
iosxe:
  devices:
    - name: border
      templates:
        - bgp_isp_peering
        - enhanced_logging # This is the line we add to apply the template
      variables:
        bgp_as_number: 65000
        bgp_neighbors:
          - ip: 198.18.100.1
            remote_as: 65001
            description: eBGP to isp1 - Production
          - ip: 198.18.100.5
            remote_as: 65002
            description: eBGP to isp2 - Future Migration
```

**What's new:**

- **ACCESS_SWITCHES** group now includes both `access_switch_vlans` and `enhanced_logging` templates
- **border** device now includes both `bgp_isp_peering` and `enhanced_logging` templates

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

Use **Solar-PuTTY** to connect to one of the configured devices (as described in Task 1). Double-click on **access01** or **border** in the device list to connect (these are the devices where logging was applied).

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
```


## What You've Accomplished

- ✅ Created a `cli` type template with raw CLI commands
- ✅ Applied the template to multiple devices
- ✅ Deployed advanced logging configuration
- ✅ Learned when to use `cli` templates vs other types

## Template Type Summary

You've now learned all three template types:

| Task | Template Type | Example Use Case |
|------|---------------|------------------|
| Task07 | `model` | VLAN configuration in YAML format |
| Task08 | `file` | BGP configuration from external file |
| Task09 | `cli` | Logging configuration as raw CLI |

Choose the appropriate template type based on your configuration needs and maintainability requirements.

---

**Next:** [Task10 - Schema Validation](Task10_Schema_validation.md)






