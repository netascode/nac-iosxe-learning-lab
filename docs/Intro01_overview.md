This step-by-step guide walks you through the **Network-as-Code for IOS-XE** lab. By the end, you will know how to deploy and manage IOS-XE devices with declarative infrastructure-as-code and CI/CD pipelines.

**Network-as-Code (NAC)** is an approach to network automation that treats network infrastructure configuration as code. Similar to how developers manage software application code, NAC allows network engineers to define network configurations in human-readable YAML files, version control all changes using Git, and automate deployment with Terraform.

**Why This Lab Matters**

Traditional network management relies on manual CLI commands, scripts and templates, which can lead to configuration drift, human errors, lack of change tracking, and difficulty testing changes before deployment.

This lab demonstrates how Network-as-Code solves these challenges using:

- **Declarative configuration** - Define the desired state, not the steps to get there
- **Terraform** - Industry-standard Infrastructure-as-Code tool
- **Schema validation** - Ensure configurations are correct before deployment
- **Post-deployment testing** - Verify configurations after deployment
- **GitLab CI/CD pipelines** - Automate validation, deployment, and testing

!!! note "Network-as-Code"
    Throughout this document, the terms Network-as-Code IOSXE, NAC IOSXE, and IOSXE-as-Code are used interchangeably and refer to the same automation solution.


**What You'll Learn**

By completing this lab, you will gain hands-on experience with:

- Writing desired network state configurations in NAC YAML format for IOS-XE devices
- Deploying the desired state using the Terraform implementation of NAC
- Validating and testing configurations
- Automating the network deployment lifecycle using GitLab CI/CD pipelines
- Applying best practices for network automation

**About This Guide**

Created by Asier Arlegui and Balu Novak-Bohak. Claude 4.5 Opus was used to assist the authors.

---

**Next:** [Lab Content](Intro02_all_learners.md)
