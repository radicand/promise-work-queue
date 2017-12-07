export declare type PromiseLikeFunc<T> = (payload: T) => PromiseLike<T> | T;
export default class PromiseWorkQueue<T> {
    private _MAX_ACTIVE_WORKERS;
    private _payloads;
    private _steps;
    private activeWorkers;
    private _onDrainFunc;
    constructor(MAX_ACTIVE_WORKERS?: number, promises?: Array<PromiseLikeFunc<T>>);
    addStep(func: PromiseLikeFunc<T>): void;
    addPayload(payload: T): void;
    getActiveWorkers(): number;
    getQueueSize(): number;
    getQueueStepSize(): number;
    onDrain(func: () => void): void;
    _tryToWork(): void;
}
