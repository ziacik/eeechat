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
        	type : 'integer',
        	required : true,
        	unique : true
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
    
    beforeValidate : function(values, next) {
    	values.legacyId = legacyIdProvider.newUserId();
    	next();
    }
};

module.exports = User;
