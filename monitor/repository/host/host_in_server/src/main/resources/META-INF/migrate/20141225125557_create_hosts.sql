-- // create_hosts
-- Migration SQL that makes the change goes here.

CREATE TABLE IF NOT EXISTS t_hosts(
  tid            INT(10) UNSIGNED NOT NULL,
  hostname       VARCHAR(255)         NULL COMMENT '主机名',
  domain         VARCHAR(255)         NULL COMMENT '域',
  manufacturer   VARCHAR(255)         NULL COMMENT '厂商',
  model_name     VARCHAR(255)         NULL COMMENT '型号',
  os             VARCHAR(255)         NULL COMMENT '操作系统',
  version        VARCHAR(255)         NULL COMMENT '操作系统版本',
  serial_number  VARCHAR(255)         NULL COMMENT '序列号',
  cpu_count      INT(10) UNSIGNED     NULL COMMENT '逻辑CPU总数',
  process_count  INT(10) UNSIGNED     NULL COMMENT '进程数量',
  start_at       DATETIME             NULL COMMENT '启动时间',
  local_time     DATETIME             NULL COMMENT '本机时间',
  FOREIGN KEY (tid) REFERENCES resources(id)
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE VIEW hosts AS
  SELECT d.*,
    h.hostname,
    h.domain,
    h.manufacturer,
    h.model_name,
    h.os,
    h.version,
    h.serial_number,
    h.cpu_count,
    h.process_count,
    h.start_at,
    h.local_time
  FROM devices d
    INNER JOIN t_hosts h ON d.id = h.tid;


-- //@UNDO
-- SQL to undo the change goes here.
DROP VIEW IF EXISTS hosts;
DROP TABLE IF EXISTS t_hosts;
