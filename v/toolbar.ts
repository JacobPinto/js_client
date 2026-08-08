export interface RenderableButton {
  render(): HTMLElement;
  getView(): HTMLElement;
}

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
        ? "flex flex-row flex-wrap gap-4"
        : "flex flex-col gap-4";
  }

  getName(): string {
    return this._name;
  }

  getElement(): HTMLElement {
    return this._container;
  }

  /* Render toolbar buttons only */
  renderButtons(onClick: (view: HTMLElement) => void): void {
    this._container.replaceChildren();

    this._buttons.forEach((btn) => {
      const toolbarButton = btn.render();

      toolbarButton.addEventListener("click", () => {
        // Remove active styles from previous button
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

        // Apply active styles to clicked button
        toolbarButton.classList.remove("bg-gray-100", "text-gray-700");
        toolbarButton.classList.add(
          "bg-white",
          "text-gray-800",
          "shadow-md",
          "ring-2",
          "ring-blue-400",
        );

        this._activeButton = toolbarButton;

        // Show form/content
        onClick(btn.getView());
      });

      this._container.appendChild(toolbarButton);
    });
  }
}
