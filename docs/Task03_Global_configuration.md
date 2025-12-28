In this task, you'll learn how to use **global configuration** to apply settings across all devices at once. Using a login banner as an example, you'll see how global settings eliminate the need to repeat the same configuration for each device.

## Understanding Global Configuration

Global configurations define network-wide settings that apply to all devices unless explicitly overridden at the device group or device level. This provides the foundation layer of your network configuration hierarchy.

As described in the [IOS XE Global Configuration documentation](https://netascode.cisco.com/docs/data_models/iosxe/entity/global/), the configuration precedence hierarchy works as follows:

1. **Device** (highest precedence) - device-specific overrides
2. **Device Group** (medium precedence) - role or location-specific settings
3. **Global** (lowest precedence) - organization-wide defaults

By placing the banner in the `global` section, it will automatically apply to all devices listed in your configuration, ensuring consistency without duplication.

## Create the Global Configuration File

First, create the global configuration file using your **WSL Ubuntu terminal**:

```bash
touch ~/nac-iosxe/data/config-global.nac.yaml
```

!!! tip "Create File with VS Code"
    You can also create the file using VS Code by clicking on the `data/` folder in the Explorer sidebar, then on the *new file* icon next to the `NAC-IOSXE` folder name,
    or by **right-clicking** the `data/` folder and selecting **New File**.

    Throughout this lab guide we will use the `touch` command in WSL to create files, but feel free to use VS Code if you prefer a graphical interface.

Then open `data/config-global.nac.yaml` in VS Code and add the following content. Notice how the banner is defined once in the `global` section and will be applied to all devices defined in `devices.nac.yaml`:

```yaml
---
iosxe:
  global:
    configuration:
      banner:
        login: "Welcome to Network-as-Code Lab"
```

**Key elements explained:**

- **`---`** - YAML document start marker
- **`iosxe:`** - Root key indicating IOS XE specific configuration
- **`global:`** - Defines configurations that apply to all devices
- **`configuration:`** - Contains the actual configuration settings
- **`banner:`** - Specifies banner configurations (note: singular, not "banners")
- **`login:`** - The login banner text shown when users connect to the device

!!! note "Separation of Concerns"
    Notice how the global configuration is in a separate file (`config-global.nac.yaml`) from the device inventory (`devices.nac.yaml`). This modular approach keeps your configurations organized and maintainable. The NAC module automatically merges all YAML files in the `data/` directory.

The figure below illustrates how to create the `data/config-global.nac.yaml` file with Visual Studio Code:

<figure markdown>
  ![VS Code Global Banner](./assets/vscode-global-banner.png){ width="100%" }
</figure>

## Applying Configuration with Terraform CLI

Now that you've created your configuration files, it's time to deploy them to your network devices using Terraform. Terraform follows a simple three-step workflow that ensures safe and predictable infrastructure changes.

## Understanding the Terraform Workflow

Terraform uses a declarative approach where you define the desired state (in your YAML files), and Terraform figures out how to achieve that state. The workflow consists of:

1. **Initialize** - Download required modules and providers
2. **Plan** - Preview what changes Terraform will make
3. **Apply** - Execute the changes on your devices

## Step 1: In WSL (Ubuntu) and Navigate to Your Project

In Windows Subsystem for Linux (WSL) terminal, navigate to your project directory:

```bash
cd ~/nac-iosxe
```

!!! tip "Integrated Terminal in VS Code"
    You can also open the WSL terminal directly in VS Code by going to the menu and selecting **Terminal > New Terminal**. This opens a terminal at the root of your project, making it easy to run Terraform commands without switching windows.

    Whenever we mention running commands in WSL, you can use either the standalone WSL terminal or the integrated terminal in VS Code.


List the files in your directory:

```bash
tree -a
```

You should see your project structure:

```
/home/cisco/nac-iosxe/
├── .env
├── data/
│   ├── config-global.nac.yaml    # ← File with banner configuration
│   └── devices.nac.yaml
└── main.tf
```

## Step 2: Load Environment Variables from .env File

Before running Terraform, you need to load the credentials from your `.env` file. Your `.env` file contains simple key-value pairs (`IOSXE_USERNAME=nac_admin` and `IOSXE_PASSWORD=cisco`).


!!! tip "Convert the file to Unix format to avoid encoding issues"
    You might encounter a situation where you have edited the `.env` file on Windows, causing it to have Windows-style line endings (CRLF). Run the following command in your **WSL Ubuntu terminal** to convert the `.env` file to Unix format:

    ```bash
    dos2unix .env
    ```

To load these variables and make them available to Terraform, use this simple command:

```bash
source .env
```

!!! note "Using source vs. export"
    The `source` command reads and executes the contents of the `.env` file.
    As we included `export` in each line of the `.env` file, using `source` is sufficient to load and export the variables.

    Alternatively, you can ommit the `export` keywords in the `.env` file and run the following command to export all variables at once:

    ```bash
    export $(cat .env | xargs)
    ```

    This command does three things:

      1. `cat .env` - Reads the contents of the `.env` file

      2. `xargs` - Converts the file contents into command-line arguments

      3. `export` - Exports all the variables, making them available to processes like Terraform


**Verify the variables are loaded:**

```bash
env | grep IOSXE
```

You should see both variables displayed:
```
cisco@wkst1:~/nac-iosxe$ env | grep IOSXE
IOSXE_USERNAME=nac_admin
IOSXE_PASSWORD=cisco
cisco@wkst1:~/nac-iosxe$
```

These credentials allow Terraform to authenticate with your IOS XE devices.

**Making Environment Variables Persistent:**

Environment variables exported in your current shell session are not persistent - they disappear when you close the terminal. If you exit WSL and later open a new session, you must export them again.

To avoid manually exporting variables every time you open WSL, you can add the export command to your `~/.bashrc` file. This file runs automatically whenever you start a new bash session, so your environment variables will be loaded automatically.

**To make the export permanent, add it to your bashrc**

!!! note
    This has already been done for you in the lab environment. You don't need to run this command now.

```bash
echo 'source ~/nac-iosxe/.env' >> ~/.bashrc
```

This appends the source command to your `~/.bashrc` file. Now every time you open WSL, your IOSXE credentials will be automatically loaded from the `.env` file.


## Step 3: Initialize Terraform

Initialize your Terraform project to download the required Network-as-Code module:

```bash
terraform init
```

**What happens during initialization:**

- Terraform reads your `main.tf` file
- Downloads the `netascode/nac-iosxe` modules from the Terraform Registry
- Creates a `.terraform` directory with downloaded modules
- Creates a `.terraform.lock.hcl` file to lock module versions

**Expected output:**

<figure markdown>
  ![Terraform Init](./assets/terraform-init.png){ width="100%" }
</figure>

!!! warning "Internet Connection Required"
    As shown in this lab, the `terraform init` step requires an active internet connection to download the necessary modules from the Terraform Registry. In production environments, you may want to set up a private module registry or use a local mirror to avoid dependency on external connectivity.


## Step 4: Preview Changes with Terraform Plan

Before making any changes, preview what Terraform will do:

```bash
terraform plan
```

**What Terraform plan does:**

- Reads your `data/*.yaml` configuration files
- Connects to your IOS XE devices (using credentials from environment variables)
- Compares desired state (YAML) vs. current state (device configuration)
- Shows you what will be added, changed, or deleted

**Expected output:**

<figure markdown>
  ![Terraform Plan](./assets/terraform-plan.png){ width="100%" }
</figure>

**Review the plan carefully** to ensure Terraform will make the changes you expect. This is your safety check!

## Step 5: Apply Configuration to Devices

If the plan looks good, apply the configuration:

```bash
terraform apply
```

Terraform will show you the plan again and ask for confirmation:

```
Do you want to perform these actions?
  Terraform will perform the actions described above.
  Only 'yes' will be accepted to approve.

  Enter a value:
```

Type `yes` and press Enter to proceed.

**What happens during apply:**

- Terraform connects to each device via HTTPS
- Uses the Network as Code modules and Terraform IOS XE provider to translate your YAML configuration into YANG data and sends it via RESTCONF
- Applies the commands to the devices
- Tracks the applied state in `terraform.tfstate` file

**Expected output:**

<figure markdown>
  ![Terraform Apply](./assets/terraform-apply.png){ width="100%" }
</figure>


## Step 6: Verify the Global Configuration

After Terraform completes successfully, verify the banner was applied to **all devices**. Because you used **global configuration**, the banner should be deployed to all four switches automatically.

**Open Solar-PuTTY and connect to each switch:**

1. Open **Solar-PuTTY** from your desktop
2. Connect to the **border** switch first
3. Run the verification command (shown below)
4. Repeat for **core**, **access01**, and **access02** switches

**Check the banner configuration on each device:**

Once connected to each switch, run the following command:

```bash
show run | include banner
```

**Expected output (same on all four devices):**

```
<hostname>#show run | include banner
banner login ^CWelcome to Network-as-Code Lab^C
<hostname>#
```

The `^C` characters represent control characters used by IOS XE to delimit the banner text. The important part is that you see your banner text "Welcome to Network-as-Code Lab" in the output.

**What you should observe:**

- ✅ The banner appears on the **core** switch (198.18.130.10)
- ✅ The banner appears on the **border** switch (198.18.130.20)
- ✅ The banner appears on the **access01** switch (198.18.130.11)
- ✅ The banner appears on the **access02** switch (198.18.130.12)

**Success!** You've just deployed your first Network-as-Code configuration using Terraform! Notice how you defined the banner once in the global section, and it was automatically applied to all four devices - this is the power of Network-as-Code!

## Terraform Command Reference

Here's a quick reference of the most common Terraform commands:

| Command | Purpose |
|---------|---------|
| `terraform init` | Initialize project and download modules |
| `terraform plan` | Preview changes without applying them |
| `terraform apply` | Apply configuration to devices |
| `terraform apply -auto-approve` | Apply without confirmation prompt |
| `terraform destroy` | Remove all managed resources |
| `terraform show` | Display current state |
| `terraform validate` | Check configuration syntax |

## Understanding Terraform State

After running `terraform apply`, Terraform creates a `terraform.tfstate` file that tracks:

- What resources have been created
- Current configuration of each resource
- Device connection details

<figure markdown>
  ![Terraform State Files](./assets/terraform-state-files.png){ width="50%" }
</figure>

**Important:** The state file is critical for Terraform to manage your infrastructure. Don't manually edit or delete it!

## Troubleshooting Common Issues

**Issue: "Error: Failed to connect to device"**

- **Solution:** Verify your device host address is correct and the device is reachable. 

**Issue: "Error: Invalid credentials"**

- **Solution:** Check that your environment variables are set correctly with `env | grep IOSXE`. If they're not set, run `export $(cat .env | xargs)` again

**Issue: "Module not found"**

- **Solution:** Run `terraform init` again to download the required modules

## What's Next?

Congratulations! You've successfully:

- ✅ Created YAML configuration files
- ✅ Initialized Terraform with the Network-as-Code module
- ✅ Previewed changes with `terraform plan`
- ✅ Applied configuration to your network devices with `terraform apply`
- ✅ Verified the banner on your device

In the next task, you'll learn how to use device groups to apply configurations to multiple devices efficiently.

---

**Next:** [Task04 - Group of Devices Configuration](Task04_Group_of_devices_configuration.md)
