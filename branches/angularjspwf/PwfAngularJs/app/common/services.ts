/// 
/// Services
/// -------------------------------------------------------------------------------------------------------------------
/// <reference path="../../scripts/_references.ts" />
// Demonstrate how to register services. In this case it is a simple value service.

angular.module('pwfApp.services', [])
    .constant('$', $)
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
    })
    .factory('signalRHub', ['$', '$q', function ($, $q) {
        return function (hubName) {

            var Hub = this;
            Hub.isConnected = false;
            Hub.connection = $.hubConnection();
            Hub.connection.logging = true;
            Hub.proxy = Hub.connection.createHubProxy(hubName);
            // for whatever reason, the hub must have at least one subscription added before the connection.start() is called
            Hub.proxy.on('eventForDeferredSubscription', function () { });

            Hub.connect = function () {
                var deferred = $q.defer();

                Hub.connection.start()
                    .done(function () {
                        deferred.resolve();
                    })
                    .fail(function () {
                        deferred.reject();
                    });

                return deferred.promise;
            }

            Hub.subscribe = function (event, fn) {
                Hub.proxy.on(event, fn);

                if (Hub.connection.state != 1) {
                    Hub.connect();
                }
            };

            Hub.execute = function (method, args, fn) {
                if (Hub.connection.state != 1) {
                    Hub.connect()
                        .then(function () {
                            execute(method, args, fn);
                        });
                }
                else {
                    execute(method, args, fn);
                }

                function execute(method, args, fn) {
                    if (fn && args) {
                        Hub.proxy.invoke(method, args).done(fn);
                    }
                    else if (fn && !args) {
                        Hub.proxy.invoke(method).done(fn);
                    }
                    else if (!fn && args) {
                        Hub.proxy.invoke(method, args);
                    }
                    else if (!fn && !args) {
                        Hub.proxy.invoke(method);
                    }
                }
            };

            return Hub;
        };
    }])
    .service('gameHubFactory', ['signalRHub', function (signalRHub) {
        return new signalRHub('gameHub');
    }])
    .factory('drawingApi', function () {
        var callback;
        var segments = [];
        var segmentHistory = [];

        function drawSegments(callback) {
            this.callback = callback;
        }

        function updateSegments(segments) {
            if (this.callback) {
                this.callback(segments);
                this.segmentHistory = this.segmentHistory.concat(segments);
                this.segments = [];
            }
        }

        return {
            segments: segments,
            segmentHistory: segmentHistory,
            updateSegments: updateSegments,
            drawSegments: drawSegments
        }
    });