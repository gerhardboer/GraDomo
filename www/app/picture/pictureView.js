(function (angular) {
  angular.module('GraDomo')
    .controller('pictureView', ctrl);

  ctrl.$inject = ['$scope', 'pictureService', 'piToastr'];

  function ctrl($scope, pictureService, piToastr) {
    var vm = this;

    vm.history = [];
    vm.latestImage = null;

    vm.getNewPicture = getNewPicture;

    $scope.$on('picture-update', showPicture);

    (function init() {
      pictureService.openSocket()
        .then(getLatestPicture);

      piToastr('info', 'Opening socket')
    })();

    function getLatestPicture() {
      pictureService.getLatestPicture();

      piToastr('info', 'Retrieving latest picture')
    }

    function getNewPicture() {
      vm.history.push(angular.copy(vm.latestImage));
      vm.latestImage = null;

      pictureService.getNewPicture();

      piToastr('info', 'Retrieving new picture')
    }

    function showPicture(evt, picture) {
      vm.latestImage = picture;

      piToastr('success', 'Image loaded');
    }

  }
})(angular);
