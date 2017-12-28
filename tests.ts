// Quick and dirty sanity check

import PromiseWorkQueue from './dist/index';
let queue = new PromiseWorkQueue<any>(2); // new queue with 2 workers (default is 1)

queue.addStep(payload => ++payload); // incrememnt the payload
queue.addStep(payload => new Promise((resolve, reject) =>
  setTimeout(() => resolve(payload), 5000))); // delay it about 5 seconds
queue.addStep(payload => console.log(payload)); // print it out

queue.onDrain(() => console.log('Queue is empty'));

queue.addPayload(11);
queue.addPayload(42);
queue.addPayload(99);

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

numberQueue.addPayload(22);
numberQueue.addPayload(33);
numberQueue.addPayload(44);
