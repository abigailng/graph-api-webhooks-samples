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
                        "title": "<b>ST5K</b><br/>",
                        "subtitle": "<p>\r\n\t<strong>Gi&aacute; cước:</strong> 5.000đ/lần đăng k&yacute;.<br />\r\n\t<strong>Ưu đ&atilde;i:</strong><br />\r\n\t+ 500MB sử dụng đến 24h c&ugrave;ng ng&agrave;y đăng k&yacute;. G&oacute;i cước gia hạn tự động.<br />\r\n\t+ Đặc biệt &ldquo;MUA 2 TẶNG 1&rdquo;, Viettel tặng th&ecirc;m 500MB khi qu&yacute; kh&aacute;ch đăng k&yacute; lần tiếp theo trong ng&agrave;y.<br />\r\n\t<strong>Đăng k&yacute;</strong>: Bấm &quot;Đăng k&yacute;&quot; hoặc soạn ST5K gửi 191<br />\r\n\t<strong>Hủy gia hạn:</strong> Bấm hủy hoặc soạn HUY ST5K gửi 191</p>\r\n",
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
                        "title": "<b>ST10K</b><br/>",
                        "subtitle": "<p>\r\n\t<span style=\"font-size:16px;\"><span style=\"color: rgb(0, 0, 0);\"><span style=\"font-family: times new roman,times,serif;\"><strong>Gi&aacute; cước:</strong> 10.000đ/lần.<br />\r\n\t<strong>Ưu đ&atilde;i: </strong><br />\r\n\t+ C&oacute; 2GB sử dụng đến 24h ng&agrave;y đăng k&yacute;<br />\r\n\t+ Hết 2GB t&iacute;nh cước theo g&oacute;i Mobile Internet đang sử dụng (nếu c&oacute;)<br />\r\n\t<strong>Đăng k&yacute;: </strong>Nhấn n&uacute;t Đăng k&yacute; hoặc soạn ST10K gửi 191, hoặc bấm gọi *098*16#<br />\r\n\t<strong>Hủy gia hạn:</strong> Soạn HUY ST10K gửi 191. <strong>Hủy g&oacute;i:</strong> HUYDATA ST10K gửi 191.</span></span></span></p>\r\n",
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
                        "title": "<b>ST15K</b><br/>",
                        "subtitle": "<p>\r\n\t<span style=\"font-size:16px;\"><span style=\"font-family: times new roman,times,serif;\"><strong>Gi&aacute; cước:</strong> 15.000đ/3 ng&agrave;y.<br />\r\n\t<strong>Ưu đ&atilde;i:</strong><br />\r\n\t- C&oacute; ngay 3GB lưu lượng tốc độ cao sử dụng trong 3 ng&agrave;y kể từ ng&agrave;y đăng k&yacute; th&agrave;nh c&ocirc;ng. Hết lưu lượng truy cập theo g&oacute;i Mobile Internet đang sử dụng (nếu c&oacute;).<br />\r\n\t- G&oacute;i cước gia hạn khi hết chu kỳ, lưu lượng c&ograve;n lại sẽ được bảo lưu khi gia hạn th&agrave;nh c&ocirc;ng.<br />\r\n\t<strong>Đăng k&yacute;</strong>: Bấm Đăng k&yacute; hoặc soạn ST15K gửi 191, bấm gọi *098*3# hoặc *098*1533#<br />\r\n\t<strong>Hủy gia hạn:</strong> Soạn HUY ST15K gửi 191</span></span></p>\r\n",
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
                        "title": "<b>ST30K</b><br/>",
                        "subtitle": "<p>\r\n\t<strong>Gi&aacute; cước:</strong> 30.000đ/7 ng&agrave;y<br />\r\n\t<strong>Ưu đ&atilde;i:</strong><br />\r\n\t-&nbsp; C&oacute; ngay 7GB lưu lượng tốc độ cao sử dụng trong 7 ng&agrave;y kể từ ng&agrave;y đăng k&yacute; th&agrave;nh c&ocirc;ng. Hết lưu lượng truy cập theo g&oacute;i Mobile Internet đang sử dụng (nếu c&oacute;).<br />\r\n\t- G&oacute;i cước gia hạn khi hết chu kỳ, lưu lượng c&ograve;n lại sẽ được bảo lưu khi gia hạn th&agrave;nh c&ocirc;ng.<br />\r\n\t<strong>Đăng k&yacute;:</strong> Bấm Đăng k&yacute;, soạn ST30K gửi 191, bấm gọi *098*7#hoặc *098*3077#<br />\r\n\t<strong>Hủy gia hạn: </strong>Soạn HUY ST30K gửi 191</p>\r\n",
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
