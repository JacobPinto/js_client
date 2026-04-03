export class Output {
  private _container: HTMLDivElement;
  private _message: HTMLSpanElement;

  constructor() {
    this._container = document.createElement("div");

    this._container.className =
      "fixed bottom-4 left-4 " +     
      "max-w-md " +
      "rounded-md border border-gray-200 bg-white " +
      "p-4 shadow-lg text-sm text-gray-700 flex gap-2";

    const label = document.createElement("span");
    label.textContent = "Output:";
    label.className = "font-semibold text-gray-800";

    this._message = document.createElement("span");
    this._message.className = "text-gray-600";

    this._container.append(label, this._message);
  }

  update(value: string): void {
    this._message.textContent = value ?? "";
  }

  getElement(): HTMLElement {
    return this._container;
  }
}
