// Template code taken from https://socket.io/get-started/chat/

// Initialize the client socket
$(function () {
    // Client state vars
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

    // Receive a nickname bestowed by the server
    socket.on('nickname', function(nickName, nickColor) {
        userName = nickName;
        $('#nickname').html("Welcome " + '<span style="color:' + nickColor
        + '">' + nickName + '</span>');
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
            $('#messages').append($('<li>').html(element));
            // if(nickName === userName) {
            //     $('#messages').append($('<li>').html(msgTime + " " + '<span style="color:' + nickColor
            //     + '">' + nickName + '</span>' + ": " + '<span style="font-weight:' + 'bold' + '">' + msg + '</span>'));
            // }
            // else {
            //     $('#messages').append($('<li>').html(msgTime + " " + '<span style="color:' + nickColor
            //     + '">' + nickName + '</span>' + ": " + msg));
            // }
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
    });
});