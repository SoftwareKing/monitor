-- // create_cpus
-- Migration SQL that makes the change goes here.

CREATE TABLE IF NOT EXISTS t_disks(
  tid             INT(10) UNSIGNED NOT NULL,
  rps            INT(10) UNSIGNED     NULL COMMENT '每秒读次数',
  wps            INT(10) UNSIGNED     NULL COMMENT '每秒写次数',
  tps            INT(10) UNSIGNED     NULL COMMENT '每秒传输次数',
  rbps           INT(10) UNSIGNED     NULL COMMENT '每秒读字节',
  wbps           INT(10) UNSIGNED     NULL COMMENT '每秒写字节',
  tbps           INT(10) UNSIGNED     NULL COMMENT '每秒传输字节',
  FOREIGN KEY (tid) REFERENCES components(id)
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE VIEW disks AS
  SELECT c.*, d.* FROM components c
    INNER JOIN t_disks d ON c.id = d.tid;

-- //@UNDO
-- SQL to undo the change goes here.
DROP VIEW IF EXISTS disks;
DROP TABLE IF EXISTS t_disks;
