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

import {makeSignal} from '@cdellacqua/signals';

/** A generic subscriber. Used in {@link Store} */
export type Subscriber<T> = (current: T) => void;
/** A function that's used to unsubscribe a subscriber from a store. Used in {@link Store} */
export type Unsubscribe = () => void;
/** A generic setter function. Used in {@link Store} */
export type Setter<T> = (newValue: T) => void;
/** A generic getter function. Used in {@link Store} */
export type Getter<T> = () => T;
/** A generic updater function. Used in {@link Store} */
export type Updater<T> = (current: T) => T;
/** A generic update function. Used in {@link Store} */
export type Update<T> = (updater: (current: T) => T) => void;
/** A comparison function used to optimize subscribers notifications. Used in {@link Store} */
export type EqualityComparator<T> = (a: T, b: T) => boolean;
/** A function that gets called once a store reaches 0 subscribers. Used in {@link Store} */
export type StopHandler = () => void;
/** A function that gets called once a store gets at least one subscriber. Used in {@link Store} */
export type StartHandler<T> = (set: Setter<T>) => StopHandler | void;

/**
 * A store that can have subscribers and emit values to them. It also
 * provides the current value upon subscription. It's readonly in the
 * sense that it doesn't provide direct set/update methods, unlike {@link Store},
 * therefore its value can only be changed by a {@link StartHandler} (see also {@link makeReadonlyStore}).
 */
export type ReadonlyStore<T> = {
	/**
	 * Subscribe a function to this store.
	 *
	 * Note: subscribers are deduplicated, if you need to subscribe the same
	 * function more than once wrap it in an arrow function, e.g.
	 * `signal$.subscribe((v) => myFunc(v));`
	 * @param subscriber a function that will be called upon subscription and whenever the store value changes.
	 */
	subscribe(subscriber: Subscriber<T>): Unsubscribe;
	/**
	 * Return the current number of active subscriptions.
	 */
	get nOfSubscriptions(): number;
	/**
	 * Get the current value of the store.
	 */
	get value(): T;
};

/**
 * A store that can have subscribers and emit values to them. It also
 * provides the current value upon subscription.
 */
export type Store<T> = ReadonlyStore<T> & {
	/**
	 * Set a value and send it to all subscribers.
	 * @param v the new value of this store.
	 */
	set(v: T): void;
	/**
	 * Set the new value of the store through an updater function that takes the current one as an argument
	 * and send the returned value to all subscribers.
	 * @param updater the update function that will receive the current value and return the new one.
	 */
	update(updater: Updater<T>): void;
};

/**
 * Configurations for Store<T> and ReadonlyStore<T>.
 */
export type StoreConfig<T> = {
	/** (optional) a {@link StartHandler} that will get called once there is at least one subscriber to this store. */
	start?: StartHandler<T>;
	/**
	 * (optional, defaults to `(a, b) => a === b`) a function that's used to determine if the current value of the store value is different from
	 * the one being set and thus if the store needs to be updated and the subscribers notified.
	 */
	comparator?: EqualityComparator<T>;
};

/**
 * Make a store of type T.
 *
 * Example usage:
 * ```ts
 * const store$ = makeStore(0);
 * console.log(store$.value); // 0
 * store$.subscribe((v) => console.log(v));
 * store$.set(10); // will trigger the above console log, printing 10
 * ```
 * @param initialValue the initial value of the store.
 * @param start a {@link StartHandler} that will get called once there is at least one subscriber to this store.
 * @returns a Store
 */
export function makeStore<T>(initialValue: T | undefined, start?: StartHandler<T>): Store<T>;

/**
 * Make a store of type T.
 *
 * Example usage:
 * ```ts
 * const store$ = makeStore(0);
 * console.log(store$.value); // 0
 * store$.subscribe((v) => console.log(v));
 * store$.set(10); // will trigger the above console log, printing 10
 * ```
 * @param initialValue the initial value of the store.
 * @param config a {@link StoreConfig} which contains configuration information such as a value comparator to avoid needless notifications to subscribers and a {@link StartHandler}.
 * @returns a Store
 */
export function makeStore<T>(initialValue: T | undefined, config?: StoreConfig<T>): Store<T>;

/**
 * Make a store of type T.
 *
 * Example usage:
 * ```ts
 * const store$ = makeStore(0);
 * console.log(store$.value); // 0
 * store$.subscribe((v) => console.log(v));
 * store$.set(10); // will trigger the above console log, printing 10
 * ```
 * @param initialValue the initial value of the store.
 * @param startOrConfig a {@link StartHandler} or a {@link StoreConfig} which contains configuration information such as a value comparator to avoid needless notifications to subscribers and a {@link StartHandler}.
 * @returns a Store
 */
export function makeStore<T>(initialValue: T | undefined, startOrConfig?: StartHandler<T> | StoreConfig<T>): Store<T>;

