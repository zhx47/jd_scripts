const CryptoJS = require("crypto-js");
const ADLER32 = require("adler-32");

class h5st {
    constructor(cookieStr, userAgent, config, url) {
        this.cookieStr = cookieStr;
        this.userAgent = userAgent;
        if (url) {
            try {
                this.url = url;
            } catch (e) {
                console.log('url传递错误')
            }
        }

        if (url) {
            try {
                this.url = url;
            } catch (e) {
                console.log("url传递错误");
            }
        }

        this.map = new Map();
        this.childElementCount = 0;

        this._storageFpKey = 'WQ_lite_vk1';
        this._defaultToken = "";
        this._appId = "";
        this._defaultAlgorithm = {
            local_key_1: CryptoJS.MD5, local_key_2: CryptoJS.SHA256, local_key_3: CryptoJS.HmacSHA256
        };
        this._version = '4.4';
        this._fingerprint = "";
        this.settings = {
            debug: !1
        };
        this.ErrCodes = {
            UNSIGNABLE_PARAMS: 1, APPID_ABSENT: 2, TOKEN_EMPTY: 3, GENERATE_SIGNATURE_FAILED: 4, UNHANDLED_ERROR: -1
        };
        this.__iniConfig(Object.assign({}, this.settings, config));
    }

    __iniConfig(t) {
        if (!("string" === typeof t.appId && t.appId)) {
            console.error('settings.appId must be a non-empty string')
        }
        this._appId = t.appId || "";
        if (this._appId) {
            this._storageFpKey = this._storageFpKey + "_" + this._appId + "_" + this._version
        }
        this._debug = Boolean(t.debug);
        this._onSign = "function" === typeof t.onSign ? t.onSign : function () {
        };
        this._log(`create instance with appId=${this._appId}`)
    }

    _log(log) {
        if (this._debug) {
            console.log('[sign]', log)
        }
    }

    __genDefaultKey(t, e, r, n) {
        const o = this;
        const u = `${t}${e}${r}${n}qV!+A!`;
        const c = CryptoJS.enc.Base64.parse(this.toBase64(this.__parseToken(t, 16, 28)));
        const f = CryptoJS.enc.Utf8.stringify(c).match(/^[1,2,3]{1}([x,+]{1}[1,2,3]{1})+/);
        let i = "";
        if (f) {
            const s = f[0].split("");
            let h = "";

            this.a.default(s).call(s, (function (e) {
                if (isNaN(e)) {
                    let r = ["+", "x"];
                    if (o.l.default(r).call(s, e) >= 0) {
                        h = e
                    }
                } else {
                    const n = `local_key_${e}`;
                    if (o._defaultAlgorithm[n]) {
                        switch (h) {
                            case"+":
                                i = "" + i + o.__algorithm(n, u, t);
                                break;
                            case"x":
                                i = o.__algorithm(n, i, t);
                                break;
                            default:
                                i = o.__algorithm(n, u, t)
                        }
                    }
                }
            }))
        }
        return i;
    }

    __algorithm(t, e, r) {
        return t === 'local_key_3' ? this._defaultAlgorithm[t](e, r).toString(CryptoJS.enc.Hex) : this._defaultAlgorithm[t](e).toString(CryptoJS.enc.Hex);
    }

    __parseToken(t, e, r) {
        if (t) {
            return this.y.default(t).call(t, e, r);
        }
        return ""
    }

    __genSignParams(t, e, r, n) {
        return ["" + r, "" + this._fingerprint, "" + this._appId, "" + this._defaultToken, "" + t, "" + this._version, "" + e, "" + n].join(";")
    }

    __genSign(t, e) {
        const i = this.v.default(e).call(e, (function (t) {
            return t.key + ":" + t.value
        })).join("&");
        const a = CryptoJS.MD5(t + i + t).toString(CryptoJS.enc.Hex);
        this._log(`__genSign, paramsStr:${i}, signedStr:${a}`)
        return a
    }

    y = {
        default: function (t) {
            const e = t.slice;
            return t === Array.prototype || Array.prototype.isPrototypeOf(t) && e === Array.prototype.slice ? Array.prototype.slice : e
        }
    }

    v = {
        default: function (t) {
            const e = t.map;
            return t === Array.prototype || Array.prototype.isPrototypeOf(t) && e.map === Array.prototype.map ? Array.prototype.map : e
        }
    }

    l = {
        default: function (t) {
            const e = t.indexOf;
            return t === Array.prototype || Array.prototype.isPrototypeOf(t) && e.indexOf === Array.prototype.indexOf ? Array.prototype.indexOf : e
        }
    }

    s = {
        default: function (t) {
            const e = t.concat;
            return t === Array.prototype || Array.prototype.isPrototypeOf(t) && e.concat === Array.prototype.concat ? Array.prototype.concat : e
        }
    }

