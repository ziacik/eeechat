/**
 * Application.js
 * 
 * @description :: TODO: You might write a short summary of how this model works
 *              and what it represents here.
 * @docs :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
	attributes : {
		name : {
			type : 'string',
			required : true,
			index : true,
			unique : true
		},
		showUsers : {
			type : 'boolean',
			defaultsTo : true
		},
		initialGetMode : {
			type : 'string',
			enum :  ['all', 'today'],
			defaultsTo : 'today'
		}
	}
};
