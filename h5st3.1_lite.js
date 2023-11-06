const CryptoJS = require("crypto-js");
const ADLER32 = require("adler-32");

var ex = {UNSIGNABLE_PARAMS: 1, APPID_ABSENT: 2, TOKEN_EMPTY: 3, GENERATE_SIGNATURE_FAILED: 4, UNHANDLED_ERROR: -1};
var ab = ["h5st", "_stk", "_ste"];

class h5st {
    constructor(cookieStr, userAgent, config, url) {
        this.cookieStr = cookieStr;
        this.userAgent = userAgent;
        if (url) {
            try {
                this.url = url;
                this.origin = new URL(url).origin;
            } catch (e) {
                console.log('url传递错误')
            }
        }

        if (url) {
            try {
                this.url = url;
                this.origin = new URL(url).origin;
            } catch (e) {
                console.log("url传递错误");
            }
        }

        this.map = new Map();

        this._storageFormatVersionKey = "WQ_lite_f_v";
        this._storageFpKey = "WQ_lite_vk1";
        this._defaultToken = "";
        this._appId = "";
        this._defaultAlgorithm = {
            local_key_1: CryptoJS.MD5, local_key_2: CryptoJS.SHA256, local_key_3: CryptoJS.HmacSHA256,
        };
        this._version = "3.1";
        this._formatVersion = 2.1;
        this._fingerprint = "";
        this.__iniConfig(Object.assign({}, this.settings, config));
    }

    _log() {
        function cb(t, r) {
            r = r || 0;
            for (var n = t.length - r, e = new Array(n); n--;) e[n] = t[n + r];
            return e;
        }

        if (this._debug) {
            var e = cb(arguments);
            console.log(["[sign] "].concat(e));
        }
    }

    __iniConfig(t) {
        function ib(t) {
            return "string" == typeof t;
        }

        function ub(t) {
            return "function" == typeof t;
        }

        function ob() {
        }

        var i = t.appId;
        t.preRequest;
        var u = t.debug;
        t.timeout;
        var a = t.onSign;
        t.onRequestToken, t.onRequestTokenRemotely;
        (!ib(t.appId) || !t.appId) && console.error("settings.appId must be a non-empty string");
        this._appId = i || "";
        if (this._appId) {
            this._storageFormatVersionKey = "".concat(this._storageFormatVersionKey, "_").concat(this._appId);
            this._storageFpKey = "".concat(this._storageFpKey, "_").concat(this._appId);
        }
        this._debug = Boolean(u);
        this._onSign = ub(a) ? a : ob;
        this._log("create instance with appId=".concat(this._appId));
    }

    __genDefaultKey(t, r, n, e) {
        var _, A = this, C = "", O = "".concat(t).concat(r).concat(n).concat(e),
            D = CryptoJS.enc.Base64.parse(((_ = this.__parseToken(t, 16, 28)) + "===".slice((_.length + 3) % 4)).replace(/-/g, "+").replace(/_/g, "/")),
            E = CryptoJS.enc.Utf8.stringify(D).match(/^[1,2,3]{1}([x,+]{1}[1,2,3]{1})+/);
        if (E) {
            var B = E[0].split(""), z = this._defaultAlgorithm, M = "";
            B.forEach(function (r) {
                if (isNaN(r)) ["+", "x"].indexOf(r) >= 0 && (M = r); else {
                    var b = "".concat("local_key_").concat(r);
                    if (z[b]) switch (M) {
                        case "+":
                            C = "".concat(C).concat(A.__algorithm(b, O, t));
                            break;
                        case "x":
                            C = A.__algorithm(b, C, t);
                            break;
                        default:
                            C = A.__algorithm(b, O, t);
                    }
                }
            });
        }
        return C;
    }

    __algorithm(t, r, n) {
        var i = this._defaultAlgorithm[t];
        return t === "local_key_3" ? i(r, n).toString(CryptoJS.enc.Hex) : i(r).toString(CryptoJS.enc.Hex);
    }

    __parseToken(t, r, n) {
        return t ? t.slice(r, n) : "";
    }

    __genSignParams(t, r, n, e) {
        return ["".concat(n), "".concat(this._fingerprint), "".concat(this._appId), "".concat(this._defaultToken), "".concat(t), "".concat(this._version), "".concat(r), "".concat(e)].join(";");
    }

