// Template code taken from https://socket.io/get-started/chat/

var express = require('express');
var expressApp = express(); // Init an Express app
var server = require('http').createServer(expressApp); // Create an http server with Express
var io = require('socket.io')(server); // Init socket.io with the http server
var path = require('path');
var chatFeats = require('./chat-feats');

// Server state vars
var chatHistory = [];
var clientsList = [];

// Serve static files from /public
expressApp.use(express.static(path.join(__dirname + '../../public/')));

// Serve index.html to connected clients
expressApp.get('/', function(req, res) {
    res.sendFile('index.html', {root:path.join(__dirname, '../public/')});
});

// Respond when a client connects to the server
io.on('connection', function(socket) {
    // Default font color
    socket.nickColor = "#000000";

    // Generate a nickname for the client
    socket.nickName = chatFeats.newNickName();
    console.log(socket.nickName + ' connected');
    socket.emit('nickname', socket.nickName, socket.nickColor);

    // Send the list of connected clients to the client
    clientsList.push({nickName: socket.nickName, nickColor: socket.nickColor});
    socket.emit('client list', clientsList);

    // Alert all other clients of the new client
    socket.broadcast.emit('client list', clientsList);

    // Send the chat history to the client
    socket.emit('chat history', chatHistory);

    // Respond to a client's chat message
    socket.on('chat message', function(msg){
        if(msg.startsWith("/nick ")) {
            let nickNameArr = msg.split(" ");
            let newNickName = nickNameArr[1];
            // https://stackoverflow.com/questions/7176908/how-to-get-index-of-object-by-its-property-in-javascript
            let newNickNameIndex = clientsList.findIndex(client => client.nickName === newNickName);
            if(newNickNameIndex !== -1) {
               socket.emit('nickname taken', newNickName);
            }
            else {
                let nickNameIndex = clientsList.findIndex(client => client.nickName === socket.nickName);
                // Replace the old client's nickname from the list
                clientsList[nickNameIndex].nickName = newNickName;
                socket.nickName = newNickName;
                socket.emit('nickname', newNickName, socket.nickColor);
                io.emit('client list', clientsList);
            }
        } 
        else if(msg.startsWith("/nickcolor ")) {
            let colorArr = msg.split(" ");
            let nickColor = colorArr[1];
            // https://stackoverflow.com/questions/8027423/how-to-check-if-a-string-is-a-valid-hex-color-representation/8027444
            let nickColorValid = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(nickColor);
            if(nickColorValid) {
                socket.nickColor = nickColor;
                let socketIndex = clientsList.findIndex(client => client.nickName === socket.nickName);
                clientsList[socketIndex].nickColor = socket.nickColor;
                socket.emit('nickname', socket.nickName, socket.nickColor);
                io.emit('client list', clientsList);
            }
            else {
                socket.emit('invalid color', nickColor);
            }
        }
        else {
            let msgTime = chatFeats.msgTimeStamp();
            chatHistory.push(msgTime + " " + '<span style="color:' + socket.nickColor
                + '">' + socket.nickName + '</span>' + ": " + msg);
            io.emit('chat message', msgTime, socket.nickName, msg, socket.nickColor);
        }
    });

    // Alert all clients that this client has left
    socket.on('disconnect', function() {
        console.log(socket.nickName + ' disconnected');
        let clientIndex = clientsList.findIndex(client => client.nickName === socket.nickName);
        // https://stackoverflow.com/questions/3954438/how-to-remove-item-from-array-by-value
        if(clientIndex !== -1) {
            clientsList.splice(clientIndex, 1);
        }
        socket.broadcast.emit('client list', clientsList);
    });
});

// Listen to port 3000 for incoming clients
server.listen(3000, function() {
    console.log('listening on *:3000');
});