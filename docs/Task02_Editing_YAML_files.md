# Task 02 — Editing YAML files in VS Code

**⏱ ~15 minutes**

In this task you'll set up the project directory and use VS Code to edit Network-as-Code (NAC) IOS XE intent configuration YAML files.

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

!!! info "The YAML extension is already pre-installed in your lab"
    You'll see syntax highlighting and error detection automatically as you edit YAML files.

!!! warning "File Extension"
    The YAML extension recognizes only files ending with `.nac.yaml` as Network-as-Code YAML files. To benefit from the VS Code extension, ensure your configuration files end with `.nac.yaml`.


## Create Project Directory in WSL

For this lab, you'll create a dedicated project directory in your Windows Subsystem for Linux (WSL) home directory to organize your Network-as-Code configuration files and related resources. This location will serve as your workspace for storing YAML configuration files, Terraform files, and state information.

## What is WSL?

Windows Subsystem for Linux (WSL) allows you to run a Linux environment directly on Windows without a virtual machine. WSL is pre-installed in this lab, and you'll use it to run Terraform commands because most DevOps tools are designed for Linux.

## Open WSL Terminal (Ubuntu)

Open Windows Subsystem for Linux (WSL) terminal. You can use the desktop shortcut, the icon on the taskbar, or on the Start menu.

<figure markdown>
  ![Open WSL Ubuntu](./assets/open-wsl.png){ width="80%" }
</figure>

When you open WSL, you'll automatically start in your home directory (`/home/cisco` or `~/`).

**Verify your current location:**

```bash
pwd
```

You should see `/home/cisco` displayed.

<figure markdown>
  ![PWD command](./assets/pwd.png){ width="80%" }
</figure>

**Create the NAC IOSXE project directory:**

```bash
mkdir nac-iosxe
```

!!! tip "Copy and Paste"
    You can copy commands directly from this lab guide by clicking on the icon at the top right corner of the command block and paste them into the WSL terminal using **right-click**.

This creates a dedicated folder named `nac-iosxe` for all your Network-as-Code IOSXE project files.

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
  ![Create nac-iosxe directory](./assets/create-nac-iosxe.png){ width="80%" }
</figure>

## Create project structure

Now you'll create a folder structure and placeholder files for your Network-as-Code IOSXE project.

**Create a data directory for YAML configuration files:**

```bash
mkdir data
```

This creates a dedicated folder to organize your device configuration files, keeping them separate from Terraform files.

## Create placeholder files

Create the skeleton files you'll fill in below.

```bash
touch .env                                        # credentials for the IOS XE devices
touch main.tf                                     # Terraform entry point
touch data/config-device-core.nac.yaml            # per-device configuration files
touch data/config-device-border.nac.yaml
touch data/config-device-access01.nac.yaml
touch data/config-device-access02.nac.yaml
```

One file per device is the pattern we'll use for the whole lab. It keeps each device's configuration self-contained and makes it obvious which YAML file to edit when you need to change something for a specific device.

!!! note "Why one file per device, not a single inventory file?"
    The NAC IOS XE data model exposes a top-level `iosxe.devices` list. YAML allows the same list to be split across multiple files and merged at load time — **but only if every list entry is uniquely identified by its `name` field.** Defining each device in its own file (with its own `name`) keeps that invariant obvious, and it scales cleanly: adding a device later is "create one file," not "edit three."

<figure markdown>
  ![Creating the project files](./assets/wsl-create-files.png){ width="80%" }
</figure>

## Verify your project structure

```bash
tree -a
```

You should see:

```text { .no-copy }
cisco@wkst1:~/nac-iosxe$ tree -a
.
├── .env
├── data
│   ├── config-device-access01.nac.yaml
│   ├── config-device-access02.nac.yaml
│   ├── config-device-border.nac.yaml
│   └── config-device-core.nac.yaml
└── main.tf

1 directory, 6 files
```

You're now ready to populate the files. Every subsequent step in this guide assumes your current working directory is `/home/cisco/nac-iosxe`.

## Open Visual Studio Code

To begin working with your project in a development-friendly environment, open your WSL home folder in Visual Studio Code (VS Code).

**To open the folder in VS Code:**

1. Double-click the **Visual Studio Code Code** icon on the Windows desktop
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

```bash title=".env"
export IOSXE_USERNAME=nac_admin
export IOSXE_PASSWORD=cisco
export IOSXE_PROTOCOL=netconf
```

The figure below illustrates how to edit the `.env` file using Visual Studio Code:

<figure markdown>
  ![.env file in VS Code](./assets/vscode-env-file.png){ width="100%" }
</figure>

!!! note "Protocol selection"
    This lab uses **NETCONF** as the management protocol. If you want to use RESTCONF instead (for example, on your own devices at home), set `IOSXE_PROTOCOL=restconf` — see the "Alternative: RESTCONF" note at the bottom of [Task 01](Task01_SSH_to_network_devices.md) for the device-side CLI.


## Edit Terraform main.tf file

Next, edit a Terraform `main.tf` file with the following content. This file serves as the entry point for the Terraform configuration and defines the necessary resources and modules to interact with the IOS XE device:

```text title="main.tf"
module "iosxe" {
  source                    = "git::https://github.com/netascode/terraform-iosxe-nac-iosxe.git"
  yaml_directories          = ["data/"]
  write_model_file          = "model.yaml"
  write_default_values_file = "defaults.yaml"
}
```

