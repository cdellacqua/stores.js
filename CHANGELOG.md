# Changelog

## V1 to V2

1. nOfSubscriptions has become a function instead of a getter property;
2. value has been replaced by content, which is also a function now;
3. makeDerivedStore can also accept an object literal instead of an array
   as its first argument;

### From getters to explicit functions (changes 1 and 2)

These changes have been made to remove common pitfalls that can occur
during development related to the spread object syntax. In particular,
destructuring a store would previously cause nOfSubscription and value
to return the current snapshot of the store state, which is rarely what's
needed. Returning a function will let you choose whether or not you
want a snapshot or something you can call at any moment to get the
most up-to-date information.

Example:

In V1 this simple use case would have caused an unexpected behaviour:

```ts
const base$ = makeStore(0);
const extended$ = {
	...base$,
	increment() {
		base$.update((n) => n + 1);
	},
};
console.log(extended$.value); // 0
extended$.increment();
console.log(extended$.value); // 0 !!! [incorrect]
```

The correct implementation in V1 would have been:

```ts
const base$ = makeStore(0);
const extended$ = {
	...base$,
	increment() {
		base$.update((n) => n + 1);
	}
	get value() {
		return base$.value;
	}
	get nOfSubscriptions() {
		return base$.nOfSubscriptions;
	}
}
console.log(extended$.value); // 0
extended$.increment();
console.log(extended$.value); // 1 [correct]
```

Delaying the access to the property is the solution, but it also adds the overhead of
an extra function call every time nesting happens. To fix this issue and make the composition more intuitive, in V2 you can simply do as follows, and it will work as expected:

V2

```ts
const base$ = makeStore(0);
const extended$ = {
	...base$,
	increment() {
		base$.update((n) => n + 1);
	},
};
console.log(extended$.content()); // 0
extended$.increment();
console.log(extended$.content()); // 1 [correct]
```

### makeDerivedStore can also accept objects (change 3)

makeDerivedStore is really useful, especially when you need to
combine the content of multiple stores.

When deriving multiple stores, though, it's easy to lose track of the indices,
especially when modifying existing code. Changing the argument of makeDerivedStore from an array to an object solves this problem and it also lets TypeScript validate the argument thoroughly.

Example:

This code in V1 and V2 doesn't trigger any compile-time error:

```ts
const source1$ = makeStore(6);
const source2$ = makeStore(3);
const derived$ = makeDerivedStore([source1$, source2$], ([v1, v2, v3]) => v1 + v2 + v3);
console.log(derived$.value); // NaN, because the computation above would resolve to 6 + 3 + undefined
```

In V2 the same functionality can be rewritten as follows:

```ts
const source1$ = makeStore(6);
const source2$ = makeStore(3);
// The commented code below would cause a TypeScript error, specifically "Property 'v3' does not exist on type '{ v1: number; v2: number; }'"
// const derived$ = makeDerivedStore({v1: source1$, v2: source2$}, ({v1, v2, v3}) => v1 + v2 + v3);
const derived$ = makeDerivedStore({v1: source1$, v2: source2$}, ({v1, v2}) => v1 + v2);
console.log(derived$.content()); // 9, because the computation above would resolve to 6 + 3
```
