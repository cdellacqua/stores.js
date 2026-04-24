[**universal-stores**](../README.md)

***

[universal-stores](../README.md) / ReadonlyStore

# Type Alias: ReadonlyStore\<T\>

> **ReadonlyStore**\<`T`\> = `object`

Defined in: [stores.js/src/lib/store.ts:43](https://github.com/cdellacqua/stores.js/blob/main/src/lib/store.ts#L43)

A store that can have subscribers and emit values to them. It also
provides the current value upon subscription. It's readonly in the
sense that it doesn't provide direct set/update methods, unlike [Store](Store.md),
therefore its value can only be changed by a [StartHandler](StartHandler.md) (see also [makeReadonlyStore](../functions/makeReadonlyStore.md)).

## Type Parameters

### T

`T`

## Methods

### content()

> **content**(): `T`

Defined in: [stores.js/src/lib/store.ts:60](https://github.com/cdellacqua/stores.js/blob/main/src/lib/store.ts#L60)

Get the current value wrapped by the store.

#### Returns

`T`

***

### nOfSubscriptions()

> **nOfSubscriptions**(): `number`

Defined in: [stores.js/src/lib/store.ts:56](https://github.com/cdellacqua/stores.js/blob/main/src/lib/store.ts#L56)

Return the current number of active subscriptions.

#### Returns

`number`

***

### subscribe()

> **subscribe**(`subscriber`): [`Unsubscribe`](Unsubscribe.md)

Defined in: [stores.js/src/lib/store.ts:52](https://github.com/cdellacqua/stores.js/blob/main/src/lib/store.ts#L52)

Subscribe a function to this store.

Note: subscribers are deduplicated, if you need to subscribe the same
function more than once wrap it in an arrow function, e.g.
`signal$.subscribe((v) => myFunc(v));`

#### Parameters

##### subscriber

[`Subscriber`](Subscriber.md)\<`T`\>

a function that will be called upon subscription and whenever the store value changes.

#### Returns

[`Unsubscribe`](Unsubscribe.md)

***

### watch()

> **watch**(): `T`

Defined in: [stores.js/src/lib/store.ts:80](https://github.com/cdellacqua/stores.js/blob/main/src/lib/store.ts#L80)

Get the current value wrapped by the store and register the current store as a dependency in the context of an effect.

Example usage:
```ts
import {makeReactiveRoot, makeStore} from 'universal-stores';

const {makeEffect} = makeReactiveRoot();
const store$ = makeStore(1);
makeEffect(() => {
	console.log(store$.watch()); // immediately prints 1
});
store$.set(2); // makes the effect above print 2
dispose();
store$.set(3); // does nothing, as the effect above has been unregistered
```

file://./effect.d.ts

#### Returns

`T`
