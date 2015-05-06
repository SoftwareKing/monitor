-- // create_cpus
-- Migration SQL that makes the change goes here.

CREATE TABLE IF NOT EXISTS t_memories(
  tid             INT(10) UNSIGNED NOT NULL,
  total          INT(10) UNSIGNED     NULL COMMENT '物理内存总大小',
  used           INT(10) UNSIGNED     NULL COMMENT '物理内存使用大小',
  free           INT(10) UNSIGNED     NULL COMMENT '物理内存可用大小',
  `usage`        FLOAT                NULL COMMENT '物理内存使用率',
  virtual_total  INT(10) UNSIGNED     NULL COMMENT '虚拟内存总大小',
  virtual_used   INT(10) UNSIGNED     NULL COMMENT '虚拟内存使用大小',
  virtual_free   INT(10) UNSIGNED     NULL COMMENT '虚拟内存可用大小',
  virtual_usage  FLOAT                NULL COMMENT '虚拟内存使用率',
  FOREIGN KEY (tid) REFERENCES components(id)
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE VIEW memories AS
  SELECT c.*,
    m.total,
    m.used,
    m.free,
    m.usage,
    m.virtual_total,
    m.virtual_used,
    m.virtual_free,
    m.virtual_usage
  FROM components c
    INNER JOIN t_memories m ON c.id = m.tid;

-- //@UNDO
-- SQL to undo the change goes here.
DROP VIEW IF EXISTS memories;
DROP TABLE IF EXISTS t_memories;
