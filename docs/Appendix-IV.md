# Appendix IV — ISP router configuration

The **isp** router in the CML topology is pre-configured by the lab environment — you don't edit it, but it's useful to know what's on it. This appendix is the reference.

## Why is the ISP pre-configured?

Task 08 (Templates type `file`) has you configure `border` as an eBGP speaker peering with `isp`. For that peering to come up, the other end has to be ready — `isp` needs its own BGP configuration (AS 65001, neighbor statement pointing back at `border`, network advertisement for `8.8.8.0/24`).

Two reasons it's pre-provisioned rather than having you configure both sides:

- **Time.** Configuring both ends of a BGP session inside a 4-hour lab burns ~15 minutes of wall clock on a pattern that isn't the learning point — the learning point is "Network as Code can push BGP config to my side", not "I can configure BGP on two devices by hand".
- **Simulation scope.** The `isp` router stands in for an external service provider. Real ISPs don't give you a login to their edge routers; you configure your side, they configure theirs, and the session comes up if both sides are consistent. Splitting the work across both sides of the peering preserves that mental model.

With the ISP side already in place, Task 08's job is just "get `border`'s side consistent with it". You'll see the BGP session move from `Idle` → `Active` → `OpenSent` → `Established` over 30–60 seconds once Terraform applies your config.

## Configuration reference

Below is the BGP and interface configuration on the **isp** router. Use this as a reference if you want to see exactly what your `border` configuration needs to match (AS 65001, neighbor `198.18.100.2`, advertisement of `8.8.8.0/24`).

{% raw %}

```
isp#show run | sec bgp
router bgp 65001
 bgp log-neighbor-changes
 neighbor 198.18.100.2 remote-as 65000
 neighbor 198.18.100.2 description eBGP to BORDER
 neighbor 198.18.100.2 timers 60 180 30
 !
 address-family ipv4
  network 8.8.8.0 mask 255.255.255.0
  neighbor 198.18.100.2 activate
 exit-address-family
isp#
isp#show run int gig 0/1
Building configuration...

Current configuration : 142 bytes
!
interface GigabitEthernet0/1
 description border G1
 ip address 198.18.100.1 255.255.255.252
 duplex auto
 speed auto
 media-type rj45
end

isp#
```

{% endraw %}

The `8.8.8.0/24` advertisement is a stand-in for "the internet" — when your BGP session comes up, `border` learns this route and can forward to it (see Task 08's verification step).

---

**← Previous:** [Appendix III — nac-test reference](Appendix-III.md)  ·  **Next:** [Appendix V — Quick reference](Appendix-V.md)
