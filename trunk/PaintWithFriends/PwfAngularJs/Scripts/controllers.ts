/// 
/// Controllers
/// -------------------------------------------------------------------------------------------------------------------
/// <reference path="_references.ts" />

angular.module('app.controllers', [])
    .controller('navController', [<any> '$scope', <any> '$location', function ($scope, $location) {
        $scope.isActive = function (location) {
            return location == $location.path();
        };
    }])
    .controller('homeController', [<any> '$scope', <any> '$window', <any> 'signalRHubProxy', function ($scope, $window, signalRHubProxy) {
        $window.document.title = 'Home Controller Title';
        //var clientPushHub = signalRHubProxy('gameHub', { logging: true });
        //clientPushHub.on('heartBeat', function (data) {
        //    $scope.time = data;
        //});
    }])
    .controller('secondCtrl', [<any> '$scope', <any> '$window', function ($scope, $window) {
        $window.document.title = 'Second Controller Title';
    }])
    .controller('gameCtrl', [<any> '$scope', function ($scope) {
        $scope.games = [];
    }])
    .controller('playerCtrl', [<any> '$scope', function ($scope) {
        $scope.players = [];
    }])
    .controller('loginCtrl', [<any> '$scope', <any> '$window', function ($scope, $window) {
        $window.document.title = 'Login Controller';

        $scope.login = function (user) {
        };
    }]);

