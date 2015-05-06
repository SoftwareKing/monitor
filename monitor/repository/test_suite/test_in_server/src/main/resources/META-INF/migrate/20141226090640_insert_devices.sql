-- // insert_devices
-- Migration SQL that makes the change goes here.

INSERT INTO t_devices(tid, description, object_id, up_time, contact, location, addresses) VALUES
  (4, 'device-dev1', 'enterprises.311.1.1.3.1.1',   'long long ago',  'Someone',  'China',
   '[{"ifIndex":"0", "addr":"127.0.0.1", "netMask":"255.0.0.0", "bcastAddr":"true","reasmMaxSize":"65535"},
     {"ifIndex":"11", "addr":"192.168.12.84", "netMask":"255.255.255.0", "bcastAddr":"true","reasmMaxSize":"65535"}]'),
  (5, 'device-dev2', 'enterprises.311.1.1.3.1.1',   'long long ago',  'Another',  'China Shanghai',
   '[{"ifIndex":"0", "addr":"127.0.0.1", "netMask":"255.0.0.0", "bcastAddr":"true","reasmMaxSize":"65535"},
     {"ifIndex":"11", "addr":"192.168.12.253", "netMask":"255.255.255.0", "bcastAddr":"true","reasmMaxSize":"65535"}]'),
  (6, 'device-srv1', '.iso.org.dod.internet.private.enterprises.cisco.products.283',  'long long ago', NULL, NULL,
   '[{"ifIndex":"0", "addr":"127.0.0.1", "netMask":"255.0.0.0", "bcastAddr":"true","reasmMaxSize":"65535"},
     {"ifIndex":"11", "addr":"192.168.12.254", "netMask":"255.255.255.0", "bcastAddr":"true","reasmMaxSize":"65535"}]'),
  (7, 'device-srv2', '.iso.org.dod.internet.private.enterprises.cisco.products.283',  'long long ago', 'Jay', 'GuiLing Rd',
   '[{"ifIndex":"0", "addr":"127.0.0.1", "netMask":"255.0.0.0", "bcastAddr":"true","reasmMaxSize":"65535"},
     {"ifIndex":"11", "addr":"192.168.12.252", "netMask":"255.255.255.0", "bcastAddr":"true","reasmMaxSize":"65535"}]'),
  (8, 'device-WebSphere9', '.iso.org.dod.internet.private.enterprises.cisco.products.283',  'long long ago', 'Jay', 'GuiLing Rd',
   '[{"ifIndex":"0", "addr":"127.0.0.1", "netMask":"255.0.0.0", "bcastAddr":"true","reasmMaxSize":"65535"},
     {"ifIndex":"11", "addr":"172.16.1.22", "netMask":"255.255.255.0", "bcastAddr":"true","reasmMaxSize":"65535"}]'),
  (9, 'device-172.16.21.254', '.iso.org.dod.internet.private.enterprises.cisco.products.283',  'long long ago', 'Jay', 'GuiLing Rd',
   '[{"ifIndex":"0", "addr":"127.0.0.1", "netMask":"255.0.0.0", "bcastAddr":"true","reasmMaxSize":"65535"},
     {"ifIndex":"11", "addr":"172.16.21.254", "netMask":"255.255.255.0", "bcastAddr":"true","reasmMaxSize":"65535"}]'),
  (10, 'device-172.16.1.12', '.iso.org.dod.internet.private.enterprises.cisco.products.283',  'long long ago', 'Jay', 'GuiLing Rd',
   '[{"ifIndex":"0", "addr":"127.0.0.1", "netMask":"255.0.0.0", "bcastAddr":"true","reasmMaxSize":"65535"},
     {"ifIndex":"11", "addr":"172.16.1.12", "netMask":"255.255.255.0", "bcastAddr":"true","reasmMaxSize":"65535"}]'),
  (11, 'device-172.16.31.10', '.iso.org.dod.internet.private.enterprises.cisco.products.283',  'long long ago', 'Jay', 'GuiLing Rd',
   '[{"ifIndex":"0", "addr":"127.0.0.1", "netMask":"255.0.0.0", "bcastAddr":"true","reasmMaxSize":"65535"},
     {"ifIndex":"11", "addr":"172.16.31.10", "netMask":"255.255.255.0", "bcastAddr":"true","reasmMaxSize":"65535"}]');
;


-- //@UNDO
-- SQL to undo the change goes here.
SET foreign_key_checks = 0;
TRUNCATE TABLE t_devices;
SET foreign_key_checks = 1;

