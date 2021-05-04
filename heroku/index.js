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
              "subtitle": "Giá cước: 5.000đ\\n Ưu đãi:\\n - Có 1GB trong 24h kể từ thời điểm đăng ký, hết 1GB truy cập với cước phí 9.76đ/50KB.\\n - Gói cước tự động gia hạn.\\n Đối tượng áp dụng: Thuê bao Dcom trả trước kích hoạt mới trước ngày 15/11/2018.\\n Đăng ký: Bấm \"Đăng ký\" hoặc soạn tin DC5 gửi 191.\\n Hủy gia hạn: Soạn tin HUY gửi 191 (xác nhận Y gửi 191). Hủy gói cước: Soạn HUYDATA gửi 191 (Xác nhận Y gửi 191).",
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
              "subtitle": "Giá cước: 10.000đ.\\n Ưu đãi:\\n -  Có 3GB lưu lượng tốc độ cao trong 24h kể từ thời điểm đăng ký. Hết 3GB truy cập với cước phí 9.76đ/50KB.\\n -  Gói cước tự động gia hạn.\\n Đối tượng áp dụng: Thuê bao Dcom trả trước kích hoạt mới trước ngày 15/11/2018.\\n Đăng ký: Bấm \"Đăng ký\" hoặc soạn tin D10 gửi 191.\\n Hủy gia hạn: Soạn tin HUY gửi 191 (Xác nhận Y gửi 191). Hủy dịch vụ: Soạn tin HUYDATA gửi 191(Xác nhận Y gửi 191)",
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
              "subtitle": "Giá cước: 10.000đ\\n Ưu đãi:\\n - Có 50MB trong 30 ngày kể từ thời điểm đăng ký, hết 50MB  truy cập với cước phí 9.76đ/50KB\\n -  Gói cước tự động gia hạn.\\n Đăng ký: Bấm \"Đăng ký\" hoặc soạn tin DC10 gửi 191.\\n Hủy: Soạn tin HUY gửi 191.",
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
              "title": "D15",
              "subtitle": "Giá cước: 15.000đ\\n Ưu đãi: 5GB trong 24h kể từ thời điểm đăng ký, hết 5GB tính cước 9.76đ/50KB.\\n Đối tượng áp dụng: Thuê bao Dcom trả trước kích hoạt mới trước ngày 15/11/2018.\\n Đăng ký: Bấm \"Đăng ký\" hoặc soạn D15 gửi 191.\\n Hủy gia hạn: Soạn HUY gửi 191 và làm theo hướng dẫn. Hủy dịch vụ: Soạn tin HUYDATA gửi 191 (Xác nhận Y gửi 191)",
              "buttons": [
                {
                  "title": "Đăng ký",
                  "payload": "DANG NHAP NOT LOGIN | D15 vs dcom vs 15.000",
                  "type": "postback"
                },
                {
                  "title": "Chi tiết",
                  "payload": "DANG NHAP NOT LOGIN | CHI TIET | D15 vs dcom vs 15.000",
                  "type": "postback"
                }
              ]
            },
            {
              "title": "D30",
              "subtitle": "Giá cước: 30.000đ/30 ngày. Ưu đãi: -  Miễn phí 2.5GB lưu lượng Data/30 ngày. Hết 2.5GB truy cập tính giá 9,76đ/50KB. -  Gói cước được gia hạn sau 30 ngày. Đăng ký: Bấm \"Đăng ký\" / Soạn tin D30 gửi 191 / Bấm *098*830# Hủy gia hạn: Soạn tin HUY gửi 191 (xác nhận Y gửi 191) Hủy gói cước: Soạn HUYDATA gửi 191 (xác nhận Y gửi 191)",
              "buttons": [
                {
                  "title": "Đăng ký",
                  "payload": "DANG NHAP NOT LOGIN | D30 vs dcom vs 30.000",
                  "type": "postback"
                },
                {
                  "title": "Chi tiết",
                  "payload": "DANG NHAP NOT LOGIN | CHI TIET | D30 vs dcom vs 30.000",
                  "type": "postback"
                }
              ]
            },
            {
              "title": "DC50",
              "subtitle": "Giá cước: 50.000đ.\\n Ưu đãi: 450MB trong 30 ngày, hết 450MB tính cước 9.76đ/50KB.\\n Đăng ký: Bấm Đăng ký hoặc soạn DC50 gửi 191.\\n Hủy: Bấm Hủy hoặc soạn HUY gửi 191 và làm theo hướng dẫn.",
              "buttons": [
                {
                  "title": "Đăng ký",
                  "payload": "DANG NHAP NOT LOGIN | DC50 vs dcom vs 50.000",
                  "type": "postback"
                },
                {
                  "title": "Chi tiết",
                  "payload": "DANG NHAP NOT LOGIN | CHI TIET | DC50 vs dcom vs 50.000",
                  "type": "postback"
                }
              ]
            },
            {
              "title": "D50",
              "subtitle": "Giá cước: 50.000đ/30 ngày.\\n Ưu đãi:\\n -  Miễn phí 3.5GB lưu lượng Data/30 ngày. Hết 3.5GB truy cập tốc độ thông thường.\\n -  Gói cước được gia hạn sau 30 ngày.\\n Đăng ký: Bấm \"Đăng ký\" / Soạn tin D50 gửi 191 / Bấm *098*850#\\n Hủy: Soạn tin HUY gửi 191.",
              "buttons": [
                {
                  "title": "Đăng ký",
                  "payload": "DANG NHAP NOT LOGIN | D50 vs dcom vs 50.000",
                  "type": "postback"
                },
                {
                  "title": "Chi tiết",
                  "payload": "DANG NHAP NOT LOGIN | CHI TIET | D50 vs dcom vs 50.000",
                  "type": "postback"
                }
              ]
            },
            {
              "title": "D70",
              "subtitle": "Giá cước: 70.000đ/30 ngày.\\n Ưu đãi:\\n -  Miễn phí 7GB lưu lượng Data/30 ngày. Hết 7GB truy cập tốc độ thông thường.\\n -  Gói cước được gia hạn sau 30 ngày.\\n Đăng ký: Bấm \"Đăng ký\" / Soạn tin D70 gửi 191 / Bấm *098*870#\\n Hủy: Soạn tin HUY gửi 191.",
              "buttons": [
                {
                  "title": "Đăng ký",
                  "payload": "DANG NHAP NOT LOGIN | D70 vs dcom vs 70.000",
                  "type": "postback"
                },
                {
                  "title": "Chi tiết",
                  "payload": "DANG NHAP NOT LOGIN | CHI TIET | D70 vs dcom vs 70.000",
                  "type": "postback"
                }
              ]
            },
            {
              "title": "DC70",
              "subtitle": "Giá cước: 70.000đ\\n Ưu đãi: 600MB trong 1 tháng, hết 600MB truy cập không tính cước.\\n Đăng ký: Bấm Đăng ký hoặc soạn DC70 gửi 191.\\n Hủy: Bấm Hủy, soạn HUY gửi 191 và làm theo hướng dẫn.",
              "buttons": [
                {
                  "title": "Đăng ký",
                  "payload": "DANG NHAP NOT LOGIN | DC70 vs dcom vs 70.000",
                  "type": "postback"
                },
                {
                  "title": "Chi tiết",
                  "payload": "DANG NHAP NOT LOGIN | CHI TIET | DC70 vs dcom vs 70.000",
                  "type": "postback"
                }
              ]
            },
            {
              "title": "D90",
              "subtitle": "Giá cước: 90.000đ/30 ngày.\\n Ưu đãi:\\n -  Miễn phí 10GB lưu lượng Data/30 ngày. Hết 10GB truy cập tốc độ thông thường.\\n -  Gói cước được gia hạn sau 30 ngày.\\n Đối tượng áp dụng: Thuê bao Dcom trả trước kích hoạt mới trước ngày 15/11/2018.\\n Đăng ký: Bấm \"Đăng ký\" / Bấm *098*890# /  Soạn tin D90 gửi 191.\\n Hủy: Soạn tin HUY gửi 191.  ",
              "buttons": [
                {
                  "title": "Đăng ký",
                  "payload": "DANG NHAP NOT LOGIN | D90 vs dcom vs 90.000",
                  "type": "postback"
                },
                {
                  "title": "Chi tiết",
                  "payload": "DANG NHAP NOT LOGIN | CHI TIET | D90 vs dcom vs 90.000",
                  "type": "postback"
                }
              ]
            },
            {
              "title": "D120",
              "subtitle": "Giá cước: 120.000đ/30 ngày.\\n Ưu đãi:\\n -  Có 12GB lưu lượng Data/30 ngày. Hết 12GB truy cập tốc độ thông thường.\\n -  Gói cước được gia hạn sau 30 ngày.\\n Đăng ký: Bấm \"Đăng ký\" / Bấm *098*8120# / Soạn tin D120 gửi 191.\\n Hủy: Soạn tin HUY gửi 191.",
              "buttons": [
                {
                  "title": "Đăng ký",
                  "payload": "DANG NHAP NOT LOGIN | D120 vs dcom vs 120.000",
                  "type": "postback"
                },
                {
                  "title": "Chi tiết",
                  "payload": "DANG NHAP NOT LOGIN | CHI TIET | D120 vs dcom vs 120.000",
                  "type": "postback"
                }
              ]
            },
            {
              "title": "D200",
              "subtitle": "Giá cước: 200.000đ/30 ngày\\n Ưu đãi:\\n - Có ngay 20GB, hết lưu lượng truy cập với tốc độ thông thường.\\n - Dịch vụ gia hạn sau 30 ngày.\\n Đăng ký: Bấm Đăng ký / Soạn D200 gửi 191 / Bấm *098*8200#\\n Hủy gia hạn: Soạn HUY gửi 191.\\n Hủy gói: Soạn HUYDATA gửi 191.",
              "buttons": [
                {
                  "title": "Đăng ký",
                  "payload": "DANG NHAP NOT LOGIN | D200 vs dcom vs 200.000",
                  "type": "postback"
                },
                {
                  "title": "Chi tiết",
                  "payload": "DANG NHAP NOT LOGIN | CHI TIET | D200 vs dcom vs 200.000",
                  "type": "postback"
                }
              ]
            },
            {
              "title": "DC300",
              "subtitle": "Giá cước: 300.000đ\\n Ưu đãi: 4GB sử dụng trong 30 ngày, cộng lưu lượng trong 6 chu kỳ. Hết lưu lượng - truy cập tốc độ thông thường. Gói cước tự động gia hạn.\\n Đăng ký: Bấm \"Đăng ký\" / Soạn tin nhắn DC300 gửi đến 191 / Bấm gọi *098*8300#.\\n Hủy: Bấm Hủy để ngừng sử dụng dịch vụ hoặc soạn tin nhắn HUY gửi đến 191.",
              "buttons": [
                {
                  "title": "Đăng ký",
                  "payload": "DANG NHAP NOT LOGIN | DC300 vs dcom vs 300.000",
                  "type": "postback"
                },
                {
                  "title": "Chi tiết",
                  "payload": "DANG NHAP NOT LOGIN | CHI TIET | DC300 vs dcom vs 300.000",
                  "type": "postback"
                }
              ]
            },
            {
              "title": "D500",
              "subtitle": "Giá cước: 500.000đ/360 ngày\\n Ưu đãi:\\n - 60GB sử dụng trong 360 ngày (5GB/30 ngày, không bảo lưu lưu lượng còn lại khi sang chu kỳ mới)\\n - Hết lưu lượng truy cập với tốc độ thông thường\\n - Gói cước gia hạn sau 360 ngày\\n Đăng ký: Bấm Đăng ký hoặc soạn D500 gửi 191 hoặc bấm gọi *098*0500#\\n Ứng trước lưu lượng: Soạn UDT gửi 191 (ứng 5GB/30 ngày trừ vào lưu lượng và thời hạn gói D500)\\n Hủy gói: Bấm Hủy hoặc soạn HUY gửi 191.",
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
              "subtitle": "Giá cước: 900.000đ/360 ngày.\\n Ưu đãi: Miễn phí 84GB lưu lượng Data/12 chu kỳ. Mỗi chu kỳ có 7GB data tốc độ cao sử dụng trong 30 ngày không cộng dồn, hết 7GB truy cập tốc độ thông thường.\\n Đăng ký: Bấm \"Đăng ký\" / Bấm *098*0900# / Soạn tin D900 gửi 191.\\n Hủy: Soạn tin HUY gửi 191.",
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
