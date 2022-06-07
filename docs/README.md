universal-stores

# universal-stores

## Table of contents

### Type aliases

- [Getter](README.md#getter)
- [ReadonlyStore](README.md#readonlystore)
- [Setter](README.md#setter)
- [StartHandler](README.md#starthandler)
- [StopHandler](README.md#stophandler)
- [Store](README.md#store)
- [Subscriber](README.md#subscriber)
- [Unsubscribe](README.md#unsubscribe)
- [Update](README.md#update)
- [Updater](README.md#updater)

### Functions

- [makeDerivedStore](README.md#makederivedstore)
- [makeReadonlyStore](README.md#makereadonlystore)
- [makeStore](README.md#makestore)

## Type aliases

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

[index.ts:22](https://github.com/cdellacqua/stores.js/blob/main/src/lib/index.ts#L22)

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
| ``get` **nOfSubscriptions**(): `number`` | `Object` |
| ``get` **value**(): `T`` | `Object` |
| `subscribe` | (`subscriber`: [`Subscriber`](README.md#subscriber)<`T`\>) => [`Unsubscribe`](README.md#unsubscribe) |

#### Defined in

[index.ts:38](https://github.com/cdellacqua/stores.js/blob/main/src/lib/index.ts#L38)

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

[index.ts:20](https://github.com/cdellacqua/stores.js/blob/main/src/lib/index.ts#L20)

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

[index.ts:30](https://github.com/cdellacqua/stores.js/blob/main/src/lib/index.ts#L30)

___

### StopHandler

Ƭ **StopHandler**: () => `void`

#### Type declaration

▸ (): `void`

A function that gets called once a store reaches 0 subscribers. Used in [Store](README.md#store)

##### Returns

`void`

#### Defined in

[index.ts:28](https://github.com/cdellacqua/stores.js/blob/main/src/lib/index.ts#L28)

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

[index.ts:62](https://github.com/cdellacqua/stores.js/blob/main/src/lib/index.ts#L62)

___

### Subscriber

Ƭ **Subscriber**<`T`\>: (`current`: `T`) => `void`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Type declaration

▸ (`current`): `void`

A generic subscriber. Used in [Store](README.md#store)

##### Parameters

| Name | Type |
| :------ | :------ |
| `current` | `T` |

##### Returns

`void`

#### Defined in

[index.ts:16](https://github.com/cdellacqua/stores.js/blob/main/src/lib/index.ts#L16)

___

### Unsubscribe

Ƭ **Unsubscribe**: () => `void`

#### Type declaration

▸ (): `void`

A function that's used to unsubscribe a subscriber from a store. Used in [Store](README.md#store)

##### Returns

`void`

#### Defined in

[index.ts:18](https://github.com/cdellacqua/stores.js/blob/main/src/lib/index.ts#L18)

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

[index.ts:26](https://github.com/cdellacqua/stores.js/blob/main/src/lib/index.ts#L26)

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

[index.ts:24](https://github.com/cdellacqua/stores.js/blob/main/src/lib/index.ts#L24)

## Functions

### makeDerivedStore

▸ **makeDerivedStore**<`TIn`, `TOut`\>(`readonlyStore`, `map`): [`ReadonlyStore`](README.md#readonlystore)<`TOut`\>

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

#### Returns

[`ReadonlyStore`](README.md#readonlystore)<`TOut`\>

#### Defined in

[composition.ts:29](https://github.com/cdellacqua/stores.js/blob/main/src/lib/composition.ts#L29)

▸ **makeDerivedStore**<`TIn`, `TOut`\>(`readonlyStores`, `map`): [`ReadonlyStore`](README.md#readonlystore)<`TOut`\>

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
| `TIn` | extends `unknown`[] |
| `TOut` | `TOut` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `readonlyStores` | { [P in string \| number \| symbol]: ReadonlyStore<TIn[P]\> } | an array of stores or readonly stores. |
| `map` | (`values`: `TIn`) => `TOut` | a function that takes the current value of all the source stores and maps it to another value. |

#### Returns

[`ReadonlyStore`](README.md#readonlystore)<`TOut`\>

#### Defined in

[composition.ts:48](https://github.com/cdellacqua/stores.js/blob/main/src/lib/composition.ts#L48)

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
console.log(store$.value); // 1
store$.subscribe((v) => console.log(v)); // immediately prints 2
console.log(store$.value); // 2
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

[index.ts:159](https://github.com/cdellacqua/stores.js/blob/main/src/lib/index.ts#L159)

___

### makeStore

▸ **makeStore**<`T`\>(`initialValue`, `start?`): [`Store`](README.md#store)<`T`\>

Make a store of type T.

Example usage:
```ts
const store$ = makeStore(0);
console.log(store$.value); // 0
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

[index.ts:90](https://github.com/cdellacqua/stores.js/blob/main/src/lib/index.ts#L90)
