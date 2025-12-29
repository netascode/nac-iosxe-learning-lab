In this task, you'll learn how to apply configuration to a **group of devices** simultaneously using device groups. You'll configure an Access Control List (ACL) as an example - demonstrating how device groups allow you to apply consistent configurations across devices that share common roles or functions.

## Understanding Device Groups

Device groups provide a mechanism for applying configurations to multiple devices without repeating the same settings for each device. As described in [IOS XE Device Group documentation](https://netascode.cisco.com/docs/data_models/iosxe/entity/device_group/), device groups sit in the middle of the configuration hierarchy:

**Configuration Precedence Hierarchy:**

1. **Device** (highest precedence) - device-specific overrides
2. **Device Group** (medium precedence) - role or location-specific settings
3. **Global** (lowest precedence) - organization-wide defaults

Device groups are particularly effective for:

- **Role-based configuration**: Grouping devices by function (access switches, core switches, border switches)
- **Service deployment**: Rolling out consistent service configurations across multiple devices
- **Security policies**: Applying common ACLs or security settings to device subsets

## Use Case: Standard ACL for Access Switches

In this example, you'll create a device group called **ACCESS_SWITCHES** that includes the **access01** and **access02** switches. These switches need a standard ACL to permit traffic from specific network ranges (`10.0.0.0/24` and `20.0.0.0/24`) - a typical requirement for access layer devices controlling traffic from known networks.

## Create the Device Group Configuration File

First, create the file using your **WSL Ubuntu terminal**:

```bash
touch ~/nac-iosxe/data/config-group-access.nac.yaml
```

The file will appear in VS Code's Explorer panel. Click on `config-group-access.nac.yaml` to open it and add the following content. Notice how the ACL is defined once in the device group and automatically applies to both **access01** and **access02** switches:

```text
---
iosxe:
  device_groups:
    - name: ACCESS_SWITCHES
      devices:
        - access01
        - access02
      configuration:
        access_lists:
          standard:
            - name: AccessLayerACL
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

The image below illustrates the ACL configuration in VS Code:

<figure markdown>
  ![VS Code ACL Configuration](./assets/vscode-acl.png){ width="100%" }
</figure>

## Configuration Breakdown

Let's break down the key elements:

**Device Group Section:**

- **`device_groups:`** - Defines one or more device groups
- **`name: ACCESS_SWITCHES`** - The group name identifier
- **`devices:`** - Lists member devices (`access01`, `access02`)
- **`configuration:`** - Contains settings applied to all group members

??? tip "Adding Devices to Groups"
    You can also add a device to a device group from under the device configuration section by specifying the `device_groups` attribute. This is useful when you want to assign a device to multiple groups or prefer defining group membership alongside device-specific settings.

    ```yaml
    ---
    iosxe:
      devices:
        - name: example-device
          device_groups:
            - EXAMPLE_GROUP1
            - EXAMPLE_GROUP2
            - EXAMPLE_GROUP3
          configuration:
            # device-specific configuration here
            ...
    ```

    The reference between the device and device group can be configured from both sides.

**Access List Configuration:**

- **`access_lists:`** - Top-level ACL configuration
- **`standard:`** - Specifies standard ACL type (filters based on source address only)
- **`name: AccessLayerACL`** - The ACL name
- **`entries:`** - Individual ACL rules (processed in sequence order)

**ACL Entry Details:**

- **Sequence 10**: Permits traffic from the `10.0.0.0/24` network
  - `action: permit` - Allows matching traffic
  - `prefix: 10.0.0.0` - The network address
  - `prefix_mask: 0.0.0.255` - Wildcard mask (matches `10.0.0.0` through `10.0.0.255`)

- **Sequence 20**: Permits traffic from the `20.0.0.0/24` network
  - `action: permit` - Allows matching traffic
  - `prefix: 20.0.0.0` - The network address
  - `prefix_mask: 0.0.0.255` - Wildcard mask (matches `20.0.0.0` through `20.0.0.255`)

!!! info "About Standard ACLs"
    Standard ACLs filter traffic based on source IP address only. There's an implicit deny at the end of every ACL, so traffic from any other networks will be denied.


## How Device Groups Work

When Terraform processes this configuration:

1. The **global banner** applies to all devices (**border**, **core**, **access01**, **access02**)
2. The **ACCESS_SWITCHES** group ACL applies only to **access01** and **access02** switches
3. If you later add device-specific configuration to the **access01** device, it would override group settings

This hierarchical approach ensures:

- No configuration duplication (ACL defined once, applied to multiple devices)
- Easy maintenance (update ACL in one place, changes apply to all group members)
- Scalability (add more switches by just adding them to the group's device list)
- Flexibility (individual devices can still override group settings if needed)


## Apply Access-list Configuration

Open your WSL Ubuntu terminal and navigate to your project directory. Run Terraform to deploy the ACL configuration to the device group:

```bash
cd ~/nac-iosxe
```

!!! note "terraform init not required"
    You do not need to run `terraform init` again, as the project has already been initialized in a previous task.

!!! note "terraform plan can be skipped"
    You can skip `terraform plan` if you want to go straight to applying the configuration.

    However, it's good practice to run `terraform plan` first to preview the changes that will be made.

```bash
terraform apply
```

When prompted, type `yes` to confirm the deployment. Terraform will create the standard ACL on all devices in the **ACCESS_SWITCHES** group (**access01** and **access02**).

<figure markdown>
  ![Terraform ACL Apply](./assets/terraform-acl-apply.png){ width="100%" }
</figure>

## Verify Device Group Configuration

After successfully running `terraform apply`, verify that the ACL was deployed only to the switches in the **ACCESS_SWITCHES** group.

**Use Solar-PuTTY to connect and verify:**

1. Open **Solar-PuTTY** from your desktop
2. Connect to the **access01** switch
3. Check if the ACL is present using the command below
4. Disconnect and repeat for the **access02** switch

???+ info "Validation via `show access-lists`"
    Use the following command on both **access01** and **access02** switches to verify the ACL:
    ```bash
    show access-lists | section AccessLayerACL
    ```

    ???+ quote "Expected output"
        <figure markdown>
          ![Show Access List](./assets/sh-access-list.png){ width="100%" }
        </figure>

    This confirms the standard ACL was successfully deployed to both **access01** and **access02** switches with both network permit entries.

??? info "Validation via `show run`"
    Alternatively, you can verify the ACL configuration by checking the running configuration:

    ```bash
    show run | section AccessLayerACL
    ```

    ???+ quote "Expected output"
        ```
        access01#show run | section AccessLayerACL
        ip access-list standard AccessLayerACL
        10 permit 10.0.0.0 0.0.0.255
        20 permit 20.0.0.0 0.0.0.255
        access01#
        ```

!!! note "Key observation"
    The ACL only appears on devices that are members of the **ACCESS_SWITCHES** group. If you check border or core switches (not in the group), they won't have this ACL - demonstrating the selective deployment capability of device groups.


## Generated Model File

As configured in `main.tf`, Terraform generates a merged model file (`model.yaml`) that combines global, device group, and device-specific configurations. Open `model.yaml` in VS Code to see how the ACL from the **ACCESS_SWITCHES** group is included only under the relevant devices.

<figure markdown>
  ![Model YAML File](./assets/vscode-model-file.png){ width="100%" }
</figure>

!!! tip "Review model.yaml"
    Reviewing the `model.yaml` file helps you understand how configurations are structured, and it is very useful for troubleshooting too.


## What You've Accomplished

In this task, you have:

- ✅ Learned about device groups and configuration hierarchy
- ✅ Created an **ACCESS_SWITCHES** device group with **access01** and **access02** switches
- ✅ Applied a standard ACL to multiple devices using a single definition
- ✅ Understood the precedence: Global < Device Group < Device
- ✅ Verified selective configuration deployment to group members only

**Success!** You've practiced using device groups to apply targeted configurations efficiently while maintaining global settings across all devices!

---

**Next:** [Task05 - Single Device Configuration](Task05_Single_device_configuration.md)

