# Appendix III — `nac-test` reference

[Task 11](Task11_Post-checks.md) uses `nac-test` to render and execute Robot Framework tests from your intent YAML. The lab WSL image ships the full test scaffolding at `~/tests/`; Task 11's Step 1 copies it into your project with `cp -r ~/tests ~/nac-iosxe/`.

This appendix shows the **rendered** Robot test you'll end up with — the file that `nac-test` produces after expanding the Jinja2 template with your merged model data. It's the file you open in `TestResults/config/access_lists.robot` after running `nac-test` in Task 11.

For the full template sources (`access_lists.robot`, `iosxe_common.resource`, `UtilsLib.py`, `url_encode.py`), read them directly from `~/tests/` in the WSL image, or browse them online in the Cisco-maintained [nac-test-pyats-common](https://github.com/netascode/nac-test-pyats-common) repository.

{% raw %}

## Rendered `access_lists.robot`

Below is what you get after `nac-test` renders the Jinja2 template against your intent YAML. Notice how the two entries from your `AccessLayerACL` (sequence 10 and 20) become explicit assertions, one per device in the `ACCESS_SWITCHES` group:

```robot
*** Settings ***
Documentation   Verify Access Lists Configuration
Suite Setup     Login IOSXE
Resource        ../iosxe_common.resource
Default Tags    config   iosxe   access_lists

*** Test Cases ***

Verify Standard Access List AccessLayerACL Device access01
    ${r}=   GET On Session   IOSXE_access01   url=/data/Cisco-IOS-XE-native:native/ip/access-list/Cisco-IOS-XE-acl:standard=AccessLayerACL   expected_status=200
    Log   Response Status Code: ${r.status_code}
    Should Be Equal Value Json String   ${r.json()}   $..name   AccessLayerACL
    ${entry}=   Set Variable   $..access-list-seq-rule[?(@.sequence=='10')]
    Should Be Equal Value Json String   ${r.json()}   ${entry}..permit.std-ace.ipv4-address-prefix   10.0.0.0
    Should Be Equal Value Json String   ${r.json()}   ${entry}..permit.std-ace.mask   0.0.0.255
    ${entry}=   Set Variable   $..access-list-seq-rule[?(@.sequence=='20')]
    Should Be Equal Value Json String   ${r.json()}   ${entry}..permit.std-ace.ipv4-address-prefix   20.0.0.0
    Should Be Equal Value Json String   ${r.json()}   ${entry}..permit.std-ace.mask   0.0.0.255

Verify Standard Access List AccessLayerACL Device access02
    ${r}=   GET On Session   IOSXE_access02   url=/data/Cisco-IOS-XE-native:native/ip/access-list/Cisco-IOS-XE-acl:standard=AccessLayerACL   expected_status=200
    Log   Response Status Code: ${r.status_code}
    Should Be Equal Value Json String   ${r.json()}   $..name   AccessLayerACL
    ${entry}=   Set Variable   $..access-list-seq-rule[?(@.sequence=='10')]
    Should Be Equal Value Json String   ${r.json()}   ${entry}..permit.std-ace.ipv4-address-prefix   10.0.0.0
    Should Be Equal Value Json String   ${r.json()}   ${entry}..permit.std-ace.mask   0.0.0.255
    ${entry}=   Set Variable   $..access-list-seq-rule[?(@.sequence=='20')]
    Should Be Equal Value Json String   ${r.json()}   ${entry}..permit.std-ace.ipv4-address-prefix   20.0.0.0
    Should Be Equal Value Json String   ${r.json()}   ${entry}..permit.std-ace.mask   0.0.0.255
```

## How `nac-test` wires the pieces together

1. **Jinja2 template** — `tests/templates/config/access_lists.robot` is a Jinja2 template that iterates over every device's `access_lists.standard[]` in the merged model.
2. **Filters** — `tests/filters/url_encode.py` provides the `url_encode` filter (e.g. to encode ACL names with special characters in the NETCONF query).
3. **Resource file** — `tests/templates/iosxe_common.resource` defines reusable Robot keywords like `Login IOSXE`, shared across all test suites.
4. **Python library** — `tests/templates/lib/UtilsLib.py` exposes the `Should Be Equal Value Json String` and `Should Be Equal Value Json Bool` keywords used above.
5. **Pabot** — `nac-test` invokes the rendered Robot suites in parallel via Pabot, so all four devices run concurrently.

## Extending the pattern

Most of the Cisco-maintained `nac-test` template set (interfaces, routing protocols, VLANs, etc.) lives in the same style as the snippet above. To add your own test:

1. Create a new `.robot` Jinja2 template under `tests/templates/config/`.
2. Walk `iosxe.devices[]` → `device.configuration.<your feature>` to pull fields from the merged model.
3. Emit one `*** Test Cases ***` block per device/resource.
4. Re-run `nac-test` — the new suite is rendered and executed automatically.

The Jinja2 context `nac-test` exposes is the full merged data model (the same `model.yaml` you inspected in earlier tasks) plus a `defaults` variable containing the NAC module's default values. Anything you can put in YAML, you can assert against from a template.

{% endraw %}
