# Conclusion

You've reached the end of the **Network as Code for IOS XE** lab - well done.

## What you've accomplished

**Core skills**

- **YAML configuration** - wrote declarative network configurations in human-readable YAML
- **Terraform workflow** - used `terraform init`, `plan`, `apply`, and `destroy` end-to-end
- **Configuration hierarchy** - applied settings at global, device-group, and device levels with proper precedence
- **Schema validation** - caught errors pre-deployment with `nac-validate`
- **CI/CD automation** - ran GitLab pipelines to validate, plan, and deploy changes

**Configuration patterns practiced**

- **Global** - login banners, system hostnames applied everywhere
- **Device group** - ACLs applied to access switches only
- **Device-specific** - per-device settings (loopbacks, BGP, host-specific ACLs)
- **Variables** - reusable values across the hierarchy

**Optional skills (if you reached them)**

- Template types: `model`, `file`, and `cli`
- Post-change validation with `nac-test` and Robot Framework
- Pipeline extensions: integration tests + idempotency checks
- GitOps guardrails: branch protection and merge-request workflows

## Key takeaways

1. **Declarative over imperative** - define *what* you want; let the module figure out *how*.
2. **Version-control everything** - every change has an author, a reviewer, and a rollback path.
3. **Automate the workflow** - pipelines enforce consistency and make failure visible.
4. **Validate before deploy** - `nac-validate` catches syntax and schema errors before they reach a device.
5. **Test after deploy** - `nac-test` confirms intent actually landed on the wire.

## How this scales from four devices to a hundred (or a thousand)

The patterns you just used were chosen because they scale. A fleet of
100 branches doesn't change the workflow; it just changes the input:

- **The YAML shape is identical.** One `devices/*.nac.yaml` per device
  regardless of fleet size. Adding branch 101 is creating one file, not
  restructuring anything. Shared configuration (a new NTP server, a
  security policy update) still lives in exactly one file (`global/` or
  a `groups/` file) and propagates via the same merge precedence.
- **Exceptions stay local.** If branch 47 needs a one-off setting that
  differs from every other branch, it goes in `devices/branch-47.nac.yaml`
  and overrides the global default for that one device. Nothing else in
  the project moves. The merge model is what makes "the exception that
  proves the rule" a one-file change instead of a refactor.
- **Blast radius is controllable.** `managed_devices = ["branch-47"]`
  (Task 12) or the equivalent `IOSXE_SELECTED_DEVICES` env var scopes a
  `terraform apply` to a named subset. Combined with CI pipelines
  gating on code review (Task 15), you can stage rollouts - apply to
  three canary branches first, observe, then expand. The 4-device lab
  version of this is running `terraform apply` against all 4; the
  100-device production version is the same command with a subset filter.
- **State is the authoritative record.** One `terraform.tfstate` (or
  one pipeline-managed state backend, for a team) captures what each of
  the 100 devices currently has. Drift detection, audit trails, and
  "what did we actually change last Tuesday" answers all come from that
  state plus git history.

What you wrote for 4 devices is the same YAML you'd write for 400. The
module, the merge semantics, the CI pipeline shape, and the verification
loop stay identical; the `data/devices/` directory just gets bigger.

## Try at home

A few small extensions make great follow-ups once you're back at your own environment:

