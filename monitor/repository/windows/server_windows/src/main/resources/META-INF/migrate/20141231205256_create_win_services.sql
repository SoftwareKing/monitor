-- // create_win_services
-- Migration SQL that makes the change goes here.
-- Migration SQL that makes the change goes here.

CREATE TABLE IF NOT EXISTS t_win_services(
  tid            INT(10) UNSIGNED NOT NULL,
  policy         VARCHAR(50)      NOT NULL COMMENT '启动策略',
  status         VARCHAR(50)      NOT NULL COMMENT '服务状态',
  description    VARCHAR(255)         NULL COMMENT '服务描述',
  FOREIGN KEY (tid) REFERENCES components(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE VIEW win_services AS
  SELECT c.*, ws.* FROM components c
    INNER JOIN t_win_services ws ON c.id = ws.tid;

-- //@UNDO
-- SQL to undo the change goes here.
DROP VIEW IF EXISTS win_services;
DROP TABLE IF EXISTS t_win_services;
