/// <reference path="../../scripts/_references.ts" />
(function () {
    'use strict';

    var controllerId = 'chatController';

    angular.module('pwfApp').controller(controllerId, ['$scope', 'gameHubFactory', chatController]);

    function chatController($scope, gameHubFactory) {
        var vm = this;
        vm.players = [];

        gameHubFactory.subscribe('playerJoined', function (player) {
            vm.players.push(player);
        });

        vm.join = function (userName) {
            gameHubFactory.execute('join', userName, function (player) {
                vm.player = player;
            });
        };
    }
})();
//# sourceMappingURL=chatController.js.map
