Earlier in this chapter, you deployed an access-list to the IOS XE network device. Below is the intent configuration YAML file you used:

```text
iosxe:
  devices:
    - name: devnet_sandbox_1
      url: https://10.10.20.48
      configuration:
        access_lists:
          standard:
            - name: StandardAccessList-bcn
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

You might have already asked yourself… how can I be confident that this configuration was deployed correctly?

For a basic configuration like the one above, you can verify it manually by running "show running-config" on the network device. However, this approach is not scalable — you will want to automate this task.

In the Network-as-Code framework, post-change validations are automated using Robot Framework and Pabot:

- **Robot Framework** is a generic open-source automation framework primarily used for acceptance testing. It is keyword-driven, making test cases easy to write and understand. 

- **Pabot** is a parallel executor for Robot Framework test suites. It helps speed up test execution by running Robot tests in parallel using multiple processes.

By combining Robot Framework for its simplicity and flexibility, and Pabot for speed through parallelism, the Network-as-Code framework can run large post-change tests quickly within CI/CD pipelines.

You may ask yourself how to customize the test cases for the configuration deployed to the IOS XE network device, and the answer is that the tests are rendered from the intent configuration YAML file you have defined.

To understand how this works, let’s illustrate with an example focused solely on testing access-lists:

#### Step1: Prepare file structure

To run post-change Robot Framework tests for IOS XE access-lists, you will need the following files:

```text
iosxe-as-code/
│
├── data/
│   │
│   └── system.nac.yaml
│
└── tests/
    │
    └── templates/
        │   
        ├── iosxe_common.resource
        │
        └── config/
            │    
            └── access_lists.robot
```

In this file structure:

- The file `data/system.nac.yaml` contains your intent configuration. This will be used to render Robot tests.
- The file `tests/templates/iosxe_common.resource` is a Robot Framework resource file. It contains reusable settings, variables, and keywords for IOS XE testing. This file is available at Cisco Internal GitHub. You can download this file from [NAC IOS XE Terraform Test Templates](https://wwwin-github.cisco.com/netascode/nac-iosxe-terraform/tree/master/tests/templates/).
- The file `tests/templates/config/access_lists.robot` is a Jinja2 template that is used to generate Robot Framework test cases for validating IOS XE access-list configurations. It uses intent-based YAML configuration files as input to dynamically render tests that verify attributes. This file is available at [IOS XE Robot test templates](https://wwwin-github.cisco.com/netascode/nac-iosxe-terraform/tree/master/tests/templates/config).

#### Step2: Run nac-test

Once you have all the files, attach to the NAC container and run the following `nac-test` command:

```text
nac-test \
  --data ./data \
  --templates ./tests/templates \
  --output ./tests/results/iosxe
```

This command will:

- All data from the YAML files in the `./data` folder will first be combined into a single data structure. In your case, this does not apply because there is only a single file.

- The resulting data structure is provided as input to the templating process. Each template in the `./tests/templates` folder will then be rendered and written to the `./tests` folder. In your case, you only have a single Robot test template, `access_lists.robot`, however in a production environment you will have a collection of tests, which are available at [NAC IOS XE Terraform Test Templates](https://wwwin-github.cisco.com/netascode/nac-iosxe-terraform/tree/master/tests/templates/).

- After all templates have been rendered, **Pabot** will execute all test suites in parallel and create a test report in the `./tests/results/iosxe` folder. Pabot will connect to the IOS-XE network device using the environment variables that you have defined earlier (i.e. `IOSXE_USERNAME` and `IOSXE_PASSWORD`).

#### Step3: Review Robot test file contet

If you check the `~/netascode/iosxe-as-code/tests/results/iosxe` directory, you will find the following structure:

```text
iosxe-as-code/
└── tests/
    └── results/
        └── iosxe/
            └── config/
                └── access_lists.robot
```

The `access_lists.robot` file contains the Robot tests rendered by the `nac-test` script. Its content is as follows:

```text
*** Settings ***
Documentation   Verify Access Lists Configuration
Suite Setup     Login IOSXE
Resource        ../iosxe_common.resource
Default Tags    config   iosxe   access_lists

*** Test Cases ***

Verify Standard Access List StandardAccessList-bcn Device devnet_sandbox_1
    ${r}=   GET On Session   IOSXE_devnet_sandbox_1   url=/restconf/data/Cisco-IOS-XE-native:native/ip/access-list/Cisco-IOS-XE-acl:standard=StandardAccessList-bcn
    Log   Response Status Code: ${r.status_code}
    Should Be Equal Value Json String   ${r.json()}   $..name   StandardAccessList-bcn
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

**Note:** This chapter has walked you through generating a single Robot test file to help you learn the process step by step. In real-world deployments, you will typically work with 100+ Robot test files, but starting small makes the process easier to understand and manage.

#### Step4: Review the results

The Terminal output of `nac-test` will be similar to:

```text
root@f1492caadb15:/nac/iosxe-as-code# nac-test \
  --data ./data \
  --templates ./tests/templates \
  --output ./tests/results/iosxe
Robot Framework remote server at 127.0.0.1:50179 started.
Storing .pabotsuitenames file
2025-06-21 06:24:01.385307 [PID:517] [0] [ID:0] EXECUTING Iosxe.Config.Access Lists
2025-06-21 06:24:02.793314 [PID:517] [0] [ID:0] PASSED Iosxe.Config.Access Lists in 1.4 seconds
1 tests, 1 passed, 0 failed, 0 skipped.
===================================================
Output:  /nac/iosxe-as-code/tests/results/iosxe/output.xml
XUnit:   /nac/iosxe-as-code/tests/results/iosxe/xunit.xml
Log:     /nac/iosxe-as-code/tests/results/iosxe/log.html
Report:  /nac/iosxe-as-code/tests/results/iosxe/report.html
Stopping PabotLib process
Robot Framework remote server at 127.0.0.1:50179 stopped.
PabotLib process stopped
Total testing: 1.40 seconds
Elapsed time:  1.80 seconds
root@f1492caadb15:/nac/iosxe-as-code#
```
Below a brief description:

- The Robot Framework remote server is started to execute the tests.
- A test named **Iosxe.Config.Access Lists** Domain is executed and passed.
- 1 test was run, and passed successfully.
- Output artifacts are generated:
   - output.xml: Test results in Robot Framework format.
   - xunit.xml: Results in xUnit format for CI integration.
   - log.html, report.html: Human-readable log and summary report.

The report `~/netascode/iosxe-as-code/tests/results/iosxe/report.html` should look similar to:

<figure markdown>
  ![alt text](./assets/iosxe-manual-robot.png){ width="100%" }
</figure>

#### Step5: Add additional access-lists configuration

Next step, you can try the following:

- Update the intent configuration file `data/system.nac.yaml` to add more access-list entries. Then run `terraform apply` to deploy the updated configuration to the IOS-XE network device.
- Check the result and compare it with the one from previous executions.
- Check the `~/netascode/iosxe-as-code/tests/results/iosxe/config/access_lists.robot` file. You should see that it has been updated to include Robot tests for the new access-list entries you added.

#### Step6: Add additional Robot test templates

Download additional Robot test templates from [NAC IOS XE Terraform Test Templates](https://wwwin-github.cisco.com/netascode/nac-iosxe-terraform/tree/master/tests/templates/) and place them in the corresponding folders under `~/netascode/iosxe-as-code/tests/templates/`. You can start with Banner configuration.

Run `nac-test` and check the results.