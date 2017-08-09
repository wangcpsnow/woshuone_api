var Lib = require('./lib.js')
module.exports = function (Router) {
	
	//文章列表
	Router.get("/posts", function(req, res, next) {
	    Lib.getData(req, res, next, "wp_posts");
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
	            res.send(obj);
	        });
	    });
	});

	return Router;
}