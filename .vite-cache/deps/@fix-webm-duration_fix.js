import {
  __commonJS,
  __esm,
  __export,
  __toCommonJS
} from "./chunk-QLCLYZTY.js";

// node_modules/tslib/tslib.es6.mjs
var tslib_es6_exports = {};
__export(tslib_es6_exports, {
  __addDisposableResource: () => __addDisposableResource,
  __assign: () => __assign,
  __asyncDelegator: () => __asyncDelegator,
  __asyncGenerator: () => __asyncGenerator,
  __asyncValues: () => __asyncValues,
  __await: () => __await,
  __awaiter: () => __awaiter,
  __classPrivateFieldGet: () => __classPrivateFieldGet,
  __classPrivateFieldIn: () => __classPrivateFieldIn,
  __classPrivateFieldSet: () => __classPrivateFieldSet,
  __createBinding: () => __createBinding,
  __decorate: () => __decorate,
  __disposeResources: () => __disposeResources,
  __esDecorate: () => __esDecorate,
  __exportStar: () => __exportStar,
  __extends: () => __extends,
  __generator: () => __generator,
  __importDefault: () => __importDefault,
  __importStar: () => __importStar,
  __makeTemplateObject: () => __makeTemplateObject,
  __metadata: () => __metadata,
  __param: () => __param,
  __propKey: () => __propKey,
  __read: () => __read,
  __rest: () => __rest,
  __rewriteRelativeImportExtension: () => __rewriteRelativeImportExtension,
  __runInitializers: () => __runInitializers,
  __setFunctionName: () => __setFunctionName,
  __spread: () => __spread,
  __spreadArray: () => __spreadArray,
  __spreadArrays: () => __spreadArrays,
  __values: () => __values,
  default: () => tslib_es6_default
});
function __extends(d, b) {
  if (typeof b !== "function" && b !== null)
    throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
  extendStatics(d, b);
  function __() {
    this.constructor = d;
  }
  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}
function __rest(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
    t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function")
    for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
      if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
        t[p[i]] = s[p[i]];
    }
  return t;
}
function __decorate(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function __param(paramIndex, decorator) {
  return function(target, key) {
    decorator(target, key, paramIndex);
  };
}
function __esDecorate(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
  function accept(f) {
    if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected");
    return f;
  }
  var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
  var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
  var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
  var _, done = false;
  for (var i = decorators.length - 1; i >= 0; i--) {
    var context = {};
    for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
    for (var p in contextIn.access) context.access[p] = contextIn.access[p];
    context.addInitializer = function(f) {
      if (done) throw new TypeError("Cannot add initializers after decoration has completed");
      extraInitializers.push(accept(f || null));
    };
    var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
    if (kind === "accessor") {
      if (result === void 0) continue;
      if (result === null || typeof result !== "object") throw new TypeError("Object expected");
      if (_ = accept(result.get)) descriptor.get = _;
      if (_ = accept(result.set)) descriptor.set = _;
      if (_ = accept(result.init)) initializers.unshift(_);
    } else if (_ = accept(result)) {
      if (kind === "field") initializers.unshift(_);
      else descriptor[key] = _;
    }
  }
  if (target) Object.defineProperty(target, contextIn.name, descriptor);
  done = true;
}
function __runInitializers(thisArg, initializers, value) {
  var useValue = arguments.length > 2;
  for (var i = 0; i < initializers.length; i++) {
    value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
  }
  return useValue ? value : void 0;
}
function __propKey(x) {
  return typeof x === "symbol" ? x : "".concat(x);
}
function __setFunctionName(f, name, prefix) {
  if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
  return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
}
function __metadata(metadataKey, metadataValue) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}
function __awaiter(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
}
function __generator(thisArg, body) {
  var _ = { label: 0, sent: function() {
    if (t[0] & 1) throw t[1];
    return t[1];
  }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
  return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() {
    return this;
  }), g;
  function verb(n) {
    return function(v) {
      return step([n, v]);
    };
  }
  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");
    while (g && (g = 0, op[0] && (_ = 0)), _) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];
      switch (op[0]) {
        case 0:
        case 1:
          t = op;
          break;
        case 4:
          _.label++;
          return { value: op[1], done: false };
        case 5:
          _.label++;
          y = op[1];
          op = [0];
          continue;
        case 7:
          op = _.ops.pop();
          _.trys.pop();
          continue;
        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
            _ = 0;
            continue;
          }
          if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
            _.label = op[1];
            break;
          }
          if (op[0] === 6 && _.label < t[1]) {
            _.label = t[1];
            t = op;
            break;
          }
          if (t && _.label < t[2]) {
            _.label = t[2];
            _.ops.push(op);
            break;
          }
          if (t[2]) _.ops.pop();
          _.trys.pop();
          continue;
      }
      op = body.call(thisArg, _);
    } catch (e) {
      op = [6, e];
      y = 0;
    } finally {
      f = t = 0;
    }
    if (op[0] & 5) throw op[1];
    return { value: op[0] ? op[1] : void 0, done: true };
  }
}
function __exportStar(m, o) {
  for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p)) __createBinding(o, m, p);
}
function __values(o) {
  var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
  if (m) return m.call(o);
  if (o && typeof o.length === "number") return {
    next: function() {
      if (o && i >= o.length) o = void 0;
      return { value: o && o[i++], done: !o };
    }
  };
  throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}
