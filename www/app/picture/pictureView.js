(function (angular) {
  angular.module('GraDomo')
    .controller('pictureView', ctrl);

  ctrl.$inject = ['pictureService'];

  function ctrl(pictureService) {
    var vm = this;

    vm.latestImage = null;

    (function init() {
      vm.latestImage = null;
      pictureService.getLatestPicture()
        .then(showPicture);
    })();

    function showPicture(picture) {
      vm.latestImage = picture;
    }
  }
})(angular);
