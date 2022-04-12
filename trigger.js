var axios = require('axios');
var https = require('https');

const httpsAgent = new https.Agent({ rejectUnauthorized: false });

let domain = "https://kwagi.ml"
if (process.platform == 'win32'){
  domain = "http://localhost:3000"
}

var config = {
  method: 'post',
  url: domain +'/test',
  data: {"id":"kwagi"},
  httpsAgent : httpsAgent,
};

axios(config)
.then(function (response) {
  console.log(JSON.stringify(response.data));
})
.catch(function (error) {
  console.log(error);
});