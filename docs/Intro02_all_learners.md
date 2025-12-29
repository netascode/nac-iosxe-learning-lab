We are mindful that this lab will be consumed by people with different levels of experience. Maybe you have never used VS Code and don't know what GitLab is. Maybe you are an advanced user of GitLab and use CI/CD pipelines every day.

The guide is segmented into **recommended tasks**, suitable for all users, and **optional tasks** intended for advanced users. The recommended tasks include detailed step-by-step guidance, while the optional ones aren't that prescriptive. 

**Fundamentals:**

- Task01: SSH to network devices in the lab
- Task02: Edit intent configuration YAML files with VS Code

**Deploy configuration to devices with Terraform manually:**

- Task03 : Global configuration
- Task04 : Device group configuration
- Task05 : Single device configuration
- Task06 (optional) : Variables
- Task07 (optional) : Templates type 'model'
- Task08 (optional) : Templates type 'file'
- Task09 (optional) : Templates type 'cli'

**Pre-checks and Post-checks manually:**

- Task10 : Pre-checks with schema validation
- Task11 (optional) : Post-checks with nac-test

**CI/CD Pipelines:**

- Task12 : Cleanup the lab (destroy Terraform state and local files)
- Task13 : Run a CI/CD pipeline (nac-validate, terraform plan, terraform apply)
- Task14 (optional) : Modify CI/CD pipeline to add tests
- Task15 (optional) : Merge Request workflow (Create branch, make a change, create a merge request, approve and merge to main)
