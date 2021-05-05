/**
 * Copyright 2016-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

var bodyParser = require('body-parser');
var express = require('express');
var app = express();
var xhub = require('express-x-hub');

app.set('port', (process.env.PORT || 5000));
app.listen(app.get('port'));

app.use(xhub({ algorithm: 'sha1', secret: process.env.APP_SECRET }));
app.use(bodyParser.json());

var token = process.env.TOKEN || 'token';
var received_updates = [];

app.get('/', function(req, res) {
  console.log(req);
  res.send('<pre>' + JSON.stringify(received_updates, null, 2) + '</pre>');
});

app.get(['/webhook_fb'], function(req, res) {
  if (
    req.query['hub.mode'] == 'subscribe' &&
    req.query['hub.verify_token'] == token
  ) {
    res.send(req.query['hub.challenge']);
  } else {
    res.sendStatus(400);
  }
});

app.post('/webhook_fb', function(req, res) {
  console.log('Facebook request body:', req.body);

//   if (!req.isXHubValid()) {
//     console.log('Warning - request header X-Hub-Signature not present or invalid');
//     res.sendStatus(401);
//     return;
//   }

//   console.log('request header X-Hub-Signature validated');
  // Process the Facebook updates here
  received_updates.unshift(req.body);
  var entries = req.body.entry;
  for (var entry of entries) {
    var messaging = entry.messaging;
    for (var message of messaging) {
      var senderId = message.sender.id;
      console.log(senderId);
      if (message.message) {
        // If user send text
        if (message.message.text) {
          var text = message.message.text;
          console.log(text); // In tin nhắn người dùng
          callSendAPI(senderId, "Tin nhắn bạn vừa gửi: " + text);
        }
      }
      if (message.postback){
        if (message.postback.payload){
          var payload = message.postback.payload;
          console.log(payload);
          if (payload == "DICH VU CO DINH NOT LOGIN"){
            var request_body = {
                
    "messaging_type": "RESPONSE",
    "message": {
      "text": "Tỉnh/TP",
      "quick_replies": [
        {
          "title": "Quảng Nam",
          "payload": "DICH VU CO DINH | TINH Q510 vs Quảng Nam",
          "content_type": "text"
        },
        {
          "title": "Quảng Ngãi",
          "payload": "DICH VU CO DINH | TINH Q055 vs Quảng Ngãi",
          "content_type": "text"
        },
        {
          "title": "Quảng Ninh",
          "payload": "DICH VU CO DINH | TINH Q033 vs Quảng Ninh",
          "content_type": "text"
        },
        {
          "title": "Quảng Trị",
          "payload": "DICH VU CO DINH | TINH Q053 vs Quảng Trị",
          "content_type": "text"
        },
        {
          "title": "Sóc Trăng",
          "payload": "DICH VU CO DINH | TINH S079 vs Sóc Trăng",
          "content_type": "text"
        },
        {
          "title": "Sơn La",
          "payload": "DICH VU CO DINH | TINH S022 vs Sơn La",
          "content_type": "text"
        },
        {
          "title": "Tây Ninh",
          "payload": "DICH VU CO DINH | TINH T066 vs Tây Ninh",
          "content_type": "text"
        },
        {
          "title": "Thái Bình",
          "payload": "DICH VU CO DINH | TINH T036 vs Thái Bình",
          "content_type": "text"
        },
        {
          "title": "Thái Nguyên",
          "payload": "DICH VU CO DINH | TINH T280 vs Thái Nguyên",
          "content_type": "text"
        },
        {
          "title": "Thanh Hóa",
          "payload": "DICH VU CO DINH | TINH T037 vs Thanh Hóa",
          "content_type": "text"
        },
        {
          "title": "Thừa Thiên Huế",
          "payload": "DICH VU CO DINH | TINH T054 vs Thừa Thiên Huế",
          "content_type": "text"
        },
        {
          "title": "Tiền Giang",
          "payload": "DICH VU CO DINH | TINH T073 vs Tiền Giang",
          "content_type": "text"
        },
        {
          "title": "TPHCM",
          "payload": "DICH VU CO DINH | TINH T008 vs TPHCM",
          "content_type": "text"
        }
      ]
    },
    "recipient": {
      "id": senderId
    }
            }
            callSendAPI(senderId, request_body);
          }
//           
        }
      }
    }
  }
  res.sendStatus(200);
});

function callSendAPI(sender_psid, request_body) {
  // Construct the message body
//   var request_body = {
//     "recipient": {
//       "id": sender_psid
//     },
//     "message": {
//        "text": response
//     }
//   }
  
  console.log(request_body);

//   // Send the HTTP request to the Messenger Platform
//   request({
//     "uri": "https://graph.facebook.com/v2.6/me/messages",
//     "qs": { "access_token": process.env.PAGE_ACCESS_TOKEN },
//     "method": "POST",
//     "json": request_body
  
//   }); 
  var request = require('request');

  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
    method: 'POST',
    json: request_body
  }, function(error, response, body){
    console.log(body);
  });
}

app.listen();
