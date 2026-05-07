This step-by-step guide walks you through the **Network-as-Code for IOS-XE** lab. By the end, you will know how to deploy and manage IOS-XE devices with declarative infrastructure-as-code and CI/CD pipelines.

**Network-as-Code (NAC)** is an approach to network automation that treats network infrastructure configuration as code. Similar to how developers manage software application code, NAC allows network engineers to define network configurations in human-readable YAML files, version control all changes using Git, and automate deployment with Terraform.

## Why this lab matters

Traditional network management relies on manual CLI commands, scripts, and brittle templates. The typical failure modes — configuration drift, human error, no change history, and no safe way to preview or test changes — are well understood but rarely solved at scale.

This lab shows how Network-as-Code addresses each of them using:

- **Declarative configuration** — define the desired state, not the steps to reach it
- **Terraform** — industry-standard Infrastructure-as-Code engine
- **Schema validation** — catch misconfigurations before they ever reach a device
- **Post-deployment testing** — verify what was deployed actually matches what you asked for
- **GitLab CI/CD pipelines** — automate validation, deployment, and testing end-to-end

!!! note "Terminology"
    *Network-as-Code IOS XE*, *NAC IOS XE*, and *IOS XE-as-Code* are used interchangeably in this guide — all refer to the same automation solution.

## Lab scope

This lab uses virtualized IOS XE devices in Cisco Modeling Labs (CML) and a GitLab instance running in the lab environment. It is designed for learning; the configurations shown are **not intended for production use as-is**. Production deployments require additional considerations around state storage, secret management, access control, and approval workflows — most of which we note in context but do not implement here.

## What you'll learn

By completing this lab, you will gain hands-on experience with:

- Writing desired network state configurations in NAC YAML format for IOS-XE devices
- Deploying the desired state using the Terraform implementation of NAC
- Validating and testing configurations
- Automating the network deployment lifecycle using GitLab CI/CD pipelines
- Applying best practices for network automation

**About This Guide**

Created by Asier Arlegui and Balu Novak-Bohak.

---

**Next:** [Lab Content](Intro02_all_learners.md)
