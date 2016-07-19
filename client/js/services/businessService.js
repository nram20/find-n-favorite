'use strict';

angular.module('myApp').service('Business', function($http, $state, $q) {

	// /search
	this.search = params => {
		return $http.get(`/api/businesses/search/${params.term}/${params.loc}`)
			.then(res => {
				return $q.resolve(res.data.businesses);
			})
			.catch(err => {
				console.log('err:', err);
			});
	};

	// single business view
	this.searchById = id => {
		return $http.get(`/api/businesses/searchById/${id}`)
			.then(res => {
				return $q.resolve(res.data);
			})
			.catch(err => {
				console.log('err:', err);
			});
	};

	// number of favorites business has
	this.countFavorites = id => {
		return $http.get(`/api/businesses/countFavorites/${id}`)
			.then(res => {
				return $q.resolve(res.data);
			})
			.catch(err => {
				console.log('err:', err);
			});
	};

	// user add favorite
	this.addFavorite = business => {
		return $http.post(`/api/businesses/addFavorite/${business.id}`, business)
			.then(res => {
				return $q.resolve(res.data);
			})
			.catch(err => {
				console.log('err:', err);
			});
	};

	// user delete favorite
	this.deleteFavorite = business => {
		console.log('business:', business);
		return $http.delete(`/api/businesses/deleteFavorite/${business.yelpId}`)
			.then(res => {
				return $q.resolve(res.data);
			})
			.catch(err => {
				console.log('err:', err);
			});
	};


});
