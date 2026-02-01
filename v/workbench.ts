import { Toolbar } from './toolbar.js';

export class Workbench {
  private _toolbars: Toolbar[];
  private _container: HTMLElement;

  constructor(name: string, toolbars: Toolbar[]) {
    this._toolbars = toolbars;

    this._container = document.createElement("div");
    this._container.id = `workbench_${name}`;

    // Stack toolbars vertically
    this._container.className = "flex flex-col w-full gap-4";

    this.render();
  }

  /** Append all toolbars to workbench */
  private render(): void {
    this._toolbars.forEach((tb) => {
      this._container.appendChild(tb.getElement());
    });
  }

  /** Root DOM element */
  getElement(): HTMLElement {
    return this._container;
  }

  /** Show / hide entire workbench */
  setVisibility(isVisible: boolean): void {
    this._container.style.display = isVisible ? "flex" : "none";
  }

  /** Show / hide a specific toolbar */
  setToolbarVisibility(toolbarName: string, isVisible: boolean): void {
    const toolbar = this._toolbars.find(
      (tb) => tb.getName() === toolbarName
    );

    if (toolbar) {
      toolbar.setVisibility(isVisible);
    }
  }
}