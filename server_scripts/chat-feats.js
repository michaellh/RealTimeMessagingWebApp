// Server file for extra chat features

var randomGenerator = require('nanoid');

module.exports = {
    // Construct and return the message's time stamp
    msgTimeStamp: function() {
        let dateObj = new Date();
        let dayHours = 12;
        let hours = dateObj.getHours() % dayHours;
        let minutes = dateObj.getMinutes();
        if(minutes < 10) {
            minutes = "0" + minutes;
        }
        var result = ""; 
        if((dateObj.getHours() / dayHours) < 1) {
            result = hours + ":" + minutes + "AM";   
        }
        else {
            result = hours + ":" + minutes + "PM"; 
        }
        return result;
    },
    // Generate a nickname for connecting clients
    newNickName: function() {
        return randomGenerator(10);
    }
}