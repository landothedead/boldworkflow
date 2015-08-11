var http = require('http');

var fs = require('fs');
//var privateKey  = fs.readFileSync('sslcert/server.key', 'utf8');
//var certificate = fs.readFileSync('sslcert/server.crt', 'utf8');
//var credentials = {key: "123", cert: "123"};

var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	//servers = require('http').createServer(credentials,app),
	io = require('socket.io').listen(server);

var bodyParser = require('body-parser');
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

var port = Number(process.env.PORT || 3000);
server.listen(port);
//servers.listen(3443);



app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

// Wrapper function to simulated BoldChat GET microservice
function makeBoldChatGETCall(getString) {
	var optionsget = { host : 'localhost', port : 3001, path : '/get', method : 'GET'};
	var requestGet = http.request(this.optionsget, function(res) {
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

// Wrapper function to simulated BoldChat POST microservice
function makeBoldChatPOSTCall(postObject) {
	//console.info(postObject);
	var jsonPostObject = JSON.stringify(postObject);
	var postHeaders = {'Content-Type' : 'application/json','Content-Length' : Buffer.byteLength(jsonPostObject, 'utf8')};
	var optionspost = { host : 'localhost', port : 3001, path : '/post', method : 'POST', headers : postHeaders };
	//console.info(optionspost);
	var reqPost = http.request(optionspost, function(res) {
		//console.log("statusCode: ", res.statusCode);
		res.on('data', function(d) {
			//console.info('POST result:\n');
			//process.stdout.write(d);
			//console.info('\n\nPOST completed');
		});
	});
	//console.info("sending "+jsonPostObject)

	reqPost.write(jsonPostObject);
	reqPost.end();
	reqPost.on('error', function(e) {
		console.error(e);
	});
}

// Wrapper function to simulated Voice GET microservice
function makeVoiceGETCall(getString) {
	var optionsget = { host : 'localhost', port : 3002, path : '/get', method : 'GET'};
	var requestGet = http.request(this.optionsget, function(res) {
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

// Wrapper function to simulated Voice POST microservice
function makeVoicePOSTCall(postObject) {
	var jsonPostObject = JSON.stringify(postObject);
	var postHeaders = {'Content-Type' : 'application/json','Content-Length' : Buffer.byteLength(jsonPostObject, 'utf8')};
	var optionspost = { host : 'localhost', port : 3002, path : '/post', method : 'POST', headers : postHeaders };
	var reqPost = http.request(optionspost, function(res) {
		console.log("statusCode: ", res.statusCode);
		res.on('data', function(d) {
			console.info('POST result:\n');
			process.stdout.write(d);
			console.info('\n\nPOST completed');
		});
	});
	reqPost.write(jsonPostObject);
	reqPost.end();
	reqPost.on('error', function(e) {
		console.error(e);
	});
}

	// POST based BoldChat Triggers
	app.post('/trigger', function(req, res){
		if (typeof req.body.method !== 'undefined') {
			console.log(res);
			console.log("\n\n");
		}
	}

	// POST based microservices events
	app.post('/post', function(req, res){
		if (typeof req.body.method !== 'undefined') {
			if (req.body.method == "boldchatRoutingRequest")  { // Incoming BoldChat routing request
				logMessage = "Incoming Routing Request: routeID="+req.body.routeID+", routeData="+req.body.routeData;
				res.send({ "result": "success" });
				console.log(logMessage);
				var date = new Date();
				var data = {};
				data.datetime= date.toISOString();
				data.log = logMessage;
				io.sockets.emit('appendlog', data);
				makeBoldChatPOSTCall({ "method": "assignChat", "routeID": req.body.routeID, "operator": "mark.troyer.demo"})
				var date = new Date();
				var data = {};
				data.datetime= date.toISOString();
				data.log = "Replying to Routing Request: routeID="+req.body.routeID+", operator=mark.troyer.demo";
				console.log(data.log);
				console.log(" ");
				io.sockets.emit('appendlog', data);
				
			} else if (req.body.method == "boldchatOperatorUpdate")  {
				logMessage = "Incoming BoldChat operator state change: operrator="+req.body.operator+", state="+req.body.state;
				res.send({ "result": "success" });
				console.log(logMessage);
				var date = new Date();
				var data = {};
				data.datetime= date.toISOString();
				data.log = logMessage;
				data.boldchatstate = req.body.state;
				data.uid = req.body.operator;
				io.sockets.emit('updateuxchangeboldchatstate', data);
				io.sockets.emit('appendlog', data);
			} else if (req.body.method == "boldchatSessionStarted")  {
				logMessage = "/post, method boldchatSessionStarted received.";
				res.send({ "result": "success" });
				console.log(logMessage);
				var date = new Date();
				var data = {};
				data.datetime= date.toISOString();
				data.log = logMessage;
				io.sockets.emit('appendlog', data);
			} else if (req.body.method == "boldchatSessionEnded")  {
				logMessage = "/post, method boldchatSessionEnded received.";
				res.send({ "result": "success" });
				console.log(logMessage);
				var date = new Date();
				var data = {};
				data.datetime= date.toISOString();
				data.log = logMessage;
				io.sockets.emit('appendlog', data);
			} else if (req.body.method == "voiceOperatorUpdate")  {
				logMessage = "Incoming Voice operator state change: operrator="+req.body.operator+", state="+req.body.state;
				res.send({ "result": "success" });
				console.log(logMessage);
				var date = new Date();
				var data = {};
				data.datetime= date.toISOString();
				data.log = logMessage;
				data.voicestate = req.body.state;
				data.uid = req.body.operator;
				io.sockets.emit('updateuxchangevoicestate', data);
				io.sockets.emit('appendlog', data);
			} else if (req.body.method == "voiceSessionStarted")  {
				logMessage = "Incoming Voice call started by operator "+req.body.operator;
				res.send({ "result": "success" });
				console.log(logMessage);
				var date = new Date();
				var data = {};
				data.datetime= date.toISOString();
				data.log = logMessage;
				data.voicestate = req.body.state;
				data.uid = req.body.operator;
				io.sockets.emit('updateuxchangevoicestate', data);
				io.sockets.emit('appendlog', data);
			} else if (req.body.method == "voiceSessionEnded")  {
				logMessage = "/post, method voiceSessionEnded received.";
				res.send({ "result": "success" });
				console.log(logMessage);
				var date = new Date();
				var data = {};
				data.datetime= date.toISOString();
				data.log = logMessage;
				io.sockets.emit('appendlog', data);
			} else {
				logMessage = "/post, no method stated.";
				res.send({ "result": "error", "error": "no method"});
				console.log(logMessage);
				var date = new Date();
				var data = {};
				data.datetime= date.toISOString();
				data.log = logMessage;
				io.sockets.emit('appendlog', data);
			}
		} else {
			logMessage = "Unrecognized /post event. ";
			res.send({ "result": "error", "error": "no method"});
			console.log(logMessage);
			var date = new Date();
			var data = {};
			data.datetime= date.toISOString();
			data.log = logMessage;
			data.req = req;
			date.res = res;
			io.sockets.emit('appendlog', data);
		}
	});



io.sockets.on('connection', function(socket){

	socket.on('changeuniversalstate', function(data){
		var date = new Date();
		data.datetime= date.toISOString();
		data.log = "Changed "+data.uid+" to Universal State:  "+data.channel;
		if (data.channel == "Away") {
			data.boldchatstate = "Away";
			data.voicestate = "Away";
		} else if (data.channel == "Chat") {
			data.boldchatstate = "Available";
			data.voicestate = "Away";
		} else if (data.channel == "Voice") {
			data.boldchatstate = "Away";
			data.voicestate = "Available";
		} else if (data.channel == "Blended") {
			data.boldchatstate = "Available";
			data.voicestate = "Available";
		}
		io.sockets.emit('updateuxchangeuniversalstate', data);
		io.sockets.emit('updateuxchangeboldchatstate', data);
		io.sockets.emit('updateuxchangevoicestate', data);

		io.sockets.emit('appendlog', data);
	});

});



//setInterval (function () {makeBoldChatPOSTCall({ "method": "setOperatorState", "operator": 123456789, "state": "Available"})}, 5000);
