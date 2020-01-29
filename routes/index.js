var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/doThing', function(req, res, next) {
  //res.render('index', { title: 'Express' });
  res.send('ye boi');
});

module.exports = router;
