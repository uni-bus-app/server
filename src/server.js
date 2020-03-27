const express = require('express');
const cors = require('cors');
const app = express().use(cors());

const IncomingForm = require('formidable').IncomingForm;
const account = require('./services/account')
const notification = require('./services/notification');
const db = require('./services/db');
//#endregion

// const serviceAccount = require('D:/Downloads/bustimetable-261720-firebase-adminsdk-z2wl9-9bd0b645d7.json')

admin.initializeApp({
  // credential: admin.credential.cert(serviceAccount)
  credential: admin.credential.applicationDefault()
})

db.init({
	database: 'unibus',
  socketPath: '/cloudsql/bustimetable-261720:europe-west2:uop-bus',
	 user: 'root',
  password: 'busTimeTable'
})

// db.init({
// 	database: 'unibus',
//   host: '35.230.149.136',
// 	user: 'root',
//   password: 'busTimeTable'
// })


/***************************************
 * GET STOPS FOR CLIENT
 * *********************************** */

function getStops(req, res, next) {
  db.get_stops(req.query).subscribe(data => {
    res.send(data)
  });
  //res.send(stops);
}

/***************************************
 * GET TIMES FOR CLIENT
 * *********************************** */

function getTimes(req, res, next) {
  db.get_arrivals(req.query).subscribe(data => {
    res.send(data)
  });
}

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
app.get('/times/:stopid', getTimes);

app.get('/arrivals/', getTimes);

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
