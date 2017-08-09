/**
 * mysql  database: wordpress table: wp_posts
 * @type {[type]}
 */
var express = require('express');
var router = express.Router();

var Posts = require('./posts.js');
var Comments = require('./comments.js');
var Terms = require('./terms.js');

router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'API for 我说呢'
    });
});

router = Posts(router);
router = Comments(router);
router = Terms(router);


module.exports = router;
