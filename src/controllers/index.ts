import { NextFunction, Request, Response } from 'express';
import db from '../db';
import { directionsService } from '../services';

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
  try {
    const times = await db.getTimes(stopID);
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

export default {
  getStops,
  getTimes,
  getRoutes,
  getRoutePath,
  syncLocalDB,
  getDirections,
  getMessages,
};
