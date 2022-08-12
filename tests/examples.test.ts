import {expect} from 'chai';
import {makeDerivedStore, makeReadonlyStore, makeStore, ReadonlyStore} from '../src/lib';

describe('examples', () => {
	it('readme 1', () => {
		const store$ = makeStore(0);
		expect(store$.content()).to.eq(0); // 0
		store$.set(1);
		expect(store$.content()).to.eq(1); // 1
	});
	it('readme 2', () => {
		const store$ = makeStore(0);
		expect(store$.content()).to.eq(0); // 0
		let actual = -1;
		const unsubscribe = store$.subscribe((v) => (actual = v)); // immediately prints 0
		expect(actual).to.eq(0);
		store$.set(1); // triggers the above subscriber, printing 1
		expect(actual).to.eq(1);
		unsubscribe();
		store$.set(2); // 2 is saved in the store, but nothing gets printed because the subscription has been removed
		expect(actual).to.eq(1);
		store$.subscribe((v) => (actual = v)); // immediately prints 2
		expect(actual).to.eq(2);
	});
	it('readme 3', () => {
		const store$ = makeStore(0);
		let actual = -1;
		store$.subscribe((v) => (actual = v)); // immediately prints 0
		expect(actual).to.eq(0);
		const plusOne = (n: number) => n + 1;
		store$.update(plusOne); // triggers the above subscriber, printing 1
		expect(actual).to.eq(1);
		store$.update(plusOne); // triggers the above subscriber, printing 2
		expect(actual).to.eq(2);
		store$.update(plusOne); // triggers the above subscriber, printing 3
		expect(actual).to.eq(3);
	});
	it('readme 4', () => {
		const store$ = makeStore(0);
		let calls = 0;
		let actual = -1;
		const subscriber = (v: number) => {
			actual = v;
			calls++;
		};
		const unsubscribe1 = store$.subscribe(subscriber); // prints 0
		expect(actual).to.eq(0);
		expect(calls).to.eq(1);
		const unsubscribe2 = store$.subscribe(subscriber); // prints 0
		expect(calls).to.eq(2);
		const unsubscribe3 = store$.subscribe(subscriber); // prints 0
		expect(calls).to.eq(3);
		expect(store$.nOfSubscriptions()).to.eq(1); // 1
		unsubscribe3(); // will remove "subscriber"
		unsubscribe2(); // won't do anything, "subscriber" has already been removed
		unsubscribe1(); // won't do anything, "subscriber" has already been removed
		expect(store$.nOfSubscriptions()).to.eq(0); // 0
	});
	it('readme 5', () => {
		const store$ = makeStore(0);
		let calls = 0;
		const subscriber = () => calls++;
		expect(store$.nOfSubscriptions()).to.eq(0); // 0
		const unsubscribe1 = store$.subscribe(subscriber); // prints 0
		expect(calls).to.eq(1);
		expect(store$.nOfSubscriptions()).to.eq(1); // 1
		const unsubscribe2 = store$.subscribe(() => subscriber()); // prints 0
		expect(calls).to.eq(2);
		expect(store$.nOfSubscriptions()).to.eq(2); // 2
		unsubscribe2();
		expect(store$.nOfSubscriptions()).to.eq(1); // 1
		unsubscribe1();
		expect(store$.nOfSubscriptions()).to.eq(0); // 0
	});
	it('readme 6', () => {
		const store$ = makeStore(1);
		const derived$ = makeDerivedStore(store$, (n) => n + 100);
		let actual = -1;
		derived$.subscribe((v) => (actual = v)); // prints 101
		expect(actual).to.eq(101);
		store$.set(3); // will trigger console.log, printing 103
		expect(actual).to.eq(103);
	});
	it('readme 6.5', () => {
		const firstWord$ = makeStore('hello');
		const secondWord$ = makeStore('world!');
		const derived$ = makeDerivedStore({first: firstWord$, second: secondWord$}, ({first, second}) => `${first} ${second}`);
		let actual = '';
		derived$.subscribe((v) => (actual = v)); // prints "hello world!"
		expect(actual).to.eq('hello world!');
		firstWord$.set('hi'); // will trigger console.log, printing "hi world!"
		expect(actual).to.eq('hi world!');
	});
	it('readme 7', () => {
		let output = '';
		let calls = 0;
		const oneHertzPulse$ = makeReadonlyStore<number>(undefined, (set) => {
			output = 'start';
			set(performance.now());
			const interval = setInterval(() => {
				set(performance.now());
			}, 10);

			return () => {
				output = 'cleanup';
				clearInterval(interval);
			};
		});
		let actual: number | undefined;
		const unsubscribe = oneHertzPulse$.subscribe((v) => {
			calls++;
			actual = v;
		}); // prints "start" followed by the current time
		expect(actual).not.to.be.undefined;
		expect(output).to.eq('start');
		// for the next five seconds the store will print the current time each second
		setTimeout(() => {
			// prints "cleanup" followed by the current time
			unsubscribe();
			expect(output).to.eq('cleanup');
			expect(calls).to.be.greaterThan(2);
		}, 50);
	});
	it('readme 8', () => {
		const objectStore$ = makeStore(
			{veryLongText: '...', hash: 0xffaa},
			{
				comparator: (a, b) => a.hash === b.hash,
			},
		);
		let calls = 0;
		objectStore$.subscribe(() => calls++);
		expect(calls).to.eq(1);
		objectStore$.set({veryLongText: '...', hash: 0xbbdd}); // will trigger subscribers
		expect(calls).to.eq(2);
		objectStore$.set({veryLongText: '...', hash: 0xbbdd}); // won't trigger subscribers
		expect(calls).to.eq(2);
	});
	it('readme 9', () => {
		const objectStore$ = makeStore({veryLongText: '...', hash: 0xffaa});
		const derivedObjectStore$ = makeDerivedStore(objectStore$, (x) => x, {
			comparator: (a, b) => a.hash === b.hash,
		});
		let calls = 0;
		let derivedCalls = 0;
		objectStore$.subscribe(() => calls++);
		derivedObjectStore$.subscribe(() => derivedCalls++);
		expect(calls).to.eq(1);
		expect(derivedCalls).to.eq(1);
		objectStore$.set({veryLongText: '...', hash: 0xbbdd}); // will trigger objectStore$ and derivedObjectStore$ subscribers
		expect(calls).to.eq(2);
		expect(derivedCalls).to.eq(2);
		objectStore$.set({veryLongText: '...', hash: 0xbbdd}); // will only trigger objectStore$ subscribers
		expect(calls).to.eq(3);
		expect(derivedCalls).to.eq(2);
	});
	it('store', () => {
		const store$ = makeStore(0);
		expect(store$.content()).to.eq(0); // 0
		let actual = -1;
		store$.subscribe((v) => (actual = v));
		expect(actual).to.eq(0);
		store$.set(10); // will trigger the above console log, printing 10
		expect(actual).to.eq(10);
	});
	it('readonly store', () => {
		let value = 0;
		const store$ = makeReadonlyStore(value, (set) => {
			value++;
			set(value);
		});
		expect(store$.content()).to.eq(1); // 1
		let actual = -1;
		store$.subscribe((v) => (actual = v)); // immediately prints 2
		expect(actual).to.eq(2); // 2
		expect(store$.content()).to.eq(2); // 2
	});
	it('derived', () => {
		const source$ = makeStore(10);
		const derived$ = makeDerivedStore(source$, (v) => v * 2);
		let actualSource = -1;
		let actualDerived = -1;
		source$.subscribe((v) => (actualSource = v)); // prints 10
		expect(actualSource).to.eq(10);
		derived$.subscribe((v) => (actualDerived = v)); // prints 20
		expect(actualDerived).to.eq(20);
		source$.set(16); // triggers both console.logs, printing 16 and 32
		expect(actualSource).to.eq(16);
		expect(actualDerived).to.eq(32);
	});
	it('derived from multiple sources', () => {
		const source1$ = makeStore(10);
		const source2$ = makeStore(-10);
		const derived$ = makeDerivedStore({v1: source1$, v2: source2$}, ({v1, v2}) => v1 + v2);
		let actual1 = -1;
		let actual2 = -1;
		let actualDerived = -1;
		source1$.subscribe((v) => (actual1 = v)); // prints 10
		expect(actual1).to.eq(10);
		source2$.subscribe((v) => (actual2 = v)); // prints -10
		expect(actual2).to.eq(-10);
		derived$.subscribe((v) => (actualDerived = v)); // prints 0
		expect(actualDerived).to.eq(0);
		source1$.set(11); // prints 11 (first console.log) and 1 (third console.log)
		expect(actual1).to.eq(11);
		expect(actual2).to.eq(-10);
		expect(actualDerived).to.eq(1);
		source2$.set(9); // prints 9 (second console.log) and 20 (third console.log)
		expect(actual1).to.eq(11);
		expect(actual2).to.eq(9);
		expect(actualDerived).to.eq(20);
	});

	it('readme destructuring', () => {
		function makeCounterStore(): ReadonlyStore<number> & {increment(): void} {
			const {subscribe, content, update, nOfSubscriptions} = makeStore(0);
			return {
				subscribe,
				content,
				nOfSubscriptions,
				increment() {
					update((n) => n + 1);
				},
			};
		}

		let actual = -1;
		const counter$ = makeCounterStore();
		counter$.subscribe((v) => {
			actual = v;
		}); // immediately prints 0
		expect(actual).to.eq(0);
		counter$.increment(); // will trigger the above console.log, printing 1
		expect(actual).to.eq(1);
	});

	it('changelog v1 to v2, example 1', () => {
		const base$ = makeStore(0);
		const extended$ = {
			...base$,
			increment() {
				base$.update((n) => n + 1);
			},
		};
		expect(extended$.content()).to.eq(0); // 0
		extended$.increment();
		expect(extended$.content()).to.eq(1); // 1 [correct]
	});

	it('changelog v1 to v2, example 2', () => {
		const source1$ = makeStore(6);
		const source2$ = makeStore(3);
		// The commented code below would cause a TypeScript error, specifically "Property 'v3' does not exist on type '{ v1: number; v2: number; }'"
		// const derived$ = makeDerivedStore({v1: source1$, v2: source2$}, ({v1, v2, v3}) => v1 + v2 + v3);
		const derived$ = makeDerivedStore({v1: source1$, v2: source2$}, ({v1, v2}) => v1 + v2);
		expect(derived$.content()).to.eq(9); // 9, because the computation above would resolve to 6 + 3
	});
});
