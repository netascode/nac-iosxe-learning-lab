## Schema Reference (Lab Features Only)

!!! info "This is a ~15% slice of the full schema"
    The full IOS XE as Code data model schema covers ~249 top-level configuration keys. This appendix includes only the ~38 keys the lab actually uses (global, devices, device_groups, templates, banner, access_lists, ip_hosts, loopbacks, vlan, bgp, system, aliases). For the complete data model - including MACsec, DMVPN, QoS, HSRP/VRRP, MPLS, IS-IS, EIGRP, multicast, AAA/TACACS/RADIUS, STP, 802.1X, SNMP, EEM, segment routing, EVPN, and more - browse [netascode.cisco.com/docs/data_models/iosxe/overview/](https://netascode.cisco.com/docs/data_models/iosxe/overview/).

??? abstract "How to read this schema (Yamale syntax reference)"
    The schema is written in [Yamale](https://github.com/23andMe/Yamale), a YAML-based schema validation format. Quick reference for the syntax you'll see below:

    | Syntax                                     | Meaning                                                  |
    |--------------------------------------------|----------------------------------------------------------|
    | `str()`                                    | Any string.                                              |
    | `int()`                                    | Any integer.                                             |
    | `int(min=1, max=4094)`                     | Integer with bounds (e.g. VLAN IDs).                     |
    | `bool()`                                   | `true` or `false`.                                       |
    | `enum('permit', 'deny')`                   | One of the listed values - nothing else.                 |
    | `regex('^[A-Z]+$')`                        | String matching the given regex.                         |
    | `ip()`                                     | A valid IP address.                                      |
    | `list(include('X'))`                       | A list of objects conforming to the `X` sub-schema.      |
    | `include('X')`                             | A single object conforming to the `X` sub-schema.        |
    | `map(key=str())`                           | Key/value map with string keys.                          |
    | `required=False`                           | Field is optional (defaults to required otherwise).      |
    | `any(...)`                                 | Value can match any of several type constructors.        |

    So a line like `login: str(required=False)` reads as "the `login` field is an optional string", and `sequence: int(min=1, max=2147483647)` reads as "`sequence` is a required integer between 1 and 2^31-1".

Copy this single schema block for reference. It includes only the features used in this lab:

```yaml title="schema.yaml"
---
iosxe: include('iosxe', required=False)
---

# Root structure
iosxe:
  global: include('global', required=False)
  devices: list(include('devices'), required=False)
  device_groups: list(include('device_groups'), required=False)
  templates: list(include('iosxe_templates'), required=False)

# Global configuration (Task03: Banner)
global:
  configuration: include('device_configuration', required=False)
  templates: list(str(), required=False)

# Device definitions (Task03, Task05, Task06, Task08)
devices:
  name: str()
  host: str(required=False)
  configuration: include('device_configuration', required=False)
  templates: list(str(), required=False)
  variables: map(key=str(), required=False)

# Device groups (Task04: ACL)
device_groups:
  name: str()
  devices: list(str(), required=False)
  configuration: include('device_configuration', required=False)
  templates: list(str(), required=False)

# Template definitions (Task07, Task08, Task09)
iosxe_templates:
  name: str()
  type: enum('model', 'file', 'cli')
  file: str(required=False)
  content: str(required=False)
  configuration: include('device_configuration', required=False)

# Device configuration block (used by global, devices, device_groups, templates)
device_configuration:
  banner: include('banner', required=False)
  access_lists: include('access_lists', required=False)
  system: include('system', required=False)
  vlan: include('vlan', required=False)
  routing: include('routing', required=False)
  interfaces: include('interfaces', required=False)

# Banner (Task03)
banner:
  exec: str(required=False)
  login: str(required=False)
  motd: str(required=False)

# Access Lists (Task04)
access_lists:
  standard: list(include('access_lists_standard'), required=False)

access_lists_standard:
  name: str()
  entries: list(include('access_lists_standard_entries'), required=False)

access_lists_standard_entries:
  sequence: int()
  action: enum('deny', 'permit')
  prefix: ip(required=False)
  prefix_mask: str(required=False)
  any: bool(required=False)
  host: ip(required=False)

# System - IP Hosts (Task05), Hostname (Task06)
system:
  hostname: regex('^[^\s]*$', required=False)
  ip_hosts: list(include('system_ip_hosts'), required=False)

system_ip_hosts:
  name: str()
  ips: list(ip())
  vrf: str(required=False)

# VLAN (Task07)
vlan:
  vlans: list(include('vlan_vlans'), required=False)

vlan_vlans:
  id: int(min=1, max=4094)
  name: str(required=False)

# Routing - BGP (Task08)
routing:
  bgp: include('routing_bgp', required=False)

routing_bgp:
  as_number: any(int(), str())
  router_id_interface_type: enum('Loopback', required=False)
  router_id_interface_id: any(int(), str(), required=False)
  neighbors: list(include('bgp_neighbors'), required=False)

bgp_neighbors:
  ip: ip()
  remote_as: any(int(), str())
  description: str(required=False)

# Ethernet Interfaces (Task08)
interfaces:
  ethernets: list(include('ethernets'), required=False)

ethernets:
  type: any(enum('GigabitEthernet', 'FastEthernet', 'Ethernet', 'Port-channel', 'FiveGigabitEthernet', 'TenGigabitEthernet', 'TwentyFiveGigE', 'FortyGigabitEthernet', 'HundredGigE', 'TwoHundredGigE', 'FourHundredGigE'), regex("^.*[\$\%]\{.*$"))
  id: str()
  description: str(required=False)
  shutdown: any(bool(), regex("^.*[\$\%]\{.*$"), required=False)
  ipv4: include('interface_ipv4', required=False)

interface_ipv4:
  address: any(ip(), regex("^.*[\$\%]\{.*$"), required=False)
  address_mask: any(ip(), regex("^.*[\$\%]\{.*$"), required=False)
```

