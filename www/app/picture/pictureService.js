(function (angular) {
    angular.module('GraDomo')
        .service('pictureService', service);

    service.$inject = ['$q', 'piWebsocket'];

    function service($q, piWebsocket) {

      this.getLatestPicture = getLatestPicture;

      function getLatestPicture() {
        return piWebsocket.cameraSocket.send('camera', "getLatestPicture")
          .then(parseData);
      }

      function parseData(response) {
        return {
          url: response.data,
          date: 'now'
        }
      }
    }

})(angular);
