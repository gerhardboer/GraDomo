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
    socket.requestConfig = requestConfig;

    initSocket();

    $rootScope.$on('reloadSocket', initSocket);

    function requestConfig() {
      var deferred = createOrGetPromise('config');

      safeSend("{\"message\":\"request config\"}");

      return deferred.promise;
    }

    function send(message, device) {
      var deferred = createOrGetPromise(device);

      safeSend(message);

      return deferred.promise;
    }

    function safeSend(message) {
      if (!socket.connecting) {
        oWebsocket.send(message);
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

      oWebsocket = new WebSocket('ws://home.gerhardboer.nl:5001/websocket');
      if (oWebsocket) {
        oWebsocket.onopen = function (evt) {
          socket.connecting = false;

          requestConfig();

          $rootScope.$broadcast('websocketOpened');
        };
        oWebsocket.onclose = function (evt) {
          $rootScope.$broadcast('websocketClosed');
        };
        oWebsocket.onerror = function (evt) {
          $rootScope.$broadcast('websocketError');
        };
        oWebsocket.onmessage = function (evt) {
          if (evt.data) {
            var response = angular.fromJson(evt.data);
            var key = response.config ? 'config' : getDevice(response);
            resolve(key, response);
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

    function getDevice(response) {
      var firstKey = Object.keys(response.devices)[0];
      return response.devices[firstKey][0];
    }
  }
})(angular);
