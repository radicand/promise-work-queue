// Quick and dirty sanity check

const PromiseWorkQueue = require('./dist/index.js').default;

let queue = new PromiseWorkQueue(2); // new queue with 2 workers (default is 1)

queue.addStep(payload => ++payload); // incrememnt the payload
queue.addStep(payload => new Promise((resolve, reject) =>
  setTimeout(() => resolve(payload), 5000))); // delay it about 5 seconds
queue.addStep(payload => console.log(payload)); // print it out

queue.onDrain(() => console.log('Queue is empty'));

queue.addPayload(11);
queue.addPayload(42);
queue.addPayload(99);
