-- // create_switches
-- Migration SQL that makes the change goes here.

CREATE TABLE IF NOT EXISTS t_switches(
  tid            INT(10) UNSIGNED NOT NULL,
-- Switch Properties
  cdp_entries    LONGTEXT             NULL COMMENT 'CDP相邻表',
  FOREIGN KEY (tid) REFERENCES resources(id)
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE VIEW switches AS
  SELECT d.*,
    s.cdp_entries
  FROM devices d
    INNER JOIN t_switches s ON d.id = s.tid;


-- //@UNDO
-- SQL to undo the change goes here.

DROP VIEW IF EXISTS switches;
DROP TABLE IF EXISTS t_switches;

