[**universal-stores**](../README.md)

***

[universal-stores](../README.md) / makeStore

# Function: makeStore()

Make a store of type T.

Example usage:
```ts
const store$ = makeStore(0);
console.log(store$.content()); // 0
store$.subscribe((v) => console.log(v));
store$.set(10); // will trigger the above console log, printing 10
```

## Param

the initial value of the store.

## Param

a [StartHandler](../type-aliases/StartHandler.md) or a [StoreConfig](../type-aliases/StoreConfig.md) which contains configuration information such as a value comparator to avoid needless notifications to subscribers and a [StartHandler](../type-aliases/StartHandler.md).

## Call Signature

> **makeStore**\<`T`\>(`initialValue`, `start?`): [`Store`](../type-aliases/Store.md)\<`T`\>

Defined in: [stores.js/src/lib/store.ts:128](https://github.com/cdellacqua/stores.js/blob/main/src/lib/store.ts#L128)

Make a store of type T.

Example usage:
```ts
const store$ = makeStore(0);
console.log(store$.content()); // 0
store$.subscribe((v) => console.log(v));
store$.set(10); // will trigger the above console log, printing 10
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

[`Store`](../type-aliases/Store.md)\<`T`\>

a Store

## Call Signature

> **makeStore**\<`T`\>(`initialValue`, `config?`): [`Store`](../type-aliases/Store.md)\<`T`\>

Defined in: [stores.js/src/lib/store.ts:144](https://github.com/cdellacqua/stores.js/blob/main/src/lib/store.ts#L144)

Make a store of type T.

Example usage:
```ts
const store$ = makeStore(0);
console.log(store$.content()); // 0
store$.subscribe((v) => console.log(v));
store$.set(10); // will trigger the above console log, printing 10
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

[`Store`](../type-aliases/Store.md)\<`T`\>

a Store

## Call Signature

> **makeStore**\<`T`\>(`initialValue`, `startOrConfig?`): [`Store`](../type-aliases/Store.md)\<`T`\>

Defined in: [stores.js/src/lib/store.ts:160](https://github.com/cdellacqua/stores.js/blob/main/src/lib/store.ts#L160)

Make a store of type T.

Example usage:
```ts
const store$ = makeStore(0);
console.log(store$.content()); // 0
store$.subscribe((v) => console.log(v));
store$.set(10); // will trigger the above console log, printing 10
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

[`Store`](../type-aliases/Store.md)\<`T`\>

a Store
