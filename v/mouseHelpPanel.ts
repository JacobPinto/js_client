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
      "flex h-11 items-center border-b border-gray-300 bg-gray-100 px-4 text-sm font-semibold text-gray-700";
    header.textContent = "Mouse Suggestions";

    const content = document.createElement("div");
    content.className = "flex flex-1 flex-col justify-center gap-3 p-4 text-sm text-gray-700";

    const rows = [
      { icon: "◐", label: "Left Click + Drag", text: "to rotate the view" },
      { icon: "◍", label: "Right Click + Drag", text: "to pan the view" },
      { icon: "◌", label: "Scroll Wheel", text: "to zoom in / out" },
    ];

    rows.forEach(({ icon, label, text }) => {
      const row = document.createElement("div");
      row.className = "flex items-center gap-3";

      const iconWrap = document.createElement("div");
      iconWrap.className =
        "flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 bg-gray-50 text-base text-gray-600";
      iconWrap.textContent = icon;

      const labelText = document.createElement("span");
      labelText.className = "font-medium text-gray-700";
      labelText.textContent = label;

      const infoText = document.createElement("span");
      infoText.className = "text-gray-600";
      infoText.textContent = text;

      row.append(iconWrap, labelText, infoText);
      content.appendChild(row);
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