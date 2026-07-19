/**
 * MouseHelpPanel
 *
 * Displays mouse control icons in the bottom dock.
 */
export class MouseHelpPanel {
  private _container: HTMLDivElement;

  constructor() {
    this._container = document.createElement("div");

    this._container.className =
      "flex flex-col h-full w-full bg-white";

    //
    // Header
    //

    const header = document.createElement("div");

    header.className =
      "flex items-center px-4 h-10 border-b border-gray-300 bg-gray-100 flex-shrink-0 font-medium text-gray-700";

    header.textContent = "Mouse Controls";

    //
    // Content
    //

    const content = document.createElement("div");

    content.className =
      "flex-1 flex items-center justify-evenly px-8";

    const pan = document.createElement("img");
    pan.src = "/v/svg/mouse-pan.svg";
    pan.alt = "Pan";
    pan.className =
      "w-10 h-10 opacity-80 hover:opacity-100 transition-opacity duration-150";

    const rotate = document.createElement("img");
    rotate.src = "/v/svg/mouse-rotate.svg";
    rotate.alt = "Rotate";
    rotate.className =
      "w-10 h-10 opacity-80 hover:opacity-100 transition-opacity duration-150";

    const zoom = document.createElement("img");
    zoom.src = "/v/svg/mouse-scroll.svg";
    zoom.alt = "Zoom";
    zoom.className =
      "w-10 h-10 opacity-80 hover:opacity-100 transition-opacity duration-150";

    content.append(
      pan,
      rotate,
      zoom,
    );

    this._container.append(
      header,
      content,
    );
  }

  /**
   * Root element.
   */
  getElement(): HTMLDivElement {
    return this._container;
  }
}