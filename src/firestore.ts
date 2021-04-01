import { firestore } from 'firebase-admin';
// import { getStopsAndTimes } from 'uopdf';
import hash from 'object-hash';
import { Time } from './models/time';
import { Route } from './models/route';
import { Stop } from './models/stop';
import { Times } from './models/times';
import { Message } from './models/message';
const { FieldValue } = firestore;

const db = firestore();

// export async function parseStops(): Promise<string[]> {
//   // const result = await getStopsAndTimes('u1.pdf', null);
//   return [];
// }

// export async function parseTimes(): Promise<string[][]> {
//   // const result = await getStopsAndTimes('u1.pdf', null);
//   const result = { stops: ['3'], times: ['3'] };
//   const stopTimes: string[][] = [];
//   const numStops = result.stops.length;
//   for (let i = 0; i < numStops; i++) {
//     const newStopTimes = result.times[i].concat(
//       result.times[i + 12],
//       result.times[i + 24]
//     );
//     stopTimes.push(newStopTimes);
//   }
//   return stopTimes;
// }

// export async function parseRoutes(): Promise<any> {
//   const times = await parseTimes();
//   const stops = await parseStops();
//   const routes: any = [];
//   for (let i = 0; i < times[0].length; i++) {
//     routes[i] = [];
//     times.forEach((element: any, n: number) => {
//       routes[i].push({
//         stop: stops[n],
//         time: element[i],
//       });
//     });
//   }
//   return routes;
// }

// export async function insertStops(): Promise<any> {
//   const stopNames = await parseStops();
//   stopNames.pop();
//   const batch = db.batch();
//   stopNames.forEach((element: any, i: number) => {
//     batch.set(db.collection('stops').doc(), { name: element, routeOrder: i });
//   });
//   await batch.commit();
// }

// export async function insertTimes(): Promise<any> {
//   const stopTimes = await parseTimes();

//   const stopTimesInfo: any = [];
//   stopTimes.forEach((element, i: number) => {
//     stopTimesInfo[i] = [];
//     element.forEach((time: any, n: any) => {
//       stopTimesInfo[i].push({ scheduled: time, routeNumber: n });
//     });
//   });

//   const batch = db.batch();
//   const times = await db.collection('times').get();
//   times.docs.forEach((doc) => {
//     batch.delete(doc.ref);
//   });
//   const snapshot = await db.collection('stops').orderBy('routeOrder').get();
//   let i = 0;
//   snapshot.forEach((doc) => {
//     batch.set(db.collection('times').doc(), {
//       stopID: doc.id,
//       times: stopTimesInfo[i],
//     });
//     i++;
//   });
//   await batch.commit();
// }

// export async function insertRoutes(): Promise<any> {
//   const batch = db.batch();
//   const routes = await parseRoutes();
//   routes.forEach((element: any, i: number) => {
//     batch.set(db.collection('routes').doc(), {
//       routeNumber: i,
//       stops: element,
//     });
//   });
//   await batch.commit();
// }

export async function getStops(): Promise<Stop[]> {
  const snapshot = await db.collection('stops').orderBy('routeOrder').get();
  const result: Stop[] = [];
  snapshot.forEach((doc) => {
    const stopData = <Stop>doc.data();
    stopData.id = doc.id;
    result.push(stopData);
  });
  return result;
}

export async function getTimes(stopID: string): Promise<Time[]> {
  const snapshot = await db
    .collection('times')
    .where('stopID', '==', stopID)
    .get();
  let result: Time[];
  snapshot.forEach((doc) => {
    result = doc.data().times;
  });
  return result;
}

export async function getRoutes(): Promise<Route[]> {
  const snapshot = await db.collection('routes').orderBy('routeNumber').get();
  const result: Route[] = [];
  snapshot.forEach((doc) => {
    const routeData = <Route>doc.data();
    routeData.id = doc.id;
    result.push(routeData);
  });
  return result;
}

export async function getRoute(routeNumber: number): Promise<Route> {
  const snapshot = await db
    .collection('routes')
    .where('routeNumber', '==', routeNumber)
    .get();
  return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Route;
}

export async function getAllTimes(): Promise<Times[]> {
  const snapshot = await db.collection('times').get();
  let result: Times[] = [];
  snapshot.forEach((doc) => {
    const timesData = <Times>doc.data();
    timesData.id = doc.id;
    result.push(timesData);
  });
  return result;
}

export async function getRoutePath(): Promise<any> {
  let result;
  const snapshot = await db.collection('routepath').get();
  snapshot.forEach((doc) => {
    result = doc.data().path;
  });
  return result;
}

export async function updateVersion(versionInfo: any): Promise<void> {
  const snapshot = await db.collection('version').get();
  snapshot.forEach((element) => {
    element.ref.update(versionInfo);
  });
}

export async function updateChecksums(): Promise<any> {
  db.collection('stops')
    .orderBy('routeOrder')
    .onSnapshot(() => {
      getStops().then((stops) => {
        const stopsHash = hash(stops, { respectType: false });
        updateVersion({ stopsVersion: stopsHash });
      });
    });
  db.collection('times').onSnapshot(() => {
    getAllTimes().then((times) => {
      const timesHash = hash(times, { unorderedArrays: true });
      updateVersion({ timesVersion: timesHash });
    });
  });
}

export async function getChecksums(): Promise<any> {
  const snapshot = await db.collection('version').get();
  let result;
  snapshot.forEach((doc) => {
    result = doc.data();
  });
  return result;
}

export async function syncDB(clientVersion: any): Promise<any> {
  const versions = await getChecksums();
  delete versions.routesVersion;
  let dataChanged = false;
  Object.keys(versions).forEach((element: string) => {
    if (versions[element] !== clientVersion[element]) {
      dataChanged = true;
    }
  });
  // If any checksums are different, resync the local db
  if (dataChanged) {
    const stops = await getStops();
    const times = await getAllTimes();
    return { stops, times, updates: true };
  } else {
    return { updates: false };
  }
}

export async function addTester(email: string): Promise<void> {
  await db
    .collection('testers')
    .doc('zp15afN6ArheL8xt5cVM')
    .update({
      emails: FieldValue.arrayUnion(email),
    });
}

export async function getMessages(): Promise<Message[]> {
  const snapshot = await db.collection('messages').get();
  const result: Message[] = [];
  snapshot.forEach((doc) => {
    const messageData = <Message>doc.data();
    messageData.id = doc.id;
    result.push(messageData);
  });
  return result;
}
