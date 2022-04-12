var express = require("express");
var router = express.Router();

const api = require("../api");
const kakaolist = require("../kakao");
const scrap = require("../scrap");

router.post("/", async function (req, res, next) {
  if (req.body.id != 'kwagi') {
    res.send("denied")  }
  else{
    //scrap data
    scrap.getDraw().then(async (result) => {
        var draw_data = result.drawlist;
        var today_data = result.todaylist;

        for (const [key, value] of Object.entries(kakaolist)) {
          if (key == "base") continue;
          let kakao = kakaolist[key];
          // 토큰 갱신
          let token;
          try {
            //access토큰 받기
            token = await api.refrsh_token(kakao);
          } catch (err) {
            res.json(err); //err.data
          }

          //console.log(token)

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
