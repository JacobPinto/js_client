import { Toolbar } from "./toolbar.js";

export class Workbench {
  private _toolbars: Toolbar[];
  private _container: HTMLElement;

  private _toolbarSelector: HTMLElement;
  private _toolbarContainer: HTMLElement;
  private _contentArea: HTMLElement;

  private _activeToolbar: Toolbar | null = null;
  private _activeSelectorBtn: HTMLElement | null = null;

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
        "px-6 py-2 rounded-md bg-gray-100 text-gray-700 border border-gray-200 hover:bg-white hover:shadow-md transition-all duration-200";

      selectorBtn.addEventListener("click", () => {
        // Remove active style from all selector buttons
        this._toolbarSelector.querySelectorAll("button").forEach((btn) => {
          btn.classList.remove(
            "bg-white",
            "shadow-md",
            "ring-1",
            "ring-gray-300",
            "text-gray-800",
          );

          btn.classList.add("bg-gray-100", "text-gray-700");
        });

        //active style to clicked button
        selectorBtn.classList.remove("bg-gray-100", "text-gray-700");
        selectorBtn.classList.add(
          "bg-white",
          "text-gray-800",
          "shadow-md",
          "ring-1",
          "ring-gray-300",
        );

        this.showToolbar(toolbar, selectorBtn);
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

  private showToolbar(toolbar: Toolbar, selectorBtn: HTMLElement): void {
    if (this._activeToolbar === toolbar) return;

    //active toolbar selector button highlighting
    if (this._activeSelectorBtn) {
      this._activeSelectorBtn.classList.remove("bg-blue-600", "shadow-lg");
      this._activeSelectorBtn.classList.add("bg-gray-700");
    }

    selectorBtn.classList.remove("bg-gray-700");
    selectorBtn.classList.add("bg-blue-600", "shadow-lg");
    this._activeSelectorBtn = selectorBtn;

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
