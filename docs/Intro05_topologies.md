# Lab topologies


Below is the dCloud lab topology diagram:

<figure markdown>
  ![Lab Topology](./assets/lab-topology.png){ width="100%" }
</figure>

This lab consists of:

- Multiple **IOS XE** virtual switches running in CML
- **GitLab** as Git repository and to run CI/CD pipelines, running in an Ubuntu VM
- Windows 10 VM with:
   - **VS Code** for editing Infrastructure as Code YAML files
   - SSH client **Solar-PuTTY** to access the IOS XE devices
   - **Windows Subsystem for Linux (WSL)** to run Terraform

The topology below shows the IOS XE switches running in the Cisco Modeling Labs (CML) server. These four Catalyst 9000v switches are interconnected and represent a typical enterprise network design:

- **CORE** (198.18.130.10) - Central switch providing backbone connectivity
- **BORDER** (198.18.130.20) - Edge switch for external connectivity
- **ACCESS01** (198.18.130.11) - Access layer switch for end devices
- **ACCESS02** (198.18.130.12) - Access layer switch for end devices

All switches are pre-configured with RESTCONF enabled, allowing Terraform to manage their configuration through the Network-as-Code approach.

<figure markdown>
  ![CML Topology](./assets/cml-topology.png){ width="100%" }
</figure>
