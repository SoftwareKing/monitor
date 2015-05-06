#!/bin/sh

ifconfig | awk -v var='record' -v idx=1 '{
if( match($1, /[[:digit:]]+:/)>0 ){
    if( match($1, /${ifDescr}/) == 1 ){
      printf idx;
    }
    idx++;
}
}'