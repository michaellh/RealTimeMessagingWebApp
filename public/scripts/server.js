// Template code taken from https://socket.io/get-started/chat/

// Initialize express and the server
var express = require('express');
var expressApp = express();
var server = require('http').createServer(expressApp);
// Initialize socket.io by passing in the http server
var io = require('socket.io')(server);
var path = require('path');

// Pass static dir/files in the public dir to Express.static 
// middleware for rwx
expressApp.use(express.static(path.join(__dirname + '../../')));

// Serve the html page upon request
expressApp.get('/', function(req, res) {
    res.sendFile('index.html', {root: path.join(__dirname, '../')});
});

// When an incoming socket is detected, write to console
io.on('connection', function(socket) {
    console.log('a user connected');
    socket.on('chat message', function(msg){
        console.log('message: ' + msg);
    });
    socket.on('disconnect', function() {
        console.log('user disconnected');
    });
});

// Listen to port 3000 for incoming clients
server.listen(3000, function() {
    console.log('listening on *:3000');
});