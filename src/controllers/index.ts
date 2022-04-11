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
  try {
    const times = await db.getTimes(req.params.stopID);
    res.send(times);
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
  try {
    res.send(await db.syncDB(req.body));
  } catch (error) {
    next(error);
  }
};

const getDirections = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.send(await directionsService.getDirections(req.body));
  } catch (error) {
    next(error);
  }
};

const nativeAppSignup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await db.addTester(req.body.email);
    res.send({});
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
  nativeAppSignup,
  getMessages,
};
