/**
 * AppController
 * 
 * @description :: Main App controller
 * @help :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	chat : function(req, res) {
		passport.getDisconnectedProviders(req).then(function(providers) {
			var isPasswordNotSet = !!providers.local;
			delete providers.local;
			
			return res.view('chat', {
				errors : req.flash('error'),
				isPasswordNotSet : isPasswordNotSet,
				disconnectedProviders : providers
			});			
		}).catch(function(err) {
			console.error(err);
			return res.view('chat', {
				errors : req.flash('error'),
				disconnectedProviders : []
			});			
		}).done();		
	}
};
