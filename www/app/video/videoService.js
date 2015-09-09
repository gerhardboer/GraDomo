(function (angular) {
    angular.module('GraDomo')
        .service('videoService', service);

    service.$inject = ['piWebsocket'];

    function service(piWebsocket) {

      this.getVideoStream = getVideoStream;

      function getVideoStream() {
        return piWebsocket.video.send('getVideoStream')
          .then(parseData);
      }

      function parseData(result) {
        return result
      }
    }

})(angular);
