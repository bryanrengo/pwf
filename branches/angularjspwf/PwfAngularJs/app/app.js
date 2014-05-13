///
/// AngularJS Modules
/// -------------------------------------------------------------------------------------------------------------------
/// <reference path="../scripts/_references.ts" />
// Declare app level module which depends on filters, and services
angular.module('pwfApp', ['pwfApp.filters', 'pwfApp.services', 'pwfApp.directives', 'ngRoute', 'google-maps', 'geolocation', 'ui.bootstrap']).config([
    '$locationProvider', '$routeProvider', '$httpProvider',
    function ($locationProvider, $routeProvider, $httpProvider) {
        $httpProvider.interceptors.push('authInterceptor');
        $locationProvider.html5Mode(true);
        $routeProvider.when('/', { templateUrl: 'app/main/mainView', controller: 'mainController', controllerAs: 'vm' }).when('/login', { templateUrl: 'app/login/loginview', controller: 'loginController' }).when('/chat', { templateUrl: 'app/chat/chatview', controller: 'chatController', controllerAs: 'vm' }).when('/game', { templateUrl: 'app/gameboard/gameboardview', controller: 'gameboardController', controllerAs: 'vm' }).when('/list', { templateUrl: 'app/gamelist/gamelistview', controller: 'gameListController' }).when('/map', { templateUrl: 'app/map/mapview', controller: 'mapController' }).otherwise({ redirectTo: '/' });
    }]);
//# sourceMappingURL=app.js.map
