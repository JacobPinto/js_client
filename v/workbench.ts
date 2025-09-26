import { Toolbar } from './toolbar.js';

export class Workbench {
  private _name: string;
  private _toolbars: Toolbar[];
  private _container: HTMLElement;
  private _visible: boolean = true;   // new boolean member

  constructor(name: string, toolbars: Toolbar[]) {
    this._name = name;
    this._toolbars = toolbars;
    this._container = document.createElement('div');
    this._container.className = 'workbench';
    this._container.id = `workbench_${name}`;
    this.render();
  }

  private render(): void {
    this._toolbars.forEach(tb => this._container.appendChild(tb.getElement()));
  }

  getElement(): HTMLElement {
    return this._container;
  }

  setVisibility(isVisible: boolean): void {
    this._visible = isVisible;
    this._container.style.display = isVisible ? 'block' : 'none';
  }

  setToolbarVisibility(toolbarName: string, isVisible: boolean): void {
    const tb = this._toolbars.find(t => (t as any)._name === toolbarName);
    if (tb) tb.setVisibility(isVisible);
  }
}
