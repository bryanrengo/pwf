'use strict';

// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('app.services', ['ngResource'])
    .factory('loginApi', function($resource) {
        var resource = $resource('/api/login/');
        return {
            get: function () {
                return resource.get();
            }
        }
    });
