// Initialize the client socket
$(function () {
    var socket = io();
    $('form').submit(function(e){
      e.preventDefault(); // prevents page reloading
      socket.emit('chat message', $('#user-message').val());
      $('#user-message').val('');
      return false;
    });
});