function __read(o, n) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m) return o;
  var i = m.call(o), r, ar = [], e;
  try {
    while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
  } catch (error) {
    e = { error };
  } finally {
    try {
      if (r && !r.done && (m = i["return"])) m.call(i);
    } finally {
      if (e) throw e.error;
    }
  }
  return ar;
}
function __spread() {
  for (var ar = [], i = 0; i < arguments.length; i++)
    ar = ar.concat(__read(arguments[i]));
  return ar;
}
function __spreadArrays() {
  for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
  for (var r = Array(s), k = 0, i = 0; i < il; i++)
    for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
      r[k] = a[j];
  return r;
}
function __spreadArray(to, from, pack) {
  if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
    if (ar || !(i in from)) {
      if (!ar) ar = Array.prototype.slice.call(from, 0, i);
      ar[i] = from[i];
    }
  }
  return to.concat(ar || Array.prototype.slice.call(from));
}
function __await(v) {
  return this instanceof __await ? (this.v = v, this) : new __await(v);
}
function __asyncGenerator(thisArg, _arguments, generator) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var g = generator.apply(thisArg, _arguments || []), i, q = [];
  return i = Object.create((typeof AsyncIterator === "function" ? AsyncIterator : Object).prototype), verb("next"), verb("throw"), verb("return", awaitReturn), i[Symbol.asyncIterator] = function() {
    return this;
  }, i;
  function awaitReturn(f) {
    return function(v) {
      return Promise.resolve(v).then(f, reject);
    };
  }
  function verb(n, f) {
    if (g[n]) {
      i[n] = function(v) {
        return new Promise(function(a, b) {
          q.push([n, v, a, b]) > 1 || resume(n, v);
        });
      };
      if (f) i[n] = f(i[n]);
    }
  }
  function resume(n, v) {
    try {
      step(g[n](v));
    } catch (e) {
      settle(q[0][3], e);
    }
  }
  function step(r) {
    r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);
  }
  function fulfill(value) {
    resume("next", value);
  }
  function reject(value) {
    resume("throw", value);
  }
  function settle(f, v) {
    if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]);
  }
}
function __asyncDelegator(o) {
  var i, p;
  return i = {}, verb("next"), verb("throw", function(e) {
    throw e;
  }), verb("return"), i[Symbol.iterator] = function() {
    return this;
  }, i;
  function verb(n, f) {
    i[n] = o[n] ? function(v) {
      return (p = !p) ? { value: __await(o[n](v)), done: false } : f ? f(v) : v;
    } : f;
  }
}
function __asyncValues(o) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var m = o[Symbol.asyncIterator], i;
  return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
    return this;
  }, i);
  function verb(n) {
    i[n] = o[n] && function(v) {
      return new Promise(function(resolve, reject) {
        v = o[n](v), settle(resolve, reject, v.done, v.value);
      });
    };
  }
  function settle(resolve, reject, d, v) {
    Promise.resolve(v).then(function(v2) {
      resolve({ value: v2, done: d });
    }, reject);
  }
}
function __makeTemplateObject(cooked, raw) {
  if (Object.defineProperty) {
    Object.defineProperty(cooked, "raw", { value: raw });
  } else {
    cooked.raw = raw;
  }
  return cooked;
}
function __importStar(mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) {
    for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
  }
  __setModuleDefault(result, mod);
  return result;
}
function __importDefault(mod) {
  return mod && mod.__esModule ? mod : { default: mod };
}
function __classPrivateFieldGet(receiver, state, kind, f) {
  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}
function __classPrivateFieldSet(receiver, state, value, kind, f) {
  if (kind === "m") throw new TypeError("Private method is not writable");
  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
}
function __classPrivateFieldIn(state, receiver) {
  if (receiver === null || typeof receiver !== "object" && typeof receiver !== "function") throw new TypeError("Cannot use 'in' operator on non-object");
  return typeof state === "function" ? receiver === state : state.has(receiver);
}
function __addDisposableResource(env, value, async) {
  if (value !== null && value !== void 0) {
    if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
    var dispose, inner;
    if (async) {
      if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
      dispose = value[Symbol.asyncDispose];
    }
    if (dispose === void 0) {
      if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
      dispose = value[Symbol.dispose];
      if (async) inner = dispose;
    }
    if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
    if (inner) dispose = function() {
      try {
        inner.call(this);
      } catch (e) {
        return Promise.reject(e);
      }
    };
    env.stack.push({ value, dispose, async });
  } else if (async) {
    env.stack.push({ async: true });
  }
  return value;
}
function __disposeResources(env) {
  function fail(e) {
    env.error = env.hasError ? new _SuppressedError(e, env.error, "An error was suppressed during disposal.") : e;
    env.hasError = true;
  }
  var r, s = 0;
  function next() {
    while (r = env.stack.pop()) {
      try {
        if (!r.async && s === 1) return s = 0, env.stack.push(r), Promise.resolve().then(next);
        if (r.dispose) {
          var result = r.dispose.call(r.value);
          if (r.async) return s |= 2, Promise.resolve(result).then(next, function(e) {
            fail(e);
            return next();
          });
        } else s |= 1;
      } catch (e) {
        fail(e);
      }
    }
    if (s === 1) return env.hasError ? Promise.reject(env.error) : Promise.resolve();
    if (env.hasError) throw env.error;
  }
  return next();
}
function __rewriteRelativeImportExtension(path, preserveJsx) {
  if (typeof path === "string" && /^\.\.?\//.test(path)) {
    return path.replace(/\.(tsx)$|((?:\.d)?)((?:\.[^./]+?)?)\.([cm]?)ts$/i, function(m, tsx, d, ext, cm) {
      return tsx ? preserveJsx ? ".jsx" : ".js" : d && (!ext || !cm) ? m : d + ext + "." + cm.toLowerCase() + "js";
    });
  }
  return path;
}
var extendStatics, __assign, __createBinding, __setModuleDefault, ownKeys, _SuppressedError, tslib_es6_default;
var init_tslib_es6 = __esm({
  "node_modules/tslib/tslib.es6.mjs"() {
    extendStatics = function(d, b) {
      extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
        d2.__proto__ = b2;
      } || function(d2, b2) {
        for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
      };
      return extendStatics(d, b);
    };
    __assign = function() {
      __assign = Object.assign || function __assign2(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
      return __assign.apply(this, arguments);
    };
    __createBinding = Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    });
    __setModuleDefault = Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    };
    ownKeys = function(o) {
      ownKeys = Object.getOwnPropertyNames || function(o2) {
        var ar = [];
        for (var k in o2) if (Object.prototype.hasOwnProperty.call(o2, k)) ar[ar.length] = k;
        return ar;
      };
      return ownKeys(o);
    };
    _SuppressedError = typeof SuppressedError === "function" ? SuppressedError : function(error, suppressed, message) {
      var e = new Error(message);
      return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
    };
    tslib_es6_default = {
      __extends,
      __assign,
      __rest,
      __decorate,
      __param,
      __esDecorate,
      __runInitializers,
      __propKey,
      __setFunctionName,
      __metadata,
      __awaiter,
      __generator,
      __createBinding,
      __exportStar,
      __values,
      __read,
      __spread,
      __spreadArrays,
      __spreadArray,
      __await,
      __asyncGenerator,
      __asyncDelegator,
      __asyncValues,
      __makeTemplateObject,
      __importStar,
      __importDefault,
      __classPrivateFieldGet,
      __classPrivateFieldSet,
      __classPrivateFieldIn,
      __addDisposableResource,
      __disposeResources,
      __rewriteRelativeImportExtension
    };
  }
});

