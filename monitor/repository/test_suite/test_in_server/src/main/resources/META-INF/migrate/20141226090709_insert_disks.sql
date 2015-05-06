-- // insert_disks
-- Migration SQL that makes the change goes here.

INSERT INTO components (id, resource_id, type, label, performance, config_status, availability) VALUES
  (228,  4, 'dnt.monitor.Disk', 'Toshiba HDD',      'Normal', 'Unknown', 'Available'),
  (229,  4, 'dnt.monitor.Disk', 'West Digital HDD', 'Normal', 'Unknown', 'Available'),
  (230,  5, 'dnt.monitor.Disk', 'Toshiba HDD',      'Normal', 'Unknown', 'Available'),
  (231,  5, 'dnt.monitor.Disk', 'West Digital HDD', 'Normal', 'Unknown', 'Available'),
  (232,  6, 'dnt.monitor.Disk', 'West Digital HDD', 'Normal', 'Unknown', 'Available'),
  (233,  6, 'dnt.monitor.Disk', 'Toshiba HDD',      'Normal', 'Unknown', 'Available'),
  (234,  7, 'dnt.monitor.Disk', 'West Digital HDD', 'Normal', 'Unknown', 'Available'),
  (235,  7, 'dnt.monitor.Disk', 'Toshiba HDD',      'Normal', 'Unknown', 'Available');

INSERT INTO t_disks (tid, rps, wps, tps, rbps, wbps, tbps) VALUES
  (228,  12883, 10200, 20188, 8332, 122880, 10200),
  (229,  12883, 10200, 20188, 8332, 122880, 10200),
  (230,  65362, 30200, 35088, 4247, 122880, 10200),
  (231,  65362, 30200, 35088, 4247, 122880, 10200),
  (232,  32283, 20200, 12088, 3263, 122880, 10200),
  (233,  32283, 20200, 12088, 3263, 122880, 10200),
  (234,  32768, 20300, 14088, 3253, 122880, 10200),
  (235,  32768, 20300, 14088, 3253, 122880, 10200);

-- //@UNDO
-- SQL to undo the change goes here.

SET foreign_key_checks = 0;
DELETE FROM t_disks WHERE tid BETWEEN 228 AND 235;
DELETE FROM components WHERE id BETWEEN 228 AND 235;
SET foreign_key_checks = 1;


