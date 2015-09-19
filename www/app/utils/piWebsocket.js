/**
 * Created by gerhardboer on 28/08/15.
 */
(function (angular) {
    angular.module('GraDomo')
        .factory('piWebsocket', PiWebsocket);

    PiWebsocket.$inject = ['LIGHT_URL', 'CAMERA_URL', 'VIDEO_URL'];

    function PiWebsocket(LIGHT_URL, CAMERA_URL, VIDEO_URL) {
        var sockets = {};
        return function (type, handler, onOpenPromise, onCloseCb) {
            var socketDef = {
                handler: handler,
                onOpenPromise: onOpenPromise,
                onClose: onClose
            };

            if (type === 'close') {
                closeSockets();
            }

            if (type === 'picture') {
                return buildSocket(CAMERA_URL, socketDef);
            }

            if (type === 'light') {
                return buildSocket(LIGHT_URL, socketDef);
            }

            if (type === 'video') {
                return buildSocket(VIDEO_URL, socketDef);
            }


            function onClose(URL) {
                delete sockets[URL];
                onCloseCb && onCloseCb({reason: type + ' socket closed'});
            }
        };


        function closeSockets() {
            Object.keys(sockets)
                .forEach(closeSocket);

            function closeSocket(socketId) {
                sockets[socketId].close();
            }
        }

        function buildSocket(url, socketDef) {
            var handler = socketDef.handler;
            var onCloseFn = socketDef.onClose;
            var onOpenPromise = socketDef.onOpenPromise;

            if (sockets[url]) {
                sockets[url].setHandler(handler);
                onOpenPromise.resolve({});
            } else {
                sockets[url] = new Socket(url, handler, onOpenPromise, onCloseFn);
            }

            return sockets[url];
        }
    }

    function Socket(url, handler, onOpenPromise, onCloseFn) {
        var oWebsocket = new WebSocket(url);

        oWebsocket.onmessage = handler;

        oWebsocket.onopen = function (evt) {
            onOpenPromise && onOpenPromise.resolve({
                data: evt
            });
        };

        oWebsocket.onclose = function (evt) {
          onCloseFn && onCloseFn(url, evt);
        };

        oWebsocket.onerror = function (evt) {
            var error = {reason: 'No connection'};

            onOpenPromise && onOpenPromise.reject(error);
            handler && handler(error);
        };

        this.send = function (message) {
            try {
                oWebsocket.send(message);
            } catch (e) {
                console.log(e);
            }
        };

        this.close = function() {
            oWebsocket.close();
        };

        this.softClose = function (){
            onCloseFn({});
        };

        this.setHandler = function (handler) {
            oWebsocket.onmessage = handler;
        };
    }

})(angular);
