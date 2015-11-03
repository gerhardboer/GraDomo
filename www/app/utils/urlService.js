(function (angular) {
    angular.module('GraDomo')
        .service('urlService', urlService);

    urlService.$inject = ['$q'];

    function urlService($q) {

        var defers = [];
        var wifiInfo;


        var ports = {
            light: 5001,
            video: 5004,
            image: 5003,
            camera: 5002,
            stream: 8080
        };

        this.wifiName = getWifiName;
        this.storeWifiInfo = storeWifiInfo;
        this.host = getHost;

        this.lightUrl = getLightUrl;
        this.videoUrl = getVideoUrl;
        this.cameraUrl = getCameraUrl;
        this.imageUrl = getImageUrl;

        function getHost(port) {
            return 'http://' + getHostBasedOnPlatform() + ":" + ports[port];
        }

        //loaded in app.run, so data is here
        //allthough, callback.. so not sure
        function storeWifiInfo(data) {
            wifiInfo = data;
            defers.forEach(function (deferred) {
                deferred.resolve(getHostBasedOnPlatform())
            });
            defers = null;
        }

        function getWifiName() {
            return ionic.Platform.isAndroid() ? wifiInfo.activity.SSID : '';
        }

        function resolveForDesktopOrFinished(deferred, type) {
            if (defers) {
                if (!ionic.Platform.isAndroid()) {
                    resolveUrl(type, deferred);
                } else {
                    defers.push(deferred);
                }
            } else {
                resolveUrl(type, deferred);
            }
        }

        function resolveUrl(type, deferred) {
            var host = getHostBasedOnPlatform();
            switch (type) {
                case 'light':
                    deferred.resolve(buildLightUrl(host));
                    break;
                case 'camera':
                    deferred.resolve(buildCameraUrl(host));
                    break;
                case 'image':
                    deferred.resolve(buildImageUrl(host));
                    break;
                case 'video':
                    deferred.resolve(buildVideoUrl(host));
                    break;
                default:
                    break;
            }
        }

        function buildLightUrl(wifiInfo) {
            return 'ws://' + wifiInfo + ':' + ports.light + '/websocket';
        }

        function getLightUrl() {
            var deferred = $q.defer();

            deferred.promise.then(function (wifiInfo) {
                return buildLightUrl(wifiInfo)
            });

            resolveForDesktopOrFinished(deferred, 'light');

            return deferred.promise;
        }

        function buildVideoUrl(wifiInfo) {
            return 'ws://' + wifiInfo + ':' + ports.video + '/';
        }

        function getVideoUrl() {
            var deferred = $q.defer();

            deferred.promise.then(function (wifiInfo) {
                return buildVideoUrl(wifiInfo);
            });

            resolveForDesktopOrFinished(deferred, 'video');

            return deferred.promise;
        }

        function buildCameraUrl(wifiInfo) {
            return 'ws://' + wifiInfo + ':' + ports.camera + '/';
        }

        function getCameraUrl() {
            var deferred = $q.defer();

            deferred.promise.then(function (wifiInfo) {
                return buildCameraUrl(wifiInfo);
            });

            resolveForDesktopOrFinished(deferred, 'camera');

            return deferred.promise;
        }

        function buildImageUrl(wifiInfo) {
            return 'http://' + wifiInfo + ':' + ports.image + '/';
        }

        function getImageUrl() {
            var deferred = $q.defer();

            deferred.promise.then(function (wifiInfo) {
                return buildImageUrl(wifiInfo);
            });

            resolveForDesktopOrFinished(deferred, 'image');

            return deferred.promise;
        }


        function getHostBasedOnPlatform() {
            var host = '192.168.2.2';
            if (ionic.Platform.isAndroid() && !isOnHomeWifi()) {
                host = 'localhost';
            }

            return host;
        }

        function isOnHomeWifi() {
            return wifiInfo && wifiInfo.activity.SSID === '"waarom?"';
        }

    }

})(angular);
