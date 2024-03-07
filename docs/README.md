universal-stores

# universal-stores

## Table of contents

### Classes

- [BatchingEffectError](classes/BatchingEffectError.md)
- [MissingEffectError](classes/MissingEffectError.md)
- [NestedEffectError](classes/NestedEffectError.md)
- [ReactiveRootDisposeError](classes/ReactiveRootDisposeError.md)

### Type Aliases

- [DerivedStoreConfig](README.md#derivedstoreconfig)
- [EqualityComparator](README.md#equalitycomparator)
- [Getter](README.md#getter)
- [ReactiveRoot](README.md#reactiveroot)
- [ReadonlyStore](README.md#readonlystore)
- [Setter](README.md#setter)
- [StartHandler](README.md#starthandler)
- [StopHandler](README.md#stophandler)
- [Store](README.md#store)
- [StoreConfig](README.md#storeconfig)
- [Subscriber](README.md#subscriber)
- [Unsubscribe](README.md#unsubscribe)
- [Update](README.md#update)
- [Updater](README.md#updater)

### Functions

- [batchEffects](README.md#batcheffects)
- [makeDerivedStore](README.md#makederivedstore)
- [makeReactiveRoot](README.md#makereactiveroot)
- [makeReadonlyStore](README.md#makereadonlystore)
- [makeStore](README.md#makestore)

## Type Aliases

### DerivedStoreConfig

Ƭ **DerivedStoreConfig**<`T`\>: `Object`

Configurations for derived stores.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `comparator?` | [`EqualityComparator`](README.md#equalitycomparator)<`T`\> | (optional, defaults to `(a, b) => a === b`) a function that's used to determine if the current value of the store value is different from the one being set and thus if the store needs to be updated and the subscribers notified. |

#### Defined in

[src/lib/composition.ts:18](https://github.com/cdellacqua/stores.js/blob/main/src/lib/composition.ts#L18)

___

### EqualityComparator

Ƭ **EqualityComparator**<`T`\>: (`a`: `T`, `b`: `T`) => `boolean`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Type declaration

▸ (`a`, `b`): `boolean`

A comparison function used to optimize subscribers notifications. Used in [Store](README.md#store)

##### Parameters

| Name | Type |
| :------ | :------ |
| `a` | `T` |
| `b` | `T` |

##### Returns

`boolean`

#### Defined in

[src/lib/store.ts:27](https://github.com/cdellacqua/stores.js/blob/main/src/lib/store.ts#L27)

___

### Getter

Ƭ **Getter**<`T`\>: () => `T`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Type declaration

▸ (): `T`

A generic getter function. Used in [Store](README.md#store)

##### Returns

`T`

#### Defined in

[src/lib/store.ts:21](https://github.com/cdellacqua/stores.js/blob/main/src/lib/store.ts#L21)

___

### ReactiveRoot

Ƭ **ReactiveRoot**: `Object`

A reactive root provides a scope for all the effect it contains.
This scope can then be destroyed (and all the effect cleaned up) by calling
the dispose method.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `dispose` | () => `void` |
| `makeEffect` | (`fn`: () => `void` \| () => `void`) => `void` |

#### Defined in

[src/lib/effect.ts:86](https://github.com/cdellacqua/stores.js/blob/main/src/lib/effect.ts#L86)

___

### ReadonlyStore

Ƭ **ReadonlyStore**<`T`\>: `Object`

A store that can have subscribers and emit values to them. It also
provides the current value upon subscription. It's readonly in the
sense that it doesn't provide direct set/update methods, unlike [Store](README.md#store),
therefore its value can only be changed by a [StartHandler](README.md#starthandler) (see also [makeReadonlyStore](README.md#makereadonlystore)).

#### Type parameters

| Name |
| :------ |
| `T` |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `content` | () => `T` |
| `nOfSubscriptions` | () => `number` |
| `subscribe` | (`subscriber`: [`Subscriber`](README.md#subscriber)<`T`\>) => [`Unsubscribe`](README.md#unsubscribe) |
| `watch` | () => `T` |

#### Defined in

[src/lib/store.ts:39](https://github.com/cdellacqua/stores.js/blob/main/src/lib/store.ts#L39)

___

### Setter

Ƭ **Setter**<`T`\>: (`newValue`: `T`) => `void`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Type declaration

▸ (`newValue`): `void`

A generic setter function. Used in [Store](README.md#store)

##### Parameters

| Name | Type |
| :------ | :------ |
| `newValue` | `T` |

##### Returns

`void`

#### Defined in

[src/lib/store.ts:19](https://github.com/cdellacqua/stores.js/blob/main/src/lib/store.ts#L19)

___

### StartHandler

Ƭ **StartHandler**<`T`\>: (`set`: [`Setter`](README.md#setter)<`T`\>) => [`StopHandler`](README.md#stophandler) \| `void`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Type declaration

▸ (`set`): [`StopHandler`](README.md#stophandler) \| `void`

A function that gets called once a store gets at least one subscriber. Used in [Store](README.md#store)

##### Parameters

| Name | Type |
| :------ | :------ |
| `set` | [`Setter`](README.md#setter)<`T`\> |

##### Returns

[`StopHandler`](README.md#stophandler) \| `void`

#### Defined in

[src/lib/store.ts:31](https://github.com/cdellacqua/stores.js/blob/main/src/lib/store.ts#L31)

___

### StopHandler

Ƭ **StopHandler**: () => `void`

#### Type declaration

▸ (): `void`

A function that gets called once a store reaches 0 subscribers. Used in [Store](README.md#store)

##### Returns

`void`

#### Defined in

[src/lib/store.ts:29](https://github.com/cdellacqua/stores.js/blob/main/src/lib/store.ts#L29)

___

### Store

Ƭ **Store**<`T`\>: [`ReadonlyStore`](README.md#readonlystore)<`T`\> & { `set`: (`v`: `T`) => `void` ; `update`: (`updater`: [`Updater`](README.md#updater)<`T`\>) => `void`  }

A store that can have subscribers and emit values to them. It also
provides the current value upon subscription.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

[src/lib/store.ts:83](https://github.com/cdellacqua/stores.js/blob/main/src/lib/store.ts#L83)

___

### StoreConfig

Ƭ **StoreConfig**<`T`\>: `Object`

Configurations for Store<T> and ReadonlyStore<T>.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `comparator?` | [`EqualityComparator`](README.md#equalitycomparator)<`T`\> | (optional, defaults to `(a, b) => a === b`) a function that's used to determine if the current value of the store value is different from the one being set and thus if the store needs to be updated and the subscribers notified. |
| `start?` | [`StartHandler`](README.md#starthandler)<`T`\> | (optional) a [StartHandler](README.md#starthandler) that will get called once there is at least one subscriber to this store. |

#### Defined in

[src/lib/store.ts:100](https://github.com/cdellacqua/stores.js/blob/main/src/lib/store.ts#L100)

___

### Subscriber

Ƭ **Subscriber**<`T`\>: (`current`: `T`) => `void`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Type declaration

▸ (`current`): `void`

A generic subscriber that takes a value emitted by a signal as its only parameter.

##### Parameters

| Name | Type |
| :------ | :------ |
| `current` | `T` |

##### Returns

`void`

#### Defined in

node_modules/@cdellacqua/signals/dist/index.d.ts:2

___

### Unsubscribe

Ƭ **Unsubscribe**: () => `void`

#### Type declaration

▸ (): `void`

A function that's used to unsubscribe a subscriber from a signal.

##### Returns

`void`

#### Defined in

node_modules/@cdellacqua/signals/dist/index.d.ts:4

___

### Update

Ƭ **Update**<`T`\>: (`updater`: (`current`: `T`) => `T`) => `void`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Type declaration

▸ (`updater`): `void`

A generic update function. Used in [Store](README.md#store)

##### Parameters

| Name | Type |
| :------ | :------ |
| `updater` | (`current`: `T`) => `T` |

##### Returns

`void`

#### Defined in

[src/lib/store.ts:25](https://github.com/cdellacqua/stores.js/blob/main/src/lib/store.ts#L25)

___

### Updater

Ƭ **Updater**<`T`\>: (`current`: `T`) => `T`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Type declaration

▸ (`current`): `T`

A generic updater function. Used in [Store](README.md#store)

##### Parameters

| Name | Type |
| :------ | :------ |
| `current` | `T` |

##### Returns

`T`

#### Defined in

[src/lib/store.ts:23](https://github.com/cdellacqua/stores.js/blob/main/src/lib/store.ts#L23)

## Functions

### batchEffects

▸ **batchEffects**(`action`): `void`

Run the passed function, enqueueing and deduplicating the effects it may trigger, in order to
run them just at the end to avoid "glitches".

NOTE: batchEffects can be nested, all updates will automatically be accumulated in the outmost "batch" before
the effects are executed.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `action` | () => `void` | A function that directly or indirectly updates one or more stores. |

#### Returns

`void`

#### Defined in

[src/lib/effect.ts:164](https://github.com/cdellacqua/stores.js/blob/main/src/lib/effect.ts#L164)

___

### makeDerivedStore

▸ **makeDerivedStore**<`TIn`, `TOut`\>(`readonlyStore`, `map`, `config?`): [`ReadonlyStore`](README.md#readonlystore)<`TOut`\>

Create a derived store.

Example usage:
```ts
const source$ = makeStore(10);
const derived$ = makeDerivedStore(source$, (v) => v * 2);
source$.subscribe((v) => console.log(v)); // prints 10
derived$.subscribe((v) => console.log(v)); // prints 20
source$.set(16); // triggers both console.logs, printing 16 and 32
```

#### Type parameters

| Name |
| :------ |
| `TIn` |
| `TOut` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `readonlyStore` | [`ReadonlyStore`](README.md#readonlystore)<`TIn`\> | a store or readonly store. |
| `map` | (`value`: `TIn`) => `TOut` | a function that takes the current value of the source store and maps it to another value. |
| `config?` | [`DerivedStoreConfig`](README.md#derivedstoreconfig)<`TOut`\> | a [DerivedStoreConfig](README.md#derivedstoreconfig) which contains configuration information such as a value comparator to avoid needless notifications to subscribers. |

#### Returns

[`ReadonlyStore`](README.md#readonlystore)<`TOut`\>

#### Defined in

[src/lib/composition.ts:41](https://github.com/cdellacqua/stores.js/blob/main/src/lib/composition.ts#L41)

▸ **makeDerivedStore**<`TIn`, `TOut`\>(`readonlyStores`, `map`, `config?`): [`ReadonlyStore`](README.md#readonlystore)<`TOut`\>

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

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TIn` | extends `unknown`[] \| [`unknown`, ...unknown[]] |
| `TOut` | `TOut` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `readonlyStores` | { [K in string \| number \| symbol]: ReadonlyStore<TIn[K]\> } | an array of stores or readonly stores. |
| `map` | (`value`: { [K in string \| number \| symbol]: TIn[K] }) => `TOut` | a function that takes the current value of all the source stores and maps it to another value. |
| `config?` | [`DerivedStoreConfig`](README.md#derivedstoreconfig)<`TOut`\> | a [DerivedStoreConfig](README.md#derivedstoreconfig) which contains configuration information such as a value comparator to avoid needless notifications to subscribers. |

#### Returns

[`ReadonlyStore`](README.md#readonlystore)<`TOut`\>

#### Defined in

[src/lib/composition.ts:65](https://github.com/cdellacqua/stores.js/blob/main/src/lib/composition.ts#L65)

▸ **makeDerivedStore**<`TIn`, `TOut`\>(`readonlyStores`, `map`, `config?`): [`ReadonlyStore`](README.md#readonlystore)<`TOut`\>

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

#### Type parameters

| Name |
| :------ |
| `TIn` |
| `TOut` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `readonlyStores` | { [K in string \| number \| symbol]: ReadonlyStore<TIn[K]\> } | an array of stores or readonly stores. |
| `map` | (`value`: { [K in string \| number \| symbol]: TIn[K] }) => `TOut` | a function that takes the current value of all the source stores and maps it to another value. |
| `config?` | [`DerivedStoreConfig`](README.md#derivedstoreconfig)<`TOut`\> | a [DerivedStoreConfig](README.md#derivedstoreconfig) which contains configuration information such as a value comparator to avoid needless notifications to subscribers. |

#### Returns

[`ReadonlyStore`](README.md#readonlystore)<`TOut`\>

#### Defined in

[src/lib/composition.ts:89](https://github.com/cdellacqua/stores.js/blob/main/src/lib/composition.ts#L89)

___

### makeReactiveRoot

▸ **makeReactiveRoot**(): [`ReactiveRoot`](README.md#reactiveroot)

Create a [ReactiveRoot](README.md#reactiveroot), providing a makeEffect and a dispose function.

#### Returns

[`ReactiveRoot`](README.md#reactiveroot)

#### Defined in

[src/lib/effect.ts:105](https://github.com/cdellacqua/stores.js/blob/main/src/lib/effect.ts#L105)

___

### makeReadonlyStore

▸ **makeReadonlyStore**<`T`\>(`initialValue`, `start?`): [`ReadonlyStore`](README.md#readonlystore)<`T`\>

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

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `initialValue` | `undefined` \| `T` | the initial value of the store. |
| `start?` | [`StartHandler`](README.md#starthandler)<`T`\> | a [StartHandler](README.md#starthandler) that will get called once there is at least one subscriber to this store. |

#### Returns

[`ReadonlyStore`](README.md#readonlystore)<`T`\>

a ReadonlyStore

#### Defined in

[src/lib/store.ts:251](https://github.com/cdellacqua/stores.js/blob/main/src/lib/store.ts#L251)

▸ **makeReadonlyStore**<`T`\>(`initialValue`, `config?`): [`ReadonlyStore`](README.md#readonlystore)<`T`\>

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

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `initialValue` | `undefined` \| `T` | the initial value of the store. |
| `config?` | [`StoreConfig`](README.md#storeconfig)<`T`\> | a [StoreConfig](README.md#storeconfig) which contains configuration information such as a value comparator to avoid needless notifications to subscribers and a [StartHandler](README.md#starthandler). |

#### Returns

[`ReadonlyStore`](README.md#readonlystore)<`T`\>

a ReadonlyStore

#### Defined in

[src/lib/store.ts:272](https://github.com/cdellacqua/stores.js/blob/main/src/lib/store.ts#L272)

▸ **makeReadonlyStore**<`T`\>(`initialValue`, `startOrConfig?`): [`ReadonlyStore`](README.md#readonlystore)<`T`\>

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

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `initialValue` | `undefined` \| `T` | the initial value of the store. |
| `startOrConfig?` | [`StartHandler`](README.md#starthandler)<`T`\> \| [`StoreConfig`](README.md#storeconfig)<`T`\> | a [StartHandler](README.md#starthandler) or a [StoreConfig](README.md#storeconfig) which contains configuration information such as a value comparator to avoid needless notifications to subscribers and a [StartHandler](README.md#starthandler). |

#### Returns

[`ReadonlyStore`](README.md#readonlystore)<`T`\>

a ReadonlyStore

#### Defined in

[src/lib/store.ts:295](https://github.com/cdellacqua/stores.js/blob/main/src/lib/store.ts#L295)

___

### makeStore

▸ **makeStore**<`T`\>(`initialValue`, `start?`): [`Store`](README.md#store)<`T`\>

Make a store of type T.

Example usage:
```ts
const store$ = makeStore(0);
console.log(store$.content()); // 0
store$.subscribe((v) => console.log(v));
store$.set(10); // will trigger the above console log, printing 10
```

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `initialValue` | `undefined` \| `T` | the initial value of the store. |
| `start?` | [`StartHandler`](README.md#starthandler)<`T`\> | a [StartHandler](README.md#starthandler) that will get called once there is at least one subscriber to this store. |

#### Returns

[`Store`](README.md#store)<`T`\>

a Store

#### Defined in

[src/lib/store.ts:124](https://github.com/cdellacqua/stores.js/blob/main/src/lib/store.ts#L124)

▸ **makeStore**<`T`\>(`initialValue`, `config?`): [`Store`](README.md#store)<`T`\>

Make a store of type T.

Example usage:
```ts
const store$ = makeStore(0);
console.log(store$.content()); // 0
store$.subscribe((v) => console.log(v));
store$.set(10); // will trigger the above console log, printing 10
```

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `initialValue` | `undefined` \| `T` | the initial value of the store. |
| `config?` | [`StoreConfig`](README.md#storeconfig)<`T`\> | a [StoreConfig](README.md#storeconfig) which contains configuration information such as a value comparator to avoid needless notifications to subscribers and a [StartHandler](README.md#starthandler). |

#### Returns

[`Store`](README.md#store)<`T`\>

a Store

#### Defined in

[src/lib/store.ts:140](https://github.com/cdellacqua/stores.js/blob/main/src/lib/store.ts#L140)

▸ **makeStore**<`T`\>(`initialValue`, `startOrConfig?`): [`Store`](README.md#store)<`T`\>

Make a store of type T.

Example usage:
```ts
const store$ = makeStore(0);
console.log(store$.content()); // 0
store$.subscribe((v) => console.log(v));
store$.set(10); // will trigger the above console log, printing 10
```

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `initialValue` | `undefined` \| `T` | the initial value of the store. |
| `startOrConfig?` | [`StartHandler`](README.md#starthandler)<`T`\> \| [`StoreConfig`](README.md#storeconfig)<`T`\> | a [StartHandler](README.md#starthandler) or a [StoreConfig](README.md#storeconfig) which contains configuration information such as a value comparator to avoid needless notifications to subscribers and a [StartHandler](README.md#starthandler). |

#### Returns

[`Store`](README.md#store)<`T`\>

a Store

#### Defined in

[src/lib/store.ts:156](https://github.com/cdellacqua/stores.js/blob/main/src/lib/store.ts#L156)
