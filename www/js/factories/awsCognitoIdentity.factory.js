var mod = angular.module('aws.cognito.identity', []);

mod.factory('awsCognitoIdentityFactory', function() {
  var aws = {};
  var cognitoUser = null; //CognitoUser object

  /* CUSTOM AWS COGNITO CONFIGURATION */
  // http://docs.aws.amazon.com/general/latest/gr/rande.html#cognito_identity_region
  var cognitoEndpoint = 'cognito-idp.us-east-1.amazonaws.com';
  var region = 'us-east-1';
  // how to get userPoolId, go to AWS Console -> Cognito -> User pools -> <select_user_pool> -> Pool details -> Pool Id
  var userPoolId = '';
  // how to get clientId, go to AWS Console -> Cognito -> User pools -> <select_user_pool> -> Apps -> App client id
  var clientId = '';
  // how to get identityPoolId, go to AWS Console -> Cognito -> Federate Identities > <select_federate_identity> -> Edit -> Identity pool ID
  var identityPoolId = '';
  /* *********************************** */

  AWS.config.region = region;
  AWS.config.credentials =
    new AWS.CognitoIdentityCredentials({ IdentityPoolId: identityPoolId });

  AWSCognito.config.region = region;
  AWSCognito.config.credentials =
    new AWS.CognitoIdentityCredentials({ IdentityPoolId: identityPoolId });
  AWSCognito.config.update({ accessKeyId: 'anything', secretAccessKey: 'anything' })

  var poolData = { UserPoolId: userPoolId, ClientId: clientId };
  var userPool =
    new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);

  /* Public methods */

  // Register a new user in Aws Cognito User pool
  aws.signUp = function(username, email, password, callback) {
    setupUser(username)

    var attributeList = [];
    var dataEmail = { Name: 'email', Value: email }
    var attributeEmail =
      new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(dataEmail);

    attributeList.push(attributeEmail);
    return userPool.signUp(username, password, attributeList, null, callback);
  }

  // Login user and setup a credential object
  aws.signIn = function(username, password, callback) {
    setupUser(username);

    var authenticationData = { Username: username, Password: password };
    var authenticationDetails =
      new AWSCognito.CognitoIdentityServiceProvider.AuthenticationDetails(authenticationData);

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function (result) {
        //console.log('access token + ' + result.getAccessToken().getJwtToken());
        initConfigCredentials(result.idToken.jwtToken);
        return AWS.config.credentials.get(callback);
      },
      onFailure: function(err) {
        return callback(err);
      },
    });
  }

  // Logout user and clear a cache id which causes problem like was described here: https://github.com/aws/aws-sdk-js/issues/609
  aws.signOut = function() {
    if(cognitoUser != null) cognitoUser.signOut();
    cognitoUser = null;
    AWS.config.credentials.clearCachedId();
    return true;
  }

  // This method is useful when user must have access to the app in offline mode.
  aws.getUserFromLocalStorage = function(callback) {
    cognitoUser = userPool.getCurrentUser();
    if (cognitoUser != null) {
      cognitoUser.getSession(function(err, session) {
        if (err) {
          callback(err);
          return false;
        }
        //console.log('session validity: ' + session.isValid());
        initConfigCredentials(session.idToken.jwtToken);
        return callback(null, session.isValid());
      });
    }
  }

  aws.getUserName = function() {
    if(cognitoUser) return cognitoUser.username
    else return false
  }

  aws.confirmAccount = function(username, code, callback) {
    setupUser(username)
    return cognitoUser.confirmRegistration(code, true, callback);
  }

  aws.resendCode = function(username, callback) {
    setupUser(username)
    return cognitoUser.resendConfirmationCode(callback);
  }

  /* Private methods */
  setupUser = function(username) {
    var userData = { Username : username, Pool : userPool };
    cognitoUser =
      new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);
  }

  initConfigCredentials = function(jwtToken) {
    var logins = {};
    logins[cognitoEndpoint + "/" + userPoolId] = jwtToken;

    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: identityPoolId,
      Logins: logins
    });
  }

  return aws;
});
