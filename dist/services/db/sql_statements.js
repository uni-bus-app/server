//#region MySQL Statements
module.exports = {
  // Daterange
  "daterange_add": "INSERT INTO daterange (start_date, end_date, whitelist) VALUES (?, ?, ?);",
  "daterange_edit": "UPDATE daterange SET start_date = ?, end_date = ?, whitelist = ? WHERE id = ?;",
  "daterange_delete": "DELETE FROM daterange WHERE id = ?;",
  // Route
  "route_add": "INSERT INTO route () VALUES ();",
  "route_edit": "UPDATE route SET id = ? WHERE id = ?",
  "route_delete": "DELETE FROM route WHERE id = ?;",
  // ArrivalDaterange
  "arrival_daterange_add": "INSERT INTO arrival_daterange (arrival_id, daterange_id) VALUES (?, ?);",
  "arrival_daterange_edit": "UPDATE arrival_daterange SET arrival_id = ?, daterange_id = ? WHERE (arrival_id = ? AND daterange_id = ?);",
  "arrival_daterange_delete": "DELETE FROM arrival_daterange WHERE (arrival_id = ? AND daterange_id = ?);",
  // ArrivalRoute
  "arrival_route_add": "INSERT INTO arrival_route (arrival_id, route_id) VALUES (?, ?);",
  "arrival_route_edit": "UPDATE arrival_route SET arrival_id = ?, route_id = ? WHERE (arrival_id = ? AND route_id = ?);",
  "arrival_route_delete": "DELETE FROM arrival_route WHERE (arrival_id = ? AND route_id = ?);",
  // Arrival
  "arrival_add": "INSERT INTO arrival (timetable_id, stop_id, scheduled_time, rollover, exception) VALUES (?, ?, ?, ?, ?);",
  "arrival_edit": "UPDATE arrival SET timetable_id = ?, stop_id = ?, scheduled_time = ?, rollover = ?, exception = ? WHERE id = ?;",
  "arrival_delete": "DELETE FROM arrival WHERE id = ?;",
  // Timetable
  "timetable_add": "INSERT INTO timetable (title) VALUES (?);",
  "timetable_edit": "UPDATE timetable SET title = ? WHERE id = ?;",
  "timetable_delete": "DELETE FROM timetable WHERE id = (?);",
  // TimetableStop
  "timetable_stop_add": "INSERT INTO timetable_stop (timetable_id, stop_id) VALUES (?, ?);",
  "timetable_stop_edit": "UPDATE timetable_stop SET timetable_id = ?, stop_id = ? WHERE (timetable_id = ? AND stop_id = ?);",
  "timetable_stop_delete": "DELETE FROM timetable_stop WHERE (timetable_id = ? AND stop_id = ?);",
  // Stop
  "stop_add": "INSERT INTO stop (title, place) VALUES (?, ?);",
  "stop_edit": "UPDATE stop SET title = ?, place = ? WHERE id = ?;",
  "stop_delete": "DELETE FROM stop WHERE id = ?;",
  // Get ID from via field
  "get_timetable": "SELECT id FROM timetable WHERE title = ?",
  "get_stop": "SELECT id FROM stop WHERE title = ?",
  // Single Table Queries
  "get_timetables": "SELECT id, title FROM timetable;",
  "get_stops": "SELECT id, title, place FROM stop;",
  "get_timetable_stops": "SELECT * FROM timetable_stop;",
  "get_arrivals": "SELECT id, timetable_id, stop_id, scheduled_time, exception FROM arrival;",
  "get_dateranges": "SELECT id, start_date, end_date, whitelist FROM daterange;",
  "get_arrival_dateranges": "SELECT * FROM arrival_daterange;",
  "get_routes": "SELECT id FROM route;",
  "get_arrival_routes": "SELECT * FROM arrival_route;",
  "get_arrival_count": "SELECT COUNT(*) FROM arrival;",
  "get_timetable_count": "SELECT COUNT(*) FROM timetable;",
  "get_stop_count": "SELECT COUNT(*) FROM stop;",
  "get_daterange_count": "SELECT COUNT(*) FROM daterange;",
  "get_route_count": "SELECT COUNT(*) FROM route;",
  "get_fields": "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name = ?",
  // Multi Table Queries
  "get_timetable_stops": "SELECT title, place FROM stop as data LEFT JOIN timetable_stop as LOL ON (data.id = LOL.stop_id) WHERE timetable_id = ?",
  "get_timetable_arrivals": "SELECT arrival.scheduled_time FROM arrival WHERE (timetable_id = ?) ORDER BY stop_id;",
  "get_timetable_stop_arrivals": "SELECT arrival.scheduled_time FROM arrival WHERE (timetable_id = ? AND stop_id = ?);"
}; //#endregion