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

- [cause](NestedEffectError.md#cause)
- [message](NestedEffectError.md#message)
- [name](NestedEffectError.md#name)
- [stack](NestedEffectError.md#stack)

## Constructors

### constructor

• **new NestedEffectError**()

#### Overrides

Error.constructor

#### Defined in

[stores.js/src/lib/effect.ts:72](https://github.com/cdellacqua/stores.js/blob/main/src/lib/effect.ts#L72)

## Properties

### cause

• `Optional` **cause**: `unknown`

#### Inherited from

Error.cause

#### Defined in

stores.js/node_modules/typescript/lib/lib.es2022.error.d.ts:26

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
