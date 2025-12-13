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

The **nac-validate** tool checks your YAML files against a schema definition. The schema acts as a contract that defines:

- What attributes are allowed
- What data types are expected
- What values are valid
- What fields are mandatory vs. optional

## The Schema File

The complete schema for IOS XE Network-as-Code is provided in **Appendix II**. This comprehensive schema includes validation rules for:

- Global configurations
- Device groups
- Device-specific configurations
- All IOS XE features (banners, ACLs, BGP, OSPF, VLANs, etc.)

**Create the schema file in your project:**

1. Use VS Code to create a new file named `.schema.yaml` (starting with a dot) in your project root folder (`\\wsl$\Ubuntu\home\aarlegui\nac-iosxe`)
2. Copy the complete schema content from **Appendix II**
3. Paste it into the `.schema.yaml` file
4. Save the file

Your project structure should now include:
```
/home/aarlegui/nac-iosxe/
├── .env
├── .schema.yaml         # ← New schema file
├── main.tf
└── data/
    └── devices.nac.yaml
```

## The nac-validate Tool in This Lab

The **nac-validate** tool is pre-installed in this lab environment and ready to use. You don't need to install anything - you can start validating your YAML files immediately.

## Run Schema Validation

Navigate to your project directory and run validation:

```bash
cd ~/nac-iosxe
nac-validate -s ~/schema.yaml data/
```

**NOTE: In the Cisco laptop, we need venv to install nac-validate, it says " If you wish to install a non-Debian-packaged Python package, create a virtual environment using python3 -m venv path/to/venv.    Then use path/to/venv/bin/python and path/to/venv/bin/pip. Make sure you have python3-full installed." We need to check this in dcloud!**

**Command breakdown:**

- **`nac-validate`** - The validation tool
- **`-s ~/schema.yaml`** - Specifies the schema file to validate against
- **`data/`** - The directory containing your YAML configuration files

## Successful Validation

If your YAML files are correct, the command will return without any output - you'll just get your prompt back:

```
aarlegui@CSCO-W-PF4BBNDD:~/nac-iosxe$ nac-validate -s ~/schema.yaml data/
aarlegui@CSCO-W-PF4BBNDD:~/nac-iosxe$
```

**No output means success!** This confirms that:

- ✅ Your YAML syntax is correct
- ✅ All attributes match the schema
- ✅ Data types are correct
- ✅ Values are valid (e.g., IP addresses are properly formatted)

## Validation Error Example

Let's intentionally introduce an error to see how validation catches it. 

**Example 1: Invalid IP address**

If you accidentally typed an invalid IP like `10.10.20.999` in your devices.nac.yaml:

```yaml
devices:
  - name: internet
    host: 10.10.20.999  # Invalid - octet > 255
```

Running `nac-validate` would produce:

```
ERROR - Syntax error 'data/devices.nac.yaml': iosxe.devices.0.host: '10.10.20.999' is not a valid IP address.
```

**Example 2: Wrong attribute name**

If you misspelled an attribute like `banner` as `banners`:

```yaml
global:
  configuration:
    banners:  # Should be "banner" (singular)
      login: "Welcome"
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
    - name: StandardAccessList-bcn
      entries:
        - sequence: 10
          action: allow  # Should be "permit" or "deny"
          prefix: 10.0.0.0
          prefix_mask: 0.0.0.255
```

Running `nac-validate` would produce:

```
ERROR - Syntax error 'data/devices.nac.yaml': iosxe.device_groups.0.configuration.access_lists.standard.0.entries.0.action: 'allow' not in enum('deny', 'permit')
```

## Validate Your Current Configuration

Let's validate the configuration you created in previous tasks. Your `data/devices.nac.yaml` should contain:
- Global banner
- Device group with ACL
- Device definitions

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
