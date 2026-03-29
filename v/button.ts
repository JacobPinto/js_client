import { ControllerSimEngine } from "../c/controllerSimEngine.js";
import { FormElementParam } from "./buttonParams.js";

/* ================= Tailwind Design ================= */

// Toolbar button
const TOOLBAR_BUTTON =
  "px-4 py-2 rounded-md " +
  "bg-gray-100 text-gray-700 " +
  "border border-gray-200 " +
  "hover:bg-white hover:shadow-md " +
  "transition-all duration-200 text-sm font-medium";

// Form container
const FORM_CONTAINER = "flex flex-col gap-4";

// Titles
const FORM_TITLE = "text-sm font-semibold text-gray-800";

// Labels

const LABEL = "flex flex-col gap-1 text-sm text-gray-600";

const ROW = "flex items-center gap-4 text-sm text-gray-700";

const LABEL_TEXT = "w-32 text-gray-600";

// Input + Select
const INPUT =
  "w-full px-3 py-2 rounded-md border border-gray-300 " +
  "bg-white text-sm text-gray-700 placeholder-gray-400 " +
  "shadow-sm transition focus:outline-none " +
  "focus:border-blue-500 focus:ring-2 focus:ring-blue-200";

// Submit button
const SUBMIT =
  "px-6 py-2 rounded-md" +
  "bg-gray-100 " +
  "text-gray-700 " +
  "border border-gray-200 " +
  "hover:shadow-md " +
  "hover:border-gray-300 " +
  "hover:bg-white " +
  "transition-all duration-200";

const CLEAR = SUBMIT;

//Base Class

export class InputElement {
  protected _type: string = "InputElement";
  protected _name: string;
  protected _displayName: string;
  protected _submitLabel?: string;
  protected _questions: Record<string, string>;
  protected _contextObj: Record<string, any>;
  protected _onClick: Function;
  protected _update?: Function;
  public _controller: ControllerSimEngine;

  protected _view?: HTMLElement;

  constructor(params: FormElementParam, controller: ControllerSimEngine) {
    this._name = params.name;
    this._displayName = params.displayName;
    this._submitLabel = params.submitLabel;
    this._questions = params.questions ?? {};
    this._contextObj = params.contextObj ?? {};
    this._onClick = (params.onClick ?? (() => {})).bind(this);
    this._update = params.update?.bind(this);
    this._controller = controller;
  }

  /* Toolbar trigger button */
  render(): HTMLElement {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = this._displayName;
    button.className = TOOLBAR_BUTTON;
    return button;
  }

  update(value: any): void {
    this._update?.(value);
  }

  getView(): HTMLElement {
    throw new Error("getView() must be implemented by subclass.");
  }
}

//SimpleButton

export class SimpleButton extends InputElement {
  getView(): HTMLElement {
    if (this._view) return this._view;

    const container = document.createElement("div");
    container.className = "p-6 border rounded-lg shadow-sm flex flex-col gap-4";

    const heading = document.createElement("h2");
    heading.textContent = this._displayName;
    heading.className = FORM_TITLE;

    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = this._submitLabel ?? "Execute";
    btn.className = SUBMIT;

    btn.addEventListener("click", () => {
      this._onClick();
    });

    container.append(heading, btn);

    this._view = container;
    return this._view;
  }
}

//TextEntryWithButton

export class TextEntryWithButton extends InputElement {
  public _form!: HTMLFormElement;

  getView(): HTMLElement {
    if (this._view) return this._view;

    this._form = document.createElement("form");
    this._form.className = FORM_CONTAINER;

    const heading = document.createElement("h2");
    heading.textContent = this._displayName;
    heading.className = FORM_TITLE;
    this._form.appendChild(heading);

    Object.entries(this._questions).forEach(([key, labelText]) => {
      const row = document.createElement("div");
      row.className = ROW;

      const labelSpan = document.createElement("span");
      labelSpan.textContent = labelText;
      labelSpan.className = LABEL_TEXT;

      const input = document.createElement("input");
      input.type = "text";
      input.name = key;
      input.className = INPUT + " flex-1";

      input.addEventListener("input", () => this._update?.());

      row.append(labelSpan, input);
      this._form.appendChild(row);
    });

    const buttonRow = document.createElement("div");
    buttonRow.className = "flex justify-end gap-4 pt-4";

    const clearBtn = document.createElement("button");
    clearBtn.type = "button";
    clearBtn.textContent = "Clear";
    clearBtn.className = CLEAR;

    clearBtn.addEventListener("click", () => {
      this._form.reset();
      this._update?.();
    });

    const submit = document.createElement("button");
    submit.type = "button";
    submit.textContent = this._submitLabel ?? "Submit";
    submit.className = SUBMIT;

    submit.addEventListener("click", (e) => {
      e.preventDefault();
      this._onClick(e);
    });

    buttonRow.append(clearBtn, submit);
    this._form.appendChild(buttonRow);

    this._view = this._form;
    return this._view;
  }

