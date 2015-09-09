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
    $scope.$on('light-gui', showGUI);
    $scope.$on('light-update', showNewState);

    function showNewState(newState) {
      piToastr('success', vm.device.name + ': ' + newState.state);
    }

    (function init() {
        getGUI();
    })();

    function getGUI() {
      lightService.requestGUI();
    }

    function showGUI(gui) {
      vm.gui = transformGUI(gui);
      showGUILoaded();
    }

    //function websocketOpened(evt, socketEvt) {
    //  if(!vm.gui) {
    //    getGUI();
    //  }
    //  piToastr('info', socketEvt.srcElement.url + ' connected');
    //}
    //
    //function websocketClosed() {
    //  piToastr('info', 'Light socket closed');
    //}
    //
    //function websocketError(evt, socketEvt) {
    //  piToastr('error', socketEvt.srcElement.url + ' error');
    //}

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
