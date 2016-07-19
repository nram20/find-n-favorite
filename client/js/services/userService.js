'use strict';

angular.module('myApp').service('User', function($http, $rootScope, $state, $q) {

	// this.getAll = () => {
	// 	return $http.get('/api/users')
	// 		.then(res => {
	// 			return $q.resolve(res.data);
	// 		})
	// 		.catch(err => {
	// 			console.log('err:', err);
	// 		})
	// }

	this.update = (id, profile) => {
		return $http.put(`/api/users/profile/update/${id}`, profile);
	}

	this.getProfile = () => {
		return $http.get('/api/users/profile')
			.then(res => {
				return $q.resolve(res.data);
			})
			.catch(err => {
				console.log('err:', err);
			})
	}

})
