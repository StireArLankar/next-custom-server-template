/* eslint-disable */
import type { CallContext, CallOptions } from "nice-grpc-common";
import _m0 from "protobufjs/minimal";
import { Timestamp } from "../../google/protobuf/timestamp";
import { StringValue } from "../../google/protobuf/wrappers";
import { DecimalNano } from "../decimalnano";

export const protobufPackage = "domain.example";

export const FailReason = {
  FAIL_REASON_OTHER: "FAIL_REASON_OTHER",
  FAIL_REASON_EXPIRED: "FAIL_REASON_EXPIRED",
  FAIL_REASON_INTERNAL_ERROR: "FAIL_REASON_INTERNAL_ERROR",
  UNRECOGNIZED: "UNRECOGNIZED",
} as const;

export type FailReason = typeof FailReason[keyof typeof FailReason];

export function failReasonFromJSON(object: any): FailReason {
  switch (object) {
    case 0:
    case "FAIL_REASON_OTHER":
      return FailReason.FAIL_REASON_OTHER;
    case 1:
    case "FAIL_REASON_EXPIRED":
      return FailReason.FAIL_REASON_EXPIRED;
    case 2:
    case "FAIL_REASON_INTERNAL_ERROR":
      return FailReason.FAIL_REASON_INTERNAL_ERROR;
    case -1:
    case "UNRECOGNIZED":
    default:
      return FailReason.UNRECOGNIZED;
  }
}

