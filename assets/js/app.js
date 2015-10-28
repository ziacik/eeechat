var app = angular.module('eeechat', [
	'roomServiceModule',
	'chatServiceModule',	
	'chatControllerModule',
	'userControllerModule',
	'messageControllerModule',
	'settingsControllerModule',
	'autoFocusModule',
	'angular-inview',
	'monospaced.elastic',
	'ngSanitize'
]);

app.config(['$sailsProvider', function($sailsProvider) {
	$sailsProvider.config.transports = ['polling', 'websocket'];
}]);

app.config(['$locationProvider', function($locationProvider) {
	$locationProvider.html5Mode(true);
}])