var User = {
    // Enforce model schema in the case of schemaless databases
    schema : true,

    attributes : {
        username : {
            type : 'string',
            unique : true
        },
        email : {
            type : 'email',
            unique : true,
            protected : true
        },
        passports : {
            collection : 'Passport',
            via : 'user',
            protected : true
        },
        imageUrl : {
	        type : 'string'
        },
        legacyId : {
        	type : 'integer'
        },
        legacySalt : {
	        type : 'string'
        },
        legacyColor : {
	        type : 'string'
        },
        legacyPassword : {
	        type : 'string',
	        protected : true
        }
    },
    
    beforeCreate : function(values, next) {
    	values.legacyId = Math.ceil(new Date() / 1000) - 1441574512;
    	next();
    }
};

module.exports = User;
