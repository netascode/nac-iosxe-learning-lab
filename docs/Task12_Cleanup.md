Before moving to CI/CD automation, you need to clean up the manual work you've done so far. This ensures a fresh starting point for the GitLab-based workflow.


!!! warning "Important Note"
    Once you run the cleanup, you will no longer be able to complete the optional [Tasks 07-09 (Templates)](Task07_Templates_type_model.md), or [Task 11 (Post-check Tests)](Task11_Post-checks.md). The cleanup removes all previous configuration from your devices to prepare for the CI/CD tasks.

    Please take a moment and check your remaining time to decide whether to proceed to the CI/CD section or spend more time on the optional tasks.

## Why Clean Up?

In the previous tasks, you:

- Created configuration files manually in VS Code
- Ran Terraform commands directly from WSL Ubuntu
- Deployed configurations to the IOS-XE devices

Starting from the next task, you'll use **GitLab CI/CD pipelines** to automate all of this. The GitLab repository already contains a complete project setup, so you need to:

1. **Remove configurations from devices** - Undo the changes made during manual tasks
2. **(Optionally) Delete local files** - You may clean up the manually created project folder as it's no longer needed

## Step 1: Destroy Terraform Resources

First, remove all configurations that Terraform deployed to the IOS-XE devices. Open your WSL Ubuntu terminal.

Navigate to the project folder:

```bash
cd ~/nac-iosxe
```

Run Terraform destroy:

```bash
terraform destroy
```

When prompted, type `yes` to confirm. Terraform will:

- Connect to each IOS-XE device
- Remove all configurations it previously applied (banners, ACLs, VLANs, etc.)
- Update the state file to reflect the clean state

!!! note "The destroy process may take a few minutes"
    Wait until you see "Destroy complete!" before proceeding.

!!! warning "Terraform destroy Warning"
    The `terraform destroy` command removes all configurations that were applied by Terraform. Use it with caution! In a production environment, do not run this command unless you intend to completely remove the deployed infrastructure.

    If you made any manual changes directly on the devices outside of Terraform, those changes will remain.

## Step 2: Verify NAC Configurations Are Removed (Optional)

You can use **Solar-PuTTY** to connect to one of the devices and verify the configurations have been removed. As you did in Task 01, double-click on the **core** switch to connect.

Once connected, check that the banner, hostname and other configurations you applied are no longer present. You can also check the running configuration.

```bash
show running-config
```

!!! note "Default Hostnames"
    If you completed [Task 06 - Variables](Task06_Variables.md), the hostnames revert to default (for example, `Switch` or `Router`). Running `terraform destroy` removes all changes made during the lab, reverting to defaults even if they were pre-configured manually before Terraform. Don't worry, the hostnames will be re-applied in the next task.


## Step 3: Delete the Local Project Folder (Optional)

If you wish, you may also remove the manually created project folder, `nac-iosxe`, as it's no longer needed.

??? info "Remove Project Folder"
    To delete the project folder, run the following commands in your WSL Ubuntu terminal:

    ```bash
    cd ~
    ```

    ```bash
    rm -rf ~/nac-iosxe
    ```

    This deletes:

    - `.env` - Credentials file
    - `main.tf` - Terraform configuration
    - `data/` - All YAML configuration files
    - `tftpl/` - Template files (.tftpl)
    - `tests/` - Robot Framework test files
    - `.terraform/` - Downloaded modules and providers
    - `terraform.tfstate` - State file

    You can verify the folder is deleted by listing the home directory contents:

    ```bash
    ls -la ~/
    ```
    You should no longer see the `nac-iosxe` folder listed.


## Step 4: Close VS Code and WSL Terminal

In the next tasks, you will no longer need VS Code and the WSL Ubuntu terminal. You can close both applications now.


## What You've Accomplished

- ✅ Removed all Terraform-deployed configurations from IOS-XE devices
- ✅ (Optionally) deleted the manually created project folder
- ✅ Prepared a clean environment for CI/CD automation

## Next Steps

In the next task, you'll work with **GitLab** to:

- Use an existing project with pre-configured CI/CD pipelines
- Make changes through the GitLab Web IDE
- Let the pipeline automatically validate, plan, and deploy configurations

While manual Terraform commands are useful for learning and small-scale changes, in production environments you will typically use automated CI/CD pipelines to implement the Network-as-Code workflow.

---

**Next:** [Task13 - Run CI/CD Pipeline](Task13_Run_CI-CD_pipeline.md)

