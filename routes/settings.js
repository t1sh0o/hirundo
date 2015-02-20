var fs = require('fs');
var path = require('path');
var crypto = require('crypto');
var ObjectId=require('mongodb').ObjectID;

exports.get_settings = function(database) {
	return function (req, res) {
		var collection = database.get('users');

		collection.find({"_id": ObjectId(req.session.user._id)}, function(error, user){
			if (error) {
				console.log(error);
				res.redirect('/home')
			}
			res.render('home/settings', { user: user[0] });	
		});
	}
}

exports.post_upload = function(database) {
	return function (req, res) {
		var user_id = req.session.user._id
		var filepath = './uploads/' + user_id + '.jpg';
		var database_filepath = user_id + '.jpg';

		var tmpPath = req.files.file.path;
		var targetPath = path.resolve(filepath);

		var collection = database.get('users');

		if (path.extname(req.files.file.name).toLowerCase() === '.jpg') {
			fs.rename(tmpPath, targetPath, function (error) {
				if (error) {
					console.log(error);
					res.redirect('/settings');
				}

				collection.update({"_id": ObjectId(user_id)},{$set: {"image": database_filepath}}, function (error) {
					if (error) {
						console.log(error);
						res.redirect('/settings');
					}

					res.redirect('/home');
				});
			});
		} else {
			fs.unlink(tmpPath, function (error) {
				if (error) {
					console.log(error);
					res.redirect('/settings');
				}

				res.render('home/settings', { message: 'only jpg allowed' });
			});
		}
	}
}