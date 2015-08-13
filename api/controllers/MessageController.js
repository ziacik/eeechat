/**
 * MessageController
 * 
 * @description :: Server-side logic for managing messages
 * @help :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	today : function(req, res) {
		var today = new Date();
		today.setHours(0, 0, 0, 0);

		Message.find({
			where : {
				createdAt : {
					'>=' : today
				}
			},
			sort : 'createdAt'
		}).then(function(messages) {
			res.send(messages);
		}).catch(function(err) {
			res.serverError(err);
		});
	}
};
