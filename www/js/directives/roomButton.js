(function (angular) {
  angular.module('GraDomo')
    .directive('roomButton', RoomButton);

  RoomButton.$inject = ['$timeout', 'lightService', 'toastr'];

  function RoomButton($timeout, lightService, toastr) {
    return {
      restrict: 'EA',
      replace: true,
      scope: {
        room: '=',
        config: '=',
        type: '@'
      },
      controller: RoomButtonController,
      controllerAs: 'vm',
      bindToController: true,
      template: '<button class="button button-small" ng-class="{\'button-balanced\': vm.isOn, \'button-assertive\': vm.isOff}" ng-click="vm.execute()"> '+
      '<span ng-if="!vm.executing">{{vm.type}}</span> '+
      '<ion-spinner ng-if="vm.executing" icon="android" class="loadingRoom-padding"></ion-spinner> '+
    '</button>'
    };

    function RoomButtonController() {
      var vm = this;

      vm.executing = false;

      vm.isOn = vm.type == 'on';
      vm.isOff = vm.type == 'off';

      vm.execute = function () {
        vm.executing = true;


        if (vm.isOn) {
          turnOnRoom();
        }

        if (vm.isOff) {
          turnOffRoom();
        }

        $timeout(function () {
          if(vm.executing) {
            vm.executing = false;
            toastr.warning('No response, state unchanged', {timeOut: 500})
          }
        }, 5000)
      };

      function turnOnRoom() {
        var devices = getDevicesForRoom(vm.config);

        lightService.turnOnDevices(devices, vm.room)
          .then(showNewState);

      }

      function turnOffRoom() {
        var devices = getDevicesForRoom(vm.config);

        lightService.turnOffDevices(devices, vm.room)
          .then(showNewState);

      }

      function getDevicesForRoom(roomConfig) {
        return Object.keys(roomConfig)
          .map(function (roomConfigEntry) {
            var device = roomConfig[roomConfigEntry];
            if (isDevice(device)) {
              return roomConfigEntry;
            } else {
              return null;
            }
          }).filter(function (device) {
            return device !== null;
          });
      }

      function isDevice(device) {
        return angular.isObject(device);
      }

      function showNewState(newState) {
        toastr.success(vm.config.name + ': ' + newState.state, {timeOut: 500});
        vm.executing = false;
      }
    }
  }
})(angular);
