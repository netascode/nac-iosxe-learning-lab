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


The topology below shows the IOS XE switches running in **Cisco Modeling Labs (CML)**. CML is a network simulation platform that allows you to create virtual network environments using real Cisco operating systems like IOS XE. In this lab, CML hosts four Catalyst 9000v virtual switches that you'll configure using Network-as-Code:
<figure markdown>
  ![CML Topology](./assets/cml-topology.png){ width="80%" }
</figure>
