var express = require('express');
var http = require('http');

var mongo = require('mongodb');
var monk = require('monk');
var db = monk('127.0.0.1:27017/hirundo');

var router = require('./router');

var app = express();

app.configure(function() {
	app.set('port', process.env.PORT || 3000);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');

	app.use(express.bodyParser());
	app.use(express.cookieParser('cookieSecret'));
	app.use(express.session({ secret: 'sessionSecret' }));
	app.use(app.router);
	app.use(express.static(__dirname + '/public'));
	app.use(express.static(__dirname + '/uploads'));
});

app.use('development', function() {
	app.errorHandler({
		showStack: true,
		dumpExceptions: true
	});
});

router(app, db);

http.createServer(app).listen(app.get('port'), function() {
	console.log('express server listening on port ' + app.get('port'));
});