# universal-stores

State management made simple.

Stores are a simple yet powerful way to manage an application
state. Some examples of stores can be found in Svelte (e.g. writable, readable) and Solid.js (e.g. createSignal).

This package provides a framework-agnostic implementation of this concept.

[NPM Package](https://www.npmjs.com/package/universal-stores)

`npm install universal-stores`

[Documentation](./docs/README.md)

## Store

In a nutshell, stores are observable containers of values.

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

`Store<T>` also contains a getter (`nOfSubscriptions`) that lets you know how many subscriptions
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

A derived store is a `ReadonlyStore<T>` (see below) whose
value is the result of a computation on one or more
source stores.

Example:

```ts
import {makeStore, makeDerivedStore} from 'universal-stores';

const store$ = makeStore(1);
const derived$ = makeDerivedStore(store$, (n) => n + 100);
derived$.subscribe((v) => console.log(v)); // prints 101
store$.set(3); // will trigger console.log, printing 103
```

Example with multiple sources:

```ts
import {makeStore, makeDerivedStore} from 'universal-stores';

const firstWord$ = makeStore('hello');
const secondWord$ = makeStore('world!');
const derived$ = makeDerivedStore([firstWord$, secondWord$], ([first, second]) => `${first} ${second}`);
derived$.subscribe((v) => console.log(v)); // prints "hello world!"
firstWord$.set('hi'); // will trigger console.log, printing "hi world!"
```

## ReadonlyStore

When you derive a store, you get back a `ReadonlyStore<T>`.
This type lacks the `set` and `update` methods.

A `Store<T>` is in fact an extension of a `ReadonlyStore<T>` that adds the aforementioned methods.

As a rule of thumb, it is preferable to pass around `ReadonlyStore<T>`s,
to better encapsulate your state and prevent unwanted `set`s or `update`s.

## Lazy loading

To create a `Store<T>` or a `ReadonlyStore<T>` you can use `makeStore(...)` or `makeReadonlyStore(...)`.

Both these functions take an optional initial value as their first parameter, and
that's their most common use case, but sometimes it could be useful
to lazy load a store or alter its value by using a `StartHandler`.

A `StartHandler` is a function that gets called whenever the store is activated,
i.e. it gets at least one subscription. If the `StartHandler` returns a function,
that function will be called whenever the store is deactivated, i.e.
it has no active subscriptions.

Example:

```ts
import {makeReadonlyStore} from 'universal-stores';

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
	// prints "cleanup"
	unsubscribe();
}, 5000);
```

## Optimizing notifications to subscribers

`makeStore` can also take a configuration object as its second
argument. The configuration can contain a `StartHandler` and an `EqualityComparator`.

An `EqualityComparator` is a comparing function that takes two arguments: the current value
of the store and the value that's being set (either by a call to `store$.set` or `store$.update`).
If the two values are equal (i.e. the function returns true), the store value remains the same
and the subscribers won't be notified.

By default `makeStore` uses a simple lambda that checks for equality with the strict equality operator, i.e. `(a, b) => a === b`.

If you use objects in your stores you might consider passing a custom function that performs
a deep equality check, taking into account the tradeoff between having to perform a more expensive comparison vs unnecessarily notifing lots of subscribers.

Similarly, `makeDerivedStore` can also take a configuration object with a custom comparator as its third argument.

Example:

```ts
import {makeStore} from 'universal-stores';

const objectStore$ = makeStore(
	{veryLongText: '...', hash: 0xffaa},
	{
		comparator: (a, b) => a.hash === b.hash,
	},
);
objectStore$.set({veryLongText: '...', hash: 0xbbdd}); // will trigger subscribers
objectStore$.set({veryLongText: '...', hash: 0xbbdd}); // won't trigger subscribers
```

Example with derived:

```ts
import {makeStore, makeDerivedStore} from 'universal-stores';

const objectStore$ = makeStore({veryLongText: '...', hash: 0xffaa});
const derivedObjectStore$ = makeDerivedStore(objectStore$, (x) => x, {
	comparator: (a, b) => a.hash === b.hash,
});
objectStore$.set({veryLongText: '...', hash: 0xbbdd}); // will trigger objectStore$ and derivedObjectStore$ subscribers
objectStore$.set({veryLongText: '...', hash: 0xbbdd}); // will only trigger objectStore$ subscribers
```

## Motivation

UI frameworks often ship with their own state management layer,
either built-in or provided by third parties.

State management, however, should **not** be coupled to
the UI framework or library you're currently working with. Moreover, state management
is also useful in non-UI applications (e.g. backend, background processes, etc.).

universal-stores is a standalone and lightweight state management library whose only concern
is providing primitives for storing and observing state. These primitives can then
be used as building blocks for libraries
and applications of any kind, decoupled from
the presentation layer until the very moment
you need to show data to the user.

## Ecosystem

For a complete list of packages that use universal-stores you can look at the [dependents tab on npm](https://www.npmjs.com/package/universal-stores?activeTab=dependents).

### Adapters

- **ReactJS/React Native**: [@universal-stores/react-adapter](https://www.npmjs.com/package/@universal-stores/react-adapter);
- **SolidJS**: [@universal-stores/solid-adapter](https://www.npmjs.com/package/@universal-stores/solid-adapter);
- **Svelte**: no adapter needed, as having a `subscribe` method is enough to qualify as a Svelte-compatible store.
