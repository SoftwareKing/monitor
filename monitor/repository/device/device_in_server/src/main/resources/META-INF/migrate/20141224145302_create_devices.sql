-- // create_devices
-- Migration SQL that makes the change goes here.

CREATE TABLE IF NOT EXISTS t_devices(
  tid            INT(10) UNSIGNED NOT NULL,
-- Device Properties(SystemInfo)
  description    TEXT                 NULL COMMENT '描述',
  object_id      VARCHAR(255)         NULL COMMENT 'SNMP类型标识',
  up_time        VARCHAR(255)         NULL COMMENT '运行时间',
  contact        VARCHAR(255)         NULL COMMENT '联系人',
  location       VARCHAR(255)         NULL COMMENT '位置',
  addresses      LONGTEXT             NULL COMMENT 'IP地址表',
  arp_entries    LONGTEXT             NULL COMMENT 'ARP表',
  route_entries  LONGTEXT             NULL COMMENT '路由表',
  tcp_entries    LONGTEXT             NULL COMMENT 'TCP连接表',
  udp_entries    LONGTEXT             NULL COMMENT 'UDP连接表',
  FOREIGN KEY (tid) REFERENCES resources(id)
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE VIEW devices AS
  SELECT r.*,
    d.description,
    d.object_id,
    d.up_time,
    d.contact,
    d.location,
    d.addresses,
    d.arp_entries,
    d.route_entries,
    d.tcp_entries,
    d.udp_entries
  FROM resources r
    INNER JOIN t_devices d ON r.id = d.tid;


-- //@UNDO
-- SQL to undo the change goes here.
DROP VIEW IF EXISTS devices;
DROP TABLE IF EXISTS t_devices;
