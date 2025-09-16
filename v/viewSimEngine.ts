import { Checkbox, TextEntryWithButton, FileEntry, RadioButton, Dropdown } from './button.js'

export class ViewSimEngine {
  private listOfFormWithButtons: TextEntryWithButton[] = [];
  private listOfCheckboxes: Checkbox[] = [];
  private listOfRadioButtons: RadioButton[] = [];
  private listofFileEntries: FileEntry[] = [];
  private listofDropdowns: Dropdown[] = [];

  constructor() {
    
    // TextEntryWithButton
   
    let myButton1: TextEntryWithButton = new TextEntryWithButton({
      name: 'FluidProperties',
      displayName: 'Fluid Properties',
      questions: { density: 'Density', viscosity: 'Viscosity' },
      contextObj: { '': null },
      onClick: function (this: TextEntryWithButton) {
        const densityInput = this._form.querySelector('input[name="density"]') as HTMLInputElement;
        const viscosityInput = this._form.querySelector('input[name="viscosity"]') as HTMLInputElement;

        console.log("Density", densityInput.value);
        console.log("Viscosity", viscosityInput.value);
      }
    });

    
    // Checkbox
   
    let myButton2: Checkbox = new Checkbox({
      name: 'Dimensionality',
      displayName: 'Dimensionality',
      questions: { $2d: '2D', $3d: '3D' },
      contextObj: { '': null },
      onClick: function (this: Checkbox) {
        const inputs = this._form.querySelectorAll('input');
        inputs.forEach(input => {
          if (input.type === 'checkbox') {
            console.log(input.name, input.checked);
          }
        });
        console.log('clicked a checkbox');
      }
    });

    
    // RadioButton
    
    let myButton3: RadioButton = new RadioButton({
      name: 'Dimensionality',
      displayName: 'Dimensionality',
      questions: { d2: '2D', d3: '3D' },
      contextObj: { '': null },
      onClick: function (this: RadioButton) {
        const inputs = this._form.querySelectorAll('input');
        inputs.forEach(input => {
          if (input.type === 'radio' && Object.keys(this._questions).includes(input.value)) {
            console.log(input.name, input.checked);
          }
        });
        console.log('clicked a radio button');
      }
    });

    
    // FileEntry
    
    let myButton4: FileEntry = new FileEntry({
      name: 'Geometry',
      displayName: 'Geometry',
      questions: { geometry: 'Target geometry' },
      contextObj: { '': null },
      onClick: function (this: FileEntry) {
        console.log("File input triggered");
      }
    });

    // Dropdown

    let myButton5: Dropdown = new Dropdown({
      name: 'Course',
      displayName: 'Course',
      questions: { MCA: 'Master of Applications', BCA: 'Bachelor of Applications ', BSC: 'Bachelor of Scienece' },
      contextObj: { '': null },
      onClick: function (this: Dropdown, selected?: string) {
        console.log("Selected option:", selected ?? this.getValue());
      }


    })

    // Push created elements into lists
    this.listOfFormWithButtons.push(myButton1);
    this.listOfCheckboxes.push(myButton2);
    this.listOfRadioButtons.push(myButton3);
    this.listofFileEntries.push(myButton4);
    this.listofDropdowns.push(myButton5);
  }

  getThis(): HTMLFormElement {
    return this.listOfRadioButtons[0].render();
  }

  render(): void {
    // investigated if this way will work for buttons and toolbars
    let el1: HTMLFormElement = this.listofDropdowns[0].render();
    document.body.appendChild(el1);
  }
}



console.log("Hello World!");
