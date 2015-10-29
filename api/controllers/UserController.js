/**
 * UserController
 * 
 * @description :: Server-side logic for managing users
 * @help :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var socketUsers = {};

module.exports = {		
	join : function(req, res) {
		var appId = req.param('appId');
		var room = req.param('room');		
		var roomName = appId + '/' + room;
		
		var mySocketId = sails.sockets.id(req.socket);
		socketUsers[mySocketId] = req.user.id; // TODO check
		
		var data = {
			id : req.user.id,
			verb : 'messaged',
			data : {
				state : 'online'
			}
		};
		
		sails.sockets.join(req.socket, roomName);		
		sails.sockets.broadcast(roomName, 'user', data, req.socket);

		legacyUserStatusService.userConnect(req.user.id);

		return res.ok();
	},
	
	online : function(req, res) {
		if (!req.user) {
			return res.forbidden();
		}
		
		var appId = req.param('appId');
		var room = req.param('room');
		
		var subscriberIds = sails.sockets.subscribers(appId + '/' + room);
		
		var onlineUsers = subscriberIds.reduce(function(result, current) {
			var user = socketUsers[current];
			if (result.indexOf(user) < 0) {
				result.push(user);
			}
			return result;
		}, []);
		
		LegacyConnection.find().then(function(legacyConnections) {
			var legacyUsers =  legacyConnections.map(function(legacyConnection) {
				return legacyConnection.user;
			});
			
			onlineUsers = onlineUsers.concat(legacyUsers);
			
			// / First one will be current user id.
			var currentUserIndex = onlineUsers.indexOf(req.user.id);
			
			if (currentUserIndex < 0) {
				// / Not online? Should not happen.
				return res.notFound();
			}
			
			if (currentUserIndex > 0) {
				onlineUsers.splice(currentUserIndex, 1);
				onlineUsers.unshift(req.user.id);
			}
			
			return res.ok(onlineUsers);
		}).catch(function(err) {
			console.log(err);
			return res.negotiate(err);
		}).done();
	},
	
	fixAvatars : function(req, res) {
		User.find().then(function(users) {
			users.forEach(function(user) {
				userImageService.updateUserImage(user);
			});
			return res.ok();
		}).catch(function(err) {
			console.log(err);
			return res.negotiate(err);
		}).done();
	}
};

