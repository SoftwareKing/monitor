-- // create_components
-- Migration SQL that makes the change goes here.

CREATE TABLE IF NOT EXISTS components(
  id             INT(10) UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
  resource_id    INT(10) UNSIGNED NOT NULL COMMENT '资源ID',
  type           VARCHAR(255)     NOT NULL COMMENT '组件类型',
  label          VARCHAR(255)         NULL COMMENT '显示名称',
  keyed          BOOLEAN          NOT NULL DEFAULT  FALSE    COMMENT '是否关键',
  performance    VARCHAR(20)      NOT NULL DEFAULT 'Unknown' COMMENT '组件性能状态',
  config_status  VARCHAR(20)      NOT NULL DEFAULT 'Unknown' COMMENT '组件配置状态',
  availability   VARCHAR(20)      NOT NULL DEFAULT 'Unknown' COMMENT '组件可用性状态',
  properties     TEXT             NULL     COMMENT '属性',
  created_at     TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at     TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '更新时间',
  FOREIGN KEY (resource_id) REFERENCES resources(id) ON DELETE CASCADE
);

-- //@UNDO
-- SQL to undo the change goes here.
DROP TABLE IF EXISTS components;