    __genSign(t, r) {
        var f = r
            .map(function (t) {
                return t.key + ":" + t.value;
            })
            .join("&");

        var c = CryptoJS.HmacSHA256(f, t).toString(CryptoJS.enc.Hex);
        this._log("__genSign, paramsStr:".concat(f, ", signedStr:").concat(c));
        return c;
    }

    __requestDeps() {
        function Qx() {
            var j = "0123456789";
            var P = tb(j, 3);
            var L = $x();
            var T = nb(j, P);
            var R = rb({
                size: L, num: T,
            }) + P + rb({
                size: 12 - L, num: T,
            }) + L;
            var N = R.split("");
            var W = [];
            for (; N.length > 0;) W.push(9 - parseInt(N.pop()));
            var F = W.join("");
            return F;
        }

        function tb(t, r) {
            var _ = [];

            var A, C = t.length, O = Zx(t);
            try {
                for (O.s(); !(A = O.n()).done;) {
                    var D = A.value;
                    if (Math.random() * C < r && (_.push(D), --r == 0)) break;
                    C--;
                }
            } catch (t) {
                O.e(t);
            } finally {
                O.f();
            }
            for (var E = "", B = 0; B < _.length; B++) {
                var z = (Math.random() * (_.length - B)) | 0;
                (E += _[z]), (_[z] = _[_.length - B - 1]);
            }
            return E;
        }

        function Zx(t, r) {
            var n;

            if (typeof zd === "undefined" || kw(t) == null) {
                if (Array.isArray(t) || (n = Yx(t)) || (r && t && typeof t.length === "number")) {
                    n && (t = n);
                    var F = 0;
                    return {
                        s: function () {
                        }, n: function () {
                            var r = {done: !0};
                            if (F >= t.length) return r;
                            var o = {};
                            return (o.done = !1), (o.value = t[F++]), o;
                        }, e: function (t) {
                            throw t;
                        }, f: function () {
                        },
                    };
                }
                throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
            }

            var H, K = !0, U = !1;
            return {
                s: function () {
                    // n = Lw(t);
                    n = t[Symbol.iterator]();
                }, n: function () {
                    var i = n.next();
                    return (K = i.done), i;
                }, e: function (t) {
                    (U = !0), (H = t);
                }, f: function () {
                    try {
                        !K && n.return != null && n.return();
                    } finally {
                        if (U) throw H;
                    }
                },
            };
        }

        function Yx(t, r) {
            if (!t) return;
            if (typeof t === "string") return Xx(t, r);
            var V = Object.prototype.toString.call(t).slice(8, -1);
            V === "Object" && t.constructor && (V = t.constructor.name);
            if (V === "Map" || V === "Set") return Mw(t);
            if (V === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(V)) return Xx(t, r);
        }

        function Xx(t, r) {
            (r == null || r > t.length) && (r = t.length);
            for (var f = 0, s = new Array(r); f < r; f++) s[f] = t[f];
            return s;
        }

        function $x() {
            return (Math.random() * 10) | 0;
        }

        function nb(t, r) {
            for (var a = 0; a < r.length; a++) {
                -1 !== t.indexOf(r[a]) && (t = t.replace(r[a], ""));
            }
            return t;
        }

        function rb(t) {
            var p = t.size;
            for (var y = t.num, g = ""; p--;) g += y[(Math.random() * y.length) | 0];
            return g;
        }

        var zt = this.map.get(this._storageFormatVersionKey);
        if (!zt || zt !== this._formatVersion) {
            this._log("__requestDeps, need upgrade format version, storageFormatVersion:".concat(zt, ", _formatVersion:").concat(this._formatVersion));
            this.map.delete(this._storageFpKey);
            // Um.setSync(this._storageFormatVersionKey, this._formatVersion, { expire: 3600 * 24 * 365 });
            this.map.set(this._storageFormatVersionKey, this._formatVersion);
        }
        this._fingerprint = this.map.get(this._storageFpKey);
        if (!this._fingerprint) {
            this._fingerprint = Qx();
            // Um.setSync(this._storageFpKey, this._fingerprint, { expire: 86400 * 365 });
            this.map.set(this._storageFpKey, this._fingerprint);
        }
        this._log("__requestDeps, fp:".concat(this._fingerprint));
    }

