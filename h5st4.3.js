const CryptoJS = require("crypto-js");
const axios = require("axios");
const ADLER32 = require("adler-32");

class h5st {
    constructor(cookieStr, userAgent, config, url) {
        this.cookieStr = cookieStr;
        this.userAgent = userAgent;

        if (url) {
            try {
                this.url = url;
                this.origin = new URL(url).origin;
            } catch (e) {
                console.log("url传递错误");
            }
        }

        this.map = new Map();

        this.settings = {
            debug: !1, preRequest: !1, timeout: 2,
        };
        var ax = {
            DYNAMIC_TOKEN: "WQ_dy_tk_s", DYNAMIC_ALGORITHM: "WQ_dy_algo_s", VK: "WQ_vk1",
        };
        this.Sb = {
            UNSIGNABLE_PARAMS: 1, APPID_ABSENT: 2, TOKEN_EMPTY: 3, GENERATE_SIGNATURE_FAILED: 4, UNHANDLED_ERROR: -1
        };

        this._storagetokenKey = ax.DYNAMIC_TOKEN;
        this._storageAlgnKey = ax.DYNAMIC_ALGORITHM;
        this._storageFpKey = ax.VK;
        this._token = "";
        this._defaultToken = "";
        this._isNormal = !1;
        this._appId = "";

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

        this._version = "4.3";
        this._fingerprint = "";
        config = Object.assign({}, this.settings, config);
        this.__iniConfig(config);
    }

    Cw() {
    }

    Mw(t) {
        function jw(t, r) {
            r = r || 0;
            return t.slice(r);
        }

        if (t) {
            var args = Array.from(arguments).slice(1);
            var slicedArgs = jw(args);
            console.log("[sign]", ...slicedArgs);
        }
    }

    EC() {
        return this.OC(arguments);
    }

