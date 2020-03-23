"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Account = void 0;

var admin = _interopRequireWildcard(require("firebase-admin"));

var _rxjs = require("rxjs");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Account = /*#__PURE__*/function () {
  function Account() {// admin.initializeApp({
    //     credential: admin.credential.cert({
    //         projectId: 'uni-bus-backend',
    //         clientEmail: 'firebase-adminsdk-d418e@uni-bus-backend.iam.gserviceaccount.com',
    //         privateKey: '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCq9qBjE+cxWyQB\n9JJix4q9FOd23fzHPjLklBi7b5OYl5jzw8BKJTS5b3Q8f2x2JwtFTYTBofq7kqQU\nF+ZCw1XesyXMac+MWwDbYWcfgP2ewuuOQDMFUz+/erTMv9wRJBQJAQE53wBaq4oO\n5N3b0a5THSG/TSpK8On1zi24uyPGWmbM9XNbg0psv3i3kno3wH8E4BYvpTbHkQWE\nwSVDrcC09deGTKb9CQK5gPtk0RLhpPWxjBb//cdnEqIK0TB/HuB7ixMTKte/yXnO\nrmI4LB5QeIZsQEFhyhkbz/gjHhlx9Vy26Z34GRr1rT4rrSy/Pt2T/JJ52R63/Ihn\nQJUMAKyFAgMBAAECggEAG7emvXlwGEiSTWjamijcvZatMiXVAh57lM3NNrI6Z9kI\nI1k0tzCnXCW4NB4P4RX9FfbL6QgQWlHGHTsvXy/udOUZjIsJFanOuUKQ5q18hj1M\nKwC4j4qgLAns/xcJ9ZN3q2qzdAT2DefVbGBpobux0L1z3QvZ0/2RXi3XrCVXAaTJ\nflC3GFkoAju0yIpa8sB9fpWtveVBGAcR4Tur2bJ4u7ySTaVYCA6JL7JBbT76VD0M\nP4TSlCNbMD1DzFhn3V+Hr5eEmpCMFm084frNF4z83AaE1vsmz+39JE9D8rV/TmNk\nYosMhyCYuQYoWg3CRrqxeDsrn16KYaWVoAhBxX/2jwKBgQDdITY+eEm6TkiLGnEh\nZKnGUkSwwAsVoazUGxLPEjJgLcyOS8UmbL3R5OAMeQyc6l7E5IqE/KrKoEIIiu5o\np6ZZEmTKpm7AGCqBoODqCNbRult1mM2TnjasXBkQx5NjuZNeOI7x3LlpXwF+e8UV\nJyvpcVTX71P5mXKLLydO2ooc/wKBgQDF7D+0Ze5tEsQRYg6eTedwigVdW9ZXCfZ5\ncBGRmoTU3hu1UOF3zMiPiJDsjkQUW2Hzccof0lfZudhzAdSd0cqPBXwh2ULnvrgS\nWf14cxEan6le7xFQGwp7d4xEhlFMUSDYmYV/SMiSxx0+zfwngA2l8vEzuT74TvbY\nnCJ/sNVCewKBgQCPvawOFZEPex2q1ohdhZraoNWn814BNLQsuGCUnCaE4KCMivJf\n1OXbD6UYVoN9aNgrssfcRIYc6umhtfXdr8TxN4SvOlrZoZvX4aTyXMaPVE1pdueD\nIqA1kDR29NR5ScNixu8chzc7KJfHCVuGMY1Y1OOq7havNDECCqfJmUOYLwKBgQCQ\nQEiJ3YSxgGzgUnxfCl51GlMgoO+ODlfSWEilu122m47MTn+Vxe4jFqCxmFqsD5JL\nURLEsJSQvi+wWpQw1hdwt8mqDeQCbXFRBr+DSzIbGmTiKRGQNbUlGZNk2hRkr/hl\nhTbT9yMgPvjkrlJqI51O5sq/LPNlHIAyjVFjiWlVAwKBgDMOGS6BHRd70sq5inLh\nXmtsGXnvkaeKA1k5ssJel62jbEbxDTRvtQdk534KpR2XkD45YaGL6InfoNlsdNhp\nnCc8z16oIkCzxLIFbksz5fpyeAV61AUECo+F+sGz4ueO2oQ3zXZsuufrhkjr1na3\nK16IlrzhcmNZSUSmHz6Tpz/m\n-----END PRIVATE KEY-----\n'
    //     })
    // });

    _classCallCheck(this, Account);
  }

  _createClass(Account, [{
    key: "addUser",
    value: function addUser(email, idToken) {
      return _rxjs.Observable.create(function (observer) {
        if (idToken == null) {
          observer.next({
            "message": "Unauthorised"
          });
        } else {
          admin.auth().verifyIdToken(idToken).then(function (decodedToken) {
            admin.auth().verifyIdToken(idToken);
            admin.auth().createUser({
              email: email
            }).then(function (userRecord) {
              // See the UserRecord reference doc for the contents of userRecord.
              observer.next('Successfully created new user: ' + userRecord.uid);
            })["catch"](function (error) {
              observer.next('Error creating new user:', error);
            });
          })["catch"](function (error) {
            observer.next({
              "message": error
            });
          });
        }
      });
    }
  }, {
    key: "listUsers",
    value: function listUsers(idToken) {
      return _rxjs.Observable.create(function (observer) {
        if (idToken == null) {
          observer.next({
            "message": "Unauthorised"
          });
        } else {
          admin.auth().verifyIdToken(idToken).then(function (decodedToken) {
            admin.auth().listUsers(1000).then(function (listUsersResults) {
              observer.next(listUsersResults);
            })["catch"](function (error) {
              console.log("error listening uers");
              observer.next(null);
            });
          })["catch"](function (error) {
            observer.next({
              "message": error
            });
          });
        }
      });
    }
  }, {
    key: "deleteUser",
    value: function deleteUser(uid, idToken) {
      return _rxjs.Observable.create(function (observer) {
        if (idToken == null) {
          observer.next({
            "message": "Unauthorised"
          });
        } else {
          admin.auth().verifyIdToken(idToken).then(function (decodedToken) {
            admin.auth().deleteUser(uid).then(function () {
              observer.next({
                "message": "Successfully deleted"
              });
            })["catch"](function (error) {
              observer.next({
                "message": "Error deleting user: " + error
              });
            });
          })["catch"](function (error) {
            observer.next({
              "message": error
            });
          });
        }
      });
    }
  }]);

  return Account;
}();

exports.Account = Account;