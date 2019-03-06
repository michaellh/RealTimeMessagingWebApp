// Template code taken from https://socket.io/get-started/chat/

// Initialize the client socket
$(function () {
    var socket = io();
    // Send the chat message
    $('form').submit(function(e) {
        // Prevents the page from reloading
        e.preventDefault(); 
        socket.emit('chat message', $('#user-message').val());
        $('#user-message').val('');
        return false;
    });

    // Respond to a 'chat message' object on this socket
    // by appending to the chat history
    socket.on('chat message', function(msg, msgTime) {
        $('#messages').append($('<li>').text(msgTime + " " + msg));
    });
});