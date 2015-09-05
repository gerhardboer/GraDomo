/**
 * Created by gerhardboer on 27/08/15.
 */
(function (angular) {
  angular.module('GraDomo')
    .controller('LightView', LightView);

  LightView.$inject = ['$scope', 'lightService', 'piToastr'];

  function LightView($scope, lightService, piToastr) {
    var vm = this;

    this.reloadGUI = getGUI;

    $scope.$on('websocketOpened', websocketOpened);
    $scope.$on('websocketClosed', websocketClosed);
    $scope.$on('websocketError', websocketError);

    (function init() {
      getGUI();
    })();

    function getGUI() {
      lightService.requestGUI()
        .then(showGUI)
    }

    function showGUI(gui) {
      vm.gui = transformGUI(gui);
      showGUILoaded();
    }

    function websocketOpened() {
      piToastr('info', 'Websocket connected');
    }

    function websocketClosed() {
      piToastr('info', 'Websocket closed');
    }

    function websocketError(evt) {
      piToastr('error', 'Websocket error');
    }

    function showGUILoaded() {
      piToastr('info', 'GUI loaded');
    }
  }

  function transformGUI(gui) {
      var rooms = {};

      angular.forEach(gui, function (device, deviceKey) {
        device.group.forEach(function (room) {
          if (rooms[room] === undefined) {
            rooms[room] = {};
          }
          device.id = deviceKey;
          rooms[room][deviceKey] = (device);
        });
      });

    return rooms;
  }
})(angular);
