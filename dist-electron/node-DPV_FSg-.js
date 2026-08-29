import { d8 as ToolError, d9 as loggerFor, da as AnthropicError, db as __classPrivateFieldSet, dc as __classPrivateFieldGet, dd as promiseWithResolvers } from "./main-DsZ7BJAQ.js";
import * as fs from "node:fs/promises";
import * as nodeFs from "node:fs";
import * as path from "node:path";
import * as cp from "node:child_process";
import { execFile } from "node:child_process";
import * as crypto from "node:crypto";
import { randomUUID } from "node:crypto";
import * as readline from "node:readline";
import { promisify } from "node:util";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
function betaTool(options) {
  if (options.inputSchema.type !== "object") {
    throw new Error(`JSON schema for tool "${options.name}" must be an object, but got ${options.inputSchema.type}`);
  }
  return {
    type: "custom",
    name: options.name,
    input_schema: options.inputSchema,
    description: options.description,
    run: options.run,
    parse: (content) => content,
    ...options.close ? { close: options.close } : {}
  };
}
const DIR_CREATE_MODE = 493;
const FILE_CREATE_MODE = 420;
async function realpathOrSelf(p) {
  try {
    return await fs.realpath(p);
  } catch {
    return p;
  }
}
async function canonicalize(abs) {
  const tail = [];
  let prefix = abs;
  for (; ; ) {
    let real;
    try {
      real = await fs.realpath(prefix);
    } catch {
      let isLink = false;
      try {
        isLink = (await fs.lstat(prefix)).isSymbolicLink();
      } catch {
      }
      if (isLink) {
        prefix = path.resolve(path.dirname(prefix), await fs.readlink(prefix));
        continue;
      }
      const parent = path.dirname(prefix);
      if (parent === prefix)
        return abs;
      tail.push(path.basename(prefix));
      prefix = parent;
      continue;
    }
    return tail.length ? path.join(real, ...tail.reverse()) : real;
  }
}
async function confineToRoot(root, p, opts) {
  const allowOutside = opts?.allowOutside ?? false;
  if (path.isAbsolute(p)) {
    if (!allowOutside) {
      throw new ToolError(`absolute path ${JSON.stringify(p)} not permitted`);
    }
    return path.resolve(p);
  }
  const realRoot = await realpathOrSelf(path.resolve(root));
  const abs = path.resolve(realRoot, p);
  if (allowOutside)
    return abs;
  const real = await canonicalize(abs);
  const rootSep = realRoot.endsWith(path.sep) ? realRoot : realRoot + path.sep;
  if (real !== realRoot && !real.startsWith(rootSep)) {
    throw new ToolError(`path ${JSON.stringify(p)} escapes workdir`);
  }
  return real;
}
async function atomicWriteFile(targetPath, content) {
  const dir = path.dirname(targetPath);
  const tempPath = path.join(dir, `.tmp-${process.pid}-${randomUUID()}`);
  let handle;
  try {
    handle = await fs.open(tempPath, "wx", FILE_CREATE_MODE);
    await handle.writeFile(content, "utf-8");
    await handle.sync();
    await handle.close();
    handle = void 0;
    await fs.rename(tempPath, targetPath);
  } catch (err) {
    if (handle)
      await handle.close().catch(() => {
      });
    await fs.unlink(tempPath).catch(() => {
    });
    throw err;
  }
}
function fsErrorMessage(err, file) {
  const code = err?.code;
  switch (code) {
    case "ENOENT":
      return `${file}: no such file or directory`;
    case "EACCES":
    case "EPERM":
      return `${file}: permission denied`;
    case "ENOTDIR":
      return `${file}: not a directory`;
    case "EISDIR":
      return `${file}: is a directory`;
    case "ELOOP":
      return `${file}: too many levels of symbolic links`;
    case "ENAMETOOLONG":
      return `${file}: file name too long`;
    case "ENOSPC":
      return `${file}: no space left on device`;
    case "EMFILE":
    case "ENFILE":
      return `${file}: too many open files`;
    default:
      return `${file}: ${err instanceof Error ? err.message : String(err)}`;
  }
}
const execFileAsync = promisify(execFile);
async function setupSkills(ctx) {
  const { client, sessionId } = ctx;
  if (!client || !sessionId)
    return async () => {
    };
  const log = loggerFor(client);
  const session = await client.beta.sessions.retrieve(sessionId);
  const skillsRoot = path.resolve(ctx.workdir, "skills");
  const created = [];
  for (const skill of session.agent.skills) {
    try {
      const versionId = await resolveSkillVersion(client, skill.skill_id, skill.version);
      const version = await client.beta.skills.versions.retrieve(versionId, { skill_id: skill.skill_id });
      let dirname = path.basename(version.name.trim());
      if (dirname === "" || dirname === "." || dirname === "..")
        dirname = skill.skill_id;
      const dest = path.resolve(skillsRoot, dirname);
      if (dest !== skillsRoot && !dest.startsWith(skillsRoot + path.sep)) {
        log.warn("skill name escapes the skills dir; skipping", {
          component: "agent-tool-context",
          name: version.name
        });
        continue;
      }
      const resp = await client.beta.skills.versions.download(versionId, { skill_id: skill.skill_id });
      await fs.rm(dest, { recursive: true, force: true });
      await fs.mkdir(dest, { recursive: true, mode: DIR_CREATE_MODE });
      created.push(dest);
      await extractSkillArchive(resp, dest);
      log.info("downloaded skill", {
        component: "agent-tool-context",
        skill_id: skill.skill_id,
        version: versionId,
        dest
      });
    } catch (e) {
      log.warn("failed to download skill", {
        component: "agent-tool-context",
        skill_id: skill.skill_id,
        error: String(e)
      });
    }
  }
  return async () => {
    for (const dest of created) {
      await fs.rm(dest, { recursive: true, force: true }).catch((e) => {
        log.warn("failed to clean up skill", { component: "agent-tool-context", dest, error: String(e) });
      });
    }
  };
}
async function resolveSkillVersion(client, skillId, version) {
  if (/^\d+$/.test(version))
    return version;
  let newest;
  for await (const v of client.beta.skills.versions.list(skillId)) {
    if (/^\d+$/.test(v.version) && (newest === void 0 || BigInt(v.version) > BigInt(newest))) {
      newest = v.version;
    }
  }
  if (newest === void 0) {
    throw new AnthropicError(`skill ${JSON.stringify(skillId)} has no concrete version to resolve ${JSON.stringify(version)} against`);
  }
  return newest;
}
function assertSafeMemberNames(names) {
  for (const raw of names.split("\n")) {
    const entry = raw.trim();
    if (!entry)
      continue;
    if (path.isAbsolute(entry) || entry.split(/[\\/]/).includes("..")) {
      throw new AnthropicError(`refusing to extract unsafe archive member: ${entry}`);
    }
  }
}
function assertNoSpecialMembers(verboseListing) {
  for (const line of verboseListing.split("\n")) {
    const type = line.trimStart()[0];
    if (type === "l" || type === "h" || type === "b" || type === "c" || type === "p" || type === "s") {
      throw new AnthropicError("refusing to extract archive with symlink/hardlink/device member");
    }
  }
}
async function runArchiveTool(cmd, args) {
  try {
    const { stdout } = await execFileAsync(cmd, args);
    return stdout;
  } catch (e) {
    if (e != null && typeof e === "object" && e.code === "ENOENT") {
      throw new AnthropicError(`skill extraction requires the \`${cmd}\` command, but it was not found on PATH`);
    }
    throw e;
  }
}
function archiveTopDir(listing) {
  let top;
  let nested = false;
  for (const raw of listing.split("\n")) {
    const parts = raw.trim().split("/").filter((p) => p !== "" && p !== ".");
    if (parts.length === 0)
      continue;
    const first = parts[0];
    if (top === void 0)
      top = first;
    else if (first !== top)
      return "";
    if (parts.length > 1)
      nested = true;
  }
  return top !== void 0 && nested ? top : "";
}
async function extractSkillArchive(resp, dest) {
  const tmp = path.join(dest, `.skill-archive-${process.pid}-${Date.now()}`);
  if (!resp.body) {
    throw new AnthropicError("skill download response had no body");
  }
  await pipeline(Readable.fromWeb(resp.body), nodeFs.createWriteStream(tmp));
  const stage = path.join(path.dirname(dest), `.skill-stage-${process.pid}-${Date.now()}`);
  try {
    const head = await readHead(tmp, 4);
    const isZip = head.length >= 4 && head[0] === 80 && head[1] === 75 && head[2] === 3 && head[3] === 4;
    const archiveCmd = isZip ? "unzip" : "tar";
    const listing = await runArchiveTool(archiveCmd, isZip ? ["-Z1", tmp] : ["-tf", tmp]);
    assertSafeMemberNames(listing);
    assertNoSpecialMembers(await runArchiveTool(archiveCmd, isZip ? ["-Z", tmp] : ["-tvf", tmp]));
    const top = archiveTopDir(listing);
    await fs.mkdir(stage, { recursive: true, mode: DIR_CREATE_MODE });
    await runArchiveTool(archiveCmd, isZip ? ["-oq", tmp, "-d", stage] : ["-xf", tmp, "-C", stage]);
    const srcRoot = top ? path.join(stage, top) : stage;
    for (const entry of await fs.readdir(srcRoot)) {
      await fs.rename(path.join(srcRoot, entry), path.join(dest, entry));
    }
  } finally {
    await fs.rm(tmp, { force: true });
    await fs.rm(stage, { recursive: true, force: true });
  }
}
async function readHead(file, n) {
  const handle = await fs.open(file, "r");
  try {
    const buf = Buffer.alloc(n);
    const { bytesRead } = await handle.read(buf, 0, n, 0);
    return buf.subarray(0, bytesRead);
  } finally {
    await handle.close();
  }
}
var _BashSession_instances, _BashSession_proc, _BashSession_buf, _BashSession_truncated, _BashSession_closed, _BashSession_waiting, _BashSession_append;
const BASH_OUTPUT_LIMIT = 100 * 1024;
const BASH_DEFAULT_TIMEOUT_MS = 12e4;
const DEFAULT_MAX_FILE_BYTES = 256 * 1024;
const GREP_OUTPUT_LIMIT = 100 * 1024;
const GREP_MAX_LINE_LENGTH = 2e3;
const GLOB_RESULT_LIMIT = 200;
const ANSI_RE = /\x1b\[[0-9;?]*[ -/]*[@-~]/g;
const fsGlob = fs.glob;
function resolveMaxBytes(configured) {
  return configured === void 0 ? DEFAULT_MAX_FILE_BYTES : configured;
}
function betaAgentToolset20260401(ctx) {
  return [
    betaBashTool(ctx),
    betaReadTool(ctx),
    betaWriteTool(ctx),
    betaEditTool(ctx),
    betaGlobTool(ctx),
    betaGrepTool(ctx)
  ];
}
function resolvePath(ctx, p) {
  return confineToRoot(ctx.workdir, p, { allowOutside: ctx.unrestrictedPaths ?? false });
}
function scrubbedShellEnv() {
  const env = {};
  for (const [key, value] of Object.entries(process.env)) {
    if (key.startsWith("ANTHROPIC_"))
      continue;
    env[key] = value;
  }
  return env;
}
class BashSession {
  constructor(dir, env = scrubbedShellEnv()) {
    _BashSession_instances.add(this);
    _BashSession_proc.set(this, void 0);
    _BashSession_buf.set(this, "");
    _BashSession_truncated.set(this, false);
    _BashSession_closed.set(this, false);
    _BashSession_waiting.set(this, null);
    __classPrivateFieldSet(this, _BashSession_proc, cp.spawn("/bin/bash", ["--noprofile", "--norc"], {
      cwd: dir,
      // `env` is the full base environment (the scrubbed process env by
      // default, or the verbatim replacement from `AgentToolContext.env`).
      // PS1/PS2/TERM are shell-control settings BashSession always applies so
      // the pipe-based sentinel exec parsing works — not part of the
      // user-facing environment.
      env: { ...env, PS1: "", PS2: "", TERM: "dumb" },
      stdio: ["pipe", "pipe", "pipe"],
      detached: true
    }));
    __classPrivateFieldGet(this, _BashSession_proc, "f").stdout.setEncoding("utf8");
    __classPrivateFieldGet(this, _BashSession_proc, "f").stderr.setEncoding("utf8");
    __classPrivateFieldGet(this, _BashSession_proc, "f").stdout.on("data", (d) => __classPrivateFieldGet(this, _BashSession_instances, "m", _BashSession_append).call(this, d));
    __classPrivateFieldGet(this, _BashSession_proc, "f").stderr.on("data", (d) => __classPrivateFieldGet(this, _BashSession_instances, "m", _BashSession_append).call(this, d));
    __classPrivateFieldGet(this, _BashSession_proc, "f").once("close", () => {
      __classPrivateFieldSet(this, _BashSession_closed, true);
      const w = __classPrivateFieldGet(this, _BashSession_waiting, "f");
      __classPrivateFieldSet(this, _BashSession_waiting, null);
      w?.resolve();
    });
  }
  /** Whether the underlying shell process has exited. */
  get closed() {
    return __classPrivateFieldGet(this, _BashSession_closed, "f");
  }
  async exec(command, opts = {}) {
    if (__classPrivateFieldGet(this, _BashSession_closed, "f")) {
      throw new AnthropicError("bash session terminated");
    }
    const timeoutMs = opts.timeoutMs ?? BASH_DEFAULT_TIMEOUT_MS;
    const signal = opts.signal;
    if (signal?.aborted) {
      throw new AnthropicError("bash command aborted");
    }
    __classPrivateFieldSet(this, _BashSession_buf, "");
    __classPrivateFieldSet(this, _BashSession_truncated, false);
    const sentinel = `__ANT_CMD_${crypto.randomUUID()}_DONE__`;
    const sentinelSplit = `${sentinel.slice(0, 8)}''${sentinel.slice(8)}`;
    const wrapped = `{ ${command}
} </dev/null 2>&1; printf '\\n${sentinelSplit}%d\\n' $?
`;
    __classPrivateFieldGet(this, _BashSession_proc, "f").stdin.write(wrapped);
    if (__classPrivateFieldGet(this, _BashSession_buf, "f").indexOf(sentinel) < 0) {
      const { promise: sentinelSeen, resolve } = promiseWithResolvers();
      __classPrivateFieldSet(this, _BashSession_waiting, { sentinel, resolve });
      let timer;
      let onAbort;
      try {
        await Promise.race([
          sentinelSeen,
          new Promise((_, reject) => {
            timer = setTimeout(() => reject(new AnthropicError(`bash command timed out after ${timeoutMs}ms`)), timeoutMs);
          }),
          new Promise((_, reject) => {
            if (!signal)
              return;
            onAbort = () => reject(new AnthropicError("bash command aborted"));
            signal.addEventListener("abort", onAbort, { once: true });
          })
        ]);
      } finally {
        if (timer)
          clearTimeout(timer);
        if (onAbort && signal)
          signal.removeEventListener("abort", onAbort);
        __classPrivateFieldSet(this, _BashSession_waiting, null);
      }
    }
    const idx = __classPrivateFieldGet(this, _BashSession_buf, "f").indexOf(sentinel);
    if (idx < 0) {
      throw new AnthropicError("bash session terminated");
    }
    const tail = __classPrivateFieldGet(this, _BashSession_buf, "f").slice(idx + sentinel.length);
    const m = tail.match(/^(-?\d+)/);
    const exitCode = m ? parseInt(m[1], 10) : -1;
    let out = __classPrivateFieldGet(this, _BashSession_buf, "f").slice(0, idx).replace(ANSI_RE, "").replace(/\n+$/, "");
    if (__classPrivateFieldGet(this, _BashSession_truncated, "f")) {
      out = `[output truncated]
${out}`;
    }
    return { output: out, exitCode };
  }
  close() {
    if (__classPrivateFieldGet(this, _BashSession_closed, "f"))
      return;
    __classPrivateFieldSet(this, _BashSession_closed, true);
    const w = __classPrivateFieldGet(this, _BashSession_waiting, "f");
    __classPrivateFieldSet(this, _BashSession_waiting, null);
    w?.resolve();
    __classPrivateFieldGet(this, _BashSession_proc, "f").stdout.destroy();
    __classPrivateFieldGet(this, _BashSession_proc, "f").stderr.destroy();
    __classPrivateFieldGet(this, _BashSession_proc, "f").stdin.destroy();
    try {
      process.kill(-__classPrivateFieldGet(this, _BashSession_proc, "f").pid, "SIGKILL");
    } catch {
      __classPrivateFieldGet(this, _BashSession_proc, "f").kill("SIGKILL");
    }
    __classPrivateFieldGet(this, _BashSession_proc, "f").unref();
  }
}
_BashSession_proc = /* @__PURE__ */ new WeakMap(), _BashSession_buf = /* @__PURE__ */ new WeakMap(), _BashSession_truncated = /* @__PURE__ */ new WeakMap(), _BashSession_closed = /* @__PURE__ */ new WeakMap(), _BashSession_waiting = /* @__PURE__ */ new WeakMap(), _BashSession_instances = /* @__PURE__ */ new WeakSet(), _BashSession_append = function _BashSession_append2(d) {
  __classPrivateFieldSet(this, _BashSession_buf, __classPrivateFieldGet(this, _BashSession_buf, "f") + d);
  if (__classPrivateFieldGet(this, _BashSession_buf, "f").length > BASH_OUTPUT_LIMIT) {
    __classPrivateFieldSet(this, _BashSession_buf, __classPrivateFieldGet(this, _BashSession_buf, "f").slice(__classPrivateFieldGet(this, _BashSession_buf, "f").length - BASH_OUTPUT_LIMIT));
    __classPrivateFieldSet(this, _BashSession_truncated, true);
  }
  if (__classPrivateFieldGet(this, _BashSession_waiting, "f") && __classPrivateFieldGet(this, _BashSession_buf, "f").indexOf(__classPrivateFieldGet(this, _BashSession_waiting, "f").sentinel) >= 0) {
    const w = __classPrivateFieldGet(this, _BashSession_waiting, "f");
    __classPrivateFieldSet(this, _BashSession_waiting, null);
    w.resolve();
  }
};
function betaBashTool(ctx) {
  let session;
  let tail = Promise.resolve();
  return betaTool({
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
    run: async ({ command, restart, timeout_ms }, context) => {
      const prev = tail;
      const gate = promiseWithResolvers();
      tail = gate.promise;
      try {
        await prev;
      } catch {
      }
      try {
        if (restart) {
          session?.close();
          session = void 0;
        }
        if (!command) {
          if (restart)
            return "bash session restarted";
          throw new ToolError("bash: command is required");
        }
        session ?? (session = new BashSession(ctx.workdir, ctx.env));
        try {
          const { output, exitCode } = await session.exec(command, {
            timeoutMs: timeout_ms ?? BASH_DEFAULT_TIMEOUT_MS,
            signal: context?.signal
          });
          if (exitCode !== 0)
            throw new ToolError(output || `exit ${exitCode}`);
          return output;
        } catch (e) {
          if (e instanceof ToolError)
            throw e;
          session.close();
          session = void 0;
          throw new ToolError(`bash: ${e instanceof Error ? e.message : String(e)}`);
        }
      } finally {
        gate.resolve();
      }
    },
    close: () => {
      session?.close();
      session = void 0;
    }
  });
}
function betaReadTool(ctx) {
  return betaTool({
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
    run: async ({ file_path, view_range }) => {
      if (!file_path)
        throw new ToolError("read: file_path is required");
      const abs = await resolvePath(ctx, file_path);
      let data;
      try {
        const st = await fs.stat(abs);
        if (!st.isFile()) {
          throw new ToolError(`read: ${file_path} is not a regular file`);
        }
        const limit = resolveMaxBytes(ctx.maxFileBytes);
        if (limit !== null && st.size > limit) {
          throw new ToolError(`read: ${file_path} is ${st.size} bytes, exceeds ${limit}-byte limit. Use bash (head/tail/sed) to read a slice.`);
        }
        data = await fs.readFile(abs, "utf8");
      } catch (e) {
        if (e instanceof ToolError)
          throw e;
        throw new ToolError(`read: ${fsErrorMessage(e, file_path)}`);
      }
      if (!view_range)
        return data;
      if (view_range.length !== 2)
        throw new ToolError("read: view_range must be [start_line, end_line]");
      const [startLine, endLine] = view_range;
      const lines = data.split("\n");
      const start = Math.max(0, startLine - 1);
      const end = endLine > 0 ? endLine : lines.length;
      return lines.slice(start, end).join("\n");
    }
  });
}
function betaWriteTool(ctx) {
  return betaTool({
    name: "write",
    description: "Write a UTF-8 text file relative to the workdir, creating parent directories as needed.",
    inputSchema: {
      type: "object",
      properties: { file_path: { type: "string" }, content: { type: "string" } },
      required: ["file_path", "content"]
    },
    run: async ({ file_path, content }) => {
      if (!file_path)
        throw new ToolError("write: file_path is required");
      const abs = await resolvePath(ctx, file_path);
      try {
        await fs.mkdir(path.dirname(abs), { recursive: true, mode: DIR_CREATE_MODE });
        await atomicWriteFile(abs, content ?? "");
      } catch (e) {
        throw new ToolError(`write: ${fsErrorMessage(e, file_path)}`);
      }
      return `wrote ${Buffer.byteLength(content ?? "")} bytes to ${file_path}`;
    }
  });
}
function betaEditTool(ctx) {
  return betaTool({
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
    run: async ({ file_path, old_string, new_string, replace_all }) => {
      if (!file_path)
        throw new ToolError("edit: file_path is required");
      if (!old_string)
        throw new ToolError("edit: old_string is required");
      const abs = await resolvePath(ctx, file_path);
      let data;
      try {
        const st = await fs.stat(abs);
        if (!st.isFile()) {
          throw new ToolError(`edit: ${file_path} is not a regular file`);
        }
        const limit = resolveMaxBytes(ctx.maxFileBytes);
        if (limit !== null && st.size > limit) {
          throw new ToolError(`edit: ${file_path} is ${st.size} bytes, exceeds ${limit}-byte limit. Use bash (sed/awk) to edit a large file.`);
        }
        data = await fs.readFile(abs, "utf8");
      } catch (e) {
        if (e instanceof ToolError)
          throw e;
        throw new ToolError(`edit: ${fsErrorMessage(e, file_path)}`);
      }
      const count = data.split(old_string).length - 1;
      if (count === 0)
        throw new ToolError(`edit: old_string not found in ${file_path}`);
      let updated;
      if (replace_all) {
        updated = data.split(old_string).join(new_string);
      } else {
        if (count > 1)
          throw new ToolError(`edit: old_string appears ${count} times in ${file_path} (must be unique)`);
        updated = data.replace(old_string, () => new_string);
      }
      try {
        await atomicWriteFile(abs, updated);
      } catch (e) {
        throw new ToolError(`edit: write: ${fsErrorMessage(e, file_path)}`);
      }
      return `edited ${file_path} (${replace_all ? count : 1} replacement(s))`;
    }
  });
}
function betaGlobTool(ctx) {
  return betaTool({
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
    run: async ({ pattern, path: searchPath }) => {
      if (!pattern)
        throw new ToolError("glob: pattern is required");
      let root = path.resolve(ctx.workdir);
      let pat = pattern;
      if (path.isAbsolute(pattern)) {
        if (!ctx.unrestrictedPaths)
          throw new ToolError("glob: absolute pattern not permitted");
        root = path.parse(pattern).root;
        pat = path.relative(root, pattern);
      } else if (searchPath) {
        root = await resolvePath(ctx, searchPath);
      }
      if (!ctx.unrestrictedPaths && pat.split(/[\\/]/).includes("..")) {
        throw new ToolError('glob: ".." is not permitted in the pattern');
      }
      const matches = [];
      try {
        for await (const entry of fsGlob(pat, {
          cwd: root,
          withFileTypes: true,
          exclude: (d) => d.name === ".git" || d.name === "node_modules"
        })) {
          if (!entry.isFile())
            continue;
          const full = path.join(entry.parentPath, entry.name);
          if (!ctx.unrestrictedPaths && !isWithin(root, full))
            continue;
          let mtime = 0;
          try {
            mtime = (await fs.stat(full)).mtimeMs;
          } catch {
          }
          matches.push({ path: full, mtime });
        }
      } catch (e) {
        throw new ToolError(`glob: ${e instanceof Error ? e.message : String(e)}`);
      }
      if (matches.length === 0)
        return "no matches";
      matches.sort((a, b) => b.mtime - a.mtime);
      return matches.slice(0, GLOB_RESULT_LIMIT).map((m) => m.path).join("\n");
    }
  });
}
function betaGrepTool(ctx) {
  return betaTool({
    name: "grep",
    description: "Search file contents for a regex. Uses ripgrep if available, otherwise a built-in walker.",
    inputSchema: {
      type: "object",
      properties: { pattern: { type: "string" }, path: { type: "string" } },
      required: ["pattern"]
    },
    run: async ({ pattern, path: p }, context) => {
      if (!pattern)
        throw new ToolError("grep: pattern is required");
      let searchPath = path.resolve(ctx.workdir);
      if (p)
        searchPath = await resolvePath(ctx, p);
      const rg = await findRg();
      return rg ? runRipgrep(rg, pattern, searchPath, context?.signal) : runWalkGrep(pattern, searchPath, context?.signal);
    }
  });
}
function runRipgrep(rg, pattern, searchPath, signal) {
  return new Promise((resolve, reject) => {
    const proc = cp.spawn(rg, ["-n", "--no-heading", "-e", pattern, "--", searchPath], {
      ...signal ? { signal } : {}
    });
    let out = "";
    let errOut = "";
    let truncated = false;
    proc.stdout.on("data", (d) => {
      if (truncated)
        return;
      out += d;
      if (out.length > GREP_OUTPUT_LIMIT) {
        truncated = true;
        out = out.slice(0, GREP_OUTPUT_LIMIT);
        proc.kill("SIGKILL");
      }
    });
    proc.stderr.on("data", (d) => errOut += d);
    proc.on("close", (code) => {
      if (signal?.aborted)
        return reject(new ToolError("grep: aborted"));
      if (truncated)
        return resolve(out + `
[output truncated at ${GREP_OUTPUT_LIMIT} bytes]`);
      if (code === 0)
        return resolve(out);
      if (code === 1)
        return resolve("no matches");
      reject(new ToolError(`grep: rg failed: ${errOut || `exit ${code}`}`));
    });
    proc.on("error", (e) => {
      if (signal?.aborted)
        return reject(new ToolError("grep: aborted"));
      reject(new ToolError(`grep: rg failed: ${e.message}`));
    });
  });
}
async function runWalkGrep(pattern, root, signal) {
  let re;
  try {
    re = new RegExp(pattern);
  } catch (e) {
    throw new ToolError(`grep: invalid regex: ${e instanceof Error ? e.message : String(e)}`);
  }
  const hits = [];
  let budget = GREP_OUTPUT_LIMIT;
  const push = (line) => {
    budget -= line.length + 1;
    if (budget < 0) {
      hits.push(`[output truncated at ${GREP_OUTPUT_LIMIT} bytes]`);
      return false;
    }
    hits.push(line);
    return true;
  };
  const stat = await fs.stat(root).catch(() => null);
  if (stat?.isFile()) {
    await grepFile(root, re, push);
  } else {
    await walk(root, "", (rel) => grepFile(path.join(root, rel), re, push), signal);
  }
  if (signal?.aborted)
    throw new ToolError("grep: aborted");
  if (hits.length === 0)
    return "no matches";
  return hits.join("\n");
}
async function grepFile(file, re, push) {
  const stream = nodeFs.createReadStream(file, { encoding: "utf8" });
  const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });
  let i = 0;
  try {
    for await (const line of rl) {
      i++;
      if (line.length > GREP_MAX_LINE_LENGTH)
        continue;
      if (re.test(line) && !push(`${file}:${i}:${line}`))
        return false;
    }
  } catch {
  } finally {
    stream.destroy();
  }
  return true;
}
function isWithin(root, p) {
  const rel = path.relative(root, p);
  return rel === "" || !rel.startsWith(".." + path.sep) && rel !== ".." && !path.isAbsolute(rel);
}
const WALK_MAX_DEPTH = 40;
const WALK_MAX_ENTRIES = 5e4;
async function walk(root, rel, fn, signal) {
  let remaining = WALK_MAX_ENTRIES;
  async function inner(rel2, depth) {
    if (depth > WALK_MAX_DEPTH)
      return true;
    if (signal?.aborted)
      return false;
    let entries;
    try {
      entries = await fs.readdir(path.join(root, rel2), { withFileTypes: true });
    } catch {
      return true;
    }
    for (const e of entries) {
      if (e.name === ".git" || e.name === "node_modules")
        continue;
      if (remaining-- <= 0)
        return false;
      if (signal?.aborted)
        return false;
      const childRel = rel2 ? path.join(rel2, e.name) : e.name;
      if (e.isDirectory()) {
        if (!await inner(childRel, depth + 1))
          return false;
      } else if (e.isFile()) {
        if (await fn(childRel) === false)
          return false;
      }
    }
    return true;
  }
  await inner(rel, 0);
}
async function findRg() {
  const dirs = (process.env["PATH"] ?? "").split(path.delimiter);
  for (const d of dirs) {
    const candidate = path.join(d, "rg");
    try {
      await fs.access(candidate, nodeFs.constants.X_OK);
      return candidate;
    } catch {
    }
  }
  return null;
}
export {
  BashSession,
  betaAgentToolset20260401,
  betaBashTool,
  betaEditTool,
  betaGlobTool,
  betaGrepTool,
  betaReadTool,
  betaWriteTool,
  extractSkillArchive,
  resolvePath,
  resolveSkillVersion,
  setupSkills
};
