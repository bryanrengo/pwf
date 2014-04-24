(function () {
    'use strict';

    var controllerId = 'gameboardController';

    angular.module('pwfApp').controller(controllerId, ['$scope', 'signalRHubProxy', gameboardController]);

    function gameboardController($scope, signalRHubProxy) {
        var vm = this;
        var clientPushHub = signalRHubProxy('gameHub');

        // need to use $scope here because of the communication between directive
        $scope.setPosition = setPosition;
        clientPushHub.on('drawPoint', drawPoint);

        function setPosition(position) {
            $scope.position = position;
            clientPushHub.invoke('setPosition', function () {
            }, position);
        }

        function drawPoint(data) {
            $scope.position = data;

            // need to use $scope here because of the communication between directive
            $scope.drawPosition(data);
        }

        return vm;
    }
})();
//# sourceMappingURL=gameboardController.js.map
