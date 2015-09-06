/**
 * LegacyController
 * 
 * @description :: Server-side logic for managing legacies
 * @help :: See http://sailsjs.org/#!/documentation/concepts/Controllers
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
		var userId = parseInt(req.param('myUserID'));
		var isConnect = req.param('state') > 0;
		
		if (isConnect) {
			LegacyConnection.findOne(userId).then(function(user) {
				if (user) {
					return res.view('legacy/changeState');
				}
				
				return LegacyConnection.create({
					user : userId,
					lastAccess : new Date().toISOString()
				}).then(function() {
					User.message(userId, {
						state : 'online'
					});
					
					return res.view('legacy/changeState');
				});
			}).catch(function(err) {
				return res.serverError(err);				
			})
		} else {
			LegacyConnection.destroy(userId).then(function() {
				User.message(userId, {
					state : 'offline'
				});
				return res.view('legacy/changeState');				
			}).catch(function(err) {
				return res.serverError(err);				
			})
		}		
	},
	
	getUsers : function(req, res) {
		// TODO deduplicate by refactoring into service
		var onlineUserRooms = sails.sockets.rooms().filter(function(roomName) {
			return roomName.indexOf('onlineUser') === 0;
		});
		
		var onlineUsers = onlineUserRooms.map(function(roomName) {
			var idStr = roomName.substr('onlineUser'.length);
			var id;
			if (isNaN(idStr)) {
				return idStr;
			} else {
				return parseInt(idStr);
			}			
		});
		
		LegacyConnection.find().then(function(legacyConnections) {
			var legacyUsers =  legacyConnections.map(function(legacyConnection) {
				return legacyConnection.user;
			});
			
			return User.find().where({ id : onlineUsers.concat(legacyUsers) });
		}).then(function(users) {
			return res.view('legacy/getUsers', { users : users });
		}).catch (function(err) {
			console.log(err); 
			return res.serverError(err);
		})
	},

	getMessages : function(req, res) {
		return res.view('legacy/getMessages', { messages : [] });
	}
};