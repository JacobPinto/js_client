
export interface RenderableButton {
  render(): HTMLElement;
  getName?(): string;
}

export class Toolbar {
  private _name: string;
  private _container: HTMLElement;

  constructor(
    name: string,
    buttons: RenderableButton[],
    orientation: "horizontal" | "vertical" = "horizontal"
  ) {
    this._name = name;
    this._container = document.createElement("div");

    this._container.className =
      orientation === "horizontal"
        ? "flex flex-row flex-wrap items-start gap-6 px-6 py-4"
        : "flex flex-col items-start gap-4 px-4 py-4";

    this._container.id = `toolbar_${name}`;
    buttons.forEach(btn => this._container.appendChild(btn.render()));
  }

  getName(): string {
  return this._name;
}


  getElement(): HTMLElement {
    return this._container;
  }

  setVisibility(isVisible: boolean): void {
    this._container.style.display = isVisible ? "flex" : "none";
  }
}
