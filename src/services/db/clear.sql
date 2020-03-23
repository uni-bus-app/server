use uopbackdb;

DELETE FROM route;
DELETE FROM daterange;
DELETE FROM arrival_daterange;
DELETE FROM arrival;
DELETE FROM arrival_route;
DELETE FROM timetable_stop;
DELETE FROM timetable;
DELETE FROM stop;

ALTER TABLE route AUTO_INCREMENT = 1;
ALTER TABLE daterange AUTO_INCREMENT = 1;
ALTER TABLE arrival_daterange AUTO_INCREMENT = 1;
ALTER TABLE arrival AUTO_INCREMENT = 1;
ALTER TABLE arrival_route AUTO_INCREMENT = 1;
ALTER TABLE timetable_stop AUTO_INCREMENT = 1;
ALTER TABLE timetable AUTO_INCREMENT = 1;
ALTER TABLE stop AUTO_INCREMENT = 1;