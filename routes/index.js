var express = require('express');
var router = express.Router();
const fs = require('fs')
const kakaoList = require('../kakao')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'THE DRAW Bot!'});
});

router.get('/subscribe', function(req, res, next) {
  let userjson = fs.readFileSync("./user.json","utf-8")
  let users = JSON.parse(userjson)
  let [count1, count2, count3] = [users.draw1.length,users.draw2.length,users.draw3.length]

  res.render('subscribe', { title: 'THE DRAW Bot!', draw1:count1, draw2:count2, draw3:count3});
});

module.exports = router;
