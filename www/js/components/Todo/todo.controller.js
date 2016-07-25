var mod = angular.module('starter.todo', ['aws.cognito.identity', 'aws.cognito.sync', 'ngAnimate']);

mod.controller('TodoCtrl', ['$scope', 'awsCognitoSyncFactory', 'awsCognitoIdentityFactory',
                            '$ionicHistory', '$state', '$ionicLoading',
  function($scope, awsCognitoSyncFactory, awsCognitoIdentityFactory, $ionicHistory, $state, $ionicLoading) {
    $scope.error = { message: null };
    $scope.task = {}; // new task to put to the dataset
    $scope.tasks = {}; // list of tasks
    $scope.dataset = null; // Cognito Sync dataset object

    $scope.connect = function(datasetName) {
      awsCognitoIdentityFactory.getUserFromLocalStorage(function(err, isValid) {
        if(!err && isValid) {
          awsCognitoSyncFactory.connect(datasetName, function(err, dataset) {
            if(err) $scope.error.message = err.message;
            else {
              $scope.dataset = dataset;
              refreshTasksList();
              $scope.sync();
            }
          });
        }
        else {
          $state.go('login', {}, {reoload: true})
        }
      });
    }

    $scope.put = function() {
      var task_id = generateTaskId();
      $scope.dataset.put(task_id, JSON.stringify($scope.task), function(err, record) {
        if(err) {
          $scope.error.message = err.message;
          return false;
        }
        $scope.tasks[task_id] = $scope.task;

        $scope.task = {};
        $scope.sync();
      });
    }

    $scope.delete = function(task_id) {
      $scope.dataset.remove(task_id, function(err, record) {
        if(err) {
          $scope.error.message = err.message;
          return false;
        }
        delete($scope.tasks[task_id]);
        $scope.sync();
      });
    }

    $scope.sync = function() {
      return awsCognitoSyncFactory.synchronize($scope.dataset, function(err, state) {
        if(err) {
          $scope.error.message = err.message;
          return false;
        }
        refreshTasksList();
        $scope.$apply();
      });
    }

    $scope.logOut = function() {
      if(awsCognitoIdentityFactory.signOut()) {
        $ionicHistory.clearHistory();
        $ionicHistory.clearCache();
        $state.go('login');
      }
    }

    generateTaskId = function() {
      // https://gist.github.com/gordonbrander/2230317
      var uniq_id = Math.random().toString(36).substr(2, 9);
      var milliseconds = new Date().getTime().toString();
      return milliseconds + "_" + uniq_id;
    }

    refreshTasksList = function() {
      $scope.dataset.getAllRecords(function(err, records) {
        $scope.tasks = {};
        for (i = 0; i < records.length; i++) {
          if(records[i].value.length > 0) $scope.tasks[records[i].key] = JSON.parse(records[i].value);
        }
      });
      $scope.$apply();
    }

}]);

// task id format: <timestamp_in_miliseconds>_<random_generated_string>
// eg. 1469370826084_y3dxkhmqn
mod.filter('taskTimestamp', function() {
  return function(id) {
    if(id === null) return;
    milliseconds = id.substring(0, id.indexOf('_'));
    return new Date(parseInt(milliseconds));
  }
});
