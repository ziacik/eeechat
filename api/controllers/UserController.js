/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	online : function(req, res) {
		if (!req.user) {
			return res.forbidden();
		}
		
		var isNumericId = typeof req.user.id === 'number';
		
		if (req.socket) {
			var roomName = 'onlineUser' + req.user.id;
			sails.sockets.join(req.socket, roomName);
			
 			if (sails.sockets.subscribers(roomName).length == 1) {
 				User.message(req.user.id, {
 					state : 'online'
 				}, req.socket);
 			}
		}
		
		var onlineUserRooms = sails.sockets.rooms().filter(function(roomName) {
			return roomName.indexOf('onlineUser') === 0;
		});
		
		var onlineUsers = onlineUserRooms.map(function(roomName) {
			var idStr = roomName.substr('onlineUser'.length);
			if (isNumericId) {
				return parseInt(idStr);
			} else {
				return idStr;
			}
		});

		LegacyConnection.find().then(function(legacyConnections) {
			var legacyUsers =  legacyConnections.map(function(legacyConnection) {
				return legacyConnection.user;
			});
			
			onlineUsers = onlineUsers.concat(legacyUsers);
			
			/// First one will be current user id.
			var currentUserIndex = onlineUsers.indexOf(req.user.id);
			
			if (currentUserIndex < 0) {
				/// Not online? Should not happen.
				return res.notFound();
			}
			
			if (currentUserIndex > 0) {
				onlineUsers.splice(currentUserIndex, 1);
				onlineUsers.unshift(req.user.id);
			}
			
			return res.json(onlineUsers);
		}).catch(function(err) {
			console.log(err);
			return res.serverError(err);
		})
	}
};

