import { Observer } from '../m/modelObserver.js';

/**
 * ModelGeneric<T>
 * 
 * A generic observable class that implements the Observer design pattern.
 * Provides state management for any data type T with change notification capabilities.
 * 
 * When data is updated, all registered observers are notified of the change.
 */
export class ModelGeneric<T> {
  /* 
   * does not necessarily have a value. If it's undefined we
   * need the user to know that.
   */    
  private _data?:T;
  private _observers: Observer[];

  constructor() {
    this._observers = [];
  }

  public setData(data: T) {
    console.log(`[ModelGeneric] Setting data: ${data}`);
    this._data = data;
    this.notify();
  }
  
  public getData(): T | undefined {
    return this._data;
  }

  public register(obs: Observer) {
    this._observers.push(obs);
  }

  public notify() {
    if (this._data !== undefined) {
      for (const obs of this._observers) {
        obs.update(this._data);
      }
    }
  }
}