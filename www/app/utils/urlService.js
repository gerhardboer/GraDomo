(function (angular) {
    angular.module('GraDomo')
        .service('urlService', urlService);

    urlService.$inject = [];

    function urlService() {

        var host = getHostBasedOnPlatform();
        var wifiInfo;

        var urls = {
            LIGHT_URL: 'ws://' + host + ':' + 5001 + '/websocket',
            VIDEO_URL: 'ws://' + host + ':' + 5004 + '/',
            IMAGE_URL: 'http://' + host + ':' + 5003 + '/',
            CAMERA_URL: 'ws://' + host + ':' + 5002 + '/'
        };

        this.getWifiName = getWifiName;
        this.storeWifiInfo = storeWifiInfo;

        this.getLightUrl = getLightUrl;
        this.getVideoUrl = getVideoUrl;
        this.getCameraUrl = getCameraUrl;

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
