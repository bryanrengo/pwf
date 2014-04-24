///
/// Filters
/// -------------------------------------------------------------------------------------------------------------------
/// <reference path="../scripts/_references.ts" />
angular.module('pwfApp.filters', []).filter('interpolate', [
    'version', function (version) {
        return function (text) {
            return String(text).replace(/\%VERSION\%/mg, version);
        };
    }]);
//# sourceMappingURL=filters.js.map
