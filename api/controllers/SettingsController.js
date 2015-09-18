/**
 * SettingsController
 *
 * @description :: Server-side logic for managing settings
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	index : function(req, res) {
		return Settings.findOne({ user : req.user.id }).then(function(settings) {
			if (settings) {
				settings.applyDefaults();
				return res.ok(settings);
			} else {				
				return res.ok(Settings.attributes.applyDefaults.bind({})());
			}
		}).catch(function(err) {
			console.log(err);
			return res.negotiate(err);
		})
	},
	
	save : function(req, res) {
		return Settings.update({ user : req.user.id }, req.body).then(function(updated) {
			if (!updated.length) {
				return Settings.create(req.body);
			} else {				
				return updated[0];
			}
		}).then(function(user) {
			return res.ok(user);
		}).catch(function(err) {
			return res.negotiate(err);
		})
	}
};

