-- // insert_nics
-- Migration SQL that makes the change goes here.

INSERT INTO components (id, resource_id, type, label, performance, config_status, availability) VALUES
  (444,  4, 'dnt.monitor.NIC', 'Realtek 3021', 'Normal', 'Unknown', 'Available'),
  (445,  5, 'dnt.monitor.NIC', 'Realtek 3021', 'Normal', 'Changed', 'Available'),
  (446,  6, 'dnt.monitor.NIC', 'Common NIC',   'Normal', 'Unknown', 'Available'),
  (447,  7, 'dnt.monitor.NIC', 'Common NIC',   'Normal', 'Changed', 'Available');

INSERT INTO t_nics (tid, `index`, if_type, address, speed, mtu, admin_status, `usage`, queue_length, rx, tx, rtx,
                    in_octets, out_octets, total_octets, in_pkts, in_errs, out_pkts, out_errs, collisions) VALUES
  (444, 0, 1,  '00:11:22:33:44:55', 1020000, 1500, 1, 0.83, 122880, 1120, 2188, 3232, 1120, 2188, 3232, 13, 14, 15, 16, 1),
  (445, 1, 1,  '11:22:33:44:55:66', 3020000, 1500, 1, 0.47, 132880, 1220, 2288, 3232, 1220, 2288, 3232, 13, 14, 15, 16, 1),
  (446, 2, 1,  '22:33:44:55:66:77', 2020000, 1500, 1, 0.63, 142880, 1320, 2388, 3232, 1320, 2388, 3232, 13, 14, 15, 16, 1),
  (447, 3, 1,  '33:44:55:66:77:88', 2030000, 1500, 0, 0.53, 152880, 1420, 2488, 3232, 1420, 2488, 3232, 13, 14, 15, 16, 1);

-- //@UNDO
-- SQL to undo the change goes here.

SET foreign_key_checks = 0;
DELETE FROM t_nics WHERE tid BETWEEN 444 AND 447;
DELETE FROM components WHERE id BETWEEN 444 AND 447;
SET foreign_key_checks = 1;
