[universal-stores](../README.md) / ReactiveRootDisposeError

# Class: ReactiveRootDisposeError

Error thrown if one or more cleanup functions registered by the effects inside a reactive
root raised an exception.

## Hierarchy

- `Error`

  ↳ **`ReactiveRootDisposeError`**

## Table of contents

### Constructors

- [constructor](ReactiveRootDisposeError.md#constructor)

### Properties

- [errors](ReactiveRootDisposeError.md#errors)
- [message](ReactiveRootDisposeError.md#message)
- [name](ReactiveRootDisposeError.md#name)
- [stack](ReactiveRootDisposeError.md#stack)
- [prepareStackTrace](ReactiveRootDisposeError.md#preparestacktrace)
- [stackTraceLimit](ReactiveRootDisposeError.md#stacktracelimit)

### Methods

- [captureStackTrace](ReactiveRootDisposeError.md#capturestacktrace)

## Constructors

### constructor

• **new ReactiveRootDisposeError**(`errors`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `errors` | `unknown`[] |

#### Overrides

Error.constructor

#### Defined in

[src/lib/effect.ts:53](https://github.com/cdellacqua/stores.js/blob/main/src/lib/effect.ts#L53)

## Properties

### errors

• **errors**: `unknown`[]

___

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
