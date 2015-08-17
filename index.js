// get initial data to build BoldChat state
var departments = {};
var activeDepartment = '4309786320420724690';
var operators = {};
var activeChats = {};
jQuery(function($){
	var socket = io.connect();

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

	// Code to change Universal Operator State
	$(".universalstate").each(function() {
		$(this).click(function(e){
			var uid = $(this).parent().parent().find(".uid").html();
			if ($(this).html() == "Chat")  {
				var channel = "Voice";
			} else if ($(this).html() == "Voice")  {
				var channel = "Blended";
			} else if ($(this).html() == "Blended")  {
				var channel = "Away";
			} else {
				var channel = "Chat";
			}
			socket.emit('changeuniversalstate', { "uid": uid, "channel": channel});
		});
	});

	socket.on('operatormassupdate', function(data){
		//alert("operatorupdate event received.\n\n"+JSON.stringify(data));
		operators = data.Data;
		//alert(operators.length);
		$("#operatorstate").html('');
		for (var i = 0; i < operators.length; ++i) {
			if (operators[i].ClientID != null)  {
				$("#operatorstate").append('<div class="operatorstateentry"><span class="uid">'+operators[i].UserName+'</span>/'+operators[i].ClientID+'<span class="boldchatstatewrapper"><span class="boldchatstate">'+(operators[i].StatusType == 1 ? "Away" : "Available")+'</span></span></div>');
			}
		}
	});

	socket.on('operatorupdate', function(data){
		//alert("data.UserName="+data.UserName+", data.StatusType="+data.StatusType);
		if (data.StatusType != 0) {
			$(".uid:contains("+data.UserName+")").parent().find(".boldchatstate").html((data.StatusType == 1 ? "Away" : "Available"));
		}
	});

	socket.on('appendlog', function(data){
		var count = $("#eventlog").children().length;
		if (count > 8) {
			$('#eventlog div.eventlogentry:last-child').remove();
		}
		$("#eventlog").prepend('<div class="eventlogentry">'+data.log+'<span class="timedate">'+data.datetime+'</span><br>'+JSON.stringify(data)+'</div>');
	});
});