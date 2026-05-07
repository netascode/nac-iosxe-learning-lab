# Task 06 — Variables

**⏱ ~15 minutes**

In this task you'll use **variables** in your Network as Code configurations. Variables let you define a value once (at the global, group, or device level) and reference it everywhere it's needed, so you can keep shared settings in one place while letting each device override only what's unique to it.

## What you'll learn

By the end of this task you will have:

- Used `${VARIABLE_NAME}` placeholders inside a global configuration
- Defined a **global** variable (`${SITE}`) that every device inherits
- Defined a **per-device** variable (`${HOSTNAME}`) that resolves differently on each device

## Variables in Network as Code

Variables in NAC work similarly to variables in programming languages. You define a variable with a value at one level (device, device group, or global), and then reference it elsewhere using the `${VARIABLE_NAME}` syntax. When the NAC module processes your configuration, it substitutes the variable references with their actual values.

**Benefits of using variables:**

- **Consistency**: Define a value once, use it everywhere
- **Maintainability**: Change a value in one place, it updates everywhere it's used
- **Reusability**: Same configuration template can be used with different variable values
- **Device-specific customization**: Each device can have its own variable values while sharing configuration structure

## Use Case: Dynamic Hostname in Banner and System Hostname Config

In this example, you'll touch two different pieces of configuration on each device: the hostname and the login banner.

 - You'll define the `HOSTNAME` variable **per device**.

 - You'll use that variable to set the **system hostname** in the **global configuration**.

 - You'll update the login banners on each device to display its own hostname. Instead of creating separate banner configurations for each device, you'll use the same **global banner configuration** with the `HOSTNAME` variable.

 - Let NAC substitute the variable automatically in both the system hostname and banner configuration

!!! tip "The power of variables"
    One banner template, multiple device-specific outputs!

    One place to define the hostname variable per device, used in multiple configuration sections.


## Step 1: Update the Global Configuration File

First, let's update the global configuration to use a variable in the banner. Open `data/global.nac.yaml` in VS Code and update it with the following content:

```yaml title="data/global.nac.yaml" hl_lines="4 5 14 15 17"
---
iosxe:
  global:
    variables:
      SITE: "LTRXAR-2008 Lab"
    configuration:
      banner:
        login: |
          ######################################
          #                                    #
          #   Welcome to Network as Code Lab!  #
          #                                    #
          ######################################
          Site:   ${SITE}
          Device: ${HOSTNAME}
      system:
        hostname: ${HOSTNAME}
```

**Two kinds of variable reference at work here:**

- **`${SITE}`** — defined **globally** (at the `iosxe.global.variables` level). Every device inherits the same value unless a device explicitly overrides it. This is how you keep organization-wide constants (site name, location, lab ID, DNS domain) in exactly one place.
- **`${HOSTNAME}`** — referenced globally, but you'll define it **per-device** in Step 2 so each device resolves it to its own value.

**Banner config:**

- `banner: login:` — the login banner shown on SSH connect.
- `|` — YAML block-scalar indicator; preserves newlines and indentation inside the string.

**System config:**

- `system: hostname:` — sets the IOS XE `hostname` CLI to the resolved value of `${HOSTNAME}`.

!!! note "Variable syntax"
    Variables use the `${VARIABLE_NAME}` syntax. Names are case-sensitive: `${HOSTNAME}` and `${hostname}` are different variables. The lab uses uppercase by convention — it makes variables visually distinct from the surrounding YAML, and is a common pattern across NAC data models.

The image below illustrates the updated global configuration in VS Code:

<figure markdown>
  ![VS Code Global Variables](./assets/vscode-global-banner-variables.png){ width="100%" }
</figure>

