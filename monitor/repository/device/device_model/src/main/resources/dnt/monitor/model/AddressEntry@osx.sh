#! /bin/sh
#
# Input:
#   en1: flags=8963<UP,BROADCAST,SMART,RUNNING,PROMISC,SIMPLEX,MULTICAST> mtu 1500
#           options=60<TSO4,TSO6>
#           ether 72:00:06:a3:7c:80
#           media: autoselect <full-duplex>
#           status: inactive
#   en2: flags=8963<UP,BROADCAST,SMART,RUNNING,PROMISC,SIMPLEX,MULTICAST> mtu 1500
#           options=60<TSO4,TSO6>
#           ether 72:00:06:a3:7c:81
#           media: autoselect <full-duplex>
#           status: inactive
#
# Output:
#   ifIndex ifName  mtu    adress     mask        broadcast
#   1       lo      16436  127.0.0.1  0xffffff00  false
#
ifconfig | awk  -v var='record' -v idx=1 '{
if(match($1, /[[:digit:]]+:/)>0){
    record[1] = idx++;
    split($1, colOne, ":");
    record[2] = colOne[1];
    record[3] = $4;
}
if($1=="inet"){
    printf record[1] " " record[2] " " record[3] " " ;
    printf $2 " " $4 " ";
    if($5=="broadcast"){
        printf "true";
    }else{
        printf "false";
    }
    print "";
}
}'