(function (angular) {
    angular.module('GraDomo')
        .service('urlService', urlService);

    urlService.$inject = [];

    function urlService() {

        var host = getHostBasedOnPlatform();
        var wifiInfo;

        var ports = {
            light: 5001,
            video: 5004,
            image: 5003,
            camera: 5002,
            stream: 8080
        };

        var urls = {
            LIGHT_URL: 'ws://' + host + ':' + ports.light + '/websocket',
            VIDEO_URL: 'ws://' + host + ':' + ports.video + '/',
            IMAGE_URL: 'http://' + host + ':' + ports.image + '/',
            CAMERA_URL: 'ws://' + host + ':' + ports.camera + '/'
        };

        this.getWifiName = getWifiName;
        this.storeWifiInfo = storeWifiInfo;
        this.getHost = getHost;

        this.getLightUrl = getLightUrl;
        this.getVideoUrl = getVideoUrl;
        this.getCameraUrl = getCameraUrl;

        function getHost(port) {
            return 'http://' + host + ":" + ports[port];
        }

        //loaded in app.run, so data is here
        //allthough, callback.. so not sure
        function storeWifiInfo(data) {
            wifiInfo = data;
        }

        function getWifiName() {
            return wifiInfo.SSID;
        }

        function getLightUrl() {
            return urls.LIGHT_URL;
        }

        function getVideoUrl() {
            return urls.VIDEO_URL;
        }

        function getCameraUrl() {
            return urls.VIDEO_URL;
        }


        function getHostBasedOnPlatform() {
            var host = '192.168.0.18';
            if (ionic.Platform.isAndroid() && !isOnHomeWifi()) {
                host = 'localhost';
            }

            return host;
        }

        function isOnHomeWifi() {
            return wifiInfo && wifiInfo.SSID === 'waarom?';
        }

    }

})(angular);
