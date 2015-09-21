(function (angular) {
    angular.module('GraDomo')
        .service('urlService', urlService);

    urlService.$inject = ['$q'];

    function urlService($q) {

        var deffered = $q.defer();
        var wifiInfo = function () {
            this.SSID = deffered.promise;
        };

        var ports = {
            light: 5001,
            video: 5004,
            image: 5003,
            camera: 5002,
            stream: 8080
        };

        this.wifiName = wifiName;
        this.storeWifiInfo = storeWifiInfo;
        this.host = host;

        this.lightUrl = lightUrl;
        this.videoUrl = videoUrl;
        this.cameraUrl = cameraUrl;

        function host(port) {
            return 'http://' + getHostBasedOnPlatform() + ":" + ports[port];
        }

        //loaded in app.run, so data is here
        //allthough, callback.. so not sure
        function storeWifiInfo(data) {
            console.log('storing: ', data);
            wifiInfo = data;
            deffered.resolve()
        }

        function wifiName() {
            return wifiInfo.SSID;
        }

        function lightUrl() {
            return getHostBasedOnPlatform()
                .then(function (host) {
                    return 'ws://' + host + ':' + ports.light + '/websocket';
                });
        }

        function videoUrl() {
            return getHostBasedOnPlatform()
                .then(function (host) {
                    return 'http://' + host + ':' + ports.video + '/';
                });

        }

        function cameraUrl() {
            return getHostBasedOnPlatform()
                .then(function (host) {
                    return 'ws://' + host + ':' + ports.camera + '/';
                });
        }

        function getHostBasedOnPlatform() {
            if (!deffered) {
                return determineHost();
            }

            return deffered.promise;
        }

        function determineHost() {
            var host = '192.168.0.18';
            if (ionic.Platform.isAndroid() && !isOnHomeWifi()) {
                host = 'localhost';
            }
            return $q.when(host);
        }

        function isOnHomeWifi() {
            console.log('SSID ', wifiInfo.activity.SSID);
            return wifiInfo && wifiInfo.activity.SSID === '"waarom?"';
        }

    }

})(angular);
