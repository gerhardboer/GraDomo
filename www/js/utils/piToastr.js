(function(angular) {

  angular.module('GraDomo')
    .factory('piToastr', PiToastr);

  PiToastr.$inject = ['toastr'];

  function PiToastr(toastr) {
    return function(type, message) {
      showToast(type, message);
    };

    function showToast(type, message) {
      if(type === 'warning') {
        show(toastr.warning, message);
      }

      if(type === 'info') {
        show(toastr.info, message);
      }

      if(type === 'error') {
        show(toastr.error, message);
      }

      if(type === 'success') {
        show(toastr.success, message);
      }
    }

    function show(toastrFn, message) {
      toastrFn(message, {timeOut: 750});
    }
  }
})(angular);
