(function () {
    "use strict";

    var controllerId = "mapController";

    angular.module("pwfApp").controller(controllerId,
        ["$scope", "geolocation", mapController]);

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
                markers: [],
                options: {
                    disableDefaultUI: true,
                    styles: [
                        {
                            stylers: [
                                { hue: "#890000" },
                                { visibility: "simplified" },
                                { gamma: 0.5 },
                                { weight: 0.5 }
                            ]
                        },
                        {
                            elementType: "labels",
                            stylers: [
                                { visibility: "off" }
                            ]
                        },
                        {
                            featureType: "water",
                            stylers: [
                                { color: "#890000" }
                            ]
                        }
                    ]
                }
            }
        });

        geolocation.getLocation().then(function (data) {
            $scope.map.control.visualRefresh = true;
            $scope.map.control.refresh(
                {
                    latitude: data.coords.latitude,
                    longitude: data.coords.longitude
                });
        });

        $scope.$watch("map.bounds", function (newVal, oldVal) {
            if (!newVal.northeast && !newVal.southwest) return;

            var northeast = newVal.northeast;
            var southwest = newVal.southwest;

            var randLatitude = randomDecimalBetween(
                southwest.latitude,
                northeast.latitude);

            var randLongitude = randomDecimalBetween(
                northeast.longitude,
                southwest.longitude);

            $scope.map.markers.push({
                latitude: randLatitude,
                longitude: randLongitude
            });
        }, true);
    }

    function randomDecimalBetween(min, max) {
        return Math.random() * (max - min) + min;
    }
})();
