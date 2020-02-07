import express from 'express';
import cors from 'cors';
import { IncomingForm } from 'formidable';
import { TimesService } from "../services/timesService";
import { Account } from '../services/account';
import { Notification } from "../services/notification";

const router = express.Router().use(cors());
const account = new Account();
const notification = new Notification();
const webpush = require('web-push');

const publicVapidKey = process.env.PUBLIC_VAPID_KEY;
const privateVapidKey = process.env.PRIVATE_VAPID_KEY;

// Replace with your email
webpush.setVapidDetails('mailto:info@unib.us', "BKscmwsT8ZKN3sCQyZiUBR3vPyUm6nyKPpTwDcg4z-5aPDPfZru73MvsLifer5uvrjfIljmu9pLRlrW94SYl2UQ", "29WTI_2s53Nk5IrUJsAWIk0N-JH_SR4rpvRqd7-JuFU");


router.post('/notifications', (req, res) => {
  notification.subscribe(req);
  res.status(201).json({});
})

router.post('/yeetus', (req, res) => {

  const message = req.body
  console.log(message)
  notification.sendNotification(message);
})

/***************************************
 * GET TIMES FOR CLIENT
 * *********************************** */

/* GET times from database */
router.get('/gettimes', function(req, res, next) {

  //readDB();
  const times = new TimesService();

  let thing = times.getLongString(req.param("stopid"), u1);



  times.getStopTimes(thing, u1).subscribe(result => {
    res.send(result);
  });

});

/***************************************
 * TIMES UPLOADING
 * *********************************** */

/* POST pdf file and read times. */
router.post('/uploadtimes', function(req, res, next) {

  const form = IncomingForm();

  form.on('file', (field, file) => {

    //UoPDF.getStopsAndTimes(file.path, null, true).subscribe(data => {
    //  console.log(data);
    //});
  });
  form.on('end', () => {
    res.json();
  })
  form.parse(req);
});


/***************************************
 * USER MANAGEMENT
 * *********************************** */

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

router.get('/deleteuser', function(req, res, next) {
  account.deleteUser(req.param("uid"), req.param("id")).subscribe(data => {res.send(data)});
});

export default router;
