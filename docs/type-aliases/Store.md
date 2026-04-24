[**universal-stores**](../README.md)

***

[universal-stores](../README.md) / Store

# Type Alias: Store\<T\>

> **Store**\<`T`\> = [`ReadonlyStore`](ReadonlyStore.md)\<`T`\> & `object`

Defined in: [stores.js/src/lib/store.ts:87](https://github.com/cdellacqua/stores.js/blob/main/src/lib/store.ts#L87)

A store that can have subscribers and emit values to them. It also
provides the current value upon subscription.

## Type Declaration

### set()

> **set**(`v`): `void`

Set a value and send it to all subscribers.

#### Parameters

##### v

`T`

the new value of this store.

#### Returns

`void`

### update()

> **update**(`updater`): `void`

Set the new value of the store through an updater function that takes the current one as an argument
and send the returned value to all subscribers.

#### Parameters

##### updater

[`Updater`](Updater.md)\<`T`\>

the update function that will receive the current value and return the new one.

#### Returns

`void`

## Type Parameters

### T

`T`
