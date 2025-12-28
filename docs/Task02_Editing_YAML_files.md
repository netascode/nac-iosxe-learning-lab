In this chapter, you will learn how to use VS Code to edit Network as Code (NAC) IOS XE intent configuration YAML files.

## What is VS Code?

Visual Studio Code, commonly known as VS Code, is a free, lightweight, yet powerful source code editor developed by Microsoft. It runs on Windows, macOS, and Linux and has become one of the most popular code editors among developers and IT professionals.

<figure markdown>
  ![VS Code Interface](./assets/vscode-00.png){ width="100%" }
</figure>

**Key features that make VS Code ideal for Network-as-Code:**

- **Syntax highlighting** - Colors and formats YAML files for easy readability
- **IntelliSense** - Provides intelligent code completion and suggestions
- **Integrated terminal** - Run commands directly within the editor
- **Extensions** - Add functionality like YAML validators and schema support
- **Git integration** - Built-in version control for tracking changes
- **Multi-file editing** - Work with multiple configuration files simultaneously
- **File explorer** - Easy navigation through project folders and files

### YAML Linting with RedHat Extension

Since Network-as-Code configurations are written in YAML, having proper syntax validation is essential. VS Code supports YAML linting through the **YAML extension by Red Hat**, which helps catch syntax errors and enforce best practices as you write your configuration files.

<figure markdown>
  ![VS Code YAML Extension](./assets/vscode-yaml-extension.png){ width="100%" }
</figure>

This extension provides:

- **Real-time syntax validation** - Highlights errors as you type
- **Auto-completion** - Suggests valid YAML structures
- **Formatting** - Automatically formats your YAML files
- **Schema validation** - Can validate against predefined schemas

