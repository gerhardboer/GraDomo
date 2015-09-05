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
          url: buildUrl(response),
          date: getDateFromImage(response.data)
        }
      }

      function buildUrl(response) {
        return response.srcElement.url
            .replace('ws://', 'http://')
            .replace('5002', '5003') + response.data;
      }

      function getDateFromImage(image) {
        return image.substring(image.indexOf('-')+1, image.indexOf('.jpg'));
      }
    }

})(angular);
