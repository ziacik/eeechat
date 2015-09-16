var app = angular.module('eeechat', [
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

app.config(['$sailsProvider', function ($sailsProvider) {
	$sailsProvider.config.transports = ['polling', 'websocket'];
}]);