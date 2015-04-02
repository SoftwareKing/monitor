-- // insert_workflow_menus
-- Migration SQL that makes the change goes here.

TRUNCATE TABLE menu_items;
INSERT INTO menu_items(id, parent_id, name, state, position, css) VALUES
(1,null, '主页',   'home',                      10, 'icon-globe'),
(2,null, '业务',   'businesses.list',           20, 'icon-th'),
(3,null, '资源',   'resources.topos_detail',    30, 'icon-cloud'),
(4,null, '拓扑',   'topos_manage.detail',       80, 'icon-th'),
(5,null, '机房',   'rooms.list',                40, 'icon-home'),
(6,null, '告警',   'events.list',               50, 'icon-fire'),
(7,null, '报表',   'reports.list',              60, 'icon-th-list'),
(8,null, '设置',   'settings.list',             70, 'icon-cogs')
;


-- //@UNDO
-- SQL to undo the change goes here.

TRUNCATE TABLE menu_items;

