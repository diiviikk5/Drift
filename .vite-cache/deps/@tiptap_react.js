import {
  require_jsx_runtime
} from "./chunk-VCTZMZAN.js";
import {
  require_react_dom
} from "./chunk-BUDFYU2X.js";
import {
  require_react
} from "./chunk-OWFRCXL4.js";
import {
  CommandManager,
  Editor,
  Extendable,
  Extension,
  Fragment6,
  InputRule,
  MappablePosition,
  Mark,
  MarkView,
  Node3,
  NodePos,
  NodeView,
  PasteRule,
  ResizableNodeView,
  ResizableNodeview,
  Tracker,
  attrsEqual,
  callOrReturn,
  canInsertNode,
  combineTransactionSteps,
  commands_exports,
  createAtomBlockMarkdownSpec,
  createBlockMarkdownSpec,
  createChainableState,
  createDocument,
  createInlineMarkdownSpec,
  createMappablePosition,
  createNodeFromContent,
  createStyleTag,
  decodeHtmlEntities,
  defaultBlockAt,
  deleteProps,
  elementFromString,
  encodeHtmlEntities,
  escapeForRegEx,
  extensions_exports,
  findChildren,
  findChildrenInRange,
  findDuplicates,
  findParentNode,
  findParentNodeClosestToPos,
  flattenExtensions,
  fromString,
  generateHTML,
  generateJSON,
  generateText,
  getAttributes,
  getAttributesFromExtensions,
  getChangedRanges,
  getDebugJSON,
  getExtensionField,
  getHTMLFromFragment,
  getMarkAttributes,
  getMarkRange,
  getMarkType,
  getMarksBetween,
  getNodeAtPosition,
  getNodeAttributes,
  getNodeType,
  getRenderedAttributes,
  getSchema,
  getSchemaByResolvedExtensions,
  getSchemaTypeByName,
  getSchemaTypeNameByName,
  getSplittedAttributes,
  getStyleProperty,
  getText,
  getTextBetween,
  getTextContentFromNodes,
  getTextSerializersFromSchema,
  getUpdatedPosition,
  h,
  injectExtensionAttributesToParseRule,
  inputRulesPlugin,
  isActive,
  isAndroid,
  isAtEndOfNode,
  isAtStartOfNode,
  isEmptyObject,
  isExtensionRulesEnabled,
  isFirefox,
  isFunction,
  isList,
  isMacOS,
  isMarkActive,
  isNodeActive,
  isNodeEmpty,
  isNodeSelection,
  isNodeViewSelected,
  isNumber,
  isPlainObject,
  isRegExp,
  isSafari,
  isString,
  isTextSelection,
  isiOS,
  markInputRule,
  markPasteRule,
  markdown_exports,
  marksEqual,
  mergeAttributes,
  mergeDeep,
  minMax,
  nodeInputRule,
  nodePasteRule,
  objectIncludes,
  parseAttributes,
  parseIndentedBlocks,
  pasteRulesPlugin,
  posToDOMRect,
  removeDuplicates,
  renderNestedMarkdownContent,
  resolveExtensions,
  resolveFocusPosition,
  rewriteUnknownContent,
  selectionToInsertionEnd,
  serializeAttributes,
  sortExtensions,
  splitExtensions,
  textInputRule,
  textPasteRule,
  textblockTypeInputRule,
  updateMarkViewAttributes,
  wrappingInputRule
} from "./chunk-KAKZ6HEE.js";
import {
  __commonJS,
  __toESM
} from "./chunk-QLCLYZTY.js";

// node_modules/use-sync-external-store/cjs/use-sync-external-store-shim.development.js
var require_use_sync_external_store_shim_development = __commonJS({
  "node_modules/use-sync-external-store/cjs/use-sync-external-store-shim.development.js"(exports) {
    "use strict";
    (function() {
      function is(x, y) {
        return x === y && (0 !== x || 1 / x === 1 / y) || x !== x && y !== y;
      }
      function useSyncExternalStore$2(subscribe, getSnapshot) {
        didWarnOld18Alpha || void 0 === React2.startTransition || (didWarnOld18Alpha = true, console.error(
          "You are using an outdated, pre-release alpha of React 18 that does not support useSyncExternalStore. The use-sync-external-store shim will not work correctly. Upgrade to a newer pre-release."
        ));
        var value = getSnapshot();
        if (!didWarnUncachedGetSnapshot) {
          var cachedValue = getSnapshot();
          objectIs(value, cachedValue) || (console.error(
            "The result of getSnapshot should be cached to avoid an infinite loop"
          ), didWarnUncachedGetSnapshot = true);
        }
        cachedValue = useState3({
          inst: { value, getSnapshot }
        });
        var inst = cachedValue[0].inst, forceUpdate = cachedValue[1];
        useLayoutEffect2(
          function() {
            inst.value = value;
            inst.getSnapshot = getSnapshot;
            checkIfSnapshotChanged(inst) && forceUpdate({ inst });
          },
          [subscribe, value, getSnapshot]
        );
        useEffect3(
          function() {
            checkIfSnapshotChanged(inst) && forceUpdate({ inst });
            return subscribe(function() {
              checkIfSnapshotChanged(inst) && forceUpdate({ inst });
            });
          },
          [subscribe]
        );
        useDebugValue3(value);
        return value;
      }
      function checkIfSnapshotChanged(inst) {
        var latestGetSnapshot = inst.getSnapshot;
        inst = inst.value;
        try {
          var nextValue = latestGetSnapshot();
          return !objectIs(inst, nextValue);
        } catch (error) {
          return true;
        }
      }
      function useSyncExternalStore$1(subscribe, getSnapshot) {
        return getSnapshot();
      }
      "undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ && "function" === typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error());
      var React2 = require_react(), objectIs = "function" === typeof Object.is ? Object.is : is, useState3 = React2.useState, useEffect3 = React2.useEffect, useLayoutEffect2 = React2.useLayoutEffect, useDebugValue3 = React2.useDebugValue, didWarnOld18Alpha = false, didWarnUncachedGetSnapshot = false, shim = "undefined" === typeof window || "undefined" === typeof window.document || "undefined" === typeof window.document.createElement ? useSyncExternalStore$1 : useSyncExternalStore$2;
      exports.useSyncExternalStore = void 0 !== React2.useSyncExternalStore ? React2.useSyncExternalStore : shim;
      "undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ && "function" === typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error());
    })();
  }
});

// node_modules/use-sync-external-store/shim/index.js
var require_shim = __commonJS({
  "node_modules/use-sync-external-store/shim/index.js"(exports, module) {
    "use strict";
    if (false) {
      module.exports = null;
    } else {
      module.exports = require_use_sync_external_store_shim_development();
    }
  }
});

