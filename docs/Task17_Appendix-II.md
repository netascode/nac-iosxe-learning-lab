# Appendix II: Schema Reference (Lab Features Only)

Copy this single schema block for reference. It includes only the features used in this lab:

```yaml
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
  hostname: str(required=False)
  ip_hosts: list(include('system_ip_hosts'), required=False)

system_ip_hosts:
  name: str()
  ips: list(ip())

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
```
