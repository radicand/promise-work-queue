export type PromiseLikeFunc<T> = (payload: T) => PromiseLike<T> | T;

export default class PromiseWorkQueue<T> {
  private _MAX_ACTIVE_WORKERS: number;
  private _payloads: Array<T>;
  private _steps: Array<PromiseLikeFunc<T>>;
  private activeWorkers: number;
  private _onDrainFunc: () => void;
  private _onErrorFunc: (err: Error, payload: T) => void;

  constructor(MAX_ACTIVE_WORKERS = 1, promises?: Array<PromiseLikeFunc<T>>) {
    this._MAX_ACTIVE_WORKERS = MAX_ACTIVE_WORKERS;
    this._payloads = [];
    this._steps = promises ? promises : [];
    this.activeWorkers = 0;
    this._onDrainFunc = () => null;
    this._onErrorFunc = () => null;
  }

  addStep(func: PromiseLikeFunc<T>): void {
    this._steps.push(func);
  }

  addPayload(payload: T) {
    this._payloads.push(payload);
    this._tryToWork();
  }

  getActiveWorkers() {
    return this.activeWorkers;
  }

  getQueueSize() {
    return this._payloads.length;
  }

  getQueueStepSize() {
    return this._steps.length;
  }

  onDrain(func: () => void) {
    this._onDrainFunc = func;
  }

  onError(func: (err: Error, payload: T) => void) {
    this._onErrorFunc = func;
  }

  _tryToWork(): void {
    if (this.activeWorkers < this._MAX_ACTIVE_WORKERS) {
      this.activeWorkers += 1;
      let payload = this._payloads.shift();
      if (payload) {
        this._steps
          .reduce((memo, func) => {
            return memo.then(func);
          }, Promise.resolve(payload))
          .then(() => {
            this.activeWorkers -= 1;
            return this._tryToWork();
          })
          .catch((err) => {
            this.activeWorkers -= 1;
            this._onErrorFunc(err, payload);
          });
        return;
      } else {
        // nothing to do actually
        this.activeWorkers -= 1;
        if (this.activeWorkers === 0) {
          this._onDrainFunc();
        }
        return;
      }
    } else {
      // busy, will get queued later
    }
  }
}
