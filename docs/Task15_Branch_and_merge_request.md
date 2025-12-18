Task 15: Git Branches and Merge Requests

## Why This Task Matters

In Tasks 13 and 14, you learned to trigger CI/CD pipelines by committing directly to the `main` branch. While this approach works for learning purposes, **it's not how production environments operate**.

!!! warning "Best Practice Alert"
    Committing directly to the main branch - as we did in earlier tasks - is generally **not recommended** in production environments. This task teaches you the proper way to manage changes using branches and merge requests.

### DevOps for Network Operations

This chapter introduces **DevOps practices** that software developers have used for years, now applied to network operations:

| Traditional Network Ops | DevOps / NetDevOps Approach |
|------------------------|----------------------------|
| Make changes directly on devices | Define changes in code (YAML) |
| No review process | Peer review via merge requests |
| Manual change windows | Automated pipelines |
| Limited audit trail | Complete Git history |
| "It worked on my laptop" | Consistent, tested deployments |
| Single engineer makes changes | Team collaboration with branches |

By adopting these practices, network teams benefit from:

- **Reduced errors**: Changes are reviewed before deployment
- **Better collaboration**: Multiple engineers work on separate branches
- **Audit compliance**: Every change is tracked and approved
- **Faster rollbacks**: Easy to revert problematic changes
- **Consistent process**: Same workflow for every change, every time

This is why we're including this chapter - to show you the **real-world best practice** for managing network configurations with CI/CD.

---

## Understanding Git Branches

### What is a Branch?

A **branch** in Git is like a parallel universe for your code. When you create a branch, you create an independent copy of the codebase where you can make changes without affecting the original (main) version. Think of it like this:

- **Main branch**: The "production" version of your configurations - what's currently deployed on the network
- **Feature branch**: Your personal workspace where you develop and test changes before proposing them for deployment

**Why use branches?**

| Without Branches | With Branches |
|-----------------|---------------|
| Changes go directly to production | Changes are isolated until reviewed |
| Mistakes immediately affect the network | Mistakes are caught before deployment |
| No review process | Team members can review and approve |
| No audit trail of who approved what | Complete history of reviews and approvals |
| Difficult to collaborate | Multiple engineers can work in parallel |

### The Branch Workflow

In a typical Network-as-Code workflow:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         BRANCH WORKFLOW                                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  1. Engineer creates a feature branch from main                         │
│     main ─────●─────────────────────────────────────────────────────    │
│               │                                                         │
│               └──● feature/update-banner                                │
│                                                                         │
│  2. Engineer makes changes and commits to feature branch                │
│     main ─────●─────────────────────────────────────────────────────    │
│               │                                                         │
│               └──●──●──● feature/update-banner                          │
│                     │                                                   │
│                     └─ Pipeline: validate + plan (no deploy!)           │
│                                                                         │
│  3. Engineer creates Merge Request for team review                      │
│     Team lead reviews the changes and the Terraform plan                │
│                                                                         │
│  4. Team lead approves and merges to main                               │
│     main ─────●───────────────────●─────────────────────────────────    │
│               │                   │                                     │
│               └──●──●──●──────────┘                                     │
│                                   │                                     │
│                                   └─ Pipeline: deploy + test + notify   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Two Pipelines, Two Purposes

When using branches with GitLab CI/CD, different pipelines run depending on where changes are committed:

| Pipeline Trigger | Stages Executed | Purpose |
|-----------------|-----------------|---------|
| **Merge Request** (feature branch) | validate → plan | Preview changes safely without deploying |
| **Merge to Main** | validate → plan → deploy → test → notify | Actually deploy changes to the network |

This separation ensures that:

- Engineers can see exactly what will change (Terraform plan) before approval
- No changes are deployed until explicitly approved and merged
- The network remains stable while changes are being developed

## Understanding Protected Branches

### What is a Protected Branch?

A **protected branch** is a branch with restrictions that prevent accidental or unauthorized changes. When you protect the `main` branch:

- **Direct commits are blocked**: No one can push changes directly to main
- **Force push is prevented**: History cannot be rewritten
- **Merge requests required**: All changes must go through the review process
- **Approval required**: Changes need explicit approval before merging

### Why Protect the Main Branch?

In Network-as-Code, the main branch represents what's deployed on your production network. Protecting it ensures:

1. **Change Control**: Every change is reviewed before deployment
2. **Audit Trail**: Complete history of who proposed, reviewed, and approved each change
3. **Quality Gate**: Pipelines must pass before changes can be merged
4. **Rollback Capability**: Easy to identify and revert problematic changes

## Lab Exercise: Complete Branch Workflow

In this exercise, you'll:

