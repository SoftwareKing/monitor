#!/bin/sh
#
# Input:
#   Name  Mtu   Network       Address            Ipkts Ierrs    Opkts Oerrs  Coll Drop
#   lo0   16384 <Link#1>                       7297147     0  7297147     0     0   0
#   lo0   16384 localhost   ::1                7297147     -  7297147     -     -   -
#   lo0   16384 127           localhost        7297147     -  7297147     -     -   -
#   lo0   16384 fe80::1%lo0 fe80:1::1          7297147     -  7297147     -     -   -
#   gif0* 1280  <Link#2>                             0     0        0     0     0   0
#   stf0* 1280  <Link#3>                             0     0        0     0     0   0
#   en0   1500  <Link#4>    6c:40:08:af:ea:44 25916535     0 30074699     0     0 733
#   en0   1500  fe80::6e40: fe80:4::6e40:8ff: 25916535     - 30074699     -     -   -
#   en0   1500  192.168.12    192.168.12.63   25916535     - 30074699     -     -   -
#   en1   1500  <Link#5>    72:00:06:a3:7c:80        0     0        0     0     0   0
#   en2   1500  <Link#6>    72:00:06:a3:7c:81        0     0        0     0     0   0
#   p2p0  2304  <Link#7>    0e:40:08:af:ea:44        0     0        0     0     0   0
#   awdl0 1452  <Link#8>    96:10:41:93:f0:48        0     0     2926     0     0   0
#   awdl0 1452  fe80::9410: fe80:8::9410:41ff        0     -     2926     -     -   -
#   bridg 1500  <Link#9>    6e:40:08:fa:ea:00        0     0        1     0     0   0
#   vnic0 1500  <Link#10>   00:1c:42:00:00:08        0     0        0     0     0   0
#   vnic0 1500  10.211.55/24  10.211.55.2            0     -        0     -     -   -
#   vnic1 1500  <Link#11>   00:1c:42:00:00:09        0     0        0     0     0   0
#   vnic1 1500  10.37.129/24  10.37.129.2            0     -        0     -     -   -
# Output:
#   Name  Mtu   Network       Address            Ipkts Ierrs    Opkts Oerrs  Coll   Drop
#   lo0   16384 <Link#1>                       7296828     0  7296828     0     0   0
#   gif0* 1280  <Link#2>                             0     0        0     0     0   0
#   stf0* 1280  <Link#3>                             0     0        0     0     0   0
#   en0   1500  <Link#4>    6c:40:08:af:ea:44 25781852     0 30071892     0     0   733
#   en1   1500  <Link#5>    72:00:06:a3:7c:80        0     0        0     0     0   0
#   en2   1500  <Link#6>    72:00:06:a3:7c:81        0     0        0     0     0   0
#   p2p0  2304  <Link#7>    0e:40:08:af:ea:44        0     0        0     0     0   0
#   awdl0 1452  <Link#8>    96:10:41:93:f0:48        0     0     2926     0     0   0
#   bridg 1500  <Link#9>    6e:40:08:fa:ea:00        0     0        1     0     0   0
#   vnic0 1500  <Link#10>   00:1c:42:00:00:08        0     0        0     0     0   0
#   vnic1 1500  <Link#11>   00:1c:42:00:00:09        0     0        0     0     0   0
#
#   gif0* will be convert as gif0 by model
#
netstat -w0 -d | grep -v ^Name | awk -v var='nics' '{
  itf = $1
  nics[itf]++;
  if(nics[itf] == 1 && $10 != "")
    print $0
}'