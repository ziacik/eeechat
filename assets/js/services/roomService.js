var module = angular.module('roomServiceModule', []);

function RoomService($location) {
	this.namespace = 'anycomment.net';
	this.room = $location.search().room || 'global';
	return this;
}

module.factory('roomService', ['$location', RoomService ]);