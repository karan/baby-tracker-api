var sendgrid = require('sendgrid')(process.env.SENDGRID_USERNAME, process.env.SENDGRID_PASSWORD);

// options:
// {
//   to:       'example@example.com',
//   from:     'other@example.com',
//   subject:  'Hello World',
//   text:     'My first email through SendGrid.'
// }
module.exports.send = function (options, cb) {
  sendgrid.send(options, function(err, json) {
    if (err) { return console.error(err); }
    console.log(json);
    cb(err, json);
  });
};