**ROBOT Testing Files**

This appendix contains the Robot Framework test files and custom Jinja2 filters required for post-change validation in Task10.

---

## Custom Jinja2 Filters

The Robot templates use custom Jinja2 filters. Create the filters directory and file before running `nac-test`.

----------------------
**File 'tests/filters/url_encode.py'**
----------------------

```python
# Copyright: (c) 2025, Daniel Schmidt <danischm@cisco.com>
from urllib.parse import quote_plus


class Filter:
    name = "url_encode"

    @classmethod
    def filter(cls, text):
        """url encodes a string with characters in order to make them safe for restconf

        Example: converts "/" to "%2F" to make them not break the restconf uri.

        Args:
            text: The string to url encode. If not a string, returns unchanged.

        Returns:
            str: The url encoded string.
        """
        try:
            return quote_plus(str(text))
        except AttributeError:
            return text
```

---

## Robot Test Templates

----------------------
**File 'access_lists.robot'**
----------------------
```
*** Settings ***
Documentation   Verify Access Lists Configuration
Suite Setup     Login IOSXE
Resource        ../iosxe_common.resource
Default Tags    config   iosxe   access_lists

*** Test Cases ***

{% for device in iosxe.devices | default([]) %}
{% if device.configuration.access_lists.standard is defined %}
{% for acl in device.configuration.access_lists.standard | default([]) %}
Verify Standard Access List {{ acl.name }} Device {{ device.name }}
    ${r}=   GET On Session   IOSXE_{{ device.name }}   url=/restconf/data/Cisco-IOS-XE-native:native/ip/access-list/Cisco-IOS-XE-acl:standard={{ acl.name | url_encode }}   expected_status=200
    Log   Response Status Code: ${r.status_code}
    Should Be Equal Value Json String   ${r.json()}   $..name   {{ acl.name }}
{% for entry in acl.entries | default([]) %}
    ${entry}=   Set Variable   $..access-list-seq-rule[?(@.sequence=='{{ entry.sequence }}')]
    Should Be Equal Value Json String   ${r.json()}   ${entry}..remark   {{ entry.remark | default(defaults.iosxe.configuration.access_lists.standard.entries.remark) | default() }}
    Should Be Equal Value Json String   ${r.json()}   ${entry}..{{ entry.action | default(defaults.iosxe.configuration.access_lists.standard.entries.action)}}.std-ace.ipv4-address-prefix   {{ entry.prefix | default() }}
    Should Be Equal Value Json String   ${r.json()}   ${entry}..{{ entry.action | default(defaults.iosxe.configuration.access_lists.standard.entries.action)}}.std-ace.mask   {{ entry.prefix_mask | default() }}
    Should Be Equal Value Json Bool   ${r.json()}   ${entry}..{{ entry.action | default(defaults.iosxe.configuration.access_lists.standard.entries.action)}}.std-ace.any   {{ entry.any | default() }}
    Should Be Equal Value Json Bool   ${r.json()}   ${entry}..{{ entry.action | default(defaults.iosxe.configuration.access_lists.standard.entries.action)}}.std-ace.host   {{ entry.host | default() }}
    Should Be Equal Value Json Bool   ${r.json()}   ${entry}..{{ entry.action | default(defaults.iosxe.configuration.access_lists.standard.entries.action)}}.std-ace.log   {{ entry.log | default() }}
{% endfor %}
{% endfor %}
{% endif %}

{% if device.configuration.access_lists.extended is defined %}
{% for acl in device.configuration.access_lists.extended | default([]) %}
Verify Extended Access List {{ acl.name }} Device {{ device.name }}
    ${r}=   GET On Session   IOSXE_{{ device.name }}   url=/restconf/data/Cisco-IOS-XE-native:native/ip/access-list/Cisco-IOS-XE-acl:extended={{ acl.name | url_encode }}   expected_status=200
    Log   Response Status Code: ${r.status_code}
    Should Be Equal Value Json String   ${r.json()}   $..name   {{ acl.name }}
{% for entry in acl.entries | default([]) %}
    ${entry}=   Set Variable   $..access-list-seq-rule[?(@.sequence=='{{ entry.sequence }}')]
    Should Be Equal Value Json String   ${r.json()}   ${entry}..remark   {{ entry.remark | default(defaults.iosxe.configuration.access_lists.extended.entries.remark) | default() }}
    Should Be Equal Value Json String   ${r.json()}   ${entry}..ace-rule.action   {{ entry.action | default() }}
    Should Be Equal Value Json String   ${r.json()}   ${entry}..ace-rule.protocol   {{ entry.protocol | default() }}
    Should Be Equal Value Json String   ${r.json()}   ${entry}..ace-rule.object-group-str   {{ entry.service_object_group | default() }}
{% if entry.tcp_flags is defined and "ack" in entry.tcp_flags %}
    Should Be Equal Value Json Bool   ${r.json()}   ${entry}..ace-rule.ack   true
{% else %}
    Should Be Equal Value Json Bool   ${r.json()}   ${entry}..ace-rule.ack   {{ entry.ack | default() }}
{% endif %}
{% if entry.tcp_flags is defined and "fin" in entry.tcp_flags %}
    Should Be Equal Value Json Bool   ${r.json()}   ${entry}..ace-rule.fin   true
{% else %}
    Should Be Equal Value Json Bool   ${r.json()}   ${entry}..ace-rule.fin   {{ entry.fin | default() }}
{% endif %}
{% if entry.tcp_flags is defined and "psh" in entry.tcp_flags %}
    Should Be Equal Value Json Bool   ${r.json()}   ${entry}..ace-rule.psh   true
{% else %}
    Should Be Equal Value Json Bool   ${r.json()}   ${entry}..ace-rule.psh   {{ entry.psh | default() }}
{% endif %}
{% if entry.tcp_flags is defined and "rst" in entry.tcp_flags %}
    Should Be Equal Value Json Bool   ${r.json()}   ${entry}..ace-rule.rst   true
{% else %}
    Should Be Equal Value Json Bool   ${r.json()}   ${entry}..ace-rule.rst   {{ entry.rst | default() }}
{% endif %}
{% if entry.tcp_flags is defined and "syn" in entry.tcp_flags %}
    Should Be Equal Value Json Bool   ${r.json()}   ${entry}..ace-rule.syn   true
{% else %}
    Should Be Equal Value Json Bool   ${r.json()}   ${entry}..ace-rule.syn   {{ entry.syn | default() }}
{% endif %}
{% if entry.tcp_flags is defined and "urg" in entry.tcp_flags %}
    Should Be Equal Value Json Bool   ${r.json()}   ${entry}..ace-rule.urg   true
{% else %}
    Should Be Equal Value Json Bool   ${r.json()}   ${entry}..ace-rule.urg   {{ entry.urg | default() }}
{% endif %}
    Should Be Equal Value Json Bool   ${r.json()}   ${entry}..ace-rule.established   {{ entry.established | default() }}
    Should Be Equal Value Json String   ${r.json()}   ${entry}..ace-rule.dscp   {{ entry.dscp | default() }}
    Should Be Equal Value Json Bool   ${r.json()}   ${entry}..ace-rule.fragments   {{ entry.fragments | default() }}
    Should Be Equal Value Json String   ${r.json()}   ${entry}..ace-rule.precedence   {{ entry.precedence | default() }}
    Should Be Equal Value Json String   ${r.json()}   ${entry}..ace-rule.tos   {{ entry.tos | default() }}
{% if entry.icmp_message_type is defined %}
{% if entry.icmp_message_type is string %}
    Should Be Equal Value Json String   ${r.json()}   ${entry}..ace-rule.icmp-named-msg-type   {{ entry.icmp_message_type | default() }}
{% else %}
    Should Be Equal Value Json String   ${r.json()}   ${entry}..ace-rule.icmp-msg-type   {{ entry.icmp_message_type | default() }}
{% endif %}
{% endif %}
    Should Be Equal Value Json String   ${r.json()}   ${entry}..ace-rule.icmp-msg-code   {{ entry.icmp_message_code | default() }}
    Should Be Equal Value Json Bool   ${r.json()}   ${entry}..ace-rule.log   {{ entry.log | default() }}
    Should Be Equal Value Json Bool   ${r.json()}   ${entry}..ace-rule.log-input   {{ entry.log_input | default() }}
    Should Be Equal Value Json String   ${r.json()}   ${entry}..ace-rule.ipv4-address   {{ entry.source.prefix | default() }}
    Should Be Equal Value Json String   ${r.json()}   ${entry}..ace-rule.mask   {{ entry.source.prefix_mask | default() }}
    Should Be Equal Value Json Bool   ${r.json()}   ${entry}..ace-rule.any   {{ entry.source.any | default() }}
    Should Be Equal Value Json String   ${r.json()}   ${entry}..ace-rule.host-address   {{ entry.source.host | default() }}
    Should Be Equal Value Json String   ${r.json()}   ${entry}..ace-rule.object-group   {{ entry.source.object_group | default() }}
{% if entry.source.port_type | default() == "equal" %}
    Should Be Equal Value Json String   ${r.json()}   ${entry}..ace-rule.src-eq   {{ entry.source.port | default() }}
{% endif %}
{% if entry.source.port_type | default() == "greater_than" %}
    Should Be Equal Value Json String   ${r.json()}   ${entry}..ace-rule.src-gt   {{ entry.source.port | default() }}
{% endif %}
{% if entry.source.port_type | default() == "lesser_than" %}
    Should Be Equal Value Json String   ${r.json()}   ${entry}..ace-rule.src-lt   {{ entry.source.port | default() }}
{% endif %}
{% if entry.source.port_type | default() == "range" %}
    Should Be Equal Value Json String   ${r.json()}   ${entry}..ace-rule.src-range1   {{ entry.source.port_from | default() }}
    Should Be Equal Value Json String   ${r.json()}   ${entry}..ace-rule.src-range2   {{ entry.source.port_to | default() }}
{% endif %}
    Should Be Equal Value Json String   ${r.json()}   ${entry}..ace-rule.dest-ipv4-address   {{ entry.destination.prefix | default() }}
    Should Be Equal Value Json String   ${r.json()}   ${entry}..ace-rule.dest-mask   {{ entry.destination.prefix_mask | default() }}
    Should Be Equal Value Json Bool   ${r.json()}   ${entry}..ace-rule.dst-any   {{ entry.destination.any | default() }}
    Should Be Equal Value Json String   ${r.json()}   ${entry}..ace-rule.dst-host-address   {{ entry.destination.host | default() }}
    Should Be Equal Value Json String   ${r.json()}   ${entry}..ace-rule.dst-object-group   {{ entry.destination.object_group | default() }}
{% if entry.destination.port_type | default() == "equal" %}
    Should Be Equal Value Json String   ${r.json()}   ${entry}..ace-rule.dst-eq   {{ entry.destination.port | default() }}
{% endif %}
{% if entry.destination.additional_equal_ports is defined and entry.destination.additional_equal_ports|length > 0 %}
    Should Be Equal Value Json String   ${r.json()}   ${entry}..ace-rule.dst-eq2   {{ entry.destination.additional_equal_ports[0] | default() }}
{% endif %}
{% if entry.destination.additional_equal_ports is defined and entry.destination.additional_equal_ports|length > 1 %}
    Should Be Equal Value Json String   ${r.json()}   ${entry}..ace-rule.dst-eq3   {{ entry.destination.additional_equal_ports[1] | default() }}
{% endif %}
{% if entry.destination.additional_equal_ports is defined and entry.destination.additional_equal_ports|length > 2 %}
    Should Be Equal Value Json String   ${r.json()}   ${entry}..ace-rule.dst-eq4   {{ entry.destination.additional_equal_ports[2] | default() }}
{% endif %}
{% if entry.destination.additional_equal_ports is defined and entry.destination.additional_equal_ports|length > 3 %}
    Should Be Equal Value Json String   ${r.json()}   ${entry}..ace-rule.dst-eq5   {{ entry.destination.additional_equal_ports[3] | default() }}
{% endif %}
{% if entry.destination.additional_equal_ports is defined and entry.destination.additional_equal_ports|length > 4 %}
    Should Be Equal Value Json String   ${r.json()}   ${entry}..ace-rule.dst-eq6   {{ entry.destination.additional_equal_ports[4] | default() }}
{% endif %}
{% if entry.destination.additional_equal_ports is defined and entry.destination.additional_equal_ports|length > 5 %}
    Should Be Equal Value Json String   ${r.json()}   ${entry}..ace-rule.dst-eq7   {{ entry.destination.additional_equal_ports[5] | default() }}
{% endif %}
{% if entry.destination.additional_equal_ports is defined and entry.destination.additional_equal_ports|length > 6 %}
    Should Be Equal Value Json String   ${r.json()}   ${entry}..ace-rule.dst-eq8   {{ entry.destination.additional_equal_ports[6] | default() }}
{% endif %}
{% if entry.destination.additional_equal_ports is defined and entry.destination.additional_equal_ports|length > 7 %}
    Should Be Equal Value Json String   ${r.json()}   ${entry}..ace-rule.dst-eq9   {{ entry.destination.additional_equal_ports[7] | default() }}
{% endif %}
{% if entry.destination.additional_equal_ports is defined and entry.destination.additional_equal_ports|length > 8 %}
    Should Be Equal Value Json String   ${r.json()}   ${entry}..ace-rule.dst-eq10   {{ entry.destination.additional_equal_ports[8] | default() }}
{% endif %}
{% if entry.destination.port_type | default() == "greater_than" %}
    Should Be Equal Value Json String   ${r.json()}   ${entry}..ace-rule.dst-gt   {{ entry.destination.port | default() }}
{% endif %}
{% if entry.destination.port_type | default() == "lesser_than" %}
    Should Be Equal Value Json String   ${r.json()}   ${entry}..ace-rule.dst-lt   {{ entry.destination.port | default() }}
{% endif %}
{% if entry.destination.port_type | default() == "range" %}
    Should Be Equal Value Json String   ${r.json()}   ${entry}..ace-rule.dst-range1   {{ entry.destination.port_from | default() }}
    Should Be Equal Value Json String   ${r.json()}   ${entry}..ace-rule.dst-range2   {{ entry.destination.port_to | default() }}
{% endif %}
{% endfor %}
{% endfor %}
{% endif %}

{% if device.configuration.access_lists.role_based is defined %}
{% for acl in device.configuration.access_lists.role_based | default([]) %}
Verify Role-Based Access List {{ acl.name }} Device {{ device.name }}
    ${r}=   GET On Session   IOSXE_{{ device.name }}   url=/restconf/data/Cisco-IOS-XE-native:native/ip/access-list/Cisco-IOS-XE-acl:role-based={{ acl.name | url_encode }}   expected_status=200
    Log   Response Status Code: ${r.status_code}
    Should Be Equal Value Json String   ${r.json()}   $..name   {{ acl.name }}
{% for entry in acl.entries | default([]) %}
    ${entry}=   Set Variable   $..access-list-seq-rule[?(@.sequence=='{{ entry.sequence }}')]
    Should Be Equal Value Json String   ${r.json()}   ${entry}..remark   {{ entry.remark | default(defaults.iosxe.configuration.access_lists.role_based.entries.remark) | default() }}
    Should Be Equal Value Json String   ${r.json()}   ${entry}..ace-rule.action   {{ entry.action | default() }}
    Should Be Equal Value Json String   ${r.json()}   ${entry}..ace-rule.protocol   {{ entry.protocol | default() }}
{% if entry.tcp_flags is defined and "ack" in entry.tcp_flags %}
    Should Be Equal Value Json Bool   ${r.json()}   ${entry}..ace-rule.ack   true
{% else %}
    Should Be Equal Value Json Bool   ${r.json()}   ${entry}..ace-rule.ack   {{ entry.ack | default() }}
{% endif %}
{% if entry.tcp_flags is defined and "fin" in entry.tcp_flags %}
    Should Be Equal Value Json Bool   ${r.json()}   ${entry}..ace-rule.fin   true
{% else %}
    Should Be Equal Value Json Bool   ${r.json()}   ${entry}..ace-rule.fin   {{ entry.fin | default() }}
{% endif %}
{% if entry.tcp_flags is defined and "psh" in entry.tcp_flags %}
    Should Be Equal Value Json Bool   ${r.json()}   ${entry}..ace-rule.psh   true
{% else %}
    Should Be Equal Value Json Bool   ${r.json()}   ${entry}..ace-rule.psh   {{ entry.psh | default() }}
{% endif %}
{% if entry.tcp_flags is defined and "rst" in entry.tcp_flags %}
    Should Be Equal Value Json Bool   ${r.json()}   ${entry}..ace-rule.rst   true
{% else %}
    Should Be Equal Value Json Bool   ${r.json()}   ${entry}..ace-rule.rst   {{ entry.rst | default() }}
{% endif %}
{% if entry.tcp_flags is defined and "syn" in entry.tcp_flags %}
    Should Be Equal Value Json Bool   ${r.json()}   ${entry}..ace-rule.syn   true
{% else %}
    Should Be Equal Value Json Bool   ${r.json()}   ${entry}..ace-rule.syn   {{ entry.syn | default() }}
{% endif %}
{% if entry.tcp_flags is defined and "urg" in entry.tcp_flags %}
    Should Be Equal Value Json Bool   ${r.json()}   ${entry}..ace-rule.urg   true
{% else %}
    Should Be Equal Value Json Bool   ${r.json()}   ${entry}..ace-rule.urg   {{ entry.urg | default() }}
{% endif %}
    Should Be Equal Value Json Bool   ${r.json()}   ${entry}..ace-rule.established   {{ entry.established | default() }}
    Should Be Equal Value Json Bool   ${r.json()}   ${entry}..ace-rule.fragments   {{ entry.fragments | default() }}
    Should Be Equal Value Json String   ${r.json()}   ${entry}..ace-rule.dscp   {{ entry.dscp | default() }}
    Should Be Equal Value Json String   ${r.json()}   ${entry}..ace-rule.precedence   {{ entry.precedence | default() }}
    Should Be Equal Value Json String   ${r.json()}   ${entry}..ace-rule.tos   {{ entry.tos | default() }}
    Should Be Equal Value Json String   ${r.json()}   ${entry}..ace-rule.option   {{ entry.option | default() }}
    Should Be Equal Value Json String   ${r.json()}   ${entry}..ace-rule.time-range   {{ entry.time_range | default() }}
    Should Be Equal Value Json Bool   ${r.json()}   ${entry}..ace-rule.log   {{ entry.log | default() }}
    Should Be Equal Value Json Bool   ${r.json()}   ${entry}..ace-rule.log-input   {{ entry.log_input | default() }}
{% if entry.match_all is defined and "+ack" in entry.match_all %}
    Should Be Equal Value Json Bool   ${r.json()}   ${entry}..ace-rule.match-all.+ack   true
{% endif %}
{% if entry.match_all is defined and "+fin" in entry.match_all %}
    Should Be Equal Value Json Bool   ${r.json()}   ${entry}..ace-rule.match-all.+fin   true
{% endif %}
{% if entry.match_all is defined and "+psh" in entry.match_all %}
    Should Be Equal Value Json Bool   ${r.json()}   ${entry}..ace-rule.match-all.+psh   true
{% endif %}
{% if entry.match_all is defined and "+rst" in entry.match_all %}
    Should Be Equal Value Json Bool   ${r.json()}   ${entry}..ace-rule.match-all.+rst   true
{% endif %}
{% if entry.match_all is defined and "+syn" in entry.match_all %}
    Should Be Equal Value Json Bool   ${r.json()}   ${entry}..ace-rule.match-all.+syn   true
{% endif %}
{% if entry.match_all is defined and "+urg" in entry.match_all %}
    Should Be Equal Value Json Bool   ${r.json()}   ${entry}..ace-rule.match-all.+urg   true
{% endif %}
{% if entry.match_all is defined and "-ack" in entry.match_all %}
    Should Be Equal Value Json Bool   ${r.json()}   ${entry}..ace-rule.match-all.-ack   true
{% endif %}
{% if entry.match_all is defined and "-fin" in entry.match_all %}
    Should Be Equal Value Json Bool   ${r.json()}   ${entry}..ace-rule.match-all.-fin   true
{% endif %}
{% if entry.match_all is defined and "-psh" in entry.match_all %}
    Should Be Equal Value Json Bool   ${r.json()}   ${entry}..ace-rule.match-all.-psh   true
{% endif %}
{% if entry.match_all is defined and "-rst" in entry.match_all %}
    Should Be Equal Value Json Bool   ${r.json()}   ${entry}..ace-rule.match-all.-rst   true
{% endif %}
{% if entry.match_all is defined and "-syn" in entry.match_all %}
    Should Be Equal Value Json Bool   ${r.json()}   ${entry}..ace-rule.match-all.-syn   true
{% endif %}
{% if entry.match_all is defined and "-urg" in entry.match_all %}
    Should Be Equal Value Json Bool   ${r.json()}   ${entry}..ace-rule.match-all.-urg   true
{% endif %}
{% if entry.match_any is defined and "+ack" in entry.match_any %}
    Should Be Equal Value Json Bool   ${r.json()}   ${entry}..ace-rule.match-any.+ack   true
{% endif %}
{% if entry.match_any is defined and "+fin" in entry.match_any %}
    Should Be Equal Value Json Bool   ${r.json()}   ${entry}..ace-rule.match-any.+fin   true
{% endif %}
{% if entry.match_any is defined and "+psh" in entry.match_any %}
    Should Be Equal Value Json Bool   ${r.json()}   ${entry}..ace-rule.match-any.+psh   true
{% endif %}
{% if entry.match_any is defined and "+rst" in entry.match_any %}
    Should Be Equal Value Json Bool   ${r.json()}   ${entry}..ace-rule.match-any.+rst   true
{% endif %}
{% if entry.match_any is defined and "+syn" in entry.match_any %}
    Should Be Equal Value Json Bool   ${r.json()}   ${entry}..ace-rule.match-any.+syn   true
{% endif %}
{% if entry.match_any is defined and "+urg" in entry.match_any %}
    Should Be Equal Value Json Bool   ${r.json()}   ${entry}..ace-rule.match-any.+urg   true
{% endif %}
{% if entry.match_any is defined and "-ack" in entry.match_any %}
    Should Be Equal Value Json Bool   ${r.json()}   ${entry}..ace-rule.match-any.-ack   true
{% endif %}
{% if entry.match_any is defined and "-fin" in entry.match_any %}
    Should Be Equal Value Json Bool   ${r.json()}   ${entry}..ace-rule.match-any.-fin   true
{% endif %}
{% if entry.match_any is defined and "-psh" in entry.match_any %}
    Should Be Equal Value Json Bool   ${r.json()}   ${entry}..ace-rule.match-any.-psh   true
{% endif %}
{% if entry.match_any is defined and "-rst" in entry.match_any %}
    Should Be Equal Value Json Bool   ${r.json()}   ${entry}..ace-rule.match-any.-rst   true
{% endif %}
{% if entry.match_any is defined and "-syn" in entry.match_any %}
    Should Be Equal Value Json Bool   ${r.json()}   ${entry}..ace-rule.match-any.-syn   true
{% endif %}
{% if entry.match_any is defined and "-urg" in entry.match_any %}
    Should Be Equal Value Json Bool   ${r.json()}   ${entry}..ace-rule.match-any.-urg   true
{% endif %}
{% endfor %}
{% endfor %}
{% endif %}
{% endfor %}
```



