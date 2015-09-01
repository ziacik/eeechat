var module = angular.module('autoFocusModule', []);

function AutoFocus() {
	return {
		restrict: 'A',
		//TODO Review. Doesn't work when this is uncommented.
//		scope: {
//			focus: '=autofocus'
//		},
		link: function($scope, elt, attrs) {
			$scope.$watch('focus', function(val) {
				if (val) {
					elt[0].focus();
					$scope.focus = false;
				}
			});
		}
	};
}

module.directive('autofocus', AutoFocus);