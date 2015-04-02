-- // create_topo_maps
-- Migration SQL that makes the change goes here.
CREATE TABLE IF NOT EXISTS topo_maps(
  id         INT(10) UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
  path       VARCHAR(255)         NULL COMMENT '节点路径',
  label      VARCHAR(255)     NOT NULL COMMENT '显示名称',
  map_size   INT(10)          NOT NULL DEFAULT 0 COMMENT '子图个数',
  node_size  INT(10)          NOT NULL DEFAULT 0 COMMENT '子节点个数',
  background VARCHAR(255)         NULL COMMENT '背景图',
  scale      FLOAT            NOT NULL DEFAULT 0 COMMENT '缩放比例',
  properties TEXT                 NULL COMMENT '属性',
  created_at TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '更新时间'
);

-- //@UNDO
-- SQL to undo the change goes here.
DROP TABLE IF EXISTS topo_maps;