// node_modules/use-sync-external-store/cjs/use-sync-external-store-shim/with-selector.development.js
var require_with_selector_development = __commonJS({
  "node_modules/use-sync-external-store/cjs/use-sync-external-store-shim/with-selector.development.js"(exports) {
    "use strict";
    (function() {
      function is(x, y) {
        return x === y && (0 !== x || 1 / x === 1 / y) || x !== x && y !== y;
      }
      "undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ && "function" === typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error());
      var React2 = require_react(), shim = require_shim(), objectIs = "function" === typeof Object.is ? Object.is : is, useSyncExternalStore3 = shim.useSyncExternalStore, useRef2 = React2.useRef, useEffect3 = React2.useEffect, useMemo3 = React2.useMemo, useDebugValue3 = React2.useDebugValue;
      exports.useSyncExternalStoreWithSelector = function(subscribe, getSnapshot, getServerSnapshot, selector, isEqual) {
        var instRef = useRef2(null);
        if (null === instRef.current) {
          var inst = { hasValue: false, value: null };
          instRef.current = inst;
        } else inst = instRef.current;
        instRef = useMemo3(
          function() {
            function memoizedSelector(nextSnapshot) {
              if (!hasMemo) {
                hasMemo = true;
                memoizedSnapshot = nextSnapshot;
                nextSnapshot = selector(nextSnapshot);
                if (void 0 !== isEqual && inst.hasValue) {
                  var currentSelection = inst.value;
                  if (isEqual(currentSelection, nextSnapshot))
                    return memoizedSelection = currentSelection;
                }
                return memoizedSelection = nextSnapshot;
              }
              currentSelection = memoizedSelection;
              if (objectIs(memoizedSnapshot, nextSnapshot))
                return currentSelection;
              var nextSelection = selector(nextSnapshot);
              if (void 0 !== isEqual && isEqual(currentSelection, nextSelection))
                return memoizedSnapshot = nextSnapshot, currentSelection;
              memoizedSnapshot = nextSnapshot;
              return memoizedSelection = nextSelection;
            }
            var hasMemo = false, memoizedSnapshot, memoizedSelection, maybeGetServerSnapshot = void 0 === getServerSnapshot ? null : getServerSnapshot;
            return [
              function() {
                return memoizedSelector(getSnapshot());
              },
              null === maybeGetServerSnapshot ? void 0 : function() {
                return memoizedSelector(maybeGetServerSnapshot());
              }
            ];
          },
          [getSnapshot, getServerSnapshot, selector, isEqual]
        );
        var value = useSyncExternalStore3(subscribe, instRef[0], instRef[1]);
        useEffect3(
          function() {
            inst.hasValue = true;
            inst.value = value;
          },
          [value]
        );
        useDebugValue3(value);
        return value;
      };
      "undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ && "function" === typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error());
    })();
  }
});

// node_modules/use-sync-external-store/shim/with-selector.js
var require_with_selector = __commonJS({
  "node_modules/use-sync-external-store/shim/with-selector.js"(exports, module) {
    "use strict";
    if (false) {
      module.exports = null;
    } else {
      module.exports = require_with_selector_development();
    }
  }
});

// node_modules/@tiptap/react/dist/index.js
var import_react = __toESM(require_react());
var import_react2 = __toESM(require_react());
var import_react_dom = __toESM(require_react_dom());
var import_shim = __toESM(require_shim());
var import_jsx_runtime = __toESM(require_jsx_runtime());
var import_react3 = __toESM(require_react());
var import_shim2 = __toESM(require_shim());

