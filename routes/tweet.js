exports.post_tweet = function(database) {
	return function (req, res) {
		var text = req.body.text;

		if (text) {
			if (text.length <= 140) {
				var collection = database.get('posts');

		        collection.insert({"author": req.session.user.username, "author_id": req.session.user._id, "content": text,"postDate": Date() }, function (error) {
					if (error) {
						console.log(error);
						return res.redirect('/home');
					}

					return res.redirect('/home');
				});
			} else {
				res.redirect('/home');//, { message : 'tweet too long' });
			}
		} else {
			res.redirect('/home');//, { message : 'tweet empty' });
		}
	}
}