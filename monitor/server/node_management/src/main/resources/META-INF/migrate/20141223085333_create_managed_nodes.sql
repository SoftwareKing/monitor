-- // create_managed_nodes
-- Migration SQL that makes the change goes here.

CREATE TABLE IF NOT EXISTS managed_nodes(
  id              INT(10) UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
  type            VARCHAR(20)      NOT NULL COMMENT '类型',
  path            VARCHAR(255)     NOT NULL COMMENT '路径',
  depth           INT(10) UNSIGNED NOT NULL COMMENT '深度',
  group_size      INT(10) UNSIGNED NOT NULL DEFAULT 0 COMMENT '直接群组子节点数量',
  resource_size   INT(10) UNSIGNED NOT NULL DEFAULT 0 COMMENT '直接资源子节点数量',
  label           VARCHAR(255)     NOT NULL COMMENT '名称',
  icon            VARCHAR(255)     NULL     COMMENT '图标',
  resource_id     INT(10) UNSIGNED NULL     COMMENT '资源ID',
  resource_type   VARCHAR(255)     NULL     COMMENT '资源类型',
  `range`         TEXT             NULL     COMMENT '范围',
  properties      TEXT             NULL     COMMENT '属性',
  comment         TEXT             NULL     COMMENT '注释',
  state           VARCHAR(20)      NULL     COMMENT '监控状态',
  priority        VARCHAR(20)      NULL     COMMENT '优先级',
  location        VARCHAR(255)     NULL     COMMENT '位置',
  organization    VARCHAR(255)     NULL     COMMENT '组织',
  frequency       VARCHAR(50)      NULL     COMMENT '监控频度',
  schedule        VARCHAR(255)     NULL     COMMENT '监控计划',
  maintain_window VARCHAR(255)     NULL     COMMENT '维护时间',
  credentials     TEXT             NULL     COMMENT '认证信息',
  created_at      TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at      TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '更新时间',
  UNIQUE KEY (path)
);


-- //@UNDO
-- SQL to undo the change goes here.
DROP TABLE IF EXISTS managed_nodes;

