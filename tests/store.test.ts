import {expect} from 'chai';
import {makeStore} from '../src/lib';

describe('store', () => {
	it('creates a store', () => {
		const store$ = makeStore(0);
		expect(store$.value).to.eq(0);
		expect(store$.nOfSubscriptions).to.eq(0);
	});

	it('initializes the store using a StartHandler', () => {
		const store$ = makeStore<number>(undefined, (set) => {
			set(0);
		});
		expect(store$.value).to.eq(0);
	});

	it('initializes the store using a StartHandler that modifies the current value every time it gets called', () => {
		let value = 0;
		const store$ = makeStore<number>(undefined, (set) => {
			value++;
			set(value);
		});
		expect(store$.value).to.eq(1);
		expect(store$.value).to.eq(2);
		expect(store$.value).to.eq(3);
	});

	it('tests that the StartHandler gets called whenever the store gets at least one subscriber', () => {
		let starts = 0;
		let stops = 0;
		const store$ = makeStore(1, () => {
			starts++;
			return () => stops++;
		});
		expect(starts).to.eq(0);
		expect(stops).to.eq(0);
		store$.value;
		expect(starts).to.eq(1);
		expect(stops).to.eq(1);
		const unsubscribe = store$.subscribe(() => undefined);
		expect(starts).to.eq(2);
		expect(stops).to.eq(1);
		unsubscribe();
		expect(starts).to.eq(2);
		expect(stops).to.eq(2);
	});

	it('adds the same subscriber twice', () => {
		const store$ = makeStore(0);
		let count = 0;
		const subscriber = () => {
			count++;
		};
		expect(store$.nOfSubscriptions).to.eq(0);
		store$.subscribe(subscriber);
		expect(store$.nOfSubscriptions).to.eq(1);
		store$.subscribe(subscriber);
		expect(store$.nOfSubscriptions).to.eq(1);
		store$.set(10);
		expect(count).to.eq(3);
	});

	it('sets a new value expecting that all subscribers receive it', () => {
		const store$ = makeStore(0);
		expect(store$.value).to.eq(0);
		let actual = -1;
		store$.subscribe((v) => (actual = v));
		expect(actual).to.eq(0);
		store$.set(1);
		expect(actual).to.eq(1);
	});

	it('updates the value expecting that all subscribers receive the new one', () => {
		const store$ = makeStore(0);
		expect(store$.value).to.eq(0);
		let actual = -1;
		store$.subscribe((v) => (actual = v));
		expect(actual).to.eq(0);
		store$.update((v) => v + 1);
		expect(actual).to.eq(1);
	});

	it('checks that getting a value triggers the StartHandler when the store has no active subscriptions', () => {
		let starts = 0;
		let stops = 0;
		const store$ = makeStore(0, () => {
			starts++;
			return () => stops++;
		});
		expect(starts).to.eq(0);
		expect(stops).to.eq(0);
		expect(store$.value).to.eq(0);
		expect(starts).to.eq(1);
		expect(stops).to.eq(1);
		expect(store$.value).to.eq(0);
		expect(starts).to.eq(2);
		expect(stops).to.eq(2);

		let actual = 0;
		store$.subscribe((v) => (actual = v));
		expect(actual).to.eq(0);
		expect(starts).to.eq(3);
		expect(stops).to.eq(2);
	});
	it('checks that getting a value does not trigger the StartHandler when the store has at least one active subscription', () => {
		let starts = 0;
		let stops = 0;
		const store$ = makeStore(0, () => {
			starts++;
			return () => stops++;
		});

		const unsubscribe = store$.subscribe(() => undefined);

		expect(starts).to.eq(1);
		expect(stops).to.eq(0);
		expect(store$.value).to.eq(0);
		expect(starts).to.eq(1);
		expect(stops).to.eq(0);
		unsubscribe();
		expect(stops).to.eq(1);
		expect(store$.value).to.eq(0);
		expect(starts).to.eq(2);
		expect(stops).to.eq(2);
	});

	it('checks that the number of subscription is consistent', () => {
		const store$ = makeStore(0);
		expect(store$.nOfSubscriptions).to.eq(0);
		store$.set(1);
		expect(store$.nOfSubscriptions).to.eq(0);
		const unsubscribe1 = store$.subscribe(() => undefined);
		expect(store$.nOfSubscriptions).to.eq(1);
		const unsubscribe2 = store$.subscribe(() => undefined);
		expect(store$.nOfSubscriptions).to.eq(2);
		const unsubscribe3 = store$.subscribe(() => undefined);
		expect(store$.nOfSubscriptions).to.eq(3);
		const unsubscribe4 = store$.subscribe(() => undefined);
		expect(store$.nOfSubscriptions).to.eq(4);
		unsubscribe4();
		expect(store$.nOfSubscriptions).to.eq(3);
		unsubscribe3();
		expect(store$.nOfSubscriptions).to.eq(2);
		unsubscribe2();
		expect(store$.nOfSubscriptions).to.eq(1);
		unsubscribe1();
		expect(store$.nOfSubscriptions).to.eq(0);
	});
});
