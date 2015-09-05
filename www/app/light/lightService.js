/**
 * Created by gerhardboer on 27/08/15.
 */
(function (angular) {
  angular.module('GraDomo')
    .service('lightService', LightService);

  LightService.$inject = ['$q', 'piWebsocket'];

  function LightService($q, piWebsocket) {
    this.requestGUI = requestGUI;
    this.sendOn = sendOn;
    this.sendOff = sendOff;

    this.turnOnDevices = turnOnDevices;
    this.turnOffDevices = turnOffDevices;

    function requestGUI() {
      var message = {
        "action": "request config"
      };

      return send('gui', message)
        .then(function (response) {
          if (response.gui !== undefined) {
            return response.gui;
          }
        });
    }

    function turnOnDevices(devices, room) {
      var promises = createPromises(devices, sendOn);

      return $q.all(promises)
        .then(function (result) {
          return {device: room, state: 'on'};
        })
    }

    function turnOffDevices(devices, room) {
      var promises = createPromises(devices, sendOff);

      return $q.all(promises)
        .then(function (result) {
          return {device: room, state: 'off'};
        });
    }

    function createPromises(devices, fn) {
      return Object.keys(devices)
        .map(function (device) {
          return fn(device);
        });
    }

    function sendOn(device) {
      return sendLightToggleMessage("on", device);
    }

    function sendOff(device) {
      return sendLightToggleMessage("off", device);
    }

    function sendLightToggleMessage(newState, device) {
      var message = {
        "action": "control",
        "code": {
          "device": device,
          "state": newState
        }
      };
      return send(device, message)
        .then(parseResult)
    }

    function send(key, message) {
      return piWebsocket.lightSocket.send(key, angular.toJson(message));
    }

    function parseResult(response) {
      return {
        device: response.devices[0],
        state: response.values.state
      };
    }
  }
})(angular);
