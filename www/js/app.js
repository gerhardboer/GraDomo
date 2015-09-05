// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('GraDomo', ['ionic', 'toastr'])
  .config(function (toastrConfig, $stateProvider, $urlRouterProvider) {
    angular.extend(toastrConfig, {
      positionClass: 'toast-bottom-right'
    });

    $stateProvider.
      state('light', {
        url: '/',
        templateUrl: 'js/light/lightView.html'
      })
      .state('picture', {
        url: '/picture',
        templateUrl: 'js/picture/pictureView.html'
      })
      .state('video', {
        url: '/video',
        templateUrl: 'js/video/videoView.html'
      });

    $urlRouterProvider.otherwise('/');
  })
  .run(function ($ionicPlatform, $rootScope) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
      if (window.StatusBar) {
        StatusBar.styleDefault();
      }

      document.addEventListener("resume", function () {
        $rootScope.$broadcast('reloadSocket');
      }, false);
    });
  });
