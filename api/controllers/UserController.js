/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	connected : function(req, res) {
		if (req.user && req.socket) {
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
			return parseInt(roomName.substr(13));
		})
		
		return res.json(connectedUserIds);
	}
};

