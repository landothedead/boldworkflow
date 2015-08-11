var fs = require('fs');

// file is included here:
eval(fs.readFileSync('hmac-sha512.js')+'');

var https = require('https');


var accountId ="724478916710972946";
var apiKeyId ="46612343070928403";
var apiKey ="//PnDisDiTv8WfgaN11Ny+k9CgIRhb2tiIYfUHxGTawtl2bphm4n+BOQU9Q2yJF72v3xmf1LZn2N5oCYaFZHMg==";

var auth = accountId + ':' + apiKeyId + ':' + (new Date()).getTime();
var authHash = auth + ':' + CryptoJS.SHA512(auth + apiKey).toString(CryptoJS.enc.Hex);

console.log(authHash);

var options = {
	host : 'api.boldchat.com', 
	port : 443, 
	path : '/aid/724478916710972946/data/rest/json/v1/getOperatorClients?auth='+authHash, 
	method : 'GET'
};

callback = function(response) {
	var str = '';
	//another chunk of data has been recieved, so append it to `str`
	response.on('data', function (chunk) {
		str += chunk;
	});

	//the whole response has been recieved, so we just print it out here
	response.on('end', function () {
		console.log(JSON.parse(str));
	});
}

https.request(options, callback).end();


