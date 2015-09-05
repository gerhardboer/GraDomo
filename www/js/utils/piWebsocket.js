/**
 * Created by gerhardboer on 28/08/15.
 */
(function (angular) {
  angular.module('GraDomo')
    .service('piWebsocket', PiWebsocket);

  PiWebsocket.$inject = ['$q', '$rootScope'];

  function PiWebsocket($q, $rootScope) {
    var oWebsocket,
      socket = this,
      workerPool = {};

    socket.send = send;
    socket.requestGUI = requestGUI;

    initSocket();

    $rootScope.$on('reloadSocket', initSocket);

    function requestGUI() {
      var deferred = createOrGetPromise('config');

      var message = {
        "action": "request config"
      };
      safeSend(message);

      return deferred.promise;
    }

    function send(newState, device) {
      var deferred = createOrGetPromise(device);

      var message = {
        "action": "control",
        "code": {
          "device": device,
          "state": newState
        }
      };
      safeSend(message);

      return deferred.promise;
    }

    function safeSend(message) {
      if (!socket.connecting) {
        oWebsocket.send(angular.toJson(message));
      }
    }

    function createOrGetPromise(name) {
      var deferred = $q.defer();
      if (!workerPool[name]) {
        workerPool[name] = deferred;
      }

      return deferred
    }

    function initSocket() {
      socket.connecting = true;

      oWebsocket = new WebSocket(getUrlBasedOnPlatform());
      if (oWebsocket) {
        oWebsocket.onopen = function (evt) {
          socket.connecting = false;

          requestGUI();

          $rootScope.$broadcast('websocketOpened');
        };
        oWebsocket.onclose = function (evt) {
          $rootScope.$broadcast('websocketClosed');
        };
        oWebsocket.onerror = function (evt) {
          console.log(evt);
          $rootScope.$broadcast('websocketError', evt);
        };
        oWebsocket.onmessage = function (evt) {
          if (evt.data) {
            var response = angular.fromJson(evt.data);
            if (response.origin) {
              if (response.origin === 'update') {
                resolve(response.devices[0], response);
              }
            } else {
              resolve('config', response);
            }
          }
        }
      }
    }

    function resolve(name, data) {
      if (workerPool[name]) {
        workerPool[name].resolve(data);
        delete workerPool[name];
      }
    }


    function getUrlBasedOnPlatform() {
      var host = '192.168.0.18';
      if (ionic.Platform.isAndroid()) {
        host = 'localhost';
      }
      return 'ws://' + host + ':5001/websocket';
    }
  }
})(angular);
