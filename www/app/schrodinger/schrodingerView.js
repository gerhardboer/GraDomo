(function (angular) {
    angular.module('GraDomo')
        .controller('SchrodingerView', ctrl);

    ctrl.$inject = ['$timeout', '$scope', 'videoService', 'lightService'];

    function ctrl($timeout, $scope, videoService, lightService) {
        var vm = this;

        vm.streamUrl = '';
        vm.getStream = getStream;
        vm.isAndroid = ionic.Platform.isAndroid();

        vm.videoState = 'started';

        vm.device = {
            "id": [{"id": 15, "unit": 12}],
            "state": "on"
        };

        vm.history = {
            alive: 0,
            dead: 0,
            wood: 0
        };

        vm.stream = {};

        vm.toggleLight = function (type) {
            lightService.sendOn(vm.device.id);
            vm.history[type]++;
        };

        $scope.$on('video-paused', handleVideoPaused);
        $scope.$on('video-started', handleVideoStarted);

        $scope.$on('video-update', handleVideoUpdate);
        $scope.$on('$ionicView.afterEnter', beforeEnter);
        //$scope.$on('$ionicView.beforeLeave', beforeLeave);

        function handleVideoUpdate(evt, data) {
            if (vm.stream.url !== data.url) {
                vm.stream = {url: data.url};
            }
        }

        function init() {
            videoService.openSocket(onClose)
                .then(getStream);

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
            videoService.getVideoStream()
        }

    }
})(angular);
