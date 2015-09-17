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
	        type : 'string',
	        defaultsTo : function() {
	        	return userImageService.generateAvatarUrl(this);
	        }
        },
        legacyId : {
        	type : 'integer',
        	required : true,
        	unique : true,
        	defaultsTo : function() {
        		return legacyIdProvider.newUserId();
        	}
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
    
    afterCreate: function(user, next) {
		userImageService.updateUserImage(user);
    	next();
    },
    
    afterUpdate: function(user, next) {
		userImageService.updateUserImage(user);
    	next();
    }
};

module.exports = User;
