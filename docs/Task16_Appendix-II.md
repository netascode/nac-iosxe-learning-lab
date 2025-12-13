**Configuration in ISP router**

ISP#sh run | s bgp
router bgp 65001
 bgp log-neighbor-changes
 neighbor 198.18.100.1 remote-as 65000
 neighbor 198.18.100.1 description eBGP to BORDER
 neighbor 198.18.100.2 remote-as 65000
 neighbor 198.18.100.2 description eBGP to BORDER
ISP#
ISP#sh run int gig 0/1
Building configuration...

Current configuration : 119 bytes
!
interface GigabitEthernet0/1
 ip address 198.18.100.1 255.255.255.252
 duplex auto
 speed auto
 media-type rj45
end

ISP#



