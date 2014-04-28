/// <reference path="../../scripts/_references.ts" />

(function () {
    'use strict';

    var controllerId = 'gameboardController';

    angular.module('pwfApp').controller(controllerId, ['$scope', '$timeout', '$interval', 'Hub', gameboardController]);

    function gameboardController($scope, $timeout, $interval, Hub) {
        var vm = this;

        var hub = new Hub('gameHub',
            // client methods
            {
                'drawSegments': drawSegments
            },
            // server methods
            [
                'sendSegments'
            ]);

        $interval(function () {
            if ($scope.segments.length > 0) {
                hub.sendSegments($scope.segments);
                $scope.segments = [];
            }
        }, 50);

        function drawSegments(segments) {
            $scope.drawSegments(segments);
        }

        return vm;
    }
})();
