(function (angular) {
    angular.module('GraDomo')
        .service('pictureService', service);

    service.$inject = ['piWebsocket', '$rootScope', 'urlService'];

    function service(piWebsocket, $rootScope, urlService) {

        this.streamHost = streamHost;
        this.videoSocketHost = videoSocketHost;
        this.latestPicture = latestPicture;

        this.openSocket = openSocket;
        this.closeSocket = closeSocket;

        var videoSocket;

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

        function videoSocketHost() {
            return urlService.host('video')
        }

        function responseHandler(evt) {
            if (evt.data) {
                var response = angular.fromJson(evt.data);
                $rootScope.$broadcast('picture-update', toViewData(response));
            }

        }

        function latestPicture() {
            if (videoSocket) {
                videoSocket.send("snapshot")
            }
        }

        function streamHost() {
            return urlService.host('stream')
        }

        function toViewData(response) {
            return {
                url: streamHost() + response.snapshot + cacheBreaker()
            }
        }

        function cacheBreaker() {
            return '&t=' + Date.now();
        }
    }

})(angular);
