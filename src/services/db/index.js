const mysql = require('mysql');
const uopdf = require('uopdf');
const uopdates = require('uopdates');
const moment = require('moment');
const SQL_STATEMENTS = require('./sql_statements.js');
const Observable = require('rxjs/Observable').Observable;

let con;

function init(options) {
  con = mysql.createConnection(options);
  // this.con.connect(err => console.log(err));
}
function dbQuery(sql, params=[]) {
  return Observable.create(observer => {
    con.query(sql, params, (err, results, fields) => {
      // console.log(sql, results, '\n\n\n');
      if(err) {
        observer.error(err);
      } else {
        observer.next(results);
      }
      observer.complete();
    });
  });
}
function test_query(table, sql, params=[]) {
  dbQuery(sql, params);
  dbQuery(SQL_STATEMENTS[`get_${table}s`]);
}
function getArrivals(query) {
  return Observable.create(observer => {
    if (query) {
      if (query.timetable && query.stop) {
        dbQuery(SQL_STATEMENTS[`get_timetable_stop_arrivals`], [query.timetable, query.stop]).subscribe(results => {
          console.log('get_timetable_stop_arrivals', query);
          let data = results;
          let JSONdata = JSON.stringify(data);
          observer.next(JSONdata);
          observer.complete();
        });
      } else if (query.timetable) {
        dbQuery(SQL_STATEMENTS[`get_timetable_arrivals`], [query.timetable]).subscribe(results => {
          console.log('get_timetable_arrivals', query);
          let data = results;
          let JSONdata = JSON.stringify(data);
          observer.next(JSONdata);
          observer.complete();
        });
      } else {
        dbQuery(SQL_STATEMENTS[`get_arrivals`]).subscribe(results => {
          console.log('get_arrivals', query);
          let data = results;
          let JSONdata = JSON.stringify(data);
          observer.next(JSONdata);
          observer.complete();
        });
      }
    }
  });
}
function getTimetables(query) {
  return Observable.create(observer => {
    if (query) {
      dbQuery(SQL_STATEMENTS[`get_timetables`]).subscribe(results => {
        let data = results;
        let JSONdata = JSON.stringify(data);
        observer.next(JSONdata);
        observer.complete();
      });
    }
  });
}
function getStops(query) {
  return Observable.create(observer => {
    if (query.timetable) {
      dbQuery(SQL_STATEMENTS[`get_timetable_stops`]).subscribe(results => {
        let data = results;
        let JSONdata = JSON.stringify(data);
        observer.next(JSONdata);
        observer.complete();
      });
    } else {
      dbQuery(SQL_STATEMENTS[`get_stops`]).subscribe(results => {
        let data = results;
        let JSONdata = JSON.stringify(data);
        observer.next(JSONdata);
        observer.complete();
      });
    }
  });
}
function getDataranges(query) {
  return Observable.create(observer => {
    if (query) {
      dbQuery(SQL_STATEMENTS[`get_dateranges`]).subscribe(results => {
        let data = results;
        let JSONdata = JSON.stringify(data);
        observer.next(JSONdata);
        observer.complete();
      });
    }
  });
}
function getFields(query) {
  return Observable.create(observer => {
    if (query.table) {
      dbQuery(SQL_STATEMENTS[`get_fields`]).subscribe(results => {
        if (err) console.log(err);
        let data = results;
        let JSONdata = JSON.stringify(data);
        observer.next(JSONdata);
        observer.complete();
      })
    }
  });
}
function getCount(query) {
  return Observable.create(observer => {
    if (query.table) {
      dbQuery(SQL_STATEMENTS[`get_${req.query.table}_count`]).subscribe(results => {
        let data = results;
        let JSONdata = JSON.stringify(data);
        observer.next(JSONdata);
        observer.complete();
      });
    }
  });
}

//#region Test Insert Statements
function test_insert_statements() {
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
function test_update_statements() {
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
function test_delete_statements() {
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
function test_get_statements() {
  dbQuery('timetable',         SQL_STATEMENTS['get_timetables']);
  dbQuery('stop',              SQL_STATEMENTS['get_stops']);
  dbQuery('arrival',           SQL_STATEMENTS['get_arrivals']);
  dbQuery('daterange',         SQL_STATEMENTS['get_dateranges']);
  dbQuery('route',             SQL_STATEMENTS['get_routes']);
  dbQuery('timetable_stop',    SQL_STATEMENTS['get_timetable_stops']);
  dbQuery('arrival_route',     SQL_STATEMENTS['get_arrival_routes']);
  dbQuery('arrival_daterange', SQL_STATEMENTS['get_arrival_dateranges']);
};
//#endregion

//#region Test Insert Real Data
//#region Test Insert Real Stops and Timetables
function test_insert_real_stops_and_timetables() {
  return new Promise((resolve, reject) => {
    const timetables = ['U1', 'U2'];
    // let places = placesData.map((data) => `${data.lat.toString()},${data.lng.toString()}`);
    timetables.forEach(
      title => {
        dbQuery(SQL_STATEMENTS['timetable_add'], [title]) 
      }
    );
    // places = places.split('\n').filter(Boolean);
    uopdf.getStopsAndTimes('u1.pdf', null).subscribe((data) => {
      console.log(data);
      let stops = data.stops;
      let times = data.times;
      stops.map((stop, i) => {
        console.log(i, stop, places[i]);
        dbQuery(SQL_STATEMENTS['stop_add'], [stop, places[i].trim()]);
        dbQuery(SQL_STATEMENTS['timetable_stop_add'], [1, i+1]);
      });
      times.map((time_row, i) => {
        time_row.forEach((time) => {
          let rollover = false;
          if (time.slice(0, 2) == "00")
            rollover = true;
          dbQuery(SQL_STATEMENTS['arrival_add'], [
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
function test_insert_real_dates() {
	// Public Holidays are blacklisted (i.e. bus service doesn't run)
  uopdates.getPublicHolidayDates(2019).subscribe((data) => {
    data.dateRanges.forEach((dateRange) => {
      let start_date = dateRange.dateRange[0];
      let end_date = dateRange.dateRange[0];
      let whitelist = dateRange.whitelist;
      dbQuery(SQL_STATEMENTS['daterange_add'], [
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
      dbQuery(SQL_STATEMENTS['daterange_add'], [
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
		dbQuery(SQL_STATEMENTS['daterange_add'], [
			saturday,
			sunday,
			false
		]);
		saturdayCounter.add(1, 'week');
	}
};

//#endregion
//#endregion

module.exports = {
  init,
  dbQuery,
  test_query,
  get_arrivals: getArrivals,
  get_timetables: getTimetables,
  get_stops: getStops,
  get_dateranges: getDataranges,
  get_fields: getFields,
  get_count: getCount
}