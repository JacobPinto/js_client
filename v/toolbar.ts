export interface RenderableButton {
  render(): HTMLElement;
  getView(): HTMLElement;
  getName(): string; // Add getName method
}

/**
 * Toolbar
 * 
 * Container that renders toolbar of buttons.
 * Each button toggles between showing different form views as overlays.
 * Manages button state (active/inactive styling) and view switching.
 */
export class Toolbar {
  private _name: string;
  private _container: HTMLElement;
  private _buttons: RenderableButton[] = [];
  private _activeButton: HTMLElement | null = null;

  constructor(
    name: string,
    buttons: RenderableButton[],
    orientation: "horizontal" | "vertical" = "horizontal",
  ) {
    this._name = name;
    this._buttons = buttons;

    this._container = document.createElement("div");

    this._container.className =
      orientation === "horizontal"
        ? "flex flex-row flex-wrap gap-3"
        : "flex flex-col gap-3";
  }

  getName(): string {
    return this._name;
  }

  getElement(): HTMLElement {
    return this._container;
  }

  /**
   * Renders all buttons in the toolbar.
   * Handles button click events to toggle active state and display form views as overlay.
   * onClick - Callback function invoked with button name and the selected form view
   */
  renderButtons(onClick: (buttonName: string, view: HTMLElement) => void): void {
    this._container.replaceChildren();

    this._buttons.forEach((btn) => {
      const toolbarButton = btn.render();

      toolbarButton.addEventListener("click", () => {
        // Deactivate previously selected button
        if (this._activeButton) {
          this._activeButton.classList.remove(
            "bg-white",
            "shadow-md",
            "ring-2",
            "ring-blue-400",
            "text-gray-800",
          );

          this._activeButton.classList.add("bg-gray-100", "text-gray-700");
        }

        // Activate clicked button with highlighted styles
        toolbarButton.classList.remove("bg-gray-100", "text-gray-700");
        toolbarButton.classList.add(
          "bg-white",
          "text-gray-800",
          "shadow-md",
          "ring-2",
          "ring-blue-400",
        );

        this._activeButton = toolbarButton;

        // Display the selected form/view with button name as title
        onClick(btn.getName(), btn.getView());
      });

      this._container.appendChild(toolbarButton);
    });
  }
}
