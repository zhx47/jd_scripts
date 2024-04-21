const axios = require('axios');
const url = require('url');
const querystring = require('querystring');

async function parse(urlString) {
    if (!urlString) {
        throw new Error('请提供需要解密的URL')
    }
    const parsedUrl = url.parse(urlString);
    const queryParams = querystring.parse(parsedUrl.query);
    const shareKey = queryParams['shareKey'];
    if (!shareKey) {
        throw new Error('URL非法，未提供shareKey')
    }

    const {data} = await axios.request({
        method: 'post',
        url: 'https://lzkj-isv.isvjcloud.com/prod/cc/interaction/v1/api/user-info/getPageShareId',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
        data: {
            shareKey
        }
    })

    if (data.resp_code !== 0) {
        throw new Error(`接口异常！${JSON.stringify(data)}`)
    }

    let result = querystring.parse(url.parse(data.data).query);
    console.log(`解析成功！\n原始链接：${data.data}\n参数：${JSON.stringify(result)}`)
    return Object.assign(result, {plainUrl: data.data})
}

function test() {
    parse('https://lzkj-isv.isvjcloud.com/prod/cc/interaction/v1/?shareKey=a053bd8cc0c3f8c892ff5f8fe97b1894')
        .then((res) => {
            console.log(res)
        })
}

module.exports = {
    shareParseV1: parse,
    test
}