var fs = require('fs');

// file is included here:
eval(fs.readFileSync('hmac-sha512.js')+'');

var https = require('https');


var accountId ="724478916710972946";
var apiKeyId ="46612343070928403";
var apiKey ="//PnDisDiTv8WfgaN11Ny+k9CgIRhb2tiIYfUHxGTawtl2bphm4n+BOQU9Q2yJF72v3xmf1LZn2N5oCYaFZHMg==";

var requestType ="getFolders";

var auth = accountId + ':' + apiKeyId + ':' + (new Date()).getTime();
var authHash = auth + ':' + CryptoJS.SHA512(auth + apiKey).toString(CryptoJS.enc.Hex);

console.log(authHash);

// Wrapper function to simulated BoldChat GET microservice
function getFolders(auth) {
	var optionsget = { host : 'api.boldchat.com', port : 443, path : '/aid/724478916710972946/data/rest/json/v1/getFolders?auth='+authHash, method : 'GET'};
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


getFolders(authHash);

