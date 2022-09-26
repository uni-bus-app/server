import { getFirestore } from 'firebase-admin/firestore';
import hash from 'object-hash';
import { TimesDoc } from '@uni-bus-app/uopdf/lib/types';
import { Message, Route, Stop, Times } from '../types';

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

const getTimes = async (
  stopID: string,
  day?: number,
  rollover?: boolean
): Promise<any[]> => {
  let query = getFirestore()
    .collection('times')
    .where('stopID', '==', stopID)
    .where('service', '==', 'u1');
  if (day) {
    query = query.where('days', 'array-contains', day);
  }
  if (rollover) {
    query = query.where('rollover', '==', true);
  }
  const snapshot = await query.get();
  let result: any[] = [];
  snapshot.forEach((doc) => {
    result.unshift(...doc.data().times);
  });
  return result;
};

const getTimesOld = async (stopID: string): Promise<any[]> => {
  // TODO remove
  const res = await getFirestore()
    .collection('times')
    .where('stopID', '==', stopID)
    .get();
  let result: any[] = [];
  res.forEach((doc) => {
    result.unshift(...doc.data().times);
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
  let rollover: any = {};
  snapshot.forEach((doc) => {
    const timesData = <Times>doc.data();
    timesData.id = doc.id;
    if ((timesData as any).rollover === true) {
      rollover[timesData.stopID] = timesData;
    } else {
      result.push(timesData);
    }
  });
  result.forEach((item) => {
    if (rollover[item.stopID]) {
      item.times.push(...rollover[item.stopID].times);
    }
  });
  return result;
};

const getAllTimes1 = async (): Promise<Times[]> => {
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

const syncDB = async (
  clientVersion: any,
  newFormat?: boolean
): Promise<any> => {
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
    const times = await (async () => {
      if (newFormat) {
        return await getAllTimes1();
      } else {
        return await getAllTimes();
      }
    })();
    // const times = await getAllTimes();
    // const times = await getAllTimes1();
    return { stops, times, updates: true, versions };
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

const getTimetables = async (id?: string) => {
  if (id) {
    const snapshot = await getFirestore()
      .collection('timetables')
      .doc(id)
      .get();
    return snapshot.data().timesDocs;
  }
  const snapshot = await getFirestore().collection('timetables').get();
  const ids = snapshot.docs.map((item) => item.id);
  return ids;
};

const insertTimetable = async (timesDocs: TimesDoc[]): Promise<string> => {
  const res = await getFirestore().collection('timetables').add({ timesDocs });
  return res.id;
};

const insertTimes = async (timesDocs: TimesDoc[]) => {
  const querySnapshot = await getFirestore().collection('times').get();
  querySnapshot.docs.forEach((snapshot) => {
    snapshot.ref.delete();
  });

  for await (const doc of timesDocs) {
    await getFirestore().collection('times').add(doc);
  }
};

const publishTimetable = async (timetableID: string): Promise<boolean> => {
  const snapshot = await getFirestore()
    .collection('timetables')
    .doc(timetableID)
    .get();
  const doc = snapshot.data();
  if (doc) {
    const { timesDocs } = doc;
    await insertTimes(timesDocs);
    return true;
  } else {
    return false;
  }
};

export default {
  getStops,
  getTimes,
  getTimesOld,
  getRoutes,
  getRoute,
  getRoutePath,
  getTimetables,
  insertTimetable,
  publishTimetable,
  syncDB,
  getMessages,
  updateChecksums,
};
