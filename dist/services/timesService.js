"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TimesService = void 0;

var _times = require("./times");

var _rxjs = require("rxjs");

require("rxjs/add/observable/of");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var TimesService = /*#__PURE__*/function () {
  function TimesService() {
    _classCallCheck(this, TimesService);
  }

  _createClass(TimesService, [{
    key: "getOneRow",
    value: function getOneRow(stop, row, times) {
      var b, e, other; //stores the begining and end index for the stop times
      //loop through the entire string and

      for (var i = 0; i < times.length; i++) {
        if (times.charAt(i) == stop) {
          if (other == row) {
            other++;
            b = i;
          }
        } else if (times.charAt(i) == "!") {
          e = i;
        }
      }

      return times.substring(b, e - 1);
    }
  }, {
    key: "getLongString",
    value: function getLongString(stopLetter, times) {
      var x = 0;
      var b = new Array();
      var e = new Array();

      for (var i = 0; i < times.length; i++) {
        if (times.charAt(i) == stopLetter) {
          b[x] = i;
          x++;
        }

        if (times.charAt(i) == "!") {
          if (e[x - 1] == null) {
            if (e.length < 3) {
              e[x - 1] = i;
            }
          }
        }
      }

      var output;

      if (times === _times.u1) {
        output = times.substring(b[0], e[0]) + times.substring(b[1], e[1]) + times.substring(b[2], e[2]);
      } else {
        output = times.substring(b[0], e[0]);
      }

      return output;
    }
  }, {
    key: "createStopTime",
    value: function createStopTime(timeReturn, times) {
      var date = new Date();
      var year = date.getFullYear();
      var month = date.getMonth();
      var day = date.getDate();
      var stopTime;

      if (parseInt(timeReturn.substring(0, 2)) < 6) {
        stopTime = new Date(year, month, day + 1, timeReturn.substring(0, 2), timeReturn.substring(2, 4));
      } else {
        stopTime = new Date(year, month, day, timeReturn.substring(0, 2), timeReturn.substring(2, 4));
      }

      return {
        destination: times === _times.u1 ? "Portsmouth University" : "Langstone Campus",
        service: times === _times.u1 ? "U1" : "U2",
        time: stopTime.getHours() + ":" + (stopTime.getMinutes() < 10 ? "0" + stopTime.getMinutes().toString() : stopTime.getMinutes().toString()),
        eta: Math.round((stopTime.getTime() - date.getTime()) / 1000 / 60).toString(),
        etatime: stopTime.getMinutes() < 59 ? "mins" : "hours",
        timeValue: stopTime.getTime()
      };
    }
  }, {
    key: "getStopTimes",
    value: function getStopTimes(lngString, times) {
      //input parameter is string of times for stop
      //Check if weekend and return empty array if so
      var date = new Date();
      var day = date.getDay();
      var isWeekend = day === 6 || day === 0;
      var timesArray = Array();
      if (isWeekend) return _rxjs.Observable.of(timesArray);
      var x = 0; //loop through each character in the string

      for (var i = 0; i < lngString.length; i++) {
        if (lngString.charAt(i) == " ") {} else if (lngString.charAt(i) == ".") {
          //skip the the next 4 characters and set the index +4
          i = i + 3; //timesArray[x] = null;
          //x++;
        } else if (!isNaN(lngString.charAt(i))) {
          //checks if number and output the next 4 characters and set the index +4
          var timeReturn = lngString.substring(i, i + 4);
          i = i + 3;
          timesArray[x] = this.createStopTime(timeReturn, times);
          x++;
        } else if (lngString.charAt(i) == "!") {
          break;
        }
      } //console.log(timesArray);


      while (timesArray[0] === null || (timesArray[0] ? timesArray[0].timeValue < date.getTime() + 60000 : false)) {
        timesArray.shift();
      }

      for (var _i = 0, _timesArray = timesArray; _i < _timesArray.length; _i++) {
        var time = _timesArray[_i];
        time = this.formatTime(time, date);
      } //console.log(timesArray);


      return _rxjs.Observable.of(timesArray);
    }
  }, {
    key: "formatTime",
    value: function formatTime(time, currentTime) {
      time.eta = Math.round((time.timeValue - currentTime.getTime()) / 1000 / 60).toString();
      time.etatime = "mins";

      if (parseInt(time.eta) < 2) {
        time.eta = "Now";
        time.etatime = null;
      } else if (parseInt(time.eta) == 60) {
        time.eta = "1";
        time.etatime = "hour";
      } else if (parseInt(time.eta) > 60) {
        time.eta = ((time.timeValue - currentTime.getTime()) / 1000 / 60 / 60).toFixed(1);
        time.etatime = "hours";
      }
    }
  }, {
    key: "getAllTimes",
    value: function getAllTimes(id) {
      var _this = this;

      var x = this.getTimes(id, _times.u1);
      var y = this.getTimes(id, u2);
      this.thing = forkJoin([x, y]).subscribe(function (result) {
        _this.nextU1Times.next(result[0]);

        _this.updateServiceTimes(result[0], _times.u1);

        _this.nextU2Times.next(result[1]);

        _this.updateServiceTimes(result[1], u2); //Run merge sort on both arrays and return merged array


        var sortedTimes = _this.mergeSortedArray(result[0], result[1]);

        _this.nextMergedTimes.next(sortedTimes);

        _this.updateServiceTimes(sortedTimes, "u1u2"); //console.log(sortedTimes);

      });
    }
  }, {
    key: "getU2Times",
    value: function getU2Times(id) {
      var _this2 = this;

      this.thing = this.getTimes(id, u2).subscribe(function (result) {
        _this2.nextU1Times.next(null);

        _this2.updateServiceTimes(null, _times.u1);

        _this2.nextU2Times.next(result);

        _this2.updateServiceTimes(result, u2);

        _this2.nextMergedTimes.next(null);

        _this2.updateServiceTimes(null, "u1u2");
      });
    }
  }, {
    key: "getU1Times",
    value: function getU1Times(id) {
      var _this3 = this;

      this.thing = this.getTimes(id, _times.u1).subscribe(function (result) {
        _this3.nextU1Times.next(result);

        _this3.updateServiceTimes(result, _times.u1);

        _this3.nextU2Times.next(null);

        _this3.updateServiceTimes(null, u2);

        _this3.nextMergedTimes.next(null);

        _this3.updateServiceTimes(null, "u1u2");
      });
    }
  }]);

  return TimesService;
}();

exports.TimesService = TimesService;