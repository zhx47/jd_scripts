const axios = require('axios');
const CryptoJS = require("crypto-js");
const url = require('url');
const querystring = require('querystring');

const key = "Hd5W5ONsYKmGm9QA";
const iv = "2JjUvJEAsA2Yog==";

async function parse(urlString) {
    if (!urlString) {
        throw new Error('请提供需要解密的URL')
    }
    const parsedUrl = url.parse(urlString);
    const queryParams = querystring.parse(parsedUrl.query);
    const shareId = queryParams['shareId'];
    if (!shareId) {
        throw new Error('URL非法，未提供shareId')
    }

    const ciphertext = CryptoJS.enc.Base64.stringify(CryptoJS.AES.encrypt(JSON.stringify({
        shareId
    }), CryptoJS.enc.Utf8.parse(key), {
        iv: CryptoJS.enc.Utf8.parse(iv),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    }).ciphertext);

    const {data} = await axios.request({
        method: 'post',
        url: 'https://lzkj-isv.isvjcloud.com/prod/cc/interaction/v2/api/common/getRealShareUrl',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
        },
        data: ciphertext
    })

    if (data.code !== 200) {
        throw new Error(`接口异常！${JSON.stringify(data)}`)
    }

    let plaintext = CryptoJS.AES.decrypt(data.data, CryptoJS.enc.Utf8.parse(key), {
        iv: CryptoJS.enc.Utf8.parse(iv),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    }).toString(CryptoJS.enc.Utf8);
    let result = querystring.parse(url.parse(plaintext).query);
    console.log(`解析成功！\n原始链接：${plaintext}\n参数：${JSON.stringify(result)}`)
    return Object.assign(result, {plainUrl: plaintext})
}

function test() {
    parse('https://lzkj-isv.isvjcloud.com/prod/cc/interaction/v2/landing/share/?shareId=1776206595853877249')
        .then((res) => {
            console.log(res)
        })
}

module.exports = {
    shareParseV2: parse,
    test
}