// node_modules/@fix-webm-duration/parser/src/lib/WebmBase.js
var require_WebmBase = __commonJS({
  "node_modules/@fix-webm-duration/parser/src/lib/WebmBase.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.WebmBase = void 0;
    var WebmBase = class {
      constructor(name = "Unknown", start = 0) {
        this.name = name;
        this.start = start;
      }
      getType() {
        return "Unknown";
      }
      updateBySource() {
      }
      setSource(source) {
        this.source = source;
        this.updateBySource();
      }
      updateByData() {
      }
      setData(data) {
        this.data = data;
        this.updateByData();
      }
      getValue() {
        return this.data;
      }
      setValue(value) {
        this.setData(value);
      }
    };
    exports.WebmBase = WebmBase;
  }
});

// node_modules/@fix-webm-duration/parser/src/lib/SectionType.js
var require_SectionType = __commonJS({
  "node_modules/@fix-webm-duration/parser/src/lib/SectionType.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SectionType = void 0;
    var SectionType;
    (function(SectionType2) {
      SectionType2["Container"] = "Container";
      SectionType2["Uint"] = "Uint";
      SectionType2["Int"] = "Int";
      SectionType2["Float"] = "Float";
      SectionType2["String"] = "String";
      SectionType2["Date"] = "Date";
      SectionType2["Binary"] = "Binary";
    })(SectionType || (exports.SectionType = SectionType = {}));
  }
});

