import { OutputPanel } from "./outputPanel.js";
import { MouseHelpPanel } from "./mouseHelpPanel.js";

export class BottomPanel {
  private _container: HTMLDivElement;

  constructor(
    outputPanel: OutputPanel,
    mouseHelpPanel: MouseHelpPanel,
    logPanel: OutputPanel,
  ) {
    this._container = document.createElement("div");

    this._container.className =
      "h-full w-full border-t border-gray-300 bg-white";
    this._container.style.display = "grid";
    this._container.style.gridTemplateColumns = "repeat(3, minmax(0, 1fr))";
    this._container.style.minHeight = "0";
    this._container.style.height = "220px";

    // Output

    const left = document.createElement("div");

    left.className = "h-full";
    left.style.display = "flex";
    left.style.flexDirection = "column";
    left.style.minHeight = "0";
    left.style.overflow = "hidden";
    left.style.borderRight = "1px solid #d1d5db";
    left.appendChild(outputPanel.getElement());

    // Mouse Controls

    const center = document.createElement("div");

    center.className = "h-full";
    center.style.display = "flex";
    center.style.flexDirection = "column";
    center.style.minHeight = "0";
    center.style.overflow = "hidden";
    center.style.borderRight = "1px solid #d1d5db";

    center.appendChild(mouseHelpPanel.getElement());

    // Log

    const right = document.createElement("div");

    right.className = "h-full";
    right.style.display = "flex";
    right.style.flexDirection = "column";
    right.style.minHeight = "0";
    right.style.overflow = "hidden";
    right.appendChild(logPanel.getElement());

    this._container.append(
      left,
      center,
      right,
    );
  }

  /**
   * Root element.
   */
  getElement(): HTMLDivElement {
    return this._container;
  }
}