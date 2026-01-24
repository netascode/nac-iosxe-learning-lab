## ISP Router Configuration

Here you can find the BGP and interface configuration applied to the **isp** router, used in [Task 08](Task08_Templates_type_file.md).

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



