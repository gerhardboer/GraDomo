(function (angular) {
    angular.module('GraDomo')
        .service('pictureService', service);

    service.$inject = ['$q', 'piWebsocket'];

    function service($q, piWebsocket) {

      this.getNewPicture = getNewPicture;
      this.getLatestPicture = getLatestPicture;

      function getNewPicture() {
        return piWebsocket.cameraSocket.send('camera', 'getNewPicture')
          .then(parseData);
      }

      function getLatestPicture() {
        return piWebsocket.cameraSocket.send('camera', "getLatestPicture")
          .then(parseData);
      }

      function parseData(response) {
        return {
          url: response.data,
          date: Date.now()
        }
      }
    }

})(angular);
