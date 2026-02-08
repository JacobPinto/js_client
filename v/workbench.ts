import { Toolbar } from "./toolbar.js";

export class Workbench {
  private _toolbars: Toolbar[];
  private _container: HTMLElement;
  private _contentArea: HTMLElement;
  private _activeView: HTMLElement | null = null;

  constructor(name: string, toolbars: Toolbar[]) {
    this._toolbars = toolbars;

    this._container = document.createElement("div");
    this._container.id = `workbench_${name}`;
    this._container.className = "flex flex-col w-full gap-4";

    // Toolbars
    this._toolbars.forEach((tb) => {
      tb.attachWorkbench(this);   
      this._container.appendChild(tb.getElement());
    });

    // Active content area
    this._contentArea = document.createElement("div");
    this._contentArea.className =
      "min-h-[200px] p-6 border border-gray-300 rounded-lg";

    this._container.appendChild(this._contentArea);
  }

  showView(view: HTMLElement): void {
    if (this._activeView) {
      this._contentArea.removeChild(this._activeView);
    }
    this._activeView = view;
    this._contentArea.appendChild(view);
  }

  getElement(): HTMLElement {
    return this._container;
  }

  setVisibility(isVisible: boolean): void {
    this._container.style.display = isVisible ? "flex" : "none";
  }

  setToolbarVisibility(toolbarName: string, isVisible: boolean): void {
  const toolbar = this._toolbars.find(
    (tb) => tb.getName() === toolbarName
  );

  if (toolbar) {
    toolbar.setVisibility(isVisible);
  }
}

}
