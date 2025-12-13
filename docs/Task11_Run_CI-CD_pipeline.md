In previous tasks, you manually ran Terraform commands (`terraform init`, `terraform plan`, `terraform apply`) from the command line. While this works for learning and testing, production environments require automation. In this task, you'll learn how to run the same workflow automatically using **GitLab CI/CD pipelines**.

## Understanding CI/CD for Network-as-Code

CI/CD (Continuous Integration / Continuous Deployment) automates the process of validating and deploying your network configurations. When you push changes to GitLab, a pipeline automatically:

1. **Validates** your YAML configurations with `nac-validate`
2. **Plans** the changes with `terraform plan`
3. **Applies** the changes with `terraform apply`

This ensures every configuration change goes through the same consistent process, reducing human error and providing an audit trail of all changes.

## Step 1: Access GitLab

Open **Chrome** on the Windows 10 VM and navigate to GitLab:

```
https://198.18.133.101
```

!!! note "Certificate Warning"
    You may see a security warning because the lab uses a self-signed certificate. Click **Advanced** and then **Proceed to 198.18.133.101** to continue.

Log in with credentials: **Username:** `root` / **Password:** `C1sco12345`

<!-- SCREENSHOT: GitLab login page with username/password fields -->
<figure markdown>
  ![GitLab Login](./assets/gitlab-login.png){ width="100%" }
</figure>

## Step 2: Navigate to the NAC-IOSXE Project

After logging in, you'll see the GitLab dashboard. Click on the **netascode/nac-iosxe-terraform** project to open it.

<!-- SCREENSHOT: GitLab dashboard showing the netascode/nac-iosxe-terraform project -->
<figure markdown>
  ![GitLab Dashboard](./assets/gitlab-dashboard.png){ width="100%" }
</figure>

The project page shows your repository files, including:

- `data/` folder with your YAML configurations
- `tests/` folder with your ROBOT tests
- `main.tf` - Terraform configuration
- `.gitlab-ci.yml` - Pipeline definition file
- `.schema.yaml` - The Network as Code for IOSXE schema


<!-- SCREENSHOT: netascode/nac-iosxe-terraform project page showing files -->
<figure markdown>
  ![Project Files](./assets/gitlab-project-files.png){ width="100%" }
</figure>

## Step 3: Understanding the Pipeline Configuration

Before running the pipeline, let's understand how it's configured. Click on `.gitlab-ci.yml` to view the pipeline definition:

<!-- SCREENSHOT: .gitlab-ci.yml file content -->
<figure markdown>
  ![Pipeline YAML](./assets/gitlab-ci-yml.png){ width="100%" }
</figure>

The pipeline includes these stages:

```yaml
stages:
  - validate
  - plan
  - deploy
  - notify

validate:
  stage: validate
  script:
    - set -o pipefail && terraform fmt -check |& tee fmt_output.txt
    - set -o pipefail && nac-validate ./data/ |& tee validate_output.txt

plan:
  stage: plan
  script:
    - terraform init -input=false
    - terraform plan -out=plan.tfplan -input=false

deploy:
  stage: deploy
  script:
    - terraform init -input=false
    - terraform apply -input=false -auto-approve plan.tfplan

success:
  stage: notify
  script:
    - python3 .ci/webex-notification-gitlab.py -s
  when: on_success
```

**Key concepts:**

- **stages** - Define the order of execution (validate → plan → deploy → notify)
- **validate** - Runs `terraform fmt` check and `nac-validate` schema validation
- **plan** - Creates the Terraform execution plan
- **deploy** - Applies the configuration automatically (runs on main branch only)
- **notify** - Sends Webex notification on success or failure

## Step 4: View Existing Pipelines

To see the pipeline history, navigate to **Build** → **Pipelines** in the left sidebar.

<!-- SCREENSHOT: Left sidebar with Build > Pipelines highlighted -->
<figure markdown>
  ![Pipelines Menu](./assets/gitlab-pipelines-menu.png){ width="100%" }