// node_modules/fast-equals/dist/es/index.mjs
var { getOwnPropertyNames, getOwnPropertySymbols } = Object;
var { hasOwnProperty } = Object.prototype;
function combineComparators(comparatorA, comparatorB) {
  return function isEqual(a, b, state) {
    return comparatorA(a, b, state) && comparatorB(a, b, state);
  };
}
function createIsCircular(areItemsEqual) {
  return function isCircular(a, b, state) {
    if (!a || !b || typeof a !== "object" || typeof b !== "object") {
      return areItemsEqual(a, b, state);
    }
    const { cache } = state;
    const cachedA = cache.get(a);
    const cachedB = cache.get(b);
    if (cachedA && cachedB) {
      return cachedA === b && cachedB === a;
    }
    cache.set(a, b);
    cache.set(b, a);
    const result = areItemsEqual(a, b, state);
    cache.delete(a);
    cache.delete(b);
    return result;
  };
}
function getShortTag(value) {
  return value != null ? value[Symbol.toStringTag] : void 0;
}
function getStrictProperties(object) {
  return getOwnPropertyNames(object).concat(getOwnPropertySymbols(object));
}
var hasOwn = (
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  Object.hasOwn || ((object, property) => hasOwnProperty.call(object, property))
);
function sameValueZeroEqual(a, b) {
  return a === b || !a && !b && a !== a && b !== b;
}
var PREACT_VNODE = "__v";
var PREACT_OWNER = "__o";
var REACT_OWNER = "_owner";
var { getOwnPropertyDescriptor, keys } = Object;
function areArrayBuffersEqual(a, b) {
  return a.byteLength === b.byteLength && areTypedArraysEqual(new Uint8Array(a), new Uint8Array(b));
}
function areArraysEqual(a, b, state) {
  let index = a.length;
  if (b.length !== index) {
    return false;
  }
  while (index-- > 0) {
    if (!state.equals(a[index], b[index], index, index, a, b, state)) {
      return false;
    }
  }
  return true;
}
function areDataViewsEqual(a, b) {
  return a.byteLength === b.byteLength && areTypedArraysEqual(new Uint8Array(a.buffer, a.byteOffset, a.byteLength), new Uint8Array(b.buffer, b.byteOffset, b.byteLength));
}
function areDatesEqual(a, b) {
  return sameValueZeroEqual(a.getTime(), b.getTime());
}
function areErrorsEqual(a, b) {
  return a.name === b.name && a.message === b.message && a.cause === b.cause && a.stack === b.stack;
}
function areFunctionsEqual(a, b) {
  return a === b;
}
function areMapsEqual(a, b, state) {
  const size = a.size;
  if (size !== b.size) {
    return false;
  }
  if (!size) {
    return true;
  }
  const matchedIndices = new Array(size);
  const aIterable = a.entries();
  let aResult;
  let bResult;
  let index = 0;
  while (aResult = aIterable.next()) {
    if (aResult.done) {
      break;
    }
    const bIterable = b.entries();
    let hasMatch = false;
    let matchIndex = 0;
    while (bResult = bIterable.next()) {
      if (bResult.done) {
        break;
      }
      if (matchedIndices[matchIndex]) {
        matchIndex++;
        continue;
      }
      const aEntry = aResult.value;
      const bEntry = bResult.value;
      if (state.equals(aEntry[0], bEntry[0], index, matchIndex, a, b, state) && state.equals(aEntry[1], bEntry[1], aEntry[0], bEntry[0], a, b, state)) {
        hasMatch = matchedIndices[matchIndex] = true;
        break;
      }
      matchIndex++;
    }
    if (!hasMatch) {
      return false;
    }
    index++;
  }
  return true;
}
var areNumbersEqual = sameValueZeroEqual;
function areObjectsEqual(a, b, state) {
  const properties = keys(a);
  let index = properties.length;
  if (keys(b).length !== index) {
    return false;
  }
  while (index-- > 0) {
    if (!isPropertyEqual(a, b, state, properties[index])) {
      return false;
    }
  }
  return true;
}
function areObjectsEqualStrict(a, b, state) {
  const properties = getStrictProperties(a);
  let index = properties.length;
  if (getStrictProperties(b).length !== index) {
    return false;
  }
  let property;
  let descriptorA;
  let descriptorB;
  while (index-- > 0) {
    property = properties[index];
    if (!isPropertyEqual(a, b, state, property)) {
      return false;
    }
    descriptorA = getOwnPropertyDescriptor(a, property);
    descriptorB = getOwnPropertyDescriptor(b, property);
    if ((descriptorA || descriptorB) && (!descriptorA || !descriptorB || descriptorA.configurable !== descriptorB.configurable || descriptorA.enumerable !== descriptorB.enumerable || descriptorA.writable !== descriptorB.writable)) {
      return false;
    }
  }
  return true;
}
function arePrimitiveWrappersEqual(a, b) {
  return sameValueZeroEqual(a.valueOf(), b.valueOf());
}
function areRegExpsEqual(a, b) {
  return a.source === b.source && a.flags === b.flags;
}
function areSetsEqual(a, b, state) {
  const size = a.size;
  if (size !== b.size) {
    return false;
  }
  if (!size) {
    return true;
  }
  const matchedIndices = new Array(size);
  const aIterable = a.values();
  let aResult;
  let bResult;
  while (aResult = aIterable.next()) {
    if (aResult.done) {
      break;
    }
    const bIterable = b.values();
    let hasMatch = false;
    let matchIndex = 0;
    while (bResult = bIterable.next()) {
      if (bResult.done) {
        break;
      }
      if (!matchedIndices[matchIndex] && state.equals(aResult.value, bResult.value, aResult.value, bResult.value, a, b, state)) {
        hasMatch = matchedIndices[matchIndex] = true;
        break;
      }
      matchIndex++;
    }
    if (!hasMatch) {
      return false;
    }
  }
  return true;
}
function areTypedArraysEqual(a, b) {
  let index = a.byteLength;
  if (b.byteLength !== index || a.byteOffset !== b.byteOffset) {
    return false;
  }
  while (index-- > 0) {
    if (a[index] !== b[index]) {
      return false;
    }
  }
  return true;
}
function areUrlsEqual(a, b) {
  return a.hostname === b.hostname && a.pathname === b.pathname && a.protocol === b.protocol && a.port === b.port && a.hash === b.hash && a.username === b.username && a.password === b.password;
}
function isPropertyEqual(a, b, state, property) {
  if ((property === REACT_OWNER || property === PREACT_OWNER || property === PREACT_VNODE) && (a.$$typeof || b.$$typeof)) {
    return true;
  }
  return hasOwn(b, property) && state.equals(a[property], b[property], property, property, a, b, state);
}
var ARRAY_BUFFER_TAG = "[object ArrayBuffer]";
var ARGUMENTS_TAG = "[object Arguments]";
var BOOLEAN_TAG = "[object Boolean]";
var DATA_VIEW_TAG = "[object DataView]";
var DATE_TAG = "[object Date]";
var ERROR_TAG = "[object Error]";
var MAP_TAG = "[object Map]";
var NUMBER_TAG = "[object Number]";
var OBJECT_TAG = "[object Object]";
var REG_EXP_TAG = "[object RegExp]";
var SET_TAG = "[object Set]";
var STRING_TAG = "[object String]";
var TYPED_ARRAY_TAGS = {
  "[object Int8Array]": true,
  "[object Uint8Array]": true,
  "[object Uint8ClampedArray]": true,
  "[object Int16Array]": true,
  "[object Uint16Array]": true,
  "[object Int32Array]": true,
  "[object Uint32Array]": true,
  "[object Float16Array]": true,
  "[object Float32Array]": true,
  "[object Float64Array]": true,
  "[object BigInt64Array]": true,
  "[object BigUint64Array]": true
};
var URL_TAG = "[object URL]";
var toString = Object.prototype.toString;
function createEqualityComparator({ areArrayBuffersEqual: areArrayBuffersEqual2, areArraysEqual: areArraysEqual2, areDataViewsEqual: areDataViewsEqual2, areDatesEqual: areDatesEqual2, areErrorsEqual: areErrorsEqual2, areFunctionsEqual: areFunctionsEqual2, areMapsEqual: areMapsEqual2, areNumbersEqual: areNumbersEqual2, areObjectsEqual: areObjectsEqual2, arePrimitiveWrappersEqual: arePrimitiveWrappersEqual2, areRegExpsEqual: areRegExpsEqual2, areSetsEqual: areSetsEqual2, areTypedArraysEqual: areTypedArraysEqual2, areUrlsEqual: areUrlsEqual2, unknownTagComparators }) {
  return function comparator(a, b, state) {
    if (a === b) {
      return true;
    }
    if (a == null || b == null) {
      return false;
    }
    const type = typeof a;
    if (type !== typeof b) {
      return false;
    }
    if (type !== "object") {
      if (type === "number") {
        return areNumbersEqual2(a, b, state);
      }
      if (type === "function") {
        return areFunctionsEqual2(a, b, state);
      }
      return false;
    }
    const constructor = a.constructor;
    if (constructor !== b.constructor) {
      return false;
    }
    if (constructor === Object) {
      return areObjectsEqual2(a, b, state);
    }
    if (Array.isArray(a)) {
      return areArraysEqual2(a, b, state);
    }
    if (constructor === Date) {
      return areDatesEqual2(a, b, state);
    }
    if (constructor === RegExp) {
      return areRegExpsEqual2(a, b, state);
    }
    if (constructor === Map) {
      return areMapsEqual2(a, b, state);
    }
    if (constructor === Set) {
      return areSetsEqual2(a, b, state);
    }
    const tag = toString.call(a);
    if (tag === DATE_TAG) {
      return areDatesEqual2(a, b, state);
    }
    if (tag === REG_EXP_TAG) {
      return areRegExpsEqual2(a, b, state);
    }
    if (tag === MAP_TAG) {
      return areMapsEqual2(a, b, state);
    }
    if (tag === SET_TAG) {
      return areSetsEqual2(a, b, state);
    }
    if (tag === OBJECT_TAG) {
      return typeof a.then !== "function" && typeof b.then !== "function" && areObjectsEqual2(a, b, state);
    }
    if (tag === URL_TAG) {
      return areUrlsEqual2(a, b, state);
    }
    if (tag === ERROR_TAG) {
      return areErrorsEqual2(a, b, state);
    }
    if (tag === ARGUMENTS_TAG) {
      return areObjectsEqual2(a, b, state);
    }
    if (TYPED_ARRAY_TAGS[tag]) {
      return areTypedArraysEqual2(a, b, state);
    }
    if (tag === ARRAY_BUFFER_TAG) {
      return areArrayBuffersEqual2(a, b, state);
    }
    if (tag === DATA_VIEW_TAG) {
      return areDataViewsEqual2(a, b, state);
    }
    if (tag === BOOLEAN_TAG || tag === NUMBER_TAG || tag === STRING_TAG) {
      return arePrimitiveWrappersEqual2(a, b, state);
    }
    if (unknownTagComparators) {
      let unknownTagComparator = unknownTagComparators[tag];
      if (!unknownTagComparator) {
        const shortTag = getShortTag(a);
        if (shortTag) {
          unknownTagComparator = unknownTagComparators[shortTag];
        }
      }
      if (unknownTagComparator) {
        return unknownTagComparator(a, b, state);
      }
    }
    return false;
  };
}
function createEqualityComparatorConfig({ circular, createCustomConfig, strict }) {
  let config = {
    areArrayBuffersEqual,
    areArraysEqual: strict ? areObjectsEqualStrict : areArraysEqual,
    areDataViewsEqual,
    areDatesEqual,
    areErrorsEqual,
    areFunctionsEqual,
    areMapsEqual: strict ? combineComparators(areMapsEqual, areObjectsEqualStrict) : areMapsEqual,
    areNumbersEqual,
    areObjectsEqual: strict ? areObjectsEqualStrict : areObjectsEqual,
    arePrimitiveWrappersEqual,
    areRegExpsEqual,
    areSetsEqual: strict ? combineComparators(areSetsEqual, areObjectsEqualStrict) : areSetsEqual,
    areTypedArraysEqual: strict ? combineComparators(areTypedArraysEqual, areObjectsEqualStrict) : areTypedArraysEqual,
    areUrlsEqual,
    unknownTagComparators: void 0
  };
  if (createCustomConfig) {
    config = Object.assign({}, config, createCustomConfig(config));
  }
  if (circular) {
    const areArraysEqual2 = createIsCircular(config.areArraysEqual);
    const areMapsEqual2 = createIsCircular(config.areMapsEqual);
    const areObjectsEqual2 = createIsCircular(config.areObjectsEqual);
    const areSetsEqual2 = createIsCircular(config.areSetsEqual);
    config = Object.assign({}, config, {
      areArraysEqual: areArraysEqual2,
      areMapsEqual: areMapsEqual2,
      areObjectsEqual: areObjectsEqual2,
      areSetsEqual: areSetsEqual2
    });
  }
  return config;
}
function createInternalEqualityComparator(compare) {
  return function(a, b, _indexOrKeyA, _indexOrKeyB, _parentA, _parentB, state) {
    return compare(a, b, state);
  };
}
function createIsEqual({ circular, comparator, createState, equals, strict }) {
  if (createState) {
    return function isEqual(a, b) {
      const { cache = circular ? /* @__PURE__ */ new WeakMap() : void 0, meta } = createState();
      return comparator(a, b, {
        cache,
        equals,
        meta,
        strict
      });
    };
  }
  if (circular) {
    return function isEqual(a, b) {
      return comparator(a, b, {
        cache: /* @__PURE__ */ new WeakMap(),
        equals,
        meta: void 0,
        strict
      });
    };
  }
  const state = {
    cache: void 0,
    equals,
    meta: void 0,
    strict
  };
  return function isEqual(a, b) {
    return comparator(a, b, state);
  };
}
var deepEqual = createCustomEqual();
var strictDeepEqual = createCustomEqual({ strict: true });
var circularDeepEqual = createCustomEqual({ circular: true });
var strictCircularDeepEqual = createCustomEqual({
  circular: true,
  strict: true
});
var shallowEqual = createCustomEqual({
  createInternalComparator: () => sameValueZeroEqual
});
var strictShallowEqual = createCustomEqual({
  strict: true,
  createInternalComparator: () => sameValueZeroEqual
});
var circularShallowEqual = createCustomEqual({
  circular: true,
  createInternalComparator: () => sameValueZeroEqual
});
var strictCircularShallowEqual = createCustomEqual({
  circular: true,
  createInternalComparator: () => sameValueZeroEqual,
  strict: true
});
function createCustomEqual(options = {}) {
  const { circular = false, createInternalComparator: createCustomInternalComparator, createState, strict = false } = options;
  const config = createEqualityComparatorConfig(options);
  const comparator = createEqualityComparator(config);
  const equals = createCustomInternalComparator ? createCustomInternalComparator(comparator) : createInternalEqualityComparator(comparator);
  return createIsEqual({ circular, comparator, createState, equals, strict });
}

