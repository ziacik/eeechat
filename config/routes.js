/**
 * Route Mappings (sails.config.routes)
 * 
 * Your routes map URLs to views and controllers.
 * 
 * If Sails receives a URL that doesn't match any of the routes below, it will
 * check for matching files (images, scripts, stylesheets, etc.) in your assets
 * directory. e.g. `http://localhost:1337/images/foo.jpg` might match an image
 * file: `/assets/images/foo.jpg`
 * 
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 * 
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default
 * Gruntfile in Sails copies flat files from `assets` to `.tmp/public`. This
 * allows you to do things like compile LESS or CoffeeScript for the front-end.
 * 
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {
	'get /login' : 'AuthController.login',
	'get /logout' : 'AuthController.logout',
	'get /register' : 'AuthController.register',
	'get /connect' : 'AuthController.connect',

	'post /auth/local' : 'AuthController.callback',
	'post /auth/local/:action' : 'AuthController.callback',

	'get /auth/:provider' : 'AuthController.provider',
	'get /auth/:provider/callback' : 'AuthController.callback',
	'get /auth/:provider/:action' : 'AuthController.callback',

	/***************************************************************************
	 * * Make the view located at `views/homepage.ejs` (or
	 * `views/homepage.jade`, * etc. depending on your default view engine) your
	 * home page. * * (Alternatively, remove this and add an `index.html` file
	 * in your * `assets` directory) * *
	 **************************************************************************/

	'/' : 'AppController.chat',
	'/chat/join' : 'UserController.join',
	
	'/settings/template' : {
		view : 'settings'
	},
	
	'PUT /settings' : 'SettingsController.save',
	
	'/users/online' : 'UserController.online',
	
	'POST /upload' : 'UploadController.upload',
	'GET /upload' : 'UploadController.serve',

	'/legacy/getuser.php' : 'LegacyController.getUser',
	'/legacy/getrooms.php' : 'LegacyController.getRooms',
	'/legacy/getusers.php' : 'LegacyController.getUsers',
	'/legacy/getmessages.php' : 'LegacyController.getMessages',
	'/legacy/changestate.php' : 'LegacyController.changeState',
	'/legacy/getupdates.php' : 'LegacyController.getUpdates',
	'/legacy/addmessage.php' : 'LegacyController.addMessage'
};
