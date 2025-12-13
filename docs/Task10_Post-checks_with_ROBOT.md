!!! warning "Time Check"
    This is the most laborious task in the lab. If you're running short on time and want to experience the CI/CD pipeline, consider skipping this task and moving directly to **Task 11: Cleanup** followed by **Task 12: Run CI/CD Pipeline**.

In this task, you'll learn how to automate **post-change validation** using Robot Framework. Instead of manually verifying configurations on each device, you'll use the `nac-test` tool to automatically validate that your intent configuration was deployed correctly.

## Understanding Post-Change Validation

After deploying configuration changes, you need to verify they were applied correctly. For simple configurations, you might run `show running-config` manually, but this approach doesn't scale when managing dozens or hundreds of devices.

The Network-as-Code framework automates post-change validations using:

- **Robot Framework** - An open-source automation framework for acceptance testing. It's keyword-driven, making test cases easy to write and understand.
- **Pabot** - A parallel executor for Robot Framework that speeds up test execution by running tests simultaneously across multiple processes.

The key insight is that **tests are rendered from your intent configuration YAML files**. This means you don't write tests manually - they're automatically generated based on what you intended to configure.

## Use Case: Validating Access-List Configuration

In Task04, you deployed an access-list to the ACCESS switches using device groups. You'll now validate that configuration was applied correctly using Robot Framework.

Here's the intent configuration you deployed (`data/acl.nac.yaml`):

```yaml
iosxe:
  device_groups:
    - name: ACCESS
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

## Step 1: Prepare the File Structure

To run Robot Framework tests, you need the following file structure:

```text
nac-iosxe/
│
├── data/
│   └── acl.nac.yaml
│
└── tests/
    └── templates/
        ├── iosxe_common.resource
        └── config/
            └── access_lists.robot
```

Create the directory structure and files:

```bash
mkdir -p ~/nac-iosxe/tests/templates/config
touch ~/nac-iosxe/tests/templates/iosxe_common.resource
touch ~/nac-iosxe/tests/templates/config/access_lists.robot
```

**File descriptions:**

- **`data/acl.nac.yaml`** - Your intent configuration from Task04 (already exists)
- **`tests/templates/iosxe_common.resource`** - Robot Framework resource file with reusable keywords for IOS XE testing. Download from [NAC IOS XE Test Templates](https://wwwin-github.cisco.com/netascode/nac-iosxe-terraform/tree/master/tests/templates/)
- **`tests/templates/config/access_lists.robot`** - Jinja2 template for generating access-list tests. Download from [IOS XE Robot Test Templates](https://wwwin-github.cisco.com/netascode/nac-iosxe-terraform/tree/master/tests/templates/config)

## Step 2: Run nac-test

Once you have all the files, run the `nac-test` command from your project directory:

```bash
cd ~/nac-iosxe
nac-test \
  --data ./data \
  --templates ./tests/templates \
  --output ./tests/results/iosxe
```

**What this command does:**

1. **Combines data** - All YAML files in `./data` are merged into a single data structure
2. **Renders templates** - Each template in `./tests/templates` is rendered with your configuration data
3. **Executes tests** - Pabot runs all test suites in parallel and creates reports in `./tests/results/iosxe`

!!! note "Environment Variables"
    Pabot uses the `IOSXE_USERNAME` and `IOSXE_PASSWORD` environment variables you defined earlier to connect to devices.

## Step 3: Review the Generated Robot Test

After running `nac-test`, check the generated test file:

```text
nac-iosxe/
└── tests/
    └── results/
        └── iosxe/
            └── config/
                └── access_lists.robot
```

The `access_lists.robot` file contains tests automatically generated from your intent configuration:

```text
*** Settings ***
Documentation   Verify Access Lists Configuration
Suite Setup     Login IOSXE
Resource        ../iosxe_common.resource
Default Tags    config   iosxe   access_lists

*** Test Cases ***

