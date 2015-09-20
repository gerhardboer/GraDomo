(function (angular) {
    angular.module('GraDomo')
        .service('pictureService', service);

    service.$inject = ['$q', 'piWebsocket', '$rootScope', 'IMAGE_URL'];

    function service($q, piWebsocket, $rootScope, IMAGE_URL) {

        this.openSocket = openSocket;
        this.closeSocket = closeSocket;
        this.getNewPicture = getNewPicture;
        this.getLatestPicture = getLatestPicture;

        var pictureSocket;

        function openSocket(onClose) {
            var deferred = $q.defer();

            pictureSocket = piWebsocket('picture', responseHandler, deferred, onClose);

            return deferred.promise;
        }

        function closeSocket() {
            if (pictureSocket) {
                pictureSocket.close();
            }
        }

        function responseHandler(evt) {
            if (evt.data) {
                var response = angular.fromJson(evt.data);
                $rootScope.$broadcast('picture-update', toViewData(response));
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

        function toViewData(response) {
            return {
                picture: {
                    url: IMAGE_URL + response.file + '?' + Date.now(),
                    date: response.date
                },
                serverInfo: response.serverInfo
            }
        }
    }

})(angular);
