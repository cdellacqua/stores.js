import {ReadonlyStore, Unsubscribe} from './store';

export const effectRuntime: {
	/**
	 * The effect that is currently being "instantiated".
	 * The instantiation of an effect corresponds to its first run.
	 */
	instantiatingEffect: Effect | undefined;
	/**
	 * The number of effect ever register during the process runtime. This number is
	 * used as an auto-increment ID.
	 */
	effectCount: number;
	/**
	 * Counter that is used to check if we can run effects triggered by a store
	 * changing immediately or whether we should enqueue them to run them after
	 * all stores have been updated.
	 */
	isBatching: number;
	/** Map<effectId, effectRunner> */
	pendingEffectBatch: Map<number, () => void>;
	/** Map<effectId, Effect> */
	effectById: Map<number, Effect>;
	/** Counter of the number of reactive roots. */
	reactiveRootCount: number;
	/** Map<effectId, ReactiveRoot> */
	rootByEffectId: Map<number, number>;
	/** Map<reactiveRootId, allUnsubscribeFnsOfRegisteredEffects> */
	rootUnsubscribes: Map<number, Unsubscribe[]>;
} = {
	instantiatingEffect: undefined,
	effectCount: 0,
	isBatching: 0,
	pendingEffectBatch: new Map(),
	effectById: new Map(),
	reactiveRootCount: 0,
	rootByEffectId: new Map(),
	rootUnsubscribes: new Map(),
};

type Effect = {
	id: number;
	effectFn: () => void | (() => void);
	cleanupFn?: () => void;
	dependencies: number[];
};

/**
 * Error thrown if one or more cleanup functions registered by the effects inside a reactive
 * root raised an exception.
 */
export class ReactiveRootDisposeError extends Error {
	constructor(public errors: unknown[]) {
		super('some of the registered cleanup functions threw an exception');
	}
}

/**
 * Error thrown if one or more effects that were queued during a batchEffects call
 * raised an exception.
 */
export class BatchingEffectError extends Error {
	constructor(public errors: unknown[]) {
		super('some of the batched effects threw an exception');
	}
}

/**
 * Error thrown if makeEffect is called inside an effect.
 */
export class NestedEffectError extends Error {
	constructor() {
		super('makeEffect called inside an effect');
	}
}

/**
 * A reactive root provides a scope for all the effect it contains.
 * This scope can then be destroyed (and all the effect cleaned up) by calling
 * the dispose method.
 */
export type ReactiveRoot = {
	/**
	 * Create an effect.
	 *
	 * NOTE: makeEffect calls cannot be nested.
	 *
	 * @param fn A function that watches one or more stores and reacts to their changes. The function can optionally return
	 * a cleanup procedure that will run before the next effect takes place.
	 */
	makeEffect(fn: () => void | (() => void)): void;
	/**
	 * Call all the cleanup functions registered by all the effects in this reactive root.
	 */
	dispose(): void;
};

/**
 * Create a {@link ReactiveRoot}, providing a makeEffect and a dispose function.
 */
export function makeReactiveRoot(): ReactiveRoot {
	effectRuntime.reactiveRootCount++;
	const subscriptionsHolderId = effectRuntime.reactiveRootCount;

	const ownedEffectIds = new Set<number>();

	function makeEffect(fn: () => void | (() => void)): void {
		if (effectRuntime.instantiatingEffect !== undefined) {
			throw new NestedEffectError();
		}
		try {
			effectRuntime.effectCount++;
			const effectId = effectRuntime.effectCount;
			ownedEffectIds.add(effectId);
			const effect: Effect = {
				id: effectId,
				effectFn: fn,
				dependencies: [],
			};
			effectRuntime.effectById.set(effectId, effect);
			effectRuntime.rootByEffectId.set(effectId, subscriptionsHolderId);
			effectRuntime.instantiatingEffect = effect;
			effect.cleanupFn = effect.effectFn() as (() => void) | undefined;
		} finally {
			effectRuntime.instantiatingEffect = undefined;
		}
	}

	return {
		makeEffect,
		dispose() {
			effectRuntime.rootUnsubscribes
				.get(subscriptionsHolderId)
				?.forEach((unsubscribe) => unsubscribe());
			effectRuntime.rootUnsubscribes.delete(subscriptionsHolderId);
			const errors: unknown[] = [];
			for (const eId of ownedEffectIds) {
				try {
					effectRuntime.effectById.get(eId)?.cleanupFn?.();
				} catch (err) {
					errors.push(err);
				}
				effectRuntime.effectById.delete(eId);
				effectRuntime.rootByEffectId.delete(eId);
			}
			if (errors.length > 0) {
				throw new ReactiveRootDisposeError(errors);
			}
		},
	};
}

/**
 * Run the passed function, enqueueing and deduplicating the effects it may trigger, in order to
 * run them just at the end to avoid "glitches".
 *
 * NOTE: batchEffects can be nested, all updates will automatically be accumulated in the outmost "batch" before
 * the effects are executed.
 *
 * @param action A function that directly or indirectly updates one or more stores.
 */
export function batchEffects(action: () => void): void {
	effectRuntime.isBatching++;
	const errors: unknown[] = [];
	try {
		action();
	} catch (err) {
		errors.push(err);
	}

	effectRuntime.isBatching--;
	if (effectRuntime.isBatching === 0) {
		const pendingEffects = Array.from(effectRuntime.pendingEffectBatch.values());
		effectRuntime.pendingEffectBatch.clear();

		for (const effectRunner of /* snapshot */ pendingEffects) {
			try {
				effectRunner();
			} catch (err) {
				errors.push(err);
			}
		}
	}

	if (errors.length > 0) {
		throw new BatchingEffectError(errors);
	}
}

/**
 * Get the content of a store and register a subscription for the wrapping effect (if any).
 *
 * NOTE: __for internal use only__
 * @param store$ a partial store containing just the `subscriber` and `content` method.
 */
export function radioActiveContent<T>(
	storeId: number,
	store$: Pick<ReadonlyStore<T>, 'subscribe' | 'content'>,
): T {
	if (effectRuntime.instantiatingEffect !== undefined) {
		const effect = effectRuntime.instantiatingEffect;
		const effectId = effect.id;

		if (!effect.dependencies.includes(storeId)) {
			effect.dependencies.push(storeId);

			const rootId = effectRuntime.rootByEffectId.get(effectId) as number;
			let unsubscribes = effectRuntime.rootUnsubscribes.get(rootId);
			if (!unsubscribes) {
				unsubscribes = [];
				effectRuntime.rootUnsubscribes.set(rootId, unsubscribes);
			}

			let firstRun = true;
			let v: T | undefined;
			const unsubscribe = store$.subscribe((current) => {
				v = current;
				if (firstRun) {
					firstRun = false;
					return;
				}

				const effectRunner = () => {
					const prevRunning = effectRuntime.instantiatingEffect;
					effectRuntime.instantiatingEffect = undefined;
					try {
						effect.cleanupFn?.();
						effect.cleanupFn = effect.effectFn() as (() => void) | undefined;
					} finally {
						effectRuntime.instantiatingEffect = prevRunning;
					}
				};
				if (effectRuntime.isBatching > 0) {
					effectRuntime.pendingEffectBatch.set(effectId, effectRunner);
				} else {
					effectRunner();
				}
			});
			unsubscribes.push(unsubscribe);
			return v as T;
		}
	}
	return store$.content();
}