    a = {
        default: function (t) {
            const e = t.forEach;
            return t === Array.prototype || Array.prototype.isPrototypeOf(t) && e.forEach === Array.prototype.forEach ? Array.prototype.forEach : e
        }
    }

    x = {
        default: function (t) {
            const e = t.sort;
            return t === Array.prototype || Array.prototype.isPrototypeOf(t) && e.sort === Array.prototype.sort ? Array.prototype.sort : e
        }
    }

    _ = {
        default: function (t) {
            const e = t.filter;
            return t === Array.prototype || Array.prototype.isPrototypeOf(t) && e.filter === Array.prototype.filter ? Array.prototype.filter : e
        }
    }

    __requestDeps() {
        this._fingerprint = this.map.get(this._storageFpKey);
        if (!this._fingerprint) {
            this._fingerprint = this.generateVisitKey();
            this.map.set(this._storageFpKey, this._fingerprint)
        }
        this._log('__requestDeps, fp:' + this._fingerprint);
    }

    __checkParams(t) {
        const that = this
        let u = null;
        if (!this._appId) {
            u = {
                code: this.ErrCodes.APPID_ABSENT, message: "appId is required"
            }
        }
        if (!this.isPlainObject(t)) {
            u = {
                code: this.ErrCodes.UNSIGNABLE_PARAMS, message: 'params is not a plain object'
            }
        }
        if (this.isEmpty(t)) {
            u = {
                code: this.ErrCodes.UNSIGNABLE_PARAMS, message: 'params is empty'
            }
        }
        if (this.containsReservedParamName(t)) {
            u = {
                code: this.ErrCodes.UNSIGNABLE_PARAMS, message: 'params contains reserved param name.'
            }
        }
        if (u) {
            this._onSign(u);
            return null;
        }
        let o, e, r, n;
        o = this._.default(e = this.v.default(r = this.x.default(n = Object.keys(t)).call(n)).call(r, (function (e) {
            return {key: e, value: t[e]}
        }))).call(e, (function (t) {
            return that.isSafeParamValue(t.value)
        }))
        if (o.length === 0) {
            this._onSign({
                code: this.ErrCodes.UNSIGNABLE_PARAMS, message: 'params is empty after excluding "unsafe" params',
            });
            return null;
        }
        return o;
    }

