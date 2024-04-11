const CryptoJS = require("crypto-js");
const {BaseUtils} = require('./baseUtils');
const {BaseH5st} = require("./baseH5st");
const ADLER32 = require("adler-32");
const jsdom = require("jsdom");
const axios = require("axios");
const qs = require("qs");
const https = require('https');


class H5st extends BaseH5st {
    constructor(cookieStr, userAgent, config, url) {
        super();

        const {JSDOM} = jsdom;
        let dom = new JSDOM(``, {
            url: url,
            userAgent,
        });

        global.window = dom.window
        global.document = window.document

        global.location = {
            ...window.location,
        }

        global.navigation = {
            ...window.navigation,
        }

        global.screen = {
            availHeight: 1032,
            availLeft: 0,
            availTop: 0,
            availWidth: 1920,
            colorDepth: 24,
            height: 1080,
            isExtended: false,
            onchange: null,
            orientation: {
                ScreenOrientation: {angle: 0, type: 'landscape-primary', onchange: null}
            },
            pixelDepth: 24,
            width: 1920
        };
        window.screen = screen
        window.navigation = navigation
        global.navigator = window.navigator

        global.localStorage = window.localStorage
        global.history = window.history

        new BaseUtils();


        let ox = {
            DYNAMIC_TOKEN: 'WQ_dy_tk_s',
            DYNAMIC_ALGORITHM: 'WQ_dy_algo_s',
            VK: 'WQ_vk1'
        }

        this._storagetokenKey = ox["DYNAMIC_TOKEN"];
        this["_storageAlgnKey"] = ox["DYNAMIC_ALGORITHM"];
        this["_storageFpKey"] = ox.VK;
        this._token = "";
        this["_defaultToken"] = "";
        this._isNormal = false;
        this["_appId"] = "";
        this._defaultAlgorithm = {
            local_key_1: CryptoJS.MD5, local_key_2: CryptoJS.SHA256, local_key_3: CryptoJS.HmacSHA256,
        };
        this.algos = {
            MD5: CryptoJS.MD5,
            SHA256: CryptoJS.SHA256,
            SHA512: CryptoJS.SHA512,
            HmacSHA256: CryptoJS.HmacSHA256,
            HmacSHA512: CryptoJS.HmacSHA512,
            HmacMD5: CryptoJS.HmacMD5,
        };
        this["_version"] = "4.3";
        this["_fingerprint"] = "";
        config = Object.assign({}, this.settings, config);
        this.__iniConfig(config);
    }

    __iniConfig(t) {
        ("string" !== typeof t.appId || !t.appId) && console["error"]("settings.appId must be a non-empty string");
        this._appId = t.appId || "";
        if (this._appId) {
            this._storagetokenKey = `${this._storagetokenKey}_${this._appId}_${this._version}`;
            this._storageAlgnKey = `${this._storageAlgnKey}_${this._appId}_${this._version}`;
            this._storageFpKey = `${this._storageFpKey}_${this._appId}_${this._version}`;
        }
        this["_debug"] = Boolean(t["debug"]);
        this["_onSign"] = baseUtils.isFunction(t["onSign"]) ? t["onSign"] : baseUtils.emptyFunction;
        this["_onRequestToken"] = baseUtils.isFunction(t["onRequestToken"]) ? t["onRequestToken"] : baseUtils.emptyFunction;
        this["_onRequestTokenRemotely"] = baseUtils.isFunction(t["onRequestTokenRemotely"]) ? t["onRequestTokenRemotely"] : baseUtils.emptyFunction;
        this._log("create instance with appId="["concat"](this["_appId"]));
        this._onRequestToken({
            code: 0, message: "use normalToken",
        });
        this._onRequestTokenRemotely({
            code: 200, message: "",
        });

    }

    __genDefaultKey(t, r, n, e) {
        return super.__genDefaultKey(t, `${t}${r}${n}${e}Z=<J_2`);
    }