**File 'iosxe_common'**

```
*** Settings ***
Library   pabot.PabotLib
Library   RequestsLibrary
Library   JSONLibrary
Library   Collections
Library   OperatingSystem
Library   ./lib/UtilsLib.py

*** Keywords ***
Login IOSXE
    ${auth}=   Create List   %{IOSXE_USERNAME}   %{IOSXE_PASSWORD}
    ${iosxe_insecure}=   Get Environment Variable   IOSXE_INSECURE   True
    ${verify}=   Set Variable If   '${iosxe_insecure}' == 'True' or '${iosxe_insecure}' == 'true'   False   True
{% for device in iosxe.devices | default([]) %}
    Create Session   IOSXE_{{ device.name }}   {{ 'https://' ~ device.host | default(device.url) }}   auth=${auth}   verify=${verify}   headers={"Accept": "application/yang-data+json", "Content-Type": "application/yang-data+json"}
{% endfor %}

Should Be Equal Value Json String
    [Arguments]   ${json}   ${json_path}   ${value}=${EMPTY}
    ${length}=   Get Length   ${value}
    IF   ${length} == 0   RETURN
    ${r_value}=   Get Value From Json   ${json}   ${json_path}
    ${r_value}=   Normalize String   text=${r_value}
    ${value}=   Normalize String   text=${value}
    Should Be Equal As Strings   ${r_value}   ${value}

Should Be Equal Value Json List
    [Arguments]   ${json}   ${json_path}   ${value}=${EMPTY}   ${normalize_types}=${False}
    ${r_value}=   Get Value From Json   ${json}   ${json_path}
    IF   ${r_value} == [] or ${value} == [] or "${value}" == "${EMPTY}"
        RETURN
    END
    IF   ${normalize_types}
        # Convert both lists to strings for type-insensitive comparison
        ${r_value_str}=   Evaluate   [str(x) for x in ${r_value}[0]]
        ${value_str}=   Evaluate   [str(x) for x in ${value}]
        Lists Should Be Equal   ${r_value_str}   ${value_str}   ignore_order=True
    ELSE
        Lists Should Be Equal   ${r_value}[0]   ${value}   ignore_order=True
    END

Should Be Equal Value Json Bool
    [Arguments]   ${json}   ${json_path}   ${value}=${EMPTY}
    ${r_value}=   Get Value From Json   ${json}   ${json_path}
    IF   "${value}" == "${EMPTY}"
        RETURN
    END
    IF   "${value}" == "True"
        IF   ${r_value} == []   Fail   Expected True but got nothing
        IF   ${r_value}[0] == [None]   RETURN
        IF   ${r_value}[0] == ${True}   RETURN
        IF   ${r_value}[0] != ""  RETURN
        Fail   Expected True but got ${r_value}[0]
    ELSE IF   "${value}" == "False"
        IF   ${r_value} == []   RETURN
        IF   ${r_value}[0] == ${False}   RETURN
        Fail   Expected False but got ${r_value}[0]
    END
```