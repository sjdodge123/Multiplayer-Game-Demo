var clientID = 0;

function clientConnect() {
   		socket.on('spawnMyShip', function(packet){
			shipList = packet.shipList;
			clientID = packet.index;
			myShip = packet.shipList[packet.index];
			window.addEventListener("keydown", handleKeys, false);
    	});

	    socket.on('updateShipList', function(newShip){
			shipList[newShip.ID] = newShip;
	    });
    
	    socket.on('movement', function(packet){
			shipList[packet.index].x = packet.x;
			shipList[packet.index].y = packet.y;
	  	});

	  	socket.on('player has left', function(index){
			shipList[index] = null;
	  	});
}