Verify Standard Access List AccessLayerACL Device access01
    ${r}=   GET On Session   IOSXE_access01   url=/restconf/data/Cisco-IOS-XE-native:native/ip/access-list/Cisco-IOS-XE-acl:standard=AccessLayerACL
    Log   Response Status Code: ${r.status_code}
    Should Be Equal Value Json String   ${r.json()}   $..name   AccessLayerACL
    ${entry}=   Set Variable   $..access-list-seq-rule[?(@.sequence=='10')]
    Should Be Equal Value Json String   ${r.json()}   ${entry}..remark   
    Should Be Equal Value Json String   ${r.json()}   ${entry}..permit.std-ace.ipv4-address-prefix   10.0.0.0
    Should Be Equal Value Json String   ${r.json()}   ${entry}..permit.std-ace.mask   0.0.0.255
    Should Be Equal Value Json Bool   ${r.json()}   ${entry}..permit.std-ace.any   
    Should Be Equal Value Json Bool   ${r.json()}   ${entry}..permit.std-ace.host   
    Should Be Equal Value Json Bool   ${r.json()}   ${entry}..permit.std-ace.log   
    ${entry}=   Set Variable   $..access-list-seq-rule[?(@.sequence=='20')]
    Should Be Equal Value Json String   ${r.json()}   ${entry}..remark   
    Should Be Equal Value Json String   ${r.json()}   ${entry}..permit.std-ace.ipv4-address-prefix   20.0.0.0
    Should Be Equal Value Json String   ${r.json()}   ${entry}..permit.std-ace.mask   0.0.0.255
    Should Be Equal Value Json Bool   ${r.json()}   ${entry}..permit.std-ace.any   
    Should Be Equal Value Json Bool   ${r.json()}   ${entry}..permit.std-ace.host   
    Should Be Equal Value Json Bool   ${r.json()}   ${entry}..permit.std-ace.log   
```

!!! info "Scaling Up"
    This chapter walks you through a single Robot test file. In production environments, you'll typically work with 100+ Robot test files covering all configuration aspects.

## Step 4: Review the Test Results

The terminal output from `nac-test` shows the test execution:

```text
cisco@wkst1:~/nac-iosxe$ nac-test \
  --data ./data \
  --templates ./tests/templates \
  --output ./tests/results/iosxe
Robot Framework remote server at 127.0.0.1:50179 started.
Storing .pabotsuitenames file
2025-06-21 06:24:01.385307 [PID:517] [0] [ID:0] EXECUTING Iosxe.Config.Access Lists
2025-06-21 06:24:02.793314 [PID:517] [0] [ID:0] PASSED Iosxe.Config.Access Lists in 1.4 seconds
1 tests, 1 passed, 0 failed, 0 skipped.
===================================================
Output:  ~/nac-iosxe/tests/results/iosxe/output.xml
XUnit:   ~/nac-iosxe/tests/results/iosxe/xunit.xml
Log:     ~/nac-iosxe/tests/results/iosxe/log.html
Report:  ~/nac-iosxe/tests/results/iosxe/report.html
Stopping PabotLib process
Robot Framework remote server at 127.0.0.1:50179 stopped.
PabotLib process stopped
Total testing: 1.40 seconds
Elapsed time:  1.80 seconds
```

**Output artifacts:**

- **output.xml** - Test results in Robot Framework format
- **xunit.xml** - Results in xUnit format for CI/CD integration
- **log.html** - Detailed execution log
- **report.html** - Human-readable summary report

Open the report in a browser to see the visual results:

<figure markdown>
  ![Robot Framework Report](./assets/iosxe-manual-robot.png){ width="100%" }
</figure>

## Step 5: Try Additional Tests (Optional)

Now that you understand the process, try expanding your tests:

**Add more access-list entries:**

1. Update `data/acl.nac.yaml` with additional entries
2. Run `terraform apply` to deploy the changes
3. Run `nac-test` again
4. Check the updated `access_lists.robot` file - it will include tests for your new entries

**Add more Robot test templates:**

Download additional templates from [NAC IOS XE Test Templates](https://wwwin-github.cisco.com/netascode/nac-iosxe-terraform/tree/master/tests/templates/) and place them in `~/nac-iosxe/tests/templates/`. Start with the Banner configuration template.

## What You've Accomplished

In this task, you have:

- ✅ Learned how Robot Framework automates post-change validation
- ✅ Created the required file structure for testing
- ✅ Ran `nac-test` to generate and execute tests from your intent configuration
- ✅ Reviewed the auto-generated Robot test cases
- ✅ Understood how to interpret test results and reports

**Success!** You've automated configuration validation using intent-based testing!
