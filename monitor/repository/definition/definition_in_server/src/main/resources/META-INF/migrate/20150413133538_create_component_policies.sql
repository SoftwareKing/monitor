-- // create_component_policies
-- Migration SQL that makes the change goes here.

CREATE TABLE IF NOT EXISTS component_policies(
  id                 INT(10) UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
  resource_policy_id INT(10) UNSIGNED NOT NULL COMMENT '资源策略ID',
  field_name         VARCHAR(50)      NOT NULL COMMENT '字段名',
  criteria           VARCHAR(255)     NULL     COMMENT '组件实例的选择/过滤条件',
  frequency          VARCHAR(20)      NULL     COMMENT '监控频度',
  state              VARCHAR(20)      NULL     COMMENT '监控状态',
  keyed              BOOLEAN          NOT NULL DEFAULT FALSE COMMENT '是否关键',
  metrics            TEXT             NULL     COMMENT '性能指标策略',
  configs            TEXT             NULL     COMMENT '配置指标策略',
  properties         TEXT             NULL     COMMENT '属性',
  created_at         TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at         TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '更新时间'
);



-- //@UNDO
-- SQL to undo the change goes here.

DROP TABLE IF EXISTS component_policies;

