/**
 * Settings.js
 * 
 * @description :: TODO: You might write a short summary of how this model works
 *              and what it represents here.
 * @docs :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
	autoPK : false,

	attributes : {
		user : {
			model : 'user',
			required : true,
			primaryKey : true
		},
		sendKey : {
			type : 'string',
			enum : [ 'Enter', 'Ctrl+Enter', 'Alt+Enter', 'Alt+S', 'Ctrl+S', 'Shift+Enter' ],
			defaultsTo : 'Enter'
		},
		showAvatars : {
			type : 'boolean',
			defaultsTo : true
		},
		showDesktopNotifications : {
			type : 'boolean',
			defaultsTo : true
		},
		desktopNotificationInterval : {
			type : 'integer',
			defaultsTo : 6
		},
		showTitleNotifications : {
			type : 'boolean',
			defaultsTo : true
		},
		titleNotificationInteval : {
			type : 'integer',
			defaultsTo : 2
		}
	}
};
