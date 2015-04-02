-- // insert_topo_links
-- Migration SQL that makes the change goes here.
INSERT INTO topo_links(id, map_id, from_id, to_id, link_id, type, label, properties) VALUES
  (1,  2, 3,  2,  1,   'ELBOW',  '连接',  NULL), -- /infrastructure/engine2 -> /infrastructure/default
  (2,  3, 4,  5,  2,   'ELBOW',  '连接',  NULL), -- /infrastructure/default/engine -> /infrastructure/default/server
  (3,  7, 15, 16, 3,   'VERTICAL_HORIZONTAL', '互备', NULL), -- /default/group1/dev1 -> /default/group1/dev2
  (4,  8, 17, 18, 4,   'VERTICAL_HORIZONTAL', '互备', NULL); -- /default/range1/srv1 -> /default/range1/srv2

-- //@UNDO
-- SQL to undo the change goes here.
SET foreign_key_checks = 0;
TRUNCATE TABLE topo_links;
SET foreign_key_checks = 1;
