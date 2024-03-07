import {makeReactiveRoot, makeStore} from './lib';

const random$ = makeStore(0);

random$.subscribe((r) => console.log('random value from subscription: ', r));
const {makeEffect} = makeReactiveRoot();
makeEffect(() => console.log('random value from effect: ', random$.watch()));

const interval = setInterval(() => {
	random$.set(Math.random());
}, 600);

setTimeout(() => {
	clearInterval(interval);
}, 3000);
