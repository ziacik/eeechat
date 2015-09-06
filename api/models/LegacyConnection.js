module.exports = {
	attributes : {
		user : {
			model : 'user',
			required : true,
			primaryKey : true
		},
		lastAccess : {
			type : 'datetime',
			required : true
		}
	}
};
