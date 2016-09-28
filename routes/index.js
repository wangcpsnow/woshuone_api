/**
 * mysql  database: wordpress table: wp_posts
 * @type {[type]}
 */
var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'API for 我说呢'
    });
});

router.get("/posts", function(req, res, next) {
    getData(req, res, next, "wp_posts");
});

router.get("/terms", function(req, res, next) {
    getData(req, res, next, "wp_terms");
});

router.get("/comments", function(req, res, next) {
    getData(req, res, next, "wp_comments");
});

function getData(req, res, next, dbname) {
    var query = req.query;
    req.getConnection(function(err, connection) {
        if (err) return next(err);
        var url = 'SELECT * from ' + dbname;
        if (!isEmptyObj(query)) {
            url += " where ";
            for (var key in query) {
                url += key + " = " + query[key] + " AND ";
            }
            url = url.substr(0, url.length - 4);
        }
        if(dbname == "wp_posts"){
            url += " ORDER BY ID desc";
        }
        connection.query(url, [], function(err, results) {
            if (err) return next(err);
            res.send(results);
        });
    });
}

function isEmptyObj(obj) {
    for (var key in obj) {
        return false;
    }
    return true;
}

module.exports = router;