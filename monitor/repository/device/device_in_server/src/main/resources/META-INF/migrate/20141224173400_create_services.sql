-- // create_cpus
-- Migration SQL that makes the change goes here.

CREATE TABLE IF NOT EXISTS t_services(
  tid             INT(10) UNSIGNED NOT NULL,
  port            INT(10) UNSIGNED     NULL COMMENT 'Port',
  FOREIGN KEY (tid) REFERENCES components(id)
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE VIEW services AS
  SELECT c.*, d.* FROM components c
    INNER JOIN t_services d ON c.id = d.tid;

-- //@UNDO
-- SQL to undo the change goes here.
DROP VIEW IF EXISTS services;
DROP TABLE IF EXISTS t_services;
