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

//文章列表
router.get("/posts", function(req, res, next) {
    getData(req, res, next, "wp_posts");
});

//文章的所有分类
router.get("/terms", function(req, res, next) {
    getData(req, res, next, "wp_terms");
});

/*
 * title: 评论列表
 * args: comment_POST_ID(文章ID)
 **/
router.get("/comments", function(req, res, next) {
    getData(req, res, next, "wp_comments");
});

/*
 * title: 某个文章的分类
 * args: object_id(文章ID)
 **/
router.get("/postterms", function(req, res, next) {
    getData(req, res, next, "wp_term_relationships");
});

function getData(req, res, next, dbname) {
    var query = req.query,
        pageIndex = 0,
        pageSize = 10;
    if(query["pageIndex"]){
        pageIndex = query.pageIndex;
        delete query.pageIndex;
    }
    if(query.pageSize){
        pageSize = query.pageSize;
        delete query.pageSize;
    }

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
        if(pageIndex){
            url += " limit " + (pageIndex-1)*pageSize + "," + pageSize;
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