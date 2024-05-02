const CryptoJS = require("crypto-js");
const {BaseH5st} = require("./baseH5st");
const qs = require("qs");
const customAlgorithm = require('./customAlgorithm');

class H5st extends BaseH5st {
    constructor(url, cookieStr, userAgent, config) {
        super(url, cookieStr, userAgent);

        this.v = 'h5_file_v4.7.1'
        this.bu1 = "0.1.5"
        this.collectSecret = "_M6Y?dvfN40VMF[X"

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
        this["_appId"] = "";
        this._defaultAlgorithm = {
            local_key_1: CryptoJS.MD5, local_key_2: CryptoJS.SHA256, local_key_3: CryptoJS.HmacSHA256,
        };
        this.algos = customAlgorithm;
        this["_version"] = "4.7";
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
        return super.__genDefaultKey(t, `${t}${r}${n}${e}hh1BNE`);
    }

    __genSign(t, r) {
        var y = baseUtils.getDefaultMethod(r, 'map')["call"](r, function (t) {
            return t["key"] + ":" + t.value;
        })["join"]("&");
        let d = this.algos.SHA256(`${t}${y}${t}`).toString(CryptoJS.enc.Hex);
        this._log(`__genSign, paramsStr:${y}, signedStr:${d}`);
        return d;
    }

    __genSignParams(t, r, n, e) {
        return `${n};${this._fingerprint};${this._appId};${this._token};${t};${this._version};${r};${e}`;
    }

    async __requestDeps() {
        function oA() {
            const X = "1uct6d0jhq";
            const U = aC(X, 5);
            const et = uC();
            const J = fC(X, U);
            const Q = {size: et, num: J};
            const $ = cC(Q) + U + cC({
                size: 10 - et, num: J,
            }) + et;
            const Z = $.split("");
            const tt = Array.prototype.slice.call(Z, 0, 15);
            const V = Array.prototype.slice.call(Z, 15);
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
            // TODO fp算法好像有点问题
            this._fingerprint = oA();
            // this._fingerprint = 'm66zt5gy9nm69m67';
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
    }

    __makeSign(t, r) {
        var C = Date.now();
        var c = baseUtils.formatDate(C, "yyyyMMddhhmmssSSS");
        var v = c + "97";
        var s = this["__genKey"](this["_token"], this["_fingerprint"], v, this["_appId"], this["algos"])["toString"]() || "";

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
            return {};
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

    // TEST 魔改算法
    aes(message, key, iv) {
        var temp = this.algos.AES.encrypt(message, CryptoJS.enc.Utf8.parse(key), {iv: CryptoJS.enc.Utf8.parse(iv)})
        return this.algos.Base64.encode(temp.ciphertext);
    }
}

async function test(cookieStr, userAgent) {
    if (!cookieStr || !userAgent) {
        throw new Error('测试请给ck和ua')
    }

    var h5stObj = new H5st("https://plus.m.jd.com/rights/windControl", cookieStr, userAgent, {
        debug: true,
        appId: "b63ff",
    });

    var a = await h5stObj.sign({
        appid: "plus_business",
        loginType: "2",
        loginWQBiz: '',
        functionId: "windControl_queryScore_v1",
        body: JSON.stringify({}),
    });

    let params = qs.stringify({
        appid: "plus_business",
        loginType: "2",
        loginWQBiz: '',
        functionId: "windControl_queryScore_v1",
        body: JSON.stringify({}),
        'h5st': a.h5st,
    });
    console.log(params);

    try {
        const {data} = await api({
            method: "POST",
            url: `https://api.m.jd.com/api?functionId=windControl_queryScore_v1`,
            headers: {
                "content-type": "application/x-www-form-urlencoded",
                origin: "https://plus.m.jd.com",
                Referer: "https://plus.m.jd.com/rights/windControl",
                "User-Agent": userAgent,
                "x-referer-page": "https://plus.m.jd.com/rights/windControl"
            },
            data: params
        });
        console.log(data);
    } catch (e) {
        console.log(e.message)
    }
}

module.exports = {
    H5st,
    test
}