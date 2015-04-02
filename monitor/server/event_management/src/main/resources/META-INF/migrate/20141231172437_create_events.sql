-- // create_events
-- Migration SQL that makes the change goes here.

CREATE TABLE IF NOT EXISTS events(
  id             INT(10) UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
  path           VARCHAR(255)     NOT NULL COMMENT '路径',
  priority       TINYINT          NOT NULL COMMENT  '优先级',
  severity       TINYINT          NOT NULL COMMENT '级别',
  content        TEXT             NULL     COMMENT '事件内容',
  ack            TINYINT          NOT NULL DEFAULT 0 COMMENT '事件状态',
  created_at     TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '发生时间',
  updated_at     TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '更新时间'
);


-- //@UNDO
-- SQL to undo the change goes here.

DROP TABLE IF EXISTS events;


