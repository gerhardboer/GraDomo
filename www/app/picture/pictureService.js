(function (angular) {
    angular.module('GraDomo')
        .service('pictureService', service);

    service.$inject = ['$q', 'piWebsocket', '$rootScope', 'IMAGE_URL'];

    function service($q, piWebsocket, $rootScope, IMAGE_URL) {

      this.openSocket = openSocket;
      this.getNewPicture = getNewPicture;
      this.getLatestPicture = getLatestPicture;

      var pictureSocket;

      function openSocket() {
        var deferred = $q.defer();

        pictureSocket = piWebsocket('picture', responseHandler, deferred);

        return deferred.promise;
      }

      function responseHandler(evt) {
        if (evt.data) {
          $rootScope.$broadcast('picture-update', parseData(evt.data));
        }
      }

      function getNewPicture() {
        pictureSocket.send('getNewPicture')
      }

      function getLatestPicture() {
        pictureSocket.send("getLatestPicture")
      }

      function parseData(imageName) {
        return {
          url: IMAGE_URL + imageName,
          date: getDateFromImage(imageName)
        }
      }

      function getDateFromImage(image) {
        return image.substring(image.indexOf('-')+1, image.indexOf('.jpg'));
      }
    }

})(angular);
