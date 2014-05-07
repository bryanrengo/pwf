(function () {
    'use strict';

    var controllerId = 'mapController';

    angular.module('pwfApp').controller(controllerId, ['$scope', 'geolocation', mapController]);

    function mapController($scope, geolocation) {
        var vm = this;

        angular.extend($scope, {
            map: {
                control: {},
                center: {
                    latitude: 45,
                    longitude: -74
                },
                zoom: 10,
                refresh: function (center) {
                    $scope.map.control.refresh(center);
                },
                bounds: {},
                markers: []
            }
        });

        geolocation.getLocation().then(function (data) {
            $scope.map.control.visualRefresh = true;
            $scope.map.control.refresh({
                latitude: data.coords.latitude,
                longitude: data.coords.longitude
            });
        });

        $scope.$watch('map.bounds.northeast', function (oldVal, newVal) {
            if (!newVal)
                return;

            var topRight = $scope.map.bounds.northeast;
            var bottomLeft = $scope.map.bounds.southwest;

            var randLatitude = randomIntFromInterval(bottomLeft.latitude, topRight.latitude);
            var randLongitude = randomIntFromInterval(bottomLeft.longitude, topRight.longitude);

            $scope.map.markers.push({
                latitude: randLatitude,
                longitude: randLongitude
            });
        });
    }

    function randomIntFromInterval(min, max) {
        return Math.random() * (max - min + 1) + min;
    }
})();
//# sourceMappingURL=mapController.js.map
