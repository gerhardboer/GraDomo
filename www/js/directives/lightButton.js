(function (angular) {
  angular.module('GraDomo')
    .directive('lightButton', LightButton);

  LightButton.$inject = ['$timeout', 'lightService', 'toastr'];

  function LightButton($timeout, lightService, toastr) {
    return {
      restrict: 'EA',
      replace: true,
      scope: {
        room: '=',
        device: '=',
        name: '=',
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
          lightService.sendOn(vm.room, vm.device)
            .then(showNewState)
        }

        if (vm.isOff) {
          lightService.sendOff(vm.room, vm.device)
            .then(showNewState);
        }

        $timeout(function () {
          if(vm.executing) {
            vm.executing = false;
            toastr.warning('No response, state unchanged', {timeOut: 500})
          }
        }, 1500)
      };

      function showNewState(newState) {
        toastr.success(vm.name + ': ' + newState.state, {timeOut: 500});
        vm.executing = false;
      }
    }
  }
})(angular);
