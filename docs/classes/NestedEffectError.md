[universal-stores](../README.md) / NestedEffectError

# Class: NestedEffectError

Error thrown if makeEffect is called inside an effect.

## Hierarchy

- `Error`

  ↳ **`NestedEffectError`**

## Table of contents

### Constructors

- [constructor](NestedEffectError.md#constructor)

### Properties

- [message](NestedEffectError.md#message)
- [name](NestedEffectError.md#name)
- [stack](NestedEffectError.md#stack)
- [prepareStackTrace](NestedEffectError.md#preparestacktrace)
- [stackTraceLimit](NestedEffectError.md#stacktracelimit)

### Methods

- [captureStackTrace](NestedEffectError.md#capturestacktrace)

## Constructors

### constructor

• **new NestedEffectError**()

#### Overrides

Error.constructor

#### Defined in

[src/lib/effect.ts:72](https://github.com/cdellacqua/stores.js/blob/main/src/lib/effect.ts#L72)

## Properties

### message

• **message**: `string`

#### Inherited from

Error.message

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1023

___

### name

• **name**: `string`

#### Inherited from

Error.name

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1022

___

### stack

• `Optional` **stack**: `string`

#### Inherited from

Error.stack

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1024

___

### prepareStackTrace

▪ `Static` `Optional` **prepareStackTrace**: (`err`: `Error`, `stackTraces`: `CallSite`[]) => `any`

#### Type declaration

▸ (`err`, `stackTraces`): `any`

Optional override for formatting stack traces

**`see`** https://v8.dev/docs/stack-trace-api#customizing-stack-traces

##### Parameters

| Name | Type |
| :------ | :------ |
| `err` | `Error` |
| `stackTraces` | `CallSite`[] |

##### Returns

`any`

#### Inherited from

Error.prepareStackTrace

#### Defined in

node_modules/@types/node/globals.d.ts:11

___

### stackTraceLimit

▪ `Static` **stackTraceLimit**: `number`

#### Inherited from

Error.stackTraceLimit

#### Defined in

node_modules/@types/node/globals.d.ts:13

## Methods

### captureStackTrace

▸ `Static` **captureStackTrace**(`targetObject`, `constructorOpt?`): `void`

Create .stack property on a target object

#### Parameters

| Name | Type |
| :------ | :------ |
| `targetObject` | `object` |
| `constructorOpt?` | `Function` |

#### Returns

`void`

#### Inherited from

Error.captureStackTrace

#### Defined in

node_modules/@types/node/globals.d.ts:4
