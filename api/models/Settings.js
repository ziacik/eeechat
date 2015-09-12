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
		applyDefaults : function() {
			var self = this;
			Object.getOwnPropertyNames(module.exports.attributes).forEach(function(attr) {
				var defaultValue = module.exports.attributes[attr].defaultsTo;
				
				if (defaultValue && self[attr] == null) {
					self[attr] = defaultValue;
				}
			});
			return self;
		},
		
		user : {
			model : 'user',
			required : true,
			primaryKey : true
		},
		sendKey : {
			type : 'string',
			enum : [ 'Enter', 'Ctrl+Enter', 'Alt+Enter', 'Alt+S', 'Ctrl+S', 'Shift+Enter' ],
			required : true,
			defaultsTo : 'Enter'
		},
		showAvatars : {
			type : 'boolean',
			required : true,
			defaultsTo : true
		},
		showDesktopNotifications : {
			type : 'boolean',
			required : true,
			defaultsTo : true
		},
		desktopNotificationInterval : {
			type : 'integer',
			required : true,
			defaultsTo : 6
		},
		showTitleNotifications : {
			type : 'boolean',
			required : true,
			defaultsTo : true
		},
		titleNotificationInterval : {
			type : 'integer',
			required : true,
			defaultsTo : 2
		}
	}
};
