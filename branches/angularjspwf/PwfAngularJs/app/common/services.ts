/// 
/// Services
/// -------------------------------------------------------------------------------------------------------------------
/// <reference path="../../scripts/_references.ts" />
// Demonstrate how to register services. In this case it is a simple value service.

angular.module('pwfApp.services', [])
    .value('version', '0.1')
    .factory('authInterceptor', function ($window: any, $q: any) {
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
    //.value('$', $)
    //.factory('signalRHubProxy', ['$', '$rootScope', function ($, $rootScope) {
    //    function signalRProxyFactory(hubName, startOptions) {
    //        // slightly modified http://henriquat.re/server-integration/signalr/integrateWithSignalRHubs.html
    //        //$.connection.hub.logging = true;
    //        var connection = $.hubConnection();
    //        //connection.logging = true;
    //        var proxy = connection.createHubProxy(hubName);

    //        proxy.on('requiredToFunction', function () { });

    //        connection.start(startOptions)
    //            .done(function () { console.log('started'); });


    //        var proxyConnection = {
    //            on: function (eventName, callback) {
    //                proxy.on(eventName, function (result) {
    //                    $rootScope.$apply(function () {
    //                        if (callback) {
    //                            callback(result);
    //                        }
    //                    });
    //                });
    //            },
    //            off: function (eventName, callback) {
    //                proxy.off(eventName, function (result) {
    //                    $rootScope.$apply(function () {
    //                        if (callback) {
    //                            callback(result);
    //                        }
    //                    });
    //                });
    //            },
    //            invoke: function (methodName, callback, arg) {
    //                proxy.invoke(methodName, arg)
    //                    .done(function (result) {
    //                        $rootScope.$apply(function () {
    //                            if (callback) {
    //                                callback(result);
    //                            }
    //                        });
    //                    });
    //            },
    //            connection: connection
    //        };

    //        return proxyConnection;
    //    }

    //    return signalRProxyFactory;
    //}]);