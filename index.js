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
		socket.emit('getactivechats',{ "DepartmentID": $("#department option:selected").val() });
	});
	$("#turnoffacd").click(function(e) {
		socket.emit('turnoffacd',{ "DepartmentID": $("#department").val()});
	});
	$("#turnonacd").click(function(e) {
		socket.emit('turnonacd',{ "DepartmentID": $("#department").val()});
	});
	$("#turnonoffboardrouting").click(function(e) {
		alert("Turn ON offboard routing clicked.");
	});
	$("#turnoffoffboardrouting").click(function(e) {
		alert("Turn OFF offboard routing clicked.");
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
	
		$("#selectoperator").html('');
		var htmlstanza = '<select name="operator" id="operator">';
		for (var i = 0; i < operators.length; ++i) {
			htmlstanza = htmlstanza + '<option value="'+operators[i].LoginID+'">'+operators[i].UserName+'/'+operators[i].LoginID+'</option>';
		}
		htmlstanza = htmlstanza + '</select>';
		$("#selectoperator").html(htmlstanza);
	});
	
	socket.on('operatorupdate', function(data){
		socket.emit('getoperators',{});
		/*  Forget event streaming for now.  Use with StatusType=0 events only occure with logouts.  Save Code for later.
		if (data.StatusType != 0) {
			if ($(".uid:contains("+data.UserName+")").length == 0) {
				socket.emit('getoperators',{});
			} else {
			$(".uid:contains("+data.UserName+")").parent().find(".boldchatstate").html((data.StatusType == 1 ? "Away" : "Available"));
			}
		}
		*/
	});

	socket.on('activechatupdate', function(data){
		alert(JSON.stringify(data.Data));
		activeChats = data.Data;
		$("#activechatstate").html('');
		for (var i = 0; i < activeChats.length; ++i) {
			$("#activechatstate").append('<div class="activechatstateentry">ChatID='+activeChats[i].ChatID+', DepartmentID='+activeChats[i].DepartmentID+', OperatorID='+activeChats[i].OperatorID+', PageType='+activeChats[i].PageType+', ChatURL='+activeChats[i].ChatURL+'</div>');
		}
	});

	socket.on('departmentupdate', function(data){
		departments = data.Data;
		$("#selectdepartment").html('');
		var htmlstanza = '<select name="department" id="department">';
		for (var i = 0; i < departments.length; ++i) {
			htmlstanza = htmlstanza + '<option value="'+departments[i].DepartmentID+'">'+departments[i].Name+'/'+departments[i].DepartmentID+'</option>';
		}
		htmlstanza = htmlstanza + '</select>';
		$("#selectdepartment").html(htmlstanza);
	});

	socket.on('appendlog', function(data){
		var count = $("#eventlog").children().length;
		if (count > 8) {
			$('#eventlog div.eventlogentry:last-child').remove();
		}
		$("#eventlog").prepend('<div class="eventlogentry">'+data.log+'<span class="timedate">'+data.datetime+'</span><br>'+JSON.stringify(data)+'</div>');
	});
}); 