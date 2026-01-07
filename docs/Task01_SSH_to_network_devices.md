Before diving into Network-as-Code automation, it's important to establish baseline connectivity to your IOS XE devices and understand their current state. In this task, you'll use Solar-PuTTY to connect to the switches and verify their configuration.

## What You'll Learn

- How to connect to IOS XE devices using Solar-PuTTY
- How to verify device information with basic show commands
- What minimal configuration is required for Network-as-Code/RESTCONF automation

## Open Solar-PuTTY

Solar-PuTTY is an enhanced SSH client that provides a tabbed interface for managing multiple device connections. The application is pre-installed in the lab Windows 10 VM and ready to use.

**To launch Solar-PuTTY:**

1. Look for the **Solar-PuTTY** icon on your lab's Windows 10 VM
2. Double-click to open the application
3. You'll see the Solar-PuTTY interface with a list of devices

<figure markdown>
  ![Solar-PuTTY Interface](./assets/solarputty.png){ width="95%" }
</figure>

## Connect to the lab devices

The lab environment includes multiple IOS XE switches. All device credentials are **pre-configured** in Solar-PuTTY, so you can connect immediately without entering any login information.

**Devices in this lab:**

- **access01** - Access switch (198.18.130.11)
- **access02** - Access switch (198.18.130.12)
- **border** - Border switch (198.18.130.20)
- **core** - Core switch (198.18.130.10)

!!! info "Additional Devices"
    The lab topology also includes **isp**, **host01**, **host02**, **ntp-server**, and **syslog-server** devices. These are pre-configured for connectivity testing and will not be managed via Network-as-Code in this lab.

<figure markdown>
  ![CML Topology](./assets/cml-topology.png){ width="60%" }
</figure>

!!! tip "Lab Topologies Reference"
    At any time during the lab, you can refer to [Topologies](Intro05_topologies.md) for the topology diagrams, device IP addresses and credentials.


**To connect to a device:**

1. In Solar-PuTTY, **double-click** on the device in the list
2. You'll be automatically logged in with the pre-configured credentials

<figure markdown>
  ![Solar-PuTTY SSH to core](./assets/solarputty-ssh-core.png){ width="95%" }
</figure>

## Verify Device Information

Once connected to the switch, run the following command to verify the device information:

```bash
show version
```

!!! tip "Copy from the lab guide"
    You can copy commands directly from this lab guide by clicking on the icon at the top right corner of the command block and paste them into Solar-PuTTY using **right-click**.

This displays:

- IOS XE software version
- Device model
- Uptime and system information
- Hardware details

Take a moment to review the output. You'll see this is a virtual Catalyst 9000 switch running IOS XE.

## Review Current Configuration

Now let's check the running configuration to see what's currently configured on the device:

```bash
show run
```

!!! info
    The lab device configurations are almost empty - this is intentional! The switches have minimal configurations, which provides a clean slate for you to deploy Network-as-Code configurations via Terraform. However, you will see a few essential lines that enable Terraform to access the devices.

## Configuration Required for Terraform Access

Look for these specific configuration lines in the `show run` output:

```
username nac_admin privilege 15 secret cisco
...
ip http secure-server
...
restconf
```

**What these commands do:**

- **`ip http secure-server`** - Enables HTTPS server on the switch, required for RESTCONF API access
- **`restconf`** - Enables the RESTCONF API, which Terraform uses to configure the device
- **`username nac_admin privilege 15 secret cisco`** - Creates an administrative user that Terraform will use for authentication. In the `show run` output, you will see the password is encrypted for security.

**Important:** This configuration was pre-configured in the lab environment to enable automation. Without these commands, Terraform would not be able to connect to and configure the devices.

!!! note "Dedicated User"
    It is good practice to have a dedicated administrative user configured for automation tasks, as shown above with the `nac_admin` user. This helps separate human and automated access for better security and auditing.

    With the Network-as-Code framework, this user needs to be configured on all devices that Terraform will manage.

!!! info "RESTCONF and NETCONF"
    This version of the lab guide focuses on using RESTCONF for device configuration only. Very recently, NETCONF support has also been added to the ciscodevnet/iosxe Terraform provider as the default protocol. Future versions of this lab may include NETCONF examples as well. Currently the lab devices are not configured to support NETCONF. For more information, refer to the provider documentation [here](https://registry.terraform.io/providers/CiscoDevNet/iosxe/latest/docs#protocol-3).

## Enabling RESTCONF Manually
!!! tip
    You don't need to do this now - it's already configured on all lab devices.

If you needed to manually enable RESTCONF on a new device, you would use these commands:

```
config t
ip http secure-server
restconf
username nac_admin privilege 15 secret cisco
end
write memory
```

???+ note "RESTCONF Availability"
    If you are configuring your own devices outside of this lab, note that after enabling RESTCONF, it takes a few minutes for the RESTCONF API to become available.
    You can verify RESTCONF availability with the following command (executed from the machine where you will run Terraform later):

    ```bash
    curl -i -k -X "GET" "https://<IP_ADDRESS>/restconf/" -u <USERNAME>:<PASSWORD>
    ```

    For example, in the lab, you can check RESTCONF on the access01 device by opening your WSL Ubuntu terminal and running:

    ```bash
    curl -i -k -X "GET" "https://198.18.130.11/restconf/" -u cisco:cisco
    ```

## What to observe across all devices

- All devices have minimal configuration
- All devices have RESTCONF enabled
- All devices are ready for Network-as-Code automation

## What You've Accomplished

At this point, you have:

- ✅ Connected to IOS XE devices using Solar-PuTTY
- ✅ Verified device information with `show version`
- ✅ Reviewed the minimal running configuration
- ✅ Identified the RESTCONF configuration that enables Terraform automation
- ✅ Confirmed all devices are ready for Network-as-Code deployment

In the next task, you'll start creating YAML configuration files that define your desired network state, which Terraform will then deploy to these devices.

---

**Next:** [Task02 - Editing YAML Files](Task02_Editing_YAML_files.md)
