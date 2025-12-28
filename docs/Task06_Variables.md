In this task, you'll learn how to use **variables** in your Network-as-Code configurations. Variables allow you to define values once and reference them throughout your configuration files, making your configurations more dynamic, reusable, and easier to maintain.

## Understanding Variables in Network-as-Code

Variables in NAC work similarly to variables in programming languages. You define a variable with a value at one level (device, device group, or global), and then reference it elsewhere using the `${VARIABLE_NAME}` syntax. When Terraform processes your configuration, it substitutes the variable references with their actual values.

**Benefits of using variables:**

- **Consistency**: Define a value once, use it everywhere
- **Maintainability**: Change a value in one place, it updates everywhere it's used
- **Reusability**: Same configuration template can be used with different variable values
- **Device-specific customization**: Each device can have its own variable values while sharing configuration structure

## Use Case: Dynamic Hostname in Banner and System Config

In this example, you'll configure devices where each device displays its own hostname in the login banner. Instead of creating separate banner configurations for each device, you'll:

1. Define the banner template once in the **global** configuration with a variable placeholder
2. Set the variable value per **device**
3. Let NAC substitute the variable automatically

This demonstrates the power of variables - one template, multiple device-specific outputs.

## Step 1: Update the Global Configuration File

First, let's update the global configuration to use a variable in the banner. Open `data/config-global.nac.yaml` in VS Code and update it with the following content:

```yaml
iosxe:
  global:
    configuration:
      banner:
        login: |
          #####################################
          #                                   #
          #   Welcome to Network-as-Code Lab  #
          #                                   # 
          #####################################
          Device: ${HOSTNAME}
      system:
        hostname: ${HOSTNAME}
```

**Key elements explained:**

- **`banner: login:`** - The login banner text shown when users connect
- **`|`** - YAML multi-line string indicator (preserves line breaks and formatting)
- **`${HOSTNAME}`** - Variable reference that will be replaced with the actual hostname
- **`system: hostname:`** - Sets the device hostname using the same variable

!!! note "Variable Syntax"
    Variables use the `${VARIABLE_NAME}` syntax. The variable name is case-sensitive, so `${HOSTNAME}` and `${hostname}` are different variables. By convention, variable names are typically uppercase.

The image below illustrates the updated global configuration in VS Code:

<!-- SCREENSHOT PLACEHOLDER: vscode-global-variables.png -->
<figure markdown>
  ![VS Code Global Variables](./assets/vscode-global-banner.png){ width="100%" }
</figure>

## Step 2: Define Variables at Device Level

Now you need to define the `HOSTNAME` variable for each device. Open `data/config-device-core.nac.yaml` in VS Code and update it with the following content:

```yaml
iosxe:
  devices:
    - name: core
      variables:
        HOSTNAME: core
      configuration:
        system:
          ip_hosts:
            - name: ntp-server
              ips:
                - 198.18.128.1
            - name: syslog-server
              ips:
                - 198.18.128.2
```

**What's new:**

- **`variables:`** - Section where you define device-specific variables
- **`HOSTNAME: core`** - Sets the HOSTNAME variable to "core" for this device

The image below illustrates the device configuration with variables in VS Code:

<!-- SCREENSHOT PLACEHOLDER: vscode-device-variables.png -->
<figure markdown>
  ![VS Code Device Variables](./assets/vscode-core-config.png){ width="100%" }
</figure>

## Step 3: Add Variables to Other Devices

Now add the `HOSTNAME` variable to the other device configuration files.

**Update `data/config-device-border.nac.yaml`:**

```yaml
iosxe:
  devices:
    - name: border
      variables:
        HOSTNAME: border
```

**Update `data/config-device-access01.nac.yaml`:**

```yaml
iosxe:
  devices:
    - name: access01
      variables:
        HOSTNAME: access01
```

**Update `data/config-device-access02.nac.yaml`:**

```yaml
iosxe:
  devices:
    - name: access02
      variables:
        HOSTNAME: access02
```

!!! tip "Device Name Convention"
    In this example, we're using the device name as the hostname variable value. This is a common pattern that keeps device identification consistent across your configuration and the actual device.

## How Variable Substitution Works

When Terraform processes your configuration, it performs variable substitution at each level. Here's how it works for the **core** switch:

**Before substitution (template):**
```yaml
banner:
  login: |
    Device: ${HOSTNAME}
system:
  hostname: ${HOSTNAME}
```

**After substitution (rendered for core):**
```yaml
banner:
  login: |
    Device: core
system:
  hostname: core
```

**Visual representation:**

