///
/// Controllers
/// -------------------------------------------------------------------------------------------------------------------
/// <reference path="_references.ts" />
angular.module('app.controllers', []).controller('navController', [
    '$scope', '$location', function ($scope, $location) {
        $scope.isActive = function (location) {
            return location == $location.path();
        };
    }]).controller('homeController', [
    '$scope', '$window', 'signalRHubProxy', function ($scope, $window, signalRHubProxy) {
        $window.document.title = 'Home Controller Title';
        //var clientPushHub = signalRHubProxy('gameHub', { logging: true });
        //clientPushHub.on('heartBeat', function (data) {
        //    $scope.time = data;
        //});
    }]).controller('secondCtrl', [
    '$scope', '$window', function ($scope, $window) {
        $window.document.title = 'Second Controller Title';
    }]).controller('gameCtrl', [
    '$scope', function ($scope) {
        $scope.games = [];
    }]).controller('playerCtrl', [
    '$scope', function ($scope) {
        $scope.players = [];
    }]).controller('loginCtrl', [
    '$scope', '$window', function ($scope, $window) {
        $window.document.title = 'Login Controller';

        $scope.login = function (user) {
        };
    }]);
