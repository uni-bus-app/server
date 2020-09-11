const express = require('express');
const cors = require('cors');
const app = express().use(cors());
const admin = require('firebase-admin');
const serviceAccount = require('../unibus-app-firebase-adminsdk-o15ed-2d4a0c28f8.json');
const {Client, Status, TravelMode} = require('@googlemaps/google-maps-services-js');
const polyline = require( 'google-polyline' )


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
  // credential: admin.credential.applicationDefault()
});

const client = new Client({});

const firestore = require('./firestore');
const account = require('./services/account');
const notification = require('./services/notification');

firestore.updateChecksums();

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

async function syncLocalDB(req, res, next) { 
  try {
    // Check client checksums against server ones
    console.log(req.body)
    const versions = await firestore.getChecksums()
    let dataChanged = false;
    for (const version in versions) {
      if(versions[version] !== req.body[version]) {
        dataChanged = true;
      }
    }
    // If any checksums are different, resync the local db
    if (dataChanged) {
      const stops = await firestore.getStops()
      const times = await firestore.getAllTimes();
      const routes = await firestore.getRoutes();
      res.send({stops, times, routes});
    } else {
      res.send(null);
    }
  } catch (error) {
    next(error);
  }
}

app.get('/u1routepath', (req, res) => {
  let result;
  admin.firestore().collection('routepath').get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        result = doc.data().path;
        res.send(result)
      });
    });
});

function getNotifications(req, res) {
  notification.getCurrent().subscribe(data => res.send(data))
}

function getServiceInfo(req, res) {
  notification.getCurrentServiceInfo().subscribe(data => res.send(data));
}

async function getDirections(req, res, next) {
  try {
    const response = await client.directions({params: {origin: req.body.origin, destination: req.body.destination, key: 'AIzaSyCYHHCkhOSiWBI9ulZZ4PS8eIpinc003K8', mode: TravelMode.walking}});
    console.log(response.data)
    response.data.routes[0].overview_polyline = polyline.decode(response.data.routes[0].overview_polyline.points)
    const path = [];
    response.data.routes[0].overview_polyline.forEach(point => {
      console.log(point)
      // const pos = point[0].split(',');
      path.push({
        latitude: point[0],
        longitude: point[1],
      });
    });
    response.data.routes[0].overview_polyline = path;
    res.send(response.data)
  } catch (error) {
    next(error);
  }
}

function subscribeToNotifications(req, res) {
  console.log(req.body)
  webpush.sendNotification(req.body, JSON.stringify({notification: {
    title: "B U S",
    body: "T H E B U S IS L E A V I N G",
    icon: "assets/main-page-logo-small-hat.png",
    showTrigger: new TimestampTrigger(Date.now()+5000),
    data: {
        dateOfArrival: Date.now()-5000,
        primaryKey: 1
    },
    actions: [{
        action: "explore",
        title: "Go to the site"
    }]
}}))
}

async function sendNotification(req, res) {
  
}

/***************************************
 * TIMES UPLOADING
 * *********************************** */

/* POST pdf file and read times. */
function uploadTimes(req, res) {

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

function addUser(req, res) {
  account.addUser(req.params.email, req.params.authid).subscribe(result => {
    console.log(result);
  });
}

function listUsers(req, res) {
  account.listUsers(req.params.authid).subscribe(result => {
    res.send(result);
  });
}

function deleteUser(req, res) {
  account.deleteUser(req.params.uid, req.params.authid).subscribe(data => {res.send(data)});
}

/******************************************
 * ROUTES
 * ************************************** */

app.get('/stops', getStops);
app.get('/stops/:stopID/times', getTimes);
app.get('/routes', getRoutes);
app.post('/sync', express.json(), syncLocalDB);

app.post('/directions', express.json(), getDirections);

app.get('/notifications', getNotifications);
app.get('/serviceinfo', getServiceInfo);

app.post('/subscribe', express.json(), subscribeToNotifications);
app.get('/testnotifications', sendNotification)

app.post('/uploadtimes', express.json(), uploadTimes);
app.get('/users/add/:authid/:email', addUser);
app.get('/users/list/:authid', listUsers);
app.get('/users/delete/:authid/:uid', deleteUser);


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
