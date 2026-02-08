import { Workbench } from "./workbench.js";

export interface RenderableButton {
  render(): HTMLElement;
  getView?(): HTMLElement;
  getName?(): string;
}

export class Toolbar {
  private _name: string;
  private _container: HTMLElement;
  private _workbench?: Workbench;

  constructor(
    name: string,
    buttons: RenderableButton[],
    orientation: "horizontal" | "vertical" = "horizontal",
  ) {
    this._name = name;
    this._container = document.createElement("div");

    this._container.className =
      orientation === "horizontal"
        ? "flex flex-row flex-wrap items-start gap-6 px-6 py-4"
        : "flex flex-col items-start gap-4 px-4 py-4";

    this._container.id = `toolbar_${name}`;

    buttons.forEach((btn) => {
      const btnEl = btn.render();

      btnEl.addEventListener("click", () => {
        if (btn.getView) {
          this._workbench?.showView(btn.getView());
        }
      });

      this._container.appendChild(btnEl);
    });
  }

  attachWorkbench(wb: Workbench): void {
    this._workbench = wb;
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