// node_modules/@fix-webm-duration/parser/src/lib/sections.js
var require_sections = __commonJS({
  "node_modules/@fix-webm-duration/parser/src/lib/sections.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.sections = void 0;
    var SectionType_1 = require_SectionType();
    exports.sections = {
      172351395: { name: "EBML", type: SectionType_1.SectionType.Container },
      646: { name: "EBMLVersion", type: SectionType_1.SectionType.Uint },
      759: { name: "EBMLReadVersion", type: SectionType_1.SectionType.Uint },
      754: { name: "EBMLMaxIDLength", type: SectionType_1.SectionType.Uint },
      755: { name: "EBMLMaxSizeLength", type: SectionType_1.SectionType.Uint },
      642: { name: "DocType", type: SectionType_1.SectionType.String },
      647: { name: "DocTypeVersion", type: SectionType_1.SectionType.Uint },
      645: { name: "DocTypeReadVersion", type: SectionType_1.SectionType.Uint },
      108: { name: "Void", type: SectionType_1.SectionType.Binary },
      63: { name: "CRC-32", type: SectionType_1.SectionType.Binary },
      190023271: { name: "SignatureSlot", type: SectionType_1.SectionType.Container },
      16010: { name: "SignatureAlgo", type: SectionType_1.SectionType.Uint },
      16026: { name: "SignatureHash", type: SectionType_1.SectionType.Uint },
      16037: { name: "SignaturePublicKey", type: SectionType_1.SectionType.Binary },
      16053: { name: "Signature", type: SectionType_1.SectionType.Binary },
      15963: { name: "SignatureElements", type: SectionType_1.SectionType.Container },
      15995: { name: "SignatureElementList", type: SectionType_1.SectionType.Container },
      9522: { name: "SignedElement", type: SectionType_1.SectionType.Binary },
      139690087: { name: "Segment", type: SectionType_1.SectionType.Container },
      21863284: { name: "SeekHead", type: SectionType_1.SectionType.Container },
      3515: { name: "Seek", type: SectionType_1.SectionType.Container },
      5035: { name: "SeekID", type: SectionType_1.SectionType.Binary },
      5036: { name: "SeekPosition", type: SectionType_1.SectionType.Uint },
      88713574: { name: "Info", type: SectionType_1.SectionType.Container },
      13220: { name: "SegmentUID", type: SectionType_1.SectionType.Binary },
      13188: { name: "SegmentFilename", type: SectionType_1.SectionType.String },
      1882403: { name: "PrevUID", type: SectionType_1.SectionType.Binary },
      1868715: { name: "PrevFilename", type: SectionType_1.SectionType.String },
      2013475: { name: "NextUID", type: SectionType_1.SectionType.Binary },
      1999803: { name: "NextFilename", type: SectionType_1.SectionType.String },
      1092: { name: "SegmentFamily", type: SectionType_1.SectionType.Binary },
      10532: { name: "ChapterTranslate", type: SectionType_1.SectionType.Container },
      10748: { name: "ChapterTranslateEditionUID", type: SectionType_1.SectionType.Uint },
      10687: { name: "ChapterTranslateCodec", type: SectionType_1.SectionType.Uint },
      10661: { name: "ChapterTranslateID", type: SectionType_1.SectionType.Binary },
      710577: { name: "TimecodeScale", type: SectionType_1.SectionType.Uint },
      1161: { name: "Duration", type: SectionType_1.SectionType.Float },
      1121: { name: "DateUTC", type: SectionType_1.SectionType.Date },
      15273: { name: "Title", type: SectionType_1.SectionType.String },
      3456: { name: "MuxingApp", type: SectionType_1.SectionType.String },
      5953: { name: "WritingApp", type: SectionType_1.SectionType.String },
      // Intentionally don't recognize the Cluster section because it's large
      // 0xf43b675: { name: "Cluster", type: SectionType.Container },
      103: { name: "Timecode", type: SectionType_1.SectionType.Uint },
      6228: { name: "SilentTracks", type: SectionType_1.SectionType.Container },
      6359: { name: "SilentTrackNumber", type: SectionType_1.SectionType.Uint },
      39: { name: "Position", type: SectionType_1.SectionType.Uint },
      43: { name: "PrevSize", type: SectionType_1.SectionType.Uint },
      35: { name: "SimpleBlock", type: SectionType_1.SectionType.Binary },
      32: { name: "BlockGroup", type: SectionType_1.SectionType.Container },
      33: { name: "Block", type: SectionType_1.SectionType.Binary },
      34: { name: "BlockVirtual", type: SectionType_1.SectionType.Binary },
      13729: { name: "BlockAdditions", type: SectionType_1.SectionType.Container },
      38: { name: "BlockMore", type: SectionType_1.SectionType.Container },
      110: { name: "BlockAddID", type: SectionType_1.SectionType.Uint },
      37: { name: "BlockAdditional", type: SectionType_1.SectionType.Binary },
      27: { name: "BlockDuration", type: SectionType_1.SectionType.Uint },
      122: { name: "ReferencePriority", type: SectionType_1.SectionType.Uint },
      123: { name: "ReferenceBlock", type: SectionType_1.SectionType.Int },
      125: { name: "ReferenceVirtual", type: SectionType_1.SectionType.Int },
      36: { name: "CodecState", type: SectionType_1.SectionType.Binary },
      13730: { name: "DiscardPadding", type: SectionType_1.SectionType.Int },
      14: { name: "Slices", type: SectionType_1.SectionType.Container },
      104: { name: "TimeSlice", type: SectionType_1.SectionType.Container },
      76: { name: "LaceNumber", type: SectionType_1.SectionType.Uint },
      77: { name: "FrameNumber", type: SectionType_1.SectionType.Uint },
      75: { name: "BlockAdditionID", type: SectionType_1.SectionType.Uint },
      78: { name: "Delay", type: SectionType_1.SectionType.Uint },
      79: { name: "SliceDuration", type: SectionType_1.SectionType.Uint },
      72: { name: "ReferenceFrame", type: SectionType_1.SectionType.Container },
      73: { name: "ReferenceOffset", type: SectionType_1.SectionType.Uint },
      74: { name: "ReferenceTimeCode", type: SectionType_1.SectionType.Uint },
      47: { name: "EncryptedBlock", type: SectionType_1.SectionType.Binary },
      106212971: { name: "Tracks", type: SectionType_1.SectionType.Container },
      46: { name: "TrackEntry", type: SectionType_1.SectionType.Container },
      87: { name: "TrackNumber", type: SectionType_1.SectionType.Uint },
      13253: { name: "TrackUID", type: SectionType_1.SectionType.Uint },
      3: { name: "TrackType", type: SectionType_1.SectionType.Uint },
      57: { name: "FlagEnabled", type: SectionType_1.SectionType.Uint },
      8: { name: "FlagDefault", type: SectionType_1.SectionType.Uint },
      5546: { name: "FlagForced", type: SectionType_1.SectionType.Uint },
      28: { name: "FlagLacing", type: SectionType_1.SectionType.Uint },
      11751: { name: "MinCache", type: SectionType_1.SectionType.Uint },
      11768: { name: "MaxCache", type: SectionType_1.SectionType.Uint },
      254851: { name: "DefaultDuration", type: SectionType_1.SectionType.Uint },
      216698: { name: "DefaultDecodedFieldDuration", type: SectionType_1.SectionType.Uint },
      209231: { name: "TrackTimecodeScale", type: SectionType_1.SectionType.Float },
      4991: { name: "TrackOffset", type: SectionType_1.SectionType.Int },
      5614: { name: "MaxBlockAdditionID", type: SectionType_1.SectionType.Uint },
      4974: { name: "Name", type: SectionType_1.SectionType.String },
      177564: { name: "Language", type: SectionType_1.SectionType.String },
      6: { name: "CodecID", type: SectionType_1.SectionType.String },
      9122: { name: "CodecPrivate", type: SectionType_1.SectionType.Binary },
      362120: { name: "CodecName", type: SectionType_1.SectionType.String },
      13382: { name: "AttachmentLink", type: SectionType_1.SectionType.Uint },
      1742487: { name: "CodecSettings", type: SectionType_1.SectionType.String },
      1785920: { name: "CodecInfoURL", type: SectionType_1.SectionType.String },
      438848: { name: "CodecDownloadURL", type: SectionType_1.SectionType.String },
      42: { name: "CodecDecodeAll", type: SectionType_1.SectionType.Uint },
      12203: { name: "TrackOverlay", type: SectionType_1.SectionType.Uint },
      5802: { name: "CodecDelay", type: SectionType_1.SectionType.Uint },
      5819: { name: "SeekPreRoll", type: SectionType_1.SectionType.Uint },
      9764: { name: "TrackTranslate", type: SectionType_1.SectionType.Container },
      9980: { name: "TrackTranslateEditionUID", type: SectionType_1.SectionType.Uint },
      9919: { name: "TrackTranslateCodec", type: SectionType_1.SectionType.Uint },
      9893: { name: "TrackTranslateTrackID", type: SectionType_1.SectionType.Binary },
      96: { name: "Video", type: SectionType_1.SectionType.Container },
      26: { name: "FlagInterlaced", type: SectionType_1.SectionType.Uint },
      5048: { name: "StereoMode", type: SectionType_1.SectionType.Uint },
      5056: { name: "AlphaMode", type: SectionType_1.SectionType.Uint },
      5049: { name: "OldStereoMode", type: SectionType_1.SectionType.Uint },
      48: { name: "PixelWidth", type: SectionType_1.SectionType.Uint },
      58: { name: "PixelHeight", type: SectionType_1.SectionType.Uint },
      5290: { name: "PixelCropBottom", type: SectionType_1.SectionType.Uint },
      5307: { name: "PixelCropTop", type: SectionType_1.SectionType.Uint },
      5324: { name: "PixelCropLeft", type: SectionType_1.SectionType.Uint },
      5341: { name: "PixelCropRight", type: SectionType_1.SectionType.Uint },
      5296: { name: "DisplayWidth", type: SectionType_1.SectionType.Uint },
      5306: { name: "DisplayHeight", type: SectionType_1.SectionType.Uint },
      5298: { name: "DisplayUnit", type: SectionType_1.SectionType.Uint },
      5299: { name: "AspectRatioType", type: SectionType_1.SectionType.Uint },
      963876: { name: "ColourSpace", type: SectionType_1.SectionType.Binary },
      1029411: { name: "GammaValue", type: SectionType_1.SectionType.Float },
      230371: { name: "FrameRate", type: SectionType_1.SectionType.Float },
      97: { name: "Audio", type: SectionType_1.SectionType.Container },
      53: { name: "SamplingFrequency", type: SectionType_1.SectionType.Float },
      14517: { name: "OutputSamplingFrequency", type: SectionType_1.SectionType.Float },
      31: { name: "Channels", type: SectionType_1.SectionType.Uint },
      15739: { name: "ChannelPositions", type: SectionType_1.SectionType.Binary },
      8804: { name: "BitDepth", type: SectionType_1.SectionType.Uint },
      98: { name: "TrackOperation", type: SectionType_1.SectionType.Container },
      99: { name: "TrackCombinePlanes", type: SectionType_1.SectionType.Container },
      100: { name: "TrackPlane", type: SectionType_1.SectionType.Container },
      101: { name: "TrackPlaneUID", type: SectionType_1.SectionType.Uint },
      102: { name: "TrackPlaneType", type: SectionType_1.SectionType.Uint },
      105: { name: "TrackJoinBlocks", type: SectionType_1.SectionType.Container },
      109: { name: "TrackJoinUID", type: SectionType_1.SectionType.Uint },
      64: { name: "TrickTrackUID", type: SectionType_1.SectionType.Uint },
      65: { name: "TrickTrackSegmentUID", type: SectionType_1.SectionType.Binary },
      70: { name: "TrickTrackFlag", type: SectionType_1.SectionType.Uint },
      71: { name: "TrickMasterTrackUID", type: SectionType_1.SectionType.Uint },
      68: { name: "TrickMasterTrackSegmentUID", type: SectionType_1.SectionType.Binary },
      11648: { name: "ContentEncodings", type: SectionType_1.SectionType.Container },
      8768: { name: "ContentEncoding", type: SectionType_1.SectionType.Container },
      4145: { name: "ContentEncodingOrder", type: SectionType_1.SectionType.Uint },
      4146: { name: "ContentEncodingScope", type: SectionType_1.SectionType.Uint },
      4147: { name: "ContentEncodingType", type: SectionType_1.SectionType.Uint },
      4148: { name: "ContentCompression", type: SectionType_1.SectionType.Container },
      596: { name: "ContentCompAlgo", type: SectionType_1.SectionType.Uint },
      597: { name: "ContentCompSettings", type: SectionType_1.SectionType.Binary },
      4149: { name: "ContentEncryption", type: SectionType_1.SectionType.Container },
      2017: { name: "ContentEncAlgo", type: SectionType_1.SectionType.Uint },
      2018: { name: "ContentEncKeyID", type: SectionType_1.SectionType.Binary },
      2019: { name: "ContentSignature", type: SectionType_1.SectionType.Binary },
      2020: { name: "ContentSigKeyID", type: SectionType_1.SectionType.Binary },
      2021: { name: "ContentSigAlgo", type: SectionType_1.SectionType.Uint },
      2022: { name: "ContentSigHashAlgo", type: SectionType_1.SectionType.Uint },
      206814059: { name: "Cues", type: SectionType_1.SectionType.Container },
      59: { name: "CuePoint", type: SectionType_1.SectionType.Container },
      51: { name: "CueTime", type: SectionType_1.SectionType.Uint },
      55: { name: "CueTrackPositions", type: SectionType_1.SectionType.Container },
      119: { name: "CueTrack", type: SectionType_1.SectionType.Uint },
      113: { name: "CueClusterPosition", type: SectionType_1.SectionType.Uint },
      112: { name: "CueRelativePosition", type: SectionType_1.SectionType.Uint },
      50: { name: "CueDuration", type: SectionType_1.SectionType.Uint },
      4984: { name: "CueBlockNumber", type: SectionType_1.SectionType.Uint },
      106: { name: "CueCodecState", type: SectionType_1.SectionType.Uint },
      91: { name: "CueReference", type: SectionType_1.SectionType.Container },
      22: { name: "CueRefTime", type: SectionType_1.SectionType.Uint },
      23: { name: "CueRefCluster", type: SectionType_1.SectionType.Uint },
      4959: { name: "CueRefNumber", type: SectionType_1.SectionType.Uint },
      107: { name: "CueRefCodecState", type: SectionType_1.SectionType.Uint },
      155296873: { name: "Attachments", type: SectionType_1.SectionType.Container },
      8615: { name: "AttachedFile", type: SectionType_1.SectionType.Container },
      1662: { name: "FileDescription", type: SectionType_1.SectionType.String },
      1646: { name: "FileName", type: SectionType_1.SectionType.String },
      1632: { name: "FileMimeType", type: SectionType_1.SectionType.String },
      1628: { name: "FileData", type: SectionType_1.SectionType.Binary },
      1710: { name: "FileUID", type: SectionType_1.SectionType.Uint },
      1653: { name: "FileReferral", type: SectionType_1.SectionType.Binary },
      1633: { name: "FileUsedStartTime", type: SectionType_1.SectionType.Uint },
      1634: { name: "FileUsedEndTime", type: SectionType_1.SectionType.Uint },
      4433776: { name: "Chapters", type: SectionType_1.SectionType.Container },
      1465: { name: "EditionEntry", type: SectionType_1.SectionType.Container },
      1468: { name: "EditionUID", type: SectionType_1.SectionType.Uint },
      1469: { name: "EditionFlagHidden", type: SectionType_1.SectionType.Uint },
      1499: { name: "EditionFlagDefault", type: SectionType_1.SectionType.Uint },
      1501: { name: "EditionFlagOrdered", type: SectionType_1.SectionType.Uint },
      54: { name: "ChapterAtom", type: SectionType_1.SectionType.Container },
      13252: { name: "ChapterUID", type: SectionType_1.SectionType.Uint },
      5716: { name: "ChapterStringUID", type: SectionType_1.SectionType.String },
      17: { name: "ChapterTimeStart", type: SectionType_1.SectionType.Uint },
      18: { name: "ChapterTimeEnd", type: SectionType_1.SectionType.Uint },
      24: { name: "ChapterFlagHidden", type: SectionType_1.SectionType.Uint },
      1432: { name: "ChapterFlagEnabled", type: SectionType_1.SectionType.Uint },
      11879: { name: "ChapterSegmentUID", type: SectionType_1.SectionType.Binary },
      11964: { name: "ChapterSegmentEditionUID", type: SectionType_1.SectionType.Uint },
      9155: { name: "ChapterPhysicalEquiv", type: SectionType_1.SectionType.Uint },
      15: { name: "ChapterTrack", type: SectionType_1.SectionType.Container },
      9: { name: "ChapterTrackNumber", type: SectionType_1.SectionType.Uint },
      0: { name: "ChapterDisplay", type: SectionType_1.SectionType.Container },
      5: { name: "ChapString", type: SectionType_1.SectionType.String },
      892: { name: "ChapLanguage", type: SectionType_1.SectionType.String },
      894: { name: "ChapCountry", type: SectionType_1.SectionType.String },
      10564: { name: "ChapProcess", type: SectionType_1.SectionType.Container },
      10581: { name: "ChapProcessCodecID", type: SectionType_1.SectionType.Uint },
      1293: { name: "ChapProcessPrivate", type: SectionType_1.SectionType.Binary },
      10513: { name: "ChapProcessCommand", type: SectionType_1.SectionType.Container },
      10530: { name: "ChapProcessTime", type: SectionType_1.SectionType.Uint },
      10547: { name: "ChapProcessData", type: SectionType_1.SectionType.Binary },
      39109479: { name: "Tags", type: SectionType_1.SectionType.Container },
      13171: { name: "Tag", type: SectionType_1.SectionType.Container },
      9152: { name: "Targets", type: SectionType_1.SectionType.Container },
      10442: { name: "TargetTypeValue", type: SectionType_1.SectionType.Uint },
      9162: { name: "TargetType", type: SectionType_1.SectionType.String },
      9157: { name: "TagTrackUID", type: SectionType_1.SectionType.Uint },
      9161: { name: "TagEditionUID", type: SectionType_1.SectionType.Uint },
      9156: { name: "TagChapterUID", type: SectionType_1.SectionType.Uint },
      9158: { name: "TagAttachmentUID", type: SectionType_1.SectionType.Uint },
      10184: { name: "SimpleTag", type: SectionType_1.SectionType.Container },
      1443: { name: "TagName", type: SectionType_1.SectionType.String },
      1146: { name: "TagLanguage", type: SectionType_1.SectionType.String },
      1156: { name: "TagDefault", type: SectionType_1.SectionType.Uint },
      1159: { name: "TagString", type: SectionType_1.SectionType.String },
      1157: { name: "TagBinary", type: SectionType_1.SectionType.Binary },
      5552: { name: "Colour", type: SectionType_1.SectionType.Container },
      5553: { name: "MatrixCoefficients", type: SectionType_1.SectionType.Uint },
      5554: { name: "BitsPerChannel", type: SectionType_1.SectionType.Uint },
      5555: { name: "ChromaSubsamplingHorz", type: SectionType_1.SectionType.Uint },
      5556: { name: "ChromaSubsamplingVert", type: SectionType_1.SectionType.Uint },
      5557: { name: "CbSubsamplingHorz", type: SectionType_1.SectionType.Uint },
      5558: { name: "CbSubsamplingVert", type: SectionType_1.SectionType.Uint },
      5559: { name: "ChromaSitingHorz", type: SectionType_1.SectionType.Uint },
      5560: { name: "ChromaSitingVert", type: SectionType_1.SectionType.Uint },
      5561: { name: "Range", type: SectionType_1.SectionType.Uint },
      5562: { name: "TransferCharacteristics", type: SectionType_1.SectionType.Uint },
      5563: { name: "Primaries", type: SectionType_1.SectionType.Uint },
      5564: { name: "MaxCLL", type: SectionType_1.SectionType.Uint },
      5565: { name: "MaxFALL", type: SectionType_1.SectionType.Uint }
    };
  }
});

