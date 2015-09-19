(function (angular) {
    angular.module('GraDomo')
        .service('pictureService', service);

    service.$inject = ['$q', 'piWebsocket', '$rootScope', 'IMAGE_URL'];

    function service($q, piWebsocket, $rootScope, IMAGE_URL) {

        this.openSocket = openSocket;
        this.getNewPicture = getNewPicture;
        this.getLatestPicture = getLatestPicture;

        var pictureSocket;

        function openSocket(onClose) {
            var deferred = $q.defer();

            pictureSocket = piWebsocket('picture', responseHandler, deferred, onClose);

            return deferred.promise;
        }

        function responseHandler(evt) {
            if (evt.data) {
                var response = angular.fromJson(evt.data);
                $rootScope.$broadcast('picture-update', toPictureDAO(response));
            }
        }

        function getNewPicture() {
            if (pictureSocket) {
                pictureSocket.send('getNewPicture')
            }
        }

        function getLatestPicture() {
            if (pictureSocket) {
                pictureSocket.send("getLatestPicture")
            }
        }

        function toPictureDAO(response) {
            return {
                url: IMAGE_URL + response.file + '?' + Date.now(),
                date: response.date
            }
        }
    }

})(angular);
