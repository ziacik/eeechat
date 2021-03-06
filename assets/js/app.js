var app = angular.module('eeechat', [
	'appServiceModule',
	'chatServiceModule',
	'chatControllerModule',
	'userControllerModule',
	'messageControllerModule',
	'settingsControllerModule',
	'uploadControllerModule',
	'autoFocusModule',
	'embedLinkyModule',
	'angular-inview',
	'monospaced.elastic',
	'ngFileUpload'
]);

app.config([ '$sailsProvider', function($sailsProvider) {
	$sailsProvider.config.transports = [ 'polling', 'websocket' ];
} ]);

app.config([ '$locationProvider', function($locationProvider) {
	$locationProvider.html5Mode(true);
} ]);