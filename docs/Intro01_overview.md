This step-by-step guide walks you through the **Network-as-Code for IOS XE** lab. By the end, you will know how to deploy and manage IOS XE devices with declarative infrastructure-as-code and CI/CD pipelines.

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
    *IOS XE as Code*, *Network-as-Code for IOS XE*, and *NAC IOS XE* are used interchangeably in this guide — all refer to the same automation solution.

## What the stack looks like

NAC isn't a single tool — it's a layered stack. You write intent in YAML; the stack turns that into actual configuration on the device:

<figure markdown>
  ![NAC stack overview](./assets/nac-stack.png){ width="100%" }
</figure>

You'll spend all your time in **layer 1** (the YAML). The rest of the stack — the Terraform module, the IOS XE provider, the NETCONF transport — is maintained by Cisco and the Network-as-Code open-source community.

## Lab scope

This lab uses virtualized IOS XE devices in Cisco Modeling Labs (CML) and a GitLab instance running in the lab environment. It is designed for learning; the configurations shown are **not intended for production use as-is**. Production deployments require additional considerations around state storage, secret management, access control, and approval workflows — most of which we note in context but do not implement here.

## What you'll learn

By completing this lab, you will gain hands-on experience with:

- Writing declarative IOS XE configurations in NAC YAML format
- Deploying configurations using the NAC Terraform module
- Understanding the NAC configuration hierarchy: **global → group → device**
- Using variables and templates for reusable, scalable configurations
- Pre-deployment validation with `nac-validate` (schema and semantic checks)
- Post-deployment validation with `nac-test` (automated Robot Framework tests)
- Automating the full Infrastructure-as-Code lifecycle with GitLab CI/CD pipelines
- Implementing GitOps workflow safeguards (branch protection, merge requests)

## About this guide

Authored by Andrea Testino and Christopher Hart, building on the original Amsterdam delivery by Asier Arlegui and Balu Novak-Bohak.

---

**Next:** [Lab Content](Intro02_all_learners.md)
