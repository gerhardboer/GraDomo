(function (angular) {
  angular.module('GraDomo')
    .controller('pictureView', ctrl);

  ctrl.$inject = ['$scope', 'pictureService'];

  function ctrl($scope, pictureService) {
    var vm = this;

    vm.latestImage = null;

    $scope.$on('camera-websocketOpened', websocketOpened);

    function websocketOpened() {
      getLatestPicture();
    }

    function getLatestPicture() {
      vm.latestImage = null;
      pictureService.getLatestPicture()
        .then(showPicture);
    }

    function showPicture(picture) {
      vm.latestImage = picture;
    }
  }
})(angular);
