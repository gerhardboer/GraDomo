(function (angular) {
  angular.module('GraDomo')
    .controller('videoView', ctrl);

  ctrl.$inject = ['videoService'];

  function ctrl(videoService) {
    var vm = this;

    vm.streamUrl = '';
    vm.getStream = getStream;

    function getStream() {
      videoService.getStream()
        .then(showStream);
    }

    function showStream(streamUrl) {
      vm.streamUrl = streamUrl;
    }

  }
})(angular);
