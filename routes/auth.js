var crypto = require('crypto');

exports.post_login = function(database) {
	return function (req, res) {
		var email = req.body.email;
		var password = req.body.password;

		if (email && password) {
			password = crypto.createHash('md5').update(password).digest('hex');

			var collection = database.get('users');	
			collection.find({"email": email, "password": password}, function(error, result) {
				if (error) {
					console.log(error);
					return res.redirect('/');
				}

				if (result.length == 1) {
					req.session.user = result[0];
					return res.redirect('/home');
				} else {
					return res.render('site/index', { login_message: ' Incorrect email or password' });
				}
			});
		} else {
			// fields empty
			return res.redirect('/');
		}
	}
}

exports.post_register = function(database) {
	return function (req, res) {
		var email = req.body.email;
		var name = req.body.name;
		var password = req.body.password;
		var password_w = req.body.password_w;

		if (email && name && password && password_w) {
			if (password == password_w) {
				password = crypto.createHash('md5').update(password).digest('hex');

				var collection = database.get('users');

				collection.find({"email": email}, function(error, result) {
					if (error) {
						console.log(error);
						return res.redirect('/');
					}

					if (result.length > 0) {
						return res.render('site/index', { message: 'email exists' });
					} else {
				        collection.insert({"username" : name, "email" : email, "password" : password, "regDate": Date(), "follow" : new Array(), image: ""}, function (error) {
				            if (error) {
								console.log(error);
								return res.redirect('/');
				            }
				            collection.find({"email": email, "password": password}, function(error, result) {
								if (error) {
									console.log(error);
									return res.redirect('/');
								}

								if (result.length == 1) {
									req.session.user = result[0];
									return res.redirect('/home');
								} else {
									return res.redirect('/');
								}
							});
						});
					}
				});
			} else {
				return res.render('site/index', { message: 'passwords dont match' });
			}
		} else {
			return res.render('site/index', { message: 'fields are empty' });
		}
	}
}

exports.get_logout = function(req, res) {
	req.session.destroy();
	res.redirect('/');
}