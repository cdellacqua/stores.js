import './style.css';
import {makeDerivedStore, makeStore} from './lib';

const appDiv = document.getElementById('app') as HTMLDivElement;

const random1$ = makeStore(0);
const random2$ = makeStore(0);
const sum$ = makeDerivedStore({r1: random1$, r2: random2$}, ({r1, r2}) => r1 + r2);

const span1 = document.createElement('span');
appDiv.appendChild(span1);
const span2 = document.createElement('span');
appDiv.appendChild(span2);
const spanSum = document.createElement('span');
appDiv.appendChild(spanSum);

random1$.subscribe((r1) => (span1.innerText = String(r1) + ' + '));
random2$.subscribe((r2) => (span2.innerText = String(r2) + ' = '));
sum$.subscribe((sum) => (spanSum.innerText = String(sum)));

appDiv.appendChild(document.createElement('br'));

const button1 = document.createElement('button');
button1.innerText = 'random1';
button1.addEventListener('click', () => random1$.set(Math.floor(10 * Math.random())));
appDiv.appendChild(button1);

const button2 = document.createElement('button');
button2.innerText = 'random2';
button2.addEventListener('click', () => random2$.set(Math.floor(10 * Math.random())));
appDiv.appendChild(button2);
