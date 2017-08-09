var Lib = require('./lib.js');

module.exports = function (Router) {
	/*
	 * title: 评论列表
	 * args: comment_POST_ID(文章ID)
	 **/
	Router.get("/comments", function(req, res, next) {
	    Lib.getData(req, res, next, "wp_comments");
	});

	/**
	 * 添加评论
	 */
	Router.post('/comments', function (req, res, next) {
	    var obj = req.body;
	    obj.comment_date = Lib.parseTime();
	    var keys = [],
	        vals = [];
	    for (var key in obj) {
	        keys.push(key);
	        vals.push('"' +  obj[key] + '"');
	    }
	    req.getConnection(function(err, connection) {
	        if (err) return next(err);
	        var url = 'INSERT INTO wp_comments (' +  keys.join(',') + ') VALUES (' + vals.join(',') + ')';
		connection.query(url, [], function(err, results) {
	            if (err) return next(err);
	            res.send(obj);
	        });
	    });
	});

	return Router;
}