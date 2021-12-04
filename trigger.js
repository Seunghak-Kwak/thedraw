var axios = require('axios');
var https = require('https');

const httpsAgent = new https.Agent({ rejectUnauthorized: false });

let domain = "https://kwagi.ml"
if (process.platform == 'win32'){
  domain = "http://localhost:3000"
}

var config = {
  method: 'get',
  url: domain +'/draw',
  // headers: { Cookie : '_kawlt=AMzHKE8LqJ4sIujMYJ_Qu-PXsGuA5f8BwZUAcwH-nFGAySwTR7ncELru6une_o83zi-kL0j6It9qqmyzYs-oKdOrMniCUMwt5b5DgaNFO_t7FQwANRk-oZqeIKdVSEXa; Path=/; Domain=kakao.com; Secure; HttpOnly; Expires=Mon, 03 Jan 2022 08:49:21 GMT;'  },
  headers: {},
  httpsAgent : httpsAgent,
};

axios(config)
.then(function (response) {
  console.log(JSON.stringify(response.data));
})
.catch(function (error) {
  console.log(error);
});