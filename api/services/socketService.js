var service = {};

service.socketRooms = {};
service.socketUsers = {};

service.connect = function(req) {
	var socket = req.socket;
	var socketId = sails.sockets.id(socket);
	var appId = locationService.getAppId(req);
	var room = locationService.getRoom(req);
	var appRoom = appId + '/' + room;
	
	service.socketUsers[socketId] = req.user.id;

	var data = {
		id : req.user.id,
		verb : 'messaged',
		data : {
			state : 'online'
		}
	};
	
	sails.sockets.join(socket, appRoom);
	sails.sockets.broadcast(appRoom, 'user', data, socket);

	var rooms = service.socketRooms[socketId];
	
	if (!rooms) {
		service.socketRooms[socket.id] = [appRoom];
	} else if (rooms.indexOf(appRoom) < 0) {
		rooms.push(appRoom);
	}
};

service.disconnect = function(session, socket) {
	var socketId = sails.sockets.id(socket);
	var appRooms = service.socketRooms[socketId];
	
	if (!appRooms) {
		return;
	}
			
	appRooms.forEach(function(appRoom) {
		sails.sockets.broadcast(appRoom, 'user', {
			id : session.passport.user,
			verb : 'messaged',
			data : {
				state : 'offline'
			}
		}, socket);
	});	
	
	delete service.socketRooms[socketId];
};

service.getOnlineUsers = function(req) {
	var appId = locationService.getAppId(req);
	var room = locationService.getRoom(req);
	var appRoom = appId + '/' + room;
	
	var subscribers = sails.sockets.subscribers(appRoom);
	
	var onlineUsers = subscribers.reduce(function(result, current) {
		var user = service.socketUsers[current];
		if (result.indexOf(user) < 0) {
			result.push(user);
		}
		return result;
	}, []);

	return onlineUsers;
};

module.exports = service;