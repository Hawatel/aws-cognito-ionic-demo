/* Simple factory for Cognito Sync Manager.
 * This factory should be extendend by offline access to a dataset.
 * In this demo app I focused on AWS Cognito User Pools functionality.
*/
var mod = angular.module('aws.cognito.sync', []);

mod.factory('awsCognitoSyncFactory', function() {
  var aws = {};

  /* Public methods */

  /* This method works if user has logged by method:
   * awsCognitoIdentityFactory.getUserFromLocalStorage or awsCognitoIdentityFactory.signIn
   * and network connection is available
   *
   * dataset object is returned to you application and you can invoke method on dataset object such as:
   * put, get, remove, getAllRecords, ...
   * all methods are in a source file: https://github.com/aws/amazon-cognito-js/blob/master/src/CognitoSyncDataset.js
   */
  aws.connect = function(datasetName, callback) {
     AWS.config.credentials.get(function(err, data) {
       if(err) {
         callback(err)
         return false;
       }
      client = new AWS.CognitoSyncManager();
      client.openOrCreateDataset(datasetName, function(err, retDataset) {
        if(err) {
          callback(err);
          return false;
        }

        callback(null, retDataset);
      });
    });
  }

  aws.synchronize = function(dataset, userCallback) {
    return dataset.synchronize({
      onSuccess: function(dataset, newRecords) {
         return userCallback(null, 'success');
      },
      onFailure: function(err) {
         return userCallback(err);
      },
      onConflict: function(dataset, conflicts, callback) {
         var resolved = [];
         for (var i=0; i<conflicts.length; i++) {
            // Take remote version.
            resolved.push(conflicts[i].resolveWithRemoteRecord());
            // Or... take local version.
            // resolved.push(conflicts[i].resolveWithLocalRecord());

            // Or... use custom logic.
            // var newValue = conflicts[i].getRemoteRecord().getValue() + conflicts[i].getLocalRecord().getValue();
            // resolved.push(conflicts[i].resolveWithValue(newValue);
         }
         dataset.resolve(resolved, function() {
            return callback(true);
         });
         // Or... callback false to stop the synchronization process.
         // return callback(false);
      },

      onDatasetDeleted: function(dataset, datasetName, callback) {
         // Return true to delete the local copy of the dataset.
         // Return false to handle deleted datasets outsid ethe synchronization callback.
         callback(true);
      },
      onDatasetMerged: function(dataset, datasetNames, callback) {
         // Return true to continue the synchronization process.
         // Return false to handle dataset merges outside the synchroniziation callback.
         callback(false);
      }
    });
  }

  return aws;
});
