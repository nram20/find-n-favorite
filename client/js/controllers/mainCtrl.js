'use strict';

angular.module('myApp').controller('mainCtrl', function($scope, $auth, $state, $rootScope) {
	console.log('mainCtrl!');

	$scope.headerController = function($scope, $location) {
		$scope.isActive = function(viewLocation) {
			return viewLocation === $location.path();
		};
	};

	// find out whether user is authenticated/logged in
	$scope.isAuthenticated = () => $auth.isAuthenticated();

	this.author = 'sonam kindy'; // example of using titlecase filter in module.js

	$scope.authenticate = provider => { // provider is string we pass in, like 'facebook'
		$auth.authenticate(provider)
			.then(res => {
				$state.go('profile');
				console.log('res:', res);
			})
			.catch(err => {
				console.log('err:', err);
			})
	}

	$scope.logout = () => {
		$auth.logout();
		$state.go('home');
		$rootScope.currentUser = null;
	}

})