  public getFieldValue(fieldName: string): string | undefined {
    const input = this._form.querySelector(
      `input[name="${fieldName}"]`,
    ) as HTMLInputElement;
    return input ? input.value : undefined;
  }
}

// TextEntryWithDropdownAndButton

export class TextEntryWithDropdownAndButton extends InputElement {
  public _form!: HTMLFormElement;
  private _inputs: Record<string, HTMLInputElement> = {};
  private _selects: Record<string, HTMLSelectElement> = {};

  getView(): HTMLElement {
    if (this._view) return this._view;

    this._form = document.createElement("form");
    this._form.className = FORM_CONTAINER;

    const heading = document.createElement("h2");
    heading.textContent = this._displayName;
    heading.className = FORM_TITLE;
    this._form.appendChild(heading);

    Object.entries(this._questions).forEach(([key, labelText]) => {
      /* -------- Input Row -------- */
      const inputRow = document.createElement("div");
      inputRow.className = ROW;

      const labelSpan = document.createElement("span");
      labelSpan.textContent = labelText;
      labelSpan.className = LABEL_TEXT;

      const input = document.createElement("input");
      input.type = "text";
      input.className = INPUT + " flex-1";

      input.addEventListener("input", () => this._update?.());

      inputRow.append(labelSpan, input);
      this._form.appendChild(inputRow);

      const select = document.createElement("select");
      select.className = INPUT + " w-40";

      const options = this._contextObj[key]?.options ?? {};
      Object.entries(options).forEach(([v, l]) => {
        const opt = document.createElement("option");
        opt.value = v;
        opt.textContent = String(l);
        select.appendChild(opt);
      });

      select.addEventListener("change", () => this._update?.());

      // Add dropdown to SAME ROW as input
      inputRow.appendChild(select);

      this._inputs[key] = input;
      this._selects[key] = select;
    });

    const buttonRow = document.createElement("div");
    buttonRow.className = "flex justify-end gap-4 pt-4";

    const clearBtn = document.createElement("button");
    clearBtn.type = "button";
    clearBtn.textContent = "Clear";
    clearBtn.className = CLEAR;

    clearBtn.addEventListener("click", () => {
      this._form.reset();
      this._update?.();
    });

    const submit = document.createElement("button");
    submit.type = "button";
    submit.textContent = this._submitLabel ?? "Submit";
    submit.className = SUBMIT;

    submit.addEventListener("click", (e) => {
      e.preventDefault();
      this._onClick();
    });

    buttonRow.append(clearBtn, submit);
    this._form.appendChild(buttonRow);

    this._view = this._form;
    return this._view;
  }

  getTextValue(key: string): string {
    return this._inputs[key]?.value ?? "";
  }

  getDropdownValue(key: string): string {
    return this._selects[key]?.value ?? "";
  }
}

// RadioButton

export class RadioButton extends InputElement {
  public _form!: HTMLFormElement;

  getView(): HTMLElement {
    if (this._view) return this._view;

    this._form = document.createElement("form");
    this._form.className =
      "rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-3";

    const heading = document.createElement("h2");
    heading.textContent = this._displayName;
    heading.className = FORM_TITLE;
    this._form.appendChild(heading);

    Object.entries(this._questions).forEach(([_, value]) => {
      const label = document.createElement("label");
      label.className = "flex items-center gap-3 text-sm text-gray-700";

      const input = document.createElement("input");
      input.type = "radio";
      input.name = this._name;
      input.value = String(value);

      input.addEventListener("change", () => {
        if (input.checked) this._onClick(input);
      });

      label.append(input, document.createTextNode(String(value)));
      this._form.appendChild(label);
    });

    this._view = this._form;
    return this._view;
  }

