﻿_c = typeof (_c) == "undefined" ? {} : _c;

$(function () {
    $('#joinButton').attr('disabled', 'disabled');

    _c.canvas = $("#canvas")[0];//same as document.getElementById
    _c.ctx = canvas.getContext("2d");
    _c.last = {};
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
        _c.ctx.lineWidth = "1.0";
        _c.ctx.beginPath();
        _c.ctx.moveTo(x_from, y_from);
        _c.ctx.lineTo(x_to, y_to);
        _c.ctx.stroke();
    }

    _c.gameHub.client.drawSegments = function (segments) {
        for (var i = 0; i < segments.length; i++) {
            _c.ctx.lineWidth = "1.0";
            _c.ctx.beginPath();
            _c.ctx.moveTo(segments[i].x_from, segments[i].y_from);
            _c.ctx.lineTo(segments[i].x_to, segments[i].y_to);
            _c.ctx.stroke();
        }
    }

    _c.gameHub.client.clear = function () {
        clearCanvas();
    }

    _c.gameHub.client.messageFromServer = function (s) {
        console.log(s);
    }

    $("#clearButton").click(function () {
        clearCanvas();
        _c.gameHub.server.clear();
    });

    function clearCanvas() {
        _c.ctx.clearRect(0, 0, _c.canvas.width, _c.canvas.height);
    }

    $("#canvas").mouseup(function (e) {
        if (e.which === 1) _c.mouseclicked = false;
    });

    $("#canvas").mousedown(function (e) {
        if (e.which === 1) _c.mouseclicked = true;
        var parentOffset = $(this).parent().offset();
        _c.last.x = (e.pageX - parentOffset.left);
        _c.last.y = (e.pageY - parentOffset.top);
    });

    $("#canvas").mousemove(function (event) {
        if (_c.mouseclicked) {
            var parentOffset = $(this).parent().offset();
            var rx = (event.pageX - parentOffset.left);
            var ry = (event.pageY - parentOffset.top);

            _c.ctx.lineWidth = "1.0";
            _c.ctx.beginPath();
            _c.ctx.moveTo(_c.last.x, _c.last.y);
            _c.ctx.lineTo(rx, ry);
            _c.ctx.stroke();

            //_c.gameHub.server.drawSegment(_c.last.x, _c.last.y, rx, ry);
            pushSegment(_c.last.x, _c.last.y, rx, ry);
            _c.last.x = rx;
            _c.last.y = ry;
        }
    });

    function pushSegment(x_from, y_from, x_to, y_to) {
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