/**
* Subscription.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
	attributes: {
		app : {
			model : 'application',
			required : true
		},
		room : {
			type : 'string'
		},
		platform : {
			type : 'string',
			required : true
		},
		user : {
			model : 'user',
			required : true
		},
		identifier : {
			type : 'string'
		}
	}
};