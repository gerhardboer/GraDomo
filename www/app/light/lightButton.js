(function (angular) {
    angular.module('GraDomo')
        .directive('lightButton', LightButton);

    LightButton.$inject = ['$timeout', 'lightService'];

    function LightButton($timeout, lightService) {
        return {
            restrict: 'EA',
            replace: true,
            scope: {
                device: '=',
                type: '@',
                icon: '@'
            },
            controller: LightButtonController,
            controllerAs: 'vm',
            bindToController: true,
            template: '<button class="button button-small" ng-class="{\'isOff\': vm.isOff(), \'isOn\': vm.isOn(), \'button-balanced\': vm.isTypeOn, \'button-assertive\': vm.isTypeOff}" ng-click="vm.execute()"> ' +
            '<i class="icon" ng-class="{\'ion-flash\': vm.isTypeOn, \'ion-flash-off\': vm.isTypeOff}" ng-if="!vm.executing"></i> ' +
            '<ion-spinner icon="android" class="loading-padding-top" ng-if="vm.executing"></ion-spinner> ' +
            '</button>'
        };

        function LightButtonController($scope) {
            var vm = this;

            vm.executing = false;

            vm.isOn = function () {
                return vm.device.state === 'on' && vm.type === 'on';
            };

            vm.isOff = function () {
                return vm.device.state === 'off' && vm.type === 'off';
            };

            vm.isTypeOn = vm.type == 'on';
            vm.isTypeOff = vm.type == 'off';

            vm.execute = function () {
                vm.executing = true;
                if (vm.isTypeOn) {
                    lightService.sendOn(vm.device.id)
                }

                if (vm.isTypeOff) {
                    lightService.sendOff(vm.device.id)
                }
            };

            $scope.$on('light-button-update', setNewState);

            function setNewState(evt, newState) {
                if (newState.device == vm.device.id) {
                    vm.device.state = newState.state;
                    vm.executing = false;
                }
            }
        }
    }
})(angular);
