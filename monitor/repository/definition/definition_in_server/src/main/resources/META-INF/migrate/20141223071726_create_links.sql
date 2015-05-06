-- // create_links
-- Migration SQL that makes the change goes here.

CREATE TABLE IF NOT EXISTS links(
  id             INT(10) UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
  from_id        INT(10) UNSIGNED NOT NULL COMMENT '源对象ID',
  to_id          INT(10) UNSIGNED NOT NULL COMMENT '目标对象ID',
  type           VARCHAR(255)     NOT NULL COMMENT '链路类型',
  label          VARCHAR(255)     NOT NULL COMMENT '显示名称',
  performance    VARCHAR(20)      NOT NULL DEFAULT 'Unknown' COMMENT '链路性能状态',
  config_status  VARCHAR(20)      NOT NULL DEFAULT 'Unknown' COMMENT '链路配置状态',
  availability   VARCHAR(20)      NOT NULL DEFAULT 'Unknown' COMMENT '链路可用性状态',
  properties     TEXT             NULL     COMMENT '属性',
  created_at     TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at     TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '更新时间',
  FOREIGN KEY (from_id) REFERENCES resources(id) ON DELETE CASCADE ,
  FOREIGN KEY (to_id) REFERENCES resources(id) ON DELETE CASCADE
);

-- //@UNDO
-- SQL to undo the change goes here.
DROP TABLE IF EXISTS links;


