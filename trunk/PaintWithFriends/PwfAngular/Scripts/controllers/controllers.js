'use strict';

angular.module('app.controllers', [])

    // Path: /about
    .controller('AboutCtrl', ['$scope', '$location', '$window', function ($scope, $location, $window) {
        $scope.$root.title = 'Paint With Friends | About';
    }])

    // Path: /error/404
    .controller('Error404Ctrl', ['$scope', '$location', '$window', function ($scope, $location, $window) {
        $scope.$root.title = 'Paint With Friends | Page Not Found';
    }])

    // Path: /
    .controller('HomeCtrl', ['$scope', '$location', '$window', function ($scope, $location, $window) {
        $scope.$root.title = 'Paint With Friends';
    }])

    // Path: /login
    .controller('LoginCtrl', ['$scope', '$location', '$window', 'loginApi', function ($scope, $location, $window, loginApi) {
        $scope.$root.title = 'Paint With Friends | Sign In';
        // TODO: Authorize a user
        $scope.login = function () {

            loginApi.get();

            $location.path('/');
            return false;
        };
    }]);

