var service = {};

service.getRoom = function(req) {
	return req.param('room');
}

service.getAppId = function(req) {
	return req.param('appId');
}

service.getLocationQuery = function(req) {
	var room, appId;
	
	var state = req.param('state');	
	
	if (state != null) {
		var stateObj = JSON.parse(state);
		room = stateObj.r;
		appId = stateObj.a;
	} else {
		room = service.getRoom(req);
		appId = service.getAppId(req);		
	}
	
	if (room && appId) {
		return '?room=' + encodeURIComponent(room) + '&appId=' + encodeURIComponent(appId);
	} else if (room) {
		return '?room=' + encodeURIComponent(room);
	} else if (appId) {
		return '?appId=' + encodeURIComponent(appId);
	} else {
		return '';
	}
}

module.exports = service;