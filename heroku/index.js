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
          if (payload == "GOI CUOC DATA NOT LOGIN"){
            var request_body = {
                "messaging_type": "RESPONSE",
    "message": {
      "attachment": {
        "type": "template",
        "payload": {
          "elements": [
            {
              "title": "DC5",
              "subtitle": "Giá cước: 5.000đ\nƯu đãi:\n- Có 1GB trong 24h kể từ thời điểm đăng ký, hết 1GB truy cập với cước phí 9.76đ/50KB.\n- Gói cước tự động gia hạn.\nĐối tượng áp dụng: Thuê bao Dcom trả trước kích hoạt mới trước ngày 15/11/2018.\nĐăng ký: Bấm \"Đăng ký\" hoặc soạn tin DC5 gửi 191.\nHủy gia hạn: Soạn tin HUY gửi 191 (xác nhận Y gửi 191). Hủy gói cước: Soạn HUYDATA gửi 191 (Xác nhận Y gửi 191).",
              "buttons": [
                {
                  "title": "Đăng ký",
                  "payload": "DANG NHAP NOT LOGIN | DC5 vs dcom vs 5.000",
                  "type": "postback"
                },
                {
                  "title": "Chi tiết",
                  "payload": "DANG NHAP NOT LOGIN | CHI TIET | DC5 vs dcom vs 5.000",
                  "type": "postback"
                }
              ]
            },
            {
              "title": "D10",
              "subtitle": "Giá cước: 10.000đ.\nƯu đãi:\n-  Có 3GB lưu lượng tốc độ cao trong 24h kể từ thời điểm đăng ký. Hết 3GB truy cập với cước phí 9.76đ/50KB.\n-  Gói cước tự động gia hạn.\nĐối tượng áp dụng: Thuê bao Dcom trả trước kích hoạt mới trước ngày 15/11/2018.\nĐăng ký: Bấm \"Đăng ký\" hoặc soạn tin D10 gửi 191.\nHủy gia hạn: Soạn tin HUY gửi 191 (Xác nhận Y gửi 191). Hủy dịch vụ: Soạn tin HUYDATA gửi 191(Xác nhận Y gửi 191)",
              "buttons": [
                {
                  "title": "Đăng ký",
                  "payload": "DANG NHAP NOT LOGIN | D10 vs dcom vs 10.000",
                  "type": "postback"
                },
                {
                  "title": "Chi tiết",
                  "payload": "DANG NHAP NOT LOGIN | CHI TIET | D10 vs dcom vs 10.000",
                  "type": "postback"
                }
              ]
            },
            {
              "title": "DC10",
              "subtitle": "Giá cước: 10.000đ\nƯu đãi:\n- Có 50MB trong 30 ngày kể từ thời điểm đăng ký, hết 50MB  truy cập với cước phí 9.76đ/50KB\n-  Gói cước tự động gia hạn.\nĐăng ký: Bấm \"Đăng ký\" hoặc soạn tin DC10 gửi 191.\nHủy: Soạn tin HUY gửi 191.",
              "buttons": [
                {
                  "title": "Đăng ký",
                  "payload": "DANG NHAP NOT LOGIN | DC10 vs dcom vs 10.000",
                  "type": "postback"
                },
                {
                  "title": "Chi tiết",
                  "payload": "DANG NHAP NOT LOGIN | CHI TIET | DC10 vs dcom vs 10.000",
                  "type": "postback"
                }
              ]
            },
            {
              "title": "D500",
              "subtitle": "Giá cước: 500.000đ/360 ngày\nƯu đãi:\n- 60GB sử dụng trong 360 ngày (5GB/30 ngày, không bảo lưu lưu lượng còn lại khi sang chu kỳ mới)\n- Hết lưu lượng truy cập với tốc độ thông thường\n- Gói cước gia hạn sau 360 ngày\nĐăng ký: Bấm Đăng ký hoặc soạn D500 gửi 191 hoặc bấm gọi *098*0500#\nỨng trước lưu lượng: Soạn UDT gửi 191 (ứng 5GB/30 ngày trừ vào lưu lượng và thời hạn gói D500)\nHủy gói: Bấm Hủy hoặc soạn HUY gửi 191.",
              "buttons": [
                {
                  "title": "Đăng ký",
                  "payload": "DANG NHAP NOT LOGIN | D500 vs dcom vs 500.000",
                  "type": "postback"
                },
                {
                  "title": "Chi tiết",
                  "payload": "DANG NHAP NOT LOGIN | CHI TIET | D500 vs dcom vs 500.000",
                  "type": "postback"
                }
              ]
            },
            {
              "title": "D900",
              "subtitle": "Giá cước: 900.000đ/360 ngày.\nƯu đãi: Miễn phí 84GB lưu lượng Data/12 chu kỳ. Mỗi chu kỳ có 7GB data tốc độ cao sử dụng trong 30 ngày không cộng dồn, hết 7GB truy cập tốc độ thông thường.\nĐăng ký: Bấm \"Đăng ký\" / Bấm *098*0900# / Soạn tin D900 gửi 191.\nHủy: Soạn tin HUY gửi 191.",
              "buttons": [
                {
                  "title": "Đăng ký",
                  "payload": "DANG NHAP NOT LOGIN | D900 vs dcom vs 900.000",
                  "type": "postback"
                },
                {
                  "title": "Chi tiết",
                  "payload": "DANG NHAP NOT LOGIN | CHI TIET | D900 vs dcom vs 900.000",
                  "type": "postback"
                }
              ]
            }
          ],
          "template_type": "generic"
        }
      }
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