/**
 * Make a store of type T.
 *
 * Example usage:
 * ```ts
 * const store$ = makeStore(0);
 * console.log(store$.value); // 0
 * store$.subscribe((v) => console.log(v));
 * store$.set(10); // will trigger the above console log, printing 10
 * ```
 * @param initialValue the initial value of the store.
 * @param startOrConfig a {@link StartHandler} or a {@link StoreConfig} which contains configuration information such as a value comparator to avoid needless notifications to subscribers and a {@link StartHandler}.
 * @returns a Store
 */
export function makeStore<T>(initialValue: T | undefined, startOrConfig?: StartHandler<T> | StoreConfig<T>): Store<T> {
	let mutableValue = initialValue;
	const signal = makeSignal<T>();

	let stopHandler: StopHandler | undefined;
	const startHandler = typeof startOrConfig === 'function' ? startOrConfig : startOrConfig?.start;
	const comparator = (typeof startOrConfig === 'function' ? undefined : startOrConfig?.comparator) ?? ((a, b) => a === b);

	const get = () => {
		if (signal.nOfSubscriptions > 0) {
			return mutableValue as T;
		}
		let v: T | undefined;
		const unsubscribe = subscribe((current) => (v = current));
		unsubscribe();
		return v as T;
	};
	const set = (newValue: T) => {
		if (mutableValue !== undefined && comparator(mutableValue, newValue)) {
			return;
		}
		mutableValue = newValue;
		signal.emit(mutableValue);
	};
	const subscribe = (s: Subscriber<T>) => {
		if (signal.nOfSubscriptions === 0) {
			stopHandler = startHandler?.(set) as StopHandler | undefined;
		}
		const unsubscribe = signal.subscribe(s);
		s(mutableValue as T);

		return () => {
			unsubscribe();
			if (signal.nOfSubscriptions === 0) {
				stopHandler?.();
				stopHandler = undefined;
			}
		};
	};
	const update = (updater: (current: T) => T) => {
		set(updater(get()));
	};

	return {
		get value() {
			return get();
		},
		set,
		subscribe,
		update,
		get nOfSubscriptions() {
			return signal.nOfSubscriptions;
		},
	};
}

/**
 * Make a store of type T.
 *
 * Example usage:
 * ```ts
 * let value = 0;
 * const store$ = makeReadonlyStore(value, (set) => {
 * 	value++;
 * 	set(value);
 * });
 * console.log(store$.value); // 1
 * store$.subscribe((v) => console.log(v)); // immediately prints 2
 * console.log(store$.value); // 2
 * ```
 * @param initialValue the initial value of the store.
 * @param start a {@link StartHandler} that will get called once there is at least one subscriber to this store.
 * @returns a ReadonlyStore
 */
export function makeReadonlyStore<T>(initialValue: T | undefined, start?: StartHandler<T>): ReadonlyStore<T>;

/**
 * Make a store of type T.
 *
 * Example usage:
 * ```ts
 * const store$ = makeReadonlyStore({prop: 'some value'}, {
 * 	comparator: (a, b) => a.prop === b.prop,
 * 	start: (set) => {
 * 		// ...
 * 	},
 * });
 * ```
 * @param initialValue the initial value of the store.
 * @param config a {@link StoreConfig} which contains configuration information such as a value comparator to avoid needless notifications to subscribers and a {@link StartHandler}.
 * @returns a ReadonlyStore
 */
export function makeReadonlyStore<T>(initialValue: T | undefined, config?: StoreConfig<T>): ReadonlyStore<T>;

/**
 * Make a store of type T.
 *
 * Example usage:
 * ```ts
 * let value = 0;
 * const store$ = makeReadonlyStore(value, (set) => {
 * 	value++;
 * 	set(value);
 * });
 * console.log(store$.value); // 1
 * store$.subscribe((v) => console.log(v)); // immediately prints 2
 * console.log(store$.value); // 2
 * ```
 * @param initialValue the initial value of the store.
 * @param startOrConfig a {@link StartHandler} or a {@link StoreConfig} which contains configuration information such as a value comparator to avoid needless notifications to subscribers and a {@link StartHandler}.
 * @returns a ReadonlyStore
 */
export function makeReadonlyStore<T>(initialValue: T | undefined, startOrConfig?: StartHandler<T> | StoreConfig<T>): ReadonlyStore<T>;

export function makeReadonlyStore<T>(initialValue: T | undefined, startOrConfig?: StartHandler<T> | StoreConfig<T>): ReadonlyStore<T> {
	const base$ = makeStore(initialValue, startOrConfig);

	return {
		get value() {
			return base$.value;
		},
		subscribe: base$.subscribe,
		get nOfSubscriptions() {
			return base$.nOfSubscriptions;
		},
	};
}

export * from './composition';
