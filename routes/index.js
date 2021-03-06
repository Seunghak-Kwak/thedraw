var express = require('express');
var router = express.Router();

const axios = require("axios");
const fs = require('fs');
const qs = require('qs');
const kakaoList = require('../kakao')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'THE DRAW Bot!'});
});

router.get('/login', function(req, res, next) {
  let kakao = kakaoList['base']
  const kakaoAuthURL = `https://kauth.kakao.com/oauth/authorize?client_id=${kakao.clientID}&redirect_uri=${kakao.redirectUri}&response_type=code&scope=${kakao.scope}`;
  res.redirect(kakaoAuthURL);
})

router.get('/login/callback', async(req,res)=>{
  let kakao = kakaoList['base']
  // let drawID = "draw" + req.params.appId
  let token;
  try{//access토큰을 받기 위한 코드
  token = await axios({//token
      method: 'POST',
      url: 'https://kauth.kakao.com/oauth/token',
      headers:{
          'content-type':'application/x-www-form-urlencoded'
      },
      data:qs.stringify({
          grant_type: 'authorization_code',
          client_id:kakao.clientID,
          client_secret:kakao.clientSecret,
          redirectUri:kakao.redirectUri,
          code:req.query.code,//결과값을 반환했다. 안됐다.
      })//객체를 string 으로 변환
  })
  }catch(err){
    res.json(err); //err.data
  }
    //access토큰을 받아서 사용자 정보를 알기 위해 쓰는 코드
  let user;
  try{
      //access정보를 가지고 또 요청해야 정보를 가져올 수 있음.
      user = await axios({
          method:'get',
          url:'https://kapi.kakao.com/v2/user/me',
          headers:{
              Authorization: `Bearer ${token.data.access_token}`
          }//헤더에 내용을 보고 보내주겠다.
      })
  }catch(e){
      console.log(e);
      res.json(e);
  }

  let userjson = fs.readFileSync("./user.json","utf-8")
  let users = JSON.parse(userjson)
  req.session.kakao = user.data;
  req.session.message = '이미 DRAW BOT을 구독중입니다! 감사합니다:)'

  let found, drawIndex;
  for (var i = 1; i < 5; i++) {
    drawIndex = i;
    let drawID = "draw" + drawIndex;
    found = users[drawID].some(el => el.kakao_account.profile.nickname === user.data.kakao_account.profile.nickname);
    //found = false;
    if (found) { break; } 
  }

  if (found) {
    req.session.drawIndex = drawIndex
    res.redirect('/subscribe/info')
  } else {
    res.redirect('/subscribe');
  }

})


router.get('/subscribe', function(req, res, next) {
  let userjson = fs.readFileSync("./user.json","utf-8")
  let users = JSON.parse(userjson)
  let counts = [];
  for (const [key, value] of Object.entries(users)) {
    console.log(users[key].length)
    counts.push(users[key].length);
  };
  res.render('subscribe', { title: 'THE DRAW Bot!', counts:counts});
});

router.get('/subscribe/draw/:appId', function(req, res, next) {
  let kakao = kakaoList['kakao' + req.params.appId]
  let drawID = "draw" + req.params.appId
  console.log(drawID)

  let userjson = fs.readFileSync("./user.json","utf-8")
  let users = JSON.parse(userjson)

  // if (users[drawID].length >= 5) {
  //   req.session.message = '해당 BOT의 사용인원이 모두 찼습니다.'
  //   res.redirect('/subscribe/info')
  // }
  // else{
  const kakaoAuthURL = `https://kauth.kakao.com/oauth/authorize?client_id=${kakao.clientID}&redirect_uri=${kakao.redirectUri}&response_type=code&scope=${kakao.admin_scope}`;
  res.redirect(kakaoAuthURL);
  // }

  // if (req.session.kakao) {
  //   res.redirect('/subscribe/info');}
  // else {
  //   let userjson = fs.readFileSync("./user.json","utf-8")
  //   let users = JSON.parse(userjson)
  
  //   if (users[drawID].length >= 5) {
  //     req.session.message = '해당 BOT의 사용인원이 모두 찼습니다.'
  //     res.redirect('/subscribe/info')
  //   }
  //   else{
  //     const kakaoAuthURL = `https://kauth.kakao.com/oauth/authorize?client_id=${kakao.clientID}&redirect_uri=${kakao.redirectUri}&response_type=code&scope=${kakao.scope}`;
  //     res.redirect(kakaoAuthURL);
  //   }
  // }
});

