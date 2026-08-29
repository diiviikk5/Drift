import { d8 as f, d9 as z, da as v, db as g, dc as h, dd as B } from "./main-2iJdHqXF.js";
import * as w from "node:fs/promises";
import * as P from "node:fs";
import * as u from "node:path";
import * as W from "node:child_process";
import { execFile as K } from "node:child_process";
import * as J from "node:crypto";
import { randomUUID as X } from "node:crypto";
import * as Z from "node:readline";
import { promisify as V } from "node:util";
import { Readable as Y } from "node:stream";
import { pipeline as Q } from "node:stream/promises";
function $(i) {
  if (i.inputSchema.type !== "object")
    throw new Error(`JSON schema for tool "${i.name}" must be an object, but got ${i.inputSchema.type}`);
  return {
    type: "custom",
    name: i.name,
    input_schema: i.inputSchema,
    description: i.description,
    run: i.run,
    parse: (e) => e,
    ...i.close ? { close: i.close } : {}
  };
}
const x = 493, ee = 420;
async function te(i) {
  try {
    return await w.realpath(i);
  } catch {
    return i;
  }
}
async function ie(i) {
  const e = [];
  let t = i;
  for (; ; ) {
    let n;
    try {
      n = await w.realpath(t);
    } catch {
      let r = !1;
      try {
        r = (await w.lstat(t)).isSymbolicLink();
      } catch {
      }
      if (r) {
        t = u.resolve(u.dirname(t), await w.readlink(t));
        continue;
      }
      const s = u.dirname(t);
      if (s === t)
        return i;
      e.push(u.basename(t)), t = s;
      continue;
    }
    return e.length ? u.join(n, ...e.reverse()) : n;
  }
}
async function ne(i, e, t) {
  const n = t?.allowOutside ?? !1;
  if (u.isAbsolute(e)) {
    if (!n)
      throw new f(`absolute path ${JSON.stringify(e)} not permitted`);
    return u.resolve(e);
  }
  const r = await te(u.resolve(i)), s = u.resolve(r, e);
  if (n)
    return s;
  const o = await ie(s), a = r.endsWith(u.sep) ? r : r + u.sep;
  if (o !== r && !o.startsWith(a))
    throw new f(`path ${JSON.stringify(e)} escapes workdir`);
  return o;
}
async function D(i, e) {
  const t = u.dirname(i), n = u.join(t, `.tmp-${process.pid}-${X()}`);
  let r;
  try {
    r = await w.open(n, "wx", ee), await r.writeFile(e, "utf-8"), await r.sync(), await r.close(), r = void 0, await w.rename(n, i);
  } catch (s) {
    throw r && await r.close().catch(() => {
    }), await w.unlink(n).catch(() => {
    }), s;
  }
}
function M(i, e) {
  switch (i?.code) {
    case "ENOENT":
      return `${e}: no such file or directory`;
    case "EACCES":
    case "EPERM":
      return `${e}: permission denied`;
    case "ENOTDIR":
      return `${e}: not a directory`;
    case "EISDIR":
      return `${e}: is a directory`;
    case "ELOOP":
      return `${e}: too many levels of symbolic links`;
    case "ENAMETOOLONG":
      return `${e}: file name too long`;
    case "ENOSPC":
      return `${e}: no space left on device`;
    case "EMFILE":
    case "ENFILE":
      return `${e}: too many open files`;
    default:
      return `${e}: ${i instanceof Error ? i.message : String(i)}`;
  }
}
const re = V(K);
async function Ne(i) {
  const { client: e, sessionId: t } = i;
  if (!e || !t)
    return async () => {
    };
  const n = z(e), r = await e.beta.sessions.retrieve(t), s = u.resolve(i.workdir, "skills"), o = [];
  for (const a of r.agent.skills)
    try {
      const c = await se(e, a.skill_id, a.version), d = await e.beta.skills.versions.retrieve(c, { skill_id: a.skill_id });
      let l = u.basename(d.name.trim());
      (l === "" || l === "." || l === "..") && (l = a.skill_id);
      const y = u.resolve(s, l);
      if (y !== s && !y.startsWith(s + u.sep)) {
        n.warn("skill name escapes the skills dir; skipping", {
          component: "agent-tool-context",
          name: d.name
        });
        continue;
      }
      const k = await e.beta.skills.versions.download(c, { skill_id: a.skill_id });
      await w.rm(y, { recursive: !0, force: !0 }), await w.mkdir(y, { recursive: !0, mode: x }), o.push(y), await le(k, y), n.info("downloaded skill", {
        component: "agent-tool-context",
        skill_id: a.skill_id,
        version: c,
        dest: y
      });
    } catch (c) {
      n.warn("failed to download skill", {
        component: "agent-tool-context",
        skill_id: a.skill_id,
        error: String(c)
      });
    }
  return async () => {
    for (const a of o)
      await w.rm(a, { recursive: !0, force: !0 }).catch((c) => {
        n.warn("failed to clean up skill", { component: "agent-tool-context", dest: a, error: String(c) });
      });
  };
}
async function se(i, e, t) {
  if (/^\d+$/.test(t))
    return t;
  let n;
  for await (const r of i.beta.skills.versions.list(e))
    /^\d+$/.test(r.version) && (n === void 0 || BigInt(r.version) > BigInt(n)) && (n = r.version);
  if (n === void 0)
    throw new v(`skill ${JSON.stringify(e)} has no concrete version to resolve ${JSON.stringify(t)} against`);
  return n;
}
function oe(i) {
  for (const e of i.split(`
`)) {
    const t = e.trim();
    if (t && (u.isAbsolute(t) || t.split(/[\\/]/).includes("..")))
      throw new v(`refusing to extract unsafe archive member: ${t}`);
  }
}
function ae(i) {
  for (const e of i.split(`
`)) {
    const t = e.trimStart()[0];
    if (t === "l" || t === "h" || t === "b" || t === "c" || t === "p" || t === "s")
      throw new v("refusing to extract archive with symlink/hardlink/device member");
  }
}
async function A(i, e) {
  try {
    const { stdout: t } = await re(i, e);
    return t;
  } catch (t) {
    throw t != null && typeof t == "object" && t.code === "ENOENT" ? new v(`skill extraction requires the \`${i}\` command, but it was not found on PATH`) : t;
  }
}
function ce(i) {
  let e, t = !1;
  for (const n of i.split(`
`)) {
    const r = n.trim().split("/").filter((o) => o !== "" && o !== ".");
    if (r.length === 0)
      continue;
    const s = r[0];
    if (e === void 0)
      e = s;
    else if (s !== e)
      return "";
    r.length > 1 && (t = !0);
  }
  return e !== void 0 && t ? e : "";
}
async function le(i, e) {
  const t = u.join(e, `.skill-archive-${process.pid}-${Date.now()}`);
  if (!i.body)
    throw new v("skill download response had no body");
  await Q(Y.fromWeb(i.body), P.createWriteStream(t));
  const n = u.join(u.dirname(e), `.skill-stage-${process.pid}-${Date.now()}`);
  try {
    const r = await ue(t, 4), s = r.length >= 4 && r[0] === 80 && r[1] === 75 && r[2] === 3 && r[3] === 4, o = s ? "unzip" : "tar", a = await A(o, s ? ["-Z1", t] : ["-tf", t]);
    oe(a), ae(await A(o, s ? ["-Z", t] : ["-tvf", t]));
    const c = ce(a);
    await w.mkdir(n, { recursive: !0, mode: x }), await A(o, s ? ["-oq", t, "-d", n] : ["-xf", t, "-C", n]);
    const d = c ? u.join(n, c) : n;
    for (const l of await w.readdir(d))
      await w.rename(u.join(d, l), u.join(e, l));
  } finally {
    await w.rm(t, { force: !0 }), await w.rm(n, { recursive: !0, force: !0 });
  }
}
async function ue(i, e) {
  const t = await w.open(i, "r");
  try {
    const n = Buffer.alloc(e), { bytesRead: r } = await t.read(n, 0, e, 0);
    return n.subarray(0, r);
  } finally {
    await t.close();
  }
}
var O, p, m, S, _, b, F;
const j = 100 * 1024, U = 12e4, de = 256 * 1024, E = 100 * 1024, fe = 2e3, he = 200, we = /\x1b\[[0-9;?]*[ -/]*[@-~]/g, pe = w.glob;
function q(i) {
  return i === void 0 ? de : i;
}
function Be(i) {
  return [
    ge(i),
    be(i),
    ve(i),
    _e(i),
    $e(i),
    ke(i)
  ];
}
function T(i, e) {
  return ne(i.workdir, e, { allowOutside: i.unrestrictedPaths ?? !1 });
}
function me() {
  const i = {};
  for (const [e, t] of Object.entries(process.env))
    e.startsWith("ANTHROPIC_") || (i[e] = t);
  return i;
}
class ye {
  constructor(e, t = me()) {
    O.add(this), p.set(this, void 0), m.set(this, ""), S.set(this, !1), _.set(this, !1), b.set(this, null), g(this, p, W.spawn("/bin/bash", ["--noprofile", "--norc"], {
      cwd: e,
      // `env` is the full base environment (the scrubbed process env by
      // default, or the verbatim replacement from `AgentToolContext.env`).
      // PS1/PS2/TERM are shell-control settings BashSession always applies so
      // the pipe-based sentinel exec parsing works — not part of the
      // user-facing environment.
      env: { ...t, PS1: "", PS2: "", TERM: "dumb" },
      stdio: ["pipe", "pipe", "pipe"],
      detached: !0
    })), h(this, p, "f").stdout.setEncoding("utf8"), h(this, p, "f").stderr.setEncoding("utf8"), h(this, p, "f").stdout.on("data", (n) => h(this, O, "m", F).call(this, n)), h(this, p, "f").stderr.on("data", (n) => h(this, O, "m", F).call(this, n)), h(this, p, "f").once("close", () => {
      g(this, _, !0);
      const n = h(this, b, "f");
      g(this, b, null), n?.resolve();
    });
  }
  /** Whether the underlying shell process has exited. */
  get closed() {
    return h(this, _, "f");
  }
  async exec(e, t = {}) {
    if (h(this, _, "f"))
      throw new v("bash session terminated");
    const n = t.timeoutMs ?? U, r = t.signal;
    if (r?.aborted)
      throw new v("bash command aborted");
    g(this, m, ""), g(this, S, !1);
    const s = `__ANT_CMD_${J.randomUUID()}_DONE__`, o = `${s.slice(0, 8)}''${s.slice(8)}`, a = `{ ${e}
} </dev/null 2>&1; printf '\\n${o}%d\\n' $?
`;
    if (h(this, p, "f").stdin.write(a), h(this, m, "f").indexOf(s) < 0) {
      const { promise: G, resolve: C } = B();
      g(this, b, { sentinel: s, resolve: C });
      let R, I;
      try {
        await Promise.race([
          G,
          new Promise((H, L) => {
            R = setTimeout(() => L(new v(`bash command timed out after ${n}ms`)), n);
          }),
          new Promise((H, L) => {
            r && (I = () => L(new v("bash command aborted")), r.addEventListener("abort", I, { once: !0 }));
          })
        ]);
      } finally {
        R && clearTimeout(R), I && r && r.removeEventListener("abort", I), g(this, b, null);
      }
    }
    const c = h(this, m, "f").indexOf(s);
    if (c < 0)
      throw new v("bash session terminated");
    const l = h(this, m, "f").slice(c + s.length).match(/^(-?\d+)/), y = l ? parseInt(l[1], 10) : -1;
    let k = h(this, m, "f").slice(0, c).replace(we, "").replace(/\n+$/, "");
    return h(this, S, "f") && (k = `[output truncated]
${k}`), { output: k, exitCode: y };
  }
  close() {
    if (h(this, _, "f"))
      return;
    g(this, _, !0);
    const e = h(this, b, "f");
    g(this, b, null), e?.resolve(), h(this, p, "f").stdout.destroy(), h(this, p, "f").stderr.destroy(), h(this, p, "f").stdin.destroy();
    try {
      process.kill(-h(this, p, "f").pid, "SIGKILL");
    } catch {
      h(this, p, "f").kill("SIGKILL");
    }
    h(this, p, "f").unref();
  }
}
p = /* @__PURE__ */ new WeakMap(), m = /* @__PURE__ */ new WeakMap(), S = /* @__PURE__ */ new WeakMap(), _ = /* @__PURE__ */ new WeakMap(), b = /* @__PURE__ */ new WeakMap(), O = /* @__PURE__ */ new WeakSet(), F = function(e) {
  if (g(this, m, h(this, m, "f") + e), h(this, m, "f").length > j && (g(this, m, h(this, m, "f").slice(h(this, m, "f").length - j)), g(this, S, !0)), h(this, b, "f") && h(this, m, "f").indexOf(h(this, b, "f").sentinel) >= 0) {
    const t = h(this, b, "f");
    g(this, b, null), t.resolve();
  }
};
function ge(i) {
  let e, t = Promise.resolve();
  return $({
    name: "bash",
    description: "Run a bash command in a persistent shell. State (cwd, env vars) persists across calls.",
    inputSchema: {
      type: "object",
      properties: {
        command: { type: "string", description: "The command to run" },
        restart: { type: "boolean", description: "Restart the persistent shell before running" },
        timeout_ms: { type: "integer", description: "Per-call timeout in milliseconds" }
      }
    },
    run: async ({ command: n, restart: r, timeout_ms: s }, o) => {
      const a = t, c = B();
      t = c.promise;
      try {
        await a;
      } catch {
      }
      try {
        if (r && (e?.close(), e = void 0), !n) {
          if (r)
            return "bash session restarted";
          throw new f("bash: command is required");
        }
        e ?? (e = new ye(i.workdir, i.env));
        try {
          const { output: d, exitCode: l } = await e.exec(n, {
            timeoutMs: s ?? U,
            signal: o?.signal
          });
          if (l !== 0)
            throw new f(d || `exit ${l}`);
          return d;
        } catch (d) {
          throw d instanceof f ? d : (e.close(), e = void 0, new f(`bash: ${d instanceof Error ? d.message : String(d)}`));
        }
      } finally {
        c.resolve();
      }
    },
    close: () => {
      e?.close(), e = void 0;
    }
  });
}
function be(i) {
  return $({
    name: "read",
    description: "Read a UTF-8 text file relative to the workdir.",
    inputSchema: {
      type: "object",
      properties: {
        file_path: { type: "string" },
        view_range: {
          type: "array",
          items: { type: "integer" },
          description: "[start_line, end_line] 1-indexed inclusive"
        }
      },
      required: ["file_path"]
    },
    run: async ({ file_path: e, view_range: t }) => {
      if (!e)
        throw new f("read: file_path is required");
      const n = await T(i, e);
      let r;
      try {
        const l = await w.stat(n);
        if (!l.isFile())
          throw new f(`read: ${e} is not a regular file`);
        const y = q(i.maxFileBytes);
        if (y !== null && l.size > y)
          throw new f(`read: ${e} is ${l.size} bytes, exceeds ${y}-byte limit. Use bash (head/tail/sed) to read a slice.`);
        r = await w.readFile(n, "utf8");
      } catch (l) {
        throw l instanceof f ? l : new f(`read: ${M(l, e)}`);
      }
      if (!t)
        return r;
      if (t.length !== 2)
        throw new f("read: view_range must be [start_line, end_line]");
      const [s, o] = t, a = r.split(`
`), c = Math.max(0, s - 1), d = o > 0 ? o : a.length;
      return a.slice(c, d).join(`
`);
    }
  });
}
function ve(i) {
  return $({
    name: "write",
    description: "Write a UTF-8 text file relative to the workdir, creating parent directories as needed.",
    inputSchema: {
      type: "object",
      properties: { file_path: { type: "string" }, content: { type: "string" } },
      required: ["file_path", "content"]
    },
    run: async ({ file_path: e, content: t }) => {
      if (!e)
        throw new f("write: file_path is required");
      const n = await T(i, e);
      try {
        await w.mkdir(u.dirname(n), { recursive: !0, mode: x }), await D(n, t ?? "");
      } catch (r) {
        throw new f(`write: ${M(r, e)}`);
      }
      return `wrote ${Buffer.byteLength(t ?? "")} bytes to ${e}`;
    }
  });
}
function _e(i) {
  return $({
    name: "edit",
    description: "Replace old_string with new_string in a file. old_string must be unique unless replace_all.",
    inputSchema: {
      type: "object",
      properties: {
        file_path: { type: "string" },
        old_string: { type: "string" },
        new_string: { type: "string" },
        replace_all: { type: "boolean" }
      },
      required: ["file_path", "old_string", "new_string"]
    },
    run: async ({ file_path: e, old_string: t, new_string: n, replace_all: r }) => {
      if (!e)
        throw new f("edit: file_path is required");
      if (!t)
        throw new f("edit: old_string is required");
      const s = await T(i, e);
      let o;
      try {
        const d = await w.stat(s);
        if (!d.isFile())
          throw new f(`edit: ${e} is not a regular file`);
        const l = q(i.maxFileBytes);
        if (l !== null && d.size > l)
          throw new f(`edit: ${e} is ${d.size} bytes, exceeds ${l}-byte limit. Use bash (sed/awk) to edit a large file.`);
        o = await w.readFile(s, "utf8");
      } catch (d) {
        throw d instanceof f ? d : new f(`edit: ${M(d, e)}`);
      }
      const a = o.split(t).length - 1;
      if (a === 0)
        throw new f(`edit: old_string not found in ${e}`);
      let c;
      if (r)
        c = o.split(t).join(n);
      else {
        if (a > 1)
          throw new f(`edit: old_string appears ${a} times in ${e} (must be unique)`);
        c = o.replace(t, () => n);
      }
      try {
        await D(s, c);
      } catch (d) {
        throw new f(`edit: write: ${M(d, e)}`);
      }
      return `edited ${e} (${r ? a : 1} replacement(s))`;
    }
  });
}
function $e(i) {
  return $({
    name: "glob",
    description: "Match files under the workdir against a glob pattern. Results are mtime-sorted, newest first.",
    inputSchema: {
      type: "object",
      properties: {
        pattern: { type: "string" },
        path: { type: "string", description: "Directory to search in. Defaults to the workdir." }
      },
      required: ["pattern"]
    },
    run: async ({ pattern: e, path: t }) => {
      if (!e)
        throw new f("glob: pattern is required");
      let n = u.resolve(i.workdir), r = e;
      if (u.isAbsolute(e)) {
        if (!i.unrestrictedPaths)
          throw new f("glob: absolute pattern not permitted");
        n = u.parse(e).root, r = u.relative(n, e);
      } else t && (n = await T(i, t));
      if (!i.unrestrictedPaths && r.split(/[\\/]/).includes(".."))
        throw new f('glob: ".." is not permitted in the pattern');
      const s = [];
      try {
        for await (const o of pe(r, {
          cwd: n,
          withFileTypes: !0,
          exclude: (a) => a.name === ".git" || a.name === "node_modules"
        })) {
          if (!o.isFile())
            continue;
          const a = u.join(o.parentPath, o.name);
          if (!i.unrestrictedPaths && !Te(n, a))
            continue;
          let c = 0;
          try {
            c = (await w.stat(a)).mtimeMs;
          } catch {
          }
          s.push({ path: a, mtime: c });
        }
      } catch (o) {
        throw new f(`glob: ${o instanceof Error ? o.message : String(o)}`);
      }
      return s.length === 0 ? "no matches" : (s.sort((o, a) => a.mtime - o.mtime), s.slice(0, he).map((o) => o.path).join(`
`));
    }
  });
}
function ke(i) {
  return $({
    name: "grep",
    description: "Search file contents for a regex. Uses ripgrep if available, otherwise a built-in walker.",
    inputSchema: {
      type: "object",
      properties: { pattern: { type: "string" }, path: { type: "string" } },
      required: ["pattern"]
    },
    run: async ({ pattern: e, path: t }, n) => {
      if (!e)
        throw new f("grep: pattern is required");
      let r = u.resolve(i.workdir);
      t && (r = await T(i, t));
      const s = await Re();
      return s ? Se(s, e, r, n?.signal) : Ee(e, r, n?.signal);
    }
  });
}
function Se(i, e, t, n) {
  return new Promise((r, s) => {
    const o = W.spawn(i, ["-n", "--no-heading", "-e", e, "--", t], {
      ...n ? { signal: n } : {}
    });
    let a = "", c = "", d = !1;
    o.stdout.on("data", (l) => {
      d || (a += l, a.length > E && (d = !0, a = a.slice(0, E), o.kill("SIGKILL")));
    }), o.stderr.on("data", (l) => c += l), o.on("close", (l) => {
      if (n?.aborted)
        return s(new f("grep: aborted"));
      if (d)
        return r(a + `
[output truncated at ${E} bytes]`);
      if (l === 0)
        return r(a);
      if (l === 1)
        return r("no matches");
      s(new f(`grep: rg failed: ${c || `exit ${l}`}`));
    }), o.on("error", (l) => {
      if (n?.aborted)
        return s(new f("grep: aborted"));
      s(new f(`grep: rg failed: ${l.message}`));
    });
  });
}
async function Ee(i, e, t) {
  let n;
  try {
    n = new RegExp(i);
  } catch (c) {
    throw new f(`grep: invalid regex: ${c instanceof Error ? c.message : String(c)}`);
  }
  const r = [];
  let s = E;
  const o = (c) => (s -= c.length + 1, s < 0 ? (r.push(`[output truncated at ${E} bytes]`), !1) : (r.push(c), !0));
  if ((await w.stat(e).catch(() => null))?.isFile() ? await N(e, n, o) : await Me(e, "", (c) => N(u.join(e, c), n, o), t), t?.aborted)
    throw new f("grep: aborted");
  return r.length === 0 ? "no matches" : r.join(`
`);
}
async function N(i, e, t) {
  const n = P.createReadStream(i, { encoding: "utf8" }), r = Z.createInterface({ input: n, crlfDelay: 1 / 0 });
  let s = 0;
  try {
    for await (const o of r)
      if (s++, !(o.length > fe) && e.test(o) && !t(`${i}:${s}:${o}`))
        return !1;
  } catch {
  } finally {
    n.destroy();
  }
  return !0;
}
function Te(i, e) {
  const t = u.relative(i, e);
  return t === "" || !t.startsWith(".." + u.sep) && t !== ".." && !u.isAbsolute(t);
}
const Ie = 40, Oe = 5e4;
async function Me(i, e, t, n) {
  let r = Oe;
  async function s(o, a) {
    if (a > Ie)
      return !0;
    if (n?.aborted)
      return !1;
    let c;
    try {
      c = await w.readdir(u.join(i, o), { withFileTypes: !0 });
    } catch {
      return !0;
    }
    for (const d of c) {
      if (d.name === ".git" || d.name === "node_modules")
        continue;
      if (r-- <= 0 || n?.aborted)
        return !1;
      const l = o ? u.join(o, d.name) : d.name;
      if (d.isDirectory()) {
        if (!await s(l, a + 1))
          return !1;
      } else if (d.isFile() && await t(l) === !1)
        return !1;
    }
    return !0;
  }
  await s(e, 0);
}
async function Re() {
  const i = (process.env.PATH ?? "").split(u.delimiter);
  for (const e of i) {
    const t = u.join(e, "rg");
    try {
      return await w.access(t, P.constants.X_OK), t;
    } catch {
    }
  }
  return null;
}
export {
  ye as BashSession,
  Be as betaAgentToolset20260401,
  ge as betaBashTool,
  _e as betaEditTool,
  $e as betaGlobTool,
  ke as betaGrepTool,
  be as betaReadTool,
  ve as betaWriteTool,
  le as extractSkillArchive,
  T as resolvePath,
  se as resolveSkillVersion,
  Ne as setupSkills
};
