
module.exports = class PromiseWorkQueue {
    constructor (MAX_ACTIVE_WORKERS = 1, promises) {
        this._MAX_ACTIVE_WORKERS = MAX_ACTIVE_WORKERS;
        this._payloads = [];
        this._steps = promises ? [promises] : [];
        this.activeWorkers = 0;
        this._onDrainFunc = () => {};
    }

    addStep (func) {
        this._steps.push(func);
    }

    addPayload (payload) {
        this._payloads.push(payload);
        this._tryToWork();
    }

    getQueueSize () {
        return this._payloads.length;
    }

    getQueueStepSize () {
        return this._steps.length;
    }

    onDrain (func) {
        this._onDrainFunc = func;
    }

    _tryToWork () {
        if (this.activeWorkers < this._MAX_ACTIVE_WORKERS) {
            this.activeWorkers += 1;
            let payload = this._payloads.shift();
            if (payload) {
                return this._steps.reduce((memo, func) => {
                    return memo.then(func);
                }, Promise.resolve(payload))
                .then(() => {
                    this.activeWorkers -= 1;
                    return this._tryToWork();
                })
                .catch(err => {
                    console.log('Failed to process queue: ', err);
                });
            } else {
                // nothing to do actually
                this.activeWorkers -= 1;
                if (this.activeWorkers === 0) {
                    if (typeof this._onDrainFunc === 'function') this._onDrainFunc();
                }
            }
        } else {
            // busy, will get queued later
        }
    }
}
