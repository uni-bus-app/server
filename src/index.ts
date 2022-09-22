import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import { cert, initializeApp } from 'firebase-admin/app';
import { readFileSync } from 'fs';
import db from './db';
import routes from './routes';
const { GITHUB_ACTION, GOOGLE_CREDENTIALS } = process.env;
const pdf = require('pdf-parse');

// const options = GITHUB_ACTION
//   ? {
//       credential: cert(JSON.parse(GOOGLE_CREDENTIALS)),
//     }
//   : undefined;
// initializeApp(options);

initializeApp();

db.updateChecksums();

// const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

// let dataBuffer = readFileSync('src/u2-jan-22.pdf');
// pdf(dataBuffer).then((data: any) => {
//   data.text.split('\n').forEach((item: string) => {
//     if (days.some((x) => item.includes(x))) {
//       console.log('DAY', item);
//     } else {
//       console.log(item);
//     }
//   });
//   // console.log(data.text);
// });

const app = express().use(cors());
const PORT = process.env.PORT || 8080;

app.use(routes);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
