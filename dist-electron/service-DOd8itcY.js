import { _ as __exportAll, a as consumeCallback, b as awaitAllCallbacks, d as _CONTEXT_VARIABLES_KEY, M as MockAsyncLocalStorage, A as AsyncLocalStorageProviderSingleton, R as RunnableLambda, e as convertToChunk, i as isBaseMessageChunk, f as RemoveMessage, C as ChatMessageChunk, g as ChatMessage, F as FunctionMessageChunk, h as FunctionMessage, T as ToolMessageChunk, j as ToolMessage, S as SystemMessageChunk, k as SystemMessage, l as AIMessageChunk, m as AIMessage, H as HumanMessageChunk, n as HumanMessage, p as parseMimeType, o as parseBase64DataUrl, q as mergeUsageMetadata, r as mergeResponseMetadata, s as mergeContent, t as mapStoredMessagesToChatMessages, u as mapStoredMessageToChatMessage, v as mapChatMessagesToStoredMessages, w as isURLContentBlock, x as isToolMessageChunk, y as isToolMessage, z as isSystemMessageChunk, B as isSystemMessage, D as isPlainTextContentBlock, E as isOpenAIToolCallArray, G as isMessage, I as isIDContentBlock, J as isHumanMessageChunk, K as isHumanMessage, L as isFunctionMessageChunk, N as isFunctionMessage, O as isDirectToolOutput, P as isDataContentBlock, Q as isChatMessageChunk, U as isChatMessage, V as isBaseMessage, W as isBase64ContentBlock, X as isAIMessageChunk, Y as isAIMessage, Z as iife, $ as getBufferString, a0 as defaultToolCallParser, a1 as convertToProviderContentBlock, a2 as convertToOpenAIImageBlock, a3 as collapseToolCallChunks, a4 as coerceMessageLikeToMessage, a5 as _mergeStatus, a6 as _mergeObj, a7 as _mergeLists, a8 as _mergeDicts, a9 as _isMessageFieldWithRole, aa as DEFAULT_MERGE_IGNORE_KEYS, ab as BaseMessageChunk, ac as BaseMessage, ad as isZodSchemaV4, ae as isZodSchemaV3, af as isZodSchema, ag as isZodOptionalV4, ah as isZodObjectV4, ai as isZodObjectV3, aj as isZodNullableV4, ak as isZodLiteralV4, al as isZodLiteralV3, am as isZodArrayV4, an as isSimpleStringZodSchema, ao as isShapelessZodSchema, ap as isInteropZodSchema, aq as isInteropZodObject, ar as isInteropZodLiteral, as as isInteropZodError, at as interopZodTransformInputSchema, au as interopZodObjectStrict, av as interopZodObjectPassthrough, aw as interopZodObjectPartial, ax as interopZodObjectMakeFieldsOptional, ay as interopSafeParseAsync, az as interopSafeParse, aA as interopParseAsync, aB as interopParse, aC as getSchemaDescription, aD as getInteropZodObjectShape, aE as getInteropZodDefaultGetter, aF as extendInteropZodObject, aG as Runnable, aH as ensureConfig, aI as _coerceToRunnable, aJ as patchConfig, aK as getCallbackManagerForConfig, aL as _coerceToDict$1, aM as concat$1, aN as RunnableBinding, aO as RunnablePassthrough, aP as raceWithSignal, aQ as pickRunnableConfigKeys, aR as mergeConfigs, aS as RunnableWithFallbacks, aT as RunnableToolLike, aU as RunnableSequence, aV as RunnableRetry, aW as RunnablePick, aX as RunnableParallel, aY as RunnableMap, aZ as RunnableEach, a_ as RunnableAssign, a$ as BaseTransformOutputParser, b0 as OutputParserException, b1 as compare, b2 as applyPatch, b3 as sax, b4 as BaseCumulativeTransformOutputParser, b5 as parsePartialJson, b6 as parseJsonMarkdown, b7 as StructuredOutputParser, b8 as StandardSchemaOutputParser, b9 as JsonOutputParser, ba as JsonMarkdownStructuredOutputParser, bb as BaseOutputParser, bc as BaseLLMOutputParser, bd as AsymmetricStructuredOutputParser, be as sha256, bf as validatesOnlyStrings, bg as isAsyncGenerator, bh as objectType, bi as stringType, bj as parseCallbackConfigArg, bk as BaseLangChain, bl as _isToolCall, bm as prettifyError, bn as ToolInputParsingException, bo as validate, bp as CallbackManager, bq as _configHasToolCallId, br as consumeAsyncGenerator, bs as isStructuredToolParams, bt as isStructuredTool, bu as isRunnableToolLike, bv as isLangChainTool, bw as getAbortSignalError, bx as parseToolCall, by as makeInvalidToolCall, bz as convertLangChainToolCallToOpenAI, bA as JsonOutputToolsParser, bB as JsonOutputKeyToolsParser, bC as AsyncCaller, bD as BaseLanguageModel, bE as GenerationChunk, bF as callbackHandlerPrefersStreaming, bG as RUN_KEY, bH as BaseChatModel, bI as AsyncGeneratorWithSetup, bJ as IterableReadableStream, bK as ChatModelStream, bL as v6, bM as v5, bN as Serializable, bO as Client, bP as StringPromptValue, bQ as addLangChainErrorFields, bR as ImagePromptValue, bS as ChatPromptValue, bT as BaseTracer, bU as toJsonSchema, bV as ChatGenerationChunk, bW as uuid_exports, bX as tiktoken_exports, bY as stream_exports$1, bZ as standard_schema_exports, b_ as json_schema_exports, b$ as function_calling_exports, c0 as env_exports, c1 as async_caller_exports, c2 as tracer_langchain_exports, c3 as log_stream_exports, c4 as console_exports, c5 as base_exports$1, c6 as graph_exports, c7 as prompt_values_exports, c8 as outputs_exports, c9 as tool_exports, ca as serializable_exports, cb as structured_output_exports, cc as stream_exports$2, cd as openai_completions_stream_exports, ce as compat_exports, cf as chat_models_exports, cg as base_exports$2, ch as errors_exports, ci as manager_exports, cj as base_exports$3, ck as caches_exports, cl as isEscapedObject, cm as unescapeValue, cn as getEnvironmentVariable, co as get_lc_unique_name, cp as mapKeys, cq as keyFromJson, cr as ensureHandler, cs as BaseCallbackHandler, ct as v4, cu as Graph, cv as any, cw as validate$1, cx as custom, cy as custom$1, cz as isSerializableSchema$1, cA as Validator, cB as ZodType, cC as ZodType$1, cD as $ZodRegistry, cE as object, cF as functionType, cG as unionType, cH as booleanType, cI as promiseType, cJ as enumType, cK as recordType, cL as anyType, cM as arrayType, cN as numberType, cO as instanceOfType, cP as literalType, cQ as number, cR as string, cS as array, cT as union, cU as unknown, cV as removeClip, cW as removeRegion, cX as resolvePillIds, cY as replacePillSpan, cZ as createId, c_ as planTimelineReplacement, c$ as replaceTimeline, d0 as moveClip, d1 as setClipSourceRange, d2 as anchorRegionsWithDerivedMs, d3 as trimAppliesToClip, d4 as coalesceRegionsForRuler, d5 as createDriftChatModel, d6 as messageContentToThinking, d7 as messageContentToText } from "./main-DsZ7BJAQ.js";
import { AsyncLocalStorage } from "node:async_hooks";
var promises_exports = /* @__PURE__ */ __exportAll({
  awaitAllCallbacks: () => awaitAllCallbacks,
  consumeCallback: () => consumeCallback
});
var singletons_exports = /* @__PURE__ */ __exportAll({
  AsyncLocalStorageProviderSingleton: () => AsyncLocalStorageProviderSingleton,
  MockAsyncLocalStorage: () => MockAsyncLocalStorage,
  _CONTEXT_VARIABLES_KEY: () => _CONTEXT_VARIABLES_KEY
});
const _isMessageType = (msg, types) => {
  const typesAsStrings = [...new Set(types?.map((t) => {
    if (typeof t === "string") return t;
    const instantiatedMsgClass = new t({});
    if (!("getType" in instantiatedMsgClass) || typeof instantiatedMsgClass.getType !== "function") throw new Error("Invalid type provided.");
    return instantiatedMsgClass.getType();
  }))];
  const msgType = msg.getType();
  return typesAsStrings.some((t) => t === msgType);
};
function filterMessages(messagesOrOptions, options) {
  if (Array.isArray(messagesOrOptions)) return _filterMessages(messagesOrOptions, options);
  return RunnableLambda.from((input) => {
    return _filterMessages(input, messagesOrOptions);
  });
}
function _filterMessages(messages, options = {}) {
  const { includeNames, excludeNames, includeTypes, excludeTypes, includeIds, excludeIds } = options;
  const filtered = [];
  for (const msg of messages) {
    if (excludeNames && msg.name && excludeNames.includes(msg.name)) continue;
    else if (excludeTypes && _isMessageType(msg, excludeTypes)) continue;
    else if (excludeIds && msg.id && excludeIds.includes(msg.id)) continue;
    if (!(includeTypes || includeIds || includeNames)) filtered.push(msg);
    else if (includeNames && msg.name && includeNames.some((iName) => iName === msg.name)) filtered.push(msg);
    else if (includeTypes && _isMessageType(msg, includeTypes)) filtered.push(msg);
    else if (includeIds && msg.id && includeIds.some((id) => id === msg.id)) filtered.push(msg);
  }
  return filtered;
}
function mergeMessageRuns(messages) {
  if (Array.isArray(messages)) return _mergeMessageRuns(messages);
  return RunnableLambda.from(_mergeMessageRuns);
}
function _mergeMessageRuns(messages) {
  if (!messages.length) return [];
  const merged = [];
  for (const msg of messages) {
    const curr = msg;
    const last = merged.pop();
    if (!last) merged.push(curr);
    else if (curr.getType() === "tool" || !(curr.getType() === last.getType())) merged.push(last, curr);
    else {
      const lastChunk = convertToChunk(last);
      const currChunk = convertToChunk(curr);
      const mergedChunks = lastChunk.concat(currChunk);
      if (typeof lastChunk.content === "string" && typeof currChunk.content === "string") mergedChunks.content = `${lastChunk.content}
${currChunk.content}`;
      merged.push(_chunkToMsg(mergedChunks));
    }
  }
  return merged;
}
function trimMessages(messagesOrOptions, options) {
  if (Array.isArray(messagesOrOptions)) {
    const messages = messagesOrOptions;
    if (!options) throw new Error("Options parameter is required when providing messages.");
    return _trimMessagesHelper(messages, options);
  } else {
    const trimmerOptions = messagesOrOptions;
    return RunnableLambda.from((input) => _trimMessagesHelper(input, trimmerOptions)).withConfig({ runName: "trim_messages" });
  }
}
async function _trimMessagesHelper(messages, options) {
  const { maxTokens, tokenCounter, strategy = "last", allowPartial = false, endOn, startOn, includeSystem = false, textSplitter } = options;
  if (startOn && strategy === "first") throw new Error("`startOn` should only be specified if `strategy` is 'last'.");
  if (includeSystem && strategy === "first") throw new Error("`includeSystem` should only be specified if `strategy` is 'last'.");
  let listTokenCounter;
  if ("getNumTokens" in tokenCounter) listTokenCounter = async (msgs) => {
    return (await Promise.all(msgs.map((msg) => tokenCounter.getNumTokens(msg.content)))).reduce((sum, count) => sum + count, 0);
  };
  else listTokenCounter = async (msgs) => tokenCounter(msgs);
  let textSplitterFunc = defaultTextSplitter;
  if (textSplitter) if ("splitText" in textSplitter) textSplitterFunc = textSplitter.splitText;
  else textSplitterFunc = async (text) => textSplitter(text);
  if (strategy === "first") return _firstMaxTokens(messages, {
    maxTokens,
    tokenCounter: listTokenCounter,
    textSplitter: textSplitterFunc,
    partialStrategy: allowPartial ? "first" : void 0,
    endOn
  });
  else if (strategy === "last") return _lastMaxTokens(messages, {
    maxTokens,
    tokenCounter: listTokenCounter,
    textSplitter: textSplitterFunc,
    allowPartial,
    includeSystem,
    startOn,
    endOn
  });
  else throw new Error(`Unrecognized strategy: '${strategy}'. Must be one of 'first' or 'last'.`);
}
async function _firstMaxTokens(messages, options) {
  const { maxTokens, tokenCounter, textSplitter, partialStrategy, endOn } = options;
  let messagesCopy = [...messages];
  let idx = 0;
  for (let i = 0; i < messagesCopy.length; i += 1) if (await tokenCounter(i > 0 ? messagesCopy.slice(0, -i) : messagesCopy) <= maxTokens) {
    idx = messagesCopy.length - i;
    break;
  }
  if (idx < messagesCopy.length && partialStrategy) {
    let includedPartial = false;
    if (Array.isArray(messagesCopy[idx].content)) {
      const excluded = messagesCopy[idx];
      if (typeof excluded.content === "string") throw new Error("Expected content to be an array.");
      const numBlock = excluded.content.length;
      const reversedContent = partialStrategy === "last" ? [...excluded.content].reverse() : excluded.content;
      for (let i = 1; i <= numBlock; i += 1) {
        const partialContent = partialStrategy === "first" ? reversedContent.slice(0, i) : reversedContent.slice(-i);
        const fields = Object.fromEntries(Object.entries(excluded).filter(([k]) => k !== "type" && !k.startsWith("lc_")));
        const updatedMessage = _switchTypeToMessage(excluded.getType(), {
          ...fields,
          content: partialContent
        });
        const slicedMessages = [...messagesCopy.slice(0, idx), updatedMessage];
        if (await tokenCounter(slicedMessages) <= maxTokens) {
          messagesCopy = slicedMessages;
          idx += 1;
          includedPartial = true;
        } else break;
      }
      if (includedPartial && partialStrategy === "last") excluded.content = [...reversedContent].reverse();
    }
    if (!includedPartial) {
      const excluded = messagesCopy[idx];
      let text;
      if (Array.isArray(excluded.content) && excluded.content.some((block) => typeof block === "string" || block.type === "text")) text = excluded.content.find((block) => block.type === "text" && block.text)?.text;
      else if (typeof excluded.content === "string") text = excluded.content;
      if (text) {
        const splitTexts = await textSplitter(text);
        const numSplits = splitTexts.length;
        if (partialStrategy === "last") splitTexts.reverse();
        for (let _ = 0; _ < numSplits - 1; _ += 1) {
          splitTexts.pop();
          excluded.content = splitTexts.join("");
          if (await tokenCounter([...messagesCopy.slice(0, idx), excluded]) <= maxTokens) {
            if (partialStrategy === "last") excluded.content = [...splitTexts].reverse().join("");
            messagesCopy = [...messagesCopy.slice(0, idx), excluded];
            idx += 1;
            break;
          }
        }
      }
    }
  }
  if (endOn) {
    const endOnArr = Array.isArray(endOn) ? endOn : [endOn];
    while (idx > 0 && !_isMessageType(messagesCopy[idx - 1], endOnArr)) idx -= 1;
  }
  return messagesCopy.slice(0, idx);
}
async function _lastMaxTokens(messages, options) {
  const { allowPartial = false, includeSystem = false, endOn, startOn, ...rest } = options;
  let messagesCopy = messages.map((message) => {
    const fields = Object.fromEntries(Object.entries(message).filter(([k]) => k !== "type" && !k.startsWith("lc_")));
    return _switchTypeToMessage(message.getType(), fields, isBaseMessageChunk(message));
  });
  if (endOn) {
    const endOnArr = Array.isArray(endOn) ? endOn : [endOn];
    while (messagesCopy.length > 0 && !_isMessageType(messagesCopy[messagesCopy.length - 1], endOnArr)) messagesCopy = messagesCopy.slice(0, -1);
  }
  const swappedSystem = includeSystem && messagesCopy[0]?.getType() === "system";
  let reversed_ = swappedSystem ? messagesCopy.slice(0, 1).concat(messagesCopy.slice(1).reverse()) : messagesCopy.reverse();
  reversed_ = await _firstMaxTokens(reversed_, {
    ...rest,
    partialStrategy: allowPartial ? "last" : void 0,
    endOn: startOn
  });
  if (swappedSystem) return [reversed_[0], ...reversed_.slice(1).reverse()];
  else return reversed_.reverse();
}
const _MSG_CHUNK_MAP = {
  human: {
    message: HumanMessage,
    messageChunk: HumanMessageChunk
  },
  ai: {
    message: AIMessage,
    messageChunk: AIMessageChunk
  },
  system: {
    message: SystemMessage,
    messageChunk: SystemMessageChunk
  },
  developer: {
    message: SystemMessage,
    messageChunk: SystemMessageChunk
  },
  tool: {
    message: ToolMessage,
    messageChunk: ToolMessageChunk
  },
  function: {
    message: FunctionMessage,
    messageChunk: FunctionMessageChunk
  },
  generic: {
    message: ChatMessage,
    messageChunk: ChatMessageChunk
  },
  remove: {
    message: RemoveMessage,
    messageChunk: RemoveMessage
  }
};
function _switchTypeToMessage(messageType, fields, returnChunk) {
  let chunk;
  let msg;
  switch (messageType) {
    case "human":
      if (returnChunk) chunk = new HumanMessageChunk(fields);
      else msg = new HumanMessage(fields);
      break;
    case "ai":
      if (returnChunk) {
        let aiChunkFields = { ...fields };
        if ("tool_calls" in aiChunkFields) aiChunkFields = {
          ...aiChunkFields,
          tool_call_chunks: aiChunkFields.tool_calls?.map((tc) => ({
            ...tc,
            type: "tool_call_chunk",
            index: void 0,
            args: JSON.stringify(tc.args)
          }))
        };
        chunk = new AIMessageChunk(aiChunkFields);
      } else msg = new AIMessage(fields);
      break;
    case "system":
      if (returnChunk) chunk = new SystemMessageChunk(fields);
      else msg = new SystemMessage(fields);
      break;
    case "developer":
      if (returnChunk) chunk = new SystemMessageChunk({
        ...fields,
        additional_kwargs: {
          ...fields.additional_kwargs,
          __openai_role__: "developer"
        }
      });
      else msg = new SystemMessage({
        ...fields,
        additional_kwargs: {
          ...fields.additional_kwargs,
          __openai_role__: "developer"
        }
      });
      break;
    case "tool":
      if ("tool_call_id" in fields) if (returnChunk) chunk = new ToolMessageChunk(fields);
      else msg = new ToolMessage(fields);
      else throw new Error("Can not convert ToolMessage to ToolMessageChunk if 'tool_call_id' field is not defined.");
      break;
    case "function":
      if (returnChunk) chunk = new FunctionMessageChunk(fields);
      else {
        if (!fields.name) throw new Error("FunctionMessage must have a 'name' field");
        msg = new FunctionMessage(fields);
      }
      break;
    case "generic":
      if ("role" in fields) if (returnChunk) chunk = new ChatMessageChunk(fields);
      else msg = new ChatMessage(fields);
      else throw new Error("Can not convert ChatMessage to ChatMessageChunk if 'role' field is not defined.");
      break;
    default:
      throw new Error(`Unrecognized message type ${messageType}`);
  }
  if (returnChunk && chunk) return chunk;
  if (msg) return msg;
  throw new Error(`Unrecognized message type ${messageType}`);
}
function _chunkToMsg(chunk) {
  const chunkType = chunk.getType();
  let msg;
  const fields = Object.fromEntries(Object.entries(chunk).filter(([k]) => !["type", "tool_call_chunks"].includes(k) && !k.startsWith("lc_")));
  if (chunkType in _MSG_CHUNK_MAP) msg = _switchTypeToMessage(chunkType, fields);
  if (!msg) throw new Error(`Unrecognized message chunk class ${chunkType}. Supported classes are ${Object.keys(_MSG_CHUNK_MAP)}`);
  return msg;
}
function defaultTextSplitter(text) {
  const splits = text.split("\n");
  return Promise.resolve([...splits.slice(0, -1).map((s) => `${s}
`), splits[splits.length - 1]]);
}
const KNOWN_BLOCK_TYPES$2 = [
  "tool_call",
  "tool_call_chunk",
  "invalid_tool_call",
  "server_tool_call",
  "server_tool_call_chunk",
  "server_tool_call_result"
];
const KNOWN_BLOCK_TYPES$1 = [
  "image",
  "video",
  "audio",
  "text-plain",
  "file"
];
const KNOWN_BLOCK_TYPES = [
  "text",
  "reasoning",
  ...KNOWN_BLOCK_TYPES$2,
  ...KNOWN_BLOCK_TYPES$1
];
var messages_exports = /* @__PURE__ */ __exportAll({
  AIMessage: () => AIMessage,
  AIMessageChunk: () => AIMessageChunk,
  BaseMessage: () => BaseMessage,
  BaseMessageChunk: () => BaseMessageChunk,
  ChatMessage: () => ChatMessage,
  ChatMessageChunk: () => ChatMessageChunk,
  DEFAULT_MERGE_IGNORE_KEYS: () => DEFAULT_MERGE_IGNORE_KEYS,
  FunctionMessage: () => FunctionMessage,
  FunctionMessageChunk: () => FunctionMessageChunk,
  HumanMessage: () => HumanMessage,
  HumanMessageChunk: () => HumanMessageChunk,
  KNOWN_BLOCK_TYPES: () => KNOWN_BLOCK_TYPES,
  RemoveMessage: () => RemoveMessage,
  SystemMessage: () => SystemMessage,
  SystemMessageChunk: () => SystemMessageChunk,
  ToolMessage: () => ToolMessage,
  ToolMessageChunk: () => ToolMessageChunk,
  _isMessageFieldWithRole: () => _isMessageFieldWithRole,
  _mergeDicts: () => _mergeDicts,
  _mergeLists: () => _mergeLists,
  _mergeObj: () => _mergeObj,
  _mergeStatus: () => _mergeStatus,
  coerceMessageLikeToMessage: () => coerceMessageLikeToMessage,
  collapseToolCallChunks: () => collapseToolCallChunks,
  convertToChunk: () => convertToChunk,
  convertToOpenAIImageBlock: () => convertToOpenAIImageBlock,
  convertToProviderContentBlock: () => convertToProviderContentBlock,
  defaultTextSplitter: () => defaultTextSplitter,
  defaultToolCallParser: () => defaultToolCallParser,
  filterMessages: () => filterMessages,
  getBufferString: () => getBufferString,
  iife: () => iife,
  isAIMessage: () => isAIMessage,
  isAIMessageChunk: () => isAIMessageChunk,
  isBase64ContentBlock: () => isBase64ContentBlock,
  isBaseMessage: () => isBaseMessage,
  isBaseMessageChunk: () => isBaseMessageChunk,
  isChatMessage: () => isChatMessage,
  isChatMessageChunk: () => isChatMessageChunk,
  isDataContentBlock: () => isDataContentBlock,
  isDirectToolOutput: () => isDirectToolOutput,
  isFunctionMessage: () => isFunctionMessage,
  isFunctionMessageChunk: () => isFunctionMessageChunk,
  isHumanMessage: () => isHumanMessage,
  isHumanMessageChunk: () => isHumanMessageChunk,
  isIDContentBlock: () => isIDContentBlock,
  isMessage: () => isMessage,
  isOpenAIToolCallArray: () => isOpenAIToolCallArray,
  isPlainTextContentBlock: () => isPlainTextContentBlock,
  isSystemMessage: () => isSystemMessage,
  isSystemMessageChunk: () => isSystemMessageChunk,
  isToolMessage: () => isToolMessage,
  isToolMessageChunk: () => isToolMessageChunk,
  isURLContentBlock: () => isURLContentBlock,
  mapChatMessagesToStoredMessages: () => mapChatMessagesToStoredMessages,
  mapStoredMessageToChatMessage: () => mapStoredMessageToChatMessage,
  mapStoredMessagesToChatMessages: () => mapStoredMessagesToChatMessages,
  mergeContent: () => mergeContent,
  mergeMessageRuns: () => mergeMessageRuns,
  mergeResponseMetadata: () => mergeResponseMetadata,
  mergeUsageMetadata: () => mergeUsageMetadata,
  parseBase64DataUrl: () => parseBase64DataUrl,
  parseMimeType: () => parseMimeType,
  trimMessages: () => trimMessages
});
function toPositionAt(clips, clipIndex, sourceTimeSec) {
  const clip = clips[clipIndex];
  const sourceOffset = Math.max(
    0,
    Math.min((clip.sourceEndSec ?? 0) - clip.sourceStartSec, sourceTimeSec - clip.sourceStartSec)
  );
  return {
    clip,
    clipIndex,
    virtualTimeSec: clip.timelineStartSec + sourceOffset,
    sourceTimeSec
  };
}
function isWithinClipBounds(clip, sourceTimeSec, epsilon, closingEdge) {
  const sourceEnd = clip.sourceEndSec ?? clip.sourceStartSec;
  const upperBound = closingEdge === "inclusive" ? sourceEnd + epsilon : sourceEnd - epsilon;
  return sourceTimeSec >= clip.sourceStartSec - epsilon && sourceTimeSec <= upperBound;
}
function locateSourcePosition(clips, sourceTimeSec, assetId, epsilon = 0.05, preferredClipId) {
  const scan2 = (closingEdge) => clips.findIndex(
    (clip) => (!assetId || clip.assetId === assetId) && isWithinClipBounds(clip, sourceTimeSec, epsilon, closingEdge)
  );
  const strict = scan2("exclusive");
  const clipIndex = strict >= 0 ? strict : scan2("inclusive");
  if (clipIndex < 0) return null;
  return toPositionAt(clips, clipIndex, sourceTimeSec);
}
var types_exports = /* @__PURE__ */ __exportAll({
  extendInteropZodObject: () => extendInteropZodObject,
  getInteropZodDefaultGetter: () => getInteropZodDefaultGetter,
  getInteropZodObjectShape: () => getInteropZodObjectShape,
  getSchemaDescription: () => getSchemaDescription,
  interopParse: () => interopParse,
  interopParseAsync: () => interopParseAsync,
  interopSafeParse: () => interopSafeParse,
  interopSafeParseAsync: () => interopSafeParseAsync,
  interopZodObjectMakeFieldsOptional: () => interopZodObjectMakeFieldsOptional,
  interopZodObjectPartial: () => interopZodObjectPartial,
  interopZodObjectPassthrough: () => interopZodObjectPassthrough,
  interopZodObjectStrict: () => interopZodObjectStrict,
  interopZodTransformInputSchema: () => interopZodTransformInputSchema,
  isInteropZodError: () => isInteropZodError,
  isInteropZodLiteral: () => isInteropZodLiteral,
  isInteropZodObject: () => isInteropZodObject,
  isInteropZodSchema: () => isInteropZodSchema,
  isShapelessZodSchema: () => isShapelessZodSchema,
  isSimpleStringZodSchema: () => isSimpleStringZodSchema,
  isZodArrayV4: () => isZodArrayV4,
  isZodLiteralV3: () => isZodLiteralV3,
  isZodLiteralV4: () => isZodLiteralV4,
  isZodNullableV4: () => isZodNullableV4,
  isZodObjectV3: () => isZodObjectV3,
  isZodObjectV4: () => isZodObjectV4,
  isZodOptionalV4: () => isZodOptionalV4,
  isZodSchema: () => isZodSchema,
  isZodSchemaV3: () => isZodSchemaV3,
  isZodSchemaV4: () => isZodSchemaV4
});
var RouterRunnable = class extends Runnable {
  static lc_name() {
    return "RouterRunnable";
  }
  lc_namespace = ["langchain_core", "runnables"];
  lc_serializable = true;
  runnables;
  constructor(fields) {
    super(fields);
    this.runnables = fields.runnables;
  }
  async invoke(input, options) {
    const { key, input: actualInput } = input;
    const runnable = this.runnables[key];
    if (runnable === void 0) throw new Error(`No runnable associated with key "${key}".`);
    return runnable.invoke(actualInput, ensureConfig(options));
  }
  async batch(inputs, options, batchOptions) {
    const keys = inputs.map((input) => input.key);
    const actualInputs = inputs.map((input) => input.input);
    if (keys.find((key) => this.runnables[key] === void 0) !== void 0) throw new Error(`One or more keys do not have a corresponding runnable.`);
    const runnables = keys.map((key) => this.runnables[key]);
    const optionsList = this._getOptionsList(options ?? {}, inputs.length);
    const maxConcurrency = optionsList[0]?.maxConcurrency ?? batchOptions?.maxConcurrency;
    const batchSize = maxConcurrency && maxConcurrency > 0 ? maxConcurrency : inputs.length;
    const batchResults = [];
    for (let i = 0; i < actualInputs.length; i += batchSize) {
      const batchPromises = actualInputs.slice(i, i + batchSize).map((actualInput, i2) => runnables[i2].invoke(actualInput, optionsList[i2]));
      const batchResult = await Promise.all(batchPromises);
      batchResults.push(batchResult);
    }
    return batchResults.flat();
  }
  async stream(input, options) {
    const { key, input: actualInput } = input;
    const runnable = this.runnables[key];
    if (runnable === void 0) throw new Error(`No runnable associated with key "${key}".`);
    return runnable.stream(actualInput, options);
  }
};
var RunnableBranch = class extends Runnable {
  static lc_name() {
    return "RunnableBranch";
  }
  lc_namespace = ["langchain_core", "runnables"];
  lc_serializable = true;
  default;
  branches;
  constructor(fields) {
    super(fields);
    this.branches = fields.branches;
    this.default = fields.default;
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
  static from(branches) {
    if (branches.length < 1) throw new Error("RunnableBranch requires at least one branch");
    const coercedBranches = branches.slice(0, -1).map(([condition, runnable]) => [_coerceToRunnable(condition), _coerceToRunnable(runnable)]);
    const defaultBranch = _coerceToRunnable(branches[branches.length - 1]);
    return new this({
      branches: coercedBranches,
      default: defaultBranch
    });
  }
  async _invoke(input, config, runManager) {
    let result;
    for (let i = 0; i < this.branches.length; i += 1) {
      const [condition, branchRunnable] = this.branches[i];
      if (await condition.invoke(input, patchConfig(config, { callbacks: runManager?.getChild(`condition:${i + 1}`) }))) {
        result = await branchRunnable.invoke(input, patchConfig(config, { callbacks: runManager?.getChild(`branch:${i + 1}`) }));
        break;
      }
    }
    if (!result) result = await this.default.invoke(input, patchConfig(config, { callbacks: runManager?.getChild("branch:default") }));
    return result;
  }
  async invoke(input, config = {}) {
    return this._callWithConfig(this._invoke, input, config);
  }
  async *_streamIterator(input, config) {
    const runManager = await (await getCallbackManagerForConfig(config))?.handleChainStart(this.toJSON(), _coerceToDict$1(input, "input"), config?.runId, void 0, void 0, void 0, config?.runName);
    let finalOutput;
    let finalOutputSupported = true;
    let stream;
    try {
      for (let i = 0; i < this.branches.length; i += 1) {
        const [condition, branchRunnable] = this.branches[i];
        if (await condition.invoke(input, patchConfig(config, { callbacks: runManager?.getChild(`condition:${i + 1}`) }))) {
          stream = await branchRunnable.stream(input, patchConfig(config, { callbacks: runManager?.getChild(`branch:${i + 1}`) }));
          for await (const chunk of stream) {
            yield chunk;
            if (finalOutputSupported) if (finalOutput === void 0) finalOutput = chunk;
            else try {
              finalOutput = concat$1(finalOutput, chunk);
            } catch {
              finalOutput = void 0;
              finalOutputSupported = false;
            }
          }
          break;
        }
      }
      if (stream === void 0) {
        stream = await this.default.stream(input, patchConfig(config, { callbacks: runManager?.getChild("branch:default") }));
        for await (const chunk of stream) {
          yield chunk;
          if (finalOutputSupported) if (finalOutput === void 0) finalOutput = chunk;
          else try {
            finalOutput = concat$1(finalOutput, chunk);
          } catch {
            finalOutput = void 0;
            finalOutputSupported = false;
          }
        }
      }
    } catch (e) {
      await runManager?.handleChainError(e);
      throw e;
    }
    await runManager?.handleChainEnd(finalOutput ?? {});
  }
};
var RunnableWithMessageHistory = class extends RunnableBinding {
  runnable;
  inputMessagesKey;
  outputMessagesKey;
  historyMessagesKey;
  getMessageHistory;
  constructor(fields) {
    let historyChain = RunnableLambda.from((input, options) => this._enterHistory(input, options ?? {})).withConfig({ runName: "loadHistory" });
    const messagesKey = fields.historyMessagesKey ?? fields.inputMessagesKey;
    if (messagesKey) historyChain = RunnablePassthrough.assign({ [messagesKey]: historyChain }).withConfig({ runName: "insertHistory" });
    const bound = historyChain.pipe(fields.runnable.withListeners({ onEnd: (run, config2) => this._exitHistory(run, config2 ?? {}) })).withConfig({ runName: "RunnableWithMessageHistory" });
    const config = fields.config ?? {};
    super({
      ...fields,
      config,
      bound
    });
    this.runnable = fields.runnable;
    this.getMessageHistory = fields.getMessageHistory;
    this.inputMessagesKey = fields.inputMessagesKey;
    this.outputMessagesKey = fields.outputMessagesKey;
    this.historyMessagesKey = fields.historyMessagesKey;
  }
  _getInputMessages(inputValue) {
    let parsedInputValue;
    if (typeof inputValue === "object" && !Array.isArray(inputValue) && !isBaseMessage(inputValue)) {
      let key;
      if (this.inputMessagesKey) key = this.inputMessagesKey;
      else if (Object.keys(inputValue).length === 1) key = Object.keys(inputValue)[0];
      else key = "input";
      if (Array.isArray(inputValue[key]) && Array.isArray(inputValue[key][0])) parsedInputValue = inputValue[key][0];
      else parsedInputValue = inputValue[key];
    } else parsedInputValue = inputValue;
    if (typeof parsedInputValue === "string") return [new HumanMessage(parsedInputValue)];
    else if (Array.isArray(parsedInputValue)) return parsedInputValue;
    else if (isBaseMessage(parsedInputValue)) return [parsedInputValue];
    else throw new Error(`Expected a string, BaseMessage, or array of BaseMessages.
Got ${JSON.stringify(parsedInputValue, null, 2)}`);
  }
  _getOutputMessages(outputValue) {
    let parsedOutputValue;
    if (!Array.isArray(outputValue) && !isBaseMessage(outputValue) && typeof outputValue !== "string") {
      let key;
      if (this.outputMessagesKey !== void 0) key = this.outputMessagesKey;
      else if (Object.keys(outputValue).length === 1) key = Object.keys(outputValue)[0];
      else key = "output";
      if (outputValue.generations !== void 0) parsedOutputValue = outputValue.generations[0][0].message;
      else parsedOutputValue = outputValue[key];
    } else parsedOutputValue = outputValue;
    if (typeof parsedOutputValue === "string") return [new AIMessage(parsedOutputValue)];
    else if (Array.isArray(parsedOutputValue)) return parsedOutputValue;
    else if (isBaseMessage(parsedOutputValue)) return [parsedOutputValue];
    else throw new Error(`Expected a string, BaseMessage, or array of BaseMessages. Received: ${JSON.stringify(parsedOutputValue, null, 2)}`);
  }
  async _enterHistory(input, kwargs) {
    const messages = await (kwargs?.configurable?.messageHistory).getMessages();
    if (this.historyMessagesKey === void 0) return messages.concat(this._getInputMessages(input));
    return messages;
  }
  async _exitHistory(run, config) {
    const history = config.configurable?.messageHistory;
    let inputs;
    if (Array.isArray(run.inputs) && Array.isArray(run.inputs[0])) inputs = run.inputs[0];
    else inputs = run.inputs;
    let inputMessages = this._getInputMessages(inputs);
    if (this.historyMessagesKey === void 0) {
      const existingMessages = await history.getMessages();
      inputMessages = inputMessages.slice(existingMessages.length);
    }
    const outputValue = run.outputs;
    if (!outputValue) throw new Error(`Output values from 'Run' undefined. Run: ${JSON.stringify(run, null, 2)}`);
    const outputMessages = this._getOutputMessages(outputValue);
    await history.addMessages([...inputMessages, ...outputMessages]);
  }
  async _mergeConfig(...configs) {
    const config = await super._mergeConfig(...configs);
    if (!config.configurable || !config.configurable.sessionId) {
      const exampleInput = { [this.inputMessagesKey ?? "input"]: "foo" };
      throw new Error(`sessionId is required. Pass it in as part of the config argument to .invoke() or .stream()
eg. chain.invoke(${JSON.stringify(exampleInput)}, ${JSON.stringify({ configurable: { sessionId: "123" } })})`);
    }
    const { sessionId } = config.configurable;
    config.configurable.messageHistory = await this.getMessageHistory(sessionId);
    return config;
  }
};
var runnables_exports = /* @__PURE__ */ __exportAll({
  RouterRunnable: () => RouterRunnable,
  Runnable: () => Runnable,
  RunnableAssign: () => RunnableAssign,
  RunnableBinding: () => RunnableBinding,
  RunnableBranch: () => RunnableBranch,
  RunnableEach: () => RunnableEach,
  RunnableLambda: () => RunnableLambda,
  RunnableMap: () => RunnableMap,
  RunnableParallel: () => RunnableParallel,
  RunnablePassthrough: () => RunnablePassthrough,
  RunnablePick: () => RunnablePick,
  RunnableRetry: () => RunnableRetry,
  RunnableSequence: () => RunnableSequence,
  RunnableToolLike: () => RunnableToolLike,
  RunnableWithFallbacks: () => RunnableWithFallbacks,
  RunnableWithMessageHistory: () => RunnableWithMessageHistory,
  _coerceToRunnable: () => _coerceToRunnable,
  ensureConfig: () => ensureConfig,
  getCallbackManagerForConfig: () => getCallbackManagerForConfig,
  mergeConfigs: () => mergeConfigs,
  patchConfig: () => patchConfig,
  pickRunnableConfigKeys: () => pickRunnableConfigKeys,
  raceWithSignal: () => raceWithSignal
});
var BytesOutputParser = class extends BaseTransformOutputParser {
  static lc_name() {
    return "BytesOutputParser";
  }
  lc_namespace = [
    "langchain_core",
    "output_parsers",
    "bytes"
  ];
  lc_serializable = true;
  textEncoder = new TextEncoder();
  parse(text) {
    return Promise.resolve(this.textEncoder.encode(text));
  }
  getFormatInstructions() {
    return "";
  }
};
var ListOutputParser = class extends BaseTransformOutputParser {
  re;
  async *_transform(inputGenerator) {
    let buffer = "";
    for await (const input of inputGenerator) {
      if (typeof input === "string") buffer += input;
      else buffer += input.content;
      if (!this.re) {
        const parts = await this.parse(buffer);
        if (parts.length > 1) {
          for (const part of parts.slice(0, -1)) yield [part];
          buffer = parts[parts.length - 1];
        }
      } else {
        const matches = [...buffer.matchAll(this.re)];
        if (matches.length > 1) {
          let doneIdx = 0;
          for (const match of matches.slice(0, -1)) {
            yield [match[1]];
            doneIdx += (match.index ?? 0) + match[0].length;
          }
          buffer = buffer.slice(doneIdx);
        }
      }
    }
    for (const part of await this.parse(buffer)) yield [part];
  }
};
var CommaSeparatedListOutputParser = class extends ListOutputParser {
  static lc_name() {
    return "CommaSeparatedListOutputParser";
  }
  lc_namespace = [
    "langchain_core",
    "output_parsers",
    "list"
  ];
  lc_serializable = true;
  /**
  * Parses the given text into an array of strings, using a comma as the
  * separator. If the parsing fails, throws an OutputParserException.
  * @param text The text to parse.
  * @returns An array of strings obtained by splitting the input text at each comma.
  */
  async parse(text) {
    try {
      return text.trim().split(",").map((s) => s.trim());
    } catch {
      throw new OutputParserException(`Could not parse output: ${text}`, text);
    }
  }
  /**
  * Provides instructions on the expected format of the response for the
  * CommaSeparatedListOutputParser.
  * @returns A string containing instructions on the expected format of the response.
  */
  getFormatInstructions() {
    return `Your response should be a list of comma separated values, eg: \`foo, bar, baz\``;
  }
};
var CustomListOutputParser = class extends ListOutputParser {
  lc_namespace = [
    "langchain_core",
    "output_parsers",
    "list"
  ];
  length;
  separator;
  constructor({ length, separator }) {
    super(...arguments);
    this.length = length;
    this.separator = separator || ",";
  }
  /**
  * Parses the given text into an array of strings, using the specified
  * separator. If the parsing fails or the number of items in the list
  * doesn't match the expected length, throws an OutputParserException.
  * @param text The text to parse.
  * @returns An array of strings obtained by splitting the input text at each occurrence of the specified separator.
  */
  async parse(text) {
    try {
      const items = text.trim().split(this.separator).map((s) => s.trim());
      if (this.length !== void 0 && items.length !== this.length) throw new OutputParserException(`Incorrect number of items. Expected ${this.length}, got ${items.length}.`);
      return items;
    } catch (e) {
      if (Object.getPrototypeOf(e) === OutputParserException.prototype) throw e;
      throw new OutputParserException(`Could not parse output: ${text}`);
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
};
var NumberedListOutputParser = class extends ListOutputParser {
  static lc_name() {
    return "NumberedListOutputParser";
  }
  lc_namespace = [
    "langchain_core",
    "output_parsers",
    "list"
  ];
  lc_serializable = true;
  getFormatInstructions() {
    return `Your response should be a numbered list with each item on a new line. For example: 

1. foo

2. bar

3. baz`;
  }
  re = /\d+\.\s([^\n]+)/g;
  async parse(text) {
    return [...text.matchAll(this.re) ?? []].map((m) => m[1]);
  }
};
var MarkdownListOutputParser = class extends ListOutputParser {
  static lc_name() {
    return "NumberedListOutputParser";
  }
  lc_namespace = [
    "langchain_core",
    "output_parsers",
    "list"
  ];
  lc_serializable = true;
  getFormatInstructions() {
    return `Your response should be a numbered list with each item on a new line. For example: 

1. foo

2. bar

3. baz`;
  }
  re = /^\s*[-*]\s([^\n]+)$/gm;
  async parse(text) {
    return [...text.matchAll(this.re) ?? []].map((m) => m[1]);
  }
};
var StringOutputParser = class extends BaseTransformOutputParser {
  static lc_name() {
    return "StrOutputParser";
  }
  lc_namespace = [
    "langchain_core",
    "output_parsers",
    "string"
  ];
  lc_serializable = true;
  /**
  * Parses a string output from an LLM call. This method is meant to be
  * implemented by subclasses to define how a string output from an LLM
  * should be parsed.
  * @param text The string output from an LLM call.
  * @param callbacks Optional callbacks.
  * @returns A promise of the parsed output.
  */
  parse(text) {
    return Promise.resolve(text);
  }
  getFormatInstructions() {
    return "";
  }
  _textContentToString(content) {
    return content.text;
  }
  _imageUrlContentToString(_content) {
    throw new Error(`Cannot coerce a multimodal "image_url" message part into a string.`);
  }
  _messageContentToString(content) {
    switch (content.type) {
      case "text":
      case "text_delta":
        if ("text" in content) return this._textContentToString(content);
        break;
      case "image_url":
        if ("image_url" in content) return this._imageUrlContentToString(content);
        break;
      case "reasoning":
      case "thinking":
      case "redacted_thinking":
        return "";
      default:
        throw new Error(`Cannot coerce "${content.type}" message part into a string.`);
    }
    throw new Error(`Invalid content type: ${content.type}`);
  }
  _baseMessageContentToString(content) {
    return content.reduce((acc, item) => acc + this._messageContentToString(item), "");
  }
};
var json_patch_exports = /* @__PURE__ */ __exportAll({
  applyPatch: () => applyPatch,
  compare: () => compare
});
const XML_FORMAT_INSTRUCTIONS = `The output should be formatted as a XML file.
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
var XMLOutputParser = class extends BaseCumulativeTransformOutputParser {
  tags;
  constructor(fields) {
    super(fields);
    this.tags = fields?.tags;
  }
  static lc_name() {
    return "XMLOutputParser";
  }
  lc_namespace = ["langchain_core", "output_parsers"];
  lc_serializable = true;
  _diff(prev, next) {
    if (!next) return;
    if (!prev) return [{
      op: "replace",
      path: "",
      value: next
    }];
    return compare(prev, next);
  }
  async parsePartialResult(generations) {
    return parseXMLMarkdown(generations[0].text);
  }
  async parse(text) {
    return parseXMLMarkdown(text);
  }
  getFormatInstructions() {
    return !!(this.tags && this.tags.length > 0) ? XML_FORMAT_INSTRUCTIONS.replace("{tags}", this.tags?.join(", ") ?? "") : XML_FORMAT_INSTRUCTIONS;
  }
};
const strip = (text) => text.split("\n").map((line) => line.replace(/^\s+/, "")).join("\n").trim();
const parseParsedResult = (input) => {
  if (Object.keys(input).length === 0) return {};
  const result = {};
  if (input.children.length > 0) {
    result[input.name] = input.children.map(parseParsedResult);
    return result;
  } else {
    result[input.name] = input.text ?? void 0;
    return result;
  }
};
function parseXMLMarkdown(s) {
  const cleanedString = strip(s);
  const parser = sax.parser(true);
  let parsedResult = {};
  const elementStack = [];
  parser.onopentag = (node) => {
    const element = {
      name: node.name,
      attributes: node.attributes,
      children: [],
      text: "",
      isSelfClosing: node.isSelfClosing
    };
    if (elementStack.length > 0) elementStack[elementStack.length - 1].children.push(element);
    else parsedResult = element;
    if (!node.isSelfClosing) elementStack.push(element);
  };
  parser.onclosetag = () => {
    if (elementStack.length > 0) {
      const lastElement = elementStack.pop();
      if (elementStack.length === 0 && lastElement) parsedResult = lastElement;
    }
  };
  parser.ontext = (text) => {
    if (elementStack.length > 0) {
      const currentElement = elementStack[elementStack.length - 1];
      currentElement.text += text;
    }
  };
  parser.onattribute = (attr) => {
    if (elementStack.length > 0) {
      const currentElement = elementStack[elementStack.length - 1];
      currentElement.attributes[attr.name] = attr.value;
    }
  };
  const match = /```(xml)?(.*)```/s.exec(cleanedString);
  const xmlString = match ? match[2] : cleanedString;
  parser.write(xmlString).close();
  if (parsedResult && parsedResult.name === "?xml") parsedResult = parsedResult.children[0];
  return parseParsedResult(parsedResult);
}
var output_parsers_exports = /* @__PURE__ */ __exportAll({
  AsymmetricStructuredOutputParser: () => AsymmetricStructuredOutputParser,
  BaseCumulativeTransformOutputParser: () => BaseCumulativeTransformOutputParser,
  BaseLLMOutputParser: () => BaseLLMOutputParser,
  BaseOutputParser: () => BaseOutputParser,
  BaseTransformOutputParser: () => BaseTransformOutputParser,
  BytesOutputParser: () => BytesOutputParser,
  CommaSeparatedListOutputParser: () => CommaSeparatedListOutputParser,
  CustomListOutputParser: () => CustomListOutputParser,
  JsonMarkdownStructuredOutputParser: () => JsonMarkdownStructuredOutputParser,
  JsonOutputParser: () => JsonOutputParser,
  ListOutputParser: () => ListOutputParser,
  MarkdownListOutputParser: () => MarkdownListOutputParser,
  NumberedListOutputParser: () => NumberedListOutputParser,
  OutputParserException: () => OutputParserException,
  StandardSchemaOutputParser: () => StandardSchemaOutputParser,
  StringOutputParser: () => StringOutputParser,
  StructuredOutputParser: () => StructuredOutputParser,
  XMLOutputParser: () => XMLOutputParser,
  XML_FORMAT_INSTRUCTIONS: () => XML_FORMAT_INSTRUCTIONS,
  parseJsonMarkdown: () => parseJsonMarkdown,
  parsePartialJson: () => parsePartialJson,
  parseXMLMarkdown: () => parseXMLMarkdown
});
var hash_exports = /* @__PURE__ */ __exportAll({ sha256: () => sha256 });
var tools_exports = /* @__PURE__ */ __exportAll({
  BaseToolkit: () => BaseToolkit,
  DynamicStructuredTool: () => DynamicStructuredTool,
  DynamicTool: () => DynamicTool,
  StructuredTool: () => StructuredTool,
  Tool: () => Tool,
  ToolInputParsingException: () => ToolInputParsingException,
  isLangChainTool: () => isLangChainTool,
  isRunnableToolLike: () => isRunnableToolLike,
  isStructuredTool: () => isStructuredTool,
  isStructuredToolParams: () => isStructuredToolParams,
  tool: () => tool
});
var StructuredTool = class extends BaseLangChain {
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
  returnDirect = false;
  verboseParsingErrors = false;
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
  constructor(fields) {
    super(fields ?? {});
    this.verboseParsingErrors = fields?.verboseParsingErrors ?? this.verboseParsingErrors;
    this.responseFormat = fields?.responseFormat ?? this.responseFormat;
    this.defaultConfig = fields?.defaultConfig ?? this.defaultConfig;
    this.metadata = fields?.metadata ?? this.metadata;
    this.extras = fields?.extras ?? this.extras;
  }
  /**
  * Invokes the tool with the provided input and configuration.
  * @param input The input for the tool.
  * @param config Optional configuration for the tool.
  * @returns A Promise that resolves with the tool's output.
  */
  async invoke(input, config) {
    let toolInput;
    let enrichedConfig = ensureConfig(mergeConfigs(this.defaultConfig, config));
    if (_isToolCall(input)) {
      toolInput = input.args;
      enrichedConfig = {
        ...enrichedConfig,
        toolCall: input
      };
    } else toolInput = input;
    return this.call(toolInput, enrichedConfig);
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
  async call(arg, configArg, tags) {
    const inputForValidation = _isToolCall(arg) ? arg.args : arg;
    let parsed;
    if (isInteropZodSchema(this.schema)) try {
      parsed = await interopParseAsync(this.schema, inputForValidation);
    } catch (e) {
      let message = `Received tool input did not match expected schema`;
      if (this.verboseParsingErrors) message = `${message}
Details: ${e.message}`;
      if (isInteropZodError(e)) message = `${message}

${prettifyError(e)}`;
      throw new ToolInputParsingException(message, JSON.stringify(arg));
    }
    else {
      const result2 = validate(inputForValidation, this.schema);
      if (!result2.valid) {
        let message = `Received tool input did not match expected schema`;
        if (this.verboseParsingErrors) message = `${message}
Details: ${result2.errors.map((e) => `${e.keywordLocation}: ${e.error}`).join("\n")}`;
        throw new ToolInputParsingException(message, JSON.stringify(arg));
      }
      parsed = inputForValidation;
    }
    const config = parseCallbackConfigArg(configArg);
    const callbackManager_ = CallbackManager.configure(config.callbacks, this.callbacks, config.tags || tags, this.tags, config.metadata, this.metadata, { verbose: this.verbose });
    let toolCallId;
    if (_isToolCall(arg)) toolCallId = arg.id;
    if (!toolCallId && _configHasToolCallId(config)) toolCallId = config.toolCall.id;
    const runManager = await callbackManager_?.handleToolStart(this.toJSON(), typeof arg === "string" ? arg : JSON.stringify(arg), config.runId, void 0, void 0, void 0, config.runName, toolCallId);
    delete config.runId;
    let result;
    try {
      const raw = await this._call(parsed, runManager, config);
      result = isAsyncGenerator(raw) ? await consumeAsyncGenerator(raw, async (chunk) => {
        try {
          await runManager?.handleToolEvent(chunk);
        } catch (streamError) {
          await runManager?.handleToolError(streamError);
        }
      }) : raw;
    } catch (e) {
      await runManager?.handleToolError(e);
      throw e;
    }
    let content;
    let artifact;
    if (this.responseFormat === "content_and_artifact") if (Array.isArray(result) && result.length === 2) [content, artifact] = result;
    else throw new Error(`Tool response format is "content_and_artifact" but the output was not a two-tuple.
Result: ${JSON.stringify(result)}`);
    else content = result;
    const formattedOutput = _formatToolOutput({
      content,
      artifact,
      toolCallId,
      name: this.name,
      metadata: this.metadata
    });
    await runManager?.handleToolEnd(formattedOutput);
    return formattedOutput;
  }
};
var Tool = class extends StructuredTool {
  schema = objectType({ input: stringType().optional() }).transform((obj) => obj.input);
  constructor(fields) {
    super(fields);
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
  call(arg, callbacks) {
    const structuredArg = typeof arg === "string" || arg == null ? { input: arg } : arg;
    return super.call(structuredArg, callbacks);
  }
};
var DynamicTool = class extends Tool {
  static lc_name() {
    return "DynamicTool";
  }
  name;
  description;
  func;
  constructor(fields) {
    super(fields);
    this.name = fields.name;
    this.description = fields.description;
    this.func = fields.func;
    this.returnDirect = fields.returnDirect ?? this.returnDirect;
  }
  /**
  * @deprecated Use .invoke() instead. Will be removed in 0.3.0.
  */
  async call(arg, configArg) {
    const config = parseCallbackConfigArg(configArg);
    if (config.runName === void 0) config.runName = this.name;
    return super.call(arg, config);
  }
  /** @ignore */
  _call(input, runManager, parentConfig) {
    return this.func(input, runManager, parentConfig);
  }
};
var DynamicStructuredTool = class extends StructuredTool {
  static lc_name() {
    return "DynamicStructuredTool";
  }
  description;
  func;
  schema;
  constructor(fields) {
    super(fields);
    this.name = fields.name;
    this.description = fields.description;
    this.func = fields.func;
    this.returnDirect = fields.returnDirect ?? this.returnDirect;
    this.schema = fields.schema;
  }
  /**
  * @deprecated Use .invoke() instead. Will be removed in 0.3.0.
  */
  async call(arg, configArg, tags) {
    const config = parseCallbackConfigArg(configArg);
    if (config.runName === void 0) config.runName = this.name;
    return super.call(arg, config, tags);
  }
  _call(arg, runManager, parentConfig) {
    return this.func(arg, runManager, parentConfig);
  }
};
var BaseToolkit = class {
  getTools() {
    return this.tools;
  }
};
function tool(func, fields) {
  const isSimpleStringSchema = isSimpleStringZodSchema(fields.schema);
  const isStringJSONSchema = validatesOnlyStrings(fields.schema);
  if (!fields.schema || isSimpleStringSchema || isStringJSONSchema) return new DynamicTool({
    ...fields,
    description: fields.description ?? fields.schema?.description ?? `${fields.name} tool`,
    func: async (input, runManager, config) => {
      return new Promise((resolve, reject) => {
        const childConfig = patchConfig(config, { callbacks: runManager?.getChild() });
        AsyncLocalStorageProviderSingleton.runWithConfig(pickRunnableConfigKeys(childConfig), async () => {
          try {
            resolve(func(input, childConfig));
          } catch (e) {
            reject(e);
          }
        });
      });
    }
  });
  const schema = fields.schema;
  const description = fields.description ?? fields.schema.description ?? `${fields.name} tool`;
  return new DynamicStructuredTool({
    ...fields,
    description,
    schema,
    func: async (input, runManager, config) => {
      return new Promise((resolve, reject) => {
        let listener;
        const cleanup = () => {
          if (config?.signal && listener) config.signal.removeEventListener("abort", listener);
        };
        if (config?.signal) {
          listener = () => {
            cleanup();
            reject(getAbortSignalError(config.signal));
          };
          config.signal.addEventListener("abort", listener, { once: true });
        }
        const childConfig = patchConfig(config, { callbacks: runManager?.getChild() });
        AsyncLocalStorageProviderSingleton.runWithConfig(pickRunnableConfigKeys(childConfig), async () => {
          try {
            const result = await func(input, childConfig);
            if (isAsyncGenerator(result)) {
              resolve(result);
              return;
            }
            if (config?.signal?.aborted) {
              cleanup();
              return;
            }
            cleanup();
            resolve(result);
          } catch (e) {
            cleanup();
            reject(e);
          }
        });
      });
    }
  });
}
function _isMessageContentBlockShaped(item) {
  return typeof item === "object" && item !== null && "type" in item;
}
function _formatToolOutput(params) {
  const { content, artifact, toolCallId, metadata } = params;
  if (toolCallId && !isDirectToolOutput(content)) if (typeof content === "string" || Array.isArray(content) && content.every(_isMessageContentBlockShaped)) return new ToolMessage({
    status: "success",
    content,
    artifact,
    tool_call_id: toolCallId,
    name: params.name,
    metadata
  });
  else return new ToolMessage({
    status: "success",
    content: _stringify$1(content),
    artifact,
    tool_call_id: toolCallId,
    name: params.name,
    metadata
  });
  else return content;
}
function _stringify$1(content) {
  try {
    return JSON.stringify(content) ?? "";
  } catch (_noOp) {
    return `${content}`;
  }
}
var openai_tools_exports = /* @__PURE__ */ __exportAll({
  JsonOutputKeyToolsParser: () => JsonOutputKeyToolsParser,
  JsonOutputToolsParser: () => JsonOutputToolsParser,
  convertLangChainToolCallToOpenAI: () => convertLangChainToolCallToOpenAI,
  makeInvalidToolCall: () => makeInvalidToolCall,
  parseToolCall: () => parseToolCall
});
var embeddings_exports = /* @__PURE__ */ __exportAll({ Embeddings: () => Embeddings });
var Embeddings = class {
  /**
  * The async caller should be used by subclasses to make any async calls,
  * which will thus benefit from the concurrency and retry logic.
  */
  caller;
  constructor(params) {
    this.caller = new AsyncCaller(params ?? {});
  }
};
var chunk_array_exports = /* @__PURE__ */ __exportAll({ chunkArray: () => chunkArray });
const chunkArray = (arr2, chunkSize) => arr2.reduce((chunks, elem, index2) => {
  const chunkIndex = Math.floor(index2 / chunkSize);
  chunks[chunkIndex] = (chunks[chunkIndex] || []).concat([elem]);
  return chunks;
}, []);
var llms_exports = /* @__PURE__ */ __exportAll({
  BaseLLM: () => BaseLLM,
  LLM: () => LLM
});
var BaseLLM = class BaseLLM2 extends BaseLanguageModel {
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
  async invoke(input, options) {
    const promptValue = BaseLLM2._convertInputToPromptValue(input);
    return (await this.generatePrompt([promptValue], options, options?.callbacks)).generations[0][0].text;
  }
  async *_streamResponseChunks(_input, _options, _runManager) {
    throw new Error("Not implemented.");
  }
  _separateRunnableConfigFromCallOptionsCompat(options) {
    const [runnableConfig, callOptions] = super._separateRunnableConfigFromCallOptions(options);
    callOptions.signal = runnableConfig.signal;
    return [runnableConfig, callOptions];
  }
  async *_streamIterator(input, options) {
    if (this._streamResponseChunks === BaseLLM2.prototype._streamResponseChunks) yield this.invoke(input, options);
    else {
      const prompt = BaseLLM2._convertInputToPromptValue(input);
      const [runnableConfig, callOptions] = this._separateRunnableConfigFromCallOptionsCompat(options);
      const invocationParams = this.invocationParams(callOptions);
      const callbackManager_ = await CallbackManager.configure(runnableConfig.callbacks, this.callbacks, runnableConfig.tags, this.tags, runnableConfig.metadata, this.metadata, {
        verbose: this.verbose,
        tracerInheritableMetadata: this._filterInvocationParamsForTracing(invocationParams)
      });
      const extra = {
        options: callOptions,
        invocation_params: invocationParams,
        batch_size: 1
      };
      const runManagers = await callbackManager_?.handleLLMStart(this.toJSON(), [prompt.toString()], runnableConfig.runId, void 0, extra, void 0, void 0, runnableConfig.runName);
      let generation = new GenerationChunk({ text: "" });
      try {
        for await (const chunk of this._streamResponseChunks(prompt.toString(), callOptions, runManagers?.[0])) {
          if (!generation) generation = chunk;
          else generation = generation.concat(chunk);
          if (typeof chunk.text === "string") yield chunk.text;
        }
      } catch (err) {
        await Promise.all((runManagers ?? []).map((runManager) => runManager?.handleLLMError(err)));
        throw err;
      }
      await Promise.all((runManagers ?? []).map((runManager) => runManager?.handleLLMEnd({ generations: [[generation]] })));
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
  async generatePrompt(promptValues, options, callbacks) {
    const prompts = promptValues.map((promptValue) => promptValue.toString());
    return this.generate(prompts, options, callbacks);
  }
  /**
  * Get the parameters used to invoke the model
  */
  invocationParams(_options) {
    return {};
  }
  _flattenLLMResult(llmResult) {
    const llmResults = [];
    for (let i = 0; i < llmResult.generations.length; i += 1) {
      const genList = llmResult.generations[i];
      if (i === 0) llmResults.push({
        generations: [genList],
        llmOutput: llmResult.llmOutput
      });
      else {
        const llmOutput = llmResult.llmOutput ? {
          ...llmResult.llmOutput,
          tokenUsage: {}
        } : void 0;
        llmResults.push({
          generations: [genList],
          llmOutput
        });
      }
    }
    return llmResults;
  }
  /** @ignore */
  async _generateUncached(prompts, parsedOptions, handledOptions, startedRunManagers) {
    let runManagers;
    if (startedRunManagers !== void 0 && startedRunManagers.length === prompts.length) runManagers = startedRunManagers;
    else {
      const invocationParams = this.invocationParams(parsedOptions);
      const callbackManager_ = await CallbackManager.configure(handledOptions.callbacks, this.callbacks, handledOptions.tags, this.tags, handledOptions.metadata, this.metadata, {
        verbose: this.verbose,
        tracerInheritableMetadata: this._filterInvocationParamsForTracing(invocationParams)
      });
      const extra = {
        options: parsedOptions,
        invocation_params: invocationParams,
        batch_size: prompts.length
      };
      runManagers = await callbackManager_?.handleLLMStart(this.toJSON(), prompts, handledOptions.runId, void 0, extra, void 0, void 0, handledOptions?.runName);
    }
    const hasStreamingHandler = !!runManagers?.[0].handlers.find(callbackHandlerPrefersStreaming);
    let output;
    if (hasStreamingHandler && prompts.length === 1 && this._streamResponseChunks !== BaseLLM2.prototype._streamResponseChunks) try {
      const stream = await this._streamResponseChunks(prompts[0], parsedOptions, runManagers?.[0]);
      let aggregated;
      for await (const chunk of stream) if (aggregated === void 0) aggregated = chunk;
      else aggregated = concat$1(aggregated, chunk);
      if (aggregated === void 0) throw new Error("Received empty response from chat model call.");
      output = {
        generations: [[aggregated]],
        llmOutput: {}
      };
      await runManagers?.[0].handleLLMEnd(output);
    } catch (e) {
      await runManagers?.[0].handleLLMError(e);
      throw e;
    }
    else {
      try {
        output = await this._generate(prompts, parsedOptions, runManagers?.[0]);
      } catch (err) {
        await Promise.all((runManagers ?? []).map((runManager) => runManager?.handleLLMError(err)));
        throw err;
      }
      const flattenedOutputs = this._flattenLLMResult(output);
      await Promise.all((runManagers ?? []).map((runManager, i) => runManager?.handleLLMEnd(flattenedOutputs[i])));
    }
    const runIds = runManagers?.map((manager) => manager.runId) || void 0;
    Object.defineProperty(output, RUN_KEY, {
      value: runIds ? { runIds } : void 0,
      configurable: true
    });
    return output;
  }
  async _generateCached({ prompts, cache, llmStringKey, parsedOptions, handledOptions, runId }) {
    const invocationParams = this.invocationParams(parsedOptions);
    const callbackManager_ = await CallbackManager.configure(handledOptions.callbacks, this.callbacks, handledOptions.tags, this.tags, handledOptions.metadata, this.metadata, {
      verbose: this.verbose,
      tracerInheritableMetadata: this._filterInvocationParamsForTracing(invocationParams)
    });
    const extra = {
      options: parsedOptions,
      invocation_params: invocationParams,
      batch_size: prompts.length
    };
    const runManagers = await callbackManager_?.handleLLMStart(this.toJSON(), prompts, runId, void 0, extra, void 0, void 0, handledOptions?.runName);
    const missingPromptIndices = [];
    const cachedResults = (await Promise.allSettled(prompts.map(async (prompt, index2) => {
      const result = await cache.lookup(prompt, llmStringKey);
      if (result == null) missingPromptIndices.push(index2);
      return result;
    }))).map((result, index2) => ({
      result,
      runManager: runManagers?.[index2]
    })).filter(({ result }) => result.status === "fulfilled" && result.value != null || result.status === "rejected");
    const generations = [];
    await Promise.all(cachedResults.map(async ({ result: promiseResult, runManager }, i) => {
      if (promiseResult.status === "fulfilled") {
        const result = promiseResult.value;
        generations[i] = result.map((result2) => {
          result2.generationInfo = {
            ...result2.generationInfo,
            tokenUsage: {}
          };
          return result2;
        });
        if (result.length) await runManager?.handleLLMNewToken(result[0].text);
        return runManager?.handleLLMEnd({ generations: [result] }, void 0, void 0, void 0, { cached: true });
      } else {
        await runManager?.handleLLMError(promiseResult.reason, void 0, void 0, void 0, { cached: true });
        return Promise.reject(promiseResult.reason);
      }
    }));
    const output = {
      generations,
      missingPromptIndices,
      startedRunManagers: runManagers
    };
    Object.defineProperty(output, RUN_KEY, {
      value: runManagers ? { runIds: runManagers?.map((manager) => manager.runId) } : void 0,
      configurable: true
    });
    return output;
  }
  /**
  * Run the LLM on the given prompts and input, handling caching.
  */
  async generate(prompts, options, callbacks) {
    if (!Array.isArray(prompts)) throw new Error("Argument 'prompts' is expected to be a string[]");
    let parsedOptions;
    if (Array.isArray(options)) parsedOptions = { stop: options };
    else parsedOptions = options;
    const [runnableConfig, callOptions] = this._separateRunnableConfigFromCallOptionsCompat(parsedOptions);
    runnableConfig.callbacks = runnableConfig.callbacks ?? callbacks;
    if (!this.cache) return this._generateUncached(prompts, callOptions, runnableConfig);
    const { cache } = this;
    const llmStringKey = this._getSerializedCacheKeyParametersForCall(callOptions);
    const { generations, missingPromptIndices, startedRunManagers } = await this._generateCached({
      prompts,
      cache,
      llmStringKey,
      parsedOptions: callOptions,
      handledOptions: runnableConfig,
      runId: runnableConfig.runId
    });
    let llmOutput = {};
    if (missingPromptIndices.length > 0) {
      const results = await this._generateUncached(missingPromptIndices.map((i) => prompts[i]), callOptions, runnableConfig, startedRunManagers !== void 0 ? missingPromptIndices.map((i) => startedRunManagers?.[i]) : void 0);
      await Promise.all(results.generations.map(async (generation, index2) => {
        const promptIndex = missingPromptIndices[index2];
        generations[promptIndex] = generation;
        return cache.update(prompts[promptIndex], llmStringKey, generation);
      }));
      llmOutput = results.llmOutput ?? {};
    }
    return {
      generations,
      llmOutput
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
};
var LLM = class extends BaseLLM {
  async _generate(prompts, options, runManager) {
    return { generations: await Promise.all(prompts.map((prompt, promptIndex) => this._call(prompt, {
      ...options,
      promptIndex
    }, runManager).then((text) => [{ text }]))) };
  }
};
const MODEL_PROVIDER_CONFIG = {
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
    hasCircularDependency: true
  },
  perplexity: {
    package: "@langchain/perplexity",
    className: "ChatPerplexity"
  }
};
const SUPPORTED_PROVIDERS = Object.keys(MODEL_PROVIDER_CONFIG);
async function getChatModelByClassName(className, modelProvider) {
  let config;
  if (modelProvider) config = MODEL_PROVIDER_CONFIG[modelProvider];
  else {
    const providerEntry = Object.entries(MODEL_PROVIDER_CONFIG).find(([, c]) => c.className === className);
    config = providerEntry ? providerEntry[1] : void 0;
  }
  if (!config) return;
  try {
    return (await import(config.package))[config.className];
  } catch (e) {
    const err = e;
    if ("code" in err && err.code?.toString().includes("ERR_MODULE_NOT_FOUND") && "message" in err && typeof err.message === "string") {
      const attemptedPackage = (err.message.startsWith("Error: ") ? err.message.slice(7) : err.message).split("Cannot find package '")[1].split("'")[0];
      throw new Error(`Unable to import ${attemptedPackage}. Please install with \`npm install ${attemptedPackage}\` or \`pnpm install ${attemptedPackage}\``);
    }
    throw e;
  }
}
async function _initChatModelHelper(model, modelProvider, params = {}) {
  const modelProviderCopy = modelProvider || _inferModelProvider(model);
  if (!modelProviderCopy) throw new Error(`Unable to infer model provider for { model: ${model} }, please specify modelProvider directly.`);
  const config = MODEL_PROVIDER_CONFIG[modelProviderCopy];
  if (!config) {
    const supported = SUPPORTED_PROVIDERS.join(", ");
    throw new Error(`Unsupported { modelProvider: ${modelProviderCopy} }.

Supported model providers are: ${supported}`);
  }
  const { modelProvider: _unused, ...passedParams } = params;
  return new (await getChatModelByClassName(config.className, modelProviderCopy))({
    model,
    ...passedParams
  });
}
function _inferModelProvider(modelName) {
  if (modelName.startsWith("gpt-3") || modelName.startsWith("gpt-4") || modelName.startsWith("gpt-5") || modelName.startsWith("o1") || modelName.startsWith("o3") || modelName.startsWith("o4")) return "openai";
  else if (modelName.startsWith("claude")) return "anthropic";
  else if (modelName.startsWith("command")) return "cohere";
  else if (modelName.startsWith("accounts/fireworks")) return "fireworks";
  else if (modelName.startsWith("gemini")) return "google-vertexai";
  else if (modelName.startsWith("amazon.")) return "bedrock";
  else if (modelName.startsWith("mistral")) return "mistralai";
  else if (modelName.startsWith("sonar") || modelName.startsWith("pplx")) return "perplexity";
  else return;
}
var ConfigurableModel = class ConfigurableModel2 extends BaseChatModel {
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
  constructor(fields) {
    super(fields);
    this._defaultConfig = fields.defaultConfig ?? {};
    if (fields.configurableFields === "any") this._configurableFields = "any";
    else this._configurableFields = fields.configurableFields ?? ["model", "modelProvider"];
    if (fields.configPrefix) this._configPrefix = fields.configPrefix.endsWith("_") ? fields.configPrefix : `${fields.configPrefix}_`;
    else this._configPrefix = "";
    this._queuedMethodOperations = fields.queuedMethodOperations ?? this._queuedMethodOperations;
    this._profile = fields.profile ?? void 0;
    this.metadata = {
      ...this.metadata,
      ls_integration: "langchain_init_chat_model"
    };
  }
  async _getModelInstance(config) {
    const cacheKey = this._getCacheKey(config);
    const cachedModel = this._modelInstanceCache.get(cacheKey);
    if (cachedModel) return cachedModel;
    const params = {
      ...this._defaultConfig,
      ...this._modelParams(config)
    };
    let initializedModel = await _initChatModelHelper(params.model, params.modelProvider, params);
    for (const [method, args] of Object.entries(this._queuedMethodOperations)) if (method in initializedModel && typeof initializedModel[method] === "function") initializedModel = await initializedModel[method](...args);
    this._modelInstanceCache.set(cacheKey, initializedModel);
    return initializedModel;
  }
  async _generate(messages, options, runManager) {
    return (await this._getModelInstance(options))._generate(messages, options ?? {}, runManager);
  }
  bindTools(tools, params) {
    const newQueuedOperations = { ...this._queuedMethodOperations };
    newQueuedOperations.bindTools = [tools, params];
    return new ConfigurableModel2({
      defaultConfig: this._defaultConfig,
      configurableFields: this._configurableFields,
      configPrefix: this._configPrefix,
      queuedMethodOperations: newQueuedOperations
    });
  }
  withStructuredOutput = (schema, ...args) => {
    const newQueuedOperations = { ...this._queuedMethodOperations };
    newQueuedOperations.withStructuredOutput = [schema, ...args];
    return new ConfigurableModel2({
      defaultConfig: this._defaultConfig,
      configurableFields: this._configurableFields,
      configPrefix: this._configPrefix,
      queuedMethodOperations: newQueuedOperations
    });
  };
  _modelParams(config) {
    const configurable = config?.configurable ?? {};
    let modelParams = {};
    for (const [key, value] of Object.entries(configurable)) if (key.startsWith(this._configPrefix)) {
      const strippedKey = this._removePrefix(key, this._configPrefix);
      modelParams[strippedKey] = value;
    }
    if (this._configurableFields !== "any") modelParams = Object.fromEntries(Object.entries(modelParams).filter(([key]) => this._configurableFields.includes(key)));
    return modelParams;
  }
  _removePrefix(str, prefix) {
    return str.startsWith(prefix) ? str.slice(prefix.length) : str;
  }
  /**
  * Bind config to a Runnable, returning a new Runnable.
  * @param {RunnableConfig | undefined} [config] - The config to bind.
  * @returns {RunnableBinding<RunInput, RunOutput, CallOptions>} A new RunnableBinding with the bound config.
  */
  withConfig(config) {
    const mergedConfig = { ...config || {} };
    const modelParams = this._modelParams(mergedConfig);
    const remainingConfig = Object.fromEntries(Object.entries(mergedConfig).filter(([k]) => k !== "configurable"));
    remainingConfig.configurable = Object.fromEntries(Object.entries(mergedConfig.configurable || {}).filter(([k]) => this._configPrefix && !Object.keys(modelParams).includes(this._removePrefix(k, this._configPrefix))));
    return new RunnableBinding({
      config: mergedConfig,
      bound: new ConfigurableModel2({
        defaultConfig: {
          ...this._defaultConfig,
          ...modelParams
        },
        configurableFields: Array.isArray(this._configurableFields) ? [...this._configurableFields] : this._configurableFields,
        configPrefix: this._configPrefix,
        queuedMethodOperations: this._queuedMethodOperations
      })
    });
  }
  async invoke(input, options) {
    const model = await this._getModelInstance(options);
    const config = ensureConfig(options);
    return model.invoke(input, config);
  }
  async stream(input, options) {
    const wrappedGenerator = new AsyncGeneratorWithSetup({
      generator: await (await this._getModelInstance(options)).stream(input, options),
      config: options
    });
    await wrappedGenerator.setup;
    return IterableReadableStream.fromAsyncGenerator(wrappedGenerator);
  }
  async batch(inputs, options, batchOptions) {
    return super.batch(inputs, options, batchOptions);
  }
  async *transform(generator, options) {
    const model = await this._getModelInstance(options);
    const config = ensureConfig(options);
    yield* model.transform(generator, config);
  }
  async *streamLog(input, options, streamOptions) {
    const model = await this._getModelInstance(options);
    const config = ensureConfig(options);
    yield* model.streamLog(input, config, {
      ...streamOptions,
      _schemaFormat: "original",
      includeNames: streamOptions?.includeNames,
      includeTypes: streamOptions?.includeTypes,
      includeTags: streamOptions?.includeTags,
      excludeNames: streamOptions?.excludeNames,
      excludeTypes: streamOptions?.excludeTypes,
      excludeTags: streamOptions?.excludeTags
    });
  }
  streamEvents(input, options, streamOptions) {
    if (options?.version === "v1" || options?.version === "v2") {
      const outerThis2 = this;
      const tracingCallOptions = options;
      async function* wrappedGenerator() {
        const model = await outerThis2._getModelInstance(tracingCallOptions);
        const tracingOptions = {
          ...ensureConfig(tracingCallOptions),
          version: tracingCallOptions.version,
          ...tracingCallOptions.encoding !== void 0 ? { encoding: tracingCallOptions.encoding } : {}
        };
        let eventStream;
        if (tracingCallOptions.version === "v1" && tracingCallOptions.encoding === "text/event-stream") eventStream = model.streamEvents(input, tracingOptions, streamOptions);
        else if (tracingCallOptions.version === "v1") eventStream = model.streamEvents(input, tracingOptions, streamOptions);
        else if (tracingCallOptions.version === "v2" && tracingCallOptions.encoding === "text/event-stream") eventStream = model.streamEvents(input, tracingOptions, streamOptions);
        else eventStream = model.streamEvents(input, tracingOptions, streamOptions);
        for await (const chunk of eventStream) yield chunk;
      }
      return IterableReadableStream.fromAsyncGenerator(wrappedGenerator());
    }
    const outerThis = this;
    async function* deferredEvents() {
      const model = await outerThis._getModelInstance(options);
      const config = ensureConfig(options);
      yield* model.streamEvents(input, config);
    }
    return new ChatModelStream(deferredEvents());
  }
  /**
  * Return profiling information for the model.
  *
  * @returns {ModelProfile} An object describing the model's capabilities and constraints
  */
  get profile() {
    if (this._profile) return this._profile;
    const cacheKey = this._getCacheKey({});
    return this._modelInstanceCache.get(cacheKey)?.profile ?? {};
  }
  /** @internal */
  _getCacheKey(config) {
    let toStringify = config ?? {};
    if (toStringify.configurable) {
      const { configurable } = toStringify;
      const filtered = {};
      for (const [k, v] of Object.entries(configurable)) if (!k.startsWith("__pregel_")) filtered[k] = v;
      toStringify = {
        ...toStringify,
        configurable: filtered
      };
    }
    return JSON.stringify(toStringify);
  }
};
async function initChatModel(model, fields) {
  let { configurableFields, configPrefix, modelProvider, profile, ...params } = {
    configPrefix: "",
    ...{}
  };
  if (modelProvider === void 0 && model?.includes(":")) {
    const [provider, ...remainingParts] = model.split(":");
    const modelComponents = remainingParts.length === 0 ? [provider] : [provider, remainingParts.join(":")];
    if (SUPPORTED_PROVIDERS.includes(modelComponents[0])) [modelProvider, model] = modelComponents;
  }
  let configurableFieldsCopy = Array.isArray(configurableFields) ? [...configurableFields] : configurableFields;
  if (!model && configurableFieldsCopy === void 0) configurableFieldsCopy = ["model", "modelProvider"];
  if (configPrefix && configurableFieldsCopy === void 0) console.warn(`{ configPrefix: ${configPrefix} } has been set but no fields are configurable. Set { configurableFields: [...] } to specify the model params that are configurable.`);
  const paramsCopy = { ...params };
  let configurableModel;
  if (configurableFieldsCopy === void 0) configurableModel = new ConfigurableModel({
    defaultConfig: {
      ...paramsCopy,
      model,
      modelProvider
    },
    configPrefix,
    profile
  });
  else {
    if (model) paramsCopy.model = model;
    if (modelProvider) paramsCopy.modelProvider = modelProvider;
    configurableModel = new ConfigurableModel({
      defaultConfig: paramsCopy,
      configPrefix,
      configurableFields: configurableFieldsCopy,
      profile
    });
  }
  await configurableModel._getModelInstance();
  return configurableModel;
}
function createHeadlessTool(fields) {
  const { name, description, schema } = fields;
  const wrappedTool = tool(async (args, config) => {
    const { interrupt: interrupt2 } = await Promise.resolve().then(() => index);
    return interrupt2({
      type: "tool",
      toolCall: {
        id: config?.toolCall?.id,
        name,
        args
      }
    });
  }, {
    name,
    description,
    schema,
    metadata: { headlessTool: true }
  });
  const headlessTool = Object.assign(wrappedTool, { implement: (execute) => ({
    tool: headlessTool,
    execute
  }) });
  return headlessTool;
}
const tool$1 = ((funcOrFields, fields) => {
  if (typeof funcOrFields !== "function") return createHeadlessTool(funcOrFields);
  return tool(funcOrFields, fields);
});
function initializeAsyncLocalStorageSingleton() {
  AsyncLocalStorageProviderSingleton.initializeGlobalInstance(new AsyncLocalStorage());
}
function _coerceTimeoutMs(value, field) {
  if (value === void 0 || value === null) return;
  if (typeof value !== "number" || Number.isNaN(value) || value <= 0) throw new Error(`${field} must be greater than 0`);
  return value;
}
function coerceTimeoutPolicy(value) {
  if (value === void 0 || value === null) return;
  const policy = typeof value === "number" ? { runTimeout: value } : value;
  const refreshOn = policy.refreshOn ?? "auto";
  if (refreshOn !== "auto" && refreshOn !== "heartbeat") throw new Error('refreshOn must be "auto" or "heartbeat"');
  const runTimeout = _coerceTimeoutMs(policy.runTimeout, "runTimeout");
  const idleTimeout = _coerceTimeoutMs(policy.idleTimeout, "idleTimeout");
  if (runTimeout === void 0 && idleTimeout === void 0) return;
  return {
    runTimeout,
    idleTimeout,
    refreshOn
  };
}
const START = "__start__";
const END = "__end__";
const INPUT = "__input__";
const ERROR$1 = "__error__";
const ERROR_SOURCE_NODE = "__error_source_node__";
const CACHE_NS_WRITES = "__pregel_ns_writes";
function getDeltaMaxSuperstepsSinceSnapshot() {
  const raw = typeof process !== "undefined" ? process.env?.LANGGRAPH_DELTA_MAX_SUPERSTEPS_SINCE_SNAPSHOT : void 0;
  if (raw !== void 0 && raw !== "") {
    const parsed = Number.parseInt(raw, 10);
    if (Number.isFinite(parsed) && parsed > 0) return parsed;
  }
  return 5e3;
}
const CONFIG_KEY_SEND = "__pregel_send";
const CONFIG_KEY_CALL = "__pregel_call";
const CONFIG_KEY_READ = "__pregel_read";
const CONFIG_KEY_CHECKPOINTER = "__pregel_checkpointer";
const CONFIG_KEY_RESUMING = "__pregel_resuming";
const CONFIG_KEY_TASK_ID = "__pregel_task_id";
const CONFIG_KEY_STREAM = "__pregel_stream";
const CONFIG_KEY_RESUME_VALUE = "__pregel_resume_value";
const CONFIG_KEY_RESUME_MAP = "__pregel_resume_map";
const CONFIG_KEY_SCRATCHPAD = "__pregel_scratchpad";
const CONFIG_KEY_PREVIOUS_STATE = "__pregel_previous";
const CONFIG_KEY_DURABILITY = "__pregel_durability";
const CONFIG_KEY_CHECKPOINT_ID = "checkpoint_id";
const CONFIG_KEY_CHECKPOINT_NS = "checkpoint_ns";
const CONFIG_KEY_NODE_FINISHED = "__pregel_node_finished";
const CONFIG_KEY_NODE_ERROR = "__pregel_node_error";
const CONFIG_KEY_CHECKPOINT_MAP = "checkpoint_map";
const CONFIG_KEY_REPLAY_STATE = "__pregel_replay_state";
const CONFIG_KEY_ABORT_SIGNALS = "__pregel_abort_signals";
const INTERRUPT$1 = "__interrupt__";
const RESUME$1 = "__resume__";
const NO_WRITES = "__no_writes__";
const RETURN = "__return__";
const PREVIOUS = "__previous__";
const TAG_HIDDEN = "langsmith:hidden";
const SELF = "__self__";
const TASKS$1 = "__pregel_tasks";
const PUSH = "__pregel_push";
const PULL = "__pregel_pull";
const NULL_TASK_ID = "00000000-0000-0000-0000-000000000000";
const RESERVED = [
  TAG_HIDDEN,
  INPUT,
  INTERRUPT$1,
  RESUME$1,
  ERROR$1,
  ERROR_SOURCE_NODE,
  NO_WRITES,
  CONFIG_KEY_SEND,
  CONFIG_KEY_READ,
  CONFIG_KEY_CHECKPOINTER,
  CONFIG_KEY_DURABILITY,
  CONFIG_KEY_STREAM,
  CONFIG_KEY_RESUMING,
  CONFIG_KEY_TASK_ID,
  CONFIG_KEY_CALL,
  CONFIG_KEY_RESUME_VALUE,
  CONFIG_KEY_SCRATCHPAD,
  CONFIG_KEY_PREVIOUS_STATE,
  CONFIG_KEY_CHECKPOINT_MAP,
  CONFIG_KEY_CHECKPOINT_NS,
  CONFIG_KEY_CHECKPOINT_ID,
  CONFIG_KEY_REPLAY_STATE
];
const COMMAND_SYMBOL = /* @__PURE__ */ Symbol.for("langgraph.command");
var CommandInstance = class {
  [COMMAND_SYMBOL];
  constructor(args) {
    this[COMMAND_SYMBOL] = args;
  }
};
function _isSendInterface(x) {
  const operation = x;
  return operation !== null && operation !== void 0 && typeof operation.node === "string" && operation.args !== void 0;
}
var Send = class {
  lg_name = "Send";
  node;
  args;
  /**
  * Optional per-task timeout policy that overrides the target node's timeout
  * for this specific pushed task. A bare number is treated as a hard
  * `runTimeout` (in milliseconds).
  */
  timeout;
  constructor(node, args, options) {
    this.node = node;
    this.args = _deserializeCommandSendObjectGraph(args);
    this.timeout = coerceTimeoutPolicy(options?.timeout);
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
function _isSend(x) {
  return x instanceof Send;
}
const OVERWRITE = "__overwrite__";
var Overwrite = class {
  lg_name = "Overwrite";
  [OVERWRITE];
  constructor(value) {
    this[OVERWRITE] = value;
  }
  get value() {
    return this[OVERWRITE];
  }
  toJSON() {
    return { [OVERWRITE]: this[OVERWRITE] };
  }
  static isInstance(value) {
    if (!value || typeof value !== "object") return false;
    if ("__overwrite__" in value) return true;
    if ("lg_name" in value && value.lg_name === "Overwrite") return true;
    return false;
  }
};
function _getOverwriteValue(value) {
  if (typeof value === "object" && value !== null) {
    if ("__overwrite__" in value) return [true, value[OVERWRITE]];
    const rec = value;
    if (rec.type === "__overwrite__" && "value" in rec) return [true, rec.value];
  }
  return [false, void 0];
}
function _isOverwriteValue(value) {
  return _getOverwriteValue(value)[0];
}
function isInterrupted(values) {
  if (!values || typeof values !== "object") return false;
  if (!("__interrupt__" in values)) return false;
  return Array.isArray(values[INTERRUPT$1]);
}
var Command = class extends CommandInstance {
  lg_name = "Command";
  lc_direct_tool_output = true;
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
  constructor(args) {
    super(args);
    this.resume = args.resume;
    this.graph = args.graph;
    this.update = args.update;
    if (args.goto) this.goto = Array.isArray(args.goto) ? _deserializeCommandSendObjectGraph(args.goto) : [_deserializeCommandSendObjectGraph(args.goto)];
  }
  /**
  * Convert the update field to a list of {@link PendingWrite} tuples
  * @returns List of {@link PendingWrite} tuples of the form `[channelKey, value]`.
  * @internal
  */
  _updateAsTuples() {
    if (this.update && typeof this.update === "object" && !Array.isArray(this.update)) return Object.entries(this.update);
    else if (Array.isArray(this.update) && this.update.every((t) => Array.isArray(t) && t.length === 2 && typeof t[0] === "string")) return this.update;
    else return [["__root__", this.update]];
  }
  toJSON() {
    let serializedGoto;
    if (typeof this.goto === "string") serializedGoto = this.goto;
    else if (_isSend(this.goto)) serializedGoto = this.goto.toJSON();
    else serializedGoto = this.goto?.map((innerGoto) => {
      if (typeof innerGoto === "string") return innerGoto;
      else return innerGoto.toJSON();
    });
    return {
      lg_name: this.lg_name,
      update: this.update,
      resume: this.resume,
      goto: serializedGoto
    };
  }
};
function isCommand(x) {
  if (typeof x !== "object") return false;
  if (x === null || x === void 0) return false;
  if ("lg_name" in x && x.lg_name === "Command") return true;
  return false;
}
function isPlainObject(value) {
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}
function _deserializeCommandSendObjectGraph(x, seen = /* @__PURE__ */ new Map()) {
  if (x !== void 0 && x !== null && typeof x === "object") {
    if (seen.has(x)) return seen.get(x);
    let result;
    if (Array.isArray(x)) {
      result = [];
      seen.set(x, result);
      x.forEach((item, index2) => {
        result[index2] = _deserializeCommandSendObjectGraph(item, seen);
      });
    } else if (x instanceof Command || x instanceof Send || !isPlainObject(x)) {
      result = x;
      seen.set(x, result);
    } else if (isCommand(x)) {
      result = new Command(x);
      seen.set(x, result);
    } else if (_isSendInterface(x)) {
      result = new Send(x.node, x.args, x.timeout !== void 0 ? { timeout: x.timeout } : void 0);
      seen.set(x, result);
    } else if ("lc_serializable" in x && x.lc_serializable) {
      result = x;
      seen.set(x, result);
    } else {
      result = {};
      seen.set(x, result);
      for (const [key, value] of Object.entries(x)) result[key] = _deserializeCommandSendObjectGraph(value, seen);
    }
    return result;
  }
  return x;
}
var BaseLangGraphError = class extends Error {
  lc_error_code;
  constructor(message, fields) {
    let finalMessage = message ?? "";
    if (fields?.lc_error_code) finalMessage = `${finalMessage}

Troubleshooting URL: https://docs.langchain.com/oss/javascript/langgraph/${fields.lc_error_code}/
`;
    super(finalMessage);
    this.lc_error_code = fields?.lc_error_code;
  }
};
var GraphBubbleUp = class extends BaseLangGraphError {
  get is_bubble_up() {
    return true;
  }
};
var GraphRecursionError = class extends BaseLangGraphError {
  constructor(message, fields) {
    super(message, fields);
    this.name = "GraphRecursionError";
  }
  static get unminifiable_name() {
    return "GraphRecursionError";
  }
};
var GraphValueError = class extends BaseLangGraphError {
  constructor(message, fields) {
    super(message, fields);
    this.name = "GraphValueError";
  }
  static get unminifiable_name() {
    return "GraphValueError";
  }
};
var GraphDrained = class extends GraphBubbleUp {
  reason;
  constructor(reason = "shutdown", fields) {
    super(`Graph drained: ${reason}`, fields);
    this.name = "GraphDrained";
    this.reason = reason;
  }
  static get unminifiable_name() {
    return "GraphDrained";
  }
};
function isGraphDrained(e) {
  return e !== void 0 && e.name === GraphDrained.unminifiable_name;
}
var GraphInterrupt = class extends GraphBubbleUp {
  interrupts;
  constructor(interrupts, fields) {
    super(JSON.stringify(interrupts, null, 2), fields);
    this.name = "GraphInterrupt";
    this.interrupts = interrupts ?? [];
  }
  static get unminifiable_name() {
    return "GraphInterrupt";
  }
};
var NodeInterrupt = class extends GraphInterrupt {
  constructor(message, fields) {
    super([{ value: message }], fields);
    this.name = "NodeInterrupt";
  }
  static get unminifiable_name() {
    return "NodeInterrupt";
  }
};
var NodeError = class {
  /** Name of the node whose execution failed. */
  node;
  /** Error thrown by the failed node. */
  error;
  constructor(node, error) {
    this.node = node;
    this.error = error;
  }
  static get unminifiable_name() {
    return "NodeError";
  }
};
function isNodeError(e) {
  return e != null && typeof e === "object" && e.constructor != null && e.constructor.unminifiable_name === NodeError.unminifiable_name;
}
var ParentCommand = class extends GraphBubbleUp {
  command;
  constructor(command) {
    super();
    this.name = "ParentCommand";
    this.command = command;
  }
  static get unminifiable_name() {
    return "ParentCommand";
  }
};
function isParentCommand(e) {
  return e !== void 0 && e.name === ParentCommand.unminifiable_name;
}
function isGraphBubbleUp(e) {
  return e !== void 0 && e.is_bubble_up === true;
}
function isGraphInterrupt(e) {
  return e !== void 0 && [GraphInterrupt.unminifiable_name, NodeInterrupt.unminifiable_name].includes(e.name);
}
var NodeTimeoutError = class extends BaseLangGraphError {
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
  constructor(fields, errorFields) {
    const { node, elapsed, kind, runTimeout, idleTimeout } = fields;
    let message;
    let timeout;
    if (kind === "idle") {
      if (idleTimeout === void 0) throw new Error("idleTimeout is required when kind='idle'");
      timeout = idleTimeout;
      message = `Node "${node}" exceeded its idle timeout of ${idleTimeout}ms without making progress (elapsed: ${elapsed}ms).`;
    } else {
      if (runTimeout === void 0) throw new Error("runTimeout is required when kind='run'");
      timeout = runTimeout;
      message = `Node "${node}" exceeded its run timeout of ${runTimeout}ms (elapsed: ${elapsed}ms).`;
    }
    super(message, errorFields);
    this.name = "NodeTimeoutError";
    this.node = node;
    this.kind = kind;
    this.timeout = timeout;
    this.elapsed = elapsed;
    this.runTimeout = runTimeout;
    this.idleTimeout = idleTimeout;
  }
  static get unminifiable_name() {
    return "NodeTimeoutError";
  }
};
function isNodeTimeoutError(e) {
  return e !== void 0 && e.name === NodeTimeoutError.unminifiable_name;
}
var EmptyInputError = class extends BaseLangGraphError {
  constructor(message, fields) {
    super(message, fields);
    this.name = "EmptyInputError";
  }
  static get unminifiable_name() {
    return "EmptyInputError";
  }
};
var EmptyChannelError = class extends BaseLangGraphError {
  constructor(message, fields) {
    const prevLimit = Error.stackTraceLimit;
    Error.stackTraceLimit = 0;
    super(message, fields);
    Error.stackTraceLimit = prevLimit;
    this.name = "EmptyChannelError";
  }
  static get unminifiable_name() {
    return "EmptyChannelError";
  }
};
var InvalidUpdateError = class extends BaseLangGraphError {
  constructor(message, fields) {
    super(message, fields);
    this.name = "InvalidUpdateError";
  }
  static get unminifiable_name() {
    return "InvalidUpdateError";
  }
};
var MultipleSubgraphsError = class extends BaseLangGraphError {
  constructor(message, fields) {
    super(message, fields);
    this.name = "MultipleSubgraphError";
  }
  static get unminifiable_name() {
    return "MultipleSubgraphError";
  }
};
var UnreachableNodeError = class extends BaseLangGraphError {
  constructor(message, fields) {
    super(message, fields);
    this.name = "UnreachableNodeError";
  }
  static get unminifiable_name() {
    return "UnreachableNodeError";
  }
};
var RemoteException = class extends BaseLangGraphError {
  constructor(message, fields) {
    super(message, fields);
    this.name = "RemoteException";
  }
  static get unminifiable_name() {
    return "RemoteException";
  }
};
var StateGraphInputError = class extends BaseLangGraphError {
  /**
  * Create a new StateGraphInputError.
  * @param message - Optional custom error message.
  * @param fields - Optional additional error fields.
  */
  constructor(message, fields) {
    super(message, fields);
    this.name = "StateGraphInputError";
    this.message = "Invalid StateGraph input. Make sure to pass a valid StateDefinition, Annotation.Root, or Zod schema.";
  }
  /**
  * The unminifiable (static, human-readable) error name for this error class.
  */
  static get unminifiable_name() {
    return "StateGraphInputError";
  }
};
const getSubgraphsSeenSet = () => {
  if (globalThis[/* @__PURE__ */ Symbol.for("LG_CHECKPOINT_SEEN_NS_SET")] === void 0) globalThis[/* @__PURE__ */ Symbol.for("LG_CHECKPOINT_SEEN_NS_SET")] = /* @__PURE__ */ new Set();
  return globalThis[/* @__PURE__ */ Symbol.for("LG_CHECKPOINT_SEEN_NS_SET")];
};
let lastMsecs = 0;
let lastNsecs = 0;
function uuid6(clockseq) {
  let msecs = Date.now();
  if (msecs <= lastMsecs) {
    lastNsecs += 1;
    if (lastNsecs >= 1e4) {
      lastNsecs = 0;
      msecs = lastMsecs + 1;
    }
  } else lastNsecs = 0;
  lastMsecs = msecs;
  return v6({
    clockseq,
    msecs,
    nsecs: lastNsecs
  });
}
function uuid5(name, namespace) {
  const namespaceBytes = namespace.replace(/-/g, "").match(/.{2}/g).map((byte) => parseInt(byte, 16));
  return v5(name, new Uint8Array(namespaceBytes));
}
const TASKS = "__pregel_tasks";
const ERROR = "__error__";
const SCHEDULED = "__scheduled__";
const INTERRUPT = "__interrupt__";
const RESUME = "__resume__";
var DeltaSnapshot = class {
  /** Marker used for structural detection across module/realm boundaries. */
  lg_name = "DeltaSnapshot";
  value;
  constructor(value) {
    this.value = value;
  }
};
function isDeltaSnapshot(value) {
  return value != null && typeof value === "object" && value.lg_name === "DeltaSnapshot";
}
var LIMIT_REPLACE_NODE = "[...]";
var CIRCULAR_REPLACE_NODE = "[Circular]";
var arr = [];
var replacerStack = [];
function defaultOptions() {
  return {
    depthLimit: Number.MAX_SAFE_INTEGER,
    edgesLimit: Number.MAX_SAFE_INTEGER
  };
}
function stringify(obj, replacer, spacer, options) {
  if (typeof options === "undefined") options = defaultOptions();
  decirc(obj, "", 0, [], void 0, 0, options);
  var res;
  try {
    if (replacerStack.length === 0) res = JSON.stringify(obj, replacer, spacer);
    else res = JSON.stringify(obj, replaceGetterValues(replacer), spacer);
  } catch (_) {
    return JSON.stringify("[unable to serialize, circular reference is too complex to analyze]");
  } finally {
    while (arr.length !== 0) {
      var part = arr.pop();
      if (part.length === 4) Object.defineProperty(part[0], part[1], part[3]);
      else part[0][part[1]] = part[2];
    }
  }
  return res;
}
function setReplace(replace, val, k, parent) {
  var propertyDescriptor = Object.getOwnPropertyDescriptor(parent, k);
  if (propertyDescriptor.get !== void 0) if (propertyDescriptor.configurable) {
    Object.defineProperty(parent, k, { value: replace });
    arr.push([
      parent,
      k,
      val,
      propertyDescriptor
    ]);
  } else replacerStack.push([
    val,
    k,
    replace
  ]);
  else {
    parent[k] = replace;
    arr.push([
      parent,
      k,
      val
    ]);
  }
}
function decirc(val, k, edgeIndex, stack, parent, depth, options) {
  depth += 1;
  var i;
  if (typeof val === "object" && val !== null) {
    for (i = 0; i < stack.length; i++) if (stack[i] === val) {
      setReplace(CIRCULAR_REPLACE_NODE, val, k, parent);
      return;
    }
    if (typeof options.depthLimit !== "undefined" && depth > options.depthLimit) {
      setReplace(LIMIT_REPLACE_NODE, val, k, parent);
      return;
    }
    if (typeof options.edgesLimit !== "undefined" && edgeIndex + 1 > options.edgesLimit) {
      setReplace(LIMIT_REPLACE_NODE, val, k, parent);
      return;
    }
    stack.push(val);
    if (Array.isArray(val)) for (i = 0; i < val.length; i++) decirc(val[i], i, i, stack, val, depth, options);
    else {
      var keys = Object.keys(val);
      for (i = 0; i < keys.length; i++) {
        var key = keys[i];
        decirc(val[key], key, i, stack, val, depth, options);
      }
    }
    stack.pop();
  }
}
function replaceGetterValues(replacer) {
  replacer = typeof replacer !== "undefined" ? replacer : function(k, v) {
    return v;
  };
  return function(key, val) {
    if (replacerStack.length > 0) for (var i = 0; i < replacerStack.length; i++) {
      var part = replacerStack[i];
      if (part[1] === key && part[0] === val) {
        val = part[2];
        replacerStack.splice(i, 1);
        break;
      }
    }
    return replacer.call(this, key, val);
  };
}
const optionalImportEntrypoints = [];
var src_exports = /* @__PURE__ */ __exportAll({});
var agents_exports = /* @__PURE__ */ __exportAll({});
var chat_history_exports = /* @__PURE__ */ __exportAll({
  BaseChatMessageHistory: () => BaseChatMessageHistory,
  BaseListChatMessageHistory: () => BaseListChatMessageHistory,
  InMemoryChatMessageHistory: () => InMemoryChatMessageHistory
});
var BaseChatMessageHistory = class extends Serializable {
  /**
  * Add a list of messages.
  *
  * Implementations should override this method to handle bulk addition of messages
  * in an efficient manner to avoid unnecessary round-trips to the underlying store.
  *
  * @param messages - A list of BaseMessage objects to store.
  */
  async addMessages(messages) {
    for (const message of messages) await this.addMessage(message);
  }
};
var BaseListChatMessageHistory = class extends Serializable {
  /**
  * This is a convenience method for adding a human message string to the store.
  * Please note that this is a convenience method. Code should favor the
  * bulk addMessages interface instead to save on round-trips to the underlying
  * persistence layer.
  * This method may be deprecated in a future release.
  */
  addUserMessage(message) {
    return this.addMessage(new HumanMessage(message));
  }
  /**
  * This is a convenience method for adding an AI message string to the store.
  * Please note that this is a convenience method. Code should favor the bulk
  * addMessages interface instead to save on round-trips to the underlying
  * persistence layer.
  * This method may be deprecated in a future release.
  */
  addAIMessage(message) {
    return this.addMessage(new AIMessage(message));
  }
  /**
  * Add a list of messages.
  *
  * Implementations should override this method to handle bulk addition of messages
  * in an efficient manner to avoid unnecessary round-trips to the underlying store.
  *
  * @param messages - A list of BaseMessage objects to store.
  */
  async addMessages(messages) {
    for (const message of messages) await this.addMessage(message);
  }
  /**
  * Remove all messages from the store.
  */
  clear() {
    throw new Error("Not implemented.");
  }
};
var InMemoryChatMessageHistory = class extends BaseListChatMessageHistory {
  lc_namespace = [
    "langchain",
    "stores",
    "message",
    "in_memory"
  ];
  messages = [];
  constructor(messages) {
    super(...arguments);
    this.messages = messages ?? [];
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
  async addMessage(message) {
    this.messages.push(message);
  }
  /**
  * Method to clear all the messages from the ChatMessageHistory instance.
  * @returns A promise that resolves when all messages have been cleared.
  */
  async clear() {
    this.messages = [];
  }
};
var Document = class {
  pageContent;
  metadata;
  /**
  * An optional identifier for the document.
  *
  * Ideally this should be unique across the document collection and formatted
  * as a UUID, but this will not be enforced.
  */
  id;
  constructor(fields) {
    this.pageContent = fields.pageContent !== void 0 ? fields.pageContent.toString() : "";
    this.metadata = fields.metadata ?? {};
    this.id = fields.id;
  }
};
var BaseDocumentTransformer = class extends Runnable {
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
  invoke(input, _options) {
    return this.transformDocuments(input);
  }
};
var MappingDocumentTransformer = class extends BaseDocumentTransformer {
  async transformDocuments(documents) {
    const newDocuments = [];
    for (const document of documents) {
      const transformedDocument = await this._transformDocument(document);
      newDocuments.push(transformedDocument);
    }
    return newDocuments;
  }
};
var documents_exports = /* @__PURE__ */ __exportAll({
  BaseDocumentTransformer: () => BaseDocumentTransformer,
  Document: () => Document,
  MappingDocumentTransformer: () => MappingDocumentTransformer
});
var base_exports = /* @__PURE__ */ __exportAll({ BaseDocumentLoader: () => BaseDocumentLoader });
var BaseDocumentLoader = class {
};
var langsmith_exports = /* @__PURE__ */ __exportAll({ LangSmithLoader: () => LangSmithLoader });
var LangSmithLoader = class extends BaseDocumentLoader {
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
  constructor(fields) {
    super();
    if (fields.client && fields.clientConfig) throw new Error("client and clientConfig cannot both be provided.");
    this.client = fields.client ?? new Client(fields?.clientConfig);
    this.contentKey = fields.contentKey ? fields.contentKey.split(".") : [];
    this.formatContent = fields.formatContent ?? _stringify;
    this.datasetId = fields.datasetId;
    this.datasetName = fields.datasetName;
    this.exampleIds = fields.exampleIds;
    this.asOf = fields.asOf;
    this.splits = fields.splits;
    this.inlineS3Urls = fields.inlineS3Urls;
    this.offset = fields.offset;
    this.limit = fields.limit;
    this.metadata = fields.metadata;
    this.filter = fields.filter;
  }
  async load() {
    const documents = [];
    for await (const example of this.client.listExamples({
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
      let content = example.inputs;
      for (const key of this.contentKey) content = content[key];
      const contentStr = this.formatContent(content);
      const metadata = example;
      ["created_at", "modified_at"].forEach((k) => {
        if (k in metadata) {
          if (typeof metadata[k] === "object") metadata[k] = metadata[k].toString();
        }
      });
      documents.push({
        pageContent: contentStr,
        metadata
      });
    }
    return documents;
  }
};
function _stringify(x) {
  if (typeof x === "string") return x;
  else try {
    return JSON.stringify(x, null, 2);
  } catch {
    return String(x);
  }
}
var BaseExampleSelector = class extends Serializable {
  lc_namespace = [
    "langchain_core",
    "example_selectors",
    "base"
  ];
};
var BasePromptSelector = class {
  /**
  * Asynchronous version of `getPrompt` that also accepts an options object
  * for partial variables.
  * @param llm The language model for which to get a prompt.
  * @param options Optional object for partial variables.
  * @returns A Promise that resolves to a prompt template.
  */
  async getPromptAsync(llm, options) {
    return this.getPrompt(llm).partial(options?.partialVariables ?? {});
  }
};
var ConditionalPromptSelector = class extends BasePromptSelector {
  defaultPrompt;
  conditionals;
  constructor(default_prompt, conditionals = []) {
    super();
    this.defaultPrompt = default_prompt;
    this.conditionals = conditionals;
  }
  /**
  * Method that selects a prompt based on a set of conditions. If none of
  * the conditions are met, it returns the default prompt.
  * @param llm The language model for which to get a prompt.
  * @returns A prompt template.
  */
  getPrompt(llm) {
    for (const [condition, prompt] of this.conditionals) if (condition(llm)) return prompt;
    return this.defaultPrompt;
  }
};
function isLLM(llm) {
  return llm._modelType() === "base_llm";
}
function isChatModel(llm) {
  return llm._modelType() === "base_chat_model";
}
function getLengthBased(text) {
  return text.split(/\n| /).length;
}
var LengthBasedExampleSelector = class LengthBasedExampleSelector2 extends BaseExampleSelector {
  examples = [];
  examplePrompt;
  getTextLength = getLengthBased;
  maxLength = 2048;
  exampleTextLengths = [];
  constructor(data) {
    super(data);
    this.examplePrompt = data.examplePrompt;
    this.maxLength = data.maxLength ?? 2048;
    this.getTextLength = data.getTextLength ?? getLengthBased;
  }
  /**
  * Adds an example to the list of examples and calculates its length.
  * @param example The example to be added.
  * @returns Promise that resolves when the example has been added and its length calculated.
  */
  async addExample(example) {
    this.examples.push(example);
    const stringExample = await this.examplePrompt.format(example);
    this.exampleTextLengths.push(this.getTextLength(stringExample));
  }
  /**
  * Calculates the lengths of the examples.
  * @param v Array of lengths of the examples.
  * @param values Instance of LengthBasedExampleSelector.
  * @returns Promise that resolves with an array of lengths of the examples.
  */
  async calculateExampleTextLengths(v, values) {
    if (v.length > 0) return v;
    const { examples, examplePrompt } = values;
    return (await Promise.all(examples.map((eg) => examplePrompt.format(eg)))).map((eg) => this.getTextLength(eg));
  }
  /**
  * Selects examples until the total length of the selected examples
  * reaches the maxLength.
  * @param inputVariables The input variables for the examples.
  * @returns Promise that resolves with an array of selected examples.
  */
  async selectExamples(inputVariables) {
    const inputs = Object.values(inputVariables).join(" ");
    let remainingLength = this.maxLength - this.getTextLength(inputs);
    let i = 0;
    const examples = [];
    while (remainingLength > 0 && i < this.examples.length) {
      const newLength = remainingLength - this.exampleTextLengths[i];
      if (newLength < 0) break;
      else {
        examples.push(this.examples[i]);
        remainingLength = newLength;
      }
      i += 1;
    }
    return examples;
  }
  /**
  * Creates a new instance of LengthBasedExampleSelector and adds a list of
  * examples to it.
  * @param examples Array of examples to be added.
  * @param args Input parameters for the LengthBasedExampleSelector.
  * @returns Promise that resolves with a new instance of LengthBasedExampleSelector with the examples added.
  */
  static async fromExamples(examples, args) {
    const selector = new LengthBasedExampleSelector2(args);
    await Promise.all(examples.map((eg) => selector.addExample(eg)));
    return selector;
  }
};
function sortedValues(values) {
  return Object.keys(values).sort().map((key) => values[key]);
}
var SemanticSimilarityExampleSelector = class SemanticSimilarityExampleSelector2 extends BaseExampleSelector {
  vectorStoreRetriever;
  exampleKeys;
  inputKeys;
  constructor(data) {
    super(data);
    this.exampleKeys = data.exampleKeys;
    this.inputKeys = data.inputKeys;
    if (data.vectorStore !== void 0) this.vectorStoreRetriever = data.vectorStore.asRetriever({
      k: data.k ?? 4,
      filter: data.filter
    });
    else if (data.vectorStoreRetriever) this.vectorStoreRetriever = data.vectorStoreRetriever;
    else throw new Error(`You must specify one of "vectorStore" and "vectorStoreRetriever".`);
  }
  /**
  * Method that adds a new example to the vectorStore. The example is
  * converted to a string and added to the vectorStore as a document.
  * @param example The example to be added to the vectorStore.
  * @returns Promise that resolves when the example has been added to the vectorStore.
  */
  async addExample(example) {
    const stringExample = sortedValues((this.inputKeys ?? Object.keys(example)).reduce((acc, key) => ({
      ...acc,
      [key]: example[key]
    }), {})).join(" ");
    await this.vectorStoreRetriever.addDocuments([new Document({
      pageContent: stringExample,
      metadata: example
    })]);
  }
  /**
  * Method that selects which examples to use based on semantic similarity.
  * It performs a similarity search in the vectorStore using the input
  * variables and returns the examples with the highest similarity.
  * @param inputVariables The input variables used for the similarity search.
  * @returns Promise that resolves with an array of the selected examples.
  */
  async selectExamples(inputVariables) {
    const query = sortedValues((this.inputKeys ?? Object.keys(inputVariables)).reduce((acc, key) => ({
      ...acc,
      [key]: inputVariables[key]
    }), {})).join(" ");
    const examples = (await this.vectorStoreRetriever.invoke(query)).map((doc) => doc.metadata);
    if (this.exampleKeys) return examples.map((example) => this.exampleKeys.reduce((acc, key) => ({
      ...acc,
      [key]: example[key]
    }), {}));
    return examples;
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
  static async fromExamples(examples, embeddings, vectorStoreCls, options = {}) {
    const inputKeys = options.inputKeys ?? null;
    const stringExamples = examples.map((example) => sortedValues(inputKeys ? inputKeys.reduce((acc, key) => ({
      ...acc,
      [key]: example[key]
    }), {}) : example).join(" "));
    return new SemanticSimilarityExampleSelector2({
      vectorStore: await vectorStoreCls.fromTexts(stringExamples, examples, embeddings, options),
      k: options.k ?? 4,
      exampleKeys: options.exampleKeys,
      inputKeys: options.inputKeys
    });
  }
};
var example_selectors_exports = /* @__PURE__ */ __exportAll({
  BaseExampleSelector: () => BaseExampleSelector,
  BasePromptSelector: () => BasePromptSelector,
  ConditionalPromptSelector: () => ConditionalPromptSelector,
  LengthBasedExampleSelector: () => LengthBasedExampleSelector,
  SemanticSimilarityExampleSelector: () => SemanticSimilarityExampleSelector,
  isChatModel: () => isChatModel,
  isLLM: () => isLLM
});
const UUIDV5_NAMESPACE = "10f90ea3-90a4-4962-bf75-83a0f3c1c62a";
var RecordManager = class extends Serializable {
  lc_namespace = ["langchain", "recordmanagers"];
};
var _HashedDocument = class {
  uid;
  hash_;
  contentHash;
  metadataHash;
  pageContent;
  metadata;
  keyEncoder = sha256;
  constructor(fields) {
    this.uid = fields.uid;
    this.pageContent = fields.pageContent;
    this.metadata = fields.metadata;
  }
  makeDefaultKeyEncoder(keyEncoderFn) {
    this.keyEncoder = keyEncoderFn;
  }
  calculateHashes() {
    const forbiddenKeys = [
      "hash_",
      "content_hash",
      "metadata_hash"
    ];
    for (const key of forbiddenKeys) if (key in this.metadata) throw new Error(`Metadata cannot contain key ${key} as it is reserved for internal use. Restricted keys: [${forbiddenKeys.join(", ")}]`);
    const contentHash = this._hashStringToUUID(this.pageContent);
    try {
      const metadataHash = this._hashNestedDictToUUID(this.metadata);
      this.contentHash = contentHash;
      this.metadataHash = metadataHash;
    } catch (e) {
      throw new Error(`Failed to hash metadata: ${e}. Please use a dict that can be serialized using json.`);
    }
    this.hash_ = this._hashStringToUUID(this.contentHash + this.metadataHash);
    if (!this.uid) this.uid = this.hash_;
  }
  toDocument() {
    return new Document({
      pageContent: this.pageContent,
      metadata: this.metadata
    });
  }
  static fromDocument(document, uid) {
    const doc = new this({
      pageContent: document.pageContent,
      metadata: document.metadata,
      uid: uid || document.uid
    });
    doc.calculateHashes();
    return doc;
  }
  _hashStringToUUID(inputString) {
    return v5(this.keyEncoder(inputString), UUIDV5_NAMESPACE);
  }
  _hashNestedDictToUUID(data) {
    const serialized_data = JSON.stringify(data, Object.keys(data).sort());
    return v5(this.keyEncoder(serialized_data), UUIDV5_NAMESPACE);
  }
};
function _batch(size, iterable) {
  const batches = [];
  let currentBatch = [];
  iterable.forEach((item) => {
    currentBatch.push(item);
    if (currentBatch.length >= size) {
      batches.push(currentBatch);
      currentBatch = [];
    }
  });
  if (currentBatch.length > 0) batches.push(currentBatch);
  return batches;
}
function _deduplicateInOrder(hashedDocuments) {
  const seen = /* @__PURE__ */ new Set();
  const deduplicated = [];
  for (const hashedDoc of hashedDocuments) {
    if (!hashedDoc.hash_) throw new Error("Hashed document does not have a hash");
    if (!seen.has(hashedDoc.hash_)) {
      seen.add(hashedDoc.hash_);
      deduplicated.push(hashedDoc);
    }
  }
  return deduplicated;
}
function _getSourceIdAssigner(sourceIdKey) {
  if (sourceIdKey === null) return (_doc) => null;
  else if (typeof sourceIdKey === "string") return (doc) => doc.metadata[sourceIdKey];
  else if (typeof sourceIdKey === "function") return sourceIdKey;
  else throw new Error(`sourceIdKey should be null, a string or a function, got ${typeof sourceIdKey}`);
}
const _isBaseDocumentLoader = (arg) => {
  if ("load" in arg && typeof arg.load === "function" && "loadAndSplit" in arg && typeof arg.loadAndSplit === "function") return true;
  return false;
};
async function index$1(args) {
  const { docsSource, recordManager, vectorStore, options } = args;
  const { batchSize = 100, cleanup, sourceIdKey, cleanupBatchSize = 1e3, forceUpdate = false } = options ?? {};
  if (cleanup === "incremental" && !sourceIdKey) throw new Error("sourceIdKey is required when cleanup mode is incremental. Please provide through 'options.sourceIdKey'.");
  const docs = _isBaseDocumentLoader(docsSource) ? await docsSource.load() : docsSource;
  const sourceIdAssigner = _getSourceIdAssigner(sourceIdKey ?? null);
  const indexStartDt = await recordManager.getTime();
  let numAdded = 0;
  let numDeleted = 0;
  let numUpdated = 0;
  let numSkipped = 0;
  const batches = _batch(batchSize ?? 100, docs);
  for (const batch of batches) {
    const hashedDocs = _deduplicateInOrder(batch.map((doc) => _HashedDocument.fromDocument(doc)));
    const sourceIds = hashedDocs.map((doc) => sourceIdAssigner(doc));
    if (cleanup === "incremental") hashedDocs.forEach((_hashedDoc, index2) => {
      if (sourceIds[index2] === null) throw new Error("sourceIdKey must be provided when cleanup is incremental");
    });
    const batchExists = await recordManager.exists(hashedDocs.map((doc) => doc.uid));
    const uids = [];
    const docsToIndex = [];
    const docsToUpdate = [];
    const seenDocs = /* @__PURE__ */ new Set();
    hashedDocs.forEach((hashedDoc, i) => {
      if (batchExists[i]) if (forceUpdate) seenDocs.add(hashedDoc.uid);
      else {
        docsToUpdate.push(hashedDoc.uid);
        return;
      }
      uids.push(hashedDoc.uid);
      docsToIndex.push(hashedDoc.toDocument());
    });
    if (docsToUpdate.length > 0) {
      await recordManager.update(docsToUpdate, { timeAtLeast: indexStartDt });
      numSkipped += docsToUpdate.length;
    }
    if (docsToIndex.length > 0) {
      await vectorStore.addDocuments(docsToIndex, { ids: uids });
      numAdded += docsToIndex.length - seenDocs.size;
      numUpdated += seenDocs.size;
    }
    await recordManager.update(hashedDocs.map((doc) => doc.uid), {
      timeAtLeast: indexStartDt,
      groupIds: sourceIds
    });
    if (cleanup === "incremental") {
      sourceIds.forEach((sourceId) => {
        if (!sourceId) throw new Error("Source id cannot be null");
      });
      const uidsToDelete = await recordManager.listKeys({
        before: indexStartDt,
        groupIds: sourceIds
      });
      if (uidsToDelete.length > 0) {
        await vectorStore.delete({ ids: uidsToDelete });
        await recordManager.deleteKeys(uidsToDelete);
        numDeleted += uidsToDelete.length;
      }
    }
  }
  if (cleanup === "full") {
    let uidsToDelete = await recordManager.listKeys({
      before: indexStartDt,
      limit: cleanupBatchSize
    });
    while (uidsToDelete.length > 0) {
      await vectorStore.delete({ ids: uidsToDelete });
      await recordManager.deleteKeys(uidsToDelete);
      numDeleted += uidsToDelete.length;
      uidsToDelete = await recordManager.listKeys({
        before: indexStartDt,
        limit: cleanupBatchSize
      });
    }
  }
  return {
    numAdded,
    numDeleted,
    numUpdated,
    numSkipped
  };
}
var indexing_exports = /* @__PURE__ */ __exportAll({
  RecordManager: () => RecordManager,
  UUIDV5_NAMESPACE: () => UUIDV5_NAMESPACE,
  _HashedDocument: () => _HashedDocument,
  _batch: () => _batch,
  _deduplicateInOrder: () => _deduplicateInOrder,
  _getSourceIdAssigner: () => _getSourceIdAssigner,
  _isBaseDocumentLoader: () => _isBaseDocumentLoader,
  index: () => index$1
});
var event_exports = /* @__PURE__ */ __exportAll({});
var profile_exports = /* @__PURE__ */ __exportAll({});
var memory_exports = /* @__PURE__ */ __exportAll({
  BaseMemory: () => BaseMemory,
  getInputValue: () => getInputValue,
  getOutputValue: () => getOutputValue,
  getPromptInputKey: () => getPromptInputKey
});
var BaseMemory = class {
};
const getValue = (values, key) => {
  if (key !== void 0) return values[key];
  const keys = Object.keys(values);
  if (keys.length === 1) return values[keys[0]];
};
const getInputValue = (inputValues, inputKey) => {
  const value = getValue(inputValues, inputKey);
  if (!value) throw new Error(`input values have ${Object.keys(inputValues).length} keys, you must specify an input key or pass only 1 key as input`);
  return value;
};
const getOutputValue = (outputValues, outputKey) => {
  const value = getValue(outputValues, outputKey);
  if (!value && value !== "") throw new Error(`output values have ${Object.keys(outputValues).length} keys, you must specify an output key or pass only 1 key as output`);
  return value;
};
function getPromptInputKey(inputs, memoryVariables) {
  const promptInputKeys = Object.keys(inputs).filter((key) => !memoryVariables.includes(key) && key !== "stop");
  if (promptInputKeys.length !== 1) throw new Error(`One input key expected, but got ${promptInputKeys.length}`);
  return promptInputKeys[0];
}
var OutputFunctionsParser = class extends BaseLLMOutputParser {
  static lc_name() {
    return "OutputFunctionsParser";
  }
  lc_namespace = [
    "langchain",
    "output_parsers",
    "openai_functions"
  ];
  lc_serializable = true;
  argsOnly = true;
  constructor(config) {
    super();
    this.argsOnly = config?.argsOnly ?? this.argsOnly;
  }
  /**
  * Parses the output and returns a string representation of the function
  * call or its arguments.
  * @param generations The output of the LLM to parse.
  * @returns A string representation of the function call or its arguments.
  */
  async parseResult(generations) {
    if ("message" in generations[0]) {
      const functionCall = generations[0].message.additional_kwargs.function_call;
      if (!functionCall) throw new Error(`No function_call in message ${JSON.stringify(generations)}`);
      if (!functionCall.arguments) throw new Error(`No arguments in function_call ${JSON.stringify(generations)}`);
      if (this.argsOnly) return functionCall.arguments;
      return JSON.stringify(functionCall);
    } else throw new Error(`No message in generations ${JSON.stringify(generations)}`);
  }
};
var JsonOutputFunctionsParser = class extends BaseCumulativeTransformOutputParser {
  static lc_name() {
    return "JsonOutputFunctionsParser";
  }
  lc_namespace = [
    "langchain",
    "output_parsers",
    "openai_functions"
  ];
  lc_serializable = true;
  outputParser;
  argsOnly = true;
  constructor(config) {
    super(config);
    this.argsOnly = config?.argsOnly ?? this.argsOnly;
    this.outputParser = new OutputFunctionsParser(config);
  }
  _diff(prev, next) {
    if (!next) return;
    return compare(prev ?? {}, next);
  }
  async parsePartialResult(generations) {
    const generation = generations[0];
    if (!generation.message) return;
    const { message } = generation;
    const functionCall = message.additional_kwargs.function_call;
    if (!functionCall) return;
    if (this.argsOnly) return parsePartialJson(functionCall.arguments);
    return {
      ...functionCall,
      arguments: parsePartialJson(functionCall.arguments)
    };
  }
  /**
  * Parses the output and returns a JSON object. If `argsOnly` is true,
  * only the arguments of the function call are returned.
  * @param generations The output of the LLM to parse.
  * @returns A JSON object representation of the function call or its arguments.
  */
  async parseResult(generations) {
    const result = await this.outputParser.parseResult(generations);
    if (!result) throw new Error(`No result from "OutputFunctionsParser" ${JSON.stringify(generations)}`);
    return this.parse(result);
  }
  async parse(text) {
    const parsedResult = JSON.parse(text);
    if (this.argsOnly) return parsedResult;
    parsedResult.arguments = JSON.parse(parsedResult.arguments);
    return parsedResult;
  }
  getFormatInstructions() {
    return "";
  }
};
var JsonKeyOutputFunctionsParser = class extends BaseLLMOutputParser {
  static lc_name() {
    return "JsonKeyOutputFunctionsParser";
  }
  lc_namespace = [
    "langchain",
    "output_parsers",
    "openai_functions"
  ];
  lc_serializable = true;
  outputParser = new JsonOutputFunctionsParser();
  attrName;
  get lc_aliases() {
    return { attrName: "key_name" };
  }
  constructor(fields) {
    super(fields);
    this.attrName = fields.attrName;
  }
  /**
  * Parses the output and returns a specific attribute of the parsed JSON
  * object.
  * @param generations The output of the LLM to parse.
  * @returns The value of a specific attribute of the parsed JSON object.
  */
  async parseResult(generations) {
    return (await this.outputParser.parseResult(generations))[this.attrName];
  }
};
var openai_functions_exports = /* @__PURE__ */ __exportAll({
  JsonKeyOutputFunctionsParser: () => JsonKeyOutputFunctionsParser,
  JsonOutputFunctionsParser: () => JsonOutputFunctionsParser,
  OutputFunctionsParser: () => OutputFunctionsParser
});
var BasePromptTemplate = class extends Runnable {
  lc_serializable = true;
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
  constructor(input) {
    super(input);
    const { inputVariables } = input;
    if (inputVariables.includes("stop")) throw new Error("Cannot have an input variable named 'stop', as it is used internally, please rename.");
    Object.assign(this, input);
  }
  /**
  * Merges partial variables and user variables.
  * @param userVariables The user variables to merge with the partial variables.
  * @returns A Promise that resolves to an object containing the merged variables.
  */
  async mergePartialAndUserVariables(userVariables) {
    const partialVariables = this.partialVariables ?? {};
    const partialValues = {};
    for (const [key, value] of Object.entries(partialVariables)) if (typeof value === "string") partialValues[key] = value;
    else partialValues[key] = await value();
    return {
      ...partialValues,
      ...userVariables
    };
  }
  /**
  * Invokes the prompt template with the given input and options.
  * @param input The input to invoke the prompt template with.
  * @param options Optional configuration for the callback.
  * @returns A Promise that resolves to the output of the prompt template.
  */
  async invoke(input, options) {
    const metadata = {
      ...this.metadata,
      ...options?.metadata
    };
    const tags = [...this.tags ?? [], ...options?.tags ?? []];
    return this._callWithConfig((input2) => this.formatPromptValue(input2), input, {
      ...options,
      tags,
      metadata,
      runType: "prompt"
    });
  }
};
var BaseStringPromptTemplate = class extends BasePromptTemplate {
  /**
  * Formats the prompt given the input values and returns a formatted
  * prompt value.
  * @param values The input values to format the prompt.
  * @returns A Promise that resolves to a formatted prompt value.
  */
  async formatPromptValue(values) {
    return new StringPromptValue(await this.format(values));
  }
};
var objectToString = Object.prototype.toString;
var isArray = Array.isArray || function isArrayPolyfill(object2) {
  return objectToString.call(object2) === "[object Array]";
};
function isFunction(object2) {
  return typeof object2 === "function";
}
function typeStr(obj) {
  return isArray(obj) ? "array" : typeof obj;
}
function escapeRegExp(string2) {
  return string2.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
}
function hasProperty(obj, propName) {
  return obj != null && typeof obj === "object" && propName in obj;
}
function primitiveHasOwnProperty(primitive, propName) {
  return primitive != null && typeof primitive !== "object" && primitive.hasOwnProperty && primitive.hasOwnProperty(propName);
}
var regExpTest = RegExp.prototype.test;
function testRegExp(re, string2) {
  return regExpTest.call(re, string2);
}
var nonSpaceRe = /\S/;
function isWhitespace(string2) {
  return !testRegExp(nonSpaceRe, string2);
}
var entityMap = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
  "/": "&#x2F;",
  "`": "&#x60;",
  "=": "&#x3D;"
};
function escapeHtml(string2) {
  return String(string2).replace(/[&<>"'`=\/]/g, function fromEntityMap(s) {
    return entityMap[s];
  });
}
var whiteRe = /\s*/;
var spaceRe = /\s+/;
var equalsRe = /\s*=/;
var curlyRe = /\s*\}/;
var tagRe = /#|\^|\/|>|\{|&|=|!/;
function parseTemplate$1(template, tags) {
  if (!template)
    return [];
  var lineHasNonSpace = false;
  var sections = [];
  var tokens = [];
  var spaces = [];
  var hasTag = false;
  var nonSpace = false;
  var indentation = "";
  var tagIndex = 0;
  function stripSpace() {
    if (hasTag && !nonSpace) {
      while (spaces.length)
        delete tokens[spaces.pop()];
    } else {
      spaces = [];
    }
    hasTag = false;
    nonSpace = false;
  }
  var openingTagRe, closingTagRe, closingCurlyRe;
  function compileTags(tagsToCompile) {
    if (typeof tagsToCompile === "string")
      tagsToCompile = tagsToCompile.split(spaceRe, 2);
    if (!isArray(tagsToCompile) || tagsToCompile.length !== 2)
      throw new Error("Invalid tags: " + tagsToCompile);
    openingTagRe = new RegExp(escapeRegExp(tagsToCompile[0]) + "\\s*");
    closingTagRe = new RegExp("\\s*" + escapeRegExp(tagsToCompile[1]));
    closingCurlyRe = new RegExp("\\s*" + escapeRegExp("}" + tagsToCompile[1]));
  }
  compileTags(tags || mustache.tags);
  var scanner = new Scanner(template);
  var start, type, value, chr, token, openSection;
  while (!scanner.eos()) {
    start = scanner.pos;
    value = scanner.scanUntil(openingTagRe);
    if (value) {
      for (var i = 0, valueLength = value.length; i < valueLength; ++i) {
        chr = value.charAt(i);
        if (isWhitespace(chr)) {
          spaces.push(tokens.length);
          indentation += chr;
        } else {
          nonSpace = true;
          lineHasNonSpace = true;
          indentation += " ";
        }
        tokens.push(["text", chr, start, start + 1]);
        start += 1;
        if (chr === "\n") {
          stripSpace();
          indentation = "";
          tagIndex = 0;
          lineHasNonSpace = false;
        }
      }
    }
    if (!scanner.scan(openingTagRe))
      break;
    hasTag = true;
    type = scanner.scan(tagRe) || "name";
    scanner.scan(whiteRe);
    if (type === "=") {
      value = scanner.scanUntil(equalsRe);
      scanner.scan(equalsRe);
      scanner.scanUntil(closingTagRe);
    } else if (type === "{") {
      value = scanner.scanUntil(closingCurlyRe);
      scanner.scan(curlyRe);
      scanner.scanUntil(closingTagRe);
      type = "&";
    } else {
      value = scanner.scanUntil(closingTagRe);
    }
    if (!scanner.scan(closingTagRe))
      throw new Error("Unclosed tag at " + scanner.pos);
    if (type == ">") {
      token = [type, value, start, scanner.pos, indentation, tagIndex, lineHasNonSpace];
    } else {
      token = [type, value, start, scanner.pos];
    }
    tagIndex++;
    tokens.push(token);
    if (type === "#" || type === "^") {
      sections.push(token);
    } else if (type === "/") {
      openSection = sections.pop();
      if (!openSection)
        throw new Error('Unopened section "' + value + '" at ' + start);
      if (openSection[1] !== value)
        throw new Error('Unclosed section "' + openSection[1] + '" at ' + start);
    } else if (type === "name" || type === "{" || type === "&") {
      nonSpace = true;
    } else if (type === "=") {
      compileTags(value);
    }
  }
  stripSpace();
  openSection = sections.pop();
  if (openSection)
    throw new Error('Unclosed section "' + openSection[1] + '" at ' + scanner.pos);
  return nestTokens(squashTokens(tokens));
}
function squashTokens(tokens) {
  var squashedTokens = [];
  var token, lastToken;
  for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
    token = tokens[i];
    if (token) {
      if (token[0] === "text" && lastToken && lastToken[0] === "text") {
        lastToken[1] += token[1];
        lastToken[3] = token[3];
      } else {
        squashedTokens.push(token);
        lastToken = token;
      }
    }
  }
  return squashedTokens;
}
function nestTokens(tokens) {
  var nestedTokens = [];
  var collector = nestedTokens;
  var sections = [];
  var token, section;
  for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
    token = tokens[i];
    switch (token[0]) {
      case "#":
      case "^":
        collector.push(token);
        sections.push(token);
        collector = token[4] = [];
        break;
      case "/":
        section = sections.pop();
        section[5] = token[2];
        collector = sections.length > 0 ? sections[sections.length - 1][4] : nestedTokens;
        break;
      default:
        collector.push(token);
    }
  }
  return nestedTokens;
}
function Scanner(string2) {
  this.string = string2;
  this.tail = string2;
  this.pos = 0;
}
Scanner.prototype.eos = function eos() {
  return this.tail === "";
};
Scanner.prototype.scan = function scan(re) {
  var match = this.tail.match(re);
  if (!match || match.index !== 0)
    return "";
  var string2 = match[0];
  this.tail = this.tail.substring(string2.length);
  this.pos += string2.length;
  return string2;
};
Scanner.prototype.scanUntil = function scanUntil(re) {
  var index2 = this.tail.search(re), match;
  switch (index2) {
    case -1:
      match = this.tail;
      this.tail = "";
      break;
    case 0:
      match = "";
      break;
    default:
      match = this.tail.substring(0, index2);
      this.tail = this.tail.substring(index2);
  }
  this.pos += match.length;
  return match;
};
function Context(view2, parentContext) {
  this.view = view2;
  this.cache = { ".": this.view };
  this.parent = parentContext;
}
Context.prototype.push = function push(view2) {
  return new Context(view2, this);
};
Context.prototype.lookup = function lookup(name) {
  var cache = this.cache;
  var value;
  if (cache.hasOwnProperty(name)) {
    value = cache[name];
  } else {
    var context2 = this, intermediateValue, names, index2, lookupHit = false;
    while (context2) {
      if (name.indexOf(".") > 0) {
        intermediateValue = context2.view;
        names = name.split(".");
        index2 = 0;
        while (intermediateValue != null && index2 < names.length) {
          if (index2 === names.length - 1)
            lookupHit = hasProperty(intermediateValue, names[index2]) || primitiveHasOwnProperty(intermediateValue, names[index2]);
          intermediateValue = intermediateValue[names[index2++]];
        }
      } else {
        intermediateValue = context2.view[name];
        lookupHit = hasProperty(context2.view, name);
      }
      if (lookupHit) {
        value = intermediateValue;
        break;
      }
      context2 = context2.parent;
    }
    cache[name] = value;
  }
  if (isFunction(value))
    value = value.call(this.view);
  return value;
};
function Writer() {
  this.templateCache = {
    _cache: {},
    set: function set(key, value) {
      this._cache[key] = value;
    },
    get: function get(key) {
      return this._cache[key];
    },
    clear: function clear() {
      this._cache = {};
    }
  };
}
Writer.prototype.clearCache = function clearCache() {
  if (typeof this.templateCache !== "undefined") {
    this.templateCache.clear();
  }
};
Writer.prototype.parse = function parse(template, tags) {
  var cache = this.templateCache;
  var cacheKey = template + ":" + (tags || mustache.tags).join(":");
  var isCacheEnabled = typeof cache !== "undefined";
  var tokens = isCacheEnabled ? cache.get(cacheKey) : void 0;
  if (tokens == void 0) {
    tokens = parseTemplate$1(template, tags);
    isCacheEnabled && cache.set(cacheKey, tokens);
  }
  return tokens;
};
Writer.prototype.render = function render(template, view2, partials, config) {
  var tags = this.getConfigTags(config);
  var tokens = this.parse(template, tags);
  var context2 = view2 instanceof Context ? view2 : new Context(view2, void 0);
  return this.renderTokens(tokens, context2, partials, template, config);
};
Writer.prototype.renderTokens = function renderTokens(tokens, context2, partials, originalTemplate, config) {
  var buffer = "";
  var token, symbol, value;
  for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
    value = void 0;
    token = tokens[i];
    symbol = token[0];
    if (symbol === "#") value = this.renderSection(token, context2, partials, originalTemplate, config);
    else if (symbol === "^") value = this.renderInverted(token, context2, partials, originalTemplate, config);
    else if (symbol === ">") value = this.renderPartial(token, context2, partials, config);
    else if (symbol === "&") value = this.unescapedValue(token, context2);
    else if (symbol === "name") value = this.escapedValue(token, context2, config);
    else if (symbol === "text") value = this.rawValue(token);
    if (value !== void 0)
      buffer += value;
  }
  return buffer;
};
Writer.prototype.renderSection = function renderSection(token, context2, partials, originalTemplate, config) {
  var self = this;
  var buffer = "";
  var value = context2.lookup(token[1]);
  function subRender(template) {
    return self.render(template, context2, partials, config);
  }
  if (!value) return;
  if (isArray(value)) {
    for (var j = 0, valueLength = value.length; j < valueLength; ++j) {
      buffer += this.renderTokens(token[4], context2.push(value[j]), partials, originalTemplate, config);
    }
  } else if (typeof value === "object" || typeof value === "string" || typeof value === "number") {
    buffer += this.renderTokens(token[4], context2.push(value), partials, originalTemplate, config);
  } else if (isFunction(value)) {
    if (typeof originalTemplate !== "string")
      throw new Error("Cannot use higher-order sections without the original template");
    value = value.call(context2.view, originalTemplate.slice(token[3], token[5]), subRender);
    if (value != null)
      buffer += value;
  } else {
    buffer += this.renderTokens(token[4], context2, partials, originalTemplate, config);
  }
  return buffer;
};
Writer.prototype.renderInverted = function renderInverted(token, context2, partials, originalTemplate, config) {
  var value = context2.lookup(token[1]);
  if (!value || isArray(value) && value.length === 0)
    return this.renderTokens(token[4], context2, partials, originalTemplate, config);
};
Writer.prototype.indentPartial = function indentPartial(partial, indentation, lineHasNonSpace) {
  var filteredIndentation = indentation.replace(/[^ \t]/g, "");
  var partialByNl = partial.split("\n");
  for (var i = 0; i < partialByNl.length; i++) {
    if (partialByNl[i].length && (i > 0 || !lineHasNonSpace)) {
      partialByNl[i] = filteredIndentation + partialByNl[i];
    }
  }
  return partialByNl.join("\n");
};
Writer.prototype.renderPartial = function renderPartial(token, context2, partials, config) {
  if (!partials) return;
  var tags = this.getConfigTags(config);
  var value = isFunction(partials) ? partials(token[1]) : partials[token[1]];
  if (value != null) {
    var lineHasNonSpace = token[6];
    var tagIndex = token[5];
    var indentation = token[4];
    var indentedValue = value;
    if (tagIndex == 0 && indentation) {
      indentedValue = this.indentPartial(value, indentation, lineHasNonSpace);
    }
    var tokens = this.parse(indentedValue, tags);
    return this.renderTokens(tokens, context2, partials, indentedValue, config);
  }
};
Writer.prototype.unescapedValue = function unescapedValue(token, context2) {
  var value = context2.lookup(token[1]);
  if (value != null)
    return value;
};
Writer.prototype.escapedValue = function escapedValue(token, context2, config) {
  var escape = this.getConfigEscape(config) || mustache.escape;
  var value = context2.lookup(token[1]);
  if (value != null)
    return typeof value === "number" && escape === mustache.escape ? String(value) : escape(value);
};
Writer.prototype.rawValue = function rawValue(token) {
  return token[1];
};
Writer.prototype.getConfigTags = function getConfigTags(config) {
  if (isArray(config)) {
    return config;
  } else if (config && typeof config === "object") {
    return config.tags;
  } else {
    return void 0;
  }
};
Writer.prototype.getConfigEscape = function getConfigEscape(config) {
  if (config && typeof config === "object" && !isArray(config)) {
    return config.escape;
  } else {
    return void 0;
  }
};
var mustache = {
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
  set templateCache(cache) {
    defaultWriter.templateCache = cache;
  },
  /**
   * Gets the default or overridden caching object from the default writer.
   */
  get templateCache() {
    return defaultWriter.templateCache;
  }
};
var defaultWriter = new Writer();
mustache.clearCache = function clearCache2() {
  return defaultWriter.clearCache();
};
mustache.parse = function parse2(template, tags) {
  return defaultWriter.parse(template, tags);
};
mustache.render = function render2(template, view2, partials, config) {
  if (typeof template !== "string") {
    throw new TypeError('Invalid template! Template should be a "string" but "' + typeStr(template) + '" was given as the first argument for mustache#render(template, view, partials)');
  }
  return defaultWriter.render(template, view2, partials, config);
};
mustache.escape = escapeHtml;
mustache.Scanner = Scanner;
mustache.Context = Context;
mustache.Writer = Writer;
function configureMustache() {
  mustache.escape = (text) => text;
}
const parseFString = (template) => {
  const chars = template.split("");
  const nodes = [];
  const nextBracket = (bracket, start) => {
    for (let i2 = start; i2 < chars.length; i2 += 1) if (bracket.includes(chars[i2])) return i2;
    return -1;
  };
  let i = 0;
  while (i < chars.length) if (chars[i] === "{" && i + 1 < chars.length && chars[i + 1] === "{") {
    nodes.push({
      type: "literal",
      text: "{"
    });
    i += 2;
  } else if (chars[i] === "}" && i + 1 < chars.length && chars[i + 1] === "}") {
    nodes.push({
      type: "literal",
      text: "}"
    });
    i += 2;
  } else if (chars[i] === "{") {
    const j = nextBracket("}", i);
    if (j < 0) throw new Error("Unclosed '{' in template.");
    nodes.push({
      type: "variable",
      name: chars.slice(i + 1, j).join("")
    });
    i = j + 1;
  } else if (chars[i] === "}") throw new Error("Single '}' in template.");
  else {
    const next = nextBracket("{}", i);
    const text = (next < 0 ? chars.slice(i) : chars.slice(i, next)).join("");
    nodes.push({
      type: "literal",
      text
    });
    i = next < 0 ? chars.length : next;
  }
  return nodes;
};
const mustacheTemplateToNodes = (template, context2 = []) => {
  const nodes = [];
  for (const temp of template) if (temp[0] === "name") {
    const name = temp[1].includes(".") ? temp[1].split(".")[0] : temp[1];
    nodes.push({
      type: "variable",
      name
    });
  } else if ([
    "#",
    "&",
    "^",
    ">"
  ].includes(temp[0])) {
    nodes.push({
      type: "variable",
      name: temp[1]
    });
    if (temp[0] === "#" && temp.length > 4 && Array.isArray(temp[4])) {
      const newContext = [...context2, temp[1]];
      const nestedNodes = mustacheTemplateToNodes(temp[4], newContext);
      nodes.push(...nestedNodes);
    }
  } else nodes.push({
    type: "literal",
    text: temp[1]
  });
  return nodes;
};
const parseMustache = (template) => {
  configureMustache();
  return mustacheTemplateToNodes(mustache.parse(template));
};
const interpolateFString = (template, values) => {
  return parseFString(template).reduce((res, node) => {
    if (node.type === "variable") {
      if (node.name in values) return res + (typeof values[node.name] === "string" ? values[node.name] : JSON.stringify(values[node.name]));
      throw new Error(`(f-string) Missing value for input ${node.name}`);
    }
    return res + node.text;
  }, "");
};
const interpolateMustache = (template, values) => {
  configureMustache();
  return mustache.render(template, values);
};
const DEFAULT_FORMATTER_MAPPING = {
  "f-string": interpolateFString,
  mustache: interpolateMustache
};
const DEFAULT_PARSER_MAPPING = {
  "f-string": parseFString,
  mustache: parseMustache
};
const renderTemplate = (template, templateFormat, inputValues) => {
  try {
    return DEFAULT_FORMATTER_MAPPING[templateFormat](template, inputValues);
  } catch (e) {
    throw addLangChainErrorFields(e, "INVALID_PROMPT_INPUT");
  }
};
const parseTemplate = (template, templateFormat) => DEFAULT_PARSER_MAPPING[templateFormat](template);
const checkValidTemplate = (template, templateFormat, inputVariables) => {
  if (!(templateFormat in DEFAULT_FORMATTER_MAPPING)) throw new Error(`Invalid template format. Got \`${templateFormat}\`;
                         should be one of ${Object.keys(DEFAULT_FORMATTER_MAPPING)}`);
  try {
    const dummyInputs = Object.fromEntries(inputVariables.map((v) => [v, "foo"]));
    if (Array.isArray(template)) template.forEach((message) => {
      if (message.type === "text" && "text" in message && typeof message.text === "string") renderTemplate(message.text, templateFormat, dummyInputs);
      else if (message.type === "image_url") {
        if (typeof message.image_url === "string") renderTemplate(message.image_url, templateFormat, dummyInputs);
        else if (typeof message.image_url === "object" && message.image_url !== null && "url" in message.image_url && typeof message.image_url.url === "string") {
          const imageUrl = message.image_url.url;
          renderTemplate(imageUrl, templateFormat, dummyInputs);
        }
      } else throw new Error(`Invalid message template received. ${JSON.stringify(message, null, 2)}`);
    });
    else renderTemplate(template, templateFormat, dummyInputs);
  } catch (e) {
    throw new Error(`Invalid prompt schema: ${e.message}`);
  }
};
var PromptTemplate = class PromptTemplate2 extends BaseStringPromptTemplate {
  static lc_name() {
    return "PromptTemplate";
  }
  template;
  templateFormat = "f-string";
  validateTemplate = true;
  /**
  * Additional fields which should be included inside
  * the message content array if using a complex message
  * content.
  */
  additionalContentFields;
  constructor(input) {
    super(input);
    if (input.templateFormat === "mustache" && input.validateTemplate === void 0) this.validateTemplate = false;
    Object.assign(this, input);
    if (this.validateTemplate) {
      if (this.templateFormat === "mustache") throw new Error("Mustache templates cannot be validated.");
      let totalInputVariables = this.inputVariables;
      if (this.partialVariables) totalInputVariables = totalInputVariables.concat(Object.keys(this.partialVariables));
      checkValidTemplate(this.template, this.templateFormat, totalInputVariables);
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
  async format(values) {
    const allValues = await this.mergePartialAndUserVariables(values);
    return renderTemplate(this.template, this.templateFormat, allValues);
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
  static fromExamples(examples, suffix, inputVariables, exampleSeparator = "\n\n", prefix = "") {
    return new PromptTemplate2({
      inputVariables,
      template: [
        prefix,
        ...examples,
        suffix
      ].join(exampleSeparator)
    });
  }
  static fromTemplate(template, options) {
    const { templateFormat = "f-string", ...rest } = options ?? {};
    const names = /* @__PURE__ */ new Set();
    parseTemplate(template, templateFormat).forEach((node) => {
      if (node.type === "variable") names.add(node.name);
    });
    return new PromptTemplate2({
      inputVariables: [...names],
      templateFormat,
      template,
      ...rest
    });
  }
  /**
  * Partially applies values to the prompt template.
  * @param values The values to be partially applied to the prompt template.
  * @returns A new instance of PromptTemplate with the partially applied values.
  */
  async partial(values) {
    const newInputVariables = this.inputVariables.filter((iv) => !(iv in values));
    const newPartialVariables = {
      ...this.partialVariables ?? {},
      ...values
    };
    return new PromptTemplate2({
      ...this,
      inputVariables: newInputVariables,
      partialVariables: newPartialVariables
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
  static async deserialize(data) {
    if (!data.template) throw new Error("Prompt template must have a template");
    return new PromptTemplate2({
      inputVariables: data.input_variables,
      template: data.template,
      templateFormat: data.template_format
    });
  }
};
var ImagePromptTemplate = class ImagePromptTemplate2 extends BasePromptTemplate {
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
  validateTemplate = true;
  /**
  * Additional fields which should be included inside
  * the message content array if using a complex message
  * content.
  */
  additionalContentFields;
  constructor(input) {
    super(input);
    this.template = input.template;
    this.templateFormat = input.templateFormat ?? this.templateFormat;
    this.validateTemplate = input.validateTemplate ?? this.validateTemplate;
    this.additionalContentFields = input.additionalContentFields;
    if (this.validateTemplate) {
      let totalInputVariables = this.inputVariables;
      if (this.partialVariables) totalInputVariables = totalInputVariables.concat(Object.keys(this.partialVariables));
      checkValidTemplate([{
        type: "image_url",
        image_url: this.template
      }], this.templateFormat, totalInputVariables);
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
  async partial(values) {
    const newInputVariables = this.inputVariables.filter((iv) => !(iv in values));
    const newPartialVariables = {
      ...this.partialVariables ?? {},
      ...values
    };
    return new ImagePromptTemplate2({
      ...this,
      inputVariables: newInputVariables,
      partialVariables: newPartialVariables
    });
  }
  /**
  * Formats the prompt template with the provided values.
  * @param values The values to be used to format the prompt template.
  * @returns A promise that resolves to a string which is the formatted prompt.
  */
  async format(values) {
    const formatted = {};
    for (const [key, value] of Object.entries(this.template)) if (typeof value === "string") formatted[key] = renderTemplate(value, this.templateFormat, values);
    else formatted[key] = value;
    const url = values.url || formatted.url;
    const detail = values.detail || formatted.detail;
    if (!url) throw new Error("Must provide either an image URL.");
    if (typeof url !== "string") throw new Error("url must be a string.");
    const output = { url };
    if (detail) output.detail = detail;
    return output;
  }
  /**
  * Formats the prompt given the input values and returns a formatted
  * prompt value.
  * @param values The input values to format the prompt.
  * @returns A Promise that resolves to a formatted prompt value.
  */
  async formatPromptValue(values) {
    return new ImagePromptValue(await this.format(values));
  }
};
var DictPromptTemplate = class extends Runnable {
  lc_namespace = [
    "langchain_core",
    "prompts",
    "dict"
  ];
  lc_serializable = true;
  template;
  templateFormat;
  inputVariables;
  static lc_name() {
    return "DictPromptTemplate";
  }
  constructor(fields) {
    const templateFormat = fields.templateFormat ?? "f-string";
    const inputVariables = _getInputVariables(fields.template, templateFormat);
    super({
      inputVariables,
      ...fields
    });
    this.template = fields.template;
    this.templateFormat = templateFormat;
    this.inputVariables = inputVariables;
  }
  async format(values) {
    return _insertInputVariables(this.template, values, this.templateFormat);
  }
  async invoke(values) {
    return await this._callWithConfig(this.format.bind(this), values, { runType: "prompt" });
  }
};
function _getInputVariables(template, templateFormat) {
  const inputVariables = [];
  for (const v of Object.values(template)) if (typeof v === "string") parseTemplate(v, templateFormat).forEach((t) => {
    if (t.type === "variable") inputVariables.push(t.name);
  });
  else if (Array.isArray(v)) {
    for (const x of v) if (typeof x === "string") parseTemplate(x, templateFormat).forEach((t) => {
      if (t.type === "variable") inputVariables.push(t.name);
    });
    else if (typeof x === "object") inputVariables.push(..._getInputVariables(x, templateFormat));
  } else if (typeof v === "object" && v !== null) inputVariables.push(..._getInputVariables(v, templateFormat));
  return Array.from(new Set(inputVariables));
}
function _insertInputVariables(template, inputs, templateFormat) {
  const formatted = {};
  for (const [k, v] of Object.entries(template)) if (typeof v === "string") formatted[k] = renderTemplate(v, templateFormat, inputs);
  else if (Array.isArray(v)) {
    const formattedV = [];
    for (const x of v) if (typeof x === "string") formattedV.push(renderTemplate(x, templateFormat, inputs));
    else if (typeof x === "object") formattedV.push(_insertInputVariables(x, inputs, templateFormat));
    formatted[k] = formattedV;
  } else if (typeof v === "object" && v !== null) formatted[k] = _insertInputVariables(v, inputs, templateFormat);
  else formatted[k] = v;
  return formatted;
}
var BaseMessagePromptTemplate = class extends Runnable {
  lc_namespace = [
    "langchain_core",
    "prompts",
    "chat"
  ];
  lc_serializable = true;
  /**
  * Calls the formatMessages method with the provided input and options.
  * @param input Input for the formatMessages method
  * @param options Optional BaseCallbackConfig
  * @returns Formatted output messages
  */
  async invoke(input, options) {
    return this._callWithConfig((input2) => this.formatMessages(input2), input, {
      ...options,
      runType: "prompt"
    });
  }
};
var MessagesPlaceholder = class extends BaseMessagePromptTemplate {
  static lc_name() {
    return "MessagesPlaceholder";
  }
  variableName;
  optional;
  constructor(fields) {
    if (typeof fields === "string") fields = { variableName: fields };
    super(fields);
    this.variableName = fields.variableName;
    this.optional = fields.optional ?? false;
  }
  get inputVariables() {
    return [this.variableName];
  }
  async formatMessages(values) {
    const input = values[this.variableName];
    if (this.optional && !input) return [];
    else if (!input) {
      const error = /* @__PURE__ */ new Error(`Field "${this.variableName}" in prompt uses a MessagesPlaceholder, which expects an array of BaseMessages as an input value. Received: undefined`);
      error.name = "InputFormatError";
      throw error;
    }
    let formattedMessages;
    try {
      if (Array.isArray(input)) formattedMessages = input.map(coerceMessageLikeToMessage);
      else formattedMessages = [coerceMessageLikeToMessage(input)];
    } catch (e) {
      const readableInput = typeof input === "string" ? input : JSON.stringify(input, null, 2);
      const error = new Error([
        `Field "${this.variableName}" in prompt uses a MessagesPlaceholder, which expects an array of BaseMessages or coerceable values as input.`,
        `Received value: ${readableInput}`,
        `Additional message: ${e.message}`
      ].join("\n\n"));
      error.name = "InputFormatError";
      error.lc_error_code = e.lc_error_code;
      throw error;
    }
    return formattedMessages;
  }
};
var BaseMessageStringPromptTemplate = class extends BaseMessagePromptTemplate {
  prompt;
  constructor(fields) {
    if (!("prompt" in fields)) fields = { prompt: fields };
    super(fields);
    this.prompt = fields.prompt;
  }
  get inputVariables() {
    return this.prompt.inputVariables;
  }
  async formatMessages(values) {
    return [await this.format(values)];
  }
};
var BaseChatPromptTemplate = class extends BasePromptTemplate {
  constructor(input) {
    super(input);
  }
  async format(values) {
    return (await this.formatPromptValue(values)).toString();
  }
  async formatPromptValue(values) {
    return new ChatPromptValue(await this.formatMessages(values));
  }
};
var ChatMessagePromptTemplate = class extends BaseMessageStringPromptTemplate {
  static lc_name() {
    return "ChatMessagePromptTemplate";
  }
  role;
  constructor(fields, role) {
    if (!("prompt" in fields)) fields = {
      prompt: fields,
      role
    };
    super(fields);
    this.role = fields.role;
  }
  async format(values) {
    return new ChatMessage(await this.prompt.format(values), this.role);
  }
  static fromTemplate(template, role, options) {
    return new this(PromptTemplate.fromTemplate(template, { templateFormat: options?.templateFormat }), role);
  }
};
function isTextTemplateParam(param) {
  if (param === null || typeof param !== "object" || Array.isArray(param)) return false;
  return Object.keys(param).length === 1 && "text" in param && typeof param.text === "string";
}
function isImageTemplateParam(param) {
  if (param === null || typeof param !== "object" || Array.isArray(param)) return false;
  return "image_url" in param && (typeof param.image_url === "string" || typeof param.image_url === "object" && param.image_url !== null && "url" in param.image_url && typeof param.image_url.url === "string");
}
var _StringImageMessagePromptTemplate = class extends BaseMessagePromptTemplate {
  lc_namespace = [
    "langchain_core",
    "prompts",
    "chat"
  ];
  lc_serializable = true;
  inputVariables = [];
  additionalOptions = {};
  prompt;
  messageClass;
  static _messageClass() {
    throw new Error("Can not invoke _messageClass from inside _StringImageMessagePromptTemplate");
  }
  chatMessageClass;
  constructor(fields, additionalOptions) {
    if (!("prompt" in fields)) fields = { prompt: fields };
    super(fields);
    this.prompt = fields.prompt;
    if (Array.isArray(this.prompt)) {
      let inputVariables = [];
      this.prompt.forEach((prompt) => {
        if ("inputVariables" in prompt) inputVariables = inputVariables.concat(prompt.inputVariables);
      });
      this.inputVariables = inputVariables;
    } else this.inputVariables = this.prompt.inputVariables;
    this.additionalOptions = additionalOptions ?? this.additionalOptions;
  }
  createMessage(content) {
    const constructor = this.constructor;
    if (constructor._messageClass()) return new (constructor._messageClass())({ content });
    else if (constructor.chatMessageClass) {
      const MsgClass = constructor.chatMessageClass();
      return new MsgClass({
        content,
        role: this.getRoleFromMessageClass(MsgClass.lc_name())
      });
    } else throw new Error("No message class defined");
  }
  getRoleFromMessageClass(name) {
    switch (name) {
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
  static fromTemplate(template, additionalOptions) {
    if (typeof template === "string") return new this(PromptTemplate.fromTemplate(template, additionalOptions));
    const prompt = [];
    for (const item of template) if (typeof item === "string") prompt.push(PromptTemplate.fromTemplate(item, additionalOptions));
    else if (item === null) ;
    else if (isTextTemplateParam(item)) {
      let text = "";
      if (typeof item.text === "string") text = item.text ?? "";
      const options = {
        ...additionalOptions,
        additionalContentFields: item
      };
      prompt.push(PromptTemplate.fromTemplate(text, options));
    } else if (isImageTemplateParam(item)) {
      let imgTemplate = item.image_url ?? "";
      let imgTemplateObject;
      let inputVariables = [];
      if (typeof imgTemplate === "string") {
        let parsedTemplate;
        if (additionalOptions?.templateFormat === "mustache") parsedTemplate = parseMustache(imgTemplate);
        else parsedTemplate = parseFString(imgTemplate);
        const variables = parsedTemplate.flatMap((item2) => item2.type === "variable" ? [item2.name] : []);
        if ((variables?.length ?? 0) > 0) {
          if (variables.length > 1) throw new Error(`Only one format variable allowed per image template.
Got: ${variables}
From: ${imgTemplate}`);
          inputVariables = [variables[0]];
        } else inputVariables = [];
        imgTemplate = { url: imgTemplate };
        imgTemplateObject = new ImagePromptTemplate({
          template: imgTemplate,
          inputVariables,
          templateFormat: additionalOptions?.templateFormat,
          additionalContentFields: item
        });
      } else if (typeof imgTemplate === "object") {
        if ("url" in imgTemplate) {
          let parsedTemplate;
          if (additionalOptions?.templateFormat === "mustache") parsedTemplate = parseMustache(imgTemplate.url);
          else parsedTemplate = parseFString(imgTemplate.url);
          inputVariables = parsedTemplate.flatMap((item2) => item2.type === "variable" ? [item2.name] : []);
        } else inputVariables = [];
        imgTemplateObject = new ImagePromptTemplate({
          template: imgTemplate,
          inputVariables,
          templateFormat: additionalOptions?.templateFormat,
          additionalContentFields: item
        });
      } else throw new Error("Invalid image template");
      prompt.push(imgTemplateObject);
    } else if (typeof item === "object") prompt.push(new DictPromptTemplate({
      template: item,
      templateFormat: additionalOptions?.templateFormat
    }));
    return new this({
      prompt,
      additionalOptions
    });
  }
  async format(input) {
    if (this.prompt instanceof BaseStringPromptTemplate) {
      const text = await this.prompt.format(input);
      return this.createMessage(text);
    } else {
      const content = [];
      for (const prompt of this.prompt) {
        let inputs = {};
        if (!("inputVariables" in prompt)) throw new Error(`Prompt ${prompt} does not have inputVariables defined.`);
        for (const item of prompt.inputVariables) {
          if (!inputs) inputs = { [item]: input[item] };
          inputs = {
            ...inputs,
            [item]: input[item]
          };
        }
        if (prompt instanceof BaseStringPromptTemplate) {
          const formatted = await prompt.format(inputs);
          let additionalContentFields;
          if ("additionalContentFields" in prompt) additionalContentFields = prompt.additionalContentFields;
          if (formatted !== "") content.push({
            ...additionalContentFields,
            type: "text",
            text: formatted
          });
        } else if (prompt instanceof ImagePromptTemplate) {
          const formatted = await prompt.format(inputs);
          let additionalContentFields;
          if ("additionalContentFields" in prompt) additionalContentFields = prompt.additionalContentFields;
          content.push({
            ...additionalContentFields,
            type: "image_url",
            image_url: formatted
          });
        } else if (prompt instanceof DictPromptTemplate) {
          const formatted = await prompt.format(inputs);
          let additionalContentFields;
          if ("additionalContentFields" in prompt) additionalContentFields = prompt.additionalContentFields;
          content.push({
            ...additionalContentFields,
            ...formatted
          });
        }
      }
      return this.createMessage(content);
    }
  }
  async formatMessages(values) {
    return [await this.format(values)];
  }
};
var HumanMessagePromptTemplate = class extends _StringImageMessagePromptTemplate {
  static _messageClass() {
    return HumanMessage;
  }
  static lc_name() {
    return "HumanMessagePromptTemplate";
  }
};
var AIMessagePromptTemplate = class extends _StringImageMessagePromptTemplate {
  static _messageClass() {
    return AIMessage;
  }
  static lc_name() {
    return "AIMessagePromptTemplate";
  }
};
var SystemMessagePromptTemplate = class extends _StringImageMessagePromptTemplate {
  static _messageClass() {
    return SystemMessage;
  }
  static lc_name() {
    return "SystemMessagePromptTemplate";
  }
};
function _isBaseMessagePromptTemplate(baseMessagePromptTemplateLike) {
  return typeof baseMessagePromptTemplateLike.formatMessages === "function";
}
function _coerceMessagePromptTemplateLike(messagePromptTemplateLike, extra) {
  if (_isBaseMessagePromptTemplate(messagePromptTemplateLike) || isBaseMessage(messagePromptTemplateLike)) return messagePromptTemplateLike;
  if (Array.isArray(messagePromptTemplateLike) && messagePromptTemplateLike[0] === "placeholder") {
    const messageContent = messagePromptTemplateLike[1];
    if (extra?.templateFormat === "mustache" && typeof messageContent === "string" && messageContent.slice(0, 2) === "{{" && messageContent.slice(-2) === "}}") return new MessagesPlaceholder({
      variableName: messageContent.slice(2, -2),
      optional: true
    });
    else if (typeof messageContent === "string" && messageContent[0] === "{" && messageContent[messageContent.length - 1] === "}") return new MessagesPlaceholder({
      variableName: messageContent.slice(1, -1),
      optional: true
    });
    throw new Error(`Invalid placeholder template for format ${extra?.templateFormat ?? `"f-string"`}: "${messagePromptTemplateLike[1]}". Expected a variable name surrounded by ${extra?.templateFormat === "mustache" ? "double" : "single"} curly braces.`);
  }
  const message = coerceMessageLikeToMessage(messagePromptTemplateLike);
  let templateData;
  if (typeof message.content === "string") templateData = message.content;
  else templateData = message.content.map((item) => {
    if ("text" in item) return {
      ...item,
      text: item.text
    };
    else if ("image_url" in item) return {
      ...item,
      image_url: item.image_url
    };
    else return item;
  });
  if (message._getType() === "human") return HumanMessagePromptTemplate.fromTemplate(templateData, extra);
  else if (message._getType() === "ai") return AIMessagePromptTemplate.fromTemplate(templateData, extra);
  else if (message._getType() === "system") return SystemMessagePromptTemplate.fromTemplate(templateData, extra);
  else if (ChatMessage.isInstance(message)) return ChatMessagePromptTemplate.fromTemplate(message.content, message.role, extra);
  else throw new Error(`Could not coerce message prompt template from input. Received message type: "${message._getType()}".`);
}
function isMessagesPlaceholder(x) {
  return x.constructor.lc_name() === "MessagesPlaceholder";
}
var ChatPromptTemplate = class ChatPromptTemplate2 extends BaseChatPromptTemplate {
  static lc_name() {
    return "ChatPromptTemplate";
  }
  get lc_aliases() {
    return { promptMessages: "messages" };
  }
  promptMessages;
  validateTemplate = true;
  templateFormat = "f-string";
  constructor(input) {
    super(input);
    if (input.templateFormat === "mustache" && input.validateTemplate === void 0) this.validateTemplate = false;
    Object.assign(this, input);
    if (this.validateTemplate) {
      const inputVariablesMessages = /* @__PURE__ */ new Set();
      for (const promptMessage of this.promptMessages) {
        if (promptMessage instanceof BaseMessage) continue;
        for (const inputVariable of promptMessage.inputVariables) inputVariablesMessages.add(inputVariable);
      }
      const totalInputVariables = this.inputVariables;
      const inputVariablesInstance = new Set(this.partialVariables ? totalInputVariables.concat(Object.keys(this.partialVariables)) : totalInputVariables);
      const difference = new Set([...inputVariablesInstance].filter((x) => !inputVariablesMessages.has(x)));
      if (difference.size > 0) throw new Error(`Input variables \`${[...difference]}\` are not used in any of the prompt messages.`);
      const otherDifference = new Set([...inputVariablesMessages].filter((x) => !inputVariablesInstance.has(x)));
      if (otherDifference.size > 0) throw new Error(`Input variables \`${[...otherDifference]}\` are used in prompt messages but not in the prompt template.`);
    }
  }
  _getPromptType() {
    return "chat";
  }
  async _parseImagePrompts(message, inputValues) {
    if (typeof message.content === "string") return message;
    message.content = await Promise.all(message.content.map(async (item) => {
      if (item.type !== "image_url") return item;
      let imageUrl = "";
      if (typeof item.image_url === "string") imageUrl = item.image_url;
      else if (typeof item.image_url === "object" && item.image_url !== null && "url" in item.image_url && typeof item.image_url.url === "string") imageUrl = item.image_url.url;
      const formattedUrl = await PromptTemplate.fromTemplate(imageUrl, { templateFormat: this.templateFormat }).format(inputValues);
      if (typeof item.image_url === "object" && item.image_url !== null && "url" in item.image_url) item.image_url.url = formattedUrl;
      else item.image_url = formattedUrl;
      return item;
    }));
    return message;
  }
  async formatMessages(values) {
    const allValues = await this.mergePartialAndUserVariables(values);
    let resultMessages = [];
    for (const promptMessage of this.promptMessages) if (promptMessage instanceof BaseMessage) resultMessages.push(await this._parseImagePrompts(promptMessage, allValues));
    else {
      let inputValues;
      if (this.templateFormat === "mustache") inputValues = { ...allValues };
      else inputValues = promptMessage.inputVariables.reduce((acc, inputVariable) => {
        if (!(inputVariable in allValues) && !(isMessagesPlaceholder(promptMessage) && promptMessage.optional)) throw addLangChainErrorFields(/* @__PURE__ */ new Error(`Missing value for input variable \`${inputVariable.toString()}\``), "INVALID_PROMPT_INPUT");
        acc[inputVariable] = allValues[inputVariable];
        return acc;
      }, {});
      const message = await promptMessage.formatMessages(inputValues);
      resultMessages = resultMessages.concat(message);
    }
    return resultMessages;
  }
  async partial(values) {
    const newInputVariables = this.inputVariables.filter((iv) => !(iv in values));
    const newPartialVariables = {
      ...this.partialVariables ?? {},
      ...values
    };
    return new ChatPromptTemplate2({
      ...this,
      inputVariables: newInputVariables,
      partialVariables: newPartialVariables
    });
  }
  static fromTemplate(template, options) {
    const humanTemplate = new HumanMessagePromptTemplate({ prompt: PromptTemplate.fromTemplate(template, options) });
    return this.fromMessages([humanTemplate]);
  }
  /**
  * Create a chat model-specific prompt from individual chat messages
  * or message-like tuples.
  * @param promptMessages Messages to be passed to the chat model
  * @returns A new ChatPromptTemplate
  */
  static fromMessages(promptMessages, extra) {
    const flattenedMessages = promptMessages.reduce((acc, promptMessage) => acc.concat(promptMessage instanceof ChatPromptTemplate2 ? promptMessage.promptMessages : [_coerceMessagePromptTemplateLike(promptMessage, extra)]), []);
    const flattenedPartialVariables = promptMessages.reduce((acc, promptMessage) => promptMessage instanceof ChatPromptTemplate2 ? Object.assign(acc, promptMessage.partialVariables) : acc, /* @__PURE__ */ Object.create(null));
    const inputVariables = /* @__PURE__ */ new Set();
    for (const promptMessage of flattenedMessages) {
      if (promptMessage instanceof BaseMessage) continue;
      for (const inputVariable of promptMessage.inputVariables) {
        if (inputVariable in flattenedPartialVariables) continue;
        inputVariables.add(inputVariable);
      }
    }
    return new this({
      ...extra,
      inputVariables: [...inputVariables],
      promptMessages: flattenedMessages,
      partialVariables: flattenedPartialVariables,
      templateFormat: extra?.templateFormat
    });
  }
};
var FewShotPromptTemplate = class FewShotPromptTemplate2 extends BaseStringPromptTemplate {
  lc_serializable = false;
  examples;
  exampleSelector;
  examplePrompt;
  suffix = "";
  exampleSeparator = "\n\n";
  prefix = "";
  templateFormat = "f-string";
  validateTemplate = true;
  constructor(input) {
    super(input);
    Object.assign(this, input);
    if (this.examples !== void 0 && this.exampleSelector !== void 0) throw new Error("Only one of 'examples' and 'example_selector' should be provided");
    if (this.examples === void 0 && this.exampleSelector === void 0) throw new Error("One of 'examples' and 'example_selector' should be provided");
    if (this.validateTemplate) {
      let totalInputVariables = this.inputVariables;
      if (this.partialVariables) totalInputVariables = totalInputVariables.concat(Object.keys(this.partialVariables));
      checkValidTemplate(this.prefix + this.suffix, this.templateFormat, totalInputVariables);
    }
  }
  _getPromptType() {
    return "few_shot";
  }
  static lc_name() {
    return "FewShotPromptTemplate";
  }
  async getExamples(inputVariables) {
    if (this.examples !== void 0) return this.examples;
    if (this.exampleSelector !== void 0) return this.exampleSelector.selectExamples(inputVariables);
    throw new Error("One of 'examples' and 'example_selector' should be provided");
  }
  async partial(values) {
    const newInputVariables = this.inputVariables.filter((iv) => !(iv in values));
    const newPartialVariables = {
      ...this.partialVariables ?? {},
      ...values
    };
    return new FewShotPromptTemplate2({
      ...this,
      inputVariables: newInputVariables,
      partialVariables: newPartialVariables
    });
  }
  /**
  * Formats the prompt with the given values.
  * @param values The values to format the prompt with.
  * @returns A promise that resolves to a string representing the formatted prompt.
  */
  async format(values) {
    const allValues = await this.mergePartialAndUserVariables(values);
    const examples = await this.getExamples(allValues);
    const exampleStrings = await Promise.all(examples.map((example) => this.examplePrompt.format(example)));
    return renderTemplate([
      this.prefix,
      ...exampleStrings,
      this.suffix
    ].join(this.exampleSeparator), this.templateFormat, allValues);
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
  static async deserialize(data) {
    const { example_prompt } = data;
    if (!example_prompt) throw new Error("Missing example prompt");
    const examplePrompt = await PromptTemplate.deserialize(example_prompt);
    let examples;
    if (Array.isArray(data.examples)) examples = data.examples;
    else throw new Error("Invalid examples format. Only list or string are supported.");
    return new FewShotPromptTemplate2({
      inputVariables: data.input_variables,
      examplePrompt,
      examples,
      exampleSeparator: data.example_separator,
      prefix: data.prefix,
      suffix: data.suffix,
      templateFormat: data.template_format
    });
  }
};
var FewShotChatMessagePromptTemplate = class FewShotChatMessagePromptTemplate2 extends BaseChatPromptTemplate {
  lc_serializable = true;
  examples;
  exampleSelector;
  examplePrompt;
  suffix = "";
  exampleSeparator = "\n\n";
  prefix = "";
  templateFormat = "f-string";
  validateTemplate = true;
  _getPromptType() {
    return "few_shot_chat";
  }
  static lc_name() {
    return "FewShotChatMessagePromptTemplate";
  }
  constructor(fields) {
    super(fields);
    this.examples = fields.examples;
    this.examplePrompt = fields.examplePrompt;
    this.exampleSeparator = fields.exampleSeparator ?? "\n\n";
    this.exampleSelector = fields.exampleSelector;
    this.prefix = fields.prefix ?? "";
    this.suffix = fields.suffix ?? "";
    this.templateFormat = fields.templateFormat ?? "f-string";
    this.validateTemplate = fields.validateTemplate ?? true;
    if (this.examples !== void 0 && this.exampleSelector !== void 0) throw new Error("Only one of 'examples' and 'example_selector' should be provided");
    if (this.examples === void 0 && this.exampleSelector === void 0) throw new Error("One of 'examples' and 'example_selector' should be provided");
    if (this.validateTemplate) {
      let totalInputVariables = this.inputVariables;
      if (this.partialVariables) totalInputVariables = totalInputVariables.concat(Object.keys(this.partialVariables));
      checkValidTemplate(this.prefix + this.suffix, this.templateFormat, totalInputVariables);
    }
  }
  async getExamples(inputVariables) {
    if (this.examples !== void 0) return this.examples;
    if (this.exampleSelector !== void 0) return this.exampleSelector.selectExamples(inputVariables);
    throw new Error("One of 'examples' and 'example_selector' should be provided");
  }
  /**
  * Formats the list of values and returns a list of formatted messages.
  * @param values The values to format the prompt with.
  * @returns A promise that resolves to a string representing the formatted prompt.
  */
  async formatMessages(values) {
    const allValues = await this.mergePartialAndUserVariables(values);
    let examples = await this.getExamples(allValues);
    examples = examples.map((example) => {
      const result = {};
      this.examplePrompt.inputVariables.forEach((inputVariable) => {
        result[inputVariable] = example[inputVariable];
      });
      return result;
    });
    const messages = [];
    for (const example of examples) {
      const exampleMessages = await this.examplePrompt.formatMessages(example);
      messages.push(...exampleMessages);
    }
    return messages;
  }
  /**
  * Formats the prompt with the given values.
  * @param values The values to format the prompt with.
  * @returns A promise that resolves to a string representing the formatted prompt.
  */
  async format(values) {
    const allValues = await this.mergePartialAndUserVariables(values);
    const examples = await this.getExamples(allValues);
    const exampleStrings = (await Promise.all(examples.map((example) => this.examplePrompt.formatMessages(example)))).flat().map((message) => message.content);
    return renderTemplate([
      this.prefix,
      ...exampleStrings,
      this.suffix
    ].join(this.exampleSeparator), this.templateFormat, allValues);
  }
  /**
  * Partially formats the prompt with the given values.
  * @param values The values to partially format the prompt with.
  * @returns A promise that resolves to an instance of `FewShotChatMessagePromptTemplate` with the given values partially formatted.
  */
  async partial(values) {
    const newInputVariables = this.inputVariables.filter((variable) => !(variable in values));
    const newPartialVariables = {
      ...this.partialVariables ?? {},
      ...values
    };
    return new FewShotChatMessagePromptTemplate2({
      ...this,
      inputVariables: newInputVariables,
      partialVariables: newPartialVariables
    });
  }
};
var PipelinePromptTemplate = class PipelinePromptTemplate2 extends BasePromptTemplate {
  static lc_name() {
    return "PipelinePromptTemplate";
  }
  pipelinePrompts;
  finalPrompt;
  constructor(input) {
    super({
      ...input,
      inputVariables: []
    });
    this.pipelinePrompts = input.pipelinePrompts;
    this.finalPrompt = input.finalPrompt;
    this.inputVariables = this.computeInputValues();
  }
  /**
  * Computes the input values required by the pipeline prompts.
  * @returns Array of input values required by the pipeline prompts.
  */
  computeInputValues() {
    const intermediateValues = this.pipelinePrompts.map((pipelinePrompt) => pipelinePrompt.name);
    const inputValues = this.pipelinePrompts.map((pipelinePrompt) => pipelinePrompt.prompt.inputVariables.filter((inputValue) => !intermediateValues.includes(inputValue))).flat();
    return [...new Set(inputValues)];
  }
  static extractRequiredInputValues(allValues, requiredValueNames) {
    return requiredValueNames.reduce((requiredValues, valueName) => {
      requiredValues[valueName] = allValues[valueName];
      return requiredValues;
    }, {});
  }
  /**
  * Formats the pipeline prompts based on the provided input values.
  * @param values Input values to format the pipeline prompts.
  * @returns Promise that resolves with the formatted input values.
  */
  async formatPipelinePrompts(values) {
    const allValues = await this.mergePartialAndUserVariables(values);
    for (const { name: pipelinePromptName, prompt: pipelinePrompt } of this.pipelinePrompts) {
      const pipelinePromptInputValues = PipelinePromptTemplate2.extractRequiredInputValues(allValues, pipelinePrompt.inputVariables);
      if (pipelinePrompt instanceof ChatPromptTemplate) allValues[pipelinePromptName] = await pipelinePrompt.formatMessages(pipelinePromptInputValues);
      else allValues[pipelinePromptName] = await pipelinePrompt.format(pipelinePromptInputValues);
    }
    return PipelinePromptTemplate2.extractRequiredInputValues(allValues, this.finalPrompt.inputVariables);
  }
  /**
  * Formats the final prompt value based on the provided input values.
  * @param values Input values to format the final prompt value.
  * @returns Promise that resolves with the formatted final prompt value.
  */
  async formatPromptValue(values) {
    return this.finalPrompt.formatPromptValue(await this.formatPipelinePrompts(values));
  }
  async format(values) {
    return this.finalPrompt.format(await this.formatPipelinePrompts(values));
  }
  /**
  * Handles partial prompts, which are prompts that have been partially
  * filled with input values.
  * @param values Partial input values.
  * @returns Promise that resolves with a new PipelinePromptTemplate instance with updated input variables.
  */
  async partial(values) {
    const promptDict = { ...this };
    promptDict.inputVariables = this.inputVariables.filter((iv) => !(iv in values));
    promptDict.partialVariables = {
      ...this.partialVariables ?? {},
      ...values
    };
    return new PipelinePromptTemplate2(promptDict);
  }
  serialize() {
    throw new Error("Not implemented.");
  }
  _getPromptType() {
    return "pipeline";
  }
};
function isWithStructuredOutput(x) {
  return typeof x === "object" && x != null && "withStructuredOutput" in x && typeof x.withStructuredOutput === "function";
}
function isRunnableBinding(x) {
  return typeof x === "object" && x != null && "lc_id" in x && Array.isArray(x.lc_id) && x.lc_id.join("/") === "langchain_core/runnables/RunnableBinding";
}
var StructuredPrompt = class StructuredPrompt2 extends ChatPromptTemplate {
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
  constructor(input) {
    super(input);
    this.schema = input.schema;
    this.method = input.method;
  }
  pipe(coerceable) {
    if (isWithStructuredOutput(coerceable)) return super.pipe(coerceable.withStructuredOutput(this.schema));
    if (isRunnableBinding(coerceable) && isWithStructuredOutput(coerceable.bound)) return super.pipe(new RunnableBinding({
      bound: coerceable.bound.withStructuredOutput(this.schema, ...this.method ? [{ method: this.method }] : []),
      kwargs: coerceable.kwargs ?? {},
      config: coerceable.config,
      configFactories: coerceable.configFactories
    }));
    throw new Error(`Structured prompts need to be piped to a language model that supports the "withStructuredOutput()" method.`);
  }
  static fromMessagesAndSchema(promptMessages, schema, method) {
    return StructuredPrompt2.fromMessages(promptMessages, {
      schema,
      method
    });
  }
};
var prompts_exports = /* @__PURE__ */ __exportAll({
  AIMessagePromptTemplate: () => AIMessagePromptTemplate,
  BaseChatPromptTemplate: () => BaseChatPromptTemplate,
  BaseMessagePromptTemplate: () => BaseMessagePromptTemplate,
  BaseMessageStringPromptTemplate: () => BaseMessageStringPromptTemplate,
  BasePromptTemplate: () => BasePromptTemplate,
  BaseStringPromptTemplate: () => BaseStringPromptTemplate,
  ChatMessagePromptTemplate: () => ChatMessagePromptTemplate,
  ChatPromptTemplate: () => ChatPromptTemplate,
  DEFAULT_FORMATTER_MAPPING: () => DEFAULT_FORMATTER_MAPPING,
  DEFAULT_PARSER_MAPPING: () => DEFAULT_PARSER_MAPPING,
  DictPromptTemplate: () => DictPromptTemplate,
  FewShotChatMessagePromptTemplate: () => FewShotChatMessagePromptTemplate,
  FewShotPromptTemplate: () => FewShotPromptTemplate,
  HumanMessagePromptTemplate: () => HumanMessagePromptTemplate,
  ImagePromptTemplate: () => ImagePromptTemplate,
  MessagesPlaceholder: () => MessagesPlaceholder,
  PipelinePromptTemplate: () => PipelinePromptTemplate,
  PromptTemplate: () => PromptTemplate,
  StructuredPrompt: () => StructuredPrompt,
  SystemMessagePromptTemplate: () => SystemMessagePromptTemplate,
  checkValidTemplate: () => checkValidTemplate,
  interpolateFString: () => interpolateFString,
  interpolateMustache: () => interpolateMustache,
  parseFString: () => parseFString,
  parseMustache: () => parseMustache,
  parseTemplate: () => parseTemplate,
  renderTemplate: () => renderTemplate
});
var document_compressors_exports = /* @__PURE__ */ __exportAll({ BaseDocumentCompressor: () => BaseDocumentCompressor });
var BaseDocumentCompressor = class {
  static isBaseDocumentCompressor(x) {
    return x?.compressDocuments !== void 0;
  }
};
var retrievers_exports = /* @__PURE__ */ __exportAll({ BaseRetriever: () => BaseRetriever });
var BaseRetriever = class extends Runnable {
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
  constructor(fields) {
    super(fields);
    this.callbacks = fields?.callbacks;
    this.tags = fields?.tags ?? [];
    this.metadata = fields?.metadata ?? {};
    this.verbose = fields?.verbose ?? false;
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
  _getRelevantDocuments(_query, _callbacks) {
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
  async invoke(input, options) {
    const parsedConfig = ensureConfig(parseCallbackConfigArg(options));
    const runManager = await (await CallbackManager.configure(parsedConfig.callbacks, this.callbacks, parsedConfig.tags, this.tags, parsedConfig.metadata, this.metadata, { verbose: this.verbose }))?.handleRetrieverStart(this.toJSON(), input, parsedConfig.runId, void 0, void 0, void 0, parsedConfig.runName);
    try {
      const results = await this._getRelevantDocuments(input, runManager);
      await runManager?.handleRetrieverEnd(results);
      return results;
    } catch (error) {
      await runManager?.handleRetrieverError(error);
      throw error;
    }
  }
};
var stores_exports = /* @__PURE__ */ __exportAll({
  BaseStore: () => BaseStore$1,
  InMemoryStore: () => InMemoryStore$1
});
var BaseStore$1 = class BaseStore extends Serializable {
};
var InMemoryStore$1 = class InMemoryStore extends BaseStore$1 {
  lc_namespace = ["langchain", "storage"];
  store = {};
  /**
  * Retrieves the values associated with the given keys from the store.
  * @param keys Keys to retrieve values for.
  * @returns Array of values associated with the given keys.
  */
  async mget(keys) {
    return keys.map((key) => this.store[key]);
  }
  /**
  * Sets the values for the given keys in the store.
  * @param keyValuePairs Array of key-value pairs to set in the store.
  * @returns Promise that resolves when all key-value pairs have been set.
  */
  async mset(keyValuePairs) {
    for (const [key, value] of keyValuePairs) this.store[key] = value;
  }
  /**
  * Deletes the given keys and their associated values from the store.
  * @param keys Keys to delete from the store.
  * @returns Promise that resolves when all keys have been deleted.
  */
  async mdelete(keys) {
    for (const key of keys) delete this.store[key];
  }
  /**
  * Asynchronous generator that yields keys from the store. If a prefix is
  * provided, it only yields keys that start with the prefix.
  * @param prefix Optional prefix to filter keys.
  * @returns AsyncGenerator that yields keys from the store.
  */
  async *yieldKeys(prefix) {
    const keys = Object.keys(this.store);
    for (const key of keys) if (prefix === void 0 || key.startsWith(prefix)) yield key;
  }
};
const Operators = {
  and: "and",
  or: "or",
  not: "not"
};
const Comparators = {
  eq: "eq",
  ne: "ne",
  lt: "lt",
  gt: "gt",
  lte: "lte",
  gte: "gte"
};
var Visitor = class {
};
var Expression = class {
  accept(visitor) {
    if (this.exprName === "Operation") return visitor.visitOperation(this);
    else if (this.exprName === "Comparison") return visitor.visitComparison(this);
    else if (this.exprName === "StructuredQuery") return visitor.visitStructuredQuery(this);
    else throw new Error("Unknown Expression type");
  }
};
var FilterDirective = class extends Expression {
};
var Comparison = class extends FilterDirective {
  exprName = "Comparison";
  constructor(comparator, attribute, value) {
    super();
    this.comparator = comparator;
    this.attribute = attribute;
    this.value = value;
  }
};
var Operation = class extends FilterDirective {
  exprName = "Operation";
  constructor(operator, args) {
    super();
    this.operator = operator;
    this.args = args;
  }
};
var StructuredQuery = class extends Expression {
  exprName = "StructuredQuery";
  constructor(query, filter) {
    super();
    this.query = query;
    this.filter = filter;
  }
};
function isObject(obj) {
  return obj && typeof obj === "object" && !Array.isArray(obj);
}
function isFilterEmpty(filter) {
  if (!filter) return true;
  if (typeof filter === "string" && filter.length > 0) return false;
  if (typeof filter === "function") return false;
  return isObject(filter) && Object.keys(filter).length === 0;
}
function isInt(value) {
  if (typeof value === "number") return value % 1 === 0;
  else if (typeof value === "string") {
    const numberValue = parseInt(value, 10);
    return !Number.isNaN(numberValue) && numberValue % 1 === 0 && numberValue.toString() === value;
  }
  return false;
}
function isFloat(value) {
  if (typeof value === "number") return value % 1 !== 0;
  else if (typeof value === "string") {
    const numberValue = parseFloat(value);
    return !Number.isNaN(numberValue) && numberValue % 1 !== 0 && numberValue.toString() === value;
  }
  return false;
}
function isString(value) {
  return typeof value === "string" && (Number.isNaN(parseFloat(value)) || parseFloat(value).toString() !== value);
}
function isBoolean(value) {
  return typeof value === "boolean";
}
function castValue(input) {
  let value;
  if (isString(input)) value = input;
  else if (isInt(input)) value = parseInt(input, 10);
  else if (isFloat(input)) value = parseFloat(input);
  else if (isBoolean(input)) value = Boolean(input);
  else throw new Error("Unsupported value type");
  return value;
}
var BaseTranslator = class extends Visitor {
};
var BasicTranslator = class extends BaseTranslator {
  allowedOperators;
  allowedComparators;
  constructor(opts) {
    super();
    this.allowedOperators = opts?.allowedOperators ?? [Operators.and, Operators.or];
    this.allowedComparators = opts?.allowedComparators ?? [
      Comparators.eq,
      Comparators.ne,
      Comparators.gt,
      Comparators.gte,
      Comparators.lt,
      Comparators.lte
    ];
  }
  formatFunction(func) {
    if (func in Comparators) {
      if (this.allowedComparators.length > 0 && this.allowedComparators.indexOf(func) === -1) throw new Error(`Comparator ${func} not allowed. Allowed comparators: ${this.allowedComparators.join(", ")}`);
    } else if (func in Operators) {
      if (this.allowedOperators.length > 0 && this.allowedOperators.indexOf(func) === -1) throw new Error(`Operator ${func} not allowed. Allowed operators: ${this.allowedOperators.join(", ")}`);
    } else throw new Error("Unknown comparator or operator");
    return `$${func}`;
  }
  /**
  * Visits an operation and returns a result.
  * @param operation The operation to visit.
  * @returns The result of visiting the operation.
  */
  visitOperation(operation) {
    const args = operation.args?.map((arg) => arg.accept(this));
    return { [this.formatFunction(operation.operator)]: args };
  }
  /**
  * Visits a comparison and returns a result.
  * @param comparison The comparison to visit.
  * @returns The result of visiting the comparison.
  */
  visitComparison(comparison) {
    return { [comparison.attribute]: { [this.formatFunction(comparison.comparator)]: castValue(comparison.value) } };
  }
  /**
  * Visits a structured query and returns a result.
  * @param query The structured query to visit.
  * @returns The result of visiting the structured query.
  */
  visitStructuredQuery(query) {
    let nextArg = {};
    if (query.filter) nextArg = { filter: query.filter.accept(this) };
    return nextArg;
  }
  mergeFilters(defaultFilter, generatedFilter, mergeType = "and", forceDefaultFilter = false) {
    if (isFilterEmpty(defaultFilter) && isFilterEmpty(generatedFilter)) return;
    if (isFilterEmpty(defaultFilter) || mergeType === "replace") {
      if (isFilterEmpty(generatedFilter)) return;
      return generatedFilter;
    }
    if (isFilterEmpty(generatedFilter)) {
      if (forceDefaultFilter) return defaultFilter;
      if (mergeType === "and") return;
      return defaultFilter;
    }
    if (mergeType === "and") return { $and: [defaultFilter, generatedFilter] };
    else if (mergeType === "or") return { $or: [defaultFilter, generatedFilter] };
    else throw new Error("Unknown merge type");
  }
};
var FunctionalTranslator = class extends BaseTranslator {
  allowedOperators = [Operators.and, Operators.or];
  allowedComparators = [
    Comparators.eq,
    Comparators.ne,
    Comparators.gt,
    Comparators.gte,
    Comparators.lt,
    Comparators.lte
  ];
  formatFunction() {
    throw new Error("Not implemented");
  }
  /**
  * Returns the allowed comparators for a given data type.
  * @param input The input value to get the allowed comparators for.
  * @returns An array of allowed comparators for the input data type.
  */
  getAllowedComparatorsForType(inputType) {
    switch (inputType) {
      case "string":
        return [
          Comparators.eq,
          Comparators.ne,
          Comparators.gt,
          Comparators.gte,
          Comparators.lt,
          Comparators.lte
        ];
      case "number":
        return [
          Comparators.eq,
          Comparators.ne,
          Comparators.gt,
          Comparators.gte,
          Comparators.lt,
          Comparators.lte
        ];
      case "boolean":
        return [Comparators.eq, Comparators.ne];
      default:
        throw new Error(`Unsupported data type: ${inputType}`);
    }
  }
  /**
  * Returns a function that performs a comparison based on the provided
  * comparator.
  * @param comparator The comparator to base the comparison function on.
  * @returns A function that takes two arguments and returns a boolean based on the comparison.
  */
  getComparatorFunction(comparator) {
    switch (comparator) {
      case Comparators.eq:
        return (a, b) => a === b;
      case Comparators.ne:
        return (a, b) => a !== b;
      case Comparators.gt:
        return (a, b) => a > b;
      case Comparators.gte:
        return (a, b) => a >= b;
      case Comparators.lt:
        return (a, b) => a < b;
      case Comparators.lte:
        return (a, b) => a <= b;
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
  getOperatorFunction(operator) {
    switch (operator) {
      case Operators.and:
        return (a, b) => a && b;
      case Operators.or:
        return (a, b) => a || b;
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
  visitOperation(operation) {
    const { operator, args } = operation;
    if (this.allowedOperators.includes(operator)) {
      const operatorFunction = this.getOperatorFunction(operator);
      return (document) => {
        if (!args) return true;
        return args.reduce((acc, arg) => {
          const result = arg.accept(this);
          if (typeof result === "function") return operatorFunction(acc, result(document));
          else throw new Error("Filter is not a function");
        }, true);
      };
    } else throw new Error("Operator not allowed");
  }
  /**
  * Visits the comparison part of a structured query and translates it into
  * a functional filter.
  * @param comparison The comparison part of a structured query.
  * @returns A function that takes a `Document` as an argument and returns a boolean based on the comparison.
  */
  visitComparison(comparison) {
    const { comparator, attribute, value } = comparison;
    const undefinedTrue = [Comparators.ne];
    if (this.allowedComparators.includes(comparator)) {
      if (!this.getAllowedComparatorsForType(typeof value).includes(comparator)) throw new Error(`'${comparator}' comparator not allowed to be used with ${typeof value}`);
      const comparatorFunction = this.getComparatorFunction(comparator);
      return (document) => {
        const documentValue = document.metadata[attribute];
        if (documentValue === void 0) {
          if (undefinedTrue.includes(comparator)) return true;
          return false;
        }
        return comparatorFunction(documentValue, castValue(value));
      };
    } else throw new Error("Comparator not allowed");
  }
  /**
  * Visits a structured query and translates it into a functional filter.
  * @param query The structured query to translate.
  * @returns An object containing a `filter` property, which is a function that takes a `Document` as an argument and returns a boolean based on the structured query.
  */
  visitStructuredQuery(query) {
    if (!query.filter) return {};
    const filterFunction = query.filter?.accept(this);
    if (typeof filterFunction !== "function") throw new Error("Structured query filter is not a function");
    return { filter: filterFunction };
  }
  /**
  * Merges two filters into one, based on the specified merge type.
  * @param defaultFilter The default filter function.
  * @param generatedFilter The generated filter function.
  * @param mergeType The type of merge to perform. Can be 'and', 'or', or 'replace'. Default is 'and'.
  * @returns A function that takes a `Document` as an argument and returns a boolean based on the merged filters, or `undefined` if both filters are empty.
  */
  mergeFilters(defaultFilter, generatedFilter, mergeType = "and") {
    if (isFilterEmpty(defaultFilter) && isFilterEmpty(generatedFilter)) return;
    if (isFilterEmpty(defaultFilter) || mergeType === "replace") {
      if (isFilterEmpty(generatedFilter)) return;
      return generatedFilter;
    }
    if (isFilterEmpty(generatedFilter)) {
      if (mergeType === "and") return;
      return defaultFilter;
    }
    if (mergeType === "and") return (document) => defaultFilter(document) && generatedFilter(document);
    else if (mergeType === "or") return (document) => defaultFilter(document) || generatedFilter(document);
    else throw new Error("Unknown merge type");
  }
};
var structured_query_exports = /* @__PURE__ */ __exportAll({
  BaseTranslator: () => BaseTranslator,
  BasicTranslator: () => BasicTranslator,
  Comparators: () => Comparators,
  Comparison: () => Comparison,
  Expression: () => Expression,
  FilterDirective: () => FilterDirective,
  FunctionalTranslator: () => FunctionalTranslator,
  Operation: () => Operation,
  Operators: () => Operators,
  StructuredQuery: () => StructuredQuery,
  Visitor: () => Visitor,
  castValue: () => castValue,
  isBoolean: () => isBoolean,
  isFilterEmpty: () => isFilterEmpty,
  isFloat: () => isFloat,
  isInt: () => isInt,
  isObject: () => isObject,
  isString: () => isString
});
function isChatModelStream(received) {
  if (received == null || typeof received !== "object") return false;
  const stream = received;
  return typeof stream.text !== "undefined" && typeof stream.toolCalls !== "undefined" && typeof stream.reasoning !== "undefined" && typeof stream.usage !== "undefined" && typeof stream.output !== "undefined" && typeof stream[Symbol.asyncIterator] === "function";
}
function matchesPartialObject(actual, expected, equals) {
  if (actual == null) return false;
  return Object.entries(expected).every(([key, value]) => equals(actual[key], value));
}
function matchesStreamUsage(actual, expected, equals) {
  if (actual == null) return false;
  return matchesPartialObject(actual, expected, equals);
}
function getOutputText(message) {
  return message.content.find((block) => block.type === "text")?.text;
}
function matchesStreamOutput(message, expected, equals) {
  if (expected.id !== void 0 && message.id !== expected.id) return false;
  if (expected.text !== void 0 && getOutputText(message) !== expected.text) return false;
  if (expected.toolCalls !== void 0) {
    const calls = message.tool_calls ?? [];
    if (calls.length !== expected.toolCalls.length) return false;
    for (let i = 0; i < expected.toolCalls.length; i++) {
      const call2 = calls[i];
      const exp = expected.toolCalls[i];
      if (call2?.name !== exp.name || !equals(call2.args, exp.args)) return false;
    }
  }
  if (expected.usage !== void 0 && !matchesStreamUsage(message.usage_metadata, expected.usage, equals)) return false;
  if (expected.responseMetadata !== void 0 && !matchesPartialObject(message.response_metadata, expected.responseMetadata, equals)) return false;
  return true;
}
function invalidStreamResult(received, matcherName, utils) {
  return {
    pass: false,
    message: () => `${utils.matcherHint(matcherName)}

Expected: ChatModelStream (return value of model.streamEvents("Hello"))
Received: ${utils.printReceived(received)}`,
    actual: received,
    expected: "ChatModelStream"
  };
}
function applyNot(pass, isNot) {
  return isNot ? !pass : pass;
}
async function toHaveStreamText(received, expected) {
  const { isNot, utils } = this;
  const matcherName = "toHaveStreamText";
  if (!isChatModelStream(received)) return invalidStreamResult(received, matcherName, utils);
  const actual = await received.text;
  return {
    pass: applyNot(actual === expected, isNot),
    message: () => `${utils.matcherHint(matcherName, void 0, void 0, { isNot })}

Expected stream text: ${isNot ? "not " : ""}${utils.printExpected(expected)}
Received stream text: ${utils.printReceived(actual)}`,
    actual,
    expected
  };
}
async function toHaveStreamReasoning(received, expected) {
  const { isNot, utils } = this;
  const matcherName = "toHaveStreamReasoning";
  if (!isChatModelStream(received)) return invalidStreamResult(received, matcherName, utils);
  const actual = await received.reasoning;
  return {
    pass: applyNot(actual === expected, isNot),
    message: () => `${utils.matcherHint(matcherName, void 0, void 0, { isNot })}

Expected stream reasoning: ${isNot ? "not " : ""}${utils.printExpected(expected)}
Received stream reasoning: ${utils.printReceived(actual)}`,
    actual,
    expected
  };
}
async function toHaveStreamToolCalls(received, expected) {
  const { isNot, utils } = this;
  const matcherName = "toHaveStreamToolCalls";
  if (!isChatModelStream(received)) return invalidStreamResult(received, matcherName, utils);
  const actual = await received.toolCalls;
  let pass = actual.length === expected.length && expected.every((exp, i) => {
    const call2 = actual[i];
    return call2?.name === exp.name && this.equals(call2.args, exp.args);
  });
  pass = applyNot(pass, isNot);
  return {
    pass,
    message: () => `${utils.matcherHint(matcherName, void 0, void 0, { isNot })}

Expected stream tool calls: ${utils.printExpected(expected)}
Received stream tool calls: ${utils.printReceived(actual.map((tc) => ({
      name: tc.name,
      args: tc.args
    })))}`,
    actual: actual.map((tc) => ({
      name: tc.name,
      args: tc.args
    })),
    expected
  };
}
async function toHaveStreamUsage(received, expected) {
  const { isNot, utils } = this;
  const matcherName = "toHaveStreamUsage";
  if (!isChatModelStream(received)) return invalidStreamResult(received, matcherName, utils);
  const actual = await received.usage;
  return {
    pass: applyNot(matchesStreamUsage(actual, expected, this.equals), isNot),
    message: () => `${utils.matcherHint(matcherName, void 0, void 0, { isNot })}

Expected stream usage: ${utils.printExpected(expected)}
Received stream usage: ${utils.printReceived(actual)}`,
    actual,
    expected
  };
}
async function toHaveStreamOutput(received, expected) {
  const { isNot, utils } = this;
  const matcherName = "toHaveStreamOutput";
  if (!isChatModelStream(received)) return invalidStreamResult(received, matcherName, utils);
  const message = await received.output;
  return {
    pass: applyNot(matchesStreamOutput(message, expected, this.equals), isNot),
    message: () => `${utils.matcherHint(matcherName, void 0, void 0, { isNot })}

Expected stream output: ${utils.printExpected(expected)}
Received stream output: ${utils.printReceived({
      id: message.id,
      text: getOutputText(message),
      tool_calls: message.tool_calls?.map((tc) => ({
        name: tc.name,
        args: tc.args
      })),
      usage_metadata: message.usage_metadata,
      response_metadata: message.response_metadata
    })}`,
    actual: message,
    expected
  };
}
const streamMatchers = {
  toHaveStreamText,
  toHaveStreamReasoning,
  toHaveStreamToolCalls,
  toHaveStreamUsage,
  toHaveStreamOutput
};
function getMessageTypeName(msg) {
  if (!BaseMessage.isInstance(msg)) return typeof msg;
  return msg.constructor.name || msg.type;
}
function makeMessageTypeMatcher(typeName, isInstance) {
  return function(received, expected) {
    const { isNot, utils } = this;
    if (!isInstance(received)) return {
      pass: false,
      message: () => `${utils.matcherHint(`toBe${typeName}`, void 0, void 0)}

Expected: ${isNot ? "not " : ""}${typeName}
Received: ${getMessageTypeName(received)}`,
      actual: getMessageTypeName(received),
      expected: typeName
    };
    if (expected === void 0) return {
      pass: true,
      message: () => `${utils.matcherHint(`toBe${typeName}`, void 0, void 0)}

Expected: not ${typeName}
Received: ${typeName}`
    };
    const msg = received;
    if (typeof expected === "string") return {
      pass: msg.content === expected,
      message: () => `${utils.matcherHint(`toBe${typeName}`, void 0, void 0)}

Expected: ${typeName} with content ${utils.printExpected(expected)}
Received: ${typeName} with content ${utils.printReceived(msg.content)}`,
      actual: msg.content,
      expected
    };
    return {
      pass: Object.entries(expected).every(([key, value]) => this.equals(msg[key], value)),
      message: () => {
        const receivedFields = {};
        for (const key of Object.keys(expected)) receivedFields[key] = msg[key];
        return `${utils.matcherHint(`toBe${typeName}`, void 0, void 0)}

Expected: ${typeName} matching ${utils.printExpected(expected)}
Received: ${typeName} with ${utils.printReceived(receivedFields)}`;
      },
      actual: (() => {
        const receivedFields = {};
        for (const key of Object.keys(expected)) receivedFields[key] = msg[key];
        return receivedFields;
      })(),
      expected
    };
  };
}
const toBeHumanMessage = makeMessageTypeMatcher("HumanMessage", HumanMessage.isInstance);
const toBeAIMessage = makeMessageTypeMatcher("AIMessage", AIMessage.isInstance);
const toBeSystemMessage = makeMessageTypeMatcher("SystemMessage", SystemMessage.isInstance);
const toBeToolMessage = makeMessageTypeMatcher("ToolMessage", ToolMessage.isInstance);
function toHaveToolCalls(received, expected) {
  const { isNot, utils } = this;
  if (!AIMessage.isInstance(received)) return {
    pass: false,
    message: () => `${utils.matcherHint("toHaveToolCalls")}

Expected: AIMessage
Received: ${getMessageTypeName(received)}`
  };
  const actual = received.tool_calls ?? [];
  if (actual.length !== expected.length) return {
    pass: false,
    message: () => `${utils.matcherHint("toHaveToolCalls")}

Expected ${isNot ? "not " : ""}${expected.length} tool call(s), received ${actual.length}`,
    actual: actual.length,
    expected: expected.length
  };
  const unmatched = expected.filter((exp) => !actual.some((tc) => Object.entries(exp).every(([key, value]) => this.equals(tc[key], value))));
  if (unmatched.length > 0) return {
    pass: false,
    message: () => `${utils.matcherHint("toHaveToolCalls")}

Could not find matching tool call(s) for:
${utils.printExpected(unmatched)}
Received tool calls: ${utils.printReceived(actual.map((tc) => ({
      name: tc.name,
      id: tc.id,
      args: tc.args
    })))}`,
    actual: actual.map((tc) => ({
      name: tc.name,
      id: tc.id,
      args: tc.args
    })),
    expected
  };
  return {
    pass: true,
    message: () => `${utils.matcherHint("toHaveToolCalls")}

Expected AIMessage not to have matching tool calls`
  };
}
function toHaveToolCallCount(received, expected) {
  const { isNot, utils } = this;
  if (!AIMessage.isInstance(received)) return {
    pass: false,
    message: () => `${utils.matcherHint("toHaveToolCallCount")}

Expected: AIMessage
Received: ${getMessageTypeName(received)}`
  };
  const actual = received.tool_calls?.length ?? 0;
  return {
    pass: actual === expected,
    message: () => `${utils.matcherHint("toHaveToolCallCount")}

Expected ${isNot ? "not " : ""}${expected} tool call(s)
Received: ${actual}`,
    actual,
    expected
  };
}
function toContainToolCall(received, expected) {
  const { isNot, utils } = this;
  if (!AIMessage.isInstance(received)) return {
    pass: false,
    message: () => `${utils.matcherHint("toContainToolCall")}

Expected: AIMessage
Received: ${getMessageTypeName(received)}`
  };
  const actual = received.tool_calls ?? [];
  return {
    pass: actual.some((tc) => Object.entries(expected).every(([key, value]) => this.equals(tc[key], value))),
    message: () => `${utils.matcherHint("toContainToolCall")}

Expected AIMessage ${isNot ? "not " : ""}to contain a tool call matching ${utils.printExpected(expected)}
Received tool calls: ${utils.printReceived(actual.map((tc) => ({
      name: tc.name,
      id: tc.id
    })))}`,
    actual: actual.map((tc) => ({
      name: tc.name,
      id: tc.id
    })),
    expected
  };
}
function toHaveToolMessages(received, expected) {
  const { isNot, utils } = this;
  if (!Array.isArray(received)) return {
    pass: false,
    message: () => `${utils.matcherHint("toHaveToolMessages")}

Expected an array of messages
Received: ${typeof received}`
  };
  const toolMessages = received.filter(ToolMessage.isInstance);
  if (toolMessages.length !== expected.length) return {
    pass: false,
    message: () => `${utils.matcherHint("toHaveToolMessages")}

Expected ${isNot ? "not " : ""}${expected.length} tool message(s), found ${toolMessages.length}`,
    actual: toolMessages.length,
    expected: expected.length
  };
  for (let i = 0; i < expected.length; i++) if (!Object.entries(expected[i]).every(([key, value]) => this.equals(toolMessages[i][key], value))) return {
    pass: false,
    message: () => {
      const receivedFields = {};
      for (const key of Object.keys(expected[i])) receivedFields[key] = toolMessages[i][key];
      return `${utils.matcherHint("toHaveToolMessages")}

Tool message at index ${i} did not match:
Expected: ${utils.printExpected(expected[i])}
Received: ${utils.printReceived(receivedFields)}`;
    },
    actual: toolMessages[i],
    expected: expected[i]
  };
  return {
    pass: true,
    message: () => `${utils.matcherHint("toHaveToolMessages")}

Expected messages not to contain matching tool messages`
  };
}
function toHaveBeenInterrupted(received, expectedValue) {
  const { isNot, utils } = this;
  const interrupts = received?.__interrupt__;
  if (!(Array.isArray(interrupts) && interrupts.length > 0)) return {
    pass: false,
    message: () => `${utils.matcherHint("toHaveBeenInterrupted")}

Expected result ${isNot ? "not " : ""}to have been interrupted
Received __interrupt__: ${utils.printReceived(interrupts)}`
  };
  if (expectedValue === void 0) return {
    pass: true,
    message: () => `${utils.matcherHint("toHaveBeenInterrupted")}

Expected result not to have been interrupted
Received ${interrupts.length} interrupt(s)`
  };
  const actualValue = interrupts[0]?.value;
  return {
    pass: this.equals(actualValue, expectedValue),
    message: () => `${utils.matcherHint("toHaveBeenInterrupted")}

Expected interrupt value: ${utils.printExpected(expectedValue)}
Received interrupt value: ${utils.printReceived(actualValue)}`,
    actual: actualValue,
    expected: expectedValue
  };
}
function toHaveStructuredResponse(received, expected) {
  const { isNot, utils } = this;
  const structuredResponse = received?.structuredResponse;
  if (!(structuredResponse !== void 0)) return {
    pass: false,
    message: () => `${utils.matcherHint("toHaveStructuredResponse")}

Expected result ${isNot ? "not " : ""}to have a structured response
Received structuredResponse: undefined`
  };
  if (expected === void 0) return {
    pass: true,
    message: () => `${utils.matcherHint("toHaveStructuredResponse")}

Expected result not to have a structured response`
  };
  return {
    pass: Object.entries(expected).every(([key, value]) => this.equals(structuredResponse[key], value)),
    message: () => `${utils.matcherHint("toHaveStructuredResponse")}

Expected structured response: ${utils.printExpected(expected)}
Received structured response: ${utils.printReceived(structuredResponse)}`,
    actual: structuredResponse,
    expected
  };
}
const langchainMatchers = {
  toBeHumanMessage,
  toBeAIMessage,
  toBeSystemMessage,
  toBeToolMessage,
  toHaveToolCalls,
  toHaveToolCallCount,
  toContainToolCall,
  toHaveToolMessages,
  toHaveBeenInterrupted,
  toHaveStructuredResponse,
  ...streamMatchers
};
function deriveContent(messages) {
  return messages.map((m) => m.text).filter(Boolean).join("-");
}
let idCounter = 0;
function nextToolCallId() {
  idCounter += 1;
  return `fake_tc_${idCounter}`;
}
var FakeBuiltModel = class FakeBuiltModel2 extends BaseChatModel {
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
  respond(entry) {
    if (typeof entry === "function") this.queue.push({
      kind: "factory",
      factory: entry
    });
    else if (BaseMessage.isInstance(entry)) this.queue.push({
      kind: "message",
      message: entry
    });
    else this.queue.push({
      kind: "error",
      error: entry
    });
    return this;
  }
  /**
  * Enqueue an {@link AIMessage} that carries the given tool calls.
  * Content is derived from the input messages at invocation time.
  * @param toolCalls Array of tool calls. Each entry needs `name` and
  *   `args`; `id` is optional and auto-generated when omitted.
  * @returns `this`, for chaining.
  */
  respondWithTools(toolCalls) {
    this.queue.push({
      kind: "toolCalls",
      toolCalls: toolCalls.map((tc) => ({
        name: tc.name,
        args: tc.args,
        id: tc.id ?? nextToolCallId(),
        type: "tool_call"
      }))
    });
    return this;
  }
  /**
  * Make every invocation throw the given error, regardless of the queue.
  * @param error The error to throw.
  * @returns `this`, for chaining.
  */
  alwaysThrow(error) {
    this._alwaysThrowError = error;
    return this;
  }
  /**
  * Set the value that {@link withStructuredOutput} will resolve to.
  * @param value The structured object to return.
  * @returns `this`, for chaining.
  */
  structuredResponse(value) {
    this._structuredResponseValue = value;
    return this;
  }
  /**
  * Bind tools to the model. Returns a new model that shares the same
  * response queue and call history.
  * @param tools The tools to bind, as {@link StructuredTool} instances or
  *   plain {@link ToolSpec} objects.
  * @returns A new RunnableBinding with the tools bound.
  */
  bindTools(tools) {
    const merged = [...this._tools, ...tools];
    const next = new FakeBuiltModel2();
    next.queue = this.queue;
    next._alwaysThrowError = this._alwaysThrowError;
    next._structuredResponseValue = this._structuredResponseValue;
    next._tools = merged;
    next._state = this._state;
    return next.withConfig({});
  }
  /**
  * Returns a {@link Runnable} that produces the {@link structuredResponse}
  * value. The schema argument is accepted for compatibility but ignored.
  * @param _params Schema or params (ignored).
  * @param _config Options (ignored).
  * @returns A Runnable that resolves to the structured response value.
  */
  withStructuredOutput(_params, _config) {
    const { _structuredResponseValue } = this;
    return RunnableLambda.from(async () => {
      return _structuredResponseValue;
    });
  }
  async _generate(messages, options, _runManager) {
    this._state.calls.push({
      messages: [...messages],
      options
    });
    const currentCallIndex = this._state.callIndex;
    this._state.callIndex += 1;
    if (this._alwaysThrowError) throw this._alwaysThrowError;
    const entry = this.queue[currentCallIndex];
    if (!entry) throw new Error(`FakeModel: no response queued for invocation ${currentCallIndex} (${this.queue.length} total queued).`);
    if (entry.kind === "error") throw entry.error;
    if (entry.kind === "factory") {
      const result = entry.factory(messages);
      if (!BaseMessage.isInstance(result)) throw result;
      return { generations: [{
        text: "",
        message: result
      }] };
    }
    if (entry.kind === "message") return { generations: [{
      text: "",
      message: entry.message
    }] };
    const content = deriveContent(messages);
    return {
      generations: [{
        text: content,
        message: new AIMessage({
          content,
          id: currentCallIndex.toString(),
          tool_calls: entry.toolCalls.length > 0 ? entry.toolCalls.map((tc) => ({
            ...tc,
            type: "tool_call"
          })) : void 0
        })
      }],
      llmOutput: {}
    };
  }
};
function fakeModel() {
  return new FakeBuiltModel();
}
function asAsyncIterable(items) {
  return { async *[Symbol.asyncIterator]() {
    for (const item of items) yield item;
  } };
}
function openAITextOnlyChunksWithUsage(model = "test-model") {
  const chunks = openAITextOnlyChunks(model);
  const last = chunks[chunks.length - 1];
  chunks[chunks.length - 1] = {
    ...last,
    usage: {
      prompt_tokens: 10,
      completion_tokens: 2,
      total_tokens: 12
    }
  };
  return chunks;
}
function openAITextOnlyChunks(model = "test-model") {
  return [
    {
      id: "chatcmpl-text",
      model,
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
      model,
      choices: [{
        index: 0,
        delta: { content: " world" },
        finish_reason: null
      }]
    },
    {
      id: "chatcmpl-text",
      model,
      choices: [{
        index: 0,
        delta: {},
        finish_reason: "stop"
      }]
    }
  ];
}
function openAIReasoningTextChunks(model = "test-model") {
  return [
    {
      id: "chatcmpl-reason",
      model,
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
      model,
      choices: [{
        index: 0,
        delta: { content: "Answer." },
        finish_reason: null
      }]
    },
    {
      id: "chatcmpl-reason",
      model,
      choices: [{
        index: 0,
        delta: {},
        finish_reason: "stop"
      }]
    }
  ];
}
function openAIToolCallChunks(model = "test-model") {
  return [
    {
      id: "chatcmpl-tools",
      model,
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
      model,
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
      model,
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
      model,
      choices: [{
        index: 0,
        delta: {},
        finish_reason: "tool_calls"
      }]
    }
  ];
}
function sseResponseFromOpenAIChunks(chunks) {
  const encoder = new TextEncoder();
  return new Response(new ReadableStream({ start(controller) {
    for (const chunk of chunks) controller.enqueue(encoder.encode(`data: ${JSON.stringify(chunk)}

`));
    controller.close();
  } }), {
    status: 200,
    headers: { "Content-Type": "text/event-stream" }
  });
}
var testing_exports$1 = /* @__PURE__ */ __exportAll({
  FakeBuiltModel: () => FakeBuiltModel,
  asAsyncIterable: () => asAsyncIterable,
  fakeModel: () => fakeModel,
  langchainMatchers: () => langchainMatchers,
  openAIReasoningTextChunks: () => openAIReasoningTextChunks,
  openAITextOnlyChunks: () => openAITextOnlyChunks,
  openAITextOnlyChunksWithUsage: () => openAITextOnlyChunksWithUsage,
  openAIToolCallChunks: () => openAIToolCallChunks,
  sseResponseFromOpenAIChunks: () => sseResponseFromOpenAIChunks,
  streamMatchers: () => streamMatchers,
  toBeAIMessage: () => toBeAIMessage,
  toBeHumanMessage: () => toBeHumanMessage,
  toBeSystemMessage: () => toBeSystemMessage,
  toBeToolMessage: () => toBeToolMessage,
  toContainToolCall: () => toContainToolCall,
  toHaveBeenInterrupted: () => toHaveBeenInterrupted,
  toHaveStructuredResponse: () => toHaveStructuredResponse,
  toHaveToolCallCount: () => toHaveToolCallCount,
  toHaveToolCalls: () => toHaveToolCalls,
  toHaveToolMessages: () => toHaveToolMessages
});
var run_collector_exports = /* @__PURE__ */ __exportAll({ RunCollectorCallbackHandler: () => RunCollectorCallbackHandler });
var RunCollectorCallbackHandler = class extends BaseTracer {
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
  constructor({ exampleId } = {}) {
    super({ _awaitHandler: true });
    this.exampleId = exampleId;
    this.tracedRuns = [];
  }
  /**
  * Persists the given run object.
  * @param run The run object to persist.
  */
  async persistRun(run) {
    const run_ = { ...run };
    run_.reference_example_id = this.exampleId;
    this.tracedRuns.push(run_);
  }
};
var stream_exports = /* @__PURE__ */ __exportAll({});
var context_exports = /* @__PURE__ */ __exportAll({ context: () => context });
function context(strings, ...values) {
  const raw = strings.raw;
  let result = "";
  for (let i = 0; i < raw.length; i++) {
    const next = raw[i].replace(/\\\n[ \t]*/g, "").replace(/\\`/g, "`").replace(/\\\$/g, "$").replace(/\\\{/g, "{");
    result += next;
    if (i < values.length) {
      const value = alignValue(values[i], result);
      result += typeof value === "string" ? value : JSON.stringify(value);
    }
  }
  result = stripIndent(result);
  result = result.trim();
  result = result.replace(/\\n/g, "\n");
  return result;
}
function alignValue(value, precedingText) {
  if (typeof value !== "string" || !value.includes("\n")) return value;
  const indentMatch = precedingText.slice(precedingText.lastIndexOf("\n") + 1).match(/^(\s+)/);
  if (indentMatch) {
    const indent = indentMatch[1];
    return value.replace(/\n/g, `
${indent}`);
  }
  return value;
}
function stripIndent(text) {
  const lines = text.split("\n");
  let minIndent = null;
  for (const line of lines) {
    const match = line.match(/^(\s+)\S+/);
    if (match) {
      const indent = match[1].length;
      if (minIndent === null) minIndent = indent;
      else minIndent = Math.min(minIndent, indent);
    }
  }
  if (minIndent === null) return text;
  return lines.map((line) => line[0] === " " || line[0] === "	" ? line.slice(minIndent) : line).join("\n");
}
var event_source_parse_exports = /* @__PURE__ */ __exportAll({
  EventStreamContentType: () => EventStreamContentType,
  convertEventStreamToIterableReadableDataStream: () => convertEventStreamToIterableReadableDataStream,
  getBytes: () => getBytes,
  getLines: () => getLines,
  getMessages: () => getMessages
});
const EventStreamContentType = "text/event-stream";
async function getBytes(stream, onChunk) {
  if (stream instanceof ReadableStream) {
    const reader = stream.getReader();
    while (true) {
      const result = await reader.read();
      if (result.done) {
        onChunk(new Uint8Array(), true);
        break;
      }
      onChunk(result.value);
    }
  } else try {
    for await (const chunk of stream) onChunk(new Uint8Array(chunk));
    onChunk(new Uint8Array(), true);
  } catch (e) {
    throw new Error([
      "Parsing event source stream failed.",
      "Ensure your implementation of fetch returns a web or Node readable stream.",
      `Error: ${e.message}`
    ].join("\n"));
  }
}
function getLines(onLine) {
  let buffer;
  let position;
  let fieldLength;
  let discardTrailingNewline = false;
  return function onChunk(arr2, flush) {
    if (flush) {
      onLine(arr2, 0, true);
      return;
    }
    if (buffer === void 0) {
      buffer = arr2;
      position = 0;
      fieldLength = -1;
    } else buffer = concat(buffer, arr2);
    const bufLength = buffer.length;
    let lineStart = 0;
    while (position < bufLength) {
      if (discardTrailingNewline) {
        if (buffer[position] === 10) lineStart = ++position;
        discardTrailingNewline = false;
      }
      let lineEnd = -1;
      for (; position < bufLength && lineEnd === -1; ++position) switch (buffer[position]) {
        case 58:
          if (fieldLength === -1) fieldLength = position - lineStart;
          break;
        case 13:
          discardTrailingNewline = true;
        case 10:
          lineEnd = position;
          break;
      }
      if (lineEnd === -1) break;
      onLine(buffer.subarray(lineStart, lineEnd), fieldLength);
      lineStart = position;
      fieldLength = -1;
    }
    if (lineStart === bufLength) buffer = void 0;
    else if (lineStart !== 0) {
      buffer = buffer.subarray(lineStart);
      position -= lineStart;
    }
  };
}
function getMessages(onMessage, onId, onRetry) {
  let message = newMessage();
  const decoder = new TextDecoder();
  return function onLine(line, fieldLength, flush) {
    if (flush) {
      if (!isEmpty(message)) {
        onMessage?.(message);
        message = newMessage();
      }
      return;
    }
    if (line.length === 0) {
      onMessage?.(message);
      message = newMessage();
    } else if (fieldLength > 0) {
      const field = decoder.decode(line.subarray(0, fieldLength));
      const valueOffset = fieldLength + (line[fieldLength + 1] === 32 ? 2 : 1);
      const value = decoder.decode(line.subarray(valueOffset));
      switch (field) {
        case "data":
          message.data = message.data ? message.data + "\n" + value : value;
          break;
        case "event":
          message.event = value;
          break;
        case "id":
          onId?.(message.id = value);
          break;
        case "retry": {
          const retry = parseInt(value, 10);
          if (!Number.isNaN(retry)) onRetry?.(message.retry = retry);
          break;
        }
      }
    }
  };
}
function concat(a, b) {
  const res = new Uint8Array(a.length + b.length);
  res.set(a);
  res.set(b, a.length);
  return res;
}
function newMessage() {
  return {
    data: "",
    event: "",
    id: "",
    retry: void 0
  };
}
function convertEventStreamToIterableReadableDataStream(stream, onMetadataEvent) {
  const dataStream = new ReadableStream({ async start(controller) {
    const enqueueLine = getMessages((msg) => {
      if (msg.event === "error") throw new Error(msg.data ?? "Unspecified event streaming error.");
      else if (msg.event === "metadata") onMetadataEvent?.(msg);
      else if (msg.data) controller.enqueue(msg.data);
    });
    const onLine = (line, fieldLength, flush) => {
      enqueueLine(line, fieldLength, flush);
      if (flush) controller.close();
    };
    await getBytes(stream, getLines(onLine));
  } });
  return IterableReadableStream.fromReadableStream(dataStream);
}
function isEmpty(message) {
  return message.data === "" && message.event === "" && message.id === "" && message.retry === void 0;
}
var format_exports = /* @__PURE__ */ __exportAll({});
function cosine(a, b) {
  let p = 0;
  let p2 = 0;
  let q2 = 0;
  for (let i = 0; i < a.length; i++) {
    p += a[i] * b[i];
    p2 += a[i] * a[i];
    q2 += b[i] * b[i];
  }
  return p / (Math.sqrt(p2) * Math.sqrt(q2));
}
function innerProduct$1(a, b) {
  let ans = 0;
  for (let i = 0; i < a.length; i++) ans += a[i] * b[i];
  return ans;
}
function squaredEuclidean(p, q) {
  let d = 0;
  for (let i = 0; i < p.length; i++) d += (p[i] - q[i]) * (p[i] - q[i]);
  return d;
}
function euclidean(p, q) {
  return Math.sqrt(squaredEuclidean(p, q));
}
var math_exports = /* @__PURE__ */ __exportAll({
  cosineSimilarity: () => cosineSimilarity,
  euclideanDistance: () => euclideanDistance,
  innerProduct: () => innerProduct,
  matrixFunc: () => matrixFunc,
  maximalMarginalRelevance: () => maximalMarginalRelevance,
  normalize: () => normalize
});
function matrixFunc(X, Y, func) {
  if (X.length === 0 || X[0].length === 0 || Y.length === 0 || Y[0].length === 0) return [[]];
  if (X[0].length !== Y[0].length) throw new Error(`Number of columns in X and Y must be the same. X has shape ${[X.length, X[0].length]} and Y has shape ${[Y.length, Y[0].length]}.`);
  return X.map((xVector) => Y.map((yVector) => func(xVector, yVector)).map((similarity) => Number.isNaN(similarity) ? 0 : similarity));
}
function normalize(M, similarity = false) {
  const max = matrixMaxVal(M);
  return M.map((row) => row.map((val) => similarity ? 1 - val / max : val / max));
}
function cosineSimilarity(X, Y) {
  return matrixFunc(X, Y, cosine);
}
function innerProduct(X, Y) {
  return matrixFunc(X, Y, innerProduct$1);
}
function euclideanDistance(X, Y) {
  return matrixFunc(X, Y, euclidean);
}
function maximalMarginalRelevance(queryEmbedding, embeddingList, lambda = 0.5, k = 4) {
  if (Math.min(k, embeddingList.length) <= 0) return [];
  const similarityToQuery = cosineSimilarity(Array.isArray(queryEmbedding[0]) ? queryEmbedding : [queryEmbedding], embeddingList)[0];
  const mostSimilarEmbeddingIndex = argMax(similarityToQuery).maxIndex;
  const selectedEmbeddings = [embeddingList[mostSimilarEmbeddingIndex]];
  const selectedEmbeddingsIndexes = [mostSimilarEmbeddingIndex];
  while (selectedEmbeddingsIndexes.length < Math.min(k, embeddingList.length)) {
    let bestScore = -Infinity;
    let bestIndex = -1;
    const similarityToSelected = cosineSimilarity(embeddingList, selectedEmbeddings);
    similarityToQuery.forEach((queryScore, queryScoreIndex) => {
      if (selectedEmbeddingsIndexes.includes(queryScoreIndex)) return;
      const maxSimilarityToSelected = Math.max(...similarityToSelected[queryScoreIndex]);
      const score = lambda * queryScore - (1 - lambda) * maxSimilarityToSelected;
      if (score > bestScore) {
        bestScore = score;
        bestIndex = queryScoreIndex;
      }
    });
    selectedEmbeddings.push(embeddingList[bestIndex]);
    selectedEmbeddingsIndexes.push(bestIndex);
  }
  return selectedEmbeddingsIndexes;
}
function argMax(array2) {
  if (array2.length === 0) return {
    maxIndex: -1,
    maxValue: NaN
  };
  let maxValue = array2[0];
  let maxIndex = 0;
  for (let i = 1; i < array2.length; i += 1) if (array2[i] > maxValue) {
    maxIndex = i;
    maxValue = array2[i];
  }
  return {
    maxIndex,
    maxValue
  };
}
function matrixMaxVal(arrays) {
  return arrays.reduce((acc, array2) => Math.max(acc, argMax(array2).maxValue), 0);
}
var ssrf_exports = /* @__PURE__ */ __exportAll({
  isCloudMetadata: () => isCloudMetadata,
  isLocalhost: () => isLocalhost,
  isPrivateIp: () => isPrivateIp,
  isSafeUrl: () => isSafeUrl,
  isSameOrigin: () => isSameOrigin,
  validateSafeUrl: () => validateSafeUrl
});
const PRIVATE_IP_RANGES = [
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
];
const CLOUD_METADATA_IPS = [
  "169.254.169.254",
  "169.254.170.2",
  "100.100.100.200"
];
const CLOUD_METADATA_HOSTNAMES = [
  "metadata.google.internal",
  "metadata",
  "instance-data"
];
const LOCALHOST_NAMES = ["localhost", "localhost.localdomain"];
const IPV4_REGEX = /^(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$/;
function isIPv4(ip) {
  return IPV4_REGEX.test(ip);
}
function isIPv6(ip) {
  return expandIpv6(ip) !== null;
}
function isIP(ip) {
  return isIPv4(ip) || isIPv6(ip);
}
function parseIp(ip) {
  if (isIPv4(ip)) return ip.split(".").map((octet) => parseInt(octet, 10));
  else if (isIPv6(ip)) {
    const expanded = expandIpv6(ip);
    if (!expanded) return null;
    const parts = expanded.split(":");
    const result = [];
    for (const part of parts) result.push(parseInt(part, 16));
    return result;
  }
  return null;
}
function expandIpv6(ip) {
  if (!ip || typeof ip !== "string") return null;
  if (!ip.includes(":")) return null;
  if (!/^[0-9a-fA-F:]+$/.test(ip)) return null;
  let normalized = ip;
  if (normalized.includes("::")) {
    const parts2 = normalized.split("::");
    if (parts2.length > 2) return null;
    const [left, right] = parts2;
    const leftParts = left ? left.split(":") : [];
    const rightParts = right ? right.split(":") : [];
    const missing = 8 - (leftParts.length + rightParts.length);
    if (missing < 0) return null;
    const zeros = Array(missing).fill("0");
    normalized = [
      ...leftParts,
      ...zeros,
      ...rightParts
    ].filter((p) => p !== "").join(":");
  }
  const parts = normalized.split(":");
  if (parts.length !== 8) return null;
  for (const part of parts) {
    if (part.length === 0 || part.length > 4) return null;
    if (!/^[0-9a-fA-F]+$/.test(part)) return null;
  }
  return parts.map((p) => p.padStart(4, "0").toLowerCase()).join(":");
}
function parseCidr(cidr) {
  const [addrStr, prefixStr] = cidr.split("/");
  if (!addrStr || !prefixStr) return null;
  const addr = parseIp(addrStr);
  if (!addr) return null;
  const prefixLen = parseInt(prefixStr, 10);
  if (isNaN(prefixLen)) return null;
  const isIpv6 = isIPv6(addrStr);
  if (isIpv6 && prefixLen > 128) return null;
  if (!isIpv6 && prefixLen > 32) return null;
  return {
    addr,
    prefixLen,
    isIpv6
  };
}
function isIpInCidr(ip, cidr) {
  const ipParsed = parseIp(ip);
  if (!ipParsed) return false;
  const cidrParsed = parseCidr(cidr);
  if (!cidrParsed) return false;
  const isIpv6 = isIPv6(ip);
  if (isIpv6 !== cidrParsed.isIpv6) return false;
  const { addr: cidrAddr, prefixLen } = cidrParsed;
  if (isIpv6) for (let i = 0; i < Math.ceil(prefixLen / 16); i++) {
    const mask = 65535 << 16 - Math.min(16, prefixLen - i * 16) & 65535;
    if ((ipParsed[i] & mask) !== (cidrAddr[i] & mask)) return false;
  }
  else for (let i = 0; i < Math.ceil(prefixLen / 8); i++) {
    const mask = 255 << 8 - Math.min(8, prefixLen - i * 8) & 255;
    if ((ipParsed[i] & mask) !== (cidrAddr[i] & mask)) return false;
  }
  return true;
}
function isPrivateIp(ip) {
  if (!isIP(ip)) return false;
  for (const range of PRIVATE_IP_RANGES) if (isIpInCidr(ip, range)) return true;
  return false;
}
function isCloudMetadata(hostname, ip) {
  if (CLOUD_METADATA_IPS.includes(ip || "")) return true;
  const lowerHostname = hostname.toLowerCase();
  if (CLOUD_METADATA_HOSTNAMES.includes(lowerHostname)) return true;
  return false;
}
function isLocalhost(hostname, ip) {
  if (ip) {
    if (ip === "127.0.0.1" || ip === "::1" || ip === "0.0.0.0") return true;
    if (ip.startsWith("127.")) return true;
  }
  const lowerHostname = hostname.toLowerCase();
  if (LOCALHOST_NAMES.includes(lowerHostname)) return true;
  return false;
}
function validateSafeUrl(url, options) {
  const allowPrivate = options?.allowPrivate ?? false;
  const allowHttp = options?.allowHttp ?? false;
  try {
    let parsedUrl;
    try {
      parsedUrl = new URL(url);
    } catch {
      throw new Error(`Invalid URL: ${url}`);
    }
    const hostname = parsedUrl.hostname;
    if (!hostname) throw new Error("URL missing hostname.");
    if (isCloudMetadata(hostname)) throw new Error(`URL points to cloud metadata endpoint: ${hostname}`);
    if (isLocalhost(hostname)) {
      if (!allowPrivate) throw new Error(`URL points to localhost: ${hostname}`);
      return url;
    }
    const scheme = parsedUrl.protocol;
    if (scheme !== "http:" && scheme !== "https:") throw new Error(`Invalid URL scheme: ${scheme}. Only http and https are allowed.`);
    if (scheme === "http:" && !allowHttp) throw new Error("HTTP scheme not allowed. Use HTTPS or set allowHttp: true.");
    if (isIP(hostname)) {
      const ip = hostname;
      if (isLocalhost(hostname, ip)) {
        if (!allowPrivate) throw new Error(`URL points to localhost: ${hostname}`);
        return url;
      }
      if (isCloudMetadata(hostname, ip)) throw new Error(`URL resolves to cloud metadata IP: ${ip} (${hostname})`);
      if (isPrivateIp(ip)) {
        if (!allowPrivate) throw new Error(`URL resolves to private IP: ${ip} (${hostname}). Set allowPrivate: true to allow.`);
      }
      return url;
    }
    return url;
  } catch (error) {
    if (error && typeof error === "object" && "message" in error) throw error;
    throw new Error(`URL validation failed: ${error}`);
  }
}
function isSafeUrl(url, options) {
  try {
    validateSafeUrl(url, options);
    return true;
  } catch {
    return false;
  }
}
function isSameOrigin(url1, url2) {
  try {
    return new URL(url1).origin === new URL(url2).origin;
  } catch {
    return false;
  }
}
var vectorstores_exports = /* @__PURE__ */ __exportAll({
  SaveableVectorStore: () => SaveableVectorStore,
  VectorStore: () => VectorStore,
  VectorStoreRetriever: () => VectorStoreRetriever
});
var VectorStoreRetriever = class extends BaseRetriever {
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
  constructor(fields) {
    super(fields);
    this.vectorStore = fields.vectorStore;
    this.k = fields.k ?? this.k;
    this.searchType = fields.searchType ?? this.searchType;
    this.filter = fields.filter;
    if (fields.searchType === "mmr") this.searchKwargs = fields.searchKwargs;
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
  async _getRelevantDocuments(query, runManager) {
    if (this.searchType === "mmr") {
      if (typeof this.vectorStore.maxMarginalRelevanceSearch !== "function") throw new Error(`The vector store backing this retriever, ${this._vectorstoreType()} does not support max marginal relevance search.`);
      return this.vectorStore.maxMarginalRelevanceSearch(query, {
        k: this.k,
        filter: this.filter,
        ...this.searchKwargs
      }, runManager?.getChild("vectorstore"));
    }
    return this.vectorStore.similaritySearch(query, this.k, this.filter, runManager?.getChild("vectorstore"));
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
  async addDocuments(documents, options) {
    return this.vectorStore.addDocuments(documents, options);
  }
};
var VectorStore = class extends Serializable {
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
  constructor(embeddings, dbConfig) {
    super(dbConfig);
    this.embeddings = embeddings;
  }
  /**
  * Deletes documents from the vector store based on the specified parameters.
  *
  * @param _params - Flexible key-value pairs defining conditions for document deletion.
  * @returns A promise that resolves once the deletion is complete.
  */
  async delete(_params) {
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
  async similaritySearch(query, k = 4, filter = void 0, _callbacks = void 0) {
    return (await this.similaritySearchVectorWithScore(await this.embeddings.embedQuery(query), k, filter)).map((result) => result[0]);
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
  async similaritySearchWithScore(query, k = 4, filter = void 0, _callbacks = void 0) {
    return this.similaritySearchVectorWithScore(await this.embeddings.embedQuery(query), k, filter);
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
  static fromTexts(_texts, _metadatas, _embeddings, _dbConfig) {
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
  static fromDocuments(_docs, _embeddings, _dbConfig) {
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
  asRetriever(kOrFields, filter, callbacks, tags, metadata, verbose) {
    if (typeof kOrFields === "number") return new VectorStoreRetriever({
      vectorStore: this,
      k: kOrFields,
      filter,
      tags: [...tags ?? [], this._vectorstoreType()],
      metadata,
      verbose,
      callbacks
    });
    else {
      const params = {
        vectorStore: this,
        k: kOrFields?.k,
        filter: kOrFields?.filter,
        tags: [...kOrFields?.tags ?? [], this._vectorstoreType()],
        metadata: kOrFields?.metadata,
        verbose: kOrFields?.verbose,
        callbacks: kOrFields?.callbacks,
        searchType: kOrFields?.searchType
      };
      if (kOrFields?.searchType === "mmr") return new VectorStoreRetriever({
        ...params,
        searchKwargs: kOrFields.searchKwargs
      });
      return new VectorStoreRetriever({ ...params });
    }
  }
};
var SaveableVectorStore = class extends VectorStore {
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
  static load(_directory, _embeddings) {
    throw new Error("Not implemented");
  }
};
var FakeChatModel = class extends BaseChatModel {
  _combineLLMOutput() {
    return [];
  }
  _llmType() {
    return "fake";
  }
  async _generate(messages, options, runManager) {
    if (options?.stop?.length) return { generations: [{
      message: new AIMessage(options.stop[0]),
      text: options.stop[0]
    }] };
    const text = messages.map((m) => {
      if (typeof m.content === "string") return m.content;
      return JSON.stringify(m.content, null, 2);
    }).join("\n");
    await runManager?.handleLLMNewToken(text);
    return {
      generations: [{
        message: new AIMessage(text),
        text
      }],
      llmOutput: {}
    };
  }
};
var FakeStreamingChatModel = class FakeStreamingChatModel2 extends BaseChatModel {
  sleep = 50;
  responses = [];
  chunks = [];
  toolStyle = "openai";
  thrownErrorString;
  tools = [];
  constructor({ sleep = 50, responses = [], chunks = [], toolStyle = "openai", thrownErrorString, ...rest }) {
    super(rest);
    this.sleep = sleep;
    this.responses = responses;
    this.chunks = chunks;
    this.toolStyle = toolStyle;
    this.thrownErrorString = thrownErrorString;
  }
  _llmType() {
    return "fake";
  }
  bindTools(tools) {
    const merged = [...this.tools, ...tools];
    const toolDicts = merged.map((t) => {
      switch (this.toolStyle) {
        case "openai":
          return {
            type: "function",
            function: {
              name: t.name,
              description: t.description,
              parameters: toJsonSchema(t.schema)
            }
          };
        case "anthropic":
          return {
            name: t.name,
            description: t.description,
            input_schema: toJsonSchema(t.schema)
          };
        case "bedrock":
          return { toolSpec: {
            name: t.name,
            description: t.description,
            inputSchema: toJsonSchema(t.schema)
          } };
        case "google":
          return {
            name: t.name,
            description: t.description,
            parameters: toJsonSchema(t.schema)
          };
        default:
          throw new Error(`Unsupported tool style: ${this.toolStyle}`);
      }
    });
    const wrapped = this.toolStyle === "google" ? [{ functionDeclarations: toolDicts }] : toolDicts;
    const next = new FakeStreamingChatModel2({
      sleep: this.sleep,
      responses: this.responses,
      chunks: this.chunks,
      toolStyle: this.toolStyle,
      thrownErrorString: this.thrownErrorString
    });
    next.tools = merged;
    return next.withConfig({ tools: wrapped });
  }
  async _generate(messages, _options, _runManager) {
    if (this.thrownErrorString) throw new Error(this.thrownErrorString);
    return { generations: [{
      text: "",
      message: new AIMessage({
        content: this.responses?.[0]?.content ?? messages[0].content ?? "",
        tool_calls: this.chunks?.[0]?.tool_calls
      })
    }] };
  }
  async *_streamResponseChunks(_messages, options, runManager) {
    if (this.thrownErrorString) throw new Error(this.thrownErrorString);
    if (this.chunks?.length) {
      for (const msgChunk of this.chunks) {
        const cg = new ChatGenerationChunk({
          message: new AIMessageChunk({
            content: msgChunk.content,
            tool_calls: msgChunk.tool_calls,
            additional_kwargs: msgChunk.additional_kwargs ?? {}
          }),
          text: msgChunk.content?.toString() ?? ""
        });
        if (options.signal?.aborted) break;
        yield cg;
        await runManager?.handleLLMNewToken(msgChunk.content, void 0, void 0, void 0, void 0, { chunk: cg });
      }
      return;
    }
    const fallback = this.responses?.[0] ?? new AIMessage(typeof _messages[0].content === "string" ? _messages[0].content : "");
    const text = typeof fallback.content === "string" ? fallback.content : "";
    for (const ch of text) {
      await new Promise((r) => setTimeout(r, this.sleep));
      const cg = new ChatGenerationChunk({
        message: new AIMessageChunk({ content: ch }),
        text: ch
      });
      if (options.signal?.aborted) break;
      yield cg;
      await runManager?.handleLLMNewToken(ch, void 0, void 0, void 0, void 0, { chunk: cg });
    }
  }
};
var FakeListChatModel = class FakeListChatModel2 extends BaseChatModel {
  static lc_name() {
    return "FakeListChatModel";
  }
  lc_serializable = true;
  responses;
  i = 0;
  sleep;
  emitCustomEvent = false;
  generationInfo;
  tools = [];
  toolStyle = "openai";
  constructor(params) {
    super(params);
    const { responses, sleep, emitCustomEvent, generationInfo } = params;
    this.responses = responses;
    this.sleep = sleep;
    this.emitCustomEvent = emitCustomEvent ?? this.emitCustomEvent;
    this.generationInfo = generationInfo;
  }
  _combineLLMOutput() {
    return [];
  }
  _llmType() {
    return "fake-list";
  }
  async _generate(_messages, options, runManager) {
    await this._sleepIfRequested();
    if (options?.thrownErrorString) throw new Error(options.thrownErrorString);
    if (this.emitCustomEvent) await runManager?.handleCustomEvent("some_test_event", { someval: true });
    if (options?.stop?.length) return { generations: [this._formatGeneration(options.stop[0])] };
    else {
      const response = this._currentResponse();
      this._incrementResponse();
      return {
        generations: [this._formatGeneration(response)],
        llmOutput: {}
      };
    }
  }
  _formatGeneration(text) {
    return {
      message: new AIMessage(text),
      text
    };
  }
  async *_streamResponseChunks(_messages, options, runManager) {
    const response = this._currentResponse();
    this._incrementResponse();
    if (this.emitCustomEvent) await runManager?.handleCustomEvent("some_test_event", { someval: true });
    const responseChars = [...response];
    for (let i = 0; i < responseChars.length; i++) {
      const text = responseChars[i];
      const isLastChunk = i === responseChars.length - 1;
      await this._sleepIfRequested();
      if (options?.thrownErrorString) throw new Error(options.thrownErrorString);
      const chunk = this._createResponseChunk(text, isLastChunk ? this.generationInfo : void 0);
      if (options.signal?.aborted) break;
      yield chunk;
      runManager?.handleLLMNewToken(text);
    }
  }
  async _sleepIfRequested() {
    if (this.sleep !== void 0) await this._sleep();
  }
  async _sleep() {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), this.sleep);
    });
  }
  _createResponseChunk(text, generationInfo) {
    return new ChatGenerationChunk({
      message: new AIMessageChunk({ content: text }),
      text,
      generationInfo
    });
  }
  _currentResponse() {
    return this.responses[this.i];
  }
  _incrementResponse() {
    if (this.i < this.responses.length - 1) this.i += 1;
    else this.i = 0;
  }
  bindTools(tools) {
    const merged = [...this.tools, ...tools];
    const toolDicts = merged.map((t) => {
      switch (this.toolStyle) {
        case "openai":
          return {
            type: "function",
            function: {
              name: t.name,
              description: t.description,
              parameters: toJsonSchema(t.schema)
            }
          };
        case "anthropic":
          return {
            name: t.name,
            description: t.description,
            input_schema: toJsonSchema(t.schema)
          };
        case "bedrock":
          return { toolSpec: {
            name: t.name,
            description: t.description,
            inputSchema: toJsonSchema(t.schema)
          } };
        case "google":
          return {
            name: t.name,
            description: t.description,
            parameters: toJsonSchema(t.schema)
          };
        default:
          throw new Error(`Unsupported tool style: ${this.toolStyle}`);
      }
    });
    const wrapped = this.toolStyle === "google" ? [{ functionDeclarations: toolDicts }] : toolDicts;
    const next = new FakeListChatModel2({
      responses: this.responses,
      sleep: this.sleep,
      emitCustomEvent: this.emitCustomEvent,
      generationInfo: this.generationInfo
    });
    next.tools = merged;
    next.toolStyle = this.toolStyle;
    next.i = this.i;
    return next.withConfig({ tools: wrapped });
  }
  withStructuredOutput(_params, _config) {
    return RunnableLambda.from(async (input) => {
      const message = await this.invoke(input);
      if (message.tool_calls?.[0]?.args) return message.tool_calls[0].args;
      if (typeof message.content === "string") return JSON.parse(message.content);
      throw new Error("No structured output found");
    });
  }
};
var SyntheticEmbeddings = class extends Embeddings {
  vectorSize;
  constructor(params) {
    super(params ?? {});
    this.vectorSize = params?.vectorSize ?? 4;
  }
  /**
  * Generates synthetic embeddings for a list of documents.
  * @param documents List of documents to generate embeddings for.
  * @returns A promise that resolves with a list of synthetic embeddings for each document.
  */
  async embedDocuments(documents) {
    return Promise.all(documents.map((doc) => this.embedQuery(doc)));
  }
  /**
  * Generates a synthetic embedding for a document. The document is
  * converted into chunks, a numerical value is calculated for each chunk,
  * and an array of these values is returned as the embedding.
  * @param document The document to generate an embedding for.
  * @returns A promise that resolves with a synthetic embedding for the document.
  */
  async embedQuery(document) {
    let doc = document;
    doc = doc.toLowerCase().replaceAll(/[^a-z ]/g, "");
    const padMod = doc.length % this.vectorSize;
    const padGapSize = padMod === 0 ? 0 : this.vectorSize - padMod;
    const padSize = doc.length + padGapSize;
    doc = doc.padEnd(padSize, " ");
    const chunkSize = doc.length / this.vectorSize;
    const docChunk = [];
    for (let co = 0; co < doc.length; co += chunkSize) docChunk.push(doc.slice(co, co + chunkSize));
    return docChunk.map((s) => {
      let sum = 0;
      for (let co = 0; co < s.length; co += 1) sum += s === " " ? 0 : s.charCodeAt(co);
      return sum % 26 / 26;
    });
  }
};
var FakeEmbeddings = class extends Embeddings {
  constructor(params) {
    super(params ?? {});
  }
  /**
  * Generates fixed embeddings for a list of documents.
  * @param documents List of documents to generate embeddings for.
  * @returns A promise that resolves with a list of fixed embeddings for each document.
  */
  embedDocuments(documents) {
    return Promise.resolve(documents.map(() => [
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
  embedQuery(_) {
    return Promise.resolve([
      0.1,
      0.2,
      0.3,
      0.4
    ]);
  }
};
var FakeLLM = class extends LLM {
  response;
  thrownErrorString;
  constructor(fields) {
    super(fields);
    this.response = fields.response;
    this.thrownErrorString = fields.thrownErrorString;
  }
  _llmType() {
    return "fake";
  }
  async _call(prompt, _options, runManager) {
    if (this.thrownErrorString) throw new Error(this.thrownErrorString);
    const response = this.response ?? prompt;
    await runManager?.handleLLMNewToken(response);
    return response;
  }
};
var FakeStreamingLLM = class extends LLM {
  sleep = 50;
  responses;
  thrownErrorString;
  constructor(fields) {
    super(fields);
    this.sleep = fields.sleep ?? this.sleep;
    this.responses = fields.responses;
    this.thrownErrorString = fields.thrownErrorString;
  }
  _llmType() {
    return "fake";
  }
  async _call(prompt) {
    if (this.thrownErrorString) throw new Error(this.thrownErrorString);
    const response = this.responses?.[0];
    this.responses = this.responses?.slice(1);
    return response ?? prompt;
  }
  async *_streamResponseChunks(input, _options, runManager) {
    if (this.thrownErrorString) throw new Error(this.thrownErrorString);
    const response = this.responses?.[0];
    this.responses = this.responses?.slice(1);
    for (const c of response ?? input) {
      await new Promise((resolve) => setTimeout(resolve, this.sleep));
      yield {
        text: c,
        generationInfo: {}
      };
      await runManager?.handleLLMNewToken(c);
    }
  }
};
var FakeChatMessageHistory = class extends BaseChatMessageHistory {
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
  async addMessage(message) {
    this.messages.push(message);
  }
  async addUserMessage(message) {
    this.messages.push(new HumanMessage(message));
  }
  async addAIMessage(message) {
    this.messages.push(new AIMessage(message));
  }
  async clear() {
    this.messages = [];
  }
};
var FakeListChatMessageHistory = class extends BaseListChatMessageHistory {
  lc_namespace = [
    "langchain_core",
    "message",
    "fake"
  ];
  messages = [];
  constructor() {
    super();
  }
  async addMessage(message) {
    this.messages.push(message);
  }
  async getMessages() {
    return this.messages;
  }
};
var FakeTracer = class extends BaseTracer {
  name = "fake_tracer";
  runs = [];
  constructor() {
    super();
  }
  persistRun(run) {
    this.runs.push(run);
    return Promise.resolve();
  }
};
var FakeSplitIntoListParser = class extends BaseOutputParser {
  lc_namespace = ["tests", "fake"];
  getFormatInstructions() {
    return "";
  }
  async parse(text) {
    return text.split(",").map((value) => value.trim());
  }
};
var FakeRetriever = class extends BaseRetriever {
  lc_namespace = ["test", "fake"];
  output = [new Document({ pageContent: "foo" }), new Document({ pageContent: "bar" })];
  constructor(fields) {
    super();
    this.output = fields?.output ?? this.output;
  }
  async _getRelevantDocuments(_query) {
    return this.output;
  }
};
var FakeRunnable = class extends Runnable {
  lc_namespace = ["tests", "fake"];
  returnOptions;
  constructor(fields) {
    super(fields);
    this.returnOptions = fields.returnOptions;
  }
  async invoke(input, options) {
    if (this.returnOptions) return options ?? {};
    return { input };
  }
};
var FakeTool = class extends StructuredTool {
  name;
  description;
  schema;
  constructor(fields) {
    super(fields);
    this.name = fields.name;
    this.description = fields.description;
    this.schema = fields.schema;
  }
  async _call(arg, _runManager) {
    return JSON.stringify(arg);
  }
};
var SingleRunExtractor = class extends BaseTracer {
  runPromiseResolver;
  runPromise;
  /** The name of the callback handler. */
  name = "single_run_extractor";
  constructor() {
    super();
    this.runPromise = new Promise((extract) => {
      this.runPromiseResolver = extract;
    });
  }
  async persistRun(run) {
    this.runPromiseResolver(run);
  }
  async extract() {
    return this.runPromise;
  }
};
var FakeVectorStore = class FakeVectorStore2 extends VectorStore {
  memoryVectors = [];
  similarity;
  _vectorstoreType() {
    return "memory";
  }
  constructor(embeddings, { similarity, ...rest } = {}) {
    super(embeddings, rest);
    this.similarity = similarity ?? cosine;
  }
  /**
  * Method to add documents to the memory vector store. It extracts the
  * text from each document, generates embeddings for them, and adds the
  * resulting vectors to the store.
  * @param documents Array of `Document` instances to be added to the store.
  * @returns Promise that resolves when all documents have been added.
  */
  async addDocuments(documents) {
    const texts = documents.map(({ pageContent }) => pageContent);
    return this.addVectors(await this.embeddings.embedDocuments(texts), documents);
  }
  /**
  * Method to add vectors to the memory vector store. It creates
  * `MemoryVector` instances for each vector and document pair and adds
  * them to the store.
  * @param vectors Array of vectors to be added to the store.
  * @param documents Array of `Document` instances corresponding to the vectors.
  * @returns Promise that resolves when all vectors have been added.
  */
  async addVectors(vectors, documents) {
    const memoryVectors = vectors.map((embedding, idx) => ({
      content: documents[idx].pageContent,
      embedding,
      metadata: documents[idx].metadata
    }));
    this.memoryVectors = this.memoryVectors.concat(memoryVectors);
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
  async similaritySearchVectorWithScore(query, k, filter) {
    const filterFunction = (memoryVector) => {
      if (!filter) return true;
      return filter(new Document({
        metadata: memoryVector.metadata,
        pageContent: memoryVector.content
      }));
    };
    const filteredMemoryVectors = this.memoryVectors.filter(filterFunction);
    return filteredMemoryVectors.map((vector, index2) => ({
      similarity: this.similarity(query, vector.embedding),
      index: index2
    })).sort((a, b) => a.similarity > b.similarity ? -1 : 0).slice(0, k).map((search) => [new Document({
      metadata: filteredMemoryVectors[search.index].metadata,
      pageContent: filteredMemoryVectors[search.index].content
    }), search.similarity]);
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
  static async fromTexts(texts, metadatas, embeddings, dbConfig) {
    const docs = [];
    for (let i = 0; i < texts.length; i += 1) {
      const metadata = Array.isArray(metadatas) ? metadatas[i] : metadatas;
      const newDoc = new Document({
        pageContent: texts[i],
        metadata
      });
      docs.push(newDoc);
    }
    return FakeVectorStore2.fromDocuments(docs, embeddings, dbConfig);
  }
  /**
  * Static method to create a `FakeVectorStore` instance from an array of
  * `Document` instances. It adds the documents to the store.
  * @param docs Array of `Document` instances to be added to the store.
  * @param embeddings `Embeddings` instance used to generate embeddings for the documents.
  * @param dbConfig Optional `FakeVectorStoreArgs` to configure the `FakeVectorStore` instance.
  * @returns Promise that resolves with a new `FakeVectorStore` instance.
  */
  static async fromDocuments(docs, embeddings, dbConfig) {
    const instance = new this(embeddings, dbConfig);
    await instance.addDocuments(docs);
    return instance;
  }
  /**
  * Static method to create a `FakeVectorStore` instance from an existing
  * index. It creates a new `FakeVectorStore` instance without adding any
  * documents or vectors.
  * @param embeddings `Embeddings` instance used to generate embeddings for the documents.
  * @param dbConfig Optional `FakeVectorStoreArgs` to configure the `FakeVectorStore` instance.
  * @returns Promise that resolves with a new `FakeVectorStore` instance.
  */
  static async fromExistingIndex(embeddings, dbConfig) {
    return new this(embeddings, dbConfig);
  }
};
var testing_exports = /* @__PURE__ */ __exportAll({
  FakeChatMessageHistory: () => FakeChatMessageHistory,
  FakeChatModel: () => FakeChatModel,
  FakeEmbeddings: () => FakeEmbeddings,
  FakeLLM: () => FakeLLM,
  FakeListChatMessageHistory: () => FakeListChatMessageHistory,
  FakeListChatModel: () => FakeListChatModel,
  FakeRetriever: () => FakeRetriever,
  FakeRunnable: () => FakeRunnable,
  FakeSplitIntoListParser: () => FakeSplitIntoListParser,
  FakeStreamingChatModel: () => FakeStreamingChatModel,
  FakeStreamingLLM: () => FakeStreamingLLM,
  FakeTool: () => FakeTool,
  FakeTracer: () => FakeTracer,
  FakeVectorStore: () => FakeVectorStore,
  SingleRunExtractor: () => SingleRunExtractor,
  SyntheticEmbeddings: () => SyntheticEmbeddings,
  asAsyncIterable: () => asAsyncIterable,
  openAIReasoningTextChunks: () => openAIReasoningTextChunks,
  openAITextOnlyChunks: () => openAITextOnlyChunks,
  openAITextOnlyChunksWithUsage: () => openAITextOnlyChunksWithUsage,
  openAIToolCallChunks: () => openAIToolCallChunks,
  sseResponseFromOpenAIChunks: () => sseResponseFromOpenAIChunks,
  streamMatchers: () => streamMatchers
});
var import_map_exports = /* @__PURE__ */ __exportAll({
  agents: () => agents_exports,
  caches: () => caches_exports,
  callbacks__base: () => base_exports$3,
  callbacks__manager: () => manager_exports,
  callbacks__promises: () => promises_exports,
  chat_history: () => chat_history_exports,
  document_loaders__base: () => base_exports,
  document_loaders__langsmith: () => langsmith_exports,
  documents: () => documents_exports,
  embeddings: () => embeddings_exports,
  errors: () => errors_exports,
  example_selectors: () => example_selectors_exports,
  index: () => src_exports,
  indexing: () => indexing_exports,
  language_models__base: () => base_exports$2,
  language_models__chat_models: () => chat_models_exports,
  language_models__compat: () => compat_exports,
  language_models__event: () => event_exports,
  language_models__llms: () => llms_exports,
  language_models__openai_completions_stream: () => openai_completions_stream_exports,
  language_models__profile: () => profile_exports,
  language_models__stream: () => stream_exports$2,
  language_models__structured_output: () => structured_output_exports,
  load__serializable: () => serializable_exports,
  memory: () => memory_exports,
  messages: () => messages_exports,
  messages__tool: () => tool_exports,
  output_parsers: () => output_parsers_exports,
  output_parsers__openai_functions: () => openai_functions_exports,
  output_parsers__openai_tools: () => openai_tools_exports,
  outputs: () => outputs_exports,
  prompt_values: () => prompt_values_exports,
  prompts: () => prompts_exports,
  retrievers: () => retrievers_exports,
  retrievers__document_compressors: () => document_compressors_exports,
  runnables: () => runnables_exports,
  runnables__graph: () => graph_exports,
  singletons: () => singletons_exports,
  stores: () => stores_exports,
  structured_query: () => structured_query_exports,
  testing: () => testing_exports$1,
  tools: () => tools_exports,
  tracers__base: () => base_exports$1,
  tracers__console: () => console_exports,
  tracers__log_stream: () => log_stream_exports,
  tracers__run_collector: () => run_collector_exports,
  tracers__tracer_langchain: () => tracer_langchain_exports,
  types__stream: () => stream_exports,
  utils__async_caller: () => async_caller_exports,
  utils__chunk_array: () => chunk_array_exports,
  utils__context: () => context_exports,
  utils__env: () => env_exports,
  utils__event_source_parse: () => event_source_parse_exports,
  utils__format: () => format_exports,
  utils__function_calling: () => function_calling_exports,
  utils__hash: () => hash_exports,
  utils__json_patch: () => json_patch_exports,
  utils__json_schema: () => json_schema_exports,
  utils__math: () => math_exports,
  utils__ssrf: () => ssrf_exports,
  utils__standard_schema: () => standard_schema_exports,
  utils__stream: () => stream_exports$1,
  utils__testing: () => testing_exports,
  utils__tiktoken: () => tiktoken_exports,
  utils__types: () => types_exports,
  utils__uuid: () => uuid_exports,
  vectorstores: () => vectorstores_exports
});
const DEFAULT_MAX_DEPTH = 50;
function combineAliasesAndInvert(constructor) {
  const aliases = {};
  for (let current = constructor; current && current.prototype; current = Object.getPrototypeOf(current)) Object.assign(aliases, Reflect.get(current.prototype, "lc_aliases"));
  return Object.entries(aliases).reduce((acc, [key, value]) => {
    acc[value] = key;
    return acc;
  }, {});
}
async function reviver(value) {
  const { optionalImportsMap, optionalImportEntrypoints: optionalImportEntrypoints$1, importMap, secretsMap, secretsFromEnv, path, depth, maxDepth } = this;
  const pathStr = path.join(".");
  if (depth > maxDepth) throw new Error(`Maximum recursion depth (${maxDepth}) exceeded during deserialization. This may indicate a malicious payload or you may need to increase maxDepth.`);
  if (typeof value !== "object" || value == null) return value;
  if (Array.isArray(value)) return Promise.all(value.map((v, i) => reviver.call({
    ...this,
    path: [...path, `${i}`],
    depth: depth + 1
  }, v)));
  const record = value;
  if (isEscapedObject(record)) return unescapeValue(record);
  if ("lc" in record && "type" in record && "id" in record && record.lc === 1 && record.type === "secret") {
    const [key] = record.id;
    if (key in secretsMap) return secretsMap[key];
    else if (secretsFromEnv) {
      const secretValueInEnv = getEnvironmentVariable(key);
      if (secretValueInEnv) return secretValueInEnv;
    }
    throw new Error(`Missing secret "${key}" at ${pathStr}`);
  }
  if ("lc" in record && "type" in record && "id" in record && record.lc === 1 && record.type === "not_implemented") {
    const str = JSON.stringify(record);
    throw new Error(`Trying to load an object that doesn't implement serialization: ${pathStr} -> ${str}`);
  }
  if ("lc" in record && "type" in record && "id" in record && "kwargs" in record && record.lc === 1 && record.type === "constructor") {
    const serialized = record;
    const str = JSON.stringify(serialized);
    const [name, ...namespaceReverse] = serialized.id.slice().reverse();
    const namespace = namespaceReverse.reverse();
    const importMaps = {
      langchain_core: import_map_exports,
      langchain: importMap
    };
    let module = null;
    const optionalImportNamespaceAliases = [namespace.join("/")];
    if (namespace[0] === "langchain_community") optionalImportNamespaceAliases.push(["langchain", ...namespace.slice(1)].join("/"));
    const matchingNamespaceAlias = optionalImportNamespaceAliases.find((alias) => alias in optionalImportsMap);
    if (optionalImportEntrypoints.concat(optionalImportEntrypoints$1).includes(namespace.join("/")) || matchingNamespaceAlias) if (matchingNamespaceAlias !== void 0) module = await optionalImportsMap[matchingNamespaceAlias];
    else throw new Error(`Missing key "${namespace.join("/")}" for ${pathStr} in load(optionalImportsMap={})`);
    else {
      let finalImportMap;
      if (namespace[0] === "langchain" || namespace[0] === "langchain_core") {
        finalImportMap = importMaps[namespace[0]];
        namespace.shift();
      } else throw new Error(`Invalid namespace: ${pathStr} -> ${str}`);
      if (namespace.length === 0) throw new Error(`Invalid namespace: ${pathStr} -> ${str}`);
      let importMapKey;
      do {
        importMapKey = namespace.join("__");
        if (importMapKey in finalImportMap) break;
        else namespace.pop();
      } while (namespace.length > 0);
      if (importMapKey in finalImportMap) module = finalImportMap[importMapKey];
    }
    if (typeof module !== "object" || module === null) throw new Error(`Invalid namespace: ${pathStr} -> ${str}`);
    const builder = module[name] ?? Object.values(module).find((v) => typeof v === "function" && get_lc_unique_name(v) === name);
    if (typeof builder !== "function") throw new Error(`Invalid identifer: ${pathStr} -> ${str}`);
    const instance = new builder(mapKeys(await reviver.call({
      ...this,
      path: [...path, "kwargs"],
      depth: depth + 1
    }, serialized.kwargs), keyFromJson, combineAliasesAndInvert(builder)));
    Object.defineProperty(instance.constructor, "name", { value: name });
    return instance;
  }
  const result = {};
  for (const [key, val] of Object.entries(record)) result[key] = await reviver.call({
    ...this,
    path: [...path, key],
    depth: depth + 1
  }, val);
  return result;
}
async function load(text, options) {
  const json = JSON.parse(text);
  const context2 = {
    optionalImportsMap: {},
    optionalImportEntrypoints: [],
    secretsMap: {},
    secretsFromEnv: false,
    importMap: {},
    path: ["$"],
    depth: 0,
    maxDepth: DEFAULT_MAX_DEPTH
  };
  return reviver.call(context2, json);
}
function isLangChainSerializedObject(value) {
  return value !== null && value.lc === 1 && value.type === "constructor" && Array.isArray(value.id);
}
async function _reviver(value) {
  if (value && typeof value === "object") if (Array.isArray(value)) return await Promise.all(value.map((item) => _reviver(item)));
  else {
    const revivedObj = {};
    for (const [k, v] of Object.entries(value)) revivedObj[k] = await _reviver(v);
    if (revivedObj.lc === 2 && revivedObj.type === "undefined") return;
    else if (revivedObj.lc === 2 && revivedObj.type === "delta_snapshot") return new DeltaSnapshot(revivedObj.value);
    else if (revivedObj.lc === 2 && revivedObj.type === "constructor" && Array.isArray(revivedObj.id)) try {
      const constructorName = revivedObj.id[revivedObj.id.length - 1];
      let constructor;
      switch (constructorName) {
        case "Set":
          constructor = Set;
          break;
        case "Map":
          constructor = Map;
          break;
        case "RegExp":
          constructor = RegExp;
          break;
        case "Error":
          constructor = Error;
          break;
        case "Uint8Array":
          constructor = Uint8Array;
          break;
        default:
          return revivedObj;
      }
      if (revivedObj.method) return constructor[revivedObj.method](...revivedObj.args || []);
      else return new constructor(...revivedObj.args || []);
    } catch {
      return revivedObj;
    }
    else if (isLangChainSerializedObject(revivedObj)) return load(JSON.stringify(revivedObj));
    return revivedObj;
  }
  return value;
}
function _encodeConstructorArgs(constructor, method, args, kwargs) {
  return {
    lc: 2,
    type: "constructor",
    id: [constructor.name],
    method: method ?? null,
    args: args ?? [],
    kwargs: kwargs ?? {}
  };
}
function _default(obj) {
  if (obj === void 0) return {
    lc: 2,
    type: "undefined"
  };
  else if (obj instanceof DeltaSnapshot) return {
    lc: 2,
    type: "delta_snapshot",
    value: obj.value
  };
  else if (obj instanceof Set || obj instanceof Map) return _encodeConstructorArgs(obj.constructor, void 0, [Array.from(obj)]);
  else if (obj instanceof RegExp) return _encodeConstructorArgs(RegExp, void 0, [obj.source, obj.flags]);
  else if (obj instanceof Error) return _encodeConstructorArgs(obj.constructor, void 0, [obj.message]);
  else if (obj?.lg_name === "Send") return {
    node: obj.node,
    args: obj.args,
    ...obj.timeout !== void 0 ? { timeout: obj.timeout } : {}
  };
  else if (obj instanceof Uint8Array) return _encodeConstructorArgs(Uint8Array, "from", [Array.from(obj)]);
  else return obj;
}
var JsonPlusSerializer = class {
  _dumps(obj) {
    return new TextEncoder().encode(stringify(obj, (_, value) => {
      return _default(value);
    }));
  }
  async dumpsTyped(obj) {
    if (obj instanceof Uint8Array) return ["bytes", obj];
    else return ["json", this._dumps(obj)];
  }
  async _loads(data) {
    return _reviver(JSON.parse(data));
  }
  async loadsTyped(type, data) {
    if (type === "bytes") return typeof data === "string" ? new TextEncoder().encode(data) : data;
    else if (type === "json") return this._loads(typeof data === "string" ? data : new TextDecoder().decode(data));
    else throw new Error(`Unknown serialization type: ${type}`);
  }
};
function deepCopy(obj) {
  if (typeof obj !== "object" || obj === null) return obj;
  const newObj = Array.isArray(obj) ? [] : {};
  for (const key in obj) if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = deepCopy(obj[key]);
  return newObj;
}
function emptyCheckpoint() {
  return {
    v: 4,
    id: uuid6(0),
    ts: (/* @__PURE__ */ new Date()).toISOString(),
    channel_values: {},
    channel_versions: {},
    versions_seen: {}
  };
}
function copyCheckpoint(checkpoint) {
  return {
    v: checkpoint.v,
    id: checkpoint.id,
    ts: checkpoint.ts,
    channel_values: { ...checkpoint.channel_values ?? {} },
    channel_versions: { ...checkpoint.channel_versions ?? {} },
    versions_seen: deepCopy(checkpoint.versions_seen ?? {})
  };
}
var BaseCheckpointSaver = class {
  serde = new JsonPlusSerializer();
  constructor(serde) {
    this.serde = serde || this.serde;
  }
  /**
  * Prevent `JSON.stringify` from traversing backend clients (e.g. pg Pool
  * timers) when a checkpointer is present in runnable `configurable`.
  */
  toJSON() {
    return `[${this.constructor.name}]`;
  }
  async get(config) {
    const value = await this.getTuple(config);
    return value ? value.checkpoint : void 0;
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
  async getDeltaChannelHistory(options) {
    const { config, channels } = options;
    if (channels.length === 0) return {};
    const collectedByCh = {};
    const seedByCh = {};
    const remaining = new Set(channels);
    for (const ch of channels) collectedByCh[ch] = [];
    let cursorConfig = (await this.getTuple(config))?.parentConfig;
    while (cursorConfig != null && remaining.size > 0) {
      const tup = await this.getTuple(cursorConfig);
      if (tup === void 0) break;
      if (tup.pendingWrites && tup.pendingWrites.length > 0) {
        const perChannel = {};
        for (const write of tup.pendingWrites) {
          const ch = write[1];
          if (remaining.has(ch)) (perChannel[ch] ??= []).push(write);
        }
        for (const ch of Object.keys(perChannel)) {
          const block = perChannel[ch];
          block.sort((a, b) => a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0);
          for (let i = block.length - 1; i >= 0; i -= 1) collectedByCh[ch].push(block[i]);
        }
      }
      for (const ch of Array.from(remaining)) if (Object.prototype.hasOwnProperty.call(tup.checkpoint.channel_values, ch)) {
        seedByCh[ch] = tup.checkpoint.channel_values[ch];
        remaining.delete(ch);
      }
      cursorConfig = tup.parentConfig;
    }
    const result = {};
    for (const ch of channels) {
      const entry = { writes: collectedByCh[ch].slice().reverse() };
      if (Object.prototype.hasOwnProperty.call(seedByCh, ch)) entry.seed = seedByCh[ch];
      result[ch] = entry;
    }
    return result;
  }
  /**
  * Generate the next version ID for a channel.
  *
  * Default is to use integer versions, incrementing by 1. If you override, you can use str/int/float versions,
  * as long as they are monotonically increasing.
  */
  getNextVersion(current) {
    if (typeof current === "string") throw new Error("Please override this method to use string versions.");
    return current !== void 0 && typeof current === "number" ? current + 1 : 1;
  }
};
function compareChannelVersions(a, b) {
  if (typeof a === "number" && typeof b === "number") return Math.sign(a - b);
  return String(a).localeCompare(String(b));
}
function maxChannelVersion(...versions) {
  return versions.reduce((max, version, idx) => {
    if (idx === 0) return version;
    return compareChannelVersions(max, version) >= 0 ? max : version;
  });
}
const WRITES_IDX_MAP = {
  [ERROR]: -1,
  [SCHEDULED]: -2,
  [INTERRUPT]: -3,
  [RESUME]: -4
};
const EXCLUDED_METADATA_KEYS = /* @__PURE__ */ new Set([
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
function getCheckpointId(config) {
  return config.configurable?.checkpoint_id || config.configurable?.thread_ts || "";
}
const POLLUTION_KEYS = /* @__PURE__ */ new Set([
  "__proto__",
  "constructor",
  "prototype"
]);
function assertSafeStorageKey(field, value, options = {}) {
  const { allowEmpty = false } = options;
  if (typeof value !== "string") {
    const observed = value === null ? "null" : value === void 0 ? "undefined" : Array.isArray(value) ? "array" : typeof value;
    throw new Error(`Invalid configurable value for key "${field}": expected a string identifier (got ${observed}). This guard protects MemorySaver from prototype pollution.`);
  }
  if (!allowEmpty && value === "") throw new Error(`Invalid configurable value for key "${field}": empty string is not permitted as an in-memory storage key.`);
  if (POLLUTION_KEYS.has(value)) throw new Error(`Invalid configurable value for key "${field}": value "${value}" is reserved (would mutate Object.prototype). This guard protects MemorySaver from prototype pollution.`);
}
function _generateKey(threadId, checkpointNamespace, checkpointId) {
  return JSON.stringify([
    threadId,
    checkpointNamespace,
    checkpointId
  ]);
}
function _parseKey(key) {
  const [threadId, checkpointNamespace, checkpointId] = JSON.parse(key);
  return {
    threadId,
    checkpointNamespace,
    checkpointId
  };
}
var MemorySaver = class extends BaseCheckpointSaver {
  storage = /* @__PURE__ */ Object.create(null);
  writes = /* @__PURE__ */ Object.create(null);
  constructor(serde) {
    super(serde);
  }
  /** @internal */
  async _migratePendingSends(mutableCheckpoint, threadId, checkpointNs, parentCheckpointId) {
    const deseriablizableCheckpoint = mutableCheckpoint;
    const parentKey = _generateKey(threadId, checkpointNs, parentCheckpointId);
    const pendingSends = await Promise.all(Object.values(this.writes[parentKey] ?? {}).filter(([_taskId, channel]) => channel === TASKS).map(async ([_taskId, _channel, writes]) => await this.serde.loadsTyped("json", writes)));
    deseriablizableCheckpoint.channel_values ??= {};
    deseriablizableCheckpoint.channel_values[TASKS] = pendingSends;
    deseriablizableCheckpoint.channel_versions ??= {};
    deseriablizableCheckpoint.channel_versions[TASKS] = Object.keys(deseriablizableCheckpoint.channel_versions).length > 0 ? maxChannelVersion(...Object.values(deseriablizableCheckpoint.channel_versions)) : this.getNextVersion(void 0);
  }
  async getTuple(config) {
    const thread_id = config.configurable?.thread_id;
    const checkpoint_ns = config.configurable?.checkpoint_ns ?? "";
    let checkpoint_id = getCheckpointId(config);
    if (thread_id !== void 0) assertSafeStorageKey("thread_id", thread_id);
    assertSafeStorageKey("checkpoint_ns", checkpoint_ns, { allowEmpty: true });
    if (checkpoint_id) assertSafeStorageKey("checkpoint_id", checkpoint_id);
    if (checkpoint_id) {
      const saved = this.storage[thread_id]?.[checkpoint_ns]?.[checkpoint_id];
      if (saved !== void 0) {
        const [checkpoint, metadata, parentCheckpointId] = saved;
        const key = _generateKey(thread_id, checkpoint_ns, checkpoint_id);
        const deserializedCheckpoint = await this.serde.loadsTyped("json", checkpoint);
        if (deserializedCheckpoint.v < 4 && parentCheckpointId !== void 0) await this._migratePendingSends(deserializedCheckpoint, thread_id, checkpoint_ns, parentCheckpointId);
        const pendingWrites = await Promise.all(Object.values(this.writes[key] || {}).map(async ([taskId, channel, value]) => {
          return [
            taskId,
            channel,
            await this.serde.loadsTyped("json", value)
          ];
        }));
        const checkpointTuple = {
          config,
          checkpoint: deserializedCheckpoint,
          metadata: await this.serde.loadsTyped("json", metadata),
          pendingWrites
        };
        if (parentCheckpointId !== void 0) checkpointTuple.parentConfig = { configurable: {
          thread_id,
          checkpoint_ns,
          checkpoint_id: parentCheckpointId
        } };
        return checkpointTuple;
      }
    } else {
      const checkpoints = this.storage[thread_id]?.[checkpoint_ns];
      if (checkpoints !== void 0) {
        checkpoint_id = Object.keys(checkpoints).sort((a, b) => b.localeCompare(a))[0];
        const [checkpoint, metadata, parentCheckpointId] = checkpoints[checkpoint_id];
        const key = _generateKey(thread_id, checkpoint_ns, checkpoint_id);
        const deserializedCheckpoint = await this.serde.loadsTyped("json", checkpoint);
        if (deserializedCheckpoint.v < 4 && parentCheckpointId !== void 0) await this._migratePendingSends(deserializedCheckpoint, thread_id, checkpoint_ns, parentCheckpointId);
        const pendingWrites = await Promise.all(Object.values(this.writes[key] || {}).map(async ([taskId, channel, value]) => {
          return [
            taskId,
            channel,
            await this.serde.loadsTyped("json", value)
          ];
        }));
        const checkpointTuple = {
          config: { configurable: {
            thread_id,
            checkpoint_id,
            checkpoint_ns
          } },
          checkpoint: deserializedCheckpoint,
          metadata: await this.serde.loadsTyped("json", metadata),
          pendingWrites
        };
        if (parentCheckpointId !== void 0) checkpointTuple.parentConfig = { configurable: {
          thread_id,
          checkpoint_ns,
          checkpoint_id: parentCheckpointId
        } };
        return checkpointTuple;
      }
    }
  }
  async *list(config, options) {
    let { before, limit, filter } = options ?? {};
    if (config.configurable?.thread_id !== void 0) assertSafeStorageKey("thread_id", config.configurable.thread_id);
    if (config.configurable?.checkpoint_ns !== void 0) assertSafeStorageKey("checkpoint_ns", config.configurable.checkpoint_ns, { allowEmpty: true });
    if (config.configurable?.checkpoint_id) assertSafeStorageKey("checkpoint_id", config.configurable.checkpoint_id);
    if (before?.configurable?.checkpoint_id) assertSafeStorageKey("checkpoint_id", before.configurable.checkpoint_id);
    const threadIds = config.configurable?.thread_id ? [config.configurable?.thread_id] : Object.keys(this.storage);
    const configCheckpointNamespace = config.configurable?.checkpoint_ns;
    const configCheckpointId = config.configurable?.checkpoint_id;
    for (const threadId of threadIds) for (const checkpointNamespace of Object.keys(this.storage[threadId] ?? {})) {
      if (configCheckpointNamespace !== void 0 && checkpointNamespace !== configCheckpointNamespace) continue;
      const checkpoints = this.storage[threadId]?.[checkpointNamespace] ?? {};
      const sortedCheckpoints = Object.entries(checkpoints).sort((a, b) => b[0].localeCompare(a[0]));
      for (const [checkpointId, [checkpoint, metadataStr, parentCheckpointId]] of sortedCheckpoints) {
        if (configCheckpointId && checkpointId !== configCheckpointId) continue;
        if (before && before.configurable?.checkpoint_id && checkpointId >= before.configurable.checkpoint_id) continue;
        const metadata = await this.serde.loadsTyped("json", metadataStr);
        if (filter && !Object.entries(filter).every(([key2, value]) => metadata[key2] === value)) continue;
        if (limit !== void 0) {
          if (limit <= 0) break;
          limit -= 1;
        }
        const key = _generateKey(threadId, checkpointNamespace, checkpointId);
        const writes = Object.values(this.writes[key] || {});
        const pendingWrites = await Promise.all(writes.map(async ([taskId, channel, value]) => {
          return [
            taskId,
            channel,
            await this.serde.loadsTyped("json", value)
          ];
        }));
        const deserializedCheckpoint = await this.serde.loadsTyped("json", checkpoint);
        if (deserializedCheckpoint.v < 4 && parentCheckpointId !== void 0) await this._migratePendingSends(deserializedCheckpoint, threadId, checkpointNamespace, parentCheckpointId);
        const checkpointTuple = {
          config: { configurable: {
            thread_id: threadId,
            checkpoint_ns: checkpointNamespace,
            checkpoint_id: checkpointId
          } },
          checkpoint: deserializedCheckpoint,
          metadata,
          pendingWrites
        };
        if (parentCheckpointId !== void 0) checkpointTuple.parentConfig = { configurable: {
          thread_id: threadId,
          checkpoint_ns: checkpointNamespace,
          checkpoint_id: parentCheckpointId
        } };
        yield checkpointTuple;
      }
    }
  }
  async put(config, checkpoint, metadata) {
    const preparedCheckpoint = copyCheckpoint(checkpoint);
    const threadId = config.configurable?.thread_id;
    const checkpointNamespace = config.configurable?.checkpoint_ns ?? "";
    if (threadId === void 0) throw new Error('Failed to put checkpoint. The passed RunnableConfig is missing a required "thread_id" field in its "configurable" property. When using a checkpointer, you must pass a "thread_id" so the checkpointer knows which conversation thread to persist state for. Example: graph.stream(input, { configurable: { thread_id: "my-thread-id" } })');
    assertSafeStorageKey("thread_id", threadId);
    assertSafeStorageKey("checkpoint_ns", checkpointNamespace, { allowEmpty: true });
    assertSafeStorageKey("checkpoint_id", checkpoint.id);
    if (!this.storage[threadId]) this.storage[threadId] = /* @__PURE__ */ Object.create(null);
    if (!this.storage[threadId][checkpointNamespace]) this.storage[threadId][checkpointNamespace] = /* @__PURE__ */ Object.create(null);
    const [[, serializedCheckpoint], [, serializedMetadata]] = await Promise.all([this.serde.dumpsTyped(preparedCheckpoint), this.serde.dumpsTyped(metadata)]);
    this.storage[threadId][checkpointNamespace][checkpoint.id] = [
      serializedCheckpoint,
      serializedMetadata,
      config.configurable?.checkpoint_id
    ];
    return { configurable: {
      thread_id: threadId,
      checkpoint_ns: checkpointNamespace,
      checkpoint_id: checkpoint.id
    } };
  }
  async putWrites(config, writes, taskId) {
    const threadId = config.configurable?.thread_id;
    const checkpointNamespace = config.configurable?.checkpoint_ns;
    const checkpointId = config.configurable?.checkpoint_id;
    if (threadId === void 0) throw new Error('Failed to put writes. The passed RunnableConfig is missing a required "thread_id" field in its "configurable" property. When using a checkpointer, you must pass a "thread_id" so the checkpointer knows which conversation thread to persist state for. Example: graph.stream(input, { configurable: { thread_id: "my-thread-id" } })');
    if (checkpointId === void 0) throw new Error(`Failed to put writes. The passed RunnableConfig is missing a required "checkpoint_id" field in its "configurable" property.`);
    assertSafeStorageKey("thread_id", threadId);
    assertSafeStorageKey("checkpoint_ns", checkpointNamespace, { allowEmpty: true });
    assertSafeStorageKey("checkpoint_id", checkpointId);
    assertSafeStorageKey("task_id", taskId);
    const outerKey = _generateKey(threadId, checkpointNamespace, checkpointId);
    const outerWrites_ = this.writes[outerKey];
    if (this.writes[outerKey] === void 0) this.writes[outerKey] = /* @__PURE__ */ Object.create(null);
    await Promise.all(writes.map(async ([channel, value], idx) => {
      const [, serializedValue] = await this.serde.dumpsTyped(value);
      const innerKey = [taskId, WRITES_IDX_MAP[channel] || idx];
      const innerKeyStr = `${innerKey[0]},${innerKey[1]}`;
      if (innerKey[1] >= 0 && outerWrites_ && innerKeyStr in outerWrites_) return;
      this.writes[outerKey][innerKeyStr] = [
        taskId,
        channel,
        serializedValue
      ];
    }));
  }
  async deleteThread(threadId) {
    assertSafeStorageKey("thread_id", threadId);
    delete this.storage[threadId];
    for (const key of Object.keys(this.writes)) if (_parseKey(key).threadId === threadId) delete this.writes[key];
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
  async getDeltaChannelHistory(options) {
    const { config, channels } = options;
    if (channels.length === 0) return {};
    const threadId = config.configurable?.thread_id;
    const checkpointNs = config.configurable?.checkpoint_ns ?? "";
    const checkpointId = getCheckpointId(config);
    if (threadId !== void 0) assertSafeStorageKey("thread_id", threadId);
    assertSafeStorageKey("checkpoint_ns", checkpointNs, { allowEmpty: true });
    const nsStorage = this.storage[threadId]?.[checkpointNs] ?? {};
    const chain = [];
    let current = (checkpointId ? nsStorage[checkpointId] : void 0)?.[2];
    while (current !== void 0) {
      const entry = nsStorage[current];
      if (entry === void 0) break;
      chain.push(current);
      current = entry[2];
    }
    const collectedByCh = {};
    const seedByCh = {};
    const remaining = new Set(channels);
    for (const ch of channels) collectedByCh[ch] = [];
    for (const cpId of chain) {
      if (remaining.size === 0) break;
      const entry = nsStorage[cpId];
      const ckpt = entry !== void 0 ? await this.serde.loadsTyped("json", entry[0]) : void 0;
      const blobValueByCh = {};
      const terminatedHere = /* @__PURE__ */ new Set();
      if (ckpt !== void 0) {
        for (const ch of remaining) if (Object.prototype.hasOwnProperty.call(ckpt.channel_values, ch) && ckpt.channel_values[ch] !== void 0) {
          blobValueByCh[ch] = ckpt.channel_values[ch];
          terminatedHere.add(ch);
        }
      }
      const stepWritesKey = _generateKey(threadId, checkpointNs, cpId);
      const stepWrites = Object.entries(this.writes[stepWritesKey] ?? {});
      stepWrites.sort(([a], [b]) => {
        const [aTask, aIdx] = a.split(",");
        const [bTask, bIdx] = b.split(",");
        if (aTask !== bTask) return aTask < bTask ? 1 : -1;
        return Number(bIdx) - Number(aIdx);
      });
      for (const [, [tid, ch, serialized]] of stepWrites) {
        if (!remaining.has(ch)) continue;
        collectedByCh[ch].push([
          tid,
          ch,
          await this.serde.loadsTyped("json", serialized)
        ]);
      }
      for (const ch of terminatedHere) {
        seedByCh[ch] = blobValueByCh[ch];
        remaining.delete(ch);
      }
    }
    const result = {};
    for (const ch of channels) {
      const entryH = { writes: collectedByCh[ch].slice().reverse() };
      if (Object.prototype.hasOwnProperty.call(seedByCh, ch)) entryH.seed = seedByCh[ch];
      result[ch] = entryH;
    }
    return result;
  }
};
var InvalidNamespaceError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "InvalidNamespaceError";
  }
};
function validateNamespace(namespace) {
  if (namespace.length === 0) throw new InvalidNamespaceError("Namespace cannot be empty.");
  for (const label of namespace) {
    if (typeof label !== "string") throw new InvalidNamespaceError(`Invalid namespace label '${label}' found in ${namespace}. Namespace labels must be strings, but got ${typeof label}.`);
    if (label.includes(".")) throw new InvalidNamespaceError(`Invalid namespace label '${label}' found in ${namespace}. Namespace labels cannot contain periods ('.').`);
    if (label === "") throw new InvalidNamespaceError(`Namespace labels cannot be empty strings. Got ${label} in ${namespace}`);
  }
  if (namespace[0] === "langgraph") throw new InvalidNamespaceError(`Root label for namespace cannot be "langgraph". Got: ${namespace}`);
}
var BaseStore2 = class {
  /**
  * Retrieve a single item by its namespace and key.
  *
  * @param namespace Hierarchical path for the item
  * @param key Unique identifier within the namespace
  * @returns Promise resolving to the item or null if not found
  */
  async get(namespace, key) {
    return (await this.batch([{
      namespace,
      key
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
  async search(namespacePrefix, options = {}) {
    const { filter, limit = 10, offset = 0, query } = options;
    return (await this.batch([{
      namespacePrefix,
      filter,
      limit,
      offset,
      query
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
  async put(namespace, key, value, index2) {
    validateNamespace(namespace);
    await this.batch([{
      namespace,
      key,
      value,
      index: index2
    }]);
  }
  /**
  * Delete an item from the store.
  *
  * @param namespace Hierarchical path for the item
  * @param key Unique identifier within the namespace
  */
  async delete(namespace, key) {
    await this.batch([{
      namespace,
      key,
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
  async listNamespaces(options = {}) {
    const { prefix, suffix, maxDepth, limit = 100, offset = 0 } = options;
    const matchConditions = [];
    if (prefix) matchConditions.push({
      matchType: "prefix",
      path: prefix
    });
    if (suffix) matchConditions.push({
      matchType: "suffix",
      path: suffix
    });
    return (await this.batch([{
      matchConditions: matchConditions.length ? matchConditions : void 0,
      maxDepth,
      limit,
      offset
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
const extractStore = (input) => {
  if ("lg_name" in input && input.lg_name === "AsyncBatchedStore") return input.store;
  return input;
};
var AsyncBatchedStore = class extends BaseStore2 {
  lg_name = "AsyncBatchedStore";
  store;
  queue = /* @__PURE__ */ new Map();
  nextKey = 0;
  running = false;
  processingTask = null;
  constructor(store) {
    super();
    this.store = extractStore(store);
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
  async batch(_operations) {
    throw new Error("The `batch` method is not implemented on `AsyncBatchedStore`.\n Instead, it calls the `batch` method on the wrapped store.\n If you are seeing this error, something is wrong.");
  }
  async get(namespace, key) {
    return this.enqueueOperation({
      namespace,
      key
    });
  }
  async search(namespacePrefix, options) {
    const { filter, limit = 10, offset = 0, query } = options || {};
    return this.enqueueOperation({
      namespacePrefix,
      filter,
      limit,
      offset,
      query
    });
  }
  async put(namespace, key, value) {
    return this.enqueueOperation({
      namespace,
      key,
      value
    });
  }
  async delete(namespace, key) {
    return this.enqueueOperation({
      namespace,
      key,
      value: null
    });
  }
  start() {
    if (!this.running) {
      this.running = true;
      this.processingTask = this.processBatchQueue();
    }
  }
  async stop() {
    this.running = false;
    if (this.processingTask) await this.processingTask;
  }
  enqueueOperation(operation) {
    return new Promise((resolve, reject) => {
      const key = this.nextKey;
      this.nextKey += 1;
      this.queue.set(key, {
        operation,
        resolve,
        reject
      });
    });
  }
  async processBatchQueue() {
    while (this.running) {
      await new Promise((resolve) => {
        setTimeout(resolve, 0);
      });
      if (this.queue.size === 0) continue;
      const batch = new Map(this.queue);
      this.queue.clear();
      try {
        const operations = Array.from(batch.values()).map(({ operation }) => operation);
        const results = await this.store.batch(operations);
        batch.forEach(({ resolve }, key) => {
          resolve(results[Array.from(batch.keys()).indexOf(key)]);
        });
      } catch (e) {
        batch.forEach(({ reject }) => {
          reject(e);
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
function tokenizePath(path) {
  if (!path) return [];
  const tokens = [];
  let current = [];
  let i = 0;
  while (i < path.length) {
    const char = path[i];
    if (char === "[") {
      if (current.length) {
        tokens.push(current.join(""));
        current = [];
      }
      let bracketCount = 1;
      const indexChars = ["["];
      i += 1;
      while (i < path.length && bracketCount > 0) {
        if (path[i] === "[") bracketCount += 1;
        else if (path[i] === "]") bracketCount -= 1;
        indexChars.push(path[i]);
        i += 1;
      }
      tokens.push(indexChars.join(""));
      continue;
    } else if (char === "{") {
      if (current.length) {
        tokens.push(current.join(""));
        current = [];
      }
      let braceCount = 1;
      const fieldChars = ["{"];
      i += 1;
      while (i < path.length && braceCount > 0) {
        if (path[i] === "{") braceCount += 1;
        else if (path[i] === "}") braceCount -= 1;
        fieldChars.push(path[i]);
        i += 1;
      }
      tokens.push(fieldChars.join(""));
      continue;
    } else if (char === ".") {
      if (current.length) {
        tokens.push(current.join(""));
        current = [];
      }
    } else current.push(char);
    i += 1;
  }
  if (current.length) tokens.push(current.join(""));
  return tokens;
}
function isFilterOperators(obj) {
  return typeof obj === "object" && obj !== null && Object.keys(obj).every((key) => key === "$eq" || key === "$ne" || key === "$gt" || key === "$gte" || key === "$lt" || key === "$lte" || key === "$in" || key === "$nin");
}
function compareValues(itemValue, filterValue) {
  if (isFilterOperators(filterValue)) return Object.keys(filterValue).filter((k) => k.startsWith("$")).every((op) => {
    const value = filterValue[op];
    switch (op) {
      case "$eq":
        return itemValue === value;
      case "$ne":
        return itemValue !== value;
      case "$gt":
        return Number(itemValue) > Number(value);
      case "$gte":
        return Number(itemValue) >= Number(value);
      case "$lt":
        return Number(itemValue) < Number(value);
      case "$lte":
        return Number(itemValue) <= Number(value);
      case "$in":
        return Array.isArray(value) ? value.includes(itemValue) : false;
      case "$nin":
        return Array.isArray(value) ? !value.includes(itemValue) : true;
      default:
        return false;
    }
  });
  return itemValue === filterValue;
}
function getTextAtPath(obj, path) {
  if (!path || path === "$") return [JSON.stringify(obj, null, 2)];
  const tokens = Array.isArray(path) ? path : tokenizePath(path);
  function extractFromObj(obj2, tokens2, pos) {
    if (pos >= tokens2.length) {
      if (typeof obj2 === "string" || typeof obj2 === "number" || typeof obj2 === "boolean") return [String(obj2)];
      if (obj2 === null || obj2 === void 0) return [];
      if (Array.isArray(obj2) || typeof obj2 === "object") return [JSON.stringify(obj2, null, 2)];
      return [];
    }
    const token = tokens2[pos];
    const results = [];
    if (pos === 0 && token === "$") results.push(JSON.stringify(obj2, null, 2));
    if (token.startsWith("[") && token.endsWith("]")) {
      if (!Array.isArray(obj2)) return [];
      const index2 = token.slice(1, -1);
      if (index2 === "*") for (const item of obj2) results.push(...extractFromObj(item, tokens2, pos + 1));
      else try {
        let idx = parseInt(index2, 10);
        if (idx < 0) idx = obj2.length + idx;
        if (idx >= 0 && idx < obj2.length) results.push(...extractFromObj(obj2[idx], tokens2, pos + 1));
      } catch {
        return [];
      }
    } else if (token.startsWith("{") && token.endsWith("}")) {
      if (typeof obj2 !== "object" || obj2 === null) return [];
      const fields = token.slice(1, -1).split(",").map((f) => f.trim());
      for (const field of fields) {
        const nestedTokens = tokenizePath(field);
        if (nestedTokens.length) {
          let currentObj = obj2;
          for (const nestedToken of nestedTokens) if (currentObj && typeof currentObj === "object" && nestedToken in currentObj) currentObj = currentObj[nestedToken];
          else {
            currentObj = void 0;
            break;
          }
          if (currentObj !== void 0) {
            if (typeof currentObj === "string" || typeof currentObj === "number" || typeof currentObj === "boolean") results.push(String(currentObj));
            else if (Array.isArray(currentObj) || typeof currentObj === "object") results.push(JSON.stringify(currentObj, null, 2));
          }
        }
      }
    } else if (token === "*") {
      if (Array.isArray(obj2)) for (const item of obj2) results.push(...extractFromObj(item, tokens2, pos + 1));
      else if (typeof obj2 === "object" && obj2 !== null) for (const value of Object.values(obj2)) results.push(...extractFromObj(value, tokens2, pos + 1));
    } else if (typeof obj2 === "object" && obj2 !== null && token in obj2) results.push(...extractFromObj(obj2[token], tokens2, pos + 1));
    return results;
  }
  return extractFromObj(obj, tokens, 0);
}
var InMemoryStore2 = class extends BaseStore2 {
  data = /* @__PURE__ */ new Map();
  vectors = /* @__PURE__ */ new Map();
  _indexConfig;
  constructor(options) {
    super();
    if (options?.index) this._indexConfig = {
      ...options.index,
      __tokenizedFields: (options.index.fields ?? ["$"]).map((p) => [p, p === "$" ? [p] : tokenizePath(p)])
    };
  }
  async batch(operations) {
    const results = [];
    const putOps = /* @__PURE__ */ new Map();
    const searchOps = /* @__PURE__ */ new Map();
    for (let i = 0; i < operations.length; i += 1) {
      const op = operations[i];
      if ("key" in op && "namespace" in op && !("value" in op)) results.push(this.getOperation(op));
      else if ("namespacePrefix" in op) {
        const candidates = this.filterItems(op);
        searchOps.set(i, [op, candidates]);
        results.push(null);
      } else if ("value" in op) {
        const key = `${op.namespace.join(":")}:${op.key}`;
        putOps.set(key, op);
        results.push(null);
      } else if ("matchConditions" in op) results.push(this.listNamespacesOperation(op));
    }
    if (searchOps.size > 0) if (this._indexConfig?.embeddings) {
      const queries = /* @__PURE__ */ new Set();
      for (const [op] of searchOps.values()) if (op.query) queries.add(op.query);
      const queryEmbeddings = queries.size > 0 ? await Promise.all(Array.from(queries).map((q) => this._indexConfig.embeddings.embedQuery(q))) : [];
      const queryVectors = Object.fromEntries(Array.from(queries).map((q, i) => [q, queryEmbeddings[i]]));
      for (const [i, [op, candidates]] of searchOps.entries()) if (op.query && queryVectors[op.query]) {
        const queryVector = queryVectors[op.query];
        results[i] = this.scoreResults(candidates, queryVector, op.offset ?? 0, op.limit ?? 10);
      } else results[i] = this.paginateResults(candidates.map((item) => ({
        ...item,
        score: void 0
      })), op.offset ?? 0, op.limit ?? 10);
    } else for (const [i, [op, candidates]] of searchOps.entries()) results[i] = this.paginateResults(candidates.map((item) => ({
      ...item,
      score: void 0
    })), op.offset ?? 0, op.limit ?? 10);
    if (putOps.size > 0 && this._indexConfig?.embeddings) {
      const toEmbed = this.extractTexts(Array.from(putOps.values()));
      if (Object.keys(toEmbed).length > 0) {
        const embeddings = await this._indexConfig.embeddings.embedDocuments(Object.keys(toEmbed));
        this.insertVectors(toEmbed, embeddings);
      }
    }
    for (const op of putOps.values()) this.putOperation(op);
    return results;
  }
  getOperation(op) {
    const namespaceKey = op.namespace.join(":");
    return this.data.get(namespaceKey)?.get(op.key) ?? null;
  }
  putOperation(op) {
    const namespaceKey = op.namespace.join(":");
    if (!this.data.has(namespaceKey)) this.data.set(namespaceKey, /* @__PURE__ */ new Map());
    const namespaceMap = this.data.get(namespaceKey);
    if (op.value === null) namespaceMap.delete(op.key);
    else {
      const now = /* @__PURE__ */ new Date();
      if (namespaceMap.has(op.key)) {
        const item = namespaceMap.get(op.key);
        item.value = op.value;
        item.updatedAt = now;
      } else namespaceMap.set(op.key, {
        value: op.value,
        key: op.key,
        namespace: op.namespace,
        createdAt: now,
        updatedAt: now
      });
    }
  }
  listNamespacesOperation(op) {
    let namespaces = Array.from(this.data.keys()).map((ns) => ns.split(":"));
    if (op.matchConditions && op.matchConditions.length > 0) namespaces = namespaces.filter((ns) => op.matchConditions.every((condition) => this.doesMatch(condition, ns)));
    if (op.maxDepth !== void 0) namespaces = Array.from(new Set(namespaces.map((ns) => ns.slice(0, op.maxDepth).join(":")))).map((ns) => ns.split(":"));
    namespaces.sort((a, b) => a.join(":").localeCompare(b.join(":")));
    return namespaces.slice(op.offset ?? 0, (op.offset ?? 0) + (op.limit ?? namespaces.length));
  }
  doesMatch(matchCondition, key) {
    const { matchType, path } = matchCondition;
    if (matchType === "prefix") {
      if (path.length > key.length) return false;
      return path.every((pElem, index2) => {
        const kElem = key[index2];
        return pElem === "*" || kElem === pElem;
      });
    } else if (matchType === "suffix") {
      if (path.length > key.length) return false;
      return path.every((pElem, index2) => {
        const kElem = key[key.length - path.length + index2];
        return pElem === "*" || kElem === pElem;
      });
    }
    throw new Error(`Unsupported match type: ${matchType}`);
  }
  filterItems(op) {
    const candidates = [];
    for (const [namespace, items] of this.data.entries()) if (namespace.startsWith(op.namespacePrefix.join(":"))) candidates.push(...items.values());
    let filteredCandidates = candidates;
    if (op.filter) filteredCandidates = candidates.filter((item) => Object.entries(op.filter).every(([key, value]) => compareValues(item.value[key], value)));
    return filteredCandidates;
  }
  scoreResults(candidates, queryVector, offset = 0, limit = 10) {
    const flatItems = [];
    const flatVectors = [];
    const scoreless = [];
    for (const item of candidates) {
      const vectors = this.getVectors(item);
      if (vectors.length) for (const vector of vectors) {
        flatItems.push(item);
        flatVectors.push(vector);
      }
      else scoreless.push(item);
    }
    const sortedResults = this.cosineSimilarity(queryVector, flatVectors).map((score, i) => [score, flatItems[i]]).sort((a, b) => b[0] - a[0]);
    const seen = /* @__PURE__ */ new Set();
    const kept = [];
    for (const [score, item] of sortedResults) {
      const key = `${item.namespace.join(":")}:${item.key}`;
      if (seen.has(key)) continue;
      const ix = seen.size;
      if (ix >= offset + limit) break;
      if (ix < offset) {
        seen.add(key);
        continue;
      }
      seen.add(key);
      kept.push([score, item]);
    }
    if (scoreless.length && kept.length < limit) for (const item of scoreless.slice(0, limit - kept.length)) {
      const key = `${item.namespace.join(":")}:${item.key}`;
      if (!seen.has(key)) {
        seen.add(key);
        kept.push([void 0, item]);
      }
    }
    return kept.map(([score, item]) => ({
      ...item,
      score
    }));
  }
  paginateResults(results, offset, limit) {
    return results.slice(offset, offset + limit);
  }
  extractTexts(ops) {
    if (!ops.length || !this._indexConfig) return {};
    const toEmbed = {};
    for (const op of ops) if (op.value !== null && op.index !== false) {
      const paths = op.index === null || op.index === void 0 ? this._indexConfig.__tokenizedFields ?? [] : op.index.map((ix) => [ix, tokenizePath(ix)]);
      for (const [path, field] of paths) {
        const texts = getTextAtPath(op.value, field);
        if (texts.length) if (texts.length > 1) texts.forEach((text, i) => {
          if (!toEmbed[text]) toEmbed[text] = [];
          toEmbed[text].push([
            op.namespace,
            op.key,
            `${path}.${i}`
          ]);
        });
        else {
          if (!toEmbed[texts[0]]) toEmbed[texts[0]] = [];
          toEmbed[texts[0]].push([
            op.namespace,
            op.key,
            path
          ]);
        }
      }
    }
    return toEmbed;
  }
  insertVectors(texts, embeddings) {
    for (const [text, metadata] of Object.entries(texts)) {
      const embedding = embeddings.shift();
      if (!embedding) throw new Error(`No embedding found for text: ${text}`);
      for (const [namespace, key, field] of metadata) {
        const namespaceKey = namespace.join(":");
        if (!this.vectors.has(namespaceKey)) this.vectors.set(namespaceKey, /* @__PURE__ */ new Map());
        const namespaceMap = this.vectors.get(namespaceKey);
        if (!namespaceMap.has(key)) namespaceMap.set(key, /* @__PURE__ */ new Map());
        namespaceMap.get(key).set(field, embedding);
      }
    }
  }
  getVectors(item) {
    const namespaceKey = item.namespace.join(":");
    const itemKey = item.key;
    if (!this.vectors.has(namespaceKey)) return [];
    const namespaceMap = this.vectors.get(namespaceKey);
    if (!namespaceMap.has(itemKey)) return [];
    const itemMap = namespaceMap.get(itemKey);
    const vectors = Array.from(itemMap.values());
    if (!vectors.length) return [];
    return vectors;
  }
  cosineSimilarity(X, Y) {
    if (!Y.length) return [];
    const dotProducts = Y.map((vector) => vector.reduce((acc, val, i) => acc + val * X[i], 0));
    const magnitude1 = Math.sqrt(X.reduce((acc, val) => acc + val * val, 0));
    const magnitudes2 = Y.map((vector) => Math.sqrt(vector.reduce((acc, val) => acc + val * val, 0)));
    return dotProducts.map((dot, i) => {
      const magnitude2 = magnitudes2[i];
      return magnitude1 && magnitude2 ? dot / (magnitude1 * magnitude2) : 0;
    });
  }
  get indexConfig() {
    return this._indexConfig;
  }
};
var BaseCache = class {
  serde = new JsonPlusSerializer();
  /**
  * Initialize the cache with a serializer.
  *
  * @param serde - The serializer to use.
  */
  constructor(serde) {
    this.serde = serde || this.serde;
  }
};
const STRUCTURED_UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function isDeltaChannel$1(channel) {
  return channel != null && channel.lc_graph_name === "DeltaChannel";
}
function isBaseChannel(obj) {
  return obj != null && obj.lg_is_channel === true;
}
var BaseChannel = class {
  ValueType;
  UpdateType;
  /** @ignore */
  lg_is_channel = true;
  /**
  * Mark the current value of the channel as consumed. By default, no-op.
  * A channel can use this method to modify its state, preventing the value
  * from being consumed again.
  *
  * Returns True if the channel was updated, False otherwise.
  */
  consume() {
    return false;
  }
  /**
  * Notify the channel that the Pregel run is finishing. By default, no-op.
  * A channel can use this method to modify its state, preventing finish.
  *
  * Returns True if the channel was updated, False otherwise.
  */
  finish() {
    return false;
  }
  /**
  * Return True if the channel is available (not empty), False otherwise.
  * Subclasses should override this method to provide a more efficient
  * implementation than calling get() and catching EmptyChannelError.
  */
  isAvailable() {
    try {
      this.get();
      return true;
    } catch (error) {
      if (error.name === EmptyChannelError.unminifiable_name) return false;
      throw error;
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
  equals(other) {
    return this === other;
  }
};
const IS_ONLY_BASE_CHANNEL = /* @__PURE__ */ Symbol.for("LG_IS_ONLY_BASE_CHANNEL");
function getOnlyChannels(channels) {
  if (channels[IS_ONLY_BASE_CHANNEL] === true) return channels;
  const newChannels = {};
  for (const k in channels) {
    if (!Object.prototype.hasOwnProperty.call(channels, k)) continue;
    const value = channels[k];
    if (isBaseChannel(value)) newChannels[k] = value;
  }
  Object.assign(newChannels, { [IS_ONLY_BASE_CHANNEL]: true });
  return newChannels;
}
function emptyChannels(channels, checkpoint) {
  const filteredChannels = getOnlyChannels(channels);
  const newChannels = {};
  for (const k in filteredChannels) {
    if (!Object.prototype.hasOwnProperty.call(filteredChannels, k)) continue;
    const channelValue = checkpoint.channel_values[k];
    newChannels[k] = filteredChannels[k].fromCheckpoint(channelValue);
  }
  Object.assign(newChannels, { [IS_ONLY_BASE_CHANNEL]: true });
  return newChannels;
}
function exitDeltaTaskId(step, taskId) {
  if (!STRUCTURED_UUID.test(taskId)) throw new TypeError(`Invalid task id for exit delta: ${taskId}`);
  const parts = taskId.toLowerCase().split("-");
  return `${String(step).padStart(8, "0")}-${parts[1]}-${parts[2]}-${parts[3]}-${parts[4]}`;
}
function deltaChannelsToSnapshot(channels, countersSinceDeltaSnapshot) {
  const result = /* @__PURE__ */ new Set();
  const maxSupersteps = getDeltaMaxSuperstepsSinceSnapshot();
  for (const name in channels) {
    if (!Object.prototype.hasOwnProperty.call(channels, name)) continue;
    const ch = channels[name];
    if (!isDeltaChannel$1(ch) || !ch.isAvailable()) continue;
    const [updates, supersteps] = countersSinceDeltaSnapshot[name] ?? [0, 0];
    if (updates >= ch.snapshotFrequency || supersteps >= maxSupersteps) result.add(name);
  }
  return result;
}
function createCheckpoint(checkpoint, channels, step, options) {
  const channelsToSnapshot = options?.channelsToSnapshot ?? /* @__PURE__ */ new Set();
  const { updatedChannels, getNextVersion } = options ?? {};
  let values;
  let channelVersions = checkpoint.channel_versions;
  if (channels === void 0) values = checkpoint.channel_values;
  else {
    values = {};
    channelVersions = { ...checkpoint.channel_versions };
    for (const k in channels) {
      if (!Object.prototype.hasOwnProperty.call(channels, k)) continue;
      const channel = channels[k];
      if (channelsToSnapshot.has(k)) {
        if (getNextVersion !== void 0 && (updatedChannels === void 0 || !updatedChannels.has(k))) channelVersions[k] = getNextVersion(channelVersions[k]);
        values[k] = new DeltaSnapshot(channel.get());
        continue;
      }
      if (isDeltaChannel$1(channel)) continue;
      try {
        values[k] = channel.checkpoint();
      } catch (error) {
        if (error.name === EmptyChannelError.unminifiable_name) ;
        else throw error;
      }
    }
  }
  return {
    v: 4,
    id: options?.id ?? uuid6(step),
    ts: (/* @__PURE__ */ new Date()).toISOString(),
    channel_values: values,
    channel_versions: channelVersions,
    versions_seen: checkpoint.versions_seen
  };
}
async function channelsFromCheckpoint(specs, checkpoint, options) {
  const channels = emptyChannels(specs, checkpoint);
  const { saver, config } = options ?? {};
  const filteredSpecs = getOnlyChannels(specs);
  const deltaKeys = [];
  for (const k in filteredSpecs) {
    if (!Object.prototype.hasOwnProperty.call(filteredSpecs, k)) continue;
    if (isDeltaChannel$1(filteredSpecs[k]) && !Object.prototype.hasOwnProperty.call(checkpoint.channel_values, k)) deltaKeys.push(k);
  }
  if (deltaKeys.length === 0 || saver === void 0 || config === void 0) return channels;
  const histories = await saver.getDeltaChannelHistory({
    config,
    channels: deltaKeys
  });
  for (const k of deltaKeys) {
    const history = histories[k];
    if (history === void 0) continue;
    const replayCh = filteredSpecs[k].fromCheckpoint(history.seed);
    replayCh.replayWrites(history.writes);
    channels[k] = replayCh;
  }
  return channels;
}
const isBinaryOperatorAggregate = (value) => {
  return value != null && value.lc_graph_name === "BinaryOperatorAggregate";
};
var BinaryOperatorAggregate = class BinaryOperatorAggregate2 extends BaseChannel {
  lc_graph_name = "BinaryOperatorAggregate";
  value;
  operator;
  initialValueFactory;
  constructor(operator, initialValueFactory) {
    super();
    this.operator = operator;
    this.initialValueFactory = initialValueFactory;
    this.value = initialValueFactory?.();
  }
  fromCheckpoint(checkpoint) {
    const empty = new BinaryOperatorAggregate2(this.operator, this.initialValueFactory);
    if (typeof checkpoint !== "undefined") empty.value = checkpoint;
    return empty;
  }
  update(values) {
    let newValues = values;
    if (!newValues.length) return false;
    if (this.value === void 0) {
      const first = newValues[0];
      const [isOverwrite, overwriteVal] = _getOverwriteValue(first);
      if (isOverwrite) this.value = overwriteVal;
      else this.value = first;
      newValues = newValues.slice(1);
    }
    let seenOverwrite = false;
    for (const incoming of newValues) if (_isOverwriteValue(incoming)) {
      if (seenOverwrite) throw new InvalidUpdateError("Can receive only one Overwrite value per step.");
      const [, val] = _getOverwriteValue(incoming);
      this.value = val;
      seenOverwrite = true;
      continue;
    } else if (!seenOverwrite && this.value !== void 0) this.value = this.operator(this.value, incoming);
    return true;
  }
  get() {
    if (this.value === void 0) throw new EmptyChannelError();
    return this.value;
  }
  checkpoint() {
    if (this.value === void 0) throw new EmptyChannelError();
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
  equals(other) {
    if (this === other) return true;
    if (!isBinaryOperatorAggregate(other)) return false;
    return this.operator === other.operator;
  }
};
var LastValue = class LastValue2 extends BaseChannel {
  lc_graph_name = "LastValue";
  value = [];
  constructor(initialValueFactory) {
    super();
    this.initialValueFactory = initialValueFactory;
    if (initialValueFactory) this.value = [initialValueFactory()];
  }
  fromCheckpoint(checkpoint) {
    const empty = new LastValue2(this.initialValueFactory);
    if (typeof checkpoint !== "undefined") empty.value = [checkpoint];
    return empty;
  }
  update(values) {
    if (values.length === 0) return false;
    if (values.length !== 1) throw new InvalidUpdateError("LastValue can only receive one value per step.", { lc_error_code: "INVALID_CONCURRENT_GRAPH_UPDATE" });
    this.value = [values[values.length - 1]];
    return true;
  }
  get() {
    if (this.value.length === 0) throw new EmptyChannelError();
    return this.value[0];
  }
  checkpoint() {
    if (this.value.length === 0) throw new EmptyChannelError();
    return this.value[0];
  }
  isAvailable() {
    return this.value.length !== 0;
  }
};
var LastValueAfterFinish = class LastValueAfterFinish2 extends BaseChannel {
  lc_graph_name = "LastValueAfterFinish";
  value = [];
  finished = false;
  fromCheckpoint(checkpoint) {
    const empty = new LastValueAfterFinish2();
    if (typeof checkpoint !== "undefined") {
      const [value, finished] = checkpoint;
      empty.value = [value];
      empty.finished = finished;
    }
    return empty;
  }
  update(values) {
    if (values.length === 0) return false;
    this.finished = false;
    this.value = [values[values.length - 1]];
    return true;
  }
  get() {
    if (this.value.length === 0 || !this.finished) throw new EmptyChannelError();
    return this.value[0];
  }
  checkpoint() {
    if (this.value.length === 0) return void 0;
    return [this.value[0], this.finished];
  }
  consume() {
    if (this.finished) {
      this.finished = false;
      this.value = [];
      return true;
    }
    return false;
  }
  finish() {
    if (!this.finished && this.value.length > 0) {
      this.finished = true;
      return true;
    }
    return false;
  }
  isAvailable() {
    return this.value.length !== 0 && this.finished;
  }
};
var AnnotationRoot = class {
  lc_graph_name = "AnnotationRoot";
  spec;
  constructor(s) {
    this.spec = s;
  }
  static isInstance(value) {
    return typeof value === "object" && value !== null && "lc_graph_name" in value && value.lc_graph_name === "AnnotationRoot";
  }
};
const Annotation = function(annotation) {
  if (annotation) return getChannel(annotation);
  else return new LastValue();
};
Annotation.Root = (sd) => new AnnotationRoot(sd);
function getChannel(reducer) {
  if (typeof reducer === "object" && reducer && "reducer" in reducer && reducer.reducer) return new BinaryOperatorAggregate(reducer.reducer, reducer.default);
  if (typeof reducer === "object" && reducer && "value" in reducer && reducer.value) return new BinaryOperatorAggregate(reducer.value, reducer.default);
  return new LastValue();
}
const COPIABLE_KEYS = [
  "tags",
  "metadata",
  "callbacks",
  "configurable"
];
const CONFIG_KEYS = [
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
];
const DEFAULT_RECURSION_LIMIT = 25;
const PROPAGATE_TO_METADATA = /* @__PURE__ */ new Set([
  "thread_id",
  "checkpoint_id",
  "checkpoint_ns",
  "task_id",
  "run_id",
  "assistant_id",
  "graph_id"
]);
function propagateConfigurableToMetadata(configurable, metadata) {
  if (!configurable) return metadata;
  const result = metadata ?? {};
  for (const key of PROPAGATE_TO_METADATA) {
    if (key in result) continue;
    const value = configurable[key];
    if (value !== void 0) result[key] = value;
  }
  return result;
}
function filterToUserTags(tags) {
  if (tags == null || tags.length === 0) return void 0;
  const filtered = tags.filter((tag) => !tag.startsWith("seq:step"));
  return filtered.length > 0 ? filtered : void 0;
}
function mergeCallbacks(base, provided) {
  if (provided === void 0) return base;
  if (base === void 0) return Array.isArray(provided) ? [...provided] : provided.copy();
  if (Array.isArray(provided)) {
    if (Array.isArray(base)) return base.concat(provided);
    const manager = base.copy();
    for (const callback of provided) manager.addHandler(ensureHandler(callback), true);
    return manager;
  }
  if (Array.isArray(base)) {
    const manager = provided.copy();
    for (const callback of base) manager.addHandler(ensureHandler(callback), true);
    return manager;
  }
  return new CallbackManager(provided._parentRunId, {
    handlers: base.handlers.concat(provided.handlers),
    inheritableHandlers: base.inheritableHandlers.concat(provided.inheritableHandlers),
    tags: Array.from(new Set(base.tags.concat(provided.tags))),
    inheritableTags: Array.from(new Set(base.inheritableTags.concat(provided.inheritableTags))),
    metadata: {
      ...base.metadata,
      ...provided.metadata
    },
    inheritableMetadata: {
      ...base.inheritableMetadata,
      ...provided.inheritableMetadata
    }
  });
}
function isRootLevelExplicitInvoke(configs) {
  let invokeConfig;
  for (let i = configs.length - 1; i >= 0; i -= 1) if (configs[i] !== void 0) {
    invokeConfig = configs[i];
    break;
  }
  const hasInvokeTimeThreadId = invokeConfig?.configurable?.thread_id !== void 0;
  const hasExplicitNesting = configs.some((c) => c?.configurable?.[CONFIG_KEY_READ] !== void 0);
  const hasAmbientNesting = AsyncLocalStorageProviderSingleton.getRunnableConfig()?.configurable?.[CONFIG_KEY_READ] !== void 0;
  return hasInvokeTimeThreadId && !hasExplicitNesting && !hasAmbientNesting;
}
function ensureLangGraphConfig(...configs) {
  const empty = {
    tags: [],
    metadata: {},
    callbacks: void 0,
    recursionLimit: DEFAULT_RECURSION_LIMIT,
    configurable: {}
  };
  const skipImplicitConfigurable = isRootLevelExplicitInvoke(configs);
  const implicitConfig = AsyncLocalStorageProviderSingleton.getRunnableConfig();
  if (implicitConfig !== void 0) {
    for (const [k, v] of Object.entries(implicitConfig)) if (v !== void 0) {
      if (k === "configurable" && skipImplicitConfigurable) continue;
      if (COPIABLE_KEYS.includes(k)) {
        let copiedValue;
        if (Array.isArray(v)) copiedValue = [...v];
        else if (typeof v === "object") if (k === "callbacks" && "copy" in v && typeof v.copy === "function") copiedValue = v.copy();
        else copiedValue = { ...v };
        else copiedValue = v;
        empty[k] = copiedValue;
      } else empty[k] = v;
    }
  }
  for (const config of configs) {
    if (config === void 0) continue;
    for (const [k, v] of Object.entries(config)) {
      if (v === void 0 || !CONFIG_KEYS.includes(k)) continue;
      if (k === "configurable") empty.configurable = {
        ...empty.configurable,
        ...v
      };
      else if (k === "metadata") empty.metadata = {
        ...empty.metadata,
        ...v
      };
      else if (k === "tags") empty.tags = [...empty.tags ?? [], ...v];
      else if (k === "callbacks") empty.callbacks = mergeCallbacks(empty.callbacks, v);
      else empty[k] = v;
    }
  }
  empty.metadata = propagateConfigurableToMetadata(empty.configurable, empty.metadata) ?? {};
  return empty;
}
function getStore(config) {
  const runConfig = config ?? AsyncLocalStorageProviderSingleton.getRunnableConfig();
  if (runConfig === void 0) throw new Error(["Config not retrievable. This is likely because you are running in an environment without support for AsyncLocalStorage.", "If you're running `getStore` in such environment, pass the `config` from the node function directly."].join("\n"));
  return runConfig?.store;
}
function getWriter(config) {
  const runConfig = config ?? AsyncLocalStorageProviderSingleton.getRunnableConfig();
  if (runConfig === void 0) throw new Error(["Config not retrievable. This is likely because you are running in an environment without support for AsyncLocalStorage.", "If you're running `getWriter` in such environment, pass the `config` from the node function directly."].join("\n"));
  return runConfig?.writer || runConfig?.configurable?.writer;
}
function getConfig() {
  return AsyncLocalStorageProviderSingleton.getRunnableConfig();
}
function getCurrentTaskInput(config) {
  const runConfig = config ?? AsyncLocalStorageProviderSingleton.getRunnableConfig();
  if (runConfig === void 0) throw new Error(["Config not retrievable. This is likely because you are running in an environment without support for AsyncLocalStorage.", "If you're running `getCurrentTaskInput` in such environment, pass the `config` from the node function directly."].join("\n"));
  if (runConfig.configurable?.["__pregel_scratchpad"]?.currentTaskInput === void 0) throw new Error("BUG: internal scratchpad not initialized.");
  return runConfig.configurable[CONFIG_KEY_SCRATCHPAD].currentTaskInput;
}
function recastCheckpointNamespace(namespace) {
  return namespace.split("|").filter((part) => !part.match(/^\d+$/)).map((part) => part.split(":")[0]).join("|");
}
function getParentCheckpointNamespace(namespace) {
  const parts = namespace.split("|");
  while (parts.length > 1 && parts[parts.length - 1].match(/^\d+$/)) parts.pop();
  return parts.slice(0, -1).join("|");
}
var RunControl = class {
  #drainReason = void 0;
  /**
  * Request that the current run drain cooperatively, stopping at the next
  * superstep boundary. Does not cancel work that is already running.
  *
  * @param reason - A short description of why the drain was requested.
  *   Surfaced on the resulting {@link GraphDrained} error.
  */
  requestDrain(reason = "shutdown") {
    this.#drainReason = reason;
  }
  /** Whether a drain has been requested for this run. */
  get drainRequested() {
    return this.#drainReason !== void 0;
  }
  /** The reason passed to {@link RunControl#requestDrain}, if any. */
  get drainReason() {
    return this.#drainReason;
  }
};
const STREAM_EVENTS_V3_MODES = [
  "values",
  "updates",
  "messages",
  "tools",
  "custom",
  "tasks"
];
function isCheckpointEnvelope(payload) {
  if (payload == null || typeof payload !== "object") return false;
  const p = payload;
  return typeof p.id === "string" && ("source" in p || typeof p.step === "number") && !("values" in p) && !("config" in p);
}
function unwrapMessagesPayload(payload) {
  if (!Array.isArray(payload) || payload.length !== 2) return { data: payload };
  const [data, metadata] = payload;
  if (metadata == null || typeof metadata !== "object") return { data: payload };
  const record = metadata;
  const node = typeof record.langgraph_node === "string" ? record.langgraph_node : void 0;
  const runId = typeof record.run_id === "string" ? record.run_id : void 0;
  return {
    data: runId != null && data != null && typeof data === "object" ? {
      ...data,
      run_id: runId
    } : data,
    node
  };
}
function convertToProtocolEvent({ namespace: ns, mode, payload, seq }) {
  const timestamp = Date.now();
  const base = { type: "event" };
  switch (mode) {
    case "messages": {
      const { data, node } = unwrapMessagesPayload(payload);
      return [{
        ...base,
        seq,
        method: "messages",
        params: {
          namespace: ns,
          timestamp,
          ...node ? { node } : {},
          data
        }
      }];
    }
    case "tools":
      return [{
        ...base,
        seq,
        method: "tools",
        params: {
          namespace: ns,
          timestamp,
          data: convertToolsPayload(payload)
        }
      }];
    case "checkpoints":
      if (!isCheckpointEnvelope(payload)) return [];
      return [{
        ...base,
        seq,
        method: "checkpoints",
        params: {
          namespace: ns,
          timestamp,
          data: payload
        }
      }];
    case "values":
      return [{
        ...base,
        seq,
        method: "values",
        params: {
          namespace: ns,
          timestamp,
          data: payload
        }
      }];
    case "updates": {
      const data = convertUpdatesPayload(payload);
      return [{
        ...base,
        seq,
        method: "updates",
        params: {
          namespace: ns,
          timestamp,
          ...typeof data.node === "string" ? { node: data.node } : {},
          data
        }
      }];
    }
    case "custom": {
      const data = typeof payload === "object" && payload !== null && !Array.isArray(payload) && "name" in payload ? payload : { payload };
      return [{
        ...base,
        seq,
        method: "custom",
        params: {
          namespace: ns,
          timestamp,
          data
        }
      }];
    }
    case "tasks":
      return [{
        ...base,
        seq,
        method: "tasks",
        params: {
          namespace: ns,
          timestamp,
          data: payload
        }
      }];
    default:
      return [];
  }
}
function convertToolsPayload(payload) {
  if (typeof payload !== "object" || payload === null) return {
    event: "tool-error",
    tool_call_id: "",
    message: "Unexpected tools payload shape"
  };
  const p = payload;
  const tool_call_id = String(p.toolCallId ?? "");
  switch (p.event) {
    case "on_tool_start":
      return {
        event: "tool-started",
        tool_call_id,
        tool_name: String(p.name ?? "unknown"),
        input: p.input
      };
    case "on_tool_event":
      return {
        event: "tool-output-delta",
        tool_call_id,
        delta: typeof p.data === "string" ? p.data : JSON.stringify(p.data ?? "")
      };
    case "on_tool_end":
      return {
        event: "tool-finished",
        tool_call_id,
        output: p.output
      };
    case "on_tool_error": {
      const err = p.error;
      return {
        event: "tool-error",
        tool_call_id,
        message: typeof err === "object" && err !== null && "message" in err && typeof err.message === "string" ? err.message : String(err ?? "unknown error")
      };
    }
    default:
      return {
        event: "tool-error",
        tool_call_id: "",
        message: `Unknown tool event: ${String(p.event)}`
      };
  }
}
function convertUpdatesPayload(payload) {
  if (typeof payload !== "object" || payload === null) return { values: {} };
  const entries = Object.entries(payload);
  if (entries.length === 0) return { values: {} };
  const [node, values] = entries[0];
  return {
    node,
    values: typeof values === "object" && values !== null ? values : { value: values }
  };
}
const STREAM_CHANNEL_BRAND = /* @__PURE__ */ Symbol.for("langgraph.stream_channel");
var StreamChannel = class StreamChannel2 {
  /** @internal Brand used by {@link StreamChannel.isInstance}. */
  [STREAM_CHANNEL_BRAND] = true;
  /** Protocol channel name used for auto-forwarded events, if remote. */
  channelName;
  #items = [];
  #waiters = [];
  #done = false;
  #error;
  #onPush;
  constructor(name) {
    this.channelName = name;
  }
  /**
  * Create an in-process-only channel.  Values remain available through
  * `run.extensions.<key>` but are not forwarded to remote clients.
  */
  static local() {
    return new StreamChannel2();
  }
  /**
  * Create a channel whose pushes are forwarded to remote clients under
  * the given protocol channel name.
  */
  static remote(name) {
    return new StreamChannel2(name);
  }
  /**
  * Brand-based type guard that recognises any {@link StreamChannel}
  * instance, even ones originating from a different copy of this
  * package. Prefer this over `instanceof StreamChannel` when code
  * may observe channels that were constructed elsewhere.
  */
  static isInstance(value) {
    return typeof value === "object" && value !== null && STREAM_CHANNEL_BRAND in value && value[STREAM_CHANNEL_BRAND] === true;
  }
  /**
  * Append an item to the channel.  If this is a remote channel wired to a
  * mux, the item is also injected into the main protocol event stream under
  * {@link channelName}.
  */
  push(item) {
    this.#items.push(item);
    this.#wake();
    this.#onPush?.(item);
  }
  /**
  * Returns an async iterator starting at position {@link startAt}. Each call
  * returns an independent cursor so multiple consumers can iterate the same
  * channel concurrently.
  */
  iterate(startAt = 0) {
    let cursor = startAt;
    return { next: async () => {
      while (true) {
        if (cursor < this.#items.length) return {
          value: this.#items[cursor++],
          done: false
        };
        if (this.#done) {
          if (this.#error) throw this.#error;
          return {
            value: void 0,
            done: true
          };
        }
        await new Promise((resolve) => this.#waiters.push(resolve));
      }
    } };
  }
  /**
  * Creates an {@link AsyncIterable} backed by this channel, starting from
  * {@link startAt}.
  */
  toAsyncIterable(startAt = 0) {
    return { [Symbol.asyncIterator]: () => this.iterate(startAt) };
  }
  /**
  * Creates a web {@link ReadableStream} that emits channel items as
  * Server-Sent Events. Useful for returning a channel directly from
  * `new Response(channel.toEventStream())`.
  */
  toEventStream(options = {}) {
    const encoder = new TextEncoder();
    const iterator = this.iterate(options.startAt);
    const event = options.event ?? this.channelName;
    const serialize = options.serialize ?? ((item) => JSON.stringify(item) ?? "null");
    return new ReadableStream({
      async pull(controller) {
        try {
          const next = await iterator.next();
          if (next.done) {
            controller.close();
            return;
          }
          const lines = [];
          if (event != null) lines.push(`event: ${event}`);
          for (const line of serialize(next.value).split(/\r\n|\r|\n/)) lines.push(`data: ${line}`);
          controller.enqueue(encoder.encode(`${lines.join("\n")}

`));
        } catch (error) {
          controller.error(error);
        }
      },
      async cancel() {
        await iterator.return?.();
      }
    });
  }
  /**
  * Returns the item at the given zero-based index.
  *
  * @throws {RangeError} If the index is out of bounds.
  */
  get(index2) {
    if (index2 < 0 || index2 >= this.#items.length) throw new RangeError(`StreamChannel index ${index2} out of bounds (size=${this.#items.length})`);
    return this.#items[index2];
  }
  /** The number of items currently buffered in the channel. */
  get size() {
    return this.#items.length;
  }
  /** Whether the channel has been closed or failed. */
  get done() {
    return this.#done;
  }
  /** Mark the channel as complete after all buffered items are consumed. */
  close() {
    this.#done = true;
    this.#wake();
  }
  /** Mark the channel as failed after all buffered items are consumed. */
  fail(err) {
    this.#error = err;
    this.#done = true;
    this.#wake();
  }
  /** @internal Called by the mux to wire auto-forwarding. */
  _wire(fn) {
    this.#onPush = fn;
  }
  /** @internal Called by the mux on normal completion. */
  _close() {
    this.close();
  }
  /** @internal Called by the mux on failure. */
  _fail(err) {
    this.fail(err);
  }
  [Symbol.asyncIterator]() {
    return this.iterate();
  }
  #wake() {
    const waiters = this.#waiters.splice(0);
    for (const w of waiters) w();
  }
};
function isStreamChannel(value) {
  return StreamChannel.isInstance(value);
}
const EXTENSION_CHANNEL_PREFIX = "custom:";
function extensionChannelMethod(channelName) {
  return `${EXTENSION_CHANNEL_PREFIX}${channelName}`;
}
function isPromiseLike(value) {
  return value != null && (typeof value === "object" || typeof value === "function") && typeof value.then === "function";
}
const RESOLVE_VALUES = /* @__PURE__ */ Symbol("resolveValues");
const REJECT_VALUES = /* @__PURE__ */ Symbol("rejectValues");
var StreamMux = class {
  /** @internal All protocol events in arrival order (after reducer pipeline). */
  _events = StreamChannel.local();
  /** @internal New-namespace discovery notifications. */
  _discoveries = StreamChannel.local();
  /** Monotonic counter for auto-forwarded channel events. */
  #nextEmitSeq = 0;
  /** Whether the mux has been closed or failed. */
  #closed = false;
  /** The error passed to {@link fail}, if any. */
  #error;
  /** Whether the run was interrupted. */
  #interrupted = false;
  /**
  * Namespace of the event currently being processed by
  * {@link push}.  Read by {@link StreamChannel} wiring callbacks so
  * auto-forwarded events inherit the triggering event's namespace.
  */
  #currentNamespace = [];
  #transformers = [];
  #channels = [];
  #streamMap = /* @__PURE__ */ new Map();
  #latestValues = /* @__PURE__ */ new Map();
  #interrupts = [];
  /**
  * Final-value projection keys tracked for remote surfacing. Populated
  * by {@link wireChannels} when a transformer's projection contains a
  * `PromiseLike` value. Each entry is flushed as a `custom:<name>`
  * protocol event during {@link close} so that remote clients can
  * observe final-value transformers via `thread.extensions.<name>`.
  */
  #finalValues = [];
  /**
  * Associates a pre-existing stream handle with a namespace so that
  * {@link close} can resolve its values promise later.
  *
  * @param path - The namespace path to register.
  * @param stream - The run stream handle for that namespace.
  */
  register(path, stream) {
    this.#streamMap.set(nsKey$1(path), stream);
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
  addTransformer(transformer) {
    const snapshot = this._events.size;
    this.#transformers.push(transformer);
    if (transformer.onRegister) transformer.onRegister({ push: (ns, event) => this.push(ns, event) });
    for (let i = 0; i < snapshot; i += 1) transformer.process(this._events.get(i));
    if (this.#closed) if (this.#error !== void 0) transformer.fail?.(this.#error);
    else transformer.finalize?.();
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
  wireChannels(projection) {
    for (const [key, value] of Object.entries(projection)) {
      if (isStreamChannel(value)) {
        this.#channels.push(value);
        if (typeof value.channelName !== "string") continue;
        const method = extensionChannelMethod(value.channelName);
        value._wire((item) => {
          this._events.push({
            type: "event",
            seq: this.#nextEmitSeq++,
            method,
            params: {
              namespace: this.#currentNamespace,
              timestamp: Date.now(),
              data: item
            }
          });
        });
        continue;
      }
      if (isPromiseLike(value)) this.#finalValues.push({
        name: key,
        promise: Promise.resolve(value)
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
  push(ns, event) {
    if (event.method === "values") this.#latestValues.set(nsKey$1(ns), event.params.data);
    const outerNamespace = this.#currentNamespace;
    this.#currentNamespace = ns;
    let keep = true;
    for (const transformer of this.#transformers) if (!transformer.process(event)) keep = false;
    this.#currentNamespace = outerNamespace;
    if (keep) this._events.push({
      ...event,
      seq: this.#nextEmitSeq++
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
    this.#closed = true;
    for (const [key, values] of this.#latestValues.entries()) {
      const ns = key ? key.split("\0") : [];
      this.#streamMap.get(nsKey$1(ns))?.[RESOLVE_VALUES](values);
    }
    const finalizePromises = [];
    for (const transformer of this.#transformers) {
      const result = transformer.finalize?.();
      if (result != null && typeof result.then === "function") finalizePromises.push(result);
    }
    for (const channel of this.#channels) channel._close();
    const finalValues = this.#finalValues;
    if (finalValues.length === 0 && finalizePromises.length === 0) {
      this._events.close();
      this._discoveries.close();
    } else Promise.allSettled([...finalizePromises, ...finalValues.map(async ({ name, promise }) => {
      try {
        const resolved = await promise;
        if (!this._events.done) this._events.push({
          type: "event",
          seq: this.#nextEmitSeq++,
          method: "custom",
          params: {
            namespace: [],
            timestamp: Date.now(),
            data: {
              name,
              payload: resolved
            }
          }
        });
      } catch {
      }
    })]).then(() => {
      this._events.close();
      this._discoveries.close();
    });
    for (const stream of this.#streamMap.values()) stream[RESOLVE_VALUES](void 0);
  }
  /**
  * Propagates a failure to all transformers, channels, event logs, and
  * stream handles.
  *
  * @param err - The error that caused the run to fail.
  */
  fail(err) {
    this.#closed = true;
    this.#error = err;
    for (const transformer of this.#transformers) transformer.fail?.(err);
    for (const channel of this.#channels) channel._fail(err);
    this._events.fail(err);
    this._discoveries.fail(err);
    for (const stream of this.#streamMap.values()) stream[REJECT_VALUES](err);
  }
  /**
  * Records that the run was interrupted, appending the supplied payloads
  * for later retrieval.
  *
  * @param interrupts - The interrupt payloads to store.
  */
  markInterrupted(interrupts) {
    this.#interrupted = true;
    this.#interrupts.push(...interrupts);
  }
  /**
  * Whether the run ended due to an interrupt.
  *
  * @returns `true` if {@link markInterrupted} was called.
  */
  get interrupted() {
    return this.#interrupted;
  }
  /**
  * All interrupt payloads collected during the run.
  *
  * @returns A readonly view of the accumulated interrupt payloads.
  */
  get interrupts() {
    return this.#interrupts;
  }
  /**
  * Returns an async iterator that yields only events whose namespace
  * starts with {@link path}.
  *
  * @param path - Namespace prefix to filter on.
  * @param startAt - Zero-based index into the event log to begin from.
  * @returns An async iterator over matching {@link ProtocolEvent}s.
  */
  subscribeEvents(path, startAt = 0) {
    const base = this._events.iterate(startAt);
    return { async next() {
      while (true) {
        const result = await base.next();
        if (result.done) return result;
        if (hasPrefix$1(result.value.params.namespace, path)) return result;
      }
    } };
  }
};
async function pump(source, mux) {
  let seq = 0;
  try {
    for await (const chunk of source) {
      const [ns, mode, payload] = chunk;
      if (mode === "values" && isInterrupted(payload)) {
        const interrupts = payload[INTERRUPT$1];
        mux.markInterrupted(interrupts.map((i) => ({
          interruptId: i.id ?? "",
          payload: i.value
        })));
      }
      const events = convertToProtocolEvent({
        namespace: ns,
        mode,
        payload,
        seq
      });
      seq += events.length;
      for (const event of events) mux.push(ns, event);
    }
  } catch (err) {
    mux.fail(err);
    return;
  }
  mux.close();
}
function nsKey$1(ns) {
  return ns.join("\0");
}
function hasPrefix$1(ns, prefix) {
  if (prefix.length > ns.length) return false;
  for (let i = 0; i < prefix.length; i += 1) if (ns[i] !== prefix[i]) return false;
  return true;
}
function filterLifecycleEntries(log, path, startAt = 0) {
  return { [Symbol.asyncIterator]() {
    const base = log.iterate(startAt);
    return { async next() {
      while (true) {
        const result = await base.next();
        if (result.done) return {
          value: void 0,
          done: true
        };
        if (hasPrefix$1(result.value.namespace, path)) return {
          value: result.value,
          done: false
        };
      }
    } };
  } };
}
const DEFAULT_ROOT_GRAPH_NAME = "root";
function defaultGuessGraphName(ns) {
  if (ns.length === 0) return DEFAULT_ROOT_GRAPH_NAME;
  const last = ns[ns.length - 1];
  const colon = last.indexOf(":");
  return colon === -1 ? last : last.slice(0, colon);
}
function defaultSerializeError(err) {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  try {
    return JSON.stringify(err);
  } catch {
    return String(err);
  }
}
function isRecord$1(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function extractCause(data) {
  if (!isRecord$1(data)) return void 0;
  if (data.event !== "started") return void 0;
  const cause = data.cause;
  if (!isRecord$1(cause)) return void 0;
  if (typeof cause.type !== "string") return void 0;
  return cause;
}
function extractTaskResultCompletion(data) {
  if (!isRecord$1(data)) return void 0;
  if (!("result" in data)) return void 0;
  if (typeof data.name !== "string") return void 0;
  if (typeof data.id !== "string") return void 0;
  if (data.name.startsWith("__")) return void 0;
  return {
    name: data.name,
    id: data.id
  };
}
function createLifecycleTransformer(options = {}) {
  const rootGraphName = options.rootGraphName ?? DEFAULT_ROOT_GRAPH_NAME;
  const initialStatus = options.initialStatus ?? "running";
  const emitRootOnRegister = options.emitRootOnRegister ?? true;
  const getGraphName = options.getGraphName ?? defaultGuessGraphName;
  const serializeError = options.serializeError ?? defaultSerializeError;
  const getTerminalStatusOverride = options.getTerminalStatusOverride;
  const log = StreamChannel.local();
  const namespaces = /* @__PURE__ */ new Map();
  const namespaceCause = /* @__PURE__ */ new Map();
  const lcByNs = /* @__PURE__ */ new Map();
  const pendingToolCalls = /* @__PURE__ */ new Map();
  const pendingInterruptIds = /* @__PURE__ */ new Set();
  const pendingCompletions = [];
  let emitter;
  let inSelfEmit = 0;
  let finalized = false;
  const resolveGraphName = (ns) => {
    if (ns.length === 0) return rootGraphName;
    const lc = lcByNs.get(nsKey$1(ns));
    if (typeof lc === "string" && lc.length > 0) return lc;
    return getGraphName(ns);
  };
  const recordIdentity = (ns, data) => {
    const key = nsKey$1(ns);
    if (lcByNs.has(key)) return;
    const lc = (isRecord$1(data) && isRecord$1(data.metadata) ? data.metadata : void 0)?.lc_agent_name;
    lcByNs.set(key, typeof lc === "string" ? lc : void 0);
  };
  const recordPendingToolCalls = (data) => {
    if (!isRecord$1(data)) return;
    const taskId = data.id;
    if (typeof taskId !== "string") return;
    const input = data.input;
    let toolCallId;
    if (isRecord$1(input) && isRecord$1(input.tool_call)) {
      const candidate = input.tool_call.id;
      if (typeof candidate === "string") toolCallId = candidate;
    } else if (Array.isArray(input)) {
      for (const toolCall of input) if (isRecord$1(toolCall) && typeof toolCall.id === "string") {
        toolCallId = toolCall.id;
        break;
      }
    }
    if (toolCallId != null) pendingToolCalls.set(taskId, toolCallId);
  };
  const deriveToolCallCause = (ns) => {
    if (ns.length === 0) return void 0;
    const lc = lcByNs.get(nsKey$1(ns));
    if (typeof lc !== "string" || lc.length === 0) return void 0;
    const segment = ns[ns.length - 1];
    const colon = segment.indexOf(":");
    if (colon === -1) return void 0;
    const triggerCallId = segment.slice(colon + 1);
    if (triggerCallId.length === 0) return void 0;
    const toolCallId = pendingToolCalls.get(triggerCallId);
    if (typeof toolCallId !== "string" || toolCallId.length === 0) return;
    return {
      type: "toolCall",
      tool_call_id: toolCallId
    };
  };
  const resolveStartCause = (ns) => namespaceCause.get(nsKey$1(ns)) ?? deriveToolCallCause(ns);
  const emit = (ns, status, extras) => {
    const key = nsKey$1(ns);
    let current = namespaces.get(key);
    const graphName = current?.graphName ?? resolveGraphName(ns);
    if (current != null && current.status === status && current.graphName === graphName && extras?.error == null) return;
    if (current == null) {
      current = {
        namespace: ns,
        graphName,
        status
      };
      namespaces.set(key, current);
    } else current.status = status;
    const data = {
      event: status,
      graph_name: graphName,
      ...extras?.cause != null ? { cause: extras.cause } : {},
      ...extras?.error != null ? { error: extras.error } : {}
    };
    const timestamp = Date.now();
    log.push({
      namespace: ns,
      timestamp,
      ...data
    });
    if (ns.length === 0 && !emitRootOnRegister) return;
    if (emitter == null) return;
    inSelfEmit += 1;
    try {
      emitter.push(ns, {
        type: "event",
        seq: 0,
        method: "lifecycle",
        params: {
          namespace: ns,
          timestamp,
          data
        }
      });
    } finally {
      inSelfEmit -= 1;
    }
  };
  const trackNamespace = (ns) => {
    const key = nsKey$1(ns);
    let rec = namespaces.get(key);
    if (rec == null) {
      rec = {
        namespace: ns,
        graphName: resolveGraphName(ns),
        status: void 0
      };
      namespaces.set(key, rec);
    }
    return rec;
  };
  const flushPendingCompletions = () => {
    if (pendingCompletions.length === 0) return;
    const toFlush = pendingCompletions.splice(0, pendingCompletions.length);
    for (const completion of toFlush) {
      const key = nsKey$1(completion.namespace);
      const rec = namespaces.get(key);
      if (rec == null || rec.status !== "started") continue;
      emit(completion.namespace, "completed");
    }
  };
  const enqueueCompletion = (completion) => {
    const key = nsKey$1(completion.namespace);
    const rec = namespaces.get(key);
    if (rec == null || rec.status !== "started") return;
    if (pendingCompletions.some((pending) => nsKey$1(pending.namespace) === key)) return;
    pendingCompletions.push(completion);
  };
  const removePendingNodeCompletions = (parent, node) => {
    for (let index2 = pendingCompletions.length - 1; index2 >= 0; index2 -= 1) {
      const pending = pendingCompletions[index2];
      if (pending.source.type !== "node") continue;
      if (pending.source.node !== node) continue;
      if (nsKey$1(pending.source.parent) !== nsKey$1(parent)) continue;
      pendingCompletions.splice(index2, 1);
    }
  };
  const ensureStarted = (ns) => {
    for (let length = 1; length <= ns.length; length += 1) {
      const prefix = ns.slice(0, length);
      const key = nsKey$1(prefix);
      if (namespaces.has(key)) continue;
      trackNamespace(prefix);
      const cause = resolveStartCause(prefix);
      emit(prefix, "started", cause != null ? { cause } : void 0);
    }
  };
  const defaultTerminalStatus = () => pendingInterruptIds.size > 0 ? "interrupted" : "completed";
  const cascadeTerminalStatus = (status) => {
    for (const rec of namespaces.values()) {
      if (rec.namespace.length === 0) continue;
      if (rec.status !== "started") continue;
      emit(rec.namespace, status);
    }
    emit([], status);
    log.close();
  };
  const resolveTerminalStatusOverride = async () => {
    if (getTerminalStatusOverride == null) return defaultTerminalStatus();
    try {
      return await getTerminalStatusOverride() ?? defaultTerminalStatus();
    } catch {
      return defaultTerminalStatus();
    }
  };
  const findStartedChildForNode = (parentNamespace, node) => {
    const prefix = `${node}:`;
    for (const rec of namespaces.values()) {
      if (rec.namespace.length !== parentNamespace.length + 1) continue;
      if (rec.status !== "started") continue;
      if (!hasPrefix$1(rec.namespace, parentNamespace)) continue;
      const last = rec.namespace[rec.namespace.length - 1];
      if (last === node || last.startsWith(prefix)) return rec.namespace;
    }
  };
  const findStartedChildForTask = (parentNamespace, task2) => {
    const namespace = [...parentNamespace, `${task2.name}:${task2.id}`];
    return namespaces.get(nsKey$1(namespace))?.status === "started" ? namespace : void 0;
  };
  return {
    __native: true,
    init() {
      return {
        _lifecycleLog: log,
        lifecycle: filterLifecycleEntries(log, [], 0)
      };
    },
    onRegister(handle) {
      emitter = handle;
      trackNamespace([]);
      if (emitRootOnRegister) emit([], initialStatus);
    },
    process(event) {
      const ns = event.params.namespace;
      if (inSelfEmit > 0) return true;
      const taskCompletion = event.method === "tasks" ? extractTaskResultCompletion(event.params.data) : void 0;
      if (taskCompletion != null) removePendingNodeCompletions(ns, taskCompletion.name);
      else if (event.method === "tasks") {
        recordIdentity(ns, event.params.data);
        recordPendingToolCalls(event.params.data);
      }
      flushPendingCompletions();
      if (event.method === "lifecycle") {
        const cause = extractCause(event.params.data);
        if (cause != null) namespaceCause.set(nsKey$1(ns), cause);
        ensureStarted(ns);
        return false;
      }
      ensureStarted(ns);
      if (event.method === "input" && isRecord$1(event.params.data) && event.params.data.event === "requested") {
        const id = event.params.data.id;
        if (typeof id === "string") pendingInterruptIds.add(id);
      }
      if (taskCompletion != null) {
        const childNamespace = findStartedChildForTask(ns, taskCompletion);
        if (childNamespace != null) enqueueCompletion({
          namespace: childNamespace,
          source: { type: "task" }
        });
      }
      if (event.method === "updates") {
        const node = event.params.node;
        if (typeof node === "string" && !node.startsWith("__")) {
          const childNamespace = findStartedChildForNode(ns, node);
          if (childNamespace != null) enqueueCompletion({
            namespace: childNamespace,
            source: {
              type: "node",
              parent: ns,
              node
            }
          });
        }
      }
      return true;
    },
    finalize() {
      if (finalized) return;
      finalized = true;
      flushPendingCompletions();
      if (getTerminalStatusOverride == null) {
        cascadeTerminalStatus(defaultTerminalStatus());
        return;
      }
      return resolveTerminalStatusOverride().then(cascadeTerminalStatus).catch((err) => {
        log.fail(err);
      });
    },
    fail(err) {
      if (finalized) return;
      finalized = true;
      const errorMessage = serializeError(err);
      for (const rec of namespaces.values()) {
        if (rec.namespace.length === 0) continue;
        if (rec.status !== "started") continue;
        emit(rec.namespace, "failed");
      }
      emit([], "failed", { error: errorMessage });
      log.fail(err);
    }
  };
}
function getMessageStreamKey(data) {
  const record = data;
  if (typeof record.run_id === "string") return `run:${record.run_id}`;
  if (data.event === "message-start" && typeof record.id === "string") return `message:${record.id}`;
  return "__default__";
}
function createMessagesTransformer(path, nodeFilter) {
  const log = StreamChannel.local();
  const active = /* @__PURE__ */ new Map();
  const ignored = /* @__PURE__ */ new Set();
  return {
    init: () => ({ messages: log.toAsyncIterable() }),
    process(event) {
      if (event.method !== "messages") return true;
      if (!hasPrefix$1(event.params.namespace, path)) return true;
      if (event.params.namespace.length !== path.length + 1) return true;
      if (nodeFilter !== void 0 && event.params.node !== nodeFilter) return true;
      const data = event.params.data;
      switch (data.event) {
        case "message-start": {
          const key = getMessageStreamKey(data);
          if (data.role === "tool") {
            ignored.add(key);
            break;
          }
          const source = StreamChannel.local();
          const stream = Object.assign(new ChatModelStream(source.toAsyncIterable()), {
            namespace: event.params.namespace,
            node: event.params.node
          });
          active.set(key, {
            source,
            stream
          });
          source.push(data);
          log.push(stream);
          break;
        }
        case "content-block-start":
        case "content-block-delta":
        case "content-block-finish":
          if (ignored.has(getMessageStreamKey(data))) break;
          active.get(getMessageStreamKey(data))?.source.push(data);
          break;
        case "message-finish": {
          const key = getMessageStreamKey(data);
          if (ignored.delete(key)) break;
          const stream = active.get(key);
          if (stream) {
            stream.source.push(data);
            stream.source.close();
            active.delete(key);
          }
          break;
        }
        case "error":
          if (ignored.has(getMessageStreamKey(data))) break;
          active.get(getMessageStreamKey(data))?.source.push(data);
          break;
      }
      return true;
    },
    finalize() {
      for (const [key, stream] of active) {
        stream.source.push({ event: "message-finish" });
        stream.source.close();
        active.delete(key);
      }
      ignored.clear();
      log.close();
    },
    fail(err) {
      for (const [key, stream] of active) {
        stream.source.fail(err);
        active.delete(key);
      }
      ignored.clear();
      log.fail(err);
    }
  };
}
function filterSubgraphHandles(log, path, startAt = 0) {
  const targetDepth = path.length + 1;
  return { [Symbol.asyncIterator]() {
    const base = log.iterate(startAt);
    return { async next() {
      while (true) {
        const result = await base.next();
        if (result.done) return {
          value: void 0,
          done: true
        };
        const { ns, stream } = result.value;
        if (ns.length === targetDepth && hasPrefix$1(ns, path)) return {
          value: stream,
          done: false
        };
      }
    } };
  } };
}
function createSubgraphDiscoveryTransformer(mux, options) {
  const { createStream } = options;
  const seen = /* @__PURE__ */ new Set();
  return {
    __native: true,
    init() {
      return {
        _discoveries: mux._discoveries,
        subgraphs: filterSubgraphHandles(mux._discoveries, [], 0)
      };
    },
    process(event) {
      const ns = event.params.namespace;
      if (ns.length === 0) return true;
      const topNs = ns.slice(0, 1);
      const topKey = nsKey$1(topNs);
      if (seen.has(topKey)) return true;
      seen.add(topKey);
      const stream = createStream(topNs, mux._discoveries.size, mux._events.size);
      mux.register(topNs, stream);
      mux._discoveries.push({
        ns: topNs,
        stream
      });
      return true;
    }
  };
}
function createValuesTransformer(path) {
  const valuesLog = StreamChannel.local();
  return {
    init: () => ({ _valuesLog: valuesLog }),
    process(event) {
      if (event.method !== "values") return true;
      if (event.params.namespace.length !== path.length) return true;
      if (!hasPrefix$1(event.params.namespace, path)) return true;
      valuesLog.push(event.params.data);
      return true;
    },
    finalize() {
      valuesLog.close();
    },
    fail(err) {
      valuesLog.fail(err);
    }
  };
}
function isNativeTransformer(t) {
  return "__native" in t && t.__native === true;
}
const SET_VALUES_LOG = /* @__PURE__ */ Symbol("setValuesLog");
const SET_MESSAGES_ITERABLE = /* @__PURE__ */ Symbol("setMessagesIterable");
const SET_LIFECYCLE_ITERABLE = /* @__PURE__ */ Symbol("setLifecycleIterable");
const SET_SUBGRAPHS_ITERABLE = /* @__PURE__ */ Symbol("setSubgraphsIterable");
const EMPTY_ASYNC_ITERABLE = { [Symbol.asyncIterator]() {
  return { next: () => Promise.resolve({
    value: void 0,
    done: true
  }) };
} };
var GraphRunStream = class {
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
  #eventStart;
  #discoveryStart;
  #abortController;
  #resolveValuesFn;
  #rejectValuesFn;
  #valuesDone;
  #valuesLog;
  #messagesIterable;
  #lifecycleIterable;
  #subgraphsIterable;
  /**
  * @param path - Namespace path for this stream (empty array for root).
  * @param mux - The {@link StreamMux} driving this run.
  * @param discoveryStart - Cursor offset into the mux discovery log.
  * @param eventStart - Cursor offset into the mux event log.
  * @param extensions - Pre-initialized transformer projections.
  * @param abortController - Controller for programmatic cancellation.
  */
  constructor(path, mux, discoveryStart = 0, eventStart = 0, extensions, abortController) {
    this.path = path;
    this._mux = mux;
    this.#discoveryStart = discoveryStart;
    this.#eventStart = eventStart;
    this.extensions = extensions ?? {};
    this.#abortController = abortController ?? new AbortController();
    this.#valuesDone = new Promise((resolve, reject) => {
      this.#resolveValuesFn = resolve;
      this.#rejectValuesFn = reject;
    });
    this.#valuesDone.catch(() => {
    });
  }
  /**
  * Async iterator over all {@link ProtocolEvent}s at or below this
  * stream's namespace, starting from the configured event offset.
  *
  * @returns An async iterator yielding protocol events in arrival order.
  */
  [Symbol.asyncIterator]() {
    return this._mux.subscribeEvents(this.path, this.#eventStart);
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
    if (this.#subgraphsIterable) return this.#subgraphsIterable;
    return filterSubgraphHandles(this._mux._discoveries, this.path, this.#discoveryStart);
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
    const log = this.#valuesLog;
    const done = this.#valuesDone;
    const mux = this._mux;
    const eventStart = this.#eventStart;
    const path = this.path;
    const iterable = log ? log.toAsyncIterable() : { [Symbol.asyncIterator]: () => {
      const base = mux.subscribeEvents(path, eventStart);
      return { async next() {
        while (true) {
          const result = await base.next();
          if (result.done) return {
            value: void 0,
            done: true
          };
          if (result.value.method === "values" && result.value.params.namespace.length === path.length) return {
            value: result.value.params.data,
            done: false
          };
        }
      } };
    } };
    return {
      [Symbol.asyncIterator]: () => iterable[Symbol.asyncIterator](),
      then: done.then.bind(done)
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
    if (this.#messagesIterable) return this.#messagesIterable;
    const transformer = createMessagesTransformer(this.path);
    const projection = transformer.init();
    this._mux.addTransformer(transformer);
    this.#messagesIterable = projection.messages;
    return this.#messagesIterable;
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
    return this.#lifecycleIterable ?? EMPTY_ASYNC_ITERABLE;
  }
  /**
  * Messages produced by a specific graph node. Use when the run has
  * multiple model-calling nodes and you only want messages from one.
  *
  * @param node - The graph node name to filter messages by.
  * @returns An async iterable of chat model streams from the given node.
  */
  messagesFrom(node) {
    const transformer = createMessagesTransformer(this.path, node);
    const projection = transformer.init();
    this._mux.addTransformer(transformer);
    return projection.messages;
  }
  /**
  * Promise that resolves with the final graph state when the run completes,
  * or rejects if the run fails.
  *
  * @returns A promise resolving to the final state values.
  */
  get output() {
    return this.#valuesDone;
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
  abort(reason) {
    this.#abortController.abort(reason);
  }
  /**
  * The {@link AbortSignal} wired into this run for cancellation support.
  *
  * @returns The abort signal for this stream.
  */
  get signal() {
    return this.#abortController.signal;
  }
  /**
  * Resolve the output/values promise with the final state snapshot.
  * Called by {@link StreamMux.close}.
  *
  * @param values - The final state values, or `undefined` if none.
  * @internal
  */
  [RESOLVE_VALUES](values) {
    this.#resolveValuesFn?.(values);
    this.#resolveValuesFn = void 0;
  }
  /**
  * Reject the output/values promise with a run error.
  * Called by {@link StreamMux.fail}.
  *
  * @param err - The error that caused the run to fail.
  * @internal
  */
  [REJECT_VALUES](err) {
    this.#rejectValuesFn?.(err);
    this.#rejectValuesFn = void 0;
  }
  /**
  * Attach the transformer-populated event log backing the `.values` iterable.
  * Called during stream setup in {@link createGraphRunStream}.
  *
  * @param log - The event log from the values transformer projection.
  * @internal
  */
  [SET_VALUES_LOG](log) {
    this.#valuesLog = log;
  }
  /**
  * Attach the transformer-populated async iterable backing the `.messages`
  * accessor. Called during stream setup in {@link createGraphRunStream}.
  *
  * @param iterable - The async iterable from the messages transformer projection.
  * @internal
  */
  [SET_MESSAGES_ITERABLE](iterable) {
    this.#messagesIterable = iterable;
  }
  /**
  * Attach the transformer-populated async iterable backing the
  * `.lifecycle` accessor. Called during stream setup in
  * {@link createGraphRunStream}.
  *
  * @param iterable - The async iterable from the lifecycle transformer projection.
  * @internal
  */
  [SET_LIFECYCLE_ITERABLE](iterable) {
    this.#lifecycleIterable = iterable;
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
  [SET_SUBGRAPHS_ITERABLE](iterable) {
    this.#subgraphsIterable = iterable;
  }
};
var SubgraphRunStream = class extends GraphRunStream {
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
  constructor(path, mux, discoveryStart = 0, eventStart = 0, extensions, abortController) {
    super(path, mux, discoveryStart, eventStart, extensions, abortController);
    const lastSegment = path[path.length - 1] ?? "";
    const colonIdx = lastSegment.lastIndexOf(":");
    if (colonIdx >= 0) {
      this.name = lastSegment.slice(0, colonIdx);
      const suffix = lastSegment.slice(colonIdx + 1);
      this.index = /^\d+$/.test(suffix) ? Number(suffix) : 0;
    } else {
      this.name = lastSegment;
      this.index = 0;
    }
  }
};
function createGraphRunStream(source, transformers = [], optionsOrAbortController) {
  const { abortController } = optionsOrAbortController instanceof AbortController ? { abortController: optionsOrAbortController } : optionsOrAbortController ?? {};
  const mux = new StreamMux();
  const lifecycleTransformer = createLifecycleTransformer();
  const lifecycleProjection = lifecycleTransformer.init();
  const lifecycleLog = lifecycleProjection._lifecycleLog;
  const subgraphDiscoveryTransformer = createSubgraphDiscoveryTransformer(mux, { createStream: (path, discoveryStart, eventStart) => {
    const sub = new SubgraphRunStream(path, mux, discoveryStart, eventStart);
    sub[SET_SUBGRAPHS_ITERABLE](filterSubgraphHandles(mux._discoveries, path, discoveryStart));
    sub[SET_LIFECYCLE_ITERABLE](filterLifecycleEntries(lifecycleLog, path, lifecycleLog.size));
    return sub;
  } });
  const subgraphsProjection = subgraphDiscoveryTransformer.init();
  mux.addTransformer(subgraphDiscoveryTransformer);
  mux.addTransformer(lifecycleTransformer);
  const valuesTransformer = createValuesTransformer([]);
  const messagesTransformer = createMessagesTransformer([]);
  mux.addTransformer(valuesTransformer);
  mux.addTransformer(messagesTransformer);
  const extensions = {};
  const nativeProjections = [];
  for (const factory of transformers) {
    const transformer = factory();
    mux.addTransformer(transformer);
    const projection = transformer.init();
    if (isNativeTransformer(transformer)) nativeProjections.push(projection);
    else Object.assign(extensions, projection);
    if (typeof projection === "object" && projection !== null && !isNativeTransformer(transformer)) mux.wireChannels(projection);
  }
  const root = new GraphRunStream([], mux, 0, 0, extensions, abortController);
  for (const proj of nativeProjections) Object.assign(root, proj);
  const valuesProjection = valuesTransformer.init();
  root[SET_VALUES_LOG](valuesProjection._valuesLog);
  const messagesProjection = messagesTransformer.init();
  root[SET_MESSAGES_ITERABLE](messagesProjection.messages);
  root[SET_LIFECYCLE_ITERABLE](lifecycleProjection.lifecycle);
  root[SET_SUBGRAPHS_ITERABLE](subgraphsProjection.subgraphs);
  mux.register([], root);
  pump(source, mux).catch((err) => {
  });
  return root;
}
const n = (n2) => BigInt(n2);
const view = (data, offset = 0) => new DataView(data.buffer, data.byteOffset + offset, data.byteLength - offset);
const PRIME32_1 = n("0x9E3779B1");
const PRIME32_2 = n("0x85EBCA77");
const PRIME32_3 = n("0xC2B2AE3D");
const PRIME64_1 = n("0x9E3779B185EBCA87");
const PRIME64_2 = n("0xC2B2AE3D27D4EB4F");
const PRIME64_3 = n("0x165667B19E3779F9");
const PRIME64_4 = n("0x85EBCA77C2B2AE63");
const PRIME64_5 = n("0x27D4EB2F165667C5");
const PRIME_MX1 = n("0x165667919E3779F9");
const PRIME_MX2 = n("0x9FB21C651E98DF25");
const hexToUint8Array = (hex) => {
  const strLen = hex.length;
  if (strLen % 2 !== 0) throw new Error("String should have an even number of characters");
  const maxLength = strLen / 2;
  const bytes = new Uint8Array(maxLength);
  let read = 0;
  let write = 0;
  while (write < maxLength) {
    const slice = hex.slice(read, read += 2);
    bytes[write] = Number.parseInt(slice, 16);
    write += 1;
  }
  return view(bytes);
};
const kkey = hexToUint8Array("b8fe6c3923a44bbe7c01812cf721ad1cded46de9839097db7240a4a4b7b3671fcb79e64eccc0e578825ad07dccff7221b8084674f743248ee03590e6813a264c3c2852bb91c300cb88d0658b1b532ea371644897a20df94e3819ef46a9deacd8a8fa763fe39c343ff9dcbbc7c70b4f1d8a51e04bcdb45931c89f7ec9d9787364eac5ac8334d3ebc3c581a0fffa1363eb170ddd51b7f0da49d316552629d4689e2b16be587d47a1fc8ff8b8d17ad031ce45cb3a8f95160428afd7fbcabb4b407e");
const mask128 = (n(1) << n(128)) - n(1);
const mask64 = (n(1) << n(64)) - n(1);
const mask32 = (n(1) << n(32)) - n(1);
const STRIPE_LEN = 64;
const ACC_NB = STRIPE_LEN / 8;
const _U64 = 8;
const _U32 = 4;
function assert(a) {
  if (!a) throw new Error("Assert failed");
}
function bswap64(a) {
  const scratchbuf = /* @__PURE__ */ new DataView(/* @__PURE__ */ new ArrayBuffer(8));
  scratchbuf.setBigUint64(0, a, true);
  return scratchbuf.getBigUint64(0, false);
}
function bswap32(input) {
  let a = input;
  a = (a & n(65535)) << n(16) | (a & n(4294901760)) >> n(16);
  a = (a & n(16711935)) << n(8) | (a & n(4278255360)) >> n(8);
  return a;
}
function XXH_mult32to64(a, b) {
  return (a & mask32) * (b & mask32) & mask64;
}
function rotl32(a, b) {
  return (a << b | a >> n(32) - b) & mask32;
}
function XXH3_accumulate_512(acc, dataView, keyView) {
  for (let i = 0; i < ACC_NB; i += 1) {
    const data_val = dataView.getBigUint64(i * 8, true);
    const data_key = data_val ^ keyView.getBigUint64(i * 8, true);
    acc[i ^ 1] += data_val;
    acc[i] += XXH_mult32to64(data_key, data_key >> n(32));
  }
  return acc;
}
function XXH3_accumulate(acc, dataView, keyView, nbStripes) {
  for (let n2 = 0; n2 < nbStripes; n2 += 1) XXH3_accumulate_512(acc, view(dataView, n2 * STRIPE_LEN), view(keyView, n2 * 8));
  return acc;
}
function XXH3_scrambleAcc(acc, key) {
  for (let i = 0; i < ACC_NB; i += 1) {
    const key64 = key.getBigUint64(i * 8, true);
    let acc64 = acc[i];
    acc64 = xorshift64(acc64, n(47));
    acc64 ^= key64;
    acc64 *= PRIME32_1;
    acc[i] = acc64 & mask64;
  }
  return acc;
}
function XXH3_mix2Accs(acc, key) {
  return XXH3_mul128_fold64(acc[0] ^ key.getBigUint64(0, true), acc[1] ^ key.getBigUint64(_U64, true));
}
function XXH3_mergeAccs(acc, key, start) {
  let result64 = start;
  result64 += XXH3_mix2Accs(acc.slice(0), view(key, 0 * _U32));
  result64 += XXH3_mix2Accs(acc.slice(2), view(key, 4 * _U32));
  result64 += XXH3_mix2Accs(acc.slice(4), view(key, 8 * _U32));
  result64 += XXH3_mix2Accs(acc.slice(6), view(key, 12 * _U32));
  return XXH3_avalanche(result64 & mask64);
}
function XXH3_hashLong(input, data, secret, f_acc, f_scramble) {
  let acc = input;
  const nbStripesPerBlock = Math.floor((secret.byteLength - STRIPE_LEN) / 8);
  const block_len = STRIPE_LEN * nbStripesPerBlock;
  const nb_blocks = Math.floor((data.byteLength - 1) / block_len);
  for (let n2 = 0; n2 < nb_blocks; n2 += 1) {
    acc = XXH3_accumulate(acc, view(data, n2 * block_len), secret, nbStripesPerBlock);
    acc = f_scramble(acc, view(secret, secret.byteLength - STRIPE_LEN));
  }
  {
    const nbStripes = Math.floor((data.byteLength - 1 - block_len * nb_blocks) / STRIPE_LEN);
    acc = XXH3_accumulate(acc, view(data, nb_blocks * block_len), secret, nbStripes);
    acc = f_acc(acc, view(data, data.byteLength - STRIPE_LEN), view(secret, secret.byteLength - STRIPE_LEN - 7));
  }
  return acc;
}
function XXH3_hashLong_128b(data, secret) {
  let acc = new BigUint64Array([
    PRIME32_3,
    PRIME64_1,
    PRIME64_2,
    PRIME64_3,
    PRIME64_4,
    PRIME32_2,
    PRIME64_5,
    PRIME32_1
  ]);
  assert(data.byteLength > 128);
  acc = XXH3_hashLong(acc, data, secret, XXH3_accumulate_512, XXH3_scrambleAcc);
  assert(acc.length * 8 === 64);
  {
    const low64 = XXH3_mergeAccs(acc, view(secret, 11), n(data.byteLength) * PRIME64_1 & mask64);
    return XXH3_mergeAccs(acc, view(secret, secret.byteLength - STRIPE_LEN - 11), ~(n(data.byteLength) * PRIME64_2) & mask64) << n(64) | low64;
  }
}
function XXH3_mul128_fold64(a, b) {
  const lll = a * b & mask128;
  return lll & mask64 ^ lll >> n(64);
}
function XXH3_mix16B(dataView, keyView, seed) {
  return XXH3_mul128_fold64((dataView.getBigUint64(0, true) ^ keyView.getBigUint64(0, true) + seed) & mask64, (dataView.getBigUint64(8, true) ^ keyView.getBigUint64(8, true) - seed) & mask64);
}
function XXH3_mix32B(acc, data1, data2, key, seed) {
  let accl = acc & mask64;
  let acch = acc >> n(64) & mask64;
  accl += XXH3_mix16B(data1, key, seed);
  accl ^= data2.getBigUint64(0, true) + data2.getBigUint64(8, true);
  accl &= mask64;
  acch += XXH3_mix16B(data2, view(key, 16), seed);
  acch ^= data1.getBigUint64(0, true) + data1.getBigUint64(8, true);
  acch &= mask64;
  return acch << n(64) | accl;
}
function XXH3_avalanche(input) {
  let h64 = input;
  h64 ^= h64 >> n(37);
  h64 *= PRIME_MX1;
  h64 &= mask64;
  h64 ^= h64 >> n(32);
  return h64;
}
function XXH3_avalanche64(input) {
  let h64 = input;
  h64 ^= h64 >> n(33);
  h64 *= PRIME64_2;
  h64 &= mask64;
  h64 ^= h64 >> n(29);
  h64 *= PRIME64_3;
  h64 &= mask64;
  h64 ^= h64 >> n(32);
  return h64;
}
function XXH3_len_1to3_128b(data, key32, seed) {
  const len = data.byteLength;
  assert(len > 0 && len <= 3);
  const combined = n(data.getUint8(len - 1)) | n(len << 8) | n(data.getUint8(0) << 16) | n(data.getUint8(len >> 1) << 24);
  const low = (combined ^ (n(key32.getUint32(0, true)) ^ n(key32.getUint32(4, true))) + seed) & mask64;
  const bhigh = (n(key32.getUint32(8, true)) ^ n(key32.getUint32(12, true))) - seed;
  return (XXH3_avalanche64((rotl32(bswap32(combined), n(13)) ^ bhigh) & mask64) & mask64) << n(64) | XXH3_avalanche64(low);
}
function xorshift64(b, shift) {
  return b ^ b >> shift;
}
function XXH3_len_4to8_128b(data, key32, seed) {
  const len = data.byteLength;
  assert(len >= 4 && len <= 8);
  {
    const l1 = data.getUint32(0, true);
    const l2 = data.getUint32(len - 4, true);
    let m128 = ((n(l1) | n(l2) << n(32)) ^ (key32.getBigUint64(16, true) ^ key32.getBigUint64(24, true)) + seed & mask64) * (PRIME64_1 + (n(len) << n(2))) & mask128;
    m128 += (m128 & mask64) << n(65);
    m128 &= mask128;
    m128 ^= m128 >> n(67);
    return xorshift64(xorshift64(m128 & mask64, n(35)) * PRIME_MX2 & mask64, n(28)) | XXH3_avalanche(m128 >> n(64)) << n(64);
  }
}
function XXH3_len_9to16_128b(data, key64, seed) {
  const len = data.byteLength;
  assert(len >= 9 && len <= 16);
  {
    const bitflipl = (key64.getBigUint64(32, true) ^ key64.getBigUint64(40, true)) + seed & mask64;
    const bitfliph = (key64.getBigUint64(48, true) ^ key64.getBigUint64(56, true)) - seed & mask64;
    const ll1 = data.getBigUint64(0, true);
    let ll2 = data.getBigUint64(len - 8, true);
    let m128 = (ll1 ^ ll2 ^ bitflipl) * PRIME64_1;
    const m128_l = (m128 & mask64) + (n(len - 1) << n(54));
    m128 = m128 & (mask128 ^ mask64) | m128_l;
    ll2 ^= bitfliph;
    m128 += ll2 + (ll2 & mask32) * (PRIME32_2 - n(1)) << n(64);
    m128 &= mask128;
    m128 ^= bswap64(m128 >> n(64));
    let h128 = (m128 & mask64) * PRIME64_2;
    h128 += (m128 >> n(64)) * PRIME64_2 << n(64);
    h128 &= mask128;
    return XXH3_avalanche(h128 & mask64) | XXH3_avalanche(h128 >> n(64)) << n(64);
  }
}
function XXH3_len_0to16_128b(data, seed) {
  const len = data.byteLength;
  assert(len <= 16);
  if (len > 8) return XXH3_len_9to16_128b(data, kkey, seed);
  if (len >= 4) return XXH3_len_4to8_128b(data, kkey, seed);
  if (len > 0) return XXH3_len_1to3_128b(data, kkey, seed);
  return XXH3_avalanche64(seed ^ kkey.getBigUint64(64, true) ^ kkey.getBigUint64(72, true)) | XXH3_avalanche64(seed ^ kkey.getBigUint64(80, true) ^ kkey.getBigUint64(88, true)) << n(64);
}
function inv64(x) {
  return ~x + n(1) & mask64;
}
function XXH3_len_17to128_128b(data, secret, seed) {
  let acc = n(data.byteLength) * PRIME64_1 & mask64;
  let i = n(data.byteLength - 1) / n(32);
  while (i >= 0) {
    const ni = Number(i);
    acc = XXH3_mix32B(acc, view(data, 16 * ni), view(data, data.byteLength - 16 * (ni + 1)), view(secret, 32 * ni), seed);
    i -= n(1);
  }
  let h128l = acc + (acc >> n(64)) & mask64;
  h128l = XXH3_avalanche(h128l);
  let h128h = (acc & mask64) * PRIME64_1 + (acc >> n(64)) * PRIME64_4 + (n(data.byteLength) - seed & mask64) * PRIME64_2;
  h128h &= mask64;
  h128h = inv64(XXH3_avalanche(h128h));
  return h128l | h128h << n(64);
}
function XXH3_len_129to240_128b(data, secret, seed) {
  let acc = n(data.byteLength) * PRIME64_1 & mask64;
  for (let i = 32; i < 160; i += 32) acc = XXH3_mix32B(acc, view(data, i - 32), view(data, i - 16), view(secret, i - 32), seed);
  acc = XXH3_avalanche(acc & mask64) | XXH3_avalanche(acc >> n(64)) << n(64);
  for (let i = 160; i <= data.byteLength; i += 32) acc = XXH3_mix32B(acc, view(data, i - 32), view(data, i - 16), view(secret, 3 + i - 160), seed);
  acc = XXH3_mix32B(acc, view(data, data.byteLength - 16), view(data, data.byteLength - 32), view(secret, 103), inv64(seed));
  let h128l = acc + (acc >> n(64)) & mask64;
  h128l = XXH3_avalanche(h128l);
  let h128h = (acc & mask64) * PRIME64_1 + (acc >> n(64)) * PRIME64_4 + (n(data.byteLength) - seed & mask64) * PRIME64_2;
  h128h &= mask64;
  h128h = inv64(XXH3_avalanche(h128h));
  return h128l | h128h << n(64);
}
function XXH3(input, seed = n(0)) {
  const encoder = new TextEncoder();
  const data = view(typeof input === "string" ? encoder.encode(input) : input);
  const len = data.byteLength;
  const hexDigest = (data2) => data2.toString(16).padStart(32, "0");
  if (len <= 16) return hexDigest(XXH3_len_0to16_128b(data, seed));
  if (len <= 128) return hexDigest(XXH3_len_17to128_128b(data, kkey, seed));
  if (len <= 240) return hexDigest(XXH3_len_129to240_128b(data, kkey, seed));
  return hexDigest(XXH3_hashLong_128b(data, kkey));
}
function isXXH3(value) {
  return /^[0-9a-f]{32}$/.test(value);
}
function interrupt(value) {
  const config = AsyncLocalStorageProviderSingleton.getRunnableConfig();
  if (!config) throw new Error("Called interrupt() outside the context of a graph.");
  const conf = config.configurable;
  if (!conf) throw new Error("No configurable found in config");
  if (!conf["__pregel_checkpointer"]) throw new GraphValueError("No checkpointer set", { lc_error_code: "MISSING_CHECKPOINTER" });
  const scratchpad = conf[CONFIG_KEY_SCRATCHPAD];
  scratchpad.interruptCounter += 1;
  const idx = scratchpad.interruptCounter;
  if (scratchpad.resume.length > 0 && idx < scratchpad.resume.length) {
    conf[CONFIG_KEY_SEND]?.([[RESUME$1, scratchpad.resume]]);
    return scratchpad.resume[idx];
  }
  if (scratchpad.nullResume !== void 0) {
    if (scratchpad.resume.length !== idx) throw new Error(`Resume length mismatch: ${scratchpad.resume.length} !== ${idx}`);
    const v = scratchpad.consumeNullResume();
    scratchpad.resume.push(v);
    conf[CONFIG_KEY_SEND]?.([[RESUME$1, scratchpad.resume]]);
    return v;
  }
  const ns = conf[CONFIG_KEY_CHECKPOINT_NS]?.split("|");
  throw new GraphInterrupt([{
    id: ns ? XXH3(ns.join("|")) : void 0,
    value
  }]);
}
var RunnableCallable$1 = class RunnableCallable extends Runnable {
  lc_namespace = ["langgraph"];
  func;
  tags;
  config;
  trace = true;
  recurse = true;
  constructor(fields) {
    super();
    this.name = fields.name ?? fields.func.name;
    this.func = fields.func;
    this.config = fields.tags ? { tags: fields.tags } : void 0;
    this.trace = fields.trace ?? this.trace;
    this.recurse = fields.recurse ?? this.recurse;
  }
  async _tracedInvoke(input, config, runManager) {
    return new Promise((resolve, reject) => {
      const childConfig = patchConfig(config, { callbacks: runManager?.getChild() });
      AsyncLocalStorageProviderSingleton.runWithConfig(childConfig, async () => {
        try {
          resolve(await this.func(input, childConfig));
        } catch (e) {
          reject(e);
        }
      });
    });
  }
  async invoke(input, options) {
    let returnValue;
    const config = ensureLangGraphConfig(options);
    const mergedConfig = mergeConfigs(this.config, config);
    if (this.trace) returnValue = await this._callWithConfig(this._tracedInvoke, input, mergedConfig);
    else returnValue = await AsyncLocalStorageProviderSingleton.runWithConfig(mergedConfig, async () => this.func(input, mergedConfig));
    if (Runnable.isRunnable(returnValue) && this.recurse) return await AsyncLocalStorageProviderSingleton.runWithConfig(mergedConfig, async () => returnValue.invoke(input, mergedConfig));
    return returnValue;
  }
};
function* prefixGenerator(generator, prefix) {
  if (prefix === void 0) yield* generator;
  else for (const value of generator) yield [prefix, value];
}
async function gatherIterator(i) {
  const out = [];
  for await (const item of await i) out.push(item);
  return out;
}
function gatherIteratorSync(i) {
  const out = [];
  for (const item of i) out.push(item);
  return out;
}
function patchConfigurable$1(config, patch) {
  if (!config) return { configurable: patch };
  else if (!("configurable" in config)) return {
    ...config,
    configurable: patch
  };
  else return {
    ...config,
    configurable: {
      ...config.configurable,
      ...patch
    }
  };
}
function isAsyncGeneratorFunction(val) {
  return val != null && typeof val === "function" && val instanceof Object.getPrototypeOf(async function* () {
  }).constructor;
}
function isGeneratorFunction(val) {
  return val != null && typeof val === "function" && val instanceof Object.getPrototypeOf(function* () {
  }).constructor;
}
function _isSkipWrite(x) {
  return typeof x === "object" && x?.[/* @__PURE__ */ Symbol.for("LG_SKIP_WRITE")] !== void 0;
}
const PASSTHROUGH = { [/* @__PURE__ */ Symbol.for("LG_PASSTHROUGH")]: true };
function _isPassthrough(x) {
  return typeof x === "object" && x?.[/* @__PURE__ */ Symbol.for("LG_PASSTHROUGH")] !== void 0;
}
const IS_WRITER = /* @__PURE__ */ Symbol("IS_WRITER");
var ChannelWrite = class ChannelWrite2 extends RunnableCallable$1 {
  writes;
  constructor(writes, tags) {
    const name = `ChannelWrite<${writes.map((packet) => {
      if (_isSend(packet)) return packet.node;
      else if ("channel" in packet) return packet.channel;
      return "...";
    }).join(",")}>`;
    super({
      writes,
      name,
      tags,
      trace: false,
      func: async (input, config) => {
        return this._write(input, config ?? {});
      }
    });
    this.writes = writes;
  }
  async _write(input, config) {
    const writes = this.writes.map((write) => {
      if (_isChannelWriteTupleEntry(write) && _isPassthrough(write.value)) return {
        mapper: write.mapper,
        value: input
      };
      else if (_isChannelWriteEntry(write) && _isPassthrough(write.value)) return {
        channel: write.channel,
        value: input,
        skipNone: write.skipNone,
        mapper: write.mapper
      };
      else return write;
    });
    await ChannelWrite2.doWrite(config, writes);
    return input;
  }
  static async doWrite(config, writes) {
    for (const w of writes) {
      if (_isChannelWriteEntry(w)) {
        if (w.channel === "__pregel_tasks") throw new InvalidUpdateError("Cannot write to the reserved channel TASKS");
        if (_isPassthrough(w.value)) throw new InvalidUpdateError("PASSTHROUGH value must be replaced");
      }
      if (_isChannelWriteTupleEntry(w)) {
        if (_isPassthrough(w.value)) throw new InvalidUpdateError("PASSTHROUGH value must be replaced");
      }
    }
    const writeEntries = [];
    for (const w of writes) if (_isSend(w)) writeEntries.push([TASKS$1, w]);
    else if (_isChannelWriteTupleEntry(w)) {
      const mappedResult = await w.mapper.invoke(w.value, config);
      if (mappedResult != null && mappedResult.length > 0) writeEntries.push(...mappedResult);
    } else if (_isChannelWriteEntry(w)) {
      const mappedValue = w.mapper !== void 0 ? await w.mapper.invoke(w.value, config) : w.value;
      if (_isSkipWrite(mappedValue)) continue;
      if (w.skipNone && mappedValue === void 0) continue;
      writeEntries.push([w.channel, mappedValue]);
    } else throw new Error(`Invalid write entry: ${JSON.stringify(w)}`);
    const write = config.configurable?.[CONFIG_KEY_SEND];
    write(writeEntries);
  }
  static isWriter(runnable) {
    return runnable instanceof ChannelWrite2 || IS_WRITER in runnable && !!runnable[IS_WRITER];
  }
  static registerWriter(runnable) {
    return Object.defineProperty(runnable, IS_WRITER, { value: true });
  }
};
function _isChannelWriteEntry(x) {
  return x !== void 0 && typeof x.channel === "string";
}
function _isChannelWriteTupleEntry(x) {
  return x !== void 0 && !_isChannelWriteEntry(x) && Runnable.isRunnable(x.mapper);
}
var ChannelRead = class ChannelRead2 extends RunnableCallable$1 {
  lc_graph_name = "ChannelRead";
  channel;
  fresh = false;
  mapper;
  constructor(channel, mapper, fresh = false) {
    super({
      trace: false,
      func: (_, config) => ChannelRead2.doRead(config, this.channel, this.fresh, this.mapper)
    });
    this.fresh = fresh;
    this.mapper = mapper;
    this.channel = channel;
    this.name = Array.isArray(channel) ? `ChannelRead<${channel.join(",")}>` : `ChannelRead<${channel}>`;
  }
  static doRead(config, channel, fresh, mapper) {
    const read = config.configurable?.[CONFIG_KEY_READ];
    if (!read) throw new Error("Runnable is not configured with a read function. Make sure to call in the context of a Pregel process");
    if (mapper) return mapper(read(channel, fresh));
    else return read(channel, fresh);
  }
};
const defaultRunnableBound = /* @__PURE__ */ new RunnablePassthrough();
var PregelNode = class PregelNode2 extends RunnableBinding {
  lc_graph_name = "PregelNode";
  channels;
  triggers = [];
  mapper;
  writers = [];
  bound = defaultRunnableBound;
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
  constructor(fields) {
    const { channels, triggers, mapper, writers, bound, kwargs, metadata, retryPolicy, cachePolicy, timeout, tags, subgraphs, ends, isErrorHandler, errorHandlerNode } = fields;
    const mergedTags = [...fields.config?.tags ? fields.config.tags : [], ...tags ?? []];
    super({
      ...fields,
      bound: fields.bound ?? defaultRunnableBound,
      config: {
        ...fields.config ? fields.config : {},
        tags: mergedTags
      }
    });
    this.channels = channels;
    this.triggers = triggers;
    this.mapper = mapper;
    this.writers = writers ?? this.writers;
    this.bound = bound ?? this.bound;
    this.kwargs = kwargs ?? this.kwargs;
    this.metadata = metadata ?? this.metadata;
    this.tags = mergedTags;
    this.retryPolicy = retryPolicy;
    this.cachePolicy = cachePolicy;
    this.timeout = timeout;
    this.subgraphs = subgraphs;
    this.ends = ends;
    this.isErrorHandler = isErrorHandler;
    this.errorHandlerNode = errorHandlerNode;
  }
  getWriters() {
    const newWriters = [...this.writers];
    while (newWriters.length > 1 && newWriters[newWriters.length - 1] instanceof ChannelWrite && newWriters[newWriters.length - 2] instanceof ChannelWrite) {
      const endWriters = newWriters.slice(-2);
      const combinedWrites = endWriters[0].writes.concat(endWriters[1].writes);
      newWriters[newWriters.length - 2] = new ChannelWrite(combinedWrites, endWriters[0].config?.tags);
      newWriters.pop();
    }
    return newWriters;
  }
  getNode() {
    const writers = this.getWriters();
    if (this.bound === defaultRunnableBound && writers.length === 0) return;
    else if (this.bound === defaultRunnableBound && writers.length === 1) return writers[0];
    else if (this.bound === defaultRunnableBound) return new RunnableSequence({
      first: writers[0],
      middle: writers.slice(1, writers.length - 1),
      last: writers[writers.length - 1],
      omitSequenceTags: true
    });
    else if (writers.length > 0) return new RunnableSequence({
      first: this.bound,
      middle: writers.slice(0, writers.length - 1),
      last: writers[writers.length - 1],
      omitSequenceTags: true
    });
    else return this.bound;
  }
  join(channels) {
    if (!Array.isArray(channels)) throw new Error("channels must be a list");
    if (typeof this.channels !== "object") throw new Error("all channels must be named when using .join()");
    return new PregelNode2({
      channels: {
        ...this.channels,
        ...Object.fromEntries(channels.map((chan) => [chan, chan]))
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
  pipe(coerceable) {
    if (ChannelWrite.isWriter(coerceable)) return new PregelNode2({
      channels: this.channels,
      triggers: this.triggers,
      mapper: this.mapper,
      writers: [...this.writers, coerceable],
      bound: this.bound,
      config: this.config,
      kwargs: this.kwargs,
      retryPolicy: this.retryPolicy,
      cachePolicy: this.cachePolicy,
      timeout: this.timeout
    });
    else if (this.bound === defaultRunnableBound) return new PregelNode2({
      channels: this.channels,
      triggers: this.triggers,
      mapper: this.mapper,
      writers: this.writers,
      bound: _coerceToRunnable(coerceable),
      config: this.config,
      kwargs: this.kwargs,
      retryPolicy: this.retryPolicy,
      cachePolicy: this.cachePolicy,
      timeout: this.timeout
    });
    else return new PregelNode2({
      channels: this.channels,
      triggers: this.triggers,
      mapper: this.mapper,
      writers: this.writers,
      bound: this.bound.pipe(coerceable),
      config: this.config,
      kwargs: this.kwargs,
      retryPolicy: this.retryPolicy,
      cachePolicy: this.cachePolicy,
      timeout: this.timeout
    });
  }
};
function isRunnableSequence(x) {
  return "steps" in x && Array.isArray(x.steps);
}
function isPregelLike(x) {
  return "lg_is_pregel" in x && x.lg_is_pregel === true;
}
function findSubgraphPregel(candidate) {
  const candidates = [candidate];
  for (const candidate2 of candidates) if (isPregelLike(candidate2)) return candidate2;
  else if (isRunnableSequence(candidate2)) candidates.push(...candidate2.steps);
}
function readChannel(channels, chan, catchErrors = true, returnException = false) {
  try {
    return channels[chan].get();
  } catch (e) {
    if (e.name === EmptyChannelError.unminifiable_name) {
      if (returnException) return e;
      else if (catchErrors) return null;
    }
    throw e;
  }
}
function readChannels(channels, select, skipEmpty = true) {
  if (Array.isArray(select)) {
    const values = {};
    for (const k of select) try {
      values[k] = readChannel(channels, k, !skipEmpty);
    } catch (e) {
      if (e.name === EmptyChannelError.unminifiable_name) continue;
    }
    return values;
  } else return readChannel(channels, select);
}
function* mapCommand(cmd, pendingWrites) {
  if (cmd.graph === Command.PARENT) throw new InvalidUpdateError("There is no parent graph.");
  if (cmd.goto) {
    let sends;
    if (Array.isArray(cmd.goto)) sends = cmd.goto;
    else sends = [cmd.goto];
    for (const send of sends) if (_isSend(send)) yield [
      NULL_TASK_ID,
      TASKS$1,
      send
    ];
    else if (typeof send === "string") yield [
      NULL_TASK_ID,
      `branch:to:${send}`,
      "__start__"
    ];
    else throw new Error(`In Command.send, expected Send or string, got ${typeof send}`);
  }
  if (cmd.resume) if (typeof cmd.resume === "object" && Object.keys(cmd.resume).length && Object.keys(cmd.resume).every(isXXH3)) for (const [tid, resume] of Object.entries(cmd.resume)) {
    const existing = pendingWrites.filter((w) => w[0] === tid && w[1] === "__resume__").map((w) => w[2]).slice(0, 1) ?? [];
    existing.push(resume);
    yield [
      tid,
      RESUME$1,
      existing
    ];
  }
  else yield [
    NULL_TASK_ID,
    RESUME$1,
    cmd.resume
  ];
  if (cmd.update) {
    if (typeof cmd.update !== "object" || !cmd.update) throw new Error("Expected cmd.update to be a dict mapping channel names to update values");
    if (Array.isArray(cmd.update)) for (const [k, v] of cmd.update) yield [
      NULL_TASK_ID,
      k,
      v
    ];
    else for (const [k, v] of Object.entries(cmd.update)) yield [
      NULL_TASK_ID,
      k,
      v
    ];
  }
}
function* mapInput(inputChannels, chunk) {
  if (chunk !== void 0 && chunk !== null) if (Array.isArray(inputChannels) && typeof chunk === "object" && !Array.isArray(chunk)) {
    for (const k in chunk) if (inputChannels.includes(k)) yield [k, chunk[k]];
  } else if (Array.isArray(inputChannels)) throw new Error(`Input chunk must be an object when "inputChannels" is an array`);
  else yield [inputChannels, chunk];
}
function* mapOutputValues(outputChannels, pendingWrites, channels) {
  if (Array.isArray(outputChannels)) {
    if (pendingWrites === true || pendingWrites.find(([chan, _]) => outputChannels.includes(chan))) yield readChannels(channels, outputChannels);
  } else if (pendingWrites === true || pendingWrites.some(([chan, _]) => chan === outputChannels)) yield readChannel(channels, outputChannels);
}
function* mapOutputUpdates(outputChannels, tasks, cached) {
  const outputTasks = tasks.filter(([task2, ww]) => {
    return (task2.config === void 0 || !task2.config.tags?.includes("langsmith:hidden")) && ww[0][0] !== "__error__" && ww[0][0] !== "__interrupt__";
  });
  if (!outputTasks.length) return;
  let updated;
  if (outputTasks.some(([task2]) => task2.writes.some(([chan, _]) => chan === "__return__"))) updated = outputTasks.flatMap(([task2]) => task2.writes.filter(([chan, _]) => chan === RETURN).map(([_, value]) => [task2.name, value]));
  else if (!Array.isArray(outputChannels)) updated = outputTasks.flatMap(([task2]) => task2.writes.filter(([chan, _]) => chan === outputChannels).map(([_, value]) => [task2.name, value]));
  else updated = outputTasks.flatMap(([task2]) => {
    const { writes } = task2;
    const counts = {};
    for (const [chan] of writes) if (outputChannels.includes(chan)) counts[chan] = (counts[chan] || 0) + 1;
    if (Object.values(counts).some((count) => count > 1)) return writes.filter(([chan]) => outputChannels.includes(chan)).map(([chan, value]) => [task2.name, { [chan]: value }]);
    else return [[task2.name, Object.fromEntries(writes.filter(([chan]) => outputChannels.includes(chan)))]];
  });
  const grouped = {};
  for (const [node, value] of updated) {
    if (!(node in grouped)) grouped[node] = [];
    grouped[node].push(value);
  }
  const flattened = {};
  for (const node in grouped) if (grouped[node].length === 1) {
    const [write] = grouped[node];
    flattened[node] = write;
  } else flattened[node] = grouped[node];
  if (cached) flattened["__metadata__"] = { cached };
  yield flattened;
}
function getNullChannelVersion(currentVersions) {
  const startVersion = typeof currentVersions[START];
  if (startVersion === "number") return 0;
  if (startVersion === "string") return "";
  for (const key in currentVersions) {
    if (!Object.prototype.hasOwnProperty.call(currentVersions, key)) continue;
    const versionType = typeof currentVersions[key];
    if (versionType === "number") return 0;
    if (versionType === "string") return "";
    break;
  }
}
function getNewChannelVersions(previousVersions, currentVersions) {
  if (Object.keys(previousVersions).length > 0) {
    const nullVersion = getNullChannelVersion(currentVersions);
    return Object.fromEntries(Object.entries(currentVersions).filter(([k, v]) => v > (previousVersions[k] ?? nullVersion)));
  } else return currentVersions;
}
function _coerceToDict(value, defaultKey) {
  return value && !Array.isArray(value) && !(value instanceof Date) && typeof value === "object" ? value : { [defaultKey]: value };
}
function patchConfigurable(config, patch) {
  if (config === null) return { configurable: patch };
  else if (config?.configurable === void 0) return {
    ...config,
    configurable: patch
  };
  else return {
    ...config,
    configurable: {
      ...config.configurable,
      ...patch
    }
  };
}
function patchCheckpointMap(config, metadata) {
  const parents = metadata?.parents ?? {};
  if (Object.keys(parents).length > 0) return patchConfigurable(config, { [CONFIG_KEY_CHECKPOINT_MAP]: {
    ...parents,
    [config.configurable?.checkpoint_ns ?? ""]: config.configurable?.checkpoint_id
  } });
  else return config;
}
function combineAbortSignals(...x) {
  const signals = [...new Set(x.filter(Boolean))];
  if (signals.length === 0) return {
    signal: void 0,
    dispose: void 0
  };
  if (signals.length === 1) return {
    signal: signals[0],
    dispose: void 0
  };
  const combinedController = new AbortController();
  const listener = () => {
    const reason = signals.find((s) => s.aborted)?.reason;
    combinedController.abort(reason);
    signals.forEach((s) => s.removeEventListener("abort", listener));
  };
  signals.forEach((s) => s.addEventListener("abort", listener, { once: true }));
  const hasAlreadyAbortedSignal = signals.find((s) => s.aborted);
  if (hasAlreadyAbortedSignal) combinedController.abort(hasAlreadyAbortedSignal.reason);
  return {
    signal: combinedController.signal,
    dispose: () => {
      signals.forEach((s) => s.removeEventListener("abort", listener));
    }
  };
}
var Call = class {
  func;
  name;
  input;
  retry;
  cache;
  timeout;
  callbacks;
  __lg_type = "call";
  constructor({ func, name, input, retry, cache, timeout, callbacks }) {
    this.func = func;
    this.name = name;
    this.input = input;
    this.retry = retry;
    this.cache = cache;
    this.timeout = timeout;
    this.callbacks = callbacks;
  }
};
function isCall(value) {
  return typeof value === "object" && value !== null && "__lg_type" in value && value.__lg_type === "call";
}
function getRunnableForFunc(name, func) {
  return new RunnableSequence({
    name,
    first: new RunnableCallable$1({
      func: (input) => func(...input),
      name,
      trace: false,
      recurse: false
    }),
    last: new ChannelWrite([{
      channel: RETURN,
      value: PASSTHROUGH
    }], [TAG_HIDDEN])
  });
}
function getRunnableForEntrypoint(name, func) {
  return new RunnableCallable$1({
    func: (input, config) => {
      return func(input, config);
    },
    name,
    trace: false,
    recurse: false
  });
}
function call$1({ func, name, cache, retry, timeout }, ...args) {
  const config = AsyncLocalStorageProviderSingleton.getRunnableConfig();
  if (typeof config.configurable?.["__pregel_call"] === "function") return config.configurable[CONFIG_KEY_CALL](func, name, args, {
    retry,
    cache,
    timeout,
    callbacks: config.callbacks
  });
  throw new Error("Async local storage not initialized. Please call initializeAsyncLocalStorageSingleton() before using this function.");
}
const increment = (current) => {
  return current !== void 0 ? current + 1 : 1;
};
function triggersNextStep(updatedChannels, triggerToNodes) {
  if (triggerToNodes == null) return false;
  for (const chan of updatedChannels) if (triggerToNodes[chan]) return true;
  return false;
}
function maxChannelMapVersion(channelVersions) {
  let maxVersion;
  for (const chan in channelVersions) {
    if (!Object.prototype.hasOwnProperty.call(channelVersions, chan)) continue;
    if (maxVersion == null) maxVersion = channelVersions[chan];
    else maxVersion = maxChannelVersion(maxVersion, channelVersions[chan]);
  }
  return maxVersion;
}
function shouldInterrupt(checkpoint, interruptNodes, tasks) {
  const nullVersion = getNullChannelVersion(checkpoint.channel_versions);
  const seen = checkpoint.versions_seen["__interrupt__"] ?? {};
  let anyChannelUpdated = false;
  if ((checkpoint.channel_versions["__start__"] ?? nullVersion) > (seen["__start__"] ?? nullVersion)) anyChannelUpdated = true;
  else for (const chan in checkpoint.channel_versions) {
    if (!Object.prototype.hasOwnProperty.call(checkpoint.channel_versions, chan)) continue;
    if (checkpoint.channel_versions[chan] > (seen[chan] ?? nullVersion)) {
      anyChannelUpdated = true;
      break;
    }
  }
  const anyTriggeredNodeInInterruptNodes = tasks.some((task2) => interruptNodes === "*" ? !task2.config?.tags?.includes(TAG_HIDDEN) : interruptNodes.includes(task2.name));
  return anyChannelUpdated && anyTriggeredNodeInInterruptNodes;
}
function _localRead(checkpoint, channels, task2, select, fresh = false) {
  let updated = /* @__PURE__ */ new Set();
  if (!Array.isArray(select)) {
    for (const [c] of task2.writes) if (c === select) {
      updated = /* @__PURE__ */ new Set([c]);
      break;
    }
    updated = updated || /* @__PURE__ */ new Set();
  } else updated = new Set(select.filter((c) => task2.writes.some(([key, _]) => key === c)));
  let values;
  if (fresh && updated.size > 0) {
    const localChannels = Object.fromEntries(Object.entries(channels).filter(([k, _]) => updated.has(k)));
    const channelsToSnapshot = /* @__PURE__ */ new Set();
    for (const k in localChannels) {
      if (!Object.prototype.hasOwnProperty.call(localChannels, k)) continue;
      const ch = localChannels[k];
      if (isDeltaChannel$1(ch) && ch.isAvailable()) channelsToSnapshot.add(k);
    }
    const newCheckpoint = createCheckpoint(checkpoint, localChannels, -1, { channelsToSnapshot });
    const newChannels = emptyChannels(localChannels, newCheckpoint);
    _applyWrites(copyCheckpoint(newCheckpoint), newChannels, [task2], void 0, void 0);
    values = readChannels({
      ...channels,
      ...newChannels
    }, select);
  } else values = readChannels(channels, select);
  return values;
}
function _localWrite(commit, processes, writes) {
  for (const [chan, value] of writes) if (["__pregel_push", "__pregel_tasks"].includes(chan) && value != null) {
    if (!_isSend(value)) throw new InvalidUpdateError(`Invalid packet type, expected SendProtocol, got ${JSON.stringify(value)}`);
    if (!(value.node in processes)) throw new InvalidUpdateError(`Invalid node name "${value.node}" in Send packet`);
  }
  commit(writes);
}
const IGNORE = /* @__PURE__ */ new Set([
  NO_WRITES,
  PUSH,
  RESUME$1,
  INTERRUPT$1,
  RETURN,
  ERROR$1,
  ERROR_SOURCE_NODE
]);
const RESERVED_SET = new Set(RESERVED);
function _applyWrites(checkpoint, channels, tasks, getNextVersion, triggerToNodes) {
  const pathCache = /* @__PURE__ */ new Map();
  for (const task2 of tasks) pathCache.set(task2, task2.path?.slice(0, 3) || []);
  tasks.sort((a, b) => {
    const aPath = pathCache.get(a);
    const bPath = pathCache.get(b);
    for (let i = 0; i < Math.min(aPath.length, bPath.length); i += 1) {
      if (aPath[i] < bPath[i]) return -1;
      if (aPath[i] > bPath[i]) return 1;
    }
    return aPath.length - bPath.length;
  });
  const onlyChannels = getOnlyChannels(channels);
  let bumpStep = false;
  const channelsToConsume = /* @__PURE__ */ new Set();
  for (const task2 of tasks) {
    if (task2.triggers.length > 0) bumpStep = true;
    checkpoint.versions_seen[task2.name] ??= {};
    for (const chan of task2.triggers) {
      if (chan in checkpoint.channel_versions) checkpoint.versions_seen[task2.name][chan] = checkpoint.channel_versions[chan];
      if (!RESERVED_SET.has(chan)) channelsToConsume.add(chan);
    }
  }
  let maxVersion = maxChannelMapVersion(checkpoint.channel_versions);
  let usedNewVersion = false;
  for (const chan of channelsToConsume) if (chan in onlyChannels && onlyChannels[chan].consume()) {
    if (getNextVersion !== void 0) {
      checkpoint.channel_versions[chan] = getNextVersion(maxVersion);
      usedNewVersion = true;
    }
  }
  const pendingWritesByChannel = {};
  const pendingWriteTaskIdsByChannel = {};
  for (const task2 of tasks) {
    const taskId = task2.id ?? "";
    for (const [chan, val] of task2.writes) if (IGNORE.has(chan)) ;
    else if (chan in onlyChannels) {
      pendingWritesByChannel[chan] ??= [];
      pendingWritesByChannel[chan].push(val);
      pendingWriteTaskIdsByChannel[chan] ??= [];
      pendingWriteTaskIdsByChannel[chan].push(taskId);
    }
  }
  for (const [chan, vals] of Object.entries(pendingWritesByChannel)) {
    if (vals.length < 2) continue;
    if (onlyChannels[chan]?.lc_graph_name !== "DeltaChannel") continue;
    const taskIds = pendingWriteTaskIdsByChannel[chan];
    const paired = vals.map((val, i) => ({
      val,
      taskId: taskIds[i]
    }));
    paired.sort((a, b) => a.taskId < b.taskId ? -1 : a.taskId > b.taskId ? 1 : 0);
    pendingWritesByChannel[chan] = paired.map((p) => p.val);
  }
  if (maxVersion != null && getNextVersion != null) maxVersion = usedNewVersion ? getNextVersion(maxVersion) : maxVersion;
  const updatedChannels = /* @__PURE__ */ new Set();
  for (const [chan, vals] of Object.entries(pendingWritesByChannel)) if (chan in onlyChannels) {
    const channel = onlyChannels[chan];
    let updated;
    try {
      updated = channel.update(vals);
    } catch (e) {
      if (e.name === InvalidUpdateError.unminifiable_name) {
        const wrappedError = new InvalidUpdateError(`Invalid update for channel "${chan}" with values ${JSON.stringify(vals)}: ${e.message}`);
        wrappedError.lc_error_code = e.lc_error_code;
        throw wrappedError;
      } else throw e;
    }
    if (updated && getNextVersion !== void 0) {
      checkpoint.channel_versions[chan] = getNextVersion(maxVersion);
      if (channel.isAvailable()) updatedChannels.add(chan);
    }
  }
  if (bumpStep) for (const chan in onlyChannels) {
    if (!Object.prototype.hasOwnProperty.call(onlyChannels, chan)) continue;
    const channel = onlyChannels[chan];
    if (channel.isAvailable() && !updatedChannels.has(chan)) {
      if (channel.update([]) && getNextVersion !== void 0) {
        checkpoint.channel_versions[chan] = getNextVersion(maxVersion);
        if (channel.isAvailable()) updatedChannels.add(chan);
      }
    }
  }
  if (bumpStep && !triggersNextStep(updatedChannels, triggerToNodes)) for (const chan in onlyChannels) {
    if (!Object.prototype.hasOwnProperty.call(onlyChannels, chan)) continue;
    const channel = onlyChannels[chan];
    if (channel.finish() && getNextVersion !== void 0) {
      checkpoint.channel_versions[chan] = getNextVersion(maxVersion);
      if (channel.isAvailable()) updatedChannels.add(chan);
    }
  }
  return updatedChannels;
}
function* candidateNodes(checkpoint, processes, extra) {
  if (extra.updatedChannels != null && extra.triggerToNodes != null) {
    const triggeredNodes = /* @__PURE__ */ new Set();
    for (const channel of extra.updatedChannels) {
      const nodeIds = extra.triggerToNodes[channel];
      for (const id of nodeIds ?? []) triggeredNodes.add(id);
    }
    yield* [...triggeredNodes].sort();
    return;
  }
  if ((() => {
    for (const chan in checkpoint.channel_versions) if (checkpoint.channel_versions[chan] !== null) return false;
    return true;
  })()) return;
  for (const name in processes) {
    if (!Object.prototype.hasOwnProperty.call(processes, name)) continue;
    yield name;
  }
}
function _indexPendingWrites(pendingWrites) {
  let nullResume;
  const resumeByTaskId = /* @__PURE__ */ new Map();
  const successfulWriteTaskIds = /* @__PURE__ */ new Set();
  if (pendingWrites) for (const [tid, chan, val] of pendingWrites) {
    if (tid === "00000000-0000-0000-0000-000000000000" && chan === "__resume__" && nullResume === void 0) nullResume = val;
    if (chan === "__resume__" && tid !== "00000000-0000-0000-0000-000000000000") {
      let arr2 = resumeByTaskId.get(tid);
      if (!arr2) {
        arr2 = [];
        resumeByTaskId.set(tid, arr2);
      }
      arr2.push(val);
    }
    if (chan !== "__error__") successfulWriteTaskIds.add(tid);
  }
  return {
    nullResume,
    resumeByTaskId,
    successfulWriteTaskIds
  };
}
function _prepareNextTasks(checkpoint, pendingWrites, processes, channels, config, forExecution, extra) {
  const tasks = {};
  const indexedExtra = extra.pendingWritesIndex ? extra : {
    ...extra,
    pendingWritesIndex: _indexPendingWrites(pendingWrites)
  };
  const tasksChannel = channels[TASKS$1];
  if (tasksChannel?.isAvailable()) {
    const len = tasksChannel.get().length;
    for (let i = 0; i < len; i += 1) {
      const task2 = _prepareSingleTask([PUSH, i], checkpoint, pendingWrites, processes, channels, config, forExecution, indexedExtra);
      if (task2 !== void 0) tasks[task2.id] = task2;
    }
  }
  for (const name of candidateNodes(checkpoint, processes, indexedExtra)) {
    const task2 = _prepareSingleTask([PULL, name], checkpoint, pendingWrites, processes, channels, config, forExecution, indexedExtra);
    if (task2 !== void 0) tasks[task2.id] = task2;
  }
  return tasks;
}
function _prepareSingleTask(taskPath, checkpoint, pendingWrites, processes, channels, config, forExecution, extra) {
  const { step, checkpointer, manager } = extra;
  const configurable = config.configurable ?? {};
  const parentNamespace = configurable.checkpoint_ns ?? "";
  if (taskPath[0] === "__pregel_push" && isCall(taskPath[taskPath.length - 1])) {
    const call2 = taskPath[taskPath.length - 1];
    const proc = getRunnableForFunc(call2.name, call2.func);
    const triggers = [PUSH];
    const checkpointNamespace = parentNamespace === "" ? call2.name : `${parentNamespace}|${call2.name}`;
    const id = uuid5(JSON.stringify([
      checkpointNamespace,
      step.toString(),
      call2.name,
      PUSH,
      taskPath[1],
      taskPath[2]
    ]), checkpoint.id);
    const taskCheckpointNamespace = `${checkpointNamespace}:${id}`;
    const outputTaskPath = [...taskPath.slice(0, 3), true];
    const metadata = {
      langgraph_step: step,
      langgraph_node: call2.name,
      langgraph_triggers: triggers,
      langgraph_path: outputTaskPath,
      langgraph_checkpoint_ns: taskCheckpointNamespace,
      checkpoint_ns: taskCheckpointNamespace
    };
    if (forExecution) {
      const writes = [];
      const executionInfo = {
        checkpointId: checkpoint.id,
        checkpointNs: taskCheckpointNamespace,
        taskId: id,
        threadId: configurable.thread_id,
        runId: config.runId != null ? String(config.runId) : void 0,
        nodeAttempt: 1
      };
      return {
        name: call2.name,
        input: call2.input,
        proc,
        writes,
        config: {
          ...patchConfig(mergeConfigs(config, {
            metadata,
            store: extra.store ?? config.store
          }), {
            runName: call2.name,
            callbacks: manager?.getChild(`graph:step:${step}`),
            configurable: {
              [CONFIG_KEY_TASK_ID]: id,
              [CONFIG_KEY_SEND]: (writes_) => _localWrite((items) => writes.push(...items), processes, writes_),
              [CONFIG_KEY_READ]: (select_, fresh_ = false) => _localRead(checkpoint, channels, {
                name: call2.name,
                writes,
                triggers,
                path: outputTaskPath
              }, select_, fresh_),
              [CONFIG_KEY_CHECKPOINTER]: checkpointer ?? configurable["__pregel_checkpointer"],
              [CONFIG_KEY_CHECKPOINT_MAP]: {
                ...configurable[CONFIG_KEY_CHECKPOINT_MAP],
                [parentNamespace]: checkpoint.id
              },
              [CONFIG_KEY_SCRATCHPAD]: _scratchpad({
                pendingWrites: pendingWrites ?? [],
                taskId: id,
                currentTaskInput: call2.input,
                resumeMap: config.configurable?.[CONFIG_KEY_RESUME_MAP],
                namespaceHash: XXH3(taskCheckpointNamespace),
                pendingWritesIndex: extra.pendingWritesIndex
              }),
              [CONFIG_KEY_PREVIOUS_STATE]: checkpoint.channel_values[PREVIOUS],
              checkpoint_id: void 0,
              checkpoint_ns: taskCheckpointNamespace
            }
          }),
          executionInfo
        },
        triggers,
        retry_policy: call2.retry,
        cache_key: call2.cache ? {
          key: XXH3((call2.cache.keyFunc ?? JSON.stringify)([call2.input])),
          ns: [CACHE_NS_WRITES, call2.name ?? "__dynamic__"],
          ttl: call2.cache.ttl
        } : void 0,
        id,
        path: outputTaskPath,
        writers: [],
        timeout: call2.timeout
      };
    } else return {
      id,
      name: call2.name,
      interrupts: [],
      path: outputTaskPath
    };
  } else if (taskPath[0] === "__pregel_push") {
    const index2 = typeof taskPath[1] === "number" ? taskPath[1] : parseInt(taskPath[1], 10);
    if (!channels["__pregel_tasks"]?.isAvailable()) return;
    const sends = channels[TASKS$1].get();
    if (index2 < 0 || index2 >= sends.length) return;
    const packet = _isSendInterface(sends[index2]) && !_isSend(sends[index2]) ? new Send(sends[index2].node, sends[index2].args, sends[index2].timeout !== void 0 ? { timeout: sends[index2].timeout } : void 0) : sends[index2];
    if (!_isSendInterface(packet)) {
      console.warn(`Ignoring invalid packet ${JSON.stringify(packet)} in pending sends.`);
      return;
    }
    if (!(packet.node in processes)) {
      console.warn(`Ignoring unknown node name ${packet.node} in pending sends.`);
      return;
    }
    const triggers = [PUSH];
    const checkpointNamespace = parentNamespace === "" ? packet.node : `${parentNamespace}|${packet.node}`;
    const taskId = uuid5(JSON.stringify([
      checkpointNamespace,
      step.toString(),
      packet.node,
      PUSH,
      index2.toString()
    ]), checkpoint.id);
    const taskCheckpointNamespace = `${checkpointNamespace}:${taskId}`;
    let metadata = {
      langgraph_step: step,
      langgraph_node: packet.node,
      langgraph_triggers: triggers,
      langgraph_path: taskPath.slice(0, 3),
      langgraph_checkpoint_ns: taskCheckpointNamespace,
      checkpoint_ns: taskCheckpointNamespace
    };
    if (forExecution) {
      const proc = processes[packet.node];
      const node = proc.getNode();
      if (node !== void 0) {
        if (proc.metadata !== void 0) metadata = {
          ...metadata,
          ...proc.metadata
        };
        const writes = [];
        const executionInfo = {
          checkpointId: checkpoint.id,
          checkpointNs: taskCheckpointNamespace,
          taskId,
          threadId: configurable.thread_id,
          runId: config.runId != null ? String(config.runId) : void 0,
          nodeAttempt: 1
        };
        return {
          name: packet.node,
          input: packet.args,
          proc: node,
          subgraphs: proc.subgraphs,
          writes,
          config: {
            ...patchConfig(mergeConfigs(config, {
              metadata,
              tags: proc.tags,
              store: extra.store ?? config.store
            }), {
              runName: packet.node,
              callbacks: manager?.getChild(`graph:step:${step}`),
              configurable: {
                [CONFIG_KEY_TASK_ID]: taskId,
                [CONFIG_KEY_SEND]: (writes_) => _localWrite((items) => writes.push(...items), processes, writes_),
                [CONFIG_KEY_READ]: (select_, fresh_ = false) => _localRead(checkpoint, channels, {
                  name: packet.node,
                  writes,
                  triggers,
                  path: taskPath
                }, select_, fresh_),
                [CONFIG_KEY_CHECKPOINTER]: checkpointer ?? configurable["__pregel_checkpointer"],
                [CONFIG_KEY_CHECKPOINT_MAP]: {
                  ...configurable[CONFIG_KEY_CHECKPOINT_MAP],
                  [parentNamespace]: checkpoint.id
                },
                [CONFIG_KEY_SCRATCHPAD]: _scratchpad({
                  pendingWrites: pendingWrites ?? [],
                  taskId,
                  currentTaskInput: packet.args,
                  resumeMap: config.configurable?.[CONFIG_KEY_RESUME_MAP],
                  namespaceHash: XXH3(taskCheckpointNamespace),
                  pendingWritesIndex: extra.pendingWritesIndex
                }),
                [CONFIG_KEY_PREVIOUS_STATE]: checkpoint.channel_values[PREVIOUS],
                checkpoint_id: void 0,
                checkpoint_ns: taskCheckpointNamespace
              }
            }),
            executionInfo
          },
          triggers,
          retry_policy: proc.retryPolicy,
          cache_key: proc.cachePolicy ? {
            key: XXH3((proc.cachePolicy.keyFunc ?? JSON.stringify)([packet.args])),
            ns: [
              CACHE_NS_WRITES,
              proc.name ?? "__dynamic__",
              packet.node
            ],
            ttl: proc.cachePolicy.ttl
          } : void 0,
          id: taskId,
          path: taskPath,
          writers: proc.getWriters(),
          timeout: packet.timeout ?? proc.timeout
        };
      }
    } else return {
      id: taskId,
      name: packet.node,
      interrupts: [],
      path: taskPath
    };
  } else if (taskPath[0] === "__pregel_pull") {
    const name = taskPath[1].toString();
    const proc = processes[name];
    if (proc === void 0) return;
    if (pendingWrites?.length) {
      const checkpointNamespace = parentNamespace === "" ? name : `${parentNamespace}|${name}`;
      const taskId = uuid5(JSON.stringify([
        checkpointNamespace,
        step.toString(),
        name,
        PULL,
        name
      ]), checkpoint.id);
      if (extra.pendingWritesIndex ? extra.pendingWritesIndex.successfulWriteTaskIds.has(taskId) : pendingWrites.some((w) => w[0] === taskId && w[1] !== "__error__")) return;
    }
    const nullVersion = getNullChannelVersion(checkpoint.channel_versions);
    if (nullVersion === void 0) return;
    const seen = checkpoint.versions_seen[name] ?? {};
    const trigger = proc.triggers.find((chan) => {
      if (!channels[chan].isAvailable()) return false;
      return (checkpoint.channel_versions[chan] ?? nullVersion) > (seen[chan] ?? nullVersion);
    });
    if (trigger !== void 0) {
      const val = _procInput(proc, channels, forExecution);
      if (val === void 0) return;
      const checkpointNamespace = parentNamespace === "" ? name : `${parentNamespace}|${name}`;
      const taskId = uuid5(JSON.stringify([
        checkpointNamespace,
        step.toString(),
        name,
        PULL,
        [trigger]
      ]), checkpoint.id);
      const taskCheckpointNamespace = `${checkpointNamespace}:${taskId}`;
      let metadata = {
        langgraph_step: step,
        langgraph_node: name,
        langgraph_triggers: [trigger],
        langgraph_path: taskPath,
        langgraph_checkpoint_ns: taskCheckpointNamespace,
        checkpoint_ns: taskCheckpointNamespace
      };
      if (forExecution) {
        const node = proc.getNode();
        if (node !== void 0) {
          if (proc.metadata !== void 0) metadata = {
            ...metadata,
            ...proc.metadata
          };
          const writes = [];
          const executionInfo = {
            checkpointId: checkpoint.id,
            checkpointNs: taskCheckpointNamespace,
            taskId,
            threadId: configurable.thread_id,
            runId: config.runId != null ? String(config.runId) : void 0,
            nodeAttempt: 1
          };
          return {
            name,
            input: val,
            proc: node,
            subgraphs: proc.subgraphs,
            writes,
            config: {
              ...patchConfig(mergeConfigs(config, {
                metadata,
                tags: proc.tags,
                store: extra.store ?? config.store
              }), {
                runName: name,
                callbacks: manager?.getChild(`graph:step:${step}`),
                configurable: {
                  [CONFIG_KEY_TASK_ID]: taskId,
                  [CONFIG_KEY_SEND]: (writes_) => _localWrite((items) => {
                    writes.push(...items);
                  }, processes, writes_),
                  [CONFIG_KEY_READ]: (select_, fresh_ = false) => _localRead(checkpoint, channels, {
                    name,
                    writes,
                    triggers: [trigger],
                    path: taskPath
                  }, select_, fresh_),
                  [CONFIG_KEY_CHECKPOINTER]: checkpointer ?? configurable["__pregel_checkpointer"],
                  [CONFIG_KEY_CHECKPOINT_MAP]: {
                    ...configurable[CONFIG_KEY_CHECKPOINT_MAP],
                    [parentNamespace]: checkpoint.id
                  },
                  [CONFIG_KEY_SCRATCHPAD]: _scratchpad({
                    pendingWrites: pendingWrites ?? [],
                    taskId,
                    currentTaskInput: val,
                    resumeMap: config.configurable?.[CONFIG_KEY_RESUME_MAP],
                    namespaceHash: XXH3(taskCheckpointNamespace),
                    pendingWritesIndex: extra.pendingWritesIndex
                  }),
                  [CONFIG_KEY_PREVIOUS_STATE]: checkpoint.channel_values[PREVIOUS],
                  checkpoint_id: void 0,
                  checkpoint_ns: taskCheckpointNamespace
                }
              }),
              executionInfo
            },
            triggers: [trigger],
            retry_policy: proc.retryPolicy,
            cache_key: proc.cachePolicy ? {
              key: XXH3((proc.cachePolicy.keyFunc ?? JSON.stringify)([val])),
              ns: [
                CACHE_NS_WRITES,
                proc.name ?? "__dynamic__",
                name
              ],
              ttl: proc.cachePolicy.ttl
            } : void 0,
            id: taskId,
            path: taskPath,
            writers: proc.getWriters(),
            timeout: proc.timeout
          };
        }
      } else return {
        id: taskId,
        name,
        interrupts: [],
        path: taskPath
      };
    }
  }
}
function _prepareNodeErrorHandlerTask(failedTask, handlerNodeName, error, checkpoint, pendingWrites, processes, channels, config, extra) {
  const { step, checkpointer, manager } = extra;
  const proc = processes[handlerNodeName];
  if (proc === void 0) return;
  const node = proc.getNode();
  if (node === void 0) return;
  const configurable = config.configurable ?? {};
  const parentNamespace = configurable.checkpoint_ns ?? "";
  const triggers = [PUSH];
  const checkpointNamespace = parentNamespace === "" ? handlerNodeName : `${parentNamespace}|${handlerNodeName}`;
  const taskId = uuid5(JSON.stringify([
    checkpointNamespace,
    step.toString(),
    handlerNodeName,
    PUSH,
    "node_error_handler",
    failedTask.id
  ]), checkpoint.id);
  const taskCheckpointNamespace = `${checkpointNamespace}:${taskId}`;
  const taskPath = [
    PUSH,
    String(failedTask.name),
    handlerNodeName,
    false
  ];
  let metadata = {
    langgraph_step: step,
    langgraph_node: handlerNodeName,
    langgraph_triggers: triggers,
    langgraph_path: taskPath,
    langgraph_checkpoint_ns: taskCheckpointNamespace,
    checkpoint_ns: taskCheckpointNamespace
  };
  if (proc.metadata !== void 0) metadata = {
    ...metadata,
    ...proc.metadata
  };
  const writes = [];
  const executionInfo = {
    checkpointId: checkpoint.id,
    checkpointNs: taskCheckpointNamespace,
    taskId,
    threadId: configurable.thread_id,
    runId: config.runId != null ? String(config.runId) : void 0,
    nodeAttempt: 1
  };
  return {
    name: handlerNodeName,
    input: failedTask.input,
    proc: node,
    subgraphs: proc.subgraphs,
    writes,
    config: {
      ...patchConfig(mergeConfigs(config, {
        metadata,
        tags: proc.tags,
        store: extra.store ?? config.store
      }), {
        runName: handlerNodeName,
        callbacks: manager?.getChild(`graph:step:${step}`),
        configurable: {
          [CONFIG_KEY_TASK_ID]: taskId,
          [CONFIG_KEY_SEND]: (writes_) => _localWrite((items) => writes.push(...items), processes, writes_),
          [CONFIG_KEY_READ]: (select_, fresh_ = false) => _localRead(checkpoint, channels, {
            name: handlerNodeName,
            writes,
            triggers,
            path: taskPath
          }, select_, fresh_),
          [CONFIG_KEY_CHECKPOINTER]: checkpointer ?? configurable["__pregel_checkpointer"],
          [CONFIG_KEY_CHECKPOINT_MAP]: {
            ...configurable[CONFIG_KEY_CHECKPOINT_MAP],
            [parentNamespace]: checkpoint.id
          },
          [CONFIG_KEY_SCRATCHPAD]: _scratchpad({
            pendingWrites: pendingWrites ?? [],
            taskId,
            currentTaskInput: failedTask.input,
            resumeMap: config.configurable?.[CONFIG_KEY_RESUME_MAP],
            namespaceHash: XXH3(taskCheckpointNamespace)
          }),
          [CONFIG_KEY_PREVIOUS_STATE]: checkpoint.channel_values[PREVIOUS],
          [CONFIG_KEY_NODE_ERROR]: new NodeError(String(failedTask.name), error),
          checkpoint_id: void 0,
          checkpoint_ns: taskCheckpointNamespace
        }
      }),
      executionInfo
    },
    triggers,
    retry_policy: proc.retryPolicy,
    cache_key: void 0,
    id: taskId,
    path: taskPath,
    writers: proc.getWriters()
  };
}
function _procInput(proc, channels, forExecution) {
  let val;
  if (typeof proc.channels === "object" && !Array.isArray(proc.channels)) {
    val = {};
    for (const [k, chan] of Object.entries(proc.channels)) if (proc.triggers.includes(chan)) try {
      val[k] = readChannel(channels, chan, false);
    } catch (e) {
      if (e.name === EmptyChannelError.unminifiable_name) return;
      else throw e;
    }
    else if (chan in channels) try {
      val[k] = readChannel(channels, chan, false);
    } catch (e) {
      if (e.name === EmptyChannelError.unminifiable_name) continue;
      else throw e;
    }
  } else if (Array.isArray(proc.channels)) {
    let successfulRead = false;
    for (const chan of proc.channels) try {
      val = readChannel(channels, chan, false);
      successfulRead = true;
      break;
    } catch (e) {
      if (e.name === EmptyChannelError.unminifiable_name) continue;
      else throw e;
    }
    if (!successfulRead) return;
  } else throw new Error(`Invalid channels type, expected list or dict, got ${proc.channels}`);
  if (forExecution && proc.mapper !== void 0) val = proc.mapper(val);
  return val;
}
function sanitizeUntrackedValuesInSend(packet, channels) {
  if (typeof packet.args !== "object" || packet.args === null) return packet;
  const sanitizedArg = {};
  for (const [key, value] of Object.entries(packet.args)) {
    const channel = channels[key];
    if (!channel || channel.lc_graph_name !== "UntrackedValue") sanitizedArg[key] = value;
  }
  return new Send(packet.node, sanitizedArg);
}
function _scratchpad({ pendingWrites, taskId, currentTaskInput, resumeMap, namespaceHash, pendingWritesIndex }) {
  const nullResume = pendingWritesIndex ? pendingWritesIndex.nullResume : pendingWrites.find(([writeTaskId, chan]) => writeTaskId === "00000000-0000-0000-0000-000000000000" && chan === "__resume__")?.[2];
  const scratchpad = {
    callCounter: 0,
    interruptCounter: -1,
    resume: (() => {
      const result = pendingWritesIndex ? (pendingWritesIndex.resumeByTaskId.get(taskId) ?? []).flat() : pendingWrites.filter(([writeTaskId, chan]) => writeTaskId === taskId && chan === "__resume__").flatMap(([_writeTaskId, _chan, resume]) => resume);
      if (resumeMap != null && namespaceHash in resumeMap) {
        const mappedResume = resumeMap[namespaceHash];
        result.push(mappedResume);
      }
      return result;
    })(),
    nullResume,
    subgraphCounter: 0,
    currentTaskInput,
    consumeNullResume: () => {
      if (scratchpad.nullResume) {
        delete scratchpad.nullResume;
        pendingWrites.splice(pendingWrites.findIndex(([writeTaskId, chan]) => writeTaskId === "00000000-0000-0000-0000-000000000000" && chan === "__resume__"), 1);
        return nullResume;
      }
    }
  };
  return scratchpad;
}
const COLORS_MAP = {
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
};
const wrap = (color, text) => `${color.start}${text}${color.end}`;
function buildTaskMetadata(config) {
  if (config == null) return void 0;
  const metadata = {};
  if (config.metadata != null) {
    for (const [key, value] of Object.entries(config.metadata)) if (!EXCLUDED_METADATA_KEYS.has(key)) metadata[key] = value;
  }
  const filteredTags = filterToUserTags(config.tags);
  if (filteredTags != null) metadata.tags = filteredTags;
  return Object.keys(metadata).length > 0 ? metadata : void 0;
}
function* mapDebugTasks(tasks) {
  for (const { id, name, input, config, triggers, writes } of tasks) {
    if (config?.tags?.includes("langsmith:hidden")) continue;
    const payload = {
      id,
      name,
      input,
      triggers,
      interrupts: writes.filter(([writeId, n2]) => {
        return writeId === id && n2 === "__interrupt__";
      }).map(([, v]) => {
        return v;
      })
    };
    const metadata = buildTaskMetadata(config);
    if (metadata != null) payload.metadata = metadata;
    yield payload;
  }
}
function isMultipleChannelWrite(value) {
  if (typeof value !== "object" || value === null) return false;
  return "$writes" in value && Array.isArray(value.$writes);
}
function mapTaskResultWrites(writes) {
  const result = {};
  for (const [channel, value] of writes) {
    const strChannel = String(channel);
    if (strChannel in result) {
      const channelWrites = isMultipleChannelWrite(result[strChannel]) ? result[strChannel].$writes : [result[strChannel]];
      channelWrites.push(value);
      result[strChannel] = { $writes: channelWrites };
    } else result[strChannel] = value;
  }
  return result;
}
function* mapDebugTaskResults(tasks, streamChannels) {
  for (const [{ id, name, config }, writes] of tasks) {
    if (config?.tags?.includes("langsmith:hidden")) continue;
    yield {
      id,
      name,
      result: mapTaskResultWrites(writes.filter(([channel]) => {
        return Array.isArray(streamChannels) ? streamChannels.includes(channel) : channel === streamChannels;
      })),
      interrupts: writes.filter((w) => w[0] === INTERRUPT$1).map((w) => w[1])
    };
  }
}
function* mapDebugCheckpoint(config, channels, streamChannels, metadata, tasks, pendingWrites, parentConfig, outputKeys) {
  function formatConfig(config2) {
    const pyConfig = {};
    if (config2.callbacks != null) pyConfig.callbacks = config2.callbacks;
    if (config2.configurable != null) pyConfig.configurable = config2.configurable;
    if (config2.maxConcurrency != null) pyConfig.max_concurrency = config2.maxConcurrency;
    if (config2.metadata != null) pyConfig.metadata = config2.metadata;
    if (config2.recursionLimit != null) pyConfig.recursion_limit = config2.recursionLimit;
    if (config2.runId != null) pyConfig.run_id = config2.runId;
    if (config2.runName != null) pyConfig.run_name = config2.runName;
    if (config2.tags != null) pyConfig.tags = config2.tags;
    return pyConfig;
  }
  const parentNs = config.configurable?.checkpoint_ns;
  const taskStates = {};
  for (const task2 of tasks) {
    if (!(task2.subgraphs?.length ? task2.subgraphs : [task2.proc]).find(findSubgraphPregel)) continue;
    let taskNs = `${task2.name}:${task2.id}`;
    if (parentNs) taskNs = `${parentNs}|${taskNs}`;
    taskStates[task2.id] = { configurable: {
      thread_id: config.configurable?.thread_id,
      checkpoint_ns: taskNs
    } };
  }
  yield {
    config: formatConfig(config),
    values: readChannels(channels, streamChannels),
    metadata,
    next: tasks.map((task2) => task2.name),
    tasks: tasksWithWrites(tasks, pendingWrites, taskStates, outputKeys),
    parentConfig: parentConfig ? formatConfig(parentConfig) : void 0
  };
}
function tasksWithWrites(tasks, pendingWrites, states, outputKeys) {
  return tasks.map((task2) => {
    const error = pendingWrites.find(([id, n2]) => id === task2.id && n2 === "__error__")?.[2];
    const interrupts = pendingWrites.filter(([id, n2]) => id === task2.id && n2 === "__interrupt__").map(([, , v]) => v);
    const result = (() => {
      if (error || interrupts.length || !pendingWrites.length) return void 0;
      const idx = pendingWrites.findIndex(([tid, n2]) => tid === task2.id && n2 === "__return__");
      if (idx >= 0) return pendingWrites[idx][2];
      if (typeof outputKeys === "string") return pendingWrites.find(([tid, n2]) => tid === task2.id && n2 === outputKeys)?.[2];
      if (Array.isArray(outputKeys)) {
        const results = pendingWrites.filter(([tid, n2]) => tid === task2.id && outputKeys.includes(n2)).map(([, n2, v]) => [n2, v]);
        if (!results.length) return void 0;
        return mapTaskResultWrites(results);
      }
    })();
    if (error) return {
      id: task2.id,
      name: task2.name,
      path: task2.path,
      error,
      interrupts,
      result
    };
    const taskState = states?.[task2.id];
    return {
      id: task2.id,
      name: task2.name,
      path: task2.path,
      interrupts,
      ...taskState !== void 0 ? { state: taskState } : {},
      result
    };
  });
}
function printStepCheckpoint(step, channels, whitelist) {
  console.log([
    `${wrap(COLORS_MAP.blue, `[${step}:checkpoint]`)}`,
    `\x1B[1m State at the end of step ${step}:\x1B[0m
`,
    JSON.stringify(readChannels(channels, whitelist), null, 2)
  ].join(""));
}
function printStepTasks(step, nextTasks) {
  const nTasks = nextTasks.length;
  console.log([
    `${wrap(COLORS_MAP.blue, `[${step}:tasks]`)}`,
    `\x1B[1m Starting step ${step} with ${nTasks} task${nTasks === 1 ? "" : "s"}:\x1B[0m
`,
    nextTasks.map((task2) => `- ${wrap(COLORS_MAP.green, String(task2.name))} -> ${JSON.stringify(task2.input, null, 2)}`).join("\n")
  ].join(""));
}
function printStepWrites(step, writes, whitelist) {
  const byChannel = {};
  for (const [channel, value] of writes) if (whitelist.includes(channel)) {
    if (!byChannel[channel]) byChannel[channel] = [];
    byChannel[channel].push(value);
  }
  console.log([
    `${wrap(COLORS_MAP.blue, `[${step}:writes]`)}`,
    `\x1B[1m Finished step ${step} with writes to ${Object.keys(byChannel).length} channel${Object.keys(byChannel).length !== 1 ? "s" : ""}:\x1B[0m
`,
    Object.entries(byChannel).map(([name, vals]) => `- ${wrap(COLORS_MAP.yellow, name)} -> ${vals.map((v) => JSON.stringify(v)).join(", ")}`).join("\n")
  ].join(""));
}
var IterableReadableStreamWithAbortSignal = class extends IterableReadableStream {
  _abortController;
  _innerReader;
  /**
  * @param readableStream - The stream to wrap.
  * @param abortController - The abort controller to use. Optional. One will be created if not provided.
  */
  constructor(readableStream, abortController) {
    const reader = readableStream.getReader();
    const ac = abortController ?? new AbortController();
    super({ start(controller) {
      return pump2();
      function pump2() {
        return reader.read().then(({ done, value }) => {
          if (done) {
            controller.close();
            return;
          }
          controller.enqueue(value);
          return pump2();
        });
      }
    } });
    this._abortController = ac;
    this._innerReader = reader;
  }
  /**
  * Aborts the stream, abandoning any pending operations in progress. Calling this triggers an
  * {@link AbortSignal} that is propagated to the tasks that are producing the data for this stream.
  * @param reason - The reason for aborting the stream. Optional.
  */
  async cancel(reason) {
    this._abortController.abort(reason);
    this._innerReader.releaseLock();
  }
  /**
  * The {@link AbortSignal} for the stream. Aborted when {@link cancel} is called.
  */
  get signal() {
    return this._abortController.signal;
  }
};
var IterableReadableWritableStream = class extends IterableReadableStream {
  modes;
  controller;
  passthroughFn;
  _closed = false;
  get closed() {
    return this._closed;
  }
  constructor(params) {
    let streamControllerPromiseResolver;
    const streamControllerPromise = new Promise((resolve) => {
      streamControllerPromiseResolver = resolve;
    });
    super({ start: (controller) => {
      streamControllerPromiseResolver(controller);
    } });
    streamControllerPromise.then((controller) => {
      this.controller = controller;
    });
    this.passthroughFn = params.passthroughFn;
    this.modes = params.modes;
  }
  push(chunk) {
    if (this._closed || !this.controller) return;
    this.passthroughFn?.(chunk);
    this.controller.enqueue(chunk);
  }
  close() {
    try {
      this.controller.close();
    } catch {
    } finally {
      this._closed = true;
    }
  }
  error(e) {
    try {
      this.controller?.error(e);
    } finally {
      this._closed = true;
    }
  }
};
var StreamToolsHandler = class extends BaseCallbackHandler {
  name = "StreamToolsHandler";
  /** Ensure tool lifecycle callbacks run before tool.invoke returns/errors. */
  awaitHandlers = true;
  streamFn;
  runs = {};
  constructor(streamFn) {
    super();
    this.streamFn = streamFn;
  }
  handleToolStart(_tool, input, runId, _parentRunId, tags, metadata, runName, toolCallId) {
    if (!metadata || tags && tags.includes("langsmith:hidden")) return;
    const ns = metadata.langgraph_checkpoint_ns?.split("|") ?? [];
    const info = {
      ns,
      toolCallId,
      toolName: runName ?? "unknown",
      input
    };
    this.runs[runId] = info;
    this.streamFn([
      ns,
      "tools",
      {
        event: "on_tool_start",
        toolCallId: info.toolCallId,
        name: info.toolName,
        input
      }
    ]);
  }
  handleToolEvent(chunk, runId) {
    const info = this.runs[runId];
    if (!info) return;
    this.streamFn([
      info.ns,
      "tools",
      {
        event: "on_tool_event",
        toolCallId: info.toolCallId,
        name: info.toolName,
        data: chunk
      }
    ]);
  }
  handleToolEnd(output, runId) {
    const info = this.runs[runId];
    delete this.runs[runId];
    if (!info) return;
    this.streamFn([
      info.ns,
      "tools",
      {
        event: "on_tool_end",
        toolCallId: info.toolCallId,
        name: info.toolName,
        output
      }
    ]);
  }
  handleToolError(err, runId) {
    const info = this.runs[runId];
    delete this.runs[runId];
    if (!info) return;
    this.streamFn([
      info.ns,
      "tools",
      {
        event: "on_tool_error",
        toolCallId: info.toolCallId,
        name: info.toolName,
        error: err
      }
    ]);
  }
};
function _stringifyAsDict(obj) {
  return JSON.stringify(obj, function(key, value) {
    const rawValue2 = this[key];
    if (rawValue2 != null && typeof rawValue2 === "object" && "toDict" in rawValue2 && typeof rawValue2.toDict === "function") {
      const { type, data } = rawValue2.toDict();
      return {
        ...data,
        type
      };
    }
    return value;
  });
}
function _serializeError(error) {
  if (error instanceof Error) return {
    error: error.name,
    message: error.message
  };
  return {
    error: "Error",
    message: JSON.stringify(error)
  };
}
function _isRunnableConfig(config) {
  if (typeof config !== "object" || config == null) return false;
  return "configurable" in config && typeof config.configurable === "object" && config.configurable != null;
}
function _extractCheckpointFromConfig(config) {
  if (!_isRunnableConfig(config) || !config.configurable.thread_id) return null;
  return {
    thread_id: config.configurable.thread_id,
    checkpoint_ns: config.configurable.checkpoint_ns || "",
    checkpoint_id: config.configurable.checkpoint_id || null,
    checkpoint_map: config.configurable.checkpoint_map || null
  };
}
function _serializeConfig(config) {
  if (_isRunnableConfig(config)) {
    const configurable = Object.fromEntries(Object.entries(config.configurable).filter(([key]) => !key.startsWith("__")));
    const newConfig = {
      ...config,
      configurable
    };
    delete newConfig.callbacks;
    return newConfig;
  }
  return config;
}
function _serializeCheckpoint(payload) {
  const result = {
    ...payload,
    checkpoint: _extractCheckpointFromConfig(payload.config),
    parent_checkpoint: _extractCheckpointFromConfig(payload.parentConfig),
    config: _serializeConfig(payload.config),
    parent_config: _serializeConfig(payload.parentConfig),
    tasks: payload.tasks.map((task2) => {
      if (_isRunnableConfig(task2.state)) {
        const checkpoint = _extractCheckpointFromConfig(task2.state);
        if (checkpoint != null) {
          const cloneTask = {
            ...task2,
            checkpoint
          };
          delete cloneTask.state;
          return cloneTask;
        }
      }
      return task2;
    })
  };
  delete result.parentConfig;
  return result;
}
function toEventStream(stream) {
  const encoder = new TextEncoder();
  return new ReadableStream({ async start(controller) {
    const enqueueChunk = (sse) => {
      controller.enqueue(encoder.encode(`event: ${sse.event}
data: ${_stringifyAsDict(sse.data)}

`));
    };
    try {
      for await (const payload of stream) {
        const [ns, mode, chunk] = payload;
        let data = chunk;
        if (mode === "debug") {
          const debugChunk = chunk;
          if (debugChunk.type === "checkpoint") data = {
            ...debugChunk,
            payload: _serializeCheckpoint(debugChunk.payload)
          };
        }
        if (mode === "checkpoints") data = _serializeCheckpoint(chunk);
        enqueueChunk({
          event: ns?.length ? `${mode}|${ns.join("|")}` : mode,
          data
        });
      }
    } catch (error) {
      enqueueChunk({
        event: "error",
        data: _serializeError(error)
      });
    }
    controller.close();
  } });
}
function createDuplexStream(...streams) {
  return new IterableReadableWritableStream({
    passthroughFn: (value) => {
      const isEnvelope = value[1] === "checkpoints" && isCheckpointEnvelope(value[2]);
      for (const stream of streams) if (stream.modes.has(value[1]) || isEnvelope) stream.push(value);
    },
    modes: new Set(streams.flatMap((s) => Array.from(s.modes)))
  });
}
var ReplayState = class {
  /** Parent checkpoint ID used as the `before` cursor for subgraph lookups. */
  checkpointId;
  #visitedNs = /* @__PURE__ */ new Set();
  /**
  * @param checkpointId - Checkpoint ID from the parent graph at the replay point.
  */
  constructor(checkpointId) {
    this.checkpointId = checkpointId;
  }
  /**
  * Whether this is the first visit to a logical subgraph namespace in the run.
  *
  * Task-id suffixes are stripped so the same subgraph invoked across loop
  * iterations shares one visit record.
  *
  * @param checkpointNs - Subgraph checkpoint namespace.
  */
  #isFirstVisit(checkpointNs) {
    const stableNs = checkpointNs.includes(":") ? checkpointNs.slice(0, checkpointNs.lastIndexOf(":")) : checkpointNs;
    if (this.#visitedNs.has(stableNs)) return false;
    this.#visitedNs.add(stableNs);
    return true;
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
  async getCheckpoint(checkpointNs, checkpointer, checkpointConfig) {
    if (this.#isFirstVisit(checkpointNs)) {
      const results = [];
      for await (const saved of checkpointer.list(checkpointConfig, {
        before: { configurable: { checkpoint_id: this.checkpointId } },
        limit: 1
      })) results.push(saved);
      return results.length > 0 ? results[0] : void 0;
    }
    return await checkpointer.getTuple(checkpointConfig) ?? void 0;
  }
};
const INPUT_DONE = /* @__PURE__ */ Symbol.for("INPUT_DONE");
const INPUT_RESUMING = /* @__PURE__ */ Symbol.for("INPUT_RESUMING");
const DEFAULT_LOOP_LIMIT = 25;
function ensureMessageIds(value) {
  if (value == null || typeof value !== "object") return;
  if (BaseMessage.isInstance(value)) {
    const msg = value;
    if (msg.id == null) {
      msg.id = v4();
      if (msg.lc_kwargs != null) msg.lc_kwargs.id = msg.id;
    }
    return;
  }
  if (Array.isArray(value)) {
    for (const item of value) ensureMessageIds(item);
    return;
  }
}
function checkpointNamespaceFromNs(ns) {
  if (ns === void 0 || ns === "") return [];
  return ns.split("|");
}
function deepestCheckpointMapNamespace(map) {
  if (!map) return [];
  let deepest = "";
  for (const key of Object.keys(map)) if (key !== "" && key.length > deepest.length) deepest = key;
  return checkpointNamespaceFromNs(deepest);
}
var AsyncBatchedCache = class extends BaseCache {
  cache;
  queue = Promise.resolve();
  constructor(cache) {
    super();
    this.cache = cache;
  }
  async get(keys) {
    return this.enqueueOperation("get", keys);
  }
  async set(pairs) {
    return this.enqueueOperation("set", pairs);
  }
  async clear(namespaces) {
    return this.enqueueOperation("clear", namespaces);
  }
  async stop() {
    await this.queue;
  }
  enqueueOperation(type, ...args) {
    const newPromise = this.queue.then(() => {
      return this.cache[type](...args);
    });
    this.queue = newPromise.then(() => void 0, () => void 0);
    return newPromise;
  }
};
var PregelLoop = class PregelLoop2 {
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
  _hasPersistedParent = false;
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
  _trackCheckpointerPromise(promise) {
    const tracked = promise.then((value) => {
      this.checkpointerPromises.delete(tracked);
      return value;
    }, (error) => {
      throw error;
    });
    this.checkpointerPromises.add(tracked);
  }
  store;
  cache;
  manager;
  interruptAfter;
  interruptBefore;
  toInterrupt = [];
  debug = false;
  triggerToNodes;
  get isResuming() {
    let hasChannelVersions = false;
    if ("__start__" in this.checkpoint.channel_versions) hasChannelVersions = true;
    else for (const chan in this.checkpoint.channel_versions) if (Object.prototype.hasOwnProperty.call(this.checkpoint.channel_versions, chan)) {
      hasChannelVersions = true;
      break;
    }
    const configIsResuming = this.config.configurable?.["__pregel_resuming"] !== void 0 && this.config.configurable?.["__pregel_resuming"];
    const inputIsNullOrUndefined = this.input === null || this.input === void 0;
    const inputIsCommandResuming = isCommand(this.input) && this.input.resume != null;
    const inputIsResuming = this.input === INPUT_RESUMING;
    const runIdMatchesPrevious = !this.isNested && this.config.metadata?.run_id !== void 0 && this.checkpointMetadata?.run_id !== void 0 && this.config.metadata.run_id === this.checkpointMetadata?.run_id;
    return hasChannelVersions && (configIsResuming || inputIsNullOrUndefined || inputIsCommandResuming || inputIsResuming || runIdMatchesPrevious);
  }
  get isReplaying() {
    return !this.skipDoneTasks;
  }
  constructor(params) {
    this.input = params.input;
    this.checkpointer = params.checkpointer;
    if (this.checkpointer !== void 0) this.checkpointerGetNextVersion = this.checkpointer.getNextVersion.bind(this.checkpointer);
    else this.checkpointerGetNextVersion = increment;
    this.checkpoint = params.checkpoint;
    this.checkpointMetadata = params.checkpointMetadata;
    this.checkpointPreviousVersions = params.checkpointPreviousVersions;
    this.channels = params.channels;
    this.checkpointPendingWrites = params.checkpointPendingWrites;
    this.step = params.step;
    this.stop = params.stop;
    this.config = params.config;
    this.checkpointConfig = params.checkpointConfig;
    this.isNested = params.isNested;
    this.resumeAtHead = params.resumeAtHead;
    this.manager = params.manager;
    this.outputKeys = params.outputKeys;
    this.streamKeys = params.streamKeys;
    this.nodes = params.nodes;
    this.skipDoneTasks = params.skipDoneTasks;
    this.store = params.store;
    this.cache = params.cache ? new AsyncBatchedCache(params.cache) : void 0;
    this.stream = params.stream;
    this.checkpointNamespace = params.checkpointNamespace;
    this.prevCheckpointConfig = params.prevCheckpointConfig;
    this.interruptAfter = params.interruptAfter;
    this.interruptBefore = params.interruptBefore;
    this.durability = params.durability;
    this.debug = params.debug;
    this.triggerToNodes = params.triggerToNodes;
    this.control = this.config.control;
    this._exitDeltaWrites = this.durability === "exit" && this.checkpointer != null ? [] : void 0;
    this._hasPersistedParent = params.hasPersistedParent ?? false;
    this._initialCheckpointConfig = params.checkpointConfig;
    this.checkpointIdSaved = params.checkpoint.id;
  }
  static async initialize(params) {
    let { config, stream } = params;
    if (stream !== void 0 && config.configurable?.["__pregel_stream"] !== void 0) stream = createDuplexStream(stream, config.configurable[CONFIG_KEY_STREAM]);
    const skipDoneTasks = config.configurable ? !("checkpoint_id" in config.configurable) : true;
    const scratchpad = config.configurable?.[CONFIG_KEY_SCRATCHPAD];
    if (config.configurable && scratchpad) {
      if (scratchpad.subgraphCounter > 0) config = patchConfigurable(config, { [CONFIG_KEY_CHECKPOINT_NS]: [config.configurable[CONFIG_KEY_CHECKPOINT_NS], scratchpad.subgraphCounter.toString()].join("|") });
      scratchpad.subgraphCounter += 1;
    }
    const requestedCheckpointId = config.configurable?.checkpoint_id;
    const isNested = CONFIG_KEY_READ in (config.configurable ?? {});
    if (!isNested && config.configurable?.checkpoint_ns !== void 0 && config.configurable?.checkpoint_ns !== "") config = patchConfigurable(config, {
      checkpoint_ns: "",
      checkpoint_id: void 0
    });
    let checkpointConfig = config;
    if (config.configurable?.checkpoint_id === void 0 && config.configurable?.["checkpoint_map"] !== void 0 && config.configurable?.["checkpoint_map"]?.[config.configurable?.checkpoint_ns]) checkpointConfig = patchConfigurable(config, { checkpoint_id: config.configurable[CONFIG_KEY_CHECKPOINT_MAP][config.configurable?.checkpoint_ns] });
    const checkpointNamespace = checkpointNamespaceFromNs(config.configurable?.checkpoint_ns);
    let saved;
    if (!params.checkpointer) saved = void 0;
    else if (checkpointConfig.configurable?.["checkpoint_id"]) saved = await params.checkpointer.getTuple(checkpointConfig);
    else if (config.configurable?.["__pregel_replay_state"]) {
      saved = await config.configurable[CONFIG_KEY_REPLAY_STATE].getCheckpoint(config.configurable?.["checkpoint_ns"] ?? "", params.checkpointer, checkpointConfig);
      if (config.configurable) delete config.configurable[CONFIG_KEY_RESUMING];
    } else saved = await params.checkpointer.getTuple(checkpointConfig);
    const hasPersistedParent = saved !== void 0;
    if (!saved) saved = {
      config,
      checkpoint: emptyCheckpoint(),
      metadata: {
        source: "input",
        step: -2,
        parents: {}
      },
      pendingWrites: []
    };
    checkpointConfig = {
      ...config,
      ...saved.config,
      configurable: {
        checkpoint_ns: "",
        ...config.configurable,
        ...saved.config.configurable
      }
    };
    const prevCheckpointConfig = saved.parentConfig;
    const checkpoint = copyCheckpoint(saved.checkpoint);
    const checkpointMetadata = { ...saved.metadata };
    let checkpointPendingWrites = saved.pendingWrites ?? [];
    const currentCheckpointNamespace = config.configurable?.checkpoint_ns;
    const checkpointMap = config.configurable?.[CONFIG_KEY_CHECKPOINT_MAP];
    if (typeof currentCheckpointNamespace === "string" && currentCheckpointNamespace !== "" && typeof checkpointMap === "object" && checkpointMap !== null && currentCheckpointNamespace in checkpointMap && checkpointPendingWrites.length > 0) checkpointPendingWrites = checkpointPendingWrites.filter(([, channel]) => channel !== RESUME$1);
    let resumeAtHead = false;
    const threadId = checkpointConfig.configurable?.thread_id;
    const checkpointNs = checkpointConfig.configurable?.checkpoint_ns ?? "";
    if (params.checkpointer && requestedCheckpointId && typeof threadId === "string") resumeAtHead = (await params.checkpointer.getTuple({ configurable: {
      thread_id: threadId,
      checkpoint_ns: checkpointNs
    } }))?.config.configurable?.checkpoint_id === requestedCheckpointId && checkpointMetadata.source !== "update" && checkpointMetadata.source !== "fork";
    const channels = await channelsFromCheckpoint(params.channelSpecs, checkpoint, {
      saver: params.checkpointer,
      config: checkpointConfig
    });
    const step = (checkpointMetadata.step ?? 0) + 1;
    const stop = step + (config.recursionLimit ?? DEFAULT_LOOP_LIMIT) + 1;
    const checkpointPreviousVersions = { ...checkpoint.channel_versions };
    const store = params.store ? new AsyncBatchedStore(params.store) : void 0;
    if (store) await store.start();
    return new PregelLoop2({
      input: params.input,
      config,
      checkpointer: params.checkpointer,
      checkpoint,
      checkpointMetadata,
      checkpointConfig,
      prevCheckpointConfig,
      checkpointNamespace,
      channels,
      isNested,
      resumeAtHead,
      manager: params.manager,
      skipDoneTasks,
      step,
      stop,
      checkpointPreviousVersions,
      checkpointPendingWrites,
      outputKeys: params.outputKeys ?? [],
      streamKeys: params.streamKeys ?? [],
      nodes: params.nodes,
      stream,
      store,
      cache: params.cache,
      interruptAfter: params.interruptAfter,
      interruptBefore: params.interruptBefore,
      durability: params.durability,
      debug: params.debug,
      triggerToNodes: params.triggerToNodes,
      hasPersistedParent
    });
  }
  _checkpointerPutAfterPrevious(input) {
    this._checkpointerChainedPromise = this._checkpointerChainedPromise.then(() => {
      return this.checkpointer?.put(input.config, input.checkpoint, input.metadata, input.newVersions);
    });
    this._trackCheckpointerPromise(this._checkpointerChainedPromise);
  }
  /**
  * Put writes for a task, to be read by the next tick.
  * @param taskId
  * @param writes
  */
  putWrites(taskId, writes) {
    let writesCopy = writes;
    if (writesCopy.length === 0) return;
    if (writesCopy.every(([key]) => key in WRITES_IDX_MAP)) writesCopy = Array.from(new Map(writesCopy.map((w) => [w[0], w])).values());
    let hasUntrackedChannels = false;
    for (const key in this.channels) if (Object.prototype.hasOwnProperty.call(this.channels, key)) {
      if (this.channels[key].lc_graph_name === "UntrackedValue") {
        hasUntrackedChannels = true;
        break;
      }
    }
    let writesToSave = writesCopy;
    if (hasUntrackedChannels) writesToSave = writesCopy.filter(([c]) => {
      const channel = this.channels[c];
      return !channel || channel.lc_graph_name !== "UntrackedValue";
    }).map(([c, v]) => {
      if (c === "__pregel_tasks" && _isSend(v)) return [c, sanitizeUntrackedValuesInSend(v, this.channels)];
      return [c, v];
    });
    this.checkpointPendingWrites = this.checkpointPendingWrites.filter((w) => w[0] !== taskId);
    for (const [c, v] of writesToSave) this.checkpointPendingWrites.push([
      taskId,
      c,
      v
    ]);
    for (const [c, v] of writesToSave) {
      const channel = this.channels[c];
      if (channel != null && isDeltaChannel$1(channel)) ensureMessageIds(v);
    }
    const config = patchConfigurable(this.checkpointConfig, {
      [CONFIG_KEY_CHECKPOINT_NS]: this.config.configurable?.checkpoint_ns ?? "",
      [CONFIG_KEY_CHECKPOINT_ID]: this.checkpoint.id
    });
    if (this.durability !== "exit" && this.checkpointer != null) this._trackCheckpointerPromise(this.checkpointer.putWrites(config, writesToSave, taskId));
    if (this.tasks) this._outputWrites(taskId, writesCopy);
    if (!writes.length || !this.cache || !this.tasks) return;
    const task2 = this.tasks[taskId];
    if (task2 == null || task2.cache_key == null) return;
    if (writes[0][0] === "__error__" || writes[0][0] === "__interrupt__") return;
    this.cache.set([{
      key: [task2.cache_key.ns, task2.cache_key.key],
      value: task2.writes,
      ttl: task2.cache_key.ttl
    }]);
  }
  _outputWrites(taskId, writes, cached = false) {
    const task2 = this.tasks[taskId];
    if (task2 !== void 0) {
      if (task2.config !== void 0 && (task2.config.tags ?? []).includes("langsmith:hidden")) return;
      if (writes.length > 0) {
        if (writes[0][0] === "__interrupt__") {
          if (task2.path?.[0] === "__pregel_push" && task2.path?.[task2.path.length - 1] === true) return;
          const interruptWrites = writes.filter((w) => w[0] === INTERRUPT$1).flatMap((w) => w[1]);
          this._emit([["updates", { [INTERRUPT$1]: interruptWrites }], ["values", { [INTERRUPT$1]: interruptWrites }]]);
        } else if (writes[0][0] !== "__error__") this._emit(gatherIteratorSync(prefixGenerator(mapOutputUpdates(this.outputKeys, [[task2, writes]], cached), "updates")));
      }
      if (!cached) this._emit(gatherIteratorSync(prefixGenerator(mapDebugTaskResults([[task2, writes]], this.streamKeys), "tasks")));
    }
  }
  async _matchCachedWrites() {
    if (!this.cache) return [];
    const matched = [];
    const serializeKey = ([ns, key]) => {
      return `ns:${ns.join(",")}|key:${key}`;
    };
    const keys = [];
    const keyMap = {};
    for (const task2 of Object.values(this.tasks)) if (task2.cache_key != null && !task2.writes.length) {
      keys.push([task2.cache_key.ns, task2.cache_key.key]);
      keyMap[serializeKey([task2.cache_key.ns, task2.cache_key.key])] = task2;
    }
    if (keys.length === 0) return [];
    const cache = await this.cache.get(keys);
    for (const { key, value } of cache) {
      const task2 = keyMap[serializeKey(key)];
      if (task2 != null) {
        task2.writes.push(...value);
        matched.push({
          task: task2,
          result: value
        });
      }
    }
    return matched;
  }
  /**
  * Execute a single iteration of the Pregel loop.
  * Returns true if more iterations are needed.
  * @param params - The input keys to use for the tick.
  * @returns True if more iterations are needed, false otherwise.
  */
  async tick(params) {
    if (this.store && !this.store.isRunning) await this.store?.start();
    const { inputKeys = [] } = params;
    if (this.status !== "pending") throw new Error(`Cannot tick when status is no longer "pending". Current status: "${this.status}"`);
    if (![INPUT_DONE, INPUT_RESUMING].includes(this.input)) await this._first(inputKeys);
    else if (this.toInterrupt.length > 0) {
      this.status = "interrupt_before";
      throw new GraphInterrupt();
    } else if (Object.values(this.tasks).every((task2) => task2.writes.length > 0)) {
      const finishTaskList = Object.values(this.tasks);
      const writes = finishTaskList.flatMap((t) => t.writes);
      this.updatedChannels = _applyWrites(this.checkpoint, this.channels, finishTaskList, this.checkpointerGetNextVersion, this.triggerToNodes);
      for (const [ch, v] of writes) {
        const channel = this.channels[ch];
        if (channel != null && isDeltaChannel$1(channel) && _isOverwriteValue(v)) this._deltaChannelsWithOverwrite.add(ch);
      }
      const valuesOutput = await gatherIterator(prefixGenerator(mapOutputValues(this.outputKeys, writes, this.channels), "values"));
      if (this._exitDeltaWrites !== void 0) for (const [tid, ch, v] of this.checkpointPendingWrites) {
        const channel = this.channels[ch];
        if (channel != null && isDeltaChannel$1(channel)) this._exitDeltaWrites.push([
          this.step,
          tid,
          ch,
          v
        ]);
      }
      this.checkpointPendingWrites = [];
      await this._putCheckpoint({ source: "loop" });
      this._emitValuesWithCheckpointMeta(valuesOutput);
      if (shouldInterrupt(this.checkpoint, this.interruptAfter, finishTaskList)) {
        this.status = "interrupt_after";
        throw new GraphInterrupt();
      }
      if (this.config.configurable?.["__pregel_resuming"] !== void 0) delete this.config.configurable?.[CONFIG_KEY_RESUMING];
    } else return false;
    if (this.step > this.stop) {
      this.status = "out_of_steps";
      return false;
    }
    this.tasks = _prepareNextTasks(this.checkpoint, this.checkpointPendingWrites, this.nodes, this.channels, this.config, true, {
      step: this.step,
      checkpointer: this.checkpointer,
      isResuming: this.isResuming,
      manager: this.manager,
      store: this.store,
      stream: this.stream,
      triggerToNodes: this.triggerToNodes,
      updatedChannels: this.updatedChannels
    });
    let taskList = Object.values(this.tasks);
    if (this.checkpointer && (this.stream.modes.has("checkpoints") || this.stream.modes.has("debug"))) this._emit(await gatherIterator(prefixGenerator(mapDebugCheckpoint(this.checkpointConfig, this.channels, this.streamKeys, this.checkpointMetadata, taskList, this.checkpointPendingWrites, this.prevCheckpointConfig, this.outputKeys), "checkpoints")));
    if (taskList.length === 0) {
      this.status = "done";
      return false;
    }
    if (this.control != null && this.control.drainRequested) {
      this.status = "draining";
      return false;
    }
    if (this.skipDoneTasks && this.checkpointPendingWrites.length > 0) {
      for (const [tid, k, v] of this.checkpointPendingWrites) {
        if (k === "__error__" || k === "__error_source_node__" || k === "__interrupt__" || k === "__resume__") continue;
        const task2 = taskList.find((t) => t.id === tid);
        if (task2) task2.writes.push([k, v]);
      }
      this._resumeErrorHandlersIfApplicable();
      taskList = Object.values(this.tasks);
      for (const task2 of taskList) if (task2.writes.length > 0) this._outputWrites(task2.id, task2.writes, true);
    }
    if (taskList.every((task2) => task2.writes.length > 0)) return this.tick({ inputKeys });
    if (shouldInterrupt(this.checkpoint, this.interruptBefore, taskList)) {
      this.status = "interrupt_before";
      throw new GraphInterrupt();
    }
    if (this.stream.modes.has("tasks") || this.stream.modes.has("debug")) {
      const debugOutput = await gatherIterator(prefixGenerator(mapDebugTasks(taskList), "tasks"));
      this._emit(debugOutput);
    }
    return true;
  }
  async finishAndHandleError(error) {
    if (this.durability === "exit" && (!this.isNested || typeof error !== "undefined" || this.checkpointNamespace.every((part) => !part.includes(":")))) {
      await this._putExitDeltaWrites();
      this._putCheckpoint(this.checkpointMetadata);
      this._flushPendingWrites();
    }
    const suppress = this._suppressInterrupt(error);
    if (suppress || error === void 0) this.output = readChannels(this.channels, this.outputKeys);
    if (suppress) {
      if (this.tasks !== void 0 && this.checkpointPendingWrites.length > 0 && Object.values(this.tasks).some((task2) => task2.writes.length > 0)) {
        this.updatedChannels = _applyWrites(this.checkpoint, this.channels, Object.values(this.tasks), this.checkpointerGetNextVersion, this.triggerToNodes);
        this._emitValuesWithCheckpointMeta(gatherIteratorSync(prefixGenerator(mapOutputValues(this.outputKeys, Object.values(this.tasks).flatMap((t) => t.writes), this.channels), "values")));
      }
      if (isGraphInterrupt(error) && !error.interrupts.length) this._emit([["updates", { [INTERRUPT$1]: [] }], ["values", { [INTERRUPT$1]: [] }]], this.#interruptStreamNamespace());
    }
    return suppress;
  }
  async acceptPush(task2, writeIdx, call2) {
    if (this.interruptAfter?.length > 0 && shouldInterrupt(this.checkpoint, this.interruptAfter, [task2])) {
      this.toInterrupt.push(task2);
      return;
    }
    const pushed = _prepareSingleTask([
      PUSH,
      task2.path ?? [],
      writeIdx,
      task2.id,
      call2
    ], this.checkpoint, this.checkpointPendingWrites, this.nodes, this.channels, task2.config ?? {}, true, {
      step: this.step,
      checkpointer: this.checkpointer,
      manager: this.manager,
      store: this.store,
      stream: this.stream
    });
    if (!pushed) return;
    if (this.interruptBefore?.length > 0 && shouldInterrupt(this.checkpoint, this.interruptBefore, [pushed])) {
      this.toInterrupt.push(pushed);
      return;
    }
    if (this.stream.modes.has("tasks") || this.stream.modes.has("debug")) this._emit(gatherIteratorSync(prefixGenerator(mapDebugTasks([pushed]), "tasks")));
    if (this.debug) printStepTasks(this.step, [pushed]);
    this.tasks[pushed.id] = pushed;
    if (this.skipDoneTasks) this._matchWrites({ [pushed.id]: pushed });
    const tasks = await this._matchCachedWrites();
    for (const { task: task3 } of tasks) this._outputWrites(task3.id, task3.writes, true);
    return pushed;
  }
  /**
  * Returns the name of the error handler node registered for `nodeName`, or
  * `undefined` if none is configured.
  */
  getErrorHandlerNode(nodeName) {
    return this.nodes[nodeName]?.errorHandlerNode;
  }
  /**
  * Whether `nodeName` is itself an auto-generated error handler node.
  */
  isErrorHandlerNode(nodeName) {
    return this.nodes[nodeName]?.isErrorHandler === true;
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
  scheduleErrorHandler(failedTask, error) {
    const handlerNode = this.getErrorHandlerNode(String(failedTask.name));
    if (!handlerNode) return void 0;
    const handlerTask = _prepareNodeErrorHandlerTask(failedTask, handlerNode, error, this.checkpoint, this.checkpointPendingWrites, this.nodes, this.channels, failedTask.config ?? this.config, {
      step: this.step,
      checkpointer: this.checkpointer,
      manager: this.manager,
      store: this.store,
      stream: this.stream
    });
    if (handlerTask === void 0) return void 0;
    this.tasks[handlerTask.id] = handlerTask;
    this._emit(gatherIteratorSync(prefixGenerator(mapDebugTasks([handlerTask]), "tasks")));
    if (this.debug) printStepTasks(this.step, [handlerTask]);
    return handlerTask;
  }
  /**
  * On resume, re-schedule error handlers for tasks that failed in a prior run
  * but had not finished being handled. Scans pending writes for
  * `ERROR_SOURCE_NODE` markers (paired with `ERROR`), marks the originating
  * task as done (so the runner won't re-run it), and prepares a fresh handler
  * task so the runner picks it up.
  */
  _resumeErrorHandlersIfApplicable() {
    const failed = /* @__PURE__ */ new Map();
    for (const [tid, chan] of this.checkpointPendingWrites) {
      if (chan !== "__error_source_node__") continue;
      const errorWrite = this.checkpointPendingWrites.find(([t, c]) => t === tid && c === "__error__");
      if (errorWrite === void 0) continue;
      const value = errorWrite[2];
      const error = new Error(value?.message ?? String(value));
      if (value?.name) error.name = value.name;
      failed.set(tid, error);
    }
    for (const [tid, error] of failed) {
      const task2 = this.tasks[tid];
      if (task2 === void 0) continue;
      if (!this.getErrorHandlerNode(String(task2.name))) continue;
      if (task2.writes.length === 0) task2.writes.push([ERROR$1, {
        message: error.message,
        name: error.name
      }]);
      this.scheduleErrorHandler(task2, error);
    }
  }
  _suppressInterrupt(e) {
    return isGraphInterrupt(e) && !this.isNested;
  }
  async _first(inputKeys) {
    const { configurable } = this.config;
    const scratchpad = configurable?.[CONFIG_KEY_SCRATCHPAD];
    if (scratchpad && scratchpad.nullResume !== void 0) this.putWrites(NULL_TASK_ID, [[RESUME$1, scratchpad.nullResume]]);
    if (isCommand(this.input)) {
      const hasResume = this.input.resume != null;
      if (this.input.resume != null && typeof this.input.resume === "object" && Object.keys(this.input.resume).every(isXXH3)) {
        this.config.configurable ??= {};
        this.config.configurable[CONFIG_KEY_RESUME_MAP] = this.input.resume;
      }
      if (hasResume && this.checkpointer == null) throw new Error("Cannot use Command(resume=...) without checkpointer");
      const writes = {};
      for (const [tid, key, value] of mapCommand(this.input, this.checkpointPendingWrites)) {
        writes[tid] ??= [];
        writes[tid].push([key, value]);
      }
      if (Object.keys(writes).length === 0) throw new EmptyInputError("Received empty Command input");
      for (const [tid, ws] of Object.entries(writes)) this.putWrites(tid, ws);
    }
    const nullWrites = (this.checkpointPendingWrites ?? []).filter((w) => w[0] === NULL_TASK_ID).map((w) => w.slice(1));
    if (nullWrites.length > 0) _applyWrites(this.checkpoint, this.channels, [{
      name: INPUT,
      writes: nullWrites,
      triggers: []
    }], this.checkpointerGetNextVersion, this.triggerToNodes);
    const inputIsCommand = isCommand(this.input);
    const isCommandUpdateOrGoto = inputIsCommand && nullWrites.length > 0;
    const isTimeTraveling = this.isReplaying && (this.isNested && configurable?.["checkpoint_ns"] !== void 0 && configurable?.["checkpoint_ns"] !== "" && configurable?.["checkpoint_map"] !== void 0 && configurable["checkpoint_ns"] in configurable["checkpoint_map"] || !(inputIsCommand && this.input.resume != null || configurable?.["__pregel_resuming"] === true || this.resumeAtHead));
    if (isTimeTraveling) this.checkpointPendingWrites = this.checkpointPendingWrites.filter((w) => w[1] !== RESUME$1);
    const cachedIsResuming = this.isResuming;
    if (cachedIsResuming || isCommandUpdateOrGoto) {
      const interruptSeen = { ...this.checkpoint.versions_seen[INTERRUPT$1] };
      for (const channelName in this.channels) {
        if (!Object.prototype.hasOwnProperty.call(this.channels, channelName)) continue;
        if (this.checkpoint.channel_versions[channelName] !== void 0) interruptSeen[channelName] = this.checkpoint.channel_versions[channelName];
      }
      this.checkpoint.versions_seen[INTERRUPT$1] = interruptSeen;
      if (isTimeTraveling && this.checkpointMetadata.source !== "update" && this.checkpointMetadata.source !== "fork") {
        this.checkpointPendingWrites = this.checkpointPendingWrites.filter((w) => w[1] !== INTERRUPT$1);
        await this._putCheckpoint({ source: "fork" });
      }
      const valuesOutput = await gatherIterator(prefixGenerator(mapOutputValues(this.outputKeys, true, this.channels), "values"));
      if (cachedIsResuming) this.input = INPUT_RESUMING;
      else if (isCommandUpdateOrGoto) {
        await this._putCheckpoint({ source: "input" });
        this.input = INPUT_DONE;
      }
      this._emitValuesWithCheckpointMeta(valuesOutput);
    } else {
      const inputWrites = await gatherIterator(mapInput(inputKeys, this.input));
      if (inputWrites.length > 0) {
        const discardTasks = _prepareNextTasks(this.checkpoint, this.checkpointPendingWrites, this.nodes, this.channels, this.config, true, { step: this.step });
        this.updatedChannels = _applyWrites(this.checkpoint, this.channels, Object.values(discardTasks).concat([{
          name: INPUT,
          writes: inputWrites,
          triggers: []
        }]), this.checkpointerGetNextVersion, this.triggerToNodes);
        const deltaInput = inputWrites.filter(([c]) => {
          const channel = this.channels[c];
          return channel != null && isDeltaChannel$1(channel);
        });
        for (const [c, v] of deltaInput) if (_isOverwriteValue(v)) this._deltaChannelsWithOverwrite.add(c);
        if (deltaInput.length > 0) {
          if (this._exitDeltaWrites !== void 0) for (const [c, v] of deltaInput) this._exitDeltaWrites.push([
            this.step,
            NULL_TASK_ID,
            c,
            v
          ]);
          else if (this.checkpointer != null) this.putWrites(NULL_TASK_ID, deltaInput);
        }
        await this._putCheckpoint({ source: "input" });
        this.input = INPUT_DONE;
      } else if (!("__pregel_resuming" in (this.config.configurable ?? {}))) throw new EmptyInputError(`Received no input writes for ${JSON.stringify(inputKeys, null, 2)}`);
      else this.input = INPUT_DONE;
    }
    if (!this.isNested) {
      let replayState;
      if (isTimeTraveling) {
        let replayCheckpointId = this.checkpoint.id;
        if ((this.checkpointMetadata.source === "update" || this.checkpointMetadata.source === "fork") && this.prevCheckpointConfig) replayCheckpointId = this.prevCheckpointConfig.configurable?.["checkpoint_id"] ?? replayCheckpointId;
        replayState = new ReplayState(replayCheckpointId);
      }
      this.config = patchConfigurable(this.config, {
        [CONFIG_KEY_RESUMING]: this.isResuming,
        [CONFIG_KEY_REPLAY_STATE]: replayState
      });
    }
  }
  #interruptStreamNamespace() {
    const ns = this.checkpointNamespace;
    if (!(ns.length === 0 || ns.length === 1 && ns[0] === "") || this.config.configurable?.["__pregel_stream"] === void 0) return ns;
    const deepest = deepestCheckpointMapNamespace(this.config.configurable?.[CONFIG_KEY_CHECKPOINT_MAP]);
    return deepest.length > 0 ? deepest : ns;
  }
  _emit(values, namespace = this.checkpointNamespace) {
    for (const [mode, payload] of values) {
      if (this.stream.modes.has(mode)) this.stream.push([
        namespace,
        mode,
        payload
      ]);
      if ((mode === "checkpoints" || mode === "tasks") && this.stream.modes.has("debug")) {
        const step = mode === "checkpoints" ? this.step - 1 : this.step;
        const timestamp = (/* @__PURE__ */ new Date()).toISOString();
        const type = (() => {
          if (mode === "checkpoints") return "checkpoint";
          else if (typeof payload === "object" && payload != null && "result" in payload) return "task_result";
          else return "task";
        })();
        this.stream.push([
          namespace,
          "debug",
          {
            step,
            type,
            timestamp,
            payload
          }
        ]);
      }
    }
  }
  /**
  * Build a {@link StreamChunkMeta} describing the currently active checkpoint.
  * Emitted as a separate ``[namespace, "checkpoints", envelope]`` chunk before
  * the paired ``values`` chunk. Returns `undefined` if no checkpoint metadata
  * is available yet.
  */
  _currentCheckpointMeta() {
    if (!this.checkpointMetadata || !this.checkpoint?.id) return void 0;
    const parent_id = this.prevCheckpointConfig?.configurable?.checkpoint_id;
    return { checkpoint: {
      id: this.checkpoint.id,
      ...parent_id ? { parent_id } : {},
      step: this.checkpointMetadata.step,
      source: this.checkpointMetadata.source
    } };
  }
  /**
  * Emit stream entries. When checkpoint meta is available, push a lightweight
  * ``[namespace, "checkpoints", envelope]`` chunk before each ``values`` chunk.
  */
  _emitValuesWithCheckpointMeta(entries) {
    const meta = this._currentCheckpointMeta();
    for (const [mode, payload] of entries) {
      if (mode === "values" && meta?.checkpoint != null && !this.stream.modes.has("checkpoints")) this.stream.push([
        this.checkpointNamespace,
        "checkpoints",
        meta.checkpoint
      ]);
      if (this.stream.modes.has(mode)) this.stream.push([
        this.checkpointNamespace,
        mode,
        payload
      ]);
    }
  }
  _putCheckpoint(inputMetadata) {
    const exiting = this.checkpointMetadata === inputMetadata;
    const doCheckpoint = this.checkpointer != null && (this.durability !== "exit" || exiting);
    const storeCheckpoint = (checkpoint) => {
      this.prevCheckpointConfig = this.checkpointConfig?.configurable?.checkpoint_id ? this.checkpointConfig : void 0;
      this.checkpointConfig = patchConfigurable(this.checkpointConfig, { [CONFIG_KEY_CHECKPOINT_NS]: this.config.configurable?.checkpoint_ns ?? "" });
      const channelVersions = { ...this.checkpoint.channel_versions };
      const newVersions = getNewChannelVersions(this.checkpointPreviousVersions, channelVersions);
      this.checkpointPreviousVersions = channelVersions;
      this._checkpointerPutAfterPrevious({
        config: { ...this.checkpointConfig },
        checkpoint: copyCheckpoint(checkpoint),
        metadata: { ...this.checkpointMetadata },
        newVersions
      });
      this.checkpointConfig = {
        ...this.checkpointConfig,
        configurable: {
          ...this.checkpointConfig.configurable,
          checkpoint_id: this.checkpoint.id
        }
      };
    };
    let newCounters;
    if (!exiting) {
      const prevCounters = this.checkpointMetadata.counters_since_delta_snapshot ?? {};
      newCounters = {};
      const updated = this.updatedChannels ?? /* @__PURE__ */ new Set();
      for (const chName in this.channels) {
        if (!Object.prototype.hasOwnProperty.call(this.channels, chName)) continue;
        if (!isDeltaChannel$1(this.channels[chName])) continue;
        const [u, s] = prevCounters[chName] ?? [0, 0];
        newCounters[chName] = [updated.has(chName) ? u + 1 : u, s + 1];
      }
      this.checkpointMetadata = {
        ...inputMetadata,
        step: this.step,
        parents: this.config.configurable?.["checkpoint_map"] ?? {}
      };
    } else newCounters = { ...this.checkpointMetadata.counters_since_delta_snapshot ?? {} };
    const channelsToSnapshot = doCheckpoint ? deltaChannelsToSnapshot(this.channels, newCounters) : /* @__PURE__ */ new Set();
    if (doCheckpoint) for (const ch of this._deltaChannelsWithOverwrite) channelsToSnapshot.add(ch);
    this.checkpoint = createCheckpoint(this.checkpoint, doCheckpoint ? this.channels : void 0, this.step, {
      id: exiting ? this.checkpoint.id : void 0,
      channelsToSnapshot,
      updatedChannels: this.updatedChannels,
      getNextVersion: doCheckpoint ? (current) => this.checkpointerGetNextVersion(current) : void 0
    });
    for (const k of channelsToSnapshot) {
      newCounters[k] = [0, 0];
      this._deltaChannelsWithOverwrite.delete(k);
    }
    const nonZero = {};
    for (const k in newCounters) {
      if (!Object.prototype.hasOwnProperty.call(newCounters, k)) continue;
      const [u, s] = newCounters[k];
      if (u !== 0 || s !== 0) nonZero[k] = [u, s];
    }
    if (Object.keys(nonZero).length > 0) this.checkpointMetadata.counters_since_delta_snapshot = nonZero;
    else delete this.checkpointMetadata.counters_since_delta_snapshot;
    if (doCheckpoint) storeCheckpoint(this.checkpoint);
    if (!exiting) this.step += 1;
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
    const counters = this.checkpointMetadata.counters_since_delta_snapshot ?? {};
    const channelsToSnapshot = deltaChannelsToSnapshot(this.channels, counters);
    for (const ch of this._deltaChannelsWithOverwrite) channelsToSnapshot.add(ch);
    const pending = this._exitDeltaWrites.filter(([, , ch]) => !channelsToSnapshot.has(ch));
    if (pending.length === 0) return;
    let anchorConfig;
    if (this._hasPersistedParent) anchorConfig = this._initialCheckpointConfig;
    else {
      const stubCp = emptyCheckpoint();
      stubCp.id = this.checkpointIdSaved ?? stubCp.id;
      stubCp.ts = (/* @__PURE__ */ new Date()).toISOString();
      const stubPutConfig = patchConfigurable(this._initialCheckpointConfig, { [CONFIG_KEY_CHECKPOINT_ID]: void 0 });
      anchorConfig = patchConfigurable(this._initialCheckpointConfig, { [CONFIG_KEY_CHECKPOINT_ID]: stubCp.id });
      this._trackCheckpointerPromise(this.checkpointer.put(stubPutConfig, stubCp, {
        source: "loop",
        step: -2,
        parents: {}
      }, {}));
      this.checkpointConfig = anchorConfig;
    }
    const anchorWriteConfig = patchConfigurable(anchorConfig, {
      [CONFIG_KEY_CHECKPOINT_NS]: this.config.configurable?.checkpoint_ns ?? "",
      [CONFIG_KEY_CHECKPOINT_ID]: anchorConfig.configurable?.[CONFIG_KEY_CHECKPOINT_ID]
    });
    const grouped = /* @__PURE__ */ new Map();
    const order = [];
    for (const [step, tid, ch, v] of pending) {
      const key = `${step}\0${tid}`;
      let group = grouped.get(key);
      if (group === void 0) {
        group = [];
        grouped.set(key, group);
        order.push({
          key,
          step,
          tid
        });
      }
      group.push([ch, v]);
    }
    for (const { key, step, tid } of order) {
      const synthTid = exitDeltaTaskId(step, tid);
      this._trackCheckpointerPromise(this.checkpointer.putWrites(anchorWriteConfig, grouped.get(key), synthTid));
    }
  }
  _flushPendingWrites() {
    if (this.checkpointer == null) return;
    if (this.checkpointPendingWrites.length === 0) return;
    const config = patchConfigurable(this.checkpointConfig, {
      [CONFIG_KEY_CHECKPOINT_NS]: this.config.configurable?.checkpoint_ns ?? "",
      [CONFIG_KEY_CHECKPOINT_ID]: this.checkpoint.id
    });
    const byTask = {};
    for (const [tid, key, value] of this.checkpointPendingWrites) {
      byTask[tid] ??= [];
      byTask[tid].push([key, value]);
    }
    for (const [tid, ws] of Object.entries(byTask)) this._trackCheckpointerPromise(this.checkpointer.putWrites(config, ws, tid));
  }
  _matchWrites(tasks) {
    for (const [tid, k, v] of this.checkpointPendingWrites) {
      if (k === "__error__" || k === "__interrupt__" || k === "__resume__") continue;
      const task2 = Object.values(tasks).find((t) => t.id === tid);
      if (task2) task2.writes.push([k, v]);
    }
    for (const task2 of Object.values(tasks)) if (task2.writes.length > 0) this._outputWrites(task2.id, task2.writes, true);
  }
};
function isChatGenerationChunk(x) {
  return isBaseMessage(x?.message);
}
function normalizeStreamMetadata(metadata, tags, name) {
  if (!metadata) return;
  const streamNamespace = metadata.langgraph_checkpoint_ns;
  const checkpointNs = metadata.checkpoint_ns;
  const namespace = streamNamespace ?? checkpointNs;
  if (!namespace) return;
  return [namespace.split("|"), {
    tags,
    name,
    ...metadata
  }];
}
var StreamMessagesHandler = class extends BaseCallbackHandler {
  name = "StreamMessagesHandler";
  streamFn;
  metadatas = {};
  seen = {};
  emittedChatModelRunIds = {};
  stableMessageIdMap = {};
  lc_prefer_streaming = true;
  constructor(streamFn) {
    super();
    this.streamFn = streamFn;
  }
  _emit(meta, message, runId, dedupe = false) {
    if (dedupe && message.id !== void 0 && this.seen[message.id] !== void 0) return;
    let messageId = message.id;
    if (runId != null) if (isToolMessage(message)) messageId ??= `run-${runId}-tool-${message.tool_call_id}`;
    else {
      if (messageId == null || messageId === `run-${runId}`) messageId = this.stableMessageIdMap[runId] ?? messageId ?? `run-${runId}`;
      this.stableMessageIdMap[runId] ??= messageId;
    }
    if (messageId !== message.id) {
      message.id = messageId;
      message.lc_kwargs.id = messageId;
    }
    if (message.id != null) this.seen[message.id] = message;
    this.streamFn([
      meta[0],
      "messages",
      [message, meta[1]]
    ]);
  }
  handleChatModelStart(_llm, _messages, runId, _parentRunId, _extraParams, tags, metadata, name) {
    if (metadata && (!tags || !tags.includes("langsmith:nostream") && !tags.includes("nostream"))) this.metadatas[runId] = normalizeStreamMetadata(metadata, tags, name);
  }
  handleLLMNewToken(token, _idx, runId, _parentRunId, _tags, fields) {
    const chunk = fields?.chunk;
    this.emittedChatModelRunIds[runId] = true;
    if (this.metadatas[runId] !== void 0) if (isChatGenerationChunk(chunk)) this._emit(this.metadatas[runId], chunk.message, runId);
    else this._emit(this.metadatas[runId], new AIMessageChunk({ content: token }), runId);
  }
  handleLLMEnd(output, runId) {
    if (this.metadatas[runId] === void 0) return;
    if (!this.emittedChatModelRunIds[runId]) {
      const chatGeneration = output.generations?.[0]?.[0];
      if (isBaseMessage(chatGeneration?.message)) this._emit(this.metadatas[runId], chatGeneration?.message, runId, true);
      delete this.emittedChatModelRunIds[runId];
    }
    delete this.metadatas[runId];
    delete this.stableMessageIdMap[runId];
  }
  handleLLMError(_err, runId) {
    delete this.metadatas[runId];
  }
  handleChainStart(_chain, inputs, runId, _parentRunId, tags, metadata, _runType, name) {
    if (metadata !== void 0 && name === metadata.langgraph_node && (tags === void 0 || !tags.includes("langsmith:hidden"))) {
      this.metadatas[runId] = normalizeStreamMetadata(metadata, tags, name);
      if (typeof inputs === "object") {
        for (const value of Object.values(inputs)) if ((isBaseMessage(value) || isBaseMessageChunk(value)) && value.id !== void 0) this.seen[value.id] = value;
        else if (Array.isArray(value)) {
          for (const item of value) if ((isBaseMessage(item) || isBaseMessageChunk(item)) && item.id !== void 0) this.seen[item.id] = item;
        }
      }
    }
  }
  handleChainEnd(outputs, runId) {
    const metadata = this.metadatas[runId];
    delete this.metadatas[runId];
    if (metadata !== void 0) {
      if (isBaseMessage(outputs)) this._emit(metadata, outputs, runId, true);
      else if (Array.isArray(outputs)) {
        for (const value of outputs) if (isBaseMessage(value)) this._emit(metadata, value, runId, true);
      } else if (outputs != null && typeof outputs === "object") {
        for (const value of Object.values(outputs)) if (isBaseMessage(value)) this._emit(metadata, value, runId, true);
        else if (Array.isArray(value)) {
          for (const item of value) if (isBaseMessage(item)) this._emit(metadata, item, runId, true);
        }
      }
    }
  }
  handleChainError(_err, runId) {
    delete this.metadatas[runId];
  }
};
function getResponseMetadata(message) {
  if ("response_metadata" in message && typeof message.response_metadata === "object" && message.response_metadata != null) return message.response_metadata;
}
function getUsageMetadata(message) {
  if ("usage_metadata" in message && typeof message.usage_metadata === "object" && message.usage_metadata != null) return message.usage_metadata;
}
function startBlockFor(block) {
  switch (block.type) {
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
        ...block.id != null ? { id: block.id } : {},
        ...block.name != null ? { name: block.name } : {},
        args: ""
      };
    default:
      return block;
  }
}
function deltaFor(block) {
  switch (block.type) {
    case "text": {
      const text = typeof block.text === "string" ? block.text : "";
      return text.length > 0 ? {
        event: "content-block-delta",
        index: typeof block.index === "number" ? block.index : 0,
        delta: {
          type: "text-delta",
          text
        }
      } : void 0;
    }
    case "reasoning": {
      const reasoning = typeof block.reasoning === "string" ? block.reasoning : "";
      return reasoning.length > 0 ? {
        event: "content-block-delta",
        index: typeof block.index === "number" ? block.index : 0,
        delta: {
          type: "reasoning-delta",
          reasoning
        }
      } : void 0;
    }
    case "tool_call_chunk":
      return {
        event: "content-block-delta",
        index: typeof block.index === "number" ? block.index : 0,
        delta: {
          type: "block-delta",
          fields: {
            ...block,
            type: "tool_call_chunk"
          }
        }
      };
    default:
      return;
  }
}
var StreamProtocolMessagesHandler = class extends BaseCallbackHandler {
  name = "StreamProtocolMessagesHandler";
  streamFn;
  metadatas = {};
  seen = {};
  streamedRunIds = /* @__PURE__ */ new Set();
  stableMessageIdMap = {};
  lc_prefer_chat_model_stream_events = true;
  awaitHandlers = true;
  constructor(streamFn) {
    super();
    this.streamFn = streamFn;
  }
  normalizeMessageId(message, runId) {
    let messageId = message.id;
    if (runId != null) if (ToolMessage.isInstance(message)) messageId ??= `run-${runId}-tool-${message.tool_call_id}`;
    else {
      if (messageId == null || messageId === `run-${runId}`) messageId = this.stableMessageIdMap[runId] ?? messageId ?? `run-${runId}`;
      this.stableMessageIdMap[runId] ??= messageId;
    }
    if (messageId !== message.id) {
      message.id = messageId;
      message.lc_kwargs.id = messageId;
    }
    if (message.id != null) this.seen[message.id] = message;
    return message.id;
  }
  emit(meta, data, runId) {
    const metadata = runId != null ? {
      ...meta[1],
      run_id: runId
    } : meta[1];
    this.streamFn([
      meta[0],
      "messages",
      [data, metadata]
    ]);
  }
  emitFinalMessage(meta, message, runId, dedupe = false) {
    const existingId = message.id ?? (runId != null ? this.stableMessageIdMap[runId] : void 0);
    if (dedupe && existingId != null && this.seen[existingId] !== void 0) return;
    const messageId = this.normalizeMessageId(message, runId);
    const role = message.type === "human" ? "human" : message.type === "system" ? "system" : message.type === "tool" ? "tool" : "ai";
    const toolCallId = role === "tool" && ToolMessage.isInstance(message) ? message.tool_call_id : void 0;
    this.emit(meta, {
      event: "message-start",
      ...messageId != null ? { id: messageId } : {},
      ...role !== "ai" ? { role } : {},
      ...typeof toolCallId === "string" ? { tool_call_id: toolCallId } : {}
    }, runId);
    (Array.isArray(message.content) ? message.content : typeof message.content === "string" && message.content.length > 0 ? [{
      type: "text",
      text: message.content
    }] : []).forEach((block, offset) => {
      const index2 = typeof block.index === "number" ? block.index : offset;
      this.emit(meta, {
        event: "content-block-start",
        index: index2,
        content: startBlockFor(block)
      }, runId);
      const delta = deltaFor({
        ...block,
        index: index2
      });
      if (delta != null) this.emit(meta, delta, runId);
      this.emit(meta, {
        event: "content-block-finish",
        index: index2,
        content: block
      }, runId);
    });
    this.emit(meta, {
      event: "message-finish",
      ...getUsageMetadata(message) != null ? { usage: getUsageMetadata(message) } : {},
      ...getResponseMetadata(message) != null ? { responseMetadata: getResponseMetadata(message) } : {}
    }, runId);
  }
  handleChatModelStart(_llm, _messages, runId, _parentRunId, _extraParams, tags, metadata, name) {
    if (metadata && (!tags || !tags.includes("langsmith:nostream") && !tags.includes("nostream"))) this.metadatas[runId] = [metadata.langgraph_checkpoint_ns.split("|"), {
      tags,
      name,
      ...metadata
    }];
  }
  handleLLMNewToken() {
  }
  handleChatModelStreamEvent(event, runId) {
    const meta = this.metadatas[runId];
    if (meta === void 0) return;
    let forwarded = event;
    if (event.event === "message-start") {
      this.streamedRunIds.add(runId);
      const id = event.id ?? `run-${runId}`;
      this.seen[id] = true;
      this.stableMessageIdMap[runId] ??= id;
      if (event.id == null) forwarded = {
        ...event,
        id
      };
    }
    this.emit(meta, forwarded, runId);
  }
  handleLLMEnd(output, runId) {
    const meta = this.metadatas[runId];
    if (meta === void 0) return;
    const chatGeneration = output.generations?.[0]?.[0];
    const message = BaseMessage.isInstance(chatGeneration?.message) ? chatGeneration.message : void 0;
    if (message != null) if (this.streamedRunIds.has(runId)) {
      const messageId = this.normalizeMessageId(message, runId);
      if (messageId != null) this.seen[messageId] = message;
    } else this.emitFinalMessage(meta, message, runId, true);
    this.streamedRunIds.delete(runId);
    delete this.metadatas[runId];
    delete this.stableMessageIdMap[runId];
  }
  handleLLMError(_err, runId) {
    this.streamedRunIds.delete(runId);
    delete this.metadatas[runId];
    delete this.stableMessageIdMap[runId];
  }
  handleChainStart(_chain, inputs, runId, _parentRunId, tags, metadata, _runType, name) {
    if (metadata !== void 0 && name === metadata.langgraph_node && (tags === void 0 || !tags.includes("langsmith:hidden"))) {
      this.metadatas[runId] = [metadata.langgraph_checkpoint_ns.split("|"), {
        tags,
        name,
        ...metadata
      }];
      if (typeof inputs === "object") {
        for (const value of Object.values(inputs)) if ((BaseMessage.isInstance(value) || BaseMessageChunk.isInstance(value)) && value.id !== void 0) this.seen[value.id] = value;
        else if (Array.isArray(value)) {
          for (const item of value) if ((BaseMessage.isInstance(item) || BaseMessageChunk.isInstance(item)) && item.id !== void 0) this.seen[item.id] = item;
        }
      }
    }
  }
  handleChainEnd(outputs, runId) {
    const meta = this.metadatas[runId];
    delete this.metadatas[runId];
    if (meta === void 0) return;
    const emitMessage = (value) => {
      if (BaseMessage.isInstance(value) && !ToolMessage.isInstance(value)) this.emitFinalMessage(meta, value, runId, true);
    };
    if (BaseMessage.isInstance(outputs)) emitMessage(outputs);
    else if (Array.isArray(outputs)) for (const value of outputs) emitMessage(value);
    else if (outputs != null && typeof outputs === "object") for (const value of Object.values(outputs)) if (Array.isArray(value)) for (const item of value) emitMessage(item);
    else emitMessage(value);
    delete this.stableMessageIdMap[runId];
  }
  handleChainError(_err, runId) {
    delete this.metadatas[runId];
    delete this.stableMessageIdMap[runId];
  }
};
var TimedAttemptScope = class {
  active = true;
  lastProgress = Date.now();
  refreshOn;
  constructor(refreshOn) {
    this.refreshOn = refreshOn;
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
    if (this.refreshOn === "auto") this.lastProgress = Date.now();
  }
  close() {
    this.active = false;
  }
};
var IdleProgressCallbackHandler = class extends BaseCallbackHandler {
  name = "IdleProgressCallbackHandler";
  awaitHandlers = false;
  #scope;
  constructor(scope) {
    super();
    this.#scope = scope;
  }
  #touch = () => {
    this.#scope.autoTouch();
  };
  handleLLMStart = this.#touch;
  handleChatModelStart = this.#touch;
  handleLLMNewToken = this.#touch;
  handleLLMEnd = this.#touch;
  handleLLMError = this.#touch;
  handleChainStart = this.#touch;
  handleChainEnd = this.#touch;
  handleChainError = this.#touch;
  handleToolStart = this.#touch;
  handleToolEnd = this.#touch;
  handleToolError = this.#touch;
  handleText = this.#touch;
  handleRetrieverStart = this.#touch;
  handleRetrieverEnd = this.#touch;
  handleRetrieverError = this.#touch;
  handleCustomEvent = this.#touch;
};
function wrapConfig(config, scope, policy, taskName) {
  const configurable = config.configurable ?? {};
  const patch = {};
  const send = configurable[CONFIG_KEY_SEND];
  if (typeof send === "function") patch[CONFIG_KEY_SEND] = (writes) => {
    if (!scope.active) return void 0;
    if (writes && writes.length) scope.autoTouch();
    return send(writes);
  };
  const callFn = configurable[CONFIG_KEY_CALL];
  if (typeof callFn === "function") patch[CONFIG_KEY_CALL] = (...args) => {
    if (!scope.active) throw new Error(`Node "${taskName}" attempt was cancelled after its timeout fired`);
    scope.autoTouch();
    return callFn(...args);
  };
  const wrapped = { ...Object.keys(patch).length > 0 ? patchConfigurable(config, patch) : config };
  wrapped.heartbeat = () => {
    if (policy.idleTimeout !== void 0) scope.touch();
  };
  if (typeof wrapped.writer === "function") {
    const writer2 = wrapped.writer;
    wrapped.writer = ((chunk) => {
      if (!scope.active) return void 0;
      scope.autoTouch();
      return writer2(chunk);
    });
  }
  if ((policy.refreshOn ?? "auto") === "auto" && policy.idleTimeout !== void 0) {
    const handler = new IdleProgressCallbackHandler(scope);
    const cb = wrapped.callbacks;
    if (cb === void 0) wrapped.callbacks = [handler];
    else if (Array.isArray(cb)) wrapped.callbacks = [...cb, handler];
    else {
      const copied = cb.copy();
      copied.addHandler(handler, true);
      wrapped.callbacks = copied;
    }
  }
  return wrapped;
}
async function runAttemptWithTimeout(task2, config, policy, invoke) {
  const scope = new TimedAttemptScope(policy.refreshOn ?? "auto");
  const timeoutController = new AbortController();
  const { signal: composedSignal, dispose } = combineAbortSignals(config.signal, timeoutController.signal);
  const scopedConfig = wrapConfig({
    ...config,
    signal: composedSignal
  }, scope, policy, String(task2.name));
  const start = Date.now();
  const nodeOutcome = invoke(scopedConfig).then((value) => ({
    type: "ok",
    value
  }), (error) => ({
    type: "err",
    error
  }));
  let runTimer;
  let idleTimer;
  const clearTimers = () => {
    if (runTimer !== void 0) clearTimeout(runTimer);
    if (idleTimer !== void 0) clearTimeout(idleTimer);
  };
  const watchdog = new Promise((resolve) => {
    if (policy.runTimeout !== void 0) runTimer = setTimeout(() => resolve({
      type: "timeout",
      kind: "run"
    }), policy.runTimeout);
    if (policy.idleTimeout !== void 0) {
      const idleMs = policy.idleTimeout;
      const checkIdle = () => {
        const remaining = scope.lastProgress + idleMs - Date.now();
        if (remaining <= 0) resolve({
          type: "timeout",
          kind: "idle"
        });
        else idleTimer = setTimeout(checkIdle, remaining);
      };
      idleTimer = setTimeout(checkIdle, idleMs);
    }
  });
  let outcome;
  try {
    outcome = await Promise.race([nodeOutcome, watchdog]);
  } finally {
    clearTimers();
  }
  if (outcome.type !== "timeout") {
    const now = Date.now();
    if (policy.runTimeout !== void 0 && now - start >= policy.runTimeout) outcome = {
      type: "timeout",
      kind: "run"
    };
    else if (policy.idleTimeout !== void 0 && now - scope.lastProgress >= policy.idleTimeout) outcome = {
      type: "timeout",
      kind: "idle"
    };
  }
  if (outcome.type === "ok") {
    dispose?.();
    return outcome.value;
  }
  if (outcome.type === "err") {
    dispose?.();
    throw outcome.error;
  }
  const elapsed = Date.now() - start;
  scope.close();
  task2.writes.splice(0, task2.writes.length);
  timeoutController.abort();
  dispose?.();
  throw new NodeTimeoutError({
    node: String(task2.name),
    elapsed,
    kind: outcome.kind,
    runTimeout: policy.runTimeout,
    idleTimeout: policy.idleTimeout
  });
}
const DEFAULT_STATUS_NO_RETRY = [
  400,
  401,
  402,
  403,
  404,
  405,
  406,
  407,
  409
];
const DEFAULT_RETRY_ON_HANDLER = (error) => {
  if (error.message.startsWith("Cancel") || error.message.startsWith("AbortError") || error.name === "AbortError") return false;
  if (error.name === "GraphValueError") return false;
  if (error?.code === "ECONNABORTED") return false;
  const status = error?.response?.status ?? error?.status;
  if (status && DEFAULT_STATUS_NO_RETRY.includes(+status)) return false;
  if (error?.error?.code === "insufficient_quota") return false;
  return true;
};
async function _runWithRetry(pregelTask, retryPolicy, configurable, signal) {
  const resolvedRetryPolicy = pregelTask.retry_policy ?? retryPolicy;
  let attempts = 0;
  let error;
  let result;
  let config = pregelTask.config ?? {};
  if (configurable) config = patchConfigurable(config, configurable);
  config = {
    ...config,
    signal
  };
  const firstAttemptTime = Date.now();
  if (config.executionInfo != null) config.executionInfo = {
    ...config.executionInfo,
    nodeFirstAttemptTime: firstAttemptTime
  };
  while (true) {
    if (signal?.aborted) break;
    pregelTask.writes.splice(0, pregelTask.writes.length);
    error = void 0;
    try {
      if (pregelTask.timeout !== void 0) result = await runAttemptWithTimeout(pregelTask, config, pregelTask.timeout, (scopedConfig) => pregelTask.proc.invoke(pregelTask.input, scopedConfig));
      else result = await pregelTask.proc.invoke(pregelTask.input, config);
      break;
    } catch (e) {
      error = e;
      error.pregelTaskId = pregelTask.id;
      if (isParentCommand(error)) {
        const ns = config?.configurable?.checkpoint_ns;
        const cmd = error.command;
        if (cmd.graph === ns) {
          for (const writer2 of pregelTask.writers) await writer2.invoke(cmd, config);
          error = void 0;
          break;
        } else if (cmd.graph === Command.PARENT) {
          const parentNs = getParentCheckpointNamespace(ns);
          error.command = new Command({
            ...error.command,
            graph: parentNs
          });
        }
      }
      if (isGraphBubbleUp(error)) break;
      if (resolvedRetryPolicy === void 0) break;
      attempts += 1;
      if (attempts >= (resolvedRetryPolicy.maxAttempts ?? 3)) break;
      if (!(resolvedRetryPolicy.retryOn ?? DEFAULT_RETRY_ON_HANDLER)(error)) break;
      const initialInterval = resolvedRetryPolicy.initialInterval ?? 500;
      const interval = Math.min(resolvedRetryPolicy.maxInterval ?? 128e3, initialInterval * (resolvedRetryPolicy.backoffFactor ?? 2) ** (attempts - 1));
      const sleepMs = resolvedRetryPolicy.jitter ?? true ? interval + Math.random() * 1e3 : interval;
      await new Promise((resolve) => setTimeout(resolve, sleepMs));
      const errorName = error.name ?? error.constructor.unminifiable_name ?? error.constructor.name;
      if (resolvedRetryPolicy?.logWarning ?? true) console.log(`Retrying task "${String(pregelTask.name)}" after ${sleepMs.toFixed(2)}ms (attempt ${attempts}) after ${errorName}: ${error}`);
      config = patchConfigurable(config, { [CONFIG_KEY_RESUMING]: true });
      if (config.executionInfo != null) config.executionInfo = {
        ...config.executionInfo,
        nodeAttempt: attempts + 1,
        nodeFirstAttemptTime: firstAttemptTime
      };
    }
  }
  return {
    task: pregelTask,
    result,
    error,
    signalAborted: signal?.aborted
  };
}
const PROMISE_ADDED_SYMBOL = /* @__PURE__ */ Symbol.for("promiseAdded");
function createPromiseBarrier() {
  const barrier = {
    next: () => void 0,
    wait: Promise.resolve(PROMISE_ADDED_SYMBOL)
  };
  function waitHandler(resolve) {
    barrier.next = () => {
      barrier.wait = new Promise(waitHandler);
      resolve(PROMISE_ADDED_SYMBOL);
    };
  }
  barrier.wait = new Promise(waitHandler);
  return barrier;
}
var PregelRunner = class {
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
  constructor({ loop, nodeFinished }) {
    this.loop = loop;
    this.nodeFinished = nodeFinished;
  }
  /**
  * Execute tasks from the current step of the PregelLoop.
  *
  * Note: this method does NOT call {@link PregelLoop}#tick. That must be handled externally.
  * @param options - Options for the execution.
  */
  async tick(options = {}) {
    const { timeout, retryPolicy, onStepWrite, maxConcurrency } = options;
    const nodeErrors = /* @__PURE__ */ new Set();
    let graphBubbleUp;
    const exceptionSignalController = new AbortController();
    const exceptionSignal = exceptionSignalController.signal;
    const stepTimeoutSignal = timeout ? AbortSignal.timeout(timeout) : void 0;
    const allTasks = Object.values(this.loop.tasks);
    const pendingTasks = allTasks.filter((t) => t.writes.length === 0);
    const { signals, disposeCombinedSignal } = this._initializeAbortSignals({
      exceptionSignal,
      stepTimeoutSignal,
      signal: options.signal
    });
    const taskStream = this._executeTasksWithRetry(pendingTasks, {
      signals,
      retryPolicy,
      maxConcurrency
    });
    for await (const { task: task2, error, signalAborted } of taskStream) {
      this._commit(task2, error);
      if (error !== void 0 && this.handledExceptions.has(error)) continue;
      if (isGraphInterrupt(error)) graphBubbleUp = error;
      else if (isGraphBubbleUp(error) && !isGraphInterrupt(graphBubbleUp)) graphBubbleUp = error;
      else if (error && (nodeErrors.size === 0 || !signalAborted)) {
        exceptionSignalController.abort();
        nodeErrors.add(error);
      }
    }
    disposeCombinedSignal?.();
    onStepWrite?.(this.loop.step, allTasks.map((task2) => task2.writes).flat());
    if (nodeErrors.size === 1) throw Array.from(nodeErrors)[0];
    else if (nodeErrors.size > 1) throw new AggregateError(Array.from(nodeErrors), `Multiple errors occurred during superstep ${this.loop.step}. See the "errors" field of this exception for more details.`);
    if (isGraphInterrupt(graphBubbleUp)) throw graphBubbleUp;
    if (isGraphDrained(graphBubbleUp)) throw graphBubbleUp;
    if (isGraphBubbleUp(graphBubbleUp) && this.loop.isNested) throw graphBubbleUp;
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
  _initializeAbortSignals({ exceptionSignal, stepTimeoutSignal, signal }) {
    const previousSignals = this.loop.config.configurable?.["__pregel_abort_signals"] ?? {};
    const externalAbortSignal = previousSignals.externalAbortSignal ?? signal;
    const timeoutAbortSignal = stepTimeoutSignal ?? previousSignals.timeoutAbortSignal;
    const { signal: composedAbortSignal, dispose: disposeCombinedSignal } = combineAbortSignals(externalAbortSignal, timeoutAbortSignal, exceptionSignal);
    const signals = {
      externalAbortSignal,
      timeoutAbortSignal,
      composedAbortSignal
    };
    this.loop.config = patchConfigurable(this.loop.config, { [CONFIG_KEY_ABORT_SIGNALS]: signals });
    return {
      signals,
      disposeCombinedSignal
    };
  }
  /**
  * Concurrently executes tasks with the requested retry policy, yielding a {@link SettledPregelTask} for each task as it completes.
  * @param tasks - The tasks to execute.
  * @param options - Options for the execution.
  */
  async *_executeTasksWithRetry(tasks, options) {
    const { retryPolicy, maxConcurrency, signals } = options ?? {};
    const barrier = createPromiseBarrier();
    const executingTasksMap = {};
    const thisCall = {
      executingTasksMap,
      barrier,
      retryPolicy,
      scheduleTask: async (task2, writeIdx, call2) => this.loop.acceptPush(task2, writeIdx, call2)
    };
    if (signals?.composedAbortSignal?.aborted) throw new Error("Abort");
    let startedTasksCount = 0;
    let listener;
    const timeoutOrCancelSignal = combineAbortSignals(signals?.externalAbortSignal, signals?.timeoutAbortSignal);
    const abortPromise = timeoutOrCancelSignal.signal ? new Promise((_resolve, reject) => {
      listener = () => reject(/* @__PURE__ */ new Error("Abort"));
      timeoutOrCancelSignal.signal?.addEventListener("abort", listener, { once: true });
    }) : void 0;
    while ((startedTasksCount === 0 || Object.keys(executingTasksMap).length > 0) && tasks.length) {
      for (; Object.values(executingTasksMap).length < (maxConcurrency ?? tasks.length) && startedTasksCount < tasks.length; startedTasksCount += 1) {
        const task2 = tasks[startedTasksCount];
        executingTasksMap[task2.id] = _runWithRetry(task2, retryPolicy, { [CONFIG_KEY_CALL]: call?.bind(thisCall, this, task2) }, signals?.composedAbortSignal).catch((error) => {
          return {
            task: task2,
            error,
            signalAborted: signals?.composedAbortSignal?.aborted
          };
        });
      }
      const settledTask = await Promise.race([
        ...Object.values(executingTasksMap),
        ...abortPromise ? [abortPromise] : [],
        barrier.wait
      ]);
      if (settledTask === PROMISE_ADDED_SYMBOL) continue;
      const settled = settledTask;
      const { task: settledPregelTask, error: settledError } = settled;
      if (settledError !== void 0 && !isGraphBubbleUp(settledError) && !this.loop.isErrorHandlerNode(String(settledPregelTask.name)) && this.loop.getErrorHandlerNode(String(settledPregelTask.name)) !== void 0) {
        const handlerTask = this.loop.scheduleErrorHandler(settledPregelTask, settledError);
        if (handlerTask !== void 0) {
          executingTasksMap[handlerTask.id] = _runWithRetry(handlerTask, retryPolicy, { [CONFIG_KEY_CALL]: call?.bind(thisCall, this, handlerTask) }, signals?.composedAbortSignal).catch((error) => {
            return {
              task: handlerTask,
              error,
              signalAborted: signals?.composedAbortSignal?.aborted
            };
          });
          barrier.next();
        }
      }
      yield settled;
      if (listener != null) {
        timeoutOrCancelSignal.signal?.removeEventListener("abort", listener);
        timeoutOrCancelSignal.dispose?.();
      }
      delete executingTasksMap[settledTask.task.id];
    }
  }
  /**
  * Whether a failed task should record {@link ERROR_SOURCE_NODE} provenance.
  */
  _shouldRouteToErrorHandler(task2) {
    const name = String(task2.name);
    if (this.loop.isErrorHandlerNode(name)) return false;
    return this.loop.getErrorHandlerNode(name) !== void 0;
  }
  /**
  * Determines what writes to apply based on whether the task completed successfully, and what type of error occurred.
  *
  * Throws an error if the error is a {@link GraphBubbleUp} error and {@link PregelLoop}#isNested is true.
  *
  * @param task - The task to commit.
  * @param error - The error that occurred, if any.
  */
  _commit(task2, error) {
    if (error !== void 0) if (isGraphInterrupt(error)) {
      if (error.interrupts.length) {
        const interrupts = error.interrupts.map((interrupt2) => [INTERRUPT$1, interrupt2]);
        const resumes = task2.writes.filter((w) => w[0] === RESUME$1);
        if (resumes.length) interrupts.push(...resumes);
        this.loop.putWrites(task2.id, interrupts);
      }
    } else if (isGraphDrained(error)) {
      if (task2.writes.length) this.loop.putWrites(task2.id, task2.writes);
    } else if (isGraphBubbleUp(error) && task2.writes.length) this.loop.putWrites(task2.id, task2.writes);
    else {
      task2.writes.push([ERROR$1, {
        message: error.message,
        name: error.name
      }]);
      if (this._shouldRouteToErrorHandler(task2)) {
        task2.writes.push([ERROR_SOURCE_NODE, String(task2.name)]);
        this.handledExceptions.add(error);
      }
      this.loop.putWrites(task2.id, task2.writes);
    }
    else {
      if (this.nodeFinished && (task2.config?.tags == null || !task2.config.tags.includes("langsmith:hidden"))) this.nodeFinished(String(task2.name));
      if (task2.writes.length === 0) task2.writes.push([NO_WRITES, null]);
      this.loop.putWrites(task2.id, task2.writes);
    }
  }
};
async function call(runner, task2, func, name, input, options = {}) {
  const scratchpad = task2.config?.configurable?.[CONFIG_KEY_SCRATCHPAD];
  if (!scratchpad) throw new Error(`BUG: No scratchpad found on task ${task2.name}__${task2.id}`);
  const cnt = scratchpad.callCounter;
  scratchpad.callCounter += 1;
  const wcall = new Call({
    func,
    name,
    input,
    cache: options.cache,
    retry: options.retry,
    timeout: options.timeout,
    callbacks: options.callbacks
  });
  const nextTask = await this.scheduleTask(task2, cnt, wcall);
  if (!nextTask) return void 0;
  const existingPromise = this.executingTasksMap[nextTask.id];
  if (existingPromise !== void 0) return existingPromise;
  if (nextTask.writes.length > 0) {
    const returns = nextTask.writes.filter(([c]) => c === RETURN);
    const errors = nextTask.writes.filter(([c]) => c === ERROR$1);
    if (returns.length > 0) {
      if (returns.length === 1) return Promise.resolve(returns[0][1]);
      throw new Error(`BUG: multiple returns found for task ${nextTask.name}__${nextTask.id}`);
    }
    if (errors.length > 0) {
      if (errors.length === 1) {
        const errorValue = errors[0][1];
        const error = errorValue instanceof Error ? errorValue : new Error(String(errorValue));
        return Promise.reject(error);
      }
      throw new Error(`BUG: multiple errors found for task ${nextTask.name}__${nextTask.id}`);
    }
    return;
  } else {
    const prom = _runWithRetry(nextTask, options.retry, { [CONFIG_KEY_CALL]: call.bind(this, runner, nextTask) });
    this.executingTasksMap[nextTask.id] = prom;
    this.barrier.next();
    return prom.then(({ result, error }) => {
      if (error) return Promise.reject(error);
      return result;
    });
  }
}
var GraphValidationError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "GraphValidationError";
  }
};
function validateGraph({ nodes, channels, inputChannels, outputChannels, streamChannels, interruptAfterNodes, interruptBeforeNodes }) {
  if (!channels) throw new GraphValidationError("Channels not provided");
  const subscribedChannels = /* @__PURE__ */ new Set();
  const allOutputChannels = /* @__PURE__ */ new Set();
  for (const [name, node] of Object.entries(nodes)) {
    if (name === "__interrupt__") throw new GraphValidationError(`"Node name ${INTERRUPT$1} is reserved"`);
    if (node.constructor === PregelNode) node.triggers.forEach((trigger) => subscribedChannels.add(trigger));
    else throw new GraphValidationError(`Invalid node type ${typeof node}, expected PregelNode`);
  }
  for (const chan of subscribedChannels) if (!(chan in channels)) throw new GraphValidationError(`Subscribed channel '${String(chan)}' not in channels`);
  if (!Array.isArray(inputChannels)) {
    if (!subscribedChannels.has(inputChannels)) throw new GraphValidationError(`Input channel ${String(inputChannels)} is not subscribed to by any node`);
  } else if (inputChannels.every((channel) => !subscribedChannels.has(channel))) throw new GraphValidationError(`None of the input channels ${inputChannels} are subscribed to by any node`);
  if (!Array.isArray(outputChannels)) allOutputChannels.add(outputChannels);
  else outputChannels.forEach((chan) => allOutputChannels.add(chan));
  if (streamChannels && !Array.isArray(streamChannels)) allOutputChannels.add(streamChannels);
  else if (Array.isArray(streamChannels)) streamChannels.forEach((chan) => allOutputChannels.add(chan));
  for (const chan of allOutputChannels) if (!(chan in channels)) throw new GraphValidationError(`Output channel '${String(chan)}' not in channels`);
  if (interruptAfterNodes && interruptAfterNodes !== "*") {
    for (const node of interruptAfterNodes) if (!(node in nodes)) throw new GraphValidationError(`Node ${String(node)} not in nodes`);
  }
  if (interruptBeforeNodes && interruptBeforeNodes !== "*") {
    for (const node of interruptBeforeNodes) if (!(node in nodes)) throw new GraphValidationError(`Node ${String(node)} not in nodes`);
  }
}
function validateKeys(keys, channels) {
  if (Array.isArray(keys)) {
    for (const key of keys) if (!(key in channels)) throw new Error(`Key ${String(key)} not found in channels`);
  } else if (!(keys in channels)) throw new Error(`Key ${String(keys)} not found in channels`);
}
var Topic = class Topic2 extends BaseChannel {
  lc_graph_name = "Topic";
  unique = false;
  accumulate = false;
  seen;
  values;
  constructor(fields) {
    super();
    this.unique = fields?.unique ?? this.unique;
    this.accumulate = fields?.accumulate ?? this.accumulate;
    this.seen = /* @__PURE__ */ new Set();
    this.values = [];
  }
  fromCheckpoint(checkpoint) {
    const empty = new Topic2({
      unique: this.unique,
      accumulate: this.accumulate
    });
    if (typeof checkpoint !== "undefined") {
      empty.seen = new Set(checkpoint[0]);
      empty.values = checkpoint[1];
    }
    return empty;
  }
  update(values) {
    let updated = false;
    if (!this.accumulate) {
      updated = this.values.length > 0;
      this.values = [];
    }
    const flatValues = values.flat();
    if (flatValues.length > 0) if (this.unique) {
      for (const value of flatValues) if (!this.seen.has(value)) {
        updated = true;
        this.seen.add(value);
        this.values.push(value);
      }
    } else {
      updated = true;
      this.values.push(...flatValues);
    }
    return updated;
  }
  get() {
    if (this.values.length === 0) throw new EmptyChannelError();
    return this.values;
  }
  checkpoint() {
    return [[...this.seen], this.values];
  }
  isAvailable() {
    return this.values.length !== 0;
  }
};
function protocolEventsToEventStream(run) {
  const encoder = new TextEncoder();
  return new ReadableStream({ async start(controller) {
    try {
      for await (const event of run) {
        const namespace = event.params.namespace;
        const eventName = namespace.length ? `${event.method}|${namespace.join("|")}` : event.method;
        controller.enqueue(encoder.encode(`event: ${eventName}
data: ${JSON.stringify(event.params.data ?? {})}

`));
      }
    } catch (error) {
      controller.enqueue(encoder.encode(`event: error
data: ${JSON.stringify({ message: String(error) })}

`));
    } finally {
      controller.close();
    }
  } });
}
var Channel = class {
  static subscribeTo(channels, options) {
    const { key, tags } = {
      key: void 0,
      tags: void 0,
      ...options ?? {}
    };
    if (Array.isArray(channels) && key !== void 0) throw new Error("Can't specify a key when subscribing to multiple channels");
    let channelMappingOrArray;
    if (typeof channels === "string") if (key) channelMappingOrArray = { [key]: channels };
    else channelMappingOrArray = [channels];
    else channelMappingOrArray = Object.fromEntries(channels.map((chan) => [chan, chan]));
    return new PregelNode({
      channels: channelMappingOrArray,
      triggers: Array.isArray(channels) ? channels : [channels],
      tags
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
  static writeTo(channels, writes) {
    const channelWriteEntries = [];
    for (const channel of channels) channelWriteEntries.push({
      channel,
      value: PASSTHROUGH,
      skipNone: false
    });
    for (const [key, value] of Object.entries(writes ?? {})) if (Runnable.isRunnable(value) || typeof value === "function") channelWriteEntries.push({
      channel: key,
      value: PASSTHROUGH,
      skipNone: true,
      mapper: _coerceToRunnable(value)
    });
    else channelWriteEntries.push({
      channel: key,
      value,
      skipNone: false
    });
    return new ChannelWrite(channelWriteEntries);
  }
};
var PartialRunnable = class extends Runnable {
  lc_namespace = ["langgraph", "pregel"];
  invoke(_input, _options) {
    throw new Error("Not implemented");
  }
  withConfig(_config) {
    return super.withConfig(_config);
  }
  stream(input, options) {
    return super.stream(input, options);
  }
};
var Pregel = class extends PartialRunnable {
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
  lg_is_pregel = true;
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
  autoValidate = true;
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
  debug = false;
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
  constructor(fields) {
    super(fields);
    let { streamMode } = fields;
    if (streamMode != null && !Array.isArray(streamMode)) streamMode = [streamMode];
    this.nodes = fields.nodes;
    this.channels = fields.channels;
    if ("__pregel_tasks" in this.channels && "lc_graph_name" in this.channels["__pregel_tasks"] && this.channels["__pregel_tasks"].lc_graph_name !== "Topic") throw new Error(`Channel '${TASKS$1}' is reserved and cannot be used in the graph.`);
    else this.channels[TASKS$1] = new Topic({ accumulate: false });
    this.autoValidate = fields.autoValidate ?? this.autoValidate;
    this.streamMode = streamMode ?? this.streamMode;
    this.inputChannels = fields.inputChannels;
    this.outputChannels = fields.outputChannels;
    this.streamChannels = fields.streamChannels ?? this.streamChannels;
    this.interruptAfter = fields.interruptAfter;
    this.interruptBefore = fields.interruptBefore;
    this.stepTimeout = fields.stepTimeout ?? this.stepTimeout;
    this.debug = fields.debug ?? this.debug;
    this.checkpointer = fields.checkpointer;
    this.retryPolicy = fields.retryPolicy;
    this.config = fields.config;
    this.store = fields.store;
    this.cache = fields.cache;
    this.name = fields.name;
    this.triggerToNodes = fields.triggerToNodes ?? this.triggerToNodes;
    this.userInterrupt = fields.userInterrupt;
    this.streamTransformers = fields.streamTransformers ?? [];
    if (this.autoValidate) this.validate();
  }
  withConfig(config) {
    const { streamTransformers, ...restConfig } = config;
    const mergedConfig = mergeConfigs(this.config, restConfig);
    const mergedStreamTransformers = [...this.streamTransformers, ...streamTransformers ?? []];
    return new this.constructor({
      ...this,
      config: mergedConfig,
      streamTransformers: mergedStreamTransformers
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
    validateGraph({
      nodes: this.nodes,
      channels: this.channels,
      outputChannels: this.outputChannels,
      inputChannels: this.inputChannels,
      streamChannels: this.streamChannels,
      interruptAfterNodes: this.interruptAfter,
      interruptBeforeNodes: this.interruptBefore
    });
    for (const [name, node] of Object.entries(this.nodes)) for (const trigger of node.triggers) {
      this.triggerToNodes[trigger] ??= [];
      this.triggerToNodes[trigger].push(name);
    }
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
    if (Array.isArray(this.streamChannels)) return this.streamChannels;
    else if (this.streamChannels) return [this.streamChannels];
    else return Object.keys(this.channels);
  }
  /**
  * Gets the channels to stream in their original format.
  * If streamChannels is specified, returns it as-is (either single key or array).
  * Otherwise, returns all channels in the graph as an array.
  *
  * @returns Channel keys to stream, either as a single key or array
  */
  get streamChannelsAsIs() {
    if (this.streamChannels) return this.streamChannels;
    else return Object.keys(this.channels);
  }
  /**
  * Gets a drawable representation of the graph structure.
  * This is an async version of getGraph() and is the preferred method to use.
  *
  * @param config - Configuration for generating the graph visualization
  * @returns A representation of the graph that can be visualized
  */
  async getGraphAsync(config) {
    return this.getGraph(config);
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
  *getSubgraphs(namespace, recurse) {
    for (const [name, node] of Object.entries(this.nodes)) {
      if (namespace !== void 0) {
        if (!namespace.startsWith(name)) continue;
      }
      const candidates = node.subgraphs?.length ? node.subgraphs : [node.bound];
      for (const candidate of candidates) {
        const graph = findSubgraphPregel(candidate);
        if (graph !== void 0) {
          if (name === namespace) {
            yield [name, graph];
            return;
          }
          if (namespace === void 0) yield [name, graph];
          if (recurse) {
            let newNamespace = namespace;
            if (namespace !== void 0) newNamespace = namespace.slice(name.length + 1);
            for (const [subgraphName, subgraph] of graph.getSubgraphs(newNamespace, recurse)) yield [`${name}|${subgraphName}`, subgraph];
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
  async *getSubgraphsAsync(namespace, recurse) {
    yield* this.getSubgraphs(namespace, recurse);
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
  async _prepareStateSnapshot({ config, saved, subgraphCheckpointer, applyPendingWrites = false }) {
    if (saved === void 0) return {
      values: {},
      next: [],
      config,
      tasks: []
    };
    const channels = await channelsFromCheckpoint(this.channels, saved.checkpoint, {
      saver: typeof this.checkpointer === "object" ? this.checkpointer : void 0,
      config: saved.config ?? config
    });
    if (saved.pendingWrites?.length) {
      const nullWrites = saved.pendingWrites.filter(([taskId, _]) => taskId === NULL_TASK_ID).map(([_, channel, value]) => [String(channel), value]);
      if (nullWrites.length > 0) _applyWrites(saved.checkpoint, channels, [{
        name: INPUT,
        writes: nullWrites,
        triggers: []
      }], void 0, this.triggerToNodes);
    }
    const nextTasks = Object.values(_prepareNextTasks(saved.checkpoint, saved.pendingWrites, this.nodes, channels, saved.config, true, {
      step: (saved.metadata?.step ?? -1) + 1,
      store: this.store
    }));
    const subgraphs = await gatherIterator(this.getSubgraphsAsync());
    const parentNamespace = saved.config.configurable?.checkpoint_ns ?? "";
    const taskStates = {};
    for (const task2 of nextTasks) {
      const matchingSubgraph = subgraphs.find(([name]) => name === task2.name);
      if (!matchingSubgraph) continue;
      let taskNs = `${String(task2.name)}:${task2.id}`;
      if (parentNamespace) taskNs = `${parentNamespace}|${taskNs}`;
      if (subgraphCheckpointer === void 0) {
        const config2 = { configurable: {
          thread_id: saved.config.configurable?.thread_id,
          checkpoint_ns: taskNs
        } };
        taskStates[task2.id] = config2;
      } else {
        const subgraphConfig = { configurable: {
          [CONFIG_KEY_CHECKPOINTER]: subgraphCheckpointer,
          thread_id: saved.config.configurable?.thread_id,
          checkpoint_ns: taskNs
        } };
        const pregel = matchingSubgraph[1];
        taskStates[task2.id] = await pregel.getState(subgraphConfig, { subgraphs: true });
      }
    }
    if (applyPendingWrites && saved.pendingWrites?.length) {
      const nextTaskById = Object.fromEntries(nextTasks.map((task2) => [task2.id, task2]));
      for (const [taskId, channel, value] of saved.pendingWrites) {
        if ([
          "__error__",
          "__interrupt__",
          SCHEDULED
        ].includes(channel)) continue;
        if (!(taskId in nextTaskById)) continue;
        nextTaskById[taskId].writes.push([String(channel), value]);
      }
      const tasksWithWrites2 = nextTasks.filter((task2) => task2.writes.length > 0);
      if (tasksWithWrites2.length > 0) _applyWrites(saved.checkpoint, channels, tasksWithWrites2, void 0, this.triggerToNodes);
    }
    let metadata = saved?.metadata;
    if (metadata && saved?.config?.configurable?.thread_id) metadata = {
      ...metadata,
      thread_id: saved.config.configurable.thread_id
    };
    const nextList = nextTasks.filter((task2) => task2.writes.length === 0).map((task2) => task2.name);
    return {
      values: readChannels(channels, this.streamChannelsAsIs),
      next: nextList,
      tasks: tasksWithWrites(nextTasks, saved?.pendingWrites ?? [], taskStates, this.streamChannelsAsIs),
      metadata,
      config: patchCheckpointMap(saved.config, saved.metadata),
      createdAt: saved.checkpoint.ts,
      parentConfig: saved.parentConfig
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
  async getState(config, options) {
    const checkpointer = config.configurable?.["__pregel_checkpointer"] ?? this.checkpointer;
    if (!checkpointer) throw new GraphValueError("No checkpointer set", { lc_error_code: "MISSING_CHECKPOINTER" });
    const checkpointNamespace = config.configurable?.checkpoint_ns ?? "";
    if (checkpointNamespace !== "" && config.configurable?.["__pregel_read"] === void 0 && config.configurable?.["__pregel_checkpointer"] === void 0) {
      const recastNamespace = recastCheckpointNamespace(checkpointNamespace);
      for await (const [name, subgraph] of this.getSubgraphsAsync(recastNamespace, true)) if (name === recastNamespace) return await subgraph.getState(patchConfigurable$1(config, { [CONFIG_KEY_CHECKPOINTER]: checkpointer }), { subgraphs: options?.subgraphs });
    }
    const mergedConfig = mergeConfigs(this.config, config);
    const saved = await checkpointer.getTuple(config);
    return await this._prepareStateSnapshot({
      config: mergedConfig,
      saved,
      subgraphCheckpointer: options?.subgraphs ? checkpointer : void 0,
      applyPendingWrites: !config.configurable?.checkpoint_id
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
  async *getStateHistory(config, options) {
    const checkpointer = config.configurable?.["__pregel_checkpointer"] ?? this.checkpointer;
    if (!checkpointer) throw new GraphValueError("No checkpointer set", { lc_error_code: "MISSING_CHECKPOINTER" });
    const checkpointNamespace = config.configurable?.checkpoint_ns ?? "";
    if (checkpointNamespace !== "" && config.configurable?.["__pregel_checkpointer"] === void 0) {
      const recastNamespace = recastCheckpointNamespace(checkpointNamespace);
      for await (const [name, pregel] of this.getSubgraphsAsync(recastNamespace, true)) if (name === recastNamespace) {
        yield* pregel.getStateHistory(patchConfigurable$1(config, { [CONFIG_KEY_CHECKPOINTER]: checkpointer }), options);
        return;
      }
    }
    const mergedConfig = mergeConfigs(this.config, config, { configurable: { checkpoint_ns: checkpointNamespace } });
    for await (const checkpointTuple of checkpointer.list(mergedConfig, options)) yield this._prepareStateSnapshot({
      config: checkpointTuple.config,
      saved: checkpointTuple
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
  async bulkUpdateState(startConfig, supersteps) {
    const checkpointer = startConfig.configurable?.["__pregel_checkpointer"] ?? this.checkpointer;
    if (!checkpointer) throw new GraphValueError("No checkpointer set", { lc_error_code: "MISSING_CHECKPOINTER" });
    if (supersteps.length === 0) throw new Error("No supersteps provided");
    if (supersteps.some((s) => s.updates.length === 0)) throw new Error("No updates provided");
    const checkpointNamespace = startConfig.configurable?.checkpoint_ns ?? "";
    if (checkpointNamespace !== "" && startConfig.configurable?.["__pregel_checkpointer"] === void 0) {
      const recastNamespace = recastCheckpointNamespace(checkpointNamespace);
      for await (const [, pregel] of this.getSubgraphsAsync(recastNamespace, true)) return await pregel.bulkUpdateState(patchConfigurable$1(startConfig, { [CONFIG_KEY_CHECKPOINTER]: checkpointer }), supersteps);
      throw new Error(`Subgraph "${recastNamespace}" not found`);
    }
    const updateSuperStep = async (inputConfig, updates) => {
      const config = this.config ? mergeConfigs(this.config, inputConfig) : inputConfig;
      const saved = await checkpointer.getTuple(config);
      const checkpoint = saved !== void 0 ? copyCheckpoint(saved.checkpoint) : emptyCheckpoint();
      const checkpointPreviousVersions = { ...saved?.checkpoint.channel_versions };
      const step = saved?.metadata?.step ?? -1;
      let checkpointConfig = patchConfigurable$1(config, { checkpoint_ns: config.configurable?.checkpoint_ns ?? "" });
      let checkpointMetadata = config.metadata ?? {};
      if (saved?.config.configurable) {
        checkpointConfig = patchConfigurable$1(config, saved.config.configurable);
        checkpointMetadata = {
          ...saved.metadata,
          ...checkpointMetadata
        };
      }
      const { values, asNode } = updates[0];
      if (values == null && asNode === void 0) {
        if (updates.length > 1) throw new InvalidUpdateError(`Cannot create empty checkpoint with multiple updates`);
        return patchCheckpointMap(await checkpointer.put(checkpointConfig, createCheckpoint(checkpoint, void 0, step), {
          source: "update",
          step: step + 1,
          parents: saved?.metadata?.parents ?? {}
        }, {}), saved ? saved.metadata : void 0);
      }
      const channels = await channelsFromCheckpoint(this.channels, checkpoint, {
        saver: checkpointer,
        config: saved?.config ?? checkpointConfig
      });
      if (values === null && asNode === "__end__") {
        if (updates.length > 1) throw new InvalidUpdateError(`Cannot apply multiple updates when clearing state`);
        if (saved) {
          const nextTasks = _prepareNextTasks(checkpoint, saved.pendingWrites || [], this.nodes, channels, saved.config, true, {
            step: (saved.metadata?.step ?? -1) + 1,
            checkpointer,
            store: this.store
          });
          const nullWrites = (saved.pendingWrites || []).filter((w) => w[0] === NULL_TASK_ID).map((w) => w.slice(1));
          if (nullWrites.length > 0) _applyWrites(checkpoint, channels, [{
            name: INPUT,
            writes: nullWrites,
            triggers: []
          }], checkpointer.getNextVersion.bind(checkpointer), this.triggerToNodes);
          for (const [taskId, k, v] of saved.pendingWrites || []) {
            if ([
              "__error__",
              "__interrupt__",
              SCHEDULED
            ].includes(k)) continue;
            if (!(taskId in nextTasks)) continue;
            nextTasks[taskId].writes.push([k, v]);
          }
          _applyWrites(checkpoint, channels, Object.values(nextTasks), checkpointer.getNextVersion.bind(checkpointer), this.triggerToNodes);
        }
        return patchCheckpointMap(await checkpointer.put(checkpointConfig, createCheckpoint(checkpoint, channels, step), {
          ...checkpointMetadata,
          source: "update",
          step: step + 1,
          parents: saved?.metadata?.parents ?? {}
        }, getNewChannelVersions(checkpointPreviousVersions, checkpoint.channel_versions)), saved ? saved.metadata : void 0);
      }
      if (asNode === "__copy__") {
        if (updates.length > 1) throw new InvalidUpdateError(`Cannot copy checkpoint with multiple updates`);
        if (saved == null) throw new InvalidUpdateError(`Cannot copy a non-existent checkpoint`);
        const isCopyWithUpdates = (values2) => {
          if (!Array.isArray(values2)) return false;
          if (values2.length === 0) return false;
          return values2.every((v) => Array.isArray(v) && v.length === 2);
        };
        const nextCheckpoint = createCheckpoint(checkpoint, void 0, step);
        const nextConfig2 = await checkpointer.put(saved.parentConfig ?? patchConfigurable$1(saved.config, { checkpoint_id: void 0 }), nextCheckpoint, {
          source: "fork",
          step: step + 1,
          parents: saved.metadata?.parents ?? {}
        }, {});
        if (isCopyWithUpdates(values)) {
          const nextTasks = _prepareNextTasks(nextCheckpoint, saved.pendingWrites, this.nodes, channels, nextConfig2, false, { step: step + 2 });
          const tasksGroupBy = Object.values(nextTasks).reduce((acc, { name, id }) => {
            acc[name] ??= [];
            acc[name].push({ id });
            return acc;
          }, {});
          const userGroupBy = values.reduce((acc, item) => {
            const [values2, asNode2] = item;
            acc[asNode2] ??= [];
            const targetIdx = acc[asNode2].length;
            const taskId = tasksGroupBy[asNode2]?.[targetIdx]?.id;
            acc[asNode2].push({
              values: values2,
              asNode: asNode2,
              taskId
            });
            return acc;
          }, {});
          return updateSuperStep(patchCheckpointMap(nextConfig2, saved.metadata), Object.values(userGroupBy).flat());
        }
        return patchCheckpointMap(nextConfig2, saved.metadata);
      }
      if (asNode === "__input__") {
        if (updates.length > 1) throw new InvalidUpdateError(`Cannot apply multiple updates when updating as input`);
        const inputWrites = await gatherIterator(mapInput(this.inputChannels, values));
        if (inputWrites.length === 0) throw new InvalidUpdateError(`Received no input writes for ${JSON.stringify(this.inputChannels, null, 2)}`);
        _applyWrites(checkpoint, channels, [{
          name: INPUT,
          writes: inputWrites,
          triggers: []
        }], checkpointer.getNextVersion.bind(this.checkpointer), this.triggerToNodes);
        const nextStep = saved?.metadata?.step != null ? saved.metadata.step + 1 : -1;
        const nextConfig2 = await checkpointer.put(checkpointConfig, createCheckpoint(checkpoint, channels, nextStep), {
          source: "input",
          step: nextStep,
          parents: saved?.metadata?.parents ?? {}
        }, getNewChannelVersions(checkpointPreviousVersions, checkpoint.channel_versions));
        await checkpointer.putWrites(nextConfig2, inputWrites, uuid5(INPUT, checkpoint.id));
        return patchCheckpointMap(nextConfig2, saved ? saved.metadata : void 0);
      }
      if (config.configurable?.checkpoint_id === void 0 && saved?.pendingWrites !== void 0 && saved.pendingWrites.length > 0) {
        const nextTasks = _prepareNextTasks(checkpoint, saved.pendingWrites, this.nodes, channels, saved.config, true, {
          store: this.store,
          checkpointer: this.checkpointer,
          step: (saved.metadata?.step ?? -1) + 1
        });
        const nullWrites = (saved.pendingWrites ?? []).filter((w) => w[0] === NULL_TASK_ID).map((w) => w.slice(1));
        if (nullWrites.length > 0) _applyWrites(saved.checkpoint, channels, [{
          name: INPUT,
          writes: nullWrites,
          triggers: []
        }], void 0, this.triggerToNodes);
        for (const [tid, k, v] of saved.pendingWrites) {
          if ([
            "__error__",
            "__interrupt__",
            SCHEDULED
          ].includes(k) || nextTasks[tid] === void 0) continue;
          nextTasks[tid].writes.push([k, v]);
        }
        const tasks2 = Object.values(nextTasks).filter((task2) => {
          return task2.writes.length > 0;
        });
        if (tasks2.length > 0) _applyWrites(checkpoint, channels, tasks2, void 0, this.triggerToNodes);
      }
      const nonNullVersion = Object.values(checkpoint.versions_seen).map((seenVersions) => {
        return Object.values(seenVersions);
      }).flat().find((v) => !!v);
      const validUpdates = [];
      if (updates.length === 1) {
        let { values: values2, asNode: asNode2, taskId } = updates[0];
        if (asNode2 === void 0 && Object.keys(this.nodes).length === 1) [asNode2] = Object.keys(this.nodes);
        else if (asNode2 === void 0 && nonNullVersion === void 0) {
          if (typeof this.inputChannels === "string" && this.nodes[this.inputChannels] !== void 0) asNode2 = this.inputChannels;
        } else if (asNode2 === void 0) {
          const lastSeenByNode = Object.entries(checkpoint.versions_seen).map(([n2, seen]) => {
            return Object.values(seen).map((v) => {
              return [v, n2];
            });
          }).flat().filter(([_, v]) => v !== INTERRUPT$1).sort(([aNumber], [bNumber]) => compareChannelVersions(aNumber, bNumber));
          if (lastSeenByNode) {
            if (lastSeenByNode.length === 1) asNode2 = lastSeenByNode[0][1];
            else if (lastSeenByNode[lastSeenByNode.length - 1][0] !== lastSeenByNode[lastSeenByNode.length - 2][0]) asNode2 = lastSeenByNode[lastSeenByNode.length - 1][1];
          }
        }
        if (asNode2 === void 0) throw new InvalidUpdateError(`Ambiguous update, specify "asNode"`);
        validUpdates.push({
          values: values2,
          asNode: asNode2,
          taskId
        });
      } else for (const { asNode: asNode2, values: values2, taskId } of updates) {
        if (asNode2 == null) throw new InvalidUpdateError(`"asNode" is required when applying multiple updates`);
        validUpdates.push({
          values: values2,
          asNode: asNode2,
          taskId
        });
      }
      const tasks = [];
      for (const { asNode: asNode2, values: values2, taskId } of validUpdates) {
        if (this.nodes[asNode2] === void 0) throw new InvalidUpdateError(`Node "${asNode2.toString()}" does not exist`);
        const writers = this.nodes[asNode2].getWriters();
        if (!writers.length) throw new InvalidUpdateError(`No writers found for node "${asNode2.toString()}"`);
        tasks.push({
          name: asNode2,
          input: values2,
          proc: writers.length > 1 ? RunnableSequence.from(writers, { omitSequenceTags: true }) : writers[0],
          writes: [],
          triggers: [INTERRUPT$1],
          id: taskId ?? uuid5("__interrupt__", checkpoint.id),
          writers: []
        });
      }
      for (const task2 of tasks) await task2.proc.invoke(task2.input, patchConfig({
        ...config,
        store: config?.store ?? this.store
      }, {
        runName: config.runName ?? `${this.getName()}UpdateState`,
        configurable: {
          [CONFIG_KEY_SEND]: (items) => task2.writes.push(...items),
          [CONFIG_KEY_READ]: (select_, fresh_ = false) => _localRead(checkpoint, channels, task2, select_, fresh_)
        }
      }));
      for (const task2 of tasks) {
        const channelWrites = task2.writes.filter((w) => w[0] !== PUSH);
        if (saved !== void 0 && channelWrites.length > 0) await checkpointer.putWrites(checkpointConfig, channelWrites, task2.id);
      }
      _applyWrites(checkpoint, channels, tasks, checkpointer.getNextVersion.bind(this.checkpointer), this.triggerToNodes);
      const newVersions = getNewChannelVersions(checkpointPreviousVersions, checkpoint.channel_versions);
      const nextConfig = await checkpointer.put(checkpointConfig, createCheckpoint(checkpoint, channels, step + 1), {
        source: "update",
        step: step + 1,
        parents: saved?.metadata?.parents ?? {}
      }, newVersions);
      for (const task2 of tasks) {
        const pushWrites = task2.writes.filter((w) => w[0] === PUSH);
        if (pushWrites.length > 0) await checkpointer.putWrites(nextConfig, pushWrites, task2.id);
      }
      return patchCheckpointMap(nextConfig, saved ? saved.metadata : void 0);
    };
    let currentConfig = startConfig;
    for (const { updates } of supersteps) currentConfig = await updateSuperStep(currentConfig, updates);
    return currentConfig;
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
  async updateState(inputConfig, values, asNode) {
    return this.bulkUpdateState(inputConfig, [{ updates: [{
      values,
      asNode
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
  _defaults(config) {
    const { debug, streamMode, inputKeys, outputKeys, interruptAfter, interruptBefore, ...rest } = config;
    let streamModeSingle = true;
    const defaultDebug = debug !== void 0 ? debug : this.debug;
    let defaultOutputKeys = outputKeys;
    if (defaultOutputKeys === void 0) defaultOutputKeys = this.streamChannelsAsIs;
    else validateKeys(defaultOutputKeys, this.channels);
    let defaultInputKeys = inputKeys;
    if (defaultInputKeys === void 0) defaultInputKeys = this.inputChannels;
    else validateKeys(defaultInputKeys, this.channels);
    const defaultInterruptBefore = interruptBefore ?? this.interruptBefore ?? [];
    const defaultInterruptAfter = interruptAfter ?? this.interruptAfter ?? [];
    let defaultStreamMode;
    if (streamMode !== void 0) {
      defaultStreamMode = Array.isArray(streamMode) ? streamMode : [streamMode];
      streamModeSingle = typeof streamMode === "string";
    } else {
      if (config.configurable?.["__pregel_task_id"] !== void 0) defaultStreamMode = ["values"];
      else defaultStreamMode = this.streamMode;
      streamModeSingle = true;
    }
    let defaultCheckpointer;
    if (this.checkpointer === false) defaultCheckpointer = void 0;
    else if (config !== void 0 && config.configurable?.["__pregel_checkpointer"] !== void 0) defaultCheckpointer = config.configurable[CONFIG_KEY_CHECKPOINTER];
    else if (this.checkpointer === true) throw new Error("checkpointer: true cannot be used for root graphs.");
    else defaultCheckpointer = this.checkpointer;
    const defaultStore = config.store ?? this.store;
    const defaultCache = config.cache ?? this.cache;
    if (config.durability != null && config.checkpointDuring != null) throw new Error("Cannot use both `durability` and `checkpointDuring` at the same time.");
    const checkpointDuringDurability = (() => {
      if (config.checkpointDuring == null) return void 0;
      if (config.checkpointDuring === false) return "exit";
      return "async";
    })();
    const defaultDurability = config.durability ?? checkpointDuringDurability ?? config?.configurable?.["__pregel_durability"] ?? "async";
    return [
      defaultDebug,
      defaultStreamMode,
      defaultInputKeys,
      defaultOutputKeys,
      rest,
      defaultInterruptBefore,
      defaultInterruptAfter,
      defaultCheckpointer,
      defaultStore,
      streamModeSingle,
      defaultCache,
      defaultDurability
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
  async stream(input, options) {
    const abortController = new AbortController();
    const ambientConfigurable = getConfig()?.configurable;
    if (ambientConfigurable?.["__pregel_read"] !== void 0 && options?.configurable?.["__pregel_read"] === void 0) options = {
      ...options,
      configurable: {
        ...ambientConfigurable,
        ...options?.configurable
      }
    };
    const config = {
      recursionLimit: this.config?.recursionLimit,
      ...options,
      signal: combineAbortSignals(options?.signal, abortController.signal).signal
    };
    const stream = await super.stream(input, config);
    return new IterableReadableStreamWithAbortSignal(options?.encoding === "text/event-stream" ? toEventStream(stream) : stream, abortController);
  }
  async #streamEventsV3(input, options) {
    const { version, encoding, transformers: userTransformers, ...restOptions } = options;
    const streamOptions = {
      recursionLimit: this.config?.recursionLimit,
      ...restOptions,
      configurable: {
        ...this.config?.configurable,
        ...restOptions?.configurable
      },
      version,
      streamMode: STREAM_EVENTS_V3_MODES,
      subgraphs: true,
      encoding: void 0
    };
    const sourcePromise = this.stream(input, streamOptions);
    const graphRun = createGraphRunStream({ [Symbol.asyncIterator]: async function* () {
      const src = await sourcePromise;
      for await (const chunk of src) yield chunk;
    } }, [...this.streamTransformers ?? [], ...userTransformers ?? []]);
    if (encoding === "text/event-stream") {
      const abortController = new AbortController();
      abortController.signal.addEventListener("abort", () => graphRun.abort(abortController.signal.reason), { once: true });
      return new IterableReadableStreamWithAbortSignal(protocolEventsToEventStream(graphRun), abortController);
    }
    return graphRun;
  }
  streamEvents(input, options, streamOptions) {
    if (options.version === "v3") return this.#streamEventsV3(input, options);
    const abortController = new AbortController();
    const config = {
      recursionLimit: this.config?.recursionLimit,
      ...options,
      signal: combineAbortSignals(options?.signal, abortController.signal).signal
    };
    return new IterableReadableStreamWithAbortSignal(super.streamEvents(input, config, streamOptions), abortController);
  }
  /**
  * Validates the input for the graph.
  * @param input - The input to validate
  * @returns The validated input
  * @internal
  */
  async _validateInput(input) {
    return input;
  }
  /**
  * Validates the context options for the graph.
  * @param context - The context options to validate
  * @returns The validated context options
  * @internal
  */
  async _validateContext(context2) {
    return context2;
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
  async *_streamIterator(input, options) {
    const streamEncoding = "version" in (options ?? {}) ? void 0 : options?.encoding ?? void 0;
    const streamSubgraphs = options?.subgraphs;
    const isV3 = options?.version === "v3";
    const inputConfig = ensureLangGraphConfig(this.config, options);
    if (inputConfig.recursionLimit === void 0 || inputConfig.recursionLimit < 1) throw new Error(`Passed "recursionLimit" must be at least 1.`);
    if (this.checkpointer !== void 0 && this.checkpointer !== false && inputConfig.configurable === void 0) throw new Error(`Checkpointer requires one or more of the following "configurable" keys: "thread_id", "checkpoint_ns", "checkpoint_id"`);
    const validInput = await this._validateInput(input);
    const { runId, ...restConfig } = inputConfig;
    const [debug, streamMode, , outputKeys, config, interruptBefore, interruptAfter, checkpointer, store, streamModeSingle, cache, durability] = this._defaults(restConfig);
    config.metadata = {
      ls_integration: "langgraph",
      ...config.metadata
    };
    if (typeof config.context !== "undefined") config.context = await this._validateContext(config.context);
    else config.configurable = await this._validateContext(config.configurable);
    const stream = new IterableReadableWritableStream({ modes: new Set(streamMode) });
    if (this.checkpointer === true) {
      config.configurable ??= {};
      const ns = config.configurable["checkpoint_ns"] ?? "";
      config.configurable[CONFIG_KEY_CHECKPOINT_NS] = ns.split("|").map((part) => part.split(":")[0]).join("|");
    }
    if (streamMode.includes("messages")) {
      const messageStreamer = isV3 ? new StreamProtocolMessagesHandler((chunk) => stream.push(chunk)) : new StreamMessagesHandler((chunk) => stream.push(chunk));
      const { callbacks } = config;
      if (callbacks === void 0) config.callbacks = [messageStreamer];
      else if (Array.isArray(callbacks)) config.callbacks = callbacks.concat(messageStreamer);
      else {
        const copiedCallbacks = callbacks.copy();
        copiedCallbacks.addHandler(messageStreamer, true);
        config.callbacks = copiedCallbacks;
      }
    }
    if (streamMode.includes("tools")) {
      const toolStreamer = new StreamToolsHandler((chunk) => stream.push(chunk));
      const { callbacks } = config;
      if (callbacks === void 0) config.callbacks = [toolStreamer];
      else if (Array.isArray(callbacks)) config.callbacks = callbacks.concat(toolStreamer);
      else {
        const copiedCallbacks = callbacks.copy();
        copiedCallbacks.addHandler(toolStreamer, true);
        config.callbacks = copiedCallbacks;
      }
    }
    config.writer ??= (chunk) => {
      if (!streamMode.includes("custom")) return;
      const ns = getConfig()?.configurable?.[CONFIG_KEY_CHECKPOINT_NS]?.split("|").slice(0, -1);
      stream.push([
        ns ?? [],
        "custom",
        chunk
      ]);
    };
    config.interrupt ??= this.userInterrupt ?? interrupt;
    if (config.serverInfo == null) config.serverInfo = _buildServerInfo(config);
    config.control ??= new RunControl();
    const callbackManagerOptions = { tracerInheritableMetadata: _getTracingMetadataDefaults(config) };
    const runManager = await (await CallbackManager._configureSync(config?.callbacks, void 0, config?.tags, void 0, config?.metadata, void 0, callbackManagerOptions))?.handleChainStart(this.toJSON(), _coerceToDict(input, "input"), runId, void 0, void 0, void 0, config?.runName ?? this.getName());
    const channelSpecs = getOnlyChannels(this.channels);
    let loop;
    let loopError;
    const createAndRunLoop = async () => {
      try {
        loop = await PregelLoop.initialize({
          input: validInput,
          config,
          checkpointer,
          nodes: this.nodes,
          channelSpecs,
          outputKeys,
          streamKeys: this.streamChannelsAsIs,
          store,
          cache,
          stream,
          interruptAfter,
          interruptBefore,
          manager: runManager,
          debug: this.debug,
          triggerToNodes: this.triggerToNodes,
          durability
        });
        const runner = new PregelRunner({
          loop,
          nodeFinished: config.configurable?.[CONFIG_KEY_NODE_FINISHED]
        });
        if (options?.subgraphs) loop.config.configurable = {
          ...loop.config.configurable,
          [CONFIG_KEY_STREAM]: loop.stream
        };
        await this._runLoop({
          loop,
          runner,
          debug,
          config
        });
        if (durability === "sync") await Promise.all(loop?.checkpointerPromises ?? []);
      } catch (e) {
        loopError = e;
      } finally {
        try {
          if (loop) {
            await loop.store?.stop();
            await loop.cache?.stop();
          }
          await Promise.all(loop?.checkpointerPromises ?? []);
        } catch (e) {
          loopError = loopError ?? e;
        }
        if (loopError) {
          await new Promise((resolve) => {
            queueMicrotask(resolve);
          });
          stream.error(loopError);
        } else stream.close();
      }
    };
    const runLoopPromise = createAndRunLoop();
    try {
      for await (const chunk of stream) {
        if (chunk === void 0) throw new Error("Data structure error.");
        const [namespace, mode, payload] = chunk;
        const isStreamEvents = "version" in (options ?? {});
        if (streamMode.includes(mode) || mode === "checkpoints" && isCheckpointEnvelope(payload) && (isV3 || isStreamEvents && streamSubgraphs && streamMode.includes("values"))) {
          if (streamEncoding === "text/event-stream") {
            if (streamSubgraphs) yield [
              namespace,
              mode,
              payload
            ];
            else yield [
              null,
              mode,
              payload
            ];
            continue;
          }
          if (streamSubgraphs && !streamModeSingle) yield [
            namespace,
            mode,
            payload
          ];
          else if (!streamModeSingle) yield [mode, payload];
          else if (streamSubgraphs) yield [namespace, payload];
          else yield payload;
        }
      }
    } catch (e) {
      await runManager?.handleChainError(loopError);
      throw e;
    } finally {
      await runLoopPromise;
    }
    await runManager?.handleChainEnd(loop?.output ?? {}, runId, void 0, void 0, void 0);
  }
  /**
  * Run the graph with a single input and config.
  * @param input The input to the graph.
  * @param options The configuration to use for the run.
  */
  async invoke(input, options) {
    const streamMode = options?.streamMode ?? "values";
    const config = {
      ...options,
      outputKeys: options?.outputKeys ?? this.outputChannels,
      streamMode,
      encoding: void 0
    };
    const chunks = [];
    const stream = await this.stream(input, config);
    const interruptChunks = [];
    let latest;
    for await (const chunk of stream) if (streamMode === "values") if (isInterrupted(chunk)) interruptChunks.push(chunk[INTERRUPT$1]);
    else latest = chunk;
    else chunks.push(chunk);
    if (streamMode === "values") {
      if (interruptChunks.length > 0) {
        const interrupts = interruptChunks.flat(1);
        if (latest == null) return { [INTERRUPT$1]: interrupts };
        if (typeof latest === "object") return {
          ...latest,
          [INTERRUPT$1]: interrupts
        };
      }
      return latest;
    }
    return chunks;
  }
  async _runLoop(params) {
    const { loop, runner, debug, config } = params;
    let tickError;
    try {
      while (await loop.tick({ inputKeys: this.inputChannels })) {
        for (const { task: task2 } of await loop._matchCachedWrites()) loop._outputWrites(task2.id, task2.writes, true);
        if (debug) printStepCheckpoint(loop.checkpointMetadata.step, loop.channels, this.streamChannelsList);
        if (debug) printStepTasks(loop.step, Object.values(loop.tasks));
        await runner.tick({
          timeout: this.stepTimeout,
          retryPolicy: this.retryPolicy,
          onStepWrite: (step, writes) => {
            if (debug) printStepWrites(step, writes, this.streamChannelsList);
          },
          maxConcurrency: config.maxConcurrency,
          signal: config.signal
        });
      }
      if (loop.status === "draining") {
        if (loop.control == null) throw new Error("Draining status requires run control");
        throw new GraphDrained(loop.control.drainReason ?? "shutdown");
      }
      if (loop.status === "out_of_steps") throw new GraphRecursionError([
        `Recursion limit of ${config.recursionLimit} reached`,
        "without hitting a stop condition. You can increase the",
        `limit by setting the "recursionLimit" config key.`
      ].join(" "), { lc_error_code: "GRAPH_RECURSION_LIMIT" });
    } catch (e) {
      tickError = e;
      if (!await loop.finishAndHandleError(tickError)) throw e;
    } finally {
      if (tickError === void 0) await loop.finishAndHandleError();
    }
  }
  async clearCache() {
    await this.cache?.clear([]);
  }
};
function _buildServerInfo(config) {
  const metadata = config.metadata ?? {};
  const configurable = config.configurable ?? {};
  const assistantId = configurable.assistant_id ?? metadata.assistant_id;
  const graphId = configurable.graph_id ?? metadata.graph_id;
  const authUserData = configurable.langgraph_auth_user;
  let user;
  if (authUserData != null && typeof authUserData === "object" && "identity" in authUserData) user = authUserData;
  if (assistantId != null || graphId != null || user != null) return {
    assistantId: assistantId != null ? String(assistantId) : "",
    graphId: graphId != null ? String(graphId) : "",
    user
  };
}
const OMITTED_KEYS = /* @__PURE__ */ new Set([
  "key",
  "token",
  "secret",
  "password",
  "auth"
]);
function _excludeAsMetadata(key, value) {
  const keyLower = key.toLowerCase();
  let hasOmittedSubstring = false;
  for (const substr of OMITTED_KEYS) if (keyLower.includes(substr)) {
    hasOmittedSubstring = true;
    break;
  }
  return key.startsWith("__") || !(typeof value === "string" || typeof value === "number" || typeof value === "boolean") || hasOmittedSubstring;
}
function _getTracingMetadataDefaults(config) {
  const configurable = config.configurable;
  if (!configurable) return;
  const metadata = {};
  for (const [key, value] of Object.entries(configurable)) {
    if (_excludeAsMetadata(key, value)) continue;
    metadata[key] = value;
  }
  return Object.keys(metadata).length > 0 ? metadata : void 0;
}
var EphemeralValue = class EphemeralValue2 extends BaseChannel {
  lc_graph_name = "EphemeralValue";
  guard;
  value = [];
  constructor(guard = true) {
    super();
    this.guard = guard;
  }
  fromCheckpoint(checkpoint) {
    const empty = new EphemeralValue2(this.guard);
    if (typeof checkpoint !== "undefined") empty.value = [checkpoint];
    return empty;
  }
  update(values) {
    if (values.length === 0) {
      const updated = this.value.length > 0;
      this.value = [];
      return updated;
    }
    if (values.length !== 1 && this.guard) throw new InvalidUpdateError("EphemeralValue can only receive one value per step.");
    this.value = [values[values.length - 1]];
    return true;
  }
  get() {
    if (this.value.length === 0) throw new EmptyChannelError();
    return this.value[0];
  }
  checkpoint() {
    if (this.value.length === 0) throw new EmptyChannelError();
    return this.value[0];
  }
  isAvailable() {
    return this.value.length !== 0;
  }
};
var Branch = class {
  path;
  ends;
  constructor(options) {
    if (Runnable.isRunnable(options.path)) this.path = options.path;
    else this.path = _coerceToRunnable(options.path);
    this.ends = Array.isArray(options.pathMap) ? options.pathMap.reduce((acc, n2) => {
      acc[n2] = n2;
      return acc;
    }, {}) : options.pathMap;
  }
  run(writer2, reader) {
    return ChannelWrite.registerWriter(new RunnableCallable$1({
      name: "<branch_run>",
      trace: false,
      func: async (input, config) => {
        try {
          return await this._route(input, config, writer2, reader);
        } catch (e) {
          if (e.name === NodeInterrupt.unminifiable_name) console.warn("[WARN]: 'NodeInterrupt' thrown in conditional edge. This is likely a bug in your graph implementation.\nNodeInterrupt should only be thrown inside a node, not in edge conditions.");
          throw e;
        }
      }
    }));
  }
  async _route(input, config, writer2, reader) {
    let result = await this.path.invoke(reader ? reader(config) : input, config);
    if (!Array.isArray(result)) result = [result];
    let destinations;
    if (this.ends) destinations = result.map((r) => _isSend(r) ? r : this.ends[r]);
    else destinations = result;
    if (destinations.some((dest) => !dest)) throw new Error("Branch condition returned unknown or null destination");
    if (destinations.filter(_isSend).some((packet) => packet.node === "__end__")) throw new InvalidUpdateError("Cannot send a packet to the END node");
    return await writer2(destinations, config) ?? input;
  }
};
var Graph$1 = class {
  nodes;
  edges;
  branches;
  entryPoint;
  compiled = false;
  constructor() {
    this.nodes = {};
    this.edges = /* @__PURE__ */ new Set();
    this.branches = {};
  }
  warnIfCompiled(message) {
    if (this.compiled) console.warn(message);
  }
  get allEdges() {
    return this.edges;
  }
  addNode(...args) {
    function isMutlipleNodes(args2) {
      return args2.length >= 1 && typeof args2[0] !== "string";
    }
    const nodes = isMutlipleNodes(args) ? Array.isArray(args[0]) ? args[0] : Object.entries(args[0]) : [[
      args[0],
      args[1],
      args[2]
    ]];
    if (nodes.length === 0) throw new Error("No nodes provided in `addNode`");
    for (const [key, action, options] of nodes) {
      for (const reservedChar of ["|", ":"]) if (key.includes(reservedChar)) throw new Error(`"${reservedChar}" is a reserved character and is not allowed in node names.`);
      this.warnIfCompiled(`Adding a node to a graph that has already been compiled. This will not be reflected in the compiled graph.`);
      if (key in this.nodes) throw new Error(`Node \`${key}\` already present.`);
      if (key === "__end__") throw new Error(`Node \`${key}\` is reserved.`);
      const runnable = _coerceToRunnable(action);
      this.nodes[key] = {
        runnable,
        metadata: options?.metadata,
        subgraphs: isPregelLike(runnable) ? [runnable] : options?.subgraphs,
        ends: options?.ends
      };
    }
    return this;
  }
  addEdge(startKey, endKey) {
    this.warnIfCompiled(`Adding an edge to a graph that has already been compiled. This will not be reflected in the compiled graph.`);
    if (startKey === "__end__") throw new Error("END cannot be a start node");
    if (endKey === "__start__") throw new Error("START cannot be an end node");
    if (Array.from(this.edges).some(([start]) => start === startKey) && !("channels" in this)) throw new Error(`Already found path for ${startKey}. For multiple edges, use StateGraph.`);
    this.edges.add([startKey, endKey]);
    return this;
  }
  addConditionalEdges(source, path, pathMap) {
    const options = typeof source === "object" ? source : {
      source,
      path,
      pathMap
    };
    this.warnIfCompiled("Adding an edge to a graph that has already been compiled. This will not be reflected in the compiled graph.");
    if (!Runnable.isRunnable(options.path)) options.path = _coerceToRunnable(options.path);
    const name = options.path.getName() === "RunnableLambda" ? "condition" : options.path.getName();
    if (this.branches[options.source] && this.branches[options.source][name]) throw new Error(`Condition \`${name}\` already present for node \`${source}\``);
    this.branches[options.source] ??= {};
    this.branches[options.source][name] = new Branch(options);
    return this;
  }
  /**
  * @deprecated use `addEdge(START, key)` instead
  */
  setEntryPoint(key) {
    this.warnIfCompiled("Setting the entry point of a graph that has already been compiled. This will not be reflected in the compiled graph.");
    return this.addEdge(START, key);
  }
  /**
  * @deprecated use `addEdge(key, END)` instead
  */
  setFinishPoint(key) {
    this.warnIfCompiled("Setting a finish point of a graph that has already been compiled. This will not be reflected in the compiled graph.");
    return this.addEdge(key, END);
  }
  compile({ checkpointer, interruptBefore, interruptAfter, name, transformers } = {}) {
    this.validate([...Array.isArray(interruptBefore) ? interruptBefore : [], ...Array.isArray(interruptAfter) ? interruptAfter : []]);
    const compiled = new CompiledGraph({
      builder: this,
      checkpointer,
      interruptAfter,
      interruptBefore,
      autoValidate: false,
      nodes: {},
      channels: {
        [START]: new EphemeralValue(),
        [END]: new EphemeralValue()
      },
      inputChannels: START,
      outputChannels: END,
      streamChannels: [],
      streamMode: "values",
      name,
      streamTransformers: transformers
    });
    for (const [key, node] of Object.entries(this.nodes)) compiled.attachNode(key, node);
    for (const [start, end] of this.edges) compiled.attachEdge(start, end);
    for (const [start, branches] of Object.entries(this.branches)) for (const [name2, branch] of Object.entries(branches)) compiled.attachBranch(start, name2, branch);
    return compiled.validate();
  }
  validate(interrupt2) {
    const allSources = new Set([...this.allEdges].map(([src, _]) => src));
    for (const [start] of Object.entries(this.branches)) allSources.add(start);
    for (const source of allSources) if (source !== "__start__" && !(source in this.nodes)) throw new Error(`Found edge starting at unknown node \`${source}\``);
    const allTargets = new Set([...this.allEdges].map(([_, target]) => target));
    for (const [start, branches] of Object.entries(this.branches)) for (const branch of Object.values(branches)) if (branch.ends != null) for (const end of Object.values(branch.ends)) allTargets.add(end);
    else {
      allTargets.add(END);
      for (const node of Object.keys(this.nodes)) if (node !== start) allTargets.add(node);
    }
    for (const node of Object.values(this.nodes)) for (const target of node.ends ?? []) allTargets.add(target);
    if (Object.values(this.nodes).some((node) => node.isErrorHandler)) for (const node of Object.keys(this.nodes)) allTargets.add(node);
    for (const node of Object.keys(this.nodes)) {
      if (this.nodes[node].isErrorHandler) continue;
      if (!allTargets.has(node)) throw new UnreachableNodeError([
        `Node \`${node}\` is not reachable.`,
        "",
        "If you are returning Command objects from your node,",
        'make sure you are passing names of potential destination nodes as an "ends" array',
        'into ".addNode(..., { ends: ["node1", "node2"] })".'
      ].join("\n"), { lc_error_code: "UNREACHABLE_NODE" });
    }
    for (const target of allTargets) if (target !== "__end__" && !(target in this.nodes)) throw new Error(`Found edge ending at unknown node \`${target}\``);
    if (interrupt2) {
      for (const node of interrupt2) if (!(node in this.nodes)) throw new Error(`Interrupt node \`${node}\` is not present`);
    }
    this.compiled = true;
  }
};
var CompiledGraph = class extends Pregel {
  builder;
  constructor({ builder, ...rest }) {
    super(rest);
    this.builder = builder;
  }
  withConfig(config) {
    return super.withConfig(config);
  }
  attachNode(key, node) {
    this.channels[key] = new EphemeralValue();
    this.nodes[key] = new PregelNode({
      channels: [],
      triggers: [],
      metadata: node.metadata,
      subgraphs: node.subgraphs,
      ends: node.ends
    }).pipe(node.runnable).pipe(new ChannelWrite([{
      channel: key,
      value: PASSTHROUGH
    }], [TAG_HIDDEN]));
    this.streamChannels.push(key);
  }
  attachEdge(start, end) {
    if (end === "__end__") {
      if (start === "__start__") throw new Error("Cannot have an edge from START to END");
      this.nodes[start].writers.push(new ChannelWrite([{
        channel: END,
        value: PASSTHROUGH
      }], [TAG_HIDDEN]));
    } else {
      this.nodes[end].triggers.push(start);
      this.nodes[end].channels.push(start);
    }
  }
  attachBranch(start, name, branch) {
    if (start === "__start__" && !this.nodes["__start__"]) this.nodes[START] = Channel.subscribeTo(START, { tags: [TAG_HIDDEN] });
    this.nodes[start].pipe(branch.run((dests) => {
      return new ChannelWrite(dests.map((dest) => {
        if (_isSend(dest)) return dest;
        return {
          channel: dest === "__end__" ? END : `branch:${start}:${name}:${dest}`,
          value: PASSTHROUGH
        };
      }), [TAG_HIDDEN]);
    }));
    const ends = branch.ends ? Object.values(branch.ends) : Object.keys(this.nodes);
    for (const end of ends) if (end !== "__end__") {
      const channelName = `branch:${start}:${name}:${end}`;
      this.channels[channelName] = new EphemeralValue();
      this.nodes[end].triggers.push(channelName);
      this.nodes[end].channels.push(channelName);
    }
  }
  /**
  * Returns a drawable representation of the computation graph.
  */
  async getGraphAsync(config) {
    const xray = config?.xray;
    const graph = new Graph();
    const startNodes = { [START]: graph.addNode({ schema: any() }, START) };
    const endNodes = {};
    let subgraphs = {};
    if (xray) subgraphs = Object.fromEntries((await gatherIterator(this.getSubgraphsAsync())).filter((x) => isCompiledGraph(x[1])));
    const discoveredEdges = [];
    function addEdge(start, end, label, conditional = false) {
      if (end === "__end__" && endNodes["__end__"] === void 0) endNodes[END] = graph.addNode({ schema: any() }, END);
      if (startNodes[start] === void 0) return;
      if (endNodes[end] === void 0) throw new Error(`End node ${end} not found!`);
      discoveredEdges.push({
        src: start,
        dest: end,
        conditional
      });
      return graph.addEdge(startNodes[start], endNodes[end], label !== end ? label : void 0, conditional);
    }
    for (const [key, nodeSpec] of Object.entries(this.builder.nodes)) {
      const displayKey = _escapeMermaidKeywords(key);
      const node = nodeSpec.runnable;
      const metadata = nodeSpec.metadata ?? {};
      if (this.interruptBefore?.includes(key) && this.interruptAfter?.includes(key)) metadata.__interrupt = "before,after";
      else if (this.interruptBefore?.includes(key)) metadata.__interrupt = "before";
      else if (this.interruptAfter?.includes(key)) metadata.__interrupt = "after";
      if (xray) {
        const newXrayValue = typeof xray === "number" ? xray - 1 : xray;
        const drawableSubgraph = subgraphs[key] !== void 0 ? await subgraphs[key].getGraphAsync({
          ...config,
          xray: newXrayValue
        }) : node.getGraph(config);
        drawableSubgraph.trimFirstNode();
        drawableSubgraph.trimLastNode();
        if (Object.keys(drawableSubgraph.nodes).length > 1) {
          let _isRunnableInterface = function(thing) {
            return thing ? thing.lc_runnable : false;
          }, _nodeDataStr = function(id, data) {
            if (id !== void 0 && !validate$1(id)) return id;
            else if (_isRunnableInterface(data)) try {
              let dataStr = data.getName();
              dataStr = dataStr.startsWith("Runnable") ? dataStr.slice(8) : dataStr;
              return dataStr;
            } catch {
              return data.getName();
            }
            else return data.name ?? "UnknownSchema";
          };
          const [e, s] = graph.extend(drawableSubgraph, displayKey);
          if (e === void 0) throw new Error(`Could not extend subgraph "${key}" due to missing entrypoint.`);
          if (s !== void 0) startNodes[displayKey] = {
            name: _nodeDataStr(s.id, s.data),
            ...s
          };
          endNodes[displayKey] = {
            name: _nodeDataStr(e.id, e.data),
            ...e
          };
        } else {
          const newNode = graph.addNode(node, displayKey, metadata);
          startNodes[displayKey] = newNode;
          endNodes[displayKey] = newNode;
        }
      } else {
        const newNode = graph.addNode(node, displayKey, metadata);
        startNodes[displayKey] = newNode;
        endNodes[displayKey] = newNode;
      }
    }
    const sortedEdges = [...this.builder.allEdges].sort(([a], [b]) => {
      if (a < b) return -1;
      else if (b > a) return 1;
      else return 0;
    });
    for (const [start, end] of sortedEdges) addEdge(_escapeMermaidKeywords(start), _escapeMermaidKeywords(end));
    for (const [start, branches] of Object.entries(this.builder.branches)) {
      const defaultEnds = {
        ...Object.fromEntries(Object.keys(this.builder.nodes).filter((k) => k !== start).map((k) => [_escapeMermaidKeywords(k), _escapeMermaidKeywords(k)])),
        [END]: END
      };
      for (const branch of Object.values(branches)) {
        let ends;
        if (branch.ends !== void 0) ends = branch.ends;
        else ends = defaultEnds;
        for (const [label, end] of Object.entries(ends)) addEdge(_escapeMermaidKeywords(start), _escapeMermaidKeywords(end), label, true);
      }
    }
    for (const [key, node] of Object.entries(this.builder.nodes)) if (node.ends !== void 0) for (const end of node.ends) addEdge(_escapeMermaidKeywords(key), _escapeMermaidKeywords(end), void 0, true);
    addImplicitTerminalEndEdges(this.builder.nodes, discoveredEdges, addEdge);
    return graph;
  }
  /**
  * Returns a drawable representation of the computation graph.
  *
  * @deprecated Use getGraphAsync instead. The async method will be the default in the next minor core release.
  */
  getGraph(config) {
    const xray = config?.xray;
    const graph = new Graph();
    const startNodes = { [START]: graph.addNode({ schema: any() }, START) };
    const endNodes = {};
    let subgraphs = {};
    if (xray) subgraphs = Object.fromEntries(gatherIteratorSync(this.getSubgraphs()).filter((x) => isCompiledGraph(x[1])));
    const discoveredEdges = [];
    function addEdge(start, end, label, conditional = false) {
      if (end === "__end__" && endNodes["__end__"] === void 0) endNodes[END] = graph.addNode({ schema: any() }, END);
      if (startNodes[start] === void 0) return;
      if (endNodes[end] === void 0) throw new Error(`End node ${end} not found!`);
      discoveredEdges.push({
        src: start,
        dest: end,
        conditional
      });
      return graph.addEdge(startNodes[start], endNodes[end], label !== end ? label : void 0, conditional);
    }
    for (const [key, nodeSpec] of Object.entries(this.builder.nodes)) {
      const displayKey = _escapeMermaidKeywords(key);
      const node = nodeSpec.runnable;
      const metadata = nodeSpec.metadata ?? {};
      if (this.interruptBefore?.includes(key) && this.interruptAfter?.includes(key)) metadata.__interrupt = "before,after";
      else if (this.interruptBefore?.includes(key)) metadata.__interrupt = "before";
      else if (this.interruptAfter?.includes(key)) metadata.__interrupt = "after";
      if (xray) {
        const newXrayValue = typeof xray === "number" ? xray - 1 : xray;
        const drawableSubgraph = subgraphs[key] !== void 0 ? subgraphs[key].getGraph({
          ...config,
          xray: newXrayValue
        }) : node.getGraph(config);
        drawableSubgraph.trimFirstNode();
        drawableSubgraph.trimLastNode();
        if (Object.keys(drawableSubgraph.nodes).length > 1) {
          let _isRunnableInterface = function(thing) {
            return thing ? thing.lc_runnable : false;
          }, _nodeDataStr = function(id, data) {
            if (id !== void 0 && !validate$1(id)) return id;
            else if (_isRunnableInterface(data)) try {
              let dataStr = data.getName();
              dataStr = dataStr.startsWith("Runnable") ? dataStr.slice(8) : dataStr;
              return dataStr;
            } catch {
              return data.getName();
            }
            else return data.name ?? "UnknownSchema";
          };
          const [e, s] = graph.extend(drawableSubgraph, displayKey);
          if (e === void 0) throw new Error(`Could not extend subgraph "${key}" due to missing entrypoint.`);
          if (s !== void 0) startNodes[displayKey] = {
            name: _nodeDataStr(s.id, s.data),
            ...s
          };
          endNodes[displayKey] = {
            name: _nodeDataStr(e.id, e.data),
            ...e
          };
        } else {
          const newNode = graph.addNode(node, displayKey, metadata);
          startNodes[displayKey] = newNode;
          endNodes[displayKey] = newNode;
        }
      } else {
        const newNode = graph.addNode(node, displayKey, metadata);
        startNodes[displayKey] = newNode;
        endNodes[displayKey] = newNode;
      }
    }
    const sortedEdges = [...this.builder.allEdges].sort(([a], [b]) => {
      if (a < b) return -1;
      else if (b > a) return 1;
      else return 0;
    });
    for (const [start, end] of sortedEdges) addEdge(_escapeMermaidKeywords(start), _escapeMermaidKeywords(end));
    for (const [start, branches] of Object.entries(this.builder.branches)) {
      const defaultEnds = {
        ...Object.fromEntries(Object.keys(this.builder.nodes).filter((k) => k !== start).map((k) => [_escapeMermaidKeywords(k), _escapeMermaidKeywords(k)])),
        [END]: END
      };
      for (const branch of Object.values(branches)) {
        let ends;
        if (branch.ends !== void 0) ends = branch.ends;
        else ends = defaultEnds;
        for (const [label, end] of Object.entries(ends)) addEdge(_escapeMermaidKeywords(start), _escapeMermaidKeywords(end), label, true);
      }
    }
    for (const [key, node] of Object.entries(this.builder.nodes)) if (node.ends !== void 0) for (const end of node.ends) addEdge(_escapeMermaidKeywords(key), _escapeMermaidKeywords(end), void 0, true);
    addImplicitTerminalEndEdges(this.builder.nodes, discoveredEdges, addEdge);
    return graph;
  }
};
function isCompiledGraph(x) {
  return typeof x.attachNode === "function" && typeof x.attachEdge === "function";
}
function _escapeMermaidKeywords(key) {
  if (key === "subgraph") return `"${key}"`;
  return key;
}
function addImplicitTerminalEndEdges(nodes, discovered, addEdge) {
  const sources = new Set(discovered.map((e) => e.src));
  const nonConditionalDestinations = [...new Set(discovered.filter((e) => !e.conditional && e.dest !== "__end__").map((e) => e.dest))].sort();
  for (const displayDest of nonConditionalDestinations) {
    if (sources.has(displayDest)) continue;
    const rawKey = Object.keys(nodes).find((k) => _escapeMermaidKeywords(k) === displayDest);
    if (rawKey !== void 0 && nodes[rawKey]?.isErrorHandler) continue;
    addEdge(displayDest, END);
  }
}
function isStandardSchema(schema) {
  return typeof schema === "object" && schema !== null && "~standard" in schema && typeof schema["~standard"] === "object" && schema["~standard"] !== null && "validate" in schema["~standard"];
}
function isStandardJSONSchema(schema) {
  return typeof schema === "object" && schema !== null && "~standard" in schema && typeof schema["~standard"] === "object" && schema["~standard"] !== null && "jsonSchema" in schema["~standard"];
}
function isSerializableSchema(schema) {
  return isStandardSchema(schema) && isStandardJSONSchema(schema);
}
function getJsonSchemaFromSchema(schema) {
  if (isStandardJSONSchema(schema)) try {
    return schema["~standard"].jsonSchema.input({ target: "draft-07" });
  } catch {
    return;
  }
}
function getSchemaDefaultGetter(schema) {
  if (schema == null) return;
  if (!isStandardSchema(schema)) return;
  try {
    const result = schema["~standard"].validate(void 0);
    if (result && typeof result === "object" && !("then" in result && typeof result.then === "function")) {
      const syncResult = result;
      if (!syncResult.issues) {
        const defaultValue = syncResult.value;
        return () => defaultValue;
      }
    }
  } catch {
  }
}
const isDeltaChannel = (value) => {
  return value != null && value.lc_graph_name === "DeltaChannel";
};
var DeltaChannel = class DeltaChannel2 extends BaseChannel {
  lc_graph_name = "DeltaChannel";
  /** `undefined` represents the Python `MISSING` sentinel (empty channel). */
  value;
  reducer;
  snapshotFrequency;
  initialValueFactory;
  constructor(reducer, options) {
    super();
    const snapshotFrequency = options?.snapshotFrequency ?? 1e3;
    if (!Number.isInteger(snapshotFrequency) || snapshotFrequency <= 0) throw new Error(`snapshotFrequency must be a positive integer, got ${snapshotFrequency}`);
    this.reducer = reducer;
    this.snapshotFrequency = snapshotFrequency;
    this.initialValueFactory = options?.initialValueFactory ?? (() => []);
    this.value = void 0;
  }
  fromCheckpoint(checkpoint) {
    const empty = new DeltaChannel2(this.reducer, {
      snapshotFrequency: this.snapshotFrequency,
      initialValueFactory: this.initialValueFactory
    });
    if (checkpoint === void 0) empty.value = this.initialValueFactory();
    else if (isDeltaSnapshot(checkpoint)) empty.value = checkpoint.value;
    else empty.value = checkpoint;
    return empty;
  }
  /**
  * Apply ancestor writes oldest-to-newest via a single reducer call.
  *
  * If any write is an Overwrite, the last one in the sequence acts as the
  * reset point: its value becomes the new base and only writes after it are
  * passed to the reducer.
  */
  replayWrites(writes) {
    const values = writes.map((w) => w[2]);
    if (values.length === 0) return;
    let base = this.value;
    let start = 0;
    for (let i = 0; i < values.length; i += 1) {
      const [isOverwrite, overwriteValue] = _getOverwriteValue(values[i]);
      if (isOverwrite) {
        base = overwriteValue !== void 0 && overwriteValue !== null ? overwriteValue : this.initialValueFactory();
        start = i + 1;
      }
    }
    const remaining = values.slice(start);
    this.value = remaining.length > 0 ? this.reducer(base, remaining) : base;
  }
  update(values) {
    if (values.length === 0) return false;
    let overwriteValue;
    let hasOverwrite = false;
    for (const value of values) if (_isOverwriteValue(value)) {
      if (hasOverwrite) throw new InvalidUpdateError("Can receive only one Overwrite value per step.");
      hasOverwrite = true;
      [, overwriteValue] = _getOverwriteValue(value);
    }
    if (hasOverwrite) {
      this.value = overwriteValue !== void 0 && overwriteValue !== null ? overwriteValue : this.initialValueFactory();
      return true;
    }
    const base = this.value === void 0 ? this.initialValueFactory() : this.value;
    this.value = this.reducer(base, values);
    return true;
  }
  get() {
    if (this.value === void 0) throw new EmptyChannelError();
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
  equals(other) {
    if (this === other) return true;
    if (!isDeltaChannel(other)) return false;
    if (this.snapshotFrequency !== other.snapshotFrequency) return false;
    return this.reducer === other.reducer;
  }
};
const MISSING = /* @__PURE__ */ Symbol.for("langgraph.channel.missing");
var UntrackedValueChannel = class UntrackedValueChannel2 extends BaseChannel {
  lc_graph_name = "UntrackedValue";
  /**
  * If true, throws an error when multiple values are received in a single step.
  * If false, stores the last value received.
  */
  guard;
  /**
  * The current value. MISSING sentinel indicates no value has been set.
  */
  _value = MISSING;
  /**
  * Optional factory function for the initial value.
  */
  initialValueFactory;
  constructor(options) {
    super();
    this.guard = options?.guard ?? true;
    this.initialValueFactory = options?.initialValueFactory;
    if (this.initialValueFactory) this._value = this.initialValueFactory();
  }
  /**
  * Return a new channel, ignoring the checkpoint since we don't persist.
  * The initial value (if any) is restored.
  */
  fromCheckpoint(_checkpoint) {
    return new UntrackedValueChannel2({
      guard: this.guard,
      initialValueFactory: this.initialValueFactory
    });
  }
  /**
  * Update the channel with the given values.
  * If guard is true, throws if more than one value is received.
  */
  update(values) {
    if (values.length === 0) return false;
    if (values.length !== 1 && this.guard) throw new InvalidUpdateError("UntrackedValue(guard=true) can receive only one value per step. Use guard=false if you want to store any one of multiple values.", { lc_error_code: "INVALID_CONCURRENT_GRAPH_UPDATE" });
    this._value = values[values.length - 1];
    return true;
  }
  /**
  * Get the current value.
  * @throws EmptyChannelError if no value has been set.
  */
  get() {
    if (this._value === MISSING) throw new EmptyChannelError();
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
    return this._value !== MISSING;
  }
};
const REDUCED_VALUE_SYMBOL = /* @__PURE__ */ Symbol.for("langgraph.state.reduced_value");
var ReducedValue = class {
  /**
  * Instance marker for runtime identification.
  * @internal
  */
  [REDUCED_VALUE_SYMBOL] = true;
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
  constructor(valueSchema, init) {
    this.reducer = init.reducer;
    this.jsonSchemaExtra = init.jsonSchemaExtra;
    this.valueSchema = valueSchema;
    this.inputSchema = "inputSchema" in init ? init.inputSchema : valueSchema;
    this.jsonSchemaExtra = init.jsonSchemaExtra;
  }
  static isInstance(value) {
    return typeof value === "object" && value !== null && REDUCED_VALUE_SYMBOL in value && value[REDUCED_VALUE_SYMBOL] === true;
  }
};
const UNTRACKED_VALUE_SYMBOL = /* @__PURE__ */ Symbol.for("langgraph.state.untracked_value");
var UntrackedValue = class {
  /**
  * Instance marker for runtime identification.
  * @internal
  */
  [UNTRACKED_VALUE_SYMBOL] = true;
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
  constructor(schema, init) {
    this.schema = schema;
    this.guard = init?.guard ?? true;
  }
  static isInstance(value) {
    return typeof value === "object" && value !== null && UNTRACKED_VALUE_SYMBOL in value;
  }
};
const DELTA_VALUE_SYMBOL = /* @__PURE__ */ Symbol.for("langgraph.state.delta_value");
var DeltaValue = class {
  /**
  * Instance marker for runtime identification.
  * @internal
  */
  [DELTA_VALUE_SYMBOL] = true;
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
  constructor(valueSchema, init) {
    this.reducer = init.reducer;
    this.valueSchema = valueSchema;
    this.inputSchema = "inputSchema" in init ? init.inputSchema : valueSchema;
    this.snapshotFrequency = init.snapshotFrequency;
    this.jsonSchemaExtra = init.jsonSchemaExtra;
  }
  static isInstance(value) {
    return typeof value === "object" && value !== null && DELTA_VALUE_SYMBOL in value && value[DELTA_VALUE_SYMBOL] === true;
  }
};
const areSetsEqual = (a, b) => a.size === b.size && [...a].every((value) => b.has(value));
var NamedBarrierValue = class NamedBarrierValue2 extends BaseChannel {
  lc_graph_name = "NamedBarrierValue";
  names;
  seen;
  constructor(names) {
    super();
    this.names = names;
    this.seen = /* @__PURE__ */ new Set();
  }
  fromCheckpoint(checkpoint) {
    const empty = new NamedBarrierValue2(this.names);
    if (typeof checkpoint !== "undefined") empty.seen = new Set(checkpoint);
    return empty;
  }
  update(values) {
    let updated = false;
    for (const nodeName of values) if (this.names.has(nodeName)) {
      if (!this.seen.has(nodeName)) {
        this.seen.add(nodeName);
        updated = true;
      }
    } else throw new InvalidUpdateError(`Value ${JSON.stringify(nodeName)} not in names ${JSON.stringify(this.names)}`);
    return updated;
  }
  get() {
    if (!areSetsEqual(this.names, this.seen)) throw new EmptyChannelError();
  }
  checkpoint() {
    return [...this.seen];
  }
  consume() {
    if (this.seen && this.names && areSetsEqual(this.seen, this.names)) {
      this.seen = /* @__PURE__ */ new Set();
      return true;
    }
    return false;
  }
  isAvailable() {
    return !!this.names && areSetsEqual(this.names, this.seen);
  }
};
var NamedBarrierValueAfterFinish = class NamedBarrierValueAfterFinish2 extends BaseChannel {
  lc_graph_name = "NamedBarrierValueAfterFinish";
  names;
  seen;
  finished;
  constructor(names) {
    super();
    this.names = names;
    this.seen = /* @__PURE__ */ new Set();
    this.finished = false;
  }
  fromCheckpoint(checkpoint) {
    const empty = new NamedBarrierValueAfterFinish2(this.names);
    if (typeof checkpoint !== "undefined") {
      const [seen, finished] = checkpoint;
      empty.seen = new Set(seen);
      empty.finished = finished;
    }
    return empty;
  }
  update(values) {
    let updated = false;
    for (const nodeName of values) if (this.names.has(nodeName) && !this.seen.has(nodeName)) {
      this.seen.add(nodeName);
      updated = true;
    } else if (!this.names.has(nodeName)) throw new InvalidUpdateError(`Value ${JSON.stringify(nodeName)} not in names ${JSON.stringify(this.names)}`);
    return updated;
  }
  get() {
    if (!this.finished || !areSetsEqual(this.names, this.seen)) throw new EmptyChannelError();
  }
  checkpoint() {
    return [[...this.seen], this.finished];
  }
  consume() {
    if (this.finished && this.seen && this.names && areSetsEqual(this.seen, this.names)) {
      this.seen = /* @__PURE__ */ new Set();
      this.finished = false;
      return true;
    }
    return false;
  }
  finish() {
    if (!this.finished && !!this.names && areSetsEqual(this.names, this.seen)) {
      this.finished = true;
      return true;
    }
    return false;
  }
  isAvailable() {
    return this.finished && !!this.names && areSetsEqual(this.names, this.seen);
  }
};
const STATE_SCHEMA_SYMBOL = /* @__PURE__ */ Symbol.for("langgraph.state.state_schema");
var StateSchema = class {
  /**
  * Symbol for runtime identification.
  * @internal Used by isInstance for runtime type checking
  */
  [STATE_SCHEMA_SYMBOL] = true;
  constructor(fields) {
    this.fields = fields;
  }
  /**
  * Get the channel definitions for use with StateGraph.
  * This converts the StateSchema fields into BaseChannel instances.
  */
  getChannels() {
    const channels = {};
    for (const [key, value] of Object.entries(this.fields)) if (DeltaValue.isInstance(value)) {
      const defaultGetter = getSchemaDefaultGetter(value.valueSchema);
      channels[key] = new DeltaChannel(value.reducer, {
        snapshotFrequency: value.snapshotFrequency,
        initialValueFactory: defaultGetter
      });
    } else if (ReducedValue.isInstance(value)) {
      const defaultGetter = getSchemaDefaultGetter(value.valueSchema);
      channels[key] = new BinaryOperatorAggregate(value.reducer, defaultGetter);
    } else if (UntrackedValue.isInstance(value)) {
      const defaultGetter = value.schema ? getSchemaDefaultGetter(value.schema) : void 0;
      channels[key] = new UntrackedValueChannel({
        guard: value.guard,
        initialValueFactory: defaultGetter
      });
    } else if (isStandardSchema(value)) channels[key] = new LastValue(getSchemaDefaultGetter(value));
    else throw new Error(`Invalid state field "${key}": must be a schema, ReducedValue, DeltaValue, UntrackedValue, or ManagedValue`);
    return channels;
  }
  /**
  * Get the JSON schema for the full state type.
  * Used by Studio and API for schema introspection.
  */
  getJsonSchema() {
    const properties = {};
    const required = [];
    for (const [key, value] of Object.entries(this.fields)) {
      let fieldSchema;
      if (DeltaValue.isInstance(value) || ReducedValue.isInstance(value)) {
        fieldSchema = getJsonSchemaFromSchema(value.valueSchema);
        if (value.jsonSchemaExtra) fieldSchema = {
          ...fieldSchema ?? {},
          ...value.jsonSchemaExtra
        };
      } else if (UntrackedValue.isInstance(value)) fieldSchema = value.schema ? getJsonSchemaFromSchema(value.schema) : void 0;
      else if (isStandardSchema(value)) fieldSchema = getJsonSchemaFromSchema(value);
      if (fieldSchema) {
        properties[key] = fieldSchema;
        let hasDefault = false;
        if (DeltaValue.isInstance(value) || ReducedValue.isInstance(value)) hasDefault = getSchemaDefaultGetter(value.valueSchema) !== void 0;
        else if (UntrackedValue.isInstance(value)) hasDefault = value.schema ? getSchemaDefaultGetter(value.schema) !== void 0 : false;
        else hasDefault = getSchemaDefaultGetter(value) !== void 0;
        if (!hasDefault) required.push(key);
      }
    }
    return {
      type: "object",
      properties,
      required: required.length > 0 ? required : void 0
    };
  }
  /**
  * Get the JSON schema for the update/input type.
  * All fields are optional in updates.
  */
  getInputJsonSchema() {
    const properties = {};
    for (const [key, value] of Object.entries(this.fields)) {
      let fieldSchema;
      if (DeltaValue.isInstance(value) || ReducedValue.isInstance(value)) {
        fieldSchema = getJsonSchemaFromSchema(value.inputSchema);
        if (value.jsonSchemaExtra) fieldSchema = {
          ...fieldSchema ?? {},
          ...value.jsonSchemaExtra
        };
      } else if (UntrackedValue.isInstance(value)) fieldSchema = value.schema ? getJsonSchemaFromSchema(value.schema) : void 0;
      else if (isStandardSchema(value)) fieldSchema = getJsonSchemaFromSchema(value);
      if (fieldSchema) properties[key] = fieldSchema;
    }
    return {
      type: "object",
      properties
    };
  }
  /**
  * Get the list of channel keys (excluding managed values).
  */
  getChannelKeys() {
    return Object.entries(this.fields).map(([key]) => key);
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
  async validateInput(data) {
    if (data == null || typeof data !== "object") return data;
    const result = {};
    for (const [key, value] of Object.entries(data)) {
      const fieldDef = this.fields[key];
      if (fieldDef === void 0) {
        result[key] = value;
        continue;
      }
      let schema;
      if (DeltaValue.isInstance(fieldDef) || ReducedValue.isInstance(fieldDef)) {
        const [isOverwrite, overwriteValue] = _getOverwriteValue(value);
        if (isOverwrite) {
          schema = fieldDef.valueSchema;
          const validationResult = await schema["~standard"].validate(overwriteValue);
          if (validationResult.issues) throw new Error(`Validation failed for field "${key}": ${JSON.stringify(validationResult.issues)}`);
          result[key] = { [OVERWRITE]: validationResult.value };
          continue;
        }
        schema = fieldDef.inputSchema;
      } else if (UntrackedValue.isInstance(fieldDef)) schema = fieldDef.schema;
      else if (isStandardSchema(fieldDef)) schema = fieldDef;
      if (schema) {
        const validationResult = await schema["~standard"].validate(value);
        if (validationResult.issues) throw new Error(`Validation failed for field "${key}": ${JSON.stringify(validationResult.issues)}`);
        result[key] = validationResult.value;
      } else result[key] = value;
    }
    return result;
  }
  static isInstance(value) {
    return typeof value === "object" && value !== null && STATE_SCHEMA_SYMBOL in value && value[STATE_SCHEMA_SYMBOL] === true;
  }
};
const REMOVE_ALL_MESSAGES = "__remove_all__";
function messagesStateReducer(left, right) {
  const leftArray = Array.isArray(left) ? left : [left];
  const rightArray = Array.isArray(right) ? right : [right];
  const leftMessages = leftArray.map(coerceMessageLikeToMessage);
  const rightMessages = rightArray.map(coerceMessageLikeToMessage);
  for (const m of leftMessages) if (m.id === null || m.id === void 0) {
    m.id = v4();
    m.lc_kwargs.id = m.id;
  }
  let removeAllIdx;
  for (let i = 0; i < rightMessages.length; i += 1) {
    const m = rightMessages[i];
    if (m.id === null || m.id === void 0) {
      m.id = v4();
      m.lc_kwargs.id = m.id;
    }
    if (RemoveMessage.isInstance(m) && m.id === "__remove_all__") removeAllIdx = i;
  }
  if (removeAllIdx != null) return rightMessages.slice(removeAllIdx + 1);
  const merged = [...leftMessages];
  const mergedById = new Map(merged.map((m, i) => [m.id, i]));
  const idsToRemove = /* @__PURE__ */ new Set();
  for (const m of rightMessages) {
    const existingIdx = mergedById.get(m.id);
    if (existingIdx !== void 0) if (RemoveMessage.isInstance(m)) idsToRemove.add(m.id);
    else {
      idsToRemove.delete(m.id);
      merged[existingIdx] = m;
    }
    else {
      if (RemoveMessage.isInstance(m)) throw new Error(`Attempting to delete a message with an ID that doesn't exist ('${m.id}')`);
      mergedById.set(m.id, merged.length);
      merged.push(m);
    }
  }
  return merged.filter((m) => !idsToRemove.has(m.id));
}
function messagesDeltaReducer(state, writes) {
  const flat = [];
  for (const w of writes) if (Array.isArray(w)) flat.push(...w);
  else flat.push(w);
  const stateMsgs = state.length > 0 && BaseMessage.isInstance(state[0]) ? state : state.map(coerceMessageLikeToMessage);
  const msgs = flat.map(coerceMessageLikeToMessage);
  const index2 = /* @__PURE__ */ new Map();
  for (let i = 0; i < stateMsgs.length; i += 1) {
    const mid = stateMsgs[i].id;
    if (mid != null) index2.set(mid, i);
  }
  const result = [...stateMsgs];
  for (const msg of msgs) {
    const mid = msg.id;
    if (RemoveMessage.isInstance(msg) && mid === "__remove_all__") {
      result.length = 0;
      index2.clear();
    } else if (mid == null) result.push(msg);
    else if (RemoveMessage.isInstance(msg)) {
      if (index2.has(mid)) {
        result[index2.get(mid)] = null;
        index2.delete(mid);
      }
    } else if (index2.has(mid)) result[index2.get(mid)] = msg;
    else {
      index2.set(mid, result.length);
      result.push(msg);
    }
  }
  return result.filter((m) => m !== null);
}
const messagesValueSchema = custom().default(() => []);
const messagesInputSchema = custom();
const MessagesValue = new ReducedValue(messagesValueSchema, {
  inputSchema: messagesInputSchema,
  reducer: messagesStateReducer,
  jsonSchemaExtra: {
    langgraph_type: "messages",
    description: "A list of chat messages"
  }
});
const MessagesDeltaValue = new DeltaValue(messagesValueSchema, {
  inputSchema: messagesInputSchema,
  reducer: messagesDeltaReducer,
  jsonSchemaExtra: {
    langgraph_type: "messages",
    description: "A list of chat messages"
  }
});
var SchemaMetaRegistry = class {
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
  get(schema) {
    return this._map.get(schema);
  }
  /**
  * Extends or sets the metadata for a given schema.
  * @template TValue The value type of the schema.
  * @template TUpdate The update type of the schema (defaults to TValue).
  * @param schema The schema to extend metadata for.
  * @param predicate A function that receives the existing metadata (or undefined) and returns the new metadata.
  */
  extend(schema, predicate) {
    const existingMeta = this.get(schema);
    this._map.set(schema, predicate(existingMeta));
  }
  /**
  * Removes the metadata associated with a given schema.
  * @param schema The schema to remove metadata for.
  * @returns The SchemaMetaRegistry instance (for chaining).
  */
  remove(schema) {
    this._map.delete(schema);
    return this;
  }
  /**
  * Checks if metadata exists for a given schema.
  * @param schema The schema to check.
  * @returns True if metadata exists, false otherwise.
  */
  has(schema) {
    return this._map.has(schema);
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
  getChannelsForSchema(schema) {
    const channels = {};
    const shape = getInteropZodObjectShape(schema);
    for (const [key, channelSchema] of Object.entries(shape)) {
      const meta = this.get(channelSchema);
      if (meta?.reducer) channels[key] = new BinaryOperatorAggregate(meta.reducer.fn, meta.default);
      else channels[key] = new LastValue(meta?.default);
    }
    return channels;
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
  getExtendedChannelSchemas(schema, effects) {
    if (Object.keys(effects).length === 0) return schema;
    const cacheKey = Object.entries(effects).filter(([, v]) => v === true).sort(([a], [b]) => a.localeCompare(b)).map(([k, v]) => `${k}:${v}`).join("|");
    const cache = this._extensionCache.get(cacheKey) ?? /* @__PURE__ */ new Map();
    if (cache.has(schema)) return cache.get(schema);
    let modifiedSchema = schema;
    if (effects.withReducerSchema || effects.withJsonSchemaExtrasAsDescription) {
      const newShapeEntries = Object.entries(getInteropZodObjectShape(schema)).map(([key, schema2]) => {
        const meta = this.get(schema2);
        let outputSchema = effects.withReducerSchema ? meta?.reducer?.schema ?? schema2 : schema2;
        if (effects.withJsonSchemaExtrasAsDescription && meta?.jsonSchemaExtra) {
          const description = getSchemaDescription(outputSchema) ?? getSchemaDescription(schema2);
          const strExtras = JSON.stringify({
            ...meta.jsonSchemaExtra,
            description
          });
          outputSchema = outputSchema.describe(`lg:${strExtras}`);
        }
        return [key, outputSchema];
      });
      modifiedSchema = extendInteropZodObject(schema, Object.fromEntries(newShapeEntries));
      if (isZodSchemaV3(modifiedSchema)) modifiedSchema._def.unknownKeys = "strip";
    }
    if (effects.asPartial) modifiedSchema = interopZodObjectPartial(modifiedSchema);
    cache.set(schema, modifiedSchema);
    this._extensionCache.set(cacheKey, cache);
    return modifiedSchema;
  }
};
const schemaMetaRegistry = new SchemaMetaRegistry();
function withLangGraph(schema, meta) {
  if (meta.reducer && !meta.default) {
    const defaultValueGetter = getInteropZodDefaultGetter(schema);
    if (defaultValueGetter != null) meta.default = defaultValueGetter;
  }
  if (meta.reducer) {
    const schemaWithReducer = Object.assign(schema, { lg_reducer_schema: meta.reducer?.schema ?? schema });
    schemaMetaRegistry.extend(schemaWithReducer, () => meta);
    return schemaWithReducer;
  } else {
    schemaMetaRegistry.extend(schema, () => meta);
    return schema;
  }
}
function isStateDefinitionInit(value) {
  if (value == null) return false;
  if (StateSchema.isInstance(value)) return true;
  if (isInteropZodObject(value)) return true;
  if (typeof value === "object" && "lc_graph_name" in value && value.lc_graph_name === "AnnotationRoot") return true;
  if (typeof value === "object" && !Array.isArray(value) && Object.keys(value).length > 0 && Object.values(value).every((v) => typeof v === "function" || isBaseChannel(v))) return true;
  return false;
}
function isStateGraphInit(value) {
  if (typeof value !== "object" || value == null) return false;
  const obj = value;
  const hasState = "state" in obj && isStateDefinitionInit(obj.state);
  const hasStateSchema = "stateSchema" in obj && isStateDefinitionInit(obj.stateSchema);
  const hasInput = "input" in obj && isStateDefinitionInit(obj.input);
  if (!hasState && !hasStateSchema && !hasInput) return false;
  if ("input" in obj && obj.input != null && !isStateDefinitionInit(obj.input)) return false;
  if ("output" in obj && obj.output != null && !isStateDefinitionInit(obj.output)) return false;
  return true;
}
const ROOT = "__root__";
const DEFAULT_ERROR_HANDLER_NODE = "__default_error_handler__";
const PartialStateSchema = /* @__PURE__ */ Symbol.for("langgraph.state.partial");
var StateGraph = class extends Graph$1 {
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
  _metaRegistry = schemaMetaRegistry;
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
  constructor(stateOrInit, options) {
    super();
    const init = this._normalizeToStateGraphInit(stateOrInit, options);
    const stateSchema = init.state ?? init.stateSchema ?? init.input;
    if (!stateSchema) throw new StateGraphInputError();
    const stateChannelDef = this._getChannelsFromSchema(stateSchema);
    this._schemaDefinition = stateChannelDef;
    if (StateSchema.isInstance(stateSchema)) this._schemaRuntimeDefinition = stateSchema;
    else if (isInteropZodObject(stateSchema)) this._schemaRuntimeDefinition = stateSchema;
    if (init.input) if (StateSchema.isInstance(init.input)) this._inputRuntimeDefinition = init.input;
    else if (isInteropZodObject(init.input)) this._inputRuntimeDefinition = init.input;
    else this._inputRuntimeDefinition = PartialStateSchema;
    else this._inputRuntimeDefinition = PartialStateSchema;
    if (init.output) if (StateSchema.isInstance(init.output)) this._outputRuntimeDefinition = init.output;
    else if (isInteropZodObject(init.output)) this._outputRuntimeDefinition = init.output;
    else this._outputRuntimeDefinition = this._schemaRuntimeDefinition;
    else this._outputRuntimeDefinition = this._schemaRuntimeDefinition;
    const inputChannelDef = init.input ? this._getChannelsFromSchema(init.input) : stateChannelDef;
    const outputChannelDef = init.output ? this._getChannelsFromSchema(init.output) : stateChannelDef;
    this._inputDefinition = inputChannelDef;
    this._outputDefinition = outputChannelDef;
    this._addSchema(this._schemaDefinition);
    this._addSchema(this._inputDefinition);
    this._addSchema(this._outputDefinition);
    if (init.context) {
      if (isInteropZodObject(init.context)) this._configRuntimeSchema = init.context;
    }
    this._interrupt = init.interrupt;
    this._writer = init.writer;
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
  setNodeDefaults(defaults) {
    if (defaults.retryPolicy !== void 0) this._nodeDefaults.retryPolicy = defaults.retryPolicy;
    if (defaults.cachePolicy !== void 0) this._nodeDefaults.cachePolicy = typeof defaults.cachePolicy === "boolean" ? defaults.cachePolicy ? {} : void 0 : defaults.cachePolicy;
    if (defaults.timeout !== void 0) this._nodeDefaults.timeout = coerceTimeoutPolicy(defaults.timeout);
    if (defaults.errorHandler !== void 0) this._nodeDefaults.errorHandler = defaults.errorHandler;
    return this;
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
    const userHandler = this._nodeDefaults.errorHandler;
    if (userHandler === void 0) return;
    return {
      runnable: new RunnableCallable$1({
        func: (state, config) => {
          const nodeError = config?.configurable?.[CONFIG_KEY_NODE_ERROR];
          return userHandler(state, nodeError, config);
        },
        name: DEFAULT_ERROR_HANDLER_NODE,
        trace: false
      }),
      metadata: void 0,
      input: this._schemaDefinition,
      retryPolicy: void 0,
      cachePolicy: void 0,
      isErrorHandler: true
    };
  }
  /**
  * Normalize all constructor input patterns to a unified StateGraphInit object.
  * @internal
  */
  _normalizeToStateGraphInit(stateOrInit, options) {
    if (isStateGraphInit(stateOrInit)) {
      if (isInteropZodObject(options) || AnnotationRoot.isInstance(options)) return {
        ...stateOrInit,
        context: options
      };
      const opts = options;
      return {
        ...stateOrInit,
        input: stateOrInit.input ?? opts?.input,
        output: stateOrInit.output ?? opts?.output,
        context: stateOrInit.context ?? opts?.context,
        interrupt: stateOrInit.interrupt ?? opts?.interrupt,
        writer: stateOrInit.writer ?? opts?.writer,
        nodes: stateOrInit.nodes ?? opts?.nodes
      };
    }
    if (isStateDefinitionInit(stateOrInit)) {
      if (isInteropZodObject(options) || AnnotationRoot.isInstance(options)) return {
        state: stateOrInit,
        context: options
      };
      const opts = options;
      return {
        state: stateOrInit,
        input: opts?.input,
        output: opts?.output,
        context: opts?.context,
        interrupt: opts?.interrupt,
        writer: opts?.writer,
        nodes: opts?.nodes
      };
    }
    if (isStateGraphArgs(stateOrInit)) return { state: _getChannels(stateOrInit.channels) };
    throw new StateGraphInputError();
  }
  /**
  * Convert any supported schema type to a StateDefinition (channel map).
  * @internal
  */
  _getChannelsFromSchema(schema) {
    if (StateSchema.isInstance(schema)) return schema.getChannels();
    if (isInteropZodObject(schema)) return this._metaRegistry.getChannelsForSchema(schema);
    if (typeof schema === "object" && "lc_graph_name" in schema && schema.lc_graph_name === "AnnotationRoot") return schema.spec;
    if (typeof schema === "object" && !Array.isArray(schema) && Object.keys(schema).length > 0) return schema;
    throw new StateGraphInputError("Invalid schema type. Expected StateSchema, Zod object, AnnotationRoot, or StateDefinition.");
  }
  get allEdges() {
    return /* @__PURE__ */ new Set([...this.edges, ...Array.from(this.waitingEdges).flatMap(([starts, end]) => starts.map((start) => [start, end]))]);
  }
  _addSchema(stateDefinition) {
    if (this._schemaDefinitions.has(stateDefinition)) return;
    this._schemaDefinitions.set(stateDefinition, stateDefinition);
    for (const [key, val] of Object.entries(stateDefinition)) {
      let channel;
      if (typeof val === "function") channel = val();
      else channel = val;
      if (this.channels[key] !== void 0) {
        if (!this.channels[key].equals(channel)) {
          if (channel.lc_graph_name !== "LastValue") throw new Error(`Channel "${key}" already exists with a different type.`);
        }
      } else this.channels[key] = channel;
    }
  }
  addNode(...args) {
    function isMultipleNodes(args2) {
      return args2.length >= 1 && typeof args2[0] !== "string";
    }
    const nodes = isMultipleNodes(args) ? Array.isArray(args[0]) ? args[0] : Object.entries(args[0]).map(([key, action]) => [key, action]) : [[
      args[0],
      args[1],
      args[2]
    ]];
    if (nodes.length === 0) throw new Error("No nodes provided in `addNode`");
    for (const [key, action, options] of nodes) {
      if (key in this.channels) throw new Error(`${key} is already being used as a state attribute (a.k.a. a channel), cannot also be used as a node name.`);
      for (const reservedChar of ["|", ":"]) if (key.includes(reservedChar)) throw new Error(`"${reservedChar}" is a reserved character and is not allowed in node names.`);
      this.warnIfCompiled(`Adding a node to a graph that has already been compiled. This will not be reflected in the compiled graph.`);
      if (key in this.nodes) throw new Error(`Node \`${key}\` already present.`);
      if (key === "__end__" || key === "__start__") throw new Error(`Node \`${key}\` is reserved.`);
      let inputSpec = this._schemaDefinition;
      if (options?.input !== void 0) inputSpec = this._getChannelsFromSchema(options.input);
      this._addSchema(inputSpec);
      let runnable;
      if (Runnable.isRunnable(action)) runnable = action;
      else if (typeof action === "function") runnable = new RunnableCallable$1({
        func: action,
        name: key,
        trace: false
      });
      else runnable = _coerceToRunnable(action);
      const rawCachePolicy = options?.cachePolicy;
      let cachePolicy;
      if (rawCachePolicy !== void 0) cachePolicy = typeof rawCachePolicy === "boolean" ? rawCachePolicy ? {} : false : rawCachePolicy;
      let errorHandlerNode;
      if (options?.errorHandler !== void 0) {
        errorHandlerNode = `__error_handler__${key}`;
        if (errorHandlerNode in this.nodes) throw new Error(`Cannot add error handler to node \`${key}\`: the reserved name \`${errorHandlerNode}\` is already in use. StateGraph registers \`__error_handler__<nodeName>\` when you pass \`errorHandler\` in addNode options. Remove or rename the existing node with that name (for example, you may have added it manually).`);
        const userHandler = options.errorHandler;
        const handlerSpec = {
          runnable: new RunnableCallable$1({
            func: (state, config) => {
              const nodeError = config?.configurable?.[CONFIG_KEY_NODE_ERROR];
              return userHandler(state, nodeError, config);
            },
            name: errorHandlerNode,
            trace: false
          }),
          metadata: void 0,
          input: inputSpec ?? this._schemaDefinition,
          retryPolicy: void 0,
          cachePolicy: void 0,
          isErrorHandler: true
        };
        this.nodes[errorHandlerNode] = handlerSpec;
      }
      const nodeSpec = {
        runnable,
        retryPolicy: options?.retryPolicy,
        cachePolicy,
        timeout: coerceTimeoutPolicy(options?.timeout),
        metadata: options?.metadata,
        input: inputSpec ?? this._schemaDefinition,
        subgraphs: isPregelLike(runnable) ? [runnable] : options?.subgraphs,
        ends: options?.ends,
        defer: options?.defer,
        errorHandlerNode
      };
      this.nodes[key] = nodeSpec;
    }
    return this;
  }
  addEdge(startKey, endKey) {
    if (typeof startKey === "string") return super.addEdge(startKey, endKey);
    if (this.compiled) console.warn("Adding an edge to a graph that has already been compiled. This will not be reflected in the compiled graph.");
    for (const start of startKey) {
      if (start === "__end__") throw new Error("END cannot be a start node");
      if (!Object.keys(this.nodes).some((node) => node === start)) throw new Error(`Need to add a node named "${start}" first`);
    }
    if (endKey === "__end__") throw new Error("END cannot be an end node");
    if (!Object.keys(this.nodes).some((node) => node === endKey)) throw new Error(`Need to add a node named "${endKey}" first`);
    this.waitingEdges.add([startKey, endKey]);
    return this;
  }
  addSequence(nodes) {
    const parsedNodes = Array.isArray(nodes) ? nodes : Object.entries(nodes);
    if (parsedNodes.length === 0) throw new Error("Sequence requires at least one node.");
    let previousNode;
    for (const [key, action, options] of parsedNodes) {
      if (key in this.nodes) throw new Error(`Node names must be unique: node with the name "${key}" already exists.`);
      const validKey = key;
      this.addNode(key, action, options);
      if (previousNode != null) this.addEdge(previousNode, validKey);
      previousNode = validKey;
    }
    return this;
  }
  compile({ checkpointer, store, cache, interruptBefore, interruptAfter, name, description, transformers } = {}) {
    const defaultErrorHandlerSpec = this._createDefaultErrorHandlerSpec();
    if (defaultErrorHandlerSpec !== void 0) {
      if (DEFAULT_ERROR_HANDLER_NODE in this.nodes) throw new Error(`Cannot apply a default error handler: the reserved node name \`${DEFAULT_ERROR_HANDLER_NODE}\` is already in use. setNodeDefaults({ errorHandler }) registers a node with that name; rename the conflicting node.`);
      this.nodes[DEFAULT_ERROR_HANDLER_NODE] = defaultErrorHandlerSpec;
    }
    try {
      return this._compileResolved({
        checkpointer,
        store,
        cache,
        interruptBefore,
        interruptAfter,
        name,
        description,
        transformers,
        defaultErrorHandlerNode: defaultErrorHandlerSpec !== void 0 ? DEFAULT_ERROR_HANDLER_NODE : void 0
      });
    } finally {
      if (defaultErrorHandlerSpec !== void 0) delete this.nodes[DEFAULT_ERROR_HANDLER_NODE];
    }
  }
  /** @internal */
  _compileResolved({ checkpointer, store, cache, interruptBefore, interruptAfter, name, description, transformers, defaultErrorHandlerNode }) {
    this.validate([...Array.isArray(interruptBefore) ? interruptBefore : [], ...Array.isArray(interruptAfter) ? interruptAfter : []]);
    const outputKeys = Object.keys(this._schemaDefinitions.get(this._outputDefinition));
    const outputChannels = outputKeys.length === 1 && outputKeys[0] === ROOT ? ROOT : outputKeys;
    const streamKeys = Object.keys(this.channels);
    const streamChannels = streamKeys.length === 1 && streamKeys[0] === ROOT ? ROOT : streamKeys;
    const userInterrupt = this._interrupt;
    const compiled = new CompiledStateGraph({
      builder: this,
      checkpointer,
      interruptAfter,
      interruptBefore,
      autoValidate: false,
      nodes: {},
      channels: {
        ...this.channels,
        [START]: new EphemeralValue()
      },
      inputChannels: START,
      outputChannels,
      streamChannels,
      streamMode: "updates",
      store,
      cache,
      name,
      description,
      userInterrupt,
      streamTransformers: transformers
    });
    compiled.attachNode(START);
    const nodeDefaults = this._nodeDefaults;
    const hasNodeDefaults = nodeDefaults.retryPolicy !== void 0 || nodeDefaults.cachePolicy !== void 0 || nodeDefaults.timeout !== void 0 || defaultErrorHandlerNode !== void 0;
    for (const [key, node] of Object.entries(this.nodes)) {
      const isErrorHandlerNode = node.isErrorHandler === true;
      const resolvedNode = hasNodeDefaults ? {
        ...node,
        retryPolicy: node.retryPolicy ?? nodeDefaults.retryPolicy,
        cachePolicy: isErrorHandlerNode ? void 0 : node.cachePolicy === false ? void 0 : node.cachePolicy ?? nodeDefaults.cachePolicy,
        timeout: node.timeout ?? nodeDefaults.timeout,
        errorHandlerNode: !isErrorHandlerNode && defaultErrorHandlerNode !== void 0 && node.errorHandlerNode === void 0 ? defaultErrorHandlerNode : node.errorHandlerNode
      } : node;
      compiled.attachNode(key, resolvedNode);
    }
    compiled.attachBranch(START, SELF, _getControlBranch(), { withReader: false });
    for (const [key] of Object.entries(this.nodes)) compiled.attachBranch(key, SELF, _getControlBranch(), { withReader: false });
    for (const [start, end] of this.edges) compiled.attachEdge(start, end);
    for (const [starts, end] of this.waitingEdges) compiled.attachEdge(starts, end);
    for (const [start, branches] of Object.entries(this.branches)) for (const [name2, branch] of Object.entries(branches)) compiled.attachBranch(start, name2, branch);
    return compiled.validate();
  }
};
function _getChannels(schema) {
  const channels = {};
  for (const [name, val] of Object.entries(schema)) if (name === ROOT) channels[name] = getChannel(val);
  else channels[name] = getChannel(val);
  return channels;
}
var CompiledStateGraph = class extends CompiledGraph {
  /**
  * The description of the compiled graph.
  * This is used by the supervisor agent to describe the handoff to the agent.
  */
  description;
  /** @internal */
  _metaRegistry = schemaMetaRegistry;
  constructor({ description, ...rest }) {
    super(rest);
    this.description = description;
  }
  attachNode(key, node) {
    let outputKeys;
    if (key === "__start__") outputKeys = Object.entries(this.builder._schemaDefinitions.get(this.builder._inputDefinition)).map(([k]) => k);
    else outputKeys = Object.keys(this.builder.channels);
    function _getRoot(input) {
      if (isCommand(input)) {
        if (input.graph === Command.PARENT) return null;
        return input._updateAsTuples();
      } else if (Array.isArray(input) && input.length > 0 && input.some((i) => isCommand(i))) {
        const updates = [];
        for (const i of input) if (isCommand(i)) {
          if (i.graph === Command.PARENT) continue;
          updates.push(...i._updateAsTuples());
        } else updates.push([ROOT, i]);
        return updates;
      } else if (input != null) return [[ROOT, input]];
      return null;
    }
    const nodeKey = key;
    const validateStateUpdates = async (updates) => {
      if (updates == null || updates.length === 0) return updates;
      const schemaDef = this.builder._schemaRuntimeDefinition;
      if (StateSchema.isInstance(schemaDef)) {
        const schemaKeys = new Set(schemaDef.getChannelKeys());
        return Promise.all(updates.map(async ([k, v]) => {
          if (!schemaKeys.has(k)) return [k, v];
          const parsed = await schemaDef.validateInput({ [k]: v });
          return [k, Object.prototype.hasOwnProperty.call(parsed, k) ? parsed[k] : v];
        }));
      }
      if (isInteropZodObject(schemaDef)) {
        const schemaKeys = new Set(Object.keys(getInteropZodObjectShape(schemaDef)));
        if (updates.filter(([k]) => schemaKeys.has(k)).length === 0) return updates;
        const updateSchema = interopZodObjectPartial(this._metaRegistry.getExtendedChannelSchemas(schemaDef, { withReducerSchema: true }));
        const valueSchema = interopZodObjectPartial(schemaDef);
        return updates.map(([k, v]) => {
          if (!schemaKeys.has(k)) return [k, v];
          const [isOverwrite, overwriteValue] = _getOverwriteValue(v);
          if (isOverwrite) {
            const parsed2 = interopParse(valueSchema, { [k]: overwriteValue });
            return [k, Object.prototype.hasOwnProperty.call(parsed2, k) ? { [OVERWRITE]: parsed2[k] } : v];
          }
          const parsed = interopParse(updateSchema, { [k]: v });
          return [k, Object.prototype.hasOwnProperty.call(parsed, k) ? parsed[k] : v];
        });
      }
      return updates;
    };
    async function _getUpdates(input) {
      if (!input) return null;
      else if (isCommand(input)) {
        if (input.graph === Command.PARENT) return null;
        return validateStateUpdates(input._updateAsTuples().filter(([k]) => outputKeys.includes(k)));
      } else if (Array.isArray(input) && input.length > 0 && input.some(isCommand)) {
        const updates = [];
        for (const item of input) if (isCommand(item)) {
          if (item.graph === Command.PARENT) continue;
          updates.push(...item._updateAsTuples().filter(([k]) => outputKeys.includes(k)));
        } else {
          const itemUpdates = await _getUpdates(item);
          if (itemUpdates) updates.push(...itemUpdates ?? []);
        }
        return validateStateUpdates(updates);
      } else if (typeof input === "object" && !Array.isArray(input)) return validateStateUpdates(Object.entries(input).filter(([k]) => outputKeys.includes(k)));
      else {
        const typeofInput = Array.isArray(input) ? "array" : typeof input;
        throw new InvalidUpdateError(`Expected node "${nodeKey.toString()}" to return an object or an array containing at least one Command object, received ${typeofInput}`, { lc_error_code: "INVALID_GRAPH_NODE_RETURN_VALUE" });
      }
    }
    const stateWriteEntries = [{
      value: PASSTHROUGH,
      mapper: new RunnableCallable$1({
        func: outputKeys.length && outputKeys[0] === ROOT ? _getRoot : _getUpdates,
        trace: false,
        recurse: false
      })
    }];
    if (key === "__start__") this.nodes[key] = new PregelNode({
      tags: [TAG_HIDDEN],
      triggers: [START],
      channels: [START],
      writers: [new ChannelWrite(stateWriteEntries, [TAG_HIDDEN])]
    });
    else {
      const inputDefinition = node?.input ?? this.builder._schemaDefinition;
      const inputValues = Object.fromEntries(Object.keys(this.builder._schemaDefinitions.get(inputDefinition)).map((k) => [k, k]));
      const isSingleInput = Object.keys(inputValues).length === 1 && ROOT in inputValues;
      const branchChannel = `branch:to:${key}`;
      this.channels[branchChannel] = node?.defer ? new LastValueAfterFinish() : new EphemeralValue(false);
      const nodeCachePolicy = node?.cachePolicy;
      const cachePolicy = nodeCachePolicy === false ? void 0 : nodeCachePolicy;
      this.nodes[key] = new PregelNode({
        triggers: [branchChannel],
        channels: isSingleInput ? Object.keys(inputValues) : inputValues,
        writers: [new ChannelWrite(stateWriteEntries, [TAG_HIDDEN])],
        mapper: isSingleInput ? void 0 : (input) => {
          return Object.fromEntries(Object.entries(input).filter(([k]) => k in inputValues));
        },
        bound: node?.runnable,
        metadata: node?.metadata,
        retryPolicy: node?.retryPolicy,
        cachePolicy,
        timeout: node?.timeout,
        subgraphs: node?.subgraphs,
        ends: node?.ends,
        isErrorHandler: node?.isErrorHandler,
        errorHandlerNode: node?.errorHandlerNode
      });
    }
  }
  attachEdge(starts, end) {
    if (end === "__end__") return;
    if (typeof starts === "string") this.nodes[starts].writers.push(new ChannelWrite([{
      channel: `branch:to:${end}`,
      value: null
    }], [TAG_HIDDEN]));
    else if (Array.isArray(starts)) {
      const channelName = `join:${starts.join("+")}:${end}`;
      this.channels[channelName] = this.builder.nodes[end].defer ? new NamedBarrierValueAfterFinish(new Set(starts)) : new NamedBarrierValue(new Set(starts));
      this.nodes[end].triggers.push(channelName);
      for (const start of starts) this.nodes[start].writers.push(new ChannelWrite([{
        channel: channelName,
        value: start
      }], [TAG_HIDDEN]));
    }
  }
  attachBranch(start, _, branch, options = { withReader: true }) {
    const branchWriter = async (packets, config) => {
      const filteredPackets = packets.filter((p) => p !== END);
      if (!filteredPackets.length) return;
      const writes = filteredPackets.map((p) => {
        if (_isSend(p)) return p;
        return {
          channel: p === "__end__" ? p : `branch:to:${p}`,
          value: start
        };
      });
      await ChannelWrite.doWrite({
        ...config,
        tags: (config.tags ?? []).concat([TAG_HIDDEN])
      }, writes);
    };
    this.nodes[start].writers.push(branch.run(branchWriter, options.withReader ? (config) => ChannelRead.doRead(config, this.streamChannels ?? this.outputChannels, true) : void 0));
  }
  async _validateInput(input) {
    if (input == null) return input;
    const inputDef = this.builder._inputRuntimeDefinition;
    const schemaDef = this.builder._schemaRuntimeDefinition;
    if (StateSchema.isInstance(inputDef)) {
      if (isCommand(input)) {
        const parsedInput = input;
        if (input.update) parsedInput.update = await inputDef.validateInput(Array.isArray(input.update) ? Object.fromEntries(input.update) : input.update);
        return parsedInput;
      }
      return await inputDef.validateInput(input);
    }
    if (inputDef === PartialStateSchema && StateSchema.isInstance(schemaDef)) {
      if (isCommand(input)) {
        const parsedInput = input;
        if (input.update) parsedInput.update = await schemaDef.validateInput(Array.isArray(input.update) ? Object.fromEntries(input.update) : input.update);
        return parsedInput;
      }
      return await schemaDef.validateInput(input);
    }
    const schema = (() => {
      const apply = (schema2) => {
        if (schema2 == null) return void 0;
        return this._metaRegistry.getExtendedChannelSchemas(schema2, { withReducerSchema: true });
      };
      if (isInteropZodObject(inputDef)) return apply(inputDef);
      if (inputDef === PartialStateSchema) {
        if (isInteropZodObject(schemaDef)) return interopZodObjectPartial(apply(schemaDef));
        return;
      }
    })();
    if (isCommand(input)) {
      const parsedInput = input;
      if (input.update && schema != null) {
        const updateObj = Array.isArray(input.update) ? Object.fromEntries(input.update) : input.update;
        const parsed = interopParse(schema, updateObj);
        parsedInput.update = Object.fromEntries(Object.keys(updateObj).map((k) => [k, parsed[k]]));
      }
      return parsedInput;
    }
    if (schema != null) return interopParse(schema, input);
    return input;
  }
  isInterrupted(input) {
    return isInterrupted(input);
  }
  async _validateContext(config) {
    const configSchema = this.builder._configRuntimeSchema;
    if (isInteropZodObject(configSchema)) interopParse(configSchema, config);
    return config;
  }
};
function isStateGraphArgs(obj) {
  return typeof obj === "object" && obj !== null && obj.channels !== void 0;
}
function _controlBranch(value) {
  if (_isSend(value)) return [value];
  const commands = [];
  if (isCommand(value)) commands.push(value);
  else if (Array.isArray(value)) commands.push(...value.filter(isCommand));
  const destinations = [];
  for (const command of commands) {
    if (command.graph === Command.PARENT) throw new ParentCommand(command);
    if (_isSend(command.goto)) destinations.push(command.goto);
    else if (typeof command.goto === "string") destinations.push(command.goto);
    else if (Array.isArray(command.goto)) destinations.push(...command.goto);
  }
  return destinations;
}
function _getControlBranch() {
  return new Branch({ path: new RunnableCallable$1({
    func: _controlBranch,
    tags: [TAG_HIDDEN],
    trace: false,
    recurse: false,
    name: "<control_branch>"
  }) });
}
var MessageGraph = class extends StateGraph {
  constructor() {
    super({ channels: { __root__: {
      reducer: messagesStateReducer,
      default: () => []
    } } });
  }
};
function pushMessage(message, options) {
  const { stateKey: userStateKey, ...userConfig } = options ?? {};
  const config = ensureLangGraphConfig(userConfig);
  let stateKey = userStateKey ?? "messages";
  if (userStateKey === null) stateKey = void 0;
  const validMessage = coerceMessageLikeToMessage(message);
  if (!validMessage.id) throw new Error("Message ID is required.");
  const messagesHandler = (() => {
    if (Array.isArray(config.callbacks)) return config.callbacks;
    if (typeof config.callbacks !== "undefined") return config.callbacks.handlers;
    return [];
  })().find((cb) => "name" in cb && cb.name === "StreamMessagesHandler");
  if (messagesHandler) {
    const metadata = config.metadata ?? {};
    const namespace = (metadata.langgraph_checkpoint_ns ?? "").split("|");
    messagesHandler._emit([namespace, metadata], validMessage, void 0, false);
  }
  if (stateKey) config.configurable?.__pregel_send?.([[stateKey, validMessage]]);
  return validMessage;
}
function task(optionsOrName, func) {
  const options = typeof optionsOrName === "string" ? {
    name: optionsOrName,
    retry: void 0,
    cachePolicy: void 0,
    timeout: void 0
  } : optionsOrName;
  const { name, retry } = options;
  const timeout = coerceTimeoutPolicy(options.timeout);
  if (isAsyncGeneratorFunction(func) || isGeneratorFunction(func)) throw new Error("Generators are disallowed as tasks. For streaming responses, use config.write.");
  const cachePolicy = options.cachePolicy ?? ("cache" in options ? options.cache : void 0);
  let cache;
  if (typeof cachePolicy === "boolean") cache = cachePolicy ? {} : void 0;
  else cache = cachePolicy;
  return (...args) => {
    return call$1({
      func,
      name,
      retry,
      cache,
      timeout
    }, ...args);
  };
}
const entrypoint = function entrypoint2(optionsOrName, func) {
  const { name, checkpointer, store, cache } = typeof optionsOrName === "string" ? {
    name: optionsOrName,
    checkpointer: void 0,
    store: void 0
  } : optionsOrName;
  const timeout = coerceTimeoutPolicy(typeof optionsOrName === "string" ? void 0 : optionsOrName.timeout);
  if (isAsyncGeneratorFunction(func) || isGeneratorFunction(func)) throw new Error("Generators are disallowed as entrypoints. For streaming responses, use config.write.");
  const streamMode = "updates";
  const bound = getRunnableForEntrypoint(name, func);
  function isEntrypointFinal(value) {
    return typeof value === "object" && value !== null && "__lg_type" in value && value.__lg_type === "__pregel_final";
  }
  const pluckReturnValue = new RunnableCallable$1({
    name: "pluckReturnValue",
    func: (value) => {
      return isEntrypointFinal(value) ? value.value : value;
    }
  });
  const pluckSaveValue = new RunnableCallable$1({
    name: "pluckSaveValue",
    func: (value) => {
      return isEntrypointFinal(value) ? value.save : value;
    }
  });
  const entrypointNode = new PregelNode({
    bound,
    triggers: [START],
    channels: [START],
    timeout,
    writers: [new ChannelWrite([{
      channel: END,
      value: PASSTHROUGH,
      mapper: pluckReturnValue
    }, {
      channel: PREVIOUS,
      value: PASSTHROUGH,
      mapper: pluckSaveValue
    }], [TAG_HIDDEN])]
  });
  return new Pregel({
    name,
    checkpointer,
    nodes: { [name]: entrypointNode },
    channels: {
      [START]: new EphemeralValue(),
      [END]: new LastValue(),
      [PREVIOUS]: new LastValue()
    },
    inputChannels: START,
    outputChannels: END,
    streamChannels: END,
    streamMode,
    store,
    cache
  });
};
entrypoint.final = function final({ value, save }) {
  return {
    value,
    save,
    __lg_type: "__pregel_final"
  };
};
function getPreviousState() {
  return AsyncLocalStorageProviderSingleton.getRunnableConfig().configurable?.[CONFIG_KEY_PREVIOUS_STATE];
}
const MessagesAnnotation = Annotation.Root({ messages: Annotation({
  reducer: messagesStateReducer,
  default: () => []
}) });
const MessagesZodMeta = {
  reducer: { fn: messagesStateReducer },
  jsonSchemaExtra: { langgraph_type: "messages" },
  default: () => []
};
const MessagesZodState = objectType({ messages: withLangGraph(custom$1(), MessagesZodMeta) });
function writer(chunk) {
  const config = AsyncLocalStorageProviderSingleton.getRunnableConfig();
  if (!config) throw new Error("Called interrupt() outside the context of a graph.");
  const conf = config.configurable;
  if (!conf) throw new Error("No configurable found in config");
  return conf.writer?.(chunk);
}
initializeAsyncLocalStorageSingleton();
const index = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Annotation,
  AsyncBatchedStore,
  BaseChannel,
  BaseCheckpointSaver,
  BaseLangGraphError,
  BaseStore: BaseStore2,
  BinaryOperatorAggregate,
  COMMAND_SYMBOL,
  ChatModelStreamImpl: ChatModelStream,
  Command,
  CommandInstance,
  CompiledStateGraph,
  DeltaChannel,
  DeltaValue,
  END,
  EmptyChannelError,
  EmptyInputError,
  EventLog: StreamChannel,
  Graph: Graph$1,
  GraphBubbleUp,
  GraphDrained,
  GraphInterrupt,
  GraphRecursionError,
  GraphRunStream,
  GraphValueError,
  INTERRUPT: INTERRUPT$1,
  InMemoryStore: InMemoryStore2,
  InvalidUpdateError,
  MemorySaver,
  MessageGraph,
  MessagesAnnotation,
  MessagesDeltaValue,
  MessagesValue,
  MessagesZodMeta,
  MessagesZodState,
  MultipleSubgraphsError,
  NodeError,
  NodeInterrupt,
  NodeTimeoutError,
  Overwrite,
  ParentCommand,
  REMOVE_ALL_MESSAGES,
  ReducedValue,
  RemoteException,
  RunControl,
  START,
  STREAM_EVENTS_V3_MODES,
  Send,
  StateGraph,
  StateGraphInputError,
  StateSchema,
  StreamChannel,
  SubgraphRunStream,
  UnreachableNodeError,
  UntrackedValue,
  UntrackedValueChannel,
  addMessages: messagesStateReducer,
  convertToProtocolEvent,
  copyCheckpoint,
  createGraphRunStream,
  createLifecycleTransformer,
  createMessagesTransformer,
  createSubgraphDiscoveryTransformer,
  createValuesTransformer,
  emptyCheckpoint,
  entrypoint,
  filterLifecycleEntries,
  filterSubgraphHandles,
  getConfig,
  getCurrentTaskInput,
  getJsonSchemaFromSchema,
  getPreviousState,
  getSchemaDefaultGetter,
  getStore,
  getSubgraphsSeenSet,
  getWriter,
  interrupt,
  isCheckpointEnvelope,
  isCommand,
  isGraphBubbleUp,
  isGraphDrained,
  isGraphInterrupt,
  isInterrupted,
  isNativeTransformer,
  isNodeError,
  isNodeTimeoutError,
  isParentCommand,
  isSerializableSchema,
  isStandardSchema,
  messagesDeltaReducer,
  messagesStateReducer,
  pushMessage,
  task,
  writer
}, Symbol.toStringTag, { value: "Module" }));
var MultipleToolsBoundError = class extends Error {
  constructor() {
    super("The provided LLM already has bound tools. Please provide an LLM without bound tools to createAgent. The agent will bind the tools provided in the 'tools' parameter.");
  }
};
var MultipleStructuredOutputsError = class extends Error {
  toolNames;
  constructor(toolNames) {
    super(`The model has called multiple tools: ${toolNames.join(", ")} to return a structured output. This is not supported. Please provide a single structured output.`);
    this.toolNames = toolNames;
  }
};
var StructuredOutputParsingError = class extends Error {
  toolName;
  errors;
  constructor(toolName, errors) {
    super(`Failed to parse structured output for tool '${toolName}':${errors.map((e) => `
  - ${e}`).join("")}.`);
    this.toolName = toolName;
    this.errors = errors;
  }
};
var ToolInvocationError = class extends Error {
  toolCall;
  toolError;
  constructor(toolError, toolCall) {
    const error = toolError instanceof Error ? toolError : new Error(String(toolError));
    const toolArgs = JSON.stringify(toolCall.args);
    super(`Error invoking tool '${toolCall.name}' with kwargs ${toolArgs} with error: ${error.stack}
 Please fix the error and try again.`);
    this.toolCall = toolCall;
    this.toolError = error;
  }
};
var MiddlewareError = class MiddlewareError2 extends Error {
  static "~brand" = "MiddlewareError";
  constructor(error, middlewareName) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    super(errorMessage);
    this.name = error instanceof Error ? error.name : `${middlewareName[0].toUpperCase() + middlewareName.slice(1)}Error`;
    if (error instanceof Error) this.cause = error;
  }
  /**
  * Wrap an error in a MiddlewareError, unless it's a GraphBubbleUp error
  * (like GraphInterrupt) which should propagate unchanged.
  *
  * @param error - The error to wrap
  * @param middlewareName - The name of the middleware that threw the error
  * @returns The original error if it's a GraphBubbleUp, otherwise a new MiddlewareError
  */
  static wrap(error, middlewareName) {
    if (isGraphBubbleUp(error)) return error;
    return new MiddlewareError2(error, middlewareName);
  }
  /**
  * Check if the error is a MiddlewareError.
  * @param error - The error to check
  * @returns Whether the error is a MiddlewareError
  */
  static isInstance(error) {
    return error instanceof Error && "~brand" in error && error["~brand"] === "MiddlewareError";
  }
};
function isBaseChatModel(model) {
  return "invoke" in model && typeof model.invoke === "function" && "_streamResponseChunks" in model;
}
function isConfigurableModel(model) {
  return typeof model === "object" && model != null && "_queuedMethodOperations" in model && "_getModelInstance" in model && typeof model._getModelInstance === "function";
}
const PROVIDER_STRATEGY_DEFAULT_STRICT = true;
let bindingIdentifier = 0;
var ToolStrategy = class ToolStrategy2 {
  constructor(schema, tool2, options) {
    this.schema = schema;
    this.tool = tool2;
    this.options = options;
  }
  get name() {
    return this.tool.function.name;
  }
  static fromSchema(schema, outputOptions) {
    function getFunctionName(name) {
      return name ?? `extract-${++bindingIdentifier}`;
    }
    if (isSerializableSchema$1(schema) || isInteropZodSchema(schema)) {
      const asJsonSchema = toJsonSchema(schema);
      return new ToolStrategy2(asJsonSchema, {
        type: "function",
        function: {
          name: getFunctionName(asJsonSchema.title),
          strict: false,
          description: asJsonSchema.description ?? "Tool for extracting structured output from the model's response.",
          parameters: asJsonSchema
        }
      }, outputOptions);
    }
    let functionDefinition;
    if (typeof schema.name === "string" && typeof schema.parameters === "object" && schema.parameters != null) functionDefinition = schema;
    else functionDefinition = {
      name: getFunctionName(schema.title),
      description: schema.description ?? "",
      parameters: schema.schema || schema
    };
    return new ToolStrategy2(toJsonSchema(schema), {
      type: "function",
      function: functionDefinition
    }, outputOptions);
  }
  /**
  * Parse tool arguments according to the schema.
  *
  * @throws {StructuredOutputParsingError} if the response is not valid
  * @param toolArgs - The arguments from the tool call
  * @returns The parsed response according to the schema type
  */
  parse(toolArgs) {
    const result = new Validator(this.schema).validate(toolArgs);
    if (!result.valid) throw new StructuredOutputParsingError(this.name, result.errors.map((e) => e.error));
    return toolArgs;
  }
};
var ProviderStrategy = class ProviderStrategy2 {
  _schemaType;
  /**
  * The schema to use for the provider strategy
  */
  schema;
  /**
  * Whether to use strict mode for the provider strategy
  */
  strict;
  constructor(schemaOrOptions, strict) {
    if ("schema" in schemaOrOptions && typeof schemaOrOptions.schema === "object" && schemaOrOptions.schema !== null && !("type" in schemaOrOptions)) {
      const options = schemaOrOptions;
      this.schema = options.schema;
      this.strict = options.strict ?? PROVIDER_STRATEGY_DEFAULT_STRICT;
    } else {
      this.schema = schemaOrOptions;
      this.strict = strict ?? PROVIDER_STRATEGY_DEFAULT_STRICT;
    }
  }
  static fromSchema(schema, strict) {
    return new ProviderStrategy2(toJsonSchema(schema), strict);
  }
  /**
  * Parse tool arguments according to the schema. If the response is not valid, return undefined.
  *
  * @param response - The AI message response to parse
  * @returns The parsed response according to the schema type
  */
  parse(response) {
    let textContent;
    if (typeof response.content === "string") textContent = response.content;
    else if (Array.isArray(response.content)) {
      for (const block of response.content) if (typeof block === "object" && block !== null && "type" in block && block.type === "text" && "text" in block && typeof block.text === "string") {
        textContent = block.text;
        break;
      }
    }
    if (!textContent || textContent === "") return;
    try {
      const content = JSON.parse(textContent);
      if (!new Validator(this.schema).validate(content).valid) return;
      return content;
    } catch {
    }
  }
};
function transformResponseFormat(responseFormat, options, model) {
  if (!responseFormat) return [];
  if (typeof responseFormat === "object" && responseFormat !== null && "__responseFormatUndefined" in responseFormat) return [];
  if (Array.isArray(responseFormat)) {
    if (responseFormat.every((item) => item instanceof ToolStrategy || item instanceof ProviderStrategy)) return responseFormat;
    if (responseFormat.every((item) => isSerializableSchema$1(item))) return responseFormat.map((item) => ToolStrategy.fromSchema(item, options));
    if (responseFormat.every((item) => isInteropZodObject(item))) return responseFormat.map((item) => ToolStrategy.fromSchema(item, options));
    if (responseFormat.every((item) => typeof item === "object" && item !== null && !isInteropZodObject(item) && !isSerializableSchema$1(item))) return responseFormat.map((item) => ToolStrategy.fromSchema(item, options));
    throw new Error("Invalid response format: list contains mixed types.\nAll items must be either InteropZodObject, Standard Schema, or plain JSON schema objects.");
  }
  if (responseFormat instanceof ToolStrategy || responseFormat instanceof ProviderStrategy) return [responseFormat];
  const useProviderStrategy = hasSupportForJsonSchemaOutput(model);
  if (isSerializableSchema$1(responseFormat)) return useProviderStrategy ? [ProviderStrategy.fromSchema(responseFormat)] : [ToolStrategy.fromSchema(responseFormat, options)];
  if (isInteropZodObject(responseFormat)) return useProviderStrategy ? [ProviderStrategy.fromSchema(responseFormat)] : [ToolStrategy.fromSchema(responseFormat, options)];
  if (typeof responseFormat === "object" && responseFormat !== null && "properties" in responseFormat) return useProviderStrategy ? [ProviderStrategy.fromSchema(responseFormat)] : [ToolStrategy.fromSchema(responseFormat, options)];
  throw new Error(`Invalid response format: ${String(responseFormat)}`);
}
function hasSupportForJsonSchemaOutput(model) {
  if (!model || !isBaseChatModel(model) || !("profile" in model) || typeof model.profile !== "object" || !model.profile) return false;
  return "structuredOutput" in model.profile && model.profile.structuredOutput === true;
}
function getHookConstraint(hook) {
  if (!hook || typeof hook === "function") return;
  return hook.canJumpTo;
}
function getHookFunction(arg) {
  if (typeof arg === "function") return arg;
  return arg.hook;
}
function isOwnEvent(ns, path) {
  if (ns.length < path.length || ns.length > path.length + 1) return false;
  for (let i = 0; i < path.length; i += 1) if (ns[i] !== path[i]) return false;
  return true;
}
function isToolInterrupt(message) {
  let parsed;
  try {
    parsed = JSON.parse(message);
  } catch {
    return false;
  }
  if (!Array.isArray(parsed) || parsed.length === 0) return false;
  return parsed.every((entry) => {
    if (entry == null || typeof entry !== "object") return false;
    const record = entry;
    return typeof record.id === "string" && "value" in record;
  });
}
function isSerializedToolMessage(value) {
  if (value == null || typeof value !== "object") return false;
  const record = value;
  if (record.type !== "constructor" || !Array.isArray(record.id)) return false;
  return record.id[record.id.length - 1] === "ToolMessage";
}
function normalizeToolOutput(output) {
  if (ToolMessage.isInstance(output)) return output.content;
  if (isSerializedToolMessage(output)) return output.kwargs?.content;
  return output;
}
function createToolCallTransformer(path) {
  return () => {
    const toolCallsLog = StreamChannel.local();
    const pendingCalls = /* @__PURE__ */ new Map();
    function createToolCallEntry(callId, name, rawInput) {
      if (pendingCalls.has(callId)) return;
      const input = typeof rawInput === "string" ? JSON.parse(rawInput) : rawInput;
      let resolveOutput;
      let rejectOutput;
      let resolveStatus;
      let resolveError;
      const output = new Promise((res, rej) => {
        resolveOutput = res;
        rejectOutput = rej;
      });
      const status = new Promise((res) => {
        resolveStatus = res;
      });
      const error = new Promise((res) => {
        resolveError = res;
      });
      pendingCalls.set(callId, {
        resolveOutput,
        rejectOutput,
        resolveStatus,
        resolveError
      });
      toolCallsLog.push({
        name,
        callId,
        input,
        output,
        status,
        error
      });
    }
    return {
      __native: true,
      init: () => ({ toolCalls: toolCallsLog }),
      process(event) {
        if (!isOwnEvent(event.params.namespace, path)) return true;
        if (event.method === "messages") {
          const data = event.params.data;
          if (data.event === "content-block-finish") {
            const cb = data.contentBlock ?? data.content_block;
            if (cb?.type === "tool_call") createToolCallEntry(String(cb.id ?? ""), String(cb.name ?? ""), cb.args ?? cb.input);
          }
        }
        if (event.method === "tools") {
          const data = event.params.data;
          const toolCallId = data.tool_call_id;
          if (data.event === "tool-started") createToolCallEntry(toolCallId, data.tool_name ?? "unknown", data.input);
          const pending = toolCallId ? pendingCalls.get(toolCallId) : void 0;
          if (pending) {
            if (data.event === "tool-finished") {
              pending.resolveOutput(normalizeToolOutput(data.output));
              pending.resolveStatus("finished");
              pending.resolveError(void 0);
              pendingCalls.delete(toolCallId);
            } else if (data.event === "tool-error") {
              const message = data.message ?? "unknown error";
              if (isToolInterrupt(message)) return true;
              pending.rejectOutput(new Error(message));
              pending.resolveStatus("error");
              pending.resolveError(message);
              pendingCalls.delete(toolCallId);
            }
          }
        }
        return true;
      },
      finalize() {
        for (const pending of pendingCalls.values()) {
          pending.resolveStatus("finished");
          pending.resolveError(void 0);
          pending.resolveOutput(void 0);
        }
        pendingCalls.clear();
        toolCallsLog.close();
      },
      fail(err) {
        for (const pending of pendingCalls.values()) {
          pending.resolveStatus("error");
          pending.resolveError(err instanceof Error ? err.message : String(err));
          pending.rejectOutput(err);
        }
        pendingCalls.clear();
        toolCallsLog.fail(err);
      }
    };
  };
}
function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function nsKey(ns) {
  return ns.join("\0");
}
function hasPrefix(ns, prefix) {
  if (prefix.length > ns.length) return false;
  for (let i = 0; i < prefix.length; i += 1) if (ns[i] !== prefix[i]) return false;
  return true;
}
function createSubagentTransformer(scope = []) {
  return () => {
    const subagentsLog = StreamChannel.local();
    const lcByNs = /* @__PURE__ */ new Map();
    const pendingToolCalls = /* @__PURE__ */ new Map();
    const activeToolCallByNs = /* @__PURE__ */ new Map();
    const handles = /* @__PURE__ */ new Map();
    const depth = scope.length;
    function recordIdentity(ns, data) {
      const key = nsKey(ns);
      if (lcByNs.has(key)) return;
      const lc = (isRecord(data) && isRecord(data.metadata) ? data.metadata : void 0)?.lc_agent_name;
      lcByNs.set(key, typeof lc === "string" ? lc : void 0);
    }
    function recordPendingToolCalls(data) {
      if (!isRecord(data)) return;
      const taskId = data.id;
      if (typeof taskId !== "string") return;
      const input = data.input;
      let toolCallId;
      if (isRecord(input) && isRecord(input.tool_call)) {
        const candidate = input.tool_call.id;
        if (typeof candidate === "string") toolCallId = candidate;
      } else if (Array.isArray(input)) {
        for (const toolCall of input) if (isRecord(toolCall) && typeof toolCall.id === "string") {
          toolCallId = toolCall.id;
          break;
        }
      }
      if (toolCallId != null) pendingToolCalls.set(taskId, toolCallId);
    }
    function deriveCause(ns) {
      const active = activeToolCallByNs.get(nsKey(ns));
      if (typeof active === "string" && active.length > 0) return {
        type: "toolCall",
        tool_call_id: active
      };
      const segment = ns[ns.length - 1];
      const colon = segment.indexOf(":");
      if (colon === -1) return void 0;
      const triggerCallId = segment.slice(colon + 1);
      if (triggerCallId.length === 0) return void 0;
      const toolCallId = pendingToolCalls.get(triggerCallId);
      if (typeof toolCallId !== "string" || toolCallId.length === 0) return;
      return {
        type: "toolCall",
        tool_call_id: toolCallId
      };
    }
    function maybeStartSubagent(ns) {
      if (ns.length !== depth + 1 || !hasPrefix(ns, scope)) return;
      const key = nsKey(ns);
      if (handles.has(key)) return;
      const lc = lcByNs.get(key);
      if (typeof lc !== "string" || lc.length === 0) return;
      const messages = createMessagesTransformer(ns);
      const messagesProjection = messages.init();
      const toolCall = createToolCallTransformer(ns)();
      const toolCallProjection = toolCall.init();
      const nested = createSubagentTransformer(ns)();
      const nestedProjection = nested.init();
      let resolveOutput;
      let rejectOutput;
      const output = new Promise((resolve, reject) => {
        resolveOutput = resolve;
        rejectOutput = reject;
      });
      handles.set(key, {
        key,
        path: ns,
        name: lc,
        messages,
        toolCall,
        nested,
        resolveOutput,
        rejectOutput,
        latestValues: void 0,
        done: false
      });
      subagentsLog.push({
        name: lc,
        cause: deriveCause(ns),
        output,
        messages: messagesProjection.messages,
        toolCalls: toolCallProjection.toolCalls,
        subagents: nestedProjection.subagents
      });
    }
    function finishHandle(handle, outcome) {
      if (handle.done) return;
      handle.done = true;
      if (outcome.type === "resolve") handle.resolveOutput(handle.latestValues);
      else handle.rejectOutput(outcome.error);
      handle.messages.finalize?.();
      handle.toolCall.finalize?.();
      handle.nested.finalize?.();
    }
    return {
      __native: true,
      init: () => ({ subagents: subagentsLog }),
      process(event) {
        const ns = event.params.namespace;
        const data = event.params.data;
        const isTaskResult = event.method === "tasks" && isRecord(data) && "result" in data;
        if (event.method === "tools" && isRecord(data) && data.event === "tool-started" && typeof data.tool_call_id === "string" && data.tool_call_id.length > 0) activeToolCallByNs.set(nsKey(ns), data.tool_call_id);
        if (event.method === "tasks" && !isTaskResult) {
          recordIdentity(ns, data);
          recordPendingToolCalls(data);
          maybeStartSubagent(ns);
        }
        for (const handle of handles.values()) {
          if (handle.done) continue;
          if (!hasPrefix(ns, handle.path)) continue;
          handle.messages.process(event);
          handle.toolCall.process(event);
          handle.nested.process(event);
          if (nsKey(ns) === handle.key) {
            if (event.method === "values" && isRecord(data)) handle.latestValues = data;
            else if (event.method === "lifecycle" && isRecord(data)) {
              const status = data.event;
              if (status === "completed" || status === "interrupted") finishHandle(handle, { type: "resolve" });
              else if (status === "failed") finishHandle(handle, {
                type: "reject",
                error: /* @__PURE__ */ new Error(`Subagent ${handle.name} failed`)
              });
            }
          }
        }
        return true;
      },
      finalize() {
        for (const handle of handles.values()) finishHandle(handle, { type: "resolve" });
        subagentsLog.close();
      },
      fail(err) {
        for (const handle of handles.values()) finishHandle(handle, {
          type: "reject",
          error: err
        });
        subagentsLog.fail(err);
      }
    };
  };
}
const MIDDLEWARE_BRAND = /* @__PURE__ */ Symbol.for("AgentMiddleware");
function createMiddleware(config) {
  return {
    [MIDDLEWARE_BRAND]: true,
    name: config.name,
    stateSchema: config.stateSchema,
    contextSchema: config.contextSchema,
    wrapToolCall: config.wrapToolCall,
    wrapModelCall: config.wrapModelCall,
    beforeAgent: config.beforeAgent,
    beforeModel: config.beforeModel,
    afterModel: config.afterModel,
    afterAgent: config.afterAgent,
    tools: config.tools,
    streamTransformers: config.streamTransformers
  };
}
const metaSymbol = /* @__PURE__ */ Symbol.for("langgraph-zod");
if (!(metaSymbol in globalThis)) globalThis[metaSymbol] = /* @__PURE__ */ new WeakSet();
function applyPluginPrototype(prototype) {
  const cache = globalThis[metaSymbol];
  if (cache.has(prototype)) return;
  Object.defineProperty(prototype, "langgraph", { get() {
    const zodThis = this;
    return {
      metadata(jsonSchemaExtra) {
        return withLangGraph(zodThis, { jsonSchemaExtra });
      },
      reducer(fn, schema) {
        return withLangGraph(zodThis, {
          default: getInteropZodDefaultGetter(zodThis),
          reducer: {
            schema,
            fn
          }
        });
      }
    };
  } });
  cache.add(prototype);
}
try {
  applyPluginPrototype(ZodType.prototype);
  applyPluginPrototype(ZodType$1.prototype);
} catch (error) {
  throw new Error("Failed to extend Zod with LangGraph-related methods. This is most likely a bug, consider opening an issue and/or using `withLangGraph` to augment your Zod schema.", { cause: error });
}
var LanggraphZodMetaRegistry = class extends $ZodRegistry {
  /**
  * Creates a new LanggraphZodMetaRegistry instance.
  *
  * @param parent - The base SchemaMetaRegistry to use for metadata storage.
  */
  constructor(parent) {
    super();
    this.parent = parent;
    this._map = this.parent._map;
  }
  add(schema, ..._meta) {
    const firstMeta = _meta[0];
    if (firstMeta && !firstMeta?.default) {
      const defaultValueGetter = getInteropZodDefaultGetter(schema);
      if (defaultValueGetter != null) firstMeta.default = defaultValueGetter;
    }
    return super.add(schema, ..._meta);
  }
};
new LanggraphZodMetaRegistry(schemaMetaRegistry);
function createAgentState(hasStructuredResponse = true, stateSchema, middlewareList = []) {
  const stateFields = { jumpTo: new UntrackedValue() };
  const inputFields = {};
  const outputFields = {};
  const applySchema = (schema) => {
    if (StateSchema.isInstance(schema)) {
      for (const [key, field] of Object.entries(schema.fields)) if (!(key in stateFields)) {
        stateFields[key] = field;
        if (key.startsWith("_")) continue;
        if (ReducedValue.isInstance(field)) {
          inputFields[key] = field.inputSchema || field.valueSchema;
          outputFields[key] = field.valueSchema;
        } else {
          inputFields[key] = field;
          outputFields[key] = field;
        }
      }
      return;
    }
    const shape = getInteropZodObjectShape(schema);
    for (const [key, fieldSchema] of Object.entries(shape)) {
      const isPrivate = key.startsWith("_");
      if (!(key in stateFields)) {
        if (isZodSchemaV4(fieldSchema)) {
          const meta = schemaMetaRegistry.get(fieldSchema);
          if (meta?.reducer) {
            if (meta.reducer.schema) {
              stateFields[key] = new ReducedValue(fieldSchema, {
                inputSchema: meta.reducer.schema,
                reducer: meta.reducer.fn
              });
              if (!isPrivate) {
                inputFields[key] = meta.reducer.schema;
                outputFields[key] = fieldSchema;
              }
            } else {
              stateFields[key] = new ReducedValue(fieldSchema, { reducer: meta.reducer.fn });
              if (!isPrivate) {
                inputFields[key] = fieldSchema;
                outputFields[key] = fieldSchema;
              }
            }
            continue;
          }
        }
        stateFields[key] = fieldSchema;
        if (!isPrivate) {
          inputFields[key] = fieldSchema;
          outputFields[key] = fieldSchema;
        }
      }
    }
  };
  if (stateSchema && (StateSchema.isInstance(stateSchema) || isInteropZodObject(stateSchema))) applySchema(stateSchema);
  for (const middleware of middlewareList) if (middleware.stateSchema && (StateSchema.isInstance(middleware.stateSchema) || isInteropZodObject(middleware.stateSchema))) applySchema(middleware.stateSchema);
  if (hasStructuredResponse) outputFields.structuredResponse = new UntrackedValue();
  return {
    state: new StateSchema({
      messages: MessagesValue,
      ...stateFields
    }),
    input: new StateSchema({
      messages: MessagesValue,
      ...inputFields
    }),
    output: new StateSchema({
      messages: MessagesValue,
      ...outputFields
    })
  };
}
const NAME_PATTERN = /<name>(.*?)<\/name>/s;
const CONTENT_PATTERN = /<content>(.*?)<\/content>/s;
function parseMiddlewareState(stateSchema, state) {
  if (StateSchema.isInstance(stateSchema)) {
    const result = {};
    for (const key of Object.keys(stateSchema.fields)) if (key in state) result[key] = state[key];
    return result;
  }
  if (isInteropZodSchema(stateSchema)) return interopParse(stateSchema, state);
  throw new Error(`Invalid state schema type: ${typeof stateSchema}`);
}
function _addInlineAgentName(message) {
  if (!AIMessage.isInstance(message) || AIMessageChunk.isInstance(message)) return message;
  if (!message.name) return message;
  const { name } = message;
  if (typeof message.content === "string") return new AIMessage({
    ...message.lc_kwargs,
    content: `<name>${name}</name><content>${message.content}</content>`,
    name: void 0
  });
  const updatedContent = [];
  let textBlockCount = 0;
  for (const contentBlock of message.content) if (typeof contentBlock === "string") {
    textBlockCount += 1;
    updatedContent.push(`<name>${name}</name><content>${contentBlock}</content>`);
  } else if (typeof contentBlock === "object" && "type" in contentBlock && contentBlock.type === "text") {
    textBlockCount += 1;
    updatedContent.push({
      ...contentBlock,
      text: `<name>${name}</name><content>${contentBlock.text}</content>`
    });
  } else updatedContent.push(contentBlock);
  if (!textBlockCount) updatedContent.unshift({
    type: "text",
    text: `<name>${name}</name><content></content>`
  });
  return new AIMessage({
    ...message.lc_kwargs,
    content: updatedContent,
    name: void 0
  });
}
function _removeInlineAgentName(message) {
  if (!AIMessage.isInstance(message) || !message.content) return message;
  let updatedContent = [];
  let updatedName;
  if (Array.isArray(message.content)) updatedContent = message.content.filter((block) => {
    if (block.type === "text" && typeof block.text === "string") {
      const nameMatch = block.text.match(NAME_PATTERN);
      const contentMatch = block.text.match(CONTENT_PATTERN);
      if (nameMatch && (!contentMatch || contentMatch[1] === "")) {
        updatedName = nameMatch[1];
        return false;
      }
      return true;
    }
    return true;
  }).map((block) => {
    if (block.type === "text" && typeof block.text === "string") {
      const nameMatch = block.text.match(NAME_PATTERN);
      const contentMatch = block.text.match(CONTENT_PATTERN);
      if (!nameMatch || !contentMatch) return block;
      updatedName = nameMatch[1];
      return {
        ...block,
        text: contentMatch[1]
      };
    }
    return block;
  });
  else {
    const content = message.content;
    const nameMatch = content.match(NAME_PATTERN);
    const contentMatch = content.match(CONTENT_PATTERN);
    if (!nameMatch || !contentMatch) return message;
    updatedName = nameMatch[1];
    updatedContent = contentMatch[1];
  }
  return new AIMessage({
    ...Object.keys(message.lc_kwargs ?? {}).length > 0 ? message.lc_kwargs : message,
    content: updatedContent,
    name: updatedName
  });
}
function isClientTool(tool2) {
  return Runnable.isRunnable(tool2);
}
function _isChatModelWithBindTools(llm) {
  if (!isBaseChatModel(llm)) return false;
  return "bindTools" in llm && typeof llm.bindTools === "function";
}
const _simpleBindTools = (llm, toolClasses, options = {}) => {
  if (_isChatModelWithBindTools(llm)) return llm.bindTools(toolClasses, options);
  if (RunnableBinding.isRunnableBinding(llm) && _isChatModelWithBindTools(llm.bound)) {
    const newBound = llm.bound.bindTools(toolClasses, options);
    if (RunnableBinding.isRunnableBinding(newBound)) return new RunnableBinding({
      bound: newBound.bound,
      config: {
        ...llm.config,
        ...newBound.config
      },
      kwargs: {
        ...llm.kwargs,
        ...newBound.kwargs
      },
      configFactories: newBound.configFactories ?? llm.configFactories
    });
    return new RunnableBinding({
      bound: newBound,
      config: llm.config,
      kwargs: llm.kwargs,
      configFactories: llm.configFactories
    });
  }
  return null;
};
function validateLLMHasNoBoundTools(llm) {
  if (typeof llm === "function") return;
  let model = llm;
  if (RunnableSequence.isRunnableSequence(model)) model = model.steps.find((step) => RunnableBinding.isRunnableBinding(step)) || model;
  if (isConfigurableModel(model))
    return;
  if (RunnableBinding.isRunnableBinding(model)) {
    const hasToolsInKwargs = model.kwargs != null && typeof model.kwargs === "object" && "tools" in model.kwargs && Array.isArray(model.kwargs.tools) && model.kwargs.tools.length > 0;
    const hasToolsInConfig = model.config != null && typeof model.config === "object" && "tools" in model.config && Array.isArray(model.config.tools) && model.config.tools.length > 0;
    if (hasToolsInKwargs || hasToolsInConfig) throw new MultipleToolsBoundError();
  }
  if ("tools" in model && model.tools !== void 0 && Array.isArray(model.tools) && model.tools.length > 0) throw new MultipleToolsBoundError();
}
function hasToolCalls(message) {
  return Boolean(AIMessage.isInstance(message) && message.tool_calls && message.tool_calls.length > 0);
}
function normalizeSystemPrompt(systemPrompt) {
  if (systemPrompt == null) return new SystemMessage("");
  if (SystemMessage.isInstance(systemPrompt)) return systemPrompt;
  if (typeof systemPrompt === "string") return new SystemMessage({ content: [{
    type: "text",
    text: systemPrompt
  }] });
  throw new Error(`Invalid systemPrompt type: expected string or SystemMessage, got ${typeof systemPrompt}`);
}
async function bindTools(llm, toolClasses, options = {}) {
  const model = _simpleBindTools(llm, toolClasses, options);
  if (model) return model;
  if (isConfigurableModel(llm)) {
    const model2 = _simpleBindTools(await llm._getModelInstance(), toolClasses, options);
    if (model2) return model2;
  }
  if (RunnableSequence.isRunnableSequence(llm)) {
    const modelStep = llm.steps.findIndex((step) => RunnableBinding.isRunnableBinding(step) || isBaseChatModel(step) || isConfigurableModel(step));
    if (modelStep >= 0) {
      const model2 = _simpleBindTools(llm.steps[modelStep], toolClasses, options);
      if (model2) {
        const nextSteps = llm.steps.slice();
        nextSteps.splice(modelStep, 1, model2);
        return RunnableSequence.from(nextSteps);
      }
    }
  }
  throw new Error(`llm ${llm} must define bindTools method.`);
}
function chainToolCallHandlers(handlers) {
  if (handlers.length === 0) return;
  if (handlers.length === 1) return handlers[0];
  function composeTwo(outer, inner) {
    return async (request, handler) => {
      const innerHandler = async (passedRequest) => {
        return inner(passedRequest, handler);
      };
      return outer(request, innerHandler);
    };
  }
  let result = handlers[handlers.length - 1];
  for (let i = handlers.length - 2; i >= 0; i--) result = composeTwo(handlers[i], result);
  return result;
}
function wrapToolCall(middleware) {
  const middlewareWithWrapToolCall = middleware.filter((m) => m.wrapToolCall);
  if (middlewareWithWrapToolCall.length === 0) return;
  return chainToolCallHandlers(middlewareWithWrapToolCall.map((m) => {
    const originalHandler = m.wrapToolCall;
    const wrappedHandler = async (request, handler) => {
      const originalState = request.state;
      const wrappedInnerHandler = async (passedRequest) => {
        const mergedState = {
          ...originalState,
          ...passedRequest.state
        };
        return handler({
          ...passedRequest,
          state: mergedState
        });
      };
      try {
        const result = await originalHandler({
          ...request,
          /**
          * override state with the state from the specific middleware
          */
          state: {
            messages: originalState.messages,
            ...m.stateSchema ? parseMiddlewareState(m.stateSchema, { ...originalState }) : {}
          }
        }, wrappedInnerHandler);
        if (!ToolMessage.isInstance(result) && !isCommand(result)) throw new Error(`Invalid response from "wrapToolCall" in middleware "${m.name}": expected ToolMessage or Command, got ${typeof result}`);
        return result;
      } catch (error) {
        throw MiddlewareError.wrap(error, m.name);
      }
    };
    return wrappedHandler;
  }));
}
const GRAPH_DEFAULT_CONFIG_KEYS = [
  "tags",
  "metadata",
  "runName",
  "maxConcurrency",
  "recursionLimit",
  "configurable"
];
function toGraphDefaultConfig(config) {
  const result = {};
  for (const key of GRAPH_DEFAULT_CONFIG_KEYS) {
    const value = config[key];
    if (value !== void 0) result[key] = value;
  }
  return result;
}
async function initializeMiddlewareStates(middlewareList, state) {
  const middlewareStates = {};
  for (const middleware of middlewareList) {
    if (!middleware.stateSchema) continue;
    let zodSchema;
    if (StateSchema.isInstance(middleware.stateSchema)) {
      const zodShape = {};
      for (const [key, field] of Object.entries(middleware.stateSchema.fields)) if (ReducedValue.isInstance(field)) zodShape[key] = field.inputSchema || field.valueSchema;
      else zodShape[key] = field;
      zodSchema = object(zodShape);
    } else if (isInteropZodObject(middleware.stateSchema)) zodSchema = middleware.stateSchema;
    else continue;
    const parseResult = await interopSafeParseAsync(interopZodObjectMakeFieldsOptional(zodSchema, (key) => key.startsWith("_")), state);
    if (parseResult.success) {
      Object.assign(middlewareStates, parseResult.data);
      continue;
    }
    const requiredFields = parseResult.error.issues.filter((issue) => issue.code === "invalid_type").map((issue) => `  - ${issue.path.join(".")}: Required`).join("\n");
    throw new Error(`Middleware "${middleware.name}" has required state fields that must be initialized:
${requiredFields}

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
     ${parseResult.error.issues[0]?.path.join(".")}: "value"
   })`);
  }
  return middlewareStates;
}
function derivePrivateState(stateSchema) {
  const builtInStateSchema = {
    messages: custom(() => []),
    structuredResponse: any().optional()
  };
  if (!stateSchema) return object(builtInStateSchema);
  let shape;
  if (StateSchema.isInstance(stateSchema)) {
    shape = {};
    for (const [key, field] of Object.entries(stateSchema.fields)) if (ReducedValue.isInstance(field)) shape[key] = field.inputSchema || field.valueSchema;
    else shape[key] = field;
  } else if (isInteropZodObject(stateSchema)) shape = getInteropZodObjectShape(stateSchema);
  else return object(builtInStateSchema);
  const privateShape = { ...builtInStateSchema };
  for (const [key, value] of Object.entries(shape)) if (key.startsWith("_")) privateShape[key] = value.optional();
  else privateShape[key] = value;
  return object(privateShape);
}
function toPartialZodObject(schema) {
  if (isInteropZodObject(schema)) return interopZodObjectPartial(schema);
  if (StateSchema.isInstance(schema)) {
    const partialShape = {};
    for (const [key, field] of Object.entries(schema.fields)) {
      let fieldSchema;
      if (ReducedValue.isInstance(field)) fieldSchema = field.inputSchema || field.valueSchema;
      else fieldSchema = field;
      partialShape[key] = isZodSchemaV4(fieldSchema) ? fieldSchema.optional() : any().optional();
    }
    return object(partialShape);
  }
  return object({});
}
function parseJumpToTarget(target) {
  if (!target) return;
  if ([
    "model_request",
    "tools",
    END
  ].includes(target)) return target;
  if (target === "model") return "model_request";
  if (target === "tools") return "tools";
  if (target === "end") return END;
  throw new Error(`Invalid jump target: ${target}, must be "model", "tools" or "end".`);
}
function mergeAbortSignals(...signals) {
  return AbortSignal.any(signals.filter((maybeSignal) => maybeSignal !== null && maybeSignal !== void 0 && typeof maybeSignal === "object" && "aborted" in maybeSignal && typeof maybeSignal.aborted === "boolean"));
}
var RunnableCallable2 = class extends Runnable {
  lc_namespace = ["langgraph"];
  func;
  tags;
  config;
  trace = true;
  recurse = true;
  #state;
  constructor(fields) {
    super();
    this.name = fields.name ?? fields.func.name;
    this.func = fields.func;
    this.config = fields.tags ? { tags: fields.tags } : void 0;
    this.recurse = fields.recurse ?? this.recurse;
  }
  getState() {
    return this.#state;
  }
  /**
  * This allows us to set the state of the runnable, e.g. for model and middleware nodes.
  * @internal
  */
  setState(state) {
    this.#state = {
      ...this.#state,
      ...state
    };
  }
  async invoke(input, options) {
    const mergedConfig = mergeConfigs(this.config, options);
    const returnValue = await AsyncLocalStorageProviderSingleton.runWithConfig(mergedConfig, async () => this.func(input, mergedConfig));
    if (Runnable.isRunnable(returnValue) && this.recurse) return await AsyncLocalStorageProviderSingleton.runWithConfig(mergedConfig, async () => returnValue.invoke(input, mergedConfig));
    this.#state = returnValue;
    return returnValue;
  }
};
function withAgentName(model, agentNameMode) {
  let processInputMessage;
  let processOutputMessage;
  if (agentNameMode === "inline") {
    processInputMessage = _addInlineAgentName;
    processOutputMessage = _removeInlineAgentName;
  } else throw new Error(`Invalid agent name mode: ${agentNameMode}. Needs to be one of: "inline"`);
  function processInputMessages(messages) {
    return messages.map(processInputMessage);
  }
  return RunnableSequence.from([
    RunnableLambda.from(processInputMessages),
    model,
    RunnableLambda.from(processOutputMessage)
  ]);
}
function isInternalModelResponse(response) {
  return AIMessage.isInstance(response) || isCommand(response) || typeof response === "object" && response !== null && "structuredResponse" in response && "messages" in response;
}
const AGENT_NODE_NAME = "model_request";
var AgentNode = class extends RunnableCallable2 {
  #options;
  #systemMessage;
  constructor(options) {
    super({
      name: options.name ?? "model",
      func: (input, config) => this.#run(input, config)
    });
    this.#options = options;
    this.#systemMessage = options.systemMessage;
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
  async #getResponseFormat(model, responseFormat = this.#options.responseFormat) {
    if (!responseFormat) return;
    let resolvedModel;
    if (isConfigurableModel(model)) resolvedModel = await model._getModelInstance();
    else if (typeof model !== "string") resolvedModel = model;
    const strategies = transformResponseFormat(responseFormat, void 0, resolvedModel);
    if (strategies.length === 0) return;
    if (!strategies.every((format) => format instanceof ProviderStrategy)) return {
      type: "tool",
      tools: strategies.filter((format) => format instanceof ToolStrategy).reduce((acc, format) => {
        acc[format.name] = format;
        return acc;
      }, {})
    };
    return {
      type: "native",
      /**
      * there can only be one provider strategy
      */
      strategy: strategies[0]
    };
  }
  async #run(state, config) {
    const lastMessage = state.messages.at(-1);
    if (lastMessage && ToolMessage.isInstance(lastMessage) && lastMessage.name && this.#options.shouldReturnDirect.has(lastMessage.name)) return [new Command({ update: { messages: [] } })];
    const { response, lastAiMessage, collectedCommands } = await this.#invokeModel(state, config);
    if (typeof response === "object" && response !== null && "structuredResponse" in response && "messages" in response) {
      const { structuredResponse, messages } = response;
      return {
        messages: [...state.messages, ...messages],
        structuredResponse
      };
    }
    const commands = [];
    const aiMessage = AIMessage.isInstance(response) ? response : lastAiMessage;
    if (aiMessage) {
      aiMessage.name = this.name;
      aiMessage.lc_kwargs.name = this.name;
      if (this.#areMoreStepsNeeded(state, aiMessage)) commands.push(new Command({ update: { messages: [new AIMessage({
        content: "Sorry, need more steps to process this request.",
        name: this.name,
        id: aiMessage.id
      })] } }));
      else commands.push(new Command({ update: { messages: [aiMessage] } }));
    }
    if (isCommand(response) && !collectedCommands.includes(response)) commands.push(response);
    commands.push(...collectedCommands);
    return commands;
  }
  /**
  * Derive the model from the options.
  * @param state - The state of the agent.
  * @param config - The config of the agent.
  * @returns The model.
  */
  #deriveModel() {
    if (typeof this.#options.model === "string") return initChatModel(this.#options.model);
    if (this.#options.model) return this.#options.model;
    throw new Error("No model option was provided, either via `model` option.");
  }
  async #invokeModel(state, config, options = {}) {
    const model = await this.#deriveModel();
    const lgConfig = config;
    let currentSystemMessage = this.#systemMessage;
    let lastAiMessage = null;
    const collectedCommands = [];
    const baseHandler = async (request) => {
      validateLLMHasNoBoundTools(request.model);
      const structuredResponseFormat = await this.#getResponseFormat(request.model, request.responseFormat);
      const modelWithTools = await this.#bindTools(request.model, request, structuredResponseFormat);
      const messages = [...currentSystemMessage.text === "" ? [] : [currentSystemMessage], ...request.messages];
      const signal = mergeAbortSignals(this.#options.signal, config.signal);
      const response = await raceWithSignal(modelWithTools.invoke(messages, {
        ...config,
        signal
      }), signal);
      lastAiMessage = response;
      if (structuredResponseFormat?.type === "native") {
        const structuredResponse = structuredResponseFormat.strategy.parse(response);
        if (structuredResponse) return {
          structuredResponse,
          messages: [response]
        };
        if (!response.tool_calls || response.tool_calls.length === 0) throw new StructuredOutputParsingError(typeof structuredResponseFormat.strategy.schema?.title === "string" ? structuredResponseFormat.strategy.schema.title : "providerStrategy", ["Model output did not satisfy the provided response schema."]);
        return response;
      }
      if (!structuredResponseFormat || !response.tool_calls) return response;
      const toolCalls = response.tool_calls.filter((call2) => call2.name in structuredResponseFormat.tools);
      if (toolCalls.length === 0) return response;
      if (toolCalls.length > 1) return this.#handleMultipleStructuredOutputs(response, toolCalls, structuredResponseFormat);
      const toolMessageContent = structuredResponseFormat.tools[toolCalls[0].name]?.options?.toolMessageContent;
      return this.#handleSingleStructuredOutput(response, toolCalls[0], structuredResponseFormat, toolMessageContent ?? options.lastMessage);
    };
    const wrapperMiddleware = this.#options.wrapModelCallHookMiddleware ?? [];
    let wrappedHandler = baseHandler;
    for (let i = wrapperMiddleware.length - 1; i >= 0; i--) {
      const middlewareEntry = wrapperMiddleware[i];
      const middleware = Array.isArray(middlewareEntry) ? middlewareEntry[0] : middlewareEntry;
      if (middleware.wrapModelCall) {
        const innerHandler = wrappedHandler;
        const currentMiddleware = middleware;
        wrappedHandler = async (request) => {
          const baselineSystemMessage = currentSystemMessage;
          const context2 = currentMiddleware.contextSchema ? interopParse(currentMiddleware.contextSchema, lgConfig?.context || {}) : lgConfig?.context;
          const runtime = Object.freeze({
            context: context2,
            store: lgConfig.store,
            configurable: lgConfig.configurable,
            writer: lgConfig.writer,
            interrupt: lgConfig.interrupt,
            signal: lgConfig.signal
          });
          const requestWithStateAndRuntime = {
            ...request,
            state: {
              ...middleware.stateSchema ? interopParse(toPartialZodObject(middleware.stateSchema), state) : {},
              messages: state.messages
            },
            runtime
          };
          const handlerWithValidation = async (req) => {
            currentSystemMessage = baselineSystemMessage;
            const modifiedTools = req.tools ?? [];
            const registeredToolsByName = new Map(this.#options.toolClasses.filter(isClientTool).map((t) => [t.name, t]));
            const addedClientTools = modifiedTools.filter((tool2) => isClientTool(tool2) && !registeredToolsByName.has(tool2.name));
            const replacedClientTools = modifiedTools.filter((tool2) => {
              if (!isClientTool(tool2)) return false;
              const original = registeredToolsByName.get(tool2.name);
              return original != null && original !== tool2;
            });
            if (addedClientTools.length > 0) {
              if (!this.#options.middleware?.some((m) => m.wrapToolCall != null)) throw new Error(`You have added a new tool in "wrapModelCall" hook of middleware "${currentMiddleware.name}": ${addedClientTools.map((tool2) => tool2.name).join(", ")}. This is not supported unless a middleware provides a "wrapToolCall" handler to execute it.`);
            }
            if (replacedClientTools.length > 0) throw new Error(`You have modified a tool in "wrapModelCall" hook of middleware "${currentMiddleware.name}": ${replacedClientTools.map((tool2) => tool2.name).join(", ")}. This is not supported.`);
            let normalizedReq = req;
            const hasSystemPromptChanged = req.systemPrompt !== currentSystemMessage.text;
            const hasSystemMessageChanged = req.systemMessage !== currentSystemMessage;
            if (hasSystemPromptChanged && hasSystemMessageChanged) throw new Error("Cannot change both systemPrompt and systemMessage in the same request.");
            if (hasSystemPromptChanged) {
              currentSystemMessage = new SystemMessage({ content: [{
                type: "text",
                text: req.systemPrompt
              }] });
              normalizedReq = {
                ...req,
                systemPrompt: currentSystemMessage.text,
                systemMessage: currentSystemMessage
              };
            }
            if (hasSystemMessageChanged) {
              currentSystemMessage = new SystemMessage({ ...req.systemMessage });
              normalizedReq = {
                ...req,
                systemPrompt: currentSystemMessage.text,
                systemMessage: currentSystemMessage
              };
            }
            const innerHandlerResult = await innerHandler(normalizedReq);
            if (isCommand(innerHandlerResult) && lastAiMessage) {
              if (!collectedCommands.includes(innerHandlerResult)) collectedCommands.push(innerHandlerResult);
              return lastAiMessage;
            }
            return innerHandlerResult;
          };
          if (!currentMiddleware.wrapModelCall) return handlerWithValidation(requestWithStateAndRuntime);
          try {
            const middlewareResponse = await currentMiddleware.wrapModelCall(requestWithStateAndRuntime, handlerWithValidation);
            if (!isInternalModelResponse(middlewareResponse)) throw new Error(`Invalid response from "wrapModelCall" in middleware "${currentMiddleware.name}": expected AIMessage or Command, got ${typeof middlewareResponse}`);
            if (AIMessage.isInstance(middlewareResponse)) lastAiMessage = middlewareResponse;
            else if (isCommand(middlewareResponse)) collectedCommands.push(middlewareResponse);
            return middlewareResponse;
          } catch (error) {
            throw MiddlewareError.wrap(error, currentMiddleware.name);
          }
        };
      }
    }
    currentSystemMessage = this.#systemMessage;
    const initialRequest = {
      model,
      responseFormat: this.#options.responseFormat,
      systemPrompt: currentSystemMessage?.text,
      systemMessage: currentSystemMessage,
      messages: state.messages,
      tools: this.#options.toolClasses,
      state,
      runtime: Object.freeze({
        context: lgConfig?.context,
        store: lgConfig.store,
        configurable: lgConfig.configurable,
        writer: lgConfig.writer,
        interrupt: lgConfig.interrupt,
        signal: lgConfig.signal
      })
    };
    return {
      response: await wrappedHandler(initialRequest),
      lastAiMessage,
      collectedCommands
    };
  }
  /**
  * If the model returns multiple structured outputs, we need to handle it.
  * @param response - The response from the model
  * @param toolCalls - The tool calls that were made
  * @returns The response from the model
  */
  #handleMultipleStructuredOutputs(response, toolCalls, responseFormat) {
    const multipleStructuredOutputsError = new MultipleStructuredOutputsError(toolCalls.map((call2) => call2.name));
    return this.#handleToolStrategyError(multipleStructuredOutputsError, response, toolCalls[0], responseFormat);
  }
  /**
  * If the model returns a single structured output, we need to handle it.
  * @param toolCall - The tool call that was made
  * @returns The structured response and a message to the LLM if needed
  */
  #handleSingleStructuredOutput(response, toolCall, responseFormat, lastMessage) {
    const tool2 = responseFormat.tools[toolCall.name];
    try {
      const structuredResponse = tool2.parse(toolCall.args);
      return {
        structuredResponse,
        messages: [
          response,
          new ToolMessage({
            tool_call_id: toolCall.id ?? "",
            content: JSON.stringify(structuredResponse),
            name: toolCall.name
          }),
          new AIMessage(lastMessage ?? `Returning structured response: ${JSON.stringify(structuredResponse)}`)
        ]
      };
    } catch (error) {
      return this.#handleToolStrategyError(error, response, toolCall, responseFormat);
    }
  }
  async #handleToolStrategyError(error, response, toolCall, responseFormat) {
    const errorHandler = Object.values(responseFormat.tools).at(0)?.options?.handleError;
    const toolCallId = toolCall.id;
    if (!toolCallId) throw new Error("Tool call ID is required to handle tool output errors. Please provide a tool call ID.");
    if (errorHandler === false) throw error;
    if (errorHandler === void 0 || typeof errorHandler === "boolean" && errorHandler || Array.isArray(errorHandler) && errorHandler.some((h) => h instanceof MultipleStructuredOutputsError)) return new Command({
      update: { messages: [response, new ToolMessage({
        content: error.message,
        tool_call_id: toolCallId
      })] },
      goto: AGENT_NODE_NAME
    });
    if (typeof errorHandler === "string") return new Command({
      update: { messages: [response, new ToolMessage({
        content: errorHandler,
        tool_call_id: toolCallId
      })] },
      goto: AGENT_NODE_NAME
    });
    if (typeof errorHandler === "function") {
      const content = await errorHandler(error);
      if (typeof content !== "string") throw new Error("Error handler must return a string.");
      return new Command({
        update: { messages: [response, new ToolMessage({
          content,
          tool_call_id: toolCallId
        })] },
        goto: AGENT_NODE_NAME
      });
    }
    return new Command({
      update: { messages: [response, new ToolMessage({
        content: error.message,
        tool_call_id: toolCallId
      })] },
      goto: AGENT_NODE_NAME
    });
  }
  #areMoreStepsNeeded(state, response) {
    const allToolsReturnDirect = AIMessage.isInstance(response) && response.tool_calls?.every((call2) => this.#options.shouldReturnDirect.has(call2.name));
    const remainingSteps = "remainingSteps" in state ? state.remainingSteps : void 0;
    return Boolean(remainingSteps && (remainingSteps < 1 && allToolsReturnDirect || remainingSteps < 2 && hasToolCalls(state.messages.at(-1))));
  }
  async #bindTools(model, preparedOptions, structuredResponseFormat) {
    const options = {};
    const structuredTools = Object.values(structuredResponseFormat && "tools" in structuredResponseFormat ? structuredResponseFormat.tools : {});
    const allTools = [...preparedOptions?.tools ?? this.#options.toolClasses, ...structuredTools.map((toolStrategy) => toolStrategy.tool)];
    const toolChoice = preparedOptions?.toolChoice || (structuredTools.length > 0 ? "any" : void 0);
    if (structuredResponseFormat?.type === "native") {
      const resolvedStrict = preparedOptions?.modelSettings?.strict ?? structuredResponseFormat?.strategy?.strict ?? true;
      const jsonSchemaParams = {
        name: structuredResponseFormat.strategy.schema?.name ?? "extract",
        description: getSchemaDescription(structuredResponseFormat.strategy.schema),
        schema: structuredResponseFormat.strategy.schema,
        strict: resolvedStrict
      };
      Object.assign(options, {
        /**
        * OpenAI-style options
        * Used by ChatOpenAI, ChatXAI, and other OpenAI-compatible providers.
        */
        response_format: {
          type: "json_schema",
          json_schema: jsonSchemaParams
        },
        /**
        * Anthropic-style options
        */
        outputConfig: { format: {
          type: "json_schema",
          schema: structuredResponseFormat.strategy.schema
        } },
        /**
        * Google-style options
        * Used by ChatGoogle and other Gemini-based providers.
        */
        responseSchema: structuredResponseFormat.strategy.schema,
        /**
        * for LangSmith structured output tracing
        */
        ls_structured_output_format: {
          kwargs: { method: "json_schema" },
          schema: structuredResponseFormat.strategy.schema
        },
        /**
        * Don't force strict on tools: it makes Anthropic's combined grammar
        * "too complex for compilation", and only OpenAI Chat Completions needs
        * it (re-applied there). Honor an explicit override; else leave unset.
        */
        strict: preparedOptions?.modelSettings?.strict
      });
    }
    const modelWithTools = await bindTools(model, allTools, {
      ...options,
      ...preparedOptions?.modelSettings,
      tool_choice: toolChoice
    });
    return this.#options.includeAgentName === "inline" ? withAgentName(modelWithTools, this.#options.includeAgentName) : modelWithTools;
  }
  /**
  * Returns internal bookkeeping state for StateManager, not graph output.
  * The return shape differs from the node's output type (Command).
  */
  getState() {
    const state = super.getState();
    return {
      messages: [],
      ...state && !isCommand(state) ? state : {}
    };
  }
};
const getInvalidToolError = (toolName, availableTools) => `Error: ${toolName} is not a valid tool, try one of [${availableTools.join(", ")}].`;
const TOOLS_NODE_NAME = "tools";
const isBaseMessageArray = (input) => Array.isArray(input) && input.every(BaseMessage.isInstance);
const isMessagesState = (input) => typeof input === "object" && input != null && "messages" in input && isBaseMessageArray(input.messages);
const isSendInput = (input) => typeof input === "object" && input != null && "lg_tool_call" in input;
function defaultHandleToolErrors(error, toolCall) {
  if (error instanceof ToolInvocationError) return new ToolMessage({
    content: error.message,
    tool_call_id: toolCall.id,
    name: toolCall.name
  });
  return new ToolMessage({
    content: `${error}
 Please fix your mistakes.`,
    tool_call_id: toolCall.id,
    name: toolCall.name
  });
}
var ToolNode = class extends RunnableCallable2 {
  tools;
  trace = false;
  signal;
  handleToolErrors = defaultHandleToolErrors;
  wrapToolCall;
  constructor(tools, options) {
    const { name, tags, handleToolErrors, signal, wrapToolCall: wrapToolCall2 } = options ?? {};
    super({
      name,
      tags,
      func: (state, config) => this.run(state, config)
    });
    this.options = options;
    this.tools = tools;
    this.handleToolErrors = handleToolErrors ?? this.handleToolErrors;
    this.signal = signal;
    this.wrapToolCall = wrapToolCall2;
  }
  /**
  * Handle errors from tool execution or middleware.
  * @param error - The error to handle
  * @param call - The tool call that caused the error
  * @param isMiddlewareError - Whether the error came from wrapToolCall middleware
  * @returns ToolMessage if error is handled, otherwise re-throws
  */
  #handleError(error, call2, isMiddlewareError) {
    if (isGraphInterrupt(error)) throw error;
    if (this.signal?.aborted) throw error;
    if (isMiddlewareError && this.handleToolErrors !== true) throw error;
    if (!this.handleToolErrors) throw error;
    if (typeof this.handleToolErrors === "function") {
      const result = this.handleToolErrors(error, call2);
      if (result && ToolMessage.isInstance(result)) return result;
      throw error;
    } else if (this.handleToolErrors) return new ToolMessage({
      name: call2.name,
      content: `${error}
 Please fix your mistakes.`,
      tool_call_id: call2.id
    });
    throw error;
  }
  async runTool(call2, config, state) {
    const lgConfig = config;
    const runtime = {
      context: lgConfig?.context,
      store: lgConfig?.store,
      configurable: lgConfig?.configurable,
      writer: lgConfig?.writer,
      interrupt: lgConfig?.interrupt,
      signal: lgConfig?.signal
    };
    const registeredTool = this.tools.find((t) => t.name === call2.name);
    const baseHandler = async (request2) => {
      const { toolCall, tool: requestTool } = request2;
      const tool2 = requestTool ?? this.tools.find((t) => t.name === toolCall.name);
      if (tool2 === void 0) {
        const availableTools = this.tools.map((t) => t.name);
        return new ToolMessage({
          content: getInvalidToolError(toolCall.name, availableTools),
          tool_call_id: toolCall.id,
          name: toolCall.name,
          status: "error"
        });
      }
      const invokableTool = tool2;
      try {
        const output = await invokableTool.invoke({
          ...toolCall,
          type: "tool_call"
        }, {
          ...config,
          /**
          * extend to match ToolRuntime
          */
          config,
          toolCallId: toolCall.id,
          state: config.configurable?.__pregel_scratchpad?.currentTaskInput,
          signal: mergeAbortSignals(this.signal, config.signal)
        });
        if (ToolMessage.isInstance(output) || isCommand(output)) return output;
        return new ToolMessage({
          name: invokableTool.name,
          content: typeof output === "string" ? output : JSON.stringify(output),
          tool_call_id: toolCall.id
        });
      } catch (e) {
        if (e instanceof ToolInputParsingException) throw new ToolInvocationError(e, toolCall);
        throw e;
      }
    };
    const request = {
      toolCall: call2,
      tool: registeredTool,
      state,
      runtime
    };
    if (this.wrapToolCall) try {
      return await this.wrapToolCall(request, baseHandler);
    } catch (e) {
      return this.#handleError(e, call2, true);
    }
    if (!registeredTool) {
      const availableTools = this.tools.map((t) => t.name);
      return new ToolMessage({
        content: getInvalidToolError(call2.name, availableTools),
        tool_call_id: call2.id,
        name: call2.name,
        status: "error"
      });
    }
    try {
      return await baseHandler(request);
    } catch (e) {
      return this.#handleError(e, call2, false);
    }
  }
  async run(state, config) {
    let outputs;
    if (isSendInput(state)) {
      const { lg_tool_call: _, jumpTo: __, ...newState } = state;
      outputs = [await this.runTool(state.lg_tool_call, config, newState)];
    } else {
      let messages;
      if (isBaseMessageArray(state)) messages = state;
      else if (isMessagesState(state)) messages = state.messages;
      else throw new Error("ToolNode only accepts BaseMessage[] or { messages: BaseMessage[] } as input.");
      const toolMessageIds = new Set(messages.filter((msg) => msg.getType() === "tool").map((msg) => msg.tool_call_id));
      let aiMessage;
      for (let i = messages.length - 1; i >= 0; i -= 1) {
        const message = messages[i];
        if (AIMessage.isInstance(message)) {
          aiMessage = message;
          break;
        }
      }
      if (!AIMessage.isInstance(aiMessage)) throw new Error("ToolNode only accepts AIMessages as input.");
      outputs = await Promise.all(aiMessage.tool_calls?.filter((call2) => call2.id == null || !toolMessageIds.has(call2.id)).map((call2) => this.runTool(call2, config, state)) ?? []);
    }
    if (!outputs.some(isCommand)) return Array.isArray(state) ? outputs : { messages: outputs };
    const combinedOutputs = [];
    let parentCommand = null;
    for (const output of outputs) if (isCommand(output)) if (output.graph === Command.PARENT && Array.isArray(output.goto) && output.goto.every((send) => isSend(send))) if (parentCommand) parentCommand.goto.push(...output.goto);
    else parentCommand = new Command({
      graph: Command.PARENT,
      goto: output.goto
    });
    else combinedOutputs.push(output);
    else combinedOutputs.push(Array.isArray(state) ? [output] : { messages: [output] });
    if (parentCommand) combinedOutputs.push(parentCommand);
    return combinedOutputs;
  }
};
function isSend(x) {
  return x instanceof Send;
}
var AgentContext = class {
};
var AgentRuntime = class {
};
var MiddlewareNode = class extends RunnableCallable2 {
  constructor(fields) {
    super(fields);
  }
  async invokeMiddleware(invokeState, config) {
    let filteredContext = {};
    if (this.middleware.contextSchema && isInteropZodObject(this.middleware.contextSchema)) {
      const schemaShape = getInteropZodObjectShape(this.middleware.contextSchema);
      if (schemaShape) {
        const relevantContext = {};
        const invokeContext = config?.context || {};
        for (const key of Object.keys(schemaShape)) if (key in invokeContext) relevantContext[key] = invokeContext[key];
        filteredContext = interopParse(this.middleware.contextSchema, relevantContext);
      }
    }
    const state = {
      ...invokeState,
      /**
      * don't overwrite possible outdated messages from other middleware nodes
      */
      messages: invokeState.messages
    };
    const runtime = {
      context: filteredContext,
      store: config?.store,
      configurable: config?.configurable,
      writer: config?.writer,
      interrupt: config?.interrupt,
      signal: config?.signal
    };
    const result = await this.runHook(
      state,
      /**
      * assign runtime and context values into empty named class
      * instances to create a better error message.
      */
      Object.freeze(Object.assign(new AgentRuntime(), {
        ...runtime,
        context: Object.freeze(Object.assign(new AgentContext(), filteredContext))
      }))
    );
    if (!result) return { jumpTo: void 0 };
    let jumpToConstraint;
    let constraint;
    if (this.name?.startsWith("BeforeAgentNode_")) {
      jumpToConstraint = getHookConstraint(this.middleware.beforeAgent);
      constraint = "beforeAgent.canJumpTo";
    } else if (this.name?.startsWith("BeforeModelNode_")) {
      jumpToConstraint = getHookConstraint(this.middleware.beforeModel);
      constraint = "beforeModel.canJumpTo";
    } else if (this.name?.startsWith("AfterAgentNode_")) {
      jumpToConstraint = getHookConstraint(this.middleware.afterAgent);
      constraint = "afterAgent.canJumpTo";
    } else if (this.name?.startsWith("AfterModelNode_")) {
      jumpToConstraint = getHookConstraint(this.middleware.afterModel);
      constraint = "afterModel.canJumpTo";
    }
    if (typeof result.jumpTo === "string" && !jumpToConstraint?.includes(result.jumpTo)) {
      const suggestion = jumpToConstraint && jumpToConstraint.length > 0 ? `must be one of: ${jumpToConstraint?.join(", ")}.` : constraint ? `no ${constraint} defined in middleware ${this.middleware.name}` : "";
      throw new Error(`Invalid jump target: ${result.jumpTo}, ${suggestion}.`);
    }
    if (typeof result === "object" && "type" in result) {
      if (result.type === "terminate") {
        if (result.error) throw result.error;
        return {
          ...state,
          ...result.result || {},
          jumpTo: result.jumpTo
        };
      }
      throw new Error(`Invalid control action: ${JSON.stringify(result)}`);
    }
    return {
      ...state,
      ...result,
      jumpTo: result.jumpTo
    };
  }
  get nodeOptions() {
    return { input: derivePrivateState(this.middleware.stateSchema) };
  }
};
var BeforeAgentNode = class extends MiddlewareNode {
  lc_namespace = [
    "langchain",
    "agents",
    "beforeAgentNodes"
  ];
  constructor(middleware) {
    super({
      name: `BeforeAgentNode_${middleware.name}`,
      func: async (state, config) => this.invokeMiddleware(state, config)
    });
    this.middleware = middleware;
  }
  runHook(state, runtime) {
    return getHookFunction(this.middleware.beforeAgent)(state, runtime);
  }
};
var BeforeModelNode = class extends MiddlewareNode {
  lc_namespace = [
    "langchain",
    "agents",
    "beforeModelNodes"
  ];
  constructor(middleware) {
    super({
      name: `BeforeModelNode_${middleware.name}`,
      func: async (state, config) => this.invokeMiddleware(state, config)
    });
    this.middleware = middleware;
  }
  runHook(state, runtime) {
    return getHookFunction(this.middleware.beforeModel)(state, runtime);
  }
};
var AfterModelNode = class extends MiddlewareNode {
  lc_namespace = [
    "langchain",
    "agents",
    "afterModelNodes"
  ];
  constructor(middleware) {
    super({
      name: `AfterModelNode_${middleware.name}`,
      func: async (state, config) => this.invokeMiddleware(state, config)
    });
    this.middleware = middleware;
  }
  runHook(state, runtime) {
    return getHookFunction(this.middleware.afterModel)(state, runtime);
  }
};
var AfterAgentNode = class extends MiddlewareNode {
  lc_namespace = [
    "langchain",
    "agents",
    "afterAgentNodes"
  ];
  constructor(middleware) {
    super({
      name: `AfterAgentNode_${middleware.name}`,
      func: async (state, config) => this.invokeMiddleware(state, config)
    });
    this.middleware = middleware;
  }
  runHook(state, runtime) {
    return getHookFunction(this.middleware.afterAgent)(state, runtime);
  }
};
var ReactAgent = class ReactAgent2 {
  #graph;
  #toolBehaviorVersion = "v2";
  #agentNode;
  #defaultConfig;
  constructor(options, defaultConfig) {
    this.options = options;
    this.#defaultConfig = mergeConfigs(defaultConfig ?? {}, {
      metadata: { ls_integration: "langchain_create_agent" },
      configurable: { ls_agent_type: "root" }
    });
    if (options.name) this.#defaultConfig = mergeConfigs(this.#defaultConfig, { metadata: { lc_agent_name: options.name } });
    this.#toolBehaviorVersion = options.version ?? this.#toolBehaviorVersion;
    if (!options.model) throw new Error("`model` option is required to create an agent.");
    if (typeof options.model !== "string") validateLLMHasNoBoundTools(options.model);
    const middlewareTools = this.options.middleware?.filter((m) => m.tools).flatMap((m) => m.tools) ?? [];
    const toolClasses = [...options.tools ?? [], ...middlewareTools];
    const shouldReturnDirect = new Set(toolClasses.filter(isClientTool).filter((tool2) => "returnDirect" in tool2 && tool2.returnDirect).map((tool2) => tool2.name));
    const hasDynamicStructuredResponse = Boolean(this.options.middleware?.some((middleware2) => middleware2.wrapModelCall));
    const { state, input, output } = createAgentState(this.options.responseFormat !== void 0 || hasDynamicStructuredResponse, this.options.stateSchema, this.options.middleware);
    const allNodeWorkflows = new StateGraph(state, {
      input,
      output,
      context: this.options.contextSchema
    });
    const beforeAgentNodes = [];
    const beforeModelNodes = [];
    const afterModelNodes = [];
    const afterAgentNodes = [];
    const wrapModelCallHookMiddleware = [];
    this.#agentNode = new AgentNode({
      model: this.options.model,
      systemMessage: normalizeSystemPrompt(this.options.systemPrompt),
      includeAgentName: this.options.includeAgentName,
      name: this.options.name,
      responseFormat: this.options.responseFormat,
      middleware: this.options.middleware,
      toolClasses,
      shouldReturnDirect,
      signal: this.options.signal,
      wrapModelCallHookMiddleware
    });
    const middlewareNames = /* @__PURE__ */ new Set();
    const middleware = this.options.middleware ?? [];
    for (let i = 0; i < middleware.length; i++) {
      let beforeAgentNode;
      let beforeModelNode;
      let afterModelNode;
      let afterAgentNode;
      const m = middleware[i];
      if (middlewareNames.has(m.name)) throw new Error(`Middleware ${m.name} is defined multiple times`);
      middlewareNames.add(m.name);
      if (m.beforeAgent) {
        beforeAgentNode = new BeforeAgentNode(m);
        const name = `${m.name}.before_agent`;
        beforeAgentNodes.push({
          index: i,
          name,
          allowed: getHookConstraint(m.beforeAgent)
        });
        allNodeWorkflows.addNode(name, beforeAgentNode, beforeAgentNode.nodeOptions);
      }
      if (m.beforeModel) {
        beforeModelNode = new BeforeModelNode(m);
        const name = `${m.name}.before_model`;
        beforeModelNodes.push({
          index: i,
          name,
          allowed: getHookConstraint(m.beforeModel)
        });
        allNodeWorkflows.addNode(name, beforeModelNode, beforeModelNode.nodeOptions);
      }
      if (m.afterModel) {
        afterModelNode = new AfterModelNode(m);
        const name = `${m.name}.after_model`;
        afterModelNodes.push({
          index: i,
          name,
          allowed: getHookConstraint(m.afterModel)
        });
        allNodeWorkflows.addNode(name, afterModelNode, afterModelNode.nodeOptions);
      }
      if (m.afterAgent) {
        afterAgentNode = new AfterAgentNode(m);
        const name = `${m.name}.after_agent`;
        afterAgentNodes.push({
          index: i,
          name,
          allowed: getHookConstraint(m.afterAgent)
        });
        allNodeWorkflows.addNode(name, afterAgentNode, afterAgentNode.nodeOptions);
      }
      if (m.wrapModelCall) wrapModelCallHookMiddleware.push(m);
    }
    allNodeWorkflows.addNode(AGENT_NODE_NAME, this.#agentNode);
    const hasWrapToolCallMiddleware = middleware.some((m) => m.wrapToolCall);
    const clientTools = toolClasses.filter(isClientTool);
    if (clientTools.length > 0 || hasWrapToolCallMiddleware) {
      const toolNode = new ToolNode(clientTools, {
        signal: this.options.signal,
        wrapToolCall: wrapToolCall(middleware)
      });
      allNodeWorkflows.addNode(TOOLS_NODE_NAME, toolNode);
    }
    let entryNode;
    if (beforeAgentNodes.length > 0) entryNode = beforeAgentNodes[0].name;
    else if (beforeModelNodes.length > 0) entryNode = beforeModelNodes[0].name;
    else entryNode = AGENT_NODE_NAME;
    const loopEntryNode = beforeModelNodes.length > 0 ? beforeModelNodes[0].name : AGENT_NODE_NAME;
    const exitNode = afterAgentNodes.length > 0 ? afterAgentNodes[afterAgentNodes.length - 1].name : END;
    allNodeWorkflows.addEdge(START, entryNode);
    const hasToolsAvailable = clientTools.length > 0 || hasWrapToolCallMiddleware;
    for (let i = 0; i < beforeAgentNodes.length; i++) {
      const node = beforeAgentNodes[i];
      const current = node.name;
      const nextDefault = i === beforeAgentNodes.length - 1 ? loopEntryNode : beforeAgentNodes[i + 1].name;
      if (node.allowed && node.allowed.length > 0) {
        const allowedMapped = node.allowed.map((t) => parseJumpToTarget(t)).filter((dest) => dest !== "tools" || hasToolsAvailable);
        const destinations = Array.from(/* @__PURE__ */ new Set([nextDefault, ...allowedMapped.map((dest) => dest === END ? exitNode : dest)]));
        allNodeWorkflows.addConditionalEdges(current, this.#createBeforeAgentRouter(clientTools, nextDefault, exitNode, hasToolsAvailable), destinations);
      } else allNodeWorkflows.addEdge(current, nextDefault);
    }
    for (let i = 0; i < beforeModelNodes.length; i++) {
      const node = beforeModelNodes[i];
      const current = node.name;
      const nextDefault = i === beforeModelNodes.length - 1 ? AGENT_NODE_NAME : beforeModelNodes[i + 1].name;
      if (node.allowed && node.allowed.length > 0) {
        const allowedMapped = node.allowed.map((t) => parseJumpToTarget(t)).filter((dest) => dest !== "tools" || hasToolsAvailable);
        const destinations = Array.from(/* @__PURE__ */ new Set([nextDefault, ...allowedMapped]));
        allNodeWorkflows.addConditionalEdges(current, this.#createBeforeModelRouter(clientTools, nextDefault, hasToolsAvailable), destinations);
      } else allNodeWorkflows.addEdge(current, nextDefault);
    }
    const lastAfterModelNode = afterModelNodes.at(-1);
    if (afterModelNodes.length > 0 && lastAfterModelNode) allNodeWorkflows.addEdge(AGENT_NODE_NAME, lastAfterModelNode.name);
    else {
      const destinations = this.#getModelPaths(clientTools, false, hasToolsAvailable).map((p) => p === END ? exitNode : p);
      if (destinations.length === 1) allNodeWorkflows.addEdge(AGENT_NODE_NAME, destinations[0]);
      else allNodeWorkflows.addConditionalEdges(AGENT_NODE_NAME, this.#createModelRouter(exitNode), destinations);
    }
    for (let i = afterModelNodes.length - 1; i > 0; i--) {
      const node = afterModelNodes[i];
      const current = node.name;
      const nextDefault = afterModelNodes[i - 1].name;
      if (node.allowed && node.allowed.length > 0) {
        const allowedMapped = node.allowed.map((t) => parseJumpToTarget(t)).filter((dest) => dest !== "tools" || hasToolsAvailable);
        const destinations = Array.from(/* @__PURE__ */ new Set([nextDefault, ...allowedMapped]));
        allNodeWorkflows.addConditionalEdges(current, this.#createAfterModelSequenceRouter(clientTools, node.allowed, nextDefault, hasToolsAvailable), destinations);
      } else allNodeWorkflows.addEdge(current, nextDefault);
    }
    if (afterModelNodes.length > 0) {
      const firstAfterModel = afterModelNodes[0];
      const firstAfterModelNode = firstAfterModel.name;
      const modelPaths = this.#getModelPaths(clientTools, true, hasToolsAvailable).filter((p) => p !== "tools" || hasToolsAvailable);
      const allowJump = Boolean(firstAfterModel.allowed && firstAfterModel.allowed.length > 0);
      const destinations = modelPaths.map((p) => p === END ? exitNode : p);
      allNodeWorkflows.addConditionalEdges(firstAfterModelNode, this.#createAfterModelRouter(clientTools, allowJump, exitNode, hasToolsAvailable), destinations);
    }
    for (let i = afterAgentNodes.length - 1; i > 0; i--) {
      const node = afterAgentNodes[i];
      const current = node.name;
      const nextDefault = afterAgentNodes[i - 1].name;
      if (node.allowed && node.allowed.length > 0) {
        const allowedMapped = node.allowed.map((t) => parseJumpToTarget(t)).filter((dest) => dest !== "tools" || hasToolsAvailable);
        const destinations = Array.from(/* @__PURE__ */ new Set([nextDefault, ...allowedMapped]));
        allNodeWorkflows.addConditionalEdges(current, this.#createAfterModelSequenceRouter(clientTools, node.allowed, nextDefault, hasToolsAvailable), destinations);
      } else allNodeWorkflows.addEdge(current, nextDefault);
    }
    if (afterAgentNodes.length > 0) {
      const firstAfterAgent = afterAgentNodes[0];
      const firstAfterAgentNode = firstAfterAgent.name;
      if (firstAfterAgent.allowed && firstAfterAgent.allowed.length > 0) {
        const allowedMapped = firstAfterAgent.allowed.map((t) => parseJumpToTarget(t)).filter((dest) => dest !== "tools" || hasToolsAvailable);
        const destinations = Array.from(/* @__PURE__ */ new Set([END, ...allowedMapped]));
        allNodeWorkflows.addConditionalEdges(firstAfterAgentNode, this.#createAfterModelSequenceRouter(clientTools, firstAfterAgent.allowed, END, hasToolsAvailable), destinations);
      } else allNodeWorkflows.addEdge(firstAfterAgentNode, END);
    }
    if (hasToolsAvailable) {
      const toolReturnTarget = loopEntryNode;
      if (shouldReturnDirect.size > 0) allNodeWorkflows.addConditionalEdges(TOOLS_NODE_NAME, this.#createToolsRouter(shouldReturnDirect, exitNode, toolReturnTarget), [toolReturnTarget, exitNode]);
      else allNodeWorkflows.addEdge(TOOLS_NODE_NAME, toolReturnTarget);
    }
    const middlewareStreamTransformers = (this.options.middleware ?? []).flatMap((m) => m.streamTransformers ?? []);
    const compileTransformers = [
      createToolCallTransformer([]),
      createSubagentTransformer([]),
      ...middlewareStreamTransformers,
      ...this.options.streamTransformers ?? []
    ];
    this.#graph = allNodeWorkflows.compile({
      checkpointer: this.options.checkpointer,
      store: this.options.store,
      name: this.options.name,
      description: this.options.description,
      transformers: compileTransformers
    });
    const graphDefaultConfig = toGraphDefaultConfig(this.#defaultConfig);
    if (Object.keys(graphDefaultConfig).length > 0) this.#graph = this.#graph.withConfig(graphDefaultConfig);
  }
  /**
  * Get the compiled {@link https://docs.langchain.com/oss/javascript/langgraph/use-graph-api | StateGraph}.
  */
  get graph() {
    return this.#graph;
  }
  get checkpointer() {
    return this.#graph.checkpointer;
  }
  set checkpointer(value) {
    this.#graph.checkpointer = value;
  }
  get store() {
    return this.#graph.store;
  }
  set store(value) {
    this.#graph.store = value;
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
  withConfig(config) {
    return new ReactAgent2(this.options, mergeConfigs(this.#defaultConfig, config));
  }
  /**
  * Get possible edge destinations from model node.
  * @param toolClasses names of tools to call
  * @param includeModelRequest whether to include "model_request" as a valid path (for jumpTo routing)
  * @param hasToolsAvailable whether tools are available (includes dynamic tools via middleware)
  * @returns list of possible edge destinations
  */
  #getModelPaths(toolClasses, includeModelRequest = false, hasToolsAvailable = toolClasses.length > 0) {
    const paths = [];
    if (hasToolsAvailable) paths.push(TOOLS_NODE_NAME);
    if (includeModelRequest) paths.push(AGENT_NODE_NAME);
    paths.push(END);
    return paths;
  }
  /**
  * Create routing function for tools node conditional edges.
  */
  #createToolsRouter(shouldReturnDirect, exitNode, toolReturnTarget) {
    return (state) => {
      const messages = state.messages;
      const lastMessage = messages[messages.length - 1];
      if (ToolMessage.isInstance(lastMessage) && lastMessage.name && shouldReturnDirect.has(lastMessage.name)) return this.options.responseFormat ? toolReturnTarget : exitNode;
      return toolReturnTarget;
    };
  }
  /**
  * Create routing function for model node conditional edges.
  * @param exitNode - The exit node to route to (could be after_agent or END)
  */
  #createModelRouter(exitNode = END) {
    return (state) => {
      const lastMessage = state.messages.at(-1);
      if (!AIMessage.isInstance(lastMessage) || !lastMessage.tool_calls || lastMessage.tool_calls.length === 0) return exitNode;
      if (lastMessage.tool_calls.every((toolCall) => toolCall.name.startsWith("extract-"))) return exitNode;
      if (this.#toolBehaviorVersion === "v1") return TOOLS_NODE_NAME;
      const regularToolCalls = lastMessage.tool_calls.filter((toolCall) => !toolCall.name.startsWith("extract-"));
      if (regularToolCalls.length === 0) return exitNode;
      return regularToolCalls.map((toolCall) => new Send(TOOLS_NODE_NAME, {
        ...state,
        lg_tool_call: toolCall
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
  #createAfterModelRouter(toolClasses, allowJump, exitNode, hasToolsAvailable = toolClasses.length > 0) {
    const hasStructuredResponse = Boolean(this.options.responseFormat);
    return (state) => {
      const builtInState = state;
      const messages = builtInState.messages;
      const lastMessage = messages.at(-1);
      if (AIMessage.isInstance(lastMessage) && (!lastMessage.tool_calls || lastMessage.tool_calls.length === 0)) return exitNode;
      if (allowJump && builtInState.jumpTo) {
        const destination = parseJumpToTarget(builtInState.jumpTo);
        if (destination === END) return exitNode;
        if (destination === "tools") {
          if (!hasToolsAvailable) return exitNode;
          return new Send(TOOLS_NODE_NAME, {
            ...state,
            jumpTo: void 0
          });
        }
        return new Send(AGENT_NODE_NAME, {
          ...state,
          jumpTo: void 0
        });
      }
      const toolMessages = messages.filter(ToolMessage.isInstance);
      const lastAiMessage = messages.filter(AIMessage.isInstance).at(-1);
      const pendingToolCalls = lastAiMessage?.tool_calls?.filter((call2) => !toolMessages.some((m) => m.tool_call_id === call2.id));
      if (pendingToolCalls && pendingToolCalls.length > 0) {
        if (this.#toolBehaviorVersion === "v1") return TOOLS_NODE_NAME;
        return pendingToolCalls.map((toolCall) => new Send(TOOLS_NODE_NAME, {
          ...state,
          lg_tool_call: toolCall
        }));
      }
      const hasStructuredResponseCalls = lastAiMessage?.tool_calls?.some((toolCall) => toolCall.name.startsWith("extract-"));
      if (pendingToolCalls && pendingToolCalls.length === 0 && !hasStructuredResponseCalls && hasStructuredResponse) return AGENT_NODE_NAME;
      if (!AIMessage.isInstance(lastMessage) || !lastMessage.tool_calls || lastMessage.tool_calls.length === 0) return exitNode;
      const hasOnlyStructuredResponseCalls = lastMessage.tool_calls.every((toolCall) => toolCall.name.startsWith("extract-"));
      const hasRegularToolCalls = lastMessage.tool_calls.some((toolCall) => !toolCall.name.startsWith("extract-"));
      if (hasOnlyStructuredResponseCalls || !hasRegularToolCalls) return exitNode;
      if (this.#toolBehaviorVersion === "v1") return TOOLS_NODE_NAME;
      const regularToolCalls = lastMessage.tool_calls.filter((toolCall) => !toolCall.name.startsWith("extract-"));
      if (regularToolCalls.length === 0) return exitNode;
      return regularToolCalls.map((toolCall) => new Send(TOOLS_NODE_NAME, {
        ...state,
        lg_tool_call: toolCall
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
  #createAfterModelSequenceRouter(toolClasses, allowed, nextDefault, hasToolsAvailable = toolClasses.length > 0) {
    const allowedSet = new Set(allowed.map((t) => parseJumpToTarget(t)));
    return (state) => {
      const builtInState = state;
      if (builtInState.jumpTo) {
        const dest = parseJumpToTarget(builtInState.jumpTo);
        if (dest === END && allowedSet.has(END)) return END;
        if (dest === "tools" && allowedSet.has("tools")) {
          if (!hasToolsAvailable) return END;
          return new Send(TOOLS_NODE_NAME, {
            ...state,
            jumpTo: void 0
          });
        }
        if (dest === "model_request" && allowedSet.has("model_request")) return new Send(AGENT_NODE_NAME, {
          ...state,
          jumpTo: void 0
        });
      }
      return nextDefault;
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
  #createBeforeAgentRouter(toolClasses, nextDefault, exitNode, hasToolsAvailable = toolClasses.length > 0) {
    return (state) => {
      const builtInState = state;
      if (!builtInState.jumpTo) return nextDefault;
      const destination = parseJumpToTarget(builtInState.jumpTo);
      if (destination === END)
        return exitNode;
      if (destination === "tools") {
        if (!hasToolsAvailable) return exitNode;
        return new Send(TOOLS_NODE_NAME, {
          ...state,
          jumpTo: void 0
        });
      }
      return new Send(AGENT_NODE_NAME, {
        ...state,
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
  #createBeforeModelRouter(toolClasses, nextDefault, hasToolsAvailable = toolClasses.length > 0) {
    return (state) => {
      const builtInState = state;
      if (!builtInState.jumpTo) return nextDefault;
      const destination = parseJumpToTarget(builtInState.jumpTo);
      if (destination === END) return END;
      if (destination === "tools") {
        if (!hasToolsAvailable) return END;
        return new Send(TOOLS_NODE_NAME, {
          ...state,
          jumpTo: void 0
        });
      }
      return new Send(AGENT_NODE_NAME, {
        ...state,
        jumpTo: void 0
      });
    };
  }
  /**
  * Initialize middleware states if not already present in the input state.
  */
  async #initializeMiddlewareStates(state, config) {
    if (!this.options.middleware || this.options.middleware.length === 0 || state instanceof Command || !state) return state;
    const defaultStates = await initializeMiddlewareStates(this.options.middleware, state);
    const updatedState = {
      ...(await this.#graph.getState(config).catch(() => ({ values: {} }))).values,
      ...state
    };
    if (!updatedState) return updatedState;
    for (const [key, value] of Object.entries(defaultStates)) if (!(key in updatedState)) updatedState[key] = value;
    return updatedState;
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
  async invoke(state, config) {
    const mergedConfig = mergeConfigs(this.#defaultConfig, config);
    const initializedState = await this.#initializeMiddlewareStates(state, mergedConfig);
    return this.#graph.invoke(initializedState, mergedConfig);
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
  async stream(state, config) {
    const mergedConfig = mergeConfigs(this.#defaultConfig, config);
    const initializedState = await this.#initializeMiddlewareStates(state, mergedConfig);
    return this.#graph.stream(initializedState, mergedConfig);
  }
  streamEvents(state, config, streamOptions) {
    if (config?.version !== "v3" || streamOptions != null) {
      const mergedConfig = mergeConfigs(this.#defaultConfig, config);
      const version = config?.version === "v1" || config?.version === "v2" ? config.version : "v2";
      return this.#graph.streamEvents(state, {
        ...mergedConfig,
        version
      }, streamOptions);
    }
    return (async () => {
      const { transformers: callSiteTransformers, version: _version, ...restConfig } = config ?? {};
      const mergedConfig = mergeConfigs(this.#defaultConfig, restConfig);
      const initializedState = await this.#initializeMiddlewareStates(state, mergedConfig);
      return await this.#graph.streamEvents(initializedState, {
        ...mergedConfig,
        version: "v3",
        transformers: callSiteTransformers
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
  async drawMermaidPng(params) {
    const arrayBuffer = await (await (await this.#graph.getGraphAsync()).drawMermaidPng(params)).arrayBuffer();
    return new Uint8Array(arrayBuffer);
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
  async drawMermaid(params) {
    return (await this.#graph.getGraphAsync()).drawMermaid(params);
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
  getGraphAsync(config) {
    return this.#graph.getGraphAsync(config);
  }
  /**
  * @internal
  */
  getState(config, options) {
    return this.#graph.getState(config, options);
  }
  /**
  * @internal
  */
  getStateHistory(config, options) {
    return this.#graph.getStateHistory(config, options);
  }
  /**
  * @internal
  */
  getSubgraphs(namespace, recurse) {
    return this.#graph.getSubgraphs(namespace, recurse);
  }
  /**
  * @internal
  */
  getSubgraphsAsync(namespace, recurse) {
    return this.#graph.getSubgraphsAsync(namespace, recurse);
  }
  /**
  * @internal
  */
  updateState(inputConfig, values, asNode) {
    return this.#graph.updateState(inputConfig, values, asNode);
  }
  /**
  * @internal
  */
  get builder() {
    return this.#graph.builder;
  }
};
function createAgent(params) {
  return new ReactAgent(params);
}
const WhenFunctionSchema = functionType().args(custom$1()).returns(unionType([booleanType(), promiseType(booleanType())]));
const DescriptionFunctionSchema = functionType().args(custom$1(), custom$1(), custom$1()).returns(unionType([stringType(), promiseType(stringType())]));
const ALLOWED_DECISIONS = [
  "approve",
  "edit",
  "reject"
];
const DecisionType = enumType(ALLOWED_DECISIONS);
const InterruptOnConfigSchema = objectType({
  /**
  * The decisions that are allowed for this action.
  */
  allowedDecisions: arrayType(DecisionType),
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
  description: unionType([stringType(), DescriptionFunctionSchema]).optional(),
  /**
  * JSON schema for the arguments associated with the action, if edits are allowed.
  */
  argsSchema: recordType(anyType()).optional(),
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
  when: WhenFunctionSchema.optional()
});
objectType({
  /**
  * Mapping of tool name to allowed reviewer responses.
  * If a tool doesn't have an entry, it's auto-approved by default.
  *
  * - `true` -> pause for approval and allow approve/edit/reject decisions
  * - `false` -> auto-approve (no human review)
  * - `InterruptOnConfig` -> explicitly specify which decisions are allowed for this tool
  */
  interruptOn: recordType(unionType([booleanType(), InterruptOnConfigSchema])).optional(),
  /**
  * Prefix used when constructing human-facing approval messages.
  * Provides context about the tool call being reviewed; does not change the underlying action.
  *
  * Note: This prefix is only applied for tools that do not provide a custom
  * `description` via their {@link InterruptOnConfig}. If a tool specifies a custom
  * `description`, that per-tool text is used and this prefix is ignored.
  */
  descriptionPrefix: stringType().default("Tool execution requires approval")
});
const DEFAULT_SUMMARY_PROMPT = `<role>
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
</messages>`;
const tokenCounterSchema = functionType().args(arrayType(custom$1())).returns(unionType([numberType(), promiseType(numberType())]));
const contextSizeSchema = objectType({
  /**
  * Fraction of the model's context size to use as the trigger
  */
  fraction: numberType().gt(0, "Fraction must be greater than 0").max(1, "Fraction must be less than or equal to 1").optional(),
  /**
  * Number of tokens to use as the trigger
  */
  tokens: numberType().positive("Tokens must be greater than 0").optional(),
  /**
  * Number of messages to use as the trigger
  */
  messages: numberType().int("Messages must be an integer").positive("Messages must be greater than 0").optional()
}).refine((data) => {
  return [
    data.fraction,
    data.tokens,
    data.messages
  ].filter((v) => v !== void 0).length >= 1;
}, { message: "At least one of fraction, tokens, or messages must be provided" });
const keepSchema = objectType({
  /**
  * Fraction of the model's context size to keep
  */
  fraction: numberType().min(0, "Messages must be non-negative").max(1, "Fraction must be less than or equal to 1").optional(),
  /**
  * Number of tokens to keep
  */
  tokens: numberType().min(0, "Tokens must be greater than or equal to 0").optional(),
  messages: numberType().int("Messages must be an integer").min(0, "Messages must be non-negative").optional()
}).refine((data) => {
  return [
    data.fraction,
    data.tokens,
    data.messages
  ].filter((v) => v !== void 0).length === 1;
}, { message: "Exactly one of fraction, tokens, or messages must be provided" });
objectType({
  /**
  * Model to use for summarization
  */
  model: custom$1(),
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
  trigger: unionType([contextSizeSchema, arrayType(contextSizeSchema)]).optional(),
  /**
  * Keep conditions for summarization
  */
  keep: keepSchema.optional(),
  /**
  * Token counter function to use for summarization
  */
  tokenCounter: tokenCounterSchema.optional(),
  /**
  * Summary prompt to use for summarization
  * @default {@link DEFAULT_SUMMARY_PROMPT}
  */
  summaryPrompt: stringType().default(DEFAULT_SUMMARY_PROMPT),
  /**
  * Number of tokens to trim to before summarizing
  */
  trimTokensToSummarize: numberType().optional(),
  /**
  * Prefix to add to the summary
  */
  summaryPrefix: stringType().optional(),
  /**
  * @deprecated Use `trigger: { tokens: value }` instead.
  */
  maxTokensBeforeSummary: numberType().optional(),
  /**
  * @deprecated Use `keep: { messages: value }` instead.
  */
  messagesToKeep: numberType().optional()
});
objectType({
  /**
  * The language model to use for tool selection (default: the provided model from the agent options).
  */
  model: stringType().or(instanceOfType(BaseLanguageModel)).optional(),
  /**
  * System prompt for the tool selection model.
  */
  systemPrompt: stringType().optional(),
  /**
  * Maximum number of tools to select. If the model selects more,
  * only the first maxTools will be used. No limit if not specified.
  */
  maxTools: numberType().optional(),
  /**
  * Tool names to always include regardless of selection.
  * These do not count against the maxTools limit.
  */
  alwaysInclude: arrayType(stringType()).optional()
});
objectType({
  /**
  * Whether to check user messages before model call
  */
  applyToInput: booleanType().optional(),
  /**
  * Whether to check AI messages after model call
  */
  applyToOutput: booleanType().optional(),
  /**
  * Whether to check tool result messages after tool execution
  */
  applyToToolResults: booleanType().optional()
});
objectType({
  /**
  * A record of PII detection rules to apply
  * @default DEFAULT_PII_RULES (with enabled rules only)
  */
  rules: recordType(stringType(), instanceOfType(RegExp).describe("Regular expression pattern to match PII")).optional()
});
const VALID_EXIT_BEHAVIORS = [
  "continue",
  "error",
  "end"
];
const DEFAULT_EXIT_BEHAVIOR = "continue";
const exitBehaviorSchema = enumType(VALID_EXIT_BEHAVIORS).default(DEFAULT_EXIT_BEHAVIOR);
objectType({
  /**
  * Name of the specific tool to limit. If undefined, limits apply to all tools.
  */
  toolName: stringType().optional(),
  /**
  * Maximum number of tool calls allowed per thread.
  * undefined means no limit.
  */
  threadLimit: numberType().optional(),
  /**
  * Maximum number of tool calls allowed per run.
  * undefined means no limit.
  */
  runLimit: numberType().optional(),
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
  exitBehavior: exitBehaviorSchema
});
objectType({
  threadToolCallCount: recordType(stringType(), numberType()).default({}),
  runToolCallCount: recordType(stringType(), numberType()).default({})
});
const TodoStatus = enumType([
  "pending",
  "in_progress",
  "completed"
]).describe("Status of the todo");
const TodoSchema = objectType({
  content: stringType().describe("Content of the todo item"),
  status: TodoStatus
});
objectType({ todos: arrayType(TodoSchema).default([]) });
objectType({
  /**
  * The maximum number of model calls allowed per thread.
  */
  threadLimit: numberType().optional(),
  /**
  * The maximum number of model calls allowed per run.
  */
  runLimit: numberType().optional(),
  /**
  * The behavior to take when the limit is exceeded.
  * - "error" will throw an error and stop the agent.
  * - "end" will end the agent.
  * @default "end"
  */
  exitBehavior: enumType(["error", "end"]).optional()
});
objectType({
  threadModelCallCount: numberType().default(0),
  runModelCallCount: numberType().default(0)
});
const RetrySchema = objectType({
  /**
  * Maximum number of retry attempts after the initial call.
  * Default is 2 retries (3 total attempts). Must be >= 0.
  */
  maxRetries: numberType().min(0).default(2),
  /**
  * Either an array of error constructors to retry on, or a function
  * that takes an error and returns `true` if it should be retried.
  * Default is to retry on all errors.
  */
  retryOn: unionType([functionType().args(instanceOfType(Error)).returns(booleanType()), arrayType(custom$1())]).default(() => () => true),
  /**
  * Multiplier for exponential backoff. Each retry waits
  * `initialDelayMs * (backoffFactor ** retryNumber)` milliseconds.
  * Set to 0.0 for constant delay. Default is 2.0.
  */
  backoffFactor: numberType().min(0).default(2),
  /**
  * Initial delay in milliseconds before first retry. Default is 1000 (1 second).
  */
  initialDelayMs: numberType().min(0).default(1e3),
  /**
  * Maximum delay in milliseconds between retries. Caps exponential
  * backoff growth. Default is 60000 (60 seconds).
  */
  maxDelayMs: numberType().min(0).default(6e4),
  /**
  * Whether to add random jitter (±25%) to delay to avoid thundering herd.
  * Default is `true`.
  */
  jitter: booleanType().default(true)
});
objectType({
  /**
  * Behavior when all retries are exhausted. Options:
  * - `"continue"` (default): Return an AIMessage with error details, allowing
  *   the agent to potentially handle the failure gracefully.
  * - `"error"`: Re-raise the exception, stopping agent execution.
  * - Custom function: Function that takes the exception and returns a string
  *   for the AIMessage content, allowing custom error formatting.
  */
  onFailure: unionType([
    literalType("error"),
    literalType("continue"),
    functionType().args(instanceOfType(Error)).returns(stringType())
  ]).default("continue")
}).merge(RetrySchema);
objectType({
  /**
  * Optional list of tools or tool names to apply retry logic to.
  * Can be a list of `BaseTool` instances or tool name strings.
  * If `undefined`, applies to all tools. Default is `undefined`.
  */
  tools: arrayType(unionType([
    custom$1(),
    custom$1(),
    stringType()
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
  onFailure: unionType([
    literalType("error"),
    literalType("continue"),
    literalType("raise"),
    literalType("return_message"),
    functionType().args(instanceOfType(Error)).returns(stringType())
  ]).default("continue")
}).merge(RetrySchema);
const DEFAULT_ENABLE_CACHING = true;
const DEFAULT_TTL = "5m";
const DEFAULT_MIN_MESSAGES_TO_CACHE = 3;
const DEFAULT_UNSUPPORTED_MODEL_BEHAVIOR = "warn";
const contextSchema = objectType({
  /**
  * Whether to enable prompt caching.
  * @default true
  */
  enableCaching: booleanType().optional(),
  /**
  * The time-to-live for the cached prompt.
  * @default "5m"
  */
  ttl: enumType(["5m", "1h"]).optional(),
  /**
  * The minimum number of messages required before caching is applied.
  * @default 3
  */
  minMessagesToCache: numberType().optional(),
  /**
  * The behavior to take when an unsupported model is used.
  * - "ignore" will ignore the unsupported model and continue without caching.
  * - "warn" will warn the user and continue without caching.
  * - "raise" will raise an error and stop the agent.
  * @default "warn"
  */
  unsupportedModelBehavior: enumType([
    "ignore",
    "warn",
    "raise"
  ]).optional()
});
var PromptCachingMiddlewareError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "PromptCachingMiddlewareError";
  }
};
function anthropicPromptCachingMiddleware(middlewareOptions) {
  return createMiddleware({
    name: "PromptCachingMiddleware",
    contextSchema,
    wrapModelCall: (request, handler) => {
      const enableCaching = request.runtime.context.enableCaching ?? middlewareOptions?.enableCaching ?? DEFAULT_ENABLE_CACHING;
      const ttl = request.runtime.context.ttl ?? middlewareOptions?.ttl ?? DEFAULT_TTL;
      const minMessagesToCache = request.runtime.context.minMessagesToCache ?? middlewareOptions?.minMessagesToCache ?? DEFAULT_MIN_MESSAGES_TO_CACHE;
      const unsupportedModelBehavior = request.runtime.context.unsupportedModelBehavior ?? middlewareOptions?.unsupportedModelBehavior ?? DEFAULT_UNSUPPORTED_MODEL_BEHAVIOR;
      if (!enableCaching || !request.model) return handler(request);
      if (!(request.model.getName() === "ChatAnthropic" || request.model.getName() === "ConfigurableModel" && request.model._defaultConfig?.modelProvider === "anthropic")) {
        const modelName = request.model.getName();
        const baseMessage = `Unsupported model '${request.model.getName() === "ConfigurableModel" ? `${modelName} (${request.model._defaultConfig?.modelProvider})` : modelName}'. Prompt caching requires an Anthropic model`;
        if (unsupportedModelBehavior === "raise") throw new PromptCachingMiddlewareError(`${baseMessage} (e.g., 'anthropic:claude-4-0-sonnet').`);
        else if (unsupportedModelBehavior === "warn") console.warn(`PromptCachingMiddleware: Skipping caching for ${modelName}. Consider switching to an Anthropic model for caching benefits.`);
        return handler(request);
      }
      if (request.state.messages.length + (request.systemPrompt ? 1 : 0) < minMessagesToCache) return handler(request);
      return handler({
        ...request,
        modelSettings: {
          ...request.modelSettings,
          cache_control: {
            type: "ephemeral",
            ttl
          }
        }
      });
    }
  });
}
objectType({
  /**
  * Whether to enable prompt caching.
  * @default true
  */
  enableCaching: booleanType().optional(),
  /**
  * The time-to-live for the cached prompt.
  * @default "5m"
  */
  ttl: enumType(["5m", "1h"]).optional(),
  /**
  * The minimum number of messages required before caching is applied.
  * @default 1
  */
  minMessagesToCache: numberType().optional(),
  /**
  * The behavior to take when an unsupported model is used.
  * - "ignore" will ignore the unsupported model and continue without caching.
  * - "warn" will warn the user and continue without caching.
  * - "raise" will raise an error and stop the agent.
  * @default "warn"
  */
  unsupportedModelBehavior: enumType([
    "ignore",
    "warn",
    "raise"
  ]).optional()
});
const ZOOM_DEPTH_SCALES = {
  1: 1.25,
  2: 1.5,
  3: 1.8,
  4: 2.2,
  5: 3.5,
  6: 5
};
const MIN_ZOOM_SCALE = 1;
const MAX_ZOOM_SCALE = 5;
function effectiveZoomScale(region) {
  if (region.customScale != null) {
    const clamped = Math.max(MIN_ZOOM_SCALE, Math.min(MAX_ZOOM_SCALE, region.customScale));
    if (Number.isFinite(clamped)) return clamped;
  }
  return ZOOM_DEPTH_SCALES[region.depth];
}
const ZOOM_DEPTH_LEGEND = Object.keys(ZOOM_DEPTH_SCALES).map((key) => Number(key)).sort((a, b) => a - b).map((depth) => `${depth}=${ZOOM_DEPTH_SCALES[depth].toFixed(2)}×`).join(", ");
function hasAnyClipWithCamera(assets, clips) {
  return clips.some((clip) => assets.find((a) => a.id === clip.assetId)?.cameraTrack != null);
}
const DEFAULT_TRACK_HZ = 5;
const DEFAULT_MAX_TRACK_POINTS = 400;
const DEFAULT_TRACK_EPSILON = 0.02;
const DEFAULT_TRACK_MAX_GAP_SEC = 3;
function simplifyAxis(pts, value, from, to, eps, kept) {
  const stack = [[from, to]];
  while (stack.length) {
    const [lo, hi] = stack.pop();
    if (hi - lo < 2) continue;
    const t0 = pts[lo].timeMs;
    const span = pts[hi].timeMs - t0;
    const v0 = value(lo);
    const dv = value(hi) - v0;
    let worst = 0;
    let worstAt = -1;
    for (let i = lo + 1; i < hi; i += 1) {
      const k = span === 0 ? 0 : (pts[i].timeMs - t0) / span;
      const d = Math.abs(value(i) - (v0 + k * dv));
      if (d > worst) {
        worst = d;
        worstAt = i;
      }
    }
    if (worst > eps && worstAt >= 0) {
      kept.add(worstAt);
      stack.push([lo, worstAt], [worstAt, hi]);
    }
  }
}
function round2(value) {
  return Math.round(value * 100) / 100;
}
function round3$1(value) {
  return Math.round(value * 1e3) / 1e3;
}
function buildCursorTrack(options) {
  const { assetId, samples, durationSec, clips } = options;
  const trimRanges = options.trimRanges ?? [];
  const maxPoints = options.maxPoints ?? DEFAULT_MAX_TRACK_POINTS;
  const ceilingMs = Math.max(0, durationSec) * 1e3 || Number.POSITIVE_INFINITY;
  const ordered = samples.filter((s) => Number.isFinite(s.timeMs) && Number.isFinite(s.cx) && Number.isFinite(s.cy)).map((s) => ({ ...s, timeMs: Math.max(0, Math.min(s.timeMs, ceilingMs)) })).sort((a, b) => a.timeMs - b.timeMs);
  const shapeIndex = /* @__PURE__ */ new Map();
  for (const s of ordered) {
    if (typeof s.assetId === "string" && s.assetId && !shapeIndex.has(s.assetId)) {
      shapeIndex.set(s.assetId, shapeIndex.size);
    }
  }
  const coveredSec = ordered.length ? round2(ordered[ordered.length - 1].timeMs / 1e3) : 0;
  const wantedHz = options.hz ?? DEFAULT_TRACK_HZ;
  const spanSec = coveredSec || 1;
  let maxGapMs = (options.maxGapSec ?? DEFAULT_TRACK_MAX_GAP_SEC) * 1e3;
  let floorPoints = Math.ceil(spanSec / (maxGapMs / 1e3));
  let widened = false;
  if (floorPoints > maxPoints) {
    maxGapMs = spanSec / maxPoints * 1e3;
    floorPoints = maxPoints;
    widened = true;
  }
  const hz = Math.min(wantedHz, Math.max(0, maxPoints - floorPoints) / spanSec);
  const truncated = widened || hz < wantedHz;
  const minIntervalMs = hz > 0 ? 1e3 / hz : Number.POSITIVE_INFINITY;
  const eps = options.epsilon ?? DEFAULT_TRACK_EPSILON;
  const mandatory = /* @__PURE__ */ new Set();
  if (ordered.length) {
    mandatory.add(0);
    mandatory.add(ordered.length - 1);
  }
  let lastShape = ordered[0]?.assetId;
  let lastMandatoryMs = ordered[0]?.timeMs ?? 0;
  for (let i = 0; i < ordered.length; i += 1) {
    const s = ordered[i];
    const shapeChanged = s.assetId !== lastShape && shapeIndex.size > 1;
    const notAMove = typeof s.interactionType === "string" && s.interactionType !== "move";
    const stale = s.timeMs - lastMandatoryMs >= maxGapMs;
    if (shapeChanged || notAMove || stale) {
      mandatory.add(i);
      lastMandatoryMs = s.timeMs;
      lastShape = s.assetId;
    }
  }
  const kept = new Set(mandatory);
  const anchors = [...mandatory].sort((a, b) => a - b);
  for (let a = 0; a < anchors.length - 1; a += 1) {
    simplifyAxis(ordered, (i) => ordered[i].cx, anchors[a], anchors[a + 1], eps, kept);
    simplifyAxis(ordered, (i) => ordered[i].cy, anchors[a], anchors[a + 1], eps, kept);
  }
  const keep = [];
  let lastEmittedMs = Number.NEGATIVE_INFINITY;
  for (const i of [...kept].sort((a, b) => a - b)) {
    const s = ordered[i];
    if (mandatory.has(i) || s.timeMs - lastEmittedMs >= minIntervalMs) {
      keep.push(s);
      lastEmittedMs = s.timeMs;
    }
  }
  const shifted = keep.some((s) => {
    const atSec = s.timeMs / 1e3;
    const position = locateSourcePosition(clips, atSec, assetId);
    return !position || Math.abs(position.virtualTimeSec - atSec) > 5e-3;
  });
  const points = keep.map((s) => {
    const atSec = s.timeMs / 1e3;
    const position = locateSourcePosition(clips, atSec, assetId);
    const point = {
      atSec: round2(atSec),
      cx: round3$1(s.cx),
      cy: round3$1(s.cy)
    };
    if (shifted) point.virtualSec = position ? round2(position.virtualTimeSec) : null;
    const shape = typeof s.assetId === "string" ? shapeIndex.get(s.assetId) : void 0;
    if (shape !== void 0 && shapeIndex.size > 1) point.shape = shape;
    if (typeof s.interactionType === "string" && s.interactionType !== "move") {
      point.kind = s.interactionType;
    }
    if (trimRanges.some((t) => t.assetId === assetId && atSec >= t.startSec && atSec <= t.endSec)) {
      point.trimmed = true;
    }
    return point;
  });
  const overBudget = points.length > maxPoints ? `${points.length} points for a ceiling of ${maxPoints}: the mandatory points are never dropped — the first and last sample, pointer-shape changes, non-move events and the ends of a parked run — and this recording has enough of them to land above the budget.` : void 0;
  return {
    assetId,
    sampleCount: samples.length,
    pointCount: points.length,
    hz: round2(hz),
    coveredSec,
    shapeCount: shapeIndex.size,
    truncated,
    ...overBudget ? { overBudget } : {},
    virtualEqualsSource: !shifted,
    timeBase: "atSec is SOURCE time of the asset (the recording's own clock). virtualSec is the same instant on the edited timeline — that is the coordinate addZoom takes; when virtualEqualsSource is true the two are identical everywhere and virtualSec is left off the points. A null virtualSec means no clip carries that moment; trimmed:true means a trim cuts it out of playback, so a zoom there would never be seen. `shape` is an index into the pointer bitmaps this recording used: equal values are the same pointer, a change is a change.",
    points
  };
}
function formatSec(sec) {
  if (!Number.isFinite(sec) || sec < 0) return "0:00.0";
  const m = Math.floor(sec / 60);
  const s = (sec % 60).toFixed(1);
  return `${m}:${s.padStart(4, "0")}`;
}
function toMs(sec) {
  return Math.max(0, Math.round(sec * 1e3));
}
function resolveSpanMs(existing, startSec, endSec) {
  if (startSec === void 0 && endSec === void 0) {
    return { startMs: existing.startMs, endMs: existing.endMs };
  }
  const s = startSec ?? existing.startMs / 1e3;
  const e = endSec ?? existing.endMs / 1e3;
  return { startMs: toMs(Math.min(s, e)), endMs: toMs(Math.max(s, e)) };
}
function coalesceForAgent(regions) {
  return coalesceRegionsForRuler(regions).map((pill) => ({
    ...pill.member,
    id: pill.ids[0],
    startMs: Math.round(pill.start * 1e3),
    endMs: Math.round(pill.end * 1e3)
  }));
}
function anchorForAgent(region, document, prefix) {
  return anchorRegionsWithDerivedMs([region], document.timeline.clips, () => createId(prefix));
}
function overlapsAClip(region, document) {
  const startSec = region.startMs / 1e3;
  const endSec = region.endMs / 1e3;
  return document.timeline.clips.some(
    (c) => Math.min(endSec, c.timelineEndSec) - Math.max(startSec, c.timelineStartSec) > 0
  );
}
function landingOf(regions, document) {
  const starts = regions.map((r) => r.startMs);
  const ends = regions.map((r) => r.endMs);
  return {
    ids: regions.map((r) => r.id),
    startSec: regions.length ? Math.min(...starts) / 1e3 : 0,
    endSec: regions.length ? Math.max(...ends) / 1e3 : 0,
    anchored: regions.length > 0 && regions.every((r) => typeof r.clipId === "string" && overlapsAClip(r, document)),
    fragments: regions.length
  };
}
function landingAfterPillEdit(before, after, pillIds, document) {
  const untouched = new Set(before.filter((r) => !pillIds.has(r.id)).map((r) => r.id));
  return landingOf(
    after.filter((r) => !untouched.has(r.id)),
    document
  );
}
function cameraUnderSpan(document, startSec, endSec) {
  const covered = document.timeline.clips.filter(
    (c) => Math.min(endSec, c.timelineEndSec) - Math.max(startSec, c.timelineStartSec) > 0
  );
  return {
    clips: covered.length,
    withCamera: covered.filter(
      (c) => document.assets.find((a) => a.id === c.assetId)?.cameraTrack != null
    ).length
  };
}
function noCameraUnderSpan(document, startSec, endSec) {
  const coverage = cameraUnderSpan(document, startSec, endSec);
  if (coverage.clips === 0 || coverage.withCamera > 0) return null;
  const anywhere = hasAnyClipWithCamera(document.assets, document.timeline.clips);
  return failure(
    `No webcam is linked to the footage under ${startSec.toFixed(1)}–${endSec.toFixed(1)} s, so a full-camera region there would render nothing and none was written. ` + (anywhere ? "Other clips in this project do carry a camera — check assets[].hasCameraTrack in getCurrentDocument and pick a span over one of those." : "No asset in this project carries a cameraTrack at all (assets[].hasCameraTrack is false everywhere): this recording has no webcam. Tell the user instead of placing a region.")
  );
}
function editedExtentSec(document) {
  const clips = document.timeline.clips;
  if (clips.length === 0) return { startSec: 0, endSec: 0 };
  return {
    startSec: Math.min(...clips.map((c) => c.timelineStartSec)),
    endSec: Math.max(...clips.map((c) => c.timelineEndSec))
  };
}
function coversNoClip(kind, requestedStartSec, requestedEndSec, document) {
  const extent = editedExtentSec(document);
  return failure(
    `The span ${requestedStartSec.toFixed(1)}–${requestedEndSec.toFixed(1)} s covers no clip, so no ${kind} was placed (it could never play). The edited timeline runs ${extent.startSec.toFixed(1)}–${extent.endSec.toFixed(1)} s. Pick a span inside it, or place a clip there first.`
  );
}
function landingReport(landing, requestedStartSec, requestedEndSec) {
  const clamped = Math.abs(landing.startSec - requestedStartSec) > 1e-3 || Math.abs(landing.endSec - requestedEndSec) > 1e-3;
  return {
    startSec: landing.startSec,
    endSec: landing.endSec,
    ids: landing.ids,
    ...clamped ? { clamped: true, requestedStartSec, requestedEndSec } : {},
    ...landing.fragments > 1 ? { fragments: landing.fragments } : {}
  };
}
function landingSuffix(landing, requestedStartSec, requestedEndSec) {
  const parts = [];
  if (Math.abs(landing.startSec - requestedStartSec) > 1e-3 || Math.abs(landing.endSec - requestedEndSec) > 1e-3) {
    parts.push(
      `clamped from ${formatSec(requestedStartSec)} – ${formatSec(requestedEndSec)} to fit the clips`
    );
  }
  if (landing.fragments > 1) parts.push(`split across ${landing.fragments} clips`);
  return parts.length ? ` (${parts.join(", ")})` : "";
}
function modifierIdsOf(document) {
  const legacy = document.legacyEditor ?? {};
  const speedRegions = legacy.speedRegions ?? [];
  const cameraFullscreenRegions = legacy.cameraFullscreenRegions ?? [];
  return [
    ...document.zoomRanges.map((r) => r.id),
    ...document.annotations.map((r) => r.id),
    ...speedRegions.map((r) => r.id),
    ...cameraFullscreenRegions.map((r) => r.id)
  ];
}
function droppedByEdit(before, after) {
  const survivingModifiers = new Set(modifierIdsOf(after));
  const survivingTrims = new Set(after.timeline.trimRanges.map((t) => t.id));
  return {
    droppedModifierIds: modifierIdsOf(before).filter((id) => !survivingModifiers.has(id)),
    droppedTrimIds: before.timeline.trimRanges.map((t) => t.id).filter((id) => !survivingTrims.has(id))
  };
}
const secondsSchema = number().finite().nonnegative();
const addTrimArgs = object({
  startSec: secondsSchema,
  endSec: secondsSchema,
  assetId: string().min(1).optional(),
  // A cut belongs to ONE clip. Without this, a project where two clips draw from the same
  // asset (a duplicated clip) cannot say which of them the model meant, and the cut lands
  // on both. Resolved from the source range when the model omits it and only one clip
  // matches; ambiguity is reported back rather than guessed.
  clipId: string().min(1).optional(),
  reason: string().default("")
});
const addTrimsArgs = object({
  ranges: array(union([addTrimArgs, unknown()])).min(1)
});
const setTrimArgs = object({
  trimRangeId: string().min(1),
  startSec: secondsSchema,
  endSec: secondsSchema
});
const setClipRangeArgs = object({
  clipId: string().min(1),
  sourceStartSec: secondsSchema,
  sourceEndSec: secondsSchema
});
const replaceTimelineArgs = object({
  intervals: array(object({ startSec: secondsSchema, endSec: secondsSchema })).min(1),
  reason: string().default("")
});
const moveClipArgs = object({
  clipId: string().min(1),
  beforeClipId: string().min(1).nullish()
});
const getTranscriptArgs = object({
  assetId: string().min(1).optional()
});
const getCursorTrackArgs = object({
  assetId: string().min(1).optional()
});
const depthSchema = number().int().min(1).max(6);
const focusSchema = object({ cx: number().min(0).max(1), cy: number().min(0).max(1) });
const addZoomArgs = object({
  startSec: secondsSchema,
  endSec: secondsSchema,
  depth: depthSchema.default(3),
  focus: focusSchema.default({ cx: 0.5, cy: 0.5 })
});
const addZoomsArgs = object({
  regions: array(union([addZoomArgs, unknown()])).min(1)
});
const setZoomArgs = object({
  zoomId: string().min(1),
  startSec: secondsSchema.optional(),
  endSec: secondsSchema.optional(),
  depth: depthSchema.optional(),
  focus: focusSchema.optional()
});
const addSpeedArgs = object({
  startSec: secondsSchema,
  endSec: secondsSchema,
  speed: number().positive().default(1.5)
});
const setSpeedArgs = object({
  speedId: string().min(1),
  startSec: secondsSchema.optional(),
  endSec: secondsSchema.optional(),
  speed: number().positive().optional()
});
const addAnnotationArgs = object({
  startSec: secondsSchema,
  endSec: secondsSchema,
  text: string().default(""),
  x: number().min(0).max(100).default(50),
  y: number().min(0).max(100).default(50)
});
const setAnnotationArgs = object({
  annotationId: string().min(1),
  startSec: secondsSchema.optional(),
  endSec: secondsSchema.optional(),
  text: string().optional()
});
const addCameraFullscreenArgs = object({
  startSec: secondsSchema,
  endSec: secondsSchema
});
const setCameraFullscreenArgs = object({
  cameraFullscreenId: string().min(1),
  startSec: secondsSchema.optional(),
  endSec: secondsSchema.optional()
});
const removeTrimArgs = object({
  trimRangeId: string().min(1)
});
const removeModifierArgs = object({
  id: string().min(1)
});
const removeClipArgs = object({
  clipId: string().min(1)
});
const MUTATING_TOOL_NAMES = /* @__PURE__ */ new Set([
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
function isMutatingTool(name) {
  return MUTATING_TOOL_NAMES.has(name);
}
function roundSec(ms) {
  return Math.round(ms) / 1e3;
}
function documentSnapshotForModel(document, cursorTelemetry) {
  const availability = cursorTelemetry?.availableByAssetId;
  const legacy = document.legacyEditor;
  const speedRegions = legacy?.speedRegions ?? [];
  const cameraFullscreenRegions = legacy?.cameraFullscreenRegions ?? [];
  const autoFocusAll = legacy?.autoFocusAll === true;
  return {
    timeBaseNote: "clips and trims are in source-time seconds; zooms, speedRegions, annotations and cameraFullscreenRegions are in virtual (edited-timeline) seconds.",
    zoomNote: `renderedScale is what the viewer sees (depth is an ordinal, not a factor: ${ZOOM_DEPTH_LEGEND}). When a zoom carries customScale it wins over depth and depthIsOverridden is true — a setZoom that only changes depth on such a zoom clears customScale so the depth takes effect.`,
    project: { id: document.project.id, title: document.project.title },
    primaryAssetId: document.project.primaryAssetId ?? document.assets[0]?.id ?? null,
    autoFocusAll,
    hasAnyCamera: hasAnyClipWithCamera(document.assets, document.timeline.clips),
    cursorNote: "assets[].hasCursorTelemetry says whether recorded pointer telemetry exists for that asset. true — call getCursorTrack to read the recorded pointer track. false — this asset was checked and has none (imported footage, or a recording made without the cursor recorder). null — it was NOT checked from here; say that, and do not report it as the project having no cursor data.",
    assets: document.assets.map((a) => ({
      id: a.id,
      label: a.label,
      durationSec: a.durationSec ?? null,
      hasCameraTrack: a.cameraTrack != null,
      cameraVisible: a.cameraTrack?.visible ?? false,
      // Three-valued on purpose (see `CursorTelemetryContext`): `null` is
      // "not checked", and it must never render as `false`. The whole defect
      // was a runtime that could not look being read as a project that has
      // nothing — same field, same three states, one honest projection.
      //
      // `?? null`, not `?? false`: an asset MISSING from the map is one whose
      // probe threw. Defaulting that to `false` would put our failure back in
      // the answer as their fact, one layer lower down.
      hasCursorTelemetry: availability?.[a.id] ?? null
    })),
    // ponytail: `index`, `reason` and `origin` are here because without them a
    // clip cannot be DESIGNATED. "Put the demo first" is unanswerable when the
    // only handles are `clip_1`/`clip_2` and two indistinguishable source
    // windows — the label the user sees lives in `reason`, and it was not being
    // sent. A reorder tool without this is a tool the model cannot aim.
    clips: document.timeline.clips.map((c, index2) => ({
      id: c.id,
      index: index2,
      assetId: c.assetId,
      reason: c.reason,
      origin: c.origin,
      sourceStartSec: c.sourceStartSec,
      sourceEndSec: c.sourceEndSec ?? null,
      timelineStartSec: c.timelineStartSec,
      timelineEndSec: c.timelineEndSec
    })),
    trimRanges: document.timeline.trimRanges.map((s) => ({
      id: s.id,
      assetId: s.assetId,
      // The clip the cut is on — the only thing separating two cuts over the same
      // media. `null` is a pre-v7 cut that still applies to every clip of its asset.
      clipId: s.clipId ?? null,
      startSec: s.startSec,
      endSec: s.endSec,
      reason: s.reason
    })),
    zoomRanges: coalesceForAgent(document.zoomRanges).map((z2) => ({
      id: z2.id,
      startSec: roundSec(z2.startMs),
      endSec: roundSec(z2.endMs),
      depth: z2.depth,
      renderedScale: effectiveZoomScale(z2),
      // Emitted only when set: an unconditional `customScale: null` on every
      // zoom of every snapshot is noise the reader learns to skip, which is
      // how the field would go unnoticed again.
      ...z2.customScale != null ? { customScale: z2.customScale, depthIsOverridden: true } : {},
      ...z2.rotationPreset ? { rotationPreset: z2.rotationPreset } : {},
      focus: z2.focus,
      focusMode: autoFocusAll ? "auto" : z2.focusMode ?? "manual",
      source: z2.source ?? "manual"
    })),
    speedRegions: coalesceForAgent(speedRegions).map((s) => ({
      id: s.id,
      startSec: roundSec(s.startMs),
      endSec: roundSec(s.endMs),
      speed: s.speed
    })),
    annotations: coalesceForAgent(document.annotations).map((a) => ({
      id: a.id,
      startSec: roundSec(a.startMs),
      endSec: roundSec(a.endMs),
      type: a.type,
      text: a.textContent ?? a.content ?? ""
    })),
    cameraFullscreenRegions: coalesceForAgent(cameraFullscreenRegions).map((c) => ({
      id: c.id,
      startSec: roundSec(c.startMs),
      endSec: roundSec(c.endMs)
    })),
    hasTranscript: document.transcripts.length > 0 || document.transcript !== null
  };
}
function failure(message) {
  return { ok: false, resultJson: JSON.stringify({ error: message }) };
}
function applyBatch(document, unitName, items, options, noun) {
  let current = document;
  const applied = [];
  const refused = [];
  items.forEach((item, index2) => {
    const execution = executeAgentTool(current, unitName, JSON.stringify(item), options);
    let payload = {};
    try {
      payload = JSON.parse(execution.resultJson);
    } catch {
      payload = { error: execution.resultJson };
    }
    if (execution.ok && execution.document) {
      current = execution.document;
      applied.push({ index: index2, ...payload });
    } else {
      refused.push({ index: index2, error: String(payload.error ?? "refused") });
    }
  });
  if (applied.length === 0) {
    return failure(
      `No ${noun} was added. ` + refused.map((r) => `[${r.index}] ${r.error}`).join(" | ") + " Nothing was modified."
    );
  }
  const refusedSuffix = refused.length ? `, ${refused.length} refused` : "";
  return {
    ok: true,
    document: current,
    // The counts come first on purpose: the model must be able to see that one
    // of ten was refused WITHOUT re-reading the document, and know which one.
    resultJson: JSON.stringify({
      requested: items.length,
      appliedCount: applied.length,
      refusedCount: refused.length,
      applied,
      ...refused.length ? { refused } : {}
    }),
    summary: `added ${applied.length} ${noun}${applied.length === 1 ? "" : "s"}${refusedSuffix}`
  };
}
function clipRoster(document) {
  const clips = document.timeline.clips;
  if (clips.length === 0) return "The timeline has no clips.";
  return `The timeline is: ${clips.map((c) => `${c.id}${c.reason ? ` (${c.reason})` : ""}`).join(", ")}.`;
}
function consentRequired(name, args) {
  return {
    ok: false,
    resultJson: JSON.stringify({
      error: "Project edits are turned off for this project: the user asked to be consulted before the timeline changes. Nothing was modified.",
      code: "consent_required",
      tool: name,
      requestedArgs: args,
      howToProceed: "Describe the exact edit you would make — the tool, the times, the ids — and ask the user to confirm it. Do NOT retry this call and do NOT reach for another write tool: every one of them is refused while the setting is off. Never say an edit was applied. If they want you to go ahead, they can re-enable 'Project edits' in Settings → AI."
    })
  };
}
function resolveCursorAssetId(document, assetId) {
  return assetId ?? document.project.primaryAssetId ?? document.assets[0]?.id ?? null;
}
function medianOf(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = sorted.length >> 1;
  return sorted.length % 2 === 1 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}
function round3(value) {
  return Math.round(value * 1e3) / 1e3;
}
function cursorAnchorReport(regions, document, focus, telemetry) {
  const load2 = telemetry?.load;
  if (load2?.status !== "ok") return void 0;
  const byId = new Map(document.timeline.clips.map((c) => [c.id, c]));
  const windows = regions.flatMap((region) => {
    const clip = region.clipId ? byId.get(region.clipId) : void 0;
    if (!clip || clip.assetId !== load2.assetId) return [];
    if (region.sourceStartSec === void 0 || region.sourceEndSec === void 0) return [];
    return [{ clip, startSec: region.sourceStartSec, endSec: region.sourceEndSec }];
  });
  if (windows.length === 0) return void 0;
  const xs = [];
  const ys = [];
  let cutOut = 0;
  for (const sample of load2.samples) {
    if (!Number.isFinite(sample.timeMs) || !Number.isFinite(sample.cx) || !Number.isFinite(sample.cy)) {
      continue;
    }
    const atSec = sample.timeMs / 1e3;
    const covering = windows.find((w) => atSec >= w.startSec && atSec <= w.endSec);
    if (!covering) continue;
    if (document.timeline.trimRanges.some(
      (t) => trimAppliesToClip(t, covering.clip) && atSec >= t.startSec && atSec <= t.endSec
    )) {
      cutOut += 1;
      continue;
    }
    xs.push(sample.cx);
    ys.push(sample.cy);
  }
  if (xs.length === 0) {
    return cutOut > 0 ? {
      available: false,
      reason: "trimmed-out",
      note: "The pointer WAS recorded over this span, but a trim cuts every one of those instants out of playback, so none of them describes what a viewer sees here."
    } : {
      available: false,
      reason: "no-samples",
      note: "This recording's pointer telemetry covers no instant of this span. That is a fact about this span, not about the recording."
    };
  }
  const cx = medianOf(xs);
  const cy = medianOf(ys);
  let spread = 0;
  for (let i = 0; i < xs.length; i += 1) {
    spread = Math.max(spread, Math.hypot(xs[i] - cx, ys[i] - cy));
  }
  return {
    available: true,
    // Echoed, including the default a call that omitted `focus` silently got:
    // "you asked for the centre" is the half of the comparison the caller
    // cannot reconstruct from its own arguments.
    focus: { cx: focus.cx, cy: focus.cy },
    cursor: { cx: round3(cx), cy: round3(cy) },
    offset: round3(Math.hypot(cx - focus.cx, cy - focus.cy)),
    spread: round3(spread),
    samples: xs.length
  };
}
function executeAgentTool(document, name, rawArgs, options) {
  let args = {};
  if (rawArgs.trim()) {
    try {
      args = JSON.parse(rawArgs);
    } catch {
      return failure(`Tool arguments are not valid JSON: ${rawArgs.slice(0, 120)}`);
    }
  }
  if (options?.editsAllowed === false && isMutatingTool(name)) {
    return consentRequired(name, args);
  }
  switch (name) {
    case "getCurrentDocument": {
      return {
        ok: true,
        resultJson: JSON.stringify(documentSnapshotForModel(document, options?.cursorTelemetry))
      };
    }
    case "getCursorTrack": {
      const parsed = getCursorTrackArgs.safeParse(args);
      if (!parsed.success) return failure(parsed.error.message);
      const assetId = resolveCursorAssetId(document, parsed.data.assetId);
      if (!assetId)
        return failure("Project has no assets — there is nothing to read telemetry for.");
      if (!document.assets.some((a) => a.id === assetId)) {
        return failure(`Unknown asset: ${assetId}`);
      }
      const load2 = options?.cursorTelemetry?.load;
      if (!load2 || load2.status === "unavailable") {
        return {
          ok: true,
          resultJson: JSON.stringify({
            available: false,
            reason: "unavailable",
            assetId,
            note: load2?.note ?? "Cursor telemetry cannot be read in this run — no reader is wired to this runtime. This says nothing about whether the recording has any: report the limit as yours, and do not tell the user the project has no cursor data."
          })
        };
      }
      if (load2.status === "no-sidecar") {
        return {
          ok: true,
          resultJson: JSON.stringify({
            available: false,
            reason: "no-sidecar",
            assetId: load2.assetId,
            note: "Checked: this asset has no cursor-telemetry sidecar. That normally means it was imported rather than recorded with Drift's cursor recorder. This is a fact about the asset, not a limit of yours."
          })
        };
      }
      const asset = document.assets.find((a) => a.id === load2.assetId);
      const track = buildCursorTrack({
        assetId: load2.assetId,
        samples: load2.samples,
        durationSec: load2.durationSec ?? asset?.durationSec ?? 0,
        clips: document.timeline.clips,
        trimRanges: document.timeline.trimRanges
      });
      return { ok: true, resultJson: JSON.stringify({ available: true, ...track }) };
    }
    case "getTranscript": {
      const parsed = getTranscriptArgs.safeParse(args);
      if (!parsed.success) return failure(parsed.error.message);
      const assetId = parsed.data.assetId ?? document.project.primaryAssetId ?? document.assets[0]?.id;
      const transcript = document.transcripts.find((t) => t.assetId === assetId) ?? (document.transcript?.assetId === assetId ? document.transcript : null);
      if (!transcript) {
        return failure(`No transcript for asset ${assetId ?? "(none)"}.`);
      }
      const segments = transcript.segments.map((s) => ({
        id: s.id,
        kind: s.kind,
        startSec: s.startSec,
        endSec: s.endSec,
        text: s.text
      }));
      return {
        ok: true,
        resultJson: JSON.stringify({ assetId, language: transcript.language, segments })
      };
    }
    case "addTrim": {
      const parsed = addTrimArgs.safeParse(args);
      if (!parsed.success) return failure(parsed.error.message);
      const assetId = parsed.data.assetId ?? document.project.primaryAssetId ?? document.assets[0]?.id;
      if (!assetId) return failure("Project has no assets — nothing to trim.");
      if (!document.assets.some((a) => a.id === assetId)) {
        return failure(`Unknown asset: ${assetId}`);
      }
      const startSec = Math.min(parsed.data.startSec, parsed.data.endSec);
      const endSec = Math.max(parsed.data.startSec, parsed.data.endSec);
      const covering = document.timeline.clips.filter(
        (c) => c.assetId === assetId && endSec > c.sourceStartSec && startSec < (c.sourceEndSec ?? Number.POSITIVE_INFINITY)
      );
      let clipId = parsed.data.clipId;
      if (clipId) {
        const target = document.timeline.clips.find((c) => c.id === clipId);
        if (!target) return failure(`Unknown clip: ${clipId}`);
        if (target.assetId !== assetId) {
          return failure(`Clip ${clipId} does not use asset ${assetId}.`);
        }
      } else if (covering.length === 1) {
        clipId = covering[0].id;
      } else if (covering.length > 1) {
        return failure(
          `${covering.length} clips use asset ${assetId} over ${formatSec(startSec)} – ${formatSec(
            endSec
          )} (${covering.map((c) => c.id).join(", ")}). Pass clipId to say which one to trim.`
        );
      }
      const trim = {
        id: createId("trim"),
        assetId,
        ...clipId ? { clipId } : {},
        startSec,
        endSec,
        reason: parsed.data.reason,
        origin: "agent"
      };
      const next = {
        ...document,
        timeline: {
          ...document.timeline,
          trimRanges: [...document.timeline.trimRanges, trim]
        }
      };
      return {
        ok: true,
        document: next,
        resultJson: JSON.stringify({ trimRangeId: trim.id, startSec, endSec }),
        summary: `added trim ${formatSec(startSec)} – ${formatSec(endSec)}`
      };
    }
    case "addTrims": {
      const parsed = addTrimsArgs.safeParse(args);
      if (!parsed.success) return failure(parsed.error.message);
      return applyBatch(document, "addTrim", parsed.data.ranges, options, "trim");
    }
    case "setTrim": {
      const parsed = setTrimArgs.safeParse(args);
      if (!parsed.success) return failure(parsed.error.message);
      const { trimRangeId } = parsed.data;
      if (!document.timeline.trimRanges.some((r) => r.id === trimRangeId)) {
        return failure(`Unknown trim range: ${trimRangeId}`);
      }
      const startSec = Math.min(parsed.data.startSec, parsed.data.endSec);
      const endSec = Math.max(parsed.data.startSec, parsed.data.endSec);
      const reanchor = (trim) => {
        if (!trim.clipId) return void 0;
        const covers = (c) => endSec > c.sourceStartSec && startSec < (c.sourceEndSec ?? Number.POSITIVE_INFINITY);
        const current = document.timeline.clips.find((c) => c.id === trim.clipId);
        if (current && covers(current)) return trim.clipId;
        const candidates = document.timeline.clips.filter(
          (c) => c.assetId === trim.assetId && covers(c)
        );
        return candidates.length === 1 ? candidates[0].id : trim.clipId;
      };
      const next = {
        ...document,
        timeline: {
          ...document.timeline,
          trimRanges: document.timeline.trimRanges.map(
            (r) => r.id === trimRangeId ? { ...r, clipId: reanchor(r), startSec, endSec } : r
          )
        }
      };
      return {
        ok: true,
        document: next,
        resultJson: JSON.stringify({ trimRangeId, startSec, endSec }),
        summary: `moved trim to ${formatSec(startSec)} – ${formatSec(endSec)}`
      };
    }
    case "setClipRange": {
      const parsed = setClipRangeArgs.safeParse(args);
      if (!parsed.success) return failure(parsed.error.message);
      const { clipId } = parsed.data;
      if (!document.timeline.clips.some((c) => c.id === clipId)) {
        return failure(`Unknown clip: ${clipId}`);
      }
      const sourceStartSec = Math.min(parsed.data.sourceStartSec, parsed.data.sourceEndSec);
      const sourceEndSec = Math.max(parsed.data.sourceStartSec, parsed.data.sourceEndSec);
      const next = setClipSourceRange(document, clipId, sourceStartSec, sourceEndSec);
      const dropped = droppedByEdit(document, next);
      const casualties = dropped.droppedModifierIds.length + dropped.droppedTrimIds.length;
      return {
        ok: true,
        document: next,
        resultJson: JSON.stringify({ clipId, sourceStartSec, sourceEndSec, ...dropped }),
        summary: `trimmed clip to ${formatSec(sourceStartSec)} – ${formatSec(sourceEndSec)}` + (casualties > 0 ? ` — dropped ${[...dropped.droppedModifierIds, ...dropped.droppedTrimIds].join(", ")}` : "")
      };
    }
    case "moveClip": {
      const parsed = moveClipArgs.safeParse(args);
      if (!parsed.success) return failure(parsed.error.message);
      const { clipId } = parsed.data;
      const beforeClipId = parsed.data.beforeClipId ?? null;
      const clips = document.timeline.clips;
      const moving = clips.find((c) => c.id === clipId);
      if (!moving) return failure(`Unknown clip: ${clipId}. ${clipRoster(document)}`);
      if (beforeClipId === clipId) {
        return failure(
          `beforeClipId must name a different clip than clipId (both were ${clipId}); pass null to move it last.`
        );
      }
      const remaining = clips.filter((c) => c.id !== clipId);
      let insertIndex = remaining.length;
      if (beforeClipId !== null) {
        insertIndex = remaining.findIndex((c) => c.id === beforeClipId);
        if (insertIndex < 0) {
          return failure(`Unknown clip: ${beforeClipId}. ${clipRoster(document)}`);
        }
      }
      let next;
      try {
        next = moveClip(document, clipId, insertIndex, moving.origin, "");
      } catch (err) {
        return failure(err instanceof Error ? err.message : String(err));
      }
      const order = next.timeline.clips.map((c) => c.id);
      return {
        ok: true,
        document: next,
        resultJson: JSON.stringify({
          clipId,
          beforeClipId,
          clipOrder: order,
          // Nothing is destroyed by a reorder — say so, since the alternative
          // tool the model used to reach for destroyed plenty in silence.
          trimCount: next.timeline.trimRanges.length,
          ...droppedByEdit(document, next)
        }),
        summary: `moved ${clipId} ${beforeClipId ? `before ${beforeClipId}` : "to the end"} (order: ${order.join(" → ")})`
      };
    }
    case "replaceTimeline": {
      const parsed = replaceTimelineArgs.safeParse(args);
      if (!parsed.success) return failure(parsed.error.message);
      const plan = planTimelineReplacement(document, parsed.data.intervals);
      const objections = [];
      if (plan.reorderRequested) {
        objections.push(
          "- the intervals are not in ascending order, so this reads as a REORDER. replaceTimeline sorts and merges its intervals, so the swap could not happen at all: use moveClip (it preserves ids, trims and anchored effects)."
        );
      }
      if (plan.lostClipIds.length > 0) {
        objections.push(
          `- these clips would be merged away or dropped: ${plan.lostClipIds.join(", ")}. To shorten one, use setClipRange; to delete one, removeClip; to change the order, moveClip; to cut a span inside one, addTrim.`
        );
      }
      if (plan.slidRegionIds.length > 0) {
        objections.push(
          `- these effects are anchored to those clips and would be re-anchored onto whatever footage moved under them: ${plan.slidRegionIds.join(", ")}.`
        );
      }
      if (objections.length > 0) {
        return {
          ok: false,
          resultJson: JSON.stringify({
            error: `Refused: replaceTimeline would destroy work you were not asked to touch. Nothing was modified.
${objections.join("\n")}
replaceTimeline rebuilds the whole timeline and is only for an explicit 'start over with these intervals' on a timeline with nothing to lose.`,
            code: "would_destroy",
            reorderRequested: plan.reorderRequested,
            lostClipIds: plan.lostClipIds,
            slidRegionIds: plan.slidRegionIds
          })
        };
      }
      let next;
      try {
        next = replaceTimeline(document, parsed.data.intervals, parsed.data.reason, "agent");
      } catch (err) {
        return failure(err instanceof Error ? err.message : String(err));
      }
      const kept = parsed.data.intervals.length;
      return {
        ok: true,
        document: next,
        resultJson: JSON.stringify({
          clipCount: next.timeline.clips.length,
          trimCount: next.timeline.trimRanges.length,
          // What survived, by name. The old result reported two counts, and a
          // model reading `trimCount: 0` after a rebuild had nothing telling it
          // WHICH cut had ceased to exist — which is what made "the silence trim
          // is preserved" so easy to write.
          preservedClipIds: plan.slots.map((s) => s.keepClipId).filter((id) => !!id),
          ...plan.absorbedTrimIds.length ? { absorbedTrimIds: plan.absorbedTrimIds } : {},
          ...plan.clippedTrimIds.length ? { clippedTrimIds: plan.clippedTrimIds } : {}
        }),
        summary: `rebuilt timeline from ${kept} interval${kept === 1 ? "" : "s"} (${next.timeline.clips.length} clips, ${next.timeline.trimRanges.length} trims)` + (plan.absorbedTrimIds.length ? ` — ${plan.absorbedTrimIds.join(", ")} now fall outside the kept spans` : "")
      };
    }
    case "addZoom": {
      const parsed = addZoomArgs.safeParse(args);
      if (!parsed.success) return failure(parsed.error.message);
      const startMs = toMs(Math.min(parsed.data.startSec, parsed.data.endSec));
      const endMs = toMs(Math.max(parsed.data.startSec, parsed.data.endSec));
      const zoom = {
        id: createId("zoom"),
        startMs,
        endMs,
        depth: parsed.data.depth,
        focus: parsed.data.focus,
        focusMode: "manual",
        source: "manual"
      };
      const placed = anchorForAgent(zoom, document, "zoom");
      const landing = landingOf(placed, document);
      if (!landing.anchored) return coversNoClip("zoom", startMs / 1e3, endMs / 1e3, document);
      const next = {
        ...document,
        zoomRanges: [...document.zoomRanges, ...placed]
      };
      const anchor = cursorAnchorReport(placed, document, zoom.focus, options?.cursorTelemetry);
      return {
        ok: true,
        document: next,
        resultJson: JSON.stringify({
          zoomId: landing.ids[0],
          depth: zoom.depth,
          // The depth alone is an ordinal; reported on its own it is what the
          // model turns into "3×" for a frame that renders 1.80×.
          renderedScale: effectiveZoomScale(zoom),
          ...landingReport(landing, startMs / 1e3, endMs / 1e3),
          ...anchor ? { cursorAnchor: anchor } : {}
        }),
        summary: `added zoom ${formatSec(landing.startSec)} – ${formatSec(landing.endSec)} at ${effectiveZoomScale(zoom).toFixed(2)}×` + landingSuffix(landing, startMs / 1e3, endMs / 1e3)
      };
    }
    case "addZooms": {
      const parsed = addZoomsArgs.safeParse(args);
      if (!parsed.success) return failure(parsed.error.message);
      return applyBatch(document, "addZoom", parsed.data.regions, options, "zoom");
    }
    case "setZoom": {
      const parsed = setZoomArgs.safeParse(args);
      if (!parsed.success) return failure(parsed.error.message);
      const { zoomId } = parsed.data;
      const existing = document.zoomRanges.find((z2) => z2.id === zoomId);
      if (!existing) return failure(`Unknown zoom: ${zoomId}`);
      const { startMs, endMs } = resolveSpanMs(existing, parsed.data.startSec, parsed.data.endSec);
      const zoomPill = new Set(resolvePillIds(document.zoomRanges, zoomId));
      const clearsCustomScale = parsed.data.depth !== void 0 && document.zoomRanges.some((z2) => zoomPill.has(z2.id) && z2.customScale != null);
      const rebuiltZooms = replacePillSpan(
        // payload edits first, applied to every region under the pill…
        document.zoomRanges.map((z2) => {
          if (!zoomPill.has(z2.id)) return z2;
          const { customScale, ...rest } = z2;
          return {
            ...clearsCustomScale ? rest : z2,
            ...parsed.data.depth !== void 0 ? { depth: parsed.data.depth } : {},
            ...parsed.data.focus ? { focus: parsed.data.focus } : {}
          };
        }),
        // …then the span: clamped against different-property pills, then re-ventilated.
        zoomId,
        startMs,
        endMs,
        document.timeline.clips,
        () => createId("zoom")
      );
      const landing = landingAfterPillEdit(document.zoomRanges, rebuiltZooms, zoomPill, document);
      if (!landing.anchored) return coversNoClip("zoom", startMs / 1e3, endMs / 1e3, document);
      const next = { ...document, zoomRanges: rebuiltZooms };
      const landed = new Set(landing.ids);
      const strength = rebuiltZooms.find((z2) => landed.has(z2.id));
      const anchor = strength ? cursorAnchorReport(
        rebuiltZooms.filter((z2) => landed.has(z2.id)),
        document,
        strength.focus,
        options?.cursorTelemetry
      ) : void 0;
      return {
        ok: true,
        document: next,
        resultJson: JSON.stringify({
          zoomId: landing.ids[0] ?? zoomId,
          ...strength ? { depth: strength.depth, renderedScale: effectiveZoomScale(strength) } : {},
          ...clearsCustomScale ? { clearedCustomScale: true } : {},
          ...landingReport(landing, startMs / 1e3, endMs / 1e3),
          ...anchor ? { cursorAnchor: anchor } : {}
        }),
        summary: `updated zoom ${formatSec(landing.startSec)} – ${formatSec(landing.endSec)}` + (strength ? ` at ${effectiveZoomScale(strength).toFixed(2)}×` : "") + (clearsCustomScale ? " (cleared its custom scale so the depth applies)" : "") + landingSuffix(landing, startMs / 1e3, endMs / 1e3)
      };
    }
    case "addSpeed": {
      const parsed = addSpeedArgs.safeParse(args);
      if (!parsed.success) return failure(parsed.error.message);
      const startMs = toMs(Math.min(parsed.data.startSec, parsed.data.endSec));
      const endMs = toMs(Math.max(parsed.data.startSec, parsed.data.endSec));
      const legacy = document.legacyEditor ?? {};
      const prev = legacy.speedRegions ?? [];
      const region = { id: createId("speed"), startMs, endMs, speed: parsed.data.speed };
      const placed = anchorForAgent(region, document, "speed");
      const landing = landingOf(placed, document);
      if (!landing.anchored) {
        return coversNoClip("speed region", startMs / 1e3, endMs / 1e3, document);
      }
      const next = {
        ...document,
        legacyEditor: { ...legacy, speedRegions: [...prev, ...placed] }
      };
      return {
        ok: true,
        document: next,
        resultJson: JSON.stringify({
          speedId: landing.ids[0],
          speed: region.speed,
          ...landingReport(landing, startMs / 1e3, endMs / 1e3)
        }),
        summary: `added ${parsed.data.speed}× speed ${formatSec(landing.startSec)} – ${formatSec(landing.endSec)}` + landingSuffix(landing, startMs / 1e3, endMs / 1e3)
      };
    }
    case "setSpeed": {
      const parsed = setSpeedArgs.safeParse(args);
      if (!parsed.success) return failure(parsed.error.message);
      const legacy = document.legacyEditor ?? {};
      const prev = legacy.speedRegions ?? [];
      const existing = prev.find((s) => s.id === parsed.data.speedId);
      const speedPill = new Set(resolvePillIds(prev, parsed.data.speedId));
      if (!existing) return failure(`Unknown speed region: ${parsed.data.speedId}`);
      const { startMs, endMs } = resolveSpanMs(existing, parsed.data.startSec, parsed.data.endSec);
      const speed = parsed.data.speed ?? existing.speed;
      const rebuiltSpeeds = replacePillSpan(
        prev.map((s) => speedPill.has(s.id) ? { ...s, speed } : s),
        parsed.data.speedId,
        startMs,
        endMs,
        document.timeline.clips,
        () => createId("speed")
      );
      const landing = landingAfterPillEdit(prev, rebuiltSpeeds, speedPill, document);
      if (!landing.anchored) {
        return coversNoClip("speed region", startMs / 1e3, endMs / 1e3, document);
      }
      const next = {
        ...document,
        legacyEditor: { ...legacy, speedRegions: rebuiltSpeeds }
      };
      return {
        ok: true,
        document: next,
        resultJson: JSON.stringify({
          speedId: landing.ids[0] ?? parsed.data.speedId,
          speed,
          ...landingReport(landing, startMs / 1e3, endMs / 1e3)
        }),
        summary: `updated speed to ${speed}× over ${formatSec(landing.startSec)} – ${formatSec(landing.endSec)}` + landingSuffix(landing, startMs / 1e3, endMs / 1e3)
      };
    }
    case "addAnnotation": {
      const parsed = addAnnotationArgs.safeParse(args);
      if (!parsed.success) return failure(parsed.error.message);
      const startMs = toMs(Math.min(parsed.data.startSec, parsed.data.endSec));
      const endMs = toMs(Math.max(parsed.data.startSec, parsed.data.endSec));
      const ann = {
        id: createId("ann"),
        startMs,
        endMs,
        type: "text",
        content: parsed.data.text,
        textContent: parsed.data.text,
        position: { x: parsed.data.x, y: parsed.data.y },
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
        zIndex: document.annotations.length + 1
      };
      const placed = anchorForAgent(ann, document, "ann");
      const landing = landingOf(placed, document);
      if (!landing.anchored) {
        return coversNoClip("annotation", startMs / 1e3, endMs / 1e3, document);
      }
      const next = {
        ...document,
        annotations: [...document.annotations, ...placed]
      };
      return {
        ok: true,
        document: next,
        resultJson: JSON.stringify({
          annotationId: landing.ids[0],
          ...landingReport(landing, startMs / 1e3, endMs / 1e3)
        }),
        summary: `added annotation "${parsed.data.text.slice(0, 24)}" ${formatSec(landing.startSec)} – ${formatSec(landing.endSec)}` + landingSuffix(landing, startMs / 1e3, endMs / 1e3)
      };
    }
    case "setAnnotation": {
      const parsed = setAnnotationArgs.safeParse(args);
      if (!parsed.success) return failure(parsed.error.message);
      const { annotationId } = parsed.data;
      const existing = document.annotations.find((a) => a.id === annotationId);
      const annPill = new Set(resolvePillIds(document.annotations, annotationId));
      if (!existing) return failure(`Unknown annotation: ${annotationId}`);
      const { startMs, endMs } = resolveSpanMs(existing, parsed.data.startSec, parsed.data.endSec);
      const rebuiltAnnotations = replacePillSpan(
        document.annotations.map(
          (a) => annPill.has(a.id) ? {
            ...a,
            ...parsed.data.text !== void 0 ? { content: parsed.data.text, textContent: parsed.data.text } : {}
          } : a
        ),
        annotationId,
        startMs,
        endMs,
        document.timeline.clips,
        () => createId("ann")
      );
      const landing = landingAfterPillEdit(
        document.annotations,
        rebuiltAnnotations,
        annPill,
        document
      );
      if (!landing.anchored) {
        return coversNoClip("annotation", startMs / 1e3, endMs / 1e3, document);
      }
      const next = { ...document, annotations: rebuiltAnnotations };
      return {
        ok: true,
        document: next,
        resultJson: JSON.stringify({
          annotationId: landing.ids[0] ?? annotationId,
          ...landingReport(landing, startMs / 1e3, endMs / 1e3)
        }),
        summary: `updated annotation ${formatSec(landing.startSec)} – ${formatSec(landing.endSec)}` + landingSuffix(landing, startMs / 1e3, endMs / 1e3)
      };
    }
    case "addCameraFullscreen": {
      const parsed = addCameraFullscreenArgs.safeParse(args);
      if (!parsed.success) return failure(parsed.error.message);
      const startMs = toMs(Math.min(parsed.data.startSec, parsed.data.endSec));
      const endMs = toMs(Math.max(parsed.data.startSec, parsed.data.endSec));
      const legacy = document.legacyEditor ?? {};
      const prev = legacy.cameraFullscreenRegions ?? [];
      const region = { id: createId("camfull"), startMs, endMs };
      const placed = anchorForAgent(region, document, "camfull");
      const landing = landingOf(placed, document);
      if (!landing.anchored) {
        return coversNoClip("full-camera region", startMs / 1e3, endMs / 1e3, document);
      }
      const blind = noCameraUnderSpan(document, landing.startSec, landing.endSec);
      if (blind) return blind;
      const next = {
        ...document,
        legacyEditor: { ...legacy, cameraFullscreenRegions: [...prev, ...placed] }
      };
      return {
        ok: true,
        document: next,
        resultJson: JSON.stringify({
          cameraFullscreenId: landing.ids[0],
          ...landingReport(landing, startMs / 1e3, endMs / 1e3)
        }),
        summary: `full-camera ${formatSec(landing.startSec)} – ${formatSec(landing.endSec)}` + landingSuffix(landing, startMs / 1e3, endMs / 1e3)
      };
    }
    case "setCameraFullscreen": {
      const parsed = setCameraFullscreenArgs.safeParse(args);
      if (!parsed.success) return failure(parsed.error.message);
      const legacy = document.legacyEditor ?? {};
      const prev = legacy.cameraFullscreenRegions ?? [];
      const existing = prev.find((r) => r.id === parsed.data.cameraFullscreenId);
      if (!existing)
        return failure(`Unknown full-camera region: ${parsed.data.cameraFullscreenId}`);
      const { startMs, endMs } = resolveSpanMs(existing, parsed.data.startSec, parsed.data.endSec);
      const camPill = new Set(resolvePillIds(prev, parsed.data.cameraFullscreenId));
      const rebuiltCamera = replacePillSpan(
        prev,
        parsed.data.cameraFullscreenId,
        startMs,
        endMs,
        document.timeline.clips,
        () => createId("camfull")
      );
      const landing = landingAfterPillEdit(prev, rebuiltCamera, camPill, document);
      if (!landing.anchored) {
        return coversNoClip("full-camera region", startMs / 1e3, endMs / 1e3, document);
      }
      const blindMove = noCameraUnderSpan(document, landing.startSec, landing.endSec);
      if (blindMove) return blindMove;
      const next = {
        ...document,
        legacyEditor: { ...legacy, cameraFullscreenRegions: rebuiltCamera }
      };
      return {
        ok: true,
        document: next,
        resultJson: JSON.stringify({
          cameraFullscreenId: landing.ids[0] ?? parsed.data.cameraFullscreenId,
          ...landingReport(landing, startMs / 1e3, endMs / 1e3)
        }),
        summary: `moved full-camera to ${formatSec(landing.startSec)} – ${formatSec(landing.endSec)}` + landingSuffix(landing, startMs / 1e3, endMs / 1e3)
      };
    }
    case "removeTrim": {
      const parsed = removeTrimArgs.safeParse(args);
      if (!parsed.success) return failure(parsed.error.message);
      const { trimRangeId } = parsed.data;
      if (!document.timeline.trimRanges.some((s) => s.id === trimRangeId)) {
        return failure(`Unknown trim range: ${trimRangeId}`);
      }
      const next = removeRegion(document, "trim", trimRangeId);
      return {
        ok: true,
        document: next,
        resultJson: JSON.stringify({ removed: trimRangeId, kind: "trim" }),
        summary: `removed trim ${trimRangeId}`
      };
    }
    case "removeModifier": {
      const parsed = removeModifierArgs.safeParse(args);
      if (!parsed.success) return failure(parsed.error.message);
      const { id } = parsed.data;
      const legacy = document.legacyEditor ?? {};
      const speedRegions = legacy.speedRegions ?? [];
      const cameraFullscreenRegions = legacy.cameraFullscreenRegions ?? [];
      let kind = null;
      if (document.zoomRanges.some((z2) => z2.id === id)) kind = "zoom";
      else if (document.annotations.some((a) => a.id === id)) kind = "annotation";
      else if (speedRegions.some((s) => s.id === id)) kind = "speed";
      else if (cameraFullscreenRegions.some((c) => c.id === id)) kind = "cameraFullscreen";
      if (!kind) {
        return failure(
          `No zoom / speed / annotation / full-camera modifier with id ${id}. For a trim use removeTrim; for a clip use removeClip.`
        );
      }
      const next = removeRegion(document, kind, id);
      return {
        ok: true,
        document: next,
        resultJson: JSON.stringify({ removed: id, kind }),
        summary: `removed ${kind} ${id}`
      };
    }
    case "removeClip": {
      const parsed = removeClipArgs.safeParse(args);
      if (!parsed.success) return failure(parsed.error.message);
      const { clipId } = parsed.data;
      if (!document.timeline.clips.some((c) => c.id === clipId)) {
        return failure(`Unknown clip: ${clipId}`);
      }
      const next = removeClip(document, clipId);
      const dropped = droppedByEdit(document, next);
      const casualties = dropped.droppedModifierIds.length + dropped.droppedTrimIds.length;
      return {
        ok: true,
        document: next,
        resultJson: JSON.stringify({
          removed: clipId,
          clipCount: next.timeline.clips.length,
          ...dropped
        }),
        summary: `removed clip ${clipId}` + (casualties > 0 ? ` — dropped ${[...dropped.droppedModifierIds, ...dropped.droppedTrimIds].join(", ")}` : "")
      };
    }
    default:
      return failure(`Unknown tool: ${name}`);
  }
}
const CONSENT_PROMPT_BLOCK = [
  "",
  "PROJECT EDITS ARE CURRENTLY DISABLED by the user, who asked to be consulted before the timeline changes.",
  "- Read freely: getCurrentDocument and getTranscript work as usual.",
  "- Do NOT call any tool that writes (addTrim, setTrim, setClipRange, moveClip, replaceTimeline, add*/set* effects, remove*). Every one of them will be refused, so calling them wastes the turn and tells the user nothing.",
  "- Instead: say precisely what you would change — which tool, which times, which ids — and ask the user to confirm. Be specific enough that they can say yes to it.",
  "- Never state or imply that an edit was applied. If the user confirms and you are still refused, tell them the 'Project edits' setting in Settings → AI has to be re-enabled first."
].join("\n");
const BASE_SYSTEM_PROMPT = [
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
  `- addZoom takes a virtual-timeline span (depth is an ordinal 1–6 selecting from a fixed table — ${ZOOM_DEPTH_LEGEND} — never a multiplier; focus in 0–1 frame fractions). addSpeed changes pacing over a span. addAnnotation puts text on screen. addCameraFullscreen enlarges the webcam, and only does something where assets[].hasCameraTrack is true.`,
  "- moveClip changes the order of placed clips, one call per clip that moves, preserving ids, source ranges, trims and anchored effects. replaceTimeline rebuilds the timeline from kept intervals and sorts them, so it cannot reorder anything.",
  "- Deleting is a first-class action, not a workaround: removeTrim, removeModifier, removeClip. Never fake a deletion by re-adding an element or zeroing it out (span 0, speed 1×) — that leaves it in the document and misreports what you did.",
  "If nothing in the list does what was asked, say so; do not approximate it with a bigger tool.",
  "",
  "Cursor telemetry: while the screen was captured, Drift recorded where the pointer went. assets[].hasCursorTelemetry in getCurrentDocument says which assets carry it, and getCursorTrack returns the recorded track for one of them — positions over time, and the pointer shape at each moment. What it means is yours to read.",
  "Blindness is not evidence. When a tool reports it could not read something (reason 'unavailable'), that is a limit of your runtime, not a fact about the project. Only an explicit negative — reason 'no-sidecar', or a false flag — supports telling the user the data is not there.",
  "",
  "Honesty rules: if a request has NO matching tool (e.g. deleting an asset/recording, exporting), say so plainly — do not substitute a different edit and report it as the requested one. After your edits, if you are at all unsure the document ended up as intended, call getCurrentDocument and reconcile what you claim with the real state; each tool result already tells you exactly what it did, so never report a change the results don't support."
].join("\n");
function buildSystemPrompt(options) {
  return options.editsAllowed ? BASE_SYSTEM_PROMPT : BASE_SYSTEM_PROMPT + CONSENT_PROMPT_BLOCK;
}
buildSystemPrompt({ editsAllowed: true });
const TOOL_DESCRIPTIONS = {
  getCurrentDocument: "Read a compact snapshot of the current project: assets (with durations), timeline clips and trim ranges (source-time), and the zoom / speed / annotation effects (virtual, edited-timeline time). Call this before editing if the snapshot in the system prompt may be stale. The AxcutDocument is the single source of truth — your edits should preserve the user's placed clips and any timeline state they have already set up.",
  getTranscript: "Read the transcript segments (speech and silence, with start/end seconds and text) for an asset. Omit assetId to read the primary asset's transcript.",
  getCursorTrack: "Read the recorded pointer track for an asset: where the cursor was over time, downsampled to a readable rate. Each point carries atSec (the asset's own source clock), virtualSec (the same instant on the edited timeline — the coordinate addZoom takes, null when no clip carries it), cx/cy as 0–1 fractions of the frame, and `shape`, an index into the pointer bitmaps the recording used (equal values are the same pointer; a change means the pointer changed, e.g. arrow to text caret). Points that are not plain moves carry `kind`; points a trim cuts out of playback carry `trimmed`. These are real samples, not a summary — reading what the pointer was doing is yours. Omit assetId for the primary asset. It answers `available:false` in two DIFFERENT ways you must not confuse: reason 'no-sidecar' means this asset was checked and genuinely has no telemetry, while reason 'unavailable' means it could not be read from here.",
  addTrim: "Add ONE trim range: a cut of a span inside a clip (this source-time span will not be played or exported) that does NOT split the clip. Times are in seconds of the asset's source time. This is the preferred (and for 'remove silences' requests, the only) way to handle silences; it preserves the user's placed clips and only adds a cut. When you have several cuts to make, use addTrims and send them together — this one is for a single cut or a later correction. A cut belongs to ONE clip: `clipId` is inferred when a single clip covers the range, but when several clips draw on the same asset over it the call FAILS and lists them — pass the `clipId` you mean (ids come from getCurrentDocument).",
  addTrims: "Add MANY trim ranges in one call: `ranges` is a list, each entry taking exactly the fields addTrim takes. Use this whenever you have more than one cut to make — 'remove the silences' on a half-hour recording is hundreds of cuts, and sending them one at a time costs one round trip each. Each range stands or falls ALONE: one that cannot be placed is refused by itself and listed in `refused` with its index and the reason, while every other range is still applied. Nothing is rolled back, so a single bad bound never costs you the rest. The result leads with requested / appliedCount / refusedCount so you can see a partial outcome without re-reading the document — report what was refused rather than claiming the whole list landed.",
  setTrim: "Move or resize an existing trim range by id. Times are source-time seconds. The cut follows to whichever clip the new range lands in, when that clip is unambiguous.",
  setClipRange: "Set a clip's in/out points (source-time seconds) to shorten its head or tail — distinct from a trim (which cuts a span inside the clip). All clips are re-laid back-to-back afterwards, so downstream clips shift automatically. Use this ONLY when the user explicitly asks to shorten or extend a user-placed clip. Do NOT use this for 'remove silences' or 'cut pauses' — for those, use addTrim.",
  moveClip: "Reorder a placed clip: move `clipId` so it plays just before `beforeClipId` (pass null, or omit it, to move it last). Ids come from getCurrentDocument, where each clip carries its `index` and its label in `reason`. This preserves every clip id, every source range, every trim, and the zooms / speed regions / annotations anchored to each clip. This is the tool for 'swap these clips', 'put X first' and 'change the clip order' — replaceTimeline cannot reorder anything.",
  replaceTimeline: "Replace the whole timeline with the given kept intervals of the primary asset's source time. Everything outside the intervals becomes a trim. The intervals are SORTED, so this can never reorder clips — use moveClip for that. DO NOT use this for 'cut silences' or 'remove pauses' — the user has likely placed clips on the timeline that you'd be discarding. Use this ONLY when the user explicitly asks you to rebuild the timeline from scratch (e.g. 'start over with the kept intervals from the transcript'). It is refused when it would merge away, shorten or drop an existing clip; the refusal names them and the tool to use instead.",
  addZoom: `Add a zoom-in over a span of the edited timeline (virtual seconds). depth is an ORDINAL 1–6, not a factor: it selects a magnification from a fixed table (${ZOOM_DEPTH_LEGEND}), so the default depth 3 renders at 1.80×. The result reports renderedScale — quote that, never the depth, when telling the user how strong the zoom is. focus is the zoom centre in 0–1 fractions of the frame (default centre). When the recording's pointer telemetry can be read for the footage under the span, the result also carries \`cursorAnchor\`: \`focus\` echoes the value this call used (including the default, if you left it out), \`cursor\` is where the pointer ACTUALLY was over the span the zoom landed on — the median of the recorded samples, \`spread\` being how far the farthest one strays from it — and \`offset\` is the distance between the two, in frame fractions. It is a measurement, not a correction: nothing is moved and no call is refused over it, and a zoom framing a slide, a face, or a region the pointer never enters is a legitimate choice. \`available:false\` names what it found instead (\`no-samples\`, \`trimmed-out\`). Its ABSENCE means no telemetry was read for that footage — never that the recording has none; assets[].hasCursorTelemetry and getCursorTrack are what answer that. Use for 'zoom in on …' and the smart-zoom pass.`,
  addZooms: `Add MANY zooms in one call: \`regions\` is a list, each entry taking exactly the fields addZoom takes (same depth table, ${ZOOM_DEPTH_LEGEND}). Use this for the smart-zoom pass, where you have decided every zoom before emitting the first one — sending them one at a time costs one round trip each. Each region stands or falls ALONE: one that covers no clip is refused by itself and listed in \`refused\` with its index and the reason, while the others are still applied. The result leads with requested / appliedCount / refusedCount, and each applied entry carries its renderedScale — quote that, never the depth — plus the same \`cursorAnchor\` addZoom reports, whenever the footage under that region has readable pointer telemetry.`,
  setZoom: `Move, resize, or restyle an existing zoom by id (virtual-timeline seconds). Only the fields you pass are changed. depth selects from the same table (${ZOOM_DEPTH_LEGEND}); if the zoom carries a customScale (getCurrentDocument shows it as depthIsOverridden), that custom value is what renders, and passing depth clears it so the depth takes effect — the result says so. The result reports the resulting renderedScale, and — when the footage under the span has readable pointer telemetry — the same \`cursorAnchor\` addZoom reports, measured against the zoom's EFFECTIVE focus, so a call that moved only the span still learns what its unchanged focus is now looking at.`,
  addSpeed: "Add a speed-change region over a span of the edited timeline (virtual seconds). speed > 1 fast-forwards, < 1 slows down (default 1.5×). Use to speed through slow stretches without cutting them.",
  setSpeed: "Move, resize, or change the multiplier of an existing speed region by id (virtual-timeline seconds). Only the fields you pass are changed.",
  addAnnotation: "Add a text annotation over a span of the edited timeline (virtual seconds). x/y are frame percentages (0–100, default centre). Use for callouts and labels.",
  setAnnotation: "Move, resize, or edit the text of an existing annotation by id (virtual-timeline seconds). Only the fields you pass are changed.",
  addCameraFullscreen: "Add a camera-fullscreen region over a span of the edited timeline (virtual seconds): the webcam fills the frame for that span. This only does something when the footage under that span comes from an asset with a linked webcam — check assets[].hasCameraTrack (or hasAnyCamera) in getCurrentDocument first. On footage with no camera the call is refused rather than storing a region that would render nothing; say so instead of retrying.",
  setCameraFullscreen: "Move or resize an existing camera-fullscreen region by id (virtual-timeline seconds). Only the fields you pass are changed. Refused if the new span lands on footage with no linked webcam.",
  removeTrim: "Delete a trim range by id — the cut is undone and that span plays/exports again. This is how you 'remove a trim'; never re-add a trim to undo one.",
  removeModifier: "Delete a modifier (zoom / speed / annotation / camera-fullscreen) by id; the kind is resolved from the id. This is how you 'remove'/'delete' one — never neutralise it (span 0, speed 1×), which leaves it in the document. For a trim use removeTrim; for a clip use removeClip.",
  removeClip: "Delete a placed clip by id; remaining clips close the gap and effects anchored to it are dropped. Use only when the user asks to remove a clip — to shorten one, use setClipRange."
};
const TOOLS_READING_CURSOR = /* @__PURE__ */ new Set([
  "getCursorTrack",
  "addZoom",
  "addZooms",
  "setZoom"
]);
function documentTool(holder, sink, name, schema, editsAllowed, runtime) {
  return tool$1(
    async (args) => {
      sink.toolStart(name, args);
      const load2 = TOOLS_READING_CURSOR.has(name) ? await loadCursorTelemetry(holder.current, args, runtime) : void 0;
      const execution = executeAgentTool(holder.current, name, JSON.stringify(args), {
        editsAllowed,
        cursorTelemetry: { availableByAssetId: runtime.availableByAssetId, load: load2 }
      });
      if (execution.document) holder.current = execution.document;
      sink.toolEnd(name, execution.ok, execution.summary);
      return execution.resultJson;
    },
    { name, description: TOOL_DESCRIPTIONS[name], schema }
  );
}
async function loadCursorTelemetry(document, args, runtime) {
  const requested = args?.assetId;
  const assetId = resolveCursorAssetId(document, typeof requested === "string" ? requested : null);
  if (!assetId) return { status: "unavailable", assetId: null };
  if (!runtime.cursor) {
    return { status: "unavailable", assetId };
  }
  const asset = document.assets.find((a) => a.id === assetId);
  try {
    return await runtime.cursor.read({ assetId, originalPath: asset?.originalPath ?? null });
  } catch (error) {
    return {
      status: "unavailable",
      assetId,
      note: `Cursor telemetry could not be read: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}
function buildTools(holder, sink, editsAllowed = true, runtime = {}) {
  const build = (name, schema) => documentTool(holder, sink, name, schema, editsAllowed, runtime);
  return [
    build("getCurrentDocument", object({})),
    build("getTranscript", getTranscriptArgs),
    build("getCursorTrack", getCursorTrackArgs),
    build("addTrim", addTrimArgs),
    build("addTrims", addTrimsArgs),
    build("setTrim", setTrimArgs),
    build("setClipRange", setClipRangeArgs),
    build("moveClip", moveClipArgs),
    build("replaceTimeline", replaceTimelineArgs),
    build("addZoom", addZoomArgs),
    build("addZooms", addZoomsArgs),
    build("setZoom", setZoomArgs),
    build("addSpeed", addSpeedArgs),
    build("setSpeed", setSpeedArgs),
    build("addAnnotation", addAnnotationArgs),
    build("setAnnotation", setAnnotationArgs),
    build("addCameraFullscreen", addCameraFullscreenArgs),
    build("setCameraFullscreen", setCameraFullscreenArgs),
    build("removeTrim", removeTrimArgs),
    build("removeModifier", removeModifierArgs),
    build("removeClip", removeClipArgs)
  ];
}
function anthropicCachingMiddleware(chatModel) {
  if (chatModel.getName?.() !== "ChatAnthropic") return [];
  return [
    anthropicPromptCachingMiddleware({
      unsupportedModelBehavior: "ignore",
      minMessagesToCache: 1
    })
  ];
}
async function probeCursorTelemetry(document, cursor) {
  if (!cursor?.probe) return void 0;
  const entries = await Promise.all(
    document.assets.map(async (asset) => {
      try {
        return [
          asset.id,
          await cursor.probe({ assetId: asset.id, originalPath: asset.originalPath ?? null })
        ];
      } catch {
        return null;
      }
    })
  );
  const map = {};
  for (const entry of entries) {
    if (entry) map[entry[0]] = entry[1];
  }
  return map;
}
const SILENT_TOOL_EVENTS = /* @__PURE__ */ new Set(["on_tool_start", "on_tool_end"]);
async function invokeDriftAgent(args) {
  const { document, model, history, userMessage, sink } = args;
  const editsAllowed = args.editsAllowed !== false;
  const holder = { current: document };
  const initialDocumentJSON = JSON.stringify(document);
  const chatModel = await createDriftChatModel(model);
  const availableByAssetId = await probeCursorTelemetry(document, args.cursor);
  const tools = buildTools(holder, sink, editsAllowed, {
    cursor: args.cursor,
    availableByAssetId
  });
  const agent = createAgent({
    model: chatModel,
    tools,
    systemPrompt: buildSystemPrompt({ editsAllowed }),
    middleware: anthropicCachingMiddleware(chatModel)
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
  });
  const messages = [...history, { role: "user", content: userMessage }];
  let chatModelChunks = [];
  try {
    const stream = agent.streamEvents({ messages }, void 0);
    let finalText = "";
    const nonChatEvents = [];
    for await (const event of stream) {
      const eventType = typeof event.event === "string" ? event.event : "";
      const data = event.data;
      const name = typeof event.name === "string" ? event.name : "";
      if (eventType === "on_chat_model_stream") {
        const chunk = data?.chunk;
        if (chunk) chatModelChunks.push(chunk);
        const content = chunk?.content;
        const thinkingDelta = messageContentToThinking(content);
        if (thinkingDelta) {
          sink.thinking(thinkingDelta);
        }
        const delta = messageContentToText(content);
        if (delta) {
          sink.text(delta);
          finalText += delta;
        }
      } else if (eventType === "on_tool_error") {
        sink.toolEnd(name, false, extractError(data));
      } else if (eventType && !SILENT_TOOL_EVENTS.has(eventType)) {
        nonChatEvents.push({ event: eventType, name });
      }
    }
    const mutated = JSON.stringify(holder.current) !== initialDocumentJSON;
    if (!finalText.trim()) {
      const lastChunk = chatModelChunks[chatModelChunks.length - 1];
      const sample = lastChunk ? JSON.stringify(lastChunk).slice(0, 1024) : "(no on_chat_model_stream events)";
      const reason = `Empty response from model (provider=${model.provider}, model=${model.model}, chat_model_chunks=${chatModelChunks.length}, other_events=${nonChatEvents.length}:${nonChatEvents.slice(0, 5).map((e) => e.event).join(",")}). Last chunk: ${sample}`;
      sink.error(reason);
      return { text: "", document: holder.current, mutated, reason };
    }
    return { text: finalText.trim(), document: holder.current, mutated };
  } catch (err) {
    const e = err instanceof Error ? err : new Error(String(err));
    const stackHead = (e.stack ?? "").split("\n").slice(0, 3).join(" | ");
    const reason = `Empty response from model (provider=${model.provider}, model=${model.model}, error=${e.name}: ${e.message}` + (stackHead ? ` stack=${stackHead}` : "") + `). Last chunk: ${(chatModelChunks[chatModelChunks.length - 1] ? JSON.stringify(chatModelChunks[chatModelChunks.length - 1]) : "(no on_chat_model_stream events)").slice(0, 1024)}`;
    sink.error(reason);
    return {
      text: "",
      document: holder.current,
      mutated: JSON.stringify(holder.current) !== initialDocumentJSON,
      reason
    };
  }
}
function extractError(data) {
  if (!data) return void 0;
  const error = data.error;
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return void 0;
}
export {
  TOOL_DESCRIPTIONS,
  anthropicCachingMiddleware,
  buildSystemPrompt,
  buildTools,
  invokeDriftAgent,
  isMutatingTool
};
