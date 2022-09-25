import express, { Router } from 'express';
import controllers from '../controllers';
import fileUpload from 'express-fileupload';

const router = Router();

// User routes
router.get('/stops', controllers.getStops);
router.get('/stops/:stopID/times', controllers.getTimes);
router.get('/routes', controllers.getRoutes);
router.get('/u1routepath', controllers.getRoutePath);
router.post('/sync', express.json(), controllers.syncLocalDB);
// router.post('/stops', express.json(), controllers.getClosestStop);
router.get('/messages', controllers.getMessages);

// Admin routes
router.post('/timetable/pdf', fileUpload(), controllers.uploadTimetablePdf);
router.patch('/timetable', controllers.publishTimetable);
router.get('/timetables', controllers.getTimetables);
router.get('/timetables/:id', controllers.getTimetables);

export default router;
