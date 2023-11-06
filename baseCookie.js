var cookies = {
    __jda: {}, __jdb: {}, __jdc: {}, __jdv: {}, mba_muid: {}
}

function genUuid() {
    return (new Date).getTime() + "" + parseInt(2147483647 * Math.random())
}

function setCookie(e, t, r, o) {
    if (e) {
        var i = "";
        if (o) {
            var a = new Date;
            a.setTime(a.getTime() + o);
            i = a.getTime();
        }
        cookies[e].value = t;
        cookies[e].expires = i;
    }
}

function isPrey(e) {
    if (e >= 100) return !0;
    var t = lr.uuid, r = t.substr(t.length - 2);
    return !!r && 1 * r < e
}

function setJdv(e, t, r) {
    var o = "";
    o = isPrey(10) && (!e || e.length > 400) ? t + "|direct|-|none|-|" + (new Date).getTime() : e;
    var i = r ? lr.ckJdvEmbeddedExp : lr.ckJdvExp;
    setCookie(lr.ckJdv || "__jdv", o, lr.ckDomain, i)
}

function genHash(e) {
    var t, r = 1, o = 0;
    if (e) for (r = 0, t = e.length - 1; t >= 0; t--) r = 0 !== (o = 266338304 & (r = (r << 6 & 268435455) + (o = e.charCodeAt(t)) + (o << 14))) ? r ^ o >> 21 : r;
    return r
}

var lr = {
    "ckJda": "__jda",
    "ckJdb": "__jdb",
    "ckJdc": "__jdc",
    "ckJdu": "__jdu",
    "ckJdv": "__jdv",
    "ckJdaExp": 15552000000,
    "ckJdbExp": 1800000,
    "ckJduExp": 15552000000,
    "ckJdvExp": 1296000000,
    "ckJdvEmbeddedExp": 86400000,
    "ckWxAppCkExp": 15552000000,
    "mtSubsiteExp": 31536000000,
    "refUrl": "",
    "ckmba_muid": "mba_muid",
    "ckmba_muidExp": 15552000000,
    "ckDomain": "jd.com",
    "_mbaMuidSeq": []
}

function getBaseCookie() {
    var e, t, r, o, i = [""], a = [""], n = [""], d = [""], l = parseInt((new Date).getTime() / 1e3), c = 0, s = 1,
        u = "direct", p = "-", g = "none", _ = "-";
    o = genUuid();
    e = l;
    t = l;
    lr.uuid = o;
    var M, f = [], S = a.length < 4, v = null, w = !1;
    var C, k = lr.refUrl && lr.refUrl.split("/")[2], A = !1;
    if (k && k.indexOf(lr.ckDomain) < 0) {
        for (C = lr.seo, m = 0; m < C.length; m++) {
            var T = C[m].split(":");
            if (k.indexOf(T[0].toLowerCase()) > -1 && lr.refUrl.indexOf((T[1] + "=").toLowerCase()) > -1) {
                var D = null;
                /[^\x00-\xff]/.test(D) && (D = encodeURIComponent(D)), f.push(T[0]), f.push("-"), f.push("organic"), f.push(D || "not set"), _ = f[3], A = !0;
                break
            }
        }
        A || (k.indexOf("zol.com.cn") > -1 ? (f.push("zol.com.cn"), f.push("-"), f.push("cpc"), f.push("not set")) : (f.push(k), f.push("-"), f.push("referral"), f.push("-")))
    }
    M = f.length > 0 && (f[0] !== u || f[1] !== p || f[2] !== g) && "referral" !== f[2];
    if (S || !S && M) {
        u = f[0] || u, p = f[1] || p;
        g = f[2] || g, _ = f[3] || _;
        if (i.length > 5) {
            e = parseInt(i[2], 10);
            t = parseInt(i[4], 10);
            l = parseInt((new Date).getTime() / 1e3);
            s++, c = 1
        } else {
            s = 1, c = 1
        }
    } else {
        c++;
    }
    r || (r = genHash(lr.ckDomain));
    setCookie(lr.ckJda, [r, o, e, t, l, s || 1].join("."), lr.ckDomain, lr.ckJdaExp);
    setCookie(lr.ckJdb, [r, c, o + "|" + s, l].join("."), lr.ckDomain, lr.ckJdbExp);
    setCookie(lr.ckJdc, r, lr.ckDomain);
    if (w || M || n.length < 5) {
        var B = [r, u || "direct", p || "-", g || "none", _ || "-", (new Date).getTime()].join("|");
        setJdv(B = encodeURIComponent(B), r)
    }
    lr._mbaMuidSeq[0] = lr.uuid + "";
    lr._mbaMuidSeq[1] = "1";
    lr._mbaMuidSeq[2] = (new Date).getTime();
    setCookie(lr.ckmba_muid, encodeURI(lr._mbaMuidSeq.join(".")), lr.ckDomain, lr.ckmba_muidExp);
    return '__jda='.concat(cookies['__jda'].value).concat('; __jdb=').concat(cookies['__jdb'].value).concat('; __jdc=').concat(cookies['__jdc'].value).concat('; __jdv=').concat(cookies['__jdv'].value).concat('; mba_muid='.concat(cookies['mba_muid'].value));
}

module.exports.getBaseCookie = getBaseCookie