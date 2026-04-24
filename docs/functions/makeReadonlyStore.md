[**universal-stores**](../README.md)

***

[universal-stores](../README.md) / makeReadonlyStore

# Function: makeReadonlyStore()

## Call Signature

> **makeReadonlyStore**\<`T`\>(`initialValue`, `start?`): [`ReadonlyStore`](../type-aliases/ReadonlyStore.md)\<`T`\>

Defined in: [stores.js/src/lib/store.ts:258](https://github.com/cdellacqua/stores.js/blob/main/src/lib/store.ts#L258)

Make a store of type T.

Example usage:
```ts
let value = 0;
const store$ = makeReadonlyStore(value, (set) => {
	value++;
	set(value);
});
console.log(store$.content()); // 1
store$.subscribe((v) => console.log(v)); // immediately prints 2
console.log(store$.content()); // 2
```

### Type Parameters

#### T

`T`

### Parameters

#### initialValue

`T` \| `undefined`

the initial value of the store.

#### start?

[`StartHandler`](../type-aliases/StartHandler.md)\<`T`\>

a [StartHandler](../type-aliases/StartHandler.md) that will get called once there is at least one subscriber to this store.

### Returns

[`ReadonlyStore`](../type-aliases/ReadonlyStore.md)\<`T`\>

a ReadonlyStore

## Call Signature

> **makeReadonlyStore**\<`T`\>(`initialValue`, `config?`): [`ReadonlyStore`](../type-aliases/ReadonlyStore.md)\<`T`\>

Defined in: [stores.js/src/lib/store.ts:279](https://github.com/cdellacqua/stores.js/blob/main/src/lib/store.ts#L279)

Make a store of type T.

Example usage:
```ts
const store$ = makeReadonlyStore({prop: 'some value'}, {
	comparator: (a, b) => a.prop === b.prop,
	start: (set) => {
		// ...
	},
});
```

### Type Parameters

#### T

`T`

### Parameters

#### initialValue

`T` \| `undefined`

the initial value of the store.

#### config?

[`StoreConfig`](../type-aliases/StoreConfig.md)\<`T`\>

a [StoreConfig](../type-aliases/StoreConfig.md) which contains configuration information such as a value comparator to avoid needless notifications to subscribers and a [StartHandler](../type-aliases/StartHandler.md).

### Returns

[`ReadonlyStore`](../type-aliases/ReadonlyStore.md)\<`T`\>

a ReadonlyStore

## Call Signature

> **makeReadonlyStore**\<`T`\>(`initialValue`, `startOrConfig?`): [`ReadonlyStore`](../type-aliases/ReadonlyStore.md)\<`T`\>

Defined in: [stores.js/src/lib/store.ts:302](https://github.com/cdellacqua/stores.js/blob/main/src/lib/store.ts#L302)

Make a store of type T.

Example usage:
```ts
let value = 0;
const store$ = makeReadonlyStore(value, (set) => {
	value++;
	set(value);
});
console.log(store$.content()); // 1
store$.subscribe((v) => console.log(v)); // immediately prints 2
console.log(store$.content()); // 2
```

### Type Parameters

#### T

`T`

### Parameters

#### initialValue

`T` \| `undefined`

the initial value of the store.

#### startOrConfig?

[`StartHandler`](../type-aliases/StartHandler.md)\<`T`\> \| [`StoreConfig`](../type-aliases/StoreConfig.md)\<`T`\>

a [StartHandler](../type-aliases/StartHandler.md) or a [StoreConfig](../type-aliases/StoreConfig.md) which contains configuration information such as a value comparator to avoid needless notifications to subscribers and a [StartHandler](../type-aliases/StartHandler.md).

### Returns

[`ReadonlyStore`](../type-aliases/ReadonlyStore.md)\<`T`\>

a ReadonlyStore
