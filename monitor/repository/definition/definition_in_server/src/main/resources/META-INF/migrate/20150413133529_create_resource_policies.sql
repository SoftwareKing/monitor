-- // create_resource_policies
-- Migration SQL that makes the change goes here.

CREATE TABLE IF NOT EXISTS resource_policies(
  id             INT(10) UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
  label          VARCHAR(255)     NOT NULL COMMENT '显示名称',
  priority       VARCHAR(20)      NULL     COMMENT '优先级',
  enabled        BOOLEAN          NOT NULL COMMENT '是否生效',
  resource_type  VARCHAR(255)     NOT NULL COMMENT '资源类型',
  criteria       VARCHAR(255)     NULL COMMENT '资源选择条件',
  metrics        TEXT             NULL     COMMENT '性能指标策略',
  configs        TEXT             NULL     COMMENT '配置指标策略',
  alarms         TEXT             NULL     COMMENT '告警规则',
  notifications  TEXT             NULL     COMMENT '通知规则',
  actions        TEXT             NULL     COMMENT '动作规则',
  properties     TEXT             NULL     COMMENT '属性',
  created_at     TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at     TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '更新时间'
);



-- //@UNDO
-- SQL to undo the change goes here.
DROP TABLE IF EXISTS resource_policies;


