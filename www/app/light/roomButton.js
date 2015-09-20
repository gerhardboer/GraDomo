(function (angular) {
  angular.module('GraDomo')
    .directive('roomButton', RoomButton);

  RoomButton.$inject = ['lightService'];

  function RoomButton(lightService) {
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
      template: '<button class="button button-small" ng-class="{\'button-balanced\': vm.isOn, \'button-assertive\': vm.isOff}" ng-click="vm.execute()"> ' +
      '<span>{{vm.type}}</span> ' +
      //'<ion-spinner ng-if="vm.executing" icon="android" class="loadingRoom-padding"></ion-spinner> ' +
      '</button>'
    };

    function RoomButtonController($scope) {
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
      };

      function turnOnRoom() {
        lightService.turnOnDevices(vm.devices)

      }

      function turnOffRoom() {
        lightService.turnOffDevices(vm.devices)
      }

      $scope.$on('light-button-update', setNewState);

      function setNewState(evt, newState) {
        vm.executing = false;
      }
    }
  }
})(angular);
