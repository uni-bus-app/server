import express, { Router } from 'express';
import controllers from '../controllers';

const router = Router();

router.get('/stops', controllers.getStops);
router.get('/stops/:stopID/times', controllers.getTimes);
router.get('/routes', controllers.getRoutes);
router.get('/u1routepath', controllers.getRoutePath);
router.post('/sync', express.json(), controllers.syncLocalDB);
// router.post('/stops', express.json(), controllers.getClosestStop);
router.get('/messages', controllers.getMessages);

export default router;
