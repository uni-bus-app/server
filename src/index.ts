import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import { initializeApp } from 'firebase-admin/app';
import db from './db';
import routes from './routes';

initializeApp();

if (process.env.NODE_ENV === 'production') {
  db.updateChecksums();
}

const app = express().use(cors());
const PORT = process.env.PORT || 8080;

app.use('/api', routes);

const server = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});

export { app, server };
