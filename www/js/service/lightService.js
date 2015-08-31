/**
 * Created by gerhardboer on 27/08/15.
 */
(function (angular) {
  angular.module('GraDomo')
    .service('lightService', LightService);

  LightService.$inject = ['$q', 'piWebsocket'];

  function LightService($q, piWebsocket) {
    this.getConfig = getConfig;
    this.sendOn = sendOn;
    this.sendOff = sendOff;

    this.turnOnDevices = turnOnDevices;
    this.turnOffDevices = turnOffDevices;

    function getConfig() {
      return piWebsocket.requestConfig()
        .then(function (response) {
          if (response.config !== undefined) {
            return response.config;
          }
        });
    }

    function turnOnDevices(devices, room) {
      var promises = devices.map(function (device) {
        return sendOn(room, device);
      });

      return $q.all(promises)
        .then(function (result) {
          return {device: room, state: 'on'};
        })
    }

    function turnOffDevices(devices, room) {
      var promises = devices.map(function (device) {
        return sendOff(room, device);
      });

      return $q.all(promises)
        .then(function (result) {
          return {device: room, state: 'off'};
        });
    }

    function sendOn(room, device) {
      return sendNewStateRequest("on", room, device);
    }

    function sendOff(room, device) {
      return sendNewStateRequest("off", room, device);
    }

    function sendNewStateRequest(newState, room, device) {
      var message = {
        "message": "send",
        "code": {
          "location": room,
          "device": device,
          "state": newState
        }
      };

      return sendLightToggleMessage(message, device);
    }

    function sendLightToggleMessage(message, device) {
      return piWebsocket.send(angular.toJson(message), device)
        .then(parseResult)
    }

    function parseResult(response) {
      var key = Object.keys(response.devices)[0];
      return {
        device: response.devices[key],
        state: response.values.state
      };
    }
  }
})(angular);
