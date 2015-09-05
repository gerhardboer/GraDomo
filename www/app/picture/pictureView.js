(function (angular) {
  angular.module('GraDomo')
    .controller('pictureView', ctrl);

  ctrl.$inject = ['$scope', 'pictureService', 'piToastr'];

  function ctrl($scope, pictureService, piToastr) {
    var vm = this;

    vm.history = [];
    vm.latestImage = null;

    vm.getNewPicture = getNewPicture;

    $scope.$on('camera-websocketOpened', websocketOpened);
    $scope.$on('camera-websocketClosed', websocketClosed);
    $scope.$on('camera-websocketError', websocketError);

    (function init() {
      getLatestPicture();
    })();

    function getLatestPicture() {
      pictureService.getLatestPicture()
        .then(showPicture);

      piToastr('info', 'retrieving latest picture')
    }

    function getNewPicture() {
      vm.history.push(angular.copy(vm.latestImage));
      vm.latestImage = null;

      pictureService.getNewPicture()
        .then(showPicture);

      piToastr('info', 'retrieving new picture')
    }

    function showPicture(picture) {
      vm.latestImage = picture;

      piToastr('success', 'Image loaded');
    }

    function websocketOpened(evt, socketEvt) {
      console.log(evt);

      piToastr('info', socketEvt.srcElement.url + ' connected');
    }

    function websocketClosed() {
      piToastr('info', 'Camera socket closed');
    }

    function websocketError(evt) {
      piToastr('error', 'Camera socket error');
    }

  }
})(angular);