    __checkParams(t) {
        function yw(t) {
            return "[object Object]" === Object.prototype.toString.call(t);
        }

        var c = null;
        if (!this._appId) {
            c = {
                code: ex.APPID_ABSENT, message: "appId is required",
            };
        }
        if (!yw(t)) {
            c = {
                code: ex.UNSIGNABLE_PARAMS, message: "params is not a plain object",
            };
        }
        var keys = Object.keys(t);

        if (!keys.length) {
            c = {
                code: ex.UNSIGNABLE_PARAMS, message: "params is empty",
            };
        }

        for (var n = 0; n < keys.length; n++) {
            var e = keys[n];
            if (ab.indexOf(e) >= 0) {
                c = {
                    code: ex.UNSIGNABLE_PARAMS, message: "params contains reserved param name.",
                };
            }
        }

        if (c) {
            this._onSign(c);
            return null;
        }

        var u = keys
            .sort()
            .map(function (r) {
                return {
                    key: r, value: t[r],
                };
            })
            .filter(function (t) {
                var r = t.value, n = typeof r;
                return ("number" == n && !isNaN(r)) || "string" == n || "boolean" == n;
            });
        if (0 === u.length) {
            var h = {
                code: ex.UNSIGNABLE_PARAMS, message: 'params is empty after excluding "unsafe" params',
            };
            this._onSign(h);
            return null;
        }
        return u;
    }

