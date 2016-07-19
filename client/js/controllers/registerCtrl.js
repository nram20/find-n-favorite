angular.module('myApp').controller('registerCtrl', function($scope, $state, $auth) {
	console.log('registerCtrl!');

	$scope.register = () => {
		if ($scope.user.password !== $scope.user.password2) {
			$scope.user.password = null;
			$scope.user.password2 = null;
			alert('Passwords must match.  Try again.');
		} else {

			$auth.signup($scope.user)
				.then(res => {
					console.log('res:', res);
					$state.go('login');
				})
				.catch(err => {
					console.log('err:', err);
				});
		}
	};

})
