///
/// Services
/// -------------------------------------------------------------------------------------------------------------------
/// <reference path="_references.ts" />
// Demonstrate how to register services. In this case it is a simple value service.
angular.module('app.services', []).value('version', '0.1').factory('authInterceptor', function ($window, $q) {
    return {
        request: function (config) {
            config.headers = config.headers || {};
            if ($window.sessionStorage.getItem('token')) {
                config.headers.Authorization = 'Bearer ' + $window.sessionStorage.getItem('token');
            }
            return config || $q.when(config);
        },
        response: function (response) {
            if (response.status === 401) {
                //TODO: redirect to login
            }
            return response || $q.when(response);
        }
    };
});