    __genSignParams(t, r, n, e) {
        return `${n};${this._fingerprint};${this._appId};${this._isNormal ? this._token : this._defaultToken};${t};${this._version};${r};${e}`;
    }

    async __requestDeps() {
        function oA() {
            const X = "kl9i1uct6d";
            const U = aC(X, 3);
            const et = uC();
            const J = fC(X, U);
            const Q = {size: et, num: J};
            const $ = cC(Q) + U + cC({
                size: 12 - et, num: J,
            }) + et;
            const Z = $.split("");
            const tt = Array.prototype.slice.call(Z, 0, 10);
            const V = Array.prototype.slice.call(Z, 10);
            var nt = [];
            for (; tt.length > 0;) nt.push((35 - parseInt(tt.pop(), 36)).toString(36));
            nt = Array.prototype.concat(nt, V);
            return nt.join("");
        }

        function aC(t, r) {
            var D, B = [], j = t.length, _ = tC(t);
            try {
                for (_.s(); !(D = _.n()).done;) {
                    var M = D.value;
                    if (Math.random() * j < r && (B.push(M), --r == 0)) break;
                    j--;
                }
            } catch (t) {
                _.e(t);
            } finally {
                _.f();
            }
            for (var E = "", O = 0; O < B.length; O++) {
                var P = (Math.random() * (B.length - O)) | 0;
                (E += B[P]), (B[P] = B[B.length - O - 1]);
            }
            return E;
        }

        function tC(t, r) {
            var nt;
            if (typeof Object.Symbol === "undefined" || null == t[Symbol.iterator]) {
                if (Array.isArray(t) || (nt = rC(t)) || (r && t && typeof t.length === "number")) {
                    nt && (t = nt);
                    var tt = 0, rt = function () {
                    };
                    return {
                        s: rt, n: function () {
                            var r = {};
                            if (((r.done = !0), tt >= t.length)) return r;
                            var e = {};
                            return (e.done = !1), (e.value = t[tt++]), e;
                        }, e: function (t) {
                            throw t;
                        }, f: rt,
                    };
                }
                throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
            }
            var et, ot = !0, it = !1;
            return {
                s: function () {
                    nt = t[Symbol.iterator]();
                }, n: function () {
                    var n = nt.next();
                    return (ot = n.done), n;
                }, e: function (t) {
                    (it = !0), (et = t);
                }, f: function () {
                    try {
                        !ot && nt.return != null && nt.return();
                    } finally {
                        if (it) throw et;
                    }
                },
            };
        }

        function rC(t, r) {
            if (!t) return;
            if (typeof t === "string") return nC(t, r);
            var D = t.slice(8, -1);
            D === "Object" && t.constructor && (D = t.constructor.name);
            if (D === "Map" || D === "Set") return Array.from(t);
            if ("Arguments" === D || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/["test"](D)) return nC(t, r);
        }

        function nC(t, r) {
            (r == null || r > t.length) && (r = t.length);
            for (var h = 0, l = new Array(r); h < r; h++) l[h] = t[h];
            return l;
        }

        function uC() {
            return (10 * Math.random()) | 0;
        }

        function fC(t, r) {
            for (var d = 0; d < r.length; d++) {
                var y = Array.prototype.indexOf.call(t, r[d]);
                y !== -1 && (t = t.replace(r[d], ""));
            }
            return t;
        }

        function cC(t) {
            var _ = t.size, g = t.num;
            for (var y = ""; _--;) y += g[(Math.random() * g.length) | 0];
            return y;
        }

        this._log("__requestDeps start.");
        this._fingerprint = this.getSync(this._storageFpKey);
        if (this._fingerprint) {
            this._log(`__requestDeps use cache fp, fp:${this._fingerprint}`);
        } else {
            this.removeSync(this._storageAlgnKey);
            this.removeSync(this._storagetokenKey);
            this._fingerprint = oA();
            this.setSync(this._storageFpKey, this._fingerprint, {expire: 3600 * 24 * 365});
            this._log(`__requestDeps use new fp, fp:${this._fingerprint}`);
        }
        if (!this.getSync(this._storagetokenKey) || !this.getSync(this._storageAlgnKey)) {
            try {
                await this.__requestAlgorithmOnce();
            } catch (t) {
                this._log(`__requestDeps request token failed, error: ${t}`);
            }
        }
        var s = CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Base64.parse(this.getSync(this._storagetokenKey) || ""));
        var c = CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Base64.parse(this.getSync(this._storageAlgnKey) || ""));
        var f = this.__parseAlgorithm(s, c);
        this._log(`__requestDeps, __parseAlgorithm result:${f}, token:${s}, algo:${c}`);
        if (!f) {
            throw new Error('获取TK失败')
        }
        this._log("__requestDeps end.");
        return;
    }

    __makeSign(t, r) {
        var s = "";
        var C = Date.now();
        var c = baseUtils.formatDate(C, "yyyyMMddhhmmssSSS");
        var v = c + "22";
        if (this._isNormal) {
            s = this["__genKey"](this["_token"], this["_fingerprint"], v, this["_appId"], this["algos"])["toString"]() || "";
        } else {
            this["_defaultToken"] = this.genLocalTK(this._fingerprint);
            s = this["__genDefaultKey"](this["_defaultToken"], this["_fingerprint"], v, this._appId)
        }

        var f = {};
        if (!s) {
            if (this["_token"] || this["_defaultToken"]) {
                this._onSign({
                    code: this.ErrCodes.GENERATE_SIGNATURE_FAILED,
                    message: "generate key failed",
                });
            } else {
                this._onSign({
                    code: this.ErrCodes.TOKEN_EMPTY,
                    message: "token is empty",
                });
            }
            return f;
        }
        var A = this.__genSign(s, t);
        var m = baseUtils.getDefaultMethod(t, 'map').call(t, function (t) {
            return t["key"];
        }).join(",");
        var b = this["__genSignParams"](A, C, c, r);

        this._log("__makeSign, result:" + JSON.stringify({
            key: s,
            signStr: A,
            _stk: m,
            _ste: 1,
            h5st: b,
        }, null, 2));

        this._onSign({
            code: 0,
            message: "success",
        });
        return {
            _stk: m,
            _ste: 1,
            h5st: b,
        };
    }
}

