/// <reference path="../../scripts/_references.ts" />
(function () {
    'use strict';

    var controllerId = 'chatController';

    angular.module('pwfApp').controller(controllerId, ['$scope', 'gameHubFactory', chatController]);

    function chatController($scope, gameHubFactory) {
        var vm = this;

        gameHubFactory.subscribe('playerJoined', playerJoined);

        gameHubFactory.subscribe('messageSent', messageSent);

        vm.players = [];

        vm.messages = [];

        vm.join = join;

        function messageSent(message) {
            vm.messages.push(message);
        }

        function sendMessage(message) {
            gameHubFactory.execute('sendMessage', message);
        }

        function join(userName) {
            gameHubFactory.execute('join', userName, playerJoinedCallback);
        }

        function playerJoinedCallback(player) {
            vm.player = player;
        }
        ;

        function playerJoined(player) {
            vm.players.push(player);
        }
    }
})();
//# sourceMappingURL=chatController.js.map
