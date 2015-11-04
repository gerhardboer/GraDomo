(function (angular) {
    angular.module('GraDomo')
        .controller('SchrodingerView', ctrl);

    ctrl.$inject = ['$timeout', '$scope', 'pictureService', 'lightService'];

    function ctrl($timeout, $scope, pictureService, lightService) {
        var vm = this;

        vm.streamUrl = '';
        vm.getStream = getStream;
        vm.isAndroid = ionic.Platform.isAndroid();

        vm.videoState = 'started';

        vm.device = {
            "id": 'desk',
            "state": "on"
        };

        vm.history = {
            alive: 0,
            dead: 0,
            wood: 0
        };

        vm.stream = {};

        vm.toggleLight = function (type) {
            vm.history[type]++;

            getStream();
            lightService.sendOn(vm.device.id);

            $timeout(function() {
                lightService.sendOff(vm.device.id);
                vm.stream = {};
            }, 2000);
        };

        $scope.$on('video-paused', handleVideoPaused);
        $scope.$on('video-started', handleVideoStarted);

        $scope.$on('picture-update', handleVideoUpdate);
        $scope.$on('$ionicView.afterEnter', beforeEnter);
        //$scope.$on('$ionicView.beforeLeave', beforeLeave);

        function handleVideoUpdate(evt, data) {
            if (vm.stream.url !== data.url) {
                $timeout(function() {
                    vm.stream = {url: data.url};
                }, 100)
            }
        }

        function init() {
            pictureService.openSocket(onClose)
                //.then(getStream);

            lightService.openSocket(onClose)
        }

        function onClose(evt) {

        }

        function handleVideoPaused() {
            $timeout(function () {
                vm.videoState = 'paused';
            }, 0);
        }

        function handleVideoStarted() {
            $timeout(function () {
                vm.videoState = 'started';
            }, 0);
        }

        function beforeEnter() {
            init();
        }

        function beforeLeave() {
            videoService.closeSocket();
        }

        function getStream() {
            pictureService.latestPicture()
        }

    }
})(angular);
