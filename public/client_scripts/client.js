// Template code taken from https://socket.io/get-started/chat/

// Initialize the client socket
$(function () {
    var userName = "";
    var socket = io();

    // Send the chat message
    $('form').submit(function(e) {
        // Prevents the page from reloading
        e.preventDefault();

        let msg = $('#user-message').val();
        socket.emit('chat message', msg);
        $('#user-message').val('');
        return false;
    });

    socket.on('check cookies', function() {
        if(document.cookie.split(';').filter((item) => item.trim().startsWith('nickName=')).length) {
            userName = document.cookie.replace(/(?:(?:^|.*;\s*)nickName\s*\=\s*([^;]*).*$)|^.*$/, "$1");
            let nickColor = document.cookie.replace(/(?:(?:^|.*;\s*)nickColor\s*\=\s*([^;]*).*$)|^.*$/, "$1");
            socket.emit('client status', "reconnecting", userName, nickColor);
            $('#nickname').html("Welcome " + '<span style="color:' + nickColor
                + '">' + userName + '</span>');
        }
        else {
            socket.emit('client status', "connecting", userName);
        }
    });

    // Receive a nickname bestowed by the server
    socket.on('nickname', function(nickName, nickColor) {
        userName = nickName;
        document.cookie = "nickName=" + userName;
        document.cookie = "nickColor=" + nickColor;
        $('#nickname').html("Welcome " + '<span style="color:' + nickColor
            + '">' + userName + '</span>');
    });

    // Receive error msg that the nickname change failed
    socket.on('nickname taken', function(nickName) {
        $('#messages').append($('<li>').text(nickName + " is already taken!"));
    });

    // Receive error msg that the font color failed
    socket.on('invalid color', function(nickColor) {
        $('#messages').append($('<li>').text(nickColor + " is an invalid color!"));
    });

    // Receive the chat history upon entering the chat
    socket.on('chat history', function(chatHistory) {
        chatHistory.forEach(element => {
            if(document.cookie.split(';').filter((item) => item.includes('nickName=' + element.nickName)).length) {
                $('#messages').append($('<li>').html(element.msgTime + " " + '<span style="color:' + element.nickColor
                + '">' + element.nickName + '</span>' + ": " + '<span style="font-weight:' + 'bold' + '">' + element.msg + '</span>'));
            }
            else {
                $('#messages').append($('<li>').html(element.msgTime + " " + '<span style="color:' + element.nickColor
                + '">' + element.nickName + '</span>' + ": " + element.msg));
            }
            // https://stackoverflow.com/questions/31716529/how-can-i-scroll-down-to-the-last-li-item-in-a-dynamically-added-ul/31716758
            $('#messages-scrollbar').animate({scrollTop: $('#messages-scrollbar').prop("scrollHeight")}, 500);
        });
    });

    // Receive the list of connected users and display it
    socket.on('client list', function(clientsList) {
        $('#users').empty();
        clientsList.forEach(element => {
            $('#users').append($('<li>').html('<span style="color:' + element.nickColor
            + '">' + element.nickName + '</span>'));
        });
    });

    // Receive a msg and append it to the chat history
    socket.on('chat message', function(msgTime, nickName, msg, nickColor) {
        if(nickName === userName) {
            $('#messages').append($('<li>').html(msgTime + " " + '<span style="color:' + nickColor
            + '">' + nickName + '</span>' + ": " + '<span style="font-weight:' + 'bold' + '">' + msg + '</span>'));
        }
        else {
            $('#messages').append($('<li>').html(msgTime + " " + '<span style="color:' + nickColor
            + '">' + nickName + '</span>' + ": " + msg));
        }
        $('#messages-scrollbar').animate({scrollTop: $('#messages-scrollbar').prop("scrollHeight")}, 500);
    });
});