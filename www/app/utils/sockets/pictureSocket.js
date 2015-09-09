(function (angular) {
    angular.module('GraDomo')
        .service('pictureSocket', service);

    service.$inject = ['piWebsocket'];

    function service() {
      this.socket = piWebsocket('picture')
    }

})(angular);
