let domain = "https://kwagi.ml"
if (process.platform == 'win32'){
  domain = "http://localhost:3000"
}

const kakao = {
  clientID: 'fdf44f36dda09952b34632a029809d97',
  clientSecret: '6ODPJxue77NfLqCzzUVybWOP76ADzr2c',
  redirectUri: domain+'/subscribe/callback'
}  

  module.exports = kakao;