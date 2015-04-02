-- // insert_monitor_engines
-- Migration SQL that makes the change goes here.

INSERT INTO t_monitor_engines(tid, home, pids, `name`, engine_id, api_token) VALUES
  (2, '/opt/monitor/engine', '[1092,1302,1032]@@->java.util.Set', 'default', '00-11-22-33-44',  'secret-api-token'),
  (3, '/opt/monitor/engine', '[3028,3020,3021]@@->java.util.Set', 'engine_2', '01-23-45-67-89',  'secret-api-token');

-- //@UNDO
-- SQL to undo the change goes here.
SET foreign_key_checks = 0;
TRUNCATE TABLE t_monitor_engines;
SET foreign_key_checks = 1;


