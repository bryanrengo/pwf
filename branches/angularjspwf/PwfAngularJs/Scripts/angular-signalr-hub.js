angular.module('SignalR', [])
.constant('$', $)
.factory('Hub', ['$', '$q', function ($, $q) {
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

            if (!Hub.connection.state != 1) {
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
}]);