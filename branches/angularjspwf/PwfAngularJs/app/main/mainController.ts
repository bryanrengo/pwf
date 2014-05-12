/// <reference path="../../scripts/_references.ts" />

(function () {
    "use strict";

    var controllerId = "mainController";

    angular.module("pwfApp").controller(controllerId, ["$scope", mainController]);

    function mainController($scope) {
        var vm = this;
    }
})();
 