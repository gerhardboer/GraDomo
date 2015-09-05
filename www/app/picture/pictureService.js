(function (angular) {
    angular.module('GraDomo')
        .service('pictureService', service);

    service.$inject = ['$q'];

    function service($q) {

      this.getLatestPicture = getLatestPicture;

      function getLatestPicture() {
        return $q.when({
          url: '/img/ionic.png',
          date: '05-09-2015 12:00:00'
        });
      }
    }

})(angular);
