-- // insert_events
-- Migration SQL that makes the change goes here.

INSERT INTO events(path, severity, content, priority, ack) VALUES
  ('/infrastructure/default/engine',      1, '缺省监控引擎连接到监控服务器', 0, 0),
  ('/infrastructure/engine2/engine',      1, '监控引擎#2连接到监控服务器', 0, 0),
  ('/default/group1/dev1', 2, '开始监控 dev1', 0, 0),
  ('/default/group1/dev2', 2, '开始监控 dev2', 0, 0),
  ('/default/websphere9',  2, '开始监控 Websphere9', 0, 0),
  ('/default/range1',      3, '开始执行自动发现', 1, 1),
  ('/default/range1',      3, '发现设备 srv1', 1, 1),
  ('/default/range1',      3, '发现设备 srv2', 1, 1),
  ('/default/range1/srv1', 2, '开始监控 srv1', 1, 1),
  ('/default/group1/dev1', 3, '监视 CPU,磁盘,进程： CPU平均负载 90% > 80%(Y)', 1, 1),
  ('/default/group1/dev2', 2, '监视 关键进程:oracle，存在!', 1, 1),
  ('/default/group1/dev2', 2, '监视 关键进程:oracle，存在!', 2, 2),
  ('/default/group1/dev2', 4, '监视 关键进程:oracle，不存在!', 2, 2),
  ('/engine2/172_16_21_254', 2, '开始监控 172.16.21.254', 2, 2),
  ('/engine2/172_16_1_0/172_16_1_12', 2, '开始监控 172.16.1.12', 2, 2),
  ('/engine2/172_16_30_0/172_16_30_10', 4, '开始监控 172.16.30.10', 2, 2),
  ('/engine2/172_16_21_254', 2, '监视 Interface/0 总体流量，入流量，出流量：入流量 12 Mb/s， 出流量 24 Mb/s', -2, 2),
  ('/engine2/172_16_30_0/172_16_30_10', 5, '无法监视，错误原因为无法访问目标系统!', -2, 2);

-- //@UNDO
-- SQL to undo the change goes here.
SET foreign_key_checks = 0;
TRUNCATE TABLE events;
SET foreign_key_checks = 1;


