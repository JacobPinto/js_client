import { TextEntryWithButton, Checkbox, RadioButton, FileEntry, Dropdown, SimpleButton } from './button.js';
import { ButtonBuilder } from './buttonBuilder.js';
import { Toolbar } from './toolbar.js';
import { Workbench } from './workbench.js';
import { Dimensions, ShaderType, VertexFormat, Color } from '../m/modelSimEngine.js';

export class ViewSimEngine {
  private workbench: Workbench;

  constructor() {
    // Use builder for all buttons
    const myButton1 = new ButtonBuilder()
      .setButtonType(TextEntryWithButton)
      .setButtonName('FluidProperties')
      .setButtonDisplayName('Fluid Properties')
      .setQuestions({ density: 'Density', viscosity: 'Viscosity' })
      .setOnClick(function(this: TextEntryWithButton) {
        const d = this._form.querySelector('input[name="density"]') as HTMLInputElement;
        const v = this._form.querySelector('input[name="viscosity"]') as HTMLInputElement;
        console.log('Density', d.value);
        console.log('Viscosity', v.value);
      })
      .build();

    const myButton2 = new ButtonBuilder()
      .setButtonType(Checkbox)
      .setButtonName('Dimensionality')
      .setButtonDisplayName('Dimensionality')
      .setQuestions({ $2d: '2D', $3d: '3D' })
      .setOnClick(function(this: Checkbox) {
        this._form.querySelectorAll('input').forEach(input => {
          if (input.type === 'checkbox') console.log(input.name, input.checked);
        });
      })
      .build();

    const myButton3 = new ButtonBuilder()
      .setButtonType(RadioButton)
      .setButtonName('Dimensionality')
      .setButtonDisplayName('Dimensionality')
      .setQuestions({ d2: '2D', d3: '3D' })
      .setOnClick(function(this: RadioButton) {
        this._form.querySelectorAll('input').forEach(input => {
          if (input.type === 'radio') console.log(input.name, input.checked);
        });
      })
      .build();

    const myButton4 = new ButtonBuilder()
      .setButtonType(FileEntry)
      .setButtonName('Geometry')
      .setButtonDisplayName('Geometry')
      .setQuestions({ geometry: 'Target geometry' })
      .setOnClick(function(this: FileEntry) {
        console.log('File input triggered');
      })
      .build();

    const myButton5 = new ButtonBuilder()
      .setButtonType(Dropdown)
      .setButtonName('Course')
      .setButtonDisplayName('Course')
      .setQuestions({ MCA: 'Master of Applications', BCA: 'Bachelor of Applications', BSC: 'Bachelor of Science' })
      .setOnClick(function(this: Dropdown, selected?: string) {
        console.log('Selected option:', selected ?? this.getValue());
      })
      .build();

     const dimensionsButton = new ButtonBuilder()
      .setButtonType(RadioButton)
      .setButtonName("Dimensions")
      .setButtonDisplayName("Dimensions")
      .setQuestions({ d2: Dimensions.D2, d3: Dimensions.D3 })
      .setOnClick(function (this: RadioButton) {
        console.log("Selected dimension:", this.getValue() as Dimensions);
      })
      .build();

    const colorDropdown = new ButtonBuilder()
      .setButtonType(Dropdown)
      .setButtonName("Color")
      .setButtonDisplayName("Color")
      .setQuestions({
        red: Color.Red,
        blue: Color.Blue,
        green: Color.Green
      })
      .setOnClick(function (this: Dropdown, selected?: string) {
        console.log("Selected color:", selected ?? this.getValue());
      })
      .build();

    const shaderDropdown = new ButtonBuilder()
      .setButtonType(Dropdown)
      .setButtonName("ShaderType")
      .setButtonDisplayName("Shader Type")
      .setQuestions({
        flat: ShaderType.Flat,
        smooth: ShaderType.Smooth
      })
      .setOnClick(function (this: Dropdown, selected?: string) {
        console.log("Shader type:", selected ?? this.getValue());
      })
      .build();

    const vertexDropdown = new ButtonBuilder()
      .setButtonType(Dropdown)
      .setButtonName("VertexFormat")
      .setButtonDisplayName("Vertex Format")
      .setQuestions({
        list: VertexFormat.List,
        strip: VertexFormat.Strip,
        index: VertexFormat.Index
      })
      .setOnClick(function (this: Dropdown, selected?: string) {
        console.log("Vertex format:", selected ?? this.getValue());
      })
      .build();

    const simpleBtn = new ButtonBuilder()
      .setButtonType(SimpleButton)
      .setButtonName("Apply")
      .setButtonDisplayName("Apply")
      .setOnClick(function (this: SimpleButton, value?: string) {
        console.log("Simple button clicked:", value ?? this._name);
      })
      .build();

    // Create toolbars
    const toolbar1 = new Toolbar('basicInputs', [myButton1, myButton2]);
    toolbar1.getElement().classList.add('toolbar-horizontal');

    const toolbar2 = new Toolbar('fileToolsDropdown', [myButton3, myButton4, myButton5]);
    toolbar2.getElement().classList.add('toolbar-vertical');

    // small toolbar
    const smallToolbar = new Toolbar('Small Toolbar', [dimensionsButton, colorDropdown, vertexDropdown, shaderDropdown, simpleBtn]);

    // Create workbench
    this.workbench = new Workbench('mainWorkbench', [toolbar1, toolbar2, smallToolbar]);
  }

  render(): void {
    document.body.appendChild(this.workbench.getElement());
  }

  toggleWorkbench(isVisible: boolean): void {
  this.workbench.setVisibility(isVisible);
}

toggleToolbar(name: string, isVisible: boolean): void {
  this.workbench.setToolbarVisibility(name, isVisible);
}

}
