/// <reference path="../../scripts/_references.ts" />
(function () {
    "use strict";

    var controllerId = "mainController";

    angular.module("pwfApp").controller(controllerId, ["$scope", "$modal", "$log", mainController]);

    function mainController($scope, $modal, $log) {
        var vm = this;

        // check local storage here
        $scope.userName = "";

        $scope.open = function () {
            var modalInstance = $modal.open({
                templateUrl: 'app/main/loginModalView',
                keyboard: false,
                backdrop: 'static',
                controller: ModalInstanceCtrl
            });

            modalInstance.result.then(function (user) {
                $log.info(user.name);
                $scope.user = user;
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

        // $scope.open();
        return vm;
    }

    var ModalInstanceCtrl = function ($scope, $modalInstance, gameHubFactory) {
        $scope.ok = function (user) {
            gameHubFactory.execute('playerExists', user.name, function (exists) {
                //if (!exists) {
                //    $modalInstance.close(user);
                //}
                $scope.userForm.user.name.$setValidity('unique', exists);
            });
        };
    };
})();
//# sourceMappingURL=mainController.js.map
