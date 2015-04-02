-- // insert_monitor_logs
-- Migration SQL that makes the change goes here.

INSERT monitor_logs(path, severity, content) VALUES
  ('/infrastructure/default/engine',      1, '缺省监控引擎连接到监控服务器'),
  ('/infrastructure/engine2/engine',      1, '监控引擎#2连接到监控服务器'),
  ('/default/group1/dev1', 2, '开始监控 dev1'),
  ('/default/group1/dev2', 2, '开始监控 dev2'),
  ('/default/websphere9',  2, '开始监控 Websphere9'),
  ('/default/range1',      3, '开始执行自动发现'),
  ('/default/range1',      3, '发现设备 srv1'),
  ('/default/range1',      3, '发现设备 srv2'),
  ('/default/range1/srv1', 2, '开始监控 srv1'),
  ('/default/group1/dev1', 3, '监视 CPU,磁盘,进程： CPU平均负载 90% > 80%(Y)'),
  ('/default/group1/dev2', 2, '监视 关键进程:oracle，存在!'),
  ('/default/group1/dev2', 2, '监视 关键进程:oracle，存在!'),
  ('/default/group1/dev2', 4, '监视 关键进程:oracle，不存在!'),
  ('/engine2/172_16_21_254', 2, '开始监控 172.16.21.254'),
  ('/engine2/172_16_1_0/172_16_1_12', 2, '开始监控 172.16.1.12'),
  ('/engine2/172_16_30_0/172_16_30_10', 4, '开始监控 172.16.30.10'),
  ('/engine2/172_16_21_254', 2, '监视 Interface/0 总体流量，入流量，出流量：入流量 12 Mb/s， 出流量 24 Mb/s'),
  ('/engine2/172_16_30_0/172_16_30_10', 5, '无法监视，错误原因为无法访问目标系统!');


-- //@UNDO
-- SQL to undo the change goes here.
SET foreign_key_checks = 0;
TRUNCATE TABLE monitor_logs;
SET foreign_key_checks = 1;