    OC(e) {
        var that = this;

        function jC(t) {
            if (that.cookieStr) {
                var r = new RegExp("(^| )" + t + "(?:=([^;]*))?(;|$)"), n = that.cookieStr.match(r);
                if (!n || !n[2]) return "";
                var e = n[2];
                try {
                    return /(%[0-9A-F]{2}){2,}/.test(e) ? decodeURIComponent(e) : unescape(e);
                } catch (t) {
                    return unescape(e);
                }
            }
        }

        function bw() {
            var t, r = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, n = r.size,
                e = void 0 === n ? 10 : n, o = r.dictType, i = void 0 === o ? "number" : o, u = r.customDict, a = "";
            if (u && "string" == typeof u) t = u; else switch (i) {
                case "alphabet":
                    t = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
                    break;
                case "max":
                    t = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-";
                    break;
                default:
                    t = "0123456789";
            }
            for (; e--;) a += t[(Math.random() * t.length) | 0];
            return a;
        }

        // 获取pp
        function getPP() {
            var pp = {};
            var s = jC("pwdt_id");
            var f = jC("pin");
            var c = jC("pt_pin");
            s && (pp.p1 = s);
            f && (pp.p2 = f);
            c && (pp.p3 = c);
            return pp;
        }

        // 获取sua
        function getSua() {
            var o = new RegExp("Mozilla/5.0 \\((.*?)\\)");
            // i = this.window.navigator.userAgent.match(o);
            var i = that.userAgent.match(o);
            return i && i[1] ? i[1] : "";
        }

        // 获取referer
        function getReferer() {
            const e = new RegExp("[^?]*"), o = document.referrer.match(e);
            return !o || !o[0] ? "" : o[0];
        }

        // 获取extend
        // var wr = {};
        // try {
        //   wr.wd = this.window.navigator.webdriver ? 1 : 0;
        // } catch (t) {}
        // try {
        //   wr.l = !this.navigator.languages || this.navigator.languages.length === 0 ? 1 : 0;
        // } catch (t) {}
        // try {
        //   wr.ls = this.navigator.plugins.length;
        // } catch (t) {}
        // try {
        //   let xr = 0;
        //   if ("cdc_adoQpoasnfa76pfcZLmcfl_Array" in this.window || "cdc_adoQpoasnfa76pfcZLmcfl_Promise" in this.window || "cdc_adoQpoasnfa76pfcZLmcfl_Symbol" in this.window) {
        //     xr |= 1;
        //   }
        //   if ("$chrome_asyncScriptInfo" in this.window.document || "$cdc_asdjflasutopfhvcZLmcfl_" in this.window.document) {
        //     xr |= 2;
        //   }
        //   wr.wk = xr;
        // } catch (t) {}
        // try {
        //   wr.bu1 = sx;
        // } catch (t) {}
        // try {
        //   Dr = 0;
        //   Sr = this.window.location.host.indexOf("sz.jd.com") !== -1 || this.window.location.host.indexOf("ppzh.jd.com") !== -1;
        //   Sr && this.document.body.innerHTML.indexOf("diantoushi.com") !== -1 && (Dr |= 1);
        //   Sr && -1 !== this.document.body.innerHTML.indexOf("xiaowangshen.com") && (Dr |= 2);
        //   wr.bu2 = Dr;
        // } catch (t) {}
        // try {
        //   wr.bu3 = this.document.head.childElementCount;
        // } catch (t) {}
        // 获取pp1
        function getPP1() {
            var n = jC("pwdt_id"), e = jC("pin");
            var a = jC("pt_pin");
            if (!n && !e && !a) {
                var c = that.cookieStr;
                if (c) return c;
            }
            return "";
        }

        let vn = {
            pp: getPP(), sua: getSua(), random: bw({
                size: 10, dictType: "max", customDict: null,
            }), referer: "", v: "h5_file_v4.3.1", extend: {
                wd: 0, l: 0, ls: 0, wk: 0, bu1: "0.1.7",
            },
        };

        if (e == 0) {
            vn.wd = 0; // this.navigator.webdriver ? 1 : 0;
            vn.l = "zh-CN"; // this.navigator.language;
            vn.ls = "zh-CN,zh"; //this.navigator.languages.join(",");
            vn.ml = 0; // this.navigator.mimeTypes.length;
            vn.pl = 0; // this.navigator.plugins.length;
            vn.av = this.navigator.appVersion;
            vn.ua = this.userAgent; // this.window.navigator.userAgent;
            vn.pp1 = getPP1();
            vn.w = 1536; // this.window.screen.width;
            vn.h = 864; // this.window.screen.height;
            vn.ow = 1536; // this.window.outerWidth;
            vn.oh = 864; // this.window.outerHeight;
            vn.url = this.url; // this.location.href;
            vn.og = this.origin; // this.location.origin;
            vn.pf = undefined; // this.window.platform;
            vn.pr = 1.25; // this.window.devicePixelRatio;
            vn.re = ""; // this.document.referrer;
        }
        return vn;
    }

    getSync(e) {
        return this.map.get(e);
    }

    removeSync(e) {
        this.map.delete(e);
    }

    setSync(k, v) {
        this.map.set(k, v);
    }

    __iniConfig(t) {
        var h = t.appId, l = t.debug, p = t.onSign, d = t.onRequestToken, y = t.onRequestTokenRemotely;
        ("string" !== typeof t.appId || !t.appId) && console.error("settings.appId must be a non-empty string");
        this._appId = h || "";
        if (this._appId) {
            this._storagetokenKey = `${this._storagetokenKey}_${this._appId}_${this._version}`;
            this._storageAlgnKey = `${this._storageAlgnKey}_${this._appId}_${this._version}`;
            this._storageFpKey = `${this._storageFpKey}_${this._appId}_${this._version}`;
        }
        this._debug = Boolean(l);
        this._onSign = "function" == typeof p ? p : this.Cw;
        this._onRequestToken = "function" == typeof d ? d : this.Cw;
        this._onRequestTokenRemotely = "function" == typeof y ? y : this.Cw;
        this.Mw(this._debug, `create instance with appId=${this._appId}`);
        this._onRequestToken({
            code: 0, message: "use normalToken",
        });
        this._onRequestTokenRemotely({
            code: 200, message: "",
        });
    }

