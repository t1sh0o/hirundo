var ObjectId=require('mongodb').ObjectID;

exports.get_user = function(database) {
	return function (req, res) {
		var user_id = req.params.user;
		var user_obj_id = ObjectId(user_id);

		var collection = database.get('users');
		
		
		collection.find({"_id": user_obj_id}, function(error, user) {
			if (error) {
				console.log(error);
				return res.redirect('/');
			}

			collection.find({$and: [{"_id": ObjectId(req.session.user._id)}, {"follow": user[0].username}]}, function(error, follow_result) {
				if (error) {
					console.log(error);
					return res.redirect('/');
				}
				if(follow_result.length){
					var follow = 1;
				} else {
					var follow = 0;
				}

				var users = new Array();
				users.push(user[0].username);

				for (var i = 0; i < user[0].follow.length; i++) {
					users.push(user[0].follow[i]);
				};

				collection = database.get('posts');	
				
				collection.find({"author": {$in: users} }, { limit : 10, sort : { postDate : -1 } }, function(error, posts) {
					if (error) {
						console.log(error);
						return res.redirect('/home');
					}

					res.render('home/user', { posts: posts, user_open: user[0], follow: follow});
				});
			});
		});
	}
}

exports.get_follow = function(database) {
	return function (req, res) {
		var user_id = req.params.id;
		var collection = database.get('users');

		collection.find({"_id": ObjectId(user_id)}, function(error, user) {
			if (error) {
				console.log(error);
				return res.redirect('/');
			}

			collection.update({"_id": ObjectId(req.session.user._id)}, {$push: {"follow": user[0].username} }, function(error){
				if (error) {
					console.log(error);
					return res.redirect('/user/' +  user_id);
				};

				res.redirect('/home');
			});
		});
	}
}

exports.get_unfollow = function(database) {
	return function (req, res) {
		var user_id = req.params.id;
		var collection = database.get('users');
		console.log(user_id);
		collection.find({"_id": ObjectId(user_id)}, function(error, user) {
			if (error) {
				console.log(error);
				return res.redirect('/');
			}
			console.log(req.session.user._id);
			console.log(user[0].username);
			collection.update({"_id": ObjectId(req.session.user._id)}, {$pop: {"follow": user[0].username} }, function(error){
				if (error) {
					console.log(error);
					return res.redirect('/user/' +  user_id);
				};

				res.redirect('/home');
			});
		});
	}
}