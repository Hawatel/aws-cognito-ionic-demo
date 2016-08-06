# AWS Cognito Ionic Example

Demo application stores a list of tasks to do in AWS Cognito. Demo application was made by following technology stack: Ionic Framework 1, Angular 1, AWS SDK for JavaScript, HTML, CSS.

<p align="center">
<img src="https://s3-eu-west-1.amazonaws.com/hawatel-github/aws-cognito-ionic-demo/aws-cognito-ionic-banner.png">
</p>


## Installation
```
$ git clone https://github.com/Hawatel/aws-cognito-ionic-demo.git
$ npm install
$ sudo npm install -g cordova
$ sudo npm install -g ionic
$ ionic state restore
```

## Configuration
Add userPoolId, clientId, and identityId to the file: www/js/factories/awsCognitoIdentity.factory.js
```javascript
// how to get userPoolId, go to AWS Console -> Cognito -> User pools -> <select_user_pool> -> Pool details -> Pool Id
var userPoolId = '';
// how to get clientId, go to AWS Console -> Cognito -> User pools -> <select_user_pool> -> Apps -> App client id
var clientId = '';
// how to get identityPoolId, go to AWS Console -> Cognito -> Federate Identities > <select_federate_identity> -> Edit -> Identity pool ID
var identityPoolId = '';
```

## Build mobile package file
```
$ ionic build android
or
$ ionic build ios
```

## Development
```
$ ionic serve
```

## Contributing

See [CONTRIBUTING](CONTRIBUTING.md)


## License

The gem is available as open source under the terms of the [MIT License](http://opensource.org/licenses/MIT).
