[**universal-stores**](../README.md)

***

[universal-stores](../README.md) / ReactiveRoot

# Type Alias: ReactiveRoot

> **ReactiveRoot** = `object`

Defined in: [stores.js/src/lib/effect.ts:82](https://github.com/cdellacqua/stores.js/blob/main/src/lib/effect.ts#L82)

A reactive root provides a scope for all the effect it contains.
This scope can then be destroyed (and all the effect cleaned up) by calling
the dispose method.

## Methods

### dispose()

> **dispose**(): `void`

Defined in: [stores.js/src/lib/effect.ts:95](https://github.com/cdellacqua/stores.js/blob/main/src/lib/effect.ts#L95)

Call all the cleanup functions registered by all the effects in this reactive root.

#### Returns

`void`

***

### makeEffect()

> **makeEffect**(`fn`): `void`

Defined in: [stores.js/src/lib/effect.ts:91](https://github.com/cdellacqua/stores.js/blob/main/src/lib/effect.ts#L91)

Create an effect.

NOTE: makeEffect calls cannot be nested.

#### Parameters

##### fn

() => `void` \| (() => `void`)

A function that watches one or more stores and reacts to their changes. The function can optionally return
a cleanup procedure that will run before the next effect takes place.

#### Returns

`void`
