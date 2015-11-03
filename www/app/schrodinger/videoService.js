(function (angular) {
    angular.module('GraDomo')
        .service('videoService', service);

    service.$inject = ['$rootScope', 'piWebsocket', 'urlService'];

    function service($rootScope, piWebsocket, urlService) {

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
                $rootScope.$broadcast('video-update', toViewData(response));
            }
        }

        function getVideoStream() {
            videoSocket.send('snapshot');
        }

        function toViewData(response) {
            return {
                url: urlService.host('stream') + response.snapshot + cacheBreaker()
            }
        }

        function cacheBreaker() {
            return '&t=' + Date.now();
        }

        function parseData(result) {
            return {
                message: result.message,
                streamUrl: urlService.host('stream') + result.streamUrl
            };
        }
    }

})(angular);
