// get initial data to build BoldChat state 
var departments = {};
var activeDepartment = '4309786320420724690';
var operators = {};
var activeChats = {};
jQuery(function($){
	var socket = io.connect();


	// Get things started 
	socket.emit('getoperators',{});
	socket.emit('loaddepartments',{});
	socket.emit('getactivechats',{});

	// Set up button actions
	$("#getoperators").click(function(e) {
		socket.emit('getoperators',{});
	});
	$("#loaddepartments").click(function(e) {
		socket.emit('loaddepartments',{});
	});
	$("#getactivechats").click(function(e) {
		socket.emit('getactivechats',{});
	});
	$("#selectdepartment").click(function(e) {
		socket.emit('selectdepartment',{});
	});
	$("#setupoffloadeddepartment").click(function(e) {
		socket.emit('setupoffloadeddepartment',{});
	});
	$("#resetoffloadeddepartment").click(function(e) {
		socket.emit('resetoffloadeddepartment',{});
	});


	socket.on('operatormassupdate', function(data){
		operators = data.Data;
		$("#operatorstate").html('');
		for (var i = 0; i < operators.length; ++i) {
			if (operators[i].ClientID != null)  {
				$("#operatorstate").append('<div class="operatorstateentry"><span class="uid">'+operators[i].UserName+'</span>/<span class="clientid">'+operators[i].ClientID+'</span> (<span class=operatorid>'+operators[i].LoginID+'</span>)<span class="boldchatstatewrapper"><span class="boldchatstate">'+(operators[i].StatusType == 1 ? "Away" : "Available")+'</span></span></div>');
			}
		}
		$(".boldchatstate").each(function() {
				$(this).click(function(e){
					var UserName= $(this).parent().parent().find(".uid").html();
					var OperatorID= $(this).parent().parent().find(".operatorid").html();
					var ClientID= $(this).parent().parent().find(".clientid").html();
					if ($(this).html() == "Available")  {
						var StatusType = 1;  // Set to Away
					} else {
						var StatusType = 2;  // Set to Available
					}
					socket.emit('operatorupdate', { "UserName": UserName, "OperatorID": OperatorID, "StatusType": StatusType, "ServiceTypeID": "1", "ClientID": ClientID });
				});
		});
	});
	socket.on('operatorupdate', function(data){
		//alert("data.UserName="+data.UserName+", data.StatusType="+data.StatusType);
		if (data.StatusType != 0) {
			if ($(".uid:contains("+data.UserName+")")== null) {
				socket.emit('getoperators',{});
			} else {
			$(".uid:contains("+data.UserName+")").parent().find(".boldchatstate").html((data.StatusType == 1 ? "Away" : "Available"));
			}
		}
		
		// write code for case of deletion
	});
	socket.on('appendlog', function(data){
		var count = $("#eventlog").children().length;
		if (count > 8) {
			$('#eventlog div.eventlogentry:last-child').remove();
		}
		$("#eventlog").prepend('<div class="eventlogentry">'+data.log+'<span class="timedate">'+data.datetime+'</span><br>'+JSON.stringify(data)+'</div>');
	});
}); 