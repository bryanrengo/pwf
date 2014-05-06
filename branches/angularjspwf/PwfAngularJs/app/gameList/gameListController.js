(function () {
    'use strict';

    var controllerId = 'gameListController';

    angular.module('pwfApp').controller(controllerId, ['$scope', 'gameHubFactory', gameListController]);

    function gameListController($scope, gameHubFactory) {
        var vm = this;

        gameHubFactory.execute('getGames', null, function (result) {
            $scope.games = result;
            $scope.$apply();
        });
    }
})();
//# sourceMappingURL=gameListController.js.map
