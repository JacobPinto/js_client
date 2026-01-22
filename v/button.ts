import { ControllerSimEngine } from "../c/controllerSimEngine.js";
import { FormElementParam } from "./buttonParams.js";
import { Dimensions } from "../m/modelEnums.js";

export class InputElement {
  protected _type: string = "InputElement";
  protected _name: string;
  protected _id: string;
  protected _displayName: string;
  protected _questions: { [key: string]: string };
  protected _contextObj: { [key: string]: any };
  protected _onClick: Function;
  protected _update?: Function; // optional update if this view element is an observer
  public _controller: ControllerSimEngine;

  protected _getId(): string {
    return this._type + "_" + this._name;
  }

  constructor(params: FormElementParam, controller: ControllerSimEngine) {
    this._name = params.name;
    this._id = this._getId();
    this._displayName = params.displayName;
    this._questions = params.questions;
    this._contextObj = params.contextObj ?? {}; // default empty object
    this._onClick = (params.onClick ?? (() => {})).bind(this);
    this._update = params.update?.bind(this);
    this._controller = controller;
  }

  update(value: any): void {
    this._update?.(value);
  }
}

export class SimpleButton extends InputElement {
  protected _type: string = "SimpleButton";
  public _button: HTMLButtonElement;

  constructor(params: FormElementParam, _controller: ControllerSimEngine) {
    super(params, _controller);
    this._button = document.createElement("button");
  }

  render(): HTMLButtonElement {
    this._button.id = this._id;
    this._button.name = this._id;
    this._button.type = "button";
    this._button.classList.add(this._type);
    this._button.textContent = this._displayName;

    this._button.addEventListener("click", (e) => {
      e.preventDefault();
      this._onClick(this._name);
    });

    return this._button;
  }
}

export class TextEntryWithButton extends InputElement {
  protected _type: string = "TextEntryWithButton";
  public _form: HTMLFormElement;
  private _button: HTMLButtonElement;

  constructor(params: FormElementParam, _controller: ControllerSimEngine) {
    super(params, _controller);

    this._form = document.createElement("form");
    this._button = document.createElement("button");
  }

  render(): HTMLFormElement {
    this._form.id = this._id;
    this._form.name = this._id;
    this._form.classList.add(this._type); // css

    // Add form name/title at the top
    const heading = document.createElement("h2");
    heading.textContent = this._displayName;
    heading.className = "form-title";
    this._form.appendChild(heading);

    Object.entries(this._questions).forEach(([key, value]) => {
      const label: HTMLLabelElement = document.createElement("label");
      const span: HTMLSpanElement = document.createElement("span");

      span.textContent = String(value);
      label.appendChild(span);

      const input = document.createElement("input");
      input.type = "text";
      input.name = key;

      input.addEventListener("input", () => {
        this._update?.();
      });

      label.appendChild(input);
      this._form.appendChild(label);
      this._form.appendChild(document.createElement("br"));
    });

    this._button.name = "submit";
    this._button.textContent = this._displayName;
    this._button.onclick = this._onClick as EventListener;
    this._form.appendChild(this._button);

    return this._form;
  }

  public getFieldValue(fieldName: string): string | undefined {
    const input = this._form.querySelector(
      `input[name="${fieldName}"]`,
    ) as HTMLInputElement;
    return input ? input.value : undefined;
  }

}

export class TextEntryWithDropdownAndButton extends InputElement {
  protected _type: string = "TextEntryWithDropdownAndButton";

  public _form: HTMLFormElement;
  private _textInput!: HTMLInputElement;
  private _select!: HTMLSelectElement;
  private _button: HTMLButtonElement;

  constructor(params: FormElementParam, controller: ControllerSimEngine) {
    super(params, controller);
    this._form = document.createElement("form");
    this._button = document.createElement("button");
  }

  render(): HTMLFormElement {
    this._form.id = this._id;
    this._form.name = this._id;

    // ---- Title ----
    const heading = document.createElement("h2");
    heading.textContent = this._displayName;
    this._form.appendChild(heading);

    /* ---------------- Text Input ---------------- */

    const textLabel = document.createElement("label");
    const textSpan = document.createElement("span");
    textSpan.textContent = this._questions.textLabel ?? "Value";
    textLabel.appendChild(textSpan);

    this._textInput = document.createElement("input");
    this._textInput.type = "text";
    this._textInput.name = "textValue";

    this._textInput.addEventListener("input", () => {
      this._update?.();
    });

    textLabel.appendChild(this._textInput);
    this._form.appendChild(textLabel);

    /* ---------------- Dropdown ---------------- */

    const selectLabel = document.createElement("label");
    const selectSpan = document.createElement("span");
    selectSpan.textContent =
      this._questions.dropdownLabel ?? "Select Option";
    selectLabel.appendChild(selectSpan);

    this._select = document.createElement("select");
    this._select.name = "dropdownValue";

    const options = this._contextObj.options ?? {};
    Object.entries(options).forEach(([value, label]) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = String(label);
      this._select.appendChild(option);
    });

    this._select.addEventListener("change", () => {
      this._update?.();
    });

    selectLabel.appendChild(this._select);
    this._form.appendChild(selectLabel);

    /* ---------------- Submit Button ---------------- */

    this._button.type = "submit";
    this._button.textContent = this._displayName;

    this._button.addEventListener("click", (e) => {
      e.preventDefault();
      this._onClick(this);
    });

    this._form.appendChild(this._button);

    return this._form;
  }

  /* ---------------- Public getters ---------------- */

  getTextValue(): string {
    return this._textInput.value;
  }

  getDropdownValue(): string {
    return this._select.value;
  }

  public getFieldValue(fieldName: string): string | undefined {
    if (fieldName === "textValue") {
      return this._textInput.value;
    } else if (fieldName === "dropdownValue") {
      return this._select.value;
    }
    return undefined;
  }
}


