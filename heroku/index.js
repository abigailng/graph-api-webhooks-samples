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
          if (payload == "DANG NHAP NOT LOGIN GTGT | MYCLIP_GOINGAY"){
            var request_body = {
                
    "messaging_type": "RESPONSE",
    "message": {
      "text": "Xem ngay video “Cười vỡ bụng với Tuyển hàng chân dài” tại http://myclip.vn/cuoivobung Myclip sở hữu hàng triệu video đặc sắc, đa dạng thể loại hài, nhạc, phim, thể thao, thiếu nhi, làm đẹp. Người dùng có thể thoải mái xem video giải trí, tương tác, comment, download/upload video yêu thích và chia sẻ với cộng đồng    Hãy trải nghiệm chất lượng dịch vụ tốt nhất với ữu đãi Không giới hạn DATA 3G/4G 100% tốc độ cao Viettel -         Gói ngày: soạn tin DK gửi 9062 (3.000đ/ngày)  -         Gói tuần: soạn tin DK7 gửi 9062 (10.000đ/tuần) -         Gói tháng: soạn tin DK30 gửi 9062 (35.000đ/tháng)"
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
