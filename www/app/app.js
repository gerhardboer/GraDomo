// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
(function () {
    var wifiInfo;
    angular.module('GraDomo', ['ionic', 'toastr'])
        .config(function (toastrConfig, $stateProvider, $urlRouterProvider, $ionicConfigProvider) {
            configToastr(toastrConfig);
            configNavigation($stateProvider, $urlRouterProvider);
            configIonic($ionicConfigProvider);
        })
        .run(function ($ionicPlatform, urlService) {
            $ionicPlatform.ready(function () {
                // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                // for form inputs)
                if (window.cordova && window.cordova.plugins.Keyboard) {
                    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                }
                if (window.StatusBar) {
                    StatusBar.styleDefault();
                }

                console.log('window.plugins ', window.plugins);

                if(window.plugins && window.plugins.WifiAdmin) {
                    console.log('getting info');

                    window.plugins.WifiAdmin.getWifiInfo(wifiInfoSuccess, wifiInfoFailed);
                } else {
                    urlService.storeWifiInfo({SSID: ''});
                }

                function wifiInfoSuccess(data) {
                    console.log('wifiInfo success');
                    urlService.storeWifiInfo(data);
                }

                function wifiInfoFailed() {

                }

            });
        });

    function configToastr(toastrConfig) {
        angular.extend(toastrConfig, {
            positionClass: 'toast-top-left',
            maxOpened: 2,
            newestOnTop: false,
            preventOpenDuplicates: true
        });
    }

    function configNavigation($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('video', {
                url: "/video",
                views: {
                    'video-tab': {
                        templateUrl: "app/video/videoView.html"
                    }
                }
            })
            .state('schrodinger', {
                url: "/schrodinger",
                views: {
                    'schrodinger-tab': {
                        templateUrl: "app/schrodinger/schrodingerView.html"
                    }
                }
            });


        $urlRouterProvider.otherwise('/');
    }

    function configIonic($ionicConfigProvider) {
        $ionicConfigProvider.tabs.style('stable');
        $ionicConfigProvider.tabs.position('bottom');
    }

})(angular);
