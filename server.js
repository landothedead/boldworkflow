var fs = require('fs');
//var privateKey  = fs.readFileSync('sslcert/server.key', 'utf8');
//var certificate = fs.readFileSync('sslcert/server.crt', 'utf8');
var credentials = {key: "123", cert: "123"};

var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	//servers = require('https').createServer(credentials,app),
	io = require('socket.io').listen(server);

var operatorstate = [
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
];

	
server.listen(3000);
//servers.listen(3443);

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

app.get('/boldchatpushtourl', function(req, res){
	if (typeof req.query.action !== 'undefined') {
		res.send('BoldChat Push-to-url API responding');

		// LOG
		if (req.query.action == "log")  {
			var date = new Date();
			var data = {};
			data.datetime= date.toISOString();
			if (typeof req.query.log !== 'undefined') {
				data.log = req.query.log;
			} else {
				data.log = "UNDEFINED LOG MESSAGE";
			}
			io.sockets.emit('appendlog', data);
		}

		// CHANGE OPERATOR CHANNEL STATE

		// INCREMENT CHAT/CALL COUNT

		// LOG ON OPERATOR

		// LOG OFF OPERATOR

		// ROUTING REQUEST

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