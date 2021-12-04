var express = require('express');
var router = express.Router();
const axios = require("axios");
const qs = require('qs');
const fs = require('fs');

const kakao = require('../kakao');
const scrap = require('../scrap');
const template = require('../template');

router.get('/', async function(req, res, next) {
  // 토큰 갱신
  let refresh_token = JSON.parse(fs.readFileSync('./kakao_token.json'));
  try{ //access토큰을 받기
    token = await axios({//token
        method: 'POST',
        url: 'https://kauth.kakao.com/oauth/token',
        headers:{
            'content-type':'application/x-www-form-urlencoded'
        },
        data:qs.stringify({
            grant_type: 'refresh_token',
            client_id:kakao.clientID,
            client_secret:kakao.clientSecret,
            refresh_token:refresh_token.refresh_token,
        })
    })
    
  }catch(err){
    res.json(err); //err.data
  }

  // 나에게 보내기
  scrap.getDraw().then(async (result) => {
    let sendme;
    var draw_data = result.drawlist
    var today_data = result.todaylist
    try{//send
      if (today_data.length > 0) {
        if (today_data.length > 1) {
          // console.log(template.list(today_data))
          sendme = await axios({
            method:'post',
            url:'https://kapi.kakao.com/v2/api/talk/memo/default/send',
            headers:{
                'content-type': 'application/x-www-form-urlencoded',
                Authorization: `Bearer ${token.data.access_token}`
            },
            data:qs.stringify({
                template_object:template.list(today_data)
            })
          })
        }
        if (draw_data.length > 0) {
          sendme = await axios({
              method:'post',
              url:'https://kapi.kakao.com/v2/api/talk/memo/default/send',
              headers:{
                  'content-type': 'application/x-www-form-urlencoded',
                  Authorization: `Bearer ${token.data.access_token}`
              },
              data:qs.stringify({
                template_object:template.feed(draw_data[0])
              })
          })
        }
        else{
          if (today_data.length == 1) {
            sendme = await axios({
              method:'post',
              url:'https://kapi.kakao.com/v2/api/talk/memo/default/send',
              headers:{
                  'content-type': 'application/x-www-form-urlencoded',
                  Authorization: `Bearer ${token.data.access_token}`
              },
              data:qs.stringify({
                template_object:template.feed(today_data[0])
              })
          })
          }
        }
        req.session.kakao_token = token.data;
        res.redirect('/draw/friends') //친구에게 보내기
      }
      else{
        res.send("no data")
      }
    }catch(e){
        console.log(e);
        res.json(e);
    }
  })
});

router.get('/friends', async(req,res)=>{
  let token = req.session.kakao_token;
  let friends;
  try{
      friends = await axios({
          method:'get',
          url:'https://kapi.kakao.com/v1/api/talk/friends',
          headers:{
              Authorization: `Bearer ${token.access_token}`
          }
      })
      res.send(friends.data);
  }catch(e){
      console.log(e);
      res.json(e);
  }

  //친구에게
  scrap.getDraw().then(async (result) => {
    let sendFriends;
    var draw_data = result.drawlist
    var today_data = result.todaylist
    try{
      //friends uuid list
      let idList = []; 
      const fList = friends.data.elements;
      fList.forEach(function(elem, i) {
        idList[i] = '"'+elem.uuid+'"'
      });

      if (today_data.length > 0) {
        if (today_data.length > 1) {
          // console.log(template.list(today_data))
          sendFriends = await axios({
            method:'post',
            url:'https://kapi.kakao.com/v1/api/talk/friends/message/default/send',
            headers:{
                'content-type': 'application/x-www-form-urlencoded',
                Authorization: `Bearer ${token.access_token}`
            },
            data:qs.stringify({
              receiver_uuids : '['+idList+']',
              template_object:template.list(today_data)
            })
          })
        }
        if (draw_data.length > 0) {
          sendFriends = await axios({
            method:'post',
            url:'https://kapi.kakao.com/v1/api/talk/friends/message/default/send',
            headers:{
                'content-type': 'application/x-www-form-urlencoded',
                Authorization: `Bearer ${token.access_token}`
            },
            data:qs.stringify({
              receiver_uuids : '['+idList+']',
              template_object:template.feed(draw_data[0])
            })
          })
        }
        else{
          if (today_data.length == 1) {
            sendFriends = await axios({
              method:'post',
              url:'https://kapi.kakao.com/v1/api/talk/friends/message/default/send',
              headers:{
                  'content-type': 'application/x-www-form-urlencoded',
                  Authorization: `Bearer ${token.access_token}`
              },
              data:qs.stringify({
                receiver_uuids : '['+idList+']',
                template_object:template.feed(today_data[0])
              })
          })
          }
        }
        res.redirect('finish sending me and friends')
      }
      else{
        res.send("no data")
      }
    }catch(e){
        console.log(e);
        res.json(e);
    }
  })

});

//   //친구에게
//  scrap.getDraw().then(async ({draw_data,release_data}) => {
//     let send_freinds;
//     try{//send
//       let idList = []; 
//       const fList = friends.data.elements;
//       fList.forEach(function(elem, i) {
//         idList[i] = '"'+elem.uuid+'"'
//       });
//       if (draw_data.length > 0) {

//         send_freinds = await axios({
//             method:'post',
//             url:'https://kapi.kakao.com/v1/api/talk/friends/message/default/send',
//             headers:{
//                 'content-type': 'application/x-www-form-urlencoded',
//                 Authorization: `Bearer ${token.data.access_token}`
//             },
//             data:qs.stringify({
//                 receiver_uuids : '['+idList+']',
//                 template_object:`{
//                     "object_type": "feed",
//                     "content": {
//                         "title": "금일 ${draw_data[0].text}!",
//                         "description": "${draw_data[0].title}",
//                         "image_url": "${draw_data[0].image_url}",
//                         "link": {
//                             "mobile_web_url": "https://www.nike.com/kr/launch/",
//                             "web_url": "https://www.nike.com/kr/launch/"
//                         }
//                     },
//                     "social": {
//                         "like_count": 999,
//                         "comment_count": 999,
//                         "shared_count": 999
//                     },
//                     "buttons": [
//                         {
//                             "title": "THE DRAW 응모하러가기",
//                             "link": {
//                                 "mobile_web_url": "${draw_data[0].url}",
//                                 "web_url": "${draw_data[0].url}"
//                             }
//                         }
//                     ]
//                 }`
//             })
//         })
//       }
//       else{
//         //not draw
//         console.log("no draw")
//       }
//     }catch(e){
//         console.log(e);
//         res.json(e);
//     }
//   });

module.exports = router;
