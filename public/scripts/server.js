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

// Serve the html page to clients
expressApp.get('/', function(req, res) {
    res.sendFile('index.html', {root: path.join(__dirname, '../')});
});

// Generate a nickname for connecting clients
// function newNickName() {

//     return result;
// }

// Construct and return the message's time stamp
function msgTimeStamp() {
    let dateObj = new Date();
    let dayHours = 12;
    let hours = dateObj.getHours() % dayHours;
    let minutes = dateObj.getMinutes();
    var result = ""; 
    if((dateObj.getHours() / dayHours) < 1) {
        result = hours + ":" + minutes + "AM";   
    }
    else {
        result = hours + ":" + minutes + "PM"; 
    }
    return result;
}

// Respond when a client connects to the server
io.on('connection', function(socket) {
    console.log('a user connected');

    // Respond to a chat message
    socket.on('chat message', function(msg){
        let msgTime = msgTimeStamp();
        io.emit('chat message', msg, msgTime);
    });

    socket.on('disconnect', function() {
        console.log('user disconnected');
    });
});

// Listen to port 3000 for incoming clients
server.listen(3000, function() {
    console.log('listening on *:3000');
});