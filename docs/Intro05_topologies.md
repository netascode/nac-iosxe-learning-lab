# Lab topologies

## Lab Devices

The following devices are available in the Cisco Modeling Labs (CML) topology.

| Device            | IP Address      | Username | Password |
|-------------------|-----------------|----------|----------|
| **core**          | 198.18.130.10   | cisco    | cisco    |
| **access01**      | 198.18.130.11   | cisco    | cisco    |
| **access02**      | 198.18.130.12   | cisco    | cisco    |
| **border**        | 198.18.130.20   | cisco    | cisco    |
| **host01**        | 192.168.100.100 | cisco    | cisco    |
| **host02**        | 192.168.100.200 | cisco    | cisco    |
| **isp**           | 198.18.130.200  | cisco    | cisco    |
| **ntp-server**    | 192.168.128.11  | cisco    | cisco    |
| **syslog-server** | 192.168.128.12  | cisco    | cisco    |

!!! tip "SSH from WSL Terminal"
    To connect via SSH from your WSL terminal, use:
    ```bash
    ssh cisco@<IP_ADDRESS>
    ```
    For example: `ssh cisco@198.18.130.10`

---

## Lab VMs

| Device            | IP Address     | Username | Password  | Interface                     |
|-------------------|----------------|----------|-----------|-------------------------------|
| **Windows 10 VM** | 198.18.133.20  | admin    | cisco     | [rdp](rdp://198.18.133.20)    |
| **CML**           | 198.18.130.34  | guest    | CiscoLive | [web](https://198.18.130.34)  |
| **Ubuntu VM**     | 198.18.133.101 | guest    | CiscoLive | [ssh](ssh://198.18.133.101)   |
| **GitLab**        | 198.18.133.101 | root     | cisco     | [web](https://198.18.133.101) |

Below is the dCloud lab topology diagram:

<figure markdown>
  ![Lab Topology](./assets/lab-topology.png){ width="100%" }
</figure>

This lab consists of:

- Multiple **IOS XE** virtual switches running in CML
- **GitLab** as Git repository and to run CI/CD pipelines, running in an Ubuntu VM
- Windows 10 VM with:
    - **VS Code** for editing Infrastructure as Code YAML files
    - **Solar-PuTTY** SSH client to access the IOS XE devices
    - **Windows Subsystem for Linux (WSL)** to run Terraform
    - **Web Browser** to read this lab guide and access GitLab


The topology below shows the IOS XE switches running in **Cisco Modeling Labs (CML)**. CML is a network simulation platform that allows you to create virtual network environments using real Cisco operating systems like IOS XE. In this lab, CML hosts three Catalyst 9000v virtual switches and a Catalyst 8000v virtual router that you'll configure using Network-as-Code:
<figure markdown>
  ![CML Topology](./assets/cml-topology.png){ width="70%" }
</figure>
