Before moving to CI/CD automation, you need to clean up the manual work you've done so far. This ensures a fresh starting point for the GitLab-based workflow.

## Why Clean Up?

In the previous tasks, you:

- Created configuration files manually in VS Code
- Ran Terraform commands directly from WSL Ubuntu
- Deployed configurations to the IOS XE devices

Starting from the next task, you'll use **GitLab CI/CD pipelines** to automate all of this. The GitLab repository already contains a complete project setup, so you need to:

1. **Remove configurations from devices** - Undo the changes made during manual tasks
2. **Delete local files** - Clean up the manually created project folder

## Step 1: Destroy Terraform Resources

First, remove all configurations that Terraform deployed to the IOS XE devices. Open your WSL Ubuntu terminal.

Navigate to the project folder:

```bash
cd ~/nac-iosxe
```

Run Terraform destroy:

```bash
terraform destroy
```

When prompted, type `yes` to confirm. Terraform will:

- Connect to each IOS XE device
- Remove all configurations it previously applied (banners, ACLs, VLANs, etc.)
- Update the state file to reflect the clean state

!!! warning "Wait for Completion"
    The destroy process may take a few minutes. Wait until you see "Destroy complete!" before proceeding.

## Step 2: Verify Devices are Clean (Optional)

You can use **Solar-PuTTY** to connect to one of the devices and verify the configurations have been removed. As you did in Task 1, double-click on the **CORE** switch to connect.

Once connected, check that the banner and other configurations you applied are no longer present:

```bash
show running-config | include banner
```

```bash
show ip access-lists
```

## Step 3: Delete the Local Project Folder

Now remove the manually created project folder from WSL:

```bash
cd ~
```

```bash
rm -rf nac-iosxe
```

This deletes:

- `.env` - Credentials file
- `main.tf` - Terraform configuration
- `data/` - All YAML configuration files
- `.terraform/` - Downloaded modules and providers
- `terraform.tfstate` - State file

## Step 4: Verify Cleanup

Confirm the folder has been deleted:

```bash
ls -la ~/nac-iosxe
```

You should see an error: `ls: cannot access '/home/cisco/nac-iosxe': No such file or directory`

## What You've Accomplished

- ✅ Removed all Terraform-deployed configurations from IOS XE devices
- ✅ Deleted the manually created project folder
- ✅ Prepared a clean environment for CI/CD automation

## Next Steps

In the next task, you'll work with **GitLab** to:

- Use an existing project with pre-configured CI/CD pipelines
- Make changes through the GitLab Web IDE
- Let the pipeline automatically validate, plan, and deploy configurations

This transition from manual Terraform commands to automated CI/CD pipelines represents the real-world Network-as-Code workflow used in production environments.

