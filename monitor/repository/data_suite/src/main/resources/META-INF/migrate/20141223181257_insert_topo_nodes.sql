-- // insert_topo_nodes
-- Migration SQL that makes the change goes here.

INSERT INTO topo_nodes(id, map_id, path, leaf, icon, coordinate, layer, properties, label) VALUES
(1,  1, '/infrastructure',                   FALSE , 'monitor_system', '{"x": "100", "y": "10"}',  1, NULL, '基础架构'),
(2,  2, '/infrastructure/default',           FALSE , 'monitor_system', '{"x": "10",  "y": "220"}', 1, NULL, '缺省监控系统'     ),
(3,  2, '/infrastructure/engine2',           FALSE , 'monitor_system', '{"x": "10",  "y": "220"}', 1, NULL, '监控引擎#2系统'     ),
(4,  3, '/infrastructure/default/engine',    TRUE  , 'monitor_engine', '{"x": "320", "y": "50"}',  1, NULL, '缺省监控引擎'    ),
(5,  3, '/infrastructure/default/server',    TRUE  , 'monitor_server', '{"x": "10",  "y": "220"}', 1, NULL, '监控服务器'     ),
(6,  4, '/infrastructure/engine2/engine',    TRUE  , 'monitor_engine', '{"x": "320", "y": "50"}',  1, NULL, '监控引擎#2'    ),
(7,  1, '/default',                          FALSE , 'monitor_scope',  '{"x": "100", "y": "100"}', 1, NULL, '缺省监控引擎的监控范围'),
(8,  1, '/engine2',                          FALSE , 'monitor_scope',  '{"x": "180", "y": "200"}', 1, NULL, '监控引擎#2的监控范围'),
(9,  5, '/default/group1',                   FALSE , 'monitor_group',  '{"x": "120", "y": "120"}', 1, NULL, '静态设备组示例'   ),
(10, 5, '/default/range1',                   FALSE , 'monitor_group',  '{"x": "180", "y": "180"}', 1, NULL, '动态设备组示例'  ),
(11, 5, '/default/websphere9',                TRUE , 'websphere',      '{"x": "380", "y": "80"}',  1, NULL, 'WebSphere9'),
(12, 6, '/engine2/172_16_21_254',             TRUE , 'cisco_router',   '{"x": "120", "y": "120"}', 1, NULL, '172.16.21.254'),
(13, 6, '/engine2/172_16_1_0',               FALSE , 'monitor_range',  '{"x": "50",  "y": "70"}',  1, NULL, '172.16.1.0'),
(14, 6, '/engine2/172_16_30_0',              FALSE , 'monitor_range',  '{"x": "30", "y": "120"}',  1, NULL, '172.16.30.0'),
(15, 7, '/default/group1/dev1',               TRUE , 'linux',          '{"x": "40", "y": "130"}',  1, NULL, 'dev1'      ),
(16, 7, '/default/group1/dev2',               TRUE , 'linux',          '{"x": "50", "y": "140"}',  1, NULL, 'dev2'      ),
(17, 8, '/default/range1/srv1',               TRUE , 'windows',        '{"x": "60", "y": "150"}',  1, NULL, 'srv1'      ),
(18, 8, '/default/range1/srv2',               TRUE , 'windows',        '{"x": "70", "y": "160"}',  1, NULL, 'srv2'      ),
(19, 9, '/engine2/172_16_1_0/172_16_1_12',    TRUE , 'switch2',        '{"x": "80", "y": "170"}',  1, NULL, '172.16.1.12'),
(20, 10,'/engine2/172_16_30_0/172_16_30_10',  TRUE , 'switch3',        '{"x": "90", "y": "180"}',  1, NULL, '172.16.30.10');

-- //@UNDO
-- SQL to undo the change goes here.
SET foreign_key_checks = 0;
TRUNCATE TABLE topo_nodes;
SET foreign_key_checks = 1;


