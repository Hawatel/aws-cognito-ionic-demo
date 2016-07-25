var mod = angular.module('starter.register', ['aws.cognito.identity', 'ngMessages']);

mod.controller('RegisterCtrl', ['$scope', 'awsCognitoIdentityFactory', '$state', '$ionicLoading',
  function($scope, awsCognitoIdentityFactory, $state, $ionicLoading) {
    $scope.user = {};

    $scope.error = {
      message: null
    };

    $scope.register = function() {
      $ionicLoading.show({template: 'Loading...'});
      awsCognitoIdentityFactory.signUp($scope.user.email, $scope.user.email, $scope.user.password,
        function(err, result) {
          if(err) {
            errorHandler(err);
            return false;
          }

          $ionicLoading.hide();
          $scope.$apply();

          $scope.user = {}; //clear register form
          $state.go('confirm');
        });
      return true;
    }

    errorHandler = function(err) {
      console.log(err);
      $scope.error.message = err.message;
      $scope.$apply();
      $ionicLoading.hide();
    }
}]);
