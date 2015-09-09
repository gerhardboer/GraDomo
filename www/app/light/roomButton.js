(function (angular) {
  angular.module('GraDomo')
    .directive('roomButton', RoomButton);

  RoomButton.$inject = ['$timeout', 'lightService', 'piToastr'];

  function RoomButton($timeout, lightService, piToastr) {
    return {
      restrict: 'EA',
      replace: true,
      scope: {
        room: '=',
        devices: '=',
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
            piToastr('warning', 'No response, state unchanged');
          }
        }, 5000)
      };

      function turnOnRoom() {
        lightService.turnOnDevices(vm.devices, vm.room)
          .then(showNewState);

      }

      function turnOffRoom() {
        lightService.turnOffDevices(vm.devices, vm.room)
          .then(showNewState);

      }

      function showNewState(newState) {
        Object.keys(vm.devices).map(function(deviceKey) {
          vm.devices[deviceKey].state = newState.state;
        });

        piToastr('success', vm.room + ': ' + newState.state);
        vm.executing = false;
      }
    }
  }
})(angular);
