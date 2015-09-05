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
      return piWebsocket.requestGUI()
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
      return piWebsocket.send(newState, device)
        .then(parseResult)
    }

    function parseResult(response) {
      return {
        device: response.devices[0],
        state: response.values.state
      };
    }
  }
})(angular);