    __makeSign(t, r) {
        function nx() {
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

        function yb(t) {
            var I = {
                magic: "tk", version: "02", platform: "w", expires: "41", producer: "l", expr: Cb(), cipher: mb(t),
            };
            var c = ADLER32.str(I.magic + I.version + I.platform + I.expires + I.producer + I.expr + I.cipher);
            c = c >>> 0;
            var f = "00000000" + c.toString(16);
            I.adler32 = f.substr(f.length - 8);
            return I.magic + I.version + I.platform + I.adler32 + I.expires + I.producer + I.expr + I.cipher;
        }

        function Cb() {
            var L = eb({
                size: 32, dictType: "max", customDict: null,
            });
            var R = ["1", "2", "3"];
            var P = ["+", "x"];
            var I = 2 + Math.floor(Math.random() * 4);
            var F = "";
            for (var W = 0; W < I; W++) {
                F += R[Math.floor(Math.random() * 3)];
                W < I - 1 && (F += P[Math.floor(Math.random() * 2)]);
            }
            F.length < 9 && (F += L.substr(0, 9 - F.length));
            var T = CryptoJS.enc.Utf8.parse(F);
            var N = CryptoJS.enc.Base64.stringify(T);
            return fb(N);
        }

        function eb() {
            var t, r = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, n = r.size,
                e = void 0 === n ? 10 : n, o = r.dictType, i = void 0 === o ? "number" : o, u = r.customDict, a = "";
            if (u && "string" == typeof u) t = u; else switch (i) {
                case "alphabet":
                    t = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
                    break;
                case "max":
                    t = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-";
                    break;
                case "number":
                default:
                    t = "0123456789";
            }
            for (; e--;) a += t[(Math.random() * t.length) | 0];
            return a;
        }

        function fb(t) {
            return t.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
        }

        function mb(t) {
            var U = eb({
                size: 32, dictType: "max", customDict: null,
            });
            var R = "";
            var F = Date.now();
            var G = U.substr(0, 2);
            var W = U.substr(0, 12);
            var q = wb(t, F, G, W);
            R += bb(q);
            R += bb(G);
            R += bb(W);
            R += Sb(F);
            R += bb(t);
            var H = CryptoJS.enc.Hex.parse(R);
            var I = CryptoJS.AES.encrypt(H, CryptoJS.enc.Utf8.parse("dp0!@w_s#ll0flo("), {iv: CryptoJS.enc.Utf8.parse("0102030405060708")});
            return fb(CryptoJS.enc.Base64.stringify(I.ciphertext));
        }

        function wb(t, r, n, e) {
            var K = new Uint8Array(16);
            K.forEach(function (r, n, e) {
                e[n] = t.charCodeAt(n);
            });
            var H = _b(r);
            var U = new Uint8Array(2);
            U.forEach(function (t, r, e) {
                e[r] = n.charCodeAt(r);
            });
            var G = new Uint8Array(12);
            G.forEach(function (t, r, n) {
                n[r] = e.charCodeAt(r);
            });
            var Z = new Uint8Array(38);
            Z.set(U);
            Z.set(G, 2);
            Z.set(H, 14);
            Z.set(K, 22);
            var Y = ADLER32.buf(Z);
            Y >>>= 0;
            var q = "00000000" + Y.toString(16);
            return q.substr(q.length - 8);
        }

        function _b(t) {
            var z = new ArrayBuffer(2);
            new DataView(z).setInt16(0, 256, !0);
            var N = new Int16Array(z)[0] === 256;
            var P = Math.floor(t / Math.pow(2, 32));
            var I = t % Math.pow(2, 32);
            var R = new ArrayBuffer(8);
            var T = new DataView(R);
            N ? (T.setUint32(0, I, N), T.setUint32(4, P, N)) : (T.setUint32(0, P, N), T.setUint32(4, I, N));
            return new Uint8Array(R);
        }

        function bb(t) {
            var l = new Uint8Array(t.length);
            l.forEach(function (r, n, e) {
                e[n] = t.charCodeAt(n);
            });
            return xb(l);
        }

        function xb(t) {
            return Array.prototype.map
                .call(t, function (t) {
                    var r = "00" + (t & 255).toString(16);
                    return r.slice(-2);
                })
                .join("");
        }

        function Sb(t) {
            return xb(_b(t));
        }

        var _ = Date.now();
        var s = nx(_, "yyyyMMddhhmmssSSS");
        this._defaultToken = yb(this._fingerprint);
        var c = this.__genDefaultKey(this._defaultToken, this._fingerprint, s, this._appId);
        var f = {};
        if (!c) {
            if (this._defaultToken) {
                var v = {
                    code: ex.GENERATE_SIGNATURE_FAILED, message: "generate key failed",
                };
                this._onSign(v);
            } else {
                var l = {
                    code: ex.TOKEN_EMPTY, message: "token is empty",
                };
                this._onSign(l);
            }
            return f;
        }
        var g = this.__genSign(c, t);
        var b = t
            .map(function (t) {
                return t.key;
            })
            .join(",");

        var m = this.__genSignParams(g, _, s, r);

        var d = {
            key: c, signStr: g, _stk: b, _ste: 1, h5st: m,
        };
        this._log("__makeSign, result:" + JSON.stringify(d, null, 2));

        var f = {
            _stk: b, _ste: 1, h5st: m,
        };
        var y = {
            code: 0, message: "success",
        };
        this._onSign(y);
        return f;
    }

    __collect() {
        var r = this.Eb(1);
        r.fp = this._fingerprint;
        var n = JSON.stringify(r, null, 2);
        this._log("__collect envCollect=".concat(n));
        var e = CryptoJS.AES.encrypt(n, CryptoJS.enc.Utf8.parse("wm0!@w_s#ll1flo("), {iv: CryptoJS.enc.Utf8.parse("0102030405060708")});
        return e.ciphertext.toString();
    }

    sign(I) {
        try {
            I.body = CryptoJS.SHA256(I.body).toString();
            var R = this.__checkParams(I);
            if (R == null) {
                return I;
            }
            this.__requestDeps();
            var W = this.__collect();
            var F = this.__makeSign(R, W);
            return Object.assign({}, I, F);
        } catch (e) {
            console.log(e);
            var K = {
                code: ex.UNHANDLED_ERROR, message: "unknown error",
            };
            this._onSign(K);
            return I;
        }
    }

    Eb(o) {
        // 4.2复制来的
        var temp = this;

        function mw(t) {
            if (temp.cookieStr) {
                var r = new RegExp("(^| )" + t + "(?:=([^;]*))?(;|$)"), n = temp.cookieStr.match(r);
                if (!n || !n[2]) return "";
                var e = n[2];
                try {
                    return /(%[0-9A-F]{2}){2,}/.test(e) ? decodeURIComponent(e) : unescape(e);
                } catch (t) {
                    return unescape(e);
                }
            }
        }

        function d_() {
            var t, r = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, n = r.size,
                e = void 0 === n ? 10 : n, o = r.dictType, i = void 0 === o ? "number" : o, a = r.customDict, u = "";
            if (a && "string" == typeof a) t = a; else switch (i) {
                case "alphabet":
                    t = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
                    break;
                case "max":
                    t = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-";
                    break;
                case "number":
                default:
                    t = "0123456789";
            }
            for (; e--;) u += t[(Math.random() * t.length) | 0];
            return u;
        }

        var ft = ["pp", "sua", "random", "referer", "v", "extend"];
        var ct = {};
        var st = function (key, func) {
            try {
                if ((o === 1 && ft.includes(key)) || o === 0) {
                    ct[key] = func();
                }
            } catch (e) {
                console.log(e);
            }
        };

        st("wc", function (t) {
            //   return /Chrome/.test(window.navigator.userAgent) && !window.chrome ? 1 : 0;
            return 0;
        });
        st("wd", function (t) {
            //   return navigator.webdriver ? 1 : 0;
            return 0;
        });
        st("l", function (t) {
            //   return navigator.language;
            return "zh-CN";
        });
        st("ls", function (t) {
            //   return navigator.languages.join(",");
            return "zh-CN,zh";
        });
        st("ml", function (t) {
            //   return navigator.mimeTypes.length;
            return 0;
        });
        st("pl", function (t) {
            //   return navigator.plugins.length;
            return 0;
        });
        st("av", function (t) {
            //   return navigator.appVersion;
            let av = temp.userAgent.match(/(?<=\/)[0-9]\.0[^'"\n]+/g);
            return av.length > 0 ? av[0] : "";
        });
        st("ua", function (t) {
            //   return window.navigator.userAgent;
            return temp.userAgent;
        });
        st("sua", function (t) {
            var regex = new RegExp("Mozilla/5.0 \\((.*?)\\)");
            //   var matches = window.navigator.userAgent.match(regex);
            var matches = temp.userAgent.match(regex);
            return matches && matches[1] ? matches[1] : "";
        });
        st("pp", function (t) {
            var u = {};
            var i = mw("pwdt_id");
            var c = mw("pin");
            var a = mw("pt_pin");
            i && (u.p1 = i);
            c && (u.p2 = c);
            a && (u.p3 = a);
            return u;
        });
        st("extend", function () {
            // var e = navigator.permissions.query({
            //     name: "notifications"
            // })
            // var Y = 0;
            // ("cdc_adoQpoasnfa76pfcZLmcfl_Array" in window || "cdc_adoQpoasnfa76pfcZLmcfl_Promise" in window || "cdc_adoQpoasnfa76pfcZLmcfl_Symbol" in window) && (Y |= 1);
            // ("$chrome_asyncScriptInfo" in window.document || "$cdc_asdjflasutopfhvcZLmcfl_" in window.document) && (Y |= 2);
            // var n = {
            //     pm: Notification.permission === "denied" && e.state === "prompt" ? 1 : 0,
            //     wd: window.navigator.webdriver ? 1 : 0,
            //     l: !navigator.languages || navigator.languages.length === 0 ? 1 : 0,
            //     ls: navigator.plugins.length,
            //     bu1: rm,
            //     wk: Y
            // }
            // return n;
            return {bu1: "0.1.9", l: 0, ls: 0, wd: 0, wk: 0};
        });
        st("pp1", function (t) {
            var c = mw("pwdt_id");
            var u = mw("pin");
            var a = mw("pt_pin");
            if (!c && !u && !a) {
                var i = temp.cookieStr;
                if (i) return i;
            }
            return "";
        });
        st("pm", function () {
            //   var result = navigator.permissions.query({ name: "notifications" });
            //   return { ps: result.state, np: Notification.permission };
            return {
                ps: "prompt", np: "default",
            };
        });
        st("w", function (t) {
            //   return window.screen.width;
            return 1536;
        });
        st("h", function (t) {
            //   return window.screen.height;
            return 864;
        });
        st("ow", function (t) {
            //   return window.outerWidth;
            return 1536;
        });
        st("oh", function (t) {
            //   return window.outerHeight;
            return 864;
        });
        st("url", function (t) {
            //   return location.href;
            return temp.url;
        });
        st("og", function (t) {
            //   return location.origin;
            return temp.origin;
        });
        st("pf", function (t) {
            //   return window.platform;
            return undefined;
        });
        st("pr", function (t) {
            //   return window.devicePixelRatio;
            return 1.25;
        });
        st("re", function (t) {
            //   return document.referrer;
            return "";
        });
        st("random", function (t) {
            return d_({size: 10, dictType: "max", customDict: null});
        });
        st("referer", function (t) {
            //   var i = new RegExp("[^?]*"),
            //     u = document.referrer.match(i);
            //   if (!u || !u[0]) return "";
            //   return u[0];
            return "";
        });
        st("v", function (t) {
            return "h5_npm_v4.2.0";
        });
        return ct;
    }
}

module.exports.h5st = h5st
