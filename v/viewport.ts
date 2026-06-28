import { ContentContainer } from "./contentContainer.js";
import { Canvas, CameraState } from "./canvas.js";

export class Viewport {
  private _container: HTMLElement;
  private _canvas: Canvas;

  constructor() {
    this._container = document.createElement("div");
    this._container.className = "flex flex-col flex-1 overflow-hidden gap-0";

    // Canvas renders server-generated output.jpeg and captures mouse interactions
    this._canvas = new Canvas();

    // Add canvas to viewport
    this._container.appendChild(this._canvas.getElement());
  }

  public getCanvas(): Canvas {
    return this._canvas;
  }

  public getElement(): HTMLElement {
    return this._container;
  }
}
