var hljs = new function () {
        function l(o) {
            return o.replace(/&/gm, "&amp;").replace(/</gm, "&lt;").replace(/>/gm, "&gt;")
        }
        function b(p) {
            for (var o = p.firstChild; o; o = o.nextSibling) {
                if (o.nodeName == "CODE") {
                    return o
                }
                if (!(o.nodeType == 3 && o.nodeValue.match(/\s+/))) {
                    break
                }
            }
        }
        function h(p, o) {
            return Array.prototype.map.call(p.childNodes, function (q) {
                if (q.nodeType == 3) {
                    return o ? q.nodeValue.replace(/\n/g, "") : q.nodeValue
                }
                if (q.nodeName == "BR") {
                    return "\n"
                }
                return h(q, o)
            }).join("")
        }
        function a(q) {
            var p = (q.className + " " + (q.parentNode ? q.parentNode.className : "")).split(/\s+/);
            p = p.map(function (r) {
                return r.replace(/^language-/, "")
            });
            for (var o = 0; o < p.length; o++) {
                if (e[p[o]] || p[o] == "no-highlight") {
                    return p[o]
                }
            }
        }
        function c(q) {
            var o = [];
            (function p(r, s) {
                for (var t = r.firstChild; t; t = t.nextSibling) {
                    if (t.nodeType == 3) {
                        s += t.nodeValue.length
                    } else {
                        if (t.nodeName == "BR") {
                            s += 1
                        } else {
                            if (t.nodeType == 1) {
                                o.push({
                                    event: "start",
                                    offset: s,
                                    node: t
                                });
                                s = p(t, s);
                                o.push({
                                    event: "stop",
                                    offset: s,
                                    node: t
                                })
                            }
                        }
                    }
                }
                return s
            })(q, 0);
            return o
        }
        function j(x, v, w) {
            var p = 0;
            var y = "";
            var r = [];
            function t() {
                if (x.length && v.length) {
                    if (x[0].offset != v[0].offset) {
                        return (x[0].offset < v[0].offset) ? x : v
                    } else {
                        return v[0].event == "start" ? x : v
                    }
                } else {
                    return x.length ? x : v
                }
            }
            function s(A) {
                function z(B) {
                    return " " + B.nodeName + '="' + l(B.value) + '"'
                }
                return "<" + A.nodeName + Array.prototype.map.call(A.attributes, z).join("") + ">"
            }
            while (x.length || v.length) {
                var u = t().splice(0, 1)[0];
                y += l(w.substr(p, u.offset - p));
                p = u.offset;
                if (u.event == "start") {
                    y += s(u.node);
                    r.push(u.node)
                } else {
                    if (u.event == "stop") {
                        var o,
                            q = r.length;
                        do {
                            q--;
                            o = r[q];
                            y += ("</" + o.nodeName.toLowerCase() + ">")
                        } while (o != u.node);
                        r.splice(q, 1);
                        while (q < r.length) {
                            y += s(r[q]);
                            q++
                        }
                    }
                }
            }
            return y + l(w.substr(p))
        }
        function f(r) {
            function o(s) {
                return (s && s.source) || s
            }
            function p(t, s) {
                return RegExp(o(t), "m" + (r.case_insensitive ? "i" : "") + (s ? "g" : ""))
            }
            function q(y, x) {
                if (y.compiled) {
                    return
                }
                y.compiled = true;
                var v = [];
                if (y.keywords) {
                    var s = {};
                    function z(A, B) {
                        B.split(" ").forEach(function (C) {
                            var D = C.split("|");
                            s[D[0]] = [
                                A, D[1] ? Number(D[1]) : 1
                            ];
                            v.push(D[0])
                        })
                    }
                    y.lexemsRe = p(y.lexems || hljs.IDENT_RE + "(?!\\.)", true);
                    if (typeof y.keywords == "string") {
                        z("keyword", y.keywords)
                    } else {
                        for (var w in y.keywords) {
                            if (!y.keywords.hasOwnProperty(w)) {
                                continue
                            }
                            z(w, y.keywords[w])
                        }
                    }
                    y.keywords = s
                }
                if (x) {
                    if (y.beginWithKeyword) {
                        y.begin = "\\b(" + v.join("|") + ")\\b(?!\\.)\\s*"
                    }
                    y.beginRe = p(y.begin ? y.begin : "\\B|\\b");
                    if (!y.end && !y.endsWithParent) {
                        y.end = "\\B|\\b"
                    }
                    if (y.end) {
                        y.endRe = p(y.end)
                    }
                    y.terminator_end = o(y.end) || "";
                    if (y.endsWithParent && x.terminator_end) {
                        y.terminator_end += (y.end ? "|" : "") + x.terminator_end
                    }
                }
                if (y.illegal) {
                    y.illegalRe = p(y.illegal)
                }
                if (y.relevance === undefined) {
                    y.relevance = 1
                }
                if (!y.contains) {
                    y.contains = []
                }
                for (var u = 0; u < y.contains.length; u++) {
                    if (y.contains[u] == "self") {
                        y.contains[u] = y
                    }
                    q(y.contains[u], y)
                }
                if (y.starts) {
                    q(y.starts, x)
                }
                var t = [];
                for (var u = 0; u < y.contains.length; u++) {
                    t.push(o(y.contains[u].begin))
                }
                if (y.terminator_end) {
                    t.push(o(y.terminator_end))
                }
                if (y.illegal) {
                    t.push(o(y.illegal))
                }
                y.terminators = t.length ? p(t.join("|"), true) : {
                    exec: function (A) {
                        return null
                    }
                }
            }
            q(r)
        }
        function d(D, E, B) {
            function o(K, N) {
                for (var M = 0; M < N.contains.length; M++) {
                    var L = N.contains[M].beginRe.exec(K);
                    if (L && L.index == 0) {
                        return N.contains[M]
                    }
                }
            }
            function s(L, K) {
                if (L.end && L.endRe.test(K)) {
                    return L
                }
                if (L.endsWithParent) {
                    return s(L.parent, K)
                }
            }
            function t(K, L) {
                return !B && L.illegal && L.illegalRe.test(K)
            }
            function y(M, K) {
                var L = F.case_insensitive ? K[0].toLowerCase() : K[0];
                return M.keywords.hasOwnProperty(L) && M.keywords[L]
            }
            function G() {
                var L = l(w);
                if (!A.keywords) {
                    return L
                }
                var K = "";
                var O = 0;
                A.lexemsRe.lastIndex = 0;
                var M = A.lexemsRe.exec(L);
                while (M) {
                    K += L.substr(O, M.index - O);
                    var N = y(A, M);
                    if (N) {
                        v += N[1];
                        K += '<span class="' + N[0] + '">' + M[0] + "</span>"
                    } else {
                        K += M[0]
                    }
                    O = A.lexemsRe.lastIndex;
                    M = A.lexemsRe.exec(L)
                }
                return K + L.substr(O)
            }
            function z() {
                if (A.subLanguage && !e[A.subLanguage]) {
                    return l(w)
                }
                var K = A.subLanguage ? d(A.subLanguage, w) : g(w);
                if (A.relevance > 0) {
                    v += K.keyword_count;
                    p += K.relevance
                }
                return '<span class="' + K.language + '">' + K.value + "</span>"
            }
            function J() {
                return A.subLanguage !== undefined ? z() : G()
            }
            function I(M, K) {
                var L = M.className ? '<span class="' + M.className + '">' : "";
                if (M.returnBegin) {
                    x += L;
                    w = ""
                } else {
                    if (M.excludeBegin) {
                        x += l(K) + L;
                        w = ""
                    } else {
                        x += L;
                        w = K
                    }
                }
                A = Object.create(M, {
                    parent: {
                        value: A
                    }
                })
            }
            function C(L, K) {
                w += L;
                if (K === undefined) {
                    x += J();
                    return 0
                }
                var N = o(K, A);
                if (N) {
                    x += J();
                    I(N, K);
                    return N.returnBegin ? 0 : K.length
                }
                var O = s(A, K);
                if (O) {
                    var M = A;
                    if (!(M.returnEnd || M.excludeEnd)) {
                        w += K
                    }
                    x += J();
                    do {
                        if (A.className) {
                            x += "</span>"
                        }
                        p += A.relevance;
                        A = A.parent
                    } while (A != O.parent);
                    if (M.excludeEnd) {
                        x += l(K)
                    }
                    w = "";
                    if (O.starts) {
                        I(O.starts, "")
                    }
                    return M.returnEnd ? 0 : K.length
                }
                if (t(K, A)) {
                    throw new Error('Illegal lexem "' + K + '" for mode "' + (A.className || "<unnamed>") + '"')
                }
                w += K;
                return K.length || 1
            }
            var F = e[D];
            f(F);
            var A = F;
            var w = "";
            var p = 0;
            var v = 0;
            var x = "";
            try {
                var u,
                    r,
                    q = 0;
                while (true) {
                    A.terminators.lastIndex = q;
                    u = A.terminators.exec(E);
                    if (!u) {
                        break
                    }
                    r = C(E.substr(q, u.index - q), u[0]);
                    q = u.index + r
                }
                C(E.substr(q));
                return {
                    relevance: p,
                    keyword_count: v,
                    value: x,
                    language: D
                }
            } catch (H) {
                if (H.message.indexOf("Illegal") != -1) {
                    return {
                        relevance: 0,
                        keyword_count: 0,
                        value: l(E)
                    }
                } else {
                    throw H
                }
            }
        }
        function g(s) {
            var o = {
                    keyword_count: 0,
                    relevance: 0,
                    value: l(s)
                };
            var q = o;
            for (var p in e) {
                if (!e.hasOwnProperty(p)) {
                    continue
                }
                var r = d(p, s, false);
                r.language = p;
                if (r.keyword_count + r.relevance > q.keyword_count + q.relevance) {
                    q = r
                }
                if (r.keyword_count + r.relevance > o.keyword_count + o.relevance) {
                    q = o;
                    o = r
                }
            }
            if (q.language) {
                o.second_best = q
            }
            return o
        }
        function i(q, p, o) {
            if (p) {
                q = q.replace(/^((<[^>]+>|\t)+)/gm, function (r, v, u, t) {
                    return v.replace(/\t/g, p)
                })
            }
            if (o) {
                q = q.replace(/\n/g, "<br>")
            }
            return q
        }
        function m(r, u, p) {
            var v = h(r, p);
            var t = a(r);
            if (t == "no-highlight") {
                return
            }
            var w = t ? d(t, v, true) : g(v);
            t = w.language;
            var o = c(r);
            if (o.length) {
                var q = document.createElement("pre");
                q.innerHTML = w.value;
                w.value = j(o, c(q), v)
            }
            w.value = i(w.value, u, p);
            var s = r.className;
            if (!s.match("(\\s|^)(language-)?" + t + "(\\s|$)")) {
                s = s ? (s + " " + t) : t
            }
            r.innerHTML = w.value;
            r.className = s;
            r.result = {
                language: t,
                kw: w.keyword_count,
                re: w.relevance
            };
            if (w.second_best) {
                r.second_best = {
                    language: w.second_best.language,
                    kw: w.second_best.keyword_count,
                    re: w.second_best.relevance
                }
            }
        }
        function n() {
            if (n.called) {
                return
            }
            n.called = true;
            Array.prototype.map.call(document.getElementsByTagName("pre"), b).filter(Boolean).forEach(function (o) {
                m(o, hljs.tabReplace)
            })
        }
        function k() {
            window.addEventListener("DOMContentLoaded", n, false);
            window.addEventListener("load", n, false)
        }
        var e = {};
        this.LANGUAGES = e;
        this.highlight = d;
        this.highlightAuto = g;
        this.fixMarkup = i;
        this.highlightBlock = m;
        this.initHighlighting = n;
        this.initHighlightingOnLoad = k;
        this.IDENT_RE = "[a-zA-Z][a-zA-Z0-9_]*";
        this.UNDERSCORE_IDENT_RE = "[a-zA-Z_][a-zA-Z0-9_]*";
        this.NUMBER_RE = "\\b\\d+(\\.\\d+)?";
        this.C_NUMBER_RE = "(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)";
        this.BINARY_NUMBER_RE = "\\b(0b[01]+)";
        this.RE_STARTERS_RE = "!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|\\.|-|-=|/|/=|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~";
        this.BACKSLASH_ESCAPE = {
            begin: "\\\\[\\s\\S]",
            relevance: 0
        };
        this.APOS_STRING_MODE = {
            className: "string",
            begin: "'",
            end: "'",
            illegal: "\\n",
            contains: [this.BACKSLASH_ESCAPE],
            relevance: 0
        };
        this.QUOTE_STRING_MODE = {
            className: "string",
            begin: '"',
            end: '"',
            illegal: "\\n",
            contains: [this.BACKSLASH_ESCAPE],
            relevance: 0
        };
        this.C_LINE_COMMENT_MODE = {
            className: "comment",
            begin: "//",
            end: "$"
        };
        this.C_BLOCK_COMMENT_MODE = {
            className: "comment",
            begin: "/\\*",
            end: "\\*/"
        };
        this.HASH_COMMENT_MODE = {
            className: "comment",
            begin: "#",
            end: "$"
        };
        this.NUMBER_MODE = {
            className: "number",
            begin: this.NUMBER_RE,
            relevance: 0
        };
        this.C_NUMBER_MODE = {
            className: "number",
            begin: this.C_NUMBER_RE,
            relevance: 0
        };
        this.BINARY_NUMBER_MODE = {
            className: "number",
            begin: this.BINARY_NUMBER_RE,
            relevance: 0
        };
        this.REGEXP_MODE = {
            className: "regexp",
            begin: /\//,
            end: /\/[gim]*/,
            illegal: /\n/,
            contains: [
                this.BACKSLASH_ESCAPE, {
                    begin: /\[/,
                    end: /\]/,
                    relevance: 0,
                    contains: [this.BACKSLASH_ESCAPE]
                }
            ]
        };
        this.inherit = function (q, r) {
            var o = {};
            for (var p in q) {
                o[p] = q[p]
            }
            if (r) {
                for (var p in r) {
                    o[p] = r[p]
                }
            }
            return o
        }
    }();