  public getValue(): string | null {
    const selected = this._form.querySelector(
      "input:checked",
    ) as HTMLInputElement | null;
    return selected ? selected.value : null;
  }
}

// Checkbox

export class Checkbox extends InputElement {
  public _form!: HTMLFormElement;

  getView(): HTMLElement {
    if (this._view) return this._view;

    this._form = document.createElement("form");
    this._form.className = FORM_CONTAINER;

    const heading = document.createElement("h2");
    heading.textContent = this._displayName;
    heading.className = FORM_TITLE;
    this._form.appendChild(heading);

    Object.entries(this._questions).forEach(([key, value]) => {
      const label = document.createElement("label");
      label.className = LABEL;

      const input = document.createElement("input");
      input.type = "checkbox";
      input.name = key;

      input.addEventListener("change", () => {
        this._onClick(input);
      });

      label.append(input, document.createTextNode(String(value)));
      this._form.appendChild(label);
    });

    this._view = this._form;
    return this._view;
  }
}

// FileEntry

export class FileEntry extends InputElement {
  public _form!: HTMLFormElement;
  private _inputs: Record<string, HTMLInputElement> = {};

  getView(): HTMLElement {
    if (this._view) return this._view;

    this._form = document.createElement("form");
    this._form.className = FORM_CONTAINER;

    const heading = document.createElement("h2");
    heading.textContent = this._displayName;
    heading.className = FORM_TITLE;
    this._form.appendChild(heading);

    Object.entries(this._questions).forEach(([key, labelText]) => {
      const label = document.createElement("label");
      label.className = LABEL;

      const span = document.createElement("span");
      span.textContent = labelText;
      span.className = "font-medium";

      const input = document.createElement("input");
      input.type = "file";
      input.name = key;
      input.className = INPUT;

      // Show selected filename
      const fileNameDisplay = document.createElement("span");
      fileNameDisplay.className = "text-sm text-gray-500 mt-1";

      input.addEventListener("change", (e) => {
        const target = e.target as HTMLInputElement;

        if (!target.files || target.files.length === 0) {
          console.warn("No file selected");
          return;
        }

        const file = target.files[0]; 

        this._onClick?.call(this, file);
      });

      label.append(span, input, fileNameDisplay);
      this._form.appendChild(label);
      this._inputs[key] = input;
    });

    // Add Clear and Submit buttons
    const buttonRow = document.createElement("div");
    buttonRow.className = "flex justify-end gap-4 pt-4";

    const clearBtn = document.createElement("button");
    clearBtn.type = "button";
    clearBtn.textContent = "Clear";
    clearBtn.className = CLEAR;
    clearBtn.addEventListener("click", () => {
      this._form.reset();
      Object.values(this._inputs).forEach((input) => {
        const display = input.nextElementSibling as HTMLElement;
        if (display) display.textContent = "";
      });
    });

    const submit = document.createElement("button");
    submit.type = "button";
    submit.textContent = this._submitLabel ?? "Upload";
    submit.className = SUBMIT;
    submit.addEventListener("click", () => this._onClick());

    buttonRow.append(clearBtn, submit);
    this._form.appendChild(buttonRow);

    this._view = this._form;
    return this._view;
  }

  public getFile(key: string): File | undefined {
    return this._inputs[key]?.files?.[0];
  }
}

// Dropdown

export class Dropdown extends InputElement {
  public _form!: HTMLFormElement;

  getView(): HTMLElement {
    if (this._view) return this._view;

    this._form = document.createElement("form");
    this._form.className = FORM_CONTAINER;

    const heading = document.createElement("h2");
    heading.textContent = this._displayName;
    heading.className = FORM_TITLE;
    this._form.appendChild(heading);

    const select = document.createElement("select");
    select.className = INPUT;

    Object.entries(this._questions).forEach(([value, labelText]) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = labelText;
      select.appendChild(option);
    });

    this._form.appendChild(select);

    const submit = document.createElement("button");
    submit.type = "button";
    submit.textContent = this._submitLabel ?? "Submit";
    submit.className = SUBMIT;
    submit.addEventListener("click", () => {
      this._onClick(select.value);
    });

    this._form.appendChild(submit);

    this._view = this._form;
    return this._view;
  }
}
