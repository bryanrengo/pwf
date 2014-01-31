_c = typeof (_c) == "undefined" ? {} : _c;

$(function () {
    var hub = $.connection.chatHub;

    $.connection.hub.start().done(function () {
        // do any startup code here
    });

    $('#msgBox').keypress(function (event) {
        // enter key will submit
        if (event.which == 13) {
            event.preventDefault();
            sendMessage();
        }
    });


    $('#msgSubmit').click(function () {
        sendMessage();
    });

    function sendMessage() {
        // get the message
        var msg = $('#msgBox').val();

        // submit the msg to the server
        hub.server.submitMessage(msg);

        // reset the chat value
        $('#msgBox').val('');

        // set the focus of the chat textbox
        $('#msgBox').focus();
    }

    hub.client.sendMessage = function (msg) {
        // get the chat div and list jquery elements
        var chatDiv = $("#chatDiv");
        var chatList = $("#chatList");

        // append the new element with the message
        chatList.append('<li>' + msg + '</li>');

        // perform scrolling if necessary
        if (chatList) {
            var chatListScrollHeight = chatList[0].scrollHeight;
            var chatDivHeight = chatDiv.height();

            if (chatListScrollHeight > chatDivHeight) {
                chatDiv.animate({ scrollTop: chatListScrollHeight }, 1000);
            }
        }
    };
});