export function failReasonToJSON(object: FailReason): string {
  switch (object) {
    case FailReason.FAIL_REASON_OTHER:
      return "FAIL_REASON_OTHER";
    case FailReason.FAIL_REASON_EXPIRED:
      return "FAIL_REASON_EXPIRED";
    case FailReason.FAIL_REASON_INTERNAL_ERROR:
      return "FAIL_REASON_INTERNAL_ERROR";
    case FailReason.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export function failReasonToNumber(object: FailReason): number {
  switch (object) {
    case FailReason.FAIL_REASON_OTHER:
      return 0;
    case FailReason.FAIL_REASON_EXPIRED:
      return 1;
    case FailReason.FAIL_REASON_INTERNAL_ERROR:
      return 2;
    case FailReason.UNRECOGNIZED:
    default:
      return -1;
  }
}

export interface State {
  /** deposit UUID on card service side */
  id: string;
  /** increments after each update */
  version: number;
  description: string | undefined;
  createdAt: Date | undefined;
  updatedAt: Date | undefined;
  amount: DecimalNano | undefined;
  status?: { $case: "inProgress"; inProgress: State_InProgress } | { $case: "success"; success: State_Success } | {
    $case: "fail";
    fail: State_Fail;
  };
}

export interface State_Success {
}

export interface State_InProgress {
}

export interface State_Fail {
  failReason: FailReason[];
  failDetails: string;
}

export interface ReadEventsRequest {
}

export interface GetStateByIdRequest {
  id: string;
}

export interface GetStateByIdResponse {
  result?: { $case: "succeed"; succeed: GetStateByIdResponse_Found } | {
    $case: "notFound";
    notFound: GetStateByIdResponse_NotFound;
  };
}

export interface GetStateByIdResponse_Found {
  state: State | undefined;
}

export interface GetStateByIdResponse_NotFound {
}

function createBaseState(): State {
  return {
    id: "",
    version: 0,
    description: undefined,
    createdAt: undefined,
    updatedAt: undefined,
    amount: undefined,
    status: undefined,
  };
}

export const State = {
  encode(message: State, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.version !== 0) {
      writer.uint32(16).int32(message.version);
    }
    if (message.description !== undefined) {
      StringValue.encode({ value: message.description! }, writer.uint32(26).fork()).ldelim();
    }
    if (message.createdAt !== undefined) {
      Timestamp.encode(toTimestamp(message.createdAt), writer.uint32(34).fork()).ldelim();
    }
    if (message.updatedAt !== undefined) {
      Timestamp.encode(toTimestamp(message.updatedAt), writer.uint32(42).fork()).ldelim();
    }
    if (message.amount !== undefined) {
      DecimalNano.encode(message.amount, writer.uint32(50).fork()).ldelim();
    }
    if (message.status?.$case === "inProgress") {
      State_InProgress.encode(message.status.inProgress, writer.uint32(58).fork()).ldelim();
    }
    if (message.status?.$case === "success") {
      State_Success.encode(message.status.success, writer.uint32(66).fork()).ldelim();
    }
    if (message.status?.$case === "fail") {
      State_Fail.encode(message.status.fail, writer.uint32(74).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): State {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseState();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.version = reader.int32();
          break;
        case 3:
          message.description = StringValue.decode(reader, reader.uint32()).value;
          break;
        case 4:
          message.createdAt = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          break;
        case 5:
          message.updatedAt = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          break;
        case 6:
          message.amount = DecimalNano.decode(reader, reader.uint32());
          break;
        case 7:
          message.status = { $case: "inProgress", inProgress: State_InProgress.decode(reader, reader.uint32()) };
          break;
        case 8:
          message.status = { $case: "success", success: State_Success.decode(reader, reader.uint32()) };
          break;
        case 9:
          message.status = { $case: "fail", fail: State_Fail.decode(reader, reader.uint32()) };
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): State {
    return {
      id: isSet(object.id) ? String(object.id) : "",
      version: isSet(object.version) ? Number(object.version) : 0,
      description: isSet(object.description) ? String(object.description) : undefined,
      createdAt: isSet(object.createdAt) ? fromJsonTimestamp(object.createdAt) : undefined,
      updatedAt: isSet(object.updatedAt) ? fromJsonTimestamp(object.updatedAt) : undefined,
      amount: isSet(object.amount) ? DecimalNano.fromJSON(object.amount) : undefined,
      status: isSet(object.inProgress)
        ? { $case: "inProgress", inProgress: State_InProgress.fromJSON(object.inProgress) }
        : isSet(object.success)
        ? { $case: "success", success: State_Success.fromJSON(object.success) }
        : isSet(object.fail)
        ? { $case: "fail", fail: State_Fail.fromJSON(object.fail) }
        : undefined,
    };
  },

  toJSON(message: State): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.version !== undefined && (obj.version = Math.round(message.version));
    message.description !== undefined && (obj.description = message.description);
    message.createdAt !== undefined && (obj.createdAt = message.createdAt.toISOString());
    message.updatedAt !== undefined && (obj.updatedAt = message.updatedAt.toISOString());
    message.amount !== undefined && (obj.amount = message.amount ? DecimalNano.toJSON(message.amount) : undefined);
    message.status?.$case === "inProgress" &&
      (obj.inProgress = message.status?.inProgress ? State_InProgress.toJSON(message.status?.inProgress) : undefined);
    message.status?.$case === "success" &&
      (obj.success = message.status?.success ? State_Success.toJSON(message.status?.success) : undefined);
    message.status?.$case === "fail" &&
      (obj.fail = message.status?.fail ? State_Fail.toJSON(message.status?.fail) : undefined);
    return obj;
  },

  create<I extends Exact<DeepPartial<State>, I>>(base?: I): State {
    return State.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<State>, I>>(object: I): State {
    const message = createBaseState();
    message.id = object.id ?? "";
    message.version = object.version ?? 0;
    message.description = object.description ?? undefined;
    message.createdAt = object.createdAt ?? undefined;
    message.updatedAt = object.updatedAt ?? undefined;
    message.amount = (object.amount !== undefined && object.amount !== null)
      ? DecimalNano.fromPartial(object.amount)
      : undefined;
    if (
      object.status?.$case === "inProgress" &&
      object.status?.inProgress !== undefined &&
      object.status?.inProgress !== null
    ) {
      message.status = { $case: "inProgress", inProgress: State_InProgress.fromPartial(object.status.inProgress) };
    }
    if (object.status?.$case === "success" && object.status?.success !== undefined && object.status?.success !== null) {
      message.status = { $case: "success", success: State_Success.fromPartial(object.status.success) };
    }
    if (object.status?.$case === "fail" && object.status?.fail !== undefined && object.status?.fail !== null) {
      message.status = { $case: "fail", fail: State_Fail.fromPartial(object.status.fail) };
    }
    return message;
  },
};

function createBaseState_Success(): State_Success {
  return {};
}

export const State_Success = {
  encode(_: State_Success, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): State_Success {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseState_Success();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): State_Success {
    return {};
  },

  toJSON(_: State_Success): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<State_Success>, I>>(base?: I): State_Success {
    return State_Success.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<State_Success>, I>>(_: I): State_Success {
    const message = createBaseState_Success();
    return message;
  },
};

function createBaseState_InProgress(): State_InProgress {
  return {};
}

export const State_InProgress = {
  encode(_: State_InProgress, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): State_InProgress {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseState_InProgress();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): State_InProgress {
    return {};
  },

  toJSON(_: State_InProgress): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<State_InProgress>, I>>(base?: I): State_InProgress {
    return State_InProgress.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<State_InProgress>, I>>(_: I): State_InProgress {
    const message = createBaseState_InProgress();
    return message;
  },
};

function createBaseState_Fail(): State_Fail {
  return { failReason: [], failDetails: "" };
}

export const State_Fail = {
  encode(message: State_Fail, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    writer.uint32(10).fork();
    for (const v of message.failReason) {
      writer.int32(failReasonToNumber(v));
    }
    writer.ldelim();
    if (message.failDetails !== "") {
      writer.uint32(18).string(message.failDetails);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): State_Fail {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseState_Fail();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if ((tag & 7) === 2) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.failReason.push(failReasonFromJSON(reader.int32()));
            }
          } else {
            message.failReason.push(failReasonFromJSON(reader.int32()));
          }
          break;
        case 2:
          message.failDetails = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): State_Fail {
    return {
      failReason: Array.isArray(object?.failReason) ? object.failReason.map((e: any) => failReasonFromJSON(e)) : [],
      failDetails: isSet(object.failDetails) ? String(object.failDetails) : "",
    };
  },

  toJSON(message: State_Fail): unknown {
    const obj: any = {};
    if (message.failReason) {
      obj.failReason = message.failReason.map((e) => failReasonToJSON(e));
    } else {
      obj.failReason = [];
    }
    message.failDetails !== undefined && (obj.failDetails = message.failDetails);
    return obj;
  },

  create<I extends Exact<DeepPartial<State_Fail>, I>>(base?: I): State_Fail {
    return State_Fail.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<State_Fail>, I>>(object: I): State_Fail {
    const message = createBaseState_Fail();
    message.failReason = object.failReason?.map((e) => e) || [];
    message.failDetails = object.failDetails ?? "";
    return message;
  },
};

function createBaseReadEventsRequest(): ReadEventsRequest {
  return {};
}

export const ReadEventsRequest = {
  encode(_: ReadEventsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ReadEventsRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseReadEventsRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): ReadEventsRequest {
    return {};
  },

  toJSON(_: ReadEventsRequest): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<ReadEventsRequest>, I>>(base?: I): ReadEventsRequest {
    return ReadEventsRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<ReadEventsRequest>, I>>(_: I): ReadEventsRequest {
    const message = createBaseReadEventsRequest();
    return message;
  },
};

function createBaseGetStateByIdRequest(): GetStateByIdRequest {
  return { id: "" };
}

export const GetStateByIdRequest = {
  encode(message: GetStateByIdRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetStateByIdRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetStateByIdRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetStateByIdRequest {
    return { id: isSet(object.id) ? String(object.id) : "" };
  },

  toJSON(message: GetStateByIdRequest): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetStateByIdRequest>, I>>(base?: I): GetStateByIdRequest {
    return GetStateByIdRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetStateByIdRequest>, I>>(object: I): GetStateByIdRequest {
    const message = createBaseGetStateByIdRequest();
    message.id = object.id ?? "";
    return message;
  },
};

function createBaseGetStateByIdResponse(): GetStateByIdResponse {
  return { result: undefined };
}

export const GetStateByIdResponse = {
  encode(message: GetStateByIdResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.result?.$case === "succeed") {
      GetStateByIdResponse_Found.encode(message.result.succeed, writer.uint32(10).fork()).ldelim();
    }
    if (message.result?.$case === "notFound") {
      GetStateByIdResponse_NotFound.encode(message.result.notFound, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetStateByIdResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetStateByIdResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.result = { $case: "succeed", succeed: GetStateByIdResponse_Found.decode(reader, reader.uint32()) };
          break;
        case 2:
          message.result = {
            $case: "notFound",
            notFound: GetStateByIdResponse_NotFound.decode(reader, reader.uint32()),
          };
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetStateByIdResponse {
    return {
      result: isSet(object.succeed)
        ? { $case: "succeed", succeed: GetStateByIdResponse_Found.fromJSON(object.succeed) }
        : isSet(object.notFound)
        ? { $case: "notFound", notFound: GetStateByIdResponse_NotFound.fromJSON(object.notFound) }
        : undefined,
    };
  },

  toJSON(message: GetStateByIdResponse): unknown {
    const obj: any = {};
    message.result?.$case === "succeed" &&
      (obj.succeed = message.result?.succeed ? GetStateByIdResponse_Found.toJSON(message.result?.succeed) : undefined);
    message.result?.$case === "notFound" && (obj.notFound = message.result?.notFound
      ? GetStateByIdResponse_NotFound.toJSON(message.result?.notFound)
      : undefined);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetStateByIdResponse>, I>>(base?: I): GetStateByIdResponse {
    return GetStateByIdResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetStateByIdResponse>, I>>(object: I): GetStateByIdResponse {
    const message = createBaseGetStateByIdResponse();
    if (object.result?.$case === "succeed" && object.result?.succeed !== undefined && object.result?.succeed !== null) {
      message.result = { $case: "succeed", succeed: GetStateByIdResponse_Found.fromPartial(object.result.succeed) };
    }
    if (
      object.result?.$case === "notFound" && object.result?.notFound !== undefined && object.result?.notFound !== null
    ) {
      message.result = {
        $case: "notFound",
        notFound: GetStateByIdResponse_NotFound.fromPartial(object.result.notFound),
      };
    }
    return message;
  },
};

function createBaseGetStateByIdResponse_Found(): GetStateByIdResponse_Found {
  return { state: undefined };
}

export const GetStateByIdResponse_Found = {
  encode(message: GetStateByIdResponse_Found, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.state !== undefined) {
      State.encode(message.state, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetStateByIdResponse_Found {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetStateByIdResponse_Found();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.state = State.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetStateByIdResponse_Found {
    return { state: isSet(object.state) ? State.fromJSON(object.state) : undefined };
  },

  toJSON(message: GetStateByIdResponse_Found): unknown {
    const obj: any = {};
    message.state !== undefined && (obj.state = message.state ? State.toJSON(message.state) : undefined);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetStateByIdResponse_Found>, I>>(base?: I): GetStateByIdResponse_Found {
    return GetStateByIdResponse_Found.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetStateByIdResponse_Found>, I>>(object: I): GetStateByIdResponse_Found {
    const message = createBaseGetStateByIdResponse_Found();
    message.state = (object.state !== undefined && object.state !== null) ? State.fromPartial(object.state) : undefined;
    return message;
  },
};

function createBaseGetStateByIdResponse_NotFound(): GetStateByIdResponse_NotFound {
  return {};
}

export const GetStateByIdResponse_NotFound = {
  encode(_: GetStateByIdResponse_NotFound, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetStateByIdResponse_NotFound {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetStateByIdResponse_NotFound();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): GetStateByIdResponse_NotFound {
    return {};
  },

  toJSON(_: GetStateByIdResponse_NotFound): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<GetStateByIdResponse_NotFound>, I>>(base?: I): GetStateByIdResponse_NotFound {
    return GetStateByIdResponse_NotFound.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetStateByIdResponse_NotFound>, I>>(_: I): GetStateByIdResponse_NotFound {
    const message = createBaseGetStateByIdResponse_NotFound();
    return message;
  },
};

export type TestServiceDefinition = typeof TestServiceDefinition;
export const TestServiceDefinition = {
  name: "TestService",
  fullName: "domain.example.TestService",
  methods: {
    readEvents: {
      name: "ReadEvents",
      requestType: ReadEventsRequest,
      requestStream: false,
      responseType: State,
      responseStream: true,
      options: {},
    },
    getStateById: {
      name: "GetStateById",
      requestType: GetStateByIdRequest,
      requestStream: false,
      responseType: GetStateByIdResponse,
      responseStream: false,
      options: {},
    },
  },
} as const;

export interface TestServiceImplementation<CallContextExt = {}> {
  readEvents(
    request: ReadEventsRequest,
    context: CallContext & CallContextExt,
  ): ServerStreamingMethodResult<DeepPartial<State>>;
  getStateById(
    request: GetStateByIdRequest,
    context: CallContext & CallContextExt,
  ): Promise<DeepPartial<GetStateByIdResponse>>;
}

export interface TestServiceClient<CallOptionsExt = {}> {
  readEvents(request: DeepPartial<ReadEventsRequest>, options?: CallOptions & CallOptionsExt): AsyncIterable<State>;
  getStateById(
    request: DeepPartial<GetStateByIdRequest>,
    options?: CallOptions & CallOptionsExt,
  ): Promise<GetStateByIdResponse>;
}

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends { $case: string } ? { [K in keyof Omit<T, "$case">]?: DeepPartial<T[K]> } & { $case: T["$case"] }
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function toTimestamp(date: Date): Timestamp {
  const seconds = date.getTime() / 1_000;
  const nanos = (date.getTime() % 1_000) * 1_000_000;
  return { seconds, nanos };
}

function fromTimestamp(t: Timestamp): Date {
  let millis = t.seconds * 1_000;
  millis += t.nanos / 1_000_000;
  return new Date(millis);
}

function fromJsonTimestamp(o: any): Date {
  if (o instanceof Date) {
    return o;
  } else if (typeof o === "string") {
    return new Date(o);
  } else {
    return fromTimestamp(Timestamp.fromJSON(o));
  }
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}

export type ServerStreamingMethodResult<Response> = { [Symbol.asyncIterator](): AsyncIterator<Response, void> };
