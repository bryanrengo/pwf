///
/// AngularJS Modules
/// -------------------------------------------------------------------------------------------------------------------
/// <reference path="../scripts/_references.ts" />
// Declare app level module which depends on filters, and services
angular.module('pwfApp', ['pwfApp.filters', 'pwfApp.services', 'pwfApp.directives', 'ngRoute']).config([
    '$locationProvider', '$routeProvider', '$httpProvider',
    function ($locationProvider, $routeProvider, $httpProvider) {
        $httpProvider.interceptors.push('authInterceptor');
        $locationProvider.html5Mode(true);
        $routeProvider.when('/', { templateUrl: 'app/gameboard/gameboardview', controller: 'gameboardController' }).when('/login', { templateUrl: 'app/login/loginview', controller: 'loginController' }).otherwise({ redirectTo: '/' });
    }]);
//# sourceMappingURL=app.js.map
