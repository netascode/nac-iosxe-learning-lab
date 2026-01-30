In this task, you'll learn how to use **templates of type 'cli'** to inject raw CLI commands directly into your device configuration. The *cli* template type is useful when you need to configure IOS-XE features that aren't yet supported by the NAC data model.

## CLI Templates

The CLI template type allows you to include raw IOS-XE CLI commands that are pushed directly to devices. This can be used as a workaround for features not yet supported by the Network-as-Code IOSXE data model, as it accepts any valid CLI command.

**Template Types (reminder):**

| Type      | Description                       | Use Case                                               |
|-----------|-----------------------------------|--------------------------------------------------------|
| *model* | YAML-based configuration template | Standard configurations (VLANs, ACLs, etc.) ← *Task07* |
| *file*  | External `.tftpl` template files  | Large configurations stored separately ← *Task08*      |
| *cli*   | Raw CLI commands                  | IOS-XE features not in NAC data model ← *This task*    |


**When to use 'cli' templates:**

- **Unsupported features**: Configuration not yet in the [NAC data model](https://netascode.cisco.com/docs/data_models/iosxe/overview/)
- **Temporary workarounds**: Quick fixes before proper NAC support is added

!!! warning "Use with Caution"
    Always prefer *model* and *file*  templates when possible. They provide dependency handling, better validation, consistency, and they are easier to maintain.

## Use Case: Custom Alias for the `show logging` Command

In this example, you'll configure a custom alias command `logs` that maps to `show logging`. This is a simple yet practical use case demonstrating how to use *cli* templates to add commands not directly supported by the NAC data model.
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
    - name: alias_logs
      type: cli
      content: alias exec logs show logging
```

This template:

- `type: cli`: Specifies raw CLI commands
- `content`: Contains the actual CLI command to create the alias

## Step 2: Apply the Template to the global configuration

Now you can add the alias template to your existing global configuration so that it applies to all devices.

**Update `data/config-global.nac.yaml`** to include the alias template:

```yaml title="data/config-global.nac.yaml" hl_lines="15-16"
---
iosxe:
  global:
    configuration:
      banner:
        login: |
          ######################################
          #                                    #
          #   Welcome to Network-as-Code Lab!  #
          #                                    #
          ######################################
          Device: ${HOSTNAME}
      system:
        hostname: ${HOSTNAME}
    templates:
      - alias_logs
```


## Step 3: Deploy the Configuration

Open your WSL Ubuntu terminal and run the following steps:

**Step 1:** Navigate to your project directory:

```bash
cd ~/nac-iosxe
```

**Step 2:** Optionally, preview the changes Terraform will make:

```bash
terraform plan
```

**Step 3:** Apply the configuration:

```bash
terraform apply
```

When prompted, type `yes` to confirm the deployment.

!!! tip "View the Merged Model"
    After running `terraform apply`, open the `model.yaml` file in VS Code to see how the alias_logs CLI template is merged with other configurations.

## Step 4: Verify the Configuration

Use **Solar-PuTTY** to connect to one of the configured devices (e.g., `core` switch) and verify that the alias command was successfully added.


After connecting to the device, run the following command to check if the alias was created:

```
show alias
```

```text { title="Expected Output" hl_lines="6" .no-copy }
core#show alias
Exec mode aliases:
  h                     help
  lo                    logout
  ...
  logs                  show logging

core#
```

You can also test the alias by running `logs` from exec mode.

## When to Use Each Template Type


| Scenario                                                                    | Recommended Type |
|-----------------------------------------------------------------------------|------------------|
| Config that maps directly to the data model and only needs value templating | `model`          |
| Complex config with loops, conditionals, or dynamic structures              | `file`           |
| Last resort for features not yet supported in the data model                | `cli`            |


## What You've Accomplished

- ✅ Created a `cli` type template with a raw CLI command
- ✅ Applied the template to all devices via global configuration
- ✅ Deployed alias configuration


---

**Next:** [Task10 - Schema Validation](Task10_Schema_validation.md)






