import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import { cert, initializeApp } from 'firebase-admin/app';
import db from './db';
import routes from './routes';
const { GITHUB_ACTION, GOOGLE_CREDENTIALS } = process.env;

const options = GITHUB_ACTION
  ? {
      credential: cert(JSON.parse(GOOGLE_CREDENTIALS)),
    }
  : undefined;
initializeApp(options);

db.updateChecksums();

const app = express().use(cors());
const PORT = process.env.PORT || 8080;

app.use(routes);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
