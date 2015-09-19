/**
 * Created by gerhardboer on 27/08/15.
 */
(function (angular) {
    angular.module('GraDomo')
        .service('lightService', LightService);

    LightService.$inject = ['$q', '$timeout', 'piWebsocket', '$rootScope'];

    function LightService($q, $timeout, piWebsocket, $rootScope) {
        this.requestGUI = requestGUI;
        this.sendOn = sendOn;
        this.sendOff = sendOff;

        this.turnOnDevices = turnOnDevices;
        this.turnOffDevices = turnOffDevices;

        this.openSocket = openSocket;
        this.closeSocket = closeSocket;

        var lightSocket;

        function openSocket(onClose) {
            var deferred = $q.defer();

            lightSocket = piWebsocket('light', lightMessageHandler, deferred, onClose);

            return deferred.promise;
        }

        function closeSocket() {
            //close it soft here, since piLight does not send closed event?
            lightSocket.softClose();
        }

        function lightMessageHandler(evt) {
            if (evt.data) {
                var response = angular.fromJson(evt.data);
                if (response.origin) {
                    if (response.origin === 'update') {
                        $rootScope.$broadcast('light-update', parseResult(response));
                    }
                } else if (response.gui) {
                    $rootScope.$broadcast('light-gui', addDeviceState(response.gui, response.devices));
                }
            }
        }

        function addDeviceState(gui, devices) {
            Object.keys(gui).map(function (guiKey) {
                gui[guiKey].state = devices[guiKey].state;
            });

            return gui;
        }

        function parseResult(response) {
            return {
                device: response.devices[0],
                state: response.values.state
            };
        }

        function requestGUI() {
            var message = {
                "action": "request config"
            };

            send(message);
        }

        function turnOnDevices(devices) {
            sendWithWait(devices, sendOn)
        }

        function turnOffDevices(devices) {
            sendWithWait(devices, sendOff)
        }

        function sendWithWait(devices, fn) {
            var step = 0;

            Object.keys(devices).forEach(function (device) {
                $timeout(function () {
                    fn(device);
                }, step);

                step += 500;
            });
        }

        function sendOn(device) {
            sendLightToggleMessage("on", device);
        }

        function sendOff(device) {
            sendLightToggleMessage("off", device);
        }

        function sendLightToggleMessage(newState, device) {
            var message = {
                "action": "control",
                "code": {
                    "device": device,
                    "state": newState
                }
            };
            send(message);
        }

        function send(message) {
            return lightSocket.send(angular.toJson(message));
        }

    }
})(angular);
