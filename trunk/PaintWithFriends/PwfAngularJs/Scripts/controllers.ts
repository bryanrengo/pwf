/// 
/// Controllers
/// -------------------------------------------------------------------------------------------------------------------
/// <reference path="_references.ts" />

angular.module('app.controllers', [])
    .controller('navController', [<any> '$scope', <any> '$location', <any> 'signalRHubProxy',
        function ($scope, $location, signalRHubProxy) {
            $scope.isActive = function (location) {
                return location == $location.path();
            };
        }])
    .controller('homeController', [<any> '$scope', <any> '$window',
        function ($scope, $window) {
            $window.document.title = 'Home Controller Title';
        }])
    .controller('secondCtrl', [<any> '$scope', <any> '$window',
        function ($scope, $window) {
            $window.document.title = 'Second Controller Title';
        }])
    .controller('gameCtrl', [<any> '$scope',
        function ($scope) {
            $scope.games = [];
        }])
    .controller('gameBoardController', [<any> '$scope', <any> 'signalRHubProxy',
        function ($scope, signalRHubProxy) {
            var clientPushHub = signalRHubProxy('gameHub');

            $scope.setPosition = function (position) {
                $scope.position = position;
                clientPushHub.invoke('setPosition', function () { }, position);
            };

            clientPushHub.on('drawPoint', function (data) {
                $scope.position = data;
                $scope.drawPosition(data);
            });
        }])
    .controller('playerCtrl', [<any> '$scope',
        function ($scope) {
            $scope.players = [];
        }])
    .controller('loginCtrl', [<any> '$scope', <any> '$window',
        function ($scope, $window) {
            $window.document.title = 'Login Controller';

            $scope.login = function (user) {
            };
        }]);

