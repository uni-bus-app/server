import { NextFunction, Request, Response } from 'express';
import db from '../db';
import { directionsService, timetableService } from '../services';

const getStops = async (req: Request, res: Response, next: NextFunction) => {
  const { lat, lng } = req.query;
  console.log(lat, lng);
  if (lat && lng) {
    try {
      const stops = await directionsService.getClosestStop({ lat, lng });
      res.send(stops);
    } catch (error) {
      next(error);
    }
  } else {
    try {
      const stops = await db.getStops();
      res.send(stops);
    } catch (error) {
      next(error);
    }
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
  const { body, query } = req;
  try {
    res.send(await db.syncDB(body, !!query.new_format));
  } catch (error) {
    next(error);
  }
};

const getClosestStop = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { body } = req;
  try {
    res.send(await directionsService.getClosestStop(body.position));
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

const getTimetables = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await timetableService.getTimetables(req.params.id);
    res.send(data);
  } catch (error) {
    next(error);
  }
};

const uploadTimetablePdf = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // console.log(req.files);
    const { timetableID, timesDocs } =
      await timetableService.insertTimesFromPDF((req.files.file as any).data);
    res.send({ timetableID, timesDocs });
  } catch (error) {
    next(error);
  }
};

const publishTimetable = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id, action } = req.query;
  try {
    if (action === 'publish' && typeof id === 'string') {
      timetableService.publishTimetable(id);
    }
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
  getClosestStop,
  getMessages,
  getServiceUpdates,
  getTimetables,
  uploadTimetablePdf,
  publishTimetable,
};
