// index.js
 

// init project
require('dotenv').config();
var express = require('express');
var app = express();
//const port = process.env.PORT || 3000;
// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC
var cors = require('cors');
app.use(cors({ optionsSuccessStatus: 200 })); // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

// your first API endpoint...
app.get('/api/whoami', (req, res) => {
  const userAgent = req.get('User-Agent');
  const ip = req.ip;
  const language = req.get('Accept-Language').split(',')[0];
  const software = userAgent.split(')')[0].split('(')[1];

  res.json({
    ipaddress: ip,
    language: language,
    software: software
  });
});

// listen for requests :)
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
