/// <reference path="../../scripts/_references.ts" />

(function () {
    'use strict';

    var controllerId = 'chatController';

    angular.module('pwfApp').controller(controllerId, ['$scope', chatController]);

    function chatController($scope) {
        var vm = this;

        vm.activate = activate;
        vm.title = 'chatController';

        function activate() { }
    }
})();
