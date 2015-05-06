-- // create_windows_view
-- Migration SQL that makes the change goes here.

CREATE VIEW windows AS
  SELECT h.* FROM hosts h
    WHERE LOCATE('/device/host/windows', h.type) = 1;


-- //@UNDO
-- SQL to undo the change goes here.

DROP VIEW IF EXISTS windows;
