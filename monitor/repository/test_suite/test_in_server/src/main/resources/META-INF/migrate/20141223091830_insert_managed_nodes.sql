-- // insert_managed_nodes
-- Migration SQL that makes the change goes here.
INSERT INTO managed_nodes(id, type, path, depth, label, icon, resource_id, resource_type, properties, comment,
                          `range`, state, priority, location, organization, frequency, schedule, maintain_window, credentials) VALUES
  (1, 'Group', '/', 0, '监控系统', 'monitor_system', NULL, NULL, NULL, 'The system root node',
   NULL, 'Running', 'Normal', '{"latitude": 100, "longitude": 90}', NULL, '5m' , NULL , NULL , NULL),
  (2, 'Group', '/infrastructure', 1, '基础架构', 'monitor_system', NULL, NULL, NULL, 'The system infrastructure node',
   NULL, 'Running', 'Normal', '{"latitude": 100, "longitude": 90}', NULL, '5m' , NULL , NULL , NULL),
  (3, 'Group', '/infrastructure/default', 2, '缺省监控系统', 'monitor_system',  NULL, NULL, NULL, 'The default monitor system',
   NULL, NULL, NULL, NULL, NULL ,'5m',  NULL , NULL , NULL),
  (4, 'Resource', '/infrastructure/default/server', 3, '监控服务器', 'monitor_server',  1, '/app/jvm/monitor/server', NULL, 'The monitor server ',
   NULL, NULL, NULL, NULL, NULL , '5m' ,NULL,  NULL , NULL),
  (5, 'Resource', '/infrastructure/default/engine', 3, '缺省监控引擎', 'monitor_engine', 2, '/app/jvm/monitor/engine', NULL, 'The default engine',
   NULL, NULL, NULL, NULL, NULL , '5m' , NULL, NULL , NULL),
  (6, 'Group', '/infrastructure/engine2', 2, '引擎#2系统', 'monitor_system',  NULL, NULL, NULL ,'The engine#2 system',
   NULL, NULL, NULL, NULL, NULL , '5m' , NULL, NULL , NULL),
  (7, 'Resource', '/infrastructure/engine2/engine', 3, '监控引擎#2', 'monitor_engine', 3, '/app/jvm/monitor/engine', NULL, 'The second engine',
   NULL, NULL, NULL, NULL, NULL , '5m' , NULL ,NULL,  NULL),
  (8, 'Group', '/default', 1, '缺省监控引擎的监控范围', 'monitor_scope',  NULL, NULL, NULL ,'The monitor scope of default engine',
   NULL, NULL, NULL, '{"latitude": 200, "longitude": 80}', NULL, '5m' , NULL , NULL , NULL),
  (9, 'Group', '/engine2', 1, '监控引擎#2的监控范围', 'monitor_scope', NULL, NULL, NULL, 'The monitor scope of engine#2',
   NULL, NULL, NULL, NULL, NULL , '5m' , NULL , NULL, NULL),
  (10, 'Group', '/default/group1', 2, '静态设备组示例', 'monitor_group', NULL, NULL ,NULL, 'The sample monitor group',
   NULL, NULL, NULL, NULL, NULL , '5m' , NULL , NULL, NULL),
  (11, 'Resource', '/default/group1/dev1', 3, 'dev1', 'linux', 4, '/device/host/linux', NULL,  'The sample linux host: dev1',
   NULL, NULL, NULL, NULL, NULL , '5m' , NULL , NULL, NULL),
  (12, 'Resource', '/default/group1/dev2', 3, 'dev2', 'linux', 5, '/device/host/linux',  NULL, 'The sample linux host: dev2',
   NULL, NULL, NULL, NULL, NULL , '5m' , NULL , NULL, NULL),
  (13, 'Range', '/default/range1', 2, '动态设备组示例', 'monitor_range', NULL, NULL, NULL, 'The sample monitor range' ,
   '192.168.1.0/24', NULL, NULL, NULL, NULL , '5m' , NULL, NULL, NULL ),
  (14,'Resource', '/default/range1/srv1', 3, 'srv1', 'windows', 6, '/device/host/windows',NULL, 'The sample windows host: srv1',
   NULL, NULL, NULL, NULL, NULL , '5m' , NULL , NULL, NULL),
  (15,'Resource', '/default/range1/srv2', 3, 'srv2', 'windows', 7, '/device/host/windows',NULL,  'The sample windows host: srv2',
   NULL, NULL, NULL, NULL, NULL , '5m' , NULL , NULL, NULL),
  (16,'Resource', '/default/websphere9', 2, 'WebSphere9', 'websphere', 8, '/device', NULL, 'The sample resource',
   NULL, NULL, NULL, NULL, NULL , '5m' , NULL , NULL, NULL),
  (17,'Resource', '/engine2/172_16_21_254', 2, '172.16.21.254', 'cisco_router', 9, '/device', NULL, 'The sample CISCO router',
   NULL, NULL, NULL, NULL, NULL , '5m' , NULL , NULL, NULL),
  (18,'Group', '/engine2/172_16_1_0', 2, '172.16.1.0', 'monitor_range', NULL, NULL, NULL ,'Another monitor range',
   NULL, NULL, NULL, NULL, NULL , '5m' , NULL , NULL, NULL),
  (19,'Group', '/engine2/172_16_30_0', 2, '172.16.30.0', 'monitor_range', NULL, NULL, NULL ,'Another monitor range',
   NULL, NULL, NULL, NULL, NULL , '5m', NULL , NULL, NULL),
  (20,'Resource', '/engine2/172_16_1_0/172_16_1_12', 3, '172.16.1.12', 'switch2', 10, '/device', NULL, 'A layer-2 switch',
   NULL, NULL, NULL, NULL, NULL , '5m', NULL , NULL, NULL),
  (21,'Resource', '/engine2/172_16_30_0/172_16_30_10', 3, '172.16.30.10', 'switch3', 11, '/device', NULL, 'A layer-3 switch',
   NULL, NULL, NULL, NULL, NULL , '5m' , NULL , NULL, NULL);


-- //@UNDO
-- SQL to undo the change goes here.
SET foreign_key_checks = 0;
TRUNCATE TABLE managed_nodes;
SET foreign_key_checks = 1;

