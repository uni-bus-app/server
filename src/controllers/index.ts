import { NextFunction, Request, Response } from 'express';
import db from '../db';
import {
  directionsService,
  liveTrackingService,
  timetableService,
} from '../services';

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

const getVehicles = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await liveTrackingService.getVehicles();
    res.send(data);
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
