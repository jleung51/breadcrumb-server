// This Javascript module contains methods for HTTP validation and statuses.
//
// Use this module as follows:
//     const time = require('./time');
//     console.log(time.getDateTime());



// EXPORTS

// This function returns the current date and time in a human-readable format.
exports.getDateTime = function() {
    const date = new Date();
  
    let year = date.getFullYear();
  
    let month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;
  
    let day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;
  
    let hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;
  
    let ampm = hour >= 12 ? 'PM' : 'am';
  
    let min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;
  
    let sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;
  
    return year + "-" + month + "-" + day + " " + hour + ":" + min + ampm;
}