/* SubScribe */
router.get('/subscribe/admin/:appId', function(req, res, next) {
  let kakao = kakaoList['kakao' + req.params.appId]
  const kakaoAuthURL = `https://kauth.kakao.com/oauth/authorize?client_id=${kakao.clientID}&redirect_uri=${kakao.redirectUri}&response_type=code&scope=${kakao.admin_scope}`;
  res.redirect(kakaoAuthURL);
});
  
router.get('/subscribe/callback/:appId', async(req,res)=>{
  let kakao = kakaoList['kakao' + req.params.appId]
  let drawID = "draw" + req.params.appId
  let token;
  try{//access토큰을 받기 위한 코드
  token = await axios({//token
      method: 'POST',
      url: 'https://kauth.kakao.com/oauth/token',
      headers:{
          'content-type':'application/x-www-form-urlencoded'
      },
      data:qs.stringify({
          grant_type: 'authorization_code',
          client_id:kakao.clientID,
          client_secret:kakao.clientSecret,
          redirectUri:kakao.redirectUri,
          code:req.query.code,//결과값을 반환했다. 안됐다.
      })//객체를 string 으로 변환
  })
  }catch(err){
    res.json(err); //err.data
  }
    //access토큰을 받아서 사용자 정보를 알기 위해 쓰는 코드
  let user;
  try{
      //access정보를 가지고 또 요청해야 정보를 가져올 수 있음.
      user = await axios({
          method:'get',
          url:'https://kapi.kakao.com/v2/user/me',
          headers:{
              Authorization: `Bearer ${token.data.access_token}`
          }//헤더에 내용을 보고 보내주겠다.
      })
  }catch(e){
      console.log(e);
      res.json(e);
  }

  //user가 admin일땐 refrsh_token 값 갱신 (for sending message)
if (user.data.kakao_account.email == "kdhak2@gmail.com") {
  if (token.data.scope.includes('talk_message')) fs.writeFileSync(kakao.tokenPath, JSON.stringify(token.data)); 
} 

  let userjson = fs.readFileSync("./user.json","utf-8")
  let users = JSON.parse(userjson)
  req.session.kakao = user.data;
  
  const found = users[drawID].some(el => el.kakao_account.profile.nickname === user.data.kakao_account.profile.nickname);
  if (found) {
      req.session.message = 'THE DRAW 응모 알림 구독갱신되었습니다.'
      res.redirect('/subscribe/done')
      //res.redirect('/subscribe/info')
    }
  else{
    req.session.message = 'THE DRAW 응모 알림 구독완료되었습니다.'
    users[drawID].push(user.data);
    userjson = JSON.stringify(users, null, 4)
    fs.writeFileSync("user.json", userjson, "utf-8")
    res.redirect('/subscribe/done')
  }

})
  
router.get('/subscribe/done', function(req, res, next) {
  let {nickname,profile_image}=req.session.kakao.properties;
  let message=req.session.message;
  res.render('done', { title: 'THE DRAW Bot!', nickname : nickname, profile_image: profile_image, message:message});
});

router.get('/subscribe/info', function(req, res, next) {
  let nickname, profile_image;
  let message=req.session.message;
  let drawIndex;
  if (req.session.drawIndex) drawIndex = req.session.drawIndex;
  if(req.session.kakao){
    let {nickname,profile_image}=req.session.kakao.properties;
    res.render('info', { title: 'THE DRAW Bot!', nickname : nickname, profile_image: profile_image, message: message, drawIndex: drawIndex});
  }else{
    res.render('info', { title: 'THE DRAW Bot!', nickname : nickname, profile_image: profile_image, message: message, drawIndex: drawIndex});
  }
});

module.exports = router;