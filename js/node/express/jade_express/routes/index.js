var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Express',
    name: "hd",
  });
});

router.get('/dust/:title', function(req, res, next) {
  console.log(req.params.title)
  res.render('title.dust', {
    title: req.params.title
  });
});
module.exports = router;