    __makeSign(t, e) {
        function format() {
            let t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : Date.now(),
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

        let i = Date.now(), a = format(i, 'yyyyMMddhhmmssSSS'), u = a + "88";
        this._defaultToken = this.genLocalTK(this._fingerprint);
        let o = this.__genDefaultKey(this._defaultToken, this._fingerprint, u, this._appId)
        if (!o) {
            if (this._defaultToken) {
                this._onSign({code: this.ErrCodes.GENERATE_SIGNATURE_FAILED, message: 'generate key failed'})
            } else {
                this._onSign({code: this.ErrCodes.TOKEN_EMPTY, message: 'token is empty'})
            }
            return {};
        }

        const f = this.__genSign(o, t);
        const l = this.v.default(t).call(t, (function (t) {
            return t.key
        })).join(",");
        const h = 1;
        const p = this.__genSignParams(f, i, a, e);
        this._log(`__makeSign, result:${JSON.stringify({
            key: o, signStr: f, _stk: l, _ste: h, h5st: p
        })}`)
        this._onSign({code: 0, message: 'success'})
        return {_stk: l, _ste: h, h5st: p};
    }

    __collect() {
        let n = this.envCollect(1);
        n.fp = this._fingerprint;
        if (0 === n['extend']['bu2']) {
            n['extend']['bu2'] = -1
        }
        let o = JSON.stringify(n, null, 2)
        this._log(`__collect envCollect=${o}`)
        let i = CryptoJS.AES.encrypt(o, CryptoJS.enc.Utf8.parse('r1T.6Vinpb.k+/a)'), {iv: CryptoJS.enc.Utf8.parse("0102030405060708")});
        return i.ciphertext.toString()
    }

    sign(params) {
        try {
            var e = ["functionId", "appid", "client", "body", "clientVersion", "sign", "t", "jsonp"].reduce((function (e, r) {
                var n = params[r];
                return n && ("body" === r && (n = CryptoJS.SHA256(n).toString()), e[r] = n), e
            }), {});

            var o = this.__checkParams(e);
            if (o == null) {
                return e;
            }
            this.__requestDeps();
            let i = this.__collect();
            let a = this.__makeSign(o, i);
            return Object.assign({}, e, a);
        } catch (error) {
            this._onSign({
                code: this.ErrCodes.UNHANDLED_ERROR, message: 'unknown error'
            })
            return e;
        }
    }

    genLocalTK(t) {
        const that = this;

        function b(t) {
            function w(t) {
                return that.v.default(Array.prototype).call(t, (function (t) {
                    var e;
                    return that.y.default(e = "00" + (255 & t).toString(16)).call(e, -2)
                })).join("")
            }

            function _(t) {
                var e = new Uint8Array(t.length);
                return that.a.default(Array.prototype).call(e, (function (e, r, n) {
                    n[r] = t.charCodeAt(r)
                })), w(e)
            }

            function x(t) {
                var o = function () {
                    var t = new ArrayBuffer(2);
                    new DataView(t).setInt16(0, 256, !0);
                    return 256 === new Int16Array(t)[0];
                }();
                var i = Math.floor(t / Math.pow(2, 32));
                var a = t % Math.pow(2, 32);
                var u = new ArrayBuffer(8);
                var c = new DataView(u);
                o ? (c.setUint32(0, a, o), c.setUint32(4, i, o)) : (c.setUint32(0, i, o), c.setUint32(4, a, o))
                return new Uint8Array(u)
            }

            var n = "", o = Date.now(), u = 'HiO81-Ei89DH', v = function (t, e, r, n) {
                var i = new Uint8Array(16);
                that.a.default(Array.prototype).call(i, (function (e, r, n) {
                    n[r] = t.charCodeAt(r)
                }));
                var u = x(e), c = new Uint8Array(2);
                that.a.default(Array.prototype).call(c, (function (t, e, n) {
                    n[e] = r.charCodeAt(e)
                }));
                var f = new Uint8Array(12);
                that.a.default(Array.prototype).call(f, (function (t, e, r) {
                    r[e] = n.charCodeAt(e)
                }));
                var s = new Uint8Array(38);
                s.set(c), s.set(f, 2), s.set(u, 14), s.set(i, 22);
                var l = ADLER32.buf(s);
                l >>>= 0;
                var h = '00000000' + l.toString(16);
                return h.substr(h.length - 8)
            }(t, o, "(>", u);
            n += _(v), n += _("(>"), n += _(u), n += function (t) {
                return w(x(t))
            }(o), n += _(t);
            var g = CryptoJS.enc.Hex.parse(n), b = CryptoJS.AES.encrypt(g, CryptoJS.enc.Utf8.parse('eHL4|FW#Chc3#q?0'), {iv: CryptoJS.enc.Utf8.parse('0102030405060708')});
            return that.fromBase64(CryptoJS.enc.Base64.stringify(b.ciphertext))
        }

        var r = {magic: "tk", version: "02", platform: "w", expires: "41", producer: "l"};
        r.expr = function () {
            for (var r = that.getRandomIDPro({
                size: 32, dictType: 'max', customDict: null
            }), n = ["1", "2", "3"], o = ["+", "x"], i = (2 + Math.floor(4 * Math.random())), a = "", u = 0; u < i; u++) a += n[Math.floor((Math.random() * 3))], (u < i - 1) && (a += o[Math.floor((Math.random() * 2))]);
            (a.length < 9) && (a += r.substr(0, (9 - a.length)));
            var f = CryptoJS.enc.Utf8.parse(a), s = CryptoJS.enc.Base64.stringify(f);
            return that.fromBase64(s)
        }();
        r.cipher = b(t);
        r.adler32 = function (t) {
            var r = ADLER32.str(t);
            r >>>= 0;
            var n = '00000000' + r.toString(16);
            return n.substr(n.length - 8)
        }(r.magic + r.version + r.platform + r.expires + r.producer + r.expr + r.cipher);
        return r.magic + r.version + r.platform + r.adler32 + r.expires + r.producer + r.expr + r.cipher
    }

    getRandomIDPro() {
        var t, e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, r = e.size,
            n = void 0 === r ? 10 : r, o = e.dictType, i = void 0 === o ? "number" : o, a = e.customDict, u = "";
        if (a && "string" == typeof a) t = a; else switch (i) {
            case"alphabet":
                t = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
                break;
            case"max":
                t = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-";
                break;
            default:
                t = "0123456789"
        }
        for (; n--;) u += t[Math.random() * t.length | 0];
        return u
    }

    fromBase64(t) {
        return t.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "")
    }

    toBase64(t) {
        return (t + this.y.default("===").call("===", (t.length + 3) % 4)).replace(/-/g, "+").replace(/_/g, "/")
    }

    envCollect() {
        const that = this

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

        let info = {
            extend: {
                bu1: "lite_0.1.5", bu2: 0, bu3: this.childElementCount, // bu3: document.head.childElementCount,
                bu4: 0, bu5: 0, l: 0, ls: 0, wd: 0, wk: 0,
            }, random: this.getRandomIDPro({size: 12, dictType: 'max', customDict: null}), v: "v_lite_f_4.4.0"
        }

        // return
        let r = {}, n = jC('pwdt_id'), i = jC('pin'), u = jC('pt_pin');
        n && (r.p1 = n)
        i && (r.p2 = i)
        u && (r.p3 = u)
        info.pp = r

        let e = new RegExp('Mozilla/5.0 \\((.*?)\\)'), temp = that.userAgent.match(e);
        info.sua = temp && temp[1] ? temp[1] : ""
        return info
    }