// node_modules/@tiptap/react/dist/index.js
var import_react4 = __toESM(require_react());
var import_with_selector = __toESM(require_with_selector());
var import_jsx_runtime2 = __toESM(require_jsx_runtime());
var import_react5 = __toESM(require_react());
var import_jsx_runtime3 = __toESM(require_jsx_runtime());
var import_react6 = __toESM(require_react());
var import_jsx_runtime4 = __toESM(require_jsx_runtime());
var import_react7 = __toESM(require_react());
var import_react8 = __toESM(require_react());
var import_react_dom2 = __toESM(require_react_dom());
var import_jsx_runtime5 = __toESM(require_jsx_runtime());
var import_jsx_runtime6 = __toESM(require_jsx_runtime());
var import_react9 = __toESM(require_react());
var import_jsx_runtime7 = __toESM(require_jsx_runtime());
var import_react10 = __toESM(require_react());
var import_jsx_runtime8 = __toESM(require_jsx_runtime());
var mergeRefs = (...refs) => {
  return (node) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        ;
        ref.current = node;
      }
    });
  };
};
var Portals = ({ contentComponent }) => {
  const renderers = (0, import_shim.useSyncExternalStore)(
    contentComponent.subscribe,
    contentComponent.getSnapshot,
    contentComponent.getServerSnapshot
  );
  return (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: Object.values(renderers) });
};
function getInstance() {
  const subscribers = /* @__PURE__ */ new Set();
  let renderers = {};
  return {
    /**
     * Subscribe to the editor instance's changes.
     */
    subscribe(callback) {
      subscribers.add(callback);
      return () => {
        subscribers.delete(callback);
      };
    },
    getSnapshot() {
      return renderers;
    },
    getServerSnapshot() {
      return renderers;
    },
    /**
     * Adds a new NodeView Renderer to the editor.
     */
    setRenderer(id, renderer) {
      renderers = {
        ...renderers,
        [id]: import_react_dom.default.createPortal(renderer.reactElement, renderer.element, id)
      };
      subscribers.forEach((subscriber) => subscriber());
    },
    /**
     * Removes a NodeView Renderer from the editor.
     */
    removeRenderer(id) {
      const nextRenderers = { ...renderers };
      delete nextRenderers[id];
      renderers = nextRenderers;
      subscribers.forEach((subscriber) => subscriber());
    }
  };
}
var PureEditorContent = class extends import_react2.default.Component {
  constructor(props) {
    super(props);
    this.editorContentRef = import_react2.default.createRef();
  }
  componentDidMount() {
    this.init();
  }
  componentDidUpdate() {
    this.init();
  }
  init() {
    var _a;
    const editor = this.props.editor;
    if (editor && !editor.isDestroyed && ((_a = editor.view.dom) == null ? void 0 : _a.parentNode)) {
      if (editor.contentComponent) {
        return;
      }
      const element = this.editorContentRef.current;
      element.append(...editor.view.dom.parentNode.childNodes);
      editor.setOptions({
        element
      });
      editor.contentComponent = getInstance();
      editor.createNodeViews();
      editor.isEditorContentInitialized = true;
      this.forceUpdate();
    }
  }
  componentWillUnmount() {
    var _a;
    const editor = this.props.editor;
    if (!editor) {
      return;
    }
    editor.isEditorContentInitialized = false;
    if (!editor.isDestroyed) {
      editor.view.setProps({
        nodeViews: {}
      });
    }
    editor.contentComponent = null;
    try {
      if (!((_a = editor.view.dom) == null ? void 0 : _a.parentNode)) {
        return;
      }
      const newElement = document.createElement("div");
      newElement.append(...editor.view.dom.parentNode.childNodes);
      editor.setOptions({
        element: newElement
      });
    } catch {
    }
  }
  render() {
    const { editor, innerRef, ...rest } = this.props;
    return (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
      (0, import_jsx_runtime.jsx)("div", { ref: mergeRefs(innerRef, this.editorContentRef), ...rest }),
      (editor == null ? void 0 : editor.contentComponent) && (0, import_jsx_runtime.jsx)(Portals, { contentComponent: editor.contentComponent })
    ] });
  }
};
var EditorContentWithKey = (0, import_react2.forwardRef)(
  (props, ref) => {
    const key = import_react2.default.useMemo(() => {
      return Math.floor(Math.random() * 4294967295).toString();
    }, [props.editor]);
    return import_react2.default.createElement(PureEditorContent, {
      key,
      innerRef: ref,
      ...props
    });
  }
);
var EditorContent = import_react2.default.memo(EditorContentWithKey);
var useIsomorphicLayoutEffect = typeof window !== "undefined" ? import_react4.useLayoutEffect : import_react4.useEffect;
var EditorStateManager = class {
  constructor(initialEditor) {
    this.transactionNumber = 0;
    this.lastTransactionNumber = 0;
    this.subscribers = /* @__PURE__ */ new Set();
    this.editor = initialEditor;
    this.lastSnapshot = { editor: initialEditor, transactionNumber: 0 };
    this.getSnapshot = this.getSnapshot.bind(this);
    this.getServerSnapshot = this.getServerSnapshot.bind(this);
    this.watch = this.watch.bind(this);
    this.subscribe = this.subscribe.bind(this);
  }
  /**
   * Get the current editor instance.
   */
  getSnapshot() {
    if (this.transactionNumber === this.lastTransactionNumber) {
      return this.lastSnapshot;
    }
    this.lastTransactionNumber = this.transactionNumber;
    this.lastSnapshot = { editor: this.editor, transactionNumber: this.transactionNumber };
    return this.lastSnapshot;
  }
  /**
   * Always disable the editor on the server-side.
   */
  getServerSnapshot() {
    return { editor: null, transactionNumber: 0 };
  }
  /**
   * Subscribe to the editor instance's changes.
   */
  subscribe(callback) {
    this.subscribers.add(callback);
    return () => {
      this.subscribers.delete(callback);
    };
  }
  /**
   * Watch the editor instance for changes.
   */
  watch(nextEditor) {
    this.editor = nextEditor;
    if (this.editor) {
      const fn = () => {
        this.transactionNumber += 1;
        this.subscribers.forEach((callback) => callback());
      };
      const currentEditor = this.editor;
      currentEditor.on("transaction", fn);
      return () => {
        currentEditor.off("transaction", fn);
      };
    }
    return void 0;
  }
};
function useEditorState(options) {
  var _a;
  const [editorStateManager] = (0, import_react4.useState)(() => new EditorStateManager(options.editor));
  const selectedState = (0, import_with_selector.useSyncExternalStoreWithSelector)(
    editorStateManager.subscribe,
    editorStateManager.getSnapshot,
    editorStateManager.getServerSnapshot,
    options.selector,
    (_a = options.equalityFn) != null ? _a : deepEqual
  );
  useIsomorphicLayoutEffect(() => {
    return editorStateManager.watch(options.editor);
  }, [options.editor, editorStateManager]);
  (0, import_react4.useDebugValue)(selectedState);
  return selectedState;
}
var isDev = true;
var isSSR = typeof window === "undefined";
var isNext = isSSR || Boolean(typeof window !== "undefined" && window.next);
var EditorInstanceManager = class _EditorInstanceManager {
  constructor(options) {
    this.editor = null;
    this.subscriptions = /* @__PURE__ */ new Set();
    this.isComponentMounted = false;
    this.previousDeps = null;
    this.instanceId = "";
    this.options = options;
    this.subscriptions = /* @__PURE__ */ new Set();
    this.setEditor(this.getInitialEditor());
    this.scheduleDestroy();
    this.getEditor = this.getEditor.bind(this);
    this.getServerSnapshot = this.getServerSnapshot.bind(this);
    this.subscribe = this.subscribe.bind(this);
    this.refreshEditorInstance = this.refreshEditorInstance.bind(this);
    this.scheduleDestroy = this.scheduleDestroy.bind(this);
    this.onRender = this.onRender.bind(this);
    this.createEditor = this.createEditor.bind(this);
  }
  setEditor(editor) {
    this.editor = editor;
    this.instanceId = Math.random().toString(36).slice(2, 9);
    this.subscriptions.forEach((cb) => cb());
  }
  getInitialEditor() {
    const explicit = this.options.current.immediatelyRender;
    let immediatelyRender = explicit != null ? explicit : true;
    if (isSSR) {
      if (immediatelyRender && isDev) {
        console.warn(
          "SSR detected. `immediatelyRender` has been set to false to avoid hydration mismatches"
        );
      }
      immediatelyRender = false;
    } else if (isNext && explicit === void 0) {
      immediatelyRender = false;
      if (isDev) {
        console.warn(
          "Next.js detected. `immediatelyRender` defaults to false to avoid hydration mismatches. Pass `immediatelyRender: true` explicitly if you are rendering the editor only on the client."
        );
      }
    }
    return immediatelyRender ? this.createEditor() : null;
  }
  /**
   * Create a new editor instance. And attach event listeners.
   */
  createEditor() {
    const optionsToApply = {
      ...this.options.current,
      // Always call the most recent version of the callback function by default
      onBeforeCreate: (...args) => {
        var _a, _b;
        return (_b = (_a = this.options.current).onBeforeCreate) == null ? void 0 : _b.call(_a, ...args);
      },
      onBlur: (...args) => {
        var _a, _b;
        return (_b = (_a = this.options.current).onBlur) == null ? void 0 : _b.call(_a, ...args);
      },
      onCreate: (...args) => {
        var _a, _b;
        return (_b = (_a = this.options.current).onCreate) == null ? void 0 : _b.call(_a, ...args);
      },
      onDestroy: (...args) => {
        var _a, _b;
        return (_b = (_a = this.options.current).onDestroy) == null ? void 0 : _b.call(_a, ...args);
      },
      onFocus: (...args) => {
        var _a, _b;
        return (_b = (_a = this.options.current).onFocus) == null ? void 0 : _b.call(_a, ...args);
      },
      onSelectionUpdate: (...args) => {
        var _a, _b;
        return (_b = (_a = this.options.current).onSelectionUpdate) == null ? void 0 : _b.call(_a, ...args);
      },
      onTransaction: (...args) => {
        var _a, _b;
        return (_b = (_a = this.options.current).onTransaction) == null ? void 0 : _b.call(_a, ...args);
      },
      onUpdate: (...args) => {
        var _a, _b;
        return (_b = (_a = this.options.current).onUpdate) == null ? void 0 : _b.call(_a, ...args);
      },
      onContentError: (...args) => {
        var _a, _b;
        return (_b = (_a = this.options.current).onContentError) == null ? void 0 : _b.call(_a, ...args);
      },
      onDrop: (...args) => {
        var _a, _b;
        return (_b = (_a = this.options.current).onDrop) == null ? void 0 : _b.call(_a, ...args);
      },
      onPaste: (...args) => {
        var _a, _b;
        return (_b = (_a = this.options.current).onPaste) == null ? void 0 : _b.call(_a, ...args);
      },
      onDelete: (...args) => {
        var _a, _b;
        return (_b = (_a = this.options.current).onDelete) == null ? void 0 : _b.call(_a, ...args);
      }
    };
    const editor = new Editor(optionsToApply);
    return editor;
  }
  /**
   * Get the current editor instance.
   */
  getEditor() {
    return this.editor;
  }
  /**
   * Always disable the editor on the server-side.
   */
  getServerSnapshot() {
    return null;
  }
  /**
   * Subscribe to the editor instance's changes.
   */
  subscribe(onStoreChange) {
    this.subscriptions.add(onStoreChange);
    return () => {
      this.subscriptions.delete(onStoreChange);
    };
  }
  static compareOptions(a, b) {
    return Object.keys(a).every((key) => {
      if ([
        "onCreate",
        "onBeforeCreate",
        "onDestroy",
        "onUpdate",
        "onTransaction",
        "onFocus",
        "onBlur",
        "onSelectionUpdate",
        "onContentError",
        "onDrop",
        "onPaste"
      ].includes(key)) {
        return true;
      }
      if (key === "extensions" && a.extensions && b.extensions) {
        if (a.extensions.length !== b.extensions.length) {
          return false;
        }
        return a.extensions.every((extension, index) => {
          var _a;
          if (extension !== ((_a = b.extensions) == null ? void 0 : _a[index])) {
            return false;
          }
          return true;
        });
      }
      if (a[key] !== b[key]) {
        return false;
      }
      return true;
    });
  }
  /**
   * On each render, we will create, update, or destroy the editor instance.
   * @param deps The dependencies to watch for changes
   * @returns A cleanup function
   */
  onRender(deps) {
    return () => {
      this.isComponentMounted = true;
      clearTimeout(this.scheduledDestructionTimeout);
      if (this.editor && !this.editor.isDestroyed && deps.length === 0) {
        if (!_EditorInstanceManager.compareOptions(this.options.current, this.editor.options)) {
          this.editor.setOptions({
            ...this.options.current,
            editable: this.editor.isEditable
          });
        }
      } else {
        this.refreshEditorInstance(deps);
      }
      return () => {
        this.isComponentMounted = false;
        this.scheduleDestroy();
      };
    };
  }
  /**
   * Recreate the editor instance if the dependencies have changed.
   */
  refreshEditorInstance(deps) {
    if (this.editor && !this.editor.isDestroyed) {
      if (this.previousDeps === null) {
        this.previousDeps = deps;
        return;
      }
      const depsAreEqual = this.previousDeps.length === deps.length && this.previousDeps.every((dep, index) => dep === deps[index]);
      if (depsAreEqual) {
        return;
      }
    }
    if (this.editor && !this.editor.isDestroyed) {
      this.editor.destroy();
    }
    this.setEditor(this.createEditor());
    this.previousDeps = deps;
  }
  /**
   * Schedule the destruction of the editor instance.
   * This will only destroy the editor if it was not mounted on the next tick.
   * This is to avoid destroying the editor instance when it's actually still mounted.
   */
  scheduleDestroy() {
    const currentInstanceId = this.instanceId;
    const currentEditor = this.editor;
    this.scheduledDestructionTimeout = setTimeout(() => {
      if (this.isComponentMounted && this.instanceId === currentInstanceId) {
        if (currentEditor) {
          currentEditor.setOptions(this.options.current);
        }
        return;
      }
      if (currentEditor && !currentEditor.isDestroyed) {
        currentEditor.destroy();
        if (this.instanceId === currentInstanceId) {
          this.setEditor(null);
        }
      }
    }, 1);
  }
};
function useEditor(options = {}, deps = []) {
  const mostRecentOptions = (0, import_react3.useRef)(options);
  mostRecentOptions.current = options;
  const [instanceManager] = (0, import_react3.useState)(() => new EditorInstanceManager(mostRecentOptions));
  const editor = (0, import_shim2.useSyncExternalStore)(
    instanceManager.subscribe,
    instanceManager.getEditor,
    instanceManager.getServerSnapshot
  );
  (0, import_react3.useDebugValue)(editor);
  (0, import_react3.useEffect)(instanceManager.onRender(deps));
  useEditorState({
    editor,
    selector: ({ transactionNumber }) => {
      if (options.shouldRerenderOnTransaction === false || options.shouldRerenderOnTransaction === void 0) {
        return null;
      }
      if (options.immediatelyRender && transactionNumber === 0) {
        return 0;
      }
      return transactionNumber + 1;
    }
  });
  return editor;
}
var EditorContext = (0, import_react.createContext)({
  editor: null
});
var EditorConsumer = EditorContext.Consumer;
var useCurrentEditor = () => (0, import_react.useContext)(EditorContext);
function EditorProvider({
  children,
  slotAfter,
  slotBefore,
  editorContainerProps = {},
  ...editorOptions
}) {
  const editor = useEditor(editorOptions);
  const contextValue = (0, import_react.useMemo)(() => ({ editor }), [editor]);
  if (!editor) {
    return null;
  }
  return (0, import_jsx_runtime2.jsxs)(EditorContext.Provider, { value: contextValue, children: [
    slotBefore,
    (0, import_jsx_runtime2.jsx)(EditorConsumer, { children: ({ editor: currentEditor }) => (0, import_jsx_runtime2.jsx)(EditorContent, { editor: currentEditor, ...editorContainerProps }) }),
    children,
    slotAfter
  ] });
}
var ReactNodeViewContext = (0, import_react5.createContext)({
  onDragStart: () => {
  },
  nodeViewContentChildren: void 0,
  nodeViewContentRef: () => {
  }
});
var ReactNodeViewContentProvider = ({
  children,
  content
}) => {
  return (0, import_react5.createElement)(
    ReactNodeViewContext.Provider,
    { value: { nodeViewContentChildren: content } },
    children
  );
};
var useReactNodeView = () => (0, import_react5.useContext)(ReactNodeViewContext);
function NodeViewContent({
  as: Tag = "div",
  ...props
}) {
  const { nodeViewContentRef, nodeViewContentChildren } = useReactNodeView();
  return (
    // @ts-ignore
    (0, import_jsx_runtime3.jsx)(
      Tag,
      {
        ...props,
        ref: nodeViewContentRef,
        "data-node-view-content": "",
        style: {
          whiteSpace: "pre-wrap",
          ...props.style
        },
        children: nodeViewContentChildren
      }
    )
  );
}
var NodeViewWrapper = import_react6.default.forwardRef((props, ref) => {
  const { onDragStart } = useReactNodeView();
  const Tag = props.as || "div";
  return (
    // @ts-ignore
    (0, import_jsx_runtime4.jsx)(
      Tag,
      {
        ...props,
        ref,
        "data-node-view-wrapper": "",
        onDragStart,
        style: {
          whiteSpace: "normal",
          ...props.style
        }
      }
    )
  );
});
function isClassComponent(Component) {
  return !!(typeof Component === "function" && Component.prototype && Component.prototype.isReactComponent);
}
function isForwardRefComponent(Component) {
  return !!(typeof Component === "object" && Component.$$typeof && (Component.$$typeof.toString() === "Symbol(react.forward_ref)" || Component.$$typeof.description === "react.forward_ref"));
}
function isMemoComponent(Component) {
  return !!(typeof Component === "object" && Component.$$typeof && (Component.$$typeof.toString() === "Symbol(react.memo)" || Component.$$typeof.description === "react.memo"));
}
function canReceiveRef(Component) {
  if (isClassComponent(Component)) {
    return true;
  }
  if (isForwardRefComponent(Component)) {
    return true;
  }
  if (isMemoComponent(Component)) {
    const wrappedComponent = Component.type;
    if (wrappedComponent) {
      return isClassComponent(wrappedComponent) || isForwardRefComponent(wrappedComponent);
    }
  }
  return false;
}
function isReact19Plus() {
  try {
    if (import_react8.version) {
      const majorVersion = parseInt(import_react8.version.split(".")[0], 10);
      return majorVersion >= 19;
    }
  } catch {
  }
  return false;
}
var ReactRenderer = class {
  /**
   * Immediately creates element and renders the provided React component.
   */
  constructor(component, { editor, props = {}, as = "div", className = "" }) {
    this.ref = null;
    this.destroyed = false;
    this.id = Math.floor(Math.random() * 4294967295).toString();
    this.component = component;
    this.editor = editor;
    this.props = props;
    this.element = document.createElement(as);
    this.element.classList.add("react-renderer");
    if (className) {
      this.element.classList.add(...className.split(" "));
    }
    if (this.editor.isEditorContentInitialized) {
      (0, import_react_dom2.flushSync)(() => {
        this.render();
      });
    } else {
      queueMicrotask(() => {
        if (this.destroyed) {
          return;
        }
        this.render();
      });
    }
  }
  /**
   * Render the React component.
   */
  render() {
    var _a;
    if (this.destroyed) {
      return;
    }
    const Component = this.component;
    const props = this.props;
    const editor = this.editor;
    const isReact19 = isReact19Plus();
    const componentCanReceiveRef = canReceiveRef(Component);
    const elementProps = { ...props };
    if (elementProps.ref && !(isReact19 || componentCanReceiveRef)) {
      delete elementProps.ref;
    }
    if (!elementProps.ref && (isReact19 || componentCanReceiveRef)) {
      elementProps.ref = (ref) => {
        this.ref = ref;
      };
    }
    this.reactElement = (0, import_jsx_runtime5.jsx)(Component, { ...elementProps });
    (_a = editor == null ? void 0 : editor.contentComponent) == null ? void 0 : _a.setRenderer(this.id, this);
  }
  /**
   * Re-renders the React component with new props.
   * Skips the render if none of the supplied props actually changed,
   * to avoid unnecessary portal re-creation.
   */
  updateProps(props = {}) {
    if (this.destroyed) {
      return;
    }
    let changed = false;
    const keys2 = Object.keys(props);
    for (let i = 0; i < keys2.length; i += 1) {
      const key = keys2[i];
      if (props[key] !== this.props[key]) {
        changed = true;
        break;
      }
    }
    if (!changed) {
      return;
    }
    this.props = {
      ...this.props,
      ...props
    };
    this.render();
  }
  /**
   * Destroy the React component.
   */
  destroy() {
    var _a;
    this.destroyed = true;
    const editor = this.editor;
    (_a = editor == null ? void 0 : editor.contentComponent) == null ? void 0 : _a.removeRenderer(this.id);
    try {
      if (this.element && this.element.parentNode) {
        this.element.parentNode.removeChild(this.element);
      }
    } catch {
    }
  }
  /**
   * Update the attributes of the element that holds the React component.
   */
  updateAttributes(attributes) {
    Object.keys(attributes).forEach((key) => {
      this.element.setAttribute(key, attributes[key]);
    });
  }
};
var ReactMarkViewContext = import_react7.default.createContext({
  markViewContentRef: () => {
  }
});
var MarkViewContent = (props) => {
  const { as: Tag = "span", ...rest } = props;
  const { markViewContentRef } = import_react7.default.useContext(ReactMarkViewContext);
  return (
    // @ts-ignore
    (0, import_jsx_runtime6.jsx)(Tag, { ...rest, ref: markViewContentRef, "data-mark-view-content": "" })
  );
};
var ReactMarkView = class extends MarkView {
  constructor(component, props, options) {
    super(component, props, options);
    const { as = "span", attrs, className = "" } = options || {};
    const componentProps = {
      ...props,
      updateAttributes: this.updateAttributes.bind(this)
    };
    this.contentDOMElement = document.createElement("span");
    const markViewContentRef = (el) => {
      if (el && !el.contains(this.contentDOMElement)) {
        el.appendChild(this.contentDOMElement);
      }
    };
    const context = {
      markViewContentRef
    };
    const ReactMarkViewProvider = import_react7.default.memo(
      (componentProps2) => {
        return (0, import_jsx_runtime6.jsx)(ReactMarkViewContext.Provider, { value: context, children: import_react7.default.createElement(component, componentProps2) });
      }
    );
    ReactMarkViewProvider.displayName = "ReactMarkView";
    this.renderer = new ReactRenderer(ReactMarkViewProvider, {
      editor: props.editor,
      props: componentProps,
      as,
      className: `mark-${props.mark.type.name} ${className}`.trim()
    });
    if (attrs) {
      this.renderer.updateAttributes(attrs);
    }
  }
  get dom() {
    return this.renderer.element;
  }
  get contentDOM() {
    return this.contentDOMElement;
  }
};
function ReactMarkViewRenderer(component, options = {}) {
  return (props) => new ReactMarkView(component, props, options);
}
var ReactNodeView = class extends NodeView {
  constructor(component, props, options) {
    super(component, props, options);
    this.selectionRafId = null;
    this.handlePositionUpdate = () => {
      const newPos = this.getPos();
      if (typeof newPos !== "number" || newPos === this.currentPos) {
        return;
      }
      this.currentPos = newPos;
      this.renderer.updateProps({ getPos: () => this.getPos() });
      if (typeof this.options.attrs === "function") {
        this.updateElementAttributes();
      }
    };
    this.cachedExtensionWithSyncedStorage = null;
    if (!this.node.isLeaf) {
      if (this.options.contentDOMElementTag) {
        this.contentDOMElement = document.createElement(this.options.contentDOMElementTag);
      } else {
        this.contentDOMElement = document.createElement(this.node.isInline ? "span" : "div");
      }
      this.contentDOMElement.dataset.nodeViewContentReact = "";
      this.contentDOMElement.dataset.nodeViewWrapper = "";
      this.contentDOMElement.style.whiteSpace = "inherit";
      const contentTarget = this.dom.querySelector("[data-node-view-content]");
      if (!contentTarget) {
        return;
      }
      contentTarget.appendChild(this.contentDOMElement);
    }
    if (this.options.trackNodeViewPosition) {
      this.editor.on("update", this.handlePositionUpdate);
    }
  }
  /**
   * Returns a proxy of the extension that redirects storage access to the editor's mutable storage.
   * This preserves the original prototype chain (instanceof checks, methods like configure/extend work).
   * Cached to avoid proxy creation on every update.
   */
  get extensionWithSyncedStorage() {
    if (!this.cachedExtensionWithSyncedStorage) {
      const editor = this.editor;
      const extension = this.extension;
      this.cachedExtensionWithSyncedStorage = new Proxy(extension, {
        get(target, prop, receiver) {
          var _a;
          if (prop === "storage") {
            return (_a = editor.storage[extension.name]) != null ? _a : {};
          }
          return Reflect.get(target, prop, receiver);
        }
      });
    }
    return this.cachedExtensionWithSyncedStorage;
  }
  /**
   * Setup the React component.
   * Called on initialization.
   */
  mount() {
    const props = {
      editor: this.editor,
      node: this.node,
      decorations: this.decorations,
      innerDecorations: this.innerDecorations,
      view: this.view,
      selected: false,
      extension: this.extensionWithSyncedStorage,
      HTMLAttributes: this.HTMLAttributes,
      getPos: () => this.getPos(),
      updateAttributes: (attributes = {}) => this.updateAttributes(attributes),
      deleteNode: () => this.deleteNode(),
      ref: (0, import_react9.createRef)()
    };
    const mountProps = props;
    if (!this.component.displayName) {
      const capitalizeFirstChar = (string) => {
        return string.charAt(0).toUpperCase() + string.substring(1);
      };
      this.component.displayName = capitalizeFirstChar(this.extension.name);
    }
    const onDragStart = this.onDragStart.bind(this);
    const nodeViewContentRef = (element) => {
      if (element && this.contentDOMElement && element.firstChild !== this.contentDOMElement) {
        if (element.hasAttribute("data-node-view-wrapper")) {
          element.removeAttribute("data-node-view-wrapper");
        }
        element.appendChild(this.contentDOMElement);
      }
    };
    const context = { onDragStart, nodeViewContentRef };
    const Component = this.component;
    const ReactNodeViewProvider = (0, import_react9.memo)(
      (componentProps) => {
        return (0, import_jsx_runtime7.jsx)(ReactNodeViewContext.Provider, { value: context, children: (0, import_react9.createElement)(Component, componentProps) });
      }
    );
    ReactNodeViewProvider.displayName = "ReactNodeView";
    let as = this.node.isInline ? "span" : "div";
    if (this.options.as) {
      as = this.options.as;
    }
    const { className = "" } = this.options;
    this.handleSelectionUpdate = this.handleSelectionUpdate.bind(this);
    this.renderer = new ReactRenderer(ReactNodeViewProvider, {
      editor: this.editor,
      props: mountProps,
      as,
      className: `node-${this.node.type.name} ${className}`.trim()
    });
    this.editor.on("selectionUpdate", this.handleSelectionUpdate);
    this.updateElementAttributes();
    this.currentPos = this.getPos();
  }
  /**
   * Return the DOM element.
   * This is the element that will be used to display the node view.
   */
  get dom() {
    var _a;
    if (this.renderer.element.firstElementChild && !((_a = this.renderer.element.firstElementChild) == null ? void 0 : _a.hasAttribute("data-node-view-wrapper"))) {
      throw Error("Please use the NodeViewWrapper component for your node view.");
    }
    return this.renderer.element;
  }
  /**
   * Return the content DOM element.
   * This is the element that will be used to display the rich-text content of the node.
   */
  get contentDOM() {
    if (this.node.isLeaf) {
      return null;
    }
    return this.contentDOMElement;
  }
  /**
   * On editor selection update, check if the node is selected.
   * If it is, call `selectNode`, otherwise call `deselectNode`.
   */
  handleSelectionUpdate() {
    if (this.selectionRafId) {
      cancelAnimationFrame(this.selectionRafId);
      this.selectionRafId = null;
    }
    this.selectionRafId = requestAnimationFrame(() => {
      this.selectionRafId = null;
      const pos = this.currentPos;
      if (typeof pos !== "number") {
        return;
      }
      const isSelected = isNodeViewSelected({
        selection: this.editor.state.selection,
        pos,
        nodeSize: this.node.nodeSize,
        selectedOnTextSelection: this.options.selectedOnTextSelection
      });
      if (isSelected) {
        if (this.renderer.props.selected) {
          return;
        }
        this.selectNode();
      } else {
        if (!this.renderer.props.selected) {
          return;
        }
        this.deselectNode();
      }
    });
  }
  /**
   * On update, update the React component.
   * To prevent unnecessary updates, the `update` option can be used.
   */
  update(node, decorations, innerDecorations) {
    const rerenderComponent = (props) => {
      this.renderer.updateProps(props);
      if (typeof this.options.attrs === "function") {
        this.updateElementAttributes();
      }
    };
    if (node.type !== this.node.type) {
      return false;
    }
    if (typeof this.options.update === "function") {
      const oldNode = this.node;
      const oldDecorations = this.decorations;
      const oldInnerDecorations = this.innerDecorations;
      this.node = node;
      this.decorations = decorations;
      this.innerDecorations = innerDecorations;
      this.currentPos = this.getPos();
      return this.options.update({
        oldNode,
        oldDecorations,
        newNode: node,
        newDecorations: decorations,
        oldInnerDecorations,
        innerDecorations,
        updateProps: () => rerenderComponent({
          node,
          decorations,
          innerDecorations,
          extension: this.extensionWithSyncedStorage
        })
      });
    }
    const nodeChanged = node !== this.node;
    if (!nodeChanged) {
      this.node = node;
      this.decorations = decorations;
      this.innerDecorations = innerDecorations;
      return true;
    }
    const newPos = this.getPos();
    this.node = node;
    this.decorations = decorations;
    this.innerDecorations = innerDecorations;
    this.currentPos = newPos;
    const extraProps = {
      node,
      decorations,
      innerDecorations,
      extension: this.extensionWithSyncedStorage
    };
    if (this.options.trackNodeViewPosition) {
      extraProps.getPos = () => this.getPos();
    }
    rerenderComponent(extraProps);
    return true;
  }
  /**
   * Select the node.
   * Add the `selected` prop and the `ProseMirror-selectednode` class.
   */
  selectNode() {
    this.renderer.updateProps({
      selected: true
    });
    this.renderer.element.classList.add("ProseMirror-selectednode");
  }
  /**
   * Deselect the node.
   * Remove the `selected` prop and the `ProseMirror-selectednode` class.
   */
  deselectNode() {
    this.renderer.updateProps({
      selected: false
    });
    this.renderer.element.classList.remove("ProseMirror-selectednode");
  }
  /**
   * Destroy the React component instance.
   */
  destroy() {
    this.renderer.destroy();
    this.editor.off("selectionUpdate", this.handleSelectionUpdate);
    if (this.options.trackNodeViewPosition) {
      this.editor.off("update", this.handlePositionUpdate);
    }
    this.contentDOMElement = null;
    if (this.selectionRafId) {
      cancelAnimationFrame(this.selectionRafId);
      this.selectionRafId = null;
    }
  }
  /**
   * Update the attributes of the top-level element that holds the React component.
   * Applying the attributes defined in the `attrs` option.
   */
  updateElementAttributes() {
    if (this.options.attrs) {
      let attrsObj = {};
      if (typeof this.options.attrs === "function") {
        const extensionAttributes = this.editor.extensionManager.attributes;
        const HTMLAttributes = getRenderedAttributes(this.node, extensionAttributes);
        attrsObj = this.options.attrs({ node: this.node, HTMLAttributes });
      } else {
        attrsObj = this.options.attrs;
      }
      this.renderer.updateAttributes(attrsObj);
    }
  }
};
function ReactNodeViewRenderer(component, options) {
  return (props) => {
    if (!props.editor.contentComponent) {
      return {};
    }
    return new ReactNodeView(component, props, options);
  };
}
var TiptapContext = (0, import_react10.createContext)({
  get editor() {
    throw new Error("useTiptap must be used within a <Tiptap> provider");
  }
});
TiptapContext.displayName = "TiptapContext";
var useTiptap = () => (0, import_react10.useContext)(TiptapContext);
function useTiptapState(selector, equalityFn) {
  const { editor } = useTiptap();
  return useEditorState({
    editor,
    selector,
    equalityFn
  });
}
function TiptapWrapper({ children, ...props }) {
  const resolvedEditor = "editor" in props ? props.editor : props.instance;
  if (!resolvedEditor) {
    throw new Error("Tiptap: An editor instance is required. Pass a non-null `editor` prop.");
  }
  const tiptapContextValue = (0, import_react10.useMemo)(
    () => ({ editor: resolvedEditor }),
    [resolvedEditor]
  );
  const legacyContextValue = (0, import_react10.useMemo)(() => ({ editor: resolvedEditor }), [resolvedEditor]);
  return (0, import_jsx_runtime8.jsx)(EditorContext.Provider, { value: legacyContextValue, children: (0, import_jsx_runtime8.jsx)(TiptapContext.Provider, { value: tiptapContextValue, children }) });
}
TiptapWrapper.displayName = "Tiptap";
function TiptapContent({ ...rest }) {
  const { editor } = useTiptap();
  return (0, import_jsx_runtime8.jsx)(EditorContent, { editor, ...rest });
}
TiptapContent.displayName = "Tiptap.Content";
var Tiptap = Object.assign(TiptapWrapper, {
  /**
   * The Tiptap Content component that renders the EditorContent with the editor instance from the context.
   * @see TiptapContent
   */
  Content: TiptapContent
});
export {
  CommandManager,
  Editor,
  EditorConsumer,
  EditorContent,
  EditorContext,
  EditorProvider,
  Extendable,
  Extension,
  Fragment6 as Fragment,
  InputRule,
  MappablePosition,
  Mark,
  MarkView,
  MarkViewContent,
  Node3 as Node,
  NodePos,
  NodeView,
  NodeViewContent,
  NodeViewWrapper,
  PasteRule,
  PureEditorContent,
  ReactMarkView,
  ReactMarkViewContext,
  ReactMarkViewRenderer,
  ReactNodeView,
  ReactNodeViewContentProvider,
  ReactNodeViewContext,
  ReactNodeViewRenderer,
  ReactRenderer,
  ResizableNodeView,
  ResizableNodeview,
  Tiptap,
  TiptapContent,
  TiptapContext,
  TiptapWrapper,
  Tracker,
  attrsEqual,
  callOrReturn,
  canInsertNode,
  combineTransactionSteps,
  commands_exports as commands,
  createAtomBlockMarkdownSpec,
  createBlockMarkdownSpec,
  createChainableState,
  createDocument,
  h as createElement,
  createInlineMarkdownSpec,
  createMappablePosition,
  createNodeFromContent,
  createStyleTag,
  decodeHtmlEntities,
  defaultBlockAt,
  deleteProps,
  elementFromString,
  encodeHtmlEntities,
  escapeForRegEx,
  extensions_exports as extensions,
  findChildren,
  findChildrenInRange,
  findDuplicates,
  findParentNode,
  findParentNodeClosestToPos,
  flattenExtensions,
  fromString,
  generateHTML,
  generateJSON,
  generateText,
  getAttributes,
  getAttributesFromExtensions,
  getChangedRanges,
  getDebugJSON,
  getExtensionField,
  getHTMLFromFragment,
  getMarkAttributes,
  getMarkRange,
  getMarkType,
  getMarksBetween,
  getNodeAtPosition,
  getNodeAttributes,
  getNodeType,
  getRenderedAttributes,
  getSchema,
  getSchemaByResolvedExtensions,
  getSchemaTypeByName,
  getSchemaTypeNameByName,
  getSplittedAttributes,
  getStyleProperty,
  getText,
  getTextBetween,
  getTextContentFromNodes,
  getTextSerializersFromSchema,
  getUpdatedPosition,
  h,
  injectExtensionAttributesToParseRule,
  inputRulesPlugin,
  isActive,
  isAndroid,
  isAtEndOfNode,
  isAtStartOfNode,
  isEmptyObject,
  isExtensionRulesEnabled,
  isFirefox,
  isFunction,
  isList,
  isMacOS,
  isMarkActive,
  isNodeActive,
  isNodeEmpty,
  isNodeSelection,
  isNodeViewSelected,
  isNumber,
  isPlainObject,
  isRegExp,
  isSafari,
  isString,
  isTextSelection,
  isiOS,
  markInputRule,
  markPasteRule,
  markdown_exports as markdown,
  marksEqual,
  mergeAttributes,
  mergeDeep,
  minMax,
  nodeInputRule,
  nodePasteRule,
  objectIncludes,
  parseAttributes,
  parseIndentedBlocks,
  pasteRulesPlugin,
  posToDOMRect,
  removeDuplicates,
  renderNestedMarkdownContent,
  resolveExtensions,
  resolveFocusPosition,
  rewriteUnknownContent,
  selectionToInsertionEnd,
  serializeAttributes,
  sortExtensions,
  splitExtensions,
  textInputRule,
  textPasteRule,
  textblockTypeInputRule,
  updateMarkViewAttributes,
  useCurrentEditor,
  useEditor,
  useEditorState,
  useReactNodeView,
  useTiptap,
  useTiptapState,
  wrappingInputRule
};
//# sourceMappingURL=@tiptap_react.js.map
