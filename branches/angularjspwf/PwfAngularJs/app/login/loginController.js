/// <reference path="../../scripts/_references.ts" />
(function () {
    "use strict";

    var controllerId = "loginController";

    angular.module("pwfApp").controller(controllerId, ["$scope", loginController]);

    function loginController($scope) {
        var vm = this;

        vm.login = login;
        vm.title = "loginController";

        function login(user) {
        }
    }
})();
//# sourceMappingURL=loginController.js.map
