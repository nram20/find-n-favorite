'use strict';

angular.module('myApp').controller('searchCtrl', function($scope, Business, $rootScope) {
	console.log('searchCtrl');

	$scope.submit = () => {
		console.log('submit');
		Business.search($scope.params)
			.then(res => {
				console.log('res:', res);
				$scope.businesses = res;
				$scope.params = null;
			})
			.catch(err => {
				console.log('err:', err);
			});
	};

	$scope.addFavorite = business => {
		console.log('business:', business);
		Business.addFavorite(business)
			.then(res => {
				console.log('res:', res);
				$rootScope.currentUser = res;
			})
			.catch(err => {
				console.log('err:', err);
			});
	};

});
