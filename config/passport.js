/**
 * Passport configuration
 * 
 * This is the configuration for your Passport.js setup and where you define the
 * authentication strategies you want your application to employ.
 * 
 * I have tested the service with all of the providers listed below - if you
 * come across a provider that for some reason doesn't work, feel free to open
 * an issue on GitHub.
 * 
 * Also, authentication scopes can be set through the `scope` property.
 * 
 * For more information on the available providers, check out:
 * http://passportjs.org/guide/providers/
 */

module.exports.passport = {
    local : {
	    strategy : require('passport-local').Strategy
    },

    bearer : {
	    strategy : require('passport-http-bearer').Strategy
    },

    facebook : {
        name : 'Facebook',
        protocol : 'oauth2',
        strategy : require('passport-facebook').Strategy,
        options : {
            clientID : '524441804370335',
            clientSecret : '6544ece4cb1a2e6579af2b70e754260c',
            scope : [ 'email' ]
        }
    },

    google : {
        name : 'Google',
        protocol : 'oauth2',
        strategy : require('passport-google-oauth').OAuth2Strategy,
        options : {
            clientID : '768631281510-fri6pdt6ld4me8uqm7b6ch45uakgunju.apps.googleusercontent.com',
            clientSecret : 'BGehQdKmTH5gTUWmafQkhsHt',
            scope : [ 'profile', "email" ]
        }
    }
};
