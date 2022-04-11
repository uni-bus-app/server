import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import { applicationDefault, initializeApp } from 'firebase-admin/app';
import db from './db';
import routes from './routes';

initializeApp({ credential: applicationDefault() });

db.updateChecksums();

const app = express().use(cors());
const PORT = process.env.PORT || 8080;

app.use(routes);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