// node_modules/@fix-webm-duration/parser/src/lib/WebmUint.js
var require_WebmUint = __commonJS({
  "node_modules/@fix-webm-duration/parser/src/lib/WebmUint.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.WebmUint = void 0;
    var WebmBase_1 = require_WebmBase();
    function padHex(hex) {
      return hex.length % 2 === 1 ? "0" + hex : hex;
    }
    var WebmUint = class extends WebmBase_1.WebmBase {
      constructor(name, start = 0) {
        super(name, start);
      }
      getType() {
        return "Uint";
      }
      updateBySource() {
        this.data = "";
        for (let i = 0; i < this.source.length; i++) {
          const hex = this.source[i].toString(16);
          this.data += padHex(hex);
        }
      }
      updateByData() {
        const length = this.data.length / 2;
        this.source = new Uint8Array(length);
        for (let i = 0; i < length; i++) {
          const hex = this.data.substring(i * 2, i * 2 + 2);
          this.source[i] = parseInt(hex, 16);
        }
      }
      getValue() {
        return parseInt(this.data, 16);
      }
      setValue(value) {
        this.setData(padHex(value.toString(16)));
      }
    };
    exports.WebmUint = WebmUint;
  }
});

// node_modules/@fix-webm-duration/parser/src/lib/WebmFloat.js
var require_WebmFloat = __commonJS({
  "node_modules/@fix-webm-duration/parser/src/lib/WebmFloat.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.WebmFloat = void 0;
    var WebmBase_1 = require_WebmBase();
    var WebmFloat = class extends WebmBase_1.WebmBase {
      constructor(name, start = 0) {
        super(name, start);
      }
      getType() {
        return "Float";
      }
      getFloatArrayType() {
        return this.source && this.source.length === 4 ? Float32Array : Float64Array;
      }
      updateBySource() {
        const byteArray = this.source.reverse();
        const floatArrayType = this.getFloatArrayType();
        const floatArray = new floatArrayType(byteArray.buffer);
        this.data = floatArray[0];
      }
      updateByData() {
        const floatArrayType = this.getFloatArrayType();
        const floatArray = new floatArrayType([this.data]);
        const byteArray = new Uint8Array(floatArray.buffer);
        this.source = byteArray.reverse();
      }
    };
    exports.WebmFloat = WebmFloat;
  }
});

