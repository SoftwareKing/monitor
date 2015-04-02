-- // create_cpus
-- Migration SQL that makes the change goes here.

CREATE TABLE IF NOT EXISTS t_cpus(
  tid             INT(10) UNSIGNED NOT NULL,
  idx            INT(10) UNSIGNED NOT NULL COMMENT 'CPU序号',
  model_name     VARCHAR(255)         NULL COMMENT '型号',
  frequency      FLOAT                NULL COMMENT '主频率',
  `usage`        FLOAT                NULL COMMENT '总CPU使用率',
  usr_usage      FLOAT                NULL COMMENT '用户使用率',
  sys_usage      FLOAT                NULL COMMENT '系统使用率',
  idle           FLOAT                NULL COMMENT '空闲率',
  io_wait        FLOAT                NULL COMMENT 'IO等待率',
  FOREIGN KEY (tid) REFERENCES components(id)
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE VIEW cpus AS
  SELECT c.*,
    cpu.idx,
    cpu.model_name,
    cpu.frequency,
    cpu.usage,
    cpu.usr_usage,
    cpu.sys_usage,
    cpu.idle,
    cpu.io_wait
  FROM components c
    INNER JOIN t_cpus cpu ON c.id = cpu.tid;

CREATE VIEW total_cpus AS
  SELECT * FROM cpus cpu
WHERE cpu.idx = 0;

CREATE VIEW real_cpus AS
  SELECT * FROM cpus cpu
WHERE cpu.idx > 0;

-- //@UNDO
-- SQL to undo the change goes here.
DROP VIEW IF EXISTS real_cpus;
DROP VIEW IF EXISTS total_cpus;
DROP VIEW IF EXISTS cpus;
DROP TABLE IF EXISTS t_cpus;
