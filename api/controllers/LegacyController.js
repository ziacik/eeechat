/**
 * LegacyController
 *
 * @description :: Server-side logic for managing legacies
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	getUser : function(req, res) {
		User.findOne({ username : req.param('login') }).then(function(user) {
			return res.view('legacy/getUser', user);
		}).catch(function(err) {
			return res.error(err);
		})
	},

	getRooms : function(req, res) {
		return res.view('legacy/getRooms');
	},
	
	changeState : function(req, res) {
		return res.view('legacy/changeState');
	},
	
	getUsers : function(req, res) {
		//TODO deduplicate by refactoring into service
		var connectedUserRooms = sails.sockets.rooms().filter(function(roomName) {
			return roomName.indexOf('connectedUser') === 0;
		});
		
		var connectedUserIds = connectedUserRooms.map(function(roomName) {
			var idStr = roomName.substr(13);
			var id;
			if (isNaN(idStr)) {
				return idStr;
			} else {
				return parseInt(idStr);
			}			
		});
		
		console.log(connectedUserIds);
		
		User.find().where({ id : connectedUserIds }).then(function(users) {
			console.log('USERS', users)
			return res.view('legacy/getUsers', { users : users });			
		}).catch (function(err) {
			//TODO
		})		
	},	

	getMessages : function(req, res) {
		return res.view('legacy/getMessages', { messages : [] });
	}
};

