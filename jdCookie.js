/*
此文件为Node.js专用。其他用户请忽略
 */
//此处填写京东账号cookie。
let CookieJDs = ['pt_key=app_openAAJmoRhMADBdMvcPvk0enHEa5qBckZmsK_ape1XHKw9yhm9mqK_bwOpxLlTcflW4-t8qv1S7YSE;pt_pin=jd_738ce56281d5f;'
]
let IP = '';
// 判断环境变量里面是否有京东ck
if (process.env.JD_COOKIE) {
    if (process.env.JD_COOKIE.indexOf('&') > -1) {
        CookieJDs = process.env.JD_COOKIE.split('&');
    } else if (process.env.JD_COOKIE.indexOf('\n') > -1) {
        CookieJDs = process.env.JD_COOKIE.split('\n');
    } else {
        CookieJDs = [process.env.JD_COOKIE];
    }
}
// if (JSON.stringify(process.env).indexOf('GITHUB') > -1) {
//     console.log(`请勿使用github action运行此脚本,无论你是从你自己的私库还是其他哪里拉取的源代码，都会导致我被封号\n`);
//     !(async () => {
//         await require('./sendNotify').sendNotify('提醒', `请勿使用github action、滥用github资源会封我仓库以及账号`)
//         await process.exit(0);
//     })()
// }

CookieJDs = [...new Set(CookieJDs.filter(item => !!item))]
if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {
};
console.log(`\n====================共${CookieJDs.length}个京东账号Cookie=================\n`);
console.log(`============脚本执行时间：${formatdate(new Date(new Date().getTime() + new Date().getTimezoneOffset() * 60 * 1000 + 8 * 60 * 60 * 1000))}=============\n`)
console.log('>>>>>>>>>>>>>>Faker提醒您：有问题先更新不行在反馈>>>>>>>>>>>>>>>\n')
for (let i = 0; i < CookieJDs.length; i++) {
    if (!CookieJDs[i].match(/pt_pin=(.+?);/) || !CookieJDs[i].match(/pt_key=(.+?);/)) console.log(`\n提示:京东cookie 【${CookieJDs[i]}】填写不规范,可能会影响部分脚本正常使用。正确格式为: pt_key=xxx;pt_pin=xxx;（分号;不可少）\n`);
    CookieJDs[i] = CookieJDs[i].replace(/[\u4e00-\u9fa5]/g, (str) => encodeURI(str));
    const index = (i + 1 === 1) ? '' : (i + 1);
    exports['CookieJD' + index] = CookieJDs[i].trim();
}
let permit = process.env.PERMIT_JS ? process.env.PERMIT_JS.split('&') : '';

if (process.env.DP_POOL) {
    if (permit && permit.filter(x => process.mainModule.filename.includes(x)).length != 0) {
        try {
            require("global-agent/bootstrap");
            global.GLOBAL_AGENT.HTTP_PROXY = process.env.DP_POOL;
            console.log(`\n---------------使用代理池模式---------------\n`);
        } catch {
            throw new Error(`请安装global-agent依赖，才能启用代理！`);

        }
    } else {

    }
}

function formatdate(date) {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    const seconds = ('0' + date.getSeconds()).slice(-2);
    return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
}
