import { _ as F, a as Ph, b as Nh, d as Rh, M as $h, A as le, R as dt, e as Qr, i as Js, f as Mt, C as qa, g as os, F as Za, h as Ya, T as Xa, j as J, S as Jn, k as Pe, l as Ot, m as U, H as Qa, n as $t, p as jh, o as Lh, q as Dh, r as Fh, s as Vh, t as Bh, u as Hh, v as Uh, w as Wh, x as zh, y as Yo, z as Gh, B as Jh, D as Kh, E as qh, G as Zh, I as Yh, J as Xh, K as Qh, L as ed, N as td, O as Xo, P as nd, Q as sd, U as rd, V as ke, W as ad, X as id, Y as od, Z as cd, $ as ld, a0 as ud, a1 as hd, a2 as dd, a3 as fd, a4 as ft, a5 as pd, a6 as md, a7 as gd, a8 as yd, a9 as _d, aa as wd, ab as ea, ac as ve, ad as ei, ae as Qo, af as vd, ag as bd, ah as Sd, ai as kd, aj as Cd, ak as Ed, al as Td, am as xd, an as ec, ao as Md, ap as ur, aq as Q, ar as Id, as as tc, at as Ad, au as Od, av as Pd, aw as pn, ax as nc, ay as sc, az as Nd, aA as rc, aB as Je, aC as Ks, aD as Kt, aE as hr, aF as ac, aG as ae, aH as ct, aI as Ze, aJ as _e, aK as ic, aL as Rd, aM as ta, aN as Ae, aO as ti, aP as oc, aQ as na, aR as oe, aS as $d, aT as jd, aU as pt, aV as Ld, aW as Dd, aX as Fd, aY as Vd, aZ as Bd, a_ as Hd, a$ as dr, b0 as Fn, b1 as ni, b2 as Ud, b3 as Wd, b4 as si, b5 as sa, b6 as zd, b7 as Gd, b8 as Jd, b9 as Kd, ba as qd, bb as cc, bc as ri, bd as Zd, be as lc, bf as Yd, bg as uc, bh as se, bi as fe, bj as fr, bk as Xd, bl as Mr, bm as Qd, bn as qs, bo as ef, bp as Gt, bq as tf, br as nf, bs as sf, bt as rf, bu as af, bv as of, bw as cf, bx as lf, by as uf, bz as hf, bA as df, bB as ff, bC as pf, bD as hc, bE as mf, bF as gf, bG as Qi, bH as cs, bI as yf, bJ as Kn, bK as ai, bL as _f, bM as ra, bN as xn, bO as wf, bP as vf, bQ as dc, bR as bf, bS as Sf, bT as ii, bU as je, bV as aa, bW as kf, bX as Cf, bY as Ef, bZ as Tf, b_ as xf, b$ as Mf, c0 as If, c1 as Af, c2 as Of, c3 as Pf, c4 as Nf, c5 as Rf, c6 as $f, c7 as jf, c8 as Lf, c9 as Df, ca as Ff, cb as Vf, cc as Bf, cd as Hf, ce as Uf, cf as Wf, cg as zf, ch as Gf, ci as Jf, cj as Kf, ck as qf, cl as Zf, cm as Yf, cn as Xf, co as Qf, cp as ep, cq as tp, cr as eo, cs as pr, ct as ia, cu as to, cv as un, cw as no, cx as oi, cy as Ye, cz as Ps, cA as fc, cB as np, cC as sp, cD as rp, cE as W, cF as Mn, cG as nt, cH as Xe, cI as ci, cJ as Pt, cK as qn, cL as ap, cM as en, cN as Z, cO as ls, cP as hn, cQ as Nt, cR as ue, cS as li, cT as pc, cU as mc, cV as ip, cW as so, cX as _s, cY as ws, cZ as He, c_ as op, c$ as cp, d0 as lp, d1 as up, d2 as hp, d3 as dp, d4 as fp, d5 as pp, d6 as mp, d7 as gp } from "./main-2iJdHqXF.js";
import { AsyncLocalStorage as yp } from "node:async_hooks";
var _p = /* @__PURE__ */ F({
  awaitAllCallbacks: () => Nh,
  consumeCallback: () => Ph
}), wp = /* @__PURE__ */ F({
  AsyncLocalStorageProviderSingleton: () => le,
  MockAsyncLocalStorage: () => $h,
  _CONTEXT_VARIABLES_KEY: () => Rh
});
const Zs = (e, t) => {
  const n = [...new Set(t?.map((r) => {
    if (typeof r == "string") return r;
    const a = new r({});
    if (!("getType" in a) || typeof a.getType != "function") throw new Error("Invalid type provided.");
    return a.getType();
  }))], s = e.getType();
  return n.some((r) => r === s);
};
function vp(e, t) {
  return Array.isArray(e) ? ro(e, t) : dt.from((n) => ro(n, e));
}
function ro(e, t = {}) {
  const { includeNames: n, excludeNames: s, includeTypes: r, excludeTypes: a, includeIds: i, excludeIds: o } = t, c = [];
  for (const l of e)
    if (!(s && l.name && s.includes(l.name))) {
      {
        if (a && Zs(l, a)) continue;
        if (o && l.id && o.includes(l.id)) continue;
      }
      r || i || n ? (n && l.name && n.some((u) => u === l.name) || r && Zs(l, r) || i && l.id && i.some((u) => u === l.id)) && c.push(l) : c.push(l);
    }
  return c;
}
function bp(e) {
  return Array.isArray(e) ? ao(e) : dt.from(ao);
}
function ao(e) {
  if (!e.length) return [];
  const t = [];
  for (const n of e) {
    const s = n, r = t.pop();
    if (!r) t.push(s);
    else if (s.getType() === "tool" || s.getType() !== r.getType()) t.push(r, s);
    else {
      const a = Qr(r), i = Qr(s), o = a.concat(i);
      typeof a.content == "string" && typeof i.content == "string" && (o.content = `${a.content}
${i.content}`), t.push(Cp(o));
    }
  }
  return t;
}
function Sp(e, t) {
  if (Array.isArray(e)) {
    const n = e;
    if (!t) throw new Error("Options parameter is required when providing messages.");
    return io(n, t);
  } else {
    const n = e;
    return dt.from((s) => io(s, n)).withConfig({ runName: "trim_messages" });
  }
}
async function io(e, t) {
  const { maxTokens: n, tokenCounter: s, strategy: r = "last", allowPartial: a = !1, endOn: i, startOn: o, includeSystem: c = !1, textSplitter: l } = t;
  if (o && r === "first") throw new Error("`startOn` should only be specified if `strategy` is 'last'.");
  if (c && r === "first") throw new Error("`includeSystem` should only be specified if `strategy` is 'last'.");
  let u;
  "getNumTokens" in s ? u = async (h) => (await Promise.all(h.map((f) => s.getNumTokens(f.content)))).reduce((f, p) => f + p, 0) : u = async (h) => s(h);
  let d = yc;
  if (l && ("splitText" in l ? d = l.splitText : d = async (h) => l(h)), r === "first") return gc(e, {
    maxTokens: n,
    tokenCounter: u,
    textSplitter: d,
    partialStrategy: a ? "first" : void 0,
    endOn: i
  });
  if (r === "last") return kp(e, {
    maxTokens: n,
    tokenCounter: u,
    textSplitter: d,
    allowPartial: a,
    includeSystem: c,
    startOn: o,
    endOn: i
  });
  throw new Error(`Unrecognized strategy: '${r}'. Must be one of 'first' or 'last'.`);
}
async function gc(e, t) {
  const { maxTokens: n, tokenCounter: s, textSplitter: r, partialStrategy: a, endOn: i } = t;
  let o = [...e], c = 0;
  for (let l = 0; l < o.length; l += 1) if (await s(l > 0 ? o.slice(0, -l) : o) <= n) {
    c = o.length - l;
    break;
  }
  if (c < o.length && a) {
    let l = !1;
    if (Array.isArray(o[c].content)) {
      const u = o[c];
      if (typeof u.content == "string") throw new Error("Expected content to be an array.");
      const d = u.content.length, h = a === "last" ? [...u.content].reverse() : u.content;
      for (let f = 1; f <= d; f += 1) {
        const p = a === "first" ? h.slice(0, f) : h.slice(-f), m = Object.fromEntries(Object.entries(u).filter(([_]) => _ !== "type" && !_.startsWith("lc_"))), g = ui(u.getType(), {
          ...m,
          content: p
        }), y = [...o.slice(0, c), g];
        if (await s(y) <= n)
          o = y, c += 1, l = !0;
        else break;
      }
      l && a === "last" && (u.content = [...h].reverse());
    }
    if (!l) {
      const u = o[c];
      let d;
      if (Array.isArray(u.content) && u.content.some((h) => typeof h == "string" || h.type === "text") ? d = u.content.find((h) => h.type === "text" && h.text)?.text : typeof u.content == "string" && (d = u.content), d) {
        const h = await r(d), f = h.length;
        a === "last" && h.reverse();
        for (let p = 0; p < f - 1; p += 1)
          if (h.pop(), u.content = h.join(""), await s([...o.slice(0, c), u]) <= n) {
            a === "last" && (u.content = [...h].reverse().join("")), o = [...o.slice(0, c), u], c += 1;
            break;
          }
      }
    }
  }
  if (i) {
    const l = Array.isArray(i) ? i : [i];
    for (; c > 0 && !Zs(o[c - 1], l); ) c -= 1;
  }
  return o.slice(0, c);
}
async function kp(e, t) {
  const { allowPartial: n = !1, includeSystem: s = !1, endOn: r, startOn: a, ...i } = t;
  let o = e.map((u) => {
    const d = Object.fromEntries(Object.entries(u).filter(([h]) => h !== "type" && !h.startsWith("lc_")));
    return ui(u.getType(), d, Js(u));
  });
  if (r) {
    const u = Array.isArray(r) ? r : [r];
    for (; o.length > 0 && !Zs(o[o.length - 1], u); ) o = o.slice(0, -1);
  }
  const c = s && o[0]?.getType() === "system";
  let l = c ? o.slice(0, 1).concat(o.slice(1).reverse()) : o.reverse();
  return l = await gc(l, {
    ...i,
    partialStrategy: n ? "last" : void 0,
    endOn: a
  }), c ? [l[0], ...l.slice(1).reverse()] : l.reverse();
}
const oo = {
  human: {
    message: $t,
    messageChunk: Qa
  },
  ai: {
    message: U,
    messageChunk: Ot
  },
  system: {
    message: Pe,
    messageChunk: Jn
  },
  developer: {
    message: Pe,
    messageChunk: Jn
  },
  tool: {
    message: J,
    messageChunk: Xa
  },
  function: {
    message: Ya,
    messageChunk: Za
  },
  generic: {
    message: os,
    messageChunk: qa
  },
  remove: {
    message: Mt,
    messageChunk: Mt
  }
};
function ui(e, t, n) {
  let s, r;
  switch (e) {
    case "human":
      n ? s = new Qa(t) : r = new $t(t);
      break;
    case "ai":
      if (n) {
        let a = { ...t };
        "tool_calls" in a && (a = {
          ...a,
          tool_call_chunks: a.tool_calls?.map((i) => ({
            ...i,
            type: "tool_call_chunk",
            index: void 0,
            args: JSON.stringify(i.args)
          }))
        }), s = new Ot(a);
      } else r = new U(t);
      break;
    case "system":
      n ? s = new Jn(t) : r = new Pe(t);
      break;
    case "developer":
      n ? s = new Jn({
        ...t,
        additional_kwargs: {
          ...t.additional_kwargs,
          __openai_role__: "developer"
        }
      }) : r = new Pe({
        ...t,
        additional_kwargs: {
          ...t.additional_kwargs,
          __openai_role__: "developer"
        }
      });
      break;
    case "tool":
      if ("tool_call_id" in t) n ? s = new Xa(t) : r = new J(t);
      else throw new Error("Can not convert ToolMessage to ToolMessageChunk if 'tool_call_id' field is not defined.");
      break;
    case "function":
      if (n) s = new Za(t);
      else {
        if (!t.name) throw new Error("FunctionMessage must have a 'name' field");
        r = new Ya(t);
      }
      break;
    case "generic":
      if ("role" in t) n ? s = new qa(t) : r = new os(t);
      else throw new Error("Can not convert ChatMessage to ChatMessageChunk if 'role' field is not defined.");
      break;
    default:
      throw new Error(`Unrecognized message type ${e}`);
  }
  if (n && s) return s;
  if (r) return r;
  throw new Error(`Unrecognized message type ${e}`);
}
function Cp(e) {
  const t = e.getType();
  let n;
  const s = Object.fromEntries(Object.entries(e).filter(([r]) => !["type", "tool_call_chunks"].includes(r) && !r.startsWith("lc_")));
  if (t in oo && (n = ui(t, s)), !n) throw new Error(`Unrecognized message chunk class ${t}. Supported classes are ${Object.keys(oo)}`);
  return n;
}
function yc(e) {
  const t = e.split(`
`);
  return Promise.resolve([...t.slice(0, -1).map((n) => `${n}
`), t[t.length - 1]]);
}
const Ep = [
  "tool_call",
  "tool_call_chunk",
  "invalid_tool_call",
  "server_tool_call",
  "server_tool_call_chunk",
  "server_tool_call_result"
], Tp = [
  "image",
  "video",
  "audio",
  "text-plain",
  "file"
], xp = [
  "text",
  "reasoning",
  ...Ep,
  ...Tp
];
var Mp = /* @__PURE__ */ F({
  AIMessage: () => U,
  AIMessageChunk: () => Ot,
  BaseMessage: () => ve,
  BaseMessageChunk: () => ea,
  ChatMessage: () => os,
  ChatMessageChunk: () => qa,
  DEFAULT_MERGE_IGNORE_KEYS: () => wd,
  FunctionMessage: () => Ya,
  FunctionMessageChunk: () => Za,
  HumanMessage: () => $t,
  HumanMessageChunk: () => Qa,
  KNOWN_BLOCK_TYPES: () => xp,
  RemoveMessage: () => Mt,
  SystemMessage: () => Pe,
  SystemMessageChunk: () => Jn,
  ToolMessage: () => J,
  ToolMessageChunk: () => Xa,
  _isMessageFieldWithRole: () => _d,
  _mergeDicts: () => yd,
  _mergeLists: () => gd,
  _mergeObj: () => md,
  _mergeStatus: () => pd,
  coerceMessageLikeToMessage: () => ft,
  collapseToolCallChunks: () => fd,
  convertToChunk: () => Qr,
  convertToOpenAIImageBlock: () => dd,
  convertToProviderContentBlock: () => hd,
  defaultTextSplitter: () => yc,
  defaultToolCallParser: () => ud,
  filterMessages: () => vp,
  getBufferString: () => ld,
  iife: () => cd,
  isAIMessage: () => od,
  isAIMessageChunk: () => id,
  isBase64ContentBlock: () => ad,
  isBaseMessage: () => ke,
  isBaseMessageChunk: () => Js,
  isChatMessage: () => rd,
  isChatMessageChunk: () => sd,
  isDataContentBlock: () => nd,
  isDirectToolOutput: () => Xo,
  isFunctionMessage: () => td,
  isFunctionMessageChunk: () => ed,
  isHumanMessage: () => Qh,
  isHumanMessageChunk: () => Xh,
  isIDContentBlock: () => Yh,
  isMessage: () => Zh,
  isOpenAIToolCallArray: () => qh,
  isPlainTextContentBlock: () => Kh,
  isSystemMessage: () => Jh,
  isSystemMessageChunk: () => Gh,
  isToolMessage: () => Yo,
  isToolMessageChunk: () => zh,
  isURLContentBlock: () => Wh,
  mapChatMessagesToStoredMessages: () => Uh,
  mapStoredMessageToChatMessage: () => Hh,
  mapStoredMessagesToChatMessages: () => Bh,
  mergeContent: () => Vh,
  mergeMessageRuns: () => bp,
  mergeResponseMetadata: () => Fh,
  mergeUsageMetadata: () => Dh,
  parseBase64DataUrl: () => Lh,
  parseMimeType: () => jh,
  trimMessages: () => Sp
});
function Ip(e, t, n) {
  const s = e[t], r = Math.max(
    0,
    Math.min((s.sourceEndSec ?? 0) - s.sourceStartSec, n - s.sourceStartSec)
  );
  return {
    clip: s,
    clipIndex: t,
    virtualTimeSec: s.timelineStartSec + r,
    sourceTimeSec: n
  };
}
function Ap(e, t, n, s) {
  const r = e.sourceEndSec ?? e.sourceStartSec, a = s === "inclusive" ? r + n : r - n;
  return t >= e.sourceStartSec - n && t <= a;
}
function co(e, t, n, s = 0.05, r) {
  const a = (c) => e.findIndex(
    (l) => (!n || l.assetId === n) && Ap(l, t, s, c)
  ), i = a("exclusive"), o = i >= 0 ? i : a("inclusive");
  return o < 0 ? null : Ip(e, o, t);
}
var Op = /* @__PURE__ */ F({
  extendInteropZodObject: () => ac,
  getInteropZodDefaultGetter: () => hr,
  getInteropZodObjectShape: () => Kt,
  getSchemaDescription: () => Ks,
  interopParse: () => Je,
  interopParseAsync: () => rc,
  interopSafeParse: () => Nd,
  interopSafeParseAsync: () => sc,
  interopZodObjectMakeFieldsOptional: () => nc,
  interopZodObjectPartial: () => pn,
  interopZodObjectPassthrough: () => Pd,
  interopZodObjectStrict: () => Od,
  interopZodTransformInputSchema: () => Ad,
  isInteropZodError: () => tc,
  isInteropZodLiteral: () => Id,
  isInteropZodObject: () => Q,
  isInteropZodSchema: () => ur,
  isShapelessZodSchema: () => Md,
  isSimpleStringZodSchema: () => ec,
  isZodArrayV4: () => xd,
  isZodLiteralV3: () => Td,
  isZodLiteralV4: () => Ed,
  isZodNullableV4: () => Cd,
  isZodObjectV3: () => kd,
  isZodObjectV4: () => Sd,
  isZodOptionalV4: () => bd,
  isZodSchema: () => vd,
  isZodSchemaV3: () => Qo,
  isZodSchemaV4: () => ei
}), Pp = class extends ae {
  static lc_name() {
    return "RouterRunnable";
  }
  lc_namespace = ["langchain_core", "runnables"];
  lc_serializable = !0;
  runnables;
  constructor(e) {
    super(e), this.runnables = e.runnables;
  }
  async invoke(e, t) {
    const { key: n, input: s } = e, r = this.runnables[n];
    if (r === void 0) throw new Error(`No runnable associated with key "${n}".`);
    return r.invoke(s, ct(t));
  }
  async batch(e, t, n) {
    const s = e.map((u) => u.key), r = e.map((u) => u.input);
    if (s.find((u) => this.runnables[u] === void 0) !== void 0) throw new Error("One or more keys do not have a corresponding runnable.");
    const a = s.map((u) => this.runnables[u]), i = this._getOptionsList(t ?? {}, e.length), o = i[0]?.maxConcurrency ?? n?.maxConcurrency, c = o && o > 0 ? o : e.length, l = [];
    for (let u = 0; u < r.length; u += c) {
      const d = r.slice(u, u + c).map((f, p) => a[p].invoke(f, i[p])), h = await Promise.all(d);
      l.push(h);
    }
    return l.flat();
  }
  async stream(e, t) {
    const { key: n, input: s } = e, r = this.runnables[n];
    if (r === void 0) throw new Error(`No runnable associated with key "${n}".`);
    return r.stream(s, t);
  }
}, Np = class extends ae {
  static lc_name() {
    return "RunnableBranch";
  }
  lc_namespace = ["langchain_core", "runnables"];
  lc_serializable = !0;
  default;
  branches;
  constructor(e) {
    super(e), this.branches = e.branches, this.default = e.default;
  }
  /**
  * Convenience method for instantiating a RunnableBranch from
  * RunnableLikes (objects, functions, or Runnables).
  *
  * Each item in the input except for the last one should be a
  * tuple with two items. The first is a "condition" RunnableLike that
  * returns "true" if the second RunnableLike in the tuple should run.
  *
  * The final item in the input should be a RunnableLike that acts as a
  * default branch if no other branches match.
  *
  * @example
  * ```ts
  * import { RunnableBranch } from "@langchain/core/runnables";
  *
  * const branch = RunnableBranch.from([
  *   [(x: number) => x > 0, (x: number) => x + 1],
  *   [(x: number) => x < 0, (x: number) => x - 1],
  *   (x: number) => x
  * ]);
  * ```
  * @param branches An array where the every item except the last is a tuple of [condition, runnable]
  *   pairs. The last item is a default runnable which is invoked if no other condition matches.
  * @returns A new RunnableBranch.
  */
  static from(e) {
    if (e.length < 1) throw new Error("RunnableBranch requires at least one branch");
    const t = e.slice(0, -1).map(([s, r]) => [Ze(s), Ze(r)]), n = Ze(e[e.length - 1]);
    return new this({
      branches: t,
      default: n
    });
  }
  async _invoke(e, t, n) {
    let s;
    for (let r = 0; r < this.branches.length; r += 1) {
      const [a, i] = this.branches[r];
      if (await a.invoke(e, _e(t, { callbacks: n?.getChild(`condition:${r + 1}`) }))) {
        s = await i.invoke(e, _e(t, { callbacks: n?.getChild(`branch:${r + 1}`) }));
        break;
      }
    }
    return s || (s = await this.default.invoke(e, _e(t, { callbacks: n?.getChild("branch:default") }))), s;
  }
  async invoke(e, t = {}) {
    return this._callWithConfig(this._invoke, e, t);
  }
  async *_streamIterator(e, t) {
    const n = await (await ic(t))?.handleChainStart(this.toJSON(), Rd(e, "input"), t?.runId, void 0, void 0, void 0, t?.runName);
    let s, r = !0, a;
    try {
      for (let i = 0; i < this.branches.length; i += 1) {
        const [o, c] = this.branches[i];
        if (await o.invoke(e, _e(t, { callbacks: n?.getChild(`condition:${i + 1}`) }))) {
          a = await c.stream(e, _e(t, { callbacks: n?.getChild(`branch:${i + 1}`) }));
          for await (const l of a)
            if (yield l, r) if (s === void 0) s = l;
            else try {
              s = ta(s, l);
            } catch {
              s = void 0, r = !1;
            }
          break;
        }
      }
      if (a === void 0) {
        a = await this.default.stream(e, _e(t, { callbacks: n?.getChild("branch:default") }));
        for await (const i of a)
          if (yield i, r) if (s === void 0) s = i;
          else try {
            s = ta(s, i);
          } catch {
            s = void 0, r = !1;
          }
      }
    } catch (i) {
      throw await n?.handleChainError(i), i;
    }
    await n?.handleChainEnd(s ?? {});
  }
}, Rp = class extends Ae {
  runnable;
  inputMessagesKey;
  outputMessagesKey;
  historyMessagesKey;
  getMessageHistory;
  constructor(e) {
    let t = dt.from((a, i) => this._enterHistory(a, i ?? {})).withConfig({ runName: "loadHistory" });
    const n = e.historyMessagesKey ?? e.inputMessagesKey;
    n && (t = ti.assign({ [n]: t }).withConfig({ runName: "insertHistory" }));
    const s = t.pipe(e.runnable.withListeners({ onEnd: (a, i) => this._exitHistory(a, i ?? {}) })).withConfig({ runName: "RunnableWithMessageHistory" }), r = e.config ?? {};
    super({
      ...e,
      config: r,
      bound: s
    }), this.runnable = e.runnable, this.getMessageHistory = e.getMessageHistory, this.inputMessagesKey = e.inputMessagesKey, this.outputMessagesKey = e.outputMessagesKey, this.historyMessagesKey = e.historyMessagesKey;
  }
  _getInputMessages(e) {
    let t;
    if (typeof e == "object" && !Array.isArray(e) && !ke(e)) {
      let n;
      this.inputMessagesKey ? n = this.inputMessagesKey : Object.keys(e).length === 1 ? n = Object.keys(e)[0] : n = "input", Array.isArray(e[n]) && Array.isArray(e[n][0]) ? t = e[n][0] : t = e[n];
    } else t = e;
    if (typeof t == "string") return [new $t(t)];
    if (Array.isArray(t)) return t;
    if (ke(t)) return [t];
    throw new Error(`Expected a string, BaseMessage, or array of BaseMessages.
Got ${JSON.stringify(t, null, 2)}`);
  }
  _getOutputMessages(e) {
    let t;
    if (!Array.isArray(e) && !ke(e) && typeof e != "string") {
      let n;
      this.outputMessagesKey !== void 0 ? n = this.outputMessagesKey : Object.keys(e).length === 1 ? n = Object.keys(e)[0] : n = "output", e.generations !== void 0 ? t = e.generations[0][0].message : t = e[n];
    } else t = e;
    if (typeof t == "string") return [new U(t)];
    if (Array.isArray(t)) return t;
    if (ke(t)) return [t];
    throw new Error(`Expected a string, BaseMessage, or array of BaseMessages. Received: ${JSON.stringify(t, null, 2)}`);
  }
  async _enterHistory(e, t) {
    const n = await (t?.configurable?.messageHistory).getMessages();
    return this.historyMessagesKey === void 0 ? n.concat(this._getInputMessages(e)) : n;
  }
  async _exitHistory(e, t) {
    const n = t.configurable?.messageHistory;
    let s;
    Array.isArray(e.inputs) && Array.isArray(e.inputs[0]) ? s = e.inputs[0] : s = e.inputs;
    let r = this._getInputMessages(s);
    if (this.historyMessagesKey === void 0) {
      const o = await n.getMessages();
      r = r.slice(o.length);
    }
    const a = e.outputs;
    if (!a) throw new Error(`Output values from 'Run' undefined. Run: ${JSON.stringify(e, null, 2)}`);
    const i = this._getOutputMessages(a);
    await n.addMessages([...r, ...i]);
  }
  async _mergeConfig(...e) {
    const t = await super._mergeConfig(...e);
    if (!t.configurable || !t.configurable.sessionId) {
      const s = { [this.inputMessagesKey ?? "input"]: "foo" };
      throw new Error(`sessionId is required. Pass it in as part of the config argument to .invoke() or .stream()
eg. chain.invoke(${JSON.stringify(s)}, ${JSON.stringify({ configurable: { sessionId: "123" } })})`);
    }
    const { sessionId: n } = t.configurable;
    return t.configurable.messageHistory = await this.getMessageHistory(n), t;
  }
}, $p = /* @__PURE__ */ F({
  RouterRunnable: () => Pp,
  Runnable: () => ae,
  RunnableAssign: () => Hd,
  RunnableBinding: () => Ae,
  RunnableBranch: () => Np,
  RunnableEach: () => Bd,
  RunnableLambda: () => dt,
  RunnableMap: () => Vd,
  RunnableParallel: () => Fd,
  RunnablePassthrough: () => ti,
  RunnablePick: () => Dd,
  RunnableRetry: () => Ld,
  RunnableSequence: () => pt,
  RunnableToolLike: () => jd,
  RunnableWithFallbacks: () => $d,
  RunnableWithMessageHistory: () => Rp,
  _coerceToRunnable: () => Ze,
  ensureConfig: () => ct,
  getCallbackManagerForConfig: () => ic,
  mergeConfigs: () => oe,
  patchConfig: () => _e,
  pickRunnableConfigKeys: () => na,
  raceWithSignal: () => oc
}), jp = class extends dr {
  static lc_name() {
    return "BytesOutputParser";
  }
  lc_namespace = [
    "langchain_core",
    "output_parsers",
    "bytes"
  ];
  lc_serializable = !0;
  textEncoder = new TextEncoder();
  parse(e) {
    return Promise.resolve(this.textEncoder.encode(e));
  }
  getFormatInstructions() {
    return "";
  }
}, us = class extends dr {
  re;
  async *_transform(e) {
    let t = "";
    for await (const n of e)
      if (typeof n == "string" ? t += n : t += n.content, this.re) {
        const s = [...t.matchAll(this.re)];
        if (s.length > 1) {
          let r = 0;
          for (const a of s.slice(0, -1))
            yield [a[1]], r += (a.index ?? 0) + a[0].length;
          t = t.slice(r);
        }
      } else {
        const s = await this.parse(t);
        if (s.length > 1) {
          for (const r of s.slice(0, -1)) yield [r];
          t = s[s.length - 1];
        }
      }
    for (const n of await this.parse(t)) yield [n];
  }
}, Lp = class extends us {
  static lc_name() {
    return "CommaSeparatedListOutputParser";
  }
  lc_namespace = [
    "langchain_core",
    "output_parsers",
    "list"
  ];
  lc_serializable = !0;
  /**
  * Parses the given text into an array of strings, using a comma as the
  * separator. If the parsing fails, throws an OutputParserException.
  * @param text The text to parse.
  * @returns An array of strings obtained by splitting the input text at each comma.
  */
  async parse(e) {
    try {
      return e.trim().split(",").map((t) => t.trim());
    } catch {
      throw new Fn(`Could not parse output: ${e}`, e);
    }
  }
  /**
  * Provides instructions on the expected format of the response for the
  * CommaSeparatedListOutputParser.
  * @returns A string containing instructions on the expected format of the response.
  */
  getFormatInstructions() {
    return "Your response should be a list of comma separated values, eg: `foo, bar, baz`";
  }
}, Dp = class extends us {
  lc_namespace = [
    "langchain_core",
    "output_parsers",
    "list"
  ];
  length;
  separator;
  constructor({ length: e, separator: t }) {
    super(...arguments), this.length = e, this.separator = t || ",";
  }
  /**
  * Parses the given text into an array of strings, using the specified
  * separator. If the parsing fails or the number of items in the list
  * doesn't match the expected length, throws an OutputParserException.
  * @param text The text to parse.
  * @returns An array of strings obtained by splitting the input text at each occurrence of the specified separator.
  */
  async parse(e) {
    try {
      const t = e.trim().split(this.separator).map((n) => n.trim());
      if (this.length !== void 0 && t.length !== this.length) throw new Fn(`Incorrect number of items. Expected ${this.length}, got ${t.length}.`);
      return t;
    } catch (t) {
      throw Object.getPrototypeOf(t) === Fn.prototype ? t : new Fn(`Could not parse output: ${e}`);
    }
  }
  /**
  * Provides instructions on the expected format of the response for the
  * CustomListOutputParser, including the number of items and the
  * separator.
  * @returns A string containing instructions on the expected format of the response.
  */
  getFormatInstructions() {
    return `Your response should be a list of ${this.length === void 0 ? "" : `${this.length} `}items separated by "${this.separator}" (eg: \`foo${this.separator} bar${this.separator} baz\`)`;
  }
}, Fp = class extends us {
  static lc_name() {
    return "NumberedListOutputParser";
  }
  lc_namespace = [
    "langchain_core",
    "output_parsers",
    "list"
  ];
  lc_serializable = !0;
  getFormatInstructions() {
    return `Your response should be a numbered list with each item on a new line. For example: 

1. foo

2. bar

3. baz`;
  }
  re = /\d+\.\s([^\n]+)/g;
  async parse(e) {
    return [...e.matchAll(this.re) ?? []].map((t) => t[1]);
  }
}, Vp = class extends us {
  static lc_name() {
    return "NumberedListOutputParser";
  }
  lc_namespace = [
    "langchain_core",
    "output_parsers",
    "list"
  ];
  lc_serializable = !0;
  getFormatInstructions() {
    return `Your response should be a numbered list with each item on a new line. For example: 

1. foo

2. bar

3. baz`;
  }
  re = /^\s*[-*]\s([^\n]+)$/gm;
  async parse(e) {
    return [...e.matchAll(this.re) ?? []].map((t) => t[1]);
  }
}, Bp = class extends dr {
  static lc_name() {
    return "StrOutputParser";
  }
  lc_namespace = [
    "langchain_core",
    "output_parsers",
    "string"
  ];
  lc_serializable = !0;
  /**
  * Parses a string output from an LLM call. This method is meant to be
  * implemented by subclasses to define how a string output from an LLM
  * should be parsed.
  * @param text The string output from an LLM call.
  * @param callbacks Optional callbacks.
  * @returns A promise of the parsed output.
  */
  parse(e) {
    return Promise.resolve(e);
  }
  getFormatInstructions() {
    return "";
  }
  _textContentToString(e) {
    return e.text;
  }
  _imageUrlContentToString(e) {
    throw new Error('Cannot coerce a multimodal "image_url" message part into a string.');
  }
  _messageContentToString(e) {
    switch (e.type) {
      case "text":
      case "text_delta":
        if ("text" in e) return this._textContentToString(e);
        break;
      case "image_url":
        if ("image_url" in e) return this._imageUrlContentToString(e);
        break;
      case "reasoning":
      case "thinking":
      case "redacted_thinking":
        return "";
      default:
        throw new Error(`Cannot coerce "${e.type}" message part into a string.`);
    }
    throw new Error(`Invalid content type: ${e.type}`);
  }
  _baseMessageContentToString(e) {
    return e.reduce((t, n) => t + this._messageContentToString(n), "");
  }
}, Hp = /* @__PURE__ */ F({
  applyPatch: () => Ud,
  compare: () => ni
});
const oa = `The output should be formatted as a XML file.
1. Output should conform to the tags below.
2. If tags are not given, make them on your own.
3. Remember to always open and close all the tags.

As an example, for the tags ["foo", "bar", "baz"]:
1. String "<foo>
   <bar>
      <baz></baz>
   </bar>
</foo>" is a well-formatted instance of the schema.
2. String "<foo>
   <bar>
   </foo>" is a badly-formatted instance.
3. String "<foo>
   <tag>
   </tag>
</foo>" is a badly-formatted instance.

Here are the output tags:
\`\`\`
{tags}
\`\`\``;
var Up = class extends si {
  tags;
  constructor(e) {
    super(e), this.tags = e?.tags;
  }
  static lc_name() {
    return "XMLOutputParser";
  }
  lc_namespace = ["langchain_core", "output_parsers"];
  lc_serializable = !0;
  _diff(e, t) {
    if (t)
      return e ? ni(e, t) : [{
        op: "replace",
        path: "",
        value: t
      }];
  }
  async parsePartialResult(e) {
    return ca(e[0].text);
  }
  async parse(e) {
    return ca(e);
  }
  getFormatInstructions() {
    return this.tags && this.tags.length > 0 ? oa.replace("{tags}", this.tags?.join(", ") ?? "") : oa;
  }
};
const Wp = (e) => e.split(`
`).map((t) => t.replace(/^\s+/, "")).join(`
`).trim(), _c = (e) => {
  if (Object.keys(e).length === 0) return {};
  const t = {};
  return e.children.length > 0 ? (t[e.name] = e.children.map(_c), t) : (t[e.name] = e.text ?? void 0, t);
};
function ca(e) {
  const t = Wp(e), n = Wd.parser(!0);
  let s = {};
  const r = [];
  n.onopentag = (o) => {
    const c = {
      name: o.name,
      attributes: o.attributes,
      children: [],
      text: "",
      isSelfClosing: o.isSelfClosing
    };
    r.length > 0 ? r[r.length - 1].children.push(c) : s = c, o.isSelfClosing || r.push(c);
  }, n.onclosetag = () => {
    if (r.length > 0) {
      const o = r.pop();
      r.length === 0 && o && (s = o);
    }
  }, n.ontext = (o) => {
    if (r.length > 0) {
      const c = r[r.length - 1];
      c.text += o;
    }
  }, n.onattribute = (o) => {
    if (r.length > 0) {
      const c = r[r.length - 1];
      c.attributes[o.name] = o.value;
    }
  };
  const a = /```(xml)?(.*)```/s.exec(t), i = a ? a[2] : t;
  return n.write(i).close(), s && s.name === "?xml" && (s = s.children[0]), _c(s);
}
var zp = /* @__PURE__ */ F({
  AsymmetricStructuredOutputParser: () => Zd,
  BaseCumulativeTransformOutputParser: () => si,
  BaseLLMOutputParser: () => ri,
  BaseOutputParser: () => cc,
  BaseTransformOutputParser: () => dr,
  BytesOutputParser: () => jp,
  CommaSeparatedListOutputParser: () => Lp,
  CustomListOutputParser: () => Dp,
  JsonMarkdownStructuredOutputParser: () => qd,
  JsonOutputParser: () => Kd,
  ListOutputParser: () => us,
  MarkdownListOutputParser: () => Vp,
  NumberedListOutputParser: () => Fp,
  OutputParserException: () => Fn,
  StandardSchemaOutputParser: () => Jd,
  StringOutputParser: () => Bp,
  StructuredOutputParser: () => Gd,
  XMLOutputParser: () => Up,
  XML_FORMAT_INSTRUCTIONS: () => oa,
  parseJsonMarkdown: () => zd,
  parsePartialJson: () => sa,
  parseXMLMarkdown: () => ca
}), Gp = /* @__PURE__ */ F({ sha256: () => lc }), Jp = /* @__PURE__ */ F({
  BaseToolkit: () => Kp,
  DynamicStructuredTool: () => bc,
  DynamicTool: () => vc,
  StructuredTool: () => mr,
  Tool: () => wc,
  ToolInputParsingException: () => qs,
  isLangChainTool: () => of,
  isRunnableToolLike: () => af,
  isStructuredTool: () => rf,
  isStructuredToolParams: () => sf,
  tool: () => hi
}), mr = class extends Xd {
  /**
  * Optional provider-specific extra fields for the tool.
  *
  * This is used to pass provider-specific configuration that doesn't fit into
  * standard tool fields.
  */
  extras;
  /**
  * Whether to return the tool's output directly.
  *
  * Setting this to true means that after the tool is called,
  * an agent should stop looping.
  */
  returnDirect = !1;
  verboseParsingErrors = !1;
  get lc_namespace() {
    return ["langchain", "tools"];
  }
  /**
  * The tool response format.
  *
  * If "content" then the output of the tool is interpreted as the contents of a
  * ToolMessage. If "content_and_artifact" then the output is expected to be a
  * two-tuple corresponding to the (content, artifact) of a ToolMessage.
  *
  * @default "content"
  */
  responseFormat = "content";
  /**
  * Default config object for the tool runnable.
  */
  defaultConfig;
  constructor(e) {
    super(e ?? {}), this.verboseParsingErrors = e?.verboseParsingErrors ?? this.verboseParsingErrors, this.responseFormat = e?.responseFormat ?? this.responseFormat, this.defaultConfig = e?.defaultConfig ?? this.defaultConfig, this.metadata = e?.metadata ?? this.metadata, this.extras = e?.extras ?? this.extras;
  }
  /**
  * Invokes the tool with the provided input and configuration.
  * @param input The input for the tool.
  * @param config Optional configuration for the tool.
  * @returns A Promise that resolves with the tool's output.
  */
  async invoke(e, t) {
    let n, s = ct(oe(this.defaultConfig, t));
    return Mr(e) ? (n = e.args, s = {
      ...s,
      toolCall: e
    }) : n = e, this.call(n, s);
  }
  /**
  * @deprecated Use .invoke() instead. Will be removed in 0.3.0.
  *
  * Calls the tool with the provided argument, configuration, and tags. It
  * parses the input according to the schema, handles any errors, and
  * manages callbacks.
  * @param arg The input argument for the tool.
  * @param configArg Optional configuration or callbacks for the tool.
  * @param tags Optional tags for the tool.
  * @returns A Promise that resolves with a string.
  */
  async call(e, t, n) {
    const s = Mr(e) ? e.args : e;
    let r;
    if (ur(this.schema)) try {
      r = await rc(this.schema, s);
    } catch (f) {
      let p = "Received tool input did not match expected schema";
      throw this.verboseParsingErrors && (p = `${p}
Details: ${f.message}`), tc(f) && (p = `${p}

${Qd(f)}`), new qs(p, JSON.stringify(e));
    }
    else {
      const f = ef(s, this.schema);
      if (!f.valid) {
        let p = "Received tool input did not match expected schema";
        throw this.verboseParsingErrors && (p = `${p}
Details: ${f.errors.map((m) => `${m.keywordLocation}: ${m.error}`).join(`
`)}`), new qs(p, JSON.stringify(e));
      }
      r = s;
    }
    const a = fr(t), i = Gt.configure(a.callbacks, this.callbacks, a.tags || n, this.tags, a.metadata, this.metadata, { verbose: this.verbose });
    let o;
    Mr(e) && (o = e.id), !o && tf(a) && (o = a.toolCall.id);
    const c = await i?.handleToolStart(this.toJSON(), typeof e == "string" ? e : JSON.stringify(e), a.runId, void 0, void 0, void 0, a.runName, o);
    delete a.runId;
    let l;
    try {
      const f = await this._call(r, c, a);
      l = uc(f) ? await nf(f, async (p) => {
        try {
          await c?.handleToolEvent(p);
        } catch (m) {
          await c?.handleToolError(m);
        }
      }) : f;
    } catch (f) {
      throw await c?.handleToolError(f), f;
    }
    let u, d;
    if (this.responseFormat === "content_and_artifact") if (Array.isArray(l) && l.length === 2) [u, d] = l;
    else throw new Error(`Tool response format is "content_and_artifact" but the output was not a two-tuple.
Result: ${JSON.stringify(l)}`);
    else u = l;
    const h = Zp({
      content: u,
      artifact: d,
      toolCallId: o,
      name: this.name,
      metadata: this.metadata
    });
    return await c?.handleToolEnd(h), h;
  }
}, wc = class extends mr {
  schema = se({ input: fe().optional() }).transform((e) => e.input);
  constructor(e) {
    super(e);
  }
  /**
  * @deprecated Use .invoke() instead. Will be removed in 0.3.0.
  *
  * Calls the tool with the provided argument and callbacks. It handles
  * string inputs specifically.
  * @param arg The input argument for the tool, which can be a string, undefined, or an input of the tool's schema.
  * @param callbacks Optional callbacks for the tool.
  * @returns A Promise that resolves with a string.
  */
  call(e, t) {
    const n = typeof e == "string" || e == null ? { input: e } : e;
    return super.call(n, t);
  }
}, vc = class extends wc {
  static lc_name() {
    return "DynamicTool";
  }
  name;
  description;
  func;
  constructor(e) {
    super(e), this.name = e.name, this.description = e.description, this.func = e.func, this.returnDirect = e.returnDirect ?? this.returnDirect;
  }
  /**
  * @deprecated Use .invoke() instead. Will be removed in 0.3.0.
  */
  async call(e, t) {
    const n = fr(t);
    return n.runName === void 0 && (n.runName = this.name), super.call(e, n);
  }
  /** @ignore */
  _call(e, t, n) {
    return this.func(e, t, n);
  }
}, bc = class extends mr {
  static lc_name() {
    return "DynamicStructuredTool";
  }
  description;
  func;
  schema;
  constructor(e) {
    super(e), this.name = e.name, this.description = e.description, this.func = e.func, this.returnDirect = e.returnDirect ?? this.returnDirect, this.schema = e.schema;
  }
  /**
  * @deprecated Use .invoke() instead. Will be removed in 0.3.0.
  */
  async call(e, t, n) {
    const s = fr(t);
    return s.runName === void 0 && (s.runName = this.name), super.call(e, s, n);
  }
  _call(e, t, n) {
    return this.func(e, t, n);
  }
}, Kp = class {
  getTools() {
    return this.tools;
  }
};
function hi(e, t) {
  const n = ec(t.schema), s = Yd(t.schema);
  if (!t.schema || n || s) return new vc({
    ...t,
    description: t.description ?? t.schema?.description ?? `${t.name} tool`,
    func: async (i, o, c) => new Promise((l, u) => {
      const d = _e(c, { callbacks: o?.getChild() });
      le.runWithConfig(na(d), async () => {
        try {
          l(e(i, d));
        } catch (h) {
          u(h);
        }
      });
    })
  });
  const r = t.schema, a = t.description ?? t.schema.description ?? `${t.name} tool`;
  return new bc({
    ...t,
    description: a,
    schema: r,
    func: async (i, o, c) => new Promise((l, u) => {
      let d;
      const h = () => {
        c?.signal && d && c.signal.removeEventListener("abort", d);
      };
      c?.signal && (d = () => {
        h(), u(cf(c.signal));
      }, c.signal.addEventListener("abort", d, { once: !0 }));
      const f = _e(c, { callbacks: o?.getChild() });
      le.runWithConfig(na(f), async () => {
        try {
          const p = await e(i, f);
          if (uc(p)) {
            l(p);
            return;
          }
          if (c?.signal?.aborted) {
            h();
            return;
          }
          h(), l(p);
        } catch (p) {
          h(), u(p);
        }
      });
    })
  });
}
function qp(e) {
  return typeof e == "object" && e !== null && "type" in e;
}
function Zp(e) {
  const { content: t, artifact: n, toolCallId: s, metadata: r } = e;
  return s && !Xo(t) ? typeof t == "string" || Array.isArray(t) && t.every(qp) ? new J({
    status: "success",
    content: t,
    artifact: n,
    tool_call_id: s,
    name: e.name,
    metadata: r
  }) : new J({
    status: "success",
    content: Yp(t),
    artifact: n,
    tool_call_id: s,
    name: e.name,
    metadata: r
  }) : t;
}
function Yp(e) {
  try {
    return JSON.stringify(e) ?? "";
  } catch {
    return `${e}`;
  }
}
var Xp = /* @__PURE__ */ F({
  JsonOutputKeyToolsParser: () => ff,
  JsonOutputToolsParser: () => df,
  convertLangChainToolCallToOpenAI: () => hf,
  makeInvalidToolCall: () => uf,
  parseToolCall: () => lf
}), Qp = /* @__PURE__ */ F({ Embeddings: () => di }), di = class {
  /**
  * The async caller should be used by subclasses to make any async calls,
  * which will thus benefit from the concurrency and retry logic.
  */
  caller;
  constructor(e) {
    this.caller = new pf(e ?? {});
  }
}, em = /* @__PURE__ */ F({ chunkArray: () => tm });
const tm = (e, t) => e.reduce((n, s, r) => {
  const a = Math.floor(r / t);
  return n[a] = (n[a] || []).concat([s]), n;
}, []);
var nm = /* @__PURE__ */ F({
  BaseLLM: () => Sc,
  LLM: () => fi
}), Sc = class Rn extends hc {
  lc_namespace = [
    "langchain",
    "llms",
    this._llmType()
  ];
  /**
  * This method takes an input and options, and returns a string. It
  * converts the input to a prompt value and generates a result based on
  * the prompt.
  * @param input Input for the LLM.
  * @param options Options for the LLM call.
  * @returns A string result based on the prompt.
  */
  async invoke(t, n) {
    const s = Rn._convertInputToPromptValue(t);
    return (await this.generatePrompt([s], n, n?.callbacks)).generations[0][0].text;
  }
  async *_streamResponseChunks(t, n, s) {
    throw new Error("Not implemented.");
  }
  _separateRunnableConfigFromCallOptionsCompat(t) {
    const [n, s] = super._separateRunnableConfigFromCallOptions(t);
    return s.signal = n.signal, [n, s];
  }
  async *_streamIterator(t, n) {
    if (this._streamResponseChunks === Rn.prototype._streamResponseChunks) yield this.invoke(t, n);
    else {
      const s = Rn._convertInputToPromptValue(t), [r, a] = this._separateRunnableConfigFromCallOptionsCompat(n), i = this.invocationParams(a), o = await Gt.configure(r.callbacks, this.callbacks, r.tags, this.tags, r.metadata, this.metadata, {
        verbose: this.verbose,
        tracerInheritableMetadata: this._filterInvocationParamsForTracing(i)
      }), c = {
        options: a,
        invocation_params: i,
        batch_size: 1
      }, l = await o?.handleLLMStart(this.toJSON(), [s.toString()], r.runId, void 0, c, void 0, void 0, r.runName);
      let u = new mf({ text: "" });
      try {
        for await (const d of this._streamResponseChunks(s.toString(), a, l?.[0]))
          u ? u = u.concat(d) : u = d, typeof d.text == "string" && (yield d.text);
      } catch (d) {
        throw await Promise.all((l ?? []).map((h) => h?.handleLLMError(d))), d;
      }
      await Promise.all((l ?? []).map((d) => d?.handleLLMEnd({ generations: [[u]] })));
    }
  }
  /**
  * This method takes prompt values, options, and callbacks, and generates
  * a result based on the prompts.
  * @param promptValues Prompt values for the LLM.
  * @param options Options for the LLM call.
  * @param callbacks Callbacks for the LLM call.
  * @returns An LLMResult based on the prompts.
  */
  async generatePrompt(t, n, s) {
    const r = t.map((a) => a.toString());
    return this.generate(r, n, s);
  }
  /**
  * Get the parameters used to invoke the model
  */
  invocationParams(t) {
    return {};
  }
  _flattenLLMResult(t) {
    const n = [];
    for (let s = 0; s < t.generations.length; s += 1) {
      const r = t.generations[s];
      if (s === 0) n.push({
        generations: [r],
        llmOutput: t.llmOutput
      });
      else {
        const a = t.llmOutput ? {
          ...t.llmOutput,
          tokenUsage: {}
        } : void 0;
        n.push({
          generations: [r],
          llmOutput: a
        });
      }
    }
    return n;
  }
  /** @ignore */
  async _generateUncached(t, n, s, r) {
    let a;
    if (r !== void 0 && r.length === t.length) a = r;
    else {
      const l = this.invocationParams(n), u = await Gt.configure(s.callbacks, this.callbacks, s.tags, this.tags, s.metadata, this.metadata, {
        verbose: this.verbose,
        tracerInheritableMetadata: this._filterInvocationParamsForTracing(l)
      }), d = {
        options: n,
        invocation_params: l,
        batch_size: t.length
      };
      a = await u?.handleLLMStart(this.toJSON(), t, s.runId, void 0, d, void 0, void 0, s?.runName);
    }
    const i = !!a?.[0].handlers.find(gf);
    let o;
    if (i && t.length === 1 && this._streamResponseChunks !== Rn.prototype._streamResponseChunks) try {
      const l = await this._streamResponseChunks(t[0], n, a?.[0]);
      let u;
      for await (const d of l) u === void 0 ? u = d : u = ta(u, d);
      if (u === void 0) throw new Error("Received empty response from chat model call.");
      o = {
        generations: [[u]],
        llmOutput: {}
      }, await a?.[0].handleLLMEnd(o);
    } catch (l) {
      throw await a?.[0].handleLLMError(l), l;
    }
    else {
      try {
        o = await this._generate(t, n, a?.[0]);
      } catch (u) {
        throw await Promise.all((a ?? []).map((d) => d?.handleLLMError(u))), u;
      }
      const l = this._flattenLLMResult(o);
      await Promise.all((a ?? []).map((u, d) => u?.handleLLMEnd(l[d])));
    }
    const c = a?.map((l) => l.runId) || void 0;
    return Object.defineProperty(o, Qi, {
      value: c ? { runIds: c } : void 0,
      configurable: !0
    }), o;
  }
  async _generateCached({ prompts: t, cache: n, llmStringKey: s, parsedOptions: r, handledOptions: a, runId: i }) {
    const o = this.invocationParams(r), c = await Gt.configure(a.callbacks, this.callbacks, a.tags, this.tags, a.metadata, this.metadata, {
      verbose: this.verbose,
      tracerInheritableMetadata: this._filterInvocationParamsForTracing(o)
    }), l = {
      options: r,
      invocation_params: o,
      batch_size: t.length
    }, u = await c?.handleLLMStart(this.toJSON(), t, i, void 0, l, void 0, void 0, a?.runName), d = [], h = (await Promise.allSettled(t.map(async (m, g) => {
      const y = await n.lookup(m, s);
      return y == null && d.push(g), y;
    }))).map((m, g) => ({
      result: m,
      runManager: u?.[g]
    })).filter(({ result: m }) => m.status === "fulfilled" && m.value != null || m.status === "rejected"), f = [];
    await Promise.all(h.map(async ({ result: m, runManager: g }, y) => {
      if (m.status === "fulfilled") {
        const _ = m.value;
        return f[y] = _.map((b) => (b.generationInfo = {
          ...b.generationInfo,
          tokenUsage: {}
        }, b)), _.length && await g?.handleLLMNewToken(_[0].text), g?.handleLLMEnd({ generations: [_] }, void 0, void 0, void 0, { cached: !0 });
      } else
        return await g?.handleLLMError(m.reason, void 0, void 0, void 0, { cached: !0 }), Promise.reject(m.reason);
    }));
    const p = {
      generations: f,
      missingPromptIndices: d,
      startedRunManagers: u
    };
    return Object.defineProperty(p, Qi, {
      value: u ? { runIds: u?.map((m) => m.runId) } : void 0,
      configurable: !0
    }), p;
  }
  /**
  * Run the LLM on the given prompts and input, handling caching.
  */
  async generate(t, n, s) {
    if (!Array.isArray(t)) throw new Error("Argument 'prompts' is expected to be a string[]");
    let r;
    Array.isArray(n) ? r = { stop: n } : r = n;
    const [a, i] = this._separateRunnableConfigFromCallOptionsCompat(r);
    if (a.callbacks = a.callbacks ?? s, !this.cache) return this._generateUncached(t, i, a);
    const { cache: o } = this, c = this._getSerializedCacheKeyParametersForCall(i), { generations: l, missingPromptIndices: u, startedRunManagers: d } = await this._generateCached({
      prompts: t,
      cache: o,
      llmStringKey: c,
      parsedOptions: i,
      handledOptions: a,
      runId: a.runId
    });
    let h = {};
    if (u.length > 0) {
      const f = await this._generateUncached(u.map((p) => t[p]), i, a, d !== void 0 ? u.map((p) => d?.[p]) : void 0);
      await Promise.all(f.generations.map(async (p, m) => {
        const g = u[m];
        return l[g] = p, o.update(t[g], c, p);
      })), h = f.llmOutput ?? {};
    }
    return {
      generations: l,
      llmOutput: h
    };
  }
  /**
  * Get the identifying parameters of the LLM.
  */
  _identifyingParams() {
    return {};
  }
  _modelType() {
    return "base_llm";
  }
}, fi = class extends Sc {
  async _generate(e, t, n) {
    return { generations: await Promise.all(e.map((s, r) => this._call(s, {
      ...t,
      promptIndex: r
    }, n).then((a) => [{ text: a }]))) };
  }
};
const Ys = {
  openai: {
    package: "@langchain/openai",
    className: "ChatOpenAI"
  },
  anthropic: {
    package: "@langchain/anthropic",
    className: "ChatAnthropic"
  },
  azure_openai: {
    package: "@langchain/openai",
    className: "AzureChatOpenAI"
  },
  cohere: {
    package: "@langchain/cohere",
    className: "ChatCohere"
  },
  google: {
    package: "@langchain/google",
    className: "ChatGoogle"
  },
  "google-vertexai": {
    package: "@langchain/google-vertexai",
    className: "ChatVertexAI"
  },
  "google-vertexai-web": {
    package: "@langchain/google-vertexai-web",
    className: "ChatVertexAI"
  },
  "google-genai": {
    package: "@langchain/google-genai",
    className: "ChatGoogleGenerativeAI"
  },
  ollama: {
    package: "@langchain/ollama",
    className: "ChatOllama"
  },
  mistralai: {
    package: "@langchain/mistralai",
    className: "ChatMistralAI"
  },
  mistral: {
    package: "@langchain/mistralai",
    className: "ChatMistralAI"
  },
  groq: {
    package: "@langchain/groq",
    className: "ChatGroq"
  },
  bedrock: {
    package: "@langchain/aws",
    className: "ChatBedrockConverse"
  },
  aws: {
    package: "@langchain/aws",
    className: "ChatBedrockConverse"
  },
  deepseek: {
    package: "@langchain/deepseek",
    className: "ChatDeepSeek"
  },
  xai: {
    package: "@langchain/xai",
    className: "ChatXAI"
  },
  cerebras: {
    package: "@langchain/cerebras",
    className: "ChatCerebras"
  },
  fireworks: {
    package: "@langchain/fireworks",
    className: "ChatFireworks"
  },
  together: {
    package: "@langchain/together-ai",
    className: "ChatTogetherAI",
    hasCircularDependency: !0
  },
  perplexity: {
    package: "@langchain/perplexity",
    className: "ChatPerplexity"
  }
}, kc = Object.keys(Ys);
async function sm(e, t) {
  let n;
  if (t) n = Ys[t];
  else {
    const s = Object.entries(Ys).find(([, r]) => r.className === e);
    n = s ? s[1] : void 0;
  }
  if (n)
    try {
      return (await import(n.package))[n.className];
    } catch (s) {
      const r = s;
      if ("code" in r && r.code?.toString().includes("ERR_MODULE_NOT_FOUND") && "message" in r && typeof r.message == "string") {
        const a = (r.message.startsWith("Error: ") ? r.message.slice(7) : r.message).split("Cannot find package '")[1].split("'")[0];
        throw new Error(`Unable to import ${a}. Please install with \`npm install ${a}\` or \`pnpm install ${a}\``);
      }
      throw s;
    }
}
async function rm(e, t, n = {}) {
  const s = t || am(e);
  if (!s) throw new Error(`Unable to infer model provider for { model: ${e} }, please specify modelProvider directly.`);
  const r = Ys[s];
  if (!r) {
    const o = kc.join(", ");
    throw new Error(`Unsupported { modelProvider: ${s} }.

Supported model providers are: ${o}`);
  }
  const { modelProvider: a, ...i } = n;
  return new (await sm(r.className, s))({
    model: e,
    ...i
  });
}
function am(e) {
  return e.startsWith("gpt-3") || e.startsWith("gpt-4") || e.startsWith("gpt-5") || e.startsWith("o1") || e.startsWith("o3") || e.startsWith("o4") ? "openai" : e.startsWith("claude") ? "anthropic" : e.startsWith("command") ? "cohere" : e.startsWith("accounts/fireworks") ? "fireworks" : e.startsWith("gemini") ? "google-vertexai" : e.startsWith("amazon.") ? "bedrock" : e.startsWith("mistral") ? "mistralai" : e.startsWith("sonar") || e.startsWith("pplx") ? "perplexity" : void 0;
}
var lo = class Ns extends cs {
  _llmType() {
    return "chat_model";
  }
  lc_namespace = ["langchain", "chat_models"];
  _defaultConfig = {};
  /**
  * @default "any"
  */
  _configurableFields = "any";
  /**
  * @default ""
  */
  _configPrefix;
  /**
  * Methods which should be called after the model is initialized.
  * The key will be the method name, and the value will be the arguments.
  */
  _queuedMethodOperations = {};
  /** @internal */
  _modelInstanceCache = /* @__PURE__ */ new Map();
  /** @internal */
  _profile;
  constructor(t) {
    super(t), this._defaultConfig = t.defaultConfig ?? {}, t.configurableFields === "any" ? this._configurableFields = "any" : this._configurableFields = t.configurableFields ?? ["model", "modelProvider"], t.configPrefix ? this._configPrefix = t.configPrefix.endsWith("_") ? t.configPrefix : `${t.configPrefix}_` : this._configPrefix = "", this._queuedMethodOperations = t.queuedMethodOperations ?? this._queuedMethodOperations, this._profile = t.profile ?? void 0, this.metadata = {
      ...this.metadata,
      ls_integration: "langchain_init_chat_model"
    };
  }
  async _getModelInstance(t) {
    const n = this._getCacheKey(t), s = this._modelInstanceCache.get(n);
    if (s) return s;
    const r = {
      ...this._defaultConfig,
      ...this._modelParams(t)
    };
    let a = await rm(r.model, r.modelProvider, r);
    for (const [i, o] of Object.entries(this._queuedMethodOperations)) i in a && typeof a[i] == "function" && (a = await a[i](...o));
    return this._modelInstanceCache.set(n, a), a;
  }
  async _generate(t, n, s) {
    return (await this._getModelInstance(n))._generate(t, n ?? {}, s);
  }
  bindTools(t, n) {
    const s = { ...this._queuedMethodOperations };
    return s.bindTools = [t, n], new Ns({
      defaultConfig: this._defaultConfig,
      configurableFields: this._configurableFields,
      configPrefix: this._configPrefix,
      queuedMethodOperations: s
    });
  }
  withStructuredOutput = (t, ...n) => {
    const s = { ...this._queuedMethodOperations };
    return s.withStructuredOutput = [t, ...n], new Ns({
      defaultConfig: this._defaultConfig,
      configurableFields: this._configurableFields,
      configPrefix: this._configPrefix,
      queuedMethodOperations: s
    });
  };
  _modelParams(t) {
    const n = t?.configurable ?? {};
    let s = {};
    for (const [r, a] of Object.entries(n)) if (r.startsWith(this._configPrefix)) {
      const i = this._removePrefix(r, this._configPrefix);
      s[i] = a;
    }
    return this._configurableFields !== "any" && (s = Object.fromEntries(Object.entries(s).filter(([r]) => this._configurableFields.includes(r)))), s;
  }
  _removePrefix(t, n) {
    return t.startsWith(n) ? t.slice(n.length) : t;
  }
  /**
  * Bind config to a Runnable, returning a new Runnable.
  * @param {RunnableConfig | undefined} [config] - The config to bind.
  * @returns {RunnableBinding<RunInput, RunOutput, CallOptions>} A new RunnableBinding with the bound config.
  */
  withConfig(t) {
    const n = { ...t || {} }, s = this._modelParams(n), r = Object.fromEntries(Object.entries(n).filter(([a]) => a !== "configurable"));
    return r.configurable = Object.fromEntries(Object.entries(n.configurable || {}).filter(([a]) => this._configPrefix && !Object.keys(s).includes(this._removePrefix(a, this._configPrefix)))), new Ae({
      config: n,
      bound: new Ns({
        defaultConfig: {
          ...this._defaultConfig,
          ...s
        },
        configurableFields: Array.isArray(this._configurableFields) ? [...this._configurableFields] : this._configurableFields,
        configPrefix: this._configPrefix,
        queuedMethodOperations: this._queuedMethodOperations
      })
    });
  }
  async invoke(t, n) {
    const s = await this._getModelInstance(n), r = ct(n);
    return s.invoke(t, r);
  }
  async stream(t, n) {
    const s = new yf({
      generator: await (await this._getModelInstance(n)).stream(t, n),
      config: n
    });
    return await s.setup, Kn.fromAsyncGenerator(s);
  }
  async batch(t, n, s) {
    return super.batch(t, n, s);
  }
  async *transform(t, n) {
    const s = await this._getModelInstance(n), r = ct(n);
    yield* s.transform(t, r);
  }
  async *streamLog(t, n, s) {
    const r = await this._getModelInstance(n), a = ct(n);
    yield* r.streamLog(t, a, {
      ...s,
      _schemaFormat: "original",
      includeNames: s?.includeNames,
      includeTypes: s?.includeTypes,
      includeTags: s?.includeTags,
      excludeNames: s?.excludeNames,
      excludeTypes: s?.excludeTypes,
      excludeTags: s?.excludeTags
    });
  }
  streamEvents(t, n, s) {
    if (n?.version === "v1" || n?.version === "v2") {
      const i = this, o = n;
      async function* c() {
        const l = await i._getModelInstance(o), u = {
          ...ct(o),
          version: o.version,
          ...o.encoding !== void 0 ? { encoding: o.encoding } : {}
        };
        let d;
        o.version === "v1" && o.encoding === "text/event-stream" || o.version === "v1" || o.version === "v2" && o.encoding, d = l.streamEvents(t, u, s);
        for await (const h of d) yield h;
      }
      return Kn.fromAsyncGenerator(c());
    }
    const r = this;
    async function* a() {
      const i = await r._getModelInstance(n), o = ct(n);
      yield* i.streamEvents(t, o);
    }
    return new ai(a());
  }
  /**
  * Return profiling information for the model.
  *
  * @returns {ModelProfile} An object describing the model's capabilities and constraints
  */
  get profile() {
    if (this._profile) return this._profile;
    const t = this._getCacheKey({});
    return this._modelInstanceCache.get(t)?.profile ?? {};
  }
  /** @internal */
  _getCacheKey(t) {
    let n = t ?? {};
    if (n.configurable) {
      const { configurable: s } = n, r = {};
      for (const [a, i] of Object.entries(s)) a.startsWith("__pregel_") || (r[a] = i);
      n = {
        ...n,
        configurable: r
      };
    }
    return JSON.stringify(n);
  }
};
async function im(e, t) {
  let { configurableFields: n, configPrefix: s, modelProvider: r, profile: a, ...i } = {
    configPrefix: ""
  };
  if (r === void 0 && e?.includes(":")) {
    const [u, ...d] = e.split(":"), h = d.length === 0 ? [u] : [u, d.join(":")];
    kc.includes(h[0]) && ([r, e] = h);
  }
  let o = Array.isArray(n) ? [...n] : n;
  !e && o === void 0 && (o = ["model", "modelProvider"]), s && o === void 0 && console.warn(`{ configPrefix: ${s} } has been set but no fields are configurable. Set { configurableFields: [...] } to specify the model params that are configurable.`);
  const c = { ...i };
  let l;
  return o === void 0 ? l = new lo({
    defaultConfig: {
      ...c,
      model: e,
      modelProvider: r
    },
    configPrefix: s,
    profile: a
  }) : (e && (c.model = e), r && (c.modelProvider = r), l = new lo({
    defaultConfig: c,
    configPrefix: s,
    configurableFields: o,
    profile: a
  })), await l._getModelInstance(), l;
}
function om(e) {
  const { name: t, description: n, schema: s } = e, r = hi(async (i, o) => {
    const { interrupt: c } = await Promise.resolve().then(() => Nv);
    return c({
      type: "tool",
      toolCall: {
        id: o?.toolCall?.id,
        name: t,
        args: i
      }
    });
  }, {
    name: t,
    description: n,
    schema: s,
    metadata: { headlessTool: !0 }
  }), a = Object.assign(r, { implement: (i) => ({
    tool: a,
    execute: i
  }) });
  return a;
}
const cm = ((e, t) => typeof e != "function" ? om(e) : hi(e, t));
function lm() {
  le.initializeGlobalInstance(new yp());
}
function uo(e, t) {
  if (e != null) {
    if (typeof e != "number" || Number.isNaN(e) || e <= 0) throw new Error(`${t} must be greater than 0`);
    return e;
  }
}
function Zn(e) {
  if (e == null) return;
  const t = typeof e == "number" ? { runTimeout: e } : e, n = t.refreshOn ?? "auto";
  if (n !== "auto" && n !== "heartbeat") throw new Error('refreshOn must be "auto" or "heartbeat"');
  const s = uo(t.runTimeout, "runTimeout"), r = uo(t.idleTimeout, "idleTimeout");
  if (!(s === void 0 && r === void 0))
    return {
      runTimeout: s,
      idleTimeout: r,
      refreshOn: n
    };
}
const te = "__start__", D = "__end__", bt = "__input__", hs = "__error__", pi = "__error_source_node__", Ir = "__pregel_ns_writes";
function um() {
  const e = typeof process < "u" ? process.env?.LANGGRAPH_DELTA_MAX_SUPERSTEPS_SINCE_SNAPSHOT : void 0;
  if (e !== void 0 && e !== "") {
    const t = Number.parseInt(e, 10);
    if (Number.isFinite(t) && t > 0) return t;
  }
  return 5e3;
}
const De = "__pregel_send", qt = "__pregel_call", Qe = "__pregel_read", Ke = "__pregel_checkpointer", Vn = "__pregel_resuming", Bn = "__pregel_task_id", mi = "__pregel_stream", hm = "__pregel_resume_value", Hn = "__pregel_resume_map", et = "__pregel_scratchpad", mn = "__pregel_previous", dm = "__pregel_durability", Dt = "checkpoint_id", Ge = "checkpoint_ns", fm = "__pregel_node_finished", la = "__pregel_node_error", Te = "checkpoint_map", ua = "__pregel_replay_state", pm = "__pregel_abort_signals", ne = "__interrupt__", tt = "__resume__", gi = "__no_writes__", gr = "__return__", gn = "__previous__", we = "langsmith:hidden", ho = "__self__", wn = "__pregel_tasks", Oe = "__pregel_push", ha = "__pregel_pull", Ie = "00000000-0000-0000-0000-000000000000", mm = [
  we,
  bt,
  ne,
  tt,
  hs,
  pi,
  gi,
  De,
  Qe,
  Ke,
  dm,
  mi,
  Vn,
  Bn,
  qt,
  hm,
  et,
  mn,
  Te,
  Ge,
  Dt,
  ua
], da = /* @__PURE__ */ Symbol.for("langgraph.command");
var Cc = class {
  [da];
  constructor(e) {
    this[da] = e;
  }
};
function fa(e) {
  const t = e;
  return t != null && typeof t.node == "string" && t.args !== void 0;
}
var de = class {
  lg_name = "Send";
  node;
  args;
  /**
  * Optional per-task timeout policy that overrides the target node's timeout
  * for this specific pushed task. A bare number is treated as a hard
  * `runTimeout` (in milliseconds).
  */
  timeout;
  constructor(e, t, n) {
    this.node = e, this.args = Yn(t), this.timeout = Zn(n?.timeout);
  }
  toJSON() {
    return {
      lg_name: this.lg_name,
      node: this.node,
      args: this.args,
      timeout: this.timeout
    };
  }
};
function Me(e) {
  return e instanceof de;
}
const St = "__overwrite__";
var gm = class {
  lg_name = "Overwrite";
  [St];
  constructor(e) {
    this[St] = e;
  }
  get value() {
    return this[St];
  }
  toJSON() {
    return { [St]: this[St] };
  }
  static isInstance(e) {
    return !e || typeof e != "object" ? !1 : "__overwrite__" in e || "lg_name" in e && e.lg_name === "Overwrite";
  }
};
function Zt(e) {
  if (typeof e == "object" && e !== null) {
    if ("__overwrite__" in e) return [!0, e[St]];
    const t = e;
    if (t.type === "__overwrite__" && "value" in t) return [!0, t.value];
  }
  return [!1, void 0];
}
function Xs(e) {
  return Zt(e)[0];
}
function yr(e) {
  return !e || typeof e != "object" || !("__interrupt__" in e) ? !1 : Array.isArray(e[ne]);
}
var ee = class extends Cc {
  lg_name = "Command";
  lc_direct_tool_output = !0;
  /**
  * Graph to send the command to. Supported values are:
  *   - None: the current graph (default)
  *   - The specific name of the graph to send the command to
  *   - {@link Command.PARENT}: closest parent graph (only supported when returned from a node in a subgraph)
  */
  graph;
  /**
  * Update to apply to the graph's state as a result of executing the node that is returning the command.
  * Written to the state as if the node had simply returned this value instead of the Command object.
  */
  update;
  /**
  * Value to resume execution with. To be used together with {@link interrupt}.
  */
  resume;
  /**
  * Can be one of the following:
  *   - name of the node to navigate to next (any node that belongs to the specified `graph`)
  *   - sequence of node names to navigate to next
  *   - {@link Send} object (to execute a node with the exact input provided in the {@link Send} object)
  *   - sequence of {@link Send} objects
  */
  goto = [];
  static PARENT = "__parent__";
  constructor(e) {
    super(e), this.resume = e.resume, this.graph = e.graph, this.update = e.update, e.goto && (this.goto = Array.isArray(e.goto) ? Yn(e.goto) : [Yn(e.goto)]);
  }
  /**
  * Convert the update field to a list of {@link PendingWrite} tuples
  * @returns List of {@link PendingWrite} tuples of the form `[channelKey, value]`.
  * @internal
  */
  _updateAsTuples() {
    return this.update && typeof this.update == "object" && !Array.isArray(this.update) ? Object.entries(this.update) : Array.isArray(this.update) && this.update.every((e) => Array.isArray(e) && e.length === 2 && typeof e[0] == "string") ? this.update : [["__root__", this.update]];
  }
  toJSON() {
    let e;
    return typeof this.goto == "string" ? e = this.goto : Me(this.goto) ? e = this.goto.toJSON() : e = this.goto?.map((t) => typeof t == "string" ? t : t.toJSON()), {
      lg_name: this.lg_name,
      update: this.update,
      resume: this.resume,
      goto: e
    };
  }
};
function Y(e) {
  return typeof e != "object" || e == null ? !1 : "lg_name" in e && e.lg_name === "Command";
}
function ym(e) {
  const t = Object.getPrototypeOf(e);
  return t === Object.prototype || t === null;
}
function Yn(e, t = /* @__PURE__ */ new Map()) {
  if (e != null && typeof e == "object") {
    if (t.has(e)) return t.get(e);
    let n;
    if (Array.isArray(e))
      n = [], t.set(e, n), e.forEach((s, r) => {
        n[r] = Yn(s, t);
      });
    else if (e instanceof ee || e instanceof de || !ym(e))
      n = e, t.set(e, n);
    else if (Y(e))
      n = new ee(e), t.set(e, n);
    else if (fa(e))
      n = new de(e.node, e.args, e.timeout !== void 0 ? { timeout: e.timeout } : void 0), t.set(e, n);
    else if ("lc_serializable" in e && e.lc_serializable)
      n = e, t.set(e, n);
    else {
      n = {}, t.set(e, n);
      for (const [s, r] of Object.entries(e)) n[s] = Yn(r, t);
    }
    return n;
  }
  return e;
}
var Re = class extends Error {
  lc_error_code;
  constructor(e, t) {
    let n = e ?? "";
    t?.lc_error_code && (n = `${n}

Troubleshooting URL: https://docs.langchain.com/oss/javascript/langgraph/${t.lc_error_code}/
`), super(n), this.lc_error_code = t?.lc_error_code;
  }
}, _r = class extends Re {
  get is_bubble_up() {
    return !0;
  }
}, Ec = class extends Re {
  constructor(e, t) {
    super(e, t), this.name = "GraphRecursionError";
  }
  static get unminifiable_name() {
    return "GraphRecursionError";
  }
}, Un = class extends Re {
  constructor(e, t) {
    super(e, t), this.name = "GraphValueError";
  }
  static get unminifiable_name() {
    return "GraphValueError";
  }
}, yi = class extends _r {
  reason;
  constructor(e = "shutdown", t) {
    super(`Graph drained: ${e}`, t), this.name = "GraphDrained", this.reason = e;
  }
  static get unminifiable_name() {
    return "GraphDrained";
  }
};
function pa(e) {
  return e !== void 0 && e.name === yi.unminifiable_name;
}
var Jt = class extends _r {
  interrupts;
  constructor(e, t) {
    super(JSON.stringify(e, null, 2), t), this.name = "GraphInterrupt", this.interrupts = e ?? [];
  }
  static get unminifiable_name() {
    return "GraphInterrupt";
  }
}, _i = class extends Jt {
  constructor(e, t) {
    super([{ value: e }], t), this.name = "NodeInterrupt";
  }
  static get unminifiable_name() {
    return "NodeInterrupt";
  }
}, wi = class {
  /** Name of the node whose execution failed. */
  node;
  /** Error thrown by the failed node. */
  error;
  constructor(e, t) {
    this.node = e, this.error = t;
  }
  static get unminifiable_name() {
    return "NodeError";
  }
};
function _m(e) {
  return e != null && typeof e == "object" && e.constructor != null && e.constructor.unminifiable_name === wi.unminifiable_name;
}
var vi = class extends _r {
  command;
  constructor(e) {
    super(), this.name = "ParentCommand", this.command = e;
  }
  static get unminifiable_name() {
    return "ParentCommand";
  }
};
function Tc(e) {
  return e !== void 0 && e.name === vi.unminifiable_name;
}
function Ht(e) {
  return e !== void 0 && e.is_bubble_up === !0;
}
function Et(e) {
  return e !== void 0 && [Jt.unminifiable_name, _i.unminifiable_name].includes(e.name);
}
var bi = class extends Re {
  /** Name of the node/task that timed out. */
  node;
  /** Which timeout fired: a hard `"run"` cap or a progress-resetting `"idle"` cap. */
  kind;
  /** The value (ms) of the timeout that fired (`runTimeout` or `idleTimeout`). */
  timeout;
  /** Elapsed time (ms) since the attempt started, at the moment the timeout fired. */
  elapsed;
  /** Configured run timeout (ms), if any. */
  runTimeout;
  /** Configured idle timeout (ms), if any. */
  idleTimeout;
  constructor(e, t) {
    const { node: n, elapsed: s, kind: r, runTimeout: a, idleTimeout: i } = e;
    let o, c;
    if (r === "idle") {
      if (i === void 0) throw new Error("idleTimeout is required when kind='idle'");
      c = i, o = `Node "${n}" exceeded its idle timeout of ${i}ms without making progress (elapsed: ${s}ms).`;
    } else {
      if (a === void 0) throw new Error("runTimeout is required when kind='run'");
      c = a, o = `Node "${n}" exceeded its run timeout of ${a}ms (elapsed: ${s}ms).`;
    }
    super(o, t), this.name = "NodeTimeoutError", this.node = n, this.kind = r, this.timeout = c, this.elapsed = s, this.runTimeout = a, this.idleTimeout = i;
  }
  static get unminifiable_name() {
    return "NodeTimeoutError";
  }
};
function wm(e) {
  return e !== void 0 && e.name === bi.unminifiable_name;
}
var ma = class extends Re {
  constructor(e, t) {
    super(e, t), this.name = "EmptyInputError";
  }
  static get unminifiable_name() {
    return "EmptyInputError";
  }
}, re = class extends Re {
  constructor(e, t) {
    const n = Error.stackTraceLimit;
    Error.stackTraceLimit = 0, super(e, t), Error.stackTraceLimit = n, this.name = "EmptyChannelError";
  }
  static get unminifiable_name() {
    return "EmptyChannelError";
  }
}, z = class extends Re {
  constructor(e, t) {
    super(e, t), this.name = "InvalidUpdateError";
  }
  static get unminifiable_name() {
    return "InvalidUpdateError";
  }
}, vm = class extends Re {
  constructor(e, t) {
    super(e, t), this.name = "MultipleSubgraphError";
  }
  static get unminifiable_name() {
    return "MultipleSubgraphError";
  }
}, xc = class extends Re {
  constructor(e, t) {
    super(e, t), this.name = "UnreachableNodeError";
  }
  static get unminifiable_name() {
    return "UnreachableNodeError";
  }
}, bm = class extends Re {
  constructor(e, t) {
    super(e, t), this.name = "RemoteException";
  }
  static get unminifiable_name() {
    return "RemoteException";
  }
}, Rs = class extends Re {
  /**
  * Create a new StateGraphInputError.
  * @param message - Optional custom error message.
  * @param fields - Optional additional error fields.
  */
  constructor(e, t) {
    super(e, t), this.name = "StateGraphInputError", this.message = "Invalid StateGraph input. Make sure to pass a valid StateDefinition, Annotation.Root, or Zod schema.";
  }
  /**
  * The unminifiable (static, human-readable) error name for this error class.
  */
  static get unminifiable_name() {
    return "StateGraphInputError";
  }
};
const Sm = () => (globalThis[/* @__PURE__ */ Symbol.for("LG_CHECKPOINT_SEEN_NS_SET")] === void 0 && (globalThis[/* @__PURE__ */ Symbol.for("LG_CHECKPOINT_SEEN_NS_SET")] = /* @__PURE__ */ new Set()), globalThis[/* @__PURE__ */ Symbol.for("LG_CHECKPOINT_SEEN_NS_SET")]);
let Ar = 0, On = 0;
function Mc(e) {
  let t = Date.now();
  return t <= Ar ? (On += 1, On >= 1e4 && (On = 0, t = Ar + 1)) : On = 0, Ar = t, _f({
    clockseq: e,
    msecs: t,
    nsecs: On
  });
}
function Ut(e, t) {
  const n = t.replace(/-/g, "").match(/.{2}/g).map((s) => parseInt(s, 16));
  return ra(e, new Uint8Array(n));
}
const Or = "__pregel_tasks", km = "__error__", $s = "__scheduled__", Cm = "__interrupt__", Em = "__resume__";
var Si = class {
  /** Marker used for structural detection across module/realm boundaries. */
  lg_name = "DeltaSnapshot";
  value;
  constructor(e) {
    this.value = e;
  }
};
function Tm(e) {
  return e != null && typeof e == "object" && e.lg_name === "DeltaSnapshot";
}
var fo = "[...]", xm = "[Circular]", Qs = [], dn = [];
function Mm() {
  return {
    depthLimit: Number.MAX_SAFE_INTEGER,
    edgesLimit: Number.MAX_SAFE_INTEGER
  };
}
function Im(e, t, n, s) {
  typeof s > "u" && (s = Mm()), ga(e, "", 0, [], void 0, 0, s);
  var r;
  try {
    dn.length === 0 ? r = JSON.stringify(e, t, n) : r = JSON.stringify(e, Am(t), n);
  } catch {
    return JSON.stringify("[unable to serialize, circular reference is too complex to analyze]");
  } finally {
    for (; Qs.length !== 0; ) {
      var a = Qs.pop();
      a.length === 4 ? Object.defineProperty(a[0], a[1], a[3]) : a[0][a[1]] = a[2];
    }
  }
  return r;
}
function Pr(e, t, n, s) {
  var r = Object.getOwnPropertyDescriptor(s, n);
  r.get !== void 0 ? r.configurable ? (Object.defineProperty(s, n, { value: e }), Qs.push([
    s,
    n,
    t,
    r
  ])) : dn.push([
    t,
    n,
    e
  ]) : (s[n] = e, Qs.push([
    s,
    n,
    t
  ]));
}
function ga(e, t, n, s, r, a, i) {
  a += 1;
  var o;
  if (typeof e == "object" && e !== null) {
    for (o = 0; o < s.length; o++) if (s[o] === e) {
      Pr(xm, e, t, r);
      return;
    }
    if (typeof i.depthLimit < "u" && a > i.depthLimit) {
      Pr(fo, e, t, r);
      return;
    }
    if (typeof i.edgesLimit < "u" && n + 1 > i.edgesLimit) {
      Pr(fo, e, t, r);
      return;
    }
    if (s.push(e), Array.isArray(e)) for (o = 0; o < e.length; o++) ga(e[o], o, o, s, e, a, i);
    else {
      var c = Object.keys(e);
      for (o = 0; o < c.length; o++) {
        var l = c[o];
        ga(e[l], l, o, s, e, a, i);
      }
    }
    s.pop();
  }
}
function Am(e) {
  return e = typeof e < "u" ? e : function(t, n) {
    return n;
  }, function(t, n) {
    if (dn.length > 0) for (var s = 0; s < dn.length; s++) {
      var r = dn[s];
      if (r[1] === t && r[0] === n) {
        n = r[2], dn.splice(s, 1);
        break;
      }
    }
    return e.call(this, t, n);
  };
}
const Om = [];
var Pm = /* @__PURE__ */ F({}), Nm = /* @__PURE__ */ F({}), Rm = /* @__PURE__ */ F({
  BaseChatMessageHistory: () => Ic,
  BaseListChatMessageHistory: () => ki,
  InMemoryChatMessageHistory: () => $m
}), Ic = class extends xn {
  /**
  * Add a list of messages.
  *
  * Implementations should override this method to handle bulk addition of messages
  * in an efficient manner to avoid unnecessary round-trips to the underlying store.
  *
  * @param messages - A list of BaseMessage objects to store.
  */
  async addMessages(e) {
    for (const t of e) await this.addMessage(t);
  }
}, ki = class extends xn {
  /**
  * This is a convenience method for adding a human message string to the store.
  * Please note that this is a convenience method. Code should favor the
  * bulk addMessages interface instead to save on round-trips to the underlying
  * persistence layer.
  * This method may be deprecated in a future release.
  */
  addUserMessage(e) {
    return this.addMessage(new $t(e));
  }
  /**
  * This is a convenience method for adding an AI message string to the store.
  * Please note that this is a convenience method. Code should favor the bulk
  * addMessages interface instead to save on round-trips to the underlying
  * persistence layer.
  * This method may be deprecated in a future release.
  */
  addAIMessage(e) {
    return this.addMessage(new U(e));
  }
  /**
  * Add a list of messages.
  *
  * Implementations should override this method to handle bulk addition of messages
  * in an efficient manner to avoid unnecessary round-trips to the underlying store.
  *
  * @param messages - A list of BaseMessage objects to store.
  */
  async addMessages(e) {
    for (const t of e) await this.addMessage(t);
  }
  /**
  * Remove all messages from the store.
  */
  clear() {
    throw new Error("Not implemented.");
  }
}, $m = class extends ki {
  lc_namespace = [
    "langchain",
    "stores",
    "message",
    "in_memory"
  ];
  messages = [];
  constructor(e) {
    super(...arguments), this.messages = e ?? [];
  }
  /**
  * Method to get all the messages stored in the ChatMessageHistory
  * instance.
  * @returns Array of stored BaseMessage instances.
  */
  async getMessages() {
    return this.messages;
  }
  /**
  * Method to add a new message to the ChatMessageHistory instance.
  * @param message The BaseMessage instance to add.
  * @returns A promise that resolves when the message has been added.
  */
  async addMessage(e) {
    this.messages.push(e);
  }
  /**
  * Method to clear all the messages from the ChatMessageHistory instance.
  * @returns A promise that resolves when all messages have been cleared.
  */
  async clear() {
    this.messages = [];
  }
}, It = class {
  pageContent;
  metadata;
  /**
  * An optional identifier for the document.
  *
  * Ideally this should be unique across the document collection and formatted
  * as a UUID, but this will not be enforced.
  */
  id;
  constructor(e) {
    this.pageContent = e.pageContent !== void 0 ? e.pageContent.toString() : "", this.metadata = e.metadata ?? {}, this.id = e.id;
  }
}, Ac = class extends ae {
  lc_namespace = [
    "langchain_core",
    "documents",
    "transformers"
  ];
  /**
  * Method to invoke the document transformation. This method calls the
  * transformDocuments method with the provided input.
  * @param input The input documents to be transformed.
  * @param _options Optional configuration object to customize the behavior of callbacks.
  * @returns A Promise that resolves to the transformed documents.
  */
  invoke(e, t) {
    return this.transformDocuments(e);
  }
}, jm = class extends Ac {
  async transformDocuments(e) {
    const t = [];
    for (const n of e) {
      const s = await this._transformDocument(n);
      t.push(s);
    }
    return t;
  }
}, Lm = /* @__PURE__ */ F({
  BaseDocumentTransformer: () => Ac,
  Document: () => It,
  MappingDocumentTransformer: () => jm
}), Dm = /* @__PURE__ */ F({ BaseDocumentLoader: () => Oc }), Oc = class {
}, Fm = /* @__PURE__ */ F({ LangSmithLoader: () => Vm }), Vm = class extends Oc {
  datasetId;
  datasetName;
  exampleIds;
  asOf;
  splits;
  inlineS3Urls;
  offset;
  limit;
  metadata;
  filter;
  contentKey;
  formatContent;
  client;
  constructor(e) {
    if (super(), e.client && e.clientConfig) throw new Error("client and clientConfig cannot both be provided.");
    this.client = e.client ?? new wf(e?.clientConfig), this.contentKey = e.contentKey ? e.contentKey.split(".") : [], this.formatContent = e.formatContent ?? Bm, this.datasetId = e.datasetId, this.datasetName = e.datasetName, this.exampleIds = e.exampleIds, this.asOf = e.asOf, this.splits = e.splits, this.inlineS3Urls = e.inlineS3Urls, this.offset = e.offset, this.limit = e.limit, this.metadata = e.metadata, this.filter = e.filter;
  }
  async load() {
    const e = [];
    for await (const t of this.client.listExamples({
      datasetId: this.datasetId,
      datasetName: this.datasetName,
      exampleIds: this.exampleIds,
      asOf: this.asOf,
      splits: this.splits,
      inlineS3Urls: this.inlineS3Urls,
      offset: this.offset,
      limit: this.limit,
      metadata: this.metadata,
      filter: this.filter
    })) {
      let n = t.inputs;
      for (const a of this.contentKey) n = n[a];
      const s = this.formatContent(n), r = t;
      ["created_at", "modified_at"].forEach((a) => {
        a in r && typeof r[a] == "object" && (r[a] = r[a].toString());
      }), e.push({
        pageContent: s,
        metadata: r
      });
    }
    return e;
  }
};
function Bm(e) {
  if (typeof e == "string") return e;
  try {
    return JSON.stringify(e, null, 2);
  } catch {
    return String(e);
  }
}
var Ci = class extends xn {
  lc_namespace = [
    "langchain_core",
    "example_selectors",
    "base"
  ];
}, Pc = class {
  /**
  * Asynchronous version of `getPrompt` that also accepts an options object
  * for partial variables.
  * @param llm The language model for which to get a prompt.
  * @param options Optional object for partial variables.
  * @returns A Promise that resolves to a prompt template.
  */
  async getPromptAsync(e, t) {
    return this.getPrompt(e).partial(t?.partialVariables ?? {});
  }
}, Hm = class extends Pc {
  defaultPrompt;
  conditionals;
  constructor(e, t = []) {
    super(), this.defaultPrompt = e, this.conditionals = t;
  }
  /**
  * Method that selects a prompt based on a set of conditions. If none of
  * the conditions are met, it returns the default prompt.
  * @param llm The language model for which to get a prompt.
  * @returns A prompt template.
  */
  getPrompt(e) {
    for (const [t, n] of this.conditionals) if (t(e)) return n;
    return this.defaultPrompt;
  }
};
function Um(e) {
  return e._modelType() === "base_llm";
}
function Wm(e) {
  return e._modelType() === "base_chat_model";
}
function po(e) {
  return e.split(/\n| /).length;
}
var zm = class Nc extends Ci {
  examples = [];
  examplePrompt;
  getTextLength = po;
  maxLength = 2048;
  exampleTextLengths = [];
  constructor(t) {
    super(t), this.examplePrompt = t.examplePrompt, this.maxLength = t.maxLength ?? 2048, this.getTextLength = t.getTextLength ?? po;
  }
  /**
  * Adds an example to the list of examples and calculates its length.
  * @param example The example to be added.
  * @returns Promise that resolves when the example has been added and its length calculated.
  */
  async addExample(t) {
    this.examples.push(t);
    const n = await this.examplePrompt.format(t);
    this.exampleTextLengths.push(this.getTextLength(n));
  }
  /**
  * Calculates the lengths of the examples.
  * @param v Array of lengths of the examples.
  * @param values Instance of LengthBasedExampleSelector.
  * @returns Promise that resolves with an array of lengths of the examples.
  */
  async calculateExampleTextLengths(t, n) {
    if (t.length > 0) return t;
    const { examples: s, examplePrompt: r } = n;
    return (await Promise.all(s.map((a) => r.format(a)))).map((a) => this.getTextLength(a));
  }
  /**
  * Selects examples until the total length of the selected examples
  * reaches the maxLength.
  * @param inputVariables The input variables for the examples.
  * @returns Promise that resolves with an array of selected examples.
  */
  async selectExamples(t) {
    const n = Object.values(t).join(" ");
    let s = this.maxLength - this.getTextLength(n), r = 0;
    const a = [];
    for (; s > 0 && r < this.examples.length; ) {
      const i = s - this.exampleTextLengths[r];
      if (i < 0) break;
      a.push(this.examples[r]), s = i, r += 1;
    }
    return a;
  }
  /**
  * Creates a new instance of LengthBasedExampleSelector and adds a list of
  * examples to it.
  * @param examples Array of examples to be added.
  * @param args Input parameters for the LengthBasedExampleSelector.
  * @returns Promise that resolves with a new instance of LengthBasedExampleSelector with the examples added.
  */
  static async fromExamples(t, n) {
    const s = new Nc(n);
    return await Promise.all(t.map((r) => s.addExample(r))), s;
  }
};
function Nr(e) {
  return Object.keys(e).sort().map((t) => e[t]);
}
var Gm = class Rc extends Ci {
  vectorStoreRetriever;
  exampleKeys;
  inputKeys;
  constructor(t) {
    if (super(t), this.exampleKeys = t.exampleKeys, this.inputKeys = t.inputKeys, t.vectorStore !== void 0) this.vectorStoreRetriever = t.vectorStore.asRetriever({
      k: t.k ?? 4,
      filter: t.filter
    });
    else if (t.vectorStoreRetriever) this.vectorStoreRetriever = t.vectorStoreRetriever;
    else throw new Error('You must specify one of "vectorStore" and "vectorStoreRetriever".');
  }
  /**
  * Method that adds a new example to the vectorStore. The example is
  * converted to a string and added to the vectorStore as a document.
  * @param example The example to be added to the vectorStore.
  * @returns Promise that resolves when the example has been added to the vectorStore.
  */
  async addExample(t) {
    const n = Nr((this.inputKeys ?? Object.keys(t)).reduce((s, r) => ({
      ...s,
      [r]: t[r]
    }), {})).join(" ");
    await this.vectorStoreRetriever.addDocuments([new It({
      pageContent: n,
      metadata: t
    })]);
  }
  /**
  * Method that selects which examples to use based on semantic similarity.
  * It performs a similarity search in the vectorStore using the input
  * variables and returns the examples with the highest similarity.
  * @param inputVariables The input variables used for the similarity search.
  * @returns Promise that resolves with an array of the selected examples.
  */
  async selectExamples(t) {
    const n = Nr((this.inputKeys ?? Object.keys(t)).reduce((r, a) => ({
      ...r,
      [a]: t[a]
    }), {})).join(" "), s = (await this.vectorStoreRetriever.invoke(n)).map((r) => r.metadata);
    return this.exampleKeys ? s.map((r) => this.exampleKeys.reduce((a, i) => ({
      ...a,
      [i]: r[i]
    }), {})) : s;
  }
  /**
  * Static method that creates a new instance of
  * SemanticSimilarityExampleSelector. It takes a list of examples, an
  * instance of Embeddings, a VectorStore class, and an options object as
  * parameters. It converts the examples to strings, creates a VectorStore
  * from the strings and the embeddings, and returns a new
  * SemanticSimilarityExampleSelector with the created VectorStore and the
  * options provided.
  * @param examples The list of examples to be used.
  * @param embeddings The instance of Embeddings to be used.
  * @param vectorStoreCls The VectorStore class to be used.
  * @param options The options object for the SemanticSimilarityExampleSelector.
  * @returns Promise that resolves with a new instance of SemanticSimilarityExampleSelector.
  */
  static async fromExamples(t, n, s, r = {}) {
    const a = r.inputKeys ?? null, i = t.map((o) => Nr(a ? a.reduce((c, l) => ({
      ...c,
      [l]: o[l]
    }), {}) : o).join(" "));
    return new Rc({
      vectorStore: await s.fromTexts(i, t, n, r),
      k: r.k ?? 4,
      exampleKeys: r.exampleKeys,
      inputKeys: r.inputKeys
    });
  }
}, Jm = /* @__PURE__ */ F({
  BaseExampleSelector: () => Ci,
  BasePromptSelector: () => Pc,
  ConditionalPromptSelector: () => Hm,
  LengthBasedExampleSelector: () => zm,
  SemanticSimilarityExampleSelector: () => Gm,
  isChatModel: () => Wm,
  isLLM: () => Um
});
const ya = "10f90ea3-90a4-4962-bf75-83a0f3c1c62a";
var Km = class extends xn {
  lc_namespace = ["langchain", "recordmanagers"];
}, $c = class {
  uid;
  hash_;
  contentHash;
  metadataHash;
  pageContent;
  metadata;
  keyEncoder = lc;
  constructor(e) {
    this.uid = e.uid, this.pageContent = e.pageContent, this.metadata = e.metadata;
  }
  makeDefaultKeyEncoder(e) {
    this.keyEncoder = e;
  }
  calculateHashes() {
    const e = [
      "hash_",
      "content_hash",
      "metadata_hash"
    ];
    for (const n of e) if (n in this.metadata) throw new Error(`Metadata cannot contain key ${n} as it is reserved for internal use. Restricted keys: [${e.join(", ")}]`);
    const t = this._hashStringToUUID(this.pageContent);
    try {
      const n = this._hashNestedDictToUUID(this.metadata);
      this.contentHash = t, this.metadataHash = n;
    } catch (n) {
      throw new Error(`Failed to hash metadata: ${n}. Please use a dict that can be serialized using json.`);
    }
    this.hash_ = this._hashStringToUUID(this.contentHash + this.metadataHash), this.uid || (this.uid = this.hash_);
  }
  toDocument() {
    return new It({
      pageContent: this.pageContent,
      metadata: this.metadata
    });
  }
  static fromDocument(e, t) {
    const n = new this({
      pageContent: e.pageContent,
      metadata: e.metadata,
      uid: t || e.uid
    });
    return n.calculateHashes(), n;
  }
  _hashStringToUUID(e) {
    return ra(this.keyEncoder(e), ya);
  }
  _hashNestedDictToUUID(e) {
    const t = JSON.stringify(e, Object.keys(e).sort());
    return ra(this.keyEncoder(t), ya);
  }
};
function jc(e, t) {
  const n = [];
  let s = [];
  return t.forEach((r) => {
    s.push(r), s.length >= e && (n.push(s), s = []);
  }), s.length > 0 && n.push(s), n;
}
function Lc(e) {
  const t = /* @__PURE__ */ new Set(), n = [];
  for (const s of e) {
    if (!s.hash_) throw new Error("Hashed document does not have a hash");
    t.has(s.hash_) || (t.add(s.hash_), n.push(s));
  }
  return n;
}
function Dc(e) {
  if (e === null) return (t) => null;
  if (typeof e == "string") return (t) => t.metadata[e];
  if (typeof e == "function") return e;
  throw new Error(`sourceIdKey should be null, a string or a function, got ${typeof e}`);
}
const Fc = (e) => "load" in e && typeof e.load == "function" && "loadAndSplit" in e && typeof e.loadAndSplit == "function";
async function qm(e) {
  const { docsSource: t, recordManager: n, vectorStore: s, options: r } = e, { batchSize: a = 100, cleanup: i, sourceIdKey: o, cleanupBatchSize: c = 1e3, forceUpdate: l = !1 } = r ?? {};
  if (i === "incremental" && !o) throw new Error("sourceIdKey is required when cleanup mode is incremental. Please provide through 'options.sourceIdKey'.");
  const u = Fc(t) ? await t.load() : t, d = Dc(o ?? null), h = await n.getTime();
  let f = 0, p = 0, m = 0, g = 0;
  const y = jc(a ?? 100, u);
  for (const _ of y) {
    const b = Lc(_.map((A) => $c.fromDocument(A))), v = b.map((A) => d(A));
    i === "incremental" && b.forEach((A, B) => {
      if (v[B] === null) throw new Error("sourceIdKey must be provided when cleanup is incremental");
    });
    const M = await n.exists(b.map((A) => A.uid)), I = [], w = [], C = [], O = /* @__PURE__ */ new Set();
    if (b.forEach((A, B) => {
      if (M[B]) if (l) O.add(A.uid);
      else {
        C.push(A.uid);
        return;
      }
      I.push(A.uid), w.push(A.toDocument());
    }), C.length > 0 && (await n.update(C, { timeAtLeast: h }), g += C.length), w.length > 0 && (await s.addDocuments(w, { ids: I }), f += w.length - O.size, m += O.size), await n.update(b.map((A) => A.uid), {
      timeAtLeast: h,
      groupIds: v
    }), i === "incremental") {
      v.forEach((B) => {
        if (!B) throw new Error("Source id cannot be null");
      });
      const A = await n.listKeys({
        before: h,
        groupIds: v
      });
      A.length > 0 && (await s.delete({ ids: A }), await n.deleteKeys(A), p += A.length);
    }
  }
  if (i === "full") {
    let _ = await n.listKeys({
      before: h,
      limit: c
    });
    for (; _.length > 0; )
      await s.delete({ ids: _ }), await n.deleteKeys(_), p += _.length, _ = await n.listKeys({
        before: h,
        limit: c
      });
  }
  return {
    numAdded: f,
    numDeleted: p,
    numUpdated: m,
    numSkipped: g
  };
}
var Zm = /* @__PURE__ */ F({
  RecordManager: () => Km,
  UUIDV5_NAMESPACE: () => ya,
  _HashedDocument: () => $c,
  _batch: () => jc,
  _deduplicateInOrder: () => Lc,
  _getSourceIdAssigner: () => Dc,
  _isBaseDocumentLoader: () => Fc,
  index: () => qm
}), Ym = /* @__PURE__ */ F({}), Xm = /* @__PURE__ */ F({}), Qm = /* @__PURE__ */ F({
  BaseMemory: () => eg,
  getInputValue: () => tg,
  getOutputValue: () => ng,
  getPromptInputKey: () => sg
}), eg = class {
};
const Vc = (e, t) => {
  if (t !== void 0) return e[t];
  const n = Object.keys(e);
  if (n.length === 1) return e[n[0]];
}, tg = (e, t) => {
  const n = Vc(e, t);
  if (!n) throw new Error(`input values have ${Object.keys(e).length} keys, you must specify an input key or pass only 1 key as input`);
  return n;
}, ng = (e, t) => {
  const n = Vc(e, t);
  if (!n && n !== "") throw new Error(`output values have ${Object.keys(e).length} keys, you must specify an output key or pass only 1 key as output`);
  return n;
};
function sg(e, t) {
  const n = Object.keys(e).filter((s) => !t.includes(s) && s !== "stop");
  if (n.length !== 1) throw new Error(`One input key expected, but got ${n.length}`);
  return n[0];
}
var Bc = class extends ri {
  static lc_name() {
    return "OutputFunctionsParser";
  }
  lc_namespace = [
    "langchain",
    "output_parsers",
    "openai_functions"
  ];
  lc_serializable = !0;
  argsOnly = !0;
  constructor(e) {
    super(), this.argsOnly = e?.argsOnly ?? this.argsOnly;
  }
  /**
  * Parses the output and returns a string representation of the function
  * call or its arguments.
  * @param generations The output of the LLM to parse.
  * @returns A string representation of the function call or its arguments.
  */
  async parseResult(e) {
    if ("message" in e[0]) {
      const t = e[0].message.additional_kwargs.function_call;
      if (!t) throw new Error(`No function_call in message ${JSON.stringify(e)}`);
      if (!t.arguments) throw new Error(`No arguments in function_call ${JSON.stringify(e)}`);
      return this.argsOnly ? t.arguments : JSON.stringify(t);
    } else throw new Error(`No message in generations ${JSON.stringify(e)}`);
  }
}, Hc = class extends si {
  static lc_name() {
    return "JsonOutputFunctionsParser";
  }
  lc_namespace = [
    "langchain",
    "output_parsers",
    "openai_functions"
  ];
  lc_serializable = !0;
  outputParser;
  argsOnly = !0;
  constructor(e) {
    super(e), this.argsOnly = e?.argsOnly ?? this.argsOnly, this.outputParser = new Bc(e);
  }
  _diff(e, t) {
    if (t)
      return ni(e ?? {}, t);
  }
  async parsePartialResult(e) {
    const t = e[0];
    if (!t.message) return;
    const { message: n } = t, s = n.additional_kwargs.function_call;
    if (s)
      return this.argsOnly ? sa(s.arguments) : {
        ...s,
        arguments: sa(s.arguments)
      };
  }
  /**
  * Parses the output and returns a JSON object. If `argsOnly` is true,
  * only the arguments of the function call are returned.
  * @param generations The output of the LLM to parse.
  * @returns A JSON object representation of the function call or its arguments.
  */
  async parseResult(e) {
    const t = await this.outputParser.parseResult(e);
    if (!t) throw new Error(`No result from "OutputFunctionsParser" ${JSON.stringify(e)}`);
    return this.parse(t);
  }
  async parse(e) {
    const t = JSON.parse(e);
    return this.argsOnly || (t.arguments = JSON.parse(t.arguments)), t;
  }
  getFormatInstructions() {
    return "";
  }
}, rg = class extends ri {
  static lc_name() {
    return "JsonKeyOutputFunctionsParser";
  }
  lc_namespace = [
    "langchain",
    "output_parsers",
    "openai_functions"
  ];
  lc_serializable = !0;
  outputParser = new Hc();
  attrName;
  get lc_aliases() {
    return { attrName: "key_name" };
  }
  constructor(e) {
    super(e), this.attrName = e.attrName;
  }
  /**
  * Parses the output and returns a specific attribute of the parsed JSON
  * object.
  * @param generations The output of the LLM to parse.
  * @returns The value of a specific attribute of the parsed JSON object.
  */
  async parseResult(e) {
    return (await this.outputParser.parseResult(e))[this.attrName];
  }
}, ag = /* @__PURE__ */ F({
  JsonKeyOutputFunctionsParser: () => rg,
  JsonOutputFunctionsParser: () => Hc,
  OutputFunctionsParser: () => Bc
}), ds = class extends ae {
  lc_serializable = !0;
  lc_namespace = [
    "langchain_core",
    "prompts",
    this._getPromptType()
  ];
  get lc_attributes() {
    return { partialVariables: void 0 };
  }
  inputVariables;
  outputParser;
  partialVariables;
  /**
  * Metadata to be used for tracing.
  */
  metadata;
  /** Tags to be used for tracing. */
  tags;
  constructor(e) {
    super(e);
    const { inputVariables: t } = e;
    if (t.includes("stop")) throw new Error("Cannot have an input variable named 'stop', as it is used internally, please rename.");
    Object.assign(this, e);
  }
  /**
  * Merges partial variables and user variables.
  * @param userVariables The user variables to merge with the partial variables.
  * @returns A Promise that resolves to an object containing the merged variables.
  */
  async mergePartialAndUserVariables(e) {
    const t = this.partialVariables ?? {}, n = {};
    for (const [s, r] of Object.entries(t)) typeof r == "string" ? n[s] = r : n[s] = await r();
    return {
      ...n,
      ...e
    };
  }
  /**
  * Invokes the prompt template with the given input and options.
  * @param input The input to invoke the prompt template with.
  * @param options Optional configuration for the callback.
  * @returns A Promise that resolves to the output of the prompt template.
  */
  async invoke(e, t) {
    const n = {
      ...this.metadata,
      ...t?.metadata
    }, s = [...this.tags ?? [], ...t?.tags ?? []];
    return this._callWithConfig((r) => this.formatPromptValue(r), e, {
      ...t,
      tags: s,
      metadata: n,
      runType: "prompt"
    });
  }
}, Xn = class extends ds {
  /**
  * Formats the prompt given the input values and returns a formatted
  * prompt value.
  * @param values The input values to format the prompt.
  * @returns A Promise that resolves to a formatted prompt value.
  */
  async formatPromptValue(e) {
    return new vf(await this.format(e));
  }
};
var ig = Object.prototype.toString, In = Array.isArray || function(t) {
  return ig.call(t) === "[object Array]";
};
function Ei(e) {
  return typeof e == "function";
}
function og(e) {
  return In(e) ? "array" : typeof e;
}
function Rr(e) {
  return e.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
}
function mo(e, t) {
  return e != null && typeof e == "object" && t in e;
}
function cg(e, t) {
  return e != null && typeof e != "object" && e.hasOwnProperty && e.hasOwnProperty(t);
}
var lg = RegExp.prototype.test;
function ug(e, t) {
  return lg.call(e, t);
}
var hg = /\S/;
function dg(e) {
  return !ug(hg, e);
}
var fg = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
  "/": "&#x2F;",
  "`": "&#x60;",
  "=": "&#x3D;"
};
function pg(e) {
  return String(e).replace(/[&<>"'`=\/]/g, function(n) {
    return fg[n];
  });
}
var mg = /\s*/, gg = /\s+/, go = /\s*=/, yg = /\s*\}/, _g = /#|\^|\/|>|\{|&|=|!/;
function wg(e, t) {
  if (!e)
    return [];
  var n = !1, s = [], r = [], a = [], i = !1, o = !1, c = "", l = 0;
  function u() {
    if (i && !o)
      for (; a.length; )
        delete r[a.pop()];
    else
      a = [];
    i = !1, o = !1;
  }
  var d, h, f;
  function p(C) {
    if (typeof C == "string" && (C = C.split(gg, 2)), !In(C) || C.length !== 2)
      throw new Error("Invalid tags: " + C);
    d = new RegExp(Rr(C[0]) + "\\s*"), h = new RegExp("\\s*" + Rr(C[1])), f = new RegExp("\\s*" + Rr("}" + C[1]));
  }
  p(t || Ce.tags);
  for (var m = new fs(e), g, y, _, b, v, M; !m.eos(); ) {
    if (g = m.pos, _ = m.scanUntil(d), _)
      for (var I = 0, w = _.length; I < w; ++I)
        b = _.charAt(I), dg(b) ? (a.push(r.length), c += b) : (o = !0, n = !0, c += " "), r.push(["text", b, g, g + 1]), g += 1, b === `
` && (u(), c = "", l = 0, n = !1);
    if (!m.scan(d))
      break;
    if (i = !0, y = m.scan(_g) || "name", m.scan(mg), y === "=" ? (_ = m.scanUntil(go), m.scan(go), m.scanUntil(h)) : y === "{" ? (_ = m.scanUntil(f), m.scan(yg), m.scanUntil(h), y = "&") : _ = m.scanUntil(h), !m.scan(h))
      throw new Error("Unclosed tag at " + m.pos);
    if (y == ">" ? v = [y, _, g, m.pos, c, l, n] : v = [y, _, g, m.pos], l++, r.push(v), y === "#" || y === "^")
      s.push(v);
    else if (y === "/") {
      if (M = s.pop(), !M)
        throw new Error('Unopened section "' + _ + '" at ' + g);
      if (M[1] !== _)
        throw new Error('Unclosed section "' + M[1] + '" at ' + g);
    } else y === "name" || y === "{" || y === "&" ? o = !0 : y === "=" && p(_);
  }
  if (u(), M = s.pop(), M)
    throw new Error('Unclosed section "' + M[1] + '" at ' + m.pos);
  return bg(vg(r));
}
function vg(e) {
  for (var t = [], n, s, r = 0, a = e.length; r < a; ++r)
    n = e[r], n && (n[0] === "text" && s && s[0] === "text" ? (s[1] += n[1], s[3] = n[3]) : (t.push(n), s = n));
  return t;
}
function bg(e) {
  for (var t = [], n = t, s = [], r, a, i = 0, o = e.length; i < o; ++i)
    switch (r = e[i], r[0]) {
      case "#":
      case "^":
        n.push(r), s.push(r), n = r[4] = [];
        break;
      case "/":
        a = s.pop(), a[5] = r[2], n = s.length > 0 ? s[s.length - 1][4] : t;
        break;
      default:
        n.push(r);
    }
  return t;
}
function fs(e) {
  this.string = e, this.tail = e, this.pos = 0;
}
fs.prototype.eos = function() {
  return this.tail === "";
};
fs.prototype.scan = function(t) {
  var n = this.tail.match(t);
  if (!n || n.index !== 0)
    return "";
  var s = n[0];
  return this.tail = this.tail.substring(s.length), this.pos += s.length, s;
};
fs.prototype.scanUntil = function(t) {
  var n = this.tail.search(t), s;
  switch (n) {
    case -1:
      s = this.tail, this.tail = "";
      break;
    case 0:
      s = "";
      break;
    default:
      s = this.tail.substring(0, n), this.tail = this.tail.substring(n);
  }
  return this.pos += s.length, s;
};
function vn(e, t) {
  this.view = e, this.cache = { ".": this.view }, this.parent = t;
}
vn.prototype.push = function(t) {
  return new vn(t, this);
};
vn.prototype.lookup = function(t) {
  var n = this.cache, s;
  if (n.hasOwnProperty(t))
    s = n[t];
  else {
    for (var r = this, a, i, o, c = !1; r; ) {
      if (t.indexOf(".") > 0)
        for (a = r.view, i = t.split("."), o = 0; a != null && o < i.length; )
          o === i.length - 1 && (c = mo(a, i[o]) || cg(a, i[o])), a = a[i[o++]];
      else
        a = r.view[t], c = mo(r.view, t);
      if (c) {
        s = a;
        break;
      }
      r = r.parent;
    }
    n[t] = s;
  }
  return Ei(s) && (s = s.call(this.view)), s;
};
function be() {
  this.templateCache = {
    _cache: {},
    set: function(t, n) {
      this._cache[t] = n;
    },
    get: function(t) {
      return this._cache[t];
    },
    clear: function() {
      this._cache = {};
    }
  };
}
be.prototype.clearCache = function() {
  typeof this.templateCache < "u" && this.templateCache.clear();
};
be.prototype.parse = function(t, n) {
  var s = this.templateCache, r = t + ":" + (n || Ce.tags).join(":"), a = typeof s < "u", i = a ? s.get(r) : void 0;
  return i == null && (i = wg(t, n), a && s.set(r, i)), i;
};
be.prototype.render = function(t, n, s, r) {
  var a = this.getConfigTags(r), i = this.parse(t, a), o = n instanceof vn ? n : new vn(n, void 0);
  return this.renderTokens(i, o, s, t, r);
};
be.prototype.renderTokens = function(t, n, s, r, a) {
  for (var i = "", o, c, l, u = 0, d = t.length; u < d; ++u)
    l = void 0, o = t[u], c = o[0], c === "#" ? l = this.renderSection(o, n, s, r, a) : c === "^" ? l = this.renderInverted(o, n, s, r, a) : c === ">" ? l = this.renderPartial(o, n, s, a) : c === "&" ? l = this.unescapedValue(o, n) : c === "name" ? l = this.escapedValue(o, n, a) : c === "text" && (l = this.rawValue(o)), l !== void 0 && (i += l);
  return i;
};
be.prototype.renderSection = function(t, n, s, r, a) {
  var i = this, o = "", c = n.lookup(t[1]);
  function l(h) {
    return i.render(h, n, s, a);
  }
  if (c) {
    if (In(c))
      for (var u = 0, d = c.length; u < d; ++u)
        o += this.renderTokens(t[4], n.push(c[u]), s, r, a);
    else if (typeof c == "object" || typeof c == "string" || typeof c == "number")
      o += this.renderTokens(t[4], n.push(c), s, r, a);
    else if (Ei(c)) {
      if (typeof r != "string")
        throw new Error("Cannot use higher-order sections without the original template");
      c = c.call(n.view, r.slice(t[3], t[5]), l), c != null && (o += c);
    } else
      o += this.renderTokens(t[4], n, s, r, a);
    return o;
  }
};
be.prototype.renderInverted = function(t, n, s, r, a) {
  var i = n.lookup(t[1]);
  if (!i || In(i) && i.length === 0)
    return this.renderTokens(t[4], n, s, r, a);
};
be.prototype.indentPartial = function(t, n, s) {
  for (var r = n.replace(/[^ \t]/g, ""), a = t.split(`
`), i = 0; i < a.length; i++)
    a[i].length && (i > 0 || !s) && (a[i] = r + a[i]);
  return a.join(`
`);
};
be.prototype.renderPartial = function(t, n, s, r) {
  if (s) {
    var a = this.getConfigTags(r), i = Ei(s) ? s(t[1]) : s[t[1]];
    if (i != null) {
      var o = t[6], c = t[5], l = t[4], u = i;
      c == 0 && l && (u = this.indentPartial(i, l, o));
      var d = this.parse(u, a);
      return this.renderTokens(d, n, s, u, r);
    }
  }
};
be.prototype.unescapedValue = function(t, n) {
  var s = n.lookup(t[1]);
  if (s != null)
    return s;
};
be.prototype.escapedValue = function(t, n, s) {
  var r = this.getConfigEscape(s) || Ce.escape, a = n.lookup(t[1]);
  if (a != null)
    return typeof a == "number" && r === Ce.escape ? String(a) : r(a);
};
be.prototype.rawValue = function(t) {
  return t[1];
};
be.prototype.getConfigTags = function(t) {
  return In(t) ? t : t && typeof t == "object" ? t.tags : void 0;
};
be.prototype.getConfigEscape = function(t) {
  if (t && typeof t == "object" && !In(t))
    return t.escape;
};
var Ce = {
  name: "mustache.js",
  version: "4.2.0",
  tags: ["{{", "}}"],
  clearCache: void 0,
  escape: void 0,
  parse: void 0,
  render: void 0,
  Scanner: void 0,
  Context: void 0,
  Writer: void 0,
  /**
   * Allows a user to override the default caching strategy, by providing an
   * object with set, get and clear methods. This can also be used to disable
   * the cache by setting it to the literal `undefined`.
   */
  set templateCache(e) {
    Qn.templateCache = e;
  },
  /**
   * Gets the default or overridden caching object from the default writer.
   */
  get templateCache() {
    return Qn.templateCache;
  }
}, Qn = new be();
Ce.clearCache = function() {
  return Qn.clearCache();
};
Ce.parse = function(t, n) {
  return Qn.parse(t, n);
};
Ce.render = function(t, n, s, r) {
  if (typeof t != "string")
    throw new TypeError('Invalid template! Template should be a "string" but "' + og(t) + '" was given as the first argument for mustache#render(template, view, partials)');
  return Qn.render(t, n, s, r);
};
Ce.escape = pg;
Ce.Scanner = fs;
Ce.Context = vn;
Ce.Writer = be;
function Uc() {
  Ce.escape = (e) => e;
}
const es = (e) => {
  const t = e.split(""), n = [], s = (a, i) => {
    for (let o = i; o < t.length; o += 1) if (a.includes(t[o])) return o;
    return -1;
  };
  let r = 0;
  for (; r < t.length; ) if (t[r] === "{" && r + 1 < t.length && t[r + 1] === "{")
    n.push({
      type: "literal",
      text: "{"
    }), r += 2;
  else if (t[r] === "}" && r + 1 < t.length && t[r + 1] === "}")
    n.push({
      type: "literal",
      text: "}"
    }), r += 2;
  else if (t[r] === "{") {
    const a = s("}", r);
    if (a < 0) throw new Error("Unclosed '{' in template.");
    n.push({
      type: "variable",
      name: t.slice(r + 1, a).join("")
    }), r = a + 1;
  } else {
    if (t[r] === "}") throw new Error("Single '}' in template.");
    {
      const a = s("{}", r), i = (a < 0 ? t.slice(r) : t.slice(r, a)).join("");
      n.push({
        type: "literal",
        text: i
      }), r = a < 0 ? t.length : a;
    }
  }
  return n;
}, Wc = (e, t = []) => {
  const n = [];
  for (const s of e) if (s[0] === "name") {
    const r = s[1].includes(".") ? s[1].split(".")[0] : s[1];
    n.push({
      type: "variable",
      name: r
    });
  } else if ([
    "#",
    "&",
    "^",
    ">"
  ].includes(s[0])) {
    if (n.push({
      type: "variable",
      name: s[1]
    }), s[0] === "#" && s.length > 4 && Array.isArray(s[4])) {
      const r = [...t, s[1]], a = Wc(s[4], r);
      n.push(...a);
    }
  } else n.push({
    type: "literal",
    text: s[1]
  });
  return n;
}, er = (e) => (Uc(), Wc(Ce.parse(e))), zc = (e, t) => es(e).reduce((n, s) => {
  if (s.type === "variable") {
    if (s.name in t) return n + (typeof t[s.name] == "string" ? t[s.name] : JSON.stringify(t[s.name]));
    throw new Error(`(f-string) Missing value for input ${s.name}`);
  }
  return n + s.text;
}, ""), Gc = (e, t) => (Uc(), Ce.render(e, t)), tr = {
  "f-string": zc,
  mustache: Gc
}, Jc = {
  "f-string": es,
  mustache: er
}, Le = (e, t, n) => {
  try {
    return tr[t](e, n);
  } catch (s) {
    throw dc(s, "INVALID_PROMPT_INPUT");
  }
}, nr = (e, t) => Jc[t](e), ps = (e, t, n) => {
  if (!(t in tr)) throw new Error(`Invalid template format. Got \`${t}\`;
                         should be one of ${Object.keys(tr)}`);
  try {
    const s = Object.fromEntries(n.map((r) => [r, "foo"]));
    Array.isArray(e) ? e.forEach((r) => {
      if (r.type === "text" && "text" in r && typeof r.text == "string") Le(r.text, t, s);
      else if (r.type === "image_url") {
        if (typeof r.image_url == "string") Le(r.image_url, t, s);
        else if (typeof r.image_url == "object" && r.image_url !== null && "url" in r.image_url && typeof r.image_url.url == "string") {
          const a = r.image_url.url;
          Le(a, t, s);
        }
      } else throw new Error(`Invalid message template received. ${JSON.stringify(r, null, 2)}`);
    }) : Le(e, t, s);
  } catch (s) {
    throw new Error(`Invalid prompt schema: ${s.message}`);
  }
};
var At = class $n extends Xn {
  static lc_name() {
    return "PromptTemplate";
  }
  template;
  templateFormat = "f-string";
  validateTemplate = !0;
  /**
  * Additional fields which should be included inside
  * the message content array if using a complex message
  * content.
  */
  additionalContentFields;
  constructor(t) {
    if (super(t), t.templateFormat === "mustache" && t.validateTemplate === void 0 && (this.validateTemplate = !1), Object.assign(this, t), this.validateTemplate) {
      if (this.templateFormat === "mustache") throw new Error("Mustache templates cannot be validated.");
      let n = this.inputVariables;
      this.partialVariables && (n = n.concat(Object.keys(this.partialVariables))), ps(this.template, this.templateFormat, n);
    }
  }
  _getPromptType() {
    return "prompt";
  }
  /**
  * Formats the prompt template with the provided values.
  * @param values The values to be used to format the prompt template.
  * @returns A promise that resolves to a string which is the formatted prompt.
  */
  async format(t) {
    const n = await this.mergePartialAndUserVariables(t);
    return Le(this.template, this.templateFormat, n);
  }
  /**
  * Take examples in list format with prefix and suffix to create a prompt.
  *
  * Intended to be used as a way to dynamically create a prompt from examples.
  *
  * @param examples - List of examples to use in the prompt.
  * @param suffix - String to go after the list of examples. Should generally set up the user's input.
  * @param inputVariables - A list of variable names the final prompt template will expect
  * @param exampleSeparator - The separator to use in between examples
  * @param prefix - String that should go before any examples. Generally includes examples.
  *
  * @returns The final prompt template generated.
  */
  static fromExamples(t, n, s, r = `

`, a = "") {
    return new $n({
      inputVariables: s,
      template: [
        a,
        ...t,
        n
      ].join(r)
    });
  }
  static fromTemplate(t, n) {
    const { templateFormat: s = "f-string", ...r } = n ?? {}, a = /* @__PURE__ */ new Set();
    return nr(t, s).forEach((i) => {
      i.type === "variable" && a.add(i.name);
    }), new $n({
      inputVariables: [...a],
      templateFormat: s,
      template: t,
      ...r
    });
  }
  /**
  * Partially applies values to the prompt template.
  * @param values The values to be partially applied to the prompt template.
  * @returns A new instance of PromptTemplate with the partially applied values.
  */
  async partial(t) {
    const n = this.inputVariables.filter((r) => !(r in t)), s = {
      ...this.partialVariables ?? {},
      ...t
    };
    return new $n({
      ...this,
      inputVariables: n,
      partialVariables: s
    });
  }
  serialize() {
    if (this.outputParser !== void 0) throw new Error("Cannot serialize a prompt template with an output parser");
    return {
      _type: this._getPromptType(),
      input_variables: this.inputVariables,
      template: this.template,
      template_format: this.templateFormat
    };
  }
  static async deserialize(t) {
    if (!t.template) throw new Error("Prompt template must have a template");
    return new $n({
      inputVariables: t.input_variables,
      template: t.template,
      templateFormat: t.template_format
    });
  }
}, js = class Kc extends ds {
  static lc_name() {
    return "ImagePromptTemplate";
  }
  lc_namespace = [
    "langchain_core",
    "prompts",
    "image"
  ];
  template;
  templateFormat = "f-string";
  validateTemplate = !0;
  /**
  * Additional fields which should be included inside
  * the message content array if using a complex message
  * content.
  */
  additionalContentFields;
  constructor(t) {
    if (super(t), this.template = t.template, this.templateFormat = t.templateFormat ?? this.templateFormat, this.validateTemplate = t.validateTemplate ?? this.validateTemplate, this.additionalContentFields = t.additionalContentFields, this.validateTemplate) {
      let n = this.inputVariables;
      this.partialVariables && (n = n.concat(Object.keys(this.partialVariables))), ps([{
        type: "image_url",
        image_url: this.template
      }], this.templateFormat, n);
    }
  }
  _getPromptType() {
    return "prompt";
  }
  /**
  * Partially applies values to the prompt template.
  * @param values The values to be partially applied to the prompt template.
  * @returns A new instance of ImagePromptTemplate with the partially applied values.
  */
  async partial(t) {
    const n = this.inputVariables.filter((r) => !(r in t)), s = {
      ...this.partialVariables ?? {},
      ...t
    };
    return new Kc({
      ...this,
      inputVariables: n,
      partialVariables: s
    });
  }
  /**
  * Formats the prompt template with the provided values.
  * @param values The values to be used to format the prompt template.
  * @returns A promise that resolves to a string which is the formatted prompt.
  */
  async format(t) {
    const n = {};
    for (const [i, o] of Object.entries(this.template)) typeof o == "string" ? n[i] = Le(o, this.templateFormat, t) : n[i] = o;
    const s = t.url || n.url, r = t.detail || n.detail;
    if (!s) throw new Error("Must provide either an image URL.");
    if (typeof s != "string") throw new Error("url must be a string.");
    const a = { url: s };
    return r && (a.detail = r), a;
  }
  /**
  * Formats the prompt given the input values and returns a formatted
  * prompt value.
  * @param values The input values to format the prompt.
  * @returns A Promise that resolves to a formatted prompt value.
  */
  async formatPromptValue(t) {
    return new bf(await this.format(t));
  }
}, _a = class extends ae {
  lc_namespace = [
    "langchain_core",
    "prompts",
    "dict"
  ];
  lc_serializable = !0;
  template;
  templateFormat;
  inputVariables;
  static lc_name() {
    return "DictPromptTemplate";
  }
  constructor(e) {
    const t = e.templateFormat ?? "f-string", n = wa(e.template, t);
    super({
      inputVariables: n,
      ...e
    }), this.template = e.template, this.templateFormat = t, this.inputVariables = n;
  }
  async format(e) {
    return va(this.template, e, this.templateFormat);
  }
  async invoke(e) {
    return await this._callWithConfig(this.format.bind(this), e, { runType: "prompt" });
  }
};
function wa(e, t) {
  const n = [];
  for (const s of Object.values(e)) if (typeof s == "string") nr(s, t).forEach((r) => {
    r.type === "variable" && n.push(r.name);
  });
  else if (Array.isArray(s))
    for (const r of s) typeof r == "string" ? nr(r, t).forEach((a) => {
      a.type === "variable" && n.push(a.name);
    }) : typeof r == "object" && n.push(...wa(r, t));
  else typeof s == "object" && s !== null && n.push(...wa(s, t));
  return Array.from(new Set(n));
}
function va(e, t, n) {
  const s = {};
  for (const [r, a] of Object.entries(e)) if (typeof a == "string") s[r] = Le(a, n, t);
  else if (Array.isArray(a)) {
    const i = [];
    for (const o of a) typeof o == "string" ? i.push(Le(o, n, t)) : typeof o == "object" && i.push(va(o, t, n));
    s[r] = i;
  } else typeof a == "object" && a !== null ? s[r] = va(a, t, n) : s[r] = a;
  return s;
}
var wr = class extends ae {
  lc_namespace = [
    "langchain_core",
    "prompts",
    "chat"
  ];
  lc_serializable = !0;
  /**
  * Calls the formatMessages method with the provided input and options.
  * @param input Input for the formatMessages method
  * @param options Optional BaseCallbackConfig
  * @returns Formatted output messages
  */
  async invoke(e, t) {
    return this._callWithConfig((n) => this.formatMessages(n), e, {
      ...t,
      runType: "prompt"
    });
  }
}, ba = class extends wr {
  static lc_name() {
    return "MessagesPlaceholder";
  }
  variableName;
  optional;
  constructor(e) {
    typeof e == "string" && (e = { variableName: e }), super(e), this.variableName = e.variableName, this.optional = e.optional ?? !1;
  }
  get inputVariables() {
    return [this.variableName];
  }
  async formatMessages(e) {
    const t = e[this.variableName];
    if (this.optional && !t) return [];
    if (!t) {
      const s = /* @__PURE__ */ new Error(`Field "${this.variableName}" in prompt uses a MessagesPlaceholder, which expects an array of BaseMessages as an input value. Received: undefined`);
      throw s.name = "InputFormatError", s;
    }
    let n;
    try {
      Array.isArray(t) ? n = t.map(ft) : n = [ft(t)];
    } catch (s) {
      const r = typeof t == "string" ? t : JSON.stringify(t, null, 2), a = new Error([
        `Field "${this.variableName}" in prompt uses a MessagesPlaceholder, which expects an array of BaseMessages or coerceable values as input.`,
        `Received value: ${r}`,
        `Additional message: ${s.message}`
      ].join(`

`));
      throw a.name = "InputFormatError", a.lc_error_code = s.lc_error_code, a;
    }
    return n;
  }
}, qc = class extends wr {
  prompt;
  constructor(e) {
    "prompt" in e || (e = { prompt: e }), super(e), this.prompt = e.prompt;
  }
  get inputVariables() {
    return this.prompt.inputVariables;
  }
  async formatMessages(e) {
    return [await this.format(e)];
  }
}, Ti = class extends ds {
  constructor(e) {
    super(e);
  }
  async format(e) {
    return (await this.formatPromptValue(e)).toString();
  }
  async formatPromptValue(e) {
    return new Sf(await this.formatMessages(e));
  }
}, Zc = class extends qc {
  static lc_name() {
    return "ChatMessagePromptTemplate";
  }
  role;
  constructor(e, t) {
    "prompt" in e || (e = {
      prompt: e,
      role: t
    }), super(e), this.role = e.role;
  }
  async format(e) {
    return new os(await this.prompt.format(e), this.role);
  }
  static fromTemplate(e, t, n) {
    return new this(At.fromTemplate(e, { templateFormat: n?.templateFormat }), t);
  }
};
function Sg(e) {
  return e === null || typeof e != "object" || Array.isArray(e) ? !1 : Object.keys(e).length === 1 && "text" in e && typeof e.text == "string";
}
function kg(e) {
  return e === null || typeof e != "object" || Array.isArray(e) ? !1 : "image_url" in e && (typeof e.image_url == "string" || typeof e.image_url == "object" && e.image_url !== null && "url" in e.image_url && typeof e.image_url.url == "string");
}
var xi = class extends wr {
  lc_namespace = [
    "langchain_core",
    "prompts",
    "chat"
  ];
  lc_serializable = !0;
  inputVariables = [];
  additionalOptions = {};
  prompt;
  messageClass;
  static _messageClass() {
    throw new Error("Can not invoke _messageClass from inside _StringImageMessagePromptTemplate");
  }
  chatMessageClass;
  constructor(e, t) {
    if ("prompt" in e || (e = { prompt: e }), super(e), this.prompt = e.prompt, Array.isArray(this.prompt)) {
      let n = [];
      this.prompt.forEach((s) => {
        "inputVariables" in s && (n = n.concat(s.inputVariables));
      }), this.inputVariables = n;
    } else this.inputVariables = this.prompt.inputVariables;
    this.additionalOptions = t ?? this.additionalOptions;
  }
  createMessage(e) {
    const t = this.constructor;
    if (t._messageClass()) return new (t._messageClass())({ content: e });
    if (t.chatMessageClass) {
      const n = t.chatMessageClass();
      return new n({
        content: e,
        role: this.getRoleFromMessageClass(n.lc_name())
      });
    } else throw new Error("No message class defined");
  }
  getRoleFromMessageClass(e) {
    switch (e) {
      case "HumanMessage":
        return "human";
      case "AIMessage":
        return "ai";
      case "SystemMessage":
        return "system";
      case "ChatMessage":
        return "chat";
      default:
        throw new Error("Invalid message class name");
    }
  }
  static fromTemplate(e, t) {
    if (typeof e == "string") return new this(At.fromTemplate(e, t));
    const n = [];
    for (const s of e) if (typeof s == "string") n.push(At.fromTemplate(s, t));
    else if (s !== null) if (Sg(s)) {
      let r = "";
      typeof s.text == "string" && (r = s.text ?? "");
      const a = {
        ...t,
        additionalContentFields: s
      };
      n.push(At.fromTemplate(r, a));
    } else if (kg(s)) {
      let r = s.image_url ?? "", a, i = [];
      if (typeof r == "string") {
        let o;
        t?.templateFormat === "mustache" ? o = er(r) : o = es(r);
        const c = o.flatMap((l) => l.type === "variable" ? [l.name] : []);
        if ((c?.length ?? 0) > 0) {
          if (c.length > 1) throw new Error(`Only one format variable allowed per image template.
Got: ${c}
From: ${r}`);
          i = [c[0]];
        } else i = [];
        r = { url: r }, a = new js({
          template: r,
          inputVariables: i,
          templateFormat: t?.templateFormat,
          additionalContentFields: s
        });
      } else if (typeof r == "object") {
        if ("url" in r) {
          let o;
          t?.templateFormat === "mustache" ? o = er(r.url) : o = es(r.url), i = o.flatMap((c) => c.type === "variable" ? [c.name] : []);
        } else i = [];
        a = new js({
          template: r,
          inputVariables: i,
          templateFormat: t?.templateFormat,
          additionalContentFields: s
        });
      } else throw new Error("Invalid image template");
      n.push(a);
    } else typeof s == "object" && n.push(new _a({
      template: s,
      templateFormat: t?.templateFormat
    }));
    return new this({
      prompt: n,
      additionalOptions: t
    });
  }
  async format(e) {
    if (this.prompt instanceof Xn) {
      const t = await this.prompt.format(e);
      return this.createMessage(t);
    } else {
      const t = [];
      for (const n of this.prompt) {
        let s = {};
        if (!("inputVariables" in n)) throw new Error(`Prompt ${n} does not have inputVariables defined.`);
        for (const r of n.inputVariables)
          s || (s = { [r]: e[r] }), s = {
            ...s,
            [r]: e[r]
          };
        if (n instanceof Xn) {
          const r = await n.format(s);
          let a;
          "additionalContentFields" in n && (a = n.additionalContentFields), r !== "" && t.push({
            ...a,
            type: "text",
            text: r
          });
        } else if (n instanceof js) {
          const r = await n.format(s);
          let a;
          "additionalContentFields" in n && (a = n.additionalContentFields), t.push({
            ...a,
            type: "image_url",
            image_url: r
          });
        } else if (n instanceof _a) {
          const r = await n.format(s);
          let a;
          "additionalContentFields" in n && (a = n.additionalContentFields), t.push({
            ...a,
            ...r
          });
        }
      }
      return this.createMessage(t);
    }
  }
  async formatMessages(e) {
    return [await this.format(e)];
  }
}, Mi = class extends xi {
  static _messageClass() {
    return $t;
  }
  static lc_name() {
    return "HumanMessagePromptTemplate";
  }
}, Yc = class extends xi {
  static _messageClass() {
    return U;
  }
  static lc_name() {
    return "AIMessagePromptTemplate";
  }
}, Xc = class extends xi {
  static _messageClass() {
    return Pe;
  }
  static lc_name() {
    return "SystemMessagePromptTemplate";
  }
};
function Cg(e) {
  return typeof e.formatMessages == "function";
}
function Eg(e, t) {
  if (Cg(e) || ke(e)) return e;
  if (Array.isArray(e) && e[0] === "placeholder") {
    const r = e[1];
    if (t?.templateFormat === "mustache" && typeof r == "string" && r.slice(0, 2) === "{{" && r.slice(-2) === "}}") return new ba({
      variableName: r.slice(2, -2),
      optional: !0
    });
    if (typeof r == "string" && r[0] === "{" && r[r.length - 1] === "}") return new ba({
      variableName: r.slice(1, -1),
      optional: !0
    });
    throw new Error(`Invalid placeholder template for format ${t?.templateFormat ?? '"f-string"'}: "${e[1]}". Expected a variable name surrounded by ${t?.templateFormat === "mustache" ? "double" : "single"} curly braces.`);
  }
  const n = ft(e);
  let s;
  if (typeof n.content == "string" ? s = n.content : s = n.content.map((r) => "text" in r ? {
    ...r,
    text: r.text
  } : "image_url" in r ? {
    ...r,
    image_url: r.image_url
  } : r), n._getType() === "human") return Mi.fromTemplate(s, t);
  if (n._getType() === "ai") return Yc.fromTemplate(s, t);
  if (n._getType() === "system") return Xc.fromTemplate(s, t);
  if (os.isInstance(n)) return Zc.fromTemplate(n.content, n.role, t);
  throw new Error(`Could not coerce message prompt template from input. Received message type: "${n._getType()}".`);
}
function Tg(e) {
  return e.constructor.lc_name() === "MessagesPlaceholder";
}
var Ii = class Ls extends Ti {
  static lc_name() {
    return "ChatPromptTemplate";
  }
  get lc_aliases() {
    return { promptMessages: "messages" };
  }
  promptMessages;
  validateTemplate = !0;
  templateFormat = "f-string";
  constructor(t) {
    if (super(t), t.templateFormat === "mustache" && t.validateTemplate === void 0 && (this.validateTemplate = !1), Object.assign(this, t), this.validateTemplate) {
      const n = /* @__PURE__ */ new Set();
      for (const o of this.promptMessages)
        if (!(o instanceof ve))
          for (const c of o.inputVariables) n.add(c);
      const s = this.inputVariables, r = new Set(this.partialVariables ? s.concat(Object.keys(this.partialVariables)) : s), a = new Set([...r].filter((o) => !n.has(o)));
      if (a.size > 0) throw new Error(`Input variables \`${[...a]}\` are not used in any of the prompt messages.`);
      const i = new Set([...n].filter((o) => !r.has(o)));
      if (i.size > 0) throw new Error(`Input variables \`${[...i]}\` are used in prompt messages but not in the prompt template.`);
    }
  }
  _getPromptType() {
    return "chat";
  }
  async _parseImagePrompts(t, n) {
    return typeof t.content == "string" || (t.content = await Promise.all(t.content.map(async (s) => {
      if (s.type !== "image_url") return s;
      let r = "";
      typeof s.image_url == "string" ? r = s.image_url : typeof s.image_url == "object" && s.image_url !== null && "url" in s.image_url && typeof s.image_url.url == "string" && (r = s.image_url.url);
      const a = await At.fromTemplate(r, { templateFormat: this.templateFormat }).format(n);
      return typeof s.image_url == "object" && s.image_url !== null && "url" in s.image_url ? s.image_url.url = a : s.image_url = a, s;
    }))), t;
  }
  async formatMessages(t) {
    const n = await this.mergePartialAndUserVariables(t);
    let s = [];
    for (const r of this.promptMessages) if (r instanceof ve) s.push(await this._parseImagePrompts(r, n));
    else {
      let a;
      this.templateFormat === "mustache" ? a = { ...n } : a = r.inputVariables.reduce((o, c) => {
        if (!(c in n) && !(Tg(r) && r.optional)) throw dc(/* @__PURE__ */ new Error(`Missing value for input variable \`${c.toString()}\``), "INVALID_PROMPT_INPUT");
        return o[c] = n[c], o;
      }, {});
      const i = await r.formatMessages(a);
      s = s.concat(i);
    }
    return s;
  }
  async partial(t) {
    const n = this.inputVariables.filter((r) => !(r in t)), s = {
      ...this.partialVariables ?? {},
      ...t
    };
    return new Ls({
      ...this,
      inputVariables: n,
      partialVariables: s
    });
  }
  static fromTemplate(t, n) {
    const s = new Mi({ prompt: At.fromTemplate(t, n) });
    return this.fromMessages([s]);
  }
  /**
  * Create a chat model-specific prompt from individual chat messages
  * or message-like tuples.
  * @param promptMessages Messages to be passed to the chat model
  * @returns A new ChatPromptTemplate
  */
  static fromMessages(t, n) {
    const s = t.reduce((i, o) => i.concat(o instanceof Ls ? o.promptMessages : [Eg(o, n)]), []), r = t.reduce((i, o) => o instanceof Ls ? Object.assign(i, o.partialVariables) : i, /* @__PURE__ */ Object.create(null)), a = /* @__PURE__ */ new Set();
    for (const i of s)
      if (!(i instanceof ve))
        for (const o of i.inputVariables)
          o in r || a.add(o);
    return new this({
      ...n,
      inputVariables: [...a],
      promptMessages: s,
      partialVariables: r,
      templateFormat: n?.templateFormat
    });
  }
}, xg = class Sa extends Xn {
  lc_serializable = !1;
  examples;
  exampleSelector;
  examplePrompt;
  suffix = "";
  exampleSeparator = `

`;
  prefix = "";
  templateFormat = "f-string";
  validateTemplate = !0;
  constructor(t) {
    if (super(t), Object.assign(this, t), this.examples !== void 0 && this.exampleSelector !== void 0) throw new Error("Only one of 'examples' and 'example_selector' should be provided");
    if (this.examples === void 0 && this.exampleSelector === void 0) throw new Error("One of 'examples' and 'example_selector' should be provided");
    if (this.validateTemplate) {
      let n = this.inputVariables;
      this.partialVariables && (n = n.concat(Object.keys(this.partialVariables))), ps(this.prefix + this.suffix, this.templateFormat, n);
    }
  }
  _getPromptType() {
    return "few_shot";
  }
  static lc_name() {
    return "FewShotPromptTemplate";
  }
  async getExamples(t) {
    if (this.examples !== void 0) return this.examples;
    if (this.exampleSelector !== void 0) return this.exampleSelector.selectExamples(t);
    throw new Error("One of 'examples' and 'example_selector' should be provided");
  }
  async partial(t) {
    const n = this.inputVariables.filter((r) => !(r in t)), s = {
      ...this.partialVariables ?? {},
      ...t
    };
    return new Sa({
      ...this,
      inputVariables: n,
      partialVariables: s
    });
  }
  /**
  * Formats the prompt with the given values.
  * @param values The values to format the prompt with.
  * @returns A promise that resolves to a string representing the formatted prompt.
  */
  async format(t) {
    const n = await this.mergePartialAndUserVariables(t), s = await this.getExamples(n), r = await Promise.all(s.map((a) => this.examplePrompt.format(a)));
    return Le([
      this.prefix,
      ...r,
      this.suffix
    ].join(this.exampleSeparator), this.templateFormat, n);
  }
  serialize() {
    if (this.exampleSelector || !this.examples) throw new Error("Serializing an example selector is not currently supported");
    if (this.outputParser !== void 0) throw new Error("Serializing an output parser is not currently supported");
    return {
      _type: this._getPromptType(),
      input_variables: this.inputVariables,
      example_prompt: this.examplePrompt.serialize(),
      example_separator: this.exampleSeparator,
      suffix: this.suffix,
      prefix: this.prefix,
      template_format: this.templateFormat,
      examples: this.examples
    };
  }
  static async deserialize(t) {
    const { example_prompt: n } = t;
    if (!n) throw new Error("Missing example prompt");
    const s = await At.deserialize(n);
    let r;
    if (Array.isArray(t.examples)) r = t.examples;
    else throw new Error("Invalid examples format. Only list or string are supported.");
    return new Sa({
      inputVariables: t.input_variables,
      examplePrompt: s,
      examples: r,
      exampleSeparator: t.example_separator,
      prefix: t.prefix,
      suffix: t.suffix,
      templateFormat: t.template_format
    });
  }
}, Mg = class Qc extends Ti {
  lc_serializable = !0;
  examples;
  exampleSelector;
  examplePrompt;
  suffix = "";
  exampleSeparator = `

`;
  prefix = "";
  templateFormat = "f-string";
  validateTemplate = !0;
  _getPromptType() {
    return "few_shot_chat";
  }
  static lc_name() {
    return "FewShotChatMessagePromptTemplate";
  }
  constructor(t) {
    if (super(t), this.examples = t.examples, this.examplePrompt = t.examplePrompt, this.exampleSeparator = t.exampleSeparator ?? `

`, this.exampleSelector = t.exampleSelector, this.prefix = t.prefix ?? "", this.suffix = t.suffix ?? "", this.templateFormat = t.templateFormat ?? "f-string", this.validateTemplate = t.validateTemplate ?? !0, this.examples !== void 0 && this.exampleSelector !== void 0) throw new Error("Only one of 'examples' and 'example_selector' should be provided");
    if (this.examples === void 0 && this.exampleSelector === void 0) throw new Error("One of 'examples' and 'example_selector' should be provided");
    if (this.validateTemplate) {
      let n = this.inputVariables;
      this.partialVariables && (n = n.concat(Object.keys(this.partialVariables))), ps(this.prefix + this.suffix, this.templateFormat, n);
    }
  }
  async getExamples(t) {
    if (this.examples !== void 0) return this.examples;
    if (this.exampleSelector !== void 0) return this.exampleSelector.selectExamples(t);
    throw new Error("One of 'examples' and 'example_selector' should be provided");
  }
  /**
  * Formats the list of values and returns a list of formatted messages.
  * @param values The values to format the prompt with.
  * @returns A promise that resolves to a string representing the formatted prompt.
  */
  async formatMessages(t) {
    const n = await this.mergePartialAndUserVariables(t);
    let s = await this.getExamples(n);
    s = s.map((a) => {
      const i = {};
      return this.examplePrompt.inputVariables.forEach((o) => {
        i[o] = a[o];
      }), i;
    });
    const r = [];
    for (const a of s) {
      const i = await this.examplePrompt.formatMessages(a);
      r.push(...i);
    }
    return r;
  }
  /**
  * Formats the prompt with the given values.
  * @param values The values to format the prompt with.
  * @returns A promise that resolves to a string representing the formatted prompt.
  */
  async format(t) {
    const n = await this.mergePartialAndUserVariables(t), s = await this.getExamples(n), r = (await Promise.all(s.map((a) => this.examplePrompt.formatMessages(a)))).flat().map((a) => a.content);
    return Le([
      this.prefix,
      ...r,
      this.suffix
    ].join(this.exampleSeparator), this.templateFormat, n);
  }
  /**
  * Partially formats the prompt with the given values.
  * @param values The values to partially format the prompt with.
  * @returns A promise that resolves to an instance of `FewShotChatMessagePromptTemplate` with the given values partially formatted.
  */
  async partial(t) {
    const n = this.inputVariables.filter((r) => !(r in t)), s = {
      ...this.partialVariables ?? {},
      ...t
    };
    return new Qc({
      ...this,
      inputVariables: n,
      partialVariables: s
    });
  }
}, Ig = class Ds extends ds {
  static lc_name() {
    return "PipelinePromptTemplate";
  }
  pipelinePrompts;
  finalPrompt;
  constructor(t) {
    super({
      ...t,
      inputVariables: []
    }), this.pipelinePrompts = t.pipelinePrompts, this.finalPrompt = t.finalPrompt, this.inputVariables = this.computeInputValues();
  }
  /**
  * Computes the input values required by the pipeline prompts.
  * @returns Array of input values required by the pipeline prompts.
  */
  computeInputValues() {
    const t = this.pipelinePrompts.map((s) => s.name), n = this.pipelinePrompts.map((s) => s.prompt.inputVariables.filter((r) => !t.includes(r))).flat();
    return [...new Set(n)];
  }
  static extractRequiredInputValues(t, n) {
    return n.reduce((s, r) => (s[r] = t[r], s), {});
  }
  /**
  * Formats the pipeline prompts based on the provided input values.
  * @param values Input values to format the pipeline prompts.
  * @returns Promise that resolves with the formatted input values.
  */
  async formatPipelinePrompts(t) {
    const n = await this.mergePartialAndUserVariables(t);
    for (const { name: s, prompt: r } of this.pipelinePrompts) {
      const a = Ds.extractRequiredInputValues(n, r.inputVariables);
      r instanceof Ii ? n[s] = await r.formatMessages(a) : n[s] = await r.format(a);
    }
    return Ds.extractRequiredInputValues(n, this.finalPrompt.inputVariables);
  }
  /**
  * Formats the final prompt value based on the provided input values.
  * @param values Input values to format the final prompt value.
  * @returns Promise that resolves with the formatted final prompt value.
  */
  async formatPromptValue(t) {
    return this.finalPrompt.formatPromptValue(await this.formatPipelinePrompts(t));
  }
  async format(t) {
    return this.finalPrompt.format(await this.formatPipelinePrompts(t));
  }
  /**
  * Handles partial prompts, which are prompts that have been partially
  * filled with input values.
  * @param values Partial input values.
  * @returns Promise that resolves with a new PipelinePromptTemplate instance with updated input variables.
  */
  async partial(t) {
    const n = { ...this };
    return n.inputVariables = this.inputVariables.filter((s) => !(s in t)), n.partialVariables = {
      ...this.partialVariables ?? {},
      ...t
    }, new Ds(n);
  }
  serialize() {
    throw new Error("Not implemented.");
  }
  _getPromptType() {
    return "pipeline";
  }
};
function yo(e) {
  return typeof e == "object" && e != null && "withStructuredOutput" in e && typeof e.withStructuredOutput == "function";
}
function Ag(e) {
  return typeof e == "object" && e != null && "lc_id" in e && Array.isArray(e.lc_id) && e.lc_id.join("/") === "langchain_core/runnables/RunnableBinding";
}
var Og = class el extends Ii {
  schema;
  method;
  lc_namespace = [
    "langchain_core",
    "prompts",
    "structured"
  ];
  get lc_aliases() {
    return {
      ...super.lc_aliases,
      schema: "schema_"
    };
  }
  constructor(t) {
    super(t), this.schema = t.schema, this.method = t.method;
  }
  pipe(t) {
    if (yo(t)) return super.pipe(t.withStructuredOutput(this.schema));
    if (Ag(t) && yo(t.bound)) return super.pipe(new Ae({
      bound: t.bound.withStructuredOutput(this.schema, ...this.method ? [{ method: this.method }] : []),
      kwargs: t.kwargs ?? {},
      config: t.config,
      configFactories: t.configFactories
    }));
    throw new Error('Structured prompts need to be piped to a language model that supports the "withStructuredOutput()" method.');
  }
  static fromMessagesAndSchema(t, n, s) {
    return el.fromMessages(t, {
      schema: n,
      method: s
    });
  }
}, Pg = /* @__PURE__ */ F({
  AIMessagePromptTemplate: () => Yc,
  BaseChatPromptTemplate: () => Ti,
  BaseMessagePromptTemplate: () => wr,
  BaseMessageStringPromptTemplate: () => qc,
  BasePromptTemplate: () => ds,
  BaseStringPromptTemplate: () => Xn,
  ChatMessagePromptTemplate: () => Zc,
  ChatPromptTemplate: () => Ii,
  DEFAULT_FORMATTER_MAPPING: () => tr,
  DEFAULT_PARSER_MAPPING: () => Jc,
  DictPromptTemplate: () => _a,
  FewShotChatMessagePromptTemplate: () => Mg,
  FewShotPromptTemplate: () => xg,
  HumanMessagePromptTemplate: () => Mi,
  ImagePromptTemplate: () => js,
  MessagesPlaceholder: () => ba,
  PipelinePromptTemplate: () => Ig,
  PromptTemplate: () => At,
  StructuredPrompt: () => Og,
  SystemMessagePromptTemplate: () => Xc,
  checkValidTemplate: () => ps,
  interpolateFString: () => zc,
  interpolateMustache: () => Gc,
  parseFString: () => es,
  parseMustache: () => er,
  parseTemplate: () => nr,
  renderTemplate: () => Le
}), Ng = /* @__PURE__ */ F({ BaseDocumentCompressor: () => Rg }), Rg = class {
  static isBaseDocumentCompressor(e) {
    return e?.compressDocuments !== void 0;
  }
}, $g = /* @__PURE__ */ F({ BaseRetriever: () => Ai }), Ai = class extends ae {
  /**
  * Optional callbacks to handle various events in the retrieval process.
  */
  callbacks;
  /**
  * Tags to label or categorize the retrieval operation.
  */
  tags;
  /**
  * Metadata to provide additional context or information about the retrieval
  * operation.
  */
  metadata;
  /**
  * If set to `true`, enables verbose logging for the retrieval process.
  */
  verbose;
  /**
  * Constructs a new `BaseRetriever` instance with optional configuration fields.
  *
  * @param fields - Optional input configuration that can include `callbacks`,
  *                 `tags`, `metadata`, and `verbose` settings for custom retriever behavior.
  */
  constructor(e) {
    super(e), this.callbacks = e?.callbacks, this.tags = e?.tags ?? [], this.metadata = e?.metadata ?? {}, this.verbose = e?.verbose ?? !1;
  }
  /**
  * TODO: This should be an abstract method, but we'd like to avoid breaking
  * changes to people currently using subclassed custom retrievers.
  * Change it on next major release.
  */
  /**
  * Placeholder method for retrieving relevant documents based on a query.
  *
  * This method is intended to be implemented by subclasses and will be
  * converted to an abstract method in the next major release. Currently, it
  * throws an error if not implemented, ensuring that custom retrievers define
  * the specific retrieval logic.
  *
  * @param _query - The query string used to search for relevant documents.
  * @param _callbacks - (optional) Callback manager for managing callbacks
  *                     during retrieval.
  * @returns A promise resolving to an array of `DocumentInterface` instances relevant to the query.
  * @throws {Error} Throws an error indicating the method is not implemented.
  */
  _getRelevantDocuments(e, t) {
    throw new Error("Not implemented!");
  }
  /**
  * Executes a retrieval operation.
  *
  * @param input - The query string used to search for relevant documents.
  * @param options - (optional) Configuration options for the retrieval run,
  *                  which may include callbacks, tags, and metadata.
  * @returns A promise that resolves to an array of `DocumentInterface` instances
  *          representing the most relevant documents to the query.
  */
  async invoke(e, t) {
    const n = ct(fr(t)), s = await (await Gt.configure(n.callbacks, this.callbacks, n.tags, this.tags, n.metadata, this.metadata, { verbose: this.verbose }))?.handleRetrieverStart(this.toJSON(), e, n.runId, void 0, void 0, void 0, n.runName);
    try {
      const r = await this._getRelevantDocuments(e, s);
      return await s?.handleRetrieverEnd(r), r;
    } catch (r) {
      throw await s?.handleRetrieverError(r), r;
    }
  }
}, jg = /* @__PURE__ */ F({
  BaseStore: () => tl,
  InMemoryStore: () => Lg
}), tl = class extends xn {
}, Lg = class extends tl {
  lc_namespace = ["langchain", "storage"];
  store = {};
  /**
  * Retrieves the values associated with the given keys from the store.
  * @param keys Keys to retrieve values for.
  * @returns Array of values associated with the given keys.
  */
  async mget(t) {
    return t.map((n) => this.store[n]);
  }
  /**
  * Sets the values for the given keys in the store.
  * @param keyValuePairs Array of key-value pairs to set in the store.
  * @returns Promise that resolves when all key-value pairs have been set.
  */
  async mset(t) {
    for (const [n, s] of t) this.store[n] = s;
  }
  /**
  * Deletes the given keys and their associated values from the store.
  * @param keys Keys to delete from the store.
  * @returns Promise that resolves when all keys have been deleted.
  */
  async mdelete(t) {
    for (const n of t) delete this.store[n];
  }
  /**
  * Asynchronous generator that yields keys from the store. If a prefix is
  * provided, it only yields keys that start with the prefix.
  * @param prefix Optional prefix to filter keys.
  * @returns AsyncGenerator that yields keys from the store.
  */
  async *yieldKeys(t) {
    const n = Object.keys(this.store);
    for (const s of n) (t === void 0 || s.startsWith(t)) && (yield s);
  }
};
const Tt = {
  and: "and",
  or: "or",
  not: "not"
}, H = {
  eq: "eq",
  ne: "ne",
  lt: "lt",
  gt: "gt",
  lte: "lte",
  gte: "gte"
};
var nl = class {
}, Oi = class {
  accept(e) {
    if (this.exprName === "Operation") return e.visitOperation(this);
    if (this.exprName === "Comparison") return e.visitComparison(this);
    if (this.exprName === "StructuredQuery") return e.visitStructuredQuery(this);
    throw new Error("Unknown Expression type");
  }
}, Pi = class extends Oi {
}, Dg = class extends Pi {
  exprName = "Comparison";
  constructor(e, t, n) {
    super(), this.comparator = e, this.attribute = t, this.value = n;
  }
}, Fg = class extends Pi {
  exprName = "Operation";
  constructor(e, t) {
    super(), this.operator = e, this.args = t;
  }
}, Vg = class extends Oi {
  exprName = "StructuredQuery";
  constructor(e, t) {
    super(), this.query = e, this.filter = t;
  }
};
function sl(e) {
  return e && typeof e == "object" && !Array.isArray(e);
}
function $e(e) {
  return e ? typeof e == "string" && e.length > 0 || typeof e == "function" ? !1 : sl(e) && Object.keys(e).length === 0 : !0;
}
function rl(e) {
  if (typeof e == "number") return e % 1 === 0;
  if (typeof e == "string") {
    const t = parseInt(e, 10);
    return !Number.isNaN(t) && t % 1 === 0 && t.toString() === e;
  }
  return !1;
}
function al(e) {
  if (typeof e == "number") return e % 1 !== 0;
  if (typeof e == "string") {
    const t = parseFloat(e);
    return !Number.isNaN(t) && t % 1 !== 0 && t.toString() === e;
  }
  return !1;
}
function il(e) {
  return typeof e == "string" && (Number.isNaN(parseFloat(e)) || parseFloat(e).toString() !== e);
}
function ol(e) {
  return typeof e == "boolean";
}
function Ni(e) {
  let t;
  if (il(e)) t = e;
  else if (rl(e)) t = parseInt(e, 10);
  else if (al(e)) t = parseFloat(e);
  else if (ol(e)) t = !!e;
  else throw new Error("Unsupported value type");
  return t;
}
var Ri = class extends nl {
}, Bg = class extends Ri {
  allowedOperators;
  allowedComparators;
  constructor(e) {
    super(), this.allowedOperators = e?.allowedOperators ?? [Tt.and, Tt.or], this.allowedComparators = e?.allowedComparators ?? [
      H.eq,
      H.ne,
      H.gt,
      H.gte,
      H.lt,
      H.lte
    ];
  }
  formatFunction(e) {
    if (e in H) {
      if (this.allowedComparators.length > 0 && this.allowedComparators.indexOf(e) === -1) throw new Error(`Comparator ${e} not allowed. Allowed comparators: ${this.allowedComparators.join(", ")}`);
    } else if (e in Tt) {
      if (this.allowedOperators.length > 0 && this.allowedOperators.indexOf(e) === -1) throw new Error(`Operator ${e} not allowed. Allowed operators: ${this.allowedOperators.join(", ")}`);
    } else throw new Error("Unknown comparator or operator");
    return `$${e}`;
  }
  /**
  * Visits an operation and returns a result.
  * @param operation The operation to visit.
  * @returns The result of visiting the operation.
  */
  visitOperation(e) {
    const t = e.args?.map((n) => n.accept(this));
    return { [this.formatFunction(e.operator)]: t };
  }
  /**
  * Visits a comparison and returns a result.
  * @param comparison The comparison to visit.
  * @returns The result of visiting the comparison.
  */
  visitComparison(e) {
    return { [e.attribute]: { [this.formatFunction(e.comparator)]: Ni(e.value) } };
  }
  /**
  * Visits a structured query and returns a result.
  * @param query The structured query to visit.
  * @returns The result of visiting the structured query.
  */
  visitStructuredQuery(e) {
    let t = {};
    return e.filter && (t = { filter: e.filter.accept(this) }), t;
  }
  mergeFilters(e, t, n = "and", s = !1) {
    if (!($e(e) && $e(t))) {
      if ($e(e) || n === "replace")
        return $e(t) ? void 0 : t;
      if ($e(t))
        return s ? e : n === "and" ? void 0 : e;
      if (n === "and") return { $and: [e, t] };
      if (n === "or") return { $or: [e, t] };
      throw new Error("Unknown merge type");
    }
  }
}, Hg = class extends Ri {
  allowedOperators = [Tt.and, Tt.or];
  allowedComparators = [
    H.eq,
    H.ne,
    H.gt,
    H.gte,
    H.lt,
    H.lte
  ];
  formatFunction() {
    throw new Error("Not implemented");
  }
  /**
  * Returns the allowed comparators for a given data type.
  * @param input The input value to get the allowed comparators for.
  * @returns An array of allowed comparators for the input data type.
  */
  getAllowedComparatorsForType(e) {
    switch (e) {
      case "string":
        return [
          H.eq,
          H.ne,
          H.gt,
          H.gte,
          H.lt,
          H.lte
        ];
      case "number":
        return [
          H.eq,
          H.ne,
          H.gt,
          H.gte,
          H.lt,
          H.lte
        ];
      case "boolean":
        return [H.eq, H.ne];
      default:
        throw new Error(`Unsupported data type: ${e}`);
    }
  }
  /**
  * Returns a function that performs a comparison based on the provided
  * comparator.
  * @param comparator The comparator to base the comparison function on.
  * @returns A function that takes two arguments and returns a boolean based on the comparison.
  */
  getComparatorFunction(e) {
    switch (e) {
      case H.eq:
        return (t, n) => t === n;
      case H.ne:
        return (t, n) => t !== n;
      case H.gt:
        return (t, n) => t > n;
      case H.gte:
        return (t, n) => t >= n;
      case H.lt:
        return (t, n) => t < n;
      case H.lte:
        return (t, n) => t <= n;
      default:
        throw new Error("Unknown comparator");
    }
  }
  /**
  * Returns a function that performs an operation based on the provided
  * operator.
  * @param operator The operator to base the operation function on.
  * @returns A function that takes two boolean arguments and returns a boolean based on the operation.
  */
  getOperatorFunction(e) {
    switch (e) {
      case Tt.and:
        return (t, n) => t && n;
      case Tt.or:
        return (t, n) => t || n;
      default:
        throw new Error("Unknown operator");
    }
  }
  /**
  * Visits the operation part of a structured query and translates it into
  * a functional filter.
  * @param operation The operation part of a structured query.
  * @returns A function that takes a `Document` as an argument and returns a boolean based on the operation.
  */
  visitOperation(e) {
    const { operator: t, args: n } = e;
    if (this.allowedOperators.includes(t)) {
      const s = this.getOperatorFunction(t);
      return (r) => n ? n.reduce((a, i) => {
        const o = i.accept(this);
        if (typeof o == "function") return s(a, o(r));
        throw new Error("Filter is not a function");
      }, !0) : !0;
    } else throw new Error("Operator not allowed");
  }
  /**
  * Visits the comparison part of a structured query and translates it into
  * a functional filter.
  * @param comparison The comparison part of a structured query.
  * @returns A function that takes a `Document` as an argument and returns a boolean based on the comparison.
  */
  visitComparison(e) {
    const { comparator: t, attribute: n, value: s } = e, r = [H.ne];
    if (this.allowedComparators.includes(t)) {
      if (!this.getAllowedComparatorsForType(typeof s).includes(t)) throw new Error(`'${t}' comparator not allowed to be used with ${typeof s}`);
      const a = this.getComparatorFunction(t);
      return (i) => {
        const o = i.metadata[n];
        return o === void 0 ? !!r.includes(t) : a(o, Ni(s));
      };
    } else throw new Error("Comparator not allowed");
  }
  /**
  * Visits a structured query and translates it into a functional filter.
  * @param query The structured query to translate.
  * @returns An object containing a `filter` property, which is a function that takes a `Document` as an argument and returns a boolean based on the structured query.
  */
  visitStructuredQuery(e) {
    if (!e.filter) return {};
    const t = e.filter?.accept(this);
    if (typeof t != "function") throw new Error("Structured query filter is not a function");
    return { filter: t };
  }
  /**
  * Merges two filters into one, based on the specified merge type.
  * @param defaultFilter The default filter function.
  * @param generatedFilter The generated filter function.
  * @param mergeType The type of merge to perform. Can be 'and', 'or', or 'replace'. Default is 'and'.
  * @returns A function that takes a `Document` as an argument and returns a boolean based on the merged filters, or `undefined` if both filters are empty.
  */
  mergeFilters(e, t, n = "and") {
    if (!($e(e) && $e(t))) {
      if ($e(e) || n === "replace")
        return $e(t) ? void 0 : t;
      if ($e(t))
        return n === "and" ? void 0 : e;
      if (n === "and") return (s) => e(s) && t(s);
      if (n === "or") return (s) => e(s) || t(s);
      throw new Error("Unknown merge type");
    }
  }
}, Ug = /* @__PURE__ */ F({
  BaseTranslator: () => Ri,
  BasicTranslator: () => Bg,
  Comparators: () => H,
  Comparison: () => Dg,
  Expression: () => Oi,
  FilterDirective: () => Pi,
  FunctionalTranslator: () => Hg,
  Operation: () => Fg,
  Operators: () => Tt,
  StructuredQuery: () => Vg,
  Visitor: () => nl,
  castValue: () => Ni,
  isBoolean: () => ol,
  isFilterEmpty: () => $e,
  isFloat: () => al,
  isInt: () => rl,
  isObject: () => sl,
  isString: () => il
});
function ms(e) {
  if (e == null || typeof e != "object") return !1;
  const t = e;
  return typeof t.text < "u" && typeof t.toolCalls < "u" && typeof t.reasoning < "u" && typeof t.usage < "u" && typeof t.output < "u" && typeof t[Symbol.asyncIterator] == "function";
}
function cl(e, t, n) {
  return e == null ? !1 : Object.entries(t).every(([s, r]) => n(e[s], r));
}
function ll(e, t, n) {
  return e == null ? !1 : cl(e, t, n);
}
function ul(e) {
  return e.content.find((t) => t.type === "text")?.text;
}
function Wg(e, t, n) {
  if (t.id !== void 0 && e.id !== t.id || t.text !== void 0 && ul(e) !== t.text) return !1;
  if (t.toolCalls !== void 0) {
    const s = e.tool_calls ?? [];
    if (s.length !== t.toolCalls.length) return !1;
    for (let r = 0; r < t.toolCalls.length; r++) {
      const a = s[r], i = t.toolCalls[r];
      if (a?.name !== i.name || !n(a.args, i.args)) return !1;
    }
  }
  return !(t.usage !== void 0 && !ll(e.usage_metadata, t.usage, n) || t.responseMetadata !== void 0 && !cl(e.response_metadata, t.responseMetadata, n));
}
function gs(e, t, n) {
  return {
    pass: !1,
    message: () => `${n.matcherHint(t)}

Expected: ChatModelStream (return value of model.streamEvents("Hello"))
Received: ${n.printReceived(e)}`,
    actual: e,
    expected: "ChatModelStream"
  };
}
function ys(e, t) {
  return t ? !e : e;
}
async function zg(e, t) {
  const { isNot: n, utils: s } = this, r = "toHaveStreamText";
  if (!ms(e)) return gs(e, r, s);
  const a = await e.text;
  return {
    pass: ys(a === t, n),
    message: () => `${s.matcherHint(r, void 0, void 0, { isNot: n })}

Expected stream text: ${n ? "not " : ""}${s.printExpected(t)}
Received stream text: ${s.printReceived(a)}`,
    actual: a,
    expected: t
  };
}
async function Gg(e, t) {
  const { isNot: n, utils: s } = this, r = "toHaveStreamReasoning";
  if (!ms(e)) return gs(e, r, s);
  const a = await e.reasoning;
  return {
    pass: ys(a === t, n),
    message: () => `${s.matcherHint(r, void 0, void 0, { isNot: n })}

Expected stream reasoning: ${n ? "not " : ""}${s.printExpected(t)}
Received stream reasoning: ${s.printReceived(a)}`,
    actual: a,
    expected: t
  };
}
async function Jg(e, t) {
  const { isNot: n, utils: s } = this, r = "toHaveStreamToolCalls";
  if (!ms(e)) return gs(e, r, s);
  const a = await e.toolCalls;
  let i = a.length === t.length && t.every((o, c) => {
    const l = a[c];
    return l?.name === o.name && this.equals(l.args, o.args);
  });
  return i = ys(i, n), {
    pass: i,
    message: () => `${s.matcherHint(r, void 0, void 0, { isNot: n })}

Expected stream tool calls: ${s.printExpected(t)}
Received stream tool calls: ${s.printReceived(a.map((o) => ({
      name: o.name,
      args: o.args
    })))}`,
    actual: a.map((o) => ({
      name: o.name,
      args: o.args
    })),
    expected: t
  };
}
async function Kg(e, t) {
  const { isNot: n, utils: s } = this, r = "toHaveStreamUsage";
  if (!ms(e)) return gs(e, r, s);
  const a = await e.usage;
  return {
    pass: ys(ll(a, t, this.equals), n),
    message: () => `${s.matcherHint(r, void 0, void 0, { isNot: n })}

Expected stream usage: ${s.printExpected(t)}
Received stream usage: ${s.printReceived(a)}`,
    actual: a,
    expected: t
  };
}
async function qg(e, t) {
  const { isNot: n, utils: s } = this, r = "toHaveStreamOutput";
  if (!ms(e)) return gs(e, r, s);
  const a = await e.output;
  return {
    pass: ys(Wg(a, t, this.equals), n),
    message: () => `${s.matcherHint(r, void 0, void 0, { isNot: n })}

Expected stream output: ${s.printExpected(t)}
Received stream output: ${s.printReceived({
      id: a.id,
      text: ul(a),
      tool_calls: a.tool_calls?.map((i) => ({
        name: i.name,
        args: i.args
      })),
      usage_metadata: a.usage_metadata,
      response_metadata: a.response_metadata
    })}`,
    actual: a,
    expected: t
  };
}
const $i = {
  toHaveStreamText: zg,
  toHaveStreamReasoning: Gg,
  toHaveStreamToolCalls: Jg,
  toHaveStreamUsage: Kg,
  toHaveStreamOutput: qg
};
function ts(e) {
  return ve.isInstance(e) ? e.constructor.name || e.type : typeof e;
}
function vr(e, t) {
  return function(n, s) {
    const { isNot: r, utils: a } = this;
    if (!t(n)) return {
      pass: !1,
      message: () => `${a.matcherHint(`toBe${e}`, void 0, void 0)}

Expected: ${r ? "not " : ""}${e}
Received: ${ts(n)}`,
      actual: ts(n),
      expected: e
    };
    if (s === void 0) return {
      pass: !0,
      message: () => `${a.matcherHint(`toBe${e}`, void 0, void 0)}

Expected: not ${e}
Received: ${e}`
    };
    const i = n;
    return typeof s == "string" ? {
      pass: i.content === s,
      message: () => `${a.matcherHint(`toBe${e}`, void 0, void 0)}

Expected: ${e} with content ${a.printExpected(s)}
Received: ${e} with content ${a.printReceived(i.content)}`,
      actual: i.content,
      expected: s
    } : {
      pass: Object.entries(s).every(([o, c]) => this.equals(i[o], c)),
      message: () => {
        const o = {};
        for (const c of Object.keys(s)) o[c] = i[c];
        return `${a.matcherHint(`toBe${e}`, void 0, void 0)}

Expected: ${e} matching ${a.printExpected(s)}
Received: ${e} with ${a.printReceived(o)}`;
      },
      actual: (() => {
        const o = {};
        for (const c of Object.keys(s)) o[c] = i[c];
        return o;
      })(),
      expected: s
    };
  };
}
const hl = vr("HumanMessage", $t.isInstance), dl = vr("AIMessage", U.isInstance), fl = vr("SystemMessage", Pe.isInstance), pl = vr("ToolMessage", J.isInstance);
function ml(e, t) {
  const { isNot: n, utils: s } = this;
  if (!U.isInstance(e)) return {
    pass: !1,
    message: () => `${s.matcherHint("toHaveToolCalls")}

Expected: AIMessage
Received: ${ts(e)}`
  };
  const r = e.tool_calls ?? [];
  if (r.length !== t.length) return {
    pass: !1,
    message: () => `${s.matcherHint("toHaveToolCalls")}

Expected ${n ? "not " : ""}${t.length} tool call(s), received ${r.length}`,
    actual: r.length,
    expected: t.length
  };
  const a = t.filter((i) => !r.some((o) => Object.entries(i).every(([c, l]) => this.equals(o[c], l))));
  return a.length > 0 ? {
    pass: !1,
    message: () => `${s.matcherHint("toHaveToolCalls")}

Could not find matching tool call(s) for:
${s.printExpected(a)}
Received tool calls: ${s.printReceived(r.map((i) => ({
      name: i.name,
      id: i.id,
      args: i.args
    })))}`,
    actual: r.map((i) => ({
      name: i.name,
      id: i.id,
      args: i.args
    })),
    expected: t
  } : {
    pass: !0,
    message: () => `${s.matcherHint("toHaveToolCalls")}

Expected AIMessage not to have matching tool calls`
  };
}
function gl(e, t) {
  const { isNot: n, utils: s } = this;
  if (!U.isInstance(e)) return {
    pass: !1,
    message: () => `${s.matcherHint("toHaveToolCallCount")}

Expected: AIMessage
Received: ${ts(e)}`
  };
  const r = e.tool_calls?.length ?? 0;
  return {
    pass: r === t,
    message: () => `${s.matcherHint("toHaveToolCallCount")}

Expected ${n ? "not " : ""}${t} tool call(s)
Received: ${r}`,
    actual: r,
    expected: t
  };
}
function yl(e, t) {
  const { isNot: n, utils: s } = this;
  if (!U.isInstance(e)) return {
    pass: !1,
    message: () => `${s.matcherHint("toContainToolCall")}

Expected: AIMessage
Received: ${ts(e)}`
  };
  const r = e.tool_calls ?? [];
  return {
    pass: r.some((a) => Object.entries(t).every(([i, o]) => this.equals(a[i], o))),
    message: () => `${s.matcherHint("toContainToolCall")}

Expected AIMessage ${n ? "not " : ""}to contain a tool call matching ${s.printExpected(t)}
Received tool calls: ${s.printReceived(r.map((a) => ({
      name: a.name,
      id: a.id
    })))}`,
    actual: r.map((a) => ({
      name: a.name,
      id: a.id
    })),
    expected: t
  };
}
function _l(e, t) {
  const { isNot: n, utils: s } = this;
  if (!Array.isArray(e)) return {
    pass: !1,
    message: () => `${s.matcherHint("toHaveToolMessages")}

Expected an array of messages
Received: ${typeof e}`
  };
  const r = e.filter(J.isInstance);
  if (r.length !== t.length) return {
    pass: !1,
    message: () => `${s.matcherHint("toHaveToolMessages")}

Expected ${n ? "not " : ""}${t.length} tool message(s), found ${r.length}`,
    actual: r.length,
    expected: t.length
  };
  for (let a = 0; a < t.length; a++) if (!Object.entries(t[a]).every(([i, o]) => this.equals(r[a][i], o))) return {
    pass: !1,
    message: () => {
      const i = {};
      for (const o of Object.keys(t[a])) i[o] = r[a][o];
      return `${s.matcherHint("toHaveToolMessages")}

Tool message at index ${a} did not match:
Expected: ${s.printExpected(t[a])}
Received: ${s.printReceived(i)}`;
    },
    actual: r[a],
    expected: t[a]
  };
  return {
    pass: !0,
    message: () => `${s.matcherHint("toHaveToolMessages")}

Expected messages not to contain matching tool messages`
  };
}
function wl(e, t) {
  const { isNot: n, utils: s } = this, r = e?.__interrupt__;
  if (!(Array.isArray(r) && r.length > 0)) return {
    pass: !1,
    message: () => `${s.matcherHint("toHaveBeenInterrupted")}

Expected result ${n ? "not " : ""}to have been interrupted
Received __interrupt__: ${s.printReceived(r)}`
  };
  if (t === void 0) return {
    pass: !0,
    message: () => `${s.matcherHint("toHaveBeenInterrupted")}

Expected result not to have been interrupted
Received ${r.length} interrupt(s)`
  };
  const a = r[0]?.value;
  return {
    pass: this.equals(a, t),
    message: () => `${s.matcherHint("toHaveBeenInterrupted")}

Expected interrupt value: ${s.printExpected(t)}
Received interrupt value: ${s.printReceived(a)}`,
    actual: a,
    expected: t
  };
}
function vl(e, t) {
  const { isNot: n, utils: s } = this, r = e?.structuredResponse;
  return r === void 0 ? {
    pass: !1,
    message: () => `${s.matcherHint("toHaveStructuredResponse")}

Expected result ${n ? "not " : ""}to have a structured response
Received structuredResponse: undefined`
  } : t === void 0 ? {
    pass: !0,
    message: () => `${s.matcherHint("toHaveStructuredResponse")}

Expected result not to have a structured response`
  } : {
    pass: Object.entries(t).every(([a, i]) => this.equals(r[a], i)),
    message: () => `${s.matcherHint("toHaveStructuredResponse")}

Expected structured response: ${s.printExpected(t)}
Received structured response: ${s.printReceived(r)}`,
    actual: r,
    expected: t
  };
}
const Zg = {
  toBeHumanMessage: hl,
  toBeAIMessage: dl,
  toBeSystemMessage: fl,
  toBeToolMessage: pl,
  toHaveToolCalls: ml,
  toHaveToolCallCount: gl,
  toContainToolCall: yl,
  toHaveToolMessages: _l,
  toHaveBeenInterrupted: wl,
  toHaveStructuredResponse: vl,
  ...$i
};
function Yg(e) {
  return e.map((t) => t.text).filter(Boolean).join("-");
}
let _o = 0;
function Xg() {
  return _o += 1, `fake_tc_${_o}`;
}
var bl = class Sl extends cs {
  queue = [];
  _alwaysThrowError;
  _structuredResponseValue;
  _tools = [];
  _state = {
    callIndex: 0,
    calls: []
  };
  /**
  * All invocations recorded by this model, in order.
  * Each entry contains the `messages` array and `options` that were
  * passed to `invoke()`.
  */
  get calls() {
    return this._state.calls;
  }
  /**
  * The number of times this model has been invoked.
  */
  get callCount() {
    return this._state.calls.length;
  }
  constructor() {
    super({});
  }
  _llmType() {
    return "fake-model-builder";
  }
  _combineLLMOutput() {
    return [];
  }
  /**
  * Enqueue a response that the model will return on its next invocation.
  * @param entry A {@link BaseMessage} to return, an `Error` to throw, or
  *   a factory `(messages) => BaseMessage | Error` for dynamic responses.
  * @returns `this`, for chaining.
  */
  respond(t) {
    return typeof t == "function" ? this.queue.push({
      kind: "factory",
      factory: t
    }) : ve.isInstance(t) ? this.queue.push({
      kind: "message",
      message: t
    }) : this.queue.push({
      kind: "error",
      error: t
    }), this;
  }
  /**
  * Enqueue an {@link AIMessage} that carries the given tool calls.
  * Content is derived from the input messages at invocation time.
  * @param toolCalls Array of tool calls. Each entry needs `name` and
  *   `args`; `id` is optional and auto-generated when omitted.
  * @returns `this`, for chaining.
  */
  respondWithTools(t) {
    return this.queue.push({
      kind: "toolCalls",
      toolCalls: t.map((n) => ({
        name: n.name,
        args: n.args,
        id: n.id ?? Xg(),
        type: "tool_call"
      }))
    }), this;
  }
  /**
  * Make every invocation throw the given error, regardless of the queue.
  * @param error The error to throw.
  * @returns `this`, for chaining.
  */
  alwaysThrow(t) {
    return this._alwaysThrowError = t, this;
  }
  /**
  * Set the value that {@link withStructuredOutput} will resolve to.
  * @param value The structured object to return.
  * @returns `this`, for chaining.
  */
  structuredResponse(t) {
    return this._structuredResponseValue = t, this;
  }
  /**
  * Bind tools to the model. Returns a new model that shares the same
  * response queue and call history.
  * @param tools The tools to bind, as {@link StructuredTool} instances or
  *   plain {@link ToolSpec} objects.
  * @returns A new RunnableBinding with the tools bound.
  */
  bindTools(t) {
    const n = [...this._tools, ...t], s = new Sl();
    return s.queue = this.queue, s._alwaysThrowError = this._alwaysThrowError, s._structuredResponseValue = this._structuredResponseValue, s._tools = n, s._state = this._state, s.withConfig({});
  }
  /**
  * Returns a {@link Runnable} that produces the {@link structuredResponse}
  * value. The schema argument is accepted for compatibility but ignored.
  * @param _params Schema or params (ignored).
  * @param _config Options (ignored).
  * @returns A Runnable that resolves to the structured response value.
  */
  withStructuredOutput(t, n) {
    const { _structuredResponseValue: s } = this;
    return dt.from(async () => s);
  }
  async _generate(t, n, s) {
    this._state.calls.push({
      messages: [...t],
      options: n
    });
    const r = this._state.callIndex;
    if (this._state.callIndex += 1, this._alwaysThrowError) throw this._alwaysThrowError;
    const a = this.queue[r];
    if (!a) throw new Error(`FakeModel: no response queued for invocation ${r} (${this.queue.length} total queued).`);
    if (a.kind === "error") throw a.error;
    if (a.kind === "factory") {
      const o = a.factory(t);
      if (!ve.isInstance(o)) throw o;
      return { generations: [{
        text: "",
        message: o
      }] };
    }
    if (a.kind === "message") return { generations: [{
      text: "",
      message: a.message
    }] };
    const i = Yg(t);
    return {
      generations: [{
        text: i,
        message: new U({
          content: i,
          id: r.toString(),
          tool_calls: a.toolCalls.length > 0 ? a.toolCalls.map((o) => ({
            ...o,
            type: "tool_call"
          })) : void 0
        })
      }],
      llmOutput: {}
    };
  }
};
function Qg() {
  return new bl();
}
function kl(e) {
  return { async *[Symbol.asyncIterator]() {
    for (const t of e) yield t;
  } };
}
function Cl(e = "test-model") {
  const t = ji(e), n = t[t.length - 1];
  return t[t.length - 1] = {
    ...n,
    usage: {
      prompt_tokens: 10,
      completion_tokens: 2,
      total_tokens: 12
    }
  }, t;
}
function ji(e = "test-model") {
  return [
    {
      id: "chatcmpl-text",
      model: e,
      choices: [{
        index: 0,
        delta: {
          role: "assistant",
          content: "Hello"
        },
        finish_reason: null
      }]
    },
    {
      id: "chatcmpl-text",
      model: e,
      choices: [{
        index: 0,
        delta: { content: " world" },
        finish_reason: null
      }]
    },
    {
      id: "chatcmpl-text",
      model: e,
      choices: [{
        index: 0,
        delta: {},
        finish_reason: "stop"
      }]
    }
  ];
}
function El(e = "test-model") {
  return [
    {
      id: "chatcmpl-reason",
      model: e,
      choices: [{
        index: 0,
        delta: {
          role: "assistant",
          reasoning_content: "Let me reason..."
        },
        finish_reason: null
      }]
    },
    {
      id: "chatcmpl-reason",
      model: e,
      choices: [{
        index: 0,
        delta: { content: "Answer." },
        finish_reason: null
      }]
    },
    {
      id: "chatcmpl-reason",
      model: e,
      choices: [{
        index: 0,
        delta: {},
        finish_reason: "stop"
      }]
    }
  ];
}
function Tl(e = "test-model") {
  return [
    {
      id: "chatcmpl-tools",
      model: e,
      choices: [{
        index: 0,
        delta: {
          role: "assistant",
          content: "Let me search."
        },
        finish_reason: null
      }]
    },
    {
      id: "chatcmpl-tools",
      model: e,
      choices: [{
        index: 0,
        delta: { tool_calls: [{
          index: 0,
          id: "call_abc",
          type: "function",
          function: {
            name: "web_search",
            arguments: '{"query"'
          }
        }] },
        finish_reason: null
      }]
    },
    {
      id: "chatcmpl-tools",
      model: e,
      choices: [{
        index: 0,
        delta: { tool_calls: [{
          index: 0,
          function: { arguments: ':"weather"}' }
        }] },
        finish_reason: null
      }]
    },
    {
      id: "chatcmpl-tools",
      model: e,
      choices: [{
        index: 0,
        delta: {},
        finish_reason: "tool_calls"
      }]
    }
  ];
}
function xl(e) {
  const t = new TextEncoder();
  return new Response(new ReadableStream({ start(n) {
    for (const s of e) n.enqueue(t.encode(`data: ${JSON.stringify(s)}

`));
    n.close();
  } }), {
    status: 200,
    headers: { "Content-Type": "text/event-stream" }
  });
}
var ey = /* @__PURE__ */ F({
  FakeBuiltModel: () => bl,
  asAsyncIterable: () => kl,
  fakeModel: () => Qg,
  langchainMatchers: () => Zg,
  openAIReasoningTextChunks: () => El,
  openAITextOnlyChunks: () => ji,
  openAITextOnlyChunksWithUsage: () => Cl,
  openAIToolCallChunks: () => Tl,
  sseResponseFromOpenAIChunks: () => xl,
  streamMatchers: () => $i,
  toBeAIMessage: () => dl,
  toBeHumanMessage: () => hl,
  toBeSystemMessage: () => fl,
  toBeToolMessage: () => pl,
  toContainToolCall: () => yl,
  toHaveBeenInterrupted: () => wl,
  toHaveStructuredResponse: () => vl,
  toHaveToolCallCount: () => gl,
  toHaveToolCalls: () => ml,
  toHaveToolMessages: () => _l
}), ty = /* @__PURE__ */ F({ RunCollectorCallbackHandler: () => ny }), ny = class extends ii {
  /** The name of the callback handler. */
  name = "run_collector";
  /** The ID of the example. */
  exampleId;
  /** An array of traced runs. */
  tracedRuns;
  /**
  * Creates a new instance of the RunCollectorCallbackHandler class.
  * @param exampleId The ID of the example.
  */
  constructor({ exampleId: e } = {}) {
    super({ _awaitHandler: !0 }), this.exampleId = e, this.tracedRuns = [];
  }
  /**
  * Persists the given run object.
  * @param run The run object to persist.
  */
  async persistRun(e) {
    const t = { ...e };
    t.reference_example_id = this.exampleId, this.tracedRuns.push(t);
  }
}, sy = /* @__PURE__ */ F({}), ry = /* @__PURE__ */ F({ context: () => ay });
function ay(e, ...t) {
  const n = e.raw;
  let s = "";
  for (let r = 0; r < n.length; r++) {
    const a = n[r].replace(/\\\n[ \t]*/g, "").replace(/\\`/g, "`").replace(/\\\$/g, "$").replace(/\\\{/g, "{");
    if (s += a, r < t.length) {
      const i = iy(t[r], s);
      s += typeof i == "string" ? i : JSON.stringify(i);
    }
  }
  return s = oy(s), s = s.trim(), s = s.replace(/\\n/g, `
`), s;
}
function iy(e, t) {
  if (typeof e != "string" || !e.includes(`
`)) return e;
  const n = t.slice(t.lastIndexOf(`
`) + 1).match(/^(\s+)/);
  if (n) {
    const s = n[1];
    return e.replace(/\n/g, `
${s}`);
  }
  return e;
}
function oy(e) {
  const t = e.split(`
`);
  let n = null;
  for (const s of t) {
    const r = s.match(/^(\s+)\S+/);
    if (r) {
      const a = r[1].length;
      n === null ? n = a : n = Math.min(n, a);
    }
  }
  return n === null ? e : t.map((s) => s[0] === " " || s[0] === "	" ? s.slice(n) : s).join(`
`);
}
var cy = /* @__PURE__ */ F({
  EventStreamContentType: () => ly,
  convertEventStreamToIterableReadableDataStream: () => hy,
  getBytes: () => Ml,
  getLines: () => Il,
  getMessages: () => Al
});
const ly = "text/event-stream";
async function Ml(e, t) {
  if (e instanceof ReadableStream) {
    const n = e.getReader();
    for (; ; ) {
      const s = await n.read();
      if (s.done) {
        t(new Uint8Array(), !0);
        break;
      }
      t(s.value);
    }
  } else try {
    for await (const n of e) t(new Uint8Array(n));
    t(new Uint8Array(), !0);
  } catch (n) {
    throw new Error([
      "Parsing event source stream failed.",
      "Ensure your implementation of fetch returns a web or Node readable stream.",
      `Error: ${n.message}`
    ].join(`
`));
  }
}
function Il(e) {
  let t, n, s, r = !1;
  return function(i, o) {
    if (o) {
      e(i, 0, !0);
      return;
    }
    t === void 0 ? (t = i, n = 0, s = -1) : t = uy(t, i);
    const c = t.length;
    let l = 0;
    for (; n < c; ) {
      r && (t[n] === 10 && (l = ++n), r = !1);
      let u = -1;
      for (; n < c && u === -1; ++n) switch (t[n]) {
        case 58:
          s === -1 && (s = n - l);
          break;
        case 13:
          r = !0;
        case 10:
          u = n;
          break;
      }
      if (u === -1) break;
      e(t.subarray(l, u), s), l = n, s = -1;
    }
    l === c ? t = void 0 : l !== 0 && (t = t.subarray(l), n -= l);
  };
}
function Al(e, t, n) {
  let s = $r();
  const r = new TextDecoder();
  return function(i, o, c) {
    if (c) {
      dy(s) || (e?.(s), s = $r());
      return;
    }
    if (i.length === 0)
      e?.(s), s = $r();
    else if (o > 0) {
      const l = r.decode(i.subarray(0, o)), u = o + (i[o + 1] === 32 ? 2 : 1), d = r.decode(i.subarray(u));
      switch (l) {
        case "data":
          s.data = s.data ? s.data + `
` + d : d;
          break;
        case "event":
          s.event = d;
          break;
        case "id":
          t?.(s.id = d);
          break;
        case "retry": {
          const h = parseInt(d, 10);
          Number.isNaN(h) || n?.(s.retry = h);
          break;
        }
      }
    }
  };
}
function uy(e, t) {
  const n = new Uint8Array(e.length + t.length);
  return n.set(e), n.set(t, e.length), n;
}
function $r() {
  return {
    data: "",
    event: "",
    id: "",
    retry: void 0
  };
}
function hy(e, t) {
  const n = new ReadableStream({ async start(s) {
    const r = Al((i) => {
      if (i.event === "error") throw new Error(i.data ?? "Unspecified event streaming error.");
      i.event === "metadata" ? t?.(i) : i.data && s.enqueue(i.data);
    });
    await Ml(e, Il((i, o, c) => {
      r(i, o, c), c && s.close();
    }));
  } });
  return Kn.fromReadableStream(n);
}
function dy(e) {
  return e.data === "" && e.event === "" && e.id === "" && e.retry === void 0;
}
var fy = /* @__PURE__ */ F({});
function Ol(e, t) {
  let n = 0, s = 0, r = 0;
  for (let a = 0; a < e.length; a++)
    n += e[a] * t[a], s += e[a] * e[a], r += t[a] * t[a];
  return n / (Math.sqrt(s) * Math.sqrt(r));
}
function py(e, t) {
  let n = 0;
  for (let s = 0; s < e.length; s++) n += e[s] * t[s];
  return n;
}
function my(e, t) {
  let n = 0;
  for (let s = 0; s < e.length; s++) n += (e[s] - t[s]) * (e[s] - t[s]);
  return n;
}
function gy(e, t) {
  return Math.sqrt(my(e, t));
}
var yy = /* @__PURE__ */ F({
  cosineSimilarity: () => ka,
  euclideanDistance: () => vy,
  innerProduct: () => wy,
  matrixFunc: () => br,
  maximalMarginalRelevance: () => by,
  normalize: () => _y
});
function br(e, t, n) {
  if (e.length === 0 || e[0].length === 0 || t.length === 0 || t[0].length === 0) return [[]];
  if (e[0].length !== t[0].length) throw new Error(`Number of columns in X and Y must be the same. X has shape ${[e.length, e[0].length]} and Y has shape ${[t.length, t[0].length]}.`);
  return e.map((s) => t.map((r) => n(s, r)).map((r) => Number.isNaN(r) ? 0 : r));
}
function _y(e, t = !1) {
  const n = Sy(e);
  return e.map((s) => s.map((r) => t ? 1 - r / n : r / n));
}
function ka(e, t) {
  return br(e, t, Ol);
}
function wy(e, t) {
  return br(e, t, py);
}
function vy(e, t) {
  return br(e, t, gy);
}
function by(e, t, n = 0.5, s = 4) {
  if (Math.min(s, t.length) <= 0) return [];
  const r = ka(Array.isArray(e[0]) ? e : [e], t)[0], a = Pl(r).maxIndex, i = [t[a]], o = [a];
  for (; o.length < Math.min(s, t.length); ) {
    let c = -1 / 0, l = -1;
    const u = ka(t, i);
    r.forEach((d, h) => {
      if (o.includes(h)) return;
      const f = Math.max(...u[h]), p = n * d - (1 - n) * f;
      p > c && (c = p, l = h);
    }), i.push(t[l]), o.push(l);
  }
  return o;
}
function Pl(e) {
  if (e.length === 0) return {
    maxIndex: -1,
    maxValue: NaN
  };
  let t = e[0], n = 0;
  for (let s = 1; s < e.length; s += 1) e[s] > t && (n = s, t = e[s]);
  return {
    maxIndex: n,
    maxValue: t
  };
}
function Sy(e) {
  return e.reduce((t, n) => Math.max(t, Pl(n).maxValue), 0);
}
var ky = /* @__PURE__ */ F({
  isCloudMetadata: () => Ca,
  isLocalhost: () => Ea,
  isPrivateIp: () => Ll,
  isSafeUrl: () => Oy,
  isSameOrigin: () => Py,
  validateSafeUrl: () => Dl
});
const Cy = [
  "10.0.0.0/8",
  "172.16.0.0/12",
  "192.168.0.0/16",
  "127.0.0.0/8",
  "169.254.0.0/16",
  "0.0.0.0/8",
  "::1/128",
  "fc00::/7",
  "fe80::/10",
  "ff00::/8"
], Ey = [
  "169.254.169.254",
  "169.254.170.2",
  "100.100.100.200"
], Ty = [
  "metadata.google.internal",
  "metadata",
  "instance-data"
], xy = ["localhost", "localhost.localdomain"], My = /^(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$/;
function Nl(e) {
  return My.test(e);
}
function Sr(e) {
  return jl(e) !== null;
}
function Rl(e) {
  return Nl(e) || Sr(e);
}
function $l(e) {
  if (Nl(e)) return e.split(".").map((t) => parseInt(t, 10));
  if (Sr(e)) {
    const t = jl(e);
    if (!t) return null;
    const n = t.split(":"), s = [];
    for (const r of n) s.push(parseInt(r, 16));
    return s;
  }
  return null;
}
function jl(e) {
  if (!e || typeof e != "string" || !e.includes(":") || !/^[0-9a-fA-F:]+$/.test(e)) return null;
  let t = e;
  if (t.includes("::")) {
    const s = t.split("::");
    if (s.length > 2) return null;
    const [r, a] = s, i = r ? r.split(":") : [], o = a ? a.split(":") : [], c = 8 - (i.length + o.length);
    if (c < 0) return null;
    const l = Array(c).fill("0");
    t = [
      ...i,
      ...l,
      ...o
    ].filter((u) => u !== "").join(":");
  }
  const n = t.split(":");
  if (n.length !== 8) return null;
  for (const s of n)
    if (s.length === 0 || s.length > 4 || !/^[0-9a-fA-F]+$/.test(s)) return null;
  return n.map((s) => s.padStart(4, "0").toLowerCase()).join(":");
}
function Iy(e) {
  const [t, n] = e.split("/");
  if (!t || !n) return null;
  const s = $l(t);
  if (!s) return null;
  const r = parseInt(n, 10);
  if (isNaN(r)) return null;
  const a = Sr(t);
  return a && r > 128 || !a && r > 32 ? null : {
    addr: s,
    prefixLen: r,
    isIpv6: a
  };
}
function Ay(e, t) {
  const n = $l(e);
  if (!n) return !1;
  const s = Iy(t);
  if (!s) return !1;
  const r = Sr(e);
  if (r !== s.isIpv6) return !1;
  const { addr: a, prefixLen: i } = s;
  if (r) for (let o = 0; o < Math.ceil(i / 16); o++) {
    const c = 65535 << 16 - Math.min(16, i - o * 16) & 65535;
    if ((n[o] & c) !== (a[o] & c)) return !1;
  }
  else for (let o = 0; o < Math.ceil(i / 8); o++) {
    const c = 255 << 8 - Math.min(8, i - o * 8) & 255;
    if ((n[o] & c) !== (a[o] & c)) return !1;
  }
  return !0;
}
function Ll(e) {
  if (!Rl(e)) return !1;
  for (const t of Cy) if (Ay(e, t)) return !0;
  return !1;
}
function Ca(e, t) {
  if (Ey.includes(t || "")) return !0;
  const n = e.toLowerCase();
  return !!Ty.includes(n);
}
function Ea(e, t) {
  if (t && (t === "127.0.0.1" || t === "::1" || t === "0.0.0.0" || t.startsWith("127.")))
    return !0;
  const n = e.toLowerCase();
  return !!xy.includes(n);
}
function Dl(e, t) {
  const n = t?.allowPrivate ?? !1, s = t?.allowHttp ?? !1;
  try {
    let r;
    try {
      r = new URL(e);
    } catch {
      throw new Error(`Invalid URL: ${e}`);
    }
    const a = r.hostname;
    if (!a) throw new Error("URL missing hostname.");
    if (Ca(a)) throw new Error(`URL points to cloud metadata endpoint: ${a}`);
    if (Ea(a)) {
      if (!n) throw new Error(`URL points to localhost: ${a}`);
      return e;
    }
    const i = r.protocol;
    if (i !== "http:" && i !== "https:") throw new Error(`Invalid URL scheme: ${i}. Only http and https are allowed.`);
    if (i === "http:" && !s) throw new Error("HTTP scheme not allowed. Use HTTPS or set allowHttp: true.");
    if (Rl(a)) {
      const o = a;
      if (Ea(a, o)) {
        if (!n) throw new Error(`URL points to localhost: ${a}`);
        return e;
      }
      if (Ca(a, o)) throw new Error(`URL resolves to cloud metadata IP: ${o} (${a})`);
      if (Ll(o) && !n)
        throw new Error(`URL resolves to private IP: ${o} (${a}). Set allowPrivate: true to allow.`);
      return e;
    }
    return e;
  } catch (r) {
    throw r && typeof r == "object" && "message" in r ? r : new Error(`URL validation failed: ${r}`);
  }
}
function Oy(e, t) {
  try {
    return Dl(e, t), !0;
  } catch {
    return !1;
  }
}
function Py(e, t) {
  try {
    return new URL(e).origin === new URL(t).origin;
  } catch {
    return !1;
  }
}
var Ny = /* @__PURE__ */ F({
  SaveableVectorStore: () => Ry,
  VectorStore: () => Li,
  VectorStoreRetriever: () => Fs
}), Fs = class extends Ai {
  static lc_name() {
    return "VectorStoreRetriever";
  }
  get lc_namespace() {
    return ["langchain_core", "vectorstores"];
  }
  /**
  * The instance of `VectorStore` used for storing and retrieving document embeddings.
  * This vector store must implement the `VectorStoreInterface` to be compatible
  * with the retriever’s operations.
  */
  vectorStore;
  /**
  * Specifies the number of documents to retrieve for each search query.
  * Defaults to 4 if not specified, providing a basic result count for similarity or MMR searches.
  */
  k = 4;
  /**
  * Determines the type of search operation to perform on the vector store.
  *
  * - `"similarity"` (default): Conducts a similarity search based purely on vector similarity
  *   to the query.
  * - `"mmr"`: Executes a maximal marginal relevance (MMR) search, balancing relevance and
  *   diversity in the retrieved results.
  */
  searchType = "similarity";
  /**
  * Additional options specific to maximal marginal relevance (MMR) search, applicable
  * only if `searchType` is set to `"mmr"`.
  *
  * Includes:
  * - `fetchK`: The initial number of documents fetched before applying the MMR algorithm,
  *   allowing for a larger selection from which to choose the most diverse results.
  * - `lambda`: A parameter between 0 and 1 to adjust the relevance-diversity balance,
  *   where 0 prioritizes diversity and 1 prioritizes relevance.
  */
  searchKwargs;
  /**
  * Optional filter applied to search results, defined by the `FilterType` of the vector store.
  * Allows for refined, targeted results by restricting the returned documents based
  * on specified filter criteria.
  */
  filter;
  /**
  * Returns the type of vector store, as defined by the `vectorStore` instance.
  *
  * @returns {string} The vector store type.
  */
  _vectorstoreType() {
    return this.vectorStore._vectorstoreType();
  }
  /**
  * Initializes a new instance of `VectorStoreRetriever` with the specified configuration.
  *
  * This constructor configures the retriever to interact with a given `VectorStore`
  * and supports different retrieval strategies, including similarity search and maximal
  * marginal relevance (MMR) search. Various options allow customization of the number
  * of documents retrieved per query, filtering based on conditions, and fine-tuning
  * MMR-specific parameters.
  *
  * @param fields - Configuration options for setting up the retriever:
  *
  *   - `vectorStore` (required): The `VectorStore` instance implementing `VectorStoreInterface`
  *     that will be used to store and retrieve document embeddings. This is the core component
  *     of the retriever, enabling vector-based similarity and MMR searches.
  *
  *   - `k` (optional): Specifies the number of documents to retrieve per search query. If not
  *     provided, defaults to 4. This count determines the number of most relevant documents returned
  *     for each search operation, balancing performance with comprehensiveness.
  *
  *   - `searchType` (optional): Defines the search approach used by the retriever, allowing for
  *     flexibility between two methods:
  *       - `"similarity"` (default): A similarity-based search, retrieving documents with high vector
  *         similarity to the query. This type prioritizes relevance and is often used when diversity
  *         among results is less critical.
  *       - `"mmr"`: Maximal Marginal Relevance search, which combines relevance with diversity. MMR
  *         is useful for scenarios where varied content is essential, as it selects results that
  *         both match the query and introduce content diversity.
  *
  *   - `filter` (optional): A filter of type `FilterType`, defined by the vector store, that allows
  *     for refined and targeted search results. This filter applies specified conditions to limit
  *     which documents are eligible for retrieval, offering control over the scope of results.
  *
  *   - `searchKwargs` (optional, applicable only if `searchType` is `"mmr"`): Additional settings
  *     for configuring MMR-specific behavior. These parameters allow further tuning of the MMR
  *     search process:
  *       - `fetchK`: The initial number of documents fetched from the vector store before the MMR
  *         algorithm is applied. Fetching a larger set enables the algorithm to select a more
  *         diverse subset of documents.
  *       - `lambda`: A parameter controlling the relevance-diversity balance, where 0 emphasizes
  *         diversity and 1 prioritizes relevance. Intermediate values provide a blend of the two,
  *         allowing customization based on the importance of content variety relative to query relevance.
  */
  constructor(e) {
    super(e), this.vectorStore = e.vectorStore, this.k = e.k ?? this.k, this.searchType = e.searchType ?? this.searchType, this.filter = e.filter, e.searchType === "mmr" && (this.searchKwargs = e.searchKwargs);
  }
  /**
  * Retrieves relevant documents based on the specified query, using either
  * similarity or maximal marginal relevance (MMR) search.
  *
  * If `searchType` is set to `"mmr"`, performs an MMR search to balance
  * similarity and diversity among results. If `searchType` is `"similarity"`,
  * retrieves results purely based on similarity to the query.
  *
  * @param query - The query string used to find relevant documents.
  * @param runManager - Optional callback manager for tracking retrieval progress.
  * @returns A promise that resolves to an array of `DocumentInterface` instances
  *          representing the most relevant documents to the query.
  * @throws {Error} Throws an error if MMR search is requested but not supported
  *                 by the vector store.
  * @protected
  */
  async _getRelevantDocuments(e, t) {
    if (this.searchType === "mmr") {
      if (typeof this.vectorStore.maxMarginalRelevanceSearch != "function") throw new Error(`The vector store backing this retriever, ${this._vectorstoreType()} does not support max marginal relevance search.`);
      return this.vectorStore.maxMarginalRelevanceSearch(e, {
        k: this.k,
        filter: this.filter,
        ...this.searchKwargs
      }, t?.getChild("vectorstore"));
    }
    return this.vectorStore.similaritySearch(e, this.k, this.filter, t?.getChild("vectorstore"));
  }
  /**
  * Adds an array of documents to the vector store, embedding them as part of
  * the storage process.
  *
  * This method delegates document embedding and storage to the `addDocuments`
  * method of the underlying vector store.
  *
  * @param documents - An array of documents to embed and add to the vector store.
  * @param options - Optional settings to customize document addition.
  * @returns A promise that resolves to an array of document IDs or `void`,
  *          depending on the vector store's implementation.
  */
  async addDocuments(e, t) {
    return this.vectorStore.addDocuments(e, t);
  }
}, Li = class extends xn {
  /**
  * Namespace within LangChain to uniquely identify this vector store's
  * location, based on the vector store type.
  *
  * @internal
  */
  lc_namespace = [
    "langchain",
    "vectorstores",
    this._vectorstoreType()
  ];
  /**
  * Embeddings interface for generating vector embeddings from text queries,
  * enabling vector-based similarity searches.
  */
  embeddings;
  /**
  * Initializes a new vector store with embeddings and database configuration.
  *
  * @param embeddings - Instance of `EmbeddingsInterface` used to embed queries.
  * @param dbConfig - Configuration settings for the database or storage system.
  */
  constructor(e, t) {
    super(t), this.embeddings = e;
  }
  /**
  * Deletes documents from the vector store based on the specified parameters.
  *
  * @param _params - Flexible key-value pairs defining conditions for document deletion.
  * @returns A promise that resolves once the deletion is complete.
  */
  async delete(e) {
    throw new Error("Not implemented.");
  }
  /**
  * Searches for documents similar to a text query by embedding the query and
  * performing a similarity search on the resulting vector.
  *
  * @param query - Text query for finding similar documents.
  * @param k - Number of similar results to return. Defaults to 4.
  * @param filter - Optional filter based on `FilterType`.
  * @param _callbacks - Optional callbacks for monitoring search progress
  * @returns A promise resolving to an array of `DocumentInterface` instances representing similar documents.
  */
  async similaritySearch(e, t = 4, n = void 0, s = void 0) {
    return (await this.similaritySearchVectorWithScore(await this.embeddings.embedQuery(e), t, n)).map((r) => r[0]);
  }
  /**
  * Searches for documents similar to a text query by embedding the query,
  * and returns results with similarity scores.
  *
  * @param query - Text query for finding similar documents.
  * @param k - Number of similar results to return. Defaults to 4.
  * @param filter - Optional filter based on `FilterType`.
  * @param _callbacks - Optional callbacks for monitoring search progress
  * @returns A promise resolving to an array of tuples, each containing a
  *          document and its similarity score.
  */
  async similaritySearchWithScore(e, t = 4, n = void 0, s = void 0) {
    return this.similaritySearchVectorWithScore(await this.embeddings.embedQuery(e), t, n);
  }
  /**
  * Creates a `VectorStore` instance from an array of text strings and optional
  * metadata, using the specified embeddings and database configuration.
  *
  * Subclasses must implement this method to define how text and metadata
  * are embedded and stored in the vector store. Throws an error if not overridden.
  *
  * @param _texts - Array of strings representing the text documents to be stored.
  * @param _metadatas - Metadata for the texts, either as an array (one for each text)
  *                     or a single object (applied to all texts).
  * @param _embeddings - Instance of `EmbeddingsInterface` to embed the texts.
  * @param _dbConfig - Database configuration settings.
  * @returns A promise that resolves to a new `VectorStore` instance.
  * @throws {Error} Throws an error if this method is not overridden by a subclass.
  */
  static fromTexts(e, t, n, s) {
    throw new Error("the Langchain vectorstore implementation you are using forgot to override this, please report a bug");
  }
  /**
  * Creates a `VectorStore` instance from an array of documents, using the specified
  * embeddings and database configuration.
  *
  * Subclasses must implement this method to define how documents are embedded
  * and stored. Throws an error if not overridden.
  *
  * @param _docs - Array of `DocumentInterface` instances representing the documents to be stored.
  * @param _embeddings - Instance of `EmbeddingsInterface` to embed the documents.
  * @param _dbConfig - Database configuration settings.
  * @returns A promise that resolves to a new `VectorStore` instance.
  * @throws {Error} Throws an error if this method is not overridden by a subclass.
  */
  static fromDocuments(e, t, n) {
    throw new Error("the Langchain vectorstore implementation you are using forgot to override this, please report a bug");
  }
  /**
  * Creates a `VectorStoreRetriever` instance with flexible configuration options.
  *
  * @param kOrFields
  *    - If a number is provided, it sets the `k` parameter (number of items to retrieve).
  *    - If an object is provided, it should contain various configuration options.
  * @param filter
  *    - Optional filter criteria to limit the items retrieved based on the specified filter type.
  * @param callbacks
  *    - Optional callbacks that may be triggered at specific stages of the retrieval process.
  * @param tags
  *    - Tags to categorize or label the `VectorStoreRetriever`. Defaults to an empty array if not provided.
  * @param metadata
  *    - Additional metadata as key-value pairs to add contextual information for the retrieval process.
  * @param verbose
  *    - If `true`, enables detailed logging for the retrieval process. Defaults to `false`.
  *
  * @returns
  *    - A configured `VectorStoreRetriever` instance based on the provided parameters.
  *
  * @example
  * Basic usage with a `k` value:
  * ```typescript
  * const retriever = myVectorStore.asRetriever(5);
  * ```
  *
  * Usage with a configuration object:
  * ```typescript
  * const retriever = myVectorStore.asRetriever({
  *   k: 10,
  *   filter: myFilter,
  *   tags: ['example', 'test'],
  *   verbose: true,
  *   searchType: 'mmr',
  *   searchKwargs: { alpha: 0.5 },
  * });
  * ```
  */
  asRetriever(e, t, n, s, r, a) {
    if (typeof e == "number") return new Fs({
      vectorStore: this,
      k: e,
      filter: t,
      tags: [...s ?? [], this._vectorstoreType()],
      metadata: r,
      verbose: a,
      callbacks: n
    });
    {
      const i = {
        vectorStore: this,
        k: e?.k,
        filter: e?.filter,
        tags: [...e?.tags ?? [], this._vectorstoreType()],
        metadata: e?.metadata,
        verbose: e?.verbose,
        callbacks: e?.callbacks,
        searchType: e?.searchType
      };
      return e?.searchType === "mmr" ? new Fs({
        ...i,
        searchKwargs: e.searchKwargs
      }) : new Fs({ ...i });
    }
  }
}, Ry = class extends Li {
  /**
  * Loads a vector store instance from the specified directory, using the
  * provided embeddings to ensure compatibility.
  *
  * This static method reconstructs a `SaveableVectorStore` from previously
  * saved data. Implementations should interpret the saved data format to
  * recreate the vector store instance.
  *
  * @param _directory - The directory path from which the vector store
  * data will be loaded.
  * @param _embeddings - An instance of `EmbeddingsInterface` to align
  * the embeddings with the loaded vector data.
  * @returns A promise that resolves to a `SaveableVectorStore` instance
  * constructed from the saved data.
  */
  static load(e, t) {
    throw new Error("Not implemented");
  }
}, $y = class extends cs {
  _combineLLMOutput() {
    return [];
  }
  _llmType() {
    return "fake";
  }
  async _generate(e, t, n) {
    if (t?.stop?.length) return { generations: [{
      message: new U(t.stop[0]),
      text: t.stop[0]
    }] };
    const s = e.map((r) => typeof r.content == "string" ? r.content : JSON.stringify(r.content, null, 2)).join(`
`);
    return await n?.handleLLMNewToken(s), {
      generations: [{
        message: new U(s),
        text: s
      }],
      llmOutput: {}
    };
  }
}, jy = class Fl extends cs {
  sleep = 50;
  responses = [];
  chunks = [];
  toolStyle = "openai";
  thrownErrorString;
  tools = [];
  constructor({ sleep: t = 50, responses: n = [], chunks: s = [], toolStyle: r = "openai", thrownErrorString: a, ...i }) {
    super(i), this.sleep = t, this.responses = n, this.chunks = s, this.toolStyle = r, this.thrownErrorString = a;
  }
  _llmType() {
    return "fake";
  }
  bindTools(t) {
    const n = [...this.tools, ...t], s = n.map((i) => {
      switch (this.toolStyle) {
        case "openai":
          return {
            type: "function",
            function: {
              name: i.name,
              description: i.description,
              parameters: je(i.schema)
            }
          };
        case "anthropic":
          return {
            name: i.name,
            description: i.description,
            input_schema: je(i.schema)
          };
        case "bedrock":
          return { toolSpec: {
            name: i.name,
            description: i.description,
            inputSchema: je(i.schema)
          } };
        case "google":
          return {
            name: i.name,
            description: i.description,
            parameters: je(i.schema)
          };
        default:
          throw new Error(`Unsupported tool style: ${this.toolStyle}`);
      }
    }), r = this.toolStyle === "google" ? [{ functionDeclarations: s }] : s, a = new Fl({
      sleep: this.sleep,
      responses: this.responses,
      chunks: this.chunks,
      toolStyle: this.toolStyle,
      thrownErrorString: this.thrownErrorString
    });
    return a.tools = n, a.withConfig({ tools: r });
  }
  async _generate(t, n, s) {
    if (this.thrownErrorString) throw new Error(this.thrownErrorString);
    return { generations: [{
      text: "",
      message: new U({
        content: this.responses?.[0]?.content ?? t[0].content ?? "",
        tool_calls: this.chunks?.[0]?.tool_calls
      })
    }] };
  }
  async *_streamResponseChunks(t, n, s) {
    if (this.thrownErrorString) throw new Error(this.thrownErrorString);
    if (this.chunks?.length) {
      for (const i of this.chunks) {
        const o = new aa({
          message: new Ot({
            content: i.content,
            tool_calls: i.tool_calls,
            additional_kwargs: i.additional_kwargs ?? {}
          }),
          text: i.content?.toString() ?? ""
        });
        if (n.signal?.aborted) break;
        yield o, await s?.handleLLMNewToken(i.content, void 0, void 0, void 0, void 0, { chunk: o });
      }
      return;
    }
    const r = this.responses?.[0] ?? new U(typeof t[0].content == "string" ? t[0].content : ""), a = typeof r.content == "string" ? r.content : "";
    for (const i of a) {
      await new Promise((c) => setTimeout(c, this.sleep));
      const o = new aa({
        message: new Ot({ content: i }),
        text: i
      });
      if (n.signal?.aborted) break;
      yield o, await s?.handleLLMNewToken(i, void 0, void 0, void 0, void 0, { chunk: o });
    }
  }
}, Ly = class Vl extends cs {
  static lc_name() {
    return "FakeListChatModel";
  }
  lc_serializable = !0;
  responses;
  i = 0;
  sleep;
  emitCustomEvent = !1;
  generationInfo;
  tools = [];
  toolStyle = "openai";
  constructor(t) {
    super(t);
    const { responses: n, sleep: s, emitCustomEvent: r, generationInfo: a } = t;
    this.responses = n, this.sleep = s, this.emitCustomEvent = r ?? this.emitCustomEvent, this.generationInfo = a;
  }
  _combineLLMOutput() {
    return [];
  }
  _llmType() {
    return "fake-list";
  }
  async _generate(t, n, s) {
    if (await this._sleepIfRequested(), n?.thrownErrorString) throw new Error(n.thrownErrorString);
    if (this.emitCustomEvent && await s?.handleCustomEvent("some_test_event", { someval: !0 }), n?.stop?.length) return { generations: [this._formatGeneration(n.stop[0])] };
    {
      const r = this._currentResponse();
      return this._incrementResponse(), {
        generations: [this._formatGeneration(r)],
        llmOutput: {}
      };
    }
  }
  _formatGeneration(t) {
    return {
      message: new U(t),
      text: t
    };
  }
  async *_streamResponseChunks(t, n, s) {
    const r = this._currentResponse();
    this._incrementResponse(), this.emitCustomEvent && await s?.handleCustomEvent("some_test_event", { someval: !0 });
    const a = [...r];
    for (let i = 0; i < a.length; i++) {
      const o = a[i], c = i === a.length - 1;
      if (await this._sleepIfRequested(), n?.thrownErrorString) throw new Error(n.thrownErrorString);
      const l = this._createResponseChunk(o, c ? this.generationInfo : void 0);
      if (n.signal?.aborted) break;
      yield l, s?.handleLLMNewToken(o);
    }
  }
  async _sleepIfRequested() {
    this.sleep !== void 0 && await this._sleep();
  }
  async _sleep() {
    return new Promise((t) => {
      setTimeout(() => t(), this.sleep);
    });
  }
  _createResponseChunk(t, n) {
    return new aa({
      message: new Ot({ content: t }),
      text: t,
      generationInfo: n
    });
  }
  _currentResponse() {
    return this.responses[this.i];
  }
  _incrementResponse() {
    this.i < this.responses.length - 1 ? this.i += 1 : this.i = 0;
  }
  bindTools(t) {
    const n = [...this.tools, ...t], s = n.map((i) => {
      switch (this.toolStyle) {
        case "openai":
          return {
            type: "function",
            function: {
              name: i.name,
              description: i.description,
              parameters: je(i.schema)
            }
          };
        case "anthropic":
          return {
            name: i.name,
            description: i.description,
            input_schema: je(i.schema)
          };
        case "bedrock":
          return { toolSpec: {
            name: i.name,
            description: i.description,
            inputSchema: je(i.schema)
          } };
        case "google":
          return {
            name: i.name,
            description: i.description,
            parameters: je(i.schema)
          };
        default:
          throw new Error(`Unsupported tool style: ${this.toolStyle}`);
      }
    }), r = this.toolStyle === "google" ? [{ functionDeclarations: s }] : s, a = new Vl({
      responses: this.responses,
      sleep: this.sleep,
      emitCustomEvent: this.emitCustomEvent,
      generationInfo: this.generationInfo
    });
    return a.tools = n, a.toolStyle = this.toolStyle, a.i = this.i, a.withConfig({ tools: r });
  }
  withStructuredOutput(t, n) {
    return dt.from(async (s) => {
      const r = await this.invoke(s);
      if (r.tool_calls?.[0]?.args) return r.tool_calls[0].args;
      if (typeof r.content == "string") return JSON.parse(r.content);
      throw new Error("No structured output found");
    });
  }
}, Dy = class extends di {
  vectorSize;
  constructor(e) {
    super(e ?? {}), this.vectorSize = e?.vectorSize ?? 4;
  }
  /**
  * Generates synthetic embeddings for a list of documents.
  * @param documents List of documents to generate embeddings for.
  * @returns A promise that resolves with a list of synthetic embeddings for each document.
  */
  async embedDocuments(e) {
    return Promise.all(e.map((t) => this.embedQuery(t)));
  }
  /**
  * Generates a synthetic embedding for a document. The document is
  * converted into chunks, a numerical value is calculated for each chunk,
  * and an array of these values is returned as the embedding.
  * @param document The document to generate an embedding for.
  * @returns A promise that resolves with a synthetic embedding for the document.
  */
  async embedQuery(e) {
    let t = e;
    t = t.toLowerCase().replaceAll(/[^a-z ]/g, "");
    const n = t.length % this.vectorSize, s = n === 0 ? 0 : this.vectorSize - n, r = t.length + s;
    t = t.padEnd(r, " ");
    const a = t.length / this.vectorSize, i = [];
    for (let o = 0; o < t.length; o += a) i.push(t.slice(o, o + a));
    return i.map((o) => {
      let c = 0;
      for (let l = 0; l < o.length; l += 1) c += o === " " ? 0 : o.charCodeAt(l);
      return c % 26 / 26;
    });
  }
}, Fy = class extends di {
  constructor(e) {
    super(e ?? {});
  }
  /**
  * Generates fixed embeddings for a list of documents.
  * @param documents List of documents to generate embeddings for.
  * @returns A promise that resolves with a list of fixed embeddings for each document.
  */
  embedDocuments(e) {
    return Promise.resolve(e.map(() => [
      0.1,
      0.2,
      0.3,
      0.4
    ]));
  }
  /**
  * Generates a fixed embedding for a query.
  * @param _ The query to generate an embedding for.
  * @returns A promise that resolves with a fixed embedding for the query.
  */
  embedQuery(e) {
    return Promise.resolve([
      0.1,
      0.2,
      0.3,
      0.4
    ]);
  }
}, Vy = class extends fi {
  response;
  thrownErrorString;
  constructor(e) {
    super(e), this.response = e.response, this.thrownErrorString = e.thrownErrorString;
  }
  _llmType() {
    return "fake";
  }
  async _call(e, t, n) {
    if (this.thrownErrorString) throw new Error(this.thrownErrorString);
    const s = this.response ?? e;
    return await n?.handleLLMNewToken(s), s;
  }
}, By = class extends fi {
  sleep = 50;
  responses;
  thrownErrorString;
  constructor(e) {
    super(e), this.sleep = e.sleep ?? this.sleep, this.responses = e.responses, this.thrownErrorString = e.thrownErrorString;
  }
  _llmType() {
    return "fake";
  }
  async _call(e) {
    if (this.thrownErrorString) throw new Error(this.thrownErrorString);
    const t = this.responses?.[0];
    return this.responses = this.responses?.slice(1), t ?? e;
  }
  async *_streamResponseChunks(e, t, n) {
    if (this.thrownErrorString) throw new Error(this.thrownErrorString);
    const s = this.responses?.[0];
    this.responses = this.responses?.slice(1);
    for (const r of s ?? e)
      await new Promise((a) => setTimeout(a, this.sleep)), yield {
        text: r,
        generationInfo: {}
      }, await n?.handleLLMNewToken(r);
  }
}, Hy = class extends Ic {
  lc_namespace = [
    "langchain_core",
    "message",
    "fake"
  ];
  messages = [];
  constructor() {
    super();
  }
  async getMessages() {
    return this.messages;
  }
  async addMessage(e) {
    this.messages.push(e);
  }
  async addUserMessage(e) {
    this.messages.push(new $t(e));
  }
  async addAIMessage(e) {
    this.messages.push(new U(e));
  }
  async clear() {
    this.messages = [];
  }
}, Uy = class extends ki {
  lc_namespace = [
    "langchain_core",
    "message",
    "fake"
  ];
  messages = [];
  constructor() {
    super();
  }
  async addMessage(e) {
    this.messages.push(e);
  }
  async getMessages() {
    return this.messages;
  }
}, Wy = class extends ii {
  name = "fake_tracer";
  runs = [];
  constructor() {
    super();
  }
  persistRun(e) {
    return this.runs.push(e), Promise.resolve();
  }
}, zy = class extends cc {
  lc_namespace = ["tests", "fake"];
  getFormatInstructions() {
    return "";
  }
  async parse(e) {
    return e.split(",").map((t) => t.trim());
  }
}, Gy = class extends Ai {
  lc_namespace = ["test", "fake"];
  output = [new It({ pageContent: "foo" }), new It({ pageContent: "bar" })];
  constructor(e) {
    super(), this.output = e?.output ?? this.output;
  }
  async _getRelevantDocuments(e) {
    return this.output;
  }
}, Jy = class extends ae {
  lc_namespace = ["tests", "fake"];
  returnOptions;
  constructor(e) {
    super(e), this.returnOptions = e.returnOptions;
  }
  async invoke(e, t) {
    return this.returnOptions ? t ?? {} : { input: e };
  }
}, Ky = class extends mr {
  name;
  description;
  schema;
  constructor(e) {
    super(e), this.name = e.name, this.description = e.description, this.schema = e.schema;
  }
  async _call(e, t) {
    return JSON.stringify(e);
  }
}, qy = class extends ii {
  runPromiseResolver;
  runPromise;
  /** The name of the callback handler. */
  name = "single_run_extractor";
  constructor() {
    super(), this.runPromise = new Promise((e) => {
      this.runPromiseResolver = e;
    });
  }
  async persistRun(e) {
    this.runPromiseResolver(e);
  }
  async extract() {
    return this.runPromise;
  }
}, Zy = class Bl extends Li {
  memoryVectors = [];
  similarity;
  _vectorstoreType() {
    return "memory";
  }
  constructor(t, { similarity: n, ...s } = {}) {
    super(t, s), this.similarity = n ?? Ol;
  }
  /**
  * Method to add documents to the memory vector store. It extracts the
  * text from each document, generates embeddings for them, and adds the
  * resulting vectors to the store.
  * @param documents Array of `Document` instances to be added to the store.
  * @returns Promise that resolves when all documents have been added.
  */
  async addDocuments(t) {
    const n = t.map(({ pageContent: s }) => s);
    return this.addVectors(await this.embeddings.embedDocuments(n), t);
  }
  /**
  * Method to add vectors to the memory vector store. It creates
  * `MemoryVector` instances for each vector and document pair and adds
  * them to the store.
  * @param vectors Array of vectors to be added to the store.
  * @param documents Array of `Document` instances corresponding to the vectors.
  * @returns Promise that resolves when all vectors have been added.
  */
  async addVectors(t, n) {
    const s = t.map((r, a) => ({
      content: n[a].pageContent,
      embedding: r,
      metadata: n[a].metadata
    }));
    this.memoryVectors = this.memoryVectors.concat(s);
  }
  /**
  * Method to perform a similarity search in the memory vector store. It
  * calculates the similarity between the query vector and each vector in
  * the store, sorts the results by similarity, and returns the top `k`
  * results along with their scores.
  * @param query Query vector to compare against the vectors in the store.
  * @param k Number of top results to return.
  * @param filter Optional filter function to apply to the vectors before performing the search.
  * @returns Promise that resolves with an array of tuples, each containing a `Document` and its similarity score.
  */
  async similaritySearchVectorWithScore(t, n, s) {
    const r = (i) => s ? s(new It({
      metadata: i.metadata,
      pageContent: i.content
    })) : !0, a = this.memoryVectors.filter(r);
    return a.map((i, o) => ({
      similarity: this.similarity(t, i.embedding),
      index: o
    })).sort((i, o) => i.similarity > o.similarity ? -1 : 0).slice(0, n).map((i) => [new It({
      metadata: a[i.index].metadata,
      pageContent: a[i.index].content
    }), i.similarity]);
  }
  /**
  * Static method to create a `FakeVectorStore` instance from an array of
  * texts. It creates a `Document` for each text and metadata pair, and
  * adds them to the store.
  * @param texts Array of texts to be added to the store.
  * @param metadatas Array or single object of metadata corresponding to the texts.
  * @param embeddings `Embeddings` instance used to generate embeddings for the texts.
  * @param dbConfig Optional `FakeVectorStoreArgs` to configure the `FakeVectorStore` instance.
  * @returns Promise that resolves with a new `FakeVectorStore` instance.
  */
  static async fromTexts(t, n, s, r) {
    const a = [];
    for (let i = 0; i < t.length; i += 1) {
      const o = Array.isArray(n) ? n[i] : n, c = new It({
        pageContent: t[i],
        metadata: o
      });
      a.push(c);
    }
    return Bl.fromDocuments(a, s, r);
  }
  /**
  * Static method to create a `FakeVectorStore` instance from an array of
  * `Document` instances. It adds the documents to the store.
  * @param docs Array of `Document` instances to be added to the store.
  * @param embeddings `Embeddings` instance used to generate embeddings for the documents.
  * @param dbConfig Optional `FakeVectorStoreArgs` to configure the `FakeVectorStore` instance.
  * @returns Promise that resolves with a new `FakeVectorStore` instance.
  */
  static async fromDocuments(t, n, s) {
    const r = new this(n, s);
    return await r.addDocuments(t), r;
  }
  /**
  * Static method to create a `FakeVectorStore` instance from an existing
  * index. It creates a new `FakeVectorStore` instance without adding any
  * documents or vectors.
  * @param embeddings `Embeddings` instance used to generate embeddings for the documents.
  * @param dbConfig Optional `FakeVectorStoreArgs` to configure the `FakeVectorStore` instance.
  * @returns Promise that resolves with a new `FakeVectorStore` instance.
  */
  static async fromExistingIndex(t, n) {
    return new this(t, n);
  }
}, Yy = /* @__PURE__ */ F({
  FakeChatMessageHistory: () => Hy,
  FakeChatModel: () => $y,
  FakeEmbeddings: () => Fy,
  FakeLLM: () => Vy,
  FakeListChatMessageHistory: () => Uy,
  FakeListChatModel: () => Ly,
  FakeRetriever: () => Gy,
  FakeRunnable: () => Jy,
  FakeSplitIntoListParser: () => zy,
  FakeStreamingChatModel: () => jy,
  FakeStreamingLLM: () => By,
  FakeTool: () => Ky,
  FakeTracer: () => Wy,
  FakeVectorStore: () => Zy,
  SingleRunExtractor: () => qy,
  SyntheticEmbeddings: () => Dy,
  asAsyncIterable: () => kl,
  openAIReasoningTextChunks: () => El,
  openAITextOnlyChunks: () => ji,
  openAITextOnlyChunksWithUsage: () => Cl,
  openAIToolCallChunks: () => Tl,
  sseResponseFromOpenAIChunks: () => xl,
  streamMatchers: () => $i
}), Xy = /* @__PURE__ */ F({
  agents: () => Nm,
  caches: () => qf,
  callbacks__base: () => Kf,
  callbacks__manager: () => Jf,
  callbacks__promises: () => _p,
  chat_history: () => Rm,
  document_loaders__base: () => Dm,
  document_loaders__langsmith: () => Fm,
  documents: () => Lm,
  embeddings: () => Qp,
  errors: () => Gf,
  example_selectors: () => Jm,
  index: () => Pm,
  indexing: () => Zm,
  language_models__base: () => zf,
  language_models__chat_models: () => Wf,
  language_models__compat: () => Uf,
  language_models__event: () => Ym,
  language_models__llms: () => nm,
  language_models__openai_completions_stream: () => Hf,
  language_models__profile: () => Xm,
  language_models__stream: () => Bf,
  language_models__structured_output: () => Vf,
  load__serializable: () => Ff,
  memory: () => Qm,
  messages: () => Mp,
  messages__tool: () => Df,
  output_parsers: () => zp,
  output_parsers__openai_functions: () => ag,
  output_parsers__openai_tools: () => Xp,
  outputs: () => Lf,
  prompt_values: () => jf,
  prompts: () => Pg,
  retrievers: () => $g,
  retrievers__document_compressors: () => Ng,
  runnables: () => $p,
  runnables__graph: () => $f,
  singletons: () => wp,
  stores: () => jg,
  structured_query: () => Ug,
  testing: () => ey,
  tools: () => Jp,
  tracers__base: () => Rf,
  tracers__console: () => Nf,
  tracers__log_stream: () => Pf,
  tracers__run_collector: () => ty,
  tracers__tracer_langchain: () => Of,
  types__stream: () => sy,
  utils__async_caller: () => Af,
  utils__chunk_array: () => em,
  utils__context: () => ry,
  utils__env: () => If,
  utils__event_source_parse: () => cy,
  utils__format: () => fy,
  utils__function_calling: () => Mf,
  utils__hash: () => Gp,
  utils__json_patch: () => Hp,
  utils__json_schema: () => xf,
  utils__math: () => yy,
  utils__ssrf: () => ky,
  utils__standard_schema: () => Tf,
  utils__stream: () => Ef,
  utils__testing: () => Yy,
  utils__tiktoken: () => Cf,
  utils__types: () => Op,
  utils__uuid: () => kf,
  vectorstores: () => Ny
});
const Qy = 50;
function e_(e) {
  const t = {};
  for (let n = e; n && n.prototype; n = Object.getPrototypeOf(n)) Object.assign(t, Reflect.get(n.prototype, "lc_aliases"));
  return Object.entries(t).reduce((n, [s, r]) => (n[r] = s, n), {});
}
async function Vs(e) {
  const { optionalImportsMap: t, optionalImportEntrypoints: n, importMap: s, secretsMap: r, secretsFromEnv: a, path: i, depth: o, maxDepth: c } = this, l = i.join(".");
  if (o > c) throw new Error(`Maximum recursion depth (${c}) exceeded during deserialization. This may indicate a malicious payload or you may need to increase maxDepth.`);
  if (typeof e != "object" || e == null) return e;
  if (Array.isArray(e)) return Promise.all(e.map((h, f) => Vs.call({
    ...this,
    path: [...i, `${f}`],
    depth: o + 1
  }, h)));
  const u = e;
  if (Zf(u)) return Yf(u);
  if ("lc" in u && "type" in u && "id" in u && u.lc === 1 && u.type === "secret") {
    const [h] = u.id;
    if (h in r) return r[h];
    if (a) {
      const f = Xf(h);
      if (f) return f;
    }
    throw new Error(`Missing secret "${h}" at ${l}`);
  }
  if ("lc" in u && "type" in u && "id" in u && u.lc === 1 && u.type === "not_implemented") {
    const h = JSON.stringify(u);
    throw new Error(`Trying to load an object that doesn't implement serialization: ${l} -> ${h}`);
  }
  if ("lc" in u && "type" in u && "id" in u && "kwargs" in u && u.lc === 1 && u.type === "constructor") {
    const h = u, f = JSON.stringify(h), [p, ...m] = h.id.slice().reverse(), g = m.reverse(), y = {
      langchain_core: Xy,
      langchain: s
    };
    let _ = null;
    const b = [g.join("/")];
    g[0] === "langchain_community" && b.push(["langchain", ...g.slice(1)].join("/"));
    const v = b.find((w) => w in t);
    if (Om.concat(n).includes(g.join("/")) || v) if (v !== void 0) _ = await t[v];
    else throw new Error(`Missing key "${g.join("/")}" for ${l} in load(optionalImportsMap={})`);
    else {
      let w;
      if (g[0] === "langchain" || g[0] === "langchain_core")
        w = y[g[0]], g.shift();
      else throw new Error(`Invalid namespace: ${l} -> ${f}`);
      if (g.length === 0) throw new Error(`Invalid namespace: ${l} -> ${f}`);
      let C;
      do {
        if (C = g.join("__"), C in w) break;
        g.pop();
      } while (g.length > 0);
      C in w && (_ = w[C]);
    }
    if (typeof _ != "object" || _ === null) throw new Error(`Invalid namespace: ${l} -> ${f}`);
    const M = _[p] ?? Object.values(_).find((w) => typeof w == "function" && Qf(w) === p);
    if (typeof M != "function") throw new Error(`Invalid identifer: ${l} -> ${f}`);
    const I = new M(ep(await Vs.call({
      ...this,
      path: [...i, "kwargs"],
      depth: o + 1
    }, h.kwargs), tp, e_(M)));
    return Object.defineProperty(I.constructor, "name", { value: p }), I;
  }
  const d = {};
  for (const [h, f] of Object.entries(u)) d[h] = await Vs.call({
    ...this,
    path: [...i, h],
    depth: o + 1
  }, f);
  return d;
}
async function t_(e, t) {
  const n = JSON.parse(e), s = {
    optionalImportsMap: {},
    optionalImportEntrypoints: [],
    secretsMap: {},
    secretsFromEnv: !1,
    importMap: {},
    path: ["$"],
    depth: 0,
    maxDepth: Qy
  };
  return Vs.call(s, n);
}
function n_(e) {
  return e !== null && e.lc === 1 && e.type === "constructor" && Array.isArray(e.id);
}
async function Ta(e) {
  if (e && typeof e == "object") {
    if (Array.isArray(e)) return await Promise.all(e.map((t) => Ta(t)));
    {
      const t = {};
      for (const [n, s] of Object.entries(e)) t[n] = await Ta(s);
      if (t.lc === 2 && t.type === "undefined") return;
      if (t.lc === 2 && t.type === "delta_snapshot") return new Si(t.value);
      if (t.lc === 2 && t.type === "constructor" && Array.isArray(t.id)) try {
        const n = t.id[t.id.length - 1];
        let s;
        switch (n) {
          case "Set":
            s = Set;
            break;
          case "Map":
            s = Map;
            break;
          case "RegExp":
            s = RegExp;
            break;
          case "Error":
            s = Error;
            break;
          case "Uint8Array":
            s = Uint8Array;
            break;
          default:
            return t;
        }
        return t.method ? s[t.method](...t.args || []) : new s(...t.args || []);
      } catch {
        return t;
      }
      else if (n_(t)) return t_(JSON.stringify(t));
      return t;
    }
  }
  return e;
}
function vs(e, t, n, s) {
  return {
    lc: 2,
    type: "constructor",
    id: [e.name],
    method: t ?? null,
    args: n ?? [],
    kwargs: s ?? {}
  };
}
function s_(e) {
  return e === void 0 ? {
    lc: 2,
    type: "undefined"
  } : e instanceof Si ? {
    lc: 2,
    type: "delta_snapshot",
    value: e.value
  } : e instanceof Set || e instanceof Map ? vs(e.constructor, void 0, [Array.from(e)]) : e instanceof RegExp ? vs(RegExp, void 0, [e.source, e.flags]) : e instanceof Error ? vs(e.constructor, void 0, [e.message]) : e?.lg_name === "Send" ? {
    node: e.node,
    args: e.args,
    ...e.timeout !== void 0 ? { timeout: e.timeout } : {}
  } : e instanceof Uint8Array ? vs(Uint8Array, "from", [Array.from(e)]) : e;
}
var Hl = class {
  _dumps(e) {
    return new TextEncoder().encode(Im(e, (t, n) => s_(n)));
  }
  async dumpsTyped(e) {
    return e instanceof Uint8Array ? ["bytes", e] : ["json", this._dumps(e)];
  }
  async _loads(e) {
    return Ta(JSON.parse(e));
  }
  async loadsTyped(e, t) {
    if (e === "bytes") return typeof t == "string" ? new TextEncoder().encode(t) : t;
    if (e === "json") return this._loads(typeof t == "string" ? t : new TextDecoder().decode(t));
    throw new Error(`Unknown serialization type: ${e}`);
  }
};
function Ul(e) {
  if (typeof e != "object" || e === null) return e;
  const t = Array.isArray(e) ? [] : {};
  for (const n in e) Object.prototype.hasOwnProperty.call(e, n) && (t[n] = Ul(e[n]));
  return t;
}
function sr() {
  return {
    v: 4,
    id: Mc(0),
    ts: (/* @__PURE__ */ new Date()).toISOString(),
    channel_values: {},
    channel_versions: {},
    versions_seen: {}
  };
}
function bn(e) {
  return {
    v: e.v,
    id: e.id,
    ts: e.ts,
    channel_values: { ...e.channel_values ?? {} },
    channel_versions: { ...e.channel_versions ?? {} },
    versions_seen: Ul(e.versions_seen ?? {})
  };
}
var Wl = class {
  serde = new Hl();
  constructor(e) {
    this.serde = e || this.serde;
  }
  /**
  * Prevent `JSON.stringify` from traversing backend clients (e.g. pg Pool
  * timers) when a checkpointer is present in runnable `configurable`.
  */
  toJSON() {
    return `[${this.constructor.name}]`;
  }
  async get(e) {
    const t = await this.getTuple(e);
    return t ? t.checkpoint : void 0;
  }
  /**
  * Walk the parent chain returning per-channel writes + seed, used to
  * reconstruct `DeltaChannel` state from `checkpoint_writes`.
  *
  * For each requested channel, walks ancestors of the checkpoint identified
  * by `config` (following `parentConfig`) and accumulates the pending writes
  * for that channel. The walk terminates per-channel at the nearest ancestor
  * whose `channel_values[ch]` is populated; that value is returned as `seed`.
  * If the walk reaches the root without finding a stored value, `seed` is
  * omitted from that channel's entry — the consumer treats the absence as
  * "start empty".
  *
  * Walks the parent chain (not `list({ before })`): for forked threads, only
  * on-path ancestors contribute.
  *
  * The default implementation walks `getTuple` + `parentConfig` once for all
  * channels — each ancestor visited once, not once per channel. Savers with
  * direct storage access (e.g. `MemorySaver`) override for performance; the
  * return contract is fixed here.
  *
  * @remarks Beta. The signature, return shape, and interaction with
  * `DeltaSnapshot` blobs may change. Override at your own risk; the default
  * implementation will continue to work against the public
  * `BaseCheckpointSaver` contract.
  *
  * @param options.config Configuration identifying the target checkpoint.
  * @param options.channels Channel names to walk for. Empty → empty mapping.
  * @returns Per-channel {@link DeltaChannelHistory} for every requested name.
  */
  async getDeltaChannelHistory(e) {
    const { config: t, channels: n } = e;
    if (n.length === 0) return {};
    const s = {}, r = {}, a = new Set(n);
    for (const c of n) s[c] = [];
    let i = (await this.getTuple(t))?.parentConfig;
    for (; i != null && a.size > 0; ) {
      const c = await this.getTuple(i);
      if (c === void 0) break;
      if (c.pendingWrites && c.pendingWrites.length > 0) {
        const l = {};
        for (const u of c.pendingWrites) {
          const d = u[1];
          a.has(d) && (l[d] ??= []).push(u);
        }
        for (const u of Object.keys(l)) {
          const d = l[u];
          d.sort((h, f) => h[0] < f[0] ? -1 : h[0] > f[0] ? 1 : 0);
          for (let h = d.length - 1; h >= 0; h -= 1) s[u].push(d[h]);
        }
      }
      for (const l of Array.from(a)) Object.prototype.hasOwnProperty.call(c.checkpoint.channel_values, l) && (r[l] = c.checkpoint.channel_values[l], a.delete(l));
      i = c.parentConfig;
    }
    const o = {};
    for (const c of n) {
      const l = { writes: s[c].slice().reverse() };
      Object.prototype.hasOwnProperty.call(r, c) && (l.seed = r[c]), o[c] = l;
    }
    return o;
  }
  /**
  * Generate the next version ID for a channel.
  *
  * Default is to use integer versions, incrementing by 1. If you override, you can use str/int/float versions,
  * as long as they are monotonically increasing.
  */
  getNextVersion(e) {
    if (typeof e == "string") throw new Error("Please override this method to use string versions.");
    return e !== void 0 && typeof e == "number" ? e + 1 : 1;
  }
};
function zl(e, t) {
  return typeof e == "number" && typeof t == "number" ? Math.sign(e - t) : String(e).localeCompare(String(t));
}
function Gl(...e) {
  return e.reduce((t, n, s) => s === 0 ? n : zl(t, n) >= 0 ? t : n);
}
const Jl = {
  [km]: -1,
  [$s]: -2,
  [Cm]: -3,
  [Em]: -4
}, r_ = /* @__PURE__ */ new Set([
  "thread_id",
  "checkpoint_id",
  "checkpoint_ns",
  "checkpoint_map",
  "langgraph_step",
  "langgraph_node",
  "langgraph_triggers",
  "langgraph_path",
  "langgraph_checkpoint_ns"
]);
function wo(e) {
  return e.configurable?.checkpoint_id || e.configurable?.thread_ts || "";
}
const a_ = /* @__PURE__ */ new Set([
  "__proto__",
  "constructor",
  "prototype"
]);
function pe(e, t, n = {}) {
  const { allowEmpty: s = !1 } = n;
  if (typeof t != "string") {
    const r = t === null ? "null" : t === void 0 ? "undefined" : Array.isArray(t) ? "array" : typeof t;
    throw new Error(`Invalid configurable value for key "${e}": expected a string identifier (got ${r}). This guard protects MemorySaver from prototype pollution.`);
  }
  if (!s && t === "") throw new Error(`Invalid configurable value for key "${e}": empty string is not permitted as an in-memory storage key.`);
  if (a_.has(t)) throw new Error(`Invalid configurable value for key "${e}": value "${t}" is reserved (would mutate Object.prototype). This guard protects MemorySaver from prototype pollution.`);
}
function tn(e, t, n) {
  return JSON.stringify([
    e,
    t,
    n
  ]);
}
function i_(e) {
  const [t, n, s] = JSON.parse(e);
  return {
    threadId: t,
    checkpointNamespace: n,
    checkpointId: s
  };
}
var o_ = class extends Wl {
  storage = /* @__PURE__ */ Object.create(null);
  writes = /* @__PURE__ */ Object.create(null);
  constructor(e) {
    super(e);
  }
  /** @internal */
  async _migratePendingSends(e, t, n, s) {
    const r = e, a = tn(t, n, s), i = await Promise.all(Object.values(this.writes[a] ?? {}).filter(([o, c]) => c === Or).map(async ([o, c, l]) => await this.serde.loadsTyped("json", l)));
    r.channel_values ??= {}, r.channel_values[Or] = i, r.channel_versions ??= {}, r.channel_versions[Or] = Object.keys(r.channel_versions).length > 0 ? Gl(...Object.values(r.channel_versions)) : this.getNextVersion(void 0);
  }
  async getTuple(e) {
    const t = e.configurable?.thread_id, n = e.configurable?.checkpoint_ns ?? "";
    let s = wo(e);
    if (t !== void 0 && pe("thread_id", t), pe("checkpoint_ns", n, { allowEmpty: !0 }), s && pe("checkpoint_id", s), s) {
      const r = this.storage[t]?.[n]?.[s];
      if (r !== void 0) {
        const [a, i, o] = r, c = tn(t, n, s), l = await this.serde.loadsTyped("json", a);
        l.v < 4 && o !== void 0 && await this._migratePendingSends(l, t, n, o);
        const u = await Promise.all(Object.values(this.writes[c] || {}).map(async ([h, f, p]) => [
          h,
          f,
          await this.serde.loadsTyped("json", p)
        ])), d = {
          config: e,
          checkpoint: l,
          metadata: await this.serde.loadsTyped("json", i),
          pendingWrites: u
        };
        return o !== void 0 && (d.parentConfig = { configurable: {
          thread_id: t,
          checkpoint_ns: n,
          checkpoint_id: o
        } }), d;
      }
    } else {
      const r = this.storage[t]?.[n];
      if (r !== void 0) {
        s = Object.keys(r).sort((h, f) => f.localeCompare(h))[0];
        const [a, i, o] = r[s], c = tn(t, n, s), l = await this.serde.loadsTyped("json", a);
        l.v < 4 && o !== void 0 && await this._migratePendingSends(l, t, n, o);
        const u = await Promise.all(Object.values(this.writes[c] || {}).map(async ([h, f, p]) => [
          h,
          f,
          await this.serde.loadsTyped("json", p)
        ])), d = {
          config: { configurable: {
            thread_id: t,
            checkpoint_id: s,
            checkpoint_ns: n
          } },
          checkpoint: l,
          metadata: await this.serde.loadsTyped("json", i),
          pendingWrites: u
        };
        return o !== void 0 && (d.parentConfig = { configurable: {
          thread_id: t,
          checkpoint_ns: n,
          checkpoint_id: o
        } }), d;
      }
    }
  }
  async *list(e, t) {
    let { before: n, limit: s, filter: r } = t ?? {};
    e.configurable?.thread_id !== void 0 && pe("thread_id", e.configurable.thread_id), e.configurable?.checkpoint_ns !== void 0 && pe("checkpoint_ns", e.configurable.checkpoint_ns, { allowEmpty: !0 }), e.configurable?.checkpoint_id && pe("checkpoint_id", e.configurable.checkpoint_id), n?.configurable?.checkpoint_id && pe("checkpoint_id", n.configurable.checkpoint_id);
    const a = e.configurable?.thread_id ? [e.configurable?.thread_id] : Object.keys(this.storage), i = e.configurable?.checkpoint_ns, o = e.configurable?.checkpoint_id;
    for (const c of a) for (const l of Object.keys(this.storage[c] ?? {})) {
      if (i !== void 0 && l !== i) continue;
      const u = this.storage[c]?.[l] ?? {}, d = Object.entries(u).sort((h, f) => f[0].localeCompare(h[0]));
      for (const [h, [f, p, m]] of d) {
        if (o && h !== o || n && n.configurable?.checkpoint_id && h >= n.configurable.checkpoint_id) continue;
        const g = await this.serde.loadsTyped("json", p);
        if (r && !Object.entries(r).every(([I, w]) => g[I] === w)) continue;
        if (s !== void 0) {
          if (s <= 0) break;
          s -= 1;
        }
        const y = tn(c, l, h), _ = Object.values(this.writes[y] || {}), b = await Promise.all(_.map(async ([I, w, C]) => [
          I,
          w,
          await this.serde.loadsTyped("json", C)
        ])), v = await this.serde.loadsTyped("json", f);
        v.v < 4 && m !== void 0 && await this._migratePendingSends(v, c, l, m);
        const M = {
          config: { configurable: {
            thread_id: c,
            checkpoint_ns: l,
            checkpoint_id: h
          } },
          checkpoint: v,
          metadata: g,
          pendingWrites: b
        };
        m !== void 0 && (M.parentConfig = { configurable: {
          thread_id: c,
          checkpoint_ns: l,
          checkpoint_id: m
        } }), yield M;
      }
    }
  }
  async put(e, t, n) {
    const s = bn(t), r = e.configurable?.thread_id, a = e.configurable?.checkpoint_ns ?? "";
    if (r === void 0) throw new Error('Failed to put checkpoint. The passed RunnableConfig is missing a required "thread_id" field in its "configurable" property. When using a checkpointer, you must pass a "thread_id" so the checkpointer knows which conversation thread to persist state for. Example: graph.stream(input, { configurable: { thread_id: "my-thread-id" } })');
    pe("thread_id", r), pe("checkpoint_ns", a, { allowEmpty: !0 }), pe("checkpoint_id", t.id), this.storage[r] || (this.storage[r] = /* @__PURE__ */ Object.create(null)), this.storage[r][a] || (this.storage[r][a] = /* @__PURE__ */ Object.create(null));
    const [[, i], [, o]] = await Promise.all([this.serde.dumpsTyped(s), this.serde.dumpsTyped(n)]);
    return this.storage[r][a][t.id] = [
      i,
      o,
      e.configurable?.checkpoint_id
    ], { configurable: {
      thread_id: r,
      checkpoint_ns: a,
      checkpoint_id: t.id
    } };
  }
  async putWrites(e, t, n) {
    const s = e.configurable?.thread_id, r = e.configurable?.checkpoint_ns, a = e.configurable?.checkpoint_id;
    if (s === void 0) throw new Error('Failed to put writes. The passed RunnableConfig is missing a required "thread_id" field in its "configurable" property. When using a checkpointer, you must pass a "thread_id" so the checkpointer knows which conversation thread to persist state for. Example: graph.stream(input, { configurable: { thread_id: "my-thread-id" } })');
    if (a === void 0) throw new Error('Failed to put writes. The passed RunnableConfig is missing a required "checkpoint_id" field in its "configurable" property.');
    pe("thread_id", s), pe("checkpoint_ns", r, { allowEmpty: !0 }), pe("checkpoint_id", a), pe("task_id", n);
    const i = tn(s, r, a), o = this.writes[i];
    this.writes[i] === void 0 && (this.writes[i] = /* @__PURE__ */ Object.create(null)), await Promise.all(t.map(async ([c, l], u) => {
      const [, d] = await this.serde.dumpsTyped(l), h = [n, Jl[c] || u], f = `${h[0]},${h[1]}`;
      h[1] >= 0 && o && f in o || (this.writes[i][f] = [
        n,
        c,
        d
      ]);
    }));
  }
  async deleteThread(e) {
    pe("thread_id", e), delete this.storage[e];
    for (const t of Object.keys(this.writes)) i_(t).threadId === e && delete this.writes[t];
  }
  /**
  * Override: walk the parent chain ONCE for all requested channels using
  * direct storage access.
  *
  * Each channel terminates independently at the nearest ancestor whose
  * stored `channel_values[ch]` is populated. Other channels keep walking
  * until they find their own terminator or hit the root.
  *
  * The seed value (whether a `DeltaSnapshot` or a plain pre-delta migration
  * blob) is the value AT that ancestor, prior to its own pending writes that
  * produce the child. Those on-path writes — including the ones stored on the
  * terminating ancestor — are always collected and replayed on top of the
  * seed, so a thread migrated from a pre-delta channel does not drop the
  * writes saved under the migration boundary checkpoint.
  *
  * @remarks Beta. See {@link BaseCheckpointSaver.getDeltaChannelHistory}.
  */
  async getDeltaChannelHistory(e) {
    const { config: t, channels: n } = e;
    if (n.length === 0) return {};
    const s = t.configurable?.thread_id, r = t.configurable?.checkpoint_ns ?? "", a = wo(t);
    s !== void 0 && pe("thread_id", s), pe("checkpoint_ns", r, { allowEmpty: !0 });
    const i = this.storage[s]?.[r] ?? {}, o = [];
    let c = (a ? i[a] : void 0)?.[2];
    for (; c !== void 0; ) {
      const f = i[c];
      if (f === void 0) break;
      o.push(c), c = f[2];
    }
    const l = {}, u = {}, d = new Set(n);
    for (const f of n) l[f] = [];
    for (const f of o) {
      if (d.size === 0) break;
      const p = i[f], m = p !== void 0 ? await this.serde.loadsTyped("json", p[0]) : void 0, g = {}, y = /* @__PURE__ */ new Set();
      if (m !== void 0)
        for (const v of d) Object.prototype.hasOwnProperty.call(m.channel_values, v) && m.channel_values[v] !== void 0 && (g[v] = m.channel_values[v], y.add(v));
      const _ = tn(s, r, f), b = Object.entries(this.writes[_] ?? {});
      b.sort(([v], [M]) => {
        const [I, w] = v.split(","), [C, O] = M.split(",");
        return I !== C ? I < C ? 1 : -1 : Number(O) - Number(w);
      });
      for (const [, [v, M, I]] of b)
        d.has(M) && l[M].push([
          v,
          M,
          await this.serde.loadsTyped("json", I)
        ]);
      for (const v of y)
        u[v] = g[v], d.delete(v);
    }
    const h = {};
    for (const f of n) {
      const p = { writes: l[f].slice().reverse() };
      Object.prototype.hasOwnProperty.call(u, f) && (p.seed = u[f]), h[f] = p;
    }
    return h;
  }
}, Pn = class extends Error {
  constructor(e) {
    super(e), this.name = "InvalidNamespaceError";
  }
};
function c_(e) {
  if (e.length === 0) throw new Pn("Namespace cannot be empty.");
  for (const t of e) {
    if (typeof t != "string") throw new Pn(`Invalid namespace label '${t}' found in ${e}. Namespace labels must be strings, but got ${typeof t}.`);
    if (t.includes(".")) throw new Pn(`Invalid namespace label '${t}' found in ${e}. Namespace labels cannot contain periods ('.').`);
    if (t === "") throw new Pn(`Namespace labels cannot be empty strings. Got ${t} in ${e}`);
  }
  if (e[0] === "langgraph") throw new Pn(`Root label for namespace cannot be "langgraph". Got: ${e}`);
}
var Di = class {
  /**
  * Retrieve a single item by its namespace and key.
  *
  * @param namespace Hierarchical path for the item
  * @param key Unique identifier within the namespace
  * @returns Promise resolving to the item or null if not found
  */
  async get(e, t) {
    return (await this.batch([{
      namespace: e,
      key: t
    }]))[0];
  }
  /**
  * Search for items within a namespace prefix.
  * Supports both metadata filtering and vector similarity search.
  *
  * @param namespacePrefix Hierarchical path prefix to search within
  * @param options Search options for filtering and pagination
  * @returns Promise resolving to list of matching items with relevance scores
  *
  * @example
  * // Search with filters
  * await store.search(["documents"], {
  *   filter: { type: "report", status: "active" },
  *   limit: 5,
  *   offset: 10
  * });
  *
  * // Vector similarity search
  * await store.search(["users", "content"], {
  *   query: "technical documentation about APIs",
  *   limit: 20
  * });
  */
  async search(e, t = {}) {
    const { filter: n, limit: s = 10, offset: r = 0, query: a } = t;
    return (await this.batch([{
      namespacePrefix: e,
      filter: n,
      limit: s,
      offset: r,
      query: a
    }]))[0];
  }
  /**
  * Store or update an item.
  *
  * @param namespace Hierarchical path for the item
  * @param key Unique identifier within the namespace
  * @param value Object containing the item's data
  * @param index Optional indexing configuration
  *
  * @example
  * // Simple storage
  * await store.put(["docs"], "report", { title: "Annual Report" });
  *
  * // With specific field indexing
  * await store.put(
  *   ["docs"],
  *   "report",
  *   {
  *     title: "Q4 Report",
  *     chapters: [{ content: "..." }, { content: "..." }]
  *   },
  *   ["title", "chapters[*].content"]
  * );
  */
  async put(e, t, n, s) {
    c_(e), await this.batch([{
      namespace: e,
      key: t,
      value: n,
      index: s
    }]);
  }
  /**
  * Delete an item from the store.
  *
  * @param namespace Hierarchical path for the item
  * @param key Unique identifier within the namespace
  */
  async delete(e, t) {
    await this.batch([{
      namespace: e,
      key: t,
      value: null
    }]);
  }
  /**
  * List and filter namespaces in the store.
  * Used to explore data organization and navigate the namespace hierarchy.
  *
  * @param options Options for listing namespaces
  * @returns Promise resolving to list of namespace paths
  *
  * @example
  * // List all namespaces under "documents"
  * await store.listNamespaces({
  *   prefix: ["documents"],
  *   maxDepth: 2
  * });
  *
  * // List namespaces ending with "v1"
  * await store.listNamespaces({
  *   suffix: ["v1"],
  *   limit: 50
  * });
  */
  async listNamespaces(e = {}) {
    const { prefix: t, suffix: n, maxDepth: s, limit: r = 100, offset: a = 0 } = e, i = [];
    return t && i.push({
      matchType: "prefix",
      path: t
    }), n && i.push({
      matchType: "suffix",
      path: n
    }), (await this.batch([{
      matchConditions: i.length ? i : void 0,
      maxDepth: s,
      limit: r,
      offset: a
    }]))[0];
  }
  /**
  * Start the store. Override if initialization is needed.
  */
  start() {
  }
  /**
  * Stop the store. Override if cleanup is needed.
  */
  stop() {
  }
};
const l_ = (e) => "lg_name" in e && e.lg_name === "AsyncBatchedStore" ? e.store : e;
var Kl = class extends Di {
  lg_name = "AsyncBatchedStore";
  store;
  queue = /* @__PURE__ */ new Map();
  nextKey = 0;
  running = !1;
  processingTask = null;
  constructor(e) {
    super(), this.store = l_(e);
  }
  get isRunning() {
    return this.running;
  }
  /**
  * @ignore
  * Batch is not implemented here as we're only extending `BaseStore`
  * to allow it to be passed where `BaseStore` is expected, and implement
  * the convenience methods (get, search, put, delete).
  */
  async batch(e) {
    throw new Error("The `batch` method is not implemented on `AsyncBatchedStore`.\n Instead, it calls the `batch` method on the wrapped store.\n If you are seeing this error, something is wrong.");
  }
  async get(e, t) {
    return this.enqueueOperation({
      namespace: e,
      key: t
    });
  }
  async search(e, t) {
    const { filter: n, limit: s = 10, offset: r = 0, query: a } = t || {};
    return this.enqueueOperation({
      namespacePrefix: e,
      filter: n,
      limit: s,
      offset: r,
      query: a
    });
  }
  async put(e, t, n) {
    return this.enqueueOperation({
      namespace: e,
      key: t,
      value: n
    });
  }
  async delete(e, t) {
    return this.enqueueOperation({
      namespace: e,
      key: t,
      value: null
    });
  }
  start() {
    this.running || (this.running = !0, this.processingTask = this.processBatchQueue());
  }
  async stop() {
    this.running = !1, this.processingTask && await this.processingTask;
  }
  enqueueOperation(e) {
    return new Promise((t, n) => {
      const s = this.nextKey;
      this.nextKey += 1, this.queue.set(s, {
        operation: e,
        resolve: t,
        reject: n
      });
    });
  }
  async processBatchQueue() {
    for (; this.running; ) {
      if (await new Promise((t) => {
        setTimeout(t, 0);
      }), this.queue.size === 0) continue;
      const e = new Map(this.queue);
      this.queue.clear();
      try {
        const t = Array.from(e.values()).map(({ operation: s }) => s), n = await this.store.batch(t);
        e.forEach(({ resolve: s }, r) => {
          s(n[Array.from(e.keys()).indexOf(r)]);
        });
      } catch (t) {
        e.forEach(({ reject: n }) => {
          n(t);
        });
      }
    }
  }
  toJSON() {
    return {
      queue: this.queue,
      nextKey: this.nextKey,
      running: this.running,
      store: "[LangGraphStore]"
    };
  }
};
function rr(e) {
  if (!e) return [];
  const t = [];
  let n = [], s = 0;
  for (; s < e.length; ) {
    const r = e[s];
    if (r === "[") {
      n.length && (t.push(n.join("")), n = []);
      let a = 1;
      const i = ["["];
      for (s += 1; s < e.length && a > 0; )
        e[s] === "[" ? a += 1 : e[s] === "]" && (a -= 1), i.push(e[s]), s += 1;
      t.push(i.join(""));
      continue;
    } else if (r === "{") {
      n.length && (t.push(n.join("")), n = []);
      let a = 1;
      const i = ["{"];
      for (s += 1; s < e.length && a > 0; )
        e[s] === "{" ? a += 1 : e[s] === "}" && (a -= 1), i.push(e[s]), s += 1;
      t.push(i.join(""));
      continue;
    } else r === "." ? n.length && (t.push(n.join("")), n = []) : n.push(r);
    s += 1;
  }
  return n.length && t.push(n.join("")), t;
}
function u_(e) {
  return typeof e == "object" && e !== null && Object.keys(e).every((t) => t === "$eq" || t === "$ne" || t === "$gt" || t === "$gte" || t === "$lt" || t === "$lte" || t === "$in" || t === "$nin");
}
function h_(e, t) {
  return u_(t) ? Object.keys(t).filter((n) => n.startsWith("$")).every((n) => {
    const s = t[n];
    switch (n) {
      case "$eq":
        return e === s;
      case "$ne":
        return e !== s;
      case "$gt":
        return Number(e) > Number(s);
      case "$gte":
        return Number(e) >= Number(s);
      case "$lt":
        return Number(e) < Number(s);
      case "$lte":
        return Number(e) <= Number(s);
      case "$in":
        return Array.isArray(s) ? s.includes(e) : !1;
      case "$nin":
        return Array.isArray(s) ? !s.includes(e) : !0;
      default:
        return !1;
    }
  }) : e === t;
}
function d_(e, t) {
  if (!t || t === "$") return [JSON.stringify(e, null, 2)];
  const n = Array.isArray(t) ? t : rr(t);
  function s(r, a, i) {
    if (i >= a.length)
      return typeof r == "string" || typeof r == "number" || typeof r == "boolean" ? [String(r)] : r == null ? [] : Array.isArray(r) || typeof r == "object" ? [JSON.stringify(r, null, 2)] : [];
    const o = a[i], c = [];
    if (i === 0 && o === "$" && c.push(JSON.stringify(r, null, 2)), o.startsWith("[") && o.endsWith("]")) {
      if (!Array.isArray(r)) return [];
      const l = o.slice(1, -1);
      if (l === "*") for (const u of r) c.push(...s(u, a, i + 1));
      else try {
        let u = parseInt(l, 10);
        u < 0 && (u = r.length + u), u >= 0 && u < r.length && c.push(...s(r[u], a, i + 1));
      } catch {
        return [];
      }
    } else if (o.startsWith("{") && o.endsWith("}")) {
      if (typeof r != "object" || r === null) return [];
      const l = o.slice(1, -1).split(",").map((u) => u.trim());
      for (const u of l) {
        const d = rr(u);
        if (d.length) {
          let h = r;
          for (const f of d) if (h && typeof h == "object" && f in h) h = h[f];
          else {
            h = void 0;
            break;
          }
          h !== void 0 && (typeof h == "string" || typeof h == "number" || typeof h == "boolean" ? c.push(String(h)) : (Array.isArray(h) || typeof h == "object") && c.push(JSON.stringify(h, null, 2)));
        }
      }
    } else if (o === "*") {
      if (Array.isArray(r)) for (const l of r) c.push(...s(l, a, i + 1));
      else if (typeof r == "object" && r !== null) for (const l of Object.values(r)) c.push(...s(l, a, i + 1));
    } else typeof r == "object" && r !== null && o in r && c.push(...s(r[o], a, i + 1));
    return c;
  }
  return s(e, n, 0);
}
var f_ = class extends Di {
  data = /* @__PURE__ */ new Map();
  vectors = /* @__PURE__ */ new Map();
  _indexConfig;
  constructor(e) {
    super(), e?.index && (this._indexConfig = {
      ...e.index,
      __tokenizedFields: (e.index.fields ?? ["$"]).map((t) => [t, t === "$" ? [t] : rr(t)])
    });
  }
  async batch(e) {
    const t = [], n = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Map();
    for (let r = 0; r < e.length; r += 1) {
      const a = e[r];
      if ("key" in a && "namespace" in a && !("value" in a)) t.push(this.getOperation(a));
      else if ("namespacePrefix" in a) {
        const i = this.filterItems(a);
        s.set(r, [a, i]), t.push(null);
      } else if ("value" in a) {
        const i = `${a.namespace.join(":")}:${a.key}`;
        n.set(i, a), t.push(null);
      } else "matchConditions" in a && t.push(this.listNamespacesOperation(a));
    }
    if (s.size > 0) if (this._indexConfig?.embeddings) {
      const r = /* @__PURE__ */ new Set();
      for (const [o] of s.values()) o.query && r.add(o.query);
      const a = r.size > 0 ? await Promise.all(Array.from(r).map((o) => this._indexConfig.embeddings.embedQuery(o))) : [], i = Object.fromEntries(Array.from(r).map((o, c) => [o, a[c]]));
      for (const [o, [c, l]] of s.entries()) if (c.query && i[c.query]) {
        const u = i[c.query];
        t[o] = this.scoreResults(l, u, c.offset ?? 0, c.limit ?? 10);
      } else t[o] = this.paginateResults(l.map((u) => ({
        ...u,
        score: void 0
      })), c.offset ?? 0, c.limit ?? 10);
    } else for (const [r, [a, i]] of s.entries()) t[r] = this.paginateResults(i.map((o) => ({
      ...o,
      score: void 0
    })), a.offset ?? 0, a.limit ?? 10);
    if (n.size > 0 && this._indexConfig?.embeddings) {
      const r = this.extractTexts(Array.from(n.values()));
      if (Object.keys(r).length > 0) {
        const a = await this._indexConfig.embeddings.embedDocuments(Object.keys(r));
        this.insertVectors(r, a);
      }
    }
    for (const r of n.values()) this.putOperation(r);
    return t;
  }
  getOperation(e) {
    const t = e.namespace.join(":");
    return this.data.get(t)?.get(e.key) ?? null;
  }
  putOperation(e) {
    const t = e.namespace.join(":");
    this.data.has(t) || this.data.set(t, /* @__PURE__ */ new Map());
    const n = this.data.get(t);
    if (e.value === null) n.delete(e.key);
    else {
      const s = /* @__PURE__ */ new Date();
      if (n.has(e.key)) {
        const r = n.get(e.key);
        r.value = e.value, r.updatedAt = s;
      } else n.set(e.key, {
        value: e.value,
        key: e.key,
        namespace: e.namespace,
        createdAt: s,
        updatedAt: s
      });
    }
  }
  listNamespacesOperation(e) {
    let t = Array.from(this.data.keys()).map((n) => n.split(":"));
    return e.matchConditions && e.matchConditions.length > 0 && (t = t.filter((n) => e.matchConditions.every((s) => this.doesMatch(s, n)))), e.maxDepth !== void 0 && (t = Array.from(new Set(t.map((n) => n.slice(0, e.maxDepth).join(":")))).map((n) => n.split(":"))), t.sort((n, s) => n.join(":").localeCompare(s.join(":"))), t.slice(e.offset ?? 0, (e.offset ?? 0) + (e.limit ?? t.length));
  }
  doesMatch(e, t) {
    const { matchType: n, path: s } = e;
    if (n === "prefix")
      return s.length > t.length ? !1 : s.every((r, a) => {
        const i = t[a];
        return r === "*" || i === r;
      });
    if (n === "suffix")
      return s.length > t.length ? !1 : s.every((r, a) => {
        const i = t[t.length - s.length + a];
        return r === "*" || i === r;
      });
    throw new Error(`Unsupported match type: ${n}`);
  }
  filterItems(e) {
    const t = [];
    for (const [s, r] of this.data.entries()) s.startsWith(e.namespacePrefix.join(":")) && t.push(...r.values());
    let n = t;
    return e.filter && (n = t.filter((s) => Object.entries(e.filter).every(([r, a]) => h_(s.value[r], a)))), n;
  }
  scoreResults(e, t, n = 0, s = 10) {
    const r = [], a = [], i = [];
    for (const u of e) {
      const d = this.getVectors(u);
      if (d.length) for (const h of d)
        r.push(u), a.push(h);
      else i.push(u);
    }
    const o = this.cosineSimilarity(t, a).map((u, d) => [u, r[d]]).sort((u, d) => d[0] - u[0]), c = /* @__PURE__ */ new Set(), l = [];
    for (const [u, d] of o) {
      const h = `${d.namespace.join(":")}:${d.key}`;
      if (c.has(h)) continue;
      const f = c.size;
      if (f >= n + s) break;
      if (f < n) {
        c.add(h);
        continue;
      }
      c.add(h), l.push([u, d]);
    }
    if (i.length && l.length < s) for (const u of i.slice(0, s - l.length)) {
      const d = `${u.namespace.join(":")}:${u.key}`;
      c.has(d) || (c.add(d), l.push([void 0, u]));
    }
    return l.map(([u, d]) => ({
      ...d,
      score: u
    }));
  }
  paginateResults(e, t, n) {
    return e.slice(t, t + n);
  }
  extractTexts(e) {
    if (!e.length || !this._indexConfig) return {};
    const t = {};
    for (const n of e) if (n.value !== null && n.index !== !1) {
      const s = n.index === null || n.index === void 0 ? this._indexConfig.__tokenizedFields ?? [] : n.index.map((r) => [r, rr(r)]);
      for (const [r, a] of s) {
        const i = d_(n.value, a);
        i.length && (i.length > 1 ? i.forEach((o, c) => {
          t[o] || (t[o] = []), t[o].push([
            n.namespace,
            n.key,
            `${r}.${c}`
          ]);
        }) : (t[i[0]] || (t[i[0]] = []), t[i[0]].push([
          n.namespace,
          n.key,
          r
        ])));
      }
    }
    return t;
  }
  insertVectors(e, t) {
    for (const [n, s] of Object.entries(e)) {
      const r = t.shift();
      if (!r) throw new Error(`No embedding found for text: ${n}`);
      for (const [a, i, o] of s) {
        const c = a.join(":");
        this.vectors.has(c) || this.vectors.set(c, /* @__PURE__ */ new Map());
        const l = this.vectors.get(c);
        l.has(i) || l.set(i, /* @__PURE__ */ new Map()), l.get(i).set(o, r);
      }
    }
  }
  getVectors(e) {
    const t = e.namespace.join(":"), n = e.key;
    if (!this.vectors.has(t)) return [];
    const s = this.vectors.get(t);
    if (!s.has(n)) return [];
    const r = s.get(n), a = Array.from(r.values());
    return a.length ? a : [];
  }
  cosineSimilarity(e, t) {
    if (!t.length) return [];
    const n = t.map((a) => a.reduce((i, o, c) => i + o * e[c], 0)), s = Math.sqrt(e.reduce((a, i) => a + i * i, 0)), r = t.map((a) => Math.sqrt(a.reduce((i, o) => i + o * o, 0)));
    return n.map((a, i) => {
      const o = r[i];
      return s && o ? a / (s * o) : 0;
    });
  }
  get indexConfig() {
    return this._indexConfig;
  }
}, p_ = class {
  serde = new Hl();
  /**
  * Initialize the cache with a serializer.
  *
  * @param serde - The serializer to use.
  */
  constructor(e) {
    this.serde = e || this.serde;
  }
};
const m_ = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function lt(e) {
  return e != null && e.lc_graph_name === "DeltaChannel";
}
function ql(e) {
  return e != null && e.lg_is_channel === !0;
}
var st = class {
  ValueType;
  UpdateType;
  /** @ignore */
  lg_is_channel = !0;
  /**
  * Mark the current value of the channel as consumed. By default, no-op.
  * A channel can use this method to modify its state, preventing the value
  * from being consumed again.
  *
  * Returns True if the channel was updated, False otherwise.
  */
  consume() {
    return !1;
  }
  /**
  * Notify the channel that the Pregel run is finishing. By default, no-op.
  * A channel can use this method to modify its state, preventing finish.
  *
  * Returns True if the channel was updated, False otherwise.
  */
  finish() {
    return !1;
  }
  /**
  * Return True if the channel is available (not empty), False otherwise.
  * Subclasses should override this method to provide a more efficient
  * implementation than calling get() and catching EmptyChannelError.
  */
  isAvailable() {
    try {
      return this.get(), !0;
    } catch (e) {
      if (e.name === re.unminifiable_name) return !1;
      throw e;
    }
  }
  /**
  * Compare this channel with another channel for equality.
  * Used to determine if two channels with the same key are semantically equivalent.
  * Subclasses should override this method to provide a meaningful comparison.
  *
  * @param {BaseChannel} other - The other channel to compare with.
  * @returns {boolean} True if the channels are equal, false otherwise.
  */
  equals(e) {
    return this === e;
  }
};
const xa = /* @__PURE__ */ Symbol.for("LG_IS_ONLY_BASE_CHANNEL");
function kr(e) {
  if (e[xa] === !0) return e;
  const t = {};
  for (const n in e) {
    if (!Object.prototype.hasOwnProperty.call(e, n)) continue;
    const s = e[n];
    ql(s) && (t[n] = s);
  }
  return Object.assign(t, { [xa]: !0 }), t;
}
function Zl(e, t) {
  const n = kr(e), s = {};
  for (const r in n) {
    if (!Object.prototype.hasOwnProperty.call(n, r)) continue;
    const a = t.channel_values[r];
    s[r] = n[r].fromCheckpoint(a);
  }
  return Object.assign(s, { [xa]: !0 }), s;
}
function g_(e, t) {
  if (!m_.test(t)) throw new TypeError(`Invalid task id for exit delta: ${t}`);
  const n = t.toLowerCase().split("-");
  return `${String(e).padStart(8, "0")}-${n[1]}-${n[2]}-${n[3]}-${n[4]}`;
}
function vo(e, t) {
  const n = /* @__PURE__ */ new Set(), s = um();
  for (const r in e) {
    if (!Object.prototype.hasOwnProperty.call(e, r)) continue;
    const a = e[r];
    if (!lt(a) || !a.isAvailable()) continue;
    const [i, o] = t[r] ?? [0, 0];
    (i >= a.snapshotFrequency || o >= s) && n.add(r);
  }
  return n;
}
function Vt(e, t, n, s) {
  const r = s?.channelsToSnapshot ?? /* @__PURE__ */ new Set(), { updatedChannels: a, getNextVersion: i } = s ?? {};
  let o, c = e.channel_versions;
  if (t === void 0) o = e.channel_values;
  else {
    o = {}, c = { ...e.channel_versions };
    for (const l in t) {
      if (!Object.prototype.hasOwnProperty.call(t, l)) continue;
      const u = t[l];
      if (r.has(l)) {
        i !== void 0 && (a === void 0 || !a.has(l)) && (c[l] = i(c[l])), o[l] = new Si(u.get());
        continue;
      }
      if (!lt(u))
        try {
          o[l] = u.checkpoint();
        } catch (d) {
          if (d.name !== re.unminifiable_name) throw d;
        }
    }
  }
  return {
    v: 4,
    id: s?.id ?? Mc(n),
    ts: (/* @__PURE__ */ new Date()).toISOString(),
    channel_values: o,
    channel_versions: c,
    versions_seen: e.versions_seen
  };
}
async function Ma(e, t, n) {
  const s = Zl(e, t), { saver: r, config: a } = n ?? {}, i = kr(e), o = [];
  for (const l in i)
    Object.prototype.hasOwnProperty.call(i, l) && lt(i[l]) && !Object.prototype.hasOwnProperty.call(t.channel_values, l) && o.push(l);
  if (o.length === 0 || r === void 0 || a === void 0) return s;
  const c = await r.getDeltaChannelHistory({
    config: a,
    channels: o
  });
  for (const l of o) {
    const u = c[l];
    if (u === void 0) continue;
    const d = i[l].fromCheckpoint(u.seed);
    d.replayWrites(u.writes), s[l] = d;
  }
  return s;
}
const y_ = (e) => e != null && e.lc_graph_name === "BinaryOperatorAggregate";
var ns = class Yl extends st {
  lc_graph_name = "BinaryOperatorAggregate";
  value;
  operator;
  initialValueFactory;
  constructor(t, n) {
    super(), this.operator = t, this.initialValueFactory = n, this.value = n?.();
  }
  fromCheckpoint(t) {
    const n = new Yl(this.operator, this.initialValueFactory);
    return typeof t < "u" && (n.value = t), n;
  }
  update(t) {
    let n = t;
    if (!n.length) return !1;
    if (this.value === void 0) {
      const r = n[0], [a, i] = Zt(r);
      a ? this.value = i : this.value = r, n = n.slice(1);
    }
    let s = !1;
    for (const r of n) if (Xs(r)) {
      if (s) throw new z("Can receive only one Overwrite value per step.");
      const [, a] = Zt(r);
      this.value = a, s = !0;
      continue;
    } else !s && this.value !== void 0 && (this.value = this.operator(this.value, r));
    return !0;
  }
  get() {
    if (this.value === void 0) throw new re();
    return this.value;
  }
  checkpoint() {
    if (this.value === void 0) throw new re();
    return this.value;
  }
  isAvailable() {
    return this.value !== void 0;
  }
  /**
  * Compare this channel with another channel for equality.
  * Two BinaryOperatorAggregate channels are equal if they have the same operator function.
  * This follows the Python implementation which compares operator references.
  */
  equals(t) {
    return this === t ? !0 : y_(t) ? this.operator === t.operator : !1;
  }
}, Sn = class Xl extends st {
  lc_graph_name = "LastValue";
  value = [];
  constructor(t) {
    super(), this.initialValueFactory = t, t && (this.value = [t()]);
  }
  fromCheckpoint(t) {
    const n = new Xl(this.initialValueFactory);
    return typeof t < "u" && (n.value = [t]), n;
  }
  update(t) {
    if (t.length === 0) return !1;
    if (t.length !== 1) throw new z("LastValue can only receive one value per step.", { lc_error_code: "INVALID_CONCURRENT_GRAPH_UPDATE" });
    return this.value = [t[t.length - 1]], !0;
  }
  get() {
    if (this.value.length === 0) throw new re();
    return this.value[0];
  }
  checkpoint() {
    if (this.value.length === 0) throw new re();
    return this.value[0];
  }
  isAvailable() {
    return this.value.length !== 0;
  }
}, __ = class Ql extends st {
  lc_graph_name = "LastValueAfterFinish";
  value = [];
  finished = !1;
  fromCheckpoint(t) {
    const n = new Ql();
    if (typeof t < "u") {
      const [s, r] = t;
      n.value = [s], n.finished = r;
    }
    return n;
  }
  update(t) {
    return t.length === 0 ? !1 : (this.finished = !1, this.value = [t[t.length - 1]], !0);
  }
  get() {
    if (this.value.length === 0 || !this.finished) throw new re();
    return this.value[0];
  }
  checkpoint() {
    if (this.value.length !== 0)
      return [this.value[0], this.finished];
  }
  consume() {
    return this.finished ? (this.finished = !1, this.value = [], !0) : !1;
  }
  finish() {
    return !this.finished && this.value.length > 0 ? (this.finished = !0, !0) : !1;
  }
  isAvailable() {
    return this.value.length !== 0 && this.finished;
  }
}, Ia = class {
  lc_graph_name = "AnnotationRoot";
  spec;
  constructor(e) {
    this.spec = e;
  }
  static isInstance(e) {
    return typeof e == "object" && e !== null && "lc_graph_name" in e && e.lc_graph_name === "AnnotationRoot";
  }
};
const ar = function(e) {
  return e ? Aa(e) : new Sn();
};
ar.Root = (e) => new Ia(e);
function Aa(e) {
  return typeof e == "object" && e && "reducer" in e && e.reducer ? new ns(e.reducer, e.default) : typeof e == "object" && e && "value" in e && e.value ? new ns(e.value, e.default) : new Sn();
}
const w_ = [
  "tags",
  "metadata",
  "callbacks",
  "configurable"
], v_ = [
  "tags",
  "metadata",
  "callbacks",
  "runName",
  "maxConcurrency",
  "recursionLimit",
  "configurable",
  "runId",
  "outputKeys",
  "streamMode",
  "store",
  "writer",
  "interrupt",
  "context",
  "interruptBefore",
  "interruptAfter",
  "checkpointDuring",
  "durability",
  "signal",
  "heartbeat",
  "executionInfo",
  "serverInfo",
  "control"
], b_ = 25, S_ = /* @__PURE__ */ new Set([
  "thread_id",
  "checkpoint_id",
  "checkpoint_ns",
  "task_id",
  "run_id",
  "assistant_id",
  "graph_id"
]);
function k_(e, t) {
  if (!e) return t;
  const n = t ?? {};
  for (const s of S_) {
    if (s in n) continue;
    const r = e[s];
    r !== void 0 && (n[s] = r);
  }
  return n;
}
function C_(e) {
  if (e == null || e.length === 0) return;
  const t = e.filter((n) => !n.startsWith("seq:step"));
  return t.length > 0 ? t : void 0;
}
function E_(e, t) {
  if (t === void 0) return e;
  if (e === void 0) return Array.isArray(t) ? [...t] : t.copy();
  if (Array.isArray(t)) {
    if (Array.isArray(e)) return e.concat(t);
    const n = e.copy();
    for (const s of t) n.addHandler(eo(s), !0);
    return n;
  }
  if (Array.isArray(e)) {
    const n = t.copy();
    for (const s of e) n.addHandler(eo(s), !0);
    return n;
  }
  return new Gt(t._parentRunId, {
    handlers: e.handlers.concat(t.handlers),
    inheritableHandlers: e.inheritableHandlers.concat(t.inheritableHandlers),
    tags: Array.from(new Set(e.tags.concat(t.tags))),
    inheritableTags: Array.from(new Set(e.inheritableTags.concat(t.inheritableTags))),
    metadata: {
      ...e.metadata,
      ...t.metadata
    },
    inheritableMetadata: {
      ...e.inheritableMetadata,
      ...t.inheritableMetadata
    }
  });
}
function T_(e) {
  let t;
  for (let a = e.length - 1; a >= 0; a -= 1) if (e[a] !== void 0) {
    t = e[a];
    break;
  }
  const n = t?.configurable?.thread_id !== void 0, s = e.some((a) => a?.configurable?.[Qe] !== void 0), r = le.getRunnableConfig()?.configurable?.[Qe] !== void 0;
  return n && !s && !r;
}
function Fi(...e) {
  const t = {
    tags: [],
    metadata: {},
    callbacks: void 0,
    recursionLimit: b_,
    configurable: {}
  }, n = T_(e), s = le.getRunnableConfig();
  if (s !== void 0) {
    for (const [r, a] of Object.entries(s)) if (a !== void 0) {
      if (r === "configurable" && n) continue;
      if (w_.includes(r)) {
        let i;
        Array.isArray(a) ? i = [...a] : typeof a == "object" ? r === "callbacks" && "copy" in a && typeof a.copy == "function" ? i = a.copy() : i = { ...a } : i = a, t[r] = i;
      } else t[r] = a;
    }
  }
  for (const r of e)
    if (r !== void 0)
      for (const [a, i] of Object.entries(r))
        i === void 0 || !v_.includes(a) || (a === "configurable" ? t.configurable = {
          ...t.configurable,
          ...i
        } : a === "metadata" ? t.metadata = {
          ...t.metadata,
          ...i
        } : a === "tags" ? t.tags = [...t.tags ?? [], ...i] : a === "callbacks" ? t.callbacks = E_(t.callbacks, i) : t[a] = i);
  return t.metadata = k_(t.configurable, t.metadata) ?? {}, t;
}
function x_(e) {
  const t = e ?? le.getRunnableConfig();
  if (t === void 0) throw new Error(["Config not retrievable. This is likely because you are running in an environment without support for AsyncLocalStorage.", "If you're running `getStore` in such environment, pass the `config` from the node function directly."].join(`
`));
  return t?.store;
}
function M_(e) {
  const t = e ?? le.getRunnableConfig();
  if (t === void 0) throw new Error(["Config not retrievable. This is likely because you are running in an environment without support for AsyncLocalStorage.", "If you're running `getWriter` in such environment, pass the `config` from the node function directly."].join(`
`));
  return t?.writer || t?.configurable?.writer;
}
function Oa() {
  return le.getRunnableConfig();
}
function I_(e) {
  const t = e ?? le.getRunnableConfig();
  if (t === void 0) throw new Error(["Config not retrievable. This is likely because you are running in an environment without support for AsyncLocalStorage.", "If you're running `getCurrentTaskInput` in such environment, pass the `config` from the node function directly."].join(`
`));
  if (t.configurable?.__pregel_scratchpad?.currentTaskInput === void 0) throw new Error("BUG: internal scratchpad not initialized.");
  return t.configurable[et].currentTaskInput;
}
function jr(e) {
  return e.split("|").filter((t) => !t.match(/^\d+$/)).map((t) => t.split(":")[0]).join("|");
}
function A_(e) {
  const t = e.split("|");
  for (; t.length > 1 && t[t.length - 1].match(/^\d+$/); ) t.pop();
  return t.slice(0, -1).join("|");
}
var eu = class {
  #e = void 0;
  /**
  * Request that the current run drain cooperatively, stopping at the next
  * superstep boundary. Does not cancel work that is already running.
  *
  * @param reason - A short description of why the drain was requested.
  *   Surfaced on the resulting {@link GraphDrained} error.
  */
  requestDrain(e = "shutdown") {
    this.#e = e;
  }
  /** Whether a drain has been requested for this run. */
  get drainRequested() {
    return this.#e !== void 0;
  }
  /** The reason passed to {@link RunControl#requestDrain}, if any. */
  get drainReason() {
    return this.#e;
  }
};
const tu = [
  "values",
  "updates",
  "messages",
  "tools",
  "custom",
  "tasks"
];
function Cr(e) {
  if (e == null || typeof e != "object") return !1;
  const t = e;
  return typeof t.id == "string" && ("source" in t || typeof t.step == "number") && !("values" in t) && !("config" in t);
}
function O_(e) {
  if (!Array.isArray(e) || e.length !== 2) return { data: e };
  const [t, n] = e;
  if (n == null || typeof n != "object") return { data: e };
  const s = n, r = typeof s.langgraph_node == "string" ? s.langgraph_node : void 0, a = typeof s.run_id == "string" ? s.run_id : void 0;
  return {
    data: a != null && t != null && typeof t == "object" ? {
      ...t,
      run_id: a
    } : t,
    node: r
  };
}
function nu({ namespace: e, mode: t, payload: n, seq: s }) {
  const r = Date.now(), a = { type: "event" };
  switch (t) {
    case "messages": {
      const { data: i, node: o } = O_(n);
      return [{
        ...a,
        seq: s,
        method: "messages",
        params: {
          namespace: e,
          timestamp: r,
          ...o ? { node: o } : {},
          data: i
        }
      }];
    }
    case "tools":
      return [{
        ...a,
        seq: s,
        method: "tools",
        params: {
          namespace: e,
          timestamp: r,
          data: P_(n)
        }
      }];
    case "checkpoints":
      return Cr(n) ? [{
        ...a,
        seq: s,
        method: "checkpoints",
        params: {
          namespace: e,
          timestamp: r,
          data: n
        }
      }] : [];
    case "values":
      return [{
        ...a,
        seq: s,
        method: "values",
        params: {
          namespace: e,
          timestamp: r,
          data: n
        }
      }];
    case "updates": {
      const i = N_(n);
      return [{
        ...a,
        seq: s,
        method: "updates",
        params: {
          namespace: e,
          timestamp: r,
          ...typeof i.node == "string" ? { node: i.node } : {},
          data: i
        }
      }];
    }
    case "custom": {
      const i = typeof n == "object" && n !== null && !Array.isArray(n) && "name" in n ? n : { payload: n };
      return [{
        ...a,
        seq: s,
        method: "custom",
        params: {
          namespace: e,
          timestamp: r,
          data: i
        }
      }];
    }
    case "tasks":
      return [{
        ...a,
        seq: s,
        method: "tasks",
        params: {
          namespace: e,
          timestamp: r,
          data: n
        }
      }];
    default:
      return [];
  }
}
function P_(e) {
  if (typeof e != "object" || e === null) return {
    event: "tool-error",
    tool_call_id: "",
    message: "Unexpected tools payload shape"
  };
  const t = e, n = String(t.toolCallId ?? "");
  switch (t.event) {
    case "on_tool_start":
      return {
        event: "tool-started",
        tool_call_id: n,
        tool_name: String(t.name ?? "unknown"),
        input: t.input
      };
    case "on_tool_event":
      return {
        event: "tool-output-delta",
        tool_call_id: n,
        delta: typeof t.data == "string" ? t.data : JSON.stringify(t.data ?? "")
      };
    case "on_tool_end":
      return {
        event: "tool-finished",
        tool_call_id: n,
        output: t.output
      };
    case "on_tool_error": {
      const s = t.error;
      return {
        event: "tool-error",
        tool_call_id: n,
        message: typeof s == "object" && s !== null && "message" in s && typeof s.message == "string" ? s.message : String(s ?? "unknown error")
      };
    }
    default:
      return {
        event: "tool-error",
        tool_call_id: "",
        message: `Unknown tool event: ${String(t.event)}`
      };
  }
}
function N_(e) {
  if (typeof e != "object" || e === null) return { values: {} };
  const t = Object.entries(e);
  if (t.length === 0) return { values: {} };
  const [n, s] = t[0];
  return {
    node: n,
    values: typeof s == "object" && s !== null ? s : { value: s }
  };
}
const Lr = /* @__PURE__ */ Symbol.for("langgraph.stream_channel");
var Fe = class Pa {
  /** @internal Brand used by {@link StreamChannel.isInstance}. */
  [Lr] = !0;
  /** Protocol channel name used for auto-forwarded events, if remote. */
  channelName;
  #e = [];
  #t = [];
  #s = !1;
  #n;
  #a;
  constructor(t) {
    this.channelName = t;
  }
  /**
  * Create an in-process-only channel.  Values remain available through
  * `run.extensions.<key>` but are not forwarded to remote clients.
  */
  static local() {
    return new Pa();
  }
  /**
  * Create a channel whose pushes are forwarded to remote clients under
  * the given protocol channel name.
  */
  static remote(t) {
    return new Pa(t);
  }
  /**
  * Brand-based type guard that recognises any {@link StreamChannel}
  * instance, even ones originating from a different copy of this
  * package. Prefer this over `instanceof StreamChannel` when code
  * may observe channels that were constructed elsewhere.
  */
  static isInstance(t) {
    return typeof t == "object" && t !== null && Lr in t && t[Lr] === !0;
  }
  /**
  * Append an item to the channel.  If this is a remote channel wired to a
  * mux, the item is also injected into the main protocol event stream under
  * {@link channelName}.
  */
  push(t) {
    this.#e.push(t), this.#r(), this.#a?.(t);
  }
  /**
  * Returns an async iterator starting at position {@link startAt}. Each call
  * returns an independent cursor so multiple consumers can iterate the same
  * channel concurrently.
  */
  iterate(t = 0) {
    let n = t;
    return { next: async () => {
      for (; ; ) {
        if (n < this.#e.length) return {
          value: this.#e[n++],
          done: !1
        };
        if (this.#s) {
          if (this.#n) throw this.#n;
          return {
            value: void 0,
            done: !0
          };
        }
        await new Promise((s) => this.#t.push(s));
      }
    } };
  }
  /**
  * Creates an {@link AsyncIterable} backed by this channel, starting from
  * {@link startAt}.
  */
  toAsyncIterable(t = 0) {
    return { [Symbol.asyncIterator]: () => this.iterate(t) };
  }
  /**
  * Creates a web {@link ReadableStream} that emits channel items as
  * Server-Sent Events. Useful for returning a channel directly from
  * `new Response(channel.toEventStream())`.
  */
  toEventStream(t = {}) {
    const n = new TextEncoder(), s = this.iterate(t.startAt), r = t.event ?? this.channelName, a = t.serialize ?? ((i) => JSON.stringify(i) ?? "null");
    return new ReadableStream({
      async pull(i) {
        try {
          const o = await s.next();
          if (o.done) {
            i.close();
            return;
          }
          const c = [];
          r != null && c.push(`event: ${r}`);
          for (const l of a(o.value).split(/\r\n|\r|\n/)) c.push(`data: ${l}`);
          i.enqueue(n.encode(`${c.join(`
`)}

`));
        } catch (o) {
          i.error(o);
        }
      },
      async cancel() {
        await s.return?.();
      }
    });
  }
  /**
  * Returns the item at the given zero-based index.
  *
  * @throws {RangeError} If the index is out of bounds.
  */
  get(t) {
    if (t < 0 || t >= this.#e.length) throw new RangeError(`StreamChannel index ${t} out of bounds (size=${this.#e.length})`);
    return this.#e[t];
  }
  /** The number of items currently buffered in the channel. */
  get size() {
    return this.#e.length;
  }
  /** Whether the channel has been closed or failed. */
  get done() {
    return this.#s;
  }
  /** Mark the channel as complete after all buffered items are consumed. */
  close() {
    this.#s = !0, this.#r();
  }
  /** Mark the channel as failed after all buffered items are consumed. */
  fail(t) {
    this.#n = t, this.#s = !0, this.#r();
  }
  /** @internal Called by the mux to wire auto-forwarding. */
  _wire(t) {
    this.#a = t;
  }
  /** @internal Called by the mux on normal completion. */
  _close() {
    this.close();
  }
  /** @internal Called by the mux on failure. */
  _fail(t) {
    this.fail(t);
  }
  [Symbol.asyncIterator]() {
    return this.iterate();
  }
  #r() {
    const t = this.#t.splice(0);
    for (const n of t) n();
  }
};
function R_(e) {
  return Fe.isInstance(e);
}
const $_ = "custom:";
function j_(e) {
  return `${$_}${e}`;
}
function L_(e) {
  return e != null && (typeof e == "object" || typeof e == "function") && typeof e.then == "function";
}
const Na = /* @__PURE__ */ Symbol("resolveValues"), su = /* @__PURE__ */ Symbol("rejectValues");
var D_ = class {
  /** @internal All protocol events in arrival order (after reducer pipeline). */
  _events = Fe.local();
  /** @internal New-namespace discovery notifications. */
  _discoveries = Fe.local();
  /** Monotonic counter for auto-forwarded channel events. */
  #e = 0;
  /** Whether the mux has been closed or failed. */
  #t = !1;
  /** The error passed to {@link fail}, if any. */
  #s;
  /** Whether the run was interrupted. */
  #n = !1;
  /**
  * Namespace of the event currently being processed by
  * {@link push}.  Read by {@link StreamChannel} wiring callbacks so
  * auto-forwarded events inherit the triggering event's namespace.
  */
  #a = [];
  #r = [];
  #c = [];
  #i = /* @__PURE__ */ new Map();
  #o = /* @__PURE__ */ new Map();
  #l = [];
  /**
  * Final-value projection keys tracked for remote surfacing. Populated
  * by {@link wireChannels} when a transformer's projection contains a
  * `PromiseLike` value. Each entry is flushed as a `custom:<name>`
  * protocol event during {@link close} so that remote clients can
  * observe final-value transformers via `thread.extensions.<name>`.
  */
  #u = [];
  /**
  * Associates a pre-existing stream handle with a namespace so that
  * {@link close} can resolve its values promise later.
  *
  * @param path - The namespace path to register.
  * @param stream - The run stream handle for that namespace.
  */
  register(e, t) {
    this.#i.set(he(e), t);
  }
  /**
  * Registers a transformer and replays all buffered events through it so
  * it catches up with events already processed by the mux.  When the event
  * log is empty (typical at construction time) the replay is a no-op.
  *
  * The transformer must already have been initialised (i.e. `init()` called
  * and any projection wired).  The sequence is:
  *
  *   1. Snapshot the current event log length.
  *   2. Append the transformer so future {@link push} calls reach it.
  *   3. Replay events `[0, snapshot)` through `process()`.
  *   4. If the mux is already closed, call `finalize()` (or `fail()`)
  *      immediately so the transformer's log/channel terminates cleanly.
  *
  * @param transformer - An already-initialised transformer to register.
  */
  addTransformer(e) {
    const t = this._events.size;
    this.#r.push(e), e.onRegister && e.onRegister({ push: (n, s) => this.push(n, s) });
    for (let n = 0; n < t; n += 1) e.process(this._events.get(n));
    this.#t && (this.#s !== void 0 ? e.fail?.(this.#s) : e.finalize?.());
  }
  /**
  * Scans a transformer projection for streaming and final-value primitives.
  * Remote stream channels are wired to auto-forward to the protocol event
  * stream; local stream channels are tracked for lifecycle only.
  *
  * Two projection shapes are recognised:
  *
  *   - {@link StreamChannel} values — named channels forward each `push()`
  *     immediately as a `custom:<channelName>` protocol event. Unnamed
  *     channels remain in-process-only.
  *
  *   - `PromiseLike<unknown>` values — tracked as final-value
  *     projections and flushed on {@link close} as a single
  *     `custom:<key>` event, where `<key>` is the projection key.
  *     This mirrors the in-process `await run.extensions.<key>`
  *     ergonomics on remote clients via
  *     `await thread.extensions.<key>`.
  *
  * Plain values that are neither are ignored — they remain in-process-only,
  * matching prior behaviour.
  *
  * @param projection - The object returned by `transformer.init()`.
  */
  wireChannels(e) {
    for (const [t, n] of Object.entries(e)) {
      if (R_(n)) {
        if (this.#c.push(n), typeof n.channelName != "string") continue;
        const s = j_(n.channelName);
        n._wire((r) => {
          this._events.push({
            type: "event",
            seq: this.#e++,
            method: s,
            params: {
              namespace: this.#a,
              timestamp: Date.now(),
              data: r
            }
          });
        });
        continue;
      }
      L_(n) && this.#u.push({
        name: t,
        promise: Promise.resolve(n)
      });
    }
  }
  /**
  * Distributes an event through the transformer pipeline, then appends it to
  * the main event log.
  *
  * Subgraph discovery (materializing a {@link StreamHandle} for each
  * newly observed top-level namespace) is handled by the
  * {@link createSubgraphDiscoveryTransformer} when installed, not here.
  *
  * @param ns - The namespace path that produced the event.
  * @param event - The protocol event to process and store.
  */
  push(e, t) {
    t.method === "values" && this.#o.set(he(e), t.params.data);
    const n = this.#a;
    this.#a = e;
    let s = !0;
    for (const r of this.#r) r.process(t) || (s = !1);
    this.#a = n, s && this._events.push({
      ...t,
      seq: this.#e++
    });
  }
  /**
  * Gracefully ends the stream: resolves values promises on all known
  * streams, finalizes every transformer, auto-closes streaming
  * channels, flushes any final-value projections as `custom:<name>`
  * events, and closes both event logs.
  *
  * When final-value projections are present, `_events.close()` is
  * deferred until every tracked projection promise has settled so
  * remote consumers observe the flushed values before their event
  * stream ends. Callers do not need to await — `close()` returns
  * synchronously and any downstream consumer iterating
  * {@link _events} naturally waits for the final events.
  */
  close() {
    this.#t = !0;
    for (const [n, s] of this.#o.entries()) {
      const r = n ? n.split("\0") : [];
      this.#i.get(he(r))?.[Na](s);
    }
    const e = [];
    for (const n of this.#r) {
      const s = n.finalize?.();
      s != null && typeof s.then == "function" && e.push(s);
    }
    for (const n of this.#c) n._close();
    const t = this.#u;
    t.length === 0 && e.length === 0 ? (this._events.close(), this._discoveries.close()) : Promise.allSettled([...e, ...t.map(async ({ name: n, promise: s }) => {
      try {
        const r = await s;
        this._events.done || this._events.push({
          type: "event",
          seq: this.#e++,
          method: "custom",
          params: {
            namespace: [],
            timestamp: Date.now(),
            data: {
              name: n,
              payload: r
            }
          }
        });
      } catch {
      }
    })]).then(() => {
      this._events.close(), this._discoveries.close();
    });
    for (const n of this.#i.values()) n[Na](void 0);
  }
  /**
  * Propagates a failure to all transformers, channels, event logs, and
  * stream handles.
  *
  * @param err - The error that caused the run to fail.
  */
  fail(e) {
    this.#t = !0, this.#s = e;
    for (const t of this.#r) t.fail?.(e);
    for (const t of this.#c) t._fail(e);
    this._events.fail(e), this._discoveries.fail(e);
    for (const t of this.#i.values()) t[su](e);
  }
  /**
  * Records that the run was interrupted, appending the supplied payloads
  * for later retrieval.
  *
  * @param interrupts - The interrupt payloads to store.
  */
  markInterrupted(e) {
    this.#n = !0, this.#l.push(...e);
  }
  /**
  * Whether the run ended due to an interrupt.
  *
  * @returns `true` if {@link markInterrupted} was called.
  */
  get interrupted() {
    return this.#n;
  }
  /**
  * All interrupt payloads collected during the run.
  *
  * @returns A readonly view of the accumulated interrupt payloads.
  */
  get interrupts() {
    return this.#l;
  }
  /**
  * Returns an async iterator that yields only events whose namespace
  * starts with {@link path}.
  *
  * @param path - Namespace prefix to filter on.
  * @param startAt - Zero-based index into the event log to begin from.
  * @returns An async iterator over matching {@link ProtocolEvent}s.
  */
  subscribeEvents(e, t = 0) {
    const n = this._events.iterate(t);
    return { async next() {
      for (; ; ) {
        const s = await n.next();
        if (s.done || An(s.value.params.namespace, e)) return s;
      }
    } };
  }
};
async function F_(e, t) {
  let n = 0;
  try {
    for await (const s of e) {
      const [r, a, i] = s;
      if (a === "values" && yr(i)) {
        const c = i[ne];
        t.markInterrupted(c.map((l) => ({
          interruptId: l.id ?? "",
          payload: l.value
        })));
      }
      const o = nu({
        namespace: r,
        mode: a,
        payload: i,
        seq: n
      });
      n += o.length;
      for (const c of o) t.push(r, c);
    }
  } catch (s) {
    t.fail(s);
    return;
  }
  t.close();
}
function he(e) {
  return e.join("\0");
}
function An(e, t) {
  if (t.length > e.length) return !1;
  for (let n = 0; n < t.length; n += 1) if (e[n] !== t[n]) return !1;
  return !0;
}
function Vi(e, t, n = 0) {
  return { [Symbol.asyncIterator]() {
    const s = e.iterate(n);
    return { async next() {
      for (; ; ) {
        const r = await s.next();
        if (r.done) return {
          value: void 0,
          done: !0
        };
        if (An(r.value.namespace, t)) return {
          value: r.value,
          done: !1
        };
      }
    } };
  } };
}
const ru = "root";
function V_(e) {
  if (e.length === 0) return ru;
  const t = e[e.length - 1], n = t.indexOf(":");
  return n === -1 ? t : t.slice(0, n);
}
function B_(e) {
  if (e instanceof Error) return e.message;
  if (typeof e == "string") return e;
  try {
    return JSON.stringify(e);
  } catch {
    return String(e);
  }
}
function We(e) {
  return typeof e == "object" && e !== null && !Array.isArray(e);
}
function H_(e) {
  if (!We(e) || e.event !== "started") return;
  const t = e.cause;
  if (We(t) && typeof t.type == "string")
    return t;
}
function U_(e) {
  if (We(e) && "result" in e && typeof e.name == "string" && typeof e.id == "string" && !e.name.startsWith("__"))
    return {
      name: e.name,
      id: e.id
    };
}
function au(e = {}) {
  const t = e.rootGraphName ?? ru, n = e.initialStatus ?? "running", s = e.emitRootOnRegister ?? !0, r = e.getGraphName ?? V_, a = e.serializeError ?? B_, i = e.getTerminalStatusOverride, o = Fe.local(), c = /* @__PURE__ */ new Map(), l = /* @__PURE__ */ new Map(), u = /* @__PURE__ */ new Map(), d = /* @__PURE__ */ new Map(), h = /* @__PURE__ */ new Set(), f = [];
  let p, m = 0, g = !1;
  const y = (S) => {
    if (S.length === 0) return t;
    const E = u.get(he(S));
    return typeof E == "string" && E.length > 0 ? E : r(S);
  }, _ = (S, E) => {
    const R = he(S);
    if (u.has(R)) return;
    const L = (We(E) && We(E.metadata) ? E.metadata : void 0)?.lc_agent_name;
    u.set(R, typeof L == "string" ? L : void 0);
  }, b = (S) => {
    if (!We(S)) return;
    const E = S.id;
    if (typeof E != "string") return;
    const R = S.input;
    let L;
    if (We(R) && We(R.tool_call)) {
      const K = R.tool_call.id;
      typeof K == "string" && (L = K);
    } else if (Array.isArray(R)) {
      for (const K of R) if (We(K) && typeof K.id == "string") {
        L = K.id;
        break;
      }
    }
    L != null && d.set(E, L);
  }, v = (S) => {
    if (S.length === 0) return;
    const E = u.get(he(S));
    if (typeof E != "string" || E.length === 0) return;
    const R = S[S.length - 1], L = R.indexOf(":");
    if (L === -1) return;
    const K = R.slice(L + 1);
    if (K.length === 0) return;
    const jt = d.get(K);
    if (!(typeof jt != "string" || jt.length === 0))
      return {
        type: "toolCall",
        tool_call_id: jt
      };
  }, M = (S) => l.get(he(S)) ?? v(S), I = (S, E, R) => {
    const L = he(S);
    let K = c.get(L);
    const jt = K?.graphName ?? y(S);
    if (K != null && K.status === E && K.graphName === jt && R?.error == null) return;
    K == null ? (K = {
      namespace: S,
      graphName: jt,
      status: E
    }, c.set(L, K)) : K.status = E;
    const Yi = {
      event: E,
      graph_name: jt,
      ...R?.cause != null ? { cause: R.cause } : {},
      ...R?.error != null ? { error: R.error } : {}
    }, Xi = Date.now();
    if (o.push({
      namespace: S,
      timestamp: Xi,
      ...Yi
    }), !(S.length === 0 && !s) && p != null) {
      m += 1;
      try {
        p.push(S, {
          type: "event",
          seq: 0,
          method: "lifecycle",
          params: {
            namespace: S,
            timestamp: Xi,
            data: Yi
          }
        });
      } finally {
        m -= 1;
      }
    }
  }, w = (S) => {
    const E = he(S);
    let R = c.get(E);
    return R == null && (R = {
      namespace: S,
      graphName: y(S),
      status: void 0
    }, c.set(E, R)), R;
  }, C = () => {
    if (f.length === 0) return;
    const S = f.splice(0, f.length);
    for (const E of S) {
      const R = he(E.namespace), L = c.get(R);
      L == null || L.status !== "started" || I(E.namespace, "completed");
    }
  }, O = (S) => {
    const E = he(S.namespace), R = c.get(E);
    R == null || R.status !== "started" || f.some((L) => he(L.namespace) === E) || f.push(S);
  }, A = (S, E) => {
    for (let R = f.length - 1; R >= 0; R -= 1) {
      const L = f[R];
      L.source.type === "node" && L.source.node === E && he(L.source.parent) === he(S) && f.splice(R, 1);
    }
  }, B = (S) => {
    for (let E = 1; E <= S.length; E += 1) {
      const R = S.slice(0, E), L = he(R);
      if (c.has(L)) continue;
      w(R);
      const K = M(R);
      I(R, "started", K != null ? { cause: K } : void 0);
    }
  }, k = () => h.size > 0 ? "interrupted" : "completed", P = (S) => {
    for (const E of c.values())
      E.namespace.length !== 0 && E.status === "started" && I(E.namespace, S);
    I([], S), o.close();
  }, T = async () => {
    if (i == null) return k();
    try {
      return await i() ?? k();
    } catch {
      return k();
    }
  }, N = (S, E) => {
    const R = `${E}:`;
    for (const L of c.values()) {
      if (L.namespace.length !== S.length + 1 || L.status !== "started" || !An(L.namespace, S)) continue;
      const K = L.namespace[L.namespace.length - 1];
      if (K === E || K.startsWith(R)) return L.namespace;
    }
  }, $ = (S, E) => {
    const R = [...S, `${E.name}:${E.id}`];
    return c.get(he(R))?.status === "started" ? R : void 0;
  };
  return {
    __native: !0,
    init() {
      return {
        _lifecycleLog: o,
        lifecycle: Vi(o, [], 0)
      };
    },
    onRegister(S) {
      p = S, w([]), s && I([], n);
    },
    process(S) {
      const E = S.params.namespace;
      if (m > 0) return !0;
      const R = S.method === "tasks" ? U_(S.params.data) : void 0;
      if (R != null ? A(E, R.name) : S.method === "tasks" && (_(E, S.params.data), b(S.params.data)), C(), S.method === "lifecycle") {
        const L = H_(S.params.data);
        return L != null && l.set(he(E), L), B(E), !1;
      }
      if (B(E), S.method === "input" && We(S.params.data) && S.params.data.event === "requested") {
        const L = S.params.data.id;
        typeof L == "string" && h.add(L);
      }
      if (R != null) {
        const L = $(E, R);
        L != null && O({
          namespace: L,
          source: { type: "task" }
        });
      }
      if (S.method === "updates") {
        const L = S.params.node;
        if (typeof L == "string" && !L.startsWith("__")) {
          const K = N(E, L);
          K != null && O({
            namespace: K,
            source: {
              type: "node",
              parent: E,
              node: L
            }
          });
        }
      }
      return !0;
    },
    finalize() {
      if (!g) {
        if (g = !0, C(), i == null) {
          P(k());
          return;
        }
        return T().then(P).catch((S) => {
          o.fail(S);
        });
      }
    },
    fail(S) {
      if (g) return;
      g = !0;
      const E = a(S);
      for (const R of c.values())
        R.namespace.length !== 0 && R.status === "started" && I(R.namespace, "failed");
      I([], "failed", { error: E }), o.fail(S);
    }
  };
}
function nn(e) {
  const t = e;
  return typeof t.run_id == "string" ? `run:${t.run_id}` : e.event === "message-start" && typeof t.id == "string" ? `message:${t.id}` : "__default__";
}
function ss(e, t) {
  const n = Fe.local(), s = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Set();
  return {
    init: () => ({ messages: n.toAsyncIterable() }),
    process(a) {
      if (a.method !== "messages" || !An(a.params.namespace, e) || a.params.namespace.length !== e.length + 1 || t !== void 0 && a.params.node !== t) return !0;
      const i = a.params.data;
      switch (i.event) {
        case "message-start": {
          const o = nn(i);
          if (i.role === "tool") {
            r.add(o);
            break;
          }
          const c = Fe.local(), l = Object.assign(new ai(c.toAsyncIterable()), {
            namespace: a.params.namespace,
            node: a.params.node
          });
          s.set(o, {
            source: c,
            stream: l
          }), c.push(i), n.push(l);
          break;
        }
        case "content-block-start":
        case "content-block-delta":
        case "content-block-finish":
          if (r.has(nn(i))) break;
          s.get(nn(i))?.source.push(i);
          break;
        case "message-finish": {
          const o = nn(i);
          if (r.delete(o)) break;
          const c = s.get(o);
          c && (c.source.push(i), c.source.close(), s.delete(o));
          break;
        }
        case "error":
          if (r.has(nn(i))) break;
          s.get(nn(i))?.source.push(i);
          break;
      }
      return !0;
    },
    finalize() {
      for (const [a, i] of s)
        i.source.push({ event: "message-finish" }), i.source.close(), s.delete(a);
      r.clear(), n.close();
    },
    fail(a) {
      for (const [i, o] of s)
        o.source.fail(a), s.delete(i);
      r.clear(), n.fail(a);
    }
  };
}
function Er(e, t, n = 0) {
  const s = t.length + 1;
  return { [Symbol.asyncIterator]() {
    const r = e.iterate(n);
    return { async next() {
      for (; ; ) {
        const a = await r.next();
        if (a.done) return {
          value: void 0,
          done: !0
        };
        const { ns: i, stream: o } = a.value;
        if (i.length === s && An(i, t)) return {
          value: o,
          done: !1
        };
      }
    } };
  } };
}
function iu(e, t) {
  const { createStream: n } = t, s = /* @__PURE__ */ new Set();
  return {
    __native: !0,
    init() {
      return {
        _discoveries: e._discoveries,
        subgraphs: Er(e._discoveries, [], 0)
      };
    },
    process(r) {
      const a = r.params.namespace;
      if (a.length === 0) return !0;
      const i = a.slice(0, 1), o = he(i);
      if (s.has(o)) return !0;
      s.add(o);
      const c = n(i, e._discoveries.size, e._events.size);
      return e.register(i, c), e._discoveries.push({
        ns: i,
        stream: c
      }), !0;
    }
  };
}
function ou(e) {
  const t = Fe.local();
  return {
    init: () => ({ _valuesLog: t }),
    process(n) {
      return n.method !== "values" || n.params.namespace.length !== e.length || !An(n.params.namespace, e) || t.push(n.params.data), !0;
    },
    finalize() {
      t.close();
    },
    fail(n) {
      t.fail(n);
    }
  };
}
function Ra(e) {
  return "__native" in e && e.__native === !0;
}
const cu = /* @__PURE__ */ Symbol("setValuesLog"), lu = /* @__PURE__ */ Symbol("setMessagesIterable"), $a = /* @__PURE__ */ Symbol("setLifecycleIterable"), ja = /* @__PURE__ */ Symbol("setSubgraphsIterable"), W_ = { [Symbol.asyncIterator]() {
  return { next: () => Promise.resolve({
    value: void 0,
    done: !0
  }) };
} };
var Bi = class {
  /**
  * Namespace path identifying this stream's position in the agent tree.
  * An empty array for the root stream.
  */
  path;
  /**
  * Merged projections from user-supplied {@link StreamTransformer} factories.
  * Each transformer's `init()` return value is spread into this object.
  */
  extensions;
  /**
  * The central stream multiplexer that drives event dispatch and transformer
  * pipelines. Accessible to subclasses for direct event subscription.
  *
  * @internal
  */
  _mux;
  #e;
  #t;
  #s;
  #n;
  #a;
  #r;
  #c;
  #i;
  #o;
  #l;
  /**
  * @param path - Namespace path for this stream (empty array for root).
  * @param mux - The {@link StreamMux} driving this run.
  * @param discoveryStart - Cursor offset into the mux discovery log.
  * @param eventStart - Cursor offset into the mux event log.
  * @param extensions - Pre-initialized transformer projections.
  * @param abortController - Controller for programmatic cancellation.
  */
  constructor(e, t, n = 0, s = 0, r, a) {
    this.path = e, this._mux = t, this.#t = n, this.#e = s, this.extensions = r ?? {}, this.#s = a ?? new AbortController(), this.#r = new Promise((i, o) => {
      this.#n = i, this.#a = o;
    }), this.#r.catch(() => {
    });
  }
  /**
  * Async iterator over all {@link ProtocolEvent}s at or below this
  * stream's namespace, starting from the configured event offset.
  *
  * @returns An async iterator yielding protocol events in arrival order.
  */
  [Symbol.asyncIterator]() {
    return this._mux.subscribeEvents(this.path, this.#e);
  }
  /**
  * Async iterable of child {@link SubgraphRunStream} instances discovered
  * during the run. Each yielded stream represents a direct child namespace.
  *
  * Backed by the shared `_discoveries` log on the mux, populated by
  * {@link createSubgraphDiscoveryTransformer}.  For streams created
  * through {@link createGraphRunStream} the iterable is pre-wired
  * (via {@link SET_SUBGRAPHS_ITERABLE}) so iteration is cheap.
  * Streams constructed directly (e.g. in unit tests) fall back to
  * filtering `_mux._discoveries` on demand, preserving the original
  * behavior without requiring explicit wiring.
  *
  * @returns An async iterable of subgraph run streams.
  */
  get subgraphs() {
    return this.#l ? this.#l : Er(this._mux._discoveries, this.path, this.#t);
  }
  /**
  * Dual-interface accessor for graph state snapshots.
  *
  * As an {@link AsyncIterable}, yields each intermediate state snapshot
  * as it arrives. As a {@link PromiseLike}, resolves with the final
  * state value when the run completes.
  *
  * @returns A combined async iterable and promise-like for state values.
  */
  get values() {
    const e = this.#c, t = this.#r, n = this._mux, s = this.#e, r = this.path, a = e ? e.toAsyncIterable() : { [Symbol.asyncIterator]: () => {
      const i = n.subscribeEvents(r, s);
      return { async next() {
        for (; ; ) {
          const o = await i.next();
          if (o.done) return {
            value: void 0,
            done: !0
          };
          if (o.value.method === "values" && o.value.params.namespace.length === r.length) return {
            value: o.value.params.data,
            done: !1
          };
        }
      } };
    } };
    return {
      [Symbol.asyncIterator]: () => a[Symbol.asyncIterator](),
      then: t.then.bind(t)
    };
  }
  /**
  * All AI message lifecycles observed at this namespace level, in order.
  * Each yielded {@link ChatModelStream} represents one message-start →
  * message-finish lifecycle with streaming `.text`, `.reasoning`, and
  * `.usage` projections.
  *
  * @returns An async iterable of chat model streams.
  */
  get messages() {
    if (this.#i) return this.#i;
    const e = ss(this.path), t = e.init();
    return this._mux.addTransformer(e), this.#i = t.messages, this.#i;
  }
  /**
  * Sequence of {@link LifecycleEntry} records tracking the
  * `lifecycle` channel: when the run starts, when each subgraph
  * enters/exits, and the terminal status of the run as a whole.
  *
  * Backed by the built-in {@link createLifecycleTransformer}; the
  * root stream's iterable is wired during
  * {@link createGraphRunStream} setup, and each
  * {@link SubgraphRunStream} is wired in the subgraph discovery
  * factory with a subtree-scoped view (via
  * {@link filterLifecycleEntries}).  Streams constructed outside
  * `createGraphRunStream` and not wired will yield nothing.
  *
  * @returns An async iterable of lifecycle entries in emission order.
  */
  get lifecycle() {
    return this.#o ?? W_;
  }
  /**
  * Messages produced by a specific graph node. Use when the run has
  * multiple model-calling nodes and you only want messages from one.
  *
  * @param node - The graph node name to filter messages by.
  * @returns An async iterable of chat model streams from the given node.
  */
  messagesFrom(e) {
    const t = ss(this.path, e), n = t.init();
    return this._mux.addTransformer(t), n.messages;
  }
  /**
  * Promise that resolves with the final graph state when the run completes,
  * or rejects if the run fails.
  *
  * @returns A promise resolving to the final state values.
  */
  get output() {
    return this.#r;
  }
  /**
  * Whether the run ended due to a human-in-the-loop interrupt.
  *
  * @returns `true` if the run was interrupted.
  */
  get interrupted() {
    return this._mux.interrupted;
  }
  /**
  * Interrupt payloads collected during the run, if any.
  *
  * @returns A readonly array of interrupt payloads.
  */
  get interrupts() {
    return this._mux.interrupts;
  }
  /**
  * Programmatically abort this run. Equivalent to calling
  * `signal.abort(reason)`.
  *
  * @param reason - Optional abort reason passed to the signal.
  */
  abort(e) {
    this.#s.abort(e);
  }
  /**
  * The {@link AbortSignal} wired into this run for cancellation support.
  *
  * @returns The abort signal for this stream.
  */
  get signal() {
    return this.#s.signal;
  }
  /**
  * Resolve the output/values promise with the final state snapshot.
  * Called by {@link StreamMux.close}.
  *
  * @param values - The final state values, or `undefined` if none.
  * @internal
  */
  [Na](e) {
    this.#n?.(e), this.#n = void 0;
  }
  /**
  * Reject the output/values promise with a run error.
  * Called by {@link StreamMux.fail}.
  *
  * @param err - The error that caused the run to fail.
  * @internal
  */
  [su](e) {
    this.#a?.(e), this.#a = void 0;
  }
  /**
  * Attach the transformer-populated event log backing the `.values` iterable.
  * Called during stream setup in {@link createGraphRunStream}.
  *
  * @param log - The event log from the values transformer projection.
  * @internal
  */
  [cu](e) {
    this.#c = e;
  }
  /**
  * Attach the transformer-populated async iterable backing the `.messages`
  * accessor. Called during stream setup in {@link createGraphRunStream}.
  *
  * @param iterable - The async iterable from the messages transformer projection.
  * @internal
  */
  [lu](e) {
    this.#i = e;
  }
  /**
  * Attach the transformer-populated async iterable backing the
  * `.lifecycle` accessor. Called during stream setup in
  * {@link createGraphRunStream}.
  *
  * @param iterable - The async iterable from the lifecycle transformer projection.
  * @internal
  */
  [$a](e) {
    this.#o = e;
  }
  /**
  * Attach the transformer-populated async iterable backing the
  * `.subgraphs` accessor. Called during root stream setup in
  * {@link createGraphRunStream} and during child stream
  * construction in the discovery transformer factory.
  *
  * @param iterable - The async iterable of direct-child stream handles.
  * @internal
  */
  [ja](e) {
    this.#l = e;
  }
}, uu = class extends Bi {
  /**
  * The node name extracted from the last segment of the namespace path
  * (everything before the final colon, or the full segment if no colon).
  */
  name;
  /**
  * The invocation index parsed from the `"name:N"` suffix of the last
  * namespace segment. Defaults to `0` when no numeric suffix is present.
  */
  index;
  /**
  * @param path - Namespace path for this subgraph stream.
  * @param mux - The {@link StreamMux} driving this run.
  * @param discoveryStart - Cursor offset into the mux discovery log.
  * @param eventStart - Cursor offset into the mux event log.
  * @param extensions - Pre-initialized transformer projections.
  * @param abortController - Controller for programmatic cancellation.
  */
  constructor(e, t, n = 0, s = 0, r, a) {
    super(e, t, n, s, r, a);
    const i = e[e.length - 1] ?? "", o = i.lastIndexOf(":");
    if (o >= 0) {
      this.name = i.slice(0, o);
      const c = i.slice(o + 1);
      this.index = /^\d+$/.test(c) ? Number(c) : 0;
    } else
      this.name = i, this.index = 0;
  }
};
function hu(e, t = [], n) {
  const { abortController: s } = n instanceof AbortController ? { abortController: n } : n ?? {}, r = new D_(), a = au(), i = a.init(), o = i._lifecycleLog, c = iu(r, { createStream: (y, _, b) => {
    const v = new uu(y, r, _, b);
    return v[ja](Er(r._discoveries, y, _)), v[$a](Vi(o, y, o.size)), v;
  } }), l = c.init();
  r.addTransformer(c), r.addTransformer(a);
  const u = ou([]), d = ss([]);
  r.addTransformer(u), r.addTransformer(d);
  const h = {}, f = [];
  for (const y of t) {
    const _ = y();
    r.addTransformer(_);
    const b = _.init();
    Ra(_) ? f.push(b) : Object.assign(h, b), typeof b == "object" && b !== null && !Ra(_) && r.wireChannels(b);
  }
  const p = new Bi([], r, 0, 0, h, s);
  for (const y of f) Object.assign(p, y);
  const m = u.init();
  p[cu](m._valuesLog);
  const g = d.init();
  return p[lu](g.messages), p[$a](i.lifecycle), p[ja](l.subgraphs), r.register([], p), F_(e, r).catch((y) => {
  }), p;
}
const x = (e) => BigInt(e), G = (e, t = 0) => new DataView(e.buffer, e.byteOffset + t, e.byteLength - t), du = x("0x9E3779B1"), fu = x("0x85EBCA77"), z_ = x("0xC2B2AE3D"), Rt = x("0x9E3779B185EBCA87"), Yt = x("0xC2B2AE3D27D4EB4F"), pu = x("0x165667B19E3779F9"), Hi = x("0x85EBCA77C2B2AE63"), G_ = x("0x27D4EB2F165667C5"), J_ = x("0x165667919E3779F9"), K_ = x("0x9FB21C651E98DF25"), q_ = (e) => {
  const t = e.length;
  if (t % 2 !== 0) throw new Error("String should have an even number of characters");
  const n = t / 2, s = new Uint8Array(n);
  let r = 0, a = 0;
  for (; a < n; ) {
    const i = e.slice(r, r += 2);
    s[a] = Number.parseInt(i, 16), a += 1;
  }
  return G(s);
}, ze = q_("b8fe6c3923a44bbe7c01812cf721ad1cded46de9839097db7240a4a4b7b3671fcb79e64eccc0e578825ad07dccff7221b8084674f743248ee03590e6813a264c3c2852bb91c300cb88d0658b1b532ea371644897a20df94e3819ef46a9deacd8a8fa763fe39c343ff9dcbbc7c70b4f1d8a51e04bcdb45931c89f7ec9d9787364eac5ac8334d3ebc3c581a0fffa1363eb170ddd51b7f0da49d316552629d4689e2b16be587d47a1fc8ff8b8d17ad031ce45cb3a8f95160428afd7fbcabb4b407e"), yn = (x(1) << x(128)) - x(1), V = (x(1) << x(64)) - x(1), ir = (x(1) << x(32)) - x(1), ot = 64, mu = ot / 8, Z_ = 8, bs = 4;
function kn(e) {
  if (!e) throw new Error("Assert failed");
}
function Y_(e) {
  const t = /* @__PURE__ */ new DataView(/* @__PURE__ */ new ArrayBuffer(8));
  return t.setBigUint64(0, e, !0), t.getBigUint64(0, !1);
}
function X_(e) {
  let t = e;
  return t = (t & x(65535)) << x(16) | (t & x(4294901760)) >> x(16), t = (t & x(16711935)) << x(8) | (t & x(4278255360)) >> x(8), t;
}
function Q_(e, t) {
  return (e & ir) * (t & ir) & V;
}
function ew(e, t) {
  return (e << t | e >> x(32) - t) & ir;
}
function gu(e, t, n) {
  for (let s = 0; s < mu; s += 1) {
    const r = t.getBigUint64(s * 8, !0), a = r ^ n.getBigUint64(s * 8, !0);
    e[s ^ 1] += r, e[s] += Q_(a, a >> x(32));
  }
  return e;
}
function bo(e, t, n, s) {
  for (let r = 0; r < s; r += 1) gu(e, G(t, r * ot), G(n, r * 8));
  return e;
}
function tw(e, t) {
  for (let n = 0; n < mu; n += 1) {
    const s = t.getBigUint64(n * 8, !0);
    let r = e[n];
    r = La(r, x(47)), r ^= s, r *= du, e[n] = r & V;
  }
  return e;
}
function Ss(e, t) {
  return yu(e[0] ^ t.getBigUint64(0, !0), e[1] ^ t.getBigUint64(Z_, !0));
}
function So(e, t, n) {
  let s = n;
  return s += Ss(e.slice(0), G(t, 0 * bs)), s += Ss(e.slice(2), G(t, 4 * bs)), s += Ss(e.slice(4), G(t, 8 * bs)), s += Ss(e.slice(6), G(t, 12 * bs)), qe(s & V);
}
function nw(e, t, n, s, r) {
  let a = e;
  const i = Math.floor((n.byteLength - ot) / 8), o = ot * i, c = Math.floor((t.byteLength - 1) / o);
  for (let l = 0; l < c; l += 1)
    a = bo(a, G(t, l * o), n, i), a = r(a, G(n, n.byteLength - ot));
  {
    const l = Math.floor((t.byteLength - 1 - o * c) / ot);
    a = bo(a, G(t, c * o), n, l), a = s(a, G(t, t.byteLength - ot), G(n, n.byteLength - ot - 7));
  }
  return a;
}
function sw(e, t) {
  let n = new BigUint64Array([
    z_,
    Rt,
    Yt,
    pu,
    Hi,
    fu,
    G_,
    du
  ]);
  kn(e.byteLength > 128), n = nw(n, e, t, gu, tw), kn(n.length * 8 === 64);
  {
    const s = So(n, G(t, 11), x(e.byteLength) * Rt & V);
    return So(n, G(t, t.byteLength - ot - 11), ~(x(e.byteLength) * Yt) & V) << x(64) | s;
  }
}
function yu(e, t) {
  const n = e * t & yn;
  return n & V ^ n >> x(64);
}
function ko(e, t, n) {
  return yu((e.getBigUint64(0, !0) ^ t.getBigUint64(0, !0) + n) & V, (e.getBigUint64(8, !0) ^ t.getBigUint64(8, !0) - n) & V);
}
function Bs(e, t, n, s, r) {
  let a = e & V, i = e >> x(64) & V;
  return a += ko(t, s, r), a ^= n.getBigUint64(0, !0) + n.getBigUint64(8, !0), a &= V, i += ko(n, G(s, 16), r), i ^= t.getBigUint64(0, !0) + t.getBigUint64(8, !0), i &= V, i << x(64) | a;
}
function qe(e) {
  let t = e;
  return t ^= t >> x(37), t *= J_, t &= V, t ^= t >> x(32), t;
}
function or(e) {
  let t = e;
  return t ^= t >> x(33), t *= Yt, t &= V, t ^= t >> x(29), t *= pu, t &= V, t ^= t >> x(32), t;
}
function rw(e, t, n) {
  const s = e.byteLength;
  kn(s > 0 && s <= 3);
  const r = x(e.getUint8(s - 1)) | x(s << 8) | x(e.getUint8(0) << 16) | x(e.getUint8(s >> 1) << 24), a = (r ^ (x(t.getUint32(0, !0)) ^ x(t.getUint32(4, !0))) + n) & V, i = (x(t.getUint32(8, !0)) ^ x(t.getUint32(12, !0))) - n;
  return (or((ew(X_(r), x(13)) ^ i) & V) & V) << x(64) | or(a);
}
function La(e, t) {
  return e ^ e >> t;
}
function aw(e, t, n) {
  const s = e.byteLength;
  kn(s >= 4 && s <= 8);
  {
    const r = e.getUint32(0, !0), a = e.getUint32(s - 4, !0);
    let i = ((x(r) | x(a) << x(32)) ^ (t.getBigUint64(16, !0) ^ t.getBigUint64(24, !0)) + n & V) * (Rt + (x(s) << x(2))) & yn;
    return i += (i & V) << x(65), i &= yn, i ^= i >> x(67), La(La(i & V, x(35)) * K_ & V, x(28)) | qe(i >> x(64)) << x(64);
  }
}
function iw(e, t, n) {
  const s = e.byteLength;
  kn(s >= 9 && s <= 16);
  {
    const r = (t.getBigUint64(32, !0) ^ t.getBigUint64(40, !0)) + n & V, a = (t.getBigUint64(48, !0) ^ t.getBigUint64(56, !0)) - n & V, i = e.getBigUint64(0, !0);
    let o = e.getBigUint64(s - 8, !0), c = (i ^ o ^ r) * Rt;
    const l = (c & V) + (x(s - 1) << x(54));
    c = c & (yn ^ V) | l, o ^= a, c += o + (o & ir) * (fu - x(1)) << x(64), c &= yn, c ^= Y_(c >> x(64));
    let u = (c & V) * Yt;
    return u += (c >> x(64)) * Yt << x(64), u &= yn, qe(u & V) | qe(u >> x(64)) << x(64);
  }
}
function ow(e, t) {
  const n = e.byteLength;
  return kn(n <= 16), n > 8 ? iw(e, ze, t) : n >= 4 ? aw(e, ze, t) : n > 0 ? rw(e, ze, t) : or(t ^ ze.getBigUint64(64, !0) ^ ze.getBigUint64(72, !0)) | or(t ^ ze.getBigUint64(80, !0) ^ ze.getBigUint64(88, !0)) << x(64);
}
function Da(e) {
  return ~e + x(1) & V;
}
function cw(e, t, n) {
  let s = x(e.byteLength) * Rt & V, r = x(e.byteLength - 1) / x(32);
  for (; r >= 0; ) {
    const o = Number(r);
    s = Bs(s, G(e, 16 * o), G(e, e.byteLength - 16 * (o + 1)), G(t, 32 * o), n), r -= x(1);
  }
  let a = s + (s >> x(64)) & V;
  a = qe(a);
  let i = (s & V) * Rt + (s >> x(64)) * Hi + (x(e.byteLength) - n & V) * Yt;
  return i &= V, i = Da(qe(i)), a | i << x(64);
}
function lw(e, t, n) {
  let s = x(e.byteLength) * Rt & V;
  for (let i = 32; i < 160; i += 32) s = Bs(s, G(e, i - 32), G(e, i - 16), G(t, i - 32), n);
  s = qe(s & V) | qe(s >> x(64)) << x(64);
  for (let i = 160; i <= e.byteLength; i += 32) s = Bs(s, G(e, i - 32), G(e, i - 16), G(t, 3 + i - 160), n);
  s = Bs(s, G(e, e.byteLength - 16), G(e, e.byteLength - 32), G(t, 103), Da(n));
  let r = s + (s >> x(64)) & V;
  r = qe(r);
  let a = (s & V) * Rt + (s >> x(64)) * Hi + (x(e.byteLength) - n & V) * Yt;
  return a &= V, a = Da(qe(a)), r | a << x(64);
}
function vt(e, t = x(0)) {
  const n = new TextEncoder(), s = G(typeof e == "string" ? n.encode(e) : e), r = s.byteLength, a = (i) => i.toString(16).padStart(32, "0");
  return r <= 16 ? a(ow(s, t)) : r <= 128 ? a(cw(s, ze, t)) : r <= 240 ? a(lw(s, ze, t)) : a(sw(s, ze));
}
function _u(e) {
  return /^[0-9a-f]{32}$/.test(e);
}
function wu(e) {
  const t = le.getRunnableConfig();
  if (!t) throw new Error("Called interrupt() outside the context of a graph.");
  const n = t.configurable;
  if (!n) throw new Error("No configurable found in config");
  if (!n.__pregel_checkpointer) throw new Un("No checkpointer set", { lc_error_code: "MISSING_CHECKPOINTER" });
  const s = n[et];
  s.interruptCounter += 1;
  const r = s.interruptCounter;
  if (s.resume.length > 0 && r < s.resume.length)
    return n[De]?.([[tt, s.resume]]), s.resume[r];
  if (s.nullResume !== void 0) {
    if (s.resume.length !== r) throw new Error(`Resume length mismatch: ${s.resume.length} !== ${r}`);
    const i = s.consumeNullResume();
    return s.resume.push(i), n[De]?.([[tt, s.resume]]), i;
  }
  const a = n[Ge]?.split("|");
  throw new Jt([{
    id: a ? vt(a.join("|")) : void 0,
    value: e
  }]);
}
var Ne = class extends ae {
  lc_namespace = ["langgraph"];
  func;
  tags;
  config;
  trace = !0;
  recurse = !0;
  constructor(t) {
    super(), this.name = t.name ?? t.func.name, this.func = t.func, this.config = t.tags ? { tags: t.tags } : void 0, this.trace = t.trace ?? this.trace, this.recurse = t.recurse ?? this.recurse;
  }
  async _tracedInvoke(t, n, s) {
    return new Promise((r, a) => {
      const i = _e(n, { callbacks: s?.getChild() });
      le.runWithConfig(i, async () => {
        try {
          r(await this.func(t, i));
        } catch (o) {
          a(o);
        }
      });
    });
  }
  async invoke(t, n) {
    let s;
    const r = Fi(n), a = oe(this.config, r);
    return this.trace ? s = await this._callWithConfig(this._tracedInvoke, t, a) : s = await le.runWithConfig(a, async () => this.func(t, a)), ae.isRunnable(s) && this.recurse ? await le.runWithConfig(a, async () => s.invoke(t, a)) : s;
  }
};
function* rt(e, t) {
  if (t === void 0) yield* e;
  else for (const n of e) yield [t, n];
}
async function kt(e) {
  const t = [];
  for await (const n of await e) t.push(n);
  return t;
}
function on(e) {
  const t = [];
  for (const n of e) t.push(n);
  return t;
}
function sn(e, t) {
  return e ? "configurable" in e ? {
    ...e,
    configurable: {
      ...e.configurable,
      ...t
    }
  } : {
    ...e,
    configurable: t
  } : { configurable: t };
}
function vu(e) {
  return e != null && typeof e == "function" && e instanceof Object.getPrototypeOf(async function* () {
  }).constructor;
}
function bu(e) {
  return e != null && typeof e == "function" && e instanceof Object.getPrototypeOf(function* () {
  }).constructor;
}
function uw(e) {
  return typeof e == "object" && e?.[/* @__PURE__ */ Symbol.for("LG_SKIP_WRITE")] !== void 0;
}
const ht = { [/* @__PURE__ */ Symbol.for("LG_PASSTHROUGH")]: !0 };
function ks(e) {
  return typeof e == "object" && e?.[/* @__PURE__ */ Symbol.for("LG_PASSTHROUGH")] !== void 0;
}
const Dr = /* @__PURE__ */ Symbol("IS_WRITER");
var ge = class Fa extends Ne {
  writes;
  constructor(t, n) {
    const s = `ChannelWrite<${t.map((r) => Me(r) ? r.node : "channel" in r ? r.channel : "...").join(",")}>`;
    super({
      writes: t,
      name: s,
      tags: n,
      trace: !1,
      func: async (r, a) => this._write(r, a ?? {})
    }), this.writes = t;
  }
  async _write(t, n) {
    const s = this.writes.map((r) => Fr(r) && ks(r.value) ? {
      mapper: r.mapper,
      value: t
    } : Hs(r) && ks(r.value) ? {
      channel: r.channel,
      value: t,
      skipNone: r.skipNone,
      mapper: r.mapper
    } : r);
    return await Fa.doWrite(n, s), t;
  }
  static async doWrite(t, n) {
    for (const a of n) {
      if (Hs(a)) {
        if (a.channel === "__pregel_tasks") throw new z("Cannot write to the reserved channel TASKS");
        if (ks(a.value)) throw new z("PASSTHROUGH value must be replaced");
      }
      if (Fr(a) && ks(a.value))
        throw new z("PASSTHROUGH value must be replaced");
    }
    const s = [];
    for (const a of n) if (Me(a)) s.push([wn, a]);
    else if (Fr(a)) {
      const i = await a.mapper.invoke(a.value, t);
      i != null && i.length > 0 && s.push(...i);
    } else if (Hs(a)) {
      const i = a.mapper !== void 0 ? await a.mapper.invoke(a.value, t) : a.value;
      if (uw(i) || a.skipNone && i === void 0) continue;
      s.push([a.channel, i]);
    } else throw new Error(`Invalid write entry: ${JSON.stringify(a)}`);
    const r = t.configurable?.[De];
    r(s);
  }
  static isWriter(t) {
    return t instanceof Fa || Dr in t && !!t[Dr];
  }
  static registerWriter(t) {
    return Object.defineProperty(t, Dr, { value: !0 });
  }
};
function Hs(e) {
  return e !== void 0 && typeof e.channel == "string";
}
function Fr(e) {
  return e !== void 0 && !Hs(e) && ae.isRunnable(e.mapper);
}
var hw = class Su extends Ne {
  lc_graph_name = "ChannelRead";
  channel;
  fresh = !1;
  mapper;
  constructor(t, n, s = !1) {
    super({
      trace: !1,
      func: (r, a) => Su.doRead(a, this.channel, this.fresh, this.mapper)
    }), this.fresh = s, this.mapper = n, this.channel = t, this.name = Array.isArray(t) ? `ChannelRead<${t.join(",")}>` : `ChannelRead<${t}>`;
  }
  static doRead(t, n, s, r) {
    const a = t.configurable?.[Qe];
    if (!a) throw new Error("Runnable is not configured with a read function. Make sure to call in the context of a Pregel process");
    return r ? r(a(n, s)) : a(n, s);
  }
};
const rn = /* @__PURE__ */ new ti();
var Cn = class jn extends Ae {
  lc_graph_name = "PregelNode";
  channels;
  triggers = [];
  mapper;
  writers = [];
  bound = rn;
  kwargs = {};
  metadata = {};
  tags = [];
  retryPolicy;
  cachePolicy;
  timeout;
  subgraphs;
  ends;
  isErrorHandler;
  errorHandlerNode;
  constructor(t) {
    const { channels: n, triggers: s, mapper: r, writers: a, bound: i, kwargs: o, metadata: c, retryPolicy: l, cachePolicy: u, timeout: d, tags: h, subgraphs: f, ends: p, isErrorHandler: m, errorHandlerNode: g } = t, y = [...t.config?.tags ? t.config.tags : [], ...h ?? []];
    super({
      ...t,
      bound: t.bound ?? rn,
      config: {
        ...t.config ? t.config : {},
        tags: y
      }
    }), this.channels = n, this.triggers = s, this.mapper = r, this.writers = a ?? this.writers, this.bound = i ?? this.bound, this.kwargs = o ?? this.kwargs, this.metadata = c ?? this.metadata, this.tags = y, this.retryPolicy = l, this.cachePolicy = u, this.timeout = d, this.subgraphs = f, this.ends = p, this.isErrorHandler = m, this.errorHandlerNode = g;
  }
  getWriters() {
    const t = [...this.writers];
    for (; t.length > 1 && t[t.length - 1] instanceof ge && t[t.length - 2] instanceof ge; ) {
      const n = t.slice(-2), s = n[0].writes.concat(n[1].writes);
      t[t.length - 2] = new ge(s, n[0].config?.tags), t.pop();
    }
    return t;
  }
  getNode() {
    const t = this.getWriters();
    if (!(this.bound === rn && t.length === 0))
      return this.bound === rn && t.length === 1 ? t[0] : this.bound === rn ? new pt({
        first: t[0],
        middle: t.slice(1, t.length - 1),
        last: t[t.length - 1],
        omitSequenceTags: !0
      }) : t.length > 0 ? new pt({
        first: this.bound,
        middle: t.slice(0, t.length - 1),
        last: t[t.length - 1],
        omitSequenceTags: !0
      }) : this.bound;
  }
  join(t) {
    if (!Array.isArray(t)) throw new Error("channels must be a list");
    if (typeof this.channels != "object") throw new Error("all channels must be named when using .join()");
    return new jn({
      channels: {
        ...this.channels,
        ...Object.fromEntries(t.map((n) => [n, n]))
      },
      triggers: this.triggers,
      mapper: this.mapper,
      writers: this.writers,
      bound: this.bound,
      kwargs: this.kwargs,
      config: this.config,
      retryPolicy: this.retryPolicy,
      cachePolicy: this.cachePolicy,
      timeout: this.timeout
    });
  }
  pipe(t) {
    return ge.isWriter(t) ? new jn({
      channels: this.channels,
      triggers: this.triggers,
      mapper: this.mapper,
      writers: [...this.writers, t],
      bound: this.bound,
      config: this.config,
      kwargs: this.kwargs,
      retryPolicy: this.retryPolicy,
      cachePolicy: this.cachePolicy,
      timeout: this.timeout
    }) : this.bound === rn ? new jn({
      channels: this.channels,
      triggers: this.triggers,
      mapper: this.mapper,
      writers: this.writers,
      bound: Ze(t),
      config: this.config,
      kwargs: this.kwargs,
      retryPolicy: this.retryPolicy,
      cachePolicy: this.cachePolicy,
      timeout: this.timeout
    }) : new jn({
      channels: this.channels,
      triggers: this.triggers,
      mapper: this.mapper,
      writers: this.writers,
      bound: this.bound.pipe(t),
      config: this.config,
      kwargs: this.kwargs,
      retryPolicy: this.retryPolicy,
      cachePolicy: this.cachePolicy,
      timeout: this.timeout
    });
  }
};
function dw(e) {
  return "steps" in e && Array.isArray(e.steps);
}
function Ui(e) {
  return "lg_is_pregel" in e && e.lg_is_pregel === !0;
}
function ku(e) {
  const t = [e];
  for (const n of t) {
    if (Ui(n)) return n;
    dw(n) && t.push(...n.steps);
  }
}
function _n(e, t, n = !0, s = !1) {
  try {
    return e[t].get();
  } catch (r) {
    if (r.name === re.unminifiable_name) {
      if (s) return r;
      if (n) return null;
    }
    throw r;
  }
}
function Xt(e, t, n = !0) {
  if (Array.isArray(t)) {
    const s = {};
    for (const r of t) try {
      s[r] = _n(e, r, !n);
    } catch (a) {
      if (a.name === re.unminifiable_name) continue;
    }
    return s;
  } else return _n(e, t);
}
function* fw(e, t) {
  if (e.graph === ee.PARENT) throw new z("There is no parent graph.");
  if (e.goto) {
    let n;
    Array.isArray(e.goto) ? n = e.goto : n = [e.goto];
    for (const s of n) if (Me(s)) yield [
      Ie,
      wn,
      s
    ];
    else if (typeof s == "string") yield [
      Ie,
      `branch:to:${s}`,
      "__start__"
    ];
    else throw new Error(`In Command.send, expected Send or string, got ${typeof s}`);
  }
  if (e.resume) if (typeof e.resume == "object" && Object.keys(e.resume).length && Object.keys(e.resume).every(_u)) for (const [n, s] of Object.entries(e.resume)) {
    const r = t.filter((a) => a[0] === n && a[1] === "__resume__").map((a) => a[2]).slice(0, 1) ?? [];
    r.push(s), yield [
      n,
      tt,
      r
    ];
  }
  else yield [
    Ie,
    tt,
    e.resume
  ];
  if (e.update) {
    if (typeof e.update != "object" || !e.update) throw new Error("Expected cmd.update to be a dict mapping channel names to update values");
    if (Array.isArray(e.update)) for (const [n, s] of e.update) yield [
      Ie,
      n,
      s
    ];
    else for (const [n, s] of Object.entries(e.update)) yield [
      Ie,
      n,
      s
    ];
  }
}
function* Cu(e, t) {
  if (t != null) if (Array.isArray(e) && typeof t == "object" && !Array.isArray(t))
    for (const n in t) e.includes(n) && (yield [n, t[n]]);
  else {
    if (Array.isArray(e)) throw new Error('Input chunk must be an object when "inputChannels" is an array');
    yield [e, t];
  }
}
function* Vr(e, t, n) {
  Array.isArray(e) ? (t === !0 || t.find(([s, r]) => e.includes(s))) && (yield Xt(n, e)) : (t === !0 || t.some(([s, r]) => s === e)) && (yield _n(n, e));
}
function* pw(e, t, n) {
  const s = t.filter(([o, c]) => (o.config === void 0 || !o.config.tags?.includes("langsmith:hidden")) && c[0][0] !== "__error__" && c[0][0] !== "__interrupt__");
  if (!s.length) return;
  let r;
  s.some(([o]) => o.writes.some(([c, l]) => c === "__return__")) ? r = s.flatMap(([o]) => o.writes.filter(([c, l]) => c === gr).map(([c, l]) => [o.name, l])) : Array.isArray(e) ? r = s.flatMap(([o]) => {
    const { writes: c } = o, l = {};
    for (const [u] of c) e.includes(u) && (l[u] = (l[u] || 0) + 1);
    return Object.values(l).some((u) => u > 1) ? c.filter(([u]) => e.includes(u)).map(([u, d]) => [o.name, { [u]: d }]) : [[o.name, Object.fromEntries(c.filter(([u]) => e.includes(u)))]];
  }) : r = s.flatMap(([o]) => o.writes.filter(([c, l]) => c === e).map(([c, l]) => [o.name, l]));
  const a = {};
  for (const [o, c] of r)
    o in a || (a[o] = []), a[o].push(c);
  const i = {};
  for (const o in a) if (a[o].length === 1) {
    const [c] = a[o];
    i[o] = c;
  } else i[o] = a[o];
  n && (i.__metadata__ = { cached: n }), yield i;
}
function Wi(e) {
  const t = typeof e[te];
  if (t === "number") return 0;
  if (t === "string") return "";
  for (const n in e) {
    if (!Object.prototype.hasOwnProperty.call(e, n)) continue;
    const s = typeof e[n];
    if (s === "number") return 0;
    if (s === "string") return "";
    break;
  }
}
function Us(e, t) {
  if (Object.keys(e).length > 0) {
    const n = Wi(t);
    return Object.fromEntries(Object.entries(t).filter(([s, r]) => r > (e[s] ?? n)));
  } else return t;
}
function mw(e, t) {
  return e && !Array.isArray(e) && !(e instanceof Date) && typeof e == "object" ? e : { [t]: e };
}
function ye(e, t) {
  return e === null ? { configurable: t } : e?.configurable === void 0 ? {
    ...e,
    configurable: t
  } : {
    ...e,
    configurable: {
      ...e.configurable,
      ...t
    }
  };
}
function Lt(e, t) {
  const n = t?.parents ?? {};
  return Object.keys(n).length > 0 ? ye(e, { [Te]: {
    ...n,
    [e.configurable?.checkpoint_ns ?? ""]: e.configurable?.checkpoint_id
  } }) : e;
}
function rs(...e) {
  const t = [...new Set(e.filter(Boolean))];
  if (t.length === 0) return {
    signal: void 0,
    dispose: void 0
  };
  if (t.length === 1) return {
    signal: t[0],
    dispose: void 0
  };
  const n = new AbortController(), s = () => {
    const a = t.find((i) => i.aborted)?.reason;
    n.abort(a), t.forEach((i) => i.removeEventListener("abort", s));
  };
  t.forEach((a) => a.addEventListener("abort", s, { once: !0 }));
  const r = t.find((a) => a.aborted);
  return r && n.abort(r.reason), {
    signal: n.signal,
    dispose: () => {
      t.forEach((a) => a.removeEventListener("abort", s));
    }
  };
}
var gw = class {
  func;
  name;
  input;
  retry;
  cache;
  timeout;
  callbacks;
  __lg_type = "call";
  constructor({ func: e, name: t, input: n, retry: s, cache: r, timeout: a, callbacks: i }) {
    this.func = e, this.name = t, this.input = n, this.retry = s, this.cache = r, this.timeout = a, this.callbacks = i;
  }
};
function yw(e) {
  return typeof e == "object" && e !== null && "__lg_type" in e && e.__lg_type === "call";
}
function _w(e, t) {
  return new pt({
    name: e,
    first: new Ne({
      func: (n) => t(...n),
      name: e,
      trace: !1,
      recurse: !1
    }),
    last: new ge([{
      channel: gr,
      value: ht
    }], [we])
  });
}
function ww(e, t) {
  return new Ne({
    func: (n, s) => t(n, s),
    name: e,
    trace: !1,
    recurse: !1
  });
}
function vw({ func: e, name: t, cache: n, retry: s, timeout: r }, ...a) {
  const i = le.getRunnableConfig();
  if (typeof i.configurable?.__pregel_call == "function") return i.configurable[qt](e, t, a, {
    retry: s,
    cache: n,
    timeout: r,
    callbacks: i.callbacks
  });
  throw new Error("Async local storage not initialized. Please call initializeAsyncLocalStorageSingleton() before using this function.");
}
const bw = (e) => e !== void 0 ? e + 1 : 1;
function Sw(e, t) {
  if (t == null) return !1;
  for (const n of e) if (t[n]) return !0;
  return !1;
}
function kw(e) {
  let t;
  for (const n in e)
    Object.prototype.hasOwnProperty.call(e, n) && (t == null ? t = e[n] : t = Gl(t, e[n]));
  return t;
}
function Cs(e, t, n) {
  const s = Wi(e.channel_versions), r = e.versions_seen.__interrupt__ ?? {};
  let a = !1;
  if ((e.channel_versions.__start__ ?? s) > (r.__start__ ?? s)) a = !0;
  else for (const o in e.channel_versions)
    if (Object.prototype.hasOwnProperty.call(e.channel_versions, o) && e.channel_versions[o] > (r[o] ?? s)) {
      a = !0;
      break;
    }
  const i = n.some((o) => t === "*" ? !o.config?.tags?.includes(we) : t.includes(o.name));
  return a && i;
}
function Wn(e, t, n, s, r = !1) {
  let a = /* @__PURE__ */ new Set();
  if (Array.isArray(s))
    a = new Set(s.filter((o) => n.writes.some(([c, l]) => c === o)));
  else {
    for (const [o] of n.writes) if (o === s) {
      a = /* @__PURE__ */ new Set([o]);
      break;
    }
    a = a || /* @__PURE__ */ new Set();
  }
  let i;
  if (r && a.size > 0) {
    const o = Object.fromEntries(Object.entries(t).filter(([d, h]) => a.has(d))), c = /* @__PURE__ */ new Set();
    for (const d in o) {
      if (!Object.prototype.hasOwnProperty.call(o, d)) continue;
      const h = o[d];
      lt(h) && h.isAvailable() && c.add(d);
    }
    const l = Vt(e, o, -1, { channelsToSnapshot: c }), u = Zl(o, l);
    Ee(bn(l), u, [n], void 0, void 0), i = Xt({
      ...t,
      ...u
    }, s);
  } else i = Xt(t, s);
  return i;
}
function Ws(e, t, n) {
  for (const [s, r] of n) if (["__pregel_push", "__pregel_tasks"].includes(s) && r != null) {
    if (!Me(r)) throw new z(`Invalid packet type, expected SendProtocol, got ${JSON.stringify(r)}`);
    if (!(r.node in t)) throw new z(`Invalid node name "${r.node}" in Send packet`);
  }
  e(n);
}
const Cw = /* @__PURE__ */ new Set([
  gi,
  Oe,
  tt,
  ne,
  gr,
  hs,
  pi
]), Ew = new Set(mm);
function Ee(e, t, n, s, r) {
  const a = /* @__PURE__ */ new Map();
  for (const p of n) a.set(p, p.path?.slice(0, 3) || []);
  n.sort((p, m) => {
    const g = a.get(p), y = a.get(m);
    for (let _ = 0; _ < Math.min(g.length, y.length); _ += 1) {
      if (g[_] < y[_]) return -1;
      if (g[_] > y[_]) return 1;
    }
    return g.length - y.length;
  });
  const i = kr(t);
  let o = !1;
  const c = /* @__PURE__ */ new Set();
  for (const p of n) {
    p.triggers.length > 0 && (o = !0), e.versions_seen[p.name] ??= {};
    for (const m of p.triggers)
      m in e.channel_versions && (e.versions_seen[p.name][m] = e.channel_versions[m]), Ew.has(m) || c.add(m);
  }
  let l = kw(e.channel_versions), u = !1;
  for (const p of c) p in i && i[p].consume() && s !== void 0 && (e.channel_versions[p] = s(l), u = !0);
  const d = {}, h = {};
  for (const p of n) {
    const m = p.id ?? "";
    for (const [g, y] of p.writes) Cw.has(g) || g in i && (d[g] ??= [], d[g].push(y), h[g] ??= [], h[g].push(m));
  }
  for (const [p, m] of Object.entries(d)) {
    if (m.length < 2 || i[p]?.lc_graph_name !== "DeltaChannel") continue;
    const g = h[p], y = m.map((_, b) => ({
      val: _,
      taskId: g[b]
    }));
    y.sort((_, b) => _.taskId < b.taskId ? -1 : _.taskId > b.taskId ? 1 : 0), d[p] = y.map((_) => _.val);
  }
  l != null && s != null && (l = u ? s(l) : l);
  const f = /* @__PURE__ */ new Set();
  for (const [p, m] of Object.entries(d)) if (p in i) {
    const g = i[p];
    let y;
    try {
      y = g.update(m);
    } catch (_) {
      if (_.name === z.unminifiable_name) {
        const b = new z(`Invalid update for channel "${p}" with values ${JSON.stringify(m)}: ${_.message}`);
        throw b.lc_error_code = _.lc_error_code, b;
      } else throw _;
    }
    y && s !== void 0 && (e.channel_versions[p] = s(l), g.isAvailable() && f.add(p));
  }
  if (o) for (const p in i) {
    if (!Object.prototype.hasOwnProperty.call(i, p)) continue;
    const m = i[p];
    m.isAvailable() && !f.has(p) && m.update([]) && s !== void 0 && (e.channel_versions[p] = s(l), m.isAvailable() && f.add(p));
  }
  if (o && !Sw(f, r)) for (const p in i) {
    if (!Object.prototype.hasOwnProperty.call(i, p)) continue;
    const m = i[p];
    m.finish() && s !== void 0 && (e.channel_versions[p] = s(l), m.isAvailable() && f.add(p));
  }
  return f;
}
function* Tw(e, t, n) {
  if (n.updatedChannels != null && n.triggerToNodes != null) {
    const s = /* @__PURE__ */ new Set();
    for (const r of n.updatedChannels) {
      const a = n.triggerToNodes[r];
      for (const i of a ?? []) s.add(i);
    }
    yield* [...s].sort();
    return;
  }
  if (!(() => {
    for (const s in e.channel_versions) if (e.channel_versions[s] !== null) return !1;
    return !0;
  })())
    for (const s in t)
      Object.prototype.hasOwnProperty.call(t, s) && (yield s);
}
function xw(e) {
  let t;
  const n = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Set();
  if (e) for (const [r, a, i] of e) {
    if (r === "00000000-0000-0000-0000-000000000000" && a === "__resume__" && t === void 0 && (t = i), a === "__resume__" && r !== "00000000-0000-0000-0000-000000000000") {
      let o = n.get(r);
      o || (o = [], n.set(r, o)), o.push(i);
    }
    a !== "__error__" && s.add(r);
  }
  return {
    nullResume: t,
    resumeByTaskId: n,
    successfulWriteTaskIds: s
  };
}
function fn(e, t, n, s, r, a, i) {
  const o = {}, c = i.pendingWritesIndex ? i : {
    ...i,
    pendingWritesIndex: xw(t)
  }, l = s[wn];
  if (l?.isAvailable()) {
    const u = l.get().length;
    for (let d = 0; d < u; d += 1) {
      const h = Va([Oe, d], e, t, n, s, r, a, c);
      h !== void 0 && (o[h.id] = h);
    }
  }
  for (const u of Tw(e, n, c)) {
    const d = Va([ha, u], e, t, n, s, r, a, c);
    d !== void 0 && (o[d.id] = d);
  }
  return o;
}
function Va(e, t, n, s, r, a, i, o) {
  const { step: c, checkpointer: l, manager: u } = o, d = a.configurable ?? {}, h = d.checkpoint_ns ?? "";
  if (e[0] === "__pregel_push" && yw(e[e.length - 1])) {
    const f = e[e.length - 1], p = _w(f.name, f.func), m = [Oe], g = h === "" ? f.name : `${h}|${f.name}`, y = Ut(JSON.stringify([
      g,
      c.toString(),
      f.name,
      Oe,
      e[1],
      e[2]
    ]), t.id), _ = `${g}:${y}`, b = [...e.slice(0, 3), !0], v = {
      langgraph_step: c,
      langgraph_node: f.name,
      langgraph_triggers: m,
      langgraph_path: b,
      langgraph_checkpoint_ns: _,
      checkpoint_ns: _
    };
    if (i) {
      const M = [], I = {
        checkpointId: t.id,
        checkpointNs: _,
        taskId: y,
        threadId: d.thread_id,
        runId: a.runId != null ? String(a.runId) : void 0,
        nodeAttempt: 1
      };
      return {
        name: f.name,
        input: f.input,
        proc: p,
        writes: M,
        config: {
          ..._e(oe(a, {
            metadata: v,
            store: o.store ?? a.store
          }), {
            runName: f.name,
            callbacks: u?.getChild(`graph:step:${c}`),
            configurable: {
              [Bn]: y,
              [De]: (w) => Ws((C) => M.push(...C), s, w),
              [Qe]: (w, C = !1) => Wn(t, r, {
                name: f.name,
                writes: M,
                triggers: m,
                path: b
              }, w, C),
              [Ke]: l ?? d.__pregel_checkpointer,
              [Te]: {
                ...d[Te],
                [h]: t.id
              },
              [et]: zs({
                pendingWrites: n ?? [],
                taskId: y,
                currentTaskInput: f.input,
                resumeMap: a.configurable?.[Hn],
                namespaceHash: vt(_),
                pendingWritesIndex: o.pendingWritesIndex
              }),
              [mn]: t.channel_values[gn],
              checkpoint_id: void 0,
              checkpoint_ns: _
            }
          }),
          executionInfo: I
        },
        triggers: m,
        retry_policy: f.retry,
        cache_key: f.cache ? {
          key: vt((f.cache.keyFunc ?? JSON.stringify)([f.input])),
          ns: [Ir, f.name ?? "__dynamic__"],
          ttl: f.cache.ttl
        } : void 0,
        id: y,
        path: b,
        writers: [],
        timeout: f.timeout
      };
    } else return {
      id: y,
      name: f.name,
      interrupts: [],
      path: b
    };
  } else if (e[0] === "__pregel_push") {
    const f = typeof e[1] == "number" ? e[1] : parseInt(e[1], 10);
    if (!r.__pregel_tasks?.isAvailable()) return;
    const p = r[wn].get();
    if (f < 0 || f >= p.length) return;
    const m = fa(p[f]) && !Me(p[f]) ? new de(p[f].node, p[f].args, p[f].timeout !== void 0 ? { timeout: p[f].timeout } : void 0) : p[f];
    if (!fa(m)) {
      console.warn(`Ignoring invalid packet ${JSON.stringify(m)} in pending sends.`);
      return;
    }
    if (!(m.node in s)) {
      console.warn(`Ignoring unknown node name ${m.node} in pending sends.`);
      return;
    }
    const g = [Oe], y = h === "" ? m.node : `${h}|${m.node}`, _ = Ut(JSON.stringify([
      y,
      c.toString(),
      m.node,
      Oe,
      f.toString()
    ]), t.id), b = `${y}:${_}`;
    let v = {
      langgraph_step: c,
      langgraph_node: m.node,
      langgraph_triggers: g,
      langgraph_path: e.slice(0, 3),
      langgraph_checkpoint_ns: b,
      checkpoint_ns: b
    };
    if (i) {
      const M = s[m.node], I = M.getNode();
      if (I !== void 0) {
        M.metadata !== void 0 && (v = {
          ...v,
          ...M.metadata
        });
        const w = [], C = {
          checkpointId: t.id,
          checkpointNs: b,
          taskId: _,
          threadId: d.thread_id,
          runId: a.runId != null ? String(a.runId) : void 0,
          nodeAttempt: 1
        };
        return {
          name: m.node,
          input: m.args,
          proc: I,
          subgraphs: M.subgraphs,
          writes: w,
          config: {
            ..._e(oe(a, {
              metadata: v,
              tags: M.tags,
              store: o.store ?? a.store
            }), {
              runName: m.node,
              callbacks: u?.getChild(`graph:step:${c}`),
              configurable: {
                [Bn]: _,
                [De]: (O) => Ws((A) => w.push(...A), s, O),
                [Qe]: (O, A = !1) => Wn(t, r, {
                  name: m.node,
                  writes: w,
                  triggers: g,
                  path: e
                }, O, A),
                [Ke]: l ?? d.__pregel_checkpointer,
                [Te]: {
                  ...d[Te],
                  [h]: t.id
                },
                [et]: zs({
                  pendingWrites: n ?? [],
                  taskId: _,
                  currentTaskInput: m.args,
                  resumeMap: a.configurable?.[Hn],
                  namespaceHash: vt(b),
                  pendingWritesIndex: o.pendingWritesIndex
                }),
                [mn]: t.channel_values[gn],
                checkpoint_id: void 0,
                checkpoint_ns: b
              }
            }),
            executionInfo: C
          },
          triggers: g,
          retry_policy: M.retryPolicy,
          cache_key: M.cachePolicy ? {
            key: vt((M.cachePolicy.keyFunc ?? JSON.stringify)([m.args])),
            ns: [
              Ir,
              M.name ?? "__dynamic__",
              m.node
            ],
            ttl: M.cachePolicy.ttl
          } : void 0,
          id: _,
          path: e,
          writers: M.getWriters(),
          timeout: m.timeout ?? M.timeout
        };
      }
    } else return {
      id: _,
      name: m.node,
      interrupts: [],
      path: e
    };
  } else if (e[0] === "__pregel_pull") {
    const f = e[1].toString(), p = s[f];
    if (p === void 0) return;
    if (n?.length) {
      const _ = h === "" ? f : `${h}|${f}`, b = Ut(JSON.stringify([
        _,
        c.toString(),
        f,
        ha,
        f
      ]), t.id);
      if (o.pendingWritesIndex ? o.pendingWritesIndex.successfulWriteTaskIds.has(b) : n.some((v) => v[0] === b && v[1] !== "__error__")) return;
    }
    const m = Wi(t.channel_versions);
    if (m === void 0) return;
    const g = t.versions_seen[f] ?? {}, y = p.triggers.find((_) => r[_].isAvailable() ? (t.channel_versions[_] ?? m) > (g[_] ?? m) : !1);
    if (y !== void 0) {
      const _ = Iw(p, r, i);
      if (_ === void 0) return;
      const b = h === "" ? f : `${h}|${f}`, v = Ut(JSON.stringify([
        b,
        c.toString(),
        f,
        ha,
        [y]
      ]), t.id), M = `${b}:${v}`;
      let I = {
        langgraph_step: c,
        langgraph_node: f,
        langgraph_triggers: [y],
        langgraph_path: e,
        langgraph_checkpoint_ns: M,
        checkpoint_ns: M
      };
      if (i) {
        const w = p.getNode();
        if (w !== void 0) {
          p.metadata !== void 0 && (I = {
            ...I,
            ...p.metadata
          });
          const C = [], O = {
            checkpointId: t.id,
            checkpointNs: M,
            taskId: v,
            threadId: d.thread_id,
            runId: a.runId != null ? String(a.runId) : void 0,
            nodeAttempt: 1
          };
          return {
            name: f,
            input: _,
            proc: w,
            subgraphs: p.subgraphs,
            writes: C,
            config: {
              ..._e(oe(a, {
                metadata: I,
                tags: p.tags,
                store: o.store ?? a.store
              }), {
                runName: f,
                callbacks: u?.getChild(`graph:step:${c}`),
                configurable: {
                  [Bn]: v,
                  [De]: (A) => Ws((B) => {
                    C.push(...B);
                  }, s, A),
                  [Qe]: (A, B = !1) => Wn(t, r, {
                    name: f,
                    writes: C,
                    triggers: [y],
                    path: e
                  }, A, B),
                  [Ke]: l ?? d.__pregel_checkpointer,
                  [Te]: {
                    ...d[Te],
                    [h]: t.id
                  },
                  [et]: zs({
                    pendingWrites: n ?? [],
                    taskId: v,
                    currentTaskInput: _,
                    resumeMap: a.configurable?.[Hn],
                    namespaceHash: vt(M),
                    pendingWritesIndex: o.pendingWritesIndex
                  }),
                  [mn]: t.channel_values[gn],
                  checkpoint_id: void 0,
                  checkpoint_ns: M
                }
              }),
              executionInfo: O
            },
            triggers: [y],
            retry_policy: p.retryPolicy,
            cache_key: p.cachePolicy ? {
              key: vt((p.cachePolicy.keyFunc ?? JSON.stringify)([_])),
              ns: [
                Ir,
                p.name ?? "__dynamic__",
                f
              ],
              ttl: p.cachePolicy.ttl
            } : void 0,
            id: v,
            path: e,
            writers: p.getWriters(),
            timeout: p.timeout
          };
        }
      } else return {
        id: v,
        name: f,
        interrupts: [],
        path: e
      };
    }
  }
}
function Mw(e, t, n, s, r, a, i, o, c) {
  const { step: l, checkpointer: u, manager: d } = c, h = a[t];
  if (h === void 0) return;
  const f = h.getNode();
  if (f === void 0) return;
  const p = o.configurable ?? {}, m = p.checkpoint_ns ?? "", g = [Oe], y = m === "" ? t : `${m}|${t}`, _ = Ut(JSON.stringify([
    y,
    l.toString(),
    t,
    Oe,
    "node_error_handler",
    e.id
  ]), s.id), b = `${y}:${_}`, v = [
    Oe,
    String(e.name),
    t,
    !1
  ];
  let M = {
    langgraph_step: l,
    langgraph_node: t,
    langgraph_triggers: g,
    langgraph_path: v,
    langgraph_checkpoint_ns: b,
    checkpoint_ns: b
  };
  h.metadata !== void 0 && (M = {
    ...M,
    ...h.metadata
  });
  const I = [], w = {
    checkpointId: s.id,
    checkpointNs: b,
    taskId: _,
    threadId: p.thread_id,
    runId: o.runId != null ? String(o.runId) : void 0,
    nodeAttempt: 1
  };
  return {
    name: t,
    input: e.input,
    proc: f,
    subgraphs: h.subgraphs,
    writes: I,
    config: {
      ..._e(oe(o, {
        metadata: M,
        tags: h.tags,
        store: c.store ?? o.store
      }), {
        runName: t,
        callbacks: d?.getChild(`graph:step:${l}`),
        configurable: {
          [Bn]: _,
          [De]: (C) => Ws((O) => I.push(...O), a, C),
          [Qe]: (C, O = !1) => Wn(s, i, {
            name: t,
            writes: I,
            triggers: g,
            path: v
          }, C, O),
          [Ke]: u ?? p.__pregel_checkpointer,
          [Te]: {
            ...p[Te],
            [m]: s.id
          },
          [et]: zs({
            pendingWrites: r ?? [],
            taskId: _,
            currentTaskInput: e.input,
            resumeMap: o.configurable?.[Hn],
            namespaceHash: vt(b)
          }),
          [mn]: s.channel_values[gn],
          [la]: new wi(String(e.name), n),
          checkpoint_id: void 0,
          checkpoint_ns: b
        }
      }),
      executionInfo: w
    },
    triggers: g,
    retry_policy: h.retryPolicy,
    cache_key: void 0,
    id: _,
    path: v,
    writers: h.getWriters()
  };
}
function Iw(e, t, n) {
  let s;
  if (typeof e.channels == "object" && !Array.isArray(e.channels)) {
    s = {};
    for (const [r, a] of Object.entries(e.channels)) if (e.triggers.includes(a)) try {
      s[r] = _n(t, a, !1);
    } catch (i) {
      if (i.name === re.unminifiable_name) return;
      throw i;
    }
    else if (a in t) try {
      s[r] = _n(t, a, !1);
    } catch (i) {
      if (i.name === re.unminifiable_name) continue;
      throw i;
    }
  } else if (Array.isArray(e.channels)) {
    let r = !1;
    for (const a of e.channels) try {
      s = _n(t, a, !1), r = !0;
      break;
    } catch (i) {
      if (i.name === re.unminifiable_name) continue;
      throw i;
    }
    if (!r) return;
  } else throw new Error(`Invalid channels type, expected list or dict, got ${e.channels}`);
  return n && e.mapper !== void 0 && (s = e.mapper(s)), s;
}
function Aw(e, t) {
  if (typeof e.args != "object" || e.args === null) return e;
  const n = {};
  for (const [s, r] of Object.entries(e.args)) {
    const a = t[s];
    (!a || a.lc_graph_name !== "UntrackedValue") && (n[s] = r);
  }
  return new de(e.node, n);
}
function zs({ pendingWrites: e, taskId: t, currentTaskInput: n, resumeMap: s, namespaceHash: r, pendingWritesIndex: a }) {
  const i = a ? a.nullResume : e.find(([c, l]) => c === "00000000-0000-0000-0000-000000000000" && l === "__resume__")?.[2], o = {
    callCounter: 0,
    interruptCounter: -1,
    resume: (() => {
      const c = a ? (a.resumeByTaskId.get(t) ?? []).flat() : e.filter(([l, u]) => l === t && u === "__resume__").flatMap(([l, u, d]) => d);
      if (s != null && r in s) {
        const l = s[r];
        c.push(l);
      }
      return c;
    })(),
    nullResume: i,
    subgraphCounter: 0,
    currentTaskInput: n,
    consumeNullResume: () => {
      if (o.nullResume)
        return delete o.nullResume, e.splice(e.findIndex(([c, l]) => c === "00000000-0000-0000-0000-000000000000" && l === "__resume__"), 1), i;
    }
  };
  return o;
}
const as = {
  blue: {
    start: "\x1B[34m",
    end: "\x1B[0m"
  },
  green: {
    start: "\x1B[32m",
    end: "\x1B[0m"
  },
  yellow: {
    start: "\x1B[33;1m",
    end: "\x1B[0m"
  }
}, is = (e, t) => `${e.start}${t}${e.end}`;
function Ow(e) {
  if (e == null) return;
  const t = {};
  if (e.metadata != null)
    for (const [s, r] of Object.entries(e.metadata)) r_.has(s) || (t[s] = r);
  const n = C_(e.tags);
  return n != null && (t.tags = n), Object.keys(t).length > 0 ? t : void 0;
}
function* Br(e) {
  for (const { id: t, name: n, input: s, config: r, triggers: a, writes: i } of e) {
    if (r?.tags?.includes("langsmith:hidden")) continue;
    const o = {
      id: t,
      name: n,
      input: s,
      triggers: a,
      interrupts: i.filter(([l, u]) => l === t && u === "__interrupt__").map(([, l]) => l)
    }, c = Ow(r);
    c != null && (o.metadata = c), yield o;
  }
}
function Pw(e) {
  return typeof e != "object" || e === null ? !1 : "$writes" in e && Array.isArray(e.$writes);
}
function Eu(e) {
  const t = {};
  for (const [n, s] of e) {
    const r = String(n);
    if (r in t) {
      const a = Pw(t[r]) ? t[r].$writes : [t[r]];
      a.push(s), t[r] = { $writes: a };
    } else t[r] = s;
  }
  return t;
}
function* Nw(e, t) {
  for (const [{ id: n, name: s, config: r }, a] of e)
    r?.tags?.includes("langsmith:hidden") || (yield {
      id: n,
      name: s,
      result: Eu(a.filter(([i]) => Array.isArray(t) ? t.includes(i) : i === t)),
      interrupts: a.filter((i) => i[0] === ne).map((i) => i[1])
    });
}
function* Rw(e, t, n, s, r, a, i, o) {
  function c(d) {
    const h = {};
    return d.callbacks != null && (h.callbacks = d.callbacks), d.configurable != null && (h.configurable = d.configurable), d.maxConcurrency != null && (h.max_concurrency = d.maxConcurrency), d.metadata != null && (h.metadata = d.metadata), d.recursionLimit != null && (h.recursion_limit = d.recursionLimit), d.runId != null && (h.run_id = d.runId), d.runName != null && (h.run_name = d.runName), d.tags != null && (h.tags = d.tags), h;
  }
  const l = e.configurable?.checkpoint_ns, u = {};
  for (const d of r) {
    if (!(d.subgraphs?.length ? d.subgraphs : [d.proc]).find(ku)) continue;
    let h = `${d.name}:${d.id}`;
    l && (h = `${l}|${h}`), u[d.id] = { configurable: {
      thread_id: e.configurable?.thread_id,
      checkpoint_ns: h
    } };
  }
  yield {
    config: c(e),
    values: Xt(t, n),
    metadata: s,
    next: r.map((d) => d.name),
    tasks: Tu(r, a, u, o),
    parentConfig: i ? c(i) : void 0
  };
}
function Tu(e, t, n, s) {
  return e.map((r) => {
    const a = t.find(([l, u]) => l === r.id && u === "__error__")?.[2], i = t.filter(([l, u]) => l === r.id && u === "__interrupt__").map(([, , l]) => l), o = (() => {
      if (a || i.length || !t.length) return;
      const l = t.findIndex(([u, d]) => u === r.id && d === "__return__");
      if (l >= 0) return t[l][2];
      if (typeof s == "string") return t.find(([u, d]) => u === r.id && d === s)?.[2];
      if (Array.isArray(s)) {
        const u = t.filter(([d, h]) => d === r.id && s.includes(h)).map(([, d, h]) => [d, h]);
        return u.length ? Eu(u) : void 0;
      }
    })();
    if (a) return {
      id: r.id,
      name: r.name,
      path: r.path,
      error: a,
      interrupts: i,
      result: o
    };
    const c = n?.[r.id];
    return {
      id: r.id,
      name: r.name,
      path: r.path,
      interrupts: i,
      ...c !== void 0 ? { state: c } : {},
      result: o
    };
  });
}
function $w(e, t, n) {
  console.log([
    `${is(as.blue, `[${e}:checkpoint]`)}`,
    `\x1B[1m State at the end of step ${e}:\x1B[0m
`,
    JSON.stringify(Xt(t, n), null, 2)
  ].join(""));
}
function Ba(e, t) {
  const n = t.length;
  console.log([
    `${is(as.blue, `[${e}:tasks]`)}`,
    `\x1B[1m Starting step ${e} with ${n} task${n === 1 ? "" : "s"}:\x1B[0m
`,
    t.map((s) => `- ${is(as.green, String(s.name))} -> ${JSON.stringify(s.input, null, 2)}`).join(`
`)
  ].join(""));
}
function jw(e, t, n) {
  const s = {};
  for (const [r, a] of t) n.includes(r) && (s[r] || (s[r] = []), s[r].push(a));
  console.log([
    `${is(as.blue, `[${e}:writes]`)}`,
    `\x1B[1m Finished step ${e} with writes to ${Object.keys(s).length} channel${Object.keys(s).length !== 1 ? "s" : ""}:\x1B[0m
`,
    Object.entries(s).map(([r, a]) => `- ${is(as.yellow, r)} -> ${a.map((i) => JSON.stringify(i)).join(", ")}`).join(`
`)
  ].join(""));
}
var Hr = class extends Kn {
  _abortController;
  _innerReader;
  /**
  * @param readableStream - The stream to wrap.
  * @param abortController - The abort controller to use. Optional. One will be created if not provided.
  */
  constructor(e, t) {
    const n = e.getReader(), s = t ?? new AbortController();
    super({ start(r) {
      return a();
      function a() {
        return n.read().then(({ done: i, value: o }) => {
          if (i) {
            r.close();
            return;
          }
          return r.enqueue(o), a();
        });
      }
    } }), this._abortController = s, this._innerReader = n;
  }
  /**
  * Aborts the stream, abandoning any pending operations in progress. Calling this triggers an
  * {@link AbortSignal} that is propagated to the tasks that are producing the data for this stream.
  * @param reason - The reason for aborting the stream. Optional.
  */
  async cancel(e) {
    this._abortController.abort(e), this._innerReader.releaseLock();
  }
  /**
  * The {@link AbortSignal} for the stream. Aborted when {@link cancel} is called.
  */
  get signal() {
    return this._abortController.signal;
  }
}, xu = class extends Kn {
  modes;
  controller;
  passthroughFn;
  _closed = !1;
  get closed() {
    return this._closed;
  }
  constructor(e) {
    let t;
    const n = new Promise((s) => {
      t = s;
    });
    super({ start: (s) => {
      t(s);
    } }), n.then((s) => {
      this.controller = s;
    }), this.passthroughFn = e.passthroughFn, this.modes = e.modes;
  }
  push(e) {
    this._closed || !this.controller || (this.passthroughFn?.(e), this.controller.enqueue(e));
  }
  close() {
    try {
      this.controller.close();
    } catch {
    } finally {
      this._closed = !0;
    }
  }
  error(e) {
    try {
      this.controller?.error(e);
    } finally {
      this._closed = !0;
    }
  }
}, Lw = class extends pr {
  name = "StreamToolsHandler";
  /** Ensure tool lifecycle callbacks run before tool.invoke returns/errors. */
  awaitHandlers = !0;
  streamFn;
  runs = {};
  constructor(e) {
    super(), this.streamFn = e;
  }
  handleToolStart(e, t, n, s, r, a, i, o) {
    if (!a || r && r.includes("langsmith:hidden")) return;
    const c = a.langgraph_checkpoint_ns?.split("|") ?? [], l = {
      ns: c,
      toolCallId: o,
      toolName: i ?? "unknown",
      input: t
    };
    this.runs[n] = l, this.streamFn([
      c,
      "tools",
      {
        event: "on_tool_start",
        toolCallId: l.toolCallId,
        name: l.toolName,
        input: t
      }
    ]);
  }
  handleToolEvent(e, t) {
    const n = this.runs[t];
    n && this.streamFn([
      n.ns,
      "tools",
      {
        event: "on_tool_event",
        toolCallId: n.toolCallId,
        name: n.toolName,
        data: e
      }
    ]);
  }
  handleToolEnd(e, t) {
    const n = this.runs[t];
    delete this.runs[t], n && this.streamFn([
      n.ns,
      "tools",
      {
        event: "on_tool_end",
        toolCallId: n.toolCallId,
        name: n.toolName,
        output: e
      }
    ]);
  }
  handleToolError(e, t) {
    const n = this.runs[t];
    delete this.runs[t], n && this.streamFn([
      n.ns,
      "tools",
      {
        event: "on_tool_error",
        toolCallId: n.toolCallId,
        name: n.toolName,
        error: e
      }
    ]);
  }
};
function Dw(e) {
  return JSON.stringify(e, function(t, n) {
    const s = this[t];
    if (s != null && typeof s == "object" && "toDict" in s && typeof s.toDict == "function") {
      const { type: r, data: a } = s.toDict();
      return {
        ...a,
        type: r
      };
    }
    return n;
  });
}
function Fw(e) {
  return e instanceof Error ? {
    error: e.name,
    message: e.message
  } : {
    error: "Error",
    message: JSON.stringify(e)
  };
}
function zi(e) {
  return typeof e != "object" || e == null ? !1 : "configurable" in e && typeof e.configurable == "object" && e.configurable != null;
}
function Ur(e) {
  return !zi(e) || !e.configurable.thread_id ? null : {
    thread_id: e.configurable.thread_id,
    checkpoint_ns: e.configurable.checkpoint_ns || "",
    checkpoint_id: e.configurable.checkpoint_id || null,
    checkpoint_map: e.configurable.checkpoint_map || null
  };
}
function Co(e) {
  if (zi(e)) {
    const t = Object.fromEntries(Object.entries(e.configurable).filter(([s]) => !s.startsWith("__"))), n = {
      ...e,
      configurable: t
    };
    return delete n.callbacks, n;
  }
  return e;
}
function Eo(e) {
  const t = {
    ...e,
    checkpoint: Ur(e.config),
    parent_checkpoint: Ur(e.parentConfig),
    config: Co(e.config),
    parent_config: Co(e.parentConfig),
    tasks: e.tasks.map((n) => {
      if (zi(n.state)) {
        const s = Ur(n.state);
        if (s != null) {
          const r = {
            ...n,
            checkpoint: s
          };
          return delete r.state, r;
        }
      }
      return n;
    })
  };
  return delete t.parentConfig, t;
}
function Vw(e) {
  const t = new TextEncoder();
  return new ReadableStream({ async start(n) {
    const s = (r) => {
      n.enqueue(t.encode(`event: ${r.event}
data: ${Dw(r.data)}

`));
    };
    try {
      for await (const r of e) {
        const [a, i, o] = r;
        let c = o;
        if (i === "debug") {
          const l = o;
          l.type === "checkpoint" && (c = {
            ...l,
            payload: Eo(l.payload)
          });
        }
        i === "checkpoints" && (c = Eo(o)), s({
          event: a?.length ? `${i}|${a.join("|")}` : i,
          data: c
        });
      }
    } catch (r) {
      s({
        event: "error",
        data: Fw(r)
      });
    }
    n.close();
  } });
}
function Bw(...e) {
  return new xu({
    passthroughFn: (t) => {
      const n = t[1] === "checkpoints" && Cr(t[2]);
      for (const s of e) (s.modes.has(t[1]) || n) && s.push(t);
    },
    modes: new Set(e.flatMap((t) => Array.from(t.modes)))
  });
}
var Hw = class {
  /** Parent checkpoint ID used as the `before` cursor for subgraph lookups. */
  checkpointId;
  #e = /* @__PURE__ */ new Set();
  /**
  * @param checkpointId - Checkpoint ID from the parent graph at the replay point.
  */
  constructor(e) {
    this.checkpointId = e;
  }
  /**
  * Whether this is the first visit to a logical subgraph namespace in the run.
  *
  * Task-id suffixes are stripped so the same subgraph invoked across loop
  * iterations shares one visit record.
  *
  * @param checkpointNs - Subgraph checkpoint namespace.
  */
  #t(e) {
    const t = e.includes(":") ? e.slice(0, e.lastIndexOf(":")) : e;
    return this.#e.has(t) ? !1 : (this.#e.add(t), !0);
  }
  /**
  * Load the checkpoint tuple for a subgraph namespace during replay.
  *
  * On the first visit to `checkpointNs`, returns the latest checkpoint saved
  * before {@link ReplayState.checkpointId}. On subsequent visits, delegates to
  * `checkpointer.getTuple` for the current config.
  *
  * @param checkpointNs - Subgraph checkpoint namespace.
  * @param checkpointer - Checkpointer shared with the parent graph.
  * @param checkpointConfig - Runnable config for the subgraph lookup.
  * @returns The resolved checkpoint tuple, if any.
  */
  async getCheckpoint(e, t, n) {
    if (this.#t(e)) {
      const s = [];
      for await (const r of t.list(n, {
        before: { configurable: { checkpoint_id: this.checkpointId } },
        limit: 1
      })) s.push(r);
      return s.length > 0 ? s[0] : void 0;
    }
    return await t.getTuple(n) ?? void 0;
  }
};
const Es = /* @__PURE__ */ Symbol.for("INPUT_DONE"), Wr = /* @__PURE__ */ Symbol.for("INPUT_RESUMING"), Uw = 25;
function Mu(e) {
  if (!(e == null || typeof e != "object")) {
    if (ve.isInstance(e)) {
      const t = e;
      t.id == null && (t.id = ia(), t.lc_kwargs != null && (t.lc_kwargs.id = t.id));
      return;
    }
    if (Array.isArray(e)) {
      for (const t of e) Mu(t);
      return;
    }
  }
}
function Iu(e) {
  return e === void 0 || e === "" ? [] : e.split("|");
}
function Ww(e) {
  if (!e) return [];
  let t = "";
  for (const n of Object.keys(e)) n !== "" && n.length > t.length && (t = n);
  return Iu(t);
}
var zw = class extends p_ {
  cache;
  queue = Promise.resolve();
  constructor(e) {
    super(), this.cache = e;
  }
  async get(e) {
    return this.enqueueOperation("get", e);
  }
  async set(e) {
    return this.enqueueOperation("set", e);
  }
  async clear(e) {
    return this.enqueueOperation("clear", e);
  }
  async stop() {
    await this.queue;
  }
  enqueueOperation(e, ...t) {
    const n = this.queue.then(() => this.cache[e](...t));
    return this.queue = n.then(() => {
    }, () => {
    }), n;
  }
}, Gw = class Au {
  input;
  output;
  config;
  checkpointer;
  checkpointerGetNextVersion;
  channels;
  checkpoint;
  checkpointIdSaved;
  /**
  * Exit-mode accumulator of DeltaChannel writes across the whole run, as
  * `[step, taskId, channel, value]`. `undefined` outside "exit" durability.
  */
  _exitDeltaWrites;
  /**
  * DeltaChannels that saw an Overwrite since the last checkpoint. These
  * channels are force-snapshotted at the next checkpoint so reconstruction
  * starts from the post-overwrite value and never has to replay across the
  * reset (the live `update` discards every sibling write in the overwriting
  * super-step). Cleared once the channel snapshots.
  */
  _deltaChannelsWithOverwrite = /* @__PURE__ */ new Set();
  /** Whether a real checkpoint was loaded from the saver at initialization. */
  _hasPersistedParent = !1;
  /** The checkpointConfig as captured at initialization (anchor for exit writes). */
  _initialCheckpointConfig;
  checkpointConfig;
  checkpointMetadata;
  checkpointNamespace;
  checkpointPendingWrites = [];
  checkpointPreviousVersions;
  step;
  stop;
  durability;
  outputKeys;
  streamKeys;
  nodes;
  skipDoneTasks;
  prevCheckpointConfig;
  updatedChannels;
  status = "pending";
  /**
  * Run-scoped control surface for cooperative draining. Populated from the
  * run config. When `control.drainRequested` is true, the loop stops at the
  * next superstep boundary instead of dispatching more tasks.
  */
  control;
  tasks = {};
  stream;
  checkpointerPromises = /* @__PURE__ */ new Set();
  isNested;
  /** True when an explicit checkpoint_id targets the latest saved checkpoint. */
  resumeAtHead;
  _checkpointerChainedPromise = Promise.resolve();
  /**
  * Track a checkpointer promise, removing it from the set on success.
  * Failed promises are kept so that Promise.all() in the finally block
  * of _streamIterator can surface the error.
  *
  * @internal
  */
  _trackCheckpointerPromise(t) {
    const n = t.then((s) => (this.checkpointerPromises.delete(n), s), (s) => {
      throw s;
    });
    this.checkpointerPromises.add(n);
  }
  store;
  cache;
  manager;
  interruptAfter;
  interruptBefore;
  toInterrupt = [];
  debug = !1;
  triggerToNodes;
  get isResuming() {
    let t = !1;
    if ("__start__" in this.checkpoint.channel_versions) t = !0;
    else for (const o in this.checkpoint.channel_versions) if (Object.prototype.hasOwnProperty.call(this.checkpoint.channel_versions, o)) {
      t = !0;
      break;
    }
    const n = this.config.configurable?.__pregel_resuming !== void 0 && this.config.configurable?.__pregel_resuming, s = this.input === null || this.input === void 0, r = Y(this.input) && this.input.resume != null, a = this.input === Wr, i = !this.isNested && this.config.metadata?.run_id !== void 0 && this.checkpointMetadata?.run_id !== void 0 && this.config.metadata.run_id === this.checkpointMetadata?.run_id;
    return t && (n || s || r || a || i);
  }
  get isReplaying() {
    return !this.skipDoneTasks;
  }
  constructor(t) {
    this.input = t.input, this.checkpointer = t.checkpointer, this.checkpointer !== void 0 ? this.checkpointerGetNextVersion = this.checkpointer.getNextVersion.bind(this.checkpointer) : this.checkpointerGetNextVersion = bw, this.checkpoint = t.checkpoint, this.checkpointMetadata = t.checkpointMetadata, this.checkpointPreviousVersions = t.checkpointPreviousVersions, this.channels = t.channels, this.checkpointPendingWrites = t.checkpointPendingWrites, this.step = t.step, this.stop = t.stop, this.config = t.config, this.checkpointConfig = t.checkpointConfig, this.isNested = t.isNested, this.resumeAtHead = t.resumeAtHead, this.manager = t.manager, this.outputKeys = t.outputKeys, this.streamKeys = t.streamKeys, this.nodes = t.nodes, this.skipDoneTasks = t.skipDoneTasks, this.store = t.store, this.cache = t.cache ? new zw(t.cache) : void 0, this.stream = t.stream, this.checkpointNamespace = t.checkpointNamespace, this.prevCheckpointConfig = t.prevCheckpointConfig, this.interruptAfter = t.interruptAfter, this.interruptBefore = t.interruptBefore, this.durability = t.durability, this.debug = t.debug, this.triggerToNodes = t.triggerToNodes, this.control = this.config.control, this._exitDeltaWrites = this.durability === "exit" && this.checkpointer != null ? [] : void 0, this._hasPersistedParent = t.hasPersistedParent ?? !1, this._initialCheckpointConfig = t.checkpointConfig, this.checkpointIdSaved = t.checkpoint.id;
  }
  static async initialize(t) {
    let { config: n, stream: s } = t;
    s !== void 0 && n.configurable?.__pregel_stream !== void 0 && (s = Bw(s, n.configurable[mi]));
    const r = n.configurable ? !("checkpoint_id" in n.configurable) : !0, a = n.configurable?.[et];
    n.configurable && a && (a.subgraphCounter > 0 && (n = ye(n, { [Ge]: [n.configurable[Ge], a.subgraphCounter.toString()].join("|") })), a.subgraphCounter += 1);
    const i = n.configurable?.checkpoint_id, o = Qe in (n.configurable ?? {});
    !o && n.configurable?.checkpoint_ns !== void 0 && n.configurable?.checkpoint_ns !== "" && (n = ye(n, {
      checkpoint_ns: "",
      checkpoint_id: void 0
    }));
    let c = n;
    n.configurable?.checkpoint_id === void 0 && n.configurable?.checkpoint_map !== void 0 && n.configurable?.checkpoint_map?.[n.configurable?.checkpoint_ns] && (c = ye(n, { checkpoint_id: n.configurable[Te][n.configurable?.checkpoint_ns] }));
    const l = Iu(n.configurable?.checkpoint_ns);
    let u;
    t.checkpointer ? c.configurable?.checkpoint_id ? u = await t.checkpointer.getTuple(c) : n.configurable?.__pregel_replay_state ? (u = await n.configurable[ua].getCheckpoint(n.configurable?.checkpoint_ns ?? "", t.checkpointer, c), n.configurable && delete n.configurable[Vn]) : u = await t.checkpointer.getTuple(c) : u = void 0;
    const d = u !== void 0;
    u || (u = {
      config: n,
      checkpoint: sr(),
      metadata: {
        source: "input",
        step: -2,
        parents: {}
      },
      pendingWrites: []
    }), c = {
      ...n,
      ...u.config,
      configurable: {
        checkpoint_ns: "",
        ...n.configurable,
        ...u.config.configurable
      }
    };
    const h = u.parentConfig, f = bn(u.checkpoint), p = { ...u.metadata };
    let m = u.pendingWrites ?? [];
    const g = n.configurable?.checkpoint_ns, y = n.configurable?.[Te];
    typeof g == "string" && g !== "" && typeof y == "object" && y !== null && g in y && m.length > 0 && (m = m.filter(([, A]) => A !== tt));
    let _ = !1;
    const b = c.configurable?.thread_id, v = c.configurable?.checkpoint_ns ?? "";
    t.checkpointer && i && typeof b == "string" && (_ = (await t.checkpointer.getTuple({ configurable: {
      thread_id: b,
      checkpoint_ns: v
    } }))?.config.configurable?.checkpoint_id === i && p.source !== "update" && p.source !== "fork");
    const M = await Ma(t.channelSpecs, f, {
      saver: t.checkpointer,
      config: c
    }), I = (p.step ?? 0) + 1, w = I + (n.recursionLimit ?? Uw) + 1, C = { ...f.channel_versions }, O = t.store ? new Kl(t.store) : void 0;
    return O && await O.start(), new Au({
      input: t.input,
      config: n,
      checkpointer: t.checkpointer,
      checkpoint: f,
      checkpointMetadata: p,
      checkpointConfig: c,
      prevCheckpointConfig: h,
      checkpointNamespace: l,
      channels: M,
      isNested: o,
      resumeAtHead: _,
      manager: t.manager,
      skipDoneTasks: r,
      step: I,
      stop: w,
      checkpointPreviousVersions: C,
      checkpointPendingWrites: m,
      outputKeys: t.outputKeys ?? [],
      streamKeys: t.streamKeys ?? [],
      nodes: t.nodes,
      stream: s,
      store: O,
      cache: t.cache,
      interruptAfter: t.interruptAfter,
      interruptBefore: t.interruptBefore,
      durability: t.durability,
      debug: t.debug,
      triggerToNodes: t.triggerToNodes,
      hasPersistedParent: d
    });
  }
  _checkpointerPutAfterPrevious(t) {
    this._checkpointerChainedPromise = this._checkpointerChainedPromise.then(() => this.checkpointer?.put(t.config, t.checkpoint, t.metadata, t.newVersions)), this._trackCheckpointerPromise(this._checkpointerChainedPromise);
  }
  /**
  * Put writes for a task, to be read by the next tick.
  * @param taskId
  * @param writes
  */
  putWrites(t, n) {
    let s = n;
    if (s.length === 0) return;
    s.every(([c]) => c in Jl) && (s = Array.from(new Map(s.map((c) => [c[0], c])).values()));
    let r = !1;
    for (const c in this.channels) if (Object.prototype.hasOwnProperty.call(this.channels, c) && this.channels[c].lc_graph_name === "UntrackedValue") {
      r = !0;
      break;
    }
    let a = s;
    r && (a = s.filter(([c]) => {
      const l = this.channels[c];
      return !l || l.lc_graph_name !== "UntrackedValue";
    }).map(([c, l]) => c === "__pregel_tasks" && Me(l) ? [c, Aw(l, this.channels)] : [c, l])), this.checkpointPendingWrites = this.checkpointPendingWrites.filter((c) => c[0] !== t);
    for (const [c, l] of a) this.checkpointPendingWrites.push([
      t,
      c,
      l
    ]);
    for (const [c, l] of a) {
      const u = this.channels[c];
      u != null && lt(u) && Mu(l);
    }
    const i = ye(this.checkpointConfig, {
      [Ge]: this.config.configurable?.checkpoint_ns ?? "",
      [Dt]: this.checkpoint.id
    });
    if (this.durability !== "exit" && this.checkpointer != null && this._trackCheckpointerPromise(this.checkpointer.putWrites(i, a, t)), this.tasks && this._outputWrites(t, s), !n.length || !this.cache || !this.tasks) return;
    const o = this.tasks[t];
    o == null || o.cache_key == null || n[0][0] === "__error__" || n[0][0] === "__interrupt__" || this.cache.set([{
      key: [o.cache_key.ns, o.cache_key.key],
      value: o.writes,
      ttl: o.cache_key.ttl
    }]);
  }
  _outputWrites(t, n, s = !1) {
    const r = this.tasks[t];
    if (r !== void 0) {
      if (r.config !== void 0 && (r.config.tags ?? []).includes("langsmith:hidden")) return;
      if (n.length > 0)
        if (n[0][0] === "__interrupt__") {
          if (r.path?.[0] === "__pregel_push" && r.path?.[r.path.length - 1] === !0) return;
          const a = n.filter((i) => i[0] === ne).flatMap((i) => i[1]);
          this._emit([["updates", { [ne]: a }], ["values", { [ne]: a }]]);
        } else n[0][0] !== "__error__" && this._emit(on(rt(pw(this.outputKeys, [[r, n]], s), "updates")));
      s || this._emit(on(rt(Nw([[r, n]], this.streamKeys), "tasks")));
    }
  }
  async _matchCachedWrites() {
    if (!this.cache) return [];
    const t = [], n = ([i, o]) => `ns:${i.join(",")}|key:${o}`, s = [], r = {};
    for (const i of Object.values(this.tasks)) i.cache_key != null && !i.writes.length && (s.push([i.cache_key.ns, i.cache_key.key]), r[n([i.cache_key.ns, i.cache_key.key])] = i);
    if (s.length === 0) return [];
    const a = await this.cache.get(s);
    for (const { key: i, value: o } of a) {
      const c = r[n(i)];
      c != null && (c.writes.push(...o), t.push({
        task: c,
        result: o
      }));
    }
    return t;
  }
  /**
  * Execute a single iteration of the Pregel loop.
  * Returns true if more iterations are needed.
  * @param params - The input keys to use for the tick.
  * @returns True if more iterations are needed, false otherwise.
  */
  async tick(t) {
    this.store && !this.store.isRunning && await this.store?.start();
    const { inputKeys: n = [] } = t;
    if (this.status !== "pending") throw new Error(`Cannot tick when status is no longer "pending". Current status: "${this.status}"`);
    if (![Es, Wr].includes(this.input)) await this._first(n);
    else {
      if (this.toInterrupt.length > 0)
        throw this.status = "interrupt_before", new Jt();
      if (Object.values(this.tasks).every((r) => r.writes.length > 0)) {
        const r = Object.values(this.tasks), a = r.flatMap((o) => o.writes);
        this.updatedChannels = Ee(this.checkpoint, this.channels, r, this.checkpointerGetNextVersion, this.triggerToNodes);
        for (const [o, c] of a) {
          const l = this.channels[o];
          l != null && lt(l) && Xs(c) && this._deltaChannelsWithOverwrite.add(o);
        }
        const i = await kt(rt(Vr(this.outputKeys, a, this.channels), "values"));
        if (this._exitDeltaWrites !== void 0) for (const [o, c, l] of this.checkpointPendingWrites) {
          const u = this.channels[c];
          u != null && lt(u) && this._exitDeltaWrites.push([
            this.step,
            o,
            c,
            l
          ]);
        }
        if (this.checkpointPendingWrites = [], await this._putCheckpoint({ source: "loop" }), this._emitValuesWithCheckpointMeta(i), Cs(this.checkpoint, this.interruptAfter, r))
          throw this.status = "interrupt_after", new Jt();
        this.config.configurable?.__pregel_resuming !== void 0 && delete this.config.configurable?.[Vn];
      } else return !1;
    }
    if (this.step > this.stop)
      return this.status = "out_of_steps", !1;
    this.tasks = fn(this.checkpoint, this.checkpointPendingWrites, this.nodes, this.channels, this.config, !0, {
      step: this.step,
      checkpointer: this.checkpointer,
      isResuming: this.isResuming,
      manager: this.manager,
      store: this.store,
      stream: this.stream,
      triggerToNodes: this.triggerToNodes,
      updatedChannels: this.updatedChannels
    });
    let s = Object.values(this.tasks);
    if (this.checkpointer && (this.stream.modes.has("checkpoints") || this.stream.modes.has("debug")) && this._emit(await kt(rt(Rw(this.checkpointConfig, this.channels, this.streamKeys, this.checkpointMetadata, s, this.checkpointPendingWrites, this.prevCheckpointConfig, this.outputKeys), "checkpoints"))), s.length === 0)
      return this.status = "done", !1;
    if (this.control != null && this.control.drainRequested)
      return this.status = "draining", !1;
    if (this.skipDoneTasks && this.checkpointPendingWrites.length > 0) {
      for (const [r, a, i] of this.checkpointPendingWrites) {
        if (a === "__error__" || a === "__error_source_node__" || a === "__interrupt__" || a === "__resume__") continue;
        const o = s.find((c) => c.id === r);
        o && o.writes.push([a, i]);
      }
      this._resumeErrorHandlersIfApplicable(), s = Object.values(this.tasks);
      for (const r of s) r.writes.length > 0 && this._outputWrites(r.id, r.writes, !0);
    }
    if (s.every((r) => r.writes.length > 0)) return this.tick({ inputKeys: n });
    if (Cs(this.checkpoint, this.interruptBefore, s))
      throw this.status = "interrupt_before", new Jt();
    if (this.stream.modes.has("tasks") || this.stream.modes.has("debug")) {
      const r = await kt(rt(Br(s), "tasks"));
      this._emit(r);
    }
    return !0;
  }
  async finishAndHandleError(t) {
    this.durability === "exit" && (!this.isNested || typeof t < "u" || this.checkpointNamespace.every((s) => !s.includes(":"))) && (await this._putExitDeltaWrites(), this._putCheckpoint(this.checkpointMetadata), this._flushPendingWrites());
    const n = this._suppressInterrupt(t);
    return (n || t === void 0) && (this.output = Xt(this.channels, this.outputKeys)), n && (this.tasks !== void 0 && this.checkpointPendingWrites.length > 0 && Object.values(this.tasks).some((s) => s.writes.length > 0) && (this.updatedChannels = Ee(this.checkpoint, this.channels, Object.values(this.tasks), this.checkpointerGetNextVersion, this.triggerToNodes), this._emitValuesWithCheckpointMeta(on(rt(Vr(this.outputKeys, Object.values(this.tasks).flatMap((s) => s.writes), this.channels), "values")))), Et(t) && !t.interrupts.length && this._emit([["updates", { [ne]: [] }], ["values", { [ne]: [] }]], this.#e())), n;
  }
  async acceptPush(t, n, s) {
    if (this.interruptAfter?.length > 0 && Cs(this.checkpoint, this.interruptAfter, [t])) {
      this.toInterrupt.push(t);
      return;
    }
    const r = Va([
      Oe,
      t.path ?? [],
      n,
      t.id,
      s
    ], this.checkpoint, this.checkpointPendingWrites, this.nodes, this.channels, t.config ?? {}, !0, {
      step: this.step,
      checkpointer: this.checkpointer,
      manager: this.manager,
      store: this.store,
      stream: this.stream
    });
    if (!r) return;
    if (this.interruptBefore?.length > 0 && Cs(this.checkpoint, this.interruptBefore, [r])) {
      this.toInterrupt.push(r);
      return;
    }
    (this.stream.modes.has("tasks") || this.stream.modes.has("debug")) && this._emit(on(rt(Br([r]), "tasks"))), this.debug && Ba(this.step, [r]), this.tasks[r.id] = r, this.skipDoneTasks && this._matchWrites({ [r.id]: r });
    const a = await this._matchCachedWrites();
    for (const { task: i } of a) this._outputWrites(i.id, i.writes, !0);
    return r;
  }
  /**
  * Returns the name of the error handler node registered for `nodeName`, or
  * `undefined` if none is configured.
  */
  getErrorHandlerNode(t) {
    return this.nodes[t]?.errorHandlerNode;
  }
  /**
  * Whether `nodeName` is itself an auto-generated error handler node.
  */
  isErrorHandlerNode(t) {
    return this.nodes[t]?.isErrorHandler === !0;
  }
  /**
  * Schedule a node-level error handler task for a task that failed after its
  * retry policy was exhausted. Prepares the handler task (injecting a
  * {@link NodeError}), registers it so the runner executes it within the
  * current step, and returns it (or `undefined` if no handler applies).
  *
  * The failure provenance (`ERROR` + `ERROR_SOURCE_NODE`) is checkpointed by
  * the runner via {@link PregelLoop#putWrites} so handlers observe the same
  * context after a resume.
  */
  scheduleErrorHandler(t, n) {
    const s = this.getErrorHandlerNode(String(t.name));
    if (!s) return;
    const r = Mw(t, s, n, this.checkpoint, this.checkpointPendingWrites, this.nodes, this.channels, t.config ?? this.config, {
      step: this.step,
      checkpointer: this.checkpointer,
      manager: this.manager,
      store: this.store,
      stream: this.stream
    });
    if (r !== void 0)
      return this.tasks[r.id] = r, this._emit(on(rt(Br([r]), "tasks"))), this.debug && Ba(this.step, [r]), r;
  }
  /**
  * On resume, re-schedule error handlers for tasks that failed in a prior run
  * but had not finished being handled. Scans pending writes for
  * `ERROR_SOURCE_NODE` markers (paired with `ERROR`), marks the originating
  * task as done (so the runner won't re-run it), and prepares a fresh handler
  * task so the runner picks it up.
  */
  _resumeErrorHandlersIfApplicable() {
    const t = /* @__PURE__ */ new Map();
    for (const [n, s] of this.checkpointPendingWrites) {
      if (s !== "__error_source_node__") continue;
      const r = this.checkpointPendingWrites.find(([o, c]) => o === n && c === "__error__");
      if (r === void 0) continue;
      const a = r[2], i = new Error(a?.message ?? String(a));
      a?.name && (i.name = a.name), t.set(n, i);
    }
    for (const [n, s] of t) {
      const r = this.tasks[n];
      r !== void 0 && this.getErrorHandlerNode(String(r.name)) && (r.writes.length === 0 && r.writes.push([hs, {
        message: s.message,
        name: s.name
      }]), this.scheduleErrorHandler(r, s));
    }
  }
  _suppressInterrupt(t) {
    return Et(t) && !this.isNested;
  }
  async _first(t) {
    const { configurable: n } = this.config, s = n?.[et];
    if (s && s.nullResume !== void 0 && this.putWrites(Ie, [[tt, s.nullResume]]), Y(this.input)) {
      const l = this.input.resume != null;
      if (this.input.resume != null && typeof this.input.resume == "object" && Object.keys(this.input.resume).every(_u) && (this.config.configurable ??= {}, this.config.configurable[Hn] = this.input.resume), l && this.checkpointer == null) throw new Error("Cannot use Command(resume=...) without checkpointer");
      const u = {};
      for (const [d, h, f] of fw(this.input, this.checkpointPendingWrites))
        u[d] ??= [], u[d].push([h, f]);
      if (Object.keys(u).length === 0) throw new ma("Received empty Command input");
      for (const [d, h] of Object.entries(u)) this.putWrites(d, h);
    }
    const r = (this.checkpointPendingWrites ?? []).filter((l) => l[0] === Ie).map((l) => l.slice(1));
    r.length > 0 && Ee(this.checkpoint, this.channels, [{
      name: bt,
      writes: r,
      triggers: []
    }], this.checkpointerGetNextVersion, this.triggerToNodes);
    const a = Y(this.input), i = a && r.length > 0, o = this.isReplaying && (this.isNested && n?.checkpoint_ns !== void 0 && n?.checkpoint_ns !== "" && n?.checkpoint_map !== void 0 && n.checkpoint_ns in n.checkpoint_map || !(a && this.input.resume != null || n?.__pregel_resuming === !0 || this.resumeAtHead));
    o && (this.checkpointPendingWrites = this.checkpointPendingWrites.filter((l) => l[1] !== tt));
    const c = this.isResuming;
    if (c || i) {
      const l = { ...this.checkpoint.versions_seen[ne] };
      for (const d in this.channels)
        Object.prototype.hasOwnProperty.call(this.channels, d) && this.checkpoint.channel_versions[d] !== void 0 && (l[d] = this.checkpoint.channel_versions[d]);
      this.checkpoint.versions_seen[ne] = l, o && this.checkpointMetadata.source !== "update" && this.checkpointMetadata.source !== "fork" && (this.checkpointPendingWrites = this.checkpointPendingWrites.filter((d) => d[1] !== ne), await this._putCheckpoint({ source: "fork" }));
      const u = await kt(rt(Vr(this.outputKeys, !0, this.channels), "values"));
      c ? this.input = Wr : i && (await this._putCheckpoint({ source: "input" }), this.input = Es), this._emitValuesWithCheckpointMeta(u);
    } else {
      const l = await kt(Cu(t, this.input));
      if (l.length > 0) {
        const u = fn(this.checkpoint, this.checkpointPendingWrites, this.nodes, this.channels, this.config, !0, { step: this.step });
        this.updatedChannels = Ee(this.checkpoint, this.channels, Object.values(u).concat([{
          name: bt,
          writes: l,
          triggers: []
        }]), this.checkpointerGetNextVersion, this.triggerToNodes);
        const d = l.filter(([h]) => {
          const f = this.channels[h];
          return f != null && lt(f);
        });
        for (const [h, f] of d) Xs(f) && this._deltaChannelsWithOverwrite.add(h);
        if (d.length > 0)
          if (this._exitDeltaWrites !== void 0) for (const [h, f] of d) this._exitDeltaWrites.push([
            this.step,
            Ie,
            h,
            f
          ]);
          else this.checkpointer != null && this.putWrites(Ie, d);
        await this._putCheckpoint({ source: "input" }), this.input = Es;
      } else if ("__pregel_resuming" in (this.config.configurable ?? {})) this.input = Es;
      else throw new ma(`Received no input writes for ${JSON.stringify(t, null, 2)}`);
    }
    if (!this.isNested) {
      let l;
      if (o) {
        let u = this.checkpoint.id;
        (this.checkpointMetadata.source === "update" || this.checkpointMetadata.source === "fork") && this.prevCheckpointConfig && (u = this.prevCheckpointConfig.configurable?.checkpoint_id ?? u), l = new Hw(u);
      }
      this.config = ye(this.config, {
        [Vn]: this.isResuming,
        [ua]: l
      });
    }
  }
  #e() {
    const t = this.checkpointNamespace;
    if (!(t.length === 0 || t.length === 1 && t[0] === "") || this.config.configurable?.__pregel_stream === void 0) return t;
    const n = Ww(this.config.configurable?.[Te]);
    return n.length > 0 ? n : t;
  }
  _emit(t, n = this.checkpointNamespace) {
    for (const [s, r] of t)
      if (this.stream.modes.has(s) && this.stream.push([
        n,
        s,
        r
      ]), (s === "checkpoints" || s === "tasks") && this.stream.modes.has("debug")) {
        const a = s === "checkpoints" ? this.step - 1 : this.step, i = (/* @__PURE__ */ new Date()).toISOString(), o = s === "checkpoints" ? "checkpoint" : typeof r == "object" && r != null && "result" in r ? "task_result" : "task";
        this.stream.push([
          n,
          "debug",
          {
            step: a,
            type: o,
            timestamp: i,
            payload: r
          }
        ]);
      }
  }
  /**
  * Build a {@link StreamChunkMeta} describing the currently active checkpoint.
  * Emitted as a separate ``[namespace, "checkpoints", envelope]`` chunk before
  * the paired ``values`` chunk. Returns `undefined` if no checkpoint metadata
  * is available yet.
  */
  _currentCheckpointMeta() {
    if (!this.checkpointMetadata || !this.checkpoint?.id) return;
    const t = this.prevCheckpointConfig?.configurable?.checkpoint_id;
    return { checkpoint: {
      id: this.checkpoint.id,
      ...t ? { parent_id: t } : {},
      step: this.checkpointMetadata.step,
      source: this.checkpointMetadata.source
    } };
  }
  /**
  * Emit stream entries. When checkpoint meta is available, push a lightweight
  * ``[namespace, "checkpoints", envelope]`` chunk before each ``values`` chunk.
  */
  _emitValuesWithCheckpointMeta(t) {
    const n = this._currentCheckpointMeta();
    for (const [s, r] of t)
      s === "values" && n?.checkpoint != null && !this.stream.modes.has("checkpoints") && this.stream.push([
        this.checkpointNamespace,
        "checkpoints",
        n.checkpoint
      ]), this.stream.modes.has(s) && this.stream.push([
        this.checkpointNamespace,
        s,
        r
      ]);
  }
  _putCheckpoint(t) {
    const n = this.checkpointMetadata === t, s = this.checkpointer != null && (this.durability !== "exit" || n), r = (c) => {
      this.prevCheckpointConfig = this.checkpointConfig?.configurable?.checkpoint_id ? this.checkpointConfig : void 0, this.checkpointConfig = ye(this.checkpointConfig, { [Ge]: this.config.configurable?.checkpoint_ns ?? "" });
      const l = { ...this.checkpoint.channel_versions }, u = Us(this.checkpointPreviousVersions, l);
      this.checkpointPreviousVersions = l, this._checkpointerPutAfterPrevious({
        config: { ...this.checkpointConfig },
        checkpoint: bn(c),
        metadata: { ...this.checkpointMetadata },
        newVersions: u
      }), this.checkpointConfig = {
        ...this.checkpointConfig,
        configurable: {
          ...this.checkpointConfig.configurable,
          checkpoint_id: this.checkpoint.id
        }
      };
    };
    let a;
    if (n)
      a = { ...this.checkpointMetadata.counters_since_delta_snapshot ?? {} };
    else {
      const c = this.checkpointMetadata.counters_since_delta_snapshot ?? {};
      a = {};
      const l = this.updatedChannels ?? /* @__PURE__ */ new Set();
      for (const u in this.channels) {
        if (!Object.prototype.hasOwnProperty.call(this.channels, u) || !lt(this.channels[u])) continue;
        const [d, h] = c[u] ?? [0, 0];
        a[u] = [l.has(u) ? d + 1 : d, h + 1];
      }
      this.checkpointMetadata = {
        ...t,
        step: this.step,
        parents: this.config.configurable?.checkpoint_map ?? {}
      };
    }
    const i = s ? vo(this.channels, a) : /* @__PURE__ */ new Set();
    if (s) for (const c of this._deltaChannelsWithOverwrite) i.add(c);
    this.checkpoint = Vt(this.checkpoint, s ? this.channels : void 0, this.step, {
      id: n ? this.checkpoint.id : void 0,
      channelsToSnapshot: i,
      updatedChannels: this.updatedChannels,
      getNextVersion: s ? (c) => this.checkpointerGetNextVersion(c) : void 0
    });
    for (const c of i)
      a[c] = [0, 0], this._deltaChannelsWithOverwrite.delete(c);
    const o = {};
    for (const c in a) {
      if (!Object.prototype.hasOwnProperty.call(a, c)) continue;
      const [l, u] = a[c];
      (l !== 0 || u !== 0) && (o[c] = [l, u]);
    }
    Object.keys(o).length > 0 ? this.checkpointMetadata.counters_since_delta_snapshot = o : delete this.checkpointMetadata.counters_since_delta_snapshot, s && r(this.checkpoint), n || (this.step += 1);
  }
  /**
  * Stage the exit-mode accumulator of DeltaChannel writes so the final
  * checkpoint can be reconstructed. In "exit" durability per-step writes are
  * not persisted, so delta writes are accumulated across the run and anchored
  * here — under the saved parent, or a freshly-created stub when this is a
  * first run with no persisted parent. Channels that will snapshot in the
  * final checkpoint are excluded (their full value lives in `channel_values`).
  *
  * Must run BEFORE the final `_putCheckpoint` so the stub branch can adjust
  * `checkpointConfig` to anchor the final checkpoint on the stub.
  */
  async _putExitDeltaWrites() {
    if (this._exitDeltaWrites === void 0 || this._exitDeltaWrites.length === 0 || this.checkpointer == null || this._initialCheckpointConfig === void 0) return;
    const t = this.checkpointMetadata.counters_since_delta_snapshot ?? {}, n = vo(this.channels, t);
    for (const c of this._deltaChannelsWithOverwrite) n.add(c);
    const s = this._exitDeltaWrites.filter(([, , c]) => !n.has(c));
    if (s.length === 0) return;
    let r;
    if (this._hasPersistedParent) r = this._initialCheckpointConfig;
    else {
      const c = sr();
      c.id = this.checkpointIdSaved ?? c.id, c.ts = (/* @__PURE__ */ new Date()).toISOString();
      const l = ye(this._initialCheckpointConfig, { [Dt]: void 0 });
      r = ye(this._initialCheckpointConfig, { [Dt]: c.id }), this._trackCheckpointerPromise(this.checkpointer.put(l, c, {
        source: "loop",
        step: -2,
        parents: {}
      }, {})), this.checkpointConfig = r;
    }
    const a = ye(r, {
      [Ge]: this.config.configurable?.checkpoint_ns ?? "",
      [Dt]: r.configurable?.[Dt]
    }), i = /* @__PURE__ */ new Map(), o = [];
    for (const [c, l, u, d] of s) {
      const h = `${c}\0${l}`;
      let f = i.get(h);
      f === void 0 && (f = [], i.set(h, f), o.push({
        key: h,
        step: c,
        tid: l
      })), f.push([u, d]);
    }
    for (const { key: c, step: l, tid: u } of o) {
      const d = g_(l, u);
      this._trackCheckpointerPromise(this.checkpointer.putWrites(a, i.get(c), d));
    }
  }
  _flushPendingWrites() {
    if (this.checkpointer == null || this.checkpointPendingWrites.length === 0) return;
    const t = ye(this.checkpointConfig, {
      [Ge]: this.config.configurable?.checkpoint_ns ?? "",
      [Dt]: this.checkpoint.id
    }), n = {};
    for (const [s, r, a] of this.checkpointPendingWrites)
      n[s] ??= [], n[s].push([r, a]);
    for (const [s, r] of Object.entries(n)) this._trackCheckpointerPromise(this.checkpointer.putWrites(t, r, s));
  }
  _matchWrites(t) {
    for (const [n, s, r] of this.checkpointPendingWrites) {
      if (s === "__error__" || s === "__interrupt__" || s === "__resume__") continue;
      const a = Object.values(t).find((i) => i.id === n);
      a && a.writes.push([s, r]);
    }
    for (const n of Object.values(t)) n.writes.length > 0 && this._outputWrites(n.id, n.writes, !0);
  }
};
function Jw(e) {
  return ke(e?.message);
}
function To(e, t, n) {
  if (!e) return;
  const s = e.langgraph_checkpoint_ns, r = e.checkpoint_ns, a = s ?? r;
  if (a)
    return [a.split("|"), {
      tags: t,
      name: n,
      ...e
    }];
}
var Kw = class extends pr {
  name = "StreamMessagesHandler";
  streamFn;
  metadatas = {};
  seen = {};
  emittedChatModelRunIds = {};
  stableMessageIdMap = {};
  lc_prefer_streaming = !0;
  constructor(e) {
    super(), this.streamFn = e;
  }
  _emit(e, t, n, s = !1) {
    if (s && t.id !== void 0 && this.seen[t.id] !== void 0) return;
    let r = t.id;
    n != null && (Yo(t) ? r ??= `run-${n}-tool-${t.tool_call_id}` : ((r == null || r === `run-${n}`) && (r = this.stableMessageIdMap[n] ?? r ?? `run-${n}`), this.stableMessageIdMap[n] ??= r)), r !== t.id && (t.id = r, t.lc_kwargs.id = r), t.id != null && (this.seen[t.id] = t), this.streamFn([
      e[0],
      "messages",
      [t, e[1]]
    ]);
  }
  handleChatModelStart(e, t, n, s, r, a, i, o) {
    i && (!a || !a.includes("langsmith:nostream") && !a.includes("nostream")) && (this.metadatas[n] = To(i, a, o));
  }
  handleLLMNewToken(e, t, n, s, r, a) {
    const i = a?.chunk;
    this.emittedChatModelRunIds[n] = !0, this.metadatas[n] !== void 0 && (Jw(i) ? this._emit(this.metadatas[n], i.message, n) : this._emit(this.metadatas[n], new Ot({ content: e }), n));
  }
  handleLLMEnd(e, t) {
    if (this.metadatas[t] !== void 0) {
      if (!this.emittedChatModelRunIds[t]) {
        const n = e.generations?.[0]?.[0];
        ke(n?.message) && this._emit(this.metadatas[t], n?.message, t, !0), delete this.emittedChatModelRunIds[t];
      }
      delete this.metadatas[t], delete this.stableMessageIdMap[t];
    }
  }
  handleLLMError(e, t) {
    delete this.metadatas[t];
  }
  handleChainStart(e, t, n, s, r, a, i, o) {
    if (a !== void 0 && o === a.langgraph_node && (r === void 0 || !r.includes("langsmith:hidden")) && (this.metadatas[n] = To(a, r, o), typeof t == "object")) {
      for (const c of Object.values(t)) if ((ke(c) || Js(c)) && c.id !== void 0) this.seen[c.id] = c;
      else if (Array.isArray(c))
        for (const l of c) (ke(l) || Js(l)) && l.id !== void 0 && (this.seen[l.id] = l);
    }
  }
  handleChainEnd(e, t) {
    const n = this.metadatas[t];
    if (delete this.metadatas[t], n !== void 0) {
      if (ke(e)) this._emit(n, e, t, !0);
      else if (Array.isArray(e))
        for (const s of e) ke(s) && this._emit(n, s, t, !0);
      else if (e != null && typeof e == "object") {
        for (const s of Object.values(e)) if (ke(s)) this._emit(n, s, t, !0);
        else if (Array.isArray(s))
          for (const r of s) ke(r) && this._emit(n, r, t, !0);
      }
    }
  }
  handleChainError(e, t) {
    delete this.metadatas[t];
  }
};
function xo(e) {
  if ("response_metadata" in e && typeof e.response_metadata == "object" && e.response_metadata != null) return e.response_metadata;
}
function Mo(e) {
  if ("usage_metadata" in e && typeof e.usage_metadata == "object" && e.usage_metadata != null) return e.usage_metadata;
}
function qw(e) {
  switch (e.type) {
    case "text":
      return {
        type: "text",
        text: ""
      };
    case "reasoning":
      return {
        type: "reasoning",
        reasoning: ""
      };
    case "tool_call":
    case "tool_call_chunk":
      return {
        type: "tool_call_chunk",
        ...e.id != null ? { id: e.id } : {},
        ...e.name != null ? { name: e.name } : {},
        args: ""
      };
    default:
      return e;
  }
}
function Zw(e) {
  switch (e.type) {
    case "text": {
      const t = typeof e.text == "string" ? e.text : "";
      return t.length > 0 ? {
        event: "content-block-delta",
        index: typeof e.index == "number" ? e.index : 0,
        delta: {
          type: "text-delta",
          text: t
        }
      } : void 0;
    }
    case "reasoning": {
      const t = typeof e.reasoning == "string" ? e.reasoning : "";
      return t.length > 0 ? {
        event: "content-block-delta",
        index: typeof e.index == "number" ? e.index : 0,
        delta: {
          type: "reasoning-delta",
          reasoning: t
        }
      } : void 0;
    }
    case "tool_call_chunk":
      return {
        event: "content-block-delta",
        index: typeof e.index == "number" ? e.index : 0,
        delta: {
          type: "block-delta",
          fields: {
            ...e,
            type: "tool_call_chunk"
          }
        }
      };
    default:
      return;
  }
}
var Yw = class extends pr {
  name = "StreamProtocolMessagesHandler";
  streamFn;
  metadatas = {};
  seen = {};
  streamedRunIds = /* @__PURE__ */ new Set();
  stableMessageIdMap = {};
  lc_prefer_chat_model_stream_events = !0;
  awaitHandlers = !0;
  constructor(e) {
    super(), this.streamFn = e;
  }
  normalizeMessageId(e, t) {
    let n = e.id;
    return t != null && (J.isInstance(e) ? n ??= `run-${t}-tool-${e.tool_call_id}` : ((n == null || n === `run-${t}`) && (n = this.stableMessageIdMap[t] ?? n ?? `run-${t}`), this.stableMessageIdMap[t] ??= n)), n !== e.id && (e.id = n, e.lc_kwargs.id = n), e.id != null && (this.seen[e.id] = e), e.id;
  }
  emit(e, t, n) {
    const s = n != null ? {
      ...e[1],
      run_id: n
    } : e[1];
    this.streamFn([
      e[0],
      "messages",
      [t, s]
    ]);
  }
  emitFinalMessage(e, t, n, s = !1) {
    const r = t.id ?? (n != null ? this.stableMessageIdMap[n] : void 0);
    if (s && r != null && this.seen[r] !== void 0) return;
    const a = this.normalizeMessageId(t, n), i = t.type === "human" ? "human" : t.type === "system" ? "system" : t.type === "tool" ? "tool" : "ai", o = i === "tool" && J.isInstance(t) ? t.tool_call_id : void 0;
    this.emit(e, {
      event: "message-start",
      ...a != null ? { id: a } : {},
      ...i !== "ai" ? { role: i } : {},
      ...typeof o == "string" ? { tool_call_id: o } : {}
    }, n), (Array.isArray(t.content) ? t.content : typeof t.content == "string" && t.content.length > 0 ? [{
      type: "text",
      text: t.content
    }] : []).forEach((c, l) => {
      const u = typeof c.index == "number" ? c.index : l;
      this.emit(e, {
        event: "content-block-start",
        index: u,
        content: qw(c)
      }, n);
      const d = Zw({
        ...c,
        index: u
      });
      d != null && this.emit(e, d, n), this.emit(e, {
        event: "content-block-finish",
        index: u,
        content: c
      }, n);
    }), this.emit(e, {
      event: "message-finish",
      ...Mo(t) != null ? { usage: Mo(t) } : {},
      ...xo(t) != null ? { responseMetadata: xo(t) } : {}
    }, n);
  }
  handleChatModelStart(e, t, n, s, r, a, i, o) {
    i && (!a || !a.includes("langsmith:nostream") && !a.includes("nostream")) && (this.metadatas[n] = [i.langgraph_checkpoint_ns.split("|"), {
      tags: a,
      name: o,
      ...i
    }]);
  }
  handleLLMNewToken() {
  }
  handleChatModelStreamEvent(e, t) {
    const n = this.metadatas[t];
    if (n === void 0) return;
    let s = e;
    if (e.event === "message-start") {
      this.streamedRunIds.add(t);
      const r = e.id ?? `run-${t}`;
      this.seen[r] = !0, this.stableMessageIdMap[t] ??= r, e.id == null && (s = {
        ...e,
        id: r
      });
    }
    this.emit(n, s, t);
  }
  handleLLMEnd(e, t) {
    const n = this.metadatas[t];
    if (n === void 0) return;
    const s = e.generations?.[0]?.[0], r = ve.isInstance(s?.message) ? s.message : void 0;
    if (r != null) if (this.streamedRunIds.has(t)) {
      const a = this.normalizeMessageId(r, t);
      a != null && (this.seen[a] = r);
    } else this.emitFinalMessage(n, r, t, !0);
    this.streamedRunIds.delete(t), delete this.metadatas[t], delete this.stableMessageIdMap[t];
  }
  handleLLMError(e, t) {
    this.streamedRunIds.delete(t), delete this.metadatas[t], delete this.stableMessageIdMap[t];
  }
  handleChainStart(e, t, n, s, r, a, i, o) {
    if (a !== void 0 && o === a.langgraph_node && (r === void 0 || !r.includes("langsmith:hidden")) && (this.metadatas[n] = [a.langgraph_checkpoint_ns.split("|"), {
      tags: r,
      name: o,
      ...a
    }], typeof t == "object")) {
      for (const c of Object.values(t)) if ((ve.isInstance(c) || ea.isInstance(c)) && c.id !== void 0) this.seen[c.id] = c;
      else if (Array.isArray(c))
        for (const l of c) (ve.isInstance(l) || ea.isInstance(l)) && l.id !== void 0 && (this.seen[l.id] = l);
    }
  }
  handleChainEnd(e, t) {
    const n = this.metadatas[t];
    if (delete this.metadatas[t], n === void 0) return;
    const s = (r) => {
      ve.isInstance(r) && !J.isInstance(r) && this.emitFinalMessage(n, r, t, !0);
    };
    if (ve.isInstance(e)) s(e);
    else if (Array.isArray(e)) for (const r of e) s(r);
    else if (e != null && typeof e == "object") for (const r of Object.values(e)) if (Array.isArray(r)) for (const a of r) s(a);
    else s(r);
    delete this.stableMessageIdMap[t];
  }
  handleChainError(e, t) {
    delete this.metadatas[t], delete this.stableMessageIdMap[t];
  }
}, Xw = class {
  active = !0;
  lastProgress = Date.now();
  refreshOn;
  constructor(e) {
    this.refreshOn = e;
  }
  /** Record progress now. Always honored (used by `runtime.heartbeat()`). */
  touch() {
    this.lastProgress = Date.now();
  }
  /**
  * Record progress for an automatic signal (write/call/stream/callback).
  * No-op when `refreshOn === "heartbeat"`, where only explicit heartbeats
  * count as progress.
  */
  autoTouch() {
    this.refreshOn === "auto" && (this.lastProgress = Date.now());
  }
  close() {
    this.active = !1;
  }
}, Qw = class extends pr {
  name = "IdleProgressCallbackHandler";
  awaitHandlers = !1;
  #e;
  constructor(e) {
    super(), this.#e = e;
  }
  #t = () => {
    this.#e.autoTouch();
  };
  handleLLMStart = this.#t;
  handleChatModelStart = this.#t;
  handleLLMNewToken = this.#t;
  handleLLMEnd = this.#t;
  handleLLMError = this.#t;
  handleChainStart = this.#t;
  handleChainEnd = this.#t;
  handleChainError = this.#t;
  handleToolStart = this.#t;
  handleToolEnd = this.#t;
  handleToolError = this.#t;
  handleText = this.#t;
  handleRetrieverStart = this.#t;
  handleRetrieverEnd = this.#t;
  handleRetrieverError = this.#t;
  handleCustomEvent = this.#t;
};
function ev(e, t, n, s) {
  const r = e.configurable ?? {}, a = {}, i = r[De];
  typeof i == "function" && (a[De] = (l) => {
    if (t.active)
      return l && l.length && t.autoTouch(), i(l);
  });
  const o = r[qt];
  typeof o == "function" && (a[qt] = (...l) => {
    if (!t.active) throw new Error(`Node "${s}" attempt was cancelled after its timeout fired`);
    return t.autoTouch(), o(...l);
  });
  const c = { ...Object.keys(a).length > 0 ? ye(e, a) : e };
  if (c.heartbeat = () => {
    n.idleTimeout !== void 0 && t.touch();
  }, typeof c.writer == "function") {
    const l = c.writer;
    c.writer = ((u) => {
      if (t.active)
        return t.autoTouch(), l(u);
    });
  }
  if ((n.refreshOn ?? "auto") === "auto" && n.idleTimeout !== void 0) {
    const l = new Qw(t), u = c.callbacks;
    if (u === void 0) c.callbacks = [l];
    else if (Array.isArray(u)) c.callbacks = [...u, l];
    else {
      const d = u.copy();
      d.addHandler(l, !0), c.callbacks = d;
    }
  }
  return c;
}
async function tv(e, t, n, s) {
  const r = new Xw(n.refreshOn ?? "auto"), a = new AbortController(), { signal: i, dispose: o } = rs(t.signal, a.signal), c = ev({
    ...t,
    signal: i
  }, r, n, String(e.name)), l = Date.now(), u = s(c).then((y) => ({
    type: "ok",
    value: y
  }), (y) => ({
    type: "err",
    error: y
  }));
  let d, h;
  const f = () => {
    d !== void 0 && clearTimeout(d), h !== void 0 && clearTimeout(h);
  }, p = new Promise((y) => {
    if (n.runTimeout !== void 0 && (d = setTimeout(() => y({
      type: "timeout",
      kind: "run"
    }), n.runTimeout)), n.idleTimeout !== void 0) {
      const _ = n.idleTimeout, b = () => {
        const v = r.lastProgress + _ - Date.now();
        v <= 0 ? y({
          type: "timeout",
          kind: "idle"
        }) : h = setTimeout(b, v);
      };
      h = setTimeout(b, _);
    }
  });
  let m;
  try {
    m = await Promise.race([u, p]);
  } finally {
    f();
  }
  if (m.type !== "timeout") {
    const y = Date.now();
    n.runTimeout !== void 0 && y - l >= n.runTimeout ? m = {
      type: "timeout",
      kind: "run"
    } : n.idleTimeout !== void 0 && y - r.lastProgress >= n.idleTimeout && (m = {
      type: "timeout",
      kind: "idle"
    });
  }
  if (m.type === "ok")
    return o?.(), m.value;
  if (m.type === "err")
    throw o?.(), m.error;
  const g = Date.now() - l;
  throw r.close(), e.writes.splice(0, e.writes.length), a.abort(), o?.(), new bi({
    node: String(e.name),
    elapsed: g,
    kind: m.kind,
    runTimeout: n.runTimeout,
    idleTimeout: n.idleTimeout
  });
}
const nv = [
  400,
  401,
  402,
  403,
  404,
  405,
  406,
  407,
  409
], sv = (e) => {
  if (e.message.startsWith("Cancel") || e.message.startsWith("AbortError") || e.name === "AbortError" || e.name === "GraphValueError" || e?.code === "ECONNABORTED") return !1;
  const t = e?.response?.status ?? e?.status;
  return !(t && nv.includes(+t) || e?.error?.code === "insufficient_quota");
};
async function Ha(e, t, n, s) {
  const r = e.retry_policy ?? t;
  let a = 0, i, o, c = e.config ?? {};
  n && (c = ye(c, n)), c = {
    ...c,
    signal: s
  };
  const l = Date.now();
  for (c.executionInfo != null && (c.executionInfo = {
    ...c.executionInfo,
    nodeFirstAttemptTime: l
  }); !s?.aborted; ) {
    e.writes.splice(0, e.writes.length), i = void 0;
    try {
      e.timeout !== void 0 ? o = await tv(e, c, e.timeout, (u) => e.proc.invoke(e.input, u)) : o = await e.proc.invoke(e.input, c);
      break;
    } catch (u) {
      if (i = u, i.pregelTaskId = e.id, Tc(i)) {
        const m = c?.configurable?.checkpoint_ns, g = i.command;
        if (g.graph === m) {
          for (const y of e.writers) await y.invoke(g, c);
          i = void 0;
          break;
        } else if (g.graph === ee.PARENT) {
          const y = A_(m);
          i.command = new ee({
            ...i.command,
            graph: y
          });
        }
      }
      if (Ht(i) || r === void 0 || (a += 1, a >= (r.maxAttempts ?? 3)) || !(r.retryOn ?? sv)(i)) break;
      const d = r.initialInterval ?? 500, h = Math.min(r.maxInterval ?? 128e3, d * (r.backoffFactor ?? 2) ** (a - 1)), f = r.jitter ?? !0 ? h + Math.random() * 1e3 : h;
      await new Promise((m) => setTimeout(m, f));
      const p = i.name ?? i.constructor.unminifiable_name ?? i.constructor.name;
      (r?.logWarning ?? !0) && console.log(`Retrying task "${String(e.name)}" after ${f.toFixed(2)}ms (attempt ${a}) after ${p}: ${i}`), c = ye(c, { [Vn]: !0 }), c.executionInfo != null && (c.executionInfo = {
        ...c.executionInfo,
        nodeAttempt: a + 1,
        nodeFirstAttemptTime: l
      });
    }
  }
  return {
    task: e,
    result: o,
    error: i,
    signalAborted: s?.aborted
  };
}
const Ua = /* @__PURE__ */ Symbol.for("promiseAdded");
function rv() {
  const e = {
    next: () => {
    },
    wait: Promise.resolve(Ua)
  };
  function t(n) {
    e.next = () => {
      e.wait = new Promise(t), n(Ua);
    };
  }
  return e.wait = new Promise(t), e;
}
var av = class {
  nodeFinished;
  loop;
  /**
  * Exceptions already routed to a node-level error handler. Consulted when
  * deciding whether a failed task should abort the run.
  */
  handledExceptions = /* @__PURE__ */ new WeakSet();
  /**
  * Construct a new PregelRunner, which executes tasks from the provided PregelLoop.
  * @param loop - The PregelLoop that produces tasks for this runner to execute.
  */
  constructor({ loop: e, nodeFinished: t }) {
    this.loop = e, this.nodeFinished = t;
  }
  /**
  * Execute tasks from the current step of the PregelLoop.
  *
  * Note: this method does NOT call {@link PregelLoop}#tick. That must be handled externally.
  * @param options - Options for the execution.
  */
  async tick(e = {}) {
    const { timeout: t, retryPolicy: n, onStepWrite: s, maxConcurrency: r } = e, a = /* @__PURE__ */ new Set();
    let i;
    const o = new AbortController(), c = o.signal, l = t ? AbortSignal.timeout(t) : void 0, u = Object.values(this.loop.tasks), d = u.filter((m) => m.writes.length === 0), { signals: h, disposeCombinedSignal: f } = this._initializeAbortSignals({
      exceptionSignal: c,
      stepTimeoutSignal: l,
      signal: e.signal
    }), p = this._executeTasksWithRetry(d, {
      signals: h,
      retryPolicy: n,
      maxConcurrency: r
    });
    for await (const { task: m, error: g, signalAborted: y } of p)
      this._commit(m, g), !(g !== void 0 && this.handledExceptions.has(g)) && (Et(g) || Ht(g) && !Et(i) ? i = g : g && (a.size === 0 || !y) && (o.abort(), a.add(g)));
    if (f?.(), s?.(this.loop.step, u.map((m) => m.writes).flat()), a.size === 1) throw Array.from(a)[0];
    if (a.size > 1) throw new AggregateError(Array.from(a), `Multiple errors occurred during superstep ${this.loop.step}. See the "errors" field of this exception for more details.`);
    if (Et(i) || pa(i) || Ht(i) && this.loop.isNested) throw i;
  }
  /**
  * Initializes the current AbortSignals for the PregelRunner, handling the various ways that
  * AbortSignals must be chained together so that the PregelLoop can be interrupted if necessary
  * while still allowing nodes to gracefully exit.
  *
  * This method must only be called once per PregelRunner#tick. It has the side effect of updating
  * the PregelLoop#config with the new AbortSignals so they may be propagated correctly to future
  * ticks and subgraph calls.
  *
  * @param options - Options for the initialization.
  * @returns The current abort signals.
  * @internal
  */
  _initializeAbortSignals({ exceptionSignal: e, stepTimeoutSignal: t, signal: n }) {
    const s = this.loop.config.configurable?.__pregel_abort_signals ?? {}, r = s.externalAbortSignal ?? n, a = t ?? s.timeoutAbortSignal, { signal: i, dispose: o } = rs(r, a, e), c = {
      externalAbortSignal: r,
      timeoutAbortSignal: a,
      composedAbortSignal: i
    };
    return this.loop.config = ye(this.loop.config, { [pm]: c }), {
      signals: c,
      disposeCombinedSignal: o
    };
  }
  /**
  * Concurrently executes tasks with the requested retry policy, yielding a {@link SettledPregelTask} for each task as it completes.
  * @param tasks - The tasks to execute.
  * @param options - Options for the execution.
  */
  async *_executeTasksWithRetry(e, t) {
    const { retryPolicy: n, maxConcurrency: s, signals: r } = t ?? {}, a = rv(), i = {}, o = {
      executingTasksMap: i,
      barrier: a,
      retryPolicy: n,
      scheduleTask: async (h, f, p) => this.loop.acceptPush(h, f, p)
    };
    if (r?.composedAbortSignal?.aborted) throw new Error("Abort");
    let c = 0, l;
    const u = rs(r?.externalAbortSignal, r?.timeoutAbortSignal), d = u.signal ? new Promise((h, f) => {
      l = () => f(/* @__PURE__ */ new Error("Abort")), u.signal?.addEventListener("abort", l, { once: !0 });
    }) : void 0;
    for (; (c === 0 || Object.keys(i).length > 0) && e.length; ) {
      for (; Object.values(i).length < (s ?? e.length) && c < e.length; c += 1) {
        const g = e[c];
        i[g.id] = Ha(g, n, { [qt]: Wa?.bind(o, this, g) }, r?.composedAbortSignal).catch((y) => ({
          task: g,
          error: y,
          signalAborted: r?.composedAbortSignal?.aborted
        }));
      }
      const h = await Promise.race([
        ...Object.values(i),
        ...d ? [d] : [],
        a.wait
      ]);
      if (h === Ua) continue;
      const f = h, { task: p, error: m } = f;
      if (m !== void 0 && !Ht(m) && !this.loop.isErrorHandlerNode(String(p.name)) && this.loop.getErrorHandlerNode(String(p.name)) !== void 0) {
        const g = this.loop.scheduleErrorHandler(p, m);
        g !== void 0 && (i[g.id] = Ha(g, n, { [qt]: Wa?.bind(o, this, g) }, r?.composedAbortSignal).catch((y) => ({
          task: g,
          error: y,
          signalAborted: r?.composedAbortSignal?.aborted
        })), a.next());
      }
      yield f, l != null && (u.signal?.removeEventListener("abort", l), u.dispose?.()), delete i[h.task.id];
    }
  }
  /**
  * Whether a failed task should record {@link ERROR_SOURCE_NODE} provenance.
  */
  _shouldRouteToErrorHandler(e) {
    const t = String(e.name);
    return this.loop.isErrorHandlerNode(t) ? !1 : this.loop.getErrorHandlerNode(t) !== void 0;
  }
  /**
  * Determines what writes to apply based on whether the task completed successfully, and what type of error occurred.
  *
  * Throws an error if the error is a {@link GraphBubbleUp} error and {@link PregelLoop}#isNested is true.
  *
  * @param task - The task to commit.
  * @param error - The error that occurred, if any.
  */
  _commit(e, t) {
    if (t !== void 0) if (Et(t)) {
      if (t.interrupts.length) {
        const n = t.interrupts.map((r) => [ne, r]), s = e.writes.filter((r) => r[0] === tt);
        s.length && n.push(...s), this.loop.putWrites(e.id, n);
      }
    } else pa(t) ? e.writes.length && this.loop.putWrites(e.id, e.writes) : Ht(t) && e.writes.length ? this.loop.putWrites(e.id, e.writes) : (e.writes.push([hs, {
      message: t.message,
      name: t.name
    }]), this._shouldRouteToErrorHandler(e) && (e.writes.push([pi, String(e.name)]), this.handledExceptions.add(t)), this.loop.putWrites(e.id, e.writes));
    else
      this.nodeFinished && (e.config?.tags == null || !e.config.tags.includes("langsmith:hidden")) && this.nodeFinished(String(e.name)), e.writes.length === 0 && e.writes.push([gi, null]), this.loop.putWrites(e.id, e.writes);
  }
};
async function Wa(e, t, n, s, r, a = {}) {
  const i = t.config?.configurable?.[et];
  if (!i) throw new Error(`BUG: No scratchpad found on task ${t.name}__${t.id}`);
  const o = i.callCounter;
  i.callCounter += 1;
  const c = new gw({
    func: n,
    name: s,
    input: r,
    cache: a.cache,
    retry: a.retry,
    timeout: a.timeout,
    callbacks: a.callbacks
  }), l = await this.scheduleTask(t, o, c);
  if (!l) return;
  const u = this.executingTasksMap[l.id];
  if (u !== void 0) return u;
  if (l.writes.length > 0) {
    const d = l.writes.filter(([f]) => f === gr), h = l.writes.filter(([f]) => f === hs);
    if (d.length > 0) {
      if (d.length === 1) return Promise.resolve(d[0][1]);
      throw new Error(`BUG: multiple returns found for task ${l.name}__${l.id}`);
    }
    if (h.length > 0) {
      if (h.length === 1) {
        const f = h[0][1], p = f instanceof Error ? f : new Error(String(f));
        return Promise.reject(p);
      }
      throw new Error(`BUG: multiple errors found for task ${l.name}__${l.id}`);
    }
    return;
  } else {
    const d = Ha(l, a.retry, { [qt]: Wa.bind(this, e, l) });
    return this.executingTasksMap[l.id] = d, this.barrier.next(), d.then(({ result: h, error: f }) => f ? Promise.reject(f) : h);
  }
}
var at = class extends Error {
  constructor(e) {
    super(e), this.name = "GraphValidationError";
  }
};
function iv({ nodes: e, channels: t, inputChannels: n, outputChannels: s, streamChannels: r, interruptAfterNodes: a, interruptBeforeNodes: i }) {
  if (!t) throw new at("Channels not provided");
  const o = /* @__PURE__ */ new Set(), c = /* @__PURE__ */ new Set();
  for (const [l, u] of Object.entries(e)) {
    if (l === "__interrupt__") throw new at(`"Node name ${ne} is reserved"`);
    if (u.constructor === Cn) u.triggers.forEach((d) => o.add(d));
    else throw new at(`Invalid node type ${typeof u}, expected PregelNode`);
  }
  for (const l of o) if (!(l in t)) throw new at(`Subscribed channel '${String(l)}' not in channels`);
  if (Array.isArray(n)) {
    if (n.every((l) => !o.has(l))) throw new at(`None of the input channels ${n} are subscribed to by any node`);
  } else if (!o.has(n)) throw new at(`Input channel ${String(n)} is not subscribed to by any node`);
  Array.isArray(s) ? s.forEach((l) => c.add(l)) : c.add(s), r && !Array.isArray(r) ? c.add(r) : Array.isArray(r) && r.forEach((l) => c.add(l));
  for (const l of c) if (!(l in t)) throw new at(`Output channel '${String(l)}' not in channels`);
  if (a && a !== "*") {
    for (const l of a) if (!(l in e)) throw new at(`Node ${String(l)} not in nodes`);
  }
  if (i && i !== "*") {
    for (const l of i) if (!(l in e)) throw new at(`Node ${String(l)} not in nodes`);
  }
}
function Io(e, t) {
  if (Array.isArray(e)) {
    for (const n of e) if (!(n in t)) throw new Error(`Key ${String(n)} not found in channels`);
  } else if (!(e in t)) throw new Error(`Key ${String(e)} not found in channels`);
}
var ov = class Ou extends st {
  lc_graph_name = "Topic";
  unique = !1;
  accumulate = !1;
  seen;
  values;
  constructor(t) {
    super(), this.unique = t?.unique ?? this.unique, this.accumulate = t?.accumulate ?? this.accumulate, this.seen = /* @__PURE__ */ new Set(), this.values = [];
  }
  fromCheckpoint(t) {
    const n = new Ou({
      unique: this.unique,
      accumulate: this.accumulate
    });
    return typeof t < "u" && (n.seen = new Set(t[0]), n.values = t[1]), n;
  }
  update(t) {
    let n = !1;
    this.accumulate || (n = this.values.length > 0, this.values = []);
    const s = t.flat();
    if (s.length > 0) if (this.unique)
      for (const r of s) this.seen.has(r) || (n = !0, this.seen.add(r), this.values.push(r));
    else
      n = !0, this.values.push(...s);
    return n;
  }
  get() {
    if (this.values.length === 0) throw new re();
    return this.values;
  }
  checkpoint() {
    return [[...this.seen], this.values];
  }
  isAvailable() {
    return this.values.length !== 0;
  }
};
function cv(e) {
  const t = new TextEncoder();
  return new ReadableStream({ async start(n) {
    try {
      for await (const s of e) {
        const r = s.params.namespace, a = r.length ? `${s.method}|${r.join("|")}` : s.method;
        n.enqueue(t.encode(`event: ${a}
data: ${JSON.stringify(s.params.data ?? {})}

`));
      }
    } catch (s) {
      n.enqueue(t.encode(`event: error
data: ${JSON.stringify({ message: String(s) })}

`));
    } finally {
      n.close();
    }
  } });
}
var lv = class {
  static subscribeTo(e, t) {
    const { key: n, tags: s } = {
      key: void 0,
      tags: void 0,
      ...t ?? {}
    };
    if (Array.isArray(e) && n !== void 0) throw new Error("Can't specify a key when subscribing to multiple channels");
    let r;
    return typeof e == "string" ? n ? r = { [n]: e } : r = [e] : r = Object.fromEntries(e.map((a) => [a, a])), new Cn({
      channels: r,
      triggers: Array.isArray(e) ? e : [e],
      tags: s
    });
  }
  /**
  * Creates a ChannelWrite that specifies how to write values to channels.
  * This is used to define how nodes send output to channels.
  *
  * @example
  * ```typescript
  * // Write to multiple channels
  * const write = Channel.writeTo(["output", "state"]);
  *
  * // Write with specific values
  * const write = Channel.writeTo(["output"], {
  *   state: "completed",
  *   result: calculateResult()
  * });
  *
  * // Write with a transformation function
  * const write = Channel.writeTo(["output"], {
  *   result: (x) => processResult(x)
  * });
  * ```
  *
  * @param channels - Array of channel names to write to
  * @param writes - Optional map of channel names to values or transformations
  * @returns A ChannelWrite object that can be used to write to the specified channels
  */
  static writeTo(e, t) {
    const n = [];
    for (const s of e) n.push({
      channel: s,
      value: ht,
      skipNone: !1
    });
    for (const [s, r] of Object.entries(t ?? {})) ae.isRunnable(r) || typeof r == "function" ? n.push({
      channel: s,
      value: ht,
      skipNone: !0,
      mapper: Ze(r)
    }) : n.push({
      channel: s,
      value: r,
      skipNone: !1
    });
    return new ge(n);
  }
}, uv = class extends ae {
  lc_namespace = ["langgraph", "pregel"];
  invoke(e, t) {
    throw new Error("Not implemented");
  }
  withConfig(e) {
    return super.withConfig(e);
  }
  stream(e, t) {
    return super.stream(e, t);
  }
}, Pu = class extends uv {
  /**
  * Name of the class when serialized
  * @internal
  */
  static lc_name() {
    return "LangGraph";
  }
  /** @internal LangChain namespace for serialization necessary because Pregel extends Runnable */
  lc_namespace = ["langgraph", "pregel"];
  /** @internal Flag indicating this is a Pregel instance - necessary for serialization */
  lg_is_pregel = !0;
  /** The nodes in the graph, mapping node names to their PregelNode instances */
  nodes;
  /** The channels in the graph, mapping channel names to their BaseChannel or ManagedValueSpec instances */
  channels;
  /**
  * The input channels for the graph. These channels receive the initial input when the graph is invoked.
  * Can be a single channel key or an array of channel keys.
  */
  inputChannels;
  /**
  * The output channels for the graph. These channels contain the final output when the graph completes.
  * Can be a single channel key or an array of channel keys.
  */
  outputChannels;
  /** Whether to automatically validate the graph structure when it is compiled. Defaults to true. */
  autoValidate = !0;
  /**
  * The streaming modes enabled for this graph. Defaults to ["values"].
  * Supported modes:
  * - "values": Streams the full state after each step
  * - "updates": Streams state updates after each step
  * - "messages": Streams messages from within nodes
  * - "custom": Streams custom events from within nodes
  * - "tools": Streams tool-call lifecycle events (on_tool_start, on_tool_event, on_tool_end, on_tool_error) from LLM tool execution
  * - "debug": Streams events related to the execution of the graph - useful for tracing & debugging graph execution
  */
  streamMode = ["values"];
  /**
  * Optional channels to stream. If not specified, all channels will be streamed.
  * Can be a single channel key or an array of channel keys.
  */
  streamChannels;
  /**
  * Optional array of node names or "all" to interrupt after executing these nodes.
  * Used for implementing human-in-the-loop workflows.
  */
  interruptAfter;
  /**
  * Optional array of node names or "all" to interrupt before executing these nodes.
  * Used for implementing human-in-the-loop workflows.
  */
  interruptBefore;
  /** Optional timeout in milliseconds for the execution of each superstep */
  stepTimeout;
  /** Whether to enable debug logging. Defaults to false. */
  debug = !1;
  /**
  * Optional checkpointer for persisting graph state.
  * When provided, saves a checkpoint of the graph state at every superstep.
  * When false or undefined, checkpointing is disabled, and the graph will not be able to save or restore state.
  */
  checkpointer;
  /** Optional retry policy for handling failures in node execution */
  retryPolicy;
  /** The default configuration for graph execution, can be overridden on a per-invocation basis */
  config;
  /**
  * Optional long-term memory store for the graph, allows for persistence & retrieval of data across threads
  */
  store;
  /**
  * Optional cache for the graph, useful for caching tasks.
  */
  cache;
  /**
  * Optional interrupt helper function.
  * @internal
  */
  userInterrupt;
  /**
  * Stream reducer factories registered at compile time.  These run
  * automatically for every `streamEvents(..., { version: "v3" })` call,
  * before any call-site transformers.
  */
  streamTransformers;
  /**
  * The trigger to node mapping for the graph run.
  * @internal
  */
  triggerToNodes = {};
  /**
  * Constructor for Pregel - meant for internal use only.
  *
  * @internal
  */
  constructor(e) {
    super(e);
    let { streamMode: t } = e;
    if (t != null && !Array.isArray(t) && (t = [t]), this.nodes = e.nodes, this.channels = e.channels, "__pregel_tasks" in this.channels && "lc_graph_name" in this.channels.__pregel_tasks && this.channels.__pregel_tasks.lc_graph_name !== "Topic") throw new Error(`Channel '${wn}' is reserved and cannot be used in the graph.`);
    this.channels[wn] = new ov({ accumulate: !1 }), this.autoValidate = e.autoValidate ?? this.autoValidate, this.streamMode = t ?? this.streamMode, this.inputChannels = e.inputChannels, this.outputChannels = e.outputChannels, this.streamChannels = e.streamChannels ?? this.streamChannels, this.interruptAfter = e.interruptAfter, this.interruptBefore = e.interruptBefore, this.stepTimeout = e.stepTimeout ?? this.stepTimeout, this.debug = e.debug ?? this.debug, this.checkpointer = e.checkpointer, this.retryPolicy = e.retryPolicy, this.config = e.config, this.store = e.store, this.cache = e.cache, this.name = e.name, this.triggerToNodes = e.triggerToNodes ?? this.triggerToNodes, this.userInterrupt = e.userInterrupt, this.streamTransformers = e.streamTransformers ?? [], this.autoValidate && this.validate();
  }
  withConfig(e) {
    const { streamTransformers: t, ...n } = e, s = oe(this.config, n), r = [...this.streamTransformers, ...t ?? []];
    return new this.constructor({
      ...this,
      config: s,
      streamTransformers: r
    });
  }
  /**
  * Validates the graph structure to ensure it is well-formed.
  * Checks for:
  * - No orphaned nodes
  * - Valid input/output channel configurations
  * - Valid interrupt configurations
  *
  * @returns this - The Pregel instance for method chaining
  * @throws {GraphValidationError} If the graph structure is invalid
  */
  validate() {
    iv({
      nodes: this.nodes,
      channels: this.channels,
      outputChannels: this.outputChannels,
      inputChannels: this.inputChannels,
      streamChannels: this.streamChannels,
      interruptAfterNodes: this.interruptAfter,
      interruptBeforeNodes: this.interruptBefore
    });
    for (const [e, t] of Object.entries(this.nodes)) for (const n of t.triggers)
      this.triggerToNodes[n] ??= [], this.triggerToNodes[n].push(e);
    return this;
  }
  /**
  * Gets a list of all channels that should be streamed.
  * If streamChannels is specified, returns those channels.
  * Otherwise, returns all channels in the graph.
  *
  * @returns Array of channel keys to stream
  */
  get streamChannelsList() {
    return Array.isArray(this.streamChannels) ? this.streamChannels : this.streamChannels ? [this.streamChannels] : Object.keys(this.channels);
  }
  /**
  * Gets the channels to stream in their original format.
  * If streamChannels is specified, returns it as-is (either single key or array).
  * Otherwise, returns all channels in the graph as an array.
  *
  * @returns Channel keys to stream, either as a single key or array
  */
  get streamChannelsAsIs() {
    return this.streamChannels ? this.streamChannels : Object.keys(this.channels);
  }
  /**
  * Gets a drawable representation of the graph structure.
  * This is an async version of getGraph() and is the preferred method to use.
  *
  * @param config - Configuration for generating the graph visualization
  * @returns A representation of the graph that can be visualized
  */
  async getGraphAsync(e) {
    return this.getGraph(e);
  }
  /**
  * Gets all subgraphs within this graph.
  * A subgraph is a Pregel instance that is nested within a node of this graph.
  *
  * @deprecated Use getSubgraphsAsync instead. The async method will become the default in the next minor release.
  * @param namespace - Optional namespace to filter subgraphs
  * @param recurse - Whether to recursively get subgraphs of subgraphs
  * @returns Generator yielding tuples of [name, subgraph]
  */
  *getSubgraphs(e, t) {
    for (const [n, s] of Object.entries(this.nodes)) {
      if (e !== void 0 && !e.startsWith(n))
        continue;
      const r = s.subgraphs?.length ? s.subgraphs : [s.bound];
      for (const a of r) {
        const i = ku(a);
        if (i !== void 0) {
          if (n === e) {
            yield [n, i];
            return;
          }
          if (e === void 0 && (yield [n, i]), t) {
            let o = e;
            e !== void 0 && (o = e.slice(n.length + 1));
            for (const [c, l] of i.getSubgraphs(o, t)) yield [`${n}|${c}`, l];
          }
        }
      }
    }
  }
  /**
  * Gets all subgraphs within this graph asynchronously.
  * A subgraph is a Pregel instance that is nested within a node of this graph.
  *
  * @param namespace - Optional namespace to filter subgraphs
  * @param recurse - Whether to recursively get subgraphs of subgraphs
  * @returns AsyncGenerator yielding tuples of [name, subgraph]
  */
  async *getSubgraphsAsync(e, t) {
    yield* this.getSubgraphs(e, t);
  }
  /**
  * Prepares a state snapshot from saved checkpoint data.
  * This is an internal method used by getState and getStateHistory.
  *
  * @param config - Configuration for preparing the snapshot
  * @param saved - Optional saved checkpoint data
  * @param subgraphCheckpointer - Optional checkpointer for subgraphs
  * @param applyPendingWrites - Whether to apply pending writes to tasks and then to channels
  * @returns A snapshot of the graph state
  * @internal
  */
  async _prepareStateSnapshot({ config: e, saved: t, subgraphCheckpointer: n, applyPendingWrites: s = !1 }) {
    if (t === void 0) return {
      values: {},
      next: [],
      config: e,
      tasks: []
    };
    const r = await Ma(this.channels, t.checkpoint, {
      saver: typeof this.checkpointer == "object" ? this.checkpointer : void 0,
      config: t.config ?? e
    });
    if (t.pendingWrites?.length) {
      const d = t.pendingWrites.filter(([h, f]) => h === Ie).map(([h, f, p]) => [String(f), p]);
      d.length > 0 && Ee(t.checkpoint, r, [{
        name: bt,
        writes: d,
        triggers: []
      }], void 0, this.triggerToNodes);
    }
    const a = Object.values(fn(t.checkpoint, t.pendingWrites, this.nodes, r, t.config, !0, {
      step: (t.metadata?.step ?? -1) + 1,
      store: this.store
    })), i = await kt(this.getSubgraphsAsync()), o = t.config.configurable?.checkpoint_ns ?? "", c = {};
    for (const d of a) {
      const h = i.find(([p]) => p === d.name);
      if (!h) continue;
      let f = `${String(d.name)}:${d.id}`;
      if (o && (f = `${o}|${f}`), n === void 0) {
        const p = { configurable: {
          thread_id: t.config.configurable?.thread_id,
          checkpoint_ns: f
        } };
        c[d.id] = p;
      } else {
        const p = { configurable: {
          [Ke]: n,
          thread_id: t.config.configurable?.thread_id,
          checkpoint_ns: f
        } }, m = h[1];
        c[d.id] = await m.getState(p, { subgraphs: !0 });
      }
    }
    if (s && t.pendingWrites?.length) {
      const d = Object.fromEntries(a.map((f) => [f.id, f]));
      for (const [f, p, m] of t.pendingWrites)
        [
          "__error__",
          "__interrupt__",
          $s
        ].includes(p) || f in d && d[f].writes.push([String(p), m]);
      const h = a.filter((f) => f.writes.length > 0);
      h.length > 0 && Ee(t.checkpoint, r, h, void 0, this.triggerToNodes);
    }
    let l = t?.metadata;
    l && t?.config?.configurable?.thread_id && (l = {
      ...l,
      thread_id: t.config.configurable.thread_id
    });
    const u = a.filter((d) => d.writes.length === 0).map((d) => d.name);
    return {
      values: Xt(r, this.streamChannelsAsIs),
      next: u,
      tasks: Tu(a, t?.pendingWrites ?? [], c, this.streamChannelsAsIs),
      metadata: l,
      config: Lt(t.config, t.metadata),
      createdAt: t.checkpoint.ts,
      parentConfig: t.parentConfig
    };
  }
  /**
  * Gets the current state of the graph.
  * Requires a checkpointer to be configured.
  *
  * @param config - Configuration for retrieving the state
  * @param options - Additional options
  * @returns A snapshot of the current graph state
  * @throws {GraphValueError} If no checkpointer is configured
  */
  async getState(e, t) {
    const n = e.configurable?.__pregel_checkpointer ?? this.checkpointer;
    if (!n) throw new Un("No checkpointer set", { lc_error_code: "MISSING_CHECKPOINTER" });
    const s = e.configurable?.checkpoint_ns ?? "";
    if (s !== "" && e.configurable?.__pregel_read === void 0 && e.configurable?.__pregel_checkpointer === void 0) {
      const i = jr(s);
      for await (const [o, c] of this.getSubgraphsAsync(i, !0)) if (o === i) return await c.getState(sn(e, { [Ke]: n }), { subgraphs: t?.subgraphs });
    }
    const r = oe(this.config, e), a = await n.getTuple(e);
    return await this._prepareStateSnapshot({
      config: r,
      saved: a,
      subgraphCheckpointer: t?.subgraphs ? n : void 0,
      applyPendingWrites: !e.configurable?.checkpoint_id
    });
  }
  /**
  * Gets the history of graph states.
  * Requires a checkpointer to be configured.
  * Useful for:
  * - Debugging execution history
  * - Implementing time travel
  * - Analyzing graph behavior
  *
  * @param config - Configuration for retrieving the history
  * @param options - Options for filtering the history
  * @returns An async iterator of state snapshots
  * @throws {Error} If no checkpointer is configured
  */
  async *getStateHistory(e, t) {
    const n = e.configurable?.__pregel_checkpointer ?? this.checkpointer;
    if (!n) throw new Un("No checkpointer set", { lc_error_code: "MISSING_CHECKPOINTER" });
    const s = e.configurable?.checkpoint_ns ?? "";
    if (s !== "" && e.configurable?.__pregel_checkpointer === void 0) {
      const a = jr(s);
      for await (const [i, o] of this.getSubgraphsAsync(a, !0)) if (i === a) {
        yield* o.getStateHistory(sn(e, { [Ke]: n }), t);
        return;
      }
    }
    const r = oe(this.config, e, { configurable: { checkpoint_ns: s } });
    for await (const a of n.list(r, t)) yield this._prepareStateSnapshot({
      config: a.config,
      saved: a
    });
  }
  /**
  * Apply updates to the graph state in bulk.
  * Requires a checkpointer to be configured.
  *
  * This method is useful for recreating a thread
  * from a list of updates, especially if a checkpoint
  * is created as a result of multiple tasks.
  *
  * @internal The API might change in the future.
  *
  * @param startConfig - Configuration for the update
  * @param updates - The list of updates to apply to graph state
  * @returns Updated configuration
  * @throws {GraphValueError} If no checkpointer is configured
  * @throws {InvalidUpdateError} If the update cannot be attributed to a node or an update can be only applied in sequence.
  */
  async bulkUpdateState(e, t) {
    const n = e.configurable?.__pregel_checkpointer ?? this.checkpointer;
    if (!n) throw new Un("No checkpointer set", { lc_error_code: "MISSING_CHECKPOINTER" });
    if (t.length === 0) throw new Error("No supersteps provided");
    if (t.some((i) => i.updates.length === 0)) throw new Error("No updates provided");
    const s = e.configurable?.checkpoint_ns ?? "";
    if (s !== "" && e.configurable?.__pregel_checkpointer === void 0) {
      const i = jr(s);
      for await (const [, o] of this.getSubgraphsAsync(i, !0)) return await o.bulkUpdateState(sn(e, { [Ke]: n }), t);
      throw new Error(`Subgraph "${i}" not found`);
    }
    const r = async (i, o) => {
      const c = this.config ? oe(this.config, i) : i, l = await n.getTuple(c), u = l !== void 0 ? bn(l.checkpoint) : sr(), d = { ...l?.checkpoint.channel_versions }, h = l?.metadata?.step ?? -1;
      let f = sn(c, { checkpoint_ns: c.configurable?.checkpoint_ns ?? "" }), p = c.metadata ?? {};
      l?.config.configurable && (f = sn(c, l.config.configurable), p = {
        ...l.metadata,
        ...p
      });
      const { values: m, asNode: g } = o[0];
      if (m == null && g === void 0) {
        if (o.length > 1) throw new z("Cannot create empty checkpoint with multiple updates");
        return Lt(await n.put(f, Vt(u, void 0, h), {
          source: "update",
          step: h + 1,
          parents: l?.metadata?.parents ?? {}
        }, {}), l ? l.metadata : void 0);
      }
      const y = await Ma(this.channels, u, {
        saver: n,
        config: l?.config ?? f
      });
      if (m === null && g === "__end__") {
        if (o.length > 1) throw new z("Cannot apply multiple updates when clearing state");
        if (l) {
          const w = fn(u, l.pendingWrites || [], this.nodes, y, l.config, !0, {
            step: (l.metadata?.step ?? -1) + 1,
            checkpointer: n,
            store: this.store
          }), C = (l.pendingWrites || []).filter((O) => O[0] === Ie).map((O) => O.slice(1));
          C.length > 0 && Ee(u, y, [{
            name: bt,
            writes: C,
            triggers: []
          }], n.getNextVersion.bind(n), this.triggerToNodes);
          for (const [O, A, B] of l.pendingWrites || [])
            [
              "__error__",
              "__interrupt__",
              $s
            ].includes(A) || O in w && w[O].writes.push([A, B]);
          Ee(u, y, Object.values(w), n.getNextVersion.bind(n), this.triggerToNodes);
        }
        return Lt(await n.put(f, Vt(u, y, h), {
          ...p,
          source: "update",
          step: h + 1,
          parents: l?.metadata?.parents ?? {}
        }, Us(d, u.channel_versions)), l ? l.metadata : void 0);
      }
      if (g === "__copy__") {
        if (o.length > 1) throw new z("Cannot copy checkpoint with multiple updates");
        if (l == null) throw new z("Cannot copy a non-existent checkpoint");
        const w = (A) => !Array.isArray(A) || A.length === 0 ? !1 : A.every((B) => Array.isArray(B) && B.length === 2), C = Vt(u, void 0, h), O = await n.put(l.parentConfig ?? sn(l.config, { checkpoint_id: void 0 }), C, {
          source: "fork",
          step: h + 1,
          parents: l.metadata?.parents ?? {}
        }, {});
        if (w(m)) {
          const A = fn(C, l.pendingWrites, this.nodes, y, O, !1, { step: h + 2 }), B = Object.values(A).reduce((P, { name: T, id: N }) => (P[T] ??= [], P[T].push({ id: N }), P), {}), k = m.reduce((P, T) => {
            const [N, $] = T;
            P[$] ??= [];
            const S = P[$].length, E = B[$]?.[S]?.id;
            return P[$].push({
              values: N,
              asNode: $,
              taskId: E
            }), P;
          }, {});
          return r(Lt(O, l.metadata), Object.values(k).flat());
        }
        return Lt(O, l.metadata);
      }
      if (g === "__input__") {
        if (o.length > 1) throw new z("Cannot apply multiple updates when updating as input");
        const w = await kt(Cu(this.inputChannels, m));
        if (w.length === 0) throw new z(`Received no input writes for ${JSON.stringify(this.inputChannels, null, 2)}`);
        Ee(u, y, [{
          name: bt,
          writes: w,
          triggers: []
        }], n.getNextVersion.bind(this.checkpointer), this.triggerToNodes);
        const C = l?.metadata?.step != null ? l.metadata.step + 1 : -1, O = await n.put(f, Vt(u, y, C), {
          source: "input",
          step: C,
          parents: l?.metadata?.parents ?? {}
        }, Us(d, u.channel_versions));
        return await n.putWrites(O, w, Ut(bt, u.id)), Lt(O, l ? l.metadata : void 0);
      }
      if (c.configurable?.checkpoint_id === void 0 && l?.pendingWrites !== void 0 && l.pendingWrites.length > 0) {
        const w = fn(u, l.pendingWrites, this.nodes, y, l.config, !0, {
          store: this.store,
          checkpointer: this.checkpointer,
          step: (l.metadata?.step ?? -1) + 1
        }), C = (l.pendingWrites ?? []).filter((A) => A[0] === Ie).map((A) => A.slice(1));
        C.length > 0 && Ee(l.checkpoint, y, [{
          name: bt,
          writes: C,
          triggers: []
        }], void 0, this.triggerToNodes);
        for (const [A, B, k] of l.pendingWrites)
          [
            "__error__",
            "__interrupt__",
            $s
          ].includes(B) || w[A] === void 0 || w[A].writes.push([B, k]);
        const O = Object.values(w).filter((A) => A.writes.length > 0);
        O.length > 0 && Ee(u, y, O, void 0, this.triggerToNodes);
      }
      const _ = Object.values(u.versions_seen).map((w) => Object.values(w)).flat().find((w) => !!w), b = [];
      if (o.length === 1) {
        let { values: w, asNode: C, taskId: O } = o[0];
        if (C === void 0 && Object.keys(this.nodes).length === 1) [C] = Object.keys(this.nodes);
        else if (C === void 0 && _ === void 0)
          typeof this.inputChannels == "string" && this.nodes[this.inputChannels] !== void 0 && (C = this.inputChannels);
        else if (C === void 0) {
          const A = Object.entries(u.versions_seen).map(([B, k]) => Object.values(k).map((P) => [P, B])).flat().filter(([B, k]) => k !== ne).sort(([B], [k]) => zl(B, k));
          A && (A.length === 1 ? C = A[0][1] : A[A.length - 1][0] !== A[A.length - 2][0] && (C = A[A.length - 1][1]));
        }
        if (C === void 0) throw new z('Ambiguous update, specify "asNode"');
        b.push({
          values: w,
          asNode: C,
          taskId: O
        });
      } else for (const { asNode: w, values: C, taskId: O } of o) {
        if (w == null) throw new z('"asNode" is required when applying multiple updates');
        b.push({
          values: C,
          asNode: w,
          taskId: O
        });
      }
      const v = [];
      for (const { asNode: w, values: C, taskId: O } of b) {
        if (this.nodes[w] === void 0) throw new z(`Node "${w.toString()}" does not exist`);
        const A = this.nodes[w].getWriters();
        if (!A.length) throw new z(`No writers found for node "${w.toString()}"`);
        v.push({
          name: w,
          input: C,
          proc: A.length > 1 ? pt.from(A, { omitSequenceTags: !0 }) : A[0],
          writes: [],
          triggers: [ne],
          id: O ?? Ut("__interrupt__", u.id),
          writers: []
        });
      }
      for (const w of v) await w.proc.invoke(w.input, _e({
        ...c,
        store: c?.store ?? this.store
      }, {
        runName: c.runName ?? `${this.getName()}UpdateState`,
        configurable: {
          [De]: (C) => w.writes.push(...C),
          [Qe]: (C, O = !1) => Wn(u, y, w, C, O)
        }
      }));
      for (const w of v) {
        const C = w.writes.filter((O) => O[0] !== Oe);
        l !== void 0 && C.length > 0 && await n.putWrites(f, C, w.id);
      }
      Ee(u, y, v, n.getNextVersion.bind(this.checkpointer), this.triggerToNodes);
      const M = Us(d, u.channel_versions), I = await n.put(f, Vt(u, y, h + 1), {
        source: "update",
        step: h + 1,
        parents: l?.metadata?.parents ?? {}
      }, M);
      for (const w of v) {
        const C = w.writes.filter((O) => O[0] === Oe);
        C.length > 0 && await n.putWrites(I, C, w.id);
      }
      return Lt(I, l ? l.metadata : void 0);
    };
    let a = e;
    for (const { updates: i } of t) a = await r(a, i);
    return a;
  }
  /**
  * Updates the state of the graph with new values.
  * Requires a checkpointer to be configured.
  *
  * This method can be used for:
  * - Implementing human-in-the-loop workflows
  * - Modifying graph state during breakpoints
  * - Integrating external inputs into the graph
  *
  * @param inputConfig - Configuration for the update
  * @param values - The values to update the state with
  * @param asNode - Optional node name to attribute the update to
  * @returns Updated configuration
  * @throws {GraphValueError} If no checkpointer is configured
  * @throws {InvalidUpdateError} If the update cannot be attributed to a node
  */
  async updateState(e, t, n) {
    return this.bulkUpdateState(e, [{ updates: [{
      values: t,
      asNode: n
    }] }]);
  }
  /**
  * Gets the default values for various graph configuration options.
  * This is an internal method used to process and normalize configuration options.
  *
  * @param config - The input configuration options
  * @returns A tuple containing normalized values for:
  * - debug mode
  * - stream modes
  * - input keys
  * - output keys
  * - remaining config
  * - interrupt before nodes
  * - interrupt after nodes
  * - checkpointer
  * - store
  * - whether stream mode is single
  * - node cache
  * - whether checkpoint during is enabled
  * @internal
  */
  _defaults(e) {
    const { debug: t, streamMode: n, inputKeys: s, outputKeys: r, interruptAfter: a, interruptBefore: i, ...o } = e;
    let c = !0;
    const l = t !== void 0 ? t : this.debug;
    let u = r;
    u === void 0 ? u = this.streamChannelsAsIs : Io(u, this.channels);
    let d = s;
    d === void 0 ? d = this.inputChannels : Io(d, this.channels);
    const h = i ?? this.interruptBefore ?? [], f = a ?? this.interruptAfter ?? [];
    let p;
    n !== void 0 ? (p = Array.isArray(n) ? n : [n], c = typeof n == "string") : (e.configurable?.__pregel_task_id !== void 0 ? p = ["values"] : p = this.streamMode, c = !0);
    let m;
    if (this.checkpointer === !1) m = void 0;
    else if (e !== void 0 && e.configurable?.__pregel_checkpointer !== void 0) m = e.configurable[Ke];
    else {
      if (this.checkpointer === !0) throw new Error("checkpointer: true cannot be used for root graphs.");
      m = this.checkpointer;
    }
    const g = e.store ?? this.store, y = e.cache ?? this.cache;
    if (e.durability != null && e.checkpointDuring != null) throw new Error("Cannot use both `durability` and `checkpointDuring` at the same time.");
    const _ = (() => {
      if (e.checkpointDuring != null)
        return e.checkpointDuring === !1 ? "exit" : "async";
    })(), b = e.durability ?? _ ?? e?.configurable?.__pregel_durability ?? "async";
    return [
      l,
      p,
      d,
      u,
      o,
      h,
      f,
      m,
      g,
      c,
      y,
      b
    ];
  }
  /**
  * Streams the execution of the graph, emitting state updates as they occur.
  * This is the primary method for observing graph execution in real-time.
  *
  * Stream modes:
  * - "values": Emits complete state after each step
  * - "updates": Emits only state changes after each step
  * - "debug": Emits detailed debug information
  * - "messages": Emits messages from within nodes
  * - "custom": Emits custom events from within nodes
  * - "checkpoints": Emits checkpoints from within nodes
  * - "tasks": Emits tasks from within nodes
  *
  * @param input - The input to start graph execution with
  * @param options - Configuration options for streaming
  * @returns An async iterable stream of graph state updates
  */
  async stream(e, t) {
    const n = new AbortController(), s = Oa()?.configurable;
    s?.__pregel_read !== void 0 && t?.configurable?.__pregel_read === void 0 && (t = {
      ...t,
      configurable: {
        ...s,
        ...t?.configurable
      }
    });
    const r = {
      recursionLimit: this.config?.recursionLimit,
      ...t,
      signal: rs(t?.signal, n.signal).signal
    }, a = await super.stream(e, r);
    return new Hr(t?.encoding === "text/event-stream" ? Vw(a) : a, n);
  }
  async #e(e, t) {
    const { version: n, encoding: s, transformers: r, ...a } = t, i = {
      recursionLimit: this.config?.recursionLimit,
      ...a,
      configurable: {
        ...this.config?.configurable,
        ...a?.configurable
      },
      version: n,
      streamMode: tu,
      subgraphs: !0,
      encoding: void 0
    }, o = this.stream(e, i), c = hu({ [Symbol.asyncIterator]: async function* () {
      const l = await o;
      for await (const u of l) yield u;
    } }, [...this.streamTransformers ?? [], ...r ?? []]);
    if (s === "text/event-stream") {
      const l = new AbortController();
      return l.signal.addEventListener("abort", () => c.abort(l.signal.reason), { once: !0 }), new Hr(cv(c), l);
    }
    return c;
  }
  streamEvents(e, t, n) {
    if (t.version === "v3") return this.#e(e, t);
    const s = new AbortController(), r = {
      recursionLimit: this.config?.recursionLimit,
      ...t,
      signal: rs(t?.signal, s.signal).signal
    };
    return new Hr(super.streamEvents(e, r, n), s);
  }
  /**
  * Validates the input for the graph.
  * @param input - The input to validate
  * @returns The validated input
  * @internal
  */
  async _validateInput(e) {
    return e;
  }
  /**
  * Validates the context options for the graph.
  * @param context - The context options to validate
  * @returns The validated context options
  * @internal
  */
  async _validateContext(e) {
    return e;
  }
  /**
  * Internal iterator used by stream() to generate state updates.
  * This method handles the core logic of graph execution and streaming.
  *
  * @param input - The input to start graph execution with
  * @param options - Configuration options for streaming
  * @returns AsyncGenerator yielding state updates
  * @internal
  */
  async *_streamIterator(e, t) {
    const n = "version" in (t ?? {}) ? void 0 : t?.encoding ?? void 0, s = t?.subgraphs, r = t?.version === "v3", a = Fi(this.config, t);
    if (a.recursionLimit === void 0 || a.recursionLimit < 1) throw new Error('Passed "recursionLimit" must be at least 1.');
    if (this.checkpointer !== void 0 && this.checkpointer !== !1 && a.configurable === void 0) throw new Error('Checkpointer requires one or more of the following "configurable" keys: "thread_id", "checkpoint_ns", "checkpoint_id"');
    const i = await this._validateInput(e), { runId: o, ...c } = a, [l, u, , d, h, f, p, m, g, y, _, b] = this._defaults(c);
    h.metadata = {
      ls_integration: "langgraph",
      ...h.metadata
    }, typeof h.context < "u" ? h.context = await this._validateContext(h.context) : h.configurable = await this._validateContext(h.configurable);
    const v = new xu({ modes: new Set(u) });
    if (this.checkpointer === !0) {
      h.configurable ??= {};
      const k = h.configurable.checkpoint_ns ?? "";
      h.configurable[Ge] = k.split("|").map((P) => P.split(":")[0]).join("|");
    }
    if (u.includes("messages")) {
      const k = r ? new Yw((T) => v.push(T)) : new Kw((T) => v.push(T)), { callbacks: P } = h;
      if (P === void 0) h.callbacks = [k];
      else if (Array.isArray(P)) h.callbacks = P.concat(k);
      else {
        const T = P.copy();
        T.addHandler(k, !0), h.callbacks = T;
      }
    }
    if (u.includes("tools")) {
      const k = new Lw((T) => v.push(T)), { callbacks: P } = h;
      if (P === void 0) h.callbacks = [k];
      else if (Array.isArray(P)) h.callbacks = P.concat(k);
      else {
        const T = P.copy();
        T.addHandler(k, !0), h.callbacks = T;
      }
    }
    h.writer ??= (k) => {
      if (!u.includes("custom")) return;
      const P = Oa()?.configurable?.[Ge]?.split("|").slice(0, -1);
      v.push([
        P ?? [],
        "custom",
        k
      ]);
    }, h.interrupt ??= this.userInterrupt ?? wu, h.serverInfo == null && (h.serverInfo = hv(h)), h.control ??= new eu();
    const M = { tracerInheritableMetadata: pv(h) }, I = await (await Gt._configureSync(h?.callbacks, void 0, h?.tags, void 0, h?.metadata, void 0, M))?.handleChainStart(this.toJSON(), mw(e, "input"), o, void 0, void 0, void 0, h?.runName ?? this.getName()), w = kr(this.channels);
    let C, O;
    const B = (async () => {
      try {
        C = await Gw.initialize({
          input: i,
          config: h,
          checkpointer: m,
          nodes: this.nodes,
          channelSpecs: w,
          outputKeys: d,
          streamKeys: this.streamChannelsAsIs,
          store: g,
          cache: _,
          stream: v,
          interruptAfter: p,
          interruptBefore: f,
          manager: I,
          debug: this.debug,
          triggerToNodes: this.triggerToNodes,
          durability: b
        });
        const k = new av({
          loop: C,
          nodeFinished: h.configurable?.[fm]
        });
        t?.subgraphs && (C.config.configurable = {
          ...C.config.configurable,
          [mi]: C.stream
        }), await this._runLoop({
          loop: C,
          runner: k,
          debug: l,
          config: h
        }), b === "sync" && await Promise.all(C?.checkpointerPromises ?? []);
      } catch (k) {
        O = k;
      } finally {
        try {
          C && (await C.store?.stop(), await C.cache?.stop()), await Promise.all(C?.checkpointerPromises ?? []);
        } catch (k) {
          O = O ?? k;
        }
        O ? (await new Promise((k) => {
          queueMicrotask(k);
        }), v.error(O)) : v.close();
      }
    })();
    try {
      for await (const k of v) {
        if (k === void 0) throw new Error("Data structure error.");
        const [P, T, N] = k, $ = "version" in (t ?? {});
        if (u.includes(T) || T === "checkpoints" && Cr(N) && (r || $ && s && u.includes("values"))) {
          if (n === "text/event-stream") {
            s ? yield [
              P,
              T,
              N
            ] : yield [
              null,
              T,
              N
            ];
            continue;
          }
          s && !y ? yield [
            P,
            T,
            N
          ] : y ? s ? yield [P, N] : yield N : yield [T, N];
        }
      }
    } catch (k) {
      throw await I?.handleChainError(O), k;
    } finally {
      await B;
    }
    await I?.handleChainEnd(C?.output ?? {}, o, void 0, void 0, void 0);
  }
  /**
  * Run the graph with a single input and config.
  * @param input The input to the graph.
  * @param options The configuration to use for the run.
  */
  async invoke(e, t) {
    const n = t?.streamMode ?? "values", s = {
      ...t,
      outputKeys: t?.outputKeys ?? this.outputChannels,
      streamMode: n,
      encoding: void 0
    }, r = [], a = await this.stream(e, s), i = [];
    let o;
    for await (const c of a) n === "values" ? yr(c) ? i.push(c[ne]) : o = c : r.push(c);
    if (n === "values") {
      if (i.length > 0) {
        const c = i.flat(1);
        if (o == null) return { [ne]: c };
        if (typeof o == "object") return {
          ...o,
          [ne]: c
        };
      }
      return o;
    }
    return r;
  }
  async _runLoop(e) {
    const { loop: t, runner: n, debug: s, config: r } = e;
    let a;
    try {
      for (; await t.tick({ inputKeys: this.inputChannels }); ) {
        for (const { task: i } of await t._matchCachedWrites()) t._outputWrites(i.id, i.writes, !0);
        s && $w(t.checkpointMetadata.step, t.channels, this.streamChannelsList), s && Ba(t.step, Object.values(t.tasks)), await n.tick({
          timeout: this.stepTimeout,
          retryPolicy: this.retryPolicy,
          onStepWrite: (i, o) => {
            s && jw(i, o, this.streamChannelsList);
          },
          maxConcurrency: r.maxConcurrency,
          signal: r.signal
        });
      }
      if (t.status === "draining")
        throw t.control == null ? new Error("Draining status requires run control") : new yi(t.control.drainReason ?? "shutdown");
      if (t.status === "out_of_steps") throw new Ec([
        `Recursion limit of ${r.recursionLimit} reached`,
        "without hitting a stop condition. You can increase the",
        'limit by setting the "recursionLimit" config key.'
      ].join(" "), { lc_error_code: "GRAPH_RECURSION_LIMIT" });
    } catch (i) {
      if (a = i, !await t.finishAndHandleError(a)) throw i;
    } finally {
      a === void 0 && await t.finishAndHandleError();
    }
  }
  async clearCache() {
    await this.cache?.clear([]);
  }
};
function hv(e) {
  const t = e.metadata ?? {}, n = e.configurable ?? {}, s = n.assistant_id ?? t.assistant_id, r = n.graph_id ?? t.graph_id, a = n.langgraph_auth_user;
  let i;
  if (a != null && typeof a == "object" && "identity" in a && (i = a), s != null || r != null || i != null) return {
    assistantId: s != null ? String(s) : "",
    graphId: r != null ? String(r) : "",
    user: i
  };
}
const dv = /* @__PURE__ */ new Set([
  "key",
  "token",
  "secret",
  "password",
  "auth"
]);
function fv(e, t) {
  const n = e.toLowerCase();
  let s = !1;
  for (const r of dv) if (n.includes(r)) {
    s = !0;
    break;
  }
  return e.startsWith("__") || !(typeof t == "string" || typeof t == "number" || typeof t == "boolean") || s;
}
function pv(e) {
  const t = e.configurable;
  if (!t) return;
  const n = {};
  for (const [s, r] of Object.entries(t))
    fv(s, r) || (n[s] = r);
  return Object.keys(n).length > 0 ? n : void 0;
}
var Qt = class Nu extends st {
  lc_graph_name = "EphemeralValue";
  guard;
  value = [];
  constructor(t = !0) {
    super(), this.guard = t;
  }
  fromCheckpoint(t) {
    const n = new Nu(this.guard);
    return typeof t < "u" && (n.value = [t]), n;
  }
  update(t) {
    if (t.length === 0) {
      const n = this.value.length > 0;
      return this.value = [], n;
    }
    if (t.length !== 1 && this.guard) throw new z("EphemeralValue can only receive one value per step.");
    return this.value = [t[t.length - 1]], !0;
  }
  get() {
    if (this.value.length === 0) throw new re();
    return this.value[0];
  }
  checkpoint() {
    if (this.value.length === 0) throw new re();
    return this.value[0];
  }
  isAvailable() {
    return this.value.length !== 0;
  }
}, Ru = class {
  path;
  ends;
  constructor(e) {
    ae.isRunnable(e.path) ? this.path = e.path : this.path = Ze(e.path), this.ends = Array.isArray(e.pathMap) ? e.pathMap.reduce((t, n) => (t[n] = n, t), {}) : e.pathMap;
  }
  run(e, t) {
    return ge.registerWriter(new Ne({
      name: "<branch_run>",
      trace: !1,
      func: async (n, s) => {
        try {
          return await this._route(n, s, e, t);
        } catch (r) {
          throw r.name === _i.unminifiable_name && console.warn(`[WARN]: 'NodeInterrupt' thrown in conditional edge. This is likely a bug in your graph implementation.
NodeInterrupt should only be thrown inside a node, not in edge conditions.`), r;
        }
      }
    }));
  }
  async _route(e, t, n, s) {
    let r = await this.path.invoke(s ? s(t) : e, t);
    Array.isArray(r) || (r = [r]);
    let a;
    if (this.ends ? a = r.map((i) => Me(i) ? i : this.ends[i]) : a = r, a.some((i) => !i)) throw new Error("Branch condition returned unknown or null destination");
    if (a.filter(Me).some((i) => i.node === "__end__")) throw new z("Cannot send a packet to the END node");
    return await n(a, t) ?? e;
  }
}, $u = class {
  nodes;
  edges;
  branches;
  entryPoint;
  compiled = !1;
  constructor() {
    this.nodes = {}, this.edges = /* @__PURE__ */ new Set(), this.branches = {};
  }
  warnIfCompiled(e) {
    this.compiled && console.warn(e);
  }
  get allEdges() {
    return this.edges;
  }
  addNode(...e) {
    function t(s) {
      return s.length >= 1 && typeof s[0] != "string";
    }
    const n = t(e) ? Array.isArray(e[0]) ? e[0] : Object.entries(e[0]) : [[
      e[0],
      e[1],
      e[2]
    ]];
    if (n.length === 0) throw new Error("No nodes provided in `addNode`");
    for (const [s, r, a] of n) {
      for (const o of ["|", ":"]) if (s.includes(o)) throw new Error(`"${o}" is a reserved character and is not allowed in node names.`);
      if (this.warnIfCompiled("Adding a node to a graph that has already been compiled. This will not be reflected in the compiled graph."), s in this.nodes) throw new Error(`Node \`${s}\` already present.`);
      if (s === "__end__") throw new Error(`Node \`${s}\` is reserved.`);
      const i = Ze(r);
      this.nodes[s] = {
        runnable: i,
        metadata: a?.metadata,
        subgraphs: Ui(i) ? [i] : a?.subgraphs,
        ends: a?.ends
      };
    }
    return this;
  }
  addEdge(e, t) {
    if (this.warnIfCompiled("Adding an edge to a graph that has already been compiled. This will not be reflected in the compiled graph."), e === "__end__") throw new Error("END cannot be a start node");
    if (t === "__start__") throw new Error("START cannot be an end node");
    if (Array.from(this.edges).some(([n]) => n === e) && !("channels" in this)) throw new Error(`Already found path for ${e}. For multiple edges, use StateGraph.`);
    return this.edges.add([e, t]), this;
  }
  addConditionalEdges(e, t, n) {
    const s = typeof e == "object" ? e : {
      source: e,
      path: t,
      pathMap: n
    };
    this.warnIfCompiled("Adding an edge to a graph that has already been compiled. This will not be reflected in the compiled graph."), ae.isRunnable(s.path) || (s.path = Ze(s.path));
    const r = s.path.getName() === "RunnableLambda" ? "condition" : s.path.getName();
    if (this.branches[s.source] && this.branches[s.source][r]) throw new Error(`Condition \`${r}\` already present for node \`${e}\``);
    return this.branches[s.source] ??= {}, this.branches[s.source][r] = new Ru(s), this;
  }
  /**
  * @deprecated use `addEdge(START, key)` instead
  */
  setEntryPoint(e) {
    return this.warnIfCompiled("Setting the entry point of a graph that has already been compiled. This will not be reflected in the compiled graph."), this.addEdge(te, e);
  }
  /**
  * @deprecated use `addEdge(key, END)` instead
  */
  setFinishPoint(e) {
    return this.warnIfCompiled("Setting a finish point of a graph that has already been compiled. This will not be reflected in the compiled graph."), this.addEdge(e, D);
  }
  compile({ checkpointer: e, interruptBefore: t, interruptAfter: n, name: s, transformers: r } = {}) {
    this.validate([...Array.isArray(t) ? t : [], ...Array.isArray(n) ? n : []]);
    const a = new ju({
      builder: this,
      checkpointer: e,
      interruptAfter: n,
      interruptBefore: t,
      autoValidate: !1,
      nodes: {},
      channels: {
        [te]: new Qt(),
        [D]: new Qt()
      },
      inputChannels: te,
      outputChannels: D,
      streamChannels: [],
      streamMode: "values",
      name: s,
      streamTransformers: r
    });
    for (const [i, o] of Object.entries(this.nodes)) a.attachNode(i, o);
    for (const [i, o] of this.edges) a.attachEdge(i, o);
    for (const [i, o] of Object.entries(this.branches)) for (const [c, l] of Object.entries(o)) a.attachBranch(i, c, l);
    return a.validate();
  }
  validate(e) {
    const t = new Set([...this.allEdges].map(([s, r]) => s));
    for (const [s] of Object.entries(this.branches)) t.add(s);
    for (const s of t) if (s !== "__start__" && !(s in this.nodes)) throw new Error(`Found edge starting at unknown node \`${s}\``);
    const n = new Set([...this.allEdges].map(([s, r]) => r));
    for (const [s, r] of Object.entries(this.branches)) for (const a of Object.values(r)) if (a.ends != null) for (const i of Object.values(a.ends)) n.add(i);
    else {
      n.add(D);
      for (const i of Object.keys(this.nodes)) i !== s && n.add(i);
    }
    for (const s of Object.values(this.nodes)) for (const r of s.ends ?? []) n.add(r);
    if (Object.values(this.nodes).some((s) => s.isErrorHandler)) for (const s of Object.keys(this.nodes)) n.add(s);
    for (const s of Object.keys(this.nodes))
      if (!this.nodes[s].isErrorHandler && !n.has(s))
        throw new xc([
          `Node \`${s}\` is not reachable.`,
          "",
          "If you are returning Command objects from your node,",
          'make sure you are passing names of potential destination nodes as an "ends" array',
          'into ".addNode(..., { ends: ["node1", "node2"] })".'
        ].join(`
`), { lc_error_code: "UNREACHABLE_NODE" });
    for (const s of n) if (s !== "__end__" && !(s in this.nodes)) throw new Error(`Found edge ending at unknown node \`${s}\``);
    if (e) {
      for (const s of e) if (!(s in this.nodes)) throw new Error(`Interrupt node \`${s}\` is not present`);
    }
    this.compiled = !0;
  }
}, ju = class extends Pu {
  builder;
  constructor({ builder: e, ...t }) {
    super(t), this.builder = e;
  }
  withConfig(e) {
    return super.withConfig(e);
  }
  attachNode(e, t) {
    this.channels[e] = new Qt(), this.nodes[e] = new Cn({
      channels: [],
      triggers: [],
      metadata: t.metadata,
      subgraphs: t.subgraphs,
      ends: t.ends
    }).pipe(t.runnable).pipe(new ge([{
      channel: e,
      value: ht
    }], [we])), this.streamChannels.push(e);
  }
  attachEdge(e, t) {
    if (t === "__end__") {
      if (e === "__start__") throw new Error("Cannot have an edge from START to END");
      this.nodes[e].writers.push(new ge([{
        channel: D,
        value: ht
      }], [we]));
    } else
      this.nodes[t].triggers.push(e), this.nodes[t].channels.push(e);
  }
  attachBranch(e, t, n) {
    e === "__start__" && !this.nodes.__start__ && (this.nodes[te] = lv.subscribeTo(te, { tags: [we] })), this.nodes[e].pipe(n.run((r) => new ge(r.map((a) => Me(a) ? a : {
      channel: a === "__end__" ? D : `branch:${e}:${t}:${a}`,
      value: ht
    }), [we])));
    const s = n.ends ? Object.values(n.ends) : Object.keys(this.nodes);
    for (const r of s) if (r !== "__end__") {
      const a = `branch:${e}:${t}:${r}`;
      this.channels[a] = new Qt(), this.nodes[r].triggers.push(a), this.nodes[r].channels.push(a);
    }
  }
  /**
  * Returns a drawable representation of the computation graph.
  */
  async getGraphAsync(e) {
    const t = e?.xray, n = new to(), s = { [te]: n.addNode({ schema: un() }, te) }, r = {};
    let a = {};
    t && (a = Object.fromEntries((await kt(this.getSubgraphsAsync())).filter((l) => Ao(l[1]))));
    const i = [];
    function o(l, u, d, h = !1) {
      if (u === "__end__" && r.__end__ === void 0 && (r[D] = n.addNode({ schema: un() }, D)), s[l] !== void 0) {
        if (r[u] === void 0) throw new Error(`End node ${u} not found!`);
        return i.push({
          src: l,
          dest: u,
          conditional: h
        }), n.addEdge(s[l], r[u], d !== u ? d : void 0, h);
      }
    }
    for (const [l, u] of Object.entries(this.builder.nodes)) {
      const d = ie(l), h = u.runnable, f = u.metadata ?? {};
      if (this.interruptBefore?.includes(l) && this.interruptAfter?.includes(l) ? f.__interrupt = "before,after" : this.interruptBefore?.includes(l) ? f.__interrupt = "before" : this.interruptAfter?.includes(l) && (f.__interrupt = "after"), t) {
        const p = typeof t == "number" ? t - 1 : t, m = a[l] !== void 0 ? await a[l].getGraphAsync({
          ...e,
          xray: p
        }) : h.getGraph(e);
        if (m.trimFirstNode(), m.trimLastNode(), Object.keys(m.nodes).length > 1) {
          let _ = function(v) {
            return v ? v.lc_runnable : !1;
          }, b = function(v, M) {
            if (v !== void 0 && !no(v)) return v;
            if (_(M)) try {
              let I = M.getName();
              return I = I.startsWith("Runnable") ? I.slice(8) : I, I;
            } catch {
              return M.getName();
            }
            else return M.name ?? "UnknownSchema";
          };
          const [g, y] = n.extend(m, d);
          if (g === void 0) throw new Error(`Could not extend subgraph "${l}" due to missing entrypoint.`);
          y !== void 0 && (s[d] = {
            name: b(y.id, y.data),
            ...y
          }), r[d] = {
            name: b(g.id, g.data),
            ...g
          };
        } else {
          const g = n.addNode(h, d, f);
          s[d] = g, r[d] = g;
        }
      } else {
        const p = n.addNode(h, d, f);
        s[d] = p, r[d] = p;
      }
    }
    const c = [...this.builder.allEdges].sort(([l], [u]) => l < u ? -1 : u > l ? 1 : 0);
    for (const [l, u] of c) o(ie(l), ie(u));
    for (const [l, u] of Object.entries(this.builder.branches)) {
      const d = {
        ...Object.fromEntries(Object.keys(this.builder.nodes).filter((h) => h !== l).map((h) => [ie(h), ie(h)])),
        [D]: D
      };
      for (const h of Object.values(u)) {
        let f;
        h.ends !== void 0 ? f = h.ends : f = d;
        for (const [p, m] of Object.entries(f)) o(ie(l), ie(m), p, !0);
      }
    }
    for (const [l, u] of Object.entries(this.builder.nodes)) if (u.ends !== void 0) for (const d of u.ends) o(ie(l), ie(d), void 0, !0);
    return Oo(this.builder.nodes, i, o), n;
  }
  /**
  * Returns a drawable representation of the computation graph.
  *
  * @deprecated Use getGraphAsync instead. The async method will be the default in the next minor core release.
  */
  getGraph(e) {
    const t = e?.xray, n = new to(), s = { [te]: n.addNode({ schema: un() }, te) }, r = {};
    let a = {};
    t && (a = Object.fromEntries(on(this.getSubgraphs()).filter((l) => Ao(l[1]))));
    const i = [];
    function o(l, u, d, h = !1) {
      if (u === "__end__" && r.__end__ === void 0 && (r[D] = n.addNode({ schema: un() }, D)), s[l] !== void 0) {
        if (r[u] === void 0) throw new Error(`End node ${u} not found!`);
        return i.push({
          src: l,
          dest: u,
          conditional: h
        }), n.addEdge(s[l], r[u], d !== u ? d : void 0, h);
      }
    }
    for (const [l, u] of Object.entries(this.builder.nodes)) {
      const d = ie(l), h = u.runnable, f = u.metadata ?? {};
      if (this.interruptBefore?.includes(l) && this.interruptAfter?.includes(l) ? f.__interrupt = "before,after" : this.interruptBefore?.includes(l) ? f.__interrupt = "before" : this.interruptAfter?.includes(l) && (f.__interrupt = "after"), t) {
        const p = typeof t == "number" ? t - 1 : t, m = a[l] !== void 0 ? a[l].getGraph({
          ...e,
          xray: p
        }) : h.getGraph(e);
        if (m.trimFirstNode(), m.trimLastNode(), Object.keys(m.nodes).length > 1) {
          let _ = function(v) {
            return v ? v.lc_runnable : !1;
          }, b = function(v, M) {
            if (v !== void 0 && !no(v)) return v;
            if (_(M)) try {
              let I = M.getName();
              return I = I.startsWith("Runnable") ? I.slice(8) : I, I;
            } catch {
              return M.getName();
            }
            else return M.name ?? "UnknownSchema";
          };
          const [g, y] = n.extend(m, d);
          if (g === void 0) throw new Error(`Could not extend subgraph "${l}" due to missing entrypoint.`);
          y !== void 0 && (s[d] = {
            name: b(y.id, y.data),
            ...y
          }), r[d] = {
            name: b(g.id, g.data),
            ...g
          };
        } else {
          const g = n.addNode(h, d, f);
          s[d] = g, r[d] = g;
        }
      } else {
        const p = n.addNode(h, d, f);
        s[d] = p, r[d] = p;
      }
    }
    const c = [...this.builder.allEdges].sort(([l], [u]) => l < u ? -1 : u > l ? 1 : 0);
    for (const [l, u] of c) o(ie(l), ie(u));
    for (const [l, u] of Object.entries(this.builder.branches)) {
      const d = {
        ...Object.fromEntries(Object.keys(this.builder.nodes).filter((h) => h !== l).map((h) => [ie(h), ie(h)])),
        [D]: D
      };
      for (const h of Object.values(u)) {
        let f;
        h.ends !== void 0 ? f = h.ends : f = d;
        for (const [p, m] of Object.entries(f)) o(ie(l), ie(m), p, !0);
      }
    }
    for (const [l, u] of Object.entries(this.builder.nodes)) if (u.ends !== void 0) for (const d of u.ends) o(ie(l), ie(d), void 0, !0);
    return Oo(this.builder.nodes, i, o), n;
  }
};
function Ao(e) {
  return typeof e.attachNode == "function" && typeof e.attachEdge == "function";
}
function ie(e) {
  return e === "subgraph" ? `"${e}"` : e;
}
function Oo(e, t, n) {
  const s = new Set(t.map((a) => a.src)), r = [...new Set(t.filter((a) => !a.conditional && a.dest !== "__end__").map((a) => a.dest))].sort();
  for (const a of r) {
    if (s.has(a)) continue;
    const i = Object.keys(e).find((o) => ie(o) === a);
    i !== void 0 && e[i]?.isErrorHandler || n(a, D);
  }
}
function Wt(e) {
  return typeof e == "object" && e !== null && "~standard" in e && typeof e["~standard"] == "object" && e["~standard"] !== null && "validate" in e["~standard"];
}
function Lu(e) {
  return typeof e == "object" && e !== null && "~standard" in e && typeof e["~standard"] == "object" && e["~standard"] !== null && "jsonSchema" in e["~standard"];
}
function mv(e) {
  return Wt(e) && Lu(e);
}
function Ft(e) {
  if (Lu(e)) try {
    return e["~standard"].jsonSchema.input({ target: "draft-07" });
  } catch {
    return;
  }
}
function wt(e) {
  if (e != null && Wt(e))
    try {
      const t = e["~standard"].validate(void 0);
      if (t && typeof t == "object" && !("then" in t && typeof t.then == "function")) {
        const n = t;
        if (!n.issues) {
          const s = n.value;
          return () => s;
        }
      }
    } catch {
    }
}
const gv = (e) => e != null && e.lc_graph_name === "DeltaChannel";
var Du = class Fu extends st {
  lc_graph_name = "DeltaChannel";
  /** `undefined` represents the Python `MISSING` sentinel (empty channel). */
  value;
  reducer;
  snapshotFrequency;
  initialValueFactory;
  constructor(t, n) {
    super();
    const s = n?.snapshotFrequency ?? 1e3;
    if (!Number.isInteger(s) || s <= 0) throw new Error(`snapshotFrequency must be a positive integer, got ${s}`);
    this.reducer = t, this.snapshotFrequency = s, this.initialValueFactory = n?.initialValueFactory ?? (() => []), this.value = void 0;
  }
  fromCheckpoint(t) {
    const n = new Fu(this.reducer, {
      snapshotFrequency: this.snapshotFrequency,
      initialValueFactory: this.initialValueFactory
    });
    return t === void 0 ? n.value = this.initialValueFactory() : Tm(t) ? n.value = t.value : n.value = t, n;
  }
  /**
  * Apply ancestor writes oldest-to-newest via a single reducer call.
  *
  * If any write is an Overwrite, the last one in the sequence acts as the
  * reset point: its value becomes the new base and only writes after it are
  * passed to the reducer.
  */
  replayWrites(t) {
    const n = t.map((i) => i[2]);
    if (n.length === 0) return;
    let s = this.value, r = 0;
    for (let i = 0; i < n.length; i += 1) {
      const [o, c] = Zt(n[i]);
      o && (s = c ?? this.initialValueFactory(), r = i + 1);
    }
    const a = n.slice(r);
    this.value = a.length > 0 ? this.reducer(s, a) : s;
  }
  update(t) {
    if (t.length === 0) return !1;
    let n, s = !1;
    for (const a of t) if (Xs(a)) {
      if (s) throw new z("Can receive only one Overwrite value per step.");
      s = !0, [, n] = Zt(a);
    }
    if (s)
      return this.value = n ?? this.initialValueFactory(), !0;
    const r = this.value === void 0 ? this.initialValueFactory() : this.value;
    return this.value = this.reducer(r, t), !0;
  }
  get() {
    if (this.value === void 0) throw new re();
    return this.value;
  }
  /**
  * Always returns `undefined` (the Python `MISSING` sentinel). Snapshot
  * decisions live in `createCheckpoint`, which has the channel version and
  * writes a {@link DeltaSnapshot} directly into `channel_values`. For
  * non-snapshot steps the channel does not appear in `channel_values`;
  * reconstruction walks ancestor writes via the saver's
  * `getDeltaChannelHistory`.
  */
  checkpoint() {
  }
  isAvailable() {
    return this.value !== void 0;
  }
  equals(t) {
    return this === t ? !0 : !gv(t) || this.snapshotFrequency !== t.snapshotFrequency ? !1 : this.reducer === t.reducer;
  }
};
const zr = /* @__PURE__ */ Symbol.for("langgraph.channel.missing");
var Vu = class Bu extends st {
  lc_graph_name = "UntrackedValue";
  /**
  * If true, throws an error when multiple values are received in a single step.
  * If false, stores the last value received.
  */
  guard;
  /**
  * The current value. MISSING sentinel indicates no value has been set.
  */
  _value = zr;
  /**
  * Optional factory function for the initial value.
  */
  initialValueFactory;
  constructor(t) {
    super(), this.guard = t?.guard ?? !0, this.initialValueFactory = t?.initialValueFactory, this.initialValueFactory && (this._value = this.initialValueFactory());
  }
  /**
  * Return a new channel, ignoring the checkpoint since we don't persist.
  * The initial value (if any) is restored.
  */
  fromCheckpoint(t) {
    return new Bu({
      guard: this.guard,
      initialValueFactory: this.initialValueFactory
    });
  }
  /**
  * Update the channel with the given values.
  * If guard is true, throws if more than one value is received.
  */
  update(t) {
    if (t.length === 0) return !1;
    if (t.length !== 1 && this.guard) throw new z("UntrackedValue(guard=true) can receive only one value per step. Use guard=false if you want to store any one of multiple values.", { lc_error_code: "INVALID_CONCURRENT_GRAPH_UPDATE" });
    return this._value = t[t.length - 1], !0;
  }
  /**
  * Get the current value.
  * @throws EmptyChannelError if no value has been set.
  */
  get() {
    if (this._value === zr) throw new re();
    return this._value;
  }
  /**
  * Always returns undefined - untracked values are never checkpointed.
  */
  checkpoint() {
  }
  /**
  * Return true if a value has been set.
  */
  isAvailable() {
    return this._value !== zr;
  }
};
const Gr = /* @__PURE__ */ Symbol.for("langgraph.state.reduced_value");
var xe = class {
  /**
  * Instance marker for runtime identification.
  * @internal
  */
  [Gr] = !0;
  /**
  * The schema that describes the type of value stored in state (i.e., after reduction).
  * Note: We use `unknown` for the input type to allow schemas with `.default()` wrappers,
  * where the input type includes `undefined`.
  */
  valueSchema;
  /**
  * The schema used to validate reducer inputs.
  * If not specified explicitly, this defaults to `valueSchema`.
  */
  inputSchema;
  /**
  * The reducer function that combines a current output value and an incoming input.
  */
  reducer;
  /**
  * Optional extra fields to merge into the generated JSON Schema (e.g., for documentation or constraints).
  */
  jsonSchemaExtra;
  constructor(e, t) {
    this.reducer = t.reducer, this.jsonSchemaExtra = t.jsonSchemaExtra, this.valueSchema = e, this.inputSchema = "inputSchema" in t ? t.inputSchema : e, this.jsonSchemaExtra = t.jsonSchemaExtra;
  }
  static isInstance(e) {
    return typeof e == "object" && e !== null && Gr in e && e[Gr] === !0;
  }
};
const Po = /* @__PURE__ */ Symbol.for("langgraph.state.untracked_value");
var Ct = class {
  /**
  * Instance marker for runtime identification.
  * @internal
  */
  [Po] = !0;
  /**
  * Optional schema describing the type and shape of the value stored in this field.
  *
  * If provided, this can be used for runtime validation or code generation.
  */
  schema;
  /**
  * Whether to guard against multiple updates to this untracked value in a single step.
  *
  * - If `true` (default), throws an error if multiple updates are received in one step.
  * - If `false`, only the last value from that step is kept, others are ignored.
  *
  * This helps prevent accidental state replacement within a step.
  */
  guard;
  /**
  * Create a new untracked value state field.
  *
  * @param schema - Optional type schema describing the value (e.g. a Zod schema).
  * @param init - Optional options for tracking updates or enabling multiple-writes-per-step.
  */
  constructor(e, t) {
    this.schema = e, this.guard = t?.guard ?? !0;
  }
  static isInstance(e) {
    return typeof e == "object" && e !== null && Po in e;
  }
};
const Jr = /* @__PURE__ */ Symbol.for("langgraph.state.delta_value");
var Bt = class {
  /**
  * Instance marker for runtime identification.
  * @internal
  */
  [Jr] = !0;
  /**
  * The schema that describes the type of value stored in state (after
  * reduction). Its default (if any) seeds the channel's initial value.
  */
  valueSchema;
  /**
  * The schema used to validate reducer inputs. Defaults to `valueSchema` when
  * not specified explicitly.
  */
  inputSchema;
  /**
  * The batch reducer that folds a list of incoming writes into the current
  * accumulated value.
  */
  reducer;
  /**
  * Snapshot cadence forwarded to the underlying {@link DeltaChannel}.
  */
  snapshotFrequency;
  /**
  * Optional extra fields to merge into the generated JSON Schema.
  */
  jsonSchemaExtra;
  constructor(e, t) {
    this.reducer = t.reducer, this.valueSchema = e, this.inputSchema = "inputSchema" in t ? t.inputSchema : e, this.snapshotFrequency = t.snapshotFrequency, this.jsonSchemaExtra = t.jsonSchemaExtra;
  }
  static isInstance(e) {
    return typeof e == "object" && e !== null && Jr in e && e[Jr] === !0;
  }
};
const zt = (e, t) => e.size === t.size && [...e].every((n) => t.has(n));
var yv = class Hu extends st {
  lc_graph_name = "NamedBarrierValue";
  names;
  seen;
  constructor(t) {
    super(), this.names = t, this.seen = /* @__PURE__ */ new Set();
  }
  fromCheckpoint(t) {
    const n = new Hu(this.names);
    return typeof t < "u" && (n.seen = new Set(t)), n;
  }
  update(t) {
    let n = !1;
    for (const s of t) if (this.names.has(s))
      this.seen.has(s) || (this.seen.add(s), n = !0);
    else throw new z(`Value ${JSON.stringify(s)} not in names ${JSON.stringify(this.names)}`);
    return n;
  }
  get() {
    if (!zt(this.names, this.seen)) throw new re();
  }
  checkpoint() {
    return [...this.seen];
  }
  consume() {
    return this.seen && this.names && zt(this.seen, this.names) ? (this.seen = /* @__PURE__ */ new Set(), !0) : !1;
  }
  isAvailable() {
    return !!this.names && zt(this.names, this.seen);
  }
}, _v = class Uu extends st {
  lc_graph_name = "NamedBarrierValueAfterFinish";
  names;
  seen;
  finished;
  constructor(t) {
    super(), this.names = t, this.seen = /* @__PURE__ */ new Set(), this.finished = !1;
  }
  fromCheckpoint(t) {
    const n = new Uu(this.names);
    if (typeof t < "u") {
      const [s, r] = t;
      n.seen = new Set(s), n.finished = r;
    }
    return n;
  }
  update(t) {
    let n = !1;
    for (const s of t) if (this.names.has(s) && !this.seen.has(s))
      this.seen.add(s), n = !0;
    else if (!this.names.has(s)) throw new z(`Value ${JSON.stringify(s)} not in names ${JSON.stringify(this.names)}`);
    return n;
  }
  get() {
    if (!this.finished || !zt(this.names, this.seen)) throw new re();
  }
  checkpoint() {
    return [[...this.seen], this.finished];
  }
  consume() {
    return this.finished && this.seen && this.names && zt(this.seen, this.names) ? (this.seen = /* @__PURE__ */ new Set(), this.finished = !1, !0) : !1;
  }
  finish() {
    return !this.finished && this.names && zt(this.names, this.seen) ? (this.finished = !0, !0) : !1;
  }
  isAvailable() {
    return this.finished && !!this.names && zt(this.names, this.seen);
  }
};
const Kr = /* @__PURE__ */ Symbol.for("langgraph.state.state_schema");
var ce = class {
  /**
  * Symbol for runtime identification.
  * @internal Used by isInstance for runtime type checking
  */
  [Kr] = !0;
  constructor(e) {
    this.fields = e;
  }
  /**
  * Get the channel definitions for use with StateGraph.
  * This converts the StateSchema fields into BaseChannel instances.
  */
  getChannels() {
    const e = {};
    for (const [t, n] of Object.entries(this.fields)) if (Bt.isInstance(n)) {
      const s = wt(n.valueSchema);
      e[t] = new Du(n.reducer, {
        snapshotFrequency: n.snapshotFrequency,
        initialValueFactory: s
      });
    } else if (xe.isInstance(n)) {
      const s = wt(n.valueSchema);
      e[t] = new ns(n.reducer, s);
    } else if (Ct.isInstance(n)) {
      const s = n.schema ? wt(n.schema) : void 0;
      e[t] = new Vu({
        guard: n.guard,
        initialValueFactory: s
      });
    } else if (Wt(n)) e[t] = new Sn(wt(n));
    else throw new Error(`Invalid state field "${t}": must be a schema, ReducedValue, DeltaValue, UntrackedValue, or ManagedValue`);
    return e;
  }
  /**
  * Get the JSON schema for the full state type.
  * Used by Studio and API for schema introspection.
  */
  getJsonSchema() {
    const e = {}, t = [];
    for (const [n, s] of Object.entries(this.fields)) {
      let r;
      if (Bt.isInstance(s) || xe.isInstance(s) ? (r = Ft(s.valueSchema), s.jsonSchemaExtra && (r = {
        ...r ?? {},
        ...s.jsonSchemaExtra
      })) : Ct.isInstance(s) ? r = s.schema ? Ft(s.schema) : void 0 : Wt(s) && (r = Ft(s)), r) {
        e[n] = r;
        let a = !1;
        Bt.isInstance(s) || xe.isInstance(s) ? a = wt(s.valueSchema) !== void 0 : Ct.isInstance(s) ? a = s.schema ? wt(s.schema) !== void 0 : !1 : a = wt(s) !== void 0, a || t.push(n);
      }
    }
    return {
      type: "object",
      properties: e,
      required: t.length > 0 ? t : void 0
    };
  }
  /**
  * Get the JSON schema for the update/input type.
  * All fields are optional in updates.
  */
  getInputJsonSchema() {
    const e = {};
    for (const [t, n] of Object.entries(this.fields)) {
      let s;
      Bt.isInstance(n) || xe.isInstance(n) ? (s = Ft(n.inputSchema), n.jsonSchemaExtra && (s = {
        ...s ?? {},
        ...n.jsonSchemaExtra
      })) : Ct.isInstance(n) ? s = n.schema ? Ft(n.schema) : void 0 : Wt(n) && (s = Ft(n)), s && (e[t] = s);
    }
    return {
      type: "object",
      properties: e
    };
  }
  /**
  * Get the list of channel keys (excluding managed values).
  */
  getChannelKeys() {
    return Object.entries(this.fields).map(([e]) => e);
  }
  /**
  * Get all keys (channels + managed values).
  */
  getAllKeys() {
    return Object.keys(this.fields);
  }
  /**
  * Validate input data against the schema.
  * This validates each field using its corresponding schema.
  *
  * @param data - The input data to validate
  * @returns The validated data with coerced types
  */
  async validateInput(e) {
    if (e == null || typeof e != "object") return e;
    const t = {};
    for (const [n, s] of Object.entries(e)) {
      const r = this.fields[n];
      if (r === void 0) {
        t[n] = s;
        continue;
      }
      let a;
      if (Bt.isInstance(r) || xe.isInstance(r)) {
        const [i, o] = Zt(s);
        if (i) {
          a = r.valueSchema;
          const c = await a["~standard"].validate(o);
          if (c.issues) throw new Error(`Validation failed for field "${n}": ${JSON.stringify(c.issues)}`);
          t[n] = { [St]: c.value };
          continue;
        }
        a = r.inputSchema;
      } else Ct.isInstance(r) ? a = r.schema : Wt(r) && (a = r);
      if (a) {
        const i = await a["~standard"].validate(s);
        if (i.issues) throw new Error(`Validation failed for field "${n}": ${JSON.stringify(i.issues)}`);
        t[n] = i.value;
      } else t[n] = s;
    }
    return t;
  }
  static isInstance(e) {
    return typeof e == "object" && e !== null && Kr in e && e[Kr] === !0;
  }
};
const wv = "__remove_all__";
function En(e, t) {
  const n = Array.isArray(e) ? e : [e], s = Array.isArray(t) ? t : [t], r = n.map(ft), a = s.map(ft);
  for (const u of r) (u.id === null || u.id === void 0) && (u.id = ia(), u.lc_kwargs.id = u.id);
  let i;
  for (let u = 0; u < a.length; u += 1) {
    const d = a[u];
    (d.id === null || d.id === void 0) && (d.id = ia(), d.lc_kwargs.id = d.id), Mt.isInstance(d) && d.id === "__remove_all__" && (i = u);
  }
  if (i != null) return a.slice(i + 1);
  const o = [...r], c = new Map(o.map((u, d) => [u.id, d])), l = /* @__PURE__ */ new Set();
  for (const u of a) {
    const d = c.get(u.id);
    if (d !== void 0) Mt.isInstance(u) ? l.add(u.id) : (l.delete(u.id), o[d] = u);
    else {
      if (Mt.isInstance(u)) throw new Error(`Attempting to delete a message with an ID that doesn't exist ('${u.id}')`);
      c.set(u.id, o.length), o.push(u);
    }
  }
  return o.filter((u) => !l.has(u.id));
}
function Wu(e, t) {
  const n = [];
  for (const o of t) Array.isArray(o) ? n.push(...o) : n.push(o);
  const s = e.length > 0 && ve.isInstance(e[0]) ? e : e.map(ft), r = n.map(ft), a = /* @__PURE__ */ new Map();
  for (let o = 0; o < s.length; o += 1) {
    const c = s[o].id;
    c != null && a.set(c, o);
  }
  const i = [...s];
  for (const o of r) {
    const c = o.id;
    Mt.isInstance(o) && c === "__remove_all__" ? (i.length = 0, a.clear()) : c == null ? i.push(o) : Mt.isInstance(o) ? a.has(c) && (i[a.get(c)] = null, a.delete(c)) : a.has(c) ? i[a.get(c)] = o : (a.set(c, i.length), i.push(o));
  }
  return i.filter((o) => o !== null);
}
const zu = oi().default(() => []), Gu = oi(), Gs = new xe(zu, {
  inputSchema: Gu,
  reducer: En,
  jsonSchemaExtra: {
    langgraph_type: "messages",
    description: "A list of chat messages"
  }
}), vv = new Bt(zu, {
  inputSchema: Gu,
  reducer: Wu,
  jsonSchemaExtra: {
    langgraph_type: "messages",
    description: "A list of chat messages"
  }
});
var bv = class {
  /**
  * Internal map storing schema metadata.
  * @internal
  */
  _map = /* @__PURE__ */ new Map();
  /**
  * Cache for extended schemas.
  * @internal
  */
  _extensionCache = /* @__PURE__ */ new Map();
  /**
  * Retrieves the metadata associated with a given schema.
  * @template TValue The value type of the schema.
  * @template TUpdate The update type of the schema (defaults to TValue).
  * @param schema The schema to retrieve metadata for.
  * @returns The associated SchemaMeta, or undefined if not present.
  */
  get(e) {
    return this._map.get(e);
  }
  /**
  * Extends or sets the metadata for a given schema.
  * @template TValue The value type of the schema.
  * @template TUpdate The update type of the schema (defaults to TValue).
  * @param schema The schema to extend metadata for.
  * @param predicate A function that receives the existing metadata (or undefined) and returns the new metadata.
  */
  extend(e, t) {
    const n = this.get(e);
    this._map.set(e, t(n));
  }
  /**
  * Removes the metadata associated with a given schema.
  * @param schema The schema to remove metadata for.
  * @returns The SchemaMetaRegistry instance (for chaining).
  */
  remove(e) {
    return this._map.delete(e), this;
  }
  /**
  * Checks if metadata exists for a given schema.
  * @param schema The schema to check.
  * @returns True if metadata exists, false otherwise.
  */
  has(e) {
    return this._map.has(e);
  }
  /**
  * Returns a mapping of channel instances for each property in the schema
  * using the associated metadata in the registry.
  *
  * This is used to create the `channels` object that's passed to the `Graph` constructor.
  *
  * @template T The shape of the schema.
  * @param schema The schema to extract channels from.
  * @returns A mapping from property names to channel instances.
  */
  getChannelsForSchema(e) {
    const t = {}, n = Kt(e);
    for (const [s, r] of Object.entries(n)) {
      const a = this.get(r);
      a?.reducer ? t[s] = new ns(a.reducer.fn, a.default) : t[s] = new Sn(a?.default);
    }
    return t;
  }
  /**
  * Returns a modified schema that introspectively looks at all keys of the provided
  * object schema, and applies the augmentations based on meta provided with those keys
  * in the registry and the selectors provided in the `effects` parameter.
  *
  * This assumes that the passed in schema is the "root" schema object for a graph where
  * the keys of the schema are the channels of the graph. Because we need to represent
  * the input of a graph in a couple of different ways, the `effects` parameter allows
  * us to apply those augmentations based on pre determined conditions.
  *
  * @param schema The root schema object to extend.
  * @param effects The effects that are being applied.
  * @returns The extended schema.
  */
  getExtendedChannelSchemas(e, t) {
    if (Object.keys(t).length === 0) return e;
    const n = Object.entries(t).filter(([, a]) => a === !0).sort(([a], [i]) => a.localeCompare(i)).map(([a, i]) => `${a}:${i}`).join("|"), s = this._extensionCache.get(n) ?? /* @__PURE__ */ new Map();
    if (s.has(e)) return s.get(e);
    let r = e;
    if (t.withReducerSchema || t.withJsonSchemaExtrasAsDescription) {
      const a = Object.entries(Kt(e)).map(([i, o]) => {
        const c = this.get(o);
        let l = t.withReducerSchema ? c?.reducer?.schema ?? o : o;
        if (t.withJsonSchemaExtrasAsDescription && c?.jsonSchemaExtra) {
          const u = Ks(l) ?? Ks(o), d = JSON.stringify({
            ...c.jsonSchemaExtra,
            description: u
          });
          l = l.describe(`lg:${d}`);
        }
        return [i, l];
      });
      r = ac(e, Object.fromEntries(a)), Qo(r) && (r._def.unknownKeys = "strip");
    }
    return t.asPartial && (r = pn(r)), s.set(e, r), this._extensionCache.set(n, s), r;
  }
};
const Tn = new bv();
function za(e, t) {
  if (t.reducer && !t.default) {
    const n = hr(e);
    n != null && (t.default = n);
  }
  if (t.reducer) {
    const n = Object.assign(e, { lg_reducer_schema: t.reducer?.schema ?? e });
    return Tn.extend(n, () => t), n;
  } else
    return Tn.extend(e, () => t), e;
}
function cn(e) {
  return e == null ? !1 : !!(ce.isInstance(e) || Q(e) || typeof e == "object" && "lc_graph_name" in e && e.lc_graph_name === "AnnotationRoot" || typeof e == "object" && !Array.isArray(e) && Object.keys(e).length > 0 && Object.values(e).every((t) => typeof t == "function" || ql(t)));
}
function Sv(e) {
  if (typeof e != "object" || e == null) return !1;
  const t = e, n = "state" in t && cn(t.state), s = "stateSchema" in t && cn(t.stateSchema), r = "input" in t && cn(t.input);
  return !(!n && !s && !r || "input" in t && t.input != null && !cn(t.input) || "output" in t && t.output != null && !cn(t.output));
}
const ut = "__root__", an = "__default_error_handler__", cr = /* @__PURE__ */ Symbol.for("langgraph.state.partial");
var Gi = class extends $u {
  channels = {};
  waitingEdges = /* @__PURE__ */ new Set();
  /** @internal */
  _schemaDefinition;
  /** @internal */
  _schemaRuntimeDefinition;
  /** @internal */
  _inputDefinition;
  /** @internal */
  _inputRuntimeDefinition;
  /** @internal */
  _outputDefinition;
  /** @internal */
  _outputRuntimeDefinition;
  /**
  * Map schemas to managed values
  * @internal
  */
  _schemaDefinitions = /* @__PURE__ */ new Map();
  /** @internal */
  _metaRegistry = Tn;
  /** @internal Used only for typing. */
  _configSchema;
  /** @internal */
  _configRuntimeSchema;
  /** @internal */
  _interrupt;
  /** @internal */
  _writer;
  /**
  * Graph-wide default node policies, resolved at `compile()` time.
  * @internal
  */
  _nodeDefaults = {};
  constructor(e, t) {
    super();
    const n = this._normalizeToStateGraphInit(e, t), s = n.state ?? n.stateSchema ?? n.input;
    if (!s) throw new Rs();
    const r = this._getChannelsFromSchema(s);
    this._schemaDefinition = r, ce.isInstance(s) ? this._schemaRuntimeDefinition = s : Q(s) && (this._schemaRuntimeDefinition = s), n.input ? ce.isInstance(n.input) ? this._inputRuntimeDefinition = n.input : Q(n.input) ? this._inputRuntimeDefinition = n.input : this._inputRuntimeDefinition = cr : this._inputRuntimeDefinition = cr, n.output ? ce.isInstance(n.output) ? this._outputRuntimeDefinition = n.output : Q(n.output) ? this._outputRuntimeDefinition = n.output : this._outputRuntimeDefinition = this._schemaRuntimeDefinition : this._outputRuntimeDefinition = this._schemaRuntimeDefinition;
    const a = n.input ? this._getChannelsFromSchema(n.input) : r, i = n.output ? this._getChannelsFromSchema(n.output) : r;
    this._inputDefinition = a, this._outputDefinition = i, this._addSchema(this._schemaDefinition), this._addSchema(this._inputDefinition), this._addSchema(this._outputDefinition), n.context && Q(n.context) && (this._configRuntimeSchema = n.context), this._interrupt = n.interrupt, this._writer = n.writer;
  }
  /**
  * Set graph-wide default node policies that apply to every node in this
  * graph.
  *
  * Per-node values passed to {@link addNode} always take precedence over these
  * defaults. Defaults are resolved at {@link compile} time, so call order does
  * not matter — you may call this before or after `addNode`, including as the
  * last step before `compile()`. Calling it multiple times merges the provided
  * fields, with later calls overriding earlier ones on a per-field basis.
  *
  * Policies set here are **not** inherited by subgraphs.
  *
  * `retryPolicy` and `timeout` defaults apply to **all** nodes, including
  * auto-generated error-handler nodes. `cachePolicy` and `errorHandler`
  * defaults apply to **regular nodes only** — caching an error-handler result
  * is unsafe, and a handler must never catch its own (or another handler's)
  * failure.
  *
  * @param defaults - The default node policies to apply.
  * @returns The builder instance, for chaining.
  *
  * @example Call before `addNode`
  * ```ts
  * const graph = new StateGraph(State)
  *   .setNodeDefaults({
  *     retryPolicy: { maxAttempts: 3 },
  *     cachePolicy: { ttl: 60 },
  *     timeout: 60_000,
  *     errorHandler: (state, { node, error }) => ({ lastError: error.message }),
  *   })
  *   .addNode("a", nodeA)
  *   .addNode("b", nodeB, { retryPolicy: { maxAttempts: 5 } }) // overrides default
  *   .addEdge(START, "a")
  *   .compile();
  * ```
  *
  * @example Call after `addNode`, immediately before `compile()`
  * ```ts
  * const graph = new StateGraph(State)
  *   .addNode("a", nodeA)
  *   .addNode("b", nodeB, { retryPolicy: { maxAttempts: 5 } }) // overrides default
  *   .addEdge(START, "a")
  *   .setNodeDefaults({
  *     retryPolicy: { maxAttempts: 3 },
  *     cachePolicy: { ttl: 60 },
  *   })
  *   .compile();
  * ```
  */
  setNodeDefaults(e) {
    return e.retryPolicy !== void 0 && (this._nodeDefaults.retryPolicy = e.retryPolicy), e.cachePolicy !== void 0 && (this._nodeDefaults.cachePolicy = typeof e.cachePolicy == "boolean" ? e.cachePolicy ? {} : void 0 : e.cachePolicy), e.timeout !== void 0 && (this._nodeDefaults.timeout = Zn(e.timeout)), e.errorHandler !== void 0 && (this._nodeDefaults.errorHandler = e.errorHandler), this;
  }
  /**
  * Build the shared spec for a graph-wide default error handler, or
  * `undefined` when {@link setNodeDefaults} did not configure one. The spec is
  * installed under {@link DEFAULT_ERROR_HANDLER_NODE} for the duration of a
  * single {@link compile} call and routes failures from every regular node
  * that lacks its own handler.
  * @internal
  */
  _createDefaultErrorHandlerSpec() {
    const e = this._nodeDefaults.errorHandler;
    if (e !== void 0)
      return {
        runnable: new Ne({
          func: (t, n) => {
            const s = n?.configurable?.[la];
            return e(t, s, n);
          },
          name: an,
          trace: !1
        }),
        metadata: void 0,
        input: this._schemaDefinition,
        retryPolicy: void 0,
        cachePolicy: void 0,
        isErrorHandler: !0
      };
  }
  /**
  * Normalize all constructor input patterns to a unified StateGraphInit object.
  * @internal
  */
  _normalizeToStateGraphInit(e, t) {
    if (Sv(e)) {
      if (Q(t) || Ia.isInstance(t)) return {
        ...e,
        context: t
      };
      const n = t;
      return {
        ...e,
        input: e.input ?? n?.input,
        output: e.output ?? n?.output,
        context: e.context ?? n?.context,
        interrupt: e.interrupt ?? n?.interrupt,
        writer: e.writer ?? n?.writer,
        nodes: e.nodes ?? n?.nodes
      };
    }
    if (cn(e)) {
      if (Q(t) || Ia.isInstance(t)) return {
        state: e,
        context: t
      };
      const n = t;
      return {
        state: e,
        input: n?.input,
        output: n?.output,
        context: n?.context,
        interrupt: n?.interrupt,
        writer: n?.writer,
        nodes: n?.nodes
      };
    }
    if (Cv(e)) return { state: kv(e.channels) };
    throw new Rs();
  }
  /**
  * Convert any supported schema type to a StateDefinition (channel map).
  * @internal
  */
  _getChannelsFromSchema(e) {
    if (ce.isInstance(e)) return e.getChannels();
    if (Q(e)) return this._metaRegistry.getChannelsForSchema(e);
    if (typeof e == "object" && "lc_graph_name" in e && e.lc_graph_name === "AnnotationRoot") return e.spec;
    if (typeof e == "object" && !Array.isArray(e) && Object.keys(e).length > 0) return e;
    throw new Rs("Invalid schema type. Expected StateSchema, Zod object, AnnotationRoot, or StateDefinition.");
  }
  get allEdges() {
    return /* @__PURE__ */ new Set([...this.edges, ...Array.from(this.waitingEdges).flatMap(([e, t]) => e.map((n) => [n, t]))]);
  }
  _addSchema(e) {
    if (!this._schemaDefinitions.has(e)) {
      this._schemaDefinitions.set(e, e);
      for (const [t, n] of Object.entries(e)) {
        let s;
        if (typeof n == "function" ? s = n() : s = n, this.channels[t] !== void 0) {
          if (!this.channels[t].equals(s) && s.lc_graph_name !== "LastValue")
            throw new Error(`Channel "${t}" already exists with a different type.`);
        } else this.channels[t] = s;
      }
    }
  }
  addNode(...e) {
    function t(s) {
      return s.length >= 1 && typeof s[0] != "string";
    }
    const n = t(e) ? Array.isArray(e[0]) ? e[0] : Object.entries(e[0]).map(([s, r]) => [s, r]) : [[
      e[0],
      e[1],
      e[2]
    ]];
    if (n.length === 0) throw new Error("No nodes provided in `addNode`");
    for (const [s, r, a] of n) {
      if (s in this.channels) throw new Error(`${s} is already being used as a state attribute (a.k.a. a channel), cannot also be used as a node name.`);
      for (const h of ["|", ":"]) if (s.includes(h)) throw new Error(`"${h}" is a reserved character and is not allowed in node names.`);
      if (this.warnIfCompiled("Adding a node to a graph that has already been compiled. This will not be reflected in the compiled graph."), s in this.nodes) throw new Error(`Node \`${s}\` already present.`);
      if (s === "__end__" || s === "__start__") throw new Error(`Node \`${s}\` is reserved.`);
      let i = this._schemaDefinition;
      a?.input !== void 0 && (i = this._getChannelsFromSchema(a.input)), this._addSchema(i);
      let o;
      ae.isRunnable(r) ? o = r : typeof r == "function" ? o = new Ne({
        func: r,
        name: s,
        trace: !1
      }) : o = Ze(r);
      const c = a?.cachePolicy;
      let l;
      c !== void 0 && (l = typeof c == "boolean" ? c ? {} : !1 : c);
      let u;
      if (a?.errorHandler !== void 0) {
        if (u = `__error_handler__${s}`, u in this.nodes) throw new Error(`Cannot add error handler to node \`${s}\`: the reserved name \`${u}\` is already in use. StateGraph registers \`__error_handler__<nodeName>\` when you pass \`errorHandler\` in addNode options. Remove or rename the existing node with that name (for example, you may have added it manually).`);
        const h = a.errorHandler, f = {
          runnable: new Ne({
            func: (p, m) => {
              const g = m?.configurable?.[la];
              return h(p, g, m);
            },
            name: u,
            trace: !1
          }),
          metadata: void 0,
          input: i ?? this._schemaDefinition,
          retryPolicy: void 0,
          cachePolicy: void 0,
          isErrorHandler: !0
        };
        this.nodes[u] = f;
      }
      const d = {
        runnable: o,
        retryPolicy: a?.retryPolicy,
        cachePolicy: l,
        timeout: Zn(a?.timeout),
        metadata: a?.metadata,
        input: i ?? this._schemaDefinition,
        subgraphs: Ui(o) ? [o] : a?.subgraphs,
        ends: a?.ends,
        defer: a?.defer,
        errorHandlerNode: u
      };
      this.nodes[s] = d;
    }
    return this;
  }
  addEdge(e, t) {
    if (typeof e == "string") return super.addEdge(e, t);
    this.compiled && console.warn("Adding an edge to a graph that has already been compiled. This will not be reflected in the compiled graph.");
    for (const n of e) {
      if (n === "__end__") throw new Error("END cannot be a start node");
      if (!Object.keys(this.nodes).some((s) => s === n)) throw new Error(`Need to add a node named "${n}" first`);
    }
    if (t === "__end__") throw new Error("END cannot be an end node");
    if (!Object.keys(this.nodes).some((n) => n === t)) throw new Error(`Need to add a node named "${t}" first`);
    return this.waitingEdges.add([e, t]), this;
  }
  addSequence(e) {
    const t = Array.isArray(e) ? e : Object.entries(e);
    if (t.length === 0) throw new Error("Sequence requires at least one node.");
    let n;
    for (const [s, r, a] of t) {
      if (s in this.nodes) throw new Error(`Node names must be unique: node with the name "${s}" already exists.`);
      const i = s;
      this.addNode(s, r, a), n != null && this.addEdge(n, i), n = i;
    }
    return this;
  }
  compile({ checkpointer: e, store: t, cache: n, interruptBefore: s, interruptAfter: r, name: a, description: i, transformers: o } = {}) {
    const c = this._createDefaultErrorHandlerSpec();
    if (c !== void 0) {
      if (an in this.nodes) throw new Error(`Cannot apply a default error handler: the reserved node name \`${an}\` is already in use. setNodeDefaults({ errorHandler }) registers a node with that name; rename the conflicting node.`);
      this.nodes[an] = c;
    }
    try {
      return this._compileResolved({
        checkpointer: e,
        store: t,
        cache: n,
        interruptBefore: s,
        interruptAfter: r,
        name: a,
        description: i,
        transformers: o,
        defaultErrorHandlerNode: c !== void 0 ? an : void 0
      });
    } finally {
      c !== void 0 && delete this.nodes[an];
    }
  }
  /** @internal */
  _compileResolved({ checkpointer: e, store: t, cache: n, interruptBefore: s, interruptAfter: r, name: a, description: i, transformers: o, defaultErrorHandlerNode: c }) {
    this.validate([...Array.isArray(s) ? s : [], ...Array.isArray(r) ? r : []]);
    const l = Object.keys(this._schemaDefinitions.get(this._outputDefinition)), u = l.length === 1 && l[0] === ut ? ut : l, d = Object.keys(this.channels), h = d.length === 1 && d[0] === ut ? ut : d, f = this._interrupt, p = new Ju({
      builder: this,
      checkpointer: e,
      interruptAfter: r,
      interruptBefore: s,
      autoValidate: !1,
      nodes: {},
      channels: {
        ...this.channels,
        [te]: new Qt()
      },
      inputChannels: te,
      outputChannels: u,
      streamChannels: h,
      streamMode: "updates",
      store: t,
      cache: n,
      name: a,
      description: i,
      userInterrupt: f,
      streamTransformers: o
    });
    p.attachNode(te);
    const m = this._nodeDefaults, g = m.retryPolicy !== void 0 || m.cachePolicy !== void 0 || m.timeout !== void 0 || c !== void 0;
    for (const [y, _] of Object.entries(this.nodes)) {
      const b = _.isErrorHandler === !0, v = g ? {
        ..._,
        retryPolicy: _.retryPolicy ?? m.retryPolicy,
        cachePolicy: b || _.cachePolicy === !1 ? void 0 : _.cachePolicy ?? m.cachePolicy,
        timeout: _.timeout ?? m.timeout,
        errorHandlerNode: !b && c !== void 0 && _.errorHandlerNode === void 0 ? c : _.errorHandlerNode
      } : _;
      p.attachNode(y, v);
    }
    p.attachBranch(te, ho, No(), { withReader: !1 });
    for (const [y] of Object.entries(this.nodes)) p.attachBranch(y, ho, No(), { withReader: !1 });
    for (const [y, _] of this.edges) p.attachEdge(y, _);
    for (const [y, _] of this.waitingEdges) p.attachEdge(y, _);
    for (const [y, _] of Object.entries(this.branches)) for (const [b, v] of Object.entries(_)) p.attachBranch(y, b, v);
    return p.validate();
  }
};
function kv(e) {
  const t = {};
  for (const [n, s] of Object.entries(e)) t[n] = Aa(s);
  return t;
}
var Ju = class extends ju {
  /**
  * The description of the compiled graph.
  * This is used by the supervisor agent to describe the handoff to the agent.
  */
  description;
  /** @internal */
  _metaRegistry = Tn;
  constructor({ description: e, ...t }) {
    super(t), this.description = e;
  }
  attachNode(e, t) {
    let n;
    e === "__start__" ? n = Object.entries(this.builder._schemaDefinitions.get(this.builder._inputDefinition)).map(([c]) => c) : n = Object.keys(this.builder.channels);
    function s(c) {
      if (Y(c))
        return c.graph === ee.PARENT ? null : c._updateAsTuples();
      if (Array.isArray(c) && c.length > 0 && c.some((l) => Y(l))) {
        const l = [];
        for (const u of c) if (Y(u)) {
          if (u.graph === ee.PARENT) continue;
          l.push(...u._updateAsTuples());
        } else l.push([ut, u]);
        return l;
      } else if (c != null) return [[ut, c]];
      return null;
    }
    const r = e, a = async (c) => {
      if (c == null || c.length === 0) return c;
      const l = this.builder._schemaRuntimeDefinition;
      if (ce.isInstance(l)) {
        const u = new Set(l.getChannelKeys());
        return Promise.all(c.map(async ([d, h]) => {
          if (!u.has(d)) return [d, h];
          const f = await l.validateInput({ [d]: h });
          return [d, Object.prototype.hasOwnProperty.call(f, d) ? f[d] : h];
        }));
      }
      if (Q(l)) {
        const u = new Set(Object.keys(Kt(l)));
        if (c.filter(([f]) => u.has(f)).length === 0) return c;
        const d = pn(this._metaRegistry.getExtendedChannelSchemas(l, { withReducerSchema: !0 })), h = pn(l);
        return c.map(([f, p]) => {
          if (!u.has(f)) return [f, p];
          const [m, g] = Zt(p);
          if (m) {
            const _ = Je(h, { [f]: g });
            return [f, Object.prototype.hasOwnProperty.call(_, f) ? { [St]: _[f] } : p];
          }
          const y = Je(d, { [f]: p });
          return [f, Object.prototype.hasOwnProperty.call(y, f) ? y[f] : p];
        });
      }
      return c;
    };
    async function i(c) {
      if (c) {
        if (Y(c))
          return c.graph === ee.PARENT ? null : a(c._updateAsTuples().filter(([l]) => n.includes(l)));
        if (Array.isArray(c) && c.length > 0 && c.some(Y)) {
          const l = [];
          for (const u of c) if (Y(u)) {
            if (u.graph === ee.PARENT) continue;
            l.push(...u._updateAsTuples().filter(([d]) => n.includes(d)));
          } else {
            const d = await i(u);
            d && l.push(...d ?? []);
          }
          return a(l);
        } else {
          if (typeof c == "object" && !Array.isArray(c)) return a(Object.entries(c).filter(([l]) => n.includes(l)));
          {
            const l = Array.isArray(c) ? "array" : typeof c;
            throw new z(`Expected node "${r.toString()}" to return an object or an array containing at least one Command object, received ${l}`, { lc_error_code: "INVALID_GRAPH_NODE_RETURN_VALUE" });
          }
        }
      } else return null;
    }
    const o = [{
      value: ht,
      mapper: new Ne({
        func: n.length && n[0] === ut ? s : i,
        trace: !1,
        recurse: !1
      })
    }];
    if (e === "__start__") this.nodes[e] = new Cn({
      tags: [we],
      triggers: [te],
      channels: [te],
      writers: [new ge(o, [we])]
    });
    else {
      const c = t?.input ?? this.builder._schemaDefinition, l = Object.fromEntries(Object.keys(this.builder._schemaDefinitions.get(c)).map((p) => [p, p])), u = Object.keys(l).length === 1 && ut in l, d = `branch:to:${e}`;
      this.channels[d] = t?.defer ? new __() : new Qt(!1);
      const h = t?.cachePolicy, f = h === !1 ? void 0 : h;
      this.nodes[e] = new Cn({
        triggers: [d],
        channels: u ? Object.keys(l) : l,
        writers: [new ge(o, [we])],
        mapper: u ? void 0 : (p) => Object.fromEntries(Object.entries(p).filter(([m]) => m in l)),
        bound: t?.runnable,
        metadata: t?.metadata,
        retryPolicy: t?.retryPolicy,
        cachePolicy: f,
        timeout: t?.timeout,
        subgraphs: t?.subgraphs,
        ends: t?.ends,
        isErrorHandler: t?.isErrorHandler,
        errorHandlerNode: t?.errorHandlerNode
      });
    }
  }
  attachEdge(e, t) {
    if (t !== "__end__") {
      if (typeof e == "string") this.nodes[e].writers.push(new ge([{
        channel: `branch:to:${t}`,
        value: null
      }], [we]));
      else if (Array.isArray(e)) {
        const n = `join:${e.join("+")}:${t}`;
        this.channels[n] = this.builder.nodes[t].defer ? new _v(new Set(e)) : new yv(new Set(e)), this.nodes[t].triggers.push(n);
        for (const s of e) this.nodes[s].writers.push(new ge([{
          channel: n,
          value: s
        }], [we]));
      }
    }
  }
  attachBranch(e, t, n, s = { withReader: !0 }) {
    const r = async (a, i) => {
      const o = a.filter((l) => l !== D);
      if (!o.length) return;
      const c = o.map((l) => Me(l) ? l : {
        channel: l === "__end__" ? l : `branch:to:${l}`,
        value: e
      });
      await ge.doWrite({
        ...i,
        tags: (i.tags ?? []).concat([we])
      }, c);
    };
    this.nodes[e].writers.push(n.run(r, s.withReader ? (a) => hw.doRead(a, this.streamChannels ?? this.outputChannels, !0) : void 0));
  }
  async _validateInput(e) {
    if (e == null) return e;
    const t = this.builder._inputRuntimeDefinition, n = this.builder._schemaRuntimeDefinition;
    if (ce.isInstance(t)) {
      if (Y(e)) {
        const r = e;
        return e.update && (r.update = await t.validateInput(Array.isArray(e.update) ? Object.fromEntries(e.update) : e.update)), r;
      }
      return await t.validateInput(e);
    }
    if (t === cr && ce.isInstance(n)) {
      if (Y(e)) {
        const r = e;
        return e.update && (r.update = await n.validateInput(Array.isArray(e.update) ? Object.fromEntries(e.update) : e.update)), r;
      }
      return await n.validateInput(e);
    }
    const s = (() => {
      const r = (a) => {
        if (a != null)
          return this._metaRegistry.getExtendedChannelSchemas(a, { withReducerSchema: !0 });
      };
      if (Q(t)) return r(t);
      if (t === cr)
        return Q(n) ? pn(r(n)) : void 0;
    })();
    if (Y(e)) {
      const r = e;
      if (e.update && s != null) {
        const a = Array.isArray(e.update) ? Object.fromEntries(e.update) : e.update, i = Je(s, a);
        r.update = Object.fromEntries(Object.keys(a).map((o) => [o, i[o]]));
      }
      return r;
    }
    return s != null ? Je(s, e) : e;
  }
  isInterrupted(e) {
    return yr(e);
  }
  async _validateContext(e) {
    const t = this.builder._configRuntimeSchema;
    return Q(t) && Je(t, e), e;
  }
};
function Cv(e) {
  return typeof e == "object" && e !== null && e.channels !== void 0;
}
function Ev(e) {
  if (Me(e)) return [e];
  const t = [];
  Y(e) ? t.push(e) : Array.isArray(e) && t.push(...e.filter(Y));
  const n = [];
  for (const s of t) {
    if (s.graph === ee.PARENT) throw new vi(s);
    Me(s.goto) || typeof s.goto == "string" ? n.push(s.goto) : Array.isArray(s.goto) && n.push(...s.goto);
  }
  return n;
}
function No() {
  return new Ru({ path: new Ne({
    func: Ev,
    tags: [we],
    trace: !1,
    recurse: !1,
    name: "<control_branch>"
  }) });
}
var Tv = class extends Gi {
  constructor() {
    super({ channels: { __root__: {
      reducer: En,
      default: () => []
    } } });
  }
};
function xv(e, t) {
  const { stateKey: n, ...s } = t ?? {}, r = Fi(s);
  let a = n ?? "messages";
  n === null && (a = void 0);
  const i = ft(e);
  if (!i.id) throw new Error("Message ID is required.");
  const o = (Array.isArray(r.callbacks) ? r.callbacks : typeof r.callbacks < "u" ? r.callbacks.handlers : []).find((c) => "name" in c && c.name === "StreamMessagesHandler");
  if (o) {
    const c = r.metadata ?? {}, l = (c.langgraph_checkpoint_ns ?? "").split("|");
    o._emit([l, c], i, void 0, !1);
  }
  return a && r.configurable?.__pregel_send?.([[a, i]]), i;
}
function Mv(e, t) {
  const n = typeof e == "string" ? {
    name: e,
    retry: void 0,
    cachePolicy: void 0,
    timeout: void 0
  } : e, { name: s, retry: r } = n, a = Zn(n.timeout);
  if (vu(t) || bu(t)) throw new Error("Generators are disallowed as tasks. For streaming responses, use config.write.");
  const i = n.cachePolicy ?? ("cache" in n ? n.cache : void 0);
  let o;
  return typeof i == "boolean" ? o = i ? {} : void 0 : o = i, (...c) => vw({
    func: t,
    name: s,
    retry: r,
    cache: o,
    timeout: a
  }, ...c);
}
const Ku = function(t, n) {
  const { name: s, checkpointer: r, store: a, cache: i } = typeof t == "string" ? {
    name: t,
    checkpointer: void 0,
    store: void 0
  } : t, o = Zn(typeof t == "string" ? void 0 : t.timeout);
  if (vu(n) || bu(n)) throw new Error("Generators are disallowed as entrypoints. For streaming responses, use config.write.");
  const c = "updates", l = ww(s, n);
  function u(p) {
    return typeof p == "object" && p !== null && "__lg_type" in p && p.__lg_type === "__pregel_final";
  }
  const d = new Ne({
    name: "pluckReturnValue",
    func: (p) => u(p) ? p.value : p
  }), h = new Ne({
    name: "pluckSaveValue",
    func: (p) => u(p) ? p.save : p
  }), f = new Cn({
    bound: l,
    triggers: [te],
    channels: [te],
    timeout: o,
    writers: [new ge([{
      channel: D,
      value: ht,
      mapper: d
    }, {
      channel: gn,
      value: ht,
      mapper: h
    }], [we])]
  });
  return new Pu({
    name: s,
    checkpointer: r,
    nodes: { [s]: f },
    channels: {
      [te]: new Qt(),
      [D]: new Sn(),
      [gn]: new Sn()
    },
    inputChannels: te,
    outputChannels: D,
    streamChannels: D,
    streamMode: c,
    store: a,
    cache: i
  });
};
Ku.final = function({ value: t, save: n }) {
  return {
    value: t,
    save: n,
    __lg_type: "__pregel_final"
  };
};
function Iv() {
  return le.getRunnableConfig().configurable?.[mn];
}
const Av = ar.Root({ messages: ar({
  reducer: En,
  default: () => []
}) }), qu = {
  reducer: { fn: En },
  jsonSchemaExtra: { langgraph_type: "messages" },
  default: () => []
}, Ov = se({ messages: za(Ye(), qu) });
function Pv(e) {
  const t = le.getRunnableConfig();
  if (!t) throw new Error("Called interrupt() outside the context of a graph.");
  const n = t.configurable;
  if (!n) throw new Error("No configurable found in config");
  return n.writer?.(e);
}
lm();
const Nv = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Annotation: ar,
  AsyncBatchedStore: Kl,
  BaseChannel: st,
  BaseCheckpointSaver: Wl,
  BaseLangGraphError: Re,
  BaseStore: Di,
  BinaryOperatorAggregate: ns,
  COMMAND_SYMBOL: da,
  ChatModelStreamImpl: ai,
  Command: ee,
  CommandInstance: Cc,
  CompiledStateGraph: Ju,
  DeltaChannel: Du,
  DeltaValue: Bt,
  END: D,
  EmptyChannelError: re,
  EmptyInputError: ma,
  EventLog: Fe,
  Graph: $u,
  GraphBubbleUp: _r,
  GraphDrained: yi,
  GraphInterrupt: Jt,
  GraphRecursionError: Ec,
  GraphRunStream: Bi,
  GraphValueError: Un,
  INTERRUPT: ne,
  InMemoryStore: f_,
  InvalidUpdateError: z,
  MemorySaver: o_,
  MessageGraph: Tv,
  MessagesAnnotation: Av,
  MessagesDeltaValue: vv,
  MessagesValue: Gs,
  MessagesZodMeta: qu,
  MessagesZodState: Ov,
  MultipleSubgraphsError: vm,
  NodeError: wi,
  NodeInterrupt: _i,
  NodeTimeoutError: bi,
  Overwrite: gm,
  ParentCommand: vi,
  REMOVE_ALL_MESSAGES: wv,
  ReducedValue: xe,
  RemoteException: bm,
  RunControl: eu,
  START: te,
  STREAM_EVENTS_V3_MODES: tu,
  Send: de,
  StateGraph: Gi,
  StateGraphInputError: Rs,
  StateSchema: ce,
  StreamChannel: Fe,
  SubgraphRunStream: uu,
  UnreachableNodeError: xc,
  UntrackedValue: Ct,
  UntrackedValueChannel: Vu,
  addMessages: En,
  convertToProtocolEvent: nu,
  copyCheckpoint: bn,
  createGraphRunStream: hu,
  createLifecycleTransformer: au,
  createMessagesTransformer: ss,
  createSubgraphDiscoveryTransformer: iu,
  createValuesTransformer: ou,
  emptyCheckpoint: sr,
  entrypoint: Ku,
  filterLifecycleEntries: Vi,
  filterSubgraphHandles: Er,
  getConfig: Oa,
  getCurrentTaskInput: I_,
  getJsonSchemaFromSchema: Ft,
  getPreviousState: Iv,
  getSchemaDefaultGetter: wt,
  getStore: x_,
  getSubgraphsSeenSet: Sm,
  getWriter: M_,
  interrupt: wu,
  isCheckpointEnvelope: Cr,
  isCommand: Y,
  isGraphBubbleUp: Ht,
  isGraphDrained: pa,
  isGraphInterrupt: Et,
  isInterrupted: yr,
  isNativeTransformer: Ra,
  isNodeError: _m,
  isNodeTimeoutError: wm,
  isParentCommand: Tc,
  isSerializableSchema: mv,
  isStandardSchema: Wt,
  messagesDeltaReducer: Wu,
  messagesStateReducer: En,
  pushMessage: xv,
  task: Mv,
  writer: Pv
}, Symbol.toStringTag, { value: "Module" }));
var Ro = class extends Error {
  constructor() {
    super("The provided LLM already has bound tools. Please provide an LLM without bound tools to createAgent. The agent will bind the tools provided in the 'tools' parameter.");
  }
}, $o = class extends Error {
  toolNames;
  constructor(e) {
    super(`The model has called multiple tools: ${e.join(", ")} to return a structured output. This is not supported. Please provide a single structured output.`), this.toolNames = e;
  }
}, Zu = class extends Error {
  toolName;
  errors;
  constructor(e, t) {
    super(`Failed to parse structured output for tool '${e}':${t.map((n) => `
  - ${n}`).join("")}.`), this.toolName = e, this.errors = t;
  }
}, Yu = class extends Error {
  toolCall;
  toolError;
  constructor(e, t) {
    const n = e instanceof Error ? e : new Error(String(e)), s = JSON.stringify(t.args);
    super(`Error invoking tool '${t.name}' with kwargs ${s} with error: ${n.stack}
 Please fix the error and try again.`), this.toolCall = t, this.toolError = n;
  }
}, Xu = class Qu extends Error {
  static "~brand" = "MiddlewareError";
  constructor(t, n) {
    const s = t instanceof Error ? t.message : String(t);
    super(s), this.name = t instanceof Error ? t.name : `${n[0].toUpperCase() + n.slice(1)}Error`, t instanceof Error && (this.cause = t);
  }
  /**
  * Wrap an error in a MiddlewareError, unless it's a GraphBubbleUp error
  * (like GraphInterrupt) which should propagate unchanged.
  *
  * @param error - The error to wrap
  * @param middlewareName - The name of the middleware that threw the error
  * @returns The original error if it's a GraphBubbleUp, otherwise a new MiddlewareError
  */
  static wrap(t, n) {
    return Ht(t) ? t : new Qu(t, n);
  }
  /**
  * Check if the error is a MiddlewareError.
  * @param error - The error to check
  * @returns Whether the error is a MiddlewareError
  */
  static isInstance(t) {
    return t instanceof Error && "~brand" in t && t["~brand"] === "MiddlewareError";
  }
};
function Ji(e) {
  return "invoke" in e && typeof e.invoke == "function" && "_streamResponseChunks" in e;
}
function lr(e) {
  return typeof e == "object" && e != null && "_queuedMethodOperations" in e && "_getModelInstance" in e && typeof e._getModelInstance == "function";
}
const jo = !0;
let Rv = 0;
var it = class Ga {
  constructor(t, n, s) {
    this.schema = t, this.tool = n, this.options = s;
  }
  get name() {
    return this.tool.function.name;
  }
  static fromSchema(t, n) {
    function s(a) {
      return a ?? `extract-${++Rv}`;
    }
    if (Ps(t) || ur(t)) {
      const a = je(t);
      return new Ga(a, {
        type: "function",
        function: {
          name: s(a.title),
          strict: !1,
          description: a.description ?? "Tool for extracting structured output from the model's response.",
          parameters: a
        }
      }, n);
    }
    let r;
    return typeof t.name == "string" && typeof t.parameters == "object" && t.parameters != null ? r = t : r = {
      name: s(t.title),
      description: t.description ?? "",
      parameters: t.schema || t
    }, new Ga(je(t), {
      type: "function",
      function: r
    }, n);
  }
  /**
  * Parse tool arguments according to the schema.
  *
  * @throws {StructuredOutputParsingError} if the response is not valid
  * @param toolArgs - The arguments from the tool call
  * @returns The parsed response according to the schema type
  */
  parse(t) {
    const n = new fc(this.schema).validate(t);
    if (!n.valid) throw new Zu(this.name, n.errors.map((s) => s.error));
    return t;
  }
}, ln = class eh {
  _schemaType;
  /**
  * The schema to use for the provider strategy
  */
  schema;
  /**
  * Whether to use strict mode for the provider strategy
  */
  strict;
  constructor(t, n) {
    if ("schema" in t && typeof t.schema == "object" && t.schema !== null && !("type" in t)) {
      const s = t;
      this.schema = s.schema, this.strict = s.strict ?? jo;
    } else
      this.schema = t, this.strict = n ?? jo;
  }
  static fromSchema(t, n) {
    return new eh(je(t), n);
  }
  /**
  * Parse tool arguments according to the schema. If the response is not valid, return undefined.
  *
  * @param response - The AI message response to parse
  * @returns The parsed response according to the schema type
  */
  parse(t) {
    let n;
    if (typeof t.content == "string") n = t.content;
    else if (Array.isArray(t.content)) {
      for (const s of t.content) if (typeof s == "object" && s !== null && "type" in s && s.type === "text" && "text" in s && typeof s.text == "string") {
        n = s.text;
        break;
      }
    }
    if (!(!n || n === ""))
      try {
        const s = JSON.parse(n);
        return new fc(this.schema).validate(s).valid ? s : void 0;
      } catch {
      }
  }
};
function $v(e, t, n) {
  if (!e) return [];
  if (typeof e == "object" && e !== null && "__responseFormatUndefined" in e) return [];
  if (Array.isArray(e)) {
    if (e.every((r) => r instanceof it || r instanceof ln)) return e;
    if (e.every((r) => Ps(r))) return e.map((r) => it.fromSchema(r, t));
    if (e.every((r) => Q(r))) return e.map((r) => it.fromSchema(r, t));
    if (e.every((r) => typeof r == "object" && r !== null && !Q(r) && !Ps(r))) return e.map((r) => it.fromSchema(r, t));
    throw new Error(`Invalid response format: list contains mixed types.
All items must be either InteropZodObject, Standard Schema, or plain JSON schema objects.`);
  }
  if (e instanceof it || e instanceof ln) return [e];
  const s = jv(n);
  if (Ps(e)) return s ? [ln.fromSchema(e)] : [it.fromSchema(e, t)];
  if (Q(e)) return s ? [ln.fromSchema(e)] : [it.fromSchema(e, t)];
  if (typeof e == "object" && e !== null && "properties" in e) return s ? [ln.fromSchema(e)] : [it.fromSchema(e, t)];
  throw new Error(`Invalid response format: ${String(e)}`);
}
function jv(e) {
  return !e || !Ji(e) || !("profile" in e) || typeof e.profile != "object" || !e.profile ? !1 : "structuredOutput" in e.profile && e.profile.structuredOutput === !0;
}
function xt(e) {
  if (!(!e || typeof e == "function"))
    return e.canJumpTo;
}
function Tr(e) {
  return typeof e == "function" ? e : e.hook;
}
function Lv(e, t) {
  if (e.length < t.length || e.length > t.length + 1) return !1;
  for (let n = 0; n < t.length; n += 1) if (e[n] !== t[n]) return !1;
  return !0;
}
function Dv(e) {
  let t;
  try {
    t = JSON.parse(e);
  } catch {
    return !1;
  }
  return !Array.isArray(t) || t.length === 0 ? !1 : t.every((n) => {
    if (n == null || typeof n != "object") return !1;
    const s = n;
    return typeof s.id == "string" && "value" in s;
  });
}
function Fv(e) {
  if (e == null || typeof e != "object") return !1;
  const t = e;
  return t.type !== "constructor" || !Array.isArray(t.id) ? !1 : t.id[t.id.length - 1] === "ToolMessage";
}
function Vv(e) {
  return J.isInstance(e) ? e.content : Fv(e) ? e.kwargs?.content : e;
}
function th(e) {
  return () => {
    const t = Fe.local(), n = /* @__PURE__ */ new Map();
    function s(r, a, i) {
      if (n.has(r)) return;
      const o = typeof i == "string" ? JSON.parse(i) : i;
      let c, l, u, d;
      const h = new Promise((m, g) => {
        c = m, l = g;
      }), f = new Promise((m) => {
        u = m;
      }), p = new Promise((m) => {
        d = m;
      });
      n.set(r, {
        resolveOutput: c,
        rejectOutput: l,
        resolveStatus: u,
        resolveError: d
      }), t.push({
        name: a,
        callId: r,
        input: o,
        output: h,
        status: f,
        error: p
      });
    }
    return {
      __native: !0,
      init: () => ({ toolCalls: t }),
      process(r) {
        if (!Lv(r.params.namespace, e)) return !0;
        if (r.method === "messages") {
          const a = r.params.data;
          if (a.event === "content-block-finish") {
            const i = a.contentBlock ?? a.content_block;
            i?.type === "tool_call" && s(String(i.id ?? ""), String(i.name ?? ""), i.args ?? i.input);
          }
        }
        if (r.method === "tools") {
          const a = r.params.data, i = a.tool_call_id;
          a.event === "tool-started" && s(i, a.tool_name ?? "unknown", a.input);
          const o = i ? n.get(i) : void 0;
          if (o) {
            if (a.event === "tool-finished")
              o.resolveOutput(Vv(a.output)), o.resolveStatus("finished"), o.resolveError(void 0), n.delete(i);
            else if (a.event === "tool-error") {
              const c = a.message ?? "unknown error";
              if (Dv(c)) return !0;
              o.rejectOutput(new Error(c)), o.resolveStatus("error"), o.resolveError(c), n.delete(i);
            }
          }
        }
        return !0;
      },
      finalize() {
        for (const r of n.values())
          r.resolveStatus("finished"), r.resolveError(void 0), r.resolveOutput(void 0);
        n.clear(), t.close();
      },
      fail(r) {
        for (const a of n.values())
          a.resolveStatus("error"), a.resolveError(r instanceof Error ? r.message : String(r)), a.rejectOutput(r);
        n.clear(), t.fail(r);
      }
    };
  };
}
function Ve(e) {
  return typeof e == "object" && e !== null && !Array.isArray(e);
}
function Nn(e) {
  return e.join("\0");
}
function Lo(e, t) {
  if (t.length > e.length) return !1;
  for (let n = 0; n < t.length; n += 1) if (e[n] !== t[n]) return !1;
  return !0;
}
function nh(e = []) {
  return () => {
    const t = Fe.local(), n = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map(), i = e.length;
    function o(h, f) {
      const p = Nn(h);
      if (n.has(p)) return;
      const m = (Ve(f) && Ve(f.metadata) ? f.metadata : void 0)?.lc_agent_name;
      n.set(p, typeof m == "string" ? m : void 0);
    }
    function c(h) {
      if (!Ve(h)) return;
      const f = h.id;
      if (typeof f != "string") return;
      const p = h.input;
      let m;
      if (Ve(p) && Ve(p.tool_call)) {
        const g = p.tool_call.id;
        typeof g == "string" && (m = g);
      } else if (Array.isArray(p)) {
        for (const g of p) if (Ve(g) && typeof g.id == "string") {
          m = g.id;
          break;
        }
      }
      m != null && s.set(f, m);
    }
    function l(h) {
      const f = r.get(Nn(h));
      if (typeof f == "string" && f.length > 0) return {
        type: "toolCall",
        tool_call_id: f
      };
      const p = h[h.length - 1], m = p.indexOf(":");
      if (m === -1) return;
      const g = p.slice(m + 1);
      if (g.length === 0) return;
      const y = s.get(g);
      if (!(typeof y != "string" || y.length === 0))
        return {
          type: "toolCall",
          tool_call_id: y
        };
    }
    function u(h) {
      if (h.length !== i + 1 || !Lo(h, e)) return;
      const f = Nn(h);
      if (a.has(f)) return;
      const p = n.get(f);
      if (typeof p != "string" || p.length === 0) return;
      const m = ss(h), g = m.init(), y = th(h)(), _ = y.init(), b = nh(h)(), v = b.init();
      let M, I;
      const w = new Promise((C, O) => {
        M = C, I = O;
      });
      a.set(f, {
        key: f,
        path: h,
        name: p,
        messages: m,
        toolCall: y,
        nested: b,
        resolveOutput: M,
        rejectOutput: I,
        latestValues: void 0,
        done: !1
      }), t.push({
        name: p,
        cause: l(h),
        output: w,
        messages: g.messages,
        toolCalls: _.toolCalls,
        subagents: v.subagents
      });
    }
    function d(h, f) {
      h.done || (h.done = !0, f.type === "resolve" ? h.resolveOutput(h.latestValues) : h.rejectOutput(f.error), h.messages.finalize?.(), h.toolCall.finalize?.(), h.nested.finalize?.());
    }
    return {
      __native: !0,
      init: () => ({ subagents: t }),
      process(h) {
        const f = h.params.namespace, p = h.params.data, m = h.method === "tasks" && Ve(p) && "result" in p;
        h.method === "tools" && Ve(p) && p.event === "tool-started" && typeof p.tool_call_id == "string" && p.tool_call_id.length > 0 && r.set(Nn(f), p.tool_call_id), h.method === "tasks" && !m && (o(f, p), c(p), u(f));
        for (const g of a.values())
          if (!g.done && Lo(f, g.path) && (g.messages.process(h), g.toolCall.process(h), g.nested.process(h), Nn(f) === g.key)) {
            if (h.method === "values" && Ve(p)) g.latestValues = p;
            else if (h.method === "lifecycle" && Ve(p)) {
              const y = p.event;
              y === "completed" || y === "interrupted" ? d(g, { type: "resolve" }) : y === "failed" && d(g, {
                type: "reject",
                error: /* @__PURE__ */ new Error(`Subagent ${g.name} failed`)
              });
            }
          }
        return !0;
      },
      finalize() {
        for (const h of a.values()) d(h, { type: "resolve" });
        t.close();
      },
      fail(h) {
        for (const f of a.values()) d(f, {
          type: "reject",
          error: h
        });
        t.fail(h);
      }
    };
  };
}
const Bv = /* @__PURE__ */ Symbol.for("AgentMiddleware");
function Hv(e) {
  return {
    [Bv]: !0,
    name: e.name,
    stateSchema: e.stateSchema,
    contextSchema: e.contextSchema,
    wrapToolCall: e.wrapToolCall,
    wrapModelCall: e.wrapModelCall,
    beforeAgent: e.beforeAgent,
    beforeModel: e.beforeModel,
    afterModel: e.afterModel,
    afterAgent: e.afterAgent,
    tools: e.tools,
    streamTransformers: e.streamTransformers
  };
}
const Ja = /* @__PURE__ */ Symbol.for("langgraph-zod");
Ja in globalThis || (globalThis[Ja] = /* @__PURE__ */ new WeakSet());
function Do(e) {
  const t = globalThis[Ja];
  t.has(e) || (Object.defineProperty(e, "langgraph", { get() {
    const n = this;
    return {
      metadata(s) {
        return za(n, { jsonSchemaExtra: s });
      },
      reducer(s, r) {
        return za(n, {
          default: hr(n),
          reducer: {
            schema: r,
            fn: s
          }
        });
      }
    };
  } }), t.add(e));
}
try {
  Do(np.prototype), Do(sp.prototype);
} catch (e) {
  throw new Error("Failed to extend Zod with LangGraph-related methods. This is most likely a bug, consider opening an issue and/or using `withLangGraph` to augment your Zod schema.", { cause: e });
}
var Uv = class extends rp {
  /**
  * Creates a new LanggraphZodMetaRegistry instance.
  *
  * @param parent - The base SchemaMetaRegistry to use for metadata storage.
  */
  constructor(e) {
    super(), this.parent = e, this._map = this.parent._map;
  }
  add(e, ...t) {
    const n = t[0];
    if (n && !n?.default) {
      const s = hr(e);
      s != null && (n.default = s);
    }
    return super.add(e, ...t);
  }
};
new Uv(Tn);
function Wv(e = !0, t, n = []) {
  const s = { jumpTo: new Ct() }, r = {}, a = {}, i = (o) => {
    if (ce.isInstance(o)) {
      for (const [l, u] of Object.entries(o.fields)) if (!(l in s)) {
        if (s[l] = u, l.startsWith("_")) continue;
        xe.isInstance(u) ? (r[l] = u.inputSchema || u.valueSchema, a[l] = u.valueSchema) : (r[l] = u, a[l] = u);
      }
      return;
    }
    const c = Kt(o);
    for (const [l, u] of Object.entries(c)) {
      const d = l.startsWith("_");
      if (!(l in s)) {
        if (ei(u)) {
          const h = Tn.get(u);
          if (h?.reducer) {
            h.reducer.schema ? (s[l] = new xe(u, {
              inputSchema: h.reducer.schema,
              reducer: h.reducer.fn
            }), d || (r[l] = h.reducer.schema, a[l] = u)) : (s[l] = new xe(u, { reducer: h.reducer.fn }), d || (r[l] = u, a[l] = u));
            continue;
          }
        }
        s[l] = u, d || (r[l] = u, a[l] = u);
      }
    }
  };
  t && (ce.isInstance(t) || Q(t)) && i(t);
  for (const o of n) o.stateSchema && (ce.isInstance(o.stateSchema) || Q(o.stateSchema)) && i(o.stateSchema);
  return e && (a.structuredResponse = new Ct()), {
    state: new ce({
      messages: Gs,
      ...s
    }),
    input: new ce({
      messages: Gs,
      ...r
    }),
    output: new ce({
      messages: Gs,
      ...a
    })
  };
}
const qr = /<name>(.*?)<\/name>/s, Zr = /<content>(.*?)<\/content>/s;
function zv(e, t) {
  if (ce.isInstance(e)) {
    const n = {};
    for (const s of Object.keys(e.fields)) s in t && (n[s] = t[s]);
    return n;
  }
  if (ur(e)) return Je(e, t);
  throw new Error(`Invalid state schema type: ${typeof e}`);
}
function Gv(e) {
  if (!U.isInstance(e) || Ot.isInstance(e) || !e.name) return e;
  const { name: t } = e;
  if (typeof e.content == "string") return new U({
    ...e.lc_kwargs,
    content: `<name>${t}</name><content>${e.content}</content>`,
    name: void 0
  });
  const n = [];
  let s = 0;
  for (const r of e.content) typeof r == "string" ? (s += 1, n.push(`<name>${t}</name><content>${r}</content>`)) : typeof r == "object" && "type" in r && r.type === "text" ? (s += 1, n.push({
    ...r,
    text: `<name>${t}</name><content>${r.text}</content>`
  })) : n.push(r);
  return s || n.unshift({
    type: "text",
    text: `<name>${t}</name><content></content>`
  }), new U({
    ...e.lc_kwargs,
    content: n,
    name: void 0
  });
}
function Jv(e) {
  if (!U.isInstance(e) || !e.content) return e;
  let t = [], n;
  if (Array.isArray(e.content)) t = e.content.filter((s) => {
    if (s.type === "text" && typeof s.text == "string") {
      const r = s.text.match(qr), a = s.text.match(Zr);
      return r && (!a || a[1] === "") ? (n = r[1], !1) : !0;
    }
    return !0;
  }).map((s) => {
    if (s.type === "text" && typeof s.text == "string") {
      const r = s.text.match(qr), a = s.text.match(Zr);
      return !r || !a ? s : (n = r[1], {
        ...s,
        text: a[1]
      });
    }
    return s;
  });
  else {
    const s = e.content, r = s.match(qr), a = s.match(Zr);
    if (!r || !a) return e;
    n = r[1], t = a[1];
  }
  return new U({
    ...Object.keys(e.lc_kwargs ?? {}).length > 0 ? e.lc_kwargs : e,
    content: t,
    name: n
  });
}
function zn(e) {
  return ae.isRunnable(e);
}
function Fo(e) {
  return Ji(e) ? "bindTools" in e && typeof e.bindTools == "function" : !1;
}
const Yr = (e, t, n = {}) => {
  if (Fo(e)) return e.bindTools(t, n);
  if (Ae.isRunnableBinding(e) && Fo(e.bound)) {
    const s = e.bound.bindTools(t, n);
    return Ae.isRunnableBinding(s) ? new Ae({
      bound: s.bound,
      config: {
        ...e.config,
        ...s.config
      },
      kwargs: {
        ...e.kwargs,
        ...s.kwargs
      },
      configFactories: s.configFactories ?? e.configFactories
    }) : new Ae({
      bound: s,
      config: e.config,
      kwargs: e.kwargs,
      configFactories: e.configFactories
    });
  }
  return null;
};
function sh(e) {
  if (typeof e == "function") return;
  let t = e;
  if (pt.isRunnableSequence(t) && (t = t.steps.find((n) => Ae.isRunnableBinding(n)) || t), !lr(t)) {
    if (Ae.isRunnableBinding(t)) {
      const n = t.kwargs != null && typeof t.kwargs == "object" && "tools" in t.kwargs && Array.isArray(t.kwargs.tools) && t.kwargs.tools.length > 0, s = t.config != null && typeof t.config == "object" && "tools" in t.config && Array.isArray(t.config.tools) && t.config.tools.length > 0;
      if (n || s) throw new Ro();
    }
    if ("tools" in t && t.tools !== void 0 && Array.isArray(t.tools) && t.tools.length > 0) throw new Ro();
  }
}
function Kv(e) {
  return !!(U.isInstance(e) && e.tool_calls && e.tool_calls.length > 0);
}
function qv(e) {
  if (e == null) return new Pe("");
  if (Pe.isInstance(e)) return e;
  if (typeof e == "string") return new Pe({ content: [{
    type: "text",
    text: e
  }] });
  throw new Error(`Invalid systemPrompt type: expected string or SystemMessage, got ${typeof e}`);
}
async function Zv(e, t, n = {}) {
  const s = Yr(e, t, n);
  if (s) return s;
  if (lr(e)) {
    const r = Yr(await e._getModelInstance(), t, n);
    if (r) return r;
  }
  if (pt.isRunnableSequence(e)) {
    const r = e.steps.findIndex((a) => Ae.isRunnableBinding(a) || Ji(a) || lr(a));
    if (r >= 0) {
      const a = Yr(e.steps[r], t, n);
      if (a) {
        const i = e.steps.slice();
        return i.splice(r, 1, a), pt.from(i);
      }
    }
  }
  throw new Error(`llm ${e} must define bindTools method.`);
}
function Yv(e) {
  if (e.length === 0) return;
  if (e.length === 1) return e[0];
  function t(s, r) {
    return async (a, i) => s(a, async (c) => r(c, i));
  }
  let n = e[e.length - 1];
  for (let s = e.length - 2; s >= 0; s--) n = t(e[s], n);
  return n;
}
function Xv(e) {
  const t = e.filter((n) => n.wrapToolCall);
  if (t.length !== 0)
    return Yv(t.map((n) => {
      const s = n.wrapToolCall;
      return async (a, i) => {
        const o = a.state, c = async (l) => {
          const u = {
            ...o,
            ...l.state
          };
          return i({
            ...l,
            state: u
          });
        };
        try {
          const l = await s({
            ...a,
            /**
            * override state with the state from the specific middleware
            */
            state: {
              messages: o.messages,
              ...n.stateSchema ? zv(n.stateSchema, { ...o }) : {}
            }
          }, c);
          if (!J.isInstance(l) && !Y(l)) throw new Error(`Invalid response from "wrapToolCall" in middleware "${n.name}": expected ToolMessage or Command, got ${typeof l}`);
          return l;
        } catch (l) {
          throw Xu.wrap(l, n.name);
        }
      };
    }));
}
const Qv = [
  "tags",
  "metadata",
  "runName",
  "maxConcurrency",
  "recursionLimit",
  "configurable"
];
function eb(e) {
  const t = {};
  for (const n of Qv) {
    const s = e[n];
    s !== void 0 && (t[n] = s);
  }
  return t;
}
async function tb(e, t) {
  const n = {};
  for (const s of e) {
    if (!s.stateSchema) continue;
    let r;
    if (ce.isInstance(s.stateSchema)) {
      const o = {};
      for (const [c, l] of Object.entries(s.stateSchema.fields)) xe.isInstance(l) ? o[c] = l.inputSchema || l.valueSchema : o[c] = l;
      r = W(o);
    } else if (Q(s.stateSchema)) r = s.stateSchema;
    else continue;
    const a = await sc(nc(r, (o) => o.startsWith("_")), t);
    if (a.success) {
      Object.assign(n, a.data);
      continue;
    }
    const i = a.error.issues.filter((o) => o.code === "invalid_type").map((o) => `  - ${o.path.join(".")}: Required`).join(`
`);
    throw new Error(`Middleware "${s.name}" has required state fields that must be initialized:
${i}

To fix this, either:
1. Provide default values in your middleware's state schema using .default():
   stateSchema: z.object({
     myField: z.string().default("default value")
   })

2. Or make the fields optional using .optional():
   stateSchema: z.object({
     myField: z.string().optional()
   })

3. Or ensure you pass these values when invoking the agent:
   agent.invoke({
     messages: [...],
     ${a.error.issues[0]?.path.join(".")}: "value"
   })`);
  }
  return n;
}
function nb(e) {
  const t = {
    messages: oi(() => []),
    structuredResponse: un().optional()
  };
  if (!e) return W(t);
  let n;
  if (ce.isInstance(e)) {
    n = {};
    for (const [r, a] of Object.entries(e.fields)) xe.isInstance(a) ? n[r] = a.inputSchema || a.valueSchema : n[r] = a;
  } else if (Q(e)) n = Kt(e);
  else return W(t);
  const s = { ...t };
  for (const [r, a] of Object.entries(n)) r.startsWith("_") ? s[r] = a.optional() : s[r] = a;
  return W(s);
}
function sb(e) {
  if (Q(e)) return pn(e);
  if (ce.isInstance(e)) {
    const t = {};
    for (const [n, s] of Object.entries(e.fields)) {
      let r;
      xe.isInstance(s) ? r = s.inputSchema || s.valueSchema : r = s, t[n] = ei(r) ? r.optional() : un().optional();
    }
    return W(t);
  }
  return W({});
}
function Be(e) {
  if (e) {
    if ([
      "model_request",
      "tools",
      D
    ].includes(e)) return e;
    if (e === "model") return "model_request";
    if (e === "tools") return "tools";
    if (e === "end") return D;
    throw new Error(`Invalid jump target: ${e}, must be "model", "tools" or "end".`);
  }
}
function rh(...e) {
  return AbortSignal.any(e.filter((t) => t != null && typeof t == "object" && "aborted" in t && typeof t.aborted == "boolean"));
}
var Ki = class extends ae {
  lc_namespace = ["langgraph"];
  func;
  tags;
  config;
  trace = !0;
  recurse = !0;
  #e;
  constructor(e) {
    super(), this.name = e.name ?? e.func.name, this.func = e.func, this.config = e.tags ? { tags: e.tags } : void 0, this.recurse = e.recurse ?? this.recurse;
  }
  getState() {
    return this.#e;
  }
  /**
  * This allows us to set the state of the runnable, e.g. for model and middleware nodes.
  * @internal
  */
  setState(e) {
    this.#e = {
      ...this.#e,
      ...e
    };
  }
  async invoke(e, t) {
    const n = oe(this.config, t), s = await le.runWithConfig(n, async () => this.func(e, n));
    return ae.isRunnable(s) && this.recurse ? await le.runWithConfig(n, async () => s.invoke(e, n)) : (this.#e = s, s);
  }
};
function rb(e, t) {
  let n, s;
  if (t === "inline")
    n = Gv, s = Jv;
  else throw new Error(`Invalid agent name mode: ${t}. Needs to be one of: "inline"`);
  function r(a) {
    return a.map(n);
  }
  return pt.from([
    dt.from(r),
    e,
    dt.from(s)
  ]);
}
function ab(e) {
  return U.isInstance(e) || Y(e) || typeof e == "object" && e !== null && "structuredResponse" in e && "messages" in e;
}
const me = "model_request";
var ib = class extends Ki {
  #e;
  #t;
  constructor(e) {
    super({
      name: e.name ?? "model",
      func: (t, n) => this.#n(t, n)
    }), this.#e = e, this.#t = e.systemMessage;
  }
  /**
  * Returns response format primtivies based on given model and response format provided by the user.
  *
  * If the user selects a tool output:
  * - return a record of tools to extract structured output from the model's response
  *
  * if the user selects a native schema output or if the model supports JSON schema output:
  * - return a provider strategy to extract structured output from the model's response
  *
  * @param model - The model to get the response format for.
  * @returns The response format.
  */
  async #s(e, t = this.#e.responseFormat) {
    if (!t) return;
    let n;
    lr(e) ? n = await e._getModelInstance() : typeof e != "string" && (n = e);
    const s = $v(t, void 0, n);
    if (s.length !== 0)
      return s.every((r) => r instanceof ln) ? {
        type: "native",
        /**
        * there can only be one provider strategy
        */
        strategy: s[0]
      } : {
        type: "tool",
        tools: s.filter((r) => r instanceof it).reduce((r, a) => (r[a.name] = a, r), {})
      };
  }
  async #n(e, t) {
    const n = e.messages.at(-1);
    if (n && J.isInstance(n) && n.name && this.#e.shouldReturnDirect.has(n.name)) return [new ee({ update: { messages: [] } })];
    const { response: s, lastAiMessage: r, collectedCommands: a } = await this.#r(e, t);
    if (typeof s == "object" && s !== null && "structuredResponse" in s && "messages" in s) {
      const { structuredResponse: c, messages: l } = s;
      return {
        messages: [...e.messages, ...l],
        structuredResponse: c
      };
    }
    const i = [], o = U.isInstance(s) ? s : r;
    return o && (o.name = this.name, o.lc_kwargs.name = this.name, this.#l(e, o) ? i.push(new ee({ update: { messages: [new U({
      content: "Sorry, need more steps to process this request.",
      name: this.name,
      id: o.id
    })] } })) : i.push(new ee({ update: { messages: [o] } }))), Y(s) && !a.includes(s) && i.push(s), i.push(...a), i;
  }
  /**
  * Derive the model from the options.
  * @param state - The state of the agent.
  * @param config - The config of the agent.
  * @returns The model.
  */
  #a() {
    if (typeof this.#e.model == "string") return im(this.#e.model);
    if (this.#e.model) return this.#e.model;
    throw new Error("No model option was provided, either via `model` option.");
  }
  async #r(e, t, n = {}) {
    const s = await this.#a(), r = t;
    let a = this.#t, i = null;
    const o = [], c = async (h) => {
      sh(h.model);
      const f = await this.#s(h.model, h.responseFormat), p = await this.#u(h.model, h, f), m = [...a.text === "" ? [] : [a], ...h.messages], g = rh(this.#e.signal, t.signal), y = await oc(p.invoke(m, {
        ...t,
        signal: g
      }), g);
      if (i = y, f?.type === "native") {
        const v = f.strategy.parse(y);
        if (v) return {
          structuredResponse: v,
          messages: [y]
        };
        if (!y.tool_calls || y.tool_calls.length === 0) throw new Zu(typeof f.strategy.schema?.title == "string" ? f.strategy.schema.title : "providerStrategy", ["Model output did not satisfy the provided response schema."]);
        return y;
      }
      if (!f || !y.tool_calls) return y;
      const _ = y.tool_calls.filter((v) => v.name in f.tools);
      if (_.length === 0) return y;
      if (_.length > 1) return this.#c(y, _, f);
      const b = f.tools[_[0].name]?.options?.toolMessageContent;
      return this.#i(y, _[0], f, b ?? n.lastMessage);
    }, l = this.#e.wrapModelCallHookMiddleware ?? [];
    let u = c;
    for (let h = l.length - 1; h >= 0; h--) {
      const f = l[h], p = Array.isArray(f) ? f[0] : f;
      if (p.wrapModelCall) {
        const m = u, g = p;
        u = async (y) => {
          const _ = a, b = g.contextSchema ? Je(g.contextSchema, r?.context || {}) : r?.context, v = Object.freeze({
            context: b,
            store: r.store,
            configurable: r.configurable,
            writer: r.writer,
            interrupt: r.interrupt,
            signal: r.signal
          }), M = {
            ...y,
            state: {
              ...p.stateSchema ? Je(sb(p.stateSchema), e) : {},
              messages: e.messages
            },
            runtime: v
          }, I = async (w) => {
            a = _;
            const C = w.tools ?? [], O = new Map(this.#e.toolClasses.filter(zn).map(($) => [$.name, $])), A = C.filter(($) => zn($) && !O.has($.name)), B = C.filter(($) => {
              if (!zn($)) return !1;
              const S = O.get($.name);
              return S != null && S !== $;
            });
            if (A.length > 0 && !this.#e.middleware?.some(($) => $.wrapToolCall != null))
              throw new Error(`You have added a new tool in "wrapModelCall" hook of middleware "${g.name}": ${A.map(($) => $.name).join(", ")}. This is not supported unless a middleware provides a "wrapToolCall" handler to execute it.`);
            if (B.length > 0) throw new Error(`You have modified a tool in "wrapModelCall" hook of middleware "${g.name}": ${B.map(($) => $.name).join(", ")}. This is not supported.`);
            let k = w;
            const P = w.systemPrompt !== a.text, T = w.systemMessage !== a;
            if (P && T) throw new Error("Cannot change both systemPrompt and systemMessage in the same request.");
            P && (a = new Pe({ content: [{
              type: "text",
              text: w.systemPrompt
            }] }), k = {
              ...w,
              systemPrompt: a.text,
              systemMessage: a
            }), T && (a = new Pe({ ...w.systemMessage }), k = {
              ...w,
              systemPrompt: a.text,
              systemMessage: a
            });
            const N = await m(k);
            return Y(N) && i ? (o.includes(N) || o.push(N), i) : N;
          };
          if (!g.wrapModelCall) return I(M);
          try {
            const w = await g.wrapModelCall(M, I);
            if (!ab(w)) throw new Error(`Invalid response from "wrapModelCall" in middleware "${g.name}": expected AIMessage or Command, got ${typeof w}`);
            return U.isInstance(w) ? i = w : Y(w) && o.push(w), w;
          } catch (w) {
            throw Xu.wrap(w, g.name);
          }
        };
      }
    }
    a = this.#t;
    const d = {
      model: s,
      responseFormat: this.#e.responseFormat,
      systemPrompt: a?.text,
      systemMessage: a,
      messages: e.messages,
      tools: this.#e.toolClasses,
      state: e,
      runtime: Object.freeze({
        context: r?.context,
        store: r.store,
        configurable: r.configurable,
        writer: r.writer,
        interrupt: r.interrupt,
        signal: r.signal
      })
    };
    return {
      response: await u(d),
      lastAiMessage: i,
      collectedCommands: o
    };
  }
  /**
  * If the model returns multiple structured outputs, we need to handle it.
  * @param response - The response from the model
  * @param toolCalls - The tool calls that were made
  * @returns The response from the model
  */
  #c(e, t, n) {
    const s = new $o(t.map((r) => r.name));
    return this.#o(s, e, t[0], n);
  }
  /**
  * If the model returns a single structured output, we need to handle it.
  * @param toolCall - The tool call that was made
  * @returns The structured response and a message to the LLM if needed
  */
  #i(e, t, n, s) {
    const r = n.tools[t.name];
    try {
      const a = r.parse(t.args);
      return {
        structuredResponse: a,
        messages: [
          e,
          new J({
            tool_call_id: t.id ?? "",
            content: JSON.stringify(a),
            name: t.name
          }),
          new U(s ?? `Returning structured response: ${JSON.stringify(a)}`)
        ]
      };
    } catch (a) {
      return this.#o(a, e, t, n);
    }
  }
  async #o(e, t, n, s) {
    const r = Object.values(s.tools).at(0)?.options?.handleError, a = n.id;
    if (!a) throw new Error("Tool call ID is required to handle tool output errors. Please provide a tool call ID.");
    if (r === !1) throw e;
    if (r === void 0 || typeof r == "boolean" && r || Array.isArray(r) && r.some((i) => i instanceof $o)) return new ee({
      update: { messages: [t, new J({
        content: e.message,
        tool_call_id: a
      })] },
      goto: me
    });
    if (typeof r == "string") return new ee({
      update: { messages: [t, new J({
        content: r,
        tool_call_id: a
      })] },
      goto: me
    });
    if (typeof r == "function") {
      const i = await r(e);
      if (typeof i != "string") throw new Error("Error handler must return a string.");
      return new ee({
        update: { messages: [t, new J({
          content: i,
          tool_call_id: a
        })] },
        goto: me
      });
    }
    return new ee({
      update: { messages: [t, new J({
        content: e.message,
        tool_call_id: a
      })] },
      goto: me
    });
  }
  #l(e, t) {
    const n = U.isInstance(t) && t.tool_calls?.every((r) => this.#e.shouldReturnDirect.has(r.name)), s = "remainingSteps" in e ? e.remainingSteps : void 0;
    return !!(s && (s < 1 && n || s < 2 && Kv(e.messages.at(-1))));
  }
  async #u(e, t, n) {
    const s = {}, r = Object.values(n && "tools" in n ? n.tools : {}), a = [...t?.tools ?? this.#e.toolClasses, ...r.map((c) => c.tool)], i = t?.toolChoice || (r.length > 0 ? "any" : void 0);
    if (n?.type === "native") {
      const c = t?.modelSettings?.strict ?? n?.strategy?.strict ?? !0, l = {
        name: n.strategy.schema?.name ?? "extract",
        description: Ks(n.strategy.schema),
        schema: n.strategy.schema,
        strict: c
      };
      Object.assign(s, {
        /**
        * OpenAI-style options
        * Used by ChatOpenAI, ChatXAI, and other OpenAI-compatible providers.
        */
        response_format: {
          type: "json_schema",
          json_schema: l
        },
        /**
        * Anthropic-style options
        */
        outputConfig: { format: {
          type: "json_schema",
          schema: n.strategy.schema
        } },
        /**
        * Google-style options
        * Used by ChatGoogle and other Gemini-based providers.
        */
        responseSchema: n.strategy.schema,
        /**
        * for LangSmith structured output tracing
        */
        ls_structured_output_format: {
          kwargs: { method: "json_schema" },
          schema: n.strategy.schema
        },
        /**
        * Don't force strict on tools: it makes Anthropic's combined grammar
        * "too complex for compilation", and only OpenAI Chat Completions needs
        * it (re-applied there). Honor an explicit override; else leave unset.
        */
        strict: t?.modelSettings?.strict
      });
    }
    const o = await Zv(e, a, {
      ...s,
      ...t?.modelSettings,
      tool_choice: i
    });
    return this.#e.includeAgentName === "inline" ? rb(o, this.#e.includeAgentName) : o;
  }
  /**
  * Returns internal bookkeeping state for StateManager, not graph output.
  * The return shape differs from the node's output type (Command).
  */
  getState() {
    const e = super.getState();
    return {
      messages: [],
      ...e && !Y(e) ? e : {}
    };
  }
};
const Vo = (e, t) => `Error: ${e} is not a valid tool, try one of [${t.join(", ")}].`, Se = "tools", ah = (e) => Array.isArray(e) && e.every(ve.isInstance), ob = (e) => typeof e == "object" && e != null && "messages" in e && ah(e.messages), cb = (e) => typeof e == "object" && e != null && "lg_tool_call" in e;
function lb(e, t) {
  return e instanceof Yu ? new J({
    content: e.message,
    tool_call_id: t.id,
    name: t.name
  }) : new J({
    content: `${e}
 Please fix your mistakes.`,
    tool_call_id: t.id,
    name: t.name
  });
}
var ub = class extends Ki {
  tools;
  trace = !1;
  signal;
  handleToolErrors = lb;
  wrapToolCall;
  constructor(e, t) {
    const { name: n, tags: s, handleToolErrors: r, signal: a, wrapToolCall: i } = t ?? {};
    super({
      name: n,
      tags: s,
      func: (o, c) => this.run(o, c)
    }), this.options = t, this.tools = e, this.handleToolErrors = r ?? this.handleToolErrors, this.signal = a, this.wrapToolCall = i;
  }
  /**
  * Handle errors from tool execution or middleware.
  * @param error - The error to handle
  * @param call - The tool call that caused the error
  * @param isMiddlewareError - Whether the error came from wrapToolCall middleware
  * @returns ToolMessage if error is handled, otherwise re-throws
  */
  #e(e, t, n) {
    if (Et(e) || this.signal?.aborted || n && this.handleToolErrors !== !0 || !this.handleToolErrors) throw e;
    if (typeof this.handleToolErrors == "function") {
      const s = this.handleToolErrors(e, t);
      if (s && J.isInstance(s)) return s;
      throw e;
    } else if (this.handleToolErrors) return new J({
      name: t.name,
      content: `${e}
 Please fix your mistakes.`,
      tool_call_id: t.id
    });
    throw e;
  }
  async runTool(e, t, n) {
    const s = t, r = {
      context: s?.context,
      store: s?.store,
      configurable: s?.configurable,
      writer: s?.writer,
      interrupt: s?.interrupt,
      signal: s?.signal
    }, a = this.tools.find((c) => c.name === e.name), i = async (c) => {
      const { toolCall: l, tool: u } = c, d = u ?? this.tools.find((f) => f.name === l.name);
      if (d === void 0) {
        const f = this.tools.map((p) => p.name);
        return new J({
          content: Vo(l.name, f),
          tool_call_id: l.id,
          name: l.name,
          status: "error"
        });
      }
      const h = d;
      try {
        const f = await h.invoke({
          ...l,
          type: "tool_call"
        }, {
          ...t,
          /**
          * extend to match ToolRuntime
          */
          config: t,
          toolCallId: l.id,
          state: t.configurable?.__pregel_scratchpad?.currentTaskInput,
          signal: rh(this.signal, t.signal)
        });
        return J.isInstance(f) || Y(f) ? f : new J({
          name: h.name,
          content: typeof f == "string" ? f : JSON.stringify(f),
          tool_call_id: l.id
        });
      } catch (f) {
        throw f instanceof qs ? new Yu(f, l) : f;
      }
    }, o = {
      toolCall: e,
      tool: a,
      state: n,
      runtime: r
    };
    if (this.wrapToolCall) try {
      return await this.wrapToolCall(o, i);
    } catch (c) {
      return this.#e(c, e, !0);
    }
    if (!a) {
      const c = this.tools.map((l) => l.name);
      return new J({
        content: Vo(e.name, c),
        tool_call_id: e.id,
        name: e.name,
        status: "error"
      });
    }
    try {
      return await i(o);
    } catch (c) {
      return this.#e(c, e, !1);
    }
  }
  async run(e, t) {
    let n;
    if (cb(e)) {
      const { lg_tool_call: a, jumpTo: i, ...o } = e;
      n = [await this.runTool(e.lg_tool_call, t, o)];
    } else {
      let a;
      if (ah(e)) a = e;
      else if (ob(e)) a = e.messages;
      else throw new Error("ToolNode only accepts BaseMessage[] or { messages: BaseMessage[] } as input.");
      const i = new Set(a.filter((c) => c.getType() === "tool").map((c) => c.tool_call_id));
      let o;
      for (let c = a.length - 1; c >= 0; c -= 1) {
        const l = a[c];
        if (U.isInstance(l)) {
          o = l;
          break;
        }
      }
      if (!U.isInstance(o)) throw new Error("ToolNode only accepts AIMessages as input.");
      n = await Promise.all(o.tool_calls?.filter((c) => c.id == null || !i.has(c.id)).map((c) => this.runTool(c, t, e)) ?? []);
    }
    if (!n.some(Y)) return Array.isArray(e) ? n : { messages: n };
    const s = [];
    let r = null;
    for (const a of n) Y(a) ? a.graph === ee.PARENT && Array.isArray(a.goto) && a.goto.every((i) => hb(i)) ? r ? r.goto.push(...a.goto) : r = new ee({
      graph: ee.PARENT,
      goto: a.goto
    }) : s.push(a) : s.push(Array.isArray(e) ? [a] : { messages: [a] });
    return r && s.push(r), s;
  }
};
function hb(e) {
  return e instanceof de;
}
var db = class {
}, fb = class {
}, xr = class extends Ki {
  constructor(e) {
    super(e);
  }
  async invokeMiddleware(e, t) {
    let n = {};
    if (this.middleware.contextSchema && Q(this.middleware.contextSchema)) {
      const c = Kt(this.middleware.contextSchema);
      if (c) {
        const l = {}, u = t?.context || {};
        for (const d of Object.keys(c)) d in u && (l[d] = u[d]);
        n = Je(this.middleware.contextSchema, l);
      }
    }
    const s = {
      ...e,
      /**
      * don't overwrite possible outdated messages from other middleware nodes
      */
      messages: e.messages
    }, r = {
      context: n,
      store: t?.store,
      configurable: t?.configurable,
      writer: t?.writer,
      interrupt: t?.interrupt,
      signal: t?.signal
    }, a = await this.runHook(
      s,
      /**
      * assign runtime and context values into empty named class
      * instances to create a better error message.
      */
      Object.freeze(Object.assign(new fb(), {
        ...r,
        context: Object.freeze(Object.assign(new db(), n))
      }))
    );
    if (!a) return { jumpTo: void 0 };
    let i, o;
    if (this.name?.startsWith("BeforeAgentNode_") ? (i = xt(this.middleware.beforeAgent), o = "beforeAgent.canJumpTo") : this.name?.startsWith("BeforeModelNode_") ? (i = xt(this.middleware.beforeModel), o = "beforeModel.canJumpTo") : this.name?.startsWith("AfterAgentNode_") ? (i = xt(this.middleware.afterAgent), o = "afterAgent.canJumpTo") : this.name?.startsWith("AfterModelNode_") && (i = xt(this.middleware.afterModel), o = "afterModel.canJumpTo"), typeof a.jumpTo == "string" && !i?.includes(a.jumpTo)) {
      const c = i && i.length > 0 ? `must be one of: ${i?.join(", ")}.` : o ? `no ${o} defined in middleware ${this.middleware.name}` : "";
      throw new Error(`Invalid jump target: ${a.jumpTo}, ${c}.`);
    }
    if (typeof a == "object" && "type" in a) {
      if (a.type === "terminate") {
        if (a.error) throw a.error;
        return {
          ...s,
          ...a.result || {},
          jumpTo: a.jumpTo
        };
      }
      throw new Error(`Invalid control action: ${JSON.stringify(a)}`);
    }
    return {
      ...s,
      ...a,
      jumpTo: a.jumpTo
    };
  }
  get nodeOptions() {
    return { input: nb(this.middleware.stateSchema) };
  }
}, pb = class extends xr {
  lc_namespace = [
    "langchain",
    "agents",
    "beforeAgentNodes"
  ];
  constructor(e) {
    super({
      name: `BeforeAgentNode_${e.name}`,
      func: async (t, n) => this.invokeMiddleware(t, n)
    }), this.middleware = e;
  }
  runHook(e, t) {
    return Tr(this.middleware.beforeAgent)(e, t);
  }
}, mb = class extends xr {
  lc_namespace = [
    "langchain",
    "agents",
    "beforeModelNodes"
  ];
  constructor(e) {
    super({
      name: `BeforeModelNode_${e.name}`,
      func: async (t, n) => this.invokeMiddleware(t, n)
    }), this.middleware = e;
  }
  runHook(e, t) {
    return Tr(this.middleware.beforeModel)(e, t);
  }
}, gb = class extends xr {
  lc_namespace = [
    "langchain",
    "agents",
    "afterModelNodes"
  ];
  constructor(e) {
    super({
      name: `AfterModelNode_${e.name}`,
      func: async (t, n) => this.invokeMiddleware(t, n)
    }), this.middleware = e;
  }
  runHook(e, t) {
    return Tr(this.middleware.afterModel)(e, t);
  }
}, yb = class extends xr {
  lc_namespace = [
    "langchain",
    "agents",
    "afterAgentNodes"
  ];
  constructor(e) {
    super({
      name: `AfterAgentNode_${e.name}`,
      func: async (t, n) => this.invokeMiddleware(t, n)
    }), this.middleware = e;
  }
  runHook(e, t) {
    return Tr(this.middleware.afterAgent)(e, t);
  }
}, _b = class ih {
  #e;
  #t = "v2";
  #s;
  #n;
  constructor(t, n) {
    if (this.options = t, this.#n = oe(n ?? {}, {
      metadata: { ls_integration: "langchain_create_agent" },
      configurable: { ls_agent_type: "root" }
    }), t.name && (this.#n = oe(this.#n, { metadata: { lc_agent_name: t.name } })), this.#t = t.version ?? this.#t, !t.model) throw new Error("`model` option is required to create an agent.");
    typeof t.model != "string" && sh(t.model);
    const s = this.options.middleware?.filter((k) => k.tools).flatMap((k) => k.tools) ?? [], r = [...t.tools ?? [], ...s], a = new Set(r.filter(zn).filter((k) => "returnDirect" in k && k.returnDirect).map((k) => k.name)), i = !!this.options.middleware?.some((k) => k.wrapModelCall), { state: o, input: c, output: l } = Wv(this.options.responseFormat !== void 0 || i, this.options.stateSchema, this.options.middleware), u = new Gi(o, {
      input: c,
      output: l,
      context: this.options.contextSchema
    }), d = [], h = [], f = [], p = [], m = [];
    this.#s = new ib({
      model: this.options.model,
      systemMessage: qv(this.options.systemPrompt),
      includeAgentName: this.options.includeAgentName,
      name: this.options.name,
      responseFormat: this.options.responseFormat,
      middleware: this.options.middleware,
      toolClasses: r,
      shouldReturnDirect: a,
      signal: this.options.signal,
      wrapModelCallHookMiddleware: m
    });
    const g = /* @__PURE__ */ new Set(), y = this.options.middleware ?? [];
    for (let k = 0; k < y.length; k++) {
      let P, T, N, $;
      const S = y[k];
      if (g.has(S.name)) throw new Error(`Middleware ${S.name} is defined multiple times`);
      if (g.add(S.name), S.beforeAgent) {
        P = new pb(S);
        const E = `${S.name}.before_agent`;
        d.push({
          index: k,
          name: E,
          allowed: xt(S.beforeAgent)
        }), u.addNode(E, P, P.nodeOptions);
      }
      if (S.beforeModel) {
        T = new mb(S);
        const E = `${S.name}.before_model`;
        h.push({
          index: k,
          name: E,
          allowed: xt(S.beforeModel)
        }), u.addNode(E, T, T.nodeOptions);
      }
      if (S.afterModel) {
        N = new gb(S);
        const E = `${S.name}.after_model`;
        f.push({
          index: k,
          name: E,
          allowed: xt(S.afterModel)
        }), u.addNode(E, N, N.nodeOptions);
      }
      if (S.afterAgent) {
        $ = new yb(S);
        const E = `${S.name}.after_agent`;
        p.push({
          index: k,
          name: E,
          allowed: xt(S.afterAgent)
        }), u.addNode(E, $, $.nodeOptions);
      }
      S.wrapModelCall && m.push(S);
    }
    u.addNode(me, this.#s);
    const _ = y.some((k) => k.wrapToolCall), b = r.filter(zn);
    if (b.length > 0 || _) {
      const k = new ub(b, {
        signal: this.options.signal,
        wrapToolCall: Xv(y)
      });
      u.addNode(Se, k);
    }
    let v;
    d.length > 0 ? v = d[0].name : h.length > 0 ? v = h[0].name : v = me;
    const M = h.length > 0 ? h[0].name : me, I = p.length > 0 ? p[p.length - 1].name : D;
    u.addEdge(te, v);
    const w = b.length > 0 || _;
    for (let k = 0; k < d.length; k++) {
      const P = d[k], T = P.name, N = k === d.length - 1 ? M : d[k + 1].name;
      if (P.allowed && P.allowed.length > 0) {
        const $ = P.allowed.map((E) => Be(E)).filter((E) => E !== "tools" || w), S = Array.from(/* @__PURE__ */ new Set([N, ...$.map((E) => E === D ? I : E)]));
        u.addConditionalEdges(T, this.#l(b, N, I, w), S);
      } else u.addEdge(T, N);
    }
    for (let k = 0; k < h.length; k++) {
      const P = h[k], T = P.name, N = k === h.length - 1 ? me : h[k + 1].name;
      if (P.allowed && P.allowed.length > 0) {
        const $ = P.allowed.map((E) => Be(E)).filter((E) => E !== "tools" || w), S = Array.from(/* @__PURE__ */ new Set([N, ...$]));
        u.addConditionalEdges(T, this.#u(b, N, w), S);
      } else u.addEdge(T, N);
    }
    const C = f.at(-1);
    if (f.length > 0 && C) u.addEdge(me, C.name);
    else {
      const k = this.#a(b, !1, w).map((P) => P === D ? I : P);
      k.length === 1 ? u.addEdge(me, k[0]) : u.addConditionalEdges(me, this.#c(I), k);
    }
    for (let k = f.length - 1; k > 0; k--) {
      const P = f[k], T = P.name, N = f[k - 1].name;
      if (P.allowed && P.allowed.length > 0) {
        const $ = P.allowed.map((E) => Be(E)).filter((E) => E !== "tools" || w), S = Array.from(/* @__PURE__ */ new Set([N, ...$]));
        u.addConditionalEdges(T, this.#o(b, P.allowed, N, w), S);
      } else u.addEdge(T, N);
    }
    if (f.length > 0) {
      const k = f[0], P = k.name, T = this.#a(b, !0, w).filter((S) => S !== "tools" || w), N = !!(k.allowed && k.allowed.length > 0), $ = T.map((S) => S === D ? I : S);
      u.addConditionalEdges(P, this.#i(b, N, I, w), $);
    }
    for (let k = p.length - 1; k > 0; k--) {
      const P = p[k], T = P.name, N = p[k - 1].name;
      if (P.allowed && P.allowed.length > 0) {
        const $ = P.allowed.map((E) => Be(E)).filter((E) => E !== "tools" || w), S = Array.from(/* @__PURE__ */ new Set([N, ...$]));
        u.addConditionalEdges(T, this.#o(b, P.allowed, N, w), S);
      } else u.addEdge(T, N);
    }
    if (p.length > 0) {
      const k = p[0], P = k.name;
      if (k.allowed && k.allowed.length > 0) {
        const T = k.allowed.map(($) => Be($)).filter(($) => $ !== "tools" || w), N = Array.from(/* @__PURE__ */ new Set([D, ...T]));
        u.addConditionalEdges(P, this.#o(b, k.allowed, D, w), N);
      } else u.addEdge(P, D);
    }
    if (w) {
      const k = M;
      a.size > 0 ? u.addConditionalEdges(Se, this.#r(a, I, k), [k, I]) : u.addEdge(Se, k);
    }
    const O = (this.options.middleware ?? []).flatMap((k) => k.streamTransformers ?? []), A = [
      th([]),
      nh([]),
      ...O,
      ...this.options.streamTransformers ?? []
    ];
    this.#e = u.compile({
      checkpointer: this.options.checkpointer,
      store: this.options.store,
      name: this.options.name,
      description: this.options.description,
      transformers: A
    });
    const B = eb(this.#n);
    Object.keys(B).length > 0 && (this.#e = this.#e.withConfig(B));
  }
  /**
  * Get the compiled {@link https://docs.langchain.com/oss/javascript/langgraph/use-graph-api | StateGraph}.
  */
  get graph() {
    return this.#e;
  }
  get checkpointer() {
    return this.#e.checkpointer;
  }
  set checkpointer(t) {
    this.#e.checkpointer = t;
  }
  get store() {
    return this.#e.store;
  }
  set store(t) {
    this.#e.store = t;
  }
  /**
  * Creates a new ReactAgent with the given config merged into the existing config.
  * Follows the same pattern as LangGraph's Pregel.withConfig().
  *
  * The merged config is applied as a default that gets merged with any config
  * passed at invocation time (invoke/stream). Invocation-time config takes precedence.
  *
  * @param config - Configuration to merge with existing config
  * @returns A new ReactAgent instance with the merged configuration
  *
  * @example
  * ```typescript
  * const agent = createAgent({ model: "gpt-4o", tools: [...] });
  *
  * // Set a default recursion limit
  * const configuredAgent = agent.withConfig({ recursionLimit: 1000 });
  *
  * // Chain multiple configs
  * const debugAgent = agent
  *   .withConfig({ recursionLimit: 1000 })
  *   .withConfig({ tags: ["debug"] });
  * ```
  */
  withConfig(t) {
    return new ih(this.options, oe(this.#n, t));
  }
  /**
  * Get possible edge destinations from model node.
  * @param toolClasses names of tools to call
  * @param includeModelRequest whether to include "model_request" as a valid path (for jumpTo routing)
  * @param hasToolsAvailable whether tools are available (includes dynamic tools via middleware)
  * @returns list of possible edge destinations
  */
  #a(t, n = !1, s = t.length > 0) {
    const r = [];
    return s && r.push(Se), n && r.push(me), r.push(D), r;
  }
  /**
  * Create routing function for tools node conditional edges.
  */
  #r(t, n, s) {
    return (r) => {
      const a = r.messages, i = a[a.length - 1];
      return J.isInstance(i) && i.name && t.has(i.name) ? this.options.responseFormat ? s : n : s;
    };
  }
  /**
  * Create routing function for model node conditional edges.
  * @param exitNode - The exit node to route to (could be after_agent or END)
  */
  #c(t = D) {
    return (n) => {
      const s = n.messages.at(-1);
      if (!U.isInstance(s) || !s.tool_calls || s.tool_calls.length === 0 || s.tool_calls.every((a) => a.name.startsWith("extract-"))) return t;
      if (this.#t === "v1") return Se;
      const r = s.tool_calls.filter((a) => !a.name.startsWith("extract-"));
      return r.length === 0 ? t : r.map((a) => new de(Se, {
        ...n,
        lg_tool_call: a
      }));
    };
  }
  /**
  * Create routing function for jumpTo functionality after afterModel hooks.
  *
  * This router checks if the `jumpTo` property is set in the state after afterModel middleware
  * execution. If set, it routes to the specified target ("model_request" or "tools").
  * If not set, it falls back to the normal model routing logic for afterModel context.
  *
  * The jumpTo property is automatically cleared after use to prevent infinite loops.
  *
  * @param toolClasses - Available tool classes for validation
  * @param allowJump - Whether jumping is allowed
  * @param exitNode - The exit node to route to (could be after_agent or END)
  * @param hasToolsAvailable - Whether tools are available (includes dynamic tools via middleware)
  * @returns Router function that handles jumpTo logic and normal routing
  */
  #i(t, n, s, r = t.length > 0) {
    const a = !!this.options.responseFormat;
    return (i) => {
      const o = i, c = o.messages, l = c.at(-1);
      if (U.isInstance(l) && (!l.tool_calls || l.tool_calls.length === 0)) return s;
      if (n && o.jumpTo) {
        const y = Be(o.jumpTo);
        return y === D ? s : y === "tools" ? r ? new de(Se, {
          ...i,
          jumpTo: void 0
        }) : s : new de(me, {
          ...i,
          jumpTo: void 0
        });
      }
      const u = c.filter(J.isInstance), d = c.filter(U.isInstance).at(-1), h = d?.tool_calls?.filter((y) => !u.some((_) => _.tool_call_id === y.id));
      if (h && h.length > 0)
        return this.#t === "v1" ? Se : h.map((y) => new de(Se, {
          ...i,
          lg_tool_call: y
        }));
      const f = d?.tool_calls?.some((y) => y.name.startsWith("extract-"));
      if (h && h.length === 0 && !f && a) return me;
      if (!U.isInstance(l) || !l.tool_calls || l.tool_calls.length === 0) return s;
      const p = l.tool_calls.every((y) => y.name.startsWith("extract-")), m = l.tool_calls.some((y) => !y.name.startsWith("extract-"));
      if (p || !m) return s;
      if (this.#t === "v1") return Se;
      const g = l.tool_calls.filter((y) => !y.name.startsWith("extract-"));
      return g.length === 0 ? s : g.map((y) => new de(Se, {
        ...i,
        lg_tool_call: y
      }));
    };
  }
  /**
  * Router for afterModel sequence nodes (connecting later middlewares to earlier ones),
  * honoring allowed jump targets and defaulting to the next node.
  * @param toolClasses - Available tool classes for validation
  * @param allowed - List of allowed jump targets
  * @param nextDefault - Default node to route to
  * @param hasToolsAvailable - Whether tools are available (includes dynamic tools via middleware)
  */
  #o(t, n, s, r = t.length > 0) {
    const a = new Set(n.map((i) => Be(i)));
    return (i) => {
      const o = i;
      if (o.jumpTo) {
        const c = Be(o.jumpTo);
        if (c === D && a.has(D)) return D;
        if (c === "tools" && a.has("tools"))
          return r ? new de(Se, {
            ...i,
            jumpTo: void 0
          }) : D;
        if (c === "model_request" && a.has("model_request")) return new de(me, {
          ...i,
          jumpTo: void 0
        });
      }
      return s;
    };
  }
  /**
  * Create routing function for jumpTo functionality after beforeAgent hooks.
  * Falls back to the default next node if no jumpTo is present.
  * When jumping to END, routes to exitNode (which could be an afterAgent node).
  * @param toolClasses - Available tool classes for validation
  * @param nextDefault - Default node to route to
  * @param exitNode - Exit node to route to (could be after_agent or END)
  * @param hasToolsAvailable - Whether tools are available (includes dynamic tools via middleware)
  */
  #l(t, n, s, r = t.length > 0) {
    return (a) => {
      const i = a;
      if (!i.jumpTo) return n;
      const o = Be(i.jumpTo);
      return o === D ? s : o === "tools" ? r ? new de(Se, {
        ...a,
        jumpTo: void 0
      }) : s : new de(me, {
        ...a,
        jumpTo: void 0
      });
    };
  }
  /**
  * Create routing function for jumpTo functionality after beforeModel hooks.
  * Falls back to the default next node if no jumpTo is present.
  * @param toolClasses - Available tool classes for validation
  * @param nextDefault - Default node to route to
  * @param hasToolsAvailable - Whether tools are available (includes dynamic tools via middleware)
  */
  #u(t, n, s = t.length > 0) {
    return (r) => {
      const a = r;
      if (!a.jumpTo) return n;
      const i = Be(a.jumpTo);
      return i === D ? D : i === "tools" ? s ? new de(Se, {
        ...r,
        jumpTo: void 0
      }) : D : new de(me, {
        ...r,
        jumpTo: void 0
      });
    };
  }
  /**
  * Initialize middleware states if not already present in the input state.
  */
  async #h(t, n) {
    if (!this.options.middleware || this.options.middleware.length === 0 || t instanceof ee || !t) return t;
    const s = await tb(this.options.middleware, t), r = {
      ...(await this.#e.getState(n).catch(() => ({ values: {} }))).values,
      ...t
    };
    if (!r) return r;
    for (const [a, i] of Object.entries(s)) a in r || (r[a] = i);
    return r;
  }
  /**
  * Executes the agent with the given state and returns the final state after all processing.
  *
  * This method runs the agent's entire workflow synchronously, including:
  * - Processing the input messages through any configured middleware
  * - Calling the language model to generate responses
  * - Executing any tool calls made by the model
  * - Running all middleware hooks (beforeModel, afterModel, etc.)
  *
  * @param state - The initial state for the agent execution. Can be:
  *   - An object containing `messages` array and any middleware-specific state properties
  *   - A Command object for more advanced control flow
  *
  * @param config - Optional runtime configuration including:
  * @param config.context - The context for the agent execution.
  * @param config.configurable - LangGraph configuration options like `thread_id`, `run_id`, etc.
  * @param config.store - The store for the agent execution for persisting state, see more in {@link https://docs.langchain.com/oss/javascript/langgraph/memory#memory-storage | Memory storage}.
  * @param config.signal - An optional {@link https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal | `AbortSignal`} for the agent execution.
  * @param config.recursionLimit - The recursion limit for the agent execution.
  *
  * @returns A Promise that resolves to the final agent state after execution completes.
  *          The returned state includes:
  *          - a `messages` property containing an array with all messages (input, AI responses, tool calls/results)
  *          - a `structuredResponse` property containing the structured response (if configured)
  *          - all state values defined in the middleware
  *
  * @example
  * ```typescript
  * const agent = new ReactAgent({
  *   llm: myModel,
  *   tools: [calculator, webSearch],
  *   responseFormat: z.object({
  *     weather: z.string(),
  *   }),
  * });
  *
  * const result = await agent.invoke({
  *   messages: [{ role: "human", content: "What's the weather in Paris?" }]
  * });
  *
  * console.log(result.structuredResponse.weather); // outputs: "It's sunny and 75°F."
  * ```
  */
  async invoke(t, n) {
    const s = oe(this.#n, n), r = await this.#h(t, s);
    return this.#e.invoke(r, s);
  }
  /**
  * Executes the agent with streaming, returning an async iterable of state updates as they occur.
  *
  * This method runs the agent's workflow similar to `invoke`, but instead of waiting for
  * completion, it streams high-level state updates in real-time. This allows you to:
  * - Display intermediate results to users as they're generated
  * - Monitor the agent's progress through each step
  * - React to state changes as nodes complete
  *
  * For more granular event-level streaming (like individual LLM tokens), use `streamEvents` instead.
  *
  * @param state - The initial state for the agent execution. Can be:
  *   - An object containing `messages` array and any middleware-specific state properties
  *   - A Command object for more advanced control flow
  *
  * @param config - Optional runtime configuration including:
  * @param config.context - The context for the agent execution.
  * @param config.configurable - LangGraph configuration options like `thread_id`, `run_id`, etc.
  * @param config.store - The store for the agent execution for persisting state, see more in {@link https://docs.langchain.com/oss/javascript/langgraph/memory#memory-storage | Memory storage}.
  * @param config.signal - An optional {@link https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal | `AbortSignal`} for the agent execution.
  * @param config.streamMode - The streaming mode for the agent execution, see more in {@link https://docs.langchain.com/oss/javascript/langgraph/streaming#supported-stream-modes | Supported stream modes}.
  * @param config.recursionLimit - The recursion limit for the agent execution.
  *
  * @returns A Promise that resolves to an IterableReadableStream of state updates.
  *          Each update contains the current state after a node completes.
  *
  * @example
  * ```typescript
  * const agent = new ReactAgent({
  *   llm: myModel,
  *   tools: [calculator, webSearch]
  * });
  *
  * const stream = await agent.stream({
  *   messages: [{ role: "human", content: "What's 2+2 and the weather in NYC?" }]
  * });
  *
  * for await (const chunk of stream) {
  *   console.log(chunk); // State update from each node
  * }
  * ```
  */
  async stream(t, n) {
    const s = oe(this.#n, n), r = await this.#h(t, s);
    return this.#e.stream(r, s);
  }
  streamEvents(t, n, s) {
    if (n?.version !== "v3" || s != null) {
      const r = oe(this.#n, n), a = n?.version === "v1" || n?.version === "v2" ? n.version : "v2";
      return this.#e.streamEvents(t, {
        ...r,
        version: a
      }, s);
    }
    return (async () => {
      const { transformers: r, version: a, ...i } = n ?? {}, o = oe(this.#n, i), c = await this.#h(t, o);
      return await this.#e.streamEvents(c, {
        ...o,
        version: "v3",
        transformers: r
      });
    })();
  }
  /**
  * Visualize the graph as a PNG image.
  * @param params - Parameters for the drawMermaidPng method.
  * @param params.withStyles - Whether to include styles in the graph.
  * @param params.curveStyle - The style of the graph's curves.
  * @param params.nodeColors - The colors of the graph's nodes.
  * @param params.wrapLabelNWords - The maximum number of words to wrap in a node's label.
  * @param params.backgroundColor - The background color of the graph.
  * @returns PNG image as a buffer
  */
  async drawMermaidPng(t) {
    const n = await (await (await this.#e.getGraphAsync()).drawMermaidPng(t)).arrayBuffer();
    return new Uint8Array(n);
  }
  /**
  * Draw the graph as a Mermaid string.
  * @param params - Parameters for the drawMermaid method.
  * @param params.withStyles - Whether to include styles in the graph.
  * @param params.curveStyle - The style of the graph's curves.
  * @param params.nodeColors - The colors of the graph's nodes.
  * @param params.wrapLabelNWords - The maximum number of words to wrap in a node's label.
  * @param params.backgroundColor - The background color of the graph.
  * @returns Mermaid string
  */
  async drawMermaid(t) {
    return (await this.#e.getGraphAsync()).drawMermaid(t);
  }
  /**
  * The following are internal methods to enable support for LangGraph Platform.
  * They are not part of the createAgent public API.
  *
  * Note: we intentionally return as `never` to avoid type errors due to type inference.
  */
  /**
  * @internal
  */
  getGraphAsync(t) {
    return this.#e.getGraphAsync(t);
  }
  /**
  * @internal
  */
  getState(t, n) {
    return this.#e.getState(t, n);
  }
  /**
  * @internal
  */
  getStateHistory(t, n) {
    return this.#e.getStateHistory(t, n);
  }
  /**
  * @internal
  */
  getSubgraphs(t, n) {
    return this.#e.getSubgraphs(t, n);
  }
  /**
  * @internal
  */
  getSubgraphsAsync(t, n) {
    return this.#e.getSubgraphsAsync(t, n);
  }
  /**
  * @internal
  */
  updateState(t, n, s) {
    return this.#e.updateState(t, n, s);
  }
  /**
  * @internal
  */
  get builder() {
    return this.#e.builder;
  }
};
function wb(e) {
  return new _b(e);
}
const vb = Mn().args(Ye()).returns(nt([Xe(), ci(Xe())])), bb = Mn().args(Ye(), Ye(), Ye()).returns(nt([fe(), ci(fe())])), Sb = [
  "approve",
  "edit",
  "reject"
], kb = Pt(Sb), Cb = se({
  /**
  * The decisions that are allowed for this action.
  */
  allowedDecisions: en(kb),
  /**
  * The description attached to the request for human input.
  * Can be either:
  * - A static string describing the approval request
  * - A callable that dynamically generates the description based on agent state,
  *   runtime, and tool call information
  *
  * @example
  * Static string description
  * ```typescript
  * import type { InterruptOnConfig } from "langchain";
  *
  * const config: InterruptOnConfig = {
  *   allowedDecisions: ["approve", "reject"],
  *   description: "Please review this tool execution"
  * };
  * ```
  *
  * @example
  * Dynamic callable description
  * ```typescript
  * import type {
  *   AgentBuiltInState,
  *   Runtime,
  *   DescriptionFactory,
  *   ToolCall,
  *   InterruptOnConfig
  * } from "langchain";
  *
  * const formatToolDescription: DescriptionFactory = (
  *   toolCall: ToolCall,
  *   state: AgentBuiltInState,
  *   runtime: Runtime<unknown>
  * ) => {
  *   return `Tool: ${toolCall.name}\nArguments:\n${JSON.stringify(toolCall.args, null, 2)}`;
  * };
  *
  * const config: InterruptOnConfig = {
  *   allowedDecisions: ["approve", "edit"],
  *   description: formatToolDescription
  * };
  * ```
  */
  description: nt([fe(), bb]).optional(),
  /**
  * JSON schema for the arguments associated with the action, if edits are allowed.
  */
  argsSchema: qn(ap()).optional(),
  /**
  * Optional predicate controlling whether to interrupt for a given tool call.
  *
  * Receives a {@link ToolCallRequest} and returns `true` to interrupt or
  * `false` to auto-approve the tool call.
  *
  * The request is constructed with `tool` set to `undefined` and `runtime` set
  * to the node-level {@link Runtime}, so `request.tool` is not available.
  *
  * @example
  * ```typescript
  * import type { InterruptOnConfig } from "langchain";
  *
  * // Only interrupt delete_file calls targeting /etc
  * const config: InterruptOnConfig = {
  *   allowedDecisions: ["approve", "reject"],
  *   when: (request) =>
  *     String(request.toolCall.args.path ?? "").startsWith("/etc"),
  * };
  * ```
  */
  when: vb.optional()
});
se({
  /**
  * Mapping of tool name to allowed reviewer responses.
  * If a tool doesn't have an entry, it's auto-approved by default.
  *
  * - `true` -> pause for approval and allow approve/edit/reject decisions
  * - `false` -> auto-approve (no human review)
  * - `InterruptOnConfig` -> explicitly specify which decisions are allowed for this tool
  */
  interruptOn: qn(nt([Xe(), Cb])).optional(),
  /**
  * Prefix used when constructing human-facing approval messages.
  * Provides context about the tool call being reviewed; does not change the underlying action.
  *
  * Note: This prefix is only applied for tools that do not provide a custom
  * `description` via their {@link InterruptOnConfig}. If a tool specifies a custom
  * `description`, that per-tool text is used and this prefix is ignored.
  */
  descriptionPrefix: fe().default("Tool execution requires approval")
});
const Eb = `<role>
Context Extraction Assistant
</role>

<primary_objective>
Your sole objective in this task is to extract the highest quality/most relevant context from the conversation history below.
</primary_objective>

<objective_information>
You're nearing the total number of input tokens you can accept, so you must extract the highest quality/most relevant pieces of information from your conversation history.
This context will then overwrite the conversation history presented below. Because of this, ensure the context you extract is only the most important information to your overall goal.
</objective_information>

<instructions>
The conversation history below will be replaced with the context you extract in this step. Because of this, you must do your very best to extract and record all of the most important context from the conversation history.
You want to ensure that you don't repeat any actions you've already completed, so the context you extract from the conversation history should be focused on the most important information to your overall goal.
</instructions>

The user will message you with the full message history you'll be extracting context from, to then replace. Carefully read over it all, and think deeply about what information is most important to your overall goal that should be saved:

With all of this in mind, please carefully read over the entire conversation history, and extract the most important and relevant context to replace it so that you can free up space in the conversation history.
Respond ONLY with the extracted context. Do not include any additional information, or text before or after the extracted context.

<messages>
Messages to summarize:
{messages}
</messages>`, Tb = Mn().args(en(Ye())).returns(nt([Z(), ci(Z())])), Bo = se({
  /**
  * Fraction of the model's context size to use as the trigger
  */
  fraction: Z().gt(0, "Fraction must be greater than 0").max(1, "Fraction must be less than or equal to 1").optional(),
  /**
  * Number of tokens to use as the trigger
  */
  tokens: Z().positive("Tokens must be greater than 0").optional(),
  /**
  * Number of messages to use as the trigger
  */
  messages: Z().int("Messages must be an integer").positive("Messages must be greater than 0").optional()
}).refine((e) => [
  e.fraction,
  e.tokens,
  e.messages
].filter((t) => t !== void 0).length >= 1, { message: "At least one of fraction, tokens, or messages must be provided" }), xb = se({
  /**
  * Fraction of the model's context size to keep
  */
  fraction: Z().min(0, "Messages must be non-negative").max(1, "Fraction must be less than or equal to 1").optional(),
  /**
  * Number of tokens to keep
  */
  tokens: Z().min(0, "Tokens must be greater than or equal to 0").optional(),
  messages: Z().int("Messages must be an integer").min(0, "Messages must be non-negative").optional()
}).refine((e) => [
  e.fraction,
  e.tokens,
  e.messages
].filter((t) => t !== void 0).length === 1, { message: "Exactly one of fraction, tokens, or messages must be provided" });
se({
  /**
  * Model to use for summarization
  */
  model: Ye(),
  /**
  * Trigger conditions for summarization.
  * Can be a single condition object (all properties must be met) or an array of conditions (any condition must be met).
  *
  * @example
  * ```ts
  * // Single condition: trigger if tokens >= 5000 AND messages >= 3
  * trigger: { tokens: 5000, messages: 3 }
  *
  * // Multiple conditions: trigger if (tokens >= 5000 AND messages >= 3) OR (tokens >= 3000 AND messages >= 6)
  * trigger: [
  *   { tokens: 5000, messages: 3 },
  *   { tokens: 3000, messages: 6 }
  * ]
  * ```
  */
  trigger: nt([Bo, en(Bo)]).optional(),
  /**
  * Keep conditions for summarization
  */
  keep: xb.optional(),
  /**
  * Token counter function to use for summarization
  */
  tokenCounter: Tb.optional(),
  /**
  * Summary prompt to use for summarization
  * @default {@link DEFAULT_SUMMARY_PROMPT}
  */
  summaryPrompt: fe().default(Eb),
  /**
  * Number of tokens to trim to before summarizing
  */
  trimTokensToSummarize: Z().optional(),
  /**
  * Prefix to add to the summary
  */
  summaryPrefix: fe().optional(),
  /**
  * @deprecated Use `trigger: { tokens: value }` instead.
  */
  maxTokensBeforeSummary: Z().optional(),
  /**
  * @deprecated Use `keep: { messages: value }` instead.
  */
  messagesToKeep: Z().optional()
});
se({
  /**
  * The language model to use for tool selection (default: the provided model from the agent options).
  */
  model: fe().or(ls(hc)).optional(),
  /**
  * System prompt for the tool selection model.
  */
  systemPrompt: fe().optional(),
  /**
  * Maximum number of tools to select. If the model selects more,
  * only the first maxTools will be used. No limit if not specified.
  */
  maxTools: Z().optional(),
  /**
  * Tool names to always include regardless of selection.
  * These do not count against the maxTools limit.
  */
  alwaysInclude: en(fe()).optional()
});
se({
  /**
  * Whether to check user messages before model call
  */
  applyToInput: Xe().optional(),
  /**
  * Whether to check AI messages after model call
  */
  applyToOutput: Xe().optional(),
  /**
  * Whether to check tool result messages after tool execution
  */
  applyToToolResults: Xe().optional()
});
se({
  /**
  * A record of PII detection rules to apply
  * @default DEFAULT_PII_RULES (with enabled rules only)
  */
  rules: qn(fe(), ls(RegExp).describe("Regular expression pattern to match PII")).optional()
});
const Mb = [
  "continue",
  "error",
  "end"
], Ib = "continue", Ab = Pt(Mb).default(Ib);
se({
  /**
  * Name of the specific tool to limit. If undefined, limits apply to all tools.
  */
  toolName: fe().optional(),
  /**
  * Maximum number of tool calls allowed per thread.
  * undefined means no limit.
  */
  threadLimit: Z().optional(),
  /**
  * Maximum number of tool calls allowed per run.
  * undefined means no limit.
  */
  runLimit: Z().optional(),
  /**
  * What to do when limits are exceeded.
  * - "continue": Block exceeded tools with error messages, let other tools continue (default)
  * - "error": Raise a ToolCallLimitExceededError exception
  * - "end": Stop execution immediately, injecting a ToolMessage and an AI message
  *   for the single tool call that exceeded the limit. Raises NotImplementedError
  *   if there are multiple tool calls.
  *
  * @default "continue"
  */
  exitBehavior: Ab
});
se({
  threadToolCallCount: qn(fe(), Z()).default({}),
  runToolCallCount: qn(fe(), Z()).default({})
});
const Ob = Pt([
  "pending",
  "in_progress",
  "completed"
]).describe("Status of the todo"), Pb = se({
  content: fe().describe("Content of the todo item"),
  status: Ob
});
se({ todos: en(Pb).default([]) });
se({
  /**
  * The maximum number of model calls allowed per thread.
  */
  threadLimit: Z().optional(),
  /**
  * The maximum number of model calls allowed per run.
  */
  runLimit: Z().optional(),
  /**
  * The behavior to take when the limit is exceeded.
  * - "error" will throw an error and stop the agent.
  * - "end" will end the agent.
  * @default "end"
  */
  exitBehavior: Pt(["error", "end"]).optional()
});
se({
  threadModelCallCount: Z().default(0),
  runModelCallCount: Z().default(0)
});
const oh = se({
  /**
  * Maximum number of retry attempts after the initial call.
  * Default is 2 retries (3 total attempts). Must be >= 0.
  */
  maxRetries: Z().min(0).default(2),
  /**
  * Either an array of error constructors to retry on, or a function
  * that takes an error and returns `true` if it should be retried.
  * Default is to retry on all errors.
  */
  retryOn: nt([Mn().args(ls(Error)).returns(Xe()), en(Ye())]).default(() => () => !0),
  /**
  * Multiplier for exponential backoff. Each retry waits
  * `initialDelayMs * (backoffFactor ** retryNumber)` milliseconds.
  * Set to 0.0 for constant delay. Default is 2.0.
  */
  backoffFactor: Z().min(0).default(2),
  /**
  * Initial delay in milliseconds before first retry. Default is 1000 (1 second).
  */
  initialDelayMs: Z().min(0).default(1e3),
  /**
  * Maximum delay in milliseconds between retries. Caps exponential
  * backoff growth. Default is 60000 (60 seconds).
  */
  maxDelayMs: Z().min(0).default(6e4),
  /**
  * Whether to add random jitter (±25%) to delay to avoid thundering herd.
  * Default is `true`.
  */
  jitter: Xe().default(!0)
});
se({
  /**
  * Behavior when all retries are exhausted. Options:
  * - `"continue"` (default): Return an AIMessage with error details, allowing
  *   the agent to potentially handle the failure gracefully.
  * - `"error"`: Re-raise the exception, stopping agent execution.
  * - Custom function: Function that takes the exception and returns a string
  *   for the AIMessage content, allowing custom error formatting.
  */
  onFailure: nt([
    hn("error"),
    hn("continue"),
    Mn().args(ls(Error)).returns(fe())
  ]).default("continue")
}).merge(oh);
se({
  /**
  * Optional list of tools or tool names to apply retry logic to.
  * Can be a list of `BaseTool` instances or tool name strings.
  * If `undefined`, applies to all tools. Default is `undefined`.
  */
  tools: en(nt([
    Ye(),
    Ye(),
    fe()
  ])).optional(),
  /**
  * Behavior when all retries are exhausted. Options:
  * - `"continue"` (default): Return an AIMessage with error details, allowing
  *   the agent to potentially handle the failure gracefully.
  * - `"error"`: Re-raise the exception, stopping agent execution.
  * - Custom function: Function that takes the exception and returns a string
  *   for the AIMessage content, allowing custom error formatting.
  *
  * Deprecated values:
  * - `"raise"`: use `"error"` instead.
  * - `"return_message"`: use `"continue"` instead.
  */
  onFailure: nt([
    hn("error"),
    hn("continue"),
    hn("raise"),
    hn("return_message"),
    Mn().args(ls(Error)).returns(fe())
  ]).default("continue")
}).merge(oh);
const Nb = !0, Rb = "5m", $b = 3, jb = "warn", Lb = se({
  /**
  * Whether to enable prompt caching.
  * @default true
  */
  enableCaching: Xe().optional(),
  /**
  * The time-to-live for the cached prompt.
  * @default "5m"
  */
  ttl: Pt(["5m", "1h"]).optional(),
  /**
  * The minimum number of messages required before caching is applied.
  * @default 3
  */
  minMessagesToCache: Z().optional(),
  /**
  * The behavior to take when an unsupported model is used.
  * - "ignore" will ignore the unsupported model and continue without caching.
  * - "warn" will warn the user and continue without caching.
  * - "raise" will raise an error and stop the agent.
  * @default "warn"
  */
  unsupportedModelBehavior: Pt([
    "ignore",
    "warn",
    "raise"
  ]).optional()
});
var Db = class extends Error {
  constructor(e) {
    super(e), this.name = "PromptCachingMiddlewareError";
  }
};
function Fb(e) {
  return Hv({
    name: "PromptCachingMiddleware",
    contextSchema: Lb,
    wrapModelCall: (t, n) => {
      const s = t.runtime.context.enableCaching ?? e?.enableCaching ?? Nb, r = t.runtime.context.ttl ?? e?.ttl ?? Rb, a = t.runtime.context.minMessagesToCache ?? e?.minMessagesToCache ?? $b, i = t.runtime.context.unsupportedModelBehavior ?? e?.unsupportedModelBehavior ?? jb;
      if (!s || !t.model) return n(t);
      if (!(t.model.getName() === "ChatAnthropic" || t.model.getName() === "ConfigurableModel" && t.model._defaultConfig?.modelProvider === "anthropic")) {
        const o = t.model.getName(), c = `Unsupported model '${t.model.getName() === "ConfigurableModel" ? `${o} (${t.model._defaultConfig?.modelProvider})` : o}'. Prompt caching requires an Anthropic model`;
        if (i === "raise") throw new Db(`${c} (e.g., 'anthropic:claude-4-0-sonnet').`);
        return i === "warn" && console.warn(`PromptCachingMiddleware: Skipping caching for ${o}. Consider switching to an Anthropic model for caching benefits.`), n(t);
      }
      return t.state.messages.length + (t.systemPrompt ? 1 : 0) < a ? n(t) : n({
        ...t,
        modelSettings: {
          ...t.modelSettings,
          cache_control: {
            type: "ephemeral",
            ttl: r
          }
        }
      });
    }
  });
}
se({
  /**
  * Whether to enable prompt caching.
  * @default true
  */
  enableCaching: Xe().optional(),
  /**
  * The time-to-live for the cached prompt.
  * @default "5m"
  */
  ttl: Pt(["5m", "1h"]).optional(),
  /**
  * The minimum number of messages required before caching is applied.
  * @default 1
  */
  minMessagesToCache: Z().optional(),
  /**
  * The behavior to take when an unsupported model is used.
  * - "ignore" will ignore the unsupported model and continue without caching.
  * - "warn" will warn the user and continue without caching.
  * - "raise" will raise an error and stop the agent.
  * @default "warn"
  */
  unsupportedModelBehavior: Pt([
    "ignore",
    "warn",
    "raise"
  ]).optional()
});
const Ka = {
  1: 1.25,
  2: 1.5,
  3: 1.8,
  4: 2.2,
  5: 3.5,
  6: 5
}, Vb = 1, Bb = 5;
function Ln(e) {
  if (e.customScale != null) {
    const t = Math.max(Vb, Math.min(Bb, e.customScale));
    if (Number.isFinite(t)) return t;
  }
  return Ka[e.depth];
}
const Gn = Object.keys(Ka).map((e) => Number(e)).sort((e, t) => e - t).map((e) => `${e}=${Ka[e].toFixed(2)}×`).join(", ");
function ch(e, t) {
  return t.some((n) => e.find((s) => s.id === n.assetId)?.cameraTrack != null);
}
const Hb = 5, Ub = 400, Wb = 0.02, zb = 3;
function Ho(e, t, n, s, r, a) {
  const i = [[n, s]];
  for (; i.length; ) {
    const [o, c] = i.pop();
    if (c - o < 2) continue;
    const l = e[o].timeMs, u = e[c].timeMs - l, d = t(o), h = t(c) - d;
    let f = 0, p = -1;
    for (let m = o + 1; m < c; m += 1) {
      const g = u === 0 ? 0 : (e[m].timeMs - l) / u, y = Math.abs(t(m) - (d + g * h));
      y > f && (f = y, p = m);
    }
    f > r && p >= 0 && (a.add(p), i.push([o, p], [p, c]));
  }
}
function Ts(e) {
  return Math.round(e * 100) / 100;
}
function Uo(e) {
  return Math.round(e * 1e3) / 1e3;
}
function Gb(e) {
  const { assetId: t, samples: n, durationSec: s, clips: r } = e, a = e.trimRanges ?? [], i = e.maxPoints ?? Ub, o = Math.max(0, s) * 1e3 || Number.POSITIVE_INFINITY, c = n.filter((T) => Number.isFinite(T.timeMs) && Number.isFinite(T.cx) && Number.isFinite(T.cy)).map((T) => ({ ...T, timeMs: Math.max(0, Math.min(T.timeMs, o)) })).sort((T, N) => T.timeMs - N.timeMs), l = /* @__PURE__ */ new Map();
  for (const T of c)
    typeof T.assetId == "string" && T.assetId && !l.has(T.assetId) && l.set(T.assetId, l.size);
  const u = c.length ? Ts(c[c.length - 1].timeMs / 1e3) : 0, d = e.hz ?? Hb, h = u || 1;
  let f = (e.maxGapSec ?? zb) * 1e3, p = Math.ceil(h / (f / 1e3)), m = !1;
  p > i && (f = h / i * 1e3, p = i, m = !0);
  const g = Math.min(d, Math.max(0, i - p) / h), y = m || g < d, _ = g > 0 ? 1e3 / g : Number.POSITIVE_INFINITY, b = e.epsilon ?? Wb, v = /* @__PURE__ */ new Set();
  c.length && (v.add(0), v.add(c.length - 1));
  let M = c[0]?.assetId, I = c[0]?.timeMs ?? 0;
  for (let T = 0; T < c.length; T += 1) {
    const N = c[T], $ = N.assetId !== M && l.size > 1, S = typeof N.interactionType == "string" && N.interactionType !== "move", E = N.timeMs - I >= f;
    ($ || S || E) && (v.add(T), I = N.timeMs, M = N.assetId);
  }
  const w = new Set(v), C = [...v].sort((T, N) => T - N);
  for (let T = 0; T < C.length - 1; T += 1)
    Ho(c, (N) => c[N].cx, C[T], C[T + 1], b, w), Ho(c, (N) => c[N].cy, C[T], C[T + 1], b, w);
  const O = [];
  let A = Number.NEGATIVE_INFINITY;
  for (const T of [...w].sort((N, $) => N - $)) {
    const N = c[T];
    (v.has(T) || N.timeMs - A >= _) && (O.push(N), A = N.timeMs);
  }
  const B = O.some((T) => {
    const N = T.timeMs / 1e3, $ = co(r, N, t);
    return !$ || Math.abs($.virtualTimeSec - N) > 5e-3;
  }), k = O.map((T) => {
    const N = T.timeMs / 1e3, $ = co(r, N, t), S = {
      atSec: Ts(N),
      cx: Uo(T.cx),
      cy: Uo(T.cy)
    };
    B && (S.virtualSec = $ ? Ts($.virtualTimeSec) : null);
    const E = typeof T.assetId == "string" ? l.get(T.assetId) : void 0;
    return E !== void 0 && l.size > 1 && (S.shape = E), typeof T.interactionType == "string" && T.interactionType !== "move" && (S.kind = T.interactionType), a.some((R) => R.assetId === t && N >= R.startSec && N <= R.endSec) && (S.trimmed = !0), S;
  }), P = k.length > i ? `${k.length} points for a ceiling of ${i}: the mandatory points are never dropped — the first and last sample, pointer-shape changes, non-move events and the ends of a parked run — and this recording has enough of them to land above the budget.` : void 0;
  return {
    assetId: t,
    sampleCount: n.length,
    pointCount: k.length,
    hz: Ts(g),
    coveredSec: u,
    shapeCount: l.size,
    truncated: y,
    ...P ? { overBudget: P } : {},
    virtualEqualsSource: !B,
    timeBase: "atSec is SOURCE time of the asset (the recording's own clock). virtualSec is the same instant on the edited timeline — that is the coordinate addZoom takes; when virtualEqualsSource is true the two are identical everywhere and virtualSec is left off the points. A null virtualSec means no clip carries that moment; trimmed:true means a trim cuts it out of playback, so a zoom there would never be seen. `shape` is an index into the pointer bitmaps this recording used: equal values are the same pointer, a change is a change.",
    points: k
  };
}
function q(e) {
  if (!Number.isFinite(e) || e < 0) return "0:00.0";
  const t = Math.floor(e / 60), n = (e % 60).toFixed(1);
  return `${t}:${n.padStart(4, "0")}`;
}
function Ue(e) {
  return Math.max(0, Math.round(e * 1e3));
}
function xs(e, t, n) {
  if (t === void 0 && n === void 0)
    return { startMs: e.startMs, endMs: e.endMs };
  const s = t ?? e.startMs / 1e3, r = n ?? e.endMs / 1e3;
  return { startMs: Ue(Math.min(s, r)), endMs: Ue(Math.max(s, r)) };
}
function Ms(e) {
  return fp(e).map((t) => ({
    ...t.member,
    id: t.ids[0],
    startMs: Math.round(t.start * 1e3),
    endMs: Math.round(t.end * 1e3)
  }));
}
function Is(e, t, n) {
  return hp([e], t.timeline.clips, () => He(n));
}
function Jb(e, t) {
  const n = e.startMs / 1e3, s = e.endMs / 1e3;
  return t.timeline.clips.some(
    (r) => Math.min(s, r.timelineEndSec) - Math.max(n, r.timelineStartSec) > 0
  );
}
function Dn(e, t) {
  const n = e.map((r) => r.startMs), s = e.map((r) => r.endMs);
  return {
    ids: e.map((r) => r.id),
    startSec: e.length ? Math.min(...n) / 1e3 : 0,
    endSec: e.length ? Math.max(...s) / 1e3 : 0,
    anchored: e.length > 0 && e.every((r) => typeof r.clipId == "string" && Jb(r, t)),
    fragments: e.length
  };
}
function As(e, t, n, s) {
  const r = new Set(e.filter((a) => !n.has(a.id)).map((a) => a.id));
  return Dn(
    t.filter((a) => !r.has(a.id)),
    s
  );
}
function Kb(e, t, n) {
  const s = e.timeline.clips.filter(
    (r) => Math.min(n, r.timelineEndSec) - Math.max(t, r.timelineStartSec) > 0
  );
  return {
    clips: s.length,
    withCamera: s.filter(
      (r) => e.assets.find((a) => a.id === r.assetId)?.cameraTrack != null
    ).length
  };
}
function Wo(e, t, n) {
  const s = Kb(e, t, n);
  if (s.clips === 0 || s.withCamera > 0) return null;
  const r = ch(e.assets, e.timeline.clips);
  return j(
    `No webcam is linked to the footage under ${t.toFixed(1)}–${n.toFixed(1)} s, so a full-camera region there would render nothing and none was written. ` + (r ? "Other clips in this project do carry a camera — check assets[].hasCameraTrack in getCurrentDocument and pick a span over one of those." : "No asset in this project carries a cameraTrack at all (assets[].hasCameraTrack is false everywhere): this recording has no webcam. Tell the user instead of placing a region.")
  );
}
function qb(e) {
  const t = e.timeline.clips;
  return t.length === 0 ? { startSec: 0, endSec: 0 } : {
    startSec: Math.min(...t.map((n) => n.timelineStartSec)),
    endSec: Math.max(...t.map((n) => n.timelineEndSec))
  };
}
function mt(e, t, n, s) {
  const r = qb(s);
  return j(
    `The span ${t.toFixed(1)}–${n.toFixed(1)} s covers no clip, so no ${e} was placed (it could never play). The edited timeline runs ${r.startSec.toFixed(1)}–${r.endSec.toFixed(1)} s. Pick a span inside it, or place a clip there first.`
  );
}
function gt(e, t, n) {
  const s = Math.abs(e.startSec - t) > 1e-3 || Math.abs(e.endSec - n) > 1e-3;
  return {
    startSec: e.startSec,
    endSec: e.endSec,
    ids: e.ids,
    ...s ? { clamped: !0, requestedStartSec: t, requestedEndSec: n } : {},
    ...e.fragments > 1 ? { fragments: e.fragments } : {}
  };
}
function yt(e, t, n) {
  const s = [];
  return (Math.abs(e.startSec - t) > 1e-3 || Math.abs(e.endSec - n) > 1e-3) && s.push(
    `clamped from ${q(t)} – ${q(n)} to fit the clips`
  ), e.fragments > 1 && s.push(`split across ${e.fragments} clips`), s.length ? ` (${s.join(", ")})` : "";
}
function zo(e) {
  const t = e.legacyEditor ?? {}, n = t.speedRegions ?? [], s = t.cameraFullscreenRegions ?? [];
  return [
    ...e.zoomRanges.map((r) => r.id),
    ...e.annotations.map((r) => r.id),
    ...n.map((r) => r.id),
    ...s.map((r) => r.id)
  ];
}
function Xr(e, t) {
  const n = new Set(zo(t)), s = new Set(t.timeline.trimRanges.map((r) => r.id));
  return {
    droppedModifierIds: zo(e).filter((r) => !n.has(r)),
    droppedTrimIds: e.timeline.trimRanges.map((r) => r.id).filter((r) => !s.has(r))
  };
}
const X = Nt().finite().nonnegative(), qi = W({
  startSec: X,
  endSec: X,
  assetId: ue().min(1).optional(),
  // A cut belongs to ONE clip. Without this, a project where two clips draw from the same
  // asset (a duplicated clip) cannot say which of them the model meant, and the cut lands
  // on both. Resolved from the source range when the model omits it and only one clip
  // matches; ambiguity is reported back rather than guessed.
  clipId: ue().min(1).optional(),
  reason: ue().default("")
}), lh = W({
  ranges: li(pc([qi, mc()])).min(1)
}), uh = W({
  trimRangeId: ue().min(1),
  startSec: X,
  endSec: X
}), hh = W({
  clipId: ue().min(1),
  sourceStartSec: X,
  sourceEndSec: X
}), dh = W({
  intervals: li(W({ startSec: X, endSec: X })).min(1),
  reason: ue().default("")
}), fh = W({
  clipId: ue().min(1),
  beforeClipId: ue().min(1).nullish()
}), ph = W({
  assetId: ue().min(1).optional()
}), mh = W({
  assetId: ue().min(1).optional()
}), gh = Nt().int().min(1).max(6), yh = W({ cx: Nt().min(0).max(1), cy: Nt().min(0).max(1) }), Zi = W({
  startSec: X,
  endSec: X,
  depth: gh.default(3),
  focus: yh.default({ cx: 0.5, cy: 0.5 })
}), _h = W({
  regions: li(pc([Zi, mc()])).min(1)
}), wh = W({
  zoomId: ue().min(1),
  startSec: X.optional(),
  endSec: X.optional(),
  depth: gh.optional(),
  focus: yh.optional()
}), vh = W({
  startSec: X,
  endSec: X,
  speed: Nt().positive().default(1.5)
}), bh = W({
  speedId: ue().min(1),
  startSec: X.optional(),
  endSec: X.optional(),
  speed: Nt().positive().optional()
}), Sh = W({
  startSec: X,
  endSec: X,
  text: ue().default(""),
  x: Nt().min(0).max(100).default(50),
  y: Nt().min(0).max(100).default(50)
}), kh = W({
  annotationId: ue().min(1),
  startSec: X.optional(),
  endSec: X.optional(),
  text: ue().optional()
}), Ch = W({
  startSec: X,
  endSec: X
}), Eh = W({
  cameraFullscreenId: ue().min(1),
  startSec: X.optional(),
  endSec: X.optional()
}), Th = W({
  trimRangeId: ue().min(1)
}), xh = W({
  id: ue().min(1)
}), Mh = W({
  clipId: ue().min(1)
}), Zb = /* @__PURE__ */ new Set([
  "addTrim",
  "addTrims",
  "addZooms",
  "setTrim",
  "setClipRange",
  "moveClip",
  "replaceTimeline",
  "addZoom",
  "setZoom",
  "addSpeed",
  "setSpeed",
  "addAnnotation",
  "setAnnotation",
  "addCameraFullscreen",
  "setCameraFullscreen",
  "removeTrim",
  "removeModifier",
  "removeClip"
]);
function Yb(e) {
  return Zb.has(e);
}
function _t(e) {
  return Math.round(e) / 1e3;
}
function Xb(e, t) {
  const n = t?.availableByAssetId, s = e.legacyEditor, r = s?.speedRegions ?? [], a = s?.cameraFullscreenRegions ?? [], i = s?.autoFocusAll === !0;
  return {
    timeBaseNote: "clips and trims are in source-time seconds; zooms, speedRegions, annotations and cameraFullscreenRegions are in virtual (edited-timeline) seconds.",
    zoomNote: `renderedScale is what the viewer sees (depth is an ordinal, not a factor: ${Gn}). When a zoom carries customScale it wins over depth and depthIsOverridden is true — a setZoom that only changes depth on such a zoom clears customScale so the depth takes effect.`,
    project: { id: e.project.id, title: e.project.title },
    primaryAssetId: e.project.primaryAssetId ?? e.assets[0]?.id ?? null,
    autoFocusAll: i,
    hasAnyCamera: ch(e.assets, e.timeline.clips),
    cursorNote: "assets[].hasCursorTelemetry says whether recorded pointer telemetry exists for that asset. true — call getCursorTrack to read the recorded pointer track. false — this asset was checked and has none (imported footage, or a recording made without the cursor recorder). null — it was NOT checked from here; say that, and do not report it as the project having no cursor data.",
    assets: e.assets.map((o) => ({
      id: o.id,
      label: o.label,
      durationSec: o.durationSec ?? null,
      hasCameraTrack: o.cameraTrack != null,
      cameraVisible: o.cameraTrack?.visible ?? !1,
      // Three-valued on purpose (see `CursorTelemetryContext`): `null` is
      // "not checked", and it must never render as `false`. The whole defect
      // was a runtime that could not look being read as a project that has
      // nothing — same field, same three states, one honest projection.
      //
      // `?? null`, not `?? false`: an asset MISSING from the map is one whose
      // probe threw. Defaulting that to `false` would put our failure back in
      // the answer as their fact, one layer lower down.
      hasCursorTelemetry: n?.[o.id] ?? null
    })),
    // ponytail: `index`, `reason` and `origin` are here because without them a
    // clip cannot be DESIGNATED. "Put the demo first" is unanswerable when the
    // only handles are `clip_1`/`clip_2` and two indistinguishable source
    // windows — the label the user sees lives in `reason`, and it was not being
    // sent. A reorder tool without this is a tool the model cannot aim.
    clips: e.timeline.clips.map((o, c) => ({
      id: o.id,
      index: c,
      assetId: o.assetId,
      reason: o.reason,
      origin: o.origin,
      sourceStartSec: o.sourceStartSec,
      sourceEndSec: o.sourceEndSec ?? null,
      timelineStartSec: o.timelineStartSec,
      timelineEndSec: o.timelineEndSec
    })),
    trimRanges: e.timeline.trimRanges.map((o) => ({
      id: o.id,
      assetId: o.assetId,
      // The clip the cut is on — the only thing separating two cuts over the same
      // media. `null` is a pre-v7 cut that still applies to every clip of its asset.
      clipId: o.clipId ?? null,
      startSec: o.startSec,
      endSec: o.endSec,
      reason: o.reason
    })),
    zoomRanges: Ms(e.zoomRanges).map((o) => ({
      id: o.id,
      startSec: _t(o.startMs),
      endSec: _t(o.endMs),
      depth: o.depth,
      renderedScale: Ln(o),
      // Emitted only when set: an unconditional `customScale: null` on every
      // zoom of every snapshot is noise the reader learns to skip, which is
      // how the field would go unnoticed again.
      ...o.customScale != null ? { customScale: o.customScale, depthIsOverridden: !0 } : {},
      ...o.rotationPreset ? { rotationPreset: o.rotationPreset } : {},
      focus: o.focus,
      focusMode: i ? "auto" : o.focusMode ?? "manual",
      source: o.source ?? "manual"
    })),
    speedRegions: Ms(r).map((o) => ({
      id: o.id,
      startSec: _t(o.startMs),
      endSec: _t(o.endMs),
      speed: o.speed
    })),
    annotations: Ms(e.annotations).map((o) => ({
      id: o.id,
      startSec: _t(o.startMs),
      endSec: _t(o.endMs),
      type: o.type,
      text: o.textContent ?? o.content ?? ""
    })),
    cameraFullscreenRegions: Ms(a).map((o) => ({
      id: o.id,
      startSec: _t(o.startMs),
      endSec: _t(o.endMs)
    })),
    hasTranscript: e.transcripts.length > 0 || e.transcript !== null
  };
}
function j(e) {
  return { ok: !1, resultJson: JSON.stringify({ error: e }) };
}
function Go(e, t, n, s, r) {
  let a = e;
  const i = [], o = [];
  if (n.forEach((l, u) => {
    const d = Ah(a, t, JSON.stringify(l), s);
    let h = {};
    try {
      h = JSON.parse(d.resultJson);
    } catch {
      h = { error: d.resultJson };
    }
    d.ok && d.document ? (a = d.document, i.push({ index: u, ...h })) : o.push({ index: u, error: String(h.error ?? "refused") });
  }), i.length === 0)
    return j(
      `No ${r} was added. ` + o.map((l) => `[${l.index}] ${l.error}`).join(" | ") + " Nothing was modified."
    );
  const c = o.length ? `, ${o.length} refused` : "";
  return {
    ok: !0,
    document: a,
    // The counts come first on purpose: the model must be able to see that one
    // of ten was refused WITHOUT re-reading the document, and know which one.
    resultJson: JSON.stringify({
      requested: n.length,
      appliedCount: i.length,
      refusedCount: o.length,
      applied: i,
      ...o.length ? { refused: o } : {}
    }),
    summary: `added ${i.length} ${r}${i.length === 1 ? "" : "s"}${c}`
  };
}
function Jo(e) {
  const t = e.timeline.clips;
  return t.length === 0 ? "The timeline has no clips." : `The timeline is: ${t.map((n) => `${n.id}${n.reason ? ` (${n.reason})` : ""}`).join(", ")}.`;
}
function Qb(e, t) {
  return {
    ok: !1,
    resultJson: JSON.stringify({
      error: "Project edits are turned off for this project: the user asked to be consulted before the timeline changes. Nothing was modified.",
      code: "consent_required",
      tool: e,
      requestedArgs: t,
      howToProceed: "Describe the exact edit you would make — the tool, the times, the ids — and ask the user to confirm it. Do NOT retry this call and do NOT reach for another write tool: every one of them is refused while the setting is off. Never say an edit was applied. If they want you to go ahead, they can re-enable 'Project edits' in Settings → AI."
    })
  };
}
function Ih(e, t) {
  return t ?? e.project.primaryAssetId ?? e.assets[0]?.id ?? null;
}
function Ko(e) {
  const t = [...e].sort((s, r) => s - r), n = t.length >> 1;
  return t.length % 2 === 1 ? t[n] : (t[n - 1] + t[n]) / 2;
}
function Os(e) {
  return Math.round(e * 1e3) / 1e3;
}
function qo(e, t, n, s) {
  const r = s?.load;
  if (r?.status !== "ok") return;
  const a = new Map(t.timeline.clips.map((f) => [f.id, f])), i = e.flatMap((f) => {
    const p = f.clipId ? a.get(f.clipId) : void 0;
    return !p || p.assetId !== r.assetId ? [] : f.sourceStartSec === void 0 || f.sourceEndSec === void 0 ? [] : [{ clip: p, startSec: f.sourceStartSec, endSec: f.sourceEndSec }];
  });
  if (i.length === 0) return;
  const o = [], c = [];
  let l = 0;
  for (const f of r.samples) {
    if (!Number.isFinite(f.timeMs) || !Number.isFinite(f.cx) || !Number.isFinite(f.cy))
      continue;
    const p = f.timeMs / 1e3, m = i.find((g) => p >= g.startSec && p <= g.endSec);
    if (m) {
      if (t.timeline.trimRanges.some(
        (g) => dp(g, m.clip) && p >= g.startSec && p <= g.endSec
      )) {
        l += 1;
        continue;
      }
      o.push(f.cx), c.push(f.cy);
    }
  }
  if (o.length === 0)
    return l > 0 ? {
      available: !1,
      reason: "trimmed-out",
      note: "The pointer WAS recorded over this span, but a trim cuts every one of those instants out of playback, so none of them describes what a viewer sees here."
    } : {
      available: !1,
      reason: "no-samples",
      note: "This recording's pointer telemetry covers no instant of this span. That is a fact about this span, not about the recording."
    };
  const u = Ko(o), d = Ko(c);
  let h = 0;
  for (let f = 0; f < o.length; f += 1)
    h = Math.max(h, Math.hypot(o[f] - u, c[f] - d));
  return {
    available: !0,
    // Echoed, including the default a call that omitted `focus` silently got:
    // "you asked for the centre" is the half of the comparison the caller
    // cannot reconstruct from its own arguments.
    focus: { cx: n.cx, cy: n.cy },
    cursor: { cx: Os(u), cy: Os(d) },
    offset: Os(Math.hypot(u - n.cx, d - n.cy)),
    spread: Os(h),
    samples: o.length
  };
}
function Ah(e, t, n, s) {
  let r = {};
  if (n.trim())
    try {
      r = JSON.parse(n);
    } catch {
      return j(`Tool arguments are not valid JSON: ${n.slice(0, 120)}`);
    }
  if (s?.editsAllowed === !1 && Yb(t))
    return Qb(t, r);
  switch (t) {
    case "getCurrentDocument":
      return {
        ok: !0,
        resultJson: JSON.stringify(Xb(e, s?.cursorTelemetry))
      };
    case "getCursorTrack": {
      const a = mh.safeParse(r);
      if (!a.success) return j(a.error.message);
      const i = Ih(e, a.data.assetId);
      if (!i)
        return j("Project has no assets — there is nothing to read telemetry for.");
      if (!e.assets.some((u) => u.id === i))
        return j(`Unknown asset: ${i}`);
      const o = s?.cursorTelemetry?.load;
      if (!o || o.status === "unavailable")
        return {
          ok: !0,
          resultJson: JSON.stringify({
            available: !1,
            reason: "unavailable",
            assetId: i,
            note: o?.note ?? "Cursor telemetry cannot be read in this run — no reader is wired to this runtime. This says nothing about whether the recording has any: report the limit as yours, and do not tell the user the project has no cursor data."
          })
        };
      if (o.status === "no-sidecar")
        return {
          ok: !0,
          resultJson: JSON.stringify({
            available: !1,
            reason: "no-sidecar",
            assetId: o.assetId,
            note: "Checked: this asset has no cursor-telemetry sidecar. That normally means it was imported rather than recorded with Drift's cursor recorder. This is a fact about the asset, not a limit of yours."
          })
        };
      const c = e.assets.find((u) => u.id === o.assetId), l = Gb({
        assetId: o.assetId,
        samples: o.samples,
        durationSec: o.durationSec ?? c?.durationSec ?? 0,
        clips: e.timeline.clips,
        trimRanges: e.timeline.trimRanges
      });
      return { ok: !0, resultJson: JSON.stringify({ available: !0, ...l }) };
    }
    case "getTranscript": {
      const a = ph.safeParse(r);
      if (!a.success) return j(a.error.message);
      const i = a.data.assetId ?? e.project.primaryAssetId ?? e.assets[0]?.id, o = e.transcripts.find((l) => l.assetId === i) ?? (e.transcript?.assetId === i ? e.transcript : null);
      if (!o)
        return j(`No transcript for asset ${i ?? "(none)"}.`);
      const c = o.segments.map((l) => ({
        id: l.id,
        kind: l.kind,
        startSec: l.startSec,
        endSec: l.endSec,
        text: l.text
      }));
      return {
        ok: !0,
        resultJson: JSON.stringify({ assetId: i, language: o.language, segments: c })
      };
    }
    case "addTrim": {
      const a = qi.safeParse(r);
      if (!a.success) return j(a.error.message);
      const i = a.data.assetId ?? e.project.primaryAssetId ?? e.assets[0]?.id;
      if (!i) return j("Project has no assets — nothing to trim.");
      if (!e.assets.some((f) => f.id === i))
        return j(`Unknown asset: ${i}`);
      const o = Math.min(a.data.startSec, a.data.endSec), c = Math.max(a.data.startSec, a.data.endSec), l = e.timeline.clips.filter(
        (f) => f.assetId === i && c > f.sourceStartSec && o < (f.sourceEndSec ?? Number.POSITIVE_INFINITY)
      );
      let u = a.data.clipId;
      if (u) {
        const f = e.timeline.clips.find((p) => p.id === u);
        if (!f) return j(`Unknown clip: ${u}`);
        if (f.assetId !== i)
          return j(`Clip ${u} does not use asset ${i}.`);
      } else if (l.length === 1)
        u = l[0].id;
      else if (l.length > 1)
        return j(
          `${l.length} clips use asset ${i} over ${q(o)} – ${q(
            c
          )} (${l.map((f) => f.id).join(", ")}). Pass clipId to say which one to trim.`
        );
      const d = {
        id: He("trim"),
        assetId: i,
        ...u ? { clipId: u } : {},
        startSec: o,
        endSec: c,
        reason: a.data.reason,
        origin: "agent"
      };
      return {
        ok: !0,
        document: {
          ...e,
          timeline: {
            ...e.timeline,
            trimRanges: [...e.timeline.trimRanges, d]
          }
        },
        resultJson: JSON.stringify({ trimRangeId: d.id, startSec: o, endSec: c }),
        summary: `added trim ${q(o)} – ${q(c)}`
      };
    }
    case "addTrims": {
      const a = lh.safeParse(r);
      return a.success ? Go(e, "addTrim", a.data.ranges, s, "trim") : j(a.error.message);
    }
    case "setTrim": {
      const a = uh.safeParse(r);
      if (!a.success) return j(a.error.message);
      const { trimRangeId: i } = a.data;
      if (!e.timeline.trimRanges.some((d) => d.id === i))
        return j(`Unknown trim range: ${i}`);
      const o = Math.min(a.data.startSec, a.data.endSec), c = Math.max(a.data.startSec, a.data.endSec), l = (d) => {
        if (!d.clipId) return;
        const h = (m) => c > m.sourceStartSec && o < (m.sourceEndSec ?? Number.POSITIVE_INFINITY), f = e.timeline.clips.find((m) => m.id === d.clipId);
        if (f && h(f)) return d.clipId;
        const p = e.timeline.clips.filter(
          (m) => m.assetId === d.assetId && h(m)
        );
        return p.length === 1 ? p[0].id : d.clipId;
      };
      return {
        ok: !0,
        document: {
          ...e,
          timeline: {
            ...e.timeline,
            trimRanges: e.timeline.trimRanges.map(
              (d) => d.id === i ? { ...d, clipId: l(d), startSec: o, endSec: c } : d
            )
          }
        },
        resultJson: JSON.stringify({ trimRangeId: i, startSec: o, endSec: c }),
        summary: `moved trim to ${q(o)} – ${q(c)}`
      };
    }
    case "setClipRange": {
      const a = hh.safeParse(r);
      if (!a.success) return j(a.error.message);
      const { clipId: i } = a.data;
      if (!e.timeline.clips.some((h) => h.id === i))
        return j(`Unknown clip: ${i}`);
      const o = Math.min(a.data.sourceStartSec, a.data.sourceEndSec), c = Math.max(a.data.sourceStartSec, a.data.sourceEndSec), l = up(e, i, o, c), u = Xr(e, l), d = u.droppedModifierIds.length + u.droppedTrimIds.length;
      return {
        ok: !0,
        document: l,
        resultJson: JSON.stringify({ clipId: i, sourceStartSec: o, sourceEndSec: c, ...u }),
        summary: `trimmed clip to ${q(o)} – ${q(c)}` + (d > 0 ? ` — dropped ${[...u.droppedModifierIds, ...u.droppedTrimIds].join(", ")}` : "")
      };
    }
    case "moveClip": {
      const a = fh.safeParse(r);
      if (!a.success) return j(a.error.message);
      const { clipId: i } = a.data, o = a.data.beforeClipId ?? null, c = e.timeline.clips, l = c.find((p) => p.id === i);
      if (!l) return j(`Unknown clip: ${i}. ${Jo(e)}`);
      if (o === i)
        return j(
          `beforeClipId must name a different clip than clipId (both were ${i}); pass null to move it last.`
        );
      const u = c.filter((p) => p.id !== i);
      let d = u.length;
      if (o !== null && (d = u.findIndex((p) => p.id === o), d < 0))
        return j(`Unknown clip: ${o}. ${Jo(e)}`);
      let h;
      try {
        h = lp(e, i, d, l.origin, "");
      } catch (p) {
        return j(p instanceof Error ? p.message : String(p));
      }
      const f = h.timeline.clips.map((p) => p.id);
      return {
        ok: !0,
        document: h,
        resultJson: JSON.stringify({
          clipId: i,
          beforeClipId: o,
          clipOrder: f,
          // Nothing is destroyed by a reorder — say so, since the alternative
          // tool the model used to reach for destroyed plenty in silence.
          trimCount: h.timeline.trimRanges.length,
          ...Xr(e, h)
        }),
        summary: `moved ${i} ${o ? `before ${o}` : "to the end"} (order: ${f.join(" → ")})`
      };
    }
    case "replaceTimeline": {
      const a = dh.safeParse(r);
      if (!a.success) return j(a.error.message);
      const i = op(e, a.data.intervals), o = [];
      if (i.reorderRequested && o.push(
        "- the intervals are not in ascending order, so this reads as a REORDER. replaceTimeline sorts and merges its intervals, so the swap could not happen at all: use moveClip (it preserves ids, trims and anchored effects)."
      ), i.lostClipIds.length > 0 && o.push(
        `- these clips would be merged away or dropped: ${i.lostClipIds.join(", ")}. To shorten one, use setClipRange; to delete one, removeClip; to change the order, moveClip; to cut a span inside one, addTrim.`
      ), i.slidRegionIds.length > 0 && o.push(
        `- these effects are anchored to those clips and would be re-anchored onto whatever footage moved under them: ${i.slidRegionIds.join(", ")}.`
      ), o.length > 0)
        return {
          ok: !1,
          resultJson: JSON.stringify({
            error: `Refused: replaceTimeline would destroy work you were not asked to touch. Nothing was modified.
${o.join(`
`)}
replaceTimeline rebuilds the whole timeline and is only for an explicit 'start over with these intervals' on a timeline with nothing to lose.`,
            code: "would_destroy",
            reorderRequested: i.reorderRequested,
            lostClipIds: i.lostClipIds,
            slidRegionIds: i.slidRegionIds
          })
        };
      let c;
      try {
        c = cp(e, a.data.intervals, a.data.reason, "agent");
      } catch (u) {
        return j(u instanceof Error ? u.message : String(u));
      }
      const l = a.data.intervals.length;
      return {
        ok: !0,
        document: c,
        resultJson: JSON.stringify({
          clipCount: c.timeline.clips.length,
          trimCount: c.timeline.trimRanges.length,
          // What survived, by name. The old result reported two counts, and a
          // model reading `trimCount: 0` after a rebuild had nothing telling it
          // WHICH cut had ceased to exist — which is what made "the silence trim
          // is preserved" so easy to write.
          preservedClipIds: i.slots.map((u) => u.keepClipId).filter((u) => !!u),
          ...i.absorbedTrimIds.length ? { absorbedTrimIds: i.absorbedTrimIds } : {},
          ...i.clippedTrimIds.length ? { clippedTrimIds: i.clippedTrimIds } : {}
        }),
        summary: `rebuilt timeline from ${l} interval${l === 1 ? "" : "s"} (${c.timeline.clips.length} clips, ${c.timeline.trimRanges.length} trims)` + (i.absorbedTrimIds.length ? ` — ${i.absorbedTrimIds.join(", ")} now fall outside the kept spans` : "")
      };
    }
    case "addZoom": {
      const a = Zi.safeParse(r);
      if (!a.success) return j(a.error.message);
      const i = Ue(Math.min(a.data.startSec, a.data.endSec)), o = Ue(Math.max(a.data.startSec, a.data.endSec)), c = {
        id: He("zoom"),
        startMs: i,
        endMs: o,
        depth: a.data.depth,
        focus: a.data.focus,
        focusMode: "manual",
        source: "manual"
      }, l = Is(c, e, "zoom"), u = Dn(l, e);
      if (!u.anchored) return mt("zoom", i / 1e3, o / 1e3, e);
      const d = {
        ...e,
        zoomRanges: [...e.zoomRanges, ...l]
      }, h = qo(l, e, c.focus, s?.cursorTelemetry);
      return {
        ok: !0,
        document: d,
        resultJson: JSON.stringify({
          zoomId: u.ids[0],
          depth: c.depth,
          // The depth alone is an ordinal; reported on its own it is what the
          // model turns into "3×" for a frame that renders 1.80×.
          renderedScale: Ln(c),
          ...gt(u, i / 1e3, o / 1e3),
          ...h ? { cursorAnchor: h } : {}
        }),
        summary: `added zoom ${q(u.startSec)} – ${q(u.endSec)} at ${Ln(c).toFixed(2)}×` + yt(u, i / 1e3, o / 1e3)
      };
    }
    case "addZooms": {
      const a = _h.safeParse(r);
      return a.success ? Go(e, "addZoom", a.data.regions, s, "zoom") : j(a.error.message);
    }
    case "setZoom": {
      const a = wh.safeParse(r);
      if (!a.success) return j(a.error.message);
      const { zoomId: i } = a.data, o = e.zoomRanges.find((_) => _.id === i);
      if (!o) return j(`Unknown zoom: ${i}`);
      const { startMs: c, endMs: l } = xs(o, a.data.startSec, a.data.endSec), u = new Set(_s(e.zoomRanges, i)), d = a.data.depth !== void 0 && e.zoomRanges.some((_) => u.has(_.id) && _.customScale != null), h = ws(
        // payload edits first, applied to every region under the pill…
        e.zoomRanges.map((_) => {
          if (!u.has(_.id)) return _;
          const { customScale: b, ...v } = _;
          return {
            ...d ? v : _,
            ...a.data.depth !== void 0 ? { depth: a.data.depth } : {},
            ...a.data.focus ? { focus: a.data.focus } : {}
          };
        }),
        // …then the span: clamped against different-property pills, then re-ventilated.
        i,
        c,
        l,
        e.timeline.clips,
        () => He("zoom")
      ), f = As(e.zoomRanges, h, u, e);
      if (!f.anchored) return mt("zoom", c / 1e3, l / 1e3, e);
      const p = { ...e, zoomRanges: h }, m = new Set(f.ids), g = h.find((_) => m.has(_.id)), y = g ? qo(
        h.filter((_) => m.has(_.id)),
        e,
        g.focus,
        s?.cursorTelemetry
      ) : void 0;
      return {
        ok: !0,
        document: p,
        resultJson: JSON.stringify({
          zoomId: f.ids[0] ?? i,
          ...g ? { depth: g.depth, renderedScale: Ln(g) } : {},
          ...d ? { clearedCustomScale: !0 } : {},
          ...gt(f, c / 1e3, l / 1e3),
          ...y ? { cursorAnchor: y } : {}
        }),
        summary: `updated zoom ${q(f.startSec)} – ${q(f.endSec)}` + (g ? ` at ${Ln(g).toFixed(2)}×` : "") + (d ? " (cleared its custom scale so the depth applies)" : "") + yt(f, c / 1e3, l / 1e3)
      };
    }
    case "addSpeed": {
      const a = vh.safeParse(r);
      if (!a.success) return j(a.error.message);
      const i = Ue(Math.min(a.data.startSec, a.data.endSec)), o = Ue(Math.max(a.data.startSec, a.data.endSec)), c = e.legacyEditor ?? {}, l = c.speedRegions ?? [], u = { id: He("speed"), startMs: i, endMs: o, speed: a.data.speed }, d = Is(u, e, "speed"), h = Dn(d, e);
      return h.anchored ? {
        ok: !0,
        document: {
          ...e,
          legacyEditor: { ...c, speedRegions: [...l, ...d] }
        },
        resultJson: JSON.stringify({
          speedId: h.ids[0],
          speed: u.speed,
          ...gt(h, i / 1e3, o / 1e3)
        }),
        summary: `added ${a.data.speed}× speed ${q(h.startSec)} – ${q(h.endSec)}` + yt(h, i / 1e3, o / 1e3)
      } : mt("speed region", i / 1e3, o / 1e3, e);
    }
    case "setSpeed": {
      const a = bh.safeParse(r);
      if (!a.success) return j(a.error.message);
      const i = e.legacyEditor ?? {}, o = i.speedRegions ?? [], c = o.find((g) => g.id === a.data.speedId), l = new Set(_s(o, a.data.speedId));
      if (!c) return j(`Unknown speed region: ${a.data.speedId}`);
      const { startMs: u, endMs: d } = xs(c, a.data.startSec, a.data.endSec), h = a.data.speed ?? c.speed, f = ws(
        o.map((g) => l.has(g.id) ? { ...g, speed: h } : g),
        a.data.speedId,
        u,
        d,
        e.timeline.clips,
        () => He("speed")
      ), p = As(o, f, l, e);
      return p.anchored ? {
        ok: !0,
        document: {
          ...e,
          legacyEditor: { ...i, speedRegions: f }
        },
        resultJson: JSON.stringify({
          speedId: p.ids[0] ?? a.data.speedId,
          speed: h,
          ...gt(p, u / 1e3, d / 1e3)
        }),
        summary: `updated speed to ${h}× over ${q(p.startSec)} – ${q(p.endSec)}` + yt(p, u / 1e3, d / 1e3)
      } : mt("speed region", u / 1e3, d / 1e3, e);
    }
    case "addAnnotation": {
      const a = Sh.safeParse(r);
      if (!a.success) return j(a.error.message);
      const i = Ue(Math.min(a.data.startSec, a.data.endSec)), o = Ue(Math.max(a.data.startSec, a.data.endSec)), c = {
        id: He("ann"),
        startMs: i,
        endMs: o,
        type: "text",
        content: a.data.text,
        textContent: a.data.text,
        position: { x: a.data.x, y: a.data.y },
        size: { width: 30, height: 20 },
        style: {
          color: "#ffffff",
          backgroundColor: "transparent",
          fontSize: 32,
          fontFamily: "Inter",
          fontWeight: "bold",
          fontStyle: "normal",
          textDecoration: "none",
          textAlign: "center"
        },
        zIndex: e.annotations.length + 1
      }, l = Is(c, e, "ann"), u = Dn(l, e);
      return u.anchored ? {
        ok: !0,
        document: {
          ...e,
          annotations: [...e.annotations, ...l]
        },
        resultJson: JSON.stringify({
          annotationId: u.ids[0],
          ...gt(u, i / 1e3, o / 1e3)
        }),
        summary: `added annotation "${a.data.text.slice(0, 24)}" ${q(u.startSec)} – ${q(u.endSec)}` + yt(u, i / 1e3, o / 1e3)
      } : mt("annotation", i / 1e3, o / 1e3, e);
    }
    case "setAnnotation": {
      const a = kh.safeParse(r);
      if (!a.success) return j(a.error.message);
      const { annotationId: i } = a.data, o = e.annotations.find((p) => p.id === i), c = new Set(_s(e.annotations, i));
      if (!o) return j(`Unknown annotation: ${i}`);
      const { startMs: l, endMs: u } = xs(o, a.data.startSec, a.data.endSec), d = ws(
        e.annotations.map(
          (p) => c.has(p.id) ? {
            ...p,
            ...a.data.text !== void 0 ? { content: a.data.text, textContent: a.data.text } : {}
          } : p
        ),
        i,
        l,
        u,
        e.timeline.clips,
        () => He("ann")
      ), h = As(
        e.annotations,
        d,
        c,
        e
      );
      return h.anchored ? {
        ok: !0,
        document: { ...e, annotations: d },
        resultJson: JSON.stringify({
          annotationId: h.ids[0] ?? i,
          ...gt(h, l / 1e3, u / 1e3)
        }),
        summary: `updated annotation ${q(h.startSec)} – ${q(h.endSec)}` + yt(h, l / 1e3, u / 1e3)
      } : mt("annotation", l / 1e3, u / 1e3, e);
    }
    case "addCameraFullscreen": {
      const a = Ch.safeParse(r);
      if (!a.success) return j(a.error.message);
      const i = Ue(Math.min(a.data.startSec, a.data.endSec)), o = Ue(Math.max(a.data.startSec, a.data.endSec)), c = e.legacyEditor ?? {}, l = c.cameraFullscreenRegions ?? [], u = { id: He("camfull"), startMs: i, endMs: o }, d = Is(u, e, "camfull"), h = Dn(d, e);
      if (!h.anchored)
        return mt("full-camera region", i / 1e3, o / 1e3, e);
      const f = Wo(e, h.startSec, h.endSec);
      return f || {
        ok: !0,
        document: {
          ...e,
          legacyEditor: { ...c, cameraFullscreenRegions: [...l, ...d] }
        },
        resultJson: JSON.stringify({
          cameraFullscreenId: h.ids[0],
          ...gt(h, i / 1e3, o / 1e3)
        }),
        summary: `full-camera ${q(h.startSec)} – ${q(h.endSec)}` + yt(h, i / 1e3, o / 1e3)
      };
    }
    case "setCameraFullscreen": {
      const a = Eh.safeParse(r);
      if (!a.success) return j(a.error.message);
      const i = e.legacyEditor ?? {}, o = i.cameraFullscreenRegions ?? [], c = o.find((g) => g.id === a.data.cameraFullscreenId);
      if (!c)
        return j(`Unknown full-camera region: ${a.data.cameraFullscreenId}`);
      const { startMs: l, endMs: u } = xs(c, a.data.startSec, a.data.endSec), d = new Set(_s(o, a.data.cameraFullscreenId)), h = ws(
        o,
        a.data.cameraFullscreenId,
        l,
        u,
        e.timeline.clips,
        () => He("camfull")
      ), f = As(o, h, d, e);
      if (!f.anchored)
        return mt("full-camera region", l / 1e3, u / 1e3, e);
      const p = Wo(e, f.startSec, f.endSec);
      return p || {
        ok: !0,
        document: {
          ...e,
          legacyEditor: { ...i, cameraFullscreenRegions: h }
        },
        resultJson: JSON.stringify({
          cameraFullscreenId: f.ids[0] ?? a.data.cameraFullscreenId,
          ...gt(f, l / 1e3, u / 1e3)
        }),
        summary: `moved full-camera to ${q(f.startSec)} – ${q(f.endSec)}` + yt(f, l / 1e3, u / 1e3)
      };
    }
    case "removeTrim": {
      const a = Th.safeParse(r);
      if (!a.success) return j(a.error.message);
      const { trimRangeId: i } = a.data;
      return e.timeline.trimRanges.some((c) => c.id === i) ? {
        ok: !0,
        document: so(e, "trim", i),
        resultJson: JSON.stringify({ removed: i, kind: "trim" }),
        summary: `removed trim ${i}`
      } : j(`Unknown trim range: ${i}`);
    }
    case "removeModifier": {
      const a = xh.safeParse(r);
      if (!a.success) return j(a.error.message);
      const { id: i } = a.data, o = e.legacyEditor ?? {}, c = o.speedRegions ?? [], l = o.cameraFullscreenRegions ?? [];
      let u = null;
      return e.zoomRanges.some((h) => h.id === i) ? u = "zoom" : e.annotations.some((h) => h.id === i) ? u = "annotation" : c.some((h) => h.id === i) ? u = "speed" : l.some((h) => h.id === i) && (u = "cameraFullscreen"), u ? {
        ok: !0,
        document: so(e, u, i),
        resultJson: JSON.stringify({ removed: i, kind: u }),
        summary: `removed ${u} ${i}`
      } : j(
        `No zoom / speed / annotation / full-camera modifier with id ${i}. For a trim use removeTrim; for a clip use removeClip.`
      );
    }
    case "removeClip": {
      const a = Mh.safeParse(r);
      if (!a.success) return j(a.error.message);
      const { clipId: i } = a.data;
      if (!e.timeline.clips.some((u) => u.id === i))
        return j(`Unknown clip: ${i}`);
      const o = ip(e, i), c = Xr(e, o), l = c.droppedModifierIds.length + c.droppedTrimIds.length;
      return {
        ok: !0,
        document: o,
        resultJson: JSON.stringify({
          removed: i,
          clipCount: o.timeline.clips.length,
          ...c
        }),
        summary: `removed clip ${i}` + (l > 0 ? ` — dropped ${[...c.droppedModifierIds, ...c.droppedTrimIds].join(", ")}` : "")
      };
    }
    default:
      return j(`Unknown tool: ${t}`);
  }
}
const eS = [
  "",
  "PROJECT EDITS ARE CURRENTLY DISABLED by the user, who asked to be consulted before the timeline changes.",
  "- Read freely: getCurrentDocument and getTranscript work as usual.",
  "- Do NOT call any tool that writes (addTrim, setTrim, setClipRange, moveClip, replaceTimeline, add*/set* effects, remove*). Every one of them will be refused, so calling them wastes the turn and tells the user nothing.",
  "- Instead: say precisely what you would change — which tool, which times, which ids — and ask the user to confirm. Be specific enough that they can say yes to it.",
  "- Never state or imply that an edit was applied. If the user confirms and you are still refused, tell them the 'Project edits' setting in Settings → AI has to be re-enabled first."
].join(`
`), Zo = [
  "You are an AI video editor working inside Drift. The user is editing a recording.",
  "Help them cut silences, tighten pacing, add captions, and rewrite titles.",
  "Be concise, action-oriented, and reference the timeline or transcript by time when relevant.",
  "You can call the tools below against the live document snapshot; the runtime executes each edit and feeds the result back into the loop.",
  "The AxcutDocument is the single source of truth. The timeline, the transcript editor, and the chat panel are all direct editors of the same document — when the user places a clip on the timeline, the document updates immediately, and when the timeline is empty, the document has no clips. Your edits operate on the live document, so preserve the user's placed clips.",
  "",
  "Time-bases (do not mix them up): clips and trims are in SOURCE-time seconds of an asset; zooms, speed regions, annotations and camera-fullscreen regions are in VIRTUAL (edited-timeline) seconds — the position on the ruler after clips + trims are applied. getCurrentDocument returns all of them, clearly labelled.",
  "",
  // ponytail: these describe what each tool is FOR, deliberately without quoting
  // user phrasings. A phrase→tool table reads as helpful and is not: it swaps the
  // model's language understanding for a lookup, so it covers the wordings we
  // happened to list and silently misses every paraphrase — and every language
  // other than English. Say what the tool does; let the model do the matching.
  "How the tools map to intent — pick the most specific one, and prefer the smallest edit that satisfies the request:",
  "- Silences, pauses and dead stretches are removed as trims INSIDE the placed clip. Send them together with addTrims once you know the ranges; addTrim is for a single cut or a correction. The placed clip stays the canonical cut; it is not rebuilt to drop them.",
  "- Changing where a clip starts or ends within its source is setClipRange — the clip's in/out, distinct from a trim.",
  `- addZoom takes a virtual-timeline span (depth is an ordinal 1–6 selecting from a fixed table — ${Gn} — never a multiplier; focus in 0–1 frame fractions). addSpeed changes pacing over a span. addAnnotation puts text on screen. addCameraFullscreen enlarges the webcam, and only does something where assets[].hasCameraTrack is true.`,
  "- moveClip changes the order of placed clips, one call per clip that moves, preserving ids, source ranges, trims and anchored effects. replaceTimeline rebuilds the timeline from kept intervals and sorts them, so it cannot reorder anything.",
  "- Deleting is a first-class action, not a workaround: removeTrim, removeModifier, removeClip. Never fake a deletion by re-adding an element or zeroing it out (span 0, speed 1×) — that leaves it in the document and misreports what you did.",
  "If nothing in the list does what was asked, say so; do not approximate it with a bigger tool.",
  "",
  "Cursor telemetry: while the screen was captured, Drift recorded where the pointer went. assets[].hasCursorTelemetry in getCurrentDocument says which assets carry it, and getCursorTrack returns the recorded track for one of them — positions over time, and the pointer shape at each moment. What it means is yours to read.",
  "Blindness is not evidence. When a tool reports it could not read something (reason 'unavailable'), that is a limit of your runtime, not a fact about the project. Only an explicit negative — reason 'no-sidecar', or a false flag — supports telling the user the data is not there.",
  "",
  "Honesty rules: if a request has NO matching tool (e.g. deleting an asset/recording, exporting), say so plainly — do not substitute a different edit and report it as the requested one. After your edits, if you are at all unsure the document ended up as intended, call getCurrentDocument and reconcile what you claim with the real state; each tool result already tells you exactly what it did, so never report a change the results don't support."
].join(`
`);
function Oh(e) {
  return e.editsAllowed ? Zo : Zo + eS;
}
Oh({ editsAllowed: !0 });
const tS = {
  getCurrentDocument: "Read a compact snapshot of the current project: assets (with durations), timeline clips and trim ranges (source-time), and the zoom / speed / annotation effects (virtual, edited-timeline time). Call this before editing if the snapshot in the system prompt may be stale. The AxcutDocument is the single source of truth — your edits should preserve the user's placed clips and any timeline state they have already set up.",
  getTranscript: "Read the transcript segments (speech and silence, with start/end seconds and text) for an asset. Omit assetId to read the primary asset's transcript.",
  getCursorTrack: "Read the recorded pointer track for an asset: where the cursor was over time, downsampled to a readable rate. Each point carries atSec (the asset's own source clock), virtualSec (the same instant on the edited timeline — the coordinate addZoom takes, null when no clip carries it), cx/cy as 0–1 fractions of the frame, and `shape`, an index into the pointer bitmaps the recording used (equal values are the same pointer; a change means the pointer changed, e.g. arrow to text caret). Points that are not plain moves carry `kind`; points a trim cuts out of playback carry `trimmed`. These are real samples, not a summary — reading what the pointer was doing is yours. Omit assetId for the primary asset. It answers `available:false` in two DIFFERENT ways you must not confuse: reason 'no-sidecar' means this asset was checked and genuinely has no telemetry, while reason 'unavailable' means it could not be read from here.",
  addTrim: "Add ONE trim range: a cut of a span inside a clip (this source-time span will not be played or exported) that does NOT split the clip. Times are in seconds of the asset's source time. This is the preferred (and for 'remove silences' requests, the only) way to handle silences; it preserves the user's placed clips and only adds a cut. When you have several cuts to make, use addTrims and send them together — this one is for a single cut or a later correction. A cut belongs to ONE clip: `clipId` is inferred when a single clip covers the range, but when several clips draw on the same asset over it the call FAILS and lists them — pass the `clipId` you mean (ids come from getCurrentDocument).",
  addTrims: "Add MANY trim ranges in one call: `ranges` is a list, each entry taking exactly the fields addTrim takes. Use this whenever you have more than one cut to make — 'remove the silences' on a half-hour recording is hundreds of cuts, and sending them one at a time costs one round trip each. Each range stands or falls ALONE: one that cannot be placed is refused by itself and listed in `refused` with its index and the reason, while every other range is still applied. Nothing is rolled back, so a single bad bound never costs you the rest. The result leads with requested / appliedCount / refusedCount so you can see a partial outcome without re-reading the document — report what was refused rather than claiming the whole list landed.",
  setTrim: "Move or resize an existing trim range by id. Times are source-time seconds. The cut follows to whichever clip the new range lands in, when that clip is unambiguous.",
  setClipRange: "Set a clip's in/out points (source-time seconds) to shorten its head or tail — distinct from a trim (which cuts a span inside the clip). All clips are re-laid back-to-back afterwards, so downstream clips shift automatically. Use this ONLY when the user explicitly asks to shorten or extend a user-placed clip. Do NOT use this for 'remove silences' or 'cut pauses' — for those, use addTrim.",
  moveClip: "Reorder a placed clip: move `clipId` so it plays just before `beforeClipId` (pass null, or omit it, to move it last). Ids come from getCurrentDocument, where each clip carries its `index` and its label in `reason`. This preserves every clip id, every source range, every trim, and the zooms / speed regions / annotations anchored to each clip. This is the tool for 'swap these clips', 'put X first' and 'change the clip order' — replaceTimeline cannot reorder anything.",
  replaceTimeline: "Replace the whole timeline with the given kept intervals of the primary asset's source time. Everything outside the intervals becomes a trim. The intervals are SORTED, so this can never reorder clips — use moveClip for that. DO NOT use this for 'cut silences' or 'remove pauses' — the user has likely placed clips on the timeline that you'd be discarding. Use this ONLY when the user explicitly asks you to rebuild the timeline from scratch (e.g. 'start over with the kept intervals from the transcript'). It is refused when it would merge away, shorten or drop an existing clip; the refusal names them and the tool to use instead.",
  addZoom: `Add a zoom-in over a span of the edited timeline (virtual seconds). depth is an ORDINAL 1–6, not a factor: it selects a magnification from a fixed table (${Gn}), so the default depth 3 renders at 1.80×. The result reports renderedScale — quote that, never the depth, when telling the user how strong the zoom is. focus is the zoom centre in 0–1 fractions of the frame (default centre). When the recording's pointer telemetry can be read for the footage under the span, the result also carries \`cursorAnchor\`: \`focus\` echoes the value this call used (including the default, if you left it out), \`cursor\` is where the pointer ACTUALLY was over the span the zoom landed on — the median of the recorded samples, \`spread\` being how far the farthest one strays from it — and \`offset\` is the distance between the two, in frame fractions. It is a measurement, not a correction: nothing is moved and no call is refused over it, and a zoom framing a slide, a face, or a region the pointer never enters is a legitimate choice. \`available:false\` names what it found instead (\`no-samples\`, \`trimmed-out\`). Its ABSENCE means no telemetry was read for that footage — never that the recording has none; assets[].hasCursorTelemetry and getCursorTrack are what answer that. Use for 'zoom in on …' and the smart-zoom pass.`,
  addZooms: `Add MANY zooms in one call: \`regions\` is a list, each entry taking exactly the fields addZoom takes (same depth table, ${Gn}). Use this for the smart-zoom pass, where you have decided every zoom before emitting the first one — sending them one at a time costs one round trip each. Each region stands or falls ALONE: one that covers no clip is refused by itself and listed in \`refused\` with its index and the reason, while the others are still applied. The result leads with requested / appliedCount / refusedCount, and each applied entry carries its renderedScale — quote that, never the depth — plus the same \`cursorAnchor\` addZoom reports, whenever the footage under that region has readable pointer telemetry.`,
  setZoom: `Move, resize, or restyle an existing zoom by id (virtual-timeline seconds). Only the fields you pass are changed. depth selects from the same table (${Gn}); if the zoom carries a customScale (getCurrentDocument shows it as depthIsOverridden), that custom value is what renders, and passing depth clears it so the depth takes effect — the result says so. The result reports the resulting renderedScale, and — when the footage under the span has readable pointer telemetry — the same \`cursorAnchor\` addZoom reports, measured against the zoom's EFFECTIVE focus, so a call that moved only the span still learns what its unchanged focus is now looking at.`,
  addSpeed: "Add a speed-change region over a span of the edited timeline (virtual seconds). speed > 1 fast-forwards, < 1 slows down (default 1.5×). Use to speed through slow stretches without cutting them.",
  setSpeed: "Move, resize, or change the multiplier of an existing speed region by id (virtual-timeline seconds). Only the fields you pass are changed.",
  addAnnotation: "Add a text annotation over a span of the edited timeline (virtual seconds). x/y are frame percentages (0–100, default centre). Use for callouts and labels.",
  setAnnotation: "Move, resize, or edit the text of an existing annotation by id (virtual-timeline seconds). Only the fields you pass are changed.",
  addCameraFullscreen: "Add a camera-fullscreen region over a span of the edited timeline (virtual seconds): the webcam fills the frame for that span. This only does something when the footage under that span comes from an asset with a linked webcam — check assets[].hasCameraTrack (or hasAnyCamera) in getCurrentDocument first. On footage with no camera the call is refused rather than storing a region that would render nothing; say so instead of retrying.",
  setCameraFullscreen: "Move or resize an existing camera-fullscreen region by id (virtual-timeline seconds). Only the fields you pass are changed. Refused if the new span lands on footage with no linked webcam.",
  removeTrim: "Delete a trim range by id — the cut is undone and that span plays/exports again. This is how you 'remove a trim'; never re-add a trim to undo one.",
  removeModifier: "Delete a modifier (zoom / speed / annotation / camera-fullscreen) by id; the kind is resolved from the id. This is how you 'remove'/'delete' one — never neutralise it (span 0, speed 1×), which leaves it in the document. For a trim use removeTrim; for a clip use removeClip.",
  removeClip: "Delete a placed clip by id; remaining clips close the gap and effects anchored to it are dropped. Use only when the user asks to remove a clip — to shorten one, use setClipRange."
}, nS = /* @__PURE__ */ new Set([
  "getCursorTrack",
  "addZoom",
  "addZooms",
  "setZoom"
]);
function sS(e, t, n, s, r, a) {
  return cm(
    async (i) => {
      t.toolStart(n, i);
      const o = nS.has(n) ? await rS(e.current, i, a) : void 0, c = Ah(e.current, n, JSON.stringify(i), {
        editsAllowed: r,
        cursorTelemetry: { availableByAssetId: a.availableByAssetId, load: o }
      });
      return c.document && (e.current = c.document), t.toolEnd(n, c.ok, c.summary), c.resultJson;
    },
    { name: n, description: tS[n], schema: s }
  );
}
async function rS(e, t, n) {
  const s = t?.assetId, r = Ih(e, typeof s == "string" ? s : null);
  if (!r) return { status: "unavailable", assetId: null };
  if (!n.cursor)
    return { status: "unavailable", assetId: r };
  const a = e.assets.find((i) => i.id === r);
  try {
    return await n.cursor.read({ assetId: r, originalPath: a?.originalPath ?? null });
  } catch (i) {
    return {
      status: "unavailable",
      assetId: r,
      note: `Cursor telemetry could not be read: ${i instanceof Error ? i.message : String(i)}`
    };
  }
}
function aS(e, t, n = !0, s = {}) {
  const r = (a, i) => sS(e, t, a, i, n, s);
  return [
    r("getCurrentDocument", W({})),
    r("getTranscript", ph),
    r("getCursorTrack", mh),
    r("addTrim", qi),
    r("addTrims", lh),
    r("setTrim", uh),
    r("setClipRange", hh),
    r("moveClip", fh),
    r("replaceTimeline", dh),
    r("addZoom", Zi),
    r("addZooms", _h),
    r("setZoom", wh),
    r("addSpeed", vh),
    r("setSpeed", bh),
    r("addAnnotation", Sh),
    r("setAnnotation", kh),
    r("addCameraFullscreen", Ch),
    r("setCameraFullscreen", Eh),
    r("removeTrim", Th),
    r("removeModifier", xh),
    r("removeClip", Mh)
  ];
}
function iS(e) {
  return e.getName?.() !== "ChatAnthropic" ? [] : [
    Fb({
      unsupportedModelBehavior: "ignore",
      minMessagesToCache: 1
    })
  ];
}
async function oS(e, t) {
  if (!t?.probe) return;
  const n = await Promise.all(
    e.assets.map(async (r) => {
      try {
        return [
          r.id,
          await t.probe({ assetId: r.id, originalPath: r.originalPath ?? null })
        ];
      } catch {
        return null;
      }
    })
  ), s = {};
  for (const r of n)
    r && (s[r[0]] = r[1]);
  return s;
}
const cS = /* @__PURE__ */ new Set(["on_tool_start", "on_tool_end"]);
async function mS(e) {
  const { document: t, model: n, history: s, userMessage: r, sink: a } = e, i = e.editsAllowed !== !1, o = { current: t }, c = JSON.stringify(t), l = await pp(n), u = await oS(t, e.cursor), d = aS(o, a, i, {
    cursor: e.cursor,
    availableByAssetId: u
  }), h = wb({
    model: l,
    tools: d,
    systemPrompt: Oh({ editsAllowed: i }),
    middleware: iS(l)
  }).withConfig({
    // ponytail: NOT optional. LangGraph's default is 25 steps, and an
    // auto-enhance turn spends one step per silence — it would die mid-turn
    // with a GraphRecursionError, which this file's catch block relabels
    // "Empty response from model" (the same words a mute provider gets).
    // `createDeepAgent` used 1e4; that is reckless while there is still no
    // AbortSignal and no timeout anywhere on the product path — a looping
    // model would be indistinguishable from a hang. 1000 is far above any
    // real turn and still bounded.
    recursionLimit: 1e3
  }), f = [...s, { role: "user", content: r }];
  let p = [];
  try {
    const m = h.streamEvents({ messages: f }, void 0);
    let g = "";
    const y = [];
    for await (const b of m) {
      const v = typeof b.event == "string" ? b.event : "", M = b.data, I = typeof b.name == "string" ? b.name : "";
      if (v === "on_chat_model_stream") {
        const w = M?.chunk;
        w && p.push(w);
        const C = w?.content, O = mp(C);
        O && a.thinking(O);
        const A = gp(C);
        A && (a.text(A), g += A);
      } else v === "on_tool_error" ? a.toolEnd(I, !1, lS(M)) : v && !cS.has(v) && y.push({ event: v, name: I });
    }
    const _ = JSON.stringify(o.current) !== c;
    if (!g.trim()) {
      const b = p[p.length - 1], v = b ? JSON.stringify(b).slice(0, 1024) : "(no on_chat_model_stream events)", M = `Empty response from model (provider=${n.provider}, model=${n.model}, chat_model_chunks=${p.length}, other_events=${y.length}:${y.slice(0, 5).map((I) => I.event).join(",")}). Last chunk: ${v}`;
      return a.error(M), { text: "", document: o.current, mutated: _, reason: M };
    }
    return { text: g.trim(), document: o.current, mutated: _ };
  } catch (m) {
    const g = m instanceof Error ? m : new Error(String(m)), y = (g.stack ?? "").split(`
`).slice(0, 3).join(" | "), _ = `Empty response from model (provider=${n.provider}, model=${n.model}, error=${g.name}: ${g.message}` + (y ? ` stack=${y}` : "") + `). Last chunk: ${(p[p.length - 1] ? JSON.stringify(p[p.length - 1]) : "(no on_chat_model_stream events)").slice(0, 1024)}`;
    return a.error(_), {
      text: "",
      document: o.current,
      mutated: JSON.stringify(o.current) !== c,
      reason: _
    };
  }
}
function lS(e) {
  if (!e) return;
  const t = e.error;
  if (t instanceof Error) return t.message;
  if (typeof t == "string") return t;
}
export {
  tS as TOOL_DESCRIPTIONS,
  iS as anthropicCachingMiddleware,
  Oh as buildSystemPrompt,
  aS as buildTools,
  mS as invokeDriftAgent,
  Yb as isMutatingTool
};
