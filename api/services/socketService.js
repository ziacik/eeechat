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
	service.socketRooms[socketId] = appRoom;

	var data = {
		id : req.user.id,
		verb : 'messaged',
		data : {
			state : 'online'
		}
	};
	
	sails.sockets.join(socket, appRoom);
	sails.sockets.broadcast(appRoom, 'user', data, socket);
};

service.disconnect = function(session, socket) {
	var socketId = sails.sockets.id(socket);
	var appRoom = service.socketRooms[socketId];
	
	if (!appRoom) {
		return;
	}
	
	var subscribers = sails.sockets.subscribers(appRoom);
	var myId = session.passport.user;

	var isMyselfOnline = subscribers.some(function(subscriber) {
		return myId === service.socketUsers[subscriber];
	});
	
	if (!isMyselfOnline) {
		sails.sockets.broadcast(appRoom, 'user', {
			id : myId,
			verb : 'messaged',
			data : {
				state : 'offline'
			}
		}, socket);
	}
	
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
