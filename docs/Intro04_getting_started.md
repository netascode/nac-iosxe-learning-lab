From your workstation, you will work on a RDP Session to Windows 10 VM with IP address 198.18.133.20 and credenitials admin / C1sco12345

<figure markdown>
  ![Lab Topology](./assets/lab-topology.png){ width="100%" }
</figure>

This lab consistems of:

- Multiple **IOS XE** virtual routers running in CML
- **GitLab** as Git repository and to run CI/CD pipeline running in Ubuntu VM
- Windows 10 VM with:
   - **VSCode** for editing Infrastructure as Code YAML files
   - SSH client **Solar-PuTTY** to access the IOSXE devices
   - **Windows Subsystem for Linux (WSL)** to run Terraform



!!! tip "Recommendation: Use the Lab Guide from Within the VM"
    We recommend reading this lab guide directly from the **Windows 10 VM** rather than from your laptop. The lab guide is already bookmarked in **Chrome** on the VM.
    
    **Why?** Copy/paste between your laptop and the RDP session is not straightforward. Since you'll need to copy YAML configurations from this guide into VS Code, working entirely within the VM will be much more practical and save you time.