async function main() {
    var cookieStr = "",
        userAgent = "";
    var h5stObj = new H5st(cookieStr, userAgent, {
            debug: true,
            appId: "ea491",
        },
        "https://shop.m.jd.com/shop/home?shopId=1000014485");

    var t = new Date().getTime()

    var a = await h5stObj.sign({
        functionId: "whx_getShopHomeFloorInfo",
        appid: "shop_m_jd_com",
        body: JSON.stringify({shopId: "1000014485", source: "m-shop"}),
        clientVersion: "12.0.0",
        client: "wh5",
        t
    });
    console.log(a);

    let params = qs.stringify({
        'functionId': 'whx_getShopHomeFloorInfo',
        'body': JSON.stringify({shopId: "1000014485", source: "m-shop"}),
        'appid': 'shop_m_jd_com',
        'clientVersion': '12.0.0',
        'client': 'wh5',
        'h5st': a.h5st,
        t
    });
    console.log(params);

    const agent = new https.Agent({
        ciphers: 'TLS_AES_256_GCM_SHA384',
    });

    const {data, status} = await axios({
        method: "POST",
        url: `https://api.m.jd.com/api`,
        headers: {
            "content-type": "application/x-www-form-urlencoded",
            origin: "https://shop.m.jd.com",
            Referer: "https://shop.m.jd.com/",
            "User-Agent": userAgent,
            "x-referer-page": "https://shop.m.jd.com/shop/home"
        },
        data: params,
        httpsAgent: agent
    });
    console.log(data);
    console.log(status);
}

main();