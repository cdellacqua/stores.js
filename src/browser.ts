import './style.css';
import {makeDerivedStore, makeReactiveRoot, makeStore} from './lib';

const appDiv = document.getElementById('app') as HTMLDivElement;

// Using just stores
{
	const titleH2 = document.createElement('h2');
	titleH2.textContent = 'Using just stores';
	appDiv.appendChild(titleH2);

	const random1$ = makeStore(0);
	const random2$ = makeStore(0);
	const sum$ = makeDerivedStore({r1: random1$, r2: random2$}, ({r1, r2}) => r1 + r2);

	const span1 = document.createElement('span');
	appDiv.appendChild(span1);
	const span2 = document.createElement('span');
	appDiv.appendChild(span2);
	const spanSum = document.createElement('span');
	appDiv.appendChild(spanSum);

	random1$.subscribe((r1) => (span1.textContent = `${r1} + `));
	random2$.subscribe((r2) => (span2.textContent = `${r2} = `));
	sum$.subscribe((sum) => (spanSum.textContent = `${sum}`));

	appDiv.appendChild(document.createElement('br'));

	const button1 = document.createElement('button');
	button1.textContent = 'random1';
	button1.addEventListener('click', () => random1$.set(Math.floor(100 * Math.random())));
	appDiv.appendChild(button1);

	const button2 = document.createElement('button');
	button2.textContent = 'random2';
	button2.addEventListener('click', () => random2$.set(Math.floor(100 * Math.random())));
	appDiv.appendChild(button2);

	appDiv.appendChild(document.createElement('br'));
	appDiv.appendChild(document.createElement('br'));
	appDiv.appendChild(document.createElement('br'));
	appDiv.appendChild(document.createElement('br'));
}
// Using the effect system
{
	const titleH2 = document.createElement('h2');
	titleH2.textContent = 'Using the effect system';
	appDiv.appendChild(titleH2);

	const random1$ = makeStore(0);
	const random2$ = makeStore(0);
	const sum = () => random1$.watch() + random2$.watch();

	const span1 = document.createElement('span');
	appDiv.appendChild(span1);
	const span2 = document.createElement('span');
	appDiv.appendChild(span2);
	const spanSum = document.createElement('span');
	appDiv.appendChild(spanSum);

	const {makeEffect} = makeReactiveRoot();
	makeEffect(() => {
		span1.textContent = `${random1$.watch()} + `;
		span2.textContent = `${random2$.watch()} = `;
	});
	// showcase a derived-like behavior
	makeEffect(() => {
		spanSum.textContent = `${sum()}`;
	});

	appDiv.appendChild(document.createElement('br'));

	const button1 = document.createElement('button');
	button1.textContent = 'random1';
	button1.addEventListener('click', () => random1$.set(Math.floor(100 * Math.random())));
	appDiv.appendChild(button1);

	const button2 = document.createElement('button');
	button2.textContent = 'random2';
	button2.addEventListener('click', () => random2$.set(Math.floor(100 * Math.random())));
	appDiv.appendChild(button2);
}
