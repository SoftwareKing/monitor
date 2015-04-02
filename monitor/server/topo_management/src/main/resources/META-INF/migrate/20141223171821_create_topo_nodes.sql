-- // create_topo_nodes
-- Migration SQL that makes the change goes here.
CREATE TABLE IF NOT EXISTS topo_nodes(
  id         INT(10) UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
  map_id     INT(10) UNSIGNED NOT NULL COMMENT '图ID',
  path       VARCHAR(255)         NULL COMMENT '节点路径',
  label      VARCHAR(255)     NOT NULL COMMENT '显示名称',
  icon       VARCHAR(255)         NULL COMMENT '图标',
  coordinate VARCHAR(255)         NULL COMMENT '坐标',
  layer      INT(10)          NOT NULL DEFAULT 0 COMMENT '图层序号',
  rotate     FLOAT            NOT NULL DEFAULT 0 COMMENT '旋转角度',
  size       VARCHAR(255)         NULL COMMENT '尺寸',
  leaf       BOOL             NOT NULL DEFAULT TRUE COMMENT '是否叶子',
  properties TEXT                 NULL COMMENT '属性',
  created_at TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '更新时间',
  FOREIGN KEY (map_id) REFERENCES topo_maps(id) ON DELETE CASCADE
);

-- //@UNDO
-- SQL to undo the change goes here.
DROP TABLE IF EXISTS topo_nodes;

