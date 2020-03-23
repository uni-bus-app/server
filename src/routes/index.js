import express from 'express';
import cors from 'cors';
import { IncomingForm } from 'formidable';
import { Account } from '../services/account';
import { Notification } from '../services/notification';
const my_db = require('../services/db');
//#endregion

const router = express.Router().use(cors());
const account = new Account();
const notification = new Notification();

let db = new my_db({
	database: 'unibus',
  host: '35.230.149.136',
	user: 'root',
  password: ''
});


/***************************************
 * GET STOPS FOR CLIENT
 * *********************************** */

function getStops(req, res, next) {
  db.get_stops(req.query, (data) => res.send(data))
  //res.send(stops);
}

/***************************************
 * GET TIMES FOR CLIENT
 * *********************************** */

function getTimes(req, res, next) {
  db.get_arrivals(req.query, data => {
    res.send(data)
  })
}

function getNotifications(req, res, next) {
  notification.getCurrent().subscribe(data => res.send(data))
}

/***************************************
 * TIMES UPLOADING
 * *********************************** */

/* POST pdf file and read times. */
function uploadTimes(req, res, next) {

  const form = IncomingForm();

  form.on('file', (field, file) => {

    //UoPDF.getStopsAndTimes(file.path, null, true).subscribe(data => {
    //  console.log(data);
    //});
  });
  form.on('end', () => {
    res.json();
  });
  form.parse(req);
}

/***************************************
 * USER MANAGEMENT
 * *********************************** */

function addUser(req, res, next) {
  account.addUser(req.params.email, req.params.authid).subscribe(result => {
    console.log(result);
  });
}

function listUsers(req, res, next) {
  account.listUsers(req.params.authid).subscribe(result => {
    res.send(result);
  });
}

function deleteUser(req, res, next) {
  account.deleteUser(req.params.uid, req.params.authid).subscribe(data => {res.send(data)});
}

/******************************************
 * ROUTES
 * ************************************** */

router.get('/stops', getStops);
router.get('/times/:stopid', getTimes);

router.get('/arrivals/', getTimes);

router.get('/notifications', getNotifications);

router.post('/uploadtimes', uploadTimes);
router.get('/users/add/:authid/:email', addUser);
router.get('/users/list/:authid', listUsers);
router.get('/users/delete/:authid/:uid', deleteUser);

export default router;
