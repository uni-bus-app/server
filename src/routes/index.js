import express from 'express';
import cors from 'cors';
import { IncomingForm } from 'formidable';
import { TimesService } from "../services/timesService";
import { Account } from '../services/account';
import { u1 } from '../services/times';
import { stops } from '../services/stops';

const router = express.Router().use(cors());
const account = new Account();

/***************************************
 * GET STOPS FOR CLIENT
 * *********************************** */

function getStops(req, res, next) {
  res.send(stops);
}

/***************************************
 * GET TIMES FOR CLIENT
 * *********************************** */

function getTimes(req, res, next) {
  const times = new TimesService();
  let timesData = times.getLongString(req.params.stopid, u1);
  times.getStopTimes(timesData, u1).subscribe(result => {
    res.send(result);
  });
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

router.post('/uploadtimes', uploadTimes);
router.get('/users/add/:authid/:email', addUser);
router.get('/users/list/:authid', listUsers);
router.get('/users/delete/:authid/:uid', deleteUser);

export default router;
