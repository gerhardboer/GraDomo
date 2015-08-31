/**
 * Created by gerhardboer on 28/08/15.
 */
(function (angular) {
  angular.module('GraDomo')
    .factory('piWebsocket', PiWebsocket);

  PiWebsocket.$inject = ['$q', '$rootScope'];

  function PiWebsocket($q, $rootScope) {
    var deferred,
      oWebsocket,
      socket = this,
      workerPool = {};

    initSocket();

    $rootScope.$on('reloadSocket', initSocket);

    return {
      send: function (message, device) {
        var deferred = $q.defer();

        oWebsocket.send(message);
        workerPool[device] = deferred;
        return deferred.promise;
      },
      requestConfig: function () {
        deferred = $q.defer();

        requestConfig();

        return deferred.promise;
      }
    };

    function requestConfig() {
      socket.requesting = true;
      if (!socket.connecting) {
        oWebsocket.send("{\"message\":\"request config\"}");
      }
    }

    function initSocket() {
      socket.connecting = true;

      oWebsocket = new WebSocket('ws://home.gerhardboer.nl:5001/websocket');
      if (oWebsocket) {
        oWebsocket.onopen = function (evt) {
          socket.connecting = false;
          if (socket.requesting) {
            requestConfig();
          }

          $rootScope.$broadcast('websocketOpened');
        };
        oWebsocket.onclose = function (evt) {
          $rootScope.$broadcast('websocketClosed');
        };
        oWebsocket.onerror = function (evt) {
          $rootScope.$broadcast('websocketError');
        };
        oWebsocket.onmessage = function (evt) {
          socket.requesting = false;
          if (evt.data) {
            var response = angular.fromJson(evt.data);
            if(response.config) {
              deferred.resolve(response);
            } else {
              workerPool[getDevice(response)].resolve(response);
            }
          }
        }
      }
    }

    function getDevice(response) {
      var firstKey = Object.keys(response.devices)[0];
      return response.devices[firstKey][0];
    }
  }
})(angular);
