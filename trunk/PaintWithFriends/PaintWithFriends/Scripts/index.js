_c = typeof (_c) == "undefined" ? {} : _c;

$(function () {
    $('#joinButton').attr('disabled', 'disabled');
    $('#startButton').attr('disabled', 'disabled');

    _c.canvas = $("#canvas");
    _c.canvasElement = _c.canvas[0];//same as document.getElementById
    _c.canvasContext = _c.canvasElement.getContext("2d");
    _c.lastPoint = {};
    _c.gameHub = $.connection.gameHub;
    _c.segments = [];
    _c.playerId = "";

    setInterval(function () { doSegmentPush() }, 50);

    $.connection.hub.start().done(function () {
        $('#joinButton').removeAttr('disabled');
    });

    $('#joinButton').click(function () {
        var playerName = $('#playerText').val();

        _c.player = playerName;

        _c.gameHub.server.join(playerName).done(function (isPlayer) {
            if (isPlayer) {
                _c.playerId = _c.gameHub.state.playerId;
                $('#joinButton').attr('disabled', 'disabled');
                $('#playerText').attr('disabled', 'disabled');
            }
        })
    });

    $('#startButton').click(function () {
        _c.gameHub.server.start();
    });

    $('#guessButton').click(function () {
        var guess = $('#guessText').val();
        _c.gameHub.server.guess(guess);
    });

    _c.gameHub.client.enableStart = function () {
        // user who can start the game gets this message
        $('#startButton').removeAttr('disabled');

        console.log('you can start the game');
    };

    _c.gameHub.client.endGame = function (winner) {
        alert(winner + " has won!");
    };

    _c.gameHub.client.startGame = function (interval) {
        console.log('set the timer interval for guessing and drawing');
    };

    _c.gameHub.client.drawSegment = function (x_from, y_from, x_to, y_to) {
        _c.canvasContext.lineWidth = "1.0";
        _c.canvasContext.beginPath();
        _c.canvasContext.moveTo(x_from, y_from);
        _c.canvasContext.lineTo(x_to, y_to);
        _c.canvasContext.stroke();
    }

    _c.gameHub.client.drawSegments = function (segments) {
        for (var i = 0; i < segments.length; i++) {
            _c.canvasContext.lineWidth = "1.0";
            _c.canvasContext.beginPath();
            _c.canvasContext.moveTo(segments[i].x_from, segments[i].y_from);
            _c.canvasContext.lineTo(segments[i].x_to, segments[i].y_to);
            _c.canvasContext.stroke();
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

    _c.gameHub.client.enableDrawing = function (interval) {
        _c.canvas.mouseup(function (e) {
            mouseup_drawaction(e);
        });
        _c.canvas.mousedown(function (e) {
            mousedown_drawaction(e, this);
        });
        _c.canvas.mousemove(function (e) {
            mousemove_drawaction(e, this);
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

    function clearCanvas() {
        _c.canvas.clearRect(0, 0, _c.canvas.width, _c.canvas.height);
    }

    function mouseup_drawaction(e) {
        if (e.which === 1) _c.mouseclicked = false;
    }

    function mousedown_drawaction(e, o) {
        if (e.which === 1) _c.mouseclicked = true;
        var parentOffset = $(o).parent().offset();
        _c.lastPoint.x = (e.pageX - parentOffset.left);
        _c.lastPoint.y = (e.pageY - parentOffset.top);
    }

    function mousemove_drawaction(e, o) {
        if (_c.mouseclicked) {
            var parentOffset = $(o).parent().offset();
            var rx = (e.pageX - parentOffset.left);
            var ry = (e.pageY - parentOffset.top);

            _c.canvasContext.lineWidth = "1.0";
            _c.canvasContext.beginPath();
            _c.canvasContext.moveTo(_c.lastPoint.x, _c.lastPoint.y);
            _c.canvasContext.lineTo(rx, ry);
            _c.canvasContext.stroke();

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

    //We can't just push the array of segments to the server becasue IE 11 (for scott hill's system anyway)
    //was silently failing to complete the operation, so we package them up into a single dimension array
    //which seems to work just fine. This also puts less strain the ther server.
    //QUESTION: should we just use a single dimension array everywhere for performance?
    function doSegmentPush() {
        if (_c.segments.length > 0) {
            var a = [];
            for (var i = 0; i < _c.segments.length; i++) {
                a.push(_c.segments[i].x_from | 0);//use quick truncate so server side only has to deal with ints
                a.push(_c.segments[i].y_from | 0);
                a.push(_c.segments[i].x_to | 0);
                a.push(_c.segments[i].y_to | 0);
            }

            _c.gameHub.server.pushSegmentArrayNoJson(a);

            //_c.gameHub.server.pushSegmentArray(_c.segments);  --NOPE! Silently fails in some cases

            _c.segments = [];
        }
    }

    //initialize canvas size
    setCanvasSize();


    //start timer
    _startCountdown();

    $(window).resize(function () {
        setCanvasSize();
    });

    function setCanvasSize() {
        var width, height, windowWidth;
        windowWidth = $(window).width();
        width = (windowWidth * .8) + 'px';
        height = (windowWidth * .52) + 'px';
        c.attr("width", width);
        c.attr("height", height);
    }

    function _startCountdown() {
        var progressBar = $(".meter");
        setInterval(function () {
            progressBar.width(progressBar.width() - 1);
        },100);
    };

    //event handers
    $("#joinButton").click(function () {
        $(".join-container").hide();
        $(".playerName").show();
    });

    //knockout code
    var ViewModel = function () {
        this.playerName = ko.observable();
        this.guess = ko.observable();
    };

    ko.applyBindings(new ViewModel());




});

