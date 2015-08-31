// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('GraDomo', ['ionic', 'toastr'])
  .config(function (toastrConfig) {
    angular.extend(toastrConfig, {
      positionClass: 'toast-bottom-right'
    });
  })
  .run(function ($ionicPlatform) {
    $ionicPlatform.ready(function ($rootScope) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
      if (window.StatusBar) {
        StatusBar.styleDefault();
      }
      $ionicPlatform.ready(function () {
        document.addEventListener("deviceReady", function () {
          document.addEventListener("resume", function () {
            $rootScope.$broadcast('reloadSocket')
          }, false);
        });
      });
    });
  });
