You've been creating YAML configuration files and deploying them with Terraform. But how can you ensure your YAML files are correctly structured and contain valid data before deploying them to production devices?

Pre-change validation is a critical step in the Network-as-Code workflow. It catches errors early - before they reach your network devices - improving operational reliability and giving you confidence that your configurations are both syntactically and semantically correct.

## What is Schema Validation?

Schema validation verifies that your YAML configuration files:

- Follow the correct structure (proper indentation, key names, nesting)
- Contain valid data types (strings, integers, booleans)
- Use valid values (IP addresses in correct format, enums like 'permit'/'deny')
- Include all required fields
- Don't include unsupported attributes

This is similar to how a compiler checks code before running it - catching errors at "build time" rather than "run time".

## The nac-validate Tool

The **nac-validate** tool checks your YAML files against a schema definition. The schema acts as a contract that defines what attributes are allowed, what data types are expected, what values are valid, and which fields are mandatory vs. optional. For the complete schema documentation, see the [NAC IOS XE Data Models](https://netascode.cisco.com/docs/data_models/iosxe/) on the Cisco NetAsCode website.

## The Schema File

The complete schema for IOS XE Network-as-Code is documented on the [Cisco NetAsCode website](https://netascode.cisco.com/docs/data_models/iosxe/). For this lab, **Appendix II** contains only a subset of the schema relevant to the configurations we have deployed, including: global settings, devices, device groups, templates, banner, access lists, IP hosts, VLANs, and BGP.

**Create the schema file in your project:**

First, create the file using the `touch` command in your WSL Ubuntu terminal:

```bash
cd ~/nac-iosxe
touch .schema.yaml
```

Then use **VS Code** to copy-paste the schema content from **Appendix II** into the file. This approach is cleaner and avoids typos:

1. Open VS Code and navigate to your `nac-iosxe` folder
2. Open the `.schema.yaml` file you just created
3. Copy the complete schema content from **Appendix II**
4. Paste it into the file and save

Your project structure should now include:

```
/home/cisco/nac-iosxe/
├── .env
├── .schema.yaml         # ← New schema file
├── main.tf
└── data/
    ├── devices.nac.yaml       # Task03: Global banner + devices
    ├── acl.nac.yaml           # Task04: Device group ACL
    ├── core.nac.yaml          # Task05: IP hosts for CORE
    └── templates-vlan.nac.yaml # Task06: VLAN template
```

## The nac-validate Tool in This Lab

The **nac-validate** tool is pre-installed in this lab environment and ready to use. You don't need to install anything - you can start validating your YAML files immediately.

## Run Schema Validation

Navigate to your project directory and run validation:

```bash
cd ~/nac-iosxe
nac-validate -s .schema.yaml data/
```

**Command breakdown:**

- **`nac-validate`** - The validation tool
- **`-s .schema.yaml`** - Specifies the schema file to validate against
- **`data/`** - The directory containing your YAML configuration files

## Successful Validation

If your YAML files are correct, the command will return without any output - you'll just get your prompt back:

```
cisco@wkst1:~/nac-iosxe$ nac-validate -s .schema.yaml data/
cisco@wkst1:~/nac-iosxe$
```

**No output means success!** This confirms that:

- ✅ Your YAML syntax is correct
- ✅ All attributes match the schema
- ✅ Data types are correct
- ✅ Values are valid (e.g., IP addresses are properly formatted)

## Validation Error Example

Let's intentionally introduce an error to see how validation catches it. 

**Example 1: Invalid IP address**

If you accidentally typed an invalid IP like `198.18.130.999` in your devices.nac.yaml:

```yaml
devices:
  - name: core
    host: 198.18.130.999  # Invalid - octet > 255
```

Running `nac-validate` would produce:

```
ERROR - Syntax error 'data/devices.nac.yaml': iosxe.devices.0.host: '198.18.130.999' is not a valid IP address.
```

**Example 2: Wrong attribute name**

If you misspelled an attribute like `banner` as `banners`:

```yaml
global:
  configuration:
    banners:  # Should be "banner" (singular)
      login: "Welcome to Network-as-Code Lab"
```

Running `nac-validate` would produce:

```
ERROR - Syntax error 'data/devices.nac.yaml': iosxe.global.configuration: key 'banners' is not defined in schema
```

**Example 3: Invalid enum value**

If you used an invalid action in an ACL:

```yaml
access_lists:
  standard:
    - name: AccessLayerACL
      entries:
        - sequence: 10
          action: allow  # Should be "permit" or "deny"
          prefix: 10.0.0.0
          prefix_mask: 0.0.0.255
```

Running `nac-validate` would produce:

```
ERROR - Syntax error 'data/acl.nac.yaml': iosxe.device_groups.0.configuration.access_lists.standard.0.entries.0.action: 'allow' not in enum('deny', 'permit')
```

## Validate Your Current Configuration

Let's validate the configurations you created in previous tasks. Your `data/` folder should contain:

- **devices.nac.yaml** - Global banner + device definitions (Task03)
- **acl.nac.yaml** - Device group with ACL (Task04)
- **core.nac.yaml** - IP hosts for CORE switch (Task05)
- **templates-vlan.nac.yaml** - VLAN template (Task06)

**Run the validation:**

Navigate to your project directory and run nac-validate:

```bash
cd ~/nac-iosxe
nac-validate -s .schema.yaml data/
```

**Note:** The `-s .schema.yaml` flag points to the schema file you just created in your project root folder.

If everything is correct, you'll get your prompt back with no output. If there are errors, the tool will tell you exactly what's wrong and where.

## Common Validation Errors and Fixes

| Error Message | Cause | Fix |
|--------------|-------|-----|
| `not a valid IP address` | IP address format is wrong | Check IP has 4 octets, each 0-255 |
| `key 'X' is not defined in schema` | Attribute name is misspelled or not supported | Check spelling against schema.yaml |
| `not in enum(...)` | Using invalid value for a field | Use one of the allowed values from the error message |
| `required field` | Missing a mandatory attribute | Add the required field to your YAML |
| `not a ip` | Expected IP address but got something else | Provide valid IP address format |

## Integrating Validation into Your Workflow

**Best practice workflow:**

1. Edit your YAML files in VS Code
2. **Run `nac-validate`** to check for errors
3. Fix any errors reported
4. Run `terraform plan` to preview changes
5. Run `terraform apply` to deploy

By validating before running Terraform, you catch configuration errors immediately without attempting to connect to devices. This saves time and prevents partial deployments of invalid configurations.

## What You've Accomplished

In this task, you have:

- ✅ Understood the importance of pre-change validation
- ✅ Learned about schema-based validation
- ✅ Installed and used the nac-validate tool
- ✅ Validated your YAML configuration files
- ✅ Understood common validation errors and how to fix them
- ✅ Integrated validation into your Network-as-Code workflow

**Success!** You now have a safety check in place to catch configuration errors before they reach your network devices. This is a critical DevOps practice that prevents misconfigurations and improves reliability.

---

**Next:** [Task10 - Post-checks with ROBOT](Task10_Post-checks_with_ROBOT.md)