!!! info "Pre-installed Extension"
    The Red Hat YAML extension is already installed in your lab environment. You'll see syntax highlighting and error detection automatically as you edit YAML files.
    For more details on YAML linting in Network-as-Code, see the [NetAsCode documentation](https://netascode.cisco.com/docs/guides/vxlan/nd/learning_lab/understanding-nac/#pre-change-validation-yaml-linting).


!!! warning "File Extension"
    The YAML extension recognizes only files ending with `.nac.yaml` as Network-as-Code YAML files. To benefit from the VS Code extension, ensure your configuration files end with `.nac.yaml`.


## Create Project Directory in WSL

For this lab, you'll create a dedicated project directory in your Windows Subsystem for Linux (WSL) home directory to organize your Network-as-Code configuration files and related resources. This location will serve as your workspace for storing YAML configuration files, Terraform files, and state information.

## What is WSL?

Windows Subsystem for Linux (WSL) allows you to run a Linux environment directly on Windows without a virtual machine. WSL is pre-installed in this lab, and you'll use it to run Terraform commands because most DevOps tools are designed for Linux.

## Open WSL Terminal (Ubuntu)

Open Windows Subsystem for Linux (WSL) terminal by searching "Ubuntu" in the Windows search:

<figure markdown>
  ![Open WSL Ubuntu](./assets/open-wsl.png){ width="70%" }
</figure>

When you open WSL, you'll automatically start in your home directory (`/home/cisco` or `~/`).

**Verify your current location:**

```bash
pwd
```

You should see `/home/cisco` displayed.

<figure markdown>
  ![PWD command](./assets/pwd.png){ width="100%" }
</figure>

**Create the project directory:**

```bash
mkdir nac-iosxe
```

This creates a dedicated folder named `nac-iosxe` for all your Network-as-Code project files.

**Navigate into the new directory:**

```bash
cd nac-iosxe
```

**Verify you're in the correct location:**

```bash
pwd
```

You should now see `/home/cisco/nac-iosxe` displayed.

<figure markdown>
  ![Create nac-iosxe directory](./assets/create-nac-iosxe.png){ width="100%" }
</figure>

## Create project structure

Now you'll create a folder structure and placeholder files for your Network-as-Code project.

**Create a data directory for YAML configuration files:**

```bash
mkdir data
```

This creates a dedicated folder to organize your device configuration files, keeping them separate from Terraform files.

## Create placeholder files

Now create the empty files that will hold your Network-as-Code configuration.

Create the `.env` file to store IOS XE device username and password credentials:

```bash
touch .env
```

The `touch` command creates an empty file.

Create the `main.tf` file for Terraform configuration. Terraform uses this file as the entry point to understand which modules to use and how to connect to your devices:

```bash
touch main.tf
```

Create the `devices.nac.yaml` file inside the data folder for device inventory:

```bash
touch data/devices.nac.yaml
```

This YAML file will contain your network device inventory - the list of devices that NAC will manage.

You can verify the files and directories you created by running `ls -la` in the WSL terminal to see a detailed listing.

<figure markdown>
  ![WSL Create Files](./assets/wsl-create-files.png){ width="100%" }
</figure>

## Verify Your Project Structure

Verify your project structure by running `tree -a` in the terminal. The output should look like this:

```
/home/cisco/nac-iosxe/
├── .env
├── data/
│   └── devices.nac.yaml
└── main.tf
```

You are now ready to start populating your configuration files. All subsequent steps in this guide will assume you are working within the `/home/cisco/nac-iosxe` directory.

## Open Visual Studio Code

To begin working with your project in a development-friendly environment, open your WSL home folder in Visual Studio Code (VS Code).

**To open the folder in VS Code:**

1. Double-click the **VS Code** icon on the Windows desktop
2. Click **File** → **Open Folder**
3. In the address bar, type or paste: `/home/cisco/nac-iosxe`
4. Click **OK**

<figure markdown>
  ![WSL Open Project Folder](./assets/wsl-open-project-folder.png){ width="100%" }
</figure>

!!! note
    When you open VS Code, it automatically connects to WSL.
    Notice the `WSL: Ubuntu-22.04` indicator in the bottom-left corner of VS Code. This confirms that VS Code is connected to your WSL Ubuntu environment, allowing you to edit files directly in WSL.
    This is achieved using the **WSL** VS Code extension, which is pre-installed in your lab environment.

VS Code will now open with your project folder, and you'll see the file explorer on the left showing your three configuration files.

<figure markdown>
  ![alt text](./assets/vscode-list-of-files.png){ width="100%" }
</figure>

## Edit .env file

Edit `.env` file containing the environment variables required by the Network-as-Code Terraform modules to connect to the Cisco IOS XE devices. This file stores your IOS XE credentials and connection details in a secure and reusable format:

```bash
export IOSXE_USERNAME=nac_admin
export IOSXE_PASSWORD=cisco
```

The figure below illustrates how to edit the `.env` file using Visual Studio Code.

<figure markdown>
  ![alt text](./assets/vscode-env-file.png){ width="100%" }
</figure>


## Edit Terraform main.tf file

Next, edit a Terraform `main.tf` file with the following content. This file serves as the entry point for the Terraform configuration and defines the necessary resources and modules to interact with the IOS XE device:

```text
module "iosxe" {
  source = "git::https://github.com/netascode/terraform-iosxe-nac-iosxe.git"
  yaml_directories = ["data/"]
  write_model_file = "model.yaml"
  write_default_values_file = "defaults.yaml"
}
```

!!! tip "Formatting Matters"
    Terraform (`.tf`) files use braces `{}` and proper indentation for structure. While Terraform is more forgiving than YAML, consistent formatting makes your code readable and maintainable. When copying code from this guide, formatting is preserved, but be careful when typing manually.

**Understanding the configuration:**

- **`module "iosxe"`** - Declares a Terraform module named "iosxe". Modules are reusable Terraform configurations that encapsulate infrastructure logic.

- **`source = "git::https://github.com/netascode/terraform-iosxe-nac-iosxe.git"`** - Tells Terraform where to find the module. This points to the Network-as-Code for IOS XE module on GitHub, published by Cisco under the netascode organization. The module handles all the complexity of translating YAML into Terraform provider.

- **`yaml_directories = ["data/"]`** - Specifies which directories contain your YAML configuration files. Terraform will automatically discover and process all YAML files within the `data/` folder. This approach is more flexible than listing individual files - you can add multiple YAML files to the `data/` folder and they'll all be processed automatically.

- **`write_model_file = "model.yaml"`** - Outputs the merged YAML data model to a file. This is useful for debugging and for running Robot Framework tests against the combined configuration.

- **`write_default_values_file = "defaults.yaml"`** - Outputs the default values used by the module. This helps you understand what default settings are applied when you don't explicitly specify values.

The figure below illustrates how to create the `main.tf` file using Visual Studio Code.

<figure markdown>
  ![alt text](./assets/vscode-maintf-file.png){ width="100%" }
</figure>

## Edit devices.nac.yaml - Device Inventory

Now edit the `data/devices.nac.yaml` file to define your network device inventory. This file contains the list of devices that the NAC module will manage, along with their management IP addresses:

```yaml
---
iosxe:
  devices:
    - name: core
      host: 198.18.130.10
    - name: border
      host: 198.18.130.20
    - name: access01
      host: 198.18.130.11
    - name: access02
      host: 198.18.130.12
```

!!! warning "Indentation Matters in YAML!"
    YAML uses **spaces for indentation** (not tabs) to define structure. Each level of nesting requires consistent spacing (typically 2 spaces). Incorrect indentation will cause parsing errors. When copying YAML from this guide, the formatting is preserved - but if you type manually, pay close attention to alignment. The Red Hat YAML extension will highlight indentation errors with red squiggly lines.

**Understanding the configuration:**
- **`---`** - YAML document start marker
- **`iosxe:`** - Root key indicating IOS XE specific configuration
- **`devices:`** - List of devices to be managed
- **`name:`** - Unique identifier for each device (used to reference the device in other configuration files)
- **`host:`** - Management IP address for device connectivity

!!! note "Device Inventory vs Configuration"
    This file contains only the device **inventory** - the list of devices and their connection details. Actual device **configurations** (banners, ACLs, VLANs, etc.) will be defined in separate files in subsequent tasks. This separation keeps your configurations modular and easy to manage.

<figure markdown>
  ![VS Code Devices File](./assets/vscode-devices-list.png){ width="100%" }
</figure>

## Auto Save is Enabled

VS Code has **auto-save** enabled, so your files are automatically saved after a few seconds of inactivity. At this point, you should have the following files in your project:

- `.env` - Contains your device credentials
- `main.tf` - Contains your Terraform module configuration
- `data/devices.nac.yaml` - Contains your network device inventory (4 switches)

## What You've Accomplished

Congratulations! In this chapter, you have:

- ✅ **Learned about VS Code** - Understood why it's the ideal tool for editing Network-as-Code files
- ✅ **Understood WSL** - Learned what Windows Subsystem for Linux is and why we use it for Terraform
- ✅ **Created project structure** - Set up the `/home/cisco/nac-iosxe` directory with proper organization
- ✅ **Organized configuration files** - Created a `data/` folder to separate YAML configs from Terraform files
- ✅ **Created credentials file** - Set up `.env` with IOS XE device authentication
- ✅ **Configured Terraform** - Created `main.tf` pointing to the Network-as-Code module and data directory
- ✅ **Prepared device inventory** - Created `data/devices.nac.yaml` with network device definitions

## Key Concepts Learned

**File Organization:**

- Configuration files (YAML) in `data/` folder
- Terraform files (`main.tf`) in project root
- Credentials (`.env`) in project root

**Tools Introduced:**

- **VS Code** - For editing configuration files
- **Red Hat YAML Extension** - For YAML syntax validation and linting
- **WSL** - For running Linux/Terraform commands
- **Terraform** - For deploying configurations to devices

In the next task, you'll deploy your first configuration using Terraform to apply a global banner across all your network devices.

---

**Next:** [Task03 - Global Configuration](Task03_Global_configuration.md)

