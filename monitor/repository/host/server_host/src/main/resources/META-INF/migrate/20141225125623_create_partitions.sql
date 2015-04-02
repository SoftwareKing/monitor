-- // create_cpus
-- Migration SQL that makes the change goes here.

CREATE TABLE IF NOT EXISTS t_partitions(
  tid             INT(10) UNSIGNED NOT NULL,
  fs_type        VARCHAR(255)         NULL COMMENT '文件系统类型',
  mount_point    VARCHAR(255)         NULL COMMENT '挂载点',
  total          INT(10) UNSIGNED     NULL COMMENT '总大小',
  used           INT(10) UNSIGNED     NULL COMMENT '已使用大小',
  free           INT(10) UNSIGNED     NULL COMMENT '可用大小',
  `usage`        FLOAT                NULL COMMENT '使用率',
  FOREIGN KEY (tid) REFERENCES components(id)
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE VIEW partitions AS
  SELECT c.*, p.* FROM components c
    INNER JOIN t_partitions p ON c.id = p.tid;

-- //@UNDO
-- SQL to undo the change goes here.
DROP VIEW IF EXISTS partitions;
DROP TABLE IF EXISTS t_partitions;
