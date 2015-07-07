var http = require('http');

var fs = require('fs');
//var privateKey  = fs.readFileSync('sslcert/server.key', 'utf8');
//var certificate = fs.readFileSync('sslcert/server.crt', 'utf8');
var credentials = {key: "123", cert: "123"};

var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	//servers = require('https').createServer(credentials,app),
	io = require('socket.io').listen(server);

var bodyParser = require('body-parser');
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

server.listen(3002);
//servers.listen(3445);

// Wrapper function to simulated GET microservice
function makeGETCall(getString) {
	var optionsget = { host : 'localhost', port : 3000, path : '/get', method : 'GET'};
	var requestGet = http.request(optionsget, function(res) {
		console.log("statusCode: ", res.statusCode);
		res.on('data', function(d) {
			console.info('GET result:\n');
			process.stdout.write(d);
			console.info('\n\nCall completed');
		});
	});
	reqGet.end();
	reqGet.on('error', function(e) {
		console.error(e);
	});
}

// Wrapper function to POST microservice
function makePOSTCall(postObject) {
	var jsonPostObject = JSON.stringify(postObject);
	var postHeaders = {'Content-Type' : 'application/json','Content-Length' : Buffer.byteLength(jsonPostObject, 'utf8')};
	var optionspost = { host : 'localhost', port : 3000, path : '/post', method : 'POST', headers : postHeaders };;
	var reqPost = http.request(optionspost, function(res) {
		res.on('data', function(d) {
			//console.info('POST result:\n');
			//process.stdout.write(d);
			//console.info('\n\nPOST completed');
		});
	});
	reqPost.write(jsonPostObject);
	reqPost.end();
	reqPost.on('error', function(e) {
		console.error(e);
	});
}

// POST based microservices events
app.post('/post', function(req, res){
	//console.log(req.body.method);
	if (typeof req.body.method !== 'undefined') {
		if (req.body.method == "foobar1")  {
			logMessage = "Incoming setRoute response: routeID="+req.body.routeID+", operator="+req.body.operator;
			res.send({ "result": "success" });
			console.log(logMessage);
		} else if (req.body.method == "foobar2")  {
			logMessage = "/post, method setOperatorState received.  operator="+req.body.operator+", state="+req.body.state;
			console.log(logMessage);
		} else {
			logMessage = "/post, no method stated.";
			res.send({ "result": "error", "error": "no method"});
			console.log(logMessage);
		}
	} else {
		res.send('BoldChat Push-to-url API NOT responding.  No method verb.');
	}
});

// Simulate change in voice operator state
setInterval (function () {
		if (Math.random() > 0.5) {
			var state = "Avalable";
		} else {
			var state = "Away";
		}
		console.info("Generatiing random operator state change, operator=mark.troyer.demo, state="+state);
		makePOSTCall({ "method": "voiceOperatorUpdate", "operator": "mark.troyer.demo", "state": state});
}, Math.floor((Math.random() * 10000) + 10000));

// Simulate generation of new voice calls
/*
setInterval (function () {
		if (Math.random() > 0.5) {
			var state = "1";
		} else {
			var state = "0";
		}
		console.info("Generatiing random call state change, operator=mark.troyer.demo, state="+state);
		makePOSTCall({ "method": "voiceOperatorUpdate", "operator": "mark.troyer.demo", "state": state});
}, Math.floor((Math.random() * 10000) + 10000));
*/