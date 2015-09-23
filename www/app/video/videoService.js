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
            return piWebsocket('video', responseHandler, onClose)
                .then(function (socket) {
                    videoSocket = socket;
                });

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
                streamUrl: urlService.host('stream') + result.streamUrl
            };
        }
    }

})(angular);
