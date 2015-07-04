var express = require('express');
var router = express.Router();
var isAuth = require('../middleware/authHandler');


router.get('/', isAuth, function(req, res, next) {
	res.send({"yourResource" : "yourValue"});
});

module.exports = router;