angular.module('SignalR', [])
.constant('$', $)
.factory('Hub', ['$', '$q', function ($, $q) {
    return function (hubName, listeners, methods) {
        var deferred = $q.defer();

        var Hub = this;
        Hub.connection = $.hubConnection();
        Hub.connection.logging = true;
        Hub.proxy = Hub.connection.createHubProxy(hubName);
        Hub.proxy.on('requiredToFunction', function () { });
        Hub.connection.start()
            .done(function () {
                deferred.resolve(Hub);
            })
            .fail(function () {
                deferred.reject(Hub);
            });

        Hub.on = function (event, fn) {
            Hub.proxy.on(event, fn);
        };

        Hub.invoke = function (method, args) {
            return Hub.proxy.invoke.apply(Hub.proxy, arguments)
        };

        if (listeners) {
            angular.forEach(listeners, function (fn, event) {
                Hub.on(event, fn);
            });
        }

        if (methods) {
            angular.forEach(methods, function (method) {
                Hub[method] = function () {
                    var args = $.makeArray(arguments);
                    args.unshift(method);
                    return Hub.invoke.apply(Hub, args);
                };
            });
        }

        return deferred.promise;
    };
}]);