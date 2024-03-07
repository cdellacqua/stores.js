// Freely inspired by https://github.com/sveltejs/svelte/blob/master/src/runtime/store/index.ts
/**
 * @license
 * Copyright (c) 2016-22 [these people](https://github.com/sveltejs/svelte/graphs/contributors)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import {EqualityComparator, makeReadonlyStore, ReadonlyStore} from './store';

/**
 * Configurations for derived stores.
 */
export type DerivedStoreConfig<T> = {
	/**
	 * (optional, defaults to `(a, b) => a === b`) a function that's used to determine if the current value of the store value is different from
	 * the one being set and thus if the store needs to be updated and the subscribers notified.
	 */
	comparator?: EqualityComparator<T>;
};

/**
 * Create a derived store.
 *
 * Example usage:
 * ```ts
 * const source$ = makeStore(10);
 * const derived$ = makeDerivedStore(source$, (v) => v * 2);
 * source$.subscribe((v) => console.log(v)); // prints 10
 * derived$.subscribe((v) => console.log(v)); // prints 20
 * source$.set(16); // triggers both console.logs, printing 16 and 32
 * ```
 * @param readonlyStore a store or readonly store.
 * @param map a function that takes the current value of the source store and maps it to another value.
 * @param config a {@link DerivedStoreConfig} which contains configuration information such as a value comparator to avoid needless notifications to subscribers.
 */
export function makeDerivedStore<TIn, TOut>(
	readonlyStore: ReadonlyStore<TIn>,
	map: (value: TIn) => TOut,
	config?: DerivedStoreConfig<TOut>,
): ReadonlyStore<TOut>;

/**
 * Create a derived store from multiple sources.
 *
 * Example usage:
 * ```ts
 * const source1$ = makeStore(10);
 * const source2$ = makeStore(-10);
 * const derived$ = makeDerivedStore([source1$, source2$], ([v1, v2]) => v1 + v2);
 * source1$.subscribe((v) => console.log(v)); // prints 10
 * source2$.subscribe((v) => console.log(v)); // prints -10
 * derived$.subscribe((v) => console.log(v)); // prints 0
 * source1$.set(11); // prints 11 (first console.log) and 1 (third console.log)
 * source2$.set(9); // prints 9 (second console.log) and 20 (third console.log)
 * ```
 * @param readonlyStores an array of stores or readonly stores.
 * @param map a function that takes the current value of all the source stores and maps it to another value.
 * @param config a {@link DerivedStoreConfig} which contains configuration information such as a value comparator to avoid needless notifications to subscribers.
 */
export function makeDerivedStore<TIn extends unknown[] | [unknown, ...unknown[]], TOut>(
	readonlyStores: {[K in keyof TIn]: ReadonlyStore<TIn[K]>},
	map: (value: {[K in keyof TIn]: TIn[K]}) => TOut,
	config?: DerivedStoreConfig<TOut>,
): ReadonlyStore<TOut>;

/**
 * Create a derived store from multiple sources.
 *
 * Example usage:
 * ```ts
 * const source1$ = makeStore(10);
 * const source2$ = makeStore(-10);
 * const derived$ = makeDerivedStore({v1: source1$, v2: source2$}, ({v1, v2}) => v1 + v2);
 * source1$.subscribe((v) => console.log(v)); // prints 10
 * source2$.subscribe((v) => console.log(v)); // prints -10
 * derived$.subscribe((v) => console.log(v)); // prints 0
 * source1$.set(11); // prints 11 (first console.log) and 1 (third console.log)
 * source2$.set(9); // prints 9 (second console.log) and 20 (third console.log)
 * ```
 * @param readonlyStores an array of stores or readonly stores.
 * @param map a function that takes the current value of all the source stores and maps it to another value.
 * @param config a {@link DerivedStoreConfig} which contains configuration information such as a value comparator to avoid needless notifications to subscribers.
 */
export function makeDerivedStore<TIn, TOut>(
	readonlyStores: {[K in keyof TIn]: ReadonlyStore<TIn[K]>},
	map: (value: {[K in keyof TIn]: TIn[K]}) => TOut,
	config?: DerivedStoreConfig<TOut>,
): ReadonlyStore<TOut>;

export function makeDerivedStore<TIn, TOut>(
	readonlyStoreOrStores: object,
	map: (values: TIn | {[K in keyof TIn]: TIn[K]}) => TOut,
	config?: DerivedStoreConfig<TOut>,
): ReadonlyStore<TOut> {
	const isArray = Array.isArray(readonlyStoreOrStores);
	const argumentIsAStore =
		!isArray &&
		'subscribe' in (readonlyStoreOrStores as ReadonlyStore<unknown>) &&
		'nOfSubscriptions' in (readonlyStoreOrStores as ReadonlyStore<unknown>) &&
		'content' in (readonlyStoreOrStores as ReadonlyStore<unknown>);

	const nOfSources = argumentIsAStore
		? 1
		: isArray
		? readonlyStoreOrStores.length
		: Object.keys(readonlyStoreOrStores).length;

	const derived$ = makeReadonlyStore<TOut>(undefined, {
		comparator: config?.comparator,
		start:
			nOfSources === 0
				? (set) => {
						set(map((isArray ? [] : {}) as TIn | {[K in keyof TIn]: TIn[K]}));
				  }
				: argumentIsAStore
				? (set) => {
						const unsubscribe = (readonlyStoreOrStores as ReadonlyStore<TIn>).subscribe(
							(newValue) => set(map(newValue)),
						);

						return unsubscribe;
				  }
				: isArray
				? // The array and object case are quite similar, but not equal. The code
				  // that follows could be deduplicated by branching internally, but it would be
				  // unnecessarily costly to
				  // check it every time the derived store starts, considering
				  // that the first argument doesn't change over time.
				  (set) => {
						let cache: Array<unknown> = new Array(readonlyStoreOrStores.length);

						let subscriptionCounter = 0;
						const subscriptions = readonlyStoreOrStores.map((store$, i) =>
							store$.subscribe((newValue: unknown) => {
								if (subscriptionCounter < nOfSources) {
									cache[i] = newValue;
									subscriptionCounter++;
								}
								if (subscriptionCounter === nOfSources) {
									const updatedCached = [...cache];
									updatedCached[i] = newValue;
									set(map(updatedCached as unknown as {[K in keyof TIn]: TIn[K]}));
									cache = updatedCached;
								}
							}),
						);

						return () => {
							for (const unsubscribe of subscriptions) {
								unsubscribe();
							}
							subscriptionCounter = 0;
						};
				  }
				: (set) => {
						let cache: Record<string, unknown> = {};

						let subscriptionCounter = 0;
						const subscriptions = Object.entries<ReadonlyStore<unknown>>(
							readonlyStoreOrStores as {[K in keyof TIn]: ReadonlyStore<TIn[K]>},
						).map(([name, store$]) =>
							store$.subscribe((newValue) => {
								if (subscriptionCounter < nOfSources) {
									cache[name] = newValue;
									subscriptionCounter++;
								}
								if (subscriptionCounter === nOfSources) {
									const updatedCached = {...cache};
									updatedCached[name] = newValue;
									set(map(updatedCached as unknown as {[K in keyof TIn]: TIn[K]}));
									cache = updatedCached;
								}
							}),
						);

						return () => {
							for (const unsubscribe of subscriptions) {
								unsubscribe();
							}
							subscriptionCounter = 0;
						};
				  },
	});

	return derived$;
}
