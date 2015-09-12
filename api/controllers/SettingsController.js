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
				return res.ok(settings);
			} else {
				//TODO better way
				return res.ok({
					sendKey : 'Enter',
					showAvatars : true,
					showDesktopNotifications : true,
					desktopNotificationInterval : 6,
					showTitleNotifications : true,
					titleNotificationInteval : 2					
				});
			}
		}).catch(function(err) {
			console.log(err);
			return res.serverError(err);
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
			return res.serverError(err);
		})
	}
};

