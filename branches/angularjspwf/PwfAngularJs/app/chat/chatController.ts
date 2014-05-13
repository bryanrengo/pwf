/// <reference path="../../scripts/_references.ts" />

(function () {
    'use strict';

    var controllerId = 'chatController';

    angular.module('pwfApp').controller(controllerId, ['$scope', 'gameHubFactory', chatController]);

    function chatController($scope, gameHubFactory) {
        var vm = this;

        gameHubFactory.subscribe('playerJoined', playerJoined);

        gameHubFactory.subscribe('messageSent', messageSent);

        vm.model = {
            players: [],
            messages: [],
            message: '',
            sendMessage: sendMessage
        };

        function messageSent(message) {
            vm.model.messages.push(message);
            $scope.$apply();
        }

        function sendMessage() {
            gameHubFactory.execute('sendMessage', vm.model.message, function () {
                vm.model.message = '';
            });
        }

        function playerJoined(player) {
            vm.model.players.push(player);
        }
    }
})();
