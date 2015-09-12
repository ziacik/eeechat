/**
 * AppController
 * 
 * @description :: Main App controller
 * @help :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	chat : function(req, res) {
		return res.view('chat');
	}
};
