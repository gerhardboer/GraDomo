(function (angular) {
  angular.module('GraDomo')
    .directive('lightButton', LightButton);

  LightButton.$inject = ['$timeout', 'lightService', 'piToastr'];

  function LightButton($timeout, lightService, piToastr) {
    return {
      restrict: 'EA',
      replace: true,
      scope: {
        device: '=',
        type: '@'
      },
      controller: LightButtonController,
      controllerAs: 'vm',
      bindToController: true,
      template: '<button class="button" ng-class="{\'button-balanced\': vm.isOn, \'button-assertive\': vm.isOff}" ng-click="vm.execute()"> ' +
      '<i class="icon" ng-class="{\'ion-flash\': vm.isOn, \'ion-flash-off\': vm.isOff}" ng-if="!vm.executing"></i> ' +
      '<ion-spinner icon="android" class="loading-padding-top" ng-if="vm.executing"></ion-spinner> ' +
      '</button>'
    };

    function LightButtonController() {
      var vm = this;

      vm.executing = false;

      vm.isOn = vm.type == 'on';
      vm.isOff = vm.type == 'off';

      vm.execute = function () {
        vm.executing = true;
        if (vm.isOn) {
          lightService.sendOn(vm.device.id)
            .then(showNewState)
        }

        if (vm.isOff) {
          lightService.sendOff(vm.device.id)
            .then(showNewState);
        }

        $timeout(function () {
          if(vm.executing) {
            vm.executing = false;
            piToastr('warning', 'No response, state unchanged');
          }
        }, 2000)
      };

      function showNewState(newState) {
        piToastr('success', vm.device.name + ': ' + newState.state);
        vm.executing = false;
      }
    }
  }
})(angular);
