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

    $rootScope.$on('reloadSockets', init);

    function init() {
      socket.lightSocket = initLightSocket();
      socket.cameraSocket = initCameraSocket();
    }

    init();

    function initLightSocket() {
      return new Socket('light', getUrlBasedOnPlatform(5001, 'websocket'), lightMessageHandler);
    }

    function lightMessageHandler(evt) {
      if (evt.data) {
        var response = angular.fromJson(evt.data);
        if (response.origin) {
          if (response.origin === 'update') {
            socket.workerPool[response.devices[0]].resolve(response);
          }
        } else if (response.gui) {
          socket.workerPool['gui'].resolve(response);
        }
      }
    }

    function initCameraSocket() {
      return new Socket('camera', getUrlBasedOnPlatform(5002, ''), cameraMessageHandler);
    }

    function cameraMessageHandler(evt) {
      socket.workerPool['camera'].resolve(evt);
    }

    function getUrlBasedOnPlatform(port, address) {
      var host = '192.168.0.18';
      if (ionic.Platform.isAndroid()) {
        host = 'localhost';
      }
      return 'ws://' + host + ':' + port + '/' + address;
    }

    function Socket(name, url, handler) {
      var socket = this;
      socket.todo = [];
      socket.oWebsocket = new WebSocket(url);


      if (this.oWebsocket) {
        this.oWebsocket.onmessage = handler;

        this.oWebsocket.onopen = function (evt) {
          $rootScope.$broadcast(name + '-websocketOpened', evt);

          socket.onOpen(evt);
        };

        this.oWebsocket.onclose = function (evt) {
          console.log(evt);
          $rootScope.$broadcast(name + '-websocketClosed');
        };

        this.oWebsocket.onerror = function (evt) {
          console.log(evt);
          $rootScope.$broadcast(name + '-websocketError', evt);
        };
      }
    }

    Socket.prototype.onOpen = function (evt) {
      for (var i = 0; i < this.todo.length; i++) {
        this.oWebsocket.send(this.todo[i]);
      }
      this.todo = [];
    };

    Socket.prototype.send = function (key, message) {
      var deferred = createPromise(key);

      if (this.oWebsocket.readyState !== 1) {
        this.todo.push(message);
      } else {
        this.oWebsocket.send(message);
      }

      return deferred.promise;
    };

    function createPromise(name) {
      var deferred = $q.defer();

      socket.workerPool[name] = deferred;

      return deferred
    }

  }
})(angular);
