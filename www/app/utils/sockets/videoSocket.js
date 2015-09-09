/**
 * Created by gerhardboer on 09/09/15.
 */
(function (angular) {
  angular.module('GraDomo')
    .factory('videoSocket', factory);

  factory.$inject = ['piWebsocket'];

  function factory(piWebsocket) {
      var socket;
      return function(message, handler) {
        if(!socket) {
          socket = piWebsocket('video', handler)
        }
      }
  }

})(angular);
