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

- [cause](ReactiveRootDisposeError.md#cause)
- [errors](ReactiveRootDisposeError.md#errors)
- [message](ReactiveRootDisposeError.md#message)
- [name](ReactiveRootDisposeError.md#name)
- [stack](ReactiveRootDisposeError.md#stack)

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

[stores.js/src/lib/effect.ts:53](https://github.com/cdellacqua/stores.js/blob/main/src/lib/effect.ts#L53)

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
