### Task06 (optional) - VLAN Configuration Using Templates

In this task, you'll learn how to use **templates** to define reusable configuration blocks that can be applied to multiple devices. Templates are a powerful Network-as-Code feature that promotes configuration reuse, reduces duplication, and ensures consistency across your network infrastructure.

#### Understanding Templates

Templates in Network-as-Code allow you to define configuration once and apply it to multiple devices by reference. Instead of repeating the same configuration in each device's YAML file, you define a template and simply reference it where needed. This works for any type of configuration - VLANs, interfaces, security policies, QoS settings, and more.

As described in the [IOS-XE Template documentation](https://netascode.cisco.com/docs/data_models/iosxe/device/template/), templates provide:

- **Reusability**: Define configuration once, use it many times
- **Consistency**: Ensure identical configuration across devices
- **Maintainability**: Update template in one place, changes propagate everywhere
- **Modularity**: Keep configuration organized in separate, purpose-specific files

**Template Types:**

| Type | Description | Use Case |
|------|-------------|----------|
| `model` | YAML-based configuration template | Standard configurations (VLANs, ACLs, etc.) |
| `file` | External file reference | Large configurations stored separately |
| `cli` | Raw CLI commands | Legacy or complex CLI configurations |

In this task, you'll use the `model` type to create a VLAN template.

#### Use Case: Standard VLANs for Access Switches

Access switches typically share the same VLAN configuration - they need identical VLANs for user traffic, voice, and management. Instead of defining VLANs separately for access01 and access02, you'll create a single template and apply it to both devices.

**VLANs to configure:**
- VLAN 10: `DATA` - User data traffic
- VLAN 20: `VOICE` - VoIP traffic  
- VLAN 99: `MGMT` - Management traffic

#### Create the Template File

Use VS Code to create a new file `data/templates-vlan.nac.yaml` with the following content. This file defines a reusable VLAN template:

```yaml
iosxe:
  templates:
    - name: ACCESS_SWITCH_VLANS
      type: model
      configuration:
        vlan:
          vlans:
            - id: 10
              name: DATA
            - id: 20
              name: VOICE
            - id: 99
              name: MGMT
```

**Save the file** by pressing `Ctrl+S` in VS Code.

The image below illustrates the template configuration in VS Code:

<figure markdown>
  ![VS Code Template Configuration](img/vscode-template-vlans.png){ width="500" }
</figure>

#### Configuration Breakdown

Let's break down the key elements:

**Template Definition:**
- **`templates:`** - List of template definitions at the top level
- **`name: ACCESS_SWITCH_VLANS`** - Unique identifier for this template
- **`type: model`** - Indicates this is a YAML-based configuration template
- **`configuration:`** - Contains the actual configuration to be applied

**VLAN Configuration:**
- **`vlan:`** - VLAN configuration section
- **`vlans:`** - List of individual VLAN definitions
- **`id:`** - VLAN ID number (1-4094)
- **`name:`** - Descriptive name for the VLAN

#### Apply Template to Access Switches

Now you need to tell the access switches to use this template. Edit your existing `data/devices.nac.yaml` file and add the `templates` reference to the access switches:

```yaml
iosxe:
  global:
    configuration:
      banner:
        login: "Welcome to Network-as-Code Lab"
  
  devices:
    - name: core
      host: 198.18.130.10
    - name: border
      host: 198.18.130.20
    - name: access01
      host: 198.18.130.11
      templates:
        - ACCESS_SWITCH_VLANS
    - name: access02
      host: 198.18.130.12
      templates:
        - ACCESS_SWITCH_VLANS
```

**Save the file** by pressing `Ctrl+S` in VS Code.

The image below illustrates how devices reference the template:

<figure markdown>
  ![VS Code Devices with Templates](img/vscode-devices-templates.png){ width="500" }
</figure>

#### How Templates Work

When Terraform processes your configuration:

1. **Template Resolution**: Terraform reads `templates-vlan.nac.yaml` and loads the `ACCESS_SWITCH_VLANS` template
2. **Device Processing**: For each device in `devices.nac.yaml`, Terraform checks for template references
3. **Configuration Merge**: For access01 and access02 (which reference the template), the template's configuration is merged with their settings
4. **Deployment**: VLANs are created on both access01 and access02 (but not on core or border)

**Visual representation:**

```
┌─────────────────────────────────────────────────────────────┐
│                    TEMPLATE: ACCESS_SWITCH_VLANS            │
│                                                             │
│  vlan:                                                      │
│    vlans:                                                   │
│      - id: 10, name: DATA                                   │
│      - id: 20, name: VOICE                                  │
│      - id: 99, name: MGMT                                   │
└──────────────────────┬──────────────────────────────────────┘
                       │
         ┌─────────────┴─────────────┐
         │                           │
         ▼                           ▼
┌─────────────────┐         ┌─────────────────┐
│    access01     │         │    access02     │
│                 │         │                 │
│ templates:      │         │ templates:      │
│  - ACCESS_...   │         │  - ACCESS_...   │
│                 │         │                 │
│ Result:         │         │ Result:         │
│ - VLAN 10 DATA  │         │ - VLAN 10 DATA  │
│ - VLAN 20 VOICE │         │ - VLAN 20 VOICE │
│ - VLAN 99 MGMT  │         │ - VLAN 99 MGMT  │
└─────────────────┘         └─────────────────┘
```

#### Verify Project Structure

At this point, your `data/` folder should contain these files:

```
/home/cisco/nac-iosxe/
├── .env
├── main.tf
└── data/
    ├── devices.nac.yaml        # Device definitions + Global config + Template references
    ├── acl.nac.yaml            # Device Group configuration (ACL)
    ├── core.nac.yaml           # Device-specific configuration (IP hosts)
    └── templates-vlan.nac.yaml # Template definitions (VLANs)
```

**Remember to save both files** by pressing `Ctrl+S` in VS Code before proceeding.

#### Apply Template Configuration

Open your WSL Ubuntu terminal and navigate to your project directory. Run Terraform to deploy the VLAN configuration via template:

```bash
cd ~/nac-iosxe
terraform plan
terraform apply
```

When prompted, type `yes` to confirm the deployment. Terraform will create the three VLANs on both access01 and access02 switches.

**What to observe in the plan output:**
- Terraform shows VLAN creation for `access01`
- Terraform shows VLAN creation for `access02`
- Both devices receive identical VLAN configuration

<figure markdown>
  ![Terraform Apply Templates](img/terraform-apply-templates.png){ width="500" }
</figure>

#### Verify Template Configuration

After successfully running `terraform apply`, verify that the VLANs were deployed to both access switches.

**Use Solar-PuTTY to connect and verify:**

1. Open **Solar-PuTTY** from your desktop
2. Connect to the **access01** switch (198.18.130.11)
3. Run the verification command below
4. Disconnect and repeat for **access02** switch (198.18.130.12)

```bash
show vlan brief
```

**Expected output on both access switches:**

<figure markdown>
  ![Show VLAN Brief](img/sh-vlan-brief.png){ width="500" }
</figure>

You should see all three VLANs (10-DATA, 20-VOICE, 99-MGMT) configured on both devices.

**Alternative verification command:**

```bash
show run | section vlan
```

This shows the VLAN configuration in the running configuration.

#### Templates vs Other Configuration Methods

Here's a comparison of when to use templates versus other configuration approaches:

| Method | Best For | Example |
|--------|----------|---------|
| **Global** | Settings that apply to ALL devices | Login banners, NTP, Syslog |
| **Device Group** | Role-based settings for device subsets | ACLs for access layer, routing for core |
| **Device** | Unique settings for one device | Management IP hosts, special features |
| **Template** | Reusable configurations across selected devices | Standard VLANs, interface templates |

**Key Differences:**

- **Global**: Automatically applies to all devices
- **Device Group**: Applies to all members of a group
- **Template**: Only applies to devices that explicitly reference it

Templates give you fine-grained control - you choose exactly which devices get the template configuration by adding the template reference to each device.

#### Benefits of Using Templates

1. **Single Source of Truth**: VLAN definitions exist in one place
2. **Easy Updates**: Need to add VLAN 30? Update the template once, all devices get it
3. **Selective Application**: Not all devices need the same VLANs - only reference the template where needed
4. **Combine Multiple Templates**: A device can reference multiple templates for different configuration aspects

#### Applying Multiple Templates

One of the most powerful features of templates is the ability to apply **multiple templates** to a single device. This allows you to build modular, composable configurations where each template handles a specific aspect of the configuration.

For example, an access switch might need:
- **VLAN configuration** (from `ACCESS_SWITCH_VLANS`)
- **QoS policies** (from `ACCESS_SWITCH_QOS`)
- **Security settings** (from `ACCESS_SWITCH_SECURITY`)

```yaml
iosxe:
  devices:
    - name: access01
      host: 198.18.130.11
      templates:
        - ACCESS_SWITCH_VLANS
        - ACCESS_SWITCH_QOS
        - ACCESS_SWITCH_SECURITY
    - name: access02
      host: 198.18.130.12
      templates:
        - ACCESS_SWITCH_VLANS
        - ACCESS_SWITCH_QOS
        - ACCESS_SWITCH_SECURITY
```

**Benefits of multiple templates:**
- **Separation of concerns**: Each template handles one configuration domain
- **Mix and match**: Different devices can use different template combinations
- **Easier testing**: Test each template independently before combining
- **Team collaboration**: Different teams can own different templates

#### What You've Accomplished

In this task, you have:
- ✅ Learned about templates and their benefits for Network-as-Code
- ✅ Created a reusable VLAN template (`ACCESS_SWITCH_VLANS`)
- ✅ Applied the template to multiple access switches
- ✅ Verified consistent VLAN deployment across devices
- ✅ Understood when to use templates vs global/group/device configurations

**Success!** You've learned how to leverage templates for efficient, maintainable network configuration!

---

**Next:** Continue with the remaining optional tasks or proceed to Task09 for schema validation.
