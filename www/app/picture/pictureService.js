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
          var response = angular.fromJson(evt.data);
          $rootScope.$broadcast('picture-update', parseData(response));
        }
      }

      function getNewPicture() {
        pictureSocket.send('getNewPicture')
      }

      function getLatestPicture() {
        pictureSocket.send("getLatestPicture")
      }

      function parseData(response) {
        return {
          url: IMAGE_URL + response.file + '?' + Date.now(),
          date: response.date
        }
      }
    }

})(angular);
