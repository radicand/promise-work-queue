"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PromiseWorkQueue = /** @class */ (function () {
    function PromiseWorkQueue(MAX_ACTIVE_WORKERS, promises) {
        if (MAX_ACTIVE_WORKERS === void 0) { MAX_ACTIVE_WORKERS = 1; }
        this._MAX_ACTIVE_WORKERS = MAX_ACTIVE_WORKERS;
        this._payloads = [];
        this._steps = promises ? promises : [];
        this.activeWorkers = 0;
        this._onDrainFunc = function () { return null; };
    }
    PromiseWorkQueue.prototype.addStep = function (func) {
        this._steps.push(func);
    };
    PromiseWorkQueue.prototype.addPayload = function (payload) {
        this._payloads.push(payload);
        this._tryToWork();
    };
    PromiseWorkQueue.prototype.getActiveWorkers = function () {
        return this.activeWorkers;
    };
    PromiseWorkQueue.prototype.getQueueSize = function () {
        return this._payloads.length;
    };
    PromiseWorkQueue.prototype.getQueueStepSize = function () {
        return this._steps.length;
    };
    PromiseWorkQueue.prototype.onDrain = function (func) {
        this._onDrainFunc = func;
    };
    PromiseWorkQueue.prototype._tryToWork = function () {
        var _this = this;
        if (this.activeWorkers < this._MAX_ACTIVE_WORKERS) {
            this.activeWorkers += 1;
            var payload = this._payloads.shift();
            if (payload) {
                this._steps
                    .reduce(function (memo, func) {
                    return memo.then(func);
                }, Promise.resolve(payload))
                    .then(function () {
                    _this.activeWorkers -= 1;
                    return _this._tryToWork();
                })
                    .catch(function (err) {
                    _this.activeWorkers -= 1;
                    // XXX get better error handling method here
                    console.log('Failed to process queue: ', err);
                });
                return;
            }
            else {
                // nothing to do actually
                this.activeWorkers -= 1;
                if (this.activeWorkers === 0) {
                    this._onDrainFunc();
                }
                return;
            }
        }
        else {
            // busy, will get queued later
        }
    };
    return PromiseWorkQueue;
}());
exports.default = PromiseWorkQueue;
//# sourceMappingURL=index.js.map