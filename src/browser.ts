import {makeDerivedStore, makeStore} from './lib';

const random1$ = makeStore(0);
const random2$ = makeStore(0);
const sum$ = makeDerivedStore([random1$, random2$], ([r1, r2]) => r1 + r2);

const span1 = document.createElement('span');
document.body.appendChild(span1);
const span2 = document.createElement('span');
document.body.appendChild(span2);
const spanSum = document.createElement('span');
document.body.appendChild(spanSum);

random1$.subscribe((r1) => (span1.innerText = String(r1) + ' + '));
random2$.subscribe((r2) => (span2.innerText = String(r2) + ' = '));
sum$.subscribe((sum) => (spanSum.innerText = String(sum)));

document.body.appendChild(document.createElement('br'));

const button1 = document.createElement('button');
button1.innerText = 'random1';
button1.addEventListener('click', () => random1$.set(Math.floor(10 * Math.random())));
document.body.appendChild(button1);

const button2 = document.createElement('button');
button2.innerText = 'random2';
button2.addEventListener('click', () => random2$.set(Math.floor(10 * Math.random())));
document.body.appendChild(button2);
