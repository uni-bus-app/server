const admin = require('firebase-admin');
const db = admin.firestore();
const uopdf = require('uopdf');
const uopdates = require('uopdates');

async function parseStops() {
  const result = await uopdf.getStopsAndTimes('u1.pdf', null, true)
  return result.stops;
}

async function parseTimes() {
  const result = await uopdf.getStopsAndTimes('u1.pdf', null, true);
  const stopTimes = [];
  const numStops = result.stops.length;
  for(let i = 0; i < numStops; i++) {
    const newStopTimes = result.times[i].concat(result.times[i+12], result.times[i+24]);
    stopTimes.push(newStopTimes)
  }
  return stopTimes;
}

async function parseRoutes() {
  const times = await parseTimes();
  const stops = await parseStops();
  const routes = [];
  for(let i = 0; i < times[0].length; i++) {
    routes[i] = [];
    times.forEach((element, n) => {
      routes[i].push({
        stop: stops[n],
        time: element[i]
      });
    });
  }
  console.log(routes);
  return routes;
}

async function insertStops() {
  const stopNames = await parseStops();
  stopNames.pop();
  const stops = [];
  const batch = db.batch();
  stopNames.forEach((element, i) => {
    batch.set(db.collection('stops').doc(), {name: element, routeOrder: i});
  });
  await batch.commit();
}

async function insertTimes() {
  const stopTimes = await parseTimes();
  console.log(stopTimes)
  const batch = db.batch();
  const snapshot = await db.collection('stops').orderBy('routeOrder').get();
  let i = 0;
  snapshot.forEach(doc => {
    batch.set(db.collection('times').doc(), {stopID: doc.id, times: stopTimes[i]})
    i++;
  })
  await batch.commit();
}

async function insertRoutes() {
  const batch = db.batch();
  const routes = await parseRoutes();
  routes.forEach((element, i) => {
    batch.set(db.collection('routes').doc(), {routeNumber: i, stops: element});
  })
  await batch.commit();
}

async function getStops() {
  const snapshot = await db.collection('stops').orderBy('routeOrder').get();
  const result = [];
  snapshot.forEach(doc => {
    const stopData = doc.data();
    stopData.id = doc.id;
    result.push(stopData);
  })
  return result;
}

async function getTimes(stopID) {
  const snapshot = await db.collection('times').where('stopID', '==', stopID).get();
  let result;
  snapshot.forEach(doc => {
    result = doc.data().times;
  });
  return result;
}

async function getRoutes() {
  const snapshot = await db.collection('routes').orderBy('routeNumber').get();
  const result = [];
  snapshot.forEach(doc => {
    result.push(doc.data())
  })
  return result;
}

module.exports = {
  insertStops,
  insertTimes,
  insertRoutes,
  getStops,
  getTimes,
  getRoutes,
}