```
┌─────────────────────────────────────────────────────────────────┐
│                    GLOBAL CONFIGURATION                         │
│                                                                 │
│  banner:                                                        │
│    login: |                                                     │
│      Device: ${HOSTNAME}    ←── Variable placeholder            │
│  system:                                                        │
│    hostname: ${HOSTNAME}    ←── Same variable                   │
└───────────────────────────────┬─────────────────────────────────┘
                                │
            ┌───────────────────┼───────────────────┐
            │                   │                   │
            ▼                   ▼                   ▼
┌───────────────────┐  ┌───────────────────┐  ┌───────────────────┐
│      core         │  │     border        │  │    access01       │
│                   │  │                   │  │                   │
│ variables:        │  │ variables:        │  │ variables:        │
│   HOSTNAME: core  │  │   HOSTNAME: border│  │   HOSTNAME: access01│
│                   │  │                   │  │                   │
│ Result:           │  │ Result:           │  │ Result:           │
│ hostname: core    │  │ hostname: border  │  │ hostname: access01│
│ Banner: core      │  │ Banner: border    │  │ Banner: access01  │
└───────────────────┘  └───────────────────┘  └───────────────────┘
```

## Variable Precedence

Variables can be defined at multiple levels. When the same variable is defined at different levels, the more specific level takes precedence:

1. **Device variables** (highest precedence) - Override everything
2. **Device group variables** (medium precedence) - Override global
3. **Global variables** (lowest precedence) - Default values

This allows you to define default values globally and override them per device or device group when needed.

**Example:**

```yaml
# Global default
global:
  variables:
    TIMEZONE: UTC

# Device override
devices:
  - name: core
    variables:
      TIMEZONE: America/New_York  # Overrides global default
```

## Step 4: Apply Configuration

Open your WSL Ubuntu terminal and navigate to your project directory:

```bash
cd ~/nac-iosxe
```

Preview the changes Terraform will make:

```bash
terraform plan
```

!!! tip "View the Merged Model"
    After running `terraform plan`, open the `model.yaml` file in VS Code to see how variables are resolved. You'll see each device with its variable values substituted into the configuration.

Apply the configuration:

```bash
terraform apply
```

When prompted, type `yes` to confirm the deployment.

## Step 5: Verify Variable Substitution

After Terraform completes successfully, verify the configuration was applied correctly on each device.

**Use Solar-PuTTY to connect and verify:**

1. Open **Solar-PuTTY** from your desktop
2. Connect to the **core** switch (198.18.130.10)
3. Run the verification commands below
4. Repeat for other switches to see their specific hostnames

**Check the hostname:**

```bash
show running-config | include hostname
```

**Expected output on core:**

```
hostname core
```

**Check the banner:**

```bash
show running-config | section banner
```

**Expected output on core:**

```
banner login ^C
#####################################
#                                   #
#   Welcome to Network-as-Code Lab  #
#                                   # 
#####################################
Device: core
^C
```

**Verify on other devices:**

Connect to **border**, **access01**, and **access02** and run the same commands. Each device should show its own hostname in the banner - demonstrating that the same template produced device-specific results.

## Common Variable Use Cases

Variables are powerful for many scenarios beyond hostnames:

| Use Case | Variable Example | Benefit |
|----------|-----------------|---------|
| **Device identity** | `${HOSTNAME}`, `${SITE_CODE}` | Consistent naming across configs |
| **Network segments** | `${MGMT_VLAN}`, `${DATA_VLAN}` | Easy VLAN changes across devices |
| **IP addressing** | `${LOOPBACK_IP}`, `${GATEWAY}` | Device-specific IP configuration |
| **Credentials** | `${SNMP_COMMUNITY}` | Centralized credential management |
| **Thresholds** | `${LOG_LEVEL}`, `${TIMEOUT}` | Environment-specific tuning |

## What You've Accomplished

In this task, you have:

- Learned how variables work in Network-as-Code configurations
- Updated the global configuration to use a variable placeholder
- Defined device-specific variable values
- Understood variable substitution and precedence rules
- Applied and verified variable-based configuration
- Explored common use cases for variables

**Success!** You've learned how to use variables to create dynamic, reusable configurations that adapt to each device while maintaining a single template!

---

**Next Steps:**

You can either explore **optional** template tasks or continue with the **mandatory** path:

- **Optional:** [Task07 - Templates Type Model](Task07_Templates_type_model.md) - Learn how to create reusable YAML-based configuration templates
- **Mandatory:** [Task10 - Schema Validation](Task10_Schema_validation.md) - Skip templates and continue with pre-change validation

