This step-by-step guide walks you through the **Network-as-Code for IOS XE** lab. By the end, you will know how to deploy and manage IOS XE devices with declarative infrastructure-as-code and CI/CD pipelines.

**Network-as-Code (NAC)** is an approach to network automation that treats network infrastructure configuration as code. Similar to how developers manage application code, NAC allows network engineers to define configurations in human-readable YAML files, version control all changes using Git, and automate deployment with Terraform.

**Why This Lab Matters**

Traditional network management relies on manual CLI commands, scripts and templates, which can lead to configuration drift, human errors, lack of change tracking, and difficulty testing changes before deployment.

This lab demonstrates how Network-as-Code solves these challenges using:

- **Declarative configuration** - Define the desired state, not the steps to get there
- **Terraform** - Industry-standard Infrastructure-as-Code tool
- **Schema validation** - Ensure configurations are correct before deployment
- **ROBOT testing** - Verify configurations after deployment
- **GitLab CI/CD pipelines** - Automate testing, validation, and deployment

**What You'll Learn**

By completing this lab, you will gain hands-on experience with:

- Writing desired state network configurations in YAML format
- Using Terraform to manage Cisco IOS XE devices
- Implementing CI/CD pipelines for network changes
- Validating and testing configurations
- Applying best practices for network automation
