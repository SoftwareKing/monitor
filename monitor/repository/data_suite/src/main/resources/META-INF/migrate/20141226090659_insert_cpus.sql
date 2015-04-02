-- // insert_cpus
-- Migration SQL that makes the change goes here.

INSERT INTO components (id, resource_id, type, label, keyed, performance, config_status, availability) VALUES
  (1,  4, 'dnt.monitor.CPU', '总CPU', TRUE, 'Normal', 'Unknown',   'Available'),
  (2,  4, 'dnt.monitor.CPU', 'CPU-1', FALSE,'Normal', 'Unknown',  'Available'),
  (3,  4, 'dnt.monitor.CPU', 'CPU-2', FALSE,'Normal', 'Unknown',  'Available'),
  (4,  4, 'dnt.monitor.CPU', 'CPU-3', FALSE,'Normal', 'Unknown',  'Available'),
  (5,  4, 'dnt.monitor.CPU', 'CPU-4', FALSE,'Normal', 'Unknown',  'Available'),

  (6,  5, 'dnt.monitor.CPU', '总CPU', TRUE, 'Normal', 'Unknown',   'Available'),
  (7,  5, 'dnt.monitor.CPU', 'CPU-1', FALSE,'Normal', 'Unknown',  'Available'),
  (8,  5, 'dnt.monitor.CPU', 'CPU-2', FALSE,'Normal', 'Unknown',  'Available'),
  (9,  5, 'dnt.monitor.CPU', 'CPU-3', FALSE,'Normal', 'Unknown',  'Available'),
  (10, 5, 'dnt.monitor.CPU', 'CPU-4', FALSE,'Normal', 'Unknown',  'Available'),
  (11, 5, 'dnt.monitor.CPU', 'CPU-5', FALSE,'Normal', 'Unknown',  'Available'),
  (12, 5, 'dnt.monitor.CPU', 'CPU-6', FALSE,'Normal', 'Unknown',  'Available'),
  (13, 5, 'dnt.monitor.CPU', 'CPU-7', FALSE,'Normal', 'Unknown',  'Available'),
  (14, 5, 'dnt.monitor.CPU', 'CPU-8', FALSE,'Normal', 'Unknown',  'Available'),

  (15, 6, 'dnt.monitor.CPU', '总CPU', TRUE, 'Normal', 'Unknown',   'Available'),
  (16, 6, 'dnt.monitor.CPU', 'CPU-1', FALSE,'Normal', 'Unknown',  'Available'),
  (17, 6, 'dnt.monitor.CPU', 'CPU-2', FALSE,'Normal', 'Unknown',  'Available'),
  (18, 6, 'dnt.monitor.CPU', 'CPU-3', FALSE,'Normal', 'Unknown',  'Available'),
  (19, 6, 'dnt.monitor.CPU', 'CPU-4', FALSE,'Normal', 'Unknown',  'Available'),
  (20, 6, 'dnt.monitor.CPU', 'CPU-5', FALSE,'Normal', 'Unknown',  'Available'),
  (21, 6, 'dnt.monitor.CPU', 'CPU-6', FALSE,'Normal', 'Unknown',  'Available'),
  (22, 6, 'dnt.monitor.CPU', 'CPU-7', FALSE,'Normal', 'Unknown',  'Available'),
  (23, 6, 'dnt.monitor.CPU', 'CPU-8', FALSE,'Normal', 'Unknown',  'Available'),

  (24, 7, 'dnt.monitor.CPU', '总CPU', TRUE, 'Normal', 'Unknown',   'Available'),
  (25, 7, 'dnt.monitor.CPU', 'CPU-1', FALSE,'Normal', 'Unknown',  'Available'),
  (26, 7, 'dnt.monitor.CPU', 'CPU-2', FALSE,'Normal', 'Unknown',  'Available'),
  (27, 7, 'dnt.monitor.CPU', 'CPU-3', FALSE,'Normal', 'Unknown',  'Available'),
  (28, 7, 'dnt.monitor.CPU', 'CPU-4', FALSE,'Normal', 'Unknown',  'Available'),
  (29, 7, 'dnt.monitor.CPU', 'CPU-5', FALSE,'Normal', 'Unknown',  'Available'),
  (30, 7, 'dnt.monitor.CPU', 'CPU-6', FALSE,'Normal', 'Unknown',  'Available'),
  (31, 7, 'dnt.monitor.CPU', 'CPU-7', FALSE,'Normal', 'Unknown',  'Available'),
  (32, 7, 'dnt.monitor.CPU', 'CPU-8', FALSE,'Normal', 'Unknown',  'Available'),
  (33, 7, 'dnt.monitor.CPU', 'CPU-9', FALSE,'Normal', 'Unknown',  'Available'),
  (34, 7, 'dnt.monitor.CPU', 'CPU-10',FALSE, 'Normal', 'Unknown', 'Available'),
  (35, 7, 'dnt.monitor.CPU', 'CPU-11',FALSE, 'Normal', 'Unknown', 'Available'),
  (36, 7, 'dnt.monitor.CPU', 'CPU-12',FALSE, 'Normal', 'Unknown', 'Available');

