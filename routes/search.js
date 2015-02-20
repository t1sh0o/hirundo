exports.post_search = function(database) {
	return function (req, res) {
		var username = req.body.username;
		var collection = database.get('users');
		if(username.length > 0) {
			var regex = new RegExp('.*' + username + '.*', 'i');

	        collection.find({"username": {$regex: regex } }, function (error, result) {
				if (error) {
					console.log(error);
					return res.redirect('/home');
				}

				res.render('home/search', { users: result});
			});
	    } else {
	    	res.render('home/search', {message: 'Please enter username to search', users: []});
	    }
	}
}

exports.get_all = function(database) {
	return function (req, res) {
		var collection = database.get('users');

        collection.find({}, function (error, result) {
			if (error) {
				console.log(error);
				return res.redirect('/home');
			}

			res.render('home/search', { users: result});
		});

	}
}