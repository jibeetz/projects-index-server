var express = require('express');
var bodyParser = require("body-parser");
var fs = require("fs");
const async = require("async");
const path = require("path");
var app = express();

app.use(express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(function (req, res, next) {

	// Website you wish to allow to connect
	res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8081');

	// Request methods you wish to allow
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

	// Request headers you wish to allow
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

	// Set to true if you need the website to include cookies in the requests sent
	// to the API (e.g. in case you use sessions)
	res.setHeader('Access-Control-Allow-Credentials', true);

	// Pass to next layer of middleware
	next();
});

// app.get('/data', function (req, res) {
// 	res.sendFile(__dirname + "/public/" + "data.js");
// })

app.get('/view', function (req, res) {

	console.log('load view no param');
	res.sendFile(__dirname + "/public/" + "view.html");

})

app.get('/view/:file', function (req, res) {

	console.log('load view with params');
	res.sendFile(__dirname + "/public/" + "view.html");

})

app.get('/files', function (req, res) {

	var filesList= [];
	fs.readdir('./public/data', (err, files) => {
		files.forEach(file => {
			filesList.push(file);
		});

		res.send(filesList);
	})

})

app.get('/files/:file', function (req, res) {

	console.log('req.params.file', req.params.file);
	res.sendFile(__dirname + '/public/data/file-' + req.params.file + '.json');

})

app.get('/paste', function (req, res) {

	res.sendFile(__dirname + "/public/" + "paste.html");

})

app.post('/data', function (req, res) {

	var data = req.body;

	fs.writeFile(__dirname + '/public/data/' + data.id + '.json', JSON.stringify(data), function (err) {
		if (err) return console.log(err);
		console.log('Appended!');

		res.sendStatus(200);
	});
})

app.get('/sites', function (req, res) {

	fs.readdir('./public/data', (err, files) => {

		files = files.map(file => './public/data/' + file);

		let data = async.map(files, fs.readFile, (err, results) => {
			if (err) return reject(err);

			let dataResults = results.map(JSON.parse)

			res.send(dataResults);
		});
	})
})

var server = app.listen(9595, function () {

	var host = server.address().address
	var port = server.address().port

	console.log("Example app listening at http://%s:%s", host, port)
})