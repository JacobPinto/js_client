import { Toolbar } from "./toolbar.js";

export class Workbench {
  private _toolbars: Toolbar[];
  private _container: HTMLElement;

  private _toolbarSelector: HTMLElement;
  private _toolbarContainer: HTMLElement;
  private _contentArea: HTMLElement;

  private _activeToolbar: Toolbar | null = null;

  constructor(name: string, toolbars: Toolbar[]) {
    this._toolbars = toolbars;

    this._container = document.createElement("div");
    this._container.className = "flex flex-col gap-4 w-full";

    // Toolbar Selector section

    this._toolbarSelector = document.createElement("div");
    this._toolbarSelector.className = "flex gap-4 border-b border-gray-300 p-4";

    this._toolbars.forEach((toolbar) => {
      const selectorBtn = document.createElement("button");

      selectorBtn.textContent = toolbar.getName();
      selectorBtn.className =
        "px-4 py-2 rounded-md bg-gray-700 text-white hover:bg-gray-800";

      selectorBtn.addEventListener("click", () => {
        this.showToolbar(toolbar);
      });

      this._toolbarSelector.appendChild(selectorBtn);
    });

    //Dynamic Toolbar Container

    this._toolbarContainer = document.createElement("div");
    this._toolbarContainer.className = "flex flex-wrap gap-4 p-4";

    //Content Area

    this._contentArea = document.createElement("div");
    this._contentArea.className =
      "min-h-[200px] p-8 flex justify-center items-start";

    this._container.append(
      this._toolbarSelector,
      this._toolbarContainer,
      this._contentArea,
    );
  }

  //  Replace Toolbar

  private showToolbar(toolbar: Toolbar): void {
    if (this._activeToolbar === toolbar) return;

    toolbar.renderButtons((view: HTMLElement) => {
      this.showView(view);
    });

    this._toolbarContainer.replaceChildren(toolbar.getElement());

    this._contentArea.replaceChildren(); // clear content
    this._activeToolbar = toolbar;
  }

  //Replace Content View

  private showView(view: HTMLElement): void {
    this._contentArea.replaceChildren(view);
  }

  getElement(): HTMLElement {
    return this._container;
  }
}
