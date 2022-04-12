import { getFirestore } from 'firebase-admin/firestore';
import hash from 'object-hash';
import { Message, Route, Stop, Time, Times } from '../types';

const getStops = async (): Promise<Stop[]> => {
  const snapshot = await getFirestore()
    .collection('stops')
    .orderBy('routeOrder')
    .get();
  const result: Stop[] = [];
  snapshot.forEach((doc) => {
    const stopData = <Stop>doc.data();
    stopData.id = doc.id;
    result.push(stopData);
  });
  return result;
};

const getTimes = async (stopID: string): Promise<Time[]> => {
  const snapshot = await getFirestore()
    .collection('times')
    .where('stopID', '==', stopID)
    .get();
  let result: Time[];
  snapshot.forEach((doc) => {
    result = doc.data().times;
  });
  return result;
};

const getRoutes = async (): Promise<Route[]> => {
  const snapshot = await getFirestore()
    .collection('routes')
    .orderBy('routeNumber')
    .get();
  const result: Route[] = [];
  snapshot.forEach((doc) => {
    const routeData = <Route>doc.data();
    routeData.id = doc.id;
    result.push(routeData);
  });
  return result;
};
const getRoute = async (routeNumber: number): Promise<Route> => {
  const snapshot = await getFirestore()
    .collection('routes')
    .where('routeNumber', '==', routeNumber)
    .get();
  return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Route;
};

const getAllTimes = async (): Promise<Times[]> => {
  const snapshot = await getFirestore().collection('times').get();
  let result: Times[] = [];
  snapshot.forEach((doc) => {
    const timesData = <Times>doc.data();
    timesData.id = doc.id;
    result.push(timesData);
  });
  return result;
};

const getRoutePath = async (): Promise<any> => {
  let result;
  const snapshot = await getFirestore().collection('routepath').get();
  snapshot.forEach((doc) => {
    result = doc.data().path;
  });
  return result;
};

const updateVersion = async (versionInfo: any): Promise<void> => {
  const snapshot = await getFirestore().collection('version').get();
  snapshot.forEach((element) => {
    element.ref.update(versionInfo);
  });
};

const updateChecksums = async (): Promise<any> => {
  getFirestore()
    .collection('stops')
    .orderBy('routeOrder')
    .onSnapshot(() => {
      getStops().then((stops) => {
        const stopsHash = hash(stops, { respectType: false });
        updateVersion({ stopsVersion: stopsHash });
      });
    });
  getFirestore()
    .collection('times')
    .onSnapshot(() => {
      getAllTimes().then((times) => {
        const timesHash = hash(times, { unorderedArrays: true });
        updateVersion({ timesVersion: timesHash });
      });
    });
};

const getChecksums = async (): Promise<any> => {
  const snapshot = await getFirestore().collection('version').get();
  let result;
  snapshot.forEach((doc) => {
    result = doc.data();
  });
  return result;
};

const syncDB = async (clientVersion: any): Promise<any> => {
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
};

const getMessages = async (): Promise<Message[]> => {
  const snapshot = await getFirestore().collection('messages').get();
  const result: Message[] = [];
  snapshot.forEach((doc) => {
    const messageData = <Message>doc.data();
    messageData.id = doc.id;
    result.push(messageData);
  });
  return result;
};

export default {
  getStops,
  getTimes,
  getRoutes,
  getRoute,
  getRoutePath,
  syncDB,
  getMessages,
  updateChecksums,
};

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
