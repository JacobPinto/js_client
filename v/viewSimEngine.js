import { Checkbox, TextEntryWithButton, FileEntry, RadioButton } from './button.js';
export class ViewSimEngine {
    constructor() {
        this.listOfFormWithButtons = [];
        this.listOfCheckboxes = [];
        this.listOfRadioButtons = [];
        this.listofFileEntries = [];
        let myButton1 = new TextEntryWithButton('Fluid Properties', 'FluidProperties', { density: 'Density', viscosity: 'Viscosity' }, { '': null }, function () {
            const densityInput = this._form.querySelector('input[name="density"]');
            const viscosityInput = this._form.querySelector('input[name="viscosity"]');
            /*this._contextObj.instance['fluidProperties'] = {
              density: Number(densityInput.value),
              viscosity: Number(viscosityInput.value)
            };*/
            console.log("Denssity", densityInput.value);
        });
        let myButton2 = new Checkbox('Dimensionality', 'Dimensionality', { $2d: '2D', $3d: '3D' }, { '': null }, function () {
            const inputs = this._form.querySelectorAll('input');
            inputs.forEach(input => {
                // For checkboxes:
                if (input.type === 'checkbox') {
                    console.log(input.name, input.checked);
                }
            });
            console.log('clicked a checkbox');
        });
        let myButton3 = new RadioButton('Dimensionality', 'Dimensionality', { d2: '2D', d3: '3D' }, { '': null }, function () {
            const inputs = this._form.querySelectorAll('input');
            inputs.forEach(input => {
                // For checkboxes:
                if (input.type === 'radio' && Object.keys(this._questions).includes(input.value)) {
                    console.log(input.name, input.checked);
                }
            });
            console.log('clicked a checkbox');
        });
        let myButton4 = new FileEntry('Geometry', 'Geometry', { geometry: 'Target geometry' }, { '': null }, function () {
            //const densityInput = this._form.querySelector('input[name="density"]') as HTMLInputElement;
            //const viscosityInput = this._form.querySelector('input[name="viscosity"]') as HTMLInputElement;
            /*this._contextObj.instance['fluidProperties'] = {
              density: Number(densityInput.value),
              viscosity: Number(viscosityInput.value)
            };*/
            //console.log("Denssity", densityInput.value);
        });
        this.listOfFormWithButtons.push(myButton1);
        this.listOfCheckboxes.push(myButton2);
        this.listOfRadioButtons.push(myButton3);
        this.listofFileEntries.push(myButton4);
    }
    getThis() {
        return this.listOfRadioButtons[0].render();
    }
    render() {
        let el1 = this.listOfRadioButtons[0].render();
        document.body.appendChild(el1);
    }
}
/*
var myButton: FormWithButton = new FormWithButton(
  'button1',
  'button2',
  { age: '25', name: 'john' },
  Man,
  function (this: FormWithButton) {
    const ageInput = this._form.querySelector('input[name="age"]') as HTMLInputElement;
    this._contextObj.instance['hi'] = new Man(Number(ageInput.value));
  }
);*/
console.log("Hello World!");
//# sourceMappingURL=viewSimEngine.js.map