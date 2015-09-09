(function (angular) {
    angular.module('GraDomo')
        .service('pictureService', service);

    service.$inject = ['piWebsocket', 'IMAGE_URL'];

    function service(piWebsocket, IMAGE_URL) {

      this.getNewPicture = getNewPicture;
      this.getLatestPicture = getLatestPicture;

      this.socket = initSocket();

      function initSocket() {
        return piWebsocket('picture', responseHandler);
      }

      function responseHandler(evt) {
        if (evt.data) {
          $rootScope.$broadcast('picture-update', parseData(evt.data));
        }
      }

      function getNewPicture() {
        socket.send('camera', 'getNewPicture')
      }

      function getLatestPicture() {
        socket.send('camera', "getLatestPicture")
      }

      function parseData(response) {
        return {
          url: IMAGE_URL + response.data,
          date: getDateFromImage(response.data)
        }
      }

      function getDateFromImage(image) {
        return image.substring(image.indexOf('-')+1, image.indexOf('.jpg'));
      }
    }

})(angular);
