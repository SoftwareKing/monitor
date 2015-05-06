-- // insert_partitions
-- Migration SQL that makes the change goes here.

INSERT INTO components (id, resource_id, type, label, performance, config_status, availability) VALUES
  (336,  4, 'dnt.monitor.Partition', '/',        'Normal', 'Unknown', 'Available'),
  (337,  4, 'dnt.monitor.Partition', '/opt',     'Normal', 'Changed', 'Available'),
  (338,  5, 'dnt.monitor.Partition', '/',        'Normal', 'Unknown', 'Available'),
  (339,  5, 'dnt.monitor.Partition', '/u01',     'Normal', 'Changed', 'Available'),
  (340,  6, 'dnt.monitor.Partition', 'System',   'Normal', 'Unknown', 'Available'),
  (341,  6, 'dnt.monitor.Partition', 'Documents','Normal', 'Changed', 'Available'),
  (342,  7, 'dnt.monitor.Partition', 'System',   'Normal', 'Unknown', 'Available'),
  (343,  7, 'dnt.monitor.Partition', 'Documents','Normal', 'Changed', 'Available');

INSERT INTO t_partitions (tid, fs_type, mount_point, total, used, free, `usage`) VALUES
  (336,  'EXT', '/',     201880, 8332, 122880, 0.50),
  (337,  'EXT', '/opt',  201880, 8332, 122880, 0.50),
  (338,  'EXT', '/',     350880, 4247, 122880, 0.50),
  (339,  'EXT', '/u01/', 350880, 4247, 122880, 0.50),
  (340,  'NTFS', 'C:',   120880, 3263, 122880, 0.50),
  (341,  'NTFS', 'D:',   120880, 3263, 122880, 0.50),
  (342,  'NTFS', 'C:',   140880, 3253, 122880, 0.50),
  (343,  'NTFS', 'D:',   140880, 3253, 122880, 0.50);

-- //@UNDO
-- SQL to undo the change goes here.

SET foreign_key_checks = 0;
DELETE FROM t_partitions WHERE tid BETWEEN 336 AND 343;
DELETE FROM components WHERE id BETWEEN 336 AND 343;
SET foreign_key_checks = 1;


