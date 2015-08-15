/**
 * User.js
 * 
 * @description :: Chat user.
 * @docs :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
	//schema : true,
	attributes : {
		nickName : {
			type : 'string',
			required : true,
			unique : true
		},
		passwordSalt : 'string',
		passwordHash : 'string'
	}
};
