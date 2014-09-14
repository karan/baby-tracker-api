
module.exports.send = function (options, cb) {
  // Your accountSid and authToken from twilio.com/user/account
  var accountSid = process.env.TWILIO_USERNAME;
  var authToken = process.env.TWILIO_AUTH_TOKEN;
  var client = require('twilio')(accountSid, authToken);
   
  client.messages.create(options, function(err, message) {
    cb();
  });
};