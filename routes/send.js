var express = require("express");
var router = express.Router();

const api = require("../api");
const kakaolist = require("../kakao");
const scrap = require("../scrap");

router.post("/", async function (req, res, next) {
  if (req.body.id != 'kwagi') {
    console.log(req.body)
    res.send("denied")  }
  else{
    //scrap data
    scrap.getDraw()
      .then(async (result) => {
        var draw_data = result.drawlist;
        var today_data = result.todaylist;

        for (const [key, value] of Object.entries(kakaolist)) {
          let kakao = kakaolist[key];

          // 토큰 갱신
          let token;
          try {
            //access토큰 받기
            token = await api.refrsh_token(kakao);
          } catch (err) {
            res.json(err); //err.data
          }

          //친구 찾기
          let friends;
          try {
            friends = await api.searchFriends(token);
          } catch (e) {
            console.log(e);
            return res.json(e);
          }

          //friends uuid list
          let idList = [];
          const fList = friends.data.elements;
          fList.forEach(function (elem, i) {
            idList[i] = elem.uuid;
          });
          console.log(friends.data.elements);

          // 메세지 보내기
          try {
            let sendme;
            let sendFriends;
            //send
            if (today_data.length > 0) {
              if (today_data.length > 1) {
                sendme = api.sendme(token, today_data, "list");
                sendFriends = api.sendFriends(token, today_data, idList, "list");
              }
              if (draw_data.length > 0) {
                draw_data.forEach(async (elem, i) => {
                  sendme = api.sendme(token, draw_data[i], "feed");
                  sendFriends = api.sendFriends(token,draw_data[i],idList,"feed");
                });
              } else {
                if (today_data.length == 1) {
                  sendme = api.sendme(token, today_data[0], "feed");
                  sendFriends = api.sendFriends(token,today_data[0],idList,"feed");
                }
              }
            } else {
              res.send("no data");
            }
          } catch (e) {
            console.log(e);
            res.json(e);
          }
        }
      })
      .then((result) => {
        if (!result) {
          res.send("finish sending me and friends");
        }
      })
      .catch((err) => console.log(err));
  }
});

module.exports = router;
