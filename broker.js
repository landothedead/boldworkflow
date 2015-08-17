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

if (AID == 0 || APISETTINGSID == 0 || KEY == 0) {
	console.log("AID = "+AID+", APISETTINGSID = "+APISETTINGSID+", KEY = "+KEY);
	console.log("BoldChat API Environmental Variables not set in HEROKU App.  Please verify..");
	process.exit(1);
}

//  Set up code for outbound BoldChat API calls
var fs = require('fs');
eval(fs.readFileSync('hmac-sha512.js')+'');
var https = require('https');
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

function logEvent(logMessage, jsonPayload) {
	var date = new Date();
	var data = {};
	data.datetime= date.toISOString();
	data.log = logMessage;
	data.body = jsonPayload;
	io.sockets.emit('appendlog', data);
}

// get initial data to build BoldChat state
var departments = {};
var activeDepartment = '4309786320420724690';
var operators = {};
var activeChats = {};

getoperators = function(response) {
	var str = '';
	//another chunk of data has been recieved, so append it to `str`
	response.on('data', function (chunk) {
		str += chunk;
	});
	//the whole response has been recieved, take final action.
	response.on('end', function () {
		operators = JSON.parse(str);
		logEvent('operatormassupdate response', operators);
		io.sockets.emit('operatormassupdate', operators);
	});
}
loaddepartments = function(response) {
	var str = '';
	//another chunk of data has been recieved, so append it to `str`
	response.on('data', function (chunk) {
		str += chunk;
	});
	//the whole response has been recieved, take final action.
	response.on('end', function () {
		departments = JSON.parse(str);
		logEvent('loaddepartments response', departments);
	});
}
getactivechats  = function(response) {
	var str = '';
	//another chunk of data has been recieved, so append it to `str`
	response.on('data', function (chunk) {
		str += chunk;
	});
	//the whole response has been recieved, take final action.
	response.on('end', function () {
		activeChats = JSON.parse(str);
		logEvent('getactivechats response', activeChats);
	});
}
setupoffloadeddepartment = function(response) {
	var str = '';
	//another chunk of data has been recieved, so append it to `str`
	response.on('data', function (chunk) {
		str += chunk;
	});
	//the whole response has been recieved, take final action.
	response.on('end', function () {
		logEvent('setupoffloadeddepartment response', JSON.parse(str));
	});
}
resetoffloadeddepartment = function(response) {
	var str = '';
	//another chunk of data has been recieved, so append it to `str`
	response.on('data', function (chunk) {
		str += chunk;
	});
	//the whole response has been recieved, take final action.
	response.on('end', function () {
		logEvent('resetoffloadeddepartment response ', JSON.parse(str));
	});
}
setoperatoravailability  = function(response) {
	var str = '';
	//another chunk of data has been recieved, so append it to `str`
	response.on('data', function (chunk) {
		str += chunk;
	});
	//the whole response has been recieved, take final action.
	response.on('end', function () {
		logEvent('setoperatoravailability response ', JSON.parse(str));
	});
}

// File load callbacks
app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

app.get('/index.js', function(req, res){
	res.sendFile(__dirname + '/index.js');
});

app.get('/index.css', function(req, res){
	res.sendFile(__dirname + '/index.css');
});


// POST based BoldChat Trigger event callbacks
app.post('/trigger-operator-count-change', function(req, res){
	logMessage = "Event: Operators, Operator Chat Count Changed ("+req.body.UserName+","+req.body.ActiveChats+")";
	res.send({ "result": "success" });
	logEvent(logMessage, req.body);
});
app.post('/trigger-operator-status-change', function(req, res){
	logMessage = "Event: Operators, Operator Status Changed ("+req.body.UserName+","+req.body.StatusType+")";
	res.send({ "result": "success" });
	logEvent(logMessage, req.body);
	io.sockets.emit('operatorupdate', req.body);
});
app.post('/trigger-chats-chatisstarted', function(req, res){
	logMessage = "Event: Chat is started ("+req.body.UserName+","+req.body.StatusType+")";
	res.send({ "result": "success" });
	logEvent(logMessage, req.body);
});
app.post('/trigger-chats-chatisanswered', function(req, res){
	logMessage = "Event: Chat is answered("+req.body.UserName+","+req.body.StatusType+")";
	res.send({ "result": "success" });
	logEvent(logMessage, req.body);
});
app.post('/trigger-chats-startedchatwasclosed', function(req, res){
	logMessage = "Event: Chat was closed ("+req.body.UserName+","+req.body.StatusType+")";
	res.send({ "result": "success" });
	logEvent(logMessage, req.body);
});

io.sockets.on('connection', function(socket){
	socket.on('getoperators', function(data){
		boldChatCall(https,AID,APISETTINGSID,KEY,'getOperatorAvailability','ServiceTypeID=1',getoperators);
	});
	socket.on('loaddepartments', function(data){
		boldChatCall(https,AID,APISETTINGSID,KEY,'getDepartments','',loaddepartments);
	});
	socket.on('getactivechats', function(data){
		boldChatCall(https,AID,APISETTINGSID,KEY,'getActiveChats','DepartmentID='+activeDepartment,getactivechats);
	});
	socket.on('selectdepartment', function(data){
		activeDepartment = data;
	});
	socket.on('setupoffloadeddepartment', function(data){
		boldChatCall(https,AID,APISETTINGSID,KEY,'enableAcdForChat','DepartmentID='+activeDepartment+'&Enable=false',setupoffloadeddepartment); 
	});
	socket.on('resetoffloadeddepartment', function(data){
		boldChatCall(https,AID,APISETTINGSID,KEY,'enableAcdForChat','DepartmentID='+activeDepartment+'&Enable=true',resetoffloadeddepartment); 
	});

	socket.on('operatorupdate', function(data){
		boldChatCall(https,AID,APISETTINGSID,KEY,'setOperatorAvailability','OperatorID='+data.OperatorID+'ServiceTypeID='+data.ServiceTypeID+'StatusType='+data.StatusType+'ClientID='+data.ClientID,setoperatoravailability);

		// io.sockets.emit('operatorupdate', req.body); // may not be needed because of trigger event.
		io.sockets.emit('appendlog', data);
	});

});

