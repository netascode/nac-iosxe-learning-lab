In this task, you'll learn how to use **device groups** to apply Access Control List (ACL) configurations to multiple devices simultaneously. Device groups are a powerful Network-as-Code feature that allows you to apply consistent configurations across devices that share common roles or functions.

### Understanding Device Groups

Device groups provide a mechanism for applying configurations to multiple devices without repeating the same settings for each device. As described in [IOS-XE Device Group documentation](https://netascode.cisco.com/docs/data_models/iosxe/entity/device_group/), device groups sit in the middle of the configuration hierarchy:

**Configuration Precedence Hierarchy:**
1. **Device** (highest precedence) - device-specific overrides
2. **Device Group** (medium precedence) - role or location-specific settings  
3. **Global** (lowest precedence) - organization-wide defaults

Device groups are particularly effective for:
- **Role-based configuration**: Grouping devices by function (access switches, core routers, edge routers)
- **Service deployment**: Rolling out consistent service configurations across multiple devices
- **Security policies**: Applying common ACLs or security settings to device subsets

### Use Case: Standard ACL for Access Switches

In this example, you'll create a device group called "ACCESS" that includes the access01 and access02 switches. These routers need a standard ACL to permit traffic from specific network ranges (10.0.0.0/24 and 20.0.0.0/24) - a typical requirement for access layer devices controlling traffic from known networks.

### Create the YAML Configuration with Device Groups

Use VS Code to create a new file `data/acl.nac.yaml` with the following content. Notice how the ACL is defined once in the device group and automatically applies to both access01 and access02 switches:

```text
iosxe:
  device_groups:
    - name: ACCESS
      devices:
        - access01
        - access02
      configuration:
        access_lists:
          standard:
            - name: StandardAccessList-Amsterdam
              entries:
                - sequence: 10
                  action: permit
                  prefix: 10.0.0.0
                  prefix_mask: 0.0.0.255
                - sequence: 20
                  action: permit
                  prefix: 20.0.0.0
                  prefix_mask: 0.0.0.255
```

**Save the file** by pressing `Ctrl+S` in VS Code. You should see the white dot disappear from the file tab, indicating the file has been saved successfully.

The image below illustrates the ACL configuration in VS Code:

<figure markdown>
  ![VS Code ACL Configuration](img/vscode-acl.png){ width="500" }
</figure>

### Configuration Breakdown

Let's break down the key elements:

**Device Group Section:**
- **`device_groups:`** - Defines one or more device groups
- **`name: ACCESS`** - The group name identifier
- **`devices:`** - Lists member devices (access01, access02)
- **`configuration:`** - Contains settings applied to all group members

**Access List Configuration:**
- **`access_lists:`** - Top-level ACL configuration
- **`standard:`** - Specifies standard ACL type (filters based on source address only)
- **`name: StandardAccessList-Amsterdam`** - The ACL name
- **`entries:`** - Individual ACL rules (processed in sequence order)

**ACL Entry Details:**

- **Sequence 10**: Permits traffic from the 10.0.0.0/24 network
  - `action: permit` - Allows matching traffic
  - `prefix: 10.0.0.0` - The network address
  - `prefix_mask: 0.0.0.255` - Wildcard mask (matches 10.0.0.0 through 10.0.0.255)

- **Sequence 20**: Permits traffic from the 20.0.0.0/24 network
  - `action: permit` - Allows matching traffic
  - `prefix: 20.0.0.0` - The network address
  - `prefix_mask: 0.0.0.255` - Wildcard mask (matches 20.0.0.0 through 20.0.0.255)
  
**Note:** Standard ACLs filter traffic based on source IP address only. There's an implicit deny at the end of every ACL, so traffic from any other networks will be denied.



### How Device Groups Work

When Terraform processes this configuration:

1. The **global banner** applies to all devices (border, core, access01, access02)
2. The **ACCESS group ACL** applies only to access01 and access02 switches
3. If you later add device-specific configuration to the "access01" device, it would override group settings

This hierarchical approach ensures:
- ✅ No configuration duplication (ACL defined once, applied to multiple devices)
- ✅ Easy maintenance (update ACL in one place, changes apply to all group members)
- ✅ Scalability (add more border routers by just adding them to the group's device list)
- ✅ Flexibility (individual devices can still override group settings if needed)


### Apply Access-list Configuration

Open your WSL Ubuntu terminal and navigate to your project directory. Run Terraform to deploy the ACL configuration to the device group:

```bash
cd ~/nac-iosxe
terraform plan
terraform apply
```

When prompted, type `yes` to confirm the deployment. Terraform will create the standard ACL on all devices in the ACCESS group (access01 and access02).

<figure markdown>
  ![Terraform ACL Apply](img/terraform-acl-apply.png){ width="500" }
</figure>

### Verify Device Group Configuration

After successfully running `terraform apply`, verify that the ACL was deployed only to the routers in the ACCESS group.

**Use Solar-PuTTY to connect and verify:**

1. Open **Solar-PuTTY** from your desktop
2. Connect to the **access01** switch
3. Check if the ACL is present using the command below
4. Disconnect and repeat for the **access02** switch

```bash
show access-lists
```

**Expected output:**

<figure markdown>
  ![Show Access List](img/sh-access-list.png){ width="500" }
</figure>

This confirms the standard ACL was successfully deployed to both access01 and access02 switches with both network permit entries.

**Key observation:** The ACL only appears on devices that are members of the ACCESS group. If you check border or core routers (not in the group), they won't have this ACL - demonstrating the selective deployment capability of device groups.

### What You've Accomplished

In this task, you have:
- ✅ Learned about device groups and configuration hierarchy
- ✅ Created an ACCESS device group with access01 and access02 switches
- ✅ Applied a standard ACL to multiple devices using a single definition
- ✅ Understood the precedence: Global < Device Group < Device
- ✅ Verified selective configuration deployment to group members only

**Success!** You've practiced using device groups to apply targeted configurations efficiently while maintaining global settings across all devices!

---

**Next:** Continue with the remaining tasks to explore more advanced Network-as-Code features.

