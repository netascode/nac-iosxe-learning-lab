# Conclusion

Congratulations on completing the **Network-as-Code for IOS XE** lab! 🎉

## What You've Accomplished

Throughout this lab, you've gained hands-on experience with modern network automation practices:

### Core Skills

- ✅ **YAML Configuration** - Wrote declarative network configurations in human-readable YAML format
- ✅ **Terraform Workflows** - Used `terraform init`, `plan`, `apply`, and `destroy` to manage network infrastructure
- ✅ **Configuration Hierarchy** - Applied settings at global, device group, and device levels
- ✅ **Schema Validation** - Validated configurations before deployment using `nac-validate`
- ✅ **CI/CD Automation** - Ran automated pipelines in GitLab to validate, plan, and deploy changes

### Configuration Types Deployed

- **Global Configuration** - Login banners applied to all devices
- **Device Group Configuration** - ACLs applied to specific device roles
- **Single Device Configuration** - Host entries for individual devices
- **Templates** - Reusable configurations for VLANs, BGP, and more

### Optional Skills (if completed)

- 📝 Template types: model, file, and CLI
- 🤖 Robot Framework post-change validation
- 🔀 GitLab merge request workflows
- ⚙️ Customizing CI/CD pipelines

## Key Takeaways

1. **Declarative over Imperative** - Define *what* you want, not *how* to get there
2. **Version Control Everything** - Track all changes with Git for audit trails and rollbacks
3. **Validate Before Deploy** - Catch errors early with schema validation
4. **Automate the Workflow** - CI/CD pipelines ensure consistency and reduce human error
5. **Test After Deploy** - Robot Framework validates that configurations were applied correctly

## Continue Your Journey

### Resources

- [NetAsCode Documentation](https://netascode.cisco.com)
- [Network-as-Code for IOS XE](https://github.com/netascode/terraform-iosxe-nac-iosxe) - Try this at home with the official Terraform module!

## Thank You!

Thank you for participating in this lab. We hope you've gained valuable skills that you can apply to automate your own network infrastructure.

**Questions or feedback?** Reach out to the lab authors:

- Asier Arlegui
- Balu Novak-Bohak
