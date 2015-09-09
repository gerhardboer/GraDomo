/**
 * Created by gerhardboer on 28/08/15.
 */
(function (angular) {
  angular.module('GraDomo')
    .factory('piWebsocket', PiWebsocket);

  PiWebsocket.$inject = ['$q', '$rootScope', 'LIGHT_URL', 'CAMERA_URL', 'VIDEO_URL'];

  function PiWebsocket($q, $rootScope, LIGHT_URL, CAMERA_URL, VIDEO_URL) {
    return function (type, handler) {
      if (type === 'picture') {
        return initCameraSocket(handler)
      }
      if (type === 'light') {
        return initLightSocket(handler);
      }

      if (type === 'video') {
        return initVideoSocket(handler);
      }
    };

    function initLightSocket(handler) {
      return new Socket(LIGHT_URL, handler);
    }

    function initCameraSocket(handler) {
      return new Socket(CAMERA_URL, handler);
    }

    function initVideoSocket(handler) {
      return new Socket(VIDEO_URL, handler);
    }
  }

  function Socket(url, handler) {
    this.oWebsocket = new WebSocket(url);

    this.oWebsocket.onmessage = handler;

    this.oWebsocket.onopen = function (evt) {
      handler({open: evt});
    };

    this.oWebsocket.onclose = function (evt) {
      handler({closed: evt});
    };

    this.oWebsocket.onerror = function (evt) {
      handler({error: evt});
    };
  }

  Socket.prototype.send = function (key, message) {
    this.oWebsocket.send(message);
  };

})(angular);
