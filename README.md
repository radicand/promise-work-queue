# promise-work-queue

[![Dependency Status](https://img.shields.io/david/radicand/promise-work-queue.svg?style=flat)](https://david-dm.org/radicand/promise-work-queue)
[![npm version](https://badge.fury.io/js/promise-work-queue.svg?style=flat)](http://badge.fury.io/js/promise-work-queue)

Build a flexible promise-based workflow queue and then pipe payloads into it for concurrency-managed processing.

The point is to eliminate repeating the same function steps over and over - define them once, and send all your data into the queue as it arrives and have it processed by a set number of concurrent workers.

## Installation

[![NPM](https://nodei.co/npm/promise-work-queue.png?downloads=true&stars=true)](https://nodei.co/npm/promise-work-queue/)

  - Latest release:

        $ npm install promise-work-queue

## Example


```js
const PromiseWorkQueue = require('promise-work-queue');

let queue = new PromiseWorkQueue(2); // new queue with 2 workers (default is 1)

queue.addStep(payload => ++payload); // incrememnt the payload
queue.addStep(payload => new Promise((resolve, reject) =>
  setTimeout(() => resolve(payload), 5000))); // delay it about 5 seconds
queue.addStep(payload => console.log(payload)); // print it out

queue.onDrain(() => console.log('Queue is empty'));

queue.addPayload(11);
queue.addPayload(42);
queue.addPayload(99);

// Will result in printing 12 and 43 in 5 seconds, and then 100 in about 10 seconds
// Finally, 'Queue is empty' will print
```

If you're using TypeScript, typings are included and you can do:
```ts
import PromiseWorkQueue from './index';

// any type required here to allow last function to not have a return value
// or for cases where return values may mutate along the chain
const queue = new PromiseWorkQueue<any>(2); // new queue with 2 workers (default is 1)

queue.addStep((payload) => {
	return payload + 1;
}); // incrememnt the payload
queue.addStep((payload) => new Promise((resolve, reject) => setTimeout(() => resolve(payload), 5000))); // delay it about 5 seconds
queue.addStep((payload) => console.log(payload)); // print it out

queue.onDrain(() => console.log('Queue is empty'));

queue.addPayload(11);
queue.addPayload(42);
queue.addPayload(99);

//////

const numberQueue = new PromiseWorkQueue<number>(2); // new queue with 2 workers (default is 1)

numberQueue.addStep((payload) => {
	return payload + 1;
}); // incrememnt the payload
numberQueue.addStep((payload) => new Promise((resolve, reject) => setTimeout(() => resolve(payload), 5000))); // delay it about 5 seconds
numberQueue.addStep((payload) => {
	console.log(payload);
	return payload;
}); // print it out

numberQueue.onDrain(() => console.log('numberQueue is empty'));

numberQueue.addPayload(11);
numberQueue.addPayload(42);
numberQueue.addPayload(99);
```

You can get more complicated with passing the queue to another class and having it add its own steps, then adding your own post-processing later, etc
