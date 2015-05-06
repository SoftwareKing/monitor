-- // create_monitor_engines
-- Migration SQL that makes the change goes here.

CREATE TABLE IF NOT EXISTS t_monitor_engines(
  tid            INT(10) UNSIGNED NOT NULL,
  home           VARCHAR(255)         NULL COMMENT '安装目录',
  pids           VARCHAR(255)         NULL COMMENT '进程ID',
  name           VARCHAR(50)          NOT  NULL COMMENT 'Path Name',
  engine_id      VARCHAR(255)         NULL COMMENT '引擎ID',
  approve_status VARCHAR(20)          NULL COMMENT '批准状态',
  api_token      VARCHAR(255)         NULL COMMENT '认证Token',
  FOREIGN KEY (tid) REFERENCES resources(id)
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE VIEW monitor_engines AS
  SELECT r.*,
    e.home,
    e.pids,
    e.name,
    e.engine_id,
    e.approve_status,
    e.api_token
  FROM resources r
    INNER JOIN t_monitor_engines e ON r.id = e.tid;


-- //@UNDO
-- SQL to undo the change goes here.
DROP VIEW IF EXISTS monitor_engines;
DROP TABLE IF EXISTS t_monitor_engines;
