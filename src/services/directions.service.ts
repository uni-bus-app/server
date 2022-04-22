import dayjs, { Dayjs } from 'dayjs';
import fetch from 'node-fetch';
import db from '../db';
import { timetableService } from '.';
import { DirectionsResponse, Stop } from '../types';

const Deg2Rad = (deg: number) => (deg * Math.PI) / 180;

const PythagorasEquirectangular = (
  lat1: any,
  lon1: any,
  lat2: any,
  lon2: any
) => {
  lat1 = Deg2Rad(lat1);
  lat2 = Deg2Rad(lat2);
  lon1 = Deg2Rad(lon1);
  lon2 = Deg2Rad(lon2);
  var R = 6371; // km
  var x = (lon2 - lon1) * Math.cos((lat1 + lat2) / 2);
  var y = lat2 - lat1;
  var d = Math.sqrt(x * x + y * y) * R;
  return d;
};

const getClosest = (path: any, point: any) => {
  let res;
  let minDif = 99999;
  for (let index = 0; index < path.length; ++index) {
    var dif = PythagorasEquirectangular(
      point.location._latitude,
      point.location._longitude,
      path[index].lat,
      path[index].lng
    );
    if (dif < minDif) {
      res = index;
      minDif = dif;
    }
  }
  return res;
};

const getBusRoute = (
  arrival: Dayjs,
  departure: Dayjs,
  distance: string,
  path: any[],
  pathBounds: any,
  stops: Stop[],
  departureStop: Stop,
  arrivalStop: Stop,
  route2BusDep: string,
  route2BusArr: string
) => ({
  time: (arrival.diff(departure) / 60000).toFixed(0),
  distance,
  path,
  pathBounds,
  transitMode: 'bus',
  busRouteSegment: {
    depStop: departureStop.name,
    arrStop: arrivalStop.name,
    departure: `${route2BusDep.substring(0, 2)}:${route2BusDep.substring(
      2,
      4
    )}`,
    departureValue: departure,
    arrival: `${route2BusArr.substring(0, 2)}:${route2BusArr.substring(2, 4)}`,
    arrivalValue: arrival,
    numStops: arrivalStop.routeOrder - stops[0].routeOrder,
    stops: stops
      .map(({ name }: Stop) => name)
      .slice(stops[0].routeOrder + 1, arrivalStop.routeOrder),
  },
});

const getRoutePathLine = (
  routePath: any,
  departureStop: Stop,
  arrivalStop: Stop
) => {
  const index1 = getClosest(routePath, departureStop);
  let index2 = getClosest(routePath, arrivalStop);
  if (index1 > index2) {
    index2 = routePath.length - 1;
  }
  return [
    ...routePath
      .slice(index1, index2)
      .map(({ lat: latitude, lng: longitude }: any) => ({
        latitude,
        longitude,
      })),
    {
      latitude: arrivalStop.location._latitude,
      longitude: arrivalStop.location._longitude,
    },
  ];
};

