import { Toolbar } from "./toolbar.js";

/**
 * ContentContainer Component
 * Manages toolbar selection and display
 * 
 * Provides:
 * - Tab-like interface for switching between toolbars (Geometry, Grid, LB Solver)
 * - Active toolbar content display area
 * - Keeps configuration UI at top of viewport
 * 
 * Used by Viewport to structure layout: ContentContainer above Canvas
 */
export class ContentContainer {
  private _container: HTMLElement;
  private _toolbars: Toolbar[];
  private _toolbarSelector: HTMLElement;
  private _contentArea: HTMLElement;
  private _activeToolbar: Toolbar | null = null;
  private _activeSelectorBtn: HTMLElement | null = null;

  constructor(toolbars: Toolbar[]) {
    this._toolbars = toolbars;

    this._container = document.createElement("div");
    this._container.className = "flex flex-col gap-0 flex-shrink-0 bg-white";

    // Toolbar Selector section
    this._toolbarSelector = document.createElement("div");
    this._toolbarSelector.className =
      "flex gap-4 border-b border-gray-300 p-4 bg-gray-50";

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

        // Add active style to clicked button
        selectorBtn.classList.remove("bg-gray-100", "text-gray-700");
        selectorBtn.classList.add(
          "bg-white",
          "text-gray-800",
          "shadow-md",
          "ring-1",
          "ring-gray-300",
        );

        this.showToolbar(toolbar);
      });

      this._toolbarSelector.appendChild(selectorBtn);
    });

    this._container.appendChild(this._toolbarSelector);

    // Content Area - holds the active toolbar
    this._contentArea = document.createElement("div");
    this._contentArea.className = "p-4 bg-white overflow-y-auto max-h-96";

    this._container.appendChild(this._contentArea);

    // Show first toolbar by default
    if (this._toolbars.length > 0) {
      const firstBtn = this._toolbarSelector.querySelector(
        "button",
      ) as HTMLElement;
      firstBtn?.click();
    }
  }

  private showToolbar(toolbar: Toolbar): void {
    // Clear previous toolbar
    this._contentArea.innerHTML = "";
    this._activeToolbar = toolbar;

    // Append new toolbar
    this._contentArea.appendChild(toolbar.getElement());
  }

  public getElement(): HTMLElement {
    return this._container;
  }

  public getToolbars(): Toolbar[] {
    return this._toolbars;
  }

  public getActiveToolbar(): Toolbar | null {
    return this._activeToolbar;
  }
}
