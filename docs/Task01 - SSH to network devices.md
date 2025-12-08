Before diving into Network-as-Code automation, it's important to establish baseline connectivity to your IOS XE devices and understand their current state. In this task, you'll use Solar-PuTTY to connect to the routers and verify their configuration.

## What You'll Learn

- How to connect to IOS XE devices using Solar-PuTTY
- How to verify device information with basic show commands
- What minimal configuration is required for Terraform/RESTCONF automation

## Open Solar-PuTTY

Solar-PuTTY is an enhanced SSH client that provides a tabbed interface for managing multiple device connections. The application is pre-installed and ready to use.

**To launch Solar-PuTTY:**

1. Look for the **Solar-PuTTY** icon on your Windows desktop
2. Double-click to open the application
3. You'll see the Solar-PuTTY interface with a list of devices

<figure markdown>
  ![Solar-PuTTY Interface](./assets/solarputty.png){ width="100%" }
</figure>


## Connect to the lab devices

The lab environment includes multiple IOS XE routers. All device credentials are **pre-configured** in Solar-PuTTY, so you can connect immediately without entering any login information.
**Devices in this lab:**

- **core** - Core router (198.18.130.10)
- **border** - Edge router 2 (198.18.130.20)
- **access01** - Edge router 1 (198.18.130.11)
- **access02** - Edge router 2 (198.18.130.12)

**To connect to a device:**

1. In Solar-PuTTY, select the **core** router from the device list
2. Click **Connect**
3. You'll be automatically logged in with the pre-configured credentials

<figure markdown>
  ![Solar-PuTTY SSH to Core](./assets/solarputty-ssh-core.png){ width="100%" }
</figure>


## Verify Device Information

Once connected to the router, run the following command to verify the device information:

```bash
show version
```

This displays:

- IOS XE software version
- Device model
- Uptime and system information
- Hardware details

Take a moment to review the output. You'll see this is a virtual Catalyst 8000V router running IOS XE.

## Review Current Configuration

Now let's check the running configuration to see what's currently configured on the device:

```bash
show run
```

!!! note
    The configuration is **almost empty** - this is intentional! The router has minimal configuration, which provides a clean slate for you to deploy Network-as-Code configurations via Terraform. However, you will see a few essential lines that enable Terraform to access the device.

## Configuration Required for Terraform Access

Look for these specific configuration lines in the `show run` output:

```
ip http secure-server
restconf
username cisco privilege 15 secret C1sco12345
```

**What these commands do:**

- **`ip http secure-server`** - Enables HTTPS server on the router, required for RESTCONF API access
- **`restconf`** - Enables the RESTCONF API, which Terraform uses to configure the device
- **`username cisco privilege 15 secret C1sco12345`** - Creates an administrative user that Terraform will use for authentication

**Important:** This configuration was pre-configured in the lab environment to enable automation. Without these commands, Terraform would not be able to connect to and configure the devices.

## Enabling RESTCONF Manually

If you needed to manually enable RESTCONF on a new device (not required in this lab), you would use these commands:

```
config t
ip http secure-server
restconf
username terraform privilege 15 secret C1sco12345
end
write memory
```

However, **you don't need to do this now** - it's already configured on all lab devices.

## Connect to Other Routers

After reviewing the **core** router:

1. Connect to the **border** router and repeat the same verification
2. Optionally, connect to **access01** and **access02** routers and repeat the same verification 

What to observe across all devices:

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

**Next:** [Task02 - Editing YAML Files](Task02%20-%20Editing%20YAML%20files.md)
