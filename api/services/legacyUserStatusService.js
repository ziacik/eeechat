var service = {};

service.legacyConnectionStatus = {};

service.userConnect = function(userId) {
	service.legacyConnectionStatus[userId] = {
		legacyMessageId : legacyIdProvider.newMessageId(),
		createdAt : new Date(),
		state : 1
	};
}

service.userDisconnect = function(userId) {
	service.legacyConnectionStatus[userId] = {
		legacyMessageId : legacyIdProvider.newMessageId(),
		createdAt : new Date(),
		state : 0
	};
}

service.getStatusChanges = function(fromId) {
	var userIds = Object.getOwnPropertyNames(service.legacyConnectionStatus).filter(function(userId) {
		return service.legacyConnectionStatus[userId].legacyMessageId >= fromId;
	});
	
	return User.find().where({ id : userIds }).then(function(users) {
		return users.map(function(user) {
			var status = service.legacyConnectionStatus[user.id];
			
			return {
				user : user,
				legacyMessageId : status.legacyMessageId,
				createdAt : status.createdAt,
				state : status.state
			};
		})
	});
}

module.exports = service;