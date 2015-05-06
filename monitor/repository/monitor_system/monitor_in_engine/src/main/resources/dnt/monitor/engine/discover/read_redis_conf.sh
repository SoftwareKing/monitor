#!/bin/sh

redis_conf=`redis-cli info | grep config_file | awk -F: '{print $2}' | tr -d '[[:space:]]'`
if [ -f $redis_conf ]; then
  cat $redis_conf
fi