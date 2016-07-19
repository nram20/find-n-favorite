'use strict';

angular.module('myApp').controller('businessShowCtrl', function($scope, Business, BusinessById, BusinessFavorites) {
	console.log('businessShowCtrl');
	$scope.business = BusinessById;
	$scope.numOfFavorites = BusinessFavorites;
	console.log('$scope.business:', $scope.business);
});
