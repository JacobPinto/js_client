// interface formelementparams

 
class InputElement {
  protected _type: string = 'InputElement';
  protected _name: string;
  protected _id: string;
  protected _displayName: string;
  protected _questions: { [key: string]: string };
  protected _contextObj: { [key: string]: any };
  protected _onClick: Function;

  protected _getId(): string {
    return this._type + '_' + this._name;
  }

  constructor(name: string, displayName: string, questions: { [key: string]: string },
              contextObj: { [key: string]: any }, onClick: Function = () => { ; }) {
    this._name = name;
    this._id = this._getId();
    this._displayName = displayName;
    this._questions = questions;
    this._contextObj = contextObj;
    this._onClick = onClick.bind(this);
  }
}


export class TextEntryWithButton extends InputElement {

  protected _type: string = 'TextEntryWithButton';
  public _form: HTMLFormElement;
  private _button: HTMLButtonElement;

  constructor(name: string, displayName: string, questions: { [key: string]: string },
              contextObj: { [key: string]: any }, onClick: Function = () => { ; }) {
    super(name, displayName, questions, contextObj, onClick);

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

  constructor(name: string, displayName: string, questions: { [key: string]: string },
    contextObj: { [key: string]: any }, onClick: Function = () => { ; }) {
    super(name, displayName, questions, contextObj, onClick);

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

  constructor(name: string, displayName: string, questions: { [key: string]: string },
    contextObj: { [key: string]: any }, onClick: Function = () => { ; }) {
    super(name, displayName, questions, contextObj, onClick);

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
export class RadioButton extends InputElement {

  protected _type: string = 'RadioButton';
  public _form: HTMLFormElement;

  constructor(name: string, displayName: string, questions: { [key: string]: string },
    contextObj: { [key: string]: any }, onClick: Function = () => { ; }) {
    super(name, displayName, questions, contextObj, onClick);

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

      // Add event listener to the radio button
      input.addEventListener('change', (event) => {
        const target = event.target as HTMLInputElement;
        console.log(`${target.value} selected:`, target.checked);
        this._onClick(target);
      });

      label.appendChild(input);
      this._form.appendChild(label);
      this._form.appendChild(document.createElement('br'));
    });

    return this._form;
  }
}



