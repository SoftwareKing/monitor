-- // create_monitor_servers
-- Migration SQL that makes the change goes here.

CREATE TABLE IF NOT EXISTS t_monitor_servers(
  tid            INT(10) UNSIGNED NOT NULL,
  home           VARCHAR(255)         NULL COMMENT '安装目录',
  pids           VARCHAR(255)         NULL COMMENT '进程ID',
  FOREIGN KEY (tid) REFERENCES resources(id)
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE VIEW monitor_servers AS
  SELECT r.*,
    e.home,
    e.pids
  FROM resources r
    INNER JOIN t_monitor_servers e ON r.id = e.tid;


-- //@UNDO
-- SQL to undo the change goes here.
DROP VIEW IF EXISTS monitor_servers;
DROP TABLE IF EXISTS t_monitor_servers;