1. Protect the main branch to require merge requests
2. Create a feature branch for your changes
3. Modify the banner configuration
4. Create a merge request and observe the first pipeline (validate + plan)
5. Approve and merge the request
6. Observe the second pipeline (deploy + test + notify)

Let's begin!

## Step 1: Access GitLab

Open **Chrome** on the Windows 10 VM and navigate to GitLab:

```
https://198.18.133.101
```

Log in with credentials: **Username:** `root` / **Password:** `C1sco12345`

Navigate to the **netascode/nac-iosxe-terraform** project.

## Step 2: Protect the Main Branch

First, you'll configure the main branch as protected to require merge requests for all changes.

### Navigate to Branch Protection Settings

1. In your project, click on **Settings** in the left sidebar
2. Select **Repository**
3. Scroll down to find the **Protected branches** section
4. Click **Expand** to see the settings

<!-- SCREENSHOT PLACEHOLDER: gitlab-settings-repository.png -->
<figure markdown>
  ![Repository Settings](./assets/gitlab-project-files.png){ width="100%" }
</figure>

### Configure Main Branch Protection

1. In the **Protected branches** section, you should see `main` listed (or you may need to add it)
2. Click on `main` to edit its protection settings
3. Configure the following settings:

| Setting | Value | Explanation |
|---------|-------|-------------|
| **Allowed to merge** | Maintainers | Only maintainers can merge approved changes |
| **Allowed to push and merge** | No one | Prevents direct commits to main |
| **Require approval from code owners** | Optional | Can require specific approvers |

4. Click **Protect** or **Save changes**

!!! warning "Important Setting"
    The key setting is **"Allowed to push and merge: No one"**. This prevents anyone from committing directly to main, forcing all changes to go through merge requests.

### Verify Branch Protection

After saving, you should see the main branch listed as protected with a shield icon. The settings should show:

- Push: **No one** (direct pushes blocked)
- Merge: **Maintainers** (only after approval)

## Step 3: Create a Feature Branch

Now that main is protected, you need to create a feature branch to make changes. You'll do this using the GitLab Web IDE.

### Open the Web IDE

1. From the project page, click the **Edit** dropdown button
2. Select **Web IDE**

<!-- SCREENSHOT: gitlab-open-webide.png -->
<figure markdown>
  ![Open Web IDE](./assets/gitlab-open-webide.png){ width="100%" }
</figure>

### Create a New Branch

1. In the Web IDE, look at the bottom-left corner of the screen
2. You'll see the current branch name (likely `main`)
3. Click on the branch name to open the branch selector
4. Click **Create new branch...**
5. Enter a descriptive branch name: `feature/update-banner`
6. Press **Enter** to create and switch to the new branch

!!! tip "Branch Naming Conventions"
    Use descriptive branch names that indicate the purpose of the changes:
    
    - `feature/add-vlan-100` - Adding a new feature
    - `fix/acl-typo` - Fixing a bug or error
    - `update/banner-message` - Updating existing configuration
    
    This makes it easy to understand what each branch contains without looking at the code.

You should now see `feature/update-banner` displayed in the bottom-left corner, indicating you're working on your new branch.

## Step 4: Modify the Banner Configuration

Now you'll make a change to the banner configuration file.

### Edit the Banner File

1. In the Web IDE file explorer (left panel), navigate to the **data** folder
2. Find and click on `config-global.nac.yaml` to open it

!!! note "File Extension"
    If the file has a `.yaml_` extension (with underscore), you'll need to rename it to `.yaml` first. Right-click the file and select **Rename**.

3. Modify the banner text to indicate this change came through a merge request:

```yaml
iosxe:
  global:
    configuration:
      banner:
        login: |
          #####################################
          #                                   #
          #   Network-as-Code Lab             #
          #   Change deployed via MR workflow #
          #                                   #
          #####################################
          Device: ${HOSTNAME}
      system:
        hostname: ${HOSTNAME}
```

