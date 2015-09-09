/**
 * Created by gerhardboer on 27/08/15.
 */
(function (angular) {
  angular.module('GraDomo')
    .service('lightService', LightService);

  LightService.$inject = ['$q', 'piWebsocket', '$rootScope'];

  function LightService($q, piWebsocket, $rootScope) {
    this.requestGUI = requestGUI;
    this.sendOn = sendOn;
    this.sendOff = sendOff;

    this.turnOnDevices = turnOnDevices;
    this.turnOffDevices = turnOffDevices;

    this.openSocket = openSocket;

    var lightSocket;

    function openSocket() {
      var deferred = $q.defer();

      lightSocket = piWebsocket('light', lightMessageHandler, deferred);

      return deferred.promise;
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

      send('gui', message);
    }

    function turnOnDevices(devices, room) {
      Object.keys(devices).forEach(function(device) {
        sendOn(device);
      });
    }

    function turnOffDevices(devices, room) {
      Object.keys(devices).forEach(function(device) {
        sendOff(device);
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
      send(device, message);
    }

    function send(key, message) {
      return lightSocket.send(key, angular.toJson(message));
    }

  }
})(angular);