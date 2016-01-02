var service = {};

var gcm = require('node-gcm');

var sender = new gcm.Sender('AIzaSyAs36AYb4sGD5CTYtnBPUDhU5VBXcb2swI');
var registrationIds = ['fuiylHj6bUw:APA91bGj7pcBPOBsBXXJ7wcXFp9hqZCABoVYxzkR51i3dWlPJgcs1D6MjU18H2Xli9gVBD-iyEnZDymmMLB5yshX3ZaAU0mnKFCOEeYb-qmOEItzfz-7uGlwVtcgy4UWP2nmTkdvFUjC'];

var ledColor = [255, 0, 255, 255];

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
	
	var data = {
		app : appId,
		room : room,
		platform : platform,
		user : userId,
		identifier : identifier
	};
	
	Subscription.findOrCreate(data, data).catch(function(err) {
		console.log(err);
	}); //TODO handle errors
};

service.logout = function(req, userId) {
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
		room : room,
		platform : platform,
		user : userId,
		identifier : identifier
	}).catch(function(err) {
		console.log(err);
	}); //TODO handle errors
};

service.push = function(message) {
	Subscription.find().where({
		platform : 'Android',
		app : message.app,
		room : message.room,
		user : { '!' : message.sender }
	}).then(function(subscriptions) {
		if (!subscriptions.length) {
			console.log('No subscribers.');
			return;
		}
	
		User.findOne(message.sender).then(function(user) {
			var tokens = subscriptions.map(function(subscription) {
				return subscription.identifier;
			});

			var pushMessage = new gcm.Message();
		
			pushMessage.addData('title', user.username);
			pushMessage.addData('message', message.content);
			pushMessage.addData('ledColor', ledColor);
			
			sender.send(pushMessage, {
				registrationTokens: tokens
			}, function (err, response) {
				if (err) {
					console.error(err);
				}
				//TODO handle InvalidRegistration
			});
		});
	}).done();
};

module.exports = service;