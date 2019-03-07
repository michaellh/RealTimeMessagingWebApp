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

    // Receive a nickname bestowed by the server
    socket.on('nickname', function(nickName) {
        userNickName = nickName;
        $('#nickname').text("Welcome " + userNickName);
    });

    // Receive the chat history upon entering the chat
    socket.on('chat history', function(chatHistory) {
        chatHistory.forEach(element => {
            $('#messages').append($('<li>').text(element));
        });
    });

    // Receive the list of connected users and display it
    socket.on('client list', function(clientsList) {
        clientsList.forEach(element => {
            $('#users').append($('<li>').text(element));
        });
    });

    // Receive an alert when a new user has connected
    socket.on('new client', function(nickName) {
        $('#users').append($('<li>').text(nickName));
    });

    // Receive an alert that a user has disconnected
    socket.on('client disconnected', function(clientsList) {
        $('#users').empty();
        clientsList.forEach(element => {
            $('#users').append($('<li>').text(element));
        });
    });

    // Receive a msg and append it to the chat history
    socket.on('chat message', function(nickName, msg, msgTime) {
        $('#messages').append($('<li>').text(nickName + " " + msgTime + " " + msg));
    });
});