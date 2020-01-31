import express from 'express';
import cors from 'cors';
var router = express.Router().use(cors());
//import UoPDF from 'uopdf';
let uopdf = require("uopdf");
const fs = require('fs');

import { Observable } from 'rxjs/Observable';
import { IncomingForm } from 'formidable';

/* GET home page. */
router.get('/doThing', function(req, res, next) {

  

  UoPDF.getStopsAndTimes("C:/Users/jools/Projects/UoPDF/u1.pdf", true, true);

  UoPDF.currentStops.subscribe(data => {console.log(data)});
});





router.post('/uploadtimes', function(req, res, next) {
  

  const form = IncomingForm();

  form.on('file', (field, file) => {
    console.log('file', file.path);
    const readStream = fs.createReadStream(file.path);
    
    let UoPDF = require("uopdf");

    UoPDF.getStopsAndTimes(file.path, true, true);

    UoPDF.currentStops.subscribe(data => {console.log(data)});
    
  });
  form.on('end', () => {
    res.json();
  })
  form.parse(req);
})

module.exports = router;
