import { Observer } from '../m/modelObserver';

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