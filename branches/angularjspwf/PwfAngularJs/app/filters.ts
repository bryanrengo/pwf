/// 
/// Filters
/// -------------------------------------------------------------------------------------------------------------------
/// <reference path="../scripts/_references.ts" />

angular.module('pwfApp.filters', [])
    .filter('interpolate', [<any> 'version', function (version) {
        return function (text) {
            return String(text).replace(/\%VERSION\%/mg, version);
        }
    }]);