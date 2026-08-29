import { c as Qe } from "./main-2iJdHqXF.js";
import ht from "fs";
import oc from "constants";
import dr from "stream";
import zi from "util";
import bl from "assert";
import Oe from "path";
import Ur from "child_process";
import Cl from "events";
import hr from "crypto";
import Ol from "tty";
import kr from "os";
import pt from "url";
import St from "electron";
import Pl from "zlib";
import sc from "http";
function ac(n, d) {
  for (var p = 0; p < d.length; p++) {
    const f = d[p];
    if (typeof f != "string" && !Array.isArray(f)) {
      for (const c in f)
        if (c !== "default" && !(c in n)) {
          const l = Object.getOwnPropertyDescriptor(f, c);
          l && Object.defineProperty(n, c, l.get ? l : {
            enumerable: !0,
            get: () => f[c]
          });
        }
    }
  }
  return Object.freeze(Object.defineProperty(n, Symbol.toStringTag, { value: "Module" }));
}
var _t = {}, zr = {}, Rr = {}, Ao;
function Ve() {
  return Ao || (Ao = 1, Rr.fromCallback = function(n) {
    return Object.defineProperty(function(...d) {
      if (typeof d[d.length - 1] == "function") n.apply(this, d);
      else
        return new Promise((p, f) => {
          d.push((c, l) => c != null ? f(c) : p(l)), n.apply(this, d);
        });
    }, "name", { value: n.name });
  }, Rr.fromPromise = function(n) {
    return Object.defineProperty(function(...d) {
      const p = d[d.length - 1];
      if (typeof p != "function") return n.apply(this, d);
      d.pop(), n.apply(this, d).then((f) => p(null, f), p);
    }, "name", { value: n.name });
  }), Rr;
}
var Xr, Ro;
function lc() {
  if (Ro) return Xr;
  Ro = 1;
  var n = oc, d = process.cwd, p = null, f = process.env.GRACEFUL_FS_PLATFORM || process.platform;
  process.cwd = function() {
    return p || (p = d.call(process)), p;
  };
  try {
    process.cwd();
  } catch {
  }
  if (typeof process.chdir == "function") {
    var c = process.chdir;
    process.chdir = function(i) {
      p = null, c.call(process, i);
    }, Object.setPrototypeOf && Object.setPrototypeOf(process.chdir, c);
  }
  Xr = l;
  function l(i) {
    n.hasOwnProperty("O_SYMLINK") && process.version.match(/^v0\.6\.[0-2]|^v0\.5\./) && u(i), i.lutimes || a(i), i.chown = t(i.chown), i.fchown = t(i.fchown), i.lchown = t(i.lchown), i.chmod = s(i.chmod), i.fchmod = s(i.fchmod), i.lchmod = s(i.lchmod), i.chownSync = o(i.chownSync), i.fchownSync = o(i.fchownSync), i.lchownSync = o(i.lchownSync), i.chmodSync = r(i.chmodSync), i.fchmodSync = r(i.fchmodSync), i.lchmodSync = r(i.lchmodSync), i.stat = h(i.stat), i.fstat = h(i.fstat), i.lstat = h(i.lstat), i.statSync = g(i.statSync), i.fstatSync = g(i.fstatSync), i.lstatSync = g(i.lstatSync), i.chmod && !i.lchmod && (i.lchmod = function(m, _, R) {
      R && process.nextTick(R);
    }, i.lchmodSync = function() {
    }), i.chown && !i.lchown && (i.lchown = function(m, _, R, b) {
      b && process.nextTick(b);
    }, i.lchownSync = function() {
    }), f === "win32" && (i.rename = typeof i.rename != "function" ? i.rename : (function(m) {
      function _(R, b, D) {
        var C = Date.now(), N = 0;
        m(R, b, function I(F) {
          if (F && (F.code === "EACCES" || F.code === "EPERM" || F.code === "EBUSY") && Date.now() - C < 6e4) {
            setTimeout(function() {
              i.stat(b, function(B, S) {
                B && B.code === "ENOENT" ? m(R, b, I) : D(F);
              });
            }, N), N < 100 && (N += 10);
            return;
          }
          D && D(F);
        });
      }
      return Object.setPrototypeOf && Object.setPrototypeOf(_, m), _;
    })(i.rename)), i.read = typeof i.read != "function" ? i.read : (function(m) {
      function _(R, b, D, C, N, I) {
        var F;
        if (I && typeof I == "function") {
          var B = 0;
          F = function(S, Y, H) {
            if (S && S.code === "EAGAIN" && B < 10)
              return B++, m.call(i, R, b, D, C, N, F);
            I.apply(this, arguments);
          };
        }
        return m.call(i, R, b, D, C, N, F);
      }
      return Object.setPrototypeOf && Object.setPrototypeOf(_, m), _;
    })(i.read), i.readSync = typeof i.readSync != "function" ? i.readSync : /* @__PURE__ */ (function(m) {
      return function(_, R, b, D, C) {
        for (var N = 0; ; )
          try {
            return m.call(i, _, R, b, D, C);
          } catch (I) {
            if (I.code === "EAGAIN" && N < 10) {
              N++;
              continue;
            }
            throw I;
          }
      };
    })(i.readSync);
    function u(m) {
      m.lchmod = function(_, R, b) {
        m.open(
          _,
          n.O_WRONLY | n.O_SYMLINK,
          R,
          function(D, C) {
            if (D) {
              b && b(D);
              return;
            }
            m.fchmod(C, R, function(N) {
              m.close(C, function(I) {
                b && b(N || I);
              });
            });
          }
        );
      }, m.lchmodSync = function(_, R) {
        var b = m.openSync(_, n.O_WRONLY | n.O_SYMLINK, R), D = !0, C;
        try {
          C = m.fchmodSync(b, R), D = !1;
        } finally {
          if (D)
            try {
              m.closeSync(b);
            } catch {
            }
          else
            m.closeSync(b);
        }
        return C;
      };
    }
    function a(m) {
      n.hasOwnProperty("O_SYMLINK") && m.futimes ? (m.lutimes = function(_, R, b, D) {
        m.open(_, n.O_SYMLINK, function(C, N) {
          if (C) {
            D && D(C);
            return;
          }
          m.futimes(N, R, b, function(I) {
            m.close(N, function(F) {
              D && D(I || F);
            });
          });
        });
      }, m.lutimesSync = function(_, R, b) {
        var D = m.openSync(_, n.O_SYMLINK), C, N = !0;
        try {
          C = m.futimesSync(D, R, b), N = !1;
        } finally {
          if (N)
            try {
              m.closeSync(D);
            } catch {
            }
          else
            m.closeSync(D);
        }
        return C;
      }) : m.futimes && (m.lutimes = function(_, R, b, D) {
        D && process.nextTick(D);
      }, m.lutimesSync = function() {
      });
    }
    function s(m) {
      return m && function(_, R, b) {
        return m.call(i, _, R, function(D) {
          y(D) && (D = null), b && b.apply(this, arguments);
        });
      };
    }
    function r(m) {
      return m && function(_, R) {
        try {
          return m.call(i, _, R);
        } catch (b) {
          if (!y(b)) throw b;
        }
      };
    }
    function t(m) {
      return m && function(_, R, b, D) {
        return m.call(i, _, R, b, function(C) {
          y(C) && (C = null), D && D.apply(this, arguments);
        });
      };
    }
    function o(m) {
      return m && function(_, R, b) {
        try {
          return m.call(i, _, R, b);
        } catch (D) {
          if (!y(D)) throw D;
        }
      };
    }
    function h(m) {
      return m && function(_, R, b) {
        typeof R == "function" && (b = R, R = null);
        function D(C, N) {
          N && (N.uid < 0 && (N.uid += 4294967296), N.gid < 0 && (N.gid += 4294967296)), b && b.apply(this, arguments);
        }
        return R ? m.call(i, _, R, D) : m.call(i, _, D);
      };
    }
    function g(m) {
      return m && function(_, R) {
        var b = R ? m.call(i, _, R) : m.call(i, _);
        return b && (b.uid < 0 && (b.uid += 4294967296), b.gid < 0 && (b.gid += 4294967296)), b;
      };
    }
    function y(m) {
      if (!m || m.code === "ENOSYS")
        return !0;
      var _ = !process.getuid || process.getuid() !== 0;
      return !!(_ && (m.code === "EINVAL" || m.code === "EPERM"));
    }
  }
  return Xr;
}
var Kr, To;
function uc() {
  if (To) return Kr;
  To = 1;
  var n = dr.Stream;
  Kr = d;
  function d(p) {
    return {
      ReadStream: f,
      WriteStream: c
    };
    function f(l, i) {
      if (!(this instanceof f)) return new f(l, i);
      n.call(this);
      var u = this;
      this.path = l, this.fd = null, this.readable = !0, this.paused = !1, this.flags = "r", this.mode = 438, this.bufferSize = 64 * 1024, i = i || {};
      for (var a = Object.keys(i), s = 0, r = a.length; s < r; s++) {
        var t = a[s];
        this[t] = i[t];
      }
      if (this.encoding && this.setEncoding(this.encoding), this.start !== void 0) {
        if (typeof this.start != "number")
          throw TypeError("start must be a Number");
        if (this.end === void 0)
          this.end = 1 / 0;
        else if (typeof this.end != "number")
          throw TypeError("end must be a Number");
        if (this.start > this.end)
          throw new Error("start must be <= end");
        this.pos = this.start;
      }
      if (this.fd !== null) {
        process.nextTick(function() {
          u._read();
        });
        return;
      }
      p.open(this.path, this.flags, this.mode, function(o, h) {
        if (o) {
          u.emit("error", o), u.readable = !1;
          return;
        }
        u.fd = h, u.emit("open", h), u._read();
      });
    }
    function c(l, i) {
      if (!(this instanceof c)) return new c(l, i);
      n.call(this), this.path = l, this.fd = null, this.writable = !0, this.flags = "w", this.encoding = "binary", this.mode = 438, this.bytesWritten = 0, i = i || {};
      for (var u = Object.keys(i), a = 0, s = u.length; a < s; a++) {
        var r = u[a];
        this[r] = i[r];
      }
      if (this.start !== void 0) {
        if (typeof this.start != "number")
          throw TypeError("start must be a Number");
        if (this.start < 0)
          throw new Error("start must be >= zero");
        this.pos = this.start;
      }
      this.busy = !1, this._queue = [], this.fd === null && (this._open = p.open, this._queue.push([this._open, this.path, this.flags, this.mode, void 0]), this.flush());
    }
  }
  return Kr;
}
var Jr, So;
function cc() {
  if (So) return Jr;
  So = 1, Jr = d;
  var n = Object.getPrototypeOf || function(p) {
    return p.__proto__;
  };
  function d(p) {
    if (p === null || typeof p != "object")
      return p;
    if (p instanceof Object)
      var f = { __proto__: n(p) };
    else
      var f = /* @__PURE__ */ Object.create(null);
    return Object.getOwnPropertyNames(p).forEach(function(c) {
      Object.defineProperty(f, c, Object.getOwnPropertyDescriptor(p, c));
    }), f;
  }
  return Jr;
}
var Tr, bo;
function He() {
  if (bo) return Tr;
  bo = 1;
  var n = ht, d = lc(), p = uc(), f = cc(), c = zi, l, i;
  typeof Symbol == "function" && typeof Symbol.for == "function" ? (l = /* @__PURE__ */ Symbol.for("graceful-fs.queue"), i = /* @__PURE__ */ Symbol.for("graceful-fs.previous")) : (l = "___graceful-fs.queue", i = "___graceful-fs.previous");
  function u() {
  }
  function a(m, _) {
    Object.defineProperty(m, l, {
      get: function() {
        return _;
      }
    });
  }
  var s = u;
  if (c.debuglog ? s = c.debuglog("gfs4") : /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") && (s = function() {
    var m = c.format.apply(c, arguments);
    m = "GFS4: " + m.split(/\n/).join(`
GFS4: `), console.error(m);
  }), !n[l]) {
    var r = Qe[l] || [];
    a(n, r), n.close = (function(m) {
      function _(R, b) {
        return m.call(n, R, function(D) {
          D || g(), typeof b == "function" && b.apply(this, arguments);
        });
      }
      return Object.defineProperty(_, i, {
        value: m
      }), _;
    })(n.close), n.closeSync = (function(m) {
      function _(R) {
        m.apply(n, arguments), g();
      }
      return Object.defineProperty(_, i, {
        value: m
      }), _;
    })(n.closeSync), /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") && process.on("exit", function() {
      s(n[l]), bl.equal(n[l].length, 0);
    });
  }
  Qe[l] || a(Qe, n[l]), Tr = t(f(n)), process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH && !n.__patched && (Tr = t(n), n.__patched = !0);
  function t(m) {
    d(m), m.gracefulify = t, m.createReadStream = oe, m.createWriteStream = Z;
    var _ = m.readFile;
    m.readFile = R;
    function R(K, ue, he) {
      return typeof ue == "function" && (he = ue, ue = null), me(K, ue, he);
      function me(pe, _e, ve, Ae) {
        return _(pe, _e, function(v) {
          v && (v.code === "EMFILE" || v.code === "ENFILE") ? o([me, [pe, _e, ve], v, Ae || Date.now(), Date.now()]) : typeof ve == "function" && ve.apply(this, arguments);
        });
      }
    }
    var b = m.writeFile;
    m.writeFile = D;
    function D(K, ue, he, me) {
      return typeof he == "function" && (me = he, he = null), pe(K, ue, he, me);
      function pe(_e, ve, Ae, v, E) {
        return b(_e, ve, Ae, function($) {
          $ && ($.code === "EMFILE" || $.code === "ENFILE") ? o([pe, [_e, ve, Ae, v], $, E || Date.now(), Date.now()]) : typeof v == "function" && v.apply(this, arguments);
        });
      }
    }
    var C = m.appendFile;
    C && (m.appendFile = N);
    function N(K, ue, he, me) {
      return typeof he == "function" && (me = he, he = null), pe(K, ue, he, me);
      function pe(_e, ve, Ae, v, E) {
        return C(_e, ve, Ae, function($) {
          $ && ($.code === "EMFILE" || $.code === "ENFILE") ? o([pe, [_e, ve, Ae, v], $, E || Date.now(), Date.now()]) : typeof v == "function" && v.apply(this, arguments);
        });
      }
    }
    var I = m.copyFile;
    I && (m.copyFile = F);
    function F(K, ue, he, me) {
      return typeof he == "function" && (me = he, he = 0), pe(K, ue, he, me);
      function pe(_e, ve, Ae, v, E) {
        return I(_e, ve, Ae, function($) {
          $ && ($.code === "EMFILE" || $.code === "ENFILE") ? o([pe, [_e, ve, Ae, v], $, E || Date.now(), Date.now()]) : typeof v == "function" && v.apply(this, arguments);
        });
      }
    }
    var B = m.readdir;
    m.readdir = Y;
    var S = /^v[0-5]\./;
    function Y(K, ue, he) {
      typeof ue == "function" && (he = ue, ue = null);
      var me = S.test(process.version) ? function(ve, Ae, v, E) {
        return B(ve, pe(
          ve,
          Ae,
          v,
          E
        ));
      } : function(ve, Ae, v, E) {
        return B(ve, Ae, pe(
          ve,
          Ae,
          v,
          E
        ));
      };
      return me(K, ue, he);
      function pe(_e, ve, Ae, v) {
        return function(E, $) {
          E && (E.code === "EMFILE" || E.code === "ENFILE") ? o([
            me,
            [_e, ve, Ae],
            E,
            v || Date.now(),
            Date.now()
          ]) : ($ && $.sort && $.sort(), typeof Ae == "function" && Ae.call(this, E, $));
        };
      }
    }
    if (process.version.substr(0, 4) === "v0.8") {
      var H = p(m);
      P = H.ReadStream, j = H.WriteStream;
    }
    var V = m.ReadStream;
    V && (P.prototype = Object.create(V.prototype), P.prototype.open = k);
    var L = m.WriteStream;
    L && (j.prototype = Object.create(L.prototype), j.prototype.open = X), Object.defineProperty(m, "ReadStream", {
      get: function() {
        return P;
      },
      set: function(K) {
        P = K;
      },
      enumerable: !0,
      configurable: !0
    }), Object.defineProperty(m, "WriteStream", {
      get: function() {
        return j;
      },
      set: function(K) {
        j = K;
      },
      enumerable: !0,
      configurable: !0
    });
    var O = P;
    Object.defineProperty(m, "FileReadStream", {
      get: function() {
        return O;
      },
      set: function(K) {
        O = K;
      },
      enumerable: !0,
      configurable: !0
    });
    var A = j;
    Object.defineProperty(m, "FileWriteStream", {
      get: function() {
        return A;
      },
      set: function(K) {
        A = K;
      },
      enumerable: !0,
      configurable: !0
    });
    function P(K, ue) {
      return this instanceof P ? (V.apply(this, arguments), this) : P.apply(Object.create(P.prototype), arguments);
    }
    function k() {
      var K = this;
      ye(K.path, K.flags, K.mode, function(ue, he) {
        ue ? (K.autoClose && K.destroy(), K.emit("error", ue)) : (K.fd = he, K.emit("open", he), K.read());
      });
    }
    function j(K, ue) {
      return this instanceof j ? (L.apply(this, arguments), this) : j.apply(Object.create(j.prototype), arguments);
    }
    function X() {
      var K = this;
      ye(K.path, K.flags, K.mode, function(ue, he) {
        ue ? (K.destroy(), K.emit("error", ue)) : (K.fd = he, K.emit("open", he));
      });
    }
    function oe(K, ue) {
      return new m.ReadStream(K, ue);
    }
    function Z(K, ue) {
      return new m.WriteStream(K, ue);
    }
    var de = m.open;
    m.open = ye;
    function ye(K, ue, he, me) {
      return typeof he == "function" && (me = he, he = null), pe(K, ue, he, me);
      function pe(_e, ve, Ae, v, E) {
        return de(_e, ve, Ae, function($, x) {
          $ && ($.code === "EMFILE" || $.code === "ENFILE") ? o([pe, [_e, ve, Ae, v], $, E || Date.now(), Date.now()]) : typeof v == "function" && v.apply(this, arguments);
        });
      }
    }
    return m;
  }
  function o(m) {
    s("ENQUEUE", m[0].name, m[1]), n[l].push(m), y();
  }
  var h;
  function g() {
    for (var m = Date.now(), _ = 0; _ < n[l].length; ++_)
      n[l][_].length > 2 && (n[l][_][3] = m, n[l][_][4] = m);
    y();
  }
  function y() {
    if (clearTimeout(h), h = void 0, n[l].length !== 0) {
      var m = n[l].shift(), _ = m[0], R = m[1], b = m[2], D = m[3], C = m[4];
      if (D === void 0)
        s("RETRY", _.name, R), _.apply(null, R);
      else if (Date.now() - D >= 6e4) {
        s("TIMEOUT", _.name, R);
        var N = R.pop();
        typeof N == "function" && N.call(null, b);
      } else {
        var I = Date.now() - C, F = Math.max(C - D, 1), B = Math.min(F * 1.2, 100);
        I >= B ? (s("RETRY", _.name, R), _.apply(null, R.concat([D]))) : n[l].push(m);
      }
      h === void 0 && (h = setTimeout(y, 0));
    }
  }
  return Tr;
}
var Co;
function kt() {
  return Co || (Co = 1, (function(n) {
    const d = Ve().fromCallback, p = He(), f = [
      "access",
      "appendFile",
      "chmod",
      "chown",
      "close",
      "copyFile",
      "fchmod",
      "fchown",
      "fdatasync",
      "fstat",
      "fsync",
      "ftruncate",
      "futimes",
      "lchmod",
      "lchown",
      "link",
      "lstat",
      "mkdir",
      "mkdtemp",
      "open",
      "opendir",
      "readdir",
      "readFile",
      "readlink",
      "realpath",
      "rename",
      "rm",
      "rmdir",
      "stat",
      "symlink",
      "truncate",
      "unlink",
      "utimes",
      "writeFile"
    ].filter((c) => typeof p[c] == "function");
    Object.assign(n, p), f.forEach((c) => {
      n[c] = d(p[c]);
    }), n.exists = function(c, l) {
      return typeof l == "function" ? p.exists(c, l) : new Promise((i) => p.exists(c, i));
    }, n.read = function(c, l, i, u, a, s) {
      return typeof s == "function" ? p.read(c, l, i, u, a, s) : new Promise((r, t) => {
        p.read(c, l, i, u, a, (o, h, g) => {
          if (o) return t(o);
          r({ bytesRead: h, buffer: g });
        });
      });
    }, n.write = function(c, l, ...i) {
      return typeof i[i.length - 1] == "function" ? p.write(c, l, ...i) : new Promise((u, a) => {
        p.write(c, l, ...i, (s, r, t) => {
          if (s) return a(s);
          u({ bytesWritten: r, buffer: t });
        });
      });
    }, typeof p.writev == "function" && (n.writev = function(c, l, ...i) {
      return typeof i[i.length - 1] == "function" ? p.writev(c, l, ...i) : new Promise((u, a) => {
        p.writev(c, l, ...i, (s, r, t) => {
          if (s) return a(s);
          u({ bytesWritten: r, buffers: t });
        });
      });
    }), typeof p.realpath.native == "function" ? n.realpath.native = d(p.realpath.native) : process.emitWarning(
      "fs.realpath.native is not a function. Is fs being monkey-patched?",
      "Warning",
      "fs-extra-WARN0003"
    );
  })(zr)), zr;
}
var Sr = {}, Qr = {}, Oo;
function fc() {
  if (Oo) return Qr;
  Oo = 1;
  const n = Oe;
  return Qr.checkPath = function(p) {
    if (process.platform === "win32" && /[<>:"|?*]/.test(p.replace(n.parse(p).root, ""))) {
      const c = new Error(`Path contains invalid characters: ${p}`);
      throw c.code = "EINVAL", c;
    }
  }, Qr;
}
var Po;
function dc() {
  if (Po) return Sr;
  Po = 1;
  const n = /* @__PURE__ */ kt(), { checkPath: d } = /* @__PURE__ */ fc(), p = (f) => {
    const c = { mode: 511 };
    return typeof f == "number" ? f : { ...c, ...f }.mode;
  };
  return Sr.makeDir = async (f, c) => (d(f), n.mkdir(f, {
    mode: p(c),
    recursive: !0
  })), Sr.makeDirSync = (f, c) => (d(f), n.mkdirSync(f, {
    mode: p(c),
    recursive: !0
  })), Sr;
}
var Zr, Io;
function tt() {
  if (Io) return Zr;
  Io = 1;
  const n = Ve().fromPromise, { makeDir: d, makeDirSync: p } = /* @__PURE__ */ dc(), f = n(d);
  return Zr = {
    mkdirs: f,
    mkdirsSync: p,
    // alias
    mkdirp: f,
    mkdirpSync: p,
    ensureDir: f,
    ensureDirSync: p
  }, Zr;
}
var en, Do;
function bt() {
  if (Do) return en;
  Do = 1;
  const n = Ve().fromPromise, d = /* @__PURE__ */ kt();
  function p(f) {
    return d.access(f).then(() => !0).catch(() => !1);
  }
  return en = {
    pathExists: n(p),
    pathExistsSync: d.existsSync
  }, en;
}
var tn, No;
function Il() {
  if (No) return tn;
  No = 1;
  const n = He();
  function d(f, c, l, i) {
    n.open(f, "r+", (u, a) => {
      if (u) return i(u);
      n.futimes(a, c, l, (s) => {
        n.close(a, (r) => {
          i && i(s || r);
        });
      });
    });
  }
  function p(f, c, l) {
    const i = n.openSync(f, "r+");
    return n.futimesSync(i, c, l), n.closeSync(i);
  }
  return tn = {
    utimesMillis: d,
    utimesMillisSync: p
  }, tn;
}
var rn, Fo;
function qt() {
  if (Fo) return rn;
  Fo = 1;
  const n = /* @__PURE__ */ kt(), d = Oe, p = zi;
  function f(o, h, g) {
    const y = g.dereference ? (m) => n.stat(m, { bigint: !0 }) : (m) => n.lstat(m, { bigint: !0 });
    return Promise.all([
      y(o),
      y(h).catch((m) => {
        if (m.code === "ENOENT") return null;
        throw m;
      })
    ]).then(([m, _]) => ({ srcStat: m, destStat: _ }));
  }
  function c(o, h, g) {
    let y;
    const m = g.dereference ? (R) => n.statSync(R, { bigint: !0 }) : (R) => n.lstatSync(R, { bigint: !0 }), _ = m(o);
    try {
      y = m(h);
    } catch (R) {
      if (R.code === "ENOENT") return { srcStat: _, destStat: null };
      throw R;
    }
    return { srcStat: _, destStat: y };
  }
  function l(o, h, g, y, m) {
    p.callbackify(f)(o, h, y, (_, R) => {
      if (_) return m(_);
      const { srcStat: b, destStat: D } = R;
      if (D) {
        if (s(b, D)) {
          const C = d.basename(o), N = d.basename(h);
          return g === "move" && C !== N && C.toLowerCase() === N.toLowerCase() ? m(null, { srcStat: b, destStat: D, isChangingCase: !0 }) : m(new Error("Source and destination must not be the same."));
        }
        if (b.isDirectory() && !D.isDirectory())
          return m(new Error(`Cannot overwrite non-directory '${h}' with directory '${o}'.`));
        if (!b.isDirectory() && D.isDirectory())
          return m(new Error(`Cannot overwrite directory '${h}' with non-directory '${o}'.`));
      }
      return b.isDirectory() && r(o, h) ? m(new Error(t(o, h, g))) : m(null, { srcStat: b, destStat: D });
    });
  }
  function i(o, h, g, y) {
    const { srcStat: m, destStat: _ } = c(o, h, y);
    if (_) {
      if (s(m, _)) {
        const R = d.basename(o), b = d.basename(h);
        if (g === "move" && R !== b && R.toLowerCase() === b.toLowerCase())
          return { srcStat: m, destStat: _, isChangingCase: !0 };
        throw new Error("Source and destination must not be the same.");
      }
      if (m.isDirectory() && !_.isDirectory())
        throw new Error(`Cannot overwrite non-directory '${h}' with directory '${o}'.`);
      if (!m.isDirectory() && _.isDirectory())
        throw new Error(`Cannot overwrite directory '${h}' with non-directory '${o}'.`);
    }
    if (m.isDirectory() && r(o, h))
      throw new Error(t(o, h, g));
    return { srcStat: m, destStat: _ };
  }
  function u(o, h, g, y, m) {
    const _ = d.resolve(d.dirname(o)), R = d.resolve(d.dirname(g));
    if (R === _ || R === d.parse(R).root) return m();
    n.stat(R, { bigint: !0 }, (b, D) => b ? b.code === "ENOENT" ? m() : m(b) : s(h, D) ? m(new Error(t(o, g, y))) : u(o, h, R, y, m));
  }
  function a(o, h, g, y) {
    const m = d.resolve(d.dirname(o)), _ = d.resolve(d.dirname(g));
    if (_ === m || _ === d.parse(_).root) return;
    let R;
    try {
      R = n.statSync(_, { bigint: !0 });
    } catch (b) {
      if (b.code === "ENOENT") return;
      throw b;
    }
    if (s(h, R))
      throw new Error(t(o, g, y));
    return a(o, h, _, y);
  }
  function s(o, h) {
    return h.ino && h.dev && h.ino === o.ino && h.dev === o.dev;
  }
  function r(o, h) {
    const g = d.resolve(o).split(d.sep).filter((m) => m), y = d.resolve(h).split(d.sep).filter((m) => m);
    return g.reduce((m, _, R) => m && y[R] === _, !0);
  }
  function t(o, h, g) {
    return `Cannot ${g} '${o}' to a subdirectory of itself, '${h}'.`;
  }
  return rn = {
    checkPaths: l,
    checkPathsSync: i,
    checkParentPaths: u,
    checkParentPathsSync: a,
    isSrcSubdir: r,
    areIdentical: s
  }, rn;
}
var nn, xo;
function hc() {
  if (xo) return nn;
  xo = 1;
  const n = He(), d = Oe, p = tt().mkdirs, f = bt().pathExists, c = Il().utimesMillis, l = /* @__PURE__ */ qt();
  function i(Y, H, V, L) {
    typeof V == "function" && !L ? (L = V, V = {}) : typeof V == "function" && (V = { filter: V }), L = L || function() {
    }, V = V || {}, V.clobber = "clobber" in V ? !!V.clobber : !0, V.overwrite = "overwrite" in V ? !!V.overwrite : V.clobber, V.preserveTimestamps && process.arch === "ia32" && process.emitWarning(
      `Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,
      "Warning",
      "fs-extra-WARN0001"
    ), l.checkPaths(Y, H, "copy", V, (O, A) => {
      if (O) return L(O);
      const { srcStat: P, destStat: k } = A;
      l.checkParentPaths(Y, P, H, "copy", (j) => j ? L(j) : V.filter ? a(u, k, Y, H, V, L) : u(k, Y, H, V, L));
    });
  }
  function u(Y, H, V, L, O) {
    const A = d.dirname(V);
    f(A, (P, k) => {
      if (P) return O(P);
      if (k) return r(Y, H, V, L, O);
      p(A, (j) => j ? O(j) : r(Y, H, V, L, O));
    });
  }
  function a(Y, H, V, L, O, A) {
    Promise.resolve(O.filter(V, L)).then((P) => P ? Y(H, V, L, O, A) : A(), (P) => A(P));
  }
  function s(Y, H, V, L, O) {
    return L.filter ? a(r, Y, H, V, L, O) : r(Y, H, V, L, O);
  }
  function r(Y, H, V, L, O) {
    (L.dereference ? n.stat : n.lstat)(H, (P, k) => P ? O(P) : k.isDirectory() ? D(k, Y, H, V, L, O) : k.isFile() || k.isCharacterDevice() || k.isBlockDevice() ? t(k, Y, H, V, L, O) : k.isSymbolicLink() ? B(Y, H, V, L, O) : k.isSocket() ? O(new Error(`Cannot copy a socket file: ${H}`)) : k.isFIFO() ? O(new Error(`Cannot copy a FIFO pipe: ${H}`)) : O(new Error(`Unknown file: ${H}`)));
  }
  function t(Y, H, V, L, O, A) {
    return H ? o(Y, V, L, O, A) : h(Y, V, L, O, A);
  }
  function o(Y, H, V, L, O) {
    if (L.overwrite)
      n.unlink(V, (A) => A ? O(A) : h(Y, H, V, L, O));
    else return L.errorOnExist ? O(new Error(`'${V}' already exists`)) : O();
  }
  function h(Y, H, V, L, O) {
    n.copyFile(H, V, (A) => A ? O(A) : L.preserveTimestamps ? g(Y.mode, H, V, O) : R(V, Y.mode, O));
  }
  function g(Y, H, V, L) {
    return y(Y) ? m(V, Y, (O) => O ? L(O) : _(Y, H, V, L)) : _(Y, H, V, L);
  }
  function y(Y) {
    return (Y & 128) === 0;
  }
  function m(Y, H, V) {
    return R(Y, H | 128, V);
  }
  function _(Y, H, V, L) {
    b(H, V, (O) => O ? L(O) : R(V, Y, L));
  }
  function R(Y, H, V) {
    return n.chmod(Y, H, V);
  }
  function b(Y, H, V) {
    n.stat(Y, (L, O) => L ? V(L) : c(H, O.atime, O.mtime, V));
  }
  function D(Y, H, V, L, O, A) {
    return H ? N(V, L, O, A) : C(Y.mode, V, L, O, A);
  }
  function C(Y, H, V, L, O) {
    n.mkdir(V, (A) => {
      if (A) return O(A);
      N(H, V, L, (P) => P ? O(P) : R(V, Y, O));
    });
  }
  function N(Y, H, V, L) {
    n.readdir(Y, (O, A) => O ? L(O) : I(A, Y, H, V, L));
  }
  function I(Y, H, V, L, O) {
    const A = Y.pop();
    return A ? F(Y, A, H, V, L, O) : O();
  }
  function F(Y, H, V, L, O, A) {
    const P = d.join(V, H), k = d.join(L, H);
    l.checkPaths(P, k, "copy", O, (j, X) => {
      if (j) return A(j);
      const { destStat: oe } = X;
      s(oe, P, k, O, (Z) => Z ? A(Z) : I(Y, V, L, O, A));
    });
  }
  function B(Y, H, V, L, O) {
    n.readlink(H, (A, P) => {
      if (A) return O(A);
      if (L.dereference && (P = d.resolve(process.cwd(), P)), Y)
        n.readlink(V, (k, j) => k ? k.code === "EINVAL" || k.code === "UNKNOWN" ? n.symlink(P, V, O) : O(k) : (L.dereference && (j = d.resolve(process.cwd(), j)), l.isSrcSubdir(P, j) ? O(new Error(`Cannot copy '${P}' to a subdirectory of itself, '${j}'.`)) : Y.isDirectory() && l.isSrcSubdir(j, P) ? O(new Error(`Cannot overwrite '${j}' with '${P}'.`)) : S(P, V, O)));
      else
        return n.symlink(P, V, O);
    });
  }
  function S(Y, H, V) {
    n.unlink(H, (L) => L ? V(L) : n.symlink(Y, H, V));
  }
  return nn = i, nn;
}
var on, Lo;
function pc() {
  if (Lo) return on;
  Lo = 1;
  const n = He(), d = Oe, p = tt().mkdirsSync, f = Il().utimesMillisSync, c = /* @__PURE__ */ qt();
  function l(I, F, B) {
    typeof B == "function" && (B = { filter: B }), B = B || {}, B.clobber = "clobber" in B ? !!B.clobber : !0, B.overwrite = "overwrite" in B ? !!B.overwrite : B.clobber, B.preserveTimestamps && process.arch === "ia32" && process.emitWarning(
      `Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,
      "Warning",
      "fs-extra-WARN0002"
    );
    const { srcStat: S, destStat: Y } = c.checkPathsSync(I, F, "copy", B);
    return c.checkParentPathsSync(I, S, F, "copy"), i(Y, I, F, B);
  }
  function i(I, F, B, S) {
    if (S.filter && !S.filter(F, B)) return;
    const Y = d.dirname(B);
    return n.existsSync(Y) || p(Y), a(I, F, B, S);
  }
  function u(I, F, B, S) {
    if (!(S.filter && !S.filter(F, B)))
      return a(I, F, B, S);
  }
  function a(I, F, B, S) {
    const H = (S.dereference ? n.statSync : n.lstatSync)(F);
    if (H.isDirectory()) return _(H, I, F, B, S);
    if (H.isFile() || H.isCharacterDevice() || H.isBlockDevice()) return s(H, I, F, B, S);
    if (H.isSymbolicLink()) return C(I, F, B, S);
    throw H.isSocket() ? new Error(`Cannot copy a socket file: ${F}`) : H.isFIFO() ? new Error(`Cannot copy a FIFO pipe: ${F}`) : new Error(`Unknown file: ${F}`);
  }
  function s(I, F, B, S, Y) {
    return F ? r(I, B, S, Y) : t(I, B, S, Y);
  }
  function r(I, F, B, S) {
    if (S.overwrite)
      return n.unlinkSync(B), t(I, F, B, S);
    if (S.errorOnExist)
      throw new Error(`'${B}' already exists`);
  }
  function t(I, F, B, S) {
    return n.copyFileSync(F, B), S.preserveTimestamps && o(I.mode, F, B), y(B, I.mode);
  }
  function o(I, F, B) {
    return h(I) && g(B, I), m(F, B);
  }
  function h(I) {
    return (I & 128) === 0;
  }
  function g(I, F) {
    return y(I, F | 128);
  }
  function y(I, F) {
    return n.chmodSync(I, F);
  }
  function m(I, F) {
    const B = n.statSync(I);
    return f(F, B.atime, B.mtime);
  }
  function _(I, F, B, S, Y) {
    return F ? b(B, S, Y) : R(I.mode, B, S, Y);
  }
  function R(I, F, B, S) {
    return n.mkdirSync(B), b(F, B, S), y(B, I);
  }
  function b(I, F, B) {
    n.readdirSync(I).forEach((S) => D(S, I, F, B));
  }
  function D(I, F, B, S) {
    const Y = d.join(F, I), H = d.join(B, I), { destStat: V } = c.checkPathsSync(Y, H, "copy", S);
    return u(V, Y, H, S);
  }
  function C(I, F, B, S) {
    let Y = n.readlinkSync(F);
    if (S.dereference && (Y = d.resolve(process.cwd(), Y)), I) {
      let H;
      try {
        H = n.readlinkSync(B);
      } catch (V) {
        if (V.code === "EINVAL" || V.code === "UNKNOWN") return n.symlinkSync(Y, B);
        throw V;
      }
      if (S.dereference && (H = d.resolve(process.cwd(), H)), c.isSrcSubdir(Y, H))
        throw new Error(`Cannot copy '${Y}' to a subdirectory of itself, '${H}'.`);
      if (n.statSync(B).isDirectory() && c.isSrcSubdir(H, Y))
        throw new Error(`Cannot overwrite '${H}' with '${Y}'.`);
      return N(Y, B);
    } else
      return n.symlinkSync(Y, B);
  }
  function N(I, F) {
    return n.unlinkSync(F), n.symlinkSync(I, F);
  }
  return on = l, on;
}
var sn, Uo;
function Xi() {
  if (Uo) return sn;
  Uo = 1;
  const n = Ve().fromCallback;
  return sn = {
    copy: n(/* @__PURE__ */ hc()),
    copySync: /* @__PURE__ */ pc()
  }, sn;
}
var an, ko;
function mc() {
  if (ko) return an;
  ko = 1;
  const n = He(), d = Oe, p = bl, f = process.platform === "win32";
  function c(g) {
    [
      "unlink",
      "chmod",
      "stat",
      "lstat",
      "rmdir",
      "readdir"
    ].forEach((m) => {
      g[m] = g[m] || n[m], m = m + "Sync", g[m] = g[m] || n[m];
    }), g.maxBusyTries = g.maxBusyTries || 3;
  }
  function l(g, y, m) {
    let _ = 0;
    typeof y == "function" && (m = y, y = {}), p(g, "rimraf: missing path"), p.strictEqual(typeof g, "string", "rimraf: path should be a string"), p.strictEqual(typeof m, "function", "rimraf: callback function required"), p(y, "rimraf: invalid options argument provided"), p.strictEqual(typeof y, "object", "rimraf: options should be object"), c(y), i(g, y, function R(b) {
      if (b) {
        if ((b.code === "EBUSY" || b.code === "ENOTEMPTY" || b.code === "EPERM") && _ < y.maxBusyTries) {
          _++;
          const D = _ * 100;
          return setTimeout(() => i(g, y, R), D);
        }
        b.code === "ENOENT" && (b = null);
      }
      m(b);
    });
  }
  function i(g, y, m) {
    p(g), p(y), p(typeof m == "function"), y.lstat(g, (_, R) => {
      if (_ && _.code === "ENOENT")
        return m(null);
      if (_ && _.code === "EPERM" && f)
        return u(g, y, _, m);
      if (R && R.isDirectory())
        return s(g, y, _, m);
      y.unlink(g, (b) => {
        if (b) {
          if (b.code === "ENOENT")
            return m(null);
          if (b.code === "EPERM")
            return f ? u(g, y, b, m) : s(g, y, b, m);
          if (b.code === "EISDIR")
            return s(g, y, b, m);
        }
        return m(b);
      });
    });
  }
  function u(g, y, m, _) {
    p(g), p(y), p(typeof _ == "function"), y.chmod(g, 438, (R) => {
      R ? _(R.code === "ENOENT" ? null : m) : y.stat(g, (b, D) => {
        b ? _(b.code === "ENOENT" ? null : m) : D.isDirectory() ? s(g, y, m, _) : y.unlink(g, _);
      });
    });
  }
  function a(g, y, m) {
    let _;
    p(g), p(y);
    try {
      y.chmodSync(g, 438);
    } catch (R) {
      if (R.code === "ENOENT")
        return;
      throw m;
    }
    try {
      _ = y.statSync(g);
    } catch (R) {
      if (R.code === "ENOENT")
        return;
      throw m;
    }
    _.isDirectory() ? o(g, y, m) : y.unlinkSync(g);
  }
  function s(g, y, m, _) {
    p(g), p(y), p(typeof _ == "function"), y.rmdir(g, (R) => {
      R && (R.code === "ENOTEMPTY" || R.code === "EEXIST" || R.code === "EPERM") ? r(g, y, _) : R && R.code === "ENOTDIR" ? _(m) : _(R);
    });
  }
  function r(g, y, m) {
    p(g), p(y), p(typeof m == "function"), y.readdir(g, (_, R) => {
      if (_) return m(_);
      let b = R.length, D;
      if (b === 0) return y.rmdir(g, m);
      R.forEach((C) => {
        l(d.join(g, C), y, (N) => {
          if (!D) {
            if (N) return m(D = N);
            --b === 0 && y.rmdir(g, m);
          }
        });
      });
    });
  }
  function t(g, y) {
    let m;
    y = y || {}, c(y), p(g, "rimraf: missing path"), p.strictEqual(typeof g, "string", "rimraf: path should be a string"), p(y, "rimraf: missing options"), p.strictEqual(typeof y, "object", "rimraf: options should be object");
    try {
      m = y.lstatSync(g);
    } catch (_) {
      if (_.code === "ENOENT")
        return;
      _.code === "EPERM" && f && a(g, y, _);
    }
    try {
      m && m.isDirectory() ? o(g, y, null) : y.unlinkSync(g);
    } catch (_) {
      if (_.code === "ENOENT")
        return;
      if (_.code === "EPERM")
        return f ? a(g, y, _) : o(g, y, _);
      if (_.code !== "EISDIR")
        throw _;
      o(g, y, _);
    }
  }
  function o(g, y, m) {
    p(g), p(y);
    try {
      y.rmdirSync(g);
    } catch (_) {
      if (_.code === "ENOTDIR")
        throw m;
      if (_.code === "ENOTEMPTY" || _.code === "EEXIST" || _.code === "EPERM")
        h(g, y);
      else if (_.code !== "ENOENT")
        throw _;
    }
  }
  function h(g, y) {
    if (p(g), p(y), y.readdirSync(g).forEach((m) => t(d.join(g, m), y)), f) {
      const m = Date.now();
      do
        try {
          return y.rmdirSync(g, y);
        } catch {
        }
      while (Date.now() - m < 500);
    } else
      return y.rmdirSync(g, y);
  }
  return an = l, l.sync = t, an;
}
var ln, qo;
function qr() {
  if (qo) return ln;
  qo = 1;
  const n = He(), d = Ve().fromCallback, p = /* @__PURE__ */ mc();
  function f(l, i) {
    if (n.rm) return n.rm(l, { recursive: !0, force: !0 }, i);
    p(l, i);
  }
  function c(l) {
    if (n.rmSync) return n.rmSync(l, { recursive: !0, force: !0 });
    p.sync(l);
  }
  return ln = {
    remove: d(f),
    removeSync: c
  }, ln;
}
var un, $o;
function gc() {
  if ($o) return un;
  $o = 1;
  const n = Ve().fromPromise, d = /* @__PURE__ */ kt(), p = Oe, f = /* @__PURE__ */ tt(), c = /* @__PURE__ */ qr(), l = n(async function(a) {
    let s;
    try {
      s = await d.readdir(a);
    } catch {
      return f.mkdirs(a);
    }
    return Promise.all(s.map((r) => c.remove(p.join(a, r))));
  });
  function i(u) {
    let a;
    try {
      a = d.readdirSync(u);
    } catch {
      return f.mkdirsSync(u);
    }
    a.forEach((s) => {
      s = p.join(u, s), c.removeSync(s);
    });
  }
  return un = {
    emptyDirSync: i,
    emptydirSync: i,
    emptyDir: l,
    emptydir: l
  }, un;
}
var cn, Mo;
function Ec() {
  if (Mo) return cn;
  Mo = 1;
  const n = Ve().fromCallback, d = Oe, p = He(), f = /* @__PURE__ */ tt();
  function c(i, u) {
    function a() {
      p.writeFile(i, "", (s) => {
        if (s) return u(s);
        u();
      });
    }
    p.stat(i, (s, r) => {
      if (!s && r.isFile()) return u();
      const t = d.dirname(i);
      p.stat(t, (o, h) => {
        if (o)
          return o.code === "ENOENT" ? f.mkdirs(t, (g) => {
            if (g) return u(g);
            a();
          }) : u(o);
        h.isDirectory() ? a() : p.readdir(t, (g) => {
          if (g) return u(g);
        });
      });
    });
  }
  function l(i) {
    let u;
    try {
      u = p.statSync(i);
    } catch {
    }
    if (u && u.isFile()) return;
    const a = d.dirname(i);
    try {
      p.statSync(a).isDirectory() || p.readdirSync(a);
    } catch (s) {
      if (s && s.code === "ENOENT") f.mkdirsSync(a);
      else throw s;
    }
    p.writeFileSync(i, "");
  }
  return cn = {
    createFile: n(c),
    createFileSync: l
  }, cn;
}
var fn, Bo;
function yc() {
  if (Bo) return fn;
  Bo = 1;
  const n = Ve().fromCallback, d = Oe, p = He(), f = /* @__PURE__ */ tt(), c = bt().pathExists, { areIdentical: l } = /* @__PURE__ */ qt();
  function i(a, s, r) {
    function t(o, h) {
      p.link(o, h, (g) => {
        if (g) return r(g);
        r(null);
      });
    }
    p.lstat(s, (o, h) => {
      p.lstat(a, (g, y) => {
        if (g)
          return g.message = g.message.replace("lstat", "ensureLink"), r(g);
        if (h && l(y, h)) return r(null);
        const m = d.dirname(s);
        c(m, (_, R) => {
          if (_) return r(_);
          if (R) return t(a, s);
          f.mkdirs(m, (b) => {
            if (b) return r(b);
            t(a, s);
          });
        });
      });
    });
  }
  function u(a, s) {
    let r;
    try {
      r = p.lstatSync(s);
    } catch {
    }
    try {
      const h = p.lstatSync(a);
      if (r && l(h, r)) return;
    } catch (h) {
      throw h.message = h.message.replace("lstat", "ensureLink"), h;
    }
    const t = d.dirname(s);
    return p.existsSync(t) || f.mkdirsSync(t), p.linkSync(a, s);
  }
  return fn = {
    createLink: n(i),
    createLinkSync: u
  }, fn;
}
var dn, jo;
function vc() {
  if (jo) return dn;
  jo = 1;
  const n = Oe, d = He(), p = bt().pathExists;
  function f(l, i, u) {
    if (n.isAbsolute(l))
      return d.lstat(l, (a) => a ? (a.message = a.message.replace("lstat", "ensureSymlink"), u(a)) : u(null, {
        toCwd: l,
        toDst: l
      }));
    {
      const a = n.dirname(i), s = n.join(a, l);
      return p(s, (r, t) => r ? u(r) : t ? u(null, {
        toCwd: s,
        toDst: l
      }) : d.lstat(l, (o) => o ? (o.message = o.message.replace("lstat", "ensureSymlink"), u(o)) : u(null, {
        toCwd: l,
        toDst: n.relative(a, l)
      })));
    }
  }
  function c(l, i) {
    let u;
    if (n.isAbsolute(l)) {
      if (u = d.existsSync(l), !u) throw new Error("absolute srcpath does not exist");
      return {
        toCwd: l,
        toDst: l
      };
    } else {
      const a = n.dirname(i), s = n.join(a, l);
      if (u = d.existsSync(s), u)
        return {
          toCwd: s,
          toDst: l
        };
      if (u = d.existsSync(l), !u) throw new Error("relative srcpath does not exist");
      return {
        toCwd: l,
        toDst: n.relative(a, l)
      };
    }
  }
  return dn = {
    symlinkPaths: f,
    symlinkPathsSync: c
  }, dn;
}
var hn, Ho;
function wc() {
  if (Ho) return hn;
  Ho = 1;
  const n = He();
  function d(f, c, l) {
    if (l = typeof c == "function" ? c : l, c = typeof c == "function" ? !1 : c, c) return l(null, c);
    n.lstat(f, (i, u) => {
      if (i) return l(null, "file");
      c = u && u.isDirectory() ? "dir" : "file", l(null, c);
    });
  }
  function p(f, c) {
    let l;
    if (c) return c;
    try {
      l = n.lstatSync(f);
    } catch {
      return "file";
    }
    return l && l.isDirectory() ? "dir" : "file";
  }
  return hn = {
    symlinkType: d,
    symlinkTypeSync: p
  }, hn;
}
var pn, Go;
function _c() {
  if (Go) return pn;
  Go = 1;
  const n = Ve().fromCallback, d = Oe, p = /* @__PURE__ */ kt(), f = /* @__PURE__ */ tt(), c = f.mkdirs, l = f.mkdirsSync, i = /* @__PURE__ */ vc(), u = i.symlinkPaths, a = i.symlinkPathsSync, s = /* @__PURE__ */ wc(), r = s.symlinkType, t = s.symlinkTypeSync, o = bt().pathExists, { areIdentical: h } = /* @__PURE__ */ qt();
  function g(_, R, b, D) {
    D = typeof b == "function" ? b : D, b = typeof b == "function" ? !1 : b, p.lstat(R, (C, N) => {
      !C && N.isSymbolicLink() ? Promise.all([
        p.stat(_),
        p.stat(R)
      ]).then(([I, F]) => {
        if (h(I, F)) return D(null);
        y(_, R, b, D);
      }) : y(_, R, b, D);
    });
  }
  function y(_, R, b, D) {
    u(_, R, (C, N) => {
      if (C) return D(C);
      _ = N.toDst, r(N.toCwd, b, (I, F) => {
        if (I) return D(I);
        const B = d.dirname(R);
        o(B, (S, Y) => {
          if (S) return D(S);
          if (Y) return p.symlink(_, R, F, D);
          c(B, (H) => {
            if (H) return D(H);
            p.symlink(_, R, F, D);
          });
        });
      });
    });
  }
  function m(_, R, b) {
    let D;
    try {
      D = p.lstatSync(R);
    } catch {
    }
    if (D && D.isSymbolicLink()) {
      const F = p.statSync(_), B = p.statSync(R);
      if (h(F, B)) return;
    }
    const C = a(_, R);
    _ = C.toDst, b = t(C.toCwd, b);
    const N = d.dirname(R);
    return p.existsSync(N) || l(N), p.symlinkSync(_, R, b);
  }
  return pn = {
    createSymlink: n(g),
    createSymlinkSync: m
  }, pn;
}
var mn, Vo;
function Ac() {
  if (Vo) return mn;
  Vo = 1;
  const { createFile: n, createFileSync: d } = /* @__PURE__ */ Ec(), { createLink: p, createLinkSync: f } = /* @__PURE__ */ yc(), { createSymlink: c, createSymlinkSync: l } = /* @__PURE__ */ _c();
  return mn = {
    // file
    createFile: n,
    createFileSync: d,
    ensureFile: n,
    ensureFileSync: d,
    // link
    createLink: p,
    createLinkSync: f,
    ensureLink: p,
    ensureLinkSync: f,
    // symlink
    createSymlink: c,
    createSymlinkSync: l,
    ensureSymlink: c,
    ensureSymlinkSync: l
  }, mn;
}
var gn, Wo;
function Ki() {
  if (Wo) return gn;
  Wo = 1;
  function n(p, { EOL: f = `
`, finalEOL: c = !0, replacer: l = null, spaces: i } = {}) {
    const u = c ? f : "", a = JSON.stringify(p, l, i);
    if (a === void 0)
      throw new TypeError(`Converting ${typeof p} value to JSON is not supported`);
    return a.replace(/\n/g, f) + u;
  }
  function d(p) {
    return Buffer.isBuffer(p) && (p = p.toString("utf8")), p.replace(/^\uFEFF/, "");
  }
  return gn = { stringify: n, stripBom: d }, gn;
}
var En, Yo;
function Rc() {
  if (Yo) return En;
  Yo = 1;
  let n;
  try {
    n = He();
  } catch {
    n = ht;
  }
  const d = Ve(), { stringify: p, stripBom: f } = Ki();
  async function c(r, t = {}) {
    typeof t == "string" && (t = { encoding: t });
    const o = t.fs || n, h = "throws" in t ? t.throws : !0;
    let g = await d.fromCallback(o.readFile)(r, t);
    g = f(g);
    let y;
    try {
      y = JSON.parse(g, t ? t.reviver : null);
    } catch (m) {
      if (h)
        throw m.message = `${r}: ${m.message}`, m;
      return null;
    }
    return y;
  }
  const l = d.fromPromise(c);
  function i(r, t = {}) {
    typeof t == "string" && (t = { encoding: t });
    const o = t.fs || n, h = "throws" in t ? t.throws : !0;
    try {
      let g = o.readFileSync(r, t);
      return g = f(g), JSON.parse(g, t.reviver);
    } catch (g) {
      if (h)
        throw g.message = `${r}: ${g.message}`, g;
      return null;
    }
  }
  async function u(r, t, o = {}) {
    const h = o.fs || n, g = p(t, o);
    await d.fromCallback(h.writeFile)(r, g, o);
  }
  const a = d.fromPromise(u);
  function s(r, t, o = {}) {
    const h = o.fs || n, g = p(t, o);
    return h.writeFileSync(r, g, o);
  }
  return En = {
    readFile: l,
    readFileSync: i,
    writeFile: a,
    writeFileSync: s
  }, En;
}
var yn, zo;
function Tc() {
  if (zo) return yn;
  zo = 1;
  const n = Rc();
  return yn = {
    // jsonfile exports
    readJson: n.readFile,
    readJsonSync: n.readFileSync,
    writeJson: n.writeFile,
    writeJsonSync: n.writeFileSync
  }, yn;
}
var vn, Xo;
function Ji() {
  if (Xo) return vn;
  Xo = 1;
  const n = Ve().fromCallback, d = He(), p = Oe, f = /* @__PURE__ */ tt(), c = bt().pathExists;
  function l(u, a, s, r) {
    typeof s == "function" && (r = s, s = "utf8");
    const t = p.dirname(u);
    c(t, (o, h) => {
      if (o) return r(o);
      if (h) return d.writeFile(u, a, s, r);
      f.mkdirs(t, (g) => {
        if (g) return r(g);
        d.writeFile(u, a, s, r);
      });
    });
  }
  function i(u, ...a) {
    const s = p.dirname(u);
    if (d.existsSync(s))
      return d.writeFileSync(u, ...a);
    f.mkdirsSync(s), d.writeFileSync(u, ...a);
  }
  return vn = {
    outputFile: n(l),
    outputFileSync: i
  }, vn;
}
var wn, Ko;
function Sc() {
  if (Ko) return wn;
  Ko = 1;
  const { stringify: n } = Ki(), { outputFile: d } = /* @__PURE__ */ Ji();
  async function p(f, c, l = {}) {
    const i = n(c, l);
    await d(f, i, l);
  }
  return wn = p, wn;
}
var _n, Jo;
function bc() {
  if (Jo) return _n;
  Jo = 1;
  const { stringify: n } = Ki(), { outputFileSync: d } = /* @__PURE__ */ Ji();
  function p(f, c, l) {
    const i = n(c, l);
    d(f, i, l);
  }
  return _n = p, _n;
}
var An, Qo;
function Cc() {
  if (Qo) return An;
  Qo = 1;
  const n = Ve().fromPromise, d = /* @__PURE__ */ Tc();
  return d.outputJson = n(/* @__PURE__ */ Sc()), d.outputJsonSync = /* @__PURE__ */ bc(), d.outputJSON = d.outputJson, d.outputJSONSync = d.outputJsonSync, d.writeJSON = d.writeJson, d.writeJSONSync = d.writeJsonSync, d.readJSON = d.readJson, d.readJSONSync = d.readJsonSync, An = d, An;
}
var Rn, Zo;
function Oc() {
  if (Zo) return Rn;
  Zo = 1;
  const n = He(), d = Oe, p = Xi().copy, f = qr().remove, c = tt().mkdirp, l = bt().pathExists, i = /* @__PURE__ */ qt();
  function u(o, h, g, y) {
    typeof g == "function" && (y = g, g = {}), g = g || {};
    const m = g.overwrite || g.clobber || !1;
    i.checkPaths(o, h, "move", g, (_, R) => {
      if (_) return y(_);
      const { srcStat: b, isChangingCase: D = !1 } = R;
      i.checkParentPaths(o, b, h, "move", (C) => {
        if (C) return y(C);
        if (a(h)) return s(o, h, m, D, y);
        c(d.dirname(h), (N) => N ? y(N) : s(o, h, m, D, y));
      });
    });
  }
  function a(o) {
    const h = d.dirname(o);
    return d.parse(h).root === h;
  }
  function s(o, h, g, y, m) {
    if (y) return r(o, h, g, m);
    if (g)
      return f(h, (_) => _ ? m(_) : r(o, h, g, m));
    l(h, (_, R) => _ ? m(_) : R ? m(new Error("dest already exists.")) : r(o, h, g, m));
  }
  function r(o, h, g, y) {
    n.rename(o, h, (m) => m ? m.code !== "EXDEV" ? y(m) : t(o, h, g, y) : y());
  }
  function t(o, h, g, y) {
    p(o, h, {
      overwrite: g,
      errorOnExist: !0
    }, (_) => _ ? y(_) : f(o, y));
  }
  return Rn = u, Rn;
}
var Tn, es;
function Pc() {
  if (es) return Tn;
  es = 1;
  const n = He(), d = Oe, p = Xi().copySync, f = qr().removeSync, c = tt().mkdirpSync, l = /* @__PURE__ */ qt();
  function i(t, o, h) {
    h = h || {};
    const g = h.overwrite || h.clobber || !1, { srcStat: y, isChangingCase: m = !1 } = l.checkPathsSync(t, o, "move", h);
    return l.checkParentPathsSync(t, y, o, "move"), u(o) || c(d.dirname(o)), a(t, o, g, m);
  }
  function u(t) {
    const o = d.dirname(t);
    return d.parse(o).root === o;
  }
  function a(t, o, h, g) {
    if (g) return s(t, o, h);
    if (h)
      return f(o), s(t, o, h);
    if (n.existsSync(o)) throw new Error("dest already exists.");
    return s(t, o, h);
  }
  function s(t, o, h) {
    try {
      n.renameSync(t, o);
    } catch (g) {
      if (g.code !== "EXDEV") throw g;
      return r(t, o, h);
    }
  }
  function r(t, o, h) {
    return p(t, o, {
      overwrite: h,
      errorOnExist: !0
    }), f(t);
  }
  return Tn = i, Tn;
}
var Sn, ts;
function Ic() {
  if (ts) return Sn;
  ts = 1;
  const n = Ve().fromCallback;
  return Sn = {
    move: n(/* @__PURE__ */ Oc()),
    moveSync: /* @__PURE__ */ Pc()
  }, Sn;
}
var bn, rs;
function mt() {
  return rs || (rs = 1, bn = {
    // Export promiseified graceful-fs:
    .../* @__PURE__ */ kt(),
    // Export extra methods:
    .../* @__PURE__ */ Xi(),
    .../* @__PURE__ */ gc(),
    .../* @__PURE__ */ Ac(),
    .../* @__PURE__ */ Cc(),
    .../* @__PURE__ */ tt(),
    .../* @__PURE__ */ Ic(),
    .../* @__PURE__ */ Ji(),
    .../* @__PURE__ */ bt(),
    .../* @__PURE__ */ qr()
  }), bn;
}
var jt = {}, At = {}, Cn = {}, Rt = {}, ns;
function Qi() {
  if (ns) return Rt;
  ns = 1, Object.defineProperty(Rt, "__esModule", { value: !0 }), Rt.CancellationError = Rt.CancellationToken = void 0;
  const n = Cl;
  let d = class extends n.EventEmitter {
    get cancelled() {
      return this._cancelled || this._parent != null && this._parent.cancelled;
    }
    set parent(c) {
      this.removeParentCancelHandler(), this._parent = c, this.parentCancelHandler = () => this.cancel(), this._parent.onCancel(this.parentCancelHandler);
    }
    // babel cannot compile ... correctly for super calls
    constructor(c) {
      super(), this.parentCancelHandler = null, this._parent = null, this._cancelled = !1, c != null && (this.parent = c);
    }
    cancel() {
      this._cancelled = !0, this.emit("cancel");
    }
    onCancel(c) {
      this.cancelled ? c() : this.once("cancel", c);
    }
    createPromise(c) {
      if (this.cancelled)
        return Promise.reject(new p());
      const l = () => {
        if (i != null)
          try {
            this.removeListener("cancel", i), i = null;
          } catch {
          }
      };
      let i = null;
      return new Promise((u, a) => {
        let s = null;
        if (i = () => {
          try {
            s != null && (s(), s = null);
          } finally {
            a(new p());
          }
        }, this.cancelled) {
          i();
          return;
        }
        this.onCancel(i), c(u, a, (r) => {
          s = r;
        });
      }).then((u) => (l(), u)).catch((u) => {
        throw l(), u;
      });
    }
    removeParentCancelHandler() {
      const c = this._parent;
      c != null && this.parentCancelHandler != null && (c.removeListener("cancel", this.parentCancelHandler), this.parentCancelHandler = null);
    }
    dispose() {
      try {
        this.removeParentCancelHandler();
      } finally {
        this.removeAllListeners(), this._parent = null;
      }
    }
  };
  Rt.CancellationToken = d;
  class p extends Error {
    constructor() {
      super("cancelled");
    }
  }
  return Rt.CancellationError = p, Rt;
}
var br = {}, is;
function $r() {
  if (is) return br;
  is = 1, Object.defineProperty(br, "__esModule", { value: !0 }), br.newError = n;
  function n(d, p) {
    const f = new Error(d);
    return f.code = p, f;
  }
  return br;
}
var Fe = {}, Cr = { exports: {} }, Or = { exports: {} }, On, os;
function Dc() {
  if (os) return On;
  os = 1;
  var n = 1e3, d = n * 60, p = d * 60, f = p * 24, c = f * 7, l = f * 365.25;
  On = function(r, t) {
    t = t || {};
    var o = typeof r;
    if (o === "string" && r.length > 0)
      return i(r);
    if (o === "number" && isFinite(r))
      return t.long ? a(r) : u(r);
    throw new Error(
      "val is not a non-empty string or a valid number. val=" + JSON.stringify(r)
    );
  };
  function i(r) {
    if (r = String(r), !(r.length > 100)) {
      var t = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
        r
      );
      if (t) {
        var o = parseFloat(t[1]), h = (t[2] || "ms").toLowerCase();
        switch (h) {
          case "years":
          case "year":
          case "yrs":
          case "yr":
          case "y":
            return o * l;
          case "weeks":
          case "week":
          case "w":
            return o * c;
          case "days":
          case "day":
          case "d":
            return o * f;
          case "hours":
          case "hour":
          case "hrs":
          case "hr":
          case "h":
            return o * p;
          case "minutes":
          case "minute":
          case "mins":
          case "min":
          case "m":
            return o * d;
          case "seconds":
          case "second":
          case "secs":
          case "sec":
          case "s":
            return o * n;
          case "milliseconds":
          case "millisecond":
          case "msecs":
          case "msec":
          case "ms":
            return o;
          default:
            return;
        }
      }
    }
  }
  function u(r) {
    var t = Math.abs(r);
    return t >= f ? Math.round(r / f) + "d" : t >= p ? Math.round(r / p) + "h" : t >= d ? Math.round(r / d) + "m" : t >= n ? Math.round(r / n) + "s" : r + "ms";
  }
  function a(r) {
    var t = Math.abs(r);
    return t >= f ? s(r, t, f, "day") : t >= p ? s(r, t, p, "hour") : t >= d ? s(r, t, d, "minute") : t >= n ? s(r, t, n, "second") : r + " ms";
  }
  function s(r, t, o, h) {
    var g = t >= o * 1.5;
    return Math.round(r / o) + " " + h + (g ? "s" : "");
  }
  return On;
}
var Pn, ss;
function Dl() {
  if (ss) return Pn;
  ss = 1;
  function n(d) {
    f.debug = f, f.default = f, f.coerce = s, f.disable = u, f.enable = l, f.enabled = a, f.humanize = Dc(), f.destroy = r, Object.keys(d).forEach((t) => {
      f[t] = d[t];
    }), f.names = [], f.skips = [], f.formatters = {};
    function p(t) {
      let o = 0;
      for (let h = 0; h < t.length; h++)
        o = (o << 5) - o + t.charCodeAt(h), o |= 0;
      return f.colors[Math.abs(o) % f.colors.length];
    }
    f.selectColor = p;
    function f(t) {
      let o, h = null, g, y;
      function m(..._) {
        if (!m.enabled)
          return;
        const R = m, b = Number(/* @__PURE__ */ new Date()), D = b - (o || b);
        R.diff = D, R.prev = o, R.curr = b, o = b, _[0] = f.coerce(_[0]), typeof _[0] != "string" && _.unshift("%O");
        let C = 0;
        _[0] = _[0].replace(/%([a-zA-Z%])/g, (I, F) => {
          if (I === "%%")
            return "%";
          C++;
          const B = f.formatters[F];
          if (typeof B == "function") {
            const S = _[C];
            I = B.call(R, S), _.splice(C, 1), C--;
          }
          return I;
        }), f.formatArgs.call(R, _), (R.log || f.log).apply(R, _);
      }
      return m.namespace = t, m.useColors = f.useColors(), m.color = f.selectColor(t), m.extend = c, m.destroy = f.destroy, Object.defineProperty(m, "enabled", {
        enumerable: !0,
        configurable: !1,
        get: () => h !== null ? h : (g !== f.namespaces && (g = f.namespaces, y = f.enabled(t)), y),
        set: (_) => {
          h = _;
        }
      }), typeof f.init == "function" && f.init(m), m;
    }
    function c(t, o) {
      const h = f(this.namespace + (typeof o > "u" ? ":" : o) + t);
      return h.log = this.log, h;
    }
    function l(t) {
      f.save(t), f.namespaces = t, f.names = [], f.skips = [];
      const o = (typeof t == "string" ? t : "").trim().replace(/\s+/g, ",").split(",").filter(Boolean);
      for (const h of o)
        h[0] === "-" ? f.skips.push(h.slice(1)) : f.names.push(h);
    }
    function i(t, o) {
      let h = 0, g = 0, y = -1, m = 0;
      for (; h < t.length; )
        if (g < o.length && (o[g] === t[h] || o[g] === "*"))
          o[g] === "*" ? (y = g, m = h, g++) : (h++, g++);
        else if (y !== -1)
          g = y + 1, m++, h = m;
        else
          return !1;
      for (; g < o.length && o[g] === "*"; )
        g++;
      return g === o.length;
    }
    function u() {
      const t = [
        ...f.names,
        ...f.skips.map((o) => "-" + o)
      ].join(",");
      return f.enable(""), t;
    }
    function a(t) {
      for (const o of f.skips)
        if (i(t, o))
          return !1;
      for (const o of f.names)
        if (i(t, o))
          return !0;
      return !1;
    }
    function s(t) {
      return t instanceof Error ? t.stack || t.message : t;
    }
    function r() {
      console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
    }
    return f.enable(f.load()), f;
  }
  return Pn = n, Pn;
}
var as;
function Nc() {
  return as || (as = 1, (function(n, d) {
    d.formatArgs = f, d.save = c, d.load = l, d.useColors = p, d.storage = i(), d.destroy = /* @__PURE__ */ (() => {
      let a = !1;
      return () => {
        a || (a = !0, console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."));
      };
    })(), d.colors = [
      "#0000CC",
      "#0000FF",
      "#0033CC",
      "#0033FF",
      "#0066CC",
      "#0066FF",
      "#0099CC",
      "#0099FF",
      "#00CC00",
      "#00CC33",
      "#00CC66",
      "#00CC99",
      "#00CCCC",
      "#00CCFF",
      "#3300CC",
      "#3300FF",
      "#3333CC",
      "#3333FF",
      "#3366CC",
      "#3366FF",
      "#3399CC",
      "#3399FF",
      "#33CC00",
      "#33CC33",
      "#33CC66",
      "#33CC99",
      "#33CCCC",
      "#33CCFF",
      "#6600CC",
      "#6600FF",
      "#6633CC",
      "#6633FF",
      "#66CC00",
      "#66CC33",
      "#9900CC",
      "#9900FF",
      "#9933CC",
      "#9933FF",
      "#99CC00",
      "#99CC33",
      "#CC0000",
      "#CC0033",
      "#CC0066",
      "#CC0099",
      "#CC00CC",
      "#CC00FF",
      "#CC3300",
      "#CC3333",
      "#CC3366",
      "#CC3399",
      "#CC33CC",
      "#CC33FF",
      "#CC6600",
      "#CC6633",
      "#CC9900",
      "#CC9933",
      "#CCCC00",
      "#CCCC33",
      "#FF0000",
      "#FF0033",
      "#FF0066",
      "#FF0099",
      "#FF00CC",
      "#FF00FF",
      "#FF3300",
      "#FF3333",
      "#FF3366",
      "#FF3399",
      "#FF33CC",
      "#FF33FF",
      "#FF6600",
      "#FF6633",
      "#FF9900",
      "#FF9933",
      "#FFCC00",
      "#FFCC33"
    ];
    function p() {
      if (typeof window < "u" && window.process && (window.process.type === "renderer" || window.process.__nwjs))
        return !0;
      if (typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/))
        return !1;
      let a;
      return typeof document < "u" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
      typeof window < "u" && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
      // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
      typeof navigator < "u" && navigator.userAgent && (a = navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)) && parseInt(a[1], 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
      typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }
    function f(a) {
      if (a[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + a[0] + (this.useColors ? "%c " : " ") + "+" + n.exports.humanize(this.diff), !this.useColors)
        return;
      const s = "color: " + this.color;
      a.splice(1, 0, s, "color: inherit");
      let r = 0, t = 0;
      a[0].replace(/%[a-zA-Z%]/g, (o) => {
        o !== "%%" && (r++, o === "%c" && (t = r));
      }), a.splice(t, 0, s);
    }
    d.log = console.debug || console.log || (() => {
    });
    function c(a) {
      try {
        a ? d.storage.setItem("debug", a) : d.storage.removeItem("debug");
      } catch {
      }
    }
    function l() {
      let a;
      try {
        a = d.storage.getItem("debug") || d.storage.getItem("DEBUG");
      } catch {
      }
      return !a && typeof process < "u" && "env" in process && (a = process.env.DEBUG), a;
    }
    function i() {
      try {
        return localStorage;
      } catch {
      }
    }
    n.exports = Dl()(d);
    const { formatters: u } = n.exports;
    u.j = function(a) {
      try {
        return JSON.stringify(a);
      } catch (s) {
        return "[UnexpectedJSONParseError]: " + s.message;
      }
    };
  })(Or, Or.exports)), Or.exports;
}
var Pr = { exports: {} }, In, ls;
function Fc() {
  return ls || (ls = 1, In = (n, d = process.argv) => {
    const p = n.startsWith("-") ? "" : n.length === 1 ? "-" : "--", f = d.indexOf(p + n), c = d.indexOf("--");
    return f !== -1 && (c === -1 || f < c);
  }), In;
}
var Dn, us;
function xc() {
  if (us) return Dn;
  us = 1;
  const n = kr, d = Ol, p = Fc(), { env: f } = process;
  let c;
  p("no-color") || p("no-colors") || p("color=false") || p("color=never") ? c = 0 : (p("color") || p("colors") || p("color=true") || p("color=always")) && (c = 1), "FORCE_COLOR" in f && (f.FORCE_COLOR === "true" ? c = 1 : f.FORCE_COLOR === "false" ? c = 0 : c = f.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(f.FORCE_COLOR, 10), 3));
  function l(a) {
    return a === 0 ? !1 : {
      level: a,
      hasBasic: !0,
      has256: a >= 2,
      has16m: a >= 3
    };
  }
  function i(a, s) {
    if (c === 0)
      return 0;
    if (p("color=16m") || p("color=full") || p("color=truecolor"))
      return 3;
    if (p("color=256"))
      return 2;
    if (a && !s && c === void 0)
      return 0;
    const r = c || 0;
    if (f.TERM === "dumb")
      return r;
    if (process.platform === "win32") {
      const t = n.release().split(".");
      return Number(t[0]) >= 10 && Number(t[2]) >= 10586 ? Number(t[2]) >= 14931 ? 3 : 2 : 1;
    }
    if ("CI" in f)
      return ["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI", "GITHUB_ACTIONS", "BUILDKITE"].some((t) => t in f) || f.CI_NAME === "codeship" ? 1 : r;
    if ("TEAMCITY_VERSION" in f)
      return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(f.TEAMCITY_VERSION) ? 1 : 0;
    if (f.COLORTERM === "truecolor")
      return 3;
    if ("TERM_PROGRAM" in f) {
      const t = parseInt((f.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
      switch (f.TERM_PROGRAM) {
        case "iTerm.app":
          return t >= 3 ? 3 : 2;
        case "Apple_Terminal":
          return 2;
      }
    }
    return /-256(color)?$/i.test(f.TERM) ? 2 : /^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(f.TERM) || "COLORTERM" in f ? 1 : r;
  }
  function u(a) {
    const s = i(a, a && a.isTTY);
    return l(s);
  }
  return Dn = {
    supportsColor: u,
    stdout: l(i(!0, d.isatty(1))),
    stderr: l(i(!0, d.isatty(2)))
  }, Dn;
}
var cs;
function Lc() {
  return cs || (cs = 1, (function(n, d) {
    const p = Ol, f = zi;
    d.init = r, d.log = u, d.formatArgs = l, d.save = a, d.load = s, d.useColors = c, d.destroy = f.deprecate(
      () => {
      },
      "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."
    ), d.colors = [6, 2, 3, 4, 5, 1];
    try {
      const o = xc();
      o && (o.stderr || o).level >= 2 && (d.colors = [
        20,
        21,
        26,
        27,
        32,
        33,
        38,
        39,
        40,
        41,
        42,
        43,
        44,
        45,
        56,
        57,
        62,
        63,
        68,
        69,
        74,
        75,
        76,
        77,
        78,
        79,
        80,
        81,
        92,
        93,
        98,
        99,
        112,
        113,
        128,
        129,
        134,
        135,
        148,
        149,
        160,
        161,
        162,
        163,
        164,
        165,
        166,
        167,
        168,
        169,
        170,
        171,
        172,
        173,
        178,
        179,
        184,
        185,
        196,
        197,
        198,
        199,
        200,
        201,
        202,
        203,
        204,
        205,
        206,
        207,
        208,
        209,
        214,
        215,
        220,
        221
      ]);
    } catch {
    }
    d.inspectOpts = Object.keys(process.env).filter((o) => /^debug_/i.test(o)).reduce((o, h) => {
      const g = h.substring(6).toLowerCase().replace(/_([a-z])/g, (m, _) => _.toUpperCase());
      let y = process.env[h];
      return /^(yes|on|true|enabled)$/i.test(y) ? y = !0 : /^(no|off|false|disabled)$/i.test(y) ? y = !1 : y === "null" ? y = null : y = Number(y), o[g] = y, o;
    }, {});
    function c() {
      return "colors" in d.inspectOpts ? !!d.inspectOpts.colors : p.isatty(process.stderr.fd);
    }
    function l(o) {
      const { namespace: h, useColors: g } = this;
      if (g) {
        const y = this.color, m = "\x1B[3" + (y < 8 ? y : "8;5;" + y), _ = `  ${m};1m${h} \x1B[0m`;
        o[0] = _ + o[0].split(`
`).join(`
` + _), o.push(m + "m+" + n.exports.humanize(this.diff) + "\x1B[0m");
      } else
        o[0] = i() + h + " " + o[0];
    }
    function i() {
      return d.inspectOpts.hideDate ? "" : (/* @__PURE__ */ new Date()).toISOString() + " ";
    }
    function u(...o) {
      return process.stderr.write(f.formatWithOptions(d.inspectOpts, ...o) + `
`);
    }
    function a(o) {
      o ? process.env.DEBUG = o : delete process.env.DEBUG;
    }
    function s() {
      return process.env.DEBUG;
    }
    function r(o) {
      o.inspectOpts = {};
      const h = Object.keys(d.inspectOpts);
      for (let g = 0; g < h.length; g++)
        o.inspectOpts[h[g]] = d.inspectOpts[h[g]];
    }
    n.exports = Dl()(d);
    const { formatters: t } = n.exports;
    t.o = function(o) {
      return this.inspectOpts.colors = this.useColors, f.inspect(o, this.inspectOpts).split(`
`).map((h) => h.trim()).join(" ");
    }, t.O = function(o) {
      return this.inspectOpts.colors = this.useColors, f.inspect(o, this.inspectOpts);
    };
  })(Pr, Pr.exports)), Pr.exports;
}
var fs;
function Uc() {
  return fs || (fs = 1, typeof process > "u" || process.type === "renderer" || process.browser === !0 || process.__nwjs ? Cr.exports = Nc() : Cr.exports = Lc()), Cr.exports;
}
var Ht = {}, ds;
function Nl() {
  if (ds) return Ht;
  ds = 1, Object.defineProperty(Ht, "__esModule", { value: !0 }), Ht.ProgressCallbackTransform = void 0;
  const n = dr;
  let d = class extends n.Transform {
    constructor(f, c, l) {
      super(), this.total = f, this.cancellationToken = c, this.onProgress = l, this.start = Date.now(), this.transferred = 0, this.delta = 0, this.nextUpdate = this.start + 1e3;
    }
    _transform(f, c, l) {
      if (this.cancellationToken.cancelled) {
        l(new Error("cancelled"), null);
        return;
      }
      this.transferred += f.length, this.delta += f.length;
      const i = Date.now();
      i >= this.nextUpdate && this.transferred !== this.total && (this.nextUpdate = i + 1e3, this.onProgress({
        total: this.total,
        delta: this.delta,
        transferred: this.transferred,
        percent: this.transferred / this.total * 100,
        bytesPerSecond: Math.round(this.transferred / ((i - this.start) / 1e3))
      }), this.delta = 0), l(null, f);
    }
    _flush(f) {
      if (this.cancellationToken.cancelled) {
        f(new Error("cancelled"));
        return;
      }
      this.onProgress({
        total: this.total,
        delta: this.delta,
        transferred: this.total,
        percent: 100,
        bytesPerSecond: Math.round(this.transferred / ((Date.now() - this.start) / 1e3))
      }), this.delta = 0, f(null);
    }
  };
  return Ht.ProgressCallbackTransform = d, Ht;
}
var hs;
function kc() {
  if (hs) return Fe;
  hs = 1, Object.defineProperty(Fe, "__esModule", { value: !0 }), Fe.DigestTransform = Fe.HttpExecutor = Fe.HttpError = void 0, Fe.addSensitiveRedirectHeader = h, Fe.addSensitiveFieldPattern = g, Fe.createHttpError = y, Fe.parseJson = R, Fe.configureRequestOptionsFromUrl = C, Fe.configureRequestUrl = N, Fe.safeGetHeader = B, Fe.configureRequestOptions = Y, Fe.isSensitiveFieldName = H, Fe.hashSensitiveValue = V, Fe.safeStringifyJson = L;
  const n = hr, d = Uc(), p = ht, f = dr, c = pt, l = Qi(), i = $r(), u = Nl(), a = (0, d.default)("electron-builder"), s = (O) => O.toLowerCase().replace(/[-_]/g, ""), r = /* @__PURE__ */ new Set(["authorization", "proxyauthorization", "privatetoken", "xapikey", "xauthtoken", "xaccesstoken", "xgitlabtoken", "cookie", "xcsrftoken"]), t = ["token", "password", "secret", "authorization", "credential", "apikey", "passphrase", "auth"], o = ["key"];
  function h(O) {
    r.add(s(O));
  }
  function g(O) {
    t.push(O.toLowerCase().replace(/[-_]/g, ""));
  }
  function y(O, A = null) {
    return new _(O.statusCode || -1, `${O.statusCode} ${O.statusMessage}` + (A == null ? "" : `
` + JSON.stringify(A, null, "  ")) + `
Headers: ` + L(O.headers), A);
  }
  const m = /* @__PURE__ */ new Map([
    [429, "Too many requests"],
    [400, "Bad request"],
    [403, "Forbidden"],
    [404, "Not found"],
    [405, "Method not allowed"],
    [406, "Not acceptable"],
    [408, "Request timeout"],
    [413, "Request entity too large"],
    [500, "Internal server error"],
    [502, "Bad gateway"],
    [503, "Service unavailable"],
    [504, "Gateway timeout"],
    [505, "HTTP version not supported"]
  ]);
  class _ extends Error {
    constructor(A, P = `HTTP error: ${m.get(A) || A}`, k = null) {
      super(P), this.statusCode = A, this.description = k, this.name = "HttpError", this.code = `HTTP_ERROR_${A}`;
    }
    isServerError() {
      return this.statusCode >= 500 && this.statusCode <= 599;
    }
  }
  Fe.HttpError = _;
  function R(O) {
    return O.then((A) => A == null || A.length === 0 ? null : JSON.parse(A));
  }
  class b {
    constructor() {
      this.maxRedirects = 10;
    }
    request(A, P = new l.CancellationToken(), k) {
      Y(A);
      const j = k == null ? void 0 : JSON.stringify(k), X = j ? Buffer.from(j) : void 0;
      if (X != null) {
        a.enabled && a(L(k));
        const { headers: oe, ...Z } = A;
        A = {
          method: "post",
          headers: {
            "Content-Type": "application/json",
            "Content-Length": X.length,
            ...oe
          },
          ...Z
        };
      }
      return this.doApiRequest(A, P, (oe) => oe.end(X));
    }
    doApiRequest(A, P, k, j = 0) {
      if (a.enabled) {
        const { headers: X, auth: oe, ...Z } = A;
        a(`Request: ${L(Z)}`);
      }
      return P.createPromise((X, oe, Z) => {
        const de = this.createRequest(A, (ye) => {
          try {
            this.handleResponse(ye, A, P, X, oe, j, k);
          } catch (K) {
            oe(K);
          }
        });
        this.addErrorAndTimeoutHandlers(de, oe, A.timeout), this.addRedirectHandlers(de, A, oe, j, (ye) => {
          this.doApiRequest(ye, P, k, j).then(X).catch(oe);
        }), k(de, oe), Z(() => de.abort());
      });
    }
    // noinspection JSUnusedLocalSymbols
    // eslint-disable-next-line
    addRedirectHandlers(A, P, k, j, X) {
    }
    addErrorAndTimeoutHandlers(A, P, k = 60 * 1e3) {
      this.addTimeOutHandler(A, P, k), A.on("error", P), A.on("aborted", () => {
        P(new Error("Request has been aborted by the server"));
      });
    }
    handleResponse(A, P, k, j, X, oe, Z) {
      var de;
      if (a.enabled) {
        const { headers: me, auth: pe, ..._e } = P;
        a(`Response: ${A.statusCode} ${A.statusMessage}, request options: ${L(_e)}`);
      }
      if (A.statusCode === 404) {
        X(y(A, `method: ${P.method || "GET"} url: ${P.protocol || "https:"}//${P.hostname}${P.port ? `:${P.port}` : ""}${P.path}

Please double check that your authentication token is correct. Due to security reasons, actual status maybe not reported, but 404.
`));
        return;
      } else if (A.statusCode === 204) {
        j();
        return;
      }
      const ye = (de = A.statusCode) !== null && de !== void 0 ? de : 0, K = ye >= 300 && ye < 400, ue = B(A, "location");
      if (K && ue != null) {
        if (oe > this.maxRedirects) {
          X(this.createMaxRedirectError());
          return;
        }
        this.doApiRequest(b.prepareRedirectUrlOptions(ue, P), k, Z, oe).then(j).catch(X);
        return;
      }
      A.setEncoding("utf8");
      let he = "";
      A.on("error", X), A.on("data", (me) => he += me), A.on("end", () => {
        try {
          if (A.statusCode != null && A.statusCode >= 400) {
            const me = B(A, "content-type"), pe = me != null && (Array.isArray(me) ? me.find((_e) => _e.includes("json")) != null : me.includes("json"));
            X(y(A, `method: ${P.method || "GET"} url: ${P.protocol || "https:"}//${P.hostname}${P.port ? `:${P.port}` : ""}${P.path}

          Data:
          ${pe ? L(JSON.parse(he)) : he}
          `));
          } else
            j(he.length === 0 ? null : he);
        } catch (me) {
          X(me);
        }
      });
    }
    async downloadToBuffer(A, P) {
      return await P.cancellationToken.createPromise((k, j, X) => {
        const oe = [], Z = {
          headers: P.headers || void 0,
          // because PrivateGitHubProvider requires HttpExecutor.prepareRedirectUrlOptions logic, so, we need to redirect manually
          redirect: "manual"
        };
        N(A, Z), Y(Z), this.doDownload(Z, {
          destination: null,
          options: P,
          onCancel: X,
          callback: (de) => {
            de == null ? k(Buffer.concat(oe)) : j(de);
          },
          responseHandler: (de, ye) => {
            let K = 0;
            de.on("data", (ue) => {
              if (K += ue.length, K > 524288e3) {
                ye(new Error("Maximum allowed size is 500 MB"));
                return;
              }
              oe.push(ue);
            }), de.on("end", () => {
              ye(null);
            });
          }
        }, 0);
      });
    }
    doDownload(A, P, k) {
      const j = this.createRequest(A, (X) => {
        if (X.statusCode >= 400) {
          P.callback(new Error(`Cannot download "${A.protocol || "https:"}//${A.hostname}${A.path}", status ${X.statusCode}: ${X.statusMessage}`));
          return;
        }
        X.on("error", P.callback);
        const oe = B(X, "location");
        if (oe != null) {
          k < this.maxRedirects ? this.doDownload(b.prepareRedirectUrlOptions(oe, A), P, k++) : P.callback(this.createMaxRedirectError());
          return;
        }
        P.responseHandler == null ? S(P, X) : P.responseHandler(X, P.callback);
      });
      this.addErrorAndTimeoutHandlers(j, P.callback, A.timeout), this.addRedirectHandlers(j, A, P.callback, k, (X) => {
        this.doDownload(X, P, k++);
      }), j.end();
    }
    createMaxRedirectError() {
      return new Error(`Too many redirects (> ${this.maxRedirects})`);
    }
    addTimeOutHandler(A, P, k) {
      A.on("socket", (j) => {
        j.setTimeout(k, () => {
          A.abort(), P(new Error("Request timed out"));
        });
      });
    }
    static prepareRedirectUrlOptions(A, P) {
      const k = C(A, { ...P }), j = k.headers;
      if (j == null)
        return k;
      const X = b.reconstructOriginalUrl(P), oe = D(A, P);
      if (b.isCrossOriginRedirect(X, oe)) {
        a.enabled && a(`Cross-origin redirect (${X.host} → ${oe.host}): stripping sensitive headers`);
        for (const Z of Object.keys(j))
          r.has(s(Z)) && delete j[Z];
      }
      return k;
    }
    static reconstructOriginalUrl(A) {
      const P = A.protocol || "https:";
      if (!A.hostname)
        throw new Error("Missing hostname in request options");
      const k = A.hostname, j = A.port ? `:${A.port}` : "", X = A.path || "/";
      return new c.URL(`${P}//${k}${j}${X}`);
    }
    static isCrossOriginRedirect(A, P) {
      if (A.hostname.toLowerCase() !== P.hostname.toLowerCase())
        return !0;
      if (A.protocol === "http:" && // This can be replaced with `!originalUrl.port`, but for the sake of clarity.
      ["80", ""].includes(A.port) && P.protocol === "https:" && // This can be replaced with `!redirectUrl.port`, but for the sake of clarity.
      ["443", ""].includes(P.port))
        return !1;
      if (A.protocol !== P.protocol)
        return !0;
      const k = A.port, j = P.port;
      return k !== j;
    }
    static async retryOnServerError(A, P = 3) {
      for (let k = 0; ; k++)
        try {
          return await A();
        } catch (j) {
          if (k < P && (j instanceof _ && j.isServerError() || j.code === "EPIPE")) {
            await new Promise((X) => setTimeout(X, 1e3 * (k + 1)));
            continue;
          }
          throw j;
        }
    }
  }
  Fe.HttpExecutor = b;
  function D(O, A) {
    try {
      return new c.URL(O);
    } catch {
      const P = A.hostname, k = A.protocol || "https:", j = A.port ? `:${A.port}` : "", X = `${k}//${P}${j}`;
      return new c.URL(O, X);
    }
  }
  function C(O, A) {
    const P = Y(A), k = D(O, A);
    return N(k, P), P;
  }
  function N(O, A) {
    A.protocol = O.protocol, A.hostname = O.hostname, O.port ? A.port = O.port : A.port && delete A.port, A.path = O.pathname + O.search;
  }
  class I extends f.Transform {
    // noinspection JSUnusedGlobalSymbols
    get actual() {
      return this._actual;
    }
    constructor(A, P = "sha512", k = "base64") {
      super(), this.expected = A, this.algorithm = P, this.encoding = k, this._actual = null, this.isValidateOnEnd = !0, this.digester = (0, n.createHash)(P);
    }
    // noinspection JSUnusedGlobalSymbols
    _transform(A, P, k) {
      this.digester.update(A), k(null, A);
    }
    // noinspection JSUnusedGlobalSymbols
    _flush(A) {
      if (this._actual = this.digester.digest(this.encoding), this.isValidateOnEnd)
        try {
          this.validate();
        } catch (P) {
          A(P);
          return;
        }
      A(null);
    }
    validate() {
      if (this._actual == null)
        throw (0, i.newError)("Not finished yet", "ERR_STREAM_NOT_FINISHED");
      if (this._actual !== this.expected)
        throw (0, i.newError)(`${this.algorithm} checksum mismatch, expected ${this.expected}, got ${this._actual}`, "ERR_CHECKSUM_MISMATCH");
      return null;
    }
  }
  Fe.DigestTransform = I;
  function F(O, A, P) {
    return O != null && A != null && O !== A ? (P(new Error(`checksum mismatch: expected ${A} but got ${O} (X-Checksum-Sha2 header)`)), !1) : !0;
  }
  function B(O, A) {
    const P = O.headers[A];
    return P == null ? null : Array.isArray(P) ? P.length === 0 ? null : P[P.length - 1] : P;
  }
  function S(O, A) {
    if (!F(B(A, "X-Checksum-Sha2"), O.options.sha2, O.callback))
      return;
    const P = [];
    if (O.options.onProgress != null) {
      const oe = B(A, "content-length");
      oe != null && P.push(new u.ProgressCallbackTransform(parseInt(oe, 10), O.options.cancellationToken, O.options.onProgress));
    }
    const k = O.options.sha512;
    k != null ? P.push(new I(k, "sha512", k.length === 128 && !k.includes("+") && !k.includes("Z") && !k.includes("=") ? "hex" : "base64")) : O.options.sha2 != null && P.push(new I(O.options.sha2, "sha256", "hex"));
    const j = (0, p.createWriteStream)(O.destination);
    P.push(j);
    let X = A;
    for (const oe of P)
      oe.on("error", (Z) => {
        j.close(), O.options.cancellationToken.cancelled || O.callback(Z);
      }), X = X.pipe(oe);
    j.on("finish", () => {
      j.close(O.callback);
    });
  }
  function Y(O, A, P) {
    P != null && (O.method = P), O.headers = { ...O.headers };
    const k = O.headers;
    return A != null && (k.authorization = A.startsWith("Basic") || A.startsWith("Bearer") ? A : `token ${A}`), k["User-Agent"] == null && (k["User-Agent"] = "electron-builder"), (P == null || P === "GET" || k["Cache-Control"] == null) && (k["Cache-Control"] = "no-cache"), O.protocol == null && process.versions.electron != null && (O.protocol = "https:"), O;
  }
  function H(O) {
    const A = s(O);
    return t.some((P) => A.includes(P)) || o.some((P) => A.endsWith(P));
  }
  function V(O) {
    return `${(0, n.createHash)("sha256").update(O).digest("hex")} (sha256 hash)`;
  }
  function L(O, A) {
    return JSON.stringify(O, (P, k) => H(P) || A != null && A.has(P) ? typeof k == "string" ? V(k) : "<stripped sensitive data>" : k, 2);
  }
  return Fe;
}
var Gt = {}, ps;
function qc() {
  if (ps) return Gt;
  ps = 1, Object.defineProperty(Gt, "__esModule", { value: !0 }), Gt.MemoLazy = void 0;
  let n = class {
    constructor(f, c) {
      this.selector = f, this.creator = c, this.selected = void 0, this._value = void 0;
    }
    get hasValue() {
      return this._value !== void 0;
    }
    get value() {
      const f = this.selector();
      if (this._value !== void 0 && d(this.selected, f))
        return this._value;
      this.selected = f;
      const c = this.creator(f);
      return this.value = c, c;
    }
    set value(f) {
      this._value = f;
    }
  };
  Gt.MemoLazy = n;
  function d(p, f) {
    if (typeof p == "object" && p !== null && (typeof f == "object" && f !== null)) {
      const i = Object.keys(p), u = Object.keys(f);
      return i.length === u.length && i.every((a) => d(p[a], f[a]));
    }
    return p === f;
  }
  return Gt;
}
var Dt = {}, ms;
function $c() {
  if (ms) return Dt;
  ms = 1, Object.defineProperty(Dt, "__esModule", { value: !0 }), Dt.githubUrl = n, Dt.githubTagPrefix = d, Dt.getS3LikeProviderBaseUrl = p;
  function n(i, u = "github.com") {
    return `${i.protocol || "https"}://${i.host || u}`;
  }
  function d(i) {
    var u;
    return i.tagNamePrefix ? i.tagNamePrefix : !((u = i.vPrefixedTagName) !== null && u !== void 0) || u ? "v" : "";
  }
  function p(i) {
    const u = i.provider;
    if (u === "s3")
      return f(i);
    if (u === "spaces")
      return l(i);
    throw new Error(`Not supported provider: ${u}`);
  }
  function f(i) {
    let u;
    if (i.accelerate == !0)
      u = `https://${i.bucket}.s3-accelerate.amazonaws.com`;
    else if (i.endpoint != null)
      u = `${i.endpoint}/${i.bucket}`;
    else if (i.bucket.includes(".")) {
      if (i.region == null)
        throw new Error(`Bucket name "${i.bucket}" includes a dot, but S3 region is missing`);
      i.region === "us-east-1" ? u = `https://s3.amazonaws.com/${i.bucket}` : u = `https://s3-${i.region}.amazonaws.com/${i.bucket}`;
    } else i.region === "cn-north-1" ? u = `https://${i.bucket}.s3.${i.region}.amazonaws.com.cn` : u = `https://${i.bucket}.s3.amazonaws.com`;
    return c(u, i.path);
  }
  function c(i, u) {
    return u != null && u.length > 0 && (u.startsWith("/") || (i += "/"), i += u), i;
  }
  function l(i) {
    if (i.name == null)
      throw new Error("name is missing");
    if (i.region == null)
      throw new Error("region is missing");
    return c(`https://${i.name}.${i.region}.digitaloceanspaces.com`, i.path);
  }
  return Dt;
}
var Ir = {}, gs;
function Mc() {
  if (gs) return Ir;
  gs = 1, Object.defineProperty(Ir, "__esModule", { value: !0 }), Ir.retry = d;
  const n = Qi();
  async function d(p, f) {
    var c;
    const { retries: l, interval: i, backoff: u = 0, attempt: a = 0, shouldRetry: s, cancellationToken: r = new n.CancellationToken() } = f;
    try {
      return await p();
    } catch (t) {
      if (await Promise.resolve((c = s?.(t)) !== null && c !== void 0 ? c : !0) && l > 0 && !r.cancelled)
        return await new Promise((o) => setTimeout(o, i + u * a)), await d(p, { ...f, retries: l - 1, attempt: a + 1 });
      throw t;
    }
  }
  return Ir;
}
var Dr = {}, Es;
function Bc() {
  if (Es) return Dr;
  Es = 1, Object.defineProperty(Dr, "__esModule", { value: !0 }), Dr.parseDn = n;
  function n(d) {
    let p = !1, f = null, c = "", l = 0;
    d = d.trim();
    const i = /* @__PURE__ */ new Map();
    for (let u = 0; u <= d.length; u++) {
      if (u === d.length) {
        f !== null && i.set(f, c);
        break;
      }
      const a = d[u];
      if (p) {
        if (a === '"') {
          p = !1;
          continue;
        }
      } else {
        if (a === '"') {
          p = !0;
          continue;
        }
        if (a === "\\") {
          u++;
          const s = parseInt(d.slice(u, u + 2), 16);
          Number.isNaN(s) ? c += d[u] : (u++, c += String.fromCharCode(s));
          continue;
        }
        if (f === null && a === "=") {
          f = c, c = "";
          continue;
        }
        if (a === "," || a === ";" || a === "+") {
          f !== null && i.set(f, c), f = null, c = "";
          continue;
        }
      }
      if (a === " " && !p) {
        if (c.length === 0)
          continue;
        if (u > l) {
          let s = u;
          for (; d[s] === " "; )
            s++;
          l = s;
        }
        if (l >= d.length || d[l] === "," || d[l] === ";" || f === null && d[l] === "=" || f !== null && d[l] === "+") {
          u = l - 1;
          continue;
        }
      }
      c += a;
    }
    return i;
  }
  return Dr;
}
var Tt = {}, ys;
function jc() {
  if (ys) return Tt;
  ys = 1, Object.defineProperty(Tt, "__esModule", { value: !0 }), Tt.nil = Tt.UUID = void 0;
  const n = hr, d = $r(), p = "options.name must be either a string or a Buffer", f = (0, n.randomBytes)(16);
  f[0] = f[0] | 1;
  const c = {}, l = [];
  for (let t = 0; t < 256; t++) {
    const o = (t + 256).toString(16).substr(1);
    c[o] = t, l[t] = o;
  }
  class i {
    constructor(o) {
      this.ascii = null, this.binary = null;
      const h = i.check(o);
      if (!h)
        throw new Error("not a UUID");
      this.version = h.version, h.format === "ascii" ? this.ascii = o : this.binary = o;
    }
    static v5(o, h) {
      return s(o, "sha1", 80, h);
    }
    toString() {
      return this.ascii == null && (this.ascii = r(this.binary)), this.ascii;
    }
    inspect() {
      return `UUID v${this.version} ${this.toString()}`;
    }
    static check(o, h = 0) {
      if (typeof o == "string")
        return o = o.toLowerCase(), /^[a-f0-9]{8}(-[a-f0-9]{4}){3}-([a-f0-9]{12})$/.test(o) ? o === "00000000-0000-0000-0000-000000000000" ? { version: void 0, variant: "nil", format: "ascii" } : {
          version: (c[o[14] + o[15]] & 240) >> 4,
          variant: u((c[o[19] + o[20]] & 224) >> 5),
          format: "ascii"
        } : !1;
      if (Buffer.isBuffer(o)) {
        if (o.length < h + 16)
          return !1;
        let g = 0;
        for (; g < 16 && o[h + g] === 0; g++)
          ;
        return g === 16 ? { version: void 0, variant: "nil", format: "binary" } : {
          version: (o[h + 6] & 240) >> 4,
          variant: u((o[h + 8] & 224) >> 5),
          format: "binary"
        };
      }
      throw (0, d.newError)("Unknown type of uuid", "ERR_UNKNOWN_UUID_TYPE");
    }
    // read stringified uuid into a Buffer
    static parse(o) {
      const h = Buffer.allocUnsafe(16);
      let g = 0;
      for (let y = 0; y < 16; y++)
        h[y] = c[o[g++] + o[g++]], (y === 3 || y === 5 || y === 7 || y === 9) && (g += 1);
      return h;
    }
  }
  Tt.UUID = i, i.OID = i.parse("6ba7b812-9dad-11d1-80b4-00c04fd430c8");
  function u(t) {
    switch (t) {
      case 0:
      case 1:
      case 3:
        return "ncs";
      case 4:
      case 5:
        return "rfc4122";
      case 6:
        return "microsoft";
      default:
        return "future";
    }
  }
  var a;
  (function(t) {
    t[t.ASCII = 0] = "ASCII", t[t.BINARY = 1] = "BINARY", t[t.OBJECT = 2] = "OBJECT";
  })(a || (a = {}));
  function s(t, o, h, g, y = a.ASCII) {
    const m = (0, n.createHash)(o);
    if (typeof t != "string" && !Buffer.isBuffer(t))
      throw (0, d.newError)(p, "ERR_INVALID_UUID_NAME");
    m.update(g), m.update(t);
    const R = m.digest();
    let b;
    switch (y) {
      case a.BINARY:
        R[6] = R[6] & 15 | h, R[8] = R[8] & 63 | 128, b = R;
        break;
      case a.OBJECT:
        R[6] = R[6] & 15 | h, R[8] = R[8] & 63 | 128, b = new i(R);
        break;
      default:
        b = l[R[0]] + l[R[1]] + l[R[2]] + l[R[3]] + "-" + l[R[4]] + l[R[5]] + "-" + l[R[6] & 15 | h] + l[R[7]] + "-" + l[R[8] & 63 | 128] + l[R[9]] + "-" + l[R[10]] + l[R[11]] + l[R[12]] + l[R[13]] + l[R[14]] + l[R[15]];
        break;
    }
    return b;
  }
  function r(t) {
    return l[t[0]] + l[t[1]] + l[t[2]] + l[t[3]] + "-" + l[t[4]] + l[t[5]] + "-" + l[t[6]] + l[t[7]] + "-" + l[t[8]] + l[t[9]] + "-" + l[t[10]] + l[t[11]] + l[t[12]] + l[t[13]] + l[t[14]] + l[t[15]];
  }
  return Tt.nil = new i("00000000-0000-0000-0000-000000000000"), Tt;
}
var Nt = {}, Nn = {}, vs;
function Hc() {
  return vs || (vs = 1, (function(n) {
    (function(d) {
      d.parser = function(v, E) {
        return new f(v, E);
      }, d.SAXParser = f, d.SAXStream = t, d.createStream = s, d.MAX_BUFFER_LENGTH = 64 * 1024;
      var p = [
        "comment",
        "sgmlDecl",
        "textNode",
        "tagName",
        "doctype",
        "procInstName",
        "procInstBody",
        "entity",
        "attribName",
        "attribValue",
        "cdata",
        "script"
      ];
      d.EVENTS = [
        "text",
        "processinginstruction",
        "sgmldeclaration",
        "doctype",
        "comment",
        "opentagstart",
        "attribute",
        "opentag",
        "closetag",
        "opencdata",
        "cdata",
        "closecdata",
        "error",
        "end",
        "ready",
        "script",
        "opennamespace",
        "closenamespace"
      ];
      function f(v, E) {
        if (!(this instanceof f))
          return new f(v, E);
        var $ = this;
        l($), $.q = $.c = "", $.bufferCheckPosition = d.MAX_BUFFER_LENGTH, $.encoding = null, $.opt = E || {}, $.opt.lowercase = $.opt.lowercase || $.opt.lowercasetags, $.looseCase = $.opt.lowercase ? "toLowerCase" : "toUpperCase", $.opt.maxEntityCount = $.opt.maxEntityCount || 512, $.opt.maxEntityDepth = $.opt.maxEntityDepth || 4, $.entityCount = $.entityDepth = 0, $.tags = [], $.closed = $.closedRoot = $.sawRoot = !1, $.tag = $.error = null, $.strict = !!v, $.noscript = !!(v || $.opt.noscript), $.state = S.BEGIN, $.strictEntities = $.opt.strictEntities, $.ENTITIES = $.strictEntities ? Object.create(d.XML_ENTITIES) : Object.create(d.ENTITIES), $.attribList = [], $.opt.xmlns && ($.ns = Object.create(m)), $.opt.unquotedAttributeValues === void 0 && ($.opt.unquotedAttributeValues = !v), $.trackPosition = $.opt.position !== !1, $.trackPosition && ($.position = $.line = $.column = 0), H($, "onready");
      }
      Object.create || (Object.create = function(v) {
        function E() {
        }
        E.prototype = v;
        var $ = new E();
        return $;
      }), Object.keys || (Object.keys = function(v) {
        var E = [];
        for (var $ in v) v.hasOwnProperty($) && E.push($);
        return E;
      });
      function c(v) {
        for (var E = Math.max(d.MAX_BUFFER_LENGTH, 10), $ = 0, x = 0, ge = p.length; x < ge; x++) {
          var Se = v[p[x]].length;
          if (Se > E)
            switch (p[x]) {
              case "textNode":
                k(v);
                break;
              case "cdata":
                P(v, "oncdata", v.cdata), v.cdata = "";
                break;
              case "script":
                P(v, "onscript", v.script), v.script = "";
                break;
              default:
                X(v, "Max buffer length exceeded: " + p[x]);
            }
          $ = Math.max($, Se);
        }
        var be = d.MAX_BUFFER_LENGTH - $;
        v.bufferCheckPosition = be + v.position;
      }
      function l(v) {
        for (var E = 0, $ = p.length; E < $; E++)
          v[p[E]] = "";
      }
      function i(v) {
        k(v), v.cdata !== "" && (P(v, "oncdata", v.cdata), v.cdata = ""), v.script !== "" && (P(v, "onscript", v.script), v.script = "");
      }
      f.prototype = {
        end: function() {
          oe(this);
        },
        write: Ae,
        resume: function() {
          return this.error = null, this;
        },
        close: function() {
          return this.write(null);
        },
        flush: function() {
          i(this);
        }
      };
      var u;
      try {
        u = require("stream").Stream;
      } catch {
        u = function() {
        };
      }
      u || (u = function() {
      });
      var a = d.EVENTS.filter(function(v) {
        return v !== "error" && v !== "end";
      });
      function s(v, E) {
        return new t(v, E);
      }
      function r(v, E) {
        if (v.length >= 2) {
          if (v[0] === 255 && v[1] === 254)
            return "utf-16le";
          if (v[0] === 254 && v[1] === 255)
            return "utf-16be";
        }
        return v.length >= 3 && v[0] === 239 && v[1] === 187 && v[2] === 191 ? "utf8" : v.length >= 4 ? v[0] === 60 && v[1] === 0 && v[2] === 63 && v[3] === 0 ? "utf-16le" : v[0] === 0 && v[1] === 60 && v[2] === 0 && v[3] === 63 ? "utf-16be" : "utf8" : E ? "utf8" : null;
      }
      function t(v, E) {
        if (!(this instanceof t))
          return new t(v, E);
        u.apply(this), this._parser = new f(v, E), this.writable = !0, this.readable = !0;
        var $ = this;
        this._parser.onend = function() {
          $.emit("end");
        }, this._parser.onerror = function(x) {
          $.emit("error", x), $._parser.error = null;
        }, this._decoder = null, this._decoderBuffer = null, a.forEach(function(x) {
          Object.defineProperty($, "on" + x, {
            get: function() {
              return $._parser["on" + x];
            },
            set: function(ge) {
              if (!ge)
                return $.removeAllListeners(x), $._parser["on" + x] = ge, ge;
              $.on(x, ge);
            },
            enumerable: !0,
            configurable: !1
          });
        });
      }
      t.prototype = Object.create(u.prototype, {
        constructor: {
          value: t
        }
      }), t.prototype._decodeBuffer = function(v, E) {
        if (this._decoderBuffer && (v = Buffer.concat([this._decoderBuffer, v]), this._decoderBuffer = null), !this._decoder) {
          var $ = r(v, E);
          if (!$)
            return this._decoderBuffer = v, "";
          this._parser.encoding = $, this._decoder = new TextDecoder($);
        }
        return this._decoder.decode(v, { stream: !E });
      }, t.prototype.write = function(v) {
        if (typeof Buffer == "function" && typeof Buffer.isBuffer == "function" && Buffer.isBuffer(v))
          v = this._decodeBuffer(v, !1);
        else if (this._decoderBuffer) {
          var E = this._decodeBuffer(Buffer.alloc(0), !0);
          E && (this._parser.write(E), this.emit("data", E));
        }
        return this._parser.write(v.toString()), this.emit("data", v), !0;
      }, t.prototype.end = function(v) {
        if (v && v.length && this.write(v), this._decoderBuffer) {
          var E = this._decodeBuffer(Buffer.alloc(0), !0);
          E && (this._parser.write(E), this.emit("data", E));
        } else if (this._decoder) {
          var $ = this._decoder.decode();
          $ && (this._parser.write($), this.emit("data", $));
        }
        return this._parser.end(), !0;
      }, t.prototype.on = function(v, E) {
        var $ = this;
        return !$._parser["on" + v] && a.indexOf(v) !== -1 && ($._parser["on" + v] = function() {
          var x = arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments);
          x.splice(0, 0, v), $.emit.apply($, x);
        }), u.prototype.on.call($, v, E);
      };
      var o = /^\[CDATA\[$/i, h = /^DOCTYPE$/i, g = "http://www.w3.org/XML/1998/namespace", y = "http://www.w3.org/2000/xmlns/", m = { xml: g, xmlns: y }, _ = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/, R = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/, b = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/, D = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/;
      function C(v) {
        return v === " " || v === `
` || v === "\r" || v === "	";
      }
      function N(v) {
        return v === '"' || v === "'";
      }
      function I(v) {
        return v === ">" || C(v);
      }
      function F(v, E) {
        return v.test(E);
      }
      function B(v, E) {
        return !F(v, E);
      }
      var S = 0;
      d.STATE = {
        BEGIN: S++,
        // leading byte order mark or whitespace
        BEGIN_WHITESPACE: S++,
        // leading whitespace
        TEXT: S++,
        // general stuff
        TEXT_ENTITY: S++,
        // &amp and such.
        OPEN_WAKA: S++,
        // <
        SGML_DECL: S++,
        // <!BLARG
        SGML_DECL_QUOTED: S++,
        // <!BLARG foo "bar
        DOCTYPE: S++,
        // <!DOCTYPE
        DOCTYPE_QUOTED: S++,
        // <!DOCTYPE "//blah
        DOCTYPE_DTD: S++,
        // <!DOCTYPE "//blah" [ ...
        DOCTYPE_DTD_QUOTED: S++,
        // <!DOCTYPE "//blah" [ "foo
        COMMENT_STARTING: S++,
        // <!-
        COMMENT: S++,
        // <!--
        COMMENT_ENDING: S++,
        // <!-- blah -
        COMMENT_ENDED: S++,
        // <!-- blah --
        CDATA: S++,
        // <![CDATA[ something
        CDATA_ENDING: S++,
        // ]
        CDATA_ENDING_2: S++,
        // ]]
        PROC_INST: S++,
        // <?hi
        PROC_INST_BODY: S++,
        // <?hi there
        PROC_INST_ENDING: S++,
        // <?hi "there" ?
        OPEN_TAG: S++,
        // <strong
        OPEN_TAG_SLASH: S++,
        // <strong /
        ATTRIB: S++,
        // <a
        ATTRIB_NAME: S++,
        // <a foo
        ATTRIB_NAME_SAW_WHITE: S++,
        // <a foo _
        ATTRIB_VALUE: S++,
        // <a foo=
        ATTRIB_VALUE_QUOTED: S++,
        // <a foo="bar
        ATTRIB_VALUE_CLOSED: S++,
        // <a foo="bar"
        ATTRIB_VALUE_UNQUOTED: S++,
        // <a foo=bar
        ATTRIB_VALUE_ENTITY_Q: S++,
        // <foo bar="&quot;"
        ATTRIB_VALUE_ENTITY_U: S++,
        // <foo bar=&quot
        CLOSE_TAG: S++,
        // </a
        CLOSE_TAG_SAW_WHITE: S++,
        // </a   >
        SCRIPT: S++,
        // <script> ...
        SCRIPT_ENDING: S++
        // <script> ... <
      }, d.XML_ENTITIES = Object.assign(/* @__PURE__ */ Object.create(null), {
        amp: "&",
        gt: ">",
        lt: "<",
        quot: '"',
        apos: "'"
      }), d.ENTITIES = Object.assign(/* @__PURE__ */ Object.create(null), {
        amp: "&",
        gt: ">",
        lt: "<",
        quot: '"',
        apos: "'",
        AElig: 198,
        Aacute: 193,
        Acirc: 194,
        Agrave: 192,
        Aring: 197,
        Atilde: 195,
        Auml: 196,
        Ccedil: 199,
        ETH: 208,
        Eacute: 201,
        Ecirc: 202,
        Egrave: 200,
        Euml: 203,
        Iacute: 205,
        Icirc: 206,
        Igrave: 204,
        Iuml: 207,
        Ntilde: 209,
        Oacute: 211,
        Ocirc: 212,
        Ograve: 210,
        Oslash: 216,
        Otilde: 213,
        Ouml: 214,
        THORN: 222,
        Uacute: 218,
        Ucirc: 219,
        Ugrave: 217,
        Uuml: 220,
        Yacute: 221,
        aacute: 225,
        acirc: 226,
        aelig: 230,
        agrave: 224,
        aring: 229,
        atilde: 227,
        auml: 228,
        ccedil: 231,
        eacute: 233,
        ecirc: 234,
        egrave: 232,
        eth: 240,
        euml: 235,
        iacute: 237,
        icirc: 238,
        igrave: 236,
        iuml: 239,
        ntilde: 241,
        oacute: 243,
        ocirc: 244,
        ograve: 242,
        oslash: 248,
        otilde: 245,
        ouml: 246,
        szlig: 223,
        thorn: 254,
        uacute: 250,
        ucirc: 251,
        ugrave: 249,
        uuml: 252,
        yacute: 253,
        yuml: 255,
        copy: 169,
        reg: 174,
        nbsp: 160,
        iexcl: 161,
        cent: 162,
        pound: 163,
        curren: 164,
        yen: 165,
        brvbar: 166,
        sect: 167,
        uml: 168,
        ordf: 170,
        laquo: 171,
        not: 172,
        shy: 173,
        macr: 175,
        deg: 176,
        plusmn: 177,
        sup1: 185,
        sup2: 178,
        sup3: 179,
        acute: 180,
        micro: 181,
        para: 182,
        middot: 183,
        cedil: 184,
        ordm: 186,
        raquo: 187,
        frac14: 188,
        frac12: 189,
        frac34: 190,
        iquest: 191,
        times: 215,
        divide: 247,
        OElig: 338,
        oelig: 339,
        Scaron: 352,
        scaron: 353,
        Yuml: 376,
        fnof: 402,
        circ: 710,
        tilde: 732,
        Alpha: 913,
        Beta: 914,
        Gamma: 915,
        Delta: 916,
        Epsilon: 917,
        Zeta: 918,
        Eta: 919,
        Theta: 920,
        Iota: 921,
        Kappa: 922,
        Lambda: 923,
        Mu: 924,
        Nu: 925,
        Xi: 926,
        Omicron: 927,
        Pi: 928,
        Rho: 929,
        Sigma: 931,
        Tau: 932,
        Upsilon: 933,
        Phi: 934,
        Chi: 935,
        Psi: 936,
        Omega: 937,
        alpha: 945,
        beta: 946,
        gamma: 947,
        delta: 948,
        epsilon: 949,
        zeta: 950,
        eta: 951,
        theta: 952,
        iota: 953,
        kappa: 954,
        lambda: 955,
        mu: 956,
        nu: 957,
        xi: 958,
        omicron: 959,
        pi: 960,
        rho: 961,
        sigmaf: 962,
        sigma: 963,
        tau: 964,
        upsilon: 965,
        phi: 966,
        chi: 967,
        psi: 968,
        omega: 969,
        thetasym: 977,
        upsih: 978,
        piv: 982,
        ensp: 8194,
        emsp: 8195,
        thinsp: 8201,
        zwnj: 8204,
        zwj: 8205,
        lrm: 8206,
        rlm: 8207,
        ndash: 8211,
        mdash: 8212,
        lsquo: 8216,
        rsquo: 8217,
        sbquo: 8218,
        ldquo: 8220,
        rdquo: 8221,
        bdquo: 8222,
        dagger: 8224,
        Dagger: 8225,
        bull: 8226,
        hellip: 8230,
        permil: 8240,
        prime: 8242,
        Prime: 8243,
        lsaquo: 8249,
        rsaquo: 8250,
        oline: 8254,
        frasl: 8260,
        euro: 8364,
        image: 8465,
        weierp: 8472,
        real: 8476,
        trade: 8482,
        alefsym: 8501,
        larr: 8592,
        uarr: 8593,
        rarr: 8594,
        darr: 8595,
        harr: 8596,
        crarr: 8629,
        lArr: 8656,
        uArr: 8657,
        rArr: 8658,
        dArr: 8659,
        hArr: 8660,
        forall: 8704,
        part: 8706,
        exist: 8707,
        empty: 8709,
        nabla: 8711,
        isin: 8712,
        notin: 8713,
        ni: 8715,
        prod: 8719,
        sum: 8721,
        minus: 8722,
        lowast: 8727,
        radic: 8730,
        prop: 8733,
        infin: 8734,
        ang: 8736,
        and: 8743,
        or: 8744,
        cap: 8745,
        cup: 8746,
        int: 8747,
        there4: 8756,
        sim: 8764,
        cong: 8773,
        asymp: 8776,
        ne: 8800,
        equiv: 8801,
        le: 8804,
        ge: 8805,
        sub: 8834,
        sup: 8835,
        nsub: 8836,
        sube: 8838,
        supe: 8839,
        oplus: 8853,
        otimes: 8855,
        perp: 8869,
        sdot: 8901,
        lceil: 8968,
        rceil: 8969,
        lfloor: 8970,
        rfloor: 8971,
        lang: 9001,
        rang: 9002,
        loz: 9674,
        spades: 9824,
        clubs: 9827,
        hearts: 9829,
        diams: 9830
      }), Object.keys(d.ENTITIES).forEach(function(v) {
        var E = d.ENTITIES[v], $ = typeof E == "number" ? String.fromCharCode(E) : E;
        d.ENTITIES[v] = $;
      });
      for (var Y in d.STATE)
        d.STATE[d.STATE[Y]] = Y;
      S = d.STATE;
      function H(v, E, $) {
        v[E] && v[E]($);
      }
      function V(v) {
        var E = v && v.match(/(?:^|\s)encoding\s*=\s*(['"])([^'"]+)\1/i);
        return E ? E[2] : null;
      }
      function L(v) {
        return v ? v.toLowerCase().replace(/[^a-z0-9]/g, "") : null;
      }
      function O(v, E) {
        const $ = L(v), x = L(E);
        return !$ || !x ? !0 : x === "utf16" ? $ === "utf16le" || $ === "utf16be" : $ === x;
      }
      function A(v, E) {
        if (!(!v.strict || !v.encoding || !E || E.name !== "xml")) {
          var $ = V(E.body);
          $ && !O(v.encoding, $) && Z(
            v,
            "XML declaration encoding " + $ + " does not match detected stream encoding " + v.encoding.toUpperCase()
          );
        }
      }
      function P(v, E, $) {
        v.textNode && k(v), H(v, E, $);
      }
      function k(v) {
        v.textNode = j(v.opt, v.textNode), v.textNode && H(v, "ontext", v.textNode), v.textNode = "";
      }
      function j(v, E) {
        return v.trim && (E = E.trim()), v.normalize && (E = E.replace(/\s+/g, " ")), E;
      }
      function X(v, E) {
        return k(v), v.trackPosition && (E += `
Line: ` + v.line + `
Column: ` + v.column + `
Char: ` + v.c), E = new Error(E), v.error = E, H(v, "onerror", E), v;
      }
      function oe(v) {
        return v.sawRoot && !v.closedRoot && Z(v, "Unclosed root tag"), v.state !== S.BEGIN && v.state !== S.BEGIN_WHITESPACE && v.state !== S.TEXT && X(v, "Unexpected end"), k(v), v.c = "", v.closed = !0, H(v, "onend"), f.call(v, v.strict, v.opt), v;
      }
      function Z(v, E) {
        if (typeof v != "object" || !(v instanceof f))
          throw new Error("bad call to strictFail");
        v.strict && X(v, E);
      }
      function de(v) {
        v.strict || (v.tagName = v.tagName[v.looseCase]());
        var E = v.tags[v.tags.length - 1] || v, $ = v.tag = { name: v.tagName, attributes: {} };
        v.opt.xmlns && ($.ns = E.ns), v.attribList.length = 0, P(v, "onopentagstart", $);
      }
      function ye(v, E) {
        var $ = v.indexOf(":"), x = $ < 0 ? ["", v] : v.split(":"), ge = x[0], Se = x[1];
        return E && v === "xmlns" && (ge = "xmlns", Se = ""), { prefix: ge, local: Se };
      }
      function K(v) {
        if (v.strict || (v.attribName = v.attribName[v.looseCase]()), v.attribList.indexOf(v.attribName) !== -1 || v.tag.attributes.hasOwnProperty(v.attribName)) {
          v.attribName = v.attribValue = "";
          return;
        }
        if (v.opt.xmlns) {
          var E = ye(v.attribName, !0), $ = E.prefix, x = E.local;
          if ($ === "xmlns")
            if (x === "xml" && v.attribValue !== g)
              Z(
                v,
                "xml: prefix must be bound to " + g + `
Actual: ` + v.attribValue
              );
            else if (x === "xmlns" && v.attribValue !== y)
              Z(
                v,
                "xmlns: prefix must be bound to " + y + `
Actual: ` + v.attribValue
              );
            else {
              var ge = v.tag, Se = v.tags[v.tags.length - 1] || v;
              ge.ns === Se.ns && (ge.ns = Object.create(Se.ns)), ge.ns[x] = v.attribValue;
            }
          v.attribList.push([v.attribName, v.attribValue]);
        } else
          v.tag.attributes[v.attribName] = v.attribValue, P(v, "onattribute", {
            name: v.attribName,
            value: v.attribValue
          });
        v.attribName = v.attribValue = "";
      }
      function ue(v, E) {
        if (v.opt.xmlns) {
          var $ = v.tag, x = ye(v.tagName);
          $.prefix = x.prefix, $.local = x.local, $.uri = $.ns[x.prefix] || "", $.prefix && !$.uri && (Z(
            v,
            "Unbound namespace prefix: " + JSON.stringify(v.tagName)
          ), $.uri = x.prefix);
          var ge = v.tags[v.tags.length - 1] || v;
          $.ns && ge.ns !== $.ns && Object.keys($.ns).forEach(function(e) {
            P(v, "onopennamespace", {
              prefix: e,
              uri: $.ns[e]
            });
          });
          for (var Se = 0, be = v.attribList.length; Se < be; Se++) {
            var De = v.attribList[Se], Ne = De[0], $e = De[1], Re = ye(Ne, !0), Me = Re.prefix, st = Re.local, rt = Me === "" ? "" : $.ns[Me] || "", Ye = {
              name: Ne,
              value: $e,
              prefix: Me,
              local: st,
              uri: rt
            };
            Me && Me !== "xmlns" && !rt && (Z(
              v,
              "Unbound namespace prefix: " + JSON.stringify(Me)
            ), Ye.uri = Me), v.tag.attributes[Ne] = Ye, P(v, "onattribute", Ye);
          }
          v.attribList.length = 0;
        }
        v.tag.isSelfClosing = !!E, v.sawRoot = !0, v.tags.push(v.tag), P(v, "onopentag", v.tag), E || (!v.noscript && v.tagName.toLowerCase() === "script" ? v.state = S.SCRIPT : v.state = S.TEXT, v.tag = null, v.tagName = ""), v.attribName = v.attribValue = "", v.attribList.length = 0;
      }
      function he(v) {
        if (!v.tagName) {
          Z(v, "Weird empty close tag."), v.textNode += "</>", v.state = S.TEXT;
          return;
        }
        if (v.script) {
          if (v.tagName !== "script") {
            v.script += "</" + v.tagName + ">", v.tagName = "", v.state = S.SCRIPT;
            return;
          }
          P(v, "onscript", v.script), v.script = "";
        }
        var E = v.tags.length, $ = v.tagName;
        v.strict || ($ = $[v.looseCase]());
        for (var x = $; E--; ) {
          var ge = v.tags[E];
          if (ge.name !== x)
            Z(v, "Unexpected close tag");
          else
            break;
        }
        if (E < 0) {
          Z(v, "Unmatched closing tag: " + v.tagName), v.textNode += "</" + v.tagName + ">", v.state = S.TEXT;
          return;
        }
        v.tagName = $;
        for (var Se = v.tags.length; Se-- > E; ) {
          var be = v.tag = v.tags.pop();
          v.tagName = v.tag.name, P(v, "onclosetag", v.tagName);
          var De = {};
          for (var Ne in be.ns)
            De[Ne] = be.ns[Ne];
          var $e = v.tags[v.tags.length - 1] || v;
          v.opt.xmlns && be.ns !== $e.ns && Object.keys(be.ns).forEach(function(Re) {
            var Me = be.ns[Re];
            P(v, "onclosenamespace", { prefix: Re, uri: Me });
          });
        }
        E === 0 && (v.closedRoot = !0), v.tagName = v.attribValue = v.attribName = "", v.attribList.length = 0, v.state = S.TEXT;
      }
      function me(v) {
        var E = v.entity, $ = E.toLowerCase(), x, ge = "";
        return v.ENTITIES[E] ? v.ENTITIES[E] : v.ENTITIES[$] ? v.ENTITIES[$] : (E = $, E.charAt(0) === "#" && (E.charAt(1) === "x" ? (E = E.slice(2), x = parseInt(E, 16), ge = x.toString(16)) : (E = E.slice(1), x = parseInt(E, 10), ge = x.toString(10))), E = E.replace(/^0+/, ""), isNaN(x) || ge.toLowerCase() !== E || x < 0 || x > 1114111 || !pe(x) ? (Z(v, "Invalid character entity"), "&" + v.entity + ";") : String.fromCodePoint(x));
      }
      function pe(v) {
        return v === 9 || v === 10 || v === 13 || v >= 32 && v <= 55295 || v >= 57344 && v <= 65533 || v >= 65536 && v <= 1114111;
      }
      function _e(v, E) {
        E === "<" ? (v.state = S.OPEN_WAKA, v.startTagPosition = v.position) : C(E) || (Z(v, "Non-whitespace before first tag."), v.textNode = E, v.state = S.TEXT);
      }
      function ve(v, E) {
        var $ = "";
        return E < v.length && ($ = v.charAt(E)), $;
      }
      function Ae(v) {
        var E = this;
        if (this.error)
          throw this.error;
        if (E.closed)
          return X(
            E,
            "Cannot write after close. Assign an onready handler."
          );
        if (v === null)
          return oe(E);
        typeof v == "object" && (v = v.toString());
        for (var $ = 0, x = ""; x = ve(v, $++), E.c = x, !!x; )
          switch (E.trackPosition && (E.position++, x === `
` ? (E.line++, E.column = 0) : E.column++), E.state) {
            case S.BEGIN:
              if (E.state = S.BEGIN_WHITESPACE, x === "\uFEFF")
                continue;
              _e(E, x);
              continue;
            case S.BEGIN_WHITESPACE:
              _e(E, x);
              continue;
            case S.TEXT:
              if (E.sawRoot && !E.closedRoot) {
                for (var Se = $ - 1; x && x !== "<" && x !== "&"; )
                  x = ve(v, $++), x && E.trackPosition && (E.position++, x === `
` ? (E.line++, E.column = 0) : E.column++);
                E.textNode += v.substring(Se, $ - 1);
              }
              x === "<" && !(E.sawRoot && E.closedRoot && !E.strict) ? (E.state = S.OPEN_WAKA, E.startTagPosition = E.position) : (!C(x) && (!E.sawRoot || E.closedRoot) && Z(E, "Text data outside of root node."), x === "&" ? E.state = S.TEXT_ENTITY : E.textNode += x);
              continue;
            case S.SCRIPT:
              x === "<" ? E.state = S.SCRIPT_ENDING : E.script += x;
              continue;
            case S.SCRIPT_ENDING:
              x === "/" ? E.state = S.CLOSE_TAG : (E.script += "<" + x, E.state = S.SCRIPT);
              continue;
            case S.OPEN_WAKA:
              if (x === "!")
                E.state = S.SGML_DECL, E.sgmlDecl = "";
              else if (!C(x)) if (F(_, x))
                E.state = S.OPEN_TAG, E.tagName = x;
              else if (x === "/")
                E.state = S.CLOSE_TAG, E.tagName = "";
              else if (x === "?")
                E.state = S.PROC_INST, E.procInstName = E.procInstBody = "";
              else {
                if (Z(E, "Unencoded <"), E.startTagPosition + 1 < E.position) {
                  var ge = E.position - E.startTagPosition;
                  x = new Array(ge).join(" ") + x;
                }
                E.textNode += "<" + x, E.state = S.TEXT;
              }
              continue;
            case S.SGML_DECL:
              if (E.sgmlDecl + x === "--") {
                E.state = S.COMMENT, E.comment = "", E.sgmlDecl = "";
                continue;
              }
              E.doctype && E.doctype !== !0 && E.sgmlDecl ? (E.state = S.DOCTYPE_DTD, E.doctype += "<!" + E.sgmlDecl + x, E.sgmlDecl = "") : o.test(E.sgmlDecl + x) ? (P(E, "onopencdata"), E.state = S.CDATA, E.sgmlDecl = "", E.cdata = "") : h.test(E.sgmlDecl + x) ? (E.state = S.DOCTYPE, (E.doctype || E.sawRoot) && Z(
                E,
                "Inappropriately located doctype declaration"
              ), E.doctype = "", E.sgmlDecl = "") : x === ">" ? (P(E, "onsgmldeclaration", E.sgmlDecl), E.sgmlDecl = "", E.state = S.TEXT) : (N(x) && (E.state = S.SGML_DECL_QUOTED), E.sgmlDecl += x);
              continue;
            case S.SGML_DECL_QUOTED:
              x === E.q && (E.state = S.SGML_DECL, E.q = ""), E.sgmlDecl += x;
              continue;
            case S.DOCTYPE:
              x === ">" ? (E.state = S.TEXT, P(E, "ondoctype", E.doctype), E.doctype = !0) : (E.doctype += x, x === "[" ? E.state = S.DOCTYPE_DTD : N(x) && (E.state = S.DOCTYPE_QUOTED, E.q = x));
              continue;
            case S.DOCTYPE_QUOTED:
              E.doctype += x, x === E.q && (E.q = "", E.state = S.DOCTYPE);
              continue;
            case S.DOCTYPE_DTD:
              x === "]" ? (E.doctype += x, E.state = S.DOCTYPE) : x === "<" ? (E.state = S.OPEN_WAKA, E.startTagPosition = E.position) : N(x) ? (E.doctype += x, E.state = S.DOCTYPE_DTD_QUOTED, E.q = x) : E.doctype += x;
              continue;
            case S.DOCTYPE_DTD_QUOTED:
              E.doctype += x, x === E.q && (E.state = S.DOCTYPE_DTD, E.q = "");
              continue;
            case S.COMMENT:
              x === "-" ? E.state = S.COMMENT_ENDING : E.comment += x;
              continue;
            case S.COMMENT_ENDING:
              x === "-" ? (E.state = S.COMMENT_ENDED, E.comment = j(E.opt, E.comment), E.comment && P(E, "oncomment", E.comment), E.comment = "") : (E.comment += "-" + x, E.state = S.COMMENT);
              continue;
            case S.COMMENT_ENDED:
              x !== ">" ? (Z(E, "Malformed comment"), E.comment += "--" + x, E.state = S.COMMENT) : E.doctype && E.doctype !== !0 ? E.state = S.DOCTYPE_DTD : E.state = S.TEXT;
              continue;
            case S.CDATA:
              for (var Se = $ - 1; x && x !== "]"; )
                x = ve(v, $++), x && E.trackPosition && (E.position++, x === `
` ? (E.line++, E.column = 0) : E.column++);
              E.cdata += v.substring(Se, $ - 1), x === "]" && (E.state = S.CDATA_ENDING);
              continue;
            case S.CDATA_ENDING:
              x === "]" ? E.state = S.CDATA_ENDING_2 : (E.cdata += "]" + x, E.state = S.CDATA);
              continue;
            case S.CDATA_ENDING_2:
              x === ">" ? (E.cdata && P(E, "oncdata", E.cdata), P(E, "onclosecdata"), E.cdata = "", E.state = S.TEXT) : x === "]" ? E.cdata += "]" : (E.cdata += "]]" + x, E.state = S.CDATA);
              continue;
            case S.PROC_INST:
              x === "?" ? E.state = S.PROC_INST_ENDING : C(x) ? E.state = S.PROC_INST_BODY : E.procInstName += x;
              continue;
            case S.PROC_INST_BODY:
              if (!E.procInstBody && C(x))
                continue;
              x === "?" ? E.state = S.PROC_INST_ENDING : E.procInstBody += x;
              continue;
            case S.PROC_INST_ENDING:
              if (x === ">") {
                const $e = {
                  name: E.procInstName,
                  body: E.procInstBody
                };
                A(E, $e), P(E, "onprocessinginstruction", $e), E.procInstName = E.procInstBody = "", E.state = S.TEXT;
              } else
                E.procInstBody += "?" + x, E.state = S.PROC_INST_BODY;
              continue;
            case S.OPEN_TAG:
              F(R, x) ? E.tagName += x : (de(E), x === ">" ? ue(E) : x === "/" ? E.state = S.OPEN_TAG_SLASH : (C(x) || Z(E, "Invalid character in tag name"), E.state = S.ATTRIB));
              continue;
            case S.OPEN_TAG_SLASH:
              x === ">" ? (ue(E, !0), he(E)) : (Z(
                E,
                "Forward-slash in opening tag not followed by >"
              ), E.state = S.ATTRIB);
              continue;
            case S.ATTRIB:
              if (C(x))
                continue;
              x === ">" ? ue(E) : x === "/" ? E.state = S.OPEN_TAG_SLASH : F(_, x) ? (E.attribName = x, E.attribValue = "", E.state = S.ATTRIB_NAME) : Z(E, "Invalid attribute name");
              continue;
            case S.ATTRIB_NAME:
              x === "=" ? E.state = S.ATTRIB_VALUE : x === ">" ? (Z(E, "Attribute without value"), E.attribValue = E.attribName, K(E), ue(E)) : C(x) ? E.state = S.ATTRIB_NAME_SAW_WHITE : F(R, x) ? E.attribName += x : Z(E, "Invalid attribute name");
              continue;
            case S.ATTRIB_NAME_SAW_WHITE:
              if (x === "=")
                E.state = S.ATTRIB_VALUE;
              else {
                if (C(x))
                  continue;
                Z(E, "Attribute without value"), E.tag.attributes[E.attribName] = "", E.attribValue = "", P(E, "onattribute", {
                  name: E.attribName,
                  value: ""
                }), E.attribName = "", x === ">" ? ue(E) : F(_, x) ? (E.attribName = x, E.state = S.ATTRIB_NAME) : (Z(E, "Invalid attribute name"), E.state = S.ATTRIB);
              }
              continue;
            case S.ATTRIB_VALUE:
              if (C(x))
                continue;
              N(x) ? (E.q = x, E.state = S.ATTRIB_VALUE_QUOTED) : (E.opt.unquotedAttributeValues || X(E, "Unquoted attribute value"), E.state = S.ATTRIB_VALUE_UNQUOTED, E.attribValue = x);
              continue;
            case S.ATTRIB_VALUE_QUOTED:
              if (x !== E.q) {
                x === "&" ? E.state = S.ATTRIB_VALUE_ENTITY_Q : E.attribValue += x;
                continue;
              }
              K(E), E.q = "", E.state = S.ATTRIB_VALUE_CLOSED;
              continue;
            case S.ATTRIB_VALUE_CLOSED:
              C(x) ? E.state = S.ATTRIB : x === ">" ? ue(E) : x === "/" ? E.state = S.OPEN_TAG_SLASH : F(_, x) ? (Z(E, "No whitespace between attributes"), E.attribName = x, E.attribValue = "", E.state = S.ATTRIB_NAME) : Z(E, "Invalid attribute name");
              continue;
            case S.ATTRIB_VALUE_UNQUOTED:
              if (!I(x)) {
                x === "&" ? E.state = S.ATTRIB_VALUE_ENTITY_U : E.attribValue += x;
                continue;
              }
              K(E), x === ">" ? ue(E) : E.state = S.ATTRIB;
              continue;
            case S.CLOSE_TAG:
              if (E.tagName)
                x === ">" ? he(E) : F(R, x) ? E.tagName += x : E.script ? (E.script += "</" + E.tagName + x, E.tagName = "", E.state = S.SCRIPT) : (C(x) || Z(E, "Invalid tagname in closing tag"), E.state = S.CLOSE_TAG_SAW_WHITE);
              else {
                if (C(x))
                  continue;
                B(_, x) ? E.script ? (E.script += "</" + x, E.state = S.SCRIPT) : Z(E, "Invalid tagname in closing tag.") : E.tagName = x;
              }
              continue;
            case S.CLOSE_TAG_SAW_WHITE:
              if (C(x))
                continue;
              x === ">" ? he(E) : Z(E, "Invalid characters in closing tag");
              continue;
            case S.TEXT_ENTITY:
            case S.ATTRIB_VALUE_ENTITY_Q:
            case S.ATTRIB_VALUE_ENTITY_U:
              var be, De;
              switch (E.state) {
                case S.TEXT_ENTITY:
                  be = S.TEXT, De = "textNode";
                  break;
                case S.ATTRIB_VALUE_ENTITY_Q:
                  be = S.ATTRIB_VALUE_QUOTED, De = "attribValue";
                  break;
                case S.ATTRIB_VALUE_ENTITY_U:
                  be = S.ATTRIB_VALUE_UNQUOTED, De = "attribValue";
                  break;
              }
              if (x === ";") {
                var Ne = me(E);
                E.opt.unparsedEntities && !Object.values(d.XML_ENTITIES).includes(Ne) ? ((E.entityCount += 1) > E.opt.maxEntityCount && X(
                  E,
                  "Parsed entity count exceeds max entity count"
                ), (E.entityDepth += 1) > E.opt.maxEntityDepth && X(
                  E,
                  "Parsed entity depth exceeds max entity depth"
                ), E.entity = "", E.state = be, E.write(Ne), E.entityDepth -= 1) : (E[De] += Ne, E.entity = "", E.state = be);
              } else F(E.entity.length ? D : b, x) ? E.entity += x : (Z(E, "Invalid character in entity name"), E[De] += "&" + E.entity + x, E.entity = "", E.state = be);
              continue;
            default:
              throw new Error(E, "Unknown state: " + E.state);
          }
        return E.position >= E.bufferCheckPosition && c(E), E;
      }
      String.fromCodePoint || (function() {
        var v = String.fromCharCode, E = Math.floor, $ = function() {
          var x = 16384, ge = [], Se, be, De = -1, Ne = arguments.length;
          if (!Ne)
            return "";
          for (var $e = ""; ++De < Ne; ) {
            var Re = Number(arguments[De]);
            if (!isFinite(Re) || // `NaN`, `+Infinity`, or `-Infinity`
            Re < 0 || // not a valid Unicode code point
            Re > 1114111 || // not a valid Unicode code point
            E(Re) !== Re)
              throw RangeError("Invalid code point: " + Re);
            Re <= 65535 ? ge.push(Re) : (Re -= 65536, Se = (Re >> 10) + 55296, be = Re % 1024 + 56320, ge.push(Se, be)), (De + 1 === Ne || ge.length > x) && ($e += v.apply(null, ge), ge.length = 0);
          }
          return $e;
        };
        Object.defineProperty ? Object.defineProperty(String, "fromCodePoint", {
          value: $,
          configurable: !0,
          writable: !0
        }) : String.fromCodePoint = $;
      })();
    })(n);
  })(Nn)), Nn;
}
var ws;
function Gc() {
  if (ws) return Nt;
  ws = 1, Object.defineProperty(Nt, "__esModule", { value: !0 }), Nt.XElement = void 0, Nt.parseXml = i;
  const n = Hc(), d = $r();
  class p {
    constructor(a) {
      if (this.name = a, this.value = "", this.attributes = null, this.isCData = !1, this.elements = null, !a)
        throw (0, d.newError)("Element name cannot be empty", "ERR_XML_ELEMENT_NAME_EMPTY");
      if (!c(a))
        throw (0, d.newError)(`Invalid element name: ${a}`, "ERR_XML_ELEMENT_INVALID_NAME");
    }
    attribute(a) {
      const s = this.attributes === null ? null : this.attributes[a];
      if (s == null)
        throw (0, d.newError)(`No attribute "${a}"`, "ERR_XML_MISSED_ATTRIBUTE");
      return s;
    }
    removeAttribute(a) {
      this.attributes !== null && delete this.attributes[a];
    }
    element(a, s = !1, r = null) {
      const t = this.elementOrNull(a, s);
      if (t === null)
        throw (0, d.newError)(r || `No element "${a}"`, "ERR_XML_MISSED_ELEMENT");
      return t;
    }
    elementOrNull(a, s = !1) {
      if (this.elements === null)
        return null;
      for (const r of this.elements)
        if (l(r, a, s))
          return r;
      return null;
    }
    getElements(a, s = !1) {
      return this.elements === null ? [] : this.elements.filter((r) => l(r, a, s));
    }
    elementValueOrEmpty(a, s = !1) {
      const r = this.elementOrNull(a, s);
      return r === null ? "" : r.value;
    }
  }
  Nt.XElement = p;
  const f = new RegExp(/^[A-Za-z_][:A-Za-z0-9_-]*$/i);
  function c(u) {
    return f.test(u);
  }
  function l(u, a, s) {
    const r = u.name;
    return r === a || s === !0 && r.length === a.length && r.toLowerCase() === a.toLowerCase();
  }
  function i(u) {
    let a = null;
    const s = n.parser(!0, {}), r = [];
    return s.onopentag = (t) => {
      const o = new p(t.name);
      if (o.attributes = t.attributes, a === null)
        a = o;
      else {
        const h = r[r.length - 1];
        h.elements == null && (h.elements = []), h.elements.push(o);
      }
      r.push(o);
    }, s.onclosetag = () => {
      r.pop();
    }, s.ontext = (t) => {
      r.length > 0 && (r[r.length - 1].value = t);
    }, s.oncdata = (t) => {
      const o = r[r.length - 1];
      o.value = t, o.isCData = !0;
    }, s.onerror = (t) => {
      throw t;
    }, s.write(u), a;
  }
  return Nt;
}
var ct = {}, _s;
function Vc() {
  if (_s) return ct;
  _s = 1, Object.defineProperty(ct, "__esModule", { value: !0 }), ct.mapToObject = n, ct.isValidKey = d, ct.asArray = p, ct.deepAssign = i, ct.objectToArgs = s;
  function n(r) {
    const t = {};
    for (const [o, h] of r)
      d(o) && (h instanceof Map ? t[o] = n(h) : t[o] = h);
    return t;
  }
  function d(r) {
    return ["__proto__", "prototype", "constructor"].includes(r) ? !1 : ["string", "number", "symbol", "boolean"].includes(typeof r) || r === null;
  }
  function p(r) {
    return r == null ? [] : Array.isArray(r) ? r : [r];
  }
  function f(r) {
    if (Array.isArray(r))
      return !1;
    const t = typeof r;
    return t === "object" || t === "function";
  }
  function c(r, t, o) {
    const h = t[o];
    if (h === void 0)
      return;
    const g = r[o];
    g == null || h == null || !f(g) || !f(h) ? Array.isArray(g) && Array.isArray(h) ? r[o] = Array.from(new Set(g.concat(h))) : r[o] = h : r[o] = l(g, h);
  }
  function l(r, t) {
    if (r !== t)
      for (const o of Object.getOwnPropertyNames(t))
        d(o) && c(r, t, o);
    return r;
  }
  function i(r, ...t) {
    for (const o of t)
      o != null && l(r, o);
    return r;
  }
  const u = /^[a-zA-Z][a-zA-Z0-9-]*$/, a = /[\0\r\n]/;
  function s(r) {
    const t = Object.entries(r).reduce((o, [h, g]) => {
      if (!d(h) || g == null)
        return o;
      if (!u.test(h))
        throw new Error(`objectToArgs: unsafe flag name rejected: ${JSON.stringify(h)}`);
      if (a.test(g))
        throw new Error(`objectToArgs: value for --${h} contains a null byte or newline`);
      return o.concat([`--${h}`, g]);
    }, []);
    return Object.freeze(t);
  }
  return ct;
}
var As;
function Le() {
  return As || (As = 1, (function(n) {
    Object.defineProperty(n, "__esModule", { value: !0 }), n.CURRENT_APP_PACKAGE_FILE_NAME = n.CURRENT_APP_INSTALLER_FILE_NAME = n.objectToArgs = n.deepAssign = n.asArray = n.mapToObject = n.isValidKey = n.XElement = n.parseXml = n.UUID = n.parseDn = n.retry = n.githubTagPrefix = n.githubUrl = n.getS3LikeProviderBaseUrl = n.ProgressCallbackTransform = n.MemoLazy = n.safeStringifyJson = n.safeGetHeader = n.parseJson = n.isSensitiveFieldName = n.HttpExecutor = n.hashSensitiveValue = n.HttpError = n.DigestTransform = n.createHttpError = n.configureRequestUrl = n.configureRequestOptionsFromUrl = n.configureRequestOptions = n.newError = n.CancellationToken = n.CancellationError = void 0;
    var d = Qi();
    Object.defineProperty(n, "CancellationError", { enumerable: !0, get: function() {
      return d.CancellationError;
    } }), Object.defineProperty(n, "CancellationToken", { enumerable: !0, get: function() {
      return d.CancellationToken;
    } });
    var p = $r();
    Object.defineProperty(n, "newError", { enumerable: !0, get: function() {
      return p.newError;
    } });
    var f = kc();
    Object.defineProperty(n, "configureRequestOptions", { enumerable: !0, get: function() {
      return f.configureRequestOptions;
    } }), Object.defineProperty(n, "configureRequestOptionsFromUrl", { enumerable: !0, get: function() {
      return f.configureRequestOptionsFromUrl;
    } }), Object.defineProperty(n, "configureRequestUrl", { enumerable: !0, get: function() {
      return f.configureRequestUrl;
    } }), Object.defineProperty(n, "createHttpError", { enumerable: !0, get: function() {
      return f.createHttpError;
    } }), Object.defineProperty(n, "DigestTransform", { enumerable: !0, get: function() {
      return f.DigestTransform;
    } }), Object.defineProperty(n, "HttpError", { enumerable: !0, get: function() {
      return f.HttpError;
    } }), Object.defineProperty(n, "hashSensitiveValue", { enumerable: !0, get: function() {
      return f.hashSensitiveValue;
    } }), Object.defineProperty(n, "HttpExecutor", { enumerable: !0, get: function() {
      return f.HttpExecutor;
    } }), Object.defineProperty(n, "isSensitiveFieldName", { enumerable: !0, get: function() {
      return f.isSensitiveFieldName;
    } }), Object.defineProperty(n, "parseJson", { enumerable: !0, get: function() {
      return f.parseJson;
    } }), Object.defineProperty(n, "safeGetHeader", { enumerable: !0, get: function() {
      return f.safeGetHeader;
    } }), Object.defineProperty(n, "safeStringifyJson", { enumerable: !0, get: function() {
      return f.safeStringifyJson;
    } });
    var c = qc();
    Object.defineProperty(n, "MemoLazy", { enumerable: !0, get: function() {
      return c.MemoLazy;
    } });
    var l = Nl();
    Object.defineProperty(n, "ProgressCallbackTransform", { enumerable: !0, get: function() {
      return l.ProgressCallbackTransform;
    } });
    var i = $c();
    Object.defineProperty(n, "getS3LikeProviderBaseUrl", { enumerable: !0, get: function() {
      return i.getS3LikeProviderBaseUrl;
    } }), Object.defineProperty(n, "githubUrl", { enumerable: !0, get: function() {
      return i.githubUrl;
    } }), Object.defineProperty(n, "githubTagPrefix", { enumerable: !0, get: function() {
      return i.githubTagPrefix;
    } });
    var u = Mc();
    Object.defineProperty(n, "retry", { enumerable: !0, get: function() {
      return u.retry;
    } });
    var a = Bc();
    Object.defineProperty(n, "parseDn", { enumerable: !0, get: function() {
      return a.parseDn;
    } });
    var s = jc();
    Object.defineProperty(n, "UUID", { enumerable: !0, get: function() {
      return s.UUID;
    } });
    var r = Gc();
    Object.defineProperty(n, "parseXml", { enumerable: !0, get: function() {
      return r.parseXml;
    } }), Object.defineProperty(n, "XElement", { enumerable: !0, get: function() {
      return r.XElement;
    } });
    var t = Vc();
    Object.defineProperty(n, "isValidKey", { enumerable: !0, get: function() {
      return t.isValidKey;
    } }), Object.defineProperty(n, "mapToObject", { enumerable: !0, get: function() {
      return t.mapToObject;
    } }), Object.defineProperty(n, "asArray", { enumerable: !0, get: function() {
      return t.asArray;
    } }), Object.defineProperty(n, "deepAssign", { enumerable: !0, get: function() {
      return t.deepAssign;
    } }), Object.defineProperty(n, "objectToArgs", { enumerable: !0, get: function() {
      return t.objectToArgs;
    } }), n.CURRENT_APP_INSTALLER_FILE_NAME = "installer.exe", n.CURRENT_APP_PACKAGE_FILE_NAME = "package.7z";
  })(Cn)), Cn;
}
var qe = {}, Nr = {}, ft = {}, Rs;
function pr() {
  if (Rs) return ft;
  Rs = 1;
  function n(i) {
    return typeof i > "u" || i === null;
  }
  function d(i) {
    return typeof i == "object" && i !== null;
  }
  function p(i) {
    return Array.isArray(i) ? i : n(i) ? [] : [i];
  }
  function f(i, u) {
    if (u) {
      const a = Object.keys(u);
      for (let s = 0, r = a.length; s < r; s += 1) {
        const t = a[s];
        i[t] = u[t];
      }
    }
    return i;
  }
  function c(i, u) {
    let a = "";
    for (let s = 0; s < u; s += 1)
      a += i;
    return a;
  }
  function l(i) {
    return i === 0 && Number.NEGATIVE_INFINITY === 1 / i;
  }
  return ft.isNothing = n, ft.isObject = d, ft.toArray = p, ft.repeat = c, ft.isNegativeZero = l, ft.extend = f, ft;
}
var Fn, Ts;
function mr() {
  if (Ts) return Fn;
  Ts = 1;
  function n(p, f) {
    let c = "";
    const l = p.reason || "(unknown reason)";
    return p.mark ? (p.mark.name && (c += 'in "' + p.mark.name + '" '), c += "(" + (p.mark.line + 1) + ":" + (p.mark.column + 1) + ")", !f && p.mark.snippet && (c += `

` + p.mark.snippet), l + " " + c) : l;
  }
  function d(p, f) {
    Error.call(this), this.name = "YAMLException", this.reason = p, this.mark = f, this.message = n(this, !1), Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : this.stack = new Error().stack || "";
  }
  return d.prototype = Object.create(Error.prototype), d.prototype.constructor = d, d.prototype.toString = function(f) {
    return this.name + ": " + n(this, f);
  }, Fn = d, Fn;
}
var xn, Ss;
function Wc() {
  if (Ss) return xn;
  Ss = 1;
  const n = pr();
  function d(c, l, i, u, a) {
    let s = "", r = "";
    const t = Math.floor(a / 2) - 1;
    return u - l > t && (s = " ... ", l = u - t + s.length), i - u > t && (r = " ...", i = u + t - r.length), {
      str: s + c.slice(l, i).replace(/\t/g, "→") + r,
      pos: u - l + s.length
      // relative position
    };
  }
  function p(c, l) {
    return n.repeat(" ", l - c.length) + c;
  }
  function f(c, l) {
    if (l = Object.create(l || null), !c.buffer) return null;
    l.maxLength || (l.maxLength = 79), typeof l.indent != "number" && (l.indent = 1), typeof l.linesBefore != "number" && (l.linesBefore = 3), typeof l.linesAfter != "number" && (l.linesAfter = 2);
    const i = /\r?\n|\r|\0/g, u = [0], a = [];
    let s, r = -1;
    for (; s = i.exec(c.buffer); )
      a.push(s.index), u.push(s.index + s[0].length), c.position <= s.index && r < 0 && (r = u.length - 2);
    r < 0 && (r = u.length - 1);
    let t = "";
    const o = Math.min(c.line + l.linesAfter, a.length).toString().length, h = l.maxLength - (l.indent + o + 3);
    for (let y = 1; y <= l.linesBefore && !(r - y < 0); y++) {
      const m = d(
        c.buffer,
        u[r - y],
        a[r - y],
        c.position - (u[r] - u[r - y]),
        h
      );
      t = n.repeat(" ", l.indent) + p((c.line - y + 1).toString(), o) + " | " + m.str + `
` + t;
    }
    const g = d(c.buffer, u[r], a[r], c.position, h);
    t += n.repeat(" ", l.indent) + p((c.line + 1).toString(), o) + " | " + g.str + `
`, t += n.repeat("-", l.indent + o + 3 + g.pos) + `^
`;
    for (let y = 1; y <= l.linesAfter && !(r + y >= a.length); y++) {
      const m = d(
        c.buffer,
        u[r + y],
        a[r + y],
        c.position - (u[r] - u[r + y]),
        h
      );
      t += n.repeat(" ", l.indent) + p((c.line + y + 1).toString(), o) + " | " + m.str + `
`;
    }
    return t.replace(/\n$/, "");
  }
  return xn = f, xn;
}
var Ln, bs;
function Be() {
  if (bs) return Ln;
  bs = 1;
  const n = mr(), d = [
    "kind",
    "multi",
    "resolve",
    "construct",
    "instanceOf",
    "predicate",
    "represent",
    "representName",
    "defaultStyle",
    "styleAliases"
  ], p = [
    "scalar",
    "sequence",
    "mapping"
  ];
  function f(l) {
    const i = {};
    return l !== null && Object.keys(l).forEach(function(u) {
      l[u].forEach(function(a) {
        i[String(a)] = u;
      });
    }), i;
  }
  function c(l, i) {
    if (i = i || {}, Object.keys(i).forEach(function(u) {
      if (d.indexOf(u) === -1)
        throw new n('Unknown option "' + u + '" is met in definition of "' + l + '" YAML type.');
    }), this.options = i, this.tag = l, this.kind = i.kind || null, this.resolve = i.resolve || function() {
      return !0;
    }, this.construct = i.construct || function(u) {
      return u;
    }, this.instanceOf = i.instanceOf || null, this.predicate = i.predicate || null, this.represent = i.represent || null, this.representName = i.representName || null, this.defaultStyle = i.defaultStyle || null, this.multi = i.multi || !1, this.styleAliases = f(i.styleAliases || null), p.indexOf(this.kind) === -1)
      throw new n('Unknown kind "' + this.kind + '" is specified for "' + l + '" YAML type.');
  }
  return Ln = c, Ln;
}
var Un, Cs;
function Fl() {
  if (Cs) return Un;
  Cs = 1;
  const n = mr(), d = Be();
  function p(l, i) {
    const u = [];
    return l[i].forEach(function(a) {
      let s = u.length;
      u.forEach(function(r, t) {
        r.tag === a.tag && r.kind === a.kind && r.multi === a.multi && (s = t);
      }), u[s] = a;
    }), u;
  }
  function f() {
    const l = {
      scalar: {},
      sequence: {},
      mapping: {},
      fallback: {},
      multi: {
        scalar: [],
        sequence: [],
        mapping: [],
        fallback: []
      }
    };
    function i(u) {
      u.multi ? (l.multi[u.kind].push(u), l.multi.fallback.push(u)) : l[u.kind][u.tag] = l.fallback[u.tag] = u;
    }
    for (let u = 0, a = arguments.length; u < a; u += 1)
      arguments[u].forEach(i);
    return l;
  }
  function c(l) {
    return this.extend(l);
  }
  return c.prototype.extend = function(i) {
    let u = [], a = [];
    if (i instanceof d)
      a.push(i);
    else if (Array.isArray(i))
      a = a.concat(i);
    else if (i && (Array.isArray(i.implicit) || Array.isArray(i.explicit)))
      i.implicit && (u = u.concat(i.implicit)), i.explicit && (a = a.concat(i.explicit));
    else
      throw new n("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");
    u.forEach(function(r) {
      if (!(r instanceof d))
        throw new n("Specified list of YAML types (or a single Type object) contains a non-Type object.");
      if (r.loadKind && r.loadKind !== "scalar")
        throw new n("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");
      if (r.multi)
        throw new n("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.");
    }), a.forEach(function(r) {
      if (!(r instanceof d))
        throw new n("Specified list of YAML types (or a single Type object) contains a non-Type object.");
    });
    const s = Object.create(c.prototype);
    return s.implicit = (this.implicit || []).concat(u), s.explicit = (this.explicit || []).concat(a), s.compiledImplicit = p(s, "implicit"), s.compiledExplicit = p(s, "explicit"), s.compiledTypeMap = f(s.compiledImplicit, s.compiledExplicit), s;
  }, Un = c, Un;
}
var kn, Os;
function xl() {
  if (Os) return kn;
  Os = 1;
  const n = Be();
  return kn = new n("tag:yaml.org,2002:str", {
    kind: "scalar",
    construct: function(d) {
      return d !== null ? d : "";
    }
  }), kn;
}
var qn, Ps;
function Ll() {
  if (Ps) return qn;
  Ps = 1;
  const n = Be();
  return qn = new n("tag:yaml.org,2002:seq", {
    kind: "sequence",
    construct: function(d) {
      return d !== null ? d : [];
    }
  }), qn;
}
var $n, Is;
function Ul() {
  if (Is) return $n;
  Is = 1;
  const n = Be();
  return $n = new n("tag:yaml.org,2002:map", {
    kind: "mapping",
    construct: function(d) {
      return d !== null ? d : {};
    }
  }), $n;
}
var Mn, Ds;
function kl() {
  if (Ds) return Mn;
  Ds = 1;
  const n = Fl();
  return Mn = new n({
    explicit: [
      xl(),
      Ll(),
      Ul()
    ]
  }), Mn;
}
var Bn, Ns;
function ql() {
  if (Ns) return Bn;
  Ns = 1;
  const n = Be();
  function d(c) {
    if (c === null) return !0;
    const l = c.length;
    return l === 1 && c === "~" || l === 4 && (c === "null" || c === "Null" || c === "NULL");
  }
  function p() {
    return null;
  }
  function f(c) {
    return c === null;
  }
  return Bn = new n("tag:yaml.org,2002:null", {
    kind: "scalar",
    resolve: d,
    construct: p,
    predicate: f,
    represent: {
      canonical: function() {
        return "~";
      },
      lowercase: function() {
        return "null";
      },
      uppercase: function() {
        return "NULL";
      },
      camelcase: function() {
        return "Null";
      },
      empty: function() {
        return "";
      }
    },
    defaultStyle: "lowercase"
  }), Bn;
}
var jn, Fs;
function $l() {
  if (Fs) return jn;
  Fs = 1;
  const n = Be();
  function d(c) {
    if (c === null) return !1;
    const l = c.length;
    return l === 4 && (c === "true" || c === "True" || c === "TRUE") || l === 5 && (c === "false" || c === "False" || c === "FALSE");
  }
  function p(c) {
    return c === "true" || c === "True" || c === "TRUE";
  }
  function f(c) {
    return Object.prototype.toString.call(c) === "[object Boolean]";
  }
  return jn = new n("tag:yaml.org,2002:bool", {
    kind: "scalar",
    resolve: d,
    construct: p,
    predicate: f,
    represent: {
      lowercase: function(c) {
        return c ? "true" : "false";
      },
      uppercase: function(c) {
        return c ? "TRUE" : "FALSE";
      },
      camelcase: function(c) {
        return c ? "True" : "False";
      }
    },
    defaultStyle: "lowercase"
  }), jn;
}
var Hn, xs;
function Ml() {
  if (xs) return Hn;
  xs = 1;
  const n = pr(), d = Be();
  function p(s) {
    return s >= 48 && s <= 57 || s >= 65 && s <= 70 || s >= 97 && s <= 102;
  }
  function f(s) {
    return s >= 48 && s <= 55;
  }
  function c(s) {
    return s >= 48 && s <= 57;
  }
  function l(s) {
    if (s === null) return !1;
    const r = s.length;
    let t = 0, o = !1;
    if (!r) return !1;
    let h = s[t];
    if ((h === "-" || h === "+") && (h = s[++t]), h === "0") {
      if (t + 1 === r) return !0;
      if (h = s[++t], h === "b") {
        for (t++; t < r; t++) {
          if (h = s[t], h !== "0" && h !== "1") return !1;
          o = !0;
        }
        return o && isFinite(i(s));
      }
      if (h === "x") {
        for (t++; t < r; t++) {
          if (!p(s.charCodeAt(t))) return !1;
          o = !0;
        }
        return o && isFinite(i(s));
      }
      if (h === "o") {
        for (t++; t < r; t++) {
          if (!f(s.charCodeAt(t))) return !1;
          o = !0;
        }
        return o && isFinite(i(s));
      }
    }
    for (; t < r; t++) {
      if (!c(s.charCodeAt(t)))
        return !1;
      o = !0;
    }
    return o ? isFinite(i(s)) : !1;
  }
  function i(s) {
    let r = s, t = 1, o = r[0];
    if ((o === "-" || o === "+") && (o === "-" && (t = -1), r = r.slice(1), o = r[0]), r === "0") return 0;
    if (o === "0") {
      if (r[1] === "b") return t * parseInt(r.slice(2), 2);
      if (r[1] === "x") return t * parseInt(r.slice(2), 16);
      if (r[1] === "o") return t * parseInt(r.slice(2), 8);
    }
    return t * parseInt(r, 10);
  }
  function u(s) {
    return i(s);
  }
  function a(s) {
    return Object.prototype.toString.call(s) === "[object Number]" && s % 1 === 0 && !n.isNegativeZero(s);
  }
  return Hn = new d("tag:yaml.org,2002:int", {
    kind: "scalar",
    resolve: l,
    construct: u,
    predicate: a,
    represent: {
      binary: function(s) {
        return s >= 0 ? "0b" + s.toString(2) : "-0b" + s.toString(2).slice(1);
      },
      octal: function(s) {
        return s >= 0 ? "0o" + s.toString(8) : "-0o" + s.toString(8).slice(1);
      },
      decimal: function(s) {
        return s.toString(10);
      },
      hexadecimal: function(s) {
        return s >= 0 ? "0x" + s.toString(16).toUpperCase() : "-0x" + s.toString(16).toUpperCase().slice(1);
      }
    },
    defaultStyle: "decimal",
    styleAliases: {
      binary: [2, "bin"],
      octal: [8, "oct"],
      decimal: [10, "dec"],
      hexadecimal: [16, "hex"]
    }
  }), Hn;
}
var Gn, Ls;
function Bl() {
  if (Ls) return Gn;
  Ls = 1;
  const n = pr(), d = Be(), p = new RegExp(
    // 2.5e4, 2.5 and integers
    "^(?:[-+]?(?:[0-9]+)(?:\\.[0-9]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"
  ), f = new RegExp(
    "^(?:[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"
  );
  function c(s) {
    return s === null || !p.test(s) ? !1 : isFinite(parseFloat(s, 10)) ? !0 : f.test(s);
  }
  function l(s) {
    let r = s.toLowerCase();
    const t = r[0] === "-" ? -1 : 1;
    return "+-".indexOf(r[0]) >= 0 && (r = r.slice(1)), r === ".inf" ? t === 1 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY : r === ".nan" ? NaN : t * parseFloat(r, 10);
  }
  const i = /^[-+]?[0-9]+e/;
  function u(s, r) {
    if (isNaN(s))
      switch (r) {
        case "lowercase":
          return ".nan";
        case "uppercase":
          return ".NAN";
        case "camelcase":
          return ".NaN";
      }
    else if (Number.POSITIVE_INFINITY === s)
      switch (r) {
        case "lowercase":
          return ".inf";
        case "uppercase":
          return ".INF";
        case "camelcase":
          return ".Inf";
      }
    else if (Number.NEGATIVE_INFINITY === s)
      switch (r) {
        case "lowercase":
          return "-.inf";
        case "uppercase":
          return "-.INF";
        case "camelcase":
          return "-.Inf";
      }
    else if (n.isNegativeZero(s))
      return "-0.0";
    const t = s.toString(10);
    return i.test(t) ? t.replace("e", ".e") : t;
  }
  function a(s) {
    return Object.prototype.toString.call(s) === "[object Number]" && (s % 1 !== 0 || n.isNegativeZero(s));
  }
  return Gn = new d("tag:yaml.org,2002:float", {
    kind: "scalar",
    resolve: c,
    construct: l,
    predicate: a,
    represent: u,
    defaultStyle: "lowercase"
  }), Gn;
}
var Vn, Us;
function jl() {
  return Us || (Us = 1, Vn = kl().extend({
    implicit: [
      ql(),
      $l(),
      Ml(),
      Bl()
    ]
  })), Vn;
}
var Wn, ks;
function Hl() {
  return ks || (ks = 1, Wn = jl()), Wn;
}
var Yn, qs;
function Gl() {
  if (qs) return Yn;
  qs = 1;
  const n = Be(), d = new RegExp(
    "^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"
  ), p = new RegExp(
    "^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$"
  );
  function f(i) {
    return i === null ? !1 : d.exec(i) !== null || p.exec(i) !== null;
  }
  function c(i) {
    let u = 0, a = null, s = d.exec(i);
    if (s === null && (s = p.exec(i)), s === null) throw new Error("Date resolve error");
    const r = +s[1], t = +s[2] - 1, o = +s[3];
    if (!s[4])
      return new Date(Date.UTC(r, t, o));
    const h = +s[4], g = +s[5], y = +s[6];
    if (s[7]) {
      for (u = s[7].slice(0, 3); u.length < 3; )
        u += "0";
      u = +u;
    }
    if (s[9]) {
      const _ = +s[10], R = +(s[11] || 0);
      a = (_ * 60 + R) * 6e4, s[9] === "-" && (a = -a);
    }
    const m = new Date(Date.UTC(r, t, o, h, g, y, u));
    return a && m.setTime(m.getTime() - a), m;
  }
  function l(i) {
    return i.toISOString();
  }
  return Yn = new n("tag:yaml.org,2002:timestamp", {
    kind: "scalar",
    resolve: f,
    construct: c,
    instanceOf: Date,
    represent: l
  }), Yn;
}
var zn, $s;
function Vl() {
  if ($s) return zn;
  $s = 1;
  const n = Be();
  function d(p) {
    return p === "<<" || p === null;
  }
  return zn = new n("tag:yaml.org,2002:merge", {
    kind: "scalar",
    resolve: d
  }), zn;
}
var Xn, Ms;
function Wl() {
  if (Ms) return Xn;
  Ms = 1;
  const n = Be(), d = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=
\r`;
  function p(i) {
    if (i === null) return !1;
    let u = 0;
    const a = i.length, s = d;
    for (let r = 0; r < a; r++) {
      const t = s.indexOf(i.charAt(r));
      if (!(t > 64)) {
        if (t < 0) return !1;
        u += 6;
      }
    }
    return u % 8 === 0;
  }
  function f(i) {
    const u = i.replace(/[\r\n=]/g, ""), a = u.length, s = d;
    let r = 0;
    const t = [];
    for (let h = 0; h < a; h++)
      h % 4 === 0 && h && (t.push(r >> 16 & 255), t.push(r >> 8 & 255), t.push(r & 255)), r = r << 6 | s.indexOf(u.charAt(h));
    const o = a % 4 * 6;
    return o === 0 ? (t.push(r >> 16 & 255), t.push(r >> 8 & 255), t.push(r & 255)) : o === 18 ? (t.push(r >> 10 & 255), t.push(r >> 2 & 255)) : o === 12 && t.push(r >> 4 & 255), new Uint8Array(t);
  }
  function c(i) {
    let u = "", a = 0;
    const s = i.length, r = d;
    for (let o = 0; o < s; o++)
      o % 3 === 0 && o && (u += r[a >> 18 & 63], u += r[a >> 12 & 63], u += r[a >> 6 & 63], u += r[a & 63]), a = (a << 8) + i[o];
    const t = s % 3;
    return t === 0 ? (u += r[a >> 18 & 63], u += r[a >> 12 & 63], u += r[a >> 6 & 63], u += r[a & 63]) : t === 2 ? (u += r[a >> 10 & 63], u += r[a >> 4 & 63], u += r[a << 2 & 63], u += r[64]) : t === 1 && (u += r[a >> 2 & 63], u += r[a << 4 & 63], u += r[64], u += r[64]), u;
  }
  function l(i) {
    return Object.prototype.toString.call(i) === "[object Uint8Array]";
  }
  return Xn = new n("tag:yaml.org,2002:binary", {
    kind: "scalar",
    resolve: p,
    construct: f,
    predicate: l,
    represent: c
  }), Xn;
}
var Kn, Bs;
function Yl() {
  if (Bs) return Kn;
  Bs = 1;
  const n = Be(), d = Object.prototype.hasOwnProperty, p = Object.prototype.toString;
  function f(l) {
    if (l === null) return !0;
    const i = {}, u = l;
    for (let a = 0, s = u.length; a < s; a += 1) {
      const r = u[a];
      let t = !1;
      if (p.call(r) !== "[object Object]") return !1;
      let o;
      for (o in r)
        if (d.call(r, o))
          if (!t) t = !0;
          else return !1;
      if (!t || d.call(i, o)) return !1;
      Object.defineProperty(i, o, { value: !0 });
    }
    return !0;
  }
  function c(l) {
    return l !== null ? l : [];
  }
  return Kn = new n("tag:yaml.org,2002:omap", {
    kind: "sequence",
    resolve: f,
    construct: c
  }), Kn;
}
var Jn, js;
function zl() {
  if (js) return Jn;
  js = 1;
  const n = Be(), d = Object.prototype.toString;
  function p(c) {
    if (c === null) return !0;
    const l = c, i = new Array(l.length);
    for (let u = 0, a = l.length; u < a; u += 1) {
      const s = l[u];
      if (d.call(s) !== "[object Object]") return !1;
      const r = Object.keys(s);
      if (r.length !== 1) return !1;
      i[u] = [r[0], s[r[0]]];
    }
    return !0;
  }
  function f(c) {
    if (c === null) return [];
    const l = c, i = new Array(l.length);
    for (let u = 0, a = l.length; u < a; u += 1) {
      const s = l[u], r = Object.keys(s);
      i[u] = [r[0], s[r[0]]];
    }
    return i;
  }
  return Jn = new n("tag:yaml.org,2002:pairs", {
    kind: "sequence",
    resolve: p,
    construct: f
  }), Jn;
}
var Qn, Hs;
function Xl() {
  if (Hs) return Qn;
  Hs = 1;
  const n = Be(), d = Object.prototype.hasOwnProperty;
  function p(c) {
    if (c === null) return !0;
    const l = c;
    for (const i in l)
      if (d.call(l, i) && l[i] !== null)
        return !1;
    return !0;
  }
  function f(c) {
    return c !== null ? c : {};
  }
  return Qn = new n("tag:yaml.org,2002:set", {
    kind: "mapping",
    resolve: p,
    construct: f
  }), Qn;
}
var Zn, Gs;
function Zi() {
  return Gs || (Gs = 1, Zn = Hl().extend({
    implicit: [
      Gl(),
      Vl()
    ],
    explicit: [
      Wl(),
      Yl(),
      zl(),
      Xl()
    ]
  })), Zn;
}
var Vs;
function Yc() {
  if (Vs) return Nr;
  Vs = 1;
  const n = pr(), d = mr(), p = Wc(), f = Zi(), c = Object.prototype.hasOwnProperty, l = 1, i = 2, u = 3, a = 4, s = 1, r = 2, t = 3, o = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/, h = /[\x85\u2028\u2029]/, g = /[,\[\]{}]/, y = /^(?:!|!!|![0-9A-Za-z-]+!)$/, m = /^(?:!|[^,\[\]{}])(?:%[0-9a-f]{2}|[0-9a-z\-#;/?:@&=+$,_.!~*'()\[\]])*$/i;
  function _(e) {
    return Object.prototype.toString.call(e);
  }
  function R(e) {
    return e === 10 || e === 13;
  }
  function b(e) {
    return e === 9 || e === 32;
  }
  function D(e) {
    return e === 9 || e === 32 || e === 10 || e === 13;
  }
  function C(e) {
    return e === 44 || e === 91 || e === 93 || e === 123 || e === 125;
  }
  function N(e) {
    if (e >= 48 && e <= 57)
      return e - 48;
    const q = e | 32;
    return q >= 97 && q <= 102 ? q - 97 + 10 : -1;
  }
  function I(e) {
    return e === 120 ? 2 : e === 117 ? 4 : e === 85 ? 8 : 0;
  }
  function F(e) {
    return e >= 48 && e <= 57 ? e - 48 : -1;
  }
  function B(e) {
    switch (e) {
      case 48:
        return "\0";
      case 97:
        return "\x07";
      case 98:
        return "\b";
      case 116:
        return "	";
      case 9:
        return "	";
      case 110:
        return `
`;
      case 118:
        return "\v";
      case 102:
        return "\f";
      case 114:
        return "\r";
      case 101:
        return "\x1B";
      case 32:
        return " ";
      case 34:
        return '"';
      case 47:
        return "/";
      case 92:
        return "\\";
      case 78:
        return "";
      case 95:
        return " ";
      case 76:
        return "\u2028";
      case 80:
        return "\u2029";
      default:
        return "";
    }
  }
  function S(e) {
    return e <= 65535 ? String.fromCharCode(e) : String.fromCharCode(
      (e - 65536 >> 10) + 55296,
      (e - 65536 & 1023) + 56320
    );
  }
  function Y(e, q, W) {
    q === "__proto__" ? Object.defineProperty(e, q, {
      configurable: !0,
      enumerable: !0,
      writable: !0,
      value: W
    }) : e[q] = W;
  }
  const H = new Array(256), V = new Array(256);
  for (let e = 0; e < 256; e++)
    H[e] = B(e) ? 1 : 0, V[e] = B(e);
  function L(e, q) {
    this.input = e, this.filename = q.filename || null, this.schema = q.schema || f, this.onWarning = q.onWarning || null, this.legacy = q.legacy || !1, this.json = q.json || !1, this.listener = q.listener || null, this.maxDepth = typeof q.maxDepth == "number" ? q.maxDepth : 100, this.maxTotalMergeKeys = typeof q.maxTotalMergeKeys == "number" ? q.maxTotalMergeKeys : 1e4, this.implicitTypes = this.schema.compiledImplicit, this.typeMap = this.schema.compiledTypeMap, this.length = e.length, this.position = 0, this.line = 0, this.lineStart = 0, this.lineIndent = 0, this.depth = 0, this.totalMergeKeys = 0, this.firstTabInLine = -1, this.documents = [], this.anchorMapTransactions = [];
  }
  function O(e, q) {
    const W = {
      name: e.filename,
      buffer: e.input.slice(0, -1),
      // omit trailing \0
      position: e.position,
      line: e.line,
      column: e.position - e.lineStart
    };
    return W.snippet = p(W), new d(q, W);
  }
  function A(e, q) {
    throw O(e, q);
  }
  function P(e, q) {
    e.onWarning && e.onWarning.call(null, O(e, q));
  }
  function k(e, q, W) {
    const Q = e.anchorMapTransactions;
    if (Q.length !== 0) {
      const G = Q[Q.length - 1];
      c.call(G, q) || (G[q] = {
        existed: c.call(e.anchorMap, q),
        value: e.anchorMap[q]
      });
    }
    e.anchorMap[q] = W;
  }
  function j(e) {
    e.anchorMapTransactions.push(/* @__PURE__ */ Object.create(null));
  }
  function X(e) {
    const q = e.anchorMapTransactions.pop(), W = e.anchorMapTransactions;
    if (W.length === 0) return;
    const Q = W[W.length - 1], G = Object.keys(q);
    for (let ie = 0, w = G.length; ie < w; ie += 1) {
      const M = G[ie];
      c.call(Q, M) || (Q[M] = q[M]);
    }
  }
  function oe(e) {
    const q = e.anchorMapTransactions.pop(), W = Object.keys(q);
    for (let Q = W.length - 1; Q >= 0; Q -= 1) {
      const G = q[W[Q]];
      G.existed ? e.anchorMap[W[Q]] = G.value : delete e.anchorMap[W[Q]];
    }
  }
  function Z(e) {
    return {
      position: e.position,
      line: e.line,
      lineStart: e.lineStart,
      lineIndent: e.lineIndent,
      firstTabInLine: e.firstTabInLine,
      tag: e.tag,
      anchor: e.anchor,
      kind: e.kind,
      result: e.result
    };
  }
  function de(e, q) {
    e.position = q.position, e.line = q.line, e.lineStart = q.lineStart, e.lineIndent = q.lineIndent, e.firstTabInLine = q.firstTabInLine, e.tag = q.tag, e.anchor = q.anchor, e.kind = q.kind, e.result = q.result;
  }
  const ye = {
    YAML: function(q, W, Q) {
      q.version !== null && A(q, "duplication of %YAML directive"), Q.length !== 1 && A(q, "YAML directive accepts exactly one argument");
      const G = /^([0-9]+)\.([0-9]+)$/.exec(Q[0]);
      G === null && A(q, "ill-formed argument of the YAML directive");
      const ie = parseInt(G[1], 10), w = parseInt(G[2], 10);
      ie !== 1 && A(q, "unacceptable YAML version of the document"), q.version = Q[0], q.checkLineBreaks = w < 2, w !== 1 && w !== 2 && P(q, "unsupported YAML version of the document");
    },
    TAG: function(q, W, Q) {
      let G;
      Q.length !== 2 && A(q, "TAG directive accepts exactly two arguments");
      const ie = Q[0];
      G = Q[1], y.test(ie) || A(q, "ill-formed tag handle (first argument) of the TAG directive"), c.call(q.tagMap, ie) && A(q, 'there is a previously declared suffix for "' + ie + '" tag handle'), m.test(G) || A(q, "ill-formed tag prefix (second argument) of the TAG directive");
      try {
        G = decodeURIComponent(G);
      } catch {
        A(q, "tag prefix is malformed: " + G);
      }
      q.tagMap[ie] = G;
    }
  };
  function K(e, q, W, Q) {
    if (q < W) {
      const G = e.input.slice(q, W);
      if (Q)
        for (let ie = 0, w = G.length; ie < w; ie += 1) {
          const M = G.charCodeAt(ie);
          M === 9 || M >= 32 && M <= 1114111 || A(e, "expected valid JSON character");
        }
      else o.test(G) && A(e, "the stream contains non-printable characters");
      e.result += G;
    }
  }
  function ue(e, q, W, Q) {
    n.isObject(W) || A(e, "cannot merge mappings; the provided source object is unacceptable");
    const G = Object.keys(W);
    for (let ie = 0, w = G.length; ie < w; ie += 1) {
      const M = G[ie];
      e.maxTotalMergeKeys !== -1 && ++e.totalMergeKeys > e.maxTotalMergeKeys && A(e, "merge keys exceeded maxTotalMergeKeys (" + e.maxTotalMergeKeys + ")"), c.call(q, M) || (Y(q, M, W[M]), Q[M] = !0);
    }
  }
  function he(e, q, W, Q, G, ie, w, M, ne) {
    if (Array.isArray(G)) {
      G = Array.prototype.slice.call(G);
      for (let z = 0, J = G.length; z < J; z += 1)
        Array.isArray(G[z]) && A(e, "nested arrays are not supported inside keys"), typeof G == "object" && _(G[z]) === "[object Object]" && (G[z] = "[object Object]");
    }
    if (typeof G == "object" && _(G) === "[object Object]" && (G = "[object Object]"), G = String(G), q === null && (q = {}), Q === "tag:yaml.org,2002:merge")
      if (Array.isArray(ie))
        for (let z = 0, J = ie.length; z < J; z += 1)
          ue(e, q, ie[z], W);
      else
        ue(e, q, ie, W);
    else
      !e.json && !c.call(W, G) && c.call(q, G) && (e.line = w || e.line, e.lineStart = M || e.lineStart, e.position = ne || e.position, A(e, "duplicated mapping key")), Y(q, G, ie), delete W[G];
    return q;
  }
  function me(e) {
    const q = e.input.charCodeAt(e.position);
    q === 10 ? e.position++ : q === 13 ? (e.position++, e.input.charCodeAt(e.position) === 10 && e.position++) : A(e, "a line break is expected"), e.line += 1, e.lineStart = e.position, e.firstTabInLine = -1;
  }
  function pe(e, q, W) {
    let Q = 0, G = e.input.charCodeAt(e.position);
    for (; G !== 0; ) {
      for (; b(G); )
        G === 9 && e.firstTabInLine === -1 && (e.firstTabInLine = e.position), G = e.input.charCodeAt(++e.position);
      if (q && G === 35)
        do
          G = e.input.charCodeAt(++e.position);
        while (G !== 10 && G !== 13 && G !== 0);
      if (R(G))
        for (me(e), G = e.input.charCodeAt(e.position), Q++, e.lineIndent = 0; G === 32; )
          e.lineIndent++, G = e.input.charCodeAt(++e.position);
      else
        break;
    }
    return W !== -1 && Q !== 0 && e.lineIndent < W && P(e, "deficient indentation"), Q;
  }
  function _e(e) {
    let q = e.position, W = e.input.charCodeAt(q);
    return !!((W === 45 || W === 46) && W === e.input.charCodeAt(q + 1) && W === e.input.charCodeAt(q + 2) && (q += 3, W = e.input.charCodeAt(q), W === 0 || D(W)));
  }
  function ve(e, q) {
    q === 1 ? e.result += " " : q > 1 && (e.result += n.repeat(`
`, q - 1));
  }
  function Ae(e, q, W) {
    let Q, G, ie, w, M, ne;
    const z = e.kind, J = e.result;
    let ee = e.input.charCodeAt(e.position);
    if (D(ee) || C(ee) || ee === 35 || ee === 38 || ee === 42 || ee === 33 || ee === 124 || ee === 62 || ee === 39 || ee === 34 || ee === 37 || ee === 64 || ee === 96)
      return !1;
    if (ee === 63 || ee === 45) {
      const re = e.input.charCodeAt(e.position + 1);
      if (D(re) || W && C(re))
        return !1;
    }
    for (e.kind = "scalar", e.result = "", Q = G = e.position, ie = !1; ee !== 0; ) {
      if (ee === 58) {
        const re = e.input.charCodeAt(e.position + 1);
        if (D(re) || W && C(re))
          break;
      } else if (ee === 35) {
        const re = e.input.charCodeAt(e.position - 1);
        if (D(re))
          break;
      } else {
        if (e.position === e.lineStart && _e(e) || W && C(ee))
          break;
        if (R(ee))
          if (w = e.line, M = e.lineStart, ne = e.lineIndent, pe(e, !1, -1), e.lineIndent >= q) {
            ie = !0, ee = e.input.charCodeAt(e.position);
            continue;
          } else {
            e.position = G, e.line = w, e.lineStart = M, e.lineIndent = ne;
            break;
          }
      }
      ie && (K(e, Q, G, !1), ve(e, e.line - w), Q = G = e.position, ie = !1), b(ee) || (G = e.position + 1), ee = e.input.charCodeAt(++e.position);
    }
    return K(e, Q, G, !1), e.result ? !0 : (e.kind = z, e.result = J, !1);
  }
  function v(e, q) {
    let W, Q, G = e.input.charCodeAt(e.position);
    if (G !== 39)
      return !1;
    for (e.kind = "scalar", e.result = "", e.position++, W = Q = e.position; (G = e.input.charCodeAt(e.position)) !== 0; )
      if (G === 39)
        if (K(e, W, e.position, !0), G = e.input.charCodeAt(++e.position), G === 39)
          W = e.position, e.position++, Q = e.position;
        else
          return !0;
      else R(G) ? (K(e, W, Q, !0), ve(e, pe(e, !1, q)), W = Q = e.position) : e.position === e.lineStart && _e(e) ? A(e, "unexpected end of the document within a single quoted scalar") : (e.position++, b(G) || (Q = e.position));
    A(e, "unexpected end of the stream within a single quoted scalar");
  }
  function E(e, q) {
    let W, Q, G, ie = e.input.charCodeAt(e.position);
    if (ie !== 34)
      return !1;
    for (e.kind = "scalar", e.result = "", e.position++, W = Q = e.position; (ie = e.input.charCodeAt(e.position)) !== 0; ) {
      if (ie === 34)
        return K(e, W, e.position, !0), e.position++, !0;
      if (ie === 92) {
        if (K(e, W, e.position, !0), ie = e.input.charCodeAt(++e.position), R(ie))
          pe(e, !1, q);
        else if (ie < 256 && H[ie])
          e.result += V[ie], e.position++;
        else if ((G = I(ie)) > 0) {
          let w = G, M = 0;
          for (; w > 0; w--)
            ie = e.input.charCodeAt(++e.position), (G = N(ie)) >= 0 ? M = (M << 4) + G : A(e, "expected hexadecimal character");
          e.result += S(M), e.position++;
        } else
          A(e, "unknown escape sequence");
        W = Q = e.position;
      } else R(ie) ? (K(e, W, Q, !0), ve(e, pe(e, !1, q)), W = Q = e.position) : e.position === e.lineStart && _e(e) ? A(e, "unexpected end of the document within a double quoted scalar") : (e.position++, b(ie) || (Q = e.position));
    }
    A(e, "unexpected end of the stream within a double quoted scalar");
  }
  function $(e, q) {
    let W = !0, Q, G, ie;
    const w = e.tag;
    let M;
    const ne = e.anchor;
    let z, J, ee, re;
    const ae = /* @__PURE__ */ Object.create(null);
    let se, ce, fe, we = e.input.charCodeAt(e.position);
    if (we === 91)
      z = 93, re = !1, M = [];
    else if (we === 123)
      z = 125, re = !0, M = {};
    else
      return !1;
    for (e.anchor !== null && k(e, e.anchor, M), we = e.input.charCodeAt(++e.position); we !== 0; ) {
      if (pe(e, !0, q), we = e.input.charCodeAt(e.position), we === z)
        return e.position++, e.tag = w, e.anchor = ne, e.kind = re ? "mapping" : "sequence", e.result = M, !0;
      if (W ? we === 44 && A(e, "expected the node content, but found ','") : A(e, "missed comma between flow collection entries"), ce = se = fe = null, J = ee = !1, we === 63) {
        const Te = e.input.charCodeAt(e.position + 1);
        D(Te) && (J = ee = !0, e.position++, pe(e, !0, q));
      }
      Q = e.line, G = e.lineStart, ie = e.position, Re(e, q, l, !1, !0), ce = e.tag, se = e.result, pe(e, !0, q), we = e.input.charCodeAt(e.position), (ee || e.line === Q) && we === 58 && (J = !0, we = e.input.charCodeAt(++e.position), pe(e, !0, q), Re(e, q, l, !1, !0), fe = e.result), re ? he(e, M, ae, ce, se, fe, Q, G, ie) : J ? M.push(he(e, null, ae, ce, se, fe, Q, G, ie)) : M.push(se), pe(e, !0, q), we = e.input.charCodeAt(e.position), we === 44 ? (W = !0, we = e.input.charCodeAt(++e.position)) : W = !1;
    }
    A(e, "unexpected end of the stream within a flow collection");
  }
  function x(e, q) {
    let W, Q = s, G = !1, ie = !1, w = q, M = 0, ne = !1, z, J = e.input.charCodeAt(e.position);
    if (J === 124)
      W = !1;
    else if (J === 62)
      W = !0;
    else
      return !1;
    for (e.kind = "scalar", e.result = ""; J !== 0; )
      if (J = e.input.charCodeAt(++e.position), J === 43 || J === 45)
        s === Q ? Q = J === 43 ? t : r : A(e, "repeat of a chomping mode identifier");
      else if ((z = F(J)) >= 0)
        z === 0 ? A(e, "bad explicit indentation width of a block scalar; it cannot be less than one") : ie ? A(e, "repeat of an indentation width identifier") : (w = q + z - 1, ie = !0);
      else
        break;
    if (b(J)) {
      do
        J = e.input.charCodeAt(++e.position);
      while (b(J));
      if (J === 35)
        do
          J = e.input.charCodeAt(++e.position);
        while (!R(J) && J !== 0);
    }
    for (; J !== 0; ) {
      for (me(e), e.lineIndent = 0, J = e.input.charCodeAt(e.position); (!ie || e.lineIndent < w) && J === 32; )
        e.lineIndent++, J = e.input.charCodeAt(++e.position);
      if (!ie && e.lineIndent > w && (w = e.lineIndent), R(J)) {
        M++;
        continue;
      }
      if (!ie && w === 0 && A(e, "missing indentation for block scalar"), e.lineIndent < w) {
        Q === t ? e.result += n.repeat(`
`, G ? 1 + M : M) : Q === s && G && (e.result += `
`);
        break;
      }
      W ? b(J) ? (ne = !0, e.result += n.repeat(`
`, G ? 1 + M : M)) : ne ? (ne = !1, e.result += n.repeat(`
`, M + 1)) : M === 0 ? G && (e.result += " ") : e.result += n.repeat(`
`, M) : e.result += n.repeat(`
`, G ? 1 + M : M), G = !0, ie = !0, M = 0;
      const ee = e.position;
      for (; !R(J) && J !== 0; )
        J = e.input.charCodeAt(++e.position);
      K(e, ee, e.position, !1);
    }
    return !0;
  }
  function ge(e, q) {
    const W = e.tag, Q = e.anchor, G = [];
    let ie = !1;
    if (e.firstTabInLine !== -1) return !1;
    e.anchor !== null && k(e, e.anchor, G);
    let w = e.input.charCodeAt(e.position);
    for (; w !== 0 && (e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, A(e, "tab characters must not be used in indentation")), w === 45); ) {
      const M = e.input.charCodeAt(e.position + 1);
      if (!D(M))
        break;
      if (ie = !0, e.position++, pe(e, !0, -1) && e.lineIndent <= q) {
        G.push(null), w = e.input.charCodeAt(e.position);
        continue;
      }
      const ne = e.line;
      if (Re(e, q, u, !1, !0), G.push(e.result), pe(e, !0, -1), w = e.input.charCodeAt(e.position), (e.line === ne || e.lineIndent > q) && w !== 0)
        A(e, "bad indentation of a sequence entry");
      else if (e.lineIndent < q)
        break;
    }
    return ie ? (e.tag = W, e.anchor = Q, e.kind = "sequence", e.result = G, !0) : !1;
  }
  function Se(e, q, W) {
    let Q, G, ie, w;
    const M = e.tag, ne = e.anchor, z = {}, J = /* @__PURE__ */ Object.create(null);
    let ee = null, re = null, ae = null, se = !1, ce = !1;
    if (e.firstTabInLine !== -1) return !1;
    e.anchor !== null && k(e, e.anchor, z);
    let fe = e.input.charCodeAt(e.position);
    for (; fe !== 0; ) {
      !se && e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, A(e, "tab characters must not be used in indentation"));
      const we = e.input.charCodeAt(e.position + 1), Te = e.line;
      if ((fe === 63 || fe === 58) && D(we))
        fe === 63 ? (se && (he(e, z, J, ee, re, null, G, ie, w), ee = re = ae = null), ce = !0, se = !0, Q = !0) : se ? (se = !1, Q = !0) : A(e, "incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"), e.position += 1, fe = we;
      else {
        if (G = e.line, ie = e.lineStart, w = e.position, !Re(e, W, i, !1, !0))
          break;
        if (e.line === Te) {
          for (fe = e.input.charCodeAt(e.position); b(fe); )
            fe = e.input.charCodeAt(++e.position);
          if (fe === 58)
            fe = e.input.charCodeAt(++e.position), D(fe) || A(e, "a whitespace character is expected after the key-value separator within a block mapping"), se && (he(e, z, J, ee, re, null, G, ie, w), ee = re = ae = null), ce = !0, se = !1, Q = !1, ee = e.tag, re = e.result;
          else if (ce)
            A(e, "can not read an implicit mapping pair; a colon is missed");
          else
            return e.tag = M, e.anchor = ne, !0;
        } else if (ce)
          A(e, "can not read a block mapping entry; a multiline key may not be an implicit key");
        else
          return e.tag = M, e.anchor = ne, !0;
      }
      if ((e.line === Te || e.lineIndent > q) && (se && (G = e.line, ie = e.lineStart, w = e.position), Re(e, q, a, !0, Q) && (se ? re = e.result : ae = e.result), se || (he(e, z, J, ee, re, ae, G, ie, w), ee = re = ae = null), pe(e, !0, -1), fe = e.input.charCodeAt(e.position)), (e.line === Te || e.lineIndent > q) && fe !== 0)
        A(e, "bad indentation of a mapping entry");
      else if (e.lineIndent < q)
        break;
    }
    return se && he(e, z, J, ee, re, null, G, ie, w), ce && (e.tag = M, e.anchor = ne, e.kind = "mapping", e.result = z), ce;
  }
  function be(e) {
    let q = !1, W = !1, Q, G, ie = e.input.charCodeAt(e.position);
    if (ie !== 33) return !1;
    e.tag !== null && A(e, "duplication of a tag property"), ie = e.input.charCodeAt(++e.position), ie === 60 ? (q = !0, ie = e.input.charCodeAt(++e.position)) : ie === 33 ? (W = !0, Q = "!!", ie = e.input.charCodeAt(++e.position)) : Q = "!";
    let w = e.position;
    if (q) {
      do
        ie = e.input.charCodeAt(++e.position);
      while (ie !== 0 && ie !== 62);
      e.position < e.length ? (G = e.input.slice(w, e.position), ie = e.input.charCodeAt(++e.position)) : A(e, "unexpected end of the stream within a verbatim tag");
    } else {
      for (; ie !== 0 && !D(ie); )
        ie === 33 && (W ? A(e, "tag suffix cannot contain exclamation marks") : (Q = e.input.slice(w - 1, e.position + 1), y.test(Q) || A(e, "named tag handle cannot contain such characters"), W = !0, w = e.position + 1)), ie = e.input.charCodeAt(++e.position);
      G = e.input.slice(w, e.position), g.test(G) && A(e, "tag suffix cannot contain flow indicator characters");
    }
    G && !m.test(G) && A(e, "tag name cannot contain such characters: " + G);
    try {
      G = decodeURIComponent(G);
    } catch {
      A(e, "tag name is malformed: " + G);
    }
    return q ? e.tag = G : c.call(e.tagMap, Q) ? e.tag = e.tagMap[Q] + G : Q === "!" ? e.tag = "!" + G : Q === "!!" ? e.tag = "tag:yaml.org,2002:" + G : A(e, 'undeclared tag handle "' + Q + '"'), !0;
  }
  function De(e) {
    let q = e.input.charCodeAt(e.position);
    if (q !== 38) return !1;
    e.anchor !== null && A(e, "duplication of an anchor property"), q = e.input.charCodeAt(++e.position);
    const W = e.position;
    for (; q !== 0 && !D(q) && !C(q); )
      q = e.input.charCodeAt(++e.position);
    return e.position === W && A(e, "name of an anchor node must contain at least one character"), e.anchor = e.input.slice(W, e.position), !0;
  }
  function Ne(e) {
    let q = e.input.charCodeAt(e.position);
    if (q !== 42) return !1;
    q = e.input.charCodeAt(++e.position);
    const W = e.position;
    for (; q !== 0 && !D(q) && !C(q); )
      q = e.input.charCodeAt(++e.position);
    e.position === W && A(e, "name of an alias node must contain at least one character");
    const Q = e.input.slice(W, e.position);
    return c.call(e.anchorMap, Q) || A(e, 'unidentified alias "' + Q + '"'), e.result = e.anchorMap[Q], pe(e, !0, -1), !0;
  }
  function $e(e, q, W, Q) {
    const G = Z(e);
    return j(e), de(e, q), e.tag = null, e.anchor = null, e.kind = null, e.result = null, Se(e, W, Q) && e.kind === "mapping" ? (X(e), !0) : (oe(e), de(e, G), !1);
  }
  function Re(e, q, W, Q, G) {
    let ie, w, M = 1, ne = !1, z = !1, J = null, ee, re, ae;
    e.depth >= e.maxDepth && A(e, "nesting exceeded maxDepth (" + e.maxDepth + ")"), e.depth += 1, e.listener !== null && e.listener("open", e), e.tag = null, e.anchor = null, e.kind = null, e.result = null;
    const se = ie = w = a === W || u === W;
    if (Q && pe(e, !0, -1) && (ne = !0, e.lineIndent > q ? M = 1 : e.lineIndent === q ? M = 0 : e.lineIndent < q && (M = -1)), M === 1)
      for (; ; ) {
        const ce = e.input.charCodeAt(e.position), fe = Z(e);
        if (ne && (ce === 33 && e.tag !== null || ce === 38 && e.anchor !== null) || !be(e) && !De(e))
          break;
        J === null && (J = fe), pe(e, !0, -1) ? (ne = !0, w = se, e.lineIndent > q ? M = 1 : e.lineIndent === q ? M = 0 : e.lineIndent < q && (M = -1)) : w = !1;
      }
    if (w && (w = ne || G), M === 1 || a === W)
      if (l === W || i === W ? re = q : re = q + 1, ae = e.position - e.lineStart, M === 1)
        if (w && (ge(e, ae) || Se(e, ae, re)) || $(e, re))
          z = !0;
        else {
          const ce = e.input.charCodeAt(e.position);
          J !== null && se && !w && ce !== 124 && ce !== 62 && $e(
            e,
            J,
            J.position - J.lineStart,
            re
          ) || ie && x(e, re) || v(e, re) || E(e, re) ? z = !0 : Ne(e) ? (z = !0, (e.tag !== null || e.anchor !== null) && A(e, "alias node should not have any properties")) : Ae(e, re, l === W) && (z = !0, e.tag === null && (e.tag = "?")), e.anchor !== null && k(e, e.anchor, e.result);
        }
      else M === 0 && (z = w && ge(e, ae));
    if (e.tag === null)
      e.anchor !== null && k(e, e.anchor, e.result);
    else if (e.tag === "?") {
      e.result !== null && e.kind !== "scalar" && A(e, 'unacceptable node kind for !<?> tag; it should be "scalar", not "' + e.kind + '"');
      for (let ce = 0, fe = e.implicitTypes.length; ce < fe; ce += 1)
        if (ee = e.implicitTypes[ce], ee.resolve(e.result)) {
          e.result = ee.construct(e.result), e.tag = ee.tag, e.anchor !== null && k(e, e.anchor, e.result);
          break;
        }
    } else if (e.tag !== "!") {
      if (c.call(e.typeMap[e.kind || "fallback"], e.tag))
        ee = e.typeMap[e.kind || "fallback"][e.tag];
      else {
        ee = null;
        const ce = e.typeMap.multi[e.kind || "fallback"];
        for (let fe = 0, we = ce.length; fe < we; fe += 1)
          if (e.tag.slice(0, ce[fe].tag.length) === ce[fe].tag) {
            ee = ce[fe];
            break;
          }
      }
      ee || A(e, "unknown tag !<" + e.tag + ">"), e.result !== null && ee.kind !== e.kind && A(e, "unacceptable node kind for !<" + e.tag + '> tag; it should be "' + ee.kind + '", not "' + e.kind + '"'), ee.resolve(e.result, e.tag) ? (e.result = ee.construct(e.result, e.tag), e.anchor !== null && k(e, e.anchor, e.result)) : A(e, "cannot resolve a node with !<" + e.tag + "> explicit tag");
    }
    return e.listener !== null && e.listener("close", e), e.depth -= 1, e.tag !== null || e.anchor !== null || z;
  }
  function Me(e) {
    const q = e.position;
    let W = !1, Q;
    for (e.version = null, e.checkLineBreaks = e.legacy, e.tagMap = /* @__PURE__ */ Object.create(null), e.anchorMap = /* @__PURE__ */ Object.create(null); (Q = e.input.charCodeAt(e.position)) !== 0 && (pe(e, !0, -1), Q = e.input.charCodeAt(e.position), !(e.lineIndent > 0 || Q !== 37)); ) {
      W = !0, Q = e.input.charCodeAt(++e.position);
      let G = e.position;
      for (; Q !== 0 && !D(Q); )
        Q = e.input.charCodeAt(++e.position);
      const ie = e.input.slice(G, e.position), w = [];
      for (ie.length < 1 && A(e, "directive name must not be less than one character in length"); Q !== 0; ) {
        for (; b(Q); )
          Q = e.input.charCodeAt(++e.position);
        if (Q === 35) {
          do
            Q = e.input.charCodeAt(++e.position);
          while (Q !== 0 && !R(Q));
          break;
        }
        if (R(Q)) break;
        for (G = e.position; Q !== 0 && !D(Q); )
          Q = e.input.charCodeAt(++e.position);
        w.push(e.input.slice(G, e.position));
      }
      Q !== 0 && me(e), c.call(ye, ie) ? ye[ie](e, ie, w) : P(e, 'unknown document directive "' + ie + '"');
    }
    if (pe(e, !0, -1), e.lineIndent === 0 && e.input.charCodeAt(e.position) === 45 && e.input.charCodeAt(e.position + 1) === 45 && e.input.charCodeAt(e.position + 2) === 45 ? (e.position += 3, pe(e, !0, -1)) : W && A(e, "directives end mark is expected"), Re(e, e.lineIndent - 1, a, !1, !0), pe(e, !0, -1), e.checkLineBreaks && h.test(e.input.slice(q, e.position)) && P(e, "non-ASCII line breaks are interpreted as content"), e.documents.push(e.result), e.position === e.lineStart && _e(e)) {
      e.input.charCodeAt(e.position) === 46 && (e.position += 3, pe(e, !0, -1));
      return;
    }
    e.position < e.length - 1 && A(e, "end of the stream or a document separator is expected");
  }
  function st(e, q) {
    e = String(e), q = q || {}, e.length !== 0 && (e.charCodeAt(e.length - 1) !== 10 && e.charCodeAt(e.length - 1) !== 13 && (e += `
`), e.charCodeAt(0) === 65279 && (e = e.slice(1)));
    const W = new L(e, q), Q = e.indexOf("\0");
    for (Q !== -1 && (W.position = Q, A(W, "null byte is not allowed in input")), W.input += "\0"; W.input.charCodeAt(W.position) === 32; )
      W.lineIndent += 1, W.position += 1;
    for (; W.position < W.length - 1; )
      Me(W);
    return W.documents;
  }
  function rt(e, q, W) {
    q !== null && typeof q == "object" && typeof W > "u" && (W = q, q = null);
    const Q = st(e, W);
    if (typeof q != "function")
      return Q;
    for (let G = 0, ie = Q.length; G < ie; G += 1)
      q(Q[G]);
  }
  function Ye(e, q) {
    const W = st(e, q);
    if (W.length !== 0) {
      if (W.length === 1)
        return W[0];
      throw new d("expected a single document in the stream, but found more");
    }
  }
  return Nr.loadAll = rt, Nr.load = Ye, Nr;
}
var ei = {}, Ws;
function zc() {
  if (Ws) return ei;
  Ws = 1;
  const n = pr(), d = mr(), p = Zi(), f = Object.prototype.toString, c = Object.prototype.hasOwnProperty, l = 65279, i = 9, u = 10, a = 13, s = 32, r = 33, t = 34, o = 35, h = 37, g = 38, y = 39, m = 42, _ = 44, R = 45, b = 58, D = 61, C = 62, N = 63, I = 64, F = 91, B = 93, S = 96, Y = 123, H = 124, V = 125, L = {};
  L[0] = "\\0", L[7] = "\\a", L[8] = "\\b", L[9] = "\\t", L[10] = "\\n", L[11] = "\\v", L[12] = "\\f", L[13] = "\\r", L[27] = "\\e", L[34] = '\\"', L[92] = "\\\\", L[133] = "\\N", L[160] = "\\_", L[8232] = "\\L", L[8233] = "\\P";
  const O = [
    "y",
    "Y",
    "yes",
    "Yes",
    "YES",
    "on",
    "On",
    "ON",
    "n",
    "N",
    "no",
    "No",
    "NO",
    "off",
    "Off",
    "OFF"
  ], A = /^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;
  function P(w, M) {
    if (M === null) return {};
    const ne = {}, z = Object.keys(M);
    for (let J = 0, ee = z.length; J < ee; J += 1) {
      let re = z[J], ae = String(M[re]);
      re.slice(0, 2) === "!!" && (re = "tag:yaml.org,2002:" + re.slice(2));
      const se = w.compiledTypeMap.fallback[re];
      se && c.call(se.styleAliases, ae) && (ae = se.styleAliases[ae]), ne[re] = ae;
    }
    return ne;
  }
  function k(w) {
    let M, ne;
    const z = w.toString(16).toUpperCase();
    if (w <= 255)
      M = "x", ne = 2;
    else if (w <= 65535)
      M = "u", ne = 4;
    else if (w <= 4294967295)
      M = "U", ne = 8;
    else
      throw new d("code point within a string may not be greater than 0xFFFFFFFF");
    return "\\" + M + n.repeat("0", ne - z.length) + z;
  }
  const j = 1, X = 2;
  function oe(w) {
    this.schema = w.schema || p, this.indent = Math.max(1, w.indent || 2), this.noArrayIndent = w.noArrayIndent || !1, this.skipInvalid = w.skipInvalid || !1, this.flowLevel = n.isNothing(w.flowLevel) ? -1 : w.flowLevel, this.styleMap = P(this.schema, w.styles || null), this.sortKeys = w.sortKeys || !1, this.lineWidth = w.lineWidth || 80, this.noRefs = w.noRefs || !1, this.noCompatMode = w.noCompatMode || !1, this.condenseFlow = w.condenseFlow || !1, this.quotingType = w.quotingType === '"' ? X : j, this.forceQuotes = w.forceQuotes || !1, this.replacer = typeof w.replacer == "function" ? w.replacer : null, this.implicitTypes = this.schema.compiledImplicit, this.explicitTypes = this.schema.compiledExplicit, this.tag = null, this.result = "", this.duplicates = [], this.usedDuplicates = null;
  }
  function Z(w, M) {
    const ne = n.repeat(" ", M);
    let z = 0, J = "";
    const ee = w.length;
    for (; z < ee; ) {
      let re;
      const ae = w.indexOf(`
`, z);
      ae === -1 ? (re = w.slice(z), z = ee) : (re = w.slice(z, ae + 1), z = ae + 1), re.length && re !== `
` && (J += ne), J += re;
    }
    return J;
  }
  function de(w, M) {
    return `
` + n.repeat(" ", w.indent * M);
  }
  function ye(w, M) {
    for (let ne = 0, z = w.implicitTypes.length; ne < z; ne += 1)
      if (w.implicitTypes[ne].resolve(M))
        return !0;
    return !1;
  }
  function K(w) {
    return w === s || w === i;
  }
  function ue(w) {
    return w >= 32 && w <= 126 || w >= 161 && w <= 55295 && w !== 8232 && w !== 8233 || w >= 57344 && w <= 65533 && w !== l || w >= 65536 && w <= 1114111;
  }
  function he(w) {
    return ue(w) && w !== l && // - b-char
    w !== a && w !== u;
  }
  function me(w, M, ne) {
    const z = he(w), J = z && !K(w);
    return (
      // ns-plain-safe
      (ne ? z : z && // - c-flow-indicator
      w !== _ && w !== F && w !== B && w !== Y && w !== V) && // ns-plain-char
      w !== o && // false on '#'
      !(M === b && !J) || // false on ': '
      he(M) && !K(M) && w === o || // change to true on '[^ ]#'
      M === b && J
    );
  }
  function pe(w) {
    return ue(w) && w !== l && !K(w) && // - s-white
    // - (c-indicator ::=
    // “-” | “?” | “:” | “,” | “[” | “]” | “{” | “}”
    w !== R && w !== N && w !== b && w !== _ && w !== F && w !== B && w !== Y && w !== V && // | “#” | “&” | “*” | “!” | “|” | “=” | “>” | “'” | “"”
    w !== o && w !== g && w !== m && w !== r && w !== H && w !== D && w !== C && w !== y && w !== t && // | “%” | “@” | “`”)
    w !== h && w !== I && w !== S;
  }
  function _e(w) {
    return !K(w) && w !== b;
  }
  function ve(w, M) {
    const ne = w.charCodeAt(M);
    let z;
    return ne >= 55296 && ne <= 56319 && M + 1 < w.length && (z = w.charCodeAt(M + 1), z >= 56320 && z <= 57343) ? (ne - 55296) * 1024 + z - 56320 + 65536 : ne;
  }
  function Ae(w) {
    return /^\n* /.test(w);
  }
  const v = 1, E = 2, $ = 3, x = 4, ge = 5;
  function Se(w, M, ne, z, J, ee, re, ae) {
    let se, ce = 0, fe = null, we = !1, Te = !1;
    const Pt = z !== -1;
    let Ke = -1, gt = pe(ve(w, 0)) && _e(ve(w, w.length - 1));
    if (M || re)
      for (se = 0; se < w.length; ce >= 65536 ? se += 2 : se++) {
        if (ce = ve(w, se), !ue(ce))
          return ge;
        gt = gt && me(ce, fe, ae), fe = ce;
      }
    else {
      for (se = 0; se < w.length; ce >= 65536 ? se += 2 : se++) {
        if (ce = ve(w, se), ce === u)
          we = !0, Pt && (Te = Te || // Foldable line = too long, and not more-indented.
          se - Ke - 1 > z && w[Ke + 1] !== " ", Ke = se);
        else if (!ue(ce))
          return ge;
        gt = gt && me(ce, fe, ae), fe = ce;
      }
      Te = Te || Pt && se - Ke - 1 > z && w[Ke + 1] !== " ";
    }
    return !we && !Te ? gt && !re && !J(w) ? v : ee === X ? ge : E : ne > 9 && Ae(w) ? ge : re ? ee === X ? ge : E : Te ? x : $;
  }
  function be(w, M, ne, z, J) {
    w.dump = (function() {
      if (M.length === 0)
        return w.quotingType === X ? '""' : "''";
      if (!w.noCompatMode && (O.indexOf(M) !== -1 || A.test(M)))
        return w.quotingType === X ? '"' + M + '"' : "'" + M + "'";
      const ee = w.indent * Math.max(1, ne), re = w.lineWidth === -1 ? -1 : Math.max(Math.min(w.lineWidth, 40), w.lineWidth - ee), ae = z || // No block styles in flow mode.
      w.flowLevel > -1 && ne >= w.flowLevel;
      function se(ce) {
        return ye(w, ce);
      }
      switch (Se(
        M,
        ae,
        w.indent,
        re,
        se,
        w.quotingType,
        w.forceQuotes && !z,
        J
      )) {
        case v:
          return M;
        case E:
          return "'" + M.replace(/'/g, "''") + "'";
        case $:
          return "|" + De(M, w.indent) + Ne(Z(M, ee));
        case x:
          return ">" + De(M, w.indent) + Ne(Z($e(M, re), ee));
        case ge:
          return '"' + Me(M) + '"';
        default:
          throw new d("impossible error: invalid scalar style");
      }
    })();
  }
  function De(w, M) {
    const ne = Ae(w) ? String(M) : "", z = w[w.length - 1] === `
`, ee = z && (w[w.length - 2] === `
` || w === `
`) ? "+" : z ? "" : "-";
    return ne + ee + `
`;
  }
  function Ne(w) {
    return w[w.length - 1] === `
` ? w.slice(0, -1) : w;
  }
  function $e(w, M) {
    const ne = /(\n+)([^\n]*)/g;
    let z = (function() {
      let ae = w.indexOf(`
`);
      return ae = ae !== -1 ? ae : w.length, ne.lastIndex = ae, Re(w.slice(0, ae), M);
    })(), J = w[0] === `
` || w[0] === " ", ee, re;
    for (; re = ne.exec(w); ) {
      const ae = re[1], se = re[2];
      ee = se[0] === " ", z += ae + (!J && !ee && se !== "" ? `
` : "") + Re(se, M), J = ee;
    }
    return z;
  }
  function Re(w, M) {
    if (w === "" || w[0] === " ") return w;
    const ne = / [^ ]/g;
    let z, J = 0, ee, re = 0, ae = 0, se = "";
    for (; z = ne.exec(w); )
      ae = z.index, ae - J > M && (ee = re > J ? re : ae, se += `
` + w.slice(J, ee), J = ee + 1), re = ae;
    return se += `
`, w.length - J > M && re > J ? se += w.slice(J, re) + `
` + w.slice(re + 1) : se += w.slice(J), se.slice(1);
  }
  function Me(w) {
    let M = "", ne = 0;
    for (let z = 0; z < w.length; ne >= 65536 ? z += 2 : z++) {
      ne = ve(w, z);
      const J = L[ne];
      !J && ue(ne) ? (M += w[z], ne >= 65536 && (M += w[z + 1])) : M += J || k(ne);
    }
    return M;
  }
  function st(w, M, ne) {
    let z = "";
    const J = w.tag;
    for (let ee = 0, re = ne.length; ee < re; ee += 1) {
      let ae = ne[ee];
      w.replacer && (ae = w.replacer.call(ne, String(ee), ae)), (W(w, M, ae, !1, !1) || typeof ae > "u" && W(w, M, null, !1, !1)) && (z !== "" && (z += "," + (w.condenseFlow ? "" : " ")), z += w.dump);
    }
    w.tag = J, w.dump = "[" + z + "]";
  }
  function rt(w, M, ne, z) {
    let J = "";
    const ee = w.tag;
    for (let re = 0, ae = ne.length; re < ae; re += 1) {
      let se = ne[re];
      w.replacer && (se = w.replacer.call(ne, String(re), se)), (W(w, M + 1, se, !0, !0, !1, !0) || typeof se > "u" && W(w, M + 1, null, !0, !0, !1, !0)) && ((!z || J !== "") && (J += de(w, M)), w.dump && u === w.dump.charCodeAt(0) ? J += "-" : J += "- ", J += w.dump);
    }
    w.tag = ee, w.dump = J || "[]";
  }
  function Ye(w, M, ne) {
    let z = "";
    const J = w.tag, ee = Object.keys(ne);
    for (let re = 0, ae = ee.length; re < ae; re += 1) {
      let se = "";
      z !== "" && (se += ", "), w.condenseFlow && (se += '"');
      const ce = ee[re];
      let fe = ne[ce];
      w.replacer && (fe = w.replacer.call(ne, ce, fe)), W(w, M, ce, !1, !1) && (w.dump.length > 1024 && (se += "? "), se += w.dump + (w.condenseFlow ? '"' : "") + ":" + (w.condenseFlow ? "" : " "), W(w, M, fe, !1, !1) && (se += w.dump, z += se));
    }
    w.tag = J, w.dump = "{" + z + "}";
  }
  function e(w, M, ne, z) {
    let J = "";
    const ee = w.tag, re = Object.keys(ne);
    if (w.sortKeys === !0)
      re.sort();
    else if (typeof w.sortKeys == "function")
      re.sort(w.sortKeys);
    else if (w.sortKeys)
      throw new d("sortKeys must be a boolean or a function");
    for (let ae = 0, se = re.length; ae < se; ae += 1) {
      let ce = "";
      (!z || J !== "") && (ce += de(w, M));
      const fe = re[ae];
      let we = ne[fe];
      if (w.replacer && (we = w.replacer.call(ne, fe, we)), !W(w, M + 1, fe, !0, !0, !0))
        continue;
      const Te = w.tag !== null && w.tag !== "?" || w.dump && w.dump.length > 1024;
      Te && (w.dump && u === w.dump.charCodeAt(0) ? ce += "?" : ce += "? "), ce += w.dump, Te && (ce += de(w, M)), W(w, M + 1, we, !0, Te) && (w.dump && u === w.dump.charCodeAt(0) ? ce += ":" : ce += ": ", ce += w.dump, J += ce);
    }
    w.tag = ee, w.dump = J || "{}";
  }
  function q(w, M, ne) {
    const z = ne ? w.explicitTypes : w.implicitTypes;
    for (let J = 0, ee = z.length; J < ee; J += 1) {
      const re = z[J];
      if ((re.instanceOf || re.predicate) && (!re.instanceOf || typeof M == "object" && M instanceof re.instanceOf) && (!re.predicate || re.predicate(M))) {
        if (ne ? re.multi && re.representName ? w.tag = re.representName(M) : w.tag = re.tag : w.tag = "?", re.represent) {
          const ae = w.styleMap[re.tag] || re.defaultStyle;
          let se;
          if (f.call(re.represent) === "[object Function]")
            se = re.represent(M, ae);
          else if (c.call(re.represent, ae))
            se = re.represent[ae](M, ae);
          else
            throw new d("!<" + re.tag + '> tag resolver accepts not "' + ae + '" style');
          w.dump = se;
        }
        return !0;
      }
    }
    return !1;
  }
  function W(w, M, ne, z, J, ee, re) {
    w.tag = null, w.dump = ne, q(w, ne, !1) || q(w, ne, !0);
    const ae = f.call(w.dump), se = z;
    z && (z = w.flowLevel < 0 || w.flowLevel > M);
    const ce = ae === "[object Object]" || ae === "[object Array]";
    let fe, we;
    if (ce && (fe = w.duplicates.indexOf(ne), we = fe !== -1), (w.tag !== null && w.tag !== "?" || we || w.indent !== 2 && M > 0) && (J = !1), we && w.usedDuplicates[fe])
      w.dump = "*ref_" + fe;
    else {
      if (ce && we && !w.usedDuplicates[fe] && (w.usedDuplicates[fe] = !0), ae === "[object Object]")
        z && Object.keys(w.dump).length !== 0 ? (e(w, M, w.dump, J), we && (w.dump = "&ref_" + fe + w.dump)) : (Ye(w, M, w.dump), we && (w.dump = "&ref_" + fe + " " + w.dump));
      else if (ae === "[object Array]")
        z && w.dump.length !== 0 ? (w.noArrayIndent && !re && M > 0 ? rt(w, M - 1, w.dump, J) : rt(w, M, w.dump, J), we && (w.dump = "&ref_" + fe + w.dump)) : (st(w, M, w.dump), we && (w.dump = "&ref_" + fe + " " + w.dump));
      else if (ae === "[object String]")
        w.tag !== "?" && be(w, w.dump, M, ee, se);
      else {
        if (ae === "[object Undefined]")
          return !1;
        if (w.skipInvalid) return !1;
        throw new d("unacceptable kind of an object to dump " + ae);
      }
      if (w.tag !== null && w.tag !== "?") {
        let Te = encodeURI(
          w.tag[0] === "!" ? w.tag.slice(1) : w.tag
        ).replace(/!/g, "%21");
        w.tag[0] === "!" ? Te = "!" + Te : Te.slice(0, 18) === "tag:yaml.org,2002:" ? Te = "!!" + Te.slice(18) : Te = "!<" + Te + ">", w.dump = Te + " " + w.dump;
      }
    }
    return !0;
  }
  function Q(w, M) {
    const ne = [], z = [];
    G(w, ne, z);
    const J = z.length;
    for (let ee = 0; ee < J; ee += 1)
      M.duplicates.push(ne[z[ee]]);
    M.usedDuplicates = new Array(J);
  }
  function G(w, M, ne) {
    if (w !== null && typeof w == "object") {
      const z = M.indexOf(w);
      if (z !== -1)
        ne.indexOf(z) === -1 && ne.push(z);
      else if (M.push(w), Array.isArray(w))
        for (let J = 0, ee = w.length; J < ee; J += 1)
          G(w[J], M, ne);
      else {
        const J = Object.keys(w);
        for (let ee = 0, re = J.length; ee < re; ee += 1)
          G(w[J[ee]], M, ne);
      }
    }
  }
  function ie(w, M) {
    M = M || {};
    const ne = new oe(M);
    ne.noRefs || Q(w, ne);
    let z = w;
    return ne.replacer && (z = ne.replacer.call({ "": z }, "", z)), W(ne, 0, z, !0, !0) ? ne.dump + `
` : "";
  }
  return ei.dump = ie, ei;
}
var Ys;
function eo() {
  if (Ys) return qe;
  Ys = 1;
  const n = Yc(), d = zc();
  function p(f, c) {
    return function() {
      throw new Error("Function yaml." + f + " is removed in js-yaml 4. Use yaml." + c + " instead, which is now safe by default.");
    };
  }
  return qe.Type = Be(), qe.Schema = Fl(), qe.FAILSAFE_SCHEMA = kl(), qe.JSON_SCHEMA = jl(), qe.CORE_SCHEMA = Hl(), qe.DEFAULT_SCHEMA = Zi(), qe.load = n.load, qe.loadAll = n.loadAll, qe.dump = d.dump, qe.YAMLException = mr(), qe.types = {
    binary: Wl(),
    float: Bl(),
    map: Ul(),
    null: ql(),
    pairs: zl(),
    set: Xl(),
    timestamp: Gl(),
    bool: $l(),
    int: Ml(),
    merge: Vl(),
    omap: Yl(),
    seq: Ll(),
    str: xl()
  }, qe.safeLoad = p("safeLoad", "load"), qe.safeLoadAll = p("safeLoadAll", "loadAll"), qe.safeDump = p("safeDump", "dump"), qe;
}
var Vt = {}, zs;
function Xc() {
  if (zs) return Vt;
  zs = 1, Object.defineProperty(Vt, "__esModule", { value: !0 }), Vt.Lazy = void 0;
  class n {
    constructor(p) {
      this._value = null, this.creator = p;
    }
    get hasValue() {
      return this.creator == null;
    }
    get value() {
      if (this.creator == null)
        return this._value;
      const p = this.creator();
      return this.value = p, p;
    }
    set value(p) {
      this._value = p, this.creator = null;
    }
  }
  return Vt.Lazy = n, Vt;
}
var Fr = { exports: {} }, ti, Xs;
function Mr() {
  if (Xs) return ti;
  Xs = 1;
  const n = "2.0.0", d = 256, p = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
  9007199254740991, f = 16, c = d - 6;
  return ti = {
    MAX_LENGTH: d,
    MAX_SAFE_COMPONENT_LENGTH: f,
    MAX_SAFE_BUILD_LENGTH: c,
    MAX_SAFE_INTEGER: p,
    RELEASE_TYPES: [
      "major",
      "premajor",
      "minor",
      "preminor",
      "patch",
      "prepatch",
      "prerelease"
    ],
    SEMVER_SPEC_VERSION: n,
    FLAG_INCLUDE_PRERELEASE: 1,
    FLAG_LOOSE: 2
  }, ti;
}
var ri, Ks;
function Br() {
  return Ks || (Ks = 1, ri = typeof process == "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...d) => console.error("SEMVER", ...d) : () => {
  }), ri;
}
var Js;
function gr() {
  return Js || (Js = 1, (function(n, d) {
    const {
      MAX_SAFE_COMPONENT_LENGTH: p,
      MAX_SAFE_BUILD_LENGTH: f,
      MAX_LENGTH: c
    } = Mr(), l = Br();
    d = n.exports = {};
    const i = d.re = [], u = d.safeRe = [], a = d.src = [], s = d.safeSrc = [], r = d.t = {};
    let t = 0;
    const o = "[a-zA-Z0-9-]", h = [
      ["\\s", 1],
      ["\\d", c],
      [o, f]
    ], g = (m) => {
      for (const [_, R] of h)
        m = m.split(`${_}*`).join(`${_}{0,${R}}`).split(`${_}+`).join(`${_}{1,${R}}`);
      return m;
    }, y = (m, _, R) => {
      const b = g(_), D = t++;
      l(m, D, _), r[m] = D, a[D] = _, s[D] = b, i[D] = new RegExp(_, R ? "g" : void 0), u[D] = new RegExp(b, R ? "g" : void 0);
    };
    y("NUMERICIDENTIFIER", "0|[1-9]\\d*"), y("NUMERICIDENTIFIERLOOSE", "\\d+"), y("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${o}*`), y("MAINVERSION", `(${a[r.NUMERICIDENTIFIER]})\\.(${a[r.NUMERICIDENTIFIER]})\\.(${a[r.NUMERICIDENTIFIER]})`), y("MAINVERSIONLOOSE", `(${a[r.NUMERICIDENTIFIERLOOSE]})\\.(${a[r.NUMERICIDENTIFIERLOOSE]})\\.(${a[r.NUMERICIDENTIFIERLOOSE]})`), y("PRERELEASEIDENTIFIER", `(?:${a[r.NONNUMERICIDENTIFIER]}|${a[r.NUMERICIDENTIFIER]})`), y("PRERELEASEIDENTIFIERLOOSE", `(?:${a[r.NONNUMERICIDENTIFIER]}|${a[r.NUMERICIDENTIFIERLOOSE]})`), y("PRERELEASE", `(?:-(${a[r.PRERELEASEIDENTIFIER]}(?:\\.${a[r.PRERELEASEIDENTIFIER]})*))`), y("PRERELEASELOOSE", `(?:-?(${a[r.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${a[r.PRERELEASEIDENTIFIERLOOSE]})*))`), y("BUILDIDENTIFIER", `${o}+`), y("BUILD", `(?:\\+(${a[r.BUILDIDENTIFIER]}(?:\\.${a[r.BUILDIDENTIFIER]})*))`), y("FULLPLAIN", `v?${a[r.MAINVERSION]}${a[r.PRERELEASE]}?${a[r.BUILD]}?`), y("FULL", `^${a[r.FULLPLAIN]}$`), y("LOOSEPLAIN", `[v=\\s]*${a[r.MAINVERSIONLOOSE]}${a[r.PRERELEASELOOSE]}?${a[r.BUILD]}?`), y("LOOSE", `^${a[r.LOOSEPLAIN]}$`), y("GTLT", "((?:<|>)?=?)"), y("XRANGEIDENTIFIERLOOSE", `${a[r.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`), y("XRANGEIDENTIFIER", `${a[r.NUMERICIDENTIFIER]}|x|X|\\*`), y("XRANGEPLAIN", `[v=\\s]*(${a[r.XRANGEIDENTIFIER]})(?:\\.(${a[r.XRANGEIDENTIFIER]})(?:\\.(${a[r.XRANGEIDENTIFIER]})(?:${a[r.PRERELEASE]})?${a[r.BUILD]}?)?)?`), y("XRANGEPLAINLOOSE", `[v=\\s]*(${a[r.XRANGEIDENTIFIERLOOSE]})(?:\\.(${a[r.XRANGEIDENTIFIERLOOSE]})(?:\\.(${a[r.XRANGEIDENTIFIERLOOSE]})(?:${a[r.PRERELEASELOOSE]})?${a[r.BUILD]}?)?)?`), y("XRANGE", `^${a[r.GTLT]}\\s*${a[r.XRANGEPLAIN]}$`), y("XRANGELOOSE", `^${a[r.GTLT]}\\s*${a[r.XRANGEPLAINLOOSE]}$`), y("COERCEPLAIN", `(^|[^\\d])(\\d{1,${p}})(?:\\.(\\d{1,${p}}))?(?:\\.(\\d{1,${p}}))?`), y("COERCE", `${a[r.COERCEPLAIN]}(?:$|[^\\d])`), y("COERCEFULL", a[r.COERCEPLAIN] + `(?:${a[r.PRERELEASE]})?(?:${a[r.BUILD]})?(?:$|[^\\d])`), y("COERCERTL", a[r.COERCE], !0), y("COERCERTLFULL", a[r.COERCEFULL], !0), y("LONETILDE", "(?:~>?)"), y("TILDETRIM", `(\\s*)${a[r.LONETILDE]}\\s+`, !0), d.tildeTrimReplace = "$1~", y("TILDE", `^${a[r.LONETILDE]}${a[r.XRANGEPLAIN]}$`), y("TILDELOOSE", `^${a[r.LONETILDE]}${a[r.XRANGEPLAINLOOSE]}$`), y("LONECARET", "(?:\\^)"), y("CARETTRIM", `(\\s*)${a[r.LONECARET]}\\s+`, !0), d.caretTrimReplace = "$1^", y("CARET", `^${a[r.LONECARET]}${a[r.XRANGEPLAIN]}$`), y("CARETLOOSE", `^${a[r.LONECARET]}${a[r.XRANGEPLAINLOOSE]}$`), y("COMPARATORLOOSE", `^${a[r.GTLT]}\\s*(${a[r.LOOSEPLAIN]})$|^$`), y("COMPARATOR", `^${a[r.GTLT]}\\s*(${a[r.FULLPLAIN]})$|^$`), y("COMPARATORTRIM", `(\\s*)${a[r.GTLT]}\\s*(${a[r.LOOSEPLAIN]}|${a[r.XRANGEPLAIN]})`, !0), d.comparatorTrimReplace = "$1$2$3", y("HYPHENRANGE", `^\\s*(${a[r.XRANGEPLAIN]})\\s+-\\s+(${a[r.XRANGEPLAIN]})\\s*$`), y("HYPHENRANGELOOSE", `^\\s*(${a[r.XRANGEPLAINLOOSE]})\\s+-\\s+(${a[r.XRANGEPLAINLOOSE]})\\s*$`), y("STAR", "(<|>)?=?\\s*\\*"), y("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$"), y("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
  })(Fr, Fr.exports)), Fr.exports;
}
var ni, Qs;
function to() {
  if (Qs) return ni;
  Qs = 1;
  const n = Object.freeze({ loose: !0 }), d = Object.freeze({});
  return ni = (f) => f ? typeof f != "object" ? n : f : d, ni;
}
var ii, Zs;
function Kl() {
  if (Zs) return ii;
  Zs = 1;
  const n = /^[0-9]+$/, d = (f, c) => {
    if (typeof f == "number" && typeof c == "number")
      return f === c ? 0 : f < c ? -1 : 1;
    const l = n.test(f), i = n.test(c);
    return l && i && (f = +f, c = +c), f === c ? 0 : l && !i ? -1 : i && !l ? 1 : f < c ? -1 : 1;
  };
  return ii = {
    compareIdentifiers: d,
    rcompareIdentifiers: (f, c) => d(c, f)
  }, ii;
}
var oi, ea;
function je() {
  if (ea) return oi;
  ea = 1;
  const n = Br(), { MAX_LENGTH: d, MAX_SAFE_INTEGER: p } = Mr(), { safeRe: f, t: c } = gr(), l = to(), { compareIdentifiers: i } = Kl();
  class u {
    constructor(s, r) {
      if (r = l(r), s instanceof u) {
        if (s.loose === !!r.loose && s.includePrerelease === !!r.includePrerelease)
          return s;
        s = s.version;
      } else if (typeof s != "string")
        throw new TypeError(`Invalid version. Must be a string. Got type "${typeof s}".`);
      if (s.length > d)
        throw new TypeError(
          `version is longer than ${d} characters`
        );
      n("SemVer", s, r), this.options = r, this.loose = !!r.loose, this.includePrerelease = !!r.includePrerelease;
      const t = s.trim().match(r.loose ? f[c.LOOSE] : f[c.FULL]);
      if (!t)
        throw new TypeError(`Invalid Version: ${s}`);
      if (this.raw = s, this.major = +t[1], this.minor = +t[2], this.patch = +t[3], this.major > p || this.major < 0)
        throw new TypeError("Invalid major version");
      if (this.minor > p || this.minor < 0)
        throw new TypeError("Invalid minor version");
      if (this.patch > p || this.patch < 0)
        throw new TypeError("Invalid patch version");
      t[4] ? this.prerelease = t[4].split(".").map((o) => {
        if (/^[0-9]+$/.test(o)) {
          const h = +o;
          if (h >= 0 && h < p)
            return h;
        }
        return o;
      }) : this.prerelease = [], this.build = t[5] ? t[5].split(".") : [], this.format();
    }
    format() {
      return this.version = `${this.major}.${this.minor}.${this.patch}`, this.prerelease.length && (this.version += `-${this.prerelease.join(".")}`), this.version;
    }
    toString() {
      return this.version;
    }
    compare(s) {
      if (n("SemVer.compare", this.version, this.options, s), !(s instanceof u)) {
        if (typeof s == "string" && s === this.version)
          return 0;
        s = new u(s, this.options);
      }
      return s.version === this.version ? 0 : this.compareMain(s) || this.comparePre(s);
    }
    compareMain(s) {
      return s instanceof u || (s = new u(s, this.options)), this.major < s.major ? -1 : this.major > s.major ? 1 : this.minor < s.minor ? -1 : this.minor > s.minor ? 1 : this.patch < s.patch ? -1 : this.patch > s.patch ? 1 : 0;
    }
    comparePre(s) {
      if (s instanceof u || (s = new u(s, this.options)), this.prerelease.length && !s.prerelease.length)
        return -1;
      if (!this.prerelease.length && s.prerelease.length)
        return 1;
      if (!this.prerelease.length && !s.prerelease.length)
        return 0;
      let r = 0;
      do {
        const t = this.prerelease[r], o = s.prerelease[r];
        if (n("prerelease compare", r, t, o), t === void 0 && o === void 0)
          return 0;
        if (o === void 0)
          return 1;
        if (t === void 0)
          return -1;
        if (t === o)
          continue;
        return i(t, o);
      } while (++r);
    }
    compareBuild(s) {
      s instanceof u || (s = new u(s, this.options));
      let r = 0;
      do {
        const t = this.build[r], o = s.build[r];
        if (n("build compare", r, t, o), t === void 0 && o === void 0)
          return 0;
        if (o === void 0)
          return 1;
        if (t === void 0)
          return -1;
        if (t === o)
          continue;
        return i(t, o);
      } while (++r);
    }
    // preminor will bump the version up to the next minor release, and immediately
    // down to pre-release. premajor and prepatch work the same way.
    inc(s, r, t) {
      if (s.startsWith("pre")) {
        if (!r && t === !1)
          throw new Error("invalid increment argument: identifier is empty");
        if (r) {
          const o = `-${r}`.match(this.options.loose ? f[c.PRERELEASELOOSE] : f[c.PRERELEASE]);
          if (!o || o[1] !== r)
            throw new Error(`invalid identifier: ${r}`);
        }
      }
      switch (s) {
        case "premajor":
          this.prerelease.length = 0, this.patch = 0, this.minor = 0, this.major++, this.inc("pre", r, t);
          break;
        case "preminor":
          this.prerelease.length = 0, this.patch = 0, this.minor++, this.inc("pre", r, t);
          break;
        case "prepatch":
          this.prerelease.length = 0, this.inc("patch", r, t), this.inc("pre", r, t);
          break;
        // If the input is a non-prerelease version, this acts the same as
        // prepatch.
        case "prerelease":
          this.prerelease.length === 0 && this.inc("patch", r, t), this.inc("pre", r, t);
          break;
        case "release":
          if (this.prerelease.length === 0)
            throw new Error(`version ${this.raw} is not a prerelease`);
          this.prerelease.length = 0;
          break;
        case "major":
          (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) && this.major++, this.minor = 0, this.patch = 0, this.prerelease = [];
          break;
        case "minor":
          (this.patch !== 0 || this.prerelease.length === 0) && this.minor++, this.patch = 0, this.prerelease = [];
          break;
        case "patch":
          this.prerelease.length === 0 && this.patch++, this.prerelease = [];
          break;
        // This probably shouldn't be used publicly.
        // 1.0.0 'pre' would become 1.0.0-0 which is the wrong direction.
        case "pre": {
          const o = Number(t) ? 1 : 0;
          if (this.prerelease.length === 0)
            this.prerelease = [o];
          else {
            let h = this.prerelease.length;
            for (; --h >= 0; )
              typeof this.prerelease[h] == "number" && (this.prerelease[h]++, h = -2);
            if (h === -1) {
              if (r === this.prerelease.join(".") && t === !1)
                throw new Error("invalid increment argument: identifier already exists");
              this.prerelease.push(o);
            }
          }
          if (r) {
            let h = [r, o];
            t === !1 && (h = [r]), i(this.prerelease[0], r) === 0 ? isNaN(this.prerelease[1]) && (this.prerelease = h) : this.prerelease = h;
          }
          break;
        }
        default:
          throw new Error(`invalid increment argument: ${s}`);
      }
      return this.raw = this.format(), this.build.length && (this.raw += `+${this.build.join(".")}`), this;
    }
  }
  return oi = u, oi;
}
var si, ta;
function $t() {
  if (ta) return si;
  ta = 1;
  const n = je();
  return si = (p, f, c = !1) => {
    if (p instanceof n)
      return p;
    try {
      return new n(p, f);
    } catch (l) {
      if (!c)
        return null;
      throw l;
    }
  }, si;
}
var ai, ra;
function Kc() {
  if (ra) return ai;
  ra = 1;
  const n = $t();
  return ai = (p, f) => {
    const c = n(p, f);
    return c ? c.version : null;
  }, ai;
}
var li, na;
function Jc() {
  if (na) return li;
  na = 1;
  const n = $t();
  return li = (p, f) => {
    const c = n(p.trim().replace(/^[=v]+/, ""), f);
    return c ? c.version : null;
  }, li;
}
var ui, ia;
function Qc() {
  if (ia) return ui;
  ia = 1;
  const n = je();
  return ui = (p, f, c, l, i) => {
    typeof c == "string" && (i = l, l = c, c = void 0);
    try {
      return new n(
        p instanceof n ? p.version : p,
        c
      ).inc(f, l, i).version;
    } catch {
      return null;
    }
  }, ui;
}
var ci, oa;
function Zc() {
  if (oa) return ci;
  oa = 1;
  const n = $t();
  return ci = (p, f) => {
    const c = n(p, null, !0), l = n(f, null, !0), i = c.compare(l);
    if (i === 0)
      return null;
    const u = i > 0, a = u ? c : l, s = u ? l : c, r = !!a.prerelease.length;
    if (!!s.prerelease.length && !r) {
      if (!s.patch && !s.minor)
        return "major";
      if (s.compareMain(a) === 0)
        return s.minor && !s.patch ? "minor" : "patch";
    }
    const o = r ? "pre" : "";
    return c.major !== l.major ? o + "major" : c.minor !== l.minor ? o + "minor" : c.patch !== l.patch ? o + "patch" : "prerelease";
  }, ci;
}
var fi, sa;
function ef() {
  if (sa) return fi;
  sa = 1;
  const n = je();
  return fi = (p, f) => new n(p, f).major, fi;
}
var di, aa;
function tf() {
  if (aa) return di;
  aa = 1;
  const n = je();
  return di = (p, f) => new n(p, f).minor, di;
}
var hi, la;
function rf() {
  if (la) return hi;
  la = 1;
  const n = je();
  return hi = (p, f) => new n(p, f).patch, hi;
}
var pi, ua;
function nf() {
  if (ua) return pi;
  ua = 1;
  const n = $t();
  return pi = (p, f) => {
    const c = n(p, f);
    return c && c.prerelease.length ? c.prerelease : null;
  }, pi;
}
var mi, ca;
function Ze() {
  if (ca) return mi;
  ca = 1;
  const n = je();
  return mi = (p, f, c) => new n(p, c).compare(new n(f, c)), mi;
}
var gi, fa;
function of() {
  if (fa) return gi;
  fa = 1;
  const n = Ze();
  return gi = (p, f, c) => n(f, p, c), gi;
}
var Ei, da;
function sf() {
  if (da) return Ei;
  da = 1;
  const n = Ze();
  return Ei = (p, f) => n(p, f, !0), Ei;
}
var yi, ha;
function ro() {
  if (ha) return yi;
  ha = 1;
  const n = je();
  return yi = (p, f, c) => {
    const l = new n(p, c), i = new n(f, c);
    return l.compare(i) || l.compareBuild(i);
  }, yi;
}
var vi, pa;
function af() {
  if (pa) return vi;
  pa = 1;
  const n = ro();
  return vi = (p, f) => p.sort((c, l) => n(c, l, f)), vi;
}
var wi, ma;
function lf() {
  if (ma) return wi;
  ma = 1;
  const n = ro();
  return wi = (p, f) => p.sort((c, l) => n(l, c, f)), wi;
}
var _i, ga;
function jr() {
  if (ga) return _i;
  ga = 1;
  const n = Ze();
  return _i = (p, f, c) => n(p, f, c) > 0, _i;
}
var Ai, Ea;
function no() {
  if (Ea) return Ai;
  Ea = 1;
  const n = Ze();
  return Ai = (p, f, c) => n(p, f, c) < 0, Ai;
}
var Ri, ya;
function Jl() {
  if (ya) return Ri;
  ya = 1;
  const n = Ze();
  return Ri = (p, f, c) => n(p, f, c) === 0, Ri;
}
var Ti, va;
function Ql() {
  if (va) return Ti;
  va = 1;
  const n = Ze();
  return Ti = (p, f, c) => n(p, f, c) !== 0, Ti;
}
var Si, wa;
function io() {
  if (wa) return Si;
  wa = 1;
  const n = Ze();
  return Si = (p, f, c) => n(p, f, c) >= 0, Si;
}
var bi, _a;
function oo() {
  if (_a) return bi;
  _a = 1;
  const n = Ze();
  return bi = (p, f, c) => n(p, f, c) <= 0, bi;
}
var Ci, Aa;
function Zl() {
  if (Aa) return Ci;
  Aa = 1;
  const n = Jl(), d = Ql(), p = jr(), f = io(), c = no(), l = oo();
  return Ci = (u, a, s, r) => {
    switch (a) {
      case "===":
        return typeof u == "object" && (u = u.version), typeof s == "object" && (s = s.version), u === s;
      case "!==":
        return typeof u == "object" && (u = u.version), typeof s == "object" && (s = s.version), u !== s;
      case "":
      case "=":
      case "==":
        return n(u, s, r);
      case "!=":
        return d(u, s, r);
      case ">":
        return p(u, s, r);
      case ">=":
        return f(u, s, r);
      case "<":
        return c(u, s, r);
      case "<=":
        return l(u, s, r);
      default:
        throw new TypeError(`Invalid operator: ${a}`);
    }
  }, Ci;
}
var Oi, Ra;
function uf() {
  if (Ra) return Oi;
  Ra = 1;
  const n = je(), d = $t(), { safeRe: p, t: f } = gr();
  return Oi = (l, i) => {
    if (l instanceof n)
      return l;
    if (typeof l == "number" && (l = String(l)), typeof l != "string")
      return null;
    i = i || {};
    let u = null;
    if (!i.rtl)
      u = l.match(i.includePrerelease ? p[f.COERCEFULL] : p[f.COERCE]);
    else {
      const h = i.includePrerelease ? p[f.COERCERTLFULL] : p[f.COERCERTL];
      let g;
      for (; (g = h.exec(l)) && (!u || u.index + u[0].length !== l.length); )
        (!u || g.index + g[0].length !== u.index + u[0].length) && (u = g), h.lastIndex = g.index + g[1].length + g[2].length;
      h.lastIndex = -1;
    }
    if (u === null)
      return null;
    const a = u[2], s = u[3] || "0", r = u[4] || "0", t = i.includePrerelease && u[5] ? `-${u[5]}` : "", o = i.includePrerelease && u[6] ? `+${u[6]}` : "";
    return d(`${a}.${s}.${r}${t}${o}`, i);
  }, Oi;
}
var Pi, Ta;
function cf() {
  if (Ta) return Pi;
  Ta = 1;
  class n {
    constructor() {
      this.max = 1e3, this.map = /* @__PURE__ */ new Map();
    }
    get(p) {
      const f = this.map.get(p);
      if (f !== void 0)
        return this.map.delete(p), this.map.set(p, f), f;
    }
    delete(p) {
      return this.map.delete(p);
    }
    set(p, f) {
      if (!this.delete(p) && f !== void 0) {
        if (this.map.size >= this.max) {
          const l = this.map.keys().next().value;
          this.delete(l);
        }
        this.map.set(p, f);
      }
      return this;
    }
  }
  return Pi = n, Pi;
}
var Ii, Sa;
function et() {
  if (Sa) return Ii;
  Sa = 1;
  const n = /\s+/g;
  class d {
    constructor(O, A) {
      if (A = c(A), O instanceof d)
        return O.loose === !!A.loose && O.includePrerelease === !!A.includePrerelease ? O : new d(O.raw, A);
      if (O instanceof l)
        return this.raw = O.value, this.set = [[O]], this.formatted = void 0, this;
      if (this.options = A, this.loose = !!A.loose, this.includePrerelease = !!A.includePrerelease, this.raw = O.trim().replace(n, " "), this.set = this.raw.split("||").map((P) => this.parseRange(P.trim())).filter((P) => P.length), !this.set.length)
        throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
      if (this.set.length > 1) {
        const P = this.set[0];
        if (this.set = this.set.filter((k) => !y(k[0])), this.set.length === 0)
          this.set = [P];
        else if (this.set.length > 1) {
          for (const k of this.set)
            if (k.length === 1 && m(k[0])) {
              this.set = [k];
              break;
            }
        }
      }
      this.formatted = void 0;
    }
    get range() {
      if (this.formatted === void 0) {
        this.formatted = "";
        for (let O = 0; O < this.set.length; O++) {
          O > 0 && (this.formatted += "||");
          const A = this.set[O];
          for (let P = 0; P < A.length; P++)
            P > 0 && (this.formatted += " "), this.formatted += A[P].toString().trim();
        }
      }
      return this.formatted;
    }
    format() {
      return this.range;
    }
    toString() {
      return this.range;
    }
    parseRange(O) {
      const P = ((this.options.includePrerelease && h) | (this.options.loose && g)) + ":" + O, k = f.get(P);
      if (k)
        return k;
      const j = this.options.loose, X = j ? a[s.HYPHENRANGELOOSE] : a[s.HYPHENRANGE];
      O = O.replace(X, H(this.options.includePrerelease)), i("hyphen replace", O), O = O.replace(a[s.COMPARATORTRIM], r), i("comparator trim", O), O = O.replace(a[s.TILDETRIM], t), i("tilde trim", O), O = O.replace(a[s.CARETTRIM], o), i("caret trim", O);
      let oe = O.split(" ").map((K) => R(K, this.options)).join(" ").split(/\s+/).map((K) => Y(K, this.options));
      j && (oe = oe.filter((K) => (i("loose invalid filter", K, this.options), !!K.match(a[s.COMPARATORLOOSE])))), i("range list", oe);
      const Z = /* @__PURE__ */ new Map(), de = oe.map((K) => new l(K, this.options));
      for (const K of de) {
        if (y(K))
          return [K];
        Z.set(K.value, K);
      }
      Z.size > 1 && Z.has("") && Z.delete("");
      const ye = [...Z.values()];
      return f.set(P, ye), ye;
    }
    intersects(O, A) {
      if (!(O instanceof d))
        throw new TypeError("a Range is required");
      return this.set.some((P) => _(P, A) && O.set.some((k) => _(k, A) && P.every((j) => k.every((X) => j.intersects(X, A)))));
    }
    // if ANY of the sets match ALL of its comparators, then pass
    test(O) {
      if (!O)
        return !1;
      if (typeof O == "string")
        try {
          O = new u(O, this.options);
        } catch {
          return !1;
        }
      for (let A = 0; A < this.set.length; A++)
        if (V(this.set[A], O, this.options))
          return !0;
      return !1;
    }
  }
  Ii = d;
  const p = cf(), f = new p(), c = to(), l = Hr(), i = Br(), u = je(), {
    safeRe: a,
    t: s,
    comparatorTrimReplace: r,
    tildeTrimReplace: t,
    caretTrimReplace: o
  } = gr(), { FLAG_INCLUDE_PRERELEASE: h, FLAG_LOOSE: g } = Mr(), y = (L) => L.value === "<0.0.0-0", m = (L) => L.value === "", _ = (L, O) => {
    let A = !0;
    const P = L.slice();
    let k = P.pop();
    for (; A && P.length; )
      A = P.every((j) => k.intersects(j, O)), k = P.pop();
    return A;
  }, R = (L, O) => (L = L.replace(a[s.BUILD], ""), i("comp", L, O), L = N(L, O), i("caret", L), L = D(L, O), i("tildes", L), L = F(L, O), i("xrange", L), L = S(L, O), i("stars", L), L), b = (L) => !L || L.toLowerCase() === "x" || L === "*", D = (L, O) => L.trim().split(/\s+/).map((A) => C(A, O)).join(" "), C = (L, O) => {
    const A = O.loose ? a[s.TILDELOOSE] : a[s.TILDE];
    return L.replace(A, (P, k, j, X, oe) => {
      i("tilde", L, P, k, j, X, oe);
      let Z;
      return b(k) ? Z = "" : b(j) ? Z = `>=${k}.0.0 <${+k + 1}.0.0-0` : b(X) ? Z = `>=${k}.${j}.0 <${k}.${+j + 1}.0-0` : oe ? (i("replaceTilde pr", oe), Z = `>=${k}.${j}.${X}-${oe} <${k}.${+j + 1}.0-0`) : Z = `>=${k}.${j}.${X} <${k}.${+j + 1}.0-0`, i("tilde return", Z), Z;
    });
  }, N = (L, O) => L.trim().split(/\s+/).map((A) => I(A, O)).join(" "), I = (L, O) => {
    i("caret", L, O);
    const A = O.loose ? a[s.CARETLOOSE] : a[s.CARET], P = O.includePrerelease ? "-0" : "";
    return L.replace(A, (k, j, X, oe, Z) => {
      i("caret", L, k, j, X, oe, Z);
      let de;
      return b(j) ? de = "" : b(X) ? de = `>=${j}.0.0${P} <${+j + 1}.0.0-0` : b(oe) ? j === "0" ? de = `>=${j}.${X}.0${P} <${j}.${+X + 1}.0-0` : de = `>=${j}.${X}.0${P} <${+j + 1}.0.0-0` : Z ? (i("replaceCaret pr", Z), j === "0" ? X === "0" ? de = `>=${j}.${X}.${oe}-${Z} <${j}.${X}.${+oe + 1}-0` : de = `>=${j}.${X}.${oe}-${Z} <${j}.${+X + 1}.0-0` : de = `>=${j}.${X}.${oe}-${Z} <${+j + 1}.0.0-0`) : (i("no pr"), j === "0" ? X === "0" ? de = `>=${j}.${X}.${oe}${P} <${j}.${X}.${+oe + 1}-0` : de = `>=${j}.${X}.${oe}${P} <${j}.${+X + 1}.0-0` : de = `>=${j}.${X}.${oe} <${+j + 1}.0.0-0`), i("caret return", de), de;
    });
  }, F = (L, O) => (i("replaceXRanges", L, O), L.split(/\s+/).map((A) => B(A, O)).join(" ")), B = (L, O) => {
    L = L.trim();
    const A = O.loose ? a[s.XRANGELOOSE] : a[s.XRANGE];
    return L.replace(A, (P, k, j, X, oe, Z) => {
      i("xRange", L, P, k, j, X, oe, Z);
      const de = b(j), ye = de || b(X), K = ye || b(oe), ue = K;
      return k === "=" && ue && (k = ""), Z = O.includePrerelease ? "-0" : "", de ? k === ">" || k === "<" ? P = "<0.0.0-0" : P = "*" : k && ue ? (ye && (X = 0), oe = 0, k === ">" ? (k = ">=", ye ? (j = +j + 1, X = 0, oe = 0) : (X = +X + 1, oe = 0)) : k === "<=" && (k = "<", ye ? j = +j + 1 : X = +X + 1), k === "<" && (Z = "-0"), P = `${k + j}.${X}.${oe}${Z}`) : ye ? P = `>=${j}.0.0${Z} <${+j + 1}.0.0-0` : K && (P = `>=${j}.${X}.0${Z} <${j}.${+X + 1}.0-0`), i("xRange return", P), P;
    });
  }, S = (L, O) => (i("replaceStars", L, O), L.trim().replace(a[s.STAR], "")), Y = (L, O) => (i("replaceGTE0", L, O), L.trim().replace(a[O.includePrerelease ? s.GTE0PRE : s.GTE0], "")), H = (L) => (O, A, P, k, j, X, oe, Z, de, ye, K, ue) => (b(P) ? A = "" : b(k) ? A = `>=${P}.0.0${L ? "-0" : ""}` : b(j) ? A = `>=${P}.${k}.0${L ? "-0" : ""}` : X ? A = `>=${A}` : A = `>=${A}${L ? "-0" : ""}`, b(de) ? Z = "" : b(ye) ? Z = `<${+de + 1}.0.0-0` : b(K) ? Z = `<${de}.${+ye + 1}.0-0` : ue ? Z = `<=${de}.${ye}.${K}-${ue}` : L ? Z = `<${de}.${ye}.${+K + 1}-0` : Z = `<=${Z}`, `${A} ${Z}`.trim()), V = (L, O, A) => {
    for (let P = 0; P < L.length; P++)
      if (!L[P].test(O))
        return !1;
    if (O.prerelease.length && !A.includePrerelease) {
      for (let P = 0; P < L.length; P++)
        if (i(L[P].semver), L[P].semver !== l.ANY && L[P].semver.prerelease.length > 0) {
          const k = L[P].semver;
          if (k.major === O.major && k.minor === O.minor && k.patch === O.patch)
            return !0;
        }
      return !1;
    }
    return !0;
  };
  return Ii;
}
var Di, ba;
function Hr() {
  if (ba) return Di;
  ba = 1;
  const n = /* @__PURE__ */ Symbol("SemVer ANY");
  class d {
    static get ANY() {
      return n;
    }
    constructor(r, t) {
      if (t = p(t), r instanceof d) {
        if (r.loose === !!t.loose)
          return r;
        r = r.value;
      }
      r = r.trim().split(/\s+/).join(" "), i("comparator", r, t), this.options = t, this.loose = !!t.loose, this.parse(r), this.semver === n ? this.value = "" : this.value = this.operator + this.semver.version, i("comp", this);
    }
    parse(r) {
      const t = this.options.loose ? f[c.COMPARATORLOOSE] : f[c.COMPARATOR], o = r.match(t);
      if (!o)
        throw new TypeError(`Invalid comparator: ${r}`);
      this.operator = o[1] !== void 0 ? o[1] : "", this.operator === "=" && (this.operator = ""), o[2] ? this.semver = new u(o[2], this.options.loose) : this.semver = n;
    }
    toString() {
      return this.value;
    }
    test(r) {
      if (i("Comparator.test", r, this.options.loose), this.semver === n || r === n)
        return !0;
      if (typeof r == "string")
        try {
          r = new u(r, this.options);
        } catch {
          return !1;
        }
      return l(r, this.operator, this.semver, this.options);
    }
    intersects(r, t) {
      if (!(r instanceof d))
        throw new TypeError("a Comparator is required");
      return this.operator === "" ? this.value === "" ? !0 : new a(r.value, t).test(this.value) : r.operator === "" ? r.value === "" ? !0 : new a(this.value, t).test(r.semver) : (t = p(t), t.includePrerelease && (this.value === "<0.0.0-0" || r.value === "<0.0.0-0") || !t.includePrerelease && (this.value.startsWith("<0.0.0") || r.value.startsWith("<0.0.0")) ? !1 : !!(this.operator.startsWith(">") && r.operator.startsWith(">") || this.operator.startsWith("<") && r.operator.startsWith("<") || this.semver.version === r.semver.version && this.operator.includes("=") && r.operator.includes("=") || l(this.semver, "<", r.semver, t) && this.operator.startsWith(">") && r.operator.startsWith("<") || l(this.semver, ">", r.semver, t) && this.operator.startsWith("<") && r.operator.startsWith(">")));
    }
  }
  Di = d;
  const p = to(), { safeRe: f, t: c } = gr(), l = Zl(), i = Br(), u = je(), a = et();
  return Di;
}
var Ni, Ca;
function Gr() {
  if (Ca) return Ni;
  Ca = 1;
  const n = et();
  return Ni = (p, f, c) => {
    try {
      f = new n(f, c);
    } catch {
      return !1;
    }
    return f.test(p);
  }, Ni;
}
var Fi, Oa;
function ff() {
  if (Oa) return Fi;
  Oa = 1;
  const n = et();
  return Fi = (p, f) => new n(p, f).set.map((c) => c.map((l) => l.value).join(" ").trim().split(" ")), Fi;
}
var xi, Pa;
function df() {
  if (Pa) return xi;
  Pa = 1;
  const n = je(), d = et();
  return xi = (f, c, l) => {
    let i = null, u = null, a = null;
    try {
      a = new d(c, l);
    } catch {
      return null;
    }
    return f.forEach((s) => {
      a.test(s) && (!i || u.compare(s) === -1) && (i = s, u = new n(i, l));
    }), i;
  }, xi;
}
var Li, Ia;
function hf() {
  if (Ia) return Li;
  Ia = 1;
  const n = je(), d = et();
  return Li = (f, c, l) => {
    let i = null, u = null, a = null;
    try {
      a = new d(c, l);
    } catch {
      return null;
    }
    return f.forEach((s) => {
      a.test(s) && (!i || u.compare(s) === 1) && (i = s, u = new n(i, l));
    }), i;
  }, Li;
}
var Ui, Da;
function pf() {
  if (Da) return Ui;
  Da = 1;
  const n = je(), d = et(), p = jr();
  return Ui = (c, l) => {
    c = new d(c, l);
    let i = new n("0.0.0");
    if (c.test(i) || (i = new n("0.0.0-0"), c.test(i)))
      return i;
    i = null;
    for (let u = 0; u < c.set.length; ++u) {
      const a = c.set[u];
      let s = null;
      a.forEach((r) => {
        const t = new n(r.semver.version);
        switch (r.operator) {
          case ">":
            t.prerelease.length === 0 ? t.patch++ : t.prerelease.push(0), t.raw = t.format();
          /* fallthrough */
          case "":
          case ">=":
            (!s || p(t, s)) && (s = t);
            break;
          case "<":
          case "<=":
            break;
          /* istanbul ignore next */
          default:
            throw new Error(`Unexpected operation: ${r.operator}`);
        }
      }), s && (!i || p(i, s)) && (i = s);
    }
    return i && c.test(i) ? i : null;
  }, Ui;
}
var ki, Na;
function mf() {
  if (Na) return ki;
  Na = 1;
  const n = et();
  return ki = (p, f) => {
    try {
      return new n(p, f).range || "*";
    } catch {
      return null;
    }
  }, ki;
}
var qi, Fa;
function so() {
  if (Fa) return qi;
  Fa = 1;
  const n = je(), d = Hr(), { ANY: p } = d, f = et(), c = Gr(), l = jr(), i = no(), u = oo(), a = io();
  return qi = (r, t, o, h) => {
    r = new n(r, h), t = new f(t, h);
    let g, y, m, _, R;
    switch (o) {
      case ">":
        g = l, y = u, m = i, _ = ">", R = ">=";
        break;
      case "<":
        g = i, y = a, m = l, _ = "<", R = "<=";
        break;
      default:
        throw new TypeError('Must provide a hilo val of "<" or ">"');
    }
    if (c(r, t, h))
      return !1;
    for (let b = 0; b < t.set.length; ++b) {
      const D = t.set[b];
      let C = null, N = null;
      if (D.forEach((I) => {
        I.semver === p && (I = new d(">=0.0.0")), C = C || I, N = N || I, g(I.semver, C.semver, h) ? C = I : m(I.semver, N.semver, h) && (N = I);
      }), C.operator === _ || C.operator === R || (!N.operator || N.operator === _) && y(r, N.semver))
        return !1;
      if (N.operator === R && m(r, N.semver))
        return !1;
    }
    return !0;
  }, qi;
}
var $i, xa;
function gf() {
  if (xa) return $i;
  xa = 1;
  const n = so();
  return $i = (p, f, c) => n(p, f, ">", c), $i;
}
var Mi, La;
function Ef() {
  if (La) return Mi;
  La = 1;
  const n = so();
  return Mi = (p, f, c) => n(p, f, "<", c), Mi;
}
var Bi, Ua;
function yf() {
  if (Ua) return Bi;
  Ua = 1;
  const n = et();
  return Bi = (p, f, c) => (p = new n(p, c), f = new n(f, c), p.intersects(f, c)), Bi;
}
var ji, ka;
function vf() {
  if (ka) return ji;
  ka = 1;
  const n = Gr(), d = Ze();
  return ji = (p, f, c) => {
    const l = [];
    let i = null, u = null;
    const a = p.sort((o, h) => d(o, h, c));
    for (const o of a)
      n(o, f, c) ? (u = o, i || (i = o)) : (u && l.push([i, u]), u = null, i = null);
    i && l.push([i, null]);
    const s = [];
    for (const [o, h] of l)
      o === h ? s.push(o) : !h && o === a[0] ? s.push("*") : h ? o === a[0] ? s.push(`<=${h}`) : s.push(`${o} - ${h}`) : s.push(`>=${o}`);
    const r = s.join(" || "), t = typeof f.raw == "string" ? f.raw : String(f);
    return r.length < t.length ? r : f;
  }, ji;
}
var Hi, qa;
function wf() {
  if (qa) return Hi;
  qa = 1;
  const n = et(), d = Hr(), { ANY: p } = d, f = Gr(), c = Ze(), l = (t, o, h = {}) => {
    if (t === o)
      return !0;
    t = new n(t, h), o = new n(o, h);
    let g = !1;
    e: for (const y of t.set) {
      for (const m of o.set) {
        const _ = a(y, m, h);
        if (g = g || _ !== null, _)
          continue e;
      }
      if (g)
        return !1;
    }
    return !0;
  }, i = [new d(">=0.0.0-0")], u = [new d(">=0.0.0")], a = (t, o, h) => {
    if (t === o)
      return !0;
    if (t.length === 1 && t[0].semver === p) {
      if (o.length === 1 && o[0].semver === p)
        return !0;
      h.includePrerelease ? t = i : t = u;
    }
    if (o.length === 1 && o[0].semver === p) {
      if (h.includePrerelease)
        return !0;
      o = u;
    }
    const g = /* @__PURE__ */ new Set();
    let y, m;
    for (const F of t)
      F.operator === ">" || F.operator === ">=" ? y = s(y, F, h) : F.operator === "<" || F.operator === "<=" ? m = r(m, F, h) : g.add(F.semver);
    if (g.size > 1)
      return null;
    let _;
    if (y && m) {
      if (_ = c(y.semver, m.semver, h), _ > 0)
        return null;
      if (_ === 0 && (y.operator !== ">=" || m.operator !== "<="))
        return null;
    }
    for (const F of g) {
      if (y && !f(F, String(y), h) || m && !f(F, String(m), h))
        return null;
      for (const B of o)
        if (!f(F, String(B), h))
          return !1;
      return !0;
    }
    let R, b, D, C, N = m && !h.includePrerelease && m.semver.prerelease.length ? m.semver : !1, I = y && !h.includePrerelease && y.semver.prerelease.length ? y.semver : !1;
    N && N.prerelease.length === 1 && m.operator === "<" && N.prerelease[0] === 0 && (N = !1);
    for (const F of o) {
      if (C = C || F.operator === ">" || F.operator === ">=", D = D || F.operator === "<" || F.operator === "<=", y) {
        if (I && F.semver.prerelease && F.semver.prerelease.length && F.semver.major === I.major && F.semver.minor === I.minor && F.semver.patch === I.patch && (I = !1), F.operator === ">" || F.operator === ">=") {
          if (R = s(y, F, h), R === F && R !== y)
            return !1;
        } else if (y.operator === ">=" && !f(y.semver, String(F), h))
          return !1;
      }
      if (m) {
        if (N && F.semver.prerelease && F.semver.prerelease.length && F.semver.major === N.major && F.semver.minor === N.minor && F.semver.patch === N.patch && (N = !1), F.operator === "<" || F.operator === "<=") {
          if (b = r(m, F, h), b === F && b !== m)
            return !1;
        } else if (m.operator === "<=" && !f(m.semver, String(F), h))
          return !1;
      }
      if (!F.operator && (m || y) && _ !== 0)
        return !1;
    }
    return !(y && D && !m && _ !== 0 || m && C && !y && _ !== 0 || I || N);
  }, s = (t, o, h) => {
    if (!t)
      return o;
    const g = c(t.semver, o.semver, h);
    return g > 0 ? t : g < 0 || o.operator === ">" && t.operator === ">=" ? o : t;
  }, r = (t, o, h) => {
    if (!t)
      return o;
    const g = c(t.semver, o.semver, h);
    return g < 0 ? t : g > 0 || o.operator === "<" && t.operator === "<=" ? o : t;
  };
  return Hi = l, Hi;
}
var Gi, $a;
function eu() {
  if ($a) return Gi;
  $a = 1;
  const n = gr(), d = Mr(), p = je(), f = Kl(), c = $t(), l = Kc(), i = Jc(), u = Qc(), a = Zc(), s = ef(), r = tf(), t = rf(), o = nf(), h = Ze(), g = of(), y = sf(), m = ro(), _ = af(), R = lf(), b = jr(), D = no(), C = Jl(), N = Ql(), I = io(), F = oo(), B = Zl(), S = uf(), Y = Hr(), H = et(), V = Gr(), L = ff(), O = df(), A = hf(), P = pf(), k = mf(), j = so(), X = gf(), oe = Ef(), Z = yf(), de = vf(), ye = wf();
  return Gi = {
    parse: c,
    valid: l,
    clean: i,
    inc: u,
    diff: a,
    major: s,
    minor: r,
    patch: t,
    prerelease: o,
    compare: h,
    rcompare: g,
    compareLoose: y,
    compareBuild: m,
    sort: _,
    rsort: R,
    gt: b,
    lt: D,
    eq: C,
    neq: N,
    gte: I,
    lte: F,
    cmp: B,
    coerce: S,
    Comparator: Y,
    Range: H,
    satisfies: V,
    toComparators: L,
    maxSatisfying: O,
    minSatisfying: A,
    minVersion: P,
    validRange: k,
    outside: j,
    gtr: X,
    ltr: oe,
    intersects: Z,
    simplifyRange: de,
    subset: ye,
    SemVer: p,
    re: n.re,
    src: n.src,
    tokens: n.t,
    SEMVER_SPEC_VERSION: d.SEMVER_SPEC_VERSION,
    RELEASE_TYPES: d.RELEASE_TYPES,
    compareIdentifiers: f.compareIdentifiers,
    rcompareIdentifiers: f.rcompareIdentifiers
  }, Gi;
}
var Ft = {}, fr = { exports: {} };
fr.exports;
var Ma;
function _f() {
  return Ma || (Ma = 1, (function(n, d) {
    var p = 200, f = "__lodash_hash_undefined__", c = 1, l = 2, i = 9007199254740991, u = "[object Arguments]", a = "[object Array]", s = "[object AsyncFunction]", r = "[object Boolean]", t = "[object Date]", o = "[object Error]", h = "[object Function]", g = "[object GeneratorFunction]", y = "[object Map]", m = "[object Number]", _ = "[object Null]", R = "[object Object]", b = "[object Promise]", D = "[object Proxy]", C = "[object RegExp]", N = "[object Set]", I = "[object String]", F = "[object Symbol]", B = "[object Undefined]", S = "[object WeakMap]", Y = "[object ArrayBuffer]", H = "[object DataView]", V = "[object Float32Array]", L = "[object Float64Array]", O = "[object Int8Array]", A = "[object Int16Array]", P = "[object Int32Array]", k = "[object Uint8Array]", j = "[object Uint8ClampedArray]", X = "[object Uint16Array]", oe = "[object Uint32Array]", Z = /[\\^$.*+?()[\]{}|]/g, de = /^\[object .+?Constructor\]$/, ye = /^(?:0|[1-9]\d*)$/, K = {};
    K[V] = K[L] = K[O] = K[A] = K[P] = K[k] = K[j] = K[X] = K[oe] = !0, K[u] = K[a] = K[Y] = K[r] = K[H] = K[t] = K[o] = K[h] = K[y] = K[m] = K[R] = K[C] = K[N] = K[I] = K[S] = !1;
    var ue = typeof Qe == "object" && Qe && Qe.Object === Object && Qe, he = typeof self == "object" && self && self.Object === Object && self, me = ue || he || Function("return this")(), pe = d && !d.nodeType && d, _e = pe && !0 && n && !n.nodeType && n, ve = _e && _e.exports === pe, Ae = ve && ue.process, v = (function() {
      try {
        return Ae && Ae.binding && Ae.binding("util");
      } catch {
      }
    })(), E = v && v.isTypedArray;
    function $(T, U) {
      for (var te = -1, le = T == null ? 0 : T.length, Ce = 0, Ee = []; ++te < le; ) {
        var Ie = T[te];
        U(Ie, te, T) && (Ee[Ce++] = Ie);
      }
      return Ee;
    }
    function x(T, U) {
      for (var te = -1, le = U.length, Ce = T.length; ++te < le; )
        T[Ce + te] = U[te];
      return T;
    }
    function ge(T, U) {
      for (var te = -1, le = T == null ? 0 : T.length; ++te < le; )
        if (U(T[te], te, T))
          return !0;
      return !1;
    }
    function Se(T, U) {
      for (var te = -1, le = Array(T); ++te < T; )
        le[te] = U(te);
      return le;
    }
    function be(T) {
      return function(U) {
        return T(U);
      };
    }
    function De(T, U) {
      return T.has(U);
    }
    function Ne(T, U) {
      return T?.[U];
    }
    function $e(T) {
      var U = -1, te = Array(T.size);
      return T.forEach(function(le, Ce) {
        te[++U] = [Ce, le];
      }), te;
    }
    function Re(T, U) {
      return function(te) {
        return T(U(te));
      };
    }
    function Me(T) {
      var U = -1, te = Array(T.size);
      return T.forEach(function(le) {
        te[++U] = le;
      }), te;
    }
    var st = Array.prototype, rt = Function.prototype, Ye = Object.prototype, e = me["__core-js_shared__"], q = rt.toString, W = Ye.hasOwnProperty, Q = (function() {
      var T = /[^.]+$/.exec(e && e.keys && e.keys.IE_PROTO || "");
      return T ? "Symbol(src)_1." + T : "";
    })(), G = Ye.toString, ie = RegExp(
      "^" + q.call(W).replace(Z, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
    ), w = ve ? me.Buffer : void 0, M = me.Symbol, ne = me.Uint8Array, z = Ye.propertyIsEnumerable, J = st.splice, ee = M ? M.toStringTag : void 0, re = Object.getOwnPropertySymbols, ae = w ? w.isBuffer : void 0, se = Re(Object.keys, Object), ce = It(me, "DataView"), fe = It(me, "Map"), we = It(me, "Promise"), Te = It(me, "Set"), Pt = It(me, "WeakMap"), Ke = It(Object, "create"), gt = vt(ce), du = vt(fe), hu = vt(we), pu = vt(Te), mu = vt(Pt), co = M ? M.prototype : void 0, Wr = co ? co.valueOf : void 0;
    function Et(T) {
      var U = -1, te = T == null ? 0 : T.length;
      for (this.clear(); ++U < te; ) {
        var le = T[U];
        this.set(le[0], le[1]);
      }
    }
    function gu() {
      this.__data__ = Ke ? Ke(null) : {}, this.size = 0;
    }
    function Eu(T) {
      var U = this.has(T) && delete this.__data__[T];
      return this.size -= U ? 1 : 0, U;
    }
    function yu(T) {
      var U = this.__data__;
      if (Ke) {
        var te = U[T];
        return te === f ? void 0 : te;
      }
      return W.call(U, T) ? U[T] : void 0;
    }
    function vu(T) {
      var U = this.__data__;
      return Ke ? U[T] !== void 0 : W.call(U, T);
    }
    function wu(T, U) {
      var te = this.__data__;
      return this.size += this.has(T) ? 0 : 1, te[T] = Ke && U === void 0 ? f : U, this;
    }
    Et.prototype.clear = gu, Et.prototype.delete = Eu, Et.prototype.get = yu, Et.prototype.has = vu, Et.prototype.set = wu;
    function nt(T) {
      var U = -1, te = T == null ? 0 : T.length;
      for (this.clear(); ++U < te; ) {
        var le = T[U];
        this.set(le[0], le[1]);
      }
    }
    function _u() {
      this.__data__ = [], this.size = 0;
    }
    function Au(T) {
      var U = this.__data__, te = yr(U, T);
      if (te < 0)
        return !1;
      var le = U.length - 1;
      return te == le ? U.pop() : J.call(U, te, 1), --this.size, !0;
    }
    function Ru(T) {
      var U = this.__data__, te = yr(U, T);
      return te < 0 ? void 0 : U[te][1];
    }
    function Tu(T) {
      return yr(this.__data__, T) > -1;
    }
    function Su(T, U) {
      var te = this.__data__, le = yr(te, T);
      return le < 0 ? (++this.size, te.push([T, U])) : te[le][1] = U, this;
    }
    nt.prototype.clear = _u, nt.prototype.delete = Au, nt.prototype.get = Ru, nt.prototype.has = Tu, nt.prototype.set = Su;
    function yt(T) {
      var U = -1, te = T == null ? 0 : T.length;
      for (this.clear(); ++U < te; ) {
        var le = T[U];
        this.set(le[0], le[1]);
      }
    }
    function bu() {
      this.size = 0, this.__data__ = {
        hash: new Et(),
        map: new (fe || nt)(),
        string: new Et()
      };
    }
    function Cu(T) {
      var U = vr(this, T).delete(T);
      return this.size -= U ? 1 : 0, U;
    }
    function Ou(T) {
      return vr(this, T).get(T);
    }
    function Pu(T) {
      return vr(this, T).has(T);
    }
    function Iu(T, U) {
      var te = vr(this, T), le = te.size;
      return te.set(T, U), this.size += te.size == le ? 0 : 1, this;
    }
    yt.prototype.clear = bu, yt.prototype.delete = Cu, yt.prototype.get = Ou, yt.prototype.has = Pu, yt.prototype.set = Iu;
    function Er(T) {
      var U = -1, te = T == null ? 0 : T.length;
      for (this.__data__ = new yt(); ++U < te; )
        this.add(T[U]);
    }
    function Du(T) {
      return this.__data__.set(T, f), this;
    }
    function Nu(T) {
      return this.__data__.has(T);
    }
    Er.prototype.add = Er.prototype.push = Du, Er.prototype.has = Nu;
    function at(T) {
      var U = this.__data__ = new nt(T);
      this.size = U.size;
    }
    function Fu() {
      this.__data__ = new nt(), this.size = 0;
    }
    function xu(T) {
      var U = this.__data__, te = U.delete(T);
      return this.size = U.size, te;
    }
    function Lu(T) {
      return this.__data__.get(T);
    }
    function Uu(T) {
      return this.__data__.has(T);
    }
    function ku(T, U) {
      var te = this.__data__;
      if (te instanceof nt) {
        var le = te.__data__;
        if (!fe || le.length < p - 1)
          return le.push([T, U]), this.size = ++te.size, this;
        te = this.__data__ = new yt(le);
      }
      return te.set(T, U), this.size = te.size, this;
    }
    at.prototype.clear = Fu, at.prototype.delete = xu, at.prototype.get = Lu, at.prototype.has = Uu, at.prototype.set = ku;
    function qu(T, U) {
      var te = wr(T), le = !te && Zu(T), Ce = !te && !le && Yr(T), Ee = !te && !le && !Ce && wo(T), Ie = te || le || Ce || Ee, xe = Ie ? Se(T.length, String) : [], Ue = xe.length;
      for (var Pe in T)
        W.call(T, Pe) && !(Ie && // Safari 9 has enumerable `arguments.length` in strict mode.
        (Pe == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
        Ce && (Pe == "offset" || Pe == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
        Ee && (Pe == "buffer" || Pe == "byteLength" || Pe == "byteOffset") || // Skip index properties.
        zu(Pe, Ue))) && xe.push(Pe);
      return xe;
    }
    function yr(T, U) {
      for (var te = T.length; te--; )
        if (go(T[te][0], U))
          return te;
      return -1;
    }
    function $u(T, U, te) {
      var le = U(T);
      return wr(T) ? le : x(le, te(T));
    }
    function Mt(T) {
      return T == null ? T === void 0 ? B : _ : ee && ee in Object(T) ? Wu(T) : Qu(T);
    }
    function fo(T) {
      return Bt(T) && Mt(T) == u;
    }
    function ho(T, U, te, le, Ce) {
      return T === U ? !0 : T == null || U == null || !Bt(T) && !Bt(U) ? T !== T && U !== U : Mu(T, U, te, le, ho, Ce);
    }
    function Mu(T, U, te, le, Ce, Ee) {
      var Ie = wr(T), xe = wr(U), Ue = Ie ? a : lt(T), Pe = xe ? a : lt(U);
      Ue = Ue == u ? R : Ue, Pe = Pe == u ? R : Pe;
      var Ge = Ue == R, Je = Pe == R, ke = Ue == Pe;
      if (ke && Yr(T)) {
        if (!Yr(U))
          return !1;
        Ie = !0, Ge = !1;
      }
      if (ke && !Ge)
        return Ee || (Ee = new at()), Ie || wo(T) ? po(T, U, te, le, Ce, Ee) : Gu(T, U, Ue, te, le, Ce, Ee);
      if (!(te & c)) {
        var ze = Ge && W.call(T, "__wrapped__"), Xe = Je && W.call(U, "__wrapped__");
        if (ze || Xe) {
          var ut = ze ? T.value() : T, it = Xe ? U.value() : U;
          return Ee || (Ee = new at()), Ce(ut, it, te, le, Ee);
        }
      }
      return ke ? (Ee || (Ee = new at()), Vu(T, U, te, le, Ce, Ee)) : !1;
    }
    function Bu(T) {
      if (!vo(T) || Ku(T))
        return !1;
      var U = Eo(T) ? ie : de;
      return U.test(vt(T));
    }
    function ju(T) {
      return Bt(T) && yo(T.length) && !!K[Mt(T)];
    }
    function Hu(T) {
      if (!Ju(T))
        return se(T);
      var U = [];
      for (var te in Object(T))
        W.call(T, te) && te != "constructor" && U.push(te);
      return U;
    }
    function po(T, U, te, le, Ce, Ee) {
      var Ie = te & c, xe = T.length, Ue = U.length;
      if (xe != Ue && !(Ie && Ue > xe))
        return !1;
      var Pe = Ee.get(T);
      if (Pe && Ee.get(U))
        return Pe == U;
      var Ge = -1, Je = !0, ke = te & l ? new Er() : void 0;
      for (Ee.set(T, U), Ee.set(U, T); ++Ge < xe; ) {
        var ze = T[Ge], Xe = U[Ge];
        if (le)
          var ut = Ie ? le(Xe, ze, Ge, U, T, Ee) : le(ze, Xe, Ge, T, U, Ee);
        if (ut !== void 0) {
          if (ut)
            continue;
          Je = !1;
          break;
        }
        if (ke) {
          if (!ge(U, function(it, wt) {
            if (!De(ke, wt) && (ze === it || Ce(ze, it, te, le, Ee)))
              return ke.push(wt);
          })) {
            Je = !1;
            break;
          }
        } else if (!(ze === Xe || Ce(ze, Xe, te, le, Ee))) {
          Je = !1;
          break;
        }
      }
      return Ee.delete(T), Ee.delete(U), Je;
    }
    function Gu(T, U, te, le, Ce, Ee, Ie) {
      switch (te) {
        case H:
          if (T.byteLength != U.byteLength || T.byteOffset != U.byteOffset)
            return !1;
          T = T.buffer, U = U.buffer;
        case Y:
          return !(T.byteLength != U.byteLength || !Ee(new ne(T), new ne(U)));
        case r:
        case t:
        case m:
          return go(+T, +U);
        case o:
          return T.name == U.name && T.message == U.message;
        case C:
        case I:
          return T == U + "";
        case y:
          var xe = $e;
        case N:
          var Ue = le & c;
          if (xe || (xe = Me), T.size != U.size && !Ue)
            return !1;
          var Pe = Ie.get(T);
          if (Pe)
            return Pe == U;
          le |= l, Ie.set(T, U);
          var Ge = po(xe(T), xe(U), le, Ce, Ee, Ie);
          return Ie.delete(T), Ge;
        case F:
          if (Wr)
            return Wr.call(T) == Wr.call(U);
      }
      return !1;
    }
    function Vu(T, U, te, le, Ce, Ee) {
      var Ie = te & c, xe = mo(T), Ue = xe.length, Pe = mo(U), Ge = Pe.length;
      if (Ue != Ge && !Ie)
        return !1;
      for (var Je = Ue; Je--; ) {
        var ke = xe[Je];
        if (!(Ie ? ke in U : W.call(U, ke)))
          return !1;
      }
      var ze = Ee.get(T);
      if (ze && Ee.get(U))
        return ze == U;
      var Xe = !0;
      Ee.set(T, U), Ee.set(U, T);
      for (var ut = Ie; ++Je < Ue; ) {
        ke = xe[Je];
        var it = T[ke], wt = U[ke];
        if (le)
          var _o = Ie ? le(wt, it, ke, U, T, Ee) : le(it, wt, ke, T, U, Ee);
        if (!(_o === void 0 ? it === wt || Ce(it, wt, te, le, Ee) : _o)) {
          Xe = !1;
          break;
        }
        ut || (ut = ke == "constructor");
      }
      if (Xe && !ut) {
        var _r = T.constructor, Ar = U.constructor;
        _r != Ar && "constructor" in T && "constructor" in U && !(typeof _r == "function" && _r instanceof _r && typeof Ar == "function" && Ar instanceof Ar) && (Xe = !1);
      }
      return Ee.delete(T), Ee.delete(U), Xe;
    }
    function mo(T) {
      return $u(T, rc, Yu);
    }
    function vr(T, U) {
      var te = T.__data__;
      return Xu(U) ? te[typeof U == "string" ? "string" : "hash"] : te.map;
    }
    function It(T, U) {
      var te = Ne(T, U);
      return Bu(te) ? te : void 0;
    }
    function Wu(T) {
      var U = W.call(T, ee), te = T[ee];
      try {
        T[ee] = void 0;
        var le = !0;
      } catch {
      }
      var Ce = G.call(T);
      return le && (U ? T[ee] = te : delete T[ee]), Ce;
    }
    var Yu = re ? function(T) {
      return T == null ? [] : (T = Object(T), $(re(T), function(U) {
        return z.call(T, U);
      }));
    } : nc, lt = Mt;
    (ce && lt(new ce(new ArrayBuffer(1))) != H || fe && lt(new fe()) != y || we && lt(we.resolve()) != b || Te && lt(new Te()) != N || Pt && lt(new Pt()) != S) && (lt = function(T) {
      var U = Mt(T), te = U == R ? T.constructor : void 0, le = te ? vt(te) : "";
      if (le)
        switch (le) {
          case gt:
            return H;
          case du:
            return y;
          case hu:
            return b;
          case pu:
            return N;
          case mu:
            return S;
        }
      return U;
    });
    function zu(T, U) {
      return U = U ?? i, !!U && (typeof T == "number" || ye.test(T)) && T > -1 && T % 1 == 0 && T < U;
    }
    function Xu(T) {
      var U = typeof T;
      return U == "string" || U == "number" || U == "symbol" || U == "boolean" ? T !== "__proto__" : T === null;
    }
    function Ku(T) {
      return !!Q && Q in T;
    }
    function Ju(T) {
      var U = T && T.constructor, te = typeof U == "function" && U.prototype || Ye;
      return T === te;
    }
    function Qu(T) {
      return G.call(T);
    }
    function vt(T) {
      if (T != null) {
        try {
          return q.call(T);
        } catch {
        }
        try {
          return T + "";
        } catch {
        }
      }
      return "";
    }
    function go(T, U) {
      return T === U || T !== T && U !== U;
    }
    var Zu = fo(/* @__PURE__ */ (function() {
      return arguments;
    })()) ? fo : function(T) {
      return Bt(T) && W.call(T, "callee") && !z.call(T, "callee");
    }, wr = Array.isArray;
    function ec(T) {
      return T != null && yo(T.length) && !Eo(T);
    }
    var Yr = ae || ic;
    function tc(T, U) {
      return ho(T, U);
    }
    function Eo(T) {
      if (!vo(T))
        return !1;
      var U = Mt(T);
      return U == h || U == g || U == s || U == D;
    }
    function yo(T) {
      return typeof T == "number" && T > -1 && T % 1 == 0 && T <= i;
    }
    function vo(T) {
      var U = typeof T;
      return T != null && (U == "object" || U == "function");
    }
    function Bt(T) {
      return T != null && typeof T == "object";
    }
    var wo = E ? be(E) : ju;
    function rc(T) {
      return ec(T) ? qu(T) : Hu(T);
    }
    function nc() {
      return [];
    }
    function ic() {
      return !1;
    }
    n.exports = tc;
  })(fr, fr.exports)), fr.exports;
}
var Ba;
function Af() {
  if (Ba) return Ft;
  Ba = 1, Object.defineProperty(Ft, "__esModule", { value: !0 }), Ft.DownloadedUpdateHelper = void 0, Ft.createTempUpdateFile = u;
  const n = hr, d = ht, p = _f(), f = /* @__PURE__ */ mt(), c = Oe;
  let l = class {
    constructor(s) {
      this.cacheDir = s, this._file = null, this._packageFile = null, this.versionInfo = null, this.fileInfo = null, this._downloadedFileInfo = null;
    }
    get downloadedFileInfo() {
      return this._downloadedFileInfo;
    }
    get file() {
      return this._file;
    }
    get packageFile() {
      return this._packageFile;
    }
    get cacheDirForPendingUpdate() {
      return c.join(this.cacheDir, "pending");
    }
    async validateDownloadedPath(s, r, t, o) {
      if (this.versionInfo != null && this.file === s && this.fileInfo != null)
        return p(this.versionInfo, r) && p(this.fileInfo.info, t.info) && await (0, f.pathExists)(s) ? s : null;
      const h = await this.getValidCachedUpdateFile(t, o);
      return h === null ? null : (o.info(`Update has already been downloaded to ${s}).`), this._file = h, h);
    }
    async setDownloadedFile(s, r, t, o, h, g) {
      this._file = s, this._packageFile = r, this.versionInfo = t, this.fileInfo = o, this._downloadedFileInfo = {
        fileName: h,
        sha512: o.info.sha512,
        isAdminRightsRequired: o.info.isAdminRightsRequired === !0
      }, g && await (0, f.outputJson)(this.getUpdateInfoFile(), this._downloadedFileInfo);
    }
    async clear() {
      this._file = null, this._packageFile = null, this.versionInfo = null, this.fileInfo = null, await this.cleanCacheDirForPendingUpdate();
    }
    async cleanCacheDirForPendingUpdate() {
      try {
        await (0, f.emptyDir)(this.cacheDirForPendingUpdate);
      } catch {
      }
    }
    /**
     * Returns "update-info.json" which is created in the update cache directory's "pending" subfolder after the first update is downloaded.  If the update file does not exist then the cache is cleared and recreated.  If the update file exists then its properties are validated.
     * @param fileInfo
     * @param logger
     */
    async getValidCachedUpdateFile(s, r) {
      const t = this.getUpdateInfoFile();
      if (!await (0, f.pathExists)(t))
        return null;
      let h;
      try {
        h = await (0, f.readJson)(t);
      } catch (_) {
        let R = "No cached update info available";
        return _.code !== "ENOENT" && (await this.cleanCacheDirForPendingUpdate(), R += ` (error on read: ${_.message})`), r.info(R), null;
      }
      if (!(h?.fileName !== null))
        return r.warn("Cached update info is corrupted: no fileName, directory for cached update will be cleaned"), await this.cleanCacheDirForPendingUpdate(), null;
      if (s.info.sha512 !== h.sha512)
        return r.info(`Cached update sha512 checksum doesn't match the latest available update. New update must be downloaded. Cached: ${h.sha512}, expected: ${s.info.sha512}. Directory for cached update will be cleaned`), await this.cleanCacheDirForPendingUpdate(), null;
      const y = c.join(this.cacheDirForPendingUpdate, h.fileName);
      if (!await (0, f.pathExists)(y))
        return r.info("Cached update file doesn't exist"), null;
      const m = await i(y);
      return s.info.sha512 !== m ? (r.warn(`Sha512 checksum doesn't match the latest available update. New update must be downloaded. Cached: ${m}, expected: ${s.info.sha512}`), await this.cleanCacheDirForPendingUpdate(), null) : (this._downloadedFileInfo = h, y);
    }
    getUpdateInfoFile() {
      return c.join(this.cacheDirForPendingUpdate, "update-info.json");
    }
  };
  Ft.DownloadedUpdateHelper = l;
  function i(a, s = "sha512", r = "base64", t) {
    return new Promise((o, h) => {
      const g = (0, n.createHash)(s);
      g.on("error", h).setEncoding(r), (0, d.createReadStream)(a, {
        ...t,
        highWaterMark: 1024 * 1024
        /* better to use more memory but hash faster */
      }).on("error", h).on("end", () => {
        g.end(), o(g.read());
      }).pipe(g, { end: !1 });
    });
  }
  async function u(a, s, r) {
    let t = 0, o = c.join(s, a);
    for (let h = 0; h < 3; h++)
      try {
        return await (0, f.unlink)(o), o;
      } catch (g) {
        if (g.code === "ENOENT")
          return o;
        r.warn(`Error on remove temp update file: ${g}`), o = c.join(s, `${t++}-${a}`);
      }
    return o;
  }
  return Ft;
}
var Wt = {}, xr = {}, ja;
function Rf() {
  if (ja) return xr;
  ja = 1, Object.defineProperty(xr, "__esModule", { value: !0 }), xr.getAppCacheDir = p;
  const n = Oe, d = kr;
  function p() {
    const f = (0, d.homedir)();
    let c;
    return process.platform === "win32" ? c = process.env.LOCALAPPDATA || n.join(f, "AppData", "Local") : process.platform === "darwin" ? c = n.join(f, "Library", "Caches") : c = process.env.XDG_CACHE_HOME || n.join(f, ".cache"), c;
  }
  return xr;
}
var Ha;
function Tf() {
  if (Ha) return Wt;
  Ha = 1, Object.defineProperty(Wt, "__esModule", { value: !0 }), Wt.ElectronAppAdapter = void 0;
  const n = Oe, d = Rf();
  let p = class {
    constructor(c = St.app) {
      this.app = c;
    }
    whenReady() {
      return this.app.whenReady();
    }
    get version() {
      return this.app.getVersion();
    }
    get name() {
      return this.app.getName();
    }
    get isPackaged() {
      return this.app.isPackaged === !0;
    }
    get appUpdateConfigPath() {
      return this.isPackaged ? n.join(process.resourcesPath, "app-update.yml") : n.join(this.app.getAppPath(), "dev-app-update.yml");
    }
    get userDataPath() {
      return this.app.getPath("userData");
    }
    get baseCachePath() {
      return (0, d.getAppCacheDir)();
    }
    quit() {
      this.app.quit();
    }
    relaunch() {
      this.app.relaunch();
    }
    onQuit(c) {
      this.app.once("quit", (l, i) => c(i));
    }
  };
  return Wt.ElectronAppAdapter = p, Wt;
}
var Vi = {}, Ga;
function Sf() {
  return Ga || (Ga = 1, (function(n) {
    Object.defineProperty(n, "__esModule", { value: !0 }), n.ElectronHttpExecutor = n.NET_SESSION_NAME = void 0, n.getNetSession = p;
    const d = Le();
    n.NET_SESSION_NAME = "electron-updater";
    function p() {
      return St.session.fromPartition(n.NET_SESSION_NAME, {
        cache: !1
      });
    }
    class f extends d.HttpExecutor {
      constructor(l) {
        super(), this.proxyLoginCallback = l, this.cachedSession = null;
      }
      async download(l, i, u) {
        return await u.cancellationToken.createPromise((a, s, r) => {
          const t = {
            headers: u.headers || void 0,
            redirect: "manual"
          };
          (0, d.configureRequestUrl)(l, t), (0, d.configureRequestOptions)(t), this.doDownload(t, {
            destination: i,
            options: u,
            onCancel: r,
            callback: (o) => {
              o == null ? a(i) : s(o);
            },
            responseHandler: null
          }, 0);
        });
      }
      createRequest(l, i) {
        l.headers && l.headers.Host && (l.host = l.headers.Host, delete l.headers.Host), this.cachedSession == null && (this.cachedSession = p());
        const u = St.net.request({
          ...l,
          session: this.cachedSession
        });
        return u.on("response", i), this.proxyLoginCallback != null && u.on("login", this.proxyLoginCallback), u;
      }
      addRedirectHandlers(l, i, u, a, s) {
        l.on("redirect", (r, t, o) => {
          l.abort(), a > this.maxRedirects ? u(this.createMaxRedirectError()) : s(d.HttpExecutor.prepareRedirectUrlOptions(o, i));
        });
      }
    }
    n.ElectronHttpExecutor = f;
  })(Vi)), Vi;
}
var Yt = {}, xt = {}, Va;
function Ct() {
  if (Va) return xt;
  Va = 1, Object.defineProperty(xt, "__esModule", { value: !0 }), xt.newBaseUrl = d, xt.newUrlFromBase = p, xt.getChannelFilename = f;
  const n = pt;
  function d(c) {
    const l = new n.URL(c);
    return l.pathname.endsWith("/") || (l.pathname += "/"), l;
  }
  function p(c, l, i = !1) {
    const u = new n.URL(c, l), a = l.search;
    return a != null && a.length !== 0 ? u.search = a : i && (u.search = `noCache=${Date.now().toString(32)}`), u;
  }
  function f(c) {
    return `${c}.yml`;
  }
  return xt;
}
var ot = {}, Wi, Wa;
function tu() {
  if (Wa) return Wi;
  Wa = 1;
  var n = "[object Symbol]", d = /[\\^$.*+?()[\]{}|]/g, p = RegExp(d.source), f = typeof Qe == "object" && Qe && Qe.Object === Object && Qe, c = typeof self == "object" && self && self.Object === Object && self, l = f || c || Function("return this")(), i = Object.prototype, u = i.toString, a = l.Symbol, s = a ? a.prototype : void 0, r = s ? s.toString : void 0;
  function t(m) {
    if (typeof m == "string")
      return m;
    if (h(m))
      return r ? r.call(m) : "";
    var _ = m + "";
    return _ == "0" && 1 / m == -1 / 0 ? "-0" : _;
  }
  function o(m) {
    return !!m && typeof m == "object";
  }
  function h(m) {
    return typeof m == "symbol" || o(m) && u.call(m) == n;
  }
  function g(m) {
    return m == null ? "" : t(m);
  }
  function y(m) {
    return m = g(m), m && p.test(m) ? m.replace(d, "\\$&") : m;
  }
  return Wi = y, Wi;
}
var Ya;
function We() {
  if (Ya) return ot;
  Ya = 1, Object.defineProperty(ot, "__esModule", { value: !0 }), ot.Provider = void 0, ot.findFile = i, ot.parseUpdateInfo = u, ot.getFileList = a, ot.resolveFiles = s;
  const n = Le(), d = eo(), p = pt, f = Ct(), c = tu();
  let l = class {
    constructor(t) {
      this.runtimeOptions = t, this.requestHeaders = null, this.executor = t.executor;
    }
    // By default, the blockmap file is in the same directory as the main file
    // But some providers may have a different blockmap file, so we need to override this method
    getBlockMapFiles(t, o, h, g = null) {
      const y = (0, f.newUrlFromBase)(`${t.pathname}.blockmap`, t);
      return [(0, f.newUrlFromBase)(`${t.pathname.replace(new RegExp(c(h), "g"), o)}.blockmap`, g ? new p.URL(g) : t), y];
    }
    get isUseMultipleRangeRequest() {
      return this.runtimeOptions.isUseMultipleRangeRequest !== !1;
    }
    getChannelFilePrefix() {
      if (this.runtimeOptions.platform === "linux") {
        const t = process.env.TEST_UPDATER_ARCH || process.arch;
        return "-linux" + (t === "x64" ? "" : `-${t}`);
      } else
        return this.runtimeOptions.platform === "darwin" ? "-mac" : "";
    }
    // due to historical reasons for windows we use channel name without platform specifier
    getDefaultChannelName() {
      return this.getCustomChannelName("latest");
    }
    getCustomChannelName(t) {
      return `${t}${this.getChannelFilePrefix()}`;
    }
    get fileExtraDownloadHeaders() {
      return null;
    }
    setRequestHeaders(t) {
      this.requestHeaders = t;
    }
    /**
     * Method to perform API request only to resolve update info, but not to download update.
     */
    httpRequest(t, o, h) {
      return this.executor.request(this.createRequestOptions(t, o), h);
    }
    createRequestOptions(t, o) {
      const h = {};
      return this.requestHeaders == null ? o != null && (h.headers = o) : h.headers = o == null ? this.requestHeaders : { ...this.requestHeaders, ...o }, (0, n.configureRequestUrl)(t, h), h;
    }
  };
  ot.Provider = l;
  function i(r, t, o) {
    var h;
    if (r.length === 0)
      throw (0, n.newError)("No files provided", "ERR_UPDATER_NO_FILES_PROVIDED");
    const g = r.filter((m) => m.url.pathname.toLowerCase().endsWith(`.${t.toLowerCase()}`)), y = (h = g.find((m) => [m.url.pathname, m.info.url].some((_) => _.includes(process.arch)))) !== null && h !== void 0 ? h : g.shift();
    return y || (o == null ? r[0] : r.find((m) => !o.some((_) => m.url.pathname.toLowerCase().endsWith(`.${_.toLowerCase()}`))));
  }
  function u(r, t, o) {
    if (r == null)
      throw (0, n.newError)(`Cannot parse update info from ${t} in the latest release artifacts (${o}): rawData: null`, "ERR_UPDATER_INVALID_UPDATE_INFO");
    let h;
    try {
      h = (0, d.load)(r);
    } catch (g) {
      throw (0, n.newError)(`Cannot parse update info from ${t} in the latest release artifacts (${o}): ${g.stack || g.message}, rawData: ${r}`, "ERR_UPDATER_INVALID_UPDATE_INFO");
    }
    return h;
  }
  function a(r) {
    const t = r.files;
    if (t != null && t.length > 0)
      return t;
    if (r.path != null)
      return [
        {
          url: r.path,
          sha2: r.sha2,
          sha512: r.sha512
        }
      ];
    throw (0, n.newError)(`No files provided: ${(0, n.safeStringifyJson)(r)}`, "ERR_UPDATER_NO_FILES_PROVIDED");
  }
  function s(r, t, o = (h) => h) {
    const g = a(r).map((_) => {
      if (_.sha2 == null && _.sha512 == null)
        throw (0, n.newError)(`Update info doesn't contain nor sha256 neither sha512 checksum: ${(0, n.safeStringifyJson)(_)}`, "ERR_UPDATER_NO_CHECKSUM");
      return {
        url: (0, f.newUrlFromBase)(o(_.url), t),
        info: _
      };
    }), y = r.packages, m = y == null ? null : y[process.arch] || y.ia32;
    return m != null && (g[0].packageInfo = {
      ...m,
      path: (0, f.newUrlFromBase)(o(m.path), t).href
    }), g;
  }
  return ot;
}
var za;
function ru() {
  if (za) return Yt;
  za = 1, Object.defineProperty(Yt, "__esModule", { value: !0 }), Yt.GenericProvider = void 0;
  const n = Le(), d = Ct(), p = We();
  let f = class extends p.Provider {
    constructor(l, i, u) {
      super(u), this.configuration = l, this.updater = i, this.baseUrl = (0, d.newBaseUrl)(this.configuration.url);
    }
    get channel() {
      const l = this.updater.channel || this.configuration.channel;
      return l == null ? this.getDefaultChannelName() : this.getCustomChannelName(l);
    }
    async getLatestVersion() {
      const l = (0, d.getChannelFilename)(this.channel), i = (0, d.newUrlFromBase)(l, this.baseUrl, this.updater.isAddNoCacheQuery);
      for (let u = 0; ; u++)
        try {
          return (0, p.parseUpdateInfo)(await this.httpRequest(i), l, i);
        } catch (a) {
          if (a instanceof n.HttpError && a.statusCode === 404)
            throw (0, n.newError)(`Cannot find channel "${l}" update info: ${a.stack || a.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
          if (a.code === "ECONNREFUSED" && u < 3) {
            await new Promise((s, r) => {
              try {
                setTimeout(s, 1e3 * u);
              } catch (t) {
                r(t);
              }
            });
            continue;
          }
          throw a;
        }
    }
    resolveFiles(l) {
      return (0, p.resolveFiles)(l, this.baseUrl);
    }
  };
  return Yt.GenericProvider = f, Yt;
}
var zt = {}, Xt = {}, Xa;
function bf() {
  if (Xa) return Xt;
  Xa = 1, Object.defineProperty(Xt, "__esModule", { value: !0 }), Xt.BitbucketProvider = void 0;
  const n = Le(), d = Ct(), p = We();
  let f = class extends p.Provider {
    constructor(l, i, u) {
      super({
        ...u,
        isUseMultipleRangeRequest: !1
      }), this.configuration = l, this.updater = i;
      const { owner: a, slug: s } = l;
      this.baseUrl = (0, d.newBaseUrl)(`https://api.bitbucket.org/2.0/repositories/${a}/${s}/downloads`);
    }
    get channel() {
      return this.updater.channel || this.configuration.channel || "latest";
    }
    async getLatestVersion() {
      const l = new n.CancellationToken(), i = (0, d.getChannelFilename)(this.getCustomChannelName(this.channel)), u = (0, d.newUrlFromBase)(i, this.baseUrl, this.updater.isAddNoCacheQuery);
      try {
        const a = await this.httpRequest(u, void 0, l);
        return (0, p.parseUpdateInfo)(a, i, u);
      } catch (a) {
        throw (0, n.newError)(`Unable to find latest version on ${this.toString()}, please ensure release exists: ${a.stack || a.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
      }
    }
    resolveFiles(l) {
      return (0, p.resolveFiles)(l, this.baseUrl);
    }
    toString() {
      const { owner: l, slug: i } = this.configuration;
      return `Bitbucket (owner: ${l}, slug: ${i}, channel: ${this.channel})`;
    }
  };
  return Xt.BitbucketProvider = f, Xt;
}
var dt = {}, Ka;
function nu() {
  if (Ka) return dt;
  Ka = 1, Object.defineProperty(dt, "__esModule", { value: !0 }), dt.GitHubProvider = dt.BaseGitHubProvider = void 0, dt.computeReleaseNotes = s;
  const n = Le(), d = eu(), p = pt, f = Ct(), c = We(), l = /\/tag\/(v?[^/]+)$/;
  class i extends c.Provider {
    constructor(t, o, h) {
      super({
        ...h,
        /* because GitHib uses S3 */
        isUseMultipleRangeRequest: !1
      }), this.options = t, this.baseUrl = (0, f.newBaseUrl)((0, n.githubUrl)(t, o));
      const g = o === "github.com" ? "api.github.com" : o;
      this.baseApiUrl = (0, f.newBaseUrl)((0, n.githubUrl)(t, g));
    }
    computeGithubBasePath(t) {
      const o = this.options.host;
      return o && !["github.com", "api.github.com"].includes(o) ? `/api/v3${t}` : t;
    }
  }
  dt.BaseGitHubProvider = i;
  let u = class extends i {
    constructor(t, o, h) {
      super(t, "github.com", h), this.options = t, this.updater = o;
    }
    get channel() {
      const t = this.updater.channel || this.options.channel;
      return t == null ? this.getDefaultChannelName() : this.getCustomChannelName(t);
    }
    async getLatestVersion() {
      var t, o, h, g, y;
      const m = new n.CancellationToken(), _ = await this.httpRequest((0, f.newUrlFromBase)(`${this.basePath}.atom`, this.baseUrl), {
        accept: "application/xml, application/atom+xml, text/xml, */*"
      }, m), R = (0, n.parseXml)(_);
      let b = R.element("entry", !1, "No published versions on GitHub"), D = null;
      try {
        if (this.updater.allowPrerelease) {
          const S = ((t = this.updater) === null || t === void 0 ? void 0 : t.channel) || ((o = d.prerelease(this.updater.currentVersion)) === null || o === void 0 ? void 0 : o[0]) || null;
          if (S === null)
            D = l.exec(b.element("link").attribute("href"))[1];
          else
            for (const Y of R.getElements("entry")) {
              const H = l.exec(Y.element("link").attribute("href"));
              if (H === null)
                continue;
              const V = H[1];
              if (!d.valid(V))
                continue;
              const L = ((h = d.prerelease(V)) === null || h === void 0 ? void 0 : h[0]) || null, O = !S || ["alpha", "beta"].includes(S), A = L !== null && !["alpha", "beta"].includes(String(L));
              if (O && !A && !(S === "beta" && L === "alpha")) {
                D = V, b = Y;
                break;
              }
              if (L && L === S) {
                D = V, b = Y;
                break;
              }
            }
        } else {
          D = await this.getLatestTagName(m);
          for (const S of R.getElements("entry")) {
            const Y = l.exec(S.element("link").attribute("href"));
            if (Y != null && Y[1] === D) {
              b = S;
              break;
            }
          }
        }
      } catch (S) {
        throw (0, n.newError)(`Cannot parse releases feed: ${S.stack || S.message},
XML:
${_}`, "ERR_UPDATER_INVALID_RELEASE_FEED");
      }
      if (D == null)
        throw (0, n.newError)("No published versions on GitHub", "ERR_UPDATER_NO_PUBLISHED_VERSIONS");
      let C, N = "", I = "";
      const F = async (S) => {
        N = (0, f.getChannelFilename)(S), I = (0, f.newUrlFromBase)(this.getBaseDownloadPath(String(D), N), this.baseUrl);
        const Y = this.createRequestOptions(I);
        try {
          return await this.executor.request(Y, m);
        } catch (H) {
          throw H instanceof n.HttpError && H.statusCode === 404 ? (0, n.newError)(`Cannot find ${N} in the latest release artifacts (${I}): ${H.stack || H.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : H;
        }
      };
      try {
        let S = this.channel;
        this.updater.allowPrerelease && (!((g = d.prerelease(D)) === null || g === void 0) && g[0]) && (S = this.getCustomChannelName(String((y = d.prerelease(D)) === null || y === void 0 ? void 0 : y[0]))), C = await F(S);
      } catch (S) {
        if (this.updater.allowPrerelease)
          C = await F(this.getDefaultChannelName());
        else
          throw S;
      }
      const B = (0, c.parseUpdateInfo)(C, N, I);
      return B.releaseName == null && (B.releaseName = b.elementValueOrEmpty("title")), B.releaseNotes == null && (B.releaseNotes = s(this.updater.currentVersion, this.updater.fullChangelog, R, b)), {
        tag: D,
        ...B
      };
    }
    async getLatestTagName(t) {
      const o = this.options, h = o.host == null || o.host === "github.com" ? (0, f.newUrlFromBase)(`${this.basePath}/latest`, this.baseUrl) : new p.URL(`${this.computeGithubBasePath(`/repos/${o.owner}/${o.repo}/releases`)}/latest`, this.baseApiUrl);
      try {
        const g = await this.httpRequest(h, { Accept: "application/json" }, t);
        return g == null ? null : JSON.parse(g).tag_name;
      } catch (g) {
        throw (0, n.newError)(`Unable to find latest version on GitHub (${h}), please ensure a production release exists: ${g.stack || g.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
      }
    }
    get basePath() {
      return `/${this.options.owner}/${this.options.repo}/releases`;
    }
    resolveFiles(t) {
      return (0, c.resolveFiles)(t, this.baseUrl, (o) => this.getBaseDownloadPath(t.tag, o.replace(/ /g, "-")));
    }
    getBaseDownloadPath(t, o) {
      return `${this.basePath}/download/${t}/${o}`;
    }
  };
  dt.GitHubProvider = u;
  function a(r) {
    const t = r.elementValueOrEmpty("content");
    return t === "No content." ? "" : t;
  }
  function s(r, t, o, h) {
    if (!t)
      return a(h);
    const g = /\/tag\/v?([^/]+)$/;
    let y;
    try {
      y = g.exec(h.element("link").attribute("href"))[1], y = d.valid(y) ? y : void 0;
    } catch {
    }
    if (y == null)
      return null;
    const m = [];
    for (const _ of o.getElements("entry")) {
      let R;
      try {
        const C = g.exec(_.element("link").attribute("href"));
        if (!C)
          continue;
        R = C[1];
      } catch {
        continue;
      }
      if (!d.valid(R))
        continue;
      const b = d.gt(R, r.raw), D = d.lte(R, y);
      b && D && m.push({
        version: R,
        note: a(_)
      });
    }
    return m.sort((_, R) => d.rcompare(_.version, R.version));
  }
  return dt;
}
var Kt = {}, Ja;
function Cf() {
  if (Ja) return Kt;
  Ja = 1, Object.defineProperty(Kt, "__esModule", { value: !0 }), Kt.GitLabProvider = void 0;
  const n = Le(), d = pt, p = tu(), f = Ct(), c = We();
  let l = class extends c.Provider {
    /**
     * Normalizes filenames by replacing spaces and underscores with dashes.
     *
     * This is a workaround to handle filename formatting differences between tools:
     * - electron-builder formats filenames like "test file.txt" as "test-file.txt"
     * - GitLab may provide asset URLs using underscores, such as "test_file.txt"
     *
     * Because of this mismatch, we can't reliably extract the correct filename from
     * the asset path without normalization. This function ensures consistent matching
     * across different filename formats by converting all spaces and underscores to dashes.
     *
     * @param filename The filename to normalize
     * @returns The normalized filename with spaces and underscores replaced by dashes
     */
    normalizeFilename(u) {
      return u.replace(/ |_/g, "-");
    }
    constructor(u, a, s) {
      super({
        ...s,
        // GitLab might not support multiple range requests efficiently
        isUseMultipleRangeRequest: !1
      }), this.options = u, this.updater = a, this.cachedLatestVersion = null;
      const t = u.host || "gitlab.com";
      this.baseApiUrl = (0, f.newBaseUrl)(`https://${t}/api/v4`);
    }
    createRequestOptions(u, a) {
      const s = super.createRequestOptions(u, a);
      return s.redirect = "manual", s;
    }
    get channel() {
      const u = this.updater.channel || this.options.channel;
      return u == null ? this.getDefaultChannelName() : this.getCustomChannelName(u);
    }
    async getLatestVersion() {
      const u = new n.CancellationToken(), a = (0, f.newUrlFromBase)(`projects/${this.options.projectId}/releases/permalink/latest`, this.baseApiUrl), s = { Accept: "application/json", ...this.setAuthHeaderForToken(this.options.token || null) };
      let r;
      try {
        r = await this.httpRequest(a, s, u);
      } catch (b) {
        throw (0, n.newError)(`Unable to find latest release on GitLab (${a}): ${b.stack || b.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
      }
      if (!r)
        throw (0, n.newError)("No published releases on GitLab", "ERR_UPDATER_NO_PUBLISHED_VERSIONS");
      let t;
      try {
        t = JSON.parse(r);
      } catch (b) {
        throw (0, n.newError)(`Unable to parse latest release response from GitLab (${a}): response was not valid JSON: ${b.stack || b.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
      }
      if (t.upcoming_release)
        throw (0, n.newError)("Latest GitLab release is scheduled but not yet published", "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
      const o = t.tag_name;
      let h = null, g = "", y = null;
      const m = async (b) => {
        g = (0, f.getChannelFilename)(b);
        const D = t.assets.links.find((I) => I.name === g);
        if (!D)
          throw (0, n.newError)(`Cannot find ${g} in the latest release assets`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
        y = new d.URL(D.direct_asset_url);
        const C = this.setAuthHeaderForToken(this.options.token || null), N = Object.keys(C).length ? C : void 0;
        try {
          const I = await this.httpRequest(y, N, u);
          if (!I)
            throw (0, n.newError)(`Empty response from ${y}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
          return I;
        } catch (I) {
          throw I instanceof n.HttpError && I.statusCode === 404 ? (0, n.newError)(`Cannot find ${g} in the latest release artifacts (${y}): ${I.stack || I.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : I;
        }
      };
      try {
        h = await m(this.channel);
      } catch (b) {
        if (this.channel !== this.getDefaultChannelName())
          h = await m(this.getDefaultChannelName());
        else
          throw b;
      }
      if (!h)
        throw (0, n.newError)(`Unable to parse channel data from ${g}`, "ERR_UPDATER_INVALID_UPDATE_INFO");
      const _ = (0, c.parseUpdateInfo)(h, g, y);
      _.releaseName == null && (_.releaseName = t.name), _.releaseNotes == null && (_.releaseNotes = t.description || null);
      const R = {
        tag: o,
        assets: this.convertAssetsToMap(t.assets),
        ..._
      };
      return this.cachedLatestVersion = R, R;
    }
    /**
     * Utility function to convert GitlabReleaseAsset to Map<string, string>
     * Maps asset names to their download URLs
     */
    convertAssetsToMap(u) {
      const a = /* @__PURE__ */ new Map();
      for (const s of u.links)
        a.set(this.normalizeFilename(s.name), s.direct_asset_url);
      return a;
    }
    /**
     * Find blockmap file URL in assets map for a specific filename
     */
    findBlockMapInAssets(u, a) {
      const s = [`${a}.blockmap`, `${this.normalizeFilename(a)}.blockmap`];
      for (const r of s) {
        const t = u.get(r);
        if (t)
          return new d.URL(t);
      }
      return null;
    }
    async fetchReleaseInfoByVersion(u) {
      const a = new n.CancellationToken(), s = [`v${u}`, u];
      for (const r of s) {
        const t = (0, f.newUrlFromBase)(`projects/${this.options.projectId}/releases/${encodeURIComponent(r)}`, this.baseApiUrl);
        try {
          const o = { Accept: "application/json", ...this.setAuthHeaderForToken(this.options.token || null) }, h = await this.httpRequest(t, o, a);
          if (h)
            return JSON.parse(h);
        } catch (o) {
          if (o instanceof n.HttpError && o.statusCode === 404)
            continue;
          throw (0, n.newError)(`Unable to find release ${r} on GitLab (${t}): ${o.stack || o.message}`, "ERR_UPDATER_RELEASE_NOT_FOUND");
        }
      }
      throw (0, n.newError)(`Unable to find release with version ${u} (tried: ${s.join(", ")}) on GitLab`, "ERR_UPDATER_RELEASE_NOT_FOUND");
    }
    setAuthHeaderForToken(u) {
      const a = {};
      return u != null && (u.startsWith("Bearer") ? a.authorization = u : a["PRIVATE-TOKEN"] = u), a;
    }
    /**
     * Get version info for blockmap files, using cache when possible
     */
    async getVersionInfoForBlockMap(u) {
      if (this.cachedLatestVersion && this.cachedLatestVersion.version === u)
        return this.cachedLatestVersion.assets;
      const a = await this.fetchReleaseInfoByVersion(u);
      return a && a.assets ? this.convertAssetsToMap(a.assets) : null;
    }
    /**
     * Find blockmap URLs from version assets
     */
    async findBlockMapUrlsFromAssets(u, a, s) {
      let r = null, t = null;
      const o = await this.getVersionInfoForBlockMap(a);
      o && (r = this.findBlockMapInAssets(o, s));
      const h = await this.getVersionInfoForBlockMap(u);
      if (h) {
        const g = s.replace(new RegExp(p(a), "g"), u);
        t = this.findBlockMapInAssets(h, g);
      }
      return [t, r];
    }
    async getBlockMapFiles(u, a, s, r = null) {
      if (this.options.uploadTarget === "project_upload") {
        const t = u.pathname.split("/").pop() || "", [o, h] = await this.findBlockMapUrlsFromAssets(a, s, t);
        if (!h)
          throw (0, n.newError)(`Cannot find blockmap file for ${s} in GitLab assets`, "ERR_UPDATER_BLOCKMAP_FILE_NOT_FOUND");
        if (!o)
          throw (0, n.newError)(`Cannot find blockmap file for ${a} in GitLab assets`, "ERR_UPDATER_BLOCKMAP_FILE_NOT_FOUND");
        return [o, h];
      } else
        return super.getBlockMapFiles(u, a, s, r);
    }
    resolveFiles(u) {
      return (0, c.getFileList)(u).map((a) => {
        const r = [
          a.url,
          // Original filename
          this.normalizeFilename(a.url)
          // Normalized filename (spaces/underscores → dashes)
        ].find((o) => u.assets.has(o)), t = r ? u.assets.get(r) : void 0;
        if (!t)
          throw (0, n.newError)(`Cannot find asset "${a.url}" in GitLab release assets. Available assets: ${Array.from(u.assets.keys()).join(", ")}`, "ERR_UPDATER_ASSET_NOT_FOUND");
        return {
          url: new d.URL(t),
          info: a
        };
      });
    }
    toString() {
      return `GitLab (projectId: ${this.options.projectId}, channel: ${this.channel})`;
    }
  };
  return Kt.GitLabProvider = l, Kt;
}
var Jt = {}, Qa;
function Of() {
  if (Qa) return Jt;
  Qa = 1, Object.defineProperty(Jt, "__esModule", { value: !0 }), Jt.KeygenProvider = void 0;
  const n = Le(), d = Ct(), p = We();
  let f = class extends p.Provider {
    constructor(l, i, u) {
      super({
        ...u,
        isUseMultipleRangeRequest: !1
      }), this.configuration = l, this.updater = i, this.defaultHostname = "api.keygen.sh";
      const a = this.configuration.host || this.defaultHostname;
      this.baseUrl = (0, d.newBaseUrl)(`https://${a}/v1/accounts/${this.configuration.account}/artifacts?product=${this.configuration.product}`);
    }
    get channel() {
      return this.updater.channel || this.configuration.channel || "stable";
    }
    async getLatestVersion() {
      const l = new n.CancellationToken(), i = (0, d.getChannelFilename)(this.getCustomChannelName(this.channel)), u = (0, d.newUrlFromBase)(i, this.baseUrl, this.updater.isAddNoCacheQuery);
      try {
        const a = await this.httpRequest(u, {
          Accept: "application/vnd.api+json",
          "Keygen-Version": "1.1"
        }, l);
        return (0, p.parseUpdateInfo)(a, i, u);
      } catch (a) {
        throw (0, n.newError)(`Unable to find latest version on ${this.toString()}, please ensure release exists: ${a.stack || a.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
      }
    }
    resolveFiles(l) {
      return (0, p.resolveFiles)(l, this.baseUrl);
    }
    toString() {
      const { account: l, product: i, platform: u } = this.configuration;
      return `Keygen (account: ${l}, product: ${i}, platform: ${u}, channel: ${this.channel})`;
    }
  };
  return Jt.KeygenProvider = f, Jt;
}
var Qt = {}, Za;
function Pf() {
  if (Za) return Qt;
  Za = 1, Object.defineProperty(Qt, "__esModule", { value: !0 }), Qt.PrivateGitHubProvider = void 0;
  const n = Le(), d = eo(), p = Oe, f = pt, c = Ct(), l = nu(), i = We();
  let u = class extends l.BaseGitHubProvider {
    constructor(s, r, t, o) {
      super(s, "api.github.com", o), this.updater = r, this.token = t;
    }
    createRequestOptions(s, r) {
      const t = super.createRequestOptions(s, r);
      return t.redirect = "manual", t;
    }
    async getLatestVersion() {
      const s = new n.CancellationToken(), r = (0, c.getChannelFilename)(this.getDefaultChannelName()), t = await this.getLatestVersionInfo(s), o = t.assets.find((y) => y.name === r);
      if (o == null)
        throw (0, n.newError)(`Cannot find ${r} in the release ${t.html_url || t.name}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
      const h = new f.URL(o.url);
      let g;
      try {
        g = (0, d.load)(await this.httpRequest(h, this.configureHeaders("application/octet-stream"), s));
      } catch (y) {
        throw y instanceof n.HttpError && y.statusCode === 404 ? (0, n.newError)(`Cannot find ${r} in the latest release artifacts (${h}): ${y.stack || y.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : y;
      }
      return g.assets = t.assets, g;
    }
    get fileExtraDownloadHeaders() {
      return this.configureHeaders("application/octet-stream");
    }
    configureHeaders(s) {
      return {
        accept: s,
        authorization: `token ${this.token}`
      };
    }
    async getLatestVersionInfo(s) {
      const r = this.updater.allowPrerelease;
      let t = this.basePath;
      r || (t = `${t}/latest`);
      const o = (0, c.newUrlFromBase)(t, this.baseUrl);
      try {
        const h = JSON.parse(await this.httpRequest(o, this.configureHeaders("application/vnd.github.v3+json"), s));
        if (r) {
          const g = h.filter((y) => !y.draft);
          return g.find((y) => y.prerelease) || g[0];
        } else
          return h;
      } catch (h) {
        throw (0, n.newError)(`Unable to find latest version on GitHub (${o}), please ensure a production release exists: ${h.stack || h.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
      }
    }
    get basePath() {
      return this.computeGithubBasePath(`/repos/${this.options.owner}/${this.options.repo}/releases`);
    }
    resolveFiles(s) {
      return (0, i.getFileList)(s).map((r) => {
        const t = p.posix.basename(r.url).replace(/ /g, "-"), o = s.assets.find((h) => h != null && h.name === t);
        if (o == null)
          throw (0, n.newError)(`Cannot find asset "${t}" in: ${JSON.stringify(s.assets, null, 2)}`, "ERR_UPDATER_ASSET_NOT_FOUND");
        return {
          url: new f.URL(o.url),
          info: r
        };
      });
    }
  };
  return Qt.PrivateGitHubProvider = u, Qt;
}
var el;
function If() {
  if (el) return zt;
  el = 1, Object.defineProperty(zt, "__esModule", { value: !0 }), zt.isUrlProbablySupportMultiRangeRequests = u, zt.createClient = a;
  const n = Le(), d = bf(), p = ru(), f = nu(), c = Cf(), l = Of(), i = Pf();
  function u(s) {
    return !s.includes("s3.amazonaws.com");
  }
  function a(s, r, t) {
    if (typeof s == "string")
      throw (0, n.newError)("Please pass PublishConfiguration object", "ERR_UPDATER_INVALID_PROVIDER_CONFIGURATION");
    const o = s.provider;
    switch (o) {
      case "github": {
        const h = s, g = (h.private ? process.env.GH_TOKEN || process.env.GITHUB_TOKEN : null) || h.token;
        return g == null ? new f.GitHubProvider(h, r, t) : new i.PrivateGitHubProvider(h, r, g, t);
      }
      case "bitbucket":
        return new d.BitbucketProvider(s, r, t);
      case "gitlab":
        return new c.GitLabProvider(s, r, t);
      case "keygen":
        return new l.KeygenProvider(s, r, t);
      case "s3":
      case "spaces":
        return new p.GenericProvider({
          provider: "generic",
          url: (0, n.getS3LikeProviderBaseUrl)(s),
          channel: s.channel || null
        }, r, {
          ...t,
          // https://github.com/minio/minio/issues/5285#issuecomment-350428955
          isUseMultipleRangeRequest: !1
        });
      case "generic": {
        const h = s;
        return new p.GenericProvider(h, r, {
          ...t,
          isUseMultipleRangeRequest: h.useMultipleRangeRequest !== !1 && u(h.url)
        });
      }
      case "custom": {
        const h = s, g = h.updateProvider;
        if (!g)
          throw (0, n.newError)("Custom provider not specified", "ERR_UPDATER_INVALID_PROVIDER_CONFIGURATION");
        return new g(h, r, t);
      }
      default:
        throw (0, n.newError)(`Unsupported provider: ${o}`, "ERR_UPDATER_UNSUPPORTED_PROVIDER");
    }
  }
  return zt;
}
var Zt = {}, er = {}, Lt = {}, Ut = {}, tl;
function ao() {
  if (tl) return Ut;
  tl = 1, Object.defineProperty(Ut, "__esModule", { value: !0 }), Ut.OperationKind = void 0, Ut.computeOperations = d;
  var n;
  (function(i) {
    i[i.COPY = 0] = "COPY", i[i.DOWNLOAD = 1] = "DOWNLOAD";
  })(n || (Ut.OperationKind = n = {}));
  function d(i, u, a) {
    const s = l(i.files), r = l(u.files);
    let t = null;
    const o = u.files[0], h = [], g = o.name, y = s.get(g);
    if (y == null)
      throw new Error(`no file ${g} in old blockmap`);
    const m = r.get(g);
    let _ = 0;
    const { checksumToOffset: R, checksumToOldSize: b } = c(s.get(g), y.offset, a);
    let D = o.offset;
    for (let C = 0; C < m.checksums.length; D += m.sizes[C], C++) {
      const N = m.sizes[C], I = m.checksums[C];
      let F = R.get(I);
      F != null && b.get(I) !== N && (a.warn(`Checksum ("${I}") matches, but size differs (old: ${b.get(I)}, new: ${N})`), F = void 0), F === void 0 ? (_++, t != null && t.kind === n.DOWNLOAD && t.end === D ? t.end += N : (t = {
        kind: n.DOWNLOAD,
        start: D,
        end: D + N
        // oldBlocks: null,
      }, f(t, h, I, C))) : t != null && t.kind === n.COPY && t.end === F ? t.end += N : (t = {
        kind: n.COPY,
        start: F,
        end: F + N
        // oldBlocks: [checksum]
      }, f(t, h, I, C));
    }
    return _ > 0 && a.info(`File${o.name === "file" ? "" : " " + o.name} has ${_} changed blocks`), h;
  }
  const p = process.env.DIFFERENTIAL_DOWNLOAD_PLAN_BUILDER_VALIDATE_RANGES === "true";
  function f(i, u, a, s) {
    if (p && u.length !== 0) {
      const r = u[u.length - 1];
      if (r.kind === i.kind && i.start < r.end && i.start > r.start) {
        const t = [r.start, r.end, i.start, i.end].reduce((o, h) => o < h ? o : h);
        throw new Error(`operation (block index: ${s}, checksum: ${a}, kind: ${n[i.kind]}) overlaps previous operation (checksum: ${a}):
abs: ${r.start} until ${r.end} and ${i.start} until ${i.end}
rel: ${r.start - t} until ${r.end - t} and ${i.start - t} until ${i.end - t}`);
      }
    }
    u.push(i);
  }
  function c(i, u, a) {
    const s = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map();
    let t = u;
    for (let o = 0; o < i.checksums.length; o++) {
      const h = i.checksums[o], g = i.sizes[o], y = r.get(h);
      if (y === void 0)
        s.set(h, t), r.set(h, g);
      else if (a.debug != null) {
        const m = y === g ? "(same size)" : `(size: ${y}, this size: ${g})`;
        a.debug(`${h} duplicated in blockmap ${m}, it doesn't lead to broken differential downloader, just corresponding block will be skipped)`);
      }
      t += g;
    }
    return { checksumToOffset: s, checksumToOldSize: r };
  }
  function l(i) {
    const u = /* @__PURE__ */ new Map();
    for (const a of i)
      u.set(a.name, a);
    return u;
  }
  return Ut;
}
var rl;
function iu() {
  if (rl) return Lt;
  rl = 1, Object.defineProperty(Lt, "__esModule", { value: !0 }), Lt.DataSplitter = void 0, Lt.copyData = i;
  const n = Le(), d = ht, p = dr, f = ao(), c = Buffer.from(`\r
\r
`);
  var l;
  (function(a) {
    a[a.INIT = 0] = "INIT", a[a.HEADER = 1] = "HEADER", a[a.BODY = 2] = "BODY";
  })(l || (l = {}));
  function i(a, s, r, t, o) {
    const h = (0, d.createReadStream)("", {
      fd: r,
      autoClose: !1,
      start: a.start,
      // end is inclusive
      end: a.end - 1
    });
    h.on("error", t), h.once("end", o), h.pipe(s, {
      end: !1
    });
  }
  let u = class extends p.Writable {
    constructor(s, r, t, o, h, g, y, m) {
      super(), this.out = s, this.options = r, this.partIndexToTaskIndex = t, this.partIndexToLength = h, this.finishHandler = g, this.grandTotalBytes = y, this.onProgress = m, this.start = Date.now(), this.nextUpdate = this.start + 1e3, this.transferred = 0, this.delta = 0, this.partIndex = -1, this.headerListBuffer = null, this.readState = l.INIT, this.ignoreByteCount = 0, this.remainingPartDataCount = 0, this.actualPartLength = 0, this.boundaryLength = o.length + 4, this.ignoreByteCount = this.boundaryLength - 2;
    }
    get isFinished() {
      return this.partIndex === this.partIndexToLength.length;
    }
    // noinspection JSUnusedGlobalSymbols
    _write(s, r, t) {
      if (this.isFinished) {
        console.error(`Trailing ignored data: ${s.length} bytes`);
        return;
      }
      this.handleData(s).then(() => {
        if (this.onProgress) {
          const o = Date.now();
          (o >= this.nextUpdate || this.transferred === this.grandTotalBytes) && this.grandTotalBytes && (o - this.start) / 1e3 && (this.nextUpdate = o + 1e3, this.onProgress({
            total: this.grandTotalBytes,
            delta: this.delta,
            transferred: this.transferred,
            percent: this.transferred / this.grandTotalBytes * 100,
            bytesPerSecond: Math.round(this.transferred / ((o - this.start) / 1e3))
          }), this.delta = 0);
        }
        t();
      }).catch(t);
    }
    async handleData(s) {
      let r = 0;
      if (this.ignoreByteCount !== 0 && this.remainingPartDataCount !== 0)
        throw (0, n.newError)("Internal error", "ERR_DATA_SPLITTER_BYTE_COUNT_MISMATCH");
      if (this.ignoreByteCount > 0) {
        const t = Math.min(this.ignoreByteCount, s.length);
        this.ignoreByteCount -= t, r = t;
      } else if (this.remainingPartDataCount > 0) {
        const t = Math.min(this.remainingPartDataCount, s.length);
        this.remainingPartDataCount -= t, await this.processPartData(s, 0, t), r = t;
      }
      if (r !== s.length) {
        if (this.readState === l.HEADER) {
          const t = this.searchHeaderListEnd(s, r);
          if (t === -1)
            return;
          r = t, this.readState = l.BODY, this.headerListBuffer = null;
        }
        for (; ; ) {
          if (this.readState === l.BODY)
            this.readState = l.INIT;
          else {
            this.partIndex++;
            let g = this.partIndexToTaskIndex.get(this.partIndex);
            if (g == null)
              if (this.isFinished)
                g = this.options.end;
              else
                throw (0, n.newError)("taskIndex is null", "ERR_DATA_SPLITTER_TASK_INDEX_IS_NULL");
            const y = this.partIndex === 0 ? this.options.start : this.partIndexToTaskIndex.get(this.partIndex - 1) + 1;
            if (y < g)
              await this.copyExistingData(y, g);
            else if (y > g)
              throw (0, n.newError)("prevTaskIndex must be < taskIndex", "ERR_DATA_SPLITTER_TASK_INDEX_ASSERT_FAILED");
            if (this.isFinished) {
              this.onPartEnd(), this.finishHandler();
              return;
            }
            if (r = this.searchHeaderListEnd(s, r), r === -1) {
              this.readState = l.HEADER;
              return;
            }
          }
          const t = this.partIndexToLength[this.partIndex], o = r + t, h = Math.min(o, s.length);
          if (await this.processPartStarted(s, r, h), this.remainingPartDataCount = t - (h - r), this.remainingPartDataCount > 0)
            return;
          if (r = o + this.boundaryLength, r >= s.length) {
            this.ignoreByteCount = this.boundaryLength - (s.length - o);
            return;
          }
        }
      }
    }
    copyExistingData(s, r) {
      return new Promise((t, o) => {
        const h = () => {
          if (s === r) {
            t();
            return;
          }
          const g = this.options.tasks[s];
          if (g.kind !== f.OperationKind.COPY) {
            o(new Error("Task kind must be COPY"));
            return;
          }
          i(g, this.out, this.options.oldFileFd, o, () => {
            s++, h();
          });
        };
        h();
      });
    }
    searchHeaderListEnd(s, r) {
      const t = s.indexOf(c, r);
      if (t !== -1)
        return t + c.length;
      const o = r === 0 ? s : s.slice(r);
      return this.headerListBuffer == null ? this.headerListBuffer = o : this.headerListBuffer = Buffer.concat([this.headerListBuffer, o]), -1;
    }
    onPartEnd() {
      const s = this.partIndexToLength[this.partIndex - 1];
      if (this.actualPartLength !== s)
        throw (0, n.newError)(`Expected length: ${s} differs from actual: ${this.actualPartLength}`, "ERR_DATA_SPLITTER_LENGTH_MISMATCH");
      this.actualPartLength = 0;
    }
    processPartStarted(s, r, t) {
      return this.partIndex !== 0 && this.onPartEnd(), this.processPartData(s, r, t);
    }
    processPartData(s, r, t) {
      this.actualPartLength += t - r, this.transferred += t - r, this.delta += t - r;
      const o = this.out;
      return o.write(r === 0 && s.length === t ? s : s.slice(r, t)) ? Promise.resolve() : new Promise((h, g) => {
        o.on("error", g), o.once("drain", () => {
          o.removeListener("error", g), h();
        });
      });
    }
  };
  return Lt.DataSplitter = u, Lt;
}
var tr = {}, nl;
function Df() {
  if (nl) return tr;
  nl = 1, Object.defineProperty(tr, "__esModule", { value: !0 }), tr.executeTasksUsingMultipleRangeRequests = f, tr.checkIsRangesSupported = l;
  const n = Le(), d = iu(), p = ao();
  function f(i, u, a, s, r) {
    const t = (o) => {
      if (o >= u.length) {
        i.fileMetadataBuffer != null && a.write(i.fileMetadataBuffer), a.end();
        return;
      }
      const h = o + 1e3;
      c(i, {
        tasks: u,
        start: o,
        end: Math.min(u.length, h),
        oldFileFd: s
      }, a, () => t(h), r);
    };
    return t;
  }
  function c(i, u, a, s, r) {
    let t = "bytes=", o = 0, h = 0;
    const g = /* @__PURE__ */ new Map(), y = [];
    for (let R = u.start; R < u.end; R++) {
      const b = u.tasks[R];
      b.kind === p.OperationKind.DOWNLOAD && (t += `${b.start}-${b.end - 1}, `, g.set(o, R), o++, y.push(b.end - b.start), h += b.end - b.start);
    }
    if (o <= 1) {
      const R = (b) => {
        if (b >= u.end) {
          s();
          return;
        }
        const D = u.tasks[b++];
        if (D.kind === p.OperationKind.COPY)
          (0, d.copyData)(D, a, u.oldFileFd, r, () => R(b));
        else {
          const C = i.createRequestOptions();
          C.headers.Range = `bytes=${D.start}-${D.end - 1}`;
          const N = i.httpExecutor.createRequest(C, (I) => {
            I.on("error", r), l(I, r) && (I.pipe(a, {
              end: !1
            }), I.once("end", () => R(b)));
          });
          i.httpExecutor.addErrorAndTimeoutHandlers(N, r), N.end();
        }
      };
      R(u.start);
      return;
    }
    const m = i.createRequestOptions();
    m.headers.Range = t.substring(0, t.length - 2);
    const _ = i.httpExecutor.createRequest(m, (R) => {
      if (!l(R, r))
        return;
      const b = (0, n.safeGetHeader)(R, "content-type"), D = /^multipart\/.+?\s*;\s*boundary=(?:"([^"]+)"|([^\s";]+))\s*$/i.exec(b);
      if (D == null) {
        r(new Error(`Content-Type "multipart/byteranges" is expected, but got "${b}"`));
        return;
      }
      const C = new d.DataSplitter(a, u, g, D[1] || D[2], y, s, h, i.options.onProgress);
      C.on("error", r), R.pipe(C), R.on("end", () => {
        setTimeout(() => {
          _.abort(), r(new Error("Response ends without calling any handlers"));
        }, 1e4);
      });
    });
    i.httpExecutor.addErrorAndTimeoutHandlers(_, r), _.end();
  }
  function l(i, u) {
    if (i.statusCode >= 400)
      return u((0, n.createHttpError)(i)), !1;
    if (i.statusCode !== 206) {
      const a = (0, n.safeGetHeader)(i, "accept-ranges");
      if (a == null || a === "none")
        return u(new Error(`Server doesn't support Accept-Ranges (response code ${i.statusCode})`)), !1;
    }
    return !0;
  }
  return tr;
}
var rr = {}, il;
function Nf() {
  if (il) return rr;
  il = 1, Object.defineProperty(rr, "__esModule", { value: !0 }), rr.ProgressDifferentialDownloadCallbackTransform = void 0;
  const n = dr;
  var d;
  (function(f) {
    f[f.COPY = 0] = "COPY", f[f.DOWNLOAD = 1] = "DOWNLOAD";
  })(d || (d = {}));
  let p = class extends n.Transform {
    constructor(c, l, i) {
      super(), this.progressDifferentialDownloadInfo = c, this.cancellationToken = l, this.onProgress = i, this.start = Date.now(), this.transferred = 0, this.delta = 0, this.expectedBytes = 0, this.index = 0, this.operationType = d.COPY, this.nextUpdate = this.start + 1e3;
    }
    _transform(c, l, i) {
      if (this.cancellationToken.cancelled) {
        i(new Error("cancelled"), null);
        return;
      }
      if (this.operationType == d.COPY) {
        i(null, c);
        return;
      }
      this.transferred += c.length, this.delta += c.length;
      const u = Date.now();
      u >= this.nextUpdate && this.transferred !== this.expectedBytes && this.transferred !== this.progressDifferentialDownloadInfo.grandTotal && (this.nextUpdate = u + 1e3, this.onProgress({
        total: this.progressDifferentialDownloadInfo.grandTotal,
        delta: this.delta,
        transferred: this.transferred,
        percent: this.transferred / this.progressDifferentialDownloadInfo.grandTotal * 100,
        bytesPerSecond: Math.round(this.transferred / ((u - this.start) / 1e3))
      }), this.delta = 0), i(null, c);
    }
    beginFileCopy() {
      this.operationType = d.COPY;
    }
    beginRangeDownload() {
      this.operationType = d.DOWNLOAD, this.expectedBytes += this.progressDifferentialDownloadInfo.expectedByteCounts[this.index++];
    }
    endRangeDownload() {
      this.transferred !== this.progressDifferentialDownloadInfo.grandTotal && this.onProgress({
        total: this.progressDifferentialDownloadInfo.grandTotal,
        delta: this.delta,
        transferred: this.transferred,
        percent: this.transferred / this.progressDifferentialDownloadInfo.grandTotal * 100,
        bytesPerSecond: Math.round(this.transferred / ((Date.now() - this.start) / 1e3))
      });
    }
    // Called when we are 100% done with the connection/download
    _flush(c) {
      if (this.cancellationToken.cancelled) {
        c(new Error("cancelled"));
        return;
      }
      this.onProgress({
        total: this.progressDifferentialDownloadInfo.grandTotal,
        delta: this.delta,
        transferred: this.transferred,
        percent: 100,
        bytesPerSecond: Math.round(this.transferred / ((Date.now() - this.start) / 1e3))
      }), this.delta = 0, this.transferred = 0, c(null);
    }
  };
  return rr.ProgressDifferentialDownloadCallbackTransform = p, rr;
}
var ol;
function ou() {
  if (ol) return er;
  ol = 1, Object.defineProperty(er, "__esModule", { value: !0 }), er.DifferentialDownloader = void 0;
  const n = Le(), d = /* @__PURE__ */ mt(), p = ht, f = iu(), c = pt, l = ao(), i = Df(), u = Nf();
  let a = class {
    // noinspection TypeScriptAbstractClassConstructorCanBeMadeProtected
    constructor(o, h, g) {
      this.blockAwareFileInfo = o, this.httpExecutor = h, this.options = g, this.fileMetadataBuffer = null, this.logger = g.logger;
    }
    createRequestOptions() {
      const o = {
        headers: {
          ...this.options.requestHeaders,
          accept: "*/*"
        }
      };
      return (0, n.configureRequestUrl)(this.options.newUrl, o), (0, n.configureRequestOptions)(o), o;
    }
    doDownload(o, h) {
      if (o.version !== h.version)
        throw new Error(`version is different (${o.version} - ${h.version}), full download is required`);
      const g = this.logger, y = (0, l.computeOperations)(o, h, g);
      g.debug != null && g.debug(JSON.stringify(y, null, 2));
      let m = 0, _ = 0;
      for (const b of y) {
        const D = b.end - b.start;
        b.kind === l.OperationKind.DOWNLOAD ? m += D : _ += D;
      }
      const R = this.blockAwareFileInfo.size;
      if (m + _ + (this.fileMetadataBuffer == null ? 0 : this.fileMetadataBuffer.length) !== R)
        throw new Error(`Internal error, size mismatch: downloadSize: ${m}, copySize: ${_}, newSize: ${R}`);
      return g.info(`Full: ${s(R)}, To download: ${s(m)} (${Math.round(m / (R / 100))}%)`), this.downloadFile(y);
    }
    downloadFile(o) {
      const h = [], g = () => Promise.all(h.map((y) => (0, d.close)(y.descriptor).catch((m) => {
        this.logger.error(`cannot close file "${y.path}": ${m}`);
      })));
      return this.doDownloadFile(o, h).then(g).catch((y) => g().catch((m) => {
        try {
          this.logger.error(`cannot close files: ${m}`);
        } catch (_) {
          try {
            console.error(_);
          } catch {
          }
        }
        throw y;
      }).then(() => {
        throw y;
      }));
    }
    async doDownloadFile(o, h) {
      const g = await (0, d.open)(this.options.oldFile, "r");
      h.push({ descriptor: g, path: this.options.oldFile });
      const y = await (0, d.open)(this.options.newFile, "w");
      h.push({ descriptor: y, path: this.options.newFile });
      const m = (0, p.createWriteStream)(this.options.newFile, { fd: y });
      await new Promise((_, R) => {
        const b = [];
        let D;
        if (!this.options.isUseMultipleRangeRequest && this.options.onProgress) {
          const H = [];
          let V = 0;
          for (const O of o)
            O.kind === l.OperationKind.DOWNLOAD && (H.push(O.end - O.start), V += O.end - O.start);
          const L = {
            expectedByteCounts: H,
            grandTotal: V
          };
          D = new u.ProgressDifferentialDownloadCallbackTransform(L, this.options.cancellationToken, this.options.onProgress), b.push(D);
        }
        const C = new n.DigestTransform(this.blockAwareFileInfo.sha512);
        C.isValidateOnEnd = !1, b.push(C), m.on("finish", () => {
          m.close(() => {
            h.splice(1, 1);
            try {
              C.validate();
            } catch (H) {
              R(H);
              return;
            }
            _(void 0);
          });
        }), b.push(m);
        let N = null;
        for (const H of b)
          H.on("error", R), N == null ? N = H : N = N.pipe(H);
        const I = b[0];
        let F;
        if (this.options.isUseMultipleRangeRequest) {
          F = (0, i.executeTasksUsingMultipleRangeRequests)(this, o, I, g, R), F(0);
          return;
        }
        let B = 0, S = null;
        this.logger.info(`Differential download: ${this.options.newUrl}`);
        const Y = this.createRequestOptions();
        Y.redirect = "manual", F = (H) => {
          var V, L;
          if (H >= o.length) {
            this.fileMetadataBuffer != null && I.write(this.fileMetadataBuffer), I.end();
            return;
          }
          const O = o[H++];
          if (O.kind === l.OperationKind.COPY) {
            D && D.beginFileCopy(), (0, f.copyData)(O, I, g, R, () => F(H));
            return;
          }
          const A = `bytes=${O.start}-${O.end - 1}`;
          Y.headers.range = A, (L = (V = this.logger) === null || V === void 0 ? void 0 : V.debug) === null || L === void 0 || L.call(V, `download range: ${A}`), D && D.beginRangeDownload();
          const P = this.httpExecutor.createRequest(Y, (k) => {
            k.on("error", R), k.on("aborted", () => {
              R(new Error("response has been aborted by the server"));
            }), k.statusCode >= 400 && R((0, n.createHttpError)(k)), k.pipe(I, {
              end: !1
            }), k.once("end", () => {
              D && D.endRangeDownload(), ++B === 100 ? (B = 0, setTimeout(() => F(H), 1e3)) : F(H);
            });
          });
          P.on("redirect", (k, j, X) => {
            this.logger.info(`Redirect to ${r(X)}`), S = X, (0, n.configureRequestUrl)(new c.URL(S), Y), P.followRedirect();
          }), this.httpExecutor.addErrorAndTimeoutHandlers(P, R), P.end();
        }, F(0);
      });
    }
    async readRemoteBytes(o, h) {
      const g = Buffer.allocUnsafe(h + 1 - o), y = this.createRequestOptions();
      y.headers.range = `bytes=${o}-${h}`;
      let m = 0;
      if (await this.request(y, (_) => {
        _.copy(g, m), m += _.length;
      }), m !== g.length)
        throw new Error(`Received data length ${m} is not equal to expected ${g.length}`);
      return g;
    }
    request(o, h) {
      return new Promise((g, y) => {
        const m = this.httpExecutor.createRequest(o, (_) => {
          (0, i.checkIsRangesSupported)(_, y) && (_.on("error", y), _.on("aborted", () => {
            y(new Error("response has been aborted by the server"));
          }), _.on("data", h), _.on("end", () => g()));
        });
        this.httpExecutor.addErrorAndTimeoutHandlers(m, y), m.end();
      });
    }
  };
  er.DifferentialDownloader = a;
  function s(t, o = " KB") {
    return new Intl.NumberFormat("en").format((t / 1024).toFixed(2)) + o;
  }
  function r(t) {
    const o = t.indexOf("?");
    return o < 0 ? t : t.substring(0, o);
  }
  return er;
}
var sl;
function Ff() {
  if (sl) return Zt;
  sl = 1, Object.defineProperty(Zt, "__esModule", { value: !0 }), Zt.GenericDifferentialDownloader = void 0;
  const n = ou();
  let d = class extends n.DifferentialDownloader {
    download(f, c) {
      return this.doDownload(f, c);
    }
  };
  return Zt.GenericDifferentialDownloader = d, Zt;
}
var Yi = {}, al;
function Ot() {
  return al || (al = 1, (function(n) {
    Object.defineProperty(n, "__esModule", { value: !0 }), n.UpdaterSignal = n.UPDATE_DOWNLOADED = n.DOWNLOAD_PROGRESS = n.CancellationToken = void 0, n.addHandler = f;
    const d = Le();
    Object.defineProperty(n, "CancellationToken", { enumerable: !0, get: function() {
      return d.CancellationToken;
    } }), n.DOWNLOAD_PROGRESS = "download-progress", n.UPDATE_DOWNLOADED = "update-downloaded";
    class p {
      constructor(l) {
        this.emitter = l;
      }
      /**
       * Emitted when an authenticating proxy is [asking for user credentials](https://github.com/electron/electron/blob/master/docs/api/client-request.md#event-login).
       */
      login(l) {
        f(this.emitter, "login", l);
      }
      progress(l) {
        f(this.emitter, n.DOWNLOAD_PROGRESS, l);
      }
      updateDownloaded(l) {
        f(this.emitter, n.UPDATE_DOWNLOADED, l);
      }
      updateCancelled(l) {
        f(this.emitter, "update-cancelled", l);
      }
    }
    n.UpdaterSignal = p;
    function f(c, l, i) {
      c.on(l, i);
    }
  })(Yi)), Yi;
}
var ll;
function lo() {
  if (ll) return At;
  ll = 1, Object.defineProperty(At, "__esModule", { value: !0 }), At.NoOpLogger = At.AppUpdater = void 0;
  const n = Le(), d = hr, p = kr, f = Cl, c = /* @__PURE__ */ mt(), l = eo(), i = Xc(), u = Oe, a = eu(), s = Af(), r = Tf(), t = Sf(), o = ru(), h = If(), g = Pl, y = Ff(), m = Ot();
  let _ = class su extends f.EventEmitter {
    /**
     * Get the update channel. Doesn't return `channel` from the update configuration, only if was previously set.
     */
    get channel() {
      return this._channel;
    }
    /**
     * Set the update channel. Overrides `channel` in the update configuration.
     *
     * `allowDowngrade` will be automatically set to `true`. If this behavior is not suitable for you, simple set `allowDowngrade` explicitly after.
     */
    set channel(C) {
      if (this._channel != null) {
        if (typeof C != "string")
          throw (0, n.newError)(`Channel must be a string, but got: ${C}`, "ERR_UPDATER_INVALID_CHANNEL");
        if (C.length === 0)
          throw (0, n.newError)("Channel must be not an empty string", "ERR_UPDATER_INVALID_CHANNEL");
      }
      this._channel = C, this.allowDowngrade = !0;
    }
    /**
     *  Shortcut for explicitly adding auth tokens to request headers
     */
    addAuthHeader(C) {
      this.requestHeaders = Object.assign({}, this.requestHeaders, {
        authorization: C
      });
    }
    // noinspection JSMethodCanBeStatic,JSUnusedGlobalSymbols
    get netSession() {
      return (0, t.getNetSession)();
    }
    /**
     * The logger. You can pass [electron-log](https://github.com/megahertz/electron-log), [winston](https://github.com/winstonjs/winston) or another logger with the following interface: `{ info(), warn(), error() }`.
     * Set it to `null` if you would like to disable a logging feature.
     */
    get logger() {
      return this._logger;
    }
    set logger(C) {
      this._logger = C ?? new b();
    }
    // noinspection JSUnusedGlobalSymbols
    /**
     * test only
     * @private
     */
    set updateConfigPath(C) {
      this.clientPromise = null, this._appUpdateConfigPath = C, this.configOnDisk = new i.Lazy(() => this.loadUpdateConfig());
    }
    /**
     * Allows developer to override default logic for determining if an update is supported.
     * The default logic compares the `UpdateInfo` minimum system version against the `os.release()` with `semver` package
     */
    get isUpdateSupported() {
      return this._isUpdateSupported;
    }
    set isUpdateSupported(C) {
      C && (this._isUpdateSupported = C);
    }
    /**
     * Allows developer to override default logic for determining if the user is below the rollout threshold.
     * The default logic compares the staging percentage with numerical representation of user ID.
     * An override can define custom logic, or bypass it if needed.
     */
    get isUserWithinRollout() {
      return this._isUserWithinRollout;
    }
    set isUserWithinRollout(C) {
      C && (this._isUserWithinRollout = C);
    }
    constructor(C, N) {
      super(), this.autoDownload = !0, this.autoInstallOnAppQuit = !0, this.autoRunAppAfterInstall = !0, this.allowPrerelease = !1, this.fullChangelog = !1, this.allowDowngrade = !1, this.disableWebInstaller = !1, this.disableDifferentialDownload = !1, this.forceDevUpdateConfig = !1, this.previousBlockmapBaseUrlOverride = null, this._channel = null, this.downloadedUpdateHelper = null, this.requestHeaders = null, this._logger = console, this.signals = new m.UpdaterSignal(this), this._appUpdateConfigPath = null, this._isUpdateSupported = (B) => this.checkIfUpdateSupported(B), this._isUserWithinRollout = (B) => this.isStagingMatch(B), this.clientPromise = null, this.stagingUserIdPromise = new i.Lazy(() => this.getOrCreateStagingUserId()), this.configOnDisk = new i.Lazy(() => this.loadUpdateConfig()), this.checkForUpdatesPromise = null, this.downloadPromise = null, this.updateInfoAndProvider = null, this._testOnlyOptions = null, this.on("error", (B) => {
        this._logger.error(`Error: ${B.stack || B.message}`);
      }), N == null ? (this.app = new r.ElectronAppAdapter(), this.httpExecutor = new t.ElectronHttpExecutor((B, S) => this.emit("login", B, S))) : (this.app = N, this.httpExecutor = null);
      const I = this.app.version, F = (0, a.parse)(I);
      if (F == null)
        throw (0, n.newError)(`App version is not a valid semver version: "${I}"`, "ERR_UPDATER_INVALID_VERSION");
      this.currentVersion = F, this.allowPrerelease = R(F), C != null && (this.setFeedURL(C), typeof C != "string" && C.requestHeaders && (this.requestHeaders = C.requestHeaders));
    }
    //noinspection JSMethodCanBeStatic,JSUnusedGlobalSymbols
    getFeedURL() {
      return "Deprecated. Do not use it.";
    }
    /**
     * Configure update provider. If value is `string`, [GenericServerOptions](https://www.electron.build/publish#genericserveroptions) will be set with value as `url`.
     * @param options If you want to override configuration in the `app-update.yml`.
     */
    setFeedURL(C) {
      const N = this.createProviderRuntimeOptions();
      let I;
      typeof C == "string" ? I = new o.GenericProvider({ provider: "generic", url: C }, this, {
        ...N,
        isUseMultipleRangeRequest: (0, h.isUrlProbablySupportMultiRangeRequests)(C)
      }) : I = (0, h.createClient)(C, this, N), this.clientPromise = Promise.resolve(I);
    }
    /**
     * Asks the server whether there is an update.
     * @returns null if the updater is disabled, otherwise info about the latest version
     */
    checkForUpdates() {
      if (!this.isUpdaterActive())
        return Promise.resolve(null);
      let C = this.checkForUpdatesPromise;
      if (C != null)
        return this._logger.info("Checking for update (already in progress)"), C;
      const N = () => this.checkForUpdatesPromise = null;
      return this._logger.info("Checking for update"), C = this.doCheckForUpdates().then((I) => (N(), I)).catch((I) => {
        throw N(), this.emit("error", I, `Cannot check for updates: ${(I.stack || I).toString()}`), I;
      }), this.checkForUpdatesPromise = C, C;
    }
    isUpdaterActive() {
      return this.app.isPackaged || this.forceDevUpdateConfig ? !0 : (this._logger.info("Skip checkForUpdates because application is not packed and dev update config is not forced"), !1);
    }
    // noinspection JSUnusedGlobalSymbols
    checkForUpdatesAndNotify(C) {
      return this.checkForUpdates().then((N) => N?.downloadPromise ? (N.downloadPromise.then(() => {
        const I = su.formatDownloadNotification(N.updateInfo.version, this.app.name, C);
        new St.Notification(I).show();
      }), N) : (this._logger.debug != null && this._logger.debug("checkForUpdatesAndNotify called, downloadPromise is null"), N));
    }
    static formatDownloadNotification(C, N, I) {
      return I == null && (I = {
        title: "A new update is ready to install",
        body: "{appName} version {version} has been downloaded and will be automatically installed on exit"
      }), I = {
        title: I.title.replace("{appName}", N).replace("{version}", C),
        body: I.body.replace("{appName}", N).replace("{version}", C)
      }, I;
    }
    async isStagingMatch(C) {
      const N = C.stagingPercentage;
      let I = N;
      if (I == null)
        return !0;
      if (I = parseInt(I, 10), isNaN(I))
        return this._logger.warn(`Staging percentage is NaN: ${N}`), !0;
      I = I / 100;
      const F = await this.stagingUserIdPromise.value, S = n.UUID.parse(F).readUInt32BE(12) / 4294967295;
      return this._logger.info(`Staging percentage: ${I}, percentage: ${S}, user id: ${F}`), S < I;
    }
    computeFinalHeaders(C) {
      return this.requestHeaders != null && Object.assign(C, this.requestHeaders), C;
    }
    async isUpdateAvailable(C) {
      const N = (0, a.parse)(C.version);
      if (N == null)
        throw (0, n.newError)(`This file could not be downloaded, or the latest version (from update server) does not have a valid semver version: "${C.version}"`, "ERR_UPDATER_INVALID_VERSION");
      const I = this.currentVersion;
      if ((0, a.eq)(N, I) || !await Promise.resolve(this.isUpdateSupported(C)) || !await Promise.resolve(this.isUserWithinRollout(C)))
        return !1;
      const B = (0, a.gt)(N, I), S = (0, a.lt)(N, I);
      return B ? !0 : this.allowDowngrade && S;
    }
    checkIfUpdateSupported(C) {
      const N = C?.minimumSystemVersion, I = (0, p.release)();
      if (N)
        try {
          if ((0, a.lt)(I, N))
            return this._logger.info(`Current OS version ${I} is less than the minimum OS version required ${N} for version ${I}`), !1;
        } catch (F) {
          this._logger.warn(`Failed to compare current OS version(${I}) with minimum OS version(${N}): ${(F.message || F).toString()}`);
        }
      return !0;
    }
    async getUpdateInfoAndProvider() {
      await this.app.whenReady(), this.clientPromise == null && (this.clientPromise = this.configOnDisk.value.then((I) => (0, h.createClient)(I, this, this.createProviderRuntimeOptions())));
      const C = await this.clientPromise, N = await this.stagingUserIdPromise.value;
      return C.setRequestHeaders(this.computeFinalHeaders({ "x-user-staging-id": N })), {
        info: await C.getLatestVersion(),
        provider: C
      };
    }
    createProviderRuntimeOptions() {
      return {
        isUseMultipleRangeRequest: !0,
        platform: this._testOnlyOptions == null ? process.platform : this._testOnlyOptions.platform,
        executor: this.httpExecutor
      };
    }
    async doCheckForUpdates() {
      this.emit("checking-for-update");
      const C = await this.getUpdateInfoAndProvider(), N = C.info;
      if (!await this.isUpdateAvailable(N))
        return this._logger.info(`Update for version ${this.currentVersion.format()} is not available (latest version: ${N.version}, downgrade is ${this.allowDowngrade ? "allowed" : "disallowed"}).`), this.emit("update-not-available", N), {
          isUpdateAvailable: !1,
          versionInfo: N,
          updateInfo: N
        };
      this.updateInfoAndProvider = C, this.onUpdateAvailable(N);
      const I = new n.CancellationToken();
      return {
        isUpdateAvailable: !0,
        versionInfo: N,
        updateInfo: N,
        cancellationToken: I,
        downloadPromise: this.autoDownload ? this.downloadUpdate(I) : null
      };
    }
    onUpdateAvailable(C) {
      this._logger.info(`Found version ${C.version} (url: ${(0, n.asArray)(C.files).map((N) => N.url).join(", ")})`), this.emit("update-available", C);
    }
    /**
     * Start downloading update manually. You can use this method if `autoDownload` option is set to `false`.
     * @returns {Promise<Array<string>>} Paths to downloaded files.
     */
    downloadUpdate(C = new n.CancellationToken()) {
      const N = this.updateInfoAndProvider;
      if (N == null) {
        const F = new Error("Please check update first");
        return this.dispatchError(F), Promise.reject(F);
      }
      if (this.downloadPromise != null)
        return this._logger.info("Downloading update (already in progress)"), this.downloadPromise;
      this._logger.info(`Downloading update from ${(0, n.asArray)(N.info.files).map((F) => F.url).join(", ")}`);
      const I = (F) => {
        if (!(F instanceof n.CancellationError))
          try {
            this.dispatchError(F);
          } catch (B) {
            this._logger.warn(`Cannot dispatch error event: ${B.stack || B}`);
          }
        return F;
      };
      return this.downloadPromise = this.doDownloadUpdate({
        updateInfoAndProvider: N,
        requestHeaders: this.computeRequestHeaders(N.provider),
        cancellationToken: C,
        disableWebInstaller: this.disableWebInstaller,
        disableDifferentialDownload: this.disableDifferentialDownload
      }).catch((F) => {
        throw I(F);
      }).finally(() => {
        this.downloadPromise = null;
      }), this.downloadPromise;
    }
    dispatchError(C) {
      this.emit("error", C, (C.stack || C).toString());
    }
    dispatchUpdateDownloaded(C) {
      this.emit(m.UPDATE_DOWNLOADED, C);
    }
    async loadUpdateConfig() {
      return this._appUpdateConfigPath == null && (this._appUpdateConfigPath = this.app.appUpdateConfigPath), (0, l.load)(await (0, c.readFile)(this._appUpdateConfigPath, "utf-8"));
    }
    computeRequestHeaders(C) {
      const N = C.fileExtraDownloadHeaders;
      if (N != null) {
        const I = this.requestHeaders;
        return I == null ? N : {
          ...N,
          ...I
        };
      }
      return this.computeFinalHeaders({ accept: "*/*" });
    }
    async getOrCreateStagingUserId() {
      const C = u.join(this.app.userDataPath, ".updaterId");
      try {
        const I = await (0, c.readFile)(C, "utf-8");
        if (n.UUID.check(I))
          return I;
        this._logger.warn(`Staging user id file exists, but content was invalid: ${I}`);
      } catch (I) {
        I.code !== "ENOENT" && this._logger.warn(`Couldn't read staging user ID, creating a blank one: ${I}`);
      }
      const N = n.UUID.v5((0, d.randomBytes)(4096), n.UUID.OID);
      this._logger.info(`Generated new staging user ID: ${N}`);
      try {
        await (0, c.outputFile)(C, N);
      } catch (I) {
        this._logger.warn(`Couldn't write out staging user ID: ${I}`);
      }
      return N;
    }
    /** @internal */
    get isAddNoCacheQuery() {
      const C = this.requestHeaders;
      if (C == null)
        return !0;
      for (const N of Object.keys(C)) {
        const I = N.toLowerCase();
        if (I === "authorization" || I === "private-token")
          return !1;
      }
      return !0;
    }
    async getOrCreateDownloadHelper() {
      let C = this.downloadedUpdateHelper;
      if (C == null) {
        const N = (await this.configOnDisk.value).updaterCacheDirName, I = this._logger;
        N == null && I.error("updaterCacheDirName is not specified in app-update.yml Was app build using at least electron-builder 20.34.0?");
        const F = u.join(this.app.baseCachePath, N || this.app.name);
        I.debug != null && I.debug(`updater cache dir: ${F}`), C = new s.DownloadedUpdateHelper(F), this.downloadedUpdateHelper = C;
      }
      return C;
    }
    async executeDownload(C) {
      const N = C.fileInfo, I = {
        headers: C.downloadUpdateOptions.requestHeaders,
        cancellationToken: C.downloadUpdateOptions.cancellationToken,
        sha2: N.info.sha2,
        sha512: N.info.sha512
      };
      this.listenerCount(m.DOWNLOAD_PROGRESS) > 0 && (I.onProgress = (Z) => this.emit(m.DOWNLOAD_PROGRESS, Z));
      const F = C.downloadUpdateOptions.updateInfoAndProvider.info, B = F.version, S = N.packageInfo;
      function Y() {
        const Z = decodeURIComponent(C.fileInfo.url.pathname);
        return Z.toLowerCase().endsWith(`.${C.fileExtension.toLowerCase()}`) ? u.basename(Z) : u.basename(C.fileInfo.info.url);
      }
      const H = await this.getOrCreateDownloadHelper(), V = H.cacheDirForPendingUpdate;
      await (0, c.mkdir)(V, { recursive: !0 });
      const L = Y();
      let O = u.join(V, L);
      const A = S == null ? null : u.join(V, `package-${B}${u.extname(S.path) || ".7z"}`), P = async (Z) => {
        await H.setDownloadedFile(O, A, F, N, L, Z), await C.done({
          ...F,
          downloadedFile: O
        });
        const de = u.join(V, "current.blockmap");
        return await (0, c.pathExists)(de) && await (0, c.copyFile)(de, u.join(H.cacheDir, "current.blockmap")), A == null ? [O] : [O, A];
      }, k = this._logger, j = await H.validateDownloadedPath(O, F, N, k);
      if (j != null)
        return O = j, await P(!1);
      const X = async () => (await H.clear().catch(() => {
      }), await (0, c.unlink)(O).catch(() => {
      })), oe = await (0, s.createTempUpdateFile)(`temp-${L}`, V, k);
      try {
        await C.task(oe, I, A, X), await (0, n.retry)(() => (0, c.rename)(oe, O), {
          retries: 60,
          interval: 500,
          shouldRetry: (Z) => Z instanceof Error && /^EBUSY:/.test(Z.message) ? !0 : (k.warn(`Cannot rename temp file to final file: ${Z.message || Z.stack}`), !1)
        });
      } catch (Z) {
        throw await X(), Z instanceof n.CancellationError && (k.info("cancelled"), this.emit("update-cancelled", F)), Z;
      }
      return k.info(`New version ${B} has been downloaded to ${O}`), await P(!0);
    }
    async differentialDownloadInstaller(C, N, I, F, B) {
      try {
        if (this._testOnlyOptions != null && !this._testOnlyOptions.isUseDifferentialDownload)
          return !0;
        const S = N.updateInfoAndProvider.provider, Y = await S.getBlockMapFiles(C.url, this.app.version, N.updateInfoAndProvider.info.version, this.previousBlockmapBaseUrlOverride);
        this._logger.info(`Download block maps (old: "${Y[0]}", new: ${Y[1]})`);
        const H = async (k) => {
          const j = await this.httpExecutor.downloadToBuffer(k, {
            headers: N.requestHeaders,
            cancellationToken: N.cancellationToken
          });
          if (j == null || j.length === 0)
            throw new Error(`Blockmap "${k.href}" is empty`);
          try {
            return JSON.parse((0, g.gunzipSync)(j).toString());
          } catch (X) {
            throw new Error(`Cannot parse blockmap "${k.href}", error: ${X}`);
          }
        }, V = {
          newUrl: C.url,
          oldFile: u.join(this.downloadedUpdateHelper.cacheDir, B),
          logger: this._logger,
          newFile: I,
          isUseMultipleRangeRequest: S.isUseMultipleRangeRequest,
          requestHeaders: N.requestHeaders,
          cancellationToken: N.cancellationToken
        };
        this.listenerCount(m.DOWNLOAD_PROGRESS) > 0 && (V.onProgress = (k) => this.emit(m.DOWNLOAD_PROGRESS, k));
        const L = async (k, j) => {
          const X = u.join(j, "current.blockmap");
          await (0, c.outputFile)(X, (0, g.gzipSync)(JSON.stringify(k)));
        }, O = async (k) => {
          const j = u.join(k, "current.blockmap");
          try {
            if (await (0, c.pathExists)(j))
              return JSON.parse((0, g.gunzipSync)(await (0, c.readFile)(j)).toString());
          } catch (X) {
            this._logger.warn(`Cannot parse blockmap "${j}", error: ${X}`);
          }
          return null;
        }, A = await H(Y[1]);
        await L(A, this.downloadedUpdateHelper.cacheDirForPendingUpdate);
        let P = await O(this.downloadedUpdateHelper.cacheDir);
        return P == null && (P = await H(Y[0])), await new y.GenericDifferentialDownloader(C.info, this.httpExecutor, V).download(P, A), !1;
      } catch (S) {
        if (this._logger.error(`Cannot download differentially, fallback to full download: ${S.stack || S}`), this._testOnlyOptions != null)
          throw S;
        return !0;
      }
    }
  };
  At.AppUpdater = _;
  function R(D) {
    const C = (0, a.prerelease)(D);
    return C != null && C.length > 0;
  }
  class b {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    info(C) {
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    warn(C) {
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    error(C) {
    }
  }
  return At.NoOpLogger = b, At;
}
var ul;
function Vr() {
  if (ul) return jt;
  ul = 1, Object.defineProperty(jt, "__esModule", { value: !0 }), jt.BaseUpdater = void 0;
  const n = Ur, d = Oe, p = lo();
  let f = class extends p.AppUpdater {
    constructor(l, i) {
      super(l, i), this.quitAndInstallCalled = !1, this.quitHandlerAdded = !1;
    }
    quitAndInstall(l = !1, i = !1) {
      this._logger.info("Install on explicit quitAndInstall"), this.install(l, l ? i : this.autoRunAppAfterInstall) ? setImmediate(() => {
        St.autoUpdater.emit("before-quit-for-update"), this.app.quit();
      }) : this.quitAndInstallCalled = !1;
    }
    executeDownload(l) {
      return super.executeDownload({
        ...l,
        done: (i) => (this.dispatchUpdateDownloaded(i), this.addQuitHandler(), Promise.resolve())
      });
    }
    get installerPath() {
      return this.downloadedUpdateHelper == null ? null : this.downloadedUpdateHelper.file;
    }
    // must be sync (because quit even handler is not async)
    install(l = !1, i = !1) {
      if (this.quitAndInstallCalled)
        return this._logger.warn("install call ignored: quitAndInstallCalled is set to true"), !1;
      const u = this.downloadedUpdateHelper, a = this.installerPath, s = u == null ? null : u.downloadedFileInfo;
      if (a == null || s == null)
        return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
      this.quitAndInstallCalled = !0;
      try {
        return this._logger.info(`Install: isSilent: ${l}, isForceRunAfter: ${i}`), this.doInstall({
          isSilent: l,
          isForceRunAfter: i,
          isAdminRightsRequired: s.isAdminRightsRequired
        });
      } catch (r) {
        return this.dispatchError(r), !1;
      }
    }
    addQuitHandler() {
      this.quitHandlerAdded || !this.autoInstallOnAppQuit || (this.quitHandlerAdded = !0, this.app.onQuit((l) => {
        if (this.quitAndInstallCalled) {
          this._logger.info("Update installer has already been triggered. Quitting application.");
          return;
        }
        if (!this.autoInstallOnAppQuit) {
          this._logger.info("Update will not be installed on quit because autoInstallOnAppQuit is set to false.");
          return;
        }
        if (l !== 0) {
          this._logger.info(`Update will be not installed on quit because application is quitting with exit code ${l}`);
          return;
        }
        this._logger.info("Auto install update on quit"), this.install(!0, !1);
      }));
    }
    /**
     * Strips relative-path entries from a PATH string.
     * Prevents PATH-poisoning where a writable directory earlier in PATH shadows
     * a trusted package manager binary.
     */
    sanitizeEnvPath(l) {
      return l.split(d.delimiter).filter((i) => d.isAbsolute(i)).join(d.delimiter);
    }
    spawnSyncLog(l, i = [], u = {}) {
      var a;
      this._logger.info(`Executing: ${l} with args: ${i}`);
      const s = { ...process.env, ...u }, r = (0, n.spawnSync)(l, i, {
        env: { ...s, PATH: this.sanitizeEnvPath((a = s.PATH) !== null && a !== void 0 ? a : "") },
        encoding: "utf-8",
        shell: !0
      }), { error: t, status: o, stdout: h, stderr: g } = r;
      if (t != null)
        throw this._logger.error(g), t;
      if (o != null && o !== 0)
        throw this._logger.error(g), new Error(`Command ${l} exited with code ${o}`);
      return h.trim();
    }
    /**
     * This handles both node 8 and node 10 way of emitting error when spawning a process
     *   - node 8: Throws the error
     *   - node 10: Emit the error(Need to listen with on)
     */
    // https://github.com/electron-userland/electron-builder/issues/1129
    // Node 8 sends errors: https://nodejs.org/dist/latest-v8.x/docs/api/errors.html#errors_common_system_errors
    async spawnLog(l, i = [], u = void 0, a = "ignore") {
      return this._logger.info(`Executing: ${l} with args: ${i}`), new Promise((s, r) => {
        try {
          const t = { stdio: a, env: u, detached: !0 }, o = (0, n.spawn)(l, i, t);
          o.on("error", (h) => {
            r(h);
          }), o.unref(), o.pid !== void 0 && s(!0);
        } catch (t) {
          r(t);
        }
      });
    }
  };
  return jt.BaseUpdater = f, jt;
}
var nr = {}, ir = {}, cl;
function au() {
  if (cl) return ir;
  cl = 1, Object.defineProperty(ir, "__esModule", { value: !0 }), ir.FileWithEmbeddedBlockMapDifferentialDownloader = void 0;
  const n = /* @__PURE__ */ mt(), d = ou(), p = Pl;
  let f = class extends d.DifferentialDownloader {
    async download() {
      const u = this.blockAwareFileInfo, a = u.size, s = a - (u.blockMapSize + 4);
      this.fileMetadataBuffer = await this.readRemoteBytes(s, a - 1);
      const r = c(this.fileMetadataBuffer.slice(0, this.fileMetadataBuffer.length - 4));
      await this.doDownload(await l(this.options.oldFile), r);
    }
  };
  ir.FileWithEmbeddedBlockMapDifferentialDownloader = f;
  function c(i) {
    return JSON.parse((0, p.inflateRawSync)(i).toString());
  }
  async function l(i) {
    const u = await (0, n.open)(i, "r");
    try {
      const a = (await (0, n.fstat)(u)).size, s = Buffer.allocUnsafe(4);
      await (0, n.read)(u, s, 0, s.length, a - s.length);
      const r = Buffer.allocUnsafe(s.readUInt32BE(0));
      return await (0, n.read)(u, r, 0, r.length, a - s.length - r.length), await (0, n.close)(u), c(r);
    } catch (a) {
      throw await (0, n.close)(u), a;
    }
  }
  return ir;
}
var fl;
function dl() {
  if (fl) return nr;
  fl = 1, Object.defineProperty(nr, "__esModule", { value: !0 }), nr.AppImageUpdater = void 0;
  const n = Le(), d = Ur, p = /* @__PURE__ */ mt(), f = ht, c = Oe, l = Vr(), i = au(), u = We(), a = Ot();
  let s = class extends l.BaseUpdater {
    constructor(t, o) {
      super(t, o);
    }
    isUpdaterActive() {
      return process.env.APPIMAGE == null && !this.forceDevUpdateConfig ? (process.env.SNAP == null ? this._logger.warn("APPIMAGE env is not defined, current application is not an AppImage") : this._logger.info("SNAP env is defined, updater is disabled"), !1) : super.isUpdaterActive();
    }
    /*** @private */
    doDownloadUpdate(t) {
      const o = t.updateInfoAndProvider.provider, h = (0, u.findFile)(o.resolveFiles(t.updateInfoAndProvider.info), "AppImage", ["rpm", "deb", "pacman"]);
      return this.executeDownload({
        fileExtension: "AppImage",
        fileInfo: h,
        downloadUpdateOptions: t,
        task: async (g, y) => {
          const m = process.env.APPIMAGE;
          if (m == null)
            throw (0, n.newError)("APPIMAGE env is not defined", "ERR_UPDATER_OLD_FILE_NOT_FOUND");
          (t.disableDifferentialDownload || await this.downloadDifferential(h, m, g, o, t)) && await this.httpExecutor.download(h.url, g, y), await (0, p.chmod)(g, 493);
        }
      });
    }
    async downloadDifferential(t, o, h, g, y) {
      try {
        const m = {
          newUrl: t.url,
          oldFile: o,
          logger: this._logger,
          newFile: h,
          isUseMultipleRangeRequest: g.isUseMultipleRangeRequest,
          requestHeaders: y.requestHeaders,
          cancellationToken: y.cancellationToken
        };
        return this.listenerCount(a.DOWNLOAD_PROGRESS) > 0 && (m.onProgress = (_) => this.emit(a.DOWNLOAD_PROGRESS, _)), await new i.FileWithEmbeddedBlockMapDifferentialDownloader(t.info, this.httpExecutor, m).download(), !1;
      } catch (m) {
        return this._logger.error(`Cannot download differentially, fallback to full download: ${m.stack || m}`), process.platform === "linux";
      }
    }
    doInstall(t) {
      const o = process.env.APPIMAGE;
      if (o == null)
        throw (0, n.newError)("APPIMAGE env is not defined", "ERR_UPDATER_OLD_FILE_NOT_FOUND");
      if (!c.isAbsolute(o) || o.includes("\0"))
        throw (0, n.newError)(`APPIMAGE env is not a valid absolute path: "${o}"`, "ERR_UPDATER_OLD_FILE_NOT_FOUND");
      (0, f.unlinkSync)(o);
      let h;
      const g = c.basename(o), y = this.installerPath;
      if (y == null)
        return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
      c.basename(y) === g || !/\d+\.\d+\.\d+/.test(g) ? h = o : h = c.join(c.dirname(o), c.basename(y)), (0, d.execFileSync)("mv", ["-f", y, h]), h !== o && this.emit("appimage-filename-updated", h);
      const m = {
        ...process.env,
        APPIMAGE_SILENT_INSTALL: "true"
      };
      return t.isForceRunAfter ? this.spawnLog(h, [], m) : (m.APPIMAGE_EXIT_AFTER_INSTALL = "true", (0, d.execFileSync)(h, [], { env: m })), !0;
    }
  };
  return nr.AppImageUpdater = s, nr;
}
var or = {}, sr = {}, hl;
function uo() {
  if (hl) return sr;
  hl = 1, Object.defineProperty(sr, "__esModule", { value: !0 }), sr.LinuxUpdater = void 0;
  const n = Vr(), d = /^[a-zA-Z0-9_-]+$/;
  let p = class extends n.BaseUpdater {
    constructor(c, l) {
      super(c, l);
    }
    /**
     * Returns true if the current process is running as root.
     */
    isRunningAsRoot() {
      var c;
      return ((c = process.getuid) === null || c === void 0 ? void 0 : c.call(process)) === 0;
    }
    /**
     * Sanitizes the installer path for use with shell:true spawn calls.
     * Backslash-escapes metacharacters that have special meaning in POSIX shell.
     * Note: paths containing single-quotes (') are not supported.
     */
    get installerPath() {
      const c = super.installerPath;
      return c == null ? null : c.replace(/\\/g, "\\\\").replace(/([`$!" ;|&()<>])/g, "\\$1").replace(/[\n\r]/g, "");
    }
    runCommandWithSudoIfNeeded(c) {
      if (this.isRunningAsRoot())
        return this._logger.info("Running as root, no need to use sudo"), this.spawnSyncLog(c[0], c.slice(1));
      const { name: l } = this.app, u = `"${l.replace(/["`$\\!\n\r;|&<>(){}*?[\]#~]/g, "")} would like to update"`, a = this.sudoWithArgs(u);
      this._logger.info(`Running as non-root user, using sudo to install: ${a}`);
      let s = '"';
      return (/pkexec/i.test(a[0]) || a[0] === "sudo") && (s = ""), this.spawnSyncLog(a[0], [...a.length > 1 ? a.slice(1) : [], `${s}/bin/bash`, "-c", `'${c.join(" ")}'${s}`]);
    }
    sudoWithArgs(c) {
      const l = this.determineSudoCommand(), i = [l];
      return /kdesudo/i.test(l) ? (i.push("--comment", c), i.push("-c")) : /gksudo/i.test(l) ? i.push("--message", c) : /pkexec/i.test(l) && i.push("--disable-internal-agent"), i;
    }
    hasCommand(c) {
      try {
        return this.spawnSyncLog("command", ["-v", c]), !0;
      } catch {
        return !1;
      }
    }
    determineSudoCommand() {
      const c = ["gksudo", "kdesudo", "pkexec", "beesu"];
      for (const l of c)
        if (this.hasCommand(l))
          return l;
      return "sudo";
    }
    /**
     * Detects the package manager to use based on the available commands.
     * Allows overriding the default behavior by setting the ELECTRON_BUILDER_LINUX_PACKAGE_MANAGER environment variable.
     * If the environment variable is set, it will be used directly. (This is useful for testing each package manager logic path.)
     * Otherwise, it checks for the presence of the specified package manager commands in the order provided.
     * @param pms - An array of package manager commands to check for, in priority order.
     * @returns The detected package manager command or "unknown" if none are found.
     */
    detectPackageManager(c) {
      var l;
      let i = c;
      const u = (l = process.env.ELECTRON_BUILDER_LINUX_PACKAGE_MANAGER) === null || l === void 0 ? void 0 : l.trim();
      u && (d.test(u) ? i = [u] : this._logger.warn(`ELECTRON_BUILDER_LINUX_PACKAGE_MANAGER "${u}" contains unsafe characters. Ignoring override.`));
      for (const r of i)
        if (this.hasCommand(r))
          return r;
      const a = u ? `ELECTRON_BUILDER_LINUX_PACKAGE_MANAGER override "${u}", ` : "", s = c[0];
      return this._logger.warn(`No package manager found in the list: ${a}${c.join(", ")}. Utilizing default: ${s}`), s;
    }
  };
  return sr.LinuxUpdater = p, sr;
}
var pl;
function ml() {
  if (pl) return or;
  pl = 1, Object.defineProperty(or, "__esModule", { value: !0 }), or.DebUpdater = void 0;
  const n = We(), d = Ot(), p = uo();
  let f = class lu extends p.LinuxUpdater {
    constructor(l, i) {
      super(l, i);
    }
    /*** @private */
    doDownloadUpdate(l) {
      const i = l.updateInfoAndProvider.provider, u = (0, n.findFile)(i.resolveFiles(l.updateInfoAndProvider.info), "deb", ["AppImage", "rpm", "pacman"]);
      return this.executeDownload({
        fileExtension: "deb",
        fileInfo: u,
        downloadUpdateOptions: l,
        task: async (a, s) => {
          this.listenerCount(d.DOWNLOAD_PROGRESS) > 0 && (s.onProgress = (r) => this.emit(d.DOWNLOAD_PROGRESS, r)), await this.httpExecutor.download(u.url, a, s);
        }
      });
    }
    doInstall(l) {
      const i = this.installerPath;
      if (i == null)
        return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
      if (!this.hasCommand("dpkg") && !this.hasCommand("apt"))
        return this.dispatchError(new Error("Neither dpkg nor apt command found. Cannot install .deb package.")), !1;
      const u = ["dpkg", "apt"], a = this.detectPackageManager(u);
      try {
        lu.installWithCommandRunner(a, i, this.runCommandWithSudoIfNeeded.bind(this), this._logger);
      } catch (s) {
        return this.dispatchError(s), !1;
      }
      return l.isForceRunAfter && this.app.relaunch(), !0;
    }
    static installWithCommandRunner(l, i, u, a) {
      var s;
      if (l === "dpkg")
        try {
          u(["dpkg", "-i", i]);
        } catch (r) {
          a.warn((s = r.message) !== null && s !== void 0 ? s : r), a.warn("dpkg installation failed, trying to fix broken dependencies with apt-get"), u(["apt-get", "install", "-f", "-y"]);
        }
      else if (l === "apt")
        a.warn("Using apt to install a local .deb. This may fail for unsigned packages unless properly configured."), u([
          "apt",
          "install",
          "-y",
          "--allow-unauthenticated",
          // needed for unsigned .debs
          "--allow-downgrades",
          // allow lower version installs
          "--allow-change-held-packages",
          i
        ]);
      else
        throw new Error(`Package manager ${l} not supported`);
    }
  };
  return or.DebUpdater = f, or;
}
var ar = {}, gl;
function El() {
  if (gl) return ar;
  gl = 1, Object.defineProperty(ar, "__esModule", { value: !0 }), ar.PacmanUpdater = void 0;
  const n = Ot(), d = We(), p = uo();
  let f = class uu extends p.LinuxUpdater {
    constructor(l, i) {
      super(l, i);
    }
    /*** @private */
    doDownloadUpdate(l) {
      const i = l.updateInfoAndProvider.provider, u = (0, d.findFile)(i.resolveFiles(l.updateInfoAndProvider.info), "pacman", ["AppImage", "deb", "rpm"]);
      return this.executeDownload({
        fileExtension: "pacman",
        fileInfo: u,
        downloadUpdateOptions: l,
        task: async (a, s) => {
          this.listenerCount(n.DOWNLOAD_PROGRESS) > 0 && (s.onProgress = (r) => this.emit(n.DOWNLOAD_PROGRESS, r)), await this.httpExecutor.download(u.url, a, s);
        }
      });
    }
    doInstall(l) {
      const i = this.installerPath;
      if (i == null)
        return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
      try {
        uu.installWithCommandRunner(i, this.runCommandWithSudoIfNeeded.bind(this), this._logger);
      } catch (u) {
        return this.dispatchError(u), !1;
      }
      return l.isForceRunAfter && this.app.relaunch(), !0;
    }
    static installWithCommandRunner(l, i, u) {
      var a;
      try {
        i(["pacman", "-U", "--noconfirm", l]);
      } catch (s) {
        u.warn((a = s.message) !== null && a !== void 0 ? a : s), u.warn("pacman installation failed, attempting to update package database and retry");
        try {
          i(["pacman", "-Sy", "--noconfirm"]), i(["pacman", "-U", "--noconfirm", l]);
        } catch (r) {
          throw u.error("Retry after pacman -Sy failed"), r;
        }
      }
    }
  };
  return ar.PacmanUpdater = f, ar;
}
var lr = {}, yl;
function vl() {
  if (yl) return lr;
  yl = 1, Object.defineProperty(lr, "__esModule", { value: !0 }), lr.RpmUpdater = void 0;
  const n = Ot(), d = We(), p = uo();
  let f = class cu extends p.LinuxUpdater {
    constructor(l, i) {
      super(l, i);
    }
    /*** @private */
    doDownloadUpdate(l) {
      const i = l.updateInfoAndProvider.provider, u = (0, d.findFile)(i.resolveFiles(l.updateInfoAndProvider.info), "rpm", ["AppImage", "deb", "pacman"]);
      return this.executeDownload({
        fileExtension: "rpm",
        fileInfo: u,
        downloadUpdateOptions: l,
        task: async (a, s) => {
          this.listenerCount(n.DOWNLOAD_PROGRESS) > 0 && (s.onProgress = (r) => this.emit(n.DOWNLOAD_PROGRESS, r)), await this.httpExecutor.download(u.url, a, s);
        }
      });
    }
    doInstall(l) {
      const i = this.installerPath;
      if (i == null)
        return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
      const u = ["zypper", "dnf", "yum", "rpm"], a = this.detectPackageManager(u);
      try {
        cu.installWithCommandRunner(a, i, this.runCommandWithSudoIfNeeded.bind(this), this._logger);
      } catch (s) {
        return this.dispatchError(s), !1;
      }
      return l.isForceRunAfter && this.app.relaunch(), !0;
    }
    static installWithCommandRunner(l, i, u, a) {
      if (l === "zypper")
        return u(["zypper", "--non-interactive", "--no-refresh", "install", "--allow-unsigned-rpm", "-f", i]);
      if (l === "dnf")
        return u(["dnf", "install", "--nogpgcheck", "-y", i]);
      if (l === "yum")
        return u(["yum", "install", "--nogpgcheck", "-y", i]);
      if (l === "rpm")
        return a.warn("Installing with rpm only (no dependency resolution)."), u(["rpm", "-Uvh", "--replacepkgs", "--replacefiles", "--nodeps", i]);
      throw new Error(`Package manager ${l} not supported`);
    }
  };
  return lr.RpmUpdater = f, lr;
}
var ur = {}, wl;
function _l() {
  if (wl) return ur;
  wl = 1, Object.defineProperty(ur, "__esModule", { value: !0 }), ur.MacUpdater = void 0;
  const n = Le(), d = /* @__PURE__ */ mt(), p = ht, f = Oe, c = sc, l = lo(), i = We(), u = Ur, a = hr;
  let s = class fu extends l.AppUpdater {
    constructor(t, o) {
      super(t, o), this.nativeUpdater = St.autoUpdater, this.squirrelDownloadedUpdate = !1, this.nativeUpdater.on("error", (h) => {
        this._logger.warn(h), this.emit("error", h);
      }), this.nativeUpdater.on("update-downloaded", () => {
        this.squirrelDownloadedUpdate = !0, this.debug("nativeUpdater.update-downloaded");
      });
    }
    /** Filters update files to the appropriate architecture.
     * On arm64 Macs (including Rosetta), arm64 files are preferred when available.
     * On x64 Macs, arm64 files are excluded. */
    static filterFilesForArch(t, o) {
      const h = (g) => {
        var y;
        return g.url.pathname.includes("arm64") || ((y = g.info.url) === null || y === void 0 ? void 0 : y.includes("arm64"));
      };
      return o && t.some(h) ? t.filter((g) => o === h(g)) : t.filter((g) => !h(g));
    }
    debug(t) {
      this._logger.debug != null && this._logger.debug(t);
    }
    closeServerIfExists() {
      this.server && (this.debug("Closing proxy server"), this.server.close((t) => {
        t && this.debug("proxy server wasn't already open, probably attempted closing again as a safety check before quit");
      }));
    }
    async doDownloadUpdate(t) {
      let o = t.updateInfoAndProvider.provider.resolveFiles(t.updateInfoAndProvider.info);
      const h = this._logger, g = "sysctl.proc_translated";
      let y = !1;
      try {
        this.debug("Checking for macOS Rosetta environment"), y = (0, u.execFileSync)("sysctl", [g], { encoding: "utf8" }).includes(`${g}: 1`), h.info(`Checked for macOS Rosetta environment (isRosetta=${y})`);
      } catch (D) {
        h.warn(`sysctl shell command to check for macOS Rosetta environment failed: ${D}`);
      }
      let m = !1;
      try {
        this.debug("Checking for arm64 in uname");
        const C = (0, u.execFileSync)("uname", ["-a"], { encoding: "utf8" }).includes("ARM");
        h.info(`Checked 'uname -a': arm64=${C}`), m = m || C;
      } catch (D) {
        h.warn(`uname shell command to check for arm64 failed: ${D}`);
      }
      m = m || process.arch === "arm64" || y, o = fu.filterFilesForArch(o, m);
      const _ = (0, i.findFile)(o, "zip", ["pkg", "dmg"]);
      if (_ == null)
        throw (0, n.newError)(`ZIP file not provided: ${(0, n.safeStringifyJson)(o)}`, "ERR_UPDATER_ZIP_FILE_NOT_FOUND");
      const R = t.updateInfoAndProvider.provider, b = "update.zip";
      return this.executeDownload({
        fileExtension: "zip",
        fileInfo: _,
        downloadUpdateOptions: t,
        task: async (D, C) => {
          const N = f.join(this.downloadedUpdateHelper.cacheDir, b), I = () => (0, d.pathExistsSync)(N) ? !t.disableDifferentialDownload : (h.info("Unable to locate previous update.zip for differential download (is this first install?), falling back to full download"), !1);
          let F = !0;
          I() && (F = await this.differentialDownloadInstaller(_, t, D, R, b)), F && await this.httpExecutor.download(_.url, D, C);
        },
        done: async (D) => {
          if (!t.disableDifferentialDownload)
            try {
              const C = f.join(this.downloadedUpdateHelper.cacheDir, b);
              await (0, d.copyFile)(D.downloadedFile, C);
            } catch (C) {
              this._logger.warn(`Unable to copy file for caching for future differential downloads: ${C.message}`);
            }
          return this.updateDownloaded(_, D);
        }
      });
    }
    async updateDownloaded(t, o) {
      var h;
      const g = o.downloadedFile, y = (h = t.info.size) !== null && h !== void 0 ? h : (await (0, d.stat)(g)).size, m = this._logger, _ = `fileToProxy=${t.url.href}`;
      this.closeServerIfExists(), this.debug(`Creating proxy server for native Squirrel.Mac (${_})`), this.server = (0, c.createServer)(), this.debug(`Proxy server for native Squirrel.Mac is created (${_})`), this.server.on("close", () => {
        m.info(`Proxy server for native Squirrel.Mac is closed (${_})`);
      });
      const R = (b) => {
        const D = b.address();
        return typeof D == "string" ? D : `http://127.0.0.1:${D?.port}`;
      };
      return await new Promise((b, D) => {
        const C = (0, a.randomBytes)(64).toString("base64").replace(/\//g, "_").replace(/\+/g, "-"), N = Buffer.from(`autoupdater:${C}`, "ascii"), I = `/${(0, a.randomBytes)(64).toString("hex")}.zip`;
        this.server.on("request", (F, B) => {
          const S = F.url;
          if (m.info(`${S} requested`), S === "/") {
            if (!F.headers.authorization || F.headers.authorization.indexOf("Basic ") === -1) {
              B.statusCode = 401, B.statusMessage = "Invalid Authentication Credentials", B.end(), m.warn("No authenthication info");
              return;
            }
            const V = F.headers.authorization.split(" ")[1], L = Buffer.from(V, "base64").toString("ascii"), [O, A] = L.split(":");
            if (O !== "autoupdater" || A !== C) {
              B.statusCode = 401, B.statusMessage = "Invalid Authentication Credentials", B.end(), m.warn("Invalid authenthication credentials");
              return;
            }
            const P = Buffer.from(`{ "url": "${R(this.server)}${I}" }`);
            B.writeHead(200, { "Content-Type": "application/json", "Content-Length": P.length }), B.end(P);
            return;
          }
          if (!S.startsWith(I)) {
            m.warn(`${S} requested, but not supported`), B.writeHead(404), B.end();
            return;
          }
          m.info(`${I} requested by Squirrel.Mac, pipe ${g}`);
          let Y = !1;
          B.on("finish", () => {
            Y || (this.nativeUpdater.removeListener("error", D), b([]));
          });
          const H = (0, p.createReadStream)(g);
          H.on("error", (V) => {
            try {
              B.end();
            } catch (L) {
              m.warn(`cannot end response: ${L}`);
            }
            Y = !0, this.nativeUpdater.removeListener("error", D), D(new Error(`Cannot pipe "${g}": ${V}`));
          }), B.writeHead(200, {
            "Content-Type": "application/zip",
            "Content-Length": y
          }), H.pipe(B);
        }), this.debug(`Proxy server for native Squirrel.Mac is starting to listen (${_})`), this.server.listen(0, "127.0.0.1", () => {
          this.debug(`Proxy server for native Squirrel.Mac is listening (address=${R(this.server)}, ${_})`), this.nativeUpdater.setFeedURL({
            url: R(this.server),
            headers: {
              "Cache-Control": "no-cache",
              Authorization: `Basic ${N.toString("base64")}`
            }
          }), this.dispatchUpdateDownloaded(o), this.autoInstallOnAppQuit ? (this.nativeUpdater.once("error", D), this.nativeUpdater.checkForUpdates()) : b([]);
        });
      });
    }
    handleUpdateDownloaded() {
      this.autoRunAppAfterInstall ? this.nativeUpdater.quitAndInstall() : this.app.quit(), this.closeServerIfExists();
    }
    quitAndInstall() {
      this.squirrelDownloadedUpdate ? this.handleUpdateDownloaded() : (this.nativeUpdater.on("update-downloaded", () => this.handleUpdateDownloaded()), this.autoInstallOnAppQuit || this.nativeUpdater.checkForUpdates());
    }
  };
  return ur.MacUpdater = s, ur;
}
var cr = {}, Lr = {}, Al;
function xf() {
  if (Al) return Lr;
  Al = 1, Object.defineProperty(Lr, "__esModule", { value: !0 }), Lr.verifySignature = l;
  const n = Le(), d = Ur, p = kr, f = Oe;
  function c(s, r) {
    return ['set "PSModulePath=" & chcp 65001 >NUL & powershell.exe', ["-NoProfile", "-NonInteractive", "-InputFormat", "None", "-Command", s], {
      shell: !0,
      timeout: r
    }];
  }
  function l(s, r, t) {
    return new Promise((o, h) => {
      const g = r.replace(/'/g, "''");
      t.info(`Verifying signature ${g}`), (0, d.execFile)(...c(`"Get-AuthenticodeSignature -LiteralPath '${g}' | ConvertTo-Json -Compress"`, 20 * 1e3), (y, m, _) => {
        var R;
        try {
          if (y != null || _) {
            u(t, y, _, h), o(null);
            return;
          }
          const b = i(m);
          if (b.Status === 0) {
            try {
              const I = f.normalize(b.Path), F = f.normalize(r);
              if (t.info(`LiteralPath: ${I}. Update Path: ${F}`), I !== F) {
                u(t, new Error(`LiteralPath of ${I} is different than ${F}`), _, h), o(null);
                return;
              }
            } catch (I) {
              t.warn(`Unable to verify LiteralPath of update asset due to missing data.Path. Skipping this step of validation. Message: ${(R = I.message) !== null && R !== void 0 ? R : I.stack}`);
            }
            const C = (0, n.parseDn)(b.SignerCertificate.Subject);
            let N = !1;
            for (const I of s) {
              const F = (0, n.parseDn)(I);
              if (F.size ? N = Array.from(F.keys()).every((S) => F.get(S) === C.get(S)) : I === C.get("CN") && (t.warn(`Signature validated using only CN ${I}. Please add your full Distinguished Name (DN) to publisherNames configuration`), N = !0), N) {
                o(null);
                return;
              }
            }
          }
          const D = `publisherNames: ${s.join(" | ")}, raw info: ` + JSON.stringify(b, (C, N) => C === "RawData" ? void 0 : N, 2);
          t.warn(`Sign verification failed, installer signed with incorrect certificate: ${D}`), o(D);
        } catch (b) {
          u(t, b, null, h), o(null);
          return;
        }
      });
    });
  }
  function i(s) {
    const r = JSON.parse(s);
    delete r.PrivateKey, delete r.IsOSBinary, delete r.SignatureType;
    const t = r.SignerCertificate;
    return t != null && (delete t.Archived, delete t.Extensions, delete t.Handle, delete t.HasPrivateKey, delete t.SubjectName), r;
  }
  function u(s, r, t, o) {
    if (a()) {
      s.warn(`Cannot execute Get-AuthenticodeSignature: ${r || t}. Ignoring signature validation due to unsupported powershell version. Please upgrade to powershell 3 or higher.`);
      return;
    }
    try {
      (0, d.execFileSync)(...c("ConvertTo-Json test", 10 * 1e3));
    } catch (h) {
      s.warn(`Cannot execute ConvertTo-Json: ${h.message}. Ignoring signature validation due to unsupported powershell version. Please upgrade to powershell 3 or higher.`);
      return;
    }
    r != null && o(r), t && o(new Error(`Cannot execute Get-AuthenticodeSignature, stderr: ${t}. Failing signature validation due to unknown stderr.`));
  }
  function a() {
    const s = p.release();
    return s.startsWith("6.") && !s.startsWith("6.3");
  }
  return Lr;
}
var Rl;
function Tl() {
  if (Rl) return cr;
  Rl = 1, Object.defineProperty(cr, "__esModule", { value: !0 }), cr.NsisUpdater = void 0;
  const n = Le(), d = Oe, p = Vr(), f = au(), c = Ot(), l = We(), i = /* @__PURE__ */ mt(), u = xf(), a = pt;
  let s = class extends p.BaseUpdater {
    constructor(t, o) {
      super(t, o), this._verifyUpdateCodeSignature = (h, g) => (0, u.verifySignature)(h, g, this._logger);
    }
    /**
     * The verifyUpdateCodeSignature. You can pass [win-verify-signature](https://github.com/beyondkmp/win-verify-trust) or another custom verify function: ` (publisherName: string[], path: string) => Promise<string | null>`.
     * The default verify function uses [windowsExecutableCodeSignatureVerifier](https://github.com/electron-userland/electron-builder/blob/master/packages/electron-updater/src/windowsExecutableCodeSignatureVerifier.ts)
     */
    get verifyUpdateCodeSignature() {
      return this._verifyUpdateCodeSignature;
    }
    set verifyUpdateCodeSignature(t) {
      t && (this._verifyUpdateCodeSignature = t);
    }
    /*** @private */
    doDownloadUpdate(t) {
      const o = t.updateInfoAndProvider.provider, h = (0, l.findFile)(o.resolveFiles(t.updateInfoAndProvider.info), "exe");
      return this.executeDownload({
        fileExtension: "exe",
        downloadUpdateOptions: t,
        fileInfo: h,
        task: async (g, y, m, _) => {
          const R = h.packageInfo, b = R != null && m != null;
          if (b && t.disableWebInstaller)
            throw (0, n.newError)(`Unable to download new version ${t.updateInfoAndProvider.info.version}. Web Installers are disabled`, "ERR_UPDATER_WEB_INSTALLER_DISABLED");
          !b && !t.disableWebInstaller && this._logger.warn("disableWebInstaller is set to false, you should set it to true if you do not plan on using a web installer. This will default to true in a future version."), (b || t.disableDifferentialDownload || await this.differentialDownloadInstaller(h, t, g, o, n.CURRENT_APP_INSTALLER_FILE_NAME)) && await this.httpExecutor.download(h.url, g, y);
          const D = await this.verifySignature(g);
          if (D != null)
            throw await _(), (0, n.newError)(`New version ${t.updateInfoAndProvider.info.version} is not signed by the application owner: ${D}`, "ERR_UPDATER_INVALID_SIGNATURE");
          if (b && await this.differentialDownloadWebPackage(t, R, m, o))
            try {
              await this.httpExecutor.download(new a.URL(R.path), m, {
                headers: t.requestHeaders,
                cancellationToken: t.cancellationToken,
                sha512: R.sha512
              });
            } catch (C) {
              try {
                await (0, i.unlink)(m);
              } catch {
              }
              throw C;
            }
        }
      });
    }
    // $certificateInfo = (Get-AuthenticodeSignature 'xxx\yyy.exe'
    // | where {$_.Status.Equals([System.Management.Automation.SignatureStatus]::Valid) -and $_.SignerCertificate.Subject.Contains("CN=siemens.com")})
    // | Out-String ; if ($certificateInfo) { exit 0 } else { exit 1 }
    async verifySignature(t) {
      let o;
      try {
        if (o = (await this.configOnDisk.value).publisherName, o == null)
          return null;
      } catch (h) {
        if (h.code === "ENOENT")
          return null;
        throw h;
      }
      return await this._verifyUpdateCodeSignature(Array.isArray(o) ? o : [o], t);
    }
    doInstall(t) {
      const o = this.installerPath;
      if (o == null)
        return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
      const h = ["--updated"];
      t.isSilent && h.push("/S"), t.isForceRunAfter && h.push("--force-run"), this.installDirectory && h.push(`/D=${this.installDirectory}`);
      const g = this.downloadedUpdateHelper == null ? null : this.downloadedUpdateHelper.packageFile;
      g != null && h.push(`--package-file=${g}`);
      const y = () => {
        this.spawnLog(d.join(process.resourcesPath, "elevate.exe"), [o].concat(h)).catch((m) => this.dispatchError(m));
      };
      return t.isAdminRightsRequired ? (this._logger.info("isAdminRightsRequired is set to true, run installer using elevate.exe"), y(), !0) : (this.spawnLog(o, h).catch((m) => {
        const _ = m.code;
        this._logger.info(`Cannot run installer: error code: ${_}, error message: "${m.message}", will be executed again using elevate if EACCES, and will try to use electron.shell.openItem if ENOENT`), _ === "UNKNOWN" || _ === "EACCES" ? y() : _ === "ENOENT" ? St.shell.openPath(o).catch((R) => this.dispatchError(R)) : this.dispatchError(m);
      }), !0);
    }
    async differentialDownloadWebPackage(t, o, h, g) {
      if (o.blockMapSize == null)
        return !0;
      try {
        const y = {
          newUrl: new a.URL(o.path),
          oldFile: d.join(this.downloadedUpdateHelper.cacheDir, n.CURRENT_APP_PACKAGE_FILE_NAME),
          logger: this._logger,
          newFile: h,
          requestHeaders: this.requestHeaders,
          isUseMultipleRangeRequest: g.isUseMultipleRangeRequest,
          cancellationToken: t.cancellationToken
        };
        this.listenerCount(c.DOWNLOAD_PROGRESS) > 0 && (y.onProgress = (m) => this.emit(c.DOWNLOAD_PROGRESS, m)), await new f.FileWithEmbeddedBlockMapDifferentialDownloader(o, this.httpExecutor, y).download();
      } catch (y) {
        return this._logger.error(`Cannot download differentially, fallback to full download: ${y.stack || y}`), process.platform === "win32";
      }
      return !1;
    }
  };
  return cr.NsisUpdater = s, cr;
}
var Sl;
function Lf() {
  return Sl || (Sl = 1, (function(n) {
    var d = _t && _t.__createBinding || (Object.create ? (function(m, _, R, b) {
      b === void 0 && (b = R);
      var D = Object.getOwnPropertyDescriptor(_, R);
      (!D || ("get" in D ? !_.__esModule : D.writable || D.configurable)) && (D = { enumerable: !0, get: function() {
        return _[R];
      } }), Object.defineProperty(m, b, D);
    }) : (function(m, _, R, b) {
      b === void 0 && (b = R), m[b] = _[R];
    })), p = _t && _t.__exportStar || function(m, _) {
      for (var R in m) R !== "default" && !Object.prototype.hasOwnProperty.call(_, R) && d(_, m, R);
    };
    Object.defineProperty(n, "__esModule", { value: !0 }), n.NsisUpdater = n.MacUpdater = n.RpmUpdater = n.PacmanUpdater = n.DebUpdater = n.AppImageUpdater = n.Provider = n.NoOpLogger = n.AppUpdater = n.BaseUpdater = void 0;
    const f = /* @__PURE__ */ mt(), c = Oe;
    var l = Vr();
    Object.defineProperty(n, "BaseUpdater", { enumerable: !0, get: function() {
      return l.BaseUpdater;
    } });
    var i = lo();
    Object.defineProperty(n, "AppUpdater", { enumerable: !0, get: function() {
      return i.AppUpdater;
    } }), Object.defineProperty(n, "NoOpLogger", { enumerable: !0, get: function() {
      return i.NoOpLogger;
    } });
    var u = We();
    Object.defineProperty(n, "Provider", { enumerable: !0, get: function() {
      return u.Provider;
    } });
    var a = dl();
    Object.defineProperty(n, "AppImageUpdater", { enumerable: !0, get: function() {
      return a.AppImageUpdater;
    } });
    var s = ml();
    Object.defineProperty(n, "DebUpdater", { enumerable: !0, get: function() {
      return s.DebUpdater;
    } });
    var r = El();
    Object.defineProperty(n, "PacmanUpdater", { enumerable: !0, get: function() {
      return r.PacmanUpdater;
    } });
    var t = vl();
    Object.defineProperty(n, "RpmUpdater", { enumerable: !0, get: function() {
      return t.RpmUpdater;
    } });
    var o = _l();
    Object.defineProperty(n, "MacUpdater", { enumerable: !0, get: function() {
      return o.MacUpdater;
    } });
    var h = Tl();
    Object.defineProperty(n, "NsisUpdater", { enumerable: !0, get: function() {
      return h.NsisUpdater;
    } }), p(Ot(), n);
    let g;
    function y() {
      if (process.platform === "win32")
        g = new (Tl()).NsisUpdater();
      else if (process.platform === "darwin")
        g = new (_l()).MacUpdater();
      else {
        g = new (dl()).AppImageUpdater();
        try {
          const m = c.join(process.resourcesPath, "package-type");
          if (!(0, f.existsSync)(m))
            return g;
          switch ((0, f.readFileSync)(m).toString().trim()) {
            case "deb":
              g = new (ml()).DebUpdater();
              break;
            case "rpm":
              g = new (vl()).RpmUpdater();
              break;
            case "pacman":
              g = new (El()).PacmanUpdater();
              break;
            default:
              break;
          }
        } catch (m) {
          console.warn("Unable to detect 'package-type' for autoUpdater (rpm/deb/pacman support). If you'd like to expand support, please consider contributing to electron-builder", m.message);
        }
      }
      return g;
    }
    Object.defineProperty(n, "autoUpdater", {
      enumerable: !0,
      get: () => g || y()
    });
  })(_t)), _t;
}
var Uf = Lf();
const wd = /* @__PURE__ */ ac({
  __proto__: null
}, [Uf]);
export {
  wd as m
};