4. The file will show as modified (you'll see a dot or 'M' indicator next to the filename)

## Step 5: Commit to the Feature Branch

Now commit your changes to the feature branch.

### Stage and Commit

1. Click on the **Source Control** icon in the left sidebar (or press `Ctrl+Shift+G`)
2. You'll see `config-global.nac.yaml` listed as a modified file
3. Enter a descriptive commit message:

```
Update banner to indicate MR workflow deployment

- Modified login banner text
- Added deployment method indicator
```

4. Click **Commit & Push**

!!! info "Commit to Feature Branch"
    Notice that the commit goes to `feature/update-banner`, NOT to `main`. Because main is protected, you couldn't commit there directly even if you tried!

## Step 6: Create a Merge Request

After committing to your feature branch, you need to create a merge request to propose merging your changes into main.

### Create the Merge Request

1. After pushing, GitLab may show a notification with a link to create a merge request
2. Alternatively, go to **Code** → **Merge requests** in the left sidebar
3. Click **New merge request**

### Configure the Merge Request

1. **Source branch**: Select `feature/update-banner`
2. **Target branch**: Select `main`
3. Click **Compare branches and continue**

### Fill in Merge Request Details

On the next screen, provide details about your change:

| Field | Value |
|-------|-------|
| **Title** | Update banner to indicate MR workflow |
| **Description** | This change updates the login banner to show that the configuration was deployed through the merge request workflow. |
| **Assignee** | Assign to yourself (or leave blank) |
| **Reviewer** | Assign to yourself for this lab exercise |

4. Click **Create merge request**

## Step 7: Observe the First Pipeline (Validate + Plan)

When you create the merge request, GitLab automatically triggers a pipeline. This is the **preview pipeline** that runs on merge requests.

### View the Pipeline

1. On the merge request page, scroll down to see the **Pipeline** section
2. You'll see a pipeline running or completed
3. Click on the pipeline ID or status to view details

### What This Pipeline Does

The merge request pipeline runs these stages:

| Stage | Job | Purpose |
|-------|-----|---------|
| **validate** | `terraform fmt`, `nac-validate` | Check YAML syntax and schema compliance |
| **plan** | `terraform plan` | Show what changes will be made to the network |

!!! warning "No Deploy Stage!"
    Notice that the **deploy** stage does NOT run on merge request pipelines. This is intentional - you want to see what will change without actually changing anything yet.

### Review the Terraform Plan

1. Click on the **plan** job to see its output
2. Scroll through the logs to find the Terraform plan output
3. You'll see exactly what configuration will be added, changed, or removed

This is your opportunity to verify that the changes are correct before approving!

**Example plan output:**

```
Terraform will perform the following actions:

  # iosxe_banner.global_banner will be updated in-place
  ~ resource "iosxe_banner" "global_banner" {
      ~ login_banner = <<-EOT
          - Welcome to Network-as-Code Lab
          + #####################################
          + #                                   #
          + #   Network-as-Code Lab             #
          + #   Change deployed via MR workflow #
          + #                                   #
          + #####################################
        EOT
    }

Plan: 0 to add, 4 to change, 0 to destroy.
```

## Step 8: Review and Approve the Merge Request

In a real environment, a team lead or senior engineer would review the merge request. For this lab, you'll approve it yourself.

### Review the Changes

1. On the merge request page, click on the **Changes** tab
2. Review the file differences (what was changed)
3. The changes should show the old banner text being replaced with the new text

### Approve the Merge Request

1. Click on the **Overview** tab
2. Look for the **Approve** button
3. Click **Approve** to indicate the changes are acceptable

!!! note "Self-Approval in Lab"
    In production environments, you typically cannot approve your own merge requests. GitLab can be configured to require approval from someone other than the author. For this lab, self-approval is enabled for simplicity.

### Verify Pipeline Passed

Before merging, ensure the pipeline completed successfully:

- All stages should show green checkmarks
- No errors in the validate or plan stages

## Step 9: Merge to Main

Now that the changes are approved and the pipeline passed, you can merge the feature branch into main.

### Perform the Merge

1. On the merge request page, find the **Merge** button
2. You may see options like:
   - **Merge** - Standard merge
   - **Merge when pipeline succeeds** - Wait for any running pipeline
   - **Delete source branch** - Remove the feature branch after merging

3. Check the **Delete source branch** option (keeps the repository clean)
4. Click **Merge**

!!! success "Congratulations!"
    Your changes have been merged into the main branch! This triggers the deployment pipeline.

## Step 10: Observe the Second Pipeline (Deploy + Test + Notify)

Merging to main triggers a new pipeline - this time including the deployment stage.

### View the Deployment Pipeline

1. Go to **Build** → **Pipelines** in the left sidebar
2. You'll see a new pipeline that was triggered by the merge
3. Click on it to view the stages

### What This Pipeline Does

The main branch pipeline runs ALL stages:

| Stage | Job | Purpose |
|-------|-----|---------|
| **validate** | `terraform fmt`, `nac-validate` | Verify configuration (again, for safety) |
| **plan** | `terraform plan` | Generate execution plan |
| **deploy** | `terraform apply` | **Actually deploy to network devices** |
| **test** | `nac-test` (if configured) | Verify deployment with Robot Framework |
| **notify** | Webex notification | Alert team of success/failure |

### Monitor the Deployment

1. Watch each stage progress from pending → running → passed
2. Click on the **deploy** job to see the Terraform apply output
3. You should see the configuration being applied to all devices

**Example deploy output:**

```
iosxe_banner.global_banner["core"]: Modifying...
iosxe_banner.global_banner["border"]: Modifying...
iosxe_banner.global_banner["access01"]: Modifying...
iosxe_banner.global_banner["access02"]: Modifying...

Apply complete! Resources: 0 added, 4 changed, 0 destroyed.
```

## Step 11: Verify the Deployment

After the pipeline completes successfully, verify the changes on the network devices.

### SSH to a Device

Use **Solar-PuTTY** to connect to any of the switches:

1. Open **Solar-PuTTY** from the desktop
2. Connect to the **CORE** switch (198.18.130.10)

### Verify the Banner

Run the following command:

```bash
show running-config | section banner
```

**Expected output:**

```
banner login ^C
#####################################
#                                   #
#   Network-as-Code Lab             #
#   Change deployed via MR workflow #
#                                   #
#####################################
Device: core
^C
```

The banner now shows that the change was deployed through the merge request workflow.

## Understanding the Complete Workflow

Let's summarize what happened:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    COMPLETE MR WORKFLOW SUMMARY                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  1. PROTECT MAIN                                                        │
│     └─ Prevents direct commits, requires merge requests                 │
│                                                                         │
│  2. CREATE FEATURE BRANCH                                               │
│     └─ Isolated workspace for your changes                              │
│                                                                         │
│  3. MAKE CHANGES                                                        │
│     └─ Edit configuration files safely                                  │
│                                                                         │
│  4. COMMIT TO FEATURE BRANCH                                            │
│     └─ Save changes without affecting production                        │
│                                                                         │
│  5. CREATE MERGE REQUEST                                                │
│     └─ Propose changes for review                                       │
│     └─ PIPELINE #1: validate + plan (preview only)                      │
│                                                                         │
│  6. REVIEW & APPROVE                                                    │
│     └─ Team reviews Terraform plan                                      │
│     └─ Approver confirms changes are correct                            │
│                                                                         │
│  7. MERGE TO MAIN                                                       │
│     └─ Changes integrated into production branch                        │
│     └─ PIPELINE #2: validate + plan + deploy + test + notify            │
│                                                                         │
│  8. VERIFY DEPLOYMENT                                                   │
│     └─ Confirm changes on network devices                               │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

## Real-World Scenarios

This workflow is how organizations manage network changes in production:

| Scenario | How the Workflow Helps |
|----------|----------------------|
| **Junior engineer makes a change** | Senior engineer reviews and approves before deployment |
| **Typo in configuration** | Caught during review before reaching the network |
| **Accidental deletion** | Protected branch prevents direct deletion of configs |
| **Audit requirement** | Complete history of who changed what and who approved |
| **Rollback needed** | Easy to revert a specific merge request |
| **Multiple engineers working** | Each works on separate branches without conflicts |

## Troubleshooting

### "You cannot push to this branch"

This means the branch protection is working! Create a feature branch instead of trying to push to main directly.

### Pipeline fails on merge request

1. Check the job logs for specific errors
2. Fix the issues in your feature branch
3. Commit and push again - the MR pipeline will re-run automatically

### Cannot approve own merge request

GitLab may be configured to require approval from someone else. For this lab, ensure self-approval is enabled in project settings.

### Merge button is disabled

The merge button may be disabled if:
- Pipeline hasn't passed yet (wait or check for errors)
- Approval is required but not given
- There are merge conflicts

## What You've Accomplished

In this task, you have:

- ✅ Understood why **direct commits to main** (as done in Tasks 13-14) are not a best practice
- ✅ Learned how **DevOps practices** from software development apply to network operations
- ✅ Understood the concept of Git **branches** for isolated, safe development
- ✅ Configured the main branch as **protected** to enforce change control
- ✅ Created a **feature branch** for your configuration changes
- ✅ Modified the banner configuration safely in your branch
- ✅ Created a **merge request** and observed the preview pipeline (validate + plan)
- ✅ Experienced the **review and approval** process
- ✅ Merged changes and observed the deployment pipeline (deploy + test + notify)
- ✅ Verified the changes on network devices
- ✅ Understood the **two-pipeline mechanism**: one for review, one for deployment
- ✅ Learned the complete **end-to-end workflow** used in production environments

**Success!** You've learned how network engineers apply DevOps best practices to manage network configurations safely. This branch-based workflow with merge requests, reviews, and automated pipelines is how modern organizations manage their network infrastructure!

---

**Next:** [Lab Conclusion](Workend01_conclusion.md) - Complete the lab and review what you've learned
