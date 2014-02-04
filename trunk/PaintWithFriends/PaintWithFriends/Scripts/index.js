_c = typeof (_c) == "undefined" ? {} : _c;

$(function () {

    // setup the canvas global stuff
    _c.canvas = $("#canvas");
    _c.canvasElement = _c.canvas[0];//same as document.getElementById
    _c.canvasContext = _c.canvasElement.getContext("2d");
    _c.lastPoint = {};
    _c.segments = [];

    setInterval(function () { doSegmentPush() }, 50);

    // create the knockout viewmodel
    function gameViewModel() {
        var self = this;

        // viewmodel properties    
        self.hub = $.connection.gameHub;
        self.playerName = ko.observable("");
        self.playerId = ko.observable("");
        self.players = ko.observableArray([]);
        self.guess = ko.observable("");
        self.isConnected = ko.observable(false);
        self.isPlaying = ko.observable(false);
        self.isReady = ko.observable(false);
        self.chats = ko.observableArray([]);
        self.chat = ko.observable("");

        // connect to hub
        $.connection.hub.start().done(function () {
            self.isConnected(true);
        });

        // viewmodel methods
        self.submitChat = function () {
            // submit the chat to the server
            self.hub.server.submitChat(self.chat());

            // reset the chat property
            self.chat("");

            // set the focus of the chat textbox
            $('#chatBox').focus();
        }

        // joinGame method
        self.joinGame = function () {

            // get the playerName from the viewModel
            var player = self.playerName();

            // submit join method to the hub
            self.hub.server.join(player).done(function (isPlayer) {
                // returns a boolean
                if (isPlayer) {
                    self.playerId(self.hub.state.playerId);
                    self.isConnected(true);
                    self.isReady(true);
                }
            });
        };

        // startGame method
        self.startGame = function () {
            // submit start method to the hub
            self.hub.server.start();
        };

        // guessValue method
        self.guessValue = function () {
            var correctGuess = self.hub.server.guess(self.chat());

            if (!correctGuess) {
                console.log('sorry charlie! try again');
            }
        };

        // clearCanvas method
        self.clearCanvas = function () {
            // send the clear message to the server so all the clients are cleared
            self.hub.server.clear();
        };

        // hub methods 
        self.hub.client.playersInGame = function (players) {
            for (var i in players) {
                var player = players[i];
                self.players.push(player);
            }
        };

        self.hub.client.playerJoined = function (player) {
            self.players.push(player);
        };

        self.hub.client.playerLeft = function (player) {
            self.players.pop(player);
        };

        self.hub.client.disableStart = function () {
            self.isReady(false);
        };

        self.hub.client.enableStart = function () {
            self.isReady(true);
        }

        self.hub.client.startGame = function (interval) {
            _startCountdown();
            self.isPlaying(true);
            console.log('set the timer interval for guessing and drawing');
        };

        self.hub.client.endGame = function (winner) {
            
        };

        self.hub.client.sendChat = function (msg) {
            self.chats.push(msg);

            var myDiv = $("#chatDiv");

            var ul = myDiv.find("ul:first")[0]

            if (ul) {
                var scrollHeight = ul.scrollHeight;

                if (scrollHeight > myDiv.height()) {
                    myDiv.animate({ scrollTop: scrollHeight }, 1000);
                }
            }
        };

        // fn called when signalr hub is notifying player of an incorrect guess by another player.
        self.hub.client.incorrectGuess = function (msg) {
            console.log('Player [' + msg.playerName + '] guessed [' + msg.guess + '] which was WRONG!!');
        };

        self.hub.client.enableDrawing = function (interval) {
            _c.canvas.hammer().on('touch', function (e) {
                startDrawAction(e);
            });

            _c.canvas.hammer().on('drag', function (e) {
                drawAction(e);
            });

            _c.canvas.hammer().on('dragend', function (e) {
                endDrawAction(e);
            });

            _c.canvas.css('cursor', 'crosshair');
        }

        self.hub.client.disableDrawing = function () {
            _c.canvas.unbind('mouseup');
            _c.canvas.unbind('mousedown');
            _c.canvas.unbind('mousemove');
            $("#clearButton").attr('disabled', 'disabled');
            _c.canvas.css('cursor', 'pointer');
        }

        self.hub.client.drawSegment = function (x_from, y_from, x_to, y_to) {
            _c.canvasContext.lineWidth = "1.0";
            _c.canvasContext.beginPath();
            _c.canvasContext.moveTo(x_from, y_from);
            _c.canvasContext.lineTo(x_to, y_to);
            _c.canvasContext.stroke();
        }

        self.hub.client.drawSegments = function (segments) {
            for (var i = 0; i < segments.length; i++) {
                _c.canvasContext.lineWidth = "1.0";
                _c.canvasContext.beginPath();
                _c.canvasContext.moveTo(segments[i].x_from, segments[i].y_from);
                _c.canvasContext.lineTo(segments[i].x_to, segments[i].y_to);
                _c.canvasContext.stroke();
            }
        }

        self.hub.client.clear = function () {
            clearCanvas();
        }
    }

    var gameVM = new gameViewModel();

    ko.applyBindings(gameVM);
    
    function clearCanvas() {
        _c.canvas.clearRect(0, 0, _c.canvas.width, _c.canvas.height);
    }

    function drawAction(e) {
        // make sure that the mouse is clicked and the target of the draw event is inside the canvas element
        if (_c.mouseclicked && e.gesture.target.id != "") {
            console.log(e);
            var rx = e.gesture.touches[0].layerX;
            var ry = e.gesture.touches[0].layerY;

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

    function endDrawAction(e) {
        _c.mouseclicked = false;
    }

    function startDrawAction(e) {
        _c.mouseclicked = true;
        _c.lastPoint.x = e.gesture.touches[0].layerX;
        _c.lastPoint.y = e.gesture.touches[0].layerY;
    }

    /// removed old code and using new code that utilizes crossbrowser touch library Hammer
    //function mouseup_drawaction(e) {
    //    if (e.which === 1) _c.mouseclicked = false;
    //}

    //function mousedown_drawaction(e, o) {
    //    if (e.which === 1) _c.mouseclicked = true;
    //    var parentOffset = $(o).parent().offset();
    //    _c.lastPoint.x = (e.pageX - parentOffset.left);
    //    _c.lastPoint.y = (e.pageY - parentOffset.top);
    //}

    //function mousemove_drawaction(e, o) {
    //    if (_c.mouseclicked) {
    //        var parentOffset = $(o).parent().offset();
    //        var rx = (e.pageX - parentOffset.left);
    //        var ry = (e.pageY - parentOffset.top);

    //        _c.canvasContext.lineWidth = "1.0";
    //        _c.canvasContext.beginPath();
    //        _c.canvasContext.moveTo(_c.lastPoint.x, _c.lastPoint.y);
    //        _c.canvasContext.lineTo(rx, ry);
    //        _c.canvasContext.stroke();

    //        addSegment(_c.lastPoint.x, _c.lastPoint.y, rx, ry);

    //        _c.lastPoint.x = rx;
    //        _c.lastPoint.y = ry;
    //    }
    //}

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

            gameVM.hub.server.pushSegmentArrayNoJson(a);

            //_c.gameHub.server.pushSegmentArray(_c.segments);  --NOPE! Silently fails in some cases

            _c.segments = [];
        }
    }

    //initialize canvas size
    setCanvasSize();

    $(window).resize(function () {
        setCanvasSize();
    });

    function setCanvasSize() {
        var c = $("#canvas");
        var width, height;
        width = c.parent().width();
        height = c.parent().height();

        c.attr("width", width);
        c.attr("height", height);
    }

    function _startCountdown() {
        var progressBar = $(".meter");
        setInterval(function () {
            progressBar.width(progressBar.width() - 1);
        }, 100);
    }
});

