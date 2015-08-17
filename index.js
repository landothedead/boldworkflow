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

	// Change state of single BoldChat operator
	$(".boldchatstate").each(function() {
		$(this).click(function(e){
			
			var OperatorID= $(this).parent().parent().find(".uid").html();
			var ClientID= $(this).parent().parent().find(".clientid").html();
			if ($(this).html() == "Available")  {
				var StatusType = 1;  // Set to Away
			} else {
				var StatusType = 2;  // Set to Available
			}
			alert("status clicked, OperatorID="+OperatorID+" ClientID="+ClientID+" StatusType="+StatusType);
			//'setOperatorAvailability','OperatorID='+data.OperatorID+'ServiceTypeID='+data.ServiceTypeID+'StatusType='+data.StatusType+'ClientID='+data.ClientID+,setoperatoravailability);
			socket.emit('operatorupdate', { "OperatorID": OperatorID, "StatusType": StatusType, "ServiceTypeID": "1", "ClientID": ClientID });
		});
	});

	socket.on('operatormassupdate', function(data){
		//alert("operatorupdate event received.\n\n"+JSON.stringify(data));
		operators = data.Data;
		//alert(operators.length);
		$("#operatorstate").html('');
		for (var i = 0; i < operators.length; ++i) {
			if (operators[i].ClientID != null)  {
				$("#operatorstate").append('<div class="operatorstateentry"><span class="uid">'+operators[i].UserName+'</span>/<span class="clientid">'+operators[i].ClientID+'</span><span class="boldchatstatewrapper"><span class="boldchatstate">'+(operators[i].StatusType == 1 ? "Away" : "Available")+'</span></span></div>');
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

	// Get things started 
	socket.emit('getoperators',{});
	socket.emit('loaddepartments',{});
	socket.emit('getactivechats',{});
});