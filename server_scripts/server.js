// Template code taken from https://socket.io/get-started/chat/

// Initialize express and the server
var express = require('express');
var expressApp = express();
var server = require('http').createServer(expressApp);
// Initialize socket.io by passing in the http server
var io = require('socket.io')(server);
var path = require('path');
var chatFeats = require('./chat-feats');

// Array of client nicknames connected to the server
var nickNameList = [];
// Array of the past 200 messages - the chat history
var chatHistory = [];
// Array of connected clients
var clientsList = [];

// Pass static files in the public dir to Express.static 
// middleware for client-side rwx
expressApp.use(express.static(path.join(__dirname + '../../public/')));

// Serve the html page to clients
expressApp.get('/', function(req, res) {
    res.sendFile('index.html', {root:path.join(__dirname, '../public/')});
});

// Respond when a client connects to the server
io.on('connection', function(socket) {
    // Try until a unique nickname is found for the client
    // A promise should be used here to ensure the nickname
    // doesn't already exist within the server/DB
    let nickName = chatFeats.newNickName();
    console.log(nickName + ' connected');
    socket.emit('nickname', nickName);

    // Send the list of connected clients to the client
    clientsList.push(nickName);
    socket.emit('client list', clientsList);
    // Alert all other clients of the new client
    socket.broadcast.emit('new client', nickName);

    // Send the chat history to the client
    // Typically the client would send a req to server
    // that queries the DB for their chat history file
    socket.emit('chat history', chatHistory);

    // Respond to a chat message
    socket.on('chat message', function(nickName, msg){
        let msgTime = chatFeats.msgTimeStamp();
        chatHistory.push(nickName + " " + msgTime + " " + msg);
        io.emit('chat message', nickName, msg, msgTime);
    });

    socket.on('disconnect', function() {
        console.log(nickName + ' disconnected');
        // Alert all clients that this client has left
        // and broadcast a new list of clients
        clientsList = clientsList.filter(function(client) {
            return client != nickName;
        });
        socket.broadcast.emit('client disconnected', clientsList);
    });
});

// Listen to port 3000 for incoming clients
server.listen(3000, function() {
    console.log('listening on *:3000');
});