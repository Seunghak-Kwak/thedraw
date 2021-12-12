const axios = require("axios");
const qs = require('qs');
const fs = require('fs');
const template = require('./template');


const sendme = (type) => {

    console.log(template[type](""))
}


