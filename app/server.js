var express = require('express');
var bodyParser = require("body-parser");
var fs = require("fs");
const async = require("async");
const path = require("path");
var app = express();

app.use(express.static('app/view'));

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

app.get('/teamslist', function (req, res) {

	var filesList= [];
	fs.readdir('./app/data', (err, files) => {
		files.forEach(file => {
			filesList.push(file);
		});

		res.send(filesList);
	})

})

app.get('/scores/:teamid', function (req, res) {

	console.log('req.params.file', req.params.file);
	res.sendFile(__dirname + '/data/' + req.params.file + '.json');

})

app.get('/scores', function (req, res) {

	fs.readdir('./app/data', (err, files) => {

		files = files.map(file => './app/data/' + file);

		let data = async.map(files, fs.readFile, (err, results) => {

			let dataResults = results.map(JSON.parse)

			res.send(dataResults);
		});
	})
})

app.get('/graph', function (req, res) {
	console.log('Chart loading...');
	res.sendFile(__dirname + "/view/" + "chart.html");
})

var server = app.listen(9595, function () {

	var host = server.address().address
	var port = server.address().port

	console.log("App listening at http://%s:%s", host, port)
})