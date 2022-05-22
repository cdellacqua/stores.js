import {expect} from 'chai';
import {makeDerivedStore, makeReadonlyStore, makeStore} from '../src/lib';

describe('derived store', () => {
	it('creates a derived using one source', () => {
		const source$ = makeReadonlyStore(1);
		const derived$ = makeDerivedStore(source$, (x) => x * 2);
		expect(derived$.value).to.eq(2);
	});

	it('creates a derived using two sources', () => {
		const source1$ = makeReadonlyStore(7);
		const source2$ = makeReadonlyStore(13);
		const derived$ = makeDerivedStore([source1$, source2$], ([v1, v2]) => v1 * v2);
		expect(derived$.value).to.eq(7 * 13);
	});

	it('tests that the derived store is reactive to change', () => {
		const source1$ = makeStore(7);
		const source2$ = makeStore(13);
		const derived$ = makeDerivedStore([source1$, source2$], ([v1, v2]) => v1 * v2);
		expect(derived$.value).to.eq(7 * 13);
		source1$.set(5);
		expect(derived$.value).to.eq(5 * 13);
		source2$.set(11);
		expect(derived$.value).to.eq(5 * 11);
	});

	it('tests the StartHandler on the sources', () => {
		let starts1 = 0;
		let stops1 = 0;
		let starts2 = 0;
		let stops2 = 0;
		const source1$ = makeStore(13, () => {
			starts1++;
			return () => stops1++;
		});
		const source2$ = makeStore(2, () => {
			starts2++;
			return () => stops2++;
		});
		const derived$ = makeDerivedStore([source1$, source2$], ([v1, v2]) => v1 * v2);
		expect(starts1).to.eq(0);
		expect(stops1).to.eq(0);
		expect(starts2).to.eq(0);
		expect(stops2).to.eq(0);
		source1$.set(13);
		source2$.set(23);
		expect(starts1).to.eq(0);
		expect(stops1).to.eq(0);
		expect(starts2).to.eq(0);
		expect(stops2).to.eq(0);

		expect(derived$.value).to.eq(13 * 23);
		expect(starts1).to.eq(1);
		expect(stops1).to.eq(1);
		expect(starts2).to.eq(1);
		expect(stops2).to.eq(1);

		let actual = 0;
		const unsubscribe = derived$.subscribe((newValue) => (actual = newValue));
		expect(actual).to.eq(13 * 23);
		expect(starts1).to.eq(2);
		expect(stops1).to.eq(1);
		expect(starts2).to.eq(2);
		expect(stops2).to.eq(1);

		source1$.set(3);
		source2$.set(7);

		expect(actual).to.eq(3 * 7);
		expect(starts1).to.eq(2);
		expect(stops1).to.eq(1);
		expect(starts2).to.eq(2);
		expect(stops2).to.eq(1);

		expect(derived$.value).to.eq(3 * 7);
		expect(starts1).to.eq(2);
		expect(stops1).to.eq(1);
		expect(starts2).to.eq(2);
		expect(stops2).to.eq(1);

		unsubscribe();
		expect(starts1).to.eq(2);
		expect(stops1).to.eq(2);
		expect(starts2).to.eq(2);
		expect(stops2).to.eq(2);
	});
});
