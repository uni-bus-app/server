const mysql = require('mysql');
const uopdf = require('../../../../UoPDF');
const uopdates = require('../../../../UoPDates');
const moment = require('moment');
const SQL_STATEMENTS = require('./sql_statements.js');

module.exports = class UoPBackDB {
	constructor(options) {
    this.con = mysql.createConnection(options);
    // this.con.connect(err => console.log(err));
	}
	query(sql, params=[], callback=null) {
		if (callback === null) {
		  this.con.query(sql, params, (err, results, fields) => {
		    // console.log(sql, results, '\n\n\n');
		  });
		} else {
		  this.con.query(sql, params, callback);
		}
	}
	test_query(table, sql, params=[]) {
		this.query(sql, params);
		this.query(SQL_STATEMENTS[`get_${table}s`]);
	}
	get_arrivals(query, callback) {
		if (query) {
			if (query.timetable && query.stop) {
				this.query(SQL_STATEMENTS[`get_timetable_stop_arrivals`], [query.timetable, query.stop], (err, results, fields) => {
				  console.log('get_timetable_stop_arrivals', query);
				  let data = results;
				  let JSONdata = JSON.stringify(data);
				  callback(JSONdata);
				});
			} else if (query.timetable) {
				 this.query(SQL_STATEMENTS[`get_timetable_arrivals`], [query.timetable], (err, results, fields) => {
				  console.log('get_timetable_arrivals', query);
				  let data = results;
				  let JSONdata = JSON.stringify(data);
				  callback(JSONdata);
				});
			} else {
				this.query(SQL_STATEMENTS[`get_arrivals`], (err, results, fields) => {
				  console.log('get_arrivals', query);
				  let data = results;
				  let JSONdata = JSON.stringify(data);
				  callback(JSONdata);
				});
			}
		}
	}
	get_timetables(query, callback) {
		if (query) {
		  this.query(SQL_STATEMENTS[`get_timetables`], (err, results, fields) => {
		    let data = results;
		    let JSONdata = JSON.stringify(data);
		    callback(JSONdata);
		  });
		}
	}
	get_stops(query, callback) {
		if (query.timetable) {
		  this.query(SQL_STATEMENTS[`get_timetable_stops`], [query.timetable], (err, results, fields) => {
		    let data = results;
		    let JSONdata = JSON.stringify(data);
				callback(JSONdata);
		  });
		} else {
		  this.query(SQL_STATEMENTS[`get_stops`], (err, results, fields) => {
		    let data = results;
		    let JSONdata = JSON.stringify(data);
				callback(JSONdata);
		  });
		}
	}
	get_dateranges(query, callback) {
		if (query) {
		  this.query(SQL_STATEMENTS[`get_dateranges`], (err, results, fields) => {
		    let data = results;
		    let JSONdata = JSON.stringify(data);
				callback(JSONdata);
		  });
		}
	}
	get_fields(query, callback) {
		if (query.table) {
		  this.query(SQL_STATEMENTS[`get_fields`], [query.table], (err, results, fields) => {
		    if (err) console.log(err);
		    let data = results;
		    let JSONdata = JSON.stringify(data);
				callback(JSONdata);
		  })
		}
	}
	get_count(query, callback) {
		if (query.table) {
		  this.query(SQL_STATEMENTS[`get_${req.query.table}_count`], [query.table], (err, results, fields) => {
		    let data = results;
		    let JSONdata = JSON.stringify(data);
				callback(JSONdata);
		  });
		}
	}

//#region Test Insert Statements
test_insert_statements() {
  this.test_query('timetable',         SQL_STATEMENTS['timetable_add'], ['U1']);
  this.test_query('timetable',         SQL_STATEMENTS['timetable_add'], ['U2']);
  this.test_query('stop',              SQL_STATEMENTS['stop_add'], [
                                    'University of Portsmouth',
                                    '#1'
                                  ]);
  this.test_query('stop',              SQL_STATEMENTS['stop_add'], [
                                    'Elm Grove',
                                    '#2'
                                  ]);
  this.test_query('arrival',           SQL_STATEMENTS['arrival_add'], [
                                    1,
                                    1,
                                    '1234',
                                    true,
                                    'exception'
                                  ]);
  this.test_query('arrival',           SQL_STATEMENTS['arrival_add'], [
                                    2,
                                    1,
                                    '2345',
                                    false,
                                    'collection only'
                                  ]);
  this.test_query('daterange',         SQL_STATEMENTS['daterange_add'],
                                  [
                                    '2020/02/01',
                                    '2020/01/01',
                                    true
                                  ]);
  this.test_query('daterange',         SQL_STATEMENTS['daterange_add'],
                                  [
                                    '2020/03/01',
                                    '2020/02/01',
                                    false
                                  ]);
  this.test_query('route',             SQL_STATEMENTS['route_add'], []);
  this.test_query('route',             SQL_STATEMENTS['route_add'], []);
  this.test_query('timetable_stop',    SQL_STATEMENTS['timetable_stop_add'], [1, 1]);
  this.test_query('timetable_stop',    SQL_STATEMENTS['timetable_stop_add'], [2, 2]);
  this.test_query('arrival_route',     SQL_STATEMENTS['arrival_route_add'], [1, 1]);
  this.test_query('arrival_route',     SQL_STATEMENTS['arrival_route_add'], [2, 2]);
  this.test_query('arrival_daterange', SQL_STATEMENTS['arrival_daterange_add'], [1, 1]);
  this.test_query('arrival_daterange', SQL_STATEMENTS['arrival_daterange_add'], [2, 2]);
}
//#endregion
//#region Test Update Statements
test_update_statements() {
  this.test_query('timetable',         SQL_STATEMENTS['timetable_edit'], ['U3', 1]);
  this.test_query('stop',              SQL_STATEMENTS['stop_edit'], [
                                    'Kings Theatre',
                                    '#2',
                                    1
                                  ]);
  this.test_query('arrival',           SQL_STATEMENTS['arrival_edit'], [
                                    2,
                                    1,
                                    '4321',
                                    false,
                                    'geezer',
                                    1
                                  ]);
  this.test_query('daterange',         SQL_STATEMENTS['daterange_edit'],
                                  [
                                    '2020/12/01',
                                    '2020/11/01',
                                    false,
                                    1
                                  ]);
  this.test_query('route',             SQL_STATEMENTS['route_edit'], [3, 1]);
  this.test_query('timetable_stop',    SQL_STATEMENTS['timetable_stop_edit'], [1, 2, 1, 1]);
  this.test_query('arrival_route',     SQL_STATEMENTS['arrival_route_edit'], [1, 2, 1, 1]);
  this.test_query('arrival_daterange', SQL_STATEMENTS['arrival_daterange_edit'], [1, 2, 1, 1]);
}
//#endregion
//#region Test Delete Statements
 test_delete_statements() {
  for (let i=1; i<3; i++) {
    this.test_query('timetable',         SQL_STATEMENTS['timetable_delete'], [i]);
    this.test_query('stop',              SQL_STATEMENTS['stop_delete'], [i]);
    this.test_query('arrival',           SQL_STATEMENTS['arrival_delete'], [i]);
    this.test_query('daterange',         SQL_STATEMENTS['daterange_delete'], [i]);
    this.test_query('route',             SQL_STATEMENTS['route_delete'], [i]);
    this.test_query('timetable_stop',    SQL_STATEMENTS['timetable_stop_delete'], [i, i]);
    this.test_query('arrival_route',     SQL_STATEMENTS['arrival_route_delete'], [i, i]);
    this.test_query('arrival_daterange', SQL_STATEMENTS['arrival_daterange_delete'], [i, i]);
  }
}
//#endregion
//#region Test View All Statements
test_get_statements() {
  this.query('timetable',         SQL_STATEMENTS['get_timetables']);
  this.query('stop',              SQL_STATEMENTS['get_stops']);
  this.query('arrival',           SQL_STATEMENTS['get_arrivals']);
  this.query('daterange',         SQL_STATEMENTS['get_dateranges']);
  this.query('route',             SQL_STATEMENTS['get_routes']);
  this.query('timetable_stop',    SQL_STATEMENTS['get_timetable_stops']);
  this.query('arrival_route',     SQL_STATEMENTS['get_arrival_routes']);
  this.query('arrival_daterange', SQL_STATEMENTS['get_arrival_dateranges']);
};
//#endregion

//#region Test Insert Real Data
//#region Test Insert Real Stops and Timetables
test_insert_real_stops_and_timetables() {
  return new Promise((resolve, reject) => {
    const timetables = ['U1', 'U2'];
    // let places = placesData.map((data) => `${data.lat.toString()},${data.lng.toString()}`);
    timetables.forEach(
      title => {
        this.query(SQL_STATEMENTS['timetable_add'], [title]) 
      }
    );
    // places = places.split('\n').filter(Boolean);
    uopdf.getStopsAndTimes('u1.pdf', null).subscribe((data) => {
      console.log(data);
      let stops = data.stops;
      let times = data.times;
      stops.map((stop, i) => {
        console.log(i, stop, places[i]);
        this.query(SQL_STATEMENTS['stop_add'], [stop, places[i].trim()]);
        this.query(SQL_STATEMENTS['timetable_stop_add'], [1, i+1]);
      });
      times.map((time_row, i) => {
        time_row.forEach((time) => {
          let rollover = false;
          if (time.slice(0, 2) == "00")
            rollover = true;
          this.query(SQL_STATEMENTS['arrival_add'], [
            1,
            (i % stops.length) + 1,
            time,
            rollover,
            ''
          ]);
        });
      })
      resolve('Arrival times inserted');
    });
  });
};
//#endregion
//#region Test Insert Real Dates
test_insert_real_dates() {
	// Public Holidays are blacklisted (i.e. bus service doesn't run)
  uopdates.getPublicHolidayDates(2019).subscribe((data) => {
    data.dateRanges.forEach((dateRange) => {
      let start_date = dateRange.dateRange[0];
      let end_date = dateRange.dateRange[0];
      let whitelist = dateRange.whitelist;
      this.query(SQL_STATEMENTS['daterange_add'], [
        start_date,
        end_date,
        whitelist
      ]);
    });
  });
  // Term Dates are whitelisted (i.e. bus service doesn't run)
  uopdates.getTermDates(2019).subscribe((data) => {
    console.log(data);
    data.dateRanges.forEach((daterange) => {
      let start_date = daterange.dateRange[0];
      let end_date = daterange.dateRange[1];
      let whitelist = daterange.whitelist;
      this.query(SQL_STATEMENTS['daterange_add'], [
        start_date,
        end_date,
        whitelist
      ]);
    });
  });
  // NOTE:	54 weeks instead of 52 as the minical has a max of 6 weeks
  //				So adding last two weekends makes it look consistent
  // Weekends are blacklisted (i.e. bus service doesn't run)
  const today = moment();
	const saturdayCounter = today.startOf('year').endOf('week');
	let ranges = [];
	for (let i=0; i<54; i++) {
		let saturday = moment(saturdayCounter).format('YYYY/MM/DD');
		let sunday = moment(saturdayCounter).add(1, 'day').format('YYYY/MM/DD');
		this.query(SQL_STATEMENTS['daterange_add'], [
			saturday,
			sunday,
			false
		]);
		saturdayCounter.add(1, 'week');
	}
};
}
//#endregion
//#endregion
