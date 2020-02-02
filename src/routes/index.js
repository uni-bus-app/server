import express from 'express';
import cors from 'cors';
import { IncomingForm } from 'formidable';
import { TimesService } from "../timesService";
import { u1 } from '../times'
import { Account } from '../account';
//import { Database } from "../db";
const router = express.Router().use(cors());
const UoPDF = require('uopdf');
const account = new Account();
const uopdates = require('uopdates');


/* GET times from database */
router.get('/gettimes', function(req, res, next) {

  //readDB();
  const times = new TimesService();

  let thing = times.getLongString(req.param("stopid"), u1);

  //console.log(thing)


  times.getStopTimes(thing, u1).subscribe(result => {
    res.send(result);
  });

  //console.log(object);

  //res.send(object);

});

/* POST pdf file and read times. */
router.post('/uploadtimes', function(req, res, next) {

  const form = IncomingForm();

  form.on('file', (field, file) => {

    UoPDF.getStopsAndTimes(file.path, null, true).subscribe(data => {
      console.log(data);
    });
  });
  form.on('end', () => {
    res.json();
  })
  form.parse(req);
});

router.get('/adduser', function(req, res, next) {

  account.addUser(req.param("email"), req.param("id")).subscribe(result => {
    console.log(result);
  });

});

router.get('/listusers', function(req, res, next) {
  account.listUsers(req.param("id")).subscribe(result => {
    res.send(result);
  });
});

router.get('/test', function(req, res, next) {
  uopdates.getDateRanges(2019).subscribe(data => {res.send(data)});
});

router.get('/deleteuser', function(req, res, next) {
  account.deleteUser(req.param("uid"), req.param("id")).subscribe(data => {res.send(data)});
});

export default router;
