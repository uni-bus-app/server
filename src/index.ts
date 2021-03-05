import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import admin from 'firebase-admin';
import { serviceAccount } from './serviceAccount';

const app = express().use(cors());

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // credential: admin.credential.applicationDefault()
});
import {
  updateChecksums,
  getChecksums,
  getStops,
  getTimes,
  getAllTimes,
  getRoutes,
  getRoutePath,
  syncDB,
} from './firestore';
import { getDirections } from './directions';
updateChecksums();

async function getStopsAPI(req: Request, res: Response, next: NextFunction) {
  try {
    const stops = await getStops();
    res.send(stops);
  } catch (error) {
    next(error);
  }
}

async function getTimesAPI(req: Request, res: Response, next: NextFunction) {
  try {
    const times = await getTimes(req.params.stopID);
    res.send(times);
  } catch (error) {
    next(error);
  }
}

async function getRoutesAPI(req: Request, res: Response, next: NextFunction) {
  try {
    const routes = await getRoutes();
    res.send(routes);
  } catch (error) {
    next(error);
  }
}

async function getRoutePathAPI(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const routePath = await getRoutePath();
    res.send(routePath);
  } catch (error) {
    next(error);
  }
}

async function syncLocalDBAPI(req: Request, res: Response, next: NextFunction) {
  try {
    res.send(await syncDB(req.body));
  } catch (error) {
    next(error);
  }
}

async function getDirectionsAPI(req: Request, res: Response, next: NextFunction) {
  try {
    res.send(await getDirections(req.body));
  } catch (error) {
    next(error);
  }
}

/******************************************
 * ROUTES
 * ************************************** */

app.get('/stops', getStopsAPI);
app.get('/stops/:stopID/times', getTimesAPI);
app.get('/routes', getRoutesAPI);
app.get('/u1routepath', getRoutePathAPI);
app.post('/sync', express.json(), syncLocalDBAPI);
app.post('/directions', express.json(), getDirectionsAPI);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
