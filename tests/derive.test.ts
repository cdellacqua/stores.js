import {expect} from 'chai';
import {makeDerivedStore, makeReadonlyStore, makeStore, ReadonlyStore} from '../src/lib';

describe('derived store', () => {
	it('creates a derived using one source', () => {
		const source$ = makeReadonlyStore(1);
		const derived$ = makeDerivedStore(source$, (x) => x * 2);
		expect(derived$.content()).to.eq(2);
	});

	it('creates a derived using two sources', () => {
		const source1$ = makeReadonlyStore(7);
		const source2$ = makeReadonlyStore(13);
		const derived$ = makeDerivedStore({v1: source1$, v2: source2$}, ({v1, v2}) => v1 * v2);
		expect(derived$.content()).to.eq(7 * 13);
	});

	it('creates a derived using two sources of different types', () => {
		const source1$ = makeReadonlyStore(7);
		const source2$ = makeReadonlyStore('13');
		const derived$ = makeDerivedStore({v1: source1$, v2: source2$}, ({v1, v2}) => v1 + Number(v2));
		expect(derived$.content()).to.eq(7 + 13);
	});

	it('tests that the derived store is reactive to change', () => {
		const source1$ = makeStore(7);
		const source2$ = makeStore(13);
		const derived$ = makeDerivedStore({v1: source1$, v2: source2$}, ({v1, v2}) => v1 * v2);
		expect(derived$.content()).to.eq(7 * 13);
		source1$.set(5);
		expect(derived$.content()).to.eq(5 * 13);
		source2$.set(11);
		expect(derived$.content()).to.eq(5 * 11);
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
		const derived$ = makeDerivedStore({v1: source1$, v2: source2$}, ({v1, v2}) => v1 * v2);
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

		expect(source1$.content()).to.eq(13);
		expect(source2$.content()).to.eq(23);
		expect(starts1).to.eq(1);
		expect(stops1).to.eq(1);
		expect(starts2).to.eq(1);
		expect(stops2).to.eq(1);
		expect(derived$.content()).to.eq(13 * 23);
		expect(starts1).to.eq(2);
		expect(stops1).to.eq(2);
		expect(starts2).to.eq(2);
		expect(stops2).to.eq(2);

		let actual = 0;
		const unsubscribe = derived$.subscribe((newValue) => (actual = newValue));
		expect(actual).to.eq(13 * 23);
		expect(starts1).to.eq(3);
		expect(stops1).to.eq(2);
		expect(starts2).to.eq(3);
		expect(stops2).to.eq(2);

		source1$.set(3);
		source2$.set(7);

		expect(actual).to.eq(3 * 7);
		expect(starts1).to.eq(3);
		expect(stops1).to.eq(2);
		expect(starts2).to.eq(3);
		expect(stops2).to.eq(2);

		expect(derived$.content()).to.eq(3 * 7);
		expect(starts1).to.eq(3);
		expect(stops1).to.eq(2);
		expect(starts2).to.eq(3);
		expect(stops2).to.eq(2);

		unsubscribe();
		expect(starts1).to.eq(3);
		expect(stops1).to.eq(3);
		expect(starts2).to.eq(3);
		expect(stops2).to.eq(3);
	});

	it('checks the default comparator mechanism using primitives', () => {
		const store$ = makeStore('hello');
		const derived$ = makeDerivedStore(store$, (content) => content.length);
		let calls = 0;
		derived$.subscribe(() => calls++);
		expect(calls).to.eq(1);
		store$.set('world');
		expect(calls).to.eq(1);
		store$.set('hello!');
		expect(calls).to.eq(2);
	});

	it('checks the comparator mechanism using a custom function', () => {
		const store$ = makeStore('hello');
		const derived$ = makeDerivedStore(store$, (content) => content.length, {
			// consider equal if both are even or both are odd.
			comparator: (a, b) => a % 2 === b % 2,
		});
		let calls = 0;
		derived$.subscribe(() => calls++);
		expect(calls).to.eq(1);
		store$.set('hello world');
		expect(calls).to.eq(1);
		store$.set('hello!');
		expect(calls).to.eq(2);
		store$.set('hello!hello!');
		expect(calls).to.eq(2);
	});

	it('checks the default comparator mechanism using primitives and multiple sources', () => {
		const store1$ = makeStore('hello');
		const store2$ = makeStore('hello');
		const derived$ = makeDerivedStore(
			{content1: store1$, content2: store2$},
			({content1, content2}) => (content1 + content2).length,
		);
		let calls = 0;
		derived$.subscribe(() => calls++);
		expect(calls).to.eq(1);
		store1$.set('world');
		expect(calls).to.eq(1);
		store1$.set('hello!');
		expect(calls).to.eq(2);

		store2$.set('world');
		expect(calls).to.eq(2);
		store2$.set('hello!');
		expect(calls).to.eq(3);
	});

	it('checks the comparator mechanism using a custom function and multiple sources', () => {
		const store1$ = makeStore('hello');
		const store2$ = makeStore('hello');
		const derived$ = makeDerivedStore(
			{content1: store1$, content2: store2$},
			({content1, content2}) => (content1 + content2).length,
			{
				// consider equal if both are even or both are odd.
				comparator: (a, b) => a % 2 === b % 2,
			},
		);
		let calls = 0;
		derived$.subscribe(() => calls++);
		expect(calls).to.eq(1);
		store1$.set('hello world');
		expect(calls).to.eq(1);
		store1$.set('hello!');
		expect(calls).to.eq(2);
		store1$.set('hello!hello!');
		expect(calls).to.eq(2);

		store2$.set('hello world');
		expect(calls).to.eq(2);
		store2$.set('hello!');
		expect(calls).to.eq(3);
		store2$.set('hello!hello!');
		expect(calls).to.eq(3);
	});

	it('chains multiple derived stores', () => {
		const base$ = makeStore('hello');
		const identityPlusOne = (x: string) => x + '1';
		const chainLength = 100;
		const chain: ReadonlyStore<string>[] = new Array(chainLength);
		const subscriberValues: string[] = new Array(chainLength);
		for (let i = 0; i < chainLength; i++) {
			if (i === 0) {
				chain[i] = makeDerivedStore(base$, identityPlusOne);
			} else {
				chain[i] = makeDerivedStore(chain[i - 1], identityPlusOne);
			}
			chain[i].subscribe((v) => (subscriberValues[i] = v));
			expect(subscriberValues.reduce((sum, cur) => sum + (cur !== undefined ? 1 : 0), 0)).to.eq(
				i + 1,
			);
			for (let j = 0; j <= i; j++) {
				if (j < i) {
					// Each derived has an explicit subscription (the one created above)
					// and an implicit subscription (because each derived depends on the previous one).
					expect(chain[j].nOfSubscriptions()).to.eq(2, `i: ${i}, j: ${j}`);
				} else {
					// The last store only has the explicit subscription.
					expect(chain[j].nOfSubscriptions()).to.eq(1, `i: ${i}, j: ${j}`);
				}
			}
		}
		expect(chain[chain.length - 1].content()).to.eq('hello' + '1'.repeat(chainLength));
	});

	it('tests the derived store cache when references are involved', () => {
		const base$ = makeStore({hello: 'world!'});
		const derived$ = makeDerivedStore({x: base$}, (x) => x, {
			comparator: (a, b) => a.x.hello === b.x.hello,
		});
		let calls = 0;
		derived$.subscribe(() => calls++);
		expect(calls).to.eq(1);
		base$.set({hello: 'welt!'});
		expect(calls).to.eq(2);
	});

	it('tests that makeDerivedStore also accepts an array', () => {
		const source1$ = makeStore('hello');
		const source2$ = makeStore({word: 'world!'});
		const derived$ = makeDerivedStore(
			[source1$, source2$],
			([first, second]) => first + ' ' + second.word,
		);
		expect(derived$.content()).to.eq('hello world!');
		expect(derived$.nOfSubscriptions()).to.eq(0);
	});

	it('tests makeDerivedStore with an empty object', () => {
		const derived$ = makeDerivedStore({}, () => 'hello');
		expect(derived$.content()).to.eq('hello');
		expect(derived$.nOfSubscriptions()).to.eq(0);
	});

	it('tests makeDerivedStore with an empty array', () => {
		const derived$ = makeDerivedStore([], () => 'hello');
		expect(derived$.content()).to.eq('hello');
		expect(derived$.nOfSubscriptions()).to.eq(0);
	});
});
