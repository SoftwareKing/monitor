#!/bin/sh

nginx_conf=`sudo nginx -t 2>&1 | head -1 | awk '{print $5}'`
if [ -f $nginx_conf ]; then
  cat $nginx_conf
fi