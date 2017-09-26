# promise-work-queue
A simple promise-based work queue to pipeline tasks

Example


```
const PromiseWorkQueue = require('promise-work-queue');

let queue = new PromiseWorkQueue(2); // new queue with 2 workers

queue.addStep(payload => ++payload); // incrememnt the payload
queue.addStep(payload => new Promise((resolve, reject) => setTimeout(() => resolve(payload), 5000))); // delay it about 5 seconds
queue.addStep(payload => console.log(payload)); // print it out

queue.onDrain(() => console.log('Queue is empty'));

queue.addPayload(11);
queue.addPayload(42);
queue.addPayload(99);

// Will result in printing 12 and 43 in 5 seconds, and then 100 in about 10 seconds
// Finally, 'Queue is empty' will print
```

You can get more complicated with passing the queue to another class and having it add its own steps, then adding your own post-processing later, etc
