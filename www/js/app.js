var app = angular.module('starter',
  ['ionic', 'starter.login', 'starter.register', 'starter.confirmation', 'starter.todo']);

app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});

app.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('login', {
      cache: false,
      url: '/login',
      views: {
        'main': {
          templateUrl: 'js/components/Login/login.view.html',
          controller: 'LoginCtrl'
        }
      }
    })
    .state('register', {
      cache: false,
      url: '/register',
      views: {
        'main': {
          templateUrl: 'js/components/Register/register.view.html',
          controller: 'RegisterCtrl'
        }
      }
    })
    .state('confirm', {
      cache: false,
      url: '/confirm',
      views: {
        'main': {
          templateUrl: 'js/components/Confirmation/confirmation.view.html',
          controller: 'ConfirmationCtrl'
        }
      }
    })
    .state('todo', {
      cache: false,
      url: '/todo',
      views: {
        'main': {
          templateUrl: 'js/components/Todo/todo.view.html',
          controller: 'TodoCtrl'
        }
      }
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');
});
