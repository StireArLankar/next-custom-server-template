/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";

export const protobufPackage = "domain";

/**
 * Represents fixed point number with 10^-9 precision.
 * https://docs.microsoft.com/dotnet/architecture/grpc-for-wcf-developers/protobuf-data-types
 * Example: 12345.6789 -> { units = 12345, nanos = 678900000 }
 */
export interface DecimalNano {
  /** Whole units part of the amount */
  units: number;
  /**
   * Nano units of the amount (10^-9)
   * The value must be between -999,999,999 and +999,999,999 inclusive.
   * Must be same sign as units
   * If `units` is positive, `nanos` must be positive or zero.
   * If `units` is zero, `nanos` can be positive, zero, or negative.
   * If `units` is negative, `nanos` must be negative or zero.
   */
  nanos: number;
}

function createBaseDecimalNano(): DecimalNano {
  return { units: 0, nanos: 0 };
}

export const DecimalNano = {
  encode(message: DecimalNano, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.units !== 0) {
      writer.uint32(8).int64(message.units);
    }
    if (message.nanos !== 0) {
      writer.uint32(21).sfixed32(message.nanos);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DecimalNano {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDecimalNano();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.units = longToNumber(reader.int64() as Long);
          break;
        case 2:
          message.nanos = reader.sfixed32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): DecimalNano {
    return {
      units: isSet(object.units) ? Number(object.units) : 0,
      nanos: isSet(object.nanos) ? Number(object.nanos) : 0,
    };
  },

  toJSON(message: DecimalNano): unknown {
    const obj: any = {};
    message.units !== undefined && (obj.units = Math.round(message.units));
    message.nanos !== undefined && (obj.nanos = Math.round(message.nanos));
    return obj;
  },

  create<I extends Exact<DeepPartial<DecimalNano>, I>>(base?: I): DecimalNano {
    return DecimalNano.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<DecimalNano>, I>>(object: I): DecimalNano {
    const message = createBaseDecimalNano();
    message.units = object.units ?? 0;
    message.nanos = object.nanos ?? 0;
    return message;
  },
};

declare var self: any | undefined;
declare var window: any | undefined;
declare var global: any | undefined;
var tsProtoGlobalThis: any = (() => {
  if (typeof globalThis !== "undefined") {
    return globalThis;
  }
  if (typeof self !== "undefined") {
    return self;
  }
  if (typeof window !== "undefined") {
    return window;
  }
  if (typeof global !== "undefined") {
    return global;
  }
  throw "Unable to locate global object";
})();

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends { $case: string } ? { [K in keyof Omit<T, "$case">]?: DeepPartial<T[K]> } & { $case: T["$case"] }
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function longToNumber(long: Long): number {
  if (long.gt(Number.MAX_SAFE_INTEGER)) {
    throw new tsProtoGlobalThis.Error("Value is larger than Number.MAX_SAFE_INTEGER");
  }
  return long.toNumber();
}

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
