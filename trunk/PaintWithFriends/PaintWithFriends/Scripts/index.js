_c = typeof (_c) == "undefined" ? {} : _c;

$(function () {
    $('#joinButton').attr('disabled', 'disabled');

    _c.canvasElement = $("#canvas")[0];//same as document.getElementById
    _c.canvas = canvasElement.getContext("2d");
    _c.lastPoint = {};
    _c.gameHub = $.connection.gameHub;
    _c.segments = [];

    setInterval(function () { doSegmentPush() }, 50);

    $.connection.hub.start().done(function () {
        $('#joinButton').removeAttr('disabled');
    });

    $('#joinButton').click(function () {
        var playerName = $('#playerText').val();

        _c.player = playerName;

        _c.gameHub.server.join(playerName).done(function (isPlayer) {
            if (isPlayer) {
                $('#joinButton').attr('disabled', 'disabled');
                $('#playerText').attr('disabled', 'disabled');
            }
        })
    });

    _c.gameHub.client.drawSegment = function (x_from, y_from, x_to, y_to) {
        _c.canvas.lineWidth = "1.0";
        _c.canvas.beginPath();
        _c.canvas.moveTo(x_from, y_from);
        _c.canvas.lineTo(x_to, y_to);
        _c.canvas.stroke();
    }

    _c.gameHub.client.drawSegments = function (segments) {
        for (var i = 0; i < segments.length; i++) {
            _c.canvas.lineWidth = "1.0";
            _c.canvas.beginPath();
            _c.canvas.moveTo(segments[i].x_from, segments[i].y_from);
            _c.canvas.lineTo(segments[i].x_to, segments[i].y_to);
            _c.canvas.stroke();
        }
    }

    _c.gameHub.client.clear = function () {
        clearCanvas();
    }

    _c.gameHub.client.messageFromServer = function (s) {
        console.log(s);
    }

    _c.gameHub.client.enableDrawing = function () {
        _c.canvas.mouseup(function (e) {
            mouseup_drawaction(e);
        });
        _c.canvas.mousedown(function (e) {
            mousedown_drawaction(e);
        });
        _c.canvas.mousemove(function (e) {
            mousemove_drawaction(e);
        });
        $("#clearButton").removeAttr('disabled');
        _c.canvas.css('cursor', 'crosshair');
    }

    _c.gameHub.client.disableDrawing = function () {
        _c.canvas.unbind('mouseup');
        _c.canvas.unbind('mousedown');
        _c.canvas.unbind('mousemove');
        $("#clearButton").attr('disabled', 'disabled');
        _c.canvas.css('cursor', 'pointer');
    }

    $("#clearButton").click(function () {
        clearCanvas();
        _c.gameHub.server.clear();
    });

    function clearCanvas() {
        _c.canvas.clearRect(0, 0, _c.canvas.width, _c.canvas.height);
    }

    function mouseup_drawaction(e) {
        if (e.which === 1) _c.mouseclicked = false;
    }

    function mousedown_drawaction(e) {
        if (e.which === 1) _c.mouseclicked = true;
        var parentOffset = $(this).parent().offset();
        _c.lastPoint.x = (e.pageX - parentOffset.left);
        _c.lastPoint.y = (e.pageY - parentOffset.top);
    }

    function mousemove_drawaction(e) {
        if (_c.mouseclicked) {
            var parentOffset = $(this).parent().offset();
            var rx = (e.pageX - parentOffset.left);
            var ry = (e.pageY - parentOffset.top);

            _c.canvas.lineWidth = "1.0";
            _c.canvas.beginPath();
            _c.canvas.moveTo(_c.lastPoint.x, _c.lastPoint.y);
            _c.canvas.lineTo(rx, ry);
            _c.canvas.stroke();

            addSegment(_c.lastPoint.x, _c.lastPoint.y, rx, ry);

            _c.lastPoint.x = rx;
            _c.lastPoint.y = ry;
        }
    }

    function addSegment(x_from, y_from, x_to, y_to) {
        var seg = {};
        seg.x_from = x_from;
        seg.y_from = y_from;
        seg.x_to = x_to;
        seg.y_to = y_to;
        _c.segments.push(seg);
    }

    function doSegmentPush() {
        if (_c.segments.length > 0) {
            _c.gameHub.server.pushSegmentArray(_c.segments);
            _c.segments = [];
        }
    }

});