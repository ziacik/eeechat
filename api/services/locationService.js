var service = {};

service.initialize = function() {
	return Application.find().where({ name : 'Eeechat' }).then(function(applications) {
		service.globalAppId = applications[0].id;
	}).catch(function(err) {
		console.error(err);
	});
};

service.getRoom = function(req) {
	return req.param('room');
};

service.getAppId = function(req) {
	return req.param('appId');
};

service.getPushId = function(req) {
	var state = req.param('state');	
	
	if (state != null) {
		return JSON.parse(state).p;
	} else {
		return req.param('pushId');
	}
};

service.getLocationQuery = function(req) {
	var room, appId, pushId;
	
	var state = req.param('state');	
	
	if (state != null) {
		var stateObj = JSON.parse(state);
		room = stateObj.r;
		appId = stateObj.a;
		pushId = stateObj.p;
	} else {
		room = service.getRoom(req);
		appId = service.getAppId(req);
		pushId = service.getPushId(req);		
	}
	
	var query = '';
	
	if (room) {
		query += query ? '&' : '?';
		query += 'room=' + encodeURIComponent(room);
	}
	
	if (appId) {
		query += query ? '&' : '?';
		query += 'appId=' + encodeURIComponent(appId);
	}
	
	if (pushId) {
		query += query ? '&' : '?';
		query += 'pushId=' + encodeURIComponent(pushId);
	}
	
	return query;
};

module.exports = service;