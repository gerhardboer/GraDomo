/**
 * Created by gerhardboer on 28/08/15.
 */
(function (angular) {
    angular.module('GraDomo')
        .factory('piWebsocket', PiWebsocket);

    PiWebsocket.$inject = ['$q', 'urlService'];

    function PiWebsocket($q, urlService) {
        var sockets = {};
        return function (type, handler, onCloseCb) {
            var socketDef = {
                handler: handler,
                onClose: onClose
            };

            if (type === 'close') {
                closeSockets();
            }

            if (type === 'picture') {
                return buildSocket(type, urlService.cameraUrl(), socketDef);
            }

            if (type === 'light') {
                return buildSocket(type, urlService.lightUrl(), socketDef);
            }

            if (type === 'video') {
                return buildSocket(type, urlService.videoUrl(), socketDef);
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

        function buildSocket(type, urlPromise, socketDef) {
            var onOpenPromise = $q.defer();
            var handler = socketDef.handler;
            var onCloseFn = socketDef.onClose;

            urlPromise.then(setHandlerOrCreate);

            return onOpenPromise.promise;

            function setHandlerOrCreate(url) {
                if (sockets[type]) {
                    sockets[type].setHandler(handler);
                    onOpenPromise.resolve(sockets[type]);
                } else {
                    sockets[type] = new Socket(url, handler, onOpenPromise, onCloseFn);
                }
            }
        }
    }

    function Socket(url, handler, onOpenPromise, onCloseFn) {
        var self = this;
        var oWebsocket = new WebSocket(url);

        oWebsocket.onmessage = handler;

        oWebsocket.onopen = function (evt) {
            onOpenPromise && onOpenPromise.resolve(self);
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

        this.close = function () {
            oWebsocket.close();
        };

        this.softClose = function () {
            onCloseFn({});
        };

        this.setHandler = function (handler) {
            oWebsocket.onmessage = handler;
        };
    }

})(angular);
