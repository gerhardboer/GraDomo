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
        vm.getNewPicture = getNewPicture;

        $scope.$on('$ionicView.beforeEnter', beforeEnter);
        $scope.$on('$ionicView.beforeLeave', beforeLeave);
        $scope.$on('picture-update', updateView);

        function init() {
            pictureService.openSocket(onClose)
                .then(getLatestPicture)
                .catch(showSocketError);

            piToastr('info', 'Opening picture socket')
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
            pictureService.getLatestPicture();

            piToastr('info', 'Retrieving latest picture')
        }

        function getNewPicture() {
            vm.history.push(angular.copy(vm.latestImage));

            pictureService.getNewPicture();

            piToastr('info', 'Retrieving new picture')
        }

        function updateView(evt, viewData) {
            vm.latestImage = null;

            //allow the angular cycle one tick
            $timeout(function () {
                vm.latestImage = viewData.picture;
                vm.serverInfo = viewData.serverInfo;
            }, 0);

            piToastr('success', 'Image loaded');
        }

    }
})(angular);
