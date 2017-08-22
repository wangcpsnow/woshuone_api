/**
 * mysql  database: wordpress table: wp_posts
 * @type {[type]}
 */
var express = require('express');
var router = express.Router();
var multer  = require('multer');

var Posts = require('./posts.js');
var Comments = require('./comments.js');
var Terms = require('./terms.js');

router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'API for 我说呢'
    });
});

var upload = multer({ dest: 'uploads/' });
router.post('/upload', upload.single('imgFile'), function (req, res, next) {
	console.log(upload.filename);
	res.send('ok');
});

router = Posts(router);
router = Comments(router);
router = Terms(router);


module.exports = router;
