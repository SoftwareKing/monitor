-- // insert_hosts
-- Migration SQL that makes the change goes here.

INSERT INTO t_hosts(tid, hostname, domain, manufacturer, model_name, os, version, serial_number, cpu_count, process_count) VALUES
  (4, 'dev1', NULL,   'Dell',  'PowerEdge R720',  'CentOS release 6.5 (Final)',   '2.6.32-431.29.2.el6.x86_64',  '10AC0D03', 4,  NULL),
  (5, 'dev2', NULL,   'Dell',  'PowerEdge R920',  'CentOS release 6.5 (Final)',   '2.6.32-431.29.2.el6.x86_64',  '10AC0D04', 8,  NULL),
  (6, 'srv1', 'win',  'HP',    'ProLiant DL388p', 'Windows Server', '2003', 'ccc-ddd', 8, 10239),
  (7, 'srv2', 'win',  'HP',    'ProLiant DL460c', 'Windows Server', '2007', 'abc-abc', 12, 10392);


-- //@UNDO
-- SQL to undo the change goes here.
SET foreign_key_checks = 0;
TRUNCATE TABLE t_hosts;
SET foreign_key_checks = 1;

