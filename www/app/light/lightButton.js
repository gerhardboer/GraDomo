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
      template: '<button class="button" ng-class="{\'isOff\': vm.isOff(), \'isOn\': vm.isOn(), \'button-balanced\': vm.isTypeOn, \'button-assertive\': vm.isTypeOff}" ng-click="vm.execute()"> ' +
      '<i class="icon" ng-class="{\'ion-flash\': vm.isTypeOn, \'ion-flash-off\': vm.isTypeOff}" ng-if="!vm.executing"></i> ' +
      '<ion-spinner icon="android" class="loading-padding-top" ng-if="vm.executing"></ion-spinner> ' +
      '</button>'
    };

    function LightButtonController() {
      var vm = this;

      vm.executing = false;

      vm.isOn = function() {
        return vm.device.state === 'on' && vm.type === 'on';
      };

      vm.isOff = function() {
        return vm.device.state === 'off' && vm.type === 'off';
      };

      vm.isTypeOn = vm.type == 'on';
      vm.isTypeOff = vm.type == 'off';

      vm.execute = function () {
        vm.executing = true;
        if (vm.isTypeOn) {
          lightService.sendOn(vm.device.id)
            .then(showNewState)
        }

        if (vm.isTypeOff) {
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
        vm.device.state = newState.state;
        piToastr('success', vm.device.name + ': ' + newState.state);
        vm.executing = false;
      }
    }
  }
})(angular);
