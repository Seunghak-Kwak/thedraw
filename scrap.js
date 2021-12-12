const axios = require("axios");
const cheerio = require("cheerio");
const log = console.log;

const getDraw = async () => {
  //const date = (new Date()).toLocaleDateString().split('.')
  const date = new Date()
    .toLocaleString("ko-KR", { timeZone: "Asia/Seoul" })
    .split(".");
  const _mon = date[1].match(/\d+/g)[0];
  const _day = date[2].match(/\d+/g)[0];
  //const _day = "5"
  var drawlist = [];
  var todaylist = [];

  try {
    return await axios
      .get("https://www.nike.com/kr/launch/?type=upcoming")
      .then((html) => {
        let ulList = [];
        const $ = cheerio.load(html.data);
        const $bodyList = $("ul.item-list-wrap li"); //.children("li.section02");

        $bodyList.each(function (i, elem) {
          ulList[i] = {
            title: $(this).find(".headline-3").text(),
            url:
              "https://www.nike.com" + $(this).find("a.card-link").attr("href"),
            image_url: $(this).find("img").attr("data-src"),
            text: $(this).find(".headline-5").text(),
            month: $(this).find(".headline-4").text(),
            drawday: $(this).find(".headline-1").text(),
          };
        });

        const data = ulList.filter((n) => n.title);
        // console.log(data)
        return data;
      })
      .then((res) => {
        res.forEach(function (item) {
          if (item.month.match(/\d+/g)[0] === _mon && item.drawday === _day) {
            if (item.text.match(/응모/g) !== null) {
              drawlist.push(item);
              // console.log(drawlist)
            }
            todaylist.push(item);
          }
        }); //end_foreach
        return { drawlist, todaylist };
      });
  } catch (error) {
    console.error(error);
  }
};

// getDraw();

module.exports = { getDraw };
