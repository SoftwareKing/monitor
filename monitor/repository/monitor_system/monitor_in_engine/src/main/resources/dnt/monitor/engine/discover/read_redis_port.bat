
tasklist | findstr redis-server

REM 如何抽取第二列的pid?

netstat -aon -p tcp | findstr pid

REM 抽取第二列，再按照 : 分割