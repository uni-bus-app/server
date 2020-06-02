const express = require('express');
const cors = require('cors');
const app = express().use(cors());
const admin = require('firebase-admin');
const serviceAccount = require('../unibus-app-firebase-adminsdk-o15ed-2d4a0c28f8.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
  // credential: admin.credential.applicationDefault()
});

const firestore = require('./firestore');
const account = require('./services/account')
const notification = require('./services/notification');

async function getStops(req, res, next) {
  try {
    const stops = await firestore.getStops();
    res.send(stops);
  } catch (error) {
    next(error);
  }
}

async function getTimes(req, res, next) {
  try {
    const times = await firestore.getTimes(req.params.stopID);
    res.send(times);
  } catch (error) {
    next(error);
  }
}

async function getRoutes(req, res, next) {
  try {
    const routes = await firestore.getRoutes();
    res.send(routes);
  } catch (error) {
    next(error);
  }
}

app.get('/u1routepath', (req, res) => {
  let result;
  admin.firestore().collection('routes').get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        result = doc.data().path;
        console.log(result)
        res.send(result)
      });
    });
});

function getNotifications(req, res, next) {
  notification.getCurrent().subscribe(data => res.send(data))
}

function getServiceInfo(req, res, next) {
  notification.getCurrentServiceInfo().subscribe(data => res.send(data));
}

/***************************************
 * TIMES UPLOADING
 * *********************************** */

/* POST pdf file and read times. */
function uploadTimes(req, res, next) {

  const form = IncomingForm();

  form.on('file', (field, file) => {
    console.log(file.path)
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

app.get('/stops', getStops);
app.get('/stops/:stopID/times', getTimes);
app.get('/routes', getRoutes);

app.get('/notifications', getNotifications);
app.get('/serviceinfo', getServiceInfo);

app.post('/uploadtimes', express.json(), uploadTimes);
app.get('/users/add/:authid/:email', addUser);
app.get('/users/list/:authid', listUsers);
app.get('/users/delete/:authid/:uid', deleteUser);


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
