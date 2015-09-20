(function (angular) {
    angular.module('GraDomo')
        .service('pictureService', service);

    service.$inject = ['$q', 'piWebsocket', '$rootScope'];

    function service($q, piWebsocket, $rootScope) {

        this.openSocket = openSocket;
        this.closeSocket = closeSocket;
        this.getLatestPicture = getLatestPicture;

        var videoSocket;

        function openSocket(onClose) {
            var deferred = $q.defer();

            if (!videoSocket) {
                videoSocket = piWebsocket('video', responseHandler, deferred, onClose);
            } else {
                videoSocket.setHandler(responseHandler);
                deferred.resolve();
            }

            return deferred.promise;
        }

        function closeSocket() {
            if (videoSocket) {
                videoSocket.close();
                videoSocket = null;
            }
        }

        function responseHandler(evt) {
            if (evt.data) {
                var response = angular.fromJson(evt.data);
                $rootScope.$broadcast('picture-update', toViewData(response));
            }
        }

        function getLatestPicture() {
            if (videoSocket) {
                videoSocket.send("snapshot")
            }
        }

        function toViewData(response) {
            return {
                url: response.snapshot + addCacheBreaker()
            }
        }

        function addCacheBreaker() {
            return '&t=' + Date.now();
        }
    }

})(angular);
