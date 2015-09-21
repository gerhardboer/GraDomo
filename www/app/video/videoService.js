(function (angular) {
    angular.module('GraDomo')
        .service('videoService', service);

    service.$inject = ['$q', '$rootScope', 'piWebsocket', 'urlService'];

    function service($q, $rootScope, piWebsocket, urlService) {

        var videoSocket;

        this.openSocket = openSocket;
        this.closeSocket = closeSocket;
        this.getVideoStream = getVideoStream;

        function openSocket(onClose) {
            var deferred = $q.defer();

            if (!videoSocket) {
                videoSocket = piWebsocket('video', responseHandler, deferred, onClose);
            } else {
                videoSocket.setHandler(responseHandler);
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
                $rootScope.$broadcast('video-update', parseData(response));
            }
        }

        function getVideoStream() {
            videoSocket.send('start');
        }

        function parseData(result) {
            return {
                message: result.message,
                streamUrl: urlService.getHost('stream') + result.streamUrl
            };
        }
    }

})(angular);
