/**
 * MessageController
 * 
 * @description :: Server-side logic for managing messages
 * @help :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var actionUtil = require('sails/lib/hooks/blueprints/actionUtil');
var gcm = require('node-gcm');
var sender = new gcm.Sender('AIzaSyAs36AYb4sGD5CTYtnBPUDhU5VBXcb2swI');
var registrationIds = ['fuiylHj6bUw:APA91bGj7pcBPOBsBXXJ7wcXFp9hqZCABoVYxzkR51i3dWlPJgcs1D6MjU18H2Xli9gVBD-iyEnZDymmMLB5yshX3ZaAU0mnKFCOEeYb-qmOEItzfz-7uGlwVtcgy4UWP2nmTkdvFUjC'];

function coerceMessageId(id) {
	try {
		var pkAttrDef = Message.attributes[Message.primaryKey];
		
		if (pkAttrDef.type === 'integer') {
			id = +id;
		}
		
		else if (pkAttrDef.type === 'string') {
			id = id + '';
		}
	}
	catch(e) {
		/// Ignore any error.
	}
	
	return id;
}

module.exports = {
	create : function(req, res) {
		var data = actionUtil.parseValues(req);
		Message.create(data).then(function(message) {
			var roomName = message.app + '/' + message.room;
			
			sails.sockets.broadcast(roomName, 'message', {
				verb : 'created',
				data : message
			}, req.socket);
			
			var pushMessage = new gcm.Message();

			pushMessage.addData('title', 'EeeChat'); //TODO user
			pushMessage.addData('message', message.content);
			pushMessage.addData('ledColor', [200,0,0,200]);
			
			//TODO refactor
			sender.send(pushMessage, { registrationTokens: registrationIds }, function (err, response) {
				if(err) console.error(err);
				//else    console.log(response);
			});

			
			return res.created(message);
		}).catch(function(err) {
			return res.negotiate(err);
		}).done();
	},
	
	update : function(req, res) {
		var id = coerceMessageId(actionUtil.requirePk(req));
		var values = actionUtil.parseValues(req);
		var idParamExplicitlyIncluded = ((req.body && req.body.id) || req.query.id);
		
		if (!idParamExplicitlyIncluded) {
			delete values.id;
		}
		
		Message.findOne(id).then(function(message) {
			if (!message) {
				return res.notFound();
			}
			
			if (message.sender !== req.user.id) {
				return res.forbidden();
			}

			return Message.update(id, values).then(function(records) {
				if (!records || !records.length || records.length > 1) {
					throw new Error('Error updating message.');
				}
	
				var roomName = message.app + '/' + message.room;
				
				sails.sockets.broadcast(roomName, 'message', {
					verb : 'updated',
					data : values,
					id : id
				}, req.socket);
				
				var updatedMessage = records[0];
				return res.ok(updatedMessage);
			});
		}).catch(function(err) {
			return res.negotiate(err);
		}).done();
	}
};
