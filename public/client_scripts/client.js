// Template code taken from https://socket.io/get-started/chat/

// Initialize the client socket
$(function () {
    // Client state properties
    var userNickName = "";
    var usersList = [];

    var socket = io();

    // Send the chat message
    $('form').submit(function(e) {
        // Prevents the page from reloading
        e.preventDefault();

        // Change the client's nickname if they input
        // the correct command "/nick newName"
        let msg = $('#user-message').val();
        if(msg.includes("/nick")) {
            let nickNameArr = msg.split(" ");
            let newNickName = nickNameArr[1];
            if(usersList.indexOf(newNickName) !== -1) {
                $('#messages').append($('<li>').text("Nickname already exists! Try another name!"));
            }
            else {
                socket.emit('new nickname', newNickName);
            }
        }
        else {
            socket.emit('chat message', userNickName, msg);
        }
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
            usersList.push(element);
        });
    });

    // Receive an alert that a user has disconnected
    socket.on('client list change', function(clientsList) {
        $('#users').empty();
        usersList.length = 0;
        clientsList.forEach(element => {
            $('#users').append($('<li>').text(element));
            usersList.push(element);
        });
    });

    // Receive a msg and append it to the chat history
    socket.on('chat message', function(nickName, msg, msgTime) {
        $('#messages').append($('<li>').text(nickName + " " + msgTime + " " + msg));
    });
});