    __genDefaultKey(t, r, n, e) {
        function _w(t) {
            return (t + String.prototype.slice.call("===", (t.length + 3) % 4)).replace(/-/g, "+").replace(/_/g, "/");
        }

        const p = `${t}${r}${n}${e}Z=<J_2`;

        const y = CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Base64.parse(_w(this.__parseToken(t, 16, 28))));
        const g = y.match(/^[123]([x+][123])+/);

        let v = "";
        if (g) {
            const m = g[0].split("");
            let x = "";

            const s = this;
            Array.prototype.forEach.call(m, (r) => {
                if (isNaN(r)) {
                    if (["+", "x"].includes(r)) x = r;
                } else {
                    const c = `local_key_${r}`;
                    if (this._defaultAlgorithm[c]) {
                        switch (x) {
                            case "+":
                                v = `${v}${s.__algorithm(c, p, t)}`;
                                break;
                            case "x":
                                v = s.__algorithm(c, v, t);
                                break;
                            default:
                                v = s.__algorithm(c, p, t);
                        }
                    }
                }
            });
        }

        this.Mw(this._debug, `__genDefaultKey input=${p},express=${y},key=${v}`);
        return v;
    }

    __algorithm(t, r, n) {
        var f = this._defaultAlgorithm[t];
        return t === "local_key_3" ? f(r, n).toString(CryptoJS.enc.Hex) : f(r).toString(CryptoJS.enc.Hex);
    }

    __parseToken(t, r, n) {
        if (t) return String.prototype.slice.call(t, r, n);
        return "";
    }

    __parseAlgorithm(t, r) {
        if (t && r) {
            this._token = t || "";
            this.__genKey = (r && new Function(`return ${r}`)()) || null;
            this._isNormal = this._token && this.__genKey;
            return this._isNormal;
        }
        return false;
    }

    __genSignParams(t, r, n, e) {
        return `${n};${this._fingerprint};${this._appId};${this._isNormal ? this._token : this._defaultToken};${t};${this._version};${r};${e}`;
    }

    __genSign(t, r) {
        var y = Array.prototype.map
            .call(r, function (t) {
                return t.key + ":" + t.value;
            })
            .join("&");
        var d = CryptoJS.HmacSHA256(y, t).toString(CryptoJS.enc.Hex);
        this.Mw(this._debug, `__genSign, paramsStr:${y}, signedStr:${d}`);
        return d;
    }

    async __requestDeps() {
        function iC() {
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

        this.Mw(this._debug, "__requestDeps start.");
        this._fingerprint = this.getSync(this._storageFpKey);
        if (this._fingerprint) {
            this.Mw(this._debug, `__requestDeps use cache fp, fp:${this._fingerprint}`);
        } else {
            this.removeSync(this._storageAlgnKey);
            this.removeSync(this._storagetokenKey);
            this._fingerprint = iC();
            this.setSync(this._storageFpKey, this._fingerprint, {expire: 3600 * 24 * 365});
            this.Mw(this._debug, `__requestDeps use new fp, fp:${this._fingerprint}`);
        }
        var y = CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Base64.parse(this.getSync(this._storagetokenKey) || ""));
        var p = CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Base64.parse(this.getSync(this._storageAlgnKey) || ""));
        var d = this.__parseAlgorithm(y, p);
        this.Mw(this._debug, `__requestDeps, __parseAlgorithm result:${d}, token:${y}, algo:${p}`);
        if (d) {
            return void this.Mw(this._debug, "__requestDeps end.");
        }
        try {
            await this.__requestAlgorithmOnce();
        } catch (t) {
            this.Mw(this._debug, `__requestDeps request token failed, error: ${t}`);
        }
        this.Mw(this._debug, "__requestDeps end.");
    }

    async __requestAlgorithmOnce() {
        // 通过命名空间 __JDWEBSIGNHELPER_$DATA__ 来获取 token
        // const r = Ew("main.sign#__requestDeps", {});

        // if (r.getToken) {
        //   return r.getToken;
        // }
        await this.__requestAlgorithm();
    }

    async __requestAlgorithm() {
        this.Mw(this._debug, "__requestAlgorithm start.");
        var r = this.EC(0);
        r.ai = this._appId;
        r.fp = this._fingerprint;
        var n = JSON.stringify(r, null, 2);
        this.Mw(this._debug, `__requestAlgorithm envCollect=${n}`);
        var e = CryptoJS.AES.encrypt(n, CryptoJS.enc.Utf8.parse("wm0!@w-s#ll1flo("), {
            iv: CryptoJS.enc.Utf8.parse("0102030405060708"),
        }).ciphertext.toString();
        var dt = {
            fingerprint: this._fingerprint, appId: this._appId, version: this._version, env: e, debug: this._debug,
        };

        try {
            var {data, status} = await axios({
                url: "https://cactus.jd.com/request_algo", method: "post", data: {
                    version: dt.version,
                    fp: dt.fingerprint,
                    appId: dt.appId,
                    timestamp: Date.now(),
                    platform: "web",
                    expandParams: dt.env,
                    fv: "h5_file_v4.3.1",
                }, headers: {
                    "Content-Type": "application/json;charset=utf-8",
                    Origin: "https://cactus.jd.com",
                    Host: "cactus.jd.com",
                    accept: "*/*",
                    "User-Agent": this.userAgent,
                },
            });
            var i = {
                code: status, message: "",
            };
            // r && r(i);
            if (status == 200 && data && data.data && data.data.result) {
                var c = data.data.result;
                if (c.algo && c.tk && c.fp) {
                    var l = c.fp === this._fingerprint, p = l ? this.getSync(this._storageFpKey, 1) : "",
                        d = p && c.fp === p;
                    if (d) {
                        var z = this.__parseToken(c.tk, 13, 15);
                        var x = parseInt(z, 16);
                        var w = x * 60 * 60;
                        this.setSync(this._storagetokenKey, CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(c.tk)), {
                            expire: w,
                        });
                        this.setSync(this._storageAlgnKey, CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(c.algo)), {
                            expire: w,
                        });
                    }
                    this.Mw(this._debug, `__requestAlgorithm request success!, check memory fp:${l}, check storage fp:${d}, token:${c.tk}, storageFp:${p}, fp:${c.fp}`);
                } else {
                    throw new Error("data.result format error.");
                }
            } else {
                throw new Error("request params error.");
            }
        } catch (error) {
            throw new Error(`request error, ${error.code}, ${error.message}`);
        }
        this.Mw(this._debug, "__requestAlgorithm end.");
    }

    __checkParams(t) {
        function Wx(t) {
            return "[object Object]" === Object.prototype.toString.call(t);
        }

        function Ix(t) {
            return !!Wx(t) && !Object.keys(t).length;
        }

        function Bw(t) {
            var Sw = ["h5st", "_stk", "_ste"];
            for (var r = Object.keys(t), n = 0; n < r.length; n++) {
                var e = r[n];
                if (Array.prototype.indexOf.call(Sw, e) >= 0) return true;
            }
            return false;
        }

        var d = null;
        if (!this._appId) {
            d = {
                code: this.Sb.APPID_ABSENT, message: "appId is required",
            };
        }
        if (!Wx(t)) {
            d = {
                code: this.Sb.UNSIGNABLE_PARAMS, message: "params is not a plain object",
            };
        }
        if (Ix(t)) {
            d = {
                code: this.Sb.UNSIGNABLE_PARAMS, message: "params is empty",
            };
        }
        if (Bw(t)) {
            d = {
                code: this.Sb.UNSIGNABLE_PARAMS, message: "params contains reserved param name.",
            };
        }
        if (d) return this._onSign(d), null;

        var l = Object.keys(t)
            .sort()
            .map(function (r) {
                return {
                    key: r, value: t[r],
                };
            })
            .filter(function (t) {
                let type = typeof t.value;
                return ("number" == type && !isNaN(t.value)) || "string" == type || "boolean" == type;
            });

        if (l.length === 0) {
            this._onSign({
                code: this.Sb.UNSIGNABLE_PARAMS, message: 'params is empty after excluding "unsafe" params',
            });
            return null;
        }
        return l;
    }

    __makeSign(t, r) {
        function Ab() {
            var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : Date.now(),
                e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "yyyy-MM-dd", n = new Date(t),
                r = e, o = {
                    "M+": n.getMonth() + 1,
                    "d+": n.getDate(),
                    "D+": n.getDate(),
                    "h+": n.getHours(),
                    "H+": n.getHours(),
                    "m+": n.getMinutes(),
                    "s+": n.getSeconds(),
                    "w+": n.getDay(),
                    "q+": Math.floor((n.getMonth() + 3) / 3),
                    "S+": n.getMilliseconds(),
                };
            return (/(y+)/i.test(r) && (r = r.replace(RegExp.$1, "".concat(n.getFullYear()).substr(4 - RegExp.$1.length))), Object.keys(o).forEach(function (t) {
                    if (new RegExp("(".concat(t, ")")).test(r)) {
                        var e = "S+" === t ? "000" : "00";
                        r = r.replace(RegExp.$1, 1 == RegExp.$1.length ? o[t] : "".concat(e).concat(o[t]).substr("".concat(o[t]).length));
                    }
                }), r);
        }

        function mC(t) {
            var Y = {
                magic: "tk", version: "02", platform: "w", expires: "41", producer: "l", expr: BC(), cipher: xC(t),
            };
            Y.adler32 = wC(Y.magic + Y.version + Y.platform + Y.expires + Y.producer + Y.expr + Y.cipher);
            return Y.magic + Y.version + Y.platform + Y.adler32 + Y.expires + Y.producer + Y.expr + Y.cipher;
        }

        function BC() {
            var I = bw({
                size: 32, dictType: "max", customDict: null,
            }), q = ["1", "2", "3"];
            for (var G = ["+", "x"], H = 2 + Math.floor(Math.random() * 4), K = "", R = 0; R < H; R++) (K += q[Math.floor(Math.random() * 3)]), R < H - 1 && (K += G[Math.floor(Math.random() * 2)]);
            K.length < 9 && (K += I.substr(0, 9 - K.length));
            var F = CryptoJS.enc.Utf8.parse(K), Y = CryptoJS.enc.Base64.stringify(F);
            return Lw(Y);
        }

        function bw() {
            var t, r = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, n = r.size,
                e = void 0 === n ? 10 : n, o = r.dictType, i = void 0 === o ? "number" : o, u = r.customDict, a = "";
            if (u && "string" == typeof u) t = u; else switch (i) {
                case "alphabet":
                    t = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
                    break;
                case "max":
                    t = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-";
                    break;
                default:
                    t = "0123456789";
            }
            for (; e--;) a += t[(Math.random() * t.length) | 0];
            return a;
        }

        function Lw(t) {
            return t.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
        }

        function xC(t) {
            bw({
                size: 32, dictType: "max", customDict: null,
            });
            var k = "";
            var L = Date.now();
            var M = "0J";
            var O = "+WzD<U36rlTf";
            var E = bC(t, L, M, O);
            k += zC(E);
            k += zC(M);
            k += zC(O);
            k += DC(L);
            k += zC(t);
            var P = CryptoJS.enc.Hex.parse(k);
            var T = CryptoJS.AES.encrypt(P, CryptoJS.enc.Utf8.parse("ML0Qq&DS81pP/an@"), {iv: CryptoJS.enc.Utf8.parse("0102030405060708")});
            return Lw(CryptoJS.enc.Base64.stringify(T.ciphertext));
        }

        function bC(t, r, n, e) {
            var V = new Uint8Array(16);
            Array.prototype.forEach.call(V, function (r, n, e) {
                e[n] = t.charCodeAt(n);
            });
            var Q = AC(r), $ = new Uint8Array(2);
            Array.prototype.forEach.call($, function (t, r, e) {
                e[r] = n.charCodeAt(r);
            });
            var tt = new Uint8Array(12);
            Array.prototype.forEach.call(tt, function (t, r, n) {
                n[r] = e.charCodeAt(r);
            });
            var nt = new Uint8Array(38);
            nt.set($), nt.set(tt, 2), nt.set(Q, 14), nt.set(V, 22);
            var ot = ADLER32.buf(nt);
            ot >>>= 0;
            var it = "00000000" + ot.toString(16);
            return it.substr(it.length - 8);
        }

        function AC(t) {
            var j = void 0;
            j = new ArrayBuffer(2);
            new DataView(j).setInt16(0, 256, !0);
            var I = new Int16Array(j)[0] === 256;
            var E = Math.floor(t / Math.pow(2, 32));
            var W = t % Math.pow(2, 32);
            var P = new ArrayBuffer(8);
            var O = new DataView(P);
            I ? (O.setUint32(0, W, I), O.setUint32(4, E, I)) : (O.setUint32(0, E, I), O.setUint32(4, W, I));
            return new Uint8Array(P);
        }

        function zC(t) {
            var u = new Uint8Array(t["length"]);
            return (Array.prototype.forEach.call(u, function (r, n, e) {
                    e[n] = t.charCodeAt(n);
                }), CC(u));
        }

        function CC(t) {
            return Array.prototype.map
                .call(t, function (t) {
                    var e = "00" + (t & 255).toString(16);
                    return Array.prototype.slice.call(e, -2);
                })
                .join("");
        }

        function DC(t) {
            return CC(AC(t));
        }

        function wC(t) {
            var l = ADLER32.str(t) >>> 0;
            var d = "00000000" + l.toString(16);
            return d.substr(d.length - 8);
        }

        var A = "";
        var C = Date.now();
        var f = Ab(C, "yyyyMMddhhmmssSSS");
        var z = f + "22";
        this._isNormal ? (A = this.__genKey(this._token, this._fingerprint, z, this._appId, this.algos).toString() || "") : ((this._defaultToken = mC(this._fingerprint)), (A = this.__genDefaultKey(this._defaultToken, this._fingerprint, z, this._appId)));

        if (!A) {
            if (this._token || this._defaultToken) {
                this._onSign({
                    code: this.Sb.GENERATE_SIGNATURE_FAILED, message: "generate key failed",
                });
            } else {
                this._onSign({
                    code: this.Sb.TOKEN_EMPTY, message: "token is empty",
                });
            }
            return {};
        }
        var m = this.__genSign(A, t);
        var d = Array.prototype.map
            .call(t, function (t) {
                return t.key;
            })
            .join(",");
        var w = 1;
        var g = this.__genSignParams(m, C, f, r);
        this.Mw(this._debug, "__makeSign, result:" + JSON.stringify({
            key: A, signStr: m, _stk: d, _ste: w, h5st: g,
        }, null, 2));
        this._onSign({
            code: 0, message: "success",
        });
        return {
            _stk: d, _ste: w, h5st: g,
        };
    }

    __collect() {
        var n = this.EC(1);
        n.fp = this._fingerprint;
        var e = JSON.stringify(n, null, 2);
        this.Mw(this._debug, `__collect envCollect=${e}`);
        var i = CryptoJS.AES.encrypt(e, CryptoJS.enc.Utf8.parse("&d74&yWoV.EYbWbZ"), {
            iv: CryptoJS.enc.Utf8.parse("0102030405060708"),
        });
        return i.ciphertext.toString();
    }

    async sign(r) {
        try {
            var Ot = Date.now();
            var Pt = this.__checkParams(r);
            if (Pt == null) {
                return r;
            }
            await this.__requestDeps();
            var kt = this.__collect();
            var Tt = this.__makeSign(Pt, kt);
            this.Mw(this._debug, `sign elapsed time!${Date.now() - Ot}ms`);
            return Object.assign({}, r, Tt);
        } catch (e) {
            var a = {
                code: this.Sb.UNHANDLED_ERROR, message: "unknown error",
            };
            this._onSign(a);
            this.Mw(this._debug, `unknown error!${e.message}`);
            return r;
        }
    }
}

