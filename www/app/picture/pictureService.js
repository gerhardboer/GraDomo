(function (angular) {
    angular.module('GraDomo')
        .service('pictureService', service);

    service.$inject = ['$q', 'piWebsocket', '$rootScope', 'urlService'];

    function service($q, piWebsocket, $rootScope, urlService) {

        this.host = host;
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

        function host() {
            return urlService.host('stream')
        }

        function toViewData(response) {
            return {
                url: host() + response.snapshot + cacheBreaker()
            }
        }

        function cacheBreaker() {
            return '&t=' + Date.now();
        }
    }

})(angular);
