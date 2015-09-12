(function (angular) {
    angular.module('GraDomo')
        .controller('pictureView', ctrl);

    ctrl.$inject = ['$scope', '$timeout', 'pictureService', 'piToastr'];

    function ctrl($scope, $timeout, pictureService, piToastr) {
        var vm = this;

        vm.history = [];
        vm.latestImage = null;

        vm.getNewPicture = getNewPicture;

        $scope.$on('picture-update', showPicture);

        (function init() {
            pictureService.openSocket(onClose)
                .then(getLatestPicture)
                .catch(showSocketError);

            piToastr('info', 'Opening socket')
        })();

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

        function showPicture(evt, picture) {
            vm.latestImage = null;

            //allow the angular cycle one tick
            $timeout(function () {
                vm.latestImage = picture;
            }, 0);

            piToastr('success', 'Image loaded');
        }

    }
})(angular);
