exports.index = function (database) {
	return function(req, res) {
		var username = req.session.user.username;
		var posts_collection = database.get('posts');	
		var	users_collection = database.get('users');
		
		var users = new Array();
		users.push(username);

		for (var i = 0; i < req.session.user.follow.length; i++) {
			users.push(req.session.user.follow[i]);
		}

		posts_collection.find({"author": {$in: users} }, { limit : 20, sort : { postDate : -1 } }, function(error, result) {
			if (error) {
				console.log(error);
				return res.redirect('/home');
			}
			var follows_count = users.length -1;

			users_collection.find({"username": {$in: users}}, function(error, users_result) {
				if (error) {
					console.log(error);
					return res.redirect('/home');
				}

				for (var i = 0; i < result.length; i++) {
					for (var j = 0; j < users_result.length; j++) {
						if(result[i].author == users_result[j].username){
							result[i].image = users_result[j].image;
						}
					}
				}

				posts_collection.find({"author": username}, function(error, tweets_count_result){
					if (error) {
						console.log(error);
						return res.redirect('/home');
					} 
					tweets_count = tweets_count_result.length;

					users_collection.find({"follow" : username},  function(error, followers_count_result) {
						if (error) {
							console.log(error);
							return res.redirect('/home');
						} 
						var followers_count = followers_count_result.length;
					
						res.render('home/index', { posts: result, tweets: tweets_count, follows: follows_count, followers: followers_count});
					});
				});
			});
		});
	}
}