</figure>

You'll see a list of past pipeline runs with their status (passed, failed, running).

<!-- SCREENSHOT: Pipeline list showing multiple runs with status -->
<figure markdown>
  ![Pipeline List](./assets/gitlab-pipeline-list.png){ width="100%" }
</figure>

## Step 5: Make a Change to Trigger the Pipeline

The best way to see the CI/CD pipeline in action is to make a configuration change. You'll update the login banner using GitLab's built-in **Web IDE** - an editor similar to VS Code that runs directly in your browser.

### Open the Web IDE

1. From the project page, click the **Edit** dropdown button (with a pencil icon)
2. Select **Web IDE**

<!-- SCREENSHOT: Edit dropdown showing Web IDE option -->
<figure markdown>
  ![Open Web IDE](./assets/gitlab-open-webide.png){ width="100%" }
</figure>

The Web IDE opens with a familiar VS Code-like interface:

<!-- SCREENSHOT: GitLab Web IDE interface -->
<figure markdown>
  ![Web IDE Interface](./assets/gitlab-webide-interface.png){ width="100%" }
</figure>

### Edit the Banner Configuration

1. In the file explorer (left panel), navigate to **data** folder
2. Click on `devices.nac.yaml` to open it
3. Find the `banner` section under `global` → `configuration`
4. Change the banner text to something new, for example:

```yaml
banner:
  login: "Welcome to Network-as-Code Lab in CL Amsterdam 2026"
```

<!-- SCREENSHOT: Editing devices.nac.yaml in Web IDE -->
<figure markdown>
  ![Edit Banner in Web IDE](./assets/gitlab-webide-edit-banner.png){ width="100%" }
</figure>

### Commit the Change

1. Click on **Source Control** icon in the left sidebar (or press `Ctrl+Shift+G`)

<figure markdown>
  ![Select Source Control](./assets/gitlab-webide-select-source-control.png){ width="100%" }
</figure>

2. You'll see your modified file listed
3. Enter a commit message: `Update banner via CI/CD`
4. Click **Commit to 'main'**

<!-- SCREENSHOT: Commit dialog in Web IDE -->

<figure markdown>
  ![Commit Message](./assets/gitlab-webide-commit-message.png){ width="100%" }
</figure>




!!! info "Pipeline Auto-Trigger"
    When you commit to the `main` branch, GitLab automatically triggers the CI/CD pipeline. No manual action required!

## Step 6: Monitor Pipeline Execution

Once the pipeline starts, click on the pipeline ID to view its progress.

<!-- SCREENSHOT: Pipeline detail view showing stages -->
<figure markdown>
  ![Pipeline Stages](./assets/gitlab-pipeline-stages.png){ width="100%" }
</figure>

You'll see each stage progressing:

1. **validate** - Green checkmark when YAML validation passes
2. **plan** - Shows planned changes
3. **apply** - Waiting for manual approval (if configured)

Click on any stage to view its detailed logs.

<!-- SCREENSHOT: Job logs showing terraform plan output -->
<figure markdown>
  ![Job Logs](./assets/gitlab-job-logs.png){ width="100%" }
</figure>

## Step 7: Verify Pipeline Success

When all stages complete successfully, the pipeline shows a green **passed** status.

<!-- SCREENSHOT: Completed pipeline with all stages green -->
<figure markdown>
  ![Pipeline Passed](./assets/gitlab-pipeline-passed.png){ width="100%" }
</figure>

You can verify the configuration was applied by SSH-ing to a device and checking the running configuration.

## What You've Accomplished

- ✅ Accessed GitLab and navigated to the NAC-IOSXE project
- ✅ Understood the CI/CD pipeline configuration
- ✅ Triggered a pipeline by committing a change
- ✅ Monitored pipeline execution through all stages

## Next Steps

In the next optional tasks, you can:

- **Task12**: Add ROBOT testing stage to the pipeline
- **Task13**: Create branches and merge requests for change approval workflows
