(function () {
    'use strict';

    var controllerId = 'gameListController';

    // TODO: replace app with your module name
    angular.module('pwfApp').controller(controllerId, ['$scope', 'Hub', gameListController]);

    function gameListController($scope, Hub) {
        var vm = this;
        $scope.games = [];

        var hubPromise = new Hub('gameHub', // client methods
        {}, [
            'getGames'
        ]);

        hubPromise.then(function (Hub) {
            var getGames = Hub.getGames();

            getGames.done(function (games) {
                $scope.$apply(function () {
                    $scope.games = games;
                });
            });
        });
    }
})();
//# sourceMappingURL=gameListController.js.map
