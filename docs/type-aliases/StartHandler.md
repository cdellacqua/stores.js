[**universal-stores**](../README.md)

***

[universal-stores](../README.md) / StartHandler

# Type Alias: StartHandler\<T\>

> **StartHandler**\<`T`\> = (`set`) => [`StopHandler`](StopHandler.md) \| `void`

Defined in: [stores.js/src/lib/store.ts:31](https://github.com/cdellacqua/stores.js/blob/main/src/lib/store.ts#L31)

A function that gets called once a store gets at least one subscriber. Used in [Store](Store.md)

## Type Parameters

### T

`T`

## Parameters

### set

[`Setter`](Setter.md)\<`T`\>

## Returns

[`StopHandler`](StopHandler.md) \| `void`
