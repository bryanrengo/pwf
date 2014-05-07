(function () {
    'use strict';

    var controllerId = 'mapController';
    
    angular.module('pwfApp').controller(controllerId,
        ['$scope', 'geolocation', mapController]);

    function mapController($scope, geolocation) {
        var vm = this;

        $scope.map = {
            center: {
                latitude: 45,
                longitude: -75
            },
            zoom: 10
        };

        geolocation.getLocation().then(function (data) {
            $scope.map = {
                center: {
                    latitude: data.coords.latitude,
                    longitude: data.coords.longitude
                },
                zoom: 10
            };
        });
    }
})();
