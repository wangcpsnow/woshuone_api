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

	/**
	 * [description] 文章添加标签
	 */
	Router.post("/addterms", function(req, res, next) {
		var obj = req.body;
	    var object_id = obj.object_id;
	    var terms = obj.term_taxonomy_id;
	    if (!object_id || !terms) {
	        res.status(400).send('参数校验失败');return;
	    }
	    terms = terms.split(',');
	    req.getConnection(function(err, connection) {
	        if (err) return next(err);
			var url = `INSERT INTO wp_term_relationships (object_id, term_taxonomy_id) VALUES (${object_id}, ${terms[0]})`;
	        for (var i=1,l=terms.length;i<l;i++) {
	        	url += `,(${object_id}, ${terms[i]})`;
	        }
	        url += ';'        
	        // console.log(url);
	     	connection.query(url, [], function(err, results) {
	     	    if (err) return next(err);
	     	    res.send(results);
	        });
		});
	});
	
	return Router;
}
