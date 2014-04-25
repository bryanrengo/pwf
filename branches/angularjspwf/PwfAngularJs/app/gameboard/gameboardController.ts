/// <reference path="../../scripts/_references.ts" />

(function () {
    'use strict';

    var controllerId = 'gameboardController';

    angular.module('pwfApp').controller(controllerId, ['$scope', 'Hub', gameboardController]);

    function gameboardController($scope, Hub) {
        var vm = this;

        var hub = new Hub('gameHub', {
            'drawPoint': drawPoint
        },
            //Server method stubs for ease of access
            ['setPosition']
            );

        $scope.setPosition = setPosition;

        function setPosition(position) {
            $scope.position = position;
            hub.setPosition(position);
        }

        function drawPoint(data) {
            $scope.position = data;
            // need to use $scope here because of the communication between directive
            $scope.drawPosition(data);
        }

        return vm;
    }
})();
