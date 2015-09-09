/**
 * Created by gerhardboer on 28/08/15.
 */
(function (angular) {
  angular.module('GraDomo')
    .factory('piWebsocket', PiWebsocket);

  PiWebsocket.$inject = ['$q', '$rootScope', 'LIGHT_URL', 'CAMERA_URL', 'VIDEO_URL'];

  function PiWebsocket($q, $rootScope, LIGHT_URL, CAMERA_URL, VIDEO_URL) {
    var sockets = {};
    return function (type, handler, onOpenPromise) {
      if (type === 'picture') {
        if(!sockets.camera) {
          sockets.camera = new Socket(CAMERA_URL, handler, onOpenPromise);
        }
        return sockets.camera;
      }
      if (type === 'light') {
        if(!sockets.light) {
          sockets.light = new Socket(LIGHT_URL, handler, onOpenPromise);
        }
        return sockets.light;
      }

      if (type === 'video') {
        if(!sockets.video) {
          sockets.video = new Socket(VIDEO_URL, handler, onOpenPromise);
        }
        return sockets.video;
      }
    };
  }

  function Socket(url, handler, onOpenPromise) {
    this.oWebsocket = new WebSocket(url);

    this.oWebsocket.onmessage = handler;

    this.oWebsocket.onopen = function (evt) {
      onOpenPromise.resolve({
        data: evt
      });
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