async function main() {
    var cookieStr = "",
        userAgent = "jdapp;android;11.8.0;;;M/5.0;appBuild/98730;ef/1;ep/%7B%22hdid%22%3A%22JM9F1ywUPwflvMIpYPok0tt5k9kW4ArJEU3lfLhxBqw%3D%22%2C%22ts%22%3A1684847465219%2C%22ridx%22%3A-1%2C%22cipher%22%3A%7B%22sv%22%3A%22CJO%3D%22%2C%22ad%22%3A%22DJdtZNdtZNY1DJYmCJDuCq%3D%3D%22%2C%22od%22%3A%22DwO5DJrtZwG5ZNCyDJu3ZK%3D%3D%22%2C%22ov%22%3A%22CzK%3D%22%2C%22ud%22%3A%22DJdtZNdtZNY1DJYmCJDuCq%3D%3D%22%7D%2C%22ciphertype%22%3A5%2C%22version%22%3A%221.2.0%22%2C%22appname%22%3A%22com.jingdong.app.mall%22%7D;jdSupportDarkMode/0;Mozilla/5.0 (Linux; Android 11; Redmi K20 Pro Build/RKQ1.200826.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/113.0.5672.77 Mobile Safari/537.36";
    var h5stObj = new h5st(cookieStr, userAgent, {
        debug: true, appId: "689e8",
    });

    var bodyStr = JSON.stringify({
        "activityId": "28irax3jtRhwJdyBCMSeH8JoiSEp",
        "closePagination": "1",
        "pageNum": "-1",
        "innerAnchor": "",
        "groupAnchor": "",
        "innerExtId": "",
        "hideTopFoot": "",
        "hideHeadBar": "",
        "multiTopTabDirect": "",
        "innerLinkBase64": "",
        "innerIndex": "1",
        "focus": "",
        "forceTop": "",
        "addressId": "9014517300",
        "posLng": "",
        "posLat": "",
        "homeLng": "",
        "homeLat": "",
        "homeCityLng": "",
        "homeCityLat": "",
        "gps_area": "",
        "headId": "",
        "headArea": "",
        "warehouseId": "",
        "jxppGroupid": "",
        "jxppFreshman": "",
        "dcId": "",
        "babelChannel": "",
        "mitemAddrId": "",
        "geo": {"lng": "", "lat": ""},
        "flt": "",
        "jda": "235085212.1668674419579843201741.1668674419.1670295198.1670305038.69",
        "topNavStyle": "",
        "url": "https://pro.m.jd.com/mall/active/5xW8ZqL2j9nFNNmVbKKGDcukHVk/index.html?forceCurrentView=1&preventPV=1",
        "fullUrl": "https://pro.m.jd.com/mall/active/5xW8ZqL2j9nFNNmVbKKGDcukHVk/index.html?forceCurrentView=1&preventPV=1",
        "autoSkipEmptyPage": false,
        "paginationParam": "2",
        "transParam": "{\"bsessionId\":\"266c2957-5f9c-4e3e-b603-38f8238a9adb\",\"babelChannel\":\"\",\"actId\":\"00379505\",\"enActId\":\"8tHNdJLcqwqhkLNA8hqwNRaNu5f\",\"pageId\":\"4060201\",\"encryptCouponFlag\":\"1\",\"requestChannel\":\"h5\",\"jdAtHomePage\":\"0\",\"utmFlag\":\"0\",\"locType\":\"1\"}",
        "mtm_source": "",
        "mtm_subsource": "",
        "USER_FLAG_CHECK": ""
    });
    try {
        var a = await h5stObj.sign({
            functionId: "qryH5BabelFloors", appid: "pages-factory", body: CryptoJS.SHA256(bodyStr).toString(),
        });
        console.log(a);

        var params = `functionId=qryH5BabelFloors&body=${encodeURIComponent(bodyStr)}&appid=pages-factory&h5st=${a.h5st || ""}`;
        console.log(params);

        const {data, status} = await axios({
            method: "POST", url: `https://api.m.jd.com/api?${params}`, headers: {
                Referer: "https://h5.m.jd.com/", "User-Agent": userAgent,
            },
        });
        console.log(data);
        console.log(status);
    } catch (error) {
        console.error(error.message);
    }
}

main();
