import { Toolbar } from "./toolbar.js";
import { Canvas } from "./canvas.js";
import { OverlayPanel } from "./overlayPanel.js";
import { BottomPanel } from "./bottomPanel.js";

export class Workbench {
  private _toolbars: Toolbar[];

  private _container: HTMLDivElement;
  private _toolbarSelector: HTMLDivElement;
  private _toolbarContainer: HTMLDivElement;
  private _workspace: HTMLDivElement;

  private _canvas: Canvas | null;
  private _overlay: OverlayPanel | null;
  private _bottomPanel: BottomPanel | null;

  private _activeToolbar: Toolbar | null = null;

  constructor(
    name: string,
    toolbars: Toolbar[],
    canvas?: Canvas,
    overlay?: OverlayPanel,
    bottomPanel?: BottomPanel,
  ) {
    this._toolbars = toolbars;

    this._canvas = canvas ?? null;
    this._overlay = overlay ?? null;
    this._bottomPanel = bottomPanel ?? null;

    //
    // Root
    //

    this._container = document.createElement("div");

    this._container.className =
      "grid h-full w-full min-h-0 bg-[#eef2f7] grid-rows-[auto_auto_1fr_auto]";

    //
    // Toolbar selector
    //

    this._toolbarSelector = document.createElement("div");

    this._toolbarSelector.className =
      "flex border-b border-gray-300 bg-white";

    //
    // Toolbar container
    //

    this._toolbarContainer = document.createElement("div");

    this._toolbarContainer.className =
      "flex flex-wrap gap-3 p-4 border-b border-gray-300 bg-white";

    //
    // Workspace
    //

    this._workspace = document.createElement("div");

    this._workspace.className =
      "relative min-h-[480px] overflow-hidden bg-[#e9edf6]";
    this._workspace.style.minHeight = "0";

    const canvasWrapper = document.createElement("div");
    canvasWrapper.className = "absolute inset-0 flex items-start justify-center p-6";
    canvasWrapper.style.minHeight = "0";

    if (this._canvas) {
      const canvasElement = this._canvas.getElement();
      canvasWrapper.appendChild(canvasElement);
    }

    if (this._overlay) {
      canvasWrapper.appendChild(this._overlay.getElement());
    }

    this._workspace.appendChild(canvasWrapper);

    //
    // Toolbar selector buttons
    //

    this._toolbars.forEach((toolbar, index) => {
      const button = document.createElement("button");

      button.textContent = toolbar.getName();

      button.className =
        "px-6 py-3 border-b-2 border-transparent font-medium text-gray-700 hover:bg-gray-50";

      button.onclick = () => {
        this._toolbarSelector
          .querySelectorAll("button")
          .forEach((b) => {
            b.classList.remove(
              "border-blue-500",
              "text-blue-600",
              "bg-blue-50",
            );

            b.classList.add(
              "border-transparent",
              "text-gray-700",
            );
          });

        button.classList.remove(
          "border-transparent",
          "text-gray-700",
        );

        button.classList.add(
          "border-blue-500",
          "text-blue-600",
          "bg-blue-50",
        );

        this.showToolbar(toolbar);
      };

      this._toolbarSelector.appendChild(button);

      if (index === 0) {
        button.click();
      }
    });

    //
    // Assemble
    //

    this._container.append(
      this._toolbarSelector,
      this._toolbarContainer,
      this._workspace,
    );

    if (this._bottomPanel) {
      this._container.appendChild(this._bottomPanel.getElement());
    }
  }

  private showToolbar(toolbar: Toolbar): void {
    if (toolbar === this._activeToolbar) return;

    this._activeToolbar = toolbar;

    toolbar.renderButtons((title, view) => {
      this._overlay?.show(title, view);
    });

    this._toolbarContainer.replaceChildren(
      toolbar.getElement(),
    );

    this._overlay?.hide();
  }

  getElement(): HTMLElement {
    return this._container;
  }
}