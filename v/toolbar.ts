export interface RenderableButton {
  render(): HTMLElement;
  getView(): HTMLElement;
}

export class Toolbar {
  private _name: string;
  private _container: HTMLElement;
  private _buttons: RenderableButton[] = [];

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
        onClick(btn.getView()); 
      });

      this._container.appendChild(toolbarButton);
    });
  }
}