- **Default gateway for host networks** - extend `devices/border.nac.yaml` to add a `GigabitEthernet3` interface with IP `192.168.100.1/24` so the host networks can route to the ISP. Validate by pinging `8.8.8.8` from `host01`/`host02` via the CML console. (This is also the "Advanced Challenge" in Task 08 if you finished early during the session.)
- **More variables, more precedence** - introduce a `${DNS_DOMAIN}` or `${MGMT_VLAN}` variable at the global level and override it on one device to see precedence in action.
- **Your own validation rules** - `nac-validate` is extensible. Write a rule that enforces a naming convention or flags a forbidden configuration (for example, any ACL entry with `action: permit` on `any`).
- **Verify via data sources, not SSH** - the `terraform-provider-iosxe` ships [~120 data sources](https://registry.terraform.io/providers/CiscoDevNet/iosxe/latest/docs) that read operational state. Instead of SSHing in and running `show ip bgp summary`, define a `data "iosxe_bgp_neighbor"` resource and assert the state in a Terraform `check` or `output`. Same answer, fully programmatic - useful for letting another part of your IaC codebase condition on device state.
- **Brownfield import with `nac-tool`** - point [`nac-tool`](https://netascode.cisco.com/docs/tools/nac-tool/overview/) at one of your existing IOS XE devices at home and let it generate the equivalent NaC YAML. This is the fastest way to see how much of your current running-config maps cleanly to NaC's data model (and where you'd need to fall back to `cli` templates).

## Continue your journey

**Core documentation and code**

- [Network as Code documentation](https://netascode.cisco.com) - the authoritative docs site; start with *Guides → Concepts* if you want to go deeper on merge semantics, defaults precedence, and variable scope resolution
- [`terraform-iosxe-nac-iosxe`](https://github.com/netascode/terraform-iosxe-nac-iosxe) - the module used in this lab (Apache 2.0). File issues via its [GitHub Issues](https://github.com/netascode/terraform-iosxe-nac-iosxe/issues) page.
- [`terraform-provider-iosxe`](https://github.com/CiscoDevNet/terraform-provider-iosxe) - the IOS XE Terraform provider. Full resource and data-source reference at [registry.terraform.io/providers/CiscoDevNet/iosxe](https://registry.terraform.io/providers/CiscoDevNet/iosxe/latest/docs).
- [NetAsCode on GitHub](https://github.com/netascode) - the full org: modules, tools, and data models for every supported Cisco platform (IOS XE, SD-WAN, ACI, Catalyst Center, Nexus Dashboard, Meraki, etc.)

**Sibling tools worth knowing about**

This lab uses `nac-validate` (Task 10) and `nac-test` (Task 11). The NaC toolchain ships a few more:

- [**`nac-tool`**](https://netascode.cisco.com/docs/tools/nac-tool/overview/) - **brownfield import.** Point it at a running device and it writes out the equivalent NaC YAML. This is the bridge between "existing network" and "Network as Code adoption" - no need to start from scratch.
- [**`nac-api`**](https://netascode.cisco.com/docs/tools/nac-api/overview/) - REST API over NaC configs. Useful for custom integrations.
- [**`nac-collector`**](https://netascode.cisco.com/docs/tools/nac-collector/overview/) - gather deployed configs from the field into a central store.

**Related Cisco Live sessions**

- **BRKXAR-2032** - NetDevOps testing fundamentals with Generative AI
- **LTRDCN-3439** - Nexus Dashboard VXLAN as Code
- **LTRATO-2223** - FastForward SD-WAN deployment with SDWAN as Code
- **LTRENS-3751** - SD-Access as Code with Catalyst Center and ISE
- **BRKENT-2115** - Automate Catalyst SD-WAN with Network as Code

## Share your feedback

Your feedback drives next year's version of this lab. Two ways to
contribute:

- **Cisco Live session survey** - rate LTRXAR-2008 in the Cisco Live
  app or portal. These ratings directly influence whether the session
  runs again, and at which events.
- **Direct feedback** - if you hit something confusing, broken, or
  wished-for-but-missing, email either presenter (below). Specific >
  general; "the Task 08 BGP verification was unclear because X" is
  10x more useful than "Task 08 was confusing."

## Thank you

Thanks for spending four hours with us. If you have questions or feedback after the session, please reach out:

- **Andrea Testino** - atestini@cisco.com - [LinkedIn](https://www.linkedin.com/in/aitestino/)
- **Christopher Hart** - chart2@cisco.com - [LinkedIn](https://www.linkedin.com/in/christopherjhart95/)

---

**← Previous:** [Task 15 - Merge request workflow](Task15_Branch_and_merge_request.md)