hljs.LANGUAGES.fsharp = function (a) {
    return {
        keywords: "abstract and as assert base begin class default delegate do done downcast downto elif else end exception extern false finally for fun function global if in inherit inline interface internal lazy let match member module mutable namespace new null of open or override private public rec return sig static struct then to true try type upcast use val void when while with yield",
        contains: [
            {
                className: "string",
                begin: '@"',
                end: '"',
                contains: [
                    {
                        begin: '""'
                    }
                ]
            }, {
                className: "string",
                begin: '"""',
                end: '"""'
            }, {
                className: "comment",
                begin: "//",
                end: "$",
                returnBegin: true
            }, {
                className: "comment",
                begin: "\\(\\*",
                end: "\\*\\)"
            }, {
                className: "class",
                beginWithKeyword: true,
                end: "\\(|=|$",
                keywords: "type",
                contains: [
                    {
                        className: "title",
                        begin: a.UNDERSCORE_IDENT_RE
                    }
                ]
            }, {
                className: "annotation",
                begin: "\\[<",
                end: ">\\]"
            }, a.C_LINE_COMMENT_MODE, a.C_BLOCK_COMMENT_MODE, a.inherit(a.APOS_STRING_MODE, {
                illegal: null
            }), a.inherit(a.QUOTE_STRING_MODE, {
                illegal: null
            }), a.C_NUMBER_MODE
        ]
    }
}(hljs);
hljs.LANGUAGES.javascript = function (a) {
    return {
        keywords: {
            keyword: "in if for while finally var new function do return void else break catch instanceof with throw case default try this switch continue typeof delete let yield const",
            literal: "true false null undefined NaN Infinity"
        },
        contains: [
            a.APOS_STRING_MODE, a.QUOTE_STRING_MODE, a.C_LINE_COMMENT_MODE, a.C_BLOCK_COMMENT_MODE, a.C_NUMBER_MODE, {
                begin: "(" + a.RE_STARTERS_RE + "|\\b(case|return|throw)\\b)\\s*",
                keywords: "return throw case",
                contains: [
                    a.C_LINE_COMMENT_MODE, a.C_BLOCK_COMMENT_MODE, a.REGEXP_MODE, {
                        begin: /</,
                        end: />;/,
                        subLanguage: "xml"
                    }
                ],
                relevance: 0
            }, {
                className: "function",
                beginWithKeyword: true,
                end: /{/,
                keywords: "function",
                contains: [
                    {
                        className: "title",
                        begin: /[A-Za-z$_][0-9A-Za-z$_]*/
                    }, {
                        className: "params",
                        begin: /\(/,
                        end: /\)/,
                        contains: [
                            a.C_LINE_COMMENT_MODE, a.C_BLOCK_COMMENT_MODE
                        ],
                        illegal: /["'\(]/
                    }
                ],
                illegal: /\[|%/
            }
        ]
    }
}(hljs);
hljs.LANGUAGES.bash = function (a) {
    var c = {
            className: "variable",
            begin: /\$[\w\d#@][\w\d_]*/
        };
    var b = {
            className: "variable",
            begin: /\$\{(.*?)\}/
        };
    var e = {
            className: "string",
            begin: /"/,
            end: /"/,
            contains: [
                a.BACKSLASH_ESCAPE, c, b, {
                    className: "variable",
                    begin: /\$\(/,
                    end: /\)/,
                    contains: a.BACKSLASH_ESCAPE
                }
            ],
            relevance: 0
        };
    var d = {
            className: "string",
            begin: /'/,
            end: /'/,
            relevance: 0
        };
    return {
        lexems: /-?[a-z]+/,
        keywords: {
            keyword: "if then else elif fi for break continue while in do done exit return set declare case esac export exec",
            literal: "true false",
            built_in: "printf echo read cd pwd pushd popd dirs let eval unset typeset readonly getopts source shopt caller type hash bind help sudo",
            operator: "-ne -eq -lt -gt -f -d -e -s -l -a"
        },
        contains: [
            {
                className: "shebang",
                begin: /^#![^\n]+sh\s*$/,
                relevance: 10
            }, {
                className: "function",
                begin: /\w[\w\d_]*\s*\(\s*\)\s*\{/,
                returnBegin: true,
                contains: [
                    {
                        className: "title",
                        begin: /\w[\w\d_]*/
                    }
                ],
                relevance: 0
            }, a.HASH_COMMENT_MODE, a.NUMBER_MODE, e, d, c, b
        ]
    }
}(hljs);
hljs.LANGUAGES.delphi = function (b) {
    var f = "and safecall cdecl then string exports library not pascal set virtual file in array label packed end. index while const raise for to implementation with except overload destructor downto finally program exit unit inherited override if type until function do begin repeat goto nil far initialization object else var uses external resourcestring interface end finalization class asm mod case on shr shl of register xorwrite threadvar try record near stored constructor stdcall inline div out or procedure";
    var e = "safecall stdcall pascal stored const implementation finalization except to finally program inherited override then exports string read not mod shr try div shl set library message packed index for near overload label downto exit public goto interface asm on of constructor or private array unit raise destructor var type until function else external with case default record while protected property procedure published and cdecl do threadvar file in if end virtual write far out begin repeat nil initialization object uses resourcestring class register xorwrite inline static";
    var a = {
            className: "comment",
            begin: "{",
            end: "}",
            relevance: 0
        };
    var g = {
            className: "comment",
            begin: "\\(\\*",
            end: "\\*\\)",
            relevance: 10
        };
    var c = {
            className: "string",
            begin: "'",
            end: "'",
            contains: [
                {
                    begin: "''"
                }
            ],
            relevance: 0
        };
    var d = {
            className: "string",
            begin: "(#\\d+)+"
        };
    var h = {
            className: "function",
            beginWithKeyword: true,
            end: "[:;]",
            keywords: "function constructor|10 destructor|10 procedure|10",
            contains: [
                {
                    className: "title",
                    begin: b.IDENT_RE
                }, {
                    className: "params",
                    begin: "\\(",
                    end: "\\)",
                    keywords: f,
                    contains: [
                        c, d
                    ]
                }, a, g
            ]
        };
    return {
        case_insensitive: true,
        keywords: f,
        illegal: '("|\\$[G-Zg-z]|\\/\\*|</)',
        contains: [
            a, g, b.C_LINE_COMMENT_MODE, c, d, b.NUMBER_MODE, h, {
                className: "class",
                begin: "=\\bclass\\b",
                end: "end;",
                keywords: e,
                contains: [
                    c, d, a, g, b.C_LINE_COMMENT_MODE, h
                ]
            }
        ]
    }
}(hljs);
hljs.LANGUAGES.json = function (a) {
    var e = {
            literal: "true false null"
        };
    var d = [
            a.QUOTE_STRING_MODE, a.C_NUMBER_MODE
        ];
    var c = {
            className: "value",
            end: ",",
            endsWithParent: true,
            excludeEnd: true,
            contains: d,
            keywords: e
        };
    var b = {
            begin: "{",
            end: "}",
            contains: [
                {
                    className: "attribute",
                    begin: '\\s*"',
                    end: '"\\s*:\\s*',
                    excludeBegin: true,
                    excludeEnd: true,
                    contains: [a.BACKSLASH_ESCAPE],
                    illegal: "\\n",
                    starts: c
                }
            ],
            illegal: "\\S"
        };
    var f = {
            begin: "\\[",
            end: "\\]",
            contains: [a.inherit(c, {
                    className: null
                })],
            illegal: "\\S"
        };
    d.splice(d.length, 0, b, f);
    return {
        contains: d,
        keywords: e,
        illegal: "\\S"
    }
}(hljs);
hljs.LANGUAGES.xml = function (a) {
    var c = "[A-Za-z0-9\\._:-]+";
    var b = {
            endsWithParent: true,
            relevance: 0,
            contains: [
                {
                    className: "attribute",
                    begin: c,
                    relevance: 0
                }, {
                    begin: '="',
                    returnBegin: true,
                    end: '"',
                    contains: [
                        {
                            className: "value",
                            begin: '"',
                            endsWithParent: true
                        }
                    ]
                }, {
                    begin: "='",
                    returnBegin: true,
                    end: "'",
                    contains: [
                        {
                            className: "value",
                            begin: "'",
                            endsWithParent: true
                        }
                    ]
                }, {
                    begin: "=",
                    contains: [
                        {
                            className: "value",
                            begin: "[^\\s/>]+"
                        }
                    ]
                }
            ]
        };
    return {
        case_insensitive: true,
        contains: [
            {
                className: "pi",
                begin: "<\\?",
                end: "\\?>",
                relevance: 10
            }, {
                className: "doctype",
                begin: "<!DOCTYPE",
                end: ">",
                relevance: 10,
                contains: [
                    {
                        begin: "\\[",
                        end: "\\]"
                    }
                ]
            }, {
                className: "comment",
                begin: "<!--",
                end: "-->",
                relevance: 10
            }, {
                className: "cdata",
                begin: "<\\!\\[CDATA\\[",
                end: "\\]\\]>",
                relevance: 10
            }, {
                className: "tag",
                begin: "<style(?=\\s|>|$)",
                end: ">",
                keywords: {
                    title: "style"
                },
                contains: [b],
                starts: {
                    end: "</style>",
                    returnEnd: true,
                    subLanguage: "css"
                }
            }, {
                className: "tag",
                begin: "<script(?=\\s|>|$)",
                end: ">",
                keywords: {
                    title: "script"
                },
                contains: [b],
                starts: {
                    end: "<\/script>",
                    returnEnd: true,
                    subLanguage: "javascript"
                }
            }, {
                begin: "<%",
                end: "%>",
                subLanguage: "vbscript"
            }, {
                className: "tag",
                begin: "</?",
                end: "/?>",
                relevance: 0,
                contains: [
                    {
                        className: "title",
                        begin: "[^ /><]+"
                    }, b
                ]
            }
        ]
    }
}(hljs);
hljs.LANGUAGES.django = function (c) {
    function e(h, g) {
        return (g == undefined || (!h.className && g.className == "tag") || h.className == "value")
    }
    function f(m, l) {
        var g = {};
        for (var k in m) {
            if (k != "contains") {
                g[k] = m[k]
            }
            var j = [];
            for (var h = 0; m.contains && h < m.contains.length; h++) {
                j.push(f(m.contains[h], m))
            }
            if (e(m, l)) {
                j = b.concat(j)
            }
            if (j.length) {
                g.contains = j
            }
        }
        return g
    }
    var d = {
            className: "filter",
            begin: "\\|[A-Za-z]+\\:?",
            keywords: "truncatewords removetags linebreaksbr yesno get_digit timesince random striptags filesizeformat escape linebreaks length_is ljust rjust cut urlize fix_ampersands title floatformat capfirst pprint divisibleby add make_list unordered_list urlencode timeuntil urlizetrunc wordcount stringformat linenumbers slice date dictsort dictsortreversed default_if_none pluralize lower join center default truncatewords_html upper length phone2numeric wordwrap time addslashes slugify first escapejs force_escape iriencode last safe safeseq truncatechars localize unlocalize localtime utc timezone",
            contains: [
                {
                    className: "argument",
                    begin: '"',
                    end: '"'
                }
            ]
        };
    var b = [
            {
                className: "template_comment",
                begin: "{%\\s*comment\\s*%}",
                end: "{%\\s*endcomment\\s*%}"
            }, {
                className: "template_comment",
                begin: "{#",
                end: "#}"
            }, {
                className: "template_tag",
                begin: "{%",
                end: "%}",
                keywords: "comment endcomment load templatetag ifchanged endifchanged if endif firstof for endfor in ifnotequal endifnotequal widthratio extends include spaceless endspaceless regroup by as ifequal endifequal ssi now with cycle url filter endfilter debug block endblock else autoescape endautoescape csrf_token empty elif endwith static trans blocktrans endblocktrans get_static_prefix get_media_prefix plural get_current_language language get_available_languages get_current_language_bidi get_language_info get_language_info_list localize endlocalize localtime endlocaltime timezone endtimezone get_current_timezone verbatim",
                contains: [d]
            }, {
                className: "variable",
                begin: "{{",
                end: "}}",
                contains: [d]
            }
        ];
    var a = f(c.LANGUAGES.xml);
    a.case_insensitive = true;
    return a
}(hljs);
hljs.LANGUAGES.cpp = function (a) {
    var b = {
            keyword: "false int float while private char catch export virtual operator sizeof dynamic_cast|10 typedef const_cast|10 const struct for static_cast|10 union namespace unsigned long throw volatile static protected bool template mutable if public friend do return goto auto void enum else break new extern using true class asm case typeid short reinterpret_cast|10 default double register explicit signed typename try this switch continue wchar_t inline delete alignof char16_t char32_t constexpr decltype noexcept nullptr static_assert thread_local restrict _Bool complex",
            built_in: "std string cin cout cerr clog stringstream istringstream ostringstream auto_ptr deque list queue stack vector map set bitset multiset multimap unordered_set unordered_map unordered_multiset unordered_multimap array shared_ptr"
        };
    return {
        keywords: b,
        illegal: "</",
        contains: [
            a.C_LINE_COMMENT_MODE, a.C_BLOCK_COMMENT_MODE, a.QUOTE_STRING_MODE, {
                className: "string",
                begin: "'\\\\?.",
                end: "'",
                illegal: "."
            }, {
                className: "number",
                begin: "\\b(\\d+(\\.\\d*)?|\\.\\d+)(u|U|l|L|ul|UL|f|F)"
            }, a.C_NUMBER_MODE, {
                className: "preprocessor",
                begin: "#",
                end: "$",
                contains: [
                    {
                        begin: "<",
                        end: ">",
                        illegal: "\\n"
                    }, a.C_LINE_COMMENT_MODE
                ]
            }, {
                className: "stl_container",
                begin: "\\b(deque|list|queue|stack|vector|map|set|bitset|multiset|multimap|unordered_map|unordered_set|unordered_multiset|unordered_multimap|array)\\s*<",
                end: ">",
                keywords: b,
                relevance: 10,
                contains: ["self"]
            }
        ]
    }
}(hljs);
hljs.LANGUAGES.tex = function (a) {
    var d = {
            className: "command",
            begin: "\\\\[a-zA-Zа-яА-я]+[\\*]?"
        };
    var c = {
            className: "command",
            begin: "\\\\[^a-zA-Zа-яА-я0-9]"
        };
    var b = {
            className: "special",
            begin: "[{}\\[\\]\\&#~]",
            relevance: 0
        };
    return {
        contains: [
            {
                begin: "\\\\[a-zA-Zа-яА-я]+[\\*]? *= *-?\\d*\\.?\\d+(pt|pc|mm|cm|in|dd|cc|ex|em)?",
                returnBegin: true,
                contains: [
                    d, c, {
                        className: "number",
                        begin: " *=",
                        end: "-?\\d*\\.?\\d+(pt|pc|mm|cm|in|dd|cc|ex|em)?",
                        excludeBegin: true
                    }
                ],
                relevance: 10
            }, d, c, b, {
                className: "formula",
                begin: "\\$\\$",
                end: "\\$\\$",
                contains: [
                    d, c, b
                ],
                relevance: 0
            }, {
                className: "formula",
                begin: "\\$",
                end: "\\$",
                contains: [
                    d, c, b
                ],
                relevance: 0
            }, {
                className: "comment",
                begin: "%",
                end: "$",
                relevance: 0
            }
        ]
    }
}(hljs);
hljs.LANGUAGES.profile = function (a) {
    return {
        contains: [
            a.C_NUMBER_MODE, {
                className: "built_in",
                begin: "{",
                end: "}$",
                excludeBegin: true,
                excludeEnd: true,
                contains: [
                    a.APOS_STRING_MODE, a.QUOTE_STRING_MODE
                ],
                relevance: 0
            }, {
                className: "filename",
                begin: "[a-zA-Z_][\\da-zA-Z_]+\\.[\\da-zA-Z_]{1,3}",
                end: ":",
                excludeEnd: true
            }, {
                className: "header",
                begin: "(ncalls|tottime|cumtime)",
                end: "$",
                keywords: "ncalls tottime|10 cumtime|10 filename",
                relevance: 10
            }, {
                className: "summary",
                begin: "function calls",
                end: "$",
                contains: [a.C_NUMBER_MODE],
                relevance: 10
            }, a.APOS_STRING_MODE, a.QUOTE_STRING_MODE, {
                className: "function",
                begin: "\\(",
                end: "\\)$",
                contains: [
                    {
                        className: "title",
                        begin: a.UNDERSCORE_IDENT_RE,
                        relevance: 0
                    }
                ],
                relevance: 0
            }
        ]
    }
}(hljs);
hljs.LANGUAGES.rib = function (a) {
    return {
        keywords: "ArchiveRecord AreaLightSource Atmosphere Attribute AttributeBegin AttributeEnd Basis Begin Blobby Bound Clipping ClippingPlane Color ColorSamples ConcatTransform Cone CoordinateSystem CoordSysTransform CropWindow Curves Cylinder DepthOfField Detail DetailRange Disk Displacement Display End ErrorHandler Exposure Exterior Format FrameAspectRatio FrameBegin FrameEnd GeneralPolygon GeometricApproximation Geometry Hider Hyperboloid Identity Illuminate Imager Interior LightSource MakeCubeFaceEnvironment MakeLatLongEnvironment MakeShadow MakeTexture Matte MotionBegin MotionEnd NuPatch ObjectBegin ObjectEnd ObjectInstance Opacity Option Orientation Paraboloid Patch PatchMesh Perspective PixelFilter PixelSamples PixelVariance Points PointsGeneralPolygons PointsPolygons Polygon Procedural Projection Quantize ReadArchive RelativeDetail ReverseOrientation Rotate Scale ScreenWindow ShadingInterpolation ShadingRate Shutter Sides Skew SolidBegin SolidEnd Sphere SubdivisionMesh Surface TextureCoordinates Torus Transform TransformBegin TransformEnd TransformPoints Translate TrimCurve WorldBegin WorldEnd",
        illegal: "</",
        contains: [
            a.HASH_COMMENT_MODE, a.C_NUMBER_MODE, a.APOS_STRING_MODE, a.QUOTE_STRING_MODE
        ]
    }
}(hljs);
hljs.LANGUAGES.vhdl = function (a) {
    return {
        case_insensitive: true,
        keywords: {
            keyword: "abs access after alias all and architecture array assert attribute begin block body buffer bus case component configuration constant context cover disconnect downto default else elsif end entity exit fairness file for force function generate generic group guarded if impure in inertial inout is label library linkage literal loop map mod nand new next nor not null of on open or others out package port postponed procedure process property protected pure range record register reject release rem report restrict restrict_guarantee return rol ror select sequence severity shared signal sla sll sra srl strong subtype then to transport type unaffected units until use variable vmode vprop vunit wait when while with xnor xor",
            typename: "boolean bit character severity_level integer time delay_length natural positive string bit_vector file_open_kind file_open_status std_ulogic std_ulogic_vector std_logic std_logic_vector unsigned signed boolean_vector integer_vector real_vector time_vector"
        },
        illegal: "{",
        contains: [
            a.C_BLOCK_COMMENT_MODE, {
                className: "comment",
                begin: "--",
                end: "$"
            }, a.QUOTE_STRING_MODE, a.C_NUMBER_MODE, {
                className: "literal",
                begin: "'(U|X|0|1|Z|W|L|H|-)'",
                contains: [a.BACKSLASH_ESCAPE]
            }, {
                className: "attribute",
                begin: "'[A-Za-z](_?[A-Za-z0-9])*",
                contains: [a.BACKSLASH_ESCAPE]
            }
        ]
    }
}(hljs);
hljs.LANGUAGES.lisp = function (i) {
    var l = "[a-zA-Z_\\-\\+\\*\\/\\<\\=\\>\\&\\#][a-zA-Z0-9_\\-\\+\\*\\/\\<\\=\\>\\&\\#!]*";
    var m = "(\\-|\\+)?\\d+(\\.\\d+|\\/\\d+)?((d|e|f|l|s)(\\+|\\-)?\\d+)?";
    var k = {
            className: "shebang",
            begin: "^#!",
            end: "$"
        };
    var a = {
            className: "literal",
            begin: "\\b(t{1}|nil)\\b"
        };
    var d = [
            {
                className: "number",
                begin: m
            }, {
                className: "number",
                begin: "#b[0-1]+(/[0-1]+)?"
            }, {
                className: "number",
                begin: "#o[0-7]+(/[0-7]+)?"
            }, {
                className: "number",
                begin: "#x[0-9a-f]+(/[0-9a-f]+)?"
            }, {
                className: "number",
                begin: "#c\\(" + m + " +" + m,
                end: "\\)"
            }
        ];
    var h = {
            className: "string",
            begin: '"',
            end: '"',
            contains: [i.BACKSLASH_ESCAPE],
            relevance: 0
        };
    var n = {
            className: "comment",
            begin: ";",
            end: "$"
        };
    var g = {
            className: "variable",
            begin: "\\*",
            end: "\\*"
        };
    var o = {
            className: "keyword",
            begin: "[:&]" + l
        };
    var b = {
            begin: "\\(",
            end: "\\)",
            contains: [
                "self", a, h
            ].concat(d)
        };
    var e = {
            className: "quoted",
            begin: "['`]\\(",
            end: "\\)",
            contains: d.concat([
                h, g, o, b
            ])
        };
    var c = {
            className: "quoted",
            begin: "\\(quote ",
            end: "\\)",
            keywords: {
                title: "quote"
            },
            contains: d.concat([
                h, g, o, b
            ])
        };
    var j = {
            className: "list",
            begin: "\\(",
            end: "\\)"
        };
    var f = {
            endsWithParent: true,
            relevance: 0
        };
    j.contains = [
        {
            className: "title",
            begin: l
        }, f
    ];
    f.contains = [
        e, c, j, a
    ].concat(d).concat([
        h, n, g, o
    ]);
    return {
        illegal: "[^\\s]",
        contains: d.concat([
            k, a, h, n, e, c, j
        ])
    }
}(hljs);
hljs.LANGUAGES.erlang = function (i) {
    var c = "[a-z'][a-zA-Z0-9_']*";
    var o = "(" + c + ":" + c + "|" + c + ")";
    var f = {
            keyword: "after and andalso|10 band begin bnot bor bsl bzr bxor case catch cond div end fun let not of orelse|10 query receive rem try when xor",
            literal: "false true"
        };
    var l = {
            className: "comment",
            begin: "%",
            end: "$",
            relevance: 0
        };
    var e = {
            className: "number",
            begin: "\\b(\\d+#[a-fA-F0-9]+|\\d+(\\.\\d+)?([eE][-+]?\\d+)?)",
            relevance: 0
        };
    var g = {
            begin: "fun\\s+" + c + "/\\d+"
        };
    var n = {
            begin: o + "\\(",
            end: "\\)",
            returnBegin: true,
            relevance: 0,
            contains: [
                {
                    className: "function_name",
                    begin: o,
                    relevance: 0
                }, {
                    begin: "\\(",
                    end: "\\)",
                    endsWithParent: true,
                    returnEnd: true,
                    relevance: 0
                }
            ]
        };
    var h = {
            className: "tuple",
            begin: "{",
            end: "}",
            relevance: 0
        };
    var a = {
            className: "variable",
            begin: "\\b_([A-Z][A-Za-z0-9_]*)?",
            relevance: 0
        };
    var m = {
            className: "variable",
            begin: "[A-Z][a-zA-Z0-9_]*",
            relevance: 0
        };
    var b = {
            begin: "#",
            end: "}",
            illegal: ".",
            relevance: 0,
            returnBegin: true,
            contains: [
                {
                    className: "record_name",
                    begin: "#" + i.UNDERSCORE_IDENT_RE,
                    relevance: 0
                }, {
                    begin: "{",
                    endsWithParent: true,
                    relevance: 0
                }
            ]
        };
    var k = {
            keywords: f,
            begin: "(fun|receive|if|try|case)",
            end: "end"
        };
    k.contains = [
        l, g, i.inherit(i.APOS_STRING_MODE, {
            className: ""
        }), k, n, i.QUOTE_STRING_MODE, e, h, a, m, b
    ];
    var j = [
            l, g, k, n, i.QUOTE_STRING_MODE, e, h, a, m, b
        ];
    n.contains[1].contains = j;
    h.contains = j;
    b.contains[1].contains = j;
    var d = {
            className: "params",
            begin: "\\(",
            end: "\\)",
            contains: j
        };
    return {
        keywords: f,
        illegal: "(</|\\*=|\\+=|-=|/=|/\\*|\\*/|\\(\\*|\\*\\))",
        contains: [
            {
                className: "function",
                begin: "^" + c + "\\s*\\(",
                end: "->",
                returnBegin: true,
                illegal: "\\(|#|//|/\\*|\\\\|:",
                contains: [
                    d, {
                        className: "title",
                        begin: c
                    }
                ],
                starts: {
                    end: ";|\\.",
                    keywords: f,
                    contains: j
                }
            }, l, {
                className: "pp",
                begin: "^-",
                end: "\\.",
                relevance: 0,
                excludeEnd: true,
                returnBegin: true,
                lexems: "-" + i.IDENT_RE,
                keywords: "-module -record -undef -export -ifdef -ifndef -author -copyright -doc -vsn -import -include -include_lib -compile -define -else -endif -file -behaviour -behavior",
                contains: [d]
            }, e, i.QUOTE_STRING_MODE, b, a, m, h
        ]
    }
}(hljs);
hljs.LANGUAGES.nginx = function (b) {
    var c = [
            {
                className: "variable",
                begin: "\\$\\d+"
            }, {
                className: "variable",
                begin: "\\${",
                end: "}"
            }, {
                className: "variable",
                begin: "[\\$\\@]" + b.UNDERSCORE_IDENT_RE
            }
        ];
    var a = {
            endsWithParent: true,
            lexems: "[a-z/_]+",
            keywords: {
                built_in: "on off yes no true false none blocked debug info notice warn error crit select break last permanent redirect kqueue rtsig epoll poll /dev/poll"
            },
            relevance: 0,
            illegal: "=>",
            contains: [
                b.HASH_COMMENT_MODE, {
                    className: "string",
                    begin: '"',
                    end: '"',
                    contains: [b.BACKSLASH_ESCAPE].concat(c),
                    relevance: 0
                }, {
                    className: "string",
                    begin: "'",
                    end: "'",
                    contains: [b.BACKSLASH_ESCAPE].concat(c),
                    relevance: 0
                }, {
                    className: "url",
                    begin: "([a-z]+):/",
                    end: "\\s",
                    endsWithParent: true,
                    excludeEnd: true
                }, {
                    className: "regexp",
                    begin: "\\s\\^",
                    end: "\\s|{|;",
                    returnEnd: true,
                    contains: [b.BACKSLASH_ESCAPE].concat(c)
                }, {
                    className: "regexp",
                    begin: "~\\*?\\s+",
                    end: "\\s|{|;",
                    returnEnd: true,
                    contains: [b.BACKSLASH_ESCAPE].concat(c)
                }, {
                    className: "regexp",
                    begin: "\\*(\\.[a-z\\-]+)+",
                    contains: [b.BACKSLASH_ESCAPE].concat(c)
                }, {
                    className: "regexp",
                    begin: "([a-z\\-]+\\.)+\\*",
                    contains: [b.BACKSLASH_ESCAPE].concat(c)
                }, {
                    className: "number",
                    begin: "\\b\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}(:\\d{1,5})?\\b"
                }, {
                    className: "number",
                    begin: "\\b\\d+[kKmMgGdshdwy]*\\b",
                    relevance: 0
                }
            ].concat(c)
        };
    return {
        contains: [
            b.HASH_COMMENT_MODE, {
                begin: b.UNDERSCORE_IDENT_RE + "\\s",
                end: ";|{",
                returnBegin: true,
                contains: [
                    {
                        className: "title",
                        begin: b.UNDERSCORE_IDENT_RE,
                        starts: a
                    }
                ],
                relevance: 0
            }
        ],
        illegal: "[^\\s\\}]"
    }
}(hljs);
hljs.LANGUAGES.ruleslanguage = function (a) {
    return {
        keywords: {
            keyword: "BILL_PERIOD BILL_START BILL_STOP RS_EFFECTIVE_START RS_EFFECTIVE_STOP RS_JURIS_CODE RS_OPCO_CODE INTDADDATTRIBUTE|5 INTDADDVMSG|5 INTDBLOCKOP|5 INTDBLOCKOPNA|5 INTDCLOSE|5 INTDCOUNT|5 INTDCOUNTSTATUSCODE|5 INTDCREATEMASK|5 INTDCREATEDAYMASK|5 INTDCREATEFACTORMASK|5 INTDCREATEHANDLE|5 INTDCREATEMASK|5 INTDCREATEOVERRIDEDAYMASK|5 INTDCREATEOVERRIDEMASK|5 INTDCREATESTATUSCODEMASK|5 INTDCREATETOUPERIOD|5 INTDDELETE|5 INTDDIPTEST|5 INTDEXPORT|5 INTDGETERRORCODE|5 INTDGETERRORMESSAGE|5 INTDISEQUAL|5 INTDJOIN|5 INTDLOAD|5 INTDLOADACTUALCUT|5 INTDLOADDATES|5 INTDLOADHIST|5 INTDLOADLIST|5 INTDLOADLISTDATES|5 INTDLOADLISTENERGY|5 INTDLOADLISTHIST|5 INTDLOADRELATEDCHANNEL|5 INTDLOADSP|5 INTDLOADSTAGING|5 INTDLOADUOM|5 INTDLOADUOMDATES|5 INTDLOADUOMHIST|5 INTDLOADVERSION|5 INTDOPEN|5 INTDREADFIRST|5 INTDREADNEXT|5 INTDRECCOUNT|5 INTDRELEASE|5 INTDREPLACE|5 INTDROLLAVG|5 INTDROLLPEAK|5 INTDSCALAROP|5 INTDSCALE|5 INTDSETATTRIBUTE|5 INTDSETDSTPARTICIPANT|5 INTDSETSTRING|5 INTDSETVALUE|5 INTDSETVALUESTATUS|5 INTDSHIFTSTARTTIME|5 INTDSMOOTH|5 INTDSORT|5 INTDSPIKETEST|5 INTDSUBSET|5 INTDTOU|5 INTDTOURELEASE|5 INTDTOUVALUE|5 INTDUPDATESTATS|5 INTDVALUE|5 STDEV INTDDELETEEX|5 INTDLOADEXACTUAL|5 INTDLOADEXCUT|5 INTDLOADEXDATES|5 INTDLOADEX|5 INTDLOADEXRELATEDCHANNEL|5 INTDSAVEEX|5 MVLOAD|5 MVLOADACCT|5 MVLOADACCTDATES|5 MVLOADACCTHIST|5 MVLOADDATES|5 MVLOADHIST|5 MVLOADLIST|5 MVLOADLISTDATES|5 MVLOADLISTHIST|5 IF FOR NEXT DONE SELECT END CALL ABORT CLEAR CHANNEL FACTOR LIST NUMBER OVERRIDE SET WEEK DISTRIBUTIONNODE ELSE WHEN THEN OTHERWISE IENUM CSV INCLUDE LEAVE RIDER SAVE DELETE NOVALUE SECTION WARN DELETE SAVE SAVE_UPDATE CLEAR DETERMINANT LABEL REPORT REVENUE ABORT CALL DONE LEAVE EACH IN LIST NOVALUE FROM TOTAL CHARGE BLOCK AND OR CSV_FILE BILL_PERIOD RATE_CODE AUXILIARY_DEMAND UIDACCOUNT RS BILL_PERIOD_SELECT HOURS_PER_MONTH INTD_ERROR_STOP SEASON_SCHEDULE_NAME ACCOUNTFACTOR ARRAYUPPERBOUND CALLSTOREDPROC GETADOCONNECTION GETCONNECT GETDATASOURCE GETQUALIFIER GETUSERID HASVALUE LISTCOUNT LISTOP LISTUPDATE LISTVALUE PRORATEFACTOR RSPRORATE SETBINPATH SETDBMONITOR WQ_OPEN BILLINGHOURS DATE DATEFROMFLOAT DATETIMEFROMSTRING DATETIMETOSTRING DATETOFLOAT DAY DAYDIFF DAYNAME DBDATETIME HOUR MINUTE MONTH MONTHDIFF MONTHHOURS MONTHNAME ROUNDDATE SAMEWEEKDAYLASTYEAR SECOND WEEKDAY WEEKDIFF YEAR YEARDAY YEARSTR COMPSUM HISTCOUNT HISTMAX HISTMIN HISTMINNZ HISTVALUE MAXNRANGE MAXRANGE MINRANGE COMPIKVA COMPKVA COMPKVARFROMKQKW COMPLF IDATTR FLAG LF2KW LF2KWH MAXKW POWERFACTOR READING2USAGE AVGSEASON MAXSEASON MONTHLYMERGE SEASONVALUE SUMSEASON ACCTREADDATES ACCTTABLELOAD CONFIGADD CONFIGGET CREATEOBJECT CREATEREPORT EMAILCLIENT EXPBLKMDMUSAGE EXPMDMUSAGE EXPORT_USAGE FACTORINEFFECT GETUSERSPECIFIEDSTOP INEFFECT ISHOLIDAY RUNRATE SAVE_PROFILE SETREPORTTITLE USEREXIT WATFORRUNRATE TO TABLE ACOS ASIN ATAN ATAN2 BITAND CEIL COS COSECANT COSH COTANGENT DIVQUOT DIVREM EXP FABS FLOOR FMOD FREPM FREXPN LOG LOG10 MAX MAXN MIN MINNZ MODF POW ROUND ROUND2VALUE ROUNDINT SECANT SIN SINH SQROOT TAN TANH FLOAT2STRING FLOAT2STRINGNC INSTR LEFT LEN LTRIM MID RIGHT RTRIM STRING STRINGNC TOLOWER TOUPPER TRIM ABORT WARN NUMDAYS RATE_CODE READ_DATE STAGING",
            built_in: "IDENTIFIER OPTIONS XML_ELEMENT XML_OP XML_ELEMENT_OF DOMDOCCREATE DOMDOCLOADFILE DOMDOCLOADXML DOMDOCSAVEFILE DOMDOCGETROOT DOMDOCADDPI DOMNODEGETNAME DOMNODEGETTYPE DOMNODEGETVALUE DOMNODEGETCHILDCT DOMNODEGETFIRSTCHILD DOMNODEGETSIBLING DOMNODECREATECHILDELEMENT DOMNODESETATTRIBUTE DOMNODEGETCHILDELEMENTCT DOMNODEGETFIRSTCHILDELEMENT DOMNODEGETSIBLINGELEMENT DOMNODEGETATTRIBUTECT DOMNODEGETATTRIBUTEI DOMNODEGETATTRIBUTEBYNAME DOMNODEGETBYNAME"
        },
        contains: [
            a.C_LINE_COMMENT_MODE, a.C_BLOCK_COMMENT_MODE, a.APOS_STRING_MODE, a.QUOTE_STRING_MODE, a.C_NUMBER_MODE, {
                className: "array",
                begin: "#[a-zA-Z .]+"
            }
        ]
    }
}(hljs);
hljs.LANGUAGES.rust = function (b) {
    var d = {
            className: "title",
            begin: b.UNDERSCORE_IDENT_RE
        };
    var c = {
            className: "number",
            begin: "\\b(0[xb][A-Za-z0-9_]+|[0-9_]+(\\.[0-9_]+)?([uif](8|16|32|64)?)?)",
            relevance: 0
        };
    var a = "assert bool break char check claim comm const cont copy dir do drop else enum extern export f32 f64 fail false float fn for i16 i32 i64 i8 if impl int let log loop match mod move mut priv pub pure ref return self static str struct task true trait type u16 u32 u64 u8 uint unsafe use vec while";
    return {
        keywords: a,
        illegal: "</",
        contains: [
            b.C_LINE_COMMENT_MODE, b.C_BLOCK_COMMENT_MODE, b.inherit(b.QUOTE_STRING_MODE, {
                illegal: null
            }), b.APOS_STRING_MODE, c, {
                className: "function",
                beginWithKeyword: true,
                end: "(\\(|<)",
                keywords: "fn",
                contains: [d]
            }, {
                className: "preprocessor",
                begin: "#\\[",
                end: "\\]"
            }, {
                beginWithKeyword: true,
                end: "(=|<)",
                keywords: "type",
                contains: [d],
                illegal: "\\S"
            }, {
                beginWithKeyword: true,
                end: "({|<)",
                keywords: "trait enum",
                contains: [d],
                illegal: "\\S"
            }
        ]
    }
}(hljs);
hljs.LANGUAGES.cs = function (a) {
    return {
        keywords: "abstract as base bool break byte case catch char checked class const continue decimal default delegate do double else enum event explicit extern false finally fixed float for foreach goto if implicit in int interface internal is lock long namespace new null object operator out override params private protected public readonly ref return sbyte sealed short sizeof stackalloc static string struct switch this throw true try typeof uint ulong unchecked unsafe ushort using virtual volatile void while async await ascending descending from get group into join let orderby partial select set value var where yield",
        contains: [
            {
                className: "comment",
                begin: "///",
                end: "$",
                returnBegin: true,
                contains: [
                    {
                        className: "xmlDocTag",
                        begin: "///|<!--|-->"
                    }, {
                        className: "xmlDocTag",
                        begin: "</?",
                        end: ">"
                    }
                ]
            }, a.C_LINE_COMMENT_MODE, a.C_BLOCK_COMMENT_MODE, {
                className: "preprocessor",
                begin: "#",
                end: "$",
                keywords: "if else elif endif define undef warning error line region endregion pragma checksum"
            }, {
                className: "string",
                begin: '@"',
                end: '"',
                contains: [
                    {
                        begin: '""'
                    }
                ]
            }, a.APOS_STRING_MODE, a.QUOTE_STRING_MODE, a.C_NUMBER_MODE
        ]
    }
}(hljs);
hljs.LANGUAGES.haskell = function (a) {
    var d = {
            className: "type",
            begin: "\\b[A-Z][\\w']*",
            relevance: 0
        };
    var c = {
            className: "container",
            begin: "\\(",
            end: "\\)",
            illegal: '"',
            contains: [
                {
                    className: "type",
                    begin: "\\b[A-Z][\\w]*(\\((\\.\\.|,|\\w+)\\))?"
                }, {
                    className: "title",
                    begin: "[_a-z][\\w']*"
                }
            ]
        };
    var b = {
            className: "container",
            begin: "{",
            end: "}",
            contains: c.contains
        };
    return {
        keywords: "let in if then else case of where do module import hiding qualified type data newtype deriving class instance not as foreign ccall safe unsafe",
        contains: [
            {
                className: "comment",
                begin: "--",
                end: "$"
            }, {
                className: "preprocessor",
                begin: "{-#",
                end: "#-}"
            }, {
                className: "comment",
                contains: ["self"],
                begin: "{-",
                end: "-}"
            }, {
                className: "string",
                begin: "\\s+'",
                end: "'",
                contains: [a.BACKSLASH_ESCAPE],
                relevance: 0
            }, a.QUOTE_STRING_MODE, {
                className: "import",
                begin: "\\bimport",
                end: "$",
                keywords: "import qualified as hiding",
                contains: [c],
                illegal: "\\W\\.|;"
            }, {
                className: "module",
                begin: "\\bmodule",
                end: "where",
                keywords: "module where",
                contains: [c],
                illegal: "\\W\\.|;"
            }, {
                className: "class",
                begin: "\\b(class|instance)",
                end: "where",
                keywords: "class where instance",
                contains: [d]
            }, {
                className: "typedef",
                begin: "\\b(data|(new)?type)",
                end: "$",
                keywords: "data type newtype deriving",
                contains: [
                    d, c, b
                ]
            }, a.C_NUMBER_MODE, {
                className: "shebang",
                begin: "#!\\/usr\\/bin\\/env runhaskell",
                end: "$"
            }, d, {
                className: "title",
                begin: "^[_a-z][\\w']*"
            }, {
                begin: "->|<-"
            }
        ]
    }
}(hljs);
hljs.LANGUAGES.d = function (x) {
    var b = {
            keyword: "abstract alias align asm assert auto body break byte case cast catch class const continue debug default delete deprecated do else enum export extern final finally for foreach foreach_reverse|10 goto if immutable import in inout int interface invariant is lazy macro mixin module new nothrow out override package pragma private protected public pure ref return scope shared static struct super switch synchronized template this throw try typedef typeid typeof union unittest version void volatile while with __FILE__ __LINE__ __gshared|10 __thread __traits __DATE__ __EOF__ __TIME__ __TIMESTAMP__ __VENDOR__ __VERSION__",
            built_in: "bool cdouble cent cfloat char creal dchar delegate double dstring float function idouble ifloat ireal long real short string ubyte ucent uint ulong ushort wchar wstring",
            literal: "false null true"
        };
    var c = "(0|[1-9][\\d_]*)",
        q = "(0|[1-9][\\d_]*|\\d[\\d_]*|[\\d_]+?\\d)",
        h = "0[bB][01_]+",
        v = "([\\da-fA-F][\\da-fA-F_]*|_[\\da-fA-F][\\da-fA-F_]*)",
        y = "0[xX]" + v,
        p = "([eE][+-]?" + q + ")",
        o = "(" + q + "(\\.\\d*|" + p + ")|\\d+\\." + q + q + "|\\." + c + p + "?)",
        k = "(0[xX](" + v + "\\." + v + "|\\.?" + v + ")[pP][+-]?" + q + ")",
        l = "(" + c + "|" + h + "|" + y + ")",
        n = "(" + k + "|" + o + ")";
    var z = "\\\\(['\"\\?\\\\abfnrtv]|u[\\dA-Fa-f]{4}|[0-7]{1,3}|x[\\dA-Fa-f]{2}|U[\\dA-Fa-f]{8})|&[a-zA-Z\\d]{2,};";
    var m = {
            className: "number",
            begin: "\\b" + l + "(L|u|U|Lu|LU|uL|UL)?",
            relevance: 0
        };
    var j = {
            className: "number",
            begin: "\\b(" + n + "([fF]|L|i|[fF]i|Li)?|" + l + "(i|[fF]i|Li))",
            relevance: 0
        };
    var s = {
            className: "string",
            begin: "'(" + z + "|.)",
            end: "'",
            illegal: "."
        };
    var r = {
            begin: z,
            relevance: 0
        };
    var w = {
            className: "string",
            begin: '"',
            contains: [r],
            end: '"[cwd]?',
            relevance: 0
        };
    var f = {
            className: "string",
            begin: '[rq]"',
            end: '"[cwd]?',
            relevance: 5
        };
    var u = {
            className: "string",
            begin: "`",
            end: "`[cwd]?"
        };
    var i = {
            className: "string",
            begin: 'x"[\\da-fA-F\\s\\n\\r]*"[cwd]?',
            relevance: 10
        };
    var t = {
            className: "string",
            begin: 'q"\\{',
            end: '\\}"'
        };
    var e = {
            className: "shebang",
            begin: "^#!",
            end: "$",
            relevance: 5
        };
    var g = {
            className: "preprocessor",
            begin: "#(line)",
            end: "$",
            relevance: 5
        };
    var d = {
            className: "keyword",
            begin: "@[a-zA-Z_][a-zA-Z_\\d]*"
        };
    var a = {
            className: "comment",
            begin: "\\/\\+",
            contains: ["self"],
            end: "\\+\\/",
            relevance: 10
        };
    return {
        lexems: x.UNDERSCORE_IDENT_RE,
        keywords: b,
        contains: [
            x.C_LINE_COMMENT_MODE, x.C_BLOCK_COMMENT_MODE, a, i, w, f, u, t, j, m, s, e, g, d
        ]
    }
}(hljs);
hljs.LANGUAGES.mel = function (a) {
    return {
        keywords: "int float string vector matrix if else switch case default while do for in break continue global proc return about abs addAttr addAttributeEditorNodeHelp addDynamic addNewShelfTab addPP addPanelCategory addPrefixToName advanceToNextDrivenKey affectedNet affects aimConstraint air alias aliasAttr align alignCtx alignCurve alignSurface allViewFit ambientLight angle angleBetween animCone animCurveEditor animDisplay animView annotate appendStringArray applicationName applyAttrPreset applyTake arcLenDimContext arcLengthDimension arclen arrayMapper art3dPaintCtx artAttrCtx artAttrPaintVertexCtx artAttrSkinPaintCtx artAttrTool artBuildPaintMenu artFluidAttrCtx artPuttyCtx artSelectCtx artSetPaintCtx artUserPaintCtx assignCommand assignInputDevice assignViewportFactories attachCurve attachDeviceAttr attachSurface attrColorSliderGrp attrCompatibility attrControlGrp attrEnumOptionMenu attrEnumOptionMenuGrp attrFieldGrp attrFieldSliderGrp attrNavigationControlGrp attrPresetEditWin attributeExists attributeInfo attributeMenu attributeQuery autoKeyframe autoPlace bakeClip bakeFluidShading bakePartialHistory bakeResults bakeSimulation basename basenameEx batchRender bessel bevel bevelPlus binMembership bindSkin blend2 blendShape blendShapeEditor blendShapePanel blendTwoAttr blindDataType boneLattice boundary boxDollyCtx boxZoomCtx bufferCurve buildBookmarkMenu buildKeyframeMenu button buttonManip CBG cacheFile cacheFileCombine cacheFileMerge cacheFileTrack camera cameraView canCreateManip canvas capitalizeString catch catchQuiet ceil changeSubdivComponentDisplayLevel changeSubdivRegion channelBox character characterMap characterOutlineEditor characterize chdir checkBox checkBoxGrp checkDefaultRenderGlobals choice circle circularFillet clamp clear clearCache clip clipEditor clipEditorCurrentTimeCtx clipSchedule clipSchedulerOutliner clipTrimBefore closeCurve closeSurface cluster cmdFileOutput cmdScrollFieldExecuter cmdScrollFieldReporter cmdShell coarsenSubdivSelectionList collision color colorAtPoint colorEditor colorIndex colorIndexSliderGrp colorSliderButtonGrp colorSliderGrp columnLayout commandEcho commandLine commandPort compactHairSystem componentEditor compositingInterop computePolysetVolume condition cone confirmDialog connectAttr connectControl connectDynamic connectJoint connectionInfo constrain constrainValue constructionHistory container containsMultibyte contextInfo control convertFromOldLayers convertIffToPsd convertLightmap convertSolidTx convertTessellation convertUnit copyArray copyFlexor copyKey copySkinWeights cos cpButton cpCache cpClothSet cpCollision cpConstraint cpConvClothToMesh cpForces cpGetSolverAttr cpPanel cpProperty cpRigidCollisionFilter cpSeam cpSetEdit cpSetSolverAttr cpSolver cpSolverTypes cpTool cpUpdateClothUVs createDisplayLayer createDrawCtx createEditor createLayeredPsdFile createMotionField createNewShelf createNode createRenderLayer createSubdivRegion cross crossProduct ctxAbort ctxCompletion ctxEditMode ctxTraverse currentCtx currentTime currentTimeCtx currentUnit currentUnit curve curveAddPtCtx curveCVCtx curveEPCtx curveEditorCtx curveIntersect curveMoveEPCtx curveOnSurface curveSketchCtx cutKey cycleCheck cylinder dagPose date defaultLightListCheckBox defaultNavigation defineDataServer defineVirtualDevice deformer deg_to_rad delete deleteAttr deleteShadingGroupsAndMaterials deleteShelfTab deleteUI deleteUnusedBrushes delrandstr detachCurve detachDeviceAttr detachSurface deviceEditor devicePanel dgInfo dgdirty dgeval dgtimer dimWhen directKeyCtx directionalLight dirmap dirname disable disconnectAttr disconnectJoint diskCache displacementToPoly displayAffected displayColor displayCull displayLevelOfDetail displayPref displayRGBColor displaySmoothness displayStats displayString displaySurface distanceDimContext distanceDimension doBlur dolly dollyCtx dopeSheetEditor dot dotProduct doubleProfileBirailSurface drag dragAttrContext draggerContext dropoffLocator duplicate duplicateCurve duplicateSurface dynCache dynControl dynExport dynExpression dynGlobals dynPaintEditor dynParticleCtx dynPref dynRelEdPanel dynRelEditor dynamicLoad editAttrLimits editDisplayLayerGlobals editDisplayLayerMembers editRenderLayerAdjustment editRenderLayerGlobals editRenderLayerMembers editor editorTemplate effector emit emitter enableDevice encodeString endString endsWith env equivalent equivalentTol erf error eval eval evalDeferred evalEcho event exactWorldBoundingBox exclusiveLightCheckBox exec executeForEachObject exists exp expression expressionEditorListen extendCurve extendSurface extrude fcheck fclose feof fflush fgetline fgetword file fileBrowserDialog fileDialog fileExtension fileInfo filetest filletCurve filter filterCurve filterExpand filterStudioImport findAllIntersections findAnimCurves findKeyframe findMenuItem findRelatedSkinCluster finder firstParentOf fitBspline flexor floatEq floatField floatFieldGrp floatScrollBar floatSlider floatSlider2 floatSliderButtonGrp floatSliderGrp floor flow fluidCacheInfo fluidEmitter fluidVoxelInfo flushUndo fmod fontDialog fopen formLayout format fprint frameLayout fread freeFormFillet frewind fromNativePath fwrite gamma gauss geometryConstraint getApplicationVersionAsFloat getAttr getClassification getDefaultBrush getFileList getFluidAttr getInputDeviceRange getMayaPanelTypes getModifiers getPanel getParticleAttr getPluginResource getenv getpid glRender glRenderEditor globalStitch gmatch goal gotoBindPose grabColor gradientControl gradientControlNoAttr graphDollyCtx graphSelectContext graphTrackCtx gravity grid gridLayout group groupObjectsByName HfAddAttractorToAS HfAssignAS HfBuildEqualMap HfBuildFurFiles HfBuildFurImages HfCancelAFR HfConnectASToHF HfCreateAttractor HfDeleteAS HfEditAS HfPerformCreateAS HfRemoveAttractorFromAS HfSelectAttached HfSelectAttractors HfUnAssignAS hardenPointCurve hardware hardwareRenderPanel headsUpDisplay headsUpMessage help helpLine hermite hide hilite hitTest hotBox hotkey hotkeyCheck hsv_to_rgb hudButton hudSlider hudSliderButton hwReflectionMap hwRender hwRenderLoad hyperGraph hyperPanel hyperShade hypot iconTextButton iconTextCheckBox iconTextRadioButton iconTextRadioCollection iconTextScrollList iconTextStaticLabel ikHandle ikHandleCtx ikHandleDisplayScale ikSolver ikSplineHandleCtx ikSystem ikSystemInfo ikfkDisplayMethod illustratorCurves image imfPlugins inheritTransform insertJoint insertJointCtx insertKeyCtx insertKnotCurve insertKnotSurface instance instanceable instancer intField intFieldGrp intScrollBar intSlider intSliderGrp interToUI internalVar intersect iprEngine isAnimCurve isConnected isDirty isParentOf isSameObject isTrue isValidObjectName isValidString isValidUiName isolateSelect itemFilter itemFilterAttr itemFilterRender itemFilterType joint jointCluster jointCtx jointDisplayScale jointLattice keyTangent keyframe keyframeOutliner keyframeRegionCurrentTimeCtx keyframeRegionDirectKeyCtx keyframeRegionDollyCtx keyframeRegionInsertKeyCtx keyframeRegionMoveKeyCtx keyframeRegionScaleKeyCtx keyframeRegionSelectKeyCtx keyframeRegionSetKeyCtx keyframeRegionTrackCtx keyframeStats lassoContext lattice latticeDeformKeyCtx launch launchImageEditor layerButton layeredShaderPort layeredTexturePort layout layoutDialog lightList lightListEditor lightListPanel lightlink lineIntersection linearPrecision linstep listAnimatable listAttr listCameras listConnections listDeviceAttachments listHistory listInputDeviceAxes listInputDeviceButtons listInputDevices listMenuAnnotation listNodeTypes listPanelCategories listRelatives listSets listTransforms listUnselected listerEditor loadFluid loadNewShelf loadPlugin loadPluginLanguageResources loadPrefObjects localizedPanelLabel lockNode loft log longNameOf lookThru ls lsThroughFilter lsType lsUI Mayatomr mag makeIdentity makeLive makePaintable makeRoll makeSingleSurface makeTubeOn makebot manipMoveContext manipMoveLimitsCtx manipOptions manipRotateContext manipRotateLimitsCtx manipScaleContext manipScaleLimitsCtx marker match max memory menu menuBarLayout menuEditor menuItem menuItemToShelf menuSet menuSetPref messageLine min minimizeApp mirrorJoint modelCurrentTimeCtx modelEditor modelPanel mouse movIn movOut move moveIKtoFK moveKeyCtx moveVertexAlongDirection multiProfileBirailSurface mute nParticle nameCommand nameField namespace namespaceInfo newPanelItems newton nodeCast nodeIconButton nodeOutliner nodePreset nodeType noise nonLinear normalConstraint normalize nurbsBoolean nurbsCopyUVSet nurbsCube nurbsEditUV nurbsPlane nurbsSelect nurbsSquare nurbsToPoly nurbsToPolygonsPref nurbsToSubdiv nurbsToSubdivPref nurbsUVSet nurbsViewDirectionVector objExists objectCenter objectLayer objectType objectTypeUI obsoleteProc oceanNurbsPreviewPlane offsetCurve offsetCurveOnSurface offsetSurface openGLExtension openMayaPref optionMenu optionMenuGrp optionVar orbit orbitCtx orientConstraint outlinerEditor outlinerPanel overrideModifier paintEffectsDisplay pairBlend palettePort paneLayout panel panelConfiguration panelHistory paramDimContext paramDimension paramLocator parent parentConstraint particle particleExists particleInstancer particleRenderInfo partition pasteKey pathAnimation pause pclose percent performanceOptions pfxstrokes pickWalk picture pixelMove planarSrf plane play playbackOptions playblast plugAttr plugNode pluginInfo pluginResourceUtil pointConstraint pointCurveConstraint pointLight pointMatrixMult pointOnCurve pointOnSurface pointPosition poleVectorConstraint polyAppend polyAppendFacetCtx polyAppendVertex polyAutoProjection polyAverageNormal polyAverageVertex polyBevel polyBlendColor polyBlindData polyBoolOp polyBridgeEdge polyCacheMonitor polyCheck polyChipOff polyClipboard polyCloseBorder polyCollapseEdge polyCollapseFacet polyColorBlindData polyColorDel polyColorPerVertex polyColorSet polyCompare polyCone polyCopyUV polyCrease polyCreaseCtx polyCreateFacet polyCreateFacetCtx polyCube polyCut polyCutCtx polyCylinder polyCylindricalProjection polyDelEdge polyDelFacet polyDelVertex polyDuplicateAndConnect polyDuplicateEdge polyEditUV polyEditUVShell polyEvaluate polyExtrudeEdge polyExtrudeFacet polyExtrudeVertex polyFlipEdge polyFlipUV polyForceUV polyGeoSampler polyHelix polyInfo polyInstallAction polyLayoutUV polyListComponentConversion polyMapCut polyMapDel polyMapSew polyMapSewMove polyMergeEdge polyMergeEdgeCtx polyMergeFacet polyMergeFacetCtx polyMergeUV polyMergeVertex polyMirrorFace polyMoveEdge polyMoveFacet polyMoveFacetUV polyMoveUV polyMoveVertex polyNormal polyNormalPerVertex polyNormalizeUV polyOptUvs polyOptions polyOutput polyPipe polyPlanarProjection polyPlane polyPlatonicSolid polyPoke polyPrimitive polyPrism polyProjection polyPyramid polyQuad polyQueryBlindData polyReduce polySelect polySelectConstraint polySelectConstraintMonitor polySelectCtx polySelectEditCtx polySeparate polySetToFaceNormal polySewEdge polyShortestPathCtx polySmooth polySoftEdge polySphere polySphericalProjection polySplit polySplitCtx polySplitEdge polySplitRing polySplitVertex polyStraightenUVBorder polySubdivideEdge polySubdivideFacet polyToSubdiv polyTorus polyTransfer polyTriangulate polyUVSet polyUnite polyWedgeFace popen popupMenu pose pow preloadRefEd print progressBar progressWindow projFileViewer projectCurve projectTangent projectionContext projectionManip promptDialog propModCtx propMove psdChannelOutliner psdEditTextureFile psdExport psdTextureFile putenv pwd python querySubdiv quit rad_to_deg radial radioButton radioButtonGrp radioCollection radioMenuItemCollection rampColorPort rand randomizeFollicles randstate rangeControl readTake rebuildCurve rebuildSurface recordAttr recordDevice redo reference referenceEdit referenceQuery refineSubdivSelectionList refresh refreshAE registerPluginResource rehash reloadImage removeJoint removeMultiInstance removePanelCategory rename renameAttr renameSelectionList renameUI render renderGlobalsNode renderInfo renderLayerButton renderLayerParent renderLayerPostProcess renderLayerUnparent renderManip renderPartition renderQualityNode renderSettings renderThumbnailUpdate renderWindowEditor renderWindowSelectContext renderer reorder reorderDeformers requires reroot resampleFluid resetAE resetPfxToPolyCamera resetTool resolutionNode retarget reverseCurve reverseSurface revolve rgb_to_hsv rigidBody rigidSolver roll rollCtx rootOf rot rotate rotationInterpolation roundConstantRadius rowColumnLayout rowLayout runTimeCommand runup sampleImage saveAllShelves saveAttrPreset saveFluid saveImage saveInitialState saveMenu savePrefObjects savePrefs saveShelf saveToolSettings scale scaleBrushBrightness scaleComponents scaleConstraint scaleKey scaleKeyCtx sceneEditor sceneUIReplacement scmh scriptCtx scriptEditorInfo scriptJob scriptNode scriptTable scriptToShelf scriptedPanel scriptedPanelType scrollField scrollLayout sculpt searchPathArray seed selLoadSettings select selectContext selectCurveCV selectKey selectKeyCtx selectKeyframeRegionCtx selectMode selectPref selectPriority selectType selectedNodes selectionConnection separator setAttr setAttrEnumResource setAttrMapping setAttrNiceNameResource setConstraintRestPosition setDefaultShadingGroup setDrivenKeyframe setDynamic setEditCtx setEditor setFluidAttr setFocus setInfinity setInputDeviceMapping setKeyCtx setKeyPath setKeyframe setKeyframeBlendshapeTargetWts setMenuMode setNodeNiceNameResource setNodeTypeFlag setParent setParticleAttr setPfxToPolyCamera setPluginResource setProject setStampDensity setStartupMessage setState setToolTo setUITemplate setXformManip sets shadingConnection shadingGeometryRelCtx shadingLightRelCtx shadingNetworkCompare shadingNode shapeCompare shelfButton shelfLayout shelfTabLayout shellField shortNameOf showHelp showHidden showManipCtx showSelectionInTitle showShadingGroupAttrEditor showWindow sign simplify sin singleProfileBirailSurface size sizeBytes skinCluster skinPercent smoothCurve smoothTangentSurface smoothstep snap2to2 snapKey snapMode snapTogetherCtx snapshot soft softMod softModCtx sort sound soundControl source spaceLocator sphere sphrand spotLight spotLightPreviewPort spreadSheetEditor spring sqrt squareSurface srtContext stackTrace startString startsWith stitchAndExplodeShell stitchSurface stitchSurfacePoints strcmp stringArrayCatenate stringArrayContains stringArrayCount stringArrayInsertAtIndex stringArrayIntersector stringArrayRemove stringArrayRemoveAtIndex stringArrayRemoveDuplicates stringArrayRemoveExact stringArrayToString stringToStringArray strip stripPrefixFromName stroke subdAutoProjection subdCleanTopology subdCollapse subdDuplicateAndConnect subdEditUV subdListComponentConversion subdMapCut subdMapSewMove subdMatchTopology subdMirror subdToBlind subdToPoly subdTransferUVsToCache subdiv subdivCrease subdivDisplaySmoothness substitute substituteAllString substituteGeometry substring surface surfaceSampler surfaceShaderList swatchDisplayPort switchTable symbolButton symbolCheckBox sysFile system tabLayout tan tangentConstraint texLatticeDeformContext texManipContext texMoveContext texMoveUVShellContext texRotateContext texScaleContext texSelectContext texSelectShortestPathCtx texSmudgeUVContext texWinToolCtx text textCurves textField textFieldButtonGrp textFieldGrp textManip textScrollList textToShelf textureDisplacePlane textureHairColor texturePlacementContext textureWindow threadCount threePointArcCtx timeControl timePort timerX toNativePath toggle toggleAxis toggleWindowVisibility tokenize tokenizeList tolerance tolower toolButton toolCollection toolDropped toolHasOptions toolPropertyWindow torus toupper trace track trackCtx transferAttributes transformCompare transformLimits translator trim trunc truncateFluidCache truncateHairCache tumble tumbleCtx turbulence twoPointArcCtx uiRes uiTemplate unassignInputDevice undo undoInfo ungroup uniform unit unloadPlugin untangleUV untitledFileName untrim upAxis updateAE userCtx uvLink uvSnapshot validateShelfName vectorize view2dToolCtx viewCamera viewClipPlane viewFit viewHeadOn viewLookAt viewManip viewPlace viewSet visor volumeAxis vortex waitCursor warning webBrowser webBrowserPrefs whatIs window windowPref wire wireContext workspace wrinkle wrinkleContext writeTake xbmLangPathList xform",
        illegal: "</",
        contains: [
            a.C_NUMBER_MODE, a.APOS_STRING_MODE, a.QUOTE_STRING_MODE, {
                className: "string",
                begin: "`",
                end: "`",
                contains: [a.BACKSLASH_ESCAPE]
            }, {
                className: "variable",
                begin: "\\$\\d",
                relevance: 5
            }, {
                className: "variable",
                begin: "[\\$\\%\\@\\*](\\^\\w\\b|#\\w+|[^\\s\\w{]|{\\w+}|\\w+)"
            }, a.C_LINE_COMMENT_MODE, a.C_BLOCK_COMMENT_MODE
        ]
    }
}(hljs);
hljs.LANGUAGES.diff = function (a) {
    return {
        contains: [
            {
                className: "chunk",
                begin: "^\\@\\@ +\\-\\d+,\\d+ +\\+\\d+,\\d+ +\\@\\@$",
                relevance: 10
            }, {
                className: "chunk",
                begin: "^\\*\\*\\* +\\d+,\\d+ +\\*\\*\\*\\*$",
                relevance: 10
            }, {
                className: "chunk",
                begin: "^\\-\\-\\- +\\d+,\\d+ +\\-\\-\\-\\-$",
                relevance: 10
            }, {
                className: "header",
                begin: "Index: ",
                end: "$"
            }, {
                className: "header",
                begin: "=====",
                end: "=====$"
            }, {
                className: "header",
                begin: "^\\-\\-\\-",
                end: "$"
            }, {
                className: "header",
                begin: "^\\*{3} ",
                end: "$"
            }, {
                className: "header",
                begin: "^\\+\\+\\+",
                end: "$"
            }, {
                className: "header",
                begin: "\\*{5}",
                end: "\\*{5}$"
            }, {
                className: "addition",
                begin: "^\\+",
                end: "$"
            }, {
                className: "deletion",
                begin: "^\\-",
                end: "$"
            }, {
                className: "change",
                begin: "^\\!",
                end: "$"
            }
        ]
    }
}(hljs);
hljs.LANGUAGES.brainfuck = function (a) {
    return {
        contains: [
            {
                className: "comment",
                begin: "[^\\[\\]\\.,\\+\\-<> \r\n]",
                excludeEnd: true,
                end: "[\\[\\]\\.,\\+\\-<> \r\n]",
                relevance: 0
            }, {
                className: "title",
                begin: "[\\[\\]]",
                relevance: 0
            }, {
                className: "string",
                begin: "[\\.,]"
            }, {
                className: "literal",
                begin: "[\\+\\-]"
            }
        ]
    }
}(hljs);
hljs.LANGUAGES.handlebars = function (c) {
    function f(m, l) {
        var g = {};
        for (var k in m) {
            if (k != "contains") {
                g[k] = m[k]
            }
            var j = [];
            for (var h = 0; m.contains && h < m.contains.length; h++) {
                j.push(f(m.contains[h], m))
            }
            j = d.concat(j);
            if (j.length) {
                g.contains = j
            }
        }
        return g
    }
    var b = "each in with if else unless bindattr action collection debugger log outlet template unbound view yield";
    var e = {
            className: "variable",
            begin: "[a-zA-Z.]+",
            keywords: b
        };
    var d = [
            {
                className: "expression",
                begin: "{{",
                end: "}}",
                contains: [
                    {
                        className: "begin-block",
                        begin: "#[a-zA-Z .]+",
                        keywords: b
                    }, {
                        className: "string",
                        begin: '"',
                        end: '"'
                    }, {
                        className: "end-block",
                        begin: "\\/[a-zA-Z .]+",
                        keywords: b
                    }, {
                        className: "variable",
                        begin: "[a-zA-Z.]+",
                        keywords: b
                    }
                ]
            }
        ];
    var a = f(c.LANGUAGES.xml);
    a.case_insensitive = true;
    return a
}(hljs);
hljs.LANGUAGES.sql = function (a) {
    return {
        case_insensitive: true,
        contains: [
            {
                className: "operator",
                begin: "(begin|end|start|commit|rollback|savepoint|lock|alter|create|drop|rename|call|delete|do|handler|insert|load|replace|select|truncate|update|set|show|pragma|grant)\\b(?!:)",
                end: ";",
                endsWithParent: true,
                keywords: {
                    keyword: "all partial global month current_timestamp using go revoke smallint indicator end-exec disconnect zone with character assertion to add current_user usage input local alter match collate real then rollback get read timestamp session_user not integer bit unique day minute desc insert execute like ilike|2 level decimal drop continue isolation found where constraints domain right national some module transaction relative second connect escape close system_user for deferred section cast current sqlstate allocate intersect deallocate numeric public preserve full goto initially asc no key output collation group by union session both last language constraint column of space foreign deferrable prior connection unknown action commit view or first into float year primary cascaded except restrict set references names table outer open select size are rows from prepare distinct leading create only next inner authorization schema corresponding option declare precision immediate else timezone_minute external varying translation true case exception join hour default double scroll value cursor descriptor values dec fetch procedure delete and false int is describe char as at in varchar null trailing any absolute current_time end grant privileges when cross check write current_date pad begin temporary exec time update catalog user sql date on identity timezone_hour natural whenever interval work order cascade diagnostics nchar having left call do handler load replace truncate start lock show pragma exists number trigger if before after each row",
                    aggregate: "count sum min max avg"
                },
                contains: [
                    {
                        className: "string",
                        begin: "'",
                        end: "'",
                        contains: [
                            a.BACKSLASH_ESCAPE, {
                                begin: "''"
                            }
                        ],
                        relevance: 0
                    }, {
                        className: "string",
                        begin: '"',
                        end: '"',
                        contains: [
                            a.BACKSLASH_ESCAPE, {
                                begin: '""'
                            }
                        ],
                        relevance: 0
                    }, {
                        className: "string",
                        begin: "`",
                        end: "`",
                        contains: [a.BACKSLASH_ESCAPE]
                    }, a.C_NUMBER_MODE
                ]
            }, a.C_BLOCK_COMMENT_MODE, {
                className: "comment",
                begin: "--",
                end: "$"
            }
        ]
    }
}(hljs);
hljs.LANGUAGES.coffeescript = function (c) {
    var b = {
            keyword: "in if for while finally new do return else break catch instanceof throw try this switch continue typeof delete debugger super then unless until loop of by when and or is isnt not",
            literal: "true false null undefined yes no on off",
            reserved: "case default function var void with const let enum export import native __hasProp __extends __slice __bind __indexOf",
            built_in: "npm require console print module exports global window document"
        };
    var a = "[A-Za-z$_][0-9A-Za-z$_]*";
    var f = {
            className: "title",
            begin: a
        };
    var e = {
            className: "subst",
            begin: "#\\{",
            end: "}",
            keywords: b
        };
    var d = [
            c.BINARY_NUMBER_MODE, c.inherit(c.C_NUMBER_MODE, {
                starts: {
                    end: "(\\s*/)?",
                    relevance: 0
                }
            }), {
                className: "string",
                begin: "'''",
                end: "'''",
                contains: [c.BACKSLASH_ESCAPE]
            }, {
                className: "string",
                begin: "'",
                end: "'",
                contains: [c.BACKSLASH_ESCAPE],
                relevance: 0
            }, {
                className: "string",
                begin: '"""',
                end: '"""',
                contains: [
                    c.BACKSLASH_ESCAPE, e
                ]
            }, {
                className: "string",
                begin: '"',
                end: '"',
                contains: [
                    c.BACKSLASH_ESCAPE, e
                ],
                relevance: 0
            }, {
                className: "regexp",
                begin: "///",
                end: "///",
                contains: [c.HASH_COMMENT_MODE]
            }, {
                className: "regexp",
                begin: "//[gim]*",
                relevance: 0
            }, {
                className: "regexp",
                begin: "/\\S(\\\\.|[^\\n])*?/[gim]*(?=\\s|\\W|$)"
            }, {
                className: "property",
                begin: "@" + a
            }, {
                begin: "`",
                end: "`",
                excludeBegin: true,
                excludeEnd: true,
                subLanguage: "javascript"
            }
        ];
    e.contains = d;
    return {
        keywords: b,
        contains: d.concat([
            {
                className: "comment",
                begin: "###",
                end: "###"
            }, c.HASH_COMMENT_MODE, {
                className: "function",
                begin: "(" + a + "\\s*=\\s*)?(\\(.*\\))?\\s*[-=]>",
                end: "[-=]>",
                returnBegin: true,
                contains: [
                    f, {
                        className: "params",
                        begin: "\\(",
                        returnBegin: true,
                        contains: [
                            {
                                begin: /\(/,
                                end: /\)/,
                                keywords: b,
                                contains: ["self"].concat(d)
                            }
                        ]
                    }
                ]
            }, {
                className: "class",
                beginWithKeyword: true,
                keywords: "class",
                end: "$",
                illegal: "[:\\[\\]]",
                contains: [
                    {
                        beginWithKeyword: true,
                        keywords: "extends",
                        endsWithParent: true,
                        illegal: ":",
                        contains: [f]
                    }, f
                ]
            }, {
                className: "attribute",
                begin: a + ":",
                end: ":",
                returnBegin: true,
                excludeEnd: true
            }
        ])
    }
}(hljs);
hljs.LANGUAGES.vbnet = function (a) {
    return {
        case_insensitive: true,
        keywords: {
            keyword: "addhandler addressof alias and andalso aggregate ansi as assembly auto binary by byref byval call case catch class compare const continue custom declare default delegate dim distinct do each equals else elseif end enum erase error event exit explicit finally for friend from function get global goto group handles if implements imports in inherits interface into is isfalse isnot istrue join key let lib like loop me mid mod module mustinherit mustoverride mybase myclass namespace narrowing new next not notinheritable notoverridable of off on operator option optional or order orelse overloads overridable overrides paramarray partial preserve private property protected public raiseevent readonly redim rem removehandler resume return select set shadows shared skip static step stop structure strict sub synclock take text then throw to try unicode until using when where while widening with withevents writeonly xor",
            built_in: "boolean byte cbool cbyte cchar cdate cdec cdbl char cint clng cobj csbyte cshort csng cstr ctype date decimal directcast double gettype getxmlnamespace iif integer long object sbyte short single string trycast typeof uinteger ulong ushort",
            literal: "true false nothing"
        },
        illegal: "(//|endif|gosub|variant|wend)",
        contains: [
            a.inherit(a.QUOTE_STRING_MODE, {
                contains: [
                    {
                        begin: '""'
                    }
                ]
            }), {
                className: "comment",
                begin: "'",
                end: "$",
                returnBegin: true,
                contains: [
                    {
                        className: "xmlDocTag",
                        begin: "'''|<!--|-->"
                    }, {
                        className: "xmlDocTag",
                        begin: "</?",
                        end: ">"
                    }
                ]
            }, a.C_NUMBER_MODE, {
                className: "preprocessor",
                begin: "#",
                end: "$",
                keywords: "if else elseif end region externalsource"
            }
        ]
    }
}(hljs);
hljs.LANGUAGES.rsl = function (a) {
    return {
        keywords: {
            keyword: "float color point normal vector matrix while for if do return else break extern continue",
            built_in: "abs acos ambient area asin atan atmosphere attribute calculatenormal ceil cellnoise clamp comp concat cos degrees depth Deriv diffuse distance Du Dv environment exp faceforward filterstep floor format fresnel incident length lightsource log match max min mod noise normalize ntransform opposite option phong pnoise pow printf ptlined radians random reflect refract renderinfo round setcomp setxcomp setycomp setzcomp shadow sign sin smoothstep specular specularbrdf spline sqrt step tan texture textureinfo trace transform vtransform xcomp ycomp zcomp"
        },
        illegal: "</",
        contains: [
            a.C_LINE_COMMENT_MODE, a.C_BLOCK_COMMENT_MODE, a.QUOTE_STRING_MODE, a.APOS_STRING_MODE, a.C_NUMBER_MODE, {
                className: "preprocessor",
                begin: "#",
                end: "$"
            }, {
                className: "shader",
                beginWithKeyword: true,
                end: "\\(",
                keywords: "surface displacement light volume imager"
            }, {
                className: "shading",
                beginWithKeyword: true,
                end: "\\(",
                keywords: "illuminate illuminance gather"
            }
        ]
    }
}(hljs);
hljs.LANGUAGES.objectivec = function (a) {
    var b = {
            keyword: "int float while private char catch export sizeof typedef const struct for union unsigned long volatile static protected bool mutable if public do return goto void enum else break extern asm case short default double throw register explicit signed typename try this switch continue wchar_t inline readonly assign property self synchronized end synthesize id optional required nonatomic super unichar finally dynamic IBOutlet IBAction selector strong weak readonly",
            literal: "false true FALSE TRUE nil YES NO NULL",
            built_in: "NSString NSDictionary CGRect CGPoint UIButton UILabel UITextView UIWebView MKMapView UISegmentedControl NSObject UITableViewDelegate UITableViewDataSource NSThread UIActivityIndicator UITabbar UIToolBar UIBarButtonItem UIImageView NSAutoreleasePool UITableView BOOL NSInteger CGFloat NSException NSLog NSMutableString NSMutableArray NSMutableDictionary NSURL NSIndexPath CGSize UITableViewCell UIView UIViewController UINavigationBar UINavigationController UITabBarController UIPopoverController UIPopoverControllerDelegate UIImage NSNumber UISearchBar NSFetchedResultsController NSFetchedResultsChangeType UIScrollView UIScrollViewDelegate UIEdgeInsets UIColor UIFont UIApplication NSNotFound NSNotificationCenter NSNotification UILocalNotification NSBundle NSFileManager NSTimeInterval NSDate NSCalendar NSUserDefaults UIWindow NSRange NSArray NSError NSURLRequest NSURLConnection UIInterfaceOrientation MPMoviePlayerController dispatch_once_t dispatch_queue_t dispatch_sync dispatch_async dispatch_once"
        };
    return {
        keywords: b,
        illegal: "</",
        contains: [
            a.C_LINE_COMMENT_MODE, a.C_BLOCK_COMMENT_MODE, a.C_NUMBER_MODE, a.QUOTE_STRING_MODE, {
                className: "string",
                begin: "'",
                end: "[^\\\\]'",
                illegal: "[^\\\\][^']"
            }, {
                className: "preprocessor",
                begin: "#import",
                end: "$",
                contains: [
                    {
                        className: "title",
                        begin: '"',
                        end: '"'
                    }, {
                        className: "title",
                        begin: "<",
                        end: ">"
                    }
                ]
            }, {
                className: "preprocessor",
                begin: "#",
                end: "$"
            }, {
                className: "class",
                beginWithKeyword: true,
                end: "({|$)",
                keywords: "interface class protocol implementation",
                contains: [
                    {
                        className: "id",
                        begin: a.UNDERSCORE_IDENT_RE
                    }
                ]
            }, {
                className: "variable",
                begin: "\\." + a.UNDERSCORE_IDENT_RE,
                relevance: 0
            }
        ]
    }
}(hljs);
hljs.LANGUAGES.java = function (a) {
    return {
        keywords: "false synchronized int abstract float private char boolean static null if const for true while long throw strictfp finally protected import native final return void enum else break transient new catch instanceof byte super volatile case assert short package default double public try this switch continue throws",
        contains: [
            {
                className: "javadoc",
                begin: "/\\*\\*",
                end: "\\*/",
                contains: [
                    {
                        className: "javadoctag",
                        begin: "(^|\\s)@[A-Za-z]+"
                    }
                ],
                relevance: 10
            }, a.C_LINE_COMMENT_MODE, a.C_BLOCK_COMMENT_MODE, a.APOS_STRING_MODE, a.QUOTE_STRING_MODE, {
                className: "class",
                beginWithKeyword: true,
                end: "{",
                keywords: "class interface",
                excludeEnd: true,
                illegal: ":",
                contains: [
                    {
                        beginWithKeyword: true,
                        keywords: "extends implements",
                        relevance: 10
                    }, {
                        className: "title",
                        begin: a.UNDERSCORE_IDENT_RE
                    }
                ]
            }, a.C_NUMBER_MODE, {
                className: "annotation",
                begin: "@[A-Za-z]+"
            }
        ]
    }
}(hljs);
hljs.LANGUAGES.applescript = function (a) {
    var b = a.inherit(a.QUOTE_STRING_MODE, {
            illegal: ""
        });
    var e = {
            className: "title",
            begin: a.UNDERSCORE_IDENT_RE
        };
    var d = {
            className: "params",
            begin: "\\(",
            end: "\\)",
            contains: [
                "self", a.C_NUMBER_MODE, b
            ]
        };
    var c = [
            {
                className: "comment",
                begin: "--",
                end: "$"
            }, {
                className: "comment",
                begin: "\\(\\*",
                end: "\\*\\)",
                contains: [
                    "self", {
                        begin: "--",
                        end: "$"
                    }
                ]
            }, a.HASH_COMMENT_MODE
        ];
    return {
        keywords: {
            keyword: "about above after against and around as at back before beginning behind below beneath beside between but by considering contain contains continue copy div does eighth else end equal equals error every exit fifth first for fourth from front get given global if ignoring in into is it its last local me middle mod my ninth not of on onto or over prop property put ref reference repeat returning script second set seventh since sixth some tell tenth that the then third through thru timeout times to transaction try until where while whose with without",
            constant: "AppleScript false linefeed return pi quote result space tab true",
            type: "alias application boolean class constant date file integer list number real record string text",
            command: "activate beep count delay launch log offset read round run say summarize write",
            property: "character characters contents day frontmost id item length month name paragraph paragraphs rest reverse running time version weekday word words year"
        },
        contains: [
            b, a.C_NUMBER_MODE, {
                className: "type",
                begin: "\\bPOSIX file\\b"
            }, {
                className: "command",
                begin: "\\b(clipboard info|the clipboard|info for|list (disks|folder)|mount volume|path to|(close|open for) access|(get|set) eof|current date|do shell script|get volume settings|random number|set volume|system attribute|system info|time to GMT|(load|run|store) script|scripting components|ASCII (character|number)|localized string|choose (application|color|file|file name|folder|from list|remote application|URL)|display (alert|dialog))\\b|^\\s*return\\b"
            }, {
                className: "constant",
                begin: "\\b(text item delimiters|current application|missing value)\\b"
            }, {
                className: "keyword",
                begin: "\\b(apart from|aside from|instead of|out of|greater than|isn't|(doesn't|does not) (equal|come before|come after|contain)|(greater|less) than( or equal)?|(starts?|ends|begins?) with|contained by|comes (before|after)|a (ref|reference))\\b"
            }, {
                className: "property",
                begin: "\\b(POSIX path|(date|time) string|quoted form)\\b"
            }, {
                className: "function_start",
                beginWithKeyword: true,
                keywords: "on",
                illegal: "[${=;\\n]",
                contains: [
                    e, d
                ]
            }
        ].concat(c),
        illegal: "//"
    }
}(hljs);
hljs.LANGUAGES.ruby = function (e) {
    var a = "[a-zA-Z_][a-zA-Z0-9_]*(\\!|\\?)?";
    var j = "[a-zA-Z_]\\w*[!?=]?|[-+~]\\@|<<|>>|=~|===?|<=>|[<>]=?|\\*\\*|[-/+%^&*~`|]|\\[\\]=?";
    var g = {
            keyword: "and false then defined module in return redo if BEGIN retry end for true self when next until do begin unless END rescue nil else break undef not super class case require yield alias while ensure elsif or include"
        };
    var c = {
            className: "yardoctag",
            begin: "@[A-Za-z]+"
        };
    var k = [
            {
                className: "comment",
                begin: "#",
                end: "$",
                contains: [c]
            }, {
                className: "comment",
                begin: "^\\=begin",
                end: "^\\=end",
                contains: [c],
                relevance: 10
            }, {
                className: "comment",
                begin: "^__END__",
                end: "\\n$"
            }
        ];
    var d = {
            className: "subst",
            begin: "#\\{",
            end: "}",
            lexems: a,
            keywords: g
        };
    var i = [
            e.BACKSLASH_ESCAPE, d
        ];
    var b = [
            {
                className: "string",
                begin: "'",
                end: "'",
                contains: i,
                relevance: 0
            }, {
                className: "string",
                begin: '"',
                end: '"',
                contains: i,
                relevance: 0
            }, {
                className: "string",
                begin: "%[qw]?\\(",
                end: "\\)",
                contains: i
            }, {
                className: "string",
                begin: "%[qw]?\\[",
                end: "\\]",
                contains: i
            }, {
                className: "string",
                begin: "%[qw]?{",
                end: "}",
                contains: i
            }, {
                className: "string",
                begin: "%[qw]?<",
                end: ">",
                contains: i,
                relevance: 10
            }, {
                className: "string",
                begin: "%[qw]?/",
                end: "/",
                contains: i,
                relevance: 10
            }, {
                className: "string",
                begin: "%[qw]?%",
                end: "%",
                contains: i,
                relevance: 10
            }, {
                className: "string",
                begin: "%[qw]?-",
                end: "-",
                contains: i,
                relevance: 10
            }, {
                className: "string",
                begin: "%[qw]?\\|",
                end: "\\|",
                contains: i,
                relevance: 10
            }
        ];
    var h = {
            className: "function",
            beginWithKeyword: true,
            end: " |$|;",
            keywords: "def",
            contains: [
                {
                    className: "title",
                    begin: j,
                    lexems: a,
                    keywords: g
                }, {
                    className: "params",
                    begin: "\\(",
                    end: "\\)",
                    lexems: a,
                    keywords: g
                }
            ].concat(k)
        };
    var f = k.concat(b.concat([
            {
                className: "class",
                beginWithKeyword: true,
                end: "$|;",
                keywords: "class module",
                contains: [
                    {
                        className: "title",
                        begin: "[A-Za-z_]\\w*(::\\w+)*(\\?|\\!)?",
                        relevance: 0
                    }, {
                        className: "inheritance",
                        begin: "<\\s*",
                        contains: [
                            {
                                className: "parent",
                                begin: "(" + e.IDENT_RE + "::)?" + e.IDENT_RE
                            }
                        ]
                    }
                ].concat(k)
            }, h, {
                className: "constant",
                begin: "(::)?(\\b[A-Z]\\w*(::)?)+",
                relevance: 0
            }, {
                className: "symbol",
                begin: ":",
                contains: b.concat([
                    {
                        begin: j
                    }
                ]),
                relevance: 0
            }, {
                className: "symbol",
                begin: a + ":",
                relevance: 0
            }, {
                className: "number",
                begin: "(\\b0[0-7_]+)|(\\b0x[0-9a-fA-F_]+)|(\\b[1-9][0-9_]*(\\.[0-9_]+)?)|[0_]\\b",
                relevance: 0
            }, {
                className: "number",
                begin: "\\?\\w"
            }, {
                className: "variable",
                begin: "(\\$\\W)|((\\$|\\@\\@?)(\\w+))"
            }, {
                begin: "(" + e.RE_STARTERS_RE + ")\\s*",
                contains: k.concat([
                    {
                        className: "regexp",
                        begin: "/",
                        end: "/[a-z]*",
                        illegal: "\\n",
                        contains: [
                            e.BACKSLASH_ESCAPE, d
                        ]
                    }
                ]),
                relevance: 0
            }
        ]));
    d.contains = f;
    h.contains[1].contains = f;
    return {
        lexems: a,
        keywords: g,
        contains: f
    }
}(hljs);
hljs.LANGUAGES.haml = function (a) {
    return {
        case_insensitive: true,
        contains: [
            {
                className: "doctype",
                begin: "^!!!( (5|1\\.1|Strict|Frameset|Basic|Mobile|RDFa|XML\\b.*))?$",
                relevance: 10
            }, {
                className: "comment",
                begin: "^\\s*(-#|/).*$",
                relevance: 0
            }, {
                begin: "^\\s*-(?!#)",
                starts: {
                    end: "\\n",
                    subLanguage: "ruby"
                },
                relevance: 0
            }, {
                className: "tag",
                begin: "^\\s*%",
                contains: [
                    {
                        className: "title",
                        begin: "\\w+",
                        relevance: 0
                    }, {
                        className: "value",
                        begin: "[#\\.]\\w+",
                        relevance: 0
                    }, {
                        begin: "{\\s*",
                        end: "\\s*}",
                        excludeEnd: true,
                        contains: [
                            {
                                begin: ":\\w+\\s*=>",
                                end: ",\\s+",
                                returnBegin: true,
                                endsWithParent: true,
                                relevance: 0,
                                contains: [
                                    {
                                        className: "symbol",
                                        begin: ":\\w+",
                                        relevance: 0
                                    }, {
                                        className: "string",
                                        begin: '"',
                                        end: '"',
                                        relevance: 0
                                    }, {
                                        className: "string",
                                        begin: "'",
                                        end: "'",
                                        relevance: 0
                                    }, {
                                        begin: "\\w+",
                                        relevance: 0
                                    }
                                ]
                            }
                        ],
                        relevance: 0
                    }, {
                        begin: "\\(\\s*",
                        end: "\\s*\\)",
                        excludeEnd: true,
                        contains: [
                            {
                                begin: "\\w+\\s*=",
                                end: "\\s+",
                                returnBegin: true,
                                endsWithParent: true,
                                relevance: 0,
                                contains: [
                                    {
                                        className: "attribute",
                                        begin: "\\w+",
                                        relevance: 0
                                    }, {
                                        className: "string",
                                        begin: '"',
                                        end: '"',
                                        relevance: 0
                                    }, {
                                        className: "string",
                                        begin: "'",
                                        end: "'",
                                        relevance: 0
                                    }, {
                                        begin: "\\w+",
                                        relevance: 0
                                    }
                                ]
                            }
                        ],
                        relevance: 0
                    }
                ],
                relevance: 10
            }, {
                className: "bullet",
                begin: "^\\s*[=~]\\s*",
                relevance: 0
            }, {
                begin: "#{",
                starts: {
                    end: "}",
                    subLanguage: "ruby"
                },
                relevance: 0
            }
        ]
    }
}(hljs);
hljs.LANGUAGES.css = function (a) {
    var b = "[a-zA-Z-][a-zA-Z0-9_-]*";
    var c = {
            className: "function",
            begin: b + "\\(",
            end: "\\)",
            contains: [
                "self", a.NUMBER_MODE, a.APOS_STRING_MODE, a.QUOTE_STRING_MODE
            ]
        };
    return {
        case_insensitive: true,
        illegal: "[=/|']",
        contains: [
            a.C_BLOCK_COMMENT_MODE, {
                className: "id",
                begin: "\\#[A-Za-z0-9_-]+"
            }, {
                className: "class",
                begin: "\\.[A-Za-z0-9_-]+",
                relevance: 0
            }, {
                className: "attr_selector",
                begin: "\\[",
                end: "\\]",
                illegal: "$"
            }, {
                className: "pseudo",
                begin: ":(:)?[a-zA-Z0-9\\_\\-\\+\\(\\)\\\"\\']+"
            }, {
                className: "at_rule",
                begin: "@(font-face|page)",
                lexems: "[a-z-]+",
                keywords: "font-face page"
            }, {
                className: "at_rule",
                begin: "@",
                end: "[{;]",
                contains: [
                    {
                        className: "keyword",
                        begin: /\S+/
                    }, {
                        begin: /\s/,
                        endsWithParent: true,
                        excludeEnd: true,
                        relevance: 0,
                        contains: [
                            c, a.APOS_STRING_MODE, a.QUOTE_STRING_MODE, a.NUMBER_MODE
                        ]
                    }
                ]
            }, {
                className: "tag",
                begin: b,
                relevance: 0
            }, {
                className: "rules",
                begin: "{",
                end: "}",
                illegal: "[^\\s]",
                relevance: 0,
                contains: [
                    a.C_BLOCK_COMMENT_MODE, {
                        className: "rule",
                        begin: "[^\\s]",
                        returnBegin: true,
                        end: ";",
                        endsWithParent: true,
                        contains: [
                            {
                                className: "attribute",
                                begin: "[A-Z\\_\\.\\-]+",
                                end: ":",
                                excludeEnd: true,
                                illegal: "[^\\s]",
                                starts: {
                                    className: "value",
                                    endsWithParent: true,
                                    excludeEnd: true,
                                    contains: [
                                        c, a.NUMBER_MODE, a.QUOTE_STRING_MODE, a.APOS_STRING_MODE, a.C_BLOCK_COMMENT_MODE, {
                                            className: "hexcolor",
                                            begin: "#[0-9A-Fa-f]+"
                                        }, {
                                            className: "important",
                                            begin: "!important"
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                ]
            }
        ]
    }
}(hljs);
hljs.LANGUAGES.avrasm = function (a) {
    return {
        case_insensitive: true,
        keywords: {
            keyword: "adc add adiw and andi asr bclr bld brbc brbs brcc brcs break breq brge brhc brhs brid brie brlo brlt brmi brne brpl brsh brtc brts brvc brvs bset bst call cbi cbr clc clh cli cln clr cls clt clv clz com cp cpc cpi cpse dec eicall eijmp elpm eor fmul fmuls fmulsu icall ijmp in inc jmp ld ldd ldi lds lpm lsl lsr mov movw mul muls mulsu neg nop or ori out pop push rcall ret reti rjmp rol ror sbc sbr sbrc sbrs sec seh sbi sbci sbic sbis sbiw sei sen ser ses set sev sez sleep spm st std sts sub subi swap tst wdr",
            built_in: "r0 r1 r2 r3 r4 r5 r6 r7 r8 r9 r10 r11 r12 r13 r14 r15 r16 r17 r18 r19 r20 r21 r22 r23 r24 r25 r26 r27 r28 r29 r30 r31 x|0 xh xl y|0 yh yl z|0 zh zl ucsr1c udr1 ucsr1a ucsr1b ubrr1l ubrr1h ucsr0c ubrr0h tccr3c tccr3a tccr3b tcnt3h tcnt3l ocr3ah ocr3al ocr3bh ocr3bl ocr3ch ocr3cl icr3h icr3l etimsk etifr tccr1c ocr1ch ocr1cl twcr twdr twar twsr twbr osccal xmcra xmcrb eicra spmcsr spmcr portg ddrg ping portf ddrf sreg sph spl xdiv rampz eicrb eimsk gimsk gicr eifr gifr timsk tifr mcucr mcucsr tccr0 tcnt0 ocr0 assr tccr1a tccr1b tcnt1h tcnt1l ocr1ah ocr1al ocr1bh ocr1bl icr1h icr1l tccr2 tcnt2 ocr2 ocdr wdtcr sfior eearh eearl eedr eecr porta ddra pina portb ddrb pinb portc ddrc pinc portd ddrd pind spdr spsr spcr udr0 ucsr0a ucsr0b ubrr0l acsr admux adcsr adch adcl porte ddre pine pinf"
        },
        contains: [
            a.C_BLOCK_COMMENT_MODE, {
                className: "comment",
                begin: ";",
                end: "$"
            }, a.C_NUMBER_MODE, a.BINARY_NUMBER_MODE, {
                className: "number",
                begin: "\\b(\\$[a-zA-Z0-9]+|0o[0-7]+)"
            }, a.QUOTE_STRING_MODE, {
                className: "string",
                begin: "'",
                end: "[^\\\\]'",
                illegal: "[^\\\\][^']"
            }, {
                className: "label",
                begin: "^[A-Za-z0-9_.$]+:"
            }, {
                className: "preprocessor",
                begin: "#",
                end: "$"
            }, {
                className: "preprocessor",
                begin: "\\.[a-zA-Z]+"
            }, {
                className: "localvars",
                begin: "@[0-9]+"
            }
        ]
    }
}(hljs);
hljs.LANGUAGES.axapta = function (a) {
    return {
        keywords: "false int abstract private char boolean static null if for true while long throw finally protected final return void enum else break new catch byte super case short default double public try this switch continue reverse firstfast firstonly forupdate nofetch sum avg minof maxof count order group by asc desc index hint like dispaly edit client server ttsbegin ttscommit str real date container anytype common div mod",
        contains: [
            a.C_LINE_COMMENT_MODE, a.C_BLOCK_COMMENT_MODE, a.APOS_STRING_MODE, a.QUOTE_STRING_MODE, a.C_NUMBER_MODE, {
                className: "preprocessor",
                begin: "#",
                end: "$"
            }, {
                className: "class",
                beginWithKeyword: true,
                end: "{",
                illegal: ":",
                keywords: "class interface",
                contains: [
                    {
                        className: "inheritance",
                        beginWithKeyword: true,
                        keywords: "extends implements",
                        relevance: 10
                    }, {
                        className: "title",
                        begin: a.UNDERSCORE_IDENT_RE
                    }
                ]
            }
        ]
    }
}(hljs);
hljs.LANGUAGES["erlang-repl"] = function (a) {
    return {
        keywords: {
            special_functions: "spawn spawn_link self",
            reserved: "after and andalso|10 band begin bnot bor bsl bsr bxor case catch cond div end fun if let not of or orelse|10 query receive rem try when xor"
        },
        contains: [
            {
                className: "prompt",
                begin: "^[0-9]+> ",
                relevance: 10
            }, {
                className: "comment",
                begin: "%",
                end: "$"
            }, {
                className: "number",
                begin: "\\b(\\d+#[a-fA-F0-9]+|\\d+(\\.\\d+)?([eE][-+]?\\d+)?)",
                relevance: 0
            }, a.APOS_STRING_MODE, a.QUOTE_STRING_MODE, {
                className: "constant",
                begin: "\\?(::)?([A-Z]\\w*(::)?)+"
            }, {
                className: "arrow",
                begin: "->"
            }, {
                className: "ok",
                begin: "ok"
            }, {
                className: "exclamation_mark",
                begin: "!"
            }, {
                className: "function_or_atom",
                begin: "(\\b[a-z'][a-zA-Z0-9_']*:[a-z'][a-zA-Z0-9_']*)|(\\b[a-z'][a-zA-Z0-9_']*)",
                relevance: 0
            }, {
                className: "variable",
                begin: "[A-Z][a-zA-Z0-9_']*",
                relevance: 0
            }
        ]
    }
}(hljs);
hljs.LANGUAGES.lasso = function (b) {
    var a = "[a-zA-Z_][a-zA-Z0-9_.]*|&[lg]t;";
    var c = "<\\?(lasso(script)?|=)";
    return {
        case_insensitive: true,
        lexems: a,
        keywords: {
            literal: "true false none minimal full all infinity nan and or not bw ew cn lt lte gt gte eq neq ft rx nrx",
            built_in: "array date decimal duration integer map pair string tag xml null list queue set stack staticarray local var variable data global self inherited void",
            keyword: "error_code error_msg error_pop error_push error_reset cache database_names database_schemanames database_tablenames define_tag define_type email_batch encode_set html_comment handle handle_error header if inline iterate ljax_target link link_currentaction link_currentgroup link_currentrecord link_detail link_firstgroup link_firstrecord link_lastgroup link_lastrecord link_nextgroup link_nextrecord link_prevgroup link_prevrecord log loop namespace_using output_none portal private protect records referer referrer repeating resultset rows search_args search_arguments select sort_args sort_arguments thread_atomic value_list while abort case else if_empty if_false if_null if_true loop_abort loop_continue loop_count params params_up return return_value run_children soap_definetag soap_lastrequest soap_lastresponse tag_name ascending average by define descending do equals frozen group handle_failure import in into join let match max min on order parent protected provide public require skip split_thread sum take thread to trait type where with yield"
        },
        contains: [
            {
                className: "preprocessor",
                begin: "\\]|\\?>",
                relevance: 0,
                starts: {
                    className: "markup",
                    end: "\\[|" + c,
                    returnEnd: true
                }
            }, {
                className: "preprocessor",
                begin: "\\[noprocess\\]",
                starts: {
                    className: "markup",
                    end: "\\[/noprocess\\]",
                    returnEnd: true
                }
            }, {
                className: "preprocessor",
                begin: "\\[no_square_brackets|\\[/noprocess|" + c
            }, {
                className: "preprocessor",
                begin: "\\[",
                relevance: 0
            }, {
                className: "shebang",
                begin: "^#!.+lasso9\\b",
                relevance: 10
            }, b.C_LINE_COMMENT_MODE, {
                className: "javadoc",
                begin: "/\\*\\*!",
                end: "\\*/"
            }, b.C_BLOCK_COMMENT_MODE, b.C_NUMBER_MODE, b.inherit(b.APOS_STRING_MODE, {
                illegal: null
            }), b.inherit(b.QUOTE_STRING_MODE, {
                illegal: null
            }), {
                className: "string",
                begin: "`",
                end: "`"
            }, {
                className: "variable",
                begin: "#\\d+|[#$]" + a
            }, {
                className: "tag",
                begin: "::",
                end: a
            }, {
                className: "attribute",
                begin: "\\.\\.\\.|-" + b.UNDERSCORE_IDENT_RE
            }, {
                className: "class",
                beginWithKeyword: true,
                keywords: "define",
                excludeEnd: true,
                end: "\\(|=>",
                contains: [
                    {
                        className: "title",
                        begin: b.UNDERSCORE_IDENT_RE + "=?"
                    }
                ]
            }
        ]
    }
}(hljs);
hljs.LANGUAGES.lua = function (b) {
    var a = "\\[=*\\[";
    var e = "\\]=*\\]";
    var c = {
            begin: a,
            end: e,
            contains: ["self"]
        };
    var d = [
            {
                className: "comment",
                begin: "--(?!" + a + ")",
                end: "$"
            }, {
                className: "comment",
                begin: "--" + a,
                end: e,
                contains: [c],
                relevance: 10
            }
        ];
    return {
        lexems: b.UNDERSCORE_IDENT_RE,
        keywords: {
            keyword: "and break do else elseif end false for if in local nil not or repeat return then true until while",
            built_in: "_G _VERSION assert collectgarbage dofile error getfenv getmetatable ipairs load loadfile loadstring module next pairs pcall print rawequal rawget rawset require select setfenv setmetatable tonumber tostring type unpack xpcall coroutine debug io math os package string table"
        },
        contains: d.concat([
            {
                className: "function",
                beginWithKeyword: true,
                end: "\\)",
                keywords: "function",
                contains: [
                    {
                        className: "title",
                        begin: "([_a-zA-Z]\\w*\\.)*([_a-zA-Z]\\w*:)?[_a-zA-Z]\\w*"
                    }, {
                        className: "params",
                        begin: "\\(",
                        endsWithParent: true,
                        contains: d
                    }
                ].concat(d)
            }, b.C_NUMBER_MODE, b.APOS_STRING_MODE, b.QUOTE_STRING_MODE, {
                className: "string",
                begin: a,
                end: e,
                contains: [c],
                relevance: 10
            }
        ])
    }
}(hljs);
hljs.LANGUAGES.mizar = function (a) {
    return {
        keywords: [
            "environ vocabularies notations constructors definitions registrations theorems schemes requirements", "begin end definition registration cluster existence pred func defpred deffunc theorem proof", "let take assume then thus hence ex for st holds consider reconsider such that and in provided of as from", "be being by means equals implies iff redefine define now not or attr is mode suppose per cases set", "thesis contradiction scheme reserve struct", "correctness compatibility coherence symmetry assymetry reflexivity irreflexivity", "connectedness uniqueness commutativity idempotence involutiveness projectivity"
        ].join(" "),
        contains: [
            {
                className: "comment",
                begin: "::",
                end: "$"
            }
        ]
    }
}(hljs);
hljs.LANGUAGES.perl = function (e) {
    var a = "getpwent getservent quotemeta msgrcv scalar kill dbmclose undef lc ma syswrite tr send umask sysopen shmwrite vec qx utime local oct semctl localtime readpipe do return format read sprintf dbmopen pop getpgrp not getpwnam rewinddir qqfileno qw endprotoent wait sethostent bless s|0 opendir continue each sleep endgrent shutdown dump chomp connect getsockname die socketpair close flock exists index shmgetsub for endpwent redo lstat msgctl setpgrp abs exit select print ref gethostbyaddr unshift fcntl syscall goto getnetbyaddr join gmtime symlink semget splice x|0 getpeername recv log setsockopt cos last reverse gethostbyname getgrnam study formline endhostent times chop length gethostent getnetent pack getprotoent getservbyname rand mkdir pos chmod y|0 substr endnetent printf next open msgsnd readdir use unlink getsockopt getpriority rindex wantarray hex system getservbyport endservent int chr untie rmdir prototype tell listen fork shmread ucfirst setprotoent else sysseek link getgrgid shmctl waitpid unpack getnetbyname reset chdir grep split require caller lcfirst until warn while values shift telldir getpwuid my getprotobynumber delete and sort uc defined srand accept package seekdir getprotobyname semop our rename seek if q|0 chroot sysread setpwent no crypt getc chown sqrt write setnetent setpriority foreach tie sin msgget map stat getlogin unless elsif truncate exec keys glob tied closedirioctl socket readlink eval xor readline binmode setservent eof ord bind alarm pipe atan2 getgrent exp time push setgrent gt lt or ne m|0 break given say state when";
    var d = {
            className: "subst",
            begin: "[$@]\\{",
            end: "\\}",
            keywords: a,
            relevance: 10
        };
    var b = {
            className: "variable",
            begin: "\\$\\d"
        };
    var i = {
            className: "variable",
            begin: "[\\$\\%\\@\\*](\\^\\w\\b|#\\w+(\\:\\:\\w+)*|[^\\s\\w{]|{\\w+}|\\w+(\\:\\:\\w*)*)"
        };
    var f = [
            e.BACKSLASH_ESCAPE, d, b, i
        ];
    var h = {
            begin: "->",
            contains: [
                {
                    begin: e.IDENT_RE
                }, {
                    begin: "{",
                    end: "}"
                }
            ]
        };
    var g = {
            className: "comment",
            begin: "^(__END__|__DATA__)",
            end: "\\n$",
            relevance: 5
        };
    var c = [
            b, i, e.HASH_COMMENT_MODE, g, {
                className: "comment",
                begin: "^\\=\\w",
                end: "\\=cut",
                endsWithParent: true
            }, h, {
                className: "string",
                begin: "q[qwxr]?\\s*\\(",
                end: "\\)",
                contains: f,
                relevance: 5
            }, {
                className: "string",
                begin: "q[qwxr]?\\s*\\[",
                end: "\\]",
                contains: f,
                relevance: 5
            }, {
                className: "string",
                begin: "q[qwxr]?\\s*\\{",
                end: "\\}",
                contains: f,
                relevance: 5
            }, {
                className: "string",
                begin: "q[qwxr]?\\s*\\|",
                end: "\\|",
                contains: f,
                relevance: 5
            }, {
                className: "string",
                begin: "q[qwxr]?\\s*\\<",
                end: "\\>",
                contains: f,
                relevance: 5
            }, {
                className: "string",
                begin: "qw\\s+q",
                end: "q",
                contains: f,
                relevance: 5
            }, {
                className: "string",
                begin: "'",
                end: "'",
                contains: [e.BACKSLASH_ESCAPE],
                relevance: 0
            }, {
                className: "string",
                begin: '"',
                end: '"',
                contains: f,
                relevance: 0
            }, {
                className: "string",
                begin: "`",
                end: "`",
                contains: [e.BACKSLASH_ESCAPE]
            }, {
                className: "string",
                begin: "{\\w+}",
                relevance: 0
            }, {
                className: "string",
                begin: "-?\\w+\\s*\\=\\>",
                relevance: 0
            }, {
                className: "number",
                begin: "(\\b0[0-7_]+)|(\\b0x[0-9a-fA-F_]+)|(\\b[1-9][0-9_]*(\\.[0-9_]+)?)|[0_]\\b",
                relevance: 0
            }, {
                begin: "(" + e.RE_STARTERS_RE + "|\\b(split|return|print|reverse|grep)\\b)\\s*",
                keywords: "split return print reverse grep",
                relevance: 0,
                contains: [
                    e.HASH_COMMENT_MODE, g, {
                        className: "regexp",
                        begin: "(s|tr|y)/(\\\\.|[^/])*/(\\\\.|[^/])*/[a-z]*",
                        relevance: 10
                    }, {
                        className: "regexp",
                        begin: "(m|qr)?/",
                        end: "/[a-z]*",
                        contains: [e.BACKSLASH_ESCAPE],
                        relevance: 0
                    }
                ]
            }, {
                className: "sub",
                beginWithKeyword: true,
                end: "(\\s*\\(.*?\\))?[;{]",
                keywords: "sub",
                relevance: 5
            }, {
                className: "operator",
                begin: "-\\w\\b",
                relevance: 0
            }
        ];
    d.contains = c;
    h.contains[1].contains = c;
    return {
        keywords: a,
        contains: c
    }
}(hljs);
hljs.LANGUAGES.php = function (a) {
    var e = {
            className: "variable",
            begin: "\\$+[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*"
        };
    var b = [
            a.inherit(a.APOS_STRING_MODE, {
                illegal: null
            }), a.inherit(a.QUOTE_STRING_MODE, {
                illegal: null
            }), {
                className: "string",
                begin: 'b"',
                end: '"',
                contains: [a.BACKSLASH_ESCAPE]
            }, {
                className: "string",
                begin: "b'",
                end: "'",
                contains: [a.BACKSLASH_ESCAPE]
            }
        ];
    var c = [
            a.BINARY_NUMBER_MODE, a.C_NUMBER_MODE
        ];
    var d = {
            className: "title",
            begin: a.UNDERSCORE_IDENT_RE
        };
    return {
        case_insensitive: true,
        keywords: "and include_once list abstract global private echo interface as static endswitch array null if endwhile or const for endforeach self var while isset public protected exit foreach throw elseif include __FILE__ empty require_once do xor return implements parent clone use __CLASS__ __LINE__ else break print eval new catch __METHOD__ case exception php_user_filter default die require __FUNCTION__ enddeclare final try this switch continue endfor endif declare unset true false namespace trait goto instanceof insteadof __DIR__ __NAMESPACE__ __halt_compiler",
        contains: [
            a.C_LINE_COMMENT_MODE, a.HASH_COMMENT_MODE, {
                className: "comment",
                begin: "/\\*",
                end: "\\*/",
                contains: [
                    {
                        className: "phpdoc",
                        begin: "\\s@[A-Za-z]+"
                    }
                ]
            }, {
                className: "comment",
                excludeBegin: true,
                begin: "__halt_compiler.+?;",
                endsWithParent: true
            }, {
                className: "string",
                begin: "<<<['\"]?\\w+['\"]?$",
                end: "^\\w+;",
                contains: [a.BACKSLASH_ESCAPE]
            }, {
                className: "preprocessor",
                begin: "<\\?php",
                relevance: 10
            }, {
                className: "preprocessor",
                begin: "\\?>"
            }, e, {
                className: "function",
                beginWithKeyword: true,
                end: "{",
                keywords: "function",
                illegal: "\\$|\\[|%",
                contains: [
                    d, {
                        className: "params",
                        begin: "\\(",
                        end: "\\)",
                        contains: [
                            "self", e, a.C_BLOCK_COMMENT_MODE
                        ].concat(b).concat(c)
                    }
                ]
            }, {
                className: "class",
                beginWithKeyword: true,
                end: "{",
                keywords: "class",
                illegal: "[:\\(\\$]",
                contains: [
                    {
                        beginWithKeyword: true,
                        endsWithParent: true,
                        keywords: "extends",
                        contains: [d]
                    }, d
                ]
            }, {
                begin: "=>"
            }
        ].concat(b).concat(c)
    }
}(hljs);
hljs.LANGUAGES.vala = function (a) {
    return {
        keywords: {
            keyword: "char uchar unichar int uint long ulong short ushort int8 int16 int32 int64 uint8 uint16 uint32 uint64 float double bool struct enum string void weak unowned owned async signal static abstract interface override while do for foreach else switch case break default return try catch public private protected internal using new this get set const stdout stdin stderr var",
            built_in: "DBus GLib CCode Gee Object",
            literal: "false true null"
        },
        contains: [
            {
                className: "class",
                beginWithKeyword: true,
                end: "{",
                keywords: "class interface delegate namespace",
                illegal: "[^,:\\n\\s\\.]",
                contains: [
                    {
                        className: "title",
                        begin: a.UNDERSCORE_IDENT_RE
                    }
                ]
            }, a.C_LINE_COMMENT_MODE, a.C_BLOCK_COMMENT_MODE, {
                className: "string",
                begin: '"""',
                end: '"""',
                relevance: 5
            }, a.APOS_STRING_MODE, a.QUOTE_STRING_MODE, a.C_NUMBER_MODE, {
                className: "preprocessor",
                begin: "^#",
                end: "$",
                relevance: 2
            }, {
                className: "constant",
                begin: " [A-Z_]+ ",
                relevance: 0
            }
        ]
    }
}(hljs);
hljs.LANGUAGES.ini = function (a) {
    return {
        case_insensitive: true,
        illegal: "[^\\s]",
        contains: [
            {
                className: "comment",
                begin: ";",
                end: "$"
            }, {
                className: "title",
                begin: "^\\[",
                end: "\\]"
            }, {
                className: "setting",
                begin: "^[a-z0-9\\[\\]_-]+[ \\t]*=[ \\t]*",
                end: "$",
                contains: [
                    {
                        className: "value",
                        endsWithParent: true,
                        keywords: "on off true false yes no",
                        contains: [
                            a.QUOTE_STRING_MODE, a.NUMBER_MODE
                        ],
                        relevance: 0
                    }
                ]
            }
        ]
    }
}(hljs);
hljs.LANGUAGES.scala = function (a) {
    var c = {
            className: "annotation",
            begin: "@[A-Za-z]+"
        };
    var b = {
            className: "string",
            begin: 'u?r?"""',
            end: '"""',
            relevance: 10
        };
    return {
        keywords: "type yield lazy override def with val var false true sealed abstract private trait object null if for while throw finally protected extends import final return else break new catch super class case package default try this match continue throws",
        contains: [
            {
                className: "javadoc",
                begin: "/\\*\\*",
                end: "\\*/",
                contains: [
                    {
                        className: "javadoctag",
                        begin: "@[A-Za-z]+"
                    }
                ],
                relevance: 10
            }, a.C_LINE_COMMENT_MODE, a.C_BLOCK_COMMENT_MODE, a.APOS_STRING_MODE, a.QUOTE_STRING_MODE, b, {
                className: "class",
                begin: "((case )?class |object |trait )",
                end: "({|$)",
                illegal: ":",
                keywords: "case class trait object",
                contains: [
                    {
                        beginWithKeyword: true,
                        keywords: "extends with",
                        relevance: 10
                    }, {
                        className: "title",
                        begin: a.UNDERSCORE_IDENT_RE
                    }, {
                        className: "params",
                        begin: "\\(",
                        end: "\\)",
                        contains: [
                            a.APOS_STRING_MODE, a.QUOTE_STRING_MODE, b, c
                        ]
                    }
                ]
            }, a.C_NUMBER_MODE, c
        ]
    }
}(hljs);
hljs.LANGUAGES.r = function (a) {
    var b = "([a-zA-Z]|\\.[a-zA-Z.])[a-zA-Z0-9._]*";
    return {
        contains: [
            a.HASH_COMMENT_MODE, {
                begin: b,
                lexems: b,
                keywords: {
                    keyword: "function if in break next repeat else for return switch while try tryCatch|10 stop warning require library attach detach source setMethod setGeneric setGroupGeneric setClass ...|10",
                    literal: "NULL NA TRUE FALSE T F Inf NaN NA_integer_|10 NA_real_|10 NA_character_|10 NA_complex_|10"
                },
                relevance: 0
            }, {
                className: "number",
                begin: "0[xX][0-9a-fA-F]+[Li]?\\b",
                relevance: 0
            }, {
                className: "number",
                begin: "\\d+(?:[eE][+\\-]?\\d*)?L\\b",
                relevance: 0
            }, {
                className: "number",
                begin: "\\d+\\.(?!\\d)(?:i\\b)?",
                relevance: 0
            }, {
                className: "number",
                begin: "\\d+(?:\\.\\d*)?(?:[eE][+\\-]?\\d*)?i?\\b",
                relevance: 0
            }, {
                className: "number",
                begin: "\\.\\d+(?:[eE][+\\-]?\\d*)?i?\\b",
                relevance: 0
            }, {
                begin: "`",
                end: "`",
                relevance: 0
            }, {
                className: "string",
                begin: '"',
                end: '"',
                contains: [a.BACKSLASH_ESCAPE],
                relevance: 0
            }, {
                className: "string",
                begin: "'",
                end: "'",
                contains: [a.BACKSLASH_ESCAPE],
                relevance: 0
            }
        ]
    }
}(hljs);
hljs.LANGUAGES.xml = function (a) {
    var c = "[A-Za-z0-9\\._:-]+";
    var b = {
            endsWithParent: true,
            relevance: 0,
            contains: [
                {
                    className: "attribute",
                    begin: c,
                    relevance: 0
                }, {
                    begin: '="',
                    returnBegin: true,
                    end: '"',
                    contains: [
                        {
                            className: "value",
                            begin: '"',
                            endsWithParent: true
                        }
                    ]
                }, {
                    begin: "='",
                    returnBegin: true,
                    end: "'",
                    contains: [
                        {
                            className: "value",
                            begin: "'",
                            endsWithParent: true
                        }
                    ]
                }, {
                    begin: "=",
                    contains: [
                        {
                            className: "value",
                            begin: "[^\\s/>]+"
                        }
                    ]
                }
            ]
        };
    return {
        case_insensitive: true,
        contains: [
            {
                className: "pi",
                begin: "<\\?",
                end: "\\?>",
                relevance: 10
            }, {
                className: "doctype",
                begin: "<!DOCTYPE",
                end: ">",
                relevance: 10,
                contains: [
                    {
                        begin: "\\[",
                        end: "\\]"
                    }
                ]
            }, {
                className: "comment",
                begin: "<!--",
                end: "-->",
                relevance: 10
            }, {
                className: "cdata",
                begin: "<\\!\\[CDATA\\[",
                end: "\\]\\]>",
                relevance: 10
            }, {
                className: "tag",
                begin: "<style(?=\\s|>|$)",
                end: ">",
                keywords: {
                    title: "style"
                },
                contains: [b],
                starts: {
                    end: "</style>",
                    returnEnd: true,
                    subLanguage: "css"
                }
            }, {
                className: "tag",
                begin: "<script(?=\\s|>|$)",
                end: ">",
                keywords: {
                    title: "script"
                },
                contains: [b],
                starts: {
                    end: "<\/script>",
                    returnEnd: true,
                    subLanguage: "javascript"
                }
            }, {
                begin: "<%",
                end: "%>",
                subLanguage: "vbscript"
            }, {
                className: "tag",
                begin: "</?",
                end: "/?>",
                relevance: 0,
                contains: [
                    {
                        className: "title",
                        begin: "[^ /><]+"
                    }, b
                ]
            }
        ]
    }
}(hljs);
hljs.LANGUAGES.cmake = function (a) {
    return {
        case_insensitive: true,
        keywords: {
            keyword: "add_custom_command add_custom_target add_definitions add_dependencies add_executable add_library add_subdirectory add_test aux_source_directory break build_command cmake_minimum_required cmake_policy configure_file create_test_sourcelist define_property else elseif enable_language enable_testing endforeach endfunction endif endmacro endwhile execute_process export find_file find_library find_package find_path find_program fltk_wrap_ui foreach function get_cmake_property get_directory_property get_filename_component get_property get_source_file_property get_target_property get_test_property if include include_directories include_external_msproject include_regular_expression install link_directories load_cache load_command macro mark_as_advanced message option output_required_files project qt_wrap_cpp qt_wrap_ui remove_definitions return separate_arguments set set_directory_properties set_property set_source_files_properties set_target_properties set_tests_properties site_name source_group string target_link_libraries try_compile try_run unset variable_watch while build_name exec_program export_library_dependencies install_files install_programs install_targets link_libraries make_directory remove subdir_depends subdirs use_mangled_mesa utility_source variable_requires write_file qt5_use_modules qt5_use_package qt5_wrap_cpp on off true false and or",
            operator: "equal less greater strless strgreater strequal matches"
        },
        contains: [
            {
                className: "envvar",
                begin: "\\${",
                end: "}"
            }, a.HASH_COMMENT_MODE, a.QUOTE_STRING_MODE, a.NUMBER_MODE
        ]
    }
}(hljs);
hljs.LANGUAGES.matlab = function (a) {
    var b = [
            a.C_NUMBER_MODE, {
                className: "string",
                begin: "'",
                end: "'",
                contains: [
                    a.BACKSLASH_ESCAPE, {
                        begin: "''"
                    }
                ],
                relevance: 0
            }
        ];
    return {
        keywords: {
            keyword: "break case catch classdef continue else elseif end enumerated events for function global if methods otherwise parfor persistent properties return spmd switch try while",
            built_in: "sin sind sinh asin asind asinh cos cosd cosh acos acosd acosh tan tand tanh atan atand atan2 atanh sec secd sech asec asecd asech csc cscd csch acsc acscd acsch cot cotd coth acot acotd acoth hypot exp expm1 log log1p log10 log2 pow2 realpow reallog realsqrt sqrt nthroot nextpow2 abs angle complex conj imag real unwrap isreal cplxpair fix floor ceil round mod rem sign airy besselj bessely besselh besseli besselk beta betainc betaln ellipj ellipke erf erfc erfcx erfinv expint gamma gammainc gammaln psi legendre cross dot factor isprime primes gcd lcm rat rats perms nchoosek factorial cart2sph cart2pol pol2cart sph2cart hsv2rgb rgb2hsv zeros ones eye repmat rand randn linspace logspace freqspace meshgrid accumarray size length ndims numel disp isempty isequal isequalwithequalnans cat reshape diag blkdiag tril triu fliplr flipud flipdim rot90 find sub2ind ind2sub bsxfun ndgrid permute ipermute shiftdim circshift squeeze isscalar isvector ans eps realmax realmin pi i inf nan isnan isinf isfinite j why compan gallery hadamard hankel hilb invhilb magic pascal rosser toeplitz vander wilkinson"
        },
        illegal: '(//|"|#|/\\*|\\s+/\\w+)',
        contains: [
            {
                className: "function",
                beginWithKeyword: true,
                end: "$",
                keywords: "function",
                contains: [
                    {
                        className: "title",
                        begin: a.UNDERSCORE_IDENT_RE
                    }, {
                        className: "params",
                        begin: "\\(",
                        end: "\\)"
                    }, {
                        className: "params",
                        begin: "\\[",
                        end: "\\]"
                    }
                ]
            }, {
                className: "transposed_variable",
                begin: "[a-zA-Z_][a-zA-Z_0-9]*('+[\\.']*|[\\.']+)",
                end: ""
            }, {
                className: "matrix",
                begin: "\\[",
                end: "\\]'*[\\.']*",
                contains: b
            }, {
                className: "cell",
                begin: "\\{",
                end: "\\}'*[\\.']*",
                contains: b
            }, {
                className: "comment",
                begin: "\\%",
                end: "$"
            }
        ].concat(b)
    }
}(hljs);
hljs.LANGUAGES.python = function (a) {
    var f = {
            className: "prompt",
            begin: /^(>>>|\.\.\.) /
        };
    var c = [
            {
                className: "string",
                begin: /(u|b)?r?'''/,
                end: /'''/,
                contains: [f],
                relevance: 10
            }, {
                className: "string",
                begin: /(u|b)?r?"""/,
                end: /"""/,
                contains: [f],
                relevance: 10
            }, {
                className: "string",
                begin: /(u|r|ur)'/,
                end: /'/,
                contains: [a.BACKSLASH_ESCAPE],
                relevance: 10
            }, {
                className: "string",
                begin: /(u|r|ur)"/,
                end: /"/,
                contains: [a.BACKSLASH_ESCAPE],
                relevance: 10
            }, {
                className: "string",
                begin: /(b|br)'/,
                end: /'/,
                contains: [a.BACKSLASH_ESCAPE]
            }, {
                className: "string",
                begin: /(b|br)"/,
                end: /"/,
                contains: [a.BACKSLASH_ESCAPE]
            }
        ].concat([
            a.APOS_STRING_MODE, a.QUOTE_STRING_MODE
        ]);
    var e = {
            className: "title",
            begin: a.UNDERSCORE_IDENT_RE
        };
    var d = {
            className: "params",
            begin: /\(/,
            end: /\)/,
            contains: [
                "self", a.C_NUMBER_MODE, f
            ].concat(c)
        };
    var b = {
            beginWithKeyword: true,
            end: /:/,
            illegal: /[${=;\n]/,
            contains: [
                e, d
            ],
            relevance: 10
        };
    return {
        keywords: {
            keyword: "and elif is global as in if from raise for except finally print import pass return exec else break not with class assert yield try while continue del or def lambda nonlocal|10",
            built_in: "None True False Ellipsis NotImplemented"
        },
        illegal: /(<\/|->|\?)/,
        contains: c.concat([
            f, a.HASH_COMMENT_MODE, a.inherit(b, {
                className: "function",
                keywords: "def"
            }), a.inherit(b, {
                className: "class",
                keywords: "class"
            }), a.C_NUMBER_MODE, {
                className: "decorator",
                begin: /@/,
                end: /$/
            }, {
                begin: /\b(print|exec)\(/
            }
        ])
    }
}(hljs);
hljs.LANGUAGES.http = function (a) {
    return {
        illegal: "\\S",
        contains: [
            {
                className: "status",
                begin: "^HTTP/[0-9\\.]+",
                end: "$",
                contains: [
                    {
                        className: "number",
                        begin: "\\b\\d{3}\\b"
                    }
                ]
            }, {
                className: "request",
                begin: "^[A-Z]+ (.*?) HTTP/[0-9\\.]+$",
                returnBegin: true,
                end: "$",
                contains: [
                    {
                        className: "string",
                        begin: " ",
                        end: " ",
                        excludeBegin: true,
                        excludeEnd: true
                    }
                ]
            }, {
                className: "attribute",
                begin: "^\\w",
                end: ": ",
                excludeEnd: true,
                illegal: "\\n|\\s|=",
                starts: {
                    className: "string",
                    end: "$"
                }
            }, {
                begin: "\\n\\n",
                starts: {
                    subLanguage: "",
                    endsWithParent: true
                }
            }
        ]
    }
}(hljs);
hljs.LANGUAGES.vbscript = function (a) {
    return {
        case_insensitive: true,
        keywords: {
            keyword: "call class const dim do loop erase execute executeglobal exit for each next function if then else on error option explicit new private property let get public randomize redim rem select case set stop sub while wend with end to elseif is or xor and not class_initialize class_terminate default preserve in me byval byref step resume goto",
            built_in: "lcase month vartype instrrev ubound setlocale getobject rgb getref string weekdayname rnd dateadd monthname now day minute isarray cbool round formatcurrency conversions csng timevalue second year space abs clng timeserial fixs len asc isempty maths dateserial atn timer isobject filter weekday datevalue ccur isdate instr datediff formatdatetime replace isnull right sgn array snumeric log cdbl hex chr lbound msgbox ucase getlocale cos cdate cbyte rtrim join hour oct typename trim strcomp int createobject loadpicture tan formatnumber mid scriptenginebuildversion scriptengine split scriptengineminorversion cint sin datepart ltrim sqr scriptenginemajorversion time derived eval date formatpercent exp inputbox left ascw chrw regexp server response request cstr err",
            literal: "true false null nothing empty"
        },
        illegal: "//",
        contains: [
            a.inherit(a.QUOTE_STRING_MODE, {
                contains: [
                    {
                        begin: '""'
                    }
                ]
            }), {
                className: "comment",
                begin: "'",
                end: "$"
            }, a.C_NUMBER_MODE
        ]
    }
}(hljs);
hljs.LANGUAGES.go = function (a) {
    var b = {
            keyword: "break default func interface select case map struct chan else goto package switch const fallthrough if range type continue for import return var go defer",
            constant: "true false iota nil",
            typename: "bool byte complex64 complex128 float32 float64 int8 int16 int32 int64 string uint8 uint16 uint32 uint64 int uint uintptr rune",
            built_in: "append cap close complex copy imag len make new panic print println real recover delete"
        };
    return {
        keywords: b,
        illegal: "</",
        contains: [
            a.C_LINE_COMMENT_MODE, a.C_BLOCK_COMMENT_MODE, a.QUOTE_STRING_MODE, {
                className: "string",
                begin: "'",
                end: "[^\\\\]'",
                relevance: 0
            }, {
                className: "string",
                begin: "`",
                end: "`"
            }, {
                className: "number",
                begin: "[^a-zA-Z_0-9](\\-|\\+)?\\d+(\\.\\d+|\\/\\d+)?((d|e|f|l|s)(\\+|\\-)?\\d+)?",
                relevance: 0
            }, a.C_NUMBER_MODE
        ]
    }
}(hljs);
hljs.LANGUAGES.parser3 = function (a) {
    return {
        subLanguage: "xml",
        relevance: 0,
        contains: [
            {
                className: "comment",
                begin: "^#",
                end: "$"
            }, {
                className: "comment",
                begin: "\\^rem{",
                end: "}",
                relevance: 10,
                contains: [
                    {
                        begin: "{",
                        end: "}",
                        contains: ["self"]
                    }
                ]
            }, {
                className: "preprocessor",
                begin: "^@(?:BASE|USE|CLASS|OPTIONS)$",
                relevance: 10
            }, {
                className: "title",
                begin: "@[\\w\\-]+\\[[\\w^;\\-]*\\](?:\\[[\\w^;\\-]*\\])?(?:.*)$"
            }, {
                className: "variable",
                begin: "\\$\\{?[\\w\\-\\.\\:]+\\}?"
            }, {
                className: "keyword",
                begin: "\\^[\\w\\-\\.\\:]+"
            }, {
                className: "number",
                begin: "\\^#[0-9a-fA-F]+"
            }, a.C_NUMBER_MODE
        ]
    }
}(hljs);
hljs.LANGUAGES.dos = function (a) {
    return {
        case_insensitive: true,
        keywords: {
            flow: "if else goto for in do call exit not exist errorlevel defined equ neq lss leq gtr geq",
            keyword: "shift cd dir echo setlocal endlocal set pause copy",
            stream: "prn nul lpt3 lpt2 lpt1 con com4 com3 com2 com1 aux",
            winutils: "ping net ipconfig taskkill xcopy ren del"
        },
        contains: [
            {
                className: "envvar",
                begin: "%%[^ ]"
            }, {
                className: "envvar",
                begin: "%[^ ]+?%"
            }, {
                className: "envvar",
                begin: "![^ ]+?!"
            }, {
                className: "number",
                begin: "\\b\\d+",
                relevance: 0
            }, {
                className: "comment",
                begin: "@?rem",
                end: "$"
            }
        ]
    }
}(hljs);
hljs.LANGUAGES.asciidoc = function (a) {
    return {
        contains: [
            {
                className: "comment",
                begin: "^/{4,}\\n",
                end: "\\n/{4,}$",
                relevance: 10
            }, {
                className: "comment",
                begin: "^//",
                end: "$",
                relevance: 0
            }, {
                className: "title",
                begin: "^\\.\\w.*$"
            }, {
                begin: "^[=\\*]{4,}\\n",
                end: "\\n^[=\\*]{4,}$",
                relevance: 10
            }, {
                className: "header",
                begin: "^(={1,5}) .+?( \\1)?$",
                relevance: 10
            }, {
                className: "header",
                begin: "^[^\\[\\]\\n]+?\\n[=\\-~\\^\\+]{2,}$",
                relevance: 10
            }, {
                className: "attribute",
                begin: "^:.+?:",
                end: "\\s",
                excludeEnd: true,
                relevance: 10
            }, {
                className: "attribute",
                begin: "^\\[.+?\\]$",
                relevance: 0
            }, {
                className: "blockquote",
                begin: "^_{4,}\\n",
                end: "\\n_{4,}$",
                relevance: 10
            }, {
                className: "code",
                begin: "^[\\-\\.]{4,}\\n",
                end: "\\n[\\-\\.]{4,}$",
                relevance: 10
            }, {
                begin: "^\\+{4,}\\n",
                end: "\\n\\+{4,}$",
                contains: [
                    {
                        begin: "<",
                        end: ">",
                        subLanguage: "xml",
                        relevance: 0
                    }
                ],
                relevance: 10
            }, {
                className: "bullet",
                begin: "^(\\*+|\\-+|\\.+|[^\\n]+?::)\\s+"
            }, {
                className: "label",
                begin: "^(NOTE|TIP|IMPORTANT|WARNING|CAUTION):\\s+",
                relevance: 10
            }, {
                className: "strong",
                begin: "\\B\\*(?![\\*\\s])",
                end: "(\\n{2}|\\*)",
                contains: [
                    {
                        begin: "\\\\*\\w",
                        relevance: 0
                    }
                ]
            }, {
                className: "emphasis",
                begin: "\\B'(?!['\\s])",
                end: "(\\n{2}|')",
                contains: [
                    {
                        begin: "\\\\'\\w",
                        relevance: 0
                    }
                ],
                relevance: 0
            }, {
                className: "emphasis",
                begin: "_(?![_\\s])",
                end: "(\\n{2}|_)",
                relevance: 0
            }, {
                className: "code",
                begin: "(`.+?`|\\+.+?\\+)",
                relevance: 0
            }, {
                className: "code",
                begin: "^[ \\t]",
                end: "$",
                relevance: 0
            }, {
                className: "horizontal_rule",
                begin: "^'{4,}[ \\t]*$",
                relevance: 10
            }, {
                begin: "(link:)?(http|https|ftp|file|irc|image:?):\\S+\\[.*?\\]",
                returnBegin: true,
                contains: [
                    {
                        begin: "(link|image:?):",
                        relevance: 0
                    }, {
                        className: "link_url",
                        begin: "\\w",
                        end: "[^\\[]+",
                        relevance: 0
                    }, {
                        className: "link_label",
                        begin: "\\[",
                        end: "\\]",
                        excludeBegin: true,
                        excludeEnd: true,
                        relevance: 0
                    }
                ],
                relevance: 10
            }
        ]
    }
}(hljs);
hljs.LANGUAGES.smalltalk = function (a) {
    var b = "[a-z][a-zA-Z0-9_]*";
    var d = {
            className: "char",
            begin: "\\$.{1}"
        };
    var c = {
            className: "symbol",
            begin: "#" + a.UNDERSCORE_IDENT_RE
        };
    return {
        keywords: "self super nil true false thisContext",
        contains: [
            {
                className: "comment",
                begin: '"',
                end: '"',
                relevance: 0
            }, a.APOS_STRING_MODE, {
                className: "class",
                begin: "\\b[A-Z][A-Za-z0-9_]*",
                relevance: 0
            }, {
                className: "method",
                begin: b + ":"
            }, a.C_NUMBER_MODE, c, d, {
                className: "localvars",
                begin: "\\|\\s*" + b + "(\\s+" + b + ")*\\s*\\|"
            }, {
                className: "array",
                begin: "\\#\\(",
                end: "\\)",
                contains: [
                    a.APOS_STRING_MODE, d, a.C_NUMBER_MODE, c
                ]
            }
        ]
    }
}(hljs);
hljs.LANGUAGES.glsl = function (a) {
    return {
        keywords: {
            keyword: "atomic_uint attribute bool break bvec2 bvec3 bvec4 case centroid coherent const continue default discard dmat2 dmat2x2 dmat2x3 dmat2x4 dmat3 dmat3x2 dmat3x3 dmat3x4 dmat4 dmat4x2 dmat4x3 dmat4x4 do double dvec2 dvec3 dvec4 else flat float for highp if iimage1D iimage1DArray iimage2D iimage2DArray iimage2DMS iimage2DMSArray iimage2DRect iimage3D iimageBuffer iimageCube iimageCubeArray image1D image1DArray image2D image2DArray image2DMS image2DMSArray image2DRect image3D imageBuffer imageCube imageCubeArray in inout int invariant isampler1D isampler1DArray isampler2D isampler2DArray isampler2DMS isampler2DMSArray isampler2DRect isampler3D isamplerBuffer isamplerCube isamplerCubeArray ivec2 ivec3 ivec4 layout lowp mat2 mat2x2 mat2x3 mat2x4 mat3 mat3x2 mat3x3 mat3x4 mat4 mat4x2 mat4x3 mat4x4 mediump noperspective out patch precision readonly restrict return sample sampler1D sampler1DArray sampler1DArrayShadow sampler1DShadow sampler2D sampler2DArray sampler2DArrayShadow sampler2DMS sampler2DMSArray sampler2DRect sampler2DRectShadow sampler2DShadow sampler3D samplerBuffer samplerCube samplerCubeArray samplerCubeArrayShadow samplerCubeShadow smooth struct subroutine switch uimage1D uimage1DArray uimage2D uimage2DArray uimage2DMS uimage2DMSArray uimage2DRect uimage3D uimageBuffer uimageCube uimageCubeArray uint uniform usampler1D usampler1DArray usampler2D usampler2DArray usampler2DMS usampler2DMSArray usampler2DRect usampler3D usamplerBuffer usamplerCube usamplerCubeArray uvec2 uvec3 uvec4 varying vec2 vec3 vec4 void volatile while writeonly",
            built_in: "gl_BackColor gl_BackLightModelProduct gl_BackLightProduct gl_BackMaterial gl_BackSecondaryColor gl_ClipDistance gl_ClipPlane gl_ClipVertex gl_Color gl_DepthRange gl_EyePlaneQ gl_EyePlaneR gl_EyePlaneS gl_EyePlaneT gl_Fog gl_FogCoord gl_FogFragCoord gl_FragColor gl_FragCoord gl_FragData gl_FragDepth gl_FrontColor gl_FrontFacing gl_FrontLightModelProduct gl_FrontLightProduct gl_FrontMaterial gl_FrontSecondaryColor gl_InstanceID gl_InvocationID gl_Layer gl_LightModel gl_LightSource gl_MaxAtomicCounterBindings gl_MaxAtomicCounterBufferSize gl_MaxClipDistances gl_MaxClipPlanes gl_MaxCombinedAtomicCounterBuffers gl_MaxCombinedAtomicCounters gl_MaxCombinedImageUniforms gl_MaxCombinedImageUnitsAndFragmentOutputs gl_MaxCombinedTextureImageUnits gl_MaxDrawBuffers gl_MaxFragmentAtomicCounterBuffers gl_MaxFragmentAtomicCounters gl_MaxFragmentImageUniforms gl_MaxFragmentInputComponents gl_MaxFragmentUniformComponents gl_MaxFragmentUniformVectors gl_MaxGeometryAtomicCounterBuffers gl_MaxGeometryAtomicCounters gl_MaxGeometryImageUniforms gl_MaxGeometryInputComponents gl_MaxGeometryOutputComponents gl_MaxGeometryOutputVertices gl_MaxGeometryTextureImageUnits gl_MaxGeometryTotalOutputComponents gl_MaxGeometryUniformComponents gl_MaxGeometryVaryingComponents gl_MaxImageSamples gl_MaxImageUnits gl_MaxLights gl_MaxPatchVertices gl_MaxProgramTexelOffset gl_MaxTessControlAtomicCounterBuffers gl_MaxTessControlAtomicCounters gl_MaxTessControlImageUniforms gl_MaxTessControlInputComponents gl_MaxTessControlOutputComponents gl_MaxTessControlTextureImageUnits gl_MaxTessControlTotalOutputComponents gl_MaxTessControlUniformComponents gl_MaxTessEvaluationAtomicCounterBuffers gl_MaxTessEvaluationAtomicCounters gl_MaxTessEvaluationImageUniforms gl_MaxTessEvaluationInputComponents gl_MaxTessEvaluationOutputComponents gl_MaxTessEvaluationTextureImageUnits gl_MaxTessEvaluationUniformComponents gl_MaxTessGenLevel gl_MaxTessPatchComponents gl_MaxTextureCoords gl_MaxTextureImageUnits gl_MaxTextureUnits gl_MaxVaryingComponents gl_MaxVaryingFloats gl_MaxVaryingVectors gl_MaxVertexAtomicCounterBuffers gl_MaxVertexAtomicCounters gl_MaxVertexAttribs gl_MaxVertexImageUniforms gl_MaxVertexOutputComponents gl_MaxVertexTextureImageUnits gl_MaxVertexUniformComponents gl_MaxVertexUniformVectors gl_MaxViewports gl_MinProgramTexelOffsetgl_ModelViewMatrix gl_ModelViewMatrixInverse gl_ModelViewMatrixInverseTranspose gl_ModelViewMatrixTranspose gl_ModelViewProjectionMatrix gl_ModelViewProjectionMatrixInverse gl_ModelViewProjectionMatrixInverseTranspose gl_ModelViewProjectionMatrixTranspose gl_MultiTexCoord0 gl_MultiTexCoord1 gl_MultiTexCoord2 gl_MultiTexCoord3 gl_MultiTexCoord4 gl_MultiTexCoord5 gl_MultiTexCoord6 gl_MultiTexCoord7 gl_Normal gl_NormalMatrix gl_NormalScale gl_ObjectPlaneQ gl_ObjectPlaneR gl_ObjectPlaneS gl_ObjectPlaneT gl_PatchVerticesIn gl_PerVertex gl_Point gl_PointCoord gl_PointSize gl_Position gl_PrimitiveID gl_PrimitiveIDIn gl_ProjectionMatrix gl_ProjectionMatrixInverse gl_ProjectionMatrixInverseTranspose gl_ProjectionMatrixTranspose gl_SampleID gl_SampleMask gl_SampleMaskIn gl_SamplePosition gl_SecondaryColor gl_TessCoord gl_TessLevelInner gl_TessLevelOuter gl_TexCoord gl_TextureEnvColor gl_TextureMatrixInverseTranspose gl_TextureMatrixTranspose gl_Vertex gl_VertexID gl_ViewportIndex gl_in gl_out EmitStreamVertex EmitVertex EndPrimitive EndStreamPrimitive abs acos acosh all any asin asinh atan atanh atomicCounter atomicCounterDecrement atomicCounterIncrement barrier bitCount bitfieldExtract bitfieldInsert bitfieldReverse ceil clamp cos cosh cross dFdx dFdy degrees determinant distance dot equal exp exp2 faceforward findLSB findMSB floatBitsToInt floatBitsToUint floor fma fract frexp ftransform fwidth greaterThan greaterThanEqual imageAtomicAdd imageAtomicAnd imageAtomicCompSwap imageAtomicExchange imageAtomicMax imageAtomicMin imageAtomicOr imageAtomicXor imageLoad imageStore imulExtended intBitsToFloat interpolateAtCentroid interpolateAtOffset interpolateAtSample inverse inversesqrt isinf isnan ldexp length lessThan lessThanEqual log log2 matrixCompMult max memoryBarrier min mix mod modf noise1 noise2 noise3 noise4 normalize not notEqual outerProduct packDouble2x32 packHalf2x16 packSnorm2x16 packSnorm4x8 packUnorm2x16 packUnorm4x8 pow radians reflect refract round roundEven shadow1D shadow1DLod shadow1DProj shadow1DProjLod shadow2D shadow2DLod shadow2DProj shadow2DProjLod sign sin sinh smoothstep sqrt step tan tanh texelFetch texelFetchOffset texture texture1D texture1DLod texture1DProj texture1DProjLod texture2D texture2DLod texture2DProj texture2DProjLod texture3D texture3DLod texture3DProj texture3DProjLod textureCube textureCubeLod textureGather textureGatherOffset textureGatherOffsets textureGrad textureGradOffset textureLod textureLodOffset textureOffset textureProj textureProjGrad textureProjGradOffset textureProjLod textureProjLodOffset textureProjOffset textureQueryLod textureSize transpose trunc uaddCarry uintBitsToFloat umulExtended unpackDouble2x32 unpackHalf2x16 unpackSnorm2x16 unpackSnorm4x8 unpackUnorm2x16 unpackUnorm4x8 usubBorrow gl_TextureMatrix gl_TextureMatrixInverse",
            literal: "true false"
        },
        illegal: '"',
        contains: [
            a.C_LINE_COMMENT_MODE, a.C_BLOCK_COMMENT_MODE, a.C_NUMBER_MODE, {
                className: "preprocessor",
                begin: "#",
                end: "$"
            }
        ]
    }
}(hljs);
hljs.LANGUAGES.actionscript = function (a) {
    var c = "[a-zA-Z_$][a-zA-Z0-9_$]*";
    var d = "([*]|[a-zA-Z_$][a-zA-Z0-9_$]*)";
    var e = {
            className: "rest_arg",
            begin: "[.]{3}",
            end: c,
            relevance: 10
        };
    var b = {
            className: "title",
            begin: c
        };
    return {
        keywords: {
            keyword: "as break case catch class const continue default delete do dynamic each else extends final finally for function get if implements import in include instanceof interface internal is namespace native new override package private protected public return set static super switch this throw try typeof use var void while with",
            literal: "true false null undefined"
        },
        contains: [
            a.APOS_STRING_MODE, a.QUOTE_STRING_MODE, a.C_LINE_COMMENT_MODE, a.C_BLOCK_COMMENT_MODE, a.C_NUMBER_MODE, {
                className: "package",
                beginWithKeyword: true,
                end: "{",
                keywords: "package",
                contains: [b]
            }, {
                className: "class",
                beginWithKeyword: true,
                end: "{",
                keywords: "class interface",
                contains: [
                    {
                        beginWithKeyword: true,
                        keywords: "extends implements"
                    }, b
                ]
            }, {
                className: "preprocessor",
                beginWithKeyword: true,
                end: ";",
                keywords: "import include"
            }, {
                className: "function",
                beginWithKeyword: true,
                end: "[{;]",
                keywords: "function",
                illegal: "\\S",
                contains: [
                    b, {
                        className: "params",
                        begin: "\\(",
                        end: "\\)",
                        contains: [
                            a.APOS_STRING_MODE, a.QUOTE_STRING_MODE, a.C_LINE_COMMENT_MODE, a.C_BLOCK_COMMENT_MODE, e
                        ]
                    }, {
                        className: "type",
                        begin: ":",
                        end: d,
                        relevance: 10
                    }
                ]
            }
        ]
    }
}(hljs);
hljs.LANGUAGES.ruby = function (e) {
    var a = "[a-zA-Z_][a-zA-Z0-9_]*(\\!|\\?)?";
    var j = "[a-zA-Z_]\\w*[!?=]?|[-+~]\\@|<<|>>|=~|===?|<=>|[<>]=?|\\*\\*|[-/+%^&*~`|]|\\[\\]=?";
    var g = {
            keyword: "and false then defined module in return redo if BEGIN retry end for true self when next until do begin unless END rescue nil else break undef not super class case require yield alias while ensure elsif or include"
        };
    var c = {
            className: "yardoctag",
            begin: "@[A-Za-z]+"
        };
    var k = [
            {
                className: "comment",
                begin: "#",
                end: "$",
                contains: [c]
            }, {
                className: "comment",
                begin: "^\\=begin",
                end: "^\\=end",
                contains: [c],
                relevance: 10
            }, {
                className: "comment",
                begin: "^__END__",
                end: "\\n$"
            }
        ];
    var d = {
            className: "subst",
            begin: "#\\{",
            end: "}",
            lexems: a,
            keywords: g
        };
    var i = [
            e.BACKSLASH_ESCAPE, d
        ];
    var b = [
            {
                className: "string",
                begin: "'",
                end: "'",
                contains: i,
                relevance: 0
            }, {
                className: "string",
                begin: '"',
                end: '"',
                contains: i,
                relevance: 0
            }, {
                className: "string",
                begin: "%[qw]?\\(",
                end: "\\)",
                contains: i
            }, {
                className: "string",
                begin: "%[qw]?\\[",
                end: "\\]",
                contains: i
            }, {
                className: "string",
                begin: "%[qw]?{",
                end: "}",
                contains: i
            }, {
                className: "string",
                begin: "%[qw]?<",
                end: ">",
                contains: i,
                relevance: 10
            }, {
                className: "string",
                begin: "%[qw]?/",
                end: "/",
                contains: i,
                relevance: 10
            }, {
                className: "string",
                begin: "%[qw]?%",
                end: "%",
                contains: i,
                relevance: 10
            }, {
                className: "string",
                begin: "%[qw]?-",
                end: "-",
                contains: i,
                relevance: 10
            }, {
                className: "string",
                begin: "%[qw]?\\|",
                end: "\\|",
                contains: i,
                relevance: 10
            }
        ];
    var h = {
            className: "function",
            beginWithKeyword: true,
            end: " |$|;",
            keywords: "def",
            contains: [
                {
                    className: "title",
                    begin: j,
                    lexems: a,
                    keywords: g
                }, {
                    className: "params",
                    begin: "\\(",
                    end: "\\)",
                    lexems: a,
                    keywords: g
                }
            ].concat(k)
        };
    var f = k.concat(b.concat([
            {
                className: "class",
                beginWithKeyword: true,
                end: "$|;",
                keywords: "class module",
                contains: [
                    {
                        className: "title",
                        begin: "[A-Za-z_]\\w*(::\\w+)*(\\?|\\!)?",
                        relevance: 0
                    }, {
                        className: "inheritance",
                        begin: "<\\s*",
                        contains: [
                            {
                                className: "parent",
                                begin: "(" + e.IDENT_RE + "::)?" + e.IDENT_RE
                            }
                        ]
                    }
                ].concat(k)
            }, h, {
                className: "constant",
                begin: "(::)?(\\b[A-Z]\\w*(::)?)+",
                relevance: 0
            }, {
                className: "symbol",
                begin: ":",
                contains: b.concat([
                    {
                        begin: j
                    }
                ]),
                relevance: 0
            }, {
                className: "symbol",
                begin: a + ":",
                relevance: 0
            }, {
                className: "number",
                begin: "(\\b0[0-7_]+)|(\\b0x[0-9a-fA-F_]+)|(\\b[1-9][0-9_]*(\\.[0-9_]+)?)|[0_]\\b",
                relevance: 0
            }, {
                className: "number",
                begin: "\\?\\w"
            }, {
                className: "variable",
                begin: "(\\$\\W)|((\\$|\\@\\@?)(\\w+))"
            }, {
                begin: "(" + e.RE_STARTERS_RE + ")\\s*",
                contains: k.concat([
                    {
                        className: "regexp",
                        begin: "/",
                        end: "/[a-z]*",
                        illegal: "\\n",
                        contains: [
                            e.BACKSLASH_ESCAPE, d
                        ]
                    }
                ]),
                relevance: 0
            }
        ]));
    d.contains = f;
    h.contains[1].contains = f;
    return {
        lexems: a,
        keywords: g,
        contains: f
    }
}(hljs);
hljs.LANGUAGES.clojure = function (k) {
    var i = {
            built_in: "def cond apply if-not if-let if not not= = &lt; < > &lt;= <= >= == + / * - rem quot neg? pos? delay? symbol? keyword? true? false? integer? empty? coll? list? set? ifn? fn? associative? sequential? sorted? counted? reversible? number? decimal? class? distinct? isa? float? rational? reduced? ratio? odd? even? char? seq? vector? string? map? nil? contains? zero? instance? not-every? not-any? libspec? -> ->> .. . inc compare do dotimes mapcat take remove take-while drop letfn drop-last take-last drop-while while intern condp case reduced cycle split-at split-with repeat replicate iterate range merge zipmap declare line-seq sort comparator sort-by dorun doall nthnext nthrest partition eval doseq await await-for let agent atom send send-off release-pending-sends add-watch mapv filterv remove-watch agent-error restart-agent set-error-handler error-handler set-error-mode! error-mode shutdown-agents quote var fn loop recur throw try monitor-enter monitor-exit defmacro defn defn- macroexpand macroexpand-1 for doseq dosync dotimes and or when when-not when-let comp juxt partial sequence memoize constantly complement identity assert peek pop doto proxy defstruct first rest cons defprotocol cast coll deftype defrecord last butlast sigs reify second ffirst fnext nfirst nnext defmulti defmethod meta with-meta ns in-ns create-ns import intern refer keys select-keys vals key val rseq name namespace promise into transient persistent! conj! assoc! dissoc! pop! disj! import use class type num float double short byte boolean bigint biginteger bigdec print-method print-dup throw-if throw printf format load compile get-in update-in pr pr-on newline flush read slurp read-line subvec with-open memfn time ns assert re-find re-groups rand-int rand mod locking assert-valid-fdecl alias namespace resolve ref deref refset swap! reset! set-validator! compare-and-set! alter-meta! reset-meta! commute get-validator alter ref-set ref-history-count ref-min-history ref-max-history ensure sync io! new next conj set! memfn to-array future future-call into-array aset gen-class reduce merge map filter find empty hash-map hash-set sorted-map sorted-map-by sorted-set sorted-set-by vec vector seq flatten reverse assoc dissoc list disj get union difference intersection extend extend-type extend-protocol int nth delay count concat chunk chunk-buffer chunk-append chunk-first chunk-rest max min dec unchecked-inc-int unchecked-inc unchecked-dec-inc unchecked-dec unchecked-negate unchecked-add-int unchecked-add unchecked-subtract-int unchecked-subtract chunk-next chunk-cons chunked-seq? prn vary-meta lazy-seq spread list* str find-keyword keyword symbol gensym force rationalize"
        };
    var e = "[a-zA-Z_0-9\\!\\.\\?\\-\\+\\*\\/\\<\\=\\>\\&\\#\\$';]+";
    var a = "[\\s:\\(\\{]+\\d+(\\.\\d+)?";
    var d = {
            className: "number",
            begin: a,
            relevance: 0
        };
    var j = {
            className: "string",
            begin: '"',
            end: '"',
            contains: [k.BACKSLASH_ESCAPE],
            relevance: 0
        };
    var n = {
            className: "comment",
            begin: ";",
            end: "$",
            relevance: 0
        };
    var m = {
            className: "collection",
            begin: "[\\[\\{]",
            end: "[\\]\\}]"
        };
    var c = {
            className: "comment",
            begin: "\\^" + e
        };
    var b = {
            className: "comment",
            begin: "\\^\\{",
            end: "\\}"
        };
    var g = {
            className: "attribute",
            begin: "[:]" + e
        };
    var l = {
            className: "list",
            begin: "\\(",
            end: "\\)"
        };
    var f = {
            endsWithParent: true,
            keywords: {
                literal: "true false nil"
            },
            relevance: 0
        };
    var h = {
            keywords: i,
            lexems: e,
            className: "title",
            begin: e,
            starts: f
        };
    l.contains = [
        {
            className: "comment",
            begin: "comment"
        }, h
    ];
    f.contains = [
        l, j, c, b, n, g, m, d
    ];
    m.contains = [
        l, j, c, n, g, m, d
    ];
    return {
        illegal: "\\S",
        contains: [
            n, l
        ]
    }
}(hljs);
hljs.LANGUAGES.scss = function (a) {
    var b = "[a-zA-Z-][a-zA-Z0-9_-]*";
    var d = {
            className: "function",
            begin: b + "\\(",
            end: "\\)",
            contains: [
                "self", a.NUMBER_MODE, a.APOS_STRING_MODE, a.QUOTE_STRING_MODE
            ]
        };
    var c = {
            className: "hexcolor",
            begin: "#[0-9A-Fa-f]+"
        };
    var e = {
            className: "attribute",
            begin: "[A-Z\\_\\.\\-]+",
            end: ":",
            excludeEnd: true,
            illegal: "[^\\s]",
            starts: {
                className: "value",
                endsWithParent: true,
                excludeEnd: true,
                contains: [
                    d, c, a.NUMBER_MODE, a.QUOTE_STRING_MODE, a.APOS_STRING_MODE, a.C_BLOCK_COMMENT_MODE, {
                        className: "important",
                        begin: "!important"
                    }
                ]
            }
        };
    return {
        case_insensitive: true,
        illegal: "[=/|']",
        contains: [
            a.C_LINE_COMMENT_MODE, a.C_BLOCK_COMMENT_MODE, {
                className: "function",
                begin: b + "\\(",
                end: "\\)",
                contains: [
                    "self", a.NUMBER_MODE, a.APOS_STRING_MODE, a.QUOTE_STRING_MODE
                ]
            }, {
                className: "id",
                begin: "\\#[A-Za-z0-9_-]+",
                relevance: 0
            }, {
                className: "class",
                begin: "\\.[A-Za-z0-9_-]+",
                relevance: 0
            }, {
                className: "attr_selector",
                begin: "\\[",
                end: "\\]",
                illegal: "$"
            }, {
                className: "tag",
                begin: "\\b(a|abbr|acronym|address|area|article|aside|audio|b|base|big|blockquote|body|br|button|canvas|caption|cite|code|col|colgroup|command|datalist|dd|del|details|dfn|div|dl|dt|em|embed|fieldset|figcaption|figure|footer|form|frame|frameset|(h[1-6])|head|header|hgroup|hr|html|i|iframe|img|input|ins|kbd|keygen|label|legend|li|link|map|mark|meta|meter|nav|noframes|noscript|object|ol|optgroup|option|output|p|param|pre|progress|q|rp|rt|ruby|samp|script|section|select|small|span|strike|strong|style|sub|sup|table|tbody|td|textarea|tfoot|th|thead|time|title|tr|tt|ul|var|video)\\b",
                relevance: 0
            }, {
                className: "pseudo",
                begin: ":(visited|valid|root|right|required|read-write|read-only|out-range|optional|only-of-type|only-child|nth-of-type|nth-last-of-type|nth-last-child|nth-child|not|link|left|last-of-type|last-child|lang|invalid|indeterminate|in-range|hover|focus|first-of-type|first-line|first-letter|first-child|first|enabled|empty|disabled|default|checked|before|after|active)"
            }, {
                className: "pseudo",
                begin: "::(after|before|choices|first-letter|first-line|repeat-index|repeat-item|selection|value)"
            }, {
                className: "attribute",
                begin: "\\b(z-index|word-wrap|word-spacing|word-break|width|widows|white-space|visibility|vertical-align|unicode-bidi|transition-timing-function|transition-property|transition-duration|transition-delay|transition|transform-style|transform-origin|transform|top|text-underline-position|text-transform|text-shadow|text-rendering|text-overflow|text-indent|text-decoration-style|text-decoration-line|text-decoration-color|text-decoration|text-align-last|text-align|tab-size|table-layout|right|resize|quotes|position|pointer-events|perspective-origin|perspective|page-break-inside|page-break-before|page-break-after|padding-top|padding-right|padding-left|padding-bottom|padding|overflow-y|overflow-x|overflow-wrap|overflow|outline-width|outline-style|outline-offset|outline-color|outline|orphans|order|opacity|object-position|object-fit|normal|none|nav-up|nav-right|nav-left|nav-index|nav-down|min-width|min-height|max-width|max-height|mask|marks|margin-top|margin-right|margin-left|margin-bottom|margin|list-style-type|list-style-position|list-style-image|list-style|line-height|letter-spacing|left|justify-content|initial|inherit|ime-mode|image-orientation|image-resolution|image-rendering|icon|hyphens|height|font-weight|font-variant-ligatures|font-variant|font-style|font-stretch|font-size-adjust|font-size|font-language-override|font-kerning|font-feature-settings|font-family|font|float|flex-wrap|flex-shrink|flex-grow|flex-flow|flex-direction|flex-basis|flex|filter|empty-cells|display|direction|cursor|counter-reset|counter-increment|content|column-width|column-span|column-rule-width|column-rule-style|column-rule-color|column-rule|column-gap|column-fill|column-count|columns|color|clip-path|clip|clear|caption-side|break-inside|break-before|break-after|box-sizing|box-shadow|box-decoration-break|bottom|border-width|border-top-width|border-top-style|border-top-right-radius|border-top-left-radius|border-top-color|border-top|border-style|border-spacing|border-right-width|border-right-style|border-right-color|border-right|border-radius|border-left-width|border-left-style|border-left-color|border-left|border-image-width|border-image-source|border-image-slice|border-image-repeat|border-image-outset|border-image|border-color|border-collapse|border-bottom-width|border-bottom-style|border-bottom-right-radius|border-bottom-left-radius|border-bottom-color|border-bottom|border|background-size|background-repeat|background-position|background-origin|background-image|background-color|background-clip|background-attachment|background|backface-visibility|auto|animation-timing-function|animation-play-state|animation-name|animation-iteration-count|animation-fill-mode|animation-duration|animation-direction|animation-delay|animation|align-self|align-items|align-content)\\b",
                illegal: "[^\\s]"
            }, {
                className: "value",
                begin: "\\b(whitespace|wait|w-resize|visible|vertical-text|vertical-ideographic|uppercase|upper-roman|upper-alpha|underline|transparent|top|thin|thick|text|text-top|text-bottom|tb-rl|table-header-group|table-footer-group|sw-resize|super|strict|static|square|solid|small-caps|separate|se-resize|scroll|s-resize|rtl|row-resize|ridge|right|repeat|repeat-y|repeat-x|relative|progress|pointer|overline|outside|outset|oblique|nowrap|not-allowed|normal|none|nw-resize|no-repeat|no-drop|newspaper|ne-resize|n-resize|move|middle|medium|ltr|lr-tb|lowercase|lower-roman|lower-alpha|loose|list-item|line|line-through|line-edge|lighter|left|keep-all|justify|italic|inter-word|inter-ideograph|inside|inset|inline|inline-block|inherit|inactive|ideograph-space|ideograph-parenthesis|ideograph-numeric|ideograph-alpha|horizontal|hidden|help|hand|groove|fixed|ellipsis|e-resize|double|dotted|distribute|distribute-space|distribute-letter|distribute-all-lines|disc|disabled|default|decimal|dashed|crosshair|collapse|col-resize|circle|char|center|capitalize|break-word|break-all|bottom|both|bolder|bold|block|bidi-override|below|baseline|auto|always|all-scroll|absolute|table|table-cell)\\b"
            }, {
                className: "value",
                begin: ":",
                end: ";",
                contains: [
                    c, a.NUMBER_MODE, a.QUOTE_STRING_MODE, a.APOS_STRING_MODE, {
                        className: "important",
                        begin: "!important"
                    }
                ]
            }, {
                className: "at_rule",
                begin: "@",
                end: "[{;]",
                keywords: "mixin include for extend charset import media page font-face namespace",
                contains: [
                    d, a.QUOTE_STRING_MODE, a.APOS_STRING_MODE, c, a.NUMBER_MODE, {
                        className: "preprocessor",
                        begin: "\\s[A-Za-z0-9_.-]+",
                        relevance: 0
                    }
                ]
            }
        ]
    }
}(hljs);
hljs.LANGUAGES.markdown = function (a) {
    return {
        contains: [
            {
                className: "header",
                begin: "^#{1,3}",
                end: "$"
            }, {
                className: "header",
                begin: "^.+?\\n[=-]{2,}$"
            }, {
                begin: "<",
                end: ">",
                subLanguage: "xml",
                relevance: 0
            }, {
                className: "bullet",
                begin: "^([*+-]|(\\d+\\.))\\s+"
            }, {
                className: "strong",
                begin: "[*_]{2}.+?[*_]{2}"
            }, {
                className: "emphasis",
                begin: "\\*.+?\\*"
            }, {
                className: "emphasis",
                begin: "_.+?_",
                relevance: 0
            }, {
                className: "blockquote",
                begin: "^>\\s+",
                end: "$"
            }, {
                className: "code",
                begin: "`.+?`"
            }, {
                className: "code",
                begin: "^    ",
                end: "$",
                relevance: 0
            }, {
                className: "horizontal_rule",
                begin: "^-{3,}",
                end: "$"
            }, {
                begin: "\\[.+?\\]\\(.+?\\)",
                returnBegin: true,
                contains: [
                    {
                        className: "link_label",
                        begin: "\\[.+\\]"
                    }, {
                        className: "link_url",
                        begin: "\\(",
                        end: "\\)",
                        excludeBegin: true,
                        excludeEnd: true
                    }
                ]
            }
        ]
    }
}(hljs);
hljs.LANGUAGES["1c"] = function (b) {
    var f = "[a-zA-Zа-яА-Я][a-zA-Z0-9_а-яА-Я]*";
    var c = "возврат дата для если и или иначе иначеесли исключение конецесли конецпопытки конецпроцедуры конецфункции конеццикла константа не перейти перем перечисление по пока попытка прервать продолжить процедура строка тогда фс функция цикл число экспорт";
    var e = "ansitooem oemtoansi ввестивидсубконто ввестидату ввестизначение ввестиперечисление ввестипериод ввестиплансчетов ввестистроку ввестичисло вопрос восстановитьзначение врег выбранныйплансчетов вызватьисключение датагод датамесяц датачисло добавитьмесяц завершитьработусистемы заголовоксистемы записьжурналарегистрации запуститьприложение зафиксироватьтранзакцию значениевстроку значениевстрокувнутр значениевфайл значениеизстроки значениеизстрокивнутр значениеизфайла имякомпьютера имяпользователя каталогвременныхфайлов каталогиб каталогпользователя каталогпрограммы кодсимв командасистемы конгода конецпериодаби конецрассчитанногопериодаби конецстандартногоинтервала конквартала конмесяца коннедели лев лог лог10 макс максимальноеколичествосубконто мин монопольныйрежим названиеинтерфейса названиенабораправ назначитьвид назначитьсчет найти найтипомеченныенаудаление найтиссылки началопериодаби началостандартногоинтервала начатьтранзакцию начгода начквартала начмесяца начнедели номерднягода номерднянедели номернеделигода нрег обработкаожидания окр описаниеошибки основнойжурналрасчетов основнойплансчетов основнойязык открытьформу открытьформумодально отменитьтранзакцию очиститьокносообщений периодстр полноеимяпользователя получитьвремята получитьдатута получитьдокументта получитьзначенияотбора получитьпозициюта получитьпустоезначение получитьта прав праводоступа предупреждение префиксавтонумерации пустаястрока пустоезначение рабочаядаттьпустоезначение рабочаядата разделительстраниц разделительстрок разм разобратьпозициюдокумента рассчитатьрегистрына рассчитатьрегистрыпо сигнал симв символтабуляции создатьобъект сокрл сокрлп сокрп сообщить состояние сохранитьзначение сред статусвозврата стрдлина стрзаменить стрколичествострок стрполучитьстроку  стрчисловхождений сформироватьпозициюдокумента счетпокоду текущаядата текущеевремя типзначения типзначениястр удалитьобъекты установитьтана установитьтапо фиксшаблон формат цел шаблон";
    var a = {
            className: "dquote",
            begin: '""'
        };
    var d = {
            className: "string",
            begin: '"',
            end: '"|$',
            contains: [a],
            relevance: 0
        };
    var g = {
            className: "string",
            begin: "\\|",
            end: '"|$',
            contains: [a]
        };
    return {
        case_insensitive: true,
        lexems: f,
        keywords: {
            keyword: c,
            built_in: e
        },
        contains: [
            b.C_LINE_COMMENT_MODE, b.NUMBER_MODE, d, g, {
                className: "function",
                begin: "(процедура|функция)",
                end: "$",
                lexems: f,
                keywords: "процедура функция",
                contains: [
                    {
                        className: "title",
                        begin: f
                    }, {
                        className: "tail",
                        endsWithParent: true,
                        contains: [
                            {
                                className: "params",
                                begin: "\\(",
                                end: "\\)",
                                lexems: f,
                                keywords: "знач",
                                contains: [
                                    d, g
                                ]
                            }, {
                                className: "export",
                                begin: "экспорт",
                                endsWithParent: true,
                                lexems: f,
                                keywords: "экспорт",
                                contains: [b.C_LINE_COMMENT_MODE]
                            }
                        ]
                    }, b.C_LINE_COMMENT_MODE
                ]
            }, {
                className: "preprocessor",
                begin: "#",
                end: "$"
            }, {
                className: "date",
                begin: "'\\d{2}\\.\\d{2}\\.(\\d{2}|\\d{4})'"
            }
        ]
    }
}(hljs);
hljs.LANGUAGES.apache = function (a) {
    var b = {
            className: "number",
            begin: "[\\$%]\\d+"
        };
    return {
        case_insensitive: true,
        keywords: {
            keyword: "acceptfilter acceptmutex acceptpathinfo accessfilename action addalt addaltbyencoding addaltbytype addcharset adddefaultcharset adddescription addencoding addhandler addicon addiconbyencoding addiconbytype addinputfilter addlanguage addmoduleinfo addoutputfilter addoutputfilterbytype addtype alias aliasmatch allow allowconnect allowencodedslashes allowoverride anonymous anonymous_logemail anonymous_mustgiveemail anonymous_nouserid anonymous_verifyemail authbasicauthoritative authbasicprovider authdbduserpwquery authdbduserrealmquery authdbmgroupfile authdbmtype authdbmuserfile authdefaultauthoritative authdigestalgorithm authdigestdomain authdigestnccheck authdigestnonceformat authdigestnoncelifetime authdigestprovider authdigestqop authdigestshmemsize authgroupfile authldapbinddn authldapbindpassword authldapcharsetconfig authldapcomparednonserver authldapdereferencealiases authldapgroupattribute authldapgroupattributeisdn authldapremoteuserattribute authldapremoteuserisdn authldapurl authname authnprovideralias authtype authuserfile authzdbmauthoritative authzdbmtype authzdefaultauthoritative authzgroupfileauthoritative authzldapauthoritative authzownerauthoritative authzuserauthoritative balancermember browsermatch browsermatchnocase bufferedlogs cachedefaultexpire cachedirlength cachedirlevels cachedisable cacheenable cachefile cacheignorecachecontrol cacheignoreheaders cacheignorenolastmod cacheignorequerystring cachelastmodifiedfactor cachemaxexpire cachemaxfilesize cacheminfilesize cachenegotiateddocs cacheroot cachestorenostore cachestoreprivate cgimapextension charsetdefault charsetoptions charsetsourceenc checkcaseonly checkspelling chrootdir contentdigest cookiedomain cookieexpires cookielog cookiename cookiestyle cookietracking coredumpdirectory customlog dav davdepthinfinity davgenericlockdb davlockdb davmintimeout dbdexptime dbdkeep dbdmax dbdmin dbdparams dbdpersist dbdpreparesql dbdriver defaulticon defaultlanguage defaulttype deflatebuffersize deflatecompressionlevel deflatefilternote deflatememlevel deflatewindowsize deny directoryindex directorymatch directoryslash documentroot dumpioinput dumpiologlevel dumpiooutput enableexceptionhook enablemmap enablesendfile errordocument errorlog example expiresactive expiresbytype expiresdefault extendedstatus extfilterdefine extfilteroptions fileetag filterchain filterdeclare filterprotocol filterprovider filtertrace forcelanguagepriority forcetype forensiclog gracefulshutdowntimeout group header headername hostnamelookups identitycheck identitychecktimeout imapbase imapdefault imapmenu include indexheadinsert indexignore indexoptions indexorderdefault indexstylesheet isapiappendlogtoerrors isapiappendlogtoquery isapicachefile isapifakeasync isapilognotsupported isapireadaheadbuffer keepalive keepalivetimeout languagepriority ldapcacheentries ldapcachettl ldapconnectiontimeout ldapopcacheentries ldapopcachettl ldapsharedcachefile ldapsharedcachesize ldaptrustedclientcert ldaptrustedglobalcert ldaptrustedmode ldapverifyservercert limitinternalrecursion limitrequestbody limitrequestfields limitrequestfieldsize limitrequestline limitxmlrequestbody listen listenbacklog loadfile loadmodule lockfile logformat loglevel maxclients maxkeepaliverequests maxmemfree maxrequestsperchild maxrequestsperthread maxspareservers maxsparethreads maxthreads mcachemaxobjectcount mcachemaxobjectsize mcachemaxstreamingbuffer mcacheminobjectsize mcacheremovalalgorithm mcachesize metadir metafiles metasuffix mimemagicfile minspareservers minsparethreads mmapfile mod_gzip_on mod_gzip_add_header_count mod_gzip_keep_workfiles mod_gzip_dechunk mod_gzip_min_http mod_gzip_minimum_file_size mod_gzip_maximum_file_size mod_gzip_maximum_inmem_size mod_gzip_temp_dir mod_gzip_item_include mod_gzip_item_exclude mod_gzip_command_version mod_gzip_can_negotiate mod_gzip_handle_methods mod_gzip_static_suffix mod_gzip_send_vary mod_gzip_update_static modmimeusepathinfo multiviewsmatch namevirtualhost noproxy nwssltrustedcerts nwsslupgradeable options order passenv pidfile protocolecho proxybadheader proxyblock proxydomain proxyerroroverride proxyftpdircharset proxyiobuffersize proxymaxforwards proxypass proxypassinterpolateenv proxypassmatch proxypassreverse proxypassreversecookiedomain proxypassreversecookiepath proxypreservehost proxyreceivebuffersize proxyremote proxyremotematch proxyrequests proxyset proxystatus proxytimeout proxyvia readmename receivebuffersize redirect redirectmatch redirectpermanent redirecttemp removecharset removeencoding removehandler removeinputfilter removelanguage removeoutputfilter removetype requestheader require rewritebase rewritecond rewriteengine rewritelock rewritelog rewriteloglevel rewritemap rewriteoptions rewriterule rlimitcpu rlimitmem rlimitnproc satisfy scoreboardfile script scriptalias scriptaliasmatch scriptinterpretersource scriptlog scriptlogbuffer scriptloglength scriptsock securelisten seerequesttail sendbuffersize serveradmin serveralias serverlimit servername serverpath serverroot serversignature servertokens setenv setenvif setenvifnocase sethandler setinputfilter setoutputfilter ssienableaccess ssiendtag ssierrormsg ssistarttag ssitimeformat ssiundefinedecho sslcacertificatefile sslcacertificatepath sslcadnrequestfile sslcadnrequestpath sslcarevocationfile sslcarevocationpath sslcertificatechainfile sslcertificatefile sslcertificatekeyfile sslciphersuite sslcryptodevice sslengine sslhonorciperorder sslmutex ssloptions sslpassphrasedialog sslprotocol sslproxycacertificatefile sslproxycacertificatepath sslproxycarevocationfile sslproxycarevocationpath sslproxyciphersuite sslproxyengine sslproxymachinecertificatefile sslproxymachinecertificatepath sslproxyprotocol sslproxyverify sslproxyverifydepth sslrandomseed sslrequire sslrequiressl sslsessioncache sslsessioncachetimeout sslusername sslverifyclient sslverifydepth startservers startthreads substitute suexecusergroup threadlimit threadsperchild threadstacksize timeout traceenable transferlog typesconfig unsetenv usecanonicalname usecanonicalphysicalport user userdir virtualdocumentroot virtualdocumentrootip virtualscriptalias virtualscriptaliasip win32disableacceptex xbithack",
            literal: "on off"
        },
        contains: [
            a.HASH_COMMENT_MODE, {
                className: "sqbracket",
                begin: "\\s\\[",
                end: "\\]$"
            }, {
                className: "cbracket",
                begin: "[\\$%]\\{",
                end: "\\}",
                contains: [
                    "self", b
                ]
            }, b, {
                className: "tag",
                begin: "</?",
                end: ">"
            }, a.QUOTE_STRING_MODE
        ]
    }
}(hljs);