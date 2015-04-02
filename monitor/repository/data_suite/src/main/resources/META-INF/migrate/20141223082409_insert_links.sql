-- // insert_links
-- Migration SQL that makes the change goes here.

INSERT INTO links(id, from_id, to_id, type, performance, config_status, availability, properties, label) VALUES
  -- /infrastructure/default/engine -> /infrastructure/default/server
  (1, 2, 1,   'Connect',    'Normal',     'Unchanged',   'Available',  NULL, '连接'),
  -- /infrastructure/engine2/engine -> /infrastructure/default/server
  (2, 3, 1,   'Connect',    'Normal',     'Unchanged',   'Available',  NULL, '连接'),
  -- /default/group1/dev1 -> /default/group1/dev2
  (3, 4, 5,   'Standby',    'Unknown',    'Unknown',     'Unknown',    '{"direction":false}', '互备'),
  -- /default/range1/srv1 -> /default/range1/srv2
  (4, 6, 7,   'Standby',    'Unknown',    'Unknown',     'Unknown',    '{"direction":false}', '互备'),
  -- /infrastructure/default/server -> /default/group1/dev1
  (5, 1, 4,   'RunOn',      'Normal',    'Unchanged',    'Available',  NULL, '运行'),
  -- /infrastructure/default/engine -> /default/group1/dev1
  (6, 2, 4,   'RunOn',      'Normal',    'Unchanged',    'Available',  NULL, '运行'),
  -- /infrastructure/engine2/engine -> /default/group1/dev2
  (7, 3, 5,   'RunOn',      'Normal',    'Unchanged',    'Available',  NULL, '运行');

-- //@UNDO
-- SQL to undo the change goes here.
SET foreign_key_checks = 0;
TRUNCATE TABLE links;
SET foreign_key_checks = 1;


