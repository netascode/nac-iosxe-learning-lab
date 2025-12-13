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

- **Unsupported features**: Configuration not yet in the [YAML data model](https://netascode.cisco.com/docs/data_models/)
- **Temporary workarounds**: Quick fixes before proper YAML support is added

!!! warning "Use with Caution"
    While `cli` templates are powerful, prefer `model` and `file`  templates when possible. YAML-based configurations provide better validation, consistency, and are easier to maintain.

## Use Case: Custom Logging Configuration

In this example, you'll configure advanced logging settings using a `cli` template. Logging configuration is a common use case where CLI templates provide flexibility.

## Step 1: Create the CLI Template

Create a new file `data/logging_template.nac.yaml` with the following content:

```yaml
templates:
  - name: enhanced_logging
    type: cli
    content: |
      logging buffered 16384 informational
      logging console critical
      logging monitor warnings
      logging trap notifications
      logging source-interface Loopback0
      logging host 198.18.133.1
      service timestamps log datetime msec localtime show-timezone
      service timestamps debug datetime msec localtime show-timezone
```

This template:

- **type: cli**: Specifies raw CLI commands
- **content**: Multi-line string containing the actual CLI commands
- Configures comprehensive logging with buffer, console, monitor, and remote syslog settings

## Step 2: Apply the Template to Devices

Update your `data/devices.nac.yaml` to apply the template to desired devices:

```yaml
devices:
  core:
    templates:
      - enhanced_logging
  access01:
    templates:
      - enhanced_logging
```

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
logging source-interface Loopback0
logging host 198.18.133.1
```

## Combining Template Types

You can combine different template types for the same device. For example, an access switch can use the VLAN template from Task06 along with the logging template from this task:

```yaml
iosxe:
  devices:
    - name: access01
      host: 198.18.130.11
      templates:
        - ACCESS_SWITCH_VLANS   # model template from Task06
        - enhanced_logging      # cli template from this task
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
| Task06 | `model` | VLAN configuration in YAML format |
| Task07 | `file` | BGP configuration from external file |
| Task08 | `cli` | Logging configuration as raw CLI |

Choose the appropriate template type based on your configuration needs and maintainability requirements






