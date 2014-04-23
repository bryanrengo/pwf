/// 
/// Directives
/// -------------------------------------------------------------------------------------------------------------------
/// <reference path="_references.ts" />

angular.module('app.directives', [])
    .directive('appVersion', [<any> 'version', function (version) {
        return function (scope, elm, attrs) {
            elm.text(version);
        };
    }])
    .directive("drawing", function () {
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
                if (event.offsetX !== undefined) {
                    lastX = event.offsetX;
                    lastY = event.offsetY;
                } else {
                    lastX = event.layerX - event.currentTarget.offsetLeft;
                    lastY = event.layerY - event.currentTarget.offsetTop;
                }

                // begins new line
                ctx.beginPath();

                drawing = true;
            });
            element.bind('mousemove', function (event) {
                var currentX;
                var currentY;

                if (drawing) {
                    // get current mouse position
                    if (event.offsetX !== undefined) {
                        currentX = event.offsetX;
                        currentY = event.offsetY;
                    } else {
                        currentX = event.layerX - event.currentTarget.offsetLeft;
                        currentY = event.layerY - event.currentTarget.offsetTop;
                    }

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

            function findPos(elem) {
                var curleft = 0;
                var curtop = 0;

                if (elem.offsetParent) {
                    do {
                        curleft += elem.offsetLeft;
                        curtop += elem.offsetTop;
                    } while (elem = elem.offsetParent);

                    return { left: curleft, top: curtop };
                }
            }
        }
    };
});