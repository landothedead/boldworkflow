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
	$("#setupoffloadeddepartment").click(function(e) {
		alert($("#department").val());
		socket.emit('setupoffloadeddepartment',{ "DepartmentID": $("#department").val()});
	});
	$("#resetoffloadeddepartment").click(function(e) {
		socket.emit('resetoffloadeddepartment',{ "DepartmentID": $("#department").val()});
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
			if ($(".uid:contains("+data.UserName+")").length == 0) {
				socket.emit('getoperators',{});
			} else {
			$(".uid:contains("+data.UserName+")").parent().find(".boldchatstate").html((data.StatusType == 1 ? "Away" : "Available"));
			}
		}
		
		// write code for case of deletion
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