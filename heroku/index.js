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
              {
                "messaging_type": "RESPONSE",
                "message": {
                  "attachment": {
                    "type": "template",
                    "payload": {
                      "elements": [
                        {
                          "title": "ST5K",
                          "subtitle": "Giá cước: 5.000đ/lần đăng ký. Ưu đãi: + 500MB sử dụng đến 24h cùng ngày đăng ký. Gói cước gia hạn tự động. + Đặc biệt “MUA 2 TẶNG 1”, Viettel tặng thêm 500MB khi quý khách đăng ký lần tiếp theo trong ngày. Đăng ký: Bấm \"Đăng ký\" hoặc soạn ST5K gửi 191 Hủy gia hạn: Bấm hủy hoặc soạn HUY ST5K gửi 191",
                          "buttons": [
                            {
                              "title": "Đăng ký",
                              "payload": "DANG NHAP NOT LOGIN | ST5K vs data_addon vs 5.000",
                              "type": "postback"
                            },
                            {
                              "title": "Chi tiết",
                              "payload": "DANG NHAP NOT LOGIN | CHI TIET | ST5K vs data_addon vs 5.000",
                              "type": "postback"
                            }
                          ]
                        },
                        {
                          "title": "ST10K",
                          "subtitle": "Giá cước: 10.000đ/lần. Ưu đãi: + Có 2GB sử dụng đến 24h ngày đăng ký + Hết 2GB tính cước theo gói Mobile Internet đang sử dụng (nếu có) Đăng ký: Nhấn nút Đăng ký hoặc soạn ST10K gửi 191, hoặc bấm gọi *098*16# Hủy gia hạn: Soạn HUY ST10K gửi 191. Hủy gói: HUYDATA ST10K gửi 191.",
                          "buttons": [
                            {
                              "title": "Đăng ký",
                              "payload": "DANG NHAP NOT LOGIN | ST10K vs data_addon vs 10.000",
                              "type": "postback"
                            },
                            {
                              "title": "Chi tiết",
                              "payload": "DANG NHAP NOT LOGIN | CHI TIET | ST10K vs data_addon vs 10.000",
                              "type": "postback"
                            }
                          ]
                        },
                        {
                          "title": "ST15K",
                          "subtitle": "Giá cước: 15.000đ/3 ngày. Ưu đãi: - Có ngay 3GB lưu lượng tốc độ cao sử dụng trong 3 ngày kể từ ngày đăng ký thành công. Hết lưu lượng truy cập theo gói Mobile Internet đang sử dụng (nếu có). - Gói cước gia hạn khi hết chu kỳ, lưu lượng còn lại sẽ được bảo lưu khi gia hạn thành công. Đăng ký: Bấm Đăng ký hoặc soạn ST15K gửi 191, bấm gọi *098*3# hoặc *098*1533# Hủy gia hạn: Soạn HUY ST15K gửi 191",
                          "buttons": [
                            {
                              "title": "Đăng ký",
                              "payload": "DANG NHAP NOT LOGIN | ST15K vs data_addon vs 15.000",
                              "type": "postback"
                            },
                            {
                              "title": "Chi tiết",
                              "payload": "DANG NHAP NOT LOGIN | CHI TIET | ST15K vs data_addon vs 15.000",
                              "type": "postback"
                            }
                          ]
                        },
                        {
                          "title": "ST30K",
                          "subtitle": "Giá cước: 30.000đ/7 ngày Ưu đãi: -  Có ngay 7GB lưu lượng tốc độ cao sử dụng trong 7 ngày kể từ ngày đăng ký thành công. Hết lưu lượng truy cập theo gói Mobile Internet đang sử dụng (nếu có). - Gói cước gia hạn khi hết chu kỳ, lưu lượng còn lại sẽ được bảo lưu khi gia hạn thành công. Đăng ký: Bấm Đăng ký, soạn ST30K gửi 191, bấm gọi *098*7#hoặc *098*3077# Hủy gia hạn: Soạn HUY ST30K gửi 191",
                          "buttons": [
                            {
                              "title": "Đăng ký",
                              "payload": "DANG NHAP NOT LOGIN | ST30K vs data_addon vs 30.000",
                              "type": "postback"
                            },
                            {
                              "title": "Chi tiết",
                              "payload": "DANG NHAP NOT LOGIN | CHI TIET | ST30K vs data_addon vs 30.000",
                              "type": "postback"
                            }
                          ]
                        },
                        {
                          "title": "CR999",
                          "subtitle": "CR999: 999.000đ/3GB/50SMS/50p nhận cuộc gọi và gọi đi (không gồm hướng gọi quốc tế, vệ tinh). Sử dụng trong 10 ngày tại 20 quốc gia/ vùng lãnh thổ. Hết lưu lượng ngừng sử dụng. Hết 10 ngày tính cước thông thường.Đăng kí: Bấm Đăng ký hoặc Soạn CR999 gửi 191, bấm gọi *098#;Hủy: Soạn HUY CR999 gửi 191",
                          "buttons": [
                            {
                              "title": "Đăng ký",
                              "payload": "DANG NHAP NOT LOGIN | CR999 vs data_addon vs 999.000",
                              "type": "postback"
                            },
                            {
                              "title": "Chi tiết",
                              "payload": "DANG NHAP NOT LOGIN | CHI TIET | CR999 vs data_addon vs 999.000",
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
                  "id": "<PSID>"
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
