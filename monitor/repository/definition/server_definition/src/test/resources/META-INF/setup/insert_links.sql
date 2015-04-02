INSERT INTO links(id, from_id, to_id, type, performance, config_status, availability, properties, label) VALUES
  -- /default/engine -> /default/server
  (1, 2, 1,   'dnt.monitor.model.Link',    'Normal',     'Unchanged',   'Available',  NULL, '连接'),
  -- /engine2/engine -> /default/server
  (2, 3, 1,   'dnt.monitor.model.Link',    'Normal',     'Unchanged',   'Available',  NULL, '连接'),
  -- /default/engine -> /default/group1/dev1
  (3, 2, 4,   'dnt.monitor.model.Link',    'Normal',     'Unchanged',   'Available',  NULL, '监控'),
  -- /default/engine -> /default/group1/dev2
  (4, 2, 5,   'dnt.monitor.model.Link',    'Normal',     'Unchanged',   'Available',  NULL, '监控'),
  -- /default/engine -> /default/range1/srv1
  (5, 2, 6,   'dnt.monitor.model.Link',    'Normal',     'Unchanged',   'Available',  NULL, '监控'),
  -- /default/engine -> /default/range1/srv2
  (6, 2, 7,   'dnt.monitor.model.Link',    'Normal',     'Unchanged',   'Available',  NULL, '监控'),
  -- /default/engine -> /default/websphere9
  (7, 2, 8,   'dnt.monitor.model.Link',    'Normal',     'Unchanged',   'Available',  NULL, '监控'),
  -- /engine2/engine -> /engine2/172_16_21_254
  (8, 3, 9,   'dnt.monitor.model.Link',    'Normal',     'Unchanged',   'Available',  NULL, '监控'),
  -- /engine2/engine -> /engine2/172_16_1_0/172_16_1_12
  (9, 3, 10,  'dnt.monitor.model.Link',    'Normal',     'Unchanged',   'Available',  NULL, '监控'),
  -- /engine2/engine -> /engine2/172_16_30_0/172_16_30_10
  (10,3, 11,  'dnt.monitor.model.Link',    'Normal',     'Unchanged',   'Available',  NULL, '监控'),
  -- /default/group1/dev1 -> /default/group1/dev2
  (11,4, 5,   'dnt.monitor.model.Link',    'Unknown',    'Unknown',     'Unknown',    '{"direction":false}', '互备'),
  -- /default/range1/srv1 -> /default/range1/srv2
  (12,6, 7,   'dnt.monitor.model.Link',    'Unknown',    'Unknown',     'Unknown',    '{"direction":false}', '互备');
