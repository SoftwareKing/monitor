-- // create_resources
-- Migration SQL that makes the change goes here.
CREATE TABLE IF NOT EXISTS resources(
  id             INT(10) UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
  type           VARCHAR(255)     NOT NULL COMMENT '资源类型',
  label          VARCHAR(255)     NOT NULL COMMENT '显示名称',
  address        VARCHAR(255)     NOT NULL COMMENT '地址',
  performance    VARCHAR(20)      NOT NULL DEFAULT 'Unknown' COMMENT '整体性能状态',
  config_status  VARCHAR(20)      NOT NULL DEFAULT 'Unknown' COMMENT '整体配置状态',
  availability   VARCHAR(20)      NOT NULL DEFAULT 'Unknown' COMMENT '整体可用性状态',
  properties     TEXT             NULL     COMMENT '属性',
  created_at     TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at     TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '更新时间'
);

-- //@UNDO
-- SQL to undo the change goes here.
DROP TABLE IF EXISTS resources;


