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
    }
};

module.exports = User;
