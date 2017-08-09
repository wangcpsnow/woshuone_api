
module.exports = {
	GET: function (req, res, next, dbname) {
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
			var val = query[key];
			val = typeof val === 'string' ? "'" + val + "'" : val;
			url += key + " = " + val + " AND ";
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
}

function isEmptyObj(obj) {
    for (var key in obj) {
        return false;
    }
    return true;
}