// node_modules/@fix-webm-duration/parser/src/lib/WebmString.js
var require_WebmString = __commonJS({
  "node_modules/@fix-webm-duration/parser/src/lib/WebmString.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.WebmString = void 0;
    var WebmBase_1 = require_WebmBase();
    var WebmString = class extends WebmBase_1.WebmBase {
      constructor(name, start = 0) {
        super(name, start);
      }
      getType() {
        return "String";
      }
      updateBySource() {
        this.data = this.source;
      }
      updateByData() {
        this.source = this.data;
      }
      getValue() {
        let result = "";
        this.source.forEach((code) => {
          result += String.fromCharCode(code);
        });
        return result;
      }
    };
    exports.WebmString = WebmString;
  }
});

// node_modules/@fix-webm-duration/parser/src/lib/WebmContainer.js
var require_WebmContainer = __commonJS({
  "node_modules/@fix-webm-duration/parser/src/lib/WebmContainer.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.WebmContainer = void 0;
    var WebmBase_1 = require_WebmBase();
    var sections_1 = require_sections();
    var SectionType_1 = require_SectionType();
    var WebmUint_1 = require_WebmUint();
    var WebmFloat_1 = require_WebmFloat();
    var WebmString_1 = require_WebmString();
    var WebmContainer = class _WebmContainer extends WebmBase_1.WebmBase {
      constructor(name, isInfinite = false, start = 0) {
        super(name, start);
        this.isInfinite = isInfinite;
        this.offset = 0;
      }
      getType() {
        return "Container";
      }
      readByte() {
        return this.source[this.offset++];
      }
      readUint() {
        const firstByte = this.readByte();
        const bytes = 8 - firstByte.toString(2).length;
        let value = firstByte - (1 << 7 - bytes);
        for (let i = 0; i < bytes; i++) {
          value <<= 8;
          value |= this.readByte();
        }
        return value;
      }
      updateBySource() {
        var _a;
        this.data = [];
        let end;
        for (this.offset = 0; this.offset < this.source.length; this.offset = end) {
          const start = this.offset;
          const id = this.readUint();
          const { name, type } = (_a = sections_1.sections[id]) !== null && _a !== void 0 ? _a : {};
          const len = this.readUint();
          end = this.source.length;
          if (len >= 0)
            end = Math.min(this.offset + len, end);
          const data = this.source.slice(this.offset, end);
          let section;
          switch (type) {
            case SectionType_1.SectionType.Container:
              section = new _WebmContainer(name, len < 0, start);
              break;
            case SectionType_1.SectionType.Uint:
              section = new WebmUint_1.WebmUint(name, start);
              break;
            case SectionType_1.SectionType.Float:
              section = new WebmFloat_1.WebmFloat(name, start);
              break;
            case SectionType_1.SectionType.String:
              section = new WebmString_1.WebmString(name, start);
              break;
            default:
              section = new WebmBase_1.WebmBase(name, start);
              break;
          }
          section.setSource(data);
          this.data.push({
            id,
            idHex: id.toString(16),
            data: section
          });
        }
      }
      writeUint(x, draft = false) {
        let bytes;
        for (bytes = 1; (x < 0 || x >= 1 << 7 * bytes) && bytes < 8; bytes++) {
        }
        if (!draft) {
          for (let i = 0; i < bytes; i++) {
            this.source[this.offset + i] = x >> 8 * (bytes - 1 - i) & 255;
          }
          this.source[this.offset] &= (1 << 8 - bytes) - 1;
          this.source[this.offset] |= 1 << 8 - bytes;
        }
        this.offset += bytes;
      }
      writeSections(draft = false) {
        this.offset = 0;
        for (let i = 0; i < this.data.length; i++) {
          const section = this.data[i], content = section.data.source, contentLength = content.length;
          this.writeUint(section.id, draft);
          this.writeUint(section.data instanceof _WebmContainer && section.data.isInfinite ? -1 : contentLength, draft);
          if (!draft) {
            this.source.set(content, this.offset);
          }
          this.offset += contentLength;
        }
        return this.offset;
      }
      updateByData() {
        const length = this.writeSections(true);
        this.source = new Uint8Array(length);
        this.writeSections();
      }
      getSectionById(id) {
        for (let i = 0; i < this.data.length; i++) {
          const section = this.data[i];
          if (section.id === id) {
            return section.data;
          }
        }
        return null;
      }
    };
    exports.WebmContainer = WebmContainer;
  }
});

