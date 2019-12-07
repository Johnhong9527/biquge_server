const axios = require("axios");
const http = require('http');
const qs = require("qs");
axios.defaults.timeout = 6000;
module.exports = function (method, url, data) {

    return new Promise((resolve, reject) => {

        axios({
            method,
            url: url + 'aid=74573&cid=9675476',
            // data: data,
        }).then(res => {
            console.log(res)
            resolve(res.data);
        }).catch(err => reject(err));
    });

};