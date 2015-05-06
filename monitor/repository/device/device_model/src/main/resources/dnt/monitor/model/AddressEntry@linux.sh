#! /bin/sh
#
# Input:
#   1: lo: <LOOPBACK,UP,LOWER_UP> mtu 16436 qdisc noqueue state UNKNOWN
#       link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
#       inet 127.0.0.1/8 scope host lo
#       inet6 ::1/128 scope host
#          valid_lft forever preferred_lft forever
#   2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UP qlen 1000
#       link/ether 02:00:ac:10:03:10 brd ff:ff:ff:ff:ff:ff
#       inet 172.16.3.16/24 brd 172.16.3.255 scope global eth0
#       inet6 fe80::acff:fe10:310/64 scope link
#
# Output:
#   ifIndex ifName  mtu    adress     mask  broadcast
#   1       lo      16436  127.0.0.1  /8    false
#
ip address show | awk  -v var='record' '{
if(match($1, /[[:digit:]]+:/)>0){
    split($1, colOne, ":");
    record[1] = colOne[1];
    split($2, colTwo,":");
    record[2] = colTwo[1];
    record[3] = $5;
}
if($1=="inet"){
    printf record[1] " " record[2] " " record[3] " ";
    split($2, addr, "/");
    printf addr[1] " /" addr[2] " ";
    if($3 == "brd"){
        printf "true";
    }else{
        printf "false";
    }
    print "";
}
}'