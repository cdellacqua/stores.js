[**universal-stores**](../README.md)

***

[universal-stores](../README.md) / DerivedStoreConfig

# Type Alias: DerivedStoreConfig\<T\>

> **DerivedStoreConfig**\<`T`\> = `object`

Defined in: [stores.js/src/lib/composition.ts:18](https://github.com/cdellacqua/stores.js/blob/main/src/lib/composition.ts#L18)

Configurations for derived stores.

## Type Parameters

### T

`T`

## Properties

### comparator?

> `optional` **comparator?**: [`EqualityComparator`](EqualityComparator.md)\<`T`\>

Defined in: [stores.js/src/lib/composition.ts:23](https://github.com/cdellacqua/stores.js/blob/main/src/lib/composition.ts#L23)

(optional, defaults to `(a, b) => a === b`) a function that's used to determine if the current value of the store value is different from
the one being set and thus if the store needs to be updated and the subscribers notified.
