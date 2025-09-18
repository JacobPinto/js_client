import { Toolbar } from './toolbar.js';
import { VisibilityState } from './visibilityState.js';

export class Workbench {
  private _name: string;
  private _toolbars: Toolbar[];
  private _container: HTMLElement;

  constructor(name: string, toolbars: Toolbar[]) {
    this._name = name;
    this._toolbars = toolbars;
    this._container = document.createElement('div');
    this._container.className = 'workbench';
    this._container.id = `workbench_${name}`;
    this.render();
  }

  private render(): void {
    this._toolbars.forEach(toolbar => {
      this._container.appendChild(toolbar.getElement());
    });
  }

  getElement(): HTMLElement {
    return this._container;
  }

  setVisibility(state: VisibilityState): void {
    this._container.style.display = state === VisibilityState.ON ? 'block' : 'none';
  }

  setToolbarVisibility(toolbarName: string, state: VisibilityState): void {
    const toolbar = this._toolbars.find(tb => tb.getElement().id === `toolbar_${toolbarName}`);
    if (toolbar) {
      toolbar.setVisibility(state);
    }
  }
}
