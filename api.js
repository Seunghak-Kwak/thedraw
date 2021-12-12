const axios = require("axios");
const qs = require("qs");
const fs = require("fs");
const template = require("./template");

const refrsh_token = async (kakao) => {
  let refresh_token = JSON.parse(fs.readFileSync(kakao.tokenPath));
  return await axios({
    //token
    method: "POST",
    url: "https://kauth.kakao.com/oauth/token",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    data: qs.stringify({
      grant_type: "refresh_token",
      client_id: kakao.clientID,
      client_secret: kakao.clientSecret,
      refresh_token: refresh_token.refresh_token,
    }),
  });
};

const searchFriends = async (token) => {
  return await axios({
    method: "get",
    url: "https://kapi.kakao.com/v1/api/talk/friends",
    headers: {
      Authorization: `Bearer ${token.data.access_token}`,
    },
  });
};

const sendme = async (token, scrap_data, type) => {
  return await axios({
    method: "post",
    url: "https://kapi.kakao.com/v2/api/talk/memo/default/send",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${token.data.access_token}`,
    },
    data: qs.stringify({
      template_object: template[type](scrap_data),
    }),
  });
};

const sendFriends = async (token, scrap_data, idList, type) => {
  return await axios({
    method: "post",
    url: "https://kapi.kakao.com/v1/api/talk/friends/message/default/send",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${token.data.access_token}`,
    },
    data: qs.stringify({
      receiver_uuids: JSON.stringify(idList),
      template_object: template[type](scrap_data),
    }),
  });
};

module.exports = { refrsh_token, searchFriends, sendme, sendFriends };
