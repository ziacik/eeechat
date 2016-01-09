var module = angular.module('appServiceModule', ['notificationServiceModule']);

function AppService($sails, $rootScope, $location, $window, notificationService) {
	var self = this;
	
	this.appConfiguration;
	this.appId = $location.search().appId;
	this.room = $location.search().room || 'global';
	
	this.disconnect = function(locationQuery) {
		$sails.disconnect();
		$window.location.href = '/logout' + (locationQuery || "");
	};	

	this.checkError = function(err) {
		if (err.statusCode === 403) {
			notificationService.systemNotify('Automatické odhlásenie. Prihláste sa znova.');
			$window.location.reload();
		} else {
			console.error(err);
			notificationService.systemNotify('Nemožno sa zúčastniť diskusie. Skúste obnoviť stránku.');
		}
	};
	
	this.load = function() {
		if (self.appId == null) {
			return $sails.get('/applications/?name=Eeechat').then(function(res) {
				self.appConfiguration = res.data[0];
				self.appId = self.appConfiguration.id; 
				self.loaded = true;
				$rootScope.$broadcast('appConfigurationLoaded', self.appConfiguration);
			}).catch(function(err) {
				self.checkError(err);
			})
		} else {
			return $sails.get('/applications/' + self.appId).then(function(res) {
				self.appConfiguration = res.data;
				$rootScope.$broadcast('appConfigurationLoaded', self.appConfiguration);
				self.loaded = true;
			}).catch(function(err) {
				self.checkError(err);
			})			
		}
	}
	
	return this;
}

module.factory('appService', ['$sails', '$rootScope', '$location', '$window', 'notificationService', AppService ]);