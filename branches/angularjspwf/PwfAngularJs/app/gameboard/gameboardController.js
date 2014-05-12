/// <reference path="../../scripts/_references.ts" />
(function () {
    'use strict';

    var controllerId = 'gameboardController';

    angular.module('pwfApp').controller(controllerId, ['$scope', '$timeout', '$interval', 'gameHubFactory', 'drawingApi', gameboardController]);

    function gameboardController($scope, $timeout, $interval, gameHubFactory, drawingApi) {
        var vm = this;
        vm.colors = [
            '#4bf',
            'blue',
            'yellow',
            'red',
            'purple',
            'black'
        ];

        //gamehub subscriptions
        gameHubFactory.subscribe('clearBoard', clearBoard);
        gameHubFactory.subscribe('drawSegments', updateSegments);
        gameHubFactory.subscribe('updateColor', updateColor);

        $interval(sendSegments, 50);
        $scope.$watch('vm.color', sendColor);
        vm.color = '#4bf';
        vm.clearBoard = sendClearBoard;

        function sendClearBoard() {
            gameHubFactory.execute('clearBoard');
        }

        function sendColor(newVal, oldVal) {
            gameHubFactory.execute('sendColor', newVal);
        }

        function sendSegments() {
            if (drawingApi.segments && drawingApi.segments.length > 0) {
                gameHubFactory.execute('sendSegments', drawingApi.segments);
                drawingApi.segments = [];
            }
        }

        function clearBoard() {
            drawingApi.clearBoard();
        }

        function updateColor(color) {
            drawingApi.color = color;
            vm.color = color;
        }

        function updateSegments(segments) {
            drawingApi.updateSegments(segments);
        }

        return vm;
    }
})();
//# sourceMappingURL=gameboardController.js.map
