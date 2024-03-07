# universal-stores

State management made simple.

**✨ with an integrated effect system ✨**

Stores are a simple yet powerful way to manage an application
state. Some examples of stores can be found in Svelte (e.g. writable, readable) and Solid.js (e.g. createSignal).

This package provides a framework-agnostic implementation of this concept and a supporting effect system that can be used in conjunction with (or as an alternative to)
explicit subscriptions.

[NPM Package](https://www.npmjs.com/package/universal-stores)

`npm install universal-stores`

[Documentation](./docs/README.md)

## Migrating to V2

Please refer to the [changelog](./CHANGELOG.md).

## Store

In a nutshell, stores are observable containers of values.

A `Store<T>` is an object that provides the following methods:

- `subscribe(subscriber)`, to attach subscribers;
- `set(value)`, to update the current value of the store and send it to all subscribers;
- `update(updater)`, to update the value using a function that takes the current one as an argument.
- `content()`, to retrieve the current content of a store.
- `watch()`, to retrieve the current content of a store and register the store as a dependency of a running effect (more on this later).

```ts
import {makeStore} from 'universal-stores';

const store$ = makeStore(0);
console.log(store$.content()); // 0
store$.set(1);
console.log(store$.content()); // 1
```

When a subscriber is attached to a store it immediately receives the current value.
Every time the value of the store changes (by using `set` or `update`) all subscribers get the new value.

`Store<T>` also contains a getter (`nOfSubscriptions`) that lets you know how many subscriptions
are active at a given moment (this could be useful if you are trying to optimize your code).

Let's see an example:

```ts
import {makeStore} from 'universal-stores';

const store$ = makeStore(0);
console.log(store$.content()); // 0
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
console.log(store$.nOfSubscriptions()); // 1
unsubscribe3(); // will remove "subscriber"
unsubscribe2(); // won't do anything, "subscriber" has already been removed
unsubscribe1(); // won't do anything, "subscriber" has already been removed
console.log(store$.nOfSubscriptions()); // 0
```

If you ever need to add the same function
more than once you can still achieve this by simply wrapping it inside an arrow function:

```ts
import {makeStore} from 'universal-stores';

const store$ = makeStore(0);
const subscriber = (v: number) => console.log(v);
console.log(store$.nOfSubscriptions()); // 0
const unsubscribe1 = store$.subscribe(subscriber); // prints 0
console.log(store$.nOfSubscriptions()); // 1
const unsubscribe2 = store$.subscribe((v) => subscriber(v)); // prints 0
console.log(store$.nOfSubscriptions()); // 2
unsubscribe2();
console.log(store$.nOfSubscriptions()); // 1
unsubscribe1();
console.log(store$.nOfSubscriptions()); // 0
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

Example with multiple sources using an object (recommended):

```ts
import {makeStore, makeDerivedStore} from 'universal-stores';

const firstWord$ = makeStore('hello');
const secondWord$ = makeStore('world!');
const derived$ = makeDerivedStore(
	{first: firstWord$, second: secondWord$},
	({first, second}) => `${first} ${second}`,
);
derived$.subscribe((v) => console.log(v)); // prints "hello world!"
firstWord$.set('hi'); // will trigger console.log, printing "hi world!"
```

Example with multiple sources using an array:

```ts
import {makeStore, makeDerivedStore} from 'universal-stores';

const firstWord$ = makeStore('hello');
const secondWord$ = makeStore('world!');
const derived$ = makeDerivedStore(
	[firstWord$, secondWord$],
	([first, second]) => `${first} ${second}`,
);
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
	set(performance.now());
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

## Adding behaviour

If you need to encapsulate behaviour in a custom store, you
can simply destructure a regular store and add your
custom methods to the already existing ones.

Example:

```ts
import {makeStore} from 'universal-stores';

function makeCounterStore(): ReadonlyStore<number> & {increment(): void} {
	const {subscribe, content, update, nOfSubscriptions} = makeStore(0);
	return {
		subscribe,
		content,
		nOfSubscriptions,
		increment() {
			update((n) => n + 1);
		},
	};
}

const counter$ = makeCounterStore();
counter$.subscribe(console.log); // immediately prints 0
counter$.increment(); // will trigger the above console.log, printing 1
```

## Effect system

An "effect" is function that usually causes "side effects" (e.g. writing to the console, changing a DOM node, making an HTTP request, etc.) and that is tied to one or more stores
in a semi-automatic manner.

This package provides the following API for the effect system:

- `makeReactiveRoot`, which instantiate an object containing `makeEffect` and `dispose`;
  - `makeEffect`, the primitive that registers effects;
  - `dispose`, a destructor for the reactive root that unregisters all effects, calling their cleanup functions (if present);
- `batchEffects`, which enables "glitch-free" updates by enqueueing and deduplicating effects during multiple store updates;
- `store$.watch()`, a method present in all readable stores similar to `.content()` that adds the store to the dependency list of an effect during a `makeEffect` call.

In practice, effects look like this:

```ts
import {makeReactiveRoot, makeStore} from 'universal-stores';

const {makeEffect, dispose} = makeReactiveRoot();

const store$ = makeStore(1);
makeEffect(() => {
	console.log(store$.watch()); // immediately prints 1
});
store$.set(2); // makes the effect above print 2
dispose();
store$.set(3); // does nothing, as the effect above has been unregistered
```

The `dispose` is the equivalent, in observable terms, to the `unsubscribe` function. The difference is that it's a bulk operation, acting on all effects registered under the same root.

The cleanup function of an effect is simply the function optionally returned inside
a `makeEffect` call:

```ts
import {makeReactiveRoot, makeStore} from 'universal-stores';

const {makeEffect, dispose} = makeReactiveRoot();

const store$ = makeStore(1);
makeEffect(() => {
	console.log(store$.watch()); // immediately prints 1

	return () => console.clear();
});
store$.set(2); // makes the effect above clean the console, then print 2
dispose(); // cleans the console
store$.set(3); // does nothing, as the effect above has been unregistered
```

As shown in the example above, the cleanup function gets invoked when `dispose` is
called or whenever the effect needs to re-run because at least one of its dependencies
has changed.

### Batching

Consider the following code:

```ts
import {makeReactiveRoot, makeStore} from 'universal-stores';

const {makeEffect} = makeReactiveRoot();

const greeting$ = makeStore('Hello');
const name$ = makeStore('John');
makeEffect(() => {
	console.log(`${greeting$.watch()}, ${name$.watch()}`); // immediately prints "Hello, John"
});

greeting$.set('Bye'); // prints "Bye, John"
name$.set('Jack'); // prints "Bye, Jack"
```

Sometimes it may be desirable to avoid triggering effects multiple times while updating different stores. The `batchEffects` function exists exactly for this use case. With a slight change to the code above we can update `greeting$` and `name$` "instantaneously":

```ts
import {makeReactiveRoot, makeStore, batchEffects} from 'universal-stores';

const {makeEffect} = makeReactiveRoot();

const greeting$ = makeStore('Hello');
const name$ = makeStore('John');
makeEffect(() => {
	console.log(`${greeting$.watch()}, ${name$.watch()}`); // immediately prints "Hello, John"
});

batchEffects(() => {
	greeting$.set('Bye'); // doesn't trigger
	name$.set('Jack'); // doesn't trigger
}); // triggers, printing "Bye, Jack"
```

### Derive-like behavior

The `.watch()` method doesn't need to be "physically" inside the `makeEffect` callback, the only condition needed for the effect to correctly register its dependencies is for `.watch()` to
be called synchronously during the first execution of the effect.

For example, this code:

```ts
import {makeReactiveRoot, makeStore} from 'universal-stores';

const {makeEffect} = makeReactiveRoot();

const greeting$ = makeStore('Hello');
const name$ = makeStore('John');
makeEffect(() => {
	console.log(`${greeting$.watch()}, ${name$.watch()}`); // immediately prints "Hello, John"
});
greeting$.set('Bye'); // prints "Bye, John"
```

is equivalent to this:

```ts
import {makeReactiveRoot, makeStore} from 'universal-stores';

const {makeEffect} = makeReactiveRoot();

const greeting$ = makeStore('Hello');
const name$ = makeStore('John');
const greet = () => `${greeting$.watch()}, ${name$.watch()}`;
makeEffect(() => {
	console.log(greet()); // immediately prints "Hello, John"
});
greeting$.set('Bye'); // prints "Bye, John"
```


## Motivation

UI frameworks often ship with their own state management layer,
either built-in or provided by third parties.

State management, however, should **not** be coupled with
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
