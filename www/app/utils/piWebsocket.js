/**
 * Created by gerhardboer on 28/08/15.
 */
(function (angular) {
  angular.module('GraDomo')
    .service('piWebsocket', PiWebsocket);

  PiWebsocket.$inject = ['$q', '$rootScope'];

  function PiWebsocket($q, $rootScope) {
    var socket = this;

    socket.workerPool = {};

    socket.lightSocket = initLightSocket();
    //socket.cameraSocket = initCameraSocket();

    //$rootScope.$on('reloadSocket', initSockets);


    function initLightSocket() {
      return new Socket('light', getLightUrlBasedOnPlatform(), lightMessageHandler);
    }

    function getLightUrlBasedOnPlatform() {
      var host = '192.168.0.18';
      if (ionic.Platform.isAndroid()) {
        host = 'localhost';
      }
      return 'ws://' + host + ':5001/websocket';
    }

    function lightMessageHandler(evt) {
      if (evt.data) {
        var response = angular.fromJson(evt.data);
        if (response.origin) {
          if (response.origin === 'update') {
            socket.workerPool[response.devices[0]].resolve(response);
          }
        } else if(response.gui) {
          socket.workerPool['gui'].resolve(response);
        }
      }
    }

    function initCameraSocket() {
      return new Socket('camera', 'ws://localhost:3000', cameraMessageHandler);
    }

    function cameraMessageHandler(evt) {

    }

    function Socket(name, url, handler) {
      this.oWebsocket = new WebSocket(url);

      if (this.oWebsocket) {
        this.oWebsocket.onopen = function (evt) {
          $rootScope.$broadcast(name + '-websocketOpened');
        };

        this.oWebsocket.onclose = function (evt) {
          $rootScope.$broadcast(name + '-websocketClosed');
        };

        this.oWebsocket.onerror = function (evt) {
          console.log(evt);
          $rootScope.$broadcast(name + '-websocketError', evt);
        };

        this.oWebsocket.onmessage = handler;
      }

    }

    Socket.prototype.send = function(key, message) {
      var deferred = createPromise(key);

      this.oWebsocket.send(angular.toJson(message));

      return deferred.promise;
    };

    function createPromise(name) {
      var deferred = $q.defer();

      socket.workerPool[name] = deferred;

      return deferred
    }

  }
})(angular);