const getDirections = async (req: any): Promise<DirectionsResponse> => {
  const stops = await db.getStops();
  const thing = stops
    .map(
      ({ location }, i) =>
        `${location._longitude},${location._latitude}${
          i < stops.length - 1 ? ';' : ''
        }`
    )
    .join('');
  const res1 = await fetch(
    `https://api.mapbox.com/directions-matrix/v1/mapbox/walking/${
      JSON.parse(req.origin).lng
    },${JSON.parse(req.origin).lat};${thing};${
      JSON.parse(req.destination).lng
    },${
      JSON.parse(req.destination).lat
    }?sources=0&destinations=all&annotations=distance,duration&access_token=pk.eyJ1Ijoiam9vbHM2MjUiLCJhIjoiY2trc2t3eXloMGJwaDJubG1wbHJvY2UzeSJ9.hbvg1PVBF3F_2l2OLEMvrg`
  );
  const res2 = await fetch(
    `https://api.mapbox.com/directions-matrix/v1/mapbox/walking/${
      JSON.parse(req.destination).lng
    },${
      JSON.parse(req.destination).lat
    };${thing}?sources=0&destinations=all&annotations=distance,duration&access_token=pk.eyJ1Ijoiam9vbHM2MjUiLCJhIjoiY2trc2t3eXloMGJwaDJubG1wbHJvY2UzeSJ9.hbvg1PVBF3F_2l2OLEMvrg`
  );

  const result = await res1.json();

  const result2 = await res2.json();

  // TOOD - Send walking route as well as bus route
  const walkingDuration = result.durations[0][12];
  const wakingDistance = result.distances[0][12];

  let {
    index: depIndex,
    distance: depDistance,
    duration: depDuation,
  } = getClosestStopIndex(result);

  const {
    index: arrIndex,
    distance: arrDistance,
    duration: arrDuation,
  } = getClosestStopIndex(result2);

  let departureStop = stops[depIndex];

  const arrivalStop = stops[arrIndex];

  if (departureStop.routeOrder === 10) {
    departureStop = stops[0];
  }

  const directionsRes1 = await fetch(
    `https://api.mapbox.com/directions/v5/mapbox/walking/${
      JSON.parse(req.origin).lng
    },${JSON.parse(req.origin).lat};${departureStop.location._longitude},${
      departureStop.location._latitude
    }?steps=true&access_token=pk.eyJ1Ijoiam9vbHM2MjUiLCJhIjoiY2trc2t3eXloMGJwaDJubG1wbHJvY2UzeSJ9.hbvg1PVBF3F_2l2OLEMvrg`
  );

  const directionsRes2 = await fetch(
    `https://api.mapbox.com/directions/v5/mapbox/walking/${
      arrivalStop.location._longitude
    },${arrivalStop.location._latitude};${JSON.parse(req.destination).lng},${
      JSON.parse(req.destination).lat
    }?steps=true&access_token=pk.eyJ1Ijoiam9vbHM2MjUiLCJhIjoiY2trc2t3eXloMGJwaDJubG1wbHJvY2UzeSJ9.hbvg1PVBF3F_2l2OLEMvrg`
  );

  const directions1Json = await directionsRes1.json();

  const directions2Json = await directionsRes2.json();

  let route1Path: any[] = [];

  let route3Path: any[] = [];

  directions1Json.routes[0].legs[0].steps.forEach((item: any) => {
    route1Path = [
      ...route1Path,
      ...item.intersections.map((item1: any) => ({
        latitude: item1.location[1],
        longitude: item1.location[0],
      })),
    ];
    return item;
  });

  console.log(directions1Json.routes[0]);

  depDuation = directions1Json.routes[0].duration;

  depDistance = directions1Json.routes[0].distance;

  directions2Json.routes[0].legs[0].steps.forEach((item: any) => {
    route3Path = [
      ...route3Path,
      ...item.intersections.map((item1: any) => ({
        latitude: item1.location[1],
        longitude: item1.location[0],
      })),
    ];
    return item;
  });
  console.log(directions2Json.routes[0].legs[0]);
  console.log(
    directions2Json.waypoints.forEach(({ location }: any) =>
      console.log(location)
    )
  );
  const routePath = await db.getRoutePath();
  const closest = getClosest(routePath, departureStop);
  const closest1 = getClosest(routePath, arrivalStop);

  const times = await timetableService.getTimes(departureStop.id);

  const currentTime = dayjs();

  let routeNumber1 = 0;

  let departureTime: Dayjs;

  times.some(({ scheduled, routeNumber }) => {
    let res = dayjs()
      .set('hour', parseInt(scheduled.substring(0, 2)))
      .set('minute', parseInt(scheduled.substring(2, 4)))
      .set('second', 0);
    if (res.isBefore(dayjs().set('hour', 1).set('minute', 0))) {
      res = res.add(1, 'day');
    }
    if (res.isAfter(currentTime.add(depDuation + 120, 'second'))) {
      departureTime = res;
      routeNumber1 = routeNumber;
      return true;
    }
  });
  const routes = await db.getRoute(routeNumber1);

  let { time: busArr } =
    arrivalStop.name === 'University Library'
      ? [...routes.stops].pop()
      : routes.stops.filter((el) => el.stop === arrivalStop.name)[0];

  const { time: busDep } = routes.stops.filter((el) =>
    departureStop.name === 'University Library'
      ? el.stop === 'University of Portsmouth' || el.stop === 'Library'
      : el.stop === departureStop.name
  )[0];

  let arrival = dayjs()
    .set('hour', parseInt(busArr.substring(0, 2)))
    .set('minute', parseInt(busArr.substring(2, 4)))
    .set('second', 0);
  if (arrival.isBefore(dayjs().set('hour', 1).set('minute', 0))) {
    arrival = arrival.add(1, 'day');
  }
  const arrivalTime = dayjs()
    .set('hour', parseInt(busArr.substring(0, 2)))
    .set('minute', parseInt(busArr.substring(2, 4)))
    .set('second', 0);
  const busDuration = (arrivalTime.diff(departureTime) / 60000).toFixed(0);

  let totalTime;

  const route1Bounds = getBounds(route1Path);

  const route3Bounds = getBounds(route3Path);

  const originRoute: any = {
    time: Math.round(depDuation / 60).toString(),
    distance: (Math.round((depDistance / 1609) * 10) / 10).toString(),
    path: route1Path,
    transitMode: 'walking',
    pathBounds: route1Bounds,
  };
  const destinationRoute: any = {
    time: Math.round(arrDuation / 60).toString(),
    distance: (Math.round((arrDistance / 1609) * 10) / 10).toString(),
    path: route3Path,
    transitMode: 'walking',
    pathBounds: route3Bounds,
  };

  let departureTimeValue;
  let arrivalTimeValue;

  const busRoutes: any[] = [];
  if (
    departureStop.routeOrder > arrivalStop.routeOrder &&
    arrivalStop.routeOrder !== 0
  ) {
    busArr = [...routes.stops].pop().time;
    arrival = dayjs()
      .set('hour', parseInt(busArr.substring(0, 2)))
      .set('minute', parseInt(busArr.substring(2, 4)))
      .set('second', 0);
    if (arrival.isBefore(dayjs().set('hour', 1).set('minute', 0))) {
      arrival = arrival.add(1, 'day');
    }

    const path = getRoutePathLine(routePath, departureStop, stops[0]);

    const bounds = getBounds(path);

    const route2 = getBusRoute(
      arrival,
      departureTime,
      depDistance,
      path,
      bounds,
      stops,
      departureStop,
      stops[0],
      busDep,
      busArr
    );
    busRoutes.push(route2);

    const libTimes = await timetableService.getTimes(stops[0].id);

    let departureTime1: Dayjs;
    let routeNumber12;

    libTimes.some(({ scheduled, routeNumber }) => {
      let res = dayjs()
        .set('hour', parseInt(scheduled.substring(0, 2)))
        .set('minute', parseInt(scheduled.substring(2, 4)))
        .set('second', 0);
      if (res.isBefore(dayjs().set('hour', 1).set('minute', 0))) {
        res = res.add(1, 'day');
      }
      if (res.isAfter(arrival)) {
        departureTime1 = res;
        routeNumber12 = routeNumber;
        return true;
      }
    });

    const routes1 = await db.getRoute(routeNumber12);

    const { time: route2BusDep } = routes1.stops[0];

    const { time: route2BusArr } = routes1.stops.filter((el) =>
      arrivalStop.name === 'University Library'
        ? el.stop === 'University of Portsmouth' || el.stop === 'Library'
        : el.stop === arrivalStop.name
    )[0];

    let arrival1 = dayjs()
      .set('hour', parseInt(route2BusArr.substring(0, 2)))
      .set('minute', parseInt(route2BusArr.substring(2, 4)))
      .set('second', 0);
    if (arrival1.isBefore(dayjs().set('hour', 1).set('minute', 0))) {
      arrival1 = arrival1.add(1, 'day');
    }

    const path2 = getRoutePathLine(routePath, stops[0], arrivalStop);

    const bounds2 = getBounds(path);

    const route21 = getBusRoute(
      arrival1,
      departureTime1,
      depDistance,
      path2,
      bounds2,
      stops,
      stops[0],
      arrivalStop,
      route2BusDep,
      route2BusArr
    );
    busRoutes.push(route21);
    const interval = arrival1.diff(arrival) / 60000;
    totalTime = (
      Number(originRoute.time) +
      Number(route2.time) +
      interval +
      Number(route21.time) +
      Number(destinationRoute.time)
    ).toString();
    departureTimeValue = departureTime.subtract(
      Number(originRoute.time),
      'minute'
    );
    arrivalTimeValue = arrival1.add(Number(destinationRoute.time), 'minute');
  } else {
    const path = getRoutePathLine(routePath, departureStop, arrivalStop);
    const bounds = getBounds(path);
    const route2 = getBusRoute(
      arrival,
      departureTime,
      depDistance,
      path,
      bounds,
      stops,
      departureStop,
      arrivalStop,
      busDep,
      busArr
    );
    busRoutes.push(route2);
    totalTime = (
      Number(originRoute.time) +
      Number(busRoutes[0].time) +
      Number(destinationRoute.time)
    ).toString();
    departureTimeValue = departureTime.subtract(
      Number(originRoute.time),
      'minute'
    );
    arrivalTimeValue = arrival.add(Number(destinationRoute.time), 'minute');
  }

  const overallPathBounds = getBounds([
    ...originRoute.path,
    ...destinationRoute.path,
    ...busRoutes[0].path,
    ...(busRoutes[1]?.path || []),
  ]);

  const returnValue: DirectionsResponse = {
    totalTime,
    routes: [originRoute, ...busRoutes, destinationRoute],
    busRoute: routes,
    departureTime: departureTimeValue.format('HH:mm'),
    arrivalTime: arrivalTimeValue.format('HH:mm'),
    departureTimeValue: departureTimeValue.toISOString(),
    arrivalTimeValue: arrivalTimeValue.toISOString(),
    overallPathBounds,
  };
  console.log(returnValue);
  return returnValue;
};

const getClosestStopIndex = (res: any) => {
  const distances = res.distances[0].slice(1);
  const durations = res.durations[0].slice(1);
  const index = distances.indexOf(Math.min(...distances));
  return { index, distance: distances[index], duration: durations[index] };
};

const getBounds = (path: any[]) => {
  var lats = [];
  var lngs = [];

  for (var i = 0; i < path.length; i++) {
    lats.push(path[i].latitude);
    lngs.push(path[i].longitude);
  }

  // calc the min and max lng and lat
  var minlat = Math.min.apply(null, lats),
    maxlat = Math.max.apply(null, lats);
  var minlng = Math.min.apply(null, lngs),
    maxlng = Math.max.apply(null, lngs);

  return {
    sw: { latitude: minlat, longitude: minlng },
    ne: { latitude: maxlat, longitude: maxlng },
  };
};

export default { getDirections };
