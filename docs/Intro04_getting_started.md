From your workstation, you will work on a Web RDP session to the dCloud lab `Win10` VM with IP address `198.18.133.20` and credentials `admin` / `cisco`.

Below is the dCloud lab topology diagram:

<figure markdown>
  ![Lab Topology](./assets/lab-topology.png){ width="100%" }
</figure>

This lab consists of:

- Multiple **IOS XE** virtual switches running in CML (Cisco Modeling Labs – network simulation platform)
- **GitLab** as Git repository and to run CI/CD pipelines, running in an Ubuntu VM
- Win10 VM with:
    - **VS Code** for editing Infrastructure as Code YAML files
    - **Solar-PuTTY** SSH client to access the IOS XE devices
    - **Windows Subsystem for Linux (WSL)** to run Terraform, and other command-line tools
    - **Google Chrome** Web Browser to read this lab guide and access GitLab

!!! tip "Recommendation: Use the Lab Guide from within the VM"
    You should read this lab guide directly from the **Win10 VM**. The lab guide is already bookmarked in **Chrome** on the VM. **Why?** Copy/paste between the laptop and the Web RDP session is not straightforward. Since you'll need to copy YAML configurations from this guide into VS Code and WSL Ubuntu terminal, working entirely within the VM will be much more practical and save you time.

    Once you RDP into the Windows 10 VM, open **Google Chrome**. The lab guide is set as the start page, and it is also bookmarked for easy access later.

---

**Next:** [Task 1 - SSH to Devices](Task01_SSH_to_network_devices.md)