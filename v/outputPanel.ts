/**
 * OutputPanel
 *
 * Reusable dock panel used for:
 *  - Output
 *  - Log
 */
export class OutputPanel {
  private _container: HTMLDivElement;
  private _header: HTMLDivElement;
  private _title: HTMLSpanElement;
  private _content: HTMLDivElement;

  constructor(title: string) {
    this._container = document.createElement("div");

    this._container.className =
      "flex flex-col h-full w-full bg-white";

    //
    // Header
    //

    this._header = document.createElement("div");

    this._header.className =
      "flex items-center px-4 h-10 border-b border-gray-300 bg-gray-100 flex-shrink-0";

    this._title = document.createElement("span");

    this._title.className =
      "text-sm font-semibold text-gray-700";

    this._title.textContent = title;

    this._header.appendChild(this._title);

    //
    // Content
    //

    this._content = document.createElement("div");

    this._content.className =
      "flex-1 overflow-auto p-3 text-sm text-gray-700 font-mono whitespace-pre-wrap";

    this._container.append(
      this._header,
      this._content,
    );
  }

  /**
   * Replace content.
   */
  update(message: string): void {
    this._content.textContent = message;
  }

  /**
   * Append message.
   */
  append(message: string): void {
    if (this._content.textContent) {
      this._content.textContent += "\n";
    }

    this._content.textContent += message;

    this._content.scrollTop = this._content.scrollHeight;
  }

  /**
   * Clear panel.
   */
  clear(): void {
    this._content.textContent = "";
  }

  /**
   * Change title.
   */
  setTitle(title: string): void {
    this._title.textContent = title;
  }

  /**
   * Root element.
   */
  getElement(): HTMLDivElement {
    return this._container;
  }
}