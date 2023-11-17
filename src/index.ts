import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import { cert, initializeApp } from 'firebase-admin/app';
import db from './db';
import routes from './routes';
const { GITHUB_ACTION, GCP_SA_KEY } = process.env;

const options = GITHUB_ACTION
  ? {
      credential: cert(JSON.parse(GCP_SA_KEY)),
    }
  : undefined;
initializeApp(options);

db.updateChecksums();

const app = express().use(cors());
const PORT = process.env.PORT || 8080;

app.use('/api', routes);

const server = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});

export { app, server };
