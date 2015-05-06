#!/bin/sh
#
# input:
#   ? (192.168.12.39) at 48:5a:b6:e3:42:9 on en0 ifscope [ethernet]
# output:
#  <<netAddress     physAddress       ifDescr>>
#    192.168.12.39  48:5a:b6:e3:42:9  en0
arp -a | awk -v var='record' '{
  record[1] = substr($2, 2, index($2, ")") - 2)
  record[2] = $4
  record[3] = $6
  if(index($4, "(") == 0 ){
    print record[1] " " record[2] " " record[3]
  }
}'