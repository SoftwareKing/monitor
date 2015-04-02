-- // create_topo_links
-- Migration SQL that makes the change goes here.
CREATE TABLE IF NOT EXISTS topo_links(
  id           INT(10) UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
  map_id       INT(10) UNSIGNED NOT NULL COMMENT '图ID',
  from_id      INT(10) UNSIGNED NOT NULL COMMENT '源节点ID',
  to_id        INT(10) UNSIGNED NOT NULL COMMENT '目标ID',
  link_id      INT(10) UNSIGNED     NULL COMMENT '节点路径',
  label        VARCHAR(255)     NOT NULL COMMENT '显示名称',
  type         VARCHAR(255)         NULL COMMENT '链接类型',
  properties TEXT                   NULL COMMENT '属性',
  created_at TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '更新时间',
  FOREIGN KEY  (map_id) REFERENCES topo_maps(id) ON DELETE CASCADE ,
  FOREIGN KEY  (from_id) REFERENCES topo_nodes(id)ON DELETE CASCADE ,
  FOREIGN KEY  (to_id) REFERENCES topo_nodes(id) ON DELETE CASCADE
);

-- //@UNDO
-- SQL to undo the change goes here.
DROP TABLE IF EXISTS topo_links;

