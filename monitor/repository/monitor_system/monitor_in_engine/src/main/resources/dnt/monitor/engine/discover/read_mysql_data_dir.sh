#!/bin/sh

echo `sudo ps aux | grep mysqld | grep -v mysqld_safe | grep -v grep | awk '{print $13}' | awk -F= '{print $2}'`