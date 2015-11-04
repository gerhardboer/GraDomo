(function (angular) {
    angular.module('GraDomo')
        .controller('videoView', ctrl);

    ctrl.$inject = ['$timeout', '$scope', 'videoService'];

    function ctrl($timeout, $scope, videoService) {
        var vm = this;

        vm.streamUrl = '';
        vm.getStream = getStream;
        vm.isAndroid = ionic.Platform.isAndroid();

        vm.videoState = 'started';

        $scope.$on('video-paused', handleVideoPaused);
        $scope.$on('video-started', handleVideoStarted);

        $scope.$on('video-update', handleVideoUpdate);
        $scope.$on('$ionicView.afterEnter', beforeEnter);
        //$scope.$on('$ionicView.beforeLeave', beforeLeave);

        function handleVideoUpdate(evt, data) {
            vm.stream = {url: data.url};
        }

        function init() {
            videoService.openSocket(onClose)
                .then(getStream);
        }

        function onClose(evt) {

        }

        function handleVideoPaused() {
            $timeout(function() {
                vm.videoState = 'paused';
            }, 0);
        }

        function handleVideoStarted() {
            $timeout(function() {
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
