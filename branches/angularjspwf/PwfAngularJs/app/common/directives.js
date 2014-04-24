///
/// Directives
/// -------------------------------------------------------------------------------------------------------------------
/// <reference path="../../scripts/_references.ts" />
angular.module('pwfApp.directives', []).directive('appVersion', [
    'version', function (version) {
        return function (scope, elm, attrs) {
            elm.text(version);
        };
    }]).directive("drawing", function () {
    return {
        restrict: "E",
        replace: 'true',
        template: '<canvas></canvas>',
        link: function (scope, element) {
            var canvas = element[0];
            var ctx = canvas.getContext('2d');
            var parentDiv = element.parent()[0];
            canvas.width = parentDiv.scrollWidth;
            canvas.height = parentDiv.scrollHeight;

            // variable that decides if something should be drawn on mousemove
            var drawing = false;

            // the last coordinates before the current move
            var lastX;
            var lastY;

            scope.drawPosition = function (data) {
                console.log('draw position fired', data.left, data.top);

                if (lastX && lastY) {
                    ctx.beginPath();

                    draw(lastX, lastY, data.left, data.top);
                }

                lastX = data.left;
                lastY = data.top;
            };

            element.bind('mousedown', function (event) {
                var position = getCoords(event, canvas);
                lastX = position.x;
                lastY = position.y;

                // begins new line
                ctx.beginPath();

                drawing = true;
            });
            element.bind('mousemove', function (event) {
                var currentX;
                var currentY;

                if (drawing) {
                    // get current mouse position
                    var position = getCoords(event, canvas);
                    currentX = position.x;
                    currentY = position.y;

                    draw(lastX, lastY, currentX, currentY);

                    scope.$apply(function () {
                        scope.setPosition({ isDrawing: true, left: currentX, top: currentY });
                    });

                    // set current coordinates to last one
                    lastX = currentX;
                    lastY = currentY;
                }
            });
            element.bind('mouseup', function (event) {
                // stop drawing
                drawing = false;
            });

            // canvas reset
            function reset() {
                element[0].width = element[0].width;
            }

            function draw(lX, lY, cX, cY) {
                // line from
                ctx.moveTo(lX, lY);

                // to
                ctx.lineTo(cX, cY);

                // color
                ctx.strokeStyle = "#4bf";

                // draw it
                ctx.stroke();
            }

            // Get the coordinates crossbrowser for a mouse or touch event
            function getCoords(e, canvas) {
                if (e.offsetX) {
                    // Works in Chrome / Safari (except on iPad/iPhone)
                    return { x: e.offsetX, y: e.offsetY };
                } else if (e.layerX) {
                    // Works in Firefox
                    return { x: e.layerX, y: e.layerY };
                } else {
                    // Works in Safari on iPad/iPhone
                    var pos = findPos(canvas);
                    return { x: e.pageX - pos.left, y: e.pageY - pos.top };
                }
            }

            function findPos(elem) {
                var curleft = 0;
                var curtop = 0;

                if (elem.offsetParent) {
                    do {
                        curleft += elem.offsetLeft;
                        curtop += elem.offsetTop;
                    } while(elem = elem.offsetParent);

                    return { left: curleft, top: curtop };
                }
            }
        }
    };
});
//# sourceMappingURL=directives.js.map
