// Node server code
// Template taken from https://socket.io/get-started/chat/
var app = require('express')();
var http = require('http').Server(app);

// Serve the html page upon request as a response
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

// Listen to port 3000 for incoming clients
http.listen(3000, function(){
  console.log('listening on *:3000');
});