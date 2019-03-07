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
    let nickName = chatFeats.newNickName();
    console.log(nickName + ' connected');
    socket.emit('nickname', nickName);

    // Respond to a chat message
    socket.on('chat message', function(nickName, msg){
        let msgTime = chatFeats.msgTimeStamp();
        io.emit('chat message', nickName, msg, msgTime);
    });

    socket.on('disconnect', function() {
        console.log(nickName + ' disconnected');
    });
});

// Listen to port 3000 for incoming clients
server.listen(3000, function() {
    console.log('listening on *:3000');
});