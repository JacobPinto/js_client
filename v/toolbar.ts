import { VisibilityState } from './visibilityState.js';

export interface RenderableButton {
  render(): HTMLElement;
  getName?(): string;
}

export class Toolbar {
  private _name: string;
  private _buttons: RenderableButton[];
  private _container: HTMLElement;

  constructor(
    name: string,
    buttons: RenderableButton[],
    orientation: 'horizontal' | 'vertical' = 'horizontal'
  ) {
    this._name = name;
    this._buttons = buttons;
    this._container = document.createElement('div');
    this._container.className = `toolbar toolbar-${orientation}`;
    this._container.id = `toolbar_${name}`;
    this.render();
  }

  private render(): void {
    this._buttons.forEach(btn => {
      this._container.appendChild(btn.render());
    });
  }

  addButton(button: RenderableButton): void {
    this._buttons.push(button);
    this._container.appendChild(button.render());
  }

  removeButton(name: string): void {
    this._buttons = this._buttons.filter(btn => btn.getName?.() !== name);
    const el = this._container.querySelector(`#btn_${name}`);
    if (el) el.remove();
  }

  getElement(): HTMLElement {
    return this._container;
  }

  setVisibility(state: VisibilityState): void {
    if (state === VisibilityState.ON) {
      this._container.classList.remove('hidden');
    } else {
      this._container.classList.add('hidden');
    }
  }
}