INSERT INTO t_cpus(tid, idx, model_name, frequency, `usage`, usr_usage, sys_usage, idle, io_wait) VALUES
  (1,  0, 'QEMU Virtual CPU version 2.0.0', 2533.42, 0.47, 0.31, 0.16, 0.51, 0.17),
  (2,  1, 'QEMU Virtual CPU version 2.0.0', 2533.42, 0.32, 0.16, 0.16, 0.68, 0.17),
  (3,  2, 'QEMU Virtual CPU version 2.0.0', 2533.42, 0.42, 0.26, 0.16, 0.58, 0.17),
  (4,  3, 'QEMU Virtual CPU version 2.0.0', 2533.42, 0.53, 0.36, 0.17, 0.47, 0.17),
  (5,  4, 'QEMU Virtual CPU version 2.0.0', 2533.42, 0.62, 0.46, 0.16, 0.38, 0.17),

  (6,  0, 'QEMU Virtual CPU version 2.0.0', 2533.42, 0.47, 0.31, 0.16, 0.51, 0.17),
  (7,  1, 'QEMU Virtual CPU version 2.0.0', 2533.42, 0.32, 0.16, 0.16, 0.68, 0.17),
  (8,  2, 'QEMU Virtual CPU version 2.0.0', 2533.42, 0.42, 0.26, 0.16, 0.58, 0.17),
  (9,  3, 'QEMU Virtual CPU version 2.0.0', 2533.42, 0.53, 0.36, 0.17, 0.47, 0.17),
  (10, 4, 'QEMU Virtual CPU version 2.0.0', 2533.42, 0.62, 0.46, 0.16, 0.38, 0.17),
  (11, 5, 'QEMU Virtual CPU version 2.0.0', 2533.42, 0.32, 0.16, 0.16, 0.68, 0.17),
  (12, 6, 'QEMU Virtual CPU version 2.0.0', 2533.42, 0.42, 0.26, 0.16, 0.58, 0.17),
  (13, 7, 'QEMU Virtual CPU version 2.0.0', 2533.42, 0.53, 0.36, 0.17, 0.47, 0.17),
  (14, 8, 'QEMU Virtual CPU version 2.0.0', 2533.42, 0.62, 0.46, 0.16, 0.38, 0.17),

  (15, 0, 'Intel Core I5', 2486.13, 0.47, 0.31, 0.16, 0.51, 0.17),
  (16, 1, 'Intel Core I5', 2486.13, 0.32, 0.16, 0.16, 0.68, 0.17),
  (17, 2, 'Intel Core I5', 2486.13, 0.42, 0.26, 0.16, 0.58, 0.17),
  (18, 3, 'Intel Core I5', 2486.13, 0.53, 0.36, 0.17, 0.47, 0.17),
  (19, 4, 'Intel Core I5', 2486.13, 0.62, 0.46, 0.16, 0.38, 0.17),
  (20, 5, 'Intel Core I5', 2486.13, 0.32, 0.16, 0.16, 0.68, 0.17),
  (21, 6, 'Intel Core I5', 2486.13, 0.42, 0.26, 0.16, 0.58, 0.17),
  (22, 7, 'Intel Core I5', 2486.13, 0.53, 0.36, 0.17, 0.47, 0.17),
  (23, 8, 'Intel Core I5', 2486.13, 0.62, 0.46, 0.16, 0.38, 0.17),

  (24, 0, 'Intel Core I5', 2486.13, 0.47, 0.31, 0.16, 0.51, 0.17),
  (25, 1, 'Intel Core I5', 2486.13, 0.32, 0.16, 0.16, 0.68, 0.17),
  (26, 2, 'Intel Core I5', 2486.13, 0.42, 0.26, 0.16, 0.58, 0.17),
  (27, 3, 'Intel Core I5', 2486.13, 0.53, 0.36, 0.17, 0.47, 0.17),
  (28, 4, 'Intel Core I5', 2486.13, 0.62, 0.46, 0.16, 0.38, 0.17),
  (29, 5, 'Intel Core I5', 2486.13, 0.32, 0.16, 0.16, 0.68, 0.17),
  (30, 6, 'Intel Core I5', 2486.13, 0.42, 0.26, 0.16, 0.58, 0.17),
  (31, 7, 'Intel Core I5', 2486.13, 0.53, 0.36, 0.17, 0.47, 0.17),
  (32, 8, 'Intel Core I5', 2486.13, 0.62, 0.46, 0.16, 0.38, 0.17),
  (33, 9, 'Intel Core I5', 2486.13, 0.42, 0.26, 0.16, 0.58, 0.17),
  (34, 10,'Intel Core I5', 2486.13, 0.53, 0.36, 0.17, 0.47, 0.17),
  (35, 11,'Intel Core I5', 2486.13, 0.62, 0.46, 0.16, 0.38, 0.17),
  (36, 12,'Intel Core I5', 2486.13, 0.32, 0.16, 0.16, 0.68, 0.17);


-- //@UNDO
-- SQL to undo the change goes here.
SET foreign_key_checks = 0;
DELETE FROM t_cpus WHERE tid BETWEEN 1 AND 36;
DELETE FROM components WHERE id BETWEEN 1 AND 36;
SET foreign_key_checks = 1;

