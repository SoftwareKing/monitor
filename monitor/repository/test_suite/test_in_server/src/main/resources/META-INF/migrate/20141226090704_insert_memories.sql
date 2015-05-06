-- // insert_memories
-- Migration SQL that makes the change goes here.

INSERT INTO components (id, resource_id, type, label, performance, config_status, availability) VALUES
  (124,  4, 'dnt.monitor.Memory', '内存', 'Normal', 'Unknown', 'Available'),
  (125,  5, 'dnt.monitor.Memory', '内存', 'Normal', 'Unknown', 'Available'),
  (126,  6, 'dnt.monitor.Memory', '内存', 'Normal', 'Unknown', 'Available'),
  (127,  7, 'dnt.monitor.Memory', '内存', 'Normal', 'Unknown', 'Available');

INSERT INTO t_memories (tid, total, used, free, `usage`, virtual_total, virtual_used, virtual_free, virtual_usage) VALUES
  (124,  12288, 10200, 2088, 0.83, 122880, 10200, 2088, 0.13),
  (125,  65536, 30200, 35088, 0.47, 122880, 10200, 2088, 0.13),
  (126,  32768, 20200, 12088, 0.63, 122880, 10200, 2088, 0.13),
  (127,  32768, 20300, 14088, 0.53, 122880, 10200, 2088, 0.13);

-- //@UNDO
-- SQL to undo the change goes here.

SET foreign_key_checks = 0;
DELETE FROM t_memories WHERE tid BETWEEN 124 AND 127;
DELETE FROM components WHERE id BETWEEN 124 AND 127;
SET foreign_key_checks = 1;
