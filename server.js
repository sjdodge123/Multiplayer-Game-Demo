var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var msgLog = [];
var clientID = 0;
var client = {};
var shipList = [];
var maxPlayers = 20;
app.get('/', function(req, res){
  	res.sendfile("main.html");
});

io.on('connection', function(socket){
	
	clientID = findEmptySlot();
	client[socket.id] = clientID;
	var newShip = {};
	newShip.x = 400;
	newShip.y = 400;
	newShip.ID = clientID;
	shipList[clientID] = newShip;
	console.log('User '+ client[socket.id] + ' has joined.');
	socket.emit('spawnMyShip',{shipList:shipList,index:clientID});
	socket.broadcast.emit('updateShipList',newShip);

	socket.on('movement', function(ship){
		shipList[client[socket.id]].x = ship.x;
		shipList[client[socket.id]].y = ship.y;
		socket.broadcast.emit('movement',{index:ship.ID, x:ship.x,y:ship.y});
	});

	socket.on('disconnect', function() {
		socket.broadcast.emit('player has left',client[socket.id]);
		shipList[client[socket.id]] = null;

		console.log('User '+ client[socket.id] + ' disconnected.');
  	});

	
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});


function setMaxPlayers(){
	for(var i=0; i<maxPlayers;i+=1){
		shipList.push(null);
	}
}

function findEmptySlot(){
	for(var i=0;i<shipList.length;i+=1){
		if(shipList[i] == null) {
			return i;
		}
	}
}

setMaxPlayers();