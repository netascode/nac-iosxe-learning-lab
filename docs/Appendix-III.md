# Appendix III — `nac-test` reference

[Task 11](Task11_Post-checks.md) uses `nac-test` to render and execute Robot Framework tests from your intent YAML. The lab WSL image ships the full test scaffolding at `~/tests/`; Task 11's Step 1 copies it into your project with `cp -r ~/tests ~/nac-iosxe/`.

This appendix shows the **rendered** Robot test you'll end up with — the file that `nac-test` produces after expanding the Jinja2 template with your merged model data. It's the file you open in `TestResults/config/access_lists.robot` after running `nac-test` in Task 11.

For the full template sources (`access_lists.robot`, `iosxe_common.resource`, `UtilsLib.py`, `url_encode.py`), read them directly from `~/tests/` in the WSL image, or browse them online in the Cisco-maintained [nac-test-pyats-common](https://github.com/netascode/nac-test-pyats-common) repository.

{% raw %}

## Rendered `access_lists.robot`

Below is what you get after `nac-test` renders the Jinja2 template against your intent YAML. Notice how the two entries from your `AccessLayerACL` (sequence 10 and 20) become explicit XPath assertions, one per device in the `ACCESS_SWITCHES` group:

```robot
*** Settings ***
Documentation   Verify Access Lists Configuration
Suite Setup     Run Only Once   Get Configs
Resource        ../iosxe_common.resource
Default Tags    config   iosxe   access_lists

*** Test Cases ***

Get Config access01
    ${config}=   Get Parallel Value For Key   access01_config
    Set Suite Variable   ${config}

Verify Standard Access List AccessLayerACL Device access01
    ${acl}=   Set Variable   data/native/ip/access-list/standard[name='AccessLayerACL']
    Should Be Equal Value Xml String   ${config}   ${acl}/name   AccessLayerACL
    ${entry}=   Set Variable   ${acl}/access-list-seq-rule[sequence='10']
    Should Be Equal Value Xml String   ${config}   ${entry}/remark
    Should Be Equal Value Xml String   ${config}   ${entry}/permit/std-ace/ipv4-address-prefix   10.0.0.0
    Should Be Equal Value Xml String   ${config}   ${entry}/permit/std-ace/mask   0.0.0.255
    Should Be Equal Value Xml Bool   ${config}   ${entry}/permit/std-ace/any
    Should Be Equal Value Xml String   ${config}   ${entry}/permit/std-ace/host-address
    Should Be Equal Value Xml Bool   ${config}   ${entry}/permit/std-ace/log
    ${entry}=   Set Variable   ${acl}/access-list-seq-rule[sequence='20']
    Should Be Equal Value Xml String   ${config}   ${entry}/remark
    Should Be Equal Value Xml String   ${config}   ${entry}/permit/std-ace/ipv4-address-prefix   20.0.0.0
    Should Be Equal Value Xml String   ${config}   ${entry}/permit/std-ace/mask   0.0.0.255
    Should Be Equal Value Xml Bool   ${config}   ${entry}/permit/std-ace/any
    Should Be Equal Value Xml String   ${config}   ${entry}/permit/std-ace/host-address
    Should Be Equal Value Xml Bool   ${config}   ${entry}/permit/std-ace/log

Get Config access02
    ${config}=   Get Parallel Value For Key   access02_config
    Set Suite Variable   ${config}

Verify Standard Access List AccessLayerACL Device access02
    ${acl}=   Set Variable   data/native/ip/access-list/standard[name='AccessLayerACL']
    Should Be Equal Value Xml String   ${config}   ${acl}/name   AccessLayerACL
    ${entry}=   Set Variable   ${acl}/access-list-seq-rule[sequence='10']
    Should Be Equal Value Xml String   ${config}   ${entry}/remark
    Should Be Equal Value Xml String   ${config}   ${entry}/permit/std-ace/ipv4-address-prefix   10.0.0.0
    Should Be Equal Value Xml String   ${config}   ${entry}/permit/std-ace/mask   0.0.0.255
    Should Be Equal Value Xml Bool   ${config}   ${entry}/permit/std-ace/any
    Should Be Equal Value Xml String   ${config}   ${entry}/permit/std-ace/host-address
    Should Be Equal Value Xml Bool   ${config}   ${entry}/permit/std-ace/log
    ${entry}=   Set Variable   ${acl}/access-list-seq-rule[sequence='20']
    Should Be Equal Value Xml String   ${config}   ${entry}/remark
    Should Be Equal Value Xml String   ${config}   ${entry}/permit/std-ace/ipv4-address-prefix   20.0.0.0
    Should Be Equal Value Xml String   ${config}   ${entry}/permit/std-ace/mask   0.0.0.255
    Should Be Equal Value Xml Bool   ${config}   ${entry}/permit/std-ace/any
    Should Be Equal Value Xml String   ${config}   ${entry}/permit/std-ace/host-address
    Should Be Equal Value Xml Bool   ${config}   ${entry}/permit/std-ace/log
```

Assertions where the expected value is blank (e.g. `remark`, `host-address`) are no-ops — the keyword returns immediately when the value is empty. They appear because the Jinja2 template renders every possible field; only the fields you defined in YAML actually perform a check.

## How `nac-test` wires the pieces together

1. **Jinja2 template** — `tests/templates/config/access_lists.robot` is a Jinja2 template that iterates over every device's `access_lists.standard[]` in the merged model.
2. **Filters** — `tests/filters/url_encode.py` provides the `url_encode` filter (e.g. to encode ACL names with special characters in XPath queries).
3. **Resource file** — `tests/templates/iosxe_common.resource` defines reusable Robot keywords shared across all test suites.
4. **Python library** — `tests/templates/lib/UtilsLib.py` uses `scrapli_netconf` to fetch the running config via NETCONF (`Get Configs` keyword) and exposes XML assertion keywords like `Should Be Equal Value Xml String` and `Should Be Equal Value Xml Bool`.
5. **Pabot** — `nac-test` invokes the rendered Robot suites in parallel via Pabot, so all four devices run concurrently.

## Extending the pattern

Most of the Cisco-maintained `nac-test` template set (interfaces, routing protocols, VLANs, etc.) lives in the same style as the snippet above. To add your own test:

1. Create a new `.robot` Jinja2 template under `tests/templates/config/`.
2. Walk `iosxe.devices[]` → `device.configuration.<your feature>` to pull fields from the merged model.
3. Emit one `*** Test Cases ***` block per device/resource.
4. Re-run `nac-test` — the new suite is rendered and executed automatically.

The Jinja2 context `nac-test` exposes is the full merged data model (the same `model.yaml` you inspected in earlier tasks) plus a `defaults` variable containing the NaC module's default values. Anything you can put in YAML, you can assert against from a template.

{% endraw %}
