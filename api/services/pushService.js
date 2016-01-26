var service = {};

var gcm = require('node-gcm');
var apn = require('apn');
var gcmSender = null;
var apnConnection = null;

if (sails.config.pushNotifications.android.senderId) {
	gcmSender = new gcm.Sender(sails.config.pushNotifications.android.senderId);
}

if (sails.config.pushNotifications.iOs.passphrase) {
	var options = {
		passphrase : sails.config.pushNotifications.iOs.passphrase,
		production : sails.config.pushNotifications.iOs.production
	};

	apnConnection = new apn.Connection(options);
}


var ledColor = [255, 0, 255, 255];

var hasServices = function() {
	return hasAndroidService() || hasIOsService();
};

var hasAndroidService = function() {
	return gcmSender != null;
};

var hasIOsService = function() {
	return apnConnection != null;
};

var hasIOsService = function() {
};

service.login = function(req, userId) {
	var pushId = locationService.getPushId(req);
	
	if (!pushId) {
		return;
	}

	var separatorIdx = pushId.indexOf(';');
	var platform = pushId.substr(0, separatorIdx);
	var identifier = pushId.substr(separatorIdx + 1);
	
	var room = locationService.getRoom(req) || 'global';
	var appId = locationService.getAppId(req) || locationService.globalAppId;
	
	var query = {
		app : appId,
		platform : platform,
		identifier : identifier
	};
	
	var data = {
		app : appId,
		room : room,
		platform : platform,
		user : userId,
		identifier : identifier
	};
		
	Subscription.findOrCreate(query, data).then(function subscriptionFindOrCreate(record) {
		if (record.user !== data.user || record.room !== data.room) {
			return Subscription.update(query, data);
		}
	}).catch(function(err) {
		console.log(err);
	}); //TODO handle errors
};

service.logout = function(req) {
	var pushId = locationService.getPushId(req);
	
	if (!pushId) {
		return;
	}
	
	var separatorIdx = pushId.indexOf(';');
	var platform = pushId.substr(0, separatorIdx);
	var identifier = pushId.substr(separatorIdx + 1);
	
	var room = locationService.getRoom(req) || 'global';
	var appId = locationService.getAppId(req) || locationService.globalAppId;
	
	Subscription.destroy({
		app : appId,
		platform : platform,
		identifier : identifier
	}).catch(function(err) {
		console.log(err);
	}); //TODO handle errors
};

service.push = function(message) {
	if (!hasServices()) {
		return;
	}

	Subscription.find().where({
		app : message.app,
		room : message.room,
		user : { '!' : message.sender }
	}).then(function(subscriptions) {
		if (!subscriptions.length) {
			return;
		}
	
		User.findOne(message.sender).then(function(user) {
			var androidTokens = subscriptions.filter(function(subscription) {
				return subscription.platform === 'Android';
			}).map(function(subscription) {
				return subscription.identifier;
			});
		
			var iOsTokens = subscriptions.filter(function(subscription) {
				return subscription.platform === 'iOS';
			}).map(function(subscription) {
				return subscription.identifier;
			});

			if (androidTokens.length) {
				pushAndroid(user, message, androidTokens);
			}
			
			if (iOsTokens.length) {
				pushIos(user, message, iOsTokens);
			}
		});
	}).done();
};

var pushAndroid = function(user, message, tokens) {
	if (!hasAndroidService()) {
		return;
	}

	var pushMessage = new gcm.Message();

	pushMessage.addData('title', user.username);
	pushMessage.addData('message', message.content);
	pushMessage.addData('ledColor', ledColor);
	
	gcmSender.send(pushMessage, {
		registrationTokens: tokens
	}, function (err, response) {
		if (err) {
			console.error(err);
		}
		cleanupAndroidSubscriptions(message.app, 'Android', tokens, response);
	});
};

var pushIos = function(user, message, tokens) {
	if (!hasIOsService()) {
		return false;
	}

	var feedback = new apn.Feedback(options);
	feedback.on("feedback", function(devices) {
		devices.forEach(function(item) {
			// TODO clean or leave
		});
	});
	
	tokens.forEach(function(token) {
		var myDevice = new apn.Device(token);
		var note = new apn.Notification();
		
		note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
		note.badge = 3;
		note.sound = "ping.aiff";
		note.alert = "\uD83D\uDCE7 \u2709 You have a new message";
		note.payload = {'messageFrom': user.username};
		
		apnConnection.pushNotification(note, myDevice);	
	});	
};

var cleanupAndroidSubscriptions = function(appId, platform, identifiers, response) {
	if (!response.results || !response.results.length) {
		return;
	}

	var toDelete = identifiers.filter(function(identifier, index) {
		return response.results[index].error === 'InvalidRegistration';
	});
	
	if (!toDelete.length) {
		return;
	}
	
	Subscription.destroy({
		app : appId,
		platform : platform,
		identifier : toDelete
	}).catch(function(err) {
		console.error(err);
	}); //TODO handle errors
};

module.exports = service;
