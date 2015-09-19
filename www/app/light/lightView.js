/**
 * Created by gerhardboer on 27/08/15.
 */
(function (angular) {
    angular.module('GraDomo')
        .controller('LightView', LightView);

    LightView.$inject = ['$scope', 'lightService', 'piToastr'];

    function LightView($scope, lightService, piToastr) {
        var vm = this;

        $scope.$on('light-gui', showGUI);
        $scope.$on('light-update', showNewState);

        $scope.$on('$ionicView.beforeEnter', beforeEnter);
        $scope.$on('$ionicView.beforeLeave', beforeLeave);


        function showNewState(evt, newState) {
            $scope.$broadcast('light-button-update', newState);

            piToastr('success', newState.device + ': ' + newState.state);
        }

        function init() {
            lightService.openSocket(onClose)
                .then(getGUI);

            piToastr('info', 'Opening light socket')
        }

        function onClose(evt) {
            piToastr('info', evt.reason)
        }

        function beforeEnter() {
            piToastr('info', 'light - $ionicView.beforeEnter');
            init();
        }

        function beforeLeave() {
            piToastr('info', 'light - $ionicView.beforeLeave');

            lightService.closeSocket();
        }


        function getGUI() {
            lightService.requestGUI();

            piToastr('info', 'Getting UI');

        }

        function showGUI(evt, gui) {
            vm.gui = transformGUI(gui);

            piToastr('info', 'UI loaded');
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
