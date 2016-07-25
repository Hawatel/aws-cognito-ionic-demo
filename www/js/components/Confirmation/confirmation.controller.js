var mod = angular.module('starter.confirmation', ['aws.cognito.identity', 'ngMessages']);

mod.controller('ConfirmationCtrl', ['$scope', 'awsCognitoIdentityFactory', '$state', '$ionicLoading',
  function($scope, awsCognitoIdentityFactory, $state, $ionicLoading) {
    $scope.user = {};

    $scope.error = { message: null };

    $scope.verifyCode = function() {
      $ionicLoading.show({template: 'Verification...'});
      awsCognitoIdentityFactory.confirmAccount($scope.user.name, $scope.user.code, function(err, result) {
        if(err) {
          errorHandler(err)
          return false;
        }
        $ionicLoading.hide();
        $state.go('login');
      });
    }

    $scope.resendCode = function() {
      $ionicLoading.show({template: 'Sending...'});
      awsCognitoIdentityFactory.resendCode($scope.user.name, function(err, result) {
        if (err) {
            errorHandler(err)
            $ionicLoading.hide();
            return false;
        }
        console.log('call result: ' + result);
        $ionicLoading.hide();
        return true;
      });
    }

    $scope.setUserNameIfExists = function() {
      var username = awsCognitoIdentityFactory.getUserName();
      if(username) {
        $scope.user.exists = true;
        $scope.user.name = username;
      }
    }

    errorHandler = function(err) {
      console.log(err);
      $scope.error.message = err.message;
      $scope.$apply();
      $ionicLoading.hide();
    }
}]);
