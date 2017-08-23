var Lib = require('./lib.js')
module.exports = function (Router) {
	
	//文章列表
	Router.get("/posts", function(req, res, next) {
	    Lib.getData(req, res, next, "wp_posts");
	});

	// 获取某个分类的所有文章
	Router.get('/posts/terms/:id', function (req, res, next) {
		var id = req.params.id;
		var url = `select ID,post_title,post_modified from wp_posts where ID in (select object_id from wp_term_relationships where term_taxonomy_id = ${id});`;
		req.getConnection(function(err, connection) {
	    	connection.query(url, [], function(err, results) {
	            if (err) return next(err);
	            res.send(results);
	        });
	    });
	});
	//发表文章
	Router.post("/posts", function(req, res, next) {
	    var obj = req.body;
	    obj.post_modified = Lib.parseTime();
	    var keys = [],
	        vals = [];
	    for (var key in obj) {
	        keys.push(key);
	        vals.push('"' +  obj[key] + '"');
	    }
	    req.getConnection(function(err, connection) {
	        if (err) return next(err);
	        var url = 'INSERT INTO wp_posts (' +  keys.join(',') + ') VALUES (' + vals.join(',') + ')';
	    	connection.query(url, [], function(err, results) {
	            if (err) return next(err);
	            res.send(results);
	        });
	    });
	});

	return Router;
}