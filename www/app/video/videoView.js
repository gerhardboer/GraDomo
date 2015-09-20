(function (angular) {
    angular.module('GraDomo')
        .controller('videoView', ctrl);

    ctrl.$inject = ['$scope', 'videoService'];

    function ctrl($scope, videoService) {
        var vm = this;

        vm.streamUrl = '';
        vm.getStream = getStream;

        $scope.$on('video-update', handleVideoUpdate);
        $scope.$on('$ionicView.beforeEnter', beforeEnter);
        $scope.$on('$ionicView.beforeLeave', beforeLeave);

        function handleVideoUpdate(evt, data) {
            vm.streamUrl = data.streamUrl;
        }

        function init() {
            videoService.openSocket(onClose)
                .then(getStream);
        }

        function onClose(evt) {

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
