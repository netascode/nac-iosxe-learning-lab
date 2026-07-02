# Glossary

Acronyms and terms used throughout this lab guide. Bookmark or keep this tab open - new terms appear across almost every task.

| Term | What it means |
|------|---------------|
| **NaC** | Network as Code - Cisco's Terraform-based declarative automation framework. This lab is one flavor of it (IOS XE); sibling labs cover SD-WAN, ACI, Catalyst Center, Nexus Dashboard, etc. |
| **IaC** | Infrastructure as Code - the broader category of "manage infrastructure by editing files, not clicking buttons". Network as Code is IaC for networking. |
| **YAML** | A human-readable data format (indentation-based). All your Network as Code "intent" files are YAML. |
| **YANG** | A standardized modelling language for network device configuration and state. IOS XE's configuration surface is described in YANG modules; Network as Code ultimately produces YANG data to push to devices. |
| **NETCONF** | A standards-based network management protocol (RFC 6241). Runs over SSH on TCP/830. Uses YANG models and a candidate/running datastore pair - this lab uses it for all configuration push. |
| **RESTCONF** | REST-style alternative to NETCONF (HTTPS-based). Not used in this lab but supported by the same Network as Code module and IOS XE provider. |
| **Terraform** | HashiCorp's declarative infrastructure engine. Reads `.tf` files + state, produces a plan, applies it. This lab uses Terraform as the orchestrator under Network as Code. |
| **HCL** | HashiCorp Configuration Language - the syntax `.tf` files are written in (braces, key = value). You'll write very little of this directly; the Network as Code module abstracts it. |
| **CML** | Cisco Modeling Labs - the virtualized network simulation platform that hosts the lab's IOS XE devices. |
| **BGP** | Border Gateway Protocol - used in Task 08's optional BGP-over-ISP example. |
| **ACL** | Access Control List - used in Task 04's device-group example. |
| **CI/CD** | Continuous Integration / Continuous Deployment - the automation that runs your code/config through build/test/deploy stages on every change. This lab uses GitLab CI. |
| **GitOps** | The practice of using Git as the source of truth for infrastructure state, with CI/CD as the delivery mechanism. Tasks 13-15 demonstrate it. |
| **MR / PR** | Merge Request (GitLab) / Pull Request (GitHub) - the code-review workflow for proposing a change to a branch. Task 15 uses MRs. |
| **WSL** | Windows Subsystem for Linux - the Linux environment running inside the lab's Win10 VM, where you'll run Terraform. |
| **Declarative vs imperative** | Declarative: describe *what* you want (e.g. "VLAN 10 exists with name DATA"). Imperative: describe *the steps* (`vlan 10`, `name DATA`). Network as Code is declarative - you describe state, the module figures out the steps. |
| **`candidate` / `running`** | NETCONF's two main datastores. You write to `candidate` (scratch), issue `<commit>` to atomically swap it into `running` (live config). See Task 01's NETCONF diagram. |
| **dCloud** | Cisco's demo / lab cloud environment - one of the common ways this lab is delivered (Cisco Live, TechAdvantage, customer workshops, internal enablement). |

---

For deeper conceptual explanations of any of these, see:

- [Intro 01 - Learning Objectives](Intro01_overview.md) - the "what and why" of Network as Code
- [Task 01 - SSH to devices](Task01_SSH_to_network_devices.md) - NETCONF, datastores, and the transactional model
- [Task 03 - Global configuration](Task03_Global_configuration.md) - Terraform's `init`/`plan`/`apply` workflow
- [Task 13 - Run a CI/CD pipeline](Task13_Run_CI-CD_pipeline.md) - CI/CD and GitOps in practice
