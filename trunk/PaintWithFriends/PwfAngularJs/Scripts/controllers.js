///
/// Controllers
/// -------------------------------------------------------------------------------------------------------------------
/// <reference path="_references.ts" />
angular.module('app.controllers', []).controller('navController', [
    '$scope', '$location', 'signalRHubProxy',
    function ($scope, $location, signalRHubProxy) {
        $scope.isActive = function (location) {
            return location == $location.path();
        };
    }]).controller('homeController', [
    '$scope', '$window',
    function ($scope, $window) {
        $window.document.title = 'Home Controller Title';
    }]).controller('secondCtrl', [
    '$scope', '$window',
    function ($scope, $window) {
        $window.document.title = 'Second Controller Title';
    }]).controller('gameCtrl', [
    '$scope',
    function ($scope) {
        $scope.games = [];
    }]).controller('gameBoardController', [
    '$scope', 'signalRHubProxy',
    function ($scope, signalRHubProxy) {
        var clientPushHub = signalRHubProxy('gameHub');

        $scope.setPosition = function (position) {
            $scope.position = position;
            clientPushHub.invoke('setPosition', function () {
            }, position);
        };

        clientPushHub.on('drawPoint', function (data) {
            $scope.position = data;
            $scope.drawPosition(data);
        });
    }]).controller('playerCtrl', [
    '$scope',
    function ($scope) {
        $scope.players = [];
    }]).controller('loginCtrl', [
    '$scope', '$window',
    function ($scope, $window) {
        $window.document.title = 'Login Controller';

        $scope.login = function (user) {
        };
    }]);
//# sourceMappingURL=controllers.js.map
