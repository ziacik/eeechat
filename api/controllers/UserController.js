/**
 * UserController
 * 
 * @description :: Server-side logic for managing users
 * @help :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {		
	join : function(req, res) {
		socketService.connect(req);
		legacyUserStatusService.userConnect(req.user.id);

		return res.ok();
	},
	
	online : function(req, res) {
		if (!req.user) {
			return res.forbidden();
		}

		var onlineUsers = socketService.getOnlineUsers(req);				
		
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

