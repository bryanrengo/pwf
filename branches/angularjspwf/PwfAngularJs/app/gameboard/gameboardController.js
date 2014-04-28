/// <reference path="../../scripts/_references.ts" />
(function () {
    'use strict';

    var controllerId = 'gameboardController';

    angular.module('pwfApp').controller(controllerId, ['$scope', '$timeout', '$interval', 'Hub', gameboardController]);

    function gameboardController($scope, $timeout, $interval, Hub) {
        var vm = this;

        var hub = new Hub('gameHub', // client methods
        {
            'drawSegments': drawSegments
        }, [
            'sendSegments'
        ]);

        // this function fires every 50 milliseconds
        $interval(function () {
            if ($scope.segments.length > 0) {
                hub.sendSegments($scope.segments);
                $scope.segments = [];
            }
        }, 50);

        // this function will fire when the server sends segments
        function drawSegments(segments) {
            $scope.drawSegments(segments);
            $scope.segmentHistory = $scope.segmentHistory.concat(segments);
            $scope.segments = [];
        }

        return vm;
    }
})();
//# sourceMappingURL=gameboardController.js.map
