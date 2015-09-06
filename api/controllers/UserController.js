/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	connected : function(req, res) {
		if (!req.user) {
			return res.forbidden();
		}
		
		var isNumericId = typeof req.user.id === 'number';
		
		if (req.socket) {
			var roomName = 'connectedUser' + req.user.id;
			sails.sockets.join(req.socket, roomName);
			
 			if (sails.sockets.subscribers(roomName).length == 1) {
 				User.message(req.user.id, {
 					state : 'online'
 				}, req.socket);
 			}
		}
		
		var connectedUserRooms = sails.sockets.rooms().filter(function(roomName) {
			return roomName.indexOf('connectedUser') === 0;
		});
		
		var connectedUserIds = connectedUserRooms.map(function(roomName) {
			var idStr = roomName.substr(13);
			if (isNumericId) {
				return parseInt(idStr);
			} else {
				return idStr;
			}
		});
		
		/// First one will be current user id.
		var currentUserIndex = connectedUserIds.indexOf(req.user.id);
		
		if (currentUserIndex < 0) {
			/// Not connected? Should not happen.
			return res.forbidden();
		}
		
		if (currentUserIndex > 0) {
			connectedUserIds.splice(currentUserIndex, 1);
			connectedUserIds.unshift(req.user.id);
		}
		
		return res.json(connectedUserIds);
	}
};

