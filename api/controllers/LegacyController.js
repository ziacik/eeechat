/**
 * LegacyController
 *
 * @description :: Server-side logic for managing legacies
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	getUser : function(req, res) {
		User.findOne({ username : req.param('login') }).then(function(user) {
			return res.view('legacy/getUser', user);
		}).catch(function(err) {
			return res.error(err);
		})
	},
	
	getRooms : function(req, res) {
		return res.view('legacy/getRooms');
	}

};

