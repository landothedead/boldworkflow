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

	socket.on('operatorupdate', function(data){
		//alert("operatorupdate event received.\n\n"+JSON.stringify(data));
		operators = data.Data;
		//alert(operators.length);
		$("#operatorstate").html('');
		for (var i = 0; i < operators.length; ++i) {
			if (operators[i].ClientID != null)  {
				$("#operatorstate").append('<div class="operatorstateentry"><span class="uid">'+operators[i].UserName+'</span><span class="boldchatstatewrapper"><span class="boldchatstate">'+operators[i].StatusType+'</span></span></div>');
				//alert(operators[i].UserName);
			}
		}

/*

<div id="operatorstate">
	<div class="operatorstateentry"><span class="uid">mark.troyer.demo</span><span class="boldchatstatewrapper"><span class="boldchatstate">Available</span></span></div>
</div>
*/

		//
	});

	socket.on('updateuxchangeboldchatstate', function(data){
		$(".uid:contains('"+data.uid+"')").parent().find(".boldchatstate").html(data.boldchatstate);
	});

	socket.on('updateuxchangevoicestate', function(data){
		$(".uid:contains('"+data.uid+"')").parent().find(".voicestate").html(data.voicestate);
	});

	socket.on('appendlog', function(data){
		var count = $("#eventlog").children().length;
		if (count > 8) {
			$('#eventlog div.eventlogentry:last-child').remove();
		}
		$("#eventlog").prepend('<div class="eventlogentry">'+data.log+'<span class="timedate">'+data.datetime+'</span><br>'+JSON.stringify(data)+'</div>');
	});
});