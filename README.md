# universal-stores

State management made simple.

Stores are a simple yet powerful way to manage an application
state. Some examples of stores can be found in Svelte (e.g. writable, readable) and Solid.js (e.g. createSignal).

This package provides a framework-agnostic implementation of this concept.

[NPM Package](https://www.npmjs.com/package/universal-stores)

`npm install universal-stores`

[Documentation](./docs/README.md)

## Store

A `Store<T>` is an object that provides the following methods:

- `subscribe(subscriber)`, to attach subscribers;
- `set(value)`, to update the current value of the store and send it to all subscribers;
- `update(updater)`, to update the value using a function that takes the current one as an argument.

There is also a getter `value` that retrieves the current value of the store:

```ts
import {makeStore} from 'universal-stores';

const store$ = makeStore(0);
console.log(store$.value); // 0
store$.set(1);
console.log(store$.value); // 1
```

When a subscriber is attached to a store it immediately receives the current value.
Every time the value of the store changes (by using `set` or `update`) all subscribers get the new value.

`Store<T>` also contains a getter (`nOfSubscriptions`) that lets you know how many active subscriptions
are active at a given moment (this could be useful if you are trying to optimize your code).

Let's see an example:

```ts
import {makeStore} from 'universal-stores';

const store$ = makeStore(0);
console.log(store$.value); // 0
const unsubscribe = store$.subscribe((v) => console.log(v)); // immediately prints 0
store$.set(1); // triggers the above subscriber, printing 1
unsubscribe();
store$.set(2); // 2 is saved in the store, but nothing gets printed because the subscription has been removed
store$.subscribe((v) => console.log(v)); // immediately prints 2
```

Let's see an example that uses the update method:

```ts
import {makeStore} from 'universal-stores';

const store$ = makeStore(0);
store$.subscribe((v) => console.log(v)); // immediately prints 0
const plusOne = (n: number) => n + 1;
store$.update(plusOne); // triggers the above subscriber, printing 1
store$.update(plusOne); // triggers the above subscriber, printing 2
store$.update(plusOne); // triggers the above subscriber, printing 3
```

A nice feature of `Store<T>` is that it deduplicates subscribers,
that is you can't accidentally add the same subscriber more than
once to the same store (just like the DOM addEventListener method), although
every time you add it, it will receive the current value:

```ts
import {makeStore} from 'universal-stores';

const store$ = makeStore(0);
const subscriber = (v: number) => console.log(v);
const unsubscribe1 = store$.subscribe(subscriber); // prints 0
const unsubscribe2 = store$.subscribe(subscriber); // prints 0
const unsubscribe3 = store$.subscribe(subscriber); // prints 0
console.log(store$.nOfSubscriptions); // 1
unsubscribe3(); // will remove "subscriber"
unsubscribe2(); // won't do anything, "subscriber" has already been removed
unsubscribe1(); // won't do anything, "subscriber" has already been removed
console.log(store$.nOfSubscriptions); // 0
```

If you ever needed to add the same function
more than once you can still achieve that by simply wrapping it inside an arrow function:

```ts
import {makeStore} from 'universal-stores';

const store$ = makeStore(0);
const subscriber = (v: number) => console.log(v);
console.log(store$.nOfSubscriptions); // 0
const unsubscribe1 = store$.subscribe(subscriber); // prints 0
console.log(store$.nOfSubscriptions); // 1
const unsubscribe2 = store$.subscribe((v) => subscriber(v)); // prints 0
console.log(store$.nOfSubscriptions); // 2
unsubscribe2();
console.log(store$.nOfSubscriptions); // 1
unsubscribe1();
console.log(store$.nOfSubscriptions); // 0
```

## Deriving

Deriving a store consists of creating a new store
that stores a value mapped from the source store.

Example:

```ts
import {makeStore, makeDerivedStore} from 'universal-stores';

const store$ = makeStore(1);
const derived$ = makeDerivedStore(store$, (n) => n + 100);
derived$.subscribe((v) => console.log(v)); // prints 101
store$.set(3); // will trigger console.log, printing 103
```

## ReadonlyStore

When you derive a store, you get back a `ReadonlyStore<T>`.
This type lacks the `set` and `update` methods.

A `Store<T>` is in fact an extension of a `ReadonlyStore<T>` that adds the aforementioned methods.

As a rule of thumb, it is preferable to pass around `ReadonlyStore<T>`s,
to better encapsulate your stores and prevent unwanted `set`s or `update`s.

## Lazy loading

To create a `Store<T>` or a `ReadonlyStore<T>` you can use
the `makeStore(...)` or `makeReadonlyStore(...)` functions.

They both takes an optional initial value as their first parameter, and
that's their most common use case, but sometimes it could be useful
to lazy load a store or alter its value using a `StartHandler`.

A `StartHandler` is a function that gets called whenever the store is activated,
i.e. it gets at least one subscription. If the `StartHandler` returns a function,
that function is called whenever the store reaches zero subscribers.

Example:
```ts
import {makeReadonlyStore} from 'universal-stores`;

const oneHertzPulse$ = makeReadonlyStore<number>(undefined, (set) => {
	console.log('start');
	const interval = setInterval(() => {
		set(performance.now());
	}, 1000);

	return () => {
		console.log('cleanup');
		clearInterval(interval);
	};
});

const unsubscribe = oneHertzPulse$.subscribe((time) => console.log(time)); // prints "start" followed by the current time

// for the next five seconds the store will print the current time each second

setTimeout(() => {
	// prints "cleanup" followed by the current time
	unsubscribe();
}, 5000);
```
