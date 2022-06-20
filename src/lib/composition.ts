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

import {EqualityComparator, makeReadonlyStore, ReadonlyStore} from '.';

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
 */
export function makeDerivedStore<TIn, TOut>(readonlyStore: ReadonlyStore<TIn>, map: (value: TIn) => TOut, config?: DerivedStoreConfig<TOut>): ReadonlyStore<TOut>;

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
 */
export function makeDerivedStore<TIn extends [unknown, ...unknown[]], TOut>(
	readonlyStores: {[P in keyof TIn]: ReadonlyStore<TIn[P]>},
	map: (values: TIn) => TOut,
	config?: DerivedStoreConfig<TOut>,
): ReadonlyStore<TOut>;

export function makeDerivedStore<TIn extends unknown | [unknown, ...unknown[]], TOut>(
	storeOrStores: TIn,
	map: (values: TIn) => TOut,
	config?: DerivedStoreConfig<TOut>,
): ReadonlyStore<TOut> {
	const isArray = Array.isArray(storeOrStores);
	const readonlyStores = isArray
		? (storeOrStores as [ReadonlyStore<unknown>, ...ReadonlyStore<unknown>[]])
		: ([storeOrStores] as [ReadonlyStore<unknown>, ...ReadonlyStore<unknown>[]]);

	const deriveValues = (values: unknown | [unknown, ...unknown[]]) => {
		if (isArray) {
			return map(values as TIn);
		} else {
			return map((values as [unknown, ...unknown[]])[0] as TIn);
		}
	};

	const derived = makeReadonlyStore<TOut>(undefined, {
		comparator: config?.comparator,
		start: (set) => {
			const cache = new Array<unknown>(readonlyStores.length);

			let subscriptionCounter = 0;
			const subscriptions = readonlyStores.map((r, i) =>
				r.subscribe((newValue) => {
					cache[i] = newValue;
					if (subscriptionCounter < readonlyStores.length) {
						subscriptionCounter++;
					}
					if (subscriptionCounter === readonlyStores.length) {
						set(deriveValues(cache));
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

	return derived;
}
