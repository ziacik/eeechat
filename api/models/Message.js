/**
 * Message.js
 * 
 * @description :: A chat message with sender and recipients identification.
 * @docs :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
	schema : true,
	
	attributes : {
		app : {
			model : 'application',
			required : true
		},
		room : {
			type : 'string'
		},
		sender : {
			model : 'user',
			required : true
		},
		recipients : {
			collection : 'user'			
		},
		content : {
			type : 'string',
			required : true
		},
        legacyId : {
        	type : 'integer',
        	required : true,
        	unique : true,
        	defaultsTo : function() {
        		return legacyIdProvider.newMessageId();
        	}
        }
	}
};
