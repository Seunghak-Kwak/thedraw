var express = require('express');
var router = express.Router();

const axios = require("axios");
const fs = require('fs');
const qs = require('qs');
const kakao = require('../kakao');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'THE DRAW Bot!' , session:req.session.kakao });
});

/* SubScribe */
router.get('/subscribe', function(req, res, next) {
  if  (req.session.kakao) {
    res.redirect('/subscribe/done');}
  else {
    const kakaoAuthURL = `https://kauth.kakao.com/oauth/authorize?client_id=${kakao.clientID}&redirect_uri=${kakao.redirectUri}&response_type=code&scope=profile_nickname,profile_image,account_email,talk_message,friends`;
    res.redirect(kakaoAuthURL);
  }
});

router.get('/subscribe/callback', async(req,res)=>{
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
  if (user.data.kakao_account.email == "kdhak2@gmail.com") fs.writeFileSync('./kakao_token.json', JSON.stringify(token.data));

  req.session.kakao = user.data;
  res.redirect('/subscribe/done')
})

router.get('/subscribe/done', function(req, res, next) {
  let {nickname,profile_image}=req.session.kakao.properties;
  res.render('done', { title: 'THE DRAW Bot!', nickname : nickname, profile_image: profile_image});
});

module.exports = router;
