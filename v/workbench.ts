import { Toolbar } from "./toolbar.js";
import { Canvas } from "./canvas.js";
import { OverlayPanel } from "./overlayPanel.js";
/**
 * Workbench
 * 
 * Main layout container that manages multiple toolbars, canvas, and overlay.
 * Provides toolbar selection via tabs and displays forms as overlays on canvas.
 * Structure: 
 *   - Toolbar Selector (top tabs)
 *   - Toolbar Buttons (active toolbar buttons)
 *   - Canvas (main content area, flex-grow)
 *   - OverlayPanel (forms displayed on top of canvas)
 */

export class Workbench {
  private _toolbars: Toolbar[];
  private _container: HTMLElement;
  private _canvas: Canvas | null = null;
  private _overlay: OverlayPanel | null = null;

  private _toolbarSelector: HTMLElement;
  private _toolbarContainer: HTMLElement;
  private _canvasContainer: HTMLElement;

  private _activeToolbar: Toolbar | null = null;
  private _activeSelectorBtn: HTMLElement | null = null;

  constructor(name: string, toolbars: Toolbar[], canvas?: Canvas, overlay?: OverlayPanel) {
    this._toolbars = toolbars;
    this._canvas = canvas || null;
    this._overlay = overlay || null;

    // Main container - full height flex column
    this._container = document.createElement("div");
    this._container.className = "flex flex-col w-full h-screen bg-gray-50";

    // =================== Toolbar Selector Section ===================
    // Top tabs to switch between different toolbars

    this._toolbarSelector = document.createElement("div");
    this._toolbarSelector.className = "flex gap-0 border-b border-gray-300 bg-white";

    this._toolbars.forEach((toolbar, index) => {
      const selectorBtn = document.createElement("button");

      selectorBtn.textContent = toolbar.getName();
      selectorBtn.className =
        "px-6 py-3 font-medium text-gray-700 border-b-2 border-transparent hover:bg-gray-50 transition-colors duration-200";

      selectorBtn.addEventListener("click", () => {
        // Remove active style from all selector buttons
        this._toolbarSelector.querySelectorAll("button").forEach((btn) => {
          btn.classList.remove(
            "border-blue-500",
            "text-blue-600",
            "bg-blue-50"
          );
          btn.classList.add("border-transparent", "text-gray-700");
        });

        // Apply active style to clicked button
        selectorBtn.classList.remove("border-transparent", "text-gray-700");
        selectorBtn.classList.add(
          "border-blue-500",
          "text-blue-600",
          "bg-blue-50"
        );

        this.showToolbar(toolbar, selectorBtn);
      });

      this._toolbarSelector.appendChild(selectorBtn);

      // Auto-select first toolbar on load
      if (index === 0) {
        selectorBtn.click();
      }
    });

    // =================== Toolbar Container Section ===================
    // Displays buttons from the active toolbar

    this._toolbarContainer = document.createElement("div");
    this._toolbarContainer.className = "flex flex-wrap gap-3 p-4 bg-white border-b border-gray-200";

    // =================== Canvas Container Section ===================
    // Main content area containing canvas (with absolute positioning for overlay)
    // This is the positioning context for the overlay panel

    this._canvasContainer = document.createElement("div");
    this._canvasContainer.className = "flex-1 relative overflow-hidden bg-gray-900 w-full";

    // Append canvas first so it renders behind the overlay
    if (this._canvas) {
      const canvasElement = this._canvas.getElement();
      // Ensure canvas fills the container
      canvasElement.style.position = "absolute";
      canvasElement.style.top = "0";
      canvasElement.style.left = "0";
      canvasElement.style.width = "100%";
      canvasElement.style.height = "100%";
      this._canvasContainer.appendChild(canvasElement);
    }

    // Append overlay on top (uses absolute positioning defined in OverlayPanel)
    if (this._overlay) {
      this._canvasContainer.appendChild(this._overlay.getElement());
    }

    // Assemble the workbench
    this._container.append(
      this._toolbarSelector,
      this._toolbarContainer,
      this._canvasContainer
    );
  }

  //  Replace Toolbar

  /**
   * Switches to a different toolbar and updates selector button styling.
   * Renders the toolbar's buttons and clears the overlay.
   */
  private showToolbar(toolbar: Toolbar, selectorBtn: HTMLElement): void {
    if (this._activeToolbar === toolbar) return;

    // Update active toolbar
    this._activeToolbar = toolbar;
    this._activeSelectorBtn = selectorBtn;

    // Render toolbar buttons with overlay callback
    toolbar.renderButtons((buttonName: string, view: HTMLElement) => {
      this.showFormOverlay(buttonName, view);
    });

    // Replace toolbar container content with active toolbar's buttons
    this._toolbarContainer.replaceChildren(toolbar.getElement());

    // Clear overlay when switching toolbars
    if (this._overlay) {
      this._overlay.hide();
    }
  }

  /**
   * Displays a form view in the overlay panel on top of canvas.
   */
  private showFormOverlay(title: string, view: HTMLElement): void {
    if (this._overlay) {
      this._overlay.show(title, view);
    } else {
      console.warn("Overlay panel not available");
    }
  }

  /**
   * Get the main workbench container element.
   */
  getElement(): HTMLElement {
    return this._container;
  }

  /**
   * Set the canvas (can be called after construction if needed).
   */
  setCanvas(canvas: Canvas): void {
    this._canvas = canvas;
    if (this._canvas) {
      const existingCanvas = this._canvasContainer.querySelector("canvas");
      if (!existingCanvas) {
        this._canvasContainer.insertBefore(
          this._canvas.getElement(),
          this._canvasContainer.firstChild
        );
      }
    }
  }

  /**
   * Set the overlay panel (can be called after construction if needed).
   */
  setOverlay(overlay: OverlayPanel): void {
    this._overlay = overlay;
    if (this._overlay && !this._canvasContainer.contains(this._overlay.getElement())) {
      this._canvasContainer.appendChild(this._overlay.getElement());
    }
  }
}
