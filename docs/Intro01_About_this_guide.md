
##  About this Network-as-Code (NAC) IOSXE Lab Guide

This step-by-step guide walks you through **Network-as-Code for IOSXE** lab. At the end of completing the proposed tasks, you will know how to deploy and manage IOSXE devices with declarative infrastructure-as-code and CI/CD pipelines.

### What is Network-as-Code (NAC)?

Network-as-Code for IOSXE is an approach to network automation that treats IOSXE network infrastructure configuration as code. Similar to how developers manage application code, NAC allows network engineers to:
- **Define network configurations** in human-readable YAML files
- **Version control** all network changes using Git
- **Automate deployment** using Infrastructure-as-Code Terraform tool
- **Validate** configurations YAML files before applying them to devices
- **Test** configurations after applying them to the network
- **Track and audit** all changes with complete history

### Why This Lab Matters

Traditional network management relies on manual CLI commands, scripts and templates, which can lead to configuration drift across devices, human errors and inconsistencies, lack of change tracking and auditability, and difficulty in testing changes before deployment.

This lab demonstrates how Network-as-Code for IOSXE solves these challenges using:
- **Declarative configuration** - Define the desired state, not the steps to get there
- **GitLab CI/CD pipelines** - Automate testing, validation, and deployment
- **Terraform** - Industry-standard Infrastructure-as-Code tool
- **Schema validation** - Ensure configurations are correct before deployment
- **ROBOT testing** - Ensure configurations are correct after deployment

### What You'll Learn

By completing this lab, you will gain hands-on experience with:
- Writing network configurations in YAML format
- Using Terraform to manage Cisco IOS XE devices
- Implementing CI/CD pipelines for network changes
- Validating configurations with schema-based testing
- Applying best practices for network automation
- Leverage ROBOT testing for post-deployment checks

