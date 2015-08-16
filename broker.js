// Set up Express Server
var http = require('http');
var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server);
var bodyParser = require('body-parser');
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

// Get port used by Heroku
var PORT = Number(process.env.PORT || 3000);
server.listen(PORT);

// Get BoldChat API Credentials stored in Heroku environmental variables
var AID = process.env.AID || 0;
var APISETTINGSID = process.env.APISETTINGSID || 0;
var KEY = process.env.KEY || 0;
console.log("AID = "+AID+", APISETTINGSID = "+APISETTINGSID+", KEY = "+KEY);
if (AID == 0 || APISETTINGSID == 0 || KEY == 0) {
	console.log("BoldChat API Environmental Variables not set in HEROKU App.  Please verify..");
	process.exit(1);
}

//  Set up code for outbound BoldChat API calls
var fs = require('fs');
eval(fs.readFileSync('hmac-sha512.js')+'');
var https = require('https');
var boldChatCallResponse = {};
function boldChatCall(https,AID,APISETTINGSID,KEY,method,getParams,callBackFunction) {
	var auth = AID + ':' + APISETTINGSID + ':' + (new Date()).getTime();
	var authHash = auth + ':' + CryptoJS.SHA512(auth + KEY).toString(CryptoJS.enc.Hex);
	var options = {
		host : 'api.boldchat.com', 
		port : 443, 
		path : '/aid/'+AID+'/data/rest/json/v1/'+method+'?auth='+authHash+'&'+getParams, 
		method : 'GET'
	};
	
	https.request(options, callBackFunction).end();
}

getDepartments = function(response) {
		var str = '';
		//another chunk of data has been recieved, so append it to `str`
		response.on('data', function (chunk) {
			str += chunk;
		});
		//the whole response has been recieved, take final action.
		response.on('end', function () {
			boldChatCallResponse = {};
			//boldChatCallResponse.response = JSON.parse(str);
			//boldChatCallResponse.response = str;
			boldChatCallResponse.response = JSON.parse(str);
			console.log(boldChatCallResponse);
		});
	}
boldChatCall(https,AID,APISETTINGSID,KEY,'getDepartments','',getDepartments);


var pageviews = 0;

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
	pageviews = pageviews+1;
	console.log("PAGEVIEWS = "+pageviews);
});

// Wrapper function to simulated BoldChat GET microservicex
function makeBoldChatGETCall(getString) {
	var optionsget = { host : 'localhost', PORT : 3001, path : '/get', method : 'GET'};
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
		console.log(req.body);
		if ((typeof req.body.StatusType !== 'undefined' ) || (typeof req.body.ActiveChats !== 'undefined' ) || (typeof req.body.ChatType !== 'undefined' )) {
			if (typeof req.body.ChatType !== 'undefined' )  {
				logMessage = "Event: Chats, Hidden Asynch Action";
				res.send({ "result": "success" });
				console.log(logMessage);
				var date = new Date();
				var data = {};
				data.datetime= date.toISOString();
				data.log = logMessage;
				data.body = req.body;
				io.sockets.emit('appendlog', data);
			} else if (typeof req.body.ActiveChats !== 'undefined' ) {
				logMessage = "Event: Operators, Operator Chat Count Changed ("+req.body.UserName+","+req.body.ActiveChats+")";
				res.send({ "result": "success" });
				console.log(logMessage);
				var date = new Date();
				var data = {};
				data.datetime= date.toISOString();
				data.log = logMessage;
				data.body = req.body;
				io.sockets.emit('appendlog', data);
			}  else if (typeof req.body.StatusType !== 'undefined' )  {
				logMessage = "Event: Operators, Operator Status Changed ("+req.body.UserName+","+req.body.StatusType+")";
				res.send({ "result": "success" });
				console.log(logMessage);
				var date = new Date();
				var data = {};
				data.datetime= date.toISOString();
				data.log = logMessage;
				data.body = req.body;
				io.sockets.emit('appendlog', data);
			}
		} else {
			logMessage = "Unrecognized /trigger event. ";
			res.send({ "result": "error", "error": "no method"});
			console.log(req.body);
			var date = new Date();
			var data = {};
			data.datetime= date.toISOString();
			data.log = logMessage;
			data.body = req.body;
			io.sockets.emit('appendlog', data);
		}
	});

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
			console.log(req.body);
			//console.log(logMessage+req);
			var date = new Date();
			var data = {};
			data.datetime= date.toISOString();
			data.log = logMessage;
			data.body = req.body;
			//date.res = res;
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
