/**
 * OverlayPanel
 * 
 * Displays form views as an overlay on top of the canvas.
 * Positioned absolutely in the top-left area with a close button.
 * Can be shown/hidden and updated with new content.
 */
export class OverlayPanel {
  private _container: HTMLElement;
  private _header: HTMLElement;
  private _title: HTMLSpanElement;
  private _closeButton: HTMLButtonElement;
  private _content: HTMLElement;

  constructor() {
    this._container = document.createElement("div");
    this._container.className = `
      absolute
      top-6
      left-6
      z-50
      hidden
      bg-white
      rounded-lg
      shadow-2xl
      border
      border-gray-300
      w-[620px]
      max-h-[80vh]
      overflow-hidden
      pointer-events-auto
    `;

    // ---------- Header ----------
    this._header = document.createElement("div");
    this._header.className =
      "flex items-center justify-between px-4 py-3 border-b bg-gray-100";

    this._title = document.createElement("span");
    this._title.className = "font-semibold text-gray-800";
    this._title.textContent = "Properties";

    this._closeButton = document.createElement("button");
    this._closeButton.innerHTML = "✕";
    this._closeButton.className =
      "text-gray-500 hover:text-red-500 text-lg font-bold cursor-pointer transition-colors";
    this._closeButton.type = "button";
    this._closeButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      this.hide();
    });

    this._header.append(this._title, this._closeButton);

    // ---------- Content ----------
    this._content = document.createElement("div");
    this._content.className = "p-4 overflow-auto max-h-[70vh]";

    this._container.addEventListener("click", (event) => event.stopPropagation());
    this._container.append(this._header, this._content);
  }

  /**
   * Show the overlay with the given title and form view
   */
  show(title: string, view: HTMLElement): void {
    this._title.textContent = title;
    this._content.replaceChildren(view);
    this._container.classList.remove("hidden");
  }

  /**
   * Hide the overlay
   */
  hide(): void {
    this._container.classList.add("hidden");
    this._content.replaceChildren();
  }

  /**
   * Clear the overlay content without hiding
   */
  clear(): void {
    this._content.replaceChildren();
  }

  /**
   * Get the overlay container element
   */
  getElement(): HTMLElement {
    return this._container;
  }
}
