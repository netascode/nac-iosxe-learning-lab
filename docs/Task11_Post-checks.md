# Task 11 — Post-checks with `nac-test` (Optional)

**⏱ ~15 minutes**

!!! info "Before you start"
    This task depends on `.schema.yaml` from [Task 10 — Schema Validation](Task10_Schema_validation.md). Make sure Task 10 is done before continuing.

After Terraform applies a change, how do you confirm the configuration actually landed correctly on the devices? For one device, `show running-config` works. For a fleet, manual spot-checks don't scale — and running-config can't even tell you about operational state (BGP neighbor established, interface line-protocol up, VLAN database populated, etc.).

**`nac-test`** automates post-change validation by rendering Robot Framework tests directly from your intent YAML, then running them against the live devices. The test cases describe *what you asked for*; the framework confirms *what actually happened*.

- **Robot Framework** — a keyword-driven test framework; test cases are readable and easy to extend.
- **Pabot** — a parallel executor for Robot that runs suites simultaneously. Fast enough to run against many devices during a CI pipeline.

**The key insight:** you don't write tests by hand. `nac-test` renders them from the merged `model.yaml` NAC already produces — so the tests always match the intent.

## Use Case: Validating Access-List Configuration

In [Task 4](Task04_Device_group_config.md), you deployed an access-list to the access01 and access02 switches using device groups. You'll now validate that configuration was applied correctly using the `nac-test` tool.

!!! note "Lab Scope vs Production"
    In production environments, Robot Framework tests validate the **full configuration** – including VLANs, routing, interfaces, and all other deployed settings; you'll typically work with 100+ Robot test files covering all configuration aspects. For this lab, only the ACL configuration is validated to demonstrate the concept and workflow.

Here's the intent configuration you deployed (`data/config-group-access.nac.yaml`):

```yaml title="data/config-group-access.nac.yaml"
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

## Step 1: Prepare the File Structure

To run `nac-test`, checking the deployment of access-lists in the lab, you will need the following file structure:

```text { .no-copy }
nac-iosxe/
│
├── data/
│   └── config-group-access.nac.yaml
│
├── tests/
│   ├── filters/
│   │   └── url_encode.py
│   │
│   └── templates/
│       ├── iosxe_common.resource
│       ├── lib/
│       │   └── UtilsLib.py
│       └── config/
│           └── access_lists.robot
│
└── model.yaml
```

You can copy all required test files from the `~/tests/` directory in WSL Ubuntu:

```bash
cp -r ~/tests ~/nac-iosxe/
```

??? info "Alternative: Create Files Manually"
    If you need to, you can also create the files manually as follows:

    Create the directory structure and files in your **WSL Ubuntu terminal**:

    ```bash
    mkdir -p ~/nac-iosxe/tests/templates/config
    ```

    ```bash
    mkdir -p ~/nac-iosxe/tests/templates/lib
    ```

    ```bash
    mkdir -p ~/nac-iosxe/tests/filters
    ```

    ```bash
    touch ~/nac-iosxe/tests/templates/iosxe_common.resource
    ```

    ```bash
    touch ~/nac-iosxe/tests/templates/lib/UtilsLib.py
    ```

    ```bash
    touch ~/nac-iosxe/tests/templates/config/access_lists.robot
    ```

    ```bash
    touch ~/nac-iosxe/tests/filters/url_encode.py
    ```

    After creating the files, they will appear in VS Code's file explorer. Open each file and copy-paste the content from **[Appendix III](Appendix-III.md)**:

    - Copy the **url_encode.py** content into `tests/filters/url_encode.py`
    - Copy the **UtilsLib.py** content into `tests/templates/lib/UtilsLib.py`
    - Copy the **iosxe_common.resource** content into `tests/templates/iosxe_common.resource`
    - Copy the **access_lists.robot** content into `tests/templates/config/access_lists.robot`


**File descriptions:**

- **`data/config-group-access.nac.yaml`** - Your intent configuration from Task04 (already exists)
- **`tests/templates/config/access_lists.robot`** - Jinja2 template for generating access-list tests
- **`tests/templates/iosxe_common.resource`** - Robot Framework resource file with reusable keywords for IOSXE testing
- **`tests/filters/url_encode.py`, `tests/templates/lib/UtilsLib.py`** - Utility files for the `nac-test` tool

## Step 2: Have the Model File Ready

You will use the `model.yaml` file generated in the previous tasks as input to `nac-test`.

??? note "If the `model.yaml` file is missing"

    Before running `nac-test`, you need to run Terraform to generate the merged model file (`model.yaml`) that `nac-test` uses for rendering tests. If you haven't run the terraform commands below yet, do so now in your **WSL Ubuntu terminal**:

    ```bash
    cd ~/nac-iosxe
    ```

    ```bash
    terraform plan
    ```

    ```bash
    terraform apply
    ```
    When prompted, type `yes` to confirm the deployment.

    This generates two files in your project directory:

    - **`model.yaml`** - The merged YAML data model (all your configuration files combined)
    - **`defaults.yaml`** - The default values used by the module


## Step 3: Install nac-test

Install the **nac-test** tool using pip in your **WSL Ubuntu terminal**:

```bash
pip install nac-test
```

## Step 4: Run nac-test

Once you have the model files and test templates in place, run the `nac-test` command in your **WSL Ubuntu terminal**:

```bash
nac-test \
  --data ./model.yaml \
  --data ./defaults.yaml \
  --templates ./tests/templates \
  --filters ./tests/filters \
  --output /mnt/c/Users/admin/Desktop/TestResults
