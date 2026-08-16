/**
 * MouseHelpPanel
 *
 * Displays mouse control icons in the bottom dock.
 */
export class MouseHelpPanel {
  private _container: HTMLDivElement;

  constructor() {
    this._container = document.createElement("div");

    this._container.className = "flex h-full w-full flex-col bg-white";

    const header = document.createElement("div");
    header.className =
      "flex items-center px-4 h-10 border-b border-gray-300 bg-gray-100 flex-shrink-0 text-sm font-semibold text-gray-700";
    header.textContent = "Mouse Suggestions";

    const content = document.createElement("div");
    content.className = "flex flex-1 items-center justify-center gap-6 p-3";

    const rows = [
      "./v/svg/mouse-rotate.svg",
      "./v/svg/mouse-pan.svg",
      "./v/svg/mouse-scroll.svg",
    ];

    rows.forEach((image) => {
      const icon = document.createElement("img");

      icon.src = image;
      icon.alt = "Mouse control";
      icon.className = "h-10 w-10";

      content.appendChild(icon);
    });

    this._container.append(header, content);
  }
  /**
   * Root element.
   */
  getElement(): HTMLDivElement {
    return this._container;
  }
}