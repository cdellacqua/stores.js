import {expect} from 'chai';
import {ReactiveRootDisposeError, batchEffects, makeReactiveRoot, makeStore} from '../src/lib';
import {BatchingEffectError, NestedEffectError, effectRuntime} from '../src/lib/effect';

function checkForMemoryLeaks() {
	// considering we always call dispose, we should always get 0 here
	expect(effectRuntime.effectById.size).to.eq(0);
}

describe('effect', () => {
	it('creates an effect', () => {
		const {makeEffect, dispose} = makeReactiveRoot();

		const store$ = makeStore(0);
		let actual: unknown | undefined;
		makeEffect(() => {
			actual = store$.watch();
		});
		expect(store$.nOfSubscriptions()).to.eq(1);
		expect(actual).to.eq(0);
		store$.set(1);
		expect(actual).to.eq(1);
		dispose();
		expect(store$.nOfSubscriptions()).to.eq(0);
		store$.set(2);
		expect(actual).to.eq(1);

		checkForMemoryLeaks();
	});

	it('creates an effect that reacts only to one of the two dependencies', () => {
		const {makeEffect, dispose} = makeReactiveRoot();

		const store1$ = makeStore(1);
		const store2$ = makeStore(2);
		let actual: unknown | undefined;
		makeEffect(() => {
			actual = store1$.watch() + store2$.content();
		});
		expect(store1$.nOfSubscriptions()).to.eq(1);
		expect(store2$.nOfSubscriptions()).to.eq(0);
		expect(actual).to.eq(3);
		store1$.set(2);
		expect(actual).to.eq(4);
		store2$.set(3);
		expect(actual).to.eq(4);
		dispose();
		expect(store1$.nOfSubscriptions()).to.eq(0);
		expect(store2$.nOfSubscriptions()).to.eq(0);
		store1$.set(2);
		expect(actual).to.eq(4);

		dispose();

		checkForMemoryLeaks();
	});

	it('creates a derived value', () => {
		const {makeEffect, dispose} = makeReactiveRoot();

		const store1$ = makeStore(1);
		const store2$ = makeStore(2);
		let actual: unknown | undefined;
		const derived = () => store1$.watch() + store2$.watch();
		makeEffect(() => {
			actual = derived();
		});
		expect(store1$.nOfSubscriptions()).to.eq(1);
		expect(store2$.nOfSubscriptions()).to.eq(1);
		expect(actual).to.eq(3);
		store1$.set(2);
		expect(actual).to.eq(4);
		store2$.set(3);
		expect(actual).to.eq(5);
		dispose();
		expect(store1$.nOfSubscriptions()).to.eq(0);
		expect(store2$.nOfSubscriptions()).to.eq(0);
		store1$.set(2);
		expect(actual).to.eq(5);

		dispose();

		checkForMemoryLeaks();
	});

	it('creates an effect with a cleanup function', () => {
		const {makeEffect, dispose} = makeReactiveRoot();

		const store$ = makeStore(0);
		let actual: unknown | undefined;
		let cleanupCount = 0;
		makeEffect(() => {
			actual = store$.watch();

			return () => {
				cleanupCount++;
			};
		});
		expect(store$.nOfSubscriptions()).to.eq(1);
		expect(actual).to.eq(0);
		expect(cleanupCount).to.eq(0);
		store$.set(1);
		expect(actual).to.eq(1);
		expect(cleanupCount).to.eq(1);
		dispose();
		expect(store$.nOfSubscriptions()).to.eq(0);
		expect(cleanupCount).to.eq(2);
		store$.set(2);
		expect(actual).to.eq(1);
		expect(cleanupCount).to.eq(2);

		dispose();

		checkForMemoryLeaks();
	});

	it('creates effects with different reactive roots', () => {
		// dummy call used to offset the root id for testing off-by-one errors
		makeReactiveRoot();

		const store1$ = makeStore(5);
		const store2$ = makeStore(7);
		let actual1: unknown | undefined;
		let actual2: unknown | undefined;

		const {makeEffect: makeEffect1, dispose: dispose1} = makeReactiveRoot();
		const {makeEffect: makeEffect2, dispose: dispose2} = makeReactiveRoot();

		makeEffect1(() => {
			actual1 = store1$.watch();
			actual2 = store2$.watch();
		});
		expect(actual1).to.eq(5);
		expect(actual2).to.eq(7);

		expect(store1$.nOfSubscriptions()).to.eq(1);
		expect(store2$.nOfSubscriptions()).to.eq(1);

		makeEffect2(() => {
			actual1 = store1$.watch() * -1;
			actual2 = store2$.watch() * -1;
		});
		expect(store1$.nOfSubscriptions()).to.eq(2);
		expect(store2$.nOfSubscriptions()).to.eq(2);
		expect(actual1).to.eq(-5);
		expect(actual2).to.eq(-7);
		dispose1();
		expect(store1$.nOfSubscriptions()).to.eq(1);
		expect(store2$.nOfSubscriptions()).to.eq(1);
		dispose2();
		expect(store1$.nOfSubscriptions()).to.eq(0);
		expect(store2$.nOfSubscriptions()).to.eq(0);

		checkForMemoryLeaks();
	});

	it('nests effects', () => {
		const store1$ = makeStore(5);
		const store2$ = makeStore(7);

		const {makeEffect, dispose} = makeReactiveRoot();

		expect(() =>
			makeEffect(() => {
				store1$.watch();
				makeEffect(() => {
					store2$.watch();
				});
			}),
		).to.throw(NestedEffectError);

		dispose();

		checkForMemoryLeaks();
	});

	it('batches updates', () => {
		const store1$ = makeStore(5);
		const store2$ = makeStore(7);

		const {makeEffect, dispose} = makeReactiveRoot();

		let effectRuns = 0;
		let actual: unknown;
		makeEffect(() => {
			effectRuns++;
			actual = store1$.watch() + store2$.watch();
		});
		expect(actual).to.eq(12);
		expect(effectRuns).to.eq(1);
		batchEffects(() => {
			store1$.set(6);
			store2$.set(8);
		});
		expect(effectRuns).to.eq(2);
		expect(actual).to.eq(14);

		dispose();

		checkForMemoryLeaks();
	});

	it('batches updates, throwing an error', () => {
		const store1$ = makeStore(5);
		const store2$ = makeStore(7);

		const {makeEffect, dispose} = makeReactiveRoot();

		let effectRuns = 0;
		let actual: unknown;
		expect(() =>
			makeEffect(() => {
				effectRuns++;
				actual = store1$.watch() + store2$.watch();
				throw new Error('test');
			}),
		).to.throw('test');
		expect(actual).to.eq(12);
		expect(effectRuns).to.eq(1);
		expect(() =>
			batchEffects(() => {
				store1$.set(6);
				store2$.set(8);
			}),
		).to.throw(BatchingEffectError);
		expect(effectRuns).to.eq(2);
		expect(actual).to.eq(14);

		dispose();

		checkForMemoryLeaks();
	});

	it('nests batchEffects', () => {
		const store1$ = makeStore(5);
		const store2$ = makeStore(7);
		const store3$ = makeStore(11);

		const {makeEffect, dispose} = makeReactiveRoot();

		let effectRuns = 0;
		let actual: unknown;
		makeEffect(() => {
			effectRuns++;
			actual = store1$.watch() + store2$.watch() + store3$.watch();
		});
		expect(actual).to.eq(23);
		expect(effectRuns).to.eq(1);
		batchEffects(() => {
			store1$.set(6);
			batchEffects(() => {
				store2$.set(8);
				store3$.set(10);
			});
		});
		expect(effectRuns).to.eq(2);
		expect(actual).to.eq(24);

		dispose();

		checkForMemoryLeaks();
	});

	it('nests batchEffects, throwing an error', () => {
		const store1$ = makeStore(5);
		const store2$ = makeStore(7);
		const store3$ = makeStore(11);

		const {makeEffect, dispose} = makeReactiveRoot();

		let effectRuns = 0;
		let actual: unknown;
		makeEffect(() => {
			effectRuns++;
			actual = store1$.watch() + store2$.watch() + store3$.watch();
		});
		expect(actual).to.eq(23);
		expect(effectRuns).to.eq(1);
		expect(() =>
			batchEffects(() => {
				store1$.set(6);
				batchEffects(() => {
					store2$.set(8);
					store3$.set(10);
					throw new Error('inner batch');
				});
			}),
		).to.throw(BatchingEffectError);
		expect(effectRuns).to.eq(2);
		expect(actual).to.eq(24);

		dispose();

		checkForMemoryLeaks();
	});

	it('re-runs an effect with a cleanup fn that throws an error', () => {
		const store1$ = makeStore(5);
		const store2$ = makeStore(7);
		const store3$ = makeStore(11);

		const {makeEffect, dispose} = makeReactiveRoot();

		let effectRuns = 0;
		let actual: unknown;
		makeEffect(() => {
			effectRuns++;
			actual = store1$.watch() + store2$.watch() + store3$.watch();

			return () => {
				throw new Error('test');
			};
		});
		expect(actual).to.eq(23);
		expect(effectRuns).to.eq(1);
		expect(() => store1$.set(6)).to.throw('test');
		expect(effectRuns).to.eq(1);
		expect(actual).to.eq(23);

		expect(() => dispose()).to.throw(ReactiveRootDisposeError);

		checkForMemoryLeaks();
	});

	it('registers an effect that throws an error', () => {
		const store1$ = makeStore(5);
		const store2$ = makeStore(7);
		const store3$ = makeStore(11);

		const {makeEffect, dispose} = makeReactiveRoot();

		let effectRuns = 0;
		let actual: unknown;
		expect(() =>
			makeEffect(() => {
				effectRuns++;
				actual = store1$.watch() + store2$.watch() + store3$.watch();

				throw new Error('test');
			}),
		).to.throw();
		expect(actual).to.eq(23);
		expect(effectRuns).to.eq(1);
		expect(() => store1$.set(6)).to.throw('test');
		expect(effectRuns).to.eq(2);
		expect(actual).to.eq(24);

		expect(() =>
			makeEffect(() => {
				actual = store1$.watch();
			}),
		).not.to.throw();
		expect(actual).to.eq(store1$.content());

		dispose();

		checkForMemoryLeaks();
	});

	it('calls dispose, throwing an error', () => {
		const store1$ = makeStore(5);
		const store2$ = makeStore(7);
		const store3$ = makeStore(11);

		const {makeEffect, dispose} = makeReactiveRoot();

		let effectRuns = 0;
		let actual: unknown;
		makeEffect(() => {
			effectRuns++;
			actual = store1$.watch() + store2$.watch() + store3$.watch();

			return () => {
				throw new Error('test');
			};
		});
		expect(actual).to.eq(23);
		expect(effectRuns).to.eq(1);
		expect(() => dispose()).to.throw(ReactiveRootDisposeError);

		checkForMemoryLeaks();
	});

	it('calls watch outside an effect', () => {
		const store1$ = makeStore(5);
		expect(store1$.watch()).to.eq(5);

		checkForMemoryLeaks();
	});

	it('calls watch multiple times inside the same effect', () => {
		const store1$ = makeStore(0);
		const store2$ = makeStore(0);
		const {makeEffect, dispose} = makeReactiveRoot();

		let effectRuns = 0;
		makeEffect(() => {
			store1$.watch();
			store1$.watch();
			store1$.watch();
			store2$.watch();
			store2$.watch();
			store2$.watch();
			effectRuns++;
		});
		expect(effectRuns).to.eq(1);
		store1$.set(1);
		expect(effectRuns).to.eq(2);
		store2$.set(1);
		expect(effectRuns).to.eq(3);
		batchEffects(() => {
			store1$.set(2);
			store2$.set(2);
		});
		expect(effectRuns).to.eq(4);

		dispose();

		checkForMemoryLeaks();
	});
});
