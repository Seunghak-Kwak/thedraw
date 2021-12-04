const list = (args) => {
    var content = []
    args.forEach((elem, i) => {
        content.push(
            {
                title:elem.title,
                description:elem.text,
                image_url:elem.image_url,
                link:{
                web_url : elem.url,
                mobile_web_url : elem.url,
                }
            })
    })

    return JSON.stringify({
        object_type: "list",
        header_title: "THE DRAW Upcoming!",
        header_link: {
            web_url: "https://www.nike.com/kr/launch/?type=upcoming",
            mobile_web_url: "https://www.nike.com/kr/launch/?type=upcoming",
        },
        contents : content,
        buttons : [
            {
                title : "THE DRAW 보러가기",
                link : {
                    web_url : "https://www.nike.com/kr/launch/?type=upcoming",
                    mobile_web_url : "https://www.nike.com/kr/launch/?type=upcoming",
                }
            }
        ]        
    })
}

const feed = (args) => {
    var btName = "구경"
    if (args.text.match(/응모/g) !== null) {
        btName = "응모"
    }
    return JSON.stringify({
        object_type: "feed",
        content: {
            title: "금일 " + args.text + "!",
            description: args.title,
            image_url: args.image_url,
            link: {
                "mobile_web_url": args.url,
                "web_url": args.url,
            }
        },
        social: {
            like_count: 999,
            comment_count: 999,
            shared_count: 999
        },
        buttons: [
            {
                title: "THE DRAW "+btName+"하러가기",
                link: {
                    mobile_web_url: args.url,
                    web_url: args.url,
                }
            }
        ]
    })    
}

module.exports = { list, feed };