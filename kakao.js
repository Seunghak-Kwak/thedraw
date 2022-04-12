let domain = "https://kwagi.ml"
if (process.platform == 'win32'){
  domain = "http://localhost:3000"
}

const base = {
  clientID: 'e1027b9de86263b5d53429bba203d6bc',
  clientSecret: 'JzAa3n4TjwmGCFyTtq4ETsLmvynW08GA',
  redirectUri: domain+'/login/callback',
  //tokenPath: './tokens/draw1_token.json',
  scope:'profile_nickname,profile_image,account_email',
  //admin_scope:"profile_nickname,profile_image,account_email,talk_message,friends"
}

const kakao1 = {
  clientID: 'fdf44f36dda09952b34632a029809d97',
  clientSecret: '6ODPJxue77NfLqCzzUVybWOP76ADzr2c',
  redirectUri: domain+'/subscribe/callback/1',
  tokenPath: './tokens/draw1_token.json',
  scope:'profile_nickname,profile_image,account_email',
  admin_scope:"profile_nickname,profile_image,account_email,talk_message,friends"
}

const kakao2 = {
  clientID: 'd9e9e5522549aa3847917a835e8c3d61',
  clientSecret: 'koPTxJHP1TprxlUQsyo7melRIdIpfA51',
  redirectUri: domain+'/subscribe/callback/2',
  tokenPath: './tokens/draw2_token.json',
  scope:'profile_nickname,profile_image,account_email',
  admin_scope:"profile_nickname,profile_image,account_email,talk_message,friends"
}

const kakao3 = {
  clientID: 'ed6d7504a4a619a0ffcc903b5eb511e6',
  clientSecret: 'Ha3qXNklNePghbuzBFDtVvPtH8AcBv40',
  redirectUri: domain+'/subscribe/callback/3',
  tokenPath: './tokens/draw3_token.json',
  scope:'profile_nickname,profile_image,account_email',
  admin_scope:"profile_nickname,profile_image,account_email,talk_message,friends"
}

const kakao4 = {
  clientID: 'a3ad22ee33a81db86c7df7f24fb3c005',
  clientSecret: 'Tk6RELAWjliRbfL3iPcdYKxdGgF69pwM',
  redirectUri: domain+'/subscribe/callback/4',
  tokenPath: './tokens/draw4_token.json',
  scope:'profile_nickname,profile_image,account_email',
  admin_scope:"profile_nickname,profile_image,account_email,talk_message,friends"
}

module.exports = { base, kakao1, kakao2, kakao3, kakao4 };
// module.exports = { kakao1 };