In this chapter, you will learn how to use VSCode to edit Network as Code (NAC) IOS XE intent configuration YAML files.

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

For this lab, VS Code is pre-installed on your Windows workstation and ready to use. You'll use it to view, edit, and create YAML configuration files that define your network infrastructure.


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

!!! note
    Your working directory is `/home/cisco/nac-iosxe` in WSL. From Windows Explorer, you can access this location at `\\wsl$\Ubuntu\home\cisco\nac-iosxe`.

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

Create the `devices.nac.yaml` file inside the data folder for device configurations:

```bash
touch data/devices.nac.yaml
```

This YAML file will contain your network device definitions and configurations in a human-readable format.

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

**From Windows Explorer, this is accessible at:** `\\wsl$\Ubuntu\home\cisco\nac-iosxe`


You are now ready to start populating your configuration files. All subsequent steps in this guide will assume you are working within the `/home/cisco/nac-iosxe` directory.

## Open Visual Studio Code

To begin working with your project in a development-friendly environment, open your WSL home folder in Visual Studio Code (VS Code).

**To open the folder in VS Code:**

1. Open the **VS Code** application from Windows Start Menu
2. Click **File** → **Open Folder**
3. In the address bar, type or paste: `/home/cisco/nac-iosxe`
4. Click **Select Folder**

<figure markdown>
  ![WSL Open Project Folder](./assets/wsl-open-project-folder.png){ width="100%" }
</figure>

VS Code will now open with your project folder, and you'll see the file explorer on the left showing your three configuration files 

<figure markdown>
  ![alt text](./assets/vscode-list-of-files.png){ width="100%" }
</figure>

## Edit .env file

Edit `.env` file containing the environment variables required by the Network-as-Code Terraform modules to connect to the Cisco IOS XE devices. This file stores your IOS XE credentials and connection details in a secure and reusable format:

```bash
IOSXE_USERNAME=nac_cisco
IOSXE_PASSWORD=cisco
```

**Note:** These variables will be exported when you source the `.env` file in WSL using the proper commands (covered in the next task).

The figure below illustrates how to edit the `.env` file using Visual Studio Code. 

<figure markdown>
  ![alt text](./assets/vscode-env-file.png){ width="100%" }
</figure>

**Save the file** by pressing `Ctrl+S`.

## Edit Terraform main.tf file

Next, edit a Terraform `main.tf` file with the following content. This file serves as the entry point for the Terraform configuration and defines the necessary resources and modules to interact with the IOS XE device:

```text
module "iosxe" {
  source = "git::https://github.com/netascode/terraform-iosxe-nac-iosxe.git"
  yaml_directories = ["data/"]
}
```

**Understanding the configuration:**

- **`module "iosxe"`** - Declares a Terraform module named "iosxe". Modules are reusable Terraform configurations that encapsulate infrastructure logic.

- **`source = "git::https://github.com/netascode/terraform-iosxe-nac-iosxe.git"`** - Tells Terraform where to find the module. This points to the Network-as-Code for IOS XE module on GitHub, published by Cisco under the netascode organization. The module handles all the complexity of translating YAML to IOS XE configurations via RESTCONF API.

- **`yaml_directories = ["data/"]`** - Specifies which directories contain your YAML configuration files. Terraform will automatically discover and process all YAML files within the `data/` folder. This approach is more flexible than listing individual files - you can add multiple YAML files to the `data/` folder and they'll all be processed automatically.

The figure below illustrates how to create the `main.tf` file using Visual Studio Code.

<figure markdown>
  ![alt text](./assets/vscode-maintf-file.png){ width="100%" }
</figure>

## Save Your Files

Before moving to the next task, make sure all your files are saved in VS Code.

**To save all open files at once:**

Press `Ctrl + K` followed by `S` (or click **File** → **Save All**)

You should see that all three files have been saved:
- `.env` - Contains your device credentials
- `main.tf` - Contains your Terraform module configuration
- `data/devices.nac.yaml` - Will contain your network device configurations (to be completed in next task)

## What You've Accomplished

Congratulations! In this chapter, you have:

- ✅ **Learned about VS Code** - Understood why it's the ideal tool for editing Network-as-Code files
- ✅ **Understood WSL** - Learned what Windows Subsystem for Linux is and why we use it for Terraform
- ✅ **Created project structure** - Set up the `/home/cisco/nac-iosxe` directory with proper organization
- ✅ **Organized configuration files** - Created a `data/` folder to separate YAML configs from Terraform files
- ✅ **Created credentials file** - Set up `.env` with IOS XE device authentication
- ✅ **Configured Terraform** - Created `main.tf` pointing to the Network-as-Code module and data directory
- ✅ **Prepared YAML file** - Created `data/devices.nac.yaml` ready for device configuration

## Key Concepts Learned

**File Organization:**

- Configuration files (YAML) in `data/` folder
- Terraform files (`main.tf`) in project root
- Credentials (`.env`) in project root

**Tools Introduced:**

- **VS Code** - For editing configuration files
- **WSL** - For running Linux/Terraform commands
- **Terraform** - For deploying configurations to devices

In the next task, you'll deploy your first configuration using Terraform to apply a global banner across all your network devices.

---

**Next:** [Task03 - Global Configuration](Task03_Global_configuration.md)

