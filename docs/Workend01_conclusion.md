# Conclusion

You've reached the end of the **Network-as-Code for IOS XE** lab — well done.

## What you've accomplished

**Core skills**

- **YAML configuration** — wrote declarative network configurations in human-readable YAML
- **Terraform workflow** — used `terraform init`, `plan`, `apply`, and `destroy` end-to-end
- **Configuration hierarchy** — applied settings at global, device-group, and device levels with proper precedence
- **Schema validation** — caught errors pre-deployment with `nac-validate`
- **CI/CD automation** — ran GitLab pipelines to validate, plan, and deploy changes

**Configuration patterns practiced**

- **Global** — login banners, system hostnames applied everywhere
- **Device group** — ACLs applied to access switches only
- **Device-specific** — per-device settings (loopbacks, BGP, host-specific ACLs)
- **Variables** — reusable values across the hierarchy

**Optional skills (if you reached them)**

- Template types: `model`, `file`, and `cli`
- Post-change validation with `nac-test` and Robot Framework
- Pipeline extensions: integration tests + idempotency checks
- GitOps guardrails: branch protection and merge-request workflows

## Key takeaways

1. **Declarative over imperative** — define *what* you want; let the module figure out *how*.
2. **Version-control everything** — every change has an author, a reviewer, and a rollback path.
3. **Automate the workflow** — pipelines enforce consistency and make failure visible.
4. **Validate before deploy** — `nac-validate` catches syntax and schema errors before they reach a device.
5. **Test after deploy** — `nac-test` confirms intent actually landed on the wire.

## Try at home

A few small extensions make great follow-ups once you're back at your own environment:

- **Default gateway for host networks** — extend `config-device-border.nac.yaml` to add a `GigabitEthernet3` interface with IP `192.168.100.1/24` so the host networks can route to the ISP. Validate by pinging `8.8.8.8` from `host01`/`host02` via the CML console. (This is also the "Advanced Challenge" in Task 08 if you finished early during the session.)
- **More variables, more precedence** — introduce a `${SITE_ID}` or `${MGMT_VLAN}` variable at the global level and override it on one device to see precedence in action.
- **Your own validation rules** — `nac-validate` is extensible. Write a rule that enforces a naming convention or flags a forbidden configuration (for example, any ACL entry with `action: permit` on `any`).

## Continue your journey

**Resources**

- [Network-as-Code documentation](https://netascode.cisco.com)
- [`terraform-iosxe-nac-iosxe`](https://github.com/netascode/terraform-iosxe-nac-iosxe) — the module used in this lab (Apache 2.0, publicly available)
- [`terraform-provider-iosxe`](https://github.com/CiscoDevNet/terraform-provider-iosxe) — the provider underneath
- [NetAsCode on GitHub](https://github.com/netascode) — all the modules, tools, and data models

**Related Cisco Live sessions**

- **BRKXAR-2032** — NetDevOps testing fundamentals with Generative AI
- **LTRDCN-3439** — Nexus Dashboard VXLAN as Code
- **LTRATO-2223** — FastForward SD-WAN deployment with SDWAN as Code
- **LTRENS-3751** — SD-Access as Code with Catalyst Center and ISE
- **BRKENT-2115** — Automate Catalyst SD-WAN with Network as Code

## Thank you

Thanks for spending four hours with us. If you have questions or feedback after the session, please reach out:

- **Andrea Testino** — atestini@cisco.com — [LinkedIn](https://www.linkedin.com/in/aitestino/)
- **Christopher Hart** — chart2@cisco.com — [LinkedIn](https://www.linkedin.com/in/christopherjhart95/)

Original lab design by Asier Arlegui and Balu Novak-Bohak — thank you for laying the foundation.