!!! tip "Formatting matters"
    Terraform (`.tf`) files use braces `{}` and indentation for structure. Unlike YAML, Terraform is forgiving about whitespace, but consistent formatting makes your code readable. The snippets in this guide are formatted with `terraform fmt`; if you type manually, run `terraform fmt` after to clean up.

**Understanding the configuration:**

- **`module "iosxe"`** — declares a Terraform module named `iosxe`. Modules package reusable Terraform logic; you invoke them with `module.iosxe`.
- **`source = "git::https://github.com/netascode/terraform-iosxe-nac-iosxe.git"`** — tells Terraform where to fetch the module. This is the Cisco-maintained Network-as-Code module that translates your YAML into the low-level resource calls the `terraform-provider-iosxe` understands.
- **`yaml_directories = ["data/"]`** — tells the module which directories to scan for YAML. Every `*.nac.yaml` file inside `data/` is auto-discovered and merged. This is why you can split configurations across many files without wiring them up individually.
- **`write_model_file = "model.yaml"`** — after merging, the module writes the final merged data model to `model.yaml`. You'll use this file to debug variable substitution and as input to `nac-test` for post-deployment validation.
- **`write_default_values_file = "defaults.yaml"`** — similar, but for the default values the module applies when your YAML omits a field. Useful for understanding "where did this setting come from?"

!!! note "Why no version pin?"
    For the lab we source directly from the module's default branch (`main`) to always get the latest schema and features. In production you should pin to a specific tag or commit (for example, `?ref=v0.12.3`) so every `terraform init` yields a reproducible build. Unpinned sources are convenient for experimentation but will occasionally break learners when upstream ships schema changes — pin once you ship.

The figure below illustrates the `main.tf` file in Visual Studio Code:

<figure markdown>
  ![main.tf in VS Code](./assets/vscode-maintf-file.png){ width="100%" }
</figure>

## Populate the per-device files

Each per-device file registers one device with NAC — it declares the device's **name** (which every other YAML file will reference) and its **management IP address**. You'll add actual configuration to these files in later tasks.

Open `data/config-device-core.nac.yaml` in VS Code and paste:

```yaml title="data/config-device-core.nac.yaml"
---
iosxe:
  devices:
    - name: core
      host: 198.18.130.10
```

Open `data/config-device-border.nac.yaml` and paste:

```yaml title="data/config-device-border.nac.yaml"
---
iosxe:
  devices:
    - name: border
      host: 198.18.130.20
```

Open `data/config-device-access01.nac.yaml` and paste:

```yaml title="data/config-device-access01.nac.yaml"
---
iosxe:
  devices:
    - name: access01
      host: 198.18.130.11
```

Open `data/config-device-access02.nac.yaml` and paste:

```yaml title="data/config-device-access02.nac.yaml"
---
iosxe:
  devices:
    - name: access02
      host: 198.18.130.12
```

!!! warning "Indentation matters in YAML"
    YAML uses **spaces** (not tabs) and relies on consistent indentation to express structure. Each level of nesting should be exactly 2 spaces. Copy-pasting from this guide preserves the right indentation; if you type manually, watch for the red squiggles from the VS Code YAML extension — they point at exactly the line that's off.

**What each key means:**

- `---` — YAML document-start marker (optional but conventional).
- `iosxe:` — root key. Every NAC IOS XE YAML starts here.
- `devices:` — the top-level list of devices NAC manages.
- `name:` — unique identifier for the device. Other YAML files will match against this name.
- `host:` — management IP NAC connects to.

!!! note "Why one device per file?"
    NAC merges all YAML files in `data/` into a single data model at load time. Because `devices` is a list, keeping each device in its own file makes it immediately obvious which file owns which device, and avoids the accidental-merge bugs that can happen when several files all append to the same list. You'll extend these files with real configuration starting in [Task 05](Task05_Single_device_config.md).

<figure markdown>
  ![VS Code showing the four per-device files](./assets/vscode-devices-list.png){ width="100%" }
</figure>

## Auto-save is enabled

VS Code has auto-save enabled, so your files are saved a few seconds after you stop typing. At this point your project contains:

- `.env` — device credentials and protocol
- `main.tf` — Terraform module configuration
- `data/config-device-*.nac.yaml` — four per-device skeleton files

## What You've Accomplished

Congratulations! In this chapter, you have:

- ✅ **Created project structure** - Set up the `/home/cisco/nac-iosxe` directory
- ✅ **Organized configuration files** - Created a `data/` folder to separate Network-as-Code YAML config from other files
- ✅ **Created environment file** - Set up `.env` with IOS XE device authentication
- ✅ **Configured Terraform** - Created `main.tf` pointing to the Network-as-Code module and data directory
- ✅ **Prepared device inventory** - Created `data/devices.nac.yaml` with network device definitions

**Tools Introduced:**

- **VS Code** - For editing configuration files in this lab
- **VS Code YAML Extension** - For YAML syntax validation and linting
- **WSL** - For running Linux/Terraform commands

In the next task, you'll deploy your first configuration using Terraform to apply a global banner across all your network devices.

---

**Next:** [Task03 - Global Configuration](Task03_Global_configuration.md)

