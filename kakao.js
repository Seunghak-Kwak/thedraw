let domain = "https://kwagi.ml"
if (process.platform == 'win32'){
  domain = "http://localhost:3000"
}

const kakao1 = {
  clientID: 'fdf44f36dda09952b34632a029809d97',
  clientSecret: '6ODPJxue77NfLqCzzUVybWOP76ADzr2c',
  redirectUri: domain+'/draw1/subscribe/callback',
  tokenPath: './draw1_token.json',
  scope:'profile_nickname,profile_image,account_email',
  admin_scope:"profile_nickname,profile_image,account_email,talk_message,friends"
}

const kakao2 = {
  clientID: 'd9e9e5522549aa3847917a835e8c3d61',
  clientSecret: 'koPTxJHP1TprxlUQsyo7melRIdIpfA51',
  redirectUri: domain+'/draw2/subscribe/callback',
  tokenPath: './draw2_token.json',
  scope:'profile_nickname,profile_image,account_email',
  admin_scope:"profile_nickname,profile_image,account_email,talk_message,friends"
}

const kakao3 = {
  clientID: 'ed6d7504a4a619a0ffcc903b5eb511e6',
  clientSecret: 'Ha3qXNklNePghbuzBFDtVvPtH8AcBv40',
  redirectUri: domain+'/draw3/subscribe/callback',
  tokenPath: './draw3_token.json',
  scope:'profile_nickname,profile_image,account_email',
  admin_scope:"profile_nickname,profile_image,account_email,talk_message,friends"
}

module.exports = { kakao1, kakao2, kakao3 };