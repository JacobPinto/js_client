import { ButtonType } from './buttonBuilder.js';
import { VisibilityState } from './visibilityState.js';

export class Toolbar {
  private _name: string;
  private _buttons: ButtonType[];
  private _container: HTMLElement;

  constructor(name: string, buttons: ButtonType[]) {
    this._name = name;
    this._buttons = buttons;
    this._container = document.createElement('div');
    this._container.className = 'toolbar';
    this._container.id = `toolbar_${name}`;
    this.render();
  }

  private render(): void {
    this._buttons.forEach(btn => {
      const form = btn.render();
      this._container.appendChild(form);
    });
  }

  getElement(): HTMLElement {
    return this._container;
  }

  setVisibility(state: VisibilityState): void {
    this._container.style.display = state === VisibilityState.ON ? 'block' : 'none';
  }
}
