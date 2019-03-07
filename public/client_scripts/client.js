// Template code taken from https://socket.io/get-started/chat/

// Initialize the client socket
$(function () {
    // Client states
    var userNickName = "";

    var socket = io();

    // Send the chat message
    $('form').submit(function(e) {
        // Prevents the page from reloading
        e.preventDefault(); 
        socket.emit('chat message', userNickName, $('#user-message').val());
        $('#user-message').val('');
        return false;
    });

    // Receive the nickname bestowed by the server
    socket.on('nickname', function(nickName) {
        userNickName = nickName;
        $('#nickname').text("Welcome " + userNickName);
    });

    // Receive the chat history
    socket.on('chat history', function(chatHistory) {
        chatHistory.forEach(element => {
            $('#messages').append($('<li>').text(element));
        });
    });

    // Respond to a 'chat message' object on this socket
    // by appending to the chat history
    socket.on('chat message', function(nickName, msg, msgTime) {
        $('#messages').append($('<li>').text(nickName + " " + msgTime + " " + msg));
    });
});