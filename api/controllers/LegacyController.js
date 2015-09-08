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
		var legacyUserId = parseInt(req.param('myUserID'));
		
		User.findOne({ legacyId : legacyUserId }).then(function(user) {
			var isConnect = req.param('state') > 0;
			
			if (isConnect) {
				return LegacyConnection.findOne({ user : user.id }).then(function(connection) {
					if (connection) {
						return res.view('legacy/changeState');
					}
					
					return LegacyConnection.create({
						user : user.id,
						lastAccess : new Date().toISOString()
					}).then(function() {
						User.message(user.id, {
							state : 'online'
						});
						
						legacyUserStatusService.userConnect(user.id);
						
						return res.view('legacy/changeState');
					});
				});
			} else {
				LegacyConnection.destroy(user.id).then(function() {
					User.message(user.id, {
						state : 'offline'
					});
					
					legacyUserStatusService.userDisconnect(user.id);

					return res.view('legacy/changeState');
				})
			}			
		}).catch(function(err) {
			return res.serverError(err);				
		})		
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
		var fromId = parseInt(req.param('fromID'));
		
		var today = new Date();
		today.setHours(0, 0, 0, 0);
		
		Message.find({
			createdAt : { '>' : today },
			legacyId : { '>=' : fromId }
		})
		.populateAll()
		.then(function(messages) {
			return legacyUserStatusService.getStatusChanges(fromId).then(function(statusChanges) {
				return res.view('legacy/getMessages', { 
					messages : messages, 
					statusChanges : statusChanges 
				});
			})
		}).catch(function(err) {
			return res.serverError(err);
		})
	},
	
	getUpdates : function(req, res) {
		return res.view('legacy/getUpdates');
	},
	
	addMessage : function(req, res) {
		var content = req.param('message');
		var legacySenderId = req.param('myUserID');
		
		User.findOne({ legacyId : legacySenderId }).then(function(user) {
			return Message.create({
				sender : user.id,
				content : content
			}).then(function(message) {
				Message.publishCreate(message);
				return res.view('legacy/addMessage');
			});			
		}).catch(function(err) {
			return res.serverError(err);
		})
	}
};