var provider = {};

provider.userId = 0;
provider.messageId = 0;

provider.initialize = function() {
	return User.find()
		.sort({ legacyId : 'desc' })
		.limit(1)
		.then(function(result) {
			if (result && result.length) {
				provider.userId = result[0].legacyId;
			} else {
				provider.userId = 1;
			}
						
			return Message.find()
				.sort({ legacyId : 'desc' })
				.limit(1);
		})
		.then(function(result) {
			if (result && result.length) {
				provider.messageId = result[0].legacyId;
			} else {
				provider.messageId = 1;
			}
		});
};

provider.newUserId = function() {
	provider.userId++;
	return provider.userId;
};

provider.newMessageId = function() {
	provider.messageId++;
	return provider.messageId;
};

module.exports = provider;