```


**What this command does:**

1. **Loads data** - Reads the merged model and defaults generated by Terraform
2. **Loads filters** - Loads custom Jinja2 filters from `./tests/filters`
3. **Renders templates** - Each template in `./tests/templates` is rendered with your configuration data
4. **Executes tests** - Pabot runs all test suites in parallel
5. **Creates reports** - Generates reports in the specified output directory

!!! info "Output Location"
    The test results are saved to your Windows Desktop (`C:\Users\admin\Desktop\TestResults`) for easy access. You can open the HTML reports directly in your browser.

## Step 5: Review the Generated Robot Test

After running `nac-test`, check the generated test file:

```text { .no-copy }
C:\Users\admin\Desktop\TestResults\
└── config/
    └── access_lists.robot
```

This is the **TestResults** folder on the Windows 10 desktop. You can open the file with VS Code, notepad, or view the generated test file using your **WSL Ubuntu terminal**:

```bash
cat /mnt/c/Users/admin/Desktop/TestResults/config/access_lists.robot
```

The `access_lists.robot` file contains tests automatically generated from your intent configuration:

```text { .no-copy }
*** Settings ***
Documentation   Verify Access Lists Configuration
Suite Setup     Login IOSXE
Resource        ../iosxe_common.resource
Default Tags    config   iosxe   access_lists

*** Test Cases ***

Verify Standard Access List AccessLayerACL Device access01
    ${r}=   GET On Session   IOSXE_access01   url=/restconf/data/Cisco-IOS-XE-native:native/ip/access-list/Cisco-IOS-XE-acl:standard=AccessLayerACL   expected_status=200
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

Verify Standard Access List AccessLayerACL Device access02
    ...
```

## Step 6: Review the Test Results

The terminal output from `nac-test`, that you ran earlier in Step 4, shows the test execution:

```text { hl_lines="12" .no-copy }
cisco@wkst1:~/nac-iosxe$ nac-test \
  --data ./model.yaml \
  --data ./defaults.yaml \
  --templates ./tests/templates \
  --filters ./tests/filters \
  --output /mnt/c/Users/admin/Desktop/TestResults
Robot Framework remote server at 127.0.0.1:36883 started.
Storing .pabotsuitenames file
2025-12-31 17:10:34.305712 [PID:25936] [0] [ID:0] EXECUTING TestResults.Config.Access Lists
2025-12-31 17:10:36.720046 [PID:25936] [0] [ID:0] PASSED TestResults.Config.Access Lists in 2.4 seconds
{'command': ['robot'], 'verbose': False, 'help': False, 'version': False, 'testlevelsplit': False, 'pabotlib': True, 'pabotlibhost': '127.0.0.1', 'pabotlibport': 0, 'processes': 4, 'processtimeout': None, 'artifacts': ['png'], 'artifactstimestamps': True, 'artifactsinsubfolders': False, 'shardindex': 0, 'shardcount': 1, 'chunk': False, 'no-rebot': False, 'argumentfiles': []}
2 tests, 2 passed, 0 failed, 0 skipped.
===================================================
Output:  /mnt/c/Users/admin/Desktop/TestResults/output.xml
XUnit:   /mnt/c/Users/admin/Desktop/TestResults/xunit.xml
Log:     /mnt/c/Users/admin/Desktop/TestResults/log.html
Report:  /mnt/c/Users/admin/Desktop/TestResults/report.html
Stopping PabotLib process
Robot Framework remote server at 127.0.0.1:36883 stopped.
PabotLib process stopped
Total testing: 2.40 seconds
Elapsed time:  3.41 seconds
cisco@wkst1:~/nac-iosxe$
```

**Output artifacts:**

- `output.xml` - Test results in Robot Framework format
- `xunit.xml` - Results in xUnit format for CI/CD integration
- `log.html` - Detailed execution log
- `report.html` - Human-readable summary report

Open the report in a browser to see the visual results. Navigate to your Desktop and open the `TestResults` folder, then double-click `report.html`:

<figure markdown>
  ![Robot Framework Report](./assets/iosxe-manual-robot.png){ width="100%" }
</figure>


!!! tip "Log Details"
    The `log.html` file contains detailed step-by-step execution information, including request and response data for each test case. This is useful for troubleshooting any test failures or understanding the test flow in depth.


## Step 7: Try Additional Tests (Optional)

Now that you understand the process, try expanding your tests:

**Add more access-list entries:**

1. Update `data/config-group-access.nac.yaml` with additional access-list entries
2. Run `terraform apply` to deploy the changes (this also regenerates `model.yaml`)
3. Run `nac-test` again
4. Check the updated `access_lists.robot` file – it will include tests for your new entries

## What You've Accomplished

In this task, you have:

- ✅ Learned how `nac-test` automates post-change validation
- ✅ Created the required file structure for testing (templates and filters)
- ✅ Executed `nac-test` to generate and execute tests from your configuration
- ✅ Reviewed the auto-generated Robot test cases
- ✅ Understood how to interpret test results and reports

!!! tip "CI/CD Integration"
    In [Task14 - Edit CI/CD](Task14_Edit_CI-CD.md), you'll see how `nac-test` tests are automatically integrated into the GitLab CI/CD workflow. The pipeline runs these tests after every deployment, ensuring continuous validation without manual intervention.

---

**Next:** [Task12 - Cleanup](Task12_Cleanup.md)
