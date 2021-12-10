var express = require('express');
var router = express.Router();
const axios = require("axios");
const qs = require('qs');
const fs = require('fs');

const kakao = require('../../kakao').kakao3;
const scrap = require('../../scrap');
const template = require('../../template');

router.get('/', async function(req, res, next) {
  let token;
  // 토큰 갱신
  let refresh_token = JSON.parse(fs.readFileSync(kakao.tokenPath));
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
          draw_data.forEach(async (elem, i) => {
            sendme = await axios({
              method:'post',
              url:'https://kapi.kakao.com/v2/api/talk/memo/default/send',
              headers:{
                  'content-type': 'application/x-www-form-urlencoded',
                  Authorization: `Bearer ${token.data.access_token}`
              },
              data:qs.stringify({
                template_object:template.feed(draw_data[i])
              })
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
        res.redirect('send/friends') //친구도
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

router.get('/friends', async(req,res,next)=>{
  let token;
  // 토큰 갱신
  let refresh_token = JSON.parse(fs.readFileSync(kakao.tokenPath));
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
    return res.json(err); //err.data
  }

  //친구 찾기
  let friends;
  try{
      friends = await axios({
          method:'get',
          url:'https://kapi.kakao.com/v1/api/talk/friends',
          headers:{
              Authorization: `Bearer ${token.data.access_token}`
          }
      })
      //res.send(friends.data);
  }catch(e){
      console.log(e);
      return res.json(e);
      // res.json(e);
  }

  //친구에게
  scrap.getDraw().then(async(result) => {
    let sendFriends;
    var draw_data = result.drawlist
    var today_data = result.todaylist
      //friends uuid list
      let idList = []; 
      const fList = friends.data.elements;
      fList.forEach(function(elem, i) {
        idList[i] = elem.uuid 
      });
      console.log(friends.data.elements)
      console.log(idList)
      
    try {
      if (today_data.length > 0) {
        if (today_data.length > 1) {
          // console.log(template.list(today_data))
              sendFriends = await axios({
              method:'post',
              url:'https://kapi.kakao.com/v1/api/talk/friends/message/default/send',
              headers:{
                  'content-type': 'application/x-www-form-urlencoded',
                  Authorization: `Bearer ${token.data.access_token}`
              },
              data:qs.stringify({
                receiver_uuids : JSON.stringify(idList),
                template_object:template.list(today_data)
              })
            });
      }
        if (draw_data.length > 0) {
          draw_data.forEach(async (elem, i) => {
            sendFriends = await axios({
              method:'post',
              url:'https://kapi.kakao.com/v1/api/talk/friends/message/default/send',
              headers:{
                  'content-type': 'application/x-www-form-urlencoded',
                  Authorization: `Bearer ${token.data.access_token}`
              },
              data:qs.stringify({
                receiver_uuids : JSON.stringify(idList),
                template_object:template.feed(draw_data[i])
              })
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
                  Authorization: `Bearer ${token.data.access_token}`
              },
              data:qs.stringify({
                receiver_uuids : JSON.stringify(idList),
                template_object:template.feed(today_data[0])
              })
          })
          }
        }
      }
      else{
        res.send("no data")
        return "nodata"
      }
    }
    catch(e){
      console.log(e);
      res.json(e)
    }
  }).then( (result) => {
    if(!result) {
      res.send('finish sending me and friends')
    }
  }).catch( err => console.log(err))

  
});

module.exports = router;
