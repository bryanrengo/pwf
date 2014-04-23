///
/// Filters
/// -------------------------------------------------------------------------------------------------------------------
/// <reference path="_references.ts" />
angular.module('app.filters', []).filter('interpolate', [
    'version', function (version) {
        return function (text) {
            return String(text).replace(/\%VERSION\%/mg, version);
        };
    }]);
//# sourceMappingURL=filters.js.map