!!! warning "YAML Formatting"
    When pasting multi-line strings in YAML (like this banner), ensure the indentation is correct. The `|` character indicates a multi-line string, and the following lines should be indented properly to be part of that string.

    To learn more about the multi-line string (block scalar) YAML syntax, refer to [yaml-multiline.info](https://yaml-multiline.info/).

## Step 2: Define Variables at Device Level

Now you need to define the `HOSTNAME` variable for each device. Open `data/devices/core.nac.yaml` in VS Code and update it with the following content:

```yaml title="data/devices/core.nac.yaml" hl_lines="6 7"
---
iosxe:
  devices:
    - name: core
      host: 198.18.130.10
      variables:
        HOSTNAME: core
      configuration:
        interfaces:
          loopbacks:
            - id: 0
              description: "Router-ID loopback"
              ipv4:
                address: 198.51.100.10
                address_mask: 255.255.255.255
```

**What's new:**

- **`variables:`** — section where you define device-specific variables.
- **`HOSTNAME: core`** — sets `${HOSTNAME}` to `core` for this device only. The `system.hostname` and `banner.login` in `global.nac.yaml` will resolve to this value when the merged model is rendered for `core`.

The image below illustrates the device configuration with variables in VS Code:

<figure markdown>
  ![VS Code Device Variables](./assets/vscode-core-config-variables.png){ width="100%" }
</figure>

## Step 3: Add Variables to Other Devices

Now add the `HOSTNAME` variable to the other device configuration files.

**Update `data/devices/border.nac.yaml`:**

```yaml title="data/devices/border.nac.yaml" hl_lines="6 7"
---
iosxe:
  devices:
    - name: border
      host: 198.18.130.20
      variables:
        HOSTNAME: border
```

**Update `data/devices/access01.nac.yaml`:**

```yaml title="data/devices/access01.nac.yaml" hl_lines="6 7"
---
iosxe:
  devices:
    - name: access01
      host: 198.18.130.11
      variables:
        HOSTNAME: access01
```

**Update `data/devices/access02.nac.yaml`:**

```yaml title="data/devices/access02.nac.yaml" hl_lines="6 7"
---
iosxe:
  devices:
    - name: access02
      host: 198.18.130.12
      variables:
        HOSTNAME: access02
```

!!! note "Name and hostname"
    The `name` attribute under `devices` identifies the device in NAC. The `HOSTNAME` variable value you set is what will be used in the system hostname and banner configuration. They can be the same or different, depending on your design.


## How Variable Substitution Works

When Terraform processes your configuration, it performs variable substitution at each level, for each device.

<figure markdown>
  ![Variable Substitution](./assets/variable-substitution-light.png#only-light){ width="100%" }
  ![Variable Substitution](./assets/variable-substitution-dark.png#only-dark){ width="100%" }
</figure>

## Variable Precedence

Variables can be defined at multiple levels. When the same variable is defined at different levels, the more specific level takes precedence:

1. **Device variables** (highest precedence) - Override everything
2. **Device group variables** (medium precedence) - Override global
3. **Global variables** (lowest precedence) - Default values

This allows you to define default values globally and override them per device or device group when needed.


!!! info "Variable Precedence Example"
    The config below is only an example, you do not need to add this in your lab.

    ```yaml { hl_lines="5 9" .no-copy }
    ---
    iosxe:
      global:
        variables:
          TIMEZONE: UTC  # Global default
      devices:
        - name: example-device
          variables:
            TIMEZONE: America/New_York  # Overrides global default
    ```


## Step 4: Apply Configuration

Open your WSL Ubuntu terminal and navigate to your project directory:

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
When prompted, type `yes` to confirm the deployment.



## Step 5: Verify Variable Substitution

After Terraform completes successfully, verify the configuration was applied correctly on each device.

**Use Solar-PuTTY to connect and verify:**

1. Open **Solar-PuTTY** from your desktop
2. Connect to the **core** switch
3. Verify the updated hostname and banner
4. Repeat for other switches (**border**, **access01**, **access02**) to see their specific hostnames

<figure markdown>
  ![Solar-PuTTY Core Banner](./assets/solarputty-ssh-core-variables.png){ width="95%" }
</figure>

<!-- ??? info "Alternative Verification Commands"
    You can use the following commands to verify the hostname and banner on each device:

    ???+ quote "Verify Hostname via `show run`"
        ```
        show running-config | include hostname
        ```

        ???+ quote "Expected output on **core**:"
            ```
            core#show running-config | include hostname
            hostname core
            core#
            ```

    ???+ quote "Verify Banner via `show banner login`"
        ```
        show banner login
        ```

        ???+ quote "Expected output on **access01**:"
            ```
            access01#show banner login
            ######################################
            #                                    #
            #   Welcome to Network as Code Lab!  #
            #                                    #
            ######################################
            Device: access01

            access01#
            ``` -->

Each device shows its own hostname in the banner, demonstrating that the same template produced device-specific results.

!!! tip "Review the `model.yaml` file"
    After running `terraform apply`, open `model.yaml` in VS Code to see how variables are resolved. Each device appears with its variable values already substituted into the rendered configuration — this is the final form Terraform sends to the devices.

## Common variable use cases

Variables are powerful for many scenarios beyond hostnames (device identity). Here are some common use cases:

| Use Case             | Variable Example               | Benefit                           |
|----------------------|--------------------------------|-----------------------------------|
| **Network segments** | `${MGMT_VLAN}`, `${DATA_VLAN}` | Easy VLAN changes across devices  |
| **IP addressing**    | `${LOOPBACK_IP}`, `${GATEWAY}` | Device-specific IP configuration  |
| **Credentials**      | `${SNMP_COMMUNITY}`            | Centralized credential management |
| **Thresholds**       | `${LOG_LEVEL}`, `${TIMEOUT}`   | Environment-specific tuning       |


## Environment Variables

Environment variables can also be used in NAC configurations. They are defined outside of the configuration files and can be referenced using the syntax below:


!!! info "Environment Variable Example"
    The config below is only an example, you do not need to add this in your lab.

    ```yaml {title="" hl_lines="6" .no-copy }
    ---
    iosxe:
      devices:
        - name: example-device
          system:
            enable_secret: !env ENABLE_SECRET
            enable_secret_type: "0"
    ```

In the example above, the `ENABLE_SECRET` environment variable is referenced and used for the device's enable secret.


!!! tip "Security Best Practice"
    Using environment variables is good practice for sensitive information like passwords.


## What You've Accomplished

In this task, you have:

- ✅ Learned how variables work in Network as Code configurations
- ✅ Updated the global configuration to use a variable placeholder
- ✅ Defined device-specific variable values
- ✅ Understood variable substitution and precedence rules
- ✅ Applied and verified variable-based configuration

---

**← Previous:** [Task 05 — Single-device configuration](Task05_Single_device_config.md)

**Next Steps:**

You can either explore **optional** template tasks or continue with the **recommended** path:

- **Optional:** [Task 07 — Templates type `model`](Task07_Templates_type_model.md) — reusable YAML-based configuration templates
- **Recommended:** [Task 10 — Schema validation](Task10_Schema_validation.md) — skip templates and continue with pre-change validation
