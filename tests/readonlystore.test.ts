import {expect} from 'chai';
import {makeReadonlyStore} from '../src/lib';

describe('store', () => {
	it('creates a store', () => {
		const store$ = makeReadonlyStore(0);
		expect(store$.content()).to.eq(0);
		expect(store$.nOfSubscriptions()).to.eq(0);
	});

	it('initializes the store using a StartHandler', () => {
		const store$ = makeReadonlyStore<number>(undefined, (set) => {
			set(0);
		});
		expect(store$.content()).to.eq(0);
	});

	it('initializes the store using a StartHandler that modifies the current value every time it gets called', () => {
		let value = 0;
		const store$ = makeReadonlyStore<number>(undefined, (set) => {
			value++;
			set(value);
		});
		expect(store$.content()).to.eq(1);
		expect(store$.content()).to.eq(2);
		expect(store$.content()).to.eq(3);
	});

	it('tests that the StartHandler gets called whenever the store gets at least one subscriber', () => {
		let starts = 0;
		let stops = 0;
		const store$ = makeReadonlyStore(1, () => {
			starts++;
			return () => stops++;
		});
		expect(starts).to.eq(0);
		expect(stops).to.eq(0);
		store$.content();
		expect(starts).to.eq(1);
		expect(stops).to.eq(1);
		const unsubscribe = store$.subscribe(() => undefined);
		expect(starts).to.eq(2);
		expect(stops).to.eq(1);
		unsubscribe();
		expect(starts).to.eq(2);
		expect(stops).to.eq(2);
	});

	it('checks that getting a value triggers the StartHandler when the store has no active subscriptions', () => {
		let starts = 0;
		let stops = 0;
		const store$ = makeReadonlyStore(0, () => {
			starts++;
			return () => stops++;
		});
		expect(starts).to.eq(0);
		expect(stops).to.eq(0);
		expect(store$.content()).to.eq(0);
		expect(starts).to.eq(1);
		expect(stops).to.eq(1);
		expect(store$.content()).to.eq(0);
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
		const store$ = makeReadonlyStore<number>(0, () => {
			starts++;
			return () => stops++;
		});

		const unsubscribe = store$.subscribe(() => undefined);

		expect(starts).to.eq(1);
		expect(stops).to.eq(0);
		expect(store$.content()).to.eq(0);
		expect(starts).to.eq(1);
		expect(stops).to.eq(0);
		unsubscribe();
		expect(stops).to.eq(1);
		expect(store$.content()).to.eq(0);
		expect(starts).to.eq(2);
		expect(stops).to.eq(2);
	});

	it('checks that the number of subscription is consistent', () => {
		const store$ = makeReadonlyStore(0);
		expect(store$.nOfSubscriptions()).to.eq(0);
		const unsubscribe1 = store$.subscribe(() => undefined);
		expect(store$.nOfSubscriptions()).to.eq(1);
		const unsubscribe2 = store$.subscribe(() => undefined);
		expect(store$.nOfSubscriptions()).to.eq(2);
		const unsubscribe3 = store$.subscribe(() => undefined);
		expect(store$.nOfSubscriptions()).to.eq(3);
		const unsubscribe4 = store$.subscribe(() => undefined);
		expect(store$.nOfSubscriptions()).to.eq(4);
		unsubscribe4();
		expect(store$.nOfSubscriptions()).to.eq(3);
		unsubscribe3();
		expect(store$.nOfSubscriptions()).to.eq(2);
		unsubscribe2();
		expect(store$.nOfSubscriptions()).to.eq(1);
		unsubscribe1();
		expect(store$.nOfSubscriptions()).to.eq(0);
	});
});
