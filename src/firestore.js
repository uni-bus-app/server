const admin = require('firebase-admin');
const db = admin.firestore();
const uopdf = require('uopdf');
const uopdates = require('uopdates');
const hash = require('object-hash');

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
  return routes;
}

async function insertStops() {
  const stopNames = await parseStops();
  stopNames.pop();
  const batch = db.batch();
  stopNames.forEach((element, i) => {
    batch.set(db.collection('stops').doc(), {name: element, routeOrder: i});
  });
  await batch.commit();
}

async function insertTimes() {
  const stopTimes = await parseTimes();

  const stopTimesInfo = [];
  stopTimes.forEach((element, i) => {
    stopTimesInfo[i] = [];
    element.forEach((time, n) => {
      stopTimesInfo[i].push({scheduled: time, routeNumber: n});
    })
    
  });
  const batch = db.batch();
  const snapshot = await db.collection('stops').orderBy('routeOrder').get();
  let i = 0;
  snapshot.forEach(doc => {
    batch.set(db.collection('times').doc(), {stopID: doc.id, times: stopTimesInfo[i]})
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
    const routeData = doc.data();
    routeData.id = doc.id;
    result.push(routeData);
  });
  return result;
}

async function getAllTimes() {
  const snapshot = await db.collection('times').get();
  let result = [];
  snapshot.forEach(doc => {
    const timesData = doc.data();
    timesData.id = doc.id;
    result.push(timesData);
  });
  return result;
}

async function updateVersion(versionInfo) {
  db.collection('version').get().then(snapshot => {
    snapshot.forEach(element => {
      element.ref.update(versionInfo);
    });
  });
}

async function updateChecksums() {
  db.collection('stops').orderBy('routeOrder').onSnapshot(() => {
    getStops().then(stops => {
      const stopsHash = hash(stops);
      console.log(stopsHash)
      updateVersion({stopsVersion: stopsHash});
    });
  });
  db.collection('times').onSnapshot(() => {
    getAllTimes().then(times => {
      const timesHash = hash(times);
      console.log(timesHash)
      updateVersion({timesVersion: timesHash});
    });
  });
  db.collection('routes').orderBy('routeNumber').onSnapshot(() => {
    getRoutes().then(routes => {
      const routesHash = hash(routes);
      console.log(routesHash)
      updateVersion({routesVersion: routesHash});
    });
  });
}

async function getChecksums() {
  const snapshot = await db.collection('version').get();
  let result;
  snapshot.forEach(doc => {
    result = doc.data();
  });
  return result;
}

async function addNotificationID(sub) {
  await db.collection('subscriptions').add(sub);
}

async function getSubscriptions() {
  const sub = await db.collection('subscriptions').get();
  let elem
  sub.forEach(el => {elem = el.data();})
  return elem;
}

module.exports = {
  insertStops,
  insertTimes,
  insertRoutes,
  getStops,
  getTimes,
  getRoutes,
  getAllTimes,
  getChecksums,
  updateChecksums,
  addNotificationID,
  getSubscriptions
}