// node_modules/@fix-webm-duration/parser/src/lib/WebmFile.js
var require_WebmFile = __commonJS({
  "node_modules/@fix-webm-duration/parser/src/lib/WebmFile.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.WebmFile = void 0;
    var tslib_1 = (init_tslib_es6(), __toCommonJS(tslib_es6_exports));
    var WebmContainer_1 = require_WebmContainer();
    var WebmFile = class _WebmFile extends WebmContainer_1.WebmContainer {
      constructor(source) {
        super("File");
        this.setSource(source);
      }
      getType() {
        return "File";
      }
      toBlob(mimeType = "video/webm") {
        return new Blob([this.source.buffer], { type: mimeType });
      }
      static blobToArray(blob) {
        return new Promise((resolve, reject) => {
          try {
            const reader = new FileReader();
            reader.onloadend = () => {
              try {
                resolve(new Uint8Array(reader.result));
              } catch (ex) {
                reject(ex);
              }
            };
            reader.readAsArrayBuffer(blob);
          } catch (ex) {
            reject(ex);
          }
        });
      }
      static fromBlob(blob) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
          const array = yield _WebmFile.blobToArray(blob);
          return new _WebmFile(array);
        });
      }
    };
    exports.WebmFile = WebmFile;
  }
});

// node_modules/@fix-webm-duration/parser/src/lib/Options.js
var require_Options = __commonJS({
  "node_modules/@fix-webm-duration/parser/src/lib/Options.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/@fix-webm-duration/parser/src/index.js
var require_src = __commonJS({
  "node_modules/@fix-webm-duration/parser/src/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = (init_tslib_es6(), __toCommonJS(tslib_es6_exports));
    tslib_1.__exportStar(require_WebmBase(), exports);
    tslib_1.__exportStar(require_WebmContainer(), exports);
    tslib_1.__exportStar(require_WebmFile(), exports);
    tslib_1.__exportStar(require_WebmFloat(), exports);
    tslib_1.__exportStar(require_WebmString(), exports);
    tslib_1.__exportStar(require_WebmUint(), exports);
    tslib_1.__exportStar(require_SectionType(), exports);
    tslib_1.__exportStar(require_Options(), exports);
    tslib_1.__exportStar(require_sections(), exports);
  }
});

// node_modules/@fix-webm-duration/fix/src/lib/fixParsedWebmDuration.js
var require_fixParsedWebmDuration = __commonJS({
  "node_modules/@fix-webm-duration/fix/src/lib/fixParsedWebmDuration.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.fixParsedWebmDuration = void 0;
    var parser_1 = require_src();
    var fixParsedWebmDuration = (file, duration, options = {}) => {
      let logger = options.logger;
      if (logger === void 0) {
        logger = (message) => console.debug(message);
      } else if (!logger) {
        logger = () => {
        };
      }
      const segmentSection = file.getSectionById(139690087);
      if (!segmentSection) {
        logger("[fix-webm-duration] Segment section is missing");
        return false;
      }
      const infoSection = segmentSection.getSectionById(88713574);
      if (!infoSection) {
        logger("[fix-webm-duration] Info section is missing");
        return false;
      }
      const timeScaleSection = infoSection.getSectionById(710577);
      if (!timeScaleSection) {
        logger("[fix-webm-duration] TimecodeScale section is missing");
        return false;
      }
      let durationSection = infoSection.getSectionById(1161);
      if (durationSection) {
        if (durationSection.getValue() <= 0) {
          logger(`[fix-webm-duration] Duration section is present, but the value is ${durationSection.getValue()}`);
          durationSection.setValue(duration);
        } else {
          logger(`[fix-webm-duration] Duration section is present, and the value is ${durationSection.getValue()}`);
          return false;
        }
      } else {
        logger("[fix-webm-duration] Duration section is missing");
        durationSection = new parser_1.WebmFloat("Duration");
        durationSection.setValue(duration);
        infoSection.data.push({
          id: 1161,
          data: durationSection
        });
      }
      timeScaleSection.setValue(1e6);
      infoSection.updateByData();
      segmentSection.updateByData();
      file.updateByData();
      return true;
    };
    exports.fixParsedWebmDuration = fixParsedWebmDuration;
  }
});

// node_modules/@fix-webm-duration/fix/src/lib/fixWebmDuration.js
var require_fixWebmDuration = __commonJS({
  "node_modules/@fix-webm-duration/fix/src/lib/fixWebmDuration.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.fixWebmDuration = void 0;
    var tslib_1 = (init_tslib_es6(), __toCommonJS(tslib_es6_exports));
    var parser_1 = require_src();
    var fixParsedWebmDuration_1 = require_fixParsedWebmDuration();
    var fixWebmDuration = (blob, duration, options) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
      try {
        const file = yield parser_1.WebmFile.fromBlob(blob);
        if ((0, fixParsedWebmDuration_1.fixParsedWebmDuration)(file, duration, options)) {
          return file.toBlob(blob.type);
        }
      } catch (_a) {
      }
      return blob;
    });
    exports.fixWebmDuration = fixWebmDuration;
  }
});

// node_modules/@fix-webm-duration/fix/src/index.js
var require_src2 = __commonJS({
  "node_modules/@fix-webm-duration/fix/src/index.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = (init_tslib_es6(), __toCommonJS(tslib_es6_exports));
    tslib_1.__exportStar(require_fixWebmDuration(), exports);
    tslib_1.__exportStar(require_fixParsedWebmDuration(), exports);
  }
});
export default require_src2();
//# sourceMappingURL=@fix-webm-duration_fix.js.map
