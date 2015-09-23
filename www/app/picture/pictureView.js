(function (angular) {
    angular.module('GraDomo')
        .controller('pictureView', ctrl);

    ctrl.$inject = ['$scope', '$timeout', 'pictureService', 'piToastr'];

    function ctrl($scope, $timeout, pictureService, piToastr) {
        var vm = this;

        vm.history = [];
        vm.latestImage = null;
        vm.serverInfo = {};

        vm.init = init;
        vm.refresh = refresh;

        $scope.$on('$ionicView.afterEnter', beforeEnter);
        //$scope.$on('$ionicView.beforeLeave', beforeLeave);
        $scope.$on('picture-update', updateView);

        function init() {
            pictureService.openSocket(onClose)
                .then(getLatestPicture)
                .catch(showSocketError);

            piToastr('info', 'Opening ' + pictureService.host())
        }

        function beforeEnter() {
            piToastr('info', 'picture - $ionicView.beforeEnter');
            init();
        }

        function beforeLeave() {
            piToastr('info', 'picture - $ionicView.beforeLeave');

            pictureService.closeSocket();
        }

        function onClose(evt) {
            piToastr('info', evt.reason)
        }

        function showSocketError(error) {
            piToastr('warning', error.reason);
        }

        function getLatestPicture() {
            pictureService.latestPicture();

            piToastr('info', 'Requesting latest picture')
        }

        function updateView(evt, viewData) {
            vm.latestImage = null;

            //allow the angular cycle one tick
            $timeout(function () {
                vm.latestImage = viewData;
            }, 150);

            piToastr('success', 'Image loaded');
        }

        function refresh() {
            pictureService.latestPicture();

            piToastr('info', 'Refreshing picture')
        }

    }
})(angular);
