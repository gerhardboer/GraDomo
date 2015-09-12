// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
(function () {
  var host = getHostBasedOnPlatform();


  angular.module('GraDomo', ['ionic', 'toastr'])
    .value('LIGHT_URL', 'ws://' + host + ':' + 5001 + '/websocket')
    .value('CAMERA_URL', 'ws://' + host + ':' +5002 + '/')
    .value('VIDEO_URL', 'ws://' + host + ':' + 5004 + '/')
    .value('IMAGE_URL', 'http://' + host + ':' +5003 + '/')
    .config(function (toastrConfig, $stateProvider, $urlRouterProvider) {
      angular.extend(toastrConfig, {
        positionClass: 'toast-top-right'
      });

      $stateProvider.
        state('light', {
          url: '/',
          templateUrl: 'app/light/LightView.html'
        })
        .state('picture', {
          url: '/picture',
          templateUrl: 'app/picture/pictureView.html'
        })
        .state('video', {
          url: '/video',
          templateUrl: 'app/video/videoView.html'
        });

      $urlRouterProvider.otherwise('/');
    })
    .run(function ($ionicPlatform, $rootScope, piWebsocket, piToastr) {
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
            //piWebsocket('close');
            //piToastr('info', 'Sockets closed')
        }, false);
      });
    });
  function getHostBasedOnPlatform() {
    var host = '192.168.0.18';
    //if (ionic.Platform.isAndroid() && !isOnHomeWifi()) {
    //  host = 'localhost';
    //}

    return host;
  }

  function isOnHomeWifi() {
    return window.Connection &&
        navigator.connection.type === Connection.WIFI
  }
})(angular);
