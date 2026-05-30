# LTRXAR-2008 — Accelerate Your Network Operations

**A 4-hour, hands-on IOS XE automation workshop from Cisco Live US 2026.**
Deploy, validate, and automate Cisco IOS XE device configuration using Network as Code (NaC), Terraform, and GitLab CI/CD — no raw HCL required.

- **Lab guide (web):** https://cl-ltr.ciscolabs.com/4eb6f2de2e/
- **Lab guide (PDF):** https://cl-ltr.ciscolabs.com/4eb6f2de2e/pdf/document.pdf
- **Session ID:** LTRXAR-2008 · Cisco Live US 2026, San Diego

---

## What this lab covers

This workshop teaches you how to manage IOS XE devices declaratively — describe the desired network state in YAML and let the automation stack figure out how to get there. You will:

- Write **declarative IOS XE configurations** in Network as Code YAML format
- Apply the **three-tier configuration hierarchy**: global → device group → device
- Deploy configurations to live IOS XE devices using the **Network as Code Terraform module**
- Use **variables and templates** (`model`, `file`, `cli`) for reusable, scalable intent files
- Run **pre-deployment schema validation** with `nac-validate` to catch errors before they hit a device
- Run **post-deployment automated tests** with `nac-test` and Robot Framework to verify what actually landed
- Build and trigger a **GitLab CI/CD pipeline** that runs validate → plan → deploy → test automatically
- Implement a **GitOps merge-request workflow** with branch protection and plan-as-comment review

## What this lab does NOT cover

Protocol internals (NETCONF/RESTCONF), raw Terraform HCL authoring, custom provider or module development, network design, or production-grade secret/state management.

---

## Technology stack

| Layer | Technology |
|-------|-----------|
| Configuration language | YAML (Network as Code data model) |
| Infrastructure engine | [Terraform](https://www.terraform.io/) |
| IOS XE Terraform module | [`terraform-iosxe-nac-iosxe`](https://github.com/netascode/terraform-iosxe-nac-iosxe) |
| IOS XE Terraform provider | [`terraform-provider-iosxe`](https://github.com/CiscoDevNet/terraform-provider-iosxe) |
| Device transport | NETCONF (RFC 6241) over SSH |
| Schema validation | [`nac-validate`](https://netascode.cisco.com/docs/tools/nac-validate/overview/) |
| Post-deployment testing | [`nac-test`](https://netascode.cisco.com/docs/tools/nac-test/overview/) + Robot Framework + Pabot |
| CI/CD platform | GitLab CI/CD |
| Lab infrastructure | Cisco Modeling Labs (CML) — Catalyst 9000v / Catalyst 8000v |
| Lab workstation | Windows 10 VM (VS Code, WSL Ubuntu, Solar-PuTTY) |

---

## Lab tasks at a glance

### Recommended path (~3 hours)

| # | Task | Concept |
|---|------|---------|
| 01 | SSH to network devices | Verify connectivity, understand NETCONF |
| 02 | Edit YAML files with VS Code | Project structure, intent files |
| 03 | Global configuration | Banner on all devices — the top of the hierarchy |
| 04 | Device group configuration | ACL on access switches only |
| 05 | Single device configuration | Loopback0 on core only |
| 06 | Variables | Dynamic hostname substitution |
| 10 | Schema validation (`nac-validate`) | Catch misconfigurations pre-deploy |
| 12 | Cleanup (`terraform destroy`) | State separation before CI/CD |
| 13 | Run a CI/CD pipeline | GitLab validate → plan → deploy → notify |

### Optional tasks (time permitting)

| # | Task | Concept |
|---|------|---------|
| 07 | Templates type `model` | VLANs via reusable YAML templates |
| 08 | Templates type `file` | BGP via Jinja2 `.tftpl` with loops |
| 09 | Templates type `cli` | Raw CLI injection for unsupported features |
| 11 | Post-checks with `nac-test` | Robot Framework tests rendered from intent YAML |
| 14 | Extend CI/CD pipeline | Add integration + idempotency test stages |
| 15 | Merge request workflow | Branch protection, plan-as-comment, GitOps |

---

## Who this is for

Engineers and architects who want to adopt **Infrastructure as Code for network operations** — whether you are new to Terraform and YAML or already use CI/CD pipelines daily. The lab is designed to be accessible to all experience levels, with step-by-step instructions, verification commands, and troubleshooting callouts throughout.

---

## Network as Code overview

[Network as Code (NaC)](https://netascode.cisco.com) is Cisco's open-source Terraform-based automation framework. You express intended device state in human-readable YAML; the NaC Terraform module translates that intent into YANG-modeled configuration and pushes it over NETCONF. The same methodology covers IOS XE, NX-OS, IOS XR, ACI, Catalyst SD-WAN, Meraki, Catalyst Center, and ISE — this lab focuses on IOS XE.

The key abstraction: you never write `resource` blocks or wire Terraform dependencies. You write YAML that looks like the device's intended state, and the module handles the rest.

---

## Presenters

- **Andrea Testino** — Principal Software Engineer, CCIE #56739 · [LinkedIn](https://www.linkedin.com/in/aitestino/) · atestini@cisco.com
- **Christopher Hart** — Sr. Software Consulting Engineering Technical Leader · [LinkedIn](https://www.linkedin.com/in/christopherjhart95/) · chart2@cisco.com

Original lab design by Asier Arlegui ([LinkedIn](https://www.linkedin.com/in/arlegui/)) and Balu Novak-Bohak — Cisco Live Amsterdam 2025.

---

## Related Cisco Live sessions

- **BRKXAR-2032** — NetDevOps testing fundamentals with Generative AI
- **LTRDCN-3439** — Nexus Dashboard VXLAN as Code
- **LTRATO-2223** — FastForward SD-WAN deployment with SDWAN as Code
- **LTRENS-3751** — SD-Access as Code with Catalyst Center and ISE
- **BRKENT-2115** — Automate Catalyst SD-WAN with Network as Code

---

## Further reading

- [Network as Code documentation](https://netascode.cisco.com)
- [`terraform-iosxe-nac-iosxe` module](https://github.com/netascode/terraform-iosxe-nac-iosxe)
- [`terraform-provider-iosxe` registry](https://registry.terraform.io/providers/CiscoDevNet/iosxe/latest/docs)
- [NetAsCode GitHub org](https://github.com/netascode)
