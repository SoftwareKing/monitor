-- // insert_monitor_logs
-- Migration SQL that makes the change goes here.

INSERT into monitor_logs(path, severity, content) VALUES
  ('/default/engine',      1, '缺省监控引擎连接到监控服务器'),
  ('/engine2/engine',      1, '监控引擎#2连接到监控服务器');





