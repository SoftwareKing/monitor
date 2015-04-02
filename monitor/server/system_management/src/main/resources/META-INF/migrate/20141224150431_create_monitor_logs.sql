-- // create_monitor_logs
-- Migration SQL that makes the change goes here.

CREATE TABLE IF NOT EXISTS monitor_logs(
  id             INT(10) UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
  path           VARCHAR(255)     NOT NULL COMMENT '路径',
  severity       TINYINT          NOT NULL COMMENT '级别',
  content        TEXT             NULL     COMMENT '日志内容',
  created_at     TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '发生时间',
  updated_at     TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '更新时间'
);


-- //@UNDO
-- SQL to undo the change goes here.

DROP TABLE IF EXISTS monitor_logs;

