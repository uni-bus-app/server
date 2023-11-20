import { NextFunction, Request, Response } from 'express';
import db from '../db';
import { directionsService, timetableService } from '../services';
import { parseStringPromise } from 'xml2js';
import fetch from 'node-fetch';

const getStops = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const stops = await db.getStops();
    res.send(stops);
  } catch (error) {
    next(error);
  }
};

const getTimes = async (req: Request, res: Response, next: NextFunction) => {
  const { stopID } = req.params;
  const { date } = req.query;
  console.log(date);
  try {
    const times = await timetableService.getTimes(stopID, date?.toString());
    if (times) {
      res.send(times);
    } else {
      res.status(404).send({ message: 'Invalid stop ID' });
    }
  } catch (error) {
    next(error);
  }
};

const getRoutes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const routes = await db.getRoutes();
    res.send(routes);
  } catch (error) {
    next(error);
  }
};

const getRoutePath = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const routePath = await db.getRoutePath();
    res.send(routePath);
  } catch (error) {
    next(error);
  }
};

const syncLocalDB = async (req: Request, res: Response, next: NextFunction) => {
  const { body } = req;
  try {
    res.send(await db.syncDB(body));
  } catch (error) {
    next(error);
  }
};

const getDirections = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { body } = req;
  try {
    res.send(await directionsService.getDirections(body));
  } catch (error) {
    next(error);
  }
};

const getMessages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await db.getMessages();
    res.send(data);
  } catch (error) {
    next(error);
  }
};

const getServiceUpdates = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await timetableService.getServiceUpdates();
    res.send(data);
  } catch (error) {
    next(error);
  }
};

function simplifyObject(obj: any) {
  for (const key in obj) {
    if (Array.isArray(obj[key]) && obj[key].length === 1) {
      obj[key] = simplifyObject(obj[key][0]);
    } else if (Array.isArray(obj[key])) {
      obj[key] = obj[key].map((item: any) => simplifyObject(item));
    } else if (typeof obj[key] === 'object') {
      obj[key] = simplifyObject(obj[key]);
    }
  }
  return obj;
}

const getVehicles = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await fetch(
      `https://data.bus-data.dft.gov.uk/api/v1/datafeed/11393/?api_key=${process.env.GOV_UK_API_KEY}&lineRef=U1&operatorRef=FHAM`
    );
    const text = await data.text();
    const thing = await parseStringPromise(text);
    console.log(thing);
    const u1 =
      thing.Siri.ServiceDelivery[0].VehicleMonitoringDelivery[0].VehicleActivity.filter(
        (item: any) =>
          item.MonitoredVehicleJourney?.[0]?.LineRef?.[0]?.toLowerCase() ===
          'u1'
      );
    const simplifiedData = simplifyObject(u1);
    console.log(simplifiedData);
    res.send(simplifiedData);
  } catch (error) {
    next(error);
  }
};

export default {
  getStops,
  getTimes,
  getRoutes,
  getRoutePath,
  syncLocalDB,
  getDirections,
  getMessages,
  getServiceUpdates,
  getVehicles,
};
