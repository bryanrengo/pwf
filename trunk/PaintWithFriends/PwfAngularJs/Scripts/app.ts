/// 
/// AngularJS Modules
/// -------------------------------------------------------------------------------------------------------------------
/// <reference path="_references.ts" />
// Declare app level module which depends on filters, and services
angular.module('app', ['app.filters', 'app.services', 'app.directives', 'app.controllers', 'ngRoute'])
    .config([<any> '$locationProvider', '$routeProvider', '$httpProvider', function ($locationProvider: any, $routeProvider: any, $httpProvider: any) {
        $httpProvider.interceptors.push('authInterceptor');
        $locationProvider.html5Mode(true);
        $routeProvider
            .when('/', { templateUrl: 'views/homeview', controller: 'homeController' })
            .when('/view2', { templateUrl: 'views/view2', controller: 'secondCtrl' })
            .when('/login', { templateUrl: 'views/loginview', controller: 'loginCtrl' })
            .otherwise({ redirectTo: '/' });
    }]);