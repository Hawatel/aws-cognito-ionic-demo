var mod = angular.module('starter.login', ['aws.cognito.identity']);

mod.controller('LoginCtrl', ['$scope', 'awsCognitoIdentityFactory', '$state', '$ionicLoading',
  function($scope, awsCognitoIdentityFactory, $state, $ionicLoading) {
    $scope.user = { email: null, password: null };
    $scope.error = { message: null };

    $scope.getUserFromLocalStorage = function() {
      awsCognitoIdentityFactory.getUserFromLocalStorage(function(err, isValid) {
        if(err) {
          $scope.error.message = err.message;
          return false;
        }
        if(isValid) $state.go('todo', {}, {reoload: true})
      });
    }

    $scope.signIn = function(login) {
      $ionicLoading.show({template: 'Loading...'});
      awsCognitoIdentityFactory.signIn($scope.user.email, $scope.user.password, function(err) {
        if(err) {
          console.log(err);
          if (err.message === 'Incorrect username or password.') {
            // https://github.com/aws/amazon-cognito-identity-js/issues/42
            $scope.error.message = err.message + ' Have you verified ' + $scope.user.email + ' account?'
          }
          else {
            $scope.error.message = err.message;
          }
          $ionicLoading.hide();
          $scope.$apply();
          return false;
        }

        $ionicLoading.hide();
        clearForm(login)
        $state.go('todo', {}, {reoload: true});
      })
    }

    $scope.userLogged = function() {
      if(awsCognitoIdentityFactory.ifUserLogged) {
        $state.go('todo', {}, {reload: true});
      }
    }

    var clearForm = function(login) {
      $scope.user = { email: '', password: '' }
      login.$setUntouched();
    }
}]);
