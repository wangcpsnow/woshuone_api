var Lib = require('./lib.js')
module.exports = function (Router) {

	//文章列表
	Router.get("/posts", function(req, res, next) {
		if (req.query['ID']) {
			req.getConnection(function(err, connection) {
		        if (err) return next(err);
		        var url = 'update wp_posts set heats = heats + 1 where ID = ' + req.query['ID'];
		    	connection.query(url, [], function(err, results) {
		            if (err) return next(err);
		            Lib.getData(req, res, next, "wp_posts");
		        });
		    });
		}
		else {
			Lib.getData(req, res, next, "wp_posts");
		}

	});

	// 获取某个分类的所有文章
	Router.get('/posts/terms/:id', function (req, res, next) {
		var id = req.params.id;
		var url = `select ID,post_title,post_modified from wp_posts where ID in (select object_id from wp_term_relationships where term_taxonomy_id = ${id}) ORDER BY ID desc;`;
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

	// 更新文章
	Router.put('/posts/:id', function (req, res, next) {
		var obj = req.body;
		if (!obj.post_content) {
			res.status(400).send('post_content 是必填项');return;
		}
		req.getConnection(function(err, connection) {
	        if (err) return next(err);
	        var url = `update wp_posts set post_content = "${obj.post_content}" where ID = ${req.params.id}`;
	    	connection.query(url, [], function(err, results) {
	            if (err) return next(err);
	            res.send('编辑成功');
	        });
	    });
	});

	// 删除文章
	Router.delete('/posts/:id', function (req, res, next) {
		req.getConnection(function(err, connection) {
	        if (err) return next(err);
	        var url = `delete from wp_posts where ID = ${req.params.id}`;
	    	connection.query(url, [], function(err, results) {
	            if (err) return next(err);
	            res.send(results);
	        });
	    });
	})

	return Router;
}
