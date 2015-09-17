var path = require('path');
var fs = require('fs');
var http = require('http-request');
var gravatar = require('gravatar');
var querystring = require('querystring');
var shortid = require('shortid');

var service = {};

service.generateAvatarUrl = function(user) {
	var str = user.username;
	for (var i = 0, hash = 0; i < str.length; hash = str.charCodeAt(i++) + ((hash << 5) - hash));
	for (var i = 0, color = ""; i < 3; color += ("00" + ((hash >> i++ * 8) & 0xFF).toString(16)).slice(-2));
	
	var placeHoldItUrl = 'http://placehold.it/50/' + color + '/?text=' + querystring.escape(user.username);	
	var gravatarUrl = gravatar.url(user.email, { s: 50, d : placeHoldItUrl }, false);
	
	return gravatarUrl;
}

service.getAvatarsDir = function() {
	return 'avatars';
}

service.getStorageDir = function() {
	return path.resolve(__dirname, '../../assets', service.getAvatarsDir());
}

service.getPublishDir = function() {
	return path.resolve(__dirname, '../../.tmp/public', service.getAvatarsDir());	
}

service.updateUserImage = function(user) {
	if (user.imageUrl && user.imageUrl.indexOf('http') !== 0 && user.imageUrl.indexOf('//') !== 0 ) {
		return;
	}
	
	if (!user.imageUrl) {
		user.imageUrl = service.generateAvatarUrl(user);
	}
	
	if (user.imageUrl.indexOf('//') === 0) {
		user.imageUrl = 'http:' + user.imageUrl;
	}
	
	var destinationFile = shortid.generate() + '.jpg';	
	var storagePath = path.resolve(service.getStorageDir(), destinationFile);
	var publishPath = path.resolve(service.getPublishDir(), destinationFile);
	
	http.get(user.imageUrl, storagePath, function(err, res) {
		if (err) {
			console.error('Unable to download avatar from ' + user.imageUrl + ': ' + (err.stack || err.message || err));
			return;
		}

		fs.symlink(storagePath, publishPath, function(err) {
			if (err && err.code !== 'EEXIST') {
				console.err('Unable to create symlink to avatar: ' + (err.stack || err.message || err));
				return;
			}
			
			user.imageUrl = service.getAvatarsDir() + '/' + destinationFile;

			User.update(user.id, { imageUrl : user.imageUrl }).then(function(updated) {
				User.publishUpdate(user.id, { imageUrl : user.imageUrl });
			}).catch(function(err) {
				console.error(err);
			}).done();
		});		
	})
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