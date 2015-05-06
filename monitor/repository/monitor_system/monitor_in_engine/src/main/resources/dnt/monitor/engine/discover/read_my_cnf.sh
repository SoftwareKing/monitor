#!/bin/sh

base_dir=`sudo ps aux | grep mysqld | grep -v mysqld_safe | grep -v grep | awk '{print $12}' | awk -F= '{print $2}'`

if [ -f $base_dir/my.cnf ]; then
  cat $base_dir/my.cnf
else
  cat /etc/my.cnf
fi