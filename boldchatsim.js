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

server.listen(3001);
//servers.listen(3443);

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
	var optionspost = { host : 'localhost', port : 3000, path : '/post', method : 'POST', headers : postHeaders };
	//console.info(optionspost);
	var reqPost = http.request(optionspost, function(res) {
		//console.log("statusCode: ", res.statusCode);
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
		//console.log("/post received");

		if (req.body.method == "assignChat")  { // Incoming response to BoldChat routing request
			logMessage = "Incoming setRoute response: routeID="+req.body.routeID+", operator="+req.body.operator;
			res.send({ "result": "success" });
			console.log(logMessage);
		} else if (req.body.method == "setOperatorState")  {
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

setInterval (function () {
		var routeID = Math.floor((Math.random() * 10000) + 10000); 
		console.info("Generatiing random routing request, routeID="+routeID);
		makePOSTCall({ "method": "boldchatRoutingRequest", "routeID": routeID, "routeData": "xxxx=11111&yyyy=22222"});
}, Math.floor((Math.random() * 10000) + 10000));

setInterval (function () {
		if (Math.random() > 0.5) {
			var state = "Avalable";
		} else {
			var state = "Away";
		}
		console.info("Generatiing random operator state change, operator=mark.troyer.demo, state="+state);
		makePOSTCall({ "method": "boldchatOperatorUpdate", "operator": "mark.troyer.demo", "state": state});
}, Math.floor((Math.random() * 3000) + 1000));
