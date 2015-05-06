-- // insert_resources
-- Migration SQL that makes the change goes here.

INSERT INTO resources(id, type, address, performance, config_status, availability, properties, label) VALUES
  (1, '/app/jvm/monitor/server', 'localhost',    'Normal',  'Unchanged', 'Available',  NULL, '监控服务器'),
  (2, '/app/jvm/monitor/engine', 'localhost',    'Normal',  'Unchanged', 'Available',  NULL, '缺省监控引擎'),
  (3, '/app/jvm/monitor/engine', '172.16.1.14',  'Normal',  'Unchanged', 'Available',  NULL, '监控引擎#2'),
  (4, '/device/host/linux',                 '172.16.1.10',  'Normal',  'Unknown',   'Unknown',    NULL, 'dev1'),
  (5, '/device/host/linux',                 '172.16.1.11',  'Critical','Changed',   'Unavailable',NULL, 'dev2'),
  (6, '/device/host/windows',               '172.16.1.20',  'Unknown', 'Unchanged', 'Available',  NULL, 'srv1'),
  (7, '/device/host/windows',               '172.16.1.21',  'Warning', 'Unchanged', 'Available',  NULL, 'srv2'),
  (8, '/device',                           '172.16.1.22',  'Unknown', 'Unknown',   'Unknown',    NULL, 'WebSphere9' ),
  (9, '/device',                           '172.16.21.254','Unknown', 'Unknown',   'Unknown',    NULL, '172.16.21.254'),
  (10,'/device',                           '172.16.1.12',  'Unknown', 'Unknown',   'Unknown',    NULL, '172.16.1.12'),
  (11,'/device',                           '172.16.31.10', 'Unknown', 'Unknown',   'Unknown',    NULL, '172.16.30.10');

-- //@UNDO
-- SQL to undo the change goes here.
SET foreign_key_checks = 0;
TRUNCATE TABLE resources;
SET foreign_key_checks = 1;


