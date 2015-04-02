-- // insert_operation_logs
-- Migration SQL that makes the change goes here.

INSERT INTO operation_logs(path, severity, content, user_id, user_name) VALUES
  ('/infrastructure/default/engine',      1, '缺省监控引擎连接到监控服务器', 1, '吴小勇'),
  ('/infrastructure/engine2/engine',      1, '监控引擎#2连接到监控服务器', 2, '吴小勇'),
  ('/default/group1/dev1', 2, '开始监控 dev1', 3, '吴小勇'),
  ('/default/group1/dev2', 2, '开始监控 dev2', 4, '吴小勇'),
  ('/default/websphere9',  2, '开始监控 Websphere9', 5, '吴小勇'),
  ('/default/range1',      3, '开始执行自动发现', 6, '吴小勇'),
  ('/default/range1',      3, '发现设备 srv1', 7, '李伟'),
  ('/default/range1',      3, '发现设备 srv2', 8, '李伟'),
  ('/default/range1/srv1', 2, '开始监控 srv1', 9, '李伟'),
  ('/default/group1/dev1', 3, '监视 CPU,磁盘,进程： CPU平均负载 90% > 80%(Y)', 10, '李伟'),
  ('/default/group1/dev2', 2, '监视 关键进程:oracle，存在!', 11, '李伟'),
  ('/default/group1/dev2', 2, '监视 关键进程:oracle，存在!', 12, '李伟'),
  ('/default/group1/dev2', 4, '监视 关键进程:oracle，不存在!', 13, '吴进'),
  ('/engine2/172_16_21_254', 2, '开始监控 172.16.21.254', 14, '吴进'),
  ('/engine2/172_16_1_0/172_16_1_12', 2, '开始监控 172.16.1.12', 15, '吴进'),
  ('/engine2/172_16_30_0/172_16_30_10', 4, '开始监控 172.16.30.10', 16, '吴进'),
  ('/engine2/172_16_21_254', 2, '监视 Interface/0 总体流量，入流量，出流量：入流量 12 Mb/s， 出流量 24 Mb/s', 17, '吴进'),
  ('/engine2/172_16_30_0/172_16_30_10', 5, '无法监视，错误原因为无法访问目标系统!', 18, '吴进');

-- //@UNDO
-- SQL to undo the change goes here.
SET foreign_key_checks = 0;
TRUNCATE TABLE operation_logs;
SET foreign_key_checks = 1;
