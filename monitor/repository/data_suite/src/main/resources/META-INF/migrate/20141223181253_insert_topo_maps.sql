-- // insert_topo_maps
-- Migration SQL that makes the change goes here.

INSERT INTO topo_maps(id, path, label, map_size, node_size, background, scale, properties) VALUES
  (1, '/',               '监控系统',            2, 0, 'china',     1,   NULL),
  (2, '/infrastructure', '基础架构',            2, 0, 'itsnow',     1,   NULL),
  (3, '/infrastructure/default', '缺省监控系统', 0, 2, NULL,     1,   NULL),
  (4, '/infrastructure/engine2', '引擎#2系统',  0, 1, NULL,     1,   NULL),
  (5, '/default',        '缺省监控引擎的监控范围',2, 1, 'shanghai', 1,   NULL),
  (6, '/engine2',        '监控引擎#2的监控范围',  2,1, 'beijing',   1,   NULL),
  (7, '/default/group1', '静态设备组示例',       0, 2, NULL,       1,   NULL),
  (8, '/default/range1', '动态设备组示例',       0, 2, NULL,       0.9, NULL),
  (9, '/engine2/172_16_1_0',  '172.16.1.0',    0, 1, NULL,       1,   NULL),
  (10,'/engine2/172_16_30_0', '172.16.30.0',   0, 1,  NULL,       1,   NULL);

-- //@UNDO
-- SQL to undo the change goes here.
SET foreign_key_checks = 0;
TRUNCATE TABLE topo_maps;
SET foreign_key_checks = 1;


