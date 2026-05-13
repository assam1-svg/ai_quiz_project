var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.redirect("/signup");
});

router.get('/signin', function(req, res) {
  res.render("signin");
});

router.get('/signup', function(req, res) {
  res.render("signup");
});

module.exports = router;