_c = typeof (_c) == "undefined" ? {} : _c;

$(function () {
    // remove all autocompletes on all the inputs, not needed in this game
    $("#playerName").focus();

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
        self.player = ko.observable();
        self.match = ko.observable("");
        self.players = ko.observableArray([]);
        self.guess = ko.observable("");
        self.isConnected = ko.observable(false);
        self.isPlaying = ko.observable(false);
        self.isReady = ko.observable(false);
        self.isDrawer = ko.observable(false);
        self.chats = ko.observableArray([]);
        self.chat = ko.observable("");


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
            var playerName = self.playerName();

            // submit join method to the hub
            self.hub.server.join(playerName).done(function (player) {
                // returns a player
                if (player) {
                    self.player(player);
                    self.isDrawer(player.IsDrawer);
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
            var correctGuess = self.hub.server.guess(self.chat()).done(function (correctGuess) {
                if (!correctGuess) {
                    addChat({
                        Message: 'sorry charlie! try again',
                        PlayerName: self.playerName()
                    });
                }
            });

            // reset the chat property
            self.chat("");

            // set the focus of the chat textbox
            $('#chatBox').focus();
        };

        // clearCanvas method
        self.clearCanvas = function () {
            // send the clear message to the server so all the clients are cleared
            self.hub.server.clear();
        };

        // hub methods 
        self.hub.client.playersInGame = function (players) {
            self.players.removeAll();

            for (var i in players) {
                var player = players[i];
                self.players.push(player);

                // update binding from the server
                if (self.player() && self.player().ConnectionId === player.ConnectionId) {
                    self.player(player);
                    self.isDrawer(player.IsDrawer);
                    self.match("");
                    if (self.isDrawer()) {
                        self.isReady(true);
                    }
                }
            }
        };

        self.hub.client.playerJoined = function (player) {
            self.players.push(player);
        };

        self.hub.client.playerLeft = function (player) {
            addChat({
                PlayerName: "server",
                Message: "player '" + player.Name + "' has left the game"
            });
        };

        self.hub.client.disableStart = function () {
            self.isReady(false);
        };

        self.hub.client.waitingForPlayers = function (player) {
            addChat({
                PlayerName: "server",
                Message: "player '" + player.Name + "' joined, waiting for additional players"
            });
        };

        self.hub.client.enableStart = function () {
            for (playerIndex in self.players()) {
                if (self.players()[playerIndex] === self.player()) {
                    console.log(self.player());
                }
            }

            self.isReady(true);
        };

        self.hub.client.startGame = function (interval) {
            startCountdown(interval);
            self.isPlaying(true);
        };

        self.hub.client.endGame = function (winner) {
            addChat({
                PlayerName: "server",
                Message: "player " + winner.Name + " has won! new game drawer being chosen..."
            });
            self.isReady(false);
            clearCanvas();
        };

        self.hub.client.sendChat = function (msg) {
            addChat(msg);
        };

        // fn called when signalr hub is notifying player of an incorrect guess by another player.
        self.hub.client.incorrectGuess = function (msg) {
            addChat({
                PlayerName: "server",
                Message: 'Player [' + msg.playerName + '] guessed [' + msg.guess + '] which was WRONG!!'
            });
        };

        self.hub.client.enableDrawing = function (interval, match) {
            self.match(match);
            startCountdown(interval);
            _c.canvas.hammer().on('touch', function (e) {
                startDrawAction(e);
            });

            _c.canvas.hammer().on('drag', function (e) {
                e.gesture.preventDefault();
                drawAction(e);
            });

            _c.canvas.hammer().on('dragend', function (e) {
                endDrawAction(e);
            });

            _c.canvas.css('cursor', 'crosshair');
        };

        self.hub.client.disableDrawing = function () {
            _c.canvas.unbind('mouseup');
            _c.canvas.unbind('mousedown');
            _c.canvas.unbind('mousemove');
            _c.canvas.css('cursor', 'pointer');
        };

        self.hub.client.drawSegment = function (x_from, y_from, x_to, y_to) {
            _c.canvasContext.lineWidth = "1.0";
            _c.canvasContext.beginPath();
            _c.canvasContext.moveTo(x_from, y_from);
            _c.canvasContext.lineTo(x_to, y_to);
            _c.canvasContext.stroke();
        };

        self.hub.client.drawSegments = function (segments) {
            for (var i = 0; i < segments.length; i++) {
                _c.canvasContext.lineWidth = "1.0";
                _c.canvasContext.beginPath();
                _c.canvasContext.moveTo(segments[i].x_from, segments[i].y_from);
                _c.canvasContext.lineTo(segments[i].x_to, segments[i].y_to);
                _c.canvasContext.stroke();
            }
        };

        self.hub.client.clear = function () {
            clearCanvas();
        };

        function addChat(msg) {
            self.chats.push(msg);

            var myDiv = $("#chatDiv");

            var ul = myDiv.find("ul:first")[0];

            if (ul) {
                var scrollHeight = ul.scrollHeight;

                if (scrollHeight > myDiv.height()) {
                    myDiv.animate({ scrollTop: scrollHeight }, 1000);
                }
            }
        }

        // connect to hub
        $.connection.hub.start().done(function () {
            self.isConnected(true);

            //self.hub.server.getPlayers().done(function (players) {
            //    for (var i in players) {
            //        var player = players[i];
            //        self.players.push(player);
            //    }
            //});
        });
    }

    var gameVM = new gameViewModel();

    ko.applyBindings(gameVM);

    function clearCanvas() {
        _c.canvasContext.clearRect(0, 0, _c.canvas.width(), _c.canvas.height());
    }

    function drawAction(e) {
        // make sure that the mouse is clicked and the target of the draw event is inside the canvas element
        if (_c.mouseclicked && e.gesture.target.id != "") {
            console.log(e);
            var rx = getCoords(e.gesture.touches[0]).x;
            var ry = getCoords(e.gesture.touches[0]).y;

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
        _c.lastPoint.x = getCoords(e.gesture.touches[0]).x;
        _c.lastPoint.y = getCoords(e.gesture.touches[0]).y;
    }

    // Get the coordinates for a mouse or touch event
    function getCoords(e) {
        if (e.offsetX) {
            // Works in Chrome / Safari (except on iPad/iPhone)
            return { x: e.offsetX, y: e.offsetY };
        }
        else if (e.layerX) {
            // Works in Firefox
            return { x: e.layerX, y: e.layerY };
        }
        else {
            // Works in Safari on iPad/iPhone
            return { x: e.pageX - findPos(_c.canvasElement).left, y: e.pageY - findPos(_c.canvasElement).top };
        }
    }

    function findPos(obj) {
        var curleft = curtop = 0;

        if (obj.offsetParent) {
            do {
                curleft += obj.offsetLeft;
                curtop += obj.offsetTop;
            } while (obj = obj.offsetParent);

            return { left: curleft, top: curtop };
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

    function startCountdown(interval) {
        var progressBar = $(".meter");
        setInterval(function () {
            progressBar.width(progressBar.width() - 1);
        }, interval);
    }
});

