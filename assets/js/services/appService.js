var module = angular.module('appServiceModule', []);

function AppService($sails, $rootScope, $location) {
	var self = this;
	
	this.appConfiguration = {};
	this.appId = $location.search().appId;
	this.room = $location.search().room || 'global';
	
	this.load = function() {
		if (self.appId == null) {
			return $sails.get('/applications/?name=Eeechat').then(function(res) {
				self.appConfiguration = res.data[0];
				self.appId = self.appConfiguration.id; 
				$rootScope.$broadcast('appConfigurationLoaded', self.appConfiguration);
			}).catch(function(err) {
				console.error(err);
				alert('Chyba pri čítaní nastavení. Obnovte stránku.');
			})
		} else {
			return $sails.get('/applications/' + self.appId).then(function(res) {
				self.appConfiguration = res.data;
				$rootScope.$broadcast('appConfigurationLoaded', self.appConfiguration);
			}).catch(function(err) {
				console.error(err);
				alert('Chyba pri čítaní nastavení. Obnovte stránku.');
			})			
		}
	}
	
	return this;
}

module.factory('appService', ['$sails', '$rootScope', '$location', AppService ]);