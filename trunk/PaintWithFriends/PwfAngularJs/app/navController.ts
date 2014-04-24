(function () {
    'use strict';

    var controllerId = 'navController';

    angular.module('pwfApp').controller(controllerId, ['$scope', '$location', navController]);

    function navController($scope, $location) {
        var vm = this;

        vm.isActive = isActive;

        function isActive(location) {
            return location == $location.path();
        }
    }
})();
