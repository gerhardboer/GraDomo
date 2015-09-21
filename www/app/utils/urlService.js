(function (angular) {
    angular.module('GraDomo')
        .service('urlService', urlService);

    urlService.$inject = ['$q'];

    function urlService($q) {

        var deferred = $q.defer();
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
            deferred.resolve(getHostBasedOnPlatform())
        }

        function getWifiName() {
            return ionic.Platform.isAndroid() ? wifiInfo.activity.SSID : '';
        }

        function resolveForDesktop(type) {
            if (!ionic.Platform.isAndroid()) {
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
        }

        function buildLightUrl(wifiInfo) {
            return 'ws://' + wifiInfo + ':' + ports.light + '/websocket';
        }

        function getLightUrl() {
            deferred.promise.then(function (wifiInfo) {
                return buildLightUrl(wifiInfo)
            });

            resolveForDesktop('light');

            return deferred.promise;
        }

        function buildVideoUrl(wifiInfo) {
            return 'ws://' + wifiInfo + ':' + ports.video + '/';
        }

        function getVideoUrl() {
            deferred.promise.then(function (wifiInfo) {
                return buildVideoUrl(wifiInfo);
            });

            resolveForDesktop('video');

            return deferred.promise;
        }

        function buildCameraUrl(wifiInfo) {
            return 'ws://' + wifiInfo + ':' + ports.camera + '/';
        }

        function getCameraUrl() {
            deferred.promise.then(function (wifiInfo) {
                return buildCameraUrl(wifiInfo);
            });

            resolveForDesktop('camera');


            return deferred.promise;
        }

        function buildImageUrl(wifiInfo) {
            return 'http://' + wifiInfo + ':' + ports.image + '/';
        }

        function getImageUrl() {
            deferred.promise.then(function (wifiInfo) {
                return buildImageUrl(wifiInfo);
            });

            resolveForDesktop('image');

            return deferred.promise;
        }


        function getHostBasedOnPlatform() {
            var host = '192.168.0.18';
            if (ionic.Platform.isAndroid() && !isOnHomeWifi()) {
                host = 'localhost';
            }

            return host;
        }

        function isOnHomeWifi() {
            console.log('wifiInfo.activity.SSID', wifiInfo.activity.SSID);
            return wifiInfo && wifiInfo.activity.SSID === '"waarom?"';
        }

    }

})(angular);
