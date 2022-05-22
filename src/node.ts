import {makeStore} from './lib';

const random$ = makeStore(0);

random$.subscribe(console.log);

const interval = setInterval(() => {
	random$.set(Math.random());
}, 600);

setTimeout(() => {
	clearInterval(interval);
}, 3000);
