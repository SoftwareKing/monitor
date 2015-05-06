#!/bin/sh

ip address show ${ifDescr} | awk '{if(NR==1){split($1,a,":");print a[1];}}'