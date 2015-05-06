-- // insert_win_services
-- Migration SQL that makes the change goes here.
INSERT INTO components (id, resource_id, type, label, performance, config_status, availability) VALUES
  (501,  6, 'WinService', 'Workstation', 'Normal', 'Unknown', 'Available'),
  (502,  6, 'WinService', 'MonitorServer', 'Normal', 'Changed', 'Available'),
  (503,  7, 'WinService', 'Workstation',   'Normal', 'Unknown', 'Available'),
  (504,  7, 'WinService', 'MonitorEngine',   'Normal', 'Changed', 'Available');

INSERT INTO t_win_services (tid, policy, status, description) VALUES
  (501,  'Auto', 'Running', 'The windows workstation service' ),
  (502,  'Auto', 'Running', 'The monitor server' ),
  (503,  'Auto', 'Running', 'The windows workstation service' ),
  (504,  'Auto', 'Running', 'The monitor engine' );

-- //@UNDO
-- SQL to undo the change goes here.

SET foreign_key_checks = 0;
DELETE FROM t_nics WHERE tid BETWEEN 444 AND 447;
DELETE FROM components WHERE id BETWEEN 444 AND 447;
SET foreign_key_checks = 1;
