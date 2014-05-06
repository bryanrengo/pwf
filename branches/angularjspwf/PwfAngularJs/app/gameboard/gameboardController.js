/// <reference path="../../scripts/_references.ts" />
(function () {
    'use strict';

    var controllerId = 'gameboardController';

    angular.module('pwfApp').controller(controllerId, ['$scope', '$timeout', '$interval', 'gameHubFactory', 'drawingApi', gameboardController]);

    function gameboardController($scope, $timeout, $interval, gameHubFactory, drawingApi) {
        var vm = this;

        gameHubFactory.subscribe('drawSegments', function (segments) {
            drawingApi.updateSegments(segments);
        });

        // this function fires every 50 milliseconds
        $interval(function () {
            if (drawingApi.segments && drawingApi.segments.length > 0) {
                gameHubFactory.execute('sendSegments', drawingApi.segments);
                drawingApi.segments = [];
            }
        }, 50);

        return vm;
    }
})();
//# sourceMappingURL=gameboardController.js.map
