[**universal-stores**](../README.md)

***

[universal-stores](../README.md) / makeDerivedStore

# Function: makeDerivedStore()

## Call Signature

> **makeDerivedStore**\<`TIn`, `TOut`\>(`readonlyStore`, `map`, `config?`): [`ReadonlyStore`](../type-aliases/ReadonlyStore.md)\<`TOut`\>

Defined in: [stores.js/src/lib/composition.ts:41](https://github.com/cdellacqua/stores.js/blob/main/src/lib/composition.ts#L41)

Create a derived store.

Example usage:
```ts
const source$ = makeStore(10);
const derived$ = makeDerivedStore(source$, (v) => v * 2);
source$.subscribe((v) => console.log(v)); // prints 10
derived$.subscribe((v) => console.log(v)); // prints 20
source$.set(16); // triggers both console.logs, printing 16 and 32
```

### Type Parameters

#### TIn

`TIn`

#### TOut

`TOut`

### Parameters

#### readonlyStore

[`ReadonlyStore`](../type-aliases/ReadonlyStore.md)\<`TIn`\>

a store or readonly store.

#### map

(`value`) => `TOut`

a function that takes the current value of the source store and maps it to another value.

#### config?

[`DerivedStoreConfig`](../type-aliases/DerivedStoreConfig.md)\<`TOut`\>

a [DerivedStoreConfig](../type-aliases/DerivedStoreConfig.md) which contains configuration information such as a value comparator to avoid needless notifications to subscribers.

### Returns

[`ReadonlyStore`](../type-aliases/ReadonlyStore.md)\<`TOut`\>

## Call Signature

> **makeDerivedStore**\<`TIn`, `TOut`\>(`readonlyStores`, `map`, `config?`): [`ReadonlyStore`](../type-aliases/ReadonlyStore.md)\<`TOut`\>

Defined in: [stores.js/src/lib/composition.ts:65](https://github.com/cdellacqua/stores.js/blob/main/src/lib/composition.ts#L65)

Create a derived store from multiple sources.

Example usage:
```ts
const source1$ = makeStore(10);
const source2$ = makeStore(-10);
const derived$ = makeDerivedStore([source1$, source2$], ([v1, v2]) => v1 + v2);
source1$.subscribe((v) => console.log(v)); // prints 10
source2$.subscribe((v) => console.log(v)); // prints -10
derived$.subscribe((v) => console.log(v)); // prints 0
source1$.set(11); // prints 11 (first console.log) and 1 (third console.log)
source2$.set(9); // prints 9 (second console.log) and 20 (third console.log)
```

### Type Parameters

#### TIn

`TIn` *extends* `unknown`[] \| \[`unknown`, `...unknown[]`\]

#### TOut

`TOut`

### Parameters

#### readonlyStores

\{ \[K in string \| number \| symbol\]: ReadonlyStore\<TIn\[K\]\> \}

an array of stores or readonly stores.

#### map

(`value`) => `TOut`

a function that takes the current value of all the source stores and maps it to another value.

#### config?

[`DerivedStoreConfig`](../type-aliases/DerivedStoreConfig.md)\<`TOut`\>

a [DerivedStoreConfig](../type-aliases/DerivedStoreConfig.md) which contains configuration information such as a value comparator to avoid needless notifications to subscribers.

### Returns

[`ReadonlyStore`](../type-aliases/ReadonlyStore.md)\<`TOut`\>

## Call Signature

> **makeDerivedStore**\<`TIn`, `TOut`\>(`readonlyStores`, `map`, `config?`): [`ReadonlyStore`](../type-aliases/ReadonlyStore.md)\<`TOut`\>

Defined in: [stores.js/src/lib/composition.ts:89](https://github.com/cdellacqua/stores.js/blob/main/src/lib/composition.ts#L89)

Create a derived store from multiple sources.

Example usage:
```ts
const source1$ = makeStore(10);
const source2$ = makeStore(-10);
const derived$ = makeDerivedStore({v1: source1$, v2: source2$}, ({v1, v2}) => v1 + v2);
source1$.subscribe((v) => console.log(v)); // prints 10
source2$.subscribe((v) => console.log(v)); // prints -10
derived$.subscribe((v) => console.log(v)); // prints 0
source1$.set(11); // prints 11 (first console.log) and 1 (third console.log)
source2$.set(9); // prints 9 (second console.log) and 20 (third console.log)
```

### Type Parameters

#### TIn

`TIn`

#### TOut

`TOut`

### Parameters

#### readonlyStores

\{ \[K in string \| number \| symbol\]: ReadonlyStore\<TIn\[K\]\> \}

an array of stores or readonly stores.

#### map

(`value`) => `TOut`

a function that takes the current value of all the source stores and maps it to another value.

#### config?

[`DerivedStoreConfig`](../type-aliases/DerivedStoreConfig.md)\<`TOut`\>

a [DerivedStoreConfig](../type-aliases/DerivedStoreConfig.md) which contains configuration information such as a value comparator to avoid needless notifications to subscribers.

### Returns

[`ReadonlyStore`](../type-aliases/ReadonlyStore.md)\<`TOut`\>