    generateVisitKey() {
        const that = this;

        function d(t, e) {
            var r, f = [], s = t.length, l = hh(t);
            try {
                for (l.s(); !(r = l.n()).done;) {
                    var p = r.value;
                    if (Math.random() * s < e && (f.push(p), 0 == --e)) {
                        break;
                    }
                    s--
                }
            } catch (t) {
                l.e(t)
            } finally {
                l.f()
            }
            for (var d = "", g = 0; g < f.length; g++) {
                var y = (Math.random() * (f.length - g) | 0);
                d += f[y], f[y] = f[((f.length - g) - 1)]
            }
            return d
        }

        function hh(t, u) {
            function p(t, e) {
                (null == e || e > t.length) && (e = t.length);
                for (var r = 0, n = new Array(e); r < e; r++) n[r] = t[r];
                return n
            }

            var c = void 0 !== o && i(t) || t["@@iterator"];
            if (!c) {
                if (Array.isArray(t) || (c = function (t, e) {
                    var o;
                    if (!t) return;
                    if ("string" == typeof t) return p(t, e);
                    var i = that.y.default(o = Object.prototype.toString.call(t)).call(o, 8, -1);
                    "Object" === i && t.constructor && (i = t.constructor.name);
                    if ("Map" === i || "Set" === i) return n(t);
                    if ("Arguments" === i || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(i)) return p(t, e)
                }(t)) || u && t && "number" == typeof t.length) {
                    c && (t = c);
                    var f = 0, s = function () {
                    };
                    return {
                        s: s, n: function () {
                            return f >= t.length ? {done: !0} : {done: !1, value: t[f++]}
                        }, e: function (t) {
                            throw t
                        }, f: s
                    }
                }
                throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
            }
            var l, h = !0, d = !1;
            return {
                s: function () {
                    c = c.call(t)
                }, n: function () {
                    var t = c.next();
                    return h = t.done, t
                }, e: function (t) {
                    for (var r = e, n = [], o = 0; ;) switch (r[o++]) {
                        case 11:
                            n.push(!0);
                            break;
                        case 18:
                            l = n[n.length - 1];
                            break;
                        case 33:
                            n.push(t);
                            break;
                        case 74:
                            d = n[n.length - 1];
                            break;
                        case 95:
                            return;
                        case 99:
                            n.pop()
                    }
                }, f: function () {
                    try {
                        h || null == c.return || c.return()
                    } finally {
                        if (d) throw l
                    }
                }
            }
        }

        function y(t, e) {
            for (var r = 0; r < e.length; r++) {
                -1 !== that.l.default(t).call(t, e[r]) && (t = t.replace(e[r], ""))
            }
            return t
        }

        function g(t) {
            for (var e = t.size, n = t.num, o = ""; e--;) o += n[0 | (Math.random() * n.length)];
            return o
        }

        var r = '1uct6d0jhq';
        var n = d(r, 4);
        var o = 10 * Math.random() | 0;
        var i = y(r, n);
        var a = ((g({size: o, num: i}) + n + g({size: 12 - o - 1, num: i})) + o).split("");
        var u = this.y.default(a).call(a, 0, 8);
        var l = this.y.default(a).call(a, 8);
        var h = [];
        for (; u.length > 0;) {
            h.push((35 - parseInt(u.pop(), 36)).toString(36))
        }
        return (h = this.s.default(h).call(h, l)).join("")
    }

    isPlainObject(t) {
        return "[object Object]" === Object.prototype.toString.call(t)
    }

    isEmpty(t) {
        return !!this.isPlainObject(t) && !Object.keys(t).length
    }

    containsReservedParamName(t) {
        const PS = ["h5st", "_stk", "_ste"];
        for (var e = Object.keys(t), r = 0; r < e.length; r++) {
            var n = e[r];
            if (this.l.default(PS).call(PS, n) >= 0) return !0
        }
        return !1
    }

    isSafeParamValue(t) {
        let Bp = "function" == typeof Object.Symbol && "symbol" == typeof Object.f("iterator") ? function (t) {
            return typeof t
        } : function (t) {
            return t && "function" == typeof Object.Symbol && t.constructor === Object.Symbol && t !== Object.Symbol.prototype ? "symbol" : typeof t
        }
        let e = Bp(t);
        return "number" === e && !isNaN(t) || "string" === e || "boolean" === e
    }
}

module.exports.h5st = h5st
