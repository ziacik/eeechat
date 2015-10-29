/**
 * MessageController
 * 
 * @description :: Server-side logic for managing messages
 * @help :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var actionUtil = require('sails/lib/hooks/blueprints/actionUtil');

module.exports = {
	create : function(req, res) {
		var data = actionUtil.parseValues(req);
		Message.create(data).then(function(message) {
			var roomName = message.app + '/' + message.room;
			
			sails.sockets.broadcast(roomName, 'message', {
				verb : 'created',
				data : message
			}, req.socket);
			
			return res.created(message);
		}).catch(function(err) {
			return res.negotiate(err);
		});
	}
};