export class FileEntry extends InputElement {
  protected _type: string = "FileEntryWithButton";
  public _form: HTMLFormElement;

  constructor(params: FormElementParam, _controller: ControllerSimEngine) {
    super(params, _controller);

    this._form = document.createElement("form");
  }

  render(): HTMLFormElement {
    this._form.id = this._id;
    this._form.name = this._id;
    this._form.classList.add(this._type); // css

    // Add form name/title at the top
    const heading = document.createElement("h2");
    heading.textContent = this._displayName;
    heading.className = "form-title";
    this._form.appendChild(heading);

    Object.entries(this._questions).forEach(([key, value]) => {
      const label: HTMLLabelElement = document.createElement("label");
      const span: HTMLSpanElement = document.createElement("span");

      span.textContent = String(value);
      label.appendChild(span);

      const input = document.createElement("input");
      input.type = "file";
      input.name = key;

      // Add event listener for file selection
      input.addEventListener("change", (event) => {
        const target = event.target as HTMLInputElement;
        // Files selected by the user
        const files = target.files;
        console.log("File input changed:", files);
        this._onClick(target); // Call your handler if needed
      });

      label.appendChild(input);
      this._form.appendChild(label);
      this._form.appendChild(document.createElement("br"));
    });

    return this._form;
  }
}

/* Checkbox allows multiple options to be selected simultaneously.
 * For unique selection, use a RadioButton */
export class Checkbox extends InputElement {
  protected _type: string = "Checkbox";
  public _form: HTMLFormElement;

  constructor(params: FormElementParam, _controller: ControllerSimEngine) {
    super(params, _controller);

    this._form = document.createElement("form");
  }

  render(): HTMLFormElement {
    this._form.id = this._id;
    this._form.name = this._id;
    this._form.classList.add(this._type); // css

    // Add form name/title at the top
    const heading = document.createElement("h2");
    heading.textContent = this._displayName;
    heading.className = "form-title";
    this._form.appendChild(heading);

    Object.entries(this._questions).forEach(([key, value]) => {
      const label: HTMLLabelElement = document.createElement("label");
      const span: HTMLSpanElement = document.createElement("span");

      span.textContent = String(value);
      label.appendChild(span);

      const input = document.createElement("input");
      input.type = "checkbox";
      input.name = key;

      // Add event listener to the checkbox
      input.addEventListener("change", (event) => {
        const target = event.target as HTMLInputElement;
        console.log(`${target.name} checked:`, target.checked);
        this._onClick(target);
      });

      label.appendChild(input);
      this._form.appendChild(label);
      this._form.appendChild(document.createElement("br"));
    });

    return this._form;
  }
}

/* Radio buttons allow for a unique selection among choices */
export class RadioButton extends InputElement {
  protected _type: string = "RadioButton";
  public _form: HTMLFormElement;

  constructor(params: FormElementParam, _controller: ControllerSimEngine) {
    super(params, _controller);

    this._form = document.createElement("form");
  }

  // update func from model

  render(): HTMLFormElement {
    this._form.id = this._id;
    this._form.name = this._id;
    this._form.classList.add(this._type); // css

    // Add form name/title at the top
    const heading = document.createElement("h2");
    heading.textContent = this._displayName;
    heading.className = "form-title";
    this._form.appendChild(heading);

    // Use the same name for all radios in the group for unique selection
    Object.entries(this._questions).forEach(([_key, value]) => {
      const label: HTMLLabelElement = document.createElement("label");
      const span: HTMLSpanElement = document.createElement("span");

      span.textContent = String(value);
      label.appendChild(span);

      const input = document.createElement("input");
      input.type = "radio";
      input.name = this._name; // group name
      input.value = String(value);

      input.addEventListener("change", (event) => {
        const target = event.target as HTMLInputElement;
        if (target.checked) {
          this._onClick(target);
        }
      });

      label.appendChild(input);
      this._form.appendChild(label);
      this._form.appendChild(document.createElement("br"));
    });

    return this._form;
  }

  // Get current selected value

  public getValue(): string | null {
    const selected = this._form.querySelector(
      "input:checked",
    ) as HTMLInputElement | null;
    return selected ? selected.value : null;
  }
}
// Dropdown list

export class Dropdown extends InputElement {
  protected _type: string = "Dropdown";
  public _form: HTMLFormElement;
  private _button: HTMLButtonElement;
  private _select: HTMLSelectElement;

  constructor(params: FormElementParam, _controller: ControllerSimEngine) {
    super(params, _controller);
    this._form = document.createElement("form");
    this._button = document.createElement("button");
    this._select = document.createElement("select");
  }

  render(): HTMLFormElement {
    this._form.id = this._id;
    this._form.name = this._id;
    this._form.classList.add(this._type);

    // Add form title
    const heading = document.createElement("h2");
    heading.textContent = this._displayName;
    heading.className = "form-title";
    this._form.appendChild(heading);

    // Dropdown
    this._select = document.createElement("select");
    this._select.name = this._name;

    Object.entries(this._questions).forEach(([value, labelText]) => {
      const option = document.createElement("option");
      option.value = String(value);
      option.textContent = String(labelText);
      this._select.appendChild(option);
    });

    this._form.appendChild(this._select);

    // Submit button

    this._button.name = "Submit";
    this._button.textContent = "Submit";

    this._button.addEventListener("click", () => {
      this._onClick(this._select.value);
    });

    this._form.appendChild(this._button);

    return this._form;
  }

  getValue(): string {
    return this._select.value;
  }
}
