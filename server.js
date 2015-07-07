var https = require('https');

var fs = require('fs');
//var privateKey  = fs.readFileSync('sslcert/server.key', 'utf8');
//var certificate = fs.readFileSync('sslcert/server.crt', 'utf8');
var credentials = {key: "123", cert: "123"};

var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	//servers = require('https').createServer(credentials,app),
	io = require('socket.io').listen(server);

var operatorstate = {
	"ross.haskell.demo": {
		"boldchat": "Available",
		"boldchatsessions": 3,
		"voice": "Away",
		"voicesessions": 0,
		"universal": "Chat"
	},
	"coty.smith.demo": {
		"boldchat": "Away",
		"boldchatsessions": 0,
		"voice": "Away",
		"voicesessions": 1,
		"universal": "Voice"
	},
	"david.hammer.demo": {
		"boldchat": "Available",
		"boldchatsessions": 0,
		"voice": "Available",
		"voicesessions": 0,
		"universal": "Blended"
	},
	"mark.troyer.demo": {
		"boldchat": "Available",
		"boldchatsessions": 2,
		"voice": "Away",
		"voicesessions": 0,
		"universal": "Blended"
	},
	"paul.cheung.demo": {
		"boldchat": "Away",
		"boldchatsessions": 0,
		"voice": "Away",
		"voicesessions": 1,
		"universal": "Blended"
	}
};

	
server.listen(3000);
//servers.listen(3443);

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

// Wrapper function to simulated BoldChat GET microservice
function makeBoldChatGETCall(getString) {
	var optionsget = { host : 'localhost', port : 3001, path : '/get', method : 'GET'};
	var requestGet = https.request(this.optionsget, function(res) {
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
	var jsonPostObject = JSON.stringify(postObject);
	var postHeaders = {'Content-Type' : 'application/json','Content-Length' : Buffer.byteLength(jsonPostObject, 'utf8')};
	var optionspost = { host : 'localhost', port : 3001, path : '/post', method : 'POST', headers : postHeaders };
	var reqPost = https.request(optionspost, function(res) {
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

// Wrapper function to simulated Voice GET microservice
function makeVoiceGETCall(getString) {
	var optionsget = { host : 'localhost', port : 3002, path : '/get', method : 'GET'};
	var requestGet = https.request(this.optionsget, function(res) {
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
	var reqPost = https.request(optionspost, function(res) {
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

// POST based microservices events
app.post('/post', function(req, res){
	if (typeof req.query.method !== 'undefined') {
		console.log("/post received");

		if (req.query.method == "boldchatRoutingRequest")  { // Incoming BoldChat routing request
			logMessage = "/post, method boldchatRoutingRequest received.";
			res.send({ "result": "success" });
			console.log(logMessage);
			var date = new Date();
			var data = {};
			data.datetime= date.toISOString();
			data.log = logMessage;
			io.sockets.emit('appendlog', data);
		} else if (req.query.method == "boldchatOperatorUpdate")  {
			logMessage = "/post, method boldchatOperatorUpdate received.";
			res.send({ "result": "success" });
			console.log(logMessage);
			var date = new Date();
			var data = {};
			data.datetime= date.toISOString();
			data.log = logMessage;
			io.sockets.emit('appendlog', data);
		} else if (req.query.method == "boldchatSessionStarted")  {
			logMessage = "/post, method boldchatSessionStarted received.";
			res.send({ "result": "success" });
			console.log(logMessage);
			var date = new Date();
			var data = {};
			data.datetime= date.toISOString();
			data.log = logMessage;
			io.sockets.emit('appendlog', data);
		} else if (req.query.method == "boldchatSessionEnded")  {
			logMessage = "/post, method boldchatSessionEnded received.";
			res.send({ "result": "success" });
			console.log(logMessage);
			var date = new Date();
			var data = {};
			data.datetime= date.toISOString();
			data.log = logMessage;
			io.sockets.emit('appendlog', data);
		} else if (req.query.method == "voiceOperatorUpdate")  {
			logMessage = "/post, method voiceOperatorUpdate received.";
			res.send({ "result": "success" });
			console.log(logMessage);
			var date = new Date();
			var data = {};
			data.datetime= date.toISOString();
			data.log = logMessage;
			io.sockets.emit('appendlog', data);
		} else if (req.query.method == "voiceSessionStarted")  {
			logMessage = "/post, method voiceSessionStarted received.";
			res.send({ "result": "success" });
			console.log(logMessage);
			var date = new Date();
			var data = {};
			data.datetime= date.toISOString();
			data.log = logMessage;
			io.sockets.emit('appendlog', data);
		} else if (req.query.method == "voiceSessionEnded")  {
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
		res.send('BoldChat Push-to-url API NOT responding.  No action verb.');
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
