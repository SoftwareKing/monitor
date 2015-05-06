-- // create_cpus
-- Migration SQL that makes the change goes here.

CREATE TABLE IF NOT EXISTS t_nics(
  tid            INT(10) UNSIGNED NOT NULL,
  `index`        INT(10)          NOT NULL COMMENT '序号',
  if_type        INT(10)          NOT NULL COMMENT '接口类型',
  address        VARCHAR(255)     NOT NULL COMMENT 'MAC地址',
  speed          BIGINT(10) UNSIGNED  NULL COMMENT '当前带宽',
  mtu            INT(10)              NULL COMMENT '最大包大小',
  admin_status   INT(10)              NULL COMMENT '管理状态',
  `usage`        FLOAT                NULL COMMENT '带宽使用率',
  queue_length   BIGINT(10) UNSIGNED  NULL COMMENT '发送队列大小',
  rx             DOUBLE               NULL COMMENT '入流量',
  tx             DOUBLE               NULL COMMENT '出流量',
  rtx            DOUBLE               NULL COMMENT '总流量',
  in_octets      BIGINT(10)           NULL COMMENT '接收的字节总数',
  out_octets     BIGINT(10)           NULL COMMENT '发送的字节总数',
  total_octets   BIGINT(10)           NULL COMMENT '总的收发字节数',
  in_pkts        BIGINT(10) UNSIGNED  NULL COMMENT '每秒接收的包数',
  in_errs        BIGINT(10) UNSIGNED  NULL COMMENT '每秒接收的错误包数',
  out_pkts       BIGINT(10) UNSIGNED  NULL COMMENT '每秒发出的包数',
  out_errs       BIGINT(10) UNSIGNED  NULL COMMENT '每秒发出的错误包数',
  collisions     BIGINT(10) UNSIGNED  NULL COMMENT '每秒冲突包数',
  FOREIGN KEY (tid) REFERENCES components(id)
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE VIEW nics AS
  SELECT c.*, n.* FROM components c
    INNER JOIN t_nics n ON c.id = n.tid;

-- //@UNDO
-- SQL to undo the change goes here.
DROP VIEW IF EXISTS nics;
DROP TABLE IF EXISTS t_nics;
