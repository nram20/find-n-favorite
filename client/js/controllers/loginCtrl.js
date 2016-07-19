'use strict';

angular.module('myApp').controller('loginCtrl', function($scope, $state, $auth) {
	console.log('loginCtrl!');

	$scope.login = () => {
		$auth.login($scope.user)
			.then(res => {
				console.log('res:', res);
				$state.go('profile');
			})
			.catch(err => {
				console.log('err:', err);
			});
	};

})
