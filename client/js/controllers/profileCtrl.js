'use strict';

angular.module('myApp').controller('profileCtrl', function($rootScope, $scope, User, Profile, Business) {
	console.log('profileCtrl');

	$scope.myProfile = false;
	$rootScope.currentUser = Profile;
	console.log('$rootScope.currentUser:', $rootScope.currentUser);

	$scope.deleteFavorite = business => {
		Business.deleteFavorite(business)
			.then(res => {
				$rootScope.currentUser = res;
			})
			.catch(err => {
				console.log('err:', err);
			})
	}

})
