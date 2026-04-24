[**universal-stores**](../README.md)

***

[universal-stores](../README.md) / StoreConfig

# Type Alias: StoreConfig\<T\>

> **StoreConfig**\<`T`\> = `object`

Defined in: [stores.js/src/lib/store.ts:104](https://github.com/cdellacqua/stores.js/blob/main/src/lib/store.ts#L104)

Configurations for Store<T> and ReadonlyStore<T>.

## Type Parameters

### T

`T`

## Properties

### comparator?

> `optional` **comparator?**: [`EqualityComparator`](EqualityComparator.md)\<`T`\>

Defined in: [stores.js/src/lib/store.ts:111](https://github.com/cdellacqua/stores.js/blob/main/src/lib/store.ts#L111)

(optional, defaults to `(a, b) => a === b`) a function that's used to determine if the current value of the store value is different from
the one being set and thus if the store needs to be updated and the subscribers notified.

***

### start?

> `optional` **start?**: [`StartHandler`](StartHandler.md)\<`T`\>

Defined in: [stores.js/src/lib/store.ts:106](https://github.com/cdellacqua/stores.js/blob/main/src/lib/store.ts#L106)

(optional) a [StartHandler](StartHandler.md) that will get called once there is at least one subscriber to this store.
