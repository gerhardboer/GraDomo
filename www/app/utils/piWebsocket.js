/**
 * Created by gerhardboer on 28/08/15.
 */
(function (angular) {
  angular.module('GraDomo')
    .factory('piWebsocket', PiWebsocket);

  PiWebsocket.$inject = ['LIGHT_URL', 'CAMERA_URL', 'VIDEO_URL'];

  function PiWebsocket(LIGHT_URL, CAMERA_URL, VIDEO_URL) {
    var sockets = {};
    return function (type, handler, onOpenPromise) {

      if (type === 'picture') {
        return buildSocket(type, CAMERA_URL, handler, onOpenPromise);

      }
      if (type === 'light') {
        return buildSocket(type, LIGHT_URL, handler, onOpenPromise);
      }

      if (type === 'video') {
        return buildSocket(type, VIDEO_URL, handler, onOpenPromise);
      }
    };

    function buildSocket(type, url, handler, onOpenPromise) {
      if(sockets[type]) {
        sockets[type].setHandler(handler);
        onOpenPromise.resolve({});
      } else {
        sockets[type] = new Socket(url, handler, onOpenPromise);
      }

      return sockets[type];
    }
  }

  function Socket(url, handler, onOpenPromise) {
    var oWebsocket = new WebSocket(url);

    oWebsocket.onmessage = handler;

    oWebsocket.onopen = function (evt) {
      onOpenPromise.resolve({
        data: evt
      });
    };

    oWebsocket.onclose = function (evt) {
      handler({closed: evt});
    };

    oWebsocket.onerror = function (evt) {
      handler({error: evt});
    };

    this.send = function(message) {
      oWebsocket.send(message);
    };

    this.setHandler = function(handler) {
      oWebsocket.onmessage = handler;
    };
  }

})(angular);
