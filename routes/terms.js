var Lib = require('./lib.js');
module.exports = function (Router) {
	//文章的所有分类
	Router.get("/terms", function(req, res, next) {
	    Lib.getData(req, res, next, "wp_terms");
	});

	/*
	 * title: 某个文章的分类
	 * args: object_id(文章ID)
	 **/
	Router.get("/terms/post/:id", function(req, res, next) {
		var id = req.params.id;
		var A = 'wp_terms';
		var B = 'wp_term_relationships';
		var url = `select ${A}.term_id,${A}.name,${B}.object_id as ArticleId from ${A} `;
		url += `left join ${B} on ${A}.term_id = ${B}.term_taxonomy_id `;
		url += `where ${B}.object_id = ${id};`;
	    req.getConnection(function(err, connection) {
	    	connection.query(url, [], function(err, results) {
	            if (err) return next(err);
	            res.send(results);
	        });
	    });
	});

	Router.post("/addterms", function(req, res, next) {
		var obj = req.body;
		req.getConnection(function(err, connection) {
	        if (err) return next(err);
	        var url = 'INSERT INTO wp_term_relationships (' +  keys.join(',') + ') VALUES (' + vals.join(',') + ')';
	    	connection.query(url, [], function(err, results) {
	            if (err) return next(err);
	            res.send(results);
	        });
	    });
	});
	return Router;
}
