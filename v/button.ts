import { ControllerSimEngine } from "../c/controllerSimEngine";
import { FormElementParam } from "./buttonParams";
import { Observer, Dimensions } from "../m/modelSimEngine";


export class InputElement {
  protected _type: string = 'InputElement';
  protected _name: string;
  protected _id: string;
  protected _displayName: string;
  protected _questions: { [key: string]: string };
  protected _contextObj: { [key: string]: any };
  protected _onClick: Function;
  protected _controller: ControllerSimEngine; 

  protected _getId(): string {
    return this._type + '_' + this._name;
  }

  constructor( params: FormElementParam, _controller: ControllerSimEngine) {
    this._name = params.name;
    this._id = this._getId();
    this._displayName = params.displayName;
    this._questions = params.questions;
    this._contextObj = params.contextObj ?? {};   // default empty object
    this._onClick = (params.onClick ?? (() => {})).bind(this);
    this._controller = _controller;
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

  protected _type: string = 'TextEntryWithButton';
  public _form: HTMLFormElement;
  private _button: HTMLButtonElement;

  constructor( params: FormElementParam, _controller: ControllerSimEngine) {
    super( params, _controller);

    this._form = document.createElement('form');
    this._button = document.createElement('button');
  }

  render(): HTMLFormElement {
    this._form.id = this._id;
    this._form.name = this._id;
    this._form.classList.add(this._type); // css

    // Add form name/title at the top
    const heading = document.createElement('h2');
    heading.textContent = this._displayName;
    heading.className = 'form-title';
    this._form.appendChild(heading);

    Object.entries(this._questions).forEach(([key, value]) => {
      let label: HTMLLabelElement = document.createElement('label');
      let span: HTMLSpanElement = document.createElement('span');

      span.textContent = value;
      label.appendChild(span);

      const input = document.createElement('input');
      input.type = 'text';
      input.name = key;

      label.appendChild(input);
      this._form.appendChild(label);
      this._form.appendChild(document.createElement('br'));
    });

    this._button.name = 'submit';
    this._button.textContent = this._displayName;
    this._button.onclick = this._onClick as EventListener;
    this._form.appendChild(this._button);

    return this._form;
  }
}


export class FileEntry extends InputElement {

  protected _type: string = 'FileEntryWithButton';
  public _form: HTMLFormElement;

  constructor( params: FormElementParam, _controller: ControllerSimEngine) {
    super( params, _controller );

    this._form = document.createElement('form');
  }

  render(): HTMLFormElement {
    this._form.id = this._id;
    this._form.name = this._id;
    this._form.classList.add(this._type); // css

    // Add form name/title at the top
    const heading = document.createElement('h2');
    heading.textContent = this._displayName;
    heading.className = 'form-title';
    this._form.appendChild(heading);

    Object.entries(this._questions).forEach(([key, value]) => {
      let label: HTMLLabelElement = document.createElement('label');
      let span: HTMLSpanElement = document.createElement('span');

      span.textContent = value;
      label.appendChild(span);

      const input = document.createElement('input');
      input.type = 'file';
      input.name = key;

      // Add event listener for file selection
      input.addEventListener('change', (event) => {
        const target = event.target as HTMLInputElement;
        // Files selected by the user
        const files = target.files;
        console.log('File input changed:', files);
        this._onClick(target); // Call your handler if needed
      });

      label.appendChild(input);
      this._form.appendChild(label);
      this._form.appendChild(document.createElement('br'));
    });

    return this._form;
  }
}








/* Checkbox allows multiple options to be selected simultaneously.
 * For unique selection, use a RadioButton */
export class Checkbox extends InputElement {

  protected _type: string = 'Checkbox';
  public _form: HTMLFormElement;

  constructor( params: FormElementParam, _controller: ControllerSimEngine) {
    super( params, _controller );

    this._form = document.createElement('form');
  }


  render(): HTMLFormElement {
    this._form.id = this._id;
    this._form.name = this._id;
    this._form.classList.add(this._type); // css

    // Add form name/title at the top
    const heading = document.createElement('h2');
    heading.textContent = this._displayName;
    heading.className = 'form-title';
    this._form.appendChild(heading);

    Object.entries(this._questions).forEach(([key, value]) => {
      let label: HTMLLabelElement = document.createElement('label');
      let span: HTMLSpanElement = document.createElement('span');

      span.textContent = value;
      label.appendChild(span);

      const input = document.createElement('input');
      input.type = 'checkbox';
      input.name = key;

      // Add event listener to the checkbox
      input.addEventListener('change', (event) => {
        const target = event.target as HTMLInputElement;
        console.log(`${target.name} checked:`, target.checked);
        this._onClick(target);
      });

      label.appendChild(input);
      this._form.appendChild(label);
      this._form.appendChild(document.createElement('br'));
    });

    return this._form;
  }
}

/* Radio buttons allow for a unique selection among choices */
export class RadioButton extends InputElement implements Observer {

  protected _type: string = 'RadioButton';
  public _form: HTMLFormElement;

  constructor( params: FormElementParam, _controller: ControllerSimEngine) {
    super( params, _controller);

    this._form = document.createElement('form');
  }

  // update fun from model

  render(): HTMLFormElement {
    this._form.id = this._id;
    this._form.name = this._id;
    this._form.classList.add(this._type); // css

    // Add form name/title at the top
    const heading = document.createElement('h2');
    heading.textContent = this._displayName;
    heading.className = 'form-title';
    this._form.appendChild(heading);

    // Use the same name for all radios in the group for unique selection
    Object.entries(this._questions).forEach(([key, value]) => {
      let label: HTMLLabelElement = document.createElement('label');
      let span: HTMLSpanElement = document.createElement('span');

      span.textContent = value;
      label.appendChild(span);

      const input = document.createElement('input');
      input.type = 'radio';
      input.name = this._name; // group name
      input.value = key;

      input.addEventListener('change', (event) => {
        const target = event.target as HTMLInputElement;
        if (target.checked) {
          const selected = target.value as Dimensions;
          this._controller.onClickDimensions(selected); // ✅ Update model
        }
        this._onClick(target);
      });

      label.appendChild(input);
      this._form.appendChild(label);
      this._form.appendChild(document.createElement('br'));
    });

    return this._form;
  }
  public getValue(): string | null {
  const selected = this._form.querySelector("input:checked") as HTMLInputElement | null;
  return selected ? selected.value : null;
}
  public update(dimension: Dimensions): void {
    console.log("RadioButton notified of dimension change:", dimension);
    const radio = this._form.querySelector(`input[value="${dimension}"]`) as HTMLInputElement;
    if (radio) radio.checked = true; // automatically update UI
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
    this._button = document.createElement('button');
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
      option.value = value;
      option.textContent = labelText;
      this._select.appendChild(option);
    });

    this._form.appendChild(this._select);

    // Submit button
    
    this._button.name = 'Submit';
    this._button.textContent = 'Submit';
    
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