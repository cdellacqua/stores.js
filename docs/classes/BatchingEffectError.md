[universal-stores](../README.md) / BatchingEffectError

# Class: BatchingEffectError

Error thrown if one or more effects that were queued during a batchEffects call
raised an exception.

## Hierarchy

- `Error`

  ↳ **`BatchingEffectError`**

## Table of contents

### Constructors

- [constructor](BatchingEffectError.md#constructor)

### Properties

- [cause](BatchingEffectError.md#cause)
- [errors](BatchingEffectError.md#errors)
- [message](BatchingEffectError.md#message)
- [name](BatchingEffectError.md#name)
- [stack](BatchingEffectError.md#stack)

## Constructors

### constructor

• **new BatchingEffectError**(`errors`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `errors` | `unknown`[] |

#### Overrides

Error.constructor

#### Defined in

[stores.js/src/lib/effect.ts:63](https://github.com/cdellacqua/stores.js/blob/main/src/lib/effect.ts#L63)

## Properties

### cause

• `Optional` **cause**: `unknown`

#### Inherited from

Error.cause

#### Defined in

stores.js/node_modules/typescript/lib/lib.es2022.error.d.ts:26

___

### errors

• **errors**: `unknown`[]

___

### message

• **message**: `string`

#### Inherited from

Error.message

#### Defined in

stores.js/node_modules/typescript/lib/lib.es5.d.ts:1054

___

### name

• **name**: `string`

#### Inherited from

Error.name

#### Defined in

stores.js/node_modules/typescript/lib/lib.es5.d.ts:1053

___

### stack

• `Optional` **stack**: `string`

#### Inherited from

Error.stack

#### Defined in

stores.js/node_modules/typescript/lib/lib.es5.d.ts:1055
