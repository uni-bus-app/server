"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _cors = _interopRequireDefault(require("cors"));

var _formidable = require("formidable");

var _timesService = require("../services/timesService");

var _account = require("../services/account");

var _notification = require("../services/notification");

var _times = require("../services/times");

var _stops = require("../services/stops");

var _db = require("../services/db");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var my_db = require('../services/db'); //#endregion


var router = _express["default"].Router().use((0, _cors["default"])());

var account = new _account.Account();
var notification = new _notification.Notification();
var db = new my_db({
  database: 'unibus',
  host: '35.230.149.136',
  user: 'root',
  password: ''
});
console.log(db);
/*
db.test_insert_real_stops_and_timetables().then(
  db.test_insert_real_dates()
);
*/
// db.get_arrivals({
//   timetable: 1,
//   stop: 2
// }, (arrivals) => console.log(arrivals));
// db.get_stops({}, data => console.log(data))

/***************************************
 * GET STOPS FOR CLIENT
 * *********************************** */

function getStops(req, res, next) {
  db.get_stops(req.query, function (data) {
    return res.send(data);
  }); //res.send(stops);
}
/***************************************
 * GET TIMES FOR CLIENT
 * *********************************** */


function getTimes(req, res, next) {
  var times = new _timesService.TimesService();
  var timesData = times.getLongString(req.params.stopid, _times.u1);
  times.getStopTimes(timesData, _times.u1).subscribe(function (result) {
    res.send(result);
  });
}

function getNotifications(req, res, next) {
  notification.getCurrent().subscribe(function (data) {
    return res.send(data);
  });
}
/***************************************
 * TIMES UPLOADING
 * *********************************** */

/* POST pdf file and read times. */


function uploadTimes(req, res, next) {
  var form = (0, _formidable.IncomingForm)();
  form.on('file', function (field, file) {//UoPDF.getStopsAndTimes(file.path, null, true).subscribe(data => {
    //  console.log(data);
    //});
  });
  form.on('end', function () {
    res.json();
  });
  form.parse(req);
}
/***************************************
 * USER MANAGEMENT
 * *********************************** */


function addUser(req, res, next) {
  account.addUser(req.params.email, req.params.authid).subscribe(function (result) {
    console.log(result);
  });
}

function listUsers(req, res, next) {
  account.listUsers(req.params.authid).subscribe(function (result) {
    res.send(result);
  });
}

function deleteUser(req, res, next) {
  account.deleteUser(req.params.uid, req.params.authid).subscribe(function (data) {
    res.send(data);
  });
}
/******************************************
 * ROUTES
 * ************************************** */


router.get('/stops', getStops);
router.get('/times/:stopid', getTimes);
router.get('/notifications', getNotifications);
router.post('/uploadtimes', uploadTimes);
router.get('/users/add/:authid/:email', addUser);
router.get('/users/list/:authid', listUsers);
router.get('/users/delete/:authid/:uid', deleteUser);
var _default = router;
exports["default"] = _default;