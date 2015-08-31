/**
 * Created by gerhardboer on 27/08/15.
 */
(function (angular) {
  angular.module('GraDomo')
    .controller('viewCtrl', ViewCtrl);

  ViewCtrl.$inject = ['$scope', '$timeout', 'lightService', 'toastr'];

  function ViewCtrl($scope, $timeout, lightService, toastr) {
    var vm = this;

    this.reloadConfig = getConfig;
    this.isDevice = isDevice;

    $scope.$on('websocketOpened', websocketOpened);
    $scope.$on('websocketClosed', websocketClosed);
    $scope.$on('websocketError', websocketError);

    (function init() {
      getConfig();
    })();

    function getConfig() {
      lightService.getConfig()
        .then(showConfig)
    }

    function showConfig(config) {
      showConfigLoaded();
      vm.config = config;
    }

    function isDevice(device) {
      return angular.isObject(device);
    }

    function websocketOpened() {
      showToast(toastr.info, 'Websocket connected');
    }

    function websocketClosed() {
      showToast(toastr.info, 'Websocket closed');
    }

    function websocketError() {
      showToast(toastr.error, 'Websocket error');
    }

    function showConfigLoaded() {
      showToast(toastr.info, 'Config loaded')
    }

    function showToast(toastrFn, message) {
      toastrFn(message, {timeOut: 500});
    }

  }
})(angular);
