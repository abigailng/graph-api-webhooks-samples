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
          if (payload == "DICH VU GTGT NOT LOGIN"){
            var request_body = {
                
    "messaging_type": "RESPONSE",
    "message": {
      "attachment": {
        "type": "template",
        "payload": {
          "elements": [
            {
              "title": "MyClip - Mạng xã hội Video",
              "subtitle": "Xem ngay video “Cười vỡ bụng với Tuyển hàng chân dài” tại http://myclip.vn/cuoivobung Myclip sở hữu hàng triệu video đặc sắc, đa dạng thể loại hài, nhạc, phim, thể thao, thiếu nhi, làm đẹp. Người dùng có thể thoải mái xem video giải trí, tương tác, comment, download/upload video yêu thích và chia sẻ với cộng đồng    Hãy trải nghiệm chất lượng dịch vụ tốt nhất với ữu đãi Không giới hạn DATA 3G/4G 100% tốc độ cao Viettel -         Gói ngày: soạn tin DK gửi 9062 (3.000đ/ngày)  -         Gói tuần: soạn tin DK7 gửi 9062 (10.000đ/tuần) -         Gói tháng: soạn tin DK30 gửi 9062 (35.000đ/tháng)",
              "buttons": [
                {
                  "title": "Đăng ký",
                  "payload": "DANG NHAP NOT LOGIN GTGT | MYCLIP_GOINGAY",
                  "type": "postback"
                },
                {
                  "title": "Chi tiết",
                  "payload": "DANG NHAP NOT LOGIN GTGT | CHI TIET | MYCLIP_GOINGAY",
                  "type": "postback"
                }
              ]
            },
            {
              "title": "Data Liên quân Mobile",
              "subtitle": "Chơi game thả ga mà không lo hết dung lượng Xem trực tiếp giải đấu trong Ứng dụng Liên Quân Mobile không lo dung lượng Chơi game mọi lúc mọi nơi mà không cần quan tâm tới kết nối mạng khác Cước phí không thể rẻ hơn Giftcode hấp dẫn tùy theo gói đăng ký + Gói ngày: LQ1 gửi 9029 (2000 VNĐ/ngày + giftcode khi gia hạn) + Gói tuần: LQ7 gửi 9029 (10000 VNĐ/tuần + giftcode khi đăng ký & gia hạn) + Gói tháng: LQ30 gửi 9029 (20000 VNĐ/tháng + giftcode khi đăng ký & gia hạn) + Gói lẻ: DK1 LQ gửi 9029 (phí dịch vụ: 5000 VNĐ + giftcode khi đăng ký)",
              "buttons": [
                {
                  "title": "Đăng ký",
                  "payload": "DANG NHAP NOT LOGIN GTGT | GAME9029_GARENA",
                  "type": "postback"
                },
                {
                  "title": "Chi tiết",
                  "payload": "DANG NHAP NOT LOGIN GTGT | CHI TIET | GAME9029_GARENA",
                  "type": "postback"
                }
              ]
            },
            {
              "title": "Kênh hài - Hài tổng hợp",
              "subtitle": "Dịch vụ video Hài tổng hợp -Kênh Hài cho phép người dùng được xem các nội dung hài hước, giải trí trên trang http://kenhhai.vn Khách hàng là thuê bao Viettel đăng ký gói cước dịch vụ sẽ được sử dụng 1 lượng data 3G/4G tốc độ cao để xem video trên wapsite. - Đăng ký:  + Gói ngày: XNHAI gửi 9268 (3.000đ/ngày).  + Gói tuần: XNHAI7 gửi 9268 (10.000đ/tuần). - Để sử dụng dịch vụ, vui lòng truy cập http://kenhhai.vn hoặc Click vào biểu tượng web phía dưới. - Chi tiết gọi 198 (miễn phí)",
              "buttons": [
                {
                  "title": "Đăng ký",
                  "payload": "DANG NHAP NOT LOGIN GTGT | KENHHAI_GOINGAY\r\n",
                  "type": "postback"
                },
                {
                  "title": "Chi tiết",
                  "payload": "DANG NHAP NOT LOGIN GTGT | CHI TIET | KENHHAI_GOINGAY\r\n",
                  "type": "postback"
                }
              ]
            },
            {
              "title": "Keeng Movies",
              "subtitle": "Keeng Movies là dịch vụ xem phim trực tuyến có bản quyền, miễn 100% cước truy cập Data 3G/4G với kho phim bom tấn chiếu rạp Hollywood, phim hot Âu Mỹ, phim phát song song đài truyền hình Hàn Quốc, Trung Quốc… tại http://phim.keeng.vn và Ứng dụng Keeng. Đăng ký dịch vụ: + Gói thường: Soạn tin XNF gửi 5005 (10.000đ/tuần) + Gói VIP, xem nhiều phim Bom tấn hơn: Soạn tin XNM gửi 5005 (50.000đ/tháng) Các gói cước gia hạn theo tuần/tháng. Chi tiết truy cập http://phim.keeng.vn hoặc bấm vào biểu tượng App bên dưới để cài đặt miễn phí ứng dụng Keeng.",
              "buttons": [
                {
                  "title": "Đăng ký",
                  "payload": "DANG NHAP NOT LOGIN GTGT | KEENG MOVIES",
                  "type": "postback"
                },
                {
                  "title": "Chi tiết",
                  "payload": "DANG NHAP NOT LOGIN GTGT | CHI TIET | KEENG MOVIES",
                  "type": "postback"
                }
              ]
            },
            {
              "title": "Data TikTok",
              "subtitle": "TikTok là dịch vụ cung cấp  gói data không giới hạn lưu lượng để truy cập ứng dụng mạng xã hội video TikTok, cho phép người dùng xem các clip ca nhạc,quay, chỉnh sửa đồng thời thêm các hiệu ứng đặc biệt vào clip ngắn và chia sẻ với bạn bè và mọi người không giới hạn lưu lượng truy cập. - Đăng ký: + Gói ngày:  Soạn: DK T1 gửi 5282 (3.000đ/ ngày) + Gói tuần: Soạn: DK T7 gửi 5282 (10.000đ/tuần) + Gói tháng: Soạn: DK T30 gửi 5282 (30.000đ/tháng) Chi tiết gọi 198 (miễn phí)  ",
              "buttons": [
                {
                  "title": "Đăng ký",
                  "payload": "DANG NHAP NOT LOGIN GTGT | TIKTOK_GOINGAY",
                  "type": "postback"
                },
                {
                  "title": "Chi tiết",
                  "payload": "DANG NHAP NOT LOGIN GTGT | CHI TIET | TIKTOK_GOINGAY",
                  "type": "postback"
                }
              ]
            },
            {
              "title": "Dịch vụ MyData",
              "subtitle": "Khi sử dụng dịch vụ, khách hàng được miễn phí hoàn toàn Data 3G/4G tốc độ cao, thoải mái vào các ứng dụng như: Gmail, Skype, Chat, Phim… (sử dụng trên hệ điều hành Android). Bạn có thể lựa chọn các gói phù hợp: + Gói Data Video: Sử dụng app youtube, Instagram, Myclip . Soạn: DKVD gửi 5282 (3.000đ/ngày) + Gói Data Văn phòng: Sử dụng app Gmail, Skype Google Drive… đảm bảo kết nối công việc 24/7. Soạn: DKVP gửi 5282 (3.000đ/ngày) + Gói Data Giải trí: Lướt TikTok, nghe nhạc 24 giờ mỗi ngày... Soạn: DKGT gửi 5282 (3.000đ/ngày) + Gói Data Chat: Video Call, gửi ảnh…, giữ liên lạc mọi lúc mọi nơi... Soạn: DKC gửi 5282 (3.000đ/ngày) + Gói Data Game: Chơi các Game Hot nhất như Liên quân mobile, PubG,... Soạn DKGA gửi 5282 (3.000đ/ngày) + Gói Data Truyền hình: Xem tivi không lo hết Data... Soạn: DKTN gửi 5282 (3.000đ/ngày) + Gói Họp trực tuyến: Cung cấp Data Viettel tốc độ tối đa sử dụng miễn phí trên các ứng dụng Microsoft team, Zoom, Skype, Viber, Microsoft outlook, Webex, Gmail, Viettel study mọi lúc mọi nơi. Soạn DKTT gửi 5282 (3.000đ/ngày) + Gói MY30 - Data Mạng Xã hội: Cộng 1GB sử dụng đa hướng + Không giới hạn lưu lượng data gói Video với ứng dụng: YouTube, Instagram, TikTok, MyClip trong 7 ngày kể từ khi đăng ký. Soạn: DKMY30 gửi 5282 (30.000đ/tuần).  + Gói MY100 - Data Mạng Xã hội: Cộng 5GB sử dụng đa hướng + Không giới hạn lưu lượng data gói Video với  ứng dụng: YouTube, Instagram, TikTok, MyClip trong 30 ngày kể từ khi đăng ký. Soạn: DKMY100 gửi 5282 (100.000đ/tháng). Chi tiết dịch vụ truy cập http://mydata.viettel.vn hoặc gọi 198 (miễn phí)",
              "buttons": [
                {
                  "title": "Đăng ký",
                  "payload": "DANG NHAP NOT LOGIN GTGT | MYDATA_VANPHONG",
                  "type": "postback"
                },
                {
                  "title": "Chi tiết",
                  "payload": "DANG NHAP NOT LOGIN GTGT | CHI TIET | MYDATA_VANPHONG",
                  "type": "postback"
                }
              ]
            },
            {
              "title": "Manwa - Truyện tranh",
              "subtitle": "Manwa là dịch vụ đọc truyện tranh bản quyền số 1 Việt Nam trên di động. Dịch vụ cung cấp kho truyện tranh phong phú, hấp dẫn, đa dạng gồm các truyện tranh có bản quyền trong nước và quốc tế. Khách hàng có thể truy cập và đọc truyện mọi lúc, mọi nơi trên điện thoại di động (trên wap và app dịch vụ). Dịch vụ miễn cước data khi sử dụng cho khách hàng đăng ký. - Đăng ký + Gói ngày  Soạn DKB gửi 5282 (3.000đ/ngày). + Gói tuần:  Soạn DKB7 gửi 5282 (15.000đ/tuần). + Gói tháng Soạn DKB30 gửi 5282 (50.000đ/tháng).   - Chi tiết gọi 198 (miễn phí).",
              "buttons": [
                {
                  "title": "Đăng ký",
                  "payload": "DANG NHAP NOT LOGIN GTGT | MANWA_GOINGAY",
                  "type": "postback"
                },
                {
                  "title": "Chi tiết",
                  "payload": "DANG NHAP NOT LOGIN GTGT | CHI TIET | MANWA_GOINGAY",
                  "type": "postback"
                }
              ]
            },
            {
              "title": "Data K+",
              "subtitle": "Dịch vụ DATA K+ là dịch vụ cung cấp gói Data không giới hạn lưu lượng dùng để truy cập ứng dụng xem truyền hình K+ mọi lúc, mọi nơi. Với dịch vụ này, khách hàng được xem các kênh truyền hình, kho video độc quyền với chất lượng hình ảnh rõ nét, nội dung đặc sắc của truyền hình số vệ tinh K+. - Đăng ký gói Data: + Gói ngày, soạn: K3 gửi 5282 (3.000đ/ngày) + Gói tuần, soạn: KP7 gửi 5282 (10.000đ/tuần) + Gói tháng, soạn KP30 gửi 5282 (30.000đ/tháng) - Tính năng dịch vụ: Không giới hạn lưu lượng Data 3G/4G để truy cập kho dữ liệu độc quyền, khổng lồ với nhiều nội dung hấp dẫn trên ứng dụng K+ bao gồm: hơn 100 kênh truyền hinh (4 kênh K+ HD, 9 kênh VTV và nhiều kênh truyền hình đặc sắc: FOX, CNN, Discovery...), các trận cầu đỉnh cao giải Ngoại hạng Anh, Champions League, La liga Tây Ban Nha, loạt phim bom tấn chiếu rạp, các series phim truyền hình nổi tiếng, các clip ca nhạc và thể thao...  - Lưu ý: + Để sử dụng, khách hàng cần mua gói nội dung của K+ và tạo tài khoản K+ trên website https://kplus.vn. Hiện tại, tài khoản K+ được cung cấp miễn phí cho các thuê bao K+ đang sử dụng gói cước Preminum+ (lắp chảo thu và đầu thu K+) hoặc gói K+ TV BOX (kết nối internet).   Chi tiết gọi 198 (miễn phí).",
              "buttons": [
                {
                  "title": "Đăng ký",
                  "payload": "DANG NHAP NOT LOGIN GTGT | MYKPLUS_NGAY",
                  "type": "postback"
                },
                {
                  "title": "Chi tiết",
                  "payload": "DANG NHAP NOT LOGIN GTGT | CHI TIET | MYKPLUS_NGAY",
                  "type": "postback"
                }
              ]
            },
            {
              "title": "K+ độc quyền",
              "subtitle": "iflix là dịch vụ giúp khách hàng truy cập không giới hạn kho dữ liệu khổng lồ với hàng ngàn nội dung độc quyền như các bộ phim truyền hình, phim chiếu rạp ăn khách, các chương trình giải trí trong nước và khu vực.   Đăng ký dịch vụ: + Gói ngày: Soạn L1 gửi 5282 (3.000đ/ngày) + Gói tuần: Soạn L7 gửi 5282 (15.000đ/tuần) + Gói tháng: Soạn L30 gửi 5282 (50.000đ/tháng) Chi tiết gọi 198 (miễn phí) hoặc truy cập biểu tượng phía dưới.  ",
              "buttons": [
                {
                  "title": "Đăng ký",
                  "payload": "DANG NHAP NOT LOGIN GTGT | IFLIX_GOINGAY",
                  "type": "postback"
                },
                {
                  "title": "Chi tiết",
                  "payload": "DANG NHAP NOT LOGIN GTGT | CHI TIET | IFLIX_GOINGAY",
                  "type": "postback"
                }
              ]
            },
            {
              "title": "Data FPT Play",
              "subtitle": "Data FPT Play là dịch vụ cung cấp gói Data không giới hạn lưu lượng 3G/4G để truy cập ứng dụng xem truyền hình FPT Play mọi lúc, mọi nơi.Không giới hạn lưu lượng 3G/4G để truy cập kho dữ liệu khổng lồ với nhiều nội dung hấp dẫn trên ứng dụng FPT Play gồm: hơn 100 kênh truyền hình đặc sắc, hàng nghìn nội dung giải trí đỉnh cao, phim bộ, phim chiếu rạp mới nhất, các giải bóng đá đỉnh cao… - Đăng ký: + Gói ngày: soạn F1 gửi 5282 (3.000đ/ngày). + Gói tuần: soạn F7 gửi 5282 (10.000đ/tuần). + Gói tháng: soạn F30 gửi 5282 (30.000đ/tháng). Chi tiết gọi 198 (miễn phí)  ",
              "buttons": [
                {
                  "title": "Đăng ký",
                  "payload": "DANG NHAP NOT LOGIN GTGT | FPTPLAY_GOINGAY",
                  "type": "postback"
                },
                {
                  "title": "Chi tiết",
                  "payload": "DANG NHAP NOT LOGIN GTGT | CHI TIET | FPTPLAY_GOINGAY",
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
