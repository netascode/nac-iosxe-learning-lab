# Lab topologies

## Lab Devices

The following devices are available in this lab:

| Device | IP Address | Username | Password | SSH Access |
|--------|------------|----------|----------|------------|
| **core** | 198.18.130.10 | cisco | cisco | [Open SSH](ssh://cisco@198.18.130.10) |
| **access01** | 198.18.130.11 | cisco | cisco | [Open SSH](ssh://cisco@198.18.130.11) |
| **access02** | 198.18.130.12 | cisco | cisco | [Open SSH](ssh://cisco@198.18.130.12) |
| **border** | 198.18.130.20 | cisco | cisco | [Open SSH](ssh://cisco@198.18.130.20) |
| **host01** | 192.168.100.100 | cisco | cisco | [Open SSH](ssh://cisco@192.168.100.100) |
| **host02** | 192.168.100.200 | cisco | cisco | [Open SSH](ssh://cisco@192.168.100.200) |
| **isp** | 198.18.130.200 | cisco | cisco | [Open SSH](ssh://cisco@198.18.130.200) |
| **ntp-server** | 192.168.128.11 | cisco | cisco | [Open SSH](ssh://cisco@192.168.128.11) |
| **syslog-server** | 192.168.128.12 | cisco | cisco | [Open SSH](ssh://cisco@192.168.128.12) |

!!! tip "SSH from WSL Terminal"
    To connect via SSH from your WSL terminal, use:
    ```bash
    ssh cisco@<IP_ADDRESS>
    ```
    For example: `ssh cisco@198.18.130.10`

---

Below is the dCloud lab topology diagram:

<figure markdown>
  ![Lab Topology](./assets/lab-topology.png){ width="100%" }
</figure>

This lab consists of:

- Multiple **IOS XE** virtual switches running in CML (Cisco Modeling Labs - network simulation platform)
- **GitLab** as Git repository and to run CI/CD pipelines, running in an Ubuntu VM
- Windows 10 VM with:
    - **VS Code** for editing Infrastructure as Code YAML files
    - **Solar-PuTTY** SSH client to access the IOS XE devices
    - **Windows Subsystem for Linux (WSL)** to run Terraform
    - **Web Browser** to read this lab guide and access GitLab

The topology below shows the IOS XE switches running in **Cisco Modeling Labs (CML)**. CML is a network simulation platform that allows you to create virtual network environments using real Cisco operating systems like IOS XE. In this lab, CML hosts four Catalyst 9000v virtual switches that you'll configure using Network-as-Code:
<figure markdown>
  ![CML Topology](./assets/cml-topology.png){ width="80%" }
</figure>
