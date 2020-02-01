import express from 'express';
import cors from 'cors';
import { IncomingForm } from 'formidable';
import { TimesService } from "../timesService";
import { u1 } from '../times'
//import { Database } from "../db";
const router = express.Router().use(cors());
const UoPDF = require('uopdf');



/* GET times from database */
router.get('/gettimes', function(req, res, next) {

  //readDB();
  const times = new TimesService();

  let thing = times.getLongString("a", u1);

  console.log(thing)


  const object = times.getStopTimes(thing, u1);

  console.log(object);

  res.send(object);

});

/* POST pdf file and read times. */
router.post('/uploadtimes', function(req, res, next) {

  const form = IncomingForm();

  form.on('file', (field, file) => {

    UoPDF.getStopsAndTimes(file.path, true, true);

    UoPDF.currentStops.subscribe(data => {
      console.log(data);
      


    });

  });
  form.on('end', () => {
    res.json();
  })
  form.parse(